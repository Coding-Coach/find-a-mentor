import { useCallback, useEffect } from 'react';
import { useHistory, useLocation } from 'react-router';
import { useFilters } from '../context/filtersContext/FiltersContext';

export const useFilterParams = () => {
  const [, dispatch] = useFilters();
  const history = useHistory();
  const location = useLocation();

  const getFilterParams = useCallback(() => {
    const params = new URLSearchParams(location.search);
    return {
      tag: params.get('technology') || '',
      country: params.get('country') || '',
      name: params.get('name') || '',
      language: params.get('language') || '',
    };
  }, [location.search]);

  useEffect(() => {
    dispatch({ type: 'setFilters', payload: getFilterParams() });
  }, [location.search, dispatch, getFilterParams]);

  return {
    getFilterParams,
    setFilterParams: (param, value) => {
      const params = new URLSearchParams(location.search);
      if (value) {
        if (params.get(param) !== value) {
          params.set(param, value);
        }
      } else if (params.get(param)) {
        params.delete(param);
      }
      history.push({
        pathname: '/',
        search: new URLSearchParams(params).toString(),
      });
    },
  };
};
