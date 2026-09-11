/**
 * Module dependencies.
 */

import type {
  WidgetCancelMessageEventData,
  WidgetCancelMessageType,
  WidgetCompleteMessageEventData,
  WidgetCompleteMessageType,
  WidgetError,
  WidgetErrorMessageEventData,
  WidgetErrorMessageType,
  WidgetLayout,
  WidgetMessageEvent,
  WidgetReadyMessageType,
  WidgetThemeOption
} from '@uphold/enterprise-widget-messaging-types';

/**
 * External API Types.
 */

export type {
  WidgetError,
  WidgetErrorMessageEventData,
  WidgetCompleteMessageEventData,
  WidgetCancelMessageEventData,
  WidgetLayout,
  WidgetThemeOption
};

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
  error: WidgetError;
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

  /**
   * Set it when creating the session in the back-end. Until a future release, also pass the same `layout` here to
   * avoid a brief change in appearance while the Widget loads the session. Values set when creating the session
   * take precedence.
   */
  layout?: WidgetLayout;

  /**
   * Set it when creating the session in the back-end. Until a future release, also pass the same `theme` here to
   * avoid a brief change in appearance while the Widget loads the session. Values set when creating the session
   * take precedence.
   */
  theme?: WidgetThemeOption;
};
