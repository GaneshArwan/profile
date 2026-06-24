import React, { useState, useEffect, useRef } from 'react';
import LocomotiveScroll from 'locomotive-scroll';
import 'locomotive-scroll/dist/locomotive-scroll.css';
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/react";

import { useBackgroundImage } from './hooks/useBackgroundImage';
import { Navbar } from './components/layout/Navbar';
import { SideRibbonNavigation } from './components/layout/SideRibbonNavigation';
import { Footer } from './components/layout/Footer';
import { Hero } from './components/sections/Hero';
import { About } from './components/sections/About';
import { Projects } from './components/sections/Projects';
import { Experience } from './components/sections/Experience';
import { Contact } from './components/sections/Contact';
import { FuturisticLoader } from './components/ui/FuturisticLoader';
import { CustomCursor } from './components/ui/CustomCursor';
import { MarqueeSection } from './components/ui/MarqueeSection';
import { CertificateModal } from './components/ui/CertificateModal';

import { 
  SKILLS, 
  CERTIFICATIONS, 
  LOCAL_BACKGROUNDS, 
  REMOTE_BACKGROUNDS 
} from './data/constants';

export default function App() {
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedImage] = useState('');
  const [selectedTitle] = useState('');
  
  const [isDarkMode, setIsDarkMode] = useState(() => {
    try {
      if (typeof window !== 'undefined') {
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme) return savedTheme === 'dark';
        return window.matchMedia('(prefers-color-scheme: dark)').matches;
      }
    } catch {
      // Do nothing
    }
    return true; 
  });

  const [isLoading, setIsLoading] = useState(true);
  const [blurPx, setBlurPx] = useState(0);
  const [activeSection, setActiveSection] = useState("");
  const scrollRef = useRef(null);

  const skillsBg = useBackgroundImage(LOCAL_BACKGROUNDS.skills, REMOTE_BACKGROUNDS.skills);
  const certificationsBg = useBackgroundImage(LOCAL_BACKGROUNDS.certifications, REMOTE_BACKGROUNDS.certifications);

  useEffect(() => {
    if (isLoading) return;

    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }

    const scrollEl = document.querySelector('[data-scroll-container]');
    if (!scrollEl) return;

    const scroll = new LocomotiveScroll({
      el: scrollEl,
      smooth: true,
      smartphone: { smooth: true },
      tablet: { smooth: true },
      multiplier: 1.0,
    });
    scrollRef.current = scroll;

    const resizeObserver = new ResizeObserver(() => {
      scroll.update();
    });
    resizeObserver.observe(scrollEl);

    const handleLoad = () => scroll.update();
    window.addEventListener('load', handleLoad);

    scroll.on('scroll', (args) => {
      const currentY = args.scroll.y;
      
      if (currentY < 120) setBlurPx(0);
      else if (currentY < 360) setBlurPx(1);
      else setBlurPx(1);

      const sections = ['about', 'projects', 'skills', 'experience', 'certifications', 'contact'];
      let current = "";
      
      if (currentY > 200) {
        for (const id of sections) {
          const el = document.getElementById(id);
          if (el) {
            const offsetTop = el.getBoundingClientRect().top + currentY;
            if (currentY >= offsetTop - window.innerHeight * 0.4) {
              let label = id.charAt(0).toUpperCase() + id.slice(1);
              if(label === 'Certifications') label = 'Awards';
              current = label;
            }
          }
        }
      }
      setActiveSection(current);
    });

    return () => {
      window.removeEventListener('load', handleLoad);
      resizeObserver.disconnect();
      if (scroll) scroll.destroy();
    };
  }, [isLoading]);

  const scrollTo = (id) => {
    if(!scrollRef.current) return;
    
    if (id === 'top') {
        scrollRef.current.scrollTo('top');
    } else {
        const target = document.getElementById(id);
        if (target) {
            scrollRef.current.scrollTo(target);
        }
    }
  };

  const toggleTheme = () => {
    const next = !isDarkMode;
    setIsDarkMode(next);
    try {
      const root = window.document.documentElement;
      if (next) { root.classList.add('dark'); localStorage.setItem('theme', 'dark'); } 
      else { root.classList.remove('dark'); localStorage.setItem('theme', 'light'); }
    } catch {
      // Do nothing
    }
  };

  useEffect(() => {
    const root = window.document.documentElement;
    if (isDarkMode) root.classList.add('dark');
    else root.classList.remove('dark');
  }, [isDarkMode]);

  if (isLoading) return <FuturisticLoader onComplete={() => setIsLoading(false)} />;

  return (
    <div className={`min-h-[100svh] font-sans selection:bg-emerald-500/30 ${isDarkMode ? 'dark' : ''} bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-200 transition-colors duration-300`}>
      <CustomCursor />
      <Navbar isDarkMode={isDarkMode} toggleTheme={toggleTheme} activeSection={activeSection} scrollTo={scrollTo} />
      <SideRibbonNavigation scrollTo={scrollTo} />
      <CertificateModal isOpen={modalOpen} onClose={() => setModalOpen(false)} imageSrc={selectedImage} title={selectedTitle} />

      <main data-scroll-container className="bg-slate-50 dark:bg-slate-950">
        <div data-scroll-section>
            <Hero blurPx={blurPx} isDarkMode={isDarkMode} scrollTo={scrollTo} />
        </div>
        
        <div data-scroll-section><About blurPx={blurPx} /></div>
        <div data-scroll-section><Projects blurPx={blurPx} /></div>
        
        <div data-scroll-section id="skills">
            <MarqueeSection 
              title="Skills" subtitle="Tools and technologies I use to drive insights." 
              items={SKILLS} bgImage={skillsBg} blurPx={blurPx} 
              renderCard={(skill, key) => (
                <div key={key} className="bg-white/30 dark:bg-slate-900/30 p-8 rounded-2xl border border-white/20 dark:border-slate-800 hover:border-emerald-500/50 transition-all w-72 shrink-0 flex flex-col items-center text-center justify-center gap-4 group shadow-lg hover:shadow-xl backdrop-blur-xl">
                  <div className="w-16 h-16 flex items-center justify-center rounded-2xl bg-slate-100 dark:bg-white/5 p-2 transition-transform group-hover:scale-110"><img src={skill.image} alt={skill.name} className="w-full h-full object-contain" /></div>
                  <div><h3 className="text-xl font-bold text-slate-900 dark:text-slate-200">{skill.name}</h3><p className="text-sm text-slate-500 mt-1">{skill.category}</p></div>
                </div>
              )} 
            />
        </div>

        <div data-scroll-section><Experience blurPx={blurPx} /></div>
        
        <div data-scroll-section id="certifications">
            <MarqueeSection 
              title="Certifications & Awards" subtitle="Recognitions of my expertise and dedication." 
              items={CERTIFICATIONS} bgImage={certificationsBg} blurPx={blurPx} 
              renderCard={(cert, key) => (
                <a key={key} href={cert.link || "#"} target="_blank" rel="noopener noreferrer" className="bg-white/30 dark:bg-slate-900/30 p-8 rounded-2xl border border-white/20 dark:border-slate-800 flex flex-col justify-between hover:border-emerald-500/50 transition-all w-96 shrink-0 h-64 cursor-pointer group shadow-lg hover:shadow-xl backdrop-blur-xl block">
                  <div>
                    <div className="mb-6 h-16 w-16 rounded-full bg-slate-50 dark:bg-slate-800 flex items-center justify-center overflow-hidden border border-slate-100 dark:border-slate-700"><img src={cert.image} alt={cert.issuer} className="w-full h-full object-cover" /></div>
                    <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-2 leading-tight group-hover:text-emerald-500 transition-colors">{cert.title}</h3>
                    <p className="text-slate-500 dark:text-slate-400">{cert.issuer}</p>
                  </div>
                </a>
              )} 
            />
        </div>

        <div data-scroll-section><Contact blurPx={blurPx} isDarkMode={isDarkMode} /></div>
        <div data-scroll-section><Footer /></div>
        <Analytics />
        <SpeedInsights />
      </main>
    </div>
  );
}