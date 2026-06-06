const CACHE_NAME = "math-scanner-cache-v1";
const ASSETS_TO_CACHE = [
  "/",
  "/index.html",
  "/manifest.json",
  "https://cdn.jsdelivr.net/npm/katex@0.16.8/dist/katex.min.css"
];

// Install and Cache Core UI Shell assets
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log("Caching application Shell Assets");
      // Add key assets to cache, allowing some non-critical ones to fail silently without breaking sw boot
      return Promise.allSettled(
        ASSETS_TO_CACHE.map((asset) => {
          return cache.add(asset).catch((err) => {
            console.warn(`Could not preload asset in ServiceWorker: ${asset}`, err);
          });
        })
      );
    })
  );
  self.skipWaiting();
});

// Clean up stale caches
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            console.log("Clearing duplicate ServiceWorker Cache: ", key);
            return caches.delete(key);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// Network-First strategy with Cache Fallback for continuous stability
self.addEventListener("fetch", (event) => {
  // Only intercept GET operations (Ignore POST logs, Gemini calls, etc.)
  if (event.request.method !== "GET") return;

  event.respondWith(
    fetch(event.request)
      .then((networkResponse) => {
        // Cache successful responses from our same origin or core CDNs
        if (networkResponse && networkResponse.status === 200) {
          const clonedResponse = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, clonedResponse);
          });
        }
        return networkResponse;
      })
      .catch(() => {
        // Offline or connection failure - fall back to cached copy
        return caches.match(event.request).then((cachedResponse) => {
          if (cachedResponse) {
            return cachedResponse;
          }
          // Fallback response for un-cached page shells
          return new Response(
            `<div style="font-family: sans-serif; text-align: center; padding: 40px; background: #090d16; color: #f1f5f9; min-height: 100vh; display: flex; flex-direction: column; justify-content: center; align-items: center;">
              <h2>Offline Mode</h2>
              <p>Please check your internet connection and try again.</p>
              <button onclick="window.location.reload()" style="background: #0ea5e9; color: #ffffff; border: none; padding: 10px 20px; border-radius: 6px; cursor: pointer; font-weight: 500; margin-top: 15px;">Retry</button>
            </div>`,
            { headers: { "Content-Type": "text/html" } }
          );
        });
      })
  );
});
