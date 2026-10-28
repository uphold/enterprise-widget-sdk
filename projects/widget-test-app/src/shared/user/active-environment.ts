/**
 * Module dependencies.
 */

import { type EnvironmentProfile, config } from '../../../config';

/**
 * Constants.
 */

const QUERY_PARAM = 'env';
const STORAGE_KEY = 'widget-test-app:environment';
const USER_QUERY_PARAM = 'user';

/**
 * Types.
 */

export type ActiveEnvironment = EnvironmentProfile & { key: string };

/**
 * Environments.
 */

const { environments }: { environments: Record<string, EnvironmentProfile> } = config;

const isKnownEnvironment = (key?: string | null): key is string => !!key && key in environments;

/**
 * Read stored environment key.
 */

const readStoredEnvironmentKey = () => {
  try {
    return window.localStorage.getItem(STORAGE_KEY);
  } catch {
    return null;
  }
};

/**
 * Export `getEnvironments`.
 */

export const getEnvironments = (): ActiveEnvironment[] =>
  Object.entries(environments).map(([key, environment]) => ({ ...environment, key }));

/**
 * Export `getActiveEnvironmentKey`.
 * Resolution order: `?env=` query param, local storage, `config.defaultEnvironment`.
 */

export const getActiveEnvironmentKey = () => {
  if (typeof window === 'undefined') {
    return config.defaultEnvironment;
  }

  const fromQuery = new URLSearchParams(window.location.search).get(QUERY_PARAM);

  if (isKnownEnvironment(fromQuery)) {
    return fromQuery;
  }

  const fromStorage = readStoredEnvironmentKey();

  if (isKnownEnvironment(fromStorage)) {
    return fromStorage;
  }

  return config.defaultEnvironment;
};

/**
 * Export `setActiveEnvironmentKey`.
 * Clears the `?user=` query param, as user keys are scoped to an environment.
 */

export const setActiveEnvironmentKey = (key: string) => {
  if (!isKnownEnvironment(key)) {
    throw new Error(`Unknown environment "${key}"`);
  }

  try {
    window.localStorage.setItem(STORAGE_KEY, key);
  } catch {
    // Ignore storage errors, the query param still holds the selection.
  }

  const url = new URL(window.location.href);

  url.searchParams.set(QUERY_PARAM, key);
  url.searchParams.delete(USER_QUERY_PARAM);
  window.history.replaceState(window.history.state, '', url);
};

/**
 * Export `getActiveEnvironment`.
 */

export const getActiveEnvironment = (): ActiveEnvironment => {
  const key = getActiveEnvironmentKey();
  const environment = environments[key];

  if (!environment) {
    throw new Error(`Unknown environment "${key}", check \`environments\` and \`defaultEnvironment\` in config.ts`);
  }

  return { ...environment, key };
};

/**
 * Export `getEnterpriseApi`.
 */

export const getEnterpriseApi = () => getActiveEnvironment().enterpriseApi;

/**
 * Export `getWidgetSessionUrlOverride`.
 */

export const getWidgetSessionUrlOverride = (widget: keyof NonNullable<EnvironmentProfile['widgets']>) =>
  getActiveEnvironment().widgets?.[widget]?.session.urlOverride;
