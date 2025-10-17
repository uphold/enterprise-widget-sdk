/**
 * Module dependencies.
 */

import './travel-rule-widget.css';
import type { CreateTravelRuleSessionData } from '../../shared/api/requests/create-travel-rule-session';
import {
  type TravelRuleWidgetCancelEvent,
  TravelRuleWidget as TravelRuleWidgetClass,
  type TravelRuleWidgetCompleteEvent,
  type TravelRuleWidgetErrorEvent
} from '@uphold/enterprise-travel-rule-widget-web-sdk';
import type { TravelRuleWidgetFlow } from '@uphold/enterprise-widget-messaging-types';
import { useCreateTravelRuleSession } from '../../shared/react/travel-rule-widget-session';
import { useEffect, useMemo, useState } from 'react';
import { useFlowData } from '../../shared/react/travel-rule-widget-session/use-flow-data';

/**
 * Export component.
 */

export default function TravelRuleWidget() {
  const [createTravelRuleSessionData, setCreateTravelRuleSessionData] = useState<CreateTravelRuleSessionData>();
  const { error: loadFlowDataError, isLoading: isLoadingFlowData, loadFlowData } = useFlowData();

  const onFlowButtonClick = (flow: TravelRuleWidgetFlow) => {
    const load = async () => {
      const data = await loadFlowData();

      setCreateTravelRuleSessionData({
        data,
        flow
      });
    };

    load();
  };

  const {
    error: createTravelRuleSessionError,
    isLoading: isCreatingTravelRuleSession,
    travelRuleSession
  } = useCreateTravelRuleSession(createTravelRuleSessionData);
  const [message, setMessage] = useState('');
  const isLoading = isLoadingFlowData || isCreatingTravelRuleSession;
  const error = loadFlowDataError || createTravelRuleSessionError;

  const widget = useMemo(() => {
    if (travelRuleSession) {
      const widget = new TravelRuleWidgetClass(travelRuleSession, { debug: true });

      const errorHandler = (e: TravelRuleWidgetErrorEvent) => {
        setMessage(`[TRWSDK] 'error' event raised with error: ${JSON.stringify(e.detail.error)}`);

        widget.unmount();
      };

      const completeHandler = (e: TravelRuleWidgetCompleteEvent<TravelRuleWidgetFlow>) => {
        setMessage(`[TRWSDK] 'complete' event raised with value: ${JSON.stringify(e.detail.value)}`);

        widget.unmount();
      };

      const cancelHandler = (_: TravelRuleWidgetCancelEvent) => {
        setMessage(`[TRWSDK] 'cancel' event raised`);

        widget.unmount();
      };

      widget.on('error', errorHandler);
      widget.on('complete', completeHandler);
      widget.on('cancel', cancelHandler);

      widget.mountIframe(document.getElementById('root')!);

      return widget;
    }
  }, [travelRuleSession]);

  useEffect(() => {
    return () => {
      widget?.unmount();
    };
  }, [widget]);

  return (
    <div className="travel-rule-widget-container">
      <h1>Travel Rule Widget Web SDK Test Page</h1>
      {isLoading && <div className="loading">Loading...</div>}
      {error && (
        <div>
          <div className="error">
            <span className="error-icon">⚠️</span>
            <span className="error-message">An error occurred. Please try again later.</span>
          </div>
          <div>
            <br />
            <span>{error.toString()}</span>
          </div>
        </div>
      )}
      {message && (
        <div id="message" className="message">
          {message}
        </div>
      )}
      {!createTravelRuleSessionData && !isLoading && !error && (
        <div className="button-container">
          <p className="select-flow-text">Select flow:</p>
          <button className="action-button" onClick={() => onFlowButtonClick('withdrawal-form')}>
            Withdrawal Form
          </button>
        </div>
      )}

      <div id="root" className="widget-container"></div>
    </div>
  );
}
