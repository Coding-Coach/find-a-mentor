import Body from './style';
import React from 'react';
import { Modal } from '../Modal';
import PropTypes from 'prop-types';
import { ReactComponent as MentorshipSvg } from '../../../assets/me/mentorship.svg';

const SuccessModal = ({ username, onClose, closeModal }) => (
  <Modal
    center
    title="Mentorship Started"
    closeModal={() => {
      onClose && onClose();
      closeModal();
    }}
  >
    <Body>
      <MentorshipSvg />
      <p>
        Awesome! You are now Mentoring <b>{username}!</b> Please make sure to
        follow our{' '}
        <a
          href="https://docs.google.com/document/d/1zKCxmIh0Sd4aWLiQncICOGm6uf38S0kJ0xb0qErNFVA/edit"
          target="_blank"
          rel="noreferrer"
        >
          Guidelines
        </a>{' '}
        and our{' '}
        <a
          href="https://github.com/Coding-Coach/find-a-mentor/blob/master/CODE_OF_CONDUCT.md#our-standards"
          target="_blank"
          rel="noreferrer"
        >
          Code of Conduct
        </a>
        .
      </p>
    </Body>
  </Modal>
);

SuccessModal.propTypes = {
  username: PropTypes.string,
  type: PropTypes.oneOf(['Mentor', 'Mentee']),
};

export default SuccessModal;
