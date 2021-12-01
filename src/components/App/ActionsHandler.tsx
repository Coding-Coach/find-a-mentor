import { FC, useEffect, useMemo } from 'react';
import { useRouter } from 'next/router'
import auth from '../../utils/auth';

export const ActionsHandler: FC = ({ children }) => {
  const router = useRouter();
  console.log({router})
  const query = useMemo(() => new URLSearchParams(router.asPath.split('?')[1]), [
    router.query,
  ]);
  const redirectTo = query.get('redirectTo') || '';

  useEffect(() => {
    const redirectedFrom = query.get('from');
    if (redirectedFrom) {
      auth.login(redirectedFrom);
    }
  }, [query]);

  if (redirectTo) {
    router.push(redirectTo)
    return <p>Redirecting to {redirectTo}</p>;
  }

  return <>{children}</>;
};
