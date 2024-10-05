import React, { useState, useEffect } from 'react';
import { auth, provider } from '../Utils/firebase';
import { useNavigate, Link } from 'react-router-dom';
import { signInWithPopup, GoogleAuthProvider, createUserWithEmailAndPassword, signInWithEmailAndPassword, signInWithRedirect, getRedirectResult } from 'firebase/auth';
import { setUserData } from '../Utils/userService';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGooglePlusG } from '@fortawesome/free-brands-svg-icons';
import '../Styles/style_signupscreen.css';

const SignUpScreen = () => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({ email: '', password: '' });
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRedirectResult = async () => {
      try {
        const result = await getRedirectResult(auth);
        if (result && result.user) {
          const user = result.user;
          await setUserData(user.uid, { email: user.email, localities: [] });
          navigate('/WeatherScreen');
        }
      } catch (error) {
        console.error("Error during Google sign-in redirect", error);
        alert(error.message);
      }
    };

    fetchRedirectResult();
  }, [navigate]);

  const toggleForm = () => {
    setIsSignUp(!isSignUp);
  };

  const validateFields = () => {
    let valid = true;
    let errors = { email: '', password: '' };

    if (!email) {
      errors.email = 'Email is required';
      valid = false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      errors.email = 'Email address is invalid';
      valid = false;
    }

    if (!password) {
      errors.password = 'Password is required';
      valid = false;
    } else if (password.length < 6) {
      errors.password = 'Password must be at least 6 characters';
      valid = false;
    }

    setErrors(errors);
    return valid;
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    if (!validateFields()) return;

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      await setUserData(user.uid, { email: user.email, localities: [] });
      navigate('/WeatherScreen');
    } catch (error) {
      console.error("Error during registration", error);
      alert(error.message);
    }
  };

  const handleSignIn = async (e) => {
    e.preventDefault();
    if (!validateFields()) return;

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      navigate('/WeatherScreen');
    } catch (error) {
      console.error("Error during sign-in", error);
      alert(error.message);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      await signInWithRedirect(auth, provider);
    } catch (error) {
      console.error("Error during Google sign-in", error);
      alert(error.message);
    }
  };

  const handleGoBack = () => {
    setIsSignUp(false);
  };

  return (
    <>
      <div className="background">
        <span></span>
        {/* Altri span rimossi per brevità */}
      </div>
      <div className={`box-form ${isSignUp ? 'sign-up-mode' : ''}`} id="box">
        <div className="form-container sign-up">
          <button id="back" onClick={handleGoBack}>Go back</button>
          <form id="sign" onSubmit={handleSignUp}>
            <h1 id="signup" className="form-text">Sign Up</h1>
            <div className="social-icons">
              <a href="#" className="icon" onClick={handleGoogleSignIn}><FontAwesomeIcon icon={faGooglePlusG} /></a>
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
              <a href="#" className="icon" onClick={handleGoogleSignIn}><FontAwesomeIcon icon={faGooglePlusG} /></a>
            </div>
            <span>or use your email and password</span>
            <input className="email-area" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" />
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" />
            <Link to="/PasswordResetScreen"><a>Forget Your Password?</a></Link>
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
