import { auth0Service } from '../../common/auth0.service';
import type { User } from '../../common/interfaces/user.interface';
import { sendEmailVerification } from '../../email/emails';
import type { ApiHandler } from '../../types';
import { error, success } from '../../utils/response';

export const handler: ApiHandler<void, User> = async (_event, context) => {
  try {
    const { auth0Id, name, email } = context.user;
    const { ticket } = await auth0Service.createVerificationEmailTicket(auth0Id);
    await sendEmailVerification({
      name,
      email,
      link: ticket,
    });

    return success({ data: { message: 'Verification email sent successfully' } });
  } catch (e) {
    console.error('Error sending verification email:', e);
    return error('Error sending verification email', 500);
  }
}