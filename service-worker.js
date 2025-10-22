// Bebida Selada® v4.8.5 — Service Worker (Prime Polished)
const CACHE_VERSION = 'bs-v4.8.5-prime';
const ASSETS_TO_CACHE = [
  '/',
  '/index.html',
  '/offline.html',
  '/img/icon-192.png',
  '/img/icon-512.png',
  '/img/qr-bebida-selada-hd.png',
  '/img/favicon.ico'
];

// Instalação: cachear assets essenciais
self.addEventListener('install', event => {
  console.log('[SW] Bebida Selada v4.8.4 — Instalando...');
  event.waitUntil(
    caches.open(CACHE_VERSION)
      .then(cache => {
        console.log('[SW] Cache criado:', CACHE_VERSION);
        return cache.addAll(ASSETS_TO_CACHE);
      })
      .then(() => self.skipWaiting())
  );
});

// Ativação: limpar caches antigos
self.addEventListener('activate', event => {
  console.log('[SW] Bebida Selada v4.8.4 — Ativando...');
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_VERSION) {
            console.log('[SW] Removendo cache antigo:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
    .then(() => {
      console.log('[SW] Cache reinicializado para:', CACHE_VERSION);
      return self.clients.claim();
    })
  );
});

// Fetch: estratégia Network First com fallback para cache
self.addEventListener('fetch', event => {
  event.respondWith(
    fetch(event.request)
      .then(response => {
        // Cachear resposta bem-sucedida
        if (response && response.status === 200) {
          const responseToCache = response.clone();
          caches.open(CACHE_VERSION)
            .then(cache => cache.put(event.request, responseToCache));
        }
        return response;
      })
      .catch(() => {
        // Fallback para cache se offline
        return caches.match(event.request)
          .then(response => {
            return response || caches.match('/offline.html');
          });
      })
  );
});
