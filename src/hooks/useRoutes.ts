import { useRouter } from 'next/router';
import { User } from '../types/models';

export const useRoutes = () => {
  const { asPath } = useRouter();
  const getUrlWithFilterParams = (url: string) => {
    const queryParamsOnly =
      /(.*)(?<query>\?.*)/.exec(asPath)?.groups.query ?? '';
    return url + queryParamsOnly;
  };

  return {
    root: {
      get: () => getUrlWithFilterParams('/')
    },
    user: {
      get: (userOrUserId: User | string) => {
        return getUrlWithFilterParams(
          `/u/${
            typeof userOrUserId === 'string' ? userOrUserId : userOrUserId._id
          }`
        );
      }
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
