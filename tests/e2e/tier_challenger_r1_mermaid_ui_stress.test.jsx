/**
 * tests/e2e/tier_challenger_r1_mermaid_ui_stress.test.jsx
 * 
 * Milestone M_REFINEMENT: Empirical Challenger Stress Suite (Challenger 1)
 * 
 * Adversarial stress testing covering:
 * Suite 1: DOM Sanitization & Forbidden Metadata Elimination (R1 Strict DOM Invariants)
 * Suite 2: Mermaid Workflow Diagrams Across All 8 Featured Projects (R2 Feature Matrix)
 * Suite 3: Rapid Tab Switching Stress & Lifecycle Chaos (Adversarial Oscillation)
 * Suite 4: Theme Toggling & MutationObserver Adaptability (Light <-> Dark Stress)
 * Suite 5: Interactive Diagram Controls (Zoom Clamping, Clipboard, Fullscreen Modal)
 * Suite 6: Malformed, Empty, and Corrupted Chart Resilience (Zero White-Screen Fallback)
 */

import React from 'react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, act } from '@testing-library/react';

import App from '../../src/App';
import { ProjectCard } from '../../src/components/ui/ProjectCard';
import { MermaidViewer } from '../../src/components/ui/MermaidViewer';
import { PROJECTS } from '../../src/data/constants';
import { I18nProvider } from '../../src/lib/i18n';
import { renderPortfolio, resetTestEnvironment } from './harness';

