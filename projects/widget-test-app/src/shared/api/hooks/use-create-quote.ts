/**
 * Module dependencies.
 */

import { type CreateQuoteData, createQuote } from '../requests/create-quote';
import { type EnterpriseApi, useCreateToken } from './use-create-token';
import { config } from '../../../../config';
import { useState } from 'react';

/**
 * Configs.
 */

const defaultOnBehalfOf = config.enterpriseApi.authentication.onBehalfOf;

/**
 * Exports.
 */

type UseCreateQuoteOptions = {
  // Defaults to `config.enterpriseApi`.
  enterpriseApi?: EnterpriseApi;
  onBehalfOf?: string;
};

export const useCreateQuote = ({
  enterpriseApi = config.enterpriseApi,
  onBehalfOf = defaultOnBehalfOf
}: UseCreateQuoteOptions = {}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const { createToken } = useCreateToken(enterpriseApi);

  const doCreateQuote = async (createQuoteData: CreateQuoteData) => {
    setIsLoading(true);
    setError(null);

    try {
      const token = await createToken();

      const quote = await createQuote(createQuoteData, {
        accessToken: token.access_token,
        coreApiBaseUrl: enterpriseApi.apis.core.baseUrl,
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
    isLoading,
    reset: () => setError(null)
  };
};
