import { Handler } from '@netlify/functions';
import { handler as mentorshipsRequestsHandler } from './modules/mentorships/get'
import { handler as getAllMentorshipsHandler } from './modules/mentorships/get-all'
import { withRouter } from './hof/withRouter';

export const handler: Handler = withRouter([
  ['/', 'GET', getAllMentorshipsHandler],
  ['/:userId/requests', 'GET', mentorshipsRequestsHandler],
]);