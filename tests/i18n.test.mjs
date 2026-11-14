import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {fileURLToPath} from 'node:url';
import {dirname,resolve} from 'node:path';

const ROOT=resolve(dirname(fileURLToPath(import.meta.url)),'..');
const read=(p)=>readFileSync(resolve(ROOT,p),'utf8');
const html=read('index.html');
const script=read('hub-i18n.js');
const catalog=new Set(JSON.parse(read('data/hub-i18n-catalog.json')).strings);

test('seletor de idiomas está disponível no Hub e nas páginas independentes',()=>{
  assert.match(html,/hub-i18n\.js\?v=/);
  assert.match(html,/hub-i18n\.css\?v=/);
  const independent=['instalar.html','conheca.html','termos.html','privacidade.html','auri.html','score-paciente.html','snot22-paciente.html','uct-paciente.html','uas7-paciente.html'];
  for(const path of independent){
    const page=read(path);
    assert.match(page,/hub-i18n\.js\?v=/,path);
    assert.match(page,/hub-i18n\.css\?v=/,path);
  }
});

test('todas as 24 telas internas são observáveis após a navegação',()=>{
  const ids=[...html.matchAll(/<div class="page(?: active)?" id="(page-[^"]+)"/g)].map(x=>x[1]);
  assert.ok(ids.length>=24);
  assert.ok(ids.includes('page-eaaci'));
  assert.ok(ids.includes('page-medicamentos'));
  assert.ok(ids.includes('page-imunizacoes'));
  assert.ok(ids.includes('page-laboratorio'));
  assert.match(script,/attributeFilter:\['placeholder','aria-label','title','class'\]/);
  assert.match(script,/\.page:not\(\.active\)/);
  assert.match(script,/translateSubtree/);
});

test('catálogo contém praticamente todos os textos estáticos do Hub',()=>{
  const body=html.slice(html.indexOf('</head>'),html.indexOf('</div><!-- /scroll-area -->'))
    .replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi,'')
    .replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi,'')
    .replace(/<svg\b[^>]*>[\s\S]*?<\/svg>/gi,'');
  const phrases=[...body.matchAll(/>([^<>]{2,})</g)]
    .map(x=>x[1].replace(/&nbsp;/g,' ').replace(/&amp;/g,'&')
      .replace(/&lt;/g,'<').replace(/&gt;/g,'>').replace(/&quot;/g,'"')
      .replace(/\s+/g,' ').trim())
    .filter(x=>x.length>=3&&/[À-ÿA-Za-z]{2}/.test(x));
  const n=phrases.filter(s=>catalog.has(s)).length;
  assert.ok(phrases.length>2000,'A varredura precisa percorrer o conteúdo interno');
  assert.ok(n/phrases.length>=0.99,'O catálogo precisa cobrir ao menos 99% do texto estático');
});

test('tradução clínica rejeita alterações de números ou doses',async()=>{
  const source=read('functions/api/traduzir.js')+'\nexport {safeTranslation};\n';
  const module=await import('data:text/javascript;base64,'+Buffer.from(source).toString('base64'));
  assert.equal(module.safeTranslation('Omalizumabe 300 mg a cada 4 semanas','Omalizumab 300 mg every 4 weeks'),true);
  assert.equal(module.safeTranslation('Omalizumabe 300 mg a cada 4 semanas','Omalizumab 600 mg every 4 weeks'),false);
  assert.equal(module.safeTranslation('Redução 12,5%','Reduction 12.5%'),false);
});

test('preserva privacidade e só solicita traduções de conteúdo catalogado',()=>{
  const endpoint=read('functions/api/traduzir.js');
  assert.match(endpoint,/allowed\.has\(s\)/);
  assert.match(endpoint,/hasIdentifier/);
  assert.match(script,/catalog\.has\(source\)/);
  assert.match(script,/\[data-hub-i18n-skip\]/);
  assert.match(script,/contenteditable/);
});
