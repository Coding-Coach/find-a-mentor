import { ObjectId } from 'mongodb';
import type { Application } from '../modules/mentors/types';
import type { UpsertResult } from './types';
import { upsertEntityByCondition } from './utils';
import { getCollection } from '../utils/db';

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

export const getApplications = async (status?: string): Promise<Application[]> => {
  const collection = getCollection<Application>('applications');
  const filter: any = {};
  if (status) {
    filter.status = status?.toUpperCase();
  }

  const pipeline = [
    { $match: filter },
    {
      $lookup: {
        from: 'users',
        localField: 'user',
        foreignField: '_id',
        as: 'user',
      },
    },
    { $unwind: '$user' },
  ];

  return collection.aggregate<Application>(pipeline).toArray();
}