import React from "react";

import "./Input.css";

const Input = ({ id, label }) => (
  <div className="input-container">
    <label for={id} className="label">
      {label}
    </label>
    <input id={id} type="text" className="input" />
  </div>
);

export default Input;
