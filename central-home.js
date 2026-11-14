/* Home executiva da Central: métricas reais da sessão administrativa.
   "Acesso" = sessão iniciada com consentimento, nunca pessoa única. */
(function(){
'use strict';
const D=document,$=id=>D.getElementById(id);
const fmt=n=>new Intl.NumberFormat('pt-BR').format(Number(n)||0);
const DAY_MS=86400000,fmtDate=new Intl.DateTimeFormat('pt-BR',{day:'2-digit',month:'2-digit',timeZone:'UTC'});
const fmtTime=new Intl.DateTimeFormat('pt-BR',{day:'2-digit',month:'2-digit',hour:'2-digit',minute:'2-digit',timeZone:'America/Sao_Paulo'});
const LABELS={session_start:'Nova sessão',page_view:'Área visualizada',click:'Clique em controle',feature_open:'Funcionalidade aberta',screen_time:'Tempo de uso'};
const n=x=>Number.isFinite(Number(x))?Number(x):0;
let snapshot=null,map=null,mapLayer=null,lastRows=[],seq=0,lastDays=30;
function text(id,s){if($(id))$(id).textContent=String(s);}
function make(tag,cls,content){
 const node=D.createElement(tag);
 if(cls)node.className=cls;
 if(content!==undefined)node.textContent=String(content);
 return node;
}
function localDateKey(value){
 const parts=new Intl.DateTimeFormat('en-US',{year:'numeric',month:'2-digit',day:'2-digit',timeZone:'America/Sao_Paulo'}).formatToParts(new Date(value));
 const v=Object.fromEntries(parts.map(x=>[x.type,x.value]));
 return [v.year,v.month,v.day].join('-');
}
function formatDay(k){
 try{return fmtDate.format(new Date(k+'T12:00:00Z'));}catch(_){return k;}
}
function chart(data){
 const root=$('homeDayChart');if(!root)return;
 root.replaceChildren();
 if(!Array.isArray(data)||!data.length){
  root.append(make('p','exec-empty','Sem sessões iniciadas no período escolhido.'));
  text('homeDayCaption','A medição considera apenas visitas que autorizaram as métricas.');
  return;
 }
 const mapDays=new Map(data.map(r=>[r.day_local||r.date,n(r.sessions)]));
 const first=[...mapDays.keys()].sort()[0],last=localDateKey(snapshot.generated_at);
 const start=new Date(first+'T12:00:00Z'),end=new Date(last+'T12:00:00Z');
 const length=Math.max(0,Math.min(366,Math.round((end-start)/DAY_MS)+1));
 const days=Array.from({length},(_,i)=>{
  const date=new Date(start.getTime()+i*DAY_MS).toISOString().slice(0,10);
  return {date,sessions:mapDays.get(date)||0};
 });
 const max=Math.max(1,...days.map(x=>x.sessions));
 const scroll=make('div','exec-days-scroll'),bars=make('div','exec-days-bars');
 const interval=days.length>45?Math.ceil(days.length/25):days.length>18?Math.ceil(days.length/15):1;
 bars.style.setProperty('--day-count',String(days.length));
 days.forEach((item,i)=>{
  const bar=make('div','exec-day-col');
  const value=make('span','exec-day-value',item.sessions>0?fmt(item.sessions):'');
  const column=make('div','exec-day-rail');
  const fill=make('div','exec-day-fill');
  fill.style.height=(item.sessions>0?Math.max(3,item.sessions/max*100):0)+'%';
  if(item.date===last)fill.classList.add('is-today');
  column.append(fill);
  const label=make('span','exec-day-label',i%interval===0||i===days.length-1?formatDay(item.date):'');
  bar.title=formatDay(item.date)+': '+fmt(item.sessions)+' '+(item.sessions===1?'sessão iniciada':'sessões iniciadas');
  bar.setAttribute('aria-label',bar.title);
  bar.append(value,column,label);bars.append(bar);
 });
 scroll.append(bars);root.append(scroll);
 if(days.length>18)scroll.scrollLeft=scroll.scrollWidth;
 const total=days.reduce((sum,d)=>sum+d.sessions,0);
 text('homeDayCaption',fmt(total)+' sessões iniciadas em '+fmt(days.length)+' dias de calendário com histórico · início e fim do intervalo podem ser dias parciais.');
}
function topFeatures(data){
 const root=$('homeTopFeatures');if(!root)return;
 root.replaceChildren();
 if(!data?.length){root.append(make('p','exec-empty','Ainda não há aberturas de funcionalidades registradas.'));return;}
 const highest=Math.max(1,...data.map(x=>n(x.views)));
 data.slice(0,7).forEach((r,i)=>{
  const row=make('div','exec-feature-row');
  const top=make('div','exec-feature-top');
  top.append(make('span','exec-feature-name',String(i+1)+'. '+String(r.feature||'Área não informada').replace(/[-_]/g,' ')));
  top.append(make('span','exec-feature-count',fmt(r.views)+' aberturas'));
  const rail=make('div','exec-feature-track'),fill=make('div','exec-feature-fill');
  fill.style.width=(n(r.views)/highest*100)+'%';rail.append(fill);row.append(top,rail);root.append(row);
 });
}
function recent(data){
 const root=$('homeActivity');if(!root)return;
 root.replaceChildren();
 if(!data?.length){root.append(make('p','exec-empty','Ainda não há eventos recentes para este período.'));return;}
 data.slice(0,7).forEach(r=>{
  const item=make('div','exec-activity-item');
  const marker=make('span','exec-activity-dot');
  const content=make('div','exec-activity-text');
  const title=make('span','exec-activity-title',LABELS[r.event_type]||'Atividade registrada');
  const details=[r.feature&&r.feature!=='dashboard'?r.feature.replace(/[-_]/g,' '):'Página inicial',r.device].filter(Boolean).join(' · ');
  const desc=make('span','exec-activity-description',details);
  content.append(title,desc);
  let date='Data não disponível';
  try{date=fmtTime.format(new Date(r.recorded_at));}catch(_){}
  item.append(marker,content,make('time','exec-activity-time',date));
  root.append(item);
 });
}
function render(snapshotData){
 snapshot=snapshotData;
 text('homeToday',fmt(snapshot.today));
 text('homeHour',fmt(snapshot.last_hour));
 text('homeHourActivity',fmt(snapshot.active_last_hour));
 text('homePeriod',fmt(snapshot.period_sessions));
 text('homeTodayNote',snapshot.yesterday===undefined?'Sessões iniciadas hoje':'Ontem: '+fmt(snapshot.yesterday)+' sessões');
 text('homePeriodNote',lastDays===1?'Últimas 24 horas':'Últimos '+lastDays+' dias');
 try{text('homeUpdated','Atualizado: '+fmtTime.format(new Date(snapshot.generated_at))+' · Brasília');}
 catch(_){text('homeUpdated','Dados recentes');}
 chart(snapshot.daily);topFeatures(snapshot.top_features);recent(snapshot.recent);
}
async function load(days){
 if(typeof window.hubCentralRequest!=='function')return;
 const i=++seq;lastDays=days;
 text('homeUpdated','Carregando painel executivo…');
 try{
  const result=await window.hubCentralRequest('/rest/v1/rpc/hub_analytics_home','POST',{p_days:days});
  if(i!==seq)return;
  if(!result||typeof result!=='object'||!Array.isArray(result.daily))throw new Error('Resposta incompleta');
  render(result);
 }catch(e){
  if(i!==seq)return;
  text('homeUpdated','Painel indisponível: '+(e.message||'falha ao consultar'));
  ['homeToday','homeHour','homePeriod','homeHourActivity'].forEach(id=>text(id,'—'));
 }
}
function initMap(){
 if(map)return true;
 if(!$('homeAccessMap')||!window.L)return false;
 map=window.L.map('homeAccessMap',{
  zoomControl:true,scrollWheelZoom:false,attributionControl:true
 }).setView([-15.1,-51.4],4);
 window.L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png',{
  attribution:'&copy; OpenStreetMap contributors',maxZoom:11
 }).addTo(map);
 mapLayer=window.L.layerGroup().addTo(map);
 return true;
}
function mapData(rows,error){
 lastRows=Array.isArray(rows)?rows:[];
 if(error){text('homeMapStatus','Não foi possível atualizar as localizações.');return;}
 if(!$('panel-resumo')?.classList.contains('active'))return;
 paintMap();
}
function paintMap(){
 if(!initMap()){
  text('homeMapStatus','Mapa indisponível. Consulte a aba Mapa de acessos.');
  return;
 }
 mapLayer.clearLayers();
 const groups=new Map();
 let known=0,regionOnly=0;
 for(const row of lastRows){
  const pt=window.hubCentralPontoSessao?.(row);
  if(!pt)continue;
  known++;
  if(!row.city)regionOnly++;
  const key=pt.lat.toFixed(2)+':'+pt.lon.toFixed(2);
  let entry=groups.get(key);
  if(!entry){
   entry={lat:pt.lat,lon:pt.lon,rows:0,name:window.hubCentralLocalNome?.(row)||'Localização aproximada',precision:pt.precisao};
   groups.set(key,entry);
  }
  entry.rows++;
 }
 const points=[...groups.values()];
 points.forEach(item=>{
  const radius=Math.max(6,Math.min(20,4+Math.sqrt(item.rows)*1.8));
  const marker=window.L.circleMarker([item.lat,item.lon],{
   radius,weight:2,color:'#fff',fillColor:'#176c89',fillOpacity:.83
  }).addTo(mapLayer);
  const popup=make('div','exec-map-popup');
  popup.append(make('div','exec-map-popup-heading',item.name));
  popup.append(make('div','',fmt(item.rows)+' '+(item.rows===1?'sessão':'sessões')));
  popup.append(make('small','',item.precision));
  marker.bindPopup(popup);
 });
 map.invalidateSize();
 if(points.length===1)map.setView([points[0].lat,points[0].lon],points[0].precision.includes('estado')?5:7);
 else if(points.length>1)map.fitBounds(window.L.latLngBounds(points.map(p=>[p.lat,p.lon])).pad(.16),{padding:[15,15],maxZoom:8});
 text('homeMapStatus',fmt(known)+' sessões localizadas · '+fmt(points.length)+' pontos'+
  (regionOnly?' · '+fmt(regionOnly)+' sem cidade registrada':''));
}
function nav(target){
 const button=D.querySelector('.tab[data-tab="'+target+'"]');
 if(button){button.click();D.querySelector('.tabs')?.scrollIntoView({behavior:'smooth',block:'start'});}
}
D.addEventListener('click',e=>{
 const btn=e.target.closest('[data-home-go]');
 if(btn)nav(btn.dataset.homeGo);
 const tab=e.target.closest('.tab[data-tab="resumo"]');
 if(tab)requestAnimationFrame(paintMap);
});
window.addEventListener('hub:central-report',e=>{
 const days=Number(e.detail?.days)||30;
 load(days);
});
window.addEventListener('hub:central-map',e=>mapData(e.detail?.rows,e.detail?.error));
window.addEventListener('hub:central-logout',()=>{
 ++seq;snapshot=null;lastRows=[];
 ['homeToday','homeHour','homePeriod','homeHourActivity'].forEach(id=>text(id,'—'));
 ['homeUpdated','homeMapStatus','homeDayCaption'].forEach(id=>text(id,'Aguardando autenticação'));
 ['homeDayChart','homeTopFeatures','homeActivity'].forEach(id=>$(id)?.replaceChildren());
 if(map){map.remove();map=null;mapLayer=null;}
});
})();