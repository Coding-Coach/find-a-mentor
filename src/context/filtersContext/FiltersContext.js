import React, { useReducer, createContext } from 'react';

export const FilterContext = createContext();

const initialFilters = {
  tag: '',
  country: '',
  name: '',
  language: '',
  showFilters: false,
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
    default:
      throw new Error('');
  }
};

const FilterContextProvider = ({ children }) => {
  const [filters, dispatch] = useReducer(filterReducer, initialFilters, () => initialFilters);
  return (
    <FilterContext.Provider value={{filters, dispatch}}>
        {children}
    </FilterContext.Provider>
  );
};

export default FilterContextProvider;
