import type { DungeonCombatParams } from '../types';
import type { DungeonRunResult } from '../../../types/dungeon';
import { sleep } from '../types';
import { initializeCombat } from './initialization';
import { processPull } from './pullProcessor';
import { runBossFight } from './bossFight';
import { generateSuccessResult, generateTimeoutResult } from './resultGenerator';
import { handleWipe } from './wipeHandler';

/**
 * Main dungeon combat function - dynamically loaded for code splitting
 */
export async function runDungeonCombat(params: DungeonCombatParams): Promise<DungeonRunResult | null> {
  const {
    team,
    inventory,
    dungeon,
    routePulls,
    selectedKeyLevel,
    scaling,
    combatRef,
    combatState: initialCombatState,
    shieldActive,
    stunActive,
    callbacks,
    mapContext
  } = params;

  const { setIsRunning } = callbacks;

  // Initialize combat
  const init = initializeCombat(
    team,
    inventory,
    dungeon,
    selectedKeyLevel,
    scaling,
    combatRef,
    initialCombatState,
    shieldActive,
    stunActive,
    callbacks,
    mapContext
  );

  let totalForcesCleared = 0;
  let totalTime = 0;
  let currentTick = 0;
  let currentPos = { x: 100, y: 400 };
  let teamStates = [...init.initialTeamStates];
  let abilities = [...init.initialAbilities];
  let bloodlustActive = false;
  let bloodlustEndTick = 0;
  let timedOut = false;
  let currentCombatState = { ...init.combatState, teamStates: init.initialTeamStates, timeElapsed: 0 };
  const context = init.context;
  const { updateCombatState } = context;

  // Check if route is empty
  if (routePulls.length === 0) {
    console.error('Cannot start combat: routePulls is empty');
    setIsRunning(false);
    return null;
  }
  
  // Process each pull
  for (let pullIdx = 0; pullIdx < routePulls.length; pullIdx++) {
    if (combatRef.current.stop || timedOut) {
      break;
    }
    
    const pull = routePulls[pullIdx];
    const packs = pull.packIds.map(id => dungeon.enemyPacks.find(p => p.id === id)).filter(Boolean) as import('../../../types/dungeon').EnemyPack[];
    if (packs.length === 0) {
      console.warn(`Pull ${pullIdx + 1} has no valid packs, skipping`);
      continue;
    }

    // Process pull (travel, combat, recovery)
    const pullResult = await processPull(
      context,
      pull,
      pullIdx,
      packs,
      currentPos,
      teamStates,
      abilities,
      bloodlustActive,
      bloodlustEndTick,
      totalTime,
      currentTick,
      currentCombatState,
      totalForcesCleared,
      timedOut
    );

    // Update state from pull result
    teamStates = pullResult.teamStates;
    abilities = pullResult.abilities;
    bloodlustActive = pullResult.bloodlustActive;
    bloodlustEndTick = pullResult.bloodlustEndTick;
    totalTime = pullResult.totalTime;
    currentTick = pullResult.currentTick;
    currentCombatState = pullResult.currentCombatState;
    totalForcesCleared = pullResult.totalForcesCleared;
    timedOut = pullResult.timedOut;
    currentPos = context.currentPos;

    // Check for wipe
    if (pullResult.wiped && pullResult.wipeResult) {
      return pullResult.wipeResult;
    }

    // Check if stopped
    if (combatRef.current.stop) {
      setIsRunning(false);
      return null;
    }
  }

  // Check if stopped after main pull loop
  if (combatRef.current.stop) {
    setIsRunning(false);
    return null;
  }

  // Final Boss
  const boss = dungeon.bosses[0];
  if (boss && teamStates.some(m => !m.isDead) && !timedOut && !combatRef.current.stop) {
    const bossResult = await runBossFight(context, boss, currentPos, totalForcesCleared);
    
    teamStates = bossResult.teamStates;
    totalTime = bossResult.totalTime;
    currentCombatState = bossResult.currentCombatState;
    timedOut = bossResult.timedOut;

    // Check for wipe
    if (bossResult.wiped && bossResult.wipeResult) {
      return bossResult.wipeResult;
    }

    // Check if stopped
    if (combatRef.current.stop) {
      setIsRunning(false);
      return null;
    }
  }

  // Check for wipe (not timeout) - still give some loot based on progress
  if (!teamStates.some(m => !m.isDead) && !timedOut) {
    const wipeLogEntry = { timestamp: totalTime, type: 'phase' as const, source: '', target: '', message: '💀 WIPE! Your party has been defeated.' };
    updateCombatState(prev => ({ ...prev, phase: 'defeat', combatLog: [...prev.combatLog, wipeLogEntry] }));
    
    // Update local state with the new log entry before calling handleWipe
    currentCombatState = { ...currentCombatState, combatLog: [...currentCombatState.combatLog, wipeLogEntry] };
    
    const wipeResult = handleWipe(
      context,
      teamStates,
      currentCombatState,
      totalForcesCleared,
      totalTime
    );
    
    return wipeResult;
  }

  // Check for timeout - still give loot but no key upgrade
  if (timedOut) {
    const timeoutLogEntry = { timestamp: totalTime, type: 'phase' as const, source: '', target: '', message: '⏰ TIME EXPIRED! Dungeon failed.' };
    currentCombatState = { ...currentCombatState, combatLog: [...currentCombatState.combatLog, timeoutLogEntry] };
    return generateTimeoutResult(context, teamStates, currentCombatState, totalForcesCleared, totalTime);
  }

  const victoryLogEntry = { timestamp: totalTime, type: 'phase' as const, source: '', target: '', message: `🏆 DUNGEON COMPLETE in ${Math.floor(totalTime)}s!` };
  currentCombatState = { ...currentCombatState, combatLog: [...currentCombatState.combatLog, victoryLogEntry] };
  updateCombatState(prev => ({ ...prev, phase: 'victory', enemies: [], combatLog: [...prev.combatLog, victoryLogEntry] }));

  await sleep(500, combatRef);

  // Generate success result
  return generateSuccessResult(context, teamStates, currentCombatState, totalForcesCleared, totalTime);
}
