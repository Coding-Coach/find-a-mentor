import React from 'react';

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
