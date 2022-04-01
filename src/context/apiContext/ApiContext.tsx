import { createContext, useContext, FC, useMemo } from 'react';
import { AuthContext } from '../authContext/AuthContext';
import ApiService from '../../api';

export const ApiContext = createContext<any>({});

export const ApiProvider: FC = (props: any) => {
    const { children } = props
    const auth = useContext(AuthContext)
    const api = useMemo(() => new ApiService(auth), [auth]) ;
    return <ApiContext.Provider value={api}>{children}</ApiContext.Provider>
};

export function useApi(): any {
  const api = useContext(ApiContext);
  return api;
}
