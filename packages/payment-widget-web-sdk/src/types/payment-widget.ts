/**
 * Module dependencies.
 */

import type { PaymentWidgetFlow, PaymentWidgetMessageEvent } from '@uphold/enterprise-widget-messaging-types';
import type {
  WidgetCancelEvent,
  WidgetCompleteEvent,
  WidgetErrorEvent,
  WidgetLoadEvent,
  WidgetReadyEvent
} from './base';

/**
 * Exports.
 */

export type PaymentWidgetLoadEvent = WidgetLoadEvent<PaymentWidgetMessageEvent>;
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
  | PaymentWidgetLoadEvent
  | PaymentWidgetReadyEvent
  | PaymentWidgetCompleteEvent<TFlow>
  | PaymentWidgetCancelEvent
  | PaymentWidgetErrorEvent;
