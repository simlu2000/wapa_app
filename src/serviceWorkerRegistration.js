// Aggiungi la verifica se l'utente è autenticato
import { getAuth, onAuthStateChanged } from "firebase/auth";

const isLocalhost = Boolean(
  window.location.hostname === 'localhost' ||
  window.location.hostname === '[::1]' ||
  window.location.hostname.match(/^127(\.[0-9]+){0,3}$/)
);

const vapid_key = process.env.REACT_APP_vapid_key;

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

// Helper per convertire la chiave VAPID
function urlBase64ToUint8Array(base64String) {
  const padding = '='.repeat((4 - base64String.length % 4) % 4);
  const base64 = (base64String + padding)
    .replace(/-/g, '+')
    .replace(/_/g, '/');

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}
export const register = () => {
  if ('serviceWorker' in navigator) {
    const swUrl = '/service-worker.js';

    const auth = getAuth();
    onAuthStateChanged(auth, async (user) => {
      if (user) {
        console.log('Utente autenticato:', user);
        if (isLocalhost) {
          checkValidServiceWorker(swUrl);
        } else {
          registerValidSW(swUrl);
        }

        const registration = await navigator.serviceWorker.ready;

        if ('PushManager' in window && 'Notification' in window) {
          const permission = await Notification.requestPermission();
          if (permission === 'granted') {
            registration.pushManager.getSubscription().then((subscription) => {
              if (!subscription) {
                return registration.pushManager.subscribe({
                  userVisibleOnly: true,
                  applicationServerKey: urlBase64ToUint8Array(vapid_key),
                });
              } else {
                console.log('Utente già iscritto per le notifiche push:', subscription);
                return subscription;
              }
            }).then((newSubscription) => {
              if (newSubscription) {
                console.log('Utente iscritto per le notifiche push:', newSubscription);
              
              }
            }).catch((error) => {
              console.error('Errore durante la sottoscrizione alle notifiche push:', error);
            });
          }
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
