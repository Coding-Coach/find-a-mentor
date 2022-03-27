import { useRouter } from 'next/router';
import { User } from '../types/models';

export const useRoutes = () => {
  const { query } = useRouter();
  const getUrlWithFilterParams = (url: string) => {
    const entries = Object.entries(query);
    if (entries.length === 0) {
      return url;
    }
    const currentQuery = entries.reduce(
      (acc, [key, value]) => [...acc, `${key}=${value}`],
      []
    );
    return `${url}?${currentQuery.join('&')}`;
  };

  return {
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
};
