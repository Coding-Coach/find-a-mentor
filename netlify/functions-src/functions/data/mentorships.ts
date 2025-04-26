import { ObjectId, type Filter } from 'mongodb';
import { getCollection } from '../utils/db'
import { Status, type Mentorship } from '../interfaces/mentorship';
import { upsertEntity } from './utils';
import type { EntityPayload } from './types';
import { ChannelName, type User } from '../common/interfaces/user.interface';
import { buildMailToURL, buildSlackURL } from '../utils/contactUrl';

export const getMentorships = async (query: Record<string, string | undefined>): Promise<any[]> => {
  const mentorshipsCollection = getCollection('mentorships');

  const userId = query.userId;
  if (!userId) {
    throw new Error('User ID is required');
  }

  // TODO: - validate that either it's admin or the userId is the same as the one in the token
  const filter: Filter<Document> = {
    $or: [
      { mentor: new ObjectId(userId) },
      { mentee: new ObjectId(userId) },
    ],
  };

  if (query.id) {
    try {
      const objectId = new ObjectId(query.id); // Convert the ID to ObjectId
      filter._id = objectId;
    } catch {
      throw new Error('Invalid mentorship ID');
    }
  }

  if (query.from) {
    filter.createdAt = { $gte: new Date(query.from) };
  }

  // Create an aggregation pipeline that includes the full user objects
  return mentorshipsCollection.aggregate([
    { $match: filter },
    {
      $lookup: {
        from: 'users',
        localField: 'mentor',
        foreignField: '_id',
        as: 'mentorData'
      }
    },
    {
      $lookup: {
        from: 'users',
        localField: 'mentee',
        foreignField: '_id',
        as: 'menteeData'
      }
    },
    {
      $addFields: {
        mentor: { $arrayElemAt: ['$mentorData', 0] },
        mentee: { $arrayElemAt: ['$menteeData', 0] },
        // Add isMine field that checks if mentee._id equals userId
        isMine: {
          $eq: [
            { $toString: { $arrayElemAt: ['$menteeData._id', 0] } },
            userId
          ]
        },
      }
    },
  ]).toArray();
};

export const findMentorship = async (mentorId: ObjectId, userId: ObjectId) => {
  const mentorship = getCollection<Mentorship>('mentorships')
    .find({
      mentor: new ObjectId(mentorId),
      mentee: new ObjectId(userId),
    });

  const foundMentorship = await mentorship.toArray();
  return foundMentorship[0];
}

export const getOpenRequestsCount = async (userId: ObjectId) => {
  const openRequests = getCollection('mentorships')
    .countDocuments({
      mentee: userId,
      status: {
        $in: [Status.NEW, Status.VIEWED]
      }
    });

  return openRequests;
}

export const upsertMentorship = async (mentorship: EntityPayload<Mentorship>) => {
  const upsertedMentorship = upsertEntity<Mentorship>('mentorships', mentorship);
  return upsertedMentorship;
}

export const getMentorContactURL = (mentor: User) => {
  // slack if exists, otherwise email
  const slackId = mentor.channels?.find(channel => channel.type === ChannelName.SLACK)?.id;
  return buildSlackURL(slackId) || buildMailToURL(mentor.email);
}

export const getMenteeOpenRequestsCount = async (menteeId: ObjectId) => {
  const openRequests = await getCollection('mentorships')
    .countDocuments({
      mentee: menteeId,
      status: {
        $in: [Status.NEW, Status.VIEWED]
      }
    });

  return openRequests;
}
