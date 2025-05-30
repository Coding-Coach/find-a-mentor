import type { Application } from '../modules/mentors/types';
import type { UpsertResult } from './types';
import { upsertEntityByCondition } from './utils';
import { getCollection } from '../utils/db';
import { ObjectId, type Filter, type MatchKeysAndValues } from 'mongodb';
import type { User } from '../common/interfaces/user.interface';

export const upsertApplication = async (application: MatchKeysAndValues<Application>): UpsertResult<Application> => {
  const filter: Filter<Application> = {
    user: application.user,
  };

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

type ApproveApplicationResult = {
  application: Application;
  user: User;
}

export const respondToApplication = async (
  applicationId: string,
  status: Application['status'],
  reason?: string
): Promise<Application> => {
  const applicationsCollection = getCollection<Application>('applications');

  const updatedApplication = await applicationsCollection.findOneAndUpdate(
    { _id: new ObjectId(applicationId) },
    { $set: { status, reason } },
    { returnDocument: 'after' }
  );

  if (!updatedApplication) {
    throw new Error(`Application ${applicationId} not found`);
  }

  return updatedApplication;
}

export const approveApplication = async (applicationId: string): Promise<ApproveApplicationResult> => {
  const updatedApplication = await respondToApplication(applicationId, 'Approved');
  const usersCollection = getCollection<User>('users');

  const updatedUser = await usersCollection.findOneAndUpdate(
    { _id: updatedApplication.user },
    { $addToSet: { roles: 'Mentor' } },
    { returnDocument: 'after' }
  );

  if (!updatedUser) {
    throw new Error(`User ${updatedApplication.user} not found`);
  }

  return { application: updatedApplication, user: updatedUser };
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