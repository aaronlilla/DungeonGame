import type React from 'react';
import type { CombatState, CombatRef } from '../../types/combat';

export function createTimeoutChecker(
  totalTime: number,
  timeLimit: number,
  setTimedOut: (value: boolean) => void
) {
  return () => {
    if (totalTime >= timeLimit) {
      setTimedOut(true);
      return true;
    }
    return false;
  };
}

export function createCombatStateUpdater(
  currentCombatState: CombatState,
  setCombatState: (updater: (prev: CombatState) => CombatState) => void,
  updateLocalState: (state: CombatState) => void
) {
  return (updater: (prev: CombatState) => CombatState) => {
    const newState = updater(currentCombatState);
    updateLocalState(newState);
    setCombatState(() => newState);
  };
}

export function checkStopConditions(
  combatRef: React.MutableRefObject<CombatRef>,
  timedOut: boolean
): boolean {
  return combatRef.current.stop || timedOut;
}
