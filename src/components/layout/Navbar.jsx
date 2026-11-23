import React, { useState, useEffect, useLayoutEffect, useRef, useCallback, useMemo } from 'react';
import { Home, Sun, Moon, Menu, X } from 'lucide-react';
import { useI18n } from '../../lib/i18n';

export const Navbar = ({ isDarkMode, toggleTheme, activeSection, scrollTo, scrollDirection }) => {
  const [isOpen, setIsOpen] = useState(false);
  const { locale, toggleLocale, t } = useI18n();
  const menuButtonRef = useRef(null);
  const drawerRef = useRef(null);
  const wasOpenRef = useRef(false);
  const navContainerRef = useRef(null);
  const navItemRefs = useRef({});
  const [pillStyle, setPillStyle] = useState({ x: 0, width: 0, visible: false });

  const handleLinkClick = (id) => {
    scrollTo(id);
    setIsOpen(false);
  };

  // Focus trap and focus restoration for mobile drawer (WCAG 2.1.1 & 2.4.3)
  useEffect(() => {
    if (isOpen) {
      wasOpenRef.current = true;
      const focusable = drawerRef.current?.querySelectorAll('button, a, [tabindex="0"]');
      if (focusable && focusable.length > 0) {
        focusable[0].focus();
      }
    } else if (wasOpenRef.current) {
      wasOpenRef.current = false;
      menuButtonRef.current?.focus();
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!isOpen) return;

      if (e.key === 'Escape') {
        e.preventDefault();
        setIsOpen(false);
        return;
      }

      if (e.key === 'Tab' && drawerRef.current) {
        const focusable = Array.from(
          drawerRef.current.querySelectorAll('button:not(:disabled), a[href], [tabindex="0"]')
        );
        if (focusable.length === 0) return;

        const first = focusable[0];
        const last = focusable[focusable.length - 1];

        if (e.shiftKey) {
          if (document.activeElement === first) {
            e.preventDefault();
            last.focus();
          }
        } else {
          if (document.activeElement === last) {
            e.preventDefault();
            first.focus();
          }
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  const navLinks = useMemo(() => [
    { id: 'projects', labelKey: 'nav.projects', fallback: 'Projects' },
    { id: 'experience', labelKey: 'nav.experience', fallback: 'Experience' },
    { id: 'about', labelKey: 'nav.about', fallback: 'About' },
    { id: 'skills', labelKey: 'nav.skills', fallback: 'Skills' },
    { id: 'certifications', labelKey: 'nav.certifications', fallback: 'Awards' },
    { id: 'contact', labelKey: 'nav.contact', fallback: 'Contact' },
  ], []);

  const isHidden = scrollDirection === 'down' && !isOpen;

  const isActive = useCallback((id, fallback) => {
    if (!activeSection) return false;
    const lower = activeSection.toLowerCase();
    return lower === id.toLowerCase() || lower === fallback.toLowerCase();
  }, [activeSection]);

  const updatePillPosition = useCallback(() => {
    const activeLink = navLinks.find((link) => isActive(link.id, link.fallback));
    if (!activeLink) {
      setPillStyle((prev) => (prev.visible ? { ...prev, visible: false } : prev));
      return;
    }

    const btn = navItemRefs.current[activeLink.id];
    if (!btn) return;

    const x = btn.offsetLeft;
    const width = btn.offsetWidth;
    if (width > 0) {
      setPillStyle({ x, width, visible: true });
    } else {
      setPillStyle({ x: 0, width: 0, visible: false });
    }
  }, [navLinks, isActive]);

  useLayoutEffect(() => {
    const rafId = window.requestAnimationFrame(updatePillPosition);
    window.addEventListener('resize', updatePillPosition, { passive: true });
    return () => {
      window.cancelAnimationFrame(rafId);
      window.removeEventListener('resize', updatePillPosition);
    };
  }, [updatePillPosition, locale]);

  return (
    <header 
      role="banner" 
      className={`sticky top-0 z-50 w-full transition-all duration-300 ${
        isHidden ? '-translate-y-full opacity-0' : 'translate-y-0 opacity-100'
      }`}
    >
      <nav 
        role="navigation" 
        aria-label="Main Navigation"
        className="w-full backdrop-blur-md bg-white/80 dark:bg-slate-950/80 border-b border-slate-200/80 dark:border-slate-800/80"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 md:h-20">
            
            {/* Left: Brand Monogram & Home Button */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => handleLinkClick('top')}
                className="p-2 min-w-[44px] min-h-[44px] flex items-center justify-center rounded-xl text-emerald-700 dark:text-emerald-400 hover:bg-emerald-500/10 transition-colors shrink-0 cursor-pointer"
                aria-label="Back to Top"
              >
                <Home size={22} />
              </button>
              <button
                onClick={() => handleLinkClick('top')}
                className="flex items-center gap-2 group text-left cursor-pointer min-h-[44px]"
              >
                <span className="w-11 h-11 min-w-[44px] min-h-[44px] rounded-xl bg-emerald-700 dark:bg-emerald-500 text-white dark:text-slate-950 font-black text-lg flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform">
                  W.
                </span>
                <div className="hidden sm:block">
                  <span className="text-sm font-bold text-slate-900 dark:text-slate-100 block leading-tight">
                    William
                  </span>
                  <span className="text-[11px] font-mono text-emerald-700 dark:text-emerald-400 block leading-tight">
                    Data & Automation
                  </span>
                </div>
              </button>
            </div>

            {/* Center Desktop Navigation Links (>=1024px) */}
            <div ref={navContainerRef} className="hidden lg:flex items-center gap-1 xl:gap-2 relative p-1 rounded-full">
              <span
                aria-hidden="true"
                data-testid="navbar-active-pill"
                style={{
                  width: `${pillStyle.width}px`,
                  transform: `translate3d(${pillStyle.x}px, 0, 0)`,
                  opacity: pillStyle.visible ? 1 : 0,
                }}
                className="pointer-events-none absolute top-1 bottom-1 left-0 rounded-full bg-emerald-700/15 dark:bg-emerald-400/15 border border-emerald-700/25 dark:border-emerald-400/25 shadow-sm transition-[transform,width,opacity] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] will-change-transform"
              />
              {navLinks.map((link) => {
                const active = isActive(link.id, link.fallback);
                const label = t(link.labelKey) || link.fallback;
                return (
                  <button
                    key={link.id}
                    ref={(el) => {
                      navItemRefs.current[link.id] = el;
                    }}
                    onClick={() => handleLinkClick(link.id)}
                    aria-current={active ? 'page' : undefined}
                    className={`relative z-10 px-3.5 py-2 min-h-[44px] flex items-center justify-center rounded-full text-sm font-semibold border transition-colors duration-300 ease-out cursor-pointer ${
                      active
                        ? pillStyle.visible
                          ? 'text-emerald-800 dark:text-emerald-300 border-transparent'
                          : 'text-emerald-800 dark:text-emerald-300 bg-emerald-700/10 dark:bg-emerald-400/15 border-emerald-700/20 dark:border-emerald-400/20 shadow-sm'
                        : 'border-transparent text-slate-700 dark:text-slate-300 hover:text-emerald-700 dark:hover:text-emerald-400 hover:bg-emerald-500/10'
                    }`}
                  >
                    {label}
                  </button>
                );
              })}
            </div>

            {/* Right Desktop Controls (Locale + Theme + Contact CTA) */}
            <div className="hidden lg:flex items-center gap-3">
              <button
                onClick={toggleLocale}
                aria-label="Toggle language"
                className="px-2.5 py-1.5 min-w-[44px] min-h-[44px] flex items-center justify-center text-xs font-bold rounded-lg border border-slate-300 dark:border-slate-700 hover:border-emerald-700 dark:hover:border-emerald-400 text-slate-700 dark:text-slate-300 hover:text-emerald-700 dark:hover:text-emerald-400 transition-colors uppercase cursor-pointer"
              >
                {locale || 'en'}
              </button>
              <button
                onClick={toggleTheme}
                aria-label="Toggle theme"
                className="p-2 min-w-[44px] min-h-[44px] flex items-center justify-center rounded-xl text-slate-700 dark:text-slate-300 hover:text-emerald-700 dark:hover:text-emerald-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              >
                {isDarkMode ? <Sun size={20} className="lucide-sun" /> : <Moon size={20} className="lucide-moon" />}
              </button>
              <button
                onClick={() => handleLinkClick('contact')}
                className="ml-1 inline-flex items-center justify-center px-4 py-2 min-h-[44px] text-sm font-bold text-white bg-emerald-700 hover:bg-emerald-800 dark:bg-emerald-500 dark:text-slate-950 dark:hover:bg-emerald-400 rounded-full transition-all shadow-sm hover:shadow hover:-translate-y-0.5 cursor-pointer"
              >
                {t('nav.contact') || 'Contact'}
              </button>
            </div>

            {/* Mobile Right Controls (<1024px) */}
            <div className="flex lg:hidden items-center gap-1.5">
              <button
                onClick={toggleLocale}
                aria-label="Toggle language"
                className="px-2.5 py-1 min-w-[44px] min-h-[44px] flex items-center justify-center text-xs font-bold rounded-lg border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:text-emerald-700 dark:hover:text-emerald-400 transition-colors uppercase cursor-pointer"
              >
                {locale || 'en'}
              </button>
              <button
                onClick={toggleTheme}
                aria-label="Toggle theme"
                className="p-2 min-w-[44px] min-h-[44px] flex items-center justify-center rounded-xl text-slate-700 dark:text-slate-300 hover:text-emerald-700 dark:hover:text-emerald-400 transition-colors cursor-pointer"
              >
                {isDarkMode ? <Sun size={20} className="lucide-sun" /> : <Moon size={20} className="lucide-moon" />}
              </button>
              <button
                ref={menuButtonRef}
                onClick={() => setIsOpen(!isOpen)}
                aria-expanded={isOpen}
                aria-label="Toggle navigation menu"
                aria-controls="mobile-navigation-drawer"
                className="p-2 min-w-[44px] min-h-[44px] flex items-center justify-center rounded-xl text-slate-700 dark:text-slate-300 hover:text-emerald-700 dark:hover:text-emerald-400 transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-emerald-600"
              >
                {isOpen ? <X size={24} className="lucide-x" /> : <Menu size={24} className="lucide-menu" />}
              </button>
            </div>

          </div>
        </div>

        {/* Mobile Drawer Dialog (<1024px) */}
        <div
          ref={drawerRef}
          id="mobile-navigation-drawer"
          role="dialog"
          aria-modal={isOpen}
          aria-label="Mobile Navigation"
          className={`lg:hidden absolute top-full left-0 right-0 w-full bg-white/95 dark:bg-slate-900/95 border-b border-slate-200 dark:border-slate-800 backdrop-blur-xl shadow-xl transition-all duration-300 ease-in-out ${
            isOpen ? 'opacity-100 translate-y-0 scale-100 visible pointer-events-auto' : 'opacity-0 -translate-y-4 scale-95 invisible pointer-events-none'
          }`}
        >
          <div className="max-w-7xl mx-auto px-6 py-6 flex flex-col space-y-2">
            {navLinks.map((link) => {
              const active = isActive(link.id, link.fallback);
              const label = t(link.labelKey) || link.fallback;
              const isContactLink = link.id === 'contact';
              return (
                <button
                  key={link.id}
                  onClick={() => handleLinkClick(link.id)}
                  className={`text-left text-lg py-2.5 px-4 min-h-[44px] flex items-center rounded-xl font-semibold transition-all cursor-pointer ${
                    active
                      ? 'text-emerald-800 dark:text-emerald-300 bg-emerald-700/10 dark:bg-emerald-400/15 border border-emerald-700/20 dark:border-emerald-400/20 font-bold'
                      : isContactLink
                        ? 'text-white bg-emerald-700 hover:bg-emerald-800 dark:bg-emerald-500 dark:text-slate-950 dark:hover:bg-emerald-400 font-bold shadow-sm mt-1'
                        : 'text-slate-700 dark:text-slate-300 hover:text-emerald-700 dark:hover:text-emerald-400 hover:bg-emerald-500/10'
                  }`}
                >
                  {label}
                </button>
              );
            })}
            <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs text-slate-600 dark:text-slate-400">
              <span>{t('nav.status') || 'Available for Enterprise Roles'}</span>
              <span className="font-mono font-bold text-amber-800 dark:text-amber-400">Untar GPA 3.89</span>
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
};
