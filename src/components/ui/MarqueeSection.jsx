import React, { useState, useEffect, useRef } from 'react';
import { Pause, Play, LayoutGrid } from 'lucide-react';
import { SectionHeader } from './SectionHeader';
import { BackgroundOverlay } from './BackgroundOverlay';
import { GlossyText } from './GlossyText';

export const MarqueeSection = ({ 
  id, 
  title, 
  subtitle, 
  items = [], 
  renderCard, 
  bgImage, 
  headerAction,
  onOpenCertDirectory,
  isCertDirectoryOpen = false,
  triggerRef,
  browseAllText
}) => {
  const [isPaused, setIsPaused] = useState(false);
  const [isInView, setIsInView] = useState(true);
  const containerRef = useRef(null);

  useEffect(() => {
    if (typeof window === 'undefined' || !('IntersectionObserver' in window)) {
      return;
    }
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry) {
          setIsInView(entry.isIntersecting);
        }
      },
      { rootMargin: '200px' }
    );
    const target = containerRef.current;
    if (target) {
      observer.observe(target);
    }
    return () => {
      if (target) {
        observer.unobserve(target);
      }
      observer.disconnect();
    };
  }, []);

  const WINDOW_SIZE = 8;
  const window1 = items.slice(0, WINDOW_SIZE);
  const window2 = items.slice(WINDOW_SIZE, WINDOW_SIZE * 2).length >= 4 
    ? items.slice(WINDOW_SIZE, WINDOW_SIZE * 2) 
    : [...items].reverse().slice(0, WINDOW_SIZE);

  const row1 = [...window1, ...window1];
  const row2 = [...window2, ...window2];
  const animationDuration = `${Math.max(40, Math.round(WINDOW_SIZE * 5))}s`;
  const isAnimationPaused = isPaused || !isInView;

  return (
    <section 
      ref={containerRef} 
      id={id || "certifications"} 
      className="py-20 relative overflow-hidden bg-slate-50 dark:bg-slate-950"
    >
      <div className="absolute inset-0 z-0">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${bgImage})` }}
        />
        <div className="absolute inset-0 bg-slate-50/90 dark:bg-slate-950/90" />
        <BackgroundOverlay />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 mb-8 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <SectionHeader 
            title={typeof title === 'string' ? <GlossyText>{title}</GlossyText> : title} 
            subtitle={subtitle} 
          />
        </div>
        <div className="flex items-center gap-3 self-start sm:self-auto shrink-0 flex-wrap">
          <span className="inline-flex items-center px-3 py-2 min-h-[44px] rounded-xl border border-emerald-700/30 dark:border-emerald-400/30 bg-emerald-50/90 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 text-xs font-mono font-semibold">
            {items.length >= 80 ? '80+' : items.length} Credentials
          </span>
          {onOpenCertDirectory && (
            <button
              ref={triggerRef}
              type="button"
              onClick={onOpenCertDirectory}
              aria-haspopup="dialog"
              aria-expanded={isCertDirectoryOpen}
              aria-controls="certifications-directory-modal"
              className="inline-flex items-center gap-2 px-3.5 py-2 min-h-[44px] rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white dark:bg-emerald-500 dark:hover:bg-emerald-400 dark:text-slate-950 text-xs font-semibold shadow-xs cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 transition-colors"
            >
              <LayoutGrid size={15} aria-hidden="true" />
              <span>{browseAllText || `Browse All ${items.length >= 80 ? '80+' : items.length}`}</span>
            </button>
          )}
          {headerAction}
          <button
            type="button"
            onClick={() => setIsPaused(!isPaused)}
            aria-label={isPaused ? "Resume certifications animation" : "Pause certifications animation"}
            className="inline-flex items-center gap-2 px-4 py-2 min-h-[44px] rounded-xl border border-slate-200/90 dark:border-emerald-950/70 bg-white/90 dark:bg-slate-900/90 text-slate-700 dark:text-slate-300 hover:text-emerald-700 dark:hover:text-emerald-400 hover:border-emerald-700/40 text-xs font-semibold shadow-xs cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-700 dark:focus-visible:outline-emerald-400 transition-colors"
          >
            {isPaused ? <Play size={15} aria-hidden="true" /> : <Pause size={15} aria-hidden="true" />}
            <span>{isPaused ? "Resume Animation" : "Pause Animation"}</span>
          </button>
        </div>
      </div>

      {/* Row 1: Moves Right */}
      <div className="relative z-10 flex gap-8 mb-8 overflow-hidden w-full focus-within:[animation-play-state:paused]">
        <div 
          className={`flex gap-8 animate-scroll-right min-w-max hover:[animation-play-state:paused] focus-within:[animation-play-state:paused] ${
            isAnimationPaused ? 'animate-paused' : ''
          }`}
          style={{ 
            animationDuration, 
            animationPlayState: isAnimationPaused ? 'paused' : 'running' 
          }}
        >
          {row1.map((item, index) => renderCard(item, `r1-${index}`, index >= window1.length))}
        </div>
      </div>

      {/* Row 2: Moves Left */}
      <div className="relative z-10 flex gap-8 overflow-hidden w-full focus-within:[animation-play-state:paused]">
        <div 
          className={`flex gap-8 animate-scroll-left min-w-max hover:[animation-play-state:paused] focus-within:[animation-play-state:paused] ${
            isAnimationPaused ? 'animate-paused' : ''
          }`}
          style={{ 
            animationDuration, 
            animationPlayState: isAnimationPaused ? 'paused' : 'running' 
          }}
        >
          {row2.map((item, index) => renderCard(item, `r2-${index}`, true))}
        </div>
      </div>
    </section>
  );
};
