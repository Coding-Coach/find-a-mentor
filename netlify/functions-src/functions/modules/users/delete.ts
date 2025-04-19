import type { User } from '../../common/interfaces/user.interface';
import type { ApiHandler } from '../../types';
import { deleteUser } from '../../data/users';
import { deleteUser as deleteUserFromAuth0 } from '../../admin/delete';
import { success } from '../../utils/response';

export const handler: ApiHandler<unknown, User> = async (event, context) => {
  const {_id, auth0Id } = context.user;
  const result = await deleteUser(_id);
  deleteUserFromAuth0(auth0Id)
    .then(result => {
      // eslint-disable-next-line no-console
      console.log('User deleted from Auth0:', result);
    })
    .catch(error => {
      // eslint-disable-next-line no-console
      console.error('Error deleting user from Auth0:', error);
    }
  );
  return success({ data: result }, 204);
}
