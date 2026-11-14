import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
const read=p=>fs.readFileSync(new URL('../'+p,import.meta.url),'utf8');
const site=read('functions/analytics.js'),health=read('functions/health-analytics.js');
const browser=read('analytics-client.js');
const admin=read('central-hub.js');
const login=read('functions/central-auth.js');
function handler(code,fetchMock){
 return new Function('fetch','Response',code.replaceAll('export async function','async function')+'return onRequestPost;')(fetchMock,Response);
}
function req(cookie,healthMetric=false,referer=''){
 const fields=healthMetric?
  {session_key:'b2761982-22fd-4a42-92c1-a25614456df1',metric:'ttfb_ms',value:60,feature:'dashboard'}:
  {session_key:'b2761982-22fd-4a42-92c1-a25614456df1',event_type:'page_view',feature:'dashboard',action:'-',seconds_visible:0};
 return {
  url:'https://hubdoalergista.pages.dev/'+(healthMetric?'health-analytics':'analytics'),
  headers:{get(k){return ({
   cookie:cookie||null,origin:'https://hubdoalergista.pages.dev','sec-fetch-site':'same-origin',
   'content-type':'application/json','content-length':'200','user-agent':'Mozilla/5.0 Android Mobile',referer
  })[k.toLowerCase()]||null;}},
  cf:{country:'BR',regionCode:'MG',city:'Belo Horizonte',latitude:-19.9,longitude:-43.9},
  json:async()=>fields
 };
}
test('eventos do proprietário são descartados antes da gravação',async()=>{
 let writes=0;
 const run=handler(site,async()=>{writes++;return {ok:true,status:201};});
 const blocked=await run({request:req('other=1; __Host-hub_admin_notrack=1'),env:{}});
 assert.equal(blocked.status,204);
 assert.equal(writes,0);
 const normal=await run({request:req('other=1'),env:{}});
 assert.equal(normal.status,204);
 assert.equal(writes,1);
});
test('dados de desempenho do proprietário também são descartados',async()=>{
 let writes=0;
 const run=handler(health,async()=>{writes++;return {ok:true,status:201};});
 const blocked=await run({request:req('__Host-hub_admin_notrack=1',true),env:{}});
 assert.equal(blocked.status,204);
 assert.equal(writes,0);
 const normal=await run({request:req('',true),env:{}});
 assert.equal(normal.status,204);
 assert.equal(writes,1);
});
test('sessão administrativa e origem na Central nunca são contabilizadas',async()=>{
 for(const [code,healthMetric] of [[site,false],[health,true]]){
  let writes=0;
  const run=handler(code,async()=>{writes++;return {ok:true,status:201};});
  const authenticated=await run({request:req('__Host-hub_admin_rt=token-ficticio',healthMetric),env:{}});
  assert.equal(authenticated.status,204);
  const central=await run({request:req('',healthMetric,'https://hubdoalergista.pages.dev/central-hub.html'),env:{}});
  assert.equal(central.status,204);
  assert.equal(writes,0,'Nenhum evento originado da Central ou do proprietário pode chegar ao banco');
 }
});
test('navegador impede reativação das métricas em dispositivos do administrador',()=>{
 assert.match(browser,/OWNER_EXCLUSION_KEY='hub_analytics_owner_excluded_v1'/);
 assert.match(browser,/function ownerExcluded\(/);
 assert.match(browser,/if\(!enabled\|\|ownerExcluded\(\)/);
 assert.match(browser,/function disableOwnerAnalytics\(/);
 assert.match(browser,/event\.key===OWNER_EXCLUSION_KEY/);
 assert.match(admin,/localStorage\.setItem\('hub_analytics_owner_excluded_v1','1'\)/);
 assert.match(admin,/localStorage\.setItem\('hub_analytics_choice_v2','nao'\)/);
 assert.match(login,/EXCLUSION_COOKIE='__Host-hub_admin_notrack'/);
 assert.match(read('central-hub.html'),/meta name="hub-analytics" content="disabled"/);
 assert.match(browser,/\/central-hub/);
 assert.match(site,/function requisicaoAdministrativa\(request\)/);
 assert.match(health,/function requisicaoAdministrativa\(request\)/);
 assert.match(login,/EXCLUSION_MAX_AGE=365\*24\*60\*60/);
 assert.doesNotThrow(()=>new Function(browser));
 assert.doesNotThrow(()=>new Function(admin));
});
