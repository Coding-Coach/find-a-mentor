import React, { FC, useContext, useState } from 'react';
import { User } from '../../types/models';

type UserProviderContext = {
  isAdmin: boolean;
  isMentor: boolean;
  currentUser?: User;
  updateCurrentUser(user: User): void;
};

const UserContext = React.createContext<UserProviderContext | undefined>(
  undefined
);

export const UserProvider: FC = ({ children }) => {
  const [currentUser, updateCurrentUser] = useState<User | undefined>(
    undefined
  );
  const isMentor = !!currentUser?.roles?.includes('Mentor');
  const isAdmin = !!currentUser?.roles?.includes('Admin');

  return (
    <UserContext.Provider
      value={{ currentUser, isMentor, isAdmin, updateCurrentUser }}
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
