/**
 * Module dependencies.
 */

import type { PaymentWidgetOptions } from '@uphold/enterprise-payment-widget-web-sdk';

/**
 * Appearance of the widget. `system` leaves it unset, so the widget follows the preference of the device.
 */

export type Appearance = 'dark' | 'light' | 'system';

export const APPEARANCES: { id: Appearance; label: string }[] = [
  { id: 'system', label: 'System' },
  { id: 'light', label: 'Light' },
  { id: 'dark', label: 'Dark' }
];

const APPEARANCE_STORAGE_KEY = 'widget-test-app:appearance';

export const getStoredAppearance = (): Appearance => {
  try {
    const stored = window.localStorage.getItem(APPEARANCE_STORAGE_KEY);

    return APPEARANCES.some(({ id }) => id === stored) ? (stored as Appearance) : 'system';
  } catch {
    return 'system';
  }
};

export const storeAppearance = (appearance: Appearance) => {
  try {
    window.localStorage.setItem(APPEARANCE_STORAGE_KEY, appearance);
  } catch {
    // The choice is only not remembered.
  }
};

// The appearance is the one chosen when the flow is launched, unless the options already set it.
export const withAppearance = (options: PaymentWidgetOptions | undefined, appearance: Appearance) =>
  appearance === 'system' || options?.theme?.appearance
    ? options
    : { ...options, theme: { ...options?.theme, appearance } };
