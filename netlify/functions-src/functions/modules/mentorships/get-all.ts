import { HandlerEvent } from '@netlify/functions';
import { getCollection } from '../../utils/db';
import { withErrorHandling, error, success } from '../../utils/response';
import { withAuth } from '../../utils/auth';
import { Role } from '../../common/interfaces/user.interface';

const getMentorships = async (query: any): Promise<any[]> => {
  const mentorshipsCollection = getCollection('mentorships');

  const {from, to} = query;

  const filter: any = {};

  if (from) {
    filter.createdAt = { $gte: new Date(query.from) };
  }
  if (to) {
    filter.createdAt = { $lte: new Date(query.to) };
  }

  return mentorshipsCollection.find(filter).toArray();
};

const getAllMentorshipsHandler = async (event: HandlerEvent) => {
  try {
    const query = event.queryStringParameters || {};
    const mentorships = await getMentorships(query);
    return success({ data: mentorships });
  } catch (err) {
    return error(err.message, 400);
  }
};

export const handler = withAuth(
  withErrorHandling(getAllMentorshipsHandler),
  Role.ADMIN
);