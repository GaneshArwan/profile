import '@testing-library/jest-dom';
import { vi } from 'vitest';

// 1. Mock window.matchMedia for theme detection and responsive simulation
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation((query) => {
    const isDark = query.includes('prefers-color-scheme: dark');
    return {
      matches: isDark,
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    };
  }),
});

// 2. Mock ResizeObserver (required for responsive elements and components)
global.ResizeObserver = class ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
};

// 3. Mock IntersectionObserver
global.IntersectionObserver = class IntersectionObserver {
  constructor(callback) {
    this.callback = callback;
  }
  observe() {}
  unobserve() {}
  disconnect() {}
};

// 4. Mock LocalStorage with in-memory store
const localStorageMock = (() => {
  let store = {};
  return {
    getItem: vi.fn((key) => store[key] !== undefined ? store[key] : null),
    setItem: vi.fn((key, value) => {
      store[key] = String(value);
    }),
    removeItem: vi.fn((key) => {
      delete store[key];
    }),
    clear: vi.fn(() => {
      store = {};
    }),
    get length() {
      return Object.keys(store).length;
    },
    key: vi.fn((idx) => Object.keys(store)[idx] || null),
  };
})();
Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
  writable: true,
});

// 5. Mock window.history.scrollRestoration and window.scrollTo
if (!window.history) {
  window.history = {};
}
window.history.scrollRestoration = 'auto';
window.scrollTo = vi.fn();
window.alert = vi.fn();

// HTMLMediaElement methods for video elements in Happy-DOM
if (typeof window.HTMLMediaElement !== 'undefined') {
  window.HTMLMediaElement.prototype.load = () => {};
  window.HTMLMediaElement.prototype.play = () => Promise.resolve();
  window.HTMLMediaElement.prototype.pause = () => {};
}

// 6. Global fetch mock for Formspree form submission
global.fetch = vi.fn().mockImplementation(() =>
  Promise.resolve({
    ok: true,
    status: 200,
    json: () => Promise.resolve({ success: true }),
  })
);

// 7. Mock LocomotiveScroll to avoid RAF / DOM errors in test runner
vi.mock('locomotive-scroll', () => {
  return {
    default: class MockLocomotiveScroll {
      constructor() {}
      update() {}
      destroy() {}
      on() {}
      scrollTo(target, options) {
        if (target === 'top') {
          window.scrollTo({ top: 0, ...options });
        }
      }
    },
  };
});

import React from 'react';

// Mock external analytics and captcha third-party widgets that inject external network scripts
vi.mock('@vercel/analytics/react', () => ({
  Analytics: () => null,
}));

vi.mock('@vercel/speed-insights/react', () => ({
  SpeedInsights: () => null,
}));

vi.mock('react-google-recaptcha', () => ({
  default: ({ onChange }) => (
    React.createElement('div', { 'data-testid': 'mock-recaptcha' },
      React.createElement('button', {
        type: 'button',
        'data-testid': 'recaptcha-verify-btn',
        onClick: () => onChange && onChange('mock-recaptcha-token'),
      }, 'Verify reCAPTCHA')
    )
  ),
}));

// 8. Suppress harmless simulated DOM warnings (e.g. video playback in Happy-DOM)
const originalConsoleError = console.error;
console.error = (...args) => {
  if (
    typeof args[0] === 'string' &&
    (args[0].includes('Not implemented') ||
     args[0].includes('HTMLMediaElement') ||
     args[0].includes('Warning: ReactDOM.render'))
  ) {
    return;
  }
  originalConsoleError(...args);
};
