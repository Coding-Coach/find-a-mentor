import { getApplications } from '../../../data/mentors';
import type { ApiHandler } from '../../../types'
import { success } from '../../../utils/response';

export const handler: ApiHandler = async (event) => {
  const status = event.queryStringParameters?.status;
  const applications = await getApplications(status);

  return success({ data: applications });
}