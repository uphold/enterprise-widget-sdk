/**
 * Module dependencies.
 */

import { type CreateQuoteData, useCreateQuote } from '../../api';
import type { PaymentWidgetFlow } from '@uphold/enterprise-payment-widget-web-sdk';
import { config } from '../../../../config';

/**
 * Exports.
 */

export const useFlowData = () => {
  const { createQuote, error: createQuoteError, isLoading: isCreatingQuote } = useCreateQuote();

  const error = createQuoteError;
  const isLoading = isCreatingQuote;

  const loadFlowData = async (flow: PaymentWidgetFlow) => {
    if (flow !== 'authorize') {
      return {};
    }

    const createQuoteBody = config.widgets.payment.flows.authorize.createQuoteBody as CreateQuoteData;
    const quote = await createQuote(createQuoteBody);

    return { quoteId: quote.id };
  };

  return {
    error,
    isLoading,
    loadFlowData
  };
};
