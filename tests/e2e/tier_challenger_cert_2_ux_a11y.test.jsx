/**
 * Challenger 2: Adversarial UX, Mobile Viewport & Screen-Reader Stress Suite
 *
 * Multi-Persona & Multi-Skill Fusion:
 * - agency-accessibility-auditor: WCAG 2.1 AA criteria, POUR principles, focus traps, aria-live, screen reader notices
 * - agency-reality-checker: Rigorous empirical proof, zero fantasy approvals, multi-device viewport verification
 * - antislop-layoutmobile: 320px-1920px responsiveness, zero horizontal overflow, 44px tap targets, modal reflow
 * - antislop-human: Accessible names, keyboard navigation, focus restoration, reverse tabnabbing defense
 * - fixing-accessibility: Targeted verification of dialog role, aria-modal, polite live regions, and semantic links
 * - verify-and-stop: Precise assertions verifying exact acceptance criteria
 *
 * Scope:
 * Suite 1: Viewport & Responsive Layout Stress-Testing (320px, 375px, 768px, 1024px, 1920px)
 * Suite 2: Touch Target Sizing & Spacing Stress-Testing (>= 44px min-h on all interactive elements)
 * Suite 3: Keyboard Navigation & Focus Trap Resilience (Tab wrap, Shift+Tab wrap, Escape, focus restore)
 * Suite 4: Assistive Technology & Dynamic Polite Live Region Resilience (aria-live="polite", aria-atomic="true")
 * Suite 5: External Credential Link Security & Screen-Reader Disclosures (target, rel, sr-only notices)
 * Suite 6: Bilingual i18n Assistive Text Parity (en and id translations and placeholders)
 */

import React from 'react';
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { screen, within, fireEvent, act, render } from '@testing-library/react';
import { renderPortfolio, resetTestEnvironment, setViewport } from './harness';
import { CERTIFICATIONS } from '../../src/data/constants';
import { CertificationsDirectoryModal } from '../../src/components/ui/CertificationsDirectoryModal';
import { I18nProvider } from '../../src/lib/i18n';

