const CACHE_NAME = "dar-attendance-v2"

const FILES_TO_CACHE = [
"./",
"./index.html",
"./dashboard.html",
"./style.css",
"./manifest.json",

"./login.js",
"./dashboard.js",
"./clock.js",
"./gps.js",
"./location.js",
"./offline.js",
"./sync.js",
"./supabase.js"
]

/* INSTALL */

self.addEventListener("install", event => {

 self.skipWaiting()

 event.waitUntil(
  caches.open(CACHE_NAME)
  .then(cache => {
   return cache.addAll(FILES_TO_CACHE)
  })
 )

})


/* ACTIVATE */

self.addEventListener("activate", event => {

 event.waitUntil(

  caches.keys().then(keys => {

   return Promise.all(

    keys.map(key => {

     if(key !== CACHE_NAME){
      return caches.delete(key)
     }

    })

   )

  })

 )

 self.clients.claim()

})


/* FETCH */

self.addEventListener("fetch", event => {

 event.respondWith(

  caches.match(event.request)
  .then(cached => {

   if(cached){
    return cached
   }

   return fetch(event.request)
   .then(response => {

    const responseClone = response.clone()

    caches.open(CACHE_NAME)
    .then(cache => {
     cache.put(event.request, responseClone)
    })

    return response

   })
   .catch(() => {

    if(event.request.mode === "navigate"){
     return caches.match("./index.html")
    }

   })

  })

 )

})
