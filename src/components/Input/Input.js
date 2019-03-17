import React from "react";

import "./Input.css";

const Input = ({ id, label, children }) => (
  <div className="input-container">
    <label htmlFor={id} className="label">
      {label}
    </label>
    {children}
  </div>
);

export default Input;
