const cacheName = 'notas-v1';
// Lista de arquivos que serão salvos no celular para funcionar offline
const assets = [
  './',
  './index.html',
  './manifest.json',
  './icon.png' 
];

// Instala o Service Worker e guarda os arquivos no cache
self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(cacheName).then((cache) => {
      // O cache.addAll falha se um dos arquivos da lista acima não existir na pasta
      return cache.addAll(assets);
    })
  );
});

// Ativa o Service Worker e limpa caches antigos se houver atualização
self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keyList) => {
      return Promise.all(keyList.map((key) => {
        if (key !== cacheName) {
          return caches.delete(key);
        }
      }));
    })
  );
});

// Responde com o cache quando estiver sem internet
self.addEventListener('fetch', (e) => {
  e.respondWith(
    caches.match(e.request).then((response) => {
      return response || fetch(e.request);
    })
  );
});
