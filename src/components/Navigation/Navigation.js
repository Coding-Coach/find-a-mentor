import React, { useContext } from 'react';
import styled from 'styled-components';
import { isMentor } from '../../helpers/user';
import { useAuth } from '../../context/authContext/AuthContext';
import EditProfile from '../MemberArea/EditProfile';
import UserContext from '../../context/userContext/UserContext';
import { links } from '../../config/constants';
import { useApi } from '../../context/apiContext/ApiContext';

function Navigation({ isAuthenticated, onOpenModal }) {
  const { currentUser } = useContext(UserContext);
  const auth = useAuth();
  const api = useApi();

  const openProfile = (e) => {
    e.preventDefault();
    onOpenModal('Edit Your Profile', <EditProfile api={api} />);
  };

  const renderBecomeAMentor = () => {
    if (isAuthenticated && isMentor(currentUser)) {
      return null;
    }
    if (isAuthenticated) {
      return (
        <Link href="#" onClick={openProfile}>
          Become a Mentor
        </Link>
      );
    }
    return (
      <Link
        href="#"
        onClick={(e) => e.preventDefault() || auth.login(null, true)}
      >
        Become a Mentor
      </Link>
    );
  };

  return (
    <Nav id="menu">
      <List>
        <Link href="https://codingcoach.io/">About</Link>
        <Link href={links.MENTORSHIP_GUIDELINES} target="_blank">
          Mentorship Guidelines
        </Link>
        {renderBecomeAMentor()}
        <Link
          href="https://calendar.google.com/calendar/u/0?cid=Y18xdmhxMWlzOTRqdHVwdHZnNTJrbzM0cW42a0Bncm91cC5jYWxlbmRhci5nb29nbGUuY29t"
          target="_blank"
          rel="noopener noreferrer"
        >
          Sessions Calendar
        </Link>
      </List>
    </Nav>
  );
}

const Nav = styled.nav`
  flex-grow: 1;
`;

const List = styled.ul`
  list-style: none;
  display: flex;

  @media all and (min-width: 801px) {
    padding: 0;
    margin: 0;
  }

  @media all and (max-width: 800px) {
    margin-top: 100px;
    flex-direction: column;
  }
`;

const Link = styled.a`
  color: #4a4a4a;
  text-decoration: none;
  padding: 10px;
  font-size: 16px;

  @media all and (max-width: 800px) {
    padding-left: 0;
    color: #fff;
  }

  &:hover {
    color: #2c2c2c;
  }
`;

export default Navigation;
