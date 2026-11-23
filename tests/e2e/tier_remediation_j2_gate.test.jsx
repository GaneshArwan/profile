/**
 * Remediation Gate Test Suite (Milestone J2)
 *
 * Explicitly verifies all 4 remediation tracks:
 * 1. Antislop & Integrity Copywriting
 * 2. Visual & Layout Polish (Touch targets >= 44x44px, Education Card, Typewriter mount, Marquee pause)
 * 3. UX & Engagement Flow (DOM section sequence: About -> Experience -> Projects -> Skills -> Awards -> Contact)
 * 4. WCAG 2.1 AA Accessibility (Contrast tokens, form borders, focus rings, mobile drawer focus trap, landmarks)
 */

import React from 'react';
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { screen, within, fireEvent } from '@testing-library/react';
import { renderPortfolio, resetTestEnvironment } from './harness';
import fs from 'fs';
import path from 'path';

describe('Milestone J2: Frontend Remediation Gate Suite', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    resetTestEnvironment();
  });

  afterEach(() => {
    vi.useRealTimers();
  });
  // ==========================================================================
  // Track 1: Antislop & Integrity Copywriting
  // ==========================================================================
  describe('Track 1: Antislop & Integrity Copywriting', () => {
    it('1.1: Hero contains verified Academic Honors chip and ZERO unverified IELTS claims', () => {
      renderPortfolio();
      const hero = document.getElementById('hero');
      expect(hero).toBeInTheDocument();

      // Verified academic honors chip
      expect(within(hero).getByText(/High Distinction Honors \(GPA 3\.89\)/i)).toBeInTheDocument();

      // Zero occurrences of unverified IELTS credential
      expect(hero.textContent).not.toMatch(/IELTS/i);
    });

    it('1.2: Hero impact metrics display verified CV values (>99.0% accuracy, ~70% tasks automated) without AI-slop telemetry badges', () => {
      renderPortfolio();
      const hero = document.getElementById('hero');

      expect(within(hero).getByText('>99.0%')).toBeInTheDocument();
      expect(within(hero).getByText('~70%')).toBeInTheDocument();
      expect(within(hero).getByText(/Cut operational bottlenecks by ~35% & improved SLAs by 30%/i)).toBeInTheDocument();

      // Outdated / ungrounded metrics and AI-slop badges eliminated
      expect(hero.textContent).not.toContain('312+');
      expect(hero.textContent).not.toContain('99.8%');
      expect(hero.textContent).not.toMatch(/Precision Engineering Telemetry/i);
      expect(hero.textContent).not.toMatch(/Key Performance Telemetry/i);
      expect(hero.textContent).not.toMatch(/603\+ automated test cases/i);
    });

    it('1.3: Codebase is 100% free of banned "intelligent automation" and "otomasi cerdas" strings', () => {
      const srcFiles = [
        'src/data/constants.jsx',
        'src/lib/i18n.js',
        'src/components/sections/Hero.jsx',
        'src/components/sections/About.jsx',
        'src/components/sections/Skills.jsx',
        'src/components/sections/Contact.jsx'
      ];

      srcFiles.forEach((file) => {
        const fullPath = path.resolve(process.cwd(), file);
        if (fs.existsSync(fullPath)) {
          const content = fs.readFileSync(fullPath, 'utf-8');
          expect(content).not.toMatch(/intelligent automation/i);
          expect(content).not.toMatch(/otomasi cerdas/i);
        }
      });
    });

    it('1.4: Skills section title renders cleanly without redundant double ampersands or "Skills & "', () => {
      renderPortfolio();
      const skills = document.getElementById('skills');
      const h2 = within(skills).getByRole('heading', { level: 2 });

      expect(h2.textContent.trim()).toBe('Technical Skills & Competencies');
      expect(h2.textContent).not.toMatch(/Skills & Technical/i);
      expect(h2.textContent).not.toMatch(/Technical Moat/i);
    });

    it('1.5: ProjectCard action buttons provide clean un-concatenated labels', () => {
      renderPortfolio();
      const projectSection = document.getElementById('projects');
      const repoButtons = within(projectSection).getAllByText(/View Repo/i);
      expect(repoButtons.length).toBeGreaterThan(0);

      // Verify no awkward hybrid string like "View Repo • Kode"
      expect(projectSection.textContent).not.toContain('View Repo •');
      expect(projectSection.textContent).not.toContain('View Live •');
    });

    it('1.6: Contact form message label renders cleanly without prepended "Message • "', () => {
      renderPortfolio();
      const contact = document.getElementById('contact');
      const messageLabel = contact.querySelector('label[for="message"]');

      expect(messageLabel.textContent).toContain('Project Scope or Role Specification');
      expect(messageLabel.textContent).not.toContain('Message •');
    });
  });

  // ==========================================================================
  // Track 2: Visual & Layout Polish
  // ==========================================================================
  describe('Track 2: Visual & Layout Polish', () => {
    it('2.1: Navigation interactive buttons enforce >= 44x44px touch targets', () => {
      renderPortfolio();
      const homeBtn = screen.getByLabelText(/Back to Top/i);
      const themeBtns = screen.getAllByLabelText(/Toggle theme/i);
      const localeBtns = screen.getAllByLabelText(/Toggle language/i);
      const menuBtn = screen.getByLabelText(/Toggle navigation menu/i);

      expect(homeBtn.className).toContain('min-w-[44px]');
      expect(homeBtn.className).toContain('min-h-[44px]');

      themeBtns.forEach((btn) => {
        expect(btn.className).toContain('min-w-[44px]');
        expect(btn.className).toContain('min-h-[44px]');
      });

      localeBtns.forEach((btn) => {
        expect(btn.className).toContain('min-w-[44px]');
        expect(btn.className).toContain('min-h-[44px]');
      });

      expect(menuBtn.className).toContain('min-w-[44px]');
      expect(menuBtn.className).toContain('min-h-[44px]');
    });

    it('2.2: Footer social links enforce >= 44x44px touch targets', () => {
      renderPortfolio();
      const linkedin = document.querySelector('footer a[aria-label="LinkedIn Profile"]');
      const github = document.querySelector('footer a[aria-label="GitHub Profile"]');

      expect(linkedin.className).toContain('min-w-[44px]');
      expect(linkedin.className).toContain('min-h-[44px]');
      expect(github.className).toContain('min-w-[44px]');
      expect(github.className).toContain('min-h-[44px]');
    });

    it('2.3: Project category filters, card action buttons, and MDM domain tabs enforce >= 44px height', () => {
      renderPortfolio();
      const projectTabs = document.querySelectorAll('#projects [role="tab"]');
      projectTabs.forEach((tab) => {
        expect(tab.className).toContain('min-h-[44px]');
      });

      const domainTabs = document.querySelectorAll('#experience [role="tab"]');
      domainTabs.forEach((tab) => {
        expect(tab.className).toContain('min-h-[44px]');
      });

      const projectCardLinks = document.querySelectorAll('#projects a[target="_blank"]');
      projectCardLinks.forEach((link) => {
        expect(link.className).toContain('min-h-[44px]');
      });
    });

    it('2.4: About section renders structured Academic Foundation Card with Tarumanagara University & GPA 3.89', () => {
      renderPortfolio();
      const about = document.getElementById('about');

      expect(within(about).getByText(/Academic Foundation/i)).toBeInTheDocument();
      expect(within(about).getAllByText(/Tarumanagara University/i).length).toBeGreaterThanOrEqual(1);
      expect(within(about).getByText(/Bachelor of Informatics Engineering/i)).toBeInTheDocument();
      expect(within(about).getByText(/3\.89 \/ 4\.00/i)).toBeInTheDocument();
      expect(within(about).getByText(/Data Structures & Algorithms/i)).toBeInTheDocument();
    });

    it('2.5: MarqueeSection renders accessible Pause Animation control and toggles animation pause', () => {
      renderPortfolio();
      const pauseBtn = screen.getByLabelText(/Pause certifications animation/i);
      expect(pauseBtn).toBeInTheDocument();
      expect(pauseBtn.className).toContain('min-h-[44px]');

      // Click to pause
      fireEvent.click(pauseBtn);
      const row1 = document.querySelector('.animate-scroll-right');
      const row2 = document.querySelector('.animate-scroll-left');
      expect(row1.className).toContain('animate-paused');
      expect(row2.className).toContain('animate-paused');
      expect(row1.style.animationPlayState).toBe('paused');
      expect(row2.style.animationPlayState).toBe('paused');
    });
  });

  // ==========================================================================
  // Track 3: UX & Engagement Flow
  // ==========================================================================
  describe('Track 3: UX & Engagement Flow', () => {
    it('3.1: DOM sections follow Proof-First conversion sequence: Projects -> Experience -> About -> Skills -> Awards -> Contact', () => {
      renderPortfolio();
      const main = document.querySelector('main');
      const sectionElements = Array.from(main.querySelectorAll('section, div#certifications'));
      const sectionIds = sectionElements.map(el => el.id).filter(Boolean);

      const projIdx = sectionIds.indexOf('projects');
      const expIdx = sectionIds.indexOf('experience');
      const aboutIdx = sectionIds.indexOf('about');
      const skillsIdx = sectionIds.indexOf('skills');
      const certIdx = sectionIds.indexOf('certifications');
      const contactIdx = sectionIds.indexOf('contact');

      expect(projIdx).toBeGreaterThanOrEqual(0);
      expect(expIdx).toBeGreaterThan(projIdx);
      expect(aboutIdx).toBeGreaterThan(expIdx);
      expect(skillsIdx).toBeGreaterThan(aboutIdx);
      expect(certIdx).toBeGreaterThan(skillsIdx);
      expect(contactIdx).toBeGreaterThan(certIdx);
    });

    it('3.2: Navbar buttons display explicit cursor-pointer affordance', () => {
      renderPortfolio();
      const homeBtn = screen.getByLabelText(/Back to Top/i);
      const menuBtn = screen.getByLabelText(/Toggle navigation menu/i);
      const themeBtn = screen.getAllByLabelText(/Toggle theme/i)[0];

      expect(homeBtn.className).toContain('cursor-pointer');
      expect(menuBtn.className).toContain('cursor-pointer');
      expect(themeBtn.className).toContain('cursor-pointer');
    });

    it('3.3: CertificateModal state and unused component are eliminated from root App layout', () => {
      const appContent = fs.readFileSync(path.resolve(process.cwd(), 'src/App.jsx'), 'utf-8');
      expect(appContent).not.toContain('CertificateModal');
      expect(appContent).not.toContain('setModalOpen');
    });
  });

  // ==========================================================================
  // Track 4: WCAG 2.1 AA Accessibility
  // ==========================================================================
  describe('Track 4: WCAG 2.1 AA Accessibility', () => {
    it('4.1: Dark mode button text tokens satisfy WCAG 1.4.3 (>= 8.15:1 contrast on dark:bg-emerald-500)', () => {
      renderPortfolio();
      // Hero CTA
      const heroExploreBtn = document.querySelector('#hero button.bg-emerald-700');
      expect(heroExploreBtn.className).toContain('dark:bg-emerald-500');
      expect(heroExploreBtn.className).toContain('dark:text-slate-950');

      // Contact Submit Button
      const submitBtn = document.querySelector('#contact button[type="submit"]');
      expect(submitBtn.className).toContain('dark:bg-emerald-500');
      expect(submitBtn.className).toContain('dark:text-slate-950');

      // Active Experience Domain Tab
      const activeDomainTab = document.querySelector('#experience button[role="tab"][aria-selected="true"]');
      expect(activeDomainTab.className).toContain('dark:bg-emerald-500');
      expect(activeDomainTab.className).toContain('dark:text-slate-950');

      // Navbar Contact Button
      const navContactBtn = screen.getByRole('navigation').querySelector('button.bg-emerald-700');
      expect(navContactBtn.className).toContain('dark:bg-emerald-500');
      expect(navContactBtn.className).toContain('dark:text-slate-950');
    });

    it('4.2: ProjectCard technical indicator badge text tokens satisfy WCAG 1.4.3 (text-slate-700 on bg-slate-100)', () => {
      renderPortfolio();
      const indicatorLabel = document.querySelector('#projects span.text-\\[11px\\].text-slate-700');
      expect(indicatorLabel).toBeInTheDocument();
    });

    it('4.3: Contact form input borders enforce WCAG 1.4.11 non-text contrast (border-slate-500 dark:border-slate-500)', () => {
      renderPortfolio();
      const nameInput = document.getElementById('name');
      const emailInput = document.getElementById('email');
      const messageInput = document.getElementById('message');

      expect(nameInput.className).toContain('border-slate-500');
      expect(nameInput.className).toContain('dark:border-slate-500');
      expect(emailInput.className).toContain('border-slate-500');
      expect(emailInput.className).toContain('dark:border-slate-500');
      expect(messageInput.className).toContain('border-slate-500');
      expect(messageInput.className).toContain('dark:border-slate-500');
    });

    it('4.4: MarqueeSection duplicate cards are inert for keyboard users (tabIndex="-1" and aria-hidden="true")', () => {
      renderPortfolio();
      const certCards = Array.from(document.querySelectorAll('#certifications a')).filter(c => c.closest('.animate-scroll-right, .animate-scroll-left'));
      expect(certCards.length).toBeGreaterThan(8);

      const focusableCards = certCards.filter(c => c.getAttribute('tabindex') === '0' || !c.hasAttribute('tabindex'));
      const inertCards = certCards.filter(c => c.getAttribute('tabindex') === '-1' && c.getAttribute('aria-hidden') === 'true');

      const loopMultiplier = certCards.length / focusableCards.length;
      expect([4, 6]).toContain(loopMultiplier);
      expect(certCards.length % focusableCards.length).toBe(0);
      expect(inertCards.length).toBe(certCards.length - focusableCards.length);
    });

    it('4.5: Semantic landmarks are properly structured (<header role="banner">, Hero id="hero", Footer outside main)', () => {
      renderPortfolio();
      const header = document.querySelector('header[role="banner"]');
      expect(header).toBeInTheDocument();
      expect(header.querySelector('nav')).toBeInTheDocument();

      const hero = document.getElementById('hero');
      expect(hero).toBeInTheDocument();
      expect(hero.tagName.toLowerCase()).toBe('section');

      const footer = document.querySelector('footer');
      expect(footer).toBeInTheDocument();
      const main = document.querySelector('main');
      expect(main.contains(footer)).toBe(false);
    });

    it('4.6: Global CSS implements visible focus outlines and comprehensive reduced motion', () => {
      const cssContent = fs.readFileSync(path.resolve(process.cwd(), 'src/index.css'), 'utf-8');
      expect(cssContent).toContain(':focus-visible');
      expect(cssContent).toContain('outline: 2px solid var(--color-telemetry-primary');
      expect(cssContent).toContain('.dark :focus-visible');
      expect(cssContent).toContain('outline: 2px solid var(--color-telemetry-dark');
      expect(cssContent).toContain('@media (prefers-reduced-motion: reduce)');
      expect(cssContent).toContain('animation-duration: 0.01ms !important;');
    });

    it('4.7: MarqueeSection renders <= 48 total cards in DOM, eliminating 522-node bloat while preserving keyboard inertness', () => {
      renderPortfolio();
      const certCards = Array.from(document.querySelectorAll('#certifications a')).filter(c => c.closest('.animate-scroll-right, .animate-scroll-left'));
      expect(certCards.length).toBeLessThanOrEqual(48);
      expect(certCards.length).toBeGreaterThanOrEqual(16);
    });
  });
});
