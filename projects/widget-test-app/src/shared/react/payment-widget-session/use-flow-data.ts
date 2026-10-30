/**
 * Module dependencies.
 */

import { type CreateOrderQuoteData, type CreateQuoteData, useCreateOrderQuote, useCreateQuote } from '../../api';
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

const isOrderQuoteConfigKey = (key: QuoteConfigKey): key is OrderQuoteConfigKey => key.startsWith('order-');

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

  // The flows without a quote config key do not create a quote.
  const loadFlowData = async (quoteConfigKey?: QuoteConfigKey) => {
    if (!quoteConfigKey) {
      return {};
    }

    const { id: quoteId, requirements } = isOrderQuoteConfigKey(quoteConfigKey)
      ? await createOrderQuote(getCreateQuoteBody<CreateOrderQuoteData>(quoteConfigKey))
      : await createQuote(getCreateQuoteBody<CreateQuoteData>(quoteConfigKey));

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
