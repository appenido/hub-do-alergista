// Verificação operacional externa da versão publicada, executada no GitHub Actions.
// Não acessa informações de pacientes, nem requer credenciais.
import assert from 'node:assert/strict';

const BASE = (process.env.HUB_URL || 'https://hubdoalergista.pages.dev').replace(/\/$/, '');
const TIMEOUT = 18000;
const WAIT = 15000;
const TENTATIVAS = 8;
async function get(path) {
  const response = await fetch(BASE + path, {
    method: 'GET',
    headers: { 'Accept': path === '/' ? 'text/html' : 'application/json,*/*' },
    signal: AbortSignal.timeout(TIMEOUT),
    cache: 'no-store'
  });
  assert.equal(response.status, 200, path + ' retornou HTTP ' + response.status);
  return response;
}
async function verificar() {
  const home = await (await get('/')).text();
  assert.match(home, /<title>Hub do Alergista<\/title>/i);
  assert.match(home, /id=["']page-guidelines["']/i);
  const manifest = await (await get('/manifest.json')).json();
  assert.ok(manifest.name || manifest.short_name, 'Manifesto do aplicativo inválido');
  const script = await (await get('/sw.js')).text();
  assert.match(script, /const CACHE/);
  const noticias = await (await get('/news')).json();
  assert.ok(Array.isArray(noticias.itens), '/news não tem lista de itens');
  assert.ok(noticias.itens.length <= 10, 'Limite de notícias verificado excedido');
  for (const item of noticias.itens) {
    assert.ok(item.titulo && item.fonte && item.data && /^https:\/\//i.test(item.url), 'Matéria verificada inválida');
    const idade = Date.now() - Date.parse(item.data);
    assert.ok(idade >= -5 * 60 * 1000 && idade <= 7 * 86400000, 'Matéria fora da janela editorial');
  }
  console.log('Smoke test OK — home, manifesto, PWA e /news verificado.');
}
let erro;
for (let tentativa = 1; tentativa <= TENTATIVAS; tentativa++) {
  try { await verificar(); process.exit(0); }
  catch (e) {
    erro = e;
    console.warn('Tentativa ' + tentativa + '/' + TENTATIVAS + ': ' + e.message);
    if (tentativa < TENTATIVAS) await new Promise(resolve => setTimeout(resolve, WAIT));
  }
}
console.error('Falha operacional: ' + erro.message);
process.exitCode = 1;
