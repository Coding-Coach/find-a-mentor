import React, { useState } from 'react';
import styled from 'styled-components';
import { Modal } from './Modal';
import FormField from '../components/FormField';
import Textarea from '../components/Textarea';
import { desktop } from '../styles/shared/devices';
import { toast } from 'react-toastify';
import { sendMentorshipRequest } from '../../api';
import messages from '../../messages';
import ImageSrc from '../../assets/mentorshipRequestSuccess.svg';

const MentorshipRequestDetails = styled.div`
  margin: 0 auto;
  width: 100%;
  max-width: 52rem;
`;

const MentorshipRequestDetailsForm = styled.form`
  display: flex;
  width: 100%;
`;

const SuccessMentorshipRequest = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const FormFields = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  align-items: stretch;
  padding: 0 5px;
  width: 100%;
`;

const ExtendedFormField = styled(FormField)`
  flex: 1 1 100%;
  /* max-width: 355px; */
  display: flex;
  flex-direction: column;
  justify-content: flex-start;

  & label {
    color: #4f4f4f;
  }

  width: 100%;
  min-width: 15rem;

  @media ${desktop} {
    flex: ${props => (props.customFormField ? '1 1 100%' : '1 1 40%')};
    max-width: ${props => (props.customFormField ? 'unset' : '355px')};
  }
`;

const model = {
  myBackground: {
    label: 'My Background',
    type: 'longtext',
    defaultValue: '',
    placeholder: 'Tell the mentor about yourself.',
  },
  myExpectations: {
    label: 'My Expectations',
    type: 'longtext',
    defaultValue: '',
    placeholder: 'What do you expect from this mentorship?',
  },
  message: {
    label: 'Message',
    type: 'longtext',
    defaultValue: '',
    validate: value => !!value,
    required: true,
    placeholder: 'Anything else you want to say?',
  },
};

const MentorshipRequest = ({ mentor, closeModal }) => {
  const [confirmed, setConfirmed] = useState(false);
  const [mentorshipRequestDetails, setMentorshipRequestDetails] = useState({});

  // text fields onChange function
  const handleInputChange = (fieldName, value) => {
    setMentorshipRequestDetails({
      ...mentorshipRequestDetails,
      [fieldName]: value,
    });
  };

  const formField = (fieldName, config) => {
    switch (config.type) {
      case 'longtext':
        return (
          <ExtendedFormField
            key={fieldName}
            label={config.label}
            helpText={config.helpText}
          >
            <Textarea
              name={fieldName}
              onChange={e => handleInputChange(fieldName, e.target.value)}
              required={config.required}
              placeholder={config.placeholder}
            />
          </ExtendedFormField>
        );
      default:
        return <></>;
    }
  };

  // validate form details
  const validate = () => {
    const errors = [];

    Object.entries(model).forEach(([field, config]) => {
      if (
        config.validate &&
        !config.validate(mentorshipRequestDetails[field])
      ) {
        errors.push(config.label);
      }
    });

    if (errors.length) {
      toast.error(
        `The following fields is missing or invalid: ${errors.join(', ')}`
      );
    }
    return !errors.length;
  };

  const onSubmit = async e => {
    e.preventDefault();
    if (!validate()) {
      return;
    }
    try {
      const requestResult = await sendMentorshipRequest(
        mentor.mentor,
        mentorshipRequestDetails
      );
      if (requestResult) {
        toast.success(messages.CARD_APPLY_REQUEST_SUCCESS);
        setConfirmed(true);
      } else {
        toast.error(messages.GENERIC_ERROR);
      }
    } catch (error) {
      toast.error(messages.GENERIC_ERROR);
    }
  };

  return (
    <Modal
      title="Mentorship Request"
      onSave={confirmed ? null : onSubmit}
      closeModal={closeModal}
      saveText="Send Request"
    >
      <MentorshipRequestDetails>
        {confirmed ? (
          <SuccessMentorshipRequest>
            <img src={ImageSrc} alt="successfully sent mentorship request" />
            <p>
              Your application has been sent! We will contact you when we hear
              from Sarah Smith.
            </p>
          </SuccessMentorshipRequest>
        ) : (
          <MentorshipRequestDetailsForm onSubmit={onSubmit}>
            <FormFields>
              {Object.entries(model).map(([fieldName, field]) =>
                formField(fieldName, field)
              )}
            </FormFields>
          </MentorshipRequestDetailsForm>
        )}
      </MentorshipRequestDetails>
    </Modal>
  );
};

export default MentorshipRequest;
