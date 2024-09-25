/* eslint-disable no-restricted-globals, no-undef */
// Importa le librerie necessarie di Workbox
import { precacheAndRoute, createHandlerBoundToURL } from 'workbox-precaching';
import { NetworkFirst, CacheFirst } from 'workbox-strategies';
import { ExpirationPlugin } from 'workbox-expiration';
import { CacheableResponsePlugin } from 'workbox-cacheable-response';

// Precache app shell (precaching delle risorse definite nel manifest)
precacheAndRoute(self.__WB_MANIFEST);

// Strategia NetworkFirst per le richieste API
const networkFirstStrategy = new NetworkFirst({
  cacheName: 'network-first-cache',
});

// Strategia CacheFirst per altri asset (es. immagini, CSS, JS)
const cacheFirstStrategy = new CacheFirst({
  cacheName: 'cache-first-cache',
  plugins: [
    new ExpirationPlugin({
      maxEntries: 50, // Numero massimo di elementi nella cache
      maxAgeSeconds: 7 * 24 * 60 * 60, // Scadenza cache dopo una settimana
    }),
    new CacheableResponsePlugin({
      statuses: [0, 200], // Cacherà solo le risposte con stato 0 o 200
    }),
  ],
});

// Gestione degli eventi fetch con strategie personalizzate
self.addEventListener('fetch', (event) => {
  if (event.request.url.includes('/api/')) {
    // Usa NetworkFirst per le richieste API
    event.respondWith(networkFirstStrategy.handle({ event }));
  } else {
    // Usa CacheFirst per altre risorse
    event.respondWith(cacheFirstStrategy.handle({ event }));
  }
});

// Gestione delle notifiche push
self.addEventListener('push', (event) => {
  const data = event.data.json(); // Recupera i dati dalla notifica push
  const options = {
    body: data.body,
    icon: 'icons/icon.png',
    badge: 'icons/badge.png',
  };

  // Mostra la notifica
  event.waitUntil(
    self.registration.showNotification(data.title, options)
  );
});

// Gestione del clic su una notifica
self.addEventListener('notificationclick', (event) => {
  event.notification.close(); // Chiudi la notifica quando viene cliccata

  // Apri una finestra o la pagina web associata alla notifica
  event.waitUntil(
    clients.openWindow(event.notification.data.url || '/')
  );
});

// Gestione del background sync (sincronizzazione in background, opzionale)
self.addEventListener('sync', (event) => {
  if (event.tag === 'sync-new-data') {
    event.waitUntil(syncData());
  }
});

// Funzione di sincronizzazione dei dati (esempio)
async function syncData() {
  console.log('Syncing data...');
  // Implementa la logica di sincronizzazione dei dati qui
}

// Registra il Service Worker
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    const swUrl = `${process.env.PUBLIC_URL}/service-worker.js`;

    navigator.serviceWorker
      .register(swUrl)
      .then((registration) => {
        console.log('Service Worker registered:', registration);
      })
      .catch((error) => {
        console.error('Service Worker registration failed:', error);
      });
  });
}