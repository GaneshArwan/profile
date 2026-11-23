import React from 'react';
import { GithubIcon, LinkedinIcon } from '../icons';
import { PERSONAL_INFO } from '../../data/constants';

export const Footer = () => (
  <footer className="bg-slate-50 dark:bg-slate-900 py-8 border-t border-slate-200 dark:border-slate-800 transition-colors duration-300 relative z-10">
    <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center text-slate-600 dark:text-slate-400 text-sm">
      <p>&copy; {new Date().getFullYear()} {PERSONAL_INFO.name}. All rights reserved.</p>
      <div className="flex gap-4 mt-4 md:mt-0">
        <a href={PERSONAL_INFO.linkedin} target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center p-2 min-w-[44px] min-h-[44px] rounded-lg hover:text-emerald-700 dark:hover:text-emerald-400 hover:bg-slate-200/50 dark:hover:bg-slate-800/50 transition-colors cursor-pointer" aria-label="LinkedIn Profile"><LinkedinIcon size={18} /></a>
        <a href={PERSONAL_INFO.github} target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center p-2 min-w-[44px] min-h-[44px] rounded-lg hover:text-emerald-700 dark:hover:text-emerald-400 hover:bg-slate-200/50 dark:hover:bg-slate-800/50 transition-colors cursor-pointer" aria-label="GitHub Profile"><GithubIcon size={18} /></a>
      </div>
    </div>
  </footer>
);
