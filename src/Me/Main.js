import React from 'react';
import styled from 'styled-components/macro';
import { desktop, mobile } from './styles/shared/devices';
import { mobileNavHeight } from './Navigation/Navbar';

const Main = ({ children }) => {
  return <Content>{children}</Content>;
};

export default Main;

const Content = styled.div`
  margin-top: -50px;
  padding: 0 16px;

  @media ${desktop} {
    padding: 0 80px;
  }

  @media ${mobile} {
    padding-bottom: ${mobileNavHeight + 8}px;
  }
`;
