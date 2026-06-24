import React from 'react';
import { Mail } from 'lucide-react';
import { Typewriter } from '../ui/Typewriter';
import { GlossyText } from '../ui/GlossyText';
import { TextScramble } from '../ui/TextScramble';
import { BackgroundOverlay } from '../ui/BackgroundOverlay';
import { GithubIcon, LinkedinIcon } from '../icons';
import { PERSONAL_INFO, HERO_VIDEOS } from '../../data/constants';

export const Hero = ({ isDarkMode, scrollTo }) => {
  return (
    <section className="min-h-[100svh] flex items-center justify-center relative overflow-hidden transition-colors duration-300 bg-slate-50 dark:bg-slate-950">
      <div className="absolute inset-0 z-0">
          <video
            autoPlay
            loop
            muted
            playsInline
            key={isDarkMode ? 'dark' : 'light'}
            className="absolute inset-0 w-full h-full object-cover object-[80%_center] md:object-center"
          >
            <source src={isDarkMode ? HERO_VIDEOS.dark : HERO_VIDEOS.light} type="video/mp4" />
          </video>

          <div className="absolute inset-0 bg-slate-50/90 dark:bg-slate-950/90" />
          <BackgroundOverlay />
      </div>

      <div className="max-w-7xl mx-auto px-6 w-full grid md:grid-cols-2 gap-12 items-center relative z-10 pt-20 md:pt-0">
        <div className="space-y-8">
          <p className="text-emerald-500 font-mono text-lg md:text-xl flex items-center gap-2 h-8">
            <span className="w-10 h-px bg-emerald-500"></span> 
            <Typewriter text="Hello, I'm" delay={50} />
          </p>
          
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold text-slate-900 dark:text-slate-100 leading-tight min-h-[1.2em]">
            <GlossyText>
              <Typewriter text={PERSONAL_INFO.name} delay={150} startDelay={1000} />
            </GlossyText>
          </h1>
          
          <h2 className="text-2xl md:text-4xl text-slate-600 dark:text-slate-400 font-light min-h-[3rem] flex items-center gap-2">
            <GlossyText className="font-semibold">
              <TextScramble phrases={['Data Enthusiast', 'AI/ML Enthusiast', 'Automation Enthusiast']} />
            </GlossyText>
          </h2>

          <div className="flex flex-wrap gap-3 pt-4">
            <button 
              onClick={() => scrollTo('contact')} 
              className="bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-white font-bold py-3 px-8 text-lg rounded-full transition-all flex items-center gap-2 cursor-pointer shadow-[0_0_20px_rgba(16,185,129,0.3)] hover:shadow-[0_0_30px_rgba(16,185,129,0.5)] hover:-translate-y-1"
            >
              <Mail size={20} /> Contact Me
            </button>
            <a href={PERSONAL_INFO.linkedin} target="_blank" rel="noreferrer" className="bg-white/50 hover:bg-white/80 dark:bg-slate-900/30 dark:hover:bg-slate-900/50 backdrop-blur-md border border-slate-200/50 dark:border-slate-700/50 hover:border-emerald-500/50 text-slate-700 dark:text-slate-300 hover:text-emerald-500 dark:hover:text-emerald-400 py-3 px-6 text-lg rounded-full transition-all flex items-center gap-2 hover:-translate-y-1 shadow-sm">
              <LinkedinIcon size={20} /> LinkedIn
            </a>
            <a href={PERSONAL_INFO.github} target="_blank" rel="noreferrer" className="bg-white/50 hover:bg-white/80 dark:bg-slate-900/30 dark:hover:bg-slate-900/50 backdrop-blur-md border border-slate-200/50 dark:border-slate-700/50 hover:border-emerald-500/50 text-slate-700 dark:text-slate-300 hover:text-emerald-500 dark:hover:text-emerald-400 py-3 px-6 text-lg rounded-full transition-all flex items-center gap-2 hover:-translate-y-1 shadow-sm">
              <GithubIcon size={20} /> GitHub
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};
