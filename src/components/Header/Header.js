import React, { Component, PureComponent } from 'react';
import OffCanvas from 'react-aria-offcanvas';
import './Header.css';

class Navigation extends PureComponent {
  openModal = (title, content, onClose) => {
    this.setState({
      modal: {
        title,
        content,
        onClose,
      },
    });
  };
  render() {
    return (
      <nav id="menu" className="header-nav">
        <ul className="header-nav__menu">
          <li>
            <a href="https://mentors.codingcoach.io/">Home</a>
          </li>
          <li>
            <a href="https://codingcoach.io/">About</a>
          </li>
          <li>
            <a href="https://docs.google.com/document/d/1zKCxmIh0Sd4aWLiQncICOGm6uf38S0kJ0xb0qErNFVA/edit?usp=sharing">
              How it works
            </a>
          </li>
          <li>
            <a href="https://github.com/Coding-Coach/find-a-mentor">
              Become a Mentor
            </a>
          </li>
        </ul>

        <ul className="header-nav__modal">
          <li>Cookies Policy</li>
          <li>Code of Conduct</li>
          <li>Terms & Conditions</li>
          <li>Privacy Statement</li>
        </ul>
      </nav>
    );
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
        <i
          className="fa fa-bars header-nav__open"
          aria-hidden="true"
          id="menu-button"
          aria-label="Menu"
          aria-controls="menu"
          aria-expanded={this.state.isOpen}
          onClick={this._handleOpen}
        >
          {' '}
        </i>

        <OffCanvas
          isOpen={this.state.isOpen}
          onClose={this._handleClose}
          labelledby="menu-button"
          width="100vw"
          height="100vh"
          className="header-offcanvas"
        >
          <i
            className="fa fa-times header-nav__close"
            aria-hidden="true"
            onClick={this._handleClose}
            aria-label="Close"
          />

          <Navigation />
        </OffCanvas>
      </>
    );
  }
}
