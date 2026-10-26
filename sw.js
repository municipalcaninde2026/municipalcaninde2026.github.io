const C='mun26-v1';
const SHELL=['./','index.html','manifest.json','logo-campeonato.png','hub-logo.png','icon-192.png'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(C).then(c=>c.addAll(SHELL)).then(()=>self.skipWaiting()))});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==C).map(k=>caches.delete(k)))).then(()=>self.clients.claim()))});
self.addEventListener('fetch',e=>{
  const u=new URL(e.request.url);
  if(e.request.method!=='GET')return;
  if(u.origin===location.origin&&(u.pathname.endsWith('/')||u.pathname.endsWith('index.html')||u.pathname.endsWith('dados.json'))){
    e.respondWith(fetch(e.request).then(r=>{const cp=r.clone();caches.open(C).then(c=>c.put(e.request.url.split('?')[0],cp));return r}).catch(()=>caches.match(e.request.url.split('?')[0])));return;
  }
  e.respondWith(caches.match(e.request).then(h=>h||fetch(e.request).then(r=>{if(r.ok&&(u.origin===location.origin||u.host.includes('gstatic')||u.host.includes('googleapis')||u.host.includes('cdnjs'))){const cp=r.clone();caches.open(C).then(c=>c.put(e.request,cp))}return r})));
});
