import { ObjectId, type Filter } from 'mongodb';
import { Document } from 'bson'
import { HandlerEvent } from '@netlify/functions';
import { getCollection } from '../../utils/db';
import { error, success } from '../../utils/response';
import { upsertMentorship } from '../../data/mentorships';
import type { Mentorship } from '../../interfaces/mentorship';
import type { HandlerEventWithBody } from '../../types';
import { DataError } from '../../data/errors';

const getMentorships = async (query: Record<string, string | undefined>): Promise<any[]> => {
  const mentorshipsCollection = getCollection('mentorships');

  const userId = query.userId;
  if (!userId) {
    throw new Error('User ID is required');
  }

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
        // Add createdAt field derived from _id.getTimestamp()
        createdAt: { $toDate: "$_id" }
      }
    },
    {
      $project: {
        // Include all original fields from the mentorship
        _id: 1,
        mentor: 1,
        mentee: 1,
        status: 1,
        createdAt: 1, // Include the derived createdAt field
        updatedAt: 1,
        message: 1,
        background: 1,
        expectation: 1,
        isMine: 1
      }
    }
  ]).toArray();
};

const updateMentorshipHandler = async (event: HandlerEventWithBody<Partial<Mentorship>>) => {
  const { mentorshipId } = event.queryStringParameters || {};
  const { reason, status } = event.parsedBody || {};
  if (!mentorshipId || !status) {
    return error('Mentorship ID and status are required', 400);
  }

  try {
    const mentorshipToUpsert = {
      _id: new ObjectId(mentorshipId),
      status,
      reason,
    };
    const upsertedMentorship = await upsertMentorship(mentorshipToUpsert);
    return success({ mentorship: upsertedMentorship });
  } catch (e) {
    if (e instanceof DataError) {
      return error(e.message, e.statusCode);
    }
    return error(e.message, 500);
  }
};

const mentorshipHandler = async (event: HandlerEvent) => {
  try {
    const query = event.queryStringParameters || {};
    const mentorships = await getMentorships(query);
    return success({ data: mentorships });
  } catch (err) {
    return error(err.message, 400);
  }
};

export const handler = mentorshipHandler;
export const updateRequestHandler = updateMentorshipHandler;
