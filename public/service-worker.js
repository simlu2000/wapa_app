// Installazione del Service Worker
self.addEventListener('install', (event) => {
  console.log('Service worker installing...');
  self.skipWaiting(); // Forza l'attivazione immediata del nuovo service worker
  event.waitUntil(
    caches.open('static-cache-v1').then((cache) => {
      return cache.addAll([
        '/',
        '/index.html',
        '/styles.css',
        '/main.js',
        '/fallback.html',
      ]);
    })
  );
});

// Attivazione del Service Worker
self.addEventListener('activate', (event) => {
  console.log('Service worker activating...');
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== 'static-cache-v1') {
            console.log('Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim(); // Il nuovo service worker prende immediatamente il controllo
});

// Gestione della cache per le richieste fetch
self.addEventListener('fetch', (event) => {
  console.log('Service worker fetching:', event.request.url);
  
  if (event.request.method !== 'GET') return;

  event.respondWith(
    caches.match(event.request).then((response) => {
      if (response) {
        return response;
      }

      return fetch(event.request).then((networkResponse) => {
        if (!networkResponse || networkResponse.status !== 200 || networkResponse.type !== 'basic') {
          return networkResponse;
        }

        const responseClone = networkResponse.clone();
        caches.open('static-cache-v1').then((cache) => {
          cache.put(event.request, responseClone);
        });

        return networkResponse;
      });
    }).catch(() => caches.match('/fallback.html'))
  );
});