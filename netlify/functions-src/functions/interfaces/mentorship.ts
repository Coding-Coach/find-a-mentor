import { ObjectId } from 'mongodb';

export enum Status {
  NEW = 'New',
  VIEWED = 'Viewed',
  APPROVED = 'Approved',
  REJECTED = 'Rejected',
  CANCELLED = 'Cancelled',
  TERMINATED = 'Terminated',
}

export interface Mentorship {
  readonly _id: ObjectId;
  readonly mentor: ObjectId;
  readonly mentee: ObjectId;
  status: Status;
  readonly message: string;
  readonly goals: string[];
  readonly expectation: string;
  readonly background: string;
  reason?: string;
  readonly createdAt: Date;
  readonly updatedAt: Date;
  readonly reminderSentAt?: Date;
}
