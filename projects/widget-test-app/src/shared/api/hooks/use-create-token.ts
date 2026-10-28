/**
 * Module dependencies.
 */

import { type CreateTokenData, createToken as createTokenRequest } from '../../api/requests';
import { config } from '../../../../config';
import { useState } from 'react';

/**
 * Exports.
 */

export type EnterpriseApi = {
  apis: { core: { baseUrl: string } };
  authentication: { clientId: string; clientSecret: string };
};

export const useCreateToken = (enterpriseApi: EnterpriseApi = config.enterpriseApi) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const createToken = async (createTokenData?: CreateTokenData) => {
    setIsLoading(true);
    setError(null);

    try {
      if (!createTokenData) {
        const { clientId, clientSecret } = enterpriseApi.authentication;

        createTokenData = { clientId, clientSecret, coreApiBaseUrl: enterpriseApi.apis.core.baseUrl };
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
