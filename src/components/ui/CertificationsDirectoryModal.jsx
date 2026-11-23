import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Search, RotateCcw } from 'lucide-react';
import { CERTIFICATIONS } from '../../data/constants';
import { useI18n } from '../../lib/i18n';
import { CertBadge } from './CertBadge';

/**
 * Centered responsive modal dialog for browsing all 87 certifications.
 * Features 12-item pagination to keep active DOM nodes strictly under 150 elements,
 * real-time substring search, 7 provider filter chips, and WCAG 2.1 AA focus trap.
 */
export function CertificationsDirectoryModal({
  isOpen = false,
  onClose,
  certifications = CERTIFICATIONS,
  triggerRef
}) {
  const { t } = useI18n();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedIssuer, setSelectedIssuer] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);

  const dialogRef = useRef(null);
  const searchInputRef = useRef(null);
  const closeButtonRef = useRef(null);
  const previousActiveElement = useRef(null);

  const PAGE_SIZE = 12;

  // 7 Issuer category chips with real-time counts from current dataset
  const issuerCategories = useMemo(() => [
    { id: 'all', label: t('certifications.filterAll') || 'All', count: certifications.length },
    { id: 'ibm', label: t('certifications.filterIBM') || 'IBM', count: certifications.filter(c => c.issuer === 'IBM').length },
    { id: 'anthropic', label: t('certifications.filterAnthropic') || 'Anthropic', count: certifications.filter(c => c.issuer === 'Anthropic').length },
    { id: 'deeplearning', label: t('certifications.filterDeepLearning') || 'DeepLearning.AI', count: certifications.filter(c => c.issuer === 'DeepLearning.AI').length },
    { id: 'dicoding', label: t('certifications.filterDicoding') || 'Dicoding Indonesia', count: certifications.filter(c => c.issuer === 'Dicoding Indonesia').length },
    { id: 'google', label: t('certifications.filterGoogle') || 'Google', count: certifications.filter(c => c.issuer && c.issuer.toLowerCase().includes('google')).length },
    { 
      id: 'other', 
      label: t('certifications.filterOther') || 'Other', 
      count: certifications.filter(c => 
        c.issuer !== 'IBM' &&
        c.issuer !== 'Anthropic' &&
        c.issuer !== 'DeepLearning.AI' &&
        c.issuer !== 'Dicoding Indonesia' &&
        !(c.issuer && c.issuer.toLowerCase().includes('google'))
      ).length 
    },
  ], [certifications, t]);

  // Client-side filtering across selected issuer and real-time substring query
  const filteredCertifications = useMemo(() => {
    return certifications.filter((cert) => {
      // 1. Issuer filter
      if (selectedIssuer === 'ibm' && cert.issuer !== 'IBM') return false;
      if (selectedIssuer === 'anthropic' && cert.issuer !== 'Anthropic') return false;
      if (selectedIssuer === 'deeplearning' && cert.issuer !== 'DeepLearning.AI') return false;
      if (selectedIssuer === 'dicoding' && cert.issuer !== 'Dicoding Indonesia') return false;
      if (selectedIssuer === 'google' && !(cert.issuer && cert.issuer.toLowerCase().includes('google'))) return false;
      if (selectedIssuer === 'other') {
        const isStandard = 
          cert.issuer === 'IBM' ||
          cert.issuer === 'Anthropic' ||
          cert.issuer === 'DeepLearning.AI' ||
          cert.issuer === 'Dicoding Indonesia' ||
          (cert.issuer && cert.issuer.toLowerCase().includes('google'));
        if (isStandard) return false;
      }

      // 2. Real-time search query matching title, issuer, credentialId, or date
      const query = searchQuery.trim().toLowerCase();
      if (!query) return true;

      const title = cert.title ? cert.title.toLowerCase() : '';
      const issuer = cert.issuer ? cert.issuer.toLowerCase() : '';
      const credId = cert.credentialId ? cert.credentialId.toLowerCase() : '';
      const date = cert.date ? cert.date.toLowerCase() : '';

      return (
        title.includes(query) ||
        issuer.includes(query) ||
        credId.includes(query) ||
        date.includes(query)
      );
    });
  }, [certifications, selectedIssuer, searchQuery]);

  // Derived pagination boundaries
  const totalPages = Math.max(1, Math.ceil(filteredCertifications.length / PAGE_SIZE));
  const safeCurrentPage = Math.min(Math.max(1, currentPage), totalPages);
  const paginatedItems = useMemo(() => {
    const startIndex = (safeCurrentPage - 1) * PAGE_SIZE;
    return filteredCertifications.slice(startIndex, startIndex + PAGE_SIZE);
  }, [filteredCertifications, safeCurrentPage]);

  // Focus trap, Escape key handling, and body scroll lock
  useEffect(() => {
    if (!isOpen) return;

    previousActiveElement.current = document.activeElement;
    const triggerElement = triggerRef?.current;
    document.body.style.overflow = 'hidden';

    // Auto-focus search input with small tick to ensure DOM is hydrated
    const timer = setTimeout(() => {
      if (searchInputRef.current) {
        searchInputRef.current.focus();
      } else if (closeButtonRef.current) {
        closeButtonRef.current.focus();
      }
    }, 40);

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose?.();
        return;
      }

      if (e.key === 'Tab') {
        if (!dialogRef.current) return;
        const focusable = dialogRef.current.querySelectorAll(
          'button:not([disabled]), [href], input:not([disabled]), [tabindex]:not([tabindex="-1"])'
        );
        if (focusable.length === 0) return;

        const firstElement = focusable[0];
        const lastElement = focusable[focusable.length - 1];

        if (e.shiftKey) {
          if (document.activeElement === firstElement) {
            e.preventDefault();
            lastElement.focus();
          }
        } else {
          if (document.activeElement === lastElement) {
            e.preventDefault();
            firstElement.focus();
          }
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
      clearTimeout(timer);

      // Restore focus to trigger element or previous focus
      if (triggerElement && typeof triggerElement.focus === 'function') {
        triggerElement.focus();
      } else if (previousActiveElement.current && typeof previousActiveElement.current.focus === 'function') {
        previousActiveElement.current.focus();
      }
    };
  }, [isOpen, onClose, triggerRef]);

  // Zero idle DOM: strictly unmounted when closed
  if (!isOpen) {
    return null;
  }

  const handleSelectIssuer = (id) => {
    setSelectedIssuer(id);
    setCurrentPage(1);
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1);
  };

  const handleClearSearch = () => {
    setSearchQuery('');
    setCurrentPage(1);
    searchInputRef.current?.focus();
  };

  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedIssuer('all');
    setCurrentPage(1);
    searchInputRef.current?.focus();
  };

  return (
    <div
      role="presentation"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose?.();
        }
      }}
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/70 backdrop-blur-xs transition-opacity duration-200"
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="cert-directory-title"
        id="certifications-directory-modal"
        className="relative w-full max-w-5xl max-h-[92vh] flex flex-col bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-emerald-950/80 rounded-2xl shadow-2xl overflow-hidden text-slate-900 dark:text-slate-100 backdrop-blur-md"
      >
        {/* Modal Header */}
        <div className="p-4 sm:p-6 border-b border-slate-200/90 dark:border-emerald-950/80 flex flex-col gap-4 bg-slate-50/70 dark:bg-slate-950/70">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <h2
                id="cert-directory-title"
                className="text-lg sm:text-xl font-bold tracking-tight text-slate-900 dark:text-slate-100"
              >
                {t('certifications.directoryTitle') || "All Certifications & Credentials"}
              </h2>
              <span className="font-mono text-xs px-2.5 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/80 font-semibold">
                {certifications.length >= 80 ? '80+ Credentials' : `${certifications.length} Total`}
              </span>
            </div>
            <button
              ref={closeButtonRef}
              type="button"
              onClick={onClose}
              aria-label={t('certifications.closeDirectory') || "Close certifications directory"}
              className="inline-flex items-center justify-center min-h-[44px] min-w-[44px] rounded-xl text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors focus-visible:outline-2 focus-visible:outline-emerald-700 dark:focus-visible:outline-emerald-400 cursor-pointer text-lg font-bold"
            >
              ✕
            </button>
          </div>

          {/* Search bar */}
          <div className="relative flex items-center">
            <input
              ref={searchInputRef}
              type="text"
              value={searchQuery}
              onChange={handleSearchChange}
              placeholder={t('certifications.searchPlaceholder') || "Search by title, issuer, credential ID, or date..."}
              aria-label={t('certifications.searchPlaceholder') || "Search certifications"}
              className="w-full px-4 py-2.5 min-h-[44px] rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800/90 text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 text-sm focus:border-emerald-700 dark:focus:border-emerald-400 focus-visible:outline-2 focus-visible:outline-emerald-700 dark:focus-visible:outline-emerald-400 transition-all"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={handleClearSearch}
                aria-label={t('certifications.clearSearch') || "Clear search query"}
                className="absolute right-2 inline-flex items-center justify-center min-h-[40px] min-w-[40px] rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-colors cursor-pointer text-sm font-bold"
              >
                ✕
              </button>
            )}
          </div>

          {/* Issuer Filter Chips */}
          <div 
            className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-thin scrollbar-thumb-slate-300 dark:scrollbar-thumb-slate-700"
            role="toolbar"
            aria-label="Filter credentials by issuer"
          >
            {issuerCategories.map((cat) => {
              const isActive = selectedIssuer === cat.id;
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => handleSelectIssuer(cat.id)}
                  aria-pressed={isActive}
                  className={`px-3 py-1.5 min-h-[44px] rounded-xl text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer border ${
                    isActive
                      ? 'bg-emerald-700 hover:bg-emerald-800 text-white border-emerald-700 dark:bg-emerald-500 dark:hover:bg-emerald-400 dark:text-slate-950 dark:border-emerald-500 shadow-xs'
                      : 'bg-white dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 border-slate-300 dark:border-slate-700 hover:border-emerald-700/40 hover:text-emerald-700 dark:hover:text-emerald-400'
                  }`}
                >
                  {cat.label} ({cat.count})
                </button>
              );
            })}
          </div>
        </div>

        {/* Polite Live Region for screen readers */}
        <div aria-live="polite" aria-atomic="true" className="sr-only">
          {filteredCertifications.length === 0
            ? (t('certifications.noResultsSubtitle') || "No credentials match your filter criteria.")
            : (t('certifications.resultsCount', {
                showing: paginatedItems.length,
                total: filteredCertifications.length
              }) || `Showing ${paginatedItems.length} of ${filteredCertifications.length} credentials`)}
        </div>

        {/* Modal Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 min-h-[300px] custom-scrollbar">
          {filteredCertifications.length === 0 ? (
            <div className="py-16 px-4 text-center flex flex-col items-center justify-center">
              <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 flex items-center justify-center mb-3">
                <Search size={22} aria-hidden="true" />
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 mb-1">
                {t('certifications.noResultsTitle') || "No Credentials Found"}
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 max-w-sm mb-5 leading-relaxed">
                {t('certifications.noResultsSubtitle') || "No credentials match your filter criteria."}
              </p>
              <button
                type="button"
                onClick={handleResetFilters}
                className="inline-flex items-center gap-2 px-4 py-2 min-h-[44px] rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white dark:bg-emerald-500 dark:hover:bg-emerald-400 dark:text-slate-950 text-xs font-semibold shadow-xs cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 transition-colors"
              >
                <RotateCcw size={15} aria-hidden="true" />
                <span>{t('certifications.resetFilters') || "Reset Filters"}</span>
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {paginatedItems.map((cert) => (
                <a
                  key={cert.id}
                  href={cert.link || "#"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-4 rounded-xl border border-slate-200/90 dark:border-emerald-950/70 bg-slate-50/70 dark:bg-slate-900/60 hover:bg-white dark:hover:bg-slate-800/80 hover:border-emerald-700/50 dark:hover:border-emerald-400/50 hover:shadow-md transition-all flex flex-col justify-between group cursor-pointer block"
                >
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <CertBadge src={cert.image} alt="" issuer={cert.issuer} />
                    {cert.date && (
                      <span className="font-mono text-[11px] px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/80 font-medium shrink-0">
                        {cert.date}
                      </span>
                    )}
                  </div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 group-hover:text-emerald-700 dark:group-hover:text-emerald-400 transition-colors line-clamp-2 leading-snug">
                    {cert.title}
                  </h3>
                  <p className="text-xs font-medium text-slate-600 dark:text-slate-400 mt-1">
                    {cert.issuer}
                  </p>

                  <div className="pt-2 mt-2 border-t border-slate-200/80 dark:border-slate-800/80 flex items-center justify-between text-xs">
                    <span className="font-mono text-slate-500 dark:text-slate-400 truncate text-[11px]">
                      {cert.credentialId ? `ID: ${cert.credentialId}` : (t('certifications.verify') || "Verify")}
                    </span>
                    <span className="text-slate-400 group-hover:text-emerald-700 dark:group-hover:text-emerald-400 font-mono text-xs" aria-hidden="true">
                      ↗
                    </span>
                    <span className="sr-only">{t('certifications.opensInNewTab') || "(opens in new tab)"}</span>
                  </div>
                </a>
              ))}
            </div>
          )}
        </div>

        {/* Modal Footer with Pagination Controls */}
        <div className="p-4 sm:px-6 border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 bg-slate-50/80 dark:bg-slate-900/80">
          <div className="text-xs font-medium text-slate-600 dark:text-slate-400 flex items-center gap-2">
            <span>
              {t('certifications.resultsCount', { 
                showing: paginatedItems.length, 
                total: filteredCertifications.length 
              }) || `Showing ${paginatedItems.length} of ${filteredCertifications.length} credentials`}
            </span>
            {filteredCertifications.length !== certifications.length && (
              <span className="font-mono text-slate-500 dark:text-slate-400">
                ({certifications.length} total)
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={safeCurrentPage <= 1}
              aria-label={t('certifications.prevPage') || "Previous page"}
              className="px-3.5 py-2 min-h-[44px] rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:text-emerald-700 dark:hover:text-emerald-400 hover:border-emerald-700/40 text-xs font-semibold shadow-xs disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
            >
              ‹ {t('certifications.prevPage') || "Prev"}
            </button>

            <span className="px-3 py-2 min-h-[44px] inline-flex items-center text-xs font-mono font-semibold text-slate-700 dark:text-slate-300">
              {t('certifications.pageIndicator', { current: safeCurrentPage, total: totalPages }) || `Page ${safeCurrentPage} of ${totalPages}`}
            </span>

            <button
              type="button"
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={safeCurrentPage >= totalPages}
              aria-label={t('certifications.nextPage') || "Next page"}
              className="px-3.5 py-2 min-h-[44px] rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:text-emerald-700 dark:hover:text-emerald-400 hover:border-emerald-700/40 text-xs font-semibold shadow-xs disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
            >
              {t('certifications.nextPage') || "Next"} ›
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
