import { FC } from 'react';
import { Redirect, Route, RouteProps } from 'react-router-dom';
import { useUser } from '../context/userContext/UserContext';
import { UserRole } from '../types/models';

type AuthorizationRouteProps = RouteProps & {
  role: UserRole;
};

export const AuthorizationRoute: FC<AuthorizationRouteProps> = ({
  role,
  children,
}) => {
  const { currentUser } = useUser();

  return (
    <Route
      render={() =>
        currentUser?.roles.includes(role) ? (
          <>{children}</>
        ) : (
          <Redirect to="/" />
        )
      }
    />
  );
};
