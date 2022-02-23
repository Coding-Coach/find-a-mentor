import React from 'react';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import styled from 'styled-components/macro';
import { Helmet } from 'react-helmet';
import { useRouter } from 'next/router';

import Header from './Header/Header';
import Main from './Main';
import Navbar from './Navigation/Navbar';
import { GlobalStyle } from './styles/global';
import { desktop } from './styles/shared/devices';
import { isSsr } from '../helpers/ssr';
import { useUser } from '../context/userContext/UserContext';
import { useAuth } from '../context/authContext/AuthContext';



const Me = (props: any) => {
  const { children, title } = props
  const { pathname } = useRouter();
  const {currentUser} = useUser()
  const auth = useAuth()
  if (!currentUser) {
    auth.login(pathname)
    return null
  }

  if (isSsr()) {
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
        <Header title={title} />
        <Main>
          { children }
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
