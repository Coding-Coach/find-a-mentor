import React, { Component, useState } from 'react';

import './Switch.css';

export function SwitchLabel({classID, id, label}){
  return (
    <>
      <label className={classID} htmlFor={id}>{label}</label>
    </>
  );
};

export function SwitchInput({onToggle, isEnabled, id}){
  const [isChecked, setisChecked] = useState(isEnabled);

  const toggleSwitch = () => {
    setisChecked((isChecked) => !isChecked);
    onToggle(!isChecked);
  };

  return (
    <>
      <div className="switch-input">
        <input
          type="checkbox"
          id={`switch-${id}`}
          checked={isChecked}
          onChange={toggleSwitch}
        />
        <label htmlFor={`switch-${id}`}>Toggle</label>
      </div>
    </>
  );
}

export default class Switch extends Component {
  render() {
    const { id, label, onToggle} = this.props;
    return (
      <>
        <div className="switch-container">
          <SwitchLabel classID="filter-switch-label" id={id} label={label} />
          <SwitchInput onToggle={onToggle} id={id}/>
        </div>
      </>
    );
  }
}
