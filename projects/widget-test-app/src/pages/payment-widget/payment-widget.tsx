/**
 * Module dependencies.
 */

import './payment-widget.css';
import type { CreatePaymentSessionData } from '../../shared/api';
import {
  type PaymentWidgetCancelEvent,
  PaymentWidget as PaymentWidgetClass,
  type PaymentWidgetCompleteEvent,
  type PaymentWidgetErrorEvent,
  type PaymentWidgetFlow,
  type PaymentWidgetOptions
} from '@uphold/enterprise-payment-widget-web-sdk';
import { useCreatePaymentSession } from '../../shared/react/payment-widget-session';
import { useEffect, useMemo, useState } from 'react';
import { useFlowData } from '../../shared/react/payment-widget-session/use-flow-data';

/**
 * Flow button configs.
 */

type FlowButton = {
  label: string;
  flow: PaymentWidgetFlow;
  options?: PaymentWidgetOptions;
};

const DEFAULT_WIDGET_OPTIONS: PaymentWidgetOptions = {
  debug: true
};

const FLOW_BUTTONS: FlowButton[] = [
  {
    flow: 'select-for-deposit',
    label: 'Select for Deposit'
  },
  { flow: 'select-for-withdrawal', label: 'Select for Withdrawal' },
  {
    flow: 'deposit',
    label: 'E2E Deposit (w/ Asset opt)',
    options: {
      e2e: {
        asset: 'ACN',
        fees: { display: 'only-total' },
        presetAmountsByCurrencyCode: { GBP: [5, 10, 15, 20], USD: [5, 10, 15, 20] }
        // targetAccountId: 'ad123a42-ee77-448d-91c7-5d17b7362561'
      }
    }
  },

  {
    flow: 'deposit',
    label: 'E2E Deposit (w/ targetAccountId opt)',
    options: {
      e2e: {
        // asset: 'BTC',
        fees: { display: 'only-total' },
        presetAmountsByCurrencyCode: { GBP: [5, 10, 15, 20], USD: [5, 10, 15, 20] },
        targetAccountId: 'ad123a42-ee77-448d-91c7-5d17b7362561-----error'
      }
    }
  },
  {
    flow: 'deposit',
    label: 'E2E Deposit (w/ all fees opt)',
    options: {
      e2e: {
        fees: { display: 'all' },
        presetAmountsByCurrencyCode: { GBP: [5, 10, 15, 20], USD: [5, 10, 15, 20] },
        targetAccountId: 'ad123a42-ee77-448d-91c7-5d17b7362561'
      }
    }
  },
  {
    flow: 'withdrawal',
    label: 'E2E Withdraw (w/ targetAccountId opt)',
    options: {
      e2e: {
        fees: { display: 'only-total' },
        presetAmountsByCurrencyCode: { GBP: [5, 10, 15, 20], USD: [5, 10, 15, 20] },
        targetAccountId: 'ad123a42-ee77-448d-91c7-5d17b7362561'
      }
    }
  },
  {
    flow: 'authorize',
    label: 'Authorize',
    options: {}
  },
  {
    flow: 'authorize',
    label: 'Authorize headless',
    options: {
      authorize: {
        mode: 'headless'
      }
    }
  }
];

/**
 * Export component.
 */

export default function PaymentWidget() {
  const [createPaymentSessionData, setCreatePaymentSessionData] = useState<CreatePaymentSessionData>();
  const [selectedOptions, setSelectedOptions] = useState<PaymentWidgetOptions>();
  const { error: loadFlowDataError, isLoading: isLoadingFlowData, loadFlowData } = useFlowData();

  const onFlowButtonClick = (flow: PaymentWidgetFlow, options?: PaymentWidgetOptions) => {
    const load = async () => {
      const data = await loadFlowData(flow);

      setSelectedOptions(options);
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
      const options: PaymentWidgetOptions = {
        ...DEFAULT_WIDGET_OPTIONS,
        ...selectedOptions
      };

      const widget = new PaymentWidgetClass(
        paymentSession,

        options
      );

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
  }, [paymentSession, selectedOptions]);

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
        <details className="error-details">
          <summary className="error">
            <span className="error-icon">⚠️</span>
            <span className="error-message">An error occurred. Please try again later.</span>
          </summary>
          <div>
            <br />
            <span>{error.toString()}</span>
          </div>
        </details>
      )}
      {message && (
        <details className="message-details">
          <summary className="message" id="message">
            Message
          </summary>
          <div>
            <br />
            <span>{message}</span>
          </div>
        </details>
      )}
      {!createPaymentSessionData && !isLoading && !error && (
        <div className="button-container">
          <p className="select-flow-text">Select flow:</p>
          {FLOW_BUTTONS.map((button, index) => (
            <button
              key={`${button.flow}-${index}`}
              className="action-button"
              onClick={() => onFlowButtonClick(button.flow, button.options)}
            >
              {button.label}
            </button>
          ))}
        </div>
      )}

      <div id="root" className="widget-container"></div>
    </div>
  );
}
