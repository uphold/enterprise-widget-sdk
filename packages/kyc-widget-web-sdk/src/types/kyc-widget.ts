/**
 * Module dependencies.
 */

import type {
  KycWidgetOptions as BaseKycWidgetOptions,
  KycProcess,
  KycWidgetMessageEvent,
  WidgetSession
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

export type { KycProcess };
export type KycWidgetSession = WidgetSession;

export type KycWidgetReadyEvent = WidgetReadyEvent<KycWidgetMessageEvent>;
export type KycWidgetCompleteEvent = WidgetCompleteEvent<KycWidgetMessageEvent>;
export type KycWidgetCancelEvent = WidgetCancelEvent<KycWidgetMessageEvent>;
export type KycWidgetErrorEvent = WidgetErrorEvent<KycWidgetMessageEvent>;

// This type could simply be WidgetEvent<KycWidgetMessageEvent> but it would be
// ugly for the consumers so we make the type definition a little more verbose than
// it should so it can give a more pleasant visualization of the types.
export type KycWidgetEvent = KycWidgetReadyEvent | KycWidgetCompleteEvent | KycWidgetCancelEvent | KycWidgetErrorEvent;
export type KycWidgetOptions = WidgetOptions & BaseKycWidgetOptions;
