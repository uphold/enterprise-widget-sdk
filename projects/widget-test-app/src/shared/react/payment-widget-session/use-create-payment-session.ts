/**
 * Module dependencies.
 */

import {
  type CreatePaymentSessionData,
  type CreateTokenData,
  createPaymentSession,
  createToken
} from '../../api/requests';
import type { PaymentWidgetSession } from '@uphold/enterprise-widget-messaging-types';
import { useEffect, useState } from 'react';

/**
 * Exports.
 */

export const useCreatePaymentSession = (createPaymentSessionData: CreatePaymentSessionData) => {
  const [paymentSession, setPaymentSession] = useState<PaymentWidgetSession>();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function start() {
      setIsLoading(true);
      setError(null);

      try {
        const createTokenData: CreateTokenData = {
          clientId: import.meta.env.VITE_CLIENT_ID,
          clientSecret: import.meta.env.VITE_CLIENT_SECRET
        };

        const token = await createToken(createTokenData);

        const paymentSession = await createPaymentSession(createPaymentSessionData, {
          accessToken: token.access_token,
          impersonateUserId: import.meta.env.VITE_IMPERSONATE_USER_ID,
          urlOverride: import.meta.env.VITE_PAYMENT_SESSION_URL_OVERRIDE
        });

        setPaymentSession(paymentSession);
      } catch (e) {
        setError(e as Error);
      } finally {
        setIsLoading(false);
      }
    }

    start();
  }, []);

  return {
    error,
    isLoading,
    paymentSession
  };
};
