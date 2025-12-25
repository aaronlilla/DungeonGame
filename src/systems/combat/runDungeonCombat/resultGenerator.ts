import type { CombatState, TeamMemberState } from '../../../types/combat';
import type { DungeonRunResult, PlayerRunStats } from '../../../types/dungeon';
import { generateOrbDrops } from '../../crafting';
import type { CombatContext } from '../types';

/**
 * Generate player stats from team states
 */
function generatePlayerStats(teamStates: TeamMemberState[], totalTime: number): PlayerRunStats[] {
  return teamStates.map(member => ({
    id: member.id,
    name: member.name,
    role: member.role,
    // Damage stats
    totalDamage: member.totalDamage || 0,
    damageBySpell: member.damageBySpell || {},
    dps: totalTime > 0 ? Math.floor((member.totalDamage || 0) / totalTime) : 0,
    // Healing stats
    totalHealing: member.totalHealing || 0,
    healingBySpell: member.healingBySpell || {},
    hps: totalTime > 0 ? Math.floor((member.totalHealing || 0) / totalTime) : 0,
    // Damage taken stats
    damageTaken: member.damageTaken || 0,
    damageTakenBySource: member.damageTakenBySource || {},
    damageTakenByAbility: member.damageTakenByAbility || {},
    dtps: totalTime > 0 ? Math.floor((member.damageTaken || 0) / totalTime) : 0,
    // Other stats
    deaths: member.isDead ? 1 : 0, // This is simplified - would need to track actual death count
    timeAlive: totalTime // Simplified - would need actual death timestamps
  }));
}

/**
 * Generates success result for completed dungeon
 */
export function generateSuccessResult(
  context: CombatContext,
  teamStates: TeamMemberState[],
  currentCombatState: CombatState,
  totalForcesCleared: number,
  totalTime: number,
  mapTier?: number,
  _quantityBonus?: number,
  _rarityBonus?: number,
  _highestMapTierCompleted?: number
): DungeonRunResult {
  const { dungeon, selectedKeyLevel, scaling, callbacks } = context;
  const { completeDungeonRun, addOrbs, addKey, setRunResult, setIsRunning } = callbacks;
  
  // Use map tier if provided, otherwise fall back to key level
  const effectiveTier = mapTier ?? selectedKeyLevel;
  
  // Calculate upgrade level based on time remaining
  const timeRemaining = dungeon.timeLimitSeconds - totalTime;
  const upgradeLevel = timeRemaining > dungeon.timeLimitSeconds * 0.4 ? 3 : timeRemaining > dungeon.timeLimitSeconds * 0.2 ? 2 : 1;
  
  // NOTE: Loot is no longer generated here - it all drops during combat from enemies
  // We only generate orbs as a completion bonus
  const orbDrops = generateOrbDrops(effectiveTier, true);
  const xp = Math.floor(1000 * scaling.rewardMultiplier * (1 + upgradeLevel * 0.25));

  // Merge verbose logger logs with regular combat log
  const verboseLogs = context.verboseLogger?.getLogs() || [];
  const allLogs = [...currentCombatState.combatLog, ...verboseLogs];
  // Sort by timestamp to ensure chronological order
  allLogs.sort((a, b) => a.timestamp - b.timestamp);

  const result: DungeonRunResult = {
    success: true,
    keyLevel: selectedKeyLevel,
    timeElapsed: totalTime,
    timeLimit: dungeon.timeLimitSeconds,
    upgradeLevel,
    loot: [], // Loot is now collected during combat, not generated at end
    orbDrops,
    experienceGained: xp,
    deaths: teamStates.filter(m => m.isDead).length,
    forcesCleared: totalForcesCleared,
    forcesRequired: dungeon.requiredForces,
    combatLog: allLogs,
    // Enhanced stats
    playerStats: generatePlayerStats(teamStates, totalTime),
    dungeonName: dungeon.name,
    affixes: [],
    startTime: Date.now() - (totalTime * 1000),
    endTime: Date.now(),
    // Map system
    mapTier: effectiveTier,
    mapDrops: [], // Maps are now dropped during combat
    fragmentDrops: [] // Fragments are now dropped during combat
  };

  completeDungeonRun(result);
  addOrbs(orbDrops);
  addKey({ id: crypto.randomUUID(), dungeonId: dungeon.id, level: selectedKeyLevel + upgradeLevel, affixes: [], depleted: false });

  setRunResult(result);
  setIsRunning(false);
  
  return result;
}

/**
 * Generates timeout result
 */
export function generateTimeoutResult(
  context: CombatContext,
  teamStates: TeamMemberState[],
  currentCombatState: CombatState,
  totalForcesCleared: number,
  totalTime: number,
  mapTier?: number,
  _quantityBonus?: number,
  _rarityBonus?: number,
  _highestMapTierCompleted?: number
): DungeonRunResult {
  const { dungeon, selectedKeyLevel, scaling, callbacks } = context;
  const { addOrbs, setRunResult, setIsRunning } = callbacks;
  
  // Use map tier if provided, otherwise fall back to key level
  const effectiveTier = mapTier ?? selectedKeyLevel;
  
  // NOTE: Loot is no longer generated here - it all drops during combat from enemies
  const orbDrops = generateOrbDrops(effectiveTier, true);
  const xp = Math.floor(500 * scaling.rewardMultiplier);
  
  // Merge verbose logger logs with regular combat log
  const verboseLogs = context.verboseLogger?.getLogs() || [];
  const allLogs = [...currentCombatState.combatLog, ...verboseLogs];
  // Sort by timestamp to ensure chronological order
  allLogs.sort((a, b) => a.timestamp - b.timestamp);

  const result: DungeonRunResult = {
    success: false,
    keyLevel: selectedKeyLevel,
    timeElapsed: totalTime,
    timeLimit: dungeon.timeLimitSeconds,
    upgradeLevel: 0,
    loot: [], // Loot is now collected during combat
    orbDrops,
    experienceGained: xp,
    deaths: teamStates.filter(m => m.isDead).length,
    forcesCleared: totalForcesCleared,
    forcesRequired: dungeon.requiredForces,
    combatLog: allLogs,
    failReason: 'timeout',
    failedPullIndex: currentCombatState.currentPullIndex,
    // Enhanced stats
    playerStats: generatePlayerStats(teamStates, totalTime),
    dungeonName: dungeon.name,
    affixes: [],
    startTime: Date.now() - (totalTime * 1000),
    endTime: Date.now(),
    // Map system
    mapTier: effectiveTier,
    mapDrops: [], // Maps are dropped during combat
    fragmentDrops: [] // Fragments are dropped during combat
  };
  
  addOrbs(orbDrops);
  setRunResult(result);
  setIsRunning(false);
  
  return result;
}

// Export for use by wipeHandler
export { generatePlayerStats };
