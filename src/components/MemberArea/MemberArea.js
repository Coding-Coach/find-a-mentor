import React, { Component } from 'react';
import { getCurrentUser } from '../../api';
import auth from '../../utils/auth';
import EditProfile from './EditProfile';
import PendingApplications from './PendingApplications';

export default class MemberArea extends Component {
  state = {
    isAuthenticated: auth.isAuthenticated(),
  };

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

  async componentDidMount() {
    try {
      await auth.renewSession();
      const currentUser = await getCurrentUser();
      this.refreshAuthState(currentUser);
    } catch (error) {
      console.error('error', error);
    }
  }

  openProfile = () => {
    const { onOpenModal } = this.props;
    onOpenModal(
      'Edit Your Pofile',
      <EditProfile user={this.state.currentUser} />
    );
  };

  openPendingApplications = () => {
    const { onOpenModal } = this.props;
    onOpenModal('Pending Applications', <PendingApplications />);
  };

  loggedIn() {
    const { currentUser } = this.state;
    return (
      <>
        Current user:{' '}
        {currentUser && (
          <span role="button" onClick={this.openProfile}>
            {currentUser.email}{' '}
          </span>
        )}
        {currentUser && currentUser.roles.includes('Admin') && (
          <span role="button" onClick={this.openPendingApplications}>
            Open pending applications
          </span>
        )}
        <button onClick={this.logout}>Logout</button>
      </>
    );
  }

  render() {
    const { isAuthenticated } = this.state;

    return (
      <div className="auth">
        {isAuthenticated ? (
          this.loggedIn()
        ) : (
          <button onClick={() => auth.login()}>Login</button>
        )}
      </div>
    );
  }
}
