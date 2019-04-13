import React, { Component, PureComponent } from 'react';
import OffCanvas from 'react-aria-offcanvas';
import './Header.css';


class Navigation extends PureComponent {
  render () {
    return (
      <nav id="menu" className="header-nav">
    <ul>
      <li>
        <a href="#m-i-1">Home</a>
      </li>
      <li>
        <a href="#m-i-2">About</a>
      </li>
      <li>
        <a href="#m-i-3">How it works</a>
      </li>
      <li>
        <a href="#m-i-4">Become a Mentor</a>
      </li>
    </ul>
  </nav>

    )
  }
}


export default class Header extends Component {
  state = {
    isOpen: false,
  };

  _handleOpen = () => {
    this.setState({ isOpen: true });
  };

  _handleClose = () => {
    this.setState({ isOpen: false });
  };

  render() {
    return (
      <>
      <i  class="fa fa-bars" 
          aria-hidden="true"
          id="menu-button"
          aria-label="Menu"
          aria-controls="menu"
          aria-expanded={this.state.isOpen}
          onClick={this._handleOpen}> Menu
      </i>

        <OffCanvas
          isOpen={this.state.isOpen}
          onClose={this._handleClose}
          labelledby="menu-button"
          width="100vw"
          height="100vh"
          className="header-offcanvas"
        >

      <i  class="fa fa-times" 
          aria-hidden="true"
          onClick={this._handleClose}
          aria-label="Close"
      ></i>

          <Navigation />
        </OffCanvas>
      </>
    );
  }
}