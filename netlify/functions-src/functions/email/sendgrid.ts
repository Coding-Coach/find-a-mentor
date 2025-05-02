import sgMail from '@sendgrid/mail';
import type { SendData } from './interfaces/email.interface';
import Config from '../config';

sgMail.setApiKey(Config.sendGrid.API_KEY);

export const sendEmail = async (payload: SendData) => {
  try {
    const msg = {
      to: payload.to,
      from: Config.email.FROM,
      subject: payload.subject,
      html: payload.html,
    };

    const result = await sgMail.send(msg);
    console.log('Email sent:', msg, result);
    return result;
  } catch (error) {
    console.error('Error sending email:', error);
    throw new Error('Failed to send email');
  }
}