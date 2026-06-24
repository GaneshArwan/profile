import React from 'react';
import { SectionHeader } from '../ui/SectionHeader';
import { GlossyText } from '../ui/GlossyText';
import { BackgroundOverlay } from '../ui/BackgroundOverlay';
import { useBackgroundImage } from '../../hooks/useBackgroundImage';
import { PERSONAL_INFO, LOCAL_BACKGROUNDS, REMOTE_BACKGROUNDS } from '../../data/constants';

export const About = ({ blurPx }) => {
  const bgImage = useBackgroundImage(LOCAL_BACKGROUNDS.about, REMOTE_BACKGROUNDS.about);

  return (
    <section id="about" className="py-20 pt-40 relative transition-colors duration-300 scroll-mt-28 bg-slate-50 dark:bg-slate-950">
      <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-cover bg-center bg-no-repeat bg-fixed" style={{ backgroundImage: `url(${bgImage})` }} />
          <div className="absolute inset-0 bg-slate-50/90 dark:bg-slate-950/90 transition-[backdrop-filter] duration-300" style={{ backdropFilter: `blur(${blurPx}px)`, WebkitBackdropFilter: `blur(${blurPx}px)` }}></div>
          <BackgroundOverlay />
      </div>

      <div className="max-w-5xl mx-auto px-6 relative z-10">
        <SectionHeader title={<GlossyText>About Me</GlossyText>} />
        
        <div className="relative group">
          <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500 to-teal-400 rounded-3xl blur-lg opacity-20 group-hover:opacity-40 transition duration-1000 group-hover:duration-200"></div>
          <div className="relative bg-white/80 dark:bg-slate-900/80 p-8 md:p-12 rounded-3xl border border-white/50 dark:border-slate-700/50 shadow-xl backdrop-blur-xl">
            <div className="text-slate-600 dark:text-slate-300 text-lg md:text-xl leading-loose whitespace-pre-line text-left md:text-justify">
              {PERSONAL_INFO.about}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
