import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {fileURLToPath} from 'node:url';
import {dirname,resolve} from 'node:path';
import {onRequestPost} from '../functions/api/traduzir.js';

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
  assert.match(script,/attributeFilter:\[\.\.\.translatedAttributes,'class'\]/);
  assert.match(script,/target\.classList\.contains\('active'\)/);
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

test('tradução no navegador carrega somente os catálogos estáticos, sem enviar conteúdo de campos',()=>{
  assert.match(script,/fetch\('\/data\/hub-i18n-'\+next/);
  assert.doesNotMatch(script,/api\/traduzir|method:\s*['"]POST/);
  assert.match(script,/\[data-hub-i18n-skip\]/);
  assert.match(script,/contenteditable/);
});

test('as duas versões traduzem conteúdo interno e conservam quantidades clínicas literais',()=>{
  const keys=[
    'Selecione uma classe. Cada ficha expande no próprio cartão, com nomes genéricos, marcas, apresentações, indicações e cuidados.',
    'Primeira linha na anafilaxia. Aplicar IM na face anterolateral da coxa, concentração 1 mg/mL; repetir em 5–15 minutos se resposta inadequada.',
    'Consulta por idade e condições clínicas, sem identificação ou cadastro do paciente.',
    'Para que serve: Estratifica o risco de alergia à penicilina em adultos.',
    'Formulário clínico desativado'
  ];
  for(const language of ['en','es']){
    const translations=JSON.parse(read('data/hub-i18n-'+language+'.json'));
    for(const key of keys){
      assert.ok(translations[key]&&translations[key]!==key,language+': '+key);
      const quantities=text=>text.match(/\d+(?:[.,]\d+)*/g)||[];
      assert.deepEqual(quantities(translations[key]),quantities(key));
    }
    assert.ok(read('sw.js').includes('hub-i18n-'+language+'.json'));
  }
});

test('a rota legada consulta só os arquivos publicados e rejeita identificadores',async()=>{
  const makeRequest=texts=>new Request('https://hubdoalergista.pages.dev/api/traduzir',{
    method:'POST',body:JSON.stringify({language:'en',texts})
  });
  const env={ASSETS:{fetch(request){
    assert.equal(new URL(request.url).pathname,'/data/hub-i18n-en.json');
    return new Response(read('data/hub-i18n-en.json'));
  }}};
  const source='Formulário clínico desativado';
  const response=await onRequestPost({request:makeRequest([source,'frase de teste ausente do catálogo publico']),env});
  const {translations}=await response.json();
  assert.notEqual(translations[0],source);
  assert.ok(translations[0]);
  assert.equal(translations[1],null);
  const blocked=await onRequestPost({request:makeRequest(['teste@example.test']),env:{}});
  assert.equal(blocked.status,400);
});
