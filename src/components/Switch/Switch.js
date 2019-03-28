import React from "react";

import "./Switch.css";

const Switch = ({ id, label, onToggle }) => (
  <div className="switch-container">
    <label htmlFor={id}>
      {label}
    </label>
    <div className="switch-input">
	    <input type="checkbox"
    		id={`switch-${id}`}
    		onChange={onToggle}
	    />
	    <label htmlFor={`switch-${id}`}>Toggle</label>
    </div>
  </div>
);

export default Switch;
