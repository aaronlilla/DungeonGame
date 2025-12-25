import type React from 'react';
import type { CombatState, CombatRef } from '../../../types/combat';
import type { Character } from '../../../types/character';
import type { Item } from '../../../types/items';
import type { Dungeon } from '../../../types/dungeon';
import type { CombatContext, DungeonCombatCallbacks, MapAffixEffects } from '../types';
import { initTeamStates, initAbilities } from '../../../utils/combat';

export interface CombatInitialization {
  initialTeamStates: ReturnType<typeof initTeamStates>;
  initialAbilities: ReturnType<typeof initAbilities>;
  experienceAwarded: Set<string>;
  healerCooldowns: { painSuppressionEndTick: number };
  tankCooldowns: { shieldSlamEndTick: number; defensiveStanceEndTick: number; shieldBlockEndTick: number };
  combatState: CombatState;
  context: CombatContext;
}

/**
 * Initializes combat state and context for dungeon run
 */
export function initializeCombat(
  team: Character[],
  inventory: Item[],
  dungeon: Dungeon,
  selectedKeyLevel: number,
  scaling: ReturnType<typeof import('../../../types/dungeon').calculateKeyScaling>,
  combatRef: React.MutableRefObject<CombatRef>,
  initialCombatState: CombatState,
  shieldActive: boolean,
  stunActive: boolean,
  callbacks: DungeonCombatCallbacks,
  mapContext?: {
    mapTier: number;
    quantityBonus: number;
    rarityBonus: number;
    mapAffixEffects: MapAffixEffects;
    highestMapTierCompleted: number;
  }
): CombatInitialization {
  const { setCombatState, setIsRunning, setRunResult, setIsPaused } = callbacks;
  
  // Track which enemies have already awarded experience (to avoid double-awarding)
  const experienceAwarded = new Set<string>();

  setIsRunning(true);
  setRunResult(null);
  setIsPaused(false);
  combatRef.current.stop = false;
  combatRef.current.paused = false;
  
  // Initialize team states with equipment bonuses from inventory
  const initialTeamStates = initTeamStates(team, inventory);
  const initialAbilities = initAbilities();
  
  const combatState: CombatState = {
    phase: 'traveling',
    currentPullIndex: 0,
    teamPosition: { x: 100, y: 400 },
    enemies: [],
    queuedEnemies: [],
    teamStates: initialTeamStates,
    combatLog: [{ timestamp: 0, type: 'phase', source: '', target: '', message: `⚔️ ${dungeon.name} +${selectedKeyLevel} STARTED!` }],
    forcesCleared: 0,
    timeElapsed: 0,
    killedGateBosses: new Set(),
    abilities: initialAbilities,
    bloodlustActive: false,
    bloodlustTimer: 0,
    floatingNumbers: [],
    levelUpAnimations: [],
    lootDrops: [],  // Real-time loot drops on the map
    leagueEncounters: []  // League mechanics (spawned when map opens)
  };
  
  setCombatState(() => combatState);
  
  // Track healer ability cooldowns (tick-based)
  const healerCooldowns = { painSuppressionEndTick: 0 };
  
  // Track tank ability cooldowns (tick-based)
  const tankCooldowns = { shieldSlamEndTick: 0, defensiveStanceEndTick: 0, shieldBlockEndTick: 0 };

  let totalForcesCleared = 0;
  let totalTime = 0;
  let currentTick = 0; // Track game time in ticks (100ms increments)
  let currentPos = { x: 100, y: 400 };
  let teamStates = [...initialTeamStates];
  let abilities = [...initialAbilities];
  let bloodlustActive = false;
  let bloodlustEndTick = 0; // tick when bloodlust expires
  let timedOut = false;
  let currentCombatState = { ...initialCombatState, teamStates: initialTeamStates, timeElapsed: 0 };

  // Helper to check timeout
  const checkTimeout = () => {
    if (totalTime >= dungeon.timeLimitSeconds) {
      timedOut = true;
      return true;
    }
    return false;
  };

  // Create context object for modules
  // Note: updateCombatState is defined as a placeholder and set properly below
  const context: CombatContext = {
    team,
    dungeon,
    selectedKeyLevel,
    scaling,
    combatRef,
    shieldActive,
    stunActive,
    callbacks,
    experienceAwarded,
    totalForcesCleared,
    totalTime,
    currentTick,
    currentPos,
    teamStates,
    abilities,
    bloodlustActive,
    bloodlustEndTick,
    timedOut,
    currentCombatState,
    healerCooldowns,
    tankCooldowns,
    // Map-specific bonuses (from mapContext if provided)
    mapTier: mapContext?.mapTier ?? selectedKeyLevel,
    quantityBonus: mapContext?.quantityBonus ?? 0,
    rarityBonus: mapContext?.rarityBonus ?? 0,
    highestMapTierCompleted: mapContext?.highestMapTierCompleted ?? selectedKeyLevel,
    // Map affix effects (from mapContext if provided)
    mapAffixEffects: mapContext?.mapAffixEffects ?? {
      enemyDamageIncrease: 0,
      enemyHealthIncrease: 0,
      playerDamageReduction: 0,
      enemySpeed: 0,
      twinBoss: false
    },
    updateCombatState: null as any, // Will be set below
    checkTimeout,
    setScreenShake: callbacks.setScreenShake,
    setTeamFightAnim: callbacks.setTeamFightAnim,
    setEnemyFightAnims: callbacks.setEnemyFightAnims,
    awardExperience: callbacks.awardExperience,
    applyDeathPenalty: callbacks.applyDeathPenalty,
    setIsRunning: callbacks.setIsRunning,
    // Initialize used boss names tracker
    usedBossNames: new Set<string>()
  };
  
  // Helper to update combat state (syncs local state AND context.currentCombatState)
  const updateCombatState = (updater: (prev: CombatState) => CombatState): CombatState => {
    currentCombatState = updater(currentCombatState);
    // Also update context.currentCombatState so modules get the latest state
    context.currentCombatState = currentCombatState;
    setCombatState(() => currentCombatState);
    return currentCombatState;
  };
  
  // Assign the updateCombatState to context
  context.updateCombatState = updateCombatState;
  
  // For simulation: expose context reference through combatRef for auto-resurrection
  if (combatRef.current.simulationContextRef) {
    combatRef.current.simulationContextRef.teamStates = context.teamStates;
  }

  return {
    initialTeamStates,
    initialAbilities,
    experienceAwarded,
    healerCooldowns,
    tankCooldowns,
    combatState,
    context
  };
}
