/**
 * Module dependencies.
 */

import type {
  TravelRuleWidgetFlow,
  TravelRuleWidgetMessageEvent,
  TravelRuleWidgetSession
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

export type { TravelRuleWidgetFlow, TravelRuleWidgetSession };

export type TravelRuleWidgetReadyEvent = WidgetReadyEvent<TravelRuleWidgetMessageEvent>;
export type TravelRuleWidgetCompleteEvent<TFlow extends TravelRuleWidgetFlow> = WidgetCompleteEvent<
  TravelRuleWidgetMessageEvent<TFlow>
>;
export type TravelRuleWidgetCancelEvent = WidgetCancelEvent<TravelRuleWidgetMessageEvent>;
export type TravelRuleWidgetErrorEvent = WidgetErrorEvent<TravelRuleWidgetMessageEvent>;

// This type could simply be WidgetEvent<TravelRuleWidgetMessageEvent> but it would be
// ugly for the consumers so we make the type definition a little more verbose than
// it should so it can give a more pleasant visualization of the types.
export type TravelRuleWidgetEvent<TFlow extends TravelRuleWidgetFlow = TravelRuleWidgetFlow> =
  | TravelRuleWidgetReadyEvent
  | TravelRuleWidgetCompleteEvent<TFlow>
  | TravelRuleWidgetCancelEvent
  | TravelRuleWidgetErrorEvent;
