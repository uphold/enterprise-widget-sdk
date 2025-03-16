/**
 * Exports.
 */

import type {
  WidgetCancelEvent,
  WidgetCompleteEventType,
  WidgetErrorEvent,
  WidgetLoadEvent,
  WidgetReadyEvent
} from './base';

export type PaymentWidgetCompleteEventDetail = {
  externalAccountId: string;
};

export interface PaymentWidgetCompleteEvent extends CustomEvent<PaymentWidgetCompleteEventDetail> {
  type: WidgetCompleteEventType;
}

export type PaymentWidgetEvent =
  | PaymentWidgetCompleteEvent
  | WidgetCancelEvent
  | WidgetErrorEvent
  | WidgetReadyEvent
  | WidgetLoadEvent;
