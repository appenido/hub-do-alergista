import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const root = new URL('../', import.meta.url);
const html = readFileSync(new URL('index.html', root), 'utf8');

test('busca do cabeçalho usa formulário próprio e desativa o preenchimento automático', () => {
  const search = html.match(/(<form\b[^>]*\bclass="tb-search"[^>]*>)([\s\S]*?)<\/form>/);
  assert.ok(search, 'A busca deve estar em um formulário próprio');
  assert.match(search[1], /\brole="search"/);
  assert.match(search[1], /\bautocomplete="off"/);
  const field = search[2].match(/<input\b[^>]*>/)?.[0] ?? '';
  assert.match(field, /\btype="search"/);
  assert.match(field, /\bautocomplete="off"/);
  assert.doesNotMatch(field, /\s(?:name|value)=/);
});

test('Scores permanecem primeiro botão e Favoritos último botão da Home, sem quadro de Favoritos', () => {
  const home = html.slice(html.indexOf('id="page-dashboard"'), html.indexOf('id="page-artigos"'));
  const quick = home.match(/<div class="quick-grid">([\s\S]*?)<\/div>\s*<div class="sec-hdr"/)?.[1] || '';
  const buttons = [...quick.matchAll(/<div class="qcard" data-nav="([^"]+)"/g)].map(m => m[1]);
  assert.equal(buttons[0], 'scores', 'Scores deve ser o primeiro botão');
  assert.equal(buttons.at(-1), 'favoritos', 'Favoritos deve ser o último botão');
  assert.equal(buttons.filter(x => x === 'favoritos').length, 1, 'Favoritos não deve ser duplicado');
  assert.doesNotMatch(home, /<h2>Scores Rápidos<\/h2>/, 'Scores deve ser botão, não quadro na Home');
  assert.doesNotMatch(home, /<h2>Favoritos<\/h2>/);
  assert.doesNotMatch(home, /id="homeFav(?:oritos|List)"/);
  assert.match(html, /id="page-favoritos"/, 'Página de favoritos preservada');
  assert.match(html, /id="favList"/, 'Lista de favoritos preservada');
  assert.doesNotMatch(html, /data-score="icpeUce"/, 'ICPE-UCE permanece removido');
});

test('VAS olfatória possui cartão, escala de 0 a 10 sem seleção prévia e fontes clínicas', () => {
  assert.match(html, /data-score="vasolfato"/);
  assert.match(html, /vasolfato:\s*\{/);
  assert.match(html, /special:'vas-olfato'/);
  assert.match(html, /id="vasOlfatoSlider"/);
  assert.match(html, /min="0" max="10" step="0.1"/);
  assert.match(html, /slider\.dataset\.touched='0'/);
  assert.match(html, /elementoVAS\.dataset\.touched!=='1'/);
  assert.match(html, /10\.18176\/jiaci\.0937/);
  assert.match(html, /PMC10879704/);
  assert.doesNotMatch(html, /localStorage\.setItem\(['"]vasOlfato/);
});

test('todos os destinos data-nav do menu existem como page-id', () => {
  const pages = new Set([...html.matchAll(/id=["']page-([^"']+)["']/g)].map(m => m[1]));
  const navs = new Set([...html.matchAll(/data-nav=["']([^"']+)["']/g)].map(m => m[1]));
  const ausentes = [...navs].filter(p => !pages.has(p));
  assert.deepEqual(ausentes, []);
});

test('scripts embutidos na página principal têm sintaxe JavaScript válida', () => {
  const blocks = [...html.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script>/gi)];
  assert.ok(blocks.length >= 5, 'scripts inline não encontrados');
  let count = 0;
  for (const [, attrs, code] of blocks) {
    if (!code.trim() || /type=["'](?:application\/json|application\/ld\+json)["']/i.test(attrs)) continue;
    count++;
    const check = spawnSync(process.execPath, ['--check', '--input-type=module'], { input: code, encoding: 'utf8' });
    assert.equal(check.status, 0, 'Erro de sintaxe no script inline #' + count + ': ' + check.stderr);
  }
  assert.ok(count >= 3, 'Nenhum bloco JavaScript relevante conferido');
});

test('funções Cloudflare e arquivos JS auxiliares têm sintaxe válida', () => {
  const files = ['functions/news.js', 'functions/cursos.js', 'functions/crm.js', 'functions/ia.js', 'ige-clinica.js', 'sw.js', 'scripts/radar.mjs', 'scripts/radar-link.mjs'];
  for (const file of files) {
    const code = readFileSync(new URL(file, root), 'utf8');
    const check = spawnSync(process.execPath, ['--check', '--input-type=module'], { input: code, encoding: 'utf8' });
    assert.equal(check.status, 0, 'Erro de sintaxe em ' + file + ': ' + check.stderr);
  }
});

test('recursos básicos usados no cabeçalho existem no repositório', () => {
  const files = ['manifest.json', 'sw.js', 'ige-clinica.js', 'apple-touch-icon.png', 'favicon-32.png', 'icon-192.png', 'icon-512.png'];
  for (const file of files) {
    assert.doesNotThrow(() => readFileSync(new URL(file, root)), 'Recurso ausente: ' + file);
  }
});
