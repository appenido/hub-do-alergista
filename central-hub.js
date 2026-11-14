/* Central administrativa: login no servidor, token curto em memória, refresh em cookie HttpOnly.
   Dados só aparecem após confirmação de administrador pelo Auth e RLS Supabase. */
(function(){
'use strict';
const SB='https://jpdtqtenlivxgjkyizcg.supabase.co';
const KEY='sb_publishable_CzAI8BUm2Po7CfobLlxv8A_NtuTil8j';
const d=document;
const el=id=>d.getElementById(id);
const fmt=n=>new Intl.NumberFormat('pt-BR').format(Number(n||0));
let report=null,days=30,loading=false,admin=false;
let access=null,expiresAt=0,refreshPromise=null;
function gravarAuth(data){
  if(!data?.access_token||!Number.isFinite(Number(data.expires_in)))throw new Error('Sessão inválida.');
  access=data.access_token;
  expiresAt=Date.now()+Math.max(30,Number(data.expires_in))*1000;
}
function limpar(){
  access=null;expiresAt=0;refreshPromise=null;
  admin=false;report=null;mapSessions=[];mapFiltered=[];mapGroups=[];
  delete window.hubCentralRequest;
  window.dispatchEvent(new CustomEvent('hub:central-logout'));
  if(geoMap){geoMap.remove();geoMap=null;mapLayer=null;}
  el('dashboard').hidden=true;el('authPanel').hidden=false;el('logout').hidden=true;
}
async function autenticacao(action,fields={}){
  const response=await fetch('/central-auth',{
    method:'POST',credentials:'same-origin',cache:'no-store',
    headers:{'Content-Type':'application/json'},
    body:JSON.stringify({action,...fields})
  });
  const data=await response.json().catch(()=>({}));
  if(!response.ok){
    const message=String(data.erro||'Falha de autenticação.');
    const error=new Error(message);
    error.status=response.status;throw error;
  }
  return data;
}
async function token(){
  if(access&&expiresAt>Date.now()+45000)return access;
  if(!refreshPromise){
    refreshPromise=(async()=>{
      const result=await autenticacao('resume');
      gravarAuth(result);
      return access;
    })().finally(()=>{refreshPromise=null;});
  }
  return refreshPromise;
}
async function supa(path,method,body,repeat){
  const jwt=await token();
  const resp=await fetch(SB+path,{
    method:method||'GET',
    headers:{apikey:KEY,Authorization:'Bearer '+jwt,'Content-Type':'application/json'},
    ...(body===undefined?{}:{body:JSON.stringify(body)}),
    cache:'no-store'
  });
  if(resp.status===401&&!repeat){
    access=null;expiresAt=0;
    return supa(path,method,body,true);
  }
  if(!resp.ok){
    const data=await resp.json().catch(()=>({}));
    throw new Error(resp.status===403?'Acesso não autorizado.':(data.message||data.error||'Falha na consulta ('+resp.status+').'));
  }
  return resp.status===204?null:resp.json();
}
async function verificar(){
  const user=await supa('/auth/v1/user');
  if(!user?.id)throw new Error('Sessão inválida.');
  const roles=await supa('/rest/v1/hub_admin_roles?select=user_id&user_id=eq.'+encodeURIComponent(user.id)+'&limit=1');
  if(!Array.isArray(roles)||roles.length!==1||roles[0].user_id!==user.id)
    throw new Error('Esta conta não possui autorização para consultar a central.');
  admin=true;
  // Exclusão permanente de métricas neste navegador após verificar a única conta administradora.
  // É somente um marcador booleano; token e senha continuam exclusivamente fora do storage.
  try{
    localStorage.setItem('hub_analytics_owner_excluded_v1','1');
    localStorage.setItem('hub_analytics_choice_v2','nao');
  }catch(_){}
  window.hubCentralRequest=supa;
  el('authPanel').hidden=true;el('dashboard').hidden=false;el('logout').hidden=false;
  el('loginError').textContent='';
  await carregar();
}
async function login(e){
  e.preventDefault();
  el('loginError').textContent='';
  const btn=el('loginButton');btn.disabled=true;btn.textContent='Autenticando…';
  try{
    const data=await autenticacao('login',{
      email:el('email').value.trim(),password:el('password').value
    });
    gravarAuth(data);
    el('password').value='';
    await verificar();
  }catch(err){
    limpar();
    el('loginError').textContent=err.message||'Falha de autenticação.';
  }finally{btn.disabled=false;btn.textContent='Acessar central';}
}
async function sair(){
  // Não anunciar saída concluída sem o servidor apagar o cookie HttpOnly.
  try{
    await autenticacao('logout');
    limpar();
    el('email').value='';
  }catch(_){
    texto('status','Não foi possível encerrar a sessão neste dispositivo. Verifique a conexão e tente novamente.');
  }
}
function texto(id,value){el(id).textContent=value;}
function dataFormat(iso){
  try{return new Intl.DateTimeFormat('pt-BR',{day:'2-digit',month:'2-digit',year:'numeric',hour:'2-digit',minute:'2-digit',timeZone:'America/Sao_Paulo'}).format(new Date(iso));}
  catch(_){return '—';}
}
function semDados(node){
  node.replaceChildren();
  const p=d.createElement('p');p.className='empty';p.textContent='Ainda não há dados neste período.';node.appendChild(p);
}
function barras(id,items,rotulo,valor,limit){
  const root=el(id);root.replaceChildren();
  if(!items?.length){semDados(root);return;}
  const top=Math.max(1,...items.map(v=>Number(valor(v)||0)));
  items.slice(0,limit||25).forEach((it)=>{
    const n=Number(valor(it)||0);
    const row=d.createElement('div');row.className='bar-item';
    const title=d.createElement('span');title.className='bar-name';title.textContent=rotulo(it)||'Não informado';
    const count=d.createElement('span');count.className='bar-count';count.textContent=fmt(n);
    const track=d.createElement('div');track.className='bar-line';
    const fill=d.createElement('div');fill.className='bar-fill';fill.style.width=Math.max(n>0?2:0,(n/top)*100)+'%';
    track.appendChild(fill);row.append(title,count,track);root.appendChild(row);
  });
}
function tabela(id,rows,campos){
  const body=el(id);body.replaceChildren();
  if(!rows?.length){
    const tr=d.createElement('tr'),td=d.createElement('td');td.colSpan=campos.length;
    td.textContent='Sem dados no período.';td.className='empty';tr.appendChild(td);body.appendChild(tr);return;
  }
  rows.forEach(r=>{
    const tr=d.createElement('tr');
    campos.forEach(f=>{
      const td=d.createElement('td');
      td.textContent=String(f(r)??'—');
      tr.appendChild(td);
    });
    body.appendChild(tr);
  });
}
function desenharGrafico(data){
  const root=el('trend');root.replaceChildren();
  if(!data?.length){semDados(root);return;}
  const series=data.slice(-90);
  const w=700,h=260,padX=40,padY=22,usable=w-2*padX,bottom=h-44;
  const top=Math.max(1,...series.map(x=>Math.max(x.sessions||0,x.views||0)));
  const pos=(i,val)=>[padX+(series.length<=1?usable/2:i*usable/(series.length-1)),bottom-(Number(val||0)/top)*(bottom-padY)];
  const svg=d.createElementNS('http://www.w3.org/2000/svg','svg');
  svg.setAttribute('viewBox','0 0 '+w+' '+h);svg.setAttribute('role','img');
  svg.setAttribute('aria-label','Gráfico de sessões e visualizações de uso do Hub');
  [0,.25,.5,.75,1].forEach(f=>{
    const y=bottom-f*(bottom-padY);
    const ln=d.createElementNS('http://www.w3.org/2000/svg','line');
    for(const [k,v] of Object.entries({x1:padX,y1:y,x2:w-padX,y2:y,stroke:'#e8eef6','stroke-width':'1'}))ln.setAttribute(k,v);
    svg.appendChild(ln);
    const label=d.createElementNS('http://www.w3.org/2000/svg','text');
    label.setAttribute('x','1');label.setAttribute('y',String(y+4));label.setAttribute('font-size','11');
    label.setAttribute('fill','#6d8397');label.textContent=String(Math.round(top*f));svg.appendChild(label);
  });
  for(const [key,color] of [['sessions','#1d5d91'],['views','#81abbe']]){
    const path=d.createElementNS('http://www.w3.org/2000/svg','polyline');
    path.setAttribute('points',series.map((it,i)=>pos(i,it[key]).map(v=>v.toFixed(1)).join(',')).join(' '));
    path.setAttribute('fill','none');path.setAttribute('stroke',color);path.setAttribute('stroke-width','3');
    path.setAttribute('stroke-linejoin','round');path.setAttribute('stroke-linecap','round');svg.appendChild(path);
  }
  const dateLabel=(item,i)=>{
    const t=d.createElementNS('http://www.w3.org/2000/svg','text');
    t.setAttribute('x',pos(i,0)[0]);t.setAttribute('y',h-13);t.setAttribute('text-anchor','middle');
    t.setAttribute('font-size','11');t.setAttribute('fill','#6d8397');
    const date=new Date(item.date+'T12:00:00Z');
    t.textContent=new Intl.DateTimeFormat('pt-BR',{day:'2-digit',month:'2-digit',timeZone:'UTC'}).format(date);
    svg.appendChild(t);
  };
  dateLabel(series[0],0);
  if(series.length>1)dateLabel(series[series.length-1],series.length-1);
  root.appendChild(svg);
  const legend=d.createElement('div');legend.className='chart-caption';
  legend.innerHTML='<span><i></i>Sessões</span><span><i style="background:#81abbe"></i>Visualizações</span>';
  root.appendChild(legend);
}

/* Localização é aproximada e opt-in: cada linha representa uma sessão, nunca uma pessoa.
   Registros antigos são posicionados no centro do estado/região; não é GPS. */
const BR_ESTADOS={
 AC:[-9.0,-70.8],AL:[-9.6,-36.8],AP:[1.4,-51.8],AM:[-3.4,-64.7],BA:[-12.7,-41.7],
 CE:[-5.3,-39.5],DF:[-15.8,-47.9],ES:[-19.2,-40.3],GO:[-16.0,-49.7],
 MA:[-5.0,-45.3],MT:[-12.7,-55.6],MS:[-20.5,-54.7],MG:[-18.5,-44.6],
 PA:[-3.4,-52.0],PB:[-7.1,-36.8],PR:[-24.9,-51.6],PE:[-8.3,-37.9],
 PI:[-7.7,-42.8],RJ:[-22.2,-42.5],RN:[-5.8,-36.5],RS:[-30.0,-53.1],
 RO:[-11.2,-62.7],RR:[2.1,-61.4],SC:[-27.2,-50.5],SP:[-22.3,-48.6],
 SE:[-10.6,-37.4],TO:[-10.2,-48.3]
};
const PY_REGIOES={
 '0':[-25.3,-57.6],'1':[-22.9,-57.0],'2':[-24.0,-56.8],'3':[-25.4,-56.8],
 '4':[-25.9,-56.0],'5':[-25.5,-55.6],'6':[-26.6,-55.9],'7':[-26.8,-55.4],
 '8':[-27.1,-57.1],'9':[-25.2,-57.0],'10':[-25.5,-54.7],
 '11':[-24.9,-57.2],'12':[-22.2,-60.0],'13':[-23.5,-58.5],
 '14':[-23.3,-56.5],'15':[-20.9,-59.8],'16':[-25.0,-57.5],'17':[-23.3,-58.3]
};
const PAISES={
 BR:[-14.2,-51.9],PY:[-23.4,-58.4],AR:[-38.4,-63.6],UY:[-32.5,-55.8],
 CL:[-35.7,-71.5],BO:[-16.3,-63.6],PE:[-9.2,-75.0],CO:[4.6,-74.1],
 US:[39.8,-98.6],CA:[56.1,-106.3],MX:[23.6,-102.6],PT:[39.7,-8.0],
 ES:[40.5,-3.7],FR:[46.6,2.2],DE:[51.2,10.5],IT:[42.8,12.5],
 GB:[55.3,-3.4],JP:[36.2,138.3],AU:[-25.3,133.8]
};
let geoMap=null,mapLayer=null,mapSessions=[],mapFiltered=[],mapGroups=[],mapPage=0;
const mapPageSize=40;
const geoNames=typeof Intl.DisplayNames==='function'?new Intl.DisplayNames(['pt-BR'],{type:'region'}):null;
function paisNome(code){
  try{return /^[A-Z]{2}$/.test(code||'')?(geoNames?.of(code)||code):'País não informado';}
  catch(_){return code||'País não informado';}
}
const NOMES_UF={
 AC:'Acre',AL:'Alagoas',AP:'Amapá',AM:'Amazonas',BA:'Bahia',CE:'Ceará',DF:'Distrito Federal',
 ES:'Espírito Santo',GO:'Goiás',MA:'Maranhão',MT:'Mato Grosso',MS:'Mato Grosso do Sul',
 MG:'Minas Gerais',PA:'Pará',PB:'Paraíba',PR:'Paraná',PE:'Pernambuco',PI:'Piauí',
 RJ:'Rio de Janeiro',RN:'Rio Grande do Norte',RS:'Rio Grande do Sul',RO:'Rondônia',
 RR:'Roraima',SC:'Santa Catarina',SP:'São Paulo',SE:'Sergipe',TO:'Tocantins'
};
function regiaoNome(country,region){
  const code=String(region||'').trim();
  if(!code)return '';
  if(country==='BR')return NOMES_UF[code.toUpperCase()]||code;
  if(country==='PY'&&code==='10')return 'Alto Paraná';
  return code;
}
window.hubCentralRegiaoNome=regiaoNome;
function localNome(r){
  const country=String(r.country||'');
  const place=regiaoNome(country,r.region);
  if(r.city&&String(r.city).trim())
    return [String(r.city).trim(),place,paisNome(country)].filter(Boolean).join(' · ');
  const readable=[place,paisNome(country)].filter(Boolean).join(' · ');
  return readable+(place?' (cidade não registrada)':' (localidade sem precisão municipal)');
}
function pontoSessao(r){
  if(r.geo_lat!==null&&r.geo_lon!==null&&r.geo_lat!==undefined&&r.geo_lon!==undefined){
    const lat=Number(r.geo_lat),lon=Number(r.geo_lon);
    if(Number.isFinite(lat)&&Number.isFinite(lon)&&Math.abs(lat)<=90&&Math.abs(lon)<=180)
      return {lat,lon,precisao:'Cidade/região estimada pela rede (aproximada)'};
  }
  const country=String(r.country||''),region=String(r.region||'').toUpperCase();
  const center=country==='BR'?BR_ESTADOS[region]:
    country==='PY'?PY_REGIOES[region]:null;
  if(center)return {lat:center[0],lon:center[1],precisao:'Centro aproximado do estado ou região (histórico)'};
  if(PAISES[country]){
    const p=PAISES[country];
    return {lat:p[0],lon:p[1],precisao:'Centro aproximado do país (histórico)'};
  }
  return null;
}
window.hubCentralPontoSessao=pontoSessao;
window.hubCentralLocalNome=localNome;
function normalizarBusca(str){
  return String(str||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase();
}
function mapearGrupos(rows){
  const groups=new Map();
  rows.forEach(row=>{
    const pos=pontoSessao(row);
    if(!pos)return;
    // Coordenadas repetidas não recebem deslocamento artificial, que sugeriria precisão inexistente.
    const id=pos.lat.toFixed(2)+':'+pos.lon.toFixed(2);
    let item=groups.get(id);
    if(!item){item={lat:pos.lat,lon:pos.lon,rows:[],labels:new Set(),precisao:pos.precisao};groups.set(id,item);}
    item.rows.push(row);
    item.labels.add(localNome(row));
  });
  return Array.from(groups.values());
}
function criarPopup(item){
  const popup=d.createElement('div');
  const h=d.createElement('div');h.className='map-popup-title';
  h.textContent=Array.from(item.labels).slice(0,2).join(' / ');
  popup.appendChild(h);
  const info=d.createElement('div');info.className='map-popup-row';
  info.textContent=fmt(item.rows.length)+' '+(item.rows.length===1?'sessão registrada':'sessões registradas');
  popup.appendChild(info);
  const last=d.createElement('div');last.className='map-popup-row';
  last.textContent='Mais recente: '+dataFormat(item.rows[0].recorded_at);
  popup.appendChild(last);
  const precision=d.createElement('div');precision.className='map-popup-row';
  precision.textContent=item.precisao;
  popup.appendChild(precision);
  return popup;
}
function caberMapa(){
  if(!geoMap||!mapGroups.length)return;
  const bounds=window.L.latLngBounds(mapGroups.map(p=>[p.lat,p.lon]));
  if(mapGroups.length===1)geoMap.setView([mapGroups[0].lat,mapGroups[0].lon],mapGroups[0].precisao.includes('estado')?5:7);
  else geoMap.fitBounds(bounds.pad(.18),{padding:[24,24],maxZoom:9});
}
function desenharMapa(){
  if(!el('panel-mapa').classList.contains('active'))return;
  const root=el('accessMap');
  if(!window.L){
    texto('mapNotice','O mapa interativo não carregou. A lista de sessões continua disponível.');
    return;
  }
  if(!geoMap){
    geoMap=window.L.map(root,{scrollWheelZoom:false,zoomControl:true}).setView([-16,-51],4);
    window.L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png',{
      attribution:'&copy; OpenStreetMap contributors',maxZoom:16
    }).addTo(geoMap);
    mapLayer=window.L.layerGroup().addTo(geoMap);
  }
  mapLayer.clearLayers();
  mapGroups.forEach(item=>{
    const count=item.rows.length;
    const radius=Math.min(25,7+Math.sqrt(count)*2.1);
    item.marker=window.L.circleMarker([item.lat,item.lon],{
      radius,stroke:true,color:'#fff',weight:2.5,
      fillColor:'#1e5b8d',fillOpacity:.83
    }).addTo(mapLayer).bindPopup(criarPopup(item),{maxWidth:275});
    item.marker.bindTooltip(fmt(count)+' '+(count===1?'sessão':'sessões'),{direction:'top'});
  });
  geoMap.invalidateSize();
  if(mapGroups.length)caberMapa();
}
function listarSessoes(){
  const body=el('mapSessionsTable');body.replaceChildren();
  const pages=Math.max(1,Math.ceil(mapFiltered.length/mapPageSize));
  mapPage=Math.min(mapPage,pages-1);
  const begin=mapPage*mapPageSize;
  mapFiltered.slice(begin,begin+mapPageSize).forEach((r,i)=>{
    const tr=d.createElement('tr');
    const cells=[dataFormat(r.recorded_at),localNome(r),r.device||'Não informado'];
    cells.forEach(t=>{const td=d.createElement('td');td.textContent=t;tr.appendChild(td);});
    const td=d.createElement('td');
    const pos=pontoSessao(r);
    if(pos){
      const btn=d.createElement('button');btn.type='button';btn.className='map-locate';
      btn.textContent='Ver';btn.dataset.mapIndex=String(begin+i);
      btn.setAttribute('aria-label','Ver local aproximado no mapa');
      td.appendChild(btn);
    }else td.textContent='—';
    tr.appendChild(td);body.appendChild(tr);
  });
  if(!mapFiltered.length){
    const tr=d.createElement('tr'),td=d.createElement('td');
    td.colSpan=4;td.className='empty';td.textContent='Nenhuma sessão encontrada para este filtro.';
    tr.appendChild(td);body.appendChild(tr);
  }
  texto('mapPageInfo',fmt(mapFiltered.length)+' sessões · página '+(mapPage+1)+' de '+pages);
  el('mapPrev').disabled=mapPage===0;
  el('mapNext').disabled=mapPage>=pages-1;
}
function atualizarMapa(){
  const filter=normalizarBusca(el('mapFilter').value.trim());
  mapFiltered=filter?mapSessions.filter(x=>normalizarBusca(localNome(x)).includes(filter)):mapSessions.slice();
  mapGroups=mapearGrupos(mapFiltered);
  mapPage=0;listarSessoes();
  const positioned=mapFiltered.filter(r=>pontoSessao(r)).length;
  texto('mapSummary',fmt(positioned)+' de '+fmt(mapFiltered.length)+' sessões localizadas');
  const onlyRegion=mapFiltered.filter(r=>!r.city&&r.region).length;
  texto('mapNotice',fmt(mapGroups.length)+' localidades representadas. '+
    (onlyRegion?fmt(onlyRegion)+' sessões exibidas apenas por estado ou região, pois a cidade não foi coletada. ':'')+
    'Os pontos são aproximados e não representam endereços de visitantes.');
  desenharMapa();
}
async function carregarMapa(){
  try{
    const start=new Date(Date.now()-days*86400000).toISOString();
    const columns='recorded_at,session_key,country,region,city,geo_lat,geo_lon,device';
    const rows=[];
    let offset=0;
    while(offset<100000){
      const path='/rest/v1/hub_analytics_events?select='+columns+
        '&event_type=eq.session_start&recorded_at=gte.'+encodeURIComponent(start)+
        '&order=recorded_at.desc&limit=1000&offset='+offset;
      const chunk=await supa(path);
      if(!Array.isArray(chunk))throw new Error('Consulta geográfica indisponível');
      rows.push(...chunk);
      offset+=chunk.length;
      if(chunk.length<1000)break;
    }
    // session_start é único por sessão; não multiplicar visualizações e cliques.
    mapSessions=rows;
    atualizarMapa();
    window.dispatchEvent(new CustomEvent('hub:central-map',{detail:{rows:mapSessions,days}}));
    if(offset>=100000)texto('mapNotice','Exibidas as 100 mil sessões mais recentes. Reduza o período para consultar mais acessos.');
  }catch(err){
    mapSessions=[];atualizarMapa();
    window.dispatchEvent(new CustomEvent('hub:central-map',{detail:{rows:[],days,error:true}}));
    texto('mapNotice','Não foi possível consultar as localizações: '+(err.message||'erro desconhecido'));
  }
}
function abrirSessaoNoMapa(index){
  const row=mapFiltered[index],pos=row&&pontoSessao(row);
  if(!pos||!geoMap)return;
  geoMap.setView([pos.lat,pos.lon],Math.max(6,Math.min(9,geoMap.getZoom())));
  const item=mapGroups.find(g=>g.rows.includes(row));
  if(item?.marker)item.marker.openPopup();
  el('accessMap').scrollIntoView({behavior:'smooth',block:'start'});
}

function apresentar(){
  if(!report)return;
  const t=report.totals||{};
  texto('kSessions',fmt(t.sessions));texto('kViews',fmt(t.page_views));texto('kClicks',fmt(t.clicks));
  texto('kEvents',fmt(t.events));
  const min=Number(t.seconds_visible||0)/60;
  texto('kTime',min>=60?(min/60).toLocaleString('pt-BR',{maximumFractionDigits:1})+' h':Math.round(min)+' min');
  desenharGrafico(report.daily);
  barras('hours',report.hours,it=>String(it.hour).padStart(2,'0')+'h',it=>it.sessions,24);
  barras('topFeatures',report.features,it=>it.name,it=>it.count,9);
  barras('allFeatures',report.features,it=>it.name,it=>it.count,35);
  barras('topSources',report.sources,it=>it.name,it=>it.sessions,12);
  barras('devices',report.devices,it=>it.name,it=>it.sessions,8);
  barras('systems',report.operating_systems,it=>it.name,it=>it.sessions,8);
  barras('browsers',report.browsers,it=>it.name,it=>it.sessions,8);
  tabela('actionsTable',report.actions,[r=>r.feature,r=>r.action,r=>fmt(r.count)]);
  tabela('locationsTable',report.locations,[r=>paisNome(r.country),r=>regiaoNome(r.country,r.region)||'Região não registrada',r=>fmt(r.sessions)]);
  tabela('recentTable',report.recent,[
    r=>dataFormat(r.at),r=>r.type,r=>r.feature,r=>r.action,r=>r.device,r=>[regiaoNome(r.country,r.region),paisNome(r.country)].filter(Boolean).join(' / ')||'—'
  ]);
}
async function carregar(){
  if(loading||!admin)return;
  loading=true;el('reload').disabled=true;texto('status','Consultando dados…');
  try{
    report=await supa('/rest/v1/rpc/hub_analytics_report','POST',{p_days:days});
    apresentar();
    window.dispatchEvent(new CustomEvent('hub:central-report',{detail:{days,report}}));
    await carregarMapa();
    texto('status','Relatório carregado · coleta sujeita à autorização dos visitantes');
    texto('updated','Atualizado: '+dataFormat(report.generated_at));
  }catch(e){
    texto('status','Não foi possível carregar: '+e.message);
    if(/sessão expirada|conta administradora|não autorizado/i.test(e.message))limpar();
  }finally{loading=false;el('reload').disabled=false;}
}
function csvField(input){
  let s=String(input??'');
  if(/^[=+\-@]/.test(s))s="'"+s;
  return '"'+s.replace(/"/g,'""')+'"';
}
function baixar(nome,conteudo,tipo){
  const b=new Blob(['\uFEFF',conteudo],{type:tipo||'text/csv;charset=utf-8'});
  const url=URL.createObjectURL(b);
  const a=d.createElement('a');a.href=url;a.download=nome;d.body.appendChild(a);a.click();a.remove();
  setTimeout(()=>URL.revokeObjectURL(url),1000);
}
async function exportar(){
  if(!admin)return;
  const btn=el('download');btn.disabled=true;btn.textContent='Preparando CSV…';
  try{
    const start=new Date(Date.now()-days*86400000).toISOString();
    const cols=['recorded_at','session_key','event_type','feature','action','seconds_visible','country','region','city','geo_lat','geo_lon','device','os','browser','display_mode','viewport','referrer_host'];
    const lines=[cols.map(csvField).join(';')];
    let offset=0;
    while(true){
      const path='/rest/v1/hub_analytics_events?select='+cols.join(',')+
        '&recorded_at=gte.'+encodeURIComponent(start)+'&order=recorded_at.desc&limit=1000&offset='+offset;
      const rows=await supa(path);
      if(!Array.isArray(rows))throw new Error('Retorno de dados inválido.');
      rows.forEach(r=>lines.push(cols.map(c=>csvField(r[c])).join(';')));
      offset+=rows.length;
      if(rows.length<1000)break;
      if(offset>=100000){texto('status','Exportação limitada a 100 mil eventos por vez. Reduza o período para completar o histórico.');break;}
    }
    baixar('hub-eventos-'+days+'d-'+new Date().toISOString().slice(0,10)+'.csv',lines.join('\r\n'));
  }catch(e){texto('status','Falha ao exportar: '+e.message);}
  finally{btn.disabled=false;btn.textContent='Exportar eventos CSV';}
}
function abas(){
  d.querySelectorAll('[data-tab]').forEach(btn=>btn.addEventListener('click',()=>{
    d.querySelectorAll('[data-tab]').forEach(b=>b.classList.toggle('active',b===btn));
    d.querySelectorAll('.panel-group').forEach(panel=>panel.classList.toggle('active',panel.id==='panel-'+btn.dataset.tab));
    if(btn.dataset.tab==='mapa')requestAnimationFrame(desenharMapa);
  }));
}
function init(){
  // Apaga tokens antigos gravados em versões anteriores. O novo login nunca os utiliza.
  try{sessionStorage.removeItem('hub_secure_auth');}catch(_){}
  el('loginForm').addEventListener('submit',login);
  el('logout').addEventListener('click',sair);
  el('period').addEventListener('change',e=>{days=Number(e.target.value)||30;carregar();});
  el('reload').addEventListener('click',carregar);
  // Central aberta: atualiza métricas e mapa sem exigir recarregar a página.
  // Nenhuma consulta é feita enquanto o painel estiver bloqueado ou oculto.
  setInterval(()=>{if(admin&&!loading&&!d.hidden)carregar();},5*60*1000);
  d.addEventListener('visibilitychange',()=>{
    if(!d.hidden&&admin&&!loading&&report?.generated_at){
      const last=new Date(report.generated_at).getTime();
      if(Number.isFinite(last)&&Date.now()-last>5*60*1000)carregar();
    }
  });
  el('download').addEventListener('click',exportar);
  el('mapFilter').addEventListener('input',atualizarMapa);
  el('mapReset').addEventListener('click',()=>{el('mapFilter').value='';atualizarMapa();caberMapa();});
  el('mapPrev').addEventListener('click',()=>{if(mapPage>0){mapPage--;listarSessoes();}});
  el('mapNext').addEventListener('click',()=>{mapPage++;listarSessoes();});
  el('mapSessionsTable').addEventListener('click',e=>{
    const btn=e.target.closest('[data-map-index]');
    if(btn)abrirSessaoNoMapa(Number(btn.dataset.mapIndex));
  });
  abas();
  // Navegadores já autenticados retomam a sessão automaticamente via cookie protegido.
  // Um navegador novo não possui cookie e continua exigindo senha.
  token().then(verificar).catch(e=>{
    limpar();
    if(e.status!==401)el('loginError').textContent=e.status===503?
      'Serviço temporariamente indisponível. Tente novamente.':
      (e.status===403?'Acesso negado.':'Entre com sua conta para continuar.');
  });
}
if(d.readyState==='loading')d.addEventListener('DOMContentLoaded',init);else init();
})();
