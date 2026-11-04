import assert from 'node:assert/strict';
import {test} from 'node:test';
import {readFile} from 'node:fs/promises';
import vm from 'node:vm';
import {topicsFor,documentKind,searchQuery,normalizeRecord,publishedDate} from '../guidelines-core.mjs';
import {onRequestGet} from '../functions/guidelines.js';

const summary = {
  uid:'41649409',title:'The International Guideline for the Definition, Classification, Diagnosis and Management of Urticaria',
  source:'Allergy',epubdate:'2026 Feb 6',pubdate:'2026 Aug',sortpubdate:'2026/08/01 00:00',
  articleids:[{idtype:'pubmed',value:'41649409'},{idtype:'doi',value:'10.1111/all.70210'},{idtype:'pmc',value:'PMC13466004'}],
  pubtype:['Journal Article','Practice Guideline'],url:'https://example.com/unrelated'
};
test('título, DOI e PMID permanecem associados ao mesmo registro',()=>{
  const i=normalizeRecord(summary,'41649409','2026-11-04');
  assert.equal(i.url,'https://pubmed.ncbi.nlm.nih.gov/41649409/');
  assert.equal(i.title,summary.title);assert.equal(i.doi,'10.1111/all.70210');
  assert.equal(i.date,'2026-02-06');assert.equal(i.pmcid,'PMC13466004');
  assert.equal(normalizeRecord(summary,'38108678','2026-11-04'),null);
  assert.equal(normalizeRecord({...summary,articleids:[{idtype:'pubmed',value:'123'}]},'41649409','2026-11-04'),null);
});
test('publicação on-line precede edição futura; publicações futuras não entram',()=>{
  assert.equal(publishedDate({...summary,pubdate:'2027 Jan'},'2026-11-04'),'2026-02-06');
  assert.equal(normalizeRecord({...summary,epubdate:'2027 Jan 2',pubdate:'2027 Feb',sortpubdate:''},summary.uid,'2026-11-04'),null);
});
test('tema exige palavras clínicas completas e admite mais de um tema',()=>{
  assert.deepEqual(topicsFor('ARIA: an algorithm for rhinitis and asthma'),['asma','rinite']);
  assert.deepEqual(topicsFor('Contemporary biomarkers in oncology'),[]);
  assert.deepEqual(topicsFor('Eosinophilic esophagitis and dupilumab'),['eoe']);
  assert.deepEqual(topicsFor('Omalizumab for food allergy: consensus guidance'),['aa']);
  assert.deepEqual(topicsFor('Skin tests for drug hypersensitivity'),['medicam']);
});
test('sinônimos de guideline e revisões são aceitos sem alterar o tipo real',()=>{
  assert.equal(documentKind('Algorithm for venom immunotherapy'),'Algoritmo clínico');
  assert.equal(documentKind('EUFOREA consensus paper'),'Consenso');
  assert.equal(documentKind('Drug allergy: A practice parameter update'),'Parâmetro de prática');
  assert.equal(documentKind('EAACI position paper on drug provocation'),'Posicionamento');
  assert.equal(documentKind('Biologics to treat atopic dermatitis',['Review']),'Revisão');
  assert.equal(documentKind('Quality of allergy guidelines: A Systematic Review',['Review']),'Revisão sistemática / metanálise');
  assert.equal(documentKind('Drug hypersensitivity: A WAO Statement',['Review']),'Posicionamento');
  const query=searchQuery('all');
  for(const term of ['consensus[ti]','recommendation*[ti]','algorithm*[ti]','review[pt]','"J Allergy Clin Immunol"[jour]'])assert.ok(query.includes(term),term);
});
test('fonte fora das revistas e publicações retratadas são descartadas',()=>{
  assert.equal(normalizeRecord({...summary,source:'Veterinary Journal'},summary.uid,'2026-11-04'),null);
  assert.equal(normalizeRecord({...summary,pubtype:['Retracted Publication']},summary.uid,'2026-11-04'),null);
});
test('as referências têm identidades únicas, URLs exatas e todos os temas',async()=>{
  const data=JSON.parse(await readFile(new URL('../guidelines-referencias.json',import.meta.url)));
  const html=await readFile(new URL('../index.html',import.meta.url),'utf8');
  const topics=new Set();const ids=new Set();
  for(const i of data.itens){
    assert.ok(!ids.has(i.pmid));ids.add(i.pmid);i.topics.forEach(t=>topics.add(t));
    assert.match(i.doi,/^10\.\d+\//);assert.ok(html.includes('data-pmid="'+i.pmid+'"'));
    assert.ok(html.includes('https://pubmed.ncbi.nlm.nih.gov/'+i.pmid+'/'));
  }
  assert.equal(topics.size,11);assert.equal(ids.size,21);
  const section=html.slice(html.indexOf('id="page-guidelines"'),html.indexOf('<!-- ══ PROTOCOLOS EAACI'));
  for(const wrong of ['PMC9898518','PMC9546417','PMC10637984','S2213219824001975','AGREE 2024'])assert.ok(!section.includes(wrong));
});
test('indisponibilidade do PubMed não é preenchida com artigos arbitrários',async()=>{
  const old=globalThis.fetch;globalThis.fetch=async()=>{throw new Error('offline');};
  try{
    const r=await onRequestGet({request:new Request('https://hubdoalergista.pages.dev/guidelines?tema=asma'),waitUntil(){}});
    assert.equal(r.status,503);assert.deepEqual((await r.json()).itens,[]);
  }finally{globalThis.fetch=old;}
});
test('API devolve somente o registro que corresponde ao ID solicitado',async()=>{
  const old=globalThis.fetch;let n=0;
  globalThis.fetch=async()=>Response.json(++n===1?{esearchresult:{idlist:['41649409','38108678']}}:{result:{'41649409':summary,'38108678':summary}});
  try{
    const r=await onRequestGet({request:new Request('https://hubdoalergista.pages.dev/guidelines?tema=urticaria'),waitUntil(){}});
    assert.equal(r.status,200);const d=await r.json();
    assert.equal(d.itens.length,1);assert.equal(d.itens[0].pmid,'41649409');
  }finally{globalThis.fetch=old;}
});
test('cache de tradução antigo não altera títulos nem links dos cards',async()=>{
  const page=await readFile(new URL('../index.html',import.meta.url),'utf8');
  const code=page.slice(page.indexOf('/* ── DIRETRIZES E EVIDÊNCIAS:'),page.indexOf('/* ── CURSOS:'));
  const box={innerHTML:''};
  const sandbox={Date,Promise,AbortSignal,window:{},_jEsc:s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c])),
    document:{querySelector:()=>null,querySelectorAll:()=>[],getElementById:()=>null}};
  vm.createContext(sandbox);vm.runInContext(code,sandbox);
  const item=normalizeRecord(summary,summary.uid,'2026-11-04');
  item._tituloPt='TÍTULO SEM RELAÇÃO COM O ARTIGO';
  sandbox._glPintar(box,[item]);
  assert.ok(box.innerHTML.includes(summary.title));
  assert.ok(!box.innerHTML.includes(item._tituloPt));
  assert.ok(box.innerHTML.includes(item.url));
  assert.ok(!box.innerHTML.includes('example.com'));
  assert.ok(!code.includes("fetch('/ia'"));
});
