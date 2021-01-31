import BodyStyle from './style';
import React, { useRef, useState } from 'react';
import { Modal } from '../Modal';
import PropTypes from 'prop-types';
import TextArea from '../../components/Textarea';
import { Loader } from '../../../components/Loader';
import styled from 'styled-components';

const Spinner = styled(Loader)`
  position: absolute;
  top: 25%;
`;

const Body = styled(BodyStyle)`
  justify-content: flex-start;
  p {
    text-align: left;
  }
`;

const DeclinedModal = ({ username, onSave, onClose, closeModal }) => {
  const [loadingState, setLoadingState] = useState(null);
  const msg = useRef(null);

  return (
    <Modal
      center
      title="Mentorship Declined"
      onSave={() => {
        setLoadingState(true);
        onSave(msg.current);
      }}
      closeModal={() => {
        onClose();
        closeModal();
      }}
    >
      <Body>
        {loadingState && <Spinner />}
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
              onChange={({ target }) => (msg.current = target.value)}
              placeholder="Short explanation why the rejection."
              cols="35"
              rows="7"
            />
          </label>
        </div>
      </Body>
    </Modal>
  );
};

DeclinedModal.propTypes = {
  username: PropTypes.string,
};

export default DeclinedModal;
