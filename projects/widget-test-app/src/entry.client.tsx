/**
 * Module dependencies.
 */

import { HydratedRouter } from 'react-router/dom';
import { hydrateRoot } from 'react-dom/client';
import { startTransition } from 'react';

/**
 * Hydrate using a HydratedRouter only instead of
 * having it wrapped in React's StrictMode.
 */

startTransition(() => {
  hydrateRoot(document, <HydratedRouter />);
});
