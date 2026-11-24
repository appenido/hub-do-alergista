import {readFileSync} from 'node:fs';
import {test} from 'node:test';
import assert from 'node:assert/strict';
import vm from 'node:vm';
const html=readFileSync(new URL('../index.html',import.meta.url),'utf8');
const start=html.indexOf('function vacImunossup(c)'),end=html.indexOf('function vacGerarCalendario()',start);
assert.ok(start>=0&&end>start);
const ctx=vm.createContext({});
vm.runInContext(html.slice(start,end),ctx);
const run=ctx.vacCalcular,flags=['asma','asma_modgrave','dpoc','cardio','dm','renal','hepato','asplenia','complemento','idp','hiv','transplante','onco','imunossup','autoimune','fistula','obesidade','tabagismo','prof_saude','viajante'];
test('38 anos, asma e profissional de saúde: Shingrix apenas condicional, sem DPOC',()=>{
 const r=run(456,'m','nao',['asma','prof_saude']).rec;
 assert.equal(r.find(x=>x.id==='hz').tag,'condicional');
 assert.match(r.find(x=>x.id==='hz').motivo,/asma/);
 assert.doesNotMatch(r.find(x=>x.id==='hz').motivo,/DPOC/);
 assert.equal(r.find(x=>x.id==='pnc').tag,'condicional');
 assert.equal(run(456,'m','nao',['asma_modgrave','prof_saude']).rec.find(x=>x.id==='pnc').tag,'comorb');
 assert.equal(run(600,'m','nao',['asma']).rec.find(x=>x.id==='hz').tag,'rotina');
 assert.equal(run(600,'m','nao',['asma']).rec.find(x=>x.id==='pnc').tag,'rotina');
 assert.equal(run(456,'m','nao',['prof_saude']).rec.some(x=>x.id==='hz'),false);
});
test('combinações de marcadores, situações especiais e limites etários',()=>{
 const ages=[0,1.5,2,3,6,9,11.99,12,15,23.99,24,48,60,72,84,108,132,168,215.99,216,228,240,456,540,552,599.99,600,719.99,720,839.99,840,1020];
 const checks=[[],flags,...flags.map(x=>[x])];
 for(let i=0;i<flags.length;i++)for(let j=i+1;j<flags.length;j++)checks.push([flags[i],flags[j]]);
 for(const m of ages)for(const s of ['nao','gestante','puerpera','prematuro'])for(const c of checks){
  const r=run(m,'f',s,c).rec,ids=r.map(x=>x.id);
  assert.equal(new Set(ids).size,ids.length);
  if(s==='gestante'||ctx.vacImunossup(c))assert.ok(!r.some(x=>x.live));
  if(m<216)assert.ok(!ids.includes('hz'));
  if(m<108)assert.ok(!ids.includes('hpv'));
  if(m<2)assert.ok(!ids.includes('pnc'));
  if(s==='gestante')assert.ok(!ids.includes('hpv')&&!ids.includes('hz'));
  if(!c.includes('dpoc'))assert.ok(!r.some(x=>x.id==='hz'&&x.motivo.includes('DPOC')));
 }
});