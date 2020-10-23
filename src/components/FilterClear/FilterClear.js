import React from 'react';
import './FilterClear.css';

const FilterClear = ({ onClear }) => {
  return (
    <>
      <button className="clear" data-testid="clear-filter" onClick={onClear}>
        clear
      </button>
    </>
  );
};

export default FilterClear;
