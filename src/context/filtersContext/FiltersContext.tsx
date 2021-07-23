import React, {
  useReducer,
  createContext,
  useContext,
  useEffect,
  FC,
} from 'react';
import { AnyFixMe } from '../../types/global';
import { useFilterParams } from '../../utils/permaLinkService';

type FiltersContextState = AnyFixMe;
type FiltersContextDispatch = React.Dispatch<AnyFixMe>;

const FiltersStateContext = createContext({});
const FiltersDispatchContext = createContext<FiltersContextDispatch>(() => {});

const filterReducer = (state: FiltersContextState, action: AnyFixMe) => {
  switch (action.type) {
    case 'filterTag':
      return { ...state, tag: action.payload, onPopState: false };
    case 'filterCountry':
      return { ...state, country: action.payload, onPopState: false };
    case 'filterName':
      return { ...state, name: action.payload, onPopState: false };
    case 'filterLanguage':
      return { ...state, language: action.payload, onPopState: false };
    case 'showFavorites':
      return { ...state, showFavorites: action.payload, onPopState: false };
    case 'showFilters':
      return { ...state, showFilters: action.payload, onPopState: false };
    case 'setFilters':
      return { ...action.payload, onPopState: false };
    case 'onPopState':
      return { ...state, ...action.payload, onPopState: true };
    default:
      throw new Error('');
  }
};

const FiltersProvider: FC = ({ children }) => {
  const [state, dispatch] = useReducer(filterReducer, {});
  const { getFilterParams } = useFilterParams();
  useEffect(() => {
    const initialFilters = getFilterParams();
    dispatch({
      type: 'setFilters',
      payload: { ...initialFilters, showFilters: false },
    });
  }, [getFilterParams]);

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
