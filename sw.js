const CACHE_NAME = 'mis-clientas-v1';
const ASSETS = [
  './index.html',
  './avon-natura.jpeg',
  './manifest.json'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS))
  );
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', event => {
  // Las llamadas al Apps Script siempre van a la red (datos en tiempo real)
  if (event.request.url.includes('script.google.com')) {
    event.respondWith(fetch(event.request));
    return;
  }
  // Para el resto: cache first, fallback a red
  event.respondWith(
    caches.match(event.request).then(cached => cached || fetch(event.request))
  );
});
