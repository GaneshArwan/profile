import { defineConfig, mergeConfig } from 'vitest/config';
import viteConfig from './vite.config.js';

export default mergeConfig(
  viteConfig,
  defineConfig({
    test: {
      globals: true,
      environment: 'happy-dom',
      setupFiles: ['./tests/e2e/setup.js'],
      include: ['tests/e2e/tier*.test.{js,jsx}'],
      testTimeout: 15000,
      reporters: ['verbose'],
    },
  })
);
