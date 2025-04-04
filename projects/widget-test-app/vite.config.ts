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
    plugins: [!env.VITEST && reactRouter(), tsconfigPaths()]
  };

  if (mode !== 'test') {
    const coreApiBaseUrl = new URL(env.VITE_ENTERPRISE_CORE_API_BASE_URL!);

    const coreApiPath = coreApiBaseUrl.pathname;

    const widgetsApiBaseUrl = new URL(env.VITE_ENTERPRISE_WIDGETS_API_BASE_URL!);

    const widgetsApiPath = widgetsApiBaseUrl.pathname;

    config.server = {
      port: 8789,
      proxy: {
        [coreApiPath]: {
          changeOrigin: true,
          target: env.PROXY_TARGET_ENTERPRISE_CORE_API
        },
        [widgetsApiPath]: {
          changeOrigin: true,
          target: env.PROXY_TARGET_ENTERPRISE_WIDGETS_API
        }
      }
    };
  }

  return config;
});
