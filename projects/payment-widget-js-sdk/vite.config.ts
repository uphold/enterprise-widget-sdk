/**
 * Module dependencies.
 */

import { defineConfig } from 'vite';
import tsconfigPaths from 'vite-tsconfig-paths';

/**
 * Export config.
 */

export default defineConfig({
  plugins: [tsconfigPaths()]
});