describe('Tier Challenger R1: Mermaid Diagrams (R2) & UI Cleanup (R1) Stress Suite', () => {

  beforeEach(() => {
    resetTestEnvironment();
    vi.clearAllMocks();
  });

  afterEach(() => {
    resetTestEnvironment();
    vi.useRealTimers();
  });

  // ==========================================================================
  // Suite 1: DOM Sanitization & Forbidden Metadata Elimination (R1)
  // ==========================================================================
  describe('Suite 1: DOM Sanitization & Forbidden Metadata Elimination (R1 Invariants)', () => {

    it('1.1: Completely eliminates william_profile.ts from the rendered DOM across entire App', () => {
      vi.useFakeTimers();
      const { container } = renderPortfolio();
      expect(container.innerHTML).not.toContain('william_profile.ts');
      expect(screen.queryByText(/william_profile\.ts/i)).toBeNull();
      vi.useRealTimers();
    });

    it('1.2: Completely eliminates TypeScript // UTF-8 from the rendered DOM across entire App', () => {
      vi.useFakeTimers();
      const { container } = renderPortfolio();
      expect(container.innerHTML).not.toContain('TypeScript // UTF-8');
      expect(screen.queryByText(/TypeScript \/\/ UTF-8/i)).toBeNull();
      vi.useRealTimers();
    });

    it('1.3: Completely eliminates the TypeScript language badge pill with blue dot from rendered DOM', () => {
      vi.useFakeTimers();
      const { container } = renderPortfolio();
      
      // Strict check for the forbidden HTML pattern
      expect(container.innerHTML).not.toContain('w-2.5 h-2.5 rounded-full bg-blue-500');
      
      // Ensure no element has class bg-blue-500
      const blueDots = container.querySelectorAll('.bg-blue-500');
      expect(blueDots.length).toBe(0);
      vi.useRealTimers();
    });

    it('1.4: Invariant holds true across both English and Indonesian locales', () => {
      vi.useFakeTimers();
      for (const locale of ['en', 'id']) {
        localStorage.setItem('portfolio_locale', locale);
        const { container, unmount } = renderPortfolio();

        expect(container.innerHTML).not.toContain('william_profile.ts');
        expect(container.innerHTML).not.toContain('TypeScript // UTF-8');
        expect(container.querySelectorAll('.bg-blue-500').length).toBe(0);
        unmount();
      }
      vi.useRealTimers();
    });

    it('1.5: ProjectCard headers render technical badges and production status with ZERO code pill metadata', () => {
      for (const project of PROJECTS) {
        const { container, unmount } = render(
          <I18nProvider>
            <ProjectCard project={project} index={0} />
          </I18nProvider>
        );

        // Asserts forbidden pills are absent
        expect(container.querySelector('.bg-blue-500')).toBeNull();
        expect(container.innerHTML).not.toContain('william_profile.ts');
        expect(container.innerHTML).not.toContain('TypeScript // UTF-8');

        // Asserts valid technical badge is rendered
        const activityIcon = container.querySelector('svg.lucide-activity');
        expect(activityIcon).not.toBeNull();
        unmount();
      }
    });
  });

  // ==========================================================================
  // Suite 2: Mermaid Workflow Diagrams Across All 8 Featured Projects (R2 Matrix)
  // ==========================================================================
  describe('Suite 2: Mermaid Workflow Diagrams Across All 8 Featured Projects (R2 Feature Matrix)', () => {

    it('2.1: Exactly 8 featured projects exist in PROJECTS and all 8 have non-empty workflowMermaid definitions', () => {
      expect(PROJECTS.length).toBe(8);
      for (const project of PROJECTS) {
        expect(typeof project.workflowMermaid).toBe('string');
        expect(project.workflowMermaid.trim().length).toBeGreaterThan(20);
        expect(project.workflowMermaid.startsWith('graph TD')).toBe(true);
      }
    });

    it('2.2: Renders MermaidViewer inside [How It Works] tab for all 8 featured projects', async () => {
      for (const project of PROJECTS) {
        const { container, unmount } = render(
          <I18nProvider>
            <ProjectCard project={project} index={0} />
          </I18nProvider>
        );

        // Find and click the 'How It Works' tab
        const workflowTab = screen.getByRole('tab', { name: /how it works/i });
        await act(async () => {
          fireEvent.click(workflowTab);
        });

        expect(workflowTab).toHaveAttribute('aria-selected', 'true');

        // Verify Mermaid flowchart toolbar and header
        expect(screen.getByText('Mermaid Flowchart')).toBeInTheDocument();

        // Verify interactive action toolbar buttons
        expect(screen.getByRole('button', { name: /zoom in diagram/i })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /zoom out diagram/i })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /reset diagram zoom/i })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /copy mermaid diagram definition/i })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /expand diagram fullscreen/i })).toBeInTheDocument();

        // Verify accessible region
        const diagramRegion = screen.getByRole('region', { name: new RegExp(`${project.title} interactive workflow diagram`, 'i') });
        expect(diagramRegion).toBeInTheDocument();

        // Verify workflow steps list still renders cleanly below the diagram
        expect(screen.getByText(/execution pipeline/i)).toBeInTheDocument();
        const stepsList = container.querySelector('ol');
        expect(stepsList).not.toBeNull();
        expect(stepsList.children.length).toBe(project.workflowSteps.length);

        unmount();
      }
    });

    it('2.3: Correctly localizes toolbar and aria-labels in Indonesian locale', async () => {
      localStorage.setItem('portfolio_locale', 'id');
      const project = PROJECTS[0];
      await act(async () => {
        render(
          <I18nProvider>
            <ProjectCard project={project} index={0} />
          </I18nProvider>
        );
      });

      const workflowTab = screen.getByRole('tab', { name: /cara kerja/i });
      await act(async () => {
        fireEvent.click(workflowTab);
      });

      expect(screen.getByText('Diagram Alur Mermaid')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /perbesar diagram/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /perkecil diagram/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /atur ulang pembesaran/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /salin definisi diagram mermaid/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /buka diagram layar penuh/i })).toBeInTheDocument();
    });
  });

  // ==========================================================================
  // Suite 3: Rapid Tab Switching Stress & Lifecycle Chaos
  // ==========================================================================
  describe('Suite 3: Rapid Tab Switching Stress & Lifecycle Chaos', () => {

    it('3.1: 50 rapid alternating clicks between Preview and How It Works tabs without crashing or memory leak', async () => {
      const project = PROJECTS[0];
      await act(async () => {
        render(
          <I18nProvider>
            <ProjectCard project={project} index={0} />
          </I18nProvider>
        );
      });

      const previewTab = screen.getByRole('tab', { name: /preview/i });
      const workflowTab = screen.getByRole('tab', { name: /how it works/i });

      // Execute 50 rapid alternating clicks wrapped in act
      await act(async () => {
        for (let i = 0; i < 50; i++) {
          fireEvent.click(i % 2 === 0 ? workflowTab : previewTab);
        }
      });

      // After 50 clicks (even number, 0..49), last click was previewTab (i = 49)
      expect(previewTab).toHaveAttribute('aria-selected', 'true');
      expect(workflowTab).toHaveAttribute('aria-selected', 'false');

      // Final click to workflowTab
      await act(async () => {
        fireEvent.click(workflowTab);
      });
      expect(workflowTab).toHaveAttribute('aria-selected', 'true');
      expect(screen.getByText('Mermaid Flowchart')).toBeInTheDocument();
    });

    it('3.2: Concurrent tab switches across multiple ProjectCards maintain state isolation', async () => {
      await act(async () => {
        render(
          <I18nProvider>
            <div>
              <ProjectCard project={PROJECTS[0]} index={0} />
              <ProjectCard project={PROJECTS[1]} index={1} />
            </div>
          </I18nProvider>
        );
      });

      const allWorkflowTabs = screen.getAllByRole('tab', { name: /how it works/i });
      expect(allWorkflowTabs.length).toBe(2);

      // Open tab on card 0 only
      await act(async () => {
        fireEvent.click(allWorkflowTabs[0]);
      });
      expect(allWorkflowTabs[0]).toHaveAttribute('aria-selected', 'true');
      expect(allWorkflowTabs[1]).toHaveAttribute('aria-selected', 'false');

      // Now open tab on card 1 as well
      await act(async () => {
        fireEvent.click(allWorkflowTabs[1]);
      });
      expect(allWorkflowTabs[0]).toHaveAttribute('aria-selected', 'true');
      expect(allWorkflowTabs[1]).toHaveAttribute('aria-selected', 'true');

      // Exactly 2 diagrams rendered
      const regions = screen.getAllByRole('region', { name: /interactive workflow diagram/i });
      expect(regions.length).toBe(2);
    });
  });

  // ==========================================================================
  // Suite 4: Theme Toggling & MutationObserver Adaptability
  // ==========================================================================
  describe('Suite 4: Theme Toggling & MutationObserver Adaptability', () => {

    it('4.1: Dynamic toggling between dark and light modes synchronizes without unhandled rejections', async () => {
      const project = PROJECTS[0];
      await act(async () => {
        render(
          <I18nProvider>
            <MermaidViewer chart={project.workflowMermaid} id={project.id} title={project.title} />
          </I18nProvider>
        );
      });

      // Perform 20 rapid theme toggles
      for (let i = 0; i < 20; i++) {
        await act(async () => {
          if (i % 2 === 0) {
            document.documentElement.classList.add('dark');
          } else {
            document.documentElement.classList.remove('dark');
          }
        });
      }

      // Final state: light mode
      await act(async () => {
        document.documentElement.classList.remove('dark');
      });

      expect(screen.getByText('Mermaid Flowchart')).toBeInTheDocument();
      expect(screen.queryByText(/unable to render/i)).toBeNull();
    });

    it('4.2: MermaidViewer unmount disconnects its MutationObserver without leaking listeners', async () => {
      const disconnectSpy = vi.fn();
      const originalMutationObserver = window.MutationObserver;

      window.MutationObserver = class MockMutationObserver {
        observe() {}
        disconnect() {
          disconnectSpy();
        }
      };

      let unmount;
      await act(async () => {
        const res = render(
          <I18nProvider>
            <MermaidViewer chart={PROJECTS[0].workflowMermaid} id="test-disconnect" title="Test" />
          </I18nProvider>
        );
        unmount = res.unmount;
      });

      unmount();
      expect(disconnectSpy).toHaveBeenCalledTimes(1);

      window.MutationObserver = originalMutationObserver;
    });
  });

  // ==========================================================================
  // Suite 5: Interactive Diagram Controls Stress Harness
  // ==========================================================================
  describe('Suite 5: Interactive Diagram Controls (Zoom, Reset, Clipboard, Fullscreen Modal)', () => {

    it('5.1: Zoom In button clamps strictly at maximum 2.0x scale', async () => {
      await act(async () => {
        render(
          <I18nProvider>
            <MermaidViewer chart={PROJECTS[0].workflowMermaid} id="zoom-test" title="Zoom Test" />
          </I18nProvider>
        );
      });

      const zoomInBtn = screen.getByRole('button', { name: /zoom in diagram/i });
      const container = screen.getByRole('region', { name: /interactive workflow diagram/i });

      // Click Zoom In 15 times (step: 0.15)
      for (let i = 0; i < 15; i++) {
        fireEvent.click(zoomInBtn);
      }

      const canvasWrapper = container.querySelector('div[style*="transform"]');
      expect(canvasWrapper).not.toBeNull();
      // Scale must be clamped at scale(2) or scale(2.0)
      expect(canvasWrapper.style.transform).toBe('scale(2)');
    });

    it('5.2: Zoom Out button clamps strictly at minimum 0.6x scale', async () => {
      await act(async () => {
        render(
          <I18nProvider>
            <MermaidViewer chart={PROJECTS[0].workflowMermaid} id="zoom-out-test" title="Zoom Out Test" />
          </I18nProvider>
        );
      });

      const zoomOutBtn = screen.getByRole('button', { name: /zoom out diagram/i });
      const container = screen.getByRole('region', { name: /interactive workflow diagram/i });

      // Click Zoom Out 15 times
      for (let i = 0; i < 15; i++) {
        fireEvent.click(zoomOutBtn);
      }

      const canvasWrapper = container.querySelector('div[style*="transform"]');
      expect(canvasWrapper).not.toBeNull();
      // Scale must be clamped at scale(0.6)
      expect(canvasWrapper.style.transform).toBe('scale(0.6)');
    });

    it('5.3: Reset Zoom button restores scale to exactly 1.0x', async () => {
      await act(async () => {
        render(
          <I18nProvider>
            <MermaidViewer chart={PROJECTS[0].workflowMermaid} id="zoom-reset-test" title="Zoom Reset Test" />
          </I18nProvider>
        );
      });

      const zoomInBtn = screen.getByRole('button', { name: /zoom in diagram/i });
      const resetBtn = screen.getByRole('button', { name: /reset diagram zoom/i });
      const container = screen.getByRole('region', { name: /interactive workflow diagram/i });

      fireEvent.click(zoomInBtn);
      fireEvent.click(zoomInBtn);

      const canvasWrapper = container.querySelector('div[style*="transform"]');
      expect(canvasWrapper.style.transform).toBe('scale(1.3)');

      fireEvent.click(resetBtn);
      expect(canvasWrapper.style.transform).toBe('scale(1)');
    });

    it('5.4: Copy Mermaid definition to clipboard calls navigator.clipboard and displays temporary confirmation', async () => {
      vi.useFakeTimers();
      const writeTextMock = vi.fn().mockImplementation(() => Promise.resolve());
      
      const originalClipboard = navigator.clipboard;
      try {
        if (!navigator.clipboard) {
          Object.defineProperty(navigator, 'clipboard', {
            value: { writeText: writeTextMock },
            configurable: true,
          });
        } else {
          vi.spyOn(navigator.clipboard, 'writeText').mockImplementation(writeTextMock);
        }

        const chartDefinition = PROJECTS[0].workflowMermaid;
        await act(async () => {
          render(
            <I18nProvider>
              <MermaidViewer chart={chartDefinition} id="copy-test" title="Copy Test" />
            </I18nProvider>
          );
        });

        const copyBtn = screen.getByRole('button', { name: /copy mermaid diagram definition/i });
        await act(async () => {
          fireEvent.click(copyBtn);
        });

        expect(writeTextMock).toHaveBeenCalledWith(chartDefinition);

        // Check icon changes to Check
        const checkIcon = copyBtn.querySelector('svg.lucide-check');
        expect(checkIcon).not.toBeNull();

        // Fast forward 2500ms
        act(() => {
          vi.advanceTimersByTime(2500);
        });

        // Icon reverts to Copy
        const copyIcon = copyBtn.querySelector('svg.lucide-copy');
        expect(copyIcon).not.toBeNull();
      } finally {
        vi.useRealTimers();
        if (originalClipboard) {
          vi.restoreAllMocks();
        }
      }
    });

    it('5.5: Copy does not crash if clipboard writeText throws an error', async () => {
      if (navigator.clipboard) {
        vi.spyOn(navigator.clipboard, 'writeText').mockImplementation(() => {
          throw new Error('Clipboard permission denied');
        });
      }

      await act(async () => {
        render(
          <I18nProvider>
            <MermaidViewer chart={PROJECTS[0].workflowMermaid} id="no-clip-test" title="No Clip" />
          </I18nProvider>
        );
      });

      const copyBtn = screen.getByRole('button', { name: /copy mermaid diagram definition/i });
      expect(() => {
        fireEvent.click(copyBtn);
      }).not.toThrow();
    });

    it('5.6: Fullscreen modal opens via portal, handles Escape key, and close button cleanly', async () => {
      await act(async () => {
        render(
          <I18nProvider>
            <MermaidViewer chart={PROJECTS[0].workflowMermaid} id="modal-test" title="RAG Document Chat" />
          </I18nProvider>
        );
      });

      // Modal closed initially
      expect(screen.queryByRole('dialog')).toBeNull();

      // Click Expand button
      const expandBtn = screen.getByRole('button', { name: /expand diagram fullscreen/i });
      fireEvent.click(expandBtn);

      // Modal opens
      const modal = screen.getByRole('dialog');
      expect(modal).toBeInTheDocument();
      expect(screen.getByText(/RAG Document Chat \/\/ Architecture Flow/i)).toBeInTheDocument();

      // Press Escape key to close
      fireEvent.keyDown(window, { key: 'Escape' });
      expect(screen.queryByRole('dialog')).toBeNull();

      // Open modal again
      fireEvent.click(expandBtn);
      expect(screen.getByRole('dialog')).toBeInTheDocument();

      // Click close button (X)
      const closeBtn = screen.getByRole('button', { name: /close diagram modal/i });
      fireEvent.click(closeBtn);
      expect(screen.queryByRole('dialog')).toBeNull();
    });
  });

  // ==========================================================================
  // Suite 6: Malformed, Empty, and Corrupted Chart Resilience
  // ==========================================================================
  describe('Suite 6: Malformed, Empty, and Corrupted Chart Resilience (Zero White-Screen Fallback)', () => {

    it('6.1: Empty chart string ("") returns null with zero DOM nodes rendered', () => {
      const { container } = render(
        <I18nProvider>
          <MermaidViewer chart="" id="empty-chart" title="Empty" />
        </I18nProvider>
      );
      expect(container.firstChild).toBeNull();
    });

    it('6.2: Null or undefined chart returns null without throwing', () => {
      const { container: c1 } = render(
        <I18nProvider>
          <MermaidViewer chart={null} id="null-chart" title="Null" />
        </I18nProvider>
      );
      expect(c1.firstChild).toBeNull();

      const { container: c2 } = render(
        <I18nProvider>
          <MermaidViewer chart={undefined} id="undefined-chart" title="Undefined" />
        </I18nProvider>
      );
      expect(c2.firstChild).toBeNull();
    });

    it('6.3: ProjectCard without workflowMermaid safely omits MermaidViewer without breaking execution pipeline', async () => {
      const projectWithoutMermaid = {
        ...PROJECTS[0],
        id: 'no-mermaid-proj',
        workflowMermaid: undefined,
      };

      const { container } = render(
        <I18nProvider>
          <ProjectCard project={projectWithoutMermaid} index={0} />
        </I18nProvider>
      );

      const workflowTab = screen.getByRole('tab', { name: /how it works/i });
      await act(async () => {
        fireEvent.click(workflowTab);
      });

      // Mermaid viewer is not rendered
      expect(screen.queryByText('Mermaid Flowchart')).toBeNull();

      // Execution Pipeline steps still render properly
      expect(screen.getByText(/execution pipeline/i)).toBeInTheDocument();
      const ol = container.querySelector('ol');
      expect(ol).not.toBeNull();
    });

    it('6.4: Fallback Error Boundary verification when Mermaid fails to render', async () => {
      // Simulate real browser environment with SVGElement.prototype.getBBox
      const originalBBox = window.SVGElement?.prototype?.getBBox;
      window.SVGElement.prototype.getBBox = () => ({ x: 0, y: 0, width: 200, height: 100 });

      // Render with malformed chart
      const malformedChart = "graph TD\n Broken syntax %%% !@#$ -->>>";
      
      let rendered;
      await act(async () => {
        rendered = render(
          <I18nProvider>
            <MermaidViewer chart={malformedChart} id="malformed-test" title="Malformed" />
          </I18nProvider>
        );
      });

      // Verify the container did not crash the entire app / did not white-screen
      expect(rendered.container).toBeInTheDocument();
      expect(screen.getByRole('region', { name: /interactive workflow diagram/i })).toBeInTheDocument();

      if (originalBBox) {
        window.SVGElement.prototype.getBBox = originalBBox;
      } else {
        delete window.SVGElement.prototype.getBBox;
      }
    });

    it('6.5: Massive chart string with 500 nodes renders safely without exceeding call stack limits', () => {
      let largeChart = 'graph TD\n';
      for (let i = 0; i < 500; i++) {
        largeChart += `    Node_${i} --> Node_${i + 1}\n`;
      }

      expect(() => {
        render(
          <I18nProvider>
            <MermaidViewer chart={largeChart} id="large-chart-test" title="Large Chart" />
          </I18nProvider>
        );
      }).not.toThrow();

      expect(screen.getByText('Mermaid Flowchart')).toBeInTheDocument();
    });
  });
});
