import { useState } from 'react';
import styled from 'styled-components';

import { report } from '../../ga';
import messages from '../../messages';
import { useUser } from '../../context/userContext/UserContext';
import { Modal } from './Modal';
import FormField from '../components/FormField';
import Input from '../components/Input';
import Textarea from '../components/Textarea';
import Select from '../components/Select';
import Checkbox from '../components/Checkbox';
import { desktop } from '../styles/shared/devices';
import { mentorFields, ModelConfig, userFields } from './model';
import { fromMtoVM, fromVMtoM, UserVM } from '../../helpers/user';
import Button from '../components/Button';
import { toast } from 'react-toastify';
import { User } from '../../types/models';
import { SelectProps } from '../components/Select/Select';
import { useApi } from '../../context/apiContext/ApiContext';

type EditMentorDetailsProps = {
  userDetails: User;
  isLoading: boolean;
  updateMentor: (userInfo: User) => void;
};

const EditDetails = styled.div`
  margin: 0 auto;
  width: 100%;
  max-width: 780px;
`;

const EditDetailsForm = styled.form`
  display: flex;
  width: 100%;
`;

const FormFields = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  align-items: stretch;
  padding: 0 5px;
  width: 100%;
`;

const ExtendedFormField = styled(FormField)<{ customFormField?: boolean }>`
  flex: 1 1 100%;
  max-width: 355px;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;

  & label {
    color: #4f4f4f;
  }

  @media ${desktop} {
    flex: ${props => (props.customFormField ? '1 1 100%' : '1 1 40%')};
    max-width: ${props => (props.customFormField ? 'unset' : '355px')};
  }
`;

const InnerFieldsContainer = styled.div`
  display: flex;
  flex-flow: row wrap;
  justify-content: space-between;
  align-items: stretch;
`;

const SubFieldContainer = styled.div``;

const HelpText = styled.div`
  display: block;
  margin: 5px 0 30px 0;
  font-weight: normal;
  font-size: inherit;
  line-height: inherit;
`;

const InputContainer = styled.div`
  display: flex;
  align-items: center;

  & input {
    flex: 1;
    width: 100%;
  }
