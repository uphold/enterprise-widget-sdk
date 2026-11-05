/**
 * Module dependencies.
 */

import { FLOW_BUTTONS, type FlowButton, type FlowCategory, getFlowKey } from '../flows';
import { FlowItem } from './flow-item';
import type { FlowOptionsController } from '../hooks/use-flow-options';

/**
 * Types.
 */

type FlowSectionsProps = {
  category: FlowCategory;
  expandedKey: number | null;
  onLaunch: (button: FlowButton) => void;
  onToggleOptions: (button: FlowButton) => void;
  options: FlowOptionsController;
};

/**
 * Exports.
 */

export const FlowSections = ({ category, expandedKey, onLaunch, onToggleOptions, options }: FlowSectionsProps) => (
  <div className="flow-sections">
    {category.sections.map((section, index) => {
      const buttons = FLOW_BUTTONS.filter(button => section.matches(button.flow));

      if (buttons.length === 0) {
        return null;
      }

      return (
        <section key={section.title ?? index} className="section">
          {section.title && (
            <div className="section-header">
              <h2 className="section-title">{section.title}</h2>
              {section.description && <p className="section-description">{section.description}</p>}
            </div>
          )}
          <div className="flow-grid">
            {buttons.map(button => (
              <FlowItem
                key={getFlowKey(button)}
                button={button}
                isExpanded={getFlowKey(button) === expandedKey}
                onLaunch={onLaunch}
                onToggleOptions={onToggleOptions}
                options={options}
              />
            ))}
          </div>
        </section>
      );
    })}
  </div>
);
