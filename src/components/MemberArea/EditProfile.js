import React, { Component } from 'react';
import classNames from 'classnames';
import { toast } from 'react-toastify';
import { updateMentor, deleteMentor, createApplicationIfNotExists } from '../../api';
import model from './model';
import Select from 'react-select';
import './EditProfile.css';
import { isMentor, fromMtoVM, fromVMtoM } from '../../helpers/user';
import { providers } from '../../channelProvider';
import auth from '../../utils/auth';
import messages from '../../messages';
import { report } from '../../ga';

export default class EditProfile extends Component {
  state = {
    user: fromMtoVM(this.props.user),
    errors: [],
  };

  validate() {
    const errors = [];
    const { user } = this.state;
    Object.entries(model).forEach(([field, config]) => {
      if (config.validate && !config.validate(user[field])) {
        errors.push(config.label);
      } else if (config.options) {
        if (user[field] instanceof Array) {
          config.options.forEach(option => {
            const item = user[field].find(opt => opt.type === option.value);
            if (option.validate && item && !option.validate(item.id)) {
              errors.push(`${config.label}:${option.label}`);
            }
          });
        }
      }
    });
    this.setState({
      errors,
    });
    return !errors.length;
  }

  onSubmit = async e => {
    report('Member Area', 'Submit start', 'User details');
    const { user } = this.state;
    const { onClose, onUserUpdated } = this.props;
    e.preventDefault();
    if (!this.validate()) {
      return;
    }
    this.setState({ disabled: true });
    const updateMentorResult = await updateMentor(fromVMtoM(user));
    if (updateMentorResult) {
      if (isMentor(user)) {
        toast.success(messages.EDIT_DETAILS_MENTOR_SUCCESS);
      } else {
        const createApplicationResult = await createApplicationIfNotExists();
        if (createApplicationResult.success) {
          toast.success(createApplicationResult.message);
          onUserUpdated(user);
          onClose();
          report('Member Area', 'Submit sucess', 'User details');
        } else {
          report('Member Area', 'Submit failed', 'User details');
          toast.error(createApplicationResult.message);
        }
      }
    } else {
      report('Member Area', 'Submit failed', 'User details');
      toast.error(messages.GENERIC_ERROR);
    }
    this.setState({ disabled: false });
  };

  onDelete = async () => {
    report('Member Area', 'Delete start', 'User details');
    if (window.confirm(messages.EDIT_DETAILS_DELETE_ACCOUNT_CONFIRM)) {
      await deleteMentor(this.state.user);
      report('Member Area', 'Delete success', 'User details');
      auth.doLogout();
    }
  };

  formField = (fieldName, config) => {
    const { user } = this.state;
    switch (config.type) {
      case 'text':
      case 'longtext':
        const CustomTag = config.type === 'text' ? 'input' : 'textarea';

        return (
          <div key={fieldName} className="form-field" style={config.style}>
            <label
              id={fieldName}
              className={classNames({ required: !!config.validate })}
            >
              <div className="form-field-name">
                {config.label}
                {config.helpText && (
                  <span className="help-text">{config.helpText}</span>
                )}
              </div>
              <div className="form-field-input-wrapper">
                {config.previewImage && (
                  <img
                    className="form-field-preview"
                    src={user[fieldName]}
                    alt="avatar"
                  />
                )}
                <CustomTag
                  aria-labelledby={fieldName}
                  value={user[fieldName] || config.defaultValue}
                  type="text"
                  name={fieldName}
                  required={config.required}
                  onChange={e =>
                    this.handleInputChange(e.target.name, e.target.value)
                  }
                />
              </div>
            </label>
          </div>
        );
      case 'tags':
      case 'select':
        return (
          <div key={fieldName} className="form-field" style={config.style}>
            <label
              id={fieldName}
              className={classNames({ required: !!config.validate })}
            >
              <div className="form-field-name">
                {config.label}
                {config.helpText && (
                  <span className="help-text">{config.helpText}</span>
                )}
              </div>
              <Select
                name={fieldName}
                className="input-extended"
                classNamePrefix="select"
                isMulti={config.type === 'tags'}
                isSearchable={true}
                value={user[fieldName] || config.defaultValue}
                onChange={(selected, data) =>
                  this.handleInputChange(data.name, selected)
                }
                options={
                  config.maxItems &&
                  (this.state.user[fieldName] || []).length === config.maxItems
                    ? [
                        {
                          label: 'Reached max items',
                          value: undefined,
                          isDisabled: true,
                        },
                      ]
                    : config.options
                }
                menuPortalTarget={document.body}
                styles={{
                  menuPortal: base => ({ ...base, zIndex: 1000 }),
                }}
              />
            </label>
          </div>
        );
      case 'keyvalue':
        const filledChannel = user[fieldName].filter(x => x.id);
        return (
          <div key={fieldName} className="form-field" style={config.style}>
            <label
              id={fieldName}
              className={classNames({ required: !!config.validate })}
            >
              <div className="form-field-name">
                {config.label}
                {config.helpText && (
                  <span className="help-text">{config.helpText}</span>
                )}
              </div>
              <div className="form-fields">
                {config.options.map((option, indx) => {
                  const propData = user[fieldName].find(
                    x => x.type === option.value
                  );
                  const inputIcon =
                    providers[option.value].inputIcon ||
                    providers[option.value].icon;
                  const isDisabled =
                    filledChannel.length >= 3 && !(propData && propData.id);
                  return (
                    <div
                      className={`form-field channel-${option.value}`}
                      key={indx}
                    >
                      <div
                        className={classNames([
                          'channel-group',
                          { disabled: isDisabled },
                        ])}
                      >
                        <i className={`fa fa-${inputIcon}`}></i>
                        <label id={option.value}>{option.prefix}</label>
                        <input
                          aria-labelledby={option.value}
                          value={propData ? propData.id : ''}
                          type="text"
                          name={`${fieldName}[${option.value}]`}
                          disabled={isDisabled}
                          placeholder={option.placeholder}
                          onChange={e =>
                            this.handleKeyValueChange(
                              fieldName,
                              option.value,
                              e.target.value
                            )
                          }
                        />
                      </div>
                      {option.helpText && <div>{option.helpText}</div>}
                    </div>
                  );
                })}
              </div>
            </label>
          </div>
        );
      default:
        return <></>;
    }
  };

  handleInputChange = (fieldName, value) => {
    this.setState({
      user: {
        ...this.state.user,
        [fieldName]: value,
      },
    });
  };

  handleKeyValueChange = (fieldName, prop, value) => {
    const { user } = this.state;
    const isItemExist = user[fieldName].find(x => x.type === prop);
    if (isItemExist) {
      user[fieldName] = user[fieldName].map(x => {
        if (x.type === prop) x.id = value;
        return x;
      });
    } else {
      user[fieldName].push({
        type: prop,
        id: value,
      });
    }
    this.setState({ user });
  };

  render() {
    const { disabled, errors, user } = this.state;
    return (
      <>
        <form onSubmit={this.onSubmit} className="edit-profile">
          <div className="form-fields">
            {Object.entries(model).map(([fieldName, field]) =>
              this.formField(fieldName, field)
            )}
          </div>
          <div className="form-submit">
            {!!errors.length && (
              <div className="form-errors">
                The following fields is missing or invalid: {errors.join(', ')}
              </div>
            )}
            <button className="submit" disabled={disabled}>
              {isMentor(user) ? 'Save' : 'Become a Mentor'}
            </button>
            <button type="button" className="delete" onClick={this.onDelete}>
              Delete account
            </button>
            {disabled && <i className="fa fa-spin fa-spinner" />}
          </div>
        </form>
      </>
    );
  }
}
