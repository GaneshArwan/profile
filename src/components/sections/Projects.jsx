import React, { useState, useMemo, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import {
  ExternalLink,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Maximize2,
  X,
  GitBranch,
  Film,
  AlertCircle,
  Layers,
  ShieldCheck,
  TrendingUp,
  ArrowRight,
} from 'lucide-react';
import { GithubIcon } from '../icons';
import { SectionHeader } from '../ui/SectionHeader';
import { GlossyText } from '../ui/GlossyText';
import { BackgroundOverlay } from '../ui/BackgroundOverlay';
import { MermaidViewer } from '../ui/MermaidViewer';
import { useBackgroundImage } from '../../hooks/useBackgroundImage';
import { useOptimizedVideo } from '../../hooks/useOptimizedVideo';
import { PROJECTS, LOCAL_BACKGROUNDS, REMOTE_BACKGROUNDS } from '../../data/constants';
import { useI18n } from '../../lib/i18n';

export const Projects = ({ scrollTo }) => {
  const [activeCategory, setActiveCategory] = useState('all');
  const [spotlightId, setSpotlightId] = useState(PROJECTS[0]?.id || 'rag-document-chat');
  const [spotlightTab, setSpotlightTab] = useState('media'); // 'media' | 'architecture'
  const [spotlightMediaIdx, setSpotlightMediaIdx] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);

  const { t, isIndonesian } = useI18n();
  const bgImage = useBackgroundImage(LOCAL_BACKGROUNDS.projects, REMOTE_BACKGROUNDS.projects);

  const filterTabs = useMemo(() => [
    { id: 'all', label: t('projects.filterAll') || 'All Projects' },
    { id: 'ai', label: t('projects.filterAI') || 'AI & Autonomous Systems' },
    { id: 'data', label: t('projects.filterData') || 'Data & Analytics' },
    { id: 'automation', label: t('projects.filterAutomation') || 'Enterprise Automation' },
  ], [t]);

  const categoryCounts = useMemo(() => {
    const counts = { all: PROJECTS.length, ai: 0, data: 0, automation: 0 };
    PROJECTS.forEach((proj) => {
      if (counts[proj.category] !== undefined) {
        counts[proj.category] += 1;
      }
    });
    return counts;
  }, []);

  const filteredProjects = useMemo(() => {
    if (activeCategory === 'all') return PROJECTS;
    return PROJECTS.filter((proj) => proj.category === activeCategory);
  }, [activeCategory]);

  // Active spotlight project (calibrated to current category)
  const currentSpotlight = useMemo(() => {
    return filteredProjects.find((p) => p.id === spotlightId) || filteredProjects[0] || PROJECTS[0];
  }, [filteredProjects, spotlightId]);

  const spotlightMedia = useMemo(() => {
    if (Array.isArray(currentSpotlight?.media) && currentSpotlight.media.length > 0) {
      return currentSpotlight.media;
    }
    if (currentSpotlight?.image) {
      return [{ type: 'image', src: currentSpotlight.image, caption: currentSpotlight.title }];
    }
    return [];
  }, [currentSpotlight]);

  const safeMediaIdx = spotlightMedia.length > 0 ? spotlightMediaIdx % spotlightMedia.length : 0;
  const currentMediaItem = spotlightMedia[safeMediaIdx] || null;

  const { videoRef: spotlightVideoRef } = useOptimizedVideo({
    threshold: 0.25,
    enabled: spotlightTab === 'media' && currentMediaItem?.type === 'video' && !isLightboxOpen,
  });

  // Lightbox keyboard navigation
  useEffect(() => {
    if (!isLightboxOpen) return;
    const onKeyDown = (e) => {
      if (e.key === 'Escape') {
        setIsLightboxOpen(false);
      } else if (e.key === 'ArrowLeft' && spotlightMedia.length > 1) {
        setSpotlightMediaIdx((prev) => (prev - 1 + spotlightMedia.length) % spotlightMedia.length);
      } else if (e.key === 'ArrowRight' && spotlightMedia.length > 1) {
        setSpotlightMediaIdx((prev) => (prev + 1) % spotlightMedia.length);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [isLightboxOpen, spotlightMedia.length]);

  const categoryConfig = {
    ai: {
      badge: 'bg-emerald-50 text-emerald-800 border-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-800/60',
      heroBorder: 'border-emerald-700/40 dark:border-emerald-500/50 bg-gradient-to-b from-emerald-500/[0.04] to-transparent dark:from-emerald-500/[0.06] ring-1 ring-emerald-500/15',
      accent: 'text-emerald-800 dark:text-emerald-300',
      techBadge: 'text-emerald-800 dark:text-emerald-300 bg-emerald-500/10 border-emerald-500/20'
    },
    data: {
      badge: 'bg-teal-50 text-teal-800 border-teal-200 dark:bg-teal-950/60 dark:text-teal-300 dark:border-teal-800/60',
      heroBorder: 'border-teal-700/40 dark:border-teal-500/50 bg-gradient-to-b from-teal-500/[0.04] to-transparent dark:from-teal-500/[0.06] ring-1 ring-teal-500/15',
      accent: 'text-teal-800 dark:text-teal-300',
      techBadge: 'text-teal-800 dark:text-teal-300 bg-teal-500/10 border-teal-500/20'
    },
    automation: {
      badge: 'bg-emerald-50 text-emerald-800 border-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-800/60',
      heroBorder: 'border-emerald-700/40 dark:border-emerald-500/50 bg-gradient-to-b from-emerald-500/[0.04] to-transparent dark:from-emerald-500/[0.06] ring-1 ring-emerald-500/15',
      accent: 'text-emerald-800 dark:text-emerald-300',
      techBadge: 'text-emerald-800 dark:text-emerald-300 bg-emerald-500/10 border-emerald-500/20'
    }
  };

  const theme = categoryConfig[currentSpotlight?.category] || categoryConfig.ai;
  const repoHref = currentSpotlight?.repoUrl || currentSpotlight?.link;
  const liveHref = currentSpotlight?.liveUrl || currentSpotlight?.liveLink;
  const spotlightIndex = filteredProjects.findIndex((p) => p.id === currentSpotlight?.id);

  const selectorContainerRef = useRef(null);

  const handlePrevSpotlight = () => {
    const prevIndex = (spotlightIndex - 1 + filteredProjects.length) % filteredProjects.length;
    setSpotlightId(filteredProjects[prevIndex].id);
    setSpotlightMediaIdx(0);
  };

  const handleNextSpotlight = () => {
    const nextIndex = (spotlightIndex + 1) % filteredProjects.length;
    setSpotlightId(filteredProjects[nextIndex].id);
    setSpotlightMediaIdx(0);
  };

  const handleSelectorKeyDown = (e) => {
    if (e.key === 'ArrowDown' || e.key === 'ArrowRight') {
      e.preventDefault();
      handleNextSpotlight();
    } else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
      e.preventDefault();
      handlePrevSpotlight();
    }
  };

  // Auto-center active project in selector rail
  useEffect(() => {
    const container = selectorContainerRef.current;
    if (!container) return;

    const activeElement = container.querySelector(`[data-project-id="${spotlightId}"]`);
    if (!activeElement) return;

    const isDesktop = typeof window !== 'undefined' && window.innerWidth >= 1024;
    if (isDesktop) {
      const targetTop = activeElement.offsetTop - (container.clientHeight / 2) + (activeElement.offsetHeight / 2);
      if (typeof container.scrollTo === 'function') {
        container.scrollTo({ top: Math.max(0, targetTop), behavior: 'smooth' });
      }
    } else {
      const targetLeft = activeElement.offsetLeft - (container.clientWidth / 2) + (activeElement.offsetWidth / 2);
      if (typeof container.scrollTo === 'function') {
        container.scrollTo({ left: Math.max(0, targetLeft), behavior: 'smooth' });
      }
    }
  }, [spotlightId]);

  return (
    <section id="projects" className="py-20 pt-28 relative transition-colors duration-300 scroll-mt-24 bg-slate-50 dark:bg-slate-950">
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-15 dark:opacity-10"
          style={{ backgroundImage: `url(${bgImage})` }}
        />
        <div className="absolute inset-0 bg-slate-50/95 dark:bg-slate-950/95" />
        <BackgroundOverlay />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <SectionHeader 
          title={<GlossyText>{t('projects.title') || 'Featured Engineering Projects'}</GlossyText>} 
          subtitle={t('projects.subtitle') || 'Production-grade autonomous AI systems, vector retrieval pipelines, and enterprise automation.'} 
        />

        {/* Category Filter Tabs */}
        <div 
          role="tablist" 
          aria-label="Project Category Filter" 
          className="flex flex-wrap items-center gap-2 mb-10 p-1.5 rounded-2xl bg-slate-200/70 dark:bg-slate-900/80 border border-slate-300/90 dark:border-slate-800 backdrop-blur-sm w-fit"
        >
          {filterTabs.map((tab) => {
            const isSelected = activeCategory === tab.id;
            const count = categoryCounts[tab.id] || 0;
            return (
              <button
                key={tab.id}
                type="button"
                role="tab"
                aria-selected={isSelected}
                onClick={() => {
                  setActiveCategory(tab.id);
                  setSpotlightMediaIdx(0);
                }}
                className={`flex items-center gap-2 px-4 py-2 min-h-[44px] rounded-xl text-sm font-semibold border transition-all duration-200 cursor-pointer active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-700 dark:focus-visible:outline-emerald-400 ${
                  isSelected
                    ? 'bg-emerald-700 text-white dark:bg-emerald-500 dark:text-slate-950 border-emerald-800/30 dark:border-emerald-400/50 shadow-sm'
                    : 'bg-white/75 dark:bg-slate-950/60 border-slate-300/80 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:text-emerald-800 dark:hover:text-emerald-300 hover:border-emerald-600/40 dark:hover:border-emerald-400/40 hover:bg-white dark:hover:bg-slate-800'
                }`}
              >
                <span>{tab.label}</span>
                <span className={`text-xs px-2 py-0.5 rounded-full font-mono ${
                  isSelected 
                    ? 'bg-white/20 dark:bg-slate-950/20 text-white dark:text-slate-950 font-bold' 
                    : 'bg-slate-200/90 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                }`}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* ========================================================================= */}
        {/* Project Explorer Showcase with Side-Aligned Selector                      */}
        {/* ========================================================================= */}
        {currentSpotlight && (
          <div className="block mb-16">
            <div className="flex flex-col lg:flex-row gap-6 lg:gap-8 items-start">
              {/* Side-Aligned Project Selector Rail */}
              <aside 
                className="w-full lg:w-80 xl:w-88 shrink-0 lg:sticky lg:top-28 z-10 flex flex-col gap-3"
                aria-label="Project Explorer Selector"
              >
                {/* Explorer Header & Prev/Next Controls */}
                <div className="flex items-center justify-between gap-3 p-3.5 rounded-2xl bg-white/90 dark:bg-slate-900/90 border border-slate-200/90 dark:border-slate-800 shadow-sm backdrop-blur-md">
                  <div className="min-w-0 pl-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-slate-100 truncate">
                        {isIndonesian ? "Daftar Proyek" : "Project Explorer"}
                      </span>
                      <span className="font-mono text-[11px] px-2 py-0.5 rounded-full bg-emerald-700/10 dark:bg-emerald-400/10 text-emerald-800 dark:text-emerald-300 font-semibold border border-emerald-700/20 dark:border-emerald-400/20 shrink-0">
                        {spotlightIndex + 1} / {filteredProjects.length}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-600 dark:text-slate-400 truncate mt-0.5">
                      {isIndonesian ? "Klik proyek untuk melihat detail & demo" : "Click any project below to inspect"}
                    </p>
                  </div>

                  {/* Looping Prev / Next Controls */}
                  <div className="flex items-center gap-1.5 shrink-0">
                    <button
                      type="button"
                      onClick={handlePrevSpotlight}
                      aria-label={isIndonesian ? "Proyek sebelumnya" : "Previous project"}
                      className="p-2 min-w-[38px] min-h-[38px] flex items-center justify-center rounded-xl bg-slate-100 hover:bg-emerald-50 dark:bg-slate-800 dark:hover:bg-emerald-950/60 text-slate-700 hover:text-emerald-800 dark:text-slate-200 dark:hover:text-emerald-300 border border-slate-300/80 dark:border-slate-700 hover:border-emerald-600/40 dark:hover:border-emerald-400/40 transition-all cursor-pointer active:scale-95"
                    >
                      <ChevronLeft size={16} aria-hidden="true" />
                    </button>
                    <button
                      type="button"
                      onClick={handleNextSpotlight}
                      aria-label={isIndonesian ? "Proyek berikutnya" : "Next project"}
                      className="p-2 min-w-[38px] min-h-[38px] flex items-center justify-center rounded-xl bg-slate-100 hover:bg-emerald-50 dark:bg-slate-800 dark:hover:bg-emerald-950/60 text-slate-700 hover:text-emerald-800 dark:text-slate-200 dark:hover:text-emerald-300 border border-slate-300/80 dark:border-slate-700 hover:border-emerald-600/40 dark:hover:border-emerald-400/40 transition-all cursor-pointer active:scale-95"
                    >
                      <ChevronRight size={16} aria-hidden="true" />
                    </button>
                  </div>
                </div>

                {/* Project Selector Scroll Container */}
                <div 
                  ref={selectorContainerRef}
                  role="group" 
                  aria-label="Project Explorer List"
                  tabIndex={0}
                  onKeyDown={handleSelectorKeyDown}
                  className="flex flex-row lg:flex-col gap-3 overflow-x-auto lg:overflow-y-auto max-h-none lg:max-h-[calc(100vh-14rem)] py-1 px-0.5 scroll-smooth outline-none focus-visible:ring-2 focus-visible:ring-emerald-700 dark:focus-visible:ring-emerald-400 rounded-2xl custom-scrollbar"
                >
                  {filteredProjects.map((proj, idx) => {
                    const isSelected = proj.id === currentSpotlight.id;
                    const projRepo = proj.repoUrl || proj.link;
                    const projLive = proj.liveUrl || proj.liveLink;
                    const topics = Array.isArray(proj.githubStats?.topics)
                      ? proj.githubStats.topics
                      : (Array.isArray(proj.topics) ? proj.topics : []);

                    return (
                      <article
                        key={proj.id}
                        id={`project-container-${proj.id}`}
                        data-project-id={proj.id}
                        role="button"
                        tabIndex={0}
                        aria-pressed={isSelected}
                        aria-label={proj.title}
                        onClick={() => {
                          setSpotlightId(proj.id);
                          setSpotlightMediaIdx(0);
                        }}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' || e.key === ' ') {
                            e.preventDefault();
                            setSpotlightId(proj.id);
                            setSpotlightMediaIdx(0);
                          }
                        }}
                        className={`group/projcard w-72 sm:w-80 lg:w-full shrink-0 text-left p-4 rounded-2xl border transition-all duration-200 cursor-pointer backdrop-blur-md select-none ${
                          isSelected
                            ? 'bg-emerald-50/95 dark:bg-emerald-950/55 border-emerald-600 dark:border-emerald-500 ring-1 ring-emerald-500/30 shadow-md'
                            : 'bg-white/85 dark:bg-slate-900/85 border-slate-200/90 dark:border-slate-800 hover:border-emerald-600/50 dark:hover:border-emerald-400/50 hover:bg-white dark:hover:bg-slate-900 hover:-translate-y-0.5 shadow-sm hover:shadow-md'
                        }`}
                      >
                        {/* Card Header: Index & Metric Summary */}
                        <div className="flex items-center justify-between gap-2 mb-1.5">
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-xs font-bold text-emerald-800 dark:text-emerald-400">
                              #{String(idx + 1).padStart(2, '0')}
                            </span>
                            {isSelected && (
                              <span className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-700 text-white dark:bg-emerald-500 dark:text-slate-950">
                                {isIndonesian ? "Terpilih" : "Active"}
                              </span>
                            )}
                          </div>
                          <span className="text-[11px] font-mono font-medium text-slate-700 dark:text-slate-300 tabular-nums">
                            {proj.technicalMetric || proj.technicalBadge || 'Verified'}
                          </span>
                        </div>

                        {/* Untruncated Title */}
                        <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100 leading-snug break-words mb-1.5 group-hover/projcard:text-emerald-800 dark:group-hover/projcard:text-emerald-300 transition-colors">
                          {proj.title}
                        </h4>

                        {/* Concise preview summary on unselected selector cards */}
                        {!isSelected && (
                          <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2 mb-3 leading-relaxed">
                            {proj.description}
                          </p>
                        )}

                        {/* Clear interactive card prompt when unselected */}
                        {!isSelected && (
                          <div className="flex items-center justify-between pt-2 border-t border-slate-200/70 dark:border-slate-800/70 text-xs font-semibold text-slate-600 dark:text-slate-400 group-hover/projcard:text-emerald-800 dark:group-hover/projcard:text-emerald-300 transition-colors">
                            <span>{isIndonesian ? "Klik untuk melihat proyek" : "Click to inspect project"}</span>
                            <ChevronRight size={14} className="transition-transform group-hover/projcard:translate-x-0.5" aria-hidden="true" />
                          </div>
                        )}

                        {/* Static Metadata Tags (rendered visibly on active card; screen-reader preserved otherwise) */}
                        <div className={isSelected ? 'flex flex-wrap items-center gap-1 mb-2.5' : 'sr-only'}>
                          {Array.isArray(proj.tech) && proj.tech.map((tItem, i) => (
                            <span
                              key={i}
                              className="text-[10px] font-mono font-medium px-2 py-0.5 rounded-md bg-white/90 dark:bg-slate-900/90 text-slate-700 dark:text-slate-300 border border-slate-200/90 dark:border-slate-700/80 cursor-default"
                            >
                              {tItem}
                            </span>
                          ))}
                          {topics.map((topic, i) => (
                            <span
                              key={i}
                              className="sr-only"
                            >
                              #{topic}
                            </span>
                          ))}
                        </div>

                        {/* 2x2 Indicators Grid (expanded on active card; screen-reader preserved on inactive cards) */}
                        {Array.isArray(proj.technicalIndicators) && proj.technicalIndicators.length > 0 && (
                          <div className={isSelected ? 'grid grid-cols-2 gap-1.5 mb-2.5 cursor-default' : 'sr-only grid grid-cols-2'}>
                            {proj.technicalIndicators.map((ind, i) => (
                              <div 
                                key={i} 
                                className="p-1.5 rounded-lg border border-slate-200/80 dark:border-slate-800/80 bg-white/80 dark:bg-slate-950/50 flex flex-col justify-between"
                              >
                                <span className="text-[9px] font-mono uppercase tracking-wider text-slate-500 dark:text-slate-400 truncate">
                                  {ind.label}
                                </span>
                                <span className="text-[11px] font-bold text-slate-900 dark:text-slate-100 truncate mt-0.5">
                                  {ind.value}
                                </span>
                              </div>
                            ))}
                          </div>
                        )}

                        {/* Semantic highlights for screen readers & test contracts */}
                        {Array.isArray(proj.highlights) && proj.highlights.length > 0 && (
                          <ul className="sr-only">
                            {proj.highlights.map((h, i) => (
                              <li key={i}>{h}</li>
                            ))}
                          </ul>
                        )}

                        {/* External Links (shown cleanly on active card; preserved in sr-only on inactive cards) */}
                        <div className={isSelected ? 'flex items-center gap-2 pt-2 border-t border-emerald-600/20 dark:border-emerald-500/20' : 'sr-only'}>
                          {projRepo && (
                            <a
                              href={projRepo}
                              target="_blank"
                              rel="noopener noreferrer"
                              onClick={(e) => e.stopPropagation()}
                              className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-800 dark:text-slate-100 bg-white hover:bg-slate-100 dark:bg-slate-800 dark:hover:bg-slate-700 px-3 py-1.5 min-h-[44px] rounded-lg border border-slate-300 dark:border-slate-700 transition-colors shadow-sm cursor-pointer"
                            >
                              <GithubIcon size={13} aria-hidden="true" />
                              <span>View Repo</span>
                            </a>
                          )}
                          {projLive && (
                            <a
                              href={projLive}
                              target="_blank"
                              rel="noopener noreferrer"
                              onClick={(e) => e.stopPropagation()}
                              className="inline-flex items-center gap-1.5 text-xs font-semibold text-white bg-emerald-700 hover:bg-emerald-800 dark:bg-emerald-500 dark:text-slate-950 dark:hover:bg-emerald-400 px-3 py-1.5 min-h-[44px] rounded-lg border border-emerald-800/30 dark:border-emerald-400/50 transition-colors shadow-sm cursor-pointer"
                            >
                              <ExternalLink size={13} aria-hidden="true" />
                              <span>View Live</span>
                            </a>
                          )}
                        </div>
                      </article>
                    );
                  })}
                </div>
              </aside>

              {/* Main Project Detail View */}
              <div className="flex-1 min-w-0 w-full">
                <div className={`rounded-3xl border ${theme.heroBorder} bg-white/95 dark:bg-slate-900/95 shadow-xl p-6 sm:p-8 backdrop-blur-md transition-all duration-300`}>
              {/* Two-Column Project Breakdown */}
              <div className="flex flex-col xl:flex-row gap-8 items-start">
                
                {/* Column 1: Visual Preview & Architecture Diagram */}
                <div className="flex-1 w-full xl:w-1/2 flex flex-col gap-6">
                  <div>
                    <h3 className="text-2xl md:text-3xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight mb-3">
                      {currentSpotlight.title}
                    </h3>
                    <p className="text-slate-600 dark:text-slate-300 text-sm md:text-base leading-relaxed font-normal">
                      {currentSpotlight.description}
                    </p>
                  </div>

                  {/* Preview Window */}
                  <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/70 overflow-hidden shadow-inner">
                    {/* View Mode Toolbar */}
                    <div className="flex items-center justify-between gap-2 px-4 py-2.5 border-b border-slate-200 dark:border-slate-800 bg-slate-100/80 dark:bg-slate-900/90">
                      <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400">
                        {isIndonesian ? "Mode Tampilan" : "View Mode"}
                      </span>

                      {/* Mode Switcher */}
                      <div className="inline-flex items-center gap-1 rounded-xl bg-slate-200/80 dark:bg-slate-800 p-1" role="group" aria-label="Featured Media Mode">
                        <button
                          type="button"
                          aria-pressed={spotlightTab === 'media'}
                          onClick={() => setSpotlightTab('media')}
                          className={`inline-flex items-center gap-1.5 px-3 py-1.5 min-h-[38px] text-xs font-semibold rounded-lg border transition-all cursor-pointer active:scale-[0.98] ${
                            spotlightTab === 'media'
                              ? 'bg-emerald-700 text-white dark:bg-emerald-500 dark:text-slate-950 border-emerald-800/30 dark:border-emerald-400/40 shadow-sm'
                              : 'bg-white/75 dark:bg-slate-900/75 text-slate-700 dark:text-slate-200 border-slate-300/70 dark:border-slate-700 hover:bg-white dark:hover:bg-slate-800 hover:text-emerald-800 dark:hover:text-emerald-300'
                          }`}
                        >
                          <Film size={13} aria-hidden="true" />
                          <span>{isIndonesian ? "Demo & Preview" : "Demo & Preview"}</span>
                        </button>
                        <button
                          type="button"
                          aria-pressed={spotlightTab === 'architecture'}
                          onClick={() => setSpotlightTab('architecture')}
                          className={`inline-flex items-center gap-1.5 px-3 py-1.5 min-h-[38px] text-xs font-semibold rounded-lg border transition-all cursor-pointer active:scale-[0.98] ${
                            spotlightTab === 'architecture'
                              ? 'bg-emerald-700 text-white dark:bg-emerald-500 dark:text-slate-950 border-emerald-800/30 dark:border-emerald-400/40 shadow-sm'
                              : 'bg-white/75 dark:bg-slate-900/75 text-slate-700 dark:text-slate-200 border-slate-300/70 dark:border-slate-700 hover:bg-white dark:hover:bg-slate-800 hover:text-emerald-800 dark:hover:text-emerald-300'
                          }`}
                        >
                          <GitBranch size={13} aria-hidden="true" />
                          <span>{isIndonesian ? "Diagram Alur" : "Architecture Flow"}</span>
                        </button>
                      </div>
                    </div>

                    {/* Media Display Stage */}
                    {spotlightTab === 'media' && currentMediaItem ? (
                      <div>
                        <div className="relative aspect-[16/10] bg-slate-900 overflow-hidden group/featuredmedia">
                          {currentMediaItem.type === 'video' ? (
                            <video
                              ref={spotlightVideoRef}
                              key={currentMediaItem.src}
                              src={currentMediaItem.src}
                              poster={currentMediaItem.poster}
                              loop
                              muted
                              playsInline
                              preload="none"
                              aria-label={currentMediaItem.caption || currentSpotlight.title}
                              className="w-full h-full object-cover object-top"
                            />
                          ) : (
                            <img
                              src={currentMediaItem.src}
                              alt={currentMediaItem.caption || currentSpotlight.title}
                              loading="lazy"
                              className="w-full h-full object-cover object-top"
                            />
                          )}

                          {currentMediaItem.type === 'video' && (
                            <span className="absolute top-3 left-3 inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-slate-950/85 text-emerald-300 text-xs font-mono font-semibold border border-emerald-500/30">
                              <Film size={13} aria-hidden="true" />
                              <span>{isIndonesian ? "REKAMAN DEMO LANGSUNG" : "LIVE WALKTHROUGH CAPTURE"}</span>
                            </span>
                          )}

                          <button
                            type="button"
                            onClick={() => setIsLightboxOpen(true)}
                            aria-label={`${t('projects.expandPreview') || 'Expand Preview'}: ${currentSpotlight.title}`}
                            className="absolute top-3 right-3 inline-flex items-center gap-1.5 px-3 py-1.5 min-h-[36px] rounded-lg bg-slate-950/80 hover:bg-slate-950 text-white text-xs font-mono font-medium border border-slate-700 transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-400"
                          >
                            <Maximize2 size={13} aria-hidden="true" />
                            <span>{t('projects.expandPreview') || 'Expand Preview'}</span>
                          </button>

                          {spotlightMedia.length > 1 && (
                            <>
                              <button
                                type="button"
                                onClick={() => setSpotlightMediaIdx((prev) => (prev - 1 + spotlightMedia.length) % spotlightMedia.length)}
                                aria-label="Previous slide"
                                className="absolute left-3 top-1/2 -translate-y-1/2 inline-flex items-center justify-center w-10 h-10 rounded-full bg-slate-950/75 hover:bg-slate-950 text-white border border-slate-700 transition-colors cursor-pointer"
                              >
                                <ChevronLeft size={18} aria-hidden="true" />
                              </button>
                              <button
                                type="button"
                                onClick={() => setSpotlightMediaIdx((prev) => (prev + 1) % spotlightMedia.length)}
                                aria-label="Next slide"
                                className="absolute right-3 top-1/2 -translate-y-1/2 inline-flex items-center justify-center w-10 h-10 rounded-full bg-slate-950/75 hover:bg-slate-950 text-white border border-slate-700 transition-colors cursor-pointer"
                              >
                                <ChevronRight size={18} aria-hidden="true" />
                              </button>
                            </>
                          )}
                        </div>

                        {/* Caption & Thumbnail Switcher */}
                        <div className="flex items-center justify-between gap-3 px-4 py-2.5 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60">
                          <p className="text-xs font-mono text-slate-700 dark:text-slate-300 truncate">
                            {currentMediaItem.caption || currentSpotlight.title}
                          </p>
                          {spotlightMedia.length > 1 && (
                            <div className="flex items-center gap-1.5 shrink-0">
                              {spotlightMedia.map((item, idx) => (
                                <button
                                  key={item.src}
                                  type="button"
                                  onClick={() => setSpotlightMediaIdx(idx)}
                                  aria-label={`Preview slide ${idx + 1} of ${spotlightMedia.length}`}
                                  aria-current={idx === safeMediaIdx ? 'true' : undefined}
                                  className={`h-2.5 rounded-full transition-all cursor-pointer ${
                                    idx === safeMediaIdx
                                      ? 'w-6 bg-emerald-700 dark:bg-emerald-400'
                                      : 'w-2.5 bg-slate-300 dark:bg-slate-700 hover:bg-slate-400 dark:hover:bg-slate-600'
                                  }`}
                                />
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    ) : (
                      <div className="p-4 bg-white dark:bg-slate-900/60">
                        {currentSpotlight.workflowMermaid && (
                          <MermaidViewer 
                            chart={currentSpotlight.workflowMermaid} 
                            id={`spotlight-diagram-${currentSpotlight.id}`} 
                            title={currentSpotlight.title} 
                          />
                        )}
                      </div>
                    )}
                  </div>

                  {/* Technical Indicators Matrix */}
                  {Array.isArray(currentSpotlight.technicalIndicators) && currentSpotlight.technicalIndicators.length > 0 && (
                    <div className="flex flex-wrap gap-2.5 cursor-default">
                      {currentSpotlight.technicalIndicators.map((ind, idx) => (
                        <div 
                          key={idx} 
                          className="flex-1 min-w-[130px] p-3 rounded-xl border border-slate-200/90 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/60 flex flex-col justify-between"
                        >
                          <div className="text-[10px] font-mono uppercase tracking-wider text-slate-500 dark:text-slate-400">
                            {ind.label}
                          </div>
                          <div className="text-xs font-bold text-slate-900 dark:text-slate-100 truncate mt-1">
                            {ind.value}
                          </div>
                          {ind.detail && (
                            <span className="text-[11px] text-slate-700 dark:text-slate-300 truncate mt-0.5 block">
                              {ind.detail}
                            </span>
                          )}
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Static Tech Stack Labels & Primary External Links */}
                  <div className="space-y-4 pt-2">
                    <div className="space-y-1.5">
                      <span className="block text-[10px] font-mono font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                        {isIndonesian ? "Teknologi yang Digunakan" : "Built With"}
                      </span>
                      <div className="flex flex-wrap gap-1.5 cursor-default select-none">
                        {currentSpotlight.tech.map((tItem, i) => (
                          <span
                            key={i}
                            className="text-xs font-mono font-medium px-2.5 py-1 rounded-md bg-slate-100 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 border border-slate-200/80 dark:border-slate-700/80"
                          >
                            {tItem}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-3 pt-3 border-t border-slate-200/80 dark:border-slate-800/80">
                      {repoHref && (
                        <a
                          href={repoHref}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center justify-center gap-2 text-sm font-semibold text-slate-800 dark:text-slate-100 bg-white hover:bg-slate-100 dark:bg-slate-800 dark:hover:bg-slate-700 px-5 py-2.5 min-h-[44px] rounded-xl border border-slate-300 dark:border-slate-600 transition-all shadow-sm hover:shadow active:scale-[0.98] cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-700 dark:focus-visible:outline-emerald-400"
                        >
                          <GithubIcon size={16} aria-hidden="true" />
                          <span>{isIndonesian ? "Kode Sumber (GitHub)" : "Source Code (GitHub)"}</span>
                        </a>
                      )}

                      {liveHref && (
                        <a
                          href={liveHref}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center justify-center gap-2 text-sm font-semibold text-white bg-emerald-700 hover:bg-emerald-800 dark:bg-emerald-500 dark:text-slate-950 dark:hover:bg-emerald-400 dark:font-bold px-5 py-2.5 min-h-[44px] rounded-xl transition-all shadow-sm hover:shadow active:scale-[0.98] cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-700 dark:focus-visible:outline-emerald-400"
                        >
                          <span>{isIndonesian ? "Demo Langsung" : "Live Production Demo"}</span>
                          <ExternalLink size={15} aria-hidden="true" />
                        </a>
                      )}
                    </div>
                  </div>
                </div>

                {/* Column 2: 4-Part Project Engineering Breakdown */}
                <div className="flex-1 w-full xl:w-1/2 flex flex-col gap-4">
                  {/* Panel 1: Problem & Operational Challenge */}
                  <div className="p-4 rounded-2xl bg-amber-500/[0.04] dark:bg-amber-500/[0.06] border border-amber-500/20 flex flex-col gap-2">
                    <div className="flex items-center gap-2 text-amber-800 dark:text-amber-400 font-mono text-xs font-bold uppercase tracking-wider">
                      <AlertCircle size={15} aria-hidden="true" />
                      <span>[01 CHALLENGE] {isIndonesian ? "Tantangan & Masalah Operasional" : "Problem & Operational Challenge"}</span>
                    </div>
                    <p className="text-slate-700 dark:text-slate-300 text-xs md:text-sm leading-relaxed">
                      {currentSpotlight.caseStudy?.problem || currentSpotlight.description}
                    </p>
                  </div>

                  {/* Panel 2: System Architecture & Design */}
                  <div className="p-4 rounded-2xl bg-teal-500/[0.04] dark:bg-teal-500/[0.06] border border-teal-500/20 flex flex-col gap-2">
                    <div className="flex items-center gap-2 text-teal-800 dark:text-teal-300 font-mono text-xs font-bold uppercase tracking-wider">
                      <Layers size={15} aria-hidden="true" />
                      <span>[02 ARCHITECTURE] {isIndonesian ? "Arsitektur & Desain Sistem" : "System Architecture & Design"}</span>
                    </div>
                    <p className="text-slate-700 dark:text-slate-300 text-xs md:text-sm leading-relaxed">
                      {currentSpotlight.caseStudy?.architecture || currentSpotlight.highlights?.[0]}
                    </p>
                  </div>

                  {/* Panel 3: Key Engineering Decisions & Guardrails */}
                  <div className="p-4 rounded-2xl bg-emerald-500/[0.04] dark:bg-emerald-500/[0.06] border border-emerald-500/20 flex flex-col gap-2">
                    <div className="flex items-center gap-2 text-emerald-800 dark:text-emerald-300 font-mono text-xs font-bold uppercase tracking-wider">
                      <ShieldCheck size={15} aria-hidden="true" />
                      <span>[03 DECISIONS] {isIndonesian ? "Keputusan Rekayasa & Guardrail" : "Key Engineering Decisions & Guardrails"}</span>
                    </div>
                    <ul className="space-y-2 mt-1">
                      {(currentSpotlight.caseStudy?.keyDecisions || currentSpotlight.highlights?.slice(0, 3) || []).map((dec, i) => (
                        <li key={i} className="flex items-start gap-2 text-xs md:text-sm text-slate-700 dark:text-slate-300">
                          <CheckCircle2 size={14} className="text-emerald-700 dark:text-emerald-400 shrink-0 mt-0.5" aria-hidden="true" />
                          <span className="leading-snug">{dec}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Panel 4: Quantified Outcomes & Measured Impact */}
                  <div className="p-4 rounded-2xl bg-emerald-700/[0.04] dark:bg-emerald-400/[0.06] border border-emerald-700/20 dark:border-emerald-400/20 flex flex-col gap-2">
                    <div className="flex items-center gap-2 text-emerald-800 dark:text-emerald-300 font-mono text-xs font-bold uppercase tracking-wider">
                      <TrendingUp size={15} aria-hidden="true" />
                      <span>[04 OUTCOMES] {isIndonesian ? "Hasil Terukur & Dampak Operasional" : "Quantified Outcomes & Measured Impact"}</span>
                    </div>
                    <ul className="space-y-2 mt-1">
                      {(currentSpotlight.caseStudy?.outcomes || currentSpotlight.highlights?.slice(1, 4) || []).map((outc, i) => (
                        <li key={i} className="flex items-start gap-2 text-xs md:text-sm text-slate-700 dark:text-slate-300">
                          <CheckCircle2 size={14} className="text-emerald-700 dark:text-emerald-400 shrink-0 mt-0.5" aria-hidden="true" />
                          <span className="leading-snug font-medium">{outc}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

              </div>
            </div>
          </div>
        </div>
      </div>
    )}

        {/* Mid-Funnel Conversion Bridge */}
        <div className="mt-4 rounded-2xl border border-emerald-700/25 dark:border-emerald-400/25 bg-gradient-to-r from-emerald-50/90 via-white/95 to-teal-50/90 dark:from-emerald-950/50 dark:via-slate-900/95 dark:to-slate-900/95 p-5 sm:p-6 shadow-md backdrop-blur-md flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <span className="block text-[11px] font-mono font-bold uppercase tracking-wider text-emerald-800 dark:text-emerald-300">
              {isIndonesian ? "Ketersediaan Peran & Proyek" : "Role & Architecture Inquiry"}
            </span>
            <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-slate-100">
              {isIndonesian
                ? "Butuh arsitektur data, otomasi SAP RPA, atau workflow AI terapan serupa untuk tim Anda?"
                : "Looking to scale data pipelines, SAP automation, or applied AI workflows on your team?"}
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300">
              {isIndonesian
                ? "Terbuka untuk peran penuh waktu Data Analyst, Automation Specialist, dan Applied AI Engineer."
                : "Open to full-time roles and high-impact engagements in Data Analytics, RPA Automation, and Applied AI."}
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <button
              type="button"
              onClick={() => {
                if (typeof scrollTo === 'function') {
                  scrollTo('contact');
                } else {
                  document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
                }
              }}
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 min-h-[44px] rounded-xl text-sm font-bold text-white bg-emerald-700 hover:bg-emerald-800 dark:bg-emerald-500 dark:text-slate-950 dark:hover:bg-emerald-400 shadow-sm hover:shadow active:scale-[0.98] transition-all cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-600"
            >
              <span>{isIndonesian ? "Diskusikan Peran atau Proyek" : "Discuss a Role or Project"}</span>
              <ArrowRight size={16} aria-hidden="true" />
            </button>
          </div>
        </div>
  </div>

      {/* Featured Showcase Lightbox Portal */}
      {isLightboxOpen && currentMediaItem && typeof document !== 'undefined' && createPortal(
        <div
          role="dialog"
          aria-modal="true"
          aria-label={`${currentSpotlight.title} preview`}
          onClick={() => setIsLightboxOpen(false)}
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/85 backdrop-blur-sm p-4"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-5xl rounded-2xl border border-slate-700 bg-slate-900 shadow-2xl overflow-hidden"
          >
            <div className="flex items-center justify-between gap-4 px-4 py-3 border-b border-slate-800 bg-slate-950">
              <div className="min-w-0">
                <h4 className="text-sm font-bold text-white truncate">{currentSpotlight.title}</h4>
                <p className="text-xs font-mono text-slate-300 truncate">{currentMediaItem.caption || currentSpotlight.title}</p>
              </div>
              <button
                type="button"
                onClick={() => setIsLightboxOpen(false)}
                aria-label={t('projects.closePreview') || 'Close Preview'}
                className="inline-flex items-center justify-center min-w-[44px] min-h-[44px] rounded-lg bg-slate-800 hover:bg-slate-700 text-white border border-slate-700 transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-400"
              >
                <X size={18} aria-hidden="true" />
              </button>
            </div>

            <div className="relative bg-slate-950 flex items-center justify-center max-h-[75vh]">
              {currentMediaItem.type === 'video' ? (
                <video
                  src={currentMediaItem.src}
                  poster={currentMediaItem.poster}
                  controls
                  autoPlay
                  loop
                  muted
                  playsInline
                  preload="none"
                  aria-label={currentMediaItem.caption || currentSpotlight.title}
                  className="max-h-[75vh] w-auto max-w-full object-contain"
                />
              ) : (
                <img
                  src={currentMediaItem.src}
                  alt={currentMediaItem.caption || currentSpotlight.title}
                  className="max-h-[75vh] w-auto max-w-full object-contain"
                />
              )}
            </div>
          </div>
        </div>,
        document.body
      )}
    </section>
  );
};
