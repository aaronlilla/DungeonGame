import type { EnemyPack, RoutePull } from '../../../types/dungeon';
import type { TeamMemberState, CombatState, PlayerAbility } from '../../../types/combat';
import type { CombatContext } from '../types';
import { travelToPull, createPullEnemies } from '../travel';
import { performPostCombatRecovery } from '../recovery';
import { sleep } from '../types';
import { runCombatLoop } from './combatLoop';

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
  _pull: RoutePull,
  pullIdx: number,
  packs: EnemyPack[],
  currentPos: { x: number; y: number },
  teamStates: TeamMemberState[],
  abilities: PlayerAbility[],
  bloodlustActive: boolean,
  bloodlustEndTick: number,
  _totalTime: number,
  currentTick: number,
  currentCombatState: CombatState,
  totalForcesCleared: number,
  timedOut: boolean
): Promise<PullProcessorResult> {
  const { combatRef, shieldActive, callbacks, updateCombatState, scaling } = context;
  const { setIsRunning } = callbacks;
  
  // Declare mutable local variables (parameters are const, so we need local copies)
  let totalTime = _totalTime;
  let currentPosLocal = currentPos;
  let teamStatesLocal = teamStates;
  let abilitiesLocal = abilities;
  let bloodlustActiveLocal = bloodlustActive;
  let bloodlustEndTickLocal = bloodlustEndTick;
  let currentTickLocal = currentTick;
  let currentCombatStateLocal = currentCombatState;
  let totalForcesClearedLocal = totalForcesCleared;
  let timedOutLocal = timedOut;
  
  const targetX = packs.reduce((sum, p) => sum + p.position.x, 0) / packs.length;
  const targetY = packs.reduce((sum, p) => sum + p.position.y, 0) / packs.length;

  // Update context with current state (CRITICAL: update teamStates at start to use passed parameter)
  context.currentPos = currentPosLocal;
  context.totalTime = totalTime;
  context.currentTick = currentTickLocal;
  context.timedOut = timedOutLocal;
  context.teamStates = teamStatesLocal; // Ensure context uses the passed teamStates (from previous pull's recovery)
  
  // Use travel module
  await travelToPull(context, pullIdx, packs, targetX, targetY);
  
  // Update local state from context
  currentPosLocal = context.currentPos;
  totalTime = context.totalTime;
  timedOutLocal = context.timedOut;
  
  // Check if stopped during travel
  if (combatRef.current.stop) {
    setIsRunning(false);
    return {
      teamStates: teamStatesLocal,
      abilities: abilitiesLocal,
      bloodlustActive: bloodlustActiveLocal,
      bloodlustEndTick: bloodlustEndTickLocal,
      totalTime,
      currentTick: currentTickLocal,
      currentCombatState: currentCombatStateLocal,
      totalForcesCleared: totalForcesClearedLocal,
      timedOut: timedOutLocal,
      wiped: false
    };
  }
  
  if (timedOutLocal) {
    updateCombatState(prev => ({ ...prev, phase: 'defeat', combatLog: [...prev.combatLog, { timestamp: totalTime, type: 'phase', source: '', target: '', message: '⏰ TIME EXPIRED! Dungeon failed.' }] }));
    return {
      teamStates: teamStatesLocal,
      abilities: abilitiesLocal,
      bloodlustActive: bloodlustActiveLocal,
      bloodlustEndTick: bloodlustEndTickLocal,
      totalTime,
      currentTick: currentTickLocal,
      currentCombatState: currentCombatStateLocal,
      totalForcesCleared: totalForcesClearedLocal,
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
  const enemiesByPack = (pullEnemies as any).__byPack as AnimatedEnemy[][];

  const hasGateBoss = packs.some(p => p.isGateBoss);
  // Find the gate boss name if this is a gate boss pull
  const gateBossEnemy = hasGateBoss ? pullEnemies.find(e => e.type === 'boss' || e.type === 'miniboss') : null;
  const gateBossName = gateBossEnemy?.name;
  const gateBossMessage = hasGateBoss && gateBossName 
    ? `👑 GATE BOSS: ${gateBossName} (${pullEnemies.length} enemies)!`
    : hasGateBoss 
    ? `👑 GATE BOSS: ${pullEnemies.length} enemies!`
    : `⚔️ PULL #${pullIdx + 1}: ${pullEnemies.length} enemies!`;
  
  // Ensure context.teamStates is updated before combat starts
  context.teamStates = teamStatesLocal;
  
  // Initially queue all enemies - they'll trickle in over 6 seconds
  updateCombatState(prev => ({
    ...prev,
    phase: 'combat',
    enemies: [], // Start with no enemies in combat
    queuedEnemies: pullEnemies, // All enemies start in queue
    teamStates: teamStatesLocal,
    combatLog: [...prev.combatLog, { timestamp: totalTime, type: hasGateBoss ? 'boss' : 'pull', source: '', target: '', message: gateBossMessage }]
  }));

  // Run combat loop - pass enemiesByPack for trickle-in logic
  const combatResult = await runCombatLoop(context, pullEnemies, pullIdx, totalForcesClearedLocal, enemiesByPack);
  
  if (combatResult.wiped && combatResult.wipeResult) {
    return {
      teamStates: combatResult.teamStates,
      abilities: combatResult.abilities,
      bloodlustActive: combatResult.bloodlustActive,
      bloodlustEndTick: combatResult.bloodlustEndTick,
      totalTime: combatResult.totalTime,
      currentTick: combatResult.currentTick,
      currentCombatState: combatResult.currentCombatState,
      totalForcesCleared: totalForcesClearedLocal,
      timedOut: combatResult.timedOut,
      wiped: true,
      wipeResult: combatResult.wipeResult
    };
  }

  // Update state from combat result
  teamStatesLocal = combatResult.teamStates;
  abilitiesLocal = combatResult.abilities;
  bloodlustActiveLocal = combatResult.bloodlustActive;
  bloodlustEndTickLocal = combatResult.bloodlustEndTick;
  totalTime = combatResult.totalTime;
  currentTickLocal = combatResult.currentTick;
  currentCombatStateLocal = combatResult.currentCombatState;
  timedOutLocal = combatResult.timedOut;

  const pullForces = packs.reduce((sum, p) => sum + p.totalForces, 0);
  totalForcesClearedLocal += pullForces;
  context.totalForcesCleared = totalForcesClearedLocal;
  
  updateCombatState(prev => ({
    ...prev,
    forcesCleared: totalForcesClearedLocal,
    enemies: [],
    queuedEnemies: [],
    teamStates: teamStatesLocal,
    combatLog: [...prev.combatLog, { timestamp: totalTime, type: 'loot', source: '', target: '', message: `✅ Pull complete! +${pullForces} forces` }]
  }));

  await sleep(300, combatRef);
  
  // Stop all current casts before post-combat recovery
  teamStatesLocal = teamStatesLocal.map(m => ({
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
  updateCombatState(prev => ({ ...prev, teamStates: [...teamStatesLocal] }));
  
  // Update context before recovery
  context.teamStates = teamStatesLocal;
  context.totalTime = totalTime;
  context.timedOut = timedOutLocal;
  
  // Post-combat recovery phase using module
  const recoveryResult = await performPostCombatRecovery(context, teamStatesLocal);
  teamStatesLocal = recoveryResult.teamStates;
  timedOutLocal = recoveryResult.timedOut;
  totalTime = context.totalTime;
  
  // CRITICAL: Update context.teamStates after recovery so the next pull uses the recovered state
  context.teamStates = teamStatesLocal;
  
  if (timedOutLocal) {
    setIsRunning(false);
    return {
      teamStates: teamStatesLocal,
      abilities: abilitiesLocal,
      bloodlustActive: bloodlustActiveLocal,
      bloodlustEndTick: bloodlustEndTickLocal,
      totalTime,
      currentTick: currentTickLocal,
      currentCombatState: currentCombatStateLocal,
      totalForcesCleared: totalForcesClearedLocal,
      timedOut: true,
      wiped: false
    };
  }

  return {
    teamStates: teamStatesLocal,
    abilities: abilitiesLocal,
    bloodlustActive: bloodlustActiveLocal,
    bloodlustEndTick: bloodlustEndTickLocal,
    totalTime,
    currentTick: currentTickLocal,
    currentCombatState: currentCombatStateLocal,
    totalForcesCleared: totalForcesClearedLocal,
    timedOut: timedOutLocal,
    wiped: false
  };
}
