import React from 'react';
import { SectionHeader } from './SectionHeader';
import { BackgroundOverlay } from './BackgroundOverlay';
import { GlossyText } from './GlossyText';

export const MarqueeSection = ({ title, subtitle, items, renderCard, bgImage, blurPx }) => {
  // Split items into two rows for the visual effect
  const row1 = [...items, ...items, ...items]; // Triple for smooth loop
  const row2 = [...items.reverse(), ...items, ...items]; 

  return (
    <section className="py-20 relative overflow-hidden bg-slate-50 dark:bg-slate-950">
      <div className="absolute inset-0 z-0">
          <div 
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{ backgroundImage: `url(${bgImage})` }}
          />
          <div
            className="absolute inset-0 bg-slate-50/90 dark:bg-slate-950/90 transition-[backdrop-filter] duration-300"
            style={{
              backdropFilter: `blur(${blurPx}px)`,
              WebkitBackdropFilter: `blur(${blurPx}px)`
            }}
          ></div>
          <BackgroundOverlay />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 mb-12">
        <SectionHeader title={<GlossyText>{title}</GlossyText>} subtitle={subtitle} />
      </div>

      {/* Row 1: Moves Right */}
      <div className="relative z-10 flex gap-8 mb-8 overflow-hidden w-full">
        <div className="flex gap-8 animate-scroll-right min-w-max hover:[animation-play-state:paused]">
          {row1.map((item, index) => renderCard(item, `r1-${index}`))}
        </div>
      </div>

      {/* Row 2: Moves Left */}
      <div className="relative z-10 flex gap-8 overflow-hidden w-full">
        <div className="flex gap-8 animate-scroll-left min-w-max hover:[animation-play-state:paused]">
          {row2.map((item, index) => renderCard(item, `r2-${index}`))}
        </div>
      </div>
    </section>
  );
};
