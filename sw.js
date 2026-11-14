// Hub do Alergista — cache somente de arquivos públicos estáticos.
// APIs e dados clínicos dinâmicos jamais são armazenados pelo service worker.
const CACHE = 'hub-alergista-v1230-protocolos-verticais-20261114';
const ASSETS = ['interacoes-clinicas.js?v=20261114-sem-ia-1', 'protocolos-bolso-condutas-20261114.js?v=20261114-2', 'artigos-premium.js?v=20261112-1', 'alergo-news-premium.css?v=20261110-justificado-4', 'hub-clinical-responsive.css?v=20261110-radar-compact-3', 'antihistaminicos.js?v=20261109-6', 'antihistaminicos.css?v=20261109-2', 'hub-novidades.js?v=20261112-auto-1', 'data/hub-novidades.json', 'congresso-asbai-2026-banner.svg', 'filter-chips-drag.js?v=20261109-1', 'congresso-banner-destaque.css?v=20261109-8', 'comparador-resultado.css?v=20261109-1', 'scores-desktop.css?v=20261109-2', 'laboratorio-proportional.css?v=20261109-1', 'desktop-universal.css?v=20261109-bio-card-7', 'responsive-adapt.css?v=20261109-original-1', 'comparador-reatividade-alimentar.js?v=20261109-5', 'congresso-assistente.js?v=20261109-3', 'imunoglobulinas-calculadora.js?v=20261109-1', 'scorad-premium.js?v=20261111-3', 'assets/scorad-intensidades.webp?v=20261111-1', './', 'index.html', 'instalar.html', 'lgpd-runtime.js?v=20261104-8', 'ige-clinica.js?v=20261104-2', 'calendarios-imunizacoes.js?v=20261113-vpc20-2', 'privacidade.html', 'analytics-client.js?v=20261113-health1', 'manifest.json', 'icon-192.png?v=20261109-original-1', 'icon-512.png?v=20261109-original-1'];
const PATHS = new Set(['/interacoes-clinicas.js', '/protocolos-bolso-condutas-20261114.js', '/artigos-premium.js', '/alergo-news-premium.css', '/hub-clinical-responsive.css', '/antihistaminicos.js', '/antihistaminicos.css', '/hub-novidades.js', '/data/hub-novidades.json', '/congresso-asbai-2026-banner.svg', '/filter-chips-drag.js', '/congresso-banner-destaque.css', '/scores-desktop.css', '/comparador-resultado.css', '/laboratorio-proportional.css', '/desktop-universal.css', '/congresso-assistente.js', '/comparador-reatividade-alimentar.js', '/responsive-adapt.css', '/', '/index.html', '/instalar.html', '/ige-clinica.js', '/calendarios-imunizacoes.js', '/imunoglobulinas-calculadora.js', '/scorad-premium.js', '/assets/scorad-intensidades.webp', '/lgpd-runtime.js', '/privacidade.html', '/analytics-client.js', '/manifest.json', '/icon-192.png', '/icon-512.png']);
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
