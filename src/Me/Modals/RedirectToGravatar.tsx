import { useState } from 'react';
import { Modal } from './Modal';

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
          <p>
            You will be redirected to Gravatar.com to change your avatar.
            <br />
            Note that it may take a few minutes for the changes to reflect.
          </p>
        </Modal>
      )}
    </>
  );
};
