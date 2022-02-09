import React from 'react';
import { useRouter } from 'next/router';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import styled from 'styled-components/macro';
import Header from './Header/Header';
import Main from './Main';
import Navbar from './Navigation/Navbar';
// import Home from './Routes/Home';
// import MentorshipRequests from '../Me/MentorshipRequests';
import { GlobalStyle } from './styles/global';
import { desktop } from './styles/shared/devices';
// import { AuthorizationRoute } from '../CustomRoutes/AuthorizedRoute';
import { Helmet } from 'react-helmet';

// const Admin = React.lazy(() =>
//   import(/* webpackChunkName: "Admin" */ './Routes/Admin')
// );



const Me = (props: any) => {
  const { children, title } = props
  const { pathname } = useRouter();
  // return <div>Hello!</div>

  if (!process.browser) {
    return null
  }


  return (
    <Container>
      <>
        <Helmet>
          <title>{title} | CodingCoach</title>
          <meta name="description" content="codingcoach.io application" />
        </Helmet>
        <Navbar />
        {/* <Header title={title} /> */}
        <Main>
          { children }
          {/* <Switch>
            <Route path={`${url}/requests`}>
            <MentorshipRequests />
            </Route>
            <AuthorizationRoute path={`${url}/admin`} roles={['Admin']}>
            <Admin />
            </AuthorizationRoute>
            <Route path={`${url}`}>
            <Home />
            </Route>
          </Switch> */}
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

  /* @media ${desktop} {
    padding-left: 75px;
  } */
`;
