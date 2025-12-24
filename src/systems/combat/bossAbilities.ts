/**
 * Boss Ability Execution System
 * Handles all boss ability logic, debuffs, buffs, and effects
 */

import type { TeamMemberState, AnimatedEnemy, CombatState } from '../../types/combat';
import type { BossAbility, BossDebuff, BossBuff } from '../../types/bossAbilities';
import { BOSS_ABILITIES } from '../../types/bossAbilities';
import { calculateArmorReduction, rollBlock, BLOCK_DAMAGE_REDUCTION } from '../../types/character';
import { createFloatingNumber } from '../../utils/combat';
import { secondsToTicks, ticksToSeconds, GCD_TICKS } from './types';

export interface BossAbilityState {
  cooldowns: Map<string, number>; // abilityId -> tick when cooldown ends
  lastAbilityUsed?: string;
  abilityHistory: string[]; // Last 3 abilities for Infinite Refrain
  unendingVerseStacks: number; // For Unending Verse damage ramp
  lastBastionActive: boolean; // For Kaelthorne's Last Bastion
  lastBastionEndTick: number;
  ruleByFlameActive: boolean; // For Ashbound Regent's Rule by Flame
  ruleByFlameEndTick: number;
  ruleByFlameDamageBonus: number;
  treasuryArmor: number; // For Vaelrix's Molten Treasury
  treasuryArmorEndTick: number;
  crownOfEmbersActive: boolean; // For Ashbound Regent's Crown of Embers
  crownOfEmbersEndTick: number;
}

export interface PartyDebuffState {
  [memberId: string]: BossDebuff[];
}

export interface PartyBuffState {
  [memberId: string]: import('../../types/combat').HotEffect[]; // Reuse HotEffect for buffs
}

export interface BossBuffState {
  buffs: BossBuff[];
}

/**
 * Get abilities for a boss by name
 */
export function getBossAbilities(bossName: string): BossAbility[] {
  return BOSS_ABILITIES[bossName] || [];
}

/**
 * Initialize boss ability state
 */
export function initBossAbilityState(): BossAbilityState {
  return {
    cooldowns: new Map(),
    abilityHistory: [],
    unendingVerseStacks: 0,
    lastBastionActive: false,
    lastBastionEndTick: 0,
    ruleByFlameActive: false,
    ruleByFlameEndTick: 0,
    ruleByFlameDamageBonus: 0,
    treasuryArmor: 0,
    treasuryArmorEndTick: 0,
    crownOfEmbersActive: false,
    crownOfEmbersEndTick: 0
  };
}

/**
 * Check if an ability is off cooldown
 */
export function isAbilityReady(ability: BossAbility, abilityState: BossAbilityState, currentTick: number): boolean {
  const cooldownEndTick = abilityState.cooldowns.get(ability.id);
  console.log(`[ABILITY READY DEBUG] Checking ${ability.name} (${ability.id}): cooldownEndTick=${cooldownEndTick}, currentTick=${currentTick}, isOncePerFight=${ability.isOncePerFight}`);
  
  if (cooldownEndTick === undefined) {
    console.log(`[ABILITY READY DEBUG]   -> Ready (never used)`);
    return true; // Never used, ready
  }
  if (ability.isOncePerFight && cooldownEndTick > 0) {
    console.log(`[ABILITY READY DEBUG]   -> Not ready (once per fight, already used)`);
    return false; // Already used once
  }
  const ready = currentTick >= cooldownEndTick;
  console.log(`[ABILITY READY DEBUG]   -> ${ready ? 'Ready' : 'Not ready'} (cooldown ends at tick ${cooldownEndTick}, ${cooldownEndTick - currentTick} ticks remaining)`);
  return ready;
}

/**
 * Get target for an ability
 */
