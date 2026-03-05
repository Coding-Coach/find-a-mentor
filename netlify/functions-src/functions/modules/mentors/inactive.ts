import { Role } from '../../common/interfaces/user.interface';
import type { ApiHandler } from '../../types';
import { getCollection } from '../../utils/db';
import { success } from '../../utils/response';

export const handler: ApiHandler = async () => {
  const collection = getCollection('users');

  const mentors = await collection
    .find({
      roles: Role.MENTOR,
      available: { $ne: true },
    })
    .project({ _id: 1, name: 1, email: 1, createdAt: 1, avatar: 1 })
    .toArray();

  return success({ data: mentors });
};
