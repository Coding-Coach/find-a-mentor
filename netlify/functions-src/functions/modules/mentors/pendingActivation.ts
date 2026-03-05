import { getInactiveMentors } from '../../data/mentors';
import type { ApiHandler } from '../../types';
import { success } from '../../utils/response';

export const handler: ApiHandler = async () => {
  const mentors = await getInactiveMentors();
  return success({ data: mentors });
};
