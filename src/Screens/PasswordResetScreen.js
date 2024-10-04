import React, { useState } from 'react';
import {Link} from "react-router-dom";
import { getAuth, sendPasswordResetEmail } from 'firebase/auth';
import '../Styles/style_passwordreset.css';

function PasswordReset() {
    const [email, setEmail] = useState(''); //per memorizzare email utente
    const [message, setMessage] = useState('');

    const handlePasswordReset = async (e) => { //recupera istanza di autenticazione con getAuth() e invia email recupero
        e.preventDefault();
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
                <button id="return" type="submit"><Link to="/SignUpScreen"><a id="ret">Return to SignUp</a></Link></button>
            
            </form>
            {message && <p>{message}</p>}
        </div>
    );
}

export default PasswordReset;
