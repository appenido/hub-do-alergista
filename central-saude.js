/* Central do Hub — relatório de observabilidade técnica. */
(function(){
'use strict';
const d=document,$=id=>d.getElementById(id);
const nf=new Intl.NumberFormat('pt-BR',{maximumFractionDigits:0});
const num=x=>Number(x)||0;
const label={
 ttfb_ms:'Resposta inicial (TTFB)',
 dom_ready_ms:'DOM pronto',
 lcp_ms:'Maior elemento visível (LCP)',
 cls_score:'Estabilidade (CLS)',
 interaction_latency_ms:'Latência de interação (aproximada)',
 js_error:'Falha de JavaScript',
 offline:'Conexão interrompida'
};
let seq=0,report=null;
function txt(id,value){const n=$(id);if(n)n.textContent=value;}
function val(metric,x){if(x===undefined||x===null)return '—';return metric==='cls_score'?num(x).toLocaleString('pt-BR',{minimumFractionDigits:3,maximumFractionDigits:3}):nf.format(num(x))+' ms';}
function renderTable(id,data,fields){
 const root=$(id);if(!root)return;root.replaceChildren();
 if(!data?.length){
  const tr=d.createElement('tr'),td=d.createElement('td');td.colSpan=fields.length;td.className='empty';td.textContent='Ainda sem registros deste indicador.';tr.append(td);root.append(tr);return;
 }
 for(const r of data){
  const tr=d.createElement('tr');
  for(const fn of fields){const td=d.createElement('td');td.textContent=String(fn(r)??'—');tr.append(td);}
  root.append(tr);
 }
}
function renderBars(id,data,name){
 const root=$(id);if(!root)return;root.replaceChildren();
 if(!data?.length){const p=d.createElement('p');p.className='empty';p.textContent='Nenhuma falha registrada neste período.';root.append(p);return;}
 const max=Math.max(1,...data.map(x=>num(x.errors)));
 for(const item of data){
   const div=d.createElement('div');div.className='bar-item';
   const span=d.createElement('span');span.className='bar-name';span.textContent=name(item);
   const count=d.createElement('span');count.className='bar-count';count.textContent=nf.format(num(item.errors));
   const line=d.createElement('div');line.className='bar-line';
   const fill=d.createElement('div');fill.className='bar-fill';fill.style.width=Math.max(2,num(item.errors)/max*100)+'%';
   line.append(fill);div.append(span,count,line);root.append(div);
 }
}
function render(data){
 const metrics=new Map((data.metrics||[]).map(x=>[x.metric,x]));
 txt('hTtfb',val('ttfb_ms',metrics.get('ttfb_ms')?.p75));
 txt('hLcp',val('lcp_ms',metrics.get('lcp_ms')?.p75));
 txt('hCls',val('cls_score',metrics.get('cls_score')?.p75));
 txt('hDom',val('dom_ready_ms',metrics.get('dom_ready_ms')?.p75));
 txt('hErrors',nf.format(num(data.totals?.errors)));
 txt('hOffline',nf.format(num(data.totals?.offline)));
 renderTable('healthTable',(data.metrics||[]).filter(x=>!['js_error','offline'].includes(x.metric)),[
  r=>label[r.metric]||r.metric,r=>nf.format(num(r.samples)),r=>val(r.metric,r.average),r=>val(r.metric,r.p75),r=>val(r.metric,r.p95)
 ]);
 renderTable('healthTimeline',data.errors_by_day||[],[
  r=>String(r.day_local||'—').split('-').reverse().join('/'),r=>nf.format(num(r.errors)),r=>nf.format(num(r.offline))
 ]);
 renderBars('healthErrorsFeature',data.errors_by_feature||[],r=>r.feature||'Não informado');
 renderBars('healthErrorsDevice',data.errors_by_device||[],r=>r.device||'Não informado');
 txt('healthStatus',(num(data.totals?.events)===0?'Aguardando primeiras amostras':'Amostras coletadas: '+nf.format(num(data.totals?.events)))+' · atualização automática');
}
async function load(days){
 const i=++seq;
 txt('healthStatus','Consultando saúde técnica…');
 try{
   const data=await window.hubCentralRequest('/rest/v1/rpc/hub_analytics_quality_report','POST',{p_days:days});
   if(i!==seq)return;
   if(!data?.totals)throw new Error('Retorno técnico incompleto');
   report=data;render(data);
 }catch(e){
   if(i!==seq)return;
   txt('healthStatus','Saúde técnica indisponível: '+(e.message||'erro de consulta'));
 }
}
window.addEventListener('hub:central-report',e=>{
 if(typeof window.hubCentralRequest==='function')load(Number(e.detail?.days)||30);
});
window.addEventListener('hub:central-logout',()=>{
 seq++;report=null;
 ['hTtfb','hLcp','hCls','hDom','hErrors','hOffline'].forEach(id=>txt(id,'—'));
 ['healthTable','healthTimeline','healthErrorsFeature','healthErrorsDevice'].forEach(id=>{if($(id))$(id).replaceChildren();});
 txt('healthStatus','Aguardando consulta autenticada');
});
})();