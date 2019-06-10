import React, { Component } from 'react';
import { getCurrentUser } from '../../api';
import auth from '../../utils/auth'
import EditProfile from './EditProfile';

export default class MemberArea extends Component {
  state = {
    isAuthenticated: auth.isAuthenticated()
  }

  refreshAuthState = (currentUser) => {
    this.setState({
      isAuthenticated: auth.isAuthenticated(),
      currentUser
    })
  }

  logout = () => {
    auth.doLogout();
    this.refreshAuthState();
  }

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
    const { onEditProfile } = this.props;
    onEditProfile(
      'Edit Your Pofile',
      <EditProfile
        user={this.state.currentUser}
      />
    )
  }

  loggedIn() {
    return <>
      Current user: {this.state.currentUser &&
        <span role="button" onClick={this.openProfile}>{this.state.currentUser.email}</span>
      }
      <button onClick={this.logout}>Logout</button>
    </>;
  }

  render() {
    const { isAuthenticated } = this.state;

    return (
      <div className="auth">
        {
          isAuthenticated ?
          this.loggedIn() :
          <button onClick={() => auth.login()}>Login</button>
        }
      </div>
    )
  }
}