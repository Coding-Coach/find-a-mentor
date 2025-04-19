import type { ApiHandler } from '../../types';
import { error, success } from '../../utils/response';
import { getUserById, upsertUser } from '../../data/users';
import type { User } from '../../common/interfaces/user.interface';

export const handler: ApiHandler = async (event, context) => {
  const userId = event.queryStringParameters?.userId;
  const currentUserAuth0Id = context.user?.auth0Id;

  if (!userId) {
    return {
      statusCode: 400,
      body: 'userId is required',
    };
  }
  const user = await getUserById(userId, currentUserAuth0Id);

  if (!user) {
    console.error(`User id: ${userId} not found`);
    return error('User not found', 404);
  }

  return success({
    data: user,
  });
}

export const updateUserInfoHandler: ApiHandler<User> = async (event, context) => {
  try {
    const user = event.parsedBody;
    if (!user) {
      return error('Invalid request body', 400);
    }

    if (user.auth0Id !== context.user?.auth0Id) {
      return error('Unauthorized', 401);
    }

    const upsertedUser = await upsertUser(user);
    return success({
      data: upsertedUser,
    });
  } catch (e) {
    return error(e.message, 400);
  }
}
