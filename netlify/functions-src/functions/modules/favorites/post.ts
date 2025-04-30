import type { ApiHandler } from '../../types';
import { error, success } from '../../utils/response';
import { toggleFavorite } from '../../data/favorites';
import { DataError } from '../../data/errors';

export const toggleFavoriteHandler: ApiHandler = async (event, context) => {
  try {
    const mentorId = event.queryStringParameters?.mentorId;
    if (!mentorId) {
      return error('Mentor ID is required', 400);
    }

    const mentorIds = await toggleFavorite(context.user._id, mentorId);
    return success({
      data: {
        mentorIds,
      },
    });
  } catch (err) {
    if (err instanceof DataError) {
      return error(err.message, err.statusCode);
    }
    return error('Internal server error', 500);
  }
};