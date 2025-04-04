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

export type CreateQuoteOptions = {
  accessToken: string;
  onBehalfOf?: string;
};

export type CreateQuoteData = {
  origin: {
    type: 'account' | 'external-account';
    id: string;
  };
  destination: {
    type: 'account' | 'external-account';
    id: string;
  };
  denomination: {
    asset: string;
    amount: string;
    target: 'origin' | 'destination';
  };
};

export const createQuote = async (createQuoteData: CreateQuoteData, options: CreateQuoteOptions) => {
  const response = await fetch(`${coreApiBaseUrl}/transactions/quote`, {
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
