import React, { Component } from 'react';
import { getPendingApplications, approveApplication } from '../../api';

export default class PendingApplications extends Component {
  state = {
    applications: [],
  };

  async componentDidMount() {
    const applications = await getPendingApplications();
    this.setState({
      applications,
    });
  }

  approve = async application => {
    await approveApplication(application);
    alert('done');
  };

  decline = async application => {
    // await approveApplication(application);
    alert('decline');
  };

  render() {
    const { applications } = this.state;
    return (
      <table>
        <thead>
          <tr>
            <th></th>
            <th>Name</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {applications.map(application => (
            <tr key={application._id}>
              <td>
                <img
                  alt={application.user.name}
                  src={application.user.avatar}
                />
              </td>
              <td>{application.user.name}</td>
              <td>
                <button onClick={this.approve.bind(null, application)}>
                  Approve
                </button>
                <button onClick={this.decline.bind(null, application)}>
                  Decline
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    );
  }
}
