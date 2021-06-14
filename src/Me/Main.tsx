import { FC } from 'react';
import styled from 'styled-components/macro';
import { desktop, mobile } from './styles/shared/devices';
import { mobileNavHeight } from './Navigation/Navbar';

const Main: FC = ({ children }) => {
  return <Content>{children}</Content>;
};

export default Main;

const Content = styled.div`
  margin-top: -50px;
  padding: 0 16px;

  @media ${desktop} {
    width: 400px;
    margin-right: auto;
    margin-left: auto;
    padding-bottom: 10px;
  }

  @media ${mobile} {
    padding-bottom: ${mobileNavHeight + 8}px;
  }
`;
