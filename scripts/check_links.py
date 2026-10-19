#!/usr/bin/env python3
"""Recheck web access. Findings require human review and do not change program status."""
import argparse,concurrent.futures,datetime,json,urllib.request,urllib.error
from pathlib import Path
ROOT=Path(__file__).resolve().parents[1]
p=argparse.ArgumentParser(description=__doc__);p.add_argument('--limit',type=int,default=0);p.add_argument('--workers',type=int,default=4);p.add_argument('--output',type=Path,default=ROOT/'data/link-check-results.json');args=p.parse_args()
rows=json.loads((ROOT/'data/resources.json').read_text()); rows=rows[:args.limit] if args.limit else rows

def check(r):
 out={'id':r['id'],'url':r['url'],'checked':datetime.datetime.now(datetime.timezone.utc).isoformat()}
 try:
  req=urllib.request.Request(r['url'],headers={'User-Agent':'ResourceEcosystemLinkReview/1.0 (public resource directory)'})
  with urllib.request.urlopen(req,timeout=25) as response:
   sample=response.read(65536).decode('utf-8',errors='ignore').lower();out.update(http_status=response.status,final_url=response.url)
   challenge=any(t in sample for t in ['checking your browser','verify you are human','just a moment...','domain is for sale','this domain is for sale'])
   out['finding']='Review content or access challenge' if challenge else 'Response received; review destination content'
 except urllib.error.HTTPError as e:
  out.update(http_status=e.code,final_url=e.url,finding='Unavailable response; recheck before removing' if e.code in [404,410] else 'Access restricted or server error; manual review required')
 except Exception as e:out.update(finding='Retrieval failed; manual review required',error=type(e).__name__+': '+str(e))
 return out
with concurrent.futures.ThreadPoolExecutor(max_workers=max(1,min(args.workers,8))) as pool:results=list(pool.map(check,rows))
args.output.parent.mkdir(parents=True,exist_ok=True);args.output.write_text(json.dumps(results,indent=2)+'\n')
print(f'Wrote {len(results)} checks to {args.output}. Review redirects and content; do not infer program closure from access errors.')
