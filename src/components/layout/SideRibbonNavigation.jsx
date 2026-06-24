import React from 'react';

export const SideRibbonNavigation = ({ scrollTo }) => {
  const sections = [
    { id: 'about', label: 'About' },
    { id: 'projects', label: 'Projects' },
    { id: 'skills', label: 'Skills' },
    { id: 'experience', label: 'Experience' },
    { id: 'certifications', label: 'Awards' },
    { id: 'contact', label: 'Contact' },
  ];

  return (
    <div className="fixed right-0 top-32 h-[calc(100vh-16rem)] w-12 bg-white/30 dark:bg-slate-900/30 backdrop-blur-xl border-l border-y border-white/20 dark:border-slate-800 z-40 hidden lg:[@media(min-height:830px)]:flex flex-col items-center py-6 shadow-2xl rounded-tl-3xl rounded-bl-3xl overflow-y-auto [&::-webkit-scrollbar]:hidden" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
      <div className="flex flex-col justify-center gap-6 w-full items-center min-h-full">
      {sections.map((section) => (
        <button 
          key={section.id} 
          onClick={() => scrollTo(section.id)} 
          className="group relative flex items-center justify-center w-full shrink-0"
        >
          <span className="vertical-text text-base font-bold uppercase tracking-[0.25em] text-slate-400 group-hover:text-emerald-500 transition-colors duration-300 whitespace-nowrap cursor-pointer hover:scale-110" style={{ writingMode: 'vertical-rl', textOrientation: 'mixed', transform: 'rotate(180deg)' }}>
            {section.label}
          </span>
          <div className="absolute right-0 w-1 h-0 bg-emerald-500 group-hover:h-full transition-all duration-300 rounded-l-full"></div>
        </button>
      ))}
      </div>
    </div>
  );
};
