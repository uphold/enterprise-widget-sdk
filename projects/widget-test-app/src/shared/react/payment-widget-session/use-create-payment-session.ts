/**
 * Module dependencies.
 */

import { type CreatePaymentSessionData, createPaymentSession } from '../../api/requests';
import type { PaymentWidgetSession } from '@uphold/enterprise-payment-widget-web-sdk';
import { config } from '../../../../config';
import { useCreateToken } from '../../api';
import { useEffect, useState } from 'react';

/**
 * Configs.
 */

const { onBehalfOf } = config.enterpriseApi.authentication;
const paymentSessionUrlOverride = config.widgets.payment.session.urlOverride;

/**
 * Exports.
 */

export const useCreatePaymentSession = (createPaymentSessionData?: CreatePaymentSessionData) => {
  const [paymentSession, setPaymentSession] = useState<PaymentWidgetSession>();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const { createToken } = useCreateToken();

  useEffect(() => {
    // Set when the data changes before the session is created, so the result of that creation is dropped.
    let ignore = false;

    async function start() {
      // Going back to the flow list clears the data, which makes the next flow start from scratch.
      if (!createPaymentSessionData) {
        setPaymentSession(undefined);
        setError(null);
        setIsLoading(false);

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
          onBehalfOf,
          paymentSessionUrlOverride
        });

        if (!ignore) {
          setPaymentSession(paymentSession);
        }
      } catch (e) {
        if (!ignore) {
          setError(e as Error);
        }
      } finally {
        if (!ignore) {
          setIsLoading(false);
        }
      }
    }

    start();

    return () => {
      ignore = true;
    };
  }, [createPaymentSessionData]);

  return {
    error,
    isLoading,
    paymentSession
  };
};
