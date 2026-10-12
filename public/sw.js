// Digital Dorji - Service Worker for Offline Caching and Chrome Performance
const CACHE_NAME = 'digital-dorji-cache-v1';

// Essential static resources to pre-cache on install
const PRECACHE_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/robots.txt',
  '/sitemap.xml',
  '/icon.svg'
];

// Install Event: pre-cache critical shell assets
self.addEventListener('install', (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return Promise.allSettled(
        PRECACHE_ASSETS.map((url) =>
          cache.add(url).catch((err) => {
            console.warn(`[ServiceWorker] Could not pre-cache ${url}:`, err);
          })
        )
      );
    })
  );
});

// Activate Event: clean up obsolete cache versions and take immediate control
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((name) => name !== CACHE_NAME)
          .map((name) => {
            console.log(`[ServiceWorker] Removing old cache: ${name}`);
            return caches.delete(name);
          })
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch Event: handle navigation and asset requests
self.addEventListener('fetch', (event) => {
  const request = event.request;
  const url = new URL(request.url);

  // 1. Only intercept GET requests
  if (request.method !== 'GET') {
    return;
  }

  // 2. Bypass API, WebSocket, and upload routes (always live network)
  if (
    url.pathname.startsWith('/api/') ||
    url.pathname.startsWith('/socket.io/') ||
    url.pathname.startsWith('/uploads/')
  ) {
    return;
  }

  // 3. Navigation requests (HTML documents) - Network First with Cache Fallback
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200) {
            const responseToCache = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(request, responseToCache);
            });
          }
          return networkResponse;
        })
        .catch(async () => {
          // If network is offline, attempt cached URL first, then fallback to cached index.html
          const cachedPage = await caches.match(request);
          if (cachedPage) {
            return cachedPage;
          }
          const offlineShell = await caches.match('/index.html');
          if (offlineShell) {
            return offlineShell;
          }
          return new Response(
            `<!DOCTYPE html><html><head><meta charset="UTF-8"><title>Digital Dorji - Offline</title><meta name="viewport" content="width=device-width,initial-scale=1.0"><style>body{font-family:sans-serif;text-align:center;padding:40px 20px;background:#f8fafc;color:#1e293b}h1{color:#1e40af}p{color:#64748b}button{background:#2563eb;color:#fff;border:none;padding:10px 20px;border-radius:8px;font-size:16px;cursor:pointer}</style></head><body><h1>ডিজিটাল দর্জি (Digital Dorji)</h1><p>You are currently offline. Please check your internet connection and refresh.</p><button onclick="window.location.reload()">Retry</button></body></html>`,
            {
              headers: { 'Content-Type': 'text/html; charset=utf-8' }
            }
          );
        })
    );
    return;
  }

  // 4. Static assets (JS, CSS, Web Fonts, Images) - Stale-While-Revalidate
  // Serves instant cached copy if present, while updating the cache in the background for Chrome
  event.respondWith(
    caches.match(request).then((cachedResponse) => {
      const fetchPromise = fetch(request)
        .then((networkResponse) => {
          if (
            networkResponse &&
            networkResponse.status === 200 &&
            (networkResponse.type === 'basic' || networkResponse.type === 'cors')
          ) {
            const responseToCache = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(request, responseToCache);
            });
          }
          return networkResponse;
        })
        .catch(() => cachedResponse);

      return cachedResponse || fetchPromise;
    })
  );
});

// Support manual skip waiting message
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});
