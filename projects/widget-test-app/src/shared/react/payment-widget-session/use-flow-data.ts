/**
 * Module dependencies.
 */

import { type CreateOrderQuoteData, type CreateQuoteData, useCreateOrderQuote, useCreateQuote } from '../../api';
import type { PaymentWidgetFlow } from '@uphold/enterprise-payment-widget-web-sdk';
import { config } from '../../../../config';

/**
 * Types.
 */

// Key, in `config.widgets.payment.flows`, of the body used to create the quote of the `authorize` flows.
export type TransactionQuoteConfigKey =
  | 'authorize'
  | 'paypal-authorize'
  | 'venmo-authorize'
  | 'apple-pay-authorize'
  | 'google-pay-authorize';

// Key, in `config.widgets.payment.flows`, of the body used to create the order quote of the
// `order:authorize-deposit` flow.
export type OrderQuoteConfigKey =
  | 'order-authorize-deposit-card'
  | 'order-authorize-deposit-paypal'
  | 'order-authorize-deposit-apple-pay'
  | 'order-authorize-deposit-google-pay';

export type QuoteConfigKey = TransactionQuoteConfigKey | OrderQuoteConfigKey;

/**
 * Helpers.
 */

const getCreateQuoteBody = <T>(key: QuoteConfigKey) => {
  const { createQuoteBody } =
    (config.widgets.payment.flows as Record<string, { createQuoteBody?: unknown }>)[key] ?? {};

  if (!createQuoteBody) {
    throw new Error(
      `Missing 'widgets.payment.flows["${key}"].createQuoteBody' in 'config.ts'. See 'config.sample.ts'.`
    );
  }

  return createQuoteBody as T;
};

/**
 * Exports.
 */

export const useFlowData = () => {
  const { createQuote, error: createQuoteError, isLoading: isCreatingQuote, reset: resetQuote } = useCreateQuote();
  const {
    createOrderQuote,
    error: createOrderQuoteError,
    isLoading: isCreatingOrderQuote,
    reset: resetOrderQuote
  } = useCreateOrderQuote();

  const error = createQuoteError || createOrderQuoteError;
  const isLoading = isCreatingQuote || isCreatingOrderQuote;

  const loadFlowData = async (flow: PaymentWidgetFlow, quoteConfigKey?: QuoteConfigKey) => {
    if (flow === 'order:authorize-deposit') {
      const { id: quoteId, requirements } = await createOrderQuote(
        getCreateQuoteBody<CreateOrderQuoteData>(quoteConfigKey ?? 'order-authorize-deposit-card')
      );

      return {
        domain: window.location.hostname,
        quoteId,
        requirements
      };
    }

    if (flow !== 'authorize' && flow !== 'transaction:authorize') {
      return {};
    }

    const { id: quoteId, requirements } = await createQuote(
      getCreateQuoteBody<CreateQuoteData>(quoteConfigKey ?? 'authorize')
    );

    return {
      domain: window.location.hostname,
      quoteId,
      requirements
    };
  };

  const reset = () => {
    resetQuote();
    resetOrderQuote();
  };

  return {
    error,
    isLoading,
    loadFlowData,
    reset
  };
};
