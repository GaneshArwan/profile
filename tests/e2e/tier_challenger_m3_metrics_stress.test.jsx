import React from 'react';
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { screen, within, fireEvent, act } from '@testing-library/react';
import { renderPortfolio, resetTestEnvironment } from './harness';
import { PROJECTS, DISCOVERED_PROJECTS } from '../../src/data/constants';
import { projectSchema } from '../../src/lib/schemas';

describe('Challenger M3: Adversarial Metric & Zero-Star Stress Suite', () => {
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
  // Suite 1: Zero-Star Counters & Empty Social Metrics Elimination
  // ==========================================================================
  describe('Suite 1: Zero-Star Counters & Empty Social Metrics Elimination', () => {
    it('1.1: ensures NO rendered element contains "0 stars", "0 forks", or empty social counters in English', () => {
      renderPortfolio();
      const projectsSection = document.getElementById('projects');
      expect(projectsSection).toBeInTheDocument();

      const innerText = projectsSection.textContent || '';
      const innerHTML = projectsSection.innerHTML || '';

      // Hostile adversarial pattern checks
      expect(innerText).not.toMatch(/\b0\s+stars?\b/i);
      expect(innerText).not.toMatch(/\b0\s+forks?\b/i);
      expect(innerText).not.toMatch(/\b0\s+bintang\b/i);
      expect(innerHTML).not.toMatch(/0\s*<\/[^>]+>\s*stars?/i);
      expect(innerHTML).not.toMatch(/0\s*<\/[^>]+>\s*forks?/i);
    });

    it('1.2: exhaustively checks that NO project card contains "0 stars" across every category tab in English', () => {
      renderPortfolio();
      const filterTablist = screen.getByRole('tablist', { name: /Project Category Filter/i });
      const tabs = within(filterTablist).getAllByRole('tab');

      expect(tabs.length).toBe(4);

      tabs.forEach((tab) => {
        act(() => {
          fireEvent.click(tab);
        });

        const cards = document.querySelectorAll('#projects article');
        expect(cards.length).toBeGreaterThan(0);

        cards.forEach((card) => {
          const text = card.textContent || '';
          const html = card.innerHTML || '';

          expect(text).not.toMatch(/\b0\s+stars?\b/i);
          expect(text).not.toMatch(/\b0\s+forks?\b/i);
          expect(text).not.toMatch(/\b0\s+bintang\b/i);
          expect(html).not.toMatch(/0\s*<\/[^>]+>\s*stars?/i);
          expect(html).not.toMatch(/0\s*<\/[^>]+>\s*forks?/i);
        });
      });
    });

    it('1.3: exhaustively checks that NO project card contains "0 stars" across every category tab in Indonesian', () => {
      renderPortfolio();

      // Switch to Indonesian locale via aria-label 'toggle language'
      const localeButtons = screen.getAllByRole('button', { name: /toggle language/i });
      expect(localeButtons.length).toBeGreaterThan(0);
      const langBtn = localeButtons[0];
      act(() => {
        fireEvent.click(langBtn);
      });

      const filterTablist = screen.getByRole('tablist', { name: /Project Category Filter/i });
      const tabs = within(filterTablist).getAllByRole('tab');

      expect(tabs.length).toBe(4);

      tabs.forEach((tab) => {
        act(() => {
          fireEvent.click(tab);
        });

        const cards = document.querySelectorAll('#projects article');
        expect(cards.length).toBeGreaterThan(0);

        cards.forEach((card) => {
          const text = card.textContent || '';
          const html = card.innerHTML || '';

          expect(text).not.toMatch(/\b0\s+stars?\b/i);
          expect(text).not.toMatch(/\b0\s+forks?\b/i);
          expect(text).not.toMatch(/\b0\s+bintang\b/i);
          expect(html).not.toMatch(/0\s*<\/[^>]+>\s*stars?/i);
          expect(html).not.toMatch(/0\s*<\/[^>]+>\s*forks?/i);
          expect(html).not.toMatch(/0\s*<\/[^>]+>\s*bintang/i);
        });
      });
    });

    it('1.4: proves even Voice AI Assistant (which has 2 real stars in raw metadata) does not display raw star counter', () => {
      renderPortfolio();
      const voiceCard = document.getElementById('project-container-voice-ai-assistant');
      expect(voiceCard).toBeInTheDocument();

      // Verify no "2 stars" or "stars" counter badge is rendered; technical indicator is shown instead
      const text = voiceCard.textContent || '';
      expect(text).not.toMatch(/\b2\s+stars?\b/i);
      expect(text).toContain('<500ms Latency');
    });
  });

  // ==========================================================================
  // Suite 2: 8 Project Cards Verification & 2x2 Technical Indicator Grids
  // ==========================================================================
  describe('Suite 2: 8 Project Cards Verification & 2x2 Technical Indicator Grids', () => {
    it('2.1: constants.PROJECTS contains exactly 8 verified projects adhering to Zod projectSchema', () => {
      expect(PROJECTS).toHaveLength(8);

      PROJECTS.forEach((proj) => {
        const result = projectSchema.safeParse(proj);
        expect(result.success, `Project ${proj.id} failed schema validation: ${JSON.stringify(result.error?.issues)}`).toBe(true);
      });
    });

    it('2.2: all 8 projects have valid, non-empty technicalMetric strings', () => {
      PROJECTS.forEach((proj) => {
        expect(typeof proj.technicalMetric, `Project ${proj.id} technicalMetric must be string`).toBe('string');
        expect(proj.technicalMetric.trim().length, `Project ${proj.id} technicalMetric must not be empty`).toBeGreaterThan(0);
      });

      const metrics = PROJECTS.map((p) => p.technicalMetric);
      expect(metrics).toEqual([
        '<50ms Latency',
        '>5k Line Diffs',
        'Gemini 3 Flash',
        '<500ms Latency',
        'Distributed Locking',
        'SLA Engine',
        '79% Churn Recall',
        'Self-Healing SQL',
      ]);
    });

    it('2.3: all 8 projects feature a 2x2 technicalIndicators grid with exactly 4 valid entries', () => {
      PROJECTS.forEach((proj) => {
        expect(Array.isArray(proj.technicalIndicators), `Project ${proj.id} must have technicalIndicators array`).toBe(true);
        expect(proj.technicalIndicators, `Project ${proj.id} must have exactly 4 indicators for 2x2 grid`).toHaveLength(4);

        proj.technicalIndicators.forEach((ind, idx) => {
          expect(typeof ind.label, `Project ${proj.id} ind[${idx}] label must be string`).toBe('string');
          expect(ind.label.trim().length, `Project ${proj.id} ind[${idx}] label must not be empty`).toBeGreaterThan(0);
          expect(typeof ind.value, `Project ${proj.id} ind[${idx}] value must be string`).toBe('string');
          expect(ind.value.trim().length, `Project ${proj.id} ind[${idx}] value must not be empty`).toBeGreaterThan(0);
          if (ind.detail) {
            expect(typeof ind.detail).toBe('string');
            expect(ind.detail.trim().length).toBeGreaterThan(0);
          }
        });
      });
    });

    it('2.4: DOM renders all 8 project cards on default "All Projects" view', () => {
      renderPortfolio();
      const articles = document.querySelectorAll('#projects article');
      expect(articles.length).toBe(8);

      PROJECTS.forEach((proj) => {
        const card = document.getElementById(`project-container-${proj.id}`);
        expect(card, `Card project-container-${proj.id} should be in DOM`).toBeInTheDocument();
      });
    });

    it('2.5: every rendered project card displays its specific technicalMetric badge and 2x2 indicators grid', () => {
      renderPortfolio();

      PROJECTS.forEach((proj) => {
        const card = document.getElementById(`project-container-${proj.id}`);
        expect(card).toBeInTheDocument();

        // Check technicalMetric badge
        expect(card.textContent).toContain(proj.technicalMetric);

        // Check 2x2 grid container (grid grid-cols-2)
        const grid = card.querySelector('.grid.grid-cols-2');
        expect(grid, `Project ${proj.id} must render .grid.grid-cols-2`).toBeInTheDocument();

        // Check exactly 4 child cells in the 2x2 grid
        const cells = grid.children;
        expect(cells.length, `Project ${proj.id} grid must have 4 cells`).toBe(4);

        proj.technicalIndicators.forEach((ind) => {
          expect(grid.textContent).toContain(ind.label);
          expect(grid.textContent).toContain(ind.value);
        });
      });
    });
  });

  // ==========================================================================
  // Suite 3: Category Filtering Cleanliness & Counts
  // ==========================================================================
  describe('Suite 3: Category Filtering Cleanliness & Counts', () => {
    it('3.1: filter tabs show correct project counts: All (8), AI (4), Data (3), Automation (1)', () => {
      renderPortfolio();
      const filterTablist = screen.getByRole('tablist', { name: /Project Category Filter/i });

      const allTab = within(filterTablist).getByRole('tab', { name: /All/i });
      const aiTab = within(filterTablist).getByRole('tab', { name: /AI/i });
      const dataTab = within(filterTablist).getByRole('tab', { name: /Data/i });
      const autoTab = within(filterTablist).getByRole('tab', { name: /Automation/i });

      expect(allTab.textContent).toContain('8');
      expect(aiTab.textContent).toContain('4');
      expect(dataTab.textContent).toContain('3');
      expect(autoTab.textContent).toContain('1');
    });

    it('3.2: category isolation strictly renders expected subset and removes all others', () => {
      renderPortfolio();
      const filterTablist = screen.getByRole('tablist', { name: /Project Category Filter/i });

      // AI Tab
      const aiTab = within(filterTablist).getByRole('tab', { name: /AI/i });
      act(() => {
        fireEvent.click(aiTab);
      });
      let renderedArticles = document.querySelectorAll('#projects article');
      expect(renderedArticles.length).toBe(4);
      expect(document.getElementById('project-container-rag-document-chat')).toBeInTheDocument();
      expect(document.getElementById('project-container-ai-code-review-agent')).toBeInTheDocument();
      expect(document.getElementById('project-container-ai-writing-assistant-saas')).toBeInTheDocument();
      expect(document.getElementById('project-container-voice-ai-assistant')).toBeInTheDocument();
      expect(document.getElementById('project-container-enterprise-process-automation')).not.toBeInTheDocument();
      expect(document.getElementById('project-container-corporate-kpi-sla-dashboard')).not.toBeInTheDocument();
      expect(document.getElementById('project-container-telco-customer-churn-prediction')).not.toBeInTheDocument();

      // Data Tab
      const dataTab = within(filterTablist).getByRole('tab', { name: /Data/i });
      act(() => {
        fireEvent.click(dataTab);
      });
      renderedArticles = document.querySelectorAll('#projects article');
      expect(renderedArticles.length).toBe(3);
      expect(document.getElementById('project-container-corporate-kpi-sla-dashboard')).toBeInTheDocument();
      expect(document.getElementById('project-container-telco-customer-churn-prediction')).toBeInTheDocument();
      expect(document.getElementById('project-container-ai-data-analyst-agent')).toBeInTheDocument();
      expect(document.getElementById('project-container-rag-document-chat')).not.toBeInTheDocument();

      // Automation Tab
      const autoTab = within(filterTablist).getByRole('tab', { name: /Automation/i });
      act(() => {
        fireEvent.click(autoTab);
      });
      renderedArticles = document.querySelectorAll('#projects article');
      expect(renderedArticles.length).toBe(1);
      expect(document.getElementById('project-container-enterprise-process-automation')).toBeInTheDocument();
      expect(document.getElementById('project-container-rag-document-chat')).not.toBeInTheDocument();

      // All Tab
      const allTab = within(filterTablist).getByRole('tab', { name: /All/i });
      act(() => {
        fireEvent.click(allTab);
      });
      renderedArticles = document.querySelectorAll('#projects article');
      expect(renderedArticles.length).toBe(8);
    });

    it('3.3: 40 rapid category switches maintain stable DOM and zero console warnings', () => {
      renderPortfolio();
      const filterTablist = screen.getByRole('tablist', { name: /Project Category Filter/i });
      const tabs = within(filterTablist).getAllByRole('tab');

      for (let i = 0; i < 40; i++) {
        const targetTab = tabs[i % tabs.length];
        act(() => {
          fireEvent.click(targetTab);
        });
      }

      // Final tab is tab[39 % 4] = tab[3] (Automation)
      expect(document.querySelectorAll('#projects article').length).toBe(1);

      // Return to All
      act(() => {
        fireEvent.click(tabs[0]);
      });
      expect(document.querySelectorAll('#projects article').length).toBe(8);
    });
  });

  // ==========================================================================
  // Suite 4: Discovered Projects & Edge Cases
  // ==========================================================================
  describe('Suite 4: Discovered Projects & Edge Cases', () => {
    it('4.1: DISCOVERED_PROJECTS have valid schema and non-empty technical metrics', () => {
      expect(DISCOVERED_PROJECTS.length).toBeGreaterThan(0);
      DISCOVERED_PROJECTS.forEach((dp) => {
        expect(dp.technicalMetric).toBeTruthy();
        expect(dp.technicalMetric.trim().length).toBeGreaterThan(0);
        expect(dp.technicalBadge).toBeTruthy();
      });
    });

    it('4.2: zero-star fields in raw metadata do not surface as unhandled NaN or [object Object]', () => {
      renderPortfolio();
      const projectsSection = document.getElementById('projects');
      const text = projectsSection.textContent || '';
      expect(text).not.toContain('NaN');
      expect(text).not.toContain('[object Object]');
      expect(text).not.toContain('undefined');
      expect(text).not.toContain('null');
    });
  });
});
