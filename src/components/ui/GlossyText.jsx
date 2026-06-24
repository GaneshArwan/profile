import React from 'react';

export const GlossyText = ({ children, className = "" }) => (
  <span className={`glossy-matcha font-bold ${className}`}>
    {children}
  </span>
);
