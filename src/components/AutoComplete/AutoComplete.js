import React, { useState, useEffect } from 'react';
import Autocomplete from 'react-autocomplete';
import classNames from 'classnames';
import FilterClear from '../FilterClear/FilterClear';

function renderInput(props) {
  return <input {...props} className="input" autoComplete="off" />;
}

function renderItem(item, isHighlighted) {
  return (
    <div
      key={item.label}
      className={classNames(['ac-item', { highlight: isHighlighted }])}
    >
      {item.label}
    </div>
  );
}

function renderMenu(items) {
  return <div className="ac-menu" children={items} />;
}

export default function AutoComplete(props) {
  const {
    showClear,
    source,
    'data-testid': testid,
    id,
    onSelect,
    value,
  } = props;

  const [localValue, setLocalValue] = useState('');

  const handleSelect = (_, item) => {
    onSelect(item);
  };

  const onChange = (_, value) => {
    setLocalValue(value);
    if (!value) {
      onSelect({ value: '', label: '' });
    }
  };

  const onClear = _ => {
    onChange(_, '');
  };

  const matchStateToTerm = (state, value) => {
    return (
      state.label &&
      state.label.toLowerCase().indexOf(value.toLowerCase()) !== -1
    );
  };

  useEffect(() => {
    setLocalValue('');
  }, [value]);

  //TODO: generate a safe ID
  const inputId = `${id}-${Math.random()}`;

  return (
    <div className="ac">
      <Autocomplete
        value={localValue || value}
        items={source}
        renderItem={renderItem}
        renderMenu={renderMenu}
        renderInput={renderInput}
        wrapperStyle={{}}
        getItemValue={item => item.label}
        shouldItemRender={matchStateToTerm}
        onSelect={handleSelect}
        onChange={onChange}
        inputProps={{
          id: inputId,
          'data-testid': testid,
        }}
      />
      {showClear && (value || localValue) && (
        <div className={'clear-btn'}>
          <FilterClear onClear={onClear} />
        </div>
      )}
    </div>
  );
}
