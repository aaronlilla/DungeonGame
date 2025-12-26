import type { AnimatedEnemy, TeamMemberState, CombatState, PlayerAbility, FloatingNumber } from '../../../types/combat';
import type { CombatContext } from '../types';
import { sleep, TICK_MS, ticksToSeconds, secondsToTicks, TICK_DURATION, TICKS_PER_SECOND } from '../types';
import { processBuffsAndRegen } from '../buffs';
import { processEnemyAttacks } from '../enemyCombat';
import { processPlayerActions } from '../playerCombat';
import { handleWipe } from './wipeHandler';
import { getEnemyById } from '../../../types/dungeon';
import { calculateExperienceFromEnemy } from '../../../utils/leveling';
import { generateEnemyLootDrops } from '../../crafting';
import { createVerboseTickSummary } from '../verboseLogging';
import { updateTeamMemberStats } from '../../../utils/combat';
import { startTimer, endTimer } from '../../../utils/performanceMonitor';

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
  _pullIdx: number,
  totalForcesCleared: number,
  enemiesByPack?: AnimatedEnemy[][]
): Promise<CombatLoopResult> {
  const { combatRef, team, stunActive, experienceAwarded, checkTimeout, awardExperience, updateCombatState, selectedKeyLevel, scaling } = context;
  
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
  
  // Initialize enemies - start with empty (they're in queuedEnemies)
  let currentEnemies: AnimatedEnemy[] = [];
  
  // Set up trickle-in system
  const TRICKLE_DURATION_SECONDS = 6;
  const TRICKLE_DURATION_TICKS = secondsToTicks(TRICKLE_DURATION_SECONDS);
  let queuedEnemies = [...pullEnemies.map(e => {
    if (e.health <= 0 || e.maxHealth <= 0 || isNaN(e.health) || isNaN(e.maxHealth)) {
      console.warn(`runCombatLoop: Enemy ${e.name} (${e.id}) has invalid health: ${e.health}/${e.maxHealth}, fixing...`);
      const fixedHealth = e.maxHealth > 0 ? e.maxHealth : 1000;
      return { ...e, health: fixedHealth, maxHealth: fixedHealth };
    }
    return e;
  })];
  
  // Organize queued enemies by pack for trickle-in
  // Create a map of enemy ID to enemy object for quick lookup
  const enemyMap = new Map(queuedEnemies.map(e => [e.id, e]));
  let packQueues: AnimatedEnemy[][] = [];
  if (enemiesByPack && enemiesByPack.length > 0) {
    // Use provided pack organization - map each pack's enemies to queuedEnemies by ID
    // We use the same object references from queuedEnemies so removals sync correctly
    packQueues = enemiesByPack.map(pack => {
      return pack.map(packEnemy => enemyMap.get(packEnemy.id)!).filter(e => e !== undefined);
    }).filter(pack => pack.length > 0);
  } else {
    // Fallback: treat all enemies as one pack (create array with same object references)
    packQueues = [[...queuedEnemies]];
  }
  
  const combatStartTick = context.currentTick;
  const numPacks = packQueues.length;
  const totalEnemies = queuedEnemies.length;
  
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
  console.log(`[Combat] Total enemies: ${totalEnemies} (${numPacks} packs), starting in queue`);
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
  const MAX_UI_LOG_SIZE = 50; // Limit UI combat log to last 50 entries for performance
  const MAX_FLOATING_NUMBERS = 15; // Limit floating numbers to last 15
  
  // Add batch arrays to context so enemyCombat and bossFight can use them
  context.batchedFloatingNumbers = batchedFloatingNumbers;
  context.batchedLogEntries = batchedLogEntries;
  
  let tickCount = 0;
  // Continue combat while there are alive enemies OR queued enemies still trickling in
  while ((currentEnemies.some(e => e.health > 0) || queuedEnemies.length > 0) && teamStates.some(m => !m.isDead) && !timedOut) {
    startTimer(`combat.tick.${currentTick}`);
    
    if (combatRef.current.stop) {
      console.log(`[Combat] Loop stopped by combatRef.stop at tick ${currentTick}`);
      endTimer(`combat.tick.${currentTick}`);
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
    
    // Update verbose logger current tick
    if (context.verboseLogger) {
      context.verboseLogger.setCurrentTick(currentTick);
    }
    
    // ===== TRICKLE-IN LOGIC =====
    // Gradually add enemies from queue over 6 seconds, with pack-based distribution
    // When multiple packs are pulled, take one enemy from each pack at a time
    const ticksElapsed = currentTick - combatStartTick;
    if (ticksElapsed <= TRICKLE_DURATION_TICKS && queuedEnemies.length > 0 && packQueues.length > 0) {
      // Calculate how many enemies should have entered by now (evenly distributed over 6 seconds)
      const progress = Math.min(1, ticksElapsed / TRICKLE_DURATION_TICKS);
      // Use Math.ceil on first few enemies to ensure at least some enter immediately
      const targetEnemiesInCombat = ticksElapsed === 1 
        ? Math.max(1, Math.floor(totalEnemies * progress)) // At least 1 enemy on first tick
        : Math.floor(totalEnemies * progress);
      const enemiesNeeded = targetEnemiesInCombat - currentEnemies.length;
      
      // Add enemies in pack-based groups (one from each pack at a time)
      if (enemiesNeeded > 0) {
        const enemiesToAdd: AnimatedEnemy[] = [];
        
        // Keep adding waves until we catch up, taking one from each pack per wave
        while (enemiesToAdd.length < enemiesNeeded && queuedEnemies.length > 0) {
          let addedThisWave = 0;
          // One wave: take one enemy from each pack that still has enemies
          for (let packIdx = 0; packIdx < packQueues.length; packIdx++) {
            if (packQueues[packIdx].length > 0 && enemiesToAdd.length < enemiesNeeded) {
              const enemy = packQueues[packIdx].shift()!;
              enemiesToAdd.push(enemy);
              addedThisWave++;
              // Remove from queuedEnemies array
              const queueIndex = queuedEnemies.findIndex(e => e.id === enemy.id);
              if (queueIndex !== -1) {
                queuedEnemies.splice(queueIndex, 1);
              }
            }
          }
          
          if (addedThisWave === 0) {
            break; // No more enemies available
          }
        }
        
        // Add all collected enemies to combat
        if (enemiesToAdd.length > 0) {
          currentEnemies.push(...enemiesToAdd);
          updateCombatState(prev => ({
            ...prev,
            enemies: [...currentEnemies],
            queuedEnemies: [...queuedEnemies]
          }));
        }
      }
    } else if (queuedEnemies.length > 0 && ticksElapsed > TRICKLE_DURATION_TICKS) {
      // Time window expired, add all remaining enemies at once
      currentEnemies.push(...queuedEnemies);
      queuedEnemies = [];
      packQueues = [];
      
      updateCombatState(prev => ({
        ...prev,
        enemies: [...currentEnemies],
        queuedEnemies: []
      }));
    }
    
    if (tickCount % 10 === 0) {
      console.log(`[Combat] Tick ${currentTick} (${totalTime.toFixed(1)}s) - Enemies: ${currentEnemies.filter(e => e.health > 0).length}/${currentEnemies.length} alive (${queuedEnemies.length} queued), Team: ${teamStates.filter(m => !m.isDead).length}/${teamStates.length} alive`);
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
    
    // Only break if no alive enemies AND no queued enemies (all have trickled in)
    if (aliveEnemies.length === 0 && queuedEnemies.length === 0) break;
    
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
          if (combatRef.current.resurrectCastEndTick !== undefined && currentTick >= combatRef.current.resurrectCastEndTick) {
            // Apply resurrection - 100% HP/mana with 2 second immunity
            const resurrectionImmunityDuration = 2; // seconds
            const resurrectionImmunityEndTick = currentTick + (resurrectionImmunityDuration * TICKS_PER_SECOND);
            
            teamStates = teamStates.map(m => 
              m.id === rezTargetId 
                ? { 
                    ...m, 
                    isDead: false, 
                    health: m.maxHealth, // 100% HP
                    mana: m.maxMana, // 100% mana
                    lastResurrectTime: Date.now(),
                    resurrectionImmunity: true,
                    resurrectionImmunityEndTick: resurrectionImmunityEndTick
                  } 
                : m
            );
            
            // Clear casting state and update teamStates immediately so UI sees the resurrected member
            updateCombatState(prev => ({ 
              ...prev, 
              teamStates: teamStates,
              healerCasting: undefined,
              combatLog: [...prev.combatLog, { 
                timestamp: totalTime, 
                type: 'heal', 
                source: healer.name, 
                target: rezTarget.name, 
                message: `💫 ${rezTarget.name} has been resurrected! (Immune for ${resurrectionImmunityDuration}s)` 
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
    startTimer('combat.processBuffsAndRegen');
    teamStates = processBuffsAndRegen(context, teamStates, currentTick);
    endTimer('combat.processBuffsAndRegen');
    
    // Log tick summary every 10 ticks (1 second) for verbose logging
    if (context.verboseLogger && tickCount % 10 === 0) {
      context.verboseLogger.logTickSummary(totalTime, currentTick, teamStates, currentEnemies, currentCombatState.phase, _pullIdx);
    }
    
    // Sync back from context
    currentCombatState = context.currentCombatState;
    totalTime = context.totalTime;
    bloodlustActive = context.bloodlustActive;
    timedOut = context.timedOut;
    
    // Recalculate alive enemies right before processing attacks (they may have died from buffs/regen)
    const currentAliveEnemies = currentEnemies.filter(e => e.health > 0);
    
    // Get references AFTER the teamStates reassignment so modifications persist
    const aliveMembers = teamStates.filter(m => !m.isDead);
    
    // Process enemy attacks using module
    if (!stunActive && currentAliveEnemies.length > 0) {
      startTimer('combat.processEnemyAttacks');
      processEnemyAttacks(context, currentAliveEnemies, teamStates, currentEnemies, currentTick);
      endTimer('combat.processEnemyAttacks');
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
    startTimer('combat.processPlayerActions');
    const playerActionResult = processPlayerActions(context, teamStates, currentEnemies, tickAliveEnemies, currentTick);
    endTimer('combat.processPlayerActions');
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
        startTimer('combat.updateCombatState');
        updateCombatState(prev => {
          const newFloatingNumbers = batchedFloatingNumbers.length > 0
            ? [...prev.floatingNumbers.slice(-5), ...batchedFloatingNumbers].slice(-MAX_FLOATING_NUMBERS)
            : prev.floatingNumbers;
          
          // UI log: Keep only last 50 entries for performance
          const newCombatLog = batchedLogEntries.length > 0
            ? [...prev.combatLog, ...batchedLogEntries].slice(-MAX_UI_LOG_SIZE)
            : prev.combatLog;
          
          // Full log: Add to verbose logger for complete export (no truncation)
          if (batchedLogEntries.length > 0 && context.verboseLogger) {
            batchedLogEntries.forEach(entry => context.verboseLogger!.logEntry(entry));
          }
          
          // Clear batches
          batchedFloatingNumbers.length = 0;
          batchedLogEntries.length = 0;
          
          return {
            ...prev,
            floatingNumbers: newFloatingNumbers,
            combatLog: newCombatLog
          };
        });
        endTimer('combat.updateCombatState');
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
    
    // Check for newly dead enemies and award experience immediately
    currentEnemies.forEach(enemy => {
      if (enemy.health <= 0 && !enemy.isDead) {
        enemy.isDead = true;
        enemy.deathTick = currentTick;
        enemy.deathTime = Date.now();
        
        // Award experience immediately when enemy dies (mid-combat level-ups)
        if (!experienceAwarded.has(enemy.id)) {
          experienceAwarded.add(enemy.id);
          
          // Generate real-time loot drops
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
          
          // Award experience to all alive team members immediately
          const aliveTeamMembers = teamStates.filter(m => !m.isDead);
          const enemyDef = getEnemyById(enemy.enemyId);
          
          if (enemyDef) {
            aliveTeamMembers.forEach(member => {
              const character = team.find(c => c.id === member.id);
              if (!character) return;
              
              // Calculate XP based on this character's level
              const expFromEnemy = calculateExperienceFromEnemy(
                enemyDef,
                selectedKeyLevel,
                scaling.healthMultiplier,
                character.level
              );
              
              // Award experience immediately
              if (expFromEnemy > 0) {
                const levelUpResult = awardExperience(character.id, expFromEnemy);
                if (levelUpResult && levelUpResult.leveledUp) {
                  // Update team member stats immediately (full heal, full mana, new stats)
                  const updatedCharacter = context.team.find(c => c.id === character.id);
                  if (updatedCharacter) {
                    const memberIndex = teamStates.findIndex(m => m.id === character.id);
                    if (memberIndex >= 0) {
                      teamStates[memberIndex] = updateTeamMemberStats(
                        teamStates[memberIndex],
                        updatedCharacter,
                        context.inventory,
                        context.team
                      );
                      // Update context teamStates reference
                      context.teamStates = teamStates;
                    }
                  }
                  
                  // Add level up animation and log
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
                      message: `🎉 ${character.name} reached level ${levelUpResult.newLevel}! (Full Heal!)` 
                    }] 
                  }));
                }
              }
            });
          }
          
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
    
    endTimer(`combat.tick.${currentTick}`);
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

  // Experience is now awarded immediately when enemies die (mid-combat level-ups)
  // No need to award at end of pull since it's already been awarded

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
