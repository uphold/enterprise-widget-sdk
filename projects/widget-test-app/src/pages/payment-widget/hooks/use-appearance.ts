/**
 * Module dependencies.
 */

import { type Appearance, getStoredAppearance, storeAppearance } from '../appearance';
import { useState } from 'react';

/**
 * Exports.
 */

export const useAppearance = () => {
  const [appearance, setAppearance] = useState<Appearance>(getStoredAppearance);

  const changeAppearance = (value: Appearance) => {
    setAppearance(value);
    storeAppearance(value);
  };

  return { appearance, changeAppearance };
};
