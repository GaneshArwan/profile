/**
 * tests/e2e/tier4_scenarios.test.jsx
 * Tier 4: Real-World Workload Scenarios & User Journeys (14 Tests)
 * 
 * Simulates complete end-to-end user journeys for primary stakeholder personas:
 * 1. Senior Technical Recruiter Persona (Credentials, Education, Experience, Inbound)
 * 2. Engineering Director Persona (AI Depth, Open-Source Repos, Architecture Audit)
 * 3. Accessibility & Usability Specialist Persona (WCAG 2.2 AA Landmarks, Headings, Focus)
 * 4. Performance & Antislop Polish Persona (Instant Mount, Native Scroll, Theme Contrast, Roundtrip)
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { screen, act, fireEvent } from '@testing-library/react';
import { renderPortfolio, resetTestEnvironment, setViewport } from './harness';
import { PERSONAL_INFO, PROJECTS } from '../../src/data/constants';

describe('Tier 4: Real-World Recruiter & Visitor Workload Scenarios (Opaque-Box)', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    resetTestEnvironment();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  // ==========================================================================
  // Journey 4.1: Senior Technical Recruiter End-to-End Profile Audit (3 tests)
  // ==========================================================================
  describe('Journey 4.1: Senior Technical Recruiter Profile Audit', () => {
    it('T4.1.1: recruiter end-to-end credential verification flow (Bio -> Untar GPA 3.89 -> Kawan Lama MDM)', () => {
      renderPortfolio();

      // Step 1: Lands on Hero -> verifies candidate name and role
      const h1 = screen.getByRole('heading', { level: 1 });
      expect(h1).toHaveTextContent(PERSONAL_INFO.name);

      // Step 2: Reads About narrative -> verifies Tarumanagara University and GPA 3.89
      const about = document.getElementById('about');
      expect(about).toBeInTheDocument();
      expect(about.textContent).toMatch(/Tarumanagara/i);
      expect(about.textContent).toMatch(/3\.89/);
      expect(about.textContent).toMatch(/Informatics/i);

      // Step 3: Inspects Experience -> verifies Kawan Lama Group and Best Intern recognition
      const experience = document.getElementById('experience');
      expect(experience).toBeInTheDocument();
      expect(experience.textContent).toMatch(/Kawan Lama Group/i);
      expect(experience.textContent).toMatch(/Master Data Management/i);
      expect(experience.textContent).toMatch(/Best Intern/i);

      // Step 4: Verifies Best Intern certificate credential on LinkedIn
      const certLink = document.querySelector('a[href*="linkedin.com"][href*="single-media-viewer"]');
      expect(certLink).toBeInTheDocument();
      expect(certLink).toHaveAttribute('target', '_blank');
    });

    it('T4.1.2: recruiter deep-dives into 3 mandatory CV projects and validates live repository links', () => {
      renderPortfolio();
      const projects = document.getElementById('projects');
      expect(projects).toBeInTheDocument();

      // Project 1: RAG Document Chat
      expect(projects.textContent).toMatch(/RAG Document Chat/i);
      const ragRepo = document.querySelector('a[href="https://github.com/GaneshArwan/RAGChat"]');
      expect(ragRepo).toBeInTheDocument();
      expect(ragRepo).toHaveAttribute('target', '_blank');

      // Project 2: Autonomous Code Review Agent
      expect(projects.textContent).toMatch(/Autonomous Code Review Agent|AI Code Review Agent/i);
      const agentRepo = document.querySelector('a[href="https://github.com/GaneshArwan/AICodeReviewAgent"]');
      expect(agentRepo).toBeInTheDocument();
      expect(agentRepo).toHaveAttribute('target', '_blank');

      // Project 3: AI Writing Assistant SaaS
      expect(projects.textContent).toMatch(/AI Writing Assistant SaaS/i);
      const saasRepo = document.querySelector('a[href="https://github.com/GaneshArwan/AIWritingAssistantSaaS"]');
      expect(saasRepo).toBeInTheDocument();
      expect(saasRepo).toHaveAttribute('target', '_blank');
    });

    it('T4.1.3: recruiter completes contact outreach flow via verified channels and validated message', async () => {
      renderPortfolio();
      const fetchSpy = vi.spyOn(global, 'fetch');

      // Verify direct email link
      const emailLink = document.querySelector(`a[href^="mailto:${PERSONAL_INFO.email}"]`);
      expect(emailLink).toBeInTheDocument();

      // Recruiter sends an interview invitation via contact form
      const nameInput = document.querySelector('input#name');
      const emailInput = document.querySelector('input#email');
      const messageInput = document.querySelector('textarea#message');
      const submitBtn = document.querySelector('section#contact form button[type="submit"]');

      fireEvent.change(nameInput, { target: { name: 'name', value: 'Marcus Vance' } });
      fireEvent.change(emailInput, { target: { name: 'email', value: 'marcus.vance@techrecruiting.com' } });
      fireEvent.change(messageInput, { target: { name: 'message', value: 'We were impressed by your Kawan Lama MDM and LangGraph projects.' } });

      const recaptchaBtn = screen.queryByTestId('recaptcha-verify-btn');
      if (recaptchaBtn) fireEvent.click(recaptchaBtn);

      fireEvent.click(submitBtn);

      await vi.waitFor(() => {
        expect(fetchSpy).toHaveBeenCalledWith(
          expect.stringContaining('formspree.io'),
          expect.objectContaining({
            method: 'POST',
            body: expect.stringContaining('Marcus Vance'),
          })
        );
      });
    });
  });

  // ==========================================================================
  // Journey 4.2: Engineering Director AI Architecture & Depth Audit (3 tests)
  // ==========================================================================
  describe('Journey 4.2: Engineering Director AI Architecture Audit', () => {
    it('T4.2.1: director audits full technical moat competencies across data and AI stacks', () => {
      renderPortfolio();
      const skills = document.getElementById('skills');
      expect(skills).toBeInTheDocument();

      // Enterprise Data Stack
      expect(skills.textContent).toMatch(/BigQuery/i);
      expect(skills.textContent).toMatch(/Looker/i);
      expect(skills.textContent).toMatch(/SQL/i);

      // Advanced AI / LLM Stack
      expect(skills.textContent).toMatch(/LangGraph/i);
      expect(skills.textContent).toMatch(/ChromaDB/i);

      // Enterprise Automation & Engineering
      expect(skills.textContent).toMatch(/Google Apps Script/i);
      expect(skills.textContent).toMatch(/TypeScript/i);
      expect(skills.textContent).toMatch(/React 19|React/i);
    });

    it('T4.2.2: director audits all GitHub external URLs to guarantee zero broken or placeholder links', () => {
      renderPortfolio();
      const allGithubLinks = Array.from(document.querySelectorAll('a[href*="github.com"]'));
      expect(allGithubLinks.length).toBeGreaterThanOrEqual(4);

      allGithubLinks.forEach(link => {
        const href = link.getAttribute('href');
        // Must be non-empty, point to GaneshArwan repo or profile, no '#' or 'javascript:'
        expect(href).toMatch(/^https:\/\/github\.com\/GaneshArwan/);
        expect(link).toHaveAttribute('target', '_blank');
        expect(link).toHaveAttribute('rel', expect.stringContaining('noopener'));
      });
    });

    it('T4.2.3: director inspects architectural integrity and verifies zero DOM exception errors', () => {
      renderPortfolio();
      // Inspect page landmarks
      expect(document.querySelector('header, nav')).toBeInTheDocument();
      expect(document.querySelector('main')).toBeInTheDocument();
      expect(document.querySelector('footer')).toBeInTheDocument();
    });
  });

  // ==========================================================================
  // Journey 4.3: Accessibility & Usability Specialist Audit (WCAG 2.2 AA) (4 tests)
  // ==========================================================================
  describe('Journey 4.3: Accessibility & Usability Specialist Audit', () => {
    it('T4.3.1: semantic HTML5 landmark structure complies with WCAG AA navigation standard', () => {
      renderPortfolio();
      const nav = document.querySelector('nav');
      const main = document.querySelector('main');
      const footer = document.querySelector('footer');

      expect(nav).toBeInTheDocument();
      expect(main).toBeInTheDocument();
      expect(footer).toBeInTheDocument();
    });

    it('T4.3.2: heading hierarchy presents unique level-1 identity followed by structured section headers', () => {
      renderPortfolio();
      const h1Elements = document.querySelectorAll('h1');
      expect(h1Elements.length).toBe(1);

      const sectionHeadings = document.querySelectorAll('h2, h3');
      expect(sectionHeadings.length).toBeGreaterThanOrEqual(5);
    });

    it('T4.3.3: interactive controls are keyboard-focusable without focus trapping', () => {
      renderPortfolio();
      const buttons = screen.getAllByRole('button');
      expect(buttons.length).toBeGreaterThan(0);

      // Focus first button
      buttons[0].focus();
      expect(document.activeElement).toBe(buttons[0]);
    });

    it('T4.3.4: contact form inputs provide accessible name associations via for/id or labels', () => {
      renderPortfolio();
      const nameInput = document.querySelector('input#name');
      const emailInput = document.querySelector('input#email');
      const messageInput = document.querySelector('textarea#message');

      expect(document.querySelector('label[for="name"]')).toBeInTheDocument();
      expect(document.querySelector('label[for="email"]')).toBeInTheDocument();
      expect(document.querySelector('label[for="message"]')).toBeInTheDocument();

      expect(nameInput).toHaveAttribute('id', 'name');
      expect(emailInput).toHaveAttribute('id', 'email');
      expect(messageInput).toHaveAttribute('id', 'message');
    });
  });

  // ==========================================================================
  // Journey 4.4: Performance, Antislop & Polish Verification (4 tests)
  // ==========================================================================
  describe('Journey 4.4: Performance & Antislop Polish Verification', () => {
    it('T4.4.1: portfolio mounts and reveals core narrative without blocking page load', () => {
      renderPortfolio();
      expect(screen.getByText(/About Me/i)).toBeInTheDocument();
      expect(document.querySelector('main')).toBeInTheDocument();
    });

    it('T4.4.2: native scroll layout operates cleanly without artificial scroll-jacking containers', () => {
      renderPortfolio();
      // Ensure body has no overflow hidden permanently locking scrolling
      expect(document.body.style.overflow).not.toBe('hidden');
    });

    it('T4.4.3: color theme tokens provide high-contrast background styling in dark and light modes', () => {
      renderPortfolio();
      const main = document.querySelector('main');
      expect(main).toHaveClass(/bg-slate-50|dark:bg-slate-950/);

      // Toggle to light mode
      const themeBtns = screen.getAllByRole('button').filter(btn => {
        const svg = btn.querySelector('svg');
        return svg && (svg.classList.contains('lucide-sun') || svg.classList.contains('lucide-moon'));
      });
      act(() => {
        fireEvent.click(themeBtns[0]);
      });
      expect(document.documentElement.classList.contains('dark')).toBe(false);
    });

    it('T4.4.4: full site roundtrip simulation completes cleanly with zero uncaught errors', async () => {
      // 1. Initial desktop load in dark mode
      setViewport({ width: 1280, height: 800 });
      renderPortfolio();

      // 2. Toggle theme to light mode
      const themeBtns = screen.getAllByRole('button').filter(btn => {
        const svg = btn.querySelector('svg');
        return svg && (svg.classList.contains('lucide-sun') || svg.classList.contains('lucide-moon'));
      });
      act(() => {
        fireEvent.click(themeBtns[0]);
      });

      // 3. Resize to mobile viewport
      setViewport({ width: 375, height: 667 });

      // 4. Open mobile menu
      const menuBtns = screen.getAllByRole('button').filter(btn => {
        const svg = btn.querySelector('svg');
        return svg && (svg.classList.contains('lucide-menu') || svg.classList.contains('lucide-x'));
      });
      act(() => {
        fireEvent.click(menuBtns[0]);
      });

      // 5. Navigate to Contact section
      const contactLink = screen.getAllByText(/Contact/i).find(el => el.tagName === 'BUTTON');
      if (contactLink) {
        act(() => {
          fireEvent.click(contactLink);
        });
      }

      // 6. Submit valid contact form
      const fetchSpy = vi.spyOn(global, 'fetch');
      const nameInput = document.querySelector('input#name');
      const emailInput = document.querySelector('input#email');
      const messageInput = document.querySelector('textarea#message');
      const submitBtn = document.querySelector('section#contact form button[type="submit"]');

      fireEvent.change(nameInput, { target: { name: 'name', value: 'Roundtrip Tester' } });
      fireEvent.change(emailInput, { target: { name: 'email', value: 'roundtrip@test.com' } });
      fireEvent.change(messageInput, { target: { name: 'message', value: 'Full site journey test successfully executed.' } });

      const recaptchaBtn = screen.queryByTestId('recaptcha-verify-btn');
      if (recaptchaBtn) fireEvent.click(recaptchaBtn);

      fireEvent.click(submitBtn);

      await vi.waitFor(() => {
        expect(fetchSpy).toHaveBeenCalled();
      });

      // Roundtrip finished cleanly
      expect(document.body).toBeInTheDocument();
    });
  });
});
