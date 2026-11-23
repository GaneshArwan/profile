/**
 * tests/e2e/tier_challenger_m3_2_fuzz_parity.test.jsx
 * Empirical Challenger 2: Schema Fuzzing, Locale Parity & Edge Case Verification
 * 
 * Personas Adopted:
 * - agency-model-qa-specialist (auditing data integrity, distributional edge cases, fuzzing)
 * - agency-code-reviewer (input validation boundaries, breaking API contracts, error boundaries)
 */

import { describe, it, expect, beforeEach } from 'vitest';
import React from 'react';
import { render, screen, act } from '@testing-library/react';
import * as schemas from '../../src/lib/schemas';
import * as constants from '../../src/data/constants';
import {
  translations,
  getTranslation,
  SUPPORTED_LOCALES,
  DEFAULT_LOCALE,
  I18nProvider,
  useI18n
} from '../../src/lib/i18n';

describe('Empirical Challenger 2: Schema Fuzzing & Locale Parity Suite', () => {

  // ==========================================================================
  // Suite 1: Schema Fuzzing & Boundary Testing (src/lib/schemas.js)
  // ==========================================================================
  describe('Suite 1: Project Payload & Schema Fuzzing', () => {
    const validProject = {
      id: 'rag-document-chat',
      title: 'RAG Document Chat',
      category: 'ai',
      flagship: true,
      description: 'Production-grade enterprise RAG pipeline with ChromaDB vector storage and dynamic chunking.',
      highlights: ['Dynamic chunking', 'ChromaDB vector store', 'Sub-200ms latency'],
      tech: ['Python', 'FastAPI', 'ChromaDB', 'Gemini API'],
      repoUrl: 'https://github.com/GaneshArwan/rag-document-chat',
      liveUrl: 'https://rag-demo.example.com',
      technicalIndicators: [
        { label: 'Latency', value: '180ms', type: 'latency' },
        { label: 'Accuracy', value: '98.5%', type: 'verification' }
      ],
      githubStats: {
        stars: 0,
        language: 'Python',
        topics: ['rag', 'chromadb', 'gemini']
      }
    };

    it('1.1 validates base project schema cleanly', () => {
      const result = schemas.projectSchema.safeParse(validProject);
      expect(result.success).toBe(true);
    });

    it('1.2 fuzzes projectSchema against primitive and corrupt payloads without throwing', () => {
      const hostilePayloads = [
        null,
        undefined,
        0,
        1,
        -1,
        '',
        'string',
        false,
        true,
        [],
        [validProject],
        {},
        NaN,
        Infinity,
        -Infinity,
        Symbol('hostile'),
        () => {},
        new Date(),
        /regex/
      ];

      for (const payload of hostilePayloads) {
        expect(() => schemas.projectSchema.safeParse(payload)).not.toThrow();
        const res = schemas.projectSchema.safeParse(payload);
        expect(res.success).toBe(false);
      }
    });

    it('1.3 enforces mandatory fields and fails when any single required field is missing', () => {
      const requiredFields = ['id', 'title', 'category', 'description', 'tech', 'repoUrl'];

      for (const field of requiredFields) {
        const copy = { ...validProject };
        delete copy[field];
        const res = schemas.projectSchema.safeParse(copy);
        expect(res.success, `Expected failure when omitting '${field}'`).toBe(false);
      }
    });

    it('1.4 rejects stringified numbers and non-integer values in numeric subfields', () => {
      // Stringified number in stars
      const stringifiedStars = {
        ...validProject,
        githubStats: { ...validProject.githubStats, stars: '0' }
      };
      expect(schemas.projectSchema.safeParse(stringifiedStars).success).toBe(false);

      // Float number in stars
      const floatStars = {
        ...validProject,
        githubStats: { ...validProject.githubStats, stars: 10.5 }
      };
      expect(schemas.projectSchema.safeParse(floatStars).success).toBe(false);

      // Negative number in stars
      const negativeStars = {
        ...validProject,
        githubStats: { ...validProject.githubStats, stars: -1 }
      };
      expect(schemas.projectSchema.safeParse(negativeStars).success).toBe(false);

      // Stringified forks
      const stringifiedForks = {
        ...validProject,
        githubStats: { ...validProject.githubStats, forks: '5' }
      };
      expect(schemas.projectSchema.safeParse(stringifiedForks).success).toBe(false);

      // Negative forks
      const negativeForks = {
        ...validProject,
        githubStats: { ...validProject.githubStats, forks: -2 }
      };
      expect(schemas.projectSchema.safeParse(negativeForks).success).toBe(false);
    });

    it('1.5 safely handles extra unexpected and prototype keys without crashing', () => {
      const payloadWithExtra = {
        ...validProject,
        extraProperty1: 'extra_value',
        extraNumeric: 99999,
        nestedCorrupt: { a: 1, b: null },
        maliciousScript: '<script>alert("xss")</script>',
        __proto__: { poisoned: true }
      };

      expect(() => schemas.projectSchema.safeParse(payloadWithExtra)).not.toThrow();
      const res = schemas.projectSchema.safeParse(payloadWithExtra);
      expect(res.success).toBe(true);
      // Extra properties should not poison prototype or break standard validation
      expect(res.data.id).toBe(validProject.id);
      expect(res.data.title).toBe(validProject.title);
    });

    it('1.6 enforces category enum strictly and provides descriptive error message', () => {
      const allowedCategories = ['ai', 'data', 'automation'];
      for (const cat of allowedCategories) {
        const res = schemas.projectSchema.safeParse({ ...validProject, category: cat });
        expect(res.success).toBe(true);
      }

      const invalidCategories = ['web3', 'crypto', 'mobile', 'fullstack', 'AI', 'DATA', '', null, undefined, 123];
      for (const cat of invalidCategories) {
        const res = schemas.projectSchema.safeParse({ ...validProject, category: cat });
        expect(res.success).toBe(false);
        const issues = res.error.issues;
        const catIssue = issues.find(i => i.path.includes('category'));
        expect(catIssue).toBeDefined();
        // Accepts either Zod 4 standard message or custom error map message
        expect(catIssue.message).toMatch(/(expected one of "ai"|"data"|"automation"|Category must be 'ai', 'data', or 'automation')/);
      }
    });

    it('1.7 tests description length boundary conditions (<10, 10, >10)', () => {
      // 9 characters -> fail
      const desc9 = { ...validProject, description: '123456789' };
      expect(schemas.projectSchema.safeParse(desc9).success).toBe(false);

      // 10 characters -> pass
      const desc10 = { ...validProject, description: '1234567890' };
      expect(schemas.projectSchema.safeParse(desc10).success).toBe(true);

      // Large 50,000 character string -> pass
      const descLarge = { ...validProject, description: 'A'.repeat(50000) };
      expect(schemas.projectSchema.safeParse(descLarge).success).toBe(true);
    });

    it('1.8 rejects dangerous protocols in repoUrl and liveUrl', () => {
      const dangerousProtocols = [
        'javascript:alert(1)',
        'data:text/html;base64,PHNjcmlwdD4=',
        'file:///C:/Windows/System32',
        'ftp://files.example.com/payload',
        'ws://realtime.example.com',
        'smb://internal/share'
      ];

      for (const url of dangerousProtocols) {
        const resRepo = schemas.projectSchema.safeParse({ ...validProject, repoUrl: url });
        expect(resRepo.success, `Expected dangerous repoUrl '${url}' to fail`).toBe(false);

        const resLive = schemas.projectSchema.safeParse({ ...validProject, liveUrl: url });
        expect(resLive.success, `Expected dangerous liveUrl '${url}' to fail`).toBe(false);
      }

      // Valid http and https protocols
      expect(schemas.projectSchema.safeParse({ ...validProject, repoUrl: 'http://example.com/repo' }).success).toBe(true);
      expect(schemas.projectSchema.safeParse({ ...validProject, repoUrl: 'https://example.com/repo' }).success).toBe(true);

      // Permissible liveUrl empty values
      expect(schemas.projectSchema.safeParse({ ...validProject, liveUrl: '' }).success).toBe(true);
      expect(schemas.projectSchema.safeParse({ ...validProject, liveUrl: null }).success).toBe(true);
      expect(schemas.projectSchema.safeParse({ ...validProject, liveUrl: undefined }).success).toBe(true);
    });

    it('1.9 fuzzes technicalIndicators array and indicators schema', () => {
      // Empty array passes
      expect(schemas.projectSchema.safeParse({ ...validProject, technicalIndicators: [] }).success).toBe(true);

      // Missing label fails
      const noLabel = {
        ...validProject,
        technicalIndicators: [{ value: '180ms', type: 'latency' }]
      };
      expect(schemas.projectSchema.safeParse(noLabel).success).toBe(false);

      // Missing value fails
      const noValue = {
        ...validProject,
        technicalIndicators: [{ label: 'Latency', type: 'latency' }]
      };
      expect(schemas.projectSchema.safeParse(noValue).success).toBe(false);

      // Invalid indicator type fails
      const invalidType = {
        ...validProject,
        technicalIndicators: [{ label: 'Metric', value: '100', type: 'invalid_enum' }]
      };
      expect(schemas.projectSchema.safeParse(invalidType).success).toBe(false);

      // All 6 valid indicator types pass
      const validTypes = ['architecture', 'latency', 'metric', 'security', 'verification', 'throughput'];
      for (const t of validTypes) {
        const res = schemas.projectSchema.safeParse({
          ...validProject,
          technicalIndicators: [{ label: 'Test', value: 'Pass', type: t }]
        });
        expect(res.success).toBe(true);
      }
    });

    it('1.10 rejects empty tech array and non-string tech elements', () => {
      // Empty tech array
      expect(schemas.projectSchema.safeParse({ ...validProject, tech: [] }).success).toBe(false);

      // Non-string elements in tech array
      expect(schemas.projectSchema.safeParse({ ...validProject, tech: [123, null] }).success).toBe(false);
      expect(schemas.projectSchema.safeParse({ ...validProject, tech: ['Valid', {}] }).success).toBe(false);
    });

    it('1.11 verifies all 7 production projects in constants.PROJECTS pass projectSchema', () => {
      expect(constants.PROJECTS.length).toBeGreaterThanOrEqual(7);
      constants.PROJECTS.forEach((proj, idx) => {
        const res = schemas.projectSchema.safeParse(proj);
        expect(res.success, `Production project index ${idx} ('${proj.title}') failed validation: ${JSON.stringify(res.error?.issues)}`).toBe(true);
      });
    });
  });

  // ==========================================================================
  // Suite 2: Bilingual Leaf-Key Parity & Structural Symmetry (src/lib/i18n.js)
  // ==========================================================================
  describe('Suite 2: Bilingual Leaf-Key Parity & Structural Symmetry', () => {
    function extractLeafKeys(obj, prefix = '') {
      let paths = [];
      for (const [key, val] of Object.entries(obj)) {
        const fullPath = prefix ? `${prefix}.${key}` : key;
        if (val !== null && typeof val === 'object' && !Array.isArray(val)) {
          paths = paths.concat(extractLeafKeys(val, fullPath));
        } else {
          paths.push(fullPath);
        }
      }
      return paths;
    }

    const enKeys = extractLeafKeys(translations.en).sort();
    const idKeys = extractLeafKeys(translations.id).sort();

    it('2.1 achieves 100% bidirectional leaf-key parity between en and id', () => {
      const missingInId = enKeys.filter(k => !idKeys.includes(k));
      const missingInEn = idKeys.filter(k => !enKeys.includes(k));

      expect(missingInId, `Missing in ID: ${missingInId.join(', ')}`).toEqual([]);
      expect(missingInEn, `Missing in EN: ${missingInEn.join(', ')}`).toEqual([]);
      expect(enKeys.length).toBe(idKeys.length);
      expect(enKeys.length).toBeGreaterThanOrEqual(60);
    });

    it('2.2 validates all leaf nodes across en and id are non-empty strings with matching types', () => {
      for (const key of enKeys) {
        const enVal = getTranslation(key, 'en');
        const idVal = getTranslation(key, 'id');

        expect(typeof enVal, `EN value at ${key} must be string`).toBe('string');
        expect(typeof idVal, `ID value at ${key} must be string`).toBe('string');
        expect(enVal.trim().length, `EN value at ${key} must not be whitespace`).toBeGreaterThan(0);
        expect(idVal.trim().length, `ID value at ${key} must not be whitespace`).toBeGreaterThan(0);
      }
    });

    it('2.3 guarantees 100% matching interpolation placeholder tokens across all keys', () => {
      const tokenRegex = /\{([a-zA-Z0-9_]+)\}/g;
      for (const key of enKeys) {
        const enVal = String(getTranslation(key, 'en'));
        const idVal = String(getTranslation(key, 'id'));

        const enTokens = (enVal.match(tokenRegex) || []).sort();
        const idTokens = (idVal.match(tokenRegex) || []).sort();

        expect(enTokens, `Placeholder tokens mismatch at ${key}`).toEqual(idTokens);
      }
    });

    it('2.4 verifies supported locales array contains exactly en and id', () => {
      expect(SUPPORTED_LOCALES).toEqual(['en', 'id']);
      expect(DEFAULT_LOCALE).toBe('en');
    });

    it('2.5 gracefully handles corrupted or adversary key paths in getTranslation', () => {
      const hostilePaths = [
        null,
        undefined,
        '',
        '   ',
        '..',
        '....',
        'hero.',
        '.hero',
        'hero..name',
        'constructor',
        '__proto__',
        'prototype',
        'toString',
        'valueOf',
        'hasOwnProperty',
        12345,
        {},
        [],
        true
      ];

      for (const path of hostilePaths) {
        expect(() => getTranslation(path, 'en')).not.toThrow();
        expect(() => getTranslation(path, 'id')).not.toThrow();
      }
    });

    it('2.6 falls back safely to default locale when unsupported or null locale is requested', () => {
      const testKey = 'hero.name';
      expect(getTranslation(testKey, 'fr')).toBe('William');
      expect(getTranslation(testKey, 'de')).toBe('William');
      expect(getTranslation(testKey, 'es')).toBe('William');
      expect(getTranslation(testKey, null)).toBe('William');
      expect(getTranslation(testKey, undefined)).toBe('William');
      expect(getTranslation(testKey, 123)).toBe('William');
    });
  });

  // ==========================================================================
  // Suite 3: Rapid Locale Toggling Stress Test & Provider Lifecycle
  // ==========================================================================
  describe('Suite 3: Rapid Locale Toggling & Stress Harness', () => {
    beforeEach(() => {
      if (typeof window !== 'undefined') {
        window.localStorage.clear();
      }
    });

    it('3.1 executes 1,000 rapid sequential getTranslation lookups across alternating locales without degradation', () => {
      const leafKeys = [
        'nav.home', 'nav.projects', 'nav.contact',
        'hero.greeting', 'hero.role', 'hero.badge',
        'about.title', 'experience.title', 'projects.title',
        'contact.title', 'contact.submitButton'
      ];

      const start = performance.now();
      for (let i = 0; i < 1000; i++) {
        const locale = i % 2 === 0 ? 'en' : 'id';
        const key = leafKeys[i % leafKeys.length];
        const val = getTranslation(key, locale);
        expect(typeof val).toBe('string');
        expect(val.length).toBeGreaterThan(0);
      }
      const elapsed = performance.now() - start;
      // 1000 lookups should easily finish under 100ms
      expect(elapsed).toBeLessThan(500);
    });

    it('3.2 survives 200 rapid reactive toggleLocale operations in React state without tearing or errors', () => {
      function StressToggleComponent() {
        const { locale, toggleLocale, isIndonesian, t } = useI18n();
        return (
          <div>
            <span data-testid="stress-locale">{locale}</span>
            <span data-testid="stress-is-id">{String(isIndonesian)}</span>
            <span data-testid="stress-greeting">{t('hero.greeting')}</span>
            <button data-testid="stress-toggle-btn" onClick={toggleLocale}>Toggle</button>
          </div>
        );
      }

      render(
        <I18nProvider>
          <StressToggleComponent />
        </I18nProvider>
      );

      const toggleBtn = screen.getByTestId('stress-toggle-btn');
      const localeEl = screen.getByTestId('stress-locale');
      const isIdEl = screen.getByTestId('stress-is-id');
      const greetingEl = screen.getByTestId('stress-greeting');

      expect(localeEl.textContent).toBe('en');
      expect(greetingEl.textContent).toBe("Hello, I'm");

      // 200 consecutive rapid toggles
      for (let i = 1; i <= 200; i++) {
        act(() => {
          toggleBtn.click();
        });

        const expectedLocale = i % 2 === 1 ? 'id' : 'en';
        const expectedIsId = i % 2 === 1 ? 'true' : 'false';
        const expectedGreeting = i % 2 === 1 ? 'Halo, saya' : "Hello, I'm";

        expect(localeEl.textContent).toBe(expectedLocale);
        expect(isIdEl.textContent).toBe(expectedIsId);
        expect(greetingEl.textContent).toBe(expectedGreeting);
      }

      // After 200 toggles (even number), we must be back to 'en'
      expect(localeEl.textContent).toBe('en');
      expect(isIdEl.textContent).toBe('false');
      expect(window.localStorage.getItem('portfolio_locale')).toBe('en');
    });

    it('3.3 setLocale safely rejects invalid locale arguments and functional updates without crashing', () => {
      function SetLocaleTestComponent() {
        const { locale, setLocale } = useI18n();
        return (
          <div>
            <span data-testid="curr-locale">{locale}</span>
            <button data-testid="set-invalid" onClick={() => setLocale('unsupported_locale')}>Set Bad</button>
            <button data-testid="set-null" onClick={() => setLocale(null)}>Set Null</button>
            <button data-testid="set-func" onClick={() => setLocale((p) => p === 'en' ? 'id' : 'en')}>Set Func</button>
          </div>
        );
      }

      render(
        <I18nProvider>
          <SetLocaleTestComponent />
        </I18nProvider>
      );

      const currLocale = screen.getByTestId('curr-locale');
      expect(currLocale.textContent).toBe('en');

      // Invalid string is ignored
      act(() => {
        screen.getByTestId('set-invalid').click();
      });
      expect(currLocale.textContent).toBe('en');

      // Null is ignored
      act(() => {
        screen.getByTestId('set-null').click();
      });
      expect(currLocale.textContent).toBe('en');

      // Functional update works
      act(() => {
        screen.getByTestId('set-func').click();
      });
      expect(currLocale.textContent).toBe('id');
    });
  });

  // ==========================================================================
  // Suite 4: Master Portfolio Store Validation & Helper Defensiveness
  // ==========================================================================
  describe('Suite 4: Portfolio Store Validation & Helper Utilities', () => {
    it('4.1 validatePortfolioData rejects empty or incomplete portfolio payloads', () => {
      const invalidStores = [
        {},
        { PERSONAL_INFO: constants.PERSONAL_INFO },
        { PERSONAL_INFO: constants.PERSONAL_INFO, EXPERIENCE: constants.EXPERIENCE },
        null,
        undefined
      ];

      for (const store of invalidStores) {
        const res = schemas.validatePortfolioData(store);
        expect(res.valid).toBe(false);
        expect(res.errors).toBeDefined();
      }
    });

    it('4.2 validatePortfolioData accepts lowercase legacy aliases (personalInfo, experience, projects)', () => {
      const lowerStore = {
        personalInfo: constants.PERSONAL_INFO,
        experience: constants.EXPERIENCE,
        projects: constants.PROJECTS
      };

      const res = schemas.validatePortfolioData(lowerStore);
      expect(res.valid).toBe(true);
    });

    it('4.3 assertValidPortfolio returns data object and executes cleanly in dev/prod modes', () => {
      const validStore = {
        PERSONAL_INFO: constants.PERSONAL_INFO,
        EXPERIENCE: constants.EXPERIENCE,
        PROJECTS: constants.PROJECTS,
        SKILL_CATEGORIES: constants.SKILL_CATEGORIES
      };

      const returned = schemas.assertValidPortfolio(validStore);
      expect(returned).toBe(validStore);
    });

    it('4.4 formatZodIssues handles empty, corrupt, and atypical Zod error issue structures', () => {
      expect(schemas.formatZodIssues([])).toEqual({});
      expect(schemas.formatZodIssues(null)).toEqual({});
      expect(schemas.formatZodIssues(undefined)).toEqual({});
      expect(schemas.formatZodIssues('error string')).toEqual({});

      const weirdIssues = [
        null,
        undefined,
        {},
        { path: ['fieldA'], message: 'Custom field error' },
        { path: [], message: 'Root level error' },
        { path: ['fieldA'], message: 'Duplicate field error should not overwrite' }
      ];

      const formatted = schemas.formatZodIssues(weirdIssues);
      expect(formatted.fieldA).toBe('Custom field error');
      // {} is processed before { path: [] }, assigning default 'Invalid value' to _general
      expect(formatted._general).toBeDefined();

      // Isolated root-level issue test
      const rootIssue = [{ path: [], message: 'Clean root error' }];
      expect(schemas.formatZodIssues(rootIssue)._general).toBe('Clean root error');
    });
  });
});
