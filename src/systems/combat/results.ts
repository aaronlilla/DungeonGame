import type { DungeonRunResult, CombatState } from '../../types/dungeon';
import type { TeamMemberState } from '../../types/combat';
import { generateDungeonLoot, generateOrbDrops, generateFragmentDrops } from '../crafting';
import type { DungeonCombatCallbacks } from './types';

export function createWipeResult(
  teamStates: TeamMemberState[],
  totalForcesCleared: number,
  selectedKeyLevel: number,
  scaling: ReturnType<typeof import('../../types/dungeon').calculateKeyScaling>,
  dungeon: { requiredForces: number; timeLimitSeconds: number },
  currentCombatState: CombatState,
  deathCauses: Record<string, string>
): DungeonRunResult {
  const progressPercent = totalForcesCleared / dungeon.requiredForces;
  const wipeLootCount = Math.max(1, Math.floor(progressPercent * 3) + Math.floor(selectedKeyLevel / 5));
  const loot = generateDungeonLoot(selectedKeyLevel, false, 0).slice(0, wipeLootCount);
  const orbDrops = generateOrbDrops(selectedKeyLevel, false, progressPercent);
  const fragmentDrops = generateFragmentDrops(selectedKeyLevel, false, 0, scaling.itemQuantity, scaling.itemRarity);
  const xp = Math.floor(200 * scaling.rewardMultiplier * progressPercent);

  return {
    success: false,
    keyLevel: selectedKeyLevel,
    timeElapsed: currentCombatState.timeElapsed || 0,
    timeLimit: dungeon.timeLimitSeconds,
    upgradeLevel: 0,
    loot,
    orbDrops,
    fragmentDrops,
    experienceGained: xp,
    deaths: teamStates.filter(m => m.isDead).length,
    forcesCleared: totalForcesCleared,
    forcesRequired: dungeon.requiredForces,
    combatLog: currentCombatState.combatLog,
    failReason: 'wipe',
    failedPullIndex: currentCombatState.currentPullIndex,
    deathCauses
  };
}

export function createTimeoutResult(
  teamStates: TeamMemberState[],
  totalForcesCleared: number,
  selectedKeyLevel: number,
  scaling: ReturnType<typeof import('../../types/dungeon').calculateKeyScaling>,
  dungeon: { requiredForces: number; timeLimitSeconds: number },
  currentCombatState: CombatState
): DungeonRunResult {
  const loot = generateDungeonLoot(selectedKeyLevel, true, 0, scaling.itemQuantity, scaling.itemRarity);
  const orbDrops = generateOrbDrops(selectedKeyLevel, true);
  const fragmentDrops = generateFragmentDrops(selectedKeyLevel, true, 0, scaling.itemQuantity, scaling.itemRarity);
  const xp = Math.floor(500 * scaling.rewardMultiplier);

  return {
    success: false,
    keyLevel: selectedKeyLevel,
    timeElapsed: currentCombatState.timeElapsed || 0,
    timeLimit: dungeon.timeLimitSeconds,
    upgradeLevel: 0,
    loot,
    orbDrops,
    fragmentDrops,
    experienceGained: xp,
    deaths: teamStates.filter(m => m.isDead).length,
    forcesCleared: totalForcesCleared,
    forcesRequired: dungeon.requiredForces,
    combatLog: currentCombatState.combatLog,
    failReason: 'timeout',
    failedPullIndex: currentCombatState.currentPullIndex
  };
}

export function createVictoryResult(
  teamStates: TeamMemberState[],
  totalForcesCleared: number,
  selectedKeyLevel: number,
  scaling: ReturnType<typeof import('../../types/dungeon').calculateKeyScaling>,
  dungeon: { requiredForces: number; timeLimitSeconds: number; id: string },
  currentCombatState: CombatState,
  totalTime: number
): DungeonRunResult {
  const timeRemaining = dungeon.timeLimitSeconds - totalTime;
  const upgradeLevel = timeRemaining > dungeon.timeLimitSeconds * 0.4 ? 3 : timeRemaining > dungeon.timeLimitSeconds * 0.2 ? 2 : 1;
  
  const loot = generateDungeonLoot(selectedKeyLevel, true, upgradeLevel, scaling.itemQuantity, scaling.itemRarity);
  const orbDrops = generateOrbDrops(selectedKeyLevel, true);
  const fragmentDrops = generateFragmentDrops(selectedKeyLevel, true, upgradeLevel, scaling.itemQuantity, scaling.itemRarity);
  const xp = Math.floor(1000 * scaling.rewardMultiplier * (1 + upgradeLevel * 0.25));

  return {
    success: true,
    keyLevel: selectedKeyLevel,
    timeElapsed: totalTime,
    timeLimit: dungeon.timeLimitSeconds,
    upgradeLevel,
    loot,
    orbDrops,
    fragmentDrops,
    experienceGained: xp,
    deaths: teamStates.filter(m => m.isDead).length,
    forcesCleared: totalForcesCleared,
    forcesRequired: dungeon.requiredForces,
    combatLog: currentCombatState.combatLog
  };
}

export function finalizeResult(
  result: DungeonRunResult,
  callbacks: DungeonCombatCallbacks,
  dungeon: { id: string },
  selectedKeyLevel: number,
  upgradeLevel: number
) {
  callbacks.completeDungeonRun(result);
  callbacks.addOrbs(result.orbDrops);
  callbacks.addKey({
    id: crypto.randomUUID(),
    dungeonId: dungeon.id,
    level: selectedKeyLevel + upgradeLevel,
    affixes: [],
    depleted: false
  });
  callbacks.setRunResult(result);
  callbacks.setIsRunning(false);
}
