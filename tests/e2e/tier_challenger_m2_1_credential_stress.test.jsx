/**
 * tests/e2e/tier_challenger_m2_1_credential_stress.test.jsx
 * 
 * Milestone 2 (M2) Adversarial Challenger 1 Test Suite
 * Archetype: Empirical Challenger (critic, specialist)
 * 
 * Objectives:
 * 1. Conduct empirical, adversarial verification of credential preservation and content truthfulness:
 *    - Untar S1 Informatics with GPA 3.89 / 4.00 High Distinction (years 2021–2024).
 *    - Role title strictly "Data & Automation Analyst" across all strings/labels (zero "AI Engineer" regressions).
 *    - Kawan Lama Group MDM officer experience accurately reflected.
 *    - Best Intern distinction accurately linked/badged.
 * 2. Adversarially stress-test string matching, regex searches, and case sensitivity across Hero.jsx, About.jsx, and Skills.jsx.
 * 3. Verify invariants: #hero button.bg-emerald-700, zero rainbow tokens (indigo/violet/cyan), bracketed indicators.
 * 4. Interactive telemetry console hover ergonomics and rapid state fuzzing.
 */

import React from 'react';
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { render, screen, fireEvent, within } from '@testing-library/react';
import fs from 'fs';
import path from 'path';

import { Hero } from '../../src/components/sections/Hero';
import { About } from '../../src/components/sections/About';
import { Skills } from '../../src/components/sections/Skills';
import { I18nProvider } from '../../src/lib/i18n';
import { PERSONAL_INFO, SKILL_CATEGORIES } from '../../src/data/constants';

// Helper function to render under a specific locale
function renderWithLocale(element, locale = 'en') {
  window.localStorage.setItem('portfolio_locale', locale);
  return render(
    <I18nProvider>
      {element}
    </I18nProvider>
  );
}

