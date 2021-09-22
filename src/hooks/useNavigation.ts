import { RouteProps, useHistory, useLocation } from 'react-router';
import { User } from '../types/models';

export const useNavigation = () => {
  const history = useHistory<{ prev: RouteProps['location'] }>();
  const location = useLocation();
  if (!history || !location) {
    throw new Error('useNavigation should have been called within <Router />');
  }

  const getUserRoute = (user: User) => {
    return {
      pathname: `/u/${user._id}`,
      search: location.search,
      state: { prev: location },
    };
  };

  const getPreviousRoute = (fallback: string = '/') => {
    return history.location.state?.prev || fallback;
  };

  const navigateToUser = (user: User) => {
    history.push(getUserRoute(user));
  };

  return {
    getUserRoute,
    navigateToUser,
    getPreviousRoute,
  };
};
