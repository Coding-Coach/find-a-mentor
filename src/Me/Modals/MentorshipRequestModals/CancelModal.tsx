import BodyStyle from './style';
import { useRef, useState } from 'react';
import { Modal } from '../Modal';
import TextArea from '../../components/Textarea';
import styled from 'styled-components';
import FormField from '../../components/FormField';
import RadioButton, { RadioButtonGroup } from '../../components/RadioButton';

const Body = styled(BodyStyle)`
  justify-content: flex-start;
  p {
    text-align: left;
  }
`;

type CanceledModalProps = {
  username: string;
  onSave(reason: string): void;
  onClose(): void;
};

const REASONS = {
  '1': `I've already found a mentor`,
  '2': `I'm no longer looking for a mentor`,
  '3': `Other`,
};

type Reason = keyof typeof REASONS;

const CancelModal = ({ username, onSave, onClose }: CanceledModalProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [reasonOption, setReasonOption] = useState<Reason>('1');
  const reason = useRef<string>('');

  return (
    <Modal
      center
      title="Cancel mentorship request"
      onClose={onClose}
      isLoading={isLoading}
      submitLabel="Cancel"
      onSave={() => {
        setIsLoading(true);
        onSave(reasonOption === '3' ? reason.current : REASONS[reasonOption]);
      }}
    >
      <Body>
        <p>
          You are about to cancel your mentorship request to <b>{username}</b>{' '}
          and that’s ok.
        </p>
        <p>Please let {username} know why you are canceling the request.</p>
        <label>
          <FormField label="">
            <RadioButtonGroup<Reason>
              value={reasonOption}
              onChange={setReasonOption}
            >
              {Object.entries(REASONS).map(([value, label]) => (
                <RadioButton
                  key={value}
                  name="reason"
                  LabelComponent={label}
                  value={value}
                />
              ))}
            </RadioButtonGroup>
          </FormField>
          <TextArea
            onChange={e => {
              reason.current = e.target.value;
            }}
            disabled={reasonOption !== '3'}
            placeholder="I'm canceling the mentorship because..."
            cols={35}
            rows={7}
          />
        </label>
      </Body>
    </Modal>
  );
};

export default CancelModal;
