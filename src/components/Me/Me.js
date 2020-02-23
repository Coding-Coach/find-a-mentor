import React from 'react';
import { Route, Switch, Redirect } from 'react-router-dom';
import auth from '../../utils/auth';
import Header from './Header/Header';
import Navbar from './Navigation/Navbar';
import './Me.css';

const Me = ({ match: { url } }) => {
  const authenticated = auth.isAuthenticated();

  return (
    <div className="me-container">
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
  );
};

export default Me;
