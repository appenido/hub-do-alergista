import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {execFileSync} from 'node:child_process';

const read = path => readFileSync(new URL('../'+path,import.meta.url),'utf8');
const html=read('index.html');
const js=read('medicamentos-catalogo.js');
const css=read('medicamentos-catalogo.css');

test('Home oferece Medicamentos sem atalho isolado de Anti-histamínicos',()=>{
 assert.match(html,/<div class="qcard" data-nav="medicamentos">/);
 assert.doesNotMatch(html,/<div class="qcard" data-nav="antihistaminicos">/);
 assert.match(html,/id="page-medicamentos"/);
 assert.match(html,/medicamentos:'Medicamentos'/);
 assert.match(html,/if\(medsAutoOpen\) page = 'medicamentos'/);
 assert.match(html,/<script src="\/medicamentos-catalogo\.js\?v=/);
 assert.match(html,/<link rel="stylesheet" href="\/medicamentos-catalogo\.css\?v=/);
});
test('Oito categorias obrigatórias e catálogo anti-H1 preservado',()=>{
 const block=js.split('const CATS=[')[1].split('];')[0];
 for(const id of ['anti','topicos','olhos','nasais','inalatoria','ibps','hidratantes','formulas'])
  assert.match(block,new RegExp("id:'"+id+"'"));
 assert.equal((block.match(/\{id:'/g)||[]).length,8);
 assert.match(html,/id="page-antihistaminicos"><section id="ahApp"/);
 assert.match(js,/body\.appendChild\(original\)/);
});
test('Preços não são inventados: somente oferta verificada',()=>{
 assert.match(js,/verified===true/);
 assert.match(js,/o\.price<=budget/);
 assert.match(js,/moistPrices=new Map/);
 assert.match(js,/Integração de preços ainda não configurada/);
 assert.match(js,/Conferir oferta e embalagem/);
});
test('Fichas expansíveis, potência e filtros dos emolientes',()=>{
 assert.match(js,/<details class="med-prod"/);
 assert.match(js,/Potência depende da concentração e do veículo/);
 assert.match(js,/Muito alta/);
 for(const f of ['data-med-budget','data-med-texture','data-med-area'])
   assert.match(js,new RegExp(f));
 assert.match(css,/#medApp \.med-category\.is-open/);
});
test('Javascript e CSS do catálogo anti-H1 continuam válidos',()=>{
 execFileSync(process.execPath,['--check',new URL('../medicamentos-catalogo.js',import.meta.url).pathname]);
 assert.match(read('antihistaminicos.css'),/:is\(#page-antihistaminicos,#page-medicamentos\)/);
 assert.match(read('antihistaminicos-mecanismo.css'),/:is\(#page-antihistaminicos,#page-medicamentos\)/);
});
