importScripts('https://www.gstatic.com/firebasejs/9.15.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.15.0/firebase-messaging-compat.js');

// La tua configurazione Firebase
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

// Inizializza Firebase Messaging
const messaging = firebase.messaging();

// Gestione della ricezione di notifiche in background
messaging.onBackgroundMessage((payload) => {
  console.log('Ricevuta una notifica in background: ', payload);

  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: '/firebase-logo.png' // Imposta un'icona per la notifica
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});
