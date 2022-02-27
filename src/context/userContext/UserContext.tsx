import React, { FC, useContext, useEffect, useState } from 'react';
import { User } from '../../types/models';
import { useAuth } from '../authContext/AuthContext';
import { useApi } from '../apiContext/ApiContext';

type UserProviderContext = {
  isAdmin: boolean;
  isMentor: boolean;
  isLoading: boolean;
  currentUser?: User;
  isAuthenticated: boolean;
  updateCurrentUser(user: User): void;
  logout(): void;
};

const UserContext = React.createContext<UserProviderContext | undefined>(
  undefined
);

export const UserProvider: FC = ({ children }) => {
  const [isLoading, setIsloading] = useState(true);
  const [currentUser, updateCurrentUser] = useState<User>();
  const auth = useAuth();
  const api = useApi();
  const isAuthenticated = auth.isAuthenticated();
  const isMentor = !!currentUser?.roles?.includes('Mentor');
  const isAdmin = !!currentUser?.roles?.includes('Admin');

  const logout = () => {
    auth.doLogout(api);
  };

  useEffect(() => {
    api.getCurrentUser().then((user) => {
      updateCurrentUser(user);
      setIsloading(false);
    });
  }, [api]);

  return (
    <UserContext.Provider
      value={{
        isAdmin,
        isMentor,
        isLoading,
        currentUser,
        isAuthenticated,
        logout,
        updateCurrentUser,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

type ShouldForceRequired<T> = T extends false
  ? UserProviderContext
  : Required<UserProviderContext>;

export const useUser = <
  ExpectedNotNull extends boolean
>(): ShouldForceRequired<ExpectedNotNull> => {
  const userContext = useContext(UserContext);
  if (!userContext) {
    throw new Error(`"useUser" has to be called inside UserProvider`);
  }
  return userContext as ShouldForceRequired<ExpectedNotNull>;
};

export default UserContext;
