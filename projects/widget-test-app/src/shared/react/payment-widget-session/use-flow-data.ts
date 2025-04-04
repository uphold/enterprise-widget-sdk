/**
 * Module dependencies.
 */

import type { PaymentWidgetFlow } from '@uphold/enterprise-widget-messaging-types';
import { useCreateQuote } from '../../api';

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

    const quote = await createQuote();

    return { quoteId: quote.id };
  };

  return {
    error,
    isLoading,
    loadFlowData
  };
};
