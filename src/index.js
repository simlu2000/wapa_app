import React from 'react';
import ReactDOM from 'react-dom';
import App from './App'; // Import your App component
import { BrowserRouter as Router } from 'react-router-dom';

import * as serviceWorkerRegistration from './serviceWorkerRegistration';

ReactDOM.render(
  <Router>
    <App />
  </Router>,
  document.getElementById('root')
);

// Abilita il service worker
serviceWorkerRegistration.register();