/**
 * Module dependencies.
 */

import './travel-rule-widget.css';
import { type CreateQuoteData, createQuote } from '../../shared/api/requests/create-quote';
import type { CreateTravelRuleSessionData } from '../../shared/api/requests/create-travel-rule-session';
import {
  type TravelRuleWidgetCancelEvent,
  TravelRuleWidget as TravelRuleWidgetClass,
  type TravelRuleWidgetCompleteEvent,
  type TravelRuleWidgetErrorEvent
} from '@uphold/enterprise-travel-rule-widget-web-sdk';
import type { TravelRuleWidgetFlow } from '@uphold/enterprise-widget-messaging-types';
import { config } from '../../../config';
import { createToken } from '../../shared/api/requests/create-token';
import { getRequestsForInformation } from '../../shared/api/requests/get-requests-for-information';
import { useCallback, useEffect, useState } from 'react';
import { useCreateTravelRuleSession } from '../../shared/react/travel-rule-widget-session';

/**
 * Types.
 */

type Screen = 'flow-selection' | 'flow-details' | 'widget';

type WidgetResult = {
  type: 'complete' | 'cancel' | 'error';
  payload?: unknown;
};

type DepositFormDetails = {
  transactionId: string;
};

type WithdrawalFormDetails = {
  denomination: {
    amount: string;
    asset: string;
    target: 'origin' | 'destination';
  };
  destination: {
    type: 'account' | 'external-account' | 'crypto-address';
    id?: string;
    network?: string;
    address?: string;
    asset?: string;
  };
  origin: {
    type: 'account' | 'external-account' | 'crypto-address';
    id?: string;
    network?: string;
    address?: string;
    asset?: string;
  };
};

/**
 * Components.
 */

function FlowSelectionScreen({ onSelectFlow }: { onSelectFlow: (flow: TravelRuleWidgetFlow) => void }) {
  return (
    <div className="button-container">
      <p>Select flow:</p>
      <button className="action-button" onClick={() => onSelectFlow('deposit-form')}>
        Deposit Form
      </button>
      <button className="action-button" onClick={() => onSelectFlow('withdrawal-form')}>
        Withdrawal Form
      </button>
    </div>
  );
}

function DepositFormDetailsScreen({
  onBack,
  onSubmit
}: {
  onBack: () => void;
  onSubmit: (details: DepositFormDetails) => void;
}) {
  const [transactionId, setTransactionId] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (transactionId.trim()) {
      onSubmit({ transactionId: transactionId.trim() });
    }
  };

  return (
    <div className="details-container">
      <h2>Deposit Form Details</h2>
      <form className="details-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="transactionId">Transaction ID:</label>
          <input
            id="transactionId"
            onChange={e => setTransactionId(e.target.value)}
            placeholder="Enter transaction ID"
            required
            type="text"
            value={transactionId}
          />
        </div>
        <div className="form-actions">
          <button className="action-button secondary" onClick={onBack} type="button">
            Back
          </button>
          <button className="action-button" disabled={!transactionId.trim()} type="submit">
            Submit
          </button>
        </div>
      </form>
    </div>
  );
}

