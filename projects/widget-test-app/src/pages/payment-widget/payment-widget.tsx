/**
 * Module dependencies.
 */

import type { CreatePaymentSessionData } from '../../shared/api';
import { JsonBlock, PageHeader } from '../../shared/react/components';
import { type OrderQuoteConfigKey, useFlowData } from '../../shared/react/payment-widget-session/use-flow-data';
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

/**
 * Last event raised by the widget.
 */

type LastEvent = {
  type: 'cancel' | 'complete' | 'error';
  value?: unknown;
};

/**
 * Flow groups.
 */

type FlowGroup = {
  description: string;
  title: string;
  matches: (flow: PaymentWidgetFlow) => boolean;
};

const FLOW_GROUPS: FlowGroup[] = [
  {
    description: 'Select where funds come from or go to, and authorize a transaction.',
    matches: flow => flow.startsWith('transaction:'),
    title: 'Transactions'
  },
  {
    description: 'Select the payment methods of on-ramp and off-ramp orders.',
    matches: flow => flow.startsWith('on-ramp:') || flow.startsWith('off-ramp:'),
    title: 'Order · select'
  },
  {
    description: 'Create an on-ramp order, authorizing its card or alternative payment method deposit.',
    matches: flow => flow === 'order:authorize-deposit',
    title: 'Order · authorize'
  },
  {
    description: 'Complete deposit and withdrawal journeys, from amount to confirmation.',
    matches: flow => flow === 'deposit' || flow === 'withdrawal',
    title: 'End to end'
  },
  {
    description: 'Previous flow names, kept as aliases of the transaction flows.',
    matches: flow => ['select-for-deposit', 'select-for-withdrawal', 'authorize'].includes(flow),
    title: 'Deprecated aliases'
  }
];

/**
 * Flow button configs.
 */

