import React from 'react';

export const GlossyText = ({ children, className = "" }) => (
  <span className={`font-semibold text-slate-900 dark:text-white ${className}`}>
    {children}
  </span>
);
