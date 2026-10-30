/**
 * Module dependencies.
 */

import type { PaymentWidgetOptions as BasePaymentWidgetOptions } from '@uphold/enterprise-widget-messaging-types';
import type { PaymentWidgetOptions } from '@uphold/enterprise-payment-widget-web-sdk';

/**
 * The options of a flow are edited as a single object, which is split on launch, as some of them are given when the
 * session is created, and the rest when the widget is created.
 */

// Duplicate of the SDK's internal type, as these options are only accepted when creating the session.
export type SessionOnlyPaymentWidgetOptions = Pick<
  BasePaymentWidgetOptions,
  'amountSuggestions' | 'availableAssets' | 'fees' | 'initialSelection'
>;

const SESSION_OPTION_KEYS = ['amountSuggestions', 'availableAssets', 'fees', 'initialSelection'];

export const splitOptions = (value: Record<string, unknown>) => {
  const sessionEntries = Object.entries(value).filter(([key]) => SESSION_OPTION_KEYS.includes(key));
  const optionEntries = Object.entries(value).filter(([key]) => !SESSION_OPTION_KEYS.includes(key));

  return {
    options: Object.fromEntries(optionEntries) as PaymentWidgetOptions,
    sessionOptions: Object.fromEntries(sessionEntries) as SessionOnlyPaymentWidgetOptions
  };
};
