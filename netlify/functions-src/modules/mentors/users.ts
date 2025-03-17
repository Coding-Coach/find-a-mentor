import { Handler } from '@netlify/functions';
import { handler as usersCurrentHandler } from '../users/current'

const handlers = {
  CURRENT: usersCurrentHandler,
}

export const handler: Handler = async (event, context) => {
  const { path: requestPath } = event;
  const [,, module, submodule] = requestPath.split('/');

  if (!module || !submodule) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'Invalid request path' }),
    };
  }

  try {
    const moduleHandler = handlers[submodule.toUpperCase()];
    if (!moduleHandler) {
      throw new Error('Handler not found');
    }

    return await moduleHandler(event, context);
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message }),
    };
  }
};