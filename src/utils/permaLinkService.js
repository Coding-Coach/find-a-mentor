import { useCallback, useEffect } from 'react';
import { useHistory, useLocation } from 'react-router';
import { useFilters } from '../context/filtersContext/FiltersContext';

export const setPermalinkParams = (param, value) => {
  const permalink = new URLSearchParams(window.location.search);
  if (value) {
    if (permalink.get(param) !== value) {
      permalink.set(param, value);
      window.history.pushState({}, null, '?' + permalink.toString());
    }
  } else if (permalink.get(param)) {
    permalink.delete(param);
    window.history.pushState({}, null, '?' + permalink.toString());
  }
};

export const getPermalinkParamsValues = () => {
  const permalink = new URLSearchParams(window.location.search);
  return {
    tag: permalink.get('technology') || '',
    country: permalink.get('country') || '',
    name: permalink.get('name') || '',
    language: permalink.get('language') || '',
  };
};

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
  }, [location, dispatch, getFilterParams]);

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
