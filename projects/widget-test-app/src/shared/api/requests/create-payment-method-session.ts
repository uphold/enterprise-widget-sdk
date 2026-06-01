/**
 * Module dependencies.
 */

import { config } from '../../../../config';

/**
 * Configs.
 */

const coreApiBaseUrl = config.enterpriseApi.apis.core.baseUrl;

/**
 * Exports.
 */

export type PaymentMethodSession = {
  method: string;
  provider: string;
  init: {
    authorization: string;
  };
  options: {
    riskCorrelationId: string;
  };
};

export type ExternalAccount = {
  id: string;
  type: string;
  status: string;
  network: string;
  details: {
    email: string;
  };
};

export type CreatePaymentMethodSessionOptions = {
  accessToken: string;
  onBehalfOf?: string;
};

export const createPaymentMethodSession = async (options: CreatePaymentMethodSessionOptions) => {
  const response = await fetch(`${coreApiBaseUrl}/transactions/payment-methods/sessions`, {
    body: JSON.stringify({ method: 'paypal' }),
    headers: {
      Authorization: `Bearer ${options.accessToken}`,
      'Content-Type': 'application/json',
      'X-On-Behalf-Of': options.onBehalfOf ?? ''
    },
    method: 'POST'
  });

  if (response.ok) {
    const data = await response.json();

    return data as { externalAccount?: ExternalAccount; session: PaymentMethodSession };
  }

  throw new Error(
    `Request to create payment method session failed. HTTP status code: ${response.status}, text: ${await response.text()}`
  );
};
