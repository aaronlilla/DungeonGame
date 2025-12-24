import type React from 'react';
import type { CombatRef } from '../../types/combat';

/**
 * Creates no-op callbacks for simulation mode
 * These are required by runDungeonCombat but don't need to do anything in simulation
 */
export function createSimulationCallbacks(_combatRef: React.MutableRefObject<CombatRef>) {
  // Track animation states (not used in simulation but required by callbacks)
  let teamFightAnim = 0;
  let enemyFightAnims: Record<string, number> = {};
  let screenShake = 0;

  return {
    setIsRunning: () => {},
    setIsPaused: () => {},
    setScreenShake: (updater: (prev: number) => number) => {
      screenShake = updater(screenShake);
    },
    setTeamFightAnim: (updater: (prev: number) => number) => {
      teamFightAnim = updater(teamFightAnim);
    },
    setEnemyFightAnims: (updater: (prev: Record<string, number>) => Record<string, number>) => {
      enemyFightAnims = updater(enemyFightAnims);
    },
    addOrbs: () => {},
    completeDungeonRun: () => {},
    addKey: () => {},
    awardExperience: (_characterId: string, _experience: number) => null,
    setRunResult: () => {}
  };
}
