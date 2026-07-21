/**
 * Module dependencies.
 */

import { defineConfig } from 'vite';
import { reactRouter } from '@react-router/dev/vite';
import mkcert from 'vite-plugin-mkcert';
import tsconfigPaths from 'vite-tsconfig-paths';

/**
 * Export config.
 */

export default defineConfig({
  plugins: [
    // eslint-disable-next-line no-process-env
    !process.env.VITEST && reactRouter(),
    tsconfigPaths(),
    mkcert({ hosts: ['environment-connectivity.uphold-enterprise-payment-widget.pages.dev'] })
  ],
  server: {
    allowedHosts: ['environment-connectivity.uphold-enterprise-payment-widget.pages.dev'],
    port: 8789
  }
});
