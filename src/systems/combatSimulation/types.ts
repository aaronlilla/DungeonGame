import type { CombatLogEntry } from '../../types/dungeon';

export interface FormulaTestResult {
  name: string;
  passed: boolean;
  expected: string;
  actual: string;
  details: string;
}

export interface TestResult {
  passed: boolean;
  totalTests: number;
  passedTests: number;
  failedTests: number;
  errors: string[];
  warnings: string[];
  combatLog: CombatLogEntry[];
  details: {
    dungeonCompletion: DungeonCompletionTest;
    armorTests?: FormulaTestResult[];
    evasionTests?: FormulaTestResult[];
    blockTests?: FormulaTestResult[];
    spellBlockTests?: FormulaTestResult[];
    spellSuppressionTests?: FormulaTestResult[];
    resistanceTests?: FormulaTestResult[];
    energyShieldTests?: FormulaTestResult[];
    criticalStrikeTests?: FormulaTestResult[];
    healingTests?: FormulaTestResult[];
  };
  summary: {
    totalDamageDealt: number;
    totalDamageTaken: number;
    totalHealing: number;
    totalEnemiesKilled: number;
    totalTime: number;
    teamSurvived: boolean;
    dungeonCompleted: boolean;
    averageDPS: number;
    averageHPS: number;
    deaths: number;
  };
  formulaSummary: {
    armorWorking: boolean;
    evasionWorking: boolean;
    blockWorking: boolean;
    spellBlockWorking: boolean;
    spellSuppressionWorking: boolean;
    resistancesWorking: boolean;
    energyShieldWorking: boolean;
    criticalStrikesWorking: boolean;
    healingWorking: boolean;
  };
}

export interface DungeonCompletionTest {
  passed: boolean;
  totalPacks: number;
  packsCleared: number;
  totalForces: number;
  forcesCleared: number;
  gateBossesKilled: number;
  finalBossKilled: boolean;
  details: string;
}

// Callback for real-time combat log updates
export type CombatLogCallback = (entry: CombatLogEntry) => void;
