import { ObjectId } from 'mongodb';
import type { User } from '../../common/interfaces/user.interface';
import type { ApiHandler } from '../../types';
import { deleteUser, getUserBy } from '../../data/users';
import { DataError } from '../../data/errors';
import { deleteUser as deleteUserFromAuth0 } from '../../admin/delete';
import { success } from '../../utils/response';

const deleteUserAccount = async ({ _id, auth0Id }: Pick<User, '_id' | 'auth0Id'>) => {
  console.log('Deleting user from DB:', { userId: _id.toString(), auth0Id });
  const result = await deleteUser(_id);
  console.log('User deleted from DB:', { userId: _id.toString(), result });
  deleteUserFromAuth0(auth0Id)
    .then(result => {
      console.log('User deleted from Auth0:', result);
    })
    .catch(error => {
      console.error('Error deleting user from Auth0:', error);
    });
  return result;
};

// A user deleting their own account
export const handler: ApiHandler<unknown, User> = async (event, context) => {
  console.log('Self delete requested:', { userId: context.user._id.toString() });
  const result = await deleteUserAccount(context.user);
  return success({ data: result }, 204);
};

// An admin deleting any user's account. Must be wrapped with `withAuth(..., { role: Role.ADMIN })`
export const adminDeleteHandler: ApiHandler<unknown, User> = async (event, context) => {
  const { userId } = event.queryStringParameters ?? {};
  console.log('Admin delete requested:', { adminId: context.user?._id?.toString(), userId });

  if (!userId || !ObjectId.isValid(userId)) {
    console.error('Admin delete rejected: invalid user id', { userId });
    throw new DataError(400, 'Invalid user id');
  }

  const user = await getUserBy('_id', new ObjectId(userId));
  if (!user) {
    console.error('Admin delete failed: user not found', { userId });
    throw new DataError(404, 'User not found');
  }

  const result = await deleteUserAccount(user);
  console.log('Admin delete completed:', { adminId: context.user?._id?.toString(), userId });
  // 200 with a body (not 204) so the client can parse the response
  return success({ data: result });
};
