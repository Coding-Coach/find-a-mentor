import Body from './style';
import React from 'react';
import { Modal } from '../Modal';
import PropTypes from 'prop-types';
import { ReactComponent as MenteeSvg } from '../../../assets/me/mentee.svg';
import { ReactComponent as MentorshipSvg } from '../../../assets/me/mentorship.svg';

const MentorModal = ({ username }) => (
  <>
    <MentorshipSvg />
    <p>
      Awesome! You are now Mentoring <b>{username}!</b> Please make sure to
      follow our Guidelines and our Code of Conduct.
    </p>
  </>
);

const MenteeModal = ({ username }) => (
  <>
    <MenteeSvg />
    <p>
      Your application has been sent! We will contact you when we hear from{' '}
      <b>{username}</b>.
    </p>
  </>
);

const SuccessModal = ({ username, type, onClose, closeModal }) => (
  <Modal
    center
    title="Mentorship Started"
    closeModal={() => {
      onClose();
      closeModal();
    }}
  >
    <Body>
      {type === 'Mentor' ? (
        <MentorModal {...{ username }} />
      ) : (
        <MenteeModal {...{ username }} />
      )}
    </Body>
  </Modal>
);

SuccessModal.propTypes = {
  username: PropTypes.string,
  type: PropTypes.oneOf(['Mentor', 'Mentee']),
};

export default SuccessModal;
