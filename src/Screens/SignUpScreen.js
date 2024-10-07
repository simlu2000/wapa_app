import React, { useEffect, useState } from 'react';
import { auth, provider } from '../Utils/firebase';
import { useNavigate, Link } from 'react-router-dom';
import {
  signInWithPopup,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  signInWithRedirect,
  getRedirectResult,
  onAuthStateChanged,
} from 'firebase/auth';
import { setUserData } from '../Utils/userService';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGooglePlusG } from '@fortawesome/free-brands-svg-icons';
import '../Styles/style_signupscreen.css';

const SignUpScreen = () => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [isReset, setIsReset] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [resetEmail, setResetEmail] = useState('');
  const [resetSent, setResetSent] = useState(false);
  const [isSigningInWithPopup, setIsSigningInWithPopup] = useState(false); // Stato per gestire il caricamento del popup
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        navigate('/WeatherScreen');
      }
    });

    return () => unsubscribe();
  }, [navigate]);

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
        alert('An error occurred during redirect sign-in. Please try again.');
      }
    };
    checkRedirectResult();
  }, [navigate]);

  const toggleForm = () => {
    setIsSignUp(!isSignUp);
    setIsReset(false);
  };

  const controlEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }
  
  const controlPassword = (password) => {
    const passwordRegex = /^(?=.*[0-9]).{6,}$/; //almeno 6 car
    return passwordRegex.test(password);
  };


  const handleSignUp = async (e) => {
    e.preventDefault();
    if(!controlEmail(email)){
      alert('Please enter a valid email');
      return;
    }
    if(!controlPassword(password)){
      alert('Password must be at least 6 characters long and contain at least one number');
      return;
    }
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      await setUserData(user.uid, { email: user.email, localities: [] });
      navigate('/WeatherScreen');
    } catch (error) {
      console.error('Error during registration:', error);
      switch (error.code) {
        case 'auth/email-already-in-use':
          alert('This email address is already in use. Please use a different one.');
          break;
        case 'auth/weak-password':
          alert('The password is too weak. Please use a stronger password.');
          break;
        default:
          alert('An error occurred during registration. Please try again.');
      }
    }
  };

  const handleSignIn = async (e) => {
    e.preventDefault();
    if(!controlEmail(email)){
      alert('Please enter a valid email');
      return;
    }
    if(!controlPassword(password)){
      alert('Password must be at least 6 characters long and contain at least one number');
      return;
    }
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate('/WeatherScreen');
    } catch (error) {
      console.error('Error during sign-in:', error);
      switch (error.code) {
        case 'auth/wrong-password':
          alert('Incorrect password. Please try again.');
          break;
        case 'auth/user-not-found':
          alert('No user found with this email. Please check the email address or sign up.');
          break;
        default:
          alert('An error occurred during sign-in. Please try again.');
      }
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      setIsSigningInWithPopup(true);
      if (window.innerWidth < 768) {
        await signInWithRedirect(auth, provider);
      } else {
        await signInWithPopup(auth, provider);
      }
    } catch (error) {
      if (error.code === 'auth/popup-closed-by-user') {
        console.warn('Popup di autenticazione chiuso dall\'utente. Riprova.');
      } else {
        console.error('Error during Google sign-in:', error);
        alert('An error occurred during Google sign-in. Please try again.');
      }
    } finally {
      setIsSigningInWithPopup(false);
    }
  };
  
  const handleGoBack = () => {
    setIsSignUp(false);
    setIsReset(false);
  };

  return (
    <>
      <div className="background">
        {[...Array(20)].map((_, i) => <span key={i}></span>)}
      </div>

      <div className={`box-form ${isSignUp ? 'sign-up-mode' : ''}`} id="box">
        {isSigningInWithPopup && (
          <div className="loading-message">
            <p>Autenticazione in corso, per favore attendi...</p>
          </div>
        )}
        <div className={`form-container sign-up ${isSignUp ? '' : 'hidden'}`}>
          <button id="back" onClick={handleGoBack}>Go back</button>
          <form id="sign" onSubmit={handleSignUp}>
            <h1 className="form-text">Create Account</h1>
            <div className="social-icons">
              <button type="button" className="icon" onClick={handleGoogleSignIn}>
                <FontAwesomeIcon icon={faGooglePlusG} />
              </button>
            </div>
            <span>or use your email for registration</span>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" required />
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" required />
            <button type="submit">Sign Up</button>
          </form>
        </div>

        <div className={`form-container sign-in ${isReset ? 'hidden' : ''}`}>
          <form onSubmit={handleSignIn}>
            <h1 className="form-text">Sign In</h1>
            <div className="social-icons">
              <button type="button" className="icon" onClick={handleGoogleSignIn}>
                <FontAwesomeIcon icon={faGooglePlusG} />
              </button>
            </div>
            <span>or use your email and password</span>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" required />
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" required />
            <a href="#" onClick={(e) => { e.preventDefault(); setIsReset(true); setIsSignUp(false); }}>Forgot Your Password?</a>
            <button type="submit">Sign In</button>
          </form>
        </div>

        
          <div className="form-container reset-password">
              <Link to="/PasswordResetScreen"><span className="form-text">Reset Password</span></Link>
          </div>
        

        <div className="toggle-container">
          <div className="toggle">
            <div className={`toggle-panel toggle-left ${isSignUp ? '' : 'hidden'}`}>
              <h1 className="form-text">Welcome Back!</h1>
              <p>Enter your personal details to use all of WAPA features</p>
              <button className="hidden" id="login" onClick={toggleForm}>Sign In</button>
            </div>
            <div className={`toggle-panel toggle-right ${isSignUp ? 'hidden' : ''}`}>
              <h1 className="form-text">Hello!</h1>
              <p>Register with your personal details to use all of WAPA features</p>
              <button className="hidden" id="register" onClick={toggleForm}>Sign Up</button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default SignUpScreen;
