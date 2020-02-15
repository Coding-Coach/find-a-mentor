import React from 'react';
import { Route, Switch, Redirect } from 'react-router-dom';
import auth from '../../utils/auth';
import Header from './Header/Header';
import Navbar from './Navigation/Navbar';
import BodyBackgroundColor from 'react-body-backgroundcolor';

const Me = ({ match: { url } }) => {
  const authenticated = auth.isAuthenticated();

  return (
    <BodyBackgroundColor backgroundColor="#E0E0E0">
      <div>
        {authenticated ? (
          <>
            <Switch>
              <Route
                path={`${url}/home`}
                render={() => <h1> hello from home </h1>}
              />
            </Switch>
            <Navbar />
            <Header />
          </>
        ) : (
          <Redirect to="/" />
        )}
      </div>
    </BodyBackgroundColor>
  );
};

export default Me;
