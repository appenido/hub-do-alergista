import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
const load=p=>fs.readFileSync(new URL('../'+p,import.meta.url),'utf8');
const html=load('central-hub.html');
const css=load('central-hub.css');
const home=load('central-home.js');
const admin=load('central-hub.js');
const sql=load('supabase/migrations/20261114_hub_admin_executive_home.sql');

test('home executiva reúne os cinco indicadores sem perder os demais relatórios',()=>{
 for(const id of ['homeToday','homeHour','homeDayChart','homeAccessMap','homeTopFeatures','homeActivity'])
   assert.match(html,new RegExp('id="'+id+'"'));
 for(const tab of ['resumo','inteligencia','ferramentas','jornadas','mapa','publico','atividades','saude','diagnostico','assinaturas','privacidade'])
   assert.match(html,new RegExp('data-tab="'+tab+'"'));
 for(const old of ['kSessions','trend','hours','topFeatures','topSources','mapSessionsTable','recentTable','healthTable','featureMetrics'])
   assert.match(html,new RegExp('id="'+old+'"'));
 assert.match(html,/Exibir indicadores e relatórios complementares/);
 assert.match(html,/central-home\.js\?v=/);
});
test('todos os gráficos e mapa da home dependem de dados autenticados',()=>{
 assert.match(home,/hubCentralRequest/);
 assert.match(home,/hub_analytics_home/);
 assert.match(home,/hub:central-map/);
 assert.match(home,/hub:central-logout/);
 assert.match(home,/hubCentralPontoSessao/);
 assert.match(admin,/hub:central-map/);
 assert.match(home,/data-home-go/);
 assert.doesNotThrow(()=>new Function(home));
 assert.doesNotThrow(()=>new Function(admin));
});
test('métricas de sessão, hora, dia e ranking possuem consulta segura',()=>{
 for(const term of ['hub_admin_roles','auth.uid()','session_start','interval \'1 hour\'','America/Sao_Paulo','top_features','recent'])
   assert.ok(sql.includes(term),'faltando '+term);
 assert.match(sql,/revoke all on function public\.hub_analytics_home\(integer\) from public,anon/);
 assert.doesNotMatch(sql,/grant execute on function public\.hub_analytics_home\(integer\) to anon/);
});
test('telas pequenas recebem cards e mapa responsivos',()=>{
 assert.match(css,/\.exec-kpi-grid/);
 assert.match(css,/\.home-access-map/);
 assert.match(css,/@media\(max-width:700px\)/);
});
