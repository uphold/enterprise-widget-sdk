/**
 * Module dependencies.
 */

import type {
  Account,
  AccountDepositMethod,
  AccountDepositMethodSelection,
  AuthorizeResult,
  PaymentWidgetOptions as BasePaymentWidgetOptions,
  DepositSelection,
  ExternalAccount,
  ExternalAccountSelection,
  PaymentWidgetFlow,
  PaymentWidgetMessageEvent,
  PaymentWidgetSession,
  Transaction,
  WithdrawalSelection
} from '@uphold/enterprise-widget-messaging-types';
import type {
  WidgetCancelEvent,
  WidgetCompleteEvent,
  WidgetErrorEvent,
  WidgetOptions,
  WidgetReadyEvent
} from '@uphold/enterprise-widget-sdk-core';

/**
 * Exports.
 */

export type {
  Account,
  AccountDepositMethod,
  AccountDepositMethodSelection,
  AuthorizeResult,
  DepositSelection,
  ExternalAccount,
  ExternalAccountSelection,
  PaymentWidgetFlow,
  PaymentWidgetSession,
  Transaction,
  WithdrawalSelection
};

export type PaymentWidgetReadyEvent = WidgetReadyEvent<PaymentWidgetMessageEvent>;
export type PaymentWidgetCompleteEvent<TFlow extends PaymentWidgetFlow> = WidgetCompleteEvent<
  PaymentWidgetMessageEvent<TFlow>
>;
export type PaymentWidgetCancelEvent = WidgetCancelEvent<PaymentWidgetMessageEvent>;
export type PaymentWidgetErrorEvent = WidgetErrorEvent<PaymentWidgetMessageEvent>;

// This type could simply be WidgetEvent<PaymentWidgetMessageEvent> but it would be
// ugly for the consumers so we make the type definition a little more verbose than
// it should so it can give a more pleasant visualization of the types.
export type PaymentWidgetEvent<TFlow extends PaymentWidgetFlow = PaymentWidgetFlow> =
  | PaymentWidgetReadyEvent
  | PaymentWidgetCompleteEvent<TFlow>
  | PaymentWidgetCancelEvent
  | PaymentWidgetErrorEvent;

type EarlyRenderPaymentWidgetOptions = {
  /**
   * Set it when creating the session in the back-end. Until a future release, also pass the same `authorize.mode` here to
   * avoid a brief change in appearance while the Widget loads the session. Values set when creating the session
   * take precedence.
   */
  authorize?: BasePaymentWidgetOptions['authorize'];

  /**
   * Set it when creating the session in the back-end. Until a future release, also pass the same `layout` here to
   * avoid a brief change in appearance while the Widget loads the session. Values set when creating the session
   * take precedence.
   */
  layout?: BasePaymentWidgetOptions['layout'];

  /**
   * Set it when creating the session in the back-end. Until a future release, also pass the same `theme` here to
   * avoid a brief change in appearance while the Widget loads the session. Values set when creating the session
   * take precedence.
   */
  theme?: BasePaymentWidgetOptions['theme'];
};

type DeprecatedPaymentWidgetOptions = {
  /**
   * @deprecated Pass the `maxAccountsPerAsset` option when creating the session in the back-end.
   */
  maxAccountsPerAsset?: BasePaymentWidgetOptions['maxAccountsPerAsset'];

  /**
   * @deprecated Pass the `paymentMethods` option when creating the session in the back-end.
   */
  paymentMethods?: BasePaymentWidgetOptions['paymentMethods'];
};

export type PaymentWidgetOptions = Pick<WidgetOptions, 'debug'> &
  Omit<BasePaymentWidgetOptions, keyof EarlyRenderPaymentWidgetOptions | keyof DeprecatedPaymentWidgetOptions> &
  EarlyRenderPaymentWidgetOptions &
  DeprecatedPaymentWidgetOptions;
