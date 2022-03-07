import { User } from '../types/models';

export const urls = {
  root: {
    get: () => getUrlWithFilterParams('/'),
  },
  user: {
    get: (user: User) => getUrlWithFilterParams(`/u/${user._id}`),
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

function getUrlWithFilterParams(url) {
  return url + window.location.search
}
