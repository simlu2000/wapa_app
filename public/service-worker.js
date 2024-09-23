/*Il service worker deve gestire l'installazione, l'attivazione, 
il caching e l'invio di notifiche push.*/
// Installazione del Service Worker
self.addEventListener('install', (event) => {
  console.log('Service worker installing...');
  event.waitUntil(
    caches.open('static-cache-v1').then((cache) => {
      return cache.addAll([
        '/',
        '/index.html',
        '/styles.css',
        '/main.js',
        '/fallback.html', // pagina di fallback
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

// Gestione delle notifiche push
self.addEventListener('push', (event) => {
  const data = event.data.json();
  console.log('Push notification received:', data);

  const options = {
    body: data.body,
    icon: '/icons/icon-192x192.png',
    badge: '/icons/badge-72x72.png',
    data: {
      url: data.url
    }
  };

  event.waitUntil(
    self.registration.showNotification(data.title, options)
  );
});

// Gestire il click sulle notifiche push
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  event.waitUntil(
    clients.openWindow(event.notification.data.url)
  );
});