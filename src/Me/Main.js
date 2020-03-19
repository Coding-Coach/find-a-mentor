import React from 'react';
import styled from 'styled-components/macro';
import { desktop } from './styles/shared/devices';

const Main = ({
  children
}) => {
  return (
    <Content>
      {children}
    </Content>
  );
}

export default Main;

const Content = styled.div`
  margin-top: -50px;
  padding: 0 16px;

  @media ${desktop} {
    padding: 0 80px;
  }
`