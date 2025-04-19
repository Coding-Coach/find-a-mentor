import type { ObjectId, OptionalId } from 'mongodb'
import type { PaginationParams } from '../../types'

export interface Mentor {
  _id: string
  name: string
  email: string
  title?: string
  company?: string
  tags?: string[]
  country?: string
  spokenLanguages?: string[]
  avatar?: string
}

export type ApplicationStatus = 'Pending' | 'Approved' | 'Rejected';
export type Application = OptionalId<{
  user: ObjectId;
  status: ApplicationStatus;
  reason?: string;
}>;

export interface GetMentorsQuery {
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
