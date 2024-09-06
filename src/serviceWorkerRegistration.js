// Questo file gestisce la registrazione del service worker.

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
        registration.onupdateavailable = () => {
          // Notifica che è disponibile un aggiornamento
          console.log('Aggiornamento del service worker disponibile');
        };
        registration.onupdatefound = () => {
          // Notifica che un nuovo service worker è stato trovato
          console.log('Nuovo service worker trovato');
        };
      })
      .catch((error) => {
        console.error('Registrazione del Service Worker fallita:', error);
      });
  };
  
  const register = () => {
    if ('serviceWorker' in navigator) {
      // Determina il percorso del service worker
      const swUrl = `${process.env.PUBLIC_URL}/service-worker.js`;
  
      if (isLocalhost) {
        // Verifica se il service worker è registrato su localhost
        checkValidServiceWorker(swUrl);
      } else {
        registerValidSW(swUrl);
      }
    }
  };
  
  const checkValidServiceWorker = (swUrl) => {
    // Verifica se il service worker è registrato
    fetch(swUrl)
      .then((response) => {
        if (
          response.status === 404 ||
          response.headers.get('content-type')?.indexOf('javascript') === -1
        ) {
          // Il file service worker non è valido
          navigator.serviceWorker.ready.then((registration) => {
            registration.unregister().then(() => {
              window.location.reload();
            });
          });
        } else {
          // Registrazione del service worker
          registerValidSW(swUrl);
        }
      })
      .catch(() => {
        console.error('Network error durante la verifica del service worker');
      });
  };
  
  export { register };
  