/**
 * Module dependencies.
 */

import type { PaymentWidgetFlow } from '@uphold/enterprise-widget-messaging-types';

/**
 * Exports.
 */

export type CreatePaymentSessionData = {
  flow: PaymentWidgetFlow;
  data?: Record<string, unknown>;
};

export type CreatePaymentSessionOptions = {
  accessToken: string;
  impersonateUserId?: string;
  urlOverride?: string;
};

export const createPaymentSession = async (
  createPaymentSessionData: CreatePaymentSessionData,
  options: CreatePaymentSessionOptions
) => {
  const response = await fetch(`${import.meta.env.VITE_ENTERPRISE_WIDGETS_API_BASE_URL}/payment/sessions`, {
    body: JSON.stringify({
      ...createPaymentSessionData
    }),
    headers: {
      Authorization: `Bearer ${options.accessToken}`,
      'Content-Type': 'application/json',
      'X-On-Behalf-Of': `user ${options.impersonateUserId}`
    },
    method: 'POST'
  });

  if (response.ok) {
    const responseBody = await response.json();

    const paymentSession = responseBody.session;

    if (options.urlOverride) {
      paymentSession.url = options.urlOverride;
    }

    return paymentSession;
  }

  throw new Error(
    `Request to create payment session failed. HTTP status code: ${response.status}, text: ${await response.text()}`
  );
};
