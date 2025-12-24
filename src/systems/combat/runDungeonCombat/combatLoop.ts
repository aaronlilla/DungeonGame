import type { AnimatedEnemy, TeamMemberState, CombatState, PlayerAbility, MapLootDrop, FloatingNumber } from '../../../types/combat';
import type { CombatContext } from '../types';
import { sleep, TICK_MS, TICK_DURATION, TICKS_PER_SECOND, GCD_TICKS, ticksToSeconds } from '../types';
import { processBuffsAndRegen } from '../buffs';
import { processEnemyAttacks } from '../enemyCombat';
import { processPlayerActions } from '../playerCombat';
import { handleWipe } from './wipeHandler';
import { getEnemyById } from '../../../types/dungeon';
import { calculateExperienceFromEnemy } from '../../../utils/leveling';
import { generateEnemyLootDrops } from '../../crafting';
import { createVerboseTickSummary } from '../verboseLogging';

export interface CombatLoopResult {
  teamStates: TeamMemberState[];
  currentEnemies: AnimatedEnemy[];
  abilities: PlayerAbility[];
  bloodlustActive: boolean;
  bloodlustEndTick: number;
  totalTime: number;
  currentTick: number;
  currentCombatState: CombatState;
  timedOut: boolean;
  wiped: boolean;
  wipeResult?: import('../../../types/dungeon').DungeonRunResult;
}

/**
 * Main combat loop for a single pull
 * Uses 100ms tick-based timing with 1 second GCD
 * 
 * Timing Rules:
 * - All game time happens in 100ms increments (ticks)
 * - GCD is 10 ticks (1 second) and starts when a spell/ability STARTS
 * - If cast time < 1s, entity must wait for GCD to expire before next cast
 * - If cast time >= 1s, entity can immediately start next cast when current finishes
 */
