import React, { useCallback, useContext, useEffect, useState } from 'react';
import onClickOutside from 'react-onclickoutside';
import { useHistory } from 'react-router-dom';
import styled from 'styled-components';
import { updateMentorAvailability } from '../../../src/api/index';
import Switch from '../../components/Switch/Switch';
import { getAvatarUrl } from '../../helpers/avatar';
import { isOpen } from '../../config/experiments';
import UserContext from '../../context/userContext/UserContext';
import { report } from '../../ga';
import { getAvatarUrl } from '../../helpers/avatar';
import auth from '../../utils/auth';
import useWindowSize from '../../utils/useWindowSize';
import LoginNavigation from '../LoginNavigation/LoginNavigation';
import EditProfile from './EditProfile';
import PendingApplications from './PendingApplications';

function MemberArea({ onOpenModal }) {
  const authenticated = auth.isAuthenticated();
  const isDesktop = useWindowSize().width > 800;
  const [isAuthenticated, setIsAuthenticated] = useState(authenticated);
  const [isMemberMenuOpen, setIsMemberMenuOpen] = useState(false);
  const { currentUser, updateUser, isMentor, isAdmin } = useContext(
    UserContext
  );
  const history = useHistory();

  const openProfile = useCallback(() => {
    if (isOpen('newBackoffice')) {
      history.push('/me');
    } else {
      onOpenModal('Edit Your Profile', <EditProfile />);
    }
  }, [isMentor, history, onOpenModal]);

  const openPendingApplications = () => {
    onOpenModal('Pending Applications', <PendingApplications />);
  };

  MemberArea.handleClickOutside = () => setIsMemberMenuOpen(false);

  useEffect(() => {
    (async () => {
      setIsAuthenticated(auth.isAuthenticated());
    })();
  }, []);

  useEffect(() => {
    if (!currentUser) {
      return;
    }
    auth.onMentorRegistered(() => {
      openProfile();
    });
  }, [currentUser, openProfile]);

  const logout = () => {
    auth.doLogout();
    setIsMemberMenuOpen(false);
  };

  const onToggleAvailability = async toggleState => {
    if (!toggleState) {
      if (
        !window.confirm('Are you sure you want to set yourself as unavailable?')
      ) {
        return;
      }
    }
    updateUser({ ...currentUser, available: toggleState });
    const isSuccessful = await updateMentorAvailability(toggleState);
    if (isSuccessful) {
      report('Mentor availability', 'toggle', toggleState);
    } else {
      updateUser({ ...currentUser, available: !toggleState });
    }
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
              <MemberMenuItem onClick={openProfile}>
                {isMentor ? 'Edit your profile' : 'Become a mentor'}
              </MemberMenuItem>
              {isMentor && !isOpen('newBackoffice') && (
                <MemberMenuItem>
                  <Switch
                    label={'Available for new Mentees'}
                    type={'small'}
                    theme={'dark'}
                    isChecked={currentUser.available}
                    onToggle={onToggleAvailability}
                    id="available"
                  />
                </MemberMenuItem>
              )}
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

export default onClickOutside(MemberArea, {
  handleClickOutside: () => MemberArea.handleClickOutside,
});

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
  display: flex;
  justify-content: space-between;
  &:hover {
    background-color: #69d5b1;
    cursor: pointer;
  }
`;
