import { useContext, useLayoutEffect, useRef } from 'react';
import ReactSelect from 'react-select';
import type {Props} from 'react-select';
import { formFieldContext } from '../FormField/formContext';
import StateManager from 'react-select';

type SelectValue = {
  value: any;
  label: string;
}

type Option = SelectValue & {
  isDisabled?: boolean;
}

type OptionData = {name: string};

export type SelectProps = {
  name?: string;
  maxSelections?: number;
  options: Option[];
  isMulti?: boolean;
  value: SelectValue | SelectValue[];
  onChange: (value: SelectProps["value"], data: OptionData) => void;
}

const REACHED_MAX_OPTION: Option[] = [
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
}: SelectProps) => {
  const id = useContext(formFieldContext);
  const inputElRef = useRef<StateManager>(null);

  useLayoutEffect(() => {
    if (inputElRef.current) {
      ((inputElRef.current as any).select.inputRef as unknown as HTMLInputElement).autocomplete = 'nope';
    }
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
      onChange={onChange as any}
      options={
        isMulti && Array.isArray(value) && value.length >= maxSelections
          ? REACHED_MAX_OPTION
          : options
      }
      menuPortalTarget={document.body}
      styles={reactSelectStyles}
      {...reactSelectOptions}
    />
  );
};

const reactSelectStyles: Props["styles"] = {
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
