import type { Application } from '../modules/mentors/types';
import type { UpsertResult } from './types';
import { upsertEntityByCondition } from './utils';
import { getCollection } from '../utils/db';
import { ObjectId, type Filter, type MatchKeysAndValues } from 'mongodb';

export const upsertApplication = async (application: MatchKeysAndValues<Application>): UpsertResult<Application> => {
  const filter: Filter<Application> = {};
  if (application._id) {
    filter._id = new ObjectId(application._id);
  }

  const { data: upsertedApplication, isNew } = await upsertEntityByCondition<Application>(
    'applications',
    filter,
    application,
  );

  return {
    data: upsertedApplication,
    isNew,
  };
}

export const getApplications = async (status?: string): Promise<Application[]> => {
  const collection = getCollection<Application>('applications');
  const filter: any = {};
  if (status) {
    filter.status = status;
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