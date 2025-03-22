import { success } from '../../utils/response'
import type { ApiHandler } from '../../types';

export const getFavoritesHandler: ApiHandler = async (event) => {
  return success({
    data: {
      mentors: [],
    },
    params: event.queryStringParameters
  });
}

export const addFavoriteHandler: ApiHandler = async (event) => {
  return success({
    data: {
      mentors: [],
    },
    params: event.queryStringParameters
  });
}