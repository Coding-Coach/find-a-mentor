import type { ObjectId } from 'mongodb';
import { getCollection } from '../utils/db'
import { Status, type Mentorship } from '../interfaces/mentorship';
import type { CreateEntityPayload } from './types';

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

export const createMentorship = async (mentorship: CreateEntityPayload<Mentorship>) => {
  const mentorshipsCollection = getCollection('mentorships');
  await mentorshipsCollection.insertOne(mentorship);
  return mentorship;
}