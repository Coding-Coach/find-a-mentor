import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import onClickOutside from 'react-onclickoutside';
import { getCurrentUser } from '../../api';
import auth from '../../utils/auth';
import EditProfile from './EditProfile';
import PendingApplications from './PendingApplications';
import LoginNavigation from '../LoginNavigation/LoginNavigation';
import useWindowSize from '../../utils/useWindowSize';

function MemberArea(props) {
  const authenticated = auth.isAuthenticated();
  const [isAuthenticated, setIsAuthenticated] = useState(authenticated);
  const [currentUser, setCurrentUser] = useState(null);
  const [isMemberMenuOpen, setIsMemberMenuOpen] = useState(false);
  const isDesktop = useWindowSize().width > 800;

  async function getUser() {
    try {
      await auth.renewSession();
      return await getCurrentUser();
    } catch (error) {
      console.error('error', error);
    }
  }

  useEffect(() => {
    getUser().then(user => {
      setIsAuthenticated(authenticated);
      setCurrentUser(user);
    });
  }, []);

  const logout = () => {
    auth.doLogout();
    setIsAuthenticated(authenticated);
    setCurrentUser(null);
    setIsMemberMenuOpen(false);
  };
  const openProfile = () =>
    props.onOpenModal('Edit Your Pofile', <EditProfile user={currentUser} />);
  const openPendingApplications = () =>
    props.onOpenModal('Pending Applications', <PendingApplications />);
  MemberArea.handleClickOutside = () => setIsMemberMenuOpen(false);

  console.log(isDesktop, isAuthenticated);

  return (
    <div className="auth">
      {isAuthenticated ? (
        <>
          <UserAvatar onClick={() => setIsMemberMenuOpen(!isMemberMenuOpen)}>
            {currentUser && (
              <UserImage alt={currentUser.email} src={currentUser.avatar} />
            )}
          </UserAvatar>
          {isMemberMenuOpen && (
            <MemberMenu tabIndex="0">
              {currentUser && currentUser.roles.includes('Admin') && (
                <MemberMenuItem onClick={openPendingApplications}>
                  Open pending applications
                </MemberMenuItem>
              )}
              <MemberMenuItem onClick={openProfile}>
                Edit your profile
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
  display: flex;
  justify-content: center;
  padding: 2px;
  border: 4px solid #69d5b1;
  cursor: pointer;
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
