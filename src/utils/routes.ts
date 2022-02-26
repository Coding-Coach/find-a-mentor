import { User } from '../types/models';

export const urls = {
  user: {
    get: (user: User) => `/u/${user._id}`,
  },
  me: {
    get: () => '/me',
    requests: {
      get: () => '/me/requests',
    },
    admin: {
      get: () => '/me/admin',
    },
  },
};
