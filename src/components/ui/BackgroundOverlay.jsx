import React from 'react';

export const BackgroundOverlay = () => (
  <>
    <div
      aria-hidden="true"
      className="absolute inset-0 z-[1] pointer-events-none opacity-40 dark:opacity-25"
      style={{
        backgroundImage:
          'radial-gradient(rgba(16, 185, 129, 0.16) 1px, transparent 1px), linear-gradient(to right, rgba(16, 185, 129, 0.04) 1px, transparent 1px), linear-gradient(to bottom, rgba(16, 185, 129, 0.04) 1px, transparent 1px)',
        backgroundSize: '24px 24px, 96px 96px, 96px 96px',
      }}
    />
    <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-slate-50 dark:from-slate-950 to-transparent z-[1] pointer-events-none" />
    <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-slate-50 dark:from-slate-950 to-transparent z-[1] pointer-events-none" />
  </>
);
