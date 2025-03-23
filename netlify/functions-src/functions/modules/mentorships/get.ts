import { HandlerEvent } from '@netlify/functions';
import { getCollection } from '../../utils/db';
import { withErrorHandling, error, success } from '../../utils/response';
import { ObjectId } from 'mongodb'; // Import ObjectId for proper ID handling

const getMentorships = async (query: any): Promise<any[]> => {
  const mentorshipsCollection = getCollection('mentorships');

  const userId = query.userId;
  if (!userId) {
    throw new Error('User ID is required');
  }

  const filter: any = {
    $or: [
      { mentor: userId },
      { mentee: userId },
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

  return mentorshipsCollection.find(filter).toArray();
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

export const handler = withErrorHandling(mentorshipHandler);