/**
 * Module dependencies.
 */

import {
  type WidgetCancelMessageType,
  type WidgetCompleteMessageType,
  type WidgetErrorMessageType,
  type WidgetLoadMessageType,
  type WidgetMessageEvent,
  type WidgetReadyMessageType
} from '@uphold/enterprise-widget-messaging-types';

/**
 * External API Types.
 */

export type WidgetLoadEventType = WidgetLoadMessageType;
export type WidgetReadyEventType = WidgetReadyMessageType;
export type WidgetCompleteEventType = WidgetCompleteMessageType;
export type WidgetCancelEventType = WidgetCancelMessageType;
export type WidgetErrorEventType = WidgetErrorMessageType;

export type WidgetLoadEventDetail = {
  type: WidgetLoadEventType;
};

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
  | WidgetLoadEvent<TMessageEvent>
  | WidgetReadyEvent<TMessageEvent>
  | WidgetCompleteEvent<TMessageEvent>
  | WidgetCancelEvent<TMessageEvent>
  | WidgetErrorEvent<TMessageEvent>;

export type WidgetMountIframeOptions = Record<string, unknown>;

export type WidgetOptions = {
  debug?: boolean;
};
