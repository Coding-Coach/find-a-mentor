import React, { FC, useContext, useEffect, useState } from 'react';
import { User } from '../../types/models';
import { getCurrentUser } from '../../api';
import auth from '../../utils/auth';

type UserProviderContext = {
  isAdmin: boolean;
  isMentor: boolean;
  isLoading: boolean;
  currentUser?: User;
  isAuthenticated: boolean;
  updateCurrentUser(user: User): void;
};

const UserContext = React.createContext<UserProviderContext | undefined>(
  undefined
);

export const UserProvider: FC = ({ children }) => {
  const [isLoading, setIsloading] = useState(true);
  const [currentUser, updateCurrentUser] = useState<User>();
  const isAuthenticated = auth.isAuthenticated();
  const isMentor = !!currentUser?.roles?.includes('Mentor');
  const isAdmin = !!currentUser?.roles?.includes('Admin');

  useEffect(() => {
    getCurrentUser().then(user => {
      updateCurrentUser(user);
      setIsloading(false);
    });
  }, []);

  return (
    <UserContext.Provider
      value={{
        isAdmin,
        isMentor,
        isLoading,
        currentUser,
        isAuthenticated,
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
