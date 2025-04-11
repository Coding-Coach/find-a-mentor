import { NextRouter, useRouter } from 'next/router';
import { createContext, useContext, FC, useEffect, useState, useCallback, useRef } from 'react';
import { toast } from 'react-toastify';
import { isSsr } from '../../helpers/ssr';
import Auth from '../../utils/auth';

export const AuthContext = createContext<any>({});
const auth = new Auth();

export const AuthProvider: FC = (props: any) => {
  const { children } = props;
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(
    !isSsr() /* ssr doesn't need loader */
  );

  const handleVerificationRedirect = useCallback(() => {
    const {is, success, message} = justVerifiedEmail(router);
    if (is) {
      const text = `Verification result: ${message}`;
      if (success) {
        toast.success(text);
      } else {
        toast.error(text);
      }
      router.push('/');
    }
    return is;
  }, [router])

  useEffect(() => {
    const isJustVerified = handleVerificationRedirect();
    if (isJustVerified) {
      auth.forgetUser();
      return;
    }
    auth
      .renewSession()
      .catch((e) => {
        toast.error(
          <>
            <div>Something went wrong, please login again</div>
            <div>If the problem persists, please contact us.</div>
            <div>Error: {typeof e === 'string' ? e : JSON.stringify(e)}</div>
          </>
        );
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [handleVerificationRedirect]);

  if (isLoading) {
    return <></>;
  }

  return <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>;
};

export function useAuth(): Auth {
  const auth = useContext(AuthContext);
  if (!auth) {
    throw new Error(`"useAuth" has to be called inside AuthProvider`);
  }
  return auth;
}

function justVerifiedEmail(router: NextRouter) {
  const { query: {email, success, message} } = router;
  return {
    is: !!email && !!message && !!success,
    success: success === 'true',
    message
  }
}