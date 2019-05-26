import React, { Component } from 'react';
import { getCurrentUser } from '../../api';
import auth from '../../utils/auth'

export default class MemberArea extends Component {
  state = {
    isAuthenticated: auth.isAuthenticated()
  }

  refreshAuthState = (currentUser) => {
    debugger;
    this.setState({
      isAuthenticated: auth.isAuthenticated(),
      currentUser
    })
  }

  logout = () => {
    auth.logout();
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

  loggedIn() {
    return <>
      Current user: {this.state.currentUser && this.state.currentUser.email}
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