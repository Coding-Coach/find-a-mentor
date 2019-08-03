import React from 'react';
import styled from 'styled-components';
import { isMentor } from '../../helpers/user';
import auth from '../../utils/auth';
import { getCurrentUser } from '../../api';
import EditProfile from '../MemberArea/EditProfile';

function Navigation({ isAuthenticated, onOpenModal }) {
  const currentUser = getCurrentUser();

  const openProfile = () => {
    onOpenModal('Edit Your Pofile', <EditProfile user={currentUser} />);
  };

  const renderBecomeAMentor = isMentor => {
    if (isAuthenticated && isMentor) {
      return null;
    }
    if (isAuthenticated && !isMentor) {
      return (
        <Link href="#" onClick={openProfile()}>
          Become a Mentor
        </Link>
      );
    }
    return (
      <Link href="#" onClick={auth.login}>
        Become a Mentor
      </Link>
    );
  };

  return (
    <nav id="menu">
      <List>
        <Link href="https://codingcoach.io/">About</Link>
        {renderBecomeAMentor(isMentor(getCurrentUser()))}
      </List>
    </nav>
  );
}

const List = styled.ul`
  list-style: none;
  display: flex;

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
