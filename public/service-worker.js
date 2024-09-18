//service-worker.js per la gestione della cache locale e notifiche push
self.addEventListener('install', (event) => {
  console.log('Service worker installing...');
  // Puoi aggiungere risorse alla cache durante l'installazione
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
  // Rimuovere le cache obsolete
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== 'static-cache-v1') {
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
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    }).catch(() => {
      return caches.match('/fallback.html'); // se la richiesta fallisce
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
