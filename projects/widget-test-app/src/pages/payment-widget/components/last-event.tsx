/**
 * Module dependencies.
 */

import { JsonBlock } from '../../../shared/react/components';

/**
 * Types.
 */

export type LastEvent = {
  type: 'cancel' | 'complete' | 'error';
  value?: unknown;
};

/**
 * Exports.
 */

export const LastEventDetails = ({ event }: { event: LastEvent }) => (
  <details className="message-details" open>
    <summary className="event-summary" id="message">
      Last event
      <span className={`event-badge ${event.type}`}>{event.type}</span>
    </summary>
    <div>
      {event.value !== undefined ? (
        <JsonBlock title={event.type === 'error' ? 'Error' : 'Value'} value={event.value} />
      ) : (
        <span>The user cancelled the flow.</span>
      )}
    </div>
  </details>
);
