import React, { Component, Fragment } from 'react';
import OffCanvas from 'react-aria-offcanvas';
import './Header.css';




class Navigation extends Component {
  render() {
    const { navClass, navMenuClass } = this.props
    return (
      <nav id="menu" className={navClass}>
        <ul className={navMenuClass}>
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
      </nav>
    );
  }
}

class MobileNavigationWrapper extends Component {
  render() {
    return (
      <Fragment>
        <Navigation navClass={"m-header-nav"} navMenuClass={"m-header-nav__menu"}/>

        <ul className="m-header-nav__modal">
          <li>Cookies Policy</li>
          <li>Code of Conduct</li>
          <li>Terms & Conditions</li>
          <li>Privacy Statement</li>
        </ul>
      </Fragment>
    );
  }
}

export default class Header extends Component {
  state = {
    isOpen: false,
    isDesktop: false,
    isMobile: false
  };

  _handleOpen = () => {
    this.setState({ isOpen: true });
  };

  _handleClose = () => {
    this.setState({ isOpen: false });
  };

  render() {
    // const { navClass, navMenuClass } = this.props
    return (
      <>
        <i
          className="fa fa-bars m-header-nav__open"
          aria-hidden="true"
          id="menu-button"
          aria-label="Menu"
          aria-controls="menu"
          aria-expanded={this.state.isOpen}
          onClick={this._handleOpen}
        >
          {' '}
        </i>

        <Navigation navClass={""} navMenuClass={""}/>

          <OffCanvas
            isOpen={this.state.isOpen}
            onClose={this._handleClose}
            labelledby="menu-button"
            width="100%"
            height="100%"
            className="header-offcanvas"
          >
            <i
              className="fa fa-times m-header-nav__close"
              aria-hidden="true"
              onClick={this._handleClose}
              aria-label="Close"
            />
            <MobileNavigationWrapper />
          </OffCanvas>
      </>
    );
  }
}
