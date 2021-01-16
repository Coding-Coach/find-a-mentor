import React from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import styled from 'styled-components/macro';
import auth from '../utils/auth';
import Header from './Header/Header';
import Main from './Main';
import Navbar from './Navigation/Navbar';
import Home from './Routes/Home';
import { GlobalStyle } from './styles/global';
import MentorshipReq from './MentorshipReq/MentorshipReq';
import { desktop } from './styles/shared/devices';

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
              <Route path={`${url}/requests`}>
                <MentorshipReq />
              </Route>
              <Route path={`${url}`}>
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
