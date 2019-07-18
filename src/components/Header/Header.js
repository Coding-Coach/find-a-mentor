import React, { Component, Fragment } from 'react';
import styled from 'styled-components';
import OffCanvas from 'react-aria-offcanvas';
import debounce from 'lodash/debounce';
import ModalContent from '../Modal/ModalContent';
import './Header.css';
import Modal from '../Modal/Modal';
import MemberArea from '../MemberArea/MemberArea';
import { report } from '../../ga';
import Logo from '../Logo';
import Title from '../SiteTitle';
import Navigation from './Navigation';

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
        onClose,
      },
    });
  };

  render() {
    const { modal } = this.state;
    return (
      <Fragment>
        <Modal onClose={this.closeModal} title={modal.title}>
          {modal.content}
        </Modal>

        <Navigation />

        <ul className="m-header-nav__modal">
          <ModalContent
            policyTitle={'Cookies policy'}
            content={'cookies-policy'}
            handleModal={(title, content) => this.handleModal(title, content)}
          />
          <ModalContent
            policyTitle={'Code of Conduct'}
            content={'code-conduct'}
            handleModal={(title, content) => this.handleModal(title, content)}
          />
          <ModalContent
            policyTitle={'Terms & Conditions'}
            content={'terms-conditions'}
            handleModal={(title, content) => this.handleModal(title, content)}
          />
          <ModalContent
            policyTitle={'Privacy Statement'}
            content={'privacy-policy'}
            handleModal={(title, content) => this.handleModal(title, content)}
          />
        </ul>
      </Fragment>
    );
  }
}

class Header extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isOpen: false,
      isDesktop: false,
      modal: {
        title: null,
        content: null,
        onClose: null,
      },
    };
  }

  handleModal = (title, content, onClose) => {
    this.setState({
      modal: {
        title,
        content,
        onClose,
      },
    });
    report('Modal', 'open', title);
  };

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
    if (window) {
      this.setState({
        isDesktop: window.innerWidth >= 800,
      });
    }
  };

  render() {
    const { isDesktop, isOpen } = this.state;
    return (
      <HeaderWrapper>
        <LogoTitleWrapper>
          <LogoWrapper>
            <Logo />
          </LogoWrapper>
          {isDesktop && (
            <TitleWrapper>
              <Title />
            </TitleWrapper>
          )}
        </LogoTitleWrapper>

        {isDesktop ? (
          <>
            <Navigation />
          </>
        ) : (
          <>
            <i
              className="fa fa-bars m-header-nav__open"
              aria-hidden="true"
              id="menu-button"
              aria-label="Menu"
              aria-controls="menu"
              aria-expanded={isOpen}
              onClick={this._handleOpen}
            />
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
        )}

        <MemberArea
          onOpenModal={(title, content) => this.handleModal(title, content)}
        />
        <Modal onClose={this.closeModal} title={this.state.modal.title}>
          {this.state.modal.content}
        </Modal>
      </HeaderWrapper>
    );
  }
}

const HeaderWrapper = styled.header`
  position: sticky;
  top: 0;
  height: 90px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid #dadada;
`;

const LogoTitleWrapper = styled.div`
  display: flex;
  align-items: center;
  margin-right: 20px;
`;

const TitleWrapper = styled.div`
  width: 100px;
  margin-top: -15px;
  margin-left: -30px;
`;

const LogoWrapper = styled.div`
  width: 180px;
  margin-left: -30px;
`;

export default Header;
