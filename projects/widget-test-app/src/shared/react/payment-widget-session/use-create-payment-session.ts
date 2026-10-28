/**
 * Module dependencies.
 */

import { type CreatePaymentSessionData, createPaymentSession } from '../../api/requests';
import type { PaymentWidgetSession } from '@uphold/enterprise-payment-widget-web-sdk';
import { getEnterpriseApi, getOnBehalfOf, getWidgetSessionUrlOverride } from '../../user';
import { useCreateToken } from '../../api';
import { useEffect, useState } from 'react';

/**
 * Exports.
 */

export const useCreatePaymentSession = (createPaymentSessionData?: CreatePaymentSessionData) => {
  const [paymentSession, setPaymentSession] = useState<PaymentWidgetSession>();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const { createToken } = useCreateToken(getEnterpriseApi());

  useEffect(() => {
    async function start() {
      // Going back to the flow list clears the data, which makes the next flow start from scratch.
      if (!createPaymentSessionData) {
        setPaymentSession(undefined);
        setError(null);

        return;
      }

      if (paymentSession || error || isLoading) {
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        const token = await createToken();

        const paymentSession = await createPaymentSession(createPaymentSessionData, {
          accessToken: token.access_token,
          onBehalfOf: getOnBehalfOf(),
          paymentSessionUrlOverride: getWidgetSessionUrlOverride('payment')
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
