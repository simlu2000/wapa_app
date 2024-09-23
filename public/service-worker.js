<<<<<<< HEAD
// Importa le librerie Firebase necessarie
importScripts('https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/9.6.1/firebase-messaging.js');

// Configurazione di Firebase
const firebaseConfig = {
  apiKey: "AIzaSyBUNi0MyQT0YhS8Fqu_oFGEQ_FQu2-3HE8",
  authDomain: "wapa-4ec0a.firebaseapp.com",
  databaseURL: "https://wapa-4ec0a-default-rtdb.europe-west1.firebasedatabase.app/",
  projectId: "wapa-4ec0a",
  storageBucket: "wapa-4ec0a.appspot.com",
  messagingSenderId: "29586370547",
  appId: "1:29586370547:web:cc1ca0286515ad3e57ec86",
  measurementId: "G-X7QG13BHHM"
};

// Inizializza Firebase
firebase.initializeApp(firebaseConfig);
const messaging = firebase.messaging();

// Gestisci le notifiche quando l'app è attiva
messaging.onMessage((payload) => {
  console.log('Messaggio ricevuto: ', payload);
  
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: '/firebase-logo.png'
  };

  return self.registration.showNotification(notificationTitle, notificationOptions);
});

// Gestisci l'evento di clic sulla notifica
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
=======
self.addEventListener('install', (event) => {
  console.log('Service worker installing...');
>>>>>>> parent of 0f77c76 (notifications)
  event.waitUntil(
    clients.openWindow('/WeatherScreen')
  );
});

<<<<<<< HEAD
// Gestisci gli eventi di background per le notifiche push
self.addEventListener('push', (event) => {
  const payload = event.data ? event.data.json() : {};
  const notificationTitle = payload.notification.title || 'Nuova Notifica';
  const notificationOptions = {
    body: payload.notification.body || 'Hai una nuova notifica!',
    icon: '/firebase-logo.png'
  };

  event.waitUntil(
    self.registration.showNotification(notificationTitle, notificationOptions)
  );
});

// Gestisci l'installazione del service worker
self.addEventListener('install', (event) => {
  console.log('Service Worker installato');
});

// Gestisci l'attivazione del service worker
=======
>>>>>>> parent of 0f77c76 (notifications)
self.addEventListener('activate', (event) => {
  console.log('Service Worker attivato');
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          // Rimuovi tutte le cache tranne quella attuale
          return caches.delete(cacheName);
        })
      );
    })
  );
});

<<<<<<< HEAD

// Gestisci il caching delle risorse
self.addEventListener('fetch', (event) => {
  console.log('Service worker fetching:', event.request.url);
  event.respondWith(
    fetch(event.request).then((response) => {
      // solo richieste GET
      if (event.request.method === 'GET') {
        const responseClone = response.clone();
=======
self.addEventListener('fetch', (event) => {
  console.log('Service worker fetching:', event.request.url);
  
  // Escludi tutte le richieste che non siano GET
  if (event.request.method !== 'GET') {
    return;
  }

  event.respondWith(
    caches.match(event.request).then((response) => {
      if (response) {
        return response;
      }

      return fetch(event.request).then((networkResponse) => {
        // Verifica che la risposta sia valida prima di metterla in cache
        if (!networkResponse || networkResponse.status !== 200 || networkResponse.type !== 'basic') {
          return networkResponse;
        }

        const responseClone = networkResponse.clone();
>>>>>>> parent of 0f77c76 (notifications)
        caches.open('static-cache-v1').then((cache) => {
          cache.put(event.request, responseClone);
        });
      }
      return response;
    }).catch(() => {
      return caches.match(event.request).then((response) => {
        return response || caches.match('/fallback.html');
      });
<<<<<<< HEAD
=======
    }).catch(() => {
      // Se la rete fallisce, cerca nella cache il fallback
      return caches.match('/fallback.html');
>>>>>>> parent of 0f77c76 (notifications)
    })
  );
});

<<<<<<< HEAD
=======
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
>>>>>>> parent of 0f77c76 (notifications)
