import React from 'react';
import PropTypes from 'prop-types';
import { ReactComponent as MentorshipSvg } from '../../assets/me/mentorship.svg';
import styled from 'styled-components';
import { Modal } from '../Modals/Modal';
import TextArea from '../components/Textarea';

const Body = styled.div`
  height: 415px;
  padding: 0 1.8rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  p {
    width: 285px;
    text-align: center;
  }

  p,
  label > b {
    display: block;
    margin-bottom: 7px;
    color: #4f4f4f;
  }
`;

const ApprovedModal = ({ username }) => (
  <Body>
    <MentorshipSvg />
    <p>
      Awesome! You are now Mentoring <b>{username}!</b> Please make sure to
      follow our Guidelines and our Code of Conduct.
    </p>
  </Body>
);
const DeclinedModal = ({ username }) => (
  <Body>
    <div>
      <p>
        You have rejected <b>{username}</b> and that’s ok, now is not a good
        time!
      </p>
      <p>
        As a courtesy, please let John Doe know why you are rejecting the
        mentorship.
      </p>
      <label>
        <b>Reason</b>
        <TextArea
          placeholder="Short explanation why the rejection."
          cols="35"
          rows="7"
        />
      </label>
    </div>
  </Body>
);

const ReqModal = ({ isApproved, username, onSubmit, onClose, closeModal }) => {
  return (
    <Modal
      center
      title={isApproved ? 'Mentorship Started' : 'Mentorship Declined'}
      onSave={onSubmit}
      closeModal={() => {
        onClose();
        closeModal();
      }}
    >
      {isApproved ? (
        <ApprovedModal {...{ username }} />
      ) : (
        <DeclinedModal {...{ username }} />
      )}
    </Modal>
  );
};

ReqModal.propTypes = {};

export default ReqModal;
