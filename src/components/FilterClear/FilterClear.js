import React from 'react';
import './FilterClear.css';

const FilterClear = ({ onClear }) => {
  return (
    <>
      <span className="clear" data-testid="clear-filter" onClick={onClear}>
        clear
      </span>
    </>
  );
};

export default FilterClear;
