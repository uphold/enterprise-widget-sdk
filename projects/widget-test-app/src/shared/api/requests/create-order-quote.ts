/**
 * Module dependencies.
 */

import { config } from '../../../../config';

/**
 * Configs.
 */

const onOffRampApiBaseUrl = config.enterpriseApi.apis.onOffRamp.baseUrl;

/**
 * Exports.
 */

export type CreateOrderQuoteOptions = {
  accessToken: string;
  onBehalfOf?: string;
};

type OrderQuoteTarget =
  | { type: 'external-account'; id: string }
  | { type: 'crypto-address'; asset: string; network: string; address: string; reference?: string }
  | { type: 'apm'; method: 'paypal' | 'venmo' | 'apple-pay' | 'google-pay' };

export type CreateOrderQuoteData = {
  type: 'on-ramp' | 'off-ramp';
  origin: OrderQuoteTarget;
  destination: OrderQuoteTarget;
  denomination: {
    asset: string;
    amount: string;
    target: 'origin' | 'destination';
  };
};

export const createOrderQuote = async (
  createOrderQuoteData: CreateOrderQuoteData,
  options: CreateOrderQuoteOptions
) => {
  const response = await fetch(`${onOffRampApiBaseUrl}/orders/quote`, {
    body: JSON.stringify(createOrderQuoteData),
    headers: {
      Authorization: `Bearer ${options.accessToken}`,
      'Content-Type': 'application/json',
      'X-On-Behalf-Of': options.onBehalfOf ?? ''
    },
    method: 'POST'
  });

  if (response.ok) {
    const { quote } = await response.json();

    return quote;
  }

  throw new Error(
    `Request to create order quote failed. HTTP status code: ${response.status}, text: ${await response.text()}`
  );
};
