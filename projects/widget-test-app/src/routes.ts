/**
 * Module dependencies.
 */

import { type RouteConfig, index, route } from '@react-router/dev/routes';

/**
 * Exports.
 */

export default [
  index('./pages/home/index.ts'),
  route('payment-widget', './pages/payment-widget/index.ts')
] satisfies RouteConfig;
