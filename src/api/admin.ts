import ApiService, { paths } from '.';
import { MentorshipRequest, UserRecord } from '../types/models';

export function getAllMentorshipRequests(apiService: ApiService, numMonthAgo: number = 1) {
  const monthAgo = new Date();
  monthAgo.setMonth(monthAgo.getMonth() - numMonthAgo);
  return apiService.makeApiCall<MentorshipRequest[]>(`${paths.MENTORSHIP}/requests`, {
    from: monthAgo,
  });
}

export async function sendStaledRequestEmail(apiService: any, mentorshipId: string) {
  await apiService.makeApiCall(
    `${paths.MENTORSHIP}/requests/${mentorshipId}/reminder`,
    null,
    'PUT'
  );
}

export async function sendMentorNotActive(apiService: ApiService, mentorId: string) {
  const response = await apiService.makeApiCall<UserRecord>(
    `${paths.ADMIN}/mentor/${mentorId}/notActive`,
    null,
    'PUT'
  );
  if (response?.success) {
    return response.data;
  }
}

export async function freezeMentor(apiService: any, mentorId: string) {
  await apiService.makeApiCall(`${paths.ADMIN}/mentor/${mentorId}/freeze`, null, 'PUT');
}

export function getUserRecords(apiService: ApiService, userId: string) {
  return apiService.makeApiCall<UserRecord[]>(`${paths.USERS}/${userId}/records`);
}