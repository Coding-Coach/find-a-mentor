import { Handler } from '@netlify/functions';
import { handler as usersCurrentHandler } from '../users/current'
import { handler as usersFavoritesHandler } from '../users/favorites'
import { withRouter } from '../middlewares/withRouter';

export const handler: Handler = withRouter([
  ['current', usersCurrentHandler],
  [':userId/favorites', usersFavoritesHandler],
]);