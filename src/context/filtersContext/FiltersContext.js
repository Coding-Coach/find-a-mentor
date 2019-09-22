import React, { useReducer, createContext, useContext } from 'react';

const FiltersStateContext = createContext({});
const FiltersDispatchContext = createContext({});

const getInitialFilters = () => {
  const permalink = new URLSearchParams(window.location.search);

  return {
    tag: permalink.get('technology') || '',
    country: permalink.get('country') || '',
    name: permalink.get('name') || '',
    language: permalink.get('language') || '',
    showFilters: false,
  };
};

const filterReducer = (state, action) => {
  switch (action.type) {
    case 'filterTag':
      return { ...state, tag: action.payload };
    case 'filterCountry':
      return { ...state, country: action.payload };
    case 'filterName':
      return { ...state, name: action.payload };
    case 'filterLanguage':
      return { ...state, language: action.payload };
    case 'showFilters':
      return { ...state, showFilters: action.payload };
    case 'setFilters':
      return { ...action.payload };
    default:
      throw new Error('');
  }
};

const FiltersProvider = ({ children }) => {
  const [state, dispatch] = useReducer(filterReducer, getInitialFilters());

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
