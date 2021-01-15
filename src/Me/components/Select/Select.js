import PropTypes from 'prop-types';
import React, { useContext, useLayoutEffect, useRef } from 'react';
import ReactSelect from 'react-select';
import { formFieldContext } from '../FormField/formContext';

const REACHED_MAX_OPTION = [
  {
    label: 'Reached max items',
    value: undefined,
    isDisabled: true,
  },
];

export const Select = ({
  isMulti = false,
  value,
  onChange,
  maxSelections = Infinity,
  options,
  ...reactSelectOptions
}) => {
  const id = useContext(formFieldContext);
  const inputElRef = useRef(null);

  useLayoutEffect(() => {
    inputElRef.current.select.inputRef.autocomplete = 'nope';
  }, []);

  return (
    <ReactSelect
      ref={inputElRef}
      isMulti={isMulti}
      menuPlacement="auto"
      hideSelectedOptions
      inputId={id}
      isSearchable
      value={value}
      onChange={onChange}
      options={
        isMulti && value && value.length && value.length >= maxSelections
          ? REACHED_MAX_OPTION
          : options
      }
      menuPortalTarget={document.body}
      styles={reactSelectStyles}
      {...reactSelectOptions}
    />
  );
};

const selectValueShape = PropTypes.shape({
  label: PropTypes.string.isRequired,
  value: PropTypes.any.isRequired,
  isDisabled: PropTypes.bool,
});

Select.propTypes = {
  isMulti: PropTypes.bool,
  value: PropTypes.any,
  onChange: PropTypes.func.isRequired,
  maxSelections: PropTypes.number,
  options: PropTypes.arrayOf(selectValueShape),
};

const reactSelectStyles = {
  container: base => ({ ...base, width: '100%' }),
  control: base => ({
    ...base,
    fontSize: '14px',
    lineHeight: '17px',
    borderRadius: '3px',
    backgroundColor: '#fff',
    border: '1px solid #bfbfbf',
  }),
  placeholder: base => ({ ...base, color: '#898889' }),
  menuPortal: base => ({ ...base, zIndex: 1000 }),
  option: (base, { isFocused, isDisabled }) => {
    return {
      ...base,
      color: isDisabled ? '#4f4f4f' : isFocused ? '#fff' : '#4f4f4f',
      fontSize: '14px',
      lineHeight: '17px',
      fontFamily: 'Lato, sans-serif',
      backgroundColor: isDisabled ? '#bfbfbf' : isFocused ? '#69D5B1' : '#fff',
    };
  },
  multiValueLabel: base => ({
    ...base,
    backgroundColor: '#f2f2f2',
    color: '#4f4f4f',
    fontSize: '14px',
    lineHeight: '17px',
  }),
  multiValueRemove: base => ({
    ...base,
    backgroundColor: '#f2f2f2',
    color: '#4f4f4f',
    fontSize: '14px',
    lineHeight: '17px',
  }),
  indicatorSeparator: () => ({
    display: 'none',
  }),
};
