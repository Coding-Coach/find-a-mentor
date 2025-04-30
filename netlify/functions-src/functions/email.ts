import type { Handler } from '@netlify/functions';
import { send } from './email/client';

export const handler: Handler = async (event) => {
  const { to, subject } = event.queryStringParameters || {};

  if (!to || !subject) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'Missing required fields' }),
    };
  }

  try {
    await send({ to, subject, name: 'welcome', data: { name: 'John Doe' } });

    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'Email sent successfully' }),
    };
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Error sending email:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to send email' }),
    };
  }
}