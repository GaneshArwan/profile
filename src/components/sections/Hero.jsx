import React, { useState, useEffect, useRef } from 'react';
import { 
  Mail, 
  MapPin, 
  Layers, 
  GraduationCap, 
  Building2, 
  Award, 
  CheckCircle2 
} from 'lucide-react';
import { Typewriter } from '../ui/Typewriter';
import { GlossyText } from '../ui/GlossyText';
import { BackgroundOverlay } from '../ui/BackgroundOverlay';
import { GithubIcon, LinkedinIcon } from '../icons';
import { PERSONAL_INFO, HERO_VIDEOS } from '../../data/constants';
import { useI18n } from '../../lib/i18n';
import { useOptimizedVideo } from '../../hooks/useOptimizedVideo';

export const Hero = ({ isDarkMode, scrollTo }) => {
  const { t, isIndonesian } = useI18n();
  const { videoRef, isInView } = useOptimizedVideo({ threshold: 0.1 });
  const prevDarkModeRef = useRef(isDarkMode);
  const [hoveredMetric, setHoveredMetric] = useState(null);

  useEffect(() => {
    if (prevDarkModeRef.current === isDarkMode) return;
    prevDarkModeRef.current = isDarkMode;

    const video = videoRef.current;
    if (!video) return;

    try {
      if (typeof video.load === 'function') {
        video.load();
      }
    } catch {
      // Ignore media load errors in simulated DOM environments
    }

    const prefersReducedMotion =
      typeof window !== 'undefined' &&
      typeof window.matchMedia === 'function' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const isDocVisible = typeof document !== 'undefined' ? !document.hidden : true;

    if (isInView && !prefersReducedMotion && isDocVisible && typeof video.play === 'function') {
      try {
        const playPromise = video.play();
        if (playPromise && typeof playPromise.catch === 'function') {
          playPromise.catch(() => {});
        }
      } catch {
        // Ignore synchronous playback block errors
      }
    }
  }, [isDarkMode, isInView, videoRef]);

  const credentialChips = [
    {
      id: 'edu',
      prefix: '[EDU]',
      icon: GraduationCap,
      label: isIndonesian ? "Untar S1 IPK 3.89" : "Untar S1 3.89",
      ariaLabel: "Education: Tarumanagara University Informatics, GPA 3.89",
      badgeClass: "border-amber-200/80 dark:border-amber-800/80 bg-amber-50/70 dark:bg-amber-950/40 text-amber-900 dark:text-amber-200 hover:border-amber-700/50 dark:hover:border-amber-400/50",
      iconClass: "text-amber-800 dark:text-amber-400"
    },
    {
      id: 'exp',
      prefix: '[MDM]',
      icon: Building2,
      label: isIndonesian ? "Kawan Lama Group" : "Kawan Lama Group",
      ariaLabel: "Experience: Kawan Lama Group Master Data Management Officer",
      badgeClass: "border-teal-200/80 dark:border-teal-800/80 bg-teal-50/70 dark:bg-teal-950/40 text-teal-900 dark:text-teal-200 hover:border-teal-700/50 dark:hover:border-teal-400/50",
      iconClass: "text-teal-700 dark:text-teal-400"
    },
    {
      id: 'award',
      prefix: '[AWARD]',
      icon: Award,
      label: isIndonesian ? "Penerima Best Intern" : "Best Intern",
      ariaLabel: "Distinction: Awarded Best Intern at Kawan Lama Group",
      badgeClass: "border-amber-200/80 dark:border-amber-800/80 bg-amber-50/70 dark:bg-amber-950/40 text-amber-900 dark:text-amber-200 hover:border-amber-700/50 dark:hover:border-amber-400/50",
      iconClass: "text-amber-800 dark:text-amber-400"
    },
    {
      id: 'honors',
      prefix: '[HONORS]',
      icon: Award,
      label: isIndonesian ? "Lulusan Berpredikat Pujian (IPK 3.89)" : "High Distinction Honors (GPA 3.89)",
      ariaLabel: "Academic Honors: High Distinction GPA 3.89",
      badgeClass: "border-amber-200/80 dark:border-amber-800/80 bg-amber-50/70 dark:bg-amber-950/40 text-amber-900 dark:text-amber-200 hover:border-amber-700/50 dark:hover:border-amber-400/50",
      iconClass: "text-amber-800 dark:text-amber-400"
    }
  ];

  const impactMetrics = [
    {
      id: 'mdm-accuracy',
      value: ">99.0%",
      label: isIndonesian ? "Akurasi Master Data" : "Master Data Accuracy",
      detail: isIndonesian ? "Di 5 domain utama: Site, Vendor, Customer, Article, Finance" : "Across 5 core domains: Site, Vendor, Customer, Article, Finance",
      systemTag: "Kawan Lama MDM",
      subsystem: "5 Governed Domains",
      protocol: "GWS SHEETS // SAP GUI",
      badgeColor: "text-teal-800 dark:text-teal-300 bg-teal-50 dark:bg-teal-950/60 border-teal-200/50 dark:border-teal-800/50",
      cardBorder: "hover:border-teal-700/40 dark:hover:border-teal-400/40"
    },
    {
      id: 'diff-chunking',
      value: ">5k Lines",
      label: isIndonesian ? "Skala Diff-Chunking" : "Diff-Chunking Scale",
      detail: isIndonesian ? "Analisis AST LangGraph & audit PR otonom" : "Stateful LangGraph AST analysis & PR audit",
      systemTag: "Code Review Agent",
      subsystem: "Multi-Agent State Graph",
      protocol: "LANGGRAPH // GEMINI FLASH",
      badgeColor: "text-emerald-800 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 border-emerald-200/50 dark:border-emerald-800/50",
      cardBorder: "hover:border-emerald-700/40 dark:hover:border-emerald-400/40"
    },
    {
      id: 'cache-latency',
      value: "<50ms",
      label: isIndonesian ? "Latensi Cache Vektor" : "Vector Cache Latency",
      detail: isIndonesian ? "Retrieval hash Redis & gating kemiripan ChromaDB" : "Sub-50ms Redis hash retrieval & ChromaDB gating",
      systemTag: "RAG Document Chat",
      subsystem: "Vector Similarity & Cache",
      protocol: "REDIS HASH // CHROMADB",
      badgeColor: "text-teal-800 dark:text-teal-300 bg-teal-50 dark:bg-teal-950/60 border-teal-200/50 dark:border-teal-800/50",
      cardBorder: "hover:border-teal-700/40 dark:hover:border-teal-400/40"
    },
    {
      id: 'task-automation',
      value: "~70%",
      label: isIndonesian ? "Otomasi Tugas Repetitif" : "Tasks Automated",
      detail: isIndonesian ? "Memangkas hambatan operasional ~35% & mempercepat SLA 30%" : "Cut operational bottlenecks by ~35% & improved SLAs by 30%",
      systemTag: "Workflow & SAP RPA",
      subsystem: "Batch Job Automation",
      protocol: "APPS SCRIPT // SAP VBSCRIPT",
      badgeColor: "text-emerald-800 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 border-emerald-200/50 dark:border-emerald-800/50",
      cardBorder: "hover:border-emerald-700/40 dark:hover:border-emerald-400/40"
    }
  ];

  return (
    <section id="hero" className="min-h-[100svh] flex items-center justify-center relative overflow-hidden transition-colors duration-300 bg-slate-50 dark:bg-slate-950 py-24 md:py-28">
      {/* Background Video & Scrim */}
      <div className="absolute inset-0 z-0">
        <video
          ref={videoRef}
          loop
          muted
          playsInline
          preload="metadata"
          className="absolute inset-0 w-full h-full object-cover object-[85%_center] md:object-center opacity-30 dark:opacity-20"
        >
          <source src={isDarkMode ? HERO_VIDEOS.dark : HERO_VIDEOS.light} type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-slate-50/90 dark:bg-slate-950/95" />
        <BackgroundOverlay />
      </div>

      <div className="max-w-7xl mx-auto px-6 w-full relative z-10">
        <div className="grid lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Column: Headline, Credential Chips & CTAs (7 Cols) */}
          <div className="lg:col-span-7 space-y-6">

            {/* Greeting & Candidate Name (H1) */}
            <div>
              <p className="text-emerald-700 dark:text-emerald-400 font-mono text-base md:text-lg flex items-center gap-2 mb-2">
                <span className="w-8 h-px bg-emerald-700 dark:bg-emerald-400" aria-hidden="true" />
                <span>{t('hero.greeting') || "Hello, I'm"}</span>
              </p>
              
              <h1 className="text-4xl sm:text-6xl md:text-7xl font-bold text-slate-900 dark:text-slate-100 tracking-tight text-balance leading-none">
                <GlossyText>
                  <Typewriter text={PERSONAL_INFO.name} delay={150} startDelay={0} />
                </GlossyText>
              </h1>
            </div>

            {/* Verified Headline (H2) */}
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-semibold text-slate-800 dark:text-slate-200 tracking-tight text-balance flex items-center gap-3">
              <span>{t('hero.role') || PERSONAL_INFO.title}</span>
            </h2>

            {/* Credential Chip Bar with Uniform Bracketed Affordances */}
            <div className="flex flex-wrap gap-2 pt-1" role="list" aria-label="Professional and Academic Credentials">
              {credentialChips.map((chip) => {
                const IconComponent = chip.icon;
                return (
                  <div
                    key={chip.id}
                    role="listitem"
                    aria-label={chip.ariaLabel}
                    className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-hairline font-mono text-xs font-medium shadow-xs backdrop-blur-xs transition-all hover:-translate-y-0.5 ${chip.badgeClass}`}
                  >
                    <IconComponent size={13} className={`${chip.iconClass} shrink-0`} aria-hidden="true" />
                    <span className="font-bold tracking-tight opacity-95">{chip.prefix}</span>
                    <span>{chip.label}</span>
                  </div>
                );
              })}
            </div>

            {/* Professional Narrative / Tagline */}
            <p className="text-base md:text-lg text-slate-700 dark:text-slate-300 font-normal text-pretty leading-relaxed max-w-2xl">
              {t('hero.tagline') || PERSONAL_INFO.bio}
            </p>

            {/* Location & Availability Meta */}
            <div className="flex items-center gap-3 text-slate-600 dark:text-slate-400 font-mono text-xs">
              <span className="flex items-center gap-1.5">
                <MapPin size={14} className="text-emerald-700 dark:text-emerald-400 shrink-0" aria-hidden="true" />
                {PERSONAL_INFO.location}
              </span>
              <span className="text-slate-300 dark:text-slate-700">•</span>
              <span className="flex items-center gap-1.5 text-emerald-800 dark:text-emerald-400 font-medium">
                <CheckCircle2 size={13} aria-hidden="true" />
                {t('nav.status') || "Available for Enterprise Roles"}
              </span>
            </div>

            {/* Action Buttons & Social Links */}
            <div className="flex flex-wrap items-center gap-3 pt-3">
              <button
                type="button"
                onClick={() => scrollTo && scrollTo('projects')}
                className="bg-emerald-700 hover:bg-emerald-800 text-white dark:bg-emerald-500 dark:hover:bg-emerald-400 dark:text-slate-950 font-bold py-3 px-6 text-sm md:text-base rounded-xl transition-all shadow-sm hover:-translate-y-0.5 cursor-pointer flex items-center gap-2.5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-700 dark:focus-visible:outline-emerald-400"
              >
                <Layers size={18} aria-hidden="true" />
                <span>{t('hero.ctaProjects') || "Explore Architecture"}</span>
              </button>

              <button
                type="button"
                onClick={() => scrollTo && scrollTo('contact')}
                className="bg-white hover:bg-slate-100 dark:bg-slate-900 dark:hover:bg-slate-800 text-slate-900 dark:text-slate-100 border border-slate-300 dark:border-slate-700 font-semibold py-3 px-6 text-sm md:text-base rounded-xl transition-all shadow-xs hover:-translate-y-0.5 cursor-pointer flex items-center gap-2.5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-700 dark:focus-visible:outline-emerald-400"
              >
                <Mail size={18} className="text-emerald-700 dark:text-emerald-400" aria-hidden="true" />
                <span>{t('hero.ctaContact') || "Contact Directly"}</span>
              </button>

              <div className="flex items-center gap-2 pl-1">
                <a
                  href={PERSONAL_INFO.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Visit William's LinkedIn Profile"
                  className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 text-slate-700 dark:text-slate-300 hover:text-emerald-700 dark:hover:text-emerald-400 hover:border-emerald-700/50 dark:hover:border-emerald-400/50 transition-all shadow-xs hover:-translate-y-0.5 cursor-pointer"
                >
                  <LinkedinIcon size={18} />
                </a>

                <a
                  href={PERSONAL_INFO.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Visit William's GitHub Profile"
                  className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 text-slate-700 dark:text-slate-300 hover:text-emerald-700 dark:hover:text-emerald-400 hover:border-emerald-700/50 dark:hover:border-emerald-400/50 transition-all shadow-xs hover:-translate-y-0.5 cursor-pointer"
                >
                  <GithubIcon size={18} />
                </a>
              </div>
            </div>

          </div>

          {/* Right Column: Interactive Dev-Tool Telemetry Console */}
          <div className="lg:col-span-5 w-full">
            <div className="bg-white/80 dark:bg-surface-forest p-5 rounded-2xl border border-slate-200/80 dark:border-hairline shadow-md backdrop-blur-md space-y-4">
              
              {/* Console Header Bar */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-200/80 dark:border-emerald-950/60 pb-3 gap-1.5 sm:gap-2">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-700 dark:bg-emerald-400 animate-pulse shrink-0" aria-hidden="true" />
                  <span className="font-mono text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200">
                    ● TELEMETRY // ENTERPRISE MDM & AUTOMATION
                  </span>
                </div>
                <div className="flex items-center justify-between sm:justify-end gap-2 text-xs">
                  <span className="font-mono text-[10px] uppercase text-slate-600 dark:text-slate-400 font-semibold">
                    {isIndonesian ? "Dampak & Tolok Ukur Utama" : "Key Impact & Benchmarks"}
                  </span>
                  <span className="font-mono text-[10px] uppercase px-2 py-0.5 rounded border border-emerald-700/20 dark:border-emerald-400/20 bg-emerald-700/10 dark:bg-emerald-400/10 text-emerald-800 dark:text-emerald-300 font-bold shrink-0">
                    LIVE STATUS
                  </span>
                </div>
              </div>

              {/* Metric Cards (2x2 Grid) with Interactive Hover Inspection */}
              <div className="grid grid-cols-2 gap-3.5">
                {impactMetrics.map((metric) => {
                  const isHovered = hoveredMetric?.id === metric.id;
                  return (
                    <div
                      key={metric.id}
                      tabIndex={0}
                      onMouseEnter={() => setHoveredMetric(metric)}
                      onMouseLeave={() => setHoveredMetric(null)}
                      onFocus={() => setHoveredMetric(metric)}
                      onBlur={() => setHoveredMetric(null)}
                      className={`p-4 rounded-xl border border-slate-200/80 dark:border-slate-800/80 bg-white/90 dark:bg-surface-obsidian ${metric.cardBorder} transition-all duration-200 flex flex-col justify-between cursor-default focus-visible:outline-2 focus-visible:outline-emerald-700 dark:focus-visible:outline-emerald-400 ${
                        isHovered ? 'ring-1 ring-emerald-700/30 dark:ring-emerald-400/30 shadow-xs' : ''
                      }`}
                    >
                      <div>
                        <span className={`text-[10px] font-mono font-bold uppercase tracking-wider px-1.5 py-0.5 rounded border inline-block mb-1.5 ${metric.badgeColor}`}>
                          {metric.systemTag}
                        </span>
                        <div className="text-2xl sm:text-3xl font-mono font-bold text-slate-900 dark:text-slate-100 tabular-nums">
                          {metric.value}
                        </div>
                      </div>
                      
                      <div className="mt-2 pt-2 border-t border-slate-100 dark:border-slate-800/60">
                        <p className="text-xs font-semibold text-slate-800 dark:text-slate-200 leading-tight">
                          {metric.label}
                        </p>
                        <p className="text-[11px] text-slate-600 dark:text-slate-400 mt-0.5 leading-snug line-clamp-2">
                          {metric.detail}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Interactive Telemetry Inspection Footer */}
              <div className="pt-2 border-t border-slate-200/80 dark:border-emerald-950/60 flex items-center justify-between font-mono text-[11px] text-slate-600 dark:text-slate-400">
                <span className="flex items-center gap-1.5 truncate">
                  <span className="text-emerald-700 dark:text-emerald-400">▶</span>
                  <span className="truncate">
                    {hoveredMetric
                      ? `${hoveredMetric.systemTag}: ${hoveredMetric.subsystem}`
                      : (isIndonesian ? "Arahkan kursor untuk inspeksi subsistem" : "Hover metric for subsystem telemetry")}
                  </span>
                </span>
                <span className="font-semibold shrink-0 text-emerald-800 dark:text-emerald-400 text-[10px]">
                  {hoveredMetric ? hoveredMetric.protocol : 'VERIFIED // SLA 30%'}
                </span>
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
