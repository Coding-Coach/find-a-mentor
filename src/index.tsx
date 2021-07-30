import { lazy, Suspense } from 'react';
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
import { Loader } from './components/Loader';
import styled from 'styled-components';

const PageNotFound = lazy(
  () => import(/* webpackChunkName: "PageNotFound" */ './PageNotFound')
);
const Me = lazy(() => import(/* webpackChunkName: "Me" */ './Me/Me'));

Sentry.init({
  dsn: 'https://bcc1baf038b847258b4307e6ca5777e2@sentry.io/1542584',
});

const RouterLoader = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: font;
  z-index: 1;
  background: #fff;
`;

(async () => {
  try {
    await auth.renewSession();
    ReactDOM.render(
      <UserProvider>
        <ModalHookProvider>
          <Router>
            <FiltersProvider>
              <Switch>
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
                <Route path="/me" component={Me} />
                <Route path={['/', '/u/:id']} exact>
                  <App />
                </Route>
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
