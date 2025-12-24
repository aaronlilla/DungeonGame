import type { EnemyPack, RoutePull } from '../../../types/dungeon';
import type { AnimatedEnemy, TeamMemberState, CombatState, PlayerAbility } from '../../../types/combat';
import type { CombatContext } from '../types';
import { travelToPull, createPullEnemies } from '../travel';
import { performPostCombatRecovery } from '../recovery';
import { sleep } from '../types';
import { runCombatLoop, type CombatLoopResult } from './combatLoop';

export interface PullProcessorResult {
  teamStates: TeamMemberState[];
  abilities: PlayerAbility[];
  bloodlustActive: boolean;
  bloodlustEndTick: number;
  totalTime: number;
  currentTick: number;
  currentCombatState: CombatState;
  totalForcesCleared: number;
  timedOut: boolean;
  wiped: boolean;
  wipeResult?: import('../../../types/dungeon').DungeonRunResult;
}

/**
 * Processes a single pull (travel, combat, recovery)
 */
export async function processPull(
  context: CombatContext,
  pull: RoutePull,
  pullIdx: number,
  packs: EnemyPack[],
  currentPos: { x: number; y: number },
  teamStates: TeamMemberState[],
  abilities: PlayerAbility[],
  bloodlustActive: boolean,
  bloodlustEndTick: number,
  totalTime: number,
  currentTick: number,
  currentCombatState: CombatState,
  totalForcesCleared: number,
  timedOut: boolean
): Promise<PullProcessorResult> {
  const { combatRef, dungeon, scaling, shieldActive, callbacks, updateCombatState } = context;
  const { setIsRunning } = callbacks;
  
  const targetX = packs.reduce((sum, p) => sum + p.position.x, 0) / packs.length;
  const targetY = packs.reduce((sum, p) => sum + p.position.y, 0) / packs.length;

  // Update context with current state
  context.currentPos = currentPos;
  context.totalTime = totalTime;
  context.currentTick = currentTick;
  context.timedOut = timedOut;
  
  // Use travel module
  await travelToPull(context, pullIdx, packs, targetX, targetY);
  
  // Update local state from context
  currentPos = context.currentPos;
  totalTime = context.totalTime;
  timedOut = context.timedOut;
  
  // Check if stopped during travel
  if (combatRef.current.stop) {
    setIsRunning(false);
    return {
      teamStates,
      abilities,
      bloodlustActive,
      bloodlustEndTick,
      totalTime,
      currentTick,
      currentCombatState,
      totalForcesCleared,
      timedOut,
      wiped: false
    };
  }
  
  if (timedOut) {
    updateCombatState(prev => ({ ...prev, phase: 'defeat', combatLog: [...prev.combatLog, { timestamp: totalTime, type: 'phase', source: '', target: '', message: '⏰ TIME EXPIRED! Dungeon failed.' }] }));
    return {
      teamStates,
      abilities,
      bloodlustActive,
      bloodlustEndTick,
      totalTime,
      currentTick,
      currentCombatState,
      totalForcesCleared,
      timedOut: true,
      wiped: false
    };
  }

  // Create enemies using module (with map affix effects applied)
  // Initialize usedBossNames if not already set in context
  if (!context.usedBossNames) {
    context.usedBossNames = new Set<string>();
  }
  const pullEnemies = createPullEnemies(packs, pullIdx, scaling, shieldActive, context.mapAffixEffects, context.usedBossNames);

  const hasGateBoss = packs.some(p => p.isGateBoss);
  // Find the gate boss name if this is a gate boss pull
  const gateBossEnemy = hasGateBoss ? pullEnemies.find(e => e.type === 'boss' || e.type === 'miniboss') : null;
  const gateBossName = gateBossEnemy?.name;
  const gateBossMessage = hasGateBoss && gateBossName 
    ? `👑 GATE BOSS: ${gateBossName} (${pullEnemies.length} enemies)!`
    : hasGateBoss 
    ? `👑 GATE BOSS: ${pullEnemies.length} enemies!`
    : `⚔️ PULL #${pullIdx + 1}: ${pullEnemies.length} enemies!`;
  
  updateCombatState(prev => ({
    ...prev,
    phase: 'combat',
    enemies: pullEnemies,
    teamStates,
    combatLog: [...prev.combatLog, { timestamp: totalTime, type: hasGateBoss ? 'boss' : 'pull', source: '', target: '', message: gateBossMessage }]
  }));

  // Run combat loop
  const combatResult = await runCombatLoop(context, pullEnemies, pullIdx, totalForcesCleared);
  
  if (combatResult.wiped && combatResult.wipeResult) {
    return {
      teamStates: combatResult.teamStates,
      abilities: combatResult.abilities,
      bloodlustActive: combatResult.bloodlustActive,
      bloodlustEndTick: combatResult.bloodlustEndTick,
      totalTime: combatResult.totalTime,
      currentTick: combatResult.currentTick,
      currentCombatState: combatResult.currentCombatState,
      totalForcesCleared,
      timedOut: combatResult.timedOut,
      wiped: true,
      wipeResult: combatResult.wipeResult
    };
  }

  // Update state from combat result
  teamStates = combatResult.teamStates;
  abilities = combatResult.abilities;
  bloodlustActive = combatResult.bloodlustActive;
  bloodlustEndTick = combatResult.bloodlustEndTick;
  totalTime = combatResult.totalTime;
  currentTick = combatResult.currentTick;
  currentCombatState = combatResult.currentCombatState;
  timedOut = combatResult.timedOut;

  const pullForces = packs.reduce((sum, p) => sum + p.totalForces, 0);
  totalForcesCleared += pullForces;
  context.totalForcesCleared = totalForcesCleared;
  
  updateCombatState(prev => ({
    ...prev,
    forcesCleared: totalForcesCleared,
    enemies: [],
    teamStates,
    combatLog: [...prev.combatLog, { timestamp: totalTime, type: 'loot', source: '', target: '', message: `✅ Pull complete! +${pullForces} forces` }]
  }));

  await sleep(300, combatRef);
  
  // Stop all current casts before post-combat recovery
  teamStates = teamStates.map(m => ({
    ...m,
    isCasting: false,
    castStartTick: undefined,
    castEndTick: undefined,
    castTotalTicks: undefined,
    castStartTime: undefined,
    castTotalTime: undefined,
    castAbility: undefined,
    castTargetId: undefined
  }));
  updateCombatState(prev => ({ ...prev, teamStates: [...teamStates] }));
  
  // Update context before recovery
  context.teamStates = teamStates;
  context.totalTime = totalTime;
  context.timedOut = timedOut;
  
  // Post-combat recovery phase using module
  const recoveryResult = await performPostCombatRecovery(context, teamStates);
  teamStates = recoveryResult.teamStates;
  timedOut = recoveryResult.timedOut;
  totalTime = context.totalTime;
  
  if (timedOut) {
    setIsRunning(false);
    return {
      teamStates,
      abilities,
      bloodlustActive,
      bloodlustEndTick,
      totalTime,
      currentTick,
      currentCombatState,
      totalForcesCleared,
      timedOut: true,
      wiped: false
    };
  }

  return {
    teamStates,
    abilities,
    bloodlustActive,
    bloodlustEndTick,
    totalTime,
    currentTick,
    currentCombatState,
    totalForcesCleared,
    timedOut,
    wiped: false
  };
}
