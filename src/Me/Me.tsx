import React from 'react';
import { Route, Switch, useLocation } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import styled from 'styled-components/macro';
import Header from './Header/Header';
import Main from './Main';
import Navbar from './Navigation/Navbar';
import Home from './Routes/Home';
import MentorshipRequests from '../Me/MentorshipRequests';
import { GlobalStyle } from './styles/global';
import { desktop } from './styles/shared/devices';
import { AuthorizationRoute } from '../CustomRoutes/AuthorizedRoute';
import { Helmet } from 'react-helmet';

const Admin = React.lazy(() =>
  import(/* webpackChunkName: "Admin" */ './Routes/Admin')
);

const url = '/me';

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

const Me = () => {
  const { pathname } = useLocation();
  const title = getHeaderNameByPath(pathname);

  return (
    <Container>
      <>
        <Helmet>
          <title>{title} | CodingCoach</title>
          <meta name="description" content="codingcoach.io application" />
        </Helmet>
        <Navbar />
        <Header title={title} />
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
