/**
 * Module dependencies.
 */

import { type CreateQuoteData, type CreateQuoteOptions, createQuote as createQuoteRequest } from '../../api/requests';
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

  const createQuote = async (createQuoteData: CreateQuoteData, createQuoteOptions?: CreateQuoteOptions) => {
    setIsLoading(true);
    setError(null);

    try {
      if (!createQuoteOptions) {
        const token = await createToken();

        createQuoteOptions = {
          accessToken: token.access_token,
          onBehalfOf
        };
      }

      return await createQuoteRequest(createQuoteData, createQuoteOptions);
    } catch (e) {
      setError(e as Error);

      throw e;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    createQuote,
    error,
    isLoading
  };
};
