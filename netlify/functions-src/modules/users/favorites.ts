import type {Handler} from '@netlify/functions'
import { success } from '../../utils/response'

export const handler: Handler = async (event) => {
  return success({
    data: {
      mentors: [],
    },
    params: event.queryStringParameters
  });
}