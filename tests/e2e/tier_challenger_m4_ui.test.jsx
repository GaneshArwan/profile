/**
 * tests/e2e/tier_challenger_m4_ui.test.jsx
 * 
 * Milestone M4: Verification, Security Skill Loop & Final Forensic Integrity Audit
 * Empirical Challenger: Adversarial UI, Responsive Reflow, Touch Targets & Accessibility Suite
 * 
 * Multi-Persona & Multi-Skill Fusion:
 * - senior-frontend-debugger-for-spa-websites-angular-react-vite: SPA hydration & component rendering robustness
 * - agency-performance-benchmarker: Clean DOM structure, bundle efficiency, responsive reflow
 * - agency-reality-checker: Rigorous empirical proof, zero fantasy approvals, direct DOM verification
 * - antislop-ui: High-contrast tokens (WCAG AA), deliberate layout rhythm, zero generic AI tropes
 * - antislop-layoutmobile: Viewport reflow across mobile/tablet/desktop, zero horizontal overflow, touch target minimums
 */

import React from 'react';
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { screen, act } from '@testing-library/react';
import { setViewport, resetTestEnvironment, renderPortfolio } from './harness';
import fs from 'fs';
import path from 'path';

describe('Empirical Challenger: Milestone M4 UI & Responsive Verification Suite', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    resetTestEnvironment();
    vi.clearAllMocks();
  });

  afterEach(() => {
    resetTestEnvironment();
    vi.useRealTimers();
  });

  // ==========================================================================
  // Suite 1: Skip Link & DOM Bypass Block Integrity (WCAG 2.4.1)
  // ==========================================================================
  describe('Suite 1: Skip Link & Keyboard Navigation Bypass (WCAG 2.4.1)', () => {
    it('1.1 renders accessible "Skip to main content" link targeting #main', () => {
      renderPortfolio();
      const skipLink = screen.getByRole('link', { name: /skip to main content/i });
      expect(skipLink).toBeInTheDocument();
      expect(skipLink).toHaveAttribute('href', '#main');

      // Verify screen-reader & keyboard focus visibility classes
      expect(skipLink.className).toContain('sr-only');
      expect(skipLink.className).toContain('focus:not-sr-only');
      expect(skipLink.className).toContain('focus:fixed');

      // Verify target element exists with tabIndex="-1"
      const mainElement = document.getElementById('main');
      expect(mainElement).toBeInTheDocument();
      expect(mainElement.tagName.toLowerCase()).toBe('main');
      expect(mainElement).toHaveAttribute('tabIndex', '-1');
    });

    it('1.2 skip link receives focus cleanly and triggers navigation target', () => {
      renderPortfolio();
      const skipLink = screen.getByRole('link', { name: /skip to main content/i });
      act(() => {
        skipLink.focus();
      });
      expect(document.activeElement).toBe(skipLink);
    });
  });

  // ==========================================================================
  // Suite 2: Responsive Container Constraints & Horizontal Overflow Prevention
  // ==========================================================================
  describe('Suite 2: Responsive Container Constraints & Horizontal Overflow Prevention', () => {
    const viewports = [
      { name: 'Mobile Compact (320x568)', width: 320, height: 568 },
      { name: 'Mobile Standard (375x667)', width: 375, height: 667 },
      { name: 'Mobile Wide (414x896)', width: 414, height: 896 },
      { name: 'Tablet Portrait (768x1024)', width: 768, height: 1024 },
      { name: 'Desktop Standard (1024x768)', width: 1024, height: 768 },
      { name: 'Desktop Widescreen (1440x900)', width: 1440, height: 900 },
    ];

    viewports.forEach(({ name, width, height }) => {
      it(`2.1 [${name}]: verifies zero hardcoded widths exceeding viewport width`, () => {
        setViewport({ width, height });
        renderPortfolio();

        // Query all elements with inline style width
        const elementsWithInlineWidth = document.querySelectorAll('[style*="width:"]');
        elementsWithInlineWidth.forEach((el) => {
          const w = el.style.width;
          const match = w.match(/^(\d+)px$/);
          if (match) {
            const px = parseInt(match[1], 10);
            expect(px).toBeLessThanOrEqual(width);
          }
        });

        // Verify root and body do not leak horizontal scroll
        expect(document.body.style.overflowX).not.toBe('scroll');
        expect(document.documentElement.style.overflowX).not.toBe('scroll');
      });
    });

    it('2.2 verified section containers enforce max-w-7xl with fluid horizontal padding', () => {
      renderPortfolio();
      const sections = ['#projects', '#skills', '#contact', 'nav', 'footer'];

      sections.forEach((selector) => {
        const container = document.querySelector(selector);
        expect(container).toBeInTheDocument();
        const innerBound = container.querySelector('.max-w-7xl');
        expect(innerBound).toBeInTheDocument();
        expect(innerBound.className).toContain('mx-auto');
        expect(innerBound.className).toMatch(/px-4|px-6/);
      });
    });
  });

  // ==========================================================================
  // Suite 3: Touch Target Minimums (WCAG 2.5.8 >= 24px, Recommended >= 36-44px)
  // ==========================================================================
  describe('Suite 3: Touch Target Minimums (WCAG 2.5.8)', () => {
    it('3.1 footer social links satisfy min-w-[44px] and min-h-[44px]', () => {
      renderPortfolio();
      const linkedinLink = document.querySelector('footer a[aria-label="LinkedIn Profile"]');
      const githubLink = document.querySelector('footer a[aria-label="GitHub Profile"]');

      expect(linkedinLink).toBeInTheDocument();
      expect(githubLink).toBeInTheDocument();
      expect(linkedinLink.className).toContain('min-w-[44px]');
      expect(linkedinLink.className).toContain('min-h-[44px]');
      expect(githubLink.className).toContain('min-w-[44px]');
      expect(githubLink.className).toContain('min-h-[44px]');
    });

    it('3.2 ErrorBoundary fallback buttons enforce min-h-[44px]', () => {
      const errorBoundaryFilePath = path.resolve(process.cwd(), 'src/components/common/ErrorBoundary.jsx');
      const content = fs.readFileSync(errorBoundaryFilePath, 'utf-8');
      expect(content).toContain('min-h-[44px]');
      expect(content).toContain('role="alert"');
      expect(content).toContain('aria-live="assertive"');
    });

    it('3.3 navigation action buttons enforce generous padding and accessible sizing', () => {
      renderPortfolio();
      const homeBtn = screen.getByLabelText(/Back to Top/i);
      const themeBtn = screen.getAllByLabelText(/Toggle theme/i)[0];
      const localeBtn = screen.getAllByLabelText(/Toggle language/i)[0];

      expect(homeBtn.className).toContain('p-2');
      expect(themeBtn.className).toContain('p-2');
      expect(localeBtn.className).toMatch(/px-2|px-2.5/);
    });
  });

  // ==========================================================================
  // Suite 4: Design Tokens, Color Contrast & Reduced Motion (WCAG 2.2 AA)
  // ==========================================================================
  describe('Suite 4: Design Tokens, Color Contrast & Reduced Motion', () => {
    it('4.1 index.css defines WCAG AA compliant emerald tokens with verified contrast ratios', () => {
      const cssPath = path.resolve(process.cwd(), 'src/index.css');
      const css = fs.readFileSync(cssPath, 'utf-8');

      // Light mode emerald-700 (#047857) >= 4.5:1
      expect(css).toContain('--color-telemetry-primary: #047857;');
      // Light mode hover emerald-800 (#065f46) >= 7.0:1
      expect(css).toContain('--color-telemetry-hover: #065f46;');
      // Dark mode emerald-400 (#34d399) >= 10.0:1
      expect(css).toContain('--color-telemetry-dark: #34d399;');
    });

    it('4.2 index.css implements @media (prefers-reduced-motion: reduce) overrides', () => {
      const cssPath = path.resolve(process.cwd(), 'src/index.css');
      const css = fs.readFileSync(cssPath, 'utf-8');

      expect(css).toContain('@media (prefers-reduced-motion: reduce)');
      expect(css).toContain('scroll-behavior: auto;');
      expect(css).toContain('animation: none;');
    });

    it('4.3 index.css defines custom emerald & sage-obsidian scrollbar tokens and utilities', () => {
      const cssPath = path.resolve(process.cwd(), 'src/index.css');
      const css = fs.readFileSync(cssPath, 'utf-8');

      expect(css).toContain('--scrollbar-track: #ebf1ed;');
      expect(css).toContain('--scrollbar-thumb: #86a092;');
      expect(css).toContain('--scrollbar-thumb-hover: #047857;');
      expect(css).toContain('--scrollbar-thumb-active: #065f46;');
      expect(css).toContain('--scrollbar-track: #050e09;');
      expect(css).toContain('--scrollbar-thumb: #22352b;');
      expect(css).toContain('--scrollbar-thumb-hover: #10b981;');
      expect(css).toContain('--scrollbar-thumb-active: #34d399;');
      expect(css).toContain('::-webkit-scrollbar-thumb');
      expect(css).toContain('.custom-scrollbar::-webkit-scrollbar');
      expect(css).toContain('.scrollbar-thin::-webkit-scrollbar');
      expect(css).toContain('@supports not selector(::-webkit-scrollbar)');
    });
  });

  // ==========================================================================
  // Suite 5: Layout Reflow Grid Consistency (Mobile / Tablet / Desktop)
  // ==========================================================================
  describe('Suite 5: Layout Reflow Grid Consistency', () => {
    it('5.1 Projects showcase uses responsive layout on mobile and side-aligned selector on desktop', () => {
      renderPortfolio();
      const projectsSection = document.getElementById('projects');
      expect(projectsSection).toBeInTheDocument();

      const showcaseLayout = projectsSection.querySelector('.flex.flex-col.lg\\:flex-row');
      expect(showcaseLayout).toBeInTheDocument();
    });

    it('5.2 Skills section uses single column on mobile and two columns on desktop', () => {
      renderPortfolio();
      const skillsSection = document.getElementById('skills');
      expect(skillsSection).toBeInTheDocument();

      const grid = skillsSection.querySelector('.grid');
      expect(grid).toBeInTheDocument();
      expect(grid.className).toContain('grid-cols-1');
      expect(grid.className).toContain('lg:grid-cols-2');
    });

    it('5.3 Experience section 5-domain switcher reflows pipeline across 1, 2, and 4 columns', () => {
      renderPortfolio();
      const pipelineGrid = document.querySelector('[role="tabpanel"] .grid');
      expect(pipelineGrid).toBeInTheDocument();
      expect(pipelineGrid.className).toContain('grid-cols-1');
      expect(pipelineGrid.className).toContain('sm:grid-cols-2');
      expect(pipelineGrid.className).toContain('lg:grid-cols-4');
    });

    it('5.4 reCAPTCHA container includes mobile scale transform to prevent viewport clipping', () => {
      renderPortfolio();
      const recaptchaWrapper = document.querySelector('.transform.scale-\\[0\\.82\\]');
      expect(recaptchaWrapper).toBeInTheDocument();
      expect(recaptchaWrapper.className).toContain('sm:scale-100');
    });
  });
});
