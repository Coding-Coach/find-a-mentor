import { FC } from 'react';
import { Redirect, Route, RouteProps, useLocation } from 'react-router-dom';
import { LazyRoute } from './LazyRoute';
import { RouterLoader } from './RouterLoader';
import { useUser } from '../context/userContext/UserContext';
import { UserRole } from '../types/models';

type AuthorizationRouteProps = RouteProps & {
  roles?: UserRole[];
  lazy?: boolean;
  redirectAfterLogin?: boolean;
};

export const AuthorizationRoute: FC<AuthorizationRouteProps> = ({
  roles,
  children,
  lazy = false,
  redirectAfterLogin = false,
}) => {
  const RouteComponent = lazy ? LazyRoute : Route;

  return (
    <RouteComponent
      render={() => (
        <AuthorizedContent
          roles={roles}
          redirectAfterLogin={redirectAfterLogin}
        >
          {children}
        </AuthorizedContent>
      )}
    />
  );
};

const AuthorizedContent: FC<{
  roles?: UserRole[];
  redirectAfterLogin: boolean;
}> = ({ children, roles, redirectAfterLogin }) => {
  const { currentUser, isLoading } = useUser();
  const { pathname, search } = useLocation();
  const redirect = () => (
    <Redirect
      to={`/${redirectAfterLogin ? `?from=${pathname}${search}` : ''}`}
    />
  );

  if (isLoading) {
    return <RouterLoader />;
  }

  if (!currentUser) {
    return redirect();
  }

  const authorized =
    !roles || currentUser.roles.some(role => roles.includes(role));

  if (authorized) {
    return <>{children}</>;
  }

  return redirect();
};
