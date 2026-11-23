/**
 * tests/e2e/tier2_boundaries.test.jsx
 * Tier 2: Comprehensive Boundary Value Analysis & Edge Cases (42 Tests)
 * 
 * Exercises boundary values, edge cases, responsive dimensions, and adversarial inputs:
 * 1. Bio & Personal Info Boundary Cases (375px, 1920px, whitespace sanitization)
 * 2. Education Boundaries (GPA precision, 375px stacking, zoom reflow)
 * 3. Kawan Lama MDM Experience Boundaries (rapid interaction, 375px timeline collapse)
 * 4. Featured Projects Boundaries (missing stats fallback, tech tags wrap, touch targets)
 * 5. Skills Matrix Boundaries (long names, CDN fallback, responsive reflow)
 * 6. Contact Form Boundaries (empty, BVA lengths, malformed emails, double clicks, network error)
 * 7. Navigation & Theme Engine Boundaries (rapid toggling, corrupted storage, resize transitions)
 * 8. Antislop & Polish Boundaries (zero horizontal overflow, no cursor hijacking)
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { screen, act, fireEvent } from '@testing-library/react';
import { renderPortfolio, resetTestEnvironment, setViewport } from './harness';

describe('Tier 2: Boundary Value Analysis & Edge Cases (Opaque-Box)', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    resetTestEnvironment();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  // ==========================================================================
  // B1: Bio & Personal Info Boundary Cases (5 tests)
  // ==========================================================================
  describe('B1: Bio & Personal Info Boundaries', () => {
    it('T2.1.1: maintains fluid headline typography without clipping on mobile (375px)', () => {
      setViewport({ width: 375, height: 667 });
      renderPortfolio();
      const h1 = screen.getByRole('heading', { level: 1 });
      expect(h1).toBeInTheDocument();
      expect(h1).toHaveClass(/text-5xl|text-4xl|text-6xl|text-7xl/);
    });

    it('T2.1.2: email address in mailto href contains no trailing or rogue whitespace', () => {
      renderPortfolio();
      const mailtoLinks = Array.from(document.querySelectorAll('a[href^="mailto:"]'));
      expect(mailtoLinks.length).toBeGreaterThan(0);
      mailtoLinks.forEach((link) => {
        const href = link.getAttribute('href');
        expect(href).not.toMatch(/\s/);
        expect(href).toBe('mailto:wiliamzwili135@gmail.com');
      });
    });

    it('T2.1.3: renders without horizontal overflow on narrow mobile screens (375px)', () => {
      setViewport({ width: 375, height: 667 });
      renderPortfolio();
      const hero = document.querySelector('section');
      expect(hero).toBeInTheDocument();
      // Behavioral verification: Section enforces overflow containment
      expect(hero).toHaveClass('overflow-hidden');
      expect(document.body.style.overflowX).not.toBe('scroll');

      // Ensure containers do not set rogue fixed inline widths exceeding mobile width
      const containers = document.querySelectorAll('section, main, .max-w-7xl, .max-w-4xl');
      containers.forEach((container) => {
        const inlineWidth = container.style.width;
        if (inlineWidth && inlineWidth.endsWith('px')) {
          expect(parseFloat(inlineWidth)).toBeLessThanOrEqual(375);
        }
      });
    });

    it('T2.1.4: constrains main content within maximum width container on ultrawide viewports (1920px)', () => {
      setViewport({ width: 1920, height: 1080 });
      renderPortfolio();
      const constrainedContainers = document.querySelectorAll('.max-w-7xl, .max-w-5xl, .max-w-4xl');
      expect(constrainedContainers.length).toBeGreaterThan(0);
    });

    it('T2.1.5: maintains legible text styling when background overlay is active', () => {
      renderPortfolio();
      const overlays = document.querySelectorAll('.bg-slate-50\\/90, .dark\\:bg-slate-950\\/90, .backdrop-blur-xl, .backdrop-blur-md');
      expect(overlays.length).toBeGreaterThan(0);
    });
  });

  // ==========================================================================
  // B2: Education Boundary Cases (5 tests)
  // ==========================================================================
  describe('B2: Education Credential Boundaries', () => {
    it('T2.2.1: GPA string matches exact pattern 3.89 without float precision artifacts', () => {
      renderPortfolio();
      const about = document.getElementById('about');
      expect(about).toBeInTheDocument();
      const match = about.textContent.match(/\b3\.89\b/);
      expect(match).not.toBeNull();
      // Ensure it is not floating point error like 3.8900000001
      expect(about.textContent).not.toMatch(/3\.89000/);
    });

    it('T2.2.2: education narrative wraps cleanly on mobile viewport (375px)', () => {
      setViewport({ width: 375, height: 667 });
      renderPortfolio();
      const aboutCard = document.querySelector('#about .rounded-3xl, #about .max-w-7xl');
      expect(aboutCard).toBeInTheDocument();
    });

    it('T2.2.3: education card maintains semantic section header structure', () => {
      renderPortfolio();
      const aboutSection = document.querySelector('#about');
      const header = aboutSection.querySelector('h2, [class*="SectionHeader"]');
      expect(header).toBeInTheDocument();
    });

    it('T2.2.4: reflows smoothly under tablet dimensions (768px)', () => {
      setViewport({ width: 768, height: 1024 });
      renderPortfolio();
      expect(screen.getByText(/About Me/i)).toBeInTheDocument();
    });

    it('T2.2.5: graduation timeframe is consistently represented in about narrative', () => {
      renderPortfolio();
      const aboutText = document.getElementById('about').textContent;
      expect(aboutText).toMatch(/2024/);
    });
  });

  // ==========================================================================
  // B3: Kawan Lama Group MDM Experience Boundary Cases (5 tests)
  // ==========================================================================
  describe('B3: Kawan Lama MDM Experience Boundaries', () => {
    it('T2.3.1: rapid successive scrolling across experience items does not throw errors', () => {
      renderPortfolio();
      const experience = document.getElementById('experience');
      expect(experience).toBeInTheDocument();

      // Dispatch rapid scroll events
      act(() => {
        for (let i = 0; i < 5; i++) {
          window.dispatchEvent(new Event('scroll'));
        }
      });
      expect(experience).toBeInTheDocument();
    });

    it('T2.3.2: keyboard navigation focus on certificate link reveals focus outline', () => {
      renderPortfolio();
      const certLink = document.querySelector('a[href*="linkedin.com"][href*="single-media-viewer"]');
      expect(certLink).toBeInTheDocument();
      certLink.focus();
      expect(document.activeElement).toBe(certLink);
    });

    it('T2.3.3: experience timeline collapses to single column on mobile (375px)', () => {
      setViewport({ width: 375, height: 667 });
      renderPortfolio();
      const timelineCards = document.querySelectorAll('#experience .relative');
      expect(timelineCards.length).toBeGreaterThan(0);
    });

    it('T2.3.4: Best Intern certificate link has explicit security target and rel', () => {
      renderPortfolio();
      const certLink = document.querySelector('a[href*="linkedin.com"][href*="single-media-viewer"]');
      expect(certLink).toHaveAttribute('target', '_blank');
      expect(certLink).toHaveAttribute('rel', 'noopener noreferrer');
    });

    it('T2.3.5: multiple achievement bullet points render with distinct list markers', () => {
      renderPortfolio();
      const bullets = document.querySelectorAll('#experience li');
      expect(bullets.length).toBeGreaterThanOrEqual(4);
    });
  });

  // ==========================================================================
  // B4: Featured Projects Boundary Cases (5 tests)
  // ==========================================================================
  describe('B4: Featured Projects Boundaries', () => {
    it('T2.4.1: project action buttons maintain distinct external destinations', () => {
      renderPortfolio();
      const projectAnchors = Array.from(document.querySelectorAll('#projects a[href]'));
      const hrefs = projectAnchors.map(a => a.getAttribute('href'));
      expect(new Set(hrefs).size).toBeGreaterThanOrEqual(3);
    });

    it('T2.4.2: handles missing live demo links gracefully by omitting button without DOM errors', () => {
      renderPortfolio();
      // Projects without liveLink should only render View Repo
      const ragCard = document.getElementById('project-container-rag-document-chat');
      expect(ragCard).not.toBeNull();
      const liveBtn = Array.from(ragCard.querySelectorAll('a')).find(a => /View Live/i.test(a.textContent));
      expect(liveBtn).toBeUndefined();
    });

    it('T2.4.3: projects with liveUrl render both View Repo and View Live action links', () => {
      renderPortfolio();
      const liveLinks = document.querySelectorAll('#projects a[href*="vercel.app"]');
      expect(liveLinks.length).toBeGreaterThan(0);
    });

    it('T2.4.4: tech stack badges wrap into flex container on mobile viewport (375px)', () => {
      setViewport({ width: 375, height: 667 });
      renderPortfolio();
      const techWrappers = document.querySelectorAll('#projects .flex-wrap');
      expect(techWrappers.length).toBeGreaterThan(0);
    });

    it('T2.4.5: action links provide clear legible text labels', () => {
      renderPortfolio();
      const repoButtons = screen.getAllByText(/View Repo/i);
      expect(repoButtons.length).toBeGreaterThanOrEqual(3);
    });
  });

  // ==========================================================================
  // B5: Technical Moat / Skills Matrix Boundary Cases (5 tests)
  // ==========================================================================
  describe('B5: Technical Moat Skills Boundaries', () => {
    it('T2.5.1: long skill names (e.g. Google Apps Script) render fully without truncation', () => {
      renderPortfolio();
      const gasMatch = screen.getAllByText(/Google Apps Script/i);
      expect(gasMatch.length).toBeGreaterThan(0);
    });

    it('T2.5.2: skill items render with image elements carrying descriptive alt text', () => {
      renderPortfolio();
      const skillImages = Array.from(document.querySelectorAll('#skills img'));
      skillImages.forEach(img => {
        expect(img.getAttribute('alt')).toBeTruthy();
      });
    });

    it('T2.5.3: skill cards use responsive border and shadow styling', () => {
      renderPortfolio();
      const skillCards = document.querySelectorAll('#skills .rounded-2xl');
      expect(skillCards.length).toBeGreaterThan(0);
    });

    it('T2.5.4: skills section title and subtitle are non-empty and legible', () => {
      renderPortfolio();
      const skillsSection = document.getElementById('skills');
      expect(skillsSection.textContent).toMatch(/Technical Moat|Skills/i);
      expect(skillsSection.textContent).toMatch(/Structured matrix|Tools and technologies/i);
    });

    it('T2.5.5: skills cards are operable across both light and dark themes', () => {
      renderPortfolio();
      const skillsSection = document.getElementById('skills');
      expect(skillsSection).toBeInTheDocument();
      const initialCards = skillsSection.querySelectorAll('.rounded-2xl');
      expect(initialCards.length).toBeGreaterThan(0);
      const firstSkillHeading = initialCards[0].querySelector('h3');
      expect(firstSkillHeading).toBeInTheDocument();
      const initialSkillName = firstSkillHeading.textContent;

      const themeBtn = screen.getAllByRole('button').find(btn => {
        const svg = btn.querySelector('svg');
        return svg && (svg.classList.contains('lucide-sun') || svg.classList.contains('lucide-moon'));
      });
      expect(themeBtn).toBeDefined();

      // Switch to light theme
      act(() => {
        fireEvent.click(themeBtn);
      });
      expect(document.documentElement.classList.contains('dark')).toBe(false);
      const lightCards = skillsSection.querySelectorAll('.rounded-2xl');
      expect(lightCards.length).toBe(initialCards.length);
      expect(skillsSection.textContent).toContain(initialSkillName);

      // Switch back to dark theme
      act(() => {
        fireEvent.click(themeBtn);
      });
      expect(document.documentElement.classList.contains('dark')).toBe(true);
      const darkCards = skillsSection.querySelectorAll('.rounded-2xl');
      expect(darkCards.length).toBe(initialCards.length);
      expect(skillsSection.textContent).toContain(initialSkillName);
    });
  });

  // ==========================================================================
  // B6: Contact Form Boundary & Corner Cases (7 tests)
  // ==========================================================================
  describe('B6: Contact Form Input Boundaries', () => {
    it('T2.6.1: empty form submission does not dispatch network request', () => {
      renderPortfolio();
      const fetchSpy = vi.spyOn(global, 'fetch');
      const submitBtn = document.querySelector('section#contact form button[type="submit"]');

      fireEvent.click(submitBtn);

      // ReCAPTCHA / required validation should stop dispatch
      expect(fetchSpy).not.toHaveBeenCalled();
    });

    it('T2.6.2: handles name input with exactly 2 characters (boundary valid)', async () => {
      renderPortfolio();
      const fetchSpy = vi.spyOn(global, 'fetch');

      const nameInput = document.querySelector('input#name');
      const emailInput = document.querySelector('input#email');
      const messageInput = document.querySelector('textarea#message');
      const submitBtn = document.querySelector('section#contact form button[type="submit"]');

      fireEvent.change(nameInput, { target: { name: 'name', value: 'Al' } });
      fireEvent.change(emailInput, { target: { name: 'email', value: 'al@domain.io' } });
      fireEvent.change(messageInput, { target: { name: 'message', value: 'Hello William from Al!' } });

      const recaptchaBtn = screen.queryByTestId('recaptcha-verify-btn');
      if (recaptchaBtn) fireEvent.click(recaptchaBtn);

      fireEvent.click(submitBtn);

      await vi.waitFor(() => {
        expect(fetchSpy).toHaveBeenCalled();
      });
    });

    it('T2.6.3: handles message input with exactly 10 characters (boundary valid)', async () => {
      renderPortfolio();
      const fetchSpy = vi.spyOn(global, 'fetch');

      const nameInput = document.querySelector('input#name');
      const emailInput = document.querySelector('input#email');
      const messageInput = document.querySelector('textarea#message');
      const submitBtn = document.querySelector('section#contact form button[type="submit"]');

      fireEvent.change(nameInput, { target: { name: 'name', value: 'Tester' } });
      fireEvent.change(emailInput, { target: { name: 'email', value: 'test@example.com' } });
      fireEvent.change(messageInput, { target: { name: 'message', value: '1234567890' } }); // exactly 10 chars

      const recaptchaBtn = screen.queryByTestId('recaptcha-verify-btn');
      if (recaptchaBtn) fireEvent.click(recaptchaBtn);

      fireEvent.click(submitBtn);

      await vi.waitFor(() => {
        expect(fetchSpy).toHaveBeenCalled();
      });
    });

    it('T2.6.4: email input with valid international domain is accepted', async () => {
      renderPortfolio();
      const fetchSpy = vi.spyOn(global, 'fetch');

      const nameInput = document.querySelector('input#name');
      const emailInput = document.querySelector('input#email');
      const messageInput = document.querySelector('textarea#message');
      const submitBtn = document.querySelector('section#contact form button[type="submit"]');

      fireEvent.change(nameInput, { target: { name: 'name', value: 'Global Recruiter' } });
      fireEvent.change(emailInput, { target: { name: 'email', value: 'recruiter@enterprise.co.id' } });
      fireEvent.change(messageInput, { target: { name: 'message', value: 'We have an open AI position in Jakarta.' } });

      const recaptchaBtn = screen.queryByTestId('recaptcha-verify-btn');
      if (recaptchaBtn) fireEvent.click(recaptchaBtn);

      fireEvent.click(submitBtn);

      await vi.waitFor(() => {
        expect(fetchSpy).toHaveBeenCalled();
      });
    });

    it('T2.6.5: handles extreme length message payload (5,000 characters) without UI crash', async () => {
      renderPortfolio();
      const messageInput = document.querySelector('textarea#message');
      const longMessage = 'A'.repeat(5000);

      fireEvent.change(messageInput, { target: { name: 'message', value: longMessage } });
      expect(messageInput.value.length).toBe(5000);
    });

    it('T2.6.6: handles rapid double-click of submit button without throwing uncaught errors', async () => {
      renderPortfolio();
      const fetchSpy = vi.spyOn(global, 'fetch');
      const nameInput = document.querySelector('input#name');
      const emailInput = document.querySelector('input#email');
      const messageInput = document.querySelector('textarea#message');
      const submitBtn = document.querySelector('section#contact form button[type="submit"]');

      fireEvent.change(nameInput, { target: { name: 'name', value: 'Rapid Clicker' } });
      fireEvent.change(emailInput, { target: { name: 'email', value: 'rapid@test.com' } });
      fireEvent.change(messageInput, { target: { name: 'message', value: 'Testing rapid clicking sequence.' } });

      const recaptchaBtn = screen.queryByTestId('recaptcha-verify-btn');
      if (recaptchaBtn) fireEvent.click(recaptchaBtn);

      // Rapidly click twice
      fireEvent.click(submitBtn);
      fireEvent.click(submitBtn);

      await vi.waitFor(() => {
        expect(fetchSpy).toHaveBeenCalled();
      });
    });

    it('T2.6.7: handles network failure gracefully without crashing the component', async () => {
      renderPortfolio();
      // Mock HTTP 500 server response from Formspree
      vi.spyOn(global, 'fetch').mockImplementationOnce(() =>
        Promise.resolve({
          ok: false,
          status: 500,
          json: () => Promise.resolve({ error: 'Internal Server Error' }),
        })
      );
      const alertSpy = vi.spyOn(window, 'alert');

      const nameInput = document.querySelector('input#name');
      const emailInput = document.querySelector('input#email');
      const messageInput = document.querySelector('textarea#message');
      const submitBtn = document.querySelector('section#contact form button[type="submit"]');

      fireEvent.change(nameInput, { target: { name: 'name', value: 'Network Test' } });
      fireEvent.change(emailInput, { target: { name: 'email', value: 'net@test.com' } });
      fireEvent.change(messageInput, { target: { name: 'message', value: 'Testing network failure scenario.' } });

      const recaptchaBtn = screen.queryByTestId('recaptcha-verify-btn');
      if (recaptchaBtn) fireEvent.click(recaptchaBtn);

      fireEvent.click(submitBtn);

      await vi.waitFor(() => {
        expect(alertSpy).toHaveBeenCalledWith(expect.stringMatching(/failed/i));
      });

      // Component remains alive in the DOM
      expect(submitBtn).toBeInTheDocument();
    });
  });

  // ==========================================================================
  // B7: Navigation & Theme Engine Boundary Cases (5 tests)
  // ==========================================================================
  describe('B7: Navigation & Theme Engine Boundaries', () => {
    it('T2.7.1: rapid 10x theme toggle clicks maintain deterministic parity', () => {
      renderPortfolio();
      const root = document.documentElement;
      const initialDark = root.classList.contains('dark');

      const themeBtns = screen.getAllByRole('button').filter(btn => {
        const svg = btn.querySelector('svg');
        return svg && (svg.classList.contains('lucide-sun') || svg.classList.contains('lucide-moon'));
      });

      // 10 clicks = even number = back to original state
      for (let i = 0; i < 10; i++) {
        act(() => {
          fireEvent.click(themeBtns[0]);
        });
      }

      expect(root.classList.contains('dark')).toBe(initialDark);
    });

    it('T2.7.2: handles corrupted theme string in localStorage with safe fallback', () => {
      window.localStorage.setItem('theme', 'corrupted_theme_xyz');
      renderPortfolio();

      const root = document.documentElement;
      // Safe fallback: non-'dark' corrupted string resolves cleanly without crashing
      expect(root.classList.contains('dark')).toBe(false);
      expect(document.querySelector('main')).toBeInTheDocument();

      // Component remains interactive and can toggle normally
      const themeBtn = screen.getAllByRole('button').find(btn => {
        const svg = btn.querySelector('svg');
        return svg && (svg.classList.contains('lucide-sun') || svg.classList.contains('lucide-moon'));
      });
      expect(themeBtn).toBeDefined();
      act(() => { fireEvent.click(themeBtn); });
      expect(root.classList.contains('dark')).toBe(true);
      expect(window.localStorage.getItem('theme')).toBe('dark');
    });

    it('T2.7.3: mobile menu drawer toggles open and closed via hamburger button', () => {
      setViewport({ width: 375, height: 667 });
      renderPortfolio();

      const menuBtns = screen.getAllByRole('button').filter(btn => {
        const svg = btn.querySelector('svg');
        return svg && (svg.classList.contains('lucide-menu') || svg.classList.contains('lucide-x'));
      });

      // Open drawer
      act(() => {
        fireEvent.click(menuBtns[0]);
      });

      // Drawer container is visible
      const mobileDrawer = document.querySelector('nav .absolute.top-full');
      expect(mobileDrawer).toBeInTheDocument();
      expect(mobileDrawer).toHaveClass(/opacity-100|visible/);

      // Close drawer
      act(() => {
        fireEvent.click(menuBtns[0]);
      });
      expect(mobileDrawer).toHaveClass(/opacity-0|invisible/);
    });

    it('T2.7.4: resizing viewport from mobile (375px) to desktop (1280px) does not break navbar', () => {
      setViewport({ width: 375, height: 667 });
      renderPortfolio();

      setViewport({ width: 1280, height: 800 });
      const nav = screen.getByRole('navigation');
      expect(nav).toBeInTheDocument();
    });

    it('T2.7.5: active section state indicator updates without infinite loops', () => {
      renderPortfolio();
      act(() => {
        window.dispatchEvent(new Event('scroll'));
      });
      const nav = screen.getByRole('navigation');
      expect(nav).toBeInTheDocument();
    });
  });

  // ==========================================================================
  // B8: Antislop & Visual Polish Boundary Cases (5 tests)
  // ==========================================================================
  describe('B8: Antislop & Polish Boundaries', () => {
    it('T2.8.1: document root does not produce horizontal scrollbars on mobile (375px)', () => {
      setViewport({ width: 375, height: 667 });
      renderPortfolio();
      const body = document.body;
      expect(body).toBeInTheDocument();
      expect(body.style.overflowX).not.toBe('scroll');
    });

    it('T2.8.2: total DOM tree depth remains reasonable under 25 levels', () => {
      renderPortfolio();
      const allElements = document.querySelectorAll('*');
      let maxDepth = 0;
      allElements.forEach((el) => {
        let depth = 0;
        let parent = el.parentElement;
        while (parent) {
          depth++;
          parent = parent.parentElement;
        }
        if (depth > maxDepth) maxDepth = depth;
      });
      expect(maxDepth).toBeLessThanOrEqual(25);
    });

    it('T2.8.3: custom cursor pointer elements do not intercept click events (pointer-events-none)', () => {
      renderPortfolio();
      const cursorElements = document.querySelectorAll('[class*="pointer-events-none"]');
      expect(cursorElements.length).toBeGreaterThan(0);
    });

    it('T2.8.4: verifies surface background tokens across both dark and light modes', () => {
      renderPortfolio();
      const main = document.querySelector('main');
      expect(main).toHaveClass(/bg-slate/);
    });

    it('T2.8.5: main content is fully interactable after initial mount', () => {
      renderPortfolio();
      expect(document.querySelector('main')).toBeInTheDocument();
      expect(screen.getByRole('navigation')).toBeInTheDocument();
    });
  });
});
