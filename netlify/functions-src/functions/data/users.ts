import { ObjectId } from 'mongodb';
import type { User } from '../common/interfaces/user.interface';
import { getCollection } from '../utils/db';
import { upsertEntity } from './utils';

const getUserWithoutChannels = async (id: string) => {
  const { channels, ...user } = await getCollection<User>('users').findOne({ _id: new ObjectId(id) }) || {};
  return user;
}

const getUserWithChannels = async (id: string, currentUserAuth0Id: string) => {
  const user = await getCollection<User>('users').aggregate([
    { $match: { _id: new ObjectId(id) } },
    {
      $lookup: {
        from: 'users',
        let: { auth0Id: currentUserAuth0Id },
        pipeline: [
          {
            $match: {
              $expr: { $eq: ['$auth0Id', '$$auth0Id'] },
            },
          },
          {
            $project: { _id: 1 }, // Only fetch the _id of the current user
          },
        ],
        as: 'currentUser',
      },
    },
    {
      $addFields: {
        currentUserId: { $arrayElemAt: ['$currentUser._id', 0] }, // Extract the current user's _id
      },
    },
    {
      $lookup: {
        from: 'mentorships',
        let: { mentorId: '$_id', currentUserId: '$currentUserId' },
        pipeline: [
          {
            $match: {
              $expr: {
                $and: [
                  { $eq: ['$mentor', '$$mentorId'] },
                  { $eq: ['$mentee', '$$currentUserId'] },
                  { $eq: ['$status', 'Approved'] },
                ],
              },
            },
          },
        ],
        as: 'approvedMentorships',
      },
    },
    {
      $addFields: {
        channels: {
          $cond: {
            if: { $gt: [{ $size: '$approvedMentorships' }, 0] },
            then: '$channels',
            else: [],
          },
        },
      },
    },
  ]).next();

  return user;
}

export const getUserById = async (id: string, currentUserAuth0Id?: string) => {
  if (currentUserAuth0Id) {
    return getUserWithChannels(id, currentUserAuth0Id);
  }
  return getUserWithoutChannels(id);
}

export const getUserByAuthId = async (auth0Id: string) => {
  const user = await getCollection<User>('users')
    .findOne({ auth0Id });

  return user;
}

export const upsertUser = async (user: User) => {
  const upsertedUser = await upsertEntity<User>('users', user);
  return upsertedUser;
}
