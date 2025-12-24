import type { CombatState, TeamMemberState } from '../../../types/combat';
import type { DungeonRunResult } from '../../../types/dungeon';
import { generateOrbDrops } from '../../crafting';
import type { CombatContext } from '../types';
import { generatePlayerStats } from './resultGenerator';

/**
 * Handles wipe scenarios - generates death causes and reduced loot
 */
export function handleWipe(
  context: CombatContext,
  teamStates: TeamMemberState[],
  currentCombatState: CombatState,
  totalForcesCleared: number,
  totalTime: number
): DungeonRunResult {
  const { dungeon, selectedKeyLevel, scaling, callbacks } = context;
  const { addOrbs, setRunResult, setIsRunning } = callbacks;
  
  // Find what killed teammates - look for recent damage entries targeting team members
  const teamMemberNames = teamStates.map(m => m.name);
  const deathCauses: Record<string, string> = {};
  const recentDamage = currentCombatState.combatLog
    .filter(entry => entry.type === 'damage' && teamMemberNames.includes(entry.target))
    .slice(-20); // Last 20 damage entries
  
  teamStates.forEach(member => {
    if (member.isDead) {
      // Find the last damage entry for this member
      const lastDamage = recentDamage
        .filter(entry => entry.target === member.name)
        .sort((a, b) => b.timestamp - a.timestamp)[0];
      if (lastDamage) {
        deathCauses[member.name] = lastDamage.source || 'Unknown';
      }
    }
  });
  
  // Loot is collected during combat, not at the end
  const progressPercent = totalForcesCleared / dungeon.requiredForces;
  const orbDrops = generateOrbDrops(selectedKeyLevel, false, progressPercent);
  const xp = Math.floor(200 * scaling.rewardMultiplier * progressPercent);
  
  const result: DungeonRunResult = {
    success: false,
    keyLevel: selectedKeyLevel,
    timeElapsed: totalTime,
    timeLimit: dungeon.timeLimitSeconds,
    upgradeLevel: 0,
    loot: [], // Loot is collected during combat
    orbDrops,
    experienceGained: xp,
    deaths: teamStates.filter(m => m.isDead).length,
    forcesCleared: totalForcesCleared,
    forcesRequired: dungeon.requiredForces,
    combatLog: currentCombatState.combatLog,
    failReason: 'wipe',
    failedPullIndex: currentCombatState.currentPullIndex,
    deathCauses,
    // Enhanced stats
    playerStats: generatePlayerStats(teamStates, totalTime),
    dungeonName: dungeon.name,
    affixes: [],
    startTime: Date.now() - (totalTime * 1000),
    endTime: Date.now()
  };
  
  addOrbs(orbDrops);
  setRunResult(result);
  setIsRunning(false);
  
  return result;
}
