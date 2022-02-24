import { useCallback, useEffect, useState } from 'react';
import onClickOutside from 'react-onclickoutside';
import styled from 'styled-components';
import Link from '../Link/Link';

import { getAvatarUrl } from '../../helpers/avatar';
import { useUser } from '../../context/userContext/UserContext';
import { useAuth } from '../../context/authContext/AuthContext';
import { useApi } from '../../context/apiContext/ApiContext';
import LoginNavigation from '../LoginNavigation/LoginNavigation';
import EditProfile from './EditProfile';
import PendingApplications from './PendingApplications';
import { GlobalStyle } from '../../Me/styles/global';
import { useDeviceType } from '../../hooks/useDeviceType';

function MemberArea({ onOpenModal }) {
  const { isDesktop } = useDeviceType();
  const [isMemberMenuOpen, setIsMemberMenuOpen] = useState(false);
  const { currentUser, isMentor, isAdmin, isAuthenticated, logout } = useUser();
  const api = useApi();
  const auth = useAuth();
  const openBecomeMentor = useCallback(
    () => onOpenModal('Edit Your Profile', <EditProfile api={api} />),
    [onOpenModal, api]
  );

  const openPendingApplications = () => {
    onOpenModal('Pending Applications', <PendingApplications api={api} />);
  };

  MemberArea.handleClickOutside = () => setIsMemberMenuOpen(false);

  useEffect(() => {
    if (!currentUser) {
      return;
    }
    auth.onMentorRegistered(() => {
      openBecomeMentor();
    });
  }, [auth, currentUser, openBecomeMentor]);

  const onClickLogout = () => {
    logout();
    setIsMemberMenuOpen(false);
  };

  return (
    <div className="auth">
      {isAuthenticated ? (
        <>
          <UserAvatar
            data-testid="user-avatar"
            onClick={() =>
              currentUser && setIsMemberMenuOpen(!isMemberMenuOpen)
            }
          >
            {currentUser ? (
              <UserImage
                alt={currentUser.email}
                src={getAvatarUrl(currentUser.avatar)}
              />
            ) : (
              <AvatarPlaceHolder className="fa fa-user-circle" />
            )}
          </UserAvatar>
          {isMemberMenuOpen && (
            <MemberMenu tabIndex="0">
              {isAdmin && (
                <MemberMenuItem onClick={openPendingApplications}>
                  Open pending applications
                </MemberMenuItem>
              )}
              <Link href="/me">
                <MemberMenuItem>Manage Account</MemberMenuItem>
              </Link>
              {!isMentor && (
                <MemberMenuItem onClick={openBecomeMentor}>
                  Become a mentor
                </MemberMenuItem>
              )}
              <MemberMenuItem onClick={onClickLogout}>Logout</MemberMenuItem>
            </MemberMenu>
          )}
        </>
      ) : (
        isDesktop && <LoginNavigation />
      )}
      <GlobalStyle />
    </div>
  );
}

export default onClickOutside(MemberArea, {
  handleClickOutside: () => MemberArea.handleClickOutside,
});

const UserAvatar = styled.button`
  background: none;
  height: 50px;
  width: 50px;
  margin-right: 20px;
  padding: 0;
  border-radius: 50%;
  border: 4px solid #69d5b1;
  cursor: pointer;
  position: relative;
  overflow: hidden;
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

const MemberMenuItem = styled.a`
  font-size: 16px;
  padding: 15px;
  color: #4a4a4a;
  display: flex;
  justify-content: space-between;

  &:hover {
    background-color: #69d5b1;
    cursor: pointer;
  }
`;
