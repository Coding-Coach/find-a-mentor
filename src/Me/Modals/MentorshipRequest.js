import React, { useState } from 'react';
import styled from 'styled-components';
import { Modal } from './Modal';
import FormField from '../components/FormField';
import Textarea from '../components/Textarea';
import { toast } from 'react-toastify';
import { applyForMentorship, getMyMentorshipApplication } from '../../api';
import messages from '../../messages';
import ImageSrc from '../../assets/mentorshipRequestSuccess.svg';
import { desktop } from '../styles/shared/devices';

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

  p {
    max-width: 24rem;
  }
`;

const FormFields = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  align-items: stretch;
  padding: 0 1.5rem;
  width: 100%;
`;

const ExtendedFormField = styled(FormField)`
  flex: 1 1 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;

  & label {
    color: ${props =>
      props.invalid ? 'var(--form-text-invalid)' : 'var(--form-text-default)'};
  }

  @media ${desktop} {
    flex-basis: 49%;
    padding: 0.5rem;
  }
`;

const ErrorMessage = styled.div`
  color: var(--form-text-invalid);
`;

const MentorshipRequest = ({ mentor, closeModal }) => {
  const [confirmed, setConfirmed] = useState(false);
  const [mentorshipRequestDetails, setMentorshipRequestDetails] = useState(
    getMyMentorshipApplication()
  );
  const [errors, setErrors] = useState({});

  // text fields onChange function
  const handleInputChange = e => {
    const {
      target: { name: fieldName, value },
    } = e;
    setMentorshipRequestDetails({
      ...mentorshipRequestDetails,
      [fieldName]: value,
    });
  };

  const model = {
    myBackground: {
      label: 'My Background',
      type: 'longtext',
      defaultValue: mentorshipRequestDetails.myBackground,
      placeholder: 'Tell the mentor about yourself.',
      style: {
        height: '121px',
      },
    },
    myExpectations: {
      label: 'My Expectations',
      type: 'longtext',
      defaultValue: mentorshipRequestDetails.myExpectations,
      placeholder: 'What do you expect from this mentorship?',
      style: {
        height: '121px',
      },
    },
    message: {
      label: 'Message',
      type: 'longtext',
      defaultValue: mentorshipRequestDetails.message,
      validate: value => !!value,
      required: true,
      placeholder: 'Anything else you want to say?',
      style: {
        height: '121px',
      },
    },
  };

  const formField = (fieldName, config) => {
    switch (config.type) {
      case 'longtext':
        return (
          <ExtendedFormField
            key={fieldName}
            label={config.label}
            helpText={config.helpText}
            invalid={errors[fieldName]}
          >
            <Textarea
              name={fieldName}
              onChange={handleInputChange}
              required={config.required}
              placeholder={config.placeholder}
              value={config.defaultValue}
              style={{
                ...config.style,
                borderColor: errors[fieldName] && 'var(--form-text-invalid)',
              }}
              invalid={errors[fieldName]}
            />
            {errors[fieldName] && (
              <ErrorMessage>{errors[fieldName]}</ErrorMessage>
            )}
          </ExtendedFormField>
        );
      default:
        return <></>;
    }
  };

  // validate form details
  const validate = () => {
    let isValid = true;
    Object.entries(model).forEach(([field, config]) => {
      if (
        config.validate &&
        !config.validate(mentorshipRequestDetails[field])
      ) {
        setErrors(pervState => ({
          ...pervState,
          [field]: `The ${config.label.toLowerCase()} is required.`,
        }));
        isValid = false;
      }
    });
    return isValid;
  };

  const onSubmit = async e => {
    e.preventDefault();
    if (!validate()) return;
    try {
      const result = await applyForMentorship(mentor, mentorshipRequestDetails);
      if (result) setConfirmed(true);
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
              from {mentor.name}
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
