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
  assert.match(home, /id=["']page-medicamentos["']/i, 'A aba Medicamentos não está publicada');
  assert.match(home, /data-nav=["']medicamentos["']/i, 'Atalho Medicamentos ausente da Home');
  assert.doesNotMatch(home, /<div class="qcard" data-nav="antihistaminicos">/i, 'Antigo atalho permanece na Home');
  const medsJS = await (await get('/medicamentos-catalogo.js')).text();
  assert.match(medsJS, /data-med-budget/, 'Filtro de preço não está publicado');
  const medsCSS = await (await get('/medicamentos-catalogo.css')).text();
  assert.match(medsCSS, /#medApp/, 'Estilos de Medicamentos não publicados');
  // A instalação deve abrir diretamente na aba atual: evitar disparar a PWA já instalada
  // (que pode exibir uma tela de abertura antiga armazenada no dispositivo).
  const installLink = home.match(/<a[^>]+id=["']hubInstallBtn["'][^>]+>/i)?.[0];
  assert.ok(installLink, 'Atalho de instalação ausente na Home');
  assert.match(installLink, /href=["']\.\/instalar\.html\?v=/i);
  assert.doesNotMatch(installLink, /target=["']_blank["']/i, 'Instalação não deve abrir nova aba');
  const guide = await (await get('/instalar.html')).text();
  assert.match(guide, /class=["']brand-icon brand-android["']/);
  assert.match(guide, /class=["']brand-icon brand-apple["']/);
  assert.doesNotMatch(guide, /Apple \(iPhone\/iPad\)/i);
  assert.doesNotMatch(guide, /CEAI/i, 'A página de instalação não pode exibir marca CEAI');
  const manifest = await (await get('/manifest.json')).json();
  assert.ok(manifest.name || manifest.short_name, 'Manifesto do aplicativo inválido');
  const script = await (await get('/sw.js')).text();
  assert.match(script, /const CACHE/);
  // Garante que a função dinâmica de artigos foi publicada (não apenas o HTML estático).
  const artigosInvalidos=await fetch(BASE+'/artigos?tema=tema-inexistente',{
    method:'GET',signal:AbortSignal.timeout(TIMEOUT),cache:'no-store'
  });
  assert.equal(artigosInvalidos.status,400,'Rota /artigos não está publicada corretamente');
  const erroArtigos=await artigosInvalidos.json();
  assert.match(String(erroArtigos.erro||''),/Filtro inválido/);
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
