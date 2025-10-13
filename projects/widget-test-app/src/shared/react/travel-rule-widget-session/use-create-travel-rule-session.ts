/**
 * Module dependencies.
 */

import { type CreateTravelRuleSessionData, createTravelRuleSession } from '../../api/requests';
import type { TravelRuleWidgetSession } from '@uphold/enterprise-widget-messaging-types';
import { config } from '../../../../config';
import { useCreateToken } from '../../api';
import { useEffect, useState } from 'react';

/**
 * Configs.
 */

const { onBehalfOf } = config.enterpriseApi.authentication;
const travelRuleSessionUrlOverride = config.widgets.travelRule.session.urlOverride;

/**
 * Exports.
 */

export const useCreateTravelRuleSession = (createTravelRuleSessionData?: CreateTravelRuleSessionData) => {
  const [travelRuleSession, setTravelRuleSession] = useState<TravelRuleWidgetSession>();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const { createToken } = useCreateToken();

  useEffect(() => {
    async function start() {
      if (travelRuleSession || !createTravelRuleSessionData || error || isLoading) {
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        const token = await createToken();

        const travelRuleSession = await createTravelRuleSession(createTravelRuleSessionData, {
          accessToken: token.access_token,
          onBehalfOf,
          travelRuleSessionUrlOverride
        });

        setTravelRuleSession(travelRuleSession);
      } catch (e) {
        setError(e as Error);
      } finally {
        setIsLoading(false);
      }
    }

    start();
  }, [createTravelRuleSessionData]);

  return {
    error,
    isLoading,
    travelRuleSession
  };
};
