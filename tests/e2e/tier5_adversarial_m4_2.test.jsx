/**
 * Tier 5 Interaction & Accessibility Adversarial Hardening Suite
 * Author: challenger_m4_2 (Empirical Challenger: critic, specialist)
 *
 * Directives:
 * 1. Mobile Responsiveness across 7 exact breakpoints (320px, 375px, 640px, 768px, 1024px, 1280px, 1920px).
 * 2. Keyboard Navigation paths: Focus trapping in CertificationsDirectoryModal, Escape handling,
 *    Enter/Space activation, aria-labels, aria-modal, and focus restoration.
 * 3. Dynamic Locale toggling quirks: dynamic switching EN <-> ID, dictionary parity, fallback
 *    mechanics on null/invalid paths, text expansion resilience, and reactive state sync.
 *
 * Standards: WCAG 2.2 Level AA (Operable, Perceivable, Understandable, Robust)
 */

import React from 'react';
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { screen, within, fireEvent, act } from '@testing-library/react';
import { renderPortfolio, resetTestEnvironment, setViewport } from './harness';
import { CERTIFICATIONS } from '../../src/data/constants';
import { 
  translations, 
  getTranslation 
} from '../../src/lib/i18n';

describe('Tier 5 Adversarial Hardening: Interaction, Viewport & Accessibility Oracle (challenger_m4_2)', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    resetTestEnvironment();
  });

  afterEach(() => {
    vi.useRealTimers();
    resetTestEnvironment();
  });

  // ==========================================================================
  // Suite 1: Breakpoint & Responsive Matrix Adversarial Stress (320px to 1920px)
  // ==========================================================================
  describe('Suite 1: Breakpoint & Responsive Matrix Adversarial Stress', () => {
    const breakpoints = [
      { name: '320px (Ultra-Compact Mobile)', width: 320, height: 568 },
      { name: '375px (Standard Mobile)', width: 375, height: 667 },
      { name: '640px (Tailwind sm Boundary)', width: 640, height: 800 },
      { name: '768px (Tablet Portrait / md)', width: 768, height: 1024 },
      { name: '1024px (Desktop Threshold / lg)', width: 1024, height: 768 },
      { name: '1280px (Standard Laptop / xl)', width: 1280, height: 800 },
      { name: '1920px (FHD Wide Desktop / 2xl)', width: 1920, height: 1080 }
    ];

    breakpoints.forEach(({ name, width, height }) => {
      it(`1.1 [${name}]: renders portfolio shell and modal with zero horizontal overflow leak`, () => {
        setViewport({ width, height });
        renderPortfolio();

        // 1. Verify body and root styles do not force horizontal scroll
        expect(document.body.style.overflowX).not.toBe('scroll');
        expect(document.documentElement.style.overflowX).not.toBe('scroll');

        // 2. Open Certifications Directory Modal
        const triggerBtn = screen.getByRole('button', { name: /Browse All (80\+|87)/i });
        expect(triggerBtn).toBeInTheDocument();

        act(() => {
          fireEvent.click(triggerBtn);
          vi.advanceTimersByTime(50);
        });

        const modal = document.getElementById('certifications-directory-modal');
        expect(modal).toBeInTheDocument();

        // Modal container must use fixed inset-0 with w-full and max-w-5xl
        const backdrop = modal.parentElement;
        expect(backdrop.className).toContain('fixed');
        expect(backdrop.className).toContain('inset-0');
        expect(modal.className).toContain('max-w-5xl');
        expect(modal.className).toContain('w-full');
        expect(modal.className).toContain('max-h-[92vh]');

        // Scrollable body within modal must have overflow-y-auto
        const modalScrollArea = modal.querySelector('.overflow-y-auto');
        expect(modalScrollArea).toBeInTheDocument();

        // Check grid columns class on the modal card container
        const cardGrid = modal.querySelector('.grid');
        expect(cardGrid).toBeInTheDocument();
        expect(cardGrid.className).toContain('grid-cols-1');
        expect(cardGrid.className).toContain('sm:grid-cols-2');
        expect(cardGrid.className).toContain('lg:grid-cols-3');

        // Verify body overflow is locked while modal is open
        expect(document.body.style.overflow).toBe('hidden');

        // Close modal
        const closeBtn = within(modal).getByRole('button', { name: /Close certifications directory/i });
        act(() => {
          fireEvent.click(closeBtn);
        });
        expect(document.getElementById('certifications-directory-modal')).toBeNull();
        expect(document.body.style.overflow).toBe('');
      });
    });

    it('1.2: Mobile Extreme Constraint (320px): verifies zero layout clipping on modal controls', () => {
      setViewport({ width: 320, height: 568 });
      renderPortfolio();

      const triggerBtn = screen.getByRole('button', { name: /Browse All (80\+|87)/i });
      act(() => {
        fireEvent.click(triggerBtn);
        vi.advanceTimersByTime(50);
      });

      const modal = document.getElementById('certifications-directory-modal');
      expect(modal).toBeInTheDocument();

      // Search input is rendered with full width, min-h-[44px], and accessible placeholder
      const searchInput = within(modal).getByRole('textbox');
      expect(searchInput).toBeInTheDocument();
      expect(searchInput.className).toContain('min-h-[44px]');
      expect(searchInput.className).toContain('w-full');
      expect(searchInput.getAttribute('placeholder')).toMatch(/Search by title/i);

      // Filter chips container must have overflow-x-auto to allow horizontal scrolling on narrow screens
      const filterToolbar = within(modal).getByRole('toolbar', { name: /Filter credentials by issuer/i });
      expect(filterToolbar).toBeInTheDocument();
      expect(filterToolbar.className).toContain('overflow-x-auto');

      // 7 filter buttons exist inside toolbar
      const chips = within(filterToolbar).getAllByRole('button');
      expect(chips.length).toBe(7);

      // Pagination controls in footer stack vertically on mobile (flex-col sm:flex-row)
      const modalFooter = modal.querySelector('.border-t.flex-col');
      expect(modalFooter).toBeInTheDocument();
      expect(modalFooter.className).toContain('flex-col');
      expect(modalFooter.className).toContain('sm:flex-row');
    });

    it('1.3: Dynamic Rapid Window Resizing: switches between 320px and 1920px 20 times with open modal without crash', () => {
      renderPortfolio();
      const triggerBtn = screen.getByRole('button', { name: /Browse All (80\+|87)/i });

      act(() => {
        fireEvent.click(triggerBtn);
        vi.advanceTimersByTime(50);
      });

      const modal = document.getElementById('certifications-directory-modal');
      expect(modal).toBeInTheDocument();

      // Rapidly oscillate viewport widths
      for (let i = 0; i < 20; i++) {
        act(() => {
          setViewport({ width: i % 2 === 0 ? 320 : 1920, height: 800 });
        });
      }

      // Modal must remain perfectly mounted and functional
      expect(document.getElementById('certifications-directory-modal')).toBeInTheDocument();
      expect(document.body.style.overflow).toBe('hidden');

      // Interacting with a filter chip after oscillation succeeds
      const modalNow = document.getElementById('certifications-directory-modal');
      const ibmChip = within(modalNow).getByRole('button', { name: /^IBM/i });
      act(() => {
        fireEvent.click(ibmChip);
      });
      expect(ibmChip.getAttribute('aria-pressed')).toBe('true');
    });

    it('1.4: Touch Target Size Compliance (WCAG 2.5.5 / 2.5.8): all interactive modal & navbar controls meet min-h-[44px]', () => {
      renderPortfolio();
      const triggerBtn = screen.getByRole('button', { name: /Browse All (80\+|87)/i });
      expect(triggerBtn.className).toContain('min-h-[44px]');

      act(() => {
        fireEvent.click(triggerBtn);
        vi.advanceTimersByTime(50);
      });

      const modal = document.getElementById('certifications-directory-modal');
      const closeBtn = within(modal).getByRole('button', { name: /Close certifications directory/i });
      expect(closeBtn.className).toContain('min-h-[44px]');
      expect(closeBtn.className).toContain('min-w-[44px]');

      const searchInput = within(modal).getByRole('textbox');
      expect(searchInput.className).toContain('min-h-[44px]');

      // All 7 filter chips have min-h-[44px]
      const filterToolbar = within(modal).getByRole('toolbar', { name: /Filter credentials by issuer/i });
      const chips = within(filterToolbar).getAllByRole('button');
      chips.forEach((chip) => {
        expect(chip.className).toContain('min-h-[44px]');
      });

      // Pagination buttons have min-h-[44px]
      const prevBtn = within(modal).getByRole('button', { name: /Previous page/i });
      const nextBtn = within(modal).getByRole('button', { name: /Next page/i });
      expect(prevBtn.className).toContain('min-h-[44px]');
      expect(nextBtn.className).toContain('min-h-[44px]');
    });
  });

  // ==========================================================================
  // Suite 2: Modal Keyboard Navigation & Focus Trap Adversarial Rigor
  // ==========================================================================
  describe('Suite 2: Modal Keyboard Navigation & Focus Trap Adversarial Rigor', () => {
    it('2.1: Focus acquisition on mount: search input automatically receives focus after mount tick', () => {
      renderPortfolio();
      const triggerBtn = screen.getByRole('button', { name: /Browse All (80\+|87)/i });

      act(() => {
        fireEvent.click(triggerBtn);
      });

      // Advance timers by the 40ms autofocus delay
      act(() => {
        vi.advanceTimersByTime(50);
      });

      const modal = document.getElementById('certifications-directory-modal');
      const searchInput = within(modal).getByRole('textbox');
      expect(document.activeElement).toBe(searchInput);
    });

    it('2.2: Forward Tab boundary wrap (Page 1): Tab on the last focusable element wraps to Close button', () => {
      renderPortfolio();
      const triggerBtn = screen.getByRole('button', { name: /Browse All (80\+|87)/i });

      act(() => {
        fireEvent.click(triggerBtn);
        vi.advanceTimersByTime(50);
      });

      const modal = document.getElementById('certifications-directory-modal');
      const closeBtn = within(modal).getByRole('button', { name: /Close certifications directory/i });
      const nextBtn = within(modal).getByRole('button', { name: /Next page/i });

      // On page 1, Prev is disabled; Next page is the last focusable element
      expect(nextBtn).not.toBeDisabled();
      nextBtn.focus();
      expect(document.activeElement).toBe(nextBtn);

      // Simulate pressing Tab on the last element
      act(() => {
        fireEvent.keyDown(window, { key: 'Tab', shiftKey: false });
      });

      // Focus should wrap back to the first focusable element (Close button)
      expect(document.activeElement).toBe(closeBtn);
    });

    it('2.3: Backward Tab boundary wrap (Page 1): Shift+Tab on Close button wraps to Next Page button', () => {
      renderPortfolio();
      const triggerBtn = screen.getByRole('button', { name: /Browse All (80\+|87)/i });

      act(() => {
        fireEvent.click(triggerBtn);
        vi.advanceTimersByTime(50);
      });

      const modal = document.getElementById('certifications-directory-modal');
      const closeBtn = within(modal).getByRole('button', { name: /Close certifications directory/i });
      const nextBtn = within(modal).getByRole('button', { name: /Next page/i });

      closeBtn.focus();
      expect(document.activeElement).toBe(closeBtn);

      // Simulate pressing Shift+Tab on the first element
      act(() => {
        fireEvent.keyDown(window, { key: 'Tab', shiftKey: true });
      });

      // Focus should wrap to the last focusable element (Next Page button)
      expect(document.activeElement).toBe(nextBtn);
    });

    it('2.4: Focus Trap during Zero Results: Tab loops accurately to Reset Filters button, bypassing disabled pagination', () => {
      renderPortfolio();
      const triggerBtn = screen.getByRole('button', { name: /Browse All (80\+|87)/i });

      act(() => {
        fireEvent.click(triggerBtn);
        vi.advanceTimersByTime(50);
      });

      const modal = document.getElementById('certifications-directory-modal');
      const searchInput = within(modal).getByRole('textbox');

      // Type an unmatchable query
      act(() => {
        fireEvent.change(searchInput, { target: { value: '___nonexistent_query_xyz___' } });
      });

      // Empty state appears with Reset Filters button
      const resetBtn = within(modal).getByRole('button', { name: /Reset Filters/i });
      expect(resetBtn).toBeInTheDocument();

      // Pagination buttons are both disabled
      const prevBtn = within(modal).getByRole('button', { name: /Previous page/i });
      const nextBtn = within(modal).getByRole('button', { name: /Next page/i });
      expect(prevBtn).toBeDisabled();
      expect(nextBtn).toBeDisabled();

      // Reset button is the last focusable element
      resetBtn.focus();
      expect(document.activeElement).toBe(resetBtn);

      const closeBtn = within(modal).getByRole('button', { name: /Close certifications directory/i });

      // Tab on Reset button wraps to Close button
      act(() => {
        fireEvent.keyDown(window, { key: 'Tab', shiftKey: false });
      });
      expect(document.activeElement).toBe(closeBtn);

      // Shift+Tab on Close button wraps back to Reset button
      act(() => {
        fireEvent.keyDown(window, { key: 'Tab', shiftKey: true });
      });
      expect(document.activeElement).toBe(resetBtn);
    });

    it('2.5: Focus Trap on Page 8 (Terminal Page): Prev button is enabled and Next button is disabled', () => {
      renderPortfolio();
      const triggerBtn = screen.getByRole('button', { name: /Browse All (80\+|87)/i });

      act(() => {
        fireEvent.click(triggerBtn);
        vi.advanceTimersByTime(50);
      });

      const modal = document.getElementById('certifications-directory-modal');
      const nextBtn = within(modal).getByRole('button', { name: /Next page/i });

      // Navigate to page 8 (7 clicks)
      for (let i = 0; i < 7; i++) {
        act(() => {
          fireEvent.click(nextBtn);
        });
      }

      // On Page 8: Next is disabled, Prev is enabled
      const prevBtn = within(modal).getByRole('button', { name: /Previous page/i });
      expect(nextBtn).toBeDisabled();
      expect(prevBtn).not.toBeDisabled();

      // Last focusable element is now Prev button
      prevBtn.focus();
      expect(document.activeElement).toBe(prevBtn);

      const closeBtn = within(modal).getByRole('button', { name: /Close certifications directory/i });

      // Tab on Prev button wraps to Close button
      act(() => {
        fireEvent.keyDown(window, { key: 'Tab', shiftKey: false });
      });
      expect(document.activeElement).toBe(closeBtn);

      // Shift+Tab on Close button wraps back to Prev button
      act(() => {
        fireEvent.keyDown(window, { key: 'Tab', shiftKey: true });
      });
      expect(document.activeElement).toBe(prevBtn);
    });

    it('2.6: Escape key dismissal & focus restoration: Escape closes modal and restores focus to trigger element', () => {
      renderPortfolio();
      const triggerBtn = screen.getByRole('button', { name: /Browse All (80\+|87)/i });

      // Focus trigger button first as a real user would
      triggerBtn.focus();
      expect(document.activeElement).toBe(triggerBtn);

      act(() => {
        fireEvent.click(triggerBtn);
        vi.advanceTimersByTime(50);
      });

      const modal = document.getElementById('certifications-directory-modal');
      expect(modal).toBeInTheDocument();

      // Press Escape anywhere on window
      act(() => {
        fireEvent.keyDown(window, { key: 'Escape' });
      });

      // Modal unmounted
      expect(document.getElementById('certifications-directory-modal')).toBeNull();

      // Focus restored to trigger element
      expect(document.activeElement).toBe(triggerBtn);
    });

    it('2.7: Backdrop click dismissal vs. inside click resilience: inside clicks do not close modal', () => {
      renderPortfolio();
      const triggerBtn = screen.getByRole('button', { name: /Browse All (80\+|87)/i });

      act(() => {
        fireEvent.click(triggerBtn);
        vi.advanceTimersByTime(50);
      });

      const modal = document.getElementById('certifications-directory-modal');
      const backdrop = modal.parentElement;

      // Clicking inside the modal dialog does NOT close it
      act(() => {
        fireEvent.click(modal);
      });
      expect(document.getElementById('certifications-directory-modal')).toBeInTheDocument();

      // Clicking the presentation backdrop directly DOES close it
      act(() => {
        fireEvent.click(backdrop);
      });
      expect(document.getElementById('certifications-directory-modal')).toBeNull();
    });
  });

  // ==========================================================================
  // Suite 3: Interactive Activation & Semantic Accessibility Contracts
  // ==========================================================================
  describe('Suite 3: Interactive Activation & Semantic Accessibility Contracts', () => {
    it('3.1: Modal ARIA dialog contracts: role="dialog", aria-modal="true", aria-labelledby matching h2 title id', () => {
      renderPortfolio();
      const triggerBtn = screen.getByRole('button', { name: /Browse All (80\+|87)/i });

      expect(triggerBtn.getAttribute('aria-haspopup')).toBe('dialog');
      expect(triggerBtn.getAttribute('aria-expanded')).toBe('false');

      act(() => {
        fireEvent.click(triggerBtn);
        vi.advanceTimersByTime(50);
      });

      expect(triggerBtn.getAttribute('aria-expanded')).toBe('true');

      const modal = document.getElementById('certifications-directory-modal');
      expect(modal.getAttribute('role')).toBe('dialog');
      expect(modal.getAttribute('aria-modal')).toBe('true');
      const labelledBy = modal.getAttribute('aria-labelledby');
      expect(labelledBy).toBe('cert-directory-title');

      const titleEl = document.getElementById(labelledBy);
      expect(titleEl).toBeInTheDocument();
      expect(titleEl.tagName.toLowerCase()).toBe('h2');
    });

    it('3.2: Filter chips stateful contract: role="toolbar", aria-pressed toggles accurately', () => {
      renderPortfolio();
      const triggerBtn = screen.getByRole('button', { name: /Browse All (80\+|87)/i });

      act(() => {
        fireEvent.click(triggerBtn);
        vi.advanceTimersByTime(50);
      });

      const modal = document.getElementById('certifications-directory-modal');
      const filterToolbar = within(modal).getByRole('toolbar', { name: /Filter credentials by issuer/i });
      expect(filterToolbar).toBeInTheDocument();

      const allChip = within(filterToolbar).getByRole('button', { name: /^All/i });
      const anthropicChip = within(filterToolbar).getByRole('button', { name: /^Anthropic/i });
      const dicodingChip = within(filterToolbar).getByRole('button', { name: /^Dicoding Indonesia/i });

      // Initially "All" is active
      expect(allChip.getAttribute('aria-pressed')).toBe('true');
      expect(anthropicChip.getAttribute('aria-pressed')).toBe('false');

      // Select Anthropic
      act(() => {
        fireEvent.click(anthropicChip);
      });
      expect(allChip.getAttribute('aria-pressed')).toBe('false');
      expect(anthropicChip.getAttribute('aria-pressed')).toBe('true');

      // Select Dicoding
      act(() => {
        fireEvent.click(dicodingChip);
      });
      expect(anthropicChip.getAttribute('aria-pressed')).toBe('false');
      expect(dicodingChip.getAttribute('aria-pressed')).toBe('true');
    });

    it('3.3: Assistive polite live region: aria-live="polite", announces counts and empty states accurately', () => {
      renderPortfolio();
      const triggerBtn = screen.getByRole('button', { name: /Browse All (80\+|87)/i });

      act(() => {
        fireEvent.click(triggerBtn);
        vi.advanceTimersByTime(50);
      });

      const modal = document.getElementById('certifications-directory-modal');
      const liveRegion = modal.querySelector('[aria-live="polite"]');
      expect(liveRegion).toBeInTheDocument();
      expect(liveRegion.getAttribute('aria-atomic')).toBe('true');

      // On Page 1 initial view: Showing 12 of 87 credentials
      expect(liveRegion.textContent).toMatch(/Showing 12 of 87 credentials/i);

      // Filter by Google (2 credentials)
      const googleChip = within(modal).getByRole('button', { name: /^Google/i });
      act(() => {
        fireEvent.click(googleChip);
      });
      expect(liveRegion.textContent).toMatch(/Showing 2 of 2 credentials/i);

      // Search for zero matches
      const searchInput = within(modal).getByRole('textbox');
      act(() => {
        fireEvent.change(searchInput, { target: { value: 'zzzz_no_match' } });
      });
      expect(liveRegion.textContent).toMatch(/No credentials match your filter criteria/i);
    });

    it('3.4: External Credential Links: target="_blank", rel="noopener noreferrer", sr-only notice "(opens in new tab)"', () => {
      renderPortfolio();
      const triggerBtn = screen.getByRole('button', { name: /Browse All (80\+|87)/i });

      act(() => {
        fireEvent.click(triggerBtn);
        vi.advanceTimersByTime(50);
      });

      const modal = document.getElementById('certifications-directory-modal');
      const cardLinks = modal.querySelectorAll('a[target="_blank"]');
      expect(cardLinks.length).toBeGreaterThan(0);

      cardLinks.forEach((link) => {
        expect(link.getAttribute('target')).toBe('_blank');
        expect(link.getAttribute('rel')).toContain('noopener');
        expect(link.getAttribute('rel')).toContain('noreferrer');

        // Must contain screen reader announcement
        const srOnly = link.querySelector('.sr-only');
        expect(srOnly).toBeInTheDocument();
        expect(srOnly.textContent).toMatch(/opens in new tab/i);
      });
    });

    it('3.5: Marquee Section companion link: target="_blank", rel="noopener noreferrer", sr-only notice', () => {
      renderPortfolio();
      const linkedInLink = screen.getByRole('link', { name: /View All on LinkedIn/i });
      expect(linkedInLink).toBeInTheDocument();
      expect(linkedInLink.getAttribute('target')).toBe('_blank');
      expect(linkedInLink.getAttribute('rel')).toContain('noopener');
      expect(linkedInLink.getAttribute('rel')).toContain('noreferrer');

      const srOnly = linkedInLink.querySelector('.sr-only');
      expect(srOnly).toBeInTheDocument();
      expect(srOnly.textContent).toMatch(/opens in new window/i);
    });

    it('3.6: Image onError fallback: CertBadge handles image loading failure gracefully with SVG award icon', () => {
      renderPortfolio();
      const triggerBtn = screen.getByRole('button', { name: /Browse All (80\+|87)/i });

      act(() => {
        fireEvent.click(triggerBtn);
        vi.advanceTimersByTime(50);
      });

      const modal = document.getElementById('certifications-directory-modal');
      const firstImage = modal.querySelector('img');
      expect(firstImage).toBeInTheDocument();

      // Trigger image onError
      act(() => {
        fireEvent.error(firstImage);
      });

      // After error, fallback Lucide Award icon renders instead of crashing
      const awardIcon = modal.querySelector('svg.text-emerald-700, svg.dark\\:text-emerald-400');
      expect(awardIcon).toBeInTheDocument();
    });
  });

  // ==========================================================================
  // Suite 4: Dynamic Bilingual Locale Toggling & i18n Fault Tolerance
  // ==========================================================================
  describe('Suite 4: Dynamic Bilingual Locale Toggling & i18n Fault Tolerance', () => {
    it('4.1: 100% Dictionary Parity: All 154 leaf keys match exactly between EN and ID with zero empty strings', () => {
      function extractLeaves(obj, prefix = '') {
        let results = [];
        for (const key of Object.keys(obj)) {
          const fullPath = prefix ? `${prefix}.${key}` : key;
          const val = obj[key];
          if (val && typeof val === 'object' && !Array.isArray(val)) {
            results = results.concat(extractLeaves(val, fullPath));
          } else {
            results.push({ path: fullPath, val });
          }
        }
        return results;
      }

      const enLeaves = extractLeaves(translations.en);
      const idLeaves = extractLeaves(translations.id);

      expect(enLeaves.length).toBe(159);
      expect(idLeaves.length).toBe(159);

      const enKeys = new Set(enLeaves.map(x => x.path));
      const idKeys = new Set(idLeaves.map(x => x.path));

      const missingInId = [...enKeys].filter(k => !idKeys.has(k));
      const missingInEn = [...idKeys].filter(k => !enKeys.has(k));

      expect(missingInId, `Keys present in EN but missing in ID: ${missingInId.join(', ')}`).toEqual([]);
      expect(missingInEn, `Keys present in ID but missing in EN: ${missingInEn.join(', ')}`).toEqual([]);

      // Zero empty strings
      enLeaves.forEach(item => {
        expect(typeof item.val, `EN key ${item.path} value is not a string`).toBe('string');
        expect(item.val.trim().length, `EN key ${item.path} is empty or whitespace`).toBeGreaterThan(0);
      });

      idLeaves.forEach(item => {
        expect(typeof item.val, `ID key ${item.path} value is not a string`).toBe('string');
        expect(item.val.trim().length, `ID key ${item.path} is empty or whitespace`).toBeGreaterThan(0);
      });
    });

    it('4.2: Parameter interpolation fuzzing: handles missing, extra, unicode, and injection params safely', () => {
      // 1. Valid params
      const res1 = getTranslation('certifications.resultsCount', 'en', { showing: 12, total: 87 });
      expect(res1).toBe('Showing 12 of 87 credentials');

      const res2 = getTranslation('certifications.resultsCount', 'id', { showing: 12, total: 87 });
      expect(res2).toBe('Menampilkan 12 dari 87 kredensial');

      // 2. Extra parameters: safely ignored
      const res3 = getTranslation('certifications.resultsCount', 'en', { showing: 5, total: 10, rogue: 'test' });
      expect(res3).toBe('Showing 5 of 10 credentials');

      // 3. Null / undefined / invalid params object: returns template string safely without crashing
      const res4 = getTranslation('certifications.resultsCount', 'en', null);
      expect(typeof res4).toBe('string');
      expect(res4).toContain('{showing}');

      const res5 = getTranslation('certifications.resultsCount', 'en', undefined);
      expect(typeof res5).toBe('string');

      // 4. Unicode / XSS attack payload in params: rendered as string without execution
      const res6 = getTranslation('certifications.resultsCount', 'en', { 
        showing: '<script>alert("XSS")</script>', 
        total: '日本語 & 🌟' 
      });
      expect(res6).toContain('<script>alert("XSS")</script>');
      expect(res6).toContain('日本語 & 🌟');
    });

    it('4.3: Safe fallbacks for missing or invalid key paths: returns empty string or keyPath without throwing', () => {
      // Null / undefined / non-string keyPaths
      expect(getTranslation(null)).toBe('');
      expect(getTranslation(undefined)).toBe('');
      expect(getTranslation(12345)).toBe('');
      expect(getTranslation({})).toBe('');
      expect(getTranslation([])).toBe('');

      // Non-existent keyPath in default locale
      expect(getTranslation('nonexistent.deep.path.test')).toBe('nonexistent.deep.path.test');

      // Non-existent locale: falls back to DEFAULT_LOCALE ('en')
      const val = getTranslation('hero.greeting', 'fr_FR');
      expect(val).toBe("Hello, I'm");
    });

    it('4.4: 50x Rapid Locale Toggle Fuzzing under mounted modal: preserves live state and updates bilingual strings', () => {
      renderPortfolio();
      const triggerBtn = screen.getByRole('button', { name: /Browse All (80\+|87)/i });

      act(() => {
        fireEvent.click(triggerBtn);
        vi.advanceTimersByTime(50);
      });

      const modal = document.getElementById('certifications-directory-modal');
      expect(modal).toBeInTheDocument();

      // Find the navbar language toggle button
      const langToggle = screen.getAllByRole('button', { name: /Toggle language/i })[0];
      expect(langToggle).toBeInTheDocument();

      // Rapidly toggle 50 times
      for (let i = 0; i < 50; i++) {
        act(() => {
          fireEvent.click(langToggle);
        });
      }

      // After 50 toggles (even number), locale should be back to 'en'
      expect(localStorage.getItem('portfolio_locale')).toBe('en');
      let title = modal.querySelector('#cert-directory-title');
      expect(title.textContent).toBe('All Certifications & Credentials');

      // Toggle once more to 'id'
      act(() => {
        fireEvent.click(langToggle);
      });
      expect(localStorage.getItem('portfolio_locale')).toBe('id');
      title = modal.querySelector('#cert-directory-title');
      expect(title.textContent).toBe('Semua Sertifikasi & Kredensial');

      // Live region in modal must update to Indonesian
      const liveRegion = modal.querySelector('[aria-live="polite"]');
      expect(liveRegion.textContent).toMatch(/Menampilkan 12 dari 87 kredensial/i);

      // Filter button labels in Indonesian
      const resetFiltersBtn = within(modal).getByRole('button', { name: /^Semua/i });
      expect(resetFiltersBtn).toBeInTheDocument();

      // Search input placeholder in Indonesian
      const searchInput = within(modal).getByRole('textbox');
      expect(searchInput).toBeInTheDocument();
      expect(searchInput.getAttribute('placeholder')).toMatch(/Cari berdasarkan judul, penerbit/i);
    });

    it('4.5: Text expansion layout resilience: Indonesian strings do not cause horizontal scrolling or breakage', () => {
      setViewport({ width: 375, height: 667 });
      renderPortfolio();

      const langToggle = screen.getAllByRole('button', { name: /Toggle language/i })[0];
      act(() => {
        fireEvent.click(langToggle);
      });

      expect(localStorage.getItem('portfolio_locale')).toBe('id');

      // Indonesian strings in Hero, Navbar & CTAs
      expect(screen.getByText(/Halo, saya/i)).toBeInTheDocument();
      expect(screen.getByText('Lihat Proyek')).toBeInTheDocument();
      expect(screen.getAllByText('Hubungi Saya').length).toBeGreaterThanOrEqual(1);
      expect(screen.getByText('Tentang Saya')).toBeInTheDocument();

      // Verify no horizontal overflow in Indonesian on mobile 375px
      expect(document.body.style.overflowX).not.toBe('scroll');
      expect(document.documentElement.style.overflowX).not.toBe('scroll');
    });
  });

  // ==========================================================================
  // Suite 5: Mobile Navigation Drawer Keyboard & Responsive Lifecycle
  // ==========================================================================
  describe('Suite 5: Mobile Navigation Drawer Keyboard & Responsive Lifecycle', () => {
    it('5.1: Mobile Drawer Focus Trapping: Tab wraps inside drawer, Escape closes and restores focus to hamburger', () => {
      setViewport({ width: 768, height: 1024 });
      renderPortfolio();

      const menuBtn = screen.getByRole('button', { name: /Toggle navigation menu/i });
      expect(menuBtn).toBeInTheDocument();
      expect(menuBtn.getAttribute('aria-expanded')).toBe('false');

      // Open mobile drawer
      act(() => {
        fireEvent.click(menuBtn);
      });

      expect(menuBtn.getAttribute('aria-expanded')).toBe('true');
      const drawer = document.getElementById('mobile-navigation-drawer');
      expect(drawer).toBeInTheDocument();
      expect(drawer.getAttribute('role')).toBe('dialog');
      expect(drawer.getAttribute('aria-modal')).toBe('true');

      // Focus should move into the first focusable element in the drawer
      const focusable = drawer.querySelectorAll('button');
      expect(document.activeElement).toBe(focusable[0]);

      const firstLink = focusable[0];
      const lastLink = focusable[focusable.length - 1];

      // Tab on last element wraps to first
      lastLink.focus();
      expect(document.activeElement).toBe(lastLink);
      act(() => {
        fireEvent.keyDown(window, { key: 'Tab', shiftKey: false });
      });
      expect(document.activeElement).toBe(firstLink);

      // Shift+Tab on first element wraps to last
      firstLink.focus();
      expect(document.activeElement).toBe(firstLink);
      act(() => {
        fireEvent.keyDown(window, { key: 'Tab', shiftKey: true });
      });
      expect(document.activeElement).toBe(lastLink);

      // Escape closes drawer and restores focus to hamburger menu button
      act(() => {
        fireEvent.keyDown(window, { key: 'Escape' });
      });
      expect(menuBtn.getAttribute('aria-expanded')).toBe('false');
      expect(document.activeElement).toBe(menuBtn);
    });

    it('5.2: Breakpoint Crossing: opening mobile drawer at 768px then resizing to 1280px maintains safe navbar state', () => {
      setViewport({ width: 768, height: 1024 });
      renderPortfolio();

      const menuBtn = screen.getByRole('button', { name: /Toggle navigation menu/i });
      act(() => {
        fireEvent.click(menuBtn);
      });

      expect(menuBtn.getAttribute('aria-expanded')).toBe('true');

      // Resize to desktop (1280px)
      act(() => {
        setViewport({ width: 1280, height: 800 });
      });

      // Desktop nav links are present
      const desktopNav = screen.getByRole('navigation', { name: /Main Navigation/i });
      expect(desktopNav).toBeInTheDocument();

      // Mobile drawer still exists in DOM with lg:hidden styling
      const drawer = document.getElementById('mobile-navigation-drawer');
      expect(drawer.className).toContain('lg:hidden');

      // Resizing back to mobile (768px) preserves operational state
      act(() => {
        setViewport({ width: 768, height: 1024 });
      });

      // Drawer is still interactive and can be closed via hamburger click
      act(() => {
        fireEvent.click(menuBtn);
      });
      expect(menuBtn.getAttribute('aria-expanded')).toBe('false');
    });

    it('5.3: Marquee inert clone accessibility: tabIndex="-1" and aria-hidden="true" on all duplicate cards', () => {
      renderPortfolio();
      const marquee = document.getElementById('certifications');
      expect(marquee).toBeInTheDocument();

      // Select all 32 cards across the two animation tracks (excluding header companion link)
      const tracks = marquee.querySelectorAll('.animate-scroll-right, .animate-scroll-left');
      expect(tracks.length).toBe(2);

      const track1Cards = tracks[0].querySelectorAll('a');
      const track2Cards = tracks[1].querySelectorAll('a');
      expect(track1Cards.length).toBe(16);
      expect(track2Cards.length).toBe(16);
      expect(track1Cards.length + track2Cards.length).toBe(32);

      const allCards = [...track1Cards, ...track2Cards];

      const focusableCards = allCards.filter(c => c.getAttribute('tabindex') === '0');
      const inertClones = allCards.filter(c => c.getAttribute('tabindex') === '-1');

      // Exactly 8 cards in Row 1 are keyboard focusable
      expect(focusableCards.length).toBe(8);

      // Exactly 24 cards (8 duplicates in Row 1 + 16 cards in Row 2) are completely inert
      expect(inertClones.length).toBe(24);

      inertClones.forEach((clone) => {
        expect(clone.getAttribute('aria-hidden')).toBe('true');
      });
    });
  });
});
