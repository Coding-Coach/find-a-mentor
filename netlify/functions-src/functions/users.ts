import type { ApiHandler } from './types';
import { handler as usersCurrentHandler } from './modules/users/current'
import { handler as getUserInfoHandler, updateUserInfoHandler } from './modules/users/userInfo'
import { handler as deleteUser } from './modules/users/delete'
import { addFavoriteHandler, getFavoritesHandler } from './modules/users/favorites'
import { withRouter } from './hof/withRouter';
import { withDB } from './hof/withDB';
import { withAuth } from './utils/auth';

export const handler: ApiHandler = withDB(
  withRouter([
    ['/', 'PUT', withAuth(updateUserInfoHandler)],
    ['/', 'DELETE', withAuth(deleteUser, {
      returnUser: true,
    })],
    ['/current', 'GET', usersCurrentHandler],
    ['/:userId', 'GET', withAuth(getUserInfoHandler, {
      authRequired: false,
    })],
    ['/:userId/favorites', 'GET', getFavoritesHandler],
    ['/:userId/favorites/:mentorId', 'POST', addFavoriteHandler],
  ])
)