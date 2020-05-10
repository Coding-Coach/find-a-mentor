import React from 'react';
import { Route, Switch, Redirect } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import styled from 'styled-components/macro';
import auth from '../utils/auth';
import Main from './Main';
import Header from './Header/Header';
import Navbar from './Navigation/Navbar';
import Home from './Routes/Home';
import { desktop } from './styles/shared/devices';
import {GlobalStyle} from './styles/global';

import 'react-toastify/dist/ReactToastify.css';

const Me = ({ match: { url } }) => {
  const authenticated = auth.isAuthenticated();

  return (
    <Container>
      {authenticated ? (
        <>
          <Navbar />
          <Header />
          <Main>
            <Switch>
              <Route path={`${url}/home`}>
                <Home />
              </Route>
            </Switch>
          </Main>
        </>
      ) : (
        <Redirect to="/" />
      )}
      <ToastContainer />
      <GlobalStyle />
    </Container>
  );
};

export default Me;

const Container = styled.div`
  min-height: 100vh;
  background-color: #f8f8f8;

  @media ${desktop} {
    padding-left: 75px;
  }
`;
