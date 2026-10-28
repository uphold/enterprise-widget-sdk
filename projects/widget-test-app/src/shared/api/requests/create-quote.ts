/**
 * Module dependencies.
 */

import { config } from '../../../../config';

/**
 * Configs.
 */

const defaultCoreApiBaseUrl = config.enterpriseApi.apis.core.baseUrl;

/**
 * Exports.
 */

export type CreateQuoteOptions = {
  accessToken: string;
  // Defaults to `config.enterpriseApi.apis.core.baseUrl`.
  coreApiBaseUrl?: string;
  onBehalfOf?: string;
};

type AccountTarget = {
  type: 'account' | 'external-account';
  id: string;
};

type CryptoAddressTarget = {
  type: 'crypto-address';
  network: string;
  address: string;
};

type ApmTarget = {
  type: 'apm';
  method: 'paypal' | 'venmo' | 'apple-pay' | 'google-pay';
};

type QuoteTarget = AccountTarget | CryptoAddressTarget | ApmTarget;

export type CreateQuoteData = {
  origin: QuoteTarget;
  destination: QuoteTarget;
  denomination: {
    asset: string;
    amount: string;
    target: 'origin' | 'destination';
  };
};

export const createQuote = async (createQuoteData: CreateQuoteData, options: CreateQuoteOptions) => {
  const response = await fetch(`${options.coreApiBaseUrl ?? defaultCoreApiBaseUrl}/transactions/quote`, {
    body: JSON.stringify({
      ...createQuoteData
    }),
    headers: {
      Authorization: `Bearer ${options.accessToken}`,
      'Content-Type': 'application/json',
      'X-On-Behalf-Of': options.onBehalfOf ?? ''
    },
    method: 'POST'
  });

  if (response.ok) {
    const responseBody = await response.json();

    const { quote } = responseBody;

    return quote;
  }

  throw new Error(
    `Request to create quote failed. HTTP status code: ${response.status}, text: ${await response.text()}`
  );
};
