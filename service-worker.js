
const CACHE_NAME="dar-attendance-cache-v1";

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
"./supabase.js",
"./manifest.json"
];

self.addEventListener("install",event=>{

self.skipWaiting();

event.waitUntil(
caches.open(CACHE_NAME).then(cache=>cache.addAll(FILES))
);

});

self.addEventListener("activate",event=>{

event.waitUntil(self.clients.claim());

});

self.addEventListener("fetch",event=>{

event.respondWith(
caches.match(event.request).then(res=>res||fetch(event.request))
);

});
