/**
 * Module dependencies.
 */

import { AuthorizeMethodPicker } from './authorize-method-picker';
import { type FlowButton, getFlowKey } from '../flows';
import type { FlowOptionsController } from '../hooks/use-flow-options';
import { OptionTags } from './option-tags';
import { OptionsEditor } from './options-editor';
import { getFlowTags } from '../options/options-summary';
import { parseOptionsText } from '../options/jsonc';

/**
 * Constants.
 */

const MAX_CARD_TAGS = 3;

/**
 * Types.
 */

type FlowItemProps = {
  button: FlowButton;
  isExpanded: boolean;
  onLaunch: (button: FlowButton) => void;
  onToggleOptions: (button: FlowButton) => void;
  options: FlowOptionsController;
};

/**
 * Exports.
 */

/**
 * Card of a flow. Clicking it launches the flow, and its options button expands it to show the options.
 */

export const FlowItem = ({ button, isExpanded, onLaunch, onToggleOptions, options }: FlowItemProps) => {
  const key = getFlowKey(button);
  const optionsText = options.getOptionsText(button);
  const selection = options.getAuthorizeSelection(button);
  const { tags, title } = getFlowTags(button, optionsText, selection);

  return (
    <div className={`flow-item${isExpanded ? ' expanded' : ''}`}>
      <div className="flow-item-header">
        <button className="flow-item-launch" onClick={() => onLaunch(button)} type="button">
          <span className="flow-card-label">{button.label}</span>
          <span className="flow-card-flow">{button.flow}</span>
          <OptionTags max={MAX_CARD_TAGS} tags={tags} title={title} />
        </button>
        <button
          aria-controls={`flow-options-${key}`}
          aria-expanded={isExpanded}
          className="flow-item-options"
          onClick={() => onToggleOptions(button)}
          type="button"
        >
          Options {isExpanded ? '▴' : '▾'}
        </button>
      </div>
      {isExpanded && (
        <div className="flow-item-body" id={`flow-options-${key}`}>
          {button.methods && (
            <AuthorizeMethodPicker
              button={button}
              onChange={change => options.updateAuthorizeSelection(button, change)}
              selection={selection}
            />
          )}
          <OptionsEditor
            id={`widget-options-${key}`}
            isEdited={options.isEdited(button)}
            onChange={text => options.setOptionsText(button, text)}
            onReset={() => options.resetOptions(button)}
            text={optionsText}
          />
          <div className="button-container">
            <button
              className="action-button"
              disabled={parseOptionsText(optionsText).error !== undefined}
              onClick={() => onLaunch(button)}
            >
              Launch
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
