// Questo file gestisce la registrazione del service worker

const isLocalhost = Boolean(
  window.location.hostname === 'localhost' ||
  window.location.hostname === '[::1]' ||
  window.location.hostname.match(/^127(\.[0-9]+){0,3}$/)
);

const registerValidSW = (swUrl) => {
  navigator.serviceWorker
    .register(swUrl)
    .then((registration) => {
      console.log('Service Worker registrato:', registration);
      // Rileva un nuovo service worker o aggiornamenti disponibili
      registration.onupdateavailable = () => {
        console.log('Aggiornamento del service worker disponibile');
        // Puoi avvisare l'utente dell'aggiornamento qui, ad esempio tramite una notifica
      };
      registration.onupdatefound = () => {
        console.log('Nuovo service worker trovato');
      };
    })
    .catch((error) => {
      console.error('Registrazione del Service Worker fallita:', error);
    });
};

const checkValidServiceWorker = (swUrl) => {
  fetch(swUrl)
    .then((response) => {
      if (
        response.status === 404 ||
        response.headers.get('content-type')?.indexOf('javascript') === -1
      ) {
        // Service worker non valido o non trovato, deregistra il worker
        navigator.serviceWorker.ready.then((registration) => {
          registration.unregister().then(() => {
            window.location.reload();
          });
        });
      } else {
        // Registra il service worker valido
        registerValidSW(swUrl);
      }
    })
    .catch(() => {
      console.error('Network error durante la verifica del service worker');
    });
};

export const register = () => {
  if ('serviceWorker' in navigator) {
    const swUrl = `${process.env.PUBLIC_URL}/service-worker.js`;

    if (isLocalhost) {
      // Verifica se il service worker è valido su localhost
      checkValidServiceWorker(swUrl);
    } else {
      // Registra il service worker per la produzione
      registerValidSW(swUrl);
    }
  }
};

export const unregister = () => {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.ready.then((registration) => {
      registration.unregister();
    });
  }
};