function getAbilityTarget(
  ability: BossAbility,
  teamStates: TeamMemberState[],
  bossEnemy: AnimatedEnemy
): TeamMemberState[] {
  const aliveMembers = teamStates.filter(m => !m.isDead);
  
  switch (ability.targetType) {
    case 'all':
      return aliveMembers;
    case 'tank':
      const tank = aliveMembers.find(m => m.role === 'tank');
      return tank ? [tank] : [];
    case 'lowestLife':
      if (aliveMembers.length === 0) return [];
      const lowest = aliveMembers.reduce((min, m) => m.health < min.health ? m : min);
      return [lowest];
    case 'highestDPS':
      // Find highest DPS (we'll use total damage dealt as proxy)
      if (aliveMembers.length === 0) return [];
      const highestDPS = aliveMembers.reduce((max, m) => 
        (m.totalDamage || 0) > (max.totalDamage || 0) ? m : max
      );
      return [highestDPS];
    case 'random':
      if (aliveMembers.length === 0) return [];
      return [aliveMembers[Math.floor(Math.random() * aliveMembers.length)]];
    case 'self':
      return []; // Boss targets self
    default:
      return aliveMembers;
  }
}

/**
 * Calculate ability damage with scaling
 */
function calculateAbilityDamage(
  ability: BossAbility,
  bossEnemy: AnimatedEnemy,
  abilityState: BossAbilityState,
  teamStates: TeamMemberState[],
  partyDebuffs: PartyDebuffState,
  currentTick: number
): number {
  let baseDamage = ability.damage || 0;
  
  // Scale with boss damage multiplier
  baseDamage *= (bossEnemy.damage / 100); // Normalize to boss damage
  
  // Ability-specific scaling
  switch (ability.id) {
    case 'ruin_interest':
      // Damage per buff stack
      let totalBuffs = 0;
      teamStates.forEach(m => {
        if (m.hotEffects) totalBuffs += m.hotEffects.length;
        if (m.armorBuff) totalBuffs++;
        if (m.blockBuff) totalBuffs++;
        if (m.damageReduction) totalBuffs++;
      });
      baseDamage += totalBuffs * 5;
      break;
      
    case 'funeral_resonance':
      // Damage per dead entity
      const deadCount = teamStates.filter(m => m.isDead).length;
      baseDamage += deadCount * 10;
      break;
      
    case 'the_last_bell':
      // Damage per Doom Counter stack
      let totalDoomStacks = 0;
      teamStates.forEach(m => {
        const debuffs = partyDebuffs[m.id] || [];
        const doom = debuffs.find(d => d.name === 'Doom Counter');
        if (doom) totalDoomStacks += doom.stacks;
      });
      baseDamage += totalDoomStacks * 20;
      break;
      
    case 'singularity_bloom':
      // Damage per debuff
      let totalDebuffs = 0;
      teamStates.forEach(m => {
        totalDebuffs += (partyDebuffs[m.id] || []).length;
      });
      baseDamage += totalDebuffs * 10;
      break;
      
    case 'unyielding_strike':
      // Scales with boss armor
      baseDamage += (bossEnemy.armor / 10);
      break;
      
    case 'unending_verse':
      // Ramp damage
      baseDamage *= (1 + abilityState.unendingVerseStacks * 0.1);
      break;
      
    case 'final_tally':
      // Damage per turn elapsed
      const turnsElapsed = Math.floor(currentTick / 10); // 10 ticks = 1 second = 1 turn
      baseDamage += turnsElapsed * 5;
      break;
      
    case 'census_strike':
      // Damage per party member
      baseDamage += teamStates.filter(m => !m.isDead).length * 10;
      break;
      
    case 'stat_audit':
      // Scales with highest stat (use strength as proxy)
      const maxStat = Math.max(...teamStates.map(m => m.armor || 0));
      baseDamage += maxStat / 10;
      break;
      
    case 'devour_sound':
      // Damage if party skipped actions (simplified: use random chance)
      // In real implementation, track skipped actions
      baseDamage += Math.random() * 20;
      break;
      
    case 'quiet_collapse':
      // Damage per missing mana
      const totalMissingMana = teamStates.reduce((sum, m) => sum + (m.maxMana - m.mana), 0);
      baseDamage += totalMissingMana / 10;
      break;
      
    case 'royal_immolation':
      // Damage increases each turn (simplified)
      baseDamage *= 1.2;
      break;
      
    case 'chorus_of_hunger':
      // Hits multiple times (handled in execution)
      break;
  }
  
  // Apply Rule by Flame damage bonus
  if (abilityState.ruleByFlameActive) {
    baseDamage *= (1 + abilityState.ruleByFlameDamageBonus / 100);
  }
  
  // Apply Crown of Embers fire damage bonus
  if (abilityState.crownOfEmbersActive && ability.damageType === 'fire') {
    baseDamage *= 1.5;
  }
  
  return Math.floor(baseDamage);
}

