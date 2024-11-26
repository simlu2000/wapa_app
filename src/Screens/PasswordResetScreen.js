import React, { useState } from 'react';
import { Link } from "react-router-dom";
import { getAuth, sendPasswordResetEmail } from 'firebase/auth';
import '../Styles/style_passwordreset.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowCircleLeft, faCircleArrowLeft } from '@fortawesome/free-solid-svg-icons';

function PasswordReset() {
    const [email, setEmail] = useState(''); //per memorizzare email utente
    const [message, setMessage] = useState('');

    const controlEmail = (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    const handlePasswordReset = async (e) => { //recupera istanza di autenticazione con getAuth() e invia email recupero
        e.preventDefault();
        if (!controlEmail(email)) {
            alert('Please enter a valid email');
            return;
        }
        const auth = getAuth();

        try {
            await sendPasswordResetEmail(auth, email);
            setMessage('Email sent! Control your e-mail (also spam).');
        } catch (error) {
            setMessage(`Error: ${error.message}`);
        }
    };

    return (
        <div id="reset-box">
            <h2>Forgot your Password?</h2>
            <h5>Please enter your e-mail.</h5>
            <form onSubmit={handlePasswordReset}>
                <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Insert your e-mail"
                    required
                />
                <button id="send" type="submit">Send reset email</button>
                <h2 id="ret"><Link to="/SignUpScreen"><FontAwesomeIcon icon={faArrowCircleLeft} style={{color:'rgba(200, 130, 255, 1)'}}/></Link></h2>
                

            </form>
            {message && <p>{message}</p>}
        </div>
    );
}

export default PasswordReset;
