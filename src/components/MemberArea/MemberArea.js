import React, { useState, useEffect, useContext, useCallback } from 'react';
import styled from 'styled-components';
import onClickOutside from 'react-onclickoutside';
import auth from '../../utils/auth';
import EditProfile from './EditProfile';
import PendingApplications from './PendingApplications';
import LoginNavigation from '../LoginNavigation/LoginNavigation';
import useWindowSize from '../../utils/useWindowSize';
import UserContext from '../../context/userContext/UserContext';
import { updateMentorAvailability } from '../../../src/api/index';
import Switch from '../../components/Switch/Switch';
import {isAdmin, isMentor} from '../../helpers/user';
import { getAvatarUrl } from '../../helpers/avatar';
import { report } from '../../ga';

function MemberArea({ onOpenModal }) {
  const authenticated = auth.isAuthenticated();
  const isDesktop = useWindowSize().width > 800;
  const [isAuthenticated, setIsAuthenticated] = useState(authenticated);
  const [isMemberMenuOpen, setIsMemberMenuOpen] = useState(false);
  const { currentUser, updateUser } = useContext(UserContext);

  const openProfile = useCallback(() => {
    onOpenModal('Edit Your Profile', <EditProfile />);
  }, [onOpenModal]);

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

  const onToggleAvailability = async (toggleState) => {
    if(!toggleState){
      if(!window.confirm("Are you sure you want to set yourself as unavailable?")){
        return;
      }
    }
    updateUser({...currentUser, available: toggleState});
    const isSuccessful = await updateMentorAvailability(toggleState);
    if(isSuccessful) {
      report('Mentor availability', 'toggle', toggleState);
    } else {
      updateUser({...currentUser, available: !toggleState});
    }
  }

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
              <UserImage alt={currentUser.email} src={getAvatarUrl(currentUser.avatar)} />
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
                  : 'Become a mentor'
                  }
              </MemberMenuItem>
              {
                isMentor(currentUser) &&
                <MemberMenuItem>
                  <Switch
                    label={"Available for new Mentees"}
                    type={"small"}
                    theme={"dark"}
                    isChecked={currentUser.available}
                    onToggle={onToggleAvailability}
                    id="available"
                  />
                </MemberMenuItem>
              }
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