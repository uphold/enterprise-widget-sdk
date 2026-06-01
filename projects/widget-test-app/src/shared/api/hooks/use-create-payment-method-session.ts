/**
 * Module dependencies.
 */

import { config } from '../../../../config';
import { createPaymentMethodSession } from '../requests/create-payment-method-session';
import { useCreateToken } from './use-create-token';
import { useState } from 'react';

/**
 * Configs.
 */

const { onBehalfOf } = config.enterpriseApi.authentication;

/**
 * Exports.
 */

export const useCreatePaymentMethodSession = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const { createToken } = useCreateToken();

  const doCreatePaymentMethodSession = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const token = await createToken();

      return await createPaymentMethodSession({
        accessToken: token.access_token,
        onBehalfOf
      });
    } catch (e) {
      setError(e as Error);

      throw e;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    createPaymentMethodSession: doCreatePaymentMethodSession,
    error,
    isLoading
  };
};
