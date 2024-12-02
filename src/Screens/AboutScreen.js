import React from "react";
import '../Styles/style_aboutscreen.css';

const AboutScreen = () => {
    return (
        <>
            <h1 className="info-title">About WAPA</h1>
            <section className="about-container">
                <p>WAPA (Weather and Advanced Predictions App) è stata sviluppata per la mia tesi di laurea in Informatica e
                    l'obiettivo principale era quello di creare un'applicazione web
                    progressiva in grado di dare agli utenti informazioni basilari
                    sul meteo e avanzate, mediante anche la rappresentazione con grafici.
                    Per migliorare l'esperienza utente è stato implementato un sistema di
                    personalizzazione automatica della schermata meteo in base alla condizione
                    meteo corrente dell'utente o selezionata dall'utente.
                </p>
            </section>

            <section>
                <h2 className="info-title">About the Developer</h2>
                <div className="developer-card">
                    <img src="path/to/your-photo.jpg" alt="Simone Lutero" className="developer-photo" />
                    <div className="developer-info">
                        <h3>Simone Lutero</h3>
                        <p>Studente di Informatica e Full-stack Developer</p>
                        <p><strong>Email:</strong>simone.lutero1@gmail.com</p>
                    </div>
                </div>
            </section>

            
        </>
    );
};

export default AboutScreen;
