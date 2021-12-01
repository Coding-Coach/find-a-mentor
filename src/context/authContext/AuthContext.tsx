import { createContext, useContext, FC } from 'react';
import Auth from '../../utils/auth'

export const AuthContext = createContext<any>({});

export const AuthProvider: FC = (props: any) => {
    const { children } = props
    const auth = new Auth();
    return <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>
};

export function useAuth(): any {
  const auth = useContext(AuthContext);
  return auth;
}
