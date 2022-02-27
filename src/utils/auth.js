import auth0 from 'auth0-js';
import { isSsr } from '../helpers/ssr';
import { isMentor } from '../helpers/user';

const storageKey = 'auth-data';
class Auth {
  accessToken;

  idToken;

  expiresAt;

  auth0;

  constructor() {
    if (typeof window === 'object') {
      this.domain = process.env.NEXT_PUBLIC_AUTH_DOMAIN;
      this.clientId = process.env.NEXT_PUBLIC_AUTH_CLIENT_ID;
      this.redirectUri = process.env.NEXT_PUBLIC_AUTH_CALLBACK;

      this.auth0 = new auth0.WebAuth({
        domain: this.domain,
        clientID: this.clientId,
        redirectUri: this.redirectUri,
        responseType: 'token id_token',
        scope: 'openid',
      });

      this.loadSession();
    }
  }

  /**
   * @param {string} [redirectTo]
   * @param {boolean} [isMentorIntent]
   */
  login = (redirectTo, isMentorIntent) => {
    if (!redirectTo && window.location.pathname !== '/') {
      redirectTo = window.location.href.split(this.redirectUri)[1];
      // redirect to the allowed login path
      window.history.replaceState(null, null, '/');
    }

    this.auth0.authorize({
      appState: {
        origin: isMentorIntent ? 'mentor' : 'user',
      },
      redirectUri: redirectTo
        ? `${this.redirectUri}?redirectTo=${redirectTo}`
        : window.location.href,
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

  // TODO: figure out what mentor registration callbacks have to do with authentication.  Probably move this functionality elsewhere
  async onMentorRegistered(api, callback) {
    if (this.origin === 'mentor') {
      if (isMentor(await api.getCurrentUser())) {
        return;
      }
      callback();
      delete this.origin;
    }
  }

  loadSession() {
    if (typeof window === 'undefined') {
      return;
    }
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
    if (isSsr()) {
      return Promise.resolve();
    }
    return new Promise(async (resolve, reject) => {
      if (window.location.hash) {
        try {
          await this.handleAuthentication();
          // clean the hash
          window.history.replaceState(
            null,
            null,
            window.location.href.split('#')[0]
          );
          resolve();
        } catch (error) {
          reject(error);
        }
      } else if (!this.isAuthenticated()) {
        this.auth0.checkSession({}, (err, authResult) => {
          if (err) {
            reject(err);
          }
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

  #logout = () => {
    // Remove tokens and expiry time from memory
    this.accessToken = null;
    this.idToken = null;
    this.expiresAt = 0;

    // Remove token from localStorage
    localStorage.removeItem(storageKey);
  };

  // TODO: figure out why the API  service needs to clear the current user instead of the Auth class?
  doLogout = (api) => {
    this.#logout();
    api.clearCurrentUser();
    this.auth0.logout({
      returnTo: this.redirectUri,
    });
  };

  isAuthenticated() {
    // Check whether the current time is past the
    // access token's expiry time
    let expiresAt = this.expiresAt;
    return new Date().getTime() < expiresAt;
  }
}

export default Auth;
