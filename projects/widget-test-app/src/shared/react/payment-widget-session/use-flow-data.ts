/**
 * Module dependencies.
 */

import { type CreateOrderQuoteData, type CreateQuoteData, useCreateOrderQuote, useCreateQuote } from '../../api';
import type { PaymentWidgetFlow } from '@uphold/enterprise-payment-widget-web-sdk';
import { config } from '../../../../config';

/**
 * Types.
 */

// Key, in `config.widgets.payment.flows`, of the body used to create the order quote of the
// `order:authorize-deposit` flow.
export type OrderQuoteConfigKey = 'order-authorize-deposit-card' | 'order-authorize-deposit-paypal';

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

  const loadFlowData = async (flow: PaymentWidgetFlow, orderQuoteConfigKey?: OrderQuoteConfigKey) => {
    if (flow === 'order:authorize-deposit') {
      const createOrderQuoteBody = config.widgets.payment.flows[orderQuoteConfigKey ?? 'order-authorize-deposit-card']
        .createQuoteBody as CreateOrderQuoteData;

      const { id: quoteId, requirements } = await createOrderQuote(createOrderQuoteBody);

      return {
        domain: window.location.hostname,
        quoteId,
        requirements
      };
    }

    if (flow !== 'authorize' && flow !== 'transaction:authorize') {
      return {};
    }

    const createQuoteBody = config.widgets.payment.flows.authorize.createQuoteBody as CreateQuoteData;

    const { id: quoteId, requirements } = await createQuote(createQuoteBody);

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
