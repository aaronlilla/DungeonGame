import type React from 'react';
import type { CombatRef } from '../../types/combat';

/**
 * Handles stop functionality for simulation
 * Monitors stopRef and updates combatRef accordingly
 */
export function setupStopHandler(
  stopRef: { current: boolean } | undefined,
  combatRef: React.MutableRefObject<CombatRef>
): ReturnType<typeof setInterval> | null {
  if (!stopRef) {
    return null;
  }

  const interval = setInterval(() => {
    if (stopRef.current) {
      combatRef.current.stop = true;
      clearInterval(interval);
    }
  }, 50);

  return interval;
}
