import type { SendData } from './interfaces/email.interface';
import Config from '../config';

type Smpt2GoRespomse = {
  request_id: string;
  data: {
    succeeded: number;
    failed: number;
    failures: string[];
    email_id: string;
  };
};

export const sendEmail = async (payload: SendData) => {
  try {
    const emailData = {
      api_key: Config.smtp2go.API_KEY,
      to: [payload.to],
      sender: Config.email.FROM,
      subject: payload.subject,
      html_body: payload.html,
    };

    console.log('Sending email via SMTP2GO:', payload.to, payload.subject);

    const response = await fetch('https://api.smtp2go.com/v3/email/send', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(emailData),
    });

    if (!response.ok) {
      throw new Error(`SMTP2GO API error: [${response.statusText}] ${await response.text() || 'Unknown error'}`);
    }

    const result: Smpt2GoRespomse = await response.json();

    if (result.data.failed > 0) {
      console.error('SMTP2GO email sending failed:', result.data.failures);
      throw new Error(`SMTP2GO email sending failed: ${result.data.failures.join(', ')}`);
    }

    console.log('Email sent via SMTP2GO:', result, payload.subject);
    return result;
  } catch (error) {
    console.error('Error sending email via SMTP2GO:', error);
    throw new Error('Failed to send email via SMTP2GO');
  }
};
