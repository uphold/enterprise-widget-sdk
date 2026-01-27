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

export type GetRequestsForInformationOptions = {
  accessToken: string;
  onBehalfOf?: string;
};

export type RequestForInformation = {
  id: string;
  transactionId: string;
  type: string;
  status: string;
  createdAt: string;
  updatedAt: string;
};

export const getRequestsForInformation = async (
  transactionId: string,
  options: GetRequestsForInformationOptions
): Promise<RequestForInformation[]> => {
  const response = await fetch(`${coreApiBaseUrl}/transactions/${transactionId}/requests-for-information`, {
    headers: {
      Authorization: `Bearer ${options.accessToken}`,
      'Content-Type': 'application/json',
      'X-On-Behalf-Of': options.onBehalfOf ?? ''
    },
    method: 'GET'
  });

  if (response.ok) {
    const responseBody = await response.json();

    return responseBody.requestsForInformation ?? responseBody;
  }

  throw new Error(
    `Request to get requests for information failed. HTTP status code: ${response.status}, text: ${await response.text()}`
  );
};
