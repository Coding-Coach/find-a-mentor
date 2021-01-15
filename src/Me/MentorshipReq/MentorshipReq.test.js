import React from 'react';
import {
  fireEvent,
  act,
  render,
  cleanup,
  reqData,
  screen,
  waitFor,
  waitForElementToBeRemoved,
  userData,
  debug,
} from './test-setup';
import MentorshipReq from './MentorshipReq';
import * as api from '../../api';
import messages from '../../messages';

describe('MentorshipReq', () => {
  jest.mock('../../api/index.js');

  beforeEach(() => {
    api.getCurrentUser = jest.fn(() => Promise.resolve(userData));
  });

  afterEach(cleanup);

  it('Fetch and render a list of mentorship requests', async () => {
    api.getMentorshipRequests = jest.fn(() => Promise.resolve(reqData));
    const { findAllByText } = render(<MentorshipReq />);

    //FIX: await waitForElementToBeRemoved(() => screen.getByRole('status'));

    await waitForElementToBeRemoved(() => document.querySelector('i.loader'));

    const reqEls = await findAllByText(/User.*/);

    expect(reqEls.length).toBe(3);
  });
  it('Shows appropriate message if there are no mentorship requests', async () => {
    const promise = Promise.resolve({ ...reqData, data: [] });
    api.getMentorshipRequests = jest.fn(() => promise);
    const { getByText } = render(<MentorshipReq />);

    await waitForElementToBeRemoved(() => document.querySelector('i.loader'));

    getByText(/No requests/);
  });

  it('Show success modal when accepting new mentorship', async () => {
    api.getMentorshipRequests = jest.fn(() => Promise.resolve(reqData));
    const { getByText } = render(<MentorshipReq />);

    await waitForElementToBeRemoved(() => document.querySelector('i.loader'));

    const reqEl = getByText(reqData.data[2].user.name);

    fireEvent.click(reqEl);

    const acceptBtnEl = getByText('Accept');

    fireEvent.click(acceptBtnEl);

    screen.getByText('Mentorship Started')
  });
});
