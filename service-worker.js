const CACHE_NAME = "dar-attendance-v4"

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
  .then(cache => cache.addAll(FILES_TO_CACHE))
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

 const url = new URL(event.request.url)

 /* DO NOT CACHE SUPABASE API */

 if(url.hostname.includes("supabase")){
  return
 }

 event.respondWith(

  fetch(event.request)
  .then(response => {

   const clone = response.clone()

   caches.open(CACHE_NAME).then(cache=>{
    cache.put(event.request, clone)
   })

   return response

  })
  .catch(()=> caches.match(event.request))

 )

})
