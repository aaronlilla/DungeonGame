import type { AnimatedEnemy, TeamMemberState, CombatState } from '../../../types/combat';
import type { CombatContext } from '../types';
import { sleep, TICK_MS, TICK_DURATION, secondsToTicks, ticksToSeconds, GCD_TICKS } from '../types';
import { 
  calculateArmorReduction, 
  rollBlock, 
  BLOCK_DAMAGE_REDUCTION,
  calculateDamageWithResistances
} from '../../../types/character';
import { createFloatingNumber } from '../../../utils/combat';
import { assignEnemyDefensiveStats } from '../../../utils/enemyStats';
import { handleWipe } from './wipeHandler';
import { processPlayerActions } from '../playerCombat';
import { processBuffsAndRegen } from '../buffs';
import { processEnemyAttacks } from '../enemyCombat';
import {
  getBossAbilities,
  initBossAbilityState,
  selectBossAbility,
  executeBossAbility,
  processDebuffDamage,
  isAbilityReady,
  type PartyDebuffState,
  type PartyBuffState,
  type BossBuffState
} from '../bossAbilities';

/**
 * Track damage taken by a team member for statistics
 */
function trackDamageTaken(
  target: TeamMemberState,
  damage: number,
  sourceName: string,
  abilityName: string,
  currentTick?: number,
  resetESRecharge: boolean = true
): void {
  if (!target.damageTaken) target.damageTaken = 0;
  if (!target.damageTakenBySource) target.damageTakenBySource = {};
  if (!target.damageTakenByAbility) target.damageTakenByAbility = {};
  
  target.damageTaken += damage;
  target.damageTakenBySource[sourceName] = (target.damageTakenBySource[sourceName] || 0) + damage;
  target.damageTakenByAbility[abilityName] = (target.damageTakenByAbility[abilityName] || 0) + damage;
  target.recentDamageTaken = (target.recentDamageTaken || 0) + damage;
  
  // Update ES recharge delay timer (only if not blocked/evaded)
  // Evading or blocking doesn't count as getting hit for ES recharge purposes
  if (currentTick !== undefined && damage > 0 && resetESRecharge) {
    target.lastDamageTakenTick = currentTick;
  }
}

export interface BossFightResult {
  teamStates: TeamMemberState[];
  totalTime: number;
  currentTick: number;
  currentCombatState: CombatState;
  timedOut: boolean;
  wiped: boolean;
  wipeResult?: import('../../../types/dungeon').DungeonRunResult;
}

/**
 * Handles the final boss fight using tick-based timing
 */
