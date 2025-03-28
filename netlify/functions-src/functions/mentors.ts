import type { ApiHandler } from './types';
import { withDB } from './hof/withDB';
import { withAuth } from './utils/auth';
import { withRouter } from './hof/withRouter';
import { handler as getMentorsHanler } from './modules/mentors/get';
import { handler as getUserApplicationsHandler } from './modules/mentors/get-applications';
import { handler as createApplicationHandler } from './modules/mentors/applications/post';

export const handler: ApiHandler = withDB(
  withRouter([
    ['/', 'GET', withAuth(getMentorsHanler, { authRequired: false })],
    ['/applications', 'POST', withAuth(createApplicationHandler, { returnUser: true, })],
    // TODO: find out if needed
    // ['/:userId/applications', 'GET', withAuth(getUserApplicationsHandler, { returnUser: true })],
  ])
);
