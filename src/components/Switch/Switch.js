import React, { Component, useState } from 'react';

import './Switch.css';

function SwitchLabel({labelID, label}){
  return (
    <>
      <label id={labelID} htmlFor={labelID}>{label}</label>
    </>
  );
};

function SwitchInput({onToggle, isEnabled, switchID, switchType, switchTheme}){
  const [isChecked, setIsChecked] = useState(isEnabled);

  const toggleSwitch = () => {
    if(onToggle(!isChecked)) {
      setIsChecked((isChecked) => !isChecked);
    }
  };

  return (
    <>
      <div className={`switch-input ${switchTheme} ${switchType}`}>
        <input
          type="checkbox"
          id={`switch-${switchID}`}
          checked={isChecked}
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