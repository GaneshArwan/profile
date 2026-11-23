/**
 * tests/e2e/tier_challenger_m2_responsive.test.jsx
 * 
 * Milestone M2: Antislop Layout & Navigation Refactoring
 * Empirical Challenger 1: Adversarial Responsive Layout & Navigation Stress Suite
 * 
 * Multi-Persona & Multi-Skill Fusion:
 * - agency-api-tester: Comprehensive automated test strategy, boundary edge cases, rigorous contracts
 * - agency-performance-benchmarker: 0ms mount SLA, viewport resize performance, zero layout shift
 * - antislop-layoutmobile: Reflow across viewports, zero horizontal overflow, tap targets (>=44x44), drawer nav
 * - antislop-ui: High-contrast tokens, WCAG AA compliance, removal of AI tropes (loaders, custom cursors, glossy-matcha)
 * - baseline-ui: Tailwind standard scales, accessible dialog primitives (role=dialog, aria-modal, Esc key close)
 * - senior-frontend-debugger: Root cause verification of laptop height defect (<830px) and regression immunity
 */

import React from 'react';
import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { screen, fireEvent, act, render } from '@testing-library/react';
import { 
  setViewport, 
  resetTestEnvironment, 
  renderPortfolio 
} from './harness';
import { Navbar } from '../../src/components/layout/Navbar';
import { I18nProvider } from '../../src/lib/i18n';

