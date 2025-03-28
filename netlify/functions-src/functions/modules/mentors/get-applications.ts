import { ObjectId } from 'mongodb';
import type { ApiHandler } from '../../types';
import { getCollection } from '../../utils/db';
import { error, success } from '../../utils/response';
import type { User } from '../../common/interfaces/user.interface';

// TODO: find out if needed a handler of "my application". After all, only admin needs to see all applications
const handler: ApiHandler<void, User> = async (event, context) => {
  const userIdObject = new ObjectId(context.user._id);

  try {
    const applications = await getCollection('applications')
      .find({ user: userIdObject })
      .toArray();

    return success(applications);
  } catch (e) {
    console.error('Error fetching applications:', e);
    return error('Internal Server Error', 500);
  }
}

export { handler };