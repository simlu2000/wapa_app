import React, { useEffect, useState } from 'react';
import { auth } from '../Utils/firebase';
import { useNavigate, Link } from 'react-router-dom';
import {
  signInWithPopup,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  getRedirectResult,
  GoogleAuthProvider,
} from 'firebase/auth';
import { setUserData } from '../Utils/userService';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGooglePlusG } from '@fortawesome/free-brands-svg-icons';
import '../Styles/style_signupscreen.css';
import { Button } from '@mui/material';
import ArrowLeftIcon from '@mui/icons-material/ArrowLeft';
import { provider as googleProvider } from '../Utils/firebase';

const SignUpScreen = () => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [isReset, setIsReset] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [resetEmail, setResetEmail] = useState('');
  const [resetSent, setResetSent] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 480); // Stato per gestire la larghezza dello schermo
  const navigate = useNavigate();

  useEffect(() => {
    const checkRedirectResult = async () => {
      try {
        const result = await getRedirectResult(auth);
        if (result) {
          const user = result.user;
          await setUserData(user.uid, { email: user.email, localities: [] });
          navigate('/WeatherScreen');
        }
      } catch (error) {
        console.error('Error during redirect sign-in:', error);
      }
    };
    checkRedirectResult();
  }, [navigate]);

  // Aggiungi l'event listener per il resize dello schermo
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 480);
    };

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const toggleForm = () => {
    setIsSignUp(!isSignUp);
    setIsReset(false);
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      alert('Please fill in both fields');
      return;
    }
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      await setUserData(user.uid, { email: user.email, localities: [] });
      navigate('/WeatherScreen');
    } catch (error) {
      console.error('Error during registration', error);
      alert(error.message);
    }
  };

  const handleSignIn = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      alert('Please fill in both fields');
      return;
    }
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate('/WeatherScreen');
    } catch (error) {
      console.error('Error during sign-in', error);
      alert(error.message);
    }
  };

  const signInWithGoogle = async () => {
    /*try {
      await signInWithPopup(auth, provider);
    } catch (error) {
      if (error.code === 'auth/popup-blocked' || error.code === 'auth/popup-closed-by-user') {
        // Fallback to redirect
        await signInWithRedirect(auth, provider);
      } else {
        console.error('Error during sign-in:', error);
      }
    }
  };*/
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const credential = GoogleAuthProvider.credentialFromResult(result);
      const token = credential.accessToken;
      const user = result.user;

      //memorizza i dati dell'utente nel Realtime Database
      await setUserData(user.uid, { email: user.email, localities: [] });

      navigate('/');
    } catch (error) {
      console.error("Error during Google sign-in", error);
      alert(error.message);
    }
  };

  const handlePasswordReset = async (e) => {
    e.preventDefault();
    if (!resetEmail) {
      alert('Insert a valid e-mail address');
      return;
    }

    try {
      await sendPasswordResetEmail(auth, resetEmail);
      setResetSent(true);
      alert(`An email has been sent to ${resetEmail}`);
    } catch (error) {
      console.error('Error during password reset', error);
      alert('Error during password reset. Try again later.');
    }
  };

  const handleGoBack = () => {
    setIsSignUp(false);
    setIsReset(false);
  };

  return (
    <div id="signinPage">
      {!isMobile && (
        <div id="slogan-container">
          <Button
            variant="contained"
            color="primary"
            href="#about-area"
            endIcon={<ArrowLeftIcon />}
            id="go-home"
            sx={{
              textTransform: 'uppercase',
              fontWeight: 'bold',
              paddingX: 4,
              paddingY: 0.5,
            }}
          >
            <p id="back"><Link to="/">Back</Link></p>
          </Button>
        </div>
      )}
      <div id="form-container">
        <div id="form-box">
          <h1 className="title-signup">{isSignUp ? 'Create Account' : 'Sign In'}</h1>
          <form onSubmit={isSignUp ? handleSignUp : handleSignIn}>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              required
              className="input-field"
            />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              required
              className="input-field"
            />
            <Link to="/PasswordResetScreen">
              <p>Forgot your password?</p>
            </Link>
            <button type="submit" className="submit-btn">
              {isSignUp ? 'Sign Up' : 'Sign In'}
            </button>
          </form>
          {/*<div id="social-login">
            <p>Or sign in with</p>
            <button className="google-btn" onClick={signInWithGoogle}>
            <FontAwesomeIcon icon={faGooglePlusG} />
            </button>
          </div> */}
          <p className="toggle-text">
            {isSignUp ? 'Already have an account?' : "Don't have an account?"}{' '}
            <span onClick={toggleForm} className="toggle-link">
              {isSignUp ? 'Sign In' : 'Sign Up'}
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignUpScreen;
