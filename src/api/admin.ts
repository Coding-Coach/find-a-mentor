import { makeApiCall, paths } from '.';
import { MentorshipRequest } from '../types/models';

export async function getAllMentorshipRequests() {
  return makeApiCall<MentorshipRequest[]>(`${paths.MENTORSHIP}/requests`);
}
