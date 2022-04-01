import { useRouter } from 'next/router';

export const getFilterParams = (search) => {
  const params = new URLSearchParams(search);
  return {
    tag: params.get('technology') || '',
    country: params.get('country') || '',
    name: params.get('name') || '',
    language: params.get('language') || '',
    page: Number(params.get('page') || '1'),
  };
};

export const useFilterParams = () => {
  const router = useRouter();

  return {
    setFilterParams: (param, value) => {
      const params = new URLSearchParams(router.asPath.split('?')[1]);
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
      router.push({
        pathname: '/',
        search: new URLSearchParams(params).toString(),
      });
    },
  };
};
