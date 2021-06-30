import React from 'react';
import { render } from '@testing-library/react';
import { UserProvider } from '../../context/userContext/UserContext';
import { ModalHookProvider } from '../../context/modalContext/ModalContext';
import { STATUS } from '../../helpers/mentorship';
export const reqData = {
  success: true,
  data: [
    {
      id: 123,
      mentee: {
        id: '001',
        name: 'User 001',
        avatar: 'https://avatars0.githubusercontent.com/u/219207?s=88&v=4',
        title: 'J web dev',
      },
      status: STATUS.approved,
      date: new Date(),
      message: 'hi',
      background: 'yes',
      expectation: 'the world',
      isMine: false,
    },
    {
      id: 456,
      mentee: {
        id: '002',
        name: 'User 002',
        avatar: 'https://avatars0.githubusercontent.com/u/219207?s=88&v=4',
        title: 'J web dev',
      },
      status: STATUS.rejected,
      date: new Date('Tue Dec 29 2020 23:18:59'),
      message: `Hi, I’m John Doe and I’m looking for a mentor who
        can help me find my first job as a software developer. I’ve been learning JavaScript for the last 6 months and I think I’m ready.`,
      background: `I’ve been working as an accountant for the last 2 years, but ever since I wrote my first line of code I enjoyed so much.`,
      expectation: `Would be nice to have weekly meetings, but I know you might be busy so please let me know if this works for you.`,
      isMine: false,
    },
    {
      id: 789,
      mentee: {
        id: '003',
        name: 'User 003',
        avatar: 'https://avatars0.githubusercontent.com/u/219207?s=88&v=4',
        title: 'J web dev',
      },
      status: STATUS.viewed,
      date: new Date('Tue Oct 29 2019 23:18:59'),
      message: `Hi, I’m John Doe and I’m looking for a mentor who
        can help me find my first job as a software developer. I’ve been learning JavaScript for the last 6 months and I think I’m ready.`,
      background: `I’ve been working as an accountant for the last 2 years, but ever since I wrote my first line of code I enjoyed so much.`,
      expectation: `Would be nice to have weekly meetings, but I know you might be busy so please let me know if this works for you.`,
      isMine: false,
    },
    {
      id: 1011,
      mentee: {
        id: '004',
        name: 'User 004',
        avatar: 'https://avatars0.githubusercontent.com/u/219207?s=88&v=4',
        title: 'J web dev',
      },
      status: STATUS.cancelled,
      date: new Date('Tue Oct 29 2019 23:18:59'),
      message: `Hi, I’m John Doe...`,
      background: `I’ve been working as...`,
      expectation: `Would be nice to ...`,
      isMine: false,
    },
  ],
};

export const userData = {
  spokenLanguages: ['en', 'heb'],
  tags: [],
  roles: ['Member'],
  _id: '555',
  auth0Id: 'auth0|555',
  email: 'moolipit@gmail.com',
  name: 'moolipit',
  avatar:
    'https://s.gravatar.com/avatar/480e24ae41f94844b47471baaa6fb894?s=480&r=pg&d=https%3A%2F%2Fcdn.auth0.com%2Favatars%2Fmo.png',
  channels: [],
  createdAt: '2020-12-13T13:59:24.488Z',
  updatedAt: '2020-12-13T13:59:24.488Z',
  __v: 0,
};

const Providers = ({ children }) => {
  return (
    <UserProvider>
      <ModalHookProvider>{children}</ModalHookProvider>
    </UserProvider>
  );
};

const customRender = (ui, options) =>
  render(ui, { wrapper: Providers, ...options });

// re-export everything
export * from '@testing-library/react';

// override render method
export { customRender as render };
