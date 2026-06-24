import React, { useState, useEffect, useRef } from 'react';
import { SectionHeader } from './SectionHeader';
import { BackgroundOverlay } from './BackgroundOverlay';

export const StickyScrollSection = ({ id, title, subtitle, items, renderCard, bgImage }) => {
  const sectionRef = useRef(null);
  const containerRef = useRef(null);
  const [translateX, setTranslateX] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      if (!sectionRef.current || !containerRef.current) return;

      const sectionTop = sectionRef.current.offsetTop;
      const sectionHeight = sectionRef.current.offsetHeight;
      const windowScroll = window.scrollY;
      const windowHeight = window.innerHeight;

      const startScroll = sectionTop;
      const endScroll = sectionTop + sectionHeight - windowHeight;
      
      if (windowScroll >= startScroll && windowScroll <= endScroll + windowHeight) {
        const scrollDistance = windowScroll - startScroll;
        const maxScrollDistance = sectionHeight - windowHeight;
        
        const contentWidth = containerRef.current.scrollWidth;
        const viewportWidth = window.innerWidth;
        const maxTranslate = contentWidth - viewportWidth + 500;

        let progress = scrollDistance / maxScrollDistance;
        progress = Math.max(0, Math.min(progress, 1));

        setTranslateX(progress * maxTranslate);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [items]);

  return (
    <section id={id} ref={sectionRef} className="relative h-[400vh] transition-colors duration-300 scroll-mt-24">
      <div className="absolute inset-0 z-0">
          <div 
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{ backgroundImage: `url(${bgImage})` }}
          />
          <div className="absolute inset-0 bg-slate-50/90 dark:bg-slate-950/90" />
          <BackgroundOverlay />
      </div>

      <div className="sticky top-0 h-[100svh] overflow-hidden flex flex-col pt-32 md:pt-40 px-6 max-w-7xl mx-auto z-10">
        <div className="w-full shrink-0">
          <SectionHeader title={title} subtitle={subtitle} />
        </div>
        
        <div className="flex-1 flex items-center">
          <div 
            ref={containerRef}
            className="flex gap-8 w-max will-change-transform pb-20" 
            style={{ transform: `translateX(-${translateX}px)` }}
          >
            {items.map((item, index) => renderCard(item, index))}
          </div>
        </div>
      </div>
    </section>
  );
};
