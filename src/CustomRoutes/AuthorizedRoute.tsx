import { FC } from 'react';
import { Redirect, Route, RouteProps, useLocation } from 'react-router-dom';
import { LazyRoute } from './LazyRoute';
import { RouterLoader } from './RouterLoader';
import { useUser } from '../context/userContext/UserContext';
import { UserRole } from '../types/models';

type AuthorizationRouteProps = RouteProps & {
  role: UserRole;
  lazy?: boolean;
  redirectAfterLogin?: boolean;
};

export const AuthorizationRoute: FC<AuthorizationRouteProps> = ({
  role,
  children,
  lazy = false,
  redirectAfterLogin = false,
}) => {
  const RouteComponent = lazy ? LazyRoute : Route;

  return (
    <RouteComponent
      render={() => (
        <AuthorizedContent role={role} redirectAfterLogin={redirectAfterLogin}>
          {children}
        </AuthorizedContent>
      )}
    />
  );
};

const AuthorizedContent: FC<{
  role: UserRole;
  redirectAfterLogin: boolean;
}> = ({ children, role, redirectAfterLogin }) => {
  const { currentUser, isLoading } = useUser();
  const { pathname, search } = useLocation();

  if (isLoading) {
    return <RouterLoader />;
  }

  return currentUser?.roles.includes(role) ? (
    <>{children}</>
  ) : (
    <Redirect
      to={`/${redirectAfterLogin ? `?from=${pathname}${search}` : ''}`}
    />
  );
};
