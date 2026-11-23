/**
 * tests/e2e/tier5_adversarial_m4_1.test.jsx
 * 
 * Milestone M4: White-Box Adversarial Hardening Suite (Challenger 1)
 * 
 * Conducts deep white-box adversarial stress testing against:
 * 1. Internationalization (i18n) Engine (parameter injection, prototype pollution, storage failures)
 * 2. Contact Form Validation & State Engine (null bytes, boundary limits, network failure, concurrency)
 * 3. Certifications Directory Modal (empty/malformed datasets, regex injection, pagination bounds, focus traps)
 * 4. Project Card & Technical Spec Matrix (missing fields, unknown categories, live link boundaries, zero-star invariant)
 * 5. Experience 5-Domain Architecture & Pipeline States (domain switching, step index bounds, tooling truthfulness)
 * 6. ErrorBoundary & Chaos Recovery (uncaught exceptions, retry mechanics, fallback contracts, image hook resilience)
 */

import React, { useState } from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, act, renderHook } from '@testing-library/react';

// Implementation imports under test
import * as schemas from '../../src/lib/schemas';
import { getTranslation, translations, DEFAULT_LOCALE, SUPPORTED_LOCALES, I18nProvider, useI18n } from '../../src/lib/i18n';
import { Contact } from '../../src/components/sections/Contact';
import { CertificationsDirectoryModal } from '../../src/components/ui/CertificationsDirectoryModal';
import { ProjectCard } from '../../src/components/ui/ProjectCard';
import { Experience } from '../../src/components/sections/Experience';
import ErrorBoundary from '../../src/components/common/ErrorBoundary';
import { useBackgroundImage } from '../../src/hooks/useBackgroundImage';

