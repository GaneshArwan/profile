/**
 * tests/e2e/tier_challenger_m2_contrast_theme.test.jsx
 * Empirical Challenger 2: Adversarial Contrast Ratios & Theme/Locale Fuzzing Suite
 * Milestone M2 Antislop Layout & Navigation Refactoring
 * 
 * Fused Methodology:
 * - agency-api-tester: Rigorous contract verification, boundary fuzzing & error recovery
 * - agency-performance-benchmarker: High-frequency state cycling & transition stability
 * - antislop-layoutmobile: Mobile drawer dialogs, aria-* states, tap boundaries
 * - antislop-ui: Exact WCAG 2.1 math (relative luminance & contrast ratio), zero AI gradient/glow
 * - baseline-ui: Accessible primitives, aria-label/expanded, keyboard handling
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import React from 'react';
import { screen, act, fireEvent } from '@testing-library/react';
import fs from 'node:fs';
import path from 'node:path';
import { renderPortfolio, resetTestEnvironment, setViewport } from './harness';
import { translations, SUPPORTED_LOCALES } from '../../src/lib/i18n';

// ============================================================================
// WCAG 2.1 Color Mathematics Engine (W3C Recommendation)
// ============================================================================

/**
 * Parses a hex color string into 8-bit integer RGB components.
 */
function hexToRgb(hex) {
  const clean = hex.replace('#', '').trim();
  if (clean.length === 3) {
    return {
      r: parseInt(clean[0] + clean[0], 16),
      g: parseInt(clean[1] + clean[1], 16),
      b: parseInt(clean[2] + clean[2], 16),
    };
  }
  return {
    r: parseInt(clean.substring(0, 2), 16),
    g: parseInt(clean.substring(2, 4), 16),
    b: parseInt(clean.substring(4, 6), 16),
  };
}

/**
 * Converts sRGB channel (0-255) to linear relative luminance component.
 * Formula per WCAG 2.1:
 * If C_srgb <= 0.04045 then C_linear = C_srgb / 12.92
 * Else C_linear = ((C_srgb + 0.055) / 1.055) ^ 2.4
 */
function sRgbToLinear(channel8Bit) {
  const c = channel8Bit / 255;
  return c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
}

/**
 * Calculates relative luminance (0.0 for black to 1.0 for white)
 * L = 0.2126 * R + 0.7152 * G + 0.0722 * B
 */
function calculateRelativeLuminance(hex) {
  const { r, g, b } = hexToRgb(hex);
  return (
    0.2126 * sRgbToLinear(r) +
    0.7152 * sRgbToLinear(g) +
    0.0722 * sRgbToLinear(b)
  );
}

/**
 * Computes WCAG 2.1 contrast ratio between two colors:
 * (L1 + 0.05) / (L2 + 0.05), where L1 is the lighter of the two colors.
 * Returns ratio as a floating point number (e.g. 5.24 for 5.24:1).
 */
function calculateContrastRatio(hex1, hex2) {
  const l1 = calculateRelativeLuminance(hex1);
  const l2 = calculateRelativeLuminance(hex2);
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);
  return (lighter + 0.05) / (darker + 0.05);
}

