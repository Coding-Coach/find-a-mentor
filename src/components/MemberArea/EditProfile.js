import React, { Component } from 'react';
import Input from '../Input/Input';
import { updateMentor, deleteMentor, createApplication } from '../../api';
import model from './model';
import Select from 'react-select';
import './EditProfile.css';
import { isMentor, fromMtoVM } from '../../helpers/user';

export default class EditProfile extends Component {
  state = {
    user: fromMtoVM(this.props.user),
  };

  onSubmit = async e => {
    const { user } = this.state;
    e.preventDefault();
    this.setState({ disabled: true });
    const updateMentorResult = await updateMentor(fromMtoVM(user));
    if (updateMentorResult && !isMentor(user)) {
      const createApplicationResult = await createApplication();
      if (!createApplicationResult.success) {
        alert(createApplicationResult.message);
      }
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
        return (
          <Input id={fieldName} label={fieldName} key={fieldName}>
            <input
              className="input"
              value={user[fieldName] || config.defaultValue}
              type="text"
              name={fieldName}
              placeholder={fieldName}
              onChange={e =>
                this.handleInputChange(e.target.name, e.target.value)
              }
            />
          </Input>
        );
      case 'tags':
        return (
          <Input id={fieldName} label={fieldName} key={fieldName}>
            <Select
              name={fieldName}
              className="input input-extended"
              classNamePrefix="select"
              isMulti={true}
              isSearchable={true}
              value={user[fieldName] || config.defaultValue}
              onChange={(selected, data) =>
                this.handleInputChange(data.name, selected)
              }
              options={config.options}
            />
          </Input>
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

  render() {
    const { disabled } = this.state;
    const { user } = this.props;
    return (
      <>
        <button onClick={this.onDelete}>Delete account</button>
        <form onSubmit={this.onSubmit} className="edit-profile">
          {Object.keys(model).map(field => this.formField(field, model[field]))}
          <button disabled={disabled}>
            {user.roles.includes('MENTOR') ? 'Save' : 'Become a Mentor'}
          </button>
        </form>
      </>
    );
  }
}
