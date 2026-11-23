import React, { useState, useEffect, useRef } from 'react';
import { ExternalLink } from 'lucide-react';
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/react";

import { useBackgroundImage } from './hooks/useBackgroundImage';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { Hero } from './components/sections/Hero';
import { About } from './components/sections/About';
import { Projects } from './components/sections/Projects';
import { Experience } from './components/sections/Experience';
import { Skills } from './components/sections/Skills';
import { Contact } from './components/sections/Contact';
import { MarqueeSection } from './components/ui/MarqueeSection';
import { CertBadge } from './components/ui/CertBadge';
import { CertificationsDirectoryModal } from './components/ui/CertificationsDirectoryModal';
import { GlossyText } from './components/ui/GlossyText';
import { I18nProvider, useI18n } from './lib/i18n';

import { 
  PERSONAL_INFO,
  CERTIFICATIONS, 
  LOCAL_BACKGROUNDS, 
  REMOTE_BACKGROUNDS 
} from './data/constants';

function AppContent({ isDarkMode, toggleTheme }) {
  const { t } = useI18n();
  const [activeSection, setActiveSection] = useState("");
  const [scrollDirection, setScrollDirection] = useState('up');
  const [isCertDirectoryOpen, setIsCertDirectoryOpen] = useState(false);
  const certDirectoryTriggerRef = useRef(null);
  const lastScrollY = useRef(0);
  const programmaticScrollRef = useRef({ active: false, timer: null });
  const scrollRafRef = useRef(null);

  const certificationsBg = useBackgroundImage(LOCAL_BACKGROUNDS.certifications, REMOTE_BACKGROUNDS.certifications);

  // Passive window scroll listener throttled via requestAnimationFrame
  useEffect(() => {
    const syncScrollState = () => {
      scrollRafRef.current = null;
      const currentY = window.scrollY;

      if (programmaticScrollRef.current.active) {
        lastScrollY.current = currentY;
        return;
      }

      if (currentY > lastScrollY.current && currentY > 100) {
        setScrollDirection('down');
      } else if (currentY < lastScrollY.current) {
        setScrollDirection('up');
      }
      lastScrollY.current = currentY;

      const sections = ['projects', 'experience', 'about', 'skills', 'certifications', 'contact'];
      const threshold = currentY + window.innerHeight * 0.4;
      let current = "";

      if (currentY > 200) {
        // Batch all DOM measurements before committing React state
        const offsets = sections.map((id) => {
          const el = document.getElementById(id);
          return el ? { id, offsetTop: el.getBoundingClientRect().top + currentY } : null;
        });

        for (const item of offsets) {
          if (item && threshold >= item.offsetTop) {
            let label = item.id.charAt(0).toUpperCase() + item.id.slice(1);
            if (label === 'Certifications') label = 'Awards';
            current = label;
          }
        }
      }
      setActiveSection(current);
    };

    const handleScroll = () => {
      if (scrollRafRef.current !== null) return;
      scrollRafRef.current = window.requestAnimationFrame(syncScrollState);
    };

    const progScroll = programmaticScrollRef.current;
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (scrollRafRef.current !== null) {
        window.cancelAnimationFrame(scrollRafRef.current);
      }
      if (progScroll.timer) {
        window.clearTimeout(progScroll.timer);
      }
    };
  }, []);

  const scrollTo = (id) => {
    if (programmaticScrollRef.current.timer) {
      window.clearTimeout(programmaticScrollRef.current.timer);
    }
    programmaticScrollRef.current.active = true;
    setScrollDirection('up');

    if (id === 'top') {
      setActiveSection("");
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      let label = id.charAt(0).toUpperCase() + id.slice(1);
      if (label === 'Certifications') label = 'Awards';
      setActiveSection(label);

      const target = document.getElementById(id);
      if (target) {
        target.scrollIntoView({ behavior: 'smooth' });
      }
    }

    programmaticScrollRef.current.timer = window.setTimeout(() => {
      programmaticScrollRef.current.active = false;
      programmaticScrollRef.current.timer = null;
    }, 750);
  };

  return (
    <div className={`min-h-[100svh] font-sans selection:bg-emerald-500/30 dark:selection:bg-emerald-400/30 ${isDarkMode ? 'dark' : ''} bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-200 transition-colors duration-300`}>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:px-4 focus:py-2 focus:bg-emerald-700 focus:text-white focus:rounded-lg focus:shadow-lg focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:ring-offset-2"
      >
        Skip to main content
      </a>
      <Navbar 
        isDarkMode={isDarkMode} 
        toggleTheme={toggleTheme} 
        activeSection={activeSection} 
        scrollTo={scrollTo} 
        scrollDirection={scrollDirection} 
      />

      <main id="main" tabIndex="-1" className="bg-slate-50 dark:bg-slate-950 focus:outline-none">
        <div>
          <Hero isDarkMode={isDarkMode} scrollTo={scrollTo} />
          <Projects scrollTo={scrollTo} />
          <Experience />
          <About />
          <Skills />
          
          <div id="certifications">
            <MarqueeSection 
              title={<GlossyText>{t('certifications.title') || "Awards & Certifications"}</GlossyText>}
              subtitle={t('certifications.subtitle') || "80+ verified industry credentials across AI Engineering, Cloud Data Infrastructure, and Corporate Operational Excellence"} 
              items={CERTIFICATIONS} 
              bgImage={certificationsBg}
              onOpenCertDirectory={() => setIsCertDirectoryOpen(true)}
              isCertDirectoryOpen={isCertDirectoryOpen}
              triggerRef={certDirectoryTriggerRef}
              browseAllText={t('certifications.browseAll', { count: CERTIFICATIONS.length >= 80 ? '80+' : CERTIFICATIONS.length }) || `Browse All ${CERTIFICATIONS.length >= 80 ? '80+' : CERTIFICATIONS.length}`}
              headerAction={
                <a
                  href={PERSONAL_INFO?.linkedin ? `${PERSONAL_INFO.linkedin.replace(/\/$/, '')}/details/certifications/` : "https://www.linkedin.com/in/william-oo00/details/certifications/"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-2 min-h-[44px] rounded-xl border border-slate-300 dark:border-slate-700 bg-white/80 dark:bg-slate-900/80 text-slate-700 dark:text-slate-300 hover:text-emerald-700 dark:hover:text-emerald-400 hover:border-emerald-700/40 text-xs font-semibold shadow-xs transition-colors"
                >
                  <span>{t('certifications.viewOnLinkedIn') || "View All on LinkedIn"}</span>
                  <ExternalLink size={14} aria-hidden="true" />
                  <span className="sr-only">(opens in new window)</span>
                </a>
              }
              renderCard={(cert, key, isDuplicate) => (
                <a 
                  key={key} 
                  href={cert.link || "#"} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  tabIndex={isDuplicate ? -1 : 0}
                  aria-hidden={isDuplicate ? "true" : undefined}
                  style={{ contentVisibility: 'auto' }}
                  className="bg-white/95 dark:bg-slate-900/95 p-8 rounded-2xl border border-slate-200 dark:border-slate-800 flex flex-col justify-between hover:border-emerald-700/50 dark:hover:border-emerald-400/50 transition-all w-80 sm:w-96 shrink-0 h-64 cursor-pointer group shadow-md hover:shadow-lg block"
                >
                  <div>
                    <div className="mb-4 flex items-center justify-between gap-3">
                      <CertBadge 
                        src={cert.image} 
                        alt="" 
                        issuer={cert.issuer} 
                        size="md" 
                      />
                      {cert.date && (
                        <span className="font-mono text-xs px-2.5 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/80 font-medium">
                          {cert.date}
                        </span>
                      )}
                    </div>
                    <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-1.5 leading-snug group-hover:text-emerald-700 dark:group-hover:text-emerald-400 transition-colors line-clamp-2">
                      {cert.title}
                    </h3>
                    <p className="text-sm font-medium text-slate-700 dark:text-slate-300">{cert.issuer}</p>
                  </div>
                  {cert.credentialId && (
                    <p className="text-xs font-mono text-slate-500 dark:text-slate-400 pt-3 border-t border-slate-100 dark:border-slate-800/80 truncate">
                      ID: {cert.credentialId}
                    </p>
                  )}
                </a>
              )} 
            />
            <CertificationsDirectoryModal
              isOpen={isCertDirectoryOpen}
              onClose={() => setIsCertDirectoryOpen(false)}
              certifications={CERTIFICATIONS}
              triggerRef={certDirectoryTriggerRef}
            />
          </div>

          <Contact isDarkMode={isDarkMode} />
        </div>
      </main>

      <Footer />
      <Analytics />
      <SpeedInsights />
    </div>
  );
}

export default function App() {
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

  return (
    <I18nProvider>
      <AppContent isDarkMode={isDarkMode} toggleTheme={toggleTheme} />
    </I18nProvider>
  );
}
