import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {dirname,resolve} from 'node:path';
import {fileURLToPath} from 'node:url';

const ROOT=resolve(dirname(fileURLToPath(import.meta.url)),'..');
const get=p=>readFileSync(resolve(ROOT,p),'utf8');

test('títulos de artigos e guidelines em português em todos os idiomas',()=>{
  const html=get('index.html');
  const js=get('hub-titulos-pt.js');
  assert.match(html,/hub-titulos-pt\.js\?v=/);
  assert.match(js,/\.art-card \.art-title-pt/);
  assert.match(js,/#page-guidelines \.guide-card \.gc-name/);
  assert.match(js,/#heroInteresses/);
  assert.match(js,/data-hub-i18n-skip/);
  assert.match(js,/hub:languagechange/);
  assert.match(js,/MutationObserver/);
  assert.match(js,/window\._traduzirTitulosFeed=/);
});
test('identificação original fica separada da exibição em português',()=>{
  const js=get('hub-titulos-pt.js');
  assert.match(js,/data-ai-title/);
  assert.match(js,/data-original/);
  assert.match(js,/data-hub-original-title/);
  assert.match(js,/dataset\.favTitulo=pt/);
  const html=get('index.html');
  assert.match(html,/\.gc-original\{display:none!important\}/);
});
test('endpoint protege números e formato da tradução científica',async()=>{
  const source=get('functions/api/titulos-pt.js')+'\nexport {valid,likelyPortuguese};';
  const module=await import('data:text/javascript;base64,'+Buffer.from(source).toString('base64'));
  assert.equal(module.valid('Dose 300 mg em 2026','Dose 300 mg in 2026'),true);
  assert.equal(module.valid('Dose 300 mg em 2026','Dose 600 mg in 2026'),false);
  assert.equal(module.valid('Dose 12,5 mg','Dose 12.5 mg'),false);
  assert.equal(module.likelyPortuguese('Clinical guideline for allergic rhinitis'),false);
  assert.equal(module.likelyPortuguese('Diretriz para rinite alérgica'),true);
});
test('PWA atualiza o tradutor e mantém as referências originais',()=>{
  const sw=get('sw.js');
  assert.match(sw,/hub-titulos-pt\.js\?v=/);
  assert.match(sw,/\/hub-titulos-pt\.js/);
  const js=get('hub-titulos-pt.js');
  assert.match(js,/\/api\/titulos-pt/);
  assert.match(js,/localStorage\.setItem\(KEY/);
});
