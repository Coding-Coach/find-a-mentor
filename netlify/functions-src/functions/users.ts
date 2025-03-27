import { Handler } from '@netlify/functions';
import { handler as usersCurrentHandler } from './modules/users/current'
import { handler as getUserInfoHandler, updateUserInfoHandler } from './modules/users/userInfo'
import { addFavoriteHandler, getFavoritesHandler } from './modules/users/favorites'
import { withRouter } from './hof/withRouter';
import { withDB } from './hof/withDB';
import { withAuth } from './utils/auth';

export const handler: Handler = withDB(
  withRouter([
    ['/', 'PUT', withAuth(updateUserInfoHandler)],
    ['/current', 'GET', usersCurrentHandler],
    ['/:userId', 'GET', withAuth(getUserInfoHandler, {
      authRequired: false,
    })],
    ['/:userId/favorites', 'GET', getFavoritesHandler],
    ['/:userId/favorites/:mentorId', 'POST', addFavoriteHandler],
  ])
)