/**
 * Module dependencies.
 */

import type { AuthorizeSelection, FlowButton } from '../flows';
import { getPresetText } from './options-template';
import { parseOptionsText } from './jsonc';

/**
 * Summary of the options, to show which flows have options set and what they are: one tag per option, with its value
 * when it is a simple one, e.g. `layout: fluid` or `theme.appearance: dark`.
 */

export type OptionTag = { label: string; variant?: 'edited' | 'invalid' };

export const summarizeOptions = (options: Record<string, unknown>): OptionTag[] =>
  Object.entries(options)
    .filter(([, value]) => value !== undefined)
    .map(([key, value]) => {
      if (typeof value !== 'object' || value === null) {
        return { label: `${key}: ${String(value)}` };
      }

      // Lists of typed items, like the payment methods, show their types, e.g. `paymentMethods: card, bank`.
      if (Array.isArray(value) && value.length > 0 && value.every(item => typeof item?.type === 'string')) {
        return { label: `${key}: ${value.map(({ type }) => type).join(', ')}` };
      }

      const entries = Object.entries(value);
      const [[subKey, subValue] = []] = entries;

      if (!Array.isArray(value) && entries.length === 1 && typeof subValue !== 'object') {
        return { label: `${key}.${subKey}: ${String(subValue)}` };
      }

      return { label: key };
    });

type FlowTags = { tags: OptionTag[]; title: string };

/**
 * What is not default on a flow, which is shown on its card: its options, the payment method and the headless mode of
 * the authorize flows, and whether the options were edited.
 */

export const getFlowTags = (button: FlowButton, optionsText: string, selection: AuthorizeSelection): FlowTags => {
  const parsed = parseOptionsText(optionsText);

  if (parsed.error !== undefined) {
    return { tags: [{ label: 'invalid options', variant: 'invalid' }], title: parsed.error };
  }

  const method = button.methods?.find(({ id }) => id === selection.methodId);
  const tags: OptionTag[] = [];

  if (button.methods && method && method !== button.methods[0]) {
    tags.push({ label: method.label });
  }

  if (selection.isHeadless) {
    tags.push({ label: 'headless' });
  }

  tags.push(...summarizeOptions(parsed.value));

  if (tags.length > 0 && optionsText !== getPresetText(button)) {
    tags.unshift({ label: 'edited', variant: 'edited' });
  }

  return { tags, title: JSON.stringify(parsed.value) };
};
