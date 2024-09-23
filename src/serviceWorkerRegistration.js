import { getMessaging } from 'firebase/messaging';

export function register(config) {
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      const swUrl = `${process.env.PUBLIC_URL}/firebase-messaging-sw.js`;
      checkValidServiceWorker(swUrl);
    });
  }
}

const checkValidServiceWorker = (swUrl) => {
  fetch(swUrl)
    .then((response) => {
      if (response.status === 404 || response.headers.get('content-type').indexOf('javascript') === -1) {
        navigator.serviceWorker.ready.then((registration) => {
          registration.unregister().then(() => {
            window.location.reload();
          });
        });
      } else {
        registerValidSW(swUrl);
      }
    })
    .catch(() => {
      console.log('Nessuna connessione Internet. L\'app funziona in modalità offline.');
    });
};

const registerValidSW = (swUrl) => {
  navigator.serviceWorker
    .register(swUrl)
    .then((registration) => {
      console.log('Service Worker registrato con successo:', registration);
    })
    .catch((error) => {
      console.error('Registrazione del Service Worker fallita:', error);
    });
};
