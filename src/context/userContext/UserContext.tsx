import React, { FC, useContext, useEffect, useState } from 'react';
import { User } from '../../types/models';
import { useAuth } from '../authContext/AuthContext';
import { useApi } from '../apiContext/ApiContext';
import { daysAgo } from '../../helpers/time';
import { getPersistData, setPersistData } from '../../persistData';

type EmailNotVerifiedInfo =
  | {
      isVerified: true;
    }
  | {
      email: string;
      isVerified: false;
      isRegisteredRecently: boolean;
    };

type UserProviderContext = {
  isAdmin: boolean;
  isMentor: boolean;
  isLoading: boolean;
  currentUser?: User;
  emailVerifiedInfo?: EmailNotVerifiedInfo;
  isNotYetVerified: boolean;
  isAuthenticated: boolean;
  isAuthenticatedAndVerified: boolean;
  updateCurrentUser(user: User): void;
  logout(): void;
};

const UserContext = React.createContext<UserProviderContext | undefined>(
  undefined
);

export const UserProvider: FC = ({ children }) => {
  const [isLoading, setIsloading] = useState(true);
  const auth = useAuth();
  const api = useApi();
  const [currentUser, updateCurrentUser] = useState<User>(() =>
    auth.getCurrentUserFromPersistData()
  );
  const [emailVerifiedInfo, setEmailVerifiedInfo] =
    useState<EmailNotVerifiedInfo>();
  const isAuthenticated = auth.isAuthenticated();
  const isAuthenticatedAndVerified = isAuthenticated && emailVerifiedInfo?.isVerified;
  const isMentor = !!currentUser?.roles?.includes('Mentor');
  const isAdmin = !!currentUser?.roles?.includes('Admin');
  const isNotYetVerified = emailVerifiedInfo?.isVerified === false;

  const logout = () => {
    auth.doLogout(api);
  };

  useEffect(() => {
    async function getCurrentUser() {
      const user = await api.getCurrentUser();
      setIsloading(false);
      if (!user) {
        updateCurrentUser(null);
        auth.forgetUser(api);
        return;
      }

      setEmailVerifiedInfo({
        isVerified: Boolean(user.email_verified),
        isRegisteredRecently: daysAgo(user.createdAt) <= 5,
        email: user.email,
      });

      updateCurrentUser(user);
    }
    getCurrentUser();
  }, [api, auth]);

  useEffect(() => {
    setPersistData('user', currentUser);
  }, [currentUser]);

  return (
    <UserContext.Provider
      value={{
        isAdmin,
        isMentor,
        isLoading,
        currentUser,
        emailVerifiedInfo,
        isNotYetVerified,
        isAuthenticated,
        isAuthenticatedAndVerified,
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
