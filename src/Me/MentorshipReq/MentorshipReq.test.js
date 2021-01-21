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
import MentorshipReq, { STATUS } from './MentorshipReq';
import * as api from '../../api';
import messages from '../../messages';

function mockMentorshipApi({ getRes, statusRes }) {
  api.getMentorshipRequests = jest.fn(() => Promise.resolve(getRes));
  api.updateMentorshipReqStatus = jest.fn(() =>
    Promise.resolve({ success: statusRes })
  );
}

describe('MentorshipReq', () => {
  jest.mock('../../api/index.js');
  beforeEach(() => {
    api.getCurrentUser = jest.fn(() => Promise.resolve(userData));
  });

  describe('MentorshipReq List', () => {
    afterEach(cleanup);

    it('Fetch and render a list of mentorship requests', async () => {
      mockMentorshipApi({ getRes: reqData.data });
      const { findAllByText } = render(<MentorshipReq />);

      //FIX: await waitForElementToBeRemoved(() => screen.getByRole('status'));

      await waitForElementToBeRemoved(() => document.querySelector('i.loader'));

      const reqEls = await findAllByText(/User.*/);

      expect(reqEls.length).toBe(4);
    });
    it('Shows appropriate message if there are no mentorship requests', async () => {
      const promise = Promise.resolve([]);
      api.getMentorshipRequests = jest.fn(() => promise);
      const { getByText } = render(<MentorshipReq />);

      await waitForElementToBeRemoved(() => document.querySelector('i.loader'));

      getByText(/No requests/);
    });

    it(`Change request status to 'Viewed' on opening first time inspection`, async () => {
      mockMentorshipApi({ getRes: reqData.data, statusRes: true });
      const { getByText } = render(<MentorshipReq />);

      await waitForElementToBeRemoved(() => document.querySelector('i.loader'));

      let statusEl = getByText(reqData.data[2].status);

      await act(async () => {
        fireEvent.click(statusEl);
      });

      statusEl = getByText(STATUS.viewed);

      expect(statusEl).toBeInTheDocument();
    });
  });

  describe('MentorshipReq Modal', () => {
    it('Show success modal when accepting new mentorship', async () => {
      mockMentorshipApi({ getRes: reqData.data, statusRes: true });
      const { getByText } = render(<MentorshipReq />);

      await waitForElementToBeRemoved(() => document.querySelector('i.loader'));

      const reqEl = getByText(reqData.data[2].mentee.name);

      fireEvent.click(reqEl);

      const acceptBtnEl = getByText('Accept');

      fireEvent.click(acceptBtnEl);

      screen.getByText('Mentorship Started');

      fireEvent.click(screen.getByText('Close'));

      await waitForElementToBeRemoved(() =>
        screen.getByText('Mentorship Started')
      );
    });
  });
});
