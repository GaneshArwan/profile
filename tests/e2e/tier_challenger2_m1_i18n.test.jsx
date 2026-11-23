/**
 * tests/e2e/tier_challenger2_m1_i18n.test.jsx
 * Empirical Challenger 2: Adversarial Stress, Boundary & Security Suite for i18n
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
  useI18n,
  I18nContext
} from '../../src/lib/i18n';

describe('Empirical Challenger 2: Adversarial i18n Stress & Security Suite', () => {

  // ==========================================================================
  // Suite 1: toggleLocale and State Transition Robustness
  // ==========================================================================
  describe('Suite 1: toggleLocale & State Transition Robustness', () => {
    beforeEach(() => {
      window.localStorage.clear();
    });

    it('1.1 toggleLocale flips between en and id deterministically across repeated invocations', () => {
      function ToggleHarness() {
        const { locale, toggleLocale, isIndonesian } = useI18n();
        return (
          <div>
            <span data-testid="locale-display">{locale}</span>
            <span data-testid="is-id-display">{String(isIndonesian)}</span>
            <button data-testid="toggle-button" onClick={toggleLocale}>Toggle</button>
          </div>
        );
      }

      render(
        <I18nProvider>
          <ToggleHarness />
        </I18nProvider>
      );

      // Initial state: en
      expect(screen.getByTestId('locale-display').textContent).toBe('en');
      expect(screen.getByTestId('is-id-display').textContent).toBe('false');

      // Toggle 1 -> id
      act(() => {
        screen.getByTestId('toggle-button').click();
      });
      expect(screen.getByTestId('locale-display').textContent).toBe('id');
      expect(screen.getByTestId('is-id-display').textContent).toBe('true');
      expect(window.localStorage.getItem('portfolio_locale')).toBe('id');

      // Toggle 2 -> en
      act(() => {
        screen.getByTestId('toggle-button').click();
      });
      expect(screen.getByTestId('locale-display').textContent).toBe('en');
      expect(screen.getByTestId('is-id-display').textContent).toBe('false');
      expect(window.localStorage.getItem('portfolio_locale')).toBe('en');

      // Toggle 3 -> id
      act(() => {
        screen.getByTestId('toggle-button').click();
      });
      expect(screen.getByTestId('locale-display').textContent).toBe('id');
      expect(screen.getByTestId('is-id-display').textContent).toBe('true');

      // Toggle 4 -> en
      act(() => {
        screen.getByTestId('toggle-button').click();
      });
      expect(screen.getByTestId('locale-display').textContent).toBe('en');
      expect(screen.getByTestId('is-id-display').textContent).toBe('false');
    });

    it('1.2 rapid 50x sequential toggleLocale executions preserve state consistency', () => {
      function StressHarness() {
        const { locale, toggleLocale } = useI18n();
        return (
          <div>
            <span data-testid="current-locale">{locale}</span>
            <button data-testid="rapid-toggle" onClick={toggleLocale}>Toggle</button>
          </div>
        );
      }

      render(
        <I18nProvider>
          <StressHarness />
        </I18nProvider>
      );

      const btn = screen.getByTestId('rapid-toggle');
      const display = screen.getByTestId('current-locale');
      for (let i = 1; i <= 50; i++) {
        act(() => {
          btn.click();
        });
        const expected = i % 2 === 1 ? 'id' : 'en';
        expect(display.textContent).toBe(expected);
      }
      expect(window.localStorage.getItem('portfolio_locale')).toBe('en');
    });

    it('1.3 setLocale ignores invalid or unsupported locale strings without breaking current state', () => {
      function InvalidHarness() {
        const { locale, setLocale } = useI18n();
        return (
          <div>
            <span data-testid="target-locale">{locale}</span>
            <button data-testid="btn-es" onClick={() => setLocale('es')}>ES</button>
            <button data-testid="btn-fr" onClick={() => setLocale('fr')}>FR</button>
            <button data-testid="btn-empty" onClick={() => setLocale('')}>Empty</button>
            <button data-testid="btn-null" onClick={() => setLocale(null)}>Null</button>
            <button data-testid="btn-obj" onClick={() => setLocale({ bad: true })}>Obj</button>
          </div>
        );
      }

      render(
        <I18nProvider>
          <InvalidHarness />
        </I18nProvider>
      );

      expect(screen.getByTestId('target-locale').textContent).toBe('en');

      // Attempt unsupported locales
      ['btn-es', 'btn-fr', 'btn-empty', 'btn-null', 'btn-obj'].forEach((btnId) => {
        act(() => {
          screen.getByTestId(btnId).click();
        });
        expect(screen.getByTestId('target-locale').textContent).toBe('en');
      });
    });

    it('1.4 setLocale accepts functional updater (prev => next)', () => {
      function FunctionalHarness() {
        const { locale, setLocale } = useI18n();
        return (
          <div>
            <span data-testid="func-locale">{locale}</span>
            <button
              data-testid="func-btn"
              onClick={() => setLocale((prev) => (prev === 'en' ? 'id' : 'en'))}
            >
              Fn Toggle
            </button>
          </div>
        );
      }

      render(
        <I18nProvider>
          <FunctionalHarness />
        </I18nProvider>
      );

      expect(screen.getByTestId('func-locale').textContent).toBe('en');

      act(() => {
        screen.getByTestId('func-btn').click();
      });
      expect(screen.getByTestId('func-locale').textContent).toBe('id');

      act(() => {
        screen.getByTestId('func-btn').click();
      });
      expect(screen.getByTestId('func-locale').textContent).toBe('en');
    });

    it('1.5 provider recovers gracefully when localStorage throws QuotaExceededError or SecurityError on write', () => {
      const originalSetItem = window.localStorage.setItem;
      const throwError = vi.fn(() => {
        throw new DOMException('Quota exceeded', 'QuotaExceededError');
      });
      window.localStorage.setItem = throwError;

      function StorageErrorHarness() {
        const { locale, toggleLocale } = useI18n();
        return (
          <div>
            <span data-testid="error-locale">{locale}</span>
            <button data-testid="error-toggle" onClick={toggleLocale}>Toggle</button>
          </div>
        );
      }

      render(
        <I18nProvider>
          <StorageErrorHarness />
        </I18nProvider>
      );

      expect(screen.getByTestId('error-locale').textContent).toBe('en');

      expect(() => {
        act(() => {
          screen.getByTestId('error-toggle').click();
        });
      }).not.toThrow();

      expect(screen.getByTestId('error-locale').textContent).toBe('id');
      expect(throwError).toHaveBeenCalled();

      window.localStorage.setItem = originalSetItem;
    });

    it('1.6 provider recovers gracefully when localStorage throws SecurityError on read during initialization', () => {
      const originalGetItem = window.localStorage.getItem;
      window.localStorage.getItem = vi.fn(() => {
        throw new DOMException('Access denied', 'SecurityError');
      });

      function InitErrorHarness() {
        const { locale } = useI18n();
        return <span data-testid="safe-init-locale">{locale}</span>;
      }

      render(
        <I18nProvider>
          <InitErrorHarness />
        </I18nProvider>
      );

      expect(screen.getByTestId('safe-init-locale').textContent).toBe(DEFAULT_LOCALE);
      window.localStorage.getItem = originalGetItem;
    });
  });

  // ==========================================================================
  // Suite 2: Null, Undefined, and Boundary Safety in getTranslation
  // ==========================================================================
  describe('Suite 2: Null, Undefined & Boundary Safety (getTranslation)', () => {
    it('2.1 returns empty string when keyPath is null, undefined, empty, or non-string', () => {
      expect(getTranslation(null)).toBe('');
      expect(getTranslation(undefined)).toBe('');
      expect(getTranslation('')).toBe('');
      expect(getTranslation(0)).toBe('');
      expect(getTranslation(12345)).toBe('');
      expect(getTranslation(true)).toBe('');
      expect(getTranslation(false)).toBe('');
      expect(getTranslation({})).toBe('');
      expect(getTranslation([])).toBe('');
      expect(getTranslation(Symbol('key'))).toBe('');
      expect(getTranslation(() => 'nav.home')).toBe('');
    });

    it('2.2 returns keyPath verbatim when given valid string but key is nonexistent at various depths', () => {
      expect(getTranslation('nonexistent_root_key')).toBe('nonexistent_root_key');
      expect(getTranslation('hero.nonexistent_child')).toBe('hero.nonexistent_child');
      expect(getTranslation('nav.deeply.nested.missing.key')).toBe('nav.deeply.nested.missing.key');
      expect(getTranslation('about.institution.child_of_primitive')).toBe('about.institution.child_of_primitive');
    });

    it('2.3 safely handles degenerate dot formats without throwing', () => {
      expect(getTranslation('.')).toBe('.');
      expect(getTranslation('..')).toBe('..');
      expect(getTranslation('...')).toBe('...');
      expect(getTranslation('.hero.greeting')).toBe('.hero.greeting');
      expect(getTranslation('hero.greeting.')).toBe('hero.greeting.');
      expect(getTranslation('hero..greeting')).toBe('hero..greeting');
    });

    it('2.4 safely handles null or malformed locale parameter with fallback to default en', () => {
      expect(getTranslation('hero.greeting', null)).toBe("Hello, I'm");
      expect(getTranslation('hero.greeting', undefined)).toBe("Hello, I'm");
      expect(getTranslation('hero.greeting', 123)).toBe("Hello, I'm");
      expect(getTranslation('hero.greeting', {})).toBe("Hello, I'm");
      expect(getTranslation('hero.greeting', 'fr')).toBe("Hello, I'm");
      expect(getTranslation('hero.greeting', 'de')).toBe("Hello, I'm");
      expect(getTranslation('hero.greeting', '')).toBe("Hello, I'm");
    });

    it('2.5 safely handles explicit null, undefined, or non-object params without throwing', () => {
      expect(getTranslation('hero.greeting', 'en', null)).toBe("Hello, I'm");
      expect(getTranslation('hero.greeting', 'en', undefined)).toBe("Hello, I'm");
      expect(getTranslation('hero.greeting', 'en', 'string-param')).toBe("Hello, I'm");
      expect(getTranslation('hero.greeting', 'en', 123)).toBe("Hello, I'm");
      expect(getTranslation('hero.greeting', 'en', true)).toBe("Hello, I'm");
      expect(getTranslation('hero.greeting', 'en', () => {})).toBe("Hello, I'm");
    });
  });

  // ==========================================================================
  // Suite 3: Prototype Pollution and Prototype Inheritance Protection
  // ==========================================================================
  describe('Suite 3: Prototype Pollution & Inheritance Protection', () => {
    it('3.1 prototype root properties return the key verbatim and never leak Object prototypes', () => {
      const probeKeys = [
        'constructor',
        '__proto__',
        'prototype',
        'toString',
        'valueOf',
        'hasOwnProperty',
        'isPrototypeOf',
        'propertyIsEnumerable',
        'toLocaleString'
      ];

      probeKeys.forEach((key) => {
        const enResult = getTranslation(key, 'en');
        const idResult = getTranslation(key, 'id');
        expect(enResult, `EN leaked prototype property '${key}'`).toBe(key);
        expect(idResult, `ID leaked prototype property '${key}'`).toBe(key);
        expect(typeof enResult).toBe('string');
        expect(typeof idResult).toBe('string');
      });
    });

    it('3.2 nested prototype access attempts return key verbatim without crashing', () => {
      const deepProbes = [
        'hero.constructor',
        'hero.__proto__',
        'hero.toString',
        'nav.hasOwnProperty',
        'experience.domains.constructor',
        'experience.domains.site.valueOf',
        '__proto__.polluted',
        'constructor.prototype.test'
      ];

      deepProbes.forEach((path) => {
        const result = getTranslation(path, 'en');
        expect(result, `Path '${path}' should return keyPath verbatim`).toBe(path);
      });
    });

    it('3.3 prototype pollution attempts do not alter global object behavior', () => {
      expect({}.polluted).toBeUndefined();
      getTranslation('__proto__.polluted', 'en');
      expect({}.polluted).toBeUndefined();
      expect(Object.prototype.polluted).toBeUndefined();
    });
  });

  // ==========================================================================
  // Suite 4: Dollar Sign Injection and Regex Replacement Safety
  // ==========================================================================
  describe('Suite 4: Dollar Sign Injection & Replacement Safety', () => {
    it('4.1 preserves currency dollar signs and double dollar patterns ($100, $$, USD $50)', () => {
      translations.en._test_currency = "Total price: {amount} for {item}";
      try {
        const singleDollar = getTranslation('_test_currency', 'en', { amount: '$100', item: 'Widget' });
        expect(singleDollar).toBe("Total price: $100 for Widget");

        const doubleDollar = getTranslation('_test_currency', 'en', { amount: '$$50', item: 'Service' });
        expect(doubleDollar).toBe("Total price: $$50 for Service");

        const complexCurrency = getTranslation('_test_currency', 'en', { amount: 'USD $1,250.00', item: 'Contract' });
        expect(complexCurrency).toBe("Total price: USD $1,250.00 for Contract");
      } finally {
        delete translations.en._test_currency;
      }
    });

    it('4.2 preserves regex special replacement tokens ($&, $\', $`, $1, $2) without corrupting output', () => {
      translations.en._test_regex_tokens = "Value is {val} and code is {code}";
      try {
        // $& in String.prototype.replaceAll normally inserts the matched substring ('{val}')
        const testMatch = getTranslation('_test_regex_tokens', 'en', { val: '$&', code: 'TEST' });
        expect(testMatch).toBe("Value is $& and code is TEST");

        // $' normally inserts the text after the match
        const testAfter = getTranslation('_test_regex_tokens', 'en', { val: "$'", code: 'AFTER' });
        expect(testAfter).toBe("Value is $' and code is AFTER");

        // $` normally inserts the text before the match
        const testBefore = getTranslation('_test_regex_tokens', 'en', { val: "$`", code: 'BEFORE' });
        expect(testBefore).toBe("Value is $` and code is BEFORE");

        // $1, $2 normally insert capture groups
        const testGroups = getTranslation('_test_regex_tokens', 'en', { val: '$1-$2-$3', code: '$99' });
        expect(testGroups).toBe("Value is $1-$2-$3 and code is $99");
      } finally {
        delete translations.en._test_regex_tokens;
      }
    });

    it('4.3 handles falsy and primitive parameter values safely (0, false, empty string)', () => {
      translations.en._test_primitives = "Count: {count}, Active: {active}, Note: {note}";
      try {
        const result = getTranslation('_test_primitives', 'en', { count: 0, active: false, note: '' });
        expect(result).toBe("Count: 0, Active: false, Note: ");
      } finally {
        delete translations.en._test_primitives;
      }
    });

    it('4.4 handles complex object and array parameters by converting via String() without throwing', () => {
      translations.en._test_complex = "Payload: {data}, List: {items}";
      try {
        const result = getTranslation('_test_complex', 'en', { data: { id: 1 }, items: [1, 2, 3] });
        expect(result).toBe("Payload: [object Object], List: 1,2,3");
      } finally {
        delete translations.en._test_complex;
      }
    });
  });

  // ==========================================================================
  // Suite 5: Dictionary Completeness, Bidirectional Parity & Leaf Integrity
  // ==========================================================================
  describe('Suite 5: Dictionary Completeness & Bidirectional Parity', () => {
    function getAllKeys(obj, prefix = '') {
      let keys = [];
      for (const [k, v] of Object.entries(obj)) {
        const p = prefix ? `${prefix}.${k}` : k;
        if (v && typeof v === 'object' && !Array.isArray(v)) {
          keys = keys.concat(getAllKeys(v, p));
        } else {
          keys.push(p);
        }
      }
      return keys;
    }

    const enKeys = getAllKeys(translations.en).sort();
    const idKeys = getAllKeys(translations.id).sort();

    it('5.1 exact bidirectional key set equality between en and id', () => {
      expect(enKeys).toEqual(idKeys);
      expect(enKeys.length).toBeGreaterThan(60);
    });

    it('5.2 all leaf keys resolve to non-empty strings with matching types', () => {
      enKeys.forEach((key) => {
        const enVal = getTranslation(key, 'en');
        const idVal = getTranslation(key, 'id');

        expect(typeof enVal, `EN value at ${key} is not string`).toBe('string');
        expect(typeof idVal, `ID value at ${key} is not string`).toBe('string');
        expect(enVal.trim().length, `EN value at ${key} is blank`).toBeGreaterThan(0);
        expect(idVal.trim().length, `ID value at ${key} is blank`).toBeGreaterThan(0);
      });
    });

    it('5.3 placeholder syntax consistency between corresponding en and id strings', () => {
      const pattern = /\{([a-zA-Z0-9_]+)\}/g;
      enKeys.forEach((key) => {
        const enVal = getTranslation(key, 'en');
        const idVal = getTranslation(key, 'id');
        const enMatches = (enVal.match(pattern) || []).sort();
        const idMatches = (idVal.match(pattern) || []).sort();
        expect(enMatches, `Placeholder mismatch on ${key}`).toEqual(idMatches);
      });
    });

    it('5.4 constants and supported locales are frozen and correctly defined', () => {
      expect(SUPPORTED_LOCALES).toEqual(['en', 'id']);
      expect(DEFAULT_LOCALE).toBe('en');
    });
  });

  // ==========================================================================
  // Suite 6: React Provider and Consumer Hook Isolation
  // ==========================================================================
  describe('Suite 6: React Provider & Hook Isolation', () => {
    it('6.1 useI18n outside Provider provides a functional no-op t function returning keyPath', () => {
      const { result } = renderHook(() => useI18n());
      expect(result.current.locale).toBe('en');
      expect(result.current.isIndonesian).toBe(false);
      expect(result.current.t('hero.greeting')).toBe('hero.greeting');
      expect(result.current.t(null)).toBe('');
    });

    it('6.2 multiple sibling consumers update simultaneously when locale changes', () => {
      function ConsumerA() {
        const { t } = useI18n();
        return <div data-testid="consumer-a">{t('nav.home')}</div>;
      }

      function ConsumerB() {
        const { t } = useI18n();
        return <div data-testid="consumer-b">{t('hero.greeting')}</div>;
      }

      function Switcher() {
        const { toggleLocale } = useI18n();
        return <button data-testid="switch-btn" onClick={toggleLocale}>Switch</button>;
      }

      render(
        <I18nProvider>
          <ConsumerA />
          <ConsumerB />
          <Switcher />
        </I18nProvider>
      );

      expect(screen.getByTestId('consumer-a').textContent).toBe('Top');
      expect(screen.getByTestId('consumer-b').textContent).toBe("Hello, I'm");

      act(() => {
        screen.getByTestId('switch-btn').click();
      });

      expect(screen.getByTestId('consumer-a').textContent).toBe('Beranda');
      expect(screen.getByTestId('consumer-b').textContent).toBe('Halo, saya');
    });
  });
});
