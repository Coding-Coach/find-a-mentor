import { useState } from 'react';
import styled from 'styled-components';
import { Modal } from '../Modal';
import FormField from '../../components/FormField';
import Textarea from '../../components/Textarea';
import MentorshipRequestSuccess from '../../../assets/mentorshipRequestSuccess.svg';
import Body from './style';
import { links } from '../../../config/constants';
import { useApi } from '../../../context/apiContext/ApiContext';

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
  }
`;

const ErrorMessage = styled.div`
  color: var(--form-text-invalid);
`;

const MentorshipRequest = ({ mentor }) => {
  const api = useApi();
  const [confirmed, setConfirmed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [mentorshipRequestDetails, setMentorshipRequestDetails] = useState(
    api.getMyMentorshipApplication()
  );
  const [errors, setErrors] = useState({});

  const handleInputChange = (e) => {
    const {
      target: { name: fieldName, value },
    } = e;
    setMentorshipRequestDetails({
      ...mentorshipRequestDetails,
      [fieldName]: value,
    });
  };

  const commonProps = {
    type: 'longtext',
    required: true,
    minLength: 30,
    validate: (value) => value.length >= 30,
    helpText: 'Minimum 30 characters',
    style: {
      height: '121px',
    },
  };

  const model = {
    background: {
      ...commonProps,
      label: 'My Background',
      defaultValue: mentorshipRequestDetails.background,
      placeholder: 'Tell the mentor about yourself.',
    },
    expectation: {
      ...commonProps,
      label: 'My Expectations',
      defaultValue: mentorshipRequestDetails.expectation,
      placeholder: 'What do you expect from this mentorship?',
    },
    message: {
      ...commonProps,
      label: 'Message',
      defaultValue: mentorshipRequestDetails.message,
      placeholder: 'Anything else you want to say?',
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
              style={config.style}
              invalid={errors[fieldName]}
              minLength={config.minLength}
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

  const validate = () => {
    const _errors = {};
    Object.entries(model).forEach(([field, config]) => {
      if (
        config.validate &&
        !config.validate(mentorshipRequestDetails[field])
      ) {
        _errors[
          field
        ] = `"${config.label}" should be longer than 30 characters`;
      }
    });

    setErrors(_errors);
    return Object.keys(_errors).length === 0;
  };

  const onSubmit = async (e) => {
    e?.preventDefault();
    if (!validate()) return;
    setIsLoading(true);
    const success = await api.applyForMentorship(
      mentor,
      mentorshipRequestDetails
    );
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
          <MentorshipRequestSuccess />
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
          <ul>
            <li>
              It's important to include all the relevant details so the mentor
              will understand who you are, where you stand and what you're
              looking for. Once you finish, please read it to make sure you
              havn't miss anything.
            </li>
            <li>
              <span>
                If you haven't read our {/* eslint-disable-next-line */}
                <a target="_blank" href={links.MENTORSHIP_GUIDELINES}>
                  Mentorship Guidelines
                </a>
                , now is the a good time
              </span>
            </li>
          </ul>
        </Body>
      )}
    </Modal>
  );
};

export default MentorshipRequest;
