import { getUserById } from '../../data/users';
import type { ApiHandler } from '../../types';
import { upsertMentorship, findMentorship, getOpenRequestsCount } from '../../data/mentorships';
import { Status, type Mentorship } from '../../interfaces/mentorship';
import { error, success } from '../../utils/response';
import type { CreateEntityPayload } from '../../data/types';
import { sendMentorshipRequest } from '../../email/emails';
import type { User } from '../../common/interfaces/user.interface';

const ALLOWED_OPEN_MENTORSHIPS = 5;

const applyForMentorshipHandler: ApiHandler<CreateEntityPayload<Mentorship>, User> = async (event, context) => {
  const mentorId = event.queryStringParameters?.mentorId;
  const mentorshipData = event.parsedBody;
  const { user: current } = context;

  if (!mentorId) {
    return error('mentorId and current userId is required');
  }

  if (current._id.equals(mentorId)) {
    return error('Are you planning to mentor yourself?', 400);
  }

  if (!mentorshipData) {
    return error('Mentorship data is required');
  }

  const mentor = await getUserById(mentorId);

  if (!mentor) {
    return error('Mentor not found', 404);
  }

  if (!mentor.available) {
    return error('Mentor is not available', 400);
  }

  const mentorship: Mentorship = await findMentorship(
    mentor._id,
    current._id,
  );

  if (mentorship) {
    return error('A mentorship request already exists', 400);
  }

  const openMentorships = await getOpenRequestsCount(
    current._id,
  );
  if (openMentorships >= ALLOWED_OPEN_MENTORSHIPS) {
    return error(
      'You reached the maximum of open requests. Please wait a little longer for responses or cancel some of the requests',
    );
  }

  const createdMentorship = await upsertMentorship({
    ...mentorshipData,
    mentor: mentor._id,
    mentee: current._id,
    status: Status.NEW,
  });

  try {
    await sendMentorshipRequest({
      menteeName: current.name,
      email: mentor.email,
      mentorName: mentor.name,
      message: mentorshipData.message,
      background: mentorshipData.background,
      expectation: mentorshipData.expectation,
      menteeEmail: current.email,
    })
  } catch (error) {
    console.error('Failed to send email');
  }

  return success({ data: createdMentorship });
}

export const handler = applyForMentorshipHandler;