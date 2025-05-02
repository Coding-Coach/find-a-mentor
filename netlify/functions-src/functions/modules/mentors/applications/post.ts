import type { User } from '../../../common/interfaces/user.interface';
import { upsertApplication } from '../../../data/mentors';
import { sendMentorApplicationReceived, sendMentorApplicationAdminNotification } from '../../../email/emails';
import type { ApiHandler } from '../../../types';
import { success } from '../../../utils/response';
import type { Application } from '../types';

// create / update application by user
export const handler: ApiHandler<Application, User> = async (event, context) => {
  const application = event.parsedBody!;
  const { data, isNew } = await upsertApplication({
    ...application,
    user: context.user._id,
    status: 'Pending',
  });

  console.log('Application upserted:', data, isNew);

  if (isNew) {
    console.log('Sending mentor application received email:', context.user);
    sendMentorApplicationReceived({
      name: context.user.name,
      email: context.user.email,
    });
    sendMentorApplicationAdminNotification(context.user);
  }

  return success({ data }, isNew ? 201 : 200);
}