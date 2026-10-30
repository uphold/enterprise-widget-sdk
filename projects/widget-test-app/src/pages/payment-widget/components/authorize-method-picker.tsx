/**
 * Module dependencies.
 */

import type { AuthorizeSelection, FlowButton } from '../flows';

/**
 * Types.
 */

type AuthorizeMethodPickerProps = {
  button: FlowButton;
  onChange: (selection: Partial<AuthorizeSelection>) => void;
  selection: AuthorizeSelection;
};

/**
 * Exports.
 */

export const AuthorizeMethodPicker = ({ button, onChange, selection }: AuthorizeMethodPickerProps) => {
  const { isHeadless, methodId } = selection;
  const pickedMethod = button.methods?.find(({ id }) => id === methodId);

  return (
    <>
      <div aria-label="Payment method" className="process-selection" role="radiogroup">
        {button.methods?.map(method => (
          <label key={method.id}>
            <input
              checked={method.id === methodId}
              name={`payment-method-${button.flow}`}
              onChange={() => onChange({ methodId: method.id })}
              type="radio"
            />
            {method.label}
          </label>
        ))}
      </div>
      <div className="process-selection single">
        <label>
          <input checked={isHeadless} onChange={e => onChange({ isHeadless: e.target.checked })} type="checkbox" />
          Headless mode
          {pickedMethod?.headlessNote && <span className="section-description">{pickedMethod.headlessNote}</span>}
        </label>
      </div>
    </>
  );
};
