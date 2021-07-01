import BodyStyle from './style';
import { useRef, useState } from 'react';
import { Modal } from '../Modal';
import TextArea from '../../components/Textarea';
import styled from 'styled-components';
import FormField from '../../components/FormField';

const Body = styled(BodyStyle)`
  justify-content: flex-start;
  p {
    text-align: left;
  }
`;

type DeclineModalProps = {
  username: string;
  onSave(message: string | null): void;
  onClose(): void;
};

const DeclineModal = ({ username, onSave, onClose }: DeclineModalProps) => {
  const [loadingState, setLoadingState] = useState(false);
  const message = useRef<string | null>(null);

  return (
    <Modal
      center
      title="Decline Mentorship"
      onClose={onClose}
      isLoading={loadingState}
      submitLabel="Decline"
      onSave={() => {
        setLoadingState(true);
        onSave(message.current);
      }}
    >
      <Body>
        <div>
          <p>
            You have declined <b>{username}</b> and that’s ok, now is not a good
            time!
          </p>
          <p>
            As a courtesy, please let {username} know why you are declining the
            mentorship.
          </p>
          <FormField label="Reason">
            <TextArea
              onChange={({ target }) => {
                message.current = target.value;
              }}
              placeholder="I'm declining the mentorship because..."
              cols={35}
              rows={7}
            />
          </FormField>
        </div>
      </Body>
    </Modal>
  );
};

export default DeclineModal;