/**
 * Apply ability effects (debuffs, buffs, etc.)
 */
function applyAbilityEffects(
  ability: BossAbility,
  targets: TeamMemberState[],
  partyDebuffs: PartyDebuffState,
  partyBuffs: PartyBuffState,
  bossBuffs: BossBuffState,
  abilityState: BossAbilityState,
  currentTick: number
): void {
  console.log(`[APPLY EFFECTS DEBUG] Applying effects for ${ability.name} to ${targets.length} targets`);
  if (!ability.effects) {
    console.log(`[APPLY EFFECTS DEBUG] No effects to apply`);
    return;
  }
  console.log(`[APPLY EFFECTS DEBUG] Effects to apply:`, ability.effects.map(e => `${e.type}(${e.name})`));
  
  for (const effect of ability.effects) {
    for (const target of targets) {
      switch (effect.type) {
        case 'debuff':
          if (!partyDebuffs[target.id]) partyDebuffs[target.id] = [];
          const existingDebuff = partyDebuffs[target.id].find(d => d.name === effect.name);
          if (existingDebuff && effect.stacks) {
            existingDebuff.stacks = Math.min((existingDebuff.stacks || 1) + 1, effect.maxStacks || 5);
            existingDebuff.duration = effect.duration || 5;
          } else {
            partyDebuffs[target.id].push({
              id: effect.name,
              name: effect.name,
              stacks: 1,
              duration: effect.duration || 5,
              value: effect.value
            });
          }
          break;
          
        case 'buff':
          // Apply to boss
          if (ability.targetType === 'self') {
            if (!bossBuffs.buffs) bossBuffs.buffs = [];
            bossBuffs.buffs.push({
              id: effect.name,
              name: effect.name,
              duration: effect.duration || 3,
              value: effect.value
            });
            
            // Special handling for boss buffs
            if (effect.name === 'Treasury Armor') {
              abilityState.treasuryArmor = (effect.value || 20);
              abilityState.treasuryArmorEndTick = currentTick + (effect.duration || 3) * 10;
            } else if (effect.name === 'Stand Eternal') {
              // Handled in damage calculation
            } else if (effect.name === 'Crown of Embers') {
              abilityState.crownOfEmbersActive = true;
              abilityState.crownOfEmbersEndTick = currentTick + (effect.duration || 3) * 10;
            } else if (effect.name === 'Rule by Flame') {
              abilityState.ruleByFlameActive = true;
              abilityState.ruleByFlameEndTick = currentTick + (effect.duration || 5) * 10;
              abilityState.ruleByFlameDamageBonus = effect.value || 50;
            } else if (effect.name === 'Last Bastion') {
              abilityState.lastBastionActive = true;
              abilityState.lastBastionEndTick = currentTick + (effect.duration || 3) * 10;
            }
          }
          break;
          
        case 'stun':
          // Stun is handled by preventing actions (simplified)
          break;
          
        case 'silence':
          // Silence is handled by preventing spell casts (simplified)
          break;
          
        case 'removeBuffs':
          // Remove all buffs from target
          if (partyBuffs[target.id]) {
            partyBuffs[target.id] = [];
          }
          // Also clear armor/block buffs
          target.armorBuff = undefined;
          target.blockBuff = undefined;
          target.damageReduction = undefined;
          break;
          
        case 'removeCharges':
          // Charges are not implemented yet, placeholder
          break;
      }
    }
  }
}

