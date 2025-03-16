/**
 * Module dependencies.
 */

import './payment-widget.css';
import {
  PaymentWidget as PaymentWidgetClass,
  type PaymentWidgetCompleteEvent,
  type WidgetCancelEvent,
  type WidgetErrorEvent
} from '@uphold/enterprise-payment-widget-web-sdk';
import { useCreatePaymentSession } from '../../shared/react/payment-widget-session';
import { useEffect, useMemo, useState } from 'react';

/**
 * Export component.
 */

export default function PaymentWidget() {
  const { error, isLoading, paymentSession } = useCreatePaymentSession({ flow: 'select-for-deposit' });
  const [message, setMessage] = useState('');

  const widget = useMemo(() => {
    if (paymentSession) {
      const widget = new PaymentWidgetClass(paymentSession, { debug: true });

      const errorHandler = (e: WidgetErrorEvent) => {
        setMessage(`[PWSDK] 'error' event raised with error: ${JSON.stringify(e.detail.error)}`);

        widget.unmount();
      };

      const completeHandler = (e: PaymentWidgetCompleteEvent) => {
        setMessage(`[PWSDK] 'complete' event raised with externalAccountId: ${e.detail.externalAccountId}`);

        widget.unmount();
      };

      const cancelHandler = (_: WidgetCancelEvent) => {
        setMessage(`[PWSDK] 'cancel' event raised`);

        widget.unmount();
      };

      widget.on('error', errorHandler);
      widget.on('complete', completeHandler);
      widget.on('cancel', cancelHandler);

      widget.mountIframe(document.getElementById('root')!);

      return widget;
    }
  }, [paymentSession]);

  useEffect(() => {
    return () => {
      widget?.unmount();
    };
  }, [widget]);

  return (
    <div className="payment-widget-container">
      <h1>Payment Widget Web SDK Test Page</h1>
      {isLoading && <div className="loading">Loading...</div>}
      {error && (
        <div>
          <div className="error">
            <span className="error-icon">⚠️</span>
            <span className="error-message">An error occurred. Please try again later.</span>
          </div>
          <div>
            <br />
            <span>{error.toString()}</span>
          </div>
        </div>
      )}
      {message && (
        <div id="message" className="message">
          {message}
        </div>
      )}
      <div id="root" className="widget-container"></div>
    </div>
  );
}
