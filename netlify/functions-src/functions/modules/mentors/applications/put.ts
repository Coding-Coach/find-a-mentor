import { ObjectId } from 'mongodb';
import type { User } from '../../../common/interfaces/user.interface';
import { upsertApplication } from '../../../data/mentors';
import type { ApiHandler } from '../../../types';
import type { ApplicationStatus } from '../types';
import { success } from '../../../utils/response';

export const handler: ApiHandler<{ status: ApplicationStatus }, User> = async (event, context) => {
  const { applicationId } = event.queryStringParameters || {};
  const { status } = event.parsedBody || {};

  if (!applicationId || !status) {
    return { statusCode: 400, body: 'Bad request' };
  }

  const { data, isNew } = await upsertApplication({
    _id: new ObjectId(applicationId),
    status,
  });

  return success({
    data,
    isNew,
  });
}