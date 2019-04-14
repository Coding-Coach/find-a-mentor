import React, { Component, Fragment } from 'react';
import OffCanvas from 'react-aria-offcanvas';
import debounce from 'lodash/debounce'
import ModalContent from '../Modal/ModalContent'
import './Header.css';
import Modal from '../Modal/Modal';

class Navigation extends Component {
  render() {
    const { navClass, navMenuClass } = this.props;
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

  state = {
    modal: {
      title: null,
      content: null,
      onClose: null,
    },
  };

  handleModal = (title, content, onClose) => {
    this.setState({
    modal: {
      title,
      content,
      onClose
    },
  });
}
  render() {
    const { modal } = this.state;
    return (
      <Fragment>
        <Modal onClose={this.closeModal} title={modal.title}>
          {modal.content}
        </Modal>

        <Navigation
          navClass={'m-header-nav'}
          navMenuClass={'m-header-nav__menu'}
        />

        <ul className="m-header-nav__modal">
          <ModalContent policyTitle={'Cookies policy'} content={"cookies-policy"} handleModal={(title, content) => this.handleModal(title, content)} />
          <ModalContent policyTitle={'Code of Conduct'} content={"code-conduct"} handleModal={(title, content) => this.handleModal(title, content)} />
          <ModalContent policyTitle={'Terms & Conditions'} content={"terms-conditions"} handleModal={(title, content) => this.handleModal(title, content)} />
          <ModalContent policyTitle={'Privacy Statement'} content={"privacy-policy"} handleModal={(title, content) => this.handleModal(title, content)} />
        </ul>
      </Fragment>
    );
  }
}

export default class Header extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isOpen: false,
      isDesktop: false
    };
  }

  _handleOpen = () => {
    this.setState({ isOpen: true });
  };

  _handleClose = () => {
    this.setState({ isOpen: false });
  };

  componentDidMount() {
    this._defineViewport();
    window.addEventListener('resize', debounce(this._defineViewport, 250));
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this._defineViewport);
  }

  _defineViewport = () => {
    this.setState({
      isDesktop: window.innerWidth >= 567
    });
  };

  render() {
    const { isDesktop, isOpen } = this.state;
    return (
      <>
        {isDesktop ? (
          <Navigation
            navClass={'d-header-nav'}
            navMenuClass={'d-header-nav__menu'}
          />
          
        ) : (
          <i
            className="fa fa-bars m-header-nav__open"
            aria-hidden="true"
            id="menu-button"
            aria-label="Menu"
            aria-controls="menu"
            aria-expanded={isOpen}
            onClick={this._handleOpen}
          >
          Menu
          </i>
        )}

        <OffCanvas
          isOpen={isOpen}
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
