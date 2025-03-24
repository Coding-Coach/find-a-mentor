import { ObjectId } from 'mongodb';
import { getCollection } from '../utils/db'
import { Status, type Mentorship } from '../interfaces/mentorship';
import { DataError } from './errors';
import { upsertEntity } from './utils';
import type { EntityPayload } from './types';

export const findMentorship = async (mentorId: ObjectId, userId: ObjectId) => {
  const mentorship = getCollection('mentorships')
    .find({
      mentor: mentorId,
      mentee: userId
    });

  return mentorship[0];
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