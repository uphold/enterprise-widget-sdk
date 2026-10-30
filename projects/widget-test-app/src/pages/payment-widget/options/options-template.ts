/**
 * Module dependencies.
 */

import type { FlowButton } from '../flows';
import type { PaymentWidgetFlow } from '@uphold/enterprise-payment-widget-web-sdk';

/**
 * Template of the options of a flow, which is what the editor starts with when the flow has none of its own. Every
 * option the flow supports is there, commented, to be uncommented and changed.
 */

type OptionKey =
  | 'amountSuggestions'
  | 'authorize'
  | 'availableAssets'
  | 'fees'
  | 'initialSelection'
  | 'layout'
  | 'maxAccountsPerAsset'
  | 'paymentMethods'
  | 'theme';

const AUTHORIZE_FLOWS: PaymentWidgetFlow[] = ['authorize', 'transaction:authorize', 'order:authorize-deposit'];
const E2E_FLOWS: PaymentWidgetFlow[] = ['deposit', 'withdrawal'];

const getOptionKeys = (flow: PaymentWidgetFlow): OptionKey[] => {
  if (AUTHORIZE_FLOWS.includes(flow)) {
    return ['authorize', 'layout', 'theme'];
  }

  if (E2E_FLOWS.includes(flow)) {
    return [
      'paymentMethods',
      'availableAssets',
      'fees',
      'amountSuggestions',
      'initialSelection',
      'maxAccountsPerAsset',
      'layout',
      'theme'
    ];
  }

  return ['paymentMethods', 'maxAccountsPerAsset', 'layout', 'theme'];
};

// The payment methods each flow shows. The ones of the order flows are the ones its flow allows.
const PAYMENT_METHOD_TYPES_BY_FLOW: Partial<Record<PaymentWidgetFlow, string[]>> = {
  deposit: ['card', 'bank'],
  withdrawal: ['card', 'bank'],
  ['off-ramp:select-deposit-origin' as PaymentWidgetFlow]: ['crypto'],
  ['off-ramp:select-withdrawal-destination' as PaymentWidgetFlow]: ['card'],
  ['on-ramp:select-deposit-origin' as PaymentWidgetFlow]: ['card', 'paypal', 'venmo', 'apple-pay', 'google-pay'],
  ['on-ramp:select-withdrawal-destination' as PaymentWidgetFlow]: ['crypto']
};

const ALL_PAYMENT_METHOD_TYPES = ['card', 'paypal', 'venmo', 'apple-pay', 'google-pay', 'bank', 'crypto'];

const PAYMENT_METHOD_EXAMPLES: Record<string, string> = {
  'apple-pay': '{ "type": "apple-pay" }',
  bank: '{ "type": "bank", "networks": ["fps", "ach"], "assets": { "include": ["GBP"], "exclude": [] } }',
  card: '{ "type": "card" }',
  crypto: '{ "type": "crypto", "assets": { "include": ["BTC"], "exclude": [] } }',
  'google-pay': '{ "type": "google-pay" }',
  paypal: '{ "type": "paypal" }',
  venmo: '{ "type": "venmo" }'
};

const OPTION_TEMPLATES: Record<Exclude<OptionKey, 'paymentMethods'>, string[]> = {
  amountSuggestions: ['"amountSuggestions": { "USD": [25, 50, 100, 150], "EUR": [25, 50, 100, 150] },'],
  authorize: ['"authorize": { "mode": "default" }, // "default" | "headless"'],
  availableAssets: ['"availableAssets": { "include": ["GBP", "BTC"], "exclude": [] },'],
  fees: ['"fees": { "display": "total" }, // "total" | "breakdown"'],
  initialSelection: [
    '"initialSelection": {',
    '  "origin": { "asset": "GBP" }, // or { "accountId": "..." }',
    '  "destination": { "accountId": "..." } // or { "asset": "BTC" }',
    '},'
  ],
  layout: ['"layout": "boxed", // "boxed" | "fluid"'],
  maxAccountsPerAsset: ['"maxAccountsPerAsset": 5, // up to 100'],
  theme: [
    '"theme": {',
    '  "appearance": "dark", // "dark" | "light"',
    '  "primary": "#5b5bf0", // or { "light": "#5b5bf0", "dark": "#8b8bff" }',
    '  "primaryForeground": "#ffffff",',
    '  "background": "#ffffff",',
    '  "foreground": "#14172b",',
    '  "emphasisForeground": "#000000",',
    '  "fontFamily": "Inter", // or { "sans": "Inter", "serif": "Georgia", "mono": "Menlo" }',
    '  "components": {',
    '    "button": { "borderRadius": "8px" },',
    '    "card": { "borderRadius": "12px" },',
    '    "input": { "borderRadius": "8px" }',
    '  }',
    '},'
  ]
};

const getOptionTemplateLines = (flow: PaymentWidgetFlow, key: OptionKey) => {
  if (key !== 'paymentMethods') {
    return OPTION_TEMPLATES[key];
  }

  const types = PAYMENT_METHOD_TYPES_BY_FLOW[flow] ?? ALL_PAYMENT_METHOD_TYPES;

  return [
    '"paymentMethods": [',
    ...types.map((type, index) => `  ${PAYMENT_METHOD_EXAMPLES[type]}${index < types.length - 1 ? ',' : ''}`),
    '],'
  ];
};

export const getOptionsTemplate = (flow: PaymentWidgetFlow) => {
  const lines = getOptionKeys(flow).flatMap(key => getOptionTemplateLines(flow, key).map(line => `  // ${line}`));

  return `{\n${lines.join('\n')}\n}`;
};

export const getPresetText = (button: FlowButton) => {
  const { options, sessionOptions } = button;
  const preset = { ...options, ...sessionOptions };

  return Object.keys(preset).length === 0 ? getOptionsTemplate(button.flow) : JSON.stringify(preset, null, 2);
};
