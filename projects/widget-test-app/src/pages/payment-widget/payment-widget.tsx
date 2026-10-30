/**
 * Module dependencies.
 */

import { AppearanceSwitch } from './components/appearance-switch';
import { type Breadcrumb, PageHeader } from '../../shared/react/components';
import type { CreatePaymentSessionData } from '../../shared/api';
import { FLOW_CATEGORIES, type FlowButton, type FlowCategory, getFlowKey } from './flows';
import { FlowSections } from './components/flow-sections';
import { type LastEvent, LastEventDetails } from './components/last-event';
import { OptionTags } from './components/option-tags';
import type { PaymentWidgetOptions } from '@uphold/enterprise-payment-widget-web-sdk';
import { summarizeOptions } from './options/options-summary';
import { useAppearance } from './hooks/use-appearance';
import { useCreatePaymentSession } from '../../shared/react/payment-widget-session';
import { useFlowData } from '../../shared/react/payment-widget-session/use-flow-data';
import { useFlowOptions } from './hooks/use-flow-options';
import { useMountedWidget } from './hooks/use-mounted-widget';
import { useState } from 'react';
import { withAppearance } from './appearance';

/**
 * Helpers.
 */

type BreadcrumbsParams = {
  category?: FlowCategory;
  isIdle: boolean;
  onBackToCategories: () => void;
  onBackToFlows: () => void;
  selectedButton: FlowButton | null;
};

// Each level goes back to its own screen: the categories, the flows of the category, or the launched flow.
const buildBreadcrumbs = ({
  category,
  isIdle,
  onBackToCategories,
  onBackToFlows,
  selectedButton
}: BreadcrumbsParams): Breadcrumb[] => {
  const breadcrumbs: Breadcrumb[] = [{ label: 'All widgets', to: '/' }];

  if (isIdle && !category) {
    return [...breadcrumbs, { label: 'Payment Widget' }];
  }

  breadcrumbs.push({
    label: 'Payment Widget',
    onClick: () => {
      onBackToFlows();
      onBackToCategories();
    }
  });

  if (category) {
    breadcrumbs.push({ label: category.title, onClick: onBackToFlows });
  }

  if (!isIdle && selectedButton) {
    breadcrumbs.push({ label: selectedButton.label });
  }

  return breadcrumbs;
};

/**
 * Export component.
 */

export default function PaymentWidget() {
  const [createPaymentSessionData, setCreatePaymentSessionData] = useState<CreatePaymentSessionData>();
  // The options the widget is created with, which are the ones of the launched flow.
  const [selectedOptions, setSelectedOptions] = useState<PaymentWidgetOptions>();
  const [selectedButton, setSelectedButton] = useState<FlowButton | null>(null);
  const [categoryId, setCategoryId] = useState<string | null>(null);
  // The flow whose options are shown, by its position in the flows.
  const [expandedKey, setExpandedKey] = useState<number | null>(null);
  const [lastEvent, setLastEvent] = useState<LastEvent | null>(null);

  const { appearance, changeAppearance } = useAppearance();
  const flowOptions = useFlowOptions();
  const { error: loadFlowDataError, isLoading: isLoadingFlowData, loadFlowData, reset: resetFlowData } = useFlowData();
  const {
    error: createPaymentSessionError,
    isLoading: isCreatingPaymentSession,
    paymentSession
  } = useCreatePaymentSession(createPaymentSessionData);

  useMountedWidget(paymentSession, selectedOptions, setLastEvent);

  const category = FLOW_CATEGORIES.find(({ id }) => id === categoryId);
  const isLoading = isLoadingFlowData || isCreatingPaymentSession;
  const error = loadFlowDataError || createPaymentSessionError;
  const isIdle = !createPaymentSessionData && !isLoading && !error;

  const startFlow = (button: FlowButton) => {
    const { flow, options, quoteConfigKey, sessionOptions } = button;

    const load = async () => {
      const data = await loadFlowData(flow, quoteConfigKey);

      setSelectedButton(button);
      setSelectedOptions(withAppearance(options, appearance));
      setCreatePaymentSessionData({ data, flow, options: sessionOptions });
    };

    load();
  };

  // Launches the flow with its options. When the options are not valid, they are shown instead, so the error is seen.
  const launchFlow = (button: FlowButton) => {
    const launch = flowOptions.resolveLaunch(button);

    if (launch.error !== undefined) {
      setExpandedKey(getFlowKey(button));

      return;
    }

    startFlow(launch.flow);
  };

  const toggleOptions = (button: FlowButton) => {
    const key = getFlowKey(button);

    setExpandedKey(current => (current === key ? null : key));
  };

  const selectCategory = (id: string | null) => {
    setCategoryId(id);
    setExpandedKey(null);
  };

  // Goes back to the flows of the category, unmounting the widget (if any) and clearing the last result or error.
  const onBackToFlows = () => {
    setCreatePaymentSessionData(undefined);
    setSelectedOptions(undefined);
    setSelectedButton(null);
    setLastEvent(null);
    resetFlowData();
  };

  const onBackToCategories = () => selectCategory(null);

  // Goes back from the flows of a category to the categories, or from a launched flow to the flows of its category.
  let onBack: (() => void) | undefined = onBackToFlows;

  if (isIdle) {
    onBack = category ? onBackToCategories : undefined;
  }

  const launchedOptions = { ...selectedOptions, ...createPaymentSessionData?.options };

  return (
    <div className="payment-widget-container">
      {/* The description is dropped once a flow is launched, to leave more room for the widget. */}
      <PageHeader
        breadcrumbs={buildBreadcrumbs({ category, isIdle, onBackToCategories, onBackToFlows, selectedButton })}
        backLabel={isIdle ? '← All categories' : `← ${category?.title ?? 'All flows'}`}
        onBack={onBack}
        subtitle={
          isIdle || !selectedButton ? (
            (category?.description ?? 'Launch any payment widget flow against your configured environment.')
          ) : (
            <span className="selected-flow">
              <span className="selected-flow-label">{selectedButton.label}</span>
              <span className="flow-card-flow">{selectedButton.flow}</span>
              <OptionTags tags={summarizeOptions(launchedOptions)} title={JSON.stringify(launchedOptions)} />
            </span>
          )
        }
        title={isIdle && category ? category.title : 'Payment Widget'}
      />

      {isLoading && <div className="loading">Loading…</div>}
      {error && (
        <details className="error-details">
          <summary className="error">
            <span className="error-icon">⚠️</span>
            <span className="error-message">An error occurred. Please try again later.</span>
          </summary>
          <div>
            <br />
            <span>{error.toString()}</span>
          </div>
        </details>
      )}
      {lastEvent && <LastEventDetails event={lastEvent} />}
      {isIdle && <AppearanceSwitch onChange={changeAppearance} value={appearance} />}
      {isIdle && !category && (
        <div className="flow-grid">
          {FLOW_CATEGORIES.map(({ description, id, title }) => (
            <button key={id} className="flow-card" onClick={() => selectCategory(id)}>
              <span className="flow-card-label">{title}</span>
              <span className="section-description">{description}</span>
            </button>
          ))}
        </div>
      )}
      {isIdle && category && (
        <FlowSections
          category={category}
          expandedKey={expandedKey}
          onLaunch={launchFlow}
          onToggleOptions={toggleOptions}
          options={flowOptions}
        />
      )}

      <div id="root" className="widget-container"></div>
    </div>
  );
}
