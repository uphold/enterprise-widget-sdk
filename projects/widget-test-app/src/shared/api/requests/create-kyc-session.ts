/**
 * Module dependencies.
 */

import type { KycProcess } from '@uphold/enterprise-kyc-widget-web-sdk';
import { config } from '../../../../config';

/**
 * Configs.
 */

const widgetsApiBaseUrl = config.enterpriseApi.apis.widgets.baseUrl;

/**
 * Exports.
 */

export type CreateKycSessionData = {
  processes?: KycProcess[];
};

export type CreateKycSessionOptions = {
  accessToken: string;
  onBehalfOf?: string;
  kycSessionUrlOverride?: string;
};

export const createKycSession = async (
  createKycSessionData: CreateKycSessionData,
  options: CreateKycSessionOptions
) => {
  const response = await fetch(`${widgetsApiBaseUrl}/kyc/sessions`, {
    body: JSON.stringify({
      ...createKycSessionData
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

    const kycSession = responseBody.session;

    if (options.kycSessionUrlOverride) {
      kycSession.url = options.kycSessionUrlOverride;
    }

    return kycSession;
  }

  throw new Error(
    `Request to create kyc session failed. HTTP status code: ${response.status}, text: ${await response.text()}`
  );
};
