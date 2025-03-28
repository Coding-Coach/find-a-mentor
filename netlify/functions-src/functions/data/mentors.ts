import { ObjectId } from 'mongodb';
import type { Application } from '../modules/mentors/types';
import type { UpsertResult } from './types';
import { upsertEntityByCondition } from './utils';

export const upsertApplication = async (userId: ObjectId): UpsertResult<Application> => {
  const applicationPayload = {
    user: userId,
    status: 'pending',
  }

  const { data: application, isNew } = await upsertEntityByCondition<Application>(
    'applications',
    { user: userId, status: 'pending' },
    applicationPayload
  );

  return {
    data: application,
    isNew,
  };
}