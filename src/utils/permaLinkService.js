import { useHistory, useLocation } from 'react-router';

export const getFilterParams = (location) => {
  const params = new URLSearchParams(location.search);
  return {
    tag: params.get('technology') || '',
    country: params.get('country') || '',
    name: params.get('name') || '',
    language: params.get('language') || '',
    page: Number(params.get('page') || '1'),
  };
};

export const useFilterParams = () => {
  const history = useHistory();
  const location = useLocation();

  return {
    setFilterParams: (param, value) => {
      const params = new URLSearchParams(location.search);
      if (value) {
        if (params.get(param) !== value) {
          params.set(param, value);
        }
      } else if (params.get(param)) {
        params.delete(param);
      }
      if (param !== 'page') {
        params.delete('page');
      }
      history.push({
        pathname: '/',
        search: new URLSearchParams(params).toString(),
      });
    },
  };
};
