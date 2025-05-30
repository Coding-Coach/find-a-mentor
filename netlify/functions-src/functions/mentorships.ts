import { withDB } from './hof/withDB';
import { withAuth } from './utils/auth';
import { withRouter } from './hof/withRouter';
import { handler as mentorshipsRequestsHandler, updateMentorshipRequestHandler } from './modules/mentorships/requests'
import { handler as getAllMentorshipsHandler } from './modules/mentorships/get-all'
import { handler as applyForMentorshipHandler } from './modules/mentorships/apply';
import { Role } from './common/interfaces/user.interface';
import type { ApiHandler } from './types';

export const handler: ApiHandler = withDB(
  withRouter([
    ['/', 'GET', withAuth(getAllMentorshipsHandler, { role: Role.ADMIN })],
    ['/:userId/requests', 'GET', withAuth(mentorshipsRequestsHandler)],
    ['/:userId/requests/:mentorshipId', 'PUT', withAuth(updateMentorshipRequestHandler, {
      includeFullUser: true,
    })],
    ['/:mentorId/apply', 'POST', withAuth(applyForMentorshipHandler, {
      includeFullUser: true,
    })],
  ])
);
