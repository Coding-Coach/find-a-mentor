import { ObjectId } from 'mongodb';
import type { User } from '../common/interfaces/user.interface';
import { getCollection } from '../utils/db';
import { upsertEntity } from './utils';

export const getUserById = async (id: string) => {
  const user = await getCollection<User>('users')
    .findOne({ _id: new ObjectId(id) });

  return user;
}

export const getUserByAuthId = async (auth0Id: string) => {
  const user = await getCollection<User>('users')
    .findOne({ auth0Id });

  return user;
}

export const upsertUser = async (user: User) => {
  const upsertedUser = await upsertEntity<User>('users', user);
  return upsertedUser;
}
