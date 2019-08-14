import auth0 from 'auth0-js';
import Constants from '../config/constants';
import { clearCurrentUser, getCurrentUser } from '../api';
import { isMentor } from '../helpers/user';

const storageKey = 'auth-data';

class Auth {
  accessToken;

  idToken;

  expiresAt;

  auth0 = new auth0.WebAuth({
    domain: Constants.auth.DOMAIN,
    clientID: Constants.auth.CLIENT_ID,
    redirectUri: Constants.auth.CALLBACK_URL,
    responseType: 'token id_token',
    scope: 'openid',
  });

  login = isMentorIntent => {
    this.auth0.authorize({
      appState: {
        origin: isMentorIntent ? 'mentor' : 'user',
      },
    });
  };

  handleAuthentication() {
    return new Promise((resolve, reject) => {
      this.auth0.parseHash((err, authResult) => {
        if (err) {
          reject(err);
        } else {
          if (authResult && authResult.accessToken && authResult.idToken) {
            this.setSession(authResult);
          }
          resolve();
        }
      });
    });
  }

  getAccessToken() {
    return this.accessToken;
  }

  getIdToken() {
    return this.idToken;
  }

  setSession(authResult) {
    const expiresAt = authResult.expiresIn * 1000 + new Date().getTime();

    // Set isLoggedIn flag in localStorage
    localStorage.setItem(
      storageKey,
      JSON.stringify({
        accessToken: authResult.accessToken,
        idToken: authResult.idToken,
        expiresAt,
      })
    );

    // Set the time that the access token will expire at
    this.accessToken = authResult.accessToken;
    this.idToken = authResult.idToken;
    this.expiresAt = expiresAt;
    // can't show the becoming mentor modal here because the app is not initialized yet, so store it in memory and wait the app to up
    this.origin = authResult.appState.origin;
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

  loadSession() {
    const json = localStorage.getItem(storageKey);

    if (json) {
      const session = JSON.parse(json);

      this.accessToken = session.accessToken;
      this.idToken = session.idToken;
      this.expiresAt = session.expiresAt;
    }

    return this;
  }

  renewSession() {
    return new Promise(async resolve => {
      if (window.location.hash) {
        await this.handleAuthentication();
        // clean the hash
        window.history.replaceState(
          null,
          null,
          window.location.href.split('#')[0]
        );
        resolve();
      } else if (!this.isAuthenticated()) {
        this.auth0.checkSession({}, (err, authResult) => {
          if (authResult && authResult.accessToken && authResult.idToken) {
            this.setSession(authResult);
          }
          resolve();
        });
      } else {
        resolve();
      }
    });
  }

  logout = () => {
    // Remove tokens and expiry time from memory
    this.accessToken = null;
    this.idToken = null;
    this.expiresAt = 0;

    // Remove token from localStorage
    localStorage.removeItem(storageKey);
  };

  doLogout = () => {
    this.logout();
    clearCurrentUser();
    this.auth0.logout({
      returnTo: window.location.href,
    });
  };

  isAuthenticated() {
    // Check whether the current time is past the
    // access token's expiry time
    let expiresAt = this.expiresAt;
    return new Date().getTime() < expiresAt;
  }
}

export default new Auth().loadSession();
