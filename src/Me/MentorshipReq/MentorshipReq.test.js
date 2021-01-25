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
} from './test-setup';
import MentorshipReq from './MentorshipReq';
import { STATUS } from '../../helpers/mentorship';
import * as api from '../../api';

function mockMentorshipApi({ getReq, updateStatus }) {
  api.getMentorshipRequests = jest.fn(() => Promise.resolve(getReq));
  api.updateMentorshipReqStatus = jest.fn(() =>
    Promise.resolve({
      success: updateStatus?.success,
      mentorship: { status: updateStatus.status ?? STATUS.viewed },
    })
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
      mockMentorshipApi({ getReq: reqData.data });
      const { findAllByText } = render(<MentorshipReq />);

      //FIX: await waitForElementToBeRemoved(() => screen.getByRole('status'));

      await waitForElementToBeRemoved(() => document.querySelector('i.loader'));

      const reqEls = await findAllByText(/User.*/);

      expect(reqEls.length).toBe(4);
    });
    it('Shows appropriate message if there are no mentorship requests', async () => {
      mockMentorshipApi({ getReq: [] });
      const { getAllByText } = render(<MentorshipReq />);

      await waitForElementToBeRemoved(() => document.querySelector('i.loader'));

      getAllByText(/No requests/);
    });

    it(`Change request status to 'Viewed' on opening first time inspection`, async () => {
      mockMentorshipApi({
        getReq: reqData.data,
        updateStatus: { success: true },
      });
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
      mockMentorshipApi({
        getReq: reqData.data,
        updateStatus: { success: true, status: STATUS.viewed },
      });
      const { getByText } = render(<MentorshipReq />);

      await waitForElementToBeRemoved(() => document.querySelector('i.loader'));

      const reqEl = getByText(reqData.data[2].mentee.name);

      fireEvent.click(reqEl);

      const acceptBtnEl = getByText('Accept');

      fireEvent.click(acceptBtnEl);

      await screen.findByText('Mentorship Started');

      fireEvent.click(screen.getByText('Close'));

      await waitForElementToBeRemoved(() =>
        screen.getByText('Mentorship Started')
      );
    });
  });
});
