const CACHE_NAME = "todo-cache-v1";
const urlsToCache = [
  "index.html",
  "style/style.css",
  "script/script.js",
  "manifest.json",
  "img/icon-192.png",
  "img/icon-512.png"
];

self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(urlsToCache))
  );
});
self.addEventListener("fetch", event => {
  event.respondWith(
    caches.match(event.request).then(response => response || fetch(event.request))
  );
});
