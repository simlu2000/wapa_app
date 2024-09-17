import { getAuth, signInWithPopup, signInWithRedirect, GoogleAuthProvider, getRedirectResult } from 'firebase/auth';
import { useEffect } from 'react';

const auth = getAuth();
const provider = new GoogleAuthProvider();

const handleSignIn = () => {
  if (window.innerWidth < 768) {
    // Mobile : redirect
    signInWithRedirect(auth, provider);
  } else {
    // Desktop : popup
    signInWithPopup(auth, provider)
      .catch((error) => {
        console.error('Error during sign-in with popup:', error);
      });
  }
};

const useAuthRedirect = () => {
  useEffect(() => {
    getRedirectResult(auth)
      .then((result) => {
        if (result) {
          // Handle result, e.g., user information
          console.log('User:', result.user);
        }
      })
      .catch((error) => {
        console.error('Error during sign-in with redirect:', error);
      });
  }, []);
};

const App = () => {
  useAuthRedirect();

  return (
    <div>
      <button onClick={handleSignIn}>Sign In with Google</button>
    </div>
  );
};

export default App;
