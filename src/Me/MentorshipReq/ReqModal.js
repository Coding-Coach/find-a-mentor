import React from 'react';
import PropTypes from 'prop-types';
import { ReactComponent as MentorshipSvg } from '../../assets/me/mentorship.svg';
import styled from 'styled-components';
import { Modal } from '../Modals/Modal';

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
`;

const ApprovedModal = username => (
  <Body>
    <MentorshipSvg />
    <p>
      Awesome! You are now Mentoring {username}! Please make sure to follow our
      Guidelines and our Code of Conduct.
    </p>
  </Body>
);

const ReqModal = ({ username, onSubmit }) => {
  return (
    <Modal center title="Mentorship Started">
      <ApprovedModal {...{ username }} />
    </Modal>
  );
};

ReqModal.propTypes = {};

export default ReqModal;
