/**
 * Module dependencies.
 */

import type {
  Account,
  AccountDepositMethod,
  AccountDepositMethodSelection,
  AuthorizeResult,
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
