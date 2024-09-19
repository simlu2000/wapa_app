self.addEventListener('install', (event) => {
  console.log('Service worker installing...');
  // Aggiungi risorse alla cache durante l'installazione
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

self.addEventListener('activate', (event) => {
  console.log('Service worker activating...');
  // Rimuovi le cache obsolete
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      console.log('Cache names:', cacheNames);
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

self.addEventListener('fetch', (event) => {
  console.log('Service worker fetching:', event.request.url);
  event.respondWith(
    fetch(event.request)
      .then((response) => {
        // Cache the response if the request is successful
        const responseClone = response.clone();
        caches.open('static-cache-v1').then((cache) => {
          cache.put(event.request, responseClone);
        });
        return response;
      })
      .catch(() => {
        // Fallback to cache if network fails
        return caches.match(event.request).then((response) => {
          return response || caches.match('/fallback.html');
        });
      })
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
