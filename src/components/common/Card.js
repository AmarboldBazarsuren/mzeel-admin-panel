// admin-panel/src/components/common/Card.js

import React from 'react';
import './Card.css';

export default function Card({ children, className = '', onClick, title }) {
  const Component = onClick ? 'button' : 'div';

  return (
    <Component className={`card ${className}`} onClick={onClick}>
      {title && <h3 className="card-title">{title}</h3>}
      {children}
    </Component>
  );
}