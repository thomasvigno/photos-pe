const CACHE='photos-pe-v1.1.1';
const ASSETS=['./','./index.html','./style.css','./app.js','./core.js','./db.js','./zip.js','./manifest.webmanifest','./icon-192.png','./icon-512.png'];
self.addEventListener('install',event=>event.waitUntil((async()=>{
 const cache=await caches.open(CACHE);
 // Bypass HTTP caches too: a new cache name alone can still cache old resources.
 await cache.addAll(ASSETS.map(path=>new Request(new URL(path,self.location.href),{cache:'reload'})));
 await self.skipWaiting();
})()));
self.addEventListener('activate',event=>event.waitUntil((async()=>{
 for(const key of await caches.keys())if(key.startsWith('photos-pe-')&&key!==CACHE)await caches.delete(key);
 await self.clients.claim();
 // Do not navigate existing windows: a capture or an export may be in progress.
})()));
self.addEventListener('message',event=>{if(event.data?.type==='ACTIVATE_UPDATE')event.waitUntil(self.skipWaiting());});
self.addEventListener('fetch',event=>{
 const url=new URL(event.request.url);if(event.request.method!=='GET'||url.origin!==self.location.origin)return;
 event.respondWith((async()=>{
  const cache=await caches.open(CACHE);
  // Always use the shell belonging to this worker to avoid mixed app versions.
  if(event.request.mode==='navigate')return await cache.match('./index.html');
  const cached=await cache.match(event.request,{ignoreSearch:true});
  return cached||fetch(event.request);
 })());
});
