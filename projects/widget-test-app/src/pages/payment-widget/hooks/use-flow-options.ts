/**
 * Module dependencies.
 */

import { type AuthorizeSelection, type FlowButton, getFlowKey } from '../flows';
import { getPresetText } from '../options/options-template';
import { parseOptionsText } from '../options/jsonc';
import { splitOptions } from '../options/split-options';
import { useState } from 'react';

/**
 * Types.
 */

// What launching a flow resolves to: the flow with the options as they were set, or why it cannot be launched.
type FlowLaunch = { error: string; flow?: undefined } | { error?: undefined; flow: FlowButton };

/**
 * What is chosen on the flows before launching them: the options edited and, on the authorize flows, the payment
 * method and whether it is headless.
 */

export const useFlowOptions = () => {
  // The edits made to the options of each flow, by flow, and what was chosen on the authorize flows.
  const [drafts, setDrafts] = useState<Record<number, string>>({});
  const [authorizeSelections, setAuthorizeSelections] = useState<Record<string, AuthorizeSelection>>({});

  const getOptionsText = (button: FlowButton) => drafts[getFlowKey(button)] ?? getPresetText(button);

  const setOptionsText = (button: FlowButton, text: string) =>
    setDrafts(current => ({ ...current, [getFlowKey(button)]: text }));

  const resetOptions = (button: FlowButton) => setDrafts(({ [getFlowKey(button)]: _, ...rest }) => rest);

  const isEdited = (button: FlowButton) => getOptionsText(button) !== getPresetText(button);

  const getAuthorizeSelection = (button: FlowButton): AuthorizeSelection =>
    authorizeSelections[button.flow] ?? { isHeadless: false, methodId: button.methods?.[0]?.id ?? '' };

  const updateAuthorizeSelection = (button: FlowButton, selection: Partial<AuthorizeSelection>) =>
    setAuthorizeSelections(current => ({
      ...current,
      [button.flow]: { ...getAuthorizeSelection(button), ...selection }
    }));

  const resolveLaunch = (button: FlowButton): FlowLaunch => {
    const parsed = parseOptionsText(getOptionsText(button));

    if (parsed.error !== undefined) {
      return { error: parsed.error };
    }

    const { options, sessionOptions } = splitOptions(parsed.value);
    const { isHeadless, methodId } = getAuthorizeSelection(button);
    const method = button.methods?.find(({ id }) => id === methodId);

    return {
      flow: {
        ...button,
        label: method ? `${button.label} (${method.label}${isHeadless ? ', headless' : ''})` : button.label,
        options: isHeadless ? { ...options, authorize: { ...options.authorize, mode: 'headless' } } : options,
        quoteConfigKey: method?.quoteConfigKey ?? button.quoteConfigKey,
        sessionOptions
      }
    };
  };

  return {
    getAuthorizeSelection,
    getOptionsText,
    isEdited,
    resetOptions,
    resolveLaunch,
    setOptionsText,
    updateAuthorizeSelection
  };
};

export type FlowOptionsController = ReturnType<typeof useFlowOptions>;
