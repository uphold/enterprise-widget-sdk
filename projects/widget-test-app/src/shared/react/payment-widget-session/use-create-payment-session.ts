/**
 * Module dependencies.
 */

import { type CreatePaymentSessionData, createPaymentSession } from '../../api/requests';
import type { PaymentWidgetSession } from '@uphold/enterprise-widget-messaging-types';
import { config } from '../../../../config';
import { useCreateToken } from '../../api';
import { useEffect, useState } from 'react';

/**
 * Configs.
 */

const { onBehalfOf } = config.enterpriseApi.authentication;
const paymentSessionUrlOverride = config.paymentWidgetSession.urlOverride;

/**
 * Exports.
 */

export const useCreatePaymentSession = (createPaymentSessionData?: CreatePaymentSessionData) => {
  const [paymentSession, setPaymentSession] = useState<PaymentWidgetSession>();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const { createToken } = useCreateToken();

  useEffect(() => {
    async function start() {
      if (paymentSession || !createPaymentSessionData || error || isLoading) {
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        const token = await createToken();

        const paymentSession = await createPaymentSession(createPaymentSessionData, {
          accessToken: token.access_token,
          onBehalfOf,
          paymentSessionUrlOverride
        });

        setPaymentSession(paymentSession);
      } catch (e) {
        setError(e as Error);
      } finally {
        setIsLoading(false);
      }
    }

    start();
  }, [createPaymentSessionData]);

  return {
    error,
    isLoading,
    paymentSession
  };
};
