const cacheName = 'notas-v1';
const assets = [
  './',
  './index.html',
  './manifest.json',
  './icone.png'
];

// Instala o Service Worker e guarda os arquivos no celular
self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(cacheName).then((cache) => {
      return cache.addAll(assets);
    })
  );
});

// Permite que o app abra mesmo sem internet (Offline)
self.addEventListener('fetch', (e) => {
  e.respondWith(
    caches.match(e.request).then((response) => {
      return response || fetch(e.request);
    })
  );
});
