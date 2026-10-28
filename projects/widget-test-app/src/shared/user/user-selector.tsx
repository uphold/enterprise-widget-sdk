/**
 * Module dependencies.
 */

import './user-selector.css';
import { getEnvironments } from './active-environment';
import { getUsers } from './active-user';

/**
 * Types.
 */

type UserSelectorProps = {
  environment: string;
  value: string;
  onEnvironmentChange: (key: string) => void;
  onChange: (key: string) => void;
};

/**
 * Export `UserSelector` component.
 * Only lists the users of the selected environment.
 */

export const UserSelector = ({ environment, onChange, onEnvironmentChange, value }: UserSelectorProps) => {
  const environments = getEnvironments();
  const users = getUsers();
  const activeUser = users.find(user => user.key === value);

  return (
    <div className="user-selector">
      <label htmlFor="environment-selector">Environment</label>
      <select id="environment-selector" value={environment} onChange={event => onEnvironmentChange(event.target.value)}>
        {environments.map(({ key, label }) => (
          <option key={key} value={key}>
            {label}
          </option>
        ))}
      </select>
      <label htmlFor="user-selector">User</label>
      <select id="user-selector" value={value} onChange={event => onChange(event.target.value)}>
        {users.map(user => (
          <option key={user.key} value={user.key}>
            {user.label} ({user.id.slice(0, 8)})
          </option>
        ))}
      </select>
      {activeUser && (
        <button
          className="user-selector-copy"
          onClick={() => navigator.clipboard?.writeText(activeUser.id)}
          title={activeUser.id}
          type="button"
        >
          Copy id
        </button>
      )}
    </div>
  );
};
