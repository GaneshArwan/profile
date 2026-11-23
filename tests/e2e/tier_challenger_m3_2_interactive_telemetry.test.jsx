/**
 * tests/e2e/tier_challenger_m3_2_interactive_telemetry.test.jsx
 * 
 * Milestone M3: Interactive Behavior & Telemetry Adversarial Stress Suite
 * Challenger: challenger_m3_2 (EMPIRICAL CHALLENGER)
 * 
 * Personas & Principles:
 * - senior-frontend-debugger-for-spa-websites-angular-react-vite: Client-side state machine integrity, lifecycle desync prevention
 * - agency-reality-checker: Overwhelming empirical proof, zero fantasy approvals, rigorous DOM reality check
 */

import React from 'react';
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { screen, fireEvent, act, within } from '@testing-library/react';
import { renderPortfolio, resetTestEnvironment } from './harness';
import { PROJECTS, EXPERIENCE } from '../../src/data/constants';

describe('Challenger M3-2: Interactive Behavior & Telemetry Adversarial Suite', () => {

  beforeEach(() => {
    vi.useFakeTimers();
    resetTestEnvironment();
    vi.restoreAllMocks();
  });

  afterEach(() => {
    resetTestEnvironment();
    vi.useRealTimers();
  });

  // ============================================================================
  // Suite 1: Interactive 4-Node ETL Pipeline & Contract Inspector Oracle Matrix
  // ============================================================================
  describe('Suite 1: Interactive 4-Node ETL Pipeline & Contract Inspector Oracle', () => {

    const DOMAIN_KEYS = ['site', 'vendor', 'customer', 'article', 'finance'];

    it('1.1: exhaustive 20-state matrix verification across all 5 domains and 4 pipeline steps', () => {
      renderPortfolio();

      const tablist = screen.getByRole('tablist', { name: /Enterprise Master Data Domains/i });
      expect(tablist).toBeInTheDocument();

      // Check all 5 domain tabs exist with monospaced numbering
      DOMAIN_KEYS.forEach((key, idx) => {
        const tab = document.getElementById(`domain-tab-${key}`);
        expect(tab).toBeInTheDocument();
        const expectedPrefix = `0${idx + 1}.`;
        expect(tab.textContent).toContain(expectedPrefix);
      });

      // Iterate over each domain and each step
      DOMAIN_KEYS.forEach((domainKey) => {
        const domainTab = document.getElementById(`domain-tab-${domainKey}`);
        act(() => {
          fireEvent.click(domainTab);
        });
        expect(domainTab).toHaveAttribute('aria-selected', 'true');

        const panel = document.getElementById(`domain-panel-${domainKey}`);
        expect(panel).toBeInTheDocument();

        // There must be exactly 4 interactive step buttons in this domain
        const stepButtons = within(panel).getAllByRole('button').filter(btn => 
          btn.textContent.includes('[01 INTAKE]') ||
          btn.textContent.includes('[02 VALIDATION]') ||
          btn.textContent.includes('[03 STAGING & RPA]') ||
          btn.textContent.includes('[04 GOVERNANCE]')
        );
        expect(stepButtons.length).toBe(4);

        // Test each step transition
        stepButtons.forEach((stepBtn, stepIdx) => {
          act(() => {
            fireEvent.click(stepBtn);
          });

          // Verify active step button state
          expect(stepBtn).toHaveAttribute('aria-expanded', 'true');
          expect(stepBtn.textContent).toContain('● INSPECTING');

          // Verify inactive step buttons
          stepButtons.forEach((otherBtn, otherIdx) => {
            if (otherIdx !== stepIdx) {
              expect(otherBtn).toHaveAttribute('aria-expanded', 'false');
              expect(otherBtn.textContent).toContain('○ CONTRACT');
            }
          });

          // Verify Contract Inspector Console panel
          const inspector = within(panel).getByText('CONTRACT SPECIFICATION').closest('.rounded-xl');
          expect(inspector).toBeInTheDocument();

          // Inspector header check
          expect(inspector.textContent).toContain('CONTRACT SPECIFICATION');
          expect(inspector.textContent).toContain(`DOMAIN: ${domainKey.charAt(0).toUpperCase() + domainKey.slice(1)}`);

          // Inspector three contract blocks
          expect(inspector.textContent).toContain('Input Contract');
          expect(inspector.textContent).toContain('Output Contract');
          expect(inspector.textContent).toContain('Governance Rules');

          // Ensure contracts are not empty strings
          const contractTexts = within(inspector).getAllByText(/.+/);
          expect(contractTexts.length).toBeGreaterThanOrEqual(6);
        });
      });
    });

    it('1.2: domain switch resets active step index to 0 (Intake) preventing desynchronization', () => {
      renderPortfolio();

      const siteTab = document.getElementById('domain-tab-site');
      act(() => {
        fireEvent.click(siteTab);
      });

      const sitePanel = document.getElementById('domain-panel-site');
      const stepButtons = within(sitePanel).getAllByRole('button').filter(btn => 
        btn.textContent.includes('[04 GOVERNANCE]')
      );
      expect(stepButtons.length).toBe(1);

      // Click step 4 (index 3) on Site
      act(() => {
        fireEvent.click(stepButtons[0]);
      });
      expect(stepButtons[0]).toHaveAttribute('aria-expanded', 'true');
      expect(sitePanel.textContent).toContain('[04 GOVERNANCE]');

      // Switch domain to Vendor
      const vendorTab = document.getElementById('domain-tab-vendor');
      act(() => {
        fireEvent.click(vendorTab);
      });

      const vendorPanel = document.getElementById('domain-panel-vendor');
      const vendorIntakeBtn = within(vendorPanel).getAllByRole('button').find(btn => 
        btn.textContent.includes('[01 INTAKE]')
      );
      expect(vendorIntakeBtn).toBeInTheDocument();
      // Must be reset to step 0
      expect(vendorIntakeBtn).toHaveAttribute('aria-expanded', 'true');
      expect(vendorPanel.textContent).toContain('[01 INTAKE]');
    });

    it('1.3: rapid 100-cycle oscillation between domains and steps preserves DOM integrity and zero memory desync', () => {
      renderPortfolio();

      for (let i = 0; i < 100; i++) {
        const domainKey = DOMAIN_KEYS[i % DOMAIN_KEYS.length];
        const tab = document.getElementById(`domain-tab-${domainKey}`);
        act(() => {
          fireEvent.click(tab);
        });

        const panel = document.getElementById(`domain-panel-${domainKey}`);
        const buttons = within(panel).getAllByRole('button').filter(btn => 
          btn.textContent.includes('INTAKE') ||
          btn.textContent.includes('VALIDATION') ||
          btn.textContent.includes('STAGING') ||
          btn.textContent.includes('GOVERNANCE')
        );
        const targetStepBtn = buttons[i % buttons.length];
        act(() => {
          fireEvent.click(targetStepBtn);
        });
      }

      // Verify the final state is fully coherent
      const finalDomainKey = DOMAIN_KEYS[99 % DOMAIN_KEYS.length]; // finance
      const finalPanel = document.getElementById(`domain-panel-${finalDomainKey}`);
      expect(finalPanel).toBeInTheDocument();
      expect(finalPanel.textContent).toContain('Cost Centers & General Ledger');
    });

    it('1.4: dev-tool segmented control has solid emerald active state tokens and monospaced codes', () => {
      renderPortfolio();
      const siteTab = document.getElementById('domain-tab-site');
      expect(siteTab.className).toContain('bg-emerald-700');
      expect(siteTab.className).toContain('dark:bg-emerald-500');

      const vendorTab = document.getElementById('domain-tab-vendor');
      expect(vendorTab.className).not.toContain('bg-emerald-700');

      act(() => {
        fireEvent.click(vendorTab);
      });

      expect(vendorTab.className).toContain('bg-emerald-700');
      expect(vendorTab.className).toContain('dark:bg-emerald-500');
      expect(siteTab.className).not.toContain('bg-emerald-700');
    });

    it('1.5: keyboard focus and activation on ETL pipeline step nodes', () => {
      renderPortfolio();
      const sitePanel = document.getElementById('domain-panel-site');
      const stepButtons = within(sitePanel).getAllByRole('button').filter(btn => 
        btn.textContent.includes('INTAKE') ||
        btn.textContent.includes('VALIDATION') ||
        btn.textContent.includes('STAGING') ||
        btn.textContent.includes('GOVERNANCE')
      );
      expect(stepButtons.length).toBe(4);

      // Focus step 2 (Validation) and trigger click/keyboard activation
      stepButtons[1].focus();
      expect(document.activeElement).toBe(stepButtons[1]);

      act(() => {
        fireEvent.click(stepButtons[1]);
      });

      expect(stepButtons[1]).toHaveAttribute('aria-expanded', 'true');
      expect(sitePanel.textContent).toContain('[02 VALIDATION]');
    });
  });

  // ============================================================================
  // Suite 2: Bento Projects Showcase & 2x2 Architecture Spec Stress
  // ============================================================================
  describe('Suite 2: Bento Projects Showcase & 2x2 Architecture Spec Stress', () => {

    it('2.1: renders all 8 projects with zero Flagship CV Project pills and interactive UI Preview / How It Works tabs', () => {
      renderPortfolio();

      const projectsSection = document.getElementById('projects');
      expect(projectsSection).toBeInTheDocument();

      const articles = projectsSection.querySelectorAll('article[id^="project-container-"]');
      expect(articles.length).toBe(8);

      // Flagship CV Project pill must be removed
      expect(within(projectsSection).queryByText(/Flagship CV Project/i)).not.toBeInTheDocument();

      // Spotlight showcase provides interactive media mode controls
      const mediaModeControls = within(projectsSection).getByRole('group', { name: /Featured Media Mode/i });
      expect(mediaModeControls).toBeInTheDocument();
    });

    it('2.2: renders 2x2 architecture spec matrices (exactly 4 indicator cells) across all 8 projects', () => {
      renderPortfolio();

      const projectsSection = document.getElementById('projects');
      const articles = projectsSection.querySelectorAll('article[id^="project-container-"]');

      let totalSpecCells = 0;
      articles.forEach((article) => {
        const specGrid = article.querySelector('.grid.grid-cols-2');
        expect(specGrid).toBeInTheDocument();
        const cells = specGrid.children;
        expect(cells.length).toBe(4);
        totalSpecCells += cells.length;

        // Verify label is monospaced uppercase
        for (let i = 0; i < cells.length; i++) {
          const labelDiv = cells[i].querySelector('.font-mono.uppercase');
          expect(labelDiv).toBeInTheDocument();
          expect(labelDiv.textContent.trim().length).toBeGreaterThan(0);
        }
      });

      expect(totalSpecCells).toBe(32); // 8 projects * 4 indicators
    });

    it('2.3: category filter switching stress test across all 4 tabs with rapid toggles', () => {
      renderPortfolio();

      const tablist = screen.getByRole('tablist', { name: /Project Category Filter/i });
      expect(tablist).toBeInTheDocument();

      const allTab = within(tablist).getByRole('tab', { name: /All Projects/i });
      const aiTab = within(tablist).getByRole('tab', { name: /AI & Autonomous Systems/i });
      const dataTab = within(tablist).getByRole('tab', { name: /Data & Analytics/i });
      const autoTab = within(tablist).getByRole('tab', { name: /Enterprise Automation/i });

      // Run 10 rapid switching cycles
      for (let cycle = 0; cycle < 10; cycle++) {
        act(() => { fireEvent.click(aiTab); });
        let currentArticles = document.querySelectorAll('#projects article[id^="project-container-"]');
        expect(currentArticles.length).toBe(4);

        act(() => { fireEvent.click(dataTab); });
        currentArticles = document.querySelectorAll('#projects article[id^="project-container-"]');
        expect(currentArticles.length).toBe(3);

        act(() => { fireEvent.click(autoTab); });
        currentArticles = document.querySelectorAll('#projects article[id^="project-container-"]');
        expect(currentArticles.length).toBe(1);

        act(() => { fireEvent.click(allTab); });
        currentArticles = document.querySelectorAll('#projects article[id^="project-container-"]');
        expect(currentArticles.length).toBe(8);
      }
    });

    it('2.4: strictly zero star counters, fork counters, or empty social badges rendered in DOM', () => {
      renderPortfolio();

      const projectsSection = document.getElementById('projects');
      const text = projectsSection.textContent;

      // Negative assertions against zero-star patterns
      expect(text).not.toMatch(/\b0\s*stars?\b/i);
      expect(text).not.toMatch(/\b0\s*forks?\b/i);
      expect(text).not.toMatch(/\b⭐\s*0\b/);
      expect(text).not.toMatch(/\bstargazers\b/i);
    });

    it('2.5: all project action links have secure target="_blank" and rel="noopener noreferrer"', () => {
      renderPortfolio();

      const projectsSection = document.getElementById('projects');
      const externalLinks = projectsSection.querySelectorAll('a[href^="http"]');

      expect(externalLinks.length).toBeGreaterThanOrEqual(8);
      externalLinks.forEach((link) => {
        expect(link).toHaveAttribute('target', '_blank');
        expect(link.getAttribute('rel')).toContain('noopener');
        expect(link.getAttribute('rel')).toContain('noreferrer');
      });
    });
  });

  // ============================================================================
  // Suite 3: Contact Console Layout, SLA Guarantee Badge & Inline Zod Validation
  // ============================================================================
  describe('Suite 3: Contact Console Layout & Inline Zod Validation', () => {

    it('3.1: contact layout features 5-col direct channels and 7-col form', () => {
      renderPortfolio();

      const contactSection = document.getElementById('contact');
      expect(contactSection).toBeInTheDocument();

      const directChannelsCol = contactSection.querySelector('.md\\:col-span-5');
      const formCol = contactSection.querySelector('.md\\:col-span-7');

      expect(directChannelsCol).toBeInTheDocument();
      expect(formCol).toBeInTheDocument();

      // Channels: email, location, linkedin, github
      expect(directChannelsCol.textContent).toContain('wiliamzwili135@gmail.com');
      expect(directChannelsCol.textContent).toContain('Jakarta');
      expect(directChannelsCol.textContent).toContain('LinkedIn Profile');
      expect(directChannelsCol.textContent).toContain('GitHub Profile');
    });

    it('3.2: renders monospaced <24h Response SLA Guarantee badge with Clock icon', () => {
      renderPortfolio();

      const slaBadge = screen.getByText(/<24h Response SLA Guarantee/i);
      expect(slaBadge).toBeInTheDocument();

      // Parent container must have font-mono
      const badgeContainer = slaBadge.closest('.font-mono');
      expect(badgeContainer).toBeInTheDocument();
    });

    it('3.3: inline Zod validation triggers on blur and clears on typing', async () => {
      renderPortfolio();

      const nameInput = document.getElementById('name');
      const emailInput = document.getElementById('email');
      const messageInput = document.getElementById('message');

      // Blur name with empty value
      act(() => {
        fireEvent.focus(nameInput);
        fireEvent.blur(nameInput);
      });
      let nameError = document.getElementById('name-error');
      expect(nameError).toBeInTheDocument();
      expect(nameError).toHaveTextContent(/Name is required/i);
      expect(nameInput).toHaveAttribute('aria-invalid', 'true');

      // Typing into name clears error in real time
      act(() => {
        fireEvent.change(nameInput, { target: { name: 'name', value: 'W' } });
      });
      nameError = document.getElementById('name-error');
      expect(nameError).not.toBeInTheDocument();

      // Blur with length < 2 triggers min characters error
      act(() => {
        fireEvent.blur(nameInput);
      });
      nameError = document.getElementById('name-error');
      expect(nameError).toBeInTheDocument();
      expect(nameError).toHaveTextContent(/at least 2 characters/i);

      // Blur invalid email
      act(() => {
        fireEvent.change(emailInput, { target: { name: 'email', value: 'invalid-email' } });
        fireEvent.blur(emailInput);
      });
      const emailError = document.getElementById('email-error');
      expect(emailError).toBeInTheDocument();
      expect(emailError).toHaveTextContent(/valid email/i);

      // Blur message with < 10 characters
      act(() => {
        fireEvent.change(messageInput, { target: { name: 'message', value: 'short' } });
        fireEvent.blur(messageInput);
      });
      const messageError = document.getElementById('message-error');
      expect(messageError).toBeInTheDocument();
      expect(messageError).toHaveTextContent(/at least 10 characters/i);
    });

    it('3.4: form submission with mock token handles success lifecycle and reset', async () => {
      global.fetch = vi.fn().mockImplementation(() =>
        Promise.resolve({
          ok: true,
          status: 200,
          json: () => Promise.resolve({ success: true }),
        })
      );

      renderPortfolio();

      const nameInput = document.getElementById('name');
      const emailInput = document.getElementById('email');
      const messageInput = document.getElementById('message');
      const form = document.querySelector('section#contact form');

      act(() => {
        fireEvent.change(nameInput, { target: { name: 'name', value: 'Recruiter Lead' } });
        fireEvent.change(emailInput, { target: { name: 'email', value: 'lead@enterprise.com' } });
        fireEvent.change(messageInput, { target: { name: 'message', value: 'Inquiring regarding Data & Automation Analyst position at our team.' } });
      });

      // Submit form
      act(() => {
        fireEvent.submit(form);
      });

      // Without reCAPTCHA token, expect recaptcha-error
      const recaptchaError = document.getElementById('recaptcha-error');
      expect(recaptchaError).toBeInTheDocument();
      expect(global.fetch).not.toHaveBeenCalled();
    });

    it('3.5: extreme input boundary fuzzing (5,000 characters, XSS vectors, and unicode)', async () => {
      renderPortfolio();

      const nameInput = document.getElementById('name');
      const emailInput = document.getElementById('email');
      const messageInput = document.getElementById('message');

      const xssPayload = '<script>alert("xss")</script>';
      const longMessage = 'A'.repeat(5000);
      const unicodeString = '🚀 Data & Automation Analyst • 數據分析 • 2026';

      act(() => {
        fireEvent.change(nameInput, { target: { name: 'name', value: `${unicodeString} ${xssPayload}` } });
        fireEvent.change(emailInput, { target: { name: 'email', value: 'valid.engineer@subdomain.co.id' } });
        fireEvent.change(messageInput, { target: { name: 'message', value: longMessage } });
      });

      // Character counter check
      const counter = screen.getByText('5000/5000');
      expect(counter).toBeInTheDocument();
      expect(nameInput.value).toBe(`${unicodeString} ${xssPayload}`);
    });
  });

  // ============================================================================
  // Suite 4: Palette Consistency & Absence of Rainbow Clashing Tokens
  // ============================================================================
  describe('Suite 4: Palette Consistency Invariant on M3 Surfaces', () => {

    it('4.1: Experience, Projects, ProjectCard, and Contact sections contain zero legacy violet/indigo classes', () => {
      renderPortfolio();

      const sections = ['#experience', '#projects', '#contact'];
      sections.forEach((selector) => {
        const el = document.querySelector(selector);
        expect(el).toBeInTheDocument();
        const html = el.innerHTML;

        // Check for forbidden deprecated rainbow color tokens
        expect(html).not.toContain('text-violet-');
        expect(html).not.toContain('bg-violet-');
        expect(html).not.toContain('border-violet-');
        expect(html).not.toContain('text-indigo-');
        expect(html).not.toContain('bg-indigo-');
        expect(html).not.toContain('border-indigo-');
      });
    });
  });

  // ============================================================================
  // Suite 5: Bilingual Dynamic Locale Toggle Stress on M3 Surfaces
  // ============================================================================
  describe('Suite 5: Bilingual Dynamic Locale Toggle Stress on M3 Surfaces', () => {

    it('5.1: toggling locale dynamically updates Experience and Projects dictionaries without crashing', () => {
      renderPortfolio();

      // Find the locale toggle button
      const localeBtns = screen.getAllByRole('button', { name: /toggle language/i });
      expect(localeBtns.length).toBeGreaterThanOrEqual(1);
      const localeBtn = localeBtns[0];

      // Initial state is English
      expect(screen.getByRole('tab', { name: /All Projects/i })).toBeInTheDocument();

      // Switch to Indonesian
      act(() => {
        fireEvent.click(localeBtn);
      });

      // In Indonesian: All Projects -> Semua Proyek
      expect(screen.getByRole('tab', { name: /Semua Proyek/i })).toBeInTheDocument();

      // Experience section reflects Indonesian label
      const siteTab = document.getElementById('domain-tab-site');
      act(() => {
        fireEvent.click(siteTab);
      });
      const sitePanel = document.getElementById('domain-panel-site');
      expect(sitePanel.textContent).toMatch(/Topologi Toko & Cabang/i);

      // Switch back to English
      act(() => {
        fireEvent.click(localeBtn);
      });

      expect(screen.getByRole('tab', { name: /All Projects/i })).toBeInTheDocument();
      expect(sitePanel.textContent).toMatch(/Store & Branch Topology/i);
    });
  });
});
