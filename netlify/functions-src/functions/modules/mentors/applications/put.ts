import type { User } from '../../../common/interfaces/user.interface';
import { approveApplication, respondToApplication } from '../../../data/mentors';
import type { ApiHandler } from '../../../types';
import type { Application } from '../types';
import { error, success } from '../../../utils/response';
import { sendApplicationApprovedEmail, sendApplicationDeclinedEmail } from '../../../email/emails';
import { getUserBy } from '../../../data/users';

// update application by admin
export const handler: ApiHandler<Pick<Application, 'status' | 'reason'>, User> = async (event, context) => {
  const { applicationId } = event.queryStringParameters || {};
  const { status, reason } = event.parsedBody || {};

  if (!applicationId || !status) {
    return { statusCode: 400, body: 'Bad request' };
  }

  if (status === 'Approved') {
    try {
      const { user, application } = await approveApplication(applicationId);
      sendApplicationApprovedEmail({ name: user.name, email: user.email });

      return success({
        data: application,
      });
    } catch (e) {
      return error(e.message, 500);
    }
  }

  if (status === 'Rejected') {
    const application = await respondToApplication(applicationId, status, reason);
    const user = await getUserBy('_id', application.user);
    if (user) {
      sendApplicationDeclinedEmail({ name: user.name, email: user.email, reason: application.reason! });
    }

    return success({
      data: application,
    });
  }

  return error(`Invalid status ${status}`, 400);
}
