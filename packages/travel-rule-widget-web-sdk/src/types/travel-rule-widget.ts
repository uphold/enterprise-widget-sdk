/**
 * Module dependencies.
 */

import type {
  TravelRuleWidgetOptions as BaseTravelRuleWidgetOptions,
  TravelRuleWidgetFlow,
  TravelRuleWidgetMessageEvent,
  TravelRuleWidgetSession
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

export type { TravelRuleWidgetFlow, TravelRuleWidgetSession };

type EarlyRenderTravelRuleWidgetOptions = {
  /**
   * Set it when creating the session in the back-end. Until a future release, also pass the same `layout` here to
   * avoid a brief change in appearance while the Widget loads the session. Values set when creating the session
   * take precedence.
   */
  layout?: BaseTravelRuleWidgetOptions['layout'];

  /**
   * Set it when creating the session in the back-end. Until a future release, also pass the same `theme` here to
   * avoid a brief change in appearance while the Widget loads the session. Values set when creating the session
   * take precedence.
   */
  theme?: BaseTravelRuleWidgetOptions['theme'];
};

export type TravelRuleWidgetOptions = Pick<WidgetOptions, 'debug'> &
  Omit<BaseTravelRuleWidgetOptions, keyof EarlyRenderTravelRuleWidgetOptions> &
  EarlyRenderTravelRuleWidgetOptions;

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
