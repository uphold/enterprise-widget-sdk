/**
 * Module dependencies.
 */

import { type CreateQuoteData, useCreatePaymentMethodSession, useCreateQuote } from '../../api';
import type { PaymentWidgetFlow } from '@uphold/enterprise-payment-widget-web-sdk';
import { config } from '../../../../config';
import { useState } from 'react';

/**
 * Exports.
 */

export type TestAppFlow = PaymentWidgetFlow | 'paypal-authorize' | 'paypal-authorize-withdrawal';

export const useFlowData = () => {
  const { createQuote, error: createQuoteError, isLoading: isCreatingQuote } = useCreateQuote();
  const {
    createPaymentMethodSession,
    error: createPaymentMethodSessionError,
    isLoading: isCreatingPaymentMethodSession
  } = useCreatePaymentMethodSession();
  const [flowLoadError, setFlowLoadError] = useState<Error | null>(null);

  const error = createQuoteError || createPaymentMethodSessionError || flowLoadError;
  const isLoading = isCreatingQuote || isCreatingPaymentMethodSession;

  const loadFlowData = async (
    flow: TestAppFlow
  ): Promise<{ data: Record<string, unknown>; widgetFlow: PaymentWidgetFlow }> => {
    setFlowLoadError(null);

    if (flow === 'authorize') {
      const createQuoteBody = config.widgets.payment.flows.authorize.createQuoteBody as CreateQuoteData;
      const quote = await createQuote(createQuoteBody);

      return { data: { quoteId: quote.id }, widgetFlow: 'authorize' };
    }

    if (flow === 'paypal-authorize') {
      const createQuoteBody = config.widgets.payment.flows['paypal-authorize'].createQuoteBody as CreateQuoteData;

      const [quote, { externalAccount, session }] = await Promise.all([
        createQuote(createQuoteBody),
        createPaymentMethodSession()
      ]);

      return {
        data: {
          clientToken: session.init.authorization,
          ...(externalAccount ? { linkedPaypalAccountId: externalAccount.id } : {}),
          quoteId: quote.id,
          riskCorrelationId: session.options.riskCorrelationId
        },
        widgetFlow: 'authorize'
      };
    }

    if (flow === 'paypal-authorize-withdrawal') {
      const { externalAccount, session } = await createPaymentMethodSession();

      if (!externalAccount) {
        const err = new Error('No linked PayPal account found. Complete a PayPal deposit first.');

        setFlowLoadError(err);
        throw err;
      }

      const createQuoteBody: CreateQuoteData = {
        denomination: config.widgets.payment.flows['paypal-authorize'].createQuoteBody.denomination,
        destination: { id: externalAccount.id, type: 'external-account' },
        origin: { id: config.widgets.payment.flows['paypal-authorize'].createQuoteBody.destination.id, type: 'account' }
      };

      const quote = await createQuote(createQuoteBody);

      return {
        data: {
          clientToken: session.init.authorization,
          linkedPaypalAccountId: externalAccount.id,
          quoteId: quote.id,
          riskCorrelationId: session.options.riskCorrelationId
        },
        widgetFlow: 'authorize'
      };
    }

    return { data: {}, widgetFlow: flow as PaymentWidgetFlow };
  };

  return {
    error,
    isLoading,
    loadFlowData
  };
};
