import { Role } from '../../common/interfaces/user.interface';
import type { AuthUser, ApiHandler } from '../../types';
import { withAuth } from '../../utils/auth';
import { getCollection } from '../../utils/db';
import { success } from '../../utils/response';
import type { GetMentorsQuery, GetMentorsResponse, Mentor } from './types';

const getMentors = async (query: GetMentorsQuery, user?: AuthUser): Promise<GetMentorsResponse> => {
  const { tags, country, spokenLanguages, page: pageInQuery = '1', page: limitinQuery = '20' } = query;
  const page = parseInt(pageInQuery);
  const limit = parseInt(limitinQuery);

  const collection = getCollection<Mentor>('users');

  const filter: any = {
    roles: Role.MENTOR,
  };

  if (tags) {
    filter.tags = Array.isArray(tags) ? { $in: tags } : { $in: [tags] };
  }

  if (country) {
    filter.country = country;
  }

  if (spokenLanguages) {
    filter.spokenLanguages = Array.isArray(spokenLanguages)
      ? { $in: spokenLanguages }
      : { $in: [spokenLanguages] };
  }

  const skip = (page - 1) * limit;

  const pipeline = [
    { $match: filter },
    {
      $lookup: {
        from: 'users',
        let: { auth0Id: user?.auth0Id },
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
    { $skip: skip },
    { $limit: limit },
  ];

  const mentors = await collection.aggregate<Mentor>(pipeline).toArray();

  return {
    data: mentors,
    filters: [],
    pagination: {
      hasMore: mentors.length === limit,
      page,
      total: 0, // TODO: implement total count
    },
  };
};

const getMentorsHandler: ApiHandler = async (event, context) => {
  const query = event.queryStringParameters || {}
  const { user } = context;
  const result = await getMentors(query, user)
  return success(result)
}

export const handler = withAuth(getMentorsHandler, {
  authRequired: false,
});
