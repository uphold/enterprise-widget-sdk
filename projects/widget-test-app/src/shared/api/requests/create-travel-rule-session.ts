/**
 * Module dependencies.
 */

import type { TravelRuleWidgetFlow } from '@uphold/enterprise-widget-messaging-types';
import { config } from '../../../../config';

/**
 * Configs.
 */

const widgetsApiBaseUrl = config.enterpriseApi.apis.widgets.baseUrl;

/**
 * Exports.
 */

export type CreateTravelRuleSessionData = {
  flow: TravelRuleWidgetFlow;
  data?: Record<string, unknown>;
};

export type CreateTravelRuleSessionOptions = {
  accessToken: string;
  onBehalfOf?: string;
  travelRuleSessionUrlOverride?: string;
};

export const createTravelRuleSession = async (
  createTravelRuleSessionData: CreateTravelRuleSessionData,
  options: CreateTravelRuleSessionOptions
) => {
  const response = await fetch(`${widgetsApiBaseUrl}/travel-rule/sessions`, {
    body: JSON.stringify({
      ...createTravelRuleSessionData
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

    const travelRuleSession = responseBody.session;

    if (options.travelRuleSessionUrlOverride) {
      travelRuleSession.url = options.travelRuleSessionUrlOverride;
    }

    return travelRuleSession;
  }

  throw new Error(
    `Request to create travel rule session failed. HTTP status code: ${response.status}, text: ${await response.text()}`
  );
};