type FlowButton = {
  label: string;
  flow: PaymentWidgetFlow;
  options?: PaymentWidgetOptions;
  // Config key of the order quote body, for the `order:authorize-deposit` flow.
  orderQuoteConfigKey?: OrderQuoteConfigKey;
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
    label: 'E2E Deposit (w/ asset opt)',
    options: {
      amountSuggestions: {
        EUR: [25, 50, 100, 150],
        GBP: [25, 50, 100, 150],
        USD: [25, 50, 100, 150]
      },
      availableAssets: { include: ['GBP', 'BTC', 'XRP'] },
      fees: { display: 'total' },
      initialSelection: {
        destination: { asset: 'BTC' }
      }
    }
  },

  {
    flow: 'deposit',
    label: 'E2E Deposit (w/ accountId opt)',
    options: {
      amountSuggestions: {
        EUR: [25, 50, 100, 150],
        GBP: [25, 50, 100, 150],
        USD: [25, 50, 100, 150]
      },
      availableAssets: { include: ['GBP', 'BTC', 'XRP'] },
      fees: { display: 'breakdown' },
      initialSelection: {
        destination: { accountId: 'c83373fd-a0ec-41be-9d9f-37a04370bb69' }
      }
    }
  },
  {
    flow: 'withdrawal',
    label: 'E2E Withdraw (w/ accountId opt)',
    options: {
      amountSuggestions: {
        EUR: [25, 50, 100, 150],
        GBP: [25, 50, 100, 150],
        USD: [25, 50, 100, 150]
      },
      fees: { display: 'total' },
      initialSelection: {
        origin: { accountId: 'c83373fd-a0ec-41be-9d9f-37a04370bb69' }
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
  },

  // Transaction flows (the `<context>:<action>` names of `select-for-deposit`, `select-for-withdrawal` and
  // `authorize`).
  { flow: 'transaction:select-origin', label: 'Transaction: Select Origin' },
  { flow: 'transaction:select-destination', label: 'Transaction: Select Destination' },
  { flow: 'transaction:authorize', label: 'Transaction: Authorize', options: {} },

  // Order flows.
  { flow: 'on-ramp:select-origin', label: 'On-ramp: Select Origin' },
  {
    // Only `card` is shown, since it is the only one of the requested methods that the flow allows.
    flow: 'on-ramp:select-origin',
    label: 'On-ramp: Select Origin (bank, card, crypto -> card only)',
    options: {
      paymentMethods: [{ type: 'bank' }, { type: 'card' }, { type: 'crypto' }]
    }
  },
  { flow: 'on-ramp:select-destination', label: 'On-ramp: Select Destination' },
  { flow: 'off-ramp:select-origin', label: 'Off-ramp: Select Origin' },
  { flow: 'off-ramp:select-destination', label: 'Off-ramp: Select Destination' },
  {
    flow: 'order:authorize-deposit',
    label: 'Order: Authorize Deposit (card)',
    options: {},
    orderQuoteConfigKey: 'order-authorize-deposit-card'
  },
  {
    flow: 'order:authorize-deposit',
    label: 'Order: Authorize Deposit (PayPal)',
    options: {},
    orderQuoteConfigKey: 'order-authorize-deposit-paypal'
  },
  {
    flow: 'order:authorize-deposit',
    label: 'Order: Authorize Deposit (PayPal, headless)',
    options: {
      authorize: {
        mode: 'headless'
      }
    },
    orderQuoteConfigKey: 'order-authorize-deposit-paypal'
  }
];

/**
 * Export component.
 */

export default function PaymentWidget() {
  const [createPaymentSessionData, setCreatePaymentSessionData] = useState<CreatePaymentSessionData>();
  const [selectedOptions, setSelectedOptions] = useState<PaymentWidgetOptions>();
  const [selectedButton, setSelectedButton] = useState<FlowButton | null>(null);
  const { error: loadFlowDataError, isLoading: isLoadingFlowData, loadFlowData, reset: resetFlowData } = useFlowData();

  const onFlowButtonClick = (button: FlowButton) => {
    const { flow, options, orderQuoteConfigKey } = button;

    const load = async () => {
      const data = await loadFlowData(flow, orderQuoteConfigKey);

      setSelectedButton(button);
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
  const [lastEvent, setLastEvent] = useState<LastEvent | null>(null);
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
        setLastEvent({ type: 'error', value: e.detail.error });

        widget.unmount();
      };

      const completeHandler = (e: PaymentWidgetCompleteEvent<PaymentWidgetFlow>) => {
        setLastEvent({ type: 'complete', value: e.detail.value });

        widget.unmount();
      };

      const cancelHandler = (_: PaymentWidgetCancelEvent) => {
        setLastEvent({ type: 'cancel' });

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

  const isIdle = !createPaymentSessionData && !isLoading && !error;

  // Goes back to the flow list, unmounting the widget (if any) and clearing the last result or error.
  const onBackToFlows = () => {
    setCreatePaymentSessionData(undefined);
    setSelectedOptions(undefined);
    setSelectedButton(null);
    setLastEvent(null);
    resetFlowData();
  };

  return (
    <div className="payment-widget-container">
      {/* The description is dropped once a flow is launched, to leave more room for the widget. */}
      <PageHeader
        backLabel="← All flows"
        onBack={isIdle ? undefined : onBackToFlows}
        subtitle={
          isIdle || !selectedButton ? (
            'Launch any payment widget flow against your configured environment.'
          ) : (
            <span className="selected-flow">
              <span className="selected-flow-label">{selectedButton.label}</span>
              <span className="flow-card-flow">{selectedButton.flow}</span>
            </span>
          )
        }
        title="Payment Widget"
      />

      {isLoading && <div className="loading">Loading…</div>}
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
      {lastEvent && (
        <details className="message-details" open>
          <summary className="event-summary" id="message">
            Last event
            <span className={`event-badge ${lastEvent.type}`}>{lastEvent.type}</span>
          </summary>
          <div>
            {lastEvent.value !== undefined ? (
              <JsonBlock title={lastEvent.type === 'error' ? 'Error' : 'Value'} value={lastEvent.value} />
            ) : (
              <span>The user cancelled the flow.</span>
            )}
          </div>
        </details>
      )}
      {isIdle && (
        <div className="flow-sections">
          {FLOW_GROUPS.map(group => {
            const buttons = FLOW_BUTTONS.filter(button => group.matches(button.flow));

            if (buttons.length === 0) {
              return null;
            }

            return (
              <section key={group.title} className="section">
                <div className="section-header">
                  <h2 className="section-title">{group.title}</h2>
                  <p className="section-description">{group.description}</p>
                </div>
                <div className="flow-grid">
                  {buttons.map((button, index) => (
                    <button
                      key={`${button.flow}-${index}`}
                      className="flow-card"
                      onClick={() => onFlowButtonClick(button)}
                    >
                      <span className="flow-card-label">{button.label}</span>
                      <span className="flow-card-flow">{button.flow}</span>
                    </button>
                  ))}
                </div>
              </section>
            );
          })}
        </div>
      )}

      <div id="root" className="widget-container"></div>
    </div>
  );
}
