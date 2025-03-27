import { ObjectId } from 'mongodb';
import type { User } from '../common/interfaces/user.interface';
import { getCollection } from '../utils/db';
import { upsertEntity } from './utils';

export const getUserById = async (id: string, currentUserAuth0Id?: string) => {
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
    // {
    //   $lookup: {
    //     from: 'mentorships',
    //     localField: '_id',
    //     foreignField: 'mentee',
    //     as: 'mentorships',
    //   },
    // },
    // {
    //   $addFields: {
    //     isMentorOfCurrentUser: {
    //       $in: [
    //         currentUserAuth0Id,
    //         {
    //           $map: {
    //             input: '$mentorships',
    //             as: 'mentorship',
    //             in: {
    //               $cond: {
    //                 if: { $eq: ['$$mentorship.status', 'approved'] },
    //                 then: '$$mentorship.mentee',
    //                 else: null,
    //               },
    //             },
    //           },
    //         },
    //       ],
    //     },
    //   },
    // },
    // {
    //   $addFields: {
    //     channels: {
    //       $cond: {
    //         if: '$isMentorOfCurrentUser',
    //         then: '$channels',
    //         else: [],
    //       },
    //     },
    //   },
    // },
    // { $unset: 'isMentorOfCurrentUser' },
  ]).next();

  return user;
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
