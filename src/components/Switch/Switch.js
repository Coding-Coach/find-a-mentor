import React, { Component } from 'react';

import './Switch.css';

function SwitchLabel({labelID, label}){
  return (
    <>
      <label id={labelID} htmlFor={labelID}>{label}</label>
    </>
  );
};

function SwitchInput({onToggle, isEnabled, switchID, switchType, switchTheme}){
  const toggleSwitch = (event) => {
    onToggle(event.target.checked);
  };

  return (
    <>
      <div className={`switch-input ${switchTheme} ${switchType}`}>
        <input
          type="checkbox"
          id={`switch-${switchID}`}
          checked={isEnabled}
          onChange={toggleSwitch}
        />
        <label id={`switch-label-${switchID}`} htmlFor={`switch-${switchID}`}>Toggle</label>
      </div>
    </>
  );
}

export default class Switch extends Component {
  render() {
    const { switchID, label, onToggle, switchTheme, switchType, isEnabled} = this.props;
    return (
      <>
        <div className={`switch-container ${switchID}`}>
          <SwitchLabel labelID={switchID} label={label} />
          <SwitchInput isEnabled={isEnabled} switchTheme={switchTheme} switchType={switchType} switchID={switchID} onToggle={onToggle} />
        </div>
      </>
    );
  }
}

Switch.defaultProps = {
  switchTheme: "regular",
  switchType: "regular",
}