import { getUserByAuthId, getUserById } from '../../data/users';
import type { ApiHandler } from '../../types';
import { upsertMentorship, findMentorship, getOpenRequestsCount } from '../../data/mentorships';
import { Status, type Mentorship } from '../../interfaces/mentorship';
import { error, success } from '../../utils/response';
import type { CreateEntityPayload } from '../../data/types';
import { EmailService } from '../../common/email.service';

const ALLOWED_OPEN_MENTORSHIPS = 5;

const applyForMentorshipHandler: ApiHandler = async (event, context) => {
  const currentUserId = context.user!.auth0Id;
  const mentorId = event.queryStringParameters?.mentorId;
  if (!event.body) {
    return error('mentorship data is required');
  }
  // TODO: use event.parsedBody
  const mentorshipData: CreateEntityPayload<Mentorship> = JSON.parse(event.body);

  if (!mentorId || !currentUserId) {
    return error('mentorId and current userId is required');
  }

  const [current, mentor] = await Promise.all([
    getUserByAuthId(currentUserId),
    getUserById(mentorId),
  ]);

  if (!mentor) {
    return error('Mentor not found', 404);
  }

  if (!current) {
    return error('User not found', 404);
  }

  if (mentor._id.equals(current!._id)) {
    return error(`Are you planning to mentor yourself?`);
  }

  if (!mentor.available) {
    return error('Mentor is not available');
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
    const emailService = new EmailService();
    await emailService.sendLocalTemplate({
      name: 'mentorship-requested',
      to: mentor.email,
      subject: 'Mentorship Requested',
      data: {
        mentorName: mentor.name,
        menteeName: current.name,
        menteeEmail: current.email,
        message: mentorshipData.message,
        background: mentorshipData.background,
        expectation: mentorshipData.expectation,
      },
    });
  } catch (error) {
    console.error('Failed to send email');
  }

  return success(createdMentorship);
}

export const handler = applyForMentorshipHandler;