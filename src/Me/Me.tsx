import React from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';
import type { RouteComponentProps } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import styled from 'styled-components/macro';
import auth from '../utils/auth';
import Header from './Header/Header';
import Main from './Main';
import Navbar from './Navigation/Navbar';
import Home from './Routes/Home';
import MentorshipRequests from '../Me/MentorshipRequests';
import { GlobalStyle } from './styles/global';
import { desktop } from './styles/shared/devices';
import { AuthorizationRoute } from './AuthorizationRoute';


const Admin = React.lazy(() => import(/* webpackChunkName: "Admin" */ './Routes/Admin'));

type MeProps = RouteComponentProps & {};


const meRoutes = [
  {
    path: '/me',
    name: 'Home',
  },
  {
    path: '/me/requests',
    name: 'Mentorships',
  },
  {
    path: '/me/admin',
    name: 'Admin',
  },
];

//function to find the header title based on the path
const getHeaderNameByPath = (path: string) => {
  return meRoutes.find(route => route.path === path)?.name ?? '';
};

const Me = ({
  match: { url },
  location: { pathname },
}: MeProps) => {
  const authenticated = auth.isAuthenticated();

  return (
    <Container>
      {authenticated ? (
        <>
          <Navbar />
          <Header title={getHeaderNameByPath(pathname)} />
          <Main>
            <Switch>
              <Route path={`${url}/requests`}>
                <MentorshipRequests />
              </Route>
              <AuthorizationRoute path={`${url}/admin`} role={'Admin'}>
                <Admin />
              </AuthorizationRoute>
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
