import type { ApiHandler } from './types';
import { withDB } from './hof/withDB';
import { withAuth } from './utils/auth';
import { withRouter } from './hof/withRouter';
import { handler as getMentorsHanler } from './modules/mentors/get';
import { handler as getApplicationsHandler } from './modules/mentors/applications/get';
import { handler as upsertApplicationHandler } from './modules/mentors/applications/post';
import { handler as updateApplicationHandler } from './modules/mentors/applications/put';
import { Role } from './common/interfaces/user.interface';

export const handler: ApiHandler = withDB(
  withRouter([
    ['/', 'GET', withAuth(getMentorsHanler, { authRequired: false })],
    ['/applications', 'GET', withAuth(getApplicationsHandler, { returnUser: true, role: Role.ADMIN })],
    ['/applications/:applicationId', 'PUT', withAuth(updateApplicationHandler, { returnUser: true, role: Role.ADMIN })],
    ['/applications', 'POST', withAuth(upsertApplicationHandler, { returnUser: true, })],
    // TODO: find out if needed
    // ['/:userId/applications', 'GET', withAuth(getUserApplicationsHandler, { returnUser: true })],
  ])
);
