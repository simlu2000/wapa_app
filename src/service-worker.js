/* eslint-disable no-restricted-globals, no-undef */
// Importa le librerie necessarie, ad esempio Workbox
import { precacheAndRoute, createHandlerBoundToURL } from 'workbox-precaching';
import { NetworkFirst, CacheFirst } from 'workbox-strategies';
import { ExpirationPlugin } from 'workbox-expiration';
import { CacheableResponsePlugin } from 'workbox-cacheable-response';

// Precache the app shell
precacheAndRoute(self.__WB_MANIFEST);

// Define custom caching strategies
const networkFirstStrategy = new NetworkFirst({
  cacheName: 'network-first-cache',
});

const cacheFirstStrategy = new CacheFirst({
  cacheName: 'cache-first-cache',
  plugins: [
    new ExpirationPlugin({
      maxEntries: 50,
      maxAgeSeconds: 7 * 24 * 60 * 60, // Cache for a week
    }),
    new CacheableResponsePlugin({
      statuses: [0, 200],
    }),
  ],
});

// Handle fetch events with custom strategies
self.addEventListener('fetch', (event) => {
  if (event.request.url.includes('/api/')) {
    event.respondWith(networkFirstStrategy.handle({ event }));
  } else {
    event.respondWith(cacheFirstStrategy.handle({ event }));
  }
});

// Handle push events
self.addEventListener('push', function(event) {
  const data = event.data.json();
  const options = {
    body: data.body,
    icon: 'icons/icon.png',
    badge: 'icons/badge.png',
  };

  event.waitUntil(
    self.registration.showNotification(data.title, options)
  );
});

// Handle notification click events
self.addEventListener('notificationclick', function(event) {
  event.notification.close();
  event.waitUntil(
    clients.openWindow(event.notification.data.url || '/')
  );
});

// Handle background sync (optional)
self.addEventListener('sync', function(event) {
  if (event.tag === 'sync-new-data') {
    event.waitUntil(syncData());
  }
});

// Example function for background sync
async function syncData() {
  // Implement data synchronization logic here
  console.log('Syncing data...');
}

// Export the register function
export function register() {
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      const swUrl = `${process.env.PUBLIC_URL}/service-worker.js`;

      navigator.serviceWorker
        .register(swUrl)
        .then((registration) => {
          console.log('SW registered: ', registration);
        })
        .catch((error) => {
          console.error('SW registration failed: ', error);
        });
    });
  }
}
