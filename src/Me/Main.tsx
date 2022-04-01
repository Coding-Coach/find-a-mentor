import { FC } from 'react';
import styled from 'styled-components/macro';
import { desktop, mobile } from './styles/shared/devices';
import { mobileNavHeight } from './Navigation/Navbar';
import { useUser } from '../context/userContext/UserContext';
import { CardContainer } from './components/Card';

const Main: FC = ({ children }) => {
  const { currentUser } = useUser();
  if (typeof window === 'undefined' && !currentUser) {
    return null;
  }
  return <Content>{children}</Content>;
};

export default Main;

const Content = styled.div`
  gap: 10px;
  display: flex;
  flex-wrap: wrap;
  padding: 0 16px;
  margin-top: -50px;
  justify-content: center;

  @media ${desktop} {
    margin-right: auto;
    margin-left: auto;
    padding-bottom: 10px;

    ${CardContainer}:not(.wide) {
      max-width: 400px;
    }
  }

  @media ${mobile} {
    padding-bottom: ${mobileNavHeight + 8}px;
    flex-direction: column;
    gap: 20px;
  }
`;
