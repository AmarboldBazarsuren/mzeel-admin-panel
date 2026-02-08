// admin-panel/src/components/common/Button.js

import React from 'react';
import './Button.css';

export default function Button({
  children,
  onClick,
  variant = 'primary',
  size = 'medium',
  disabled = false,
  loading = false,
  type = 'button',
  className = '',
}) {
  return (
    <button
      type={type}
      className={`btn btn-${variant} btn-${size} ${className} ${disabled || loading ? 'disabled' : ''}`}
      onClick={onClick}
      disabled={disabled || loading}
    >
      {loading ? (
        <span className="spinner"></span>
      ) : (
        children
      )}
    </button>
  );
}