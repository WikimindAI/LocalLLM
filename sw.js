// LocalLLM service worker — change VERSION à chaque déploiement pour vider l'ancien cache.
const VERSION = 'v1';
const CACHE = 'localllm-' + VERSION;
const SHELL = [
  './', './index.html', './models.json', './hardware.json',
  './PWA/manifest.webmanifest', './PWA/favicon.svg',
  './PWA/icon-192.png', './PWA/icon-512.png', './PWA/apple-touch-icon.png'
];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(SHELL)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(k => k.startsWith('localllm-') && k !== CACHE).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET' || new URL(req.url).origin !== location.origin) return;

  // Pages : réseau d'abord (toujours à jour), cache si hors ligne
  if (req.mode === 'navigate') {
    e.respondWith(
      fetch(req).then(r => { const copy = r.clone(); caches.open(CACHE).then(c => c.put('./index.html', copy)); return r; })
        .catch(() => caches.match('./index.html'))
    );
    return;
  }

  // Le reste (JSON, icônes…) : cache tout de suite, mise à jour en arrière-plan
  e.respondWith(
    caches.match(req).then(hit => {
      const net = fetch(req).then(r => {
        if (r.ok) { const copy = r.clone(); caches.open(CACHE).then(c => c.put(req, copy)); }
        return r;
      }).catch(() => hit);
      return hit || net;
    })
  );
});
