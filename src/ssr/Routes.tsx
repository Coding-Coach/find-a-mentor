import { useEffect, useRef } from 'react';
import { Switch, Route } from 'react-router-dom';
import { Home } from './Home';
import { User } from './User';

export const Routes = ({ ssrData }: { ssrData: any }) => {
  const data = useRef(ssrData);

  useEffect(() => {
    data.current = undefined;
  }, []);

  return (
    <Switch>
      <Route path="/s/:id" render={() => <User ssrData={data.current} />} />
      <Route path="/" render={() => <Home ssrData={data.current} />} />
    </Switch>
  );
};
