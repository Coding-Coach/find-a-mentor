import React from 'react';
import './FilterClear.css';

const FilterClear = ({ onClear }) => {
  return (
    <React.Fragment>
      <span className='clear' onClick={onClear}>clear</span>
    </React.Fragment>
  );
};

export default FilterClear;
