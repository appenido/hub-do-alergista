import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const root = new URL('../', import.meta.url);
const html = readFileSync(new URL('index.html', root), 'utf8');

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
