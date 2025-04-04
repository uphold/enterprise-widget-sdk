/**
 * Module dependencies.
 */

import type { PaymentWidgetFlow } from '@uphold/enterprise-widget-messaging-types';
import { config } from '../../../../config';

/**
 * Configs.
 */

const widgetsApiBaseUrl = config.enterpriseApi.apis.widgets.baseUrl;

/**
 * Exports.
 */

export type CreatePaymentSessionData = {
  flow: PaymentWidgetFlow;
  data?: Record<string, unknown>;
};

export type CreatePaymentSessionOptions = {
  accessToken: string;
  onBehalfOf?: string;
  paymentSessionUrlOverride?: string;
};

export const createPaymentSession = async (
  createPaymentSessionData: CreatePaymentSessionData,
  options: CreatePaymentSessionOptions
) => {
  const response = await fetch(`${widgetsApiBaseUrl}/payment/sessions`, {
    body: JSON.stringify({
      ...createPaymentSessionData
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

    const paymentSession = responseBody.session;

    if (options.paymentSessionUrlOverride) {
      paymentSession.url = options.paymentSessionUrlOverride;
    }

    return paymentSession;
  }

  throw new Error(
    `Request to create payment session failed. HTTP status code: ${response.status}, text: ${await response.text()}`
  );
};
