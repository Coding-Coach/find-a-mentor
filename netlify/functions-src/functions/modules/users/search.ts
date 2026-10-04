import type { User } from '../../common/interfaces/user.interface';
import type { ApiHandler } from '../../types';
import { searchUsers } from '../../data/users';
import { DataError } from '../../data/errors';
import { success } from '../../utils/response';

type UserSuggestion = Pick<User, '_id' | 'name' | 'email' | 'avatar'>;

// Admin only. Must be wrapped with `withAuth(..., { role: Role.ADMIN })`
export const adminSearchHandler: ApiHandler<unknown, UserSuggestion[]> = async (event) => {
  const query = (event.queryStringParameters?.q ?? '').trim();
  if (query.length < 2) {
    throw new DataError(400, 'Query must be at least 2 characters');
  }
  const users = await searchUsers(query);
  return success({ data: users });
};
