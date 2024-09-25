import { getAuth, onAuthStateChanged } from "firebase/auth";

const isLocalhost = Boolean(
  window.location.hostname === 'localhost' ||
  window.location.hostname === '[::1]' ||
  window.location.hostname.match(/^127(\.[0-9]+){0,3}$/)
);

const showUpdateNotification = () => {
  alert('Una nuova versione è disponibile. Si prega di aggiornare.');
};

const registerValidSW = (swUrl) => {
  navigator.serviceWorker
    .register(swUrl)
    .then((registration) => {
      console.log('Service Worker registrato con successo:', registration);

      registration.onupdatefound = () => {
        const installingWorker = registration.installing;
        installingWorker.onstatechange = () => {
          if (installingWorker.state === 'installed') {
            if (navigator.serviceWorker.controller) {
              showUpdateNotification();
            } else {
              console.log('Contenuto precaricato per uso offline.');
            }
          }
        };
      };
    })
    .catch((error) => {
      console.error('Registrazione del Service Worker fallita:', error);
      displayError('Registrazione del Service Worker fallita. Riprova più tardi.');
    });
};

const displayError = (message) => {
  console.error(message);
};

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

export const register = () => {
  if ('serviceWorker' in navigator) {
    const swUrl = '/service-worker.js';

    const auth = getAuth();
    onAuthStateChanged(auth, (user) => {
      if (user) {
        console.log('Utente autenticato:', user);
        
        // Controllo se sono in localhost
        if (isLocalhost) {
          checkValidServiceWorker(swUrl);
        } else {
          registerValidSW(swUrl);
        }
      } else {
        console.log('Nessun utente autenticato.');
      }
    });
  }
};

export const unregister = () => {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.ready.then((registration) => {
      registration.unregister();
    });
  }
};
