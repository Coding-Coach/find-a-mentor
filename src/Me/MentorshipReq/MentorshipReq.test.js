import React from 'react';
import { fireEvent, render, reqData, userData } from './test-setup';
import MentorshipReq from './MentorshipReq';
import * as api from '../../api';
describe('MentorshipReq', () => {
  jest.mock('../../api/index.js');

  beforeEach(() => {
    api.getCurrentUser = jest.fn(() => Promise.resolve(userData));
  });
  it('Fetch and render a list of mentorship requests', async () => {
    api.getMentorshipRequests = jest.fn(() => Promise.resolve(reqData));
    const { findAllByText, debug } = render(<MentorshipReq />);
    const reqEls = await findAllByText(/User.*/);

    expect(reqEls.length).toBe(3);
  });
});
