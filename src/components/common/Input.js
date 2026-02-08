// admin-panel/src/components/common/Input.js

import React from 'react';
import './Input.css';

export default function Input({
  label,
  type = 'text',
  value,
  onChange,
  placeholder = '',
  required = false,
  disabled = false,
  error = '',
  className = '',
  ...props
}) {
  return (
    <div className={`input-wrapper ${className}`}>
      {label && (
        <label className="input-label">
          {label}
          {required && <span className="required">*</span>}
        </label>
      )}
      
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        disabled={disabled}
        className={`input-field ${error ? 'input-error' : ''} ${disabled ? 'input-disabled' : ''}`}
        {...props}
      />
      
      {error && <span className="error-text">{error}</span>}
    </div>
  );
}