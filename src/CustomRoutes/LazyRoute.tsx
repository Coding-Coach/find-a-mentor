import { FC, Suspense } from 'react';
import { Route, RouteProps } from 'react-router-dom';
import { RouterLoader } from './RouterLoader';

export const LazyRoute: FC<RouteProps> = ({
  children,
  component,
  render,
  ...routeProps
}) => {
  const renderMethod: RouteProps['render'] =
    render &&
    (props => <Suspense fallback={<RouterLoader />}>{render(props)}</Suspense>);

  return (
    <Route {...routeProps} render={renderMethod}>
      {!renderMethod && (
        <Suspense fallback={<RouterLoader />}>{children || component}</Suspense>
      )}
    </Route>
  );
};
