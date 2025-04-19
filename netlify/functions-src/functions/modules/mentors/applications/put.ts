import { ObjectId } from 'mongodb';
import type { User } from '../../../common/interfaces/user.interface';
import { approveApplication, upsertApplication } from '../../../data/mentors';
import type { ApiHandler } from '../../../types';
import type { ApplicationStatus } from '../types';
import { error, success } from '../../../utils/response';
import { sendApplocationApprovedEmail, sendApplocationDeclinedEmail } from '../../../email/emails';
import { getUserBy } from '../../../data/users';

export const handler: ApiHandler<{ status: ApplicationStatus }, User> = async (event, context) => {
  const { applicationId } = event.queryStringParameters || {};
  const { status } = event.parsedBody || {};

  if (!applicationId || !status) {
    return { statusCode: 400, body: 'Bad request' };
  }

  if (status === 'Approved') {
    try {
      const { user, application } = await approveApplication(applicationId);
      sendApplocationApprovedEmail({ name: user.name, email: user.email });

      return success({
        data: application,
      });
    } catch (e) {
      return error(e.message, 500);
    }
  }

  const { data, isNew } = await upsertApplication({
    _id: new ObjectId(applicationId),
    status,
  });

  if (status === 'Rejected') {
    const user = await getUserBy('_id', data.user);
    if (user) {
      sendApplocationDeclinedEmail({ name: user.name, email: user.email, reason: data.reason! });
    }
  }

  return success({
    data,
    isNew,
  });
}