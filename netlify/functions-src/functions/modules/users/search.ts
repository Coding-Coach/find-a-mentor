import type { User } from '../../common/interfaces/user.interface';
import type { ApiHandler } from '../../types';
import { searchUsers } from '../../data/users';
import { DataError } from '../../data/errors';
import { success } from '../../utils/response';

type UserSuggestion = Pick<User, '_id' | 'name' | 'email' | 'avatar'>;

// Admin only. Must be wrapped with `withAuth(..., { role: Role.ADMIN })`
export const adminSearchHandler: ApiHandler<unknown, UserSuggestion[]> = async (event, context) => {
  const query = (event.queryStringParameters?.q ?? '').trim();
  // query itself is not logged since it may contain an email address
  // eslint-disable-next-line no-console
  console.log('Admin user search requested:', { adminId: context.user?._id?.toString(), queryLength: query.length });
  if (query.length < 2) {
    // eslint-disable-next-line no-console
    console.error('Admin user search rejected: query too short');
    throw new DataError(400, 'Query must be at least 2 characters');
  }
  const users = await searchUsers(query);
  // eslint-disable-next-line no-console
  console.log('Admin user search completed:', { results: users.length });
  return success({ data: users });
};
