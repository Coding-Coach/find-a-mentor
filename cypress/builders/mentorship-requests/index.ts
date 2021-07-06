import { MentorshipRequest } from '../../../src/types/models';
import { userBuilder } from '../users/current/get';

const defaultMentorshipRequest: MentorshipRequest = {
  id: '123',
  mentor: userBuilder({
    name: 'Mentor',
  }),
  mentee: userBuilder(),
  status: 'Approved',
  date: '1609748339000',
  message: 'hi',
  background: 'yes',
  expectation: 'the world',
  isMine: false,
};

export const mentorshipRequestBuilder = (
  overrides: Partial<MentorshipRequest>
) => ({
  ...defaultMentorshipRequest,
  ...overrides,
});
