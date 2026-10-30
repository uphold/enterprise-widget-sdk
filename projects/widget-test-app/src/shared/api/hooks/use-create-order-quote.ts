/**
 * Module dependencies.
 */

import { type CreateOrderQuoteData, createOrderQuote } from '../requests/create-order-quote';
import { config } from '../../../../config';
import { useCreateToken } from './use-create-token';
import { useRef, useState } from 'react';

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
  // Bumped on reset, so a request still in flight at that point does not update the state once it settles.
  const requestIdRef = useRef(0);

  const doCreateOrderQuote = async (createOrderQuoteData: CreateOrderQuoteData) => {
    const requestId = ++requestIdRef.current;
    const isCurrent = () => requestId === requestIdRef.current;

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
      if (isCurrent()) {
        setError(e as Error);
      }

      throw e;
    } finally {
      if (isCurrent()) {
        setIsLoading(false);
      }
    }
  };

  return {
    createOrderQuote: doCreateOrderQuote,
    error,
    isLoading,
    reset: () => {
      requestIdRef.current += 1;
      setError(null);
      setIsLoading(false);
    }
  };
};
