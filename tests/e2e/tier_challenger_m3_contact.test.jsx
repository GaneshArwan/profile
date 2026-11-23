import React from 'react';
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { screen, fireEvent } from '@testing-library/react';
import { renderPortfolio, resetTestEnvironment } from './harness';
import { validateContactForm } from '../../src/lib/schemas';

/**
 * Empirical Challenger 2: Contact Form Boundary & Resilience Test Suite (Milestone M3, Feature F12)
 * 
 * Personas & Skills Fused:
 * 1. agency-api-tester: Comprehensive API endpoint validation, payload structure, network drop/error codes
 * 2. agency-reality-checker: Rigorous DOM verification, ARIA alerts, real-time error clearance, evidence-backed assertions
 * 3. agency-application-security-engineer: Schema boundary fuzzing, XSS/script payload injection, reCAPTCHA anti-abuse
 */
describe('Empirical Challenger 2: Contact Form Validation & Network Resilience (F12)', () => {

  beforeEach(() => {
    vi.useFakeTimers();
    resetTestEnvironment();
    vi.restoreAllMocks();
    global.fetch = vi.fn().mockImplementation(() =>
      Promise.resolve({
        ok: true,
        status: 200,
        json: () => Promise.resolve({ success: true }),
      })
    );
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  // ============================================================================
  // Suite 1: Form Validation Boundaries & Input Edge Cases
  // ============================================================================
  describe('Suite 1: Form Validation Boundaries & Input Edge Cases', () => {

    it('1.1 Empty input submissions: triggers field-level role="alert" messages and red highlights without dispatching fetch', async () => {
      renderPortfolio();
      const fetchSpy = vi.spyOn(global, 'fetch');

      const submitBtn = document.querySelector('section#contact form button[type="submit"]');
      const nameInput = document.querySelector('input#name');
      const emailInput = document.querySelector('input#email');
      const messageInput = document.querySelector('textarea#message');

      expect(submitBtn).toBeInTheDocument();
      expect(fetchSpy).not.toHaveBeenCalled();

      // Submit completely blank form
      fireEvent.click(submitBtn);

      // Verify network request was blocked
      expect(fetchSpy).not.toHaveBeenCalled();

      // Verify all field-level alerts are rendered with role="alert"
      const nameError = document.getElementById('name-error');
      const emailError = document.getElementById('email-error');
      const messageError = document.getElementById('message-error');
      const recaptchaError = document.getElementById('recaptcha-error');

      expect(nameError).toBeInTheDocument();
      expect(nameError).toHaveAttribute('role', 'alert');
      expect(nameError).toHaveTextContent(/Name is required/i);

      expect(emailError).toBeInTheDocument();
      expect(emailError).toHaveAttribute('role', 'alert');
      expect(emailError).toHaveTextContent(/Email is required/i);

      expect(messageError).toBeInTheDocument();
      expect(messageError).toHaveAttribute('role', 'alert');
      expect(messageError).toHaveTextContent(/Message is required/i);

      expect(recaptchaError).toBeInTheDocument();
      expect(recaptchaError).toHaveAttribute('role', 'alert');
      expect(recaptchaError).toHaveTextContent(/reCAPTCHA/i);

      // Verify visual red highlights and aria-invalid attributes
      expect(nameInput).toHaveAttribute('aria-invalid', 'true');
      expect(nameInput.className).toContain('border-rose-500');

      expect(emailInput).toHaveAttribute('aria-invalid', 'true');
      expect(emailInput.className).toContain('border-rose-500');

      expect(messageInput).toHaveAttribute('aria-invalid', 'true');
      expect(messageInput.className).toContain('border-rose-500');

      // Verify first invalid field received focus for accessibility
      expect(document.activeElement).toBe(nameInput);
    });

    it('1.2 Name field boundary: single character fails min 2 with specific error message', async () => {
      renderPortfolio();
      const fetchSpy = vi.spyOn(global, 'fetch');

      const nameInput = document.querySelector('input#name');
      const emailInput = document.querySelector('input#email');
      const messageInput = document.querySelector('textarea#message');
      const submitBtn = document.querySelector('section#contact form button[type="submit"]');

      // Single character 'A'
      fireEvent.change(nameInput, { target: { name: 'name', value: 'A' } });
      fireEvent.change(emailInput, { target: { name: 'email', value: 'recruiter@enterprise.com' } });
      fireEvent.change(messageInput, { target: { name: 'message', value: 'Valid message containing more than ten characters.' } });

      const recaptchaBtn = screen.queryByTestId('recaptcha-verify-btn');
      if (recaptchaBtn) fireEvent.click(recaptchaBtn);

      fireEvent.click(submitBtn);

      expect(fetchSpy).not.toHaveBeenCalled();

      const nameError = document.getElementById('name-error');
      expect(nameError).toBeInTheDocument();
      expect(nameError).toHaveTextContent(/Name must be at least 2 characters/i);
      expect(nameInput).toHaveAttribute('aria-invalid', 'true');
    });

    it('1.3 Name field boundary: whitespace-only string fails with required error message', async () => {
      renderPortfolio();
      const fetchSpy = vi.spyOn(global, 'fetch');

      const nameInput = document.querySelector('input#name');
      const emailInput = document.querySelector('input#email');
      const messageInput = document.querySelector('textarea#message');
      const submitBtn = document.querySelector('section#contact form button[type="submit"]');

      // Whitespace only
      fireEvent.change(nameInput, { target: { name: 'name', value: '     ' } });
      fireEvent.change(emailInput, { target: { name: 'email', value: 'recruiter@enterprise.com' } });
      fireEvent.change(messageInput, { target: { name: 'message', value: 'Valid message containing more than ten characters.' } });

      const recaptchaBtn = screen.queryByTestId('recaptcha-verify-btn');
      if (recaptchaBtn) fireEvent.click(recaptchaBtn);

      fireEvent.click(submitBtn);

      expect(fetchSpy).not.toHaveBeenCalled();

      const nameError = document.getElementById('name-error');
      expect(nameError).toBeInTheDocument();
      expect(nameError).toHaveTextContent(/Name is required/i);
    });

    it('1.4 Name field boundary: exactly 2 characters passes validation', async () => {
      renderPortfolio();
      const fetchSpy = vi.spyOn(global, 'fetch');

      const nameInput = document.querySelector('input#name');
      const emailInput = document.querySelector('input#email');
      const messageInput = document.querySelector('textarea#message');
      const submitBtn = document.querySelector('section#contact form button[type="submit"]');

      // Exactly 2 characters 'Li'
      fireEvent.change(nameInput, { target: { name: 'name', value: 'Li' } });
      fireEvent.change(emailInput, { target: { name: 'email', value: 'li@enterprise.com' } });
      fireEvent.change(messageInput, { target: { name: 'message', value: 'Valid message containing more than ten characters.' } });

      const recaptchaBtn = screen.queryByTestId('recaptcha-verify-btn');
      if (recaptchaBtn) fireEvent.click(recaptchaBtn);

      fireEvent.click(submitBtn);

      await vi.waitFor(() => {
        expect(fetchSpy).toHaveBeenCalled();
      });
      expect(document.getElementById('name-error')).toBeNull();
    });

    it('1.5 Email field boundaries: invalid formats ("test@", "@test.com", "plainaddress", "test@domain..com") all fail schema validation', () => {
      const invalidEmails = [
        'test@',
        '@test.com',
        'plainaddress',
        'test@domain..com',
        'missing-tld@domain',
        'user@.domain.com',
        'spaces in@domain.com',
      ];

      for (const email of invalidEmails) {
        const result = validateContactForm({
          name: 'Alex Mercer',
          email,
          message: 'Valid message with sufficient length.'
        });
        expect(result.success).toBe(false);
        expect(result.errors.email).toBeDefined();
        expect(result.errors.email).toMatch(/valid email/i);
      }
    });

    it('1.6 Email field in UI: invalid email displays red highlight and role="alert" message', async () => {
      renderPortfolio();
      const fetchSpy = vi.spyOn(global, 'fetch');

      const nameInput = document.querySelector('input#name');
      const emailInput = document.querySelector('input#email');
      const messageInput = document.querySelector('textarea#message');
      const submitBtn = document.querySelector('section#contact form button[type="submit"]');

      fireEvent.change(nameInput, { target: { name: 'name', value: 'Alexander' } });
      fireEvent.change(emailInput, { target: { name: 'email', value: 'test@domain..com' } });
      fireEvent.change(messageInput, { target: { name: 'message', value: 'Valid message containing more than ten characters.' } });

      const recaptchaBtn = screen.queryByTestId('recaptcha-verify-btn');
      if (recaptchaBtn) fireEvent.click(recaptchaBtn);

      fireEvent.click(submitBtn);

      expect(fetchSpy).not.toHaveBeenCalled();

      const emailError = document.getElementById('email-error');
      expect(emailError).toBeInTheDocument();
      expect(emailError).toHaveAttribute('role', 'alert');
      expect(emailError).toHaveTextContent(/Please enter a valid email address/i);
      expect(emailInput).toHaveAttribute('aria-invalid', 'true');
      expect(emailInput.className).toContain('border-rose-500');
    });

    it('1.7 Message field boundary: <10 characters (e.g. 9 characters) fails min 10 validation', async () => {
      renderPortfolio();
      const fetchSpy = vi.spyOn(global, 'fetch');

      const nameInput = document.querySelector('input#name');
      const emailInput = document.querySelector('input#email');
      const messageInput = document.querySelector('textarea#message');
      const submitBtn = document.querySelector('section#contact form button[type="submit"]');

      fireEvent.change(nameInput, { target: { name: 'name', value: 'Alexander' } });
      fireEvent.change(emailInput, { target: { name: 'email', value: 'alex@company.com' } });
      fireEvent.change(messageInput, { target: { name: 'message', value: '123456789' } }); // 9 chars

      const recaptchaBtn = screen.queryByTestId('recaptcha-verify-btn');
      if (recaptchaBtn) fireEvent.click(recaptchaBtn);

      fireEvent.click(submitBtn);

      expect(fetchSpy).not.toHaveBeenCalled();

      const messageError = document.getElementById('message-error');
      expect(messageError).toBeInTheDocument();
      expect(messageError).toHaveAttribute('role', 'alert');
      expect(messageError).toHaveTextContent(/Message must be at least 10 characters/i);
      expect(messageInput).toHaveAttribute('aria-invalid', 'true');
    });

    it('1.8 Message field boundary: exactly 10 characters passes validation', async () => {
      renderPortfolio();
      const fetchSpy = vi.spyOn(global, 'fetch');

      const nameInput = document.querySelector('input#name');
      const emailInput = document.querySelector('input#email');
      const messageInput = document.querySelector('textarea#message');
      const submitBtn = document.querySelector('section#contact form button[type="submit"]');

      fireEvent.change(nameInput, { target: { name: 'name', value: 'Alexander' } });
      fireEvent.change(emailInput, { target: { name: 'email', value: 'alex@company.com' } });
      fireEvent.change(messageInput, { target: { name: 'message', value: '1234567890' } }); // exactly 10 chars

      const recaptchaBtn = screen.queryByTestId('recaptcha-verify-btn');
      if (recaptchaBtn) fireEvent.click(recaptchaBtn);

      fireEvent.click(submitBtn);

      await vi.waitFor(() => {
        expect(fetchSpy).toHaveBeenCalled();
      });
      expect(document.getElementById('message-error')).toBeNull();
    });

    it('1.9 Real-time error clearance: typing in an invalid field clears the active field error immediately', async () => {
      renderPortfolio();
      const nameInput = document.querySelector('input#name');
      const submitBtn = document.querySelector('section#contact form button[type="submit"]');

      // Trigger error
      fireEvent.click(submitBtn);
      expect(document.getElementById('name-error')).toBeInTheDocument();

      // Type to fix
      fireEvent.change(nameInput, { target: { name: 'name', value: 'John' } });

      // Error immediately removed for name field
      expect(document.getElementById('name-error')).toBeNull();
      expect(nameInput).toHaveAttribute('aria-invalid', 'false');
    });

    it('1.10 On-blur validation: blurring an invalid field triggers single-field validation without touching others', async () => {
      renderPortfolio();
      const nameInput = document.querySelector('input#name');
      const emailInput = document.querySelector('input#email');

      // Blur name field while empty
      fireEvent.blur(nameInput, { target: { name: 'name', value: '' } });

      // Name error appears
      expect(document.getElementById('name-error')).toBeInTheDocument();

      // Untouched email field does NOT have premature error
      expect(document.getElementById('email-error')).toBeNull();
      expect(emailInput).toHaveAttribute('aria-invalid', 'false');
    });

    it('1.11 Character counter: updates accurately and warns when exceeding 5000 characters', async () => {
      renderPortfolio();
      const messageInput = document.querySelector('textarea#message');

      // Check initial counter
      expect(screen.getByText('0/5000')).toBeInTheDocument();

      // Type 50 characters
      fireEvent.change(messageInput, { target: { name: 'message', value: 'A'.repeat(50) } });
      expect(screen.getByText('50/5000')).toBeInTheDocument();

      // Boundary: 5001 characters
      fireEvent.change(messageInput, { target: { name: 'message', value: 'A'.repeat(5001) } });
      const overCounter = screen.getByText('5001/5000');
      expect(overCounter).toBeInTheDocument();
      expect(overCounter.className).toContain('text-rose-600');
    });

    it('1.12 Security & XSS payload resilience: HTML/JS injection strings do not execute and are handled safely as strings', async () => {
      renderPortfolio();
      const fetchSpy = vi.spyOn(global, 'fetch');

      const nameInput = document.querySelector('input#name');
      const emailInput = document.querySelector('input#email');
      const messageInput = document.querySelector('textarea#message');
      const submitBtn = document.querySelector('section#contact form button[type="submit"]');

      const maliciousPayload = '<script>window.xssExploit=true;</script><img src="x" onerror="alert(1)">';

      fireEvent.change(nameInput, { target: { name: 'name', value: 'Security Researcher' } });
      fireEvent.change(emailInput, { target: { name: 'email', value: 'sec@research.org' } });
      fireEvent.change(messageInput, { target: { name: 'message', value: maliciousPayload } });

      const recaptchaBtn = screen.queryByTestId('recaptcha-verify-btn');
      if (recaptchaBtn) fireEvent.click(recaptchaBtn);

      fireEvent.click(submitBtn);

      await vi.waitFor(() => {
        expect(fetchSpy).toHaveBeenCalled();
      });

      // Assert script never executed
      expect(window.xssExploit).toBeUndefined();
    });
  });

  // ============================================================================
  // Suite 2: Network Resilience, Error States & Status Banners
  // ============================================================================
  describe('Suite 2: Network Resilience & Error States', () => {

    it('2.1 Valid submission displays accessible inline status banner (role="status") and resets form without blocking window.alert()', async () => {
      renderPortfolio();
      const alertSpy = vi.spyOn(window, 'alert');

      const nameInput = document.querySelector('input#name');
      const emailInput = document.querySelector('input#email');
      const messageInput = document.querySelector('textarea#message');
      const submitBtn = document.querySelector('section#contact form button[type="submit"]');

      fireEvent.change(nameInput, { target: { name: 'name', value: 'William Test' } });
      fireEvent.change(emailInput, { target: { name: 'email', value: 'william@test.com' } });
      fireEvent.change(messageInput, { target: { name: 'message', value: 'I would like to discuss an engineering role with you.' } });

      const recaptchaBtn = screen.queryByTestId('recaptcha-verify-btn');
      if (recaptchaBtn) fireEvent.click(recaptchaBtn);

      fireEvent.click(submitBtn);

      // Verify success status banner appears
      await vi.waitFor(() => {
        const successBanner = document.querySelector('div[role="status"]');
        expect(successBanner).toBeInTheDocument();
        expect(successBanner).toHaveAttribute('aria-live', 'polite');
        expect(successBanner).toHaveTextContent(/Message (Sent|Transmitted) Successfully/i);
        expect(successBanner).toHaveTextContent(/24 business hours/i);
      });

      // Verify form inputs were reset
      expect(nameInput.value).toBe('');
      expect(emailInput.value).toBe('');
      expect(messageInput.value).toBe('');

      // Verify window.alert was NOT called for successful submission
      expect(alertSpy).not.toHaveBeenCalled();
    });

    it('2.2 Simulated Formspree HTTP 500 error: displays accessible error alert banner (role="alert") and preserves user input', async () => {
      renderPortfolio();

      // Mock Formspree 500 failure
      vi.spyOn(global, 'fetch').mockImplementationOnce(() =>
        Promise.resolve({
          ok: false,
          status: 500,
          json: () => Promise.resolve({ error: 'Formspree Internal Server Error' }),
        })
      );

      const nameInput = document.querySelector('input#name');
      const emailInput = document.querySelector('input#email');
      const messageInput = document.querySelector('textarea#message');
      const submitBtn = document.querySelector('section#contact form button[type="submit"]');

      const typedMessage = 'This message should not be lost when server returns 500.';
      fireEvent.change(nameInput, { target: { name: 'name', value: 'Sarah Connor' } });
      fireEvent.change(emailInput, { target: { name: 'email', value: 'sarah@skynet-defense.org' } });
      fireEvent.change(messageInput, { target: { name: 'message', value: typedMessage } });

      const recaptchaBtn = screen.queryByTestId('recaptcha-verify-btn');
      if (recaptchaBtn) fireEvent.click(recaptchaBtn);

      fireEvent.click(submitBtn);

      // Verify accessible error banner appears with role="alert"
      await vi.waitFor(() => {
        const errorBanner = document.querySelector('div[role="alert"]');
        expect(errorBanner).toBeInTheDocument();
        expect(errorBanner).toHaveAttribute('aria-live', 'assertive');
        expect(errorBanner).toHaveTextContent(/Message Delivery Failed|Transmission Failed/i);
        expect(errorBanner).toHaveTextContent(/wiliamzwili135@gmail.com/i);
      });

      // Component remains intact and inputs are PRESERVED
      expect(nameInput.value).toBe('Sarah Connor');
      expect(emailInput.value).toBe('sarah@skynet-defense.org');
      expect(messageInput.value).toBe(typedMessage);

      // Submit button is re-enabled for user retry
      expect(submitBtn).not.toBeDisabled();
      expect(submitBtn).toHaveTextContent(/Send Message|Transmit Message/i);
    });

    it('2.3 Simulated Network Failure (TypeError / offline): displays accessible error alert banner and component does not crash', async () => {
      renderPortfolio();

      // Mock network connection failure
      vi.spyOn(global, 'fetch').mockImplementationOnce(() =>
        Promise.reject(new TypeError('Failed to fetch (net::ERR_INTERNET_DISCONNECTED)'))
      );

      const nameInput = document.querySelector('input#name');
      const emailInput = document.querySelector('input#email');
      const messageInput = document.querySelector('textarea#message');
      const submitBtn = document.querySelector('section#contact form button[type="submit"]');

      fireEvent.change(nameInput, { target: { name: 'name', value: 'Network Dropper' } });
      fireEvent.change(emailInput, { target: { name: 'email', value: 'drop@network.io' } });
      fireEvent.change(messageInput, { target: { name: 'message', value: 'Testing network disconnection resiliency.' } });

      const recaptchaBtn = screen.queryByTestId('recaptcha-verify-btn');
      if (recaptchaBtn) fireEvent.click(recaptchaBtn);

      fireEvent.click(submitBtn);

      // Verify error banner is shown
      await vi.waitFor(() => {
        const errorBanner = document.querySelector('div[role="alert"]');
        expect(errorBanner).toBeInTheDocument();
        expect(errorBanner).toHaveTextContent(/Message Delivery Failed|Transmission Failed/i);
      });

      // Component is alive and ready for retry
      expect(submitBtn).toBeInTheDocument();
      expect(submitBtn).not.toBeDisabled();
    });

    it('2.4 Simulated HTTP 429 Rate Limiting: handles gracefully with fallback guidance', async () => {
      renderPortfolio();

      vi.spyOn(global, 'fetch').mockImplementationOnce(() =>
        Promise.resolve({
          ok: false,
          status: 429,
          json: () => Promise.resolve({ error: 'Too Many Requests' }),
        })
      );

      const nameInput = document.querySelector('input#name');
      const emailInput = document.querySelector('input#email');
      const messageInput = document.querySelector('textarea#message');
      const submitBtn = document.querySelector('section#contact form button[type="submit"]');

      fireEvent.change(nameInput, { target: { name: 'name', value: 'Spam Bot' } });
      fireEvent.change(emailInput, { target: { name: 'email', value: 'bot@spam.com' } });
      fireEvent.change(messageInput, { target: { name: 'message', value: 'Rapid automated submission.' } });

      const recaptchaBtn = screen.queryByTestId('recaptcha-verify-btn');
      if (recaptchaBtn) fireEvent.click(recaptchaBtn);

      fireEvent.click(submitBtn);

      await vi.waitFor(() => {
        const errorBanner = document.querySelector('div[role="alert"]');
        expect(errorBanner).toBeInTheDocument();
        expect(errorBanner).toHaveTextContent(/wiliamzwili135@gmail.com/i);
      });
    });

    it('2.5 Submitting state: button displays spinner and aria-busy="true" during inflight request', async () => {
      renderPortfolio();

      let resolveFetch;
      vi.spyOn(global, 'fetch').mockImplementationOnce(() =>
        new Promise((resolve) => {
          resolveFetch = resolve;
        })
      );

      const nameInput = document.querySelector('input#name');
      const emailInput = document.querySelector('input#email');
      const messageInput = document.querySelector('textarea#message');
      const submitBtn = document.querySelector('section#contact form button[type="submit"]');

      fireEvent.change(nameInput, { target: { name: 'name', value: 'Inflight Tester' } });
      fireEvent.change(emailInput, { target: { name: 'email', value: 'inflight@test.com' } });
      fireEvent.change(messageInput, { target: { name: 'message', value: 'Testing inflight state indicators.' } });

      const recaptchaBtn = screen.queryByTestId('recaptcha-verify-btn');
      if (recaptchaBtn) fireEvent.click(recaptchaBtn);

      fireEvent.click(submitBtn);

      // Button should now be busy and disabled
      expect(submitBtn).toBeDisabled();
      expect(submitBtn).toHaveAttribute('aria-busy', 'true');
      expect(submitBtn).toHaveTextContent(/Sending\.\.\.|Transmitting\.\.\./i);

      // Resolve the fetch
      resolveFetch({ ok: true, status: 200, json: () => Promise.resolve({ success: true }) });

      await vi.waitFor(() => {
        expect(submitBtn).not.toBeDisabled();
        expect(submitBtn).toHaveAttribute('aria-busy', 'false');
      });
    });
  });

  // ============================================================================
  // Suite 3: Accessibility, Security & Internationalization (i18n)
  // ============================================================================
  describe('Suite 3: Accessibility & Internationalization (i18n)', () => {

    it('3.1 Form and input accessibility: adheres to WCAG 3.3.1, 3.3.2, and 4.1.2 requirements', () => {
      renderPortfolio();
      const form = document.querySelector('section#contact form');
      const nameInput = document.querySelector('input#name');
      const emailInput = document.querySelector('input#email');
      const messageInput = document.querySelector('textarea#message');

      expect(form).toHaveAttribute('aria-label');
      expect(nameInput).toHaveAttribute('aria-required', 'true');
      expect(emailInput).toHaveAttribute('aria-required', 'true');
      expect(messageInput).toHaveAttribute('aria-required', 'true');

      // Labels associated via htmlFor
      expect(document.querySelector('label[for="name"]')).toBeInTheDocument();
      expect(document.querySelector('label[for="email"]')).toBeInTheDocument();
      expect(document.querySelector('label[for="message"]')).toBeInTheDocument();
    });

    it('3.2 Indonesian locale (id) renders validation error messages in fluent Indonesian', async () => {
      // Set localStorage to Indonesian using verified portfolio_locale key
      window.localStorage.setItem('portfolio_locale', 'id');
      renderPortfolio();

      const submitBtn = document.querySelector('section#contact form button[type="submit"]');
      fireEvent.click(submitBtn);

      // Verify Indonesian localized errors
      const nameError = document.getElementById('name-error');
      const emailError = document.getElementById('email-error');
      const messageError = document.getElementById('message-error');
      const recaptchaError = document.getElementById('recaptcha-error');

      expect(nameError).toHaveTextContent(/Nama wajib diisi/i);
      expect(emailError).toHaveTextContent(/Email wajib diisi/i);
      expect(messageError).toHaveTextContent(/Pesan wajib diisi/i);
      expect(recaptchaError).toHaveTextContent(/reCAPTCHA/i);
    });

    it('3.3 Indonesian locale (id) renders success and error notification titles in fluent Indonesian', async () => {
      window.localStorage.setItem('portfolio_locale', 'id');
      renderPortfolio();

      // Test error banner in ID
      vi.spyOn(global, 'fetch').mockImplementationOnce(() => Promise.reject(new Error('Koneksi terputus')));

      const nameInput = document.querySelector('input#name');
      const emailInput = document.querySelector('input#email');
      const messageInput = document.querySelector('textarea#message');
      const submitBtn = document.querySelector('section#contact form button[type="submit"]');

      fireEvent.change(nameInput, { target: { name: 'name', value: 'Budi Santoso' } });
      fireEvent.change(emailInput, { target: { name: 'email', value: 'budi@perusahaan.co.id' } });
      fireEvent.change(messageInput, { target: { name: 'message', value: 'Pesan pengujian dalam bahasa Indonesia.' } });

      const recaptchaBtn = screen.queryByTestId('recaptcha-verify-btn');
      if (recaptchaBtn) fireEvent.click(recaptchaBtn);

      fireEvent.click(submitBtn);

      await vi.waitFor(() => {
        const errorBanner = document.querySelector('div[role="alert"]');
        expect(errorBanner).toBeInTheDocument();
        expect(errorBanner).toHaveTextContent(/Pengiriman (Pesan )?Gagal/i);
      });
    });

    it('3.4 Direct channels matrix: verifies direct email, LinkedIn, and GitHub links with safe security attributes', () => {
      renderPortfolio();
      const contactSection = document.getElementById('contact');

      // Email link
      const emailLink = contactSection.querySelector('a[href^="mailto:wiliamzwili135@gmail.com"]');
      expect(emailLink).toBeInTheDocument();
      expect(emailLink).toHaveAttribute('aria-label', expect.stringContaining('wiliamzwili135@gmail.com'));

      // LinkedIn link
      const linkedinLink = contactSection.querySelector('a[href*="linkedin.com/in/william-oo00"]');
      expect(linkedinLink).toBeInTheDocument();
      expect(linkedinLink).toHaveAttribute('target', '_blank');
      expect(linkedinLink).toHaveAttribute('rel', 'noopener noreferrer');

      // GitHub link
      const githubLink = contactSection.querySelector('a[href*="github.com/GaneshArwan"]');
      expect(githubLink).toBeInTheDocument();
      expect(githubLink).toHaveAttribute('target', '_blank');
      expect(githubLink).toHaveAttribute('rel', 'noopener noreferrer');

      // Location Jakarta
      expect(contactSection).toHaveTextContent(/Jakarta/i);
      expect(contactSection).toHaveTextContent(/WIB • UTC\+7/i);

      // Response SLA badge
      expect(contactSection).toHaveTextContent(/<24/i);
    });
  });
});