/**
 * Process debuff damage over time
 */
export function processDebuffDamage(
  teamStates: TeamMemberState[],
  partyDebuffs: PartyDebuffState,
  currentTick: number,
  bossName: string,
  updateCombatState: ((updater: (prev: CombatState) => CombatState) => void) | ((updater: (prev: CombatState) => CombatState) => CombatState),
  batchedFloatingNumbers?: import('../../types/combat').FloatingNumber[],
  batchedLogEntries?: import('../../types/dungeon').CombatLogEntry[]
): void {
  // Process every second (10 ticks)
  if (currentTick % 10 !== 0) return;
  
  for (const member of teamStates) {
    if (member.isDead) continue;
    
    const debuffs = partyDebuffs[member.id] || [];
    for (const debuff of debuffs) {
      // Process DoT debuffs
      if (debuff.name === 'Void Brood' || debuff.name === 'March of the Unburied' || debuff.name === 'Ignite' || 
          debuff.name === 'Burn' || debuff.name === 'Poison' || debuff.name === 'Bleed') {
        const damage = (debuff.value || 0) * (debuff.stacks || 1);
        const safeCurrentHealth = isNaN(member.health) || !isFinite(member.health) ? member.maxHealth : member.health;
        const safeDamage = isNaN(damage) || !isFinite(damage) ? 0 : damage;
        member.health = Math.max(0, safeCurrentHealth - safeDamage);
        
        const floatNum = createFloatingNumber(damage, 'enemy', 0, 0);
        if (batchedFloatingNumbers) {
          batchedFloatingNumbers.push(floatNum);
        }
        if (batchedLogEntries) {
          batchedLogEntries.push({
            timestamp: currentTick / 10,
            type: 'damage',
            source: bossName,
            target: member.name,
            value: damage,
            ability: debuff.name,
            message: `🔥 ${member.name} takes ${damage} damage from ${debuff.name}!`
          });
        }
      }
      
      // Process Doom - instant death at 0 duration
      if (debuff.name === 'Doom Counter' && debuff.duration === 1) {
        member.health = 0;
        member.isDead = true;
        if (batchedLogEntries) {
          batchedLogEntries.push({
            timestamp: currentTick / 10,
            type: 'damage',
            source: bossName,
            target: member.name,
            value: member.maxHealth,
            ability: 'Doom',
            message: `💀 ${member.name} is consumed by DOOM!`
          });
        }
      }
      
      // Process Memory Leak - escalating damage
      if (debuff.name === 'Memory Leak') {
        // Increase stack count every 3 seconds
        if ((currentTick / 10) % 3 === 0) {
          debuff.stacks = Math.min((debuff.stacks || 1) + 1, 10);
        }
        const damage = 10 * (debuff.stacks || 1);
        const safeCurrentHealth = isNaN(member.health) || !isFinite(member.health) ? member.maxHealth : member.health;
        const safeDamage = isNaN(damage) || !isFinite(damage) ? 0 : damage;
        member.health = Math.max(0, safeCurrentHealth - safeDamage);
        
        const floatNum = createFloatingNumber(damage, 'enemy', 0, 0);
        if (batchedFloatingNumbers) {
          batchedFloatingNumbers.push(floatNum);
        }
      }
      
      // Apply debuff effects (non-damage)
      if (debuff.name === 'Maim' || debuff.name === 'Weakness') {
        // Reduce damage dealt
        member.damageReduction = (member.damageReduction || 0) + (debuff.value || 15);
      } else if (debuff.name === 'Blind') {
        // Reduce hit chance by 50%
        member.hitChance = Math.max(50, (member.hitChance || 100) - 50);
      } else if (debuff.name === 'Silence') {
        // Prevent spell casting
        member.canCastSpells = false;
      } else if (debuff.name === 'Root' || debuff.name === 'Web') {
        // Prevent movement (simplified as unable to dodge)
        member.evasion = 0;
      } else if (debuff.name === 'Confusion') {
        // Chance to miss attacks
        member.confusionMissChance = debuff.value || 50;
      } else if (debuff.name === 'Vulnerability') {
        // Take increased damage (handled in damage calculation)
      } else if (debuff.name === 'Slow') {
        // Reduce cast speed (simplified as longer GCD)
        member.gcdMultiplier = 1 + (debuff.value || 40) / 100;
      } else if (debuff.name === 'Heal Absorb Shield') {
        // Track heal absorb amount
        member.healAbsorb = (member.healAbsorb || 0) + (debuff.value || 100);
      }
      
      // Reduce debuff duration
      debuff.duration--;
    }
    
    // Remove expired debuffs and reset temporary effects
    partyDebuffs[member.id] = debuffs.filter(d => d.duration > 0);
    
    // Reset per-tick debuff effects if no longer present
    if (!debuffs.find(d => d.name === 'Silence')) {
      member.canCastSpells = true;
    }
    if (!debuffs.find(d => d.name === 'Confusion')) {
      member.confusionMissChance = 0;
    }
    if (!debuffs.find(d => d.name === 'Slow')) {
      member.gcdMultiplier = 1;
    }
  }
}

