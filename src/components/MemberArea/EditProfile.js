import React, { Component } from 'react';
import Input from '../Input/Input';
import { updateMentor } from '../../api';
import model from './model';
import Select from 'react-select';
import './EditProfile.css'
export default class EditProfile extends Component {
  state = {
    user: this.fromMtoVM(this.props.user)
  }

  fromVMtoM(user) {
    return {
      ...user,
      tags: user.tags.map(i => i.value)
    }
  }

  fromMtoVM(user) {
    return {
      ...user,
      tags: user.tags.map(i => ({label: i, value: i}))
    }
  }

  onSubmit = async e => {
    e.preventDefault();
    this.setState({disabled: true});
    const result = await updateMentor(this.fromVMtoM(this.state.user));
    if (result) {
      this.setState({disabled: false});
    }
  }

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
              onChange={e => this.handleInputChange(e.target.name, e.target.value)} />
          </Input>
        )
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
              onChange={(selected, data) => this.handleInputChange(data.name, selected)}
              options={config.options}
            />
          </Input>
        )
        default:
          return (<></>);
    }
  }

  handleInputChange = (fieldName, value) => {
    this.setState({
      user: {
        ...this.state.user,
        [fieldName]: value
      }
    });
  }

  render() {
    const { disabled } = this.state;
    return (
      <form onSubmit={this.onSubmit} className="edit-profile">
        {Object.keys(model).map(field => (
            this.formField(field, model[field])
          ))
        }
        <button disabled={disabled}>Submit</button>
      </form>
    );
  }
}