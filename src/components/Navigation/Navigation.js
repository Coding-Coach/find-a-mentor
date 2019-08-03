import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { isMentor } from '../../helpers/user';
import auth from '../../utils/auth';
import { getCurrentUser } from '../../api';
import EditProfile from '../MemberArea/EditProfile';

function Navigation({ isAuthenticated, onOpenModal }) {
  const [currentUser, setCurrentUser] = useState(null);

  async function getUser() {
    try {
      return await getCurrentUser();
    } catch (error) {
      console.error('error', error);
    }
  }

  useEffect(() => {
    (async () => {
      const user = await getUser();
      setCurrentUser(user);
    })();
  }, []);

  const openProfile = () => {
    onOpenModal('Edit Your Pofile', <EditProfile user={currentUser} />);
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
      <Link href="#" onClick={auth.login}>
        Become a Mentor
      </Link>
    );
  };

  return (
    <nav id="menu">
      <List>
        <Link href="https://codingcoach.io/">About</Link>
        {renderBecomeAMentor()}
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
