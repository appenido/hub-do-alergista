/* Central Hub — inteligência derivada exclusivamente de eventos autorizados.
   O token nunca é gravado neste arquivo: a consulta utiliza o cliente autenticado da central. */
(function(){
'use strict';
const d=document;
const el=id=>d.getElementById(id);
const number=x=>Number.isFinite(Number(x))?Number(x):0;
const fmt=x=>new Intl.NumberFormat('pt-BR',{maximumFractionDigits:1}).format(number(x));
const decimal=x=>new Intl.NumberFormat('pt-BR',{minimumFractionDigits:1,maximumFractionDigits:1}).format(number(x));
const percent=(n,total)=>total>0?decimal(100*number(n)/number(total))+'%':'—';
const dateTime=iso=>{try{return iso?new Intl.DateTimeFormat('pt-BR',{dateStyle:'short',timeStyle:'short',timeZone:'America/Sao_Paulo'}).format(new Date(iso)):'—';}catch(_){return '—';}};
const duration=seconds=>{const s=number(seconds);if(s<60)return fmt(Math.round(s))+' s';if(s<3600)return decimal(s/60)+' min';return decimal(s/3600)+' h';};
const weekdays=['Segunda','Terça','Quarta','Quinta','Sexta','Sábado','Domingo'];
function localidade(r){
  if(r.city&&String(r.city).trim())return String(r.city).trim();
  const region=window.hubCentralRegiaoNome?.(r.country||'',r.region||'')||r.region||'';
  if(region)return region+' (somente estado/região)';
  if(r.country&&r.country!=='—')return r.country+' (somente país)';
  return 'Localização municipal indisponível';
}
function precisao(r){
  return r.location_precision==='cidade'?'Cidade estimada':
    r.location_precision==='região'?'Estado/região':'País';
}
let extended=null,base=null,days=30,serial=0;
const setText=(id,value)=>{const n=el(id);if(n)n.textContent=value;};
function clear(id){const n=el(id);if(n)n.replaceChildren();return n;}
function empty(root,msg){
 if(!root)return;
 const p=d.createElement('p');p.className='empty';p.textContent=msg||'Sem dados neste período.';root.append(p);
}
function bars(id,data,label,key,limit){
 const root=clear(id);if(!root)return;
 if(!Array.isArray(data)||!data.length){empty(root);return;}
 const list=data.slice(0,limit||25),max=Math.max(1,...list.map(x=>number(x[key])));
 list.forEach(item=>{
   const val=number(item[key]),row=d.createElement('div');row.className='bar-item';
   const name=d.createElement('span');name.className='bar-name';name.textContent=String(label(item)||'Não informado');
   const count=d.createElement('span');count.className='bar-count';count.textContent=fmt(val);
   const line=d.createElement('div');line.className='bar-line';
   const fill=d.createElement('div');fill.className='bar-fill';
   fill.style.width=(val>0?Math.max(2,val/max*100):0)+'%';
   line.append(fill);row.append(name,count,line);root.append(row);
 });
}
function table(id,rows,columns){
 const root=clear(id);if(!root)return;
 if(!Array.isArray(rows)||!rows.length){
   const tr=d.createElement('tr'),td=d.createElement('td');td.colSpan=columns.length;td.className='empty';td.textContent='Sem dados neste período.';tr.append(td);root.append(tr);return;
 }
 rows.forEach(r=>{
   const tr=d.createElement('tr');
   columns.forEach(c=>{const td=d.createElement('td');td.textContent=String(c(r)??'—');tr.append(td);});
   root.append(tr);
 });
}
function summary(){
 if(!extended)return;
 const t=extended.totals||{},prev=extended.previous||{},curr=number(t.sessions),old=number(prev.sessions);
 setText('kActive15',fmt(t.recent_15min));
 setText('kEngagement',percent(t.engaged,curr));
 setText('kAverage',duration(t.avg_visible_seconds));
 const diff=old?(100*(curr-old)/old):null;
 const change=diff===null?'Sem base anterior':(diff>0?'+':'')+decimal(diff)+'%';
 setText('iVariation',change);
 setText('iEngage',percent(t.engaged,curr));
 setText('iBounce',percent(t.bounce,curr));
 setText('iDepth',decimal(t.avg_pages));
 setText('iInteraction',decimal(t.avg_clicks));
 setText('iMedian',duration(t.median_visible_seconds));
 setText('intelStatus','Atualizado em '+dateTime(extended.generated_at)+' · '+fmt(curr)+' sessões');
}
function heatmap(data){
 const root=clear('heatmap');if(!root)return;
 const index=new Map((data||[]).map(x=>[String(x.weekday)+'-'+String(x.slot_hour),number(x.sessions)]));
 const max=Math.max(1,...Array.from(index.values()));
 const grid=d.createElement('div');grid.className='heatmap-grid';
 const cell=(label,cls)=>{const x=d.createElement('div');x.className=cls;x.textContent=label;grid.append(x);return x;};
 cell('Dia / hora','heatmap-heading');
 for(let h=0;h<24;h++)cell(String(h).padStart(2,'0'),'heatmap-hour');
 for(let weekday=1;weekday<=7;weekday++){
   cell(weekdays[weekday-1].slice(0,3),'heatmap-day');
   for(let hour=0;hour<24;hour++){
     const value=index.get(weekday+'-'+hour)||0;
     const item=cell(value?String(value):'','heatmap-cell');
     const opacity=value?Math.max(.14,.13+.8*value/max):.025;
     item.style.background='rgba(27,93,143,'+opacity.toFixed(3)+')';
     item.style.color=value/max>.48?'white':'#154267';
     item.title=weekdays[weekday-1]+' às '+String(hour).padStart(2,'0')+'h: '+fmt(value)+' sessões';
     item.setAttribute('aria-label',item.title);
   }
 }
 root.append(grid);
}
function journeys(){
 if(!extended)return;
 const sort=el('featureSort')?.value||'views';
 const allowed=['views','clicks','sessions','visible_seconds'];
 const prop=allowed.includes(sort)?sort:'views';
 const features=(extended.features||[]).slice().sort((a,b)=>number(b[prop])-number(a[prop]));
 table('featureMetrics',features,[
  r=>r.feature||'Não informado',r=>fmt(r.views),r=>fmt(r.clicks),r=>fmt(r.sessions),r=>duration(r.visible_seconds)
 ]);
 bars('entrances',extended.entrances,r=>r.feature,'sessions',20);
 bars('exits',extended.exits,r=>r.feature,'sessions',20);
 table('flowsTable',extended.flows,[
  r=>r.origin||'Não informado',r=>r.destination||'Não informado',r=>fmt(r.sessions)
 ]);
}
function population(){
 if(!extended)return;
 bars('displayModes',extended.display_modes,r=>r.name,'sessions',12);
 bars('viewports',extended.viewports,r=>({pequena:'Tela pequena',media:'Tela média',grande:'Tela grande'})[r.name]||r.name,'sessions',10);
 bars('countries',extended.countries,r=>r.country,'sessions',15);
 table('citiesTable',extended.cities,[
  r=>localidade(r),r=>r.country||'—',r=>precisao(r),r=>fmt(r.sessions)
 ]);
 bars('sessionSources',extended.session_sources,r=>r.name,'sessions',25);
 bars('weekdays',(extended.weekday||[]).map(r=>({...r,name:weekdays[number(r.weekday)-1]||'Não informado'})),
 r=>r.name,'sessions',7);
 heatmap(extended.heatmap);
}
function qualityRow(label,value,tip){
 const r=d.createElement('div');r.className='quality-item';
 const left=d.createElement('div'),title=d.createElement('span');title.textContent=label;left.append(title);
 if(tip){const small=d.createElement('small');small.textContent=tip;left.append(small);}
 const num=d.createElement('strong');num.textContent=value;r.append(left,num);return r;
}
function quality(){
 if(!extended)return;
 const t=extended.totals||{},s=number(t.sessions);
 const root=clear('qualityStats');
 if(root){
   root.append(
    qualityRow('País disponível',percent(t.identified_countries,s),'GeoIP aproximado; não é GPS'),
    qualityRow('Cidade disponível',percent(t.identified_cities,s),'A cidade pode diferir da localização real'),
    qualityRow('Estado/região disponível',percent(t.identified_regions,s),'Informação alternativa para acessos históricos sem cidade'),
    qualityRow('Sessões no período',fmt(s),'Apenas sessões que autorizaram a coleta'),
    qualityRow('Uso por PWA',percent(t.pwa_sessions,s),'Modo de exibição detectado')
   );
 }
 const cover=clear('coverageStats');
 if(cover){
   cover.append(
    qualityRow('Primeiro evento do período',dateTime(t.first_seen),'Início da janela efetivamente observada'),
    qualityRow('Último evento',dateTime(t.last_seen),'Recebido pelo banco de eventos'),
    qualityRow('Atividade nos últimos 5 min',fmt(t.recent_5min),'Sessões com ao menos um evento recente'),
    qualityRow('Período selecionado',fmt(days)+' dia(s)','Comparação utiliza igual número de dias anteriores')
   );
 }
}
function render(){
 if(!extended)return;
 summary();population();journeys();quality();
}
async function load(){
 if(typeof window.hubCentralRequest!=='function')return;
 const seq=++serial;
 setText('intelStatus','Calculando indicadores de navegação…');
 try{
   const data=await window.hubCentralRequest('/rest/v1/rpc/hub_analytics_extended_report','POST',{p_days:days});
   if(seq!==serial)return;
   if(!data||typeof data!=='object'||!data.totals)throw new Error('Retorno incompleto.');
   extended=data;render();
 }catch(err){
   if(seq!==serial)return;
   setText('intelStatus','Indicadores adicionais indisponíveis: '+(err.message||'falha de consulta'));
   if(!extended){
     ['kActive15','kEngagement','kAverage','iVariation','iEngage','iBounce','iDepth','iInteraction','iMedian'].forEach(id=>setText(id,'—'));
   }
 }
}
function csv(value){
 let s=String(value??'');
 if(/^[=+\-@\t\r]/.test(s))s="'"+s;
 return '"'+s.replace(/"/g,'""')+'"';
}
function download(name,headers,rows){
 const contents=[headers,...rows].map(row=>row.map(csv).join(';')).join('\r\n');
 const blob=new Blob(['\uFEFF',contents],{type:'text/csv;charset=utf-8'});
 const url=URL.createObjectURL(blob),a=d.createElement('a');
 a.href=url;a.download=name;d.body.append(a);a.click();a.remove();
 setTimeout(()=>URL.revokeObjectURL(url),1000);
}
function exportFile(kind){
 if(!extended)return;
 const stamp=new Date().toISOString().slice(0,10),pre='hub-'+kind+'-'+days+'d-'+stamp+'.csv',t=extended.totals||{};
 if(kind==='resumo'){
  download(pre,['Indicador','Valor','Período'],[
    ['Sessões medidas',t.sessions,days+' dias'],
    ['Sessões no período anterior',extended.previous?.sessions,days+' dias anteriores'],
    ['Taxa de engajamento',percent(t.engaged,t.sessions),days+' dias'],
    ['Saída rápida',percent(t.bounce,t.sessions),days+' dias'],
    ['Visualizações por sessão',t.avg_pages,days+' dias'],
    ['Cliques por sessão',t.avg_clicks,days+' dias'],
    ['Tempo médio em tela (seg)',t.avg_visible_seconds,days+' dias'],
    ['Tempo mediano em tela (seg)',t.median_visible_seconds,days+' dias'],
    ['PWA',t.pwa_sessions,days+' dias'],
    ['Sessões com evento nos últimos 15 minutos',t.recent_15min,'15 minutos']
   ]);
 }else if(kind==='funcionalidades'){
  download(pre,['Funcionalidade','Visualizações','Cliques','Sessões','Tempo visível (s)'],
    (extended.features||[]).map(x=>[x.feature,x.views,x.clicks,x.sessions,x.visible_seconds]));
 }else if(kind==='cidades'){
  download(pre,['Cidade ou estado/região','País','Precisão','Sessões'],
    (extended.cities||[]).map(x=>[localidade(x),x.country,precisao(x),x.sessions]));
 }
}
d.addEventListener('change',ev=>{if(ev.target?.id==='featureSort')journeys();});
d.addEventListener('click',ev=>{
 const id=ev.target?.id;
 if(id==='exportSummary')exportFile('resumo');
 if(id==='exportFeatures')exportFile('funcionalidades');
 if(id==='exportCities')exportFile('cidades');
});
window.addEventListener('hub:central-report',ev=>{
 days=Number(ev.detail?.days)||30;
 base=ev.detail?.report||null;
 load();
});
window.addEventListener('hub:central-logout',()=>{
 serial++;extended=null;base=null;setText('intelStatus','Aguardando consulta autenticada');
 ['kActive15','kEngagement','kAverage','iVariation','iEngage','iBounce','iDepth','iInteraction','iMedian'].forEach(id=>setText(id,'—'));
 ['heatmap','featureMetrics','citiesTable','flowsTable','entrances','exits','sessionSources','weekdays','qualityStats','coverageStats','displayModes','viewports','countries'].forEach(clear);
});
})();