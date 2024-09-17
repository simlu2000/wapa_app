import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";
import { getAuth,  GoogleAuthProvider, signInWithPopup, signInWithRedirect } from 'firebase/auth';
import { signOut as firebaseSignOut} from 'firebase/auth';
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

// Initialize Firebase Authentication
const auth = getAuth(app);
export const signOut = firebaseSignOut; 

// Google Auth Provider
const provider = new GoogleAuthProvider();

// Initialize Realtime Database
const realtimeDb = getDatabase(app);

// Function to handle authentication
const signInWithGoogle = () => {
  const isMobile = /Mobi|Android/i.test(navigator.userAgent);

  if (isMobile) {
    //mobile -> redirect
    signInWithRedirect(auth, provider)
      .then(result => {
        // Handle success
        console.log("Signed in with Google via redirect");
      })
      .catch(error => {
        // Handle errors
        console.error("Error during Google sign-in (redirect):", error.message);
      });
  } else {
    //Desktop -> popups
    signInWithPopup(auth, provider)
      .then(result => {
        // Handle success
        console.log("Signed in with Google via popup");
      })
      .catch(error => {
        // Handle errors
        console.error("Error during Google sign-in (popup):", error.message);
      });
  }
};

export { auth, realtimeDb, provider, signInWithGoogle };
