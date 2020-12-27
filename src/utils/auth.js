import Constants from '../config/constants';
import { clearCurrentUser, getCurrentUser } from '../api';
import { isMentor } from '../helpers/user';

import { Auth0Client } from '@auth0/auth0-spa-js';

class Auth {
  auth0 = new Auth0Client({
    domain: Constants.auth.DOMAIN,
    client_id: Constants.auth.CLIENT_ID,
    redirect_uri: Constants.auth.CALLBACK_URL,
    audience: `https://${Constants.auth.DOMAIN}/api/v2/`, // TEMP AUDIENCE TO ENSURE A JWT AT IS ISSUED
  });

  login = isMentorIntent => {
    this.auth0.loginWithRedirect({
      appState: {
        origin: isMentorIntent ? 'mentor' : 'user',
      },
    });
  };

  async getAccessToken() {
    try {
      return await this.auth0.getTokenSilently();
    } catch (e) {
      return null;
    }
  }

  getIdToken() {
    return this.idToken;
  }

  async onMentorRegistered(callback) {
    if (this.origin === 'mentor') {
      if (isMentor(await getCurrentUser())) {
        return;
      }
      callback();
      delete this.origin;
    }
  }

  async renewSession() {

    const parseQueryResult = (queryString: string) => {
      if (queryString.indexOf('#') > -1) {
        queryString = queryString.substr(0, queryString.indexOf('#'));
      }
    
      return queryString.split('&').reduce((acc, cur) => {
        const [key, val] = cur.split('=');
        acc[key] = decodeURIComponent(val);
        return acc;
      }, {});
    };

    const queryStringFragments = window.location.href.split('?').slice(1);

    const { code, error, error_description } = parseQueryResult(
      queryStringFragments.join('')
    );

    if (queryStringFragments.length > 0 && (code || error || error_description)) {
      await this.auth0.handleRedirectCallback();
      window.history.replaceState({}, document.title, window.location.pathname);
    } else {
      const isAuthenticated = await this.isAuthenticated();
      if (!isAuthenticated) {
        await this.auth0.checkSession();
      }
    }
  }

  logout = () => {
    this.auth0.logout({
      returnTo: Constants.auth.CALLBACK_URL,
    });
  };

  doLogout = () => {
    this.logout();
    clearCurrentUser();
  };

  async isAuthenticated() {
    // Check whether the current time is past the
    // access token's expiry time
    return await this.auth0.isAuthenticated();
  }
}

export default new Auth();
