import countries from 'svg-country-flags/countries.json';
import { Status } from '../helpers/mentorship';

type BaseDBObject = {
  _id: string;
  createdAt: string;
};

type Country = keyof typeof countries;
type UserRole = 'Admin' | 'Mentor' | 'User';
type Channel = {
  id: string;
  type: string;
};

export type User = BaseDBObject & {
  name: string;
  title: string;
  email: string;
  email_verified: boolean;
  tags: string[];
  avatar?: string;
  country: Country;
  roles: UserRole[];
  available: boolean;
  description?: string;
  spokenLanguages: string[];
  channels: Channel[];
  createdAt: string;
};
export type Mentor = User & {};
type ApplicationStatus = 'Pending' | 'Approved' | 'Rejected';
export type Application = BaseDBObject & {
  status: ApplicationStatus;
  reason?: string;
};

export type MentorshipUser = Pick<User, '_id' | 'avatar' | 'name' | 'email' | 'title' | 'available'>;
export type MentorshipRequest = {
  _id: string;
  status: Status;
  createdAt: string;
  message: string;
  background: string;
  expectation: string;
  isMine: boolean;
  mentor: MentorshipUser;
  mentee: MentorshipUser;
  readonly reminderSentAt?: string;
};

export enum UserRecordType {
  MentorNotResponding = 1
}

export type UserRecord = BaseDBObject & {
  userId: string;
  type: UserRecordType;
}