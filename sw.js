/* Slabikář — offline: hra se uloží do zařízení a jede i bez internetu */
const V = 'slabikar-v2';
const FILES = ['./', 'index.html', 'css/app.css?v=2', 'js/data.js?v=2', 'js/core.js?v=2', 'js/audio.js?v=2', 'js/art.js?v=2', 'js/fx.js?v=2', 'js/games.js?v=2', 'js/ride.js?v=2', 'js/views.js?v=2', 'js/main.js?v=2',
  'fonts/andika-latin-400-normal.woff2', 'fonts/andika-latin-ext-400-normal.woff2', 'fonts/andika-latin-700-normal.woff2', 'fonts/andika-latin-ext-700-normal.woff2',
  'fonts/baloo-2-latin-800-normal.woff2', 'fonts/baloo-2-latin-ext-800-normal.woff2', 'manifest.webmanifest', 'icons/icon.svg', 'icons/icon-192.png', 'icons/icon-512.png'];
self.addEventListener('install', e => { e.waitUntil(caches.open(V).then(c => c.addAll(FILES)).then(() => self.skipWaiting())); });
self.addEventListener('activate', e => { e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== V).map(k => caches.delete(k)))).then(() => self.clients.claim())); });
self.addEventListener('fetch', e => {
  const u = new URL(e.request.url);
  if (e.request.method !== 'GET' || u.origin !== location.origin || u.pathname.endsWith('hlas.json')) return;
  /* stránka: nejdřív síť (ať jsou novinky hned), jinak uložená; ostatní: uložené, na pozadí obnovit */
  if (e.request.mode === 'navigate') {
    e.respondWith(fetch(e.request).then(r => { const c = r.clone(); caches.open(V).then(x => x.put('index.html', c)); return r; }).catch(() => caches.match('index.html')));
    return;
  }
  e.respondWith(caches.match(e.request).then(hit => {
    const net = fetch(e.request).then(r => { if (r.ok) { const c = r.clone(); caches.open(V).then(x => x.put(e.request, c)); } return r; }).catch(() => hit);
    return hit || net;
  }));
});
