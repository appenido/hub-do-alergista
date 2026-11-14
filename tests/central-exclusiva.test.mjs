import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const source=fs.readFileSync(new URL('../functions/central-auth.js',import.meta.url),'utf8');
const browser=fs.readFileSync(new URL('../central-hub.js',import.meta.url),'utf8');
const markup=fs.readFileSync(new URL('../central-hub.html',import.meta.url),'utf8');
const policy=fs.readFileSync(new URL('../_headers',import.meta.url),'utf8');
const adminId='e2517a2c-9509-4af1-81d3-607473421e3a';
const jwt='a'.repeat(96);
const freshToken={access_token:jwt,refresh_token:'rotated-token',expires_in:3600};
const ok=data=>({ok:true,status:200,json:async()=>data});
const request=(body,cookie='',origin='https://hubdoalergista.pages.dev')=>({
 url:'https://hubdoalergista.pages.dev/central-auth',
 headers:{get(key){return ({
  origin,
  'sec-fetch-site':'same-origin',
  'content-type':'application/json',
  'content-length':'250',
  cookie
 })[key.toLowerCase()]||null;}},
 json:async()=>body
});
function initServer(mock){
 const f=new Function('fetch',source.replaceAll('export async function','async function')+'return {onRequestPost,onRequestGet};');
 return f(mock);
}
const authMock=async(url,options={})=>{
 if(url.includes('grant_type=password'))return ok(freshToken);
 if(url.includes('grant_type=refresh_token'))return ok({...freshToken,refresh_token:'next-token'});
 if(url.endsWith('/auth/v1/user'))return ok({id:adminId});
 if(url.includes('/hub_admin_roles'))return ok([{user_id:adminId}]);
 if(url.includes('/auth/v1/logout'))return ok({});
 throw new Error('Requisição inesperada: '+url);
};

test('Central mantém apenas token curto em memória, com login automático por cookie do servidor',()=>{
 assert.match(browser,/async function token\(/);
 assert.match(browser,/autenticacao\('resume'\)/);
 assert.match(browser,/autenticacao\('login'/);
 assert.match(browser,/autenticacao\('logout'\)/);
 assert.match(browser,/credentials:'same-origin'/);
 assert.match(browser,/sessionStorage\.removeItem\('hub_secure_auth'\)/);
 assert.doesNotMatch(browser,/sessionStorage\.(?:getItem|setItem)|localStorage|document\.cookie|refresh_token|grant_type=password/);
 assert.match(markup,/Acesso exclusivo/);
});
test('acesso correto em navegador novo cria cookie HttpOnly, Secure e SameSite Strict',async()=>{
 const handler=initServer(authMock);
 const response=await handler.onRequestPost({request:request({action:'login',email:'user@example.com',password:'teste12345'}),env:{}});
 assert.equal(response.status,200);
 const json=await response.json();
 assert.equal(json.access_token,jwt);
 assert.ok(!('refresh_token' in json));
 const cookie=response.headers.get('set-cookie');
 assert.match(cookie,/^__Host-hub_admin_rt=/);
 assert.match(cookie,/HttpOnly/);
 assert.match(cookie,/Secure/);
 assert.match(cookie,/SameSite=Strict/);
 assert.match(cookie,/Max-Age=2592000/);
});
test('senha incorreta não permite acessar a Central',async()=>{
 const handler=initServer(async(url)=>url.includes('grant_type=password')?
   {ok:false,status:400,json:async()=>({message:'Invalid login credentials'})}:authMock(url));
 const response=await handler.onRequestPost({request:request({action:'login',email:'stranger@example.com',password:'wrong'}),env:{}});
 assert.equal(response.status,401);
 assert.ok(!response.headers.get('set-cookie'));
});
test('conta autenticada sem papel de administrador não recebe cookie de login',async()=>{
 const handler=initServer(async(url)=>{
  if(url.includes('/hub_admin_roles'))return ok([]);
  return authMock(url);
 });
 const response=await handler.onRequestPost({request:request({action:'login',email:'user@example.com',password:'teste12345'}),env:{}});
 assert.equal(response.status,403);
 assert.match(response.headers.get('set-cookie'),/Max-Age=0/);
});
test('reconhecimento de navegador renovado exige papel administrativo novamente',async()=>{
 const handler=initServer(authMock);
 const response=await handler.onRequestPost({
  request:request({action:'resume'},'__Host-hub_admin_rt=last-token'),env:{}
 });
 assert.equal(response.status,200);
 assert.match(response.headers.get('set-cookie'),/next-token/);
 const body=await response.json();
 assert.ok(body.access_token);
 assert.ok(!('refresh_token' in body));
});
test('logout revoga cookie mesmo sem renovação upstream',async()=>{
 const handler=initServer(async()=>({ok:false,status:401,json:async()=>({})}));
 const response=await handler.onRequestPost({
  request:request({action:'logout'},'__Host-hub_admin_rt=expired'),env:{}
 });
 assert.equal(response.status,200);
 assert.match(response.headers.get('set-cookie'),/Max-Age=0/);
});
test('origem de outro domínio e métodos incorretos são negados',async()=>{
 const handler=initServer(authMock);
 const response=await handler.onRequestPost({
  request:request({action:'login',email:'user@example.com',password:'pass'},'','https://malicious.example'),env:{}
 });
 assert.equal(response.status,403);
 assert.equal((await handler.onRequestGet()).status,405);
});
test('Central usa política restritiva de scripts e não permite exibir dentro de outra página',()=>{
 assert.match(policy,/\/central-hub\.html[\s\S]*script-src 'self' https:\/\/cdn\.jsdelivr\.net/);
 assert.match(policy,/\/central-hub\.html[\s\S]*frame-ancestors 'none'/);
 assert.match(policy,/\/central-auth[\s\S]*Cache-Control: no-store/);
 assert.doesNotThrow(()=>new Function(browser));
 assert.doesNotThrow(()=>new Function(source.replaceAll('export async function','async function')));
});
