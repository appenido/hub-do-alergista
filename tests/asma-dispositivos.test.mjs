import test from 'node:test';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import {readFileSync} from 'node:fs';

const load=n=>readFileSync(new URL('../'+n,import.meta.url),'utf8');
const js=load('asma-dispositivos.js');
const html=load('index.html');
const catalog=load('medicamentos-catalogo.js');
const scope={window:{}};
vm.runInNewContext(js,scope,{timeout:2000});
const {products,devices}=scope.window.hubAsmaDataset;

test('Desenhos SVG de todos os dispositivos são vinculados às apresentações',()=>{
 assert.ok(Object.keys(devices).length>=8);
 for(const device of Object.keys(devices))assert.match(js,new RegExp("^\\s*"+device+":'",'m'));
 for(const product of products)assert.ok(devices[product.device],product.brand);
 assert.match(js,/svg role="img"/);
 assert.match(js,/aria-label/);
 assert.match(js,/iconSerial/);
});
test('Todas as apresentações de asma têm dose, limite, idade, origem e MART informados',()=>{
 assert.ok(products.length>=30);
 for(const x of products){
   assert.ok(x.name && x.brand && x.device && x.strength && x.age,x.brand);
   assert.ok(x.dose && x.max && x.mart && x.source,x.brand);
   assert.match(x.source,/^https:\/\//,x.brand);
 }
});
test('MART exclusivo para formulações aplicáveis, sem extrapolar marca ou dose alta',()=>{
 const get=needle=>products.find(x=>x.brand===needle);
 assert.equal(get('Symbicort Turbuhaler 6/200').mart,'sim');
 assert.equal(get('Fostair 100/6 spray').mart,'sim');
 assert.equal(get('Fostair DPI 100/6 Next').mart,'sim');
 for(const name of ['Fostair 200/6 spray','Fostair DPI 200/6 Next','Symbicort Turbuhaler 12/400','Alenia 12/400','Vannair 6/200','Seretide Diskus','Relvar Ellipta','Foraseq 12 + 200 / 400','Trimbow spray'])
   assert.equal(get(name).mart,'nao',name);
 for(const name of ['Alenia 6/100','Alenia 6/200'])
   assert.equal(get(name).mart,'adicional');
});
test('Limites MART estão vinculados a cada produto e diferenciam GINA de bula',()=>{
 assert.match(products.find(x=>x.brand==='Symbicort Turbuhaler 6/200').max,/12/);
 assert.match(products.find(x=>x.brand==='Symbicort Turbuhaler 6/100').max,/8/);
 assert.match(products.find(x=>x.brand==='Fostair 100\/6 spray').max,/8/);
 assert.match(js,/GINA 2026/);
 assert.match(js,/Tabelas 6 e 7/);
});
test('A seção de terapia inalatória usa conteúdo dinâmico e recursos locais',()=>{
 assert.match(catalog,/hubAsmaRender\(slot,q\)/);
 assert.match(html,/src="\/asma-dispositivos\.js\?v=/);
 assert.match(html,/href="\/asma-dispositivos\.css\?v=/);
 assert.match(load('sw.js'),/asma-dispositivos\.js/);
});
