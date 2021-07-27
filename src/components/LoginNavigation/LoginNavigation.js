import React from 'react';
import styled from 'styled-components';
import auth from '../../utils/auth';

function LoginNavigation() {

  localStorage.setItem("loggingOut", "false");

  const login = () => {
    localStorage.setItem("previous", window.location.href);
    auth.login();
  };

  if (window.location.href.includes("?login") && !auth.isAuthenticated()){
    auth.login();
  }

  return (
    <LoginArea>
      <LoginAreaItem onClick={login}>Login / Sign up</LoginAreaItem>
    </LoginArea>
  );

}

const LoginAreaItem = styled.div`
  font-size: 16px;
  color: #fff;
  cursor: pointer;

  &:hover {
    color: #54aa8d;
  }

  @media all and (min-width: 800px) {
    color: #69d5b1;
  }
`;

const LoginArea = styled.div`
  display: flex;
  flex-direction: column;
  margin: 0 40px;

  @media all and (min-width: 800px) {
    margin: 0 20px;
    flex-direction: row;

    * {
      margin-left: 20px;
    }
  }
`;

export default LoginNavigation;
