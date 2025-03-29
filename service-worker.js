const CACHE_NAME = "airport-buddy-cache-v1";
const urlsToCache = [
    "./index.html",
    "./styles.css",
    "./app.js",
    "./airports.json",
    "./manifest.json",
    "./images/icon-192.png",
    "./images/icon-512.png"
];

// Install Service Worker
self.addEventListener("install", event => {
    event.waitUntil(
        caches.open(CACHE_NAME).then(cache => {
            return cache.addAll(urlsToCache);
        })
    );
});

// Fetch and cache requests
self.addEventListener("fetch", event => {
    event.respondWith(
        caches.match(event.request).then(response => {
            // If the file is found in the cache, return it
            if (response) {
                return response;
            }
            // Otherwise, fetch the resource from the network
            return fetch(event.request).then(networkResponse => {
                // Cache the response if it's an HTML file or another important asset
                if (networkResponse && networkResponse.status === 200 && event.request.url.endsWith('.html')) {
                    caches.open(CACHE_NAME).then(cache => {
                        cache.put(event.request, networkResponse.clone());
                    });
                }
                return networkResponse;
            });
        }).catch(() => {
            // If both the cache and the network fail, serve index.html for SPA routing
            return caches.match("./index.html");
        })
    );
});
