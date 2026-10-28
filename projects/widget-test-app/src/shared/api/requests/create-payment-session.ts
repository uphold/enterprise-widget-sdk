/**
 * Module dependencies.
 */

import type { PaymentWidgetFlow } from '@uphold/enterprise-payment-widget-web-sdk';
import type { PaymentWidgetOptions } from '@uphold/enterprise-widget-messaging-types';
import { getEnterpriseApi } from '../../user/active-environment';

/**
 * Configs.
 */

const getWidgetsApiBaseUrl = () => getEnterpriseApi().apis.widgets.baseUrl;

/**
 * Exports.
 */

export type CreatePaymentSessionData = {
  flow: PaymentWidgetFlow;
  data?: Record<string, unknown>;
  options?: PaymentWidgetOptions;
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
  const response = await fetch(`${getWidgetsApiBaseUrl()}/payment/sessions`, {
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
      const oldUrl = new URL(paymentSession.url);
      const newUrl = new URL(options.paymentSessionUrlOverride);

      newUrl.search = oldUrl.search;

      paymentSession.url = newUrl.toString();
    }

    return paymentSession;
  }

  throw new Error(
    `Request to create payment session failed. HTTP status code: ${response.status}, text: ${await response.text()}`
  );
};
