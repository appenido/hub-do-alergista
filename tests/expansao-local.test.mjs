import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';

const html=readFileSync(new URL('../index.html',import.meta.url),'utf8');

test('Protocolos de bolso expandem junto ao cartão, sem scrollIntoView',()=>{
  const script=html.match(/\/\* -- PROTOCOLOS DE BOLSO:[\s\S]*?<\/script>/)?.[0] || '';
  assert.ok(script.includes('ancora.after(card)'),'O painel deve permanecer na grade, após a linha escolhida');
  assert.ok(script.includes("grid.querySelectorAll('.eaaci-q')"));
  assert.ok(script.includes("q.setAttribute('aria-expanded','true')"));
  assert.doesNotMatch(script,/scrollIntoView|scrollTo\s*\(/);
  assert.match(html,/#eaaci-btnrow>\.eaaci-card\.sel\{grid-column:1\/-1/);
  assert.equal([...html.matchAll(/<details class="eaaci-card" id="eaaci-\d+"/g)].length,16);
});

test('Comentários de vacinas abrem na própria linha da tabela',()=>{
  const bloco=html.match(/function atrAbreCom\(n, origem\)[\s\S]*?\n\}/)?.[0] || '';
  assert.ok(bloco.includes('row.after(nova)'));
  assert.ok(bloco.includes("origem.setAttribute('aria-expanded','true')"));
  assert.doesNotMatch(bloco,/scrollIntoView|scrollTo\s*\(/);
  assert.match(html,/atrAbreCom\('\+r\[1\]\+',this\)/);
});

test('Resultados de vacinação e de imunoglobulinas não causam salto automático',()=>{
  const vac=html.match(/function vacGerarCalendario\([\s\S]*?\n\}/)?.[0]||'';
  assert.ok(vac.includes('vacSaida'));
  assert.doesNotMatch(vac,/scrollIntoView|scrollTo\s*\(/);
  const inf=html.match(/var out = document\.getElementById\('igSaida'\);[\s\S]{0,240}/)?.[0]||'';
  assert.match(inf,/out\.style\.display = 'block'/);
  assert.doesNotMatch(inf,/scrollIntoView|scrollTo\s*\(/);
});
