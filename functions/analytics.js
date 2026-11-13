// Cloudflare Pages Function: POST /analytics
// Registro mínimo de eventos; não recebe texto livre, IP, identificadores de paciente ou de conta.
const SB = 'https://jpdtqtenlivxgjkyizcg.supabase.co';
const PUBLIC_KEY = 'sb_publishable_CzAI8BUm2Po7CfobLlxv8A_NtuTil8j';
const JSON_HEADERS = {'Content-Type':'application/json; charset=utf-8','Cache-Control':'no-store','X-Content-Type-Options':'nosniff'};
const EVENTOS = new Set(['session_start','page_view','click','feature_open','screen_time']);
const IDENTIFICADOR = /^[a-zA-Z0-9_.:-]{1,80}$/;
const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
function retorno(status, erro){
  return new Response(erro?JSON.stringify({erro}):null,{status,headers:JSON_HEADERS});
}
function ambiente(ua){
  const tablet=/iPad|Tablet|Android(?!.*Mobile)/i.test(ua);
  const mobile=/iPhone|iPod|Android.*Mobile|Mobile/i.test(ua);
  const device=tablet?'tablet':mobile?'celular':/Windows|Macintosh|Linux|X11/i.test(ua)?'computador':'outro';
  const os=/Android/i.test(ua)?'Android':/iPhone|iPad|iPod/i.test(ua)?'iOS':/Windows/i.test(ua)?'Windows':/Macintosh|Mac OS/i.test(ua)?'macOS':/Linux/i.test(ua)?'Linux':'Outro';
  const browser=/SamsungBrowser/i.test(ua)?'Samsung Internet':/Edg\//i.test(ua)?'Edge':/Firefox|FxiOS/i.test(ua)?'Firefox':/Chrome|CriOS/i.test(ua)?'Chrome':/Safari/i.test(ua)?'Safari':'Outro';
  return {device,os,browser};
}
export async function onRequestPost({request,env}){
  const url=new URL(request.url);
  const origin=request.headers.get('Origin');
  const site=request.headers.get('Sec-Fetch-Site');
  if((origin&&origin!==url.origin)||(site&&!['same-origin','none'].includes(site))) return retorno(403,'Origem não autorizada.');
  if(!/^application\/json(?:;|$)/i.test(request.headers.get('Content-Type')||'')) return retorno(415,'Formato inválido.');
  if(Number(request.headers.get('Content-Length')||'0')>1500) return retorno(413,'Evento excede o limite.');
  let x;
  try{x=await request.json();}catch(_){return retorno(400,'JSON inválido.');}
  if(!x||typeof x!=='object'||Array.isArray(x)) return retorno(400,'Evento inválido.');
  if(!EVENTOS.has(x.event_type)||!UUID.test(x.session_key||'')||!IDENTIFICADOR.test(x.feature||'')||!IDENTIFICADOR.test(x.action||'-')) return retorno(400,'Parâmetros inválidos.');
  const seconds=Math.trunc(Number(x.seconds_visible||0));
  if(!Number.isFinite(seconds)||seconds<0||seconds>3600) return retorno(400,'Duração inválida.');
  const ua=request.headers.get('User-Agent')||'';
  const {device,os,browser}=ambiente(ua);
  const cf=request.cf||{};
  const country=/^[A-Z]{2}$/.test(cf.country||'')?cf.country:null;
  const region=String(cf.regionCode||cf.region||'').replace(/[^a-zA-Z0-9 ._-]/g,'').slice(0,60)||null;
  // A Cloudflare estima a localização pela rede; arredondamento a ~11 km,
  // sem coletar IP bruto, GPS, código postal ou localização do navegador.
  const city=country&&typeof cf.city==='string'
    ? (cf.city.trim().replace(/[<>\x00-\x1F]/g,'').slice(0,80)||null):null;
  const hasCoords=cf.latitude!=null&&cf.longitude!=null&&String(cf.latitude).trim()!==''&&String(cf.longitude).trim()!=='';
  const lat=hasCoords?Number(cf.latitude):NaN;
  const lon=hasCoords?Number(cf.longitude):NaN;
  const coordsOk=country&&Number.isFinite(lat)&&Number.isFinite(lon)&&lat>=-90&&lat<=90&&lon>=-180&&lon<=180;
  const geo_lat=coordsOk?Math.round(lat*10)/10:null;
  const geo_lon=coordsOk?Math.round(lon*10)/10:null;
  const referrer=/^[a-z0-9.:-]{1,100}$/i.test(x.referrer_host||'')?x.referrer_host.toLowerCase():'direto';
  const viewport=['pequena','media','grande'].includes(x.viewport)?x.viewport:'media';
  const display_mode=x.display_mode==='PWA'?'PWA':'navegador';
  const payload={session_key:x.session_key,event_type:x.event_type,
    feature:x.feature,action:x.action||'-',seconds_visible:seconds,
    country,region,city,geo_lat,geo_lon,device,os,browser,display_mode,viewport,referrer_host:referrer,source:'hub-pwa'};
  try{
    const result=await fetch(SB+'/rest/v1/hub_analytics_events',{
      method:'POST',headers:{apikey:env?.SUPABASE_PUBLISHABLE_KEY||PUBLIC_KEY,
        'Content-Type':'application/json','Prefer':'return=minimal'},
      body:JSON.stringify(payload)
    });
    if(!result.ok)return retorno(503,'Coleta indisponível.');
    return retorno(204);
  }catch(_){return retorno(503,'Coleta indisponível.');}
}
export async function onRequestGet(){
  return retorno(405,'Método não permitido.');
}
