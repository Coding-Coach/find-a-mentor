import { FC, useEffect, useMemo } from 'react';
import { Redirect, useLocation } from 'react-router-dom';
import auth from '../../utils/auth';

export const ActionsHandler: FC = ({ children }) => {
  const location = useLocation();
  const query = useMemo(() => new URLSearchParams(location.search), [
    location.search,
  ]);
  const redirectTo = query.get('redirectTo') || '';

  useEffect(() => {
    const redirectedFrom = query.get('from');
    if (redirectedFrom) {
      auth.login(redirectedFrom);
    }
  }, [query]);

  if (redirectTo) {
    return <Redirect to={redirectTo} />;
  }

  return <>{children}</>;
};
