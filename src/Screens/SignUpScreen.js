import React, { useState } from 'react';
import { auth, provider } from '../Utils/firebase'; // Assicurati che 'provider' sia un'istanza di GoogleAuthProvider
import { useNavigate } from 'react-router-dom';
import { signInWithPopup, GoogleAuthProvider, createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { setUserData } from '../Utils/userService'; // Assicurati che 'setUserData' gestisca l'aggiornamento dei dati dell'utente
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGooglePlusG } from '@fortawesome/free-brands-svg-icons';
import '../Styles/style_signupscreen.css';

const SignUpScreen = () => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const toggleForm = () => {
    setIsSignUp(!isSignUp);
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Memorizza i dati dell'utente nel Realtime Database
      await setUserData(user.uid, { email: user.email, localities: [] });
      navigate('/WeatherScreen');
    } catch (error) {
      console.error("Error during registration", error);
      alert(error.message);
    }
  };

  const handleSignIn = async (e) => {
    e.preventDefault();
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Recupera i dati dell'utente se necessario
      // const userData = await getUserData(user.uid); // Se vuoi recuperare i dati dell'utente all'accesso

      navigate('/WeatherScreen');
    } catch (error) {
      console.error("Error during sign-in", error);
      alert(error.message);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      const credential = GoogleAuthProvider.credentialFromResult(result);
      const token = credential.accessToken;
      const user = result.user;

      // Memorizza i dati dell'utente nel Realtime Database
      await setUserData(user.uid, { email: user.email, localities: [] });

      navigate('/WeatherScreen');
    } catch (error) {
      if (error.code === 'auth/cancelled-popup-request') {
        console.log('Popup request cancelled.');
      } else {
        console.error("Error during Google sign-in", error);
        alert(error.message);
      }
    }
  };

  const handleGoBack = () => {
    setIsSignUp(false);
  };

  return (
    <>
      <div class="background">
        <span></span>
        <span></span>
        <span></span>
        <span></span>
        <span></span>
        <span></span>
        <span></span>
        <span></span>
        <span></span>
        <span></span>
        <span></span>
        <span></span>
        <span></span>
        <span></span>
        <span></span>
        <span></span>
        <span></span>
        <span></span>
        <span></span>
        <span></span>
      </div>
      <div className={`box-form ${isSignUp ? 'sign-up-mode' : ''}`} id="box">
        <div className="form-container sign-up">
          <button id="back" onClick={handleGoBack}>Go back</button>
          <form id="sign" onSubmit={handleSignUp}>
            <h1 id="signup" className="form-text">Sign Up</h1>
            <div className="social-icons">
              <a href="#" className="icon" onClick={handleGoogleSignIn}>
                <FontAwesomeIcon icon={faGooglePlusG} />
              </a>
            </div>
            <span>or use your email for registration</span>
            <div id="user_data">
              <input id="name-user" type="text" placeholder="Name" />
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" />
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" />
            </div>
            <button type="submit">Sign Up</button>
          </form>
        </div>
        <div className="form-container sign-in">
          <form onSubmit={handleSignIn}>
            <h1 className="form-text">Sign In</h1>
            <div className="social-icons">
              <a href="#" className="icon" onClick={handleGoogleSignIn}>
                <FontAwesomeIcon icon={faGooglePlusG} />
              </a>
            </div>
            <span>or use your email and password</span>
            <input className="email-area" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" />
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" />
            <a href="#">Forget Your Password?</a>
            <button type="submit">Sign In</button>
          </form>
        </div>
        <div className="toggle-container">
          <div className="toggle">
            <div className={`toggle-panel toggle-left ${isSignUp ? '' : 'hidden'}`}>
              <h1 className="form-text">Welcome Back!</h1>
              <p>Enter your personal details to use all of WAPA features</p>
              <button className="hidden" id="login" onClick={toggleForm}>Sign In</button>
            </div>
            <div className={`toggle-panel toggle-right ${isSignUp ? 'hidden' : ''}`}>
              <h1 className="form-text">Hi!</h1>
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
