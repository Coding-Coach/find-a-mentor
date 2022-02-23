import { useRouter } from 'next/router';

import { User } from '../types/models';

export const useNavigation = () => {
  const router = useRouter()

  const getUserRoute = (user: User) => {
    return `/u/${user._id}`
  };

  // we would probably need to implement it later
  // const getPreviousRoute = (fallback: string = '/') => {
  //   return history.location.state?.prev || fallback;
  // };

  const navigateToUser = (user: User) => {
    router.push(getUserRoute(user));
  };

  return {
    getUserRoute,
    navigateToUser,
    // getPreviousRoute,
  };
};