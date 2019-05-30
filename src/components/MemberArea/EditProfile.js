import React, { Component } from 'react';
import Input from '../Input/Input';
import { updateMentor } from '../../api';

const fields = [
  'email',
  'name',
  'avatar',
  'title',
  'description',
  'country',
  'spokenLanguages',
  'tags',
  'roles'
];

export default class EditProfile extends Component {
  state = {
    user: this.props.user
  }
  onSubmit = async e => {
    e.preventDefault();
    this.setState({disabled: true});
    const result = await updateMentor(this.state.user);
    if (result) {
      this.setState({disabled: false});
    }
  }

  handleInputChange = e => {
    this.setState({
      user: {
        ...this.state.user,
        [e.target.name]: e.target.value
      }
    });
  }

  render() {
    const { user, disabled } = this.state;
    return (
      <form onSubmit={this.onSubmit}>
        {fields.map(field => (
            <Input id={field} label={field} key={field}>
              <input
                className="input"
                value={user[field] || ''}
                type="text"
                name={field}
                placeholder={field}
                onChange={this.handleInputChange} />
            </Input>
          ))
        }
        <button disabled={disabled}>Submit</button>
      </form>
    );
  }
}