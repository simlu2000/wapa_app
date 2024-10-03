const CACHE_NAME = 'pages-cache-v1';

const filesToCache = [
  '/',
  '/index.html',
  '/styles.css',
  '/Styles/style_homescreen.css',
  '/main.js',
  '/fallback.html',
  '/manifest.json',
  '/icons/logo-144x144.png',
  '/src/img/WAPA_logo.png',
];

// Installazione del Service Worker
self.addEventListener('install', event => {
  console.log('Service worker installing...');
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      console.log('Adding static files to cache');
      return cache.addAll(filesToCache);
    })
  );
  self.skipWaiting();
});

// Gestione della cache per le richieste fetch
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      if (response) {
        console.log('Found', event.request.url, 'in cache');
        return response;
      }
      console.log('Resource not found in cache, fetching:', event.request.url);
      return fetch(event.request).then(response => {
        if (!response || response.status !== 200 || response.type !== 'basic') {
          return response;
        }
        let responseClone = response.clone();
        caches.open(CACHE_NAME).then(cache => {
          cache.put(event.request, responseClone);
        });
        return response;
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

// Gestione del click sulle notifiche push
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      for (let i = 0; i < clientList.length; i++) {
        let client = clientList[i];
        if (client.url === event.notification.data.url && 'focus' in client) {
          return client.focus();
        }
      }
      if (clients.openWindow) {
        return clients.openWindow(event.notification.data.url);
      }
    })
  );
});
