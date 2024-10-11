import React, { useEffect, useState } from 'react';
import { auth, provider } from '../Utils/firebase';
import { useNavigate, Link } from 'react-router-dom';
import {
  signInWithPopup,
  GoogleAuthProvider,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  signInWithRedirect,
  getRedirectResult,
} from 'firebase/auth';
import { setUserData } from '../Utils/userService';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGooglePlusG } from '@fortawesome/free-brands-svg-icons';
import '../Styles/style_signupscreen.css'; // Assicurati che lo stile sia aggiornato

const SignUpScreen = () => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [isReset, setIsReset] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [resetEmail, setResetEmail] = useState('');
  const [resetSent, setResetSent] = useState(false);
  const [isSigningInWithPopup, setIsSigningInWithPopup] = useState(false); //stato per gestire il caricamento del popup
  const navigate = useNavigate();

  const controlEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }
  
  const controlPassword = (password) => {
    const passwordRegex = /^(?=.*[0-9]).{6,}$/; // almeno 6 caratteri ed un numero
    return passwordRegex.test(password);
  };
  
  useEffect(() => {
    //Controlla il risultato del redirect all'avvio del componente
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

  const toggleForm = () => {
    setIsSignUp(!isSignUp);
    setIsReset(false);
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    if (!controlEmail(email)) {
      alert("Insert a valid email address");
      return;
    }
    if (!controlPassword(password)) {
      alert("Password must contain at least 6 characters and include at least one number");
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
    if (!controlEmail(email)) {
      alert("Insert a valid email address");
      return;
    }
    if (!controlPassword(password)) {
      alert("Password must contain at least 6 characters and include at least one number");
      return;
    }
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      navigate('/WeatherScreen');
    } catch (error) {
      console.error('Error during sign-in', error);
      alert(error.message);
    }
  };
  

  const handleGoogleSignIn = async () => {
    try {
      setIsSigningInWithPopup(true); // Mostra il messaggio di caricamento
      if (window.innerWidth < 768) {
        // Usa il redirect per dispositivi mobili
        await signInWithRedirect(auth, provider);
        navigate('/WeatherScreen');
      } else {
        await signInWithPopup(auth, provider);
        navigate('/WeatherScreen');
      }
    } catch (error) {
      if (error.code === 'auth/popup-closed-by-user') {
        console.warn('Popup di autenticazione chiuso dall\'utente. Riprova.');
      } else {
        console.error('Error during Google sign-in', error);
        alert('An error occurred during Google sign-in. Please try again.');
      }
    } finally {
      setIsSigningInWithPopup(false); // Nascondi il messaggio di caricamento
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

      <div id="slogan-container">
        <button id="go-home" className=""><Link to="/"> ← Back to WAPA</Link></button>
      </div>
      <div id="form-container">
        <div id="form-box">
          <h1 className="title">{isSignUp ? 'Create Account' : 'Sign In'}</h1>
          <form onSubmit={isSignUp ? handleSignUp : handleSignIn}>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" required className="input-field" />
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" required className="input-field" />
            <Link to="/PasswordResetScreen"><p>Forgot your password?</p></Link>
            <button type="submit" className="submit-btn">{isSignUp ? 'Sign Up' : 'Sign In'}</button>
          </form>
          <div id="social-login">
            <p>Or sign in with</p>
            <button className="google-btn" onClick={handleGoogleSignIn}>
              <FontAwesomeIcon icon={faGooglePlusG} />
            </button>
          </div>
          <p className="toggle-text">{isSignUp ? 'Already have an account?' : 'Don\'t have an account?'} <span onClick={toggleForm} className="toggle-link">{isSignUp ? 'Sign In' : 'Sign Up'}</span></p>
        </div>
      </div>
    </div>
  );
};

export default SignUpScreen;
