// serviceWorkerRegistration.js
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/service-worker.js')
      .then((registration) => {
        console.log('Service Worker registrato con successo:', registration);

        registration.onupdatefound = () => {
          const installingWorker = registration.installing;
          installingWorker.onstatechange = () => {
            if (installingWorker.state === 'installed') {
              if (navigator.serviceWorker.controller) {
                // Nuova versione disponibile, notifica l'utente
                console.log('Nuova versione disponibile.');
                alert('Una nuova versione è disponibile. Aggiorna la pagina per applicare le modifiche.');

              } else {
                console.log('Contenuto disponibile per l\'utilizzo offline.');
              }
            }
          };
        };
      }).catch((error) => {
        console.log('Registrazione del Service Worker fallita:', error);
      });
  });
}
