import React, {
  FC,
  useRef,
  useEffect,
  useReducer,
  useContext,
  createContext,
} from 'react';
import { useRouter } from 'next/router';
import { AnyFixMe } from '../../types/global';
import { Country } from '../../types/models';
import { getFilterParams } from '../../utils/permaLinkService';

type FiltersContextDispatch = React.Dispatch<AnyFixMe>;

type FiltersContextState = {
  page: number;
  tag?: string;
  name?: string;
  language?: string;
  country?: Country;
  // TODO check what is "onPopState" and why it is used
  onPopState: boolean;
  showFilters: boolean;
  showFavorites: boolean;
};

const initialState: FiltersContextState = {
  page: 1,
  onPopState: false,
  showFilters: false,
  showFavorites: false,
};

const FiltersStateContext = createContext<FiltersContextState>(initialState);
const FiltersDispatchContext = createContext<FiltersContextDispatch>(() => {});

const filterReducer = (state: FiltersContextState, action: AnyFixMe) => {
  switch (action.type) {
    case 'filterTag':
      return { ...state, tag: action.payload, page: 1, onPopState: false };
    case 'filterCountry':
      return { ...state, country: action.payload, page: 1, onPopState: false };
    case 'filterName':
      return { ...state, name: action.payload, page: 1, onPopState: false };
    case 'filterLanguage':
      return { ...state, language: action.payload, page: 1, onPopState: false };
    case 'showFavorites':
      return { ...state, showFavorites: action.payload, onPopState: false };
    case 'setPage':
      return { ...state, page: action.payload, onPopState: false };
    case 'showFilters':
      return { ...state, showFilters: action.payload, onPopState: false };
    case 'setFilters':
      return {
        ...state,
        ...action.payload,
        page: action.payload.page || state.page || 1,
        onPopState: false,
      };
    case 'onPopState':
      return { ...state, ...action.payload, onPopState: true };
    default:
      throw new Error('');
  }
};

const FiltersProvider: FC = ({ children }) => {
  const router = useRouter();
  const filterParams = getFilterParams(router.asPath.split('?')[1]);
  const firstRun = useRef(true);
  const [state, dispatch] = useReducer(filterReducer, {
    ...initialState,
    ...filterParams,
  });

  useEffect(() => {
    if (firstRun.current) {
      firstRun.current = false;
      return;
    }
    dispatch({ type: 'setFilters', payload: getFilterParams(router.asPath.split('?')[1]) });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router.asPath, dispatch]);

  return (
    <FiltersStateContext.Provider value={state}>
      <FiltersDispatchContext.Provider value={dispatch}>
        {children}
      </FiltersDispatchContext.Provider>
    </FiltersStateContext.Provider>
  );
};

const useFiltersState = () => {
  const context = useContext(FiltersStateContext);
  if (context === undefined) {
    throw new Error('useFiltersState must be used within a FiltersProvider');
  }
  return context;
};
const useFiltersDispatch = () => {
  const context = useContext(FiltersDispatchContext);
  if (context === undefined) {
    throw new Error('useFiltersDispatch must be used within a FiltersProvider');
  }
  return context;
};

const useFilters = (): [FiltersContextState, FiltersContextDispatch] => {
  const state = useFiltersState();
  const dispatch = useFiltersDispatch();
  return [state, dispatch];
};

export { FiltersProvider, useFilters };
