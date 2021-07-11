import { makeApiCall, paths } from '.';
import { MentorshipRequest } from '../types/models';

export function getAllMentorshipRequests() {
  return makeApiCall<MentorshipRequest[]>(`${paths.MENTORSHIP}/requests`);
}

export async function sendStaledRequestEmail(mentorshipId: string) {
  await makeApiCall(
    `${paths.MENTORSHIP}/requests/${mentorshipId}/reminder`,
    null,
    'PUT'
  );
}
