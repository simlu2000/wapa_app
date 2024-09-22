import React from 'react';
import ReactDOM from 'react-dom/client'; // Importa 'react-dom/client' per React 18
import App from './App'; // Importa il componente App
import { BrowserRouter as Router } from 'react-router-dom';
import { register } from './serviceWorkerRegistration';

// Trova l'elemento radice
const root = ReactDOM.createRoot(document.getElementById('root'));

// Renderizza l'app
root.render(
  <Router>
    <App />
  </Router>
);

// Abilita il service worker
register();
