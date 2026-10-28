/**
 * Module dependencies.
 */

import type { PaymentWidgetFlow, PaymentWidgetOptions } from '@uphold/enterprise-payment-widget-web-sdk';
import type { QuoteConfigKey } from '../../shared/react/payment-widget-session/use-flow-data';
import type { SessionOnlyPaymentWidgetOptions } from './options/split-options';

/**
 * Flow categories. The first screen lists them, and choosing one lists its flows.
 */

export type FlowSection = {
  description?: string;
  title?: string;
  matches: (flow: PaymentWidgetFlow) => boolean;
};

export type FlowCategory = {
  description: string;
  id: string;
  sections: FlowSection[];
  title: string;
};

export const FLOW_CATEGORIES: FlowCategory[] = [
  {
    description: 'Select where funds come from or go to, and authorize a transaction.',
    id: 'transactions',
    sections: [
      { matches: flow => flow.startsWith('transaction:') },
      {
        description: 'Previous flow names, kept as aliases of the transaction flows.',
        matches: flow => ['select-for-deposit', 'select-for-withdrawal', 'authorize'].includes(flow),
        title: 'Deprecated aliases'
      }
    ],
    title: 'Transaction flows'
  },
  {
    description: 'Select the payment methods of on-ramp and off-ramp orders, and authorize the deposit of an order.',
    id: 'orders',
    sections: [
      {
        description: 'Select the payment methods of on-ramp orders.',
        matches: flow => flow.startsWith('on-ramp:'),
        title: 'On-ramp'
      },
      {
        description: 'Select the payment methods of off-ramp orders.',
        matches: flow => flow.startsWith('off-ramp:'),
        title: 'Off-ramp'
      },
      {
        description: 'Create an on-ramp order, authorizing its card or alternative payment method deposit.',
        matches: flow => flow === 'order:authorize-deposit',
        title: 'Order'
      }
    ],
    title: 'On/off-ramp flows'
  },
  {
    description: 'Complete deposit and withdrawal journeys, from amount to confirmation.',
    id: 'end-to-end',
    sections: [{ matches: flow => flow === 'deposit' || flow === 'withdrawal' }],
    title: 'End-to-end flows'
  }
];

/**
 * Flow button configs.
 */

export type AuthorizeMethod = {
  id: string;
  label: string;
  // Config key of the body of the quote with this payment method as origin.
  quoteConfigKey: QuoteConfigKey;
  // Shown next to the headless option when it is chosen.
  headlessNote?: string;
};

export type AuthorizeSelection = {
  isHeadless: boolean;
  methodId: string;
};

export type FlowButton = {
  label: string;
  flow: PaymentWidgetFlow;
  options?: PaymentWidgetOptions;
  sessionOptions?: SessionOnlyPaymentWidgetOptions;
  // Config key of the quote body of the authorize flows. Defaults to the first of each.
  quoteConfigKey?: QuoteConfigKey;
  // The payment methods the authorize flows can be tried with, which are chosen next to the flow.
  methods?: AuthorizeMethod[];
};

const TRANSACTION_AUTHORIZE_METHODS: AuthorizeMethod[] = [
  { id: 'card', label: 'Card', quoteConfigKey: 'authorize' },
  { id: 'paypal', label: 'PayPal', quoteConfigKey: 'paypal-authorize' },
  { id: 'venmo', label: 'Venmo', quoteConfigKey: 'venmo-authorize' },
  { id: 'apple-pay', label: 'Apple Pay', quoteConfigKey: 'apple-pay-authorize' },
  {
    headlessNote: 'Only on Android.',
    id: 'google-pay',
    label: 'Google Pay',
    quoteConfigKey: 'google-pay-authorize'
  }
];

const ORDER_AUTHORIZE_METHODS: AuthorizeMethod[] = [
  { id: 'card', label: 'Card', quoteConfigKey: 'order-authorize-deposit-card' },
  { id: 'paypal', label: 'PayPal', quoteConfigKey: 'order-authorize-deposit-paypal' },
  { id: 'apple-pay', label: 'Apple Pay', quoteConfigKey: 'order-authorize-deposit-apple-pay' },
  {
    headlessNote: 'Only on Android.',
    id: 'google-pay',
    label: 'Google Pay',
    quoteConfigKey: 'order-authorize-deposit-google-pay'
  }
];

export const DEFAULT_WIDGET_OPTIONS: PaymentWidgetOptions = {
  debug: true
};

export const FLOW_BUTTONS: FlowButton[] = [
  {
    flow: 'select-for-deposit',
    label: 'Select for Deposit',
    options: {
      paymentMethods: [{ type: 'bank' }]
    }
  },
  { flow: 'select-for-withdrawal', label: 'Select for Withdrawal' },
  {
    flow: 'deposit',
    label: 'Deposit (w/ asset opt)',
    // Not a session option, as it is given to the widget when it is created.
    options: {
      paymentMethods: [{ type: 'bank' }]
    },
    sessionOptions: {
      amountSuggestions: {
        EUR: [25, 50, 100, 150],
        GBP: [25, 50, 100, 150],
        USD: [25, 50, 100, 150]
      },
      // availableAssets: { include: ['GBP', 'USD', 'BTC', 'XRP'] },
      fees: { display: 'total' }
      // initialSelection: {
      //   destination: { asset: 'GBP' }
      // }
    }
  },

  {
    flow: 'deposit',
    label: 'Deposit (w/ accountId opt)',
    sessionOptions: {
      amountSuggestions: {
        EUR: [25, 50, 100, 150],
        GBP: [25, 50, 100, 150],
        USD: [25, 50, 100, 150]
      },
      // availableAssets: { include: ['GBP', 'USD', 'BTC', 'XRP'] },
      fees: { display: 'breakdown' },
      initialSelection: {
        destination: { accountId: 'c83373fd-a0ec-41be-9d9f-37a04370bb69' }
      }
    }
  },
  {
    flow: 'withdrawal',
    label: 'Withdraw (w/ accountId opt)',
    sessionOptions: {
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
  { flow: 'select-deposit-origin', label: 'Select Deposit Origin' },
  { flow: 'select-withdrawal-destination', label: 'Select Withdrawal Destination' },
  { flow: 'authorize', label: 'Authorize', methods: TRANSACTION_AUTHORIZE_METHODS },

  // Order flows.
  { flow: 'on-ramp:select-deposit-origin', label: 'Select Deposit Origin' },
  { flow: 'on-ramp:select-withdrawal-destination', label: 'Select Withdrawal Destination' },
  { flow: 'off-ramp:select-deposit-origin', label: 'Select Deposit Origin' },
  { flow: 'off-ramp:select-withdrawal-destination', label: 'Select Withdrawal Destination' },
  { flow: 'order:authorize-deposit', label: 'Authorize Deposit', methods: ORDER_AUTHORIZE_METHODS }
];

// The flows are told apart by their position, as the same flow appears more than once with different options.
export const getFlowKey = (button: FlowButton) => FLOW_BUTTONS.indexOf(button);
