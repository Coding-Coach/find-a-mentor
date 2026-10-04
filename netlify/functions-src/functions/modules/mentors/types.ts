import type { ObjectId, OptionalId } from 'mongodb'
import type { PaginationParams } from '../../types'

export interface Mentor {
  _id: string
  name: string
  email: string
  title?: string
  tags?: string[]
  country?: string
  spokenLanguages?: string[]
  avatar?: string
}

export type ApplicationStatus = 'Pending' | 'Approved' | 'Rejected';

// 'unknown' = the check was skipped or failed, so an admin should look at the photo themselves
export type AvatarCheckStatus = 'face' | 'no-face' | 'unknown';
export type AvatarCheck = {
  status: AvatarCheckStatus;
  avatarUrl?: string;
  checkedAt: Date;
};

export type Application = OptionalId<{
  user: ObjectId;
  status: ApplicationStatus;
  reason?: string;
  avatarCheck?: AvatarCheck;
}>;

export interface GetMentorsQuery {
  available?: boolean
  tags?: string | string[]
  country?: string
  spokenLanguages?: string | string[]
  page?: string
  limit?: string
}

export interface GetMentorsResponse {
  data: Mentor[]
  filters: any[]
  pagination: PaginationParams;
}
