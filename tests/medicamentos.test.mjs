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
test('Cálculo de dose abre no cartão e preserva as oito categorias anteriores',()=>{
 const block=js.split('const CATS=[')[1].split('];')[0];
 for(const id of ['dose','anti','topicos','olhos','nasais','inalatoria','ibps','hidratantes','formulas'])
  assert.match(block,new RegExp("id:'"+id+"'"));
 assert.equal((block.match(/\{id:'/g)||[]).length,9);
 assert.match(html,/id="page-antihistaminicos"><section id="ahApp"/);
 assert.match(js,/body\.appendChild\(original\)/);
 assert.match(js,/hubDoseMount\(body,doseCatalog\(\)\)/);
 for (const asset of ['medicamentos-dose.js', 'medicamentos-dose-regras.js']) {
  assert.ok(html.includes('/'+asset+'?v='));
  assert.ok(read('sw.js').includes(asset+'?v='));
 }
});
test('Preços não são inventados: somente oferta verificada',()=>{
 assert.match(js,/verified===true/);
 assert.match(js,/o\.price<=budget/);
 assert.match(js,/moistPrices=new Map/);
 assert.match(js,/Integração de preços não configurada/);
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

test('Catálogo de hidratantes reúne várias marcas, veículos e fontes verificáveis',()=>{
 const json=js.match(/const MOIST=(\[[\s\S]*?\]);\s*const icons=/)?.[1];
 assert.ok(json, 'Lista de hidratantes não encontrada');
 const products=JSON.parse(json);
 assert.ok(products.length>=65, 'Catálogo deve oferecer variedade significativa');
 const brands=new Set(products.map(x=>x[1]));
 assert.ok(brands.size>=18, 'Marcas distintas insuficientes');
 for(const brand of ['CeraVe','Cetaphil','Bioderma','La Roche-Posay','Mustela','Neutrogena','Nivea','Granado','Bepantol','Dermage','ISDIN','Fisiogel','Mantecorp Skincare','Vasenol'])
  assert.ok(brands.has(brand), 'Marca ausente: '+brand);
 const allowed=new Set(['Creme','Loção','Gel-creme','Bálsamo','Pomada']);
 const ids=new Set();
 for(const x of products){
  assert.equal(x.length,6,'Campos incompletos');
  assert.ok(x.every(Boolean), 'Campo vazio: '+x[0]);
  assert.ok(!ids.has(x[0]),'Duplicata: '+x[0]);ids.add(x[0]);
  assert.ok(allowed.has(x[2]), 'Textura fora do filtro: '+x[2]);
  assert.match(x[5],/^https:\/\//,'Fonte inválida para '+x[0]);
 }
});
test('Hidratantes podem ser buscados e filtrados por marca, textura, área e preço',()=>{
 for(const attr of ['data-med-brand','data-med-moist-search','data-med-texture','data-med-area','data-med-budget'])
  assert.match(js,new RegExp(attr),'Filtro ausente: '+attr);
 assert.match(js,/new Set\(MOIST\.map\(x=>x\[1\]\)\)\.size/);
 assert.match(js,/const matched=MOIST\.filter\(x=>\(!brand/);
 assert.match(js,/const requests=eligible\.map\(x=>x\[0\]\)/);
 assert.match(js,/med-brand-source/);
 assert.match(css,/\.med-moist-filters/);
 assert.match(css,/\.med-brand-source/);
});
test('Preço permanece ligado exclusivamente a oferta do fornecedor, sem inventar valor',()=>{
 assert.match(js,/o\.verified===true/);
 assert.match(js,/o\.price<=budget/);
 assert.doesNotMatch(js,/if\(!moistChecked&&!moistBusy\)loadMoistPrices\(false\)/);
 assert.match(js,/Integração de preços não configurada/);
});
