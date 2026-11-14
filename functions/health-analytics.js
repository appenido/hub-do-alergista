// Cloudflare Pages Function: POST /health-analytics
// Métricas técnicas sem URL, mensagem/stack de erro, IP ou dados digitados.
const API='https://jpdtqtenlivxgjkyizcg.supabase.co';
const PUBLIC_KEY='sb_publishable_CzAI8BUm2Po7CfobLlxv8A_NtuTil8j';
const ALLOWED=new Set(['ttfb_ms','dom_ready_ms','lcp_ms','cls_score','interaction_latency_ms','js_error','offline']);
const UUID=/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const SAFE=/^[a-zA-Z0-9_.:-]{1,64}$/;
function reply(code,msg){
 return new Response(msg?JSON.stringify({erro:msg}):null,{
  status:code,headers:{'Content-Type':'application/json; charset=utf-8','Cache-Control':'no-store','X-Content-Type-Options':'nosniff'}
 });
}
export async function onRequestPost({request,env}){
 const url=new URL(request.url);
 const origin=request.headers.get('Origin'),fetchSite=request.headers.get('Sec-Fetch-Site');
 if((origin&&origin!==url.origin)||(fetchSite&&!['same-origin','none'].includes(fetchSite)))return reply(403,'Origem inválida');
 if(!/^application\/json(?:;|$)/i.test(request.headers.get('Content-Type')||''))return reply(415,'Formato inválido');
 if(Number(request.headers.get('Content-Length')||0)>800)return reply(413,'Evento muito grande');
 let x;
 try{x=await request.json();}catch(_){return reply(400,'JSON inválido');}
 if(!x||typeof x!=='object'||Array.isArray(x)||JSON.stringify(x).length>800)return reply(400,'Evento inválido');
 if(!UUID.test(x.session_key||'')||!ALLOWED.has(x.metric)||!SAFE.test(x.feature||''))return reply(400,'Campos inválidos');
 const value=Number(x.value);
 if(!Number.isFinite(value)||value<0||value>300000||(x.metric==='cls_score'&&value>25))return reply(400,'Métrica inválida');
 if(['js_error','offline'].includes(x.metric)&&value!==1)return reply(400,'Valor de evento inválido');
 const ua=request.headers.get('User-Agent')||'';
 const device=/iPad|Tablet|Android(?!.*Mobile)/i.test(ua)?'tablet':/iPhone|iPod|Android.*Mobile|Mobile/i.test(ua)?'celular':/Windows|Macintosh|Linux|X11/i.test(ua)?'computador':'outro';
 const os=/Android/i.test(ua)?'Android':/iPhone|iPad|iPod/i.test(ua)?'iOS':/Windows/i.test(ua)?'Windows':/Macintosh|Mac OS/i.test(ua)?'macOS':/Linux/i.test(ua)?'Linux':'Outro';
 const browser=/SamsungBrowser/i.test(ua)?'Samsung Internet':/Edg\//i.test(ua)?'Edge':/Firefox|FxiOS/i.test(ua)?'Firefox':/Chrome|CriOS/i.test(ua)?'Chrome':/Safari/i.test(ua)?'Safari':'Outro';
 const body={session_key:x.session_key,metric:x.metric,value:Math.round(value*1000)/1000,
  feature:x.feature,device,os,browser};
 try{
  const result=await fetch(API+'/rest/v1/hub_analytics_quality',{
   method:'POST',headers:{apikey:env?.SUPABASE_PUBLISHABLE_KEY||PUBLIC_KEY,'Content-Type':'application/json','Prefer':'return=minimal'},
   body:JSON.stringify(body)
  });
  if(!result.ok)return reply(503,'Coleta técnica indisponível');
  return reply(204);
 }catch(_){return reply(503,'Coleta técnica indisponível');}
}
export async function onRequestGet(){return reply(405,'Método não permitido');}
