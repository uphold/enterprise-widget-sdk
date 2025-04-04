/**
 * Module dependencies.
 */

import './payment-widget.css';
import type { CreatePaymentSessionData } from '../../shared/api';
import {
  type PaymentWidgetCancelEvent,
  PaymentWidget as PaymentWidgetClass,
  type PaymentWidgetCompleteEvent,
  type PaymentWidgetErrorEvent
} from '@uphold/enterprise-payment-widget-web-sdk';
import type { PaymentWidgetFlow } from '@uphold/enterprise-widget-messaging-types';
import { useCreatePaymentSession } from '../../shared/react/payment-widget-session';
import { useEffect, useMemo, useState } from 'react';
import { useFlowData } from '../../shared/react/payment-widget-session/use-flow-data';

/**
 * Export component.
 */

export default function PaymentWidget() {
  const [createPaymentSessionData, setCreatePaymentSessionData] = useState<CreatePaymentSessionData>();
  const { error: loadFlowDataError, isLoading: isLoadingFlowData, loadFlowData } = useFlowData();

  const onFlowButtonClick = (flow: PaymentWidgetFlow) => {
    const load = async () => {
      const data = await loadFlowData(flow);

      setCreatePaymentSessionData({
        data,
        flow
      });
    };

    load();
  };

  const {
    error: createPaymentSessionError,
    isLoading: isCreatingPaymentSession,
    paymentSession
  } = useCreatePaymentSession(createPaymentSessionData);
  const [message, setMessage] = useState('');
  const isLoading = isLoadingFlowData || isCreatingPaymentSession;
  const error = loadFlowDataError || createPaymentSessionError;

  const widget = useMemo(() => {
    if (paymentSession) {
      const widget = new PaymentWidgetClass(paymentSession, { debug: true });

      const errorHandler = (e: PaymentWidgetErrorEvent) => {
        setMessage(`[PWSDK] 'error' event raised with error: ${JSON.stringify(e.detail.error)}`);

        widget.unmount();
      };

      const completeHandler = (e: PaymentWidgetCompleteEvent<PaymentWidgetFlow>) => {
        setMessage(`[PWSDK] 'complete' event raised with value: ${JSON.stringify(e.detail.value)}`);

        widget.unmount();
      };

      const cancelHandler = (_: PaymentWidgetCancelEvent) => {
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
      {!createPaymentSessionData && !isLoading && !error && (
        <div className="button-container">
          <p className="select-flow-text">Select flow:</p>
          <button className="action-button" onClick={() => onFlowButtonClick('select-for-deposit')}>
            Select for Deposit
          </button>
          <button className="action-button" onClick={() => onFlowButtonClick('select-for-withdrawal')}>
            Select for Withdrawal
          </button>
          <button className="action-button" onClick={() => onFlowButtonClick('authorize')}>
            Authorize
          </button>
        </div>
      )}

      <div id="root" className="widget-container"></div>
    </div>
  );
}
