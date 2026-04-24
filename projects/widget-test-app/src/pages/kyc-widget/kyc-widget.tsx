/**
 * Module dependencies.
 */

import './kyc-widget.css';
import type { CreateKycSessionData } from '../../shared/api/requests/create-kyc-session';
import {
  type KycProcess,
  type KycWidgetCancelEvent,
  KycWidget as KycWidgetClass,
  type KycWidgetCompleteEvent,
  type KycWidgetErrorEvent
} from '@uphold/enterprise-kyc-widget-web-sdk';
import { useCallback, useEffect, useState } from 'react';
import { useCreateKycSession } from '../../shared/react/kyc-widget-session';

/**
 * Types.
 */

type Screen = 'process-selection' | 'widget' | 'result';

type WidgetResult = {
  type: 'complete' | 'cancel' | 'error';
  payload?: unknown;
};

/**
 * Components.
 */

function ProcessSelectionScreen({ onLaunch }: { onLaunch: (processes: KycProcess[]) => void }) {
  const [selectedProcesses, setSelectedProcesses] = useState<KycProcess[]>([]);

  const toggleProcess = (process: KycProcess) => {
    setSelectedProcesses(previous =>
      previous.includes(process) ? previous.filter(prevProcess => prevProcess !== process) : [...previous, process]
    );
  };

  return (
    <div className="button-container">
      <p>Select KYC processes (optional):</p>
      <div className="process-selection">
        <label>
          <input
            checked={selectedProcesses.includes('identity')}
            onChange={() => toggleProcess('identity')}
            type="checkbox"
          />
          Identity
        </label>
        <label>
          <input
            checked={selectedProcesses.includes('proof-of-address')}
            onChange={() => toggleProcess('proof-of-address')}
            type="checkbox"
          />
          Proof of Address
        </label>
      </div>
      <button className="action-button" onClick={() => onLaunch(selectedProcesses)}>
        Launch KYC Widget
      </button>
    </div>
  );
}

function ResultScreen({ onBack, widgetResult }: { onBack: () => void; widgetResult: WidgetResult }) {
  return (
    <div className="details-container">
      <div className="details-form wide-form">
        {widgetResult.type === 'complete' && (
          <div className="success">
            <span className="success-icon">✅</span>
            <span className="success-message">KYC completed successfully!</span>
          </div>
        )}
        {widgetResult.type === 'cancel' && (
          <div className="warning">
            <span className="warning-icon">⚠️</span>
            <span className="warning-message">KYC was cancelled.</span>
          </div>
        )}
        {widgetResult.type === 'error' && (
          <>
            <div className="error">
              <span className="error-icon">❌</span>
              <span className="error-message">KYC encountered an error.</span>
            </div>
            {widgetResult.payload !== undefined && (
              <div className="error-details">
                <span>{JSON.stringify(widgetResult.payload, null, 2)}</span>
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

/**
 * Export component.
 */

export default function KycWidget() {
  const [screen, setScreen] = useState<Screen>('process-selection');
  const [createKycSessionData, setCreateKycSessionData] = useState<CreateKycSessionData>();
  const [widgetResult, setWidgetResult] = useState<WidgetResult | null>(null);

  const {
    error: createKycSessionError,
    isLoading: isCreatingKycSession,
    kycSession
  } = useCreateKycSession(createKycSessionData);

  // Mount widget when session is ready
  useEffect(() => {
    if (kycSession) {
      const widget = new KycWidgetClass(kycSession, { debug: true });

      const errorHandler = (e: KycWidgetErrorEvent) => {
        setWidgetResult({ payload: e.detail.error, type: 'error' });
        widget.unmount();
        setScreen('result');
      };

      const completeHandler = (_: KycWidgetCompleteEvent) => {
        setWidgetResult({ type: 'complete' });
        widget.unmount();
        setScreen('result');
      };

      const cancelHandler = (_: KycWidgetCancelEvent) => {
        setWidgetResult({ type: 'cancel' });
        widget.unmount();
        setScreen('result');
      };

      widget.on('error', errorHandler);
      widget.on('complete', completeHandler);
      widget.on('cancel', cancelHandler);

      widget.mountIframe(document.getElementById('root')!);

      return () => {
        widget.unmount();
      };
    }
  }, [kycSession]);

  const handleLaunch = useCallback((processes: KycProcess[]) => {
    setCreateKycSessionData({ processes: processes.length ? processes : undefined });
    setScreen('widget');
    setWidgetResult(null);
  }, []);

  const handleBack = useCallback(() => {
    setScreen('process-selection');
    setCreateKycSessionData(undefined);
    setWidgetResult(null);
  }, []);

  return (
    <div className="kyc-widget-container">
      <h1>KYC Widget Web SDK Test Page</h1>

      {screen === 'process-selection' && <ProcessSelectionScreen onLaunch={handleLaunch} />}

      {screen === 'widget' && (
        <>
          {isCreatingKycSession && <div className="loading">Loading...</div>}
          {createKycSessionError && (
            <>
              <div className="error">
                <span className="error-icon">⚠️</span>
                <span className="error-message">An error occurred. Please try again later.</span>
              </div>
              <div className="error-details">
                <span>{createKycSessionError.toString()}</span>
              </div>
              <button className="action-button secondary" onClick={handleBack} style={{ marginTop: '20px' }}>
                Back
              </button>
            </>
          )}

          <div id="root" className="widget-container"></div>
        </>
      )}

      {screen === 'result' && widgetResult && <ResultScreen onBack={handleBack} widgetResult={widgetResult} />}
    </div>
  );
}
