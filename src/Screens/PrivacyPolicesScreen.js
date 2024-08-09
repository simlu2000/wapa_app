import React, { useState } from 'react';
import '../Styles/style_privacypolicesscreen.css';

const PrivacyPolicesScreen = () => {

    return (
        <>
            <section className="container-data">
            <h1 id="pr-text">Privacy Polices</h1>
            <p>
                <h2>Introduction</h2>
                Our weather web app, WAPA, is committed to protecting your privacy. 
                This privacy policy describes how we collect, use and share your personal information when you use our service.

                <h2>Information gathering</h2>
                When you use your Facebook login to access our app, we collect the following information:
                - First name
                - Email address
                - Profile picture
                - More basic information from your Facebook profile

                <h2>Use of Information</h2>
                We use the information collected for the following purposes:
                - Authentication and access to services
                - Personalization of the user experience
                - Communications regarding updates to our app

                <h2>Condition of Information</h2>
                We do not share your personal information with third parties, except in the following cases:
                - When required by law
                - With service providers who help us operate and improve our app

                <h2>Safety</h2>
                We take appropriate security measures to protect your personal information from unauthorized access.

                <h2>User Rights</h2>
                You have the right to access, correct or delete the personal information we hold about you. 
                To exercise these rights, please contact us at wapa.weather.info@gmail.com .

                <h2>Contacts</h2>
                If you have any questions or concerns about this privacy policy, please contact us at:
                wapa.weather.info@gmail.com 
                <br></br>
                <br></br>
                Last update: 23/07/2024
                

            </p>
            </section>
        </>
    );
};

export default PrivacyPolicesScreen;
