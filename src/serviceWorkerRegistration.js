import { getMessaging } from 'firebase/messaging';

<<<<<<< HEAD
export function register(config) {
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      const swUrl = `${process.env.PUBLIC_URL}/firebase-messaging-sw.js`;
      checkValidServiceWorker(swUrl);
    });
  }
}
=======
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

const showUpdateNotification = () => {
  const notification = document.createElement('div');
  notification.textContent = 'Nuovo contenuto disponibile. Ricarica la pagina!';
  notification.style.position = 'fixed';
  notification.style.bottom = '20px';
  notification.style.right = '20px';
  notification.style.backgroundColor = '#fff';
  notification.style.border = '1px solid #000';
  notification.style.padding = '10px';
  notification.style.zIndex = '1000';
  
  const reloadButton = document.createElement('button');
  reloadButton.textContent = 'Ricarica';
  reloadButton.onclick = () => {
    window.location.reload();
  };

  notification.appendChild(reloadButton);
  document.body.appendChild(notification);
};
>>>>>>> parent of 0f77c76 (notifications)

const checkValidServiceWorker = (swUrl) => {
  fetch(swUrl)
    .then((response) => {
      if (
        response.status === 404 ||
        response.headers.get('content-type')?.indexOf('javascript') === -1
      ) {
        navigator.serviceWorker.ready.then((registration) => {
          registration.unregister().then(() => {
            window.location.reload();
          });
        });
      } else {
        registerValidSW(swUrl);
      }
    })
    .catch((error) => {
      console.error('Errore di rete durante la verifica del Service Worker:', error);
      displayError('Errore di rete. Riprova più tardi.');
    });
};

<<<<<<< HEAD
const registerValidSW = (swUrl) => {
  navigator.serviceWorker
    .register(swUrl)
    .then((registration) => {
      console.log('Service Worker registrato con successo:', registration);
    })
    .catch((error) => {
      console.error('Registrazione del Service Worker fallita:', error);
=======
const displayError = (message) => {
  const errorNotification = document.createElement('div');
  errorNotification.textContent = message;
  errorNotification.style.position = 'fixed';
  errorNotification.style.top = '20px';
  errorNotification.style.left = '50%';
  errorNotification.style.transform = 'translateX(-50%)';
  errorNotification.style.backgroundColor = '#f44336';
  errorNotification.style.color = '#fff';
  errorNotification.style.padding = '10px';
  errorNotification.style.zIndex = '1000';
  document.body.appendChild(errorNotification);
};

export const register = () => {
  if ('serviceWorker' in navigator) {
    const swUrl = '/service-worker.js';

    if (isLocalhost) {
      checkValidServiceWorker(swUrl);
    } else {
      registerValidSW(swUrl);
    }
  }
};

export const unregister = () => {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.ready.then((registration) => {
      registration.unregister();
>>>>>>> parent of 0f77c76 (notifications)
    });
};
