import test from 'node:test';
import assert from 'node:assert/strict';
import { classifyCommit, guessSection, isContentFile, newUpToDateItems, updateFeed } from '../scripts/atualizar-novidades.mjs';

test('identifica publicação clínica nova em arquivos reais', () => {
  const result = classifyCommit('Criar SCORAD clínico por região anatômica com regra dos nove', ['scorad-premium.js']);
  assert.equal(result.section, 'scores');
  assert.match(result.title, /SCORAD/);
});
test('não confunde correções, alterações de interface ou notícias com novidades', () => {
  assert.equal(classifyCommit('fix(scores): corrigir QR Code do DLQI', ['index.html']), null);
  assert.equal(classifyCommit('feat: acesso visível à central de métricas', ['index.html']), null);
  assert.equal(classifyCommit('Radar: atualiza notícias verificadas', ['data/radar.json']), null);
  assert.equal(classifyCommit('feat(artigos): criar API de busca PubMed', ['artigos-premium.js']), null);
});
test('aceita publicação explícita apenas com seção válida e arquivo publicado', () => {
  assert.equal(classifyCommit('novidade(imunizacoes): Novo protocolo para vacina X | Conduta publicada.', ['index.html']).section, 'imunizacoes');
  assert.equal(classifyCommit('novidade(admin): Painel interno | Dados privados', ['index.html']), null);
  assert.equal(classifyCommit('novidade(scores): Novo score | Publicado', ['sw.js']), null);
});
test('arquivo de cache nunca serve como prova de publicação', () => {
  assert.equal(isContentFile('sw.js'), false);
  assert.equal(isContentFile('data/hub-novidades.json'), false);
  assert.equal(guessSection('PEN-FAST'), 'scores');
});
test('a verificação diária sem novo conteúdo não fabrica alertas', () => {
  const feed = { version: 1, updatedAt: '2026-11-09', items: [{id:'a', date:'2026-11-09',section:'scores', title:'Exemplo'}] };
  const updated = updateFeed(feed, [], 'abc', '2026-11-12');
  assert.equal(updated.items.length, 1);
  assert.equal(updated.updatedAt, '2026-11-09');
  assert.equal(updated.checkedAt, '2026-11-12');
});

test('UpToDate publica somente tópicos inéditos confirmados na verificação diária', () => {
  const radar = {
    source: 'https://ff.uptodate.com/contents/whats-new-in-allergy-and-immunology',
    checkedAt: '2026-11-14',
    items: [
      {title:'New approach to severe atopic dermatitis', titlePt:'Nova abordagem da dermatite atópica grave',
       topic:'Dermatite atópica', firstSeenAt:'2026-11-14'},
      {title:'Previously verified topic about urticaria', firstSeenAt:'2026-11-04'}
    ]
  };
  const fresh = newUpToDateItems(radar, '2026-11-14');
  assert.equal(fresh.length, 1);
  assert.equal(fresh[0].source, 'uptodate');
  assert.equal(fresh[0].title, 'Nova abordagem da dermatite atópica grave');
  assert.equal(fresh[0].section, 'artigos');
  const base = {version:1, updatedAt:'2026-11-13',items:[]};
  const published = updateFeed(base, [], 'sha1', '2026-11-14', radar);
  assert.equal(published.items.length, 1);
  assert.equal(published.updatedAt, '2026-11-14');
  assert.equal(updateFeed(published, [], 'sha2', '2026-11-14', radar).items.length, 1);
  assert.equal(newUpToDateItems(radar, '2026-11-15').length, 0);
  assert.equal(newUpToDateItems({...radar,source:'https://example.com'}, '2026-11-14').length, 0);
});
