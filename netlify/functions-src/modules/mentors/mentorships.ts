import { Handler } from '@netlify/functions';
import { handler as mentorshipsRequestsHandler } from '../mentorships/get'
import { handler as getAllMentorshipsHandler } from '../mentorships/get-all'
import { withRouter } from '../hof/withRouter';

export const handler: Handler = withRouter([
  ['', 'GET', getAllMentorshipsHandler],
  [':userId/requests', 'GET', mentorshipsRequestsHandler],
]);