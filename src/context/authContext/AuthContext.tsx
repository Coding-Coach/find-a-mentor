import { createContext, useContext, FC, useEffect, useState } from 'react';
import { isSsr } from '../../helpers/ssr';
import Auth from '../../utils/auth';

export const AuthContext = createContext<any>({});
const auth = new Auth();

export const AuthProvider: FC = (props: any) => {
  const { children } = props;
  const [isLoading, setIsLoading] = useState(!isSsr() /* ssr doesn't need loader */);

  useEffect(() => {
    auth.renewSession().finally(() => {
      setIsLoading(false);
    });
  }, []);

  if (isLoading) {
    return <></>;
  }

  return <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>;
};

export function useAuth(): Auth {
  const auth = useContext(AuthContext);
  return auth;
}
