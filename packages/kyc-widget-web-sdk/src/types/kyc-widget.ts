/**
 * Module dependencies.
 */

import type {
  KycWidgetOptions as BaseKycWidgetOptions,
  KycWidgetMessageEvent,
  KycWidgetProcess,
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

export type { KycWidgetProcess };

export type KycWidgetSession = WidgetSession & {
  /**
   * @deprecated This information is now loaded automatically - make sure to pass the full `url` property, including
   * its query string, when initializing the widget.
   */
  data?: { processes: KycWidgetProcess[] };
};

export type KycWidgetReadyEvent = WidgetReadyEvent<KycWidgetMessageEvent>;
export type KycWidgetCompleteEvent = WidgetCompleteEvent<KycWidgetMessageEvent>;
export type KycWidgetCancelEvent = WidgetCancelEvent<KycWidgetMessageEvent>;
export type KycWidgetErrorEvent = WidgetErrorEvent<KycWidgetMessageEvent>;

// This type could simply be WidgetEvent<KycWidgetMessageEvent> but it would be
// ugly for the consumers so we make the type definition a little more verbose than
// it should so it can give a more pleasant visualization of the types.
export type KycWidgetEvent = KycWidgetReadyEvent | KycWidgetCompleteEvent | KycWidgetCancelEvent | KycWidgetErrorEvent;

type EarlyRenderKycWidgetOptions = {
  /**
   * Set it when creating the session in the back-end. Until a future release, also pass the same `layout` here to
   * avoid a brief change in appearance while the Widget loads the session. Values set when creating the session
   * take precedence.
   */
  layout?: BaseKycWidgetOptions['layout'];

  /**
   * Set it when creating the session in the back-end. Until a future release, also pass the same `theme` here to
   * avoid a brief change in appearance while the Widget loads the session. Values set when creating the session
   * take precedence.
   */
  theme?: BaseKycWidgetOptions['theme'];
};

export type KycWidgetOptions = Pick<WidgetOptions, 'debug'> &
  Omit<BaseKycWidgetOptions, keyof EarlyRenderKycWidgetOptions> &
  EarlyRenderKycWidgetOptions;
