import type { User } from '../../../common/interfaces/user.interface';
import { upsertApplication } from '../../../data/mentors';
import type { ApiHandler } from '../../../types';
import { success } from '../../../utils/response';
import type { Application } from '../types';

export const handler: ApiHandler<Application, User> = async (_event, context) => {
  const { data: application, isNew } = await upsertApplication(context.user._id);
  return success(application, isNew ? 201 : 200);
}