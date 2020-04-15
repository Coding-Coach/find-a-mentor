import React, { Component } from 'react';
import classNames from 'classnames';
import './Switch.css';

function SwitchLabel({ id, label }) {
  return (
    <>
      <label id={id} htmlFor={id}>
        {label}
      </label>
    </>
  );
}

function SwitchInput({ onToggle, isChecked, id, type, theme }) {
  const toggleSwitch = event => {
    onToggle(event.target.checked);
  };

  return (
    <>
      <div className={classNames(['switch-input', theme, type])}>
        <input
          type="checkbox"
          id={`switch-input-${id}`}
          checked={isChecked}
          onChange={toggleSwitch}
        />
        <label id={`switch-label-${id}`} htmlFor={`switch-input-${id}`}>
          Toggle
        </label>
      </div>
    </>
  );
}

export default class Switch extends Component {
  render() {
    const { id, label, onToggle, theme, type, isChecked } = this.props;
    return (
      <>
        <div className={classNames(['switch-container', id])}>
          <SwitchLabel id={id} label={label} />
          <SwitchInput
            isChecked={isChecked}
            theme={theme}
            type={type}
            id={id}
            onToggle={onToggle}
          />
        </div>
      </>
    );
  }
}

Switch.defaultProps = {
  theme: 'regular',
  type: 'regular',
};
