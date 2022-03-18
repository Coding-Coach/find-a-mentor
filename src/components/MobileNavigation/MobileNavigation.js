import React, { useState } from 'react';
import styled from 'styled-components';
import Modal from '../Modal/Modal';
import Navigation from '../Navigation/Navigation';
import ModalContent from '../Modal/ModalContent';
import LoginNavigation from '../LoginNavigation/LoginNavigation';
import Vercel from '../../assets/powered-by-vercel.svg';

function MobileNavigation(props) {
  const [modal, setModal] = useState({
    title: null,
    content: null,
    onClose: null,
  });

  const VercelStyle = styled.a`
    display: block;
    width: 10px;
    margin: 20px 0 10px;
  `;

  const handleModal = ({ title, content, onClose }) => {
    setModal({ title, content, onClose });
  };

  return (
    <>
      <Modal onClose={modal.onClose} title={modal.title}>
        {modal.content}
      </Modal>

      <Navigation
        isAuthenticated={props.isAuthenticated}
        onOpenModal={(title, content) => handleModal({ title, content })}
      />

      {!props.isAuthenticated && <LoginNavigation />}

      <ContentWrapper>
        <ModalContent
          policyTitle={'Cookies policy'}
          content={'cookies-policy'}
          handleModal={(title, content) => handleModal({ title, content })}
        />
        <ModalContent
          policyTitle={'Code of Conduct'}
          content={'code-conduct'}
          handleModal={(title, content) => handleModal({ title, content })}
        />
        <ModalContent
          policyTitle={'Terms & Conditions'}
          content={'terms-conditions'}
          handleModal={(title, content) => handleModal({ title, content })}
        />
        <ModalContent
          policyTitle={'Privacy Statement'}
          content={'privacy-policy'}
          handleModal={(title, content) => handleModal({ title, content })}
        />
        <VercelStyle
          href="https://vercel.com/?utm_source=[coding-coach]&utm_campaign=oss"
          className="vercel-link"
          rel="noopener noreferrer"
          target="_blank"
        >
          <Vercel />
        </VercelStyle>
      </ContentWrapper>
    </>
  );
}

const ContentWrapper = styled.ul`
  line-height: 2.5rem;
  font-size: 16px;
  list-style: none;
  position: absolute;
  bottom: 1rem;
  left: inherit;
  cursor: pointer;
`;

export default MobileNavigation;
