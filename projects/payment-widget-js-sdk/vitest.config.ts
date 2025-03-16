/**
 * Module dependencies.
 */

import { defineConfig, mergeConfig } from 'vitest/config';
import baseConfig from '../../vitest.config.js';
import viteConfig from './vite.config.js';

/**
 * Export config.
 */

export default mergeConfig(
  viteConfig,
  defineConfig({
    test: {
      ...baseConfig.test,
    }
  })
);