describe('Empirical Challenger 1: Milestone 2 Adversarial Stress Suite', () => {

  beforeEach(() => {
    window.localStorage.clear();
    vi.clearAllMocks();
  });

  afterEach(() => {
    window.localStorage.clear();
    vi.restoreAllMocks();
  });

  // ==========================================================================
  // Suite 1: Credential Preservation & Content Truthfulness (Factual Invariants)
  // ==========================================================================
  describe('Suite 1: Credential Preservation & Factual Invariants', () => {

    it('1.1 [Hero]: Role title is strictly "Data & Automation Analyst" with zero "AI Engineer" corporate titles', () => {
      const { container } = renderWithLocale(<Hero />, 'en');
      
      // H2 Role Heading
      const heroRoleHeading = container.querySelector('#hero h2');
      expect(heroRoleHeading).toBeInTheDocument();
      expect(heroRoleHeading.textContent).toBe('Data & Automation Analyst');

      // Check that NO heading or element claims corporate "AI Engineer"
      const allHeadings = container.querySelectorAll('h1, h2, h3, h4, p, span');
      allHeadings.forEach((el) => {
        expect(el.textContent).not.toMatch(/^AI Engineer$/i);
        expect(el.textContent).not.toMatch(/^Senior AI Engineer$/i);
        expect(el.textContent).not.toMatch(/^Corporate AI Engineer$/i);
      });
    });

    it('1.2 [Hero]: Role title in Indonesian locale strictly renders "Data & Automation Analyst"', () => {
      const { container } = renderWithLocale(<Hero />, 'id');
      const heroRoleHeading = container.querySelector('#hero h2');
      expect(heroRoleHeading).toBeInTheDocument();
      expect(heroRoleHeading.textContent).toBe('Data & Automation Analyst');
    });

    it('1.3 [About]: Academic Foundation preserves Untar S1 Informatics with GPA 3.89, High Distinction, and 2021–2024', () => {
      const { container } = renderWithLocale(<About />, 'en');
      
      const aboutSection = container.querySelector('#about');
      expect(aboutSection).toBeInTheDocument();

      // Untar Institution present in both bio and academic card
      const untarMatches = within(aboutSection).getAllByText(/Tarumanagara University/i);
      expect(untarMatches.length).toBeGreaterThanOrEqual(1);

      // Degree
      const degreeMatches = within(aboutSection).getAllByText(/Informatics Engineering/i);
      expect(degreeMatches.length).toBeGreaterThanOrEqual(1);

      // GPA 3.89
      const gpaMatches = within(aboutSection).getAllByText(/3\.89/);
      expect(gpaMatches.length).toBeGreaterThanOrEqual(1);

      // Period 2021 – 2024
      const periodMatches = within(aboutSection).getAllByText(/2021\s*[–-]\s*2024/);
      expect(periodMatches.length).toBeGreaterThanOrEqual(1);

      // High Distinction
      const distinctionMatches = within(aboutSection).getAllByText(/High Distinction/i);
      expect(distinctionMatches.length).toBeGreaterThanOrEqual(1);
    });

    it('1.4 [About]: Academic Foundation in Indonesian preserves Untar S1, IPK 3.89, Pujian Tertinggi, and 2021–2024', () => {
      const { container } = renderWithLocale(<About />, 'id');
      
      const aboutSection = container.querySelector('#about');
      expect(aboutSection).toBeInTheDocument();

      const untarMatches = within(aboutSection).getAllByText(/Universitas Tarumanagara/i);
      expect(untarMatches.length).toBeGreaterThanOrEqual(1);

      const degreeMatches = within(aboutSection).getAllByText(/Teknik Informatika/i);
      expect(degreeMatches.length).toBeGreaterThanOrEqual(1);

      const gpaMatches = within(aboutSection).getAllByText(/3\.89/);
      expect(gpaMatches.length).toBeGreaterThanOrEqual(1);

      const periodMatches = within(aboutSection).getAllByText(/2021\s*[–-]\s*2024/);
      expect(periodMatches.length).toBeGreaterThanOrEqual(1);

      const distinctionMatches = within(aboutSection).getAllByText(/Pujian Tertinggi/i);
      expect(distinctionMatches.length).toBeGreaterThanOrEqual(1);
    });

    it('1.5 [Hero]: Credential chips reflect [EDU] Untar S1 3.89, [MDM] Kawan Lama Group, [AWARD] Best Intern, and [HONORS] High Distinction', () => {
      const { container } = renderWithLocale(<Hero />, 'en');
      
      const credentialList = container.querySelector('[role="list"][aria-label="Professional and Academic Credentials"]');
      expect(credentialList).toBeInTheDocument();

      const items = within(credentialList).getAllByRole('listitem');
      expect(items).toHaveLength(4);

      // Check textContent and bracketed prefixes
      expect(items[0].textContent).toContain('[EDU]');
      expect(items[0].textContent).toContain('Untar S1 3.89');
      expect(items[0].getAttribute('aria-label')).toBe('Education: Tarumanagara University Informatics, GPA 3.89');

      expect(items[1].textContent).toContain('[MDM]');
      expect(items[1].textContent).toContain('Kawan Lama Group');
      expect(items[1].getAttribute('aria-label')).toBe('Experience: Kawan Lama Group Master Data Management Officer');

      expect(items[2].textContent).toContain('[AWARD]');
      expect(items[2].textContent).toContain('Best Intern');
      expect(items[2].getAttribute('aria-label')).toBe('Distinction: Awarded Best Intern at Kawan Lama Group');

      expect(items[3].textContent).toContain('[HONORS]');
      expect(items[3].textContent).toContain('High Distinction Honors (GPA 3.89)');
      expect(items[3].getAttribute('aria-label')).toBe('Academic Honors: High Distinction GPA 3.89');
    });

    it('1.6 [Hero]: Indonesian credential chips preserve [EDU], [MDM], [AWARD], [HONORS] with authentic localized labels', () => {
      const { container } = renderWithLocale(<Hero />, 'id');
      
      const credentialList = container.querySelector('[role="list"][aria-label="Professional and Academic Credentials"]');
      const items = within(credentialList).getAllByRole('listitem');

      expect(items[0].textContent).toContain('[EDU]');
      expect(items[0].textContent).toContain('Untar S1 IPK 3.89');

      expect(items[1].textContent).toContain('[MDM]');
      expect(items[1].textContent).toContain('Kawan Lama Group');

      expect(items[2].textContent).toContain('[AWARD]');
      expect(items[2].textContent).toContain('Penerima Best Intern');

      expect(items[3].textContent).toContain('[HONORS]');
      expect(items[3].textContent).toContain('Lulusan Berpredikat Pujian (IPK 3.89)');
    });

    it('1.7 [Hero]: Telemetry console accurately reflects Kawan Lama MDM across 5 core enterprise domains', () => {
      renderWithLocale(<Hero />, 'en');
      
      expect(screen.getByText('Kawan Lama MDM')).toBeInTheDocument();
      expect(screen.getByText('>99.0%')).toBeInTheDocument();
      expect(screen.getByText(/Across 5 core domains: Site, Vendor, Customer, Article, Finance/i)).toBeInTheDocument();
      expect(screen.getByText('~70%')).toBeInTheDocument();
      expect(screen.getByText(/Cut operational bottlenecks by ~35% & improved SLAs by 30%/i)).toBeInTheDocument();
    });
  });

  // ==========================================================================
  // Suite 2: Adversarial String Matching, Regex Searches & Forbidden Token Audits
  // ==========================================================================
  describe('Suite 2: Adversarial String Matching & Rainbow Token Elimination', () => {

    const targetFiles = [
      path.resolve(__dirname, '../../src/components/sections/Hero.jsx'),
      path.resolve(__dirname, '../../src/components/sections/About.jsx'),
      path.resolve(__dirname, '../../src/components/sections/Skills.jsx'),
    ];

    it('2.1: Target files contain ZERO occurrences of forbidden rainbow tokens (indigo, violet, cyan)', () => {
      const forbiddenTokens = ['indigo', 'violet', 'cyan'];
      
      targetFiles.forEach((filePath) => {
        expect(fs.existsSync(filePath)).toBe(true);
        const content = fs.readFileSync(filePath, 'utf-8');

        forbiddenTokens.forEach((token) => {
          const regex = new RegExp(`\\b${token}[-\\d]*\\b`, 'gi');
          const matches = content.match(regex);
          expect(matches, `Found forbidden token '${token}' in ${path.basename(filePath)}: ${matches}`).toBeNull();
        });
      });
    });

    it('2.2: Target files contain ZERO un-prefixed text-emerald-500 or solid light bg-emerald-500 (WCAG AA Contrast Invariant)', () => {
      targetFiles.forEach((filePath) => {
        const content = fs.readFileSync(filePath, 'utf-8');
        
        // Find text-emerald-500 not preceded by dark:
        const unPrefixedText500 = content.match(/(?<!dark:)text-emerald-500\b/g);
        expect(unPrefixedText500, `Found un-prefixed text-emerald-500 in ${path.basename(filePath)}`).toBeNull();

        // Find bg-emerald-500 not preceded by dark:
        // Exclude small decoration dots like rounded-full bg-emerald-500/80 in window header dots if explicitly allowed
        const unPrefixedBg500 = content.match(/(?<!dark:)bg-emerald-500(?!\/)\b/g);
        expect(unPrefixedBg500, `Found un-prefixed bg-emerald-500 in ${path.basename(filePath)}`).toBeNull();
      });
    });

    it('2.3: Hero retains #hero button.bg-emerald-700 invariant light mode CTA button', () => {
      const { container } = renderWithLocale(<Hero />, 'en');
      
      const ctaButton = container.querySelector('#hero button.bg-emerald-700');
      expect(ctaButton).toBeInTheDocument();
      expect(ctaButton.className).toContain('hover:bg-emerald-800');
      expect(ctaButton.className).toContain('text-white');
      expect(ctaButton.className).toContain('dark:bg-emerald-500');
      expect(ctaButton.className).toContain('dark:text-slate-950');
    });

    it('2.4: Hero bracketed badges match strict bracket regex ^\\[(EDU|MDM|AWARD|HONORS)\\]', () => {
      const { container } = renderWithLocale(<Hero />, 'en');
      const listItems = container.querySelectorAll('[role="listitem"]');

      expect(listItems.length).toBeGreaterThanOrEqual(4);
      listItems.forEach((item) => {
        const text = item.textContent.trim();
        expect(text).toMatch(/^\[(EDU|MDM|AWARD|HONORS)\]/);
      });
    });

    it('2.5: About 3-Pillar Data Governance Doctrine badges match strict bracket regex ^\\[0[1-3] [A-Z ]+\\]', () => {
      renderWithLocale(<About />, 'en');
      
      const doctrineBadges = [
        '[01 STAGING]',
        '[02 RPA EXEC]',
        '[03 APPLIED AI]'
      ];

      doctrineBadges.forEach((badge) => {
        expect(screen.getByText(badge)).toBeInTheDocument();
      });
    });
  });

  // ==========================================================================
  // Suite 3: Skills Matrix Case Sensitivity & Level Containment Stress
  // ==========================================================================
  describe('Suite 3: Skills Matrix Case Sensitivity & Contract Verification', () => {

    it('3.1: All 22 skills satisfy card.textContent.includes(skill.level) case-insensitively AND contain exact title', () => {
      renderWithLocale(<Skills />, 'en');
      
      const allSkills = SKILL_CATEGORIES.flatMap((c) => c.skills);
      expect(allSkills.length).toBe(22);

      allSkills.forEach((skill) => {
        // Find skill heading
        const heading = screen.getByRole('heading', { level: 4, name: skill.name });
        expect(heading).toBeInTheDocument();

        // Ancestor card item container
        const card = heading.closest('.flex.items-start');
        expect(card).toBeInTheDocument();

        // Test exact case containment for backward compatibility with tests
        expect(card.textContent).toContain(skill.level);

        // Test bracketed uppercase presentation
        const bracketedLevel = `[${skill.level}]`;
        expect(card.textContent).toContain(bracketedLevel);

        // Test production context description display
        if (skill.context) {
          expect(card.textContent).toContain(skill.context);
        }
      });
    });

    it('3.2: Skills component handles image onError gracefully without uncaught exceptions or loop', () => {
      const { container } = renderWithLocale(<Skills />, 'en');
      
      const images = container.querySelectorAll('img');
      expect(images.length).toBe(22);

      images.forEach((img) => {
        // Trigger error event
        expect(() => {
          fireEvent.error(img);
        }).not.toThrow();

        // Verify fallback URL assigned
        expect(img.src).toBe('https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg');

        // Trigger error AGAIN on fallback to ensure no infinite loop
        expect(() => {
          fireEvent.error(img);
        }).not.toThrow();
        expect(img.src).toBe('https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg');
      });
    });

    it('3.3: 4 Competency categories display distinct operational tier badges', () => {
      renderWithLocale(<Skills />, 'en');
      
      expect(screen.getByText('DOMINANT TIER // INFRASTRUCTURE')).toBeInTheDocument();
      expect(screen.getByText('SUPPORTING TIER // INTELLIGENCE')).toBeInTheDocument();
      expect(screen.getByText('DOMINANT TIER // AUTOMATION')).toBeInTheDocument();
      expect(screen.getByText('SUPPORTING TIER // INTERFACES')).toBeInTheDocument();
    });
  });

  // ==========================================================================
  // Suite 4: Telemetry Console Hover Interaction & Rapid State Fuzzing
  // ==========================================================================
  describe('Suite 4: Telemetry Console Interactive Affordance & State Fuzzing', () => {

    it('4.1: Default state displays static telemetry status and SLA indicator', () => {
      renderWithLocale(<Hero />, 'en');
      
      expect(screen.getByText(/Hover metric for subsystem telemetry/i)).toBeInTheDocument();
      expect(screen.getByText('VERIFIED // SLA 30%')).toBeInTheDocument();
      expect(screen.getByText(/● TELEMETRY \/\/ ENTERPRISE MDM & AUTOMATION/i)).toBeInTheDocument();
      expect(screen.getByText('LIVE STATUS')).toBeInTheDocument();
    });

    it('4.2: Hovering on each metric updates the inspection footer protocol and subsystem', () => {
      renderWithLocale(<Hero />, 'en');
      
      const metricsData = [
        {
          tag: 'Kawan Lama MDM',
          expectedFooterText: 'Kawan Lama MDM: 5 Governed Domains',
          expectedProtocol: 'GWS SHEETS // SAP GUI'
        },
        {
          tag: 'Code Review Agent',
          expectedFooterText: 'Code Review Agent: Multi-Agent State Graph',
          expectedProtocol: 'LANGGRAPH // GEMINI FLASH'
        },
        {
          tag: 'RAG Document Chat',
          expectedFooterText: 'RAG Document Chat: Vector Similarity & Cache',
          expectedProtocol: 'REDIS HASH // CHROMADB'
        },
        {
          tag: 'Workflow & SAP RPA',
          expectedFooterText: 'Workflow & SAP RPA: Batch Job Automation',
          expectedProtocol: 'APPS SCRIPT // SAP VBSCRIPT'
        }
      ];

      metricsData.forEach(({ tag, expectedFooterText, expectedProtocol }) => {
        const tagElement = screen.getByText(tag);
        const card = tagElement.closest('.cursor-default');
        expect(card).toBeInTheDocument();

        // Mouse enter
        fireEvent.mouseEnter(card);
        expect(screen.getByText(expectedFooterText)).toBeInTheDocument();
        expect(screen.getByText(expectedProtocol)).toBeInTheDocument();

        // Mouse leave
        fireEvent.mouseLeave(card);
        expect(screen.getByText(/Hover metric for subsystem telemetry/i)).toBeInTheDocument();
        expect(screen.getByText('VERIFIED // SLA 30%')).toBeInTheDocument();
      });
    });

    it('4.3: Keyboard focus and blur on metric cards update footer inspectably (Accessibility WCAG 2.1)', () => {
      renderWithLocale(<Hero />, 'en');
      
      const tagElement = screen.getByText('Code Review Agent');
      const card = tagElement.closest('.cursor-default');
      expect(card).toBeInTheDocument();

      // Focus
      fireEvent.focus(card);
      expect(screen.getByText('Code Review Agent: Multi-Agent State Graph')).toBeInTheDocument();
      expect(screen.getByText('LANGGRAPH // GEMINI FLASH')).toBeInTheDocument();

      // Blur
      fireEvent.blur(card);
      expect(screen.getByText(/Hover metric for subsystem telemetry/i)).toBeInTheDocument();
      expect(screen.getByText('VERIFIED // SLA 30%')).toBeInTheDocument();
    });

    it('4.4: 100 rapid alternating hover oscillations execute cleanly without state corruption', () => {
      renderWithLocale(<Hero />, 'en');
      
      const tag1 = screen.getByText('Kawan Lama MDM').closest('.cursor-default');
      const tag2 = screen.getByText('Workflow & SAP RPA').closest('.cursor-default');

      for (let i = 0; i < 50; i++) {
        fireEvent.mouseEnter(tag1);
        fireEvent.mouseLeave(tag1);
        fireEvent.mouseEnter(tag2);
        fireEvent.mouseLeave(tag2);
      }

      // After 100 cycles, state cleanly returns to baseline
      expect(screen.getByText(/Hover metric for subsystem telemetry/i)).toBeInTheDocument();
      expect(screen.getByText('VERIFIED // SLA 30%')).toBeInTheDocument();
    });
  });

  // ==========================================================================
  // Suite 5: Indonesian Locale Parity & Responsive Layout Stress
  // ==========================================================================
  describe('Suite 5: Indonesian Locale Parity across Hero, About & Skills', () => {

    it('5.1: Hero displays authentic Indonesian telemetry labels and greeting', () => {
      renderWithLocale(<Hero />, 'id');
      
      expect(screen.getByText(/Akurasi Master Data/i)).toBeInTheDocument();
      expect(screen.getByText(/Skala Diff-Chunking/i)).toBeInTheDocument();
      expect(screen.getByText(/Latensi Cache Vektor/i)).toBeInTheDocument();
      expect(screen.getByText(/Otomasi Tugas Repetitif/i)).toBeInTheDocument();
      expect(screen.getByText(/Dampak & Tolok Ukur Utama/i)).toBeInTheDocument();
      expect(screen.getByText(/Arahkan kursor untuk inspeksi subsistem/i)).toBeInTheDocument();
    });

    it('5.2: About 3-cell bento displays authentic Indonesian translations and 3 Pillars', () => {
      renderWithLocale(<About />, 'id');
      
      expect(screen.getByText('Doktrin Tata Kelola & Otomasi')).toBeInTheDocument();
      expect(screen.getByText('Staging Terkelola & Validasi Awal')).toBeInTheDocument();
      expect(screen.getByText('Eksekusi Otomasi RPA SAP')).toBeInTheDocument();
      expect(screen.getByText('Augmentasi Workflow Berbasis AI')).toBeInTheDocument();
      expect(screen.getByText('Fondasi Akademik')).toBeInTheDocument();
      expect(screen.getByText('Universitas Tarumanagara (Untar)')).toBeInTheDocument();
    });

    it('5.3: Skills displays authentic Indonesian category headings', () => {
      renderWithLocale(<Skills />, 'id');
      
      expect(screen.getByText('Data Warehousing & Analisis')).toBeInTheDocument();
      expect(screen.getByText('AI & Sistem LLM Otonom')).toBeInTheDocument();
      expect(screen.getByText('Otomasi & Integrasi Enterprise')).toBeInTheDocument();
      expect(screen.getByText('Rekayasa Frontend & Tooling')).toBeInTheDocument();
    });
  });

});
