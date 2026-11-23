import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import {
  Github,
  ExternalLink,
  Activity,
  CheckCircle2,
  Cpu,
  ChevronLeft,
  ChevronRight,
  Maximize2,
  X,
  Monitor,
  GitBranch,
  Film,
} from 'lucide-react';
import { useI18n } from '../../lib/i18n';
import { useOptimizedVideo } from '../../hooks/useOptimizedVideo';
import { MermaidViewer } from './MermaidViewer';

export const ProjectCard = ({ project }) => {
  const { t, isIndonesian } = useI18n();

  const repoHref = project.repoUrl || project.link;
  const liveHref = project.liveUrl || project.liveLink;
  const githubStats = project.githubStats || {};
  const topics = Array.isArray(githubStats.topics) ? githubStats.topics : [];
  const highlights = Array.isArray(project.highlights) ? project.highlights : [];
  const mediaItems = Array.isArray(project.media) && project.media.length > 0
    ? project.media
    : project.image
      ? [{ type: 'image', src: project.image, caption: project.title }]
      : [];
  const workflowSteps = Array.isArray(project.workflowSteps) ? project.workflowSteps : [];

  const [activeTab, setActiveTab] = useState('preview');
  const [activeIndex, setActiveIndex] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);

  const safeIndex = mediaItems.length > 0 ? activeIndex % mediaItems.length : 0;
  const activeMedia = mediaItems[safeIndex] || null;

  const { videoRef } = useOptimizedVideo({
    threshold: 0.35,
    enabled: activeTab === 'preview' && activeMedia?.type === 'video' && !isLightboxOpen,
  });

  const handlePrevSlide = () => {
    if (mediaItems.length <= 1) return;
    setActiveIndex((prev) => (prev - 1 + mediaItems.length) % mediaItems.length);
  };

  const handleNextSlide = () => {
    if (mediaItems.length <= 1) return;
    setActiveIndex((prev) => (prev + 1) % mediaItems.length);
  };

  useEffect(() => {
    if (!isLightboxOpen) return;
    const onKeyDown = (e) => {
      if (e.key === 'Escape') {
        setIsLightboxOpen(false);
      } else if (e.key === 'ArrowLeft' && mediaItems.length > 1) {
        setActiveIndex((prev) => (prev - 1 + mediaItems.length) % mediaItems.length);
      } else if (e.key === 'ArrowRight' && mediaItems.length > 1) {
        setActiveIndex((prev) => (prev + 1) % mediaItems.length);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [isLightboxOpen, mediaItems.length]);

  const categoryConfig = {
    ai: {
      badge: 'bg-emerald-50 text-emerald-800 border-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-800/60',
      flagshipBorder: 'border-emerald-700/40 dark:border-emerald-500/50 bg-gradient-to-b from-emerald-500/[0.04] to-transparent dark:from-emerald-500/[0.06] ring-1 ring-emerald-500/15',
      flagshipBadge: 'bg-emerald-700/10 dark:bg-emerald-400/10 text-emerald-800 dark:text-emerald-300 border-emerald-700/30 dark:border-emerald-400/30',
      flagshipPulse: 'bg-emerald-700 dark:bg-emerald-400',
      hoverBorder: 'hover:border-emerald-700/60 dark:hover:border-emerald-400/60',
      titleHover: 'group-hover:text-emerald-800 dark:group-hover:text-emerald-400',
      techBadge: 'text-emerald-800 dark:text-emerald-300 bg-emerald-500/10 border-emerald-500/20'
    },
    data: {
      badge: 'bg-teal-50 text-teal-800 border-teal-200 dark:bg-teal-950/60 dark:text-teal-300 dark:border-teal-800/60',
      flagshipBorder: 'border-teal-700/40 dark:border-teal-500/50 bg-gradient-to-b from-teal-500/[0.04] to-transparent dark:from-teal-500/[0.06] ring-1 ring-teal-500/15',
      flagshipBadge: 'bg-teal-700/10 dark:bg-teal-400/10 text-teal-800 dark:text-teal-300 border-teal-700/30 dark:border-teal-400/30',
      flagshipPulse: 'bg-teal-700 dark:bg-teal-400',
      hoverBorder: 'hover:border-teal-700/60 dark:hover:border-teal-400/60',
      titleHover: 'group-hover:text-teal-800 dark:group-hover:text-teal-400',
      techBadge: 'text-teal-800 dark:text-teal-300 bg-teal-500/10 border-teal-500/20'
    },
    automation: {
      badge: 'bg-emerald-50 text-emerald-800 border-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-800/60',
      flagshipBorder: 'border-emerald-700/40 dark:border-emerald-500/50 bg-gradient-to-b from-emerald-500/[0.04] to-transparent dark:from-emerald-500/[0.06] ring-1 ring-emerald-500/15',
      flagshipBadge: 'bg-emerald-700/10 dark:bg-emerald-400/10 text-emerald-800 dark:text-emerald-300 border-emerald-700/30 dark:border-emerald-400/30',
      flagshipPulse: 'bg-emerald-700 dark:bg-emerald-400',
      hoverBorder: 'hover:border-emerald-700/60 dark:hover:border-emerald-400/60',
      titleHover: 'group-hover:text-emerald-800 dark:group-hover:text-emerald-400',
      techBadge: 'text-emerald-800 dark:text-emerald-300 bg-emerald-500/10 border-emerald-500/20'
    }
  };
  const theme = categoryConfig[project.category] || categoryConfig.data;

  return (
    <article
      id={`project-container-${project.id}`}
      className={`group relative flex flex-col justify-between rounded-2xl border transition-all duration-300 ${
        project.flagship
          ? `${theme.flagshipBorder} shadow-md hover:shadow-xl`
          : 'border-slate-200/90 dark:border-emerald-950/60 bg-white/90 dark:bg-slate-900/90 shadow-sm hover:shadow-lg'
      } hover:-translate-y-1 ${theme.hoverBorder} p-6 md:p-8 backdrop-blur-md`}
    >
      <div>
        {/* Top Meta Bar: Category, Flagship / System Badge, and Technical Metric */}
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
          <div className="flex flex-wrap items-center gap-2">
            <span className={`text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full border ${theme.badge}`}>
              {project.category === 'ai' ? 'AI Systems' : project.category === 'data' ? 'Data Engineering' : 'Automation'}
            </span>

            {liveHref ? (
              <span className="inline-flex items-center gap-1.5 text-[11px] font-mono font-semibold px-2.5 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/60">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 dark:bg-emerald-400" aria-hidden="true" />
                <span>Live Demo</span>
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 text-[11px] font-mono font-medium px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                <Cpu size={12} className="text-slate-500 dark:text-slate-400" aria-hidden="true" />
                <span>Production System</span>
              </span>
            )}
          </div>

          {/* Core Technical Indicators (Strictly ZERO Arbitrary Star Counters) */}
          <div className="flex items-center gap-3 text-xs font-medium text-slate-600 dark:text-slate-400">
            <div className="flex items-center gap-1.5 text-slate-700 dark:text-slate-300 bg-slate-100/90 dark:bg-slate-800/80 px-2.5 py-1 rounded-md border border-slate-200 dark:border-slate-700 font-medium">
              <Activity size={12} className="text-emerald-700 dark:text-emerald-400 shrink-0" aria-hidden="true" />
              <span className="font-semibold text-slate-800 dark:text-slate-200 text-xs tabular-nums">
                {project.technicalMetric || project.technicalBadge || (project.liveUrl ? (t('projects.liveVerified') || 'Live Production') : (t('projects.productionReady') || 'Production Grade'))}
              </span>
              <span className="text-[11px] text-slate-700 dark:text-slate-300 font-medium">
                {project.metricBadgeLabel || t('projects.verifiedBadge') || 'Architecture'}
              </span>
            </div>
          </div>
        </div>

        {/* Project Title */}
        <h3 className={`text-2xl md:text-3xl font-bold text-slate-900 dark:text-slate-100 tracking-tight mb-3 ${theme.titleHover} transition-colors`}>
          {project.title}
        </h3>

        {/* Project Description */}
        <p className="text-slate-600 dark:text-slate-300 text-sm md:text-base leading-relaxed mb-5 font-normal">
          {project.description}
        </p>

        {/* Dev-Tool Media Showcase & Execution Pipeline */}
        {(mediaItems.length > 0 || workflowSteps.length > 0) && (
          <div className="mb-6 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/70 overflow-hidden">
            {/* Window Chrome & Tab Switcher */}
            <div className="flex flex-wrap items-center justify-between gap-2 px-3 py-2 border-b border-slate-200 dark:border-slate-800 bg-slate-100/80 dark:bg-slate-900/90">
              <div className="flex items-center gap-1.5" aria-hidden="true">
                <span className="w-2.5 h-2.5 rounded-full bg-slate-300 dark:bg-slate-700" />
                <span className="w-2.5 h-2.5 rounded-full bg-slate-300 dark:bg-slate-700" />
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-600/70 dark:bg-emerald-400/70" />
              </div>

              <div className="inline-flex items-center rounded-lg bg-slate-200/80 dark:bg-slate-800 p-0.5" role="tablist" aria-label={`${project.title} view mode`}>
                <button
                  type="button"
                  role="tab"
                  aria-selected={activeTab === 'preview'}
                  onClick={() => setActiveTab('preview')}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 min-h-[44px] text-xs font-mono font-semibold rounded-md transition-colors cursor-pointer ${
                    activeTab === 'preview'
                      ? 'bg-white dark:bg-slate-900 text-emerald-800 dark:text-emerald-300 shadow-sm'
                      : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  <Monitor size={13} aria-hidden="true" />
                  <span>{t('projects.previewTab') || 'UI Preview'}</span>
                </button>
                <button
                  type="button"
                  role="tab"
                  aria-selected={activeTab === 'workflow'}
                  onClick={() => setActiveTab('workflow')}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 min-h-[44px] text-xs font-mono font-semibold rounded-md transition-colors cursor-pointer ${
                    activeTab === 'workflow'
                      ? 'bg-white dark:bg-slate-900 text-emerald-800 dark:text-emerald-300 shadow-sm'
                      : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  <GitBranch size={13} aria-hidden="true" />
                  <span>{t('projects.howItWorksTab') || 'How It Works'}</span>
                </button>
              </div>
            </div>

            {activeTab === 'preview' && activeMedia ? (
              <div>
                <div className="relative aspect-[16/10] bg-slate-900 overflow-hidden group/media">
                  {activeMedia.type === 'video' ? (
                    <video
                      ref={videoRef}
                      key={activeMedia.src}
                      src={activeMedia.src}
                      poster={activeMedia.poster}
                      loop
                      muted
                      playsInline
                      preload="none"
                      aria-label={activeMedia.caption || project.title}
                      className="w-full h-full object-cover object-top"
                    />
                  ) : (
                    <img
                      src={activeMedia.src}
                      alt={activeMedia.caption || project.title}
                      loading="lazy"
                      className="w-full h-full object-cover object-top"
                    />
                  )}

                  {activeMedia.type === 'video' && (
                    <span className="absolute top-2.5 left-2.5 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-950/85 text-emerald-300 text-[11px] font-mono font-semibold border border-emerald-500/30">
                      <Film size={12} aria-hidden="true" />
                      <span>{t('projects.recordingLabel') || 'Recording'}</span>
                    </span>
                  )}

                  <button
                    type="button"
                    onClick={() => setIsLightboxOpen(true)}
                    aria-label={`${t('projects.expandPreview') || 'Expand Preview'}: ${project.title}`}
                    className="absolute top-2.5 right-2.5 inline-flex items-center gap-1.5 px-2.5 py-1.5 min-h-[36px] rounded-md bg-slate-950/80 hover:bg-slate-950 text-white text-xs font-mono font-medium border border-slate-700 transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-400"
                  >
                    <Maximize2 size={13} aria-hidden="true" />
                    <span className="hidden sm:inline">{t('projects.expandPreview') || 'Expand Preview'}</span>
                  </button>

                  {mediaItems.length > 1 && (
                    <>
                      <button
                        type="button"
                        onClick={handlePrevSlide}
                        aria-label={`Previous preview for ${project.title}`}
                        className="absolute left-2 top-1/2 -translate-y-1/2 inline-flex items-center justify-center w-9 h-9 rounded-full bg-slate-950/75 hover:bg-slate-950 text-white border border-slate-700 transition-colors cursor-pointer"
                      >
                        <ChevronLeft size={18} aria-hidden="true" />
                      </button>
                      <button
                        type="button"
                        onClick={handleNextSlide}
                        aria-label={`Next preview for ${project.title}`}
                        className="absolute right-2 top-1/2 -translate-y-1/2 inline-flex items-center justify-center w-9 h-9 rounded-full bg-slate-950/75 hover:bg-slate-950 text-white border border-slate-700 transition-colors cursor-pointer"
                      >
                        <ChevronRight size={18} aria-hidden="true" />
                      </button>
                    </>
                  )}
                </div>

                <div className="flex items-center justify-between gap-3 px-3.5 py-2 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60">
                  <p className="text-xs font-mono text-slate-600 dark:text-slate-300 truncate">
                    {activeMedia.caption || project.title}
                  </p>
                  {mediaItems.length > 1 && (
                    <div className="flex items-center gap-1.5 shrink-0">
                      {mediaItems.map((item, idx) => (
                        <button
                          key={item.src}
                          type="button"
                          onClick={() => setActiveIndex(idx)}
                          aria-label={`Preview slide ${idx + 1} of ${mediaItems.length}`}
                          aria-current={idx === safeIndex ? 'true' : undefined}
                          className={`h-2 rounded-full transition-all cursor-pointer ${
                            idx === safeIndex
                              ? 'w-5 bg-emerald-700 dark:bg-emerald-400'
                              : 'w-2 bg-slate-300 dark:bg-slate-700 hover:bg-slate-400 dark:hover:bg-slate-600'
                          }`}
                        />
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="p-4 bg-white dark:bg-slate-900/60">
                {project.workflowMermaid && (
                  <div className="mb-4">
                    <MermaidViewer 
                      chart={project.workflowMermaid} 
                      id={project.id} 
                      title={project.title} 
                    />
                  </div>
                )}
                <div className="text-[11px] font-mono uppercase tracking-wider font-semibold text-emerald-800 dark:text-emerald-300 mb-3">
                  {t('projects.architectureFlow') || 'Execution Pipeline'}
                </div>
                <ol className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {workflowSteps.map((stepItem) => (
                    <li
                      key={stepItem.step}
                      className="p-3 rounded-lg bg-slate-50 dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800 flex flex-col gap-1"
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-[11px] font-mono font-bold px-1.5 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/60">
                          {stepItem.step}
                        </span>
                        <span className="text-xs font-bold text-slate-900 dark:text-slate-100">
                          {stepItem.title}
                        </span>
                      </div>
                      <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                        {stepItem.detail}
                      </p>
                    </li>
                  ))}
                </ol>
              </div>
            )}
          </div>
        )}

        {/* Architecture Spec Matrix */}
        {Array.isArray(project.technicalIndicators) && project.technicalIndicators.length > 0 && (
          <div className="grid grid-cols-2 gap-2 mb-6">
            {project.technicalIndicators.map((ind, idx) => (
              <div 
                key={idx} 
                className="p-2.5 rounded-lg border border-slate-200/80 dark:border-slate-800/80 bg-slate-50/80 dark:bg-slate-950/40 flex flex-col justify-between"
              >
                <div className="text-[10px] font-mono uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  {ind.label}
                </div>
                <div className="text-xs font-bold text-slate-900 dark:text-slate-100 truncate mt-0.5">
                  {ind.value}
                </div>
                {ind.detail && (
                  <div className="text-[11px] text-slate-600 dark:text-slate-400 truncate mt-0.5">
                    {ind.detail}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Architectural Highlights Checklist */}
        {highlights.length > 0 && (
          <div className="mb-6 space-y-2.5 bg-slate-50 dark:bg-slate-950/50 p-4 rounded-xl border border-slate-200/80 dark:border-slate-800/80">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
              {t('projects.highlightsTitle') || 'Architectural Highlights'}
            </h4>
            <ul className="space-y-2">
              {highlights.map((highlight, idx) => (
                <li key={idx} className="flex items-start gap-2 text-xs md:text-sm text-slate-700 dark:text-slate-300">
                  <CheckCircle2 size={15} className="text-emerald-700 dark:text-emerald-400 shrink-0 mt-0.5" aria-hidden="true" />
                  <span className="leading-snug">{highlight}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Tech Stack Badges */}
        <div className="flex flex-wrap gap-2 mb-6">
          {project.tech.map((tItem, i) => (
            <span
              key={i}
              className={`text-xs font-medium px-3 py-1 rounded-full border ${theme.techBadge}`}
            >
              {tItem}
            </span>
          ))}
        </div>

        {/* Topics Chips */}
        {topics.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-6">
            {topics.map((topic, i) => (
              <span
                key={i}
                className="text-[11px] font-mono text-slate-700 dark:text-slate-300 font-medium bg-slate-100 dark:bg-slate-800/60 px-2.5 py-0.5 rounded border border-slate-200/60 dark:border-slate-700/60"
              >
                #{topic}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Action Buttons: View Repo & View Live */}
      <div className="flex flex-wrap items-center gap-3 pt-4 border-t border-slate-200/70 dark:border-slate-800/70 mt-4">
        {repoHref && (
          <a
            href={repoHref}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 text-sm font-semibold text-slate-700 dark:text-slate-200 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 px-5 py-2.5 min-h-[44px] rounded-xl border border-slate-300 dark:border-slate-700 transition-colors shadow-sm cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-700 dark:focus-visible:outline-emerald-400"
          >
            <Github size={16} aria-hidden="true" />
            <span>{isIndonesian ? (t('projects.viewRepo') || 'Kode Sumber') : 'View Repo'}</span>
          </a>
        )}

        {liveHref && (
          <a
            href={liveHref}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 text-sm font-semibold text-white bg-emerald-700 hover:bg-emerald-800 dark:bg-emerald-500 dark:text-slate-950 dark:hover:bg-emerald-400 dark:font-bold px-5 py-2.5 min-h-[44px] rounded-xl transition-colors shadow-sm cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-700 dark:focus-visible:outline-emerald-400"
          >
            <span>{isIndonesian ? (t('projects.viewLive') || 'Demo Langsung') : 'View Live'}</span>
            <ExternalLink size={15} aria-hidden="true" />
          </a>
        )}
      </div>

      {isLightboxOpen && activeMedia && typeof document !== 'undefined' && createPortal(
        <div
          role="dialog"
          aria-modal="true"
          aria-label={`${project.title} preview`}
          onClick={() => setIsLightboxOpen(false)}
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/85 backdrop-blur-sm p-4"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-5xl rounded-2xl border border-slate-700 bg-slate-900 shadow-2xl overflow-hidden"
          >
            <div className="flex items-center justify-between gap-4 px-4 py-3 border-b border-slate-800 bg-slate-950">
              <div className="min-w-0">
                <h4 className="text-sm font-bold text-white truncate">{project.title}</h4>
                <p className="text-xs font-mono text-slate-300 truncate">{activeMedia.caption || project.title}</p>
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
              {activeMedia.type === 'video' ? (
                <video
                  key={`lightbox-${activeMedia.src}`}
                  src={activeMedia.src}
                  poster={activeMedia.poster}
                  controls
                  autoPlay
                  loop
                  muted
                  playsInline
                  className="max-h-[75vh] w-full object-contain"
                />
              ) : (
                <img
                  src={activeMedia.src}
                  alt={activeMedia.caption || project.title}
                  className="max-h-[75vh] w-full object-contain"
                />
              )}
            </div>

            {mediaItems.length > 1 && (
              <div className="flex items-center justify-between px-4 py-3 border-t border-slate-800 bg-slate-950">
                <button
                  type="button"
                  onClick={handlePrevSlide}
                  aria-label="Previous media"
                  className="inline-flex items-center gap-1.5 px-3 py-2 min-h-[44px] rounded-lg bg-slate-800 hover:bg-slate-700 text-white text-xs font-mono border border-slate-700 transition-colors cursor-pointer"
                >
                  <ChevronLeft size={16} aria-hidden="true" />
                  <span>Prev</span>
                </button>
                <span className="text-xs font-mono text-slate-300">
                  {safeIndex + 1} / {mediaItems.length}
                </span>
                <button
                  type="button"
                  onClick={handleNextSlide}
                  aria-label="Next media"
                  className="inline-flex items-center gap-1.5 px-3 py-2 min-h-[44px] rounded-lg bg-slate-800 hover:bg-slate-700 text-white text-xs font-mono border border-slate-700 transition-colors cursor-pointer"
                >
                  <span>Next</span>
                  <ChevronRight size={16} aria-hidden="true" />
                </button>
              </div>
            )}
          </div>
        </div>,
        document.body
      )}
    </article>
  );
};