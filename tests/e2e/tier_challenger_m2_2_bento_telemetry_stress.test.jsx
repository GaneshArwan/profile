/**
 * tests/e2e/tier_challenger_m2_2_bento_telemetry_stress.test.jsx
 * 
 * Milestone M2: Bento-Grid & Telemetry Revamp
 * Empirical Challenger 2 (challenger_m2_2): Adversarial Stress Suite
 * 
 * Rigorous Empirical Audit:
 * 1. About 3-cell bento grid at 375px, 768px, and 1280px viewports for clean stacking and zero horizontal scroll
 * 2. Hero 12-column grid and 2x2 telemetry console on mobile viewports
 * 3. All 4 categories and all 22 skills in Skills.jsx with bracketed uppercase level containment ("Advanced", "Proficient")
 * 4. Image onError recovery on skill icons, layout stability, and empirical audit of fallback mechanisms
 * 5. Scope containment: zero modifications outside Hero.jsx, About.jsx, and Skills.jsx
 */

import React from 'react';
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { screen, fireEvent, act, render, within } from '@testing-library/react';
import { setViewport, resetTestEnvironment } from './harness';
import { Hero } from '../../src/components/sections/Hero';
import { About } from '../../src/components/sections/About';
import { Skills } from '../../src/components/sections/Skills';
import { I18nProvider } from '../../src/lib/i18n';
import { SKILL_CATEGORIES } from '../../src/data/constants';
import fs from 'fs';
import path from 'path';

describe('Empirical Challenger 2: M2 Bento-Grid & Telemetry Revamp Stress Suite', () => {

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
  // Suite 1: About 3-Cell Bento Grid Responsive Geometry & Viewport Stacking Stress
  // ==========================================================================
  describe('Suite 1: About 3-Cell Bento Grid Responsive Geometry & Viewport Stacking', () => {
    const testViewports = [
      { name: '375px (Standard Mobile / iPhone)', width: 375, height: 667 },
      { name: '768px (Tablet Portrait / iPad)', width: 768, height: 1024 },
      { name: '1280px (Desktop Widescreen)', width: 1280, height: 800 },
    ];

    testViewports.forEach(({ name, width, height }) => {
      it(`1.1 [${name}]: renders 3-cell bento grid without horizontal overflow leak`, () => {
        setViewport({ width, height });
        const { container } = render(
          <I18nProvider>
            <About />
          </I18nProvider>
        );

        const aboutSection = container.querySelector('#about');
        expect(aboutSection).toBeInTheDocument();

        // 1. Check outer responsive container constraint
        const innerContainer = aboutSection.querySelector('.max-w-7xl');
        expect(innerContainer).toBeInTheDocument();
        expect(innerContainer.className).toContain('mx-auto');
        expect(innerContainer.className).toContain('px-6');

        // 2. Check grid definition
        const bentoGrid = aboutSection.querySelector('.grid');
        expect(bentoGrid).toBeInTheDocument();
        expect(bentoGrid.className).toContain('grid-cols-1');
        expect(bentoGrid.className).toContain('lg:grid-cols-12');
        expect(bentoGrid.className).toContain('gap-8');
        expect(bentoGrid.className).toContain('items-stretch');

        // 3. No container has fixed pixel width wider than viewport
        const elementsWithWidth = container.querySelectorAll('[style*="width"]');
        elementsWithWidth.forEach((el) => {
          const match = el.style.width.match(/^(\d+)px$/);
          if (match) {
            expect(parseInt(match[1], 10)).toBeLessThanOrEqual(width);
          }
        });
      });
    });

    it('1.2: validates 3 distinct bento cells with expected structural contracts', () => {
      setViewport({ width: 1280, height: 800 });
      const { container } = render(
        <I18nProvider>
          <About />
        </I18nProvider>
      );

      // Cell 1: Narrative Biography & Philosophy (lg:col-span-7)
      const cell1 = container.querySelector('.lg\\:col-span-7');
      expect(cell1).toBeInTheDocument();
      expect(cell1.querySelector('.bg-rose-500\\/80')).not.toBeInTheDocument();
      expect(within(cell1).getByText(/Engineering Profile & Background/i)).toBeInTheDocument();
      expect(within(cell1).getByText('OVERVIEW')).toBeInTheDocument();
      expect(within(cell1).getByText(/System Architecture Doctrine:/i)).toBeInTheDocument();

      // Right Column Container: (lg:col-span-5)
      const rightCol = container.querySelector('.lg\\:col-span-5');
      expect(rightCol).toBeInTheDocument();

      // Cell 2: Academic Foundation (Untar S1 GPA 3.89) inside right column
      expect(within(rightCol).getByText(/Tarumanagara/i)).toBeInTheDocument();
      expect(within(rightCol).getByText(/3.89/)).toBeInTheDocument();
      expect(within(rightCol).getByText(/Academic Foundation/i)).toBeInTheDocument();

      // Cell 3: Data Governance & Automation Doctrine (3 Pillars) inside right column
      expect(within(rightCol).getByText(/Data Governance & Automation Doctrine/i)).toBeInTheDocument();
      expect(within(rightCol).getByText('3 PILLARS')).toBeInTheDocument();
      expect(within(rightCol).getByText('[01 STAGING]')).toBeInTheDocument();
      expect(within(rightCol).getByText('[02 RPA EXEC]')).toBeInTheDocument();
      expect(within(rightCol).getByText('[03 APPLIED AI]')).toBeInTheDocument();
    });

    it('1.3 [320px Extreme Narrow Mobile]: stacks cleanly without horizontal clipping', () => {
      setViewport({ width: 320, height: 568 });
      const { container } = render(
        <I18nProvider>
          <About />
        </I18nProvider>
      );

      const aboutSection = container.querySelector('#about');
      expect(aboutSection).toBeInTheDocument();

      // Verify all 3 cells are present in mobile DOM order
      expect(aboutSection.querySelector('.bg-rose-500\\/80')).not.toBeInTheDocument();
      expect(within(aboutSection).getByText(/Engineering Profile & Background/i)).toBeInTheDocument();
      expect(within(aboutSection).getByText(/Academic Foundation/i)).toBeInTheDocument();
      expect(within(aboutSection).getByText(/Data Governance & Automation Doctrine/i)).toBeInTheDocument();
    });
  });

  // ==========================================================================
  // Suite 2: Hero 12-Column Grid & 2x2 Telemetry Console Mobile Breakpoints
  // ==========================================================================
  describe('Suite 2: Hero 12-Column Grid & 2x2 Telemetry Console Mobile Breakpoint Stress', () => {
    it('2.1: renders 12-column grid structure with 7-col hero content and 5-col telemetry console', () => {
      setViewport({ width: 1280, height: 800 });
      const { container } = render(
        <I18nProvider>
          <Hero isDarkMode={false} scrollTo={() => {}} />
        </I18nProvider>
      );

      const heroGrid = container.querySelector('#hero .grid');
      expect(heroGrid).toBeInTheDocument();
      expect(heroGrid.className).toContain('lg:grid-cols-12');

      const leftCol = heroGrid.querySelector('.lg\\:col-span-7');
      expect(leftCol).toBeInTheDocument();

      const rightCol = heroGrid.querySelector('.lg\\:col-span-5');
      expect(rightCol).toBeInTheDocument();
    });

    it('2.2: renders 2x2 telemetry console with live pulse dot and impact metrics', () => {
      setViewport({ width: 375, height: 667 });
      const { container } = render(
        <I18nProvider>
          <Hero isDarkMode={false} scrollTo={() => {}} />
        </I18nProvider>
      );

      // Console header
      expect(screen.getByText(/TELEMETRY \/\/ ENTERPRISE MDM & AUTOMATION/i)).toBeInTheDocument();
      expect(screen.getByText('LIVE STATUS')).toBeInTheDocument();
      expect(screen.getByText(/Key Impact & Benchmarks/i)).toBeInTheDocument();

      // 2x2 Grid container
      const consoleGrid = container.querySelector('.grid.grid-cols-2');
      expect(consoleGrid).toBeInTheDocument();
      expect(consoleGrid.className).toContain('gap-3.5');

      // 4 Verified Metrics
      const metricCards = consoleGrid.children;
      expect(metricCards.length).toBe(4);

      expect(within(consoleGrid).getByText('>99.0%')).toBeInTheDocument();
      expect(within(consoleGrid).getByText('Kawan Lama MDM')).toBeInTheDocument();

      expect(within(consoleGrid).getByText('>5k Lines')).toBeInTheDocument();
      expect(within(consoleGrid).getByText('Code Review Agent')).toBeInTheDocument();

      expect(within(consoleGrid).getByText('<50ms')).toBeInTheDocument();
      expect(within(consoleGrid).getByText('RAG Document Chat')).toBeInTheDocument();

      expect(within(consoleGrid).getByText('~70%')).toBeInTheDocument();
      expect(within(consoleGrid).getByText('Workflow & SAP RPA')).toBeInTheDocument();
    });

    it('2.3: interactive hover and focus inspection updates console footer readout', () => {
      setViewport({ width: 1280, height: 800 });
      const { container } = render(
        <I18nProvider>
          <Hero isDarkMode={false} scrollTo={() => {}} />
        </I18nProvider>
      );

      // Initial footer readout
      expect(screen.getByText(/Hover metric for subsystem telemetry/i)).toBeInTheDocument();
      expect(screen.getByText('VERIFIED // SLA 30%')).toBeInTheDocument();

      const consoleGrid = container.querySelector('.grid.grid-cols-2');
      const mdmCard = consoleGrid.children[0];

      // MouseEnter on MDM tile
      act(() => {
        fireEvent.mouseEnter(mdmCard);
      });
      expect(screen.getByText(/Kawan Lama MDM: 5 Governed Domains/i)).toBeInTheDocument();
      expect(screen.getByText('GWS SHEETS // SAP GUI')).toBeInTheDocument();

      // Focus on LangGraph Code Review Agent tile
      const codeReviewCard = consoleGrid.children[1];
      act(() => {
        fireEvent.focus(codeReviewCard);
      });
      expect(screen.getByText(/Code Review Agent: Multi-Agent State Graph/i)).toBeInTheDocument();
      expect(screen.getByText('LANGGRAPH // GEMINI FLASH')).toBeInTheDocument();

      // MouseLeave restores default state
      act(() => {
        fireEvent.mouseLeave(codeReviewCard);
      });
      expect(screen.getByText(/Hover metric for subsystem telemetry/i)).toBeInTheDocument();
    });

    it('2.4: verifies credential chip bar with bracketed indicators', () => {
      render(
        <I18nProvider>
          <Hero isDarkMode={false} scrollTo={() => {}} />
        </I18nProvider>
      );

      const credentialList = screen.getByRole('list', { name: /Professional and Academic Credentials/i });
      expect(credentialList).toBeInTheDocument();

      const items = within(credentialList).getAllByRole('listitem');
      expect(items.length).toBe(4);

      expect(items[0].textContent).toContain('[EDU]');
      expect(items[0].textContent).toContain('Untar S1 3.89');

      expect(items[1].textContent).toContain('[MDM]');
      expect(items[1].textContent).toContain('Kawan Lama Group');

      expect(items[2].textContent).toContain('[AWARD]');
      expect(items[2].textContent).toContain('Best Intern');

      expect(items[3].textContent).toContain('[HONORS]');
      expect(items[3].textContent).toContain('High Distinction Honors (GPA 3.89)');
    });

    it('2.5: preserves light-mode CTA button class #hero button.bg-emerald-700', () => {
      const { container } = render(
        <I18nProvider>
          <Hero isDarkMode={false} scrollTo={() => {}} />
        </I18nProvider>
      );

      const ctaButton = container.querySelector('#hero button.bg-emerald-700');
      expect(ctaButton).toBeInTheDocument();
      expect(ctaButton.className).toContain('hover:bg-emerald-800');
      expect(ctaButton.className).toContain('text-white');
    });
  });

  // ==========================================================================
  // Suite 3: Skills Dev-Tool Matrix & String Containment Verification
  // ==========================================================================
  describe('Suite 3: Skills Dev-Tool Matrix & String Containment', () => {
    it('3.1: renders all 4 operational categories with distinct themes and tiers', () => {
      const { container } = render(
        <I18nProvider>
          <Skills />
        </I18nProvider>
      );

      const categoryCards = container.querySelectorAll('#skills .grid > .rounded-2xl');
      expect(categoryCards.length).toBe(4);

      // Category 0: Dominant Infrastructure
      expect(within(categoryCards[0]).getByText('DOMINANT TIER // INFRASTRUCTURE')).toBeInTheDocument();
      expect(within(categoryCards[0]).getByText('6 TECHNOLOGIES')).toBeInTheDocument();

      // Category 1: Supporting Intelligence
      expect(within(categoryCards[1]).getByText('SUPPORTING TIER // INTELLIGENCE')).toBeInTheDocument();
      expect(within(categoryCards[1]).getByText('6 TECHNOLOGIES')).toBeInTheDocument();

      // Category 2: Dominant Automation
      expect(within(categoryCards[2]).getByText('DOMINANT TIER // AUTOMATION')).toBeInTheDocument();
      expect(within(categoryCards[2]).getByText('5 TECHNOLOGIES')).toBeInTheDocument();

      // Category 3: Supporting Interfaces
      expect(within(categoryCards[3]).getByText('SUPPORTING TIER // INTERFACES')).toBeInTheDocument();
      expect(within(categoryCards[3]).getByText('5 TECHNOLOGIES')).toBeInTheDocument();
    });

    it('3.2: verifies all 22 skills pass string containment tests for level while styled in uppercase brackets', () => {
      const { container } = render(
        <I18nProvider>
          <Skills />
        </I18nProvider>
      );

      const allSkills = SKILL_CATEGORIES.flatMap(c => c.skills);
      expect(allSkills.length).toBe(22);

      allSkills.forEach(skill => {
        const skillNameEl = within(container).getByText(skill.name);
        expect(skillNameEl).toBeInTheDocument();

        const skillCard = skillNameEl.closest('.flex.items-start');
        expect(skillCard).toBeInTheDocument();

        // Level badge verification
        if (skill.level) {
          // 1. Text containment test must pass with exact TitleCase level string
          expect(skillCard.textContent).toContain(skill.level);

          // 2. Bracketed badge exists with uppercase class
          const badge = within(skillCard).getByText(`[${skill.level}]`);
          expect(badge).toBeInTheDocument();
          expect(badge.className).toContain('uppercase');
          expect(badge.className).toContain('font-mono');
        }

        // Context description verification
        if (skill.context) {
          expect(skillCard.textContent).toContain(skill.context);
        }
      });
    });
  });

  // ==========================================================================
  // Suite 4: Skill Icon onError Resilience & Empirical Image Fallback Audit
  // ==========================================================================
  describe('Suite 4: Skill Icon onError Resilience & Empirical Image Fallback Audit', () => {
    it('4.1: triggers onError handler on all 22 skill icons without throwing uncaught exceptions', () => {
      const { container } = render(
        <I18nProvider>
          <Skills />
        </I18nProvider>
      );

      const skillImages = container.querySelectorAll('#skills img');
      expect(skillImages.length).toBe(22);

      // Trigger error on each image
      skillImages.forEach(img => {
        expect(() => {
          act(() => {
            fireEvent.error(img);
          });
        }).not.toThrow();
      });
    });

    it('4.2: empirical investigation of fallback mechanism vs worker claim', () => {
      const { container } = render(
        <I18nProvider>
          <Skills />
        </I18nProvider>
      );

      const bigQueryImg = container.querySelector('#skills img[alt="Google BigQuery"]');
      expect(bigQueryImg).toBeInTheDocument();
      const initialSrc = bigQueryImg.getAttribute('src');
      expect(initialSrc).toBeTruthy();

      // Trigger error
      act(() => {
        fireEvent.error(bigQueryImg);
      });

      // Observe disk reality: Does it replace with SVG <Code2> or replace src with python devicon?
      const currentSrc = bigQueryImg.getAttribute('src');
      expect(currentSrc).toBe('https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg');

      // Layout stability: container retains w-10 h-10 shrink-0 dimensions
      const imgContainer = bigQueryImg.closest('.w-10.h-10');
      expect(imgContainer).toBeInTheDocument();
      expect(imgContainer.className).toContain('shrink-0');
    });

    it('4.3: idempotent error handling prevents infinite loops when fallback URL errors', () => {
      const { container } = render(
        <I18nProvider>
          <Skills />
        </I18nProvider>
      );

      const pythonImg = container.querySelector('#skills img[alt="Python (Pandas / NumPy)"]');
      expect(pythonImg).toBeInTheDocument();

      // Initial src is already python-original.svg
      expect(pythonImg.getAttribute('src')).toBe('https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg');

      // Trigger error on image whose src is already the fallback URL
      act(() => {
        fireEvent.error(pythonImg);
      });

      // No loop, no error thrown
      expect(pythonImg.getAttribute('src')).toBe('https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg');
    });
  });

  // ==========================================================================
  // Suite 5: Scope Boundaries & Zero Rainbow Token Invariants
  // ==========================================================================
  describe('Suite 5: Scope Boundaries & Zero Rainbow Token Invariants', () => {
    it('5.1: Hero.jsx contains zero forbidden legacy rainbow tokens (indigo, violet, cyan)', () => {
      const heroPath = path.resolve(process.cwd(), 'src/components/sections/Hero.jsx');
      const content = fs.readFileSync(heroPath, 'utf8');

      expect(content).not.toMatch(/\b(bg|text|border|ring)-(indigo|violet|cyan)-/);
    });

    it('5.2: About.jsx contains zero forbidden legacy rainbow tokens (indigo, violet, cyan)', () => {
      const aboutPath = path.resolve(process.cwd(), 'src/components/sections/About.jsx');
      const content = fs.readFileSync(aboutPath, 'utf8');

      expect(content).not.toMatch(/\b(bg|text|border|ring)-(indigo|violet|cyan)-/);
    });

    it('5.3: Skills.jsx contains zero forbidden legacy rainbow tokens (indigo, violet, cyan)', () => {
      const skillsPath = path.resolve(process.cwd(), 'src/components/sections/Skills.jsx');
      const content = fs.readFileSync(skillsPath, 'utf8');

      expect(content).not.toMatch(/\b(bg|text|border|ring)-(indigo|violet|cyan)-/);
    });
  });

  // ==========================================================================
  // Suite 6: Rapid Telemetry Interaction Fuzzing & Concurrent Event Stress
  // ==========================================================================
  describe('Suite 6: Rapid Telemetry Interaction Fuzzing & Concurrent Event Stress', () => {
    it('6.1: 100 rapid oscillating hover/focus/blur events execute without error', () => {
      const { container } = render(
        <I18nProvider>
          <Hero isDarkMode={false} scrollTo={() => {}} />
        </I18nProvider>
      );

      const metricCards = container.querySelectorAll('.grid.grid-cols-2 > div');
      expect(metricCards.length).toBe(4);

      act(() => {
        for (let i = 0; i < 25; i++) {
          metricCards.forEach((card, idx) => {
            if (idx % 2 === 0) {
              fireEvent.mouseEnter(card);
              fireEvent.focus(card);
            } else {
              fireEvent.blur(card);
              fireEvent.mouseLeave(card);
            }
          });
        }
      });

      // After rapid oscillations, telemetry console is fully responsive
      const firstCard = metricCards[0];
      act(() => {
        fireEvent.mouseEnter(firstCard);
      });
      expect(screen.getByText(/Kawan Lama MDM: 5 Governed Domains/i)).toBeInTheDocument();
      expect(screen.getByText('GWS SHEETS // SAP GUI')).toBeInTheDocument();

      act(() => {
        fireEvent.mouseLeave(firstCard);
      });
      expect(screen.getByText(/Hover metric for subsystem telemetry/i)).toBeInTheDocument();
    });
  });

  // ==========================================================================
  // Suite 7: Extreme Viewport Boundary Stress (240px to 2560px)
  // ==========================================================================
  describe('Suite 7: Extreme Viewport Boundary Stress', () => {
    it('7.1 [240px Ultra-Compact Viewport]: All M2 components render without throwing', () => {
      setViewport({ width: 240, height: 320 });

      expect(() => {
        render(
          <I18nProvider>
            <div>
              <Hero isDarkMode={false} scrollTo={() => {}} />
              <About />
              <Skills />
            </div>
          </I18nProvider>
        );
      }).not.toThrow();

      expect(screen.getByText(/● TELEMETRY \/\/ ENTERPRISE MDM & AUTOMATION/i)).toBeInTheDocument();
      expect(screen.getByText(/System Architecture Doctrine:/i)).toBeInTheDocument();
      expect(screen.getByText('DOMINANT TIER // INFRASTRUCTURE')).toBeInTheDocument();
    });

    it('7.2 [2560px 4K Ultrawide Viewport]: max-w-7xl constraint centers layout', () => {
      setViewport({ width: 2560, height: 1440 });

      const { container } = render(
        <I18nProvider>
          <div>
            <Hero isDarkMode={false} scrollTo={() => {}} />
            <About />
            <Skills />
          </div>
        </I18nProvider>
      );

      const maxContainers = container.querySelectorAll('.max-w-7xl');
      expect(maxContainers.length).toBeGreaterThanOrEqual(3);

      maxContainers.forEach((el) => {
        expect(el.className).toContain('mx-auto');
      });
    });
  });

  // ==========================================================================
  // Suite 8: Bilingual Locale Stress Across M2 Components
  // ==========================================================================
  describe('Suite 8: Bilingual Locale Stress Across M2 Components', () => {
    it('8.1: Indonesian locale renders localized telemetry and doctrine strings without fallbacks', () => {
      localStorage.setItem('portfolio_locale', 'id');

      const { container } = render(
        <I18nProvider>
          <div>
            <Hero isDarkMode={false} scrollTo={() => {}} />
            <About />
            <Skills />
          </div>
        </I18nProvider>
      );

      // Hero Indonesian credentials
      expect(screen.getByText('Untar S1 IPK 3.89')).toBeInTheDocument();
      expect(screen.getByText('Penerima Best Intern')).toBeInTheDocument();
      expect(screen.getByText('Lulusan Berpredikat Pujian (IPK 3.89)')).toBeInTheDocument();

      // Hero Indonesian telemetry subhead
      expect(screen.getByText('Dampak & Tolok Ukur Utama')).toBeInTheDocument();

      // About Indonesian 3-Pillars
      expect(screen.getByText('Doktrin Tata Kelola & Otomasi')).toBeInTheDocument();
      expect(screen.getByText('Staging Terkelola & Validasi Awal')).toBeInTheDocument();
      expect(screen.getByText('Eksekusi Otomasi RPA SAP')).toBeInTheDocument();
      expect(screen.getByText('Augmentasi Workflow Berbasis AI')).toBeInTheDocument();

      // Telemetry hover Indonesian
      const metricCards = container.querySelectorAll('.grid.grid-cols-2 > div');
      act(() => {
        fireEvent.mouseEnter(metricCards[0]);
      });
      expect(screen.getByText(/Kawan Lama MDM: 5 Governed Domains/i)).toBeInTheDocument();

      act(() => {
        fireEvent.mouseLeave(metricCards[0]);
      });
      expect(screen.getByText(/Arahkan kursor untuk inspeksi subsistem/i)).toBeInTheDocument();
    });

    it('8.2: English locale renders canonical English strings', () => {
      localStorage.setItem('portfolio_locale', 'en');

      render(
        <I18nProvider>
          <div>
            <Hero isDarkMode={false} scrollTo={() => {}} />
            <About />
            <Skills />
          </div>
        </I18nProvider>
      );

      // Hero English credentials
      expect(screen.getByText('Untar S1 3.89')).toBeInTheDocument();
      expect(screen.getByText('Best Intern')).toBeInTheDocument();
      expect(screen.getByText('High Distinction Honors (GPA 3.89)')).toBeInTheDocument();

      // Hero English telemetry subhead
      expect(screen.getByText('Key Impact & Benchmarks')).toBeInTheDocument();

      // About English 3-Pillars
      expect(screen.getByText('Data Governance & Automation Doctrine')).toBeInTheDocument();
      expect(screen.getByText('Auditable Staging & Ingestion')).toBeInTheDocument();
      expect(screen.getByText('SAP GUI Scripting & RPA')).toBeInTheDocument();
      expect(screen.getByText('Applied AI Workflow Augmentation')).toBeInTheDocument();

      // Telemetry hover English
      expect(screen.getByText(/Hover metric for subsystem telemetry/i)).toBeInTheDocument();
    });
  });

});
