/* eslint-disable no-restricted-syntax */
import { isSsr } from '../helpers/ssr';
import type { MentorshipRequest, User } from '../types/models';

type PersistDataKeyMap = {
  user: User;
  'mentorship-request': Pick<MentorshipRequest, 'expectation' | 'background' | 'message'>;
}

type PersistDataKey = keyof PersistDataKeyMap;

export const getPersistData = <T extends PersistDataKey>(key: T): PersistDataKeyMap[T] | null => {
  if (isSsr()) {
    return null;
  }
  const item = localStorage.getItem(key);
  if (!item) {
    return null;
  }
  try {
    return JSON.parse(item);
  } catch (error) {
    console.error(`Error parsing value from localStorage for key "${key}":`, error);
    return null;
  }
}
export const setPersistData = <T extends PersistDataKey>(key: T, value: PersistDataKeyMap[T]): void => {
  try {
    const serializedValue = JSON.stringify(value);
    localStorage.setItem(key, serializedValue);
  } catch (error) {
    console.error(`Error setting value to localStorage for key "${key}":`, error);
  }
}
export const removeFromLocalStorage = (key: PersistDataKey): void => {
  try {
    localStorage.removeItem(key);
  } catch (error) {
    console.error(`Error removing value from localStorage for key "${key}":`, error);
  }
}
