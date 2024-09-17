importScripts('https://storage.googleapis.com/workbox-cdn/releases/6.5.3/workbox-sw.js');

if (workbox) {
  console.log("Workbox is loaded");

  // Verifica se __WB_MANIFEST è definito
  if (self.__WB_MANIFEST) {
    workbox.precaching.precacheAndRoute(self.__WB_MANIFEST);
  } else {
    console.warn("__WB_MANIFEST non è disponibile. Assicurati che il processo di build stia generando correttamente il manifest.");
  }

  // Strategia NetworkFirst per le richieste API
  const networkFirstStrategy = new workbox.strategies.NetworkFirst({
    cacheName: 'network-first-cache',
  });

  // Strategia CacheFirst per altri asset
  const cacheFirstStrategy = new workbox.strategies.CacheFirst({
    cacheName: 'cache-first-cache',
    plugins: [
      new workbox.expiration.ExpirationPlugin({
        maxEntries: 50,
        maxAgeSeconds: 7 * 24 * 60 * 60, // Cache scade dopo una settimana
      }),
      new workbox.cacheableResponse.CacheableResponsePlugin({
        statuses: [0, 200],
      }),
    ],
  });

  // Gestione degli eventi fetch
  self.addEventListener('fetch', (event) => {
    if (event.request.url.includes('/api/')) {
      event.respondWith(
        networkFirstStrategy.handle({ event }).catch(() => {
          return caches.match('/fallback.json');
        })
      );
    } else if (event.request.url.includes('/assets/')) {
      event.respondWith(
        cacheFirstStrategy.handle({ event }).catch(() => {
          return caches.match('/fallback.html');
        })
      );
    } else {
      event.respondWith(
        fetch(event.request).catch(() => {
          return new Response('Offline');
        })
      );
    }
  });

} else {
  console.error("Workbox didn't load");
}