function WithdrawalFormDetailsScreen({
  onBack,
  onSubmit
}: {
  onBack: () => void;
  onSubmit: (details: WithdrawalFormDetails) => void;
}) {
  const [denomination, setDenomination] = useState<{
    amount: string;
    asset: string;
    target: 'origin' | 'destination';
  }>({
    amount: '10',
    asset: 'GBP',
    target: 'origin'
  });

  const [origin, setOrigin] = useState<WithdrawalFormDetails['origin']>({
    id: '',
    type: 'account'
  });

  const [destination, setDestination] = useState<WithdrawalFormDetails['destination']>({
    address: '',
    asset: 'XRP',
    network: 'xrp-ledger',
    type: 'crypto-address'
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Build origin object based on type
    const originData: WithdrawalFormDetails['origin'] = { type: origin.type };

    if (origin.type === 'account' || origin.type === 'external-account') {
      originData.id = origin.id;
    } else {
      originData.address = origin.address;
      originData.network = origin.network;
      originData.asset = origin.asset;
    }

    // Build destination object based on type
    const destinationData: WithdrawalFormDetails['destination'] = { type: destination.type };

    if (destination.type === 'account' || destination.type === 'external-account') {
      destinationData.id = destination.id;
    } else {
      destinationData.address = destination.address;
      destinationData.network = destination.network;
      destinationData.asset = destination.asset;
    }

    onSubmit({
      denomination,
      destination: destinationData,
      origin: originData
    });
  };

  return (
    <div className="details-container">
      <h2>Withdrawal Form - Quote Details</h2>
      <form className="details-form wide-form" onSubmit={handleSubmit}>
        <fieldset>
          <legend>Denomination</legend>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="amount">Amount:</label>
              <input
                id="amount"
                onChange={e => setDenomination({ ...denomination, amount: e.target.value })}
                placeholder="Amount"
                required
                type="text"
                value={denomination.amount}
              />
            </div>
            <div className="form-group">
              <label htmlFor="asset">Asset:</label>
              <input
                id="asset"
                onChange={e => setDenomination({ ...denomination, asset: e.target.value })}
                placeholder="Asset (e.g., GBP)"
                required
                type="text"
                value={denomination.asset}
              />
            </div>
            <div className="form-group">
              <label htmlFor="target">Target:</label>
              <select
                id="target"
                onChange={e => setDenomination({ ...denomination, target: e.target.value as 'origin' | 'destination' })}
                value={denomination.target}
              >
                <option value="origin">Origin</option>
                <option value="destination">Destination</option>
              </select>
            </div>
          </div>
        </fieldset>

        <fieldset>
          <legend>Origin</legend>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="originType">Type:</label>
              <select
                id="originType"
                onChange={e =>
                  setOrigin({ ...origin, type: e.target.value as 'account' | 'external-account' | 'crypto-address' })
                }
                value={origin.type}
              >
                <option value="account">Account</option>
                <option value="external-account">External Account</option>
                <option value="crypto-address">Crypto Address</option>
              </select>
            </div>
            {(origin.type === 'account' || origin.type === 'external-account') && (
              <div className="form-group">
                <label htmlFor="originId">ID:</label>
                <input
                  id="originId"
                  onChange={e => setOrigin({ ...origin, id: e.target.value })}
                  placeholder="Account ID"
                  required
                  type="text"
                  value={origin.id || ''}
                />
              </div>
            )}
            {origin.type === 'crypto-address' && (
              <>
                <div className="form-group">
                  <label htmlFor="originNetwork">Network:</label>
                  <input
                    id="originNetwork"
                    onChange={e => setOrigin({ ...origin, network: e.target.value })}
                    placeholder="Network (e.g., xrp-ledger)"
                    required
                    type="text"
                    value={origin.network || ''}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="originAddress">Address:</label>
                  <input
                    id="originAddress"
                    onChange={e => setOrigin({ ...origin, address: e.target.value })}
                    placeholder="Crypto address"
                    required
                    type="text"
                    value={origin.address || ''}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="originAsset">Asset:</label>
                  <input
                    id="originAsset"
                    onChange={e => setOrigin({ ...origin, asset: e.target.value })}
                    placeholder="Asset (e.g., XRP)"
                    type="text"
                    value={origin.asset || ''}
                  />
                </div>
              </>
            )}
          </div>
        </fieldset>

        <fieldset>
          <legend>Destination</legend>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="destType">Type:</label>
              <select
                id="destType"
                onChange={e =>
                  setDestination({
                    ...destination,
                    type: e.target.value as 'account' | 'external-account' | 'crypto-address'
                  })
                }
                value={destination.type}
              >
                <option value="account">Account</option>
                <option value="external-account">External Account</option>
                <option value="crypto-address">Crypto Address</option>
              </select>
            </div>
            {(destination.type === 'account' || destination.type === 'external-account') && (
              <div className="form-group">
                <label htmlFor="destId">ID:</label>
                <input
                  id="destId"
                  onChange={e => setDestination({ ...destination, id: e.target.value })}
                  placeholder="Account ID"
                  required
                  type="text"
                  value={destination.id || ''}
                />
              </div>
            )}
            {destination.type === 'crypto-address' && (
              <>
                <div className="form-group">
                  <label htmlFor="destNetwork">Network:</label>
                  <input
                    id="destNetwork"
                    onChange={e => setDestination({ ...destination, network: e.target.value })}
                    placeholder="Network (e.g., xrp-ledger)"
                    required
                    type="text"
                    value={destination.network || ''}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="destAddress">Address:</label>
                  <input
                    id="destAddress"
                    onChange={e => setDestination({ ...destination, address: e.target.value })}
                    placeholder="Crypto address"
                    required
                    type="text"
                    value={destination.address || ''}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="destAsset">Asset:</label>
                  <input
                    id="destAsset"
                    onChange={e => setDestination({ ...destination, asset: e.target.value })}
                    placeholder="Asset (e.g., XRP)"
                    type="text"
                    value={destination.asset || ''}
                  />
                </div>
              </>
            )}
          </div>
        </fieldset>

        <div className="form-actions">
          <button className="action-button secondary" onClick={onBack} type="button">
            Back
          </button>
          <button className="action-button" type="submit">
            Create Quote & Continue
          </button>
        </div>
      </form>
    </div>
  );
}

function WidgetScreen({
  error,
  isLoading,
  onBack,
  widgetResult
}: {
  error: Error | null;
  isLoading: boolean;
  onBack: () => void;
  widgetResult: WidgetResult | null;
}) {
  const [copied, setCopied] = useState(false);

  const handleCopyPayload = async () => {
    if (widgetResult?.payload !== undefined) {
      try {
        await navigator.clipboard.writeText(JSON.stringify(widgetResult.payload, null, 2));
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch {
        // Clipboard API failed, ignore
      }
    }
  };

  // Show result/error in a card container similar to form screens
  if (error || widgetResult) {
    return (
      <div className="details-container">
        <div className="details-form wide-form">
          {error && (
            <>
              <div className="error">
                <span className="error-icon">⚠️</span>
                <span className="error-message">An error occurred. Please try again later.</span>
              </div>
              <div className="error-details">
                <span>{error.toString()}</span>
              </div>
            </>
          )}
          {widgetResult && (
            <>
              {widgetResult.type === 'complete' && (
                <div className="success">
                  <span className="success-icon">✅</span>
                  <span className="success-message">Widget completed successfully!</span>
                </div>
              )}
              {widgetResult.type === 'cancel' && (
                <div className="warning">
                  <span className="warning-icon">⚠️</span>
                  <span className="warning-message">Widget was cancelled.</span>
                </div>
              )}
              {widgetResult.type === 'error' && (
                <div className="error">
                  <span className="error-icon">❌</span>
                  <span className="error-message">Widget encountered an error.</span>
                </div>
              )}
              {widgetResult.payload !== undefined && (
                <div className="payload-container">
                  <div className="payload-header">
                    <h3>Event Payload:</h3>
                    <button className="copy-button" onClick={handleCopyPayload} title="Copy to clipboard" type="button">
                      {copied ? '✓ Copied!' : '📋 Copy'}
                    </button>
                  </div>
                  <pre className="payload-code">{JSON.stringify(widgetResult.payload, null, 2)}</pre>
                </div>
              )}
            </>
          )}
          <div className="form-actions" style={{ marginTop: '20px' }}>
            <button className="action-button secondary" onClick={onBack} style={{ flex: 'none', width: '100%' }}>
              Back
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      {isLoading && <div className="loading">Loading...</div>}
      <div id="root" className="widget-container"></div>
    </>
  );
}

/**
 * Export component.
 */

export default function TravelRuleWidget() {
  const [screen, setScreen] = useState<Screen>('flow-selection');
  const [selectedFlow, setSelectedFlow] = useState<TravelRuleWidgetFlow | null>(null);
  const [createTravelRuleSessionData, setCreateTravelRuleSessionData] = useState<CreateTravelRuleSessionData>();
  const [flowError, setFlowError] = useState<Error | null>(null);
  const [isLoadingFlowData, setIsLoadingFlowData] = useState(false);
  const [widgetResult, setWidgetResult] = useState<WidgetResult | null>(null);

  const {
    error: createTravelRuleSessionError,
    isLoading: isCreatingTravelRuleSession,
    travelRuleSession
  } = useCreateTravelRuleSession(createTravelRuleSessionData);

  const isLoading = isLoadingFlowData || isCreatingTravelRuleSession;
  const error = flowError || createTravelRuleSessionError;

  // Mount widget when session is ready
  useEffect(() => {
    if (travelRuleSession && screen === 'widget') {
      const widgetElement = document.getElementById('root');

      if (widgetElement) {
        const widget = new TravelRuleWidgetClass(travelRuleSession, { debug: true });

        const errorHandler = (e: TravelRuleWidgetErrorEvent) => {
          setWidgetResult({ payload: e.detail.error, type: 'error' });
          widget.unmount();
        };

        const completeHandler = (e: TravelRuleWidgetCompleteEvent<TravelRuleWidgetFlow>) => {
          setWidgetResult({ payload: e.detail.value, type: 'complete' });
          widget.unmount();
        };

        const cancelHandler = (_: TravelRuleWidgetCancelEvent) => {
          setWidgetResult({ type: 'cancel' });
          widget.unmount();
        };

        widget.on('error', errorHandler);
        widget.on('complete', completeHandler);
        widget.on('cancel', cancelHandler);
        widget.mountIframe(widgetElement);

        return () => {
          widget.unmount();
        };
      }
    }
  }, [travelRuleSession, screen]);

  const handleSelectFlow = (flow: TravelRuleWidgetFlow) => {
    setSelectedFlow(flow);
    setScreen('flow-details');
    setFlowError(null);
    setWidgetResult(null);
  };

  const handleBack = useCallback(() => {
    if (screen === 'flow-details') {
      setScreen('flow-selection');
      setSelectedFlow(null);
    } else if (screen === 'widget') {
      setScreen('flow-selection');
      setSelectedFlow(null);
      setCreateTravelRuleSessionData(undefined);
    }

    setFlowError(null);
    setWidgetResult(null);
  }, [screen]);

  const handleDepositFormSubmit = useCallback(async (details: DepositFormDetails) => {
    setIsLoadingFlowData(true);
    setFlowError(null);
    setScreen('widget');

    try {
      const { onBehalfOf } = config.enterpriseApi.authentication;

      const token = await createToken({
        clientId: config.enterpriseApi.authentication.clientId,
        clientSecret: config.enterpriseApi.authentication.clientSecret
      });

      const requestsForInformation = await getRequestsForInformation(details.transactionId, {
        accessToken: token.access_token,
        onBehalfOf
      });

      if (!requestsForInformation || requestsForInformation.length === 0) {
        throw new Error(`No requests for information found for transaction ID: ${details.transactionId}`);
      }

      // Use the first request for information
      const [firstRequest] = requestsForInformation;

      if (!firstRequest) {
        throw new Error(`No requests for information found for transaction ID: ${details.transactionId}`);
      }

      setCreateTravelRuleSessionData({
        data: { requestForInformationId: firstRequest.id },
        flow: 'deposit-form'
      });
    } catch (e) {
      setFlowError(e as Error);
    } finally {
      setIsLoadingFlowData(false);
    }
  }, []);

  const handleWithdrawalFormSubmit = useCallback(async (details: WithdrawalFormDetails) => {
    setIsLoadingFlowData(true);
    setFlowError(null);
    setScreen('widget');

    try {
      const { onBehalfOf } = config.enterpriseApi.authentication;

      const token = await createToken({
        clientId: config.enterpriseApi.authentication.clientId,
        clientSecret: config.enterpriseApi.authentication.clientSecret
      });

      const quoteData: CreateQuoteData = {
        denomination: details.denomination,
        destination: details.destination,
        origin: details.origin
      };

      const quote = await createQuote(quoteData, {
        accessToken: token.access_token,
        onBehalfOf
      });

      setCreateTravelRuleSessionData({
        data: { quoteId: quote.id },
        flow: 'withdrawal-form'
      });
    } catch (e) {
      setFlowError(e as Error);
    } finally {
      setIsLoadingFlowData(false);
    }
  }, []);

  return (
    <div className="travel-rule-widget-container">
      <h1>Travel Rule Widget Web SDK Test Page</h1>

      {screen === 'flow-selection' && <FlowSelectionScreen onSelectFlow={handleSelectFlow} />}

      {screen === 'flow-details' && selectedFlow === 'deposit-form' && (
        <DepositFormDetailsScreen onBack={handleBack} onSubmit={handleDepositFormSubmit} />
      )}

      {screen === 'flow-details' && selectedFlow === 'withdrawal-form' && (
        <WithdrawalFormDetailsScreen onBack={handleBack} onSubmit={handleWithdrawalFormSubmit} />
      )}

      {screen === 'widget' && (
        <WidgetScreen error={error} isLoading={isLoading} onBack={handleBack} widgetResult={widgetResult} />
      )}
    </div>
  );
}
