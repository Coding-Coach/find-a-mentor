import type { ObjectId } from 'mongodb'

export enum ChannelName {
  EMAIL = 'email',
  SLACK = 'slack',
  LINKED = 'linkedin',
  FACEBOOK = 'facebook',
  TWITTER = 'twitter',
  GITHUB = 'github',
  WEBSITE = 'website',
}

export interface Channel extends Document {
  readonly type: ChannelName;
  readonly id: string;
}

export interface User {
  readonly _id: ObjectId;
  available?: boolean;
  auth0Id: string;
  email: string;
  name: string;
  avatar?: string;
  roles: Role[];
  country?: string;
  image?: {
    filename: string;
  };
  channels?: Channel[];
  createdAt: Date;
  spokenLanguages?: string[];
  tags?: string[];
}

export type ApplicationUser = User & {
  email_verified: boolean;
  picture: string;
}

export enum Role {
  ADMIN = 'Admin',
  MEMBER = 'Member',
  MENTOR = 'Mentor'
}
