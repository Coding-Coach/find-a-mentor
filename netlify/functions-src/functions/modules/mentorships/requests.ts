import { ObjectId } from 'mongodb';
import { HandlerEvent } from '@netlify/functions';
import { getCollection } from '../../utils/db';
import { error, success } from '../../utils/response';
import { getMenteeOpenRequestsCount, getMentorContactURL, getMentorships, upsertMentorship } from '../../data/mentorships';
import { Status, type Mentorship } from '../../interfaces/mentorship';
import type { ApiHandler } from '../../types';
import { DataError } from '../../data/errors';
import { sendMentorshipAccepted, sendMentorshipDeclined, sendMentorshipRequestCancelled } from '../../email/emails';
import type { User } from '../../common/interfaces/user.interface';

export const updateMentorshipRequestHandler: ApiHandler<Mentorship, User> = async (event, context) => {
  const { mentorshipId } = event.queryStringParameters || {};
  const { reason, status } = event.parsedBody || {};
  const { user: mentor } = context;

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
    if (!upsertedMentorship) {
      return error(`mentorships ${mentorshipId} not found`, 404);
    }

    // send emails async
    (async () => {
      const mentee = await getCollection('users').findOne({ _id: upsertedMentorship.mentee });
      if (!mentee) {
        throw new DataError(404, 'Mentor or mentee not found');
      }
      if (status === Status.APPROVED) {
        const contactURL = getMentorContactURL(mentor);
        const openRequests = await getMenteeOpenRequestsCount(upsertedMentorship.mentee);

        sendMentorshipAccepted({
          menteeName: mentee.name,
          email: mentee.email,
          mentorName: mentor.name,
          contactURL,
          openRequests,
        });
      }
      if (status === Status.REJECTED) {
        sendMentorshipDeclined({
          menteeName: mentee.name,
          mentorName: mentor.name,
          bySystem: false,
          email: mentee.email,
          reason: upsertedMentorship.reason!
        });
      }

      if (status === Status.CANCELLED) {
        sendMentorshipRequestCancelled({
          email: mentee.email,
          menteeName: mentee.name,
          mentorName: mentor.name,
          reason: upsertedMentorship.reason!
        })
      }
    })();

    return success({ data: upsertedMentorship });
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
