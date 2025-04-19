import { useState } from 'react';
import { Modal } from './Modal';
import styled from 'styled-components';

export const RedirectToGravatar = () => {
  const [isModalOpen, setModalOpen] = useState(false);
  const openModal = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
  };

  const handleProceed = () => {
    window.open('https://gravatar.com', '_blank', 'noopener,noreferrer');
    closeModal();
  };

  return (
    <>
      <a
        onClick={openModal}
        href="https://gravatar.com"
        target="_blank"
        rel="noopener noreferrer"
      >
        Gravatar
      </a>
      {isModalOpen && (
        <Modal
          title="Change Avatar"
          onClose={closeModal}
          submitLabel="Proceed"
          onSave={handleProceed}
          center={true}
        >
          <Content>
            We’ll take you to Gravatar.com to update your avatar
            <br />
            Don’t have an account? You're a developer, you'll manage 😉
            <br />
            Once you make a change, your new look will show up here once
            Gravatar's cache expires
          </Content>
        </Modal>
      )}
    </>
  );
};

const Content = styled.div`
  font-size: 1.2rem;
  line-height: 1.3;
`;
