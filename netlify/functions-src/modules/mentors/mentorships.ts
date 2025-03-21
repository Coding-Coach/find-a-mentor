import { Handler } from '@netlify/functions';
import { handler as mentorshipsRequestsHandler } from '../mentorships/get'
import { handler as getAllMentorshipsHandler } from '../mentorships/get-all'
import { withRouter } from '../middlewares/withRouter';

export const handler: Handler = withRouter([
  ['', getAllMentorshipsHandler],
  [':userId/requests', mentorshipsRequestsHandler],
]);