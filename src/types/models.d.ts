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
export type Application = BaseDBObject & {};

export type MentorshipUser = Pick<User, 'avatar' | 'name' | 'email' | 'title' | 'available'> & { id: string };
export type MentorshipRequest = {
  id: string;
  status: Status;
  date: string;
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