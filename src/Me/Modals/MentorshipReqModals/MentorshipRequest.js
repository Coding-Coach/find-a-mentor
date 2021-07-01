import { useState } from 'react';
import styled from 'styled-components';
import { Modal } from '../Modal';
import FormField from '../../components/FormField';
import Textarea from '../../components/Textarea';
import { applyForMentorship, getMyMentorshipApplication } from '../../../api';
import ImageSrc from '../../../assets/mentorshipRequestSuccess.svg';
import Body from './style';

const FormFields = styled.div`
  display: flex;
  justify-content: space-between;
  flex-direction: column;
  align-items: stretch;

  > div {
    &:not(:last-child) {
      margin-bottom: 0;
    }
    &:first-child label {
      margin-top: 0;
    }
  }
`;

const ExtendedFormField = styled(FormField)`
  justify-content: flex-start;

  & label {
    margin-top: 32px;
    color: ${props =>
      props.invalid ? 'var(--form-text-invalid)' : 'var(--form-text-default)'};
  }
`;

const ErrorMessage = styled.div`
  color: var(--form-text-invalid);
`;

const MentorshipRequest = ({ mentor }) => {
  const [confirmed, setConfirmed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [mentorshipRequestDetails, setMentorshipRequestDetails] = useState(
    getMyMentorshipApplication()
  );
  const [errors, setErrors] = useState({});

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
    background: {
      label: 'My Background',
      type: 'longtext',
      defaultValue: mentorshipRequestDetails.background,
      placeholder: 'Tell the mentor about yourself.',
      style: {
        height: '121px',
      },
    },
    expectation: {
      label: 'My Expectations',
      type: 'longtext',
      defaultValue: mentorshipRequestDetails.expectation,
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

  const formField = (fieldName, config, autoFocus) => {
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
              autoFocus={autoFocus}
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
    const _errors = {};
    Object.entries(model).forEach(([field, config]) => {
      if (
        config.validate &&
        !config.validate(mentorshipRequestDetails[field])
      ) {
        _errors[field] = `The ${config.label.toLowerCase()} is required.`;
        isValid = false;
      }
    });

    setErrors(pervState => ({
      ...pervState,
      ..._errors,
      isValid,
    }));

    return isValid;
  };

  const onSubmit = async e => {
    e?.preventDefault();
    if (!validate()) return;
    setIsLoading(true);
    const success = await applyForMentorship(mentor, mentorshipRequestDetails);
    setConfirmed(success);
    setIsLoading(false);
  };

  return (
    <Modal
      title="Mentorship Request"
      onSave={confirmed ? null : onSubmit}
      submitLabel="Send Request"
      isValid={errors?.isValid}
      isLoading={isLoading}
      center
    >
      {confirmed ? (
        <Body>
          <img src={ImageSrc} alt="successfully sent mentorship request" />
          <p>
            Your application has been sent! We will contact you when we hear
            from {mentor.name}
          </p>
        </Body>
      ) : (
        <Body>
          <FormFields>
            {Object.entries(model).map(([fieldName, field], i) =>
              formField(fieldName, field, i === 0)
            )}
          </FormFields>
        </Body>
      )}
    </Modal>
  );
};

export default MentorshipRequest;
