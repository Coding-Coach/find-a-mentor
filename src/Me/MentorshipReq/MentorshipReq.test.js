import React from 'react';
import {
  fireEvent,
  act,
  render,
  cleanup,
  reqData,
  screen,
  waitForElementToBeRemoved,
  userData,
} from './test-setup';
import MentorshipReq from './MentorshipReq';
import * as api from '../../api';

describe('MentorshipReq', () => {
  jest.mock('../../api/index.js');

  beforeEach(() => {
    api.getCurrentUser = jest.fn(() => Promise.resolve(userData));
  });

  afterEach(cleanup);

  it('Fetch and render a list of mentorship requests', async () => {
    api.getMentorshipRequests = jest.fn(() => Promise.resolve(reqData));
    const { findAllByText } = render(<MentorshipReq />);
    const reqEls = await findAllByText(/User.*/);

    expect(reqEls.length).toBe(3);
  });
  it('Shows appropriate message if there are no mentorship requests', async () => {
    const promise = Promise.resolve({ ...reqData, data: [] });
    api.getMentorshipRequests = jest.fn(() => promise);
    const { getByText } = render(<MentorshipReq />);

    await waitForElementToBeRemoved(() => document.querySelector('i.loader'));

    //FIX: await waitForElementToBeRemoved(() => screen.getByRole('status'));

    getByText(/No requests/);
  });

  it('Render Loading component while waiting for mentorship requests to load', async () => {
    const promise = Promise.resolve(reqData);
    api.getMentorshipRequests = jest.fn(() => promise);
    const { getByRole } = render(<MentorshipReq />);
    getByRole('status');

    await act(() => promise);
  });
});
