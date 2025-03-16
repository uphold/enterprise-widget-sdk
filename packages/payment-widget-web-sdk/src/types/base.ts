/**
 * Module dependencies.
 */

import {
  type WidgetCancelMessageType,
  type WidgetCompleteMessageType,
  type WidgetErrorMessageType,
  type WidgetLoadMessageType,
  type WidgetReadyMessageType
} from '@uphold/enterprise-widget-messaging-types';

/**
 * External API Types.
 */

export type WidgetCompleteEventType = WidgetCompleteMessageType;
export type WidgetCancelEventType = WidgetCancelMessageType;
export type WidgetErrorEventType = WidgetErrorMessageType;
export type WidgetLoadEventType = WidgetLoadMessageType;
export type WidgetReadyEventType = WidgetReadyMessageType;

export type WidgetErrorEventDetail = {
  error: string;
};

export interface WidgetCompleteEvent extends CustomEvent {
  type: WidgetCompleteEventType;
}

export interface WidgetErrorEvent extends CustomEvent<WidgetErrorEventDetail> {
  type: WidgetErrorEventType;
}

export interface WidgetLoadEvent extends CustomEvent {
  type: WidgetLoadEventType;
}

export interface WidgetCancelEvent extends CustomEvent {
  type: WidgetCancelEventType;
}

export interface WidgetReadyEvent extends CustomEvent {
  type: WidgetReadyEventType;
}

export type WidgetEvent =
  | WidgetCompleteEvent
  | WidgetErrorEvent
  | WidgetCancelEvent
  | WidgetLoadEvent
  | WidgetReadyEvent;

export type EventByType<Event extends { type: string }, T extends Event['type']> = Event extends infer E
  ? E extends { type: T }
    ? E
    : never
  : never;

export type WidgetMountIframeOptions = Record<string, unknown>;

export type WidgetOptions = {
  debug?: boolean;
};
