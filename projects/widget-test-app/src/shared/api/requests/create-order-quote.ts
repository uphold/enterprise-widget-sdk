/**
 * Module dependencies.
 */

import { config } from '../../../../config';

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
  // Read on each call, so a config without the on-off-ramp API only fails the flows that use it.
  const onOffRampApiBaseUrl = config.enterpriseApi.apis.onOffRamp?.baseUrl;

  if (!onOffRampApiBaseUrl) {
    throw new Error(`Missing 'enterpriseApi.apis.onOffRamp.baseUrl' in 'config.ts'. See 'config.sample.ts'.`);
  }

  const response = await fetch(`${onOffRampApiBaseUrl}/orders/quote`, {
    body: JSON.stringify(createOrderQuoteData),
    headers: {
      Authorization: `Bearer ${options.accessToken}`,
      'Content-Type': 'application/json',
      'X-On-Behalf-Of': options.onBehalfOf ?? ''
    },
    method: 'POST',
    // Fails the request after 30 seconds, so a stalled endpoint surfaces as an error instead of a loading state.
    signal: AbortSignal.timeout(30_000)
  });

  if (response.ok) {
    const { quote } = await response.json();

    return quote;
  }

  throw new Error(
    `Request to create order quote failed. HTTP status code: ${response.status}, text: ${await response.text()}`
  );
};
