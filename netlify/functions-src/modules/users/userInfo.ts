import { ObjectId } from 'mongodb';
import { User } from '../../common/interfaces/user.interface';
import type { ApiHandler } from '../../types';
import { getCollection } from '../../utils/db';
import { success } from '../../utils/response';

export const handler: ApiHandler = async (event) => {
  const userId = event.queryStringParameters?.userId;

  if (!userId) {
    return {
      statusCode: 400,
      body: 'userId is required',
    };
  }

  if (!ObjectId.isValid(userId)) {
    return {
      statusCode: 400,
      body: 'Invalid userId format',
    };
  }

  const user = await getCollection<User>('users')
    .findOne({ _id: new ObjectId(userId) });

  return success({
    data: user,
  });
}