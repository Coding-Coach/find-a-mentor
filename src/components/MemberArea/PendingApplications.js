import React, { Component } from 'react';
import styled, {css} from 'styled-components';
import { getPendingApplications, approveApplication } from '../../api';
import { Loader } from '../Loader';

export default class PendingApplications extends Component {
  state = {
    applications: [],
    ready: false
  };

  async refreshApplications() {
    const applications = await getPendingApplications();
    this.setState({
      applications,
    });
  }

  async componentDidMount() {
    await this.refreshApplications();
    this.setState({
      ready: true
    })
  }

  toggleLoader = (application, show) => {
    const { applications } = this.state;
    const applicationIndex = applications.findIndex(app => app._id === application._id);
    applications[applicationIndex].loading = show;
    this.setState({
      applications
    })
  }

  approve = async application => {
    this.toggleLoader(application, true);
    await approveApplication(application);
    this.toggleLoader(application, false);
    await this.refreshApplications();
  };

  decline = async application => {
    // await approveApplication(application);
    alert('decline');
  };

  render() {
    const { applications, ready } = this.state;
    if (!ready) {
      return <Loader />
    }
    return (
      applications.length ?
      <Table>
        <thead>
          <tr>
            <th>Avatar</th>
            <th>Name</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {applications.map(application => (
            <tr key={application._id}>
              <td>
                <AvatarImage
                  alt={application.user.name}
                  src={application.user.avatar}
                />
              </td>
              <td>{application.user.name}</td>
              <td>
                {
                  application.loading ?
                  <Loader /> :
                  <>
                    <ApproveButton onClick={this.approve.bind(null, application)}>
                      <i className="fa fa-thumbs-up" />
                    </ApproveButton>
                    <RejectButton onClick={this.decline.bind(null, application)}>
                      <i className="fa fa-thumbs-down" />
                    </RejectButton>
                  </>
                }
              </td>
            </tr>
          ))}
        </tbody>
      </Table> :
      <div>There are no pending applications</div>
    );
  }
}

const Table = styled.table`
  width: 100%;
  border-spacing: 0;

  thead tr {
    background-color: rgba(105, 213, 177, 0.3);
    color: #4a4a4a;
  }

  td, th {
    padding: 5px;
    text-align: left;

    &:first-child,
    &:last-child {
      width: 100px;
      text-align: center;
    }
  }
`;

const AvatarImage = styled.img`
  width: 40px;
  border-radius: 50%;
`;

const actionButton = css`
  width: 30px;
  height: 30px;
  border-radius: 50%;
  border: 0;
  color: #fff;
  margin-left: 5px;
  cursor: pointer;
`;

const ApproveButton = styled.button`
  ${actionButton}
  background: green;
`;

const RejectButton = styled.button`
  ${actionButton}
  background: red;
`;