// Hub do Alergista — cache somente de arquivos públicos estáticos.
// APIs e dados clínicos dinâmicos jamais são armazenados pelo service worker.
const CACHE = 'hub-alergista-v1280-comparador-multi-food-20261124';
const ASSETS = ['vacinas-criterios.js?v=20261124-imunizacoes-premium1', 'hub-paginas.js?v=20261124-ige-abas1', 'laboratorio-fichas.js?v=20261124-abas-internas1', 'laboratorio-fichas.css?v=20261124-abas-internas1', 'hub-paginas.css?v=20261124-imunizacoes-premium1', 'urticarias-induziveis.js?v=20261119-paginas1', 'urticarias-induziveis.css?v=20261118-1', 'desktop-layout-coerente.css?v=20261118-compact-home-3', 'home-premium.css?v=20261124-home-premium1', 'hub-atualizacoes.css?v=20261118-compact2', 'hub-atualizacoes.js?v=20261118-compact2', 'data/hub-atualizacoes.json', 'data/hub-i18n-en.json?v=20261115-traducao3', 'data/hub-i18n-es.json?v=20261115-traducao3', 'data/hub-i18n-catalog.json?v=20261114-3', 'asma-dispositivos.js?v=20261114-2', 'asma-dispositivos.css?v=20261114-1', 'medicamentos-dose-regras.js?v=20261115-dose3', 'medicamentos-dose.js?v=20261117-dose-pediatrica1', 'medicamentos-catalogo.js?v=20261124-fabricantes-horizontal2', 'medicamentos-catalogo.css?v=20261124-fabricantes-horizontal2', 'hub-i18n.js?v=20261118-titulos-originais', 'hub-i18n.css?v=20261114-5', 'protocolos-bolso-condutas-20261114.js?v=20261114-12', 'artigos-premium.js?v=20261118-titulos-originais', 'alergo-news-premium.css?v=20261123-onze1', 'alergo-news-premium.js?v=20261123-onze1', 'hub-clinical-responsive.css?v=20261110-radar-compact-3', 'antihistaminicos.js?v=20261124-fabricantes-horizontal2', 'antihistaminicos.css?v=20261109-2', 'hub-novidades.js?v=20261114-legivel-2', 'data/hub-novidades.json', 'uptodate-ui.js?v=20261114-legivel-2', 'congresso-asbai-2026-banner.svg', 'filter-chips-drag.js?v=20261109-1', 'congresso-banner-destaque.css?v=20261109-8', 'comparador-resultado.css?v=20261124-1', 'scores-desktop.css?v=20261109-2', 'laboratorio-proportional.css?v=20261109-1', 'desktop-universal.css?v=20261109-bio-card-7', 'responsive-adapt.css?v=20261109-original-1', 'comparador-reatividade-alimentar.js?v=20261124-1', 'congresso-assistente.js?v=20261109-3', 'imunoglobulinas-calculadora.js?v=20261109-1', 'scorad-premium.js?v=20261111-3', 'dermatite-scores-easi-nrs.js?v=20261119-1', 'assets/scorad-intensidades.webp?v=20261111-1', './', 'index.html', 'instalar.html', 'lgpd-runtime.js?v=20261104-8', 'ige-clinica.js?v=20261104-2', 'calendarios-imunizacoes.js?v=20261124-imunizacoes-premium1', 'privacidade.html', 'analytics-client.js?v=20261114-private-nav2', 'manifest.json', 'icon-192.png?v=20261109-original-1', 'icon-512.png?v=20261109-original-1'];
const PATHS = new Set(['/vacinas-criterios.js', '/hub-paginas.js', '/laboratorio-fichas.js', '/laboratorio-fichas.css', '/hub-paginas.css', '/urticarias-induziveis.js', '/urticarias-induziveis.css', '/desktop-layout-coerente.css', '/home-premium.css', '/hub-atualizacoes.css', '/hub-atualizacoes.js', '/data/hub-atualizacoes.json', '/data/hub-i18n-en.json', '/data/hub-i18n-es.json', '/data/hub-i18n-catalog.json', '/asma-dispositivos.js', '/asma-dispositivos.css', '/medicamentos-dose-regras.js', '/medicamentos-dose.js', '/data/medicamentos-apresentacoes.json', '/medicamentos-catalogo.js', '/medicamentos-catalogo.css', '/hub-i18n.js', '/hub-i18n.css', '/protocolos-bolso-condutas-20261114.js', '/artigos-premium.js', '/alergo-news-premium.css', '/alergo-news-premium.js', '/hub-clinical-responsive.css', '/antihistaminicos.js', '/antihistaminicos.css', '/hub-novidades.js', '/data/hub-novidades.json', '/uptodate-ui.js', '/congresso-asbai-2026-banner.svg', '/filter-chips-drag.js', '/congresso-banner-destaque.css', '/scores-desktop.css', '/comparador-resultado.css', '/laboratorio-proportional.css', '/desktop-universal.css', '/congresso-assistente.js', '/comparador-reatividade-alimentar.js', '/responsive-adapt.css', '/', '/index.html', '/instalar.html', '/ige-clinica.js', '/calendarios-imunizacoes.js', '/imunoglobulinas-calculadora.js', '/scorad-premium.js', '/dermatite-scores-easi-nrs.js', '/assets/scorad-intensidades.webp', '/lgpd-runtime.js', '/privacidade.html', '/analytics-client.js', '/manifest.json', '/icon-192.png', '/icon-512.png']);
let checkInProgress = null;

