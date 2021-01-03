import React from 'react';
import styled from 'styled-components';
import { desktop } from '../styles/shared/devices';
import { ReactComponent as Logo } from '../../assets/me/logo.svg';

const HeaderContainer = styled.div`
  height: 243px;
  width: 100%;
  background: radial-gradient(circle, #a5fcdb 0%, #12c395 100%);
  display: flex;
  justify-content: space-between;

  @media ${desktop} {
    height: 268px;
  }
`;

const Home = styled.div`
  height: 34px;
  width: 76px;
  color: #fff;
  font-family: Lato, 'Helvetica Neue', Arial, Helvetica, sans-serif;
  font-size: 28px;
  font-weight: 700;
  line-height: 34px;
  padding-top: 43px;
  padding-left: 16px;

  @media ${desktop} {
    color: #fff;
    padding-top: 39px;
    padding-left: 152px;
  }
`;

const LogoContainer = styled.div`
  padding-top: 43px;
  padding-right: 16px;
  height: 30px;
  padding-right: 1rem;

  @media ${desktop} {
    display: none;
  }
`;

const Header = () => (
  <HeaderContainer>
    <Home>Home</Home>
    <LogoContainer>
      <Logo />
    </LogoContainer>
  </HeaderContainer>
);

export default Header;
