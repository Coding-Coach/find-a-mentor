import type { User } from '../../../common/interfaces/user.interface';
import { upsertApplication } from '../../../data/mentors';
import { sendMentorApplicationReceived, sendMentorApplicationAdminNotification } from '../../../email/emails';
import type { ApiHandler } from '../../../types';
import { success } from '../../../utils/response';
import type { Application } from '../types';
import { checkAvatar } from './avatarCheck';

// create / update application by user
export const handler: ApiHandler<Application, User> = async (event, context) => {
  const application = event.parsedBody!;
  // Flags applications whose avatar has no detectable face so an admin looks at them.
  // It never blocks the application, and it's always computed here (after the spread
  // below) so a client can't send its own result.
  const avatarCheck = await checkAvatar(context.user.avatar);
  const { data, isNew } = await upsertApplication({
    ...application,
    user: context.user._id,
    status: 'Pending',
    avatarCheck,
  });

  if (isNew) {
    console.log('Sending mentor application received email:', context.user._id);
    try {
      await sendMentorApplicationReceived({
        name: context.user.name,
        email: context.user.email,
      });
      await sendMentorApplicationAdminNotification(context.user, avatarCheck);
    } catch (error) {
      console.error('Error sending mentor application received email:', error);
    }
  }

  return success({ data }, isNew ? 201 : 200);
}
