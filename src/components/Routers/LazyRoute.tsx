import { FC, Suspense } from 'react';
import { Route, RouteProps } from 'react-router-dom';
import { RouterLoader } from './RouterLoader';

export const LazyRoute: FC<RouteProps> = ({
  children,
  component,
  render,
  ...routeProps
}) => {
  const renderMethod =
    render &&
    (() => (
      <Suspense fallback={<RouterLoader />}>{render({} as any)}</Suspense>
    ));

  return (
    <Route {...routeProps} render={renderMethod}>
      {!renderMethod && (
        <Suspense fallback={<RouterLoader />}>{children || component}</Suspense>
      )}
    </Route>
  );
};
