/* ============================================================
   BEBIDA SELADA® — SERVICE WORKER v2.6.3 FINAL
   Cache inteligente + fallback offline + atualização suave
   ============================================================ */
const CACHE_NAME="bebida-selada-v2.6.3";
const CORE_ASSETS=[
  "/","/index.html","/offline.html","/css/styles.css","/js/app.js","/manifest.json",
  "/img/qr-bebida-selada-v2.svg","/img/selo-oficial.svg","/img/favicon.ico",
  "/img/icon-192.png","/img/icon-512.png","/img/maskable-icon.png"
];
self.addEventListener("install",(event)=>{event.waitUntil((async()=>{const cache=await caches.open(CACHE_NAME);await cache.addAll(CORE_ASSETS);self.skipWaiting()})())});
self.addEventListener("activate",(event)=>{event.waitUntil((async()=>{const keys=await caches.keys();await Promise.all(keys.filter(k=>k!==CACHE_NAME).map(k=>caches.delete(k)));self.clients.claim()})())});
self.addEventListener("fetch",(event)=>{
  const {request}=event; if(request.method!=="GET") return;
  event.respondWith((async()=>{
    const cached=await caches.match(request);
    try{
      const res=await fetch(request);
      const copy=res.clone(); (await caches.open(CACHE_NAME)).put(request,copy);
      return res;
    }catch(e){
      if(cached) return cached;
      if(request.mode==="navigate") return caches.match("/offline.html");
    }
  })());
});
self.addEventListener("message",(event)=>{ if(event.data==="skipWaiting") self.skipWaiting(); });
