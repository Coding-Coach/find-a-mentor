import { Handler } from '@netlify/functions';
import { handler as usersCurrentHandler } from '../users/current'
import { addFavoriteHandler, getFavoritesHandler } from '../users/favorites'
import { withRouter } from '../hof/withRouter';
import { withDB } from '../hof/withDB';

export const handler: Handler = withDB(
  withRouter([
    ['current', 'GET', usersCurrentHandler],
    [':userId/favorites', 'GET', getFavoritesHandler],
    [':userId/favorites/:mentorId', 'POST', addFavoriteHandler],
  ])
)