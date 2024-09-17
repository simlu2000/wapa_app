importScripts('https://storage.googleapis.com/workbox-cdn/releases/6.5.3/workbox-sw.js');

if (workbox) {
  console.log("Workbox is loaded");

  // Check if __WB_MANIFEST is available
  if (self.__WB_MANIFEST) {
    workbox.precaching.precacheAndRoute(self.__WB_MANIFEST);
  } else {
    console.warn("__WB_MANIFEST is not available. Ensure the build process is generating the manifest correctly.");
  }

  // Define NetworkFirst strategy for API requests
  const networkFirstStrategy = new workbox.strategies.NetworkFirst({
    cacheName: 'network-first-cache',
    networkTimeoutSeconds: 10, // Optional: Time to wait for the network before falling back to cache
  });

  // Define CacheFirst strategy for other assets
  const cacheFirstStrategy = new workbox.strategies.CacheFirst({
    cacheName: 'cache-first-cache',
    plugins: [
      new workbox.expiration.ExpirationPlugin({
        maxEntries: 50,
        maxAgeSeconds: 7 * 24 * 60 * 60, // Cache expires after a week
      }),
      new workbox.cacheableResponse.CacheableResponsePlugin({
        statuses: [0, 200],
      }),
    ],
  });

  // Handle fetch events
  self.addEventListener('fetch', (event) => {
    const url = new URL(event.request.url);

    if (url.pathname.startsWith('/api/')) {
      // Use NetworkFirst strategy for API requests
      event.respondWith(
        networkFirstStrategy.handle({ event }).catch(() => {
          // Fallback to a specific JSON file in case of an error
          return caches.match('/fallback.json');
        })
      );
    } else if (url.pathname.startsWith('/assets/')) {
      // Use CacheFirst strategy for asset requests
      event.respondWith(
        cacheFirstStrategy.handle({ event }).catch(() => {
          // Fallback to a specific HTML file in case of an error
          return caches.match('/fallback.html');
        })
      );
    } else {
      // Default to network fetch with fallback for other requests
      event.respondWith(
        fetch(event.request).catch(() => {
          // Provide a simple offline message if fetch fails
          return new Response('Offline', { status: 503 });
        })
      );
    }
  });

} else {
  console.error("Workbox didn't load");
}
