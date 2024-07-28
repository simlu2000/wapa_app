// Configura e inizializza Firebase, e imposta le connessioni a Authentication e Realtime Database.
import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";
import { getAuth, GoogleAuthProvider } from 'firebase/auth';

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

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication
const auth = getAuth(app);

// Google Auth Provider
const provider = new GoogleAuthProvider();

// Initialize Realtime Database
const realtimeDb = getDatabase(app);

export { auth, realtimeDb, provider };
