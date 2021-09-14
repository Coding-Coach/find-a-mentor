import { useHistory, useLocation } from 'react-router';
import { User } from '../types/models';

export const useNavigation = () => {
  const history = useHistory();
  const location = useLocation();
  if (!history || !location) {
    throw new Error('useNavigation should have been called within <Router />');
  }

  const getUserRoute = (user: User) => {
    return {
      pathname: `/u/${user._id}`,
      // search: location.search,
    };
  };

  const navigateToUser = (user: User) => {
    history.push(getUserRoute(user));
  };

  return {
    getUserRoute,
    navigateToUser,
  };
};
