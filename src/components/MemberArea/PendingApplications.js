import React, { Component } from 'react';
import { getPendingApplications, approveApplication } from '../../api';

export default class PendingApplications extends Component {
  state = {
    applications: []
  }

  async componentDidMount() {
    const applications = await getPendingApplications();
    this.setState({
      applications
    })
  }

  approve = async application => {
    await approveApplication(application);
    alert('done');
  }

  render() {
    const { applications } = this.state;
    return <table>
      <thead>
        <tr>
          <th>Name</th>
        </tr>
      </thead>
      <tbody>
      {
        applications.map(application =>
          <tr key={application._id}>
            <td>{application.name}</td>
            <td><button onClick={this.approve.bind(null, application)}>Approve</button></td>
          </tr>
        )
      }
      </tbody>
    </table>
  }
}