const CACHE_NAME = 'bebidaselada-v1';
const urlsToCache = [
    '/',
    '/index.html',
    '/offline.html',
    '/style.css',
    '/images/icon-192x192.png',
    '/images/icon-512x512.png'
    // Adicione outros arquivos importantes aqui (ex: logo, JS)
];

// Instalação do Service Worker
self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                console.log('Cache aberto: Arquivos essenciais pré-armazenados em cache.');
                return cache.addAll(urlsToCache);
            })
    );
    self.skipWaiting(); // Garante que o Service Worker se ative imediatamente
});

// Intercepta requisições para servir do cache (Estratégia Cache First)
self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request)
            .then(response => {
                // Se o recurso estiver no cache, retorna o cache
                if (response) {
                    return response;
                }
                
                // Se não estiver no cache, tenta buscar na rede
                return fetch(event.request).catch(function() {
                    // Se a busca na rede falhar (offline), retorna a página offline
                    if (event.request.mode === 'navigate') {
                        return caches.match('/offline.html');
                    }
                });
            })
    );
});

// Ativação e Limpeza de Caches Antigos
self.addEventListener('activate', event => {
    const cacheWhitelist = [CACHE_NAME];
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cacheName => {
                    if (cacheWhitelist.indexOf(cacheName) === -1) {
                        // Exclui caches antigos
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});
