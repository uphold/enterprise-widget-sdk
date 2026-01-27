/**
 * Module dependencies.
 */

import { type CreateQuoteData, createQuote } from '../requests/create-quote';
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

export const useCreateQuote = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const { createToken } = useCreateToken();

  const doCreateQuote = async (createQuoteData: CreateQuoteData) => {
    setIsLoading(true);
    setError(null);

    try {
      const token = await createToken();

      const quote = await createQuote(createQuoteData, {
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
    createQuote: doCreateQuote,
    error,
    isLoading
  };
};
