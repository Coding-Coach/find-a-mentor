import './AutoComplete.css';

import React, { useState, useEffect, useCallback } from 'react';
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

  const setPermalinkParams = useCallback(
    (param, value) => {
      const permalink = new URLSearchParams(window.location.search);
      const paramItem = source.filter(item => item.label === value);
      if (paramItem.length && value.length) {
        permalink.set(param, paramItem[0].value);
      } else if (!value.length) {
        permalink.delete(param);
      }
      window.history.pushState({}, null, '?' + permalink.toString());
    },
    [source]
  );

  const getPermalinkParams = () => {
    const permalink = new URLSearchParams(window.location.search);
    const paramValue = permalink.get(props.id);
    const paramItem = source.filter(item => item.value === paramValue);
    if (paramItem.length) {
      setValue(paramItem[0].label);
      onSelect({ value: paramValue, label: paramItem[0].label });
    }
  };

  useEffect(getPermalinkParams, [source.length]);

  const handleSelect = (value, item) => {
    setValue(value);
    onSelect(item);
    setPermalinkParams(props.id, value);
  };

  const onChange = (event, value) => {
    setValue(value);
    if (!value) {
      onSelect({ value: '', label: '' });
    }
    setPermalinkParams(props.id, value);
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
      setPermalinkParams(id, clickedTag);
    }
  }, [clickedTag]);

  useEffect(() => {
    if (props.clickedUser) {
      setValue(props.clickedUser);
      onSelect({ value: props.clickedUser });
      setPermalinkParams(id, props.clickedUser);
    }
  }, [props.clickedUser]);

  useEffect(() => {
    if (props.clickedCountry) {
      const code = source.find(item => item.value === props.clickedCountry);
      setValue(code.label);
      onSelect({ value: code.value });
      setPermalinkParams(props.id, code.label);
    }
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
