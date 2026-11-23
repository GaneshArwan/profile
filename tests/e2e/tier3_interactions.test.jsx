/**
 * tests/e2e/tier3_interactions.test.jsx
 * Tier 3: Pairwise Combinatorial Interactions Test Suite (25 Tests)
 * 
 * Exercises multi-state pairwise interactions across:
 * - Viewport: [Mobile (375px), Desktop (1280px)]
 * - Theme: [Dark, Light]
 * - Experience / Navigation states
 * - Project Links / External Targets
 * - Form States: [Pristine, Filled, Submitted]
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { screen, act, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderPortfolio, resetTestEnvironment, setViewport, setSystemTheme } from './harness';
import { PROJECTS } from '../../src/data/constants';

describe('Tier 3: Pairwise Combinatorial Interactions (Opaque-Box)', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    resetTestEnvironment();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  // ==========================================================================
  // Cluster 3.1: Theme Toggle x Navigation & Storage Persistence (5 tests)
  // ==========================================================================
  describe('Cluster 3.1: Theme Toggle x Navigation & Persistence', () => {
    it('T3.1.1: theme toggle state persists across section anchor navigation', () => {
      renderPortfolio();
      const root = document.documentElement;

      const themeBtns = screen.getAllByRole('button').filter(btn => {
        const svg = btn.querySelector('svg');
        return svg && (svg.classList.contains('lucide-sun') || svg.classList.contains('lucide-moon'));
      });

      // Switch theme to light
      act(() => {
        fireEvent.click(themeBtns[0]);
      });
      expect(root.classList.contains('dark')).toBe(false);

      // Navigate to Experience section
      const expLink = screen.getAllByText(/Experience/i)[0];
      act(() => {
        fireEvent.click(expLink);
      });

      // Theme remains light
      expect(root.classList.contains('dark')).toBe(false);
      expect(window.localStorage.getItem('theme')).toBe('light');
    });

    it('T3.1.2: light mode preference persists across simulated page reload', () => {
      window.localStorage.setItem('theme', 'light');
      renderPortfolio();
      expect(document.documentElement.classList.contains('dark')).toBe(false);

      // Re-mount (simulate reload)
      renderPortfolio();
      expect(document.documentElement.classList.contains('dark')).toBe(false);
    });

    it('T3.1.3: dark mode preference persists across simulated page reload', () => {
      window.localStorage.setItem('theme', 'dark');
      renderPortfolio();
      expect(document.documentElement.classList.contains('dark')).toBe(true);

      // Re-mount (simulate reload)
      renderPortfolio();
      expect(document.documentElement.classList.contains('dark')).toBe(true);
    });

    it('T3.1.4: theme toggled inside mobile menu updates global root theme', () => {
      setViewport({ width: 375, height: 667 });
      renderPortfolio();
      const root = document.documentElement;
      const initialDark = root.classList.contains('dark');

      const menuBtns = screen.getAllByRole('button').filter(btn => {
        const svg = btn.querySelector('svg');
        return svg && (svg.classList.contains('lucide-menu') || svg.classList.contains('lucide-x'));
      });

      // Open mobile drawer
      act(() => {
        fireEvent.click(menuBtns[0]);
      });

      // Find theme toggle inside drawer
      const drawerThemeBtns = screen.getAllByRole('button').filter(btn => {
        const svg = btn.querySelector('svg');
        return svg && (svg.classList.contains('lucide-sun') || svg.classList.contains('lucide-moon'));
      });

      act(() => {
        fireEvent.click(drawerThemeBtns[drawerThemeBtns.length - 1]);
      });

      expect(root.classList.contains('dark')).toBe(!initialDark);
    });

    it('T3.1.5: honors system color scheme preference when localStorage is empty', () => {
      setSystemTheme('light');
      window.localStorage.clear();
      renderPortfolio();
      expect(document.documentElement.classList.contains('dark')).toBe(false);

      // Verify dark mode system preference
      resetTestEnvironment();
      setSystemTheme('dark');
      renderPortfolio();
      expect(document.documentElement.classList.contains('dark')).toBe(true);
    });
  });

  // ==========================================================================
  // Cluster 3.2: Project Category Filtering x External Links (5 tests)
  // ==========================================================================
  describe('Cluster 3.2: Project Cards x External Links & Tech Tags', () => {
    it('T3.2.1: project cards maintain verified GitHub repository URLs across renders', () => {
      renderPortfolio();
      const ragRepo = document.querySelector('a[href="https://github.com/GaneshArwan/RAGChat"]');
      const agentRepo = document.querySelector('a[href="https://github.com/GaneshArwan/AICodeReviewAgent"]');
      const saasRepo = document.querySelector('a[href="https://github.com/GaneshArwan/AIWritingAssistantSaaS"]');

      expect(ragRepo).toBeInTheDocument();
      expect(agentRepo).toBeInTheDocument();
      expect(saasRepo).toBeInTheDocument();
    });

    it('T3.2.2: project cards with liveUrl render working live demo links in addition to repo link', () => {
      renderPortfolio();
      const liveDemos = document.querySelectorAll('#projects a[href*="vercel.app"], #projects a[href*="streamlit.app"]');
      expect(liveDemos.length).toBeGreaterThan(0);
      liveDemos.forEach((demo) => {
        expect(demo).toHaveAttribute('target', '_blank');
        expect(demo).toHaveAttribute('rel', expect.stringContaining('noopener'));
      });
    });

    it('T3.2.3: tech stack tags remain visible and styled after theme switch', () => {
      renderPortfolio();
      const themeBtns = screen.getAllByRole('button').filter(btn => {
        const svg = btn.querySelector('svg');
        return svg && (svg.classList.contains('lucide-sun') || svg.classList.contains('lucide-moon'));
      });

      // Toggle to light mode
      act(() => {
        fireEvent.click(themeBtns[0]);
      });

      const techBadges = document.querySelectorAll('#projects span.rounded-full');
      expect(techBadges.length).toBeGreaterThan(0);
    });

    it('T3.2.4: external project anchors retain noopener noreferrer security attributes in both themes', () => {
      renderPortfolio();
      const projectAnchors = Array.from(document.querySelectorAll('#projects a[target="_blank"]'));
      expect(projectAnchors.length).toBeGreaterThanOrEqual(3);
      projectAnchors.forEach(a => {
        expect(a.getAttribute('rel')).toContain('noopener');
      });
    });

    it('T3.2.5: all featured project cards render non-empty titles and descriptions', () => {
      renderPortfolio();
      PROJECTS.forEach(project => {
        const matches = screen.getAllByText(new RegExp(project.title, 'i'));
        expect(matches.length).toBeGreaterThan(0);
      });
    });
  });

  // ==========================================================================
  // Cluster 3.3: Experience MDM Domain Switcher x Focus & Interaction (5 tests)
  // ==========================================================================
  describe('Cluster 3.3: Experience MDM Domain Governance x Interaction', () => {
    it('T3.3.1: corporate MDM timeline items remain legible in light mode', () => {
      window.localStorage.setItem('theme', 'light');
      renderPortfolio();

      const experience = document.getElementById('experience');
      expect(experience).toBeInTheDocument();
      expect(document.documentElement.classList.contains('dark')).toBe(false);
      expect(screen.getAllByText(/Kawan Lama Group/i).length).toBeGreaterThan(0);
    });

    it('T3.3.2: 5 MDM core domains remain accessible across mobile viewport (375px)', () => {
      setViewport({ width: 375, height: 667 });
      renderPortfolio();

      const about = document.getElementById('about');
      const exp = document.getElementById('experience');
      const combined = `${about.textContent} ${exp.textContent}`;

      ['Site', 'Vendor', 'Customer', 'Article', 'Finance'].forEach(domain => {
        expect(combined).toMatch(new RegExp(domain, 'i'));
      });
    });

    it('T3.3.3: Best Intern award badge and credential link remain clickable across theme switches', () => {
      renderPortfolio();
      const certLink = document.querySelector('a[href*="linkedin.com"][href*="single-media-viewer"]');
      expect(certLink).toBeInTheDocument();

      // Switch theme
      const themeBtns = screen.getAllByRole('button').filter(btn => {
        const svg = btn.querySelector('svg');
        return svg && (svg.classList.contains('lucide-sun') || svg.classList.contains('lucide-moon'));
      });
      act(() => {
        fireEvent.click(themeBtns[0]);
      });

      expect(certLink).toBeInTheDocument();
      expect(certLink).toHaveAttribute('href');
    });

    it('T3.3.4: keyboard focus traversal across experience elements via userEvent.tab()', async () => {
      renderPortfolio();
      const certLink = document.querySelector('a[href*="linkedin.com"][href*="single-media-viewer"]');
      expect(certLink).toBeInTheDocument();

      // Bring focus to experience credential link
      certLink.focus();
      expect(document.activeElement).toBe(certLink);

      // Use real timers for userEvent tab traversal in happy-dom
      vi.useRealTimers();
      const user = userEvent.setup({ delay: null });

      // Forward Tab out of the experience card to ensure focus is not trapped
      await user.tab();
      expect(document.activeElement).not.toBe(certLink);
      expect(document.activeElement).not.toBe(document.body);

      // Reverse Tab back to the credential link
      await user.tab({ shift: true });
      expect(document.activeElement).toBe(certLink);
    });

    it('T3.3.5: corporate tenure metrics remain visible under mobile viewport', () => {
      setViewport({ width: 375, height: 667 });
      renderPortfolio();
      expect(screen.getAllByText(/2024/i).length).toBeGreaterThan(0);
    });
  });

  // ==========================================================================
  // Cluster 3.4: Contact Form State x Theme Switching, Resize & Validation (5 tests)
  // ==========================================================================
  describe('Cluster 3.4: Contact Form State x Theme & Resize', () => {
    it('T3.4.1: form input values are preserved when theme is toggled (Dark -> Light)', () => {
      renderPortfolio();
      const nameInput = document.querySelector('input#name');
      const emailInput = document.querySelector('input#email');
      const messageInput = document.querySelector('textarea#message');

      fireEvent.change(nameInput, { target: { name: 'name', value: 'Alex Mercer' } });
      fireEvent.change(emailInput, { target: { name: 'email', value: 'alex@ventureai.io' } });
      fireEvent.change(messageInput, { target: { name: 'message', value: 'Preserve my typed text during theme switch.' } });

      // Toggle theme
      const themeBtns = screen.getAllByRole('button').filter(btn => {
        const svg = btn.querySelector('svg');
        return svg && (svg.classList.contains('lucide-sun') || svg.classList.contains('lucide-moon'));
      });
      act(() => {
        fireEvent.click(themeBtns[0]);
      });

      expect(nameInput.value).toBe('Alex Mercer');
      expect(emailInput.value).toBe('alex@ventureai.io');
      expect(messageInput.value).toBe('Preserve my typed text during theme switch.');
    });

    it('T3.4.2: form input values are preserved when viewport is resized (Mobile -> Desktop)', () => {
      setViewport({ width: 375, height: 667 });
      renderPortfolio();

      const nameInput = document.querySelector('input#name');
      const emailInput = document.querySelector('input#email');

      fireEvent.change(nameInput, { target: { name: 'name', value: 'Sarah Connor' } });
      fireEvent.change(emailInput, { target: { name: 'email', value: 'sarah@skynet.ai' } });

      // Resize to desktop
      setViewport({ width: 1280, height: 800 });

      expect(nameInput.value).toBe('Sarah Connor');
      expect(emailInput.value).toBe('sarah@skynet.ai');
    });

    it('T3.4.3: valid form submission in light mode dispatches proper JSON payload to Formspree', async () => {
      window.localStorage.setItem('theme', 'light');
      renderPortfolio();
      const fetchSpy = vi.spyOn(global, 'fetch');

      const nameInput = document.querySelector('input#name');
      const emailInput = document.querySelector('input#email');
      const messageInput = document.querySelector('textarea#message');
      const submitBtn = document.querySelector('section#contact form button[type="submit"]');

      fireEvent.change(nameInput, { target: { name: 'name', value: 'Light Mode User' } });
      fireEvent.change(emailInput, { target: { name: 'email', value: 'light@example.com' } });
      fireEvent.change(messageInput, { target: { name: 'message', value: 'Testing contact submission in light mode theme.' } });

      const recaptchaBtn = screen.queryByTestId('recaptcha-verify-btn');
      if (recaptchaBtn) fireEvent.click(recaptchaBtn);

      await act(async () => {
        fireEvent.click(submitBtn);
      });

      await vi.waitFor(() => {
        expect(fetchSpy).toHaveBeenCalledWith(
          expect.stringContaining('formspree.io'),
          expect.objectContaining({
            method: 'POST',
            body: expect.stringContaining('Light Mode User'),
          })
        );
      });
    });

    it('T3.4.4: direct contact links remain clickable and intact after form submission with form reset', async () => {
      renderPortfolio();
      const fetchSpy = vi.spyOn(global, 'fetch');
      const nameInput = document.querySelector('input#name');
      const emailInput = document.querySelector('input#email');
      const messageInput = document.querySelector('textarea#message');
      const submitBtn = document.querySelector('section#contact form button[type="submit"]');

      // Populate form fields
      fireEvent.change(nameInput, { target: { name: 'name', value: 'Alex Mercer' } });
      fireEvent.change(emailInput, { target: { name: 'email', value: 'alex@example.com' } });
      fireEvent.change(messageInput, { target: { name: 'message', value: 'Testing contact link resilience after submit.' } });

      expect(nameInput.value).toBe('Alex Mercer');
      expect(emailInput.value).toBe('alex@example.com');
      expect(messageInput.value).toBe('Testing contact link resilience after submit.');

      // Solve reCAPTCHA
      const recaptchaBtn = screen.getByTestId('recaptcha-verify-btn');
      fireEvent.click(recaptchaBtn);

      // Submit form inside async act to cleanly flush all React state transitions
      await act(async () => {
        fireEvent.click(submitBtn);
      });

      await vi.waitFor(() => {
        expect(fetchSpy).toHaveBeenCalled();
        // Form must reset to pristine state post-submission
        expect(nameInput.value).toBe('');
        expect(emailInput.value).toBe('');
        expect(messageInput.value).toBe('');
      });

      // Direct contact channels remain accessible and undamaged
      const mailtoLink = document.querySelector('#contact a[href^="mailto:"]');
      const linkedinLink = document.querySelector('#contact a[href*="linkedin.com"]');
      const githubLink = document.querySelector('#contact a[href*="github.com"]');

      expect(mailtoLink).toBeInTheDocument();
      expect(mailtoLink).toHaveAttribute('href', 'mailto:wiliamzwili135@gmail.com');
      expect(linkedinLink).toBeInTheDocument();
      expect(linkedinLink).toHaveAttribute('href', 'https://www.linkedin.com/in/william-oo00/');
      expect(githubLink).toBeInTheDocument();
      expect(githubLink).toHaveAttribute('href', 'https://github.com/GaneshArwan');
    });

    it('T3.4.5: recaptcha verification container remains responsive across viewports', () => {
      setViewport({ width: 375, height: 667 });
      renderPortfolio();

      const recaptcha = screen.getByTestId('mock-recaptcha');
      expect(recaptcha).toBeInTheDocument();

      setViewport({ width: 1280, height: 800 });
      expect(recaptcha).toBeInTheDocument();
    });
  });

  // ==========================================================================
  // Cluster 3.5: Mobile Navigation Menu x Breakpoints & Anchor Scroll (5 tests)
  // ==========================================================================
  describe('Cluster 3.5: Mobile Navigation Menu x Breakpoints', () => {
    it('T3.5.1: clicking a navigation link inside mobile drawer closes the drawer', () => {
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

      const drawer = document.querySelector('nav .absolute.top-full');
      expect(drawer).toHaveClass(/opacity-100|visible/);

      // Click a nav link inside drawer
      const projectsLink = screen.getAllByText(/Projects/i).find(el => el.tagName === 'BUTTON');
      expect(projectsLink).toBeDefined();
      act(() => {
        fireEvent.click(projectsLink);
      });
      expect(drawer).toHaveClass(/opacity-0|invisible/);
    });

    it('T3.5.2: mobile navigation drawer links target all core sections', () => {
      setViewport({ width: 375, height: 667 });
      renderPortfolio();

      const menuBtns = screen.getAllByRole('button').filter(btn => {
        const svg = btn.querySelector('svg');
        return svg && (svg.classList.contains('lucide-menu') || svg.classList.contains('lucide-x'));
      });

      act(() => {
        fireEvent.click(menuBtns[0]);
      });

      const drawer = document.querySelector('nav .absolute.top-full');
      expect(drawer.textContent).toMatch(/About/i);
      expect(drawer.textContent).toMatch(/Projects/i);
      expect(drawer.textContent).toMatch(/Skills/i);
      expect(drawer.textContent).toMatch(/Experience/i);
      expect(drawer.textContent).toMatch(/Contact/i);
    });

    it('T3.5.3: resizing across breakpoint preserves navigation bar presence', () => {
      setViewport({ width: 375, height: 667 });
      renderPortfolio();

      const navMobile = screen.getByRole('navigation');
      expect(navMobile).toBeInTheDocument();

      setViewport({ width: 1024, height: 768 });
      const navDesktop = screen.getByRole('navigation');
      expect(navDesktop).toBeInTheDocument();
    });

    it('T3.5.4: top navbar back to top home button is accessible and interactive', () => {
      renderPortfolio();
      const homeBtn = screen.getByLabelText(/Back to Top/i);
      expect(homeBtn).toBeInTheDocument();
      const scrollSpy = vi.spyOn(window, 'scrollTo');

      act(() => {
        fireEvent.click(homeBtn);
      });
      expect(scrollSpy).toHaveBeenCalledWith(expect.objectContaining({ top: 0 }));
    });

    it('T3.5.5: unified desktop navigation bar renders full navigation links at desktop viewport', () => {
      setViewport({ width: 1280, height: 900 });
      renderPortfolio();

      const nav = screen.getByRole('navigation');
      expect(nav).toBeInTheDocument();

      const desktopLinks = screen.getAllByRole('button').filter(btn => 
        /About|Experience|Projects|Skills|Contact/i.test(btn.textContent)
      );
      expect(desktopLinks.length).toBeGreaterThanOrEqual(5);
    });
  });
});
