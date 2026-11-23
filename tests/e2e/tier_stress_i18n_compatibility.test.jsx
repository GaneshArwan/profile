/**
 * tests/e2e/i18n_and_compatibility.test.jsx
 * Adversarial Stress Test Suite for i18n & Data Layer Dual-Compatibility
 * Milestone M1 Empirical Verification
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import React from 'react';
import { render, screen, act, renderHook } from '@testing-library/react';
import { 
  getTranslation, 
  translations, 
  SUPPORTED_LOCALES, 
  DEFAULT_LOCALE,
  I18nProvider,
  useI18n
} from '../../src/lib/i18n';
import { 
  PERSONAL_INFO, 
  EXPERIENCE, 
  PROJECTS, 
  SKILLS, 
  CERTIFICATIONS,
  REMOTE_BACKGROUNDS,
  LOCAL_BACKGROUNDS,
  HERO_VIDEOS
} from '../../src/data/constants';

describe('Adversarial Stress Suite: i18n & Data Compatibility', () => {

  // ==========================================================================
  // Section 1: Deep Dot-Path Resolution & Adversarial Inputs
  // ==========================================================================
  describe('1. Deep Dot-Path Resolution (getTranslation)', () => {
    it('1.1 resolves standard single-level and multi-level paths correctly', () => {
      expect(getTranslation('hero.greeting', 'en')).toBe("Hello, I'm");
      expect(getTranslation('hero.greeting', 'id')).toBe("Halo, saya");
      expect(getTranslation('experience.domains.site.name', 'en')).toBe("Site");
      expect(getTranslation('experience.domains.site.name', 'id')).toBe("Site");
    });

    it('1.2 returns keyPath verbatim when key is missing at root level', () => {
      expect(getTranslation('nonexistent_root', 'en')).toBe('nonexistent_root');
      expect(getTranslation('unknownKey', 'id')).toBe('unknownKey');
    });

    it('1.3 returns keyPath verbatim when key is missing in deep nested hierarchy without throwing', () => {
      expect(getTranslation('hero.missing.deep.path', 'en')).toBe('hero.missing.deep.path');
      expect(getTranslation('nav.deep.nested.ghost.key', 'id')).toBe('nav.deep.nested.ghost.key');
      expect(getTranslation('about.educationHeading.child.cannot.exist', 'en')).toBe('about.educationHeading.child.cannot.exist');
    });

    it('1.4 falls back to default locale (en) if key is missing in Indonesian dictionary', () => {
      translations.en._test_only_key = "English Only Value";
      try {
        expect(getTranslation('_test_only_key', 'id')).toBe("English Only Value");
      } finally {
        delete translations.en._test_only_key;
      }
    });

    it('1.5 falls back to DEFAULT_LOCALE when unsupported locale is passed', () => {
      expect(getTranslation('hero.greeting', 'fr')).toBe("Hello, I'm");
      expect(getTranslation('hero.greeting', 'ja')).toBe("Hello, I'm");
      expect(getTranslation('hero.greeting', 'invalid_locale')).toBe("Hello, I'm");
      expect(getTranslation('hero.greeting', null)).toBe("Hello, I'm");
      expect(getTranslation('hero.greeting', undefined)).toBe("Hello, I'm");
    });

    it('1.6 handles parameter substitution with single and multiple placeholders', () => {
      translations.en._test_param = "Hello {name}, you have {count} messages from {name}.";
      try {
        const result = getTranslation('_test_param', 'en', { name: 'William', count: 5 });
        expect(result).toBe("Hello William, you have 5 messages from William.");
      } finally {
        delete translations.en._test_param;
      }
    });

    it('1.7 safely handles empty params or params missing matching placeholders', () => {
      translations.en._test_param = "Welcome {user} to {app}";
      try {
        const resultEmpty = getTranslation('_test_param', 'en', {});
        expect(resultEmpty).toBe("Welcome {user} to {app}");

        const resultPartial = getTranslation('_test_param', 'en', { user: 'Alice' });
        expect(resultPartial).toBe("Welcome Alice to {app}");
      } finally {
        delete translations.en._test_param;
      }
    });

    it('1.8 probes boundary: empty string keyPath', () => {
      expect(getTranslation('', 'en')).toBe('');
    });

    it('1.9 probes boundary: keys with leading, trailing, or consecutive dots', () => {
      expect(getTranslation('hero..greeting', 'en')).toBe('hero..greeting');
      expect(getTranslation('.hero.greeting', 'en')).toBe('.hero.greeting');
      expect(getTranslation('hero.greeting.', 'en')).toBe('hero.greeting.');
      expect(getTranslation('...', 'en')).toBe('...');
    });

    it('1.10 prevents prototype property leakage (constructor, __proto__, toString)', () => {
      const resConstructor = getTranslation('constructor', 'en');
      const resToString = getTranslation('toString', 'en');
      const resDeepConstructor = getTranslation('hero.chips.constructor', 'en');

      expect(resConstructor).toBe('constructor');
      expect(resToString).toBe('toString');
      expect(resDeepConstructor).toBe('hero.chips.constructor');
    });

    it('1.11 safely handles non-string keyPath without throwing', () => {
      expect(getTranslation(null, 'en')).toBe('');
      expect(getTranslation(undefined, 'en')).toBe('');
      expect(getTranslation(42, 'en')).toBe('');
      expect(getTranslation({}, 'en')).toBe('');
    });

    it('1.12 safely handles explicit null params argument without throwing', () => {
      expect(getTranslation('hero.greeting', 'en', null)).toBe("Hello, I'm");
      expect(getTranslation('hero.greeting', 'en', undefined)).toBe("Hello, I'm");
      expect(getTranslation('hero.greeting', 'en', 123)).toBe("Hello, I'm");
    });

    it('1.13 preserves dollar signs and special replacement patterns during string interpolation ($1, $&, $\')', () => {
      translations.en._test_dollar = "Cost is {amount} for {target}";
      try {
        const result = getTranslation('_test_dollar', 'en', { amount: '$100', target: '$&' });
        expect(result).toBe("Cost is $100 for $&");
      } finally {
        delete translations.en._test_dollar;
      }
    });

    it('1.14 returns structured object when path resolves to nested sub-dictionary', () => {
      const heroChips = getTranslation('hero.chips', 'en');
      expect(typeof heroChips).toBe('object');
      expect(heroChips).not.toBeNull();
      expect(heroChips.education).toBe("Untar Informatics • GPA 3.89");
    });
  });

  // ==========================================================================
  // Section 2: Strict Dictionary Parity (EN vs ID)
  // ==========================================================================
  describe('2. Dictionary Parity Check (translations.en vs translations.id)', () => {
    function getAllLeafKeys(obj, prefix = '') {
      let paths = [];
      for (const [key, val] of Object.entries(obj)) {
        const fullPath = prefix ? `${prefix}.${key}` : key;
        if (val !== null && typeof val === 'object' && !Array.isArray(val)) {
          paths = paths.concat(getAllLeafKeys(val, fullPath));
        } else {
          paths.push(fullPath);
        }
      }
      return paths;
    }

    const enKeys = getAllLeafKeys(translations.en).sort();
    const idKeys = getAllLeafKeys(translations.id).sort();

    it('2.1 all English keys must exist in Indonesian dictionary', () => {
      const missingInId = enKeys.filter(k => !idKeys.includes(k));
      expect(missingInId, `Keys present in EN but missing in ID: ${missingInId.join(', ')}`).toEqual([]);
    });

    it('2.2 all Indonesian keys must exist in English dictionary', () => {
      const missingInEn = idKeys.filter(k => !enKeys.includes(k));
      expect(missingInEn, `Keys present in ID but missing in EN: ${missingInEn.join(', ')}`).toEqual([]);
    });

    it('2.3 both dictionaries must have identical key count and structural shape', () => {
      expect(enKeys.length).toBe(idKeys.length);
      expect(enKeys).toEqual(idKeys);
      expect(enKeys.length).toBeGreaterThanOrEqual(60);
    });

    it('2.4 no leaf values in either dictionary should be empty strings or null', () => {
      for (const key of enKeys) {
        const enVal = getTranslation(key, 'en');
        const idVal = getTranslation(key, 'id');
        expect(enVal, `Empty EN value at ${key}`).toBeTruthy();
        expect(idVal, `Empty ID value at ${key}`).toBeTruthy();
      }
    });

    it('2.5 corresponding leaf value types must match across locales', () => {
      for (const key of enKeys) {
        const enVal = getTranslation(key, 'en');
        const idVal = getTranslation(key, 'id');
        expect(typeof enVal).toBe(typeof idVal);
      }
    });

    it('2.6 parameter interpolation tokens must match between EN and ID', () => {
      const placeholderRegex = /\{([a-zA-Z0-9_]+)\}/g;
      for (const key of enKeys) {
        const enVal = String(getTranslation(key, 'en'));
        const idVal = String(getTranslation(key, 'id'));
        const enTokens = (enVal.match(placeholderRegex) || []).sort();
        const idTokens = (idVal.match(placeholderRegex) || []).sort();
        expect(enTokens, `Placeholder tokens mismatch at ${key}: EN=${enTokens} vs ID=${idTokens}`).toEqual(idTokens);
      }
    });
  });

  // ==========================================================================
  // Section 3: Dual-Compatibility for Legacy Component Consumers
  // ==========================================================================
  describe('3. Legacy Component Consumer Data Compatibility', () => {
    it('3.1 PERSONAL_INFO retains valid role string matching CV', () => {
      expect(PERSONAL_INFO.role).toBeDefined();
      expect(typeof PERSONAL_INFO.role).toBe('string');
      expect(PERSONAL_INFO.role).toMatch(/Data & Automation Analyst/i);
    });

    it('3.2 PERSONAL_INFO retains valid about multiline narrative string', () => {
      expect(PERSONAL_INFO.about).toBeDefined();
      expect(typeof PERSONAL_INFO.about).toBe('string');
      expect(PERSONAL_INFO.about.length).toBeGreaterThan(100);
      expect(PERSONAL_INFO.about).toMatch(/Kawan Lama Group/i);
      expect(PERSONAL_INFO.about).toMatch(/Tarumanagara/i);
    });

    it('3.3 EXPERIENCE items all retain legacy date property as valid string', () => {
      expect(EXPERIENCE.length).toBeGreaterThanOrEqual(2);
      EXPERIENCE.forEach((exp, idx) => {
        expect(exp.date, `EXPERIENCE[${idx}].date missing or empty`).toBeDefined();
        expect(typeof exp.date).toBe('string');
        expect(exp.date.length).toBeGreaterThan(0);
        expect(exp.date).toBe(exp.period);
      });
    });

    it('3.4 EXPERIENCE items retain legacy highlight and link properties', () => {
      const internExp = EXPERIENCE.find(e => e.type === 'Internship');
      expect(internExp).toBeDefined();
      expect(internExp.highlight).toBe("Awarded Best Intern");
      expect(internExp.link).toMatch(/^https:\/\/www\.linkedin\.com/);
    });

    it('3.5 EXPERIENCE items retain legacy description as renderable React node', () => {
      EXPERIENCE.forEach((exp, idx) => {
        expect(exp.description, `EXPERIENCE[${idx}].description missing`).toBeDefined();
        expect(React.isValidElement(exp.description)).toBe(true);
      });
    });

    it('3.6 PROJECTS items all retain legacy link and liveLink properties', () => {
      expect(PROJECTS.length).toBeGreaterThanOrEqual(7);
      PROJECTS.forEach((proj, idx) => {
        expect(proj.link, `PROJECTS[${idx}].link missing`).toBeDefined();
        expect(typeof proj.link).toBe('string');
        expect(proj.link).toBe(proj.repoUrl);

        expect(proj).toHaveProperty('liveLink');
        if (proj.liveLink !== null) {
          expect(typeof proj.liveLink).toBe('string');
          expect(proj.liveLink).toBe(proj.liveUrl);
        }
      });
    });

    it('3.7 PROJECTS items all use real local project asset image paths', () => {
      PROJECTS.forEach((proj, idx) => {
        expect(proj.image, `PROJECTS[${idx}].image missing`).toBeDefined();
        expect(typeof proj.image).toBe('string');
        expect(proj.image).toMatch(/^\/assets\/projects\//);
      });
    });

    it('3.8 SKILLS flat array is retained with valid names, images, and categories for legacy MarqueeSection', () => {
      expect(Array.isArray(SKILLS)).toBe(true);
      expect(SKILLS.length).toBeGreaterThanOrEqual(16);
      SKILLS.forEach((skill, idx) => {
        expect(skill.name, `SKILLS[${idx}].name missing`).toBeDefined();
        expect(typeof skill.name).toBe('string');
        expect(skill.image, `SKILLS[${idx}].image missing`).toBeDefined();
        expect(typeof skill.image).toBe('string');
        expect(skill.category, `SKILLS[${idx}].category missing`).toBeDefined();
      });
    });

    it('3.9 CERTIFICATIONS items retain id, title, issuer, image, link, date for legacy modal', () => {
      expect(CERTIFICATIONS.length).toBeGreaterThanOrEqual(8);
      CERTIFICATIONS.forEach((cert) => {
        expect(cert.id).toBeDefined();
        expect(cert.title).toBeDefined();
        expect(cert.issuer).toBeDefined();
        expect(cert.image).toBeDefined();
        expect(cert.link).toBeDefined();
        expect(cert.date).toBeDefined();
      });
    });

    it('3.10 Background assets retain both REMOTE_BACKGROUNDS and LOCAL_BACKGROUNDS for all 7 sections', () => {
      const requiredSections = ['hero', 'about', 'skills', 'experience', 'projects', 'certifications', 'contact'];
      requiredSections.forEach(sec => {
        expect(REMOTE_BACKGROUNDS[sec], `REMOTE_BACKGROUNDS[${sec}] missing`).toBeDefined();
        expect(LOCAL_BACKGROUNDS[sec], `LOCAL_BACKGROUNDS[${sec}] missing`).toBeDefined();
      });
    });

    it('3.11 HERO_VIDEOS retains both light and dark video paths', () => {
      expect(HERO_VIDEOS.light).toBeDefined();
      expect(HERO_VIDEOS.dark).toBeDefined();
      expect(HERO_VIDEOS.light).toMatch(/\.mp4$/);
      expect(HERO_VIDEOS.dark).toMatch(/\.mp4$/);
    });
  });

  // ==========================================================================
  // Section 4: React Context & Hook Lifecycle Testing
  // ==========================================================================
  describe('4. React Context & Hook Lifecycle (I18nProvider & useI18n)', () => {
    beforeEach(() => {
      window.localStorage.clear();
    });

    it('4.1 useI18n returns default values outside Provider without throwing', () => {
      const { result } = renderHook(() => useI18n());
      expect(result.current).toBeDefined();
      expect(result.current.locale).toBe(DEFAULT_LOCALE);
      expect(result.current.isIndonesian).toBe(false);
      expect(result.current.t('hero.greeting')).toBe('hero.greeting');
    });

    it('4.2 setLocale provides reactive locale switching and updates reactive translations', () => {
      function TestComponent() {
        const { locale, setLocale, t, isIndonesian } = useI18n();
        return (
          <div>
            <span data-testid="current-locale">{locale}</span>
            <span data-testid="is-id">{String(isIndonesian)}</span>
            <span data-testid="translated-text">{t('hero.greeting')}</span>
            <button data-testid="set-id-btn" onClick={() => setLocale('id')}>Set ID</button>
            <button data-testid="set-en-btn" onClick={() => setLocale('en')}>Set EN</button>
          </div>
        );
      }

      render(
        <I18nProvider>
          <TestComponent />
        </I18nProvider>
      );

      expect(screen.getByTestId('current-locale').textContent).toBe('en');
      expect(screen.getByTestId('is-id').textContent).toBe('false');
      expect(screen.getByTestId('translated-text').textContent).toBe("Hello, I'm");

      act(() => {
        screen.getByTestId('set-id-btn').click();
      });

      expect(screen.getByTestId('current-locale').textContent).toBe('id');
      expect(screen.getByTestId('is-id').textContent).toBe('true');
      expect(screen.getByTestId('translated-text').textContent).toBe("Halo, saya");
      expect(window.localStorage.getItem('portfolio_locale')).toBe('id');

      act(() => {
        screen.getByTestId('set-en-btn').click();
      });

      expect(screen.getByTestId('current-locale').textContent).toBe('en');
      expect(screen.getByTestId('translated-text').textContent).toBe("Hello, I'm");
      expect(window.localStorage.getItem('portfolio_locale')).toBe('en');
    });

    it('4.3 toggleLocale switches between en and id reactively', () => {
      function TestToggle() {
        const { locale, toggleLocale } = useI18n();
        return (
          <div>
            <span data-testid="toggle-locale">{locale}</span>
            <button data-testid="toggle-btn" onClick={toggleLocale}>Toggle</button>
          </div>
        );
      }

      render(
        <I18nProvider>
          <TestToggle />
        </I18nProvider>
      );

      expect(screen.getByTestId('toggle-locale').textContent).toBe('en');
      
      act(() => {
        screen.getByTestId('toggle-btn').click();
      });

      expect(screen.getByTestId('toggle-locale').textContent).toBe('id');
      expect(window.localStorage.getItem('portfolio_locale')).toBe('id');

      act(() => {
        screen.getByTestId('toggle-btn').click();
      });

      expect(screen.getByTestId('toggle-locale').textContent).toBe('en');
      expect(window.localStorage.getItem('portfolio_locale')).toBe('en');
    });

    it('4.4 I18nProvider initializes locale from localStorage if set', () => {
      window.localStorage.setItem('portfolio_locale', 'id');

      function TestComponent() {
        const { locale, t } = useI18n();
        return (
          <div>
            <span data-testid="init-locale">{locale}</span>
            <span data-testid="init-text">{t('hero.greeting')}</span>
          </div>
        );
      }

      render(
        <I18nProvider>
          <TestComponent />
        </I18nProvider>
      );

      expect(screen.getByTestId('init-locale').textContent).toBe('id');
      expect(screen.getByTestId('init-text').textContent).toBe("Halo, saya");
    });

    it('4.5 handles localStorage access denial (SecurityError/QuotaExceededError) gracefully during setLocale', () => {
      const originalSetItem = window.localStorage.setItem;
      window.localStorage.setItem = vi.fn(() => {
        throw new DOMException('The operation is insecure.', 'SecurityError');
      });

      function TestComponent() {
        const { setLocale, locale } = useI18n();
        return (
          <div>
            <span data-testid="sec-locale">{locale}</span>
            <button data-testid="sec-btn" onClick={() => setLocale('id')}>Set ID</button>
          </div>
        );
      }

      render(
        <I18nProvider>
          <TestComponent />
        </I18nProvider>
      );

      // Should not throw even when localStorage.setItem throws
      expect(() => {
        act(() => {
          screen.getByTestId('sec-btn').click();
        });
      }).not.toThrow();

      expect(screen.getByTestId('sec-locale').textContent).toBe('id');
      window.localStorage.setItem = originalSetItem;
    });
  });
});