`;

const DeleteAccountContainer = styled.div``;

const EditMentorDetails = ({
  isLoading,
  updateMentor,
  userDetails: { avatar, ...details },
}: EditMentorDetailsProps) => {
  const [mentorDetails, setMentorDetails] = useState(fromMtoVM(details));

  const { isMentor, logout } = useUser();
  const api = useApi()

  const handleInputChange = (
    fieldName: string,
    value: string | boolean | SelectProps['value']
  ) => {
    setMentorDetails({
      ...mentorDetails,
      [fieldName]: value,
    });
  };

  const model = isMentor ? mentorFields : userFields;

  // channels onChange function
  const handleKeyValueChange = (
    fieldName: 'channels',
    prop: string,
    value: string
  ) => {
    const user = { ...mentorDetails };
    const field = user[fieldName];
    const itemIndex = field.findIndex(x => x.type === prop);
    const isItemExist = itemIndex > -1;
    if (isItemExist) {
      if (value) {
        user[fieldName] = user[fieldName].map(x => {
          if (x.type === prop) x.id = value;
          return x;
        });
      } else {
        user[fieldName].splice(itemIndex, 1);
      }
    } else {
      user[fieldName].push({
        type: prop,
        id: value,
      });
    }

    setMentorDetails(user);
  };

  const formField = (fieldName: keyof UserVM, config: ModelConfig) => {
    switch (config.type) {
      case 'text':
        return (
          <ExtendedFormField
            key={fieldName}
            label={config.label}
            helpText={config.helpText}
            className=""
          >
            <Input
              type={config.type}
              name={fieldName}
              value={mentorDetails[fieldName] as string}
              onChange={e =>
                handleInputChange(
                  fieldName,
                  (e.target as HTMLInputElement).value
                )
              }
              style={config.style}
            />
          </ExtendedFormField>
        );
      case 'longtext':
        return (
          <ExtendedFormField
            key={fieldName}
            label={config.label}
            helpText={config.helpText}
          >
            <Textarea
              name={fieldName}
              value={mentorDetails[fieldName] as string}
              onChange={e =>
                handleInputChange(
                  fieldName,
                  (e.target as HTMLTextAreaElement).value
                )
              }
              style={config.style}
            />
          </ExtendedFormField>
        );
      case 'tags':
      case 'select':
        return (
          <ExtendedFormField
            key={fieldName}
            label={config.label}
            helpText={config.helpText}
          >
            <Select
              name={fieldName as string}
              isMulti={config.type === 'tags'}
              options={config.options}
              maxSelections={config.maxItems}
              value={mentorDetails[fieldName] as SelectProps['value']}
              onChange={(selected, data) => {
                handleInputChange(data.name, selected);
              }}
            />
          </ExtendedFormField>
        );
      case 'keyvalue':
        const filledChannel = mentorDetails.channels.filter(x => x.id);
        return (
          <ExtendedFormField
            key={fieldName}
            label={config.label}
            customFormField
          >
            <HelpText>{config.helpText}</HelpText>
            <InnerFieldsContainer>
              {config.options.map((option, index) => {
                const propData = mentorDetails.channels.find(
                  x => x.type === option.value
                );
                const isDisabled =
                  filledChannel.length >= 3 && !(propData && propData.id);
                return (
                  <ExtendedFormField
                    key={option.value}
                    label={option.label}
                    helpText={option.helpText}
                    customFormField={index === config.options.length - 1}
                  >
                    <InputContainer>
                      <span>{option.prefix}</span>
                      <Input
                        aria-labelledby={option.value}
                        type="text"
                        name={`${fieldName}[${option.value}]`}
                        value={propData ? propData.id : ''}
                        onChange={e => {
                          handleKeyValueChange(
                            'channels',
                            option.value,
                            (e.target as HTMLInputElement).value
                          );
                        }}
                        disabled={isDisabled}
                        placeholder={option.placeholder}
                      />
                    </InputContainer>
                  </ExtendedFormField>
                );
              })}
            </InnerFieldsContainer>
          </ExtendedFormField>
        );
      case 'checkbox':
        return (
          <ExtendedFormField
            key={fieldName}
            label={config.label}
            customFormField
          >
            <HelpText>{config.helpText}</HelpText>
            <SubFieldContainer>
              <Checkbox
                checked={mentorDetails[fieldName] === true}
                value={mentorDetails[fieldName] as string}
                onChange={e => {
                  handleInputChange(fieldName, e.target.checked);
                }}
                name={config.label}
                LabelComponent={config.label}
              />
            </SubFieldContainer>
          </ExtendedFormField>
        );
      default:
        return <></>;
    }
  };

  // validate form details
  const validate = () => {
    const errors: string[] = [];
    const entries = Object.entries(model) as [keyof UserVM, ModelConfig][];

    entries.forEach(([field, config]) => {
      if (config.validate?.(mentorDetails[field]) === false) {
        errors.push(config.label);
      } else if ('options' in config) {
        if (config.type === 'keyvalue' && field === 'channels') {
          config.options.forEach(option => {
            if ('validate' in option) {
              const item = mentorDetails[field].find(
                opt => opt.type === option.value
              );
              if (!option.validate?.(item?.id)) {
                errors.push(`${config.label}:${option.label}`);
              }
            }
          });
        }
      }
    });

    if (errors.length) {
      toast.error(
        `The following fields is missing or invalid: ${errors.join(', ')}`
      );
    }
    return !errors.length;
  };

  const onSubmit = (e: React.SyntheticEvent) => {
    report('Member Area', 'Submit start', 'User details');
    e.preventDefault();
    if (!validate()) {
      return;
    }
    const userInfo = fromVMtoM(mentorDetails);
    updateMentor(userInfo);
  };

  const onDelete = async () => {
    report('Member Area', 'Delete start', 'User details');
    if (window.confirm(messages.EDIT_DETAILS_DELETE_ACCOUNT_CONFIRM)) {
      await api.deleteMentor(details._id);
      report('Member Area', 'Delete success', 'User details');
      logout();
    }
  };

  return (
    <Modal title="Update Profile" onSave={onSubmit} isLoading={isLoading}>
      <EditDetails>
        <EditDetailsForm onSubmit={onSubmit}>
          <FormFields>
            {Object.entries(model).map(([fieldName, field]) =>
              formField(fieldName as keyof UserVM, field as ModelConfig)
            )}
          </FormFields>
        </EditDetailsForm>
        <DeleteAccountContainer>
          <Button skin="danger" onClick={onDelete}>
            Delete my account
          </Button>
        </DeleteAccountContainer>
      </EditDetails>
    </Modal>
  );
};

export default EditMentorDetails;
