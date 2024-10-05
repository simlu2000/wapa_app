import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";
import { getMessaging, getToken, onMessage } from "firebase/messaging";
import { getAuth, GoogleAuthProvider, signInWithRedirect } from 'firebase/auth';
import { signOut as firebaseSignOut } from 'firebase/auth';

// Firebase configuration
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

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Cloud Messaging
const messaging = getMessaging(app);

// Request permission and get the FCM token
const requestPermission = () => {
  return Notification.requestPermission().then((permission) => {
    if (permission === 'granted') {
      console.log('Notification permission granted.');
      // Get the FCM token
      return getToken(messaging, { vapidKey: 'YOUR_PUBLIC_VAPID_KEY' })
        .then((currentToken) => {
          if (currentToken) {
            console.log('FCM Token:', currentToken);
            // Send the token to your server to store it
          } else {
            console.log('No registration token available. Request permission to generate one.');
          }
        })
        .catch((err) => {
          console.error('An error occurred while retrieving token. ', err);
        });
    } else {
      console.log('Unable to get permission to notify.');
    }
  });
};

// Listen for messages when the app is in the foreground
onMessage(messaging, (payload) => {
  console.log('Message received. ', payload);
  // Customize how the message is handled here
});

// Initialize Firebase Authentication
const auth = getAuth(app);
export const signOut = firebaseSignOut;

// Google Auth Provider
const provider = new GoogleAuthProvider();

// Initialize Realtime Database
const realtimeDb = getDatabase(app);

// Handle Google authentication (using redirect for all devices)
const signInWithGoogle = () => {
  return signInWithPopup(auth, provider)
    .then(result => {
      // Success
      console.log("Signed in with Google via popup");
    })
    .catch(error => {
      // Error
      console.error("Error during Google sign-in (popup):", error.message);
    });
};


export { auth, realtimeDb, provider, signInWithGoogle, requestPermission };