/**
 * Execute a boss ability
 */
export function executeBossAbility(
  ability: BossAbility,
  bossEnemy: AnimatedEnemy,
  teamStates: TeamMemberState[],
  abilityState: BossAbilityState,
  partyDebuffs: PartyDebuffState,
  partyBuffs: PartyBuffState,
  bossBuffs: BossBuffState,
  currentTick: number,
  bossName: string,
  updateCombatState: (updater: (prev: CombatState) => CombatState) => CombatState,
  batchedFloatingNumbers?: import('../../types/combat').FloatingNumber[],
  batchedLogEntries?: import('../../types/dungeon').CombatLogEntry[]
): { damageDealt: number; targetsHit: number } {
  console.log(`[EXECUTE ABILITY DEBUG] ========== executeBossAbility CALLED ==========`);
  console.log(`[EXECUTE ABILITY DEBUG] Ability: ${ability.name} (${ability.id})`);
  console.log(`[EXECUTE ABILITY DEBUG] Boss: ${bossName}, currentTick: ${currentTick}`);
  console.log(`[EXECUTE ABILITY DEBUG] Team members: ${teamStates.length} total, ${teamStates.filter(m => !m.isDead).length} alive`);
  
  const targets = getAbilityTarget(ability, teamStates, bossEnemy);
  console.log(`[EXECUTE ABILITY DEBUG] Targets found: ${targets.length} (targetType: ${ability.targetType})`);
  console.log(`[EXECUTE ABILITY DEBUG] Target names:`, targets.map(t => t.name));
  
  if (targets.length === 0 && ability.targetType !== 'self') {
    console.log(`[EXECUTE ABILITY DEBUG] No targets found and not self-target, returning 0 damage`);
    return { damageDealt: 0, targetsHit: 0 };
  }
  
  // Calculate damage
  console.log(`[EXECUTE ABILITY DEBUG] Calculating damage...`);
  const damage = calculateAbilityDamage(ability, bossEnemy, abilityState, teamStates, partyDebuffs, currentTick);
  console.log(`[EXECUTE ABILITY DEBUG] Calculated damage: ${damage}`);
  
  let totalDamageDealt = 0;
  let targetsHit = 0;
  
  console.log(`[EXECUTE ABILITY DEBUG] Processing ability effects...`);
  
  // Special handling for certain abilities
  if (ability.id === 'chorus_of_hunger') {
    // Hits 3 times
    for (let i = 0; i < 3; i++) {
      for (const target of targets) {
        const effectiveArmor = target.armor * (1 + (target.armorBuff || 0) / 100);
        const armorMult = calculateArmorReduction(effectiveArmor, damage);
        let dmg = Math.floor(damage * armorMult);
        const blocked = rollBlock(target.blockChance || 0);
        if (blocked) {
          dmg = Math.floor(dmg * (1 - BLOCK_DAMAGE_REDUCTION));
        }
        const safeCurrentHealth = isNaN(target.health) || !isFinite(target.health) ? target.maxHealth : target.health;
        const safeDmg = isNaN(dmg) || !isFinite(dmg) ? 0 : dmg;
        target.health = Math.max(0, safeCurrentHealth - safeDmg);
        totalDamageDealt += dmg;
        targetsHit++;
        
        const floatNum = createFloatingNumber(dmg, blocked ? 'blocked' : 'enemy', 0, 0);
        if (batchedFloatingNumbers) batchedFloatingNumbers.push(floatNum);
      }
    }
  } else if (ability.id === 'fold_reality') {
    // Swap HP percentages between tank and boss
    const tank = teamStates.find(m => m.role === 'tank' && !m.isDead);
    if (tank && tank.maxHealth > 0 && bossEnemy.maxHealth > 0) {
      const tankHPPercent = tank.health / tank.maxHealth;
      const bossHPPercent = bossEnemy.health / bossEnemy.maxHealth;
      
      // Ensure percentages are valid numbers
      const safeTankPercent = isNaN(tankHPPercent) || !isFinite(tankHPPercent) ? 1 : Math.max(0, Math.min(1, tankHPPercent));
      const safeBossPercent = isNaN(bossHPPercent) || !isFinite(bossHPPercent) ? 1 : Math.max(0, Math.min(1, bossHPPercent));
      
      // Swap the percentages
      tank.health = Math.floor(tank.maxHealth * safeBossPercent);
      bossEnemy.health = Math.floor(bossEnemy.maxHealth * safeTankPercent);
      
      // Create visual feedback
      const tankDiff = Math.abs(tank.health - (tank.maxHealth * safeTankPercent));
      const bossDiff = Math.abs(bossEnemy.health - (bossEnemy.maxHealth * safeBossPercent));
      
      if (batchedFloatingNumbers) {
        batchedFloatingNumbers.push(createFloatingNumber(tankDiff, safeTankPercent > safeBossPercent ? 'heal' : 'enemy', 0, 0));
      }
      
      if (batchedLogEntries) {
        batchedLogEntries.push({
          timestamp: currentTick / 10,
          type: 'boss',
          source: bossName,
          target: tank.name,
          value: 0,
          ability: ability.name,
          message: `🔄 ${bossName} swaps HP percentages with ${tank.name}!`
        });
      }
    }
  } else if (ability.id === 'memory_fracture') {
    // Apply random debuff
    const possibleDebuffs = [
      { name: 'Confusion', duration: 3, value: 50 }, // 50% miss chance
      { name: 'Weakness', duration: 5, value: 30 }, // -30% damage
      { name: 'Vulnerability', duration: 4, value: 25 }, // +25% damage taken
      { name: 'Slow', duration: 3, value: 40 } // -40% cast speed
    ];
    
    for (const target of targets) {
      const randomDebuff = possibleDebuffs[Math.floor(Math.random() * possibleDebuffs.length)];
      if (!partyDebuffs[target.id]) partyDebuffs[target.id] = [];
      partyDebuffs[target.id].push({
        id: randomDebuff.name,
        name: randomDebuff.name,
        duration: randomDebuff.duration,
        value: randomDebuff.value,
        stacks: 1
      });
      
      if (damage > 0) {
        // Also deal damage
        const effectiveArmor = target.armor * (1 + (target.armorBuff || 0) / 100);
        const armorMult = calculateArmorReduction(effectiveArmor, damage);
        let dmg = Math.floor(damage * armorMult);
        const safeCurrentHealth = isNaN(target.health) || !isFinite(target.health) ? target.maxHealth : target.health;
        const safeDmg = isNaN(dmg) || !isFinite(dmg) ? 0 : dmg;
        target.health = Math.max(0, safeCurrentHealth - safeDmg);
        totalDamageDealt += dmg;
        targetsHit++;
        
        const floatNum = createFloatingNumber(dmg, 'enemy', 0, 0);
        if (batchedFloatingNumbers) batchedFloatingNumbers.push(floatNum);
      }
    }
  } else {
    // Normal damage
    for (const target of targets) {
      if (target.isDead) continue;
      
      // Apply Gilded debuff damage multiplier
      const gildedDebuff = (partyDebuffs[target.id] || []).find(d => d.name === 'Gilded');
      const gildedMultiplier = gildedDebuff ? (1 + (gildedDebuff.stacks || 0) * 0.10) : 1;
      
      // Apply Doom Counter damage multiplier
      const doomDebuff = (partyDebuffs[target.id] || []).find(d => d.name === 'Doom Counter');
      const doomMultiplier = doomDebuff ? (1 + (doomDebuff.stacks || 0) * 0.05) : 1;
      
      // Apply Chaos Vulnerability
      const chaosVuln = (partyDebuffs[target.id] || []).find(d => d.name === 'Chaos Vulnerability');
      const chaosRes = target.chaosResistance || 0;
      const effectiveChaosRes = chaosVuln ? Math.max(-75, chaosRes - (chaosVuln.stacks || 0) * 10) : chaosRes;
      const chaosMultiplier = ability.damageType === 'chaos' ? (1 - effectiveChaosRes / 100) : 1;
      
      const effectiveArmor = target.armor * (1 + (target.armorBuff || 0) / 100);
      const armorMult = ability.damageType === 'physical' || ability.damageType === 'mixed' 
        ? calculateArmorReduction(effectiveArmor, damage) 
        : 1;
      
      // Apply resistances
      let resistanceMult = 1;
      if (ability.damageType === 'fire') {
        resistanceMult = 1 - ((target.fireResistance || 0) / 100);
      } else if (ability.damageType === 'cold') {
        resistanceMult = 1 - ((target.coldResistance || 0) / 100);
      } else if (ability.damageType === 'lightning') {
        resistanceMult = 1 - ((target.lightningResistance || 0) / 100);
      } else if (ability.damageType === 'chaos') {
        resistanceMult = chaosMultiplier;
      }
      
      let dmg = Math.floor(damage * armorMult * resistanceMult * gildedMultiplier * doomMultiplier);
      const blocked = rollBlock(target.blockChance || 0);
      if (blocked) {
        dmg = Math.floor(dmg * (1 - BLOCK_DAMAGE_REDUCTION));
      }
      
      // Last Bastion protection
      const safeCurrentHealth = isNaN(target.health) || !isFinite(target.health) ? target.maxHealth : target.health;
      if (abilityState.lastBastionActive && safeCurrentHealth - dmg <= 0) {
        dmg = safeCurrentHealth - 1; // Leave at 1 HP
      }
      
      const safeDmg = isNaN(dmg) || !isFinite(dmg) ? 0 : dmg;
      target.health = Math.max(abilityState.lastBastionActive ? 1 : 0, safeCurrentHealth - safeDmg);
      totalDamageDealt += dmg;
      targetsHit++;
      
      const floatNum = createFloatingNumber(dmg, blocked ? 'blocked' : 'enemy', 0, 0);
      if (batchedFloatingNumbers) batchedFloatingNumbers.push(floatNum);
      
      if (target.health <= 0 && !abilityState.lastBastionActive) {
        target.isDead = true;
      }
    }
  }
  
  console.log(`[EXECUTE ABILITY DEBUG] Damage dealt: ${totalDamageDealt} to ${targetsHit} targets`);
  
  // Apply effects
  console.log(`[EXECUTE ABILITY DEBUG] Applying ability effects...`);
  applyAbilityEffects(ability, targets, partyDebuffs, partyBuffs, bossBuffs, abilityState, currentTick);
  console.log(`[EXECUTE ABILITY DEBUG] Effects applied`);
  
  // Update ability state
  // Reduce cooldowns by 60% (multiply by 0.4) so bosses use abilities much more frequently
  const reducedCooldown = ability.cooldown * 0.4;
  const cooldownTicks = secondsToTicks(reducedCooldown);
  const cooldownEndTick = currentTick + cooldownTicks;
  console.log(`[EXECUTE ABILITY DEBUG] Setting cooldown: ${ability.cooldown}s = ${cooldownTicks} ticks`);
  console.log(`[EXECUTE ABILITY DEBUG]   - currentTick: ${currentTick}`);
  console.log(`[EXECUTE ABILITY DEBUG]   - cooldownEndTick: ${cooldownEndTick}`);
  console.log(`[EXECUTE ABILITY DEBUG]   - Ability will be ready again at tick: ${cooldownEndTick}`);
  
  abilityState.cooldowns.set(ability.id, cooldownEndTick);
  abilityState.lastAbilityUsed = ability.id;
  abilityState.abilityHistory.push(ability.id);
  
  console.log(`[EXECUTE ABILITY DEBUG] Updated ability state:`);
  console.log(`[EXECUTE ABILITY DEBUG]   - lastAbilityUsed: ${abilityState.lastAbilityUsed}`);
  console.log(`[EXECUTE ABILITY DEBUG]   - Cooldowns:`, Array.from(abilityState.cooldowns.entries()).map(([id, tick]) => `${id}=${tick}`));
  console.log(`[EXECUTE ABILITY DEBUG] ========== executeBossAbility COMPLETE ==========`);
  if (abilityState.abilityHistory.length > 3) {
    abilityState.abilityHistory.shift();
  }
  
  if (ability.id === 'unending_verse') {
    abilityState.unendingVerseStacks++;
  }
  
  // Log ability use
  if (batchedLogEntries) {
    batchedLogEntries.push({
      timestamp: currentTick / 10,
      type: 'ability',
      source: bossName,
      target: targets.map(t => t.name).join(', '),
      ability: ability.name,
      message: `⚡ ${bossName} uses ${ability.name}!`
    });
  }
  
  return { damageDealt: totalDamageDealt, targetsHit };
}

