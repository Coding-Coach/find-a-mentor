import { lazy } from 'react';
import ReactDOM from 'react-dom';
import App from './components/App/App';
import * as serviceWorker from './serviceWorker';
import auth from './utils/auth';
import './index.css';
import { reportError } from './ga';
import * as Sentry from '@sentry/browser';
import { UserProvider } from './context/userContext/UserContext';
import { FiltersProvider } from './context/filtersContext/FiltersContext';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { ModalHookProvider } from './context/modalContext/ModalContext';
import { LazyRoute } from './CustomRoutes/LazyRoute';
import { AuthorizationRoute } from './CustomRoutes/AuthorizedRoute';

const PageNotFound = lazy(
  () => import(/* webpackChunkName: "PageNotFound" */ './PageNotFound')
);
const Me = lazy(() => import(/* webpackChunkName: "Me" */ './Me/Me'));

Sentry.init({
  dsn: 'https://bcc1baf038b847258b4307e6ca5777e2@sentry.io/1542584',
});

(async () => {
  try {
    await auth.renewSession();
    ReactDOM.render(
      <UserProvider>
        <ModalHookProvider>
          <Router>
            <FiltersProvider>
              <Switch>
                <Route path={['/', '/u/:id']} exact>
                  <App />
                </Route>
                <AuthorizationRoute
                  lazy={true}
                  path="/me"
                  redirectAfterLogin={true}
                >
                  <Me />
                </AuthorizationRoute>
                <LazyRoute path="*">
                  <PageNotFound />
                </LazyRoute>
              </Switch>
            </FiltersProvider>
          </Router>
        </ModalHookProvider>
      </UserProvider>,
      document.getElementById('root')
    );
  } catch (error) {
    reportError('Init', `${error}`);
  }
})();

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