export async function runBossFight(
  context: CombatContext,
  boss: import('../../../types/dungeon').DungeonBoss,
  currentPos: { x: number; y: number },
  totalForcesCleared: number
): Promise<BossFightResult> {
  const { combatRef, scaling, teamStates: initialTeamStates, currentCombatState: initialCombatState, stunActive, updateCombatState, checkTimeout, batchedFloatingNumbers, batchedLogEntries, usedBossNames } = context;
  
  // Assign random boss name if not already assigned
  if (!boss.displayName) {
    const { getRandomBossName } = await import('../../../utils/bossNames');
    boss.displayName = getRandomBossName(usedBossNames);
    if (usedBossNames) {
      usedBossNames.add(boss.displayName);
    }
  }
  
  let teamStates = [...initialTeamStates];
  let currentCombatState = { ...initialCombatState };
  let totalTime = context.totalTime;
  let currentTick = context.currentTick;
  let timedOut = context.timedOut;
  
  // Travel to boss
  const bossDistance = Math.sqrt(Math.pow(boss.position.x - currentPos.x, 2) + Math.pow(boss.position.y - currentPos.y, 2));
  const bossTravelTime = Math.max(2, Math.min(6, Math.floor(bossDistance / 200)));
  const travelTicks = secondsToTicks(bossTravelTime);
  
  updateCombatState(prev => ({ ...prev, phase: 'traveling', combatLog: [...prev.combatLog, { timestamp: totalTime, type: 'travel', source: '', target: '', message: `🚶 Approaching the Final Boss... (${bossTravelTime}s)` }] }));
  
  const isSimulation = combatRef.current.simulationContextRef !== undefined;
  if (isSimulation) {
    // In simulation, instantly travel
    currentTick += travelTicks;
    totalTime = ticksToSeconds(currentTick);
    currentPos = { x: boss.position.x, y: boss.position.y };
  } else {
    // Normal travel animation
    for (let i = 1; i <= 15; i++) {
      if (combatRef.current.stop || checkTimeout()) break;
      await sleep((bossTravelTime * 1000) / 15, combatRef);
      currentTick += Math.ceil(travelTicks / 15);
      totalTime = ticksToSeconds(currentTick);
      const newX = currentPos.x + (boss.position.x - currentPos.x) * (i / 15);
      const newY = currentPos.y + (boss.position.y - currentPos.y) * (i / 15);
      updateCombatState(prev => ({ ...prev, teamPosition: { x: newX, y: newY }, timeElapsed: totalTime }));
    }
  }
  
  // Check if stopped during boss travel
  if (combatRef.current.stop) {
    return { teamStates, totalTime, currentTick, currentCombatState, timedOut, wiped: false };
  }
  
  if (timedOut) {
    updateCombatState(prev => ({ ...prev, phase: 'defeat', combatLog: [...prev.combatLog, { timestamp: totalTime, type: 'phase', source: '', target: '', message: '⏰ TIME EXPIRED! Dungeon failed.' }] }));
    return { teamStates, totalTime, currentTick, currentCombatState, timedOut: true, wiped: false };
  }
  
  // Apply map affix modifiers to boss
  const healthMod = 1 + (context.mapAffixEffects?.enemyHealthIncrease || 0);
  const damageMod = 1 + (context.mapAffixEffects?.enemyDamageIncrease || 0);
  
  // Ensure boss has defensive stats assigned
  assignEnemyDefensiveStats(boss.enemy);
  
  // Scale defensive stats with key level
  const finalArmor = (boss.enemy.baseArmor || 0) * scaling.healthMultiplier;
  const finalEvasion = (boss.enemy.baseEvasion || 0) * scaling.healthMultiplier;
  const finalEnergyShield = (boss.enemy.baseEnergyShield || 0) * scaling.healthMultiplier;
  
  // Use display name if available, otherwise use enemy name
  const bossDisplayName = boss.displayName || boss.enemy.name;
  
  // Check if twinBoss effect is active
  const isTwinBoss = context.mapAffixEffects?.twinBoss || false;
  
  let bossEnemy: AnimatedEnemy = {
    id: 'final_boss',
    enemyId: boss.enemy.id,
    name: bossDisplayName,
    icon: boss.enemy.icon,
    type: boss.enemy.type,
    behavior: 'boss', // Boss behavior: tankbuster + AoE pulse + melee
    // Final boss: target ~16-20k HP at +2
    health: boss.enemy.baseHealth * scaling.healthMultiplier * 20 * healthMod, // 20x multiplier for final boss
    maxHealth: boss.enemy.baseHealth * scaling.healthMultiplier * 20 * healthMod, // 20x multiplier for final boss
    // Final boss damage multiplier (reduced from 2.0 to 1.0) - still dangerous but more manageable
    damage: boss.enemy.baseDamage * scaling.damageMultiplier * 1.0 * damageMod * 4, // Final bosses deal moderate damage
    // Defensive stats
    armor: finalArmor,
    evasion: finalEvasion,
    energyShield: finalEnergyShield,
    maxEnergyShield: finalEnergyShield,
    fireResistance: boss.enemy.baseFireResistance || 0,
    coldResistance: boss.enemy.baseColdResistance || 0,
    lightningResistance: boss.enemy.baseLightningResistance || 0,
    chaosResistance: boss.enemy.baseChaosResistance || 0,
    isCasting: false,
    gcdEndTick: currentTick
  };

  // Create second boss if twinBoss is active
  let secondBossEnemy: AnimatedEnemy | null = null;
  if (isTwinBoss) {
    const { getRandomBossName } = await import('../../../utils/bossNames');
    const secondBossName = getRandomBossName(usedBossNames);
    if (usedBossNames) {
      usedBossNames.add(secondBossName);
    }
    
    secondBossEnemy = {
      id: 'final_boss_twin',
      enemyId: boss.enemy.id,
      name: secondBossName,
      icon: boss.enemy.icon,
      type: boss.enemy.type,
      behavior: 'boss',
      health: boss.enemy.baseHealth * scaling.healthMultiplier * 20 * healthMod,
      maxHealth: boss.enemy.baseHealth * scaling.healthMultiplier * 20 * healthMod,
      damage: boss.enemy.baseDamage * scaling.damageMultiplier * 1.0 * damageMod * 4,
      armor: finalArmor,
      evasion: finalEvasion,
      energyShield: finalEnergyShield,
      maxEnergyShield: finalEnergyShield,
      fireResistance: boss.enemy.baseFireResistance || 0,
      coldResistance: boss.enemy.baseColdResistance || 0,
      lightningResistance: boss.enemy.baseLightningResistance || 0,
      chaosResistance: boss.enemy.baseChaosResistance || 0,
      isCasting: false,
      gcdEndTick: currentTick
    };
  }

  const bossEnemies = secondBossEnemy ? [bossEnemy, secondBossEnemy] : [bossEnemy];
  const bossMessage = isTwinBoss 
    ? `👑👑 TWIN BOSSES: ${bossDisplayName} & ${secondBossEnemy!.name}!`
    : `👑 FINAL BOSS: ${bossDisplayName}!`;

  updateCombatState(prev => ({
    ...prev,
    phase: 'combat',
    enemies: bossEnemies,
    combatLog: [...prev.combatLog, { timestamp: totalTime, type: 'boss', source: '', target: '', message: bossMessage }]
  }));

  let bossHealth = bossEnemy.health;
  let secondBossHealth = secondBossEnemy?.health || 0;
  let phase = 1;
  
  // Initialize boss ability system
  const bossAbilities = getBossAbilities(bossDisplayName);
  const bossAbilityState = initBossAbilityState();
  const partyDebuffs: PartyDebuffState = {};
  const partyBuffs: PartyBuffState = {};
  const bossBuffs: BossBuffState = { buffs: [] };
  
  // Legacy ability tracking (for fallback if no abilities defined)
  let bossSlamGcdEndTick = currentTick;
  let bossPulseEndTick = currentTick + secondsToTicks(3);
  let bossTankBusterEndTick = currentTick;
  let bossVolleyEndTick = currentTick;
  let bossVolleyCasting = false;
  let bossVolleyStartTick = 0;
  const BOSS_VOLLEY_CAST_TICKS = secondsToTicks(1.5);
  
  let ticksSinceLastYield = 0;
  const TICKS_PER_YIELD = isSimulation ? 10 : Infinity;

  // Check if both bosses are dead (if twinBoss) or just the main boss
  const allBossesDead = () => {
    if (isTwinBoss && secondBossEnemy) {
      return bossHealth <= 0 && secondBossHealth <= 0;
    }
    return bossHealth <= 0;
  };

  while (!allBossesDead() && teamStates.some(m => !m.isDead) && !timedOut) {
    if (combatRef.current.stop) break;
    
    // Pause check
    while (combatRef.current.paused && !combatRef.current.stop) {
      if (!isSimulation) {
        await sleep(100, combatRef);
      } else {
        break;
      }
    }
    if (combatRef.current.stop) break;

    if (checkTimeout()) {
      updateCombatState(prev => ({ ...prev, phase: 'defeat', combatLog: [...prev.combatLog, { timestamp: totalTime, type: 'phase', source: '', target: '', message: '⏰ TIME EXPIRED! Dungeon failed.' }] }));
      break;
    }
    
    // ===== ADVANCE ONE TICK (100ms) =====
    currentTick++;
    totalTime = ticksToSeconds(currentTick);
    
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
      
      const wipeResult = handleWipe(context, teamStates, currentCombatState, totalForcesCleared, totalTime);
      
      return { teamStates, totalTime, currentTick, currentCombatState, timedOut, wiped: true, wipeResult };
    }

    // Check for resurrection requests
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
            const resurrectionImmunityEndTick = currentTick + secondsToTicks(resurrectionImmunityDuration);
            
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
    
    // Check for bloodlust activation
    if (combatRef.current.bloodlustRequest) {
      context.bloodlustActive = true;
      context.bloodlustEndTick = currentTick + secondsToTicks(15);
      combatRef.current.bloodlustRequest = false;
    }
    
    // Check bloodlust expiration
    if (context.bloodlustActive && currentTick >= context.bloodlustEndTick) {
      context.bloodlustActive = false;
    }
    
    // Decrement ability cooldowns (tick-based)
    context.abilities = context.abilities.map(a => ({ ...a, currentCooldown: Math.max(0, a.currentCooldown - TICK_DURATION) }));
    
    // Sync ability cooldowns from ref
    Object.entries(combatRef.current.abilityCooldowns).forEach(([id, cd]) => {
      const ability = context.abilities.find(a => a.id === id);
      if (ability && cd > ability.currentCooldown) {
        ability.currentCooldown = cd;
      }
    });
    combatRef.current.abilityCooldowns = {};

    // Process debuff damage over time
    if (bossAbilities.length > 0) {
      processDebuffDamage(
        teamStates,
        partyDebuffs,
        currentTick,
        bossDisplayName,
        updateCombatState,
        batchedFloatingNumbers,
        batchedLogEntries
      );
    }
    
    // Boss abilities (only if not stunned)
    if (!stunActive) {
      const tank = teamStates.find(m => m.role === 'tank' && !m.isDead);
      const aliveMembers = teamStates.filter(m => !m.isDead);
      
      // HEAVY DEBUG: Log boss state every tick
      console.log(`[BOSS FIGHT DEBUG] Tick ${currentTick}: bossVolleyCasting=${bossVolleyCasting}, isCasting=${bossEnemy.isCasting}, castEndTick=${bossEnemy.castEndTick}, castStartTick=${bossEnemy.castStartTick}, castAbility=${bossEnemy.castAbility}`);
      
      // Check if cast is complete FIRST (before checking for new ability)
      // Casts complete exactly at castEndTick, not a tick later
      if (bossVolleyCasting && bossEnemy.castEndTick && currentTick >= bossEnemy.castEndTick) {
        const ticksElapsed = currentTick - (bossEnemy.castStartTick || 0);
        const expectedTicks = bossEnemy.castTotalTicks || 0;
        const castProgress = expectedTicks > 0 ? (ticksElapsed / expectedTicks) * 100 : 0;
        
        console.log(`[BOSS FIGHT DEBUG] CAST COMPLETE CHECK at tick ${currentTick}:`);
        console.log(`  - bossVolleyCasting: ${bossVolleyCasting}`);
        console.log(`  - castEndTick: ${bossEnemy.castEndTick}`);
        console.log(`  - castStartTick: ${bossEnemy.castStartTick}`);
        console.log(`  - ticksElapsed: ${ticksElapsed}, expected: ${expectedTicks}`);
        console.log(`  - castProgress: ${castProgress.toFixed(1)}%`);
        console.log(`  - castAbility: ${bossEnemy.castAbility}`);
        
        // Find the ability that was being cast using the stored castAbility ID
        const castingAbility = bossEnemy.castAbility
          ? bossAbilities.find(a => a.id === bossEnemy.castAbility)
          : null;
        
        console.log(`  - Found castingAbility: ${castingAbility?.name || 'NONE'}`);
        console.log(`  - lastAbilityUsed: ${bossAbilityState.lastAbilityUsed}`);
        
        if (castingAbility) {
          console.log(`[BOSS FIGHT DEBUG] EXECUTING ABILITY: ${castingAbility.name} at tick ${currentTick}`);
          const result = executeBossAbility(
            castingAbility,
            bossEnemy,
            teamStates,
            bossAbilityState,
            partyDebuffs,
            partyBuffs,
            bossBuffs,
            currentTick,
            bossDisplayName,
            updateCombatState,
            batchedFloatingNumbers,
            batchedLogEntries
          );
          
          console.log(`[BOSS FIGHT DEBUG] Ability executed: ${result.damageDealt} damage to ${result.targetsHit} targets`);
          
          // Apply death penalties
          for (const member of teamStates) {
            if (member.isDead && member.health <= 0) {
              context.applyDeathPenalty(member.id);
            }
          }
        } else {
          console.warn(`[BOSS FIGHT DEBUG] WARNING: Cast completed but no ability found!`);
        }
        
        bossVolleyCasting = false;
        bossEnemy.isCasting = false;
        bossEnemy.castStartTick = undefined;
        bossEnemy.castEndTick = undefined;
        bossEnemy.castTotalTicks = undefined;
        bossEnemy.castStartTime = undefined;
        bossEnemy.castTotalTime = undefined;
        bossEnemy.castAbility = undefined; // Clear the ability being cast
        console.log(`[BOSS FIGHT DEBUG] Cast state cleared. Ready for next ability.`);
        // Bosses don't use GCD - they can cast immediately after cast completes
      } else if (bossVolleyCasting && bossEnemy.castEndTick) {
        // Still casting - log progress
        const ticksElapsed = currentTick - (bossEnemy.castStartTick || 0);
        const ticksRemaining = bossEnemy.castEndTick - currentTick;
        const expectedTicks = bossEnemy.castTotalTicks || 0;
        const castProgress = expectedTicks > 0 ? (ticksElapsed / expectedTicks) * 100 : 0;
        
        if (currentTick % 5 === 0) { // Log every 5 ticks while casting
          console.log(`[BOSS FIGHT DEBUG] CASTING PROGRESS at tick ${currentTick}: ${castProgress.toFixed(1)}% (${ticksRemaining} ticks remaining)`);
        }
      }
      
      // Use new boss ability system if abilities are defined
      // Bosses don't use GCD - they cast at exactly the tick they're supposed to
      if (bossAbilities.length > 0 && !bossVolleyCasting) {
        const healthPercent = (bossHealth / bossEnemy.maxHealth) * 100;
        
        console.log(`[BOSS FIGHT DEBUG] Selecting ability at tick ${currentTick}:`);
        console.log(`  - Health: ${bossHealth}/${bossEnemy.maxHealth} (${healthPercent.toFixed(1)}%)`);
        console.log(`  - Available abilities: ${bossAbilities.length}`);
        
        // Log all abilities and their cooldown status
        bossAbilities.forEach(ability => {
          const isReady = isAbilityReady(ability, bossAbilityState, currentTick);
          const cooldownEndTick = bossAbilityState.cooldowns.get(ability.id);
          const ticksRemaining = cooldownEndTick !== undefined ? Math.max(0, cooldownEndTick - currentTick) : 0;
          console.log(`  - ${ability.name} (${ability.id}): ready=${isReady}, cooldownEndTick=${cooldownEndTick !== undefined ? cooldownEndTick : 'never used'}, ticksRemaining=${ticksRemaining}`);
        });
        
        const nextAbility = selectBossAbility(bossAbilities, bossAbilityState, currentTick, healthPercent);
        
        if (nextAbility) {
          console.log(`[BOSS FIGHT DEBUG] SELECTED ABILITY: ${nextAbility.name} (castTime: ${nextAbility.castTime}s, cooldown: ${nextAbility.cooldown}s)`);
          
          // Check if ability needs casting time
          if (nextAbility.castTime > 0) {
            // Start casting
            const castTimeTicks = secondsToTicks(nextAbility.castTime);
            bossVolleyCasting = true;
            bossVolleyStartTick = currentTick;
            bossEnemy.isCasting = true;
            bossEnemy.castStartTick = currentTick;
            bossEnemy.castEndTick = currentTick + castTimeTicks;
            bossEnemy.castTotalTicks = castTimeTicks;
            bossEnemy.castStartTime = Date.now();
            bossEnemy.castTotalTime = nextAbility.castTime;
            bossEnemy.castAbility = nextAbility.id; // Store which ability is being cast
            
            console.log(`[BOSS FIGHT DEBUG] STARTING CAST at tick ${currentTick}:`);
            console.log(`  - Ability: ${nextAbility.name}`);
            console.log(`  - castTime: ${nextAbility.castTime}s = ${castTimeTicks} ticks`);
            console.log(`  - castStartTick: ${bossEnemy.castStartTick}`);
            console.log(`  - castEndTick: ${bossEnemy.castEndTick}`);
            console.log(`  - Expected completion at tick: ${bossEnemy.castEndTick}`);
            // Don't set GCD - bosses don't use GCD
            
            if (batchedLogEntries) {
              batchedLogEntries.push({
                timestamp: totalTime,
                type: 'ability',
                source: bossDisplayName,
                target: '',
                ability: nextAbility.name,
                message: `⚡ ${bossDisplayName} begins casting ${nextAbility.name}...`
              });
            } else {
              updateCombatState(prev => ({
                ...prev,
                combatLog: [...prev.combatLog, {
                  timestamp: totalTime,
                  type: 'ability',
                  source: bossDisplayName,
                  target: '',
                  ability: nextAbility.name,
                  message: `⚡ ${bossDisplayName} begins casting ${nextAbility.name}...`
                }]
              }));
            }
          } else {
            // Instant cast
            console.log(`[BOSS FIGHT DEBUG] EXECUTING INSTANT ABILITY: ${nextAbility.name} at tick ${currentTick}`);
            const result = executeBossAbility(
              nextAbility,
              bossEnemy,
              teamStates,
              bossAbilityState,
              partyDebuffs,
              partyBuffs,
              bossBuffs,
              currentTick,
              bossDisplayName,
              updateCombatState,
              batchedFloatingNumbers,
              batchedLogEntries
            );
            
            console.log(`[BOSS FIGHT DEBUG] Instant ability executed: ${result.damageDealt} damage to ${result.targetsHit} targets`);
            
            // Don't set GCD - bosses don't use GCD, can cast immediately
            
            // Apply death penalties
            for (const member of teamStates) {
              if (member.isDead && member.health <= 0) {
                context.applyDeathPenalty(member.id);
              }
            }
          }
        } else {
          console.log(`[BOSS FIGHT DEBUG] No ability ready at tick ${currentTick} (all on cooldown)`);
        }
      }
      
      // Fallback to legacy abilities if no boss-specific abilities defined
      if (bossAbilities.length === 0) {
      
      // Pulse (aura - damages everyone periodically every 3s)
      if (currentTick >= bossPulseEndTick) {
        bossPulseEndTick = currentTick + secondsToTicks(3);
        const pulseDamage = Math.floor(bossEnemy.damage * 0.7 * 0.7);
        
        for (const member of aliveMembers) {
          const effectiveArmor = member.armor * (1 + (member.armorBuff || 0) / 100);
          const painSuppMult = member.damageReduction ? (1 - member.damageReduction / 100) : 1;
          const armorMult = calculateArmorReduction(effectiveArmor, pulseDamage);
          let damageAfterArmor = Math.floor(pulseDamage * armorMult * painSuppMult);
          const blockChance = (member.blockChance || 0) + (member.blockBuff || 0);
          const blocked = rollBlock(blockChance);
          if (blocked) {
            damageAfterArmor = Math.floor(damageAfterArmor * (1 - BLOCK_DAMAGE_REDUCTION));
            member.lastBlockTime = Date.now();
          }
          const damageResult = calculateDamageWithResistances(
            damageAfterArmor, 'physical',
            { health: member.health, maxHealth: member.maxHealth, energyShield: member.energyShield || 0, maxEnergyShield: member.maxEnergyShield || 0, fireResistance: member.fireResistance || 0, coldResistance: member.coldResistance || 0, lightningResistance: member.lightningResistance || 0, chaosResistance: member.chaosResistance || 0 }
          );
          // Safety checks to prevent NaN
          const safeESRemaining = isNaN(damageResult.esRemaining) || !isFinite(damageResult.esRemaining) ? (member.energyShield || 0) : Math.max(0, damageResult.esRemaining);
          const safeLifeRemaining = isNaN(damageResult.lifeRemaining) || !isFinite(damageResult.lifeRemaining) ? (member.maxHealth || 0) : Math.max(0, damageResult.lifeRemaining);
          member.energyShield = safeESRemaining;
          member.health = safeLifeRemaining;
          const dmg = isNaN(damageResult.totalDamage) || !isFinite(damageResult.totalDamage) ? 0 : damageResult.totalDamage;
          trackDamageTaken(member, dmg, bossDisplayName, 'Pulse', currentTick, !blocked);
          const jitterX = (Math.random() * 80) - 40;
          const jitterY = (Math.random() * 60) - 30;
          const floatNum = createFloatingNumber(dmg, blocked ? 'blocked' : 'enemy', currentCombatState.teamPosition.x + jitterX, currentCombatState.teamPosition.y - 40 + jitterY);
          if (batchedFloatingNumbers && batchedLogEntries) {
            batchedFloatingNumbers.push(floatNum);
            batchedLogEntries.push({ timestamp: totalTime, type: 'damage', source: bossDisplayName, target: member.name, value: dmg, ability: 'Pulse', message: `💀 ${bossDisplayName}'s Pulse hits ${member.name} for ${dmg}${blocked ? ' (BLOCKED!)' : ''}!` });
          } else {
            updateCombatState(prev => ({ ...prev, floatingNumbers: [...prev.floatingNumbers.slice(-20), floatNum], combatLog: [...prev.combatLog, { timestamp: totalTime, type: 'damage', source: bossDisplayName, target: member.name, value: dmg, ability: 'Pulse', message: `💀 ${bossDisplayName}'s Pulse hits ${member.name} for ${dmg}${blocked ? ' (BLOCKED!)' : ''}!` }] }));
          }
          if (member.health <= 0) {
            member.isDead = true;
            // Apply PoE-style death penalty (lose 10% of current level's experience)
            context.applyDeathPenalty(member.id);
            if (batchedLogEntries) {
              batchedLogEntries.push({ timestamp: totalTime, type: 'death', source: bossDisplayName, target: member.name, message: `💀 ${member.name} has died! (Experience penalty applied)` });
            } else {
              updateCombatState(prev => ({ ...prev, combatLog: [...prev.combatLog, { timestamp: totalTime, type: 'death', source: bossDisplayName, target: member.name, message: `💀 ${member.name} has died! (Experience penalty applied)` }] }));
            }
          }
        }
      }
      
      // Check if Volley cast is complete
      if (bossVolleyCasting && currentTick >= bossVolleyStartTick + BOSS_VOLLEY_CAST_TICKS) {
        const volleyDamage = Math.floor(bossEnemy.damage * 0.4);
        
        for (const member of aliveMembers) {
          const effectiveArmor = member.armor * (1 + (member.armorBuff || 0) / 100);
          const painSuppMult = member.damageReduction ? (1 - member.damageReduction / 100) : 1;
          const armorMult = calculateArmorReduction(effectiveArmor, volleyDamage);
          let damageAfterArmor = Math.floor(volleyDamage * armorMult * painSuppMult);
          const blockChance = (member.blockChance || 0) + (member.blockBuff || 0);
          const blocked = rollBlock(blockChance);
          if (blocked) {
            damageAfterArmor = Math.floor(damageAfterArmor * (1 - BLOCK_DAMAGE_REDUCTION));
            member.lastBlockTime = Date.now();
          }
          const damageResult = calculateDamageWithResistances(
            damageAfterArmor, 'physical',
            { health: member.health, maxHealth: member.maxHealth, energyShield: member.energyShield || 0, maxEnergyShield: member.maxEnergyShield || 0, fireResistance: member.fireResistance || 0, coldResistance: member.coldResistance || 0, lightningResistance: member.lightningResistance || 0, chaosResistance: member.chaosResistance || 0 }
          );
          // Safety checks to prevent NaN
          const safeESRemaining = isNaN(damageResult.esRemaining) || !isFinite(damageResult.esRemaining) ? (member.energyShield || 0) : Math.max(0, damageResult.esRemaining);
          const safeLifeRemaining = isNaN(damageResult.lifeRemaining) || !isFinite(damageResult.lifeRemaining) ? (member.maxHealth || 0) : Math.max(0, damageResult.lifeRemaining);
          member.energyShield = safeESRemaining;
          member.health = safeLifeRemaining;
          const dmg = isNaN(damageResult.totalDamage) || !isFinite(damageResult.totalDamage) ? 0 : damageResult.totalDamage;
          trackDamageTaken(member, dmg, bossDisplayName, 'Volley', currentTick, !blocked);
          const jitterX = (Math.random() * 80) - 40;
          const jitterY = (Math.random() * 60) - 30;
          const floatNum = createFloatingNumber(dmg, blocked ? 'blocked' : 'enemy', currentCombatState.teamPosition.x + jitterX, currentCombatState.teamPosition.y - 40 + jitterY);
          if (batchedFloatingNumbers && batchedLogEntries) {
            batchedFloatingNumbers.push(floatNum);
            batchedLogEntries.push({ timestamp: totalTime, type: 'damage', source: bossDisplayName, target: member.name, value: dmg, ability: 'Volley', message: `⚡ ${bossDisplayName}'s Volley hits ${member.name} for ${dmg}${blocked ? ' (BLOCKED!)' : ''}!` });
          } else {
            updateCombatState(prev => ({ ...prev, floatingNumbers: [...prev.floatingNumbers.slice(-20), floatNum], combatLog: [...prev.combatLog, { timestamp: totalTime, type: 'damage', source: bossDisplayName, target: member.name, value: dmg, ability: 'Volley', message: `⚡ ${bossDisplayName}'s Volley hits ${member.name} for ${dmg}${blocked ? ' (BLOCKED!)' : ''}!` }] }));
          }
          if (member.health <= 0) {
            member.isDead = true;
            // Apply PoE-style death penalty (lose 10% of current level's experience)
            context.applyDeathPenalty(member.id);
            if (batchedLogEntries) {
              batchedLogEntries.push({ timestamp: totalTime, type: 'death', source: bossDisplayName, target: member.name, message: `💀 ${member.name} has died! (Experience penalty applied)` });
            } else {
              updateCombatState(prev => ({ ...prev, combatLog: [...prev.combatLog, { timestamp: totalTime, type: 'death', source: bossDisplayName, target: member.name, message: `💀 ${member.name} has died! (Experience penalty applied)` }] }));
            }
          }
        }
        
        bossVolleyCasting = false;
        bossVolleyEndTick = currentTick + secondsToTicks(5);
        bossEnemy.gcdEndTick = currentTick + GCD_TICKS;
        updateCombatState(prev => ({ ...prev, combatLog: [...prev.combatLog, { timestamp: totalTime, type: 'ability', source: bossDisplayName, target: '', message: `⚡ ${bossDisplayName} unleashes Volley on the party!` }] }));
      }
      
      // Tank Buster (12s cooldown)
      if (currentTick >= bossTankBusterEndTick && bossEnemy.gcdEndTick !== undefined && currentTick >= bossEnemy.gcdEndTick && tank && !bossVolleyCasting) {
        bossTankBusterEndTick = currentTick + secondsToTicks(12);
        const effectiveArmor = tank.armor * (1 + (tank.armorBuff || 0) / 100);
        const painSuppMult = tank.damageReduction ? (1 - tank.damageReduction / 100) : 1;
        const rawTankBusterDamage = bossEnemy.damage * 3.0;
        const armorMult = calculateArmorReduction(effectiveArmor, rawTankBusterDamage);
        let damageAfterArmor = Math.floor(rawTankBusterDamage * armorMult * painSuppMult);
        const blockChance = (tank.blockChance || 0) + (tank.blockBuff || 0);
        const blocked = rollBlock(blockChance);
        if (blocked) {
          damageAfterArmor = Math.floor(damageAfterArmor * (1 - BLOCK_DAMAGE_REDUCTION));
          tank.lastBlockTime = Date.now();
        }
        const damageResult = calculateDamageWithResistances(
          damageAfterArmor, 'physical',
          { health: tank.health, maxHealth: tank.maxHealth, energyShield: tank.energyShield || 0, maxEnergyShield: tank.maxEnergyShield || 0, fireResistance: tank.fireResistance || 0, coldResistance: tank.coldResistance || 0, lightningResistance: tank.lightningResistance || 0, chaosResistance: tank.chaosResistance || 0 }
        );
        // Safety checks to prevent NaN
        const safeESRemaining = isNaN(damageResult.esRemaining) || !isFinite(damageResult.esRemaining) ? (tank.energyShield || 0) : Math.max(0, damageResult.esRemaining);
        const safeLifeRemaining = isNaN(damageResult.lifeRemaining) || !isFinite(damageResult.lifeRemaining) ? (tank.maxHealth || 0) : Math.max(0, damageResult.lifeRemaining);
        tank.energyShield = safeESRemaining;
        tank.health = safeLifeRemaining;
        const dmg = isNaN(damageResult.totalDamage) || !isFinite(damageResult.totalDamage) ? 0 : damageResult.totalDamage;
        trackDamageTaken(tank, dmg, bossDisplayName, 'Tank Buster', currentTick, !blocked);
        bossEnemy.gcdEndTick = currentTick + GCD_TICKS;
        const jitterX = (Math.random() * 80) - 40;
        const jitterY = (Math.random() * 60) - 30;
        const floatNum = createFloatingNumber(dmg, blocked ? 'blocked' : 'enemy', currentCombatState.teamPosition.x + jitterX, currentCombatState.teamPosition.y - 40 + jitterY);
        if (batchedFloatingNumbers && batchedLogEntries) {
          batchedFloatingNumbers.push(floatNum);
          batchedLogEntries.push({ timestamp: totalTime, type: 'damage', source: bossDisplayName, target: tank.name, value: dmg, ability: 'Tank Buster', message: `💥 ${bossDisplayName}'s Tank Buster hits ${tank.name} for ${dmg}${blocked ? ' (BLOCKED!)' : ''}!` });
        } else {
          updateCombatState(prev => ({ ...prev, floatingNumbers: [...prev.floatingNumbers.slice(-20), floatNum], combatLog: [...prev.combatLog, { timestamp: totalTime, type: 'damage', source: bossDisplayName, target: tank.name, value: dmg, ability: 'Tank Buster', message: `💥 ${bossDisplayName}'s Tank Buster hits ${tank.name} for ${dmg}${blocked ? ' (BLOCKED!)' : ''}!` }] }));
        }
        if (tank.health <= 0) {
          tank.isDead = true;
          if (batchedLogEntries) {
            batchedLogEntries.push({ timestamp: totalTime, type: 'death', source: bossDisplayName, target: tank.name, message: `💀 ${tank.name} has died!` });
          } else {
            updateCombatState(prev => ({ ...prev, combatLog: [...prev.combatLog, { timestamp: totalTime, type: 'death', source: bossDisplayName, target: tank.name, message: `💀 ${tank.name} has died!` }] }));
          }
        }
      }
      
      // Volley (5s cooldown, 1.5s cast)
      if (currentTick >= bossVolleyEndTick && bossEnemy.gcdEndTick !== undefined && currentTick >= bossEnemy.gcdEndTick && !bossVolleyCasting) {
        bossVolleyCasting = true;
        bossVolleyStartTick = currentTick;
        bossEnemy.gcdEndTick = currentTick + GCD_TICKS;
        bossEnemy.isCasting = true;
        bossEnemy.castStartTick = currentTick;
        bossEnemy.castEndTick = currentTick + BOSS_VOLLEY_CAST_TICKS;
        bossEnemy.castTotalTicks = BOSS_VOLLEY_CAST_TICKS;
        bossEnemy.castStartTime = Date.now();
        bossEnemy.castTotalTime = ticksToSeconds(BOSS_VOLLEY_CAST_TICKS);
        if (batchedLogEntries) {
          batchedLogEntries.push({ timestamp: totalTime, type: 'ability', source: bossDisplayName, target: '', message: `⚡ ${bossDisplayName} begins casting Volley...` });
        } else {
          updateCombatState(prev => ({ ...prev, combatLog: [...prev.combatLog, { timestamp: totalTime, type: 'ability', source: bossDisplayName, target: '', message: `⚡ ${bossDisplayName} begins casting Volley...` }] }));
        }
      }
      
      // Auto attack (Slam) - on GCD
      if (currentTick >= bossSlamGcdEndTick && bossEnemy.gcdEndTick !== undefined && currentTick >= bossEnemy.gcdEndTick && tank && !bossVolleyCasting) {
        bossSlamGcdEndTick = currentTick + GCD_TICKS;
        const effectiveArmor = tank.armor * (1 + (tank.armorBuff || 0) / 100);
        const painSuppMult = tank.damageReduction ? (1 - tank.damageReduction / 100) : 1;
        const rawSlamDamage = bossEnemy.damage * 1.2;
        const armorMult = calculateArmorReduction(effectiveArmor, rawSlamDamage);
        let damageAfterArmor = Math.floor(rawSlamDamage * armorMult * painSuppMult);
        const blockChance = (tank.blockChance || 0) + (tank.blockBuff || 0);
        const blocked = rollBlock(blockChance);
        if (blocked) {
          damageAfterArmor = Math.floor(damageAfterArmor * (1 - BLOCK_DAMAGE_REDUCTION));
          tank.lastBlockTime = Date.now();
        }
        const damageResult = calculateDamageWithResistances(
          damageAfterArmor, 'physical',
          { health: tank.health, maxHealth: tank.maxHealth, energyShield: tank.energyShield || 0, maxEnergyShield: tank.maxEnergyShield || 0, fireResistance: tank.fireResistance || 0, coldResistance: tank.coldResistance || 0, lightningResistance: tank.lightningResistance || 0, chaosResistance: tank.chaosResistance || 0 }
        );
        // Safety checks to prevent NaN
        const safeESRemaining = isNaN(damageResult.esRemaining) || !isFinite(damageResult.esRemaining) ? (tank.energyShield || 0) : Math.max(0, damageResult.esRemaining);
        const safeLifeRemaining = isNaN(damageResult.lifeRemaining) || !isFinite(damageResult.lifeRemaining) ? (tank.maxHealth || 0) : Math.max(0, damageResult.lifeRemaining);
        tank.energyShield = safeESRemaining;
        tank.health = safeLifeRemaining;
        const dmg = isNaN(damageResult.totalDamage) || !isFinite(damageResult.totalDamage) ? 0 : damageResult.totalDamage;
        trackDamageTaken(tank, dmg, bossDisplayName, 'Slam', currentTick, !blocked);
        bossEnemy.gcdEndTick = currentTick + GCD_TICKS;
        const jitterX = (Math.random() * 80) - 40;
        const jitterY = (Math.random() * 60) - 30;
        const floatNum = createFloatingNumber(dmg, blocked ? 'blocked' : 'enemy', currentCombatState.teamPosition.x + jitterX, currentCombatState.teamPosition.y - 40 + jitterY);
        if (batchedFloatingNumbers && batchedLogEntries) {
          batchedFloatingNumbers.push(floatNum);
          batchedLogEntries.push({ timestamp: totalTime, type: 'damage', source: bossDisplayName, target: tank.name, value: dmg, ability: 'Slam', message: `💥 ${bossDisplayName} Slams ${tank.name} for ${dmg}${blocked ? ' (BLOCKED!)' : ''}!` });
        } else {
          updateCombatState(prev => ({ ...prev, floatingNumbers: [...prev.floatingNumbers.slice(-20), floatNum], combatLog: [...prev.combatLog, { timestamp: totalTime, type: 'damage', source: bossDisplayName, target: tank.name, value: dmg, ability: 'Slam', message: `💥 ${bossDisplayName} Slams ${tank.name} for ${dmg}${blocked ? ' (BLOCKED!)' : ''}!` }] }));
        }
        if (tank.health <= 0) {
          tank.isDead = true;
          if (batchedLogEntries) {
            batchedLogEntries.push({ timestamp: totalTime, type: 'death', source: bossDisplayName, target: tank.name, message: `💀 ${tank.name} has died!` });
          } else {
            updateCombatState(prev => ({ ...prev, combatLog: [...prev.combatLog, { timestamp: totalTime, type: 'death', source: bossDisplayName, target: tank.name, message: `💀 ${tank.name} has died!` }] }));
          }
        }
      }
      } // End legacy abilities fallback
    } // End if (!stunActive)
    
    // Process buffs, HoTs, regen
    context.teamStates = teamStates;
    context.currentCombatState = currentCombatState;
    context.totalTime = totalTime;
    context.currentTick = currentTick;
    
    teamStates = processBuffsAndRegen(context, teamStates, currentTick);
    
    currentCombatState = context.currentCombatState;
    totalTime = context.totalTime;
    
    // Update boss enemies from combat state before processing attacks
    const currentEnemies = currentCombatState.enemies;
    bossEnemy = currentEnemies.find(e => e.id === 'final_boss') || bossEnemy;
    if (secondBossEnemy) {
      secondBossEnemy = currentEnemies.find(e => e.id === 'final_boss_twin') || secondBossEnemy;
    }
    
    const bossEnemyArray = secondBossEnemy ? [bossEnemy, secondBossEnemy] : [bossEnemy];
    
    // Process enemy attacks for BOTH bosses (this handles their abilities)
    if (!stunActive && bossEnemyArray.some(e => e.health > 0)) {
      const aliveBosses = bossEnemyArray.filter(e => e.health > 0);
      processEnemyAttacks(context, aliveBosses, teamStates, bossEnemyArray, currentTick);
      
      // Update boss enemies after attacks
      const updatedEnemies = currentCombatState.enemies;
      bossEnemy = updatedEnemies.find(e => e.id === 'final_boss') || bossEnemy;
      if (secondBossEnemy) {
        secondBossEnemy = updatedEnemies.find(e => e.id === 'final_boss_twin') || secondBossEnemy;
      }
      bossHealth = bossEnemy.health;
      if (secondBossEnemy) {
        secondBossHealth = secondBossEnemy.health;
      }
    }
    
    // Process player actions
    context.teamStates = teamStates;
    context.currentCombatState = currentCombatState;
    context.totalTime = totalTime;
    context.currentTick = currentTick;
    
    const playerActionResult = processPlayerActions(context, teamStates, bossEnemyArray, bossEnemyArray, currentTick);
    
    bossEnemy = bossEnemyArray[0];
    bossHealth = bossEnemy.health;
    if (secondBossEnemy && bossEnemyArray.length > 1) {
      secondBossEnemy = bossEnemyArray[1];
      secondBossHealth = secondBossEnemy.health;
    }
    
    // Update combat state with both bosses
    updateCombatState(prev => ({
      ...prev,
      enemies: bossEnemyArray,
      floatingNumbers: playerActionResult.dpsFloatNumbers.length > 0 
        ? [...prev.floatingNumbers.slice(-20), ...playerActionResult.dpsFloatNumbers].slice(-20)
        : prev.floatingNumbers,
      combatLog: playerActionResult.dpsLogEntries.length > 0
        ? [...prev.combatLog, ...playerActionResult.dpsLogEntries]
        : prev.combatLog
    }));
    
    teamStates = context.teamStates;
    currentCombatState = context.currentCombatState;
    totalTime = context.totalTime;
    
    // Phase transitions
    const healthPercent = (bossHealth / bossEnemy.maxHealth) * 100;
    if (phase === 1 && healthPercent <= 60) {
      phase = 2;
      updateCombatState(prev => ({ ...prev, combatLog: [...prev.combatLog, { timestamp: totalTime, type: 'boss', source: '', target: '', message: `🔥 ${bossDisplayName} enters Phase 2! Abilities intensify!` }] }));
    } else if (phase === 2 && healthPercent <= 30) {
      phase = 3;
      updateCombatState(prev => ({ ...prev, combatLog: [...prev.combatLog, { timestamp: totalTime, type: 'boss', source: '', target: '', message: `💥 ${bossDisplayName} ENRAGES!` }] }));
    }
    
    // Update boss enemy state for UI
    // Update boss enemy state for UI
    
    const bossEnemyState: AnimatedEnemy = {
      ...bossEnemy,
      health: bossHealth,
      isCasting: bossVolleyCasting,
      castStartTick: bossVolleyCasting ? bossVolleyStartTick : undefined,
      castEndTick: bossVolleyCasting ? bossVolleyStartTick + BOSS_VOLLEY_CAST_TICKS : undefined,
      castTotalTicks: bossVolleyCasting ? BOSS_VOLLEY_CAST_TICKS : undefined,
      castStartTime: bossVolleyCasting ? bossEnemy.castStartTime : undefined,
      castTotalTime: bossVolleyCasting ? ticksToSeconds(BOSS_VOLLEY_CAST_TICKS) : undefined
    };
    
    // Clear casting state when done
    if (!bossVolleyCasting) {
      bossEnemy.isCasting = false;
      bossEnemy.castStartTick = undefined;
      bossEnemy.castEndTick = undefined;
    }
    
    updateCombatState(prev => ({ 
      ...prev, 
      enemies: [bossEnemyState], 
      teamStates: [...teamStates], 
      abilities: [...context.abilities],
      bloodlustActive: context.bloodlustActive,
      bloodlustTimer: context.bloodlustActive ? ticksToSeconds(context.bloodlustEndTick - currentTick) : 0,
      timeElapsed: totalTime 
    }));
  }

  // Check for wipe after loop exits
  if (!teamStates.some(m => !m.isDead) && !timedOut && !combatRef.current.stop) {
    const wipeLogEntry = { timestamp: totalTime, type: 'phase' as const, source: '', target: '', message: '💀 WIPE! Your party has been defeated.' };
    updateCombatState(prev => ({ ...prev, phase: 'defeat', combatLog: [...prev.combatLog, wipeLogEntry] }));
    
    // Update local state with the new log entry before calling handleWipe
    currentCombatState = { ...currentCombatState, combatLog: [...currentCombatState.combatLog, wipeLogEntry] };
    
    const wipeResult = handleWipe(context, teamStates, currentCombatState, totalForcesCleared, totalTime);
    
    return { teamStates, totalTime, currentTick, currentCombatState, timedOut, wiped: true, wipeResult };
  }

  return { teamStates, totalTime, currentTick, currentCombatState, timedOut, wiped: false };
}
