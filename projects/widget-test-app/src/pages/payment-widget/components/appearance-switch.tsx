/**
 * Module dependencies.
 */

import { APPEARANCES, type Appearance } from '../appearance';

/**
 * Types.
 */

type AppearanceSwitchProps = {
  onChange: (appearance: Appearance) => void;
  value: Appearance;
};

/**
 * Exports.
 */

export const AppearanceSwitch = ({ onChange, value }: AppearanceSwitchProps) => (
  <div aria-label="Widget appearance" className="appearance-switch" role="radiogroup">
    <span className="appearance-switch-label">Appearance</span>
    {APPEARANCES.map(({ id, label }) => (
      <label key={id}>
        <input checked={value === id} name="appearance" onChange={() => onChange(id)} type="radio" />
        {label}
      </label>
    ))}
  </div>
);
