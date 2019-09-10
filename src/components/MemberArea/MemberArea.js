import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import onClickOutside from 'react-onclickoutside';
import { getCurrentUser } from '../../api';
import auth from '../../utils/auth';
import EditProfile from './EditProfile';
import PendingApplications from './PendingApplications';
import LoginNavigation from '../LoginNavigation/LoginNavigation';
import useWindowSize from '../../utils/useWindowSize';
import { isMentor, isAdmin } from '../../helpers/user';

function MemberArea(props) {
  const authenticated = auth.isAuthenticated();
  const [isAuthenticated, setIsAuthenticated] = useState(authenticated);
  const [currentUser, setCurrentUser] = useState(null);
  const [isMemberMenuOpen, setIsMemberMenuOpen] = useState(false);
  const isDesktop = useWindowSize().width > 800;

  async function getUser() {
    try {
      return await getCurrentUser();
    } catch (error) {
      console.error('error', error);
    }
  }

  const openProfile = () => {
    props.onOpenModal(
      'Edit Your Pofile',
      <EditProfile user={currentUser} onUserUpdated={setCurrentUser} />
    );
  };

  const openPendingApplications = () => {
    props.onOpenModal('Pending Applications', <PendingApplications />);
  };

  MemberArea.handleClickOutside = () => setIsMemberMenuOpen(false);

  useEffect(() => {
    (async () => {
      const user = await getUser();
      setIsAuthenticated(auth.isAuthenticated());
      setCurrentUser(user);
    })();
  }, []);

  useEffect(() => {
    if (!currentUser) {
      return;
    }
    auth.onMentorRegistered(() => {
      openProfile();
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentUser]);

  const logout = () => {
    auth.doLogout();
    setIsMemberMenuOpen(false);
  };

  return (
    <div className="auth">
      {isAuthenticated ? (
        <>
          <UserAvatar
            onClick={() =>
              currentUser && setIsMemberMenuOpen(!isMemberMenuOpen)
            }
          >
            {currentUser ? (
              <UserImage alt={currentUser.email} src={currentUser.avatar} />
            ) : (
              <AvatarPlaceHolder className="fa fa-user-circle" />
            )}
          </UserAvatar>
          {isMemberMenuOpen && (
            <MemberMenu tabIndex="0">
              {isAdmin(currentUser) && (
                <MemberMenuItem onClick={openPendingApplications}>
                  Open pending applications
                </MemberMenuItem>
              )}
              <MemberMenuItem onClick={openProfile}>
                {isMentor(currentUser)
                  ? 'Edit your profile'
                  : 'Become a mentor'}
              </MemberMenuItem>
              <MemberMenuItem onClick={logout}>Logout</MemberMenuItem>
            </MemberMenu>
          )}
        </>
      ) : (
        isDesktop && <LoginNavigation />
      )}
    </div>
  );
}

const UserAvatar = styled.div`
  height: 50px;
  width: 50px;
  margin-right: 20px;
  border-radius: 50%;
  border: 4px solid #69d5b1;
  cursor: pointer;
  position: relative;
`;

const AvatarPlaceHolder = styled.i`
  font-size: 42px;
  color: rgb(155, 155, 155);
`;

const UserImage = styled.img`
  height: 100%;
  border-radius: 50%;
`;

const MemberMenu = styled.div`
  position: absolute;
  top: 90px;
  right: 20px;
  display: flex;
  flex-direction: column;
  border: 1px solid #dadada;
  border-top: none;
  outline: none;
  background-color: white;
`;

const MemberMenuItem = styled.div`
  font-size: 16px;
  padding: 15px;
  color: #4a4a4a;

  &:hover {
    background-color: #69d5b1;
    cursor: pointer;
  }
`;

export default onClickOutside(MemberArea, {
  handleClickOutside: () => MemberArea.handleClickOutside,
});
