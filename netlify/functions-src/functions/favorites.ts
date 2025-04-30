import { withDB } from './hof/withDB';
import { withRouter } from './hof/withRouter';
import { getFavoritesHandler } from './modules/favorites/get';
import type { ApiHandler } from './types';
import { withAuth } from './utils/auth';
import { toggleFavoriteHandler } from './modules/favorites/post'

export const handler: ApiHandler = withDB(
  withRouter([
    ['/', 'GET', withAuth(getFavoritesHandler, {
      authRequired: true,
      includeFullUser: true,
    })],
    ['/:mentorId', 'POST', withAuth(toggleFavoriteHandler, {
      authRequired: true,
      includeFullUser: true,
    })],
  ])
)