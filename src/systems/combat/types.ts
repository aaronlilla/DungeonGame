import type React from 'react';
import type { 
  Dungeon, 
  RoutePull, 
  DungeonRunResult, 
  CombatLogEntry 
} from '../../types/dungeon';
import type { Character } from '../../types/character';
import type { 
  CombatState, 
  CombatRef, 
  FloatingNumber, 
  TeamMemberState,
  PlayerAbility
} from '../../types/combat';

export interface DungeonCombatCallbacks {
  setCombatState: (updater: (prev: CombatState) => CombatState) => void;
  setIsRunning: (running: boolean) => void;
  setRunResult: (result: DungeonRunResult | null) => void;
  setIsPaused: (paused: boolean) => void;
  setScreenShake: (updater: (prev: number) => number) => void;
  setTeamFightAnim: (updater: (prev: number) => number) => void;
  setEnemyFightAnims: (updater: (prev: Record<string, number>) => Record<string, number>) => void;
  addOrbs: (orbs: Record<string, number>) => void;
  completeDungeonRun: (result: DungeonRunResult) => void;
  addKey: (key: { id: string; dungeonId: string; level: number; affixes: any[]; depleted: boolean }) => void;
  awardExperience: (characterId: string, experience: number) => { leveledUp: boolean; newLevel: number; levelsGained: number } | null;
  applyDeathPenalty: (characterId: string) => void;  // PoE-style experience loss on death
}

export interface DungeonCombatParams {
  team: Character[];
  inventory: import('../../types/items').Item[]; // For equipment stats
  dungeon: Dungeon;
  routePulls: RoutePull[];
  selectedKeyLevel: number;
  scaling: ReturnType<typeof import('../../types/dungeon').calculateKeyScaling>;
  combatRef: React.MutableRefObject<CombatRef>;
  combatState: CombatState;
  shieldActive: boolean;
  stunActive: boolean;
  callbacks: DungeonCombatCallbacks;
  // Map-specific context
  mapContext?: {
    mapTier: number;
    quantityBonus: number;
    rarityBonus: number;
    mapAffixEffects: MapAffixEffects;
    highestMapTierCompleted: number;
  };
}

// Map affix effects that modify combat
export interface MapAffixEffects {
  enemyDamageIncrease: number;    // e.g., 0.25 = +25% enemy damage
  enemyHealthIncrease: number;    // e.g., 0.30 = +30% enemy health
  playerDamageReduction: number;  // e.g., 0.15 = -15% player damage
  enemySpeed: number;             // e.g., 0.20 = +20% attack speed (faster cooldowns)
  twinBoss: boolean;              // If true, spawn a second boss
}

export interface CombatContext {
  team: Character[];
  inventory: import('../../types/items').Item[]; // For equipment stats recalculation
  dungeon: Dungeon;
  selectedKeyLevel: number;
  scaling: ReturnType<typeof import('../../types/dungeon').calculateKeyScaling>;
  combatRef: React.MutableRefObject<CombatRef>;
  shieldActive: boolean;
  stunActive: boolean;
  callbacks: DungeonCombatCallbacks;
  experienceAwarded: Set<string>;
  totalForcesCleared: number;
  totalTime: number; // Total time in seconds (for display)
  currentTick: number; // Current game tick (100ms increments)
  currentPos: { x: number; y: number };
  teamStates: TeamMemberState[];
  abilities: PlayerAbility[];
  bloodlustActive: boolean;
  bloodlustEndTick: number; // tick when bloodlust expires
  timedOut: boolean;
  currentCombatState: CombatState;
  // Tick-based cooldowns for healer and tank abilities
  healerCooldowns: { painSuppressionEndTick: number };
  tankCooldowns: { shieldSlamEndTick: number; defensiveStanceEndTick: number; shieldBlockEndTick: number; thunderClapEndTick: number };
  // Map-specific bonuses for loot generation
  mapTier: number;
  quantityBonus: number;
  rarityBonus: number;
  highestMapTierCompleted: number;
  // Map affix effects for combat modifiers
  mapAffixEffects: MapAffixEffects;
  updateCombatState: (updater: (prev: CombatState) => CombatState) => void;
  checkTimeout: () => boolean;
  setScreenShake: (updater: (prev: number) => number) => void;
  setTeamFightAnim: (updater: (prev: number) => number) => void;
  setEnemyFightAnims: (updater: (prev: Record<string, number>) => Record<string, number>) => void;
  awardExperience: (characterId: string, experience: number) => { leveledUp: boolean; newLevel: number; levelsGained: number } | null;
  applyDeathPenalty: (characterId: string) => void;
  setIsRunning: (running: boolean) => void;
  // Performance optimization: Batch arrays for state updates
  batchedFloatingNumbers?: FloatingNumber[];
  batchedLogEntries?: CombatLogEntry[];
  // Track used boss names to avoid duplicates
  usedBossNames?: Set<string>;
  // Verbose combat logger
  verboseLogger?: import('./verboseCombatLogger').VerboseCombatLogger;
}

// ===== COMBAT TIMING CONSTANTS =====
// All timing in the game happens in discrete 100ms increments (ticks)
export const TICK_MS = 100; // 100ms per tick
export const TICK_DURATION = 0.1; // seconds per tick (for compatibility)
export const TICKS_PER_SECOND = 10; // 10 ticks = 1 second

// Global Cooldown (GCD) - 1 second between spell/ability starts
export const GCD_TICKS = 10; // 1 second = 10 ticks
export const GCD_SECONDS = 1.0;

// Helper to convert seconds to ticks
export const secondsToTicks = (seconds: number): number => Math.ceil(seconds * TICKS_PER_SECOND);
// Helper to convert ticks to seconds
export const ticksToSeconds = (ticks: number): number => ticks / TICKS_PER_SECOND;

// Helper to calculate hasted GCD - haste reduces GCD and cast times
// 30% haste = 1 / 1.3 = ~0.769 multiplier (actions happen ~30% faster)
export const getHastedTicks = (baseTicks: number, bloodlustActive: boolean): number => {
  if (!bloodlustActive) return baseTicks;
  // 30% haste means actions take 1/1.3 of the original time
  return Math.ceil(baseTicks / 1.3);
};

// Sleep function - throttled in simulation mode to prevent UI freezing
export const sleep = (ms: number, combatRef?: React.MutableRefObject<{ simulationContextRef?: any }> | { current?: { simulationContextRef?: any } }) => {
  const ref = combatRef as any;
  const isSimulation = ref?.current?.simulationContextRef !== undefined;
  if (isSimulation) {
    // In simulation mode, always yield to browser event loop
    // Use setTimeout with 0ms to allow UI updates between ticks
    // This prevents UI freezing while still being fast
    return new Promise(r => setTimeout(r, 0));
  }
  return new Promise(r => setTimeout(r, ms));
};