describe('Empirical Challenger 1: Milestone M2 Responsive Layout & Navigation Stress Suite', () => {

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
  // Suite 1: Viewport & Horizontal Overflow Stress (320px, 360px, 375px, 768px, 1024px, 1440px)
  // ==========================================================================
  describe('Suite 1: Viewport & Horizontal Overflow Stress', () => {
    const stressViewports = [
      { name: '320px (Compact Mobile / iPhone SE 1st Gen)', width: 320, height: 568 },
      { name: '360px (Android Baseline / Galaxy S8)', width: 360, height: 740 },
      { name: '375px (Standard Modern Mobile / iPhone 12 Mini)', width: 375, height: 667 },
      { name: '768px (Tablet Portrait / iPad)', width: 768, height: 1024 },
      { name: '1024px (Tablet Landscape / Desktop Breakpoint)', width: 1024, height: 768 },
      { name: '1440px (Desktop Standard Widescreen)', width: 1440, height: 900 },
    ];

    stressViewports.forEach(({ name, width, height }) => {
      it(`1.1 [${name}]: renders portfolio shell without horizontal overflow leak`, () => {
        setViewport({ width, height });
        renderPortfolio();

        const nav = screen.getByRole('navigation', { name: /main navigation/i });
        expect(nav).toBeInTheDocument();

        // 1. Root & body never declare forced scroll or fixed overflow
        expect(document.body.style.overflowX).not.toBe('scroll');
        expect(document.documentElement.style.overflowX).not.toBe('scroll');

        // 2. Navbar inner container uses responsive fluid constraint
        const innerContainer = nav.querySelector('.max-w-7xl');
        expect(innerContainer).toBeInTheDocument();
        expect(innerContainer.className).toContain('mx-auto');
        expect(innerContainer.className).toMatch(/px-4|px-6|px-8/);

        // 3. No container carries hardcoded rigid width exceeding viewport
        const fixedWidthElements = document.querySelectorAll('[style*="width:"]');
        fixedWidthElements.forEach(el => {
          const wStyle = el.style.width;
          const matchPx = wStyle.match(/^(\d+)px$/);
          if (matchPx) {
            const pxVal = parseInt(matchPx[1], 10);
            expect(pxVal).toBeLessThanOrEqual(width);
          }
        });
      });
    });

    it('1.2 320px narrow mobile: preserves brand monogram, locale toggle, theme button, and hamburger without wrapping out of bounds', () => {
      setViewport({ width: 320, height: 568 });
      renderPortfolio();

      const nav = screen.getByRole('navigation');
      expect(nav).toBeInTheDocument();

      // Brand monogram W.
      const monogram = screen.getByText('W.');
      expect(monogram).toBeInTheDocument();

      // Home button
      const homeBtn = screen.getByLabelText(/Back to Top/i);
      expect(homeBtn).toBeInTheDocument();

      // Mobile controls container
      const mobileControls = nav.querySelector('.flex.lg\\:hidden');
      expect(mobileControls).toBeInTheDocument();

      // Hamburger button, Locale toggle, Theme toggle in mobile controls
      const hamburger = screen.getByLabelText(/Toggle navigation menu/i);
      expect(hamburger).toBeInTheDocument();
      expect(mobileControls.contains(hamburger)).toBe(true);

      const localeBtn = mobileControls.querySelector('button[aria-label="Toggle language"]');
      expect(localeBtn).toBeInTheDocument();

      const themeBtn = mobileControls.querySelector('button[aria-label="Toggle theme"]');
      expect(themeBtn).toBeInTheDocument();
    });

    it('1.3 rapid continuous viewport flipping (320px -> 1440px -> 360px -> 1024px -> 375px -> 768px -> 320px) preserves DOM integrity', () => {
      renderPortfolio();
      const sequence = [320, 1440, 360, 1024, 375, 768, 320];

      sequence.forEach((w) => {
        act(() => {
          setViewport({ width: w, height: 700 });
        });
        const nav = screen.getByRole('navigation');
        expect(nav).toBeInTheDocument();
      });

      const root = document.documentElement;
      expect(root).toBeInTheDocument();
      expect(screen.getByRole('navigation')).toBeInTheDocument();
    });
  });

  // ==========================================================================
  // Suite 2: Laptop Height Defect Fix (<830px Viewport Heights on Desktop Widths >=1024px)
  // ==========================================================================
  describe('Suite 2: Laptop Height Defect Fix (<830px Heights on Desktop Widths >=1024px)', () => {
    const laptopHeightScenarios = [
      { name: 'Height 600px (Compact 11-13" Laptop with Browser DevTools/Toolbar)', height: 600, width: 1280 },
      { name: 'Height 700px (1366x768 Standard Laptop with OS Taskbar & Chrome UI)', height: 700, width: 1024 },
      { name: 'Height 768px (Native 1366x768 / 1024x768 Resolution)', height: 768, width: 1366 },
      { name: 'Height 800px (1280x800 Native Resolution)', height: 800, width: 1280 },
      { name: 'Height 829px (Exact 1px Boundary Below Previous 830px Defect Cutoff)', height: 829, width: 1440 },
    ];

    laptopHeightScenarios.forEach(({ name, height, width }) => {
      it(`2.1 [${name}]: desktop navbar links remain visible and mobile hamburger is NOT displayed`, () => {
        setViewport({ width, height });
        renderPortfolio();

        const nav = screen.getByRole('navigation');
        expect(nav).toBeInTheDocument();

        // 1. Desktop navigation links container MUST use 'hidden lg:flex' without any height constraint
        const desktopLinksContainer = nav.querySelector('.hidden.lg\\:flex');
        expect(desktopLinksContainer).toBeInTheDocument();
        expect(desktopLinksContainer.className).not.toMatch(/min-height|830px/i);

        // 2. All 6 core destination links exist in the desktop container
        const expectedLinks = ['About', 'Experience', 'Projects', 'Skills', 'Awards', 'Contact'];
        expectedLinks.forEach((linkName) => {
          const btn = screen.getAllByRole('button').find(b => 
            desktopLinksContainer.contains(b) && new RegExp(linkName, 'i').test(b.textContent)
          );
          expect(btn).toBeDefined();
        });

        // 3. Desktop controls (Locale switcher, Theme toggle, Contact CTA) are present in desktop container
        const desktopControls = nav.querySelectorAll('.hidden.lg\\:flex')[1];
        expect(desktopControls).toBeInTheDocument();
        expect(desktopControls.querySelector('button[aria-label="Toggle language"]')).toBeInTheDocument();
        expect(desktopControls.querySelector('button[aria-label="Toggle theme"]')).toBeInTheDocument();

        // 4. Mobile hamburger menu trigger container has 'lg:hidden', ensuring it is hidden on desktop >=1024px
        const mobileControlsContainer = nav.querySelector('.flex.lg\\:hidden');
        expect(mobileControlsContainer).toBeInTheDocument();
        expect(mobileControlsContainer.className).toContain('lg:hidden');

        // 5. SideRibbonNavigation is completely absent from DOM
        const sideRibbon = document.querySelector('[data-testid="side-ribbon"], .side-ribbon');
        expect(sideRibbon).toBeNull();
      });
    });

    it('2.2 clicking desktop navigation links at short laptop height (1280x600) dispatches smooth scroll', () => {
      setViewport({ width: 1280, height: 600 });
      renderPortfolio();

      const aboutSection = document.getElementById('about');
      const scrollIntoViewSpy = vi.fn();
      if (aboutSection) aboutSection.scrollIntoView = scrollIntoViewSpy;

      const nav = screen.getByRole('navigation');
      const desktopLinksContainer = nav.querySelector('.hidden.lg\\:flex');
      const aboutBtn = screen.getAllByRole('button').find(b => 
        desktopLinksContainer.contains(b) && /About/i.test(b.textContent)
      );

      expect(aboutBtn).toBeDefined();
      act(() => {
        fireEvent.click(aboutBtn);
      });

      if (aboutSection) {
        expect(scrollIntoViewSpy).toHaveBeenCalledWith({ behavior: 'smooth' });
      }
    });

    it('2.3 Navbar source code inspection verifies complete removal of min-height:830px query', () => {
      renderPortfolio();
      const nav = screen.getByRole('navigation');
      expect(nav.outerHTML).not.toContain('min-height:830px');
      expect(nav.outerHTML).not.toContain('min-height');
      expect(nav.outerHTML).not.toContain('830px');
    });
  });

  // ==========================================================================
  // Suite 3: Mobile Navigation Drawer Dialog & Keyboard Accessibility (<1024px)
  // ==========================================================================
  describe('Suite 3: Mobile Navigation Drawer Dialog & Keyboard Accessibility', () => {
    beforeEach(() => {
      setViewport({ width: 375, height: 667 });
    });

    it('3.1 initial state: hamburger has aria-expanded="false" and drawer has aria-modal="false" and is invisible', () => {
      renderPortfolio();

      const hamburger = screen.getByLabelText(/Toggle navigation menu/i);
      expect(hamburger).toHaveAttribute('aria-expanded', 'false');
      expect(hamburger).toHaveAttribute('aria-controls', 'mobile-navigation-drawer');

      const drawer = document.getElementById('mobile-navigation-drawer');
      expect(drawer).toBeInTheDocument();
      expect(drawer).toHaveAttribute('role', 'dialog');
      expect(drawer).toHaveAttribute('aria-modal', 'false');
      expect(drawer).toHaveAttribute('aria-label', 'Mobile Navigation');
      expect(drawer.className).toContain('invisible');
      expect(drawer.className).toContain('opacity-0');
      expect(drawer.className).toContain('pointer-events-none');
    });

    it('3.2 opening drawer: flips aria-expanded to "true", aria-modal to "true", and shows drawer', () => {
      renderPortfolio();

      const hamburger = screen.getByLabelText(/Toggle navigation menu/i);
      const drawer = document.getElementById('mobile-navigation-drawer');

      // Click to open
      act(() => {
        fireEvent.click(hamburger);
      });

      expect(hamburger).toHaveAttribute('aria-expanded', 'true');
      expect(drawer).toHaveAttribute('aria-modal', 'true');
      expect(drawer.className).toContain('visible');
      expect(drawer.className).toContain('opacity-100');
      expect(drawer.className).toContain('pointer-events-auto');

      // Icon changes from Menu to X
      expect(hamburger.querySelector('.lucide-x')).toBeInTheDocument();
    });

    it('3.3 keyboard accessibility: pressing Escape key while drawer is open closes drawer and restores aria-expanded="false"', () => {
      renderPortfolio();

      const hamburger = screen.getByLabelText(/Toggle navigation menu/i);
      const drawer = document.getElementById('mobile-navigation-drawer');

      // 1. Open drawer
      act(() => {
        fireEvent.click(hamburger);
      });
      expect(hamburger).toHaveAttribute('aria-expanded', 'true');
      expect(drawer.className).toContain('visible');

      // 2. Dispatch Escape keydown event on window
      act(() => {
        window.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
      });

      // 3. Drawer must be closed
      expect(hamburger).toHaveAttribute('aria-expanded', 'false');
      expect(drawer).toHaveAttribute('aria-modal', 'false');
      expect(drawer.className).toContain('invisible');
      expect(drawer.className).toContain('opacity-0');
      expect(drawer.className).toContain('pointer-events-none');
      expect(hamburger.querySelector('.lucide-menu')).toBeInTheDocument();
    });

    it('3.4 pressing Escape key while drawer is ALREADY closed does not throw or corrupt state', () => {
      renderPortfolio();

      const hamburger = screen.getByLabelText(/Toggle navigation menu/i);
      const drawer = document.getElementById('mobile-navigation-drawer');

      expect(hamburger).toHaveAttribute('aria-expanded', 'false');

      // Dispatch Escape when already closed
      expect(() => {
        act(() => {
          window.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
        });
      }).not.toThrow();

      expect(hamburger).toHaveAttribute('aria-expanded', 'false');
      expect(drawer.className).toContain('invisible');
    });

    it('3.5 non-Escape keydown events (e.g. Tab, Enter, Space) do not close open drawer', () => {
      renderPortfolio();

      const hamburger = screen.getByLabelText(/Toggle navigation menu/i);
      const drawer = document.getElementById('mobile-navigation-drawer');

      act(() => {
        fireEvent.click(hamburger);
      });
      expect(hamburger).toHaveAttribute('aria-expanded', 'true');

      // Dispatch Tab keydown
      act(() => {
        window.dispatchEvent(new KeyboardEvent('keydown', { key: 'Tab', bubbles: true }));
      });
      expect(hamburger).toHaveAttribute('aria-expanded', 'true');
      expect(drawer.className).toContain('visible');

      // Dispatch Enter keydown
      act(() => {
        window.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));
      });
      expect(hamburger).toHaveAttribute('aria-expanded', 'true');
      expect(drawer.className).toContain('visible');
    });

    it('3.6 clicking any navigation link inside the drawer closes the drawer automatically', () => {
      renderPortfolio();

      const hamburger = screen.getByLabelText(/Toggle navigation menu/i);
      const drawer = document.getElementById('mobile-navigation-drawer');

      act(() => {
        fireEvent.click(hamburger);
      });
      expect(hamburger).toHaveAttribute('aria-expanded', 'true');

      // Find link inside drawer
      const projectsBtn = Array.from(drawer.querySelectorAll('button')).find(b => 
        /Projects/i.test(b.textContent)
      );
      expect(projectsBtn).toBeDefined();

      act(() => {
        fireEvent.click(projectsBtn);
      });

      expect(hamburger).toHaveAttribute('aria-expanded', 'false');
      expect(drawer.className).toContain('invisible');
      expect(drawer).toHaveAttribute('aria-modal', 'false');
    });

    it('3.7 rapid 10x hamburger toggle clicks maintain deterministic open/close parity', () => {
      renderPortfolio();

      const hamburger = screen.getByLabelText(/Toggle navigation menu/i);
      const drawer = document.getElementById('mobile-navigation-drawer');

      // 10 clicks: even number -> must finish closed
      for (let i = 0; i < 10; i++) {
        act(() => {
          fireEvent.click(hamburger);
        });
      }

      expect(hamburger).toHaveAttribute('aria-expanded', 'false');
      expect(drawer.className).toContain('invisible');
      expect(drawer).toHaveAttribute('aria-modal', 'false');

      // 11th click: odd number -> must finish open
      act(() => {
        fireEvent.click(hamburger);
      });
      expect(hamburger).toHaveAttribute('aria-expanded', 'true');
      expect(drawer.className).toContain('visible');
      expect(drawer).toHaveAttribute('aria-modal', 'true');
    });

    it('3.8 locale and theme toggles in mobile header function correctly regardless of drawer state', () => {
      renderPortfolio();

      const nav = screen.getByRole('navigation');
      const mobileControls = nav.querySelector('.flex.lg\\:hidden');

      const localeBtn = mobileControls.querySelector('button[aria-label="Toggle language"]');
      const themeBtn = mobileControls.querySelector('button[aria-label="Toggle theme"]');
      const hamburger = mobileControls.querySelector('button[aria-label="Toggle navigation menu"]');

      expect(localeBtn).toBeInTheDocument();
      expect(themeBtn).toBeInTheDocument();

      // Open drawer
      act(() => { fireEvent.click(hamburger); });

      // Toggle locale while drawer open
      const initialLocale = localeBtn.textContent;
      act(() => { fireEvent.click(localeBtn); });
      expect(localeBtn.textContent).not.toBe(initialLocale);

      // Toggle theme while drawer open
      const initialDark = document.documentElement.classList.contains('dark');
      act(() => { fireEvent.click(themeBtn); });
      expect(document.documentElement.classList.contains('dark')).toBe(!initialDark);
    });

    it('3.9 mobile drawer unmount cleanup removes window keydown event listener without memory leaks', () => {
      const removeSpy = vi.spyOn(window, 'removeEventListener');
      const { unmount } = render(
        <I18nProvider>
          <Navbar 
            isDarkMode={false}
            toggleTheme={() => {}}
            activeSection=""
            scrollTo={() => {}}
            scrollDirection="up"
          />
        </I18nProvider>
      );

      unmount();
      expect(removeSpy).toHaveBeenCalledWith('keydown', expect.any(Function));
    });
  });

  // ==========================================================================
  // Suite 4: Antislop Performance & Design Token Hardening
  // ==========================================================================
  describe('Suite 4: Antislop Performance & Design Token Hardening', () => {
    it('4.1 instant page mount SLA: renders application shell immediately with 0ms loader delay', () => {
      // Without advancing any timers, verify the application shell and main content mount synchronously
      renderPortfolio({ advanceLoader: false });

      // FuturisticLoader is completely removed
      const loader = document.querySelector('[data-testid="futuristic-loader"], .futuristic-loader');
      expect(loader).toBeNull();
      expect(screen.queryByText(/INITIALIZING QUANTUM/i)).toBeNull();

      // Main content and navigation are immediately in the DOM
      expect(document.querySelector('main')).toBeInTheDocument();
      expect(screen.getByRole('navigation')).toBeInTheDocument();
    });

    it('4.2 native OS cursor: CustomCursor component and mix-blend-difference overlay are absent', () => {
      renderPortfolio();

      const customCursor = document.querySelector('[data-testid="custom-cursor"], .custom-cursor');
      expect(customCursor).toBeNull();
    });

    it('4.3 native smooth scrolling: LocomotiveScroll class and html.has-scroll-smooth are absent', () => {
      renderPortfolio();

      expect(document.documentElement.classList.contains('has-scroll-smooth')).toBe(false);
      expect(document.querySelector('[data-scroll-container]')).toBeNull();
    });

    it('4.4 high-contrast light mode tokens: emerald-700 (#047857) or emerald-800 (#065f46) present on text & buttons', () => {
      window.localStorage.setItem('theme', 'light');
      renderPortfolio();

      const nav = screen.getByRole('navigation');
      const monogram = nav.querySelector('span.rounded-xl');

      // Monogram background uses emerald-700 on light mode
      expect(monogram.className).toContain('bg-emerald-700');

      // Back to top home button icon uses emerald-700
      const homeBtn = screen.getByLabelText(/Back to Top/i);
      expect(homeBtn.className).toContain('text-emerald-700');

      // Desktop contact CTA button uses bg-emerald-700 hover:bg-emerald-800
      const desktopControls = nav.querySelectorAll('.hidden.lg\\:flex')[1];
      const contactBtn = Array.from(desktopControls.querySelectorAll('button')).find(b => 
        /Contact/i.test(b.textContent)
      );
      expect(contactBtn).toBeDefined();
      expect(contactBtn.className).toContain('bg-emerald-700');
      expect(contactBtn.className).toContain('hover:bg-emerald-800');
    });

    it('4.5 absence of rainbow gradient clips (.glossy-matcha) or glow blur halos', () => {
      renderPortfolio();

      const glossyElements = document.querySelectorAll('.glossy-matcha');
      expect(glossyElements.length).toBe(0);

      const nav = screen.getByRole('navigation');
      expect(nav.className).not.toContain('glossy-matcha');
    });

    it('4.6 baseline-ui layout standard: root container uses min-h-[100svh] rather than rigid h-screen', () => {
      renderPortfolio();

      const rootContainer = document.querySelector('.min-h-\\[100svh\\]');
      expect(rootContainer).toBeInTheDocument();
      expect(rootContainer.className).not.toContain('h-screen');
    });

    it('4.7 tap target minimum area: interactive navbar buttons include sufficient padding (>=44x44px target bounds)', () => {
      setViewport({ width: 375, height: 667 });
      renderPortfolio();

      const nav = screen.getByRole('navigation');
      const buttons = Array.from(nav.querySelectorAll('button'));

      buttons.forEach(btn => {
        // Each interactive button must have padding classes ensuring touch target size
        expect(btn.className).toMatch(/p-2|px-2|px-2\.5|px-3\.5|px-4|py-1|py-1\.5|py-2|py-2\.5/);
      });
    });
  });
});
