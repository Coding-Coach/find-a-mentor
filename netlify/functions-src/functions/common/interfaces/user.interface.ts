import type { ObjectId } from 'mongodb'

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
  channels?: any[];
  createdAt: Date;
}

export enum Role {
  ADMIN = 'Admin',
  MEMBER = 'Member',
  MENTOR = 'Mentor'
}
