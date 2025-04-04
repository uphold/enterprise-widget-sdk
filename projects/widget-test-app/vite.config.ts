/**
 * Module dependencies.
 */

import { defineConfig } from 'vite';
import { reactRouter } from '@react-router/dev/vite';
import tsconfigPaths from 'vite-tsconfig-paths';

/**
 * Export config.
 */

export default defineConfig({
  // eslint-disable-next-line no-process-env
  plugins: [!process.env.VITEST && reactRouter(), tsconfigPaths()],
  server: {
    port: 8789
  }
});
