import type { ApiHandler } from '../../types';
import { connectToDatabase } from '../../utils/db';

export const withDB = (handler: ApiHandler): ApiHandler => {
  return async (event, context) => {
    await connectToDatabase()
    return handler(event, context)
  }
}