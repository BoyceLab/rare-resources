'use strict';
(() => {
 const DATA=window.RESOURCE_DATA;
 const $=id=>document.getElementById(id);
 const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 const safe=u=>/^https?:\/\//i.test(String(u||''))?u:'';
 const a=(u,label)=>safe(u)?`<a href="${esc(u)}" target="_blank" rel="noopener noreferrer">${esc(label)}</a>`:esc(label);
 const join=v=>Array.isArray(v)?v.join('; '):String(v??'');
 const norm=v=>String(v).normalize('NFKD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]+/g,'');
 let state={mode:'resources',search:'',filters:{},page:1}, printing=false;
 const perPage=20;
 const activity=r=>r.activity_group||'Activity not independently confirmed';
 const region=r=>r.region||'Confirm service area';
 const defs={
  resources:[['scope','Scope',r=>[r.scope]],['category','Category',r=>r.categories],['condition','Condition',r=>r.conditions],['region','Location',r=>[region(r)]],['activity','Program evidence',r=>[activity(r)]],['link','Website access',r=>[r.link_status]]],
  registry:[['role','Type of option',r=>[r.role]],['commercial','Provider model',r=>[r.commercial?'Commercial':'Noncommercial / public']],['service','Listed service',r=>r.services]],
  literature:[['scope','Scope',r=>[r.scope]],['type','Publication type',r=>[r.type]],['theme','Theme',r=>[r.theme]]]
 };
 const source=()=>DATA[state.mode];
 const sorted=vals=>[...new Set(vals.filter(Boolean))].sort((a,b)=>a.localeCompare(b));
 function fields(){
  $('filter-fields').innerHTML=defs[state.mode].map(([key,label,get])=>`<div><label for="f-${key}">${esc(label)}</label><select id="f-${key}" data-filter="${key}"><option value="">All ${esc(label.toLowerCase())}</option>${sorted(source().flatMap(r=>get(r)||[])).map(v=>`<option value="${esc(v)}"${state.filters[key]===v?' selected':''}>${esc(v)}</option>`).join('')}</select></div>`).join('');
  document.querySelectorAll('[data-filter]').forEach(el=>el.addEventListener('change',()=>{state.filters[el.dataset.filter]=el.value;state.page=1;render();}));
 }
 function filtered(){
  const terms=state.search.trim().split(/\s+/).filter(Boolean).map(norm);
  return source().filter(r=>{
   const hay=norm(JSON.stringify(r));
   return terms.every(t=>hay.includes(t))&&defs[state.mode].every(([k,l,get])=>!state.filters[k]||(get(r)||[]).includes(state.filters[k]));
  });
 }
 function metadata(pairs){return `<dl class="metadata">${pairs.filter(([k,v])=>v).map(([k,v])=>`<dt>${esc(k)}</dt><dd>${v}</dd>`).join('')}</dl>`;}
 function resource(r){
  return `<article class="card"><div class="topline"><span class="scope">${esc(r.scope)}</span><span class="availability ${r.link_status==='Content retrieved'?'':'unverified'}">${esc(r.link_status)}</span></div><h3>${a(r.url,r.title)}</h3><p>${esc(r.description)}</p><div class="tags">${r.categories.map(t=>`<span class="tag">${esc(t)}</span>`).join('')}${(r.conditions||[]).map(t=>`<span class="tag condition">${esc(t)}</span>`).join('')}</div><p class="program"><strong>Program:</strong> ${esc(r.program_status)}</p>${r.access_notes?`<p class="note">${esc(r.access_notes)}</p>`:''}<details${printing?' open':''}><summary>Location, access and review evidence</summary>${metadata([['Location',esc(r.geography)],['For',esc(join(r.audience))],['Provider type',esc(r.organization_type)],['What it offers',esc(join(r.functions))],['Review',esc(r.review_level)],['Checked',esc(r.checked)],['Evidence',a(r.evidence_url,'Official page or review evidence')],['Evidence note',esc(r.evidence_note)],['Website',a(r.url,r.url)]])}</details></article>`;
 }
 function registry(r){
  return `<article class="card registry-card"><div class="topline"><span class="scope">${esc(r.role)}</span><span>${r.commercial?'Commercial provider':'Noncommercial / public resource'}</span></div><h3>${a(r.url,r.title)}</h3><div class="tags">${r.services.map(t=>`<span class="tag">${esc(t)}</span>`).join('')}</div>${metadata([['Best suited to',esc(r.eligibility)],['Participation',esc(r.participant_entry)],['Health records',esc(r.ehr_connection)],['Costs',esc(r.pricing_note)]])}<details${printing?' open':''}><summary>Provider and evidence</summary>${metadata([['Provider',esc(r.organization_type)],['Program status',esc(r.program_status)],['Website access',esc(r.link_status)],['Checked',esc(r.checked)],['Evidence',a(r.evidence_url,'Official provider information')],['Website',a(r.url,r.url)]])}<p class="provisional">Capabilities are provider descriptions; contracts, implementation and eligibility require confirmation.</p></details></article>`;
 }
 function literature(r){
  return `<article class="card"><div class="topline"><span class="scope">${esc(r.type)}</span><span>${esc(r.year)}</span></div><h3>${a(r.url,r.title)}</h3><div class="tags"><span class="tag">${esc(r.theme)}</span><span class="tag">${esc(r.scope)}</span></div><p>${esc(r.summary)}</p><p class="note"><strong>Reading limits:</strong> ${esc(r.limitations)}</p><details${printing?' open':''}><summary>Population and review details</summary>${metadata([['Population',esc(r.population)],['Year note',esc(r.year_note)],['DOI',esc(r.doi)],['Review basis',esc(r.review_basis)],['Checked',esc(r.checked)],['Publication',a(r.url,r.url)]])}</details></article>`;
 }
 const card={resources:resource,registry,literature};
 function render(){
  const rows=filtered(),pages=Math.max(1,Math.ceil(rows.length/perPage));state.page=Math.min(state.page,pages);
  const noun=state.mode==='resources'?'resources':state.mode==='registry'?'registry and data options':'readings';
  $('result-count').textContent=`${rows.length.toLocaleString()} ${noun}${rows.length!==source().length?' of '+source().length.toLocaleString():''}`;
  $('view-explanation').textContent=state.mode==='resources'?'Resources may appear in several categories. Open the review details to see what was checked.':state.mode==='registry'?'Compare registry hosts, technology vendors, records connectors, recruitment tools and planning guidance by role. This is a discovery guide, not a vendor ranking.':'A targeted reading list of research and guidance, with a short interpretation and limitations. It is not a systematic review or a clinical recommendation.';
  $('registry-help').hidden=state.mode!=='registry';
  const applied=[state.search?`Search: ${state.search}`:'',...defs[state.mode].filter(([k])=>state.filters[k]).map(([k,label])=>`${label}: ${state.filters[k]}`)].filter(Boolean);
  $('filter-summary').textContent=applied.length?applied.join(' · '):'Showing all '+noun+'.';
  const visible=printing?rows:rows.slice((state.page-1)*perPage,state.page*perPage);
  $('results').innerHTML=visible.length?visible.map(card[state.mode]).join(''):'<div class="empty"><h3>No matching resources</h3><p>Try a broader search or clear one of the filters.</p></div>';
  $('pagination').innerHTML=printing?'':`<button id="previous" ${state.page===1?'disabled':''}>Previous</button><span>Page ${state.page} of ${pages}</span><button id="next" ${state.page===pages?'disabled':''}>Next</button>`;
  if(!printing){$('previous').onclick=()=>page(-1);$('next').onclick=()=>page(1);}
  $('export').disabled=!rows.length;$('print').disabled=!rows.length;
 }
 function page(delta){state.page+=delta;render();$('result-count').scrollIntoView({block:'start'});}
 function setMode(mode){state={mode,search:'',filters:{},page:1};$('search').value='';document.querySelectorAll('[data-mode]').forEach(b=>{const active=b.dataset.mode===mode;b.setAttribute('aria-selected',String(active));b.tabIndex=active?0:-1;});$('explorer-panel').setAttribute('aria-labelledby','tab-'+mode);fields();render();}
 function jump(category,mode='resources'){setMode(mode);if(category){state.filters.category=category;fields();render();}$('explorer').scrollIntoView({block:'start'});$('search').focus({preventScroll:true});}
 function exportRows(){
  const rows=filtered(),cols=Object.keys(rows[0]||{});
  const cell=v=>{let s=join(v);if(/^[=+\-@\t\r]/.test(s))s="'"+s;return '"'+s.replace(/"/g,'""')+'"';};
  const content=[cols.map(cell).join(','),...rows.map(r=>cols.map(k=>cell(r[k])).join(','))].join('\r\n');
  const url=URL.createObjectURL(new Blob(['\uFEFF'+content],{type:'text/csv;charset=utf-8;'})),link=document.createElement('a');link.href=url;link.download=`resource-ecosystem-${state.mode}-${DATA.metadata.review_date}.csv`;document.body.appendChild(link);link.click();link.remove();setTimeout(()=>URL.revokeObjectURL(url),1000);
 }
 $('search').addEventListener('input',e=>{state.search=e.target.value;state.page=1;render();});
 $('reset').onclick=()=>{state.filters={};state.search='';state.page=1;$('search').value='';fields();render();};
 document.querySelectorAll('[data-mode]').forEach(b=>b.onclick=()=>setMode(b.dataset.mode));
 document.querySelector('.tabs').addEventListener('keydown',e=>{const tabs=[...document.querySelectorAll('[data-mode]')],i=tabs.indexOf(document.activeElement);if(i<0)return;let target;if(e.key==='ArrowRight')target=(i+1)%tabs.length;else if(e.key==='ArrowLeft')target=(i+tabs.length-1)%tabs.length;else if(e.key==='Home')target=0;else if(e.key==='End')target=tabs.length-1;else return;e.preventDefault();tabs[target].focus();setMode(tabs[target].dataset.mode);});
 document.querySelectorAll('[data-scope]').forEach(b=>b.onclick=()=>{setMode('resources');state.filters.scope=b.dataset.scope;fields();render();$('explorer').scrollIntoView({block:'start'});$('search').focus({preventScroll:true});});
 const paths=[['Siblings','Sibling support','Peer groups, programs and family guidance'],['Parents & families','Parenting and family support','Navigation, caregiving and everyday support'],['Transition','Transition to adulthood','Adult healthcare, planning and independence'],['Registry options',null,'Hosting, data capture, records and standards'],['Nonprofit tools','Nonprofit leadership and capacity','Governance, fundraising and research readiness'],['Communication & AAC','AAC and communication','Organizations, devices and practical guidance']];
 $('quick-paths').innerHTML=paths.map(([title,c,desc],i)=>`<button data-path="${i}"><strong>${esc(title)} <span aria-hidden="true">↗</span></strong><small>${esc(desc)}</small><span class="path-count">${c?DATA.resources.filter(r=>r.categories.includes(c)).length:DATA.registry.length} entries</span></button>`).join('');
 document.querySelectorAll('[data-path]').forEach(b=>b.onclick=()=>{const p=paths[Number(b.dataset.path)];jump(p[1],p[1]?'resources':'registry');});
 $('stats').innerHTML=`<div><strong>${DATA.resources.length.toLocaleString()}</strong>resource entries</div><div><strong>${DATA.metadata.categories.length}</strong>categories</div><div><strong>${DATA.registry.length}</strong>registry &amp; data options</div><div><strong>${DATA.literature.length}</strong>annotated readings</div>`;
 $('export').onclick=exportRows;
 window.addEventListener('beforeprint',()=>{printing=true;render();});window.addEventListener('afterprint',()=>{printing=false;render();});
 $('print').onclick=()=>{printing=true;render();window.print();};
 fields();render();
})();
