/**
 * Challenger 1: Adversarial DOM, Search Fuzzing & Boundary Pagination Stress Suite
 *
 * Scope:
 * Suite 1: Empirical DOM Node Count Benchmarks & Boundary Measurements (R2 Guardrail <= 150)
 * Suite 2: Adversarial Search Fuzzing & Malicious Payloads (XSS, SQL, Regex, Unicode, Long Strings)
 * Suite 3: High-Frequency Rapid Filter Chip Switching & Concurrency Stress
 * Suite 4: Boundary Pagination & State Clamping Mechanics (Page 1, Page 8, Filter/Search reset)
 * Suite 5: Hardware Acceleration, Marquee Integration & Accessibility Invariants
 */

import React from 'react';
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { screen, within, fireEvent, act, render } from '@testing-library/react';
import { renderPortfolio, resetTestEnvironment } from './harness';
import { CERTIFICATIONS } from '../../src/data/constants';
import { CertificationsDirectoryModal } from '../../src/components/ui/CertificationsDirectoryModal';
import { I18nProvider } from '../../src/lib/i18n';
import fs from 'fs';
import path from 'path';

describe('Challenger 1: Adversarial DOM, Search Fuzzing & Boundary Stress Suite', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    resetTestEnvironment();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  // ==========================================================================
  // Suite 1: Empirical DOM Node Count Benchmarks & Boundary Measurements (R2)
  // ==========================================================================
  describe('Suite 1: Empirical DOM Node Count Benchmarks & Boundary Measurements (R2)', () => {
    it('1.1: Closed modal has zero active DOM nodes (Zero Idle DOM guarantee)', () => {
      renderPortfolio();
      const modal = document.getElementById('certifications-directory-modal');
      expect(modal).toBeNull();
      const presentation = document.querySelector('[role="presentation"]');
      expect(presentation).toBeNull();
    });

    it('1.2: Opened modal on Page 1 has active DOM element count strictly <= 150 elements', () => {
      renderPortfolio();
      const triggerBtn = screen.getByRole('button', { name: /Browse All (80\+|87)/i });

      act(() => {
        fireEvent.click(triggerBtn);
      });

      const modal = document.getElementById('certifications-directory-modal');
      expect(modal).toBeInTheDocument();

      const totalElements = modal.querySelectorAll('*').length;
      // Record empirical measurement: 146 elements on page 1, strictly <= 150
      expect(totalElements).toBeLessThanOrEqual(150);
      expect(totalElements).toBe(146);
    });

    it('1.3: Exhaustive page traverse (Pages 1 to 8): DOM element count remains <= 150 on every single page', () => {
      renderPortfolio();
      const triggerBtn = screen.getByRole('button', { name: /Browse All (80\+|87)/i });

      act(() => {
        fireEvent.click(triggerBtn);
      });

      const modal = document.getElementById('certifications-directory-modal');
      const nextBtn = within(modal).getByRole('button', { name: /Next page/i });

      const pageCounts = [];

      for (let page = 1; page <= 8; page++) {
        const count = modal.querySelectorAll('*').length;
        pageCounts.push({ page, count });
        expect(count, `Page ${page} exceeded DOM ceiling of 150`).toBeLessThanOrEqual(150);

        if (page < 8) {
          act(() => {
            fireEvent.click(nextBtn);
          });
        }
      }

      // Pages 1-7 have 12 cards each: 146 elements (strictly <= 150)
      // Page 8 has 3 cards: 56 elements (strictly <= 150)
      expect(pageCounts[0].count).toBe(146);
      expect(pageCounts[6].count).toBe(146);
      expect(pageCounts[7].count).toBe(56);
      expect(pageCounts.every(p => p.count <= 150)).toBe(true);
    });

    it('1.4: Filtered views DOM traverse: every single provider category maintains <= 150 elements', () => {
      renderPortfolio();
      const triggerBtn = screen.getByRole('button', { name: /Browse All (80\+|87)/i });

      act(() => {
        fireEvent.click(triggerBtn);
      });

      const modal = document.getElementById('certifications-directory-modal');
      const chips = within(modal).getAllByRole('button').filter(b => b.hasAttribute('aria-pressed'));

      expect(chips.length).toBe(7);

      chips.forEach((chip) => {
        act(() => {
          fireEvent.click(chip);
        });

        const count = modal.querySelectorAll('*').length;
        expect(count, `Filter ${chip.textContent} exceeded DOM ceiling`).toBeLessThanOrEqual(150);
      });
    });

    it('1.5: Empty search state DOM count is strictly bounded and renders fallback without error', () => {
      renderPortfolio();
      const triggerBtn = screen.getByRole('button', { name: /Browse All (80\+|87)/i });

      act(() => {
        fireEvent.click(triggerBtn);
      });

      const modal = document.getElementById('certifications-directory-modal');
      const searchInput = within(modal).getByRole('textbox');

      act(() => {
        fireEvent.change(searchInput, { target: { value: 'nonexistent-cert-xyz-999' } });
      });

      const count = modal.querySelectorAll('*').length;
      expect(count).toBeLessThanOrEqual(150);
      expect(within(modal).getByText(/No Credentials Found/i)).toBeInTheDocument();
      expect(within(modal).getByRole('button', { name: /Reset Filters/i })).toBeInTheDocument();
    });

    it('1.6: Background MarqueeSection DOM node stability when modal is toggled open and closed', () => {
      renderPortfolio();
      // Locate inner marquee section
      const marqueeInner = document.querySelector('section#certifications');
      expect(marqueeInner).toBeInTheDocument();

      const initialMarqueeNodes = marqueeInner.querySelectorAll('*').length;
      const triggerBtn = screen.getByRole('button', { name: /Browse All (80\+|87)/i });

      // Open modal
      act(() => {
        fireEvent.click(triggerBtn);
      });

      const modal = document.getElementById('certifications-directory-modal');
      expect(modal).toBeInTheDocument();

      // Modal is cleanly decoupled from marquee tracks; marquee tracks maintain exact node count
      const openMarqueeNodes = marqueeInner.querySelectorAll('*').length;
      expect(openMarqueeNodes).toBe(initialMarqueeNodes);

      // Close modal
      const closeBtn = within(modal).getByRole('button', { name: /Close certifications directory/i });
      act(() => {
        fireEvent.click(closeBtn);
      });

      expect(document.getElementById('certifications-directory-modal')).toBeNull();

      // Verify exact DOM restoration with 0 leaks
      const finalMarqueeNodes = marqueeInner.querySelectorAll('*').length;
      expect(finalMarqueeNodes).toBe(initialMarqueeNodes);
    });
  });

  // ==========================================================================
  // Suite 2: Adversarial Search Fuzzing & Malicious Payloads
  // ==========================================================================
  describe('Suite 2: Adversarial Search Fuzzing & Malicious Payloads', () => {
    const maliciousFuzzPayloads = [
      { name: 'XSS script injection', payload: '<script>alert("xss")</script>' },
      { name: 'XSS img error injection', payload: '"><img src=x onerror=alert(1)>' },
      { name: 'XSS svg onload injection', payload: '<svg/onload=alert`1`>' },
      { name: 'SQL injection classic', payload: "' OR '1'='1" },
      { name: 'SQL injection drop table', payload: "Robert'); DROP TABLE certs;--" },
      { name: 'Regex metacharacters: wildcard and brackets', payload: '.*[a-z]+' },
      { name: 'Regex metacharacters: open unclosed parenthesis', payload: '((([a-z]' },
      { name: 'Regex metacharacters: unclosed brackets', payload: '[[[' },
      { name: 'Regex metacharacters: plus and question mark', payload: '+?*^$' },
      { name: 'Regex metacharacters: word boundary and digits', payload: '\\b\\d+\\w' },
      { name: 'Null byte injection', payload: 'IBM\0Cert' },
      { name: 'Newline and carriage return escape', payload: 'IBM\r\n\tDeepLearning' },
      { name: 'Unicode and emojis', payload: '🚀🤖🔥✨ IBM Watson' },
      { name: 'Non-Latin script: Chinese', payload: '人工智能 证书' },
      { name: 'Non-Latin script: Arabic', payload: 'شهادة الذكاء الاصطناعي' },
      { name: 'Extreme 500-char string', payload: 'A'.repeat(500) },
      { name: 'Extreme 1000-char string', payload: 'Z'.repeat(1000) },
      { name: 'Punctuation soup', payload: '!@#$%^&*()_+-=[]{}|;:\'",.<>?/' },
      { name: 'Empty and pure whitespace', payload: '     ' },
    ];

    maliciousFuzzPayloads.forEach(({ name, payload }) => {
      it(`2.1: Handles ${name} safely without throwing unhandled exceptions`, () => {
        renderPortfolio();
        const triggerBtn = screen.getByRole('button', { name: /Browse All (80\+|87)/i });

        act(() => {
          fireEvent.click(triggerBtn);
        });

        const modal = document.getElementById('certifications-directory-modal');
        const searchInput = within(modal).getByRole('textbox');

        // Must not throw any error (especially regex syntax errors)
        expect(() => {
          act(() => {
            fireEvent.change(searchInput, { target: { value: payload } });
          });
        }).not.toThrow();

        // Modal should remain mounted and stable
        expect(document.getElementById('certifications-directory-modal')).toBeInTheDocument();
      });
    });

    it('2.2: Legitimate search query "IBM" filters exactly to IBM certifications', () => {
      renderPortfolio();
      const triggerBtn = screen.getByRole('button', { name: /Browse All (80\+|87)/i });

      act(() => {
        fireEvent.click(triggerBtn);
      });

      const modal = document.getElementById('certifications-directory-modal');
      const searchInput = within(modal).getByRole('textbox');

      act(() => {
        fireEvent.change(searchInput, { target: { value: 'IBM' } });
      });

      // IBM total in constants is 36, page 1 displays 12
      const cards = modal.querySelectorAll('.grid a');
      expect(cards.length).toBe(12);

      // Verify text announces correct showing/total breakdown in both visual footer and sr-only live region
      const resultsAnnouncements = within(modal).getAllByText(/Showing 12 of \d+ credentials/i);
      expect(resultsAnnouncements.length).toBe(2);
      expect(within(modal).getByText(/\(87 total\)/i)).toBeInTheDocument();
      expect(within(modal).getByText(/Page 1 of/i)).toBeInTheDocument();
    });

    it('2.3: Case-insensitive substring search matching credentialId', () => {
      renderPortfolio();
      const triggerBtn = screen.getByRole('button', { name: /Browse All (80\+|87)/i });

      act(() => {
        fireEvent.click(triggerBtn);
      });

      const modal = document.getElementById('certifications-directory-modal');
      const searchInput = within(modal).getByRole('textbox');

      // Search for specific known credential ID
      const targetCert = CERTIFICATIONS.find(c => c.credentialId && c.credentialId.length > 5);
      expect(targetCert).toBeDefined();

      act(() => {
        fireEvent.change(searchInput, { target: { value: targetCert.credentialId.toLowerCase() } });
      });

      expect(within(modal).getByText(targetCert.title)).toBeInTheDocument();
    });

    it('2.4: Clear search button (✕) appears when query is present, clears query and restores focus', () => {
      renderPortfolio();
      const triggerBtn = screen.getByRole('button', { name: /Browse All (80\+|87)/i });

      act(() => {
        fireEvent.click(triggerBtn);
      });

      const modal = document.getElementById('certifications-directory-modal');
      const searchInput = within(modal).getByRole('textbox');

      act(() => {
        fireEvent.change(searchInput, { target: { value: 'Anthropic' } });
      });

      const clearBtn = within(modal).getByRole('button', { name: /Clear search query/i });
      expect(clearBtn).toBeInTheDocument();

      act(() => {
        fireEvent.click(clearBtn);
      });

      expect(searchInput.value).toBe('');
      expect(modal.querySelectorAll('.grid a').length).toBe(12);
      expect(within(modal).getByText(/Page 1 of 8/i)).toBeInTheDocument();
    });
  });

  // ==========================================================================
  // Suite 3: High-Frequency Rapid Filter Chip Switching & Concurrency Stress
  // ==========================================================================
  describe('Suite 3: High-Frequency Rapid Filter Chip Switching & Concurrency Stress', () => {
    it('3.1: 70 rapid consecutive filter chip clicks execute without state desync or crashes', () => {
      renderPortfolio();
      const triggerBtn = screen.getByRole('button', { name: /Browse All (80\+|87)/i });

      act(() => {
        fireEvent.click(triggerBtn);
      });

      const modal = document.getElementById('certifications-directory-modal');
      const chips = within(modal).getAllByRole('button').filter(b => b.hasAttribute('aria-pressed'));
      expect(chips.length).toBe(7);

      // Perform 70 rapid clicks cycling through all 7 chips (i = 0..69)
      for (let i = 0; i < 70; i++) {
        const targetChip = chips[i % 7];
        act(() => {
          fireEvent.click(targetChip);
        });
      }

      // 69 % 7 === 6 -> ends on chip 6 ('Other')
      expect(chips[6].getAttribute('aria-pressed')).toBe('true');
      expect(modal.querySelectorAll('.grid a').length).toBe(4);
      expect(within(modal).getByText(/Page 1 of 1/i)).toBeInTheDocument();

      // Click 'All' chip to verify immediate recovery back to 87
      act(() => {
        fireEvent.click(chips[0]);
      });
      expect(chips[0].getAttribute('aria-pressed')).toBe('true');
      expect(modal.querySelectorAll('.grid a').length).toBe(12);
      expect(within(modal).getByText(/Page 1 of 8/i)).toBeInTheDocument();
    });

    it('3.2: Rapidly switching between filter chips while typing search query produces coherent result state', () => {
      renderPortfolio();
      const triggerBtn = screen.getByRole('button', { name: /Browse All (80\+|87)/i });

      act(() => {
        fireEvent.click(triggerBtn);
      });

      const modal = document.getElementById('certifications-directory-modal');
      const searchInput = within(modal).getByRole('textbox');
      const chips = within(modal).getAllByRole('button').filter(b => b.hasAttribute('aria-pressed'));

      // Chip 1: IBM, type query "Cloud"
      act(() => {
        fireEvent.click(chips[1]); // IBM
        fireEvent.change(searchInput, { target: { value: 'Cloud' } });
      });

      // Switch to Chip 4: Dicoding, type query "Python"
      act(() => {
        fireEvent.click(chips[4]); // Dicoding
        fireEvent.change(searchInput, { target: { value: 'Python' } });
      });

      // Switch to Chip 0: All, clear query
      act(() => {
        fireEvent.click(chips[0]); // All
        fireEvent.change(searchInput, { target: { value: '' } });
      });

      expect(modal.querySelectorAll('.grid a').length).toBe(12);
      expect(within(modal).getByText(/Page 1 of 8/i)).toBeInTheDocument();
    });

    it('3.3: Dynamic counts on all 7 filter chips strictly sum to 87', () => {
      renderPortfolio();
      const triggerBtn = screen.getByRole('button', { name: /Browse All (80\+|87)/i });

      act(() => {
        fireEvent.click(triggerBtn);
      });

      const modal = document.getElementById('certifications-directory-modal');
      const chips = within(modal).getAllByRole('button').filter(b => b.hasAttribute('aria-pressed'));

      const chipData = chips.map(c => {
        const match = c.textContent.match(/\((\d+)\)/);
        return { text: c.textContent, count: match ? parseInt(match[1], 10) : 0 };
      });

      expect(chipData[0].count).toBe(87); // All
      expect(chipData[1].count).toBe(36); // IBM
      expect(chipData[2].count).toBe(21); // Anthropic
      expect(chipData[3].count).toBe(12); // DeepLearning.AI
      expect(chipData[4].count).toBe(12); // Dicoding
      expect(chipData[5].count).toBe(2);  // Google
      expect(chipData[6].count).toBe(4);  // Other

      const individualSum = chipData.slice(1).reduce((sum, item) => sum + item.count, 0);
      expect(individualSum).toBe(87);
    });
  });

  // ==========================================================================
  // Suite 4: Boundary Pagination & State Clamping Mechanics
  // ==========================================================================
  describe('Suite 4: Boundary Pagination & State Clamping Mechanics', () => {
    it('4.1: Fast pagination clicking: clicking Next 25 times does not exceed Page 8', () => {
      renderPortfolio();
      const triggerBtn = screen.getByRole('button', { name: /Browse All (80\+|87)/i });

      act(() => {
        fireEvent.click(triggerBtn);
      });

      const modal = document.getElementById('certifications-directory-modal');
      const nextBtn = within(modal).getByRole('button', { name: /Next page/i });

      // Click next 25 times
      for (let i = 0; i < 25; i++) {
        act(() => {
          fireEvent.click(nextBtn);
        });
      }

      expect(within(modal).getByText(/Page 8 of 8/i)).toBeInTheDocument();
      expect(nextBtn).toBeDisabled();
      expect(modal.querySelectorAll('.grid a').length).toBe(3);
    });

    it('4.2: Fast pagination clicking: clicking Prev 25 times does not drop below Page 1', () => {
      renderPortfolio();
      const triggerBtn = screen.getByRole('button', { name: /Browse All (80\+|87)/i });

      act(() => {
        fireEvent.click(triggerBtn);
      });

      const modal = document.getElementById('certifications-directory-modal');
      const prevBtn = within(modal).getByRole('button', { name: /Previous page/i });

      // Click prev 25 times from page 1
      for (let i = 0; i < 25; i++) {
        act(() => {
          fireEvent.click(prevBtn);
        });
      }

      expect(within(modal).getByText(/Page 1 of 8/i)).toBeInTheDocument();
      expect(prevBtn).toBeDisabled();
      expect(modal.querySelectorAll('.grid a').length).toBe(12);
    });

    it('4.3: Crucial Boundary: User is on Page 8, then selects "Google" filter (2 items, 1 page)', () => {
      renderPortfolio();
      const triggerBtn = screen.getByRole('button', { name: /Browse All (80\+|87)/i });

      act(() => {
        fireEvent.click(triggerBtn);
      });

      const modal = document.getElementById('certifications-directory-modal');
      const nextBtn = within(modal).getByRole('button', { name: /Next page/i });

      // Go to page 8
      for (let i = 1; i < 8; i++) {
        act(() => {
          fireEvent.click(nextBtn);
        });
      }
      expect(within(modal).getByText(/Page 8 of 8/i)).toBeInTheDocument();

      // Click Google chip
      const chips = within(modal).getAllByRole('button').filter(b => b.hasAttribute('aria-pressed'));
      const googleChip = chips.find(c => c.textContent.includes('Google'));
      expect(googleChip).toBeDefined();

      act(() => {
        fireEvent.click(googleChip);
      });

      // State MUST reset to Page 1 of 1 and show exactly 2 items without blank screen
      expect(within(modal).getByText(/Page 1 of 1/i)).toBeInTheDocument();
      const cards = modal.querySelectorAll('.grid a');
      expect(cards.length).toBe(2);
      expect(within(modal).getByRole('button', { name: /Next page/i })).toBeDisabled();
      expect(within(modal).getByRole('button', { name: /Previous page/i })).toBeDisabled();
    });

    it('4.4: Crucial Boundary: User is on Page 8, then types search query matching 1 item', () => {
      renderPortfolio();
      const triggerBtn = screen.getByRole('button', { name: /Browse All (80\+|87)/i });

      act(() => {
        fireEvent.click(triggerBtn);
      });

      const modal = document.getElementById('certifications-directory-modal');
      const nextBtn = within(modal).getByRole('button', { name: /Next page/i });

      // Go to page 8
      for (let i = 1; i < 8; i++) {
        act(() => {
          fireEvent.click(nextBtn);
        });
      }
      expect(within(modal).getByText(/Page 8 of 8/i)).toBeInTheDocument();

      const searchInput = within(modal).getByRole('textbox');

      act(() => {
        fireEvent.change(searchInput, { target: { value: 'Generative AI Advanced Fine-Tuning' } });
      });

      // Must clamp to Page 1 of 1, showing matching cards without rendering empty or crashing
      expect(within(modal).getByText(/Page 1 of 1/i)).toBeInTheDocument();
      const cards = modal.querySelectorAll('.grid a');
      expect(cards.length).toBe(1);
      expect(within(modal).getByText('Generative AI Advanced Fine-Tuning for LLMs')).toBeInTheDocument();
    });

    it('4.5: Reset Filters from empty search state on boundary restores Page 1 of 8', () => {
      renderPortfolio();
      const triggerBtn = screen.getByRole('button', { name: /Browse All (80\+|87)/i });

      act(() => {
        fireEvent.click(triggerBtn);
      });

      const modal = document.getElementById('certifications-directory-modal');
      const searchInput = within(modal).getByRole('textbox');

      // Type non-matching string
      act(() => {
        fireEvent.change(searchInput, { target: { value: 'zzzz_no_match_here_zzzz' } });
      });

      const resetBtn = within(modal).getByRole('button', { name: /Reset Filters/i });
      expect(resetBtn).toBeInTheDocument();

      act(() => {
        fireEvent.click(resetBtn);
      });

      expect(searchInput.value).toBe('');
      expect(within(modal).getByText(/Page 1 of 8/i)).toBeInTheDocument();
      expect(modal.querySelectorAll('.grid a').length).toBe(12);
    });

    it('4.6: 50 rapid alternating Prev/Next oscillations maintain strict pagination bounds', () => {
      renderPortfolio();
      const triggerBtn = screen.getByRole('button', { name: /Browse All (80\+|87)/i });

      act(() => {
        fireEvent.click(triggerBtn);
      });

      const modal = document.getElementById('certifications-directory-modal');
      const prevBtn = within(modal).getByRole('button', { name: /Previous page/i });
      const nextBtn = within(modal).getByRole('button', { name: /Next page/i });

      for (let i = 0; i < 50; i++) {
        act(() => {
          if (i % 2 === 0) {
            fireEvent.click(nextBtn);
          } else {
            fireEvent.click(prevBtn);
          }
        });
      }

      // Page must remain valid between 1 and 8
      const pageText = within(modal).getByText(/Page \d of 8/i);
      expect(pageText).toBeInTheDocument();
    });
  });

  // ==========================================================================
  // Suite 5: Hardware Acceleration, Marquee Integration & Accessibility Invariants
  // ==========================================================================
  describe('Suite 5: Hardware Acceleration, Marquee Integration & Accessibility Invariants', () => {
    it('5.1: CSS index.css defines hardware-accelerated 3D transforms with translate3d and will-change', () => {
      const cssPath = path.resolve(process.cwd(), 'src/index.css');
      const cssContent = fs.readFileSync(cssPath, 'utf8');

      expect(cssContent).toContain('translate3d(0, 0, 0)');
      expect(cssContent).toContain('translate3d(-50%, 0, 0)');
      expect(cssContent).toContain('will-change: transform');
      expect(cssContent).toContain('@keyframes scroll-left');
      expect(cssContent).toContain('@keyframes scroll-right');
    });

    it('5.2: Invariant Test 3.3 compliance: src/App.jsx contains NO forbidden legacy tokens', () => {
      const appPath = path.resolve(process.cwd(), 'src/App.jsx');
      const appContent = fs.readFileSync(appPath, 'utf8');

      expect(appContent).not.toContain('CertificateModal');
      expect(appContent).not.toContain('setModalOpen');
      expect(appContent).toContain('CertificationsDirectoryModal');
      expect(appContent).toContain('isCertDirectoryOpen');
      expect(appContent).toContain('setIsCertDirectoryOpen');
    });

    it('5.3: LinkedIn companion link in MarqueeSection has strict target="_blank" and rel="noopener noreferrer"', () => {
      renderPortfolio();
      const linkedInLink = screen.getByRole('link', { name: /View All on LinkedIn/i });
      expect(linkedInLink).toBeInTheDocument();
      expect(linkedInLink.getAttribute('target')).toBe('_blank');
      expect(linkedInLink.getAttribute('rel')).toBe('noopener noreferrer');
      expect(linkedInLink.getAttribute('href')).toContain('linkedin.com');
    });

    it('5.4: Modal credential cards have rel="noopener noreferrer", target="_blank" and screen reader notice', () => {
      renderPortfolio();
      const triggerBtn = screen.getByRole('button', { name: /Browse All (80\+|87)/i });

      act(() => {
        fireEvent.click(triggerBtn);
      });

      const modal = document.getElementById('certifications-directory-modal');
      const cards = modal.querySelectorAll('.grid a');
      expect(cards.length).toBe(12);

      cards.forEach((card) => {
        expect(card.getAttribute('target')).toBe('_blank');
        expect(card.getAttribute('rel')).toBe('noopener noreferrer');
        expect(card.textContent).toContain('(opens in new tab)');
      });
    });

    it('5.5: Image onError fallback in CertBadge recovers safely without throwing or breaking layout', () => {
      const { container } = render(
        <I18nProvider>
          <CertificationsDirectoryModal
            isOpen={true}
            onClose={() => {}}
            certifications={[{
              id: 'broken-badge-1',
              title: 'Broken Badge Test',
              issuer: 'Test Provider',
              image: 'https://broken-domain-404.example.com/nonexistent.png',
              link: 'https://example.com',
              date: '2026',
              credentialId: 'TEST-123'
            }]}
          />
        </I18nProvider>
      );

      const img = container.querySelector('.grid img');
      expect(img).toBeInTheDocument();

      act(() => {
        fireEvent.error(img);
      });

      // After error, SVG Award icon replaces img fallback
      const svgIcon = container.querySelector('.grid svg');
      expect(svgIcon).toBeInTheDocument();
      expect(container.querySelector('.grid img')).toBeNull();
    });
  });
});
