const CACHE_NAME = 'apoio-protecao-dinamico-v2';

// Instalação (mínimo essencial)
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll([
        './',
        './index.html',
        './manifest.json'
      ]);
    })
  );
});

// Ativação
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys => {
      return Promise.all(
        keys.map(key => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      );
    })
  );
});

// Estratégia: CACHE DINÂMICO (Stale-While-Revalidate)
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(cachedResponse => {

      const fetchPromise = fetch(event.request)
        .then(networkResponse => {
          // Salva automaticamente tudo que for acessado
          return caches.open(CACHE_NAME).then(cache => {
            cache.put(event.request, networkResponse.clone());
            return networkResponse;
          });
        })
        .catch(() => cachedResponse); // fallback offline

      // Retorna cache primeiro (rápido), depois atualiza
      return cachedResponse || fetchPromise;
    })
  );
});
