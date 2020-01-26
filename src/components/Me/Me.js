import React from 'react';
import { Route, Switch, Redirect, Link} from 'react-router-dom';
import auth from '../../utils/auth';

const Me = ({ match : {url} }) => {

  const authenticated = auth.isAuthenticated()

  return (
    <div>
    {authenticated ? (
      <>
        <Switch>
          <Route path={`${url}/home`} render={ () => (
            <h1> hello from home </h1>
           )}/>
        </Switch>
        <Link to={`${url}/home`}>Home</Link>
      </>
      ) : (
        <Redirect to="/" />
      )
    }
    </div>
  )
}

export default Me;
