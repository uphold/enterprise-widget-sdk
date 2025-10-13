/**
 * Module dependencies.
 */

import { defineConfig } from 'vitest/config';
import baseConfig from '../../vitest.config.js';

/**
 * Export config.
 */

export default defineConfig({
  test: {
    ...baseConfig.test,
    environment: 'jsdom'
  }
});
