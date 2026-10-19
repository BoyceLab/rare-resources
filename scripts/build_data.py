#!/usr/bin/env python3
"""Rebuild CSV exports, counts and the browser bundle from JSON. No dependencies."""
import csv,json,re
from pathlib import Path
ROOT=Path(__file__).resolve().parents[1]
files=[('resources','resources.json'),('registry','registry-comparison.json'),('literature','literature.json'),('metadata','metadata.json')]
payload={name:json.loads((ROOT/'data'/filename).read_text()) for name,filename in files}
m=payload['metadata'];m.update(resource_count=len(payload['resources']),registry_count=len(payload['registry']),literature_count=len(payload['literature']),categories=sorted({c for r in payload['resources'] for c in r['categories']}))
(ROOT/'data/metadata.json').write_text(json.dumps(m,indent=2)+'\n')
for name,filename in files[:-1]:
 rows=payload[name]
 fields=list(dict.fromkeys(k for r in rows for k in r))
 with (ROOT/'data'/filename.replace('.json','.csv')).open('w',newline='') as f:
  w=csv.DictWriter(f,fieldnames=fields);w.writeheader()
  for r in rows:
   values={k:('; '.join(str(s) for s in v) if isinstance(v,list) else json.dumps(v) if isinstance(v,dict) else v) for k,v in r.items()}
   for k,v in values.items():
    if isinstance(v,str) and re.match(r'^[=+\-@\t\r]',v):values[k]="'"+v
   w.writerow(values)
(ROOT/'assets/data.js').write_text('window.RESOURCE_DATA = '+json.dumps(payload,ensure_ascii=False,separators=(',',':')).replace('<','\\u003c')+';\n')
print('Built CSV exports, metadata and assets/data.js')