describe('Challenger 2: Contrast Ratios, Theme & Locale Adversarial Stress Suite', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    resetTestEnvironment();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  // ==========================================================================
  // Suite 1: Mathematical WCAG 2.1 Contrast Ratio Verification
  // ==========================================================================
  describe('Suite 1: WCAG 2.1 Mathematical Contrast Verification', () => {
    const TOKENS = {
      emerald700: '#047857',
      emerald800: '#065f46',
      emerald500: '#10b981',
      emerald400: '#34d399',
      slate50: '#f8fafc',
      white: '#ffffff',
      slate950: '#020617',
    };

    it('1.1 Light mode primary token emerald-700 (#047857) vs slate-50 (#f8fafc) meets WCAG AA (>= 4.5:1)', () => {
      const ratio = calculateContrastRatio(TOKENS.emerald700, TOKENS.slate50);
      expect(ratio).toBeGreaterThanOrEqual(4.5);
      expect(Number(ratio.toFixed(2))).toBe(5.24);
    });

    it('1.2 Light mode primary token emerald-700 (#047857) vs white (#ffffff) meets WCAG AA (>= 4.5:1)', () => {
      const ratio = calculateContrastRatio(TOKENS.emerald700, TOKENS.white);
      expect(ratio).toBeGreaterThanOrEqual(4.5);
      expect(Number(ratio.toFixed(2))).toBe(5.48);
    });

    it('1.3 Solid button text (white #ffffff on emerald-700 #047857) meets WCAG AA (>= 4.5:1)', () => {
      const ratio = calculateContrastRatio(TOKENS.white, TOKENS.emerald700);
      expect(ratio).toBeGreaterThanOrEqual(4.5);
      expect(Number(ratio.toFixed(2))).toBe(5.48);
    });

    it('1.4 Light mode hover token emerald-800 (#065f46) vs slate-50 (#f8fafc) meets WCAG AAA (>= 7.0:1)', () => {
      const ratio = calculateContrastRatio(TOKENS.emerald800, TOKENS.slate50);
      expect(ratio).toBeGreaterThanOrEqual(7.0);
      expect(Number(ratio.toFixed(2))).toBe(7.34);
    });

    it('1.5 Light mode hover token emerald-800 (#065f46) vs white (#ffffff) meets WCAG AAA (>= 7.0:1)', () => {
      const ratio = calculateContrastRatio(TOKENS.emerald800, TOKENS.white);
      expect(ratio).toBeGreaterThanOrEqual(7.0);
      expect(Number(ratio.toFixed(2))).toBe(7.68);
    });

    it('1.6 Dark mode primary token emerald-400 (#34d399) vs slate-950 (#020617) meets WCAG AAA (>= 7.0:1)', () => {
      const ratio = calculateContrastRatio(TOKENS.emerald400, TOKENS.slate950);
      expect(ratio).toBeGreaterThanOrEqual(7.0);
      expect(Number(ratio.toFixed(2))).toBe(10.49);
    });

    it('1.7 Dark mode monogram badge (slate-950 on emerald-500 #10b981) meets WCAG AAA (>= 7.0:1)', () => {
      const ratio = calculateContrastRatio(TOKENS.slate950, TOKENS.emerald500);
      expect(ratio).toBeGreaterThanOrEqual(7.0);
      expect(Number(ratio.toFixed(2))).toBe(7.95);
    });

    it('1.8 Mathematical proof of baseline defect: emerald-500 (#10b981) on slate-50 fails WCAG AA (< 4.5:1)', () => {
      const ratio = calculateContrastRatio(TOKENS.emerald500, TOKENS.slate50);
      expect(ratio).toBeLessThan(4.5);
      expect(Number(ratio.toFixed(2))).toBe(2.42);
    });

    it('1.9 Mathematical proof of baseline defect: white text on emerald-500 (#10b981) button fails WCAG AA (< 4.5:1)', () => {
      const ratio = calculateContrastRatio(TOKENS.white, TOKENS.emerald500);
      expect(ratio).toBeLessThan(4.5);
      expect(Number(ratio.toFixed(2))).toBe(2.54);
    });
  });

  // ==========================================================================
  // Suite 2: Codebase Static & AST Audit for Token Hygiene
  // ==========================================================================
  describe('Suite 2: Codebase Token Hygiene & Antislop CSS Audit', () => {
    it('2.1 src/index.css defines compliant telemetry color tokens', () => {
      const cssPath = path.resolve(process.cwd(), 'src/index.css');
      const cssContent = fs.readFileSync(cssPath, 'utf-8');

      expect(cssContent).toContain('--color-telemetry-primary: #047857');
      expect(cssContent).toContain('--color-telemetry-hover: #065f46');
      expect(cssContent).toContain('--color-telemetry-dark: #34d399');
    });

    it('2.2 src/index.css contains zero instances of locomotive-scroll or .glossy-matcha', () => {
      const cssPath = path.resolve(process.cwd(), 'src/index.css');
      const cssContent = fs.readFileSync(cssPath, 'utf-8');

      expect(cssContent).not.toContain('.glossy-matcha');
      expect(cssContent).not.toContain('locomotive-scroll');
      expect(cssContent).not.toContain('has-scroll-smooth');
      expect(cssContent).not.toContain('[data-scroll-container]');
    });

    it('2.3 Active components contain zero un-prefixed text-emerald-500 tokens', () => {
      const activeFiles = [
        'src/App.jsx',
        'src/components/layout/Navbar.jsx',
        'src/components/layout/Footer.jsx',
        'src/components/sections/Hero.jsx',
        'src/components/sections/About.jsx',
        'src/components/sections/Projects.jsx',
        'src/components/sections/Experience.jsx',
        'src/components/sections/Contact.jsx',
        'src/components/ui/ProjectCard.jsx',
        'src/components/ui/SectionHeader.jsx',
        'src/components/ui/CertificateModal.jsx',
        'src/components/ui/MarqueeSection.jsx',
      ];

      for (const relPath of activeFiles) {
        const fullPath = path.resolve(process.cwd(), relPath);
        if (fs.existsSync(fullPath)) {
          const content = fs.readFileSync(fullPath, 'utf-8');
          // Match text-emerald-500 that is NOT preceded by 'dark:'
          const matches = content.match(/(?<!dark:)text-emerald-500\b/g);
          expect(matches, `Found forbidden low-contrast text-emerald-500 in ${relPath}`).toBeNull();
        }
      }
    });

    it('2.4 Active components contain zero solid un-prefixed bg-emerald-500 button backgrounds on light mode', () => {
      const activeFiles = [
        'src/components/layout/Navbar.jsx',
        'src/components/sections/Hero.jsx',
        'src/components/sections/Contact.jsx',
        'src/components/sections/Projects.jsx',
        'src/components/ui/ProjectCard.jsx',
      ];

      for (const relPath of activeFiles) {
        const fullPath = path.resolve(process.cwd(), relPath);
        if (fs.existsSync(fullPath)) {
          const content = fs.readFileSync(fullPath, 'utf-8');
          // Match bg-emerald-500 that is NOT preceded by 'dark:' or 'dark:hover:' and NOT opacity/alpha like bg-emerald-500/10
          const matches = content.match(/(?<!dark:(?:hover:)?)bg-emerald-500(?![/-])/g);
          expect(matches, `Found forbidden solid bg-emerald-500 on light mode in ${relPath}`).toBeNull();
        }
      }
    });
  });

  // ==========================================================================
  // Suite 3: Rapid Theme Toggle Adversarial Stress Test (50+ Clicks)
  // ==========================================================================
  describe('Suite 3: Rapid Theme Toggle Adversarial Stress Suite', () => {
    it('3.1 50 rapid consecutive theme clicks maintain zero errors and exact parity', () => {
      renderPortfolio();
      const root = document.documentElement;
      const initialDark = root.classList.contains('dark');

      const themeButtons = screen.getAllByRole('button', { name: /toggle theme/i });
      expect(themeButtons.length).toBeGreaterThan(0);
      const themeBtn = themeButtons[0];

      // Execute 50 rapid sequential clicks
      for (let i = 1; i <= 50; i++) {
        act(() => {
          fireEvent.click(themeBtn);
        });
        const expectedDark = i % 2 === 1 ? !initialDark : initialDark;
        expect(root.classList.contains('dark')).toBe(expectedDark);
        expect(window.localStorage.getItem('theme')).toBe(expectedDark ? 'dark' : 'light');
      }

      // Final state after 50 toggles must match initial state exactly
      expect(root.classList.contains('dark')).toBe(initialDark);
      expect(window.localStorage.getItem('theme')).toBe(initialDark ? 'dark' : 'light');
    });

    it('3.2 51 rapid theme clicks invert state cleanly with persistent storage', () => {
      renderPortfolio();
      const root = document.documentElement;
      const initialDark = root.classList.contains('dark');

      const themeButtons = screen.getAllByRole('button', { name: /toggle theme/i });
      const themeBtn = themeButtons[0];

      for (let i = 0; i < 51; i++) {
        act(() => {
          fireEvent.click(themeBtn);
        });
      }

      // 51 clicks = inverted state
      expect(root.classList.contains('dark')).toBe(!initialDark);
      expect(window.localStorage.getItem('theme')).toBe(!initialDark ? 'dark' : 'light');
    });

    it('3.3 Interleaved rapid clicks across Desktop and Mobile theme buttons stay synchronized', () => {
      renderPortfolio();
      const root = document.documentElement;

      const themeButtons = screen.getAllByRole('button', { name: /toggle theme/i });
      expect(themeButtons.length).toBeGreaterThanOrEqual(2);
      const [desktopBtn, mobileBtn] = themeButtons;

      let currentExpectedDark = root.classList.contains('dark');

      for (let cycle = 0; cycle < 20; cycle++) {
        // Desktop click
        act(() => {
          fireEvent.click(desktopBtn);
        });
        currentExpectedDark = !currentExpectedDark;
        expect(root.classList.contains('dark')).toBe(currentExpectedDark);

        // Mobile click
        act(() => {
          fireEvent.click(mobileBtn);
        });
        currentExpectedDark = !currentExpectedDark;
        expect(root.classList.contains('dark')).toBe(currentExpectedDark);
      }

      expect(root.classList.contains('dark')).toBe(true);
      expect(window.localStorage.getItem('theme')).toBe('dark');
    });

    it('3.4 Theme toggle recovers gracefully when localStorage throws QuotaExceededError or SecurityError', () => {
      renderPortfolio();
      const root = document.documentElement;
      const initialDark = root.classList.contains('dark');

      const originalSetItem = window.localStorage.setItem;
      window.localStorage.setItem = vi.fn().mockImplementation(() => {
        const err = new Error('The quota has been exceeded');
        err.name = 'QuotaExceededError';
        throw err;
      });

      const themeButtons = screen.getAllByRole('button', { name: /toggle theme/i });
      const themeBtn = themeButtons[0];

      // Must not throw uncaught error
      expect(() => {
        act(() => {
          fireEvent.click(themeBtn);
        });
      }).not.toThrow();

      // UI state must still toggle
      expect(root.classList.contains('dark')).toBe(!initialDark);

      // Restore localStorage
      window.localStorage.setItem = originalSetItem;
    });

    it('3.5 Hostile or corrupted theme strings in localStorage do not crash application bootstrap', () => {
      const maliciousPayloads = [
        'null',
        'undefined',
        'DARK',
        'LIGHT',
        '"><script>alert(1)</script>',
        '{"theme":"dark"}',
        'light; DROP TABLE users;',
        '   ',
        '',
      ];

      for (const payload of maliciousPayloads) {
        resetTestEnvironment();
        window.localStorage.setItem('theme', payload);

        expect(() => {
          renderPortfolio();
        }).not.toThrow();

        const root = document.documentElement;
        // Hostile non-'dark' strings should either be treated as light or fallback cleanly
        expect(typeof root.classList.contains('dark')).toBe('boolean');
      }
    });
  });

  // ==========================================================================
  // Suite 4: Rapid Locale Switcher Adversarial Stress Test (50+ Invocations)
  // ==========================================================================
  describe('Suite 4: Rapid Locale Switcher Adversarial Stress Suite', () => {
    it('4.1 50 rapid consecutive locale clicks maintain zero errors and exact parity', () => {
      renderPortfolio();

      const localeButtons = screen.getAllByRole('button', { name: /toggle language/i });
      expect(localeButtons.length).toBeGreaterThan(0);
      const localeBtn = localeButtons[0];

      expect(localeBtn.textContent.trim().toLowerCase()).toBe('en');

      for (let i = 1; i <= 50; i++) {
        act(() => {
          fireEvent.click(localeBtn);
        });
        const expectedLocale = i % 2 === 1 ? 'id' : 'en';
        expect(window.localStorage.getItem('portfolio_locale')).toBe(expectedLocale);
      }

      // After 50 clicks (even), should be back to 'en'
      expect(window.localStorage.getItem('portfolio_locale')).toBe('en');
    });

    it('4.2 51 rapid locale clicks invert to Indonesian with live reactive DOM updates', () => {
      renderPortfolio();

      const localeButtons = screen.getAllByRole('button', { name: /toggle language/i });
      const localeBtn = localeButtons[0];

      for (let i = 0; i < 51; i++) {
        act(() => {
          fireEvent.click(localeBtn);
        });
      }

      expect(window.localStorage.getItem('portfolio_locale')).toBe('id');

      // Check reactive DOM updates in Navbar links
      const indonesianLinks = ['Tentang', 'Pengalaman', 'Proyek', 'Keahlian', 'Penghargaan', 'Kontak'];
      for (const label of indonesianLinks) {
        expect(screen.getAllByText(label).length).toBeGreaterThan(0);
      }
    });

    it('4.3 Complete dictionary parity between en and id translations (zero missing keys)', () => {
      function getAllLeafKeys(obj, prefix = '') {
        let keys = [];
        for (const [key, val] of Object.entries(obj)) {
          const currentPath = prefix ? `${prefix}.${key}` : key;
          if (val && typeof val === 'object' && !Array.isArray(val)) {
            keys = keys.concat(getAllLeafKeys(val, currentPath));
          } else {
            keys.push(currentPath);
          }
        }
        return keys;
      }

      const enKeys = getAllLeafKeys(translations.en).sort();
      const idKeys = getAllLeafKeys(translations.id).sort();

      // Parity check
      expect(idKeys).toEqual(enKeys);

      // Verify no empty string values
      for (const keyPath of enKeys) {
        const parts = keyPath.split('.');
        let enVal = translations.en;
        let idVal = translations.id;
        for (const p of parts) {
          enVal = enVal[p];
          idVal = idVal[p];
        }
        expect(typeof enVal).toBe('string');
        expect(enVal.length).toBeGreaterThan(0);
        expect(typeof idVal).toBe('string');
        expect(idVal.length).toBeGreaterThan(0);
      }
    });

    it('4.4 100 alternating operations of simultaneous theme and locale switches', () => {
      renderPortfolio();
      const root = document.documentElement;

      const themeButtons = screen.getAllByRole('button', { name: /toggle theme/i });
      const localeButtons = screen.getAllByRole('button', { name: /toggle language/i });

      const themeBtn = themeButtons[0];
      const localeBtn = localeButtons[0];

      // Execute 50 cycles of (toggleTheme -> toggleLocale) = 100 operations
      for (let cycle = 1; cycle <= 50; cycle++) {
        act(() => {
          fireEvent.click(themeBtn);
        });
        act(() => {
          fireEvent.click(localeBtn);
        });

        const expectedDark = cycle % 2 === 1 ? false : true;
        const expectedLocale = cycle % 2 === 1 ? 'id' : 'en';

        expect(root.classList.contains('dark')).toBe(expectedDark);
        expect(window.localStorage.getItem('theme')).toBe(expectedDark ? 'dark' : 'light');
        expect(window.localStorage.getItem('portfolio_locale')).toBe(expectedLocale);
      }

      // After 50 cycles (even), must be back in dark mode and English
      expect(root.classList.contains('dark')).toBe(true);
      expect(window.localStorage.getItem('theme')).toBe('dark');
      expect(window.localStorage.getItem('portfolio_locale')).toBe('en');
    });

    it('4.5 Mobile drawer dialog toggles open/close repeatedly and responds to Escape key', () => {
      setViewport({ width: 375, height: 667 });
      renderPortfolio();

      const hamburgerBtn = screen.getByRole('button', { name: /toggle navigation menu/i });
      expect(hamburgerBtn.getAttribute('aria-expanded')).toBe('false');

      const mobileDrawer = document.getElementById('mobile-navigation-drawer');
      expect(mobileDrawer).toBeInTheDocument();
      expect(mobileDrawer.getAttribute('aria-modal')).toBe('false');

      // Open drawer
      act(() => {
        fireEvent.click(hamburgerBtn);
      });
      expect(hamburgerBtn.getAttribute('aria-expanded')).toBe('true');
      expect(mobileDrawer.getAttribute('aria-modal')).toBe('true');

      // Close via Escape key
      act(() => {
        fireEvent.keyDown(window, { key: 'Escape', code: 'Escape' });
      });
      expect(hamburgerBtn.getAttribute('aria-expanded')).toBe('false');
      expect(mobileDrawer.getAttribute('aria-modal')).toBe('false');

      // Rapidly toggle 20 times
      for (let i = 0; i < 20; i++) {
        act(() => {
          fireEvent.click(hamburgerBtn);
        });
      }
      expect(hamburgerBtn.getAttribute('aria-expanded')).toBe('false');
    });
  });
});