self.addEventListener('install', event => {
  self.skipWaiting();
  event.waitUntil(caches.open(CACHE).then(async cache => {
    // Banner mínimo e prioritário: manter disponível mesmo se outro
    // recurso opcional falhar durante o precache.
    try { await cache.add('congresso-asbai-2026-banner.svg'); } catch (error) {}
    await cache.addAll(ASSETS.filter(path => path !== 'congresso-asbai-2026-banner.svg')).catch(() => {});
  }).catch(() => {}));
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(key => key.startsWith('hub-alergista-') && key !== CACHE).map(key => caches.delete(key))))
      .then(() => self.clients.claim())
  );
});

async function notifyVersionChanged(excludeClientId) {
  const windows = await self.clients.matchAll({type:'window',includeUncontrolled:true});
  for (const client of windows) {
    if (!excludeClientId || client.id !== excludeClientId) {
      client.postMessage({type:'HUB_VERSION_CHANGED'});
    }
  }
}

function isEntryPage(path) {
  return path === '/' || path === '/index.html';
}

async function storeStaticResponse(request, response, pathname, excludeClientId) {
  try {
    const cache = await caches.open(CACHE);
    if (!isEntryPage(pathname)) {
      await cache.put(request,response);
      return;
    }
    // Comparação do HTML completo: identifica também deploys que não mudam sw.js.
    const previous = await cache.match('./') || await cache.match('index.html');
    const oldHTML = previous ? await previous.text() : null;
    const newHTML = await response.clone().text();
    await Promise.all([
      cache.put('./',response.clone()),
      cache.put('index.html',response.clone())
    ]);
    if(oldHTML !== null && oldHTML !== newHTML) await notifyVersionChanged(excludeClientId);
  } catch(error) {
    // Falha na atualização do cache não pode impedir o acesso à versão online.
  }
}

async function checkRemoteVersion() {
  const cache = await caches.open(CACHE);
  const previous = await cache.match('./') || await cache.match('index.html');
  const url = new URL('index.html', self.registration.scope);
  let response;
  try {
    response = await fetch(url.toString(), {cache:'no-store',credentials:'same-origin'});
    if (!response.ok || !(response.headers.get('content-type')||'').includes('text/html')) return;
    const freshHTML = await response.clone().text();
    if(!previous) {
      await cache.put('./',response.clone());
      await cache.put('index.html',response.clone());
      return;
    }
    const previousHTML = await previous.text();
    if(previousHTML !== freshHTML) {
      await cache.put('./',response.clone());
      await cache.put('index.html',response.clone());
      await notifyVersionChanged(null);
    }
  } catch(error) {
    // Sem internet: mantém a versão instalada e tentará novamente.
  }
}

self.addEventListener('message', event => {
  if(!event.data || event.data.type !== 'HUB_CHECK_VERSION') return;
  if(!checkInProgress) {
    checkInProgress = checkRemoteVersion().finally(() => { checkInProgress=null; });
  }
  event.waitUntil(checkInProgress);
});

self.addEventListener('fetch', event => {
  const request = event.request;
  if(request.method !== 'GET')return;
  const url = new URL(request.url);
  if(url.origin !== self.location.origin || !PATHS.has(url.pathname))return;
  event.respondWith((async () => {
    try {
      const response = await fetch(request);
      if(response && response.ok) {
        event.waitUntil(storeStaticResponse(request,response.clone(),url.pathname,event.clientId));
      }
      return response;
    } catch(error) {
      const cached = await caches.match(request,{ignoreSearch:true});
      if(cached)return cached;
      throw error;
    }
  })());
});

