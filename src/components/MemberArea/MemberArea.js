import React, { Component } from 'react';
import { getCurrentUser } from '../../api';
import auth from '../../utils/auth';
import EditProfile from './EditProfile';
import PendingApplications from './PendingApplications';
import styled from 'styled-components';
import onClickOutside from 'react-onclickoutside';

class MemberArea extends Component {
  state = {
    isAuthenticated: auth.isAuthenticated(),
    currentUser: null,
    isMemberMenuOpen: false,
  };

  async componentDidMount() {
    try {
      await auth.renewSession();
      const currentUser = await getCurrentUser();
      this.refreshAuthState(currentUser);
    } catch (error) {
      console.error('error', error);
    }
  }

  refreshAuthState = currentUser => {
    this.setState({
      isAuthenticated: auth.isAuthenticated(),
      currentUser,
    });
  };

  logout = () => {
    auth.doLogout();
    this.refreshAuthState();
  };

  login = () => {
    auth.login();
  };

  signup = () => {
    auth.signup();
  };

  openProfile = () => {
    const { onOpenModal } = this.props;
    onOpenModal(
      'Edit Your Pofile',
      <EditProfile user={this.state.currentUser} />
    );
  };

  toggleMemberMenu = () => {
    this.setState({ isMemberMenuOpen: !this.state.isMemberMenuOpen });
  };

  openPendingApplications = () => {
    const { onOpenModal } = this.props;
    onOpenModal('Pending Applications', <PendingApplications />);
  };

  handleClickOutside = () => {
    this.setState({ isMemberMenuOpen: false });
  };

  render() {
    const { isAuthenticated, currentUser, isMemberMenuOpen } = this.state;
    return (
      <div className="auth">
        {isAuthenticated ? (
          <>
            <UserAvatar onClick={this.toggleMemberMenu}>
              {currentUser && (
                <UserImage alt={currentUser.email} src={currentUser.avatar} />
              )}
            </UserAvatar>
            {isMemberMenuOpen && (
              <MemberMenu tabIndex="0">
                {currentUser && currentUser.roles.includes('Admin') && (
                  <MemberMenuItem onClick={this.openPendingApplications}>
                    Open pending applications
                  </MemberMenuItem>
                )}
                <MemberMenuItem onClick={this.openProfile}>
                  Edit your profile
                </MemberMenuItem>
                <MemberMenuItem onClick={this.logout}>Logout</MemberMenuItem>
              </MemberMenu>
            )}
          </>
        ) : (
          <LoginArea>
            <LoginAreaItem onClick={this.signup}>Sign up</LoginAreaItem>
            <LoginAreaItem onClick={this.login}>Login</LoginAreaItem>
          </LoginArea>
        )}
      </div>
    );
  }
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

const LoginAreaItem = styled.div`
  font-size: 16px;
  color: #69d5b1;
  cursor: pointer;

  &:hover {
    color: #54aa8d;
  }
`;

const LoginArea = styled.div`
  display: flex;
  margin: 0 20px;

  * {
    margin-left: 20px;
  }
`;

export default onClickOutside(MemberArea);
