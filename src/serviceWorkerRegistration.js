// Controlla se il browser supporta i service worker e li registra
export function register(config) { //verra poi chiamata in index.js
  if ("serviceWorker" in navigator) {
      window.addEventListener("load", () => {
          const swUrl = `${process.env.PUBLIC_URL}/service-worker.js`;

          navigator.serviceWorker
              .register(swUrl)
              .then((registration) => {
                  console.log("Service Worker registrato:", registration);

                  if (config && config.onSuccess) {
                      config.onSuccess(registration);
                  }
              })
              .catch((error) => {
                  console.error("Registrazione Service Worker fallita:", error);
                  if (config && config.onError) {
                      config.onError(error);
                  }
              });
      });
  }
}

// Funzione per disattivare il service worker
export function unregister() {
  if ("serviceWorker" in navigator) {
      navigator.serviceWorker
          .getRegistrations()
          .then((registrations) => {
              for (let registration of registrations) {
                  registration.unregister();
              }
          })
          .catch((error) => {
              console.error("Disattivazione Service Worker fallita:", error);
          });
  }
}