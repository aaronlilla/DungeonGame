import type { Character } from '../../types/character';
import type { RoutePull, DungeonRunResult, CombatLogEntry } from '../../types/dungeon';
import type { TestResult, DungeonCompletionTest } from './types';
import type { StatsTracker } from './statsTracker';

/**
 * Builds the test result from dungeon run results and tracked stats
 */
export function buildTestResult(
  dungeonResult: DungeonRunResult | null,
  routePulls: RoutePull[],
  team: Character[],
  statsTracker: StatsTracker,
  combatLog: CombatLogEntry[]
): TestResult {
  const result: TestResult = {
    passed: true,
    totalTests: 1,
    passedTests: 0,
    failedTests: 0,
    errors: [],
    warnings: [],
    combatLog: [],
    details: {
      dungeonCompletion: {
        passed: false,
        totalPacks: 0,
        packsCleared: 0,
        totalForces: 0,
        forcesCleared: 0,
        gateBossesKilled: 0,
        finalBossKilled: false,
        details: ''
      }
    },
    summary: {
      totalDamageDealt: 0,
      totalDamageTaken: 0,
      totalHealing: 0,
      totalEnemiesKilled: 0,
      totalTime: 0,
      teamSurvived: false,
      dungeonCompleted: false,
      averageDPS: 0,
      averageHPS: 0,
      deaths: 0
    },
    formulaSummary: {
      armorWorking: true,
      evasionWorking: true,
      blockWorking: true,
      spellBlockWorking: true,
      spellSuppressionWorking: true,
      resistancesWorking: true,
      energyShieldWorking: true,
      criticalStrikesWorking: true,
      healingWorking: true
    }
  };

  if (!dungeonResult) {
    result.passed = false;
    result.failedTests = 1;
    result.errors.push('Dungeon simulation was stopped or failed');
    return result;
  }

  // Update result from dungeon run
  result.combatLog = combatLog;
  result.summary.totalTime = dungeonResult.timeElapsed;
  result.summary.dungeonCompleted = dungeonResult.success;
  result.summary.totalDamageDealt = statsTracker.totalDamageDealt;
  result.summary.totalDamageTaken = statsTracker.totalDamageTaken;
  result.summary.totalHealing = statsTracker.totalHealing;
  result.summary.totalEnemiesKilled = statsTracker.totalEnemiesKilled;
  result.summary.deaths = dungeonResult.deaths || 0;
  result.summary.teamSurvived = dungeonResult.success || (dungeonResult.deaths || 0) < team.length;
  
  // Calculate averages
  if (dungeonResult.timeElapsed > 0) {
    result.summary.averageDPS = statsTracker.totalDamageDealt / dungeonResult.timeElapsed;
    result.summary.averageHPS = statsTracker.totalHealing / dungeonResult.timeElapsed;
  }

  // Update dungeon completion details
  result.details.dungeonCompletion = buildDungeonCompletion(
    dungeonResult,
    routePulls,
    statsTracker.totalEnemiesKilled
  );

  result.passed = dungeonResult.success;
  if (dungeonResult.success) {
    result.passedTests = 1;
  } else {
    result.failedTests = 1;
    result.errors.push(`Dungeon failed: ${dungeonResult.failReason || 'unknown reason'}`);
  }

  return result;
}

function buildDungeonCompletion(
  dungeonResult: DungeonRunResult,
  routePulls: RoutePull[],
  totalEnemiesKilled: number
): DungeonCompletionTest {
  return {
    passed: dungeonResult.success,
    totalPacks: routePulls.length,
    packsCleared: dungeonResult.forcesCleared >= dungeonResult.forcesRequired 
      ? routePulls.length 
      : Math.floor((dungeonResult.forcesCleared / dungeonResult.forcesRequired) * routePulls.length),
    totalForces: dungeonResult.forcesRequired,
    forcesCleared: dungeonResult.forcesCleared,
    gateBossesKilled: dungeonResult.combatLog.filter(e => e.type === 'boss' && e.message.includes('DEFEATED')).length,
    finalBossKilled: dungeonResult.success,
    details: dungeonResult.success 
      ? `Dungeon completed in ${Math.floor(dungeonResult.timeElapsed)}s! Killed ${totalEnemiesKilled} enemies.`
      : `Dungeon failed: ${dungeonResult.failReason || 'unknown reason'}`
  };
}
