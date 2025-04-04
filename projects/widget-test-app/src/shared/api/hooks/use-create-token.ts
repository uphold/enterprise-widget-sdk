/**
 * Module dependencies.
 */

import { type CreateTokenData, createToken as createTokenRequest } from '../../api/requests';
import { config } from '../../../../config';
import { useState } from 'react';

/**
 * Exports.
 */

export const useCreateToken = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const createToken = async (createTokenData?: CreateTokenData) => {
    setIsLoading(true);
    setError(null);

    try {
      if (!createTokenData) {
        const { clientId, clientSecret } = config.enterpriseApi.authentication;

        createTokenData = { clientId, clientSecret };
      }

      return await createTokenRequest(createTokenData as CreateTokenData);
    } catch (e) {
      setError(e as Error);

      throw e;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    createToken,
    error,
    isLoading
  };
};
