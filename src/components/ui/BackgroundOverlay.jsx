import React from 'react';

export const BackgroundOverlay = () => (
  <>
    <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-slate-50 dark:from-slate-950 to-transparent z-[1] pointer-events-none" />
    <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-slate-50 dark:from-slate-950 to-transparent z-[1] pointer-events-none" />
  </>
);
