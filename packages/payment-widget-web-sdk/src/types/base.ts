/**
 * Module dependencies.
 */

import {
  type WidgetCancelMessageEventData,
  type WidgetCancelMessageType,
  type WidgetCompleteMessageEventData,
  type WidgetCompleteMessageType,
  type WidgetError,
  type WidgetErrorMessageEventData,
  type WidgetErrorMessageType,
  type WidgetMessageEvent,
  type WidgetReadyMessageType
} from '@uphold/enterprise-widget-messaging-types';

/**
 * External API Types.
 */

export type { WidgetError, WidgetErrorMessageEventData, WidgetCompleteMessageEventData, WidgetCancelMessageEventData };

export type WidgetReadyEventType = WidgetReadyMessageType;
export type WidgetCompleteEventType = WidgetCompleteMessageType;
export type WidgetCancelEventType = WidgetCancelMessageType;
export type WidgetErrorEventType = WidgetErrorMessageType;

export type WidgetReadyEventDetail = {
  type: WidgetReadyEventType;
};

export type WidgetCompleteEventDetail = {
  type: WidgetCompleteEventType;
};

export type WidgetCancelEventDetail = {
  type: WidgetCancelEventType;
};

export type WidgetErrorEventDetail = {
  type: WidgetErrorEventType;
  error: string;
};

export type ExtractMessageEventDataForType<
  TMessageEvent extends WidgetMessageEvent,
  TType extends TMessageEvent['data']['type']
> = Extract<TMessageEvent, { data: { type: TType } }>['data'];

export type WidgetLoadEvent<TMessageEvent extends WidgetMessageEvent> = CustomEvent<
  ExtractMessageEventDataForType<TMessageEvent, 'load'>
>;
export type WidgetReadyEvent<TMessageEvent extends WidgetMessageEvent> = CustomEvent<
  ExtractMessageEventDataForType<TMessageEvent, 'ready'>
>;
export type WidgetCompleteEvent<TMessageEvent extends WidgetMessageEvent> = CustomEvent<
  ExtractMessageEventDataForType<TMessageEvent, 'complete'>
>;
export type WidgetCancelEvent<TMessageEvent extends WidgetMessageEvent> = CustomEvent<
  ExtractMessageEventDataForType<TMessageEvent, 'cancel'>
>;
export type WidgetErrorEvent<TMessageEvent extends WidgetMessageEvent> = CustomEvent<
  ExtractMessageEventDataForType<TMessageEvent, 'error'>
>;

export type WidgetEvent<TMessageEvent extends WidgetMessageEvent = WidgetMessageEvent> =
  | WidgetReadyEvent<TMessageEvent>
  | WidgetCompleteEvent<TMessageEvent>
  | WidgetCancelEvent<TMessageEvent>
  | WidgetErrorEvent<TMessageEvent>;

export type WidgetMountIframeOptions = Record<string, unknown>;

export type WidgetOptions = {
  debug?: boolean;
};

export type PaymentWidgetOptions = WidgetOptions;