/**
 * Select next ability to use
 */
export function selectBossAbility(
  abilities: BossAbility[],
  abilityState: BossAbilityState,
  currentTick: number,
  bossHealthPercent: number
): BossAbility | null {
  console.log(`[SELECT ABILITY DEBUG] ========== selectBossAbility CALLED ==========`);
  console.log(`[SELECT ABILITY DEBUG] Input: ${abilities.length} abilities, healthPercent=${bossHealthPercent.toFixed(1)}%, currentTick=${currentTick}`);
  
  // Filter to ready abilities
  console.log(`[SELECT ABILITY DEBUG] Filtering to ready abilities...`);
  const readyAbilities = abilities.filter(a => isAbilityReady(a, abilityState, currentTick));
  console.log(`[SELECT ABILITY DEBUG] Ready abilities: ${readyAbilities.length}/${abilities.length}`);
  console.log(`[SELECT ABILITY DEBUG] Ready ability names:`, readyAbilities.map(a => a.name));
  
  if (readyAbilities.length === 0) {
    console.log(`[SELECT ABILITY DEBUG] No ready abilities, returning null`);
    return null;
  }
  
  // Prioritize signature abilities if health is low or if it's time
  const signatureAbilities = readyAbilities.filter(a => a.isSignature);
  console.log(`[SELECT ABILITY DEBUG] Signature abilities: ${signatureAbilities.length}`, signatureAbilities.map(a => a.name));
  
  if (signatureAbilities.length > 0 && (bossHealthPercent < 30 || Math.random() < 0.3)) {
    const selected = signatureAbilities[0];
    console.log(`[SELECT ABILITY DEBUG] Selected signature ability: ${selected.name} (health < 30% or random)`);
    return selected;
  }
  
  // Otherwise, use a random ready ability
  const randomIndex = Math.floor(Math.random() * readyAbilities.length);
  const selected = readyAbilities[randomIndex];
  console.log(`[SELECT ABILITY DEBUG] Selected random ability: ${selected.name} (index ${randomIndex} of ${readyAbilities.length})`);
  return selected;
}

