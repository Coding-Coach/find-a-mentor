import React, { Component, PureComponent } from 'react';
import OffCanvas from 'react-aria-offcanvas';
import './Header.css';


class Navigation extends PureComponent {
  render () {
    return (
      <nav id="menu" className="header-nav">
    <ul>
      <li>
        <a href="https://mentors.codingcoach.io/">Home</a>
      </li>
      <li>
        <a href="https://codingcoach.io/">About</a>
      </li>
      <li>
        <a href="https://docs.google.com/document/d/1zKCxmIh0Sd4aWLiQncICOGm6uf38S0kJ0xb0qErNFVA/edit?usp=sharing">How it works</a>
      </li>
      <li>
        <a href="https://github.com/Coding-Coach/find-a-mentor">Become a Mentor</a>
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