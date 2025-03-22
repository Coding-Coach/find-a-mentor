import { success } from '../../utils/response'
import type { ApiHandler } from '../../types';
import { withAuth } from '../../utils/auth';

export const getFavoritesHandler: ApiHandler = withAuth(async (event) => {
  return success({
    data: {
      mentors: [],
    },
    params: event.queryStringParameters
  });
});

export const addFavoriteHandler: ApiHandler = async (event) => {
  return success({
    data: {
      mentors: [],
    },
    params: event.queryStringParameters
  });
}