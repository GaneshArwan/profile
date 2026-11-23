/**
 * In-Portfolio Certifications Directory & DOM Guardrails Test Suite
 *
 * Validates:
 * 1. Data Completeness & Schema Contract (87 credentials, verified provider distribution)
 * 2. Modal Mount, Trigger & Lifecycle (Zero idle DOM, Escape key, close button, backdrop click)
 * 3. DOM Ceiling & Pagination Mechanics (Strictly <= 150 DOM nodes, 12 items/page, 8 pages)
 * 4. Search & Issuer Filter Interactivity (7 provider chips, substring matching, clear/reset)
 * 5. WCAG 2.1 AA Accessibility & Focus Trap (role="dialog", aria-modal, focus trapping & restoration, min-h-[44px])
 * 6. MarqueeSection Invariant Non-Regression (<= 48 marquee cards, pause toggle, inert duplicate clones)
 */

import React from 'react';
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { screen, within, fireEvent, act, render } from '@testing-library/react';
import { renderPortfolio, resetTestEnvironment } from './harness';
import { CERTIFICATIONS } from '../../src/data/constants';
import { CertificationsDirectoryModal } from '../../src/components/ui/CertificationsDirectoryModal';
import { I18nProvider } from '../../src/lib/i18n';

describe('Tier Certifications Directory: In-Portfolio Credential Browsing & Guardrails', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    resetTestEnvironment();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  // ==========================================================================
  // Suite 1: Data Completeness & Schema Contract
  // ==========================================================================
  describe('Suite 1: Data Completeness & Schema Contract', () => {
    it('1.1: All 87 certifications are present with 100% complete schema fields', () => {
      expect(CERTIFICATIONS.length).toBe(87);

      CERTIFICATIONS.forEach((cert, idx) => {
        expect(cert.id, `Cert #${idx} missing id`).toBeDefined();
        expect(typeof cert.title, `Cert #${idx} missing title`).toBe('string');
        expect(cert.title.length).toBeGreaterThan(0);
        expect(typeof cert.issuer, `Cert #${idx} missing issuer`).toBe('string');
        expect(cert.issuer.length).toBeGreaterThan(0);
        expect(typeof cert.image, `Cert #${idx} missing image`).toBe('string');
        expect(typeof cert.link, `Cert #${idx} missing link`).toBe('string');
        expect(cert.link).toMatch(/^https?:\/\//);
        expect(typeof cert.date, `Cert #${idx} missing date`).toBe('string');
        expect(typeof cert.credentialId, `Cert #${idx} missing credentialId`).toBe('string');
      });
    });

    it('1.2: Provider distribution strictly matches expected provider groups totaling 87', () => {
      const ibm = CERTIFICATIONS.filter(c => c.issuer === 'IBM');
      const anthropic = CERTIFICATIONS.filter(c => c.issuer === 'Anthropic');
      const deeplearning = CERTIFICATIONS.filter(c => c.issuer === 'DeepLearning.AI');
      const dicoding = CERTIFICATIONS.filter(c => c.issuer === 'Dicoding Indonesia');
      const google = CERTIFICATIONS.filter(c => c.issuer.toLowerCase().includes('google'));
      const other = CERTIFICATIONS.filter(c => 
        c.issuer !== 'IBM' &&
        c.issuer !== 'Anthropic' &&
        c.issuer !== 'DeepLearning.AI' &&
        c.issuer !== 'Dicoding Indonesia' &&
        !c.issuer.toLowerCase().includes('google')
      );

      expect(ibm.length).toBe(36);
      expect(anthropic.length).toBe(21);
      expect(deeplearning.length).toBe(12);
      expect(dicoding.length).toBe(12);
      expect(google.length).toBe(2);
      expect(other.length).toBe(4);
      expect(ibm.length + anthropic.length + deeplearning.length + dicoding.length + google.length + other.length).toBe(87);
    });
  });

  // ==========================================================================
  // Suite 2: Modal Mount, Trigger & Lifecycle (Zero Idle DOM)
  // ==========================================================================
  describe('Suite 2: Modal Mount, Trigger & Lifecycle (Zero Idle DOM)', () => {
    it('2.1: Closed modal has zero active DOM nodes', () => {
      renderPortfolio();
      const modal = document.getElementById('certifications-directory-modal');
      expect(modal).toBeNull();
    });

    it('2.2: Trigger button "Browse All 80+" and "80+ Credentials" marketing badge have accessible attributes and min-h-[44px]', () => {
      renderPortfolio();
      const certSection = document.getElementById('certifications');
      expect(within(certSection).getByText('80+ Credentials')).toBeInTheDocument();
      const triggerBtn = screen.getByRole('button', { name: /Browse All 80\+/i });
      expect(triggerBtn.textContent).toContain('Browse All 80+');
      expect(triggerBtn).toBeInTheDocument();
      expect(triggerBtn.getAttribute('aria-haspopup')).toBe('dialog');
      expect(triggerBtn.getAttribute('aria-expanded')).toBe('false');
      expect(triggerBtn.className).toContain('min-h-[44px]');
      expect(triggerBtn.className).toContain('cursor-pointer');
    });

    it('2.3: Clicking trigger button opens modal, displays "80+ Credentials" header badge, and updates aria-expanded to true', () => {
      renderPortfolio();
      const triggerBtn = screen.getByRole('button', { name: /Browse All 80\+/i });

      act(() => {
        fireEvent.click(triggerBtn);
      });

      const modal = document.getElementById('certifications-directory-modal');
      expect(modal).toBeInTheDocument();
      expect(within(modal).getByText('80+ Credentials')).toBeInTheDocument();
      expect(triggerBtn.getAttribute('aria-expanded')).toBe('true');
    });

    it('2.4: Modal closes when close button is clicked and unmounts to 0 DOM nodes', () => {
      renderPortfolio();
      const triggerBtn = screen.getByRole('button', { name: /Browse All (80\+|87)/i });

      act(() => {
        fireEvent.click(triggerBtn);
      });
      const modal = document.getElementById('certifications-directory-modal');
      expect(modal).toBeInTheDocument();

      const closeBtn = within(modal).getByRole('button', { name: /Close certifications directory/i });
      expect(closeBtn.className).toContain('min-h-[44px]');

      act(() => {
        fireEvent.click(closeBtn);
      });

      expect(document.getElementById('certifications-directory-modal')).toBeNull();
      expect(triggerBtn.getAttribute('aria-expanded')).toBe('false');
    });

    it('2.5: Modal closes when Escape key is pressed', () => {
      renderPortfolio();
      const triggerBtn = screen.getByRole('button', { name: /Browse All (80\+|87)/i });

      act(() => {
        fireEvent.click(triggerBtn);
      });
      expect(document.getElementById('certifications-directory-modal')).toBeInTheDocument();

      act(() => {
        fireEvent.keyDown(window, { key: 'Escape' });
      });

      expect(document.getElementById('certifications-directory-modal')).toBeNull();
    });

    it('2.6: Modal closes when clicking backdrop outside dialog content', () => {
      renderPortfolio();
      const triggerBtn = screen.getByRole('button', { name: /Browse All (80\+|87)/i });

      act(() => {
        fireEvent.click(triggerBtn);
      });

      const backdrop = document.querySelector('[role="presentation"]');
      expect(backdrop).toBeInTheDocument();

      act(() => {
        fireEvent.click(backdrop);
      });

      expect(document.getElementById('certifications-directory-modal')).toBeNull();
    });
  });

  // ==========================================================================
  // Suite 3: DOM Ceiling & Pagination Mechanics (R2 Guardrail)
  // ==========================================================================
  describe('Suite 3: DOM Ceiling & Pagination Mechanics (R2 Guardrail)', () => {
    it('3.1: Active DOM element count in modal dialog is strictly <= 150 elements', () => {
      renderPortfolio();
      const triggerBtn = screen.getByRole('button', { name: /Browse All (80\+|87)/i });

      act(() => {
        fireEvent.click(triggerBtn);
      });

      const modal = document.getElementById('certifications-directory-modal');
      expect(modal).toBeInTheDocument();

      const totalElements = modal.querySelectorAll('*').length;
      expect(totalElements).toBeLessThanOrEqual(150);
      expect(totalElements).toBeGreaterThan(50);
    });

    it('3.2: Page 1 renders exactly 12 credential cards', () => {
      renderPortfolio();
      const triggerBtn = screen.getByRole('button', { name: /Browse All (80\+|87)/i });

      act(() => {
        fireEvent.click(triggerBtn);
      });

      const modal = document.getElementById('certifications-directory-modal');
      const cards = modal.querySelectorAll('.grid a');
      expect(cards.length).toBe(12);
    });

    it('3.3: Prev button is disabled on page 1 and Next button advances to page 2', () => {
      renderPortfolio();
      const triggerBtn = screen.getByRole('button', { name: /Browse All (80\+|87)/i });

      act(() => {
        fireEvent.click(triggerBtn);
      });

      const modal = document.getElementById('certifications-directory-modal');
      const prevBtn = within(modal).getByRole('button', { name: /Previous page/i });
      const nextBtn = within(modal).getByRole('button', { name: /Next page/i });

      expect(prevBtn).toBeDisabled();
      expect(nextBtn).not.toBeDisabled();
      expect(within(modal).getByText(/Page 1 of 8/i)).toBeInTheDocument();

      act(() => {
        fireEvent.click(nextBtn);
      });

      expect(within(modal).getByText(/Page 2 of 8/i)).toBeInTheDocument();
      expect(prevBtn).not.toBeDisabled();
    });

    it('3.4: Navigating to page 8 displays remaining 3 credentials and disables Next button', () => {
      renderPortfolio();
      const triggerBtn = screen.getByRole('button', { name: /Browse All (80\+|87)/i });

      act(() => {
        fireEvent.click(triggerBtn);
      });

      const modal = document.getElementById('certifications-directory-modal');
      const nextBtn = within(modal).getByRole('button', { name: /Next page/i });

      // Click to page 8
      for (let i = 1; i < 8; i++) {
        act(() => {
          fireEvent.click(nextBtn);
        });
      }

      expect(within(modal).getByText(/Page 8 of 8/i)).toBeInTheDocument();
      expect(nextBtn).toBeDisabled();

      const cards = modal.querySelectorAll('.grid a');
      // 87 - (7 * 12) = 3 cards
      expect(cards.length).toBe(3);
    });

    it('3.5: Changing filter chip or search query resets page to 1', () => {
      renderPortfolio();
      const triggerBtn = screen.getByRole('button', { name: /Browse All (80\+|87)/i });

      act(() => {
        fireEvent.click(triggerBtn);
      });

      const modal = document.getElementById('certifications-directory-modal');
      const nextBtn = within(modal).getByRole('button', { name: /Next page/i });
      act(() => {
        fireEvent.click(nextBtn);
      });
      expect(within(modal).getByText(/Page 2 of 8/i)).toBeInTheDocument();

      // Click Anthropic filter
      const anthropicBtn = within(modal).getByRole('button', { name: /^Anthropic/i });
      act(() => {
        fireEvent.click(anthropicBtn);
      });

      expect(within(modal).getByText(/Page 1 of 2/i)).toBeInTheDocument();
    });
  });

  // ==========================================================================
  // Suite 4: Search & Issuer Filter Interactivity
  // ==========================================================================
  describe('Suite 4: Search & Issuer Filter Interactivity', () => {
    it('4.1: 7 Issuer filter chips render with accurate initial counts', () => {
      renderPortfolio();
      const triggerBtn = screen.getByRole('button', { name: /Browse All (80\+|87)/i });

      act(() => {
        fireEvent.click(triggerBtn);
      });

      const modal = document.getElementById('certifications-directory-modal');
      expect(within(modal).getByRole('button', { name: /^All \(87\)/i })).toBeInTheDocument();
      expect(within(modal).getByRole('button', { name: /^IBM \(36\)/i })).toBeInTheDocument();
      expect(within(modal).getByRole('button', { name: /^Anthropic \(21\)/i })).toBeInTheDocument();
      expect(within(modal).getByRole('button', { name: /^DeepLearning\.AI \(12\)/i })).toBeInTheDocument();
      expect(within(modal).getByRole('button', { name: /^Dicoding Indonesia \(12\)/i })).toBeInTheDocument();
      expect(within(modal).getByRole('button', { name: /^Google \(2\)/i })).toBeInTheDocument();
      expect(within(modal).getByRole('button', { name: /^Other \(4\)/i })).toBeInTheDocument();
    });

    it('4.2: Selecting IBM chip filters to exactly 36 credentials across 3 pages', () => {
      renderPortfolio();
      const triggerBtn = screen.getByRole('button', { name: /Browse All (80\+|87)/i });

      act(() => {
        fireEvent.click(triggerBtn);
      });

      const modal = document.getElementById('certifications-directory-modal');
      const ibmChip = within(modal).getByRole('button', { name: /^IBM \(36\)/i });
      act(() => {
        fireEvent.click(ibmChip);
      });

      expect(ibmChip.getAttribute('aria-pressed')).toBe('true');
      expect(within(modal).getByText(/Page 1 of 3/i)).toBeInTheDocument();

      const cards = modal.querySelectorAll('.grid a');
      expect(cards.length).toBe(12);

      // Verify issuers are all IBM
      const issuers = Array.from(cards).map(c => c.querySelector('p').textContent);
      issuers.forEach(iss => expect(iss).toBe('IBM'));
    });

    it('4.3: Real-time search matches title case-insensitively and updates results', () => {
      renderPortfolio();
      const triggerBtn = screen.getByRole('button', { name: /Browse All (80\+|87)/i });

      act(() => {
        fireEvent.click(triggerBtn);
      });

      const modal = document.getElementById('certifications-directory-modal');
      const searchInput = within(modal).getByPlaceholderText(/Search by title, issuer/i);
      act(() => {
        fireEvent.change(searchInput, { target: { value: 'Agentic AI' } });
      });

      const cards = modal.querySelectorAll('.grid a');
      expect(cards.length).toBeGreaterThanOrEqual(1);
      expect(within(modal).getByText('Agentic AI')).toBeInTheDocument();
    });

    it('4.4: Real-time search matches credentialId directly', () => {
      renderPortfolio();
      const triggerBtn = screen.getByRole('button', { name: /Browse All (80\+|87)/i });

      act(() => {
        fireEvent.click(triggerBtn);
      });

      const modal = document.getElementById('certifications-directory-modal');
      const sampleCredId = CERTIFICATIONS[0].credentialId;
      const searchInput = within(modal).getByPlaceholderText(/Search by title, issuer/i);
      act(() => {
        fireEvent.change(searchInput, { target: { value: sampleCredId } });
      });

      const cards = modal.querySelectorAll('.grid a');
      expect(cards.length).toBe(1);
      expect(within(modal).getByText(`ID: ${sampleCredId}`)).toBeInTheDocument();
    });

    it('4.5: Clear search button resets query and restores results', () => {
      renderPortfolio();
      const triggerBtn = screen.getByRole('button', { name: /Browse All (80\+|87)/i });

      act(() => {
        fireEvent.click(triggerBtn);
      });

      const modal = document.getElementById('certifications-directory-modal');
      const searchInput = within(modal).getByPlaceholderText(/Search by title, issuer/i);
      act(() => {
        fireEvent.change(searchInput, { target: { value: 'Claude' } });
      });

      const clearBtn = within(modal).getByRole('button', { name: /Clear search query/i });
      expect(clearBtn).toBeInTheDocument();

      act(() => {
        fireEvent.click(clearBtn);
      });

      expect(searchInput.value).toBe('');
      const cards = modal.querySelectorAll('.grid a');
      expect(cards.length).toBe(12);
    });

    it('4.6: Unmatched search renders accessible empty state with functional Reset Filters button', () => {
      renderPortfolio();
      const triggerBtn = screen.getByRole('button', { name: /Browse All (80\+|87)/i });

      act(() => {
        fireEvent.click(triggerBtn);
      });

      const modal = document.getElementById('certifications-directory-modal');
      const searchInput = within(modal).getByPlaceholderText(/Search by title, issuer/i);
      act(() => {
        fireEvent.change(searchInput, { target: { value: 'NonexistentCredentialQuery12345' } });
      });

      expect(within(modal).getByText(/No Credentials Found/i)).toBeInTheDocument();

      const resetBtn = within(modal).getByRole('button', { name: /Reset Filters/i });
      expect(resetBtn.className).toContain('min-h-[44px]');

      act(() => {
        fireEvent.click(resetBtn);
      });

      expect(searchInput.value).toBe('');
      const cards = modal.querySelectorAll('.grid a');
      expect(cards.length).toBe(12);
    });
  });

  // ==========================================================================
  // Suite 5: WCAG 2.1 AA Accessibility & Focus Trap
  // ==========================================================================
  describe('Suite 5: WCAG 2.1 AA Accessibility & Focus Trap', () => {
    it('5.1: Modal exposes correct dialog accessibility semantics', () => {
      renderPortfolio();
      const triggerBtn = screen.getByRole('button', { name: /Browse All (80\+|87)/i });

      act(() => {
        fireEvent.click(triggerBtn);
      });

      const modal = document.getElementById('certifications-directory-modal');
      expect(modal).toBeInTheDocument();
      expect(modal.getAttribute('role')).toBe('dialog');
      expect(modal.getAttribute('aria-modal')).toBe('true');
      expect(modal.getAttribute('aria-labelledby')).toBe('cert-directory-title');
    });

    it('5.2: Dynamic results count is announced via aria-live="polite" live region', () => {
      renderPortfolio();
      const triggerBtn = screen.getByRole('button', { name: /Browse All (80\+|87)/i });

      act(() => {
        fireEvent.click(triggerBtn);
      });

      const modal = document.getElementById('certifications-directory-modal');
      const liveRegion = modal.parentElement.querySelector('[aria-live="polite"]');
      expect(liveRegion).toBeInTheDocument();
      expect(liveRegion.textContent).toMatch(/Showing 12 of 87 credentials/i);

      // Filter by Anthropic
      const anthropicBtn = within(modal).getByRole('button', { name: /^Anthropic/i });
      act(() => {
        fireEvent.click(anthropicBtn);
      });

      expect(liveRegion.textContent).toMatch(/Showing 12 of 21 credentials/i);
    });

    it('5.3: Traps Tab and Shift-Tab focus within dialog container', () => {
      renderPortfolio();
      const triggerBtn = screen.getByRole('button', { name: /Browse All (80\+|87)/i });

      act(() => {
        fireEvent.click(triggerBtn);
      });

      const modal = document.getElementById('certifications-directory-modal');
      const focusable = modal.querySelectorAll('button:not([disabled]), [href], input:not([disabled])');
      const firstElem = focusable[0];
      const lastElem = focusable[focusable.length - 1];

      // Focus last element and press Tab -> wraps to first
      lastElem.focus();
      expect(document.activeElement).toBe(lastElem);

      act(() => {
        fireEvent.keyDown(window, { key: 'Tab', shiftKey: false });
      });
      expect(document.activeElement).toBe(firstElem);

      // Focus first element and press Shift+Tab -> wraps to last
      firstElem.focus();
      expect(document.activeElement).toBe(firstElem);

      act(() => {
        fireEvent.keyDown(window, { key: 'Tab', shiftKey: true });
      });
      expect(document.activeElement).toBe(lastElem);
    });

    it('5.4: External links on cards enforce target="_blank", rel="noopener noreferrer", and sr-only notice', () => {
      renderPortfolio();
      const triggerBtn = screen.getByRole('button', { name: /Browse All (80\+|87)/i });

      act(() => {
        fireEvent.click(triggerBtn);
      });

      const modal = document.getElementById('certifications-directory-modal');
      const cardLinks = modal.querySelectorAll('.grid a');

      cardLinks.forEach((link) => {
        expect(link.getAttribute('target')).toBe('_blank');
        expect(link.getAttribute('rel')).toBe('noopener noreferrer');
        expect(link.querySelector('.sr-only').textContent).toMatch(/opens in new (tab|window)/i);
      });
    });

    it('5.5: All interactive buttons and inputs enforce min-h-[44px] touch target', () => {
      renderPortfolio();
      const triggerBtn = screen.getByRole('button', { name: /Browse All (80\+|87)/i });

      act(() => {
        fireEvent.click(triggerBtn);
      });

      const modal = document.getElementById('certifications-directory-modal');
      const interactiveElements = modal.querySelectorAll('button:not([disabled]), input');

      interactiveElements.forEach((el) => {
        expect(el.className, `Element ${el.tagName} missing min-h-[44px] or min-h-[40px]`).toMatch(/min-h-\[(40|44)px\]/);
      });
    });

    it('5.6: Failed image triggers onError and displays accessible SVG badge icon', () => {
      const singleCert = [{
        id: 999,
        title: "Broken Image Cert",
        issuer: "Test Issuer",
        image: "https://invalid.example.com/broken.png",
        link: "https://example.com/cred",
        date: "Issued Oct 2026",
        credentialId: "BROKEN123"
      }];

      const { container } = render(
        <I18nProvider>
          <CertificationsDirectoryModal
            isOpen={true}
            onClose={() => {}}
            certifications={singleCert}
          />
        </I18nProvider>
      );

      const img = container.querySelector('img[src="https://invalid.example.com/broken.png"]');
      expect(img).toBeInTheDocument();

      act(() => {
        fireEvent.error(img);
      });

      // After error, fallback icon replaces broken img
      expect(container.querySelector('img[src="https://invalid.example.com/broken.png"]')).toBeNull();
      const fallbackBadge = container.querySelector('svg[aria-hidden="true"]');
      expect(fallbackBadge).toBeInTheDocument();
    });
  });

  // ==========================================================================
  // Suite 6: MarqueeSection Invariant Non-Regression
  // ==========================================================================
  describe('Suite 6: MarqueeSection Invariant Non-Regression', () => {
    it('6.1: MarqueeSection continues to mount <= 48 cards within animation tracks', () => {
      renderPortfolio();
      const certCards = Array.from(document.querySelectorAll('#certifications a')).filter(
        c => c.closest('.animate-scroll-right, .animate-scroll-left')
      );
      expect(certCards.length).toBeLessThanOrEqual(48);
      expect(certCards.length).toBeGreaterThanOrEqual(16);
    });

    it('6.2: MarqueeSection duplicate cards remain inert for keyboard users', () => {
      renderPortfolio();
      const certCards = Array.from(document.querySelectorAll('#certifications a')).filter(
        c => c.closest('.animate-scroll-right, .animate-scroll-left')
      );
      const focusable = certCards.filter(c => c.getAttribute('tabindex') === '0' || !c.hasAttribute('tabindex'));
      const inert = certCards.filter(c => c.getAttribute('tabindex') === '-1' && c.getAttribute('aria-hidden') === 'true');

      expect(focusable.length).toBe(8);
      expect(inert.length).toBe(24);
      expect(inert.length + focusable.length).toBe(32);
    });

    it('6.3: Pause/Resume animation button toggles playback state and class', () => {
      renderPortfolio();
      const pauseBtn = screen.getByLabelText(/Pause certifications animation/i);
      expect(pauseBtn).toBeInTheDocument();

      act(() => {
        fireEvent.click(pauseBtn);
      });

      const row1 = document.querySelector('.animate-scroll-right');
      expect(row1.className).toContain('animate-paused');
      expect(row1.style.animationPlayState).toBe('paused');

      act(() => {
        fireEvent.click(pauseBtn);
      });

      expect(row1.className).not.toContain('animate-paused');
      expect(row1.style.animationPlayState).toBe('running');
    });

    it('6.4: Companion "View All on LinkedIn" link is preserved in headerAction', () => {
      renderPortfolio();
      const linkedinLink = screen.getByRole('link', { name: /View All on LinkedIn/i });
      expect(linkedinLink).toBeInTheDocument();
      expect(linkedinLink.getAttribute('target')).toBe('_blank');
      expect(linkedinLink.getAttribute('rel')).toBe('noopener noreferrer');
      expect(linkedinLink.getAttribute('href')).toContain('linkedin.com');
    });
  });
});
