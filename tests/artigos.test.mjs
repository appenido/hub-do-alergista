import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {spawnSync} from 'node:child_process';
import {ARTICLE_TOPIC_IDS, titleMatchesTopic, topicsForArticle, searchTokens, buildArticleQuery, articleDate, normalizeArticle} from '../artigos-core.mjs';

test('tema selecionado não admite medicamento isolado de outra doença',()=>{
  assert.equal(titleMatchesTopic('Dupilumab for eosinophilic esophagitis in adults','da'),false);
  assert.equal(titleMatchesTopic('Dupilumab for eosinophilic esophagitis in adults','eoe'),true);
  assert.equal(titleMatchesTopic('Omalizumab for severe allergic asthma','urticaria'),false);
  assert.equal(titleMatchesTopic('Omalizumab for severe allergic asthma','asma'),true);
  assert.equal(titleMatchesTopic('Remibrutinib in chronic spontaneous urticaria','urticaria'),true);
  assert.equal(titleMatchesTopic('Eosinophilic gastritis randomized trial','eoe'),false);
  assert.equal(titleMatchesTopic('Hereditary angioedema international guideline','urticaria'),false);
  assert.equal(titleMatchesTopic('Hereditary angioedema international guideline','angioedema'),true);
  assert.equal(titleMatchesTopic('Chronic rhinosinusitis with nasal polyps','rinite'),false);
  assert.equal(titleMatchesTopic('Chronic rhinosinusitis with nasal polyps','rsc'),true);
});
test('classificação múltipla é explícita e sem palavras parciais',()=>{
  assert.deepEqual(topicsForArticle('Allergic rhinitis and asthma: a clinical review').sort(),['asma','rinite']);
  assert.equal(titleMatchesTopic('Dramatic improvement in health','asma'),false);
  assert.ok(ARTICLE_TOPIC_IDS.includes('vacinas'));
});
test('busca por palavras em português é traduzida e vinculada ao tema por AND',()=>{
  const q=buildArticleQuery('asma','asma grave');
  assert.match(q,/"asthma"\[ti\]/);
  assert.match(q,/"asthma"\[tiab\] AND "severe"\[tiab\]/);
  assert.doesNotMatch(q,/"dupilumab"\[ti\]/);
  assert.deepEqual(searchTokens('dermatite atópica com dupilumabe'),['atopic','dermatitis','dupilumab']);
  assert.throws(()=>buildArticleQuery('tema-inexistente',''),/Tema inválido/);
});
test('datas do PubMed interpretadas sem depender da ordem visual',()=>{
  assert.equal(articleDate('2026 Nov 11'),'2026-11-11');
  assert.equal(articleDate('2026 Nov'),'2026-11-01');
  assert.equal(articleDate('2026/04/23'),'2026-04-23');
  assert.equal(articleDate('2026'),'2026-01-01');
});
test('registros de tema errado ou data futura não entram no feed',()=>{
  const r={uid:'12345678',title:'Dupilumab for eosinophilic esophagitis',source:'Allergy',epubdate:'2026 Nov 10',pubdate:'2027 Jan',authors:[{name:'Almeida M'}],articleids:[{idtype:'doi',value:'10.1234/demo'}]};
  assert.equal(normalizeArticle(r,'12345678','2026-11-11','asma'),null);
  const correct=normalizeArticle(r,'12345678','2026-11-11','eoe');
  assert.equal(correct?.date,'2026-11-10');
  assert.equal(correct?.url,'https://pubmed.ncbi.nlm.nih.gov/12345678/');
  assert.equal(correct?.doi,'10.1234/demo');
  assert.equal(normalizeArticle({...r,epubdate:'2027 Jan',pubdate:'2027 Jan',sortpubdate:'2027/01/01'},'12345678','2026-11-11','eoe'),null);
});
test('interface usa API temática, separa a lista antiga e mostra data da consulta',()=>{
  const html=readFileSync(new URL('../index.html',import.meta.url),'utf8');
  const ui=readFileSync(new URL('../artigos-premium.js',import.meta.url),'utf8');
  const server=readFileSync(new URL('../functions/artigos.js',import.meta.url),'utf8');
  assert.match(html,/artigos-premium\.js\?v=/);
  assert.match(html,/hubArtigosAoAbrir/);
  assert.match(ui,/#[^\n]*artigos-list\{display:none!important\}/);
  assert.match(ui,/data-article-topic/);
  assert.match(ui,/consulta em /);
  assert.match(ui,/fetch\('\/artigos\?/);
  assert.match(server,/buildArticleQuery\(topic,q\)/);
  assert.match(server,/normalizeArticle\(details\.result\[id\],id,today,topic\)/);
  for(const path of ['artigos-premium.js','artigos-core.mjs','functions/artigos.js']){
    const code=readFileSync(new URL('../'+path,import.meta.url),'utf8');
    const result=spawnSync(process.execPath,['--check','--input-type=module'],{input:code,encoding:'utf8'});
    assert.equal(result.status,0,path+': '+result.stderr);
  }
});
