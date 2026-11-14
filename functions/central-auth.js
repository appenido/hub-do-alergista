/* Central administrativa: autenticação exclusiva via Supabase Auth + RLS.
   A renovação reside somente em cookie HttpOnly/Secure/SameSite=Strict.
   Não armazenar senha, refresh token, usuário, email ou IP em logs. */
const SUPABASE='https://jpdtqtenlivxgjkyizcg.supabase.co';
const FALLBACK_KEY='sb_publishable_CzAI8BUm2Po7CfobLlxv8A_NtuTil8j';
const COOKIE='__Host-hub_admin_rt';
// Marcador não identificável: exclui as métricas deste navegador por 365 dias.
const EXCLUSION_COOKIE='__Host-hub_admin_notrack';
const EXCLUSION_MAX_AGE=365*24*60*60;
const COOKIE_MAX_AGE=30*24*60*60;
const UUID=/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const RESPONSE_HEADERS={
 'Content-Type':'application/json; charset=utf-8',
 'Cache-Control':'no-store, private, max-age=0',
 'Pragma':'no-cache',
 'X-Content-Type-Options':'nosniff',
 'X-Frame-Options':'DENY',
 'Referrer-Policy':'no-referrer',
 'Vary':'Cookie'
};
function result(status,body,refresh,excludeOwner=false){
 const headers=new Headers(RESPONSE_HEADERS);
 if(refresh!==undefined){
  const parts=[COOKIE+'='+(refresh?encodeURIComponent(refresh):''),
   'Path=/','HttpOnly','Secure','SameSite=Strict','Priority=High',
   'Max-Age='+(refresh?COOKIE_MAX_AGE:0)];
  headers.append('Set-Cookie',parts.join('; '));
 }
 if(excludeOwner){
  headers.append('Set-Cookie',[
   EXCLUSION_COOKIE+'=1','Path=/','HttpOnly','Secure','SameSite=Strict',
   'Priority=High','Max-Age='+EXCLUSION_MAX_AGE
  ].join('; '));
 }
 return new Response(JSON.stringify(body),{status,headers});
}
function readCookie(raw){
 if(typeof raw!=='string')return '';
 for(const item of raw.split(';')){
  const split=item.indexOf('=');
  if(split<0||item.slice(0,split).trim()!==COOKIE)continue;
  const value=item.slice(split+1).trim();
  try{return decodeURIComponent(value);}catch(_){return '';}
 }
 return '';
}
function headersFor(key,jwt){
 return {apikey:key,'Content-Type':'application/json',...(jwt?{Authorization:'Bearer '+jwt}:{})};
}
async function authRequest(path,key,payload){
 const response=await fetch(SUPABASE+path,{
  method:'POST',headers:headersFor(key),
  body:JSON.stringify(payload),cache:'no-store'
 });
 const body=await response.json().catch(()=>({}));
 return {response,body};
}
async function verifyAdmin(jwt,key){
 if(typeof jwt!=='string'||jwt.length<80)return false;
 const userResponse=await fetch(SUPABASE+'/auth/v1/user',{
  headers:headersFor(key,jwt),cache:'no-store'
 });
 if(!userResponse.ok)return false;
 const user=await userResponse.json().catch(()=>({}));
 if(!UUID.test(user?.id||''))return false;
 // A política RLS libera apenas o próprio registro; possuir Auth não concede acesso.
 const rolesResponse=await fetch(
  SUPABASE+'/rest/v1/hub_admin_roles?select=user_id&user_id=eq.'+encodeURIComponent(user.id)+'&limit=1',
  {headers:headersFor(key,jwt),cache:'no-store'}
 );
 if(!rolesResponse.ok)return false;
 const roles=await rolesResponse.json().catch(()=>[]);
 return Array.isArray(roles)&&roles.length===1&&roles[0]?.user_id===user.id;
}
function safeToken(resultBody){
 return {access_token:resultBody.access_token,expires_in:Math.max(30,Math.min(86400,Number(resultBody.expires_in)||3600))};
}
function requestAllowed(request){
 const url=new URL(request.url),origin=request.headers.get('Origin'),site=request.headers.get('Sec-Fetch-Site');
 return (origin===url.origin || (!origin&&site==='same-origin')) &&
 (!site||site==='same-origin') &&
 /^application\/json(?:;|$)/i.test(request.headers.get('Content-Type')||'');
}
export async function onRequestPost({request,env}){
 if(!requestAllowed(request))return result(403,{erro:'Origem não autorizada.'});
 if(Number(request.headers.get('Content-Length')||0)>1100)return result(413,{erro:'Requisição inválida.'});
 let input;
 try{input=await request.json();}catch(_){return result(400,{erro:'Requisição inválida.'});}
 if(!input||typeof input!=='object'||Array.isArray(input))return result(400,{erro:'Requisição inválida.'});
 const action=input.action;
 const key=env?.SUPABASE_PUBLISHABLE_KEY||FALLBACK_KEY;
 if(action==='login'){
  const email=String(input.email||'').trim().toLowerCase(),password=input.password;
  if(email.length<5||email.length>254||!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)||
     typeof password!=='string'||password.length<1||password.length>256)
   return result(400,{erro:'Credenciais inválidas.'});
  try{
   const {response,body}=await authRequest('/auth/v1/token?grant_type=password',key,{email,password});
   if(response.status===429)return result(429,{erro:'Muitas tentativas. Aguarde e tente novamente.'});
   if(!response.ok||!body.access_token||!body.refresh_token)
    return result(401,{erro:'Credenciais inválidas ou acesso não autorizado.'});
   if(!await verifyAdmin(body.access_token,key))
    return result(403,{erro:'Credenciais inválidas ou acesso não autorizado.'},'');
   return result(200,safeToken(body),body.refresh_token,true);
  }catch(_){return result(503,{erro:'Autenticação temporariamente indisponível.'});}
 }
 if(action==='resume'){
  const refresh=readCookie(request.headers.get('Cookie'));
  if(!refresh)return result(401,{erro:'É necessário autenticar.'});
  if(refresh.length>2048)return result(401,{erro:'Sessão inválida.'},'');
  try{
   const {response,body}=await authRequest('/auth/v1/token?grant_type=refresh_token',key,{refresh_token:refresh});
   if(response.status===429)return result(429,{erro:'Aguarde para revalidar a sessão.'});
   if(!response.ok||!body.access_token||!body.refresh_token)
    return result(401,{erro:'Sessão expirada. Entre novamente.'},'');
   if(!await verifyAdmin(body.access_token,key))
    return result(403,{erro:'Acesso não autorizado.'},'');
   return result(200,safeToken(body),body.refresh_token,true);
  }catch(_){return result(503,{erro:'Não foi possível revalidar a sessão.'});}
 }
 if(action==='logout'){
  const refresh=readCookie(request.headers.get('Cookie'));
  if(refresh){
   try{
    const {response,body}=await authRequest('/auth/v1/token?grant_type=refresh_token',key,{refresh_token:refresh});
    if(response.ok&&body.access_token){
     await fetch(SUPABASE+'/auth/v1/logout?scope=local',{
      method:'POST',headers:headersFor(key,body.access_token),cache:'no-store'
     });
    }
   }catch(_){/* O cookie local é removido mesmo se o provedor estiver indisponível. */}
  }
  return result(200,{ok:true},'');
 }
 return result(400,{erro:'Operação inválida.'});
}
export async function onRequestGet(){
 return result(405,{erro:'Método não permitido.'});
}