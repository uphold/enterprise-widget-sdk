/**
 * Module dependencies.
 */

import { DEFAULT_WIDGET_OPTIONS } from '../flows';
import type { LastEvent } from '../components/last-event';
import {
  type PaymentWidgetCancelEvent,
  PaymentWidget as PaymentWidgetClass,
  type PaymentWidgetCompleteEvent,
  type PaymentWidgetErrorEvent,
  type PaymentWidgetFlow,
  type PaymentWidgetOptions
} from '@uphold/enterprise-payment-widget-web-sdk';
import { useEffect, useMemo } from 'react';

/**
 * Types.
 */

type PaymentSession = ConstructorParameters<typeof PaymentWidgetClass>[0];

/**
 * Mounts the widget in the page, as soon as there is a session, and unmounts it when it raises an event or when the
 * page no longer shows it.
 */

export const useMountedWidget = (
  paymentSession: PaymentSession | undefined,
  widgetOptions: PaymentWidgetOptions | undefined,
  onEvent: (event: LastEvent) => void
) => {
  // The handler of the events is a state setter, which does not change, so the widget depends only on what it shows.
  const widget = useMemo(() => {
    if (paymentSession) {
      const options: PaymentWidgetOptions = {
        ...DEFAULT_WIDGET_OPTIONS,
        ...widgetOptions
      };

      const widget = new PaymentWidgetClass(paymentSession, options);

      const errorHandler = (e: PaymentWidgetErrorEvent) => {
        onEvent({ type: 'error', value: e.detail.error });

        widget.unmount();
      };

      const completeHandler = (e: PaymentWidgetCompleteEvent<PaymentWidgetFlow>) => {
        onEvent({ type: 'complete', value: e.detail.value });

        widget.unmount();
      };

      const cancelHandler = (_: PaymentWidgetCancelEvent) => {
        onEvent({ type: 'cancel' });

        widget.unmount();
      };

      widget.on('error', errorHandler);
      widget.on('complete', completeHandler);
      widget.on('cancel', cancelHandler);

      widget.mountIframe(document.getElementById('root')!);

      return widget;
    }
  }, [paymentSession, widgetOptions]);

  useEffect(() => {
    return () => {
      widget?.unmount();
    };
  }, [widget]);
};
