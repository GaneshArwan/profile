import React, { useState } from 'react';
import { Home, Sun, Moon, Menu, X } from 'lucide-react';

export const Navbar = ({ isDarkMode, toggleTheme, activeSection, scrollTo }) => {
  const [isOpen, setIsOpen] = useState(false);
  
  const handleLinkClick = (id) => {
    scrollTo(id);
    setIsOpen(false);
  };

  const navLinks = [
    { name: "About", id: "about" },
    { name: "Projects", id: "projects" },
    { name: "Skills", id: "skills" },
    { name: "Experience", id: "experience" },
    { name: "Awards", id: "certifications" },
    { name: "Contact", id: "contact" },
  ];

  return (
    <nav className="fixed left-1/2 -translate-x-1/2 top-12 lg:top-20 z-[999] w-[90%] max-w-[380px] md:w-max md:min-w-[380px] rounded-full bg-white/30 dark:bg-slate-900/30 backdrop-blur-xl border border-white/20 dark:border-slate-700/50 shadow-[0_8px_32px_rgba(0,0,0,0.1)] dark:shadow-[0_8px_32px_rgba(0,0,0,0.4)] transition-all duration-300 px-6 md:px-8">
      <div className="flex justify-between items-center gap-6 py-4">
        {/* Home Button */}
        <button 
          onClick={() => handleLinkClick('top')} 
          className="text-emerald-500 hover:scale-110 transition-transform shrink-0"
          aria-label="Back to Top"
        >
          <Home size={28} />
        </button>
        
        {/* Active Section Display - Fixed Glitch with key prop */}
        <div className="flex-1 text-center overflow-hidden">
            {activeSection && (
                <span 
                  key={activeSection} // CRITICAL FIX: Forces animation restart on change
                  className="inline-block text-2xl md:text-4xl font-black tracking-widest text-slate-800 dark:text-slate-100 animate-in fade-in slide-in-from-top-2 duration-300 whitespace-nowrap"
                >
                    {activeSection}
                </span>
            )}
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-3 shrink-0 ml-auto">
          <button onClick={toggleTheme} className="hidden lg:[@media(min-height:830px)]:flex p-2 rounded-full bg-slate-100/50 dark:bg-slate-800/50 text-slate-600 dark:text-slate-300 hover:bg-emerald-100 dark:hover:bg-slate-700 transition-colors shadow-sm ring-1 ring-white/20">
            {isDarkMode ? <Sun size={24} /> : <Moon size={24} />}
          </button>
          <div className="lg:[@media(min-height:830px)]:hidden flex items-center">
            <button onClick={() => setIsOpen(!isOpen)} className="text-slate-600 dark:text-slate-300 hover:text-emerald-500">
              {isOpen ? <X size={32} /> : <Menu size={32} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <div className={`lg:[@media(min-height:830px)]:hidden bg-white/95 dark:bg-slate-900/95 absolute top-full left-0 w-full mt-4 rounded-2xl border border-white/20 backdrop-blur-xl overflow-hidden shadow-xl transition-all duration-300 ease-in-out origin-top ${isOpen ? "opacity-100 translate-y-0 scale-100 visible" : "opacity-0 -translate-y-4 scale-95 invisible"}`}>
        <div className="px-6 py-6 flex flex-col space-y-4">
          <div className="flex justify-between items-center pb-4 border-b border-slate-200 dark:border-slate-800">
              <span className="text-sm font-bold text-slate-500">Theme</span>
              <button onClick={toggleTheme} className="p-2 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
              </button>
          </div>
          {navLinks.map((link) => (
            <button 
              key={link.name} 
              onClick={() => handleLinkClick(link.id)} 
              className="text-left text-xl md:text-2xl py-2 font-bold text-slate-600 dark:text-slate-300 hover:text-emerald-500 hover:pl-3 transition-all"
            >
              {link.name}
            </button>
          ))}
        </div>
      </div>
    </nav>
  );
};
