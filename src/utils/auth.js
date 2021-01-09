import Constants from '../config/constants';
import { clearCurrentUser, getCurrentUser } from '../api';
import { isMentor } from '../helpers/user';

import { Auth0Client } from '@auth0/auth0-spa-js';

class Auth {
  auth0 = new Auth0Client({
    domain: Constants.auth.DOMAIN,
    client_id: Constants.auth.CLIENT_ID,
    redirect_uri: Constants.auth.CALLBACK_URL,
    audience: Constants.auth.API_IDENTIFIER,
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
    if (window.location.hash) {
      const authResult = await this.auth0.handleRedirectCallback();
      window.history.replaceState({}, document.title, window.location.pathname);
      this.origin = authResult.appState.origin;
    } else if (await this.isAuthenticated()) {
      await this.auth0.checkSession();
    }
  }

  doLogout = () => {
    clearCurrentUser();
    this.auth0.logout({
      returnTo: Constants.auth.CALLBACK_URL,
    });
  };

  isAuthenticated() {
    return this.auth0.isAuthenticated();
  }
}

export default new Auth();