describe('Challenger 2: Adversarial UX, Mobile Viewport & Screen-Reader Stress Suite', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    resetTestEnvironment();
  });

  afterEach(() => {
    vi.useRealTimers();
    resetTestEnvironment();
  });

  // ==========================================================================
  // Suite 1: Viewport & Responsive Layout Stress-Testing (320px, 375px, 768px, 1024px, 1920px)
  // ==========================================================================
  describe('Suite 1: Viewport & Responsive Layout Stress-Testing', () => {
    const viewports = [
      { name: '320px (iPhone SE small)', width: 320, height: 568 },
      { name: '375px (Standard mobile)', width: 375, height: 667 },
      { name: '768px (Tablet portrait)', width: 768, height: 1024 },
      { name: '1024px (Desktop)', width: 1024, height: 768 },
      { name: '1920px (Wide desktop)', width: 1920, height: 1080 }
    ];

    viewports.forEach(({ name, width, height }) => {
      it(`1.1 [${name}]: renders modal and underlying page with zero horizontal scroll overflow`, () => {
        setViewport({ width, height });
        renderPortfolio();

        const triggerBtn = screen.getByRole('button', { name: /Browse All (80\+|87)/i });
        expect(triggerBtn).toBeInTheDocument();

        // Open modal
        act(() => {
          fireEvent.click(triggerBtn);
          vi.advanceTimersByTime(50);
        });

        const modal = document.getElementById('certifications-directory-modal');
        expect(modal).toBeInTheDocument();

        // Verify root and body style constraints
        expect(document.body.style.overflowX).not.toBe('scroll');
        expect(document.documentElement.style.overflowX).not.toBe('scroll');

        // Modal container must use max-w-5xl, w-full, and responsive padding
        const presentation = modal.parentElement;
        expect(presentation.className).toContain('fixed');
        expect(presentation.className).toContain('inset-0');
        expect(presentation.className).toContain('p-3');
        expect(presentation.className).toContain('sm:p-6');
        expect(modal.className).toContain('max-w-5xl');
        expect(modal.className).toContain('w-full');
        expect(modal.className).toContain('max-h-[92vh]');

        // Verify scrollable body container
        const scrollBody = modal.querySelector('.overflow-y-auto');
        expect(scrollBody).toBeInTheDocument();
      });
    });

    it('1.2: Grid reflows correctly across breakpoints: 1 col on mobile, 2 col on tablet, 3 col on desktop', () => {
      renderPortfolio();
      const triggerBtn = screen.getByRole('button', { name: /Browse All (80\+|87)/i });

      act(() => {
        fireEvent.click(triggerBtn);
        vi.advanceTimersByTime(50);
      });

      const modal = document.getElementById('certifications-directory-modal');
      const grid = modal.querySelector('.grid');
      expect(grid).toBeInTheDocument();

      // Enforces responsive grid classes
      expect(grid.className).toContain('grid-cols-1');
      expect(grid.className).toContain('sm:grid-cols-2');
      expect(grid.className).toContain('lg:grid-cols-3');
    });

    it('1.3: Body scroll lock is activated when modal opens and restored when modal closes', () => {
      renderPortfolio();
      expect(document.body.style.overflow).toBe('');

      const triggerBtn = screen.getByRole('button', { name: /Browse All (80\+|87)/i });
      act(() => {
        fireEvent.click(triggerBtn);
        vi.advanceTimersByTime(50);
      });

      expect(document.body.style.overflow).toBe('hidden');

      // Close modal via close button
      const modal = document.getElementById('certifications-directory-modal');
      const closeBtn = within(modal).getByRole('button', { name: /Close certifications directory/i });

      act(() => {
        fireEvent.click(closeBtn);
      });

      expect(document.body.style.overflow).toBe('');
      expect(document.getElementById('certifications-directory-modal')).toBeNull();
    });

    it('1.4: Dynamic viewport resize while modal is open does not crash or unmount dialog', () => {
      setViewport({ width: 320, height: 568 });
      renderPortfolio();

      const triggerBtn = screen.getByRole('button', { name: /Browse All (80\+|87)/i });
      act(() => {
        fireEvent.click(triggerBtn);
        vi.advanceTimersByTime(50);
      });

      expect(document.getElementById('certifications-directory-modal')).toBeInTheDocument();

      // Resize dynamically across viewports
      [375, 768, 1024, 1920, 320].forEach(w => {
        act(() => {
          setViewport({ width: w, height: 800 });
        });
        expect(document.getElementById('certifications-directory-modal')).toBeInTheDocument();
      });
    });
  });

  // ==========================================================================
  // Suite 2: Touch Target Sizing & Spacing Stress-Testing (>= 44px min-h)
  // ==========================================================================
  describe('Suite 2: Touch Target Sizing & Spacing Stress-Testing', () => {
    it('2.1: MarqueeSection Browse All trigger button satisfies >= 44px min-height', () => {
      renderPortfolio();
      const triggerBtn = screen.getByRole('button', { name: /Browse All (80\+|87)/i });
      expect(triggerBtn.className).toContain('min-h-[44px]');
    });

    it('2.2: Modal header close button satisfies >= 44x44px touch target', () => {
      renderPortfolio();
      const triggerBtn = screen.getByRole('button', { name: /Browse All (80\+|87)/i });

      act(() => {
        fireEvent.click(triggerBtn);
        vi.advanceTimersByTime(50);
      });

      const modal = document.getElementById('certifications-directory-modal');
      const closeBtn = within(modal).getByRole('button', { name: /Close certifications directory/i });
      expect(closeBtn.className).toContain('min-h-[44px]');
      expect(closeBtn.className).toContain('min-w-[44px]');
    });

    it('2.3: Search input satisfies >= 44px touch target', () => {
      renderPortfolio();
      const triggerBtn = screen.getByRole('button', { name: /Browse All (80\+|87)/i });

      act(() => {
        fireEvent.click(triggerBtn);
        vi.advanceTimersByTime(50);
      });

      const modal = document.getElementById('certifications-directory-modal');
      const searchInput = within(modal).getByRole('textbox');
      expect(searchInput.className).toContain('min-h-[44px]');
    });

    it('2.4: All 7 provider filter chips satisfy >= 44px touch target', () => {
      renderPortfolio();
      const triggerBtn = screen.getByRole('button', { name: /Browse All (80\+|87)/i });

      act(() => {
        fireEvent.click(triggerBtn);
        vi.advanceTimersByTime(50);
      });

      const modal = document.getElementById('certifications-directory-modal');
      const toolbar = modal.querySelector('div[role="toolbar"]');
      const chips = toolbar.querySelectorAll('button');
      expect(chips.length).toBe(7);

      chips.forEach((chip, i) => {
        expect(chip.className, `Filter chip #${i} (${chip.textContent}) missing min-h-[44px]`).toContain('min-h-[44px]');
      });
    });

    it('2.5: Pagination controls satisfy >= 44px touch target', () => {
      renderPortfolio();
      const triggerBtn = screen.getByRole('button', { name: /Browse All (80\+|87)/i });

      act(() => {
        fireEvent.click(triggerBtn);
        vi.advanceTimersByTime(50);
      });

      const modal = document.getElementById('certifications-directory-modal');
      const prevBtn = within(modal).getByRole('button', { name: /Previous page/i });
      const nextBtn = within(modal).getByRole('button', { name: /Next page/i });

      expect(prevBtn.className).toContain('min-h-[44px]');
      expect(nextBtn.className).toContain('min-h-[44px]');
    });

    it('2.6: Empty state "Reset Filters" button satisfies >= 44px touch target', () => {
      renderPortfolio();
      const triggerBtn = screen.getByRole('button', { name: /Browse All (80\+|87)/i });

      act(() => {
        fireEvent.click(triggerBtn);
        vi.advanceTimersByTime(50);
      });

      const modal = document.getElementById('certifications-directory-modal');
      const searchInput = within(modal).getByRole('textbox');

      act(() => {
        fireEvent.change(searchInput, { target: { value: 'nonexistent_credential_test_target_query' } });
      });

      const resetBtn = within(modal).getByRole('button', { name: /Reset Filters/i });
      expect(resetBtn).toBeInTheDocument();
      expect(resetBtn.className).toContain('min-h-[44px]');
    });

    it('2.7: All 12 certification cards are accessible blocks with external link security', () => {
      renderPortfolio();
      const triggerBtn = screen.getByRole('button', { name: /Browse All (80\+|87)/i });

      act(() => {
        fireEvent.click(triggerBtn);
        vi.advanceTimersByTime(50);
      });

      const modal = document.getElementById('certifications-directory-modal');
      const cards = within(modal).getAllByRole('link');
      expect(cards.length).toBe(12);

      cards.forEach((card, i) => {
        expect(card.getAttribute('target'), `Card #${i} missing target="_blank"`).toBe('_blank');
        expect(card.getAttribute('rel'), `Card #${i} missing rel="noopener noreferrer"`).toBe('noopener noreferrer');
        expect(card.className).toContain('block');
        expect(card.className).toContain('cursor-pointer');
      });
    });
  });

  // ==========================================================================
  // Suite 3: Keyboard Navigation & Focus Trap Resilience
  // ==========================================================================
  describe('Suite 3: Keyboard Navigation & Focus Trap Resilience', () => {
    it('3.1: Modal auto-focuses search input on mount within 40ms timer', () => {
      renderPortfolio();
      const triggerBtn = screen.getByRole('button', { name: /Browse All (80\+|87)/i });

      act(() => {
        fireEvent.click(triggerBtn);
      });

      const modal = document.getElementById('certifications-directory-modal');
      const searchInput = within(modal).getByRole('textbox');

      act(() => {
        vi.advanceTimersByTime(40);
      });

      expect(document.activeElement).toBe(searchInput);
    });

    it('3.2: Forward Tab wraps from last focusable element to first focusable element', () => {
      renderPortfolio();
      const triggerBtn = screen.getByRole('button', { name: /Browse All (80\+|87)/i });

      act(() => {
        fireEvent.click(triggerBtn);
        vi.advanceTimersByTime(50);
      });

      const modal = document.getElementById('certifications-directory-modal');
      const focusable = modal.querySelectorAll(
        'button:not([disabled]), [href], input:not([disabled]), [tabindex]:not([tabindex="-1"])'
      );
      const firstEl = focusable[0];
      const lastEl = focusable[focusable.length - 1];

      // Focus last element
      lastEl.focus();
      expect(document.activeElement).toBe(lastEl);

      // Simulate Tab key on window
      act(() => {
        const tabEvent = new KeyboardEvent('keydown', { key: 'Tab', bubbles: true, cancelable: true });
        window.dispatchEvent(tabEvent);
      });

      expect(document.activeElement).toBe(firstEl);
    });

    it('3.3: Backward Shift+Tab wraps from first focusable element to last focusable element', () => {
      renderPortfolio();
      const triggerBtn = screen.getByRole('button', { name: /Browse All (80\+|87)/i });

      act(() => {
        fireEvent.click(triggerBtn);
        vi.advanceTimersByTime(50);
      });

      const modal = document.getElementById('certifications-directory-modal');
      const focusable = modal.querySelectorAll(
        'button:not([disabled]), [href], input:not([disabled]), [tabindex]:not([tabindex="-1"])'
      );
      const firstEl = focusable[0];
      const lastEl = focusable[focusable.length - 1];

      // Focus first element
      firstEl.focus();
      expect(document.activeElement).toBe(firstEl);

      // Simulate Shift+Tab key on window
      act(() => {
        const shiftTabEvent = new KeyboardEvent('keydown', { key: 'Tab', shiftKey: true, bubbles: true, cancelable: true });
        window.dispatchEvent(shiftTabEvent);
      });

      expect(document.activeElement).toBe(lastEl);
    });

    it('3.4: Escape key closes modal and unmounts it from the DOM', () => {
      renderPortfolio();
      const triggerBtn = screen.getByRole('button', { name: /Browse All (80\+|87)/i });

      act(() => {
        fireEvent.click(triggerBtn);
        vi.advanceTimersByTime(50);
      });

      expect(document.getElementById('certifications-directory-modal')).toBeInTheDocument();

      act(() => {
        const escEvent = new KeyboardEvent('keydown', { key: 'Escape', bubbles: true, cancelable: true });
        window.dispatchEvent(escEvent);
      });

      expect(document.getElementById('certifications-directory-modal')).toBeNull();
    });

    it('3.5: Closing modal via Escape restores focus to the trigger button', () => {
      renderPortfolio();
      const triggerBtn = screen.getByRole('button', { name: /Browse All (80\+|87)/i });
      triggerBtn.focus();

      act(() => {
        fireEvent.click(triggerBtn);
        vi.advanceTimersByTime(50);
      });

      act(() => {
        const escEvent = new KeyboardEvent('keydown', { key: 'Escape', bubbles: true, cancelable: true });
        window.dispatchEvent(escEvent);
      });

      expect(document.activeElement).toBe(triggerBtn);
    });

    it('3.6: Closing modal via Close button ("✕") restores focus to the trigger button', () => {
      renderPortfolio();
      const triggerBtn = screen.getByRole('button', { name: /Browse All (80\+|87)/i });
      triggerBtn.focus();

      act(() => {
        fireEvent.click(triggerBtn);
        vi.advanceTimersByTime(50);
      });

      const modal = document.getElementById('certifications-directory-modal');
      const closeBtn = within(modal).getByRole('button', { name: /Close certifications directory/i });

      act(() => {
        fireEvent.click(closeBtn);
      });

      expect(document.activeElement).toBe(triggerBtn);
    });

    it('3.7: Backdrop click outside dialog content triggers dismissal and unmounts modal', () => {
      renderPortfolio();
      const triggerBtn = screen.getByRole('button', { name: /Browse All (80\+|87)/i });

      act(() => {
        fireEvent.click(triggerBtn);
        vi.advanceTimersByTime(50);
      });

      const presentation = document.querySelector('[role="presentation"]');
      expect(presentation).toBeInTheDocument();

      act(() => {
        fireEvent.click(presentation);
      });

      expect(document.getElementById('certifications-directory-modal')).toBeNull();
    });
  });

  // ==========================================================================
  // Suite 4: Assistive Technology & Dynamic Polite Live Region Resilience
  // ==========================================================================
  describe('Suite 4: Assistive Technology & Dynamic Polite Live Region Resilience', () => {
    it('4.1: Dialog root implements WCAG 2.1 AA dialog semantics', () => {
      renderPortfolio();
      const triggerBtn = screen.getByRole('button', { name: /Browse All (80\+|87)/i });

      act(() => {
        fireEvent.click(triggerBtn);
        vi.advanceTimersByTime(50);
      });

      const modal = document.getElementById('certifications-directory-modal');
      expect(modal.getAttribute('role')).toBe('dialog');
      expect(modal.getAttribute('aria-modal')).toBe('true');
      expect(modal.getAttribute('aria-labelledby')).toBe('cert-directory-title');

      const title = document.getElementById('cert-directory-title');
      expect(title).toBeInTheDocument();
      expect(title.textContent).toMatch(/Certifications/i);
    });

    it('4.2: Filter toolbar implements role="toolbar" and aria-label', () => {
      renderPortfolio();
      const triggerBtn = screen.getByRole('button', { name: /Browse All (80\+|87)/i });

      act(() => {
        fireEvent.click(triggerBtn);
        vi.advanceTimersByTime(50);
      });

      const modal = document.getElementById('certifications-directory-modal');
      const toolbar = within(modal).getByRole('toolbar', { name: /Filter credentials by issuer/i });
      expect(toolbar).toBeInTheDocument();
    });

    it('4.3: aria-live="polite" live region dynamically announces search and filter results', () => {
      renderPortfolio();
      const triggerBtn = screen.getByRole('button', { name: /Browse All (80\+|87)/i });

      act(() => {
        fireEvent.click(triggerBtn);
        vi.advanceTimersByTime(50);
      });

      const modal = document.getElementById('certifications-directory-modal');
      const liveRegion = modal.parentElement.querySelector('[aria-live="polite"]');
      expect(liveRegion).toBeInTheDocument();
      expect(liveRegion.getAttribute('aria-atomic')).toBe('true');
      expect(liveRegion.className).toContain('sr-only');

      // 1. Initial page 1 count: 12 of 87
      expect(liveRegion.textContent).toBe('Showing 12 of 87 credentials');

      // 2. Select Anthropic chip (21 total)
      const anthropicChip = within(modal).getByRole('button', { name: /Anthropic/i });
      act(() => {
        fireEvent.click(anthropicChip);
      });
      expect(liveRegion.textContent).toBe('Showing 12 of 21 credentials');

      // 3. Move to page 2 of Anthropic (9 items)
      const nextBtn = within(modal).getByRole('button', { name: /Next page/i });
      act(() => {
        fireEvent.click(nextBtn);
      });
      expect(liveRegion.textContent).toBe('Showing 9 of 21 credentials');

      // 4. Type non-existent query into search
      const searchInput = within(modal).getByRole('textbox');
      act(() => {
        fireEvent.change(searchInput, { target: { value: 'zzzznonexistent12345' } });
      });
      expect(liveRegion.textContent).toBe('No credentials match your filter criteria.');

      // 5. Click Reset Filters
      const resetBtn = within(modal).getByRole('button', { name: /Reset Filters/i });
      act(() => {
        fireEvent.click(resetBtn);
      });
      expect(liveRegion.textContent).toBe('Showing 12 of 87 credentials');
    });

    it('4.4: Active issuer filter chip has aria-pressed="true", others have aria-pressed="false"', () => {
      renderPortfolio();
      const triggerBtn = screen.getByRole('button', { name: /Browse All (80\+|87)/i });

      act(() => {
        fireEvent.click(triggerBtn);
        vi.advanceTimersByTime(50);
      });

      const modal = document.getElementById('certifications-directory-modal');
      const toolbar = modal.querySelector('div[role="toolbar"]');
      const allChips = Array.from(toolbar.querySelectorAll('button'));

      // Initially 'All' is active
      const allChip = allChips.find(c => c.textContent.includes('All'));
      expect(allChip.getAttribute('aria-pressed')).toBe('true');

      const ibmChip = allChips.find(c => c.textContent.includes('IBM'));
      expect(ibmChip.getAttribute('aria-pressed')).toBe('false');

      // Click IBM chip
      act(() => {
        fireEvent.click(ibmChip);
      });
      expect(ibmChip.getAttribute('aria-pressed')).toBe('true');
      expect(allChip.getAttribute('aria-pressed')).toBe('false');
    });
  });

  // ==========================================================================
  // Suite 5: External Credential Link Security & Screen-Reader Disclosures
  // ==========================================================================
  describe('Suite 5: External Credential Link Security & Screen-Reader Disclosures', () => {
    it('5.1: Every credential link includes (opens in new tab) screen-reader disclosure', () => {
      renderPortfolio();
      const triggerBtn = screen.getByRole('button', { name: /Browse All (80\+|87)/i });

      act(() => {
        fireEvent.click(triggerBtn);
        vi.advanceTimersByTime(50);
      });

      const modal = document.getElementById('certifications-directory-modal');
      const cards = within(modal).getAllByRole('link');

      cards.forEach((card, i) => {
        const srOnly = card.querySelector('.sr-only');
        expect(srOnly, `Card #${i} missing .sr-only notice`).toBeInTheDocument();
        expect(srOnly.textContent).toBe('(opens in new tab)');
      });
    });

    it('5.2: External link arrow icon (↗) has aria-hidden="true"', () => {
      renderPortfolio();
      const triggerBtn = screen.getByRole('button', { name: /Browse All (80\+|87)/i });

      act(() => {
        fireEvent.click(triggerBtn);
        vi.advanceTimersByTime(50);
      });

      const modal = document.getElementById('certifications-directory-modal');
      const arrowIcons = modal.querySelectorAll('span[aria-hidden="true"]');
      const arrowList = Array.from(arrowIcons).filter(el => el.textContent.includes('↗'));
      expect(arrowList.length).toBe(12);
    });

    it('5.3: CertBadge handles image onError gracefully without layout shift', () => {
      renderPortfolio();
      const triggerBtn = screen.getByRole('button', { name: /Browse All (80\+|87)/i });

      act(() => {
        fireEvent.click(triggerBtn);
        vi.advanceTimersByTime(50);
      });

      const modal = document.getElementById('certifications-directory-modal');
      const firstImg = modal.querySelector('img[loading="lazy"]');
      expect(firstImg).toBeInTheDocument();

      // Trigger onError event
      act(() => {
        fireEvent.error(firstImg);
      });

      // An Award SVG icon should now replace the broken image
      const awardIcon = modal.querySelector('svg');
      expect(awardIcon).toBeInTheDocument();
      expect(awardIcon.getAttribute('aria-hidden')).toBe('true');
    });
  });

  // ==========================================================================
  // Suite 6: Bilingual i18n Assistive Text Parity
  // ==========================================================================
  describe('Suite 6: Bilingual i18n Assistive Text Parity', () => {
    it('6.1: English mode provides complete accessible text without missing dictionary keys', () => {
      render(
        <I18nProvider initialLocale="en">
          <CertificationsDirectoryModal
            isOpen={true}
            onClose={() => {}}
            certifications={CERTIFICATIONS}
          />
        </I18nProvider>
      );

      expect(screen.getByText('All Certifications & Credentials')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('Search by title, issuer, credential ID, or date...')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /Close certifications directory/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /Previous page/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /Next page/i })).toBeInTheDocument();
    });

    it('6.2: Indonesian mode provides complete translated accessible text without missing keys', () => {
      localStorage.setItem('portfolio_locale', 'id');
      render(
        <I18nProvider>
          <CertificationsDirectoryModal
            isOpen={true}
            onClose={() => {}}
            certifications={CERTIFICATIONS}
          />
        </I18nProvider>
      );

      // Title in Indonesian
      expect(screen.getByText('Semua Sertifikasi & Kredensial')).toBeInTheDocument();
      // Placeholder in Indonesian
      expect(screen.getByPlaceholderText('Cari berdasarkan judul, penerbit, ID kredensial, atau tanggal...')).toBeInTheDocument();
      // Close button in Indonesian
      expect(screen.getByRole('button', { name: /Tutup direktori sertifikasi/i })).toBeInTheDocument();
      // Previous button in Indonesian
      expect(screen.getByRole('button', { name: /Halaman sebelumnya/i })).toBeInTheDocument();
      // Next button in Indonesian
      expect(screen.getByRole('button', { name: /Halaman berikutnya/i })).toBeInTheDocument();
      // Filter chips in Indonesian
      expect(screen.getByRole('button', { name: /Semua/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /Lainnya/i })).toBeInTheDocument();
    });

    it('6.3: Empty state in Indonesian displays translated title, subtitle, and reset button', () => {
      localStorage.setItem('portfolio_locale', 'id');
      render(
        <I18nProvider>
          <CertificationsDirectoryModal
            isOpen={true}
            onClose={() => {}}
            certifications={CERTIFICATIONS}
          />
        </I18nProvider>
      );

      const searchInput = screen.getByRole('textbox');

      act(() => {
        fireEvent.change(searchInput, { target: { value: 'nonexistent_test_string' } });
      });

      expect(screen.getByText('Kredensial Tidak Ditemukan')).toBeInTheDocument();
      // Appears in visual UI and sr-only live region
      const subtitleElements = screen.getAllByText('Tidak ada kredensial yang cocok dengan kriteria pencarian.');
      expect(subtitleElements.length).toBeGreaterThanOrEqual(1);
      expect(screen.getByRole('button', { name: /Atur Ulang Filter/i })).toBeInTheDocument();
    });
  });
});
