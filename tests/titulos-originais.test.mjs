import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import vm from 'node:vm';
import {onRequest} from '../functions/api/titulos-pt.js';

const read=path=>readFileSync(new URL('../'+path,import.meta.url),'utf8');
const html=read('index.html');
const title='Dupilumab 300 mg in severe asthma: randomized trial 2026';
const escape=value=>String(value).replace(/[&<>"']/g,char=>({
  '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;'
}[char]));

test('home e feed exibem o título original mesmo com tradução antiga em memória',()=>{
  const sandbox={
    _feedEscape:escape, _homeAttr:escape, _feedCache:{},
    _tradCache:{[title]:'Título incorreto salvo anteriormente'},
    fetch(){throw new Error('Renderizar títulos não deve iniciar uma tradução.');}
  };
  vm.createContext(sandbox);
  vm.runInContext(html.slice(html.indexOf('function renderFeed(d2, box, tema)'),
    html.indexOf('/* ══ HOME: 3 publicações')),sandbox);
  vm.runInContext(html.slice(html.indexOf('function _renderFeedHome(d2, topico)'),
    html.indexOf("window.addEventListener('storage'",html.indexOf('function _renderFeedHome'))),sandbox);
  const details={result:{uids:['12345678'],'12345678':{
    title,source:'Allergy',pubdate:'2026 Nov 17',authors:[]
  }}};
  const box={style:{},innerHTML:''};
  sandbox.renderFeed(details,box,'asma');
  const home=sandbox._renderFeedHome(details,'asma');
  for(const result of [box.innerHTML,home]){
    assert.ok(result.includes(title));
    assert.doesNotMatch(result,/Título incorreto|art-title-pt|Traduzindo título/);
    assert.match(result,/class="art-title" data-hub-i18n-skip translate="no"/);
    assert.match(result,/https:\/\/pubmed\.ncbi\.nlm\.nih\.gov\/12345678\//);
  }
  assert.equal(sandbox._feedCache.asma,box.innerHTML);
});

test('diretrizes locais exibem o título da referência, inclusive no favorito',()=>{
  const {itens}=JSON.parse(read('guidelines-referencias.json'));
  for(const item of itens){
    const start=html.indexOf('data-guide="pmid-'+item.pmid+'"');
    const end=html.indexOf('<div class="guide-card"',start+1);
    const card=html.slice(start,end===-1?html.indexOf('<!-- ══ PROTOCOLOS EAACI',start):end);
    assert.ok(card.includes('data-fav-titulo="'+escape(item.title)+'"'));
    assert.match(card,/<a class="gc-name" data-hub-i18n-skip translate="no"/);
    assert.ok(card.includes('>'+escape(item.title)+'</a>'),item.pmid);
  }
});

test('novo feed e seletor de idioma preservam os títulos bibliográficos',()=>{
  const ui=read('artigos-premium.js');
  const i18n=read('hub-i18n.js');
  assert.match(ui,/class="art-title" data-hub-i18n-skip translate="no"/);
  assert.match(i18n,/var skip='\.art-card \.art-title,#page-guidelines \.gc-name/);
  assert.doesNotMatch(html+ui,/_traduzirTitulosFeed|_heroTraduzir|hub-titulos-pt\.js|hub_trad_titulos|art-title-pt/);
  assert.doesNotMatch(read('sw.js'),/hub-titulos-pt\.js/);
});

test('rota antiga encerra a tradução sem ler títulos ou usar serviços externos',async()=>{
  const response=onRequest({
    get request(){throw new Error('A rota desativada não deve ler a consulta.');},
    get env(){throw new Error('A rota desativada não deve consultar serviços.');}
  });
  assert.equal(response.status,410);
  assert.equal(response.headers.get('Cache-Control'),'no-store');
  assert.match((await response.json()).error,/Tradução de títulos removida/);
});
