import type { Handler } from '@netlify/functions';
import { withDB } from './hof/withDB';
import { withRouter } from './hof/withRouter';
import { handler as mentorshipsRequestsHandler } from './modules/mentorships/get'
import { handler as getAllMentorshipsHandler } from './modules/mentorships/get-all'
import { handler as applyForMentorshipHandler } from './modules/mentorships/apply';

export const handler: Handler = withDB(
  withRouter([
    ['/', 'GET', getAllMentorshipsHandler],
    ['/:userId/requests', 'GET', mentorshipsRequestsHandler],
    ['/:mentorId/apply', 'POST', applyForMentorshipHandler],
  ])
);