/* Central administrativa: nenhuma informação é carregada sem JWT + RLS de administrador. */
(function(){
'use strict';
const SB='https://jpdtqtenlivxgjkyizcg.supabase.co';
const KEY='sb_publishable_CzAI8BUm2Po7CfobLlxv8A_NtuTil8j';
const AUTH='hub_secure_auth';
const d=document;
const el=id=>d.getElementById(id);
const fmt=n=>new Intl.NumberFormat('pt-BR').format(Number(n||0));
let report=null,days=30,loading=false,admin=false;
function credenciais(){try{return JSON.parse(sessionStorage.getItem(AUTH)||'{}');}catch(_){return {};}}
function gravarAuth(result){
  const parts=String(result.access_token||'').split('.');
  let exp=Date.now()+1800000;
  try{exp=JSON.parse(atob(parts[1].replace(/-/g,'+').replace(/_/g,'/'))).exp*1000;}catch(_){}
  sessionStorage.setItem(AUTH,JSON.stringify({access:result.access_token,refresh:result.refresh_token,exp}));
}
function limpar(){
  sessionStorage.removeItem(AUTH);
  admin=false;report=null;el('dashboard').hidden=true;el('authPanel').hidden=false;el('logout').hidden=true;
}
async function token(){
  const a=credenciais();
  if(a.access&&a.exp>Date.now()+40000)return a.access;
  if(!a.refresh)throw new Error('Entre com sua conta administradora.');
  const resp=await fetch(SB+'/auth/v1/token?grant_type=refresh_token',{
    method:'POST',headers:{apikey:KEY,'Content-Type':'application/json'},
    body:JSON.stringify({refresh_token:a.refresh})
  });
  const data=await resp.json().catch(()=>({}));
  if(!resp.ok||!data.access_token){limpar();throw new Error('Sessão expirada. Faça login novamente.');}
  gravarAuth(data);
  return data.access_token;
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
    const a=credenciais();a.exp=0;sessionStorage.setItem(AUTH,JSON.stringify(a));
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
  if(!Array.isArray(roles)||roles.length!==1)throw new Error('Esta conta não possui autorização para consultar a central.');
  admin=true;
  el('authPanel').hidden=true;el('dashboard').hidden=false;el('logout').hidden=false;
  await carregar();
}
async function login(e){
  e.preventDefault();
  el('loginError').textContent='';
  const btn=el('loginButton');btn.disabled=true;btn.textContent='Autenticando…';
  try{
    const resp=await fetch(SB+'/auth/v1/token?grant_type=password',{
      method:'POST',headers:{apikey:KEY,'Content-Type':'application/json'},
      body:JSON.stringify({email:el('email').value.trim(),password:el('password').value})
    });
    const data=await resp.json().catch(()=>({}));
    if(!resp.ok||!data.access_token)throw new Error('Não foi possível autenticar. Confira sua conta e sua senha.');
    gravarAuth(data);el('password').value='';
    await verificar();
  }catch(err){
    el('loginError').textContent=err.message||'Falha de autenticação.';
    limpar();
  }finally{btn.disabled=false;btn.textContent='Acessar central';}
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
  tabela('locationsTable',report.locations,[r=>r.country,r=>r.region,r=>fmt(r.sessions)]);
  tabela('recentTable',report.recent,[
    r=>dataFormat(r.at),r=>r.type,r=>r.feature,r=>r.action,r=>r.device,r=>[r.region,r.country].filter(Boolean).join(' / ')||'—'
  ]);
}
async function carregar(){
  if(loading||!admin)return;
  loading=true;el('reload').disabled=true;texto('status','Consultando dados…');
  try{
    report=await supa('/rest/v1/rpc/hub_analytics_report','POST',{p_days:days});
    apresentar();
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
    const cols=['recorded_at','session_key','event_type','feature','action','seconds_visible','country','region','device','os','browser','display_mode','viewport','referrer_host'];
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
  }));
}
function init(){
  el('loginForm').addEventListener('submit',login);
  el('logout').addEventListener('click',()=>{limpar();el('email').value='';});
  el('period').addEventListener('change',e=>{days=Number(e.target.value)||30;carregar();});
  el('reload').addEventListener('click',carregar);
  el('download').addEventListener('click',exportar);
  abas();
  if(credenciais().access){
    verificar().catch(e=>{limpar();el('loginError').textContent=e.message||'É necessário entrar novamente.';});
  }
}
if(d.readyState==='loading')d.addEventListener('DOMContentLoaded',init);else init();
})();
