import React from 'react';
import ReactDOM from 'react-dom';
import App from './components/App/App';
import * as serviceWorker from './serviceWorker';
import auth from './utils/auth';
import { getCurrentUser } from './api';
import './index.css';
import { reportError } from './ga';
import * as Sentry from '@sentry/browser';
import { UserProvider } from './context/userContext/UserContext';
import { FiltersProvider } from './context/filtersContext/FiltersContext';

Sentry.init({
  dsn: 'https://bcc1baf038b847258b4307e6ca5777e2@sentry.io/1542584',
});

(async () => {
  try {
    await auth.renewSession();
    // prepare user - don't wait for it
    getCurrentUser();
    ReactDOM.render(
      <UserProvider>
        <FiltersProvider>
          <App />
        </FiltersProvider>
      </UserProvider>,
      document.getElementById('root')
    );
  } catch (error) {
    reportError('Init', error);
  }
})();

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.register();