export async function runCombatLoop(
  context: CombatContext,
  pullEnemies: AnimatedEnemy[],
  pullIdx: number,
  totalForcesCleared: number
): Promise<CombatLoopResult> {
  const { combatRef, dungeon, selectedKeyLevel, scaling, team, stunActive, experienceAwarded, callbacks, updateCombatState, checkTimeout, awardExperience } = context;
  
  // Validate inputs
  if (!pullEnemies || pullEnemies.length === 0) {
    console.error('runCombatLoop: No enemies provided!', pullEnemies);
    return {
      teamStates: context.teamStates,
      abilities: context.abilities,
      bloodlustActive: context.bloodlustActive,
      bloodlustEndTick: context.bloodlustEndTick,
      totalTime: context.totalTime,
      currentTick: context.currentTick,
      currentCombatState: context.currentCombatState,
      timedOut: context.timedOut,
      wiped: false,
      currentEnemies: []
    };
  }
  
  if (!context.teamStates || context.teamStates.length === 0) {
    console.error('runCombatLoop: No team members!', context.teamStates);
    return {
      teamStates: context.teamStates,
      currentEnemies: pullEnemies,
      abilities: context.abilities,
      bloodlustActive: context.bloodlustActive,
      bloodlustEndTick: context.bloodlustEndTick,
      totalTime: context.totalTime,
      currentTick: context.currentTick,
      currentCombatState: context.currentCombatState,
      timedOut: context.timedOut,
      wiped: false
    };
  }
  
  // Ensure enemies have valid health
  let currentEnemies = pullEnemies.map(e => {
    if (e.health <= 0 || e.maxHealth <= 0 || isNaN(e.health) || isNaN(e.maxHealth)) {
      console.warn(`runCombatLoop: Enemy ${e.name} (${e.id}) has invalid health: ${e.health}/${e.maxHealth}, fixing...`);
      const fixedHealth = e.maxHealth > 0 ? e.maxHealth : 1000;
      return { ...e, health: fixedHealth, maxHealth: fixedHealth };
    }
    return e;
  });
  
  let teamStates = [...context.teamStates];
  let abilities = [...context.abilities];
  let bloodlustActive = context.bloodlustActive;
  let bloodlustEndTick = context.bloodlustEndTick;
  let totalTime = context.totalTime;
  let currentTick = context.currentTick;
  let currentCombatState = context.currentCombatState;
  let timedOut = context.timedOut;
  
  // Debug: Log combat start
  console.log(`[Combat] ===== COMBAT LOOP START =====`);
  console.log(`[Combat] Enemies: ${currentEnemies.length}`, currentEnemies.map(e => `${e.name} (${e.health}/${e.maxHealth}hp, behavior: ${e.behavior})`));
  console.log(`[Combat] Team: ${teamStates.length} members`, teamStates.map(m => `${m.name} (${m.health}/${m.maxHealth}hp, dead: ${m.isDead})`));
  console.log(`[Combat] Initial tick: ${currentTick}, totalTime: ${totalTime.toFixed(2)}s`);
  
  const isSimulation = combatRef.current.simulationContextRef !== undefined;
  let ticksSinceLastYield = 0;
  const TICKS_PER_YIELD = isSimulation ? 10 : Infinity; // Yield every 10 ticks in simulation (~1s of game time)
  
  // Performance optimization: Batch state updates
  // Update visual state (floating numbers, combat log) every N ticks instead of every tick
  const VISUAL_UPDATE_INTERVAL = 3; // Update visuals every 3 ticks (300ms) instead of every tick (100ms)
  let ticksSinceLastVisualUpdate = 0;
  const batchedFloatingNumbers: FloatingNumber[] = [];
  const batchedLogEntries: import('../../../types/dungeon').CombatLogEntry[] = [];
  const MAX_COMBAT_LOG_SIZE = 100; // Limit combat log to last 100 entries
  const MAX_FLOATING_NUMBERS = 15; // Limit floating numbers to last 15
  
  // Add batch arrays to context so enemyCombat and bossFight can use them
  context.batchedFloatingNumbers = batchedFloatingNumbers;
  context.batchedLogEntries = batchedLogEntries;
  
  let tickCount = 0;
  while (currentEnemies.some(e => e.health > 0) && teamStates.some(m => !m.isDead) && !timedOut) {
    if (combatRef.current.stop) {
      console.log(`[Combat] Loop stopped by combatRef.stop at tick ${currentTick}`);
      break;
    }
    
    // Pause check - wait while paused
    while (combatRef.current.paused && !combatRef.current.stop) {
      if (!isSimulation) {
        await sleep(100, combatRef);
      } else {
        break; // In simulation, don't pause
      }
    }
    if (combatRef.current.stop) {
      console.log(`[Combat] Loop stopped by combatRef.stop (after pause) at tick ${currentTick}`);
      break;
    }

    if (checkTimeout()) {
      console.log(`[Combat] Timeout reached at tick ${currentTick}`);
      updateCombatState(prev => ({ ...prev, phase: 'defeat', combatLog: [...prev.combatLog, { timestamp: totalTime, type: 'phase', source: '', target: '', message: '⏰ TIME EXPIRED! Dungeon failed.' }] }));
      break;
    }
    
    // ===== ADVANCE ONE TICK (100ms) =====
    currentTick++;
    totalTime = ticksToSeconds(currentTick);
    tickCount++;
    
    if (tickCount % 10 === 0) {
      console.log(`[Combat] Tick ${currentTick} (${totalTime.toFixed(1)}s) - Enemies: ${currentEnemies.filter(e => e.health > 0).length}/${currentEnemies.length} alive, Team: ${teamStates.filter(m => !m.isDead).length}/${teamStates.length} alive`);
    }
    
    // Sleep for real-time display or yield for simulation
    if (isSimulation) {
      ticksSinceLastYield++;
      if (ticksSinceLastYield >= TICKS_PER_YIELD) {
        ticksSinceLastYield = 0;
        await sleep(0, combatRef);
      }
    } else {
      await sleep(TICK_MS, combatRef);
    }
    
    // Check for wipe
    if (!teamStates.some(m => !m.isDead)) {
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
      
      return {
        teamStates,
        currentEnemies,
        abilities,
        bloodlustActive,
        bloodlustEndTick,
        totalTime,
        currentTick,
        currentCombatState,
        timedOut,
        wiped: true,
        wipeResult
      };
    }

    // Reduce ability cooldowns (tick-based)
    abilities = abilities.map(a => ({ ...a, currentCooldown: Math.max(0, a.currentCooldown - TICK_DURATION) }));
    
    // Check bloodlust expiration
    if (bloodlustActive && currentTick >= bloodlustEndTick) {
      bloodlustActive = false;
    }

    // Recalculate alive enemies each tick (they can die during combat)
    const aliveEnemies = currentEnemies.filter(e => e.health > 0);
    
    if (aliveEnemies.length === 0) break;
    
    // Check for resurrection requests from useAbility
    if (combatRef.current.resurrectRequest) {
      const rezTargetId = combatRef.current.resurrectRequest;
      const rezTarget = teamStates.find(m => m.id === rezTargetId);
      const healer = teamStates.find(m => m.role === 'healer' && !m.isDead);
      
      if (rezTarget && healer) {
        // Start resurrection cast (2 seconds)
        const rezCastTicks = secondsToTicks(2);
        if (!combatRef.current.resurrectCastStartTick) {
          combatRef.current.resurrectCastStartTick = currentTick;
          combatRef.current.resurrectCastEndTick = currentTick + rezCastTicks;
          // Show casting state
          updateCombatState(prev => ({ 
            ...prev, 
            healerCasting: { 
              ability: 'Resurrection', 
              progress: 0, 
              startTime: Date.now() 
            }
          }));
        } else {
          // Update progress
          const progress = Math.min(100, ((currentTick - combatRef.current.resurrectCastStartTick) / rezCastTicks) * 100);
          updateCombatState(prev => ({ 
            ...prev, 
            healerCasting: prev.healerCasting ? { 
              ...prev.healerCasting, 
              progress 
            } : undefined
          }));
          
          // Check if cast complete
          if (currentTick >= combatRef.current.resurrectCastEndTick) {
            // Apply resurrection
            teamStates = teamStates.map(m => 
              m.id === rezTargetId 
                ? { ...m, isDead: false, health: Math.floor(m.maxHealth * 0.6), mana: Math.floor(m.maxMana * 0.3), lastResurrectTime: Date.now() } 
                : m
            );
            
            // Clear casting state
            updateCombatState(prev => ({ 
              ...prev, 
              healerCasting: undefined,
              combatLog: [...prev.combatLog, { 
                timestamp: totalTime, 
                type: 'heal', 
                source: healer.name, 
                target: rezTarget.name, 
                message: `💫 ${rezTarget.name} has been resurrected!` 
              }]
            }));
            
            // Clear resurrection request
            combatRef.current.resurrectRequest = null;
            combatRef.current.resurrectCastStartTick = undefined;
            combatRef.current.resurrectCastEndTick = undefined;
          }
        }
      } else {
        // Can't resurrect, clear request
        combatRef.current.resurrectRequest = null;
      }
    }
    
    // Check for bloodlust activation from useAbility
    if (combatRef.current.bloodlustRequest) {
      bloodlustActive = true;
      bloodlustEndTick = currentTick + (15 * TICKS_PER_SECOND); // 15 seconds
      combatRef.current.bloodlustRequest = false;
    }
    
    // Sync ability cooldowns from ref (when player clicks abilities)
    Object.entries(combatRef.current.abilityCooldowns).forEach(([id, cd]) => {
      const ability = abilities.find(a => a.id === id);
      if (ability && cd > ability.currentCooldown) {
        ability.currentCooldown = cd;
      }
    });
    combatRef.current.abilityCooldowns = {};
    
    // Update context before module calls
    context.teamStates = teamStates;
    context.currentCombatState = currentCombatState;
    context.totalTime = totalTime;
    context.currentTick = currentTick;
    context.bloodlustActive = bloodlustActive;
    context.bloodlustEndTick = bloodlustEndTick;
    context.timedOut = timedOut;
    
    // For simulation: sync context reference
    if (combatRef.current.simulationContextRef) {
      combatRef.current.simulationContextRef.teamStates = teamStates;
    }
    
    // Process buffs, HoTs, regen using module
    teamStates = processBuffsAndRegen(context, teamStates, currentTick);
    
    // Sync back from context
    currentCombatState = context.currentCombatState;
    totalTime = context.totalTime;
    bloodlustActive = context.bloodlustActive;
    timedOut = context.timedOut;
    
    // Recalculate alive enemies right before processing attacks (they may have died from buffs/regen)
    const currentAliveEnemies = currentEnemies.filter(e => e.health > 0);
    
    // Get references AFTER the teamStates reassignment so modifications persist
    const tank = teamStates.find(m => m.role === 'tank' && !m.isDead);
    const aliveMembers = teamStates.filter(m => !m.isDead);
    
    // Process enemy attacks using module
    if (!stunActive && currentAliveEnemies.length > 0) {
      processEnemyAttacks(context, currentAliveEnemies, teamStates, currentEnemies, currentTick);
    }
    
    // Capture alive enemies ONCE at start of tick - all DPS hit the same targets simultaneously
    const tickAliveEnemies = currentEnemies.filter(e => e.health > 0);
    
    // Update context before player actions
    context.teamStates = teamStates;
    context.currentCombatState = currentCombatState;
    context.totalTime = totalTime;
    context.currentTick = currentTick;
    context.bloodlustActive = bloodlustActive;
    
    // Process player actions using module
    if (tickCount % 10 === 0) {
      console.log(`[Combat] Processing player actions - Team: ${aliveMembers.length} alive, Targets: ${tickAliveEnemies.length} alive enemies`);
    }
    const playerActionResult = processPlayerActions(context, teamStates, currentEnemies, tickAliveEnemies, currentTick);
    if (tickCount % 10 === 0 && playerActionResult.dpsFloatNumbers.length > 0) {
      console.log(`[Combat] Player actions generated ${playerActionResult.dpsFloatNumbers.length} floating numbers`);
    }
    
    // Batch floating numbers and log entries for performance
    if (playerActionResult.dpsFloatNumbers.length > 0) {
      batchedFloatingNumbers.push(...playerActionResult.dpsFloatNumbers);
    }
    if (playerActionResult.dpsLogEntries.length > 0) {
      batchedLogEntries.push(...playerActionResult.dpsLogEntries);
    }
    
    // Update visual state every N ticks instead of every tick (performance optimization)
    ticksSinceLastVisualUpdate++;
    if (ticksSinceLastVisualUpdate >= VISUAL_UPDATE_INTERVAL) {
      ticksSinceLastVisualUpdate = 0;
      
      // Apply batched updates
      if (batchedFloatingNumbers.length > 0 || batchedLogEntries.length > 0) {
        updateCombatState(prev => {
          const newFloatingNumbers = batchedFloatingNumbers.length > 0
            ? [...prev.floatingNumbers.slice(-5), ...batchedFloatingNumbers].slice(-MAX_FLOATING_NUMBERS)
            : prev.floatingNumbers;
          
          const newCombatLog = batchedLogEntries.length > 0
            ? [...prev.combatLog, ...batchedLogEntries].slice(-MAX_COMBAT_LOG_SIZE)
            : prev.combatLog;
          
          // Clear batches
          batchedFloatingNumbers.length = 0;
          batchedLogEntries.length = 0;
          
          return {
            ...prev,
            floatingNumbers: newFloatingNumbers,
            combatLog: newCombatLog
          };
        });
      }
    }
    
    // Sync back from context
    teamStates = context.teamStates;
    currentCombatState = context.currentCombatState;
    totalTime = context.totalTime;
    bloodlustActive = context.bloodlustActive;
    
    // For simulation: ensure context reference is synced
    if (combatRef.current.simulationContextRef) {
      combatRef.current.simulationContextRef.teamStates = teamStates;
    }
    
    // Add verbose tick summary every 10 ticks (1 second) for comprehensive logging
    if (currentTick % 10 === 0) {
      const tickSummary = createVerboseTickSummary(totalTime, currentTick, teamStates, currentEnemies);
      if (batchedLogEntries) {
        batchedLogEntries.push(tickSummary);
      } else {
        updateCombatState(prev => ({ ...prev, combatLog: [...prev.combatLog, tickSummary] }));
      }
    }
    
    // Check for newly dead enemies and mark them (experience awarded at end of pull)
    currentEnemies.forEach(enemy => {
      if (enemy.health <= 0 && !enemy.isDead) {
        enemy.isDead = true;
        enemy.deathTick = currentTick;
        enemy.deathTime = Date.now();
        
        // Track enemy for end-of-pull experience (don't award yet)
        if (!experienceAwarded.has(enemy.id)) {
          experienceAwarded.add(enemy.id);
          
          // Generate real-time loot drops
          const enemyDef = getEnemyById(enemy.enemyId);
          const enemyType = enemy.type === 'miniboss' ? 'miniboss' : 
                           enemy.type === 'elite' ? 'elite' : 'normal';
          
          const lootDrops = generateEnemyLootDrops(
            enemy.maxHealth,
            enemyType,
            context.mapTier,
            context.highestMapTierCompleted,
            { x: context.currentPos.x, y: context.currentPos.y },
            context.quantityBonus,
            context.rarityBonus
          );
          
          // Update combat state with new loot drops and death message
          updateCombatState(prev => ({ 
            ...prev, 
            lootDrops: [...prev.lootDrops, ...lootDrops],
            combatLog: [...prev.combatLog, { 
              timestamp: totalTime, 
              type: 'death', 
              source: '', 
              target: enemy.name, 
              message: lootDrops.length > 0 
                ? `⭐ ${enemy.name} defeated! (${lootDrops.length} drops)` 
                : `⭐ ${enemy.name} defeated!`
            }] 
          }));
        }
      }
    });
    
    // Persist updated enemy states (including dead enemies for animation)
    const now = Date.now();
    const enemiesToKeep = currentEnemies.filter(e => 
      e.health > 0 || (e.isDead && e.deathTime && (now - e.deathTime) < 800)
    );
    
    currentEnemies = enemiesToKeep.length > 0 
      ? enemiesToKeep.map(e => ({ ...e }))
      : aliveEnemies.map(e => ({ ...e }));
    
    teamStates = teamStates.map(m => ({ ...m }));

    updateCombatState(prev => ({ 
      ...prev, 
      enemies: currentEnemies, 
      teamStates: [...teamStates], 
      abilities: [...abilities], 
      bloodlustActive, 
      bloodlustTimer: bloodlustActive ? ticksToSeconds(bloodlustEndTick - currentTick) : 0, 
      timeElapsed: totalTime 
    }));
  }

  // Check for wipe after loop exits (party died while loop was processing)
  if (!teamStates.some(m => !m.isDead) && !timedOut && !combatRef.current.stop) {
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
    
    return {
      teamStates,
      currentEnemies,
      abilities,
      bloodlustActive,
      bloodlustEndTick,
      totalTime,
      currentTick,
      currentCombatState,
      timedOut,
      wiped: true,
      wipeResult
    };
  }

  // === AWARD EXPERIENCE AT END OF PULL ===
  // Only award if pull was successful (enemies dead, team alive)
  if (experienceAwarded.size > 0 && teamStates.some(m => !m.isDead)) {
    const aliveTeamMembers = teamStates.filter(m => !m.isDead);
    
    // Award experience per-character (each character gets XP based on their own level)
    // This ensures proper experience penalties are applied per character
    aliveTeamMembers.forEach(member => {
      const character = team.find(c => c.id === member.id);
      if (!character) return;
      
      let characterExpGained = 0;
      
      // Calculate exp from all killed enemies for this specific character
      experienceAwarded.forEach(enemyId => {
        // Find the enemy that was killed (by their ID prefix)
        const killedEnemy = pullEnemies.find(e => e.id === enemyId);
        if (killedEnemy) {
          const enemyDef = getEnemyById(killedEnemy.enemyId);
          if (enemyDef) {
            // Calculate XP based on this character's level (not average)
            const expFromEnemy = calculateExperienceFromEnemy(
              enemyDef, 
              selectedKeyLevel, 
              scaling.healthMultiplier, 
              character.level  // Use character's own level for penalty calculation
            );
            characterExpGained += expFromEnemy;
          }
        }
      });
      
      // Award calculated exp to this character
      if (characterExpGained > 0) {
        const levelUpResult = awardExperience(character.id, characterExpGained);
        if (levelUpResult && levelUpResult.leveledUp) {
          updateCombatState(prev => ({ 
            ...prev, 
            levelUpAnimations: [...prev.levelUpAnimations, {
              characterId: character.id,
              newLevel: levelUpResult.newLevel,
              timestamp: Date.now()
            }],
            combatLog: [...prev.combatLog, { 
              timestamp: totalTime, 
              type: 'level', 
              source: character.name, 
              target: '', 
              message: `🎉 ${character.name} reached level ${levelUpResult.newLevel}!` 
            }] 
          }));
        }
      }
    });
  }

  return {
    teamStates,
    currentEnemies,
    abilities,
    bloodlustActive,
    bloodlustEndTick,
    totalTime,
    currentTick,
    currentCombatState,
    timedOut,
    wiped: false
  };
}
