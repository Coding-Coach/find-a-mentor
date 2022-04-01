import { FC, useEffect } from 'react';
import { useRouter } from 'next/router';

import auth from '../../../utils/auth';

export const ActionsHandler: FC = ({ children }) => {
  const router = useRouter();
  const {query} = router;
  const redirectTo = query.redirectTo || '';

  useEffect(() => {
    const redirectedFrom = query.from;
    if (redirectedFrom) {
      auth.login(redirectedFrom);
    }
  }, [query]);

  if (redirectTo) {
    router.push(redirectTo as string);
    return <p>Redirecting to {redirectTo}</p>;
  }

  return <>{children}</>;
};
