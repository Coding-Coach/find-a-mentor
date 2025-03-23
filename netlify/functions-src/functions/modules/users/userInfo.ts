import type { ApiHandler } from '../../types';
import { error, success } from '../../utils/response';
import { getUserById } from '../../data/users';

export const handler: ApiHandler = async (event) => {
  const userId = event.queryStringParameters?.userId;

  if (!userId) {
    return {
      statusCode: 400,
      body: 'userId is required',
    };
  }
  const user = await getUserById(userId);

  if (!user) {
    console.error(`User id: ${userId} not found`);
    return error('User not found', 404);
  }

  return success({
    data: {
      ...user,
      channels: [],
    },
  });
}