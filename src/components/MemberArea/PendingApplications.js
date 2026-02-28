import React, { Component } from 'react';
import styled, { css } from 'styled-components';

import { Loader } from '../Loader';
import { getChannelInfo } from '../../channelProvider';

export default class PendingApplications extends Component {
  state = {
    applications: [],
    ready: false,
  };

  async refreshApplications() {
    const applications = await this.props.api.getPendingApplications();
    this.setState({
      applications,
    });
  }

  async componentDidMount() {
    await this.refreshApplications();
    this.setState({
      ready: true,
    });
  }

  toggleLoader = (application, show) => {
    const { applications } = this.state;
    const applicationIndex = applications.findIndex(
      (app) => app._id === application._id
    );
    applications[applicationIndex].loading = show;
    this.setState({
      applications,
    });
  };

  respondApplication = async (application, status) => {
    let reason;
    if (status === 'Rejected') {
      reason = prompt('Why do you reject that poor gentleman / lady?');
      if (!reason) {
        return;
      }
    }

    this.toggleLoader(application, true);
    await this.props.api.respondApplication({
      ...application,
      status,
      reason
    });
    await this.refreshApplications();
  }

  render() {
    const { applications, ready } = this.state;
    if (!ready) {
      return <Loader />;
    }
    return applications.length ? (
      <PendingApplicationsContainer>
        <Table>
          <thead>
            <tr>
              <th></th>
              <th>Avatar</th>
              <th>Name</th>
              <th>Channels</th>
              <th>Tags</th>
              <th>Title</th>
              <th>Description</th>
            </tr>
          </thead>
          <tbody>
            {applications.map((application) => {
              const { user, loading } = application;
              return (
                <tr key={application._id}>
                  <td>
                    {loading ? (
                      <Loader />
                    ) : (
                      <>
                        <ApproveButton
                          onClick={() => this.respondApplication(application, 'Approved')}
                        >
                          <i className="fa fa-thumbs-up" />
                        </ApproveButton>
                        <RejectButton
                          onClick={() => this.respondApplication(application, 'Rejected')}
                        >
                          <i className="fa fa-thumbs-down" />
                        </RejectButton>
                      </>
                    )}
                  </td>
                  <td>
                    <AvatarImage
                      alt={user.name}
                      src={user.avatar}
                    />
                  </td>
                  <td>{user.name}</td>
                  <td>
                    {user.channels.map((channel) => {
                      const { url, icon } = getChannelInfo(channel);
                      return (
                        <div key={channel.id}>
                          <a
                            href={url}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <i className={`fa fa-${icon}`} />
                            {channel.id}
                          </a>
                        </div>
                      );
                    })}
                  </td>
                  <td>{user.tags.join(', ')}</td>
                  <td>{user.title}</td>
                  <td>{user.description}</td>
                </tr>
              );
            })}
          </tbody>
        </Table>
      </PendingApplicationsContainer>
    ) : (
      <div>There are no pending applications</div>
    );
  }
}

const PendingApplicationsContainer = styled.div`
  overflow-x: auto;
`;

const Table = styled.table`
  width: 100%;
  border-spacing: 0;

  thead tr {
    background-color: rgba(105, 213, 177, 0.3);
    color: #4a4a4a;
  }

  td,
  th {
    padding: 5px;
    text-align: left;
    white-space: nowrap;

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
