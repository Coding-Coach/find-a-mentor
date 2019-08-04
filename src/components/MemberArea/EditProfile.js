import React, { Component } from 'react';
import classNames from 'classnames';
import { updateMentor, deleteMentor, createApplication } from '../../api';
import model from './model';
import Select from 'react-select';
import './EditProfile.css';
import { isMentor, fromMtoVM, fromVMtoM } from '../../helpers/user';
import { providers } from '../../channelProvider';

export default class EditProfile extends Component {
  state = {
    user: fromMtoVM(this.props.user),
  };

  onSubmit = async e => {
    const { user } = this.state;
    e.preventDefault();
    this.setState({ disabled: true });
    const updateMentorResult = await updateMentor(fromVMtoM(user));
    if (updateMentorResult && !isMentor(user)) {
      const createApplicationResult = await createApplication();
      if (!createApplicationResult.success) {
        alert(createApplicationResult.message);
      }
    } else {
      alert('something went wrong, please open a bug');
    }
    this.setState({ disabled: false });
  };

  onDelete = () => {
    if (window.confirm('Are you sure you want to delete your account?')) {
      deleteMentor(this.state.user);
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
            <label>
              <span>{fieldName}</span>
              <CustomTag
                value={user[fieldName] || config.defaultValue}
                type="text"
                name={fieldName}
                onChange={e =>
                  this.handleInputChange(e.target.name, e.target.value)
                }
              />
            </label>
          </div>
        );
      case 'tags':
      case 'select':
        return (
          <div key={fieldName} className="form-field">
            <label>
              <span>{fieldName}</span>
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
                options={config.options}
                menuPortalTarget={document.body}
                styles={{
                  menuPortal: base => ({...base, zIndex: 1000}),
                }}
              />
            </label>
          </div>
        );
      case 'keyvalue':
        const filledChannel = user[fieldName].filter(x => x.data);
        return (
          <div key={fieldName} className="form-field" style={config.style}>
            <label>
              <span>{fieldName}</span>
              <div className="form-fields">
                {config.options.map((option, indx) => {
                  const propData = user[fieldName].find(x => x.value === option.value);
                  const inputIcon = providers[option.value].inputIcon || providers[option.value].icon;
                  const isDisabled = filledChannel.length >= 3 && !(propData && propData.data);
                  return (<div className={`form-field channel-${option.value}`} key={indx}>
                    <div className={classNames(['channel-group', {disabled: isDisabled}])}>
                      <i className={`fa fa-${inputIcon}`}></i>
                      <label>{option.prefix}</label>
                      <input
                        value={propData ? propData.data : ''}
                        type="text"
                        name={`${fieldName}[${option.value}]`}
                        disabled={isDisabled}
                        onChange={e =>
                          this.handleKeyValueChange(fieldName, option.value, e.target.value)
                        }
                      />
                    </div>
                </div>)
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
    const isItemExist = user[fieldName].find(x => x.value === prop);

    if (isItemExist) {
      user[fieldName] = user[fieldName].map(x => {
        if (x.value === prop) 
          x['data'] = value;
        return x;
      });
    } else {
      user[fieldName].push({
        value: prop,
        data: value
      });
    }

    this.setState({ user });
  };

  render() {
    const { disabled } = this.state;
    const { user } = this.props;
    return (
      <>
        <button onClick={this.onDelete}>Delete account</button>
        <form onSubmit={this.onSubmit} className="edit-profile">
          <div className="form-fields">
            {Object.entries(model).map(([fieldName, field]) => this.formField(fieldName, field))}
          </div>
          <div className="form-submit">
            <button disabled={disabled}>
              {user.roles.includes('MENTOR') ? 'Save' : 'Become a Mentor'}
            </button>
            {disabled && <i className="fa fa-spin fa-spinner" />}
          </div>
        </form>
      </>
    );
  }
}
