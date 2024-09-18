import React, { useState } from 'react';
import { auth, provider } from '../Utils/firebase'; // Importa Firebase configurato
import { useNavigate } from 'react-router-dom';
import {
  signInWithPopup,
  GoogleAuthProvider,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
} from 'firebase/auth';
import { setUserData } from '../Utils/userService';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFacebookF, faGooglePlusG } from '@fortawesome/free-brands-svg-icons';
import '../Styles/style_signupscreen.css';

const SignUpScreen = () => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [isReset, setIsReset] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [resetEmail, setResetEmail] = useState('');
  const [resetSent, setResetSent] = useState(false);
  const navigate = useNavigate();

  const toggleForm = () => {
    setIsSignUp(!isSignUp);
    setIsReset(false);
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
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
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      await setUserData(user.uid, { email: user.email, localities: [] });
      navigate('/WeatherScreen');
    } catch (error) {
      console.error('Error during Google sign-in', error);
      if (error.code === 'auth/popup-closed-by-user') {
        alert('Popup closed before signing in');
      } else {
        alert('An error occurred during Google sign-in. Please try again.');
      }
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
    <>
      <div className="background">
        {/* Background effects */}
        {[...Array(20)].map((_, i) => <span key={i}></span>)}
      </div>

      <div className={`box-form ${isSignUp ? 'sign-up-mode' : ''}`} id="box">
        <div className={`form-container sign-up ${isSignUp ? '' : 'hidden'}`}>
          <button id="back" onClick={handleGoBack}>Go back</button>
          <form id="sign" onSubmit={handleSignUp}>
            <h1 className="form-text">Create Account</h1>
            <div className="social-icons">
              <button className="icon" onClick={handleGoogleSignIn}>
                <FontAwesomeIcon icon={faGooglePlusG} />
              </button>
              <button className="icon">
                <FontAwesomeIcon icon={faFacebookF} />
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
              <button className="icon" onClick={handleGoogleSignIn}>
                <FontAwesomeIcon icon={faGooglePlusG} />
              </button>
              <button className="icon">
                <FontAwesomeIcon icon={faFacebookF} />
              </button>
            </div>
            <span>or use your email and password</span>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" required />
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" required />
            <a href="#" onClick={(e) => { e.preventDefault(); setIsReset(true); setIsSignUp(false); }}>Forgot Your Password?</a>
            <button type="submit">Sign In</button>
          </form>
        </div>

        {isReset && (
          <div className="form-container reset-password">
            <form onSubmit={handlePasswordReset}>
              <h1 className="form-text">Reset Password</h1>
              {resetSent ? (
                <p>An email has been sent to {resetEmail}. Follow the instructions to reset your password.</p>
              ) : (
                <>
                  <input type="email" value={resetEmail} onChange={(e) => setResetEmail(e.target.value)} placeholder="Email" required />
                  <button type="submit">Send Password Reset Email</button>
                </>
              )}
            </form>
          </div>
        )}

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
