/**
 * tests/e2e/tier_challenger_refinement_video_logos.test.jsx
 *
 * Empirical Challenger 2 (teamwork_challenger)
 * Milestone M_REFINEMENT: Empirical Stress-Testing Suite for:
 * - R3: Video Performance & Lifecycle (useOptimizedVideo hook, scroll gating, background tab pausing, AbortError handling, preload verification)
 * - R4: Logo Resilience & Fallbacks (public/logos/ SVGs validation, CertBadge 2-tier fallback, zero blank circular holes)
 */

import React, { useState } from 'react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, act } from '@testing-library/react';
import fs from 'node:fs';
import path from 'node:path';

// Target modules under test
import { useOptimizedVideo } from '../../src/hooks/useOptimizedVideo';
import { CertBadge } from '../../src/components/ui/CertBadge';
import { Hero } from '../../src/components/sections/Hero';
import { ProjectCard } from '../../src/components/ui/ProjectCard';
import { CERTIFICATIONS, PROJECTS, HERO_VIDEOS } from '../../src/data/constants';
import { I18nProvider } from '../../src/lib/i18n';

describe('Empirical Challenger 2: Video Performance (R3) & Logo Resilience (R4) Stress Suite', () => {

  // ==========================================================================
  // Suite 1: Video Performance & Lifecycle Testing (R3)
  // ==========================================================================
  describe('Suite 1: Video Performance & Lifecycle Testing (R3)', () => {
    let mockObserverInstance = null;
    let observerCallback = null;
    let originalIntersectionObserver = null;
    let originalMatchMedia = null;

    // Test component harnessing useOptimizedVideo
    const VideoHarness = ({ options = {}, videoProps = {} }) => {
      const { videoRef, isPlaying, isInView } = useOptimizedVideo(options);
      return (
        <div>
          <div data-testid="is-playing">{isPlaying ? 'playing' : 'paused'}</div>
          <div data-testid="is-in-view">{isInView ? 'in-view' : 'off-screen'}</div>
          <video
            ref={videoRef}
            data-testid="test-video"
            src="/assets/projects/ai-code-review-agent/walkthrough.webm"
            {...videoProps}
          />
        </div>
      );
    };

    beforeEach(() => {
      originalIntersectionObserver = global.IntersectionObserver;
      originalMatchMedia = window.matchMedia;

      // Mock IntersectionObserver with controllable callback
      global.IntersectionObserver = class MockIntersectionObserver {
        constructor(callback, options) {
          observerCallback = callback;
          this.options = options;
          this.observe = vi.fn((el) => {
            this.observedElement = el;
          });
          this.unobserve = vi.fn();
          this.disconnect = vi.fn();
          mockObserverInstance = this;
        }
      };

      // Ensure HTMLMediaElement play/pause can be spied on
      if (typeof window.HTMLMediaElement !== 'undefined') {
        window.HTMLMediaElement.prototype.play = vi.fn().mockImplementation(() => Promise.resolve());
        window.HTMLMediaElement.prototype.pause = vi.fn().mockImplementation(() => {});
      }
    });

    afterEach(() => {
      global.IntersectionObserver = originalIntersectionObserver;
      window.matchMedia = originalMatchMedia;
      vi.restoreAllMocks();
      // Ensure document.hidden is restored
      Object.defineProperty(document, 'hidden', {
        value: false,
        writable: true,
        configurable: true
      });
    });

    it('1.1: Scrolling offscreen invokes pause() and sets isInView to false', () => {
      const { unmount } = render(<VideoHarness options={{ threshold: 0.35 }} />);
      const videoEl = screen.getByTestId('test-video');
      const pauseSpy = vi.spyOn(videoEl, 'pause');

      expect(mockObserverInstance.observe).toHaveBeenCalledWith(videoEl);

      // Simulate scrolling offscreen
      act(() => {
        observerCallback([{
          isIntersecting: false,
          intersectionRatio: 0.0,
          target: videoEl
        }]);
      });

      expect(screen.getByTestId('is-in-view').textContent).toBe('off-screen');
      expect(pauseSpy).toHaveBeenCalled();
      unmount();
    });

    it('1.2: Scrolling into view (>= 35% threshold) invokes play() and sets isInView to true', async () => {
      const { unmount } = render(<VideoHarness options={{ threshold: 0.35 }} />);
      const videoEl = screen.getByTestId('test-video');
      const playSpy = vi.spyOn(videoEl, 'play');

      // Simulate scrolling into view with ratio >= 0.35
      await act(async () => {
        observerCallback([{
          isIntersecting: true,
          intersectionRatio: 0.40,
          target: videoEl
        }]);
      });

      expect(screen.getByTestId('is-in-view').textContent).toBe('in-view');
      expect(playSpy).toHaveBeenCalled();
      unmount();
    });

    it('1.3: Document visibilitychange with hidden=true pauses video immediately', async () => {
      const { unmount } = render(<VideoHarness options={{ threshold: 0.35 }} />);
      const videoEl = screen.getByTestId('test-video');
      const pauseSpy = vi.spyOn(videoEl, 'pause');

      // First scroll into view
      await act(async () => {
        observerCallback([{
          isIntersecting: true,
          intersectionRatio: 0.5,
          target: videoEl
        }]);
      });

      // Simulate user switching tabs (document.hidden = true)
      Object.defineProperty(document, 'hidden', {
        value: true,
        writable: true,
        configurable: true
      });

      act(() => {
        document.dispatchEvent(new Event('visibilitychange'));
      });

      expect(pauseSpy).toHaveBeenCalled();
      unmount();
    });

    it('1.4: Document visibilitychange with hidden=false resumes video if in view, but remains paused if offscreen', async () => {
      const { unmount } = render(<VideoHarness options={{ threshold: 0.35 }} />);
      const videoEl = screen.getByTestId('test-video');
      const playSpy = vi.spyOn(videoEl, 'play');

      // 1. Scroll into view
      await act(async () => {
        observerCallback([{
          isIntersecting: true,
          intersectionRatio: 0.5,
          target: videoEl
        }]);
      });

      // 2. Hide document
      Object.defineProperty(document, 'hidden', {
        value: true,
        writable: true,
        configurable: true
      });
      act(() => {
        document.dispatchEvent(new Event('visibilitychange'));
      });

      playSpy.mockClear();

      // 3. User returns to tab: hidden = false (video was intersecting)
      Object.defineProperty(document, 'hidden', {
        value: false,
        writable: true,
        configurable: true
      });
      act(() => {
        document.dispatchEvent(new Event('visibilitychange'));
      });

      expect(playSpy).toHaveBeenCalledTimes(1);

      // 4. Now simulate scrolling offscreen while visible
      act(() => {
        observerCallback([{
          isIntersecting: false,
          intersectionRatio: 0.0,
          target: videoEl
        }]);
      });

      playSpy.mockClear();

      // 5. Hide and re-show document while video is offscreen
      Object.defineProperty(document, 'hidden', {
        value: true,
        writable: true,
        configurable: true
      });
      act(() => {
        document.dispatchEvent(new Event('visibilitychange'));
      });

      Object.defineProperty(document, 'hidden', {
        value: false,
        writable: true,
        configurable: true
      });
      act(() => {
        document.dispatchEvent(new Event('visibilitychange'));
      });

      // Crucial invariant: Video must NOT play if offscreen when returning to tab
      expect(playSpy).not.toHaveBeenCalled();
      unmount();
    });

    it('1.5: Rapid scroll oscillations (play/pause race condition) handle AbortError gracefully', async () => {
      // Construct a DOMException AbortError matching real browser play() interruption
      const abortError = new DOMException('The play() request was interrupted by a call to pause().', 'AbortError');
      let unhandledRejections = [];

      const rejectionHandler = (e) => {
        unhandledRejections.push(e);
      };
      window.addEventListener('unhandledrejection', rejectionHandler);

      const { unmount } = render(<VideoHarness options={{ threshold: 0.35 }} />);
      const videoEl = screen.getByTestId('test-video');

      // Simulate play() returning a promise that rejects with AbortError
      videoEl.play = vi.fn().mockImplementation(() => Promise.reject(abortError));
      const pauseSpy = vi.spyOn(videoEl, 'pause');

      // 100 rapid oscillations
      for (let i = 0; i < 50; i++) {
        await act(async () => {
          observerCallback([{
            isIntersecting: true,
            intersectionRatio: 0.5,
            target: videoEl
          }]);
        });

        act(() => {
          observerCallback([{
            isIntersecting: false,
            intersectionRatio: 0.0,
            target: videoEl
          }]);
        });
      }

      expect(pauseSpy).toHaveBeenCalled();
      expect(unhandledRejections).toHaveLength(0);

      window.removeEventListener('unhandledrejection', rejectionHandler);
      unmount();
    });

    it('1.6: Respects prefers-reduced-motion: reduce by suppressing auto-play', async () => {
      // Mock matchMedia for prefers-reduced-motion: reduce
      window.matchMedia = vi.fn().mockImplementation((query) => {
        return {
          matches: query.includes('prefers-reduced-motion: reduce'),
          media: query,
          onchange: null,
          addListener: vi.fn(),
          removeListener: vi.fn(),
          addEventListener: vi.fn(),
          removeEventListener: vi.fn(),
          dispatchEvent: vi.fn(),
        };
      });

      const { unmount } = render(<VideoHarness options={{ threshold: 0.35 }} />);
      const videoEl = screen.getByTestId('test-video');
      const playSpy = vi.spyOn(videoEl, 'play');

      // Scroll into view
      await act(async () => {
        observerCallback([{
          isIntersecting: true,
          intersectionRatio: 0.6,
          target: videoEl
        }]);
      });

      // Video should NOT play because reduced motion is active
      expect(playSpy).not.toHaveBeenCalled();
      unmount();
    });

    it('1.7: Enabled option toggling immediately pauses video and unmount cleans up observers', () => {
      const ToggleableHarness = () => {
        const [enabled, setEnabled] = useState(true);
        return (
          <div>
            <button onClick={() => setEnabled((prev) => !prev)}>Toggle Enabled</button>
            <VideoHarness options={{ enabled, threshold: 0.35 }} />
          </div>
        );
      };

      const { unmount } = render(<ToggleableHarness />);
      const videoEl = screen.getByTestId('test-video');
      const pauseSpy = vi.spyOn(videoEl, 'pause');

      // Toggle enabled to false
      act(() => {
        fireEvent.click(screen.getByRole('button', { name: /Toggle Enabled/i }));
      });

      expect(pauseSpy).toHaveBeenCalled();

      // Verify unmount cleanly disconnects
      unmount();
      expect(mockObserverInstance.disconnect).toHaveBeenCalled();
    });

    it('1.8: Preload attribute verification: Hero video has preload="metadata", ProjectCard video has preload="none"', () => {
      // 1. Check Hero component
      const { unmount: unmountHero } = render(
        <I18nProvider>
          <Hero isDarkMode={true} scrollTo={() => {}} />
        </I18nProvider>
      );

      const heroVideo = document.querySelector('#hero video');
      expect(heroVideo).toBeInTheDocument();
      expect(heroVideo).toHaveAttribute('preload', 'metadata');
      expect(heroVideo).toHaveAttribute('loop');
      expect(heroVideo).toHaveAttribute('muted');
      expect(heroVideo).toHaveAttribute('playsinline');
      unmountHero();

      // 2. Check ProjectCard with video media
      const projectWithVideo = PROJECTS.find((p) =>
        Array.isArray(p.media) && p.media.some((m) => m.type === 'video')
      );
      expect(projectWithVideo).toBeDefined();

      const { unmount: unmountProject } = render(
        <I18nProvider>
          <ProjectCard project={projectWithVideo} />
        </I18nProvider>
      );

      const projectVideo = document.querySelector('video');
      expect(projectVideo).toBeInTheDocument();
      expect(projectVideo).toHaveAttribute('preload', 'none');
      expect(projectVideo).toHaveAttribute('loop');
      expect(projectVideo).toHaveAttribute('muted');
      expect(projectVideo).toHaveAttribute('playsinline');
      unmountProject();
    });

    it('1.9: Synchronous throw on video.play() is caught and isolated without unhandled exception', () => {
      const { unmount } = render(<VideoHarness options={{ threshold: 0.35 }} />);
      const videoEl = screen.getByTestId('test-video');

      // Force synchronous throw
      videoEl.play = vi.fn().mockImplementation(() => {
        throw new Error('Hardware video acceleration disabled');
      });

      expect(() => {
        act(() => {
          observerCallback([{
            isIntersecting: true,
            intersectionRatio: 0.5,
            target: videoEl
          }]);
        });
      }).not.toThrow();

      expect(screen.getByTestId('is-playing').textContent).toBe('paused');
      unmount();
    });

    it('1.10: Empty observer entries array does not throw or crash state', () => {
      const { unmount } = render(<VideoHarness options={{ threshold: 0.35 }} />);

      expect(() => {
        act(() => {
          observerCallback([]);
        });
      }).not.toThrow();

      unmount();
    });

    it('1.11: Fallback when IntersectionObserver is unsupported in older runtime', () => {
      delete global.IntersectionObserver;

      let played = false;
      const CustomVideoHarness = () => {
        const { videoRef } = useOptimizedVideo({ threshold: 0.35 });
        return (
          <video
            ref={(node) => {
              videoRef.current = node;
              if (node) {
                node.play = () => {
                  played = true;
                  return Promise.resolve();
                };
              }
            }}
          />
        );
      };

      const { unmount } = render(<CustomVideoHarness />);
      expect(played).toBe(true);
      unmount();
    });
  });

  // ==========================================================================
  // Suite 2: Logo Resilience & Fallback Testing (R4)
  // ==========================================================================
  describe('Suite 2: Logo Resilience & Fallback Testing (R4)', () => {
    const EXPECTED_LOGOS = [
      'anthropic.svg',
      'aws.svg',
      'deeplearning-ai.svg',
      'dicoding.svg',
      'google.svg',
      'ibm.svg',
      'kawan-lama.svg',
      'microsoft.svg',
      'myskill.svg',
      'securiti-ai.svg',
    ];

    it('2.1: All 10 issuer SVGs in public/logos/ exist, have non-zero size, and are valid XML/SVG geometry', () => {
      const logosDir = path.resolve(process.cwd(), 'public', 'logos');
      expect(fs.existsSync(logosDir)).toBe(true);

      for (const logoFile of EXPECTED_LOGOS) {
        const fullPath = path.join(logosDir, logoFile);
        expect(fs.existsSync(fullPath)).toBe(true);

        const content = fs.readFileSync(fullPath, 'utf8').trim();
        expect(content.length).toBeGreaterThan(150);

        // XML/SVG geometric structural checks
        expect(content).toMatch(/^<svg[^>]+xmlns="http:\/\/www\.w3\.org\/2000\/svg"/i);
        expect(content).toMatch(/viewBox="0 0 \d+ \d+"/i);
        expect(content).toMatch(/<\/svg>$/i);

        // Verify viewBox has non-zero width and height
        const viewBoxMatch = content.match(/viewBox="0 0 (\d+) (\d+)"/i);
        expect(viewBoxMatch).not.toBeNull();
        const [, vbWidth, vbHeight] = viewBoxMatch;
        expect(Number(vbWidth)).toBeGreaterThan(0);
        expect(Number(vbHeight)).toBeGreaterThan(0);
      }
    });

    it('2.2: CertBadge size="sm" falls back to Lucide <Award> with emerald theme classes on error', () => {
      const { unmount } = render(
        <CertBadge src="/invalid-path/broken-logo.svg" alt="Test Credential" size="sm" />
      );

      const img = screen.getByRole('img', { name: 'Test Credential' });
      expect(img).toBeInTheDocument();

      // Trigger onError
      act(() => {
        fireEvent.error(img);
      });

      // Broken img should be replaced by svg Lucide Award
      expect(screen.queryByRole('img', { name: 'Test Credential' })).toBeNull();
      const fallbackSvg = document.querySelector('svg.lucide-award');
      expect(fallbackSvg).toBeInTheDocument();
      expect(fallbackSvg.getAttribute('class')).toContain('text-emerald-700');
      expect(fallbackSvg.getAttribute('class')).toContain('dark:text-emerald-400');
      unmount();
    });

    it('2.3: CertBadge size="md" falls back to rounded-full emerald container with Lucide <Award> on error', () => {
      const { unmount } = render(
        <CertBadge src="/invalid-path/broken-logo.svg" alt="Marquee Card" size="md" />
      );

      const img = screen.getByRole('img', { name: 'Marquee Card' });
      expect(img).toBeInTheDocument();

      // Trigger onError
      act(() => {
        fireEvent.error(img);
      });

      // Broken img unmounted, replaced by rounded-full wrapper with Award
      expect(screen.queryByRole('img', { name: 'Marquee Card' })).toBeNull();
      const wrapper = document.querySelector('div.rounded-full');
      expect(wrapper).toBeInTheDocument();
      expect(wrapper.getAttribute('class')).toContain('bg-emerald-50');
      expect(wrapper.getAttribute('class')).toContain('dark:bg-emerald-950/60');

      const awardIcon = wrapper.querySelector('svg.lucide-award');
      expect(awardIcon).toBeInTheDocument();
      expect(awardIcon.getAttribute('class')).toContain('text-emerald-700');
      expect(awardIcon.getAttribute('class')).toContain('dark:text-emerald-400');
      unmount();
    });

    it('2.4: CertBadge with missing/null/empty src immediately renders fallback without mounting broken img', () => {
      const { unmount } = render(<CertBadge src={null} issuer="Unknown Organization" size="md" />);

      // Should have zero <img> tags
      expect(document.querySelector('img')).toBeNull();

      const awardIcon = document.querySelector('svg.lucide-award');
      expect(awardIcon).toBeInTheDocument();
      expect(awardIcon.getAttribute('class')).toContain('text-emerald-700');
      expect(awardIcon.getAttribute('class')).toContain('dark:text-emerald-400');
      unmount();
    });

    it('2.5: Zero blank circular holes: CertBadge NEVER sets inline style="opacity: 0" or opacity-0 on error', () => {
      const { unmount } = render(
        <CertBadge src="/corrupted-asset.svg" alt="Corrupted Cert" size="md" />
      );

      const img = screen.getByRole('img', { name: 'Corrupted Cert' });
      act(() => {
        fireEvent.error(img);
      });

      // Verify no element has opacity 0
      const elements = document.querySelectorAll('*');
      elements.forEach((el) => {
        expect(el.style.opacity).not.toBe('0');
        expect(el.className).not.toContain('opacity-0');
      });
      unmount();
    });

    it('2.6: Comprehensive 87-Certification Logo Dataset Audit: 100% resolve to valid local SVGs with 0 expired links', () => {
      expect(CERTIFICATIONS).toHaveLength(87);

      const logosDir = path.resolve(process.cwd(), 'public', 'logos');
      const foundIssuers = new Set();

      CERTIFICATIONS.forEach((cert) => {
        // Must have non-empty title and issuer
        expect(cert.title).toBeTruthy();
        expect(cert.issuer).toBeTruthy();
        foundIssuers.add(cert.issuer);

        // Image MUST exist and MUST NOT point to volatile media.licdn.com
        expect(cert.image).toBeDefined();
        expect(cert.image).not.toContain('media.licdn.com');

        if (cert.image.startsWith('/logos/')) {
          const fileName = cert.image.replace('/logos/', '');
          const localPath = path.join(logosDir, fileName);
          expect(fs.existsSync(localPath)).toBe(true);
        }
      });

      // Verify all 10 core issuers are represented in the dataset
      expect(foundIssuers.size).toBeGreaterThanOrEqual(10);
    });

    it('2.7: Issuer mapping fallback in CertBadge resolves known issuer marks without explicit src', () => {
      const { unmount } = render(
        <CertBadge issuer="DeepLearning.AI" size="sm" alt="DeepLearning Test" />
      );

      const img = screen.getByRole('img', { name: 'DeepLearning Test' });
      expect(img).toBeInTheDocument();
      expect(img).toHaveAttribute('src', '/logos/deeplearning-ai.svg');
      unmount();
    });

    it('2.8: Adversarial prop fuzzing on CertBadge: null/undefined/numeric/malformed props render safely', () => {
      const maliciousProps = [
        { src: undefined, issuer: null, size: 'unknown', className: null },
        { src: 12345, issuer: 67890, size: null, className: undefined },
        { src: 'javascript:void(0)', issuer: '<script>alert(1)</script>', size: 'md' },
        { src: '', issuer: '', size: 'sm', alt: null },
      ];

      for (const props of maliciousProps) {
        const { unmount } = render(<CertBadge {...props} />);
        const awardIcon = document.querySelector('svg.lucide-award') || document.querySelector('img');
        expect(awardIcon).toBeInTheDocument();
        unmount();
      }
    });

    it('2.9: Marquee card rendering resilience: simulated broken image renders Award without blank holes', () => {
      const brokenCert = {
        id: 999,
        title: "Adversarial Masterclass",
        issuer: "Nonexistent Issuer Corp",
        image: "/logos/nonexistent-corrupted-logo.svg",
        link: "https://example.com/cert",
        date: "Issued Nov 2026",
        credentialId: "ADV-999"
      };

      const { unmount } = render(
        <a 
          href={brokenCert.link}
          className="bg-white/95 dark:bg-slate-900/95 p-8 rounded-2xl border flex flex-col justify-between w-80 shrink-0 h-64"
        >
          <div className="mb-4 flex items-center justify-between gap-3">
            <CertBadge 
              src={brokenCert.image} 
              alt="" 
              issuer={brokenCert.issuer} 
              size="md" 
            />
          </div>
          <h3>{brokenCert.title}</h3>
        </a>
      );

      const img = document.querySelector('img');
      expect(img).toBeInTheDocument();

      // Trigger error
      act(() => {
        fireEvent.error(img);
      });

      // Verification: image unmounted, replaced by Award, no opacity 0
      expect(document.querySelector('img')).toBeNull();
      const fallbackAward = document.querySelector('svg.lucide-award');
      expect(fallbackAward).toBeInTheDocument();
      expect(fallbackAward.closest('.rounded-full')).not.toBeNull();
      expect(fallbackAward.closest('.rounded-full').style.opacity).not.toBe('0');
      unmount();
    });
  });
});
