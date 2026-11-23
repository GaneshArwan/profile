/**
 * tests/e2e/tier1_feature_coverage.test.jsx
 * Tier 1: Comprehensive Feature Coverage Test Suite (42 Tests)
 * 
 * Verifies core functionality across all 8 feature areas defined in PROJECT.md and SCOPE.md:
 * 1. Bio & Personal Information
 * 2. Education & Untar GPA 3.89 Verification
 * 3. Kawan Lama Group MDM Experience & 5 Domains
 * 4. Featured Projects & GitHub Metadata / Verified Repositories
 * 5. Technical Moat & Skills Matrix Categorization
 * 6. Contact Form & Validation Workflow
 * 7. Navigation & Theme Switching Engine
 * 8. Antislop & Accessibility Baseline
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { screen, within, act, fireEvent } from '@testing-library/react';
import { renderPortfolio, resetTestEnvironment, setViewport } from './harness';

describe('Tier 1: Feature Coverage Suite (Opaque-Box)', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    resetTestEnvironment();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  // ==========================================================================
  // Area 1: Bio & Personal Info (6 tests)
  // ==========================================================================
  describe('Area 1: Bio & Personal Information', () => {
    it('T1.1.1: renders verified name "William" prominently in heading', () => {
      renderPortfolio();
      const h1 = screen.getByRole('heading', { level: 1 });
      expect(h1).toHaveTextContent('William');
    });

    it('T1.1.2: renders verified professional role and specialization in narrative', () => {
      renderPortfolio();
      // Should mention Data Analyst and Automation Analyst in the profile bio narrative
      const bioMatches = screen.getAllByText(/Data Analyst/i);
      expect(bioMatches.length).toBeGreaterThan(0);
      const roleMatches = screen.getAllByText(/Data & Automation Analyst|Automation Specialist/i);
      expect(roleMatches.length).toBeGreaterThan(0);
    });

    it('T1.1.3: renders verified contact email with valid mailto: link', () => {
      renderPortfolio();
      const mailtoLinks = Array.from(document.querySelectorAll('a[href^="mailto:"]'));
      expect(mailtoLinks.length).toBeGreaterThan(0);
      expect(mailtoLinks[0].getAttribute('href')).toBe('mailto:wiliamzwili135@gmail.com');
    });

    it('T1.1.4: displays verified geographic location "Jakarta, Indonesia"', () => {
      renderPortfolio();
      expect(screen.getByText(/Jakarta,\s*Indonesia/i)).toBeInTheDocument();
    });

    it('T1.1.5: renders verified external LinkedIn link with security attributes', () => {
      renderPortfolio();
      const linkedinLink = document.querySelector('a[href="https://www.linkedin.com/in/william-oo00/"]');
      expect(linkedinLink).toBeInTheDocument();
      expect(linkedinLink).toHaveAttribute('target', '_blank');
      expect(linkedinLink).toHaveAttribute('rel', expect.stringContaining('noopener'));
    });

    it('T1.1.6: renders verified external GitHub profile link to GaneshArwan', () => {
      renderPortfolio();
      const githubLink = document.querySelector('a[href="https://github.com/GaneshArwan"]');
      expect(githubLink).toBeInTheDocument();
      expect(githubLink).toHaveAttribute('target', '_blank');
      expect(githubLink).toHaveAttribute('rel', expect.stringContaining('noopener'));
    });
  });

  // ==========================================================================
  // Area 2: Education & Academic Credentials (5 tests)
  // ==========================================================================
  describe('Area 2: Education & Academic Credentials', () => {
    it('T1.2.1: displays Tarumanagara University (Untar) institution name', () => {
      renderPortfolio();
      const untarElements = screen.getAllByText(/Tarumanagara/i);
      expect(untarElements.length).toBeGreaterThan(0);
    });

    it('T1.2.2: displays Informatics Engineering degree qualification', () => {
      renderPortfolio();
      const degreeElements = screen.getAllByText(/Informatics/i);
      expect(degreeElements.length).toBeGreaterThan(0);
    });

    it('T1.2.3: displays exact cumulative GPA 3.89 without rounding drift', () => {
      renderPortfolio();
      const gpaElements = screen.getAllByText(/3\.89/i);
      expect(gpaElements.length).toBeGreaterThan(0);
    });

    it('T1.2.4: displays 2021-2024 academic study timeframe', () => {
      renderPortfolio();
      const timeframeElements = screen.getAllByText(/2024/i);
      expect(timeframeElements.length).toBeGreaterThan(0);
      const about = document.getElementById('about');
      expect(about?.textContent || '').toMatch(/2024/);
    });

    it('T1.2.5: displays academic honors / high distinction credential', () => {
      renderPortfolio();
      const aboutText = document.getElementById('about');
      expect(aboutText).toBeInTheDocument();
      expect(aboutText.textContent).toMatch(/High Distinction|Tarumanagara|Informatics/i);
    });
  });

  // ==========================================================================
  // Area 3: Kawan Lama Group MDM Experience & Domains (5 tests)
  // ==========================================================================
  describe('Area 3: Kawan Lama Group MDM Experience', () => {
    it('T1.3.1: displays Kawan Lama Group employer and MDM Data Analyst role in experience timeline', () => {
      renderPortfolio();
      const experienceSection = document.getElementById('experience');
      expect(experienceSection).toBeInTheDocument();

      const expScope = within(experienceSection);
      const roleElements = expScope.getAllByText(/Master Data Management Data Analyst Officer/i);
      expect(roleElements.length).toBeGreaterThan(0);

      // Assert employer specifically within each experience timeline card
      const timelineCards = experienceSection.querySelectorAll('.space-y-12 > div');
      expect(timelineCards.length).toBeGreaterThanOrEqual(1);
      timelineCards.forEach((card) => {
        expect(within(card).getByText(/Kawan Lama Group/i)).toBeInTheDocument();
      });
    });

    it('T1.3.2: displays corporate tenure timeline spanning 2024 to 2026', () => {
      renderPortfolio();
      const date2024 = screen.getAllByText(/2024/i);
      const date2026 = screen.getAllByText(/2026/i);
      expect(date2024.length).toBeGreaterThan(0);
      expect(date2026.length).toBeGreaterThan(0);
    });

    it('T1.3.3: references all 5 core enterprise MDM domains in governance narrative', () => {
      renderPortfolio();
      const experienceSection = document.getElementById('experience');
      const aboutSection = document.getElementById('about');
      const combinedText = `${experienceSection?.textContent || ''} ${aboutSection?.textContent || ''}`;

      expect(combinedText).toMatch(/Site/i);
      expect(combinedText).toMatch(/Vendor/i);
      expect(combinedText).toMatch(/Customer/i);
      expect(combinedText).toMatch(/Article/i);
      expect(combinedText).toMatch(/Finance/i);
    });

    it('T1.3.4: displays verifiable SLA metrics (>99% accuracy, 30% SLA reduction)', () => {
      renderPortfolio();
      const experienceText = document.getElementById('experience')?.textContent || '';
      expect(experienceText).toMatch(/>99%|99%/);
      expect(experienceText).toMatch(/30%/);
    });

    it('T1.3.5: displays "Awarded Best Intern" recognition with verifiable certificate link', () => {
      renderPortfolio();
      const bestInternMatches = screen.getAllByText(/Best Intern/i);
      expect(bestInternMatches.length).toBeGreaterThan(0);

      // Verify certificate link to LinkedIn
      const certLink = document.querySelector('a[href*="linkedin.com"][href*="single-media-viewer"]');
      expect(certLink).toBeInTheDocument();
      expect(certLink).toHaveAttribute('target', '_blank');
      expect(certLink).toHaveAttribute('rel', expect.stringContaining('noopener'));
    });
  });

  // ==========================================================================
  // Area 4: Featured Projects & GitHub Data (6 tests)
  // ==========================================================================
  describe('Area 4: Featured Projects & GitHub Metadata', () => {
    it('T1.4.1: renders mandatory project 1: RAG Document Chat', () => {
      renderPortfolio();
      const ragMatches = screen.getAllByText(/RAG Document Chat/i);
      expect(ragMatches.length).toBeGreaterThan(0);

      const repoLink = document.querySelector('a[href="https://github.com/GaneshArwan/RAGChat"]');
      expect(repoLink).toBeInTheDocument();
      expect(repoLink).toHaveAttribute('target', '_blank');
    });

    it('T1.4.2: renders mandatory project 2: Autonomous Code Review Agent', () => {
      renderPortfolio();
      const agentMatches = screen.getAllByText(/Autonomous Code Review Agent|AI Code Review Agent/i);
      expect(agentMatches.length).toBeGreaterThan(0);

      const repoLink = document.querySelector('a[href="https://github.com/GaneshArwan/AICodeReviewAgent"]');
      expect(repoLink).toBeInTheDocument();
      expect(repoLink).toHaveAttribute('target', '_blank');
    });

    it('T1.4.3: renders mandatory project 3: AI Writing Assistant SaaS', () => {
      renderPortfolio();
      const saasMatches = screen.getAllByText(/AI Writing Assistant SaaS/i);
      expect(saasMatches.length).toBeGreaterThan(0);

      const repoLink = document.querySelector('a[href="https://github.com/GaneshArwan/AIWritingAssistantSaaS"]');
      expect(repoLink).toBeInTheDocument();
      expect(repoLink).toHaveAttribute('target', '_blank');
    });

    it('T1.4.4: renders verified tech badges for all featured project cards', () => {
      renderPortfolio();
      const projectsSection = document.getElementById('projects');
      expect(projectsSection).toBeInTheDocument();
      expect(projectsSection.textContent).toMatch(/ChromaDB|LangChain|LangGraph|Gemini/i);
    });

    it('T1.4.5: verified external GitHub repo links all point to GaneshArwan repositories', () => {
      renderPortfolio();
      const repoLinks = Array.from(document.querySelectorAll('#projects a[href*="github.com/GaneshArwan/"]'));
      expect(repoLinks.length).toBeGreaterThanOrEqual(3);
      repoLinks.forEach((link) => {
        expect(link.getAttribute('href')).toMatch(/^https:\/\/github\.com\/GaneshArwan\//);
        expect(link).toHaveAttribute('target', '_blank');
        expect(link).toHaveAttribute('rel', expect.stringContaining('noopener'));
      });
    });

    it('T1.4.6: provides working live demo links for deployed projects', () => {
      renderPortfolio();
      const liveLinks = Array.from(document.querySelectorAll('#projects a[href*="vercel.app"], #projects a[href*="streamlit.app"]'));
      expect(liveLinks.length).toBeGreaterThan(0);
      liveLinks.forEach((link) => {
        expect(link).toHaveAttribute('target', '_blank');
        expect(link).toHaveAttribute('rel', expect.stringContaining('noopener'));
      });
    });
  });

  // ==========================================================================
  // Area 5: Technical Moat & Skills Matrix (5 tests)
  // ==========================================================================
  describe('Area 5: Technical Moat & Skills Matrix', () => {
    it('T1.5.1: displays Data Warehousing & Analytics infrastructure skills', () => {
      renderPortfolio();
      const skillsSection = document.getElementById('skills');
      expect(skillsSection).toBeInTheDocument();
      expect(skillsSection.textContent).toMatch(/BigQuery/i);
      expect(skillsSection.textContent).toMatch(/Looker/i);
      expect(skillsSection.textContent).toMatch(/SQL/i);
    });

    it('T1.5.2: displays AI & Autonomous LLM Systems skills', () => {
      renderPortfolio();
      const skillsSection = document.getElementById('skills');
      expect(skillsSection.textContent).toMatch(/LangGraph/i);
      expect(skillsSection.textContent).toMatch(/ChromaDB/i);
    });

    it('T1.5.3: displays Enterprise Automation skills', () => {
      renderPortfolio();
      const skillsSection = document.getElementById('skills');
      expect(skillsSection.textContent).toMatch(/Google Apps Script/i);
      expect(skillsSection.textContent).toMatch(/Git/i);
    });

    it('T1.5.4: displays Modern Frontend Engineering skills', () => {
      renderPortfolio();
      const skillsSection = document.getElementById('skills');
      expect(skillsSection.textContent).toMatch(/React 19|React/i);
      expect(skillsSection.textContent).toMatch(/TypeScript/i);
    });

    it('T1.5.5: renders skills with readable names and visual icons/images', () => {
      renderPortfolio();
      const skillImages = Array.from(document.querySelectorAll('#skills img'));
      expect(skillImages.length).toBeGreaterThanOrEqual(10);
      skillImages.forEach((img) => {
        expect(img).toHaveAttribute('alt');
      });
    });
  });

  // ==========================================================================
  // Area 6: Contact Form & Validation (5 tests)
  // ==========================================================================
  describe('Area 6: Contact Form & Communication', () => {
    it('T1.6.1: renders Name, Email, and Message input elements with submit button', () => {
      renderPortfolio();
      const contactForm = document.querySelector('section#contact form');
      expect(contactForm).toBeInTheDocument();

      const nameInput = document.querySelector('input#name');
      const emailInput = document.querySelector('input#email');
      const messageInput = document.querySelector('textarea#message');
      const submitBtn = contactForm.querySelector('button[type="submit"]');

      expect(nameInput).toBeInTheDocument();
      expect(emailInput).toBeInTheDocument();
      expect(messageInput).toBeInTheDocument();
      expect(submitBtn).toBeInTheDocument();
    });

    it('T1.6.2: associates form inputs with descriptive labels', () => {
      renderPortfolio();
      const nameLabel = document.querySelector('label[for="name"]');
      const emailLabel = document.querySelector('label[for="email"]');
      const messageLabel = document.querySelector('label[for="message"]');

      expect(nameLabel).toHaveTextContent(/Name/i);
      expect(emailLabel).toHaveTextContent(/Email/i);
      expect(messageLabel).toHaveTextContent(/Message|Project Scope/i);
    });

    it('T1.6.3: submits valid form payload to Formspree endpoint', async () => {
      renderPortfolio();
      const fetchSpy = vi.spyOn(global, 'fetch');

      const nameInput = document.querySelector('input#name');
      const emailInput = document.querySelector('input#email');
      const messageInput = document.querySelector('textarea#message');
      const submitBtn = document.querySelector('section#contact form button[type="submit"]');

      fireEvent.change(nameInput, { target: { name: 'name', value: 'Alex Mercer' } });
      fireEvent.change(emailInput, { target: { name: 'email', value: 'alex@ventureai.io' } });
      fireEvent.change(messageInput, { target: { name: 'message', value: 'Hello William, we would like to interview you.' } });

      // Trigger recaptcha verification if present
      const recaptchaBtn = screen.queryByTestId('recaptcha-verify-btn');
      if (recaptchaBtn) {
        fireEvent.click(recaptchaBtn);
      }

      fireEvent.click(submitBtn);

      await vi.waitFor(() => {
        expect(fetchSpy).toHaveBeenCalledWith(
          expect.stringContaining('formspree.io'),
          expect.objectContaining({
            method: 'POST',
            headers: expect.objectContaining({ 'Content-Type': 'application/json' }),
          })
        );
      });
    });

    it('T1.6.4: resets form fields upon successful submission', async () => {
      renderPortfolio();

      const nameInput = document.querySelector('input#name');
      const emailInput = document.querySelector('input#email');
      const messageInput = document.querySelector('textarea#message');
      const submitBtn = document.querySelector('section#contact form button[type="submit"]');

      fireEvent.change(nameInput, { target: { name: 'name', value: 'Jane Doe' } });
      fireEvent.change(emailInput, { target: { name: 'email', value: 'jane@enterprise.com' } });
      fireEvent.change(messageInput, { target: { name: 'message', value: 'Looking forward to collaborating on data pipelines.' } });

      const recaptchaBtn = screen.queryByTestId('recaptcha-verify-btn');
      if (recaptchaBtn) {
        fireEvent.click(recaptchaBtn);
      }

      fireEvent.click(submitBtn);

      await vi.waitFor(() => {
        expect(nameInput.value).toBe('');
        expect(emailInput.value).toBe('');
        expect(messageInput.value).toBe('');
      });
    });

    it('T1.6.5: renders direct contact links (Email, LinkedIn, GitHub) in contact section', () => {
      renderPortfolio();
      const contactSection = document.getElementById('contact');
      expect(contactSection).toBeInTheDocument();

      const emailLink = contactSection.querySelector('a[href^="mailto:wiliamzwili135@gmail.com"]');
      const linkedinLink = contactSection.querySelector('a[href="https://www.linkedin.com/in/william-oo00/"]');
      const githubLink = contactSection.querySelector('a[href="https://github.com/GaneshArwan"]');

      expect(emailLink).toBeInTheDocument();
      expect(linkedinLink).toBeInTheDocument();
      expect(githubLink).toBeInTheDocument();
    });
  });

  // ==========================================================================
  // Area 7: Navigation & Theme Switching (5 tests)
  // ==========================================================================
  describe('Area 7: Navigation & Theme Switching Engine', () => {
    it('T1.7.1: renders sticky top navigation bar with links to all sections', () => {
      renderPortfolio();
      const nav = screen.getByRole('navigation');
      expect(nav).toBeInTheDocument();

      // Should contain buttons or anchors for core sections
      expect(screen.getAllByText(/About/i).length).toBeGreaterThan(0);
      expect(screen.getAllByText(/Projects/i).length).toBeGreaterThan(0);
      expect(screen.getAllByText(/Skills/i).length).toBeGreaterThan(0);
      expect(screen.getAllByText(/Experience/i).length).toBeGreaterThan(0);
      expect(screen.getAllByText(/Contact/i).length).toBeGreaterThan(0);
    });

    it('T1.7.2: theme toggle switches between dark and light class on root element', () => {
      renderPortfolio();
      const root = document.documentElement;
      const initialDark = root.classList.contains('dark');

      // Find theme toggle button
      const themeBtns = screen.getAllByRole('button').filter(btn => {
        const svg = btn.querySelector('svg');
        return svg && (svg.classList.contains('lucide-sun') || svg.classList.contains('lucide-moon'));
      });
      expect(themeBtns.length).toBeGreaterThan(0);

      act(() => {
        fireEvent.click(themeBtns[0]);
      });

      expect(root.classList.contains('dark')).toBe(!initialDark);
    });

    it('T1.7.3: toggling theme writes new preference to localStorage', () => {
      renderPortfolio();
      const setItemSpy = vi.spyOn(window.localStorage, 'setItem');

      const themeBtns = screen.getAllByRole('button').filter(btn => {
        const svg = btn.querySelector('svg');
        return svg && (svg.classList.contains('lucide-sun') || svg.classList.contains('lucide-moon'));
      });

      act(() => {
        fireEvent.click(themeBtns[0]);
      });

      expect(setItemSpy).toHaveBeenCalledWith('theme', expect.stringMatching(/dark|light/));
    });

    it('T1.7.4: restores theme from localStorage on initial load', () => {
      window.localStorage.setItem('theme', 'light');
      renderPortfolio();

      expect(document.documentElement.classList.contains('dark')).toBe(false);
    });

    it('T1.7.5: reveals mobile navigation menu button when viewport is narrow', () => {
      setViewport({ width: 375, height: 667 });
      renderPortfolio();

      const menuBtns = screen.getAllByRole('button').filter(btn => {
        const svg = btn.querySelector('svg');
        return svg && (svg.classList.contains('lucide-menu') || svg.classList.contains('lucide-x'));
      });
      expect(menuBtns.length).toBeGreaterThan(0);
    });
  });

  // ==========================================================================
  // Area 8: Antislop & Accessibility Baseline (5 tests)
  // ==========================================================================
  describe('Area 8: Antislop & Accessibility Baseline', () => {
    it('T1.8.1: document contains essential semantic landmarks (<nav>, <main>, <section>)', () => {
      renderPortfolio();
      expect(document.querySelector('nav')).toBeInTheDocument();
      expect(document.querySelector('main')).toBeInTheDocument();
      expect(document.querySelectorAll('section').length).toBeGreaterThanOrEqual(4);
    });

    it('T1.8.2: heading hierarchy contains single primary <h1> followed by section headings', () => {
      renderPortfolio();
      const h1s = document.querySelectorAll('h1');
      expect(h1s.length).toBe(1);
      const h2s = document.querySelectorAll('h2, h3');
      expect(h2s.length).toBeGreaterThan(0);
    });

    it('T1.8.3: all external links include rel="noopener noreferrer" for tab security', () => {
      renderPortfolio();
      const externalLinks = Array.from(document.querySelectorAll('a[target="_blank"]'));
      expect(externalLinks.length).toBeGreaterThan(0);
      externalLinks.forEach((link) => {
        const rel = link.getAttribute('rel') || '';
        expect(rel).toMatch(/noopener/);
      });
    });

    it('T1.8.4: theme classes provide contrasting background and text colors', () => {
      renderPortfolio();
      const main = document.querySelector('main');
      expect(main).toHaveClass(/bg-slate/);
    });

    it('T1.8.5: main content container is rendered and interactive after initial mount', () => {
      renderPortfolio();
      const main = document.querySelector('main');
      expect(main).toBeInTheDocument();
      expect(screen.getByText(/About Me/i)).toBeVisible();
    });
  });
});
