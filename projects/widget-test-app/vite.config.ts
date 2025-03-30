/**
 * Module dependencies.
 */

import { UserConfig, defineConfig, loadEnv } from 'vite';
import { reactRouter } from '@react-router/dev/vite';
import tsconfigPaths from 'vite-tsconfig-paths';

/**
 * Export config.
 */

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');

  const config: UserConfig = {
    plugins: [!env.VITEST && reactRouter(), tsconfigPaths()],
    server: {
      port: 8789
    }
  };

  return config;
});
