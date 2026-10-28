/**
 * Module dependencies.
 */

import type { CreateQuoteData } from '../api';
import type { QuoteBodyConfig, UserProfile } from '../../../config';
import { getActiveEnvironment } from './active-environment';

/**
 * Constants.
 */

const QUERY_PARAM = 'user';
const STORAGE_KEY_PREFIX = 'widget-test-app:user';

/**
 * Types.
 */

export type ActiveUser = UserProfile & { key: string };

/**
 * Users of the active environment.
 */

const getEnvironmentUsers = (): Record<string, UserProfile> => getActiveEnvironment().users;

const isKnownUser = (key?: string | null): key is string => !!key && key in getEnvironmentUsers();

// User selection is stored per environment.
const getStorageKey = () => `${STORAGE_KEY_PREFIX}:${getActiveEnvironment().key}`;

/**
 * Read stored user key.
 */

const readStoredUserKey = () => {
  try {
    return window.localStorage.getItem(getStorageKey());
  } catch {
    return null;
  }
};

/**
 * Export `getUsers`.
 */

export const getUsers = (): ActiveUser[] =>
  Object.entries(getEnvironmentUsers()).map(([key, user]) => ({ ...user, key }));

/**
 * Export `getActiveUserKey`.
 * Resolution order: `?user=` query param, local storage, the environment's `defaultUser`.
 */

export const getActiveUserKey = () => {
  const { defaultUser } = getActiveEnvironment();

  if (typeof window === 'undefined') {
    return defaultUser;
  }

  const fromQuery = new URLSearchParams(window.location.search).get(QUERY_PARAM);

  if (isKnownUser(fromQuery)) {
    return fromQuery;
  }

  const fromStorage = readStoredUserKey();

  if (isKnownUser(fromStorage)) {
    return fromStorage;
  }

  return defaultUser;
};

/**
 * Export `setActiveUserKey`.
 */

export const setActiveUserKey = (key: string) => {
  if (!isKnownUser(key)) {
    throw new Error(`Unknown user "${key}"`);
  }

  try {
    window.localStorage.setItem(getStorageKey(), key);
  } catch {
    // Ignore storage errors, the query param still holds the selection.
  }

  const url = new URL(window.location.href);

  url.searchParams.set(QUERY_PARAM, key);
  window.history.replaceState(window.history.state, '', url);
};

/**
 * Export `getActiveUser`.
 */

export const getActiveUser = (): ActiveUser => {
  const key = getActiveUserKey();
  const user = getEnvironmentUsers()[key];

  if (!user) {
    throw new Error(
      `Unknown user "${key}" in environment "${getActiveEnvironment().key}", check its \`users\` and \`defaultUser\` in config.ts`
    );
  }

  return { ...user, key };
};

/**
 * Export `getOnBehalfOf`.
 */

export const getOnBehalfOf = () => `user ${getActiveUser().id}`;

/**
 * Export `resolveQuoteBody`.
 */

export const resolveQuoteBody = (body: QuoteBodyConfig, user: UserProfile = getActiveUser()): CreateQuoteData =>
  typeof body === 'function' ? body(user) : body;