describe('Tier 5 White-Box Adversarial Hardening Suite (Challenger 1)', () => {

  // ==========================================================================
  // Suite 1: Internationalization (i18n) Engine White-Box Adversarial Hardening
  // ==========================================================================
  describe('Suite 1: Internationalization (i18n) Engine White-Box Adversarial Hardening', () => {

    describe('1.1 Parameter Replacement Resilience & Injection Tokens', () => {
      it('replaces parameters safely when values contain regex special tokens ($$, $&, $\', $`, $1)', () => {
        // Special replacement patterns in JavaScript String.prototype.replace / replaceAll
        const maliciousTokens = ['$$', '$&', "$'", '$`', '$1', '$2', '$$$$', '100%'];

        for (const token of maliciousTokens) {
          const result = getTranslation('certifications.browseAll', 'en', { count: token });
          expect(result).toBe(`Browse All ${token}`);
        }
      });

      it('replaces parameters containing HTML, script tags, and Unicode characters without escaping corruption', () => {
        const payload = '<script>alert(1)</script> 🚀 測試 • \u200B\uFEFF';
        const result = getTranslation('certifications.browseAll', 'en', { count: payload });
        expect(result).toBe(`Browse All ${payload}`);
      });

      it('handles null, undefined, non-object, or empty params gracefully', () => {
        expect(getTranslation('certifications.browseAll', 'en', null)).toBe(translations.en.certifications.browseAll);
        expect(getTranslation('certifications.browseAll', 'en', undefined)).toBe(translations.en.certifications.browseAll);
        expect(getTranslation('certifications.browseAll', 'en', 'not-an-object')).toBe(translations.en.certifications.browseAll);
        expect(getTranslation('certifications.browseAll', 'en', 12345)).toBe(translations.en.certifications.browseAll);
        expect(getTranslation('certifications.browseAll', 'en', {})).toBe(translations.en.certifications.browseAll);
      });
    });

    describe('1.2 Boundary Paths & Degenerate Key Handling', () => {
      it('returns empty string when keyPath is empty, null, undefined, or non-string', () => {
        expect(getTranslation('', 'en')).toBe('');
        expect(getTranslation(null, 'en')).toBe('');
        expect(getTranslation(undefined, 'en')).toBe('');
        expect(getTranslation(12345, 'en')).toBe('');
        expect(getTranslation({}, 'en')).toBe('');
        expect(getTranslation([], 'en')).toBe('');
        expect(getTranslation(() => {}, 'en')).toBe('');
      });

      it('returns original keyPath when key is not found in current or default locale', () => {
        const nonExistent = 'this.key.does.not.exist';
        expect(getTranslation(nonExistent, 'en')).toBe(nonExistent);
        expect(getTranslation(nonExistent, 'id')).toBe(nonExistent);
      });

      it('safely handles consecutive dots, leading dots, and trailing dots without crashing', () => {
        expect(getTranslation('hero..title', 'en')).toBe('hero..title');
        expect(getTranslation('.hero.title', 'en')).toBe('.hero.title');
        expect(getTranslation('hero.title.', 'en')).toBe('hero.title.');
        expect(getTranslation('....', 'en')).toBe('....');
      });
    });

    describe('1.3 Prototype Pollution & Prototype Property Defense', () => {
      it('strictly guards against Object prototype traversal (__proto__, constructor, prototype, toString)', () => {
        // Object.hasOwn guards in resolvePath should prevent accessing Object prototype methods
        expect(getTranslation('__proto__', 'en')).toBe('__proto__');
        expect(getTranslation('constructor', 'en')).toBe('constructor');
        expect(getTranslation('toString', 'en')).toBe('toString');
        expect(getTranslation('valueOf', 'en')).toBe('valueOf');
        expect(getTranslation('hasOwnProperty', 'en')).toBe('hasOwnProperty');
        expect(getTranslation('__proto__.polluted', 'en')).toBe('__proto__.polluted');
      });
    });

    describe('1.4 Unsupported Locale Handling & Dictionary Return', () => {
      it('falls back to DEFAULT_LOCALE when given unsupported or invalid locale strings', () => {
        expect(getTranslation('nav.about', 'fr')).toBe('About');
        expect(getTranslation('nav.about', 'de')).toBe('About');
        expect(getTranslation('nav.about', 'invalid_locale')).toBe('About');
        expect(getTranslation('nav.about', null)).toBe('About');
        expect(getTranslation('nav.about', undefined)).toBe('About');
      });

      it('returns dictionary object directly when path resolves to an object branch', () => {
        const navObj = getTranslation('nav', 'en');
        expect(typeof navObj).toBe('object');
        expect(navObj.about).toBe('About');
        expect(navObj.experience).toBe('Experience');
      });
    });

    describe('1.5 I18nProvider LocalStorage Exception & Restricted Environment Resilience', () => {
      it('initializes and toggles locale cleanly even when localStorage throws SecurityError', () => {
        const originalGetItem = window.localStorage.getItem;
        const originalSetItem = window.localStorage.setItem;

        // Simulate iframe sandbox / private browsing SecurityError
        window.localStorage.getItem = vi.fn().mockImplementation(() => {
          throw new DOMException('Access denied', 'SecurityError');
        });
        window.localStorage.setItem = vi.fn().mockImplementation(() => {
          throw new DOMException('Access denied', 'SecurityError');
        });

        const TestConsumer = () => {
          const { locale, toggleLocale, t } = useI18n();
          return (
            <div>
              <span data-testid="active-locale">{locale}</span>
              <span data-testid="nav-text">{t('nav.about')}</span>
              <button data-testid="toggle-btn" onClick={toggleLocale}>Toggle</button>
            </div>
          );
        };

        const { unmount } = render(
          <I18nProvider>
            <TestConsumer />
          </I18nProvider>
        );

        expect(screen.getByTestId('active-locale')).toHaveTextContent('en');
        expect(screen.getByTestId('nav-text')).toHaveTextContent('About');

        // Toggle should succeed in React state despite localStorage throw
        fireEvent.click(screen.getByTestId('toggle-btn'));
        expect(screen.getByTestId('active-locale')).toHaveTextContent('id');
        expect(screen.getByTestId('nav-text')).toHaveTextContent('Tentang');

        unmount();
        window.localStorage.getItem = originalGetItem;
        window.localStorage.setItem = originalSetItem;
      });
    });
  });

  // ==========================================================================
  // Suite 2: Contact Form Validation & State Engine White-Box Hardening
  // ==========================================================================
  describe('Suite 2: Contact Form Validation & State Engine White-Box Hardening', () => {

    describe('2.1 Malformed & Non-Object Inputs to validateContactForm', () => {
      it('handles null, undefined, primitive types, and arrays without throwing', () => {
        const malformedInputs = [null, undefined, '', 'hello', 12345, true, false, [], [1, 2, 3], () => {}];

        for (const input of malformedInputs) {
          const result = schemas.validateContactForm(input);
          expect(result.success).toBe(false);
          expect(typeof result.errors).toBe('object');
          expect(result.rawIssues).toBeDefined();
        }
      });
    });

    describe('2.2 Null-Byte Injection Defense', () => {
      it('rejects null-byte injection in name field', () => {
        const res = schemas.validateContactForm({
          name: 'Alexander\0Hamilton',
          email: 'alex@example.com',
          message: 'This is a valid ten char message.'
        });
        expect(res.success).toBe(false);
        expect(res.errors.name).toMatch(/null bytes are not allowed/i);
      });

      it('rejects null-byte injection in email field', () => {
        const res = schemas.validateContactForm({
          name: 'Alexander Hamilton',
          email: 'alex\0@example.com',
          message: 'This is a valid ten char message.'
        });
        expect(res.success).toBe(false);
        // Will fail either null-byte or email format
        expect(res.errors.email).toBeDefined();
      });

      it('rejects null-byte injection in message field', () => {
        const res = schemas.validateContactForm({
          name: 'Alexander Hamilton',
          email: 'alex@example.com',
          message: 'This is a valid message with \0 null byte.'
        });
        expect(res.success).toBe(false);
        expect(res.errors.message).toMatch(/null bytes are not allowed/i);
      });
    });

    describe('2.3 Exact Boundary Length Testing', () => {
      it('validates Name boundaries: 1 char (fails), 2 chars (passes), 100 chars (passes), 101 chars (fails)', () => {
        const validEmail = 'alex@example.com';
        const validMsg = 'A valid message of 10+ characters.';

        // 1 char fails
        expect(schemas.validateContactForm({ name: 'A', email: validEmail, message: validMsg }).success).toBe(false);
        // 2 chars passes
        expect(schemas.validateContactForm({ name: 'AB', email: validEmail, message: validMsg }).success).toBe(true);
        // 100 chars passes
        expect(schemas.validateContactForm({ name: 'A'.repeat(100), email: validEmail, message: validMsg }).success).toBe(true);
        // 101 chars fails
        expect(schemas.validateContactForm({ name: 'A'.repeat(101), email: validEmail, message: validMsg }).success).toBe(false);
      });

      it('validates Email boundaries: 254 chars (passes if valid), 255 chars (fails)', () => {
        const validName = 'Alexander Hamilton';
        const validMsg = 'A valid message of 10+ characters.';

        // Construct 254-char valid email: local(64) + @ + domain(185) + .com(4) = 254
        const email254 = 'a'.repeat(64) + '@' + 'b'.repeat(185) + '.com'; // length: 64 + 1 + 185 + 4 = 254

        const res254 = schemas.validateContactForm({ name: validName, email: email254, message: validMsg });
        expect(res254.success).toBe(true);
        // Email schema validates format and max length 254
        const email255 = 'a'.repeat(65) + '@' + 'b'.repeat(185) + '.com'; // length: 255
        const res255 = schemas.validateContactForm({ name: validName, email: email255, message: validMsg });
        expect(res255.success).toBe(false);
        expect(res255.errors.email).toBeDefined();
      });

      it('validates Message boundaries: 9 chars (fails), 10 chars (passes), 5000 chars (passes), 5001 chars (fails)', () => {
        const validName = 'Alexander';
        const validEmail = 'alex@example.com';

        // 9 chars fails
        expect(schemas.validateContactForm({ name: validName, email: validEmail, message: '123456789' }).success).toBe(false);
        // 10 chars passes
        expect(schemas.validateContactForm({ name: validName, email: validEmail, message: '1234567890' }).success).toBe(true);
        // 5000 chars passes
        expect(schemas.validateContactForm({ name: validName, email: validEmail, message: 'a'.repeat(5000) }).success).toBe(true);
        // 5001 chars fails
        expect(schemas.validateContactForm({ name: validName, email: validEmail, message: 'a'.repeat(5001) }).success).toBe(false);
      });

      it('validates whitespace-only inputs are trimmed and fail min-length checks', () => {
        const res = schemas.validateContactForm({
          name: '     ',
          email: '     ',
          message: '               '
        });
        expect(res.success).toBe(false);
        expect(res.errors.name).toBeDefined();
        expect(res.errors.email).toBeDefined();
        expect(res.errors.message).toBeDefined();
      });
    });

    describe('2.4 Network Failure & API Exception Resilience in Contact.jsx', () => {
      beforeEach(() => {
        vi.restoreAllMocks();
      });

      it('handles network disconnection (fetch rejection) cleanly without crashing and displays role="alert"', async () => {
        // Mock global.fetch to reject with a NetworkError
        global.fetch = vi.fn().mockRejectedValue(new TypeError('Failed to fetch'));

        render(
          <I18nProvider>
            <Contact isDarkMode={false} />
          </I18nProvider>
        );

        // Fill form fields
        fireEvent.change(screen.getByLabelText(/your name/i), { target: { name: 'name', value: 'Bruce Wayne' } });
        fireEvent.change(screen.getByLabelText(/work email/i), { target: { name: 'email', value: 'bruce@wayne.corp' } });
        fireEvent.change(screen.getByLabelText(/project scope/i), { target: { name: 'message', value: 'Need enterprise automated master data pipelines.' } });

        // Trigger mock reCAPTCHA verification
        const recaptchaBtn = screen.getByTestId('recaptcha-verify-btn');
        fireEvent.click(recaptchaBtn);

        // Submit form
        const submitBtn = screen.getByRole('button', { name: /send message/i });
        await act(async () => {
          fireEvent.click(submitBtn);
        });

        // Verify accessible error alert rendered
        const alertBox = await screen.findByRole('alert');
        expect(alertBox).toBeInTheDocument();
        expect(alertBox).toHaveTextContent(/message delivery failed/i);
      });

      it('handles HTTP 500 server error response cleanly and renders error notification', async () => {
        global.fetch = vi.fn().mockResolvedValue({
          ok: false,
          status: 500,
          json: () => Promise.resolve({ error: 'Internal Server Error' })
        });

        render(
          <I18nProvider>
            <Contact isDarkMode={false} />
          </I18nProvider>
        );

        fireEvent.change(screen.getByLabelText(/your name/i), { target: { name: 'name', value: 'Clark Kent' } });
        fireEvent.change(screen.getByLabelText(/work email/i), { target: { name: 'email', value: 'clark@dailyplanet.com' } });
        fireEvent.change(screen.getByLabelText(/project scope/i), { target: { name: 'message', value: 'Need data analytics and Looker dashboard reporting.' } });

        fireEvent.click(screen.getByTestId('recaptcha-verify-btn'));

        const submitBtn = screen.getByRole('button', { name: /send message/i });
        await act(async () => {
          fireEvent.click(submitBtn);
        });

        const alertBox = await screen.findByRole('alert');
        expect(alertBox).toBeInTheDocument();
        expect(alertBox).toHaveTextContent(/message delivery failed/i);
      });

      it('clears field errors in real time when user updates the invalid input', () => {
        render(
          <I18nProvider>
            <Contact isDarkMode={false} />
          </I18nProvider>
        );

        const nameInput = screen.getByLabelText(/your name/i);
        
        // Blur with 1 character to trigger validation error
        fireEvent.change(nameInput, { target: { name: 'name', value: 'A' } });
        fireEvent.blur(nameInput, { target: { name: 'name', value: 'A' } });

        // Error alert should be present
        expect(screen.getByText(/name must be at least 2 characters/i)).toBeInTheDocument();

        // Typing valid characters should immediately clear the error
        fireEvent.change(nameInput, { target: { name: 'name', value: 'Alexander' } });
        expect(screen.queryByText(/name must be at least 2 characters/i)).not.toBeInTheDocument();
      });
    });
  });

  // ==========================================================================
  // Suite 3: Certifications Directory Modal Edge Cases & Boundary Stress
  // ==========================================================================
  describe('Suite 3: Certifications Directory Modal Edge Cases & Boundary Stress', () => {

    describe('3.1 Empty & Degenerate Certification Datasets', () => {
      it('renders cleanly with 0 items, 0 filter count, 1 page of 1, and no NaN pagination errors', () => {
        render(
          <I18nProvider>
            <CertificationsDirectoryModal
              isOpen={true}
              onClose={vi.fn()}
              certifications={[]}
            />
          </I18nProvider>
        );

        expect(screen.getByText(/0\s*Total/i)).toBeInTheDocument();
        expect(screen.getByText(/page 1 of 1/i)).toBeInTheDocument();
        expect(screen.getByText(/no credentials found/i)).toBeInTheDocument();
      });

      it('safely handles items with missing, null, or undefined fields without throwing TypeError', () => {
        const degenerateItems = [
          { id: 1, title: null, issuer: null, credentialId: null, date: null, url: null },
          { id: 2, title: undefined, issuer: undefined, credentialId: undefined, date: undefined },
          { id: 3, title: 'Valid Title', issuer: null },
          { id: 4 },
        ];

        render(
          <I18nProvider>
            <CertificationsDirectoryModal
              isOpen={true}
              onClose={vi.fn()}
              certifications={degenerateItems}
            />
          </I18nProvider>
        );

        const searchInput = screen.getByPlaceholderText(/search by title/i);
        
        // Fuzz search query against degenerate objects: should not throw toLowerCase() errors
        expect(() => {
          fireEvent.change(searchInput, { target: { value: 'Valid' } });
          fireEvent.change(searchInput, { target: { value: 'null' } });
          fireEvent.change(searchInput, { target: { value: 'undefined' } });
          fireEvent.change(searchInput, { target: { value: '' } });
        }).not.toThrow();
      });
    });

    describe('3.2 Search Query Regex Injection Fuzzing', () => {
      it('treats regex metacharacters literally without throwing SyntaxError in search', () => {
        const mockCertifications = [
          { id: 1, title: 'Regex Test (Advanced)', issuer: 'IBM', date: '2024' },
          { id: 2, title: 'C++ Special [Core]', issuer: 'Google', date: '2023' },
          { id: 3, title: 'Pointer * and + Operations', issuer: 'Anthropic', date: '2024' },
        ];

        render(
          <I18nProvider>
            <CertificationsDirectoryModal
              isOpen={true}
              onClose={vi.fn()}
              certifications={mockCertifications}
            />
          </I18nProvider>
        );

        const searchInput = screen.getByPlaceholderText(/search by title/i);
        const maliciousRegexInputs = [
          '(', ')', '[', ']', '{', '}', '*', '+', '?', '\\', '^', '$', '|', '.', '.*', '\\d+', '(?=.*)'
        ];

        for (const meta of maliciousRegexInputs) {
          expect(() => {
            fireEvent.change(searchInput, { target: { value: meta } });
          }).not.toThrow();
        }
      });
    });

    describe('3.3 Large-Scale Pagination Clamping & Filter Switching', () => {
      it('accurately partitions 100 items into 9 pages (12 items/page) and clamps page when filter narrows results', () => {
        const largeDataset = Array.from({ length: 100 }, (_, i) => ({
          id: i + 1,
          title: `Certification Item ${i + 1}`,
          issuer: i < 5 ? 'IBM' : 'Dicoding Indonesia',
          date: '2024',
          credentialId: `CRED-${i + 1}`,
        }));

        render(
          <I18nProvider>
            <CertificationsDirectoryModal
              isOpen={true}
              onClose={vi.fn()}
              certifications={largeDataset}
            />
          </I18nProvider>
        );

        // 100 items / 12 = 9 pages total
        expect(screen.getByText(/page 1 of 9/i)).toBeInTheDocument();

        // Advance to page 9 via Next button
        const nextBtn = screen.getByRole('button', { name: /next/i });
        for (let p = 1; p < 9; p++) {
          fireEvent.click(nextBtn);
        }
        expect(screen.getByText(/page 9 of 9/i)).toBeInTheDocument();

        // Switch filter to 'IBM' which only has 5 items (1 page)
        // Verify current page safely clamps from 9 back to 1
        const ibmChip = screen.getByRole('button', { name: /ibm/i });
        fireEvent.click(ibmChip);

        expect(screen.getByText(/page 1 of 1/i)).toBeInTheDocument();
        expect(screen.getAllByText(/showing 5 of 5 credentials/i).length).toBeGreaterThanOrEqual(1);
      });
    });

    describe('3.4 Modal Accessibility, Focus Trap & Escape Dismissal', () => {
      it('invokes onClose when Escape key is pressed', () => {
        const onCloseMock = vi.fn();
        render(
          <I18nProvider>
            <CertificationsDirectoryModal
              isOpen={true}
              onClose={onCloseMock}
              certifications={[{ id: 1, title: 'Cert', issuer: 'IBM' }]}
            />
          </I18nProvider>
        );

        fireEvent.keyDown(window, { key: 'Escape' });
        expect(onCloseMock).toHaveBeenCalledTimes(1);
      });

      it('invokes onClose on backdrop click, but not on modal content click', () => {
        const onCloseMock = vi.fn();
        render(
          <I18nProvider>
            <CertificationsDirectoryModal
              isOpen={true}
              onClose={onCloseMock}
              certifications={[{ id: 1, title: 'Cert', issuer: 'IBM' }]}
            />
          </I18nProvider>
        );

        // Click inner modal content: should not trigger onClose
        const modalDialog = screen.getByRole('dialog');
        fireEvent.click(modalDialog);
        expect(onCloseMock).not.toHaveBeenCalled();

        // Click outer presentation backdrop: should trigger onClose
        const backdrop = modalDialog.parentElement;
        fireEvent.click(backdrop);
        expect(onCloseMock).toHaveBeenCalledTimes(1);
      });
    });
  });

  // ==========================================================================
  // Suite 4: Project Card & Technical Spec Matrix White-Box Robustness
  // ==========================================================================
  describe('Suite 4: Project Card & Technical Spec Matrix White-Box Robustness', () => {

    it('renders cleanly with minimal project object lacking optional indicators, stats, and highlights', () => {
      const minimalProject = {
        id: 'minimal-proj',
        title: 'Minimal Data Pipeline',
        category: 'data',
        description: 'A minimal project description exceeding ten characters.',
        tech: ['SQL'],
        repoUrl: 'https://github.com/GaneshArwan/minimal-proj',
      };

      const { container } = render(
        <I18nProvider>
          <ProjectCard project={minimalProject} />
        </I18nProvider>
      );

      expect(screen.getByText('Minimal Data Pipeline')).toBeInTheDocument();
      expect(screen.getByText('Data Engineering')).toBeInTheDocument();
      expect(screen.getAllByText('SQL').length).toBeGreaterThanOrEqual(1);
      // Verified zero arbitrary star counters rendered
      expect(container.querySelectorAll('[data-testid="star-counter"]').length).toBe(0);
      expect(container.textContent).not.toMatch(/\b0\s*stars\b/i);
    });

    it('falls back to default category theme when given unknown category', () => {
      const weirdCategoryProject = {
        id: 'quantum-proj',
        title: 'Quantum Automation',
        category: 'unknown_quantum_category',
        description: 'Project testing unknown category theme fallback.',
        tech: ['Python'],
        repoUrl: 'https://github.com/GaneshArwan/quantum',
      };

      render(
        <I18nProvider>
          <ProjectCard project={weirdCategoryProject} />
        </I18nProvider>
      );

      expect(screen.getByText('Quantum Automation')).toBeInTheDocument();
    });

    it('does not render live link button when liveUrl is null, undefined, or empty string', () => {
      const noLiveProject = {
        id: 'no-live',
        title: 'Backend Batch RPA',
        category: 'automation',
        description: 'Internal corporate tool with no public URL.',
        tech: ['Google Apps Script', 'SAP GUI'],
        repoUrl: 'https://github.com/GaneshArwan/batch-rpa',
        liveUrl: null,
      };

      render(
        <I18nProvider>
          <ProjectCard project={noLiveProject} />
        </I18nProvider>
      );

      expect(screen.queryByRole('link', { name: /live demo/i })).not.toBeInTheDocument();
    });

    it('does not render Flagship CV Project pill and shows Live Demo vs Production System status', () => {
      const liveProj = {
        id: 'live-1',
        title: 'Live System Project',
        category: 'ai',
        flagship: true,
        description: 'A production grade machine learning system with live deployment.',
        tech: ['TypeScript', 'LangGraph.js'],
        repoUrl: 'https://github.com/GaneshArwan/live-sys',
        liveUrl: 'https://example.com/live',
        media: [
          { type: 'image', src: '/assets/projects/rag-document-chat/chat-interface.png', caption: 'Chat UI' },
          { type: 'image', src: '/assets/projects/rag-document-chat/config-sidebar.png', caption: 'Config Sidebar' },
        ],
        workflowSteps: [
          { step: '01', title: 'Ingest', detail: 'Load docs' },
          { step: '02', title: 'Index', detail: 'Embed vectors' },
          { step: '03', title: 'Retrieve', detail: 'Top-k search' },
          { step: '04', title: 'Answer', detail: 'Cited response' },
        ],
      };

      const standardProj = {
        id: 'standard-1',
        title: 'Standard Project',
        category: 'data',
        flagship: false,
        description: 'A standard data analytics dashboard and profiling tool.',
        tech: ['Python', 'SQL'],
        repoUrl: 'https://github.com/GaneshArwan/standard',
      };

      const { rerender } = render(
        <I18nProvider>
          <ProjectCard project={liveProj} />
        </I18nProvider>
      );

      expect(screen.queryByText(/flagship cv project/i)).not.toBeInTheDocument();
      expect(screen.getByText(/live demo/i)).toBeInTheDocument();

      // Verify UI Preview & How It Works tabs + Lightbox open/close
      expect(screen.getByRole('tab', { name: /ui preview/i })).toHaveAttribute('aria-selected', 'true');
      fireEvent.click(screen.getByRole('button', { name: /next preview for live system project/i }));
      expect(screen.getByText('Config Sidebar')).toBeInTheDocument();

      fireEvent.click(screen.getByRole('button', { name: /expand preview: live system project/i }));
      expect(screen.getByRole('dialog', { name: /live system project preview/i })).toBeInTheDocument();
      fireEvent.keyDown(window, { key: 'Escape' });
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();

      fireEvent.click(screen.getByRole('tab', { name: /how it works/i }));
      expect(screen.getByText('Ingest')).toBeInTheDocument();
      expect(screen.getByText('Cited response')).toBeInTheDocument();

      rerender(
        <I18nProvider>
          <ProjectCard project={standardProj} />
        </I18nProvider>
      );

      expect(screen.getByText(/production system/i)).toBeInTheDocument();
    });
  });

  // ==========================================================================
  // Suite 5: Experience 5-Domain Architecture & Pipeline State Hardening
  // ==========================================================================
  describe('Suite 5: Experience 5-Domain Architecture & Pipeline State Hardening', () => {

    it('switches between all 5 enterprise MDM domains (Site, Vendor, Customer, Article, Finance) cleanly', () => {
      render(
        <I18nProvider>
          <Experience />
        </I18nProvider>
      );

      const domainNames = ['Site', 'Vendor', 'Customer', 'Article', 'Finance'];

      for (const name of domainNames) {
        const domainBtn = screen.getByRole('tab', { name: new RegExp(name, 'i') });
        fireEvent.click(domainBtn);

        // Verify domain tab has active selection
        expect(domainBtn).toHaveAttribute('aria-selected', 'true');
      }
    });

    it('cycles through all 4 pipeline stages in a domain without state desynchronization', () => {
      render(
        <I18nProvider>
          <Experience />
        </I18nProvider>
      );

      // Select Vendor domain
      fireEvent.click(screen.getByRole('tab', { name: /vendor/i }));

      // Pipeline stages: 1. Intake, 2. Validation, 3. Staging & Entry, 4. BI & Governance
      const step1 = screen.getByRole('button', { name: /1\. intake/i });
      const step2 = screen.getByRole('button', { name: /2\. validation/i });
      const step3 = screen.getByRole('button', { name: /3\. staging & entry/i });
      const step4 = screen.getByRole('button', { name: /4\. bi & governance/i });

      fireEvent.click(step2);
      expect(screen.getByText(/verified npwp & deduplicated bank record/i)).toBeInTheDocument();

      fireEvent.click(step3);
      expect(screen.getByText(/sap live vendor master synchronization/i)).toBeInTheDocument();

      fireEvent.click(step4);
      expect(screen.getByText(/looker vendor onboarding sla dashboard/i)).toBeInTheDocument();

      fireEvent.click(step1);
      expect(screen.getByText(/structured vendor profile & tax payload/i)).toBeInTheDocument();
    });

    it('strictly verifies GWS and SAP tooling across all domains with ZERO BigQuery claims', () => {
      const { container } = render(
        <I18nProvider>
          <Experience />
        </I18nProvider>
      );

      const pageText = container.textContent;

      // Verify Google Apps Script, Google Sheets, Looker, SQL, SAP GUI Scripting are referenced
      expect(pageText).toContain('Google Apps Script');
      expect(pageText).toContain('Google Sheets');
      expect(pageText).toContain('Looker');
      expect(pageText).toContain('SQL');

      // Verify zero unverified BigQuery pipeline claims
      expect(pageText).not.toContain('BigQuery');
    });
  });

  // ==========================================================================
  // Suite 6: ErrorBoundary & Chaos Recovery Hardening
  // ==========================================================================
  describe('Suite 6: ErrorBoundary & Chaos Recovery Hardening', () => {

    const BuggyComponent = ({ shouldThrow }) => {
      if (shouldThrow) {
        throw new Error('Adversarial chaos test crash simulation');
      }
      return <div data-testid="recovered-content">Operational Component</div>;
    };

    it('catches runtime exception in child tree, renders accessible alert, and recovers on Try Again', () => {
      // Suppress console.error during expected throw test
      const spy = vi.spyOn(console, 'error').mockImplementation(() => {});

      const Harness = () => {
        const [throwError, setThrowError] = useState(true);
        return (
          <div>
            <button data-testid="fix-btn" onClick={() => setThrowError(false)}>Fix</button>
            <ErrorBoundary>
              <BuggyComponent shouldThrow={throwError} />
            </ErrorBoundary>
          </div>
        );
      };

      render(<Harness />);

      // Verify fallback role="alert"
      const alert = screen.getByRole('alert');
      expect(alert).toBeInTheDocument();
      expect(alert).toHaveTextContent(/an unexpected error occurred/i);

      // Fix the error condition and click Try Again
      fireEvent.click(screen.getByTestId('fix-btn'));
      const tryAgainBtn = screen.getByRole('button', { name: /try again/i });
      fireEvent.click(tryAgainBtn);

      // Component should now be recovered
      expect(screen.getByTestId('recovered-content')).toBeInTheDocument();
      expect(screen.queryByRole('alert')).not.toBeInTheDocument();

      spy.mockRestore();
    });

    it('renders custom fallback function with error and reset parameters when provided', () => {
      const spy = vi.spyOn(console, 'error').mockImplementation(() => {});

      const customFallback = ({ error, reset }) => (
        <div data-testid="custom-error">
          <span>Error message: {error.message}</span>
          <button data-testid="custom-reset" onClick={reset}>Custom Reset</button>
        </div>
      );

      render(
        <ErrorBoundary fallback={customFallback}>
          <BuggyComponent shouldThrow={true} />
        </ErrorBoundary>
      );

      expect(screen.getByTestId('custom-error')).toHaveTextContent('Adversarial chaos test crash simulation');

      spy.mockRestore();
    });

    describe('6.4 useBackgroundImage Resilience', () => {
      it('returns fallbackUrl when localPath is null, undefined, or empty', () => {
        const fallback = 'https://example.com/fallback.webp';
        
        const { result: res1 } = renderHook(() => useBackgroundImage(null, fallback));
        expect(res1.current).toBe(fallback);

        const { result: res2 } = renderHook(() => useBackgroundImage(undefined, fallback));
        expect(res2.current).toBe(fallback);

        const { result: res3 } = renderHook(() => useBackgroundImage('', fallback));
        expect(res3.current).toBe(fallback);
      });
    });
  });

});
