import type { Handler } from '@netlify/functions';
import { withDB } from './hof/withDB';
import { withAuth } from './utils/auth';
import { withRouter } from './hof/withRouter';
import { handler as mentorshipsRequestsHandler, updateRequestHandler } from './modules/mentorships/requests'
import { handler as getAllMentorshipsHandler } from './modules/mentorships/get-all'
import { handler as applyForMentorshipHandler } from './modules/mentorships/apply';
import { Role } from './common/interfaces/user.interface';

export const handler: Handler = withDB(
  withRouter([
    ['/', 'GET', withAuth(getAllMentorshipsHandler, Role.ADMIN)],
    ['/:userId/requests', 'GET', withAuth(mentorshipsRequestsHandler)],
    ['/:userId/requests/:mentorshipId', 'PUT', withAuth(updateRequestHandler)],
    ['/:mentorId/apply', 'POST', withAuth(applyForMentorshipHandler)],
  ])
);
