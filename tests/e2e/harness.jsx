import React from 'react';
import { render, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi } from 'vitest';
import App from '../../src/App';

/**
 * Custom viewport simulation helper
 * Dispatches a window resize event to trigger responsive UI adjustments
 */
export function setViewport({ width, height }) {
  window.innerWidth = width;
  window.innerHeight = height;
  window.dispatchEvent(new Event('resize'));
}

/**
 * System theme simulator helper
 */
export function setSystemTheme(theme) {
  window.matchMedia = vi.fn().mockImplementation((query) => ({
    matches: query.includes('prefers-color-scheme: dark') ? theme === 'dark' : theme === 'light',
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  }));
}

/**
 * Reset test environment to pristine initial state
 */
export function resetTestEnvironment() {
  window.localStorage.clear();
  document.documentElement.classList.remove('dark');
  document.documentElement.className = '';
  document.body.innerHTML = '';
  setViewport({ width: 1280, height: 800 });
}

/**
 * Renders the full portfolio application within the test harness
 * Returns standard testing-library queries, container, and a configured userEvent instance.
 * Automatically advances any legacy loader countdown timers so portfolio is interactive.
 */
export function renderPortfolio(options = {}) {
  const { advanceLoader = true, component, ...renderOptions } = options;
  const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });

  const elementToRender = component || <App />;
  const result = render(elementToRender, renderOptions);

  if (advanceLoader && !component) {
    // Fast-forward FuturisticLoader intervals and initial typing timers
    act(() => {
      vi.advanceTimersByTime(2500); // reaches 100% and schedules onComplete (800ms)
    });
    act(() => {
      vi.advanceTimersByTime(1000); // executes onComplete and updates isLoading to false (Hero mounts)
    });
    act(() => {
      vi.advanceTimersByTime(1100); // startDelay of Typewriter (1000ms) expires
    });
    // Each character update in Typewriter is scheduled in a new useEffect, so tick through them:
    for (let i = 0; i < 10; i++) {
      act(() => {
        vi.advanceTimersByTime(200);
      });
    }
  }

  return {
    user,
    ...result,
  };
}
