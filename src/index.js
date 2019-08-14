import React from 'react';
import ReactDOM from 'react-dom';
import App from './components/App/App';
import * as serviceWorker from './serviceWorker';
import auth from './utils/auth';
import { getCurrentUser } from './api';
import './index.css';

(async () => {
  await auth.renewSession();
  // prepare user - don't wait for it
  getCurrentUser();
  ReactDOM.render(<App />, document.getElementById('root'));
})();

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.register();
