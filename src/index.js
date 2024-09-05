import React from 'react';
import ReactDOM from 'react-dom';
import App from './App'; // Import your App component
import { BrowserRouter as Router } from 'react-router-dom';

import * as serviceWorkerRegistration from '../public/service-worker';

// Registrazione del service worker per l'esperienza offline
serviceWorkerRegistration.register();

ReactDOM.render(
  <Router>
    <App />
  </Router>,
  document.getElementById('root')
);
