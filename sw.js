// Rede primeiro para arquivos estáticos; APIs e dados dinâmicos nunca entram no cache.
const CACHE = 'hub-alergista-v1166-email';
const ASSETS = ['./', 'index.html', 'lgpd-runtime.js?v=20261104-5', 'ige-clinica.js?v=20261103-1', 'privacidade.html', 'manifest.json', 'icon-192.png', 'icon-512.png'];
const PATHS = new Set(['/', '/index.html', '/ige-clinica.js', '/lgpd-runtime.js', '/privacidade.html', '/manifest.json', '/icon-192.png', '/icon-512.png']);

self.addEventListener('install', event => {
  self.skipWaiting();
  event.waitUntil(caches.open(CACHE).then(cache => cache.addAll(ASSETS)).catch(() => {}));
});

self.addEventListener('activate', event => event.waitUntil(
  caches.keys()
    .then(keys => Promise.all(keys.filter(k => k.startsWith('hub-alergista-') && k !== CACHE).map(k => caches.delete(k))))
    .then(() => self.clients.claim())
));

self.addEventListener('fetch', event => {
  const req = event.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  if (url.origin !== self.location.origin || !PATHS.has(url.pathname)) return;
  event.respondWith(
    fetch(req)
      .then(res => {
        if (res && res.ok) {
          const copia = res.clone();
          event.waitUntil(caches.open(CACHE).then(c => c.put(req, copia)).catch(() => {}));
        }
        return res;
      })
      .catch(() => caches.match(req, { ignoreSearch: true }))
  );
});
