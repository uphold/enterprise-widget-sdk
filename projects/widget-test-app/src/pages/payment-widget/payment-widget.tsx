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
 *
 */

type WidgetOptions = PaymentWidgetOptions & Record<string, unknown>;

type FlowButton = {
  label: string;
  flow: PaymentWidgetFlow;
  options?: WidgetOptions;
};

const DEFAULT_WIDGET_OPTIONS: WidgetOptions = {
  debug: true
};

const FLOW_BUTTONS: FlowButton[] = [
  { flow: 'select-for-deposit', label: 'Select for Deposit' },
  { flow: 'select-for-withdrawal', label: 'Select for Withdrawal' },
  {
    // WIP
    flow: 'e2e-dev',
    label: 'E2E ',
    options: {
      e2e: {
        type: 'deposit'
      }
    }
  },
  {
    // WIP
    flow: 'e2e-dev',
    label: 'E2E  (card only)',
    options: {
      e2e: {
        // externalAccount: {
        //   id: '664b1aa5-a524-4b0d-ac7c-d908ae3d49d1',
        //   type: 'external-account'
        // },
        internalAccount: {
          id: '4d01eedb-ea43-48aa-b73c-14f9bfee0e69',
          type: 'account'
        },
        type: 'deposit'
      },
      paymentMethods: [{ type: 'card' }]
    }
  },
  {
    flow: 'authorize',
    label: 'Authorize',
    options: {
      authorize: {
        mode: 'default'
      }
    }
  }
];

/**
 * Export component.
 */

export default function PaymentWidget() {
  const [createPaymentSessionData, setCreatePaymentSessionData] = useState<CreatePaymentSessionData>();
  const [selectedOptions, setSelectedOptions] = useState<WidgetOptions>();
  const { error: loadFlowDataError, isLoading: isLoadingFlowData, loadFlowData } = useFlowData();

  const onFlowButtonClick = (flow: PaymentWidgetFlow, options?: WidgetOptions) => {
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
      const options: WidgetOptions = {
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
