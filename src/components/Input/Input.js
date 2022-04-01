import React from 'react';

const Input = ({ id, label, children }) => (
  <div className="input-container">
    <label htmlFor={id} className="label">
      {label}
    </label>
    {children}
  </div>
);

export default Input;
