import Body from './style';
import React from 'react';
import { Modal } from '../Modal';
import PropTypes from 'prop-types';
import { ReactComponent as MentorshipSvg } from '../../../assets/me/mentorship.svg';

const ApprovedModal = ({ username, onClose, closeModal }) => (
  <Modal
    center
    title="Mentorship Started"
    closeModal={() => {
      onClose();
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

ApprovedModal.propTypes = {
  username: PropTypes.string,
};

export default ApprovedModal;
