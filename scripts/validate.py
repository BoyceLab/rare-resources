#!/usr/bin/env python3
"""Check the public data set and static-site references without network requests."""
import json,re
from pathlib import Path
from urllib.parse import urlsplit,unquote
ROOT=Path(__file__).resolve().parents[1]
resources=json.loads((ROOT/'data/resources.json').read_text()); reading=json.loads((ROOT/'data/literature.json').read_text());registry=json.loads((ROOT/'data/registry-comparison.json').read_text());meta=json.loads((ROOT/'data/metadata.json').read_text())
for rows in [resources,reading,registry]:
 assert len({r['id'] for r in rows})==len(rows),'Duplicate IDs'
 assert all(urlsplit(r['url']).scheme in ['http','https'] for r in rows),'Invalid URL'
 assert all(r.get('title') for r in rows),'Missing title'
assert all(r['scope'] in meta['scopes'] for r in resources),'Unknown scope'
assert all(r['categories'] and all(c in meta['categories'] for c in r['categories']) for r in resources),'Invalid category'
assert all(r['link_status'] in ['Content retrieved','Indexed content found','Access restricted','Unverified'] for r in resources),'Unknown link status'
assert all(r['program_status'] and r['checked'] and r['evidence_url'] and r['review_level'] for r in resources),'Missing review fields'
assert meta['resource_count']==len(resources) and meta['literature_count']==len(reading) and meta['registry_count']==len(registry),'Counts differ'
for page in ROOT.glob('*.html'):
 for v in re.findall(r'(?:href|src)="([^"]+)"',page.read_text()):
  if v.startswith(('#','http:','https:','mailto:','data:')):continue
  assert (page.parent/unquote(v.split('#')[0].split('?')[0])).exists(),f'Missing file: {v}'
assert (ROOT/'assets/data.js').exists(),'Run build_data.py'
print(f'Validated {len(resources)} resources, {len(registry)} registry options and {len(reading)} readings.')
