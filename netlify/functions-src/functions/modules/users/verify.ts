import { auth0Service } from '../../common/auth0.service';
import type { User } from '../../common/interfaces/user.interface';
import { send as sendEmail } from '../../email/client';
import type { ApiHandler } from '../../types';
import { error, success } from '../../utils/response';

export const handler: ApiHandler<void, User> = async (_event, context) => {
  try {
    const { auth0Id, name, email } = context.user;
    const { ticket } = await auth0Service.createVerificationEmailTicket(auth0Id);
    await sendEmail({
      name: 'email-verification',
      data: {
        name,
        link: ticket,
      },
      to: email,
      subject: 'Verify your email',
    });

    return success({ data: { message: 'Verification email sent successfully' } });
  } catch (e) {
    console.error('Error sending verification email:', e);
    return error('Error sending verification email', 500);
  }
}