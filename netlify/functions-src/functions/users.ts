import type { ApiHandler } from './types';
import { handler as usersCurrentHandler } from './modules/users/current'
import { handler as getUserInfoHandler, updateUserInfoHandler } from './modules/users/userInfo'
import { handler as deleteUser } from './modules/users/delete'
import { handler as verifyUserHandler } from './modules/users/verify'
import { toggleAvatarHandler } from './modules/users/toggleAvatar'
import { withRouter } from './hof/withRouter';
import { withDB } from './hof/withDB';
import { withAuth } from './utils/auth';

export const handler: ApiHandler = withDB(
  withRouter([
    ['/', 'PUT', withAuth(updateUserInfoHandler)],
    ['/', 'DELETE', withAuth(deleteUser, {
      includeFullUser: true,
    })],
    ['/current', 'GET', usersCurrentHandler],
    ['/current/avatar', 'POST', withAuth(toggleAvatarHandler)],
    ['/verify', 'POST', withAuth(verifyUserHandler, {
      emailVerificationRequired: false,
      includeFullUser: true,
    })],
    ['/:userId', 'GET', withAuth(getUserInfoHandler, {
      authRequired: false,
    })],
  ])
)