/**
 * Module dependencies.
 */

import { type CreateKycSessionData, createKycSession } from '../../api/requests';
import type { KycWidgetSession } from '@uphold/enterprise-kyc-widget-web-sdk';
import { config } from '../../../../config';
import { useCreateToken } from '../../api';
import { useEffect, useState } from 'react';

/**
 * Configs.
 */

const { onBehalfOf } = config.enterpriseApi.authentication;
const kycSessionUrlOverride = config.widgets.kyc.session.urlOverride;

/**
 * Exports.
 */

export const useCreateKycSession = (createKycSessionData?: CreateKycSessionData) => {
  const [kycSession, setKycSession] = useState<KycWidgetSession>();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const { createToken } = useCreateToken();

  // Reset state when createKycSessionData is cleared
  useEffect(() => {
    if (!createKycSessionData) {
      setKycSession(undefined);
      setError(null);
      setIsLoading(false);
    }
  }, [createKycSessionData]);

  useEffect(() => {
    const start = async () => {
      if (kycSession || !createKycSessionData || error || isLoading) {
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        const token = await createToken();

        const kycSession = await createKycSession(createKycSessionData, {
          accessToken: token.access_token,
          kycSessionUrlOverride,
          onBehalfOf
        });

        console.log('kycSession', kycSession);

        setKycSession(kycSession);
      } catch (e) {
        setError(e as Error);
      } finally {
        setIsLoading(false);
      }
    };

    start();
  }, [createKycSessionData]);

  return {
    error,
    isLoading,
    kycSession
  };
};
