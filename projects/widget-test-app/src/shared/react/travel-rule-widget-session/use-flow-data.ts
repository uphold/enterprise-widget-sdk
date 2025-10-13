/**
 * Module dependencies.
 */

import { type CreateQuoteData, useCreateQuote } from '../../api';
import { config } from '../../../../config';

/**
 * Exports.
 */

export const useFlowData = () => {
  const { createQuote, error: createQuoteError, isLoading: isCreatingQuote } = useCreateQuote();

  const error = createQuoteError;
  const isLoading = isCreatingQuote;

  const loadFlowData = async () => {
    const createQuoteBody = config.widgets.travelRule.flows['withdrawal-form'].createQuoteBody as CreateQuoteData;
    const quote = await createQuote(createQuoteBody);

    return { quoteId: quote.id };
  };

  return {
    error,
    isLoading,
    loadFlowData
  };
};
