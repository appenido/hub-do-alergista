import test from 'node:test';
import assert from 'node:assert/strict';
import { selecionarVerificadas } from '../alergo-news-core.mjs';
import { readFileSync } from 'node:fs';

test('manchete e republicações semelhantes não ocupam a lista anterior', () => {
  const titulos = [
  "Dermatite atópica no verão: como aliviar a coceira e proteger a pele?",
  "Dermatite atópica no verão: calor e suor podem intensificar coceira e irritação na pele",
  "Farmacêutica sobre ter uma jiboia em casa: \"Para quem tem problema respiratório, como bronquite, rinite e asma\"",
  "Farmacêutica recomenda ter uma jiboia em casa: \"Para quem tem problema respiratório, como bronquite, rinite e asma\"",
  "Dermatite atópica: novas opções de tratamento sistêmico",
  "Anafilaxia na infância: quais sinais exigem atenção?"
];
  const noticias = titulos.map((titulo, i) => ({titulo, fonte:'Terra', data:new Date(Date.UTC(2026,10,25-i,12)).toISOString(),url:'https://example.com/'+i,status:'verificado',verificado:true}));
  const resultado = selecionarVerificadas(noticias, {agora:Date.UTC(2026,10,26)});
  assert.deepEqual(resultado.map(n=>n.titulo), [titulos[0],titulos[2],titulos[4],titulos[5]]);
  const front = readFileSync(new URL('../alergo-news-premium.js', import.meta.url), 'utf8');
  assert.match(front, /unicas\.some\(anterior/);
});
