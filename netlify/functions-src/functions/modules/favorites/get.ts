import type { User } from '../../common/interfaces/user.interface';
import { getFavorites } from '../../data/favorites';
import type { ApiHandler } from '../../types';
import { success } from '../../utils/response';

export const getFavoritesHandler: ApiHandler<void, User> = async (_event, context) => {
  const userId = context.user._id;
  const mentorIds = await getFavorites(userId);

  return success({
    data: {
      mentorIds,
    },
  });
};
