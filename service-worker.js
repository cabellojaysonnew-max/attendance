
const CACHE="dar-attendance-cache"

const FILES=[
"./",
"./index.html",
"./dashboard.html",
"./style.css",
"./login.js",
"./dashboard.js",
"./clock.js",
"./gps.js",
"./location.js",
"./offline.js",
"./supabase.js"
]

self.addEventListener("install",e=>{
self.skipWaiting()
e.waitUntil(caches.open(CACHE).then(c=>c.addAll(FILES)))
})

self.addEventListener("activate",e=>{
e.waitUntil(self.clients.claim())
})

self.addEventListener("fetch",e=>{
e.respondWith(caches.match(e.request).then(r=>r||fetch(e.request)))
})
