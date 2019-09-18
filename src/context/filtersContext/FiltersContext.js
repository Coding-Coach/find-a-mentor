import React, { useReducer, createContext, useContext } from 'react';

const FiltersStateContext = createContext({});
const FiltersDispatchContext = createContext({});

const initialFilters = {
  tag: '',
  country: '',
  name: '',
  language: '',
  showFilters: false,
};

const filterReducer = (_, action) => {
  switch (action.type) {
    case 'filterTag':
      return { tag: action.payload };
    case 'filterCountry':
      return { country: action.payload };
    case 'filterName':
      return { name: action.payload };
    case 'filterLanguage':
      return { language: action.payload };
    case 'showFilters':
      return { showFilters: action.payload };
    default:
      throw new Error('');
  }
};

const FiltersProvider = ({ children }) => {
  const [state, dispatch] = useReducer(filterReducer, initialFilters);
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

export { FiltersProvider, useFilters, useFiltersDispatch, useFiltersState };
