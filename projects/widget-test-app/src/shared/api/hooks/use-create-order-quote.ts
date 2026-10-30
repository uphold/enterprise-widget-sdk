/**
 * Module dependencies.
 */

import { type CreateOrderQuoteData, createOrderQuote } from '../requests/create-order-quote';
import { config } from '../../../../config';
import { useCreateToken } from './use-create-token';
import { useState } from 'react';

/**
 * Configs.
 */

const { onBehalfOf } = config.enterpriseApi.authentication;

/**
 * Exports.
 */

export const useCreateOrderQuote = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const { createToken } = useCreateToken();

  const doCreateOrderQuote = async (createOrderQuoteData: CreateOrderQuoteData) => {
    setIsLoading(true);
    setError(null);

    try {
      const token = await createToken();

      const quote = await createOrderQuote(createOrderQuoteData, {
        accessToken: token.access_token,
        onBehalfOf
      });

      return quote;
    } catch (e) {
      setError(e as Error);

      throw e;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    createOrderQuote: doCreateOrderQuote,
    error,
    isLoading,
    reset: () => setError(null)
  };
};
