import './AutoComplete.css';

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

function renderMenu(items, value, style) {
  return <div className="ac-menu" children={items} />;
}

export default function AutoComplete(props) {
  const {
    showClear,
    source,
    'data-testid': testid,
    id,
    clickedTag,
    onSelect,
  } = props;
  const [value, setValue] = useState('');

  //useEffect(getPermalinkParams, [source.length]);

  const handleSelect = (value, item) => {
    setValue(value);
    onSelect(item);
  };

  const onChange = (event, value) => {
    setValue(value);
    if (!value) {
      onSelect({ value: '', label: '' });
    }
  };

  const onClear = event => {
    onChange(event, '');
  };

  const matchStateToTerm = (state, value) => {
    return (
      state.label &&
      state.label.toLowerCase().indexOf(value.toLowerCase()) !== -1
    );
  };

  useEffect(() => {
    if (clickedTag) {
      setValue(clickedTag);
      onSelect({ value: clickedTag });
    } else {
      onChange(null, '');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [clickedTag]);

  useEffect(() => {
    if (props.clickedUser) {
      setValue(props.clickedUser);
      onSelect({ value: props.clickedUser });
    } else {
      onChange(null, '');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.clickedUser]);

  useEffect(() => {
    if (props.clickedCountry) {
      const code = source.find(item => item.value === props.clickedCountry);
      setValue(code.label);
      onSelect({ value: code.value });
    } else {
      onChange(null, '');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.clickedCountry]);

  const inputId = `${id}-${Math.random()}`;

  return (
    <div className="ac">
      <Autocomplete
        value={value}
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
      {showClear && value && (
        <div className={'clear-btn'}>
          <FilterClear onClear={onClear} />
        </div>
      )}
    </div>
  );
}
