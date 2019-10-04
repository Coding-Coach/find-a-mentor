import React, { useReducer, createContext, useContext, useEffect } from 'react';
import { getPermalinkParamsValues } from '../../utils/permaLinkService';

const FiltersStateContext = createContext({});
const FiltersDispatchContext = createContext({});

const filterReducer = (state, action) => {
  switch (action.type) {
    case 'filterTag':
      return { ...state, tag: action.payload, onPopState: false };
    case 'filterCountry':
      return { ...state, country: action.payload, onPopState: false };
    case 'filterName':
      return { ...state, name: action.payload, onPopState: false };
    case 'filterLanguage':
      return { ...state, language: action.payload, onPopState: false };
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

const FiltersProvider = ({ children }) => {
  const [state, dispatch] = useReducer(filterReducer, {});
  useEffect(() => {
    const initialFilters = getPermalinkParamsValues();
    dispatch({
      type: 'setFilters',
      payload: { ...initialFilters, showFilters: false },
    });
  }, []);

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

const useFilters = () => [useFiltersState(), useFiltersDispatch()];

export { FiltersProvider, useFilters };
