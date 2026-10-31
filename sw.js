var V='odecty-v1';
var CORE=['./','index.html','manifest.webmanifest','icon-192.png','icon-512.png','apple-touch-icon.png'];
self.addEventListener('install',function(e){
  e.waitUntil(caches.open(V).then(function(c){return c.addAll(CORE)}).then(function(){return self.skipWaiting()}));
});
self.addEventListener('activate',function(e){
  e.waitUntil(caches.keys().then(function(ks){
    return Promise.all(ks.filter(function(k){return k!==V}).map(function(k){return caches.delete(k)}));
  }).then(function(){return self.clients.claim()}));
});
/* Rychlé načtení z mezipaměti, na pozadí se stáhne nová verze. */
self.addEventListener('fetch',function(e){
  var r=e.request;if(r.method!=='GET')return;
  e.respondWith(caches.open(V).then(function(c){
    return c.match(r,{ignoreSearch:true}).then(function(hit){
      var net=fetch(r).then(function(res){
        if(res&&(res.status===200||res.type==='opaque'))c.put(r,res.clone());
        return res;
      }).catch(function(){return hit});
      return hit||net;
    });
  }));
});
