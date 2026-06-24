import React from 'react';
import { GithubIcon, LinkedinIcon } from '../icons';
import { PERSONAL_INFO } from '../../data/constants';

export const Footer = () => (
  <footer className="bg-slate-50 dark:bg-slate-900 py-8 border-t border-slate-200 dark:border-slate-900 transition-colors duration-300 lg:pr-24 relative z-10">
    <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center text-slate-500 text-sm">
      <p>&copy; {new Date().getFullYear()} {PERSONAL_INFO.name} All rights reserved.</p>
      <div className="flex gap-4 mt-4 md:mt-0">
        <a href={PERSONAL_INFO.linkedin} target="_blank" rel="noopener noreferrer" className="hover:text-emerald-500"><LinkedinIcon size={18} /></a>
        <a href={PERSONAL_INFO.github} target="_blank" rel="noopener noreferrer" className="hover:text-emerald-500"><GithubIcon size={18} /></a>
      </div>
    </div>
  </footer>
);
