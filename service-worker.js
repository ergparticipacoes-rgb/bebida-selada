/* ============================================================
   BEBIDA SELADA® — SERVICE WORKER v4.1 PRIME+
   ============================================================ */
const CACHE_NAME = "bebida-selada-v4.1-prime";
const CORE_ASSETS = [
  "/", "/index.html", "/offline.html",
  "/css/styles.css", "/js/app.js", "/manifest.json",
  "/img/qr-bebida-selada-v4.png", "/img/selo-bebida-selada.svg",
  "/img/favicon.ico", "/img/icon-192.png",
  "/img/icon-512.png", "/img/maskable-icon.png"
];

/* === Instalação === */
self.addEventListener("install", (event) => {
  event.waitUntil((async () => {
    const cache = await caches.open(CACHE_NAME);
    await cache.addAll(CORE_ASSETS);
    self.skipWaiting();
  })());
});

/* === Ativação === */
self.addEventListener("activate", (event) => {
  event.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)));
    self.clients.claim();
  })());
});

/* === Busca === */
self.addEventListener("fetch", (event) => {
  const { request } = event;
  if (request.method !== "GET") return;

  event.respondWith((async () => {
    const cached = await caches.match(request);
    try {
      const response = await fetch(request);
      const copy = response.clone();
      (await caches.open(CACHE_NAME)).put(request, copy);
      return response;
    } catch (err) {
      if (cached) return cached;
      if (request.mode === "navigate") return caches.match("/offline.html");
    }
  })());
});

/* === Atualização instantânea === */
self.addEventListener("message", (event) => {
  if (event.data === "skipWaiting") self.skipWaiting();
});
