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
        follow our Guidelines and our Code of Conduct.
      </p>
    </Body>
  </Modal>
);

SuccessModal.propTypes = {
  username: PropTypes.string,
  type: PropTypes.oneOf(['Mentor', 'Mentee']),
};

export default SuccessModal;
