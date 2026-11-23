import React from 'react';

export const SectionHeader = ({ title, subtitle }) => (
  <div className="mb-12 w-full text-left relative z-20 animate-in slide-in-from-bottom-8 duration-700 fade-in">
    <h2 className="text-3xl md:text-5xl font-bold text-slate-900 dark:text-slate-100 mb-6 drop-shadow-md tracking-tight">
      {title}
    </h2>
    <div className="w-24 h-1.5 bg-gradient-to-r from-emerald-700 via-teal-600 to-emerald-700 dark:from-emerald-400 dark:via-teal-400 dark:to-emerald-400 rounded-full mb-6 opacity-90"></div>
    {subtitle && (
      <p className="text-lg md:text-xl text-slate-700 dark:text-slate-300 font-medium drop-shadow-sm max-w-2xl">
        {subtitle}
      </p>
    )}
  </div>
);
