/**
 * tests/e2e/adversarial_deep.test.jsx
 * Challenger 1 Iteration 2 Deep Adversarial Verification Suite
 */

import { describe, it, expect } from 'vitest';
import * as schemas from '../../src/lib/schemas';
import * as constants from '../../src/data/constants';

describe('Adversarial Deep Verification (Iteration 2 Challenger 1)', () => {

  describe('1. experienceItemSchema.description exhaustiveness', () => {
    const baseExp = {
      company: 'Kawan Lama Group',
      role: 'MDM Data Analyst Officer',
      period: '2024 - 2026',
      type: 'Full-time',
    };

    const rejectCases = [
      { val: null, name: 'null' },
      { val: undefined, name: 'undefined' },
      { val: '', name: 'empty string' },
      { val: '   ', name: 'spaces only' },
      { val: '\t\r\n   \n', name: 'tabs/newlines whitespace' },
      { val: {}, name: 'empty object {}' },
      { val: Object.create(null), name: 'Object.create(null)' },
      { val: [], name: 'empty array []' },
      { val: ['text'], name: 'array of text' },
      { val: 12345, name: 'number' },
      { val: NaN, name: 'NaN' },
      { val: Infinity, name: 'Infinity' },
      { val: true, name: 'boolean true' },
      { val: false, name: 'boolean false' },
      { val: () => {}, name: 'function' },
      { val: Symbol('desc'), name: 'Symbol' },
    ];

    for (const c of rejectCases) {
      it(`rejects invalid description: ${c.name}`, () => {
        const res = schemas.experienceItemSchema.safeParse({ ...baseExp, description: c.val });
        expect(res.success).toBe(false);
      });
    }

    const acceptCases = [
      { val: 'Valid string description here', name: 'standard non-empty string' },
      { val: '   Padded string with valid content   ', name: 'padded string' },
      { val: { type: 'div', props: {} }, name: 'mock React element' },
      { val: { $$typeof: Symbol.for('react.transitional.element'), type: 'div', props: {} }, name: 'React 19 element' },
      { val: (<div className="test"><p>JSX description</p></div>), name: 'live JSX element' },
    ];

    for (const c of acceptCases) {
      it(`accepts valid description: ${c.name}`, () => {
        const res = schemas.experienceItemSchema.safeParse({ ...baseExp, description: c.val });
        expect(res.success).toBe(true);
      });
    }
  });

  describe('2. formatZodIssues safety & crash immunity', () => {
    it('handles falsy and non-array arguments without throwing', () => {
      expect(schemas.formatZodIssues()).toEqual({});
      expect(schemas.formatZodIssues(undefined)).toEqual({});
      expect(schemas.formatZodIssues(null)).toEqual({});
      expect(schemas.formatZodIssues(0)).toEqual({});
      expect(schemas.formatZodIssues(false)).toEqual({});
      expect(schemas.formatZodIssues(12345)).toEqual({});
      expect(schemas.formatZodIssues('string')).toEqual({});
      expect(schemas.formatZodIssues({})).toEqual({});
      expect(schemas.formatZodIssues([])).toEqual({});
    });

    it('safely filters corrupted and malformed issue elements', () => {
      const corruptedIssues = [
        null,
        undefined,
        42,
        'not-an-object',
        {},
        { path: 'not-an-array', message: 'String path' },
        { path: null, message: 'Null path' },
        { path: ['name'], message: null },
        { path: ['email'], message: 'Valid email error' },
        { path: [], message: 'Root level error' },
      ];

      expect(() => schemas.formatZodIssues(corruptedIssues)).not.toThrow();
      const output = schemas.formatZodIssues(corruptedIssues);
      expect(output.email).toBe('Valid email error');
      expect(output.name).toBe('Invalid value');
      expect(output._general).toBeDefined();
    });
  });

  describe('3. validatePortfolioData options defensiveness', () => {
    it('handles null and weird options parameter without TypeError', () => {
      expect(() => schemas.validatePortfolioData({}, null)).not.toThrow();
      expect(() => schemas.validatePortfolioData({}, undefined)).not.toThrow();
      expect(() => schemas.validatePortfolioData({}, 42)).not.toThrow();
      expect(() => schemas.validatePortfolioData({}, 'strict')).not.toThrow();
      expect(() => schemas.validatePortfolioData({}, false)).not.toThrow();
      expect(() => schemas.validatePortfolioData(null, null)).not.toThrow();
      expect(() => schemas.validatePortfolioData(undefined, undefined)).not.toThrow();

      const res = schemas.validatePortfolioData({}, null);
      expect(res.valid).toBe(false);
      expect(res.errors).toBeDefined();
      expect(res.message).toContain('Portfolio data must include');
    });

    it('validates production constants with zero errors when options is null', () => {
      const res = schemas.validatePortfolioData({
        PERSONAL_INFO: constants.PERSONAL_INFO,
        EXPERIENCE: constants.EXPERIENCE,
        PROJECTS: constants.PROJECTS,
        SKILL_CATEGORIES: constants.SKILL_CATEGORIES,
      }, null);
      expect(res.valid).toBe(true);
    });
  });

  describe('4. contactFormSchema DoS prevention & RFC bounds', () => {
    it('enforces exact name boundaries (1, 2, 100, 101)', () => {
      const p = (name) => schemas.contactFormSchema.safeParse({ name, email: 'w@example.com', message: '1234567890' });
      expect(p('A').success).toBe(false);
      expect(p('Ab').success).toBe(true);
      expect(p('A'.repeat(100)).success).toBe(true);
      expect(p('A'.repeat(101)).success).toBe(false);
    });

    it('enforces exact message boundaries (9, 10, 5000, 5001)', () => {
      const p = (message) => schemas.contactFormSchema.safeParse({ name: 'William', email: 'w@example.com', message });
      expect(p('123456789').success).toBe(false);
      expect(p('1234567890').success).toBe(true);
      expect(p('M'.repeat(5000)).success).toBe(true);
      expect(p('M'.repeat(5001)).success).toBe(false);
    });

    it('enforces exact email RFC length boundary (254 vs 255)', () => {
      const email254 = `${'a'.repeat(64)}@${'b'.repeat(185)}.com`;
      expect(email254.length).toBe(254);
      const res254 = schemas.contactFormSchema.safeParse({ name: 'William', email: email254, message: '1234567890' });
      expect(res254.success).toBe(true);

      const email255 = `${'a'.repeat(64)}@${'b'.repeat(186)}.com`;
      expect(email255.length).toBe(255);
      const res255 = schemas.contactFormSchema.safeParse({ name: 'William', email: email255, message: '1234567890' });
      expect(res255.success).toBe(false);
    });

    it('enforces whitespace trimming and rejection of whitespace-only strings', () => {
      const p = (payload) => schemas.validateContactForm(payload);
      expect(p({ name: '   ', email: 'w@example.com', message: '1234567890' }).success).toBe(false);
      expect(p({ name: 'William', email: '   ', message: '1234567890' }).success).toBe(false);
      expect(p({ name: 'William', email: 'w@example.com', message: '          ' }).success).toBe(false);

      const validPadded = p({
        name: '  William  ',
        email: '  wiliamzwili135@gmail.com  ',
        message: '  Hello! Looking to discuss AI engineering opportunities.  '
      });
      expect(validPadded.success).toBe(true);
      expect(validPadded.data.name).toBe('William');
      expect(validPadded.data.email).toBe('wiliamzwili135@gmail.com');
      expect(validPadded.data.message).toBe('Hello! Looking to discuss AI engineering opportunities.');
    });
  });

  describe('5. Verified CV Data Layer Integrity', () => {
    it('verifies William Tarumanagara University education with GPA 3.89', () => {
      const edu = constants.PERSONAL_INFO.education[0];
      expect(edu.institution).toContain('Tarumanagara University');
      expect(edu.degree).toContain('Informatics');
      expect(edu.gpa).toBe('3.89 / 4.00');
      expect(edu.period).toBe('2021 – 2024');
    });

    it('verifies Kawan Lama Group experience with 5 MDM domains and Best Intern award', () => {
      const klg = constants.EXPERIENCE[0];
      expect(klg.company).toBe('Kawan Lama Group');
      expect(klg.role).toBe('Master Data Management Data Analyst Officer');
      expect(klg.period).toBe('Jan 2025 – Mar 2026');
      expect(klg.domains.length).toBe(5);

      const domainNames = klg.domains.map(d => d.name);
      expect(domainNames).toEqual(['Site', 'Vendor', 'Customer', 'Article', 'Finance']);

      const intern = constants.EXPERIENCE[1];
      expect(intern.type).toBe('Internship');
      expect(intern.award.title).toContain('Best Intern');
    });

    it('verifies 3 mandatory CV projects and standout projects (total 8)', () => {
      expect(constants.PROJECTS.length).toBe(8);
      const titles = constants.PROJECTS.map(p => p.title);
      expect(titles).toContain('RAG Document Chat');
      expect(titles).toContain('Autonomous Code Review Agent');
      expect(titles).toContain('AI Writing Assistant SaaS');

      for (const proj of constants.PROJECTS) {
        expect(proj.repoUrl).toMatch(/^https:\/\/github\.com\/GaneshArwan\//);
        expect(proj.tech.length).toBeGreaterThan(0);
      }
    });
  });
});
