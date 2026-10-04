import { ObjectId } from 'mongodb';
import type { User } from '../../common/interfaces/user.interface';
import type { ApiHandler } from '../../types';
import { deleteUser, getUserBy } from '../../data/users';
import { DataError } from '../../data/errors';
import { deleteUser as deleteUserFromAuth0 } from '../../admin/delete';
import { success } from '../../utils/response';

const deleteUserAccount = async ({ _id, auth0Id }: Pick<User, '_id' | 'auth0Id'>) => {
  const result = await deleteUser(_id);
  deleteUserFromAuth0(auth0Id)
    .then(result => {
      // eslint-disable-next-line no-console
      console.log('User deleted from Auth0:', result);
    })
    .catch(error => {
      // eslint-disable-next-line no-console
      console.error('Error deleting user from Auth0:', error);
    });
  return result;
};

// A user deleting their own account
export const handler: ApiHandler<unknown, User> = async (event, context) => {
  const result = await deleteUserAccount(context.user);
  return success({ data: result }, 204);
};

// An admin deleting any user's account. Must be wrapped with `withAuth(..., { role: Role.ADMIN })`
export const adminDeleteHandler: ApiHandler<unknown, User> = async (event) => {
  const { userId } = event.queryStringParameters ?? {};
  if (!userId || !ObjectId.isValid(userId)) {
    throw new DataError(400, 'Invalid user id');
  }

  const user = await getUserBy('_id', new ObjectId(userId));
  if (!user) {
    throw new DataError(404, 'User not found');
  }

  const result = await deleteUserAccount(user);
  return success({ data: result }, 204);
};
