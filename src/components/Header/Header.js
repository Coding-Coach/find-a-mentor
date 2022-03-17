import React, { useState, useContext } from 'react';
import styled from 'styled-components';
import OffCanvas from 'react-aria-offcanvas';
import Modal from '../Modal/Modal';
import MemberArea from '../MemberArea/MemberArea';
import { report } from '../../ga';
import Logo from '../Logo';
import Title from '../SiteTitle';
import Navigation from '../Navigation/Navigation';
import MobileNavigation from '../MobileNavigation/MobileNavigation';
import { AuthContext } from '../../context/authContext/AuthContext';
import { useDeviceType } from '../../hooks/useDeviceType';

function Header() {
  const [modal, setModal] = useState({
    title: null,
    content: null,
    onClose: null,
  });
  const [isOpen, setIsOpen] = useState(false);
  const { isDesktop } = useDeviceType();
  const auth = useContext(AuthContext);
  const authenticated = auth.isAuthenticated();

  const handleModal = ({ title, content, onClose }) => {
    setModal({ title, content, onClose });
    report('Modal', 'open', title);
  };

  return (
    <HeaderWrapper>
      <LogoTitleWrapper>
        <LogoWrapper>
          <LogoLink href="https://codingcoach.io/">
            <Logo />
          </LogoLink>
        </LogoWrapper>
        {isDesktop && <Title />}
      </LogoTitleWrapper>

      {isDesktop ? (
        <>
          <Navigation
            isAuthenticated={authenticated}
            onOpenModal={(title, content) => handleModal({ title, content })}
          />
        </>
      ) : (
        <>
          <Open
            className="fa fa-bars"
            aria-hidden="true"
            id="menu-button"
            aria-label="Menu"
            aria-controls="menu"
            aria-expanded={isOpen}
            onClick={() => setIsOpen(true)}
            isAuthenticated={authenticated}
          />
          <HeaderOffCanvas
            isOpen={isOpen}
            onClose={() => setIsOpen(false)}
            labelledby="menu-button"
            width="100%"
            height="100%"
          >
            <Close
              className="fa fa-times"
              aria-hidden="true"
              onClick={() => setIsOpen(false)}
              aria-label="Close"
            />
            <MobileNavigation isAuthenticated={authenticated} />
          </HeaderOffCanvas>
        </>
      )}

      <MemberArea
        onOpenModal={(title, content) => handleModal({ title, content })}
      />
      <Modal onClose={modal.onClose} title={modal.title}>
        {modal.content}
      </Modal>
    </HeaderWrapper>
  );
}

const common = {
  headerHeight: 90,
};

const HeaderWrapper = styled.header`
  position: sticky;
  top: 0;
  height: ${common.headerHeight}px;
  display: flex;
  align-items: center;
  border-bottom: 1px solid #dadada;
  z-index: 3;
  background: #fff;
`;

const LogoTitleWrapper = styled.div`
  display: flex;
  align-items: center;
  margin-right: 20px;
  height: ${common.headerHeight}px;
  width: 320px;
`;

const LogoWrapper = styled.div`
  margin: 0 10px;
`;

const LogoLink = styled.a``;

const HeaderOffCanvas = styled(OffCanvas)`
  outline: currentcolor none 0;
  background: #00e5b3;
  transition: transform 0.25s ease-out 0s;
  visibility: visible;
  color: white;
  display: block;
  -webkit-overflow-scrolling: touch;
  will-change: transform;
  backface-visibility: hidden;
  transition-duration: 0.2s !important;
  transition-property: -ms-transform, transform, transform;
  transition-timing-function: ease-out;
  transform: translateY(0px);
`;

const Open = styled.i`
  font-size: 38px;
  color: #05345e;
  padding: 10px 15px 0 15px;
  position: absolute;
  top: 15px;
  right: ${({ isAuthenticated }) => (isAuthenticated ? '70px' : '10px')};
  z-index: 100;

  &:hover {
    color: #69d5b1;
    transition-duration: 0.2s;
    transition-property: -ms-transform, transform, transform;
    transition-timing-function: ease-out;
  }
`;

const Close = styled.i`
  font-size: 38px;
  color: #ffffff;
  padding: 10px 15px 0 15px;
  position: absolute;
  display: block;
  top: 15px;
  right: 10px;

  &:hover {
    color: #05345e;
    transition-duration: 0.2s;
    transition-property: -ms-transform, transform, transform;
    transition-timing-function: ease-out;
  }
`;

export default Header;
