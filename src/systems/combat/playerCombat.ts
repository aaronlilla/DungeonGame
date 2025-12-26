import type { AnimatedEnemy, TeamMemberState, FloatingNumber } from '../../types/combat';
import type { Character } from '../../types/character';
import { getEnemyById } from '../../types/dungeon';
import { createFloatingNumber } from '../../utils/combat';
import { calculatePlayerDamageToEnemy } from '../../utils/enemyDamage';
import {
  getSkillGemById,
  calculateCriticalStrikeChance,
  getSkillIdFromAbilityName,
  applySupportGems
} from '../../types/skills';
import { processOnHealEffects, processOnHitEffects } from './talentEvents';
import type { SkillGem } from '../../types/skills';
import { secondsToTicks, TICKS_PER_SECOND, getHastedTicks } from './types';
import type { CombatContext } from './types';
import type { CombatLogEntry } from '../../types/dungeon';
import { checkSkillConditions, createSmartSkillConfig, type SkillUsageConfig } from '../../types/skillUsage';
import { createVerboseDamageLog, createVerboseHealLog } from './verboseLogging';
import { getEquippedWeaponDamage } from '../../systems/equipmentStats';
import { startTimer, endTimer } from '../../utils/performanceMonitor';

/**
 * Extract icon string from skill icon (handles React components)
 */
function getSkillIconString(skill: SkillGem | undefined): string {
  if (!skill) return '⚡';
  
  // If icon is already a string, use it
  if (typeof skill.icon === 'string') {
    return skill.icon;
  }
  
  // For React components, use skill name or ID to determine emoji
  // This is a fallback mapping for common skills
  const iconMap: Record<string, string> = {
    'fireball': '🔥',
    'ice_bolt': '❄️',
    'lightning_bolt': '⚡',
    'soul_siphon': '💀',
    'blow_up': '💥',
    'healing_wave': '💚',
    'massive_heal': '💚',
    'rejuvenation': '🌿',
    'pain_suppression': '🛡️',
    'shield_slam': '🛡️',
    'thunder_clap': '⚡',
    'defensive_stance': '🛡️',
    'shield_block': '🛡️'
  };
  
  return iconMap[skill.id] || iconMap[skill.name.toLowerCase().replace(/\s+/g, '_')] || '⚡';
}

/**
 * Safely set health value, preventing NaN
 */
function safeSetHealth(entity: { health: number; maxHealth: number }, newHealth: number): number {
  const safeMaxHealth = (entity.maxHealth && !isNaN(entity.maxHealth) && entity.maxHealth > 0) ? entity.maxHealth : 1000;
  const safeNewHealth = isNaN(newHealth) || !isFinite(newHealth) ? safeMaxHealth : Math.max(0, Math.min(safeMaxHealth, newHealth));
  entity.health = safeNewHealth;
  return safeNewHealth;
}

/**
 * Safely set enemy health value, preventing NaN
 */
function safeSetEnemyHealth(enemy: { health: number; maxHealth: number }, newHealth: number): number {
  const safeMaxHealth = (enemy.maxHealth && !isNaN(enemy.maxHealth) && enemy.maxHealth > 0) ? enemy.maxHealth : 1000;
  const safeNewHealth = isNaN(newHealth) || !isFinite(newHealth) ? safeMaxHealth : Math.max(0, Math.min(safeMaxHealth, newHealth));
  enemy.health = safeNewHealth;
  return safeNewHealth;
}

/**
 * Map damage types to supported types for calculatePlayerDamageToEnemy
 */
function mapDamageType(damageType: string): 'physical' | 'fire' | 'cold' | 'lightning' | 'chaos' | 'shadow' | 'holy' {
  // Map unsupported types to supported ones
  if (damageType === 'nature') return 'chaos'; // Nature damage -> chaos
  if (damageType === 'arcane') return 'shadow'; // Arcane damage -> shadow
  if (damageType === 'mixed') return 'physical'; // Mixed damage -> physical as fallback
  
  // Return as-is if already supported
  const supportedTypes: ('physical' | 'fire' | 'cold' | 'lightning' | 'chaos' | 'shadow' | 'holy')[] = 
    ['physical', 'fire', 'cold', 'lightning', 'chaos', 'shadow', 'holy'];
  if (supportedTypes.includes(damageType as any)) {
    return damageType as 'physical' | 'fire' | 'cold' | 'lightning' | 'chaos' | 'shadow' | 'holy';
  }
  
  // Default fallback
  return 'physical';
}

/**
 * Update weapon damage for dual wielding (alternates between weapons)
 * This should be called before calculating damage for attack skills
 * Returns the weapon slot that was used ('mainHand' or 'offHand')
 */
function updateWeaponDamageForDualWielding(
  member: TeamMemberState,
  inventory: import('../../types/items').Item[],
  char: Character
): 'mainHand' | 'offHand' | null {
  if (!member.isDualWielding) return null;
  
  // Get equipped items for this character
  const equippedItems: import('../../types/items').Item[] = [];
  for (const [, itemId] of Object.entries(char.equippedGear)) {
    if (itemId) {
      const item = inventory.find(i => i.id === itemId);
      if (item) {
        equippedItems.push(item);
      }
    }
  }
  
  // Get weapon damage for the next weapon (alternates based on lastWeaponUsed)
  // getEquippedWeaponDamage will use mainHand if lastWeaponUsed is null or 'offHand'
  // and will use offHand if lastWeaponUsed is 'mainHand'
  const newWeaponDamage = getEquippedWeaponDamage(equippedItems, member.lastWeaponUsed || null);
  
  if (newWeaponDamage) {
    member.weaponDamage = newWeaponDamage;
    
    // Determine which weapon was just used and update lastWeaponUsed
    // If lastWeaponUsed was null or 'offHand', we just used mainHand
    // If lastWeaponUsed was 'mainHand', we just used offHand
    const weaponJustUsed: 'mainHand' | 'offHand' = 
      (member.lastWeaponUsed === null || member.lastWeaponUsed === 'offHand') ? 'mainHand' : 'offHand';
    member.lastWeaponUsed = weaponJustUsed;
    return weaponJustUsed;
  }
  
  return null;
}

/**
 * Calculate damage for a skill based on whether it's an attack (uses weapon) or spell (uses skill base damage)
 * Now includes support gem application
 */
/**
 * Calculate level-based damage scaling
 * Skills start at 40% power at level 1, scaling linearly to 100% at level 90
 */
function getLevelScaling(characterLevel: number): number {
  const minLevel = 1;
  const maxLevel = 90;
  const minScaling = 0.4; // 40% damage at level 1
  const maxScaling = 1.0; // 100% damage at level 90
  
  // Clamp level between min and max
  const level = Math.max(minLevel, Math.min(maxLevel, characterLevel));
  
  // Linear interpolation
  const progress = (level - minLevel) / (maxLevel - minLevel);
  return minScaling + (maxScaling - minScaling) * progress;
}

function calculateSkillDamage(
  skill: SkillGem,
  member: TeamMemberState,
  char: { baseStats?: Partial<import('../../types/character').BaseStats>, equippedGear?: Record<string, string | null>, equippedItems?: Record<string, import('../../types/items').Item | null>, id?: string, level?: number },
  bloodlustActive: boolean,
  supportGemIds: string[] = [],
  context?: { inventory?: import('../../types/items').Item[]; mapAffixEffects?: import('./types').MapAffixEffects }
): { damage: number; damageType: 'physical' | 'fire' | 'cold' | 'lightning' | 'chaos' | 'shadow' | 'holy' | 'mixed'; supportResult?: ReturnType<typeof applySupportGems> } {
  // Apply support gems
  const supportResult = applySupportGems(skill, supportGemIds);

  const isAttackSkill = skill.tags?.includes('attack');
  const spellPowerMultiplier = (skill.damageEffectiveness || 100) / 100;

  if (isAttackSkill) {
    // Ensure weapon damage is available - try to retrieve it if missing
    if (!member.weaponDamage) {
      const equippedItems: import('../../types/items').Item[] = [];

      // First, check equippedItems (contains full item objects directly)
      if (char.equippedItems) {
        for (const [, item] of Object.entries(char.equippedItems)) {
          if (item) {
            equippedItems.push(item);
          }
        }
      }

      // Fallback: check equippedGear with inventory lookup (legacy path)
      if (equippedItems.length === 0 && context?.inventory && char.equippedGear) {
        for (const [, itemId] of Object.entries(char.equippedGear)) {
          if (itemId) {
            const item = context.inventory.find(i => i.id === itemId);
            if (item) {
              equippedItems.push(item);
            }
          }
        }
      }

      const weaponDamage = getEquippedWeaponDamage(equippedItems, member.lastWeaponUsed || null);
      if (weaponDamage) {
        member.weaponDamage = weaponDamage;
      }
    }
    
    // If no weapon damage at all, use fallback calculation
    if (!member.weaponDamage) {
      // Attack skill but no weapon equipped or weapon has no damage - use fallback based on stats
      const strength = char.baseStats?.strength || 20;
      const dexterity = char.baseStats?.dexterity || 20;
      const strengthBonus = 1 + (strength / 200);
      const dexterityBonus = 1 + (dexterity / 200);
      // Fallback base damage for attacks without weapon damage
      const fallbackBaseDamage = 30 + Math.floor((strength + dexterity) / 4);
      const talentDamageMultiplier = 1 + ((member.talentBonuses?.damageMultiplier || 0) / 100);
      let damage = Math.floor(fallbackBaseDamage * spellPowerMultiplier * strengthBonus * dexterityBonus * talentDamageMultiplier * (bloodlustActive ? 1.3 : 1) * supportResult.damageMultiplier);
      damage += supportResult.addedDamage;
      
      const damageType = (skill.damageType || 'physical') as 'physical' | 'fire' | 'cold' | 'lightning' | 'chaos' | 'shadow' | 'holy' | 'mixed';
      return { damage, damageType, supportResult };
    }
    
    // Attack skill - use weapon damage
    const weapon = member.weaponDamage;
    
    // Calculate physical damage from weapon (use average of min/max)
    const physMin = weapon.physicalMin;
    const physMax = weapon.physicalMax;
    const physDamage = (physMin + physMax) / 2;
    
    // Calculate elemental damage from weapon (use average of min/max)
    const fireDamage = (weapon.fireMin + weapon.fireMax) / 2;
    const coldDamage = (weapon.coldMin + weapon.coldMax) / 2;
    const lightningDamage = (weapon.lightningMin + weapon.lightningMax) / 2;
    const chaosDamage = (weapon.chaosMin + weapon.chaosMax) / 2;
    
    // Total weapon damage - sum of all damage types
    const totalWeaponDamage = physDamage + fireDamage + coldDamage + lightningDamage + chaosDamage;
    
    // If weapon damage is 0 or very low, use fallback calculation
    // This can happen if the weapon item doesn't have proper damage properties
    if (totalWeaponDamage <= 0) {
      // Attack skill but weapon has no damage - use fallback based on stats
      const strength = char.baseStats?.strength || 20;
      const dexterity = char.baseStats?.dexterity || 20;
      const strengthBonus = 1 + (strength / 200);
      const dexterityBonus = 1 + (dexterity / 200);
      // Fallback base damage for attacks without weapon damage
      const fallbackBaseDamage = 30 + Math.floor((strength + dexterity) / 4);
      const talentDamageMultiplier = 1 + ((member.talentBonuses?.damageMultiplier || 0) / 100);
      let damage = Math.floor(fallbackBaseDamage * spellPowerMultiplier * strengthBonus * dexterityBonus * talentDamageMultiplier * (bloodlustActive ? 1.3 : 1) * supportResult.damageMultiplier);
      damage += supportResult.addedDamage;
      
      // Apply map affix player damage reduction
      const playerDamageReduction = context?.mapAffixEffects?.playerDamageReduction || 0;
      damage = Math.floor(damage * (1 + playerDamageReduction));
      
      const damageType = (skill.damageType || 'physical') as 'physical' | 'fire' | 'cold' | 'lightning' | 'chaos' | 'shadow' | 'holy' | 'mixed';
      return { damage, damageType, supportResult };
    }
      
      // Apply skill's damage effectiveness (this is the skill's damage multiplier)
      // For attack skills, this typically represents how much of the weapon damage is used
      const strength = char.baseStats?.strength || 20;
      const dexterity = char.baseStats?.dexterity || 20;
      const strengthBonus = 1 + (strength / 200); // +0.5% damage per point of strength
      const dexterityBonus = 1 + (dexterity / 200); // +0.5% damage per point of dexterity
      
      // Apply talent damage multiplier
      const talentDamageMultiplier = 1 + ((member.talentBonuses?.damageMultiplier || 0) / 100);
      
      // Apply increased damage from equipment
      const gearIncreasedDamage = char.baseStats?.increasedDamage || 0;
      const increasedDamageMultiplier = 1 + (gearIncreasedDamage / 100);
      
      // Apply level scaling if skill has it enabled (primarily for melee skills)
      const levelScalingMultiplier = skill.levelScaling ? getLevelScaling(char.level || 1) : 1.0;
      
      // Attack skills use ONLY weapon damage (PoE style - no flat base damage)
      // Damage effectiveness determines what percentage of weapon damage is used
      // PoE attack skills have effectiveness ranging from ~30% (AoE/channeled) to ~500%+ (powerful single-target)
      let baseDamage = totalWeaponDamage * spellPowerMultiplier;
      
      // Apply level scaling (for skills that have it enabled)
      baseDamage *= levelScalingMultiplier;
      
      // Apply attribute bonuses (strength and dexterity both help with attack damage)
      baseDamage *= strengthBonus * dexterityBonus;
      
      // Apply increased damage from gear (additive with other increased modifiers)
      baseDamage *= increasedDamageMultiplier;
      
      // Apply talent and support gem multipliers
      baseDamage *= talentDamageMultiplier * supportResult.damageMultiplier;
      
      // Apply bloodlust bonus if active
      if (bloodlustActive) {
        baseDamage *= 1.3;
      }
      
      // Round down and add flat damage from support gems
      let damage = Math.floor(baseDamage);
      damage += supportResult.addedDamage;
      
      // Ensure minimum damage (weapon should always contribute meaningful damage)
      // If after all multipliers the damage is still very low, ensure it's at least reasonable
      // This handles edge cases where weapon damage might be very low or effectiveness is very low
      // Minimum should be at least 30% of average weapon damage, or 1, whichever is higher
      const minDamageFromWeapon = Math.max(1, Math.floor(totalWeaponDamage * 0.3));
      if (damage < minDamageFromWeapon) {
        damage = minDamageFromWeapon;
      }
      
      // Determine primary damage type based on which damage type is highest
      const maxEle = Math.max(fireDamage, coldDamage, lightningDamage, chaosDamage);
      let damageType: 'physical' | 'fire' | 'cold' | 'lightning' | 'chaos' | 'mixed' = 'physical';
      
      // If elemental damage is higher than physical, use that element
      if (maxEle > physDamage) {
        if (maxEle === fireDamage) damageType = 'fire';
        else if (maxEle === coldDamage) damageType = 'cold';
        else if (maxEle === lightningDamage) damageType = 'lightning';
        else if (maxEle === chaosDamage) damageType = 'chaos';
      }
      
      // If there's significant mixed elemental damage, use mixed type
      const totalElemental = fireDamage + coldDamage + lightningDamage + chaosDamage;
      if (totalElemental > physDamage && maxEle < totalWeaponDamage / 2) {
        damageType = 'mixed';
      }
      
      // If skill has a specific damage type override, use that instead
      if (skill.damageType && skill.damageType !== 'physical') {
        damageType = skill.damageType as 'fire' | 'cold' | 'lightning' | 'chaos' | 'mixed';
      }
      
      // Apply map affix player damage reduction
      const playerDamageReduction = context?.mapAffixEffects?.playerDamageReduction || 0;
      damage = Math.floor(damage * (1 + playerDamageReduction));
      
      return { damage, damageType, supportResult };
  } else {
    // Spell skill - use skill's base damage
    // Reduced spell power scaling: int * 2.5 instead of * 5 (40-50 spell power at level 1 instead of 100)
    const spellPower = (char.baseStats?.intelligence || 20) * 2.5;
    // Reduced base damage fallback from 150 to 50
    // Apply Empower support level bonus (each level adds ~10% more base damage)
    const empowerBonus = 1 + (supportResult.levelBonus * 0.1);
    let baseDmg = (skill.baseDamage || 50) * empowerBonus;
    
    // Add flat spell damage from equipment (PoE style: "Adds X to Y Fire Damage to Spells")
    // Get the appropriate damage type based on skill
    const skillDamageType = skill.damageType === 'nature' ? 'physical' : (skill.damageType || 'physical');
    let flatSpellDamage = 0;
    
    // Add flat damage matching the skill's damage type
    if (skillDamageType === 'physical') {
      const min = char.baseStats?.addedPhysicalSpellDamageMin || 0;
      const max = char.baseStats?.addedPhysicalSpellDamageMax || 0;
      flatSpellDamage = (min + max) / 2;
    } else if (skillDamageType === 'fire') {
      const min = char.baseStats?.addedFireSpellDamageMin || 0;
      const max = char.baseStats?.addedFireSpellDamageMax || 0;
      flatSpellDamage = (min + max) / 2;
    } else if (skillDamageType === 'cold') {
      const min = char.baseStats?.addedColdSpellDamageMin || 0;
      const max = char.baseStats?.addedColdSpellDamageMax || 0;
      flatSpellDamage = (min + max) / 2;
    } else if (skillDamageType === 'lightning') {
      const min = char.baseStats?.addedLightningSpellDamageMin || 0;
      const max = char.baseStats?.addedLightningSpellDamageMax || 0;
      flatSpellDamage = (min + max) / 2;
    } else if (skillDamageType === 'chaos' || skillDamageType === 'arcane') {
      // Chaos and arcane skills use chaos damage
      const min = char.baseStats?.addedChaosSpellDamageMin || 0;
      const max = char.baseStats?.addedChaosSpellDamageMax || 0;
      flatSpellDamage = (min + max) / 2;
    } else if (skillDamageType === 'holy') {
      // Holy skills use fire damage as a fallback
      const min = char.baseStats?.addedFireSpellDamageMin || 0;
      const max = char.baseStats?.addedFireSpellDamageMax || 0;
      flatSpellDamage = (min + max) / 2;
    }
    
    // Add flat spell damage to base damage (before multipliers)
    baseDmg += flatSpellDamage;
    
    // Apply talent damage multiplier
    const talentDamageMultiplier = 1 + ((member.talentBonuses?.damageMultiplier || 0) / 100);
    // Apply increased damage from equipment
    const gearIncreasedDamage = char.baseStats?.increasedDamage || 0;
    const increasedDamageMultiplier = 1 + (gearIncreasedDamage / 100);
    // Reduced spell power effectiveness: divide by 200 instead of 100 for gentler scaling
    // Apply support gem damage multiplier and increased damage from gear
    let damage = Math.floor(baseDmg * (1 + (spellPower * spellPowerMultiplier) / 200) * increasedDamageMultiplier * talentDamageMultiplier * (bloodlustActive ? 1.3 : 1) * supportResult.damageMultiplier);
    // Add flat damage from support gems
    damage += supportResult.addedDamage;
    
    // Apply map affix player damage reduction
    const playerDamageReduction = context?.mapAffixEffects?.playerDamageReduction || 0;
    damage = Math.floor(damage * (1 + playerDamageReduction));
    
    const damageType = skill.damageType === 'nature' ? 'physical' : (skill.damageType || 'physical') as 'physical' | 'fire' | 'cold' | 'lightning' | 'chaos' | 'shadow' | 'holy' | 'mixed';
    return { damage, damageType, supportResult };
  }
}

/**
 * Apply lifesteal after dealing damage
 */
function applyLifesteal(
  member: TeamMemberState,
  damageDealt: number,
  floatNumbers: FloatingNumber[],
  currentCombatState: { teamPosition: { x: number; y: number } }
): void {
  const lifestealPercent = member.talentBonuses?.lifesteal || 0;
  if (lifestealPercent > 0 && damageDealt > 0) {
    let lifestealAmount = Math.floor(damageDealt * (lifestealPercent / 100));
    if (lifestealAmount > 0) {
      // Apply heal absorb shield if present
      if (member.healAbsorb && member.healAbsorb > 0) {
        if (lifestealAmount <= member.healAbsorb) {
          // All healing absorbed
          member.healAbsorb -= lifestealAmount;
          lifestealAmount = 0;
        } else {
          // Partial absorption
          lifestealAmount -= member.healAbsorb;
          member.healAbsorb = 0;
        }
      }
      
      if (lifestealAmount > 0) {
        const safeCurrentHealth = isNaN(member.health) || !isFinite(member.health) ? member.maxHealth : member.health;
        const safeLifestealAmount = isNaN(lifestealAmount) || !isFinite(lifestealAmount) ? 0 : lifestealAmount;
        safeSetHealth(member, safeCurrentHealth + safeLifestealAmount);
        const jitterX = (Math.random() * 80) - 40;
        const jitterY = (Math.random() * 60) - 30;
        floatNumbers.push(createFloatingNumber(lifestealAmount, 'heal', currentCombatState.teamPosition.x + jitterX, currentCombatState.teamPosition.y - 40 + jitterY));
      }
    }
  }
}

/**
 * Process all player actions for one tick
 * 
 * GCD Rules:
 * - GCD (10 ticks / 1 second) starts when a spell/ability STARTS casting
 * - If cast time < GCD, player waits for GCD to expire before next cast
 * - If cast time >= GCD, player can immediately start next cast when current finishes
 * - Each player has their own independent GCD
 */
export function processPlayerActions(
  context: CombatContext,
  teamStates: TeamMemberState[],
  _currentEnemies: AnimatedEnemy[],
  tickAliveEnemies: AnimatedEnemy[],
  currentTick: number
): { dpsFloatNumbers: FloatingNumber[]; dpsLogEntries: CombatLogEntry[] } {
  if (currentTick % 10 === 0) {
    const aliveMembers = teamStates.filter(m => !m.isDead);
    console.log(`[PlayerCombat] Processing player actions at tick ${currentTick} - Team: ${aliveMembers.length}/${teamStates.length} alive, Targets: ${tickAliveEnemies.length} enemies`);
  }
  const { team, bloodlustActive, healerCooldowns, tankCooldowns } = context;
  
  // Process healer healing
  processHealerHealing(context, teamStates, healerCooldowns, bloodlustActive, currentTick);
  
  const dpsFloatNumbers: FloatingNumber[] = [];
  const dpsLogEntries: CombatLogEntry[] = [];
  
  // Process each team member
  team.forEach((char) => {
    const member = teamStates.find(m => m.id === char.id);
    if (!member || member.isDead) return;
    
    if (char.role === 'healer') {
      // Healer handled above, but check if they should also DPS
      if (member.isCasting) return;
      const hurtMembers = teamStates.filter(m => !m.isDead && m.health < m.maxHealth * 0.95);
      if (hurtMembers.length > 0) return;
    }
    
    if (char.role === 'dps') {
      const result = processDpsActions(context, char, member, teamStates, tickAliveEnemies, bloodlustActive, currentTick);
      if (result) {
        dpsFloatNumbers.push(...result.floatNumbers);
        dpsLogEntries.push(...result.logEntries);
      }
      return;
    }
    
    if (char.role === 'tank') {
      processTankActions(context, char, member, teamStates, tickAliveEnemies, tankCooldowns, bloodlustActive, currentTick);
      return;
    }
    
    // Healer auto-attack (when no healing needed)
    processHealerAutoAttack(context, char, member, teamStates, tickAliveEnemies, bloodlustActive, currentTick);
  });
  
  return { dpsFloatNumbers, dpsLogEntries };
}

/**
 * Check if entity can start a new action (no GCD - uses attack/cast speed instead)
 * @param isHealingSpell - If true, allows casting even when silenced (healing spells bypass silence)
 */
function canStartAction(member: TeamMemberState, _currentTick: number, isHealingSpell: boolean = false): boolean {
  // Can't act while casting
  if (member.isCasting) return false;
  // Can't act while channeling
  if (member.isChanneling) return false;
  // Check if silenced - healers can still cast healing spells when silenced
  if (member.canCastSpells === false && !isHealingSpell) return false;
  return true;
}

/**
 * Start a cast (no GCD - cast/attack speed determines when next action can occur)
 */
function startCast(member: TeamMemberState, castTimeTicks: number, currentTick: number, bloodlustActive: boolean, targetId?: string, abilityName?: string): void {
  // Apply haste to cast time
  const hastedCastTicks = getHastedTicks(castTimeTicks, bloodlustActive);
  
  member.isCasting = true;
  member.castStartTick = currentTick;
  member.castEndTick = currentTick + hastedCastTicks;
  member.castTotalTicks = hastedCastTicks;
  member.castTargetId = targetId;
  member.castAbility = abilityName;
  
  // Set real-time values for smooth UI animation
  member.castStartTime = Date.now();
  member.castTotalTime = hastedCastTicks / TICKS_PER_SECOND;
}

/**
 * Check if a cast is complete
 */
function isCastComplete(member: TeamMemberState, currentTick: number): boolean {
  if (!member.isCasting) return false;
  if (!member.castEndTick) return false;
  return currentTick >= member.castEndTick;
}

function processHealerHealing(
  context: CombatContext,
  teamStates: TeamMemberState[],
  healerCooldowns: { painSuppressionEndTick: number },
  bloodlustActive: boolean,
  currentTick: number
): void {
  const { team, totalTime, updateCombatState, currentCombatState, setScreenShake } = context;
  const currentHealer = teamStates.find(m => m.role === 'healer' && !m.isDead);
  if (!currentHealer) return;
  
  const healerChar = team.find(c => c.id === currentHealer.id);
  const spellPower = (healerChar?.baseStats?.intelligence || 20) * 5;
  
  // Check if current cast is complete
  if (currentHealer.isCasting && isCastComplete(currentHealer, currentTick)) {
    // Get the skill to check if it's an AoE heal
    const abilityName = currentHealer.castAbility || 'Healing Wave';
    const skillId = getSkillIdFromAbilityName(abilityName);
    const skill = skillId ? getSkillGemById(skillId) : undefined;
    
    // For AoE heals (allAllies), don't check for a specific target
    const isAoEHeal = skill?.targetType === 'allAllies';
    const castTarget = !isAoEHeal ? teamStates.find(m => m.id === currentHealer.castTargetId) : null;
    
    // Only cancel if it's a single-target heal and the target died
    if (!isAoEHeal && (!castTarget || castTarget.isDead)) {
      // Target died, cancel cast - clear all cast-related fields
      currentHealer.isCasting = false;
      currentHealer.castTargetId = undefined;
      currentHealer.castAbility = undefined;
      currentHealer.castStartTick = undefined;
      currentHealer.castEndTick = undefined;
      currentHealer.castTotalTicks = undefined;
      currentHealer.castStartTime = undefined;
      currentHealer.castTotalTime = undefined;
      updateCombatState(prev => ({ 
        ...prev, 
        combatLog: [...prev.combatLog, { 
          timestamp: totalTime, 
          type: 'ability', 
          source: currentHealer.name, 
          target: '', 
          message: `❌ ${currentHealer.name}'s heal was cancelled - target died!` 
        }] 
      }));
    } else {
      // Cast complete - apply skill effect
      const abilityName = currentHealer.castAbility || 'Healing Wave';
      const skillId = getSkillIdFromAbilityName(abilityName);
      const skill = skillId ? getSkillGemById(skillId) : undefined;
      
      if (!skill) return;
      
      // Get support gem IDs for this skill
      const equippedSkill = healerChar?.skillGems?.find(sg => sg.skillGemId === skillId);
      const supportGemIds = equippedSkill?.supportGemIds || [];
      
      // Apply support gems
      const supportResult = applySupportGems(skill, supportGemIds);
      
      // Get alive team members for allAllies skills
      const aliveTeamForHeal = teamStates.filter(m => !m.isDead);
      
      // Apply talent mana cost reduction and support gem mana cost multiplier
      const talentManaCostReduction = currentHealer.talentBonuses?.manaCostReduction || 0;
      const baseManaCost = skill.manaCost * supportResult.manaCostMultiplier;
      const effectiveManaCost = Math.max(0, baseManaCost * (1 - talentManaCostReduction / 100));
      
      // Check if lifetap is active (manaCostMultiplier = 0 means lifetap)
      const hasLifetap = supportResult.manaCostMultiplier === 0;
      
      // Check resource availability (mana or life for lifetap)
      const hasResources = hasLifetap 
        ? (currentHealer.health > effectiveManaCost) 
        : (currentHealer.mana >= effectiveManaCost);
      
      if (skill.baseHealing && hasResources) {
        const spellPowerMultiplier = (skill.damageEffectiveness || 100) / 100;
        const baseHeal = skill.baseHealing || 100;
        // Apply talent healing multiplier and support gem healing multiplier
        const talentHealingMultiplier = 1 + ((currentHealer.talentBonuses?.healingMultiplier || 0) / 100);
        let healAmount = Math.floor(baseHeal * (1 + (spellPower * spellPowerMultiplier) / 100) * talentHealingMultiplier * supportResult.healingMultiplier);
        // Add flat healing from support gems
        healAmount += supportResult.addedHealing;
        const baseCritChance = skill.baseCriticalStrikeChance || 8;
        const increasedCritChance = healerChar?.baseStats?.criticalStrikeChance || 0;
        // Apply support gem crit chance multiplier
        const finalCritChance = calculateCriticalStrikeChance(baseCritChance, increasedCritChance) * supportResult.critChanceMultiplier;
        const isCritHeal = Math.random() < (finalCritChance / 100);
        const critMultiplier = (healerChar?.baseStats?.criticalStrikeMultiplier || 150) / 100;
        let finalHealAmount = isCritHeal ? Math.floor(healAmount * critMultiplier) : healAmount;
        
        // Handle allAllies target type (Circle of Healing, etc.)
        if (skill.targetType === 'allAllies') {
          const floatNumbers: FloatingNumber[] = [];
          let totalHealing = 0;
          const healTimestamp = Date.now();
          
          // Heal all alive team members
          aliveTeamForHeal.forEach(target => {
            if (target.isDead) return;
            
            let targetHealAmount = finalHealAmount;
            
            // Apply heal absorb shield if present
            if (target.healAbsorb && target.healAbsorb > 0) {
              if (targetHealAmount <= target.healAbsorb) {
                target.healAbsorb -= targetHealAmount;
                targetHealAmount = 0;
              } else {
                targetHealAmount -= target.healAbsorb;
                target.healAbsorb = 0;
              }
            }
            
            const actualHeal = Math.min(target.maxHealth - target.health, targetHealAmount);
            const safeCurrentHealth = isNaN(target.health) || !isFinite(target.health) ? target.maxHealth : target.health;
            const safeFinalHealAmount = isNaN(targetHealAmount) || !isFinite(targetHealAmount) ? 0 : targetHealAmount;
            safeSetHealth(target, safeCurrentHealth + safeFinalHealAmount);
            
            if (actualHeal > 0) {
              target.lastHealTime = healTimestamp;
              target.lastHealAmount = actualHeal;
              target.lastHealCrit = isCritHeal;
              totalHealing += actualHeal;
              
              // Process onHeal effects
              processOnHealEffects(currentHealer, target, targetHealAmount, currentTick, teamStates);
              
              // Create floating number for each target
              const jitterX = (Math.random() * 80) - 40;
              const jitterY = (Math.random() * 60) - 30;
              floatNumbers.push(createFloatingNumber(healAmount, 'heal', currentCombatState.teamPosition.x + jitterX, currentCombatState.teamPosition.y - 50 + jitterY));
            }
          });
          
          if (isCritHeal) setScreenShake(prev => prev + 1);
          
          // Pay resource cost (mana or life for lifetap)
          if (hasLifetap) {
            const safeCurrentHealth = isNaN(currentHealer.health) || !isFinite(currentHealer.health) ? currentHealer.maxHealth : currentHealer.health;
            const safeLifeCost = isNaN(effectiveManaCost) || !isFinite(effectiveManaCost) ? 0 : Math.min(effectiveManaCost, safeCurrentHealth - 1);
            safeSetHealth(currentHealer, safeCurrentHealth - safeLifeCost);
            updateCombatState(prev => ({ 
              ...prev, 
              combatLog: [...prev.combatLog, { 
                timestamp: totalTime, 
                type: 'system', 
                source: currentHealer.name, 
                target: '', 
                message: `💉 ${currentHealer.name} pays ${safeLifeCost} life to cast ${abilityName}` 
              }] 
            }));
          } else {
            currentHealer.mana -= effectiveManaCost;
          }
          
          currentHealer.totalHealing = (currentHealer.totalHealing || 0) + totalHealing;
          currentHealer.healingBySpell = currentHealer.healingBySpell || {};
          currentHealer.healingBySpell[abilityName] = (currentHealer.healingBySpell[abilityName] || 0) + totalHealing;
          
          updateCombatState(prev => ({ 
            ...prev, 
            teamStates: prev.teamStates.map(m => {
              const updatedMember = aliveTeamForHeal.find(t => t.id === m.id);
              if (updatedMember && updatedMember.lastHealTime === healTimestamp) {
                return { 
                  ...m, 
                  lastHealTime: updatedMember.lastHealTime, 
                  lastHealAmount: updatedMember.lastHealAmount, 
                  lastHealCrit: updatedMember.lastHealCrit, 
                  health: updatedMember.health 
                };
              }
              if (m.id === currentHealer.id) {
                return { ...m, mana: currentHealer.mana, totalHealing: currentHealer.totalHealing, healingBySpell: currentHealer.healingBySpell };
              }
              return m;
            }),
            floatingNumbers: [...prev.floatingNumbers.slice(-20), ...floatNumbers],
            combatLog: [...prev.combatLog, { 
              timestamp: totalTime, 
              type: 'heal', 
              source: currentHealer.name, 
              target: 'all allies', 
              message: `${getSkillIconString(skill)} ${currentHealer.name} casts ${abilityName} on all allies! (${totalHealing} total healing${isCritHeal ? ' CRIT!' : ''})` 
            }] 
          }));
          
          // Spell Echo for allAllies healing spells
          if (supportResult?.hasSpellEcho && skill.tags?.includes('spell')) {
            const echoHealAmount = Math.floor(finalHealAmount * 0.8); // Echo does 80% healing
            let echoTotalHealing = 0;
            const echoHealTimestamp = Date.now();
            
            aliveTeamForHeal.forEach(target => {
              if (target.isDead) return;
              
              let echoTargetHealAmount = echoHealAmount;
              
              // Apply heal absorb shield if present
              if (target.healAbsorb && target.healAbsorb > 0) {
                if (echoTargetHealAmount <= target.healAbsorb) {
                  target.healAbsorb -= echoTargetHealAmount;
                  echoTargetHealAmount = 0;
                } else {
                  echoTargetHealAmount -= target.healAbsorb;
                  target.healAbsorb = 0;
                }
              }
              
              const echoActualHeal = Math.min(target.maxHealth - target.health, echoTargetHealAmount);
              const safeCurrentHealth = isNaN(target.health) || !isFinite(target.health) ? target.maxHealth : target.health;
              const safeEchoHealAmount = isNaN(echoTargetHealAmount) || !isFinite(echoTargetHealAmount) ? 0 : echoTargetHealAmount;
              safeSetHealth(target, safeCurrentHealth + safeEchoHealAmount);
              
              if (echoActualHeal > 0) {
                target.lastHealTime = echoHealTimestamp;
                target.lastHealAmount = echoActualHeal;
                target.lastHealCrit = false; // Echo doesn't crit
                echoTotalHealing += echoActualHeal;
                
                processOnHealEffects(currentHealer, target, echoTargetHealAmount, currentTick, teamStates);
                
                const jitterX = (Math.random() * 80) - 40;
                const jitterY = (Math.random() * 60) - 30;
                floatNumbers.push(createFloatingNumber(echoHealAmount, 'heal', currentCombatState.teamPosition.x + jitterX + 15, currentCombatState.teamPosition.y - 50 + jitterY));
              }
            });
            
            if (echoTotalHealing > 0) {
              currentHealer.totalHealing = (currentHealer.totalHealing || 0) + echoTotalHealing;
              currentHealer.healingBySpell[abilityName] = (currentHealer.healingBySpell[abilityName] || 0) + echoTotalHealing;
              updateCombatState(prev => ({ 
                ...prev, 
                combatLog: [...prev.combatLog, { 
                  timestamp: totalTime, 
                  type: 'heal', 
                  source: currentHealer.name, 
                  target: 'all allies', 
                  message: `⟳ ${currentHealer.name}'s ${abilityName} echoes on all allies! (${echoTotalHealing} total healing)` 
                }] 
              }));
            }
          }
        } else if (castTarget) {
          // Single target heal (original logic)
          // Apply heal absorb shield if present
          if (castTarget.healAbsorb && castTarget.healAbsorb > 0) {
            if (finalHealAmount <= castTarget.healAbsorb) {
              // All healing absorbed
              castTarget.healAbsorb -= finalHealAmount;
              finalHealAmount = 0;
            } else {
              // Partial absorption
              finalHealAmount -= castTarget.healAbsorb;
              castTarget.healAbsorb = 0;
            }
          }
          
          // Capture state before healing
          const healthBefore = castTarget.health;
          
          const actualHeal = Math.min(castTarget.maxHealth - castTarget.health, finalHealAmount);
          const safeCurrentHealth = isNaN(castTarget.health) || !isFinite(castTarget.health) ? castTarget.maxHealth : castTarget.health;
          const safeFinalHealAmount = isNaN(finalHealAmount) || !isFinite(finalHealAmount) ? 0 : finalHealAmount;
          safeSetHealth(castTarget, safeCurrentHealth + safeFinalHealAmount);
          
          // Capture state after healing
          const healthAfter = castTarget.health;
          
          const healTimestamp = Date.now();
          castTarget.lastHealTime = healTimestamp;
          castTarget.lastHealAmount = actualHeal;
          castTarget.lastHealCrit = isCritHeal;
          if (isCritHeal) setScreenShake(prev => prev + 1);
          
          // Pay resource cost (mana or life for lifetap)
          const hasLifetap = supportResult.manaCostMultiplier === 0;
          if (hasLifetap) {
            const safeCurrentHealth = isNaN(currentHealer.health) || !isFinite(currentHealer.health) ? currentHealer.maxHealth : currentHealer.health;
            const safeLifeCost = isNaN(effectiveManaCost) || !isFinite(effectiveManaCost) ? 0 : Math.min(effectiveManaCost, safeCurrentHealth - 1);
            safeSetHealth(currentHealer, safeCurrentHealth - safeLifeCost);
            updateCombatState(prev => ({ 
              ...prev, 
              combatLog: [...prev.combatLog, { 
                timestamp: totalTime, 
                type: 'system', 
                source: currentHealer.name, 
                target: '', 
                message: `💉 ${currentHealer.name} pays ${safeLifeCost} life to cast ${abilityName}` 
              }] 
            }));
          } else {
            currentHealer.mana -= effectiveManaCost;
          }
          
          currentHealer.totalHealing = (currentHealer.totalHealing || 0) + actualHeal;
          currentHealer.healingBySpell = currentHealer.healingBySpell || {};
          currentHealer.healingBySpell[abilityName] = (currentHealer.healingBySpell[abilityName] || 0) + actualHeal;
          
          // Process onHeal effects
          processOnHealEffects(currentHealer, castTarget, finalHealAmount, currentTick, teamStates);
          
          const jitterX = (Math.random() * 80) - 40;
          const jitterY = (Math.random() * 60) - 30;
          const floatNum = createFloatingNumber(healAmount, 'heal', currentCombatState.teamPosition.x + jitterX, currentCombatState.teamPosition.y - 50 + jitterY);
          
          // Create verbose heal log with full stats
          const verboseHealLog = createVerboseHealLog(
            totalTime,
            currentHealer.name,
            castTarget.name,
            actualHeal,
            castTarget,
            {
              healthBefore,
              healthAfter,
              maxHealth: castTarget.maxHealth,
              crit: isCritHeal,
              abilityName,
              skillIcon: getSkillIconString(skill)
            },
            currentHealer, // sourceState
            teamStates, // allTeamStates
            currentCombatState?.enemies || [] // allEnemies
          );
          
          updateCombatState(prev => ({ 
            ...prev, 
            teamStates: prev.teamStates.map(m => 
              m.id === castTarget.id 
                ? { ...m, lastHealTime: healTimestamp, lastHealAmount: actualHeal, lastHealCrit: isCritHeal, health: castTarget.health }
                : m.id === currentHealer.id
                ? { ...m, mana: currentHealer.mana, totalHealing: currentHealer.totalHealing, healingBySpell: currentHealer.healingBySpell }
                : m
            ),
            floatingNumbers: [...prev.floatingNumbers.slice(-20), floatNum],
            combatLog: [...prev.combatLog, verboseHealLog] 
          }));
          
          // Spell Echo for single target healing spells
          if (supportResult?.hasSpellEcho && skill.tags?.includes('spell')) {
            const echoHealAmount = Math.floor(finalHealAmount * 0.8); // Echo does 80% healing
            let echoTargetHealAmount = echoHealAmount;
            
            // Apply heal absorb shield if present
            if (castTarget.healAbsorb && castTarget.healAbsorb > 0) {
              if (echoTargetHealAmount <= castTarget.healAbsorb) {
                castTarget.healAbsorb -= echoTargetHealAmount;
                echoTargetHealAmount = 0;
              } else {
                echoTargetHealAmount -= castTarget.healAbsorb;
                castTarget.healAbsorb = 0;
              }
            }
            
            const echoActualHeal = Math.min(castTarget.maxHealth - castTarget.health, echoTargetHealAmount);
            const safeCurrentHealth = isNaN(castTarget.health) || !isFinite(castTarget.health) ? castTarget.maxHealth : castTarget.health;
            const safeEchoHealAmount = isNaN(echoTargetHealAmount) || !isFinite(echoTargetHealAmount) ? 0 : echoTargetHealAmount;
            safeSetHealth(castTarget, safeCurrentHealth + safeEchoHealAmount);
            
            if (echoActualHeal > 0) {
              currentHealer.totalHealing = (currentHealer.totalHealing || 0) + echoActualHeal;
              currentHealer.healingBySpell[abilityName] = (currentHealer.healingBySpell[abilityName] || 0) + echoActualHeal;
              
              processOnHealEffects(currentHealer, castTarget, echoTargetHealAmount, currentTick, teamStates);
              
              const jitterX = (Math.random() * 80) - 40;
              const jitterY = (Math.random() * 60) - 30;
              const echoFloatNum = createFloatingNumber(echoHealAmount, 'heal', currentCombatState.teamPosition.x + jitterX + 15, currentCombatState.teamPosition.y - 50 + jitterY);
              updateCombatState(prev => ({ 
                ...prev, 
                floatingNumbers: [...prev.floatingNumbers.slice(-20), echoFloatNum],
                combatLog: [...prev.combatLog, { 
                  timestamp: totalTime, 
                  type: 'heal', 
                  source: currentHealer.name, 
                  target: castTarget.name, 
                  message: `⟳ ${currentHealer.name}'s ${abilityName} echoes on ${castTarget.name} for ${echoHealAmount}!` 
                }] 
              }));
            }
          }
        }
      }
      // Clear all cast-related fields when cast completes
      currentHealer.isCasting = false;
      currentHealer.castTargetId = undefined;
      currentHealer.castAbility = undefined;
      currentHealer.castStartTick = undefined;
      currentHealer.castEndTick = undefined;
      currentHealer.castTotalTicks = undefined;
      currentHealer.castStartTime = undefined;
      currentHealer.castTotalTime = undefined;
    }
  }
  
  // Check if healer can start a new action
  // Healing spells should be allowed even when silenced (silence only blocks offensive spells)
  if (!canStartAction(currentHealer, currentTick, true)) return;
  
  const aliveTeam = teamStates.filter(m => !m.isDead);
  const tank = aliveTeam.find(m => team.find(c => c.id === m.id)?.role === 'tank');
  const lowestAlly = aliveTeam.reduce((lowest, m) => 
    (m.health / m.maxHealth) < (lowest.health / lowest.maxHealth) ? m : lowest, 
    aliveTeam[0]
  );
  
  // Build healer skill list with configs
  const healerSkillsWithConfigs: { skill: SkillGem; config: SkillUsageConfig; equipped: any }[] = [];
  healerChar?.skillGems?.forEach((sg: any) => {
    const skill = getSkillGemById(sg.skillGemId);
    if (skill && (skill.baseHealing || skill.effects?.some((e: any) => e.type === 'damageReduction' || e.type === 'buffStat'))) {
      const config = sg.usageConfig || createSmartSkillConfig(sg.skillGemId);
      healerSkillsWithConfigs.push({ skill, config, equipped: sg });
    }
  });
  
  // Build context for condition checking
  const conditionContext = {
    enemyCount: 0,
    enemyTypes: [] as ('normal' | 'elite' | 'miniboss' | 'boss')[],
    selfHealthPercent: currentHealer.maxHealth > 0 ? (currentHealer.health / currentHealer.maxHealth) * 100 : 100,
    selfManaPercent: currentHealer.maxMana > 0 ? (currentHealer.mana / currentHealer.maxMana) * 100 : 100,
    tankHealthPercent: tank && tank.maxHealth > 0 ? (tank.health / tank.maxHealth) * 100 : 100,
    lowestAllyHealthPercent: lowestAlly && lowestAlly.maxHealth > 0 ? (lowestAlly.health / lowestAlly.maxHealth) * 100 : 100,
    partyHealthPercents: aliveTeam.map(m => m.maxHealth > 0 ? (m.health / m.maxHealth) * 100 : 100),
    isBloodlustActive: false,
    inCombat: true
  };
  
  // Sort by priority and check conditions
  const validHealerSkills = healerSkillsWithConfigs
    .filter(({ skill, config }) => {
      // Apply talent mana cost reduction
      const talentManaCostReduction = currentHealer.talentBonuses?.manaCostReduction || 0;
      const effectiveManaCost = Math.max(0, skill.manaCost * (1 - talentManaCostReduction / 100));
      
      if (currentHealer.mana < effectiveManaCost) return false;
      if (skill.id === 'pain_suppression' && currentTick < healerCooldowns.painSuppressionEndTick) return false;
      return checkSkillConditions(config, conditionContext);
    })
    .sort((a, b) => b.config.priority - a.config.priority);
  
  let selectedHealerSkill = validHealerSkills[0];
  
  // CRITICAL FALLBACK: If no skill is valid but someone needs healing, force heal with first available heal spell
  if (!selectedHealerSkill && conditionContext.lowestAllyHealthPercent < 95) {
    const firstHealSpell = healerSkillsWithConfigs.find(({ skill }) => {
      const talentManaCostReduction = currentHealer.talentBonuses?.manaCostReduction || 0;
      const effectiveManaCost = Math.max(0, skill.manaCost * (1 - talentManaCostReduction / 100));
      return skill.baseHealing && currentHealer.mana >= effectiveManaCost;
    });
    if (firstHealSpell) {
      selectedHealerSkill = firstHealSpell;
    }
  }
  
  // Use player-configured skill selection
  if (selectedHealerSkill) {
    const { skill, config } = selectedHealerSkill;
    const talentManaCostReduction = currentHealer.talentBonuses?.manaCostReduction || 0;
    const effectiveManaCost = Math.max(0, skill.manaCost * (1 - talentManaCostReduction / 100));
    
    // Handle instant skills (no cast time) vs cast skills
    if (skill.castTime === 0 || skill.castTime === undefined) {
      // Instant skill - apply immediately
      
      // Pain Suppression (buff)
      if (skill.id === 'pain_suppression') {
        if (currentTick >= healerCooldowns.painSuppressionEndTick) {
          const heavyDamageTarget = aliveTeam.find(m => 
            (m.recentDamageTaken || 0) > m.maxHealth * 0.15 && 
            !m.damageReduction
          );
          
          if (heavyDamageTarget && currentHealer.mana >= effectiveManaCost) {
            const damageReductionValue = skill.effects.find(e => e.type === 'damageReduction')?.value || 40;
            const durationSeconds = skill.effects.find(e => e.type === 'damageReduction')?.duration || 6;
            heavyDamageTarget.damageReduction = damageReductionValue;
            heavyDamageTarget.damageReductionEndTick = currentTick + secondsToTicks(durationSeconds);
            heavyDamageTarget.lastExternalTime = Date.now();
            heavyDamageTarget.lastExternalName = 'Pain Supp';
            currentHealer.mana -= effectiveManaCost;
            healerCooldowns.painSuppressionEndTick = currentTick + secondsToTicks(skill.cooldown || 30);
            updateCombatState(prev => ({ 
              ...prev, 
              combatLog: [...prev.combatLog, { 
                timestamp: totalTime, 
                type: 'buff', 
                source: currentHealer.name, 
                target: heavyDamageTarget.name, 
                message: `${getSkillIconString(skill)} ${currentHealer.name} casts ${skill.name} on ${heavyDamageTarget.name}! (-${damageReductionValue}% damage for ${durationSeconds}s)` 
              }] 
            }));
          }
        }
      }
      // Rejuvenation (HoT)
      else if (skill.id === 'rejuvenation') {
        // Find target based on config (lowest ally or specific target)
        let rejuvTarget: TeamMemberState | undefined;
        if (config.allyHealth.enabled && config.allyHealth.target === 'lowest_ally') {
          const candidates = aliveTeam.filter(m => m.health < m.maxHealth * (config.allyHealth.threshold / 100) && !m.hasRejuv);
          if (candidates.length > 0) {
            rejuvTarget = candidates.reduce((lowest, m) => 
              (m.health / m.maxHealth < lowest.health / lowest.maxHealth) ? m : lowest,
              candidates[0]
            );
          }
        } else {
          // Default: find someone who needs rejuv
          rejuvTarget = aliveTeam.find(m => 
            m.health < m.maxHealth * 0.85 && 
            m.health > m.maxHealth * 0.5 && 
            !m.hasRejuv
          );
        }
        
        if (rejuvTarget && currentHealer.mana >= effectiveManaCost) {
          const spellPower = (healerChar?.baseStats?.intelligence || 20) * 2.5;
          const spellPowerMultiplier = (skill.damageEffectiveness || 30) / 100;
          const baseHeal = skill.baseHealing || 40;
          const hotHealPerTick = Math.floor(baseHeal * (1 + (spellPower * spellPowerMultiplier) / 100));
          const durationSeconds = skill.effects.find(e => e.type === 'hot')?.duration || 12;
          const tickIntervalSeconds = 2;
          rejuvTarget.hotEffects = rejuvTarget.hotEffects || [];
          rejuvTarget.hotEffects.push({
            name: skill.name,
            icon: getSkillIconString(skill),
            healPerTick: hotHealPerTick,
            expiresAtTick: currentTick + secondsToTicks(durationSeconds),
            tickIntervalTicks: secondsToTicks(tickIntervalSeconds),
            nextTickAtTick: currentTick + secondsToTicks(tickIntervalSeconds),
            sourceId: currentHealer.id
          });
          rejuvTarget.hasRejuv = true;
          currentHealer.mana -= effectiveManaCost;
          updateCombatState(prev => ({ 
            ...prev, 
            combatLog: [...prev.combatLog, { 
              timestamp: totalTime, 
              type: 'heal', 
              source: currentHealer.name, 
              target: rejuvTarget.name, 
              message: `${getSkillIconString(skill)} ${currentHealer.name} casts ${skill.name} on ${rejuvTarget.name}!` 
            }] 
          }));
        }
      }
    } else {
      // Cast skill - start casting
      let targetId: string | undefined;
      let targetName = '';
      
      // Determine target based on skill target type
      if (skill.targetType === 'allAllies') {
        // No specific target needed for allAllies
        targetId = undefined;
        targetName = 'all allies';
      } else if (skill.targetType === 'ally') {
        // Single target ally - find based on config
        if (config.allyHealth.enabled && config.allyHealth.target === 'lowest_ally') {
          const hurtMembers = aliveTeam.filter(m => m.health < m.maxHealth * (config.allyHealth.threshold / 100));
          if (hurtMembers.length > 0) {
            const tankMember = hurtMembers.find(m => m.role === 'tank');
            const target = tankMember || hurtMembers.reduce((lowest, m) => 
              (!lowest || m.health / m.maxHealth < lowest.health / lowest.maxHealth) ? m : lowest, 
              hurtMembers[0]
            );
            targetId = target.id;
            targetName = target.name;
          }
        } else {
          // Default: lowest health ally
          const target = aliveTeam.reduce((lowest, m) => 
            (!lowest || m.health / m.maxHealth < lowest.health / lowest.maxHealth) ? m : lowest, 
            aliveTeam[0]
          );
          targetId = target.id;
          targetName = target.name;
        }
      }
      
      if (targetId || skill.targetType === 'allAllies') {
        // Apply cast speed bonus
        const castSpeedBonus = currentHealer.talentBonuses?.castSpeedBonus || 0;
        const castSpeedMultiplier = 1 + (castSpeedBonus / 100);
        // Apply support gem cast time multiplier (faster casting)
        const equippedSkill = healerChar?.skillGems?.find(sg => sg.skillGemId === skill.id);
        const supportGemIds = equippedSkill?.supportGemIds || [];
        const supportResult = applySupportGems(skill, supportGemIds);
        const effectiveCastSpeedMultiplier = castSpeedMultiplier * supportResult.castTimeMultiplier;
        const castTimeTicks = Math.max(1, Math.floor(secondsToTicks(skill.castTime) / effectiveCastSpeedMultiplier));
        startCast(currentHealer, castTimeTicks, currentTick, bloodlustActive, targetId, skill.name);
        updateCombatState(prev => ({ 
          ...prev, 
          combatLog: [...prev.combatLog, { 
            timestamp: totalTime, 
            type: 'ability', 
            source: currentHealer.name, 
            target: targetName, 
            message: `${getSkillIconString(skill)} ${currentHealer.name} begins casting ${skill.name}${targetName ? ` on ${targetName}` : '...'}...` 
          }] 
        }));
      }
    }
  }
}

function processHealerAutoAttack(
  context: CombatContext,
  char: Character,
  member: TeamMemberState,
  teamStates: TeamMemberState[],
  tickAliveEnemies: AnimatedEnemy[],
  bloodlustActive: boolean,
  currentTick: number
): void {
  const { totalTime, updateCombatState, currentCombatState, setScreenShake, setTeamFightAnim, setEnemyFightAnims } = context;
  
  // Check if healer can attack (GCD expired, not casting)
  if (!canStartAction(member, currentTick)) return;
  if (tickAliveEnemies.length === 0) return;
  
  // Use weapon damage for auto-attacks
  const weaponDamage = member.weaponDamage;
  if (!weaponDamage) return; // Can't auto-attack without a weapon
  
  const baseCritChance = weaponDamage.criticalStrikeChance || 5;
  const increasedCritChance = char.baseStats?.criticalStrikeChance || 0;
  const finalCritChance = calculateCriticalStrikeChance(baseCritChance, increasedCritChance);
  const isCrit = Math.random() < (finalCritChance / 100);
  
  // Apply talent damage multiplier
  const talentDamageMultiplier = 1 + ((member.talentBonuses?.damageMultiplier || 0) / 100);
  
  // Calculate total weapon damage from all damage types
  const physDamage = (weaponDamage.physicalMin + weaponDamage.physicalMax) / 2;
  const fireDamage = (weaponDamage.fireMin + weaponDamage.fireMax) / 2;
  const coldDamage = (weaponDamage.coldMin + weaponDamage.coldMax) / 2;
  const lightningDamage = (weaponDamage.lightningMin + weaponDamage.lightningMax) / 2;
  const chaosDamage = (weaponDamage.chaosMin + weaponDamage.chaosMax) / 2;
  const totalWeaponDamage = physDamage + fireDamage + coldDamage + lightningDamage + chaosDamage;
  
  let baseDamage = Math.floor(totalWeaponDamage * talentDamageMultiplier * (bloodlustActive ? 1.3 : 1));
  
  // Apply map affix player damage reduction
  const playerDamageReduction = context.mapAffixEffects?.playerDamageReduction || 0;
  baseDamage = Math.floor(baseDamage * (1 + playerDamageReduction));
  
  const critMultiplier = (char.baseStats?.criticalStrikeMultiplier || 150) / 100;
  const finalDamage = isCrit ? Math.floor(baseDamage * critMultiplier) : baseDamage;
  
  // Determine primary damage type (highest damage type from weapon)
  let primaryDamageType: 'physical' | 'fire' | 'cold' | 'lightning' | 'chaos' = 'physical';
  let highestDamage = physDamage;
  if (fireDamage > highestDamage) { primaryDamageType = 'fire'; highestDamage = fireDamage; }
  if (coldDamage > highestDamage) { primaryDamageType = 'cold'; highestDamage = coldDamage; }
  if (lightningDamage > highestDamage) { primaryDamageType = 'lightning'; highestDamage = lightningDamage; }
  if (chaosDamage > highestDamage) { primaryDamageType = 'chaos'; }
  
  // Single target auto-attack
  const target = tickAliveEnemies[0];
  const damageResult = calculatePlayerDamageToEnemy(
    finalDamage,
    primaryDamageType,
    target,
    member.accuracy
  );
  
  if (!damageResult.evaded) {
    const safeESRemaining = isNaN(damageResult.esRemaining) || !isFinite(damageResult.esRemaining) ? (target.energyShield || 0) : Math.max(0, damageResult.esRemaining);
    const safeLifeRemaining = isNaN(damageResult.lifeRemaining) || !isFinite(damageResult.lifeRemaining) ? target.maxHealth : Math.max(0, damageResult.lifeRemaining);
    target.energyShield = safeESRemaining;
    safeSetEnemyHealth(target, safeLifeRemaining);
    
    member.totalDamage = (member.totalDamage || 0) + damageResult.damage;
    member.damageBySpell = member.damageBySpell || {};
    member.damageBySpell['Auto Attack'] = (member.damageBySpell['Auto Attack'] || 0) + damageResult.damage;
    
    // Process onHit effects
    processOnHitEffects(member, damageResult.damage, currentTick, teamStates);
    
    // Apply lifesteal after damage is dealt
    const floatNumbers: FloatingNumber[] = [];
    applyLifesteal(member, damageResult.damage, floatNumbers, currentCombatState);
    
    const jitterX = (Math.random() * 80) - 40;
    const jitterY = (Math.random() * 60) - 30;
    if (isCrit) setScreenShake(prev => prev + 1);
    setTeamFightAnim(prev => prev + 1);
    setEnemyFightAnims(prev => ({ ...prev, [target.id]: (prev[target.id] || 0) + 1 }));
    
    const floatNum = createFloatingNumber(
      damageResult.damage,
      isCrit ? 'crit' : 'player',
      currentCombatState.teamPosition.x + jitterX,
      currentCombatState.teamPosition.y - 40 + jitterY
    );
    updateCombatState(prev => ({ 
      ...prev, 
      floatingNumbers: [...prev.floatingNumbers.slice(-20), floatNum, ...floatNumbers],
      combatLog: [...prev.combatLog, { 
        timestamp: totalTime, 
        type: 'damage', 
        source: char.name, 
        target: target.name, 
        value: damageResult.damage, 
        message: `⚔️ ${char.name} attacks ${target.name} for ${damageResult.damage}${isCrit ? ' CRIT!' : ''}!` 
      }] 
    }));
  }
  
  // Auto-attack speed based on weapon (default 1.5s) - affected by haste
  // Dual wielding weapon swap - no GCD needed, attack speed determines next action
}

function processDpsActions(
  context: CombatContext,
  char: Character,
  member: TeamMemberState,
  teamStates: TeamMemberState[],
  tickAliveEnemies: AnimatedEnemy[],
  bloodlustActive: boolean,
  currentTick: number
): { floatNumbers: FloatingNumber[]; logEntries: CombatLogEntry[] } | null {
  const { totalTime, currentCombatState, setScreenShake, setTeamFightAnim, setEnemyFightAnims } = context;
  const floatNumbers: FloatingNumber[] = [];
  const logEntries: CombatLogEntry[] = [];
  
  // Handle channeling state
  if (member.isChanneling && member.channelSkillId) {
    const skill = getSkillGemById(member.channelSkillId);
    if (!skill) {
      member.isChanneling = false;
      member.channelSkillId = undefined;
      member.channelStacks = undefined;
      member.castAbility = undefined;
      // Clear cast-related fields when stopping channeling
      member.castStartTick = undefined;
      member.castEndTick = undefined;
      member.castTotalTicks = undefined;
      member.castStartTime = undefined;
      member.castTotalTime = undefined;
      return null;
    }
    
    // Check if it's time for next channel tick
    if (member.channelNextTickAt && currentTick >= member.channelNextTickAt) {
      const manaPerTick = skill.manaPerTick || 3;
      
      if (member.mana < manaPerTick) {
        logEntries.push({
          timestamp: totalTime,
          type: 'system',
          source: char.name,
          target: '',
          value: 0,
          message: `${char.name} stops channeling ${skill.name} (out of mana)`
        });
        member.isChanneling = false;
        member.channelSkillId = undefined;
        member.channelStacks = undefined;
        member.castAbility = undefined;
        member.channelNextTickAt = undefined;
        // Clear cast-related fields when stopping channeling
        member.castStartTick = undefined;
        member.castEndTick = undefined;
        member.castTotalTicks = undefined;
        member.castStartTime = undefined;
        member.castTotalTime = undefined;
        return { floatNumbers, logEntries };
      }
      
      if (tickAliveEnemies.length === 0) {
        member.isChanneling = false;
        member.channelSkillId = undefined;
        member.channelStacks = undefined;
        member.castAbility = undefined;
        member.channelNextTickAt = undefined;
        // Clear cast-related fields when stopping channeling
        member.castStartTick = undefined;
        member.castEndTick = undefined;
        member.castTotalTicks = undefined;
        member.castStartTime = undefined;
        member.castTotalTime = undefined;
        return { floatNumbers, logEntries };
      }
      
      member.mana -= manaPerTick;
      
      // Set next tick time (modified by cast speed)
      const baseCastSpeed = 100; // Base cast speed (not in BaseStats, using default)
      const castSpeedMultiplier = baseCastSpeed / 100;
      const baseTickRate = skill.channelTickRate || 0.5;
      const scaledTickRate = baseTickRate / castSpeedMultiplier;
      member.channelNextTickAt = currentTick + secondsToTicks(scaledTickRate);
      
      // Increment ramp stacks
      if (skill.channelRampUp && skill.maxChannelStacks) {
        member.channelStacks = Math.min((member.channelStacks || 0) + 1, skill.maxChannelStacks);
        member.maxChannelStacks = skill.maxChannelStacks;
      }
      
      // Calculate damage with support gems
      // Get support gem IDs for this skill
      const equippedSkill = char.skillGems?.find(sg => sg.skillGemId === skill.id);
      const supportGemIds = equippedSkill?.supportGemIds || [];
      const supportResult = applySupportGems(skill, supportGemIds);
      
      // Reduced spell power scaling: int * 2.5 instead of * 5
      const spellPower = (char.baseStats?.intelligence || 20) * 2.5;
      const baseCritChance = skill.baseCriticalStrikeChance || 8;
      const increasedCritChance = char.baseStats?.criticalStrikeChance || 0;
      // Apply support gem crit chance multiplier
      const finalCritChance = calculateCriticalStrikeChance(baseCritChance, increasedCritChance) * supportResult.critChanceMultiplier;
      const isCrit = Math.random() < (finalCritChance / 100);
      const spellPowerMultiplier = (skill.damageEffectiveness || 100) / 100;
      // Reduced base damage fallback from 30 to 15 for channeled skills
      let baseDmg = skill.baseDamage || 15;
      
      // Add flat spell damage from equipment (PoE style: "Adds X to Y Fire Damage to Spells")
      const skillDamageType = skill.damageType === 'nature' ? 'physical' : (skill.damageType || 'physical');
      let flatSpellDamage = 0;
      
      if (skillDamageType === 'physical') {
        const min = char.baseStats?.addedPhysicalSpellDamageMin || 0;
        const max = char.baseStats?.addedPhysicalSpellDamageMax || 0;
        flatSpellDamage = (min + max) / 2;
      } else if (skillDamageType === 'fire') {
        const min = char.baseStats?.addedFireSpellDamageMin || 0;
        const max = char.baseStats?.addedFireSpellDamageMax || 0;
        flatSpellDamage = (min + max) / 2;
      } else if (skillDamageType === 'cold') {
        const min = char.baseStats?.addedColdSpellDamageMin || 0;
        const max = char.baseStats?.addedColdSpellDamageMax || 0;
        flatSpellDamage = (min + max) / 2;
      } else if (skillDamageType === 'lightning') {
        const min = char.baseStats?.addedLightningSpellDamageMin || 0;
        const max = char.baseStats?.addedLightningSpellDamageMax || 0;
        flatSpellDamage = (min + max) / 2;
      } else if (skillDamageType === 'chaos' || skillDamageType === 'arcane') {
        // Chaos and arcane skills use chaos damage
        const min = char.baseStats?.addedChaosSpellDamageMin || 0;
        const max = char.baseStats?.addedChaosSpellDamageMax || 0;
        flatSpellDamage = (min + max) / 2;
      } else if (skillDamageType === 'holy') {
        // Holy skills use fire damage as a fallback
        const min = char.baseStats?.addedFireSpellDamageMin || 0;
        const max = char.baseStats?.addedFireSpellDamageMax || 0;
        flatSpellDamage = (min + max) / 2;
      }
      
      baseDmg += flatSpellDamage;
      
      const rampBonus = skill.channelRampUp ? 1 + ((member.channelStacks || 0) * (skill.channelRampUp / 100)) : 1;
      // Apply talent damage multiplier and support gem damage multiplier
      const talentDamageMultiplier = 1 + ((member.talentBonuses?.damageMultiplier || 0) / 100);
      // Apply increased damage from equipment
      const gearIncreasedDamage = char.baseStats?.increasedDamage || 0;
      const increasedDamageMultiplier = 1 + (gearIncreasedDamage / 100);
      // Reduced spell power effectiveness: divide by 200 instead of 100 for gentler scaling
      let damage = Math.floor(baseDmg * (1 + (spellPower * spellPowerMultiplier) / 200) * increasedDamageMultiplier * talentDamageMultiplier * (bloodlustActive ? 1.3 : 1) * rampBonus * supportResult.damageMultiplier);
      // Add flat damage from support gems
      damage += supportResult.addedDamage;
      const critMultiplier = (char.baseStats?.criticalStrikeMultiplier || 150) / 100;
      const finalDamage = isCrit ? Math.floor(damage * critMultiplier) : damage;
      
      const dpsIndex = context.team.filter(c => c.role === 'dps').findIndex(c => c.id === char.id);
      const jitterX = (Math.random() * 60) - 30 + (dpsIndex * 30);
      const jitterY = (Math.random() * 40) - 20 - (dpsIndex * 10);
      
      // Deal damage based on skill type
      const currentAlive = tickAliveEnemies;
      const { damageType } = calculateSkillDamage(skill, member, char, bloodlustActive, supportGemIds, { inventory: context.inventory, mapAffixEffects: context.mapAffixEffects });
      if (skill.targetType === 'allEnemies') {
        let totalDamage = 0;
        // Apply target cap if skill has maxTargets defined
        const targetsToHit = skill.maxTargets ? currentAlive.slice(0, skill.maxTargets) : currentAlive;
        targetsToHit.forEach(enemy => {
          const damageResult = calculatePlayerDamageToEnemy(
            finalDamage,
            mapDamageType(damageType),
            enemy,
            member.accuracy
          );
          if (!damageResult.evaded) {
            const safeESRemaining = isNaN(damageResult.esRemaining) || !isFinite(damageResult.esRemaining) ? (enemy.energyShield || 0) : Math.max(0, damageResult.esRemaining);
            const safeLifeRemaining = isNaN(damageResult.lifeRemaining) || !isFinite(damageResult.lifeRemaining) ? enemy.maxHealth : Math.max(0, damageResult.lifeRemaining);
            enemy.energyShield = safeESRemaining;
            safeSetEnemyHealth(enemy, safeLifeRemaining);
            totalDamage += damageResult.damage;
            setEnemyFightAnims(prev => ({ ...prev, [enemy.id]: (prev[enemy.id] || 0) + 1 }));
          }
        });
        member.totalDamage = (member.totalDamage || 0) + totalDamage;
        member.damageBySpell = member.damageBySpell || {};
        member.damageBySpell[skill.name] = (member.damageBySpell[skill.name] || 0) + totalDamage;
        if (isCrit) setScreenShake(prev => prev + 1);
        floatNumbers.push(createFloatingNumber(totalDamage, isCrit ? 'crit' : 'player', currentCombatState.teamPosition.x + jitterX, currentCombatState.teamPosition.y - 40 + jitterY));
      } else if (skill.chainCount && skill.chainCount > 0) {
        const chainTargets = Math.min(1 + skill.chainCount, currentAlive.length);
        const targets = [...currentAlive].slice(0, chainTargets);
        let totalDamage = 0;
        const damageType = skill.damageType || 'fire';
        targets.forEach(enemy => {
          const damageResult = calculatePlayerDamageToEnemy(
            finalDamage,
            mapDamageType(damageType),
            enemy,
            member.accuracy
          );
          if (!damageResult.evaded) {
            const safeESRemaining = isNaN(damageResult.esRemaining) || !isFinite(damageResult.esRemaining) ? (enemy.energyShield || 0) : Math.max(0, damageResult.esRemaining);
            const safeLifeRemaining = isNaN(damageResult.lifeRemaining) || !isFinite(damageResult.lifeRemaining) ? enemy.maxHealth : Math.max(0, damageResult.lifeRemaining);
            enemy.energyShield = safeESRemaining;
            safeSetEnemyHealth(enemy, safeLifeRemaining);
            totalDamage += damageResult.damage;
            setEnemyFightAnims(prev => ({ ...prev, [enemy.id]: (prev[enemy.id] || 0) + 1 }));
          }
        });
        member.totalDamage = (member.totalDamage || 0) + totalDamage;
        member.damageBySpell = member.damageBySpell || {};
        member.damageBySpell[skill.name] = (member.damageBySpell[skill.name] || 0) + totalDamage;
        
        // Apply lifesteal after damage is dealt
        applyLifesteal(member, totalDamage, floatNumbers, currentCombatState);
        
        floatNumbers.push(createFloatingNumber(totalDamage, isCrit ? 'crit' : 'player', currentCombatState.teamPosition.x + jitterX, currentCombatState.teamPosition.y - 40 + jitterY));
      } else {
        let target = member.castTargetId ? currentAlive.find(e => e.id === member.castTargetId) : null;
        if (!target || target.health <= 0) {
          target = currentAlive.reduce((lowest, e) => e.health < lowest.health ? e : lowest, currentAlive[0]);
          member.castTargetId = target?.id;
        }
        
        if (target) {
          // Capture state before damage
          const healthBefore = target.health;
          const esBefore = target.energyShield || 0;
          
          // Apply enemy armor and defensive stats
          const damageResult = calculatePlayerDamageToEnemy(
            finalDamage,
            mapDamageType(skill.damageType || 'fire'), // Use skill's damage type
            target,
            member.accuracy
          );
          
          if (damageResult.evaded) {
            // Enemy evaded - skip damage
            return null;
          }
          
          const safeESRemaining = isNaN(damageResult.esRemaining) || !isFinite(damageResult.esRemaining) ? (target.energyShield || 0) : Math.max(0, damageResult.esRemaining);
          const safeLifeRemaining = isNaN(damageResult.lifeRemaining) || !isFinite(damageResult.lifeRemaining) ? target.maxHealth : Math.max(0, damageResult.lifeRemaining);
          target.energyShield = safeESRemaining;
          safeSetHealth(target, safeLifeRemaining);
          const actualDamage = damageResult.damage;
          
          // Capture state after damage
          const healthAfter = target.health;
          const esAfter = target.energyShield || 0;
          
          member.totalDamage = (member.totalDamage || 0) + actualDamage;
          member.damageBySpell = member.damageBySpell || {};
          member.damageBySpell[skill.name] = (member.damageBySpell[skill.name] || 0) + actualDamage;
          
          // Apply lifesteal after damage is dealt
          applyLifesteal(member, actualDamage, floatNumbers, currentCombatState);
          
          if (isCrit) setScreenShake(prev => prev + 1);
          setEnemyFightAnims(prev => ({ ...prev, [target.id]: (prev[target.id] || 0) + 1 }));
          floatNumbers.push(createFloatingNumber(finalDamage, isCrit ? 'crit' : 'player', currentCombatState.teamPosition.x + jitterX, currentCombatState.teamPosition.y - 40 + jitterY));
          
          // Create verbose log entry with full stats
          const verboseLog = createVerboseDamageLog(
            totalTime,
            char.name,
            target.name,
            actualDamage,
            target,
            {
              healthBefore,
              healthAfter,
              esBefore,
              esAfter,
              maxHealth: target.maxHealth,
              maxES: target.maxEnergyShield || 0,
              crit: isCrit,
              abilityName: skill.name,
              damageType: skill.damageType || 'fire'
            },
            member, // sourceState
            teamStates, // allTeamStates
            tickAliveEnemies // allEnemies
          );
          logEntries.push(verboseLog);
          
          // Soul Siphon self-heal
          if (skill.id === 'soul_siphon') {
            const healAmount = Math.floor(actualDamage * 0.5);
            const safeCurrentHealth = isNaN(member.health) || !isFinite(member.health) ? member.maxHealth : member.health;
            const safeHealAmount = isNaN(healAmount) || !isFinite(healAmount) ? 0 : healAmount;
            safeSetHealth(member, safeCurrentHealth + safeHealAmount);
            member.totalHealing = (member.totalHealing || 0) + healAmount;
          }
          
          if (target.health <= 0) {
            const newTarget = currentAlive.find(e => e.id !== target.id && e.health > 0);
            if (newTarget) {
              member.castTargetId = newTarget.id;
            } else {
              member.isChanneling = false;
              member.channelSkillId = undefined;
              member.channelStacks = undefined;
              member.castAbility = undefined;
              member.channelNextTickAt = undefined;
              // Clear cast-related fields when stopping channeling
              member.castStartTick = undefined;
              member.castEndTick = undefined;
              member.castTotalTicks = undefined;
              member.castStartTime = undefined;
              member.castTotalTime = undefined;
            }
          }
        }
      }
      
      setTeamFightAnim(prev => prev + 1);
    }
    
    return { floatNumbers, logEntries };
  }

  // Check if cast is complete
  if (member.isCasting && isCastComplete(member, currentTick)) {
    const abilityName = member.castAbility || 'Fireball';
    const skillId = getSkillIdFromAbilityName(abilityName);
    const skill = skillId ? getSkillGemById(skillId) : undefined;
    
    // Attack skills can have baseDamage: 0 because they use weapon damage
    const isAttackSkill = skill?.tags?.includes('attack');
    if (!skill || (!skill.baseDamage && !isAttackSkill)) {
      member.isCasting = false;
      member.castAbility = undefined;
      member.castTargetId = undefined;
      return null;
    }
    
    // Check if this is a channeled skill
    if (skill.isChanneled) {
      // Apply talent mana cost reduction
      const talentManaCostReduction = member.talentBonuses?.manaCostReduction || 0;
      const effectiveManaCost = Math.max(0, skill.manaCost * (1 - talentManaCostReduction / 100));
      
      if (member.mana < effectiveManaCost) {
        member.isCasting = false;
        member.castAbility = undefined;
        member.castTargetId = undefined;
        return null;
      }
      
      member.mana -= effectiveManaCost;
      member.isCasting = false;
      member.isChanneling = true;
      member.channelSkillId = skill.id;
      member.channelStacks = 0;
      member.maxChannelStacks = skill.maxChannelStacks;
      member.channelManaPerTick = skill.manaPerTick;
      
      // Clear cast-related fields when transitioning to channeling
      member.castStartTick = undefined;
      member.castEndTick = undefined;
      member.castTotalTicks = undefined;
      member.castStartTime = undefined;
      member.castTotalTime = undefined;
      // Keep castAbility set so UI knows what's being channeled
      
      // Set first tick time - apply talent cast speed bonus
      const baseCastSpeed = 100; // Base cast speed (not in BaseStats, using default)
      const talentCastSpeedBonus = member.talentBonuses?.castSpeedBonus || 0;
      const castSpeedMultiplier = (baseCastSpeed / 100) * (1 + (talentCastSpeedBonus / 100));
      const baseTickRate = skill.channelTickRate || 0.5;
      const scaledTickRate = baseTickRate / castSpeedMultiplier;
      member.channelNextTickAt = currentTick + secondsToTicks(scaledTickRate);
      
      logEntries.push({
        timestamp: totalTime,
        type: 'system',
        source: char.name,
        target: '',
        value: 0,
        message: `⟳ ${char.name} begins channeling ${skill.name}`
      });
      
      return { floatNumbers, logEntries };
    }
    
    // Check for confusion miss chance
    if (member.confusionMissChance && Math.random() < (member.confusionMissChance / 100)) {
      logEntries.push({
        timestamp: totalTime,
        type: 'system',
        source: char.name,
        target: '',
        value: 0,
        message: `💫 ${char.name} is confused and misses!`
      });
      member.isCasting = false;
      member.castAbility = undefined;
      member.castTargetId = undefined;
      return { floatNumbers, logEntries };
    }
    
    // Regular cast complete - deal damage (uses weapon for attacks, spell base for spells)
    // isAttackSkill already declared above
    
    // Update weapon damage for dual wielding (alternates between weapons)
    if (isAttackSkill && member.isDualWielding) {
      updateWeaponDamageForDualWielding(member, context.inventory, char);
    }
    
    let baseCritChance = skill.baseCriticalStrikeChance || 8;
    // Attack skills can use weapon crit chance if higher
    if (isAttackSkill && member.weaponDamage && member.weaponDamage.criticalStrikeChance > baseCritChance) {
      baseCritChance = member.weaponDamage.criticalStrikeChance;
    }
    // Get support gem IDs for this skill
    const equippedSkill = char.skillGems?.find(sg => sg.skillGemId === skill.id);
    const supportGemIds = equippedSkill?.supportGemIds || [];
    
    const increasedCritChance = char.baseStats?.criticalStrikeChance || 0;
    // Apply support gem crit chance multiplier
    const supportResult = applySupportGems(skill, supportGemIds);
    const finalCritChance = calculateCriticalStrikeChance(baseCritChance, increasedCritChance) * supportResult.critChanceMultiplier;
    const isCrit = Math.random() < (finalCritChance / 100);
    const { damage } = calculateSkillDamage(skill, member, char, bloodlustActive, supportGemIds, { inventory: context.inventory, mapAffixEffects: context.mapAffixEffects });
    const critMultiplier = (char.baseStats?.criticalStrikeMultiplier || 150) / 100;
    const finalDamage = isCrit ? Math.floor(damage * critMultiplier) : damage;
    
    const currentAlive = tickAliveEnemies;
    const dpsIndex = context.team.filter(c => c.role === 'dps').findIndex(c => c.id === char.id);
    const jitterX = (Math.random() * 100) - 50 + (dpsIndex * 40);
    const jitterY = (Math.random() * 70) - 35 - (dpsIndex * 15);
    
    // Apply talent mana cost reduction and support gem mana cost multiplier
    // Lifetap support: use life instead of mana
    const talentManaCostReduction = member.talentBonuses?.manaCostReduction || 0;
    const baseManaCost = skill.manaCost * supportResult.manaCostMultiplier;
    const effectiveManaCost = Math.max(0, baseManaCost * (1 - talentManaCostReduction / 100));
    
    // Check if lifetap is active (manaCostMultiplier = 0 means lifetap)
    const hasLifetap = supportResult.manaCostMultiplier === 0;
    
    if (hasLifetap) {
      // Lifetap: use life instead of mana
      if (member.health <= effectiveManaCost) {
        member.isCasting = false;
        member.castAbility = undefined;
        member.castTargetId = undefined;
        return null;
      }
      const safeCurrentHealth = isNaN(member.health) || !isFinite(member.health) ? member.maxHealth : member.health;
      const safeLifeCost = isNaN(effectiveManaCost) || !isFinite(effectiveManaCost) ? 0 : Math.min(effectiveManaCost, safeCurrentHealth - 1); // Leave at least 1 HP
      safeSetHealth(member, safeCurrentHealth - safeLifeCost);
      logEntries.push({
        timestamp: totalTime,
        type: 'system',
        source: char.name,
        target: '',
        value: 0,
        message: `💉 ${char.name} pays ${safeLifeCost} life to cast ${abilityName}`
      });
    } else {
      // Normal mana cost
      if (member.mana < effectiveManaCost) {
        member.isCasting = false;
        member.castAbility = undefined;
        member.castTargetId = undefined;
        return null;
      }
      member.mana -= effectiveManaCost;
    }
    
    if (skill.targetType === 'allEnemies') {
      let totalDamage = 0;
      const allEnemiesDamageType = skill.damageType || 'fire';
      
      // Greater Multiple Projectiles: If this is a projectile skill with GMP, hit multiple targets
      const effectiveProjectileCount = supportResult?.hasGMP && skill.tags?.includes('projectile')
        ? (skill.projectileCount || 1) + supportResult.projectileCount
        : (skill.projectileCount || 1);
      
      // Apply target cap from skill.maxTargets
      const maxTargets = skill.maxTargets || currentAlive.length;
      
      // For GMP, we hit up to effectiveProjectileCount enemies (or maxTargets, whichever is lower)
      const targetsToHit = supportResult?.hasGMP && skill.tags?.includes('projectile')
        ? currentAlive.slice(0, Math.min(effectiveProjectileCount, maxTargets, currentAlive.length))
        : currentAlive.slice(0, Math.min(maxTargets, currentAlive.length));
      
      targetsToHit.forEach(enemy => {
        const damageResult = calculatePlayerDamageToEnemy(
          finalDamage,
          mapDamageType(allEnemiesDamageType),
          enemy,
          member.accuracy
        );
        if (!damageResult.evaded) {
          const safeESRemaining = isNaN(damageResult.esRemaining) || !isFinite(damageResult.esRemaining) ? (enemy.energyShield || 0) : Math.max(0, damageResult.esRemaining);
          const safeLifeRemaining = isNaN(damageResult.lifeRemaining) || !isFinite(damageResult.lifeRemaining) ? enemy.maxHealth : Math.max(0, damageResult.lifeRemaining);
          enemy.energyShield = safeESRemaining;
          safeSetEnemyHealth(enemy, safeLifeRemaining);
          totalDamage += damageResult.damage;
          setEnemyFightAnims(prev => ({ ...prev, [enemy.id]: (prev[enemy.id] || 0) + 1 }));
        }
      });
      member.totalDamage = (member.totalDamage || 0) + totalDamage;
      member.damageBySpell = member.damageBySpell || {};
      member.damageBySpell[abilityName] = (member.damageBySpell[abilityName] || 0) + totalDamage;
      if (isCrit) setScreenShake(prev => prev + 1);
      setTeamFightAnim(prev => prev + 1);
      floatNumbers.push(createFloatingNumber(totalDamage, isCrit ? 'crit' : 'player', currentCombatState.teamPosition.x + jitterX, currentCombatState.teamPosition.y - 40 + jitterY));
      
      // Calculate average damage per target (actual damage after mitigation)
      const avgDamagePerTarget = targetsToHit.length > 0 ? Math.round(totalDamage / targetsToHit.length) : 0;
      
      logEntries.push({ 
        timestamp: totalTime, 
        type: 'damage', 
        source: char.name, 
        target: `${targetsToHit.length} enemies`, 
        value: totalDamage, 
        message: `${getSkillIconString(skill)} ${char.name} casts ${abilityName} hitting ${targetsToHit.length} enemies for ${avgDamagePerTarget} each (${totalDamage} total)${isCrit ? ' CRIT!' : ''}!` 
      });
      
      // Spell Echo for allEnemies spells
      if (supportResult?.hasSpellEcho && skill.tags?.includes('spell')) {
        const echoDamage = Math.floor(finalDamage * 0.8); // Echo does 80% damage
        let echoTotalDamage = 0;
        targetsToHit.forEach(enemy => {
          const echoDamageResult = calculatePlayerDamageToEnemy(
            echoDamage,
            mapDamageType(allEnemiesDamageType),
            enemy,
            member.accuracy
          );
          if (!echoDamageResult.evaded) {
            const safeESRemaining = isNaN(echoDamageResult.esRemaining) || !isFinite(echoDamageResult.esRemaining) ? (enemy.energyShield || 0) : Math.max(0, echoDamageResult.esRemaining);
            const safeLifeRemaining = isNaN(echoDamageResult.lifeRemaining) || !isFinite(echoDamageResult.lifeRemaining) ? enemy.maxHealth : Math.max(0, echoDamageResult.lifeRemaining);
            enemy.energyShield = safeESRemaining;
            safeSetEnemyHealth(enemy, safeLifeRemaining);
            echoTotalDamage += echoDamageResult.damage;
            setEnemyFightAnims(prev => ({ ...prev, [enemy.id]: (prev[enemy.id] || 0) + 1 }));
          }
        });
        if (echoTotalDamage > 0) {
          member.totalDamage = (member.totalDamage || 0) + echoTotalDamage;
          member.damageBySpell[abilityName] = (member.damageBySpell[abilityName] || 0) + echoTotalDamage;
          floatNumbers.push(createFloatingNumber(echoTotalDamage, 'player', currentCombatState.teamPosition.x + jitterX + 15, currentCombatState.teamPosition.y - 50 + jitterY));
          
          // Get the actual number of targets hit by echo (may be different from initial cast due to deaths)
          const echoTargetsHit = Math.min(targetsToHit.length, currentAlive.length);
          const echoAvgDamage = echoTargetsHit > 0 ? Math.round(echoTotalDamage / echoTargetsHit) : 0;
          
          logEntries.push({ 
            timestamp: totalTime, 
            type: 'damage', 
            source: char.name, 
            target: `${echoTargetsHit} enemies`, 
            value: echoTotalDamage, 
            message: `⟳ ${char.name}'s ${abilityName} echoes hitting ${echoTargetsHit} enemies for ${echoAvgDamage} each (${echoTotalDamage} total)!` 
          });
        }
      }
    } else if (skill.targetType === 'enemy' && ((skill.chainCount && skill.chainCount > 0) || (skill.projectileCount && skill.projectileCount > 1) || (skill.pierceCount && skill.pierceCount > 0))) {
      // PoE-style projectile mechanics:
      // - Split → Pierce → Fork → Chain → Return (priority order)
      // - Multiple projectiles can't hit same target initially (no shotgunning)
      // - But chain hits CAN hit the same target if it's the only one nearby
      // - Each projectile follows the full pierce/chain sequence independently

      const projectileCount = (skill.projectileCount || 1) + (supportResult?.projectileCount || 0);
      const chainCount = skill.chainCount || 0;
      const pierceCount = skill.pierceCount || 0;
      const chainBonus = skill.chainDamageBonus || 0;

      let totalDamage = 0;
      const hitTargetsInitial = new Set<string>(); // Track initial hits to prevent shotgunning
      let targetsHitCount = 0;

      // Process each projectile independently
      for (let proj = 0; proj < projectileCount; proj++) {
        // Get available targets for this projectile's initial hit (no shotgunning)
        const availableTargets = currentAlive.filter(e => !hitTargetsInitial.has(e.id) && e.health > 0);
        if (availableTargets.length === 0) break;

        // Pick initial target (lowest health among available)
        const initialTarget = availableTargets.reduce((lowest, e) => e.health < lowest.health ? e : lowest, availableTargets[0]);
        hitTargetsInitial.add(initialTarget.id);

        // Track targets hit by this specific projectile (for chain logic)
        const projectileHitTargets = new Set<string>();
        projectileHitTargets.add(initialTarget.id);

        // Hit initial target with full damage calculation (armor/resistances/evasion)
        const damageResult = calculatePlayerDamageToEnemy(
          finalDamage,
          mapDamageType(skill.damageType || 'physical'),
          initialTarget,
          member.accuracy
        );

        if (!damageResult.evaded) {
          initialTarget.energyShield = damageResult.esRemaining;
          safeSetEnemyHealth(initialTarget, damageResult.lifeRemaining);
          totalDamage += damageResult.damage;
          targetsHitCount++;
          setEnemyFightAnims(prev => ({ ...prev, [initialTarget.id]: (prev[initialTarget.id] || 0) + 1 }));
        }

        // Pierce through enemies (projectile continues through targets)
        for (let p = 0; p < pierceCount; p++) {
          const pierceTargets = currentAlive.filter(e => !projectileHitTargets.has(e.id) && e.health > 0);
          if (pierceTargets.length === 0) break;

          const nextTarget = pierceTargets.reduce((lowest, e) => e.health < lowest.health ? e : lowest, pierceTargets[0]);
          projectileHitTargets.add(nextTarget.id);

          const pierceDamageResult = calculatePlayerDamageToEnemy(
            finalDamage,
            mapDamageType(skill.damageType || 'physical'),
            nextTarget,
            member.accuracy
          );

          if (!pierceDamageResult.evaded) {
            nextTarget.energyShield = pierceDamageResult.esRemaining;
            safeSetEnemyHealth(nextTarget, pierceDamageResult.lifeRemaining);
            totalDamage += pierceDamageResult.damage;
            targetsHitCount++;
            setEnemyFightAnims(prev => ({ ...prev, [nextTarget.id]: (prev[nextTarget.id] || 0) + 1 }));
          }
        }

        // Chain to additional targets (projectile bounces between enemies)
        for (let c = 0; c < chainCount; c++) {
          // Find chain target - can't hit same target this projectile already hit
          const chainTargets = currentAlive.filter(e => !projectileHitTargets.has(e.id) && e.health > 0);
          if (chainTargets.length === 0) break;

          // Pick chain target (lowest health, simulating proximity)
          const chainTarget = chainTargets.reduce((lowest, e) => e.health < lowest.health ? e : lowest, chainTargets[0]);
          projectileHitTargets.add(chainTarget.id);

          // Calculate chain damage with bonus (chains remaining = total chains - current chain index - 1)
          const chainsRemaining = chainCount - c - 1;
          const chainMultiplier = 1 + (chainsRemaining * chainBonus / 100);
          const chainDamage = Math.floor(finalDamage * chainMultiplier);

          const chainDamageResult = calculatePlayerDamageToEnemy(
            chainDamage,
            mapDamageType(skill.damageType || 'physical'),
            chainTarget,
            member.accuracy
          );

          if (!chainDamageResult.evaded) {
            chainTarget.energyShield = chainDamageResult.esRemaining;
            safeSetEnemyHealth(chainTarget, chainDamageResult.lifeRemaining);
            totalDamage += chainDamageResult.damage;
            targetsHitCount++;
            setEnemyFightAnims(prev => ({ ...prev, [chainTarget.id]: (prev[chainTarget.id] || 0) + 1 }));
          }
        }
      }

      member.totalDamage = (member.totalDamage || 0) + totalDamage;
      member.damageBySpell = member.damageBySpell || {};
      member.damageBySpell[abilityName] = (member.damageBySpell[abilityName] || 0) + totalDamage;

      // Process onHit effects
      processOnHitEffects(member, totalDamage, currentTick, teamStates);

      // Apply lifesteal after damage is dealt
      applyLifesteal(member, totalDamage, floatNumbers, currentCombatState);

      if (isCrit) setScreenShake(prev => prev + 1);
      setTeamFightAnim(prev => prev + 1);
      floatNumbers.push(createFloatingNumber(totalDamage, isCrit ? 'crit' : 'player', currentCombatState.teamPosition.x + jitterX, currentCombatState.teamPosition.y - 40 + jitterY));

      // Build descriptive message
      let hitsDescription = '';
      if (projectileCount > 1 && chainCount > 0) {
        hitsDescription = `${projectileCount} projectiles × ${chainCount + 1} chains`;
      } else if (projectileCount > 1) {
        hitsDescription = `${projectileCount} projectiles`;
      } else if (chainCount > 0) {
        hitsDescription = `${targetsHitCount} enemies (${chainCount} chains)`;
      } else if (pierceCount > 0) {
        hitsDescription = `${targetsHitCount} enemies (pierced)`;
      } else {
        hitsDescription = `${targetsHitCount} enemies`;
      }

      logEntries.push({
        timestamp: totalTime,
        type: 'damage',
        source: char.name,
        target: hitsDescription,
        value: totalDamage,
        message: `⚡ ${char.name} casts ${abilityName} hitting ${hitsDescription} for ${totalDamage} total${isCrit ? ' CRIT!' : ''}!`
      });

      // Spell Echo for projectile/chain spells
      if (supportResult?.hasSpellEcho && skill.tags?.includes('spell')) {
        const echoDamage = Math.floor(finalDamage * 0.8); // Echo does 80% damage
        let echoTotalDamage = 0;
        const echoHitTargets = new Set<string>();

        for (let proj = 0; proj < projectileCount; proj++) {
          const availableTargets = currentAlive.filter(e => !echoHitTargets.has(e.id) && e.health > 0);
          if (availableTargets.length === 0) break;

          const initialTarget = availableTargets.reduce((lowest, e) => e.health < lowest.health ? e : lowest, availableTargets[0]);
          echoHitTargets.add(initialTarget.id);
          const projectileHitTargets = new Set<string>([initialTarget.id]);

          const echoDamageResult = calculatePlayerDamageToEnemy(
            echoDamage,
            mapDamageType(skill.damageType || 'physical'),
            initialTarget,
            member.accuracy
          );

          if (!echoDamageResult.evaded) {
            initialTarget.energyShield = echoDamageResult.esRemaining;
            safeSetEnemyHealth(initialTarget, echoDamageResult.lifeRemaining);
            echoTotalDamage += echoDamageResult.damage;
            setEnemyFightAnims(prev => ({ ...prev, [initialTarget.id]: (prev[initialTarget.id] || 0) + 1 }));
          }

          // Echo also chains
          for (let c = 0; c < chainCount; c++) {
            const chainTargets = currentAlive.filter(e => !projectileHitTargets.has(e.id) && e.health > 0);
            if (chainTargets.length === 0) break;

            const chainTarget = chainTargets.reduce((lowest, e) => e.health < lowest.health ? e : lowest, chainTargets[0]);
            projectileHitTargets.add(chainTarget.id);

            const chainsRemaining = chainCount - c - 1;
            const chainMultiplier = 1 + (chainsRemaining * chainBonus / 100);
            const echoChainDamage = Math.floor(echoDamage * chainMultiplier);

            const echoChainResult = calculatePlayerDamageToEnemy(
              echoChainDamage,
              mapDamageType(skill.damageType || 'physical'),
              chainTarget,
              member.accuracy
            );

            if (!echoChainResult.evaded) {
              chainTarget.energyShield = echoChainResult.esRemaining;
              safeSetEnemyHealth(chainTarget, echoChainResult.lifeRemaining);
              echoTotalDamage += echoChainResult.damage;
              setEnemyFightAnims(prev => ({ ...prev, [chainTarget.id]: (prev[chainTarget.id] || 0) + 1 }));
            }
          }
        }

        if (echoTotalDamage > 0) {
          member.totalDamage = (member.totalDamage || 0) + echoTotalDamage;
          member.damageBySpell[abilityName] = (member.damageBySpell[abilityName] || 0) + echoTotalDamage;
          floatNumbers.push(createFloatingNumber(echoTotalDamage, 'player', currentCombatState.teamPosition.x + jitterX + 15, currentCombatState.teamPosition.y - 50 + jitterY));
          logEntries.push({
            timestamp: totalTime,
            type: 'damage',
            source: char.name,
            target: hitsDescription,
            value: echoTotalDamage,
            message: `⟳ ${char.name}'s ${abilityName} echoes hitting ${hitsDescription} for ${echoTotalDamage} total!`
          });
        }
      }
    } else {
      if (currentAlive.length > 0) {
        let target = member.castTargetId ? currentAlive.find(e => e.id === member.castTargetId) : null;
        if (!target) {
          target = currentAlive.reduce((lowest, e) => e.health < lowest.health ? e : lowest, currentAlive[0]);
        }
        
        let totalDamage = 0;
        
        // Handle multi-hit skills (e.g., Barrage with hitCount: 3)
        // Each hit applies the same damage to the same target
        const hitCount = skill.hitCount || 1;
        
        // Check if this is a multi-hit skill - if so, each hit should deal the calculated damage
        // For skills like Barrage, hitCount represents multiple hits to the same target
        if (hitCount > 1) {
          // Multi-hit skill: apply damage multiple times to the same target
          for (let hit = 0; hit < hitCount; hit++) {
            // Apply enemy armor and defensive stats for each hit
            const damageResult = calculatePlayerDamageToEnemy(
              finalDamage,
              mapDamageType(skill.damageType || 'fire'),
              target,
              member.accuracy
            );
            
            if (damageResult.evaded && hit === 0) {
              // If first hit is evaded, skip entire skill
              logEntries.push({
                timestamp: totalTime,
                type: 'ability',
                source: char.name,
                target: target.name,
                message: `💨 ${target.name} evades ${char.name}'s ${abilityName}!`
              });
              return null;
            }
            
            if (!damageResult.evaded) {
              // Update target health/ES after each hit
              target.energyShield = damageResult.esRemaining;
              target.health = damageResult.lifeRemaining;
              const actualDamage = damageResult.damage;
              totalDamage += actualDamage;
              
              setEnemyFightAnims(prev => ({ ...prev, [target.id]: (prev[target.id] || 0) + 1 }));
            }
          }
        } else {
          // Single hit skill
          const damageResult = calculatePlayerDamageToEnemy(
            finalDamage,
            mapDamageType(skill.damageType || 'fire'),
            target,
            member.accuracy
          );
          
          if (damageResult.evaded) {
            // Enemy evaded - skip damage
            logEntries.push({
              timestamp: totalTime,
              type: 'ability',
              source: char.name,
              target: target.name,
              message: `💨 ${target.name} evades ${char.name}'s ${abilityName}!`
            });
            return null;
          }
          
          target.energyShield = damageResult.esRemaining;
          target.health = damageResult.lifeRemaining;
          const actualDamage = damageResult.damage;
          totalDamage += actualDamage;
          
          setEnemyFightAnims(prev => ({ ...prev, [target.id]: (prev[target.id] || 0) + 1 }));
        }
        
        // Melee Splash: If this is a melee attack with melee splash support, deal splash damage to nearby enemies
        if (supportResult?.hasMeleeSplash && isAttackSkill && skill.tags?.includes('melee')) {
          // Only apply splash from first hit
          const splashTargets = currentAlive.filter(enemy => {
            if (enemy.id === target.id) return false; // Don't splash to main target
            return true;
          }).slice(0, 3); // Limit to 3 splash targets
          
          splashTargets.forEach(splashTarget => {
            const splashDmg = Math.floor(finalDamage * 0.5); // Splash deals 50% of main damage
            const splashDamageResult = calculatePlayerDamageToEnemy(
              splashDmg,
              mapDamageType(skill.damageType || 'physical'),
              splashTarget,
              member.accuracy
            );
            if (!splashDamageResult.evaded) {
              splashTarget.energyShield = splashDamageResult.esRemaining;
              splashTarget.health = splashDamageResult.lifeRemaining;
              totalDamage += splashDamageResult.damage;
              setEnemyFightAnims(prev => ({ ...prev, [splashTarget.id]: (prev[splashTarget.id] || 0) + 1 }));
            }
          });
        }
        
        // Always log damage, even if 0 (for debugging)
        // But only apply damage tracking if damage > 0
        if (totalDamage > 0) {
          member.totalDamage = (member.totalDamage || 0) + totalDamage;
          member.damageBySpell = member.damageBySpell || {};
          member.damageBySpell[abilityName] = (member.damageBySpell[abilityName] || 0) + totalDamage;
          
          // Process onHit effects
          processOnHitEffects(member, totalDamage, currentTick, teamStates);
          
          // Apply lifesteal after damage is dealt
          applyLifesteal(member, totalDamage, floatNumbers, currentCombatState);
          
          if (isCrit) setScreenShake(prev => prev + 1);
          setTeamFightAnim(prev => prev + 1);
          const targetNames = target.name;
          floatNumbers.push(createFloatingNumber(totalDamage, isCrit ? 'crit' : 'player', currentCombatState.teamPosition.x + jitterX, currentCombatState.teamPosition.y - 40 + jitterY));
          logEntries.push({ 
            timestamp: totalTime, 
            type: 'damage', 
            source: char.name, 
            target: targetNames, 
            value: totalDamage, 
            message: `${getSkillIconString(skill)} ${char.name} casts ${abilityName} on ${targetNames} for ${totalDamage}${isCrit ? ' CRIT!' : ''}!` 
          });
        } else {
          // Log if damage is 0 (shouldn't happen with weapon equipped, but helps debug)
          const weaponInfo = member.weaponDamage 
            ? `weapon: ${member.weaponDamage.physicalMin}-${member.weaponDamage.physicalMax} phys` 
            : 'no weapon';
          logEntries.push({
            timestamp: totalTime,
            type: 'system',
            source: char.name,
            target: target.name,
            message: `⚠️ ${char.name} casts ${abilityName} but deals 0 damage (${weaponInfo}, finalDamage: ${finalDamage})`
          });
        }
          
          // Spell Echo: If this spell has echo support, repeat it once immediately
          if (supportResult?.hasSpellEcho && skill.tags?.includes('spell')) {
          // Echo cast - apply 20% less damage (already in supportResult.damageMultiplier)
          const echoDamage = Math.floor(finalDamage * 0.8); // Echo does 80% damage
          const echoDamageResult = calculatePlayerDamageToEnemy(
            echoDamage,
            mapDamageType(skill.damageType || 'fire'),
            target,
            member.accuracy
          );
          
          if (!echoDamageResult.evaded) {
            target.energyShield = echoDamageResult.esRemaining;
            target.health = echoDamageResult.lifeRemaining;
            const echoActualDamage = echoDamageResult.damage;
            
            member.totalDamage = (member.totalDamage || 0) + echoActualDamage;
            member.damageBySpell = member.damageBySpell || {};
            member.damageBySpell[abilityName] = (member.damageBySpell[abilityName] || 0) + echoActualDamage;
            
            // Process onHit effects for echo
            processOnHitEffects(member, echoActualDamage, currentTick, teamStates);
            
            // Apply lifesteal for echo
            applyLifesteal(member, echoActualDamage, floatNumbers, currentCombatState);
            
            setEnemyFightAnims(prev => ({ ...prev, [target.id]: (prev[target.id] || 0) + 1 }));
            floatNumbers.push(createFloatingNumber(echoActualDamage, 'player', currentCombatState.teamPosition.x + jitterX + 15, currentCombatState.teamPosition.y - 50 + jitterY));
            logEntries.push({
              timestamp: totalTime,
              type: 'damage',
              source: char.name,
              target: target.name,
              value: echoDamage,
              message: `⟳ ${char.name}'s ${abilityName} echoes for ${echoDamage}!`
            });
          }
        }
      }
    }
    
    member.isCasting = false;
    member.castAbility = undefined;
    member.castTargetId = undefined;
  }
  
  // Check if we can start a new cast
  if (!canStartAction(member, currentTick)) {
    return floatNumbers.length > 0 || logEntries.length > 0 ? { floatNumbers, logEntries } : null;
  }

  if (tickAliveEnemies.length > 0) {
    const equippedSkillsWithConfigs: { skill: SkillGem; config: SkillUsageConfig }[] = [];
    
    // Debug logging for missing skills
    if (!char.skillGems || char.skillGems.length === 0) {
      console.warn(`[DPS] ${char.name} has no skillGems defined! This character will not cast any skills.`);
      console.warn(`[DPS] Character data:`, {
        id: char.id,
        name: char.name,
        role: char.role,
        hasSkillGems: !!char.skillGems,
        skillGemsLength: char.skillGems?.length || 0
      });
    }
    
    char.skillGems?.forEach(sg => {
      const skill = getSkillGemById(sg.skillGemId);
      // Include skills with baseDamage defined OR attack skills (which use weapon damage)
      const isAttackSkill = skill?.tags?.includes('attack');
      if (skill && (skill.baseDamage !== undefined || isAttackSkill)) {
        const config = sg.usageConfig || createSmartSkillConfig(sg.skillGemId);
        equippedSkillsWithConfigs.push({ skill, config });
      }
    });
    
    if (equippedSkillsWithConfigs.length === 0) {
      console.warn(`[DPS] ${char.name} has no valid skills to cast after filtering!`);
      return null;
    }
    
    const tank = teamStates.find(m => context.team.find(c => c.id === m.id)?.role === 'tank');
    const aliveMembers = teamStates.filter(m => !m.isDead);
    const lowestAlly = aliveMembers.reduce((lowest, m) => 
      (m.health / m.maxHealth) < (lowest.health / lowest.maxHealth) ? m : lowest, 
      aliveMembers[0]
    );
    
    const conditionContext = {
      enemyCount: tickAliveEnemies.length,
      enemyTypes: tickAliveEnemies.map(e => {
        const enemyDef = getEnemyById(e.enemyId);
        return (enemyDef?.type || 'normal') as 'normal' | 'elite' | 'miniboss' | 'boss';
      }),
      selfHealthPercent: member.maxHealth > 0 ? (member.health / member.maxHealth) * 100 : 100,
      selfManaPercent: member.maxMana > 0 ? (member.mana / member.maxMana) * 100 : 100,
      tankHealthPercent: tank && tank.maxHealth > 0 ? (tank.health / tank.maxHealth) * 100 : 100,
      lowestAllyHealthPercent: lowestAlly && lowestAlly.maxHealth > 0 ? (lowestAlly.health / lowestAlly.maxHealth) * 100 : 100,
      partyHealthPercents: aliveMembers.map(m => m.maxHealth > 0 ? (m.health / m.maxHealth) * 100 : 100),
      isBloodlustActive: bloodlustActive,
      inCombat: true
    };
    
    const validSkills = equippedSkillsWithConfigs
      .filter(({ skill, config }) => {
        // Apply talent mana cost reduction
        const talentManaCostReduction = member.talentBonuses?.manaCostReduction || 0;
        const effectiveManaCost = Math.max(0, skill.manaCost * (1 - talentManaCostReduction / 100));
        if (member.mana < effectiveManaCost) return false;
        return checkSkillConditions(config, conditionContext);
      })
      .sort((a, b) => b.config.priority - a.config.priority);
    
    const selectedEntry = validSkills[0];
    
    // If no skills available (out of mana), use basic auto-attack
    if (!selectedEntry) {
      // Basic auto-attack: 1s GCD, physical damage, moderate damage
      const target = tickAliveEnemies.reduce((lowest, e) => e.health < lowest.health ? e : lowest, tickAliveEnemies[0]);
      
      // Calculate auto-attack damage (weaker than spells, physical)
      const strength = char.baseStats?.strength || 20;
      const dexterity = char.baseStats?.dexterity || 20;
      // Apply talent damage multiplier
      const talentDamageMultiplier = 1 + ((member.talentBonuses?.damageMultiplier || 0) / 100);
      const baseDamage = 30 + Math.floor((strength + dexterity) / 4); // Moderate base damage
      const baseCritChance = 5;
      const increasedCritChance = char.baseStats?.criticalStrikeChance || 0;
      const finalCritChance = calculateCriticalStrikeChance(baseCritChance, increasedCritChance);
      const isCrit = Math.random() < (finalCritChance / 100);
      const critMultiplier = (char.baseStats?.criticalStrikeMultiplier || 150) / 100;
      const finalDamage = isCrit ? Math.floor(baseDamage * critMultiplier * talentDamageMultiplier * (bloodlustActive ? 1.3 : 1)) : Math.floor(baseDamage * talentDamageMultiplier * (bloodlustActive ? 1.3 : 1));
      
      const safeCurrentHealth = isNaN(target.health) || !isFinite(target.health) ? target.maxHealth : target.health;
      const safeFinalDamage = isNaN(finalDamage) || !isFinite(finalDamage) ? 0 : finalDamage;
      safeSetHealth(target, safeCurrentHealth - safeFinalDamage);
      member.totalDamage = (member.totalDamage || 0) + finalDamage;
      member.damageBySpell = member.damageBySpell || {};
      member.damageBySpell['Auto Attack'] = (member.damageBySpell['Auto Attack'] || 0) + finalDamage;
      
      // Process onHit effects
      processOnHitEffects(member, finalDamage, currentTick, teamStates);
      
      // Apply lifesteal after damage is dealt
      applyLifesteal(member, finalDamage, floatNumbers, currentCombatState);
      
      const dpsIndex = context.team.filter(c => c.role === 'dps').findIndex(c => c.id === char.id);
      const jitterX = (Math.random() * 80) - 40 + (dpsIndex * 30);
      const jitterY = (Math.random() * 60) - 30 - (dpsIndex * 10);
      
      if (isCrit) setScreenShake(prev => prev + 1);
      setTeamFightAnim(prev => prev + 1);
      setEnemyFightAnims(prev => ({ ...prev, [target.id]: (prev[target.id] || 0) + 1 }));
      
      floatNumbers.push(createFloatingNumber(finalDamage, isCrit ? 'crit' : 'player', currentCombatState.teamPosition.x + jitterX, currentCombatState.teamPosition.y - 40 + jitterY));
      logEntries.push({ 
        timestamp: totalTime, 
        type: 'damage', 
        source: char.name, 
        target: target.name, 
        value: finalDamage, 
        message: `⚔️ ${char.name} auto-attacks ${target.name} for ${finalDamage}${isCrit ? ' CRIT!' : ''} (out of mana)` 
      });
      
      // Auto-attack uses weapon attack speed (simulate as a cast)
      const weaponAttackSpeed = member.weaponDamage?.attackSpeed || 1.0;
      const attackTime = 1 / weaponAttackSpeed;
      const attackTimeTicks = Math.max(1, Math.floor(secondsToTicks(attackTime)));
      member.castStartTick = currentTick;
      member.castEndTick = currentTick + attackTimeTicks;
      member.castTotalTicks = attackTimeTicks;
      member.isCasting = true; // Prevent spamming auto-attacks
      
      return { floatNumbers, logEntries };
    }
    
    const selectedSkill = selectedEntry.skill;
    const selectedConfig = selectedEntry.config;
    
    const spellChoice = selectedSkill.name;
    const equippedSkill = char.skillGems?.find(sg => sg.skillGemId === selectedSkill.id);
    const supportGemIds = equippedSkill?.supportGemIds || [];
    const supportResult = applySupportGems(selectedSkill, supportGemIds);
    
    // Determine if this is an attack or spell
    const isAttackSkill = selectedSkill.tags?.includes('attack');
    
    let castTimeTicks = 0;
    
    if (isAttackSkill) {
      // Attacks use weapon attack speed
      const weaponAttackSpeed = member.weaponDamage?.attackSpeed || 1.0; // attacks per second
      const attackTime = 1 / weaponAttackSpeed; // seconds per attack
      // Apply attack speed modifiers (from talents AND gear)
      const talentAttackSpeedBonus = member.talentBonuses?.castSpeedBonus || 0; // reuse castSpeedBonus for attack speed from talents
      const gearAttackSpeedBonus = char.baseStats?.increasedAttackSpeed || 0; // from equipment
      const totalAttackSpeedBonus = talentAttackSpeedBonus + gearAttackSpeedBonus;
      const attackSpeedMultiplier = 1 + (totalAttackSpeedBonus / 100);
      const effectiveAttackTime = attackTime / (attackSpeedMultiplier * supportResult.castTimeMultiplier);
      castTimeTicks = Math.max(1, Math.floor(secondsToTicks(effectiveAttackTime)));
    } else {
      // Spells use base cast time with cast speed scaling
      const talentCastSpeedBonus = member.talentBonuses?.castSpeedBonus || 0; // from talents
      const gearCastSpeedBonus = char.baseStats?.increasedCastSpeed || 0; // from equipment
      const totalCastSpeedBonus = talentCastSpeedBonus + gearCastSpeedBonus;
      const castSpeedMultiplier = 1 + (totalCastSpeedBonus / 100);
      const effectiveCastSpeedMultiplier = castSpeedMultiplier * supportResult.castTimeMultiplier;
      
      const baseCastTime = selectedSkill.castTime || 0;
      castTimeTicks = baseCastTime > 0 
        ? Math.max(1, Math.floor(secondsToTicks(baseCastTime) / effectiveCastSpeedMultiplier))
        : 0;
    }
    
    let targetId: string | undefined = undefined;
    if (selectedSkill.targetType === 'enemy' && selectedSkill.id !== 'shadow_bolt') {
      const alreadyTargeted = new Set(
        teamStates
          .filter(m => m.isCasting && m.castTargetId && m.id !== member.id)
          .map(m => m.castTargetId)
      );
      const availableTargets = tickAliveEnemies.filter(e => !alreadyTargeted.has(e.id));
      const targetPool = availableTargets.length > 0 ? availableTargets : tickAliveEnemies;
      
      let target: AnimatedEnemy;
      if (selectedConfig.targetType === 'lowest_health') {
        target = targetPool.reduce((lowest, e) => e.health < lowest.health ? e : lowest, targetPool[0]);
      } else if (selectedConfig.targetType === 'highest_health') {
        target = targetPool.reduce((highest, e) => e.health > highest.health ? e : highest, targetPool[0]);
      } else {
        target = targetPool.reduce((lowest, e) => e.health < lowest.health ? e : lowest, targetPool[0]);
      }
      targetId = target.id;
    }
    
    // Only start a cast if there's actual cast time (> 0)
    // Instant skills (castTime === 0) execute immediately on next tick without showing cast bar
    if (castTimeTicks > 0) {
      startCast(member, castTimeTicks, currentTick, bloodlustActive, targetId, spellChoice);
      
      const targetName = targetId ? tickAliveEnemies.find(e => e.id === targetId)?.name : '';
      logEntries.push({ 
        timestamp: totalTime, 
        type: 'ability', 
        source: char.name, 
        target: targetName || '', 
        message: `🔮 ${char.name} begins casting ${spellChoice}${targetName ? ` on ${targetName}` : ''}...` 
      });
    } else {
      // Instant cast - set up state to execute on next tick without showing cast bar
      member.castAbility = spellChoice;
      member.castTargetId = targetId;
      // Set cast end to current tick so it executes immediately on next processing
      member.castStartTick = currentTick;
      member.castEndTick = currentTick;
      member.castTotalTicks = 0;
      // Don't set isCasting = true for instant skills (no cast bar)
    }
  }
  
  return floatNumbers.length > 0 || logEntries.length > 0 ? { floatNumbers, logEntries } : null;
}

function processTankActions(
  context: CombatContext,
  char: Character,
  member: TeamMemberState,
  teamStates: TeamMemberState[],
  tickAliveEnemies: AnimatedEnemy[],
  tankCooldowns: { shieldSlamEndTick: number; defensiveStanceEndTick: number; shieldBlockEndTick: number; thunderClapEndTick: number },
  bloodlustActive: boolean,
  currentTick: number
): void {
  const { totalTime, updateCombatState, currentCombatState, setScreenShake, setTeamFightAnim, setEnemyFightAnims } = context;
  const floatNumbers: FloatingNumber[] = [];
  
  // Check if tank can act
  if (!canStartAction(member, currentTick)) return;
  
  const strength = char.baseStats?.strength || 20;
  const skillId = 'shield_slam';
  const skill = getSkillGemById(skillId);
  const baseCritChance = skill?.baseCriticalStrikeChance || 5;
  const increasedCritChance = char.baseStats?.criticalStrikeChance || 0;
  const finalCritChance = calculateCriticalStrikeChance(baseCritChance, increasedCritChance);
  const isCrit = Math.random() < (finalCritChance / 100);
  
  const equippedSkillIds = char.skillGems?.map(sg => sg.skillGemId) || [];
  const hasShieldSlam = equippedSkillIds.includes('shield_slam');
  const hasDefensiveStance = equippedSkillIds.includes('defensive_stance');
  const hasShieldBlock = equippedSkillIds.includes('shield_block');
  
  // Check Shield Block
  if (hasShieldBlock && currentTick >= tankCooldowns.shieldBlockEndTick && !member.blockBuff) {
    const shieldBlockSkill = getSkillGemById('shield_block');
    if (shieldBlockSkill && (member.recentDamageTaken || 0) > member.maxHealth * 0.03 && member.mana >= shieldBlockSkill.manaCost) {
      const blockValue = shieldBlockSkill.effects.find((e: any) => e.type === 'buffStat')?.value || 30;
      const durationSeconds = shieldBlockSkill.effects.find((e: any) => e.type === 'buffStat')?.duration || 6;
      member.blockBuff = blockValue;
      member.blockBuffEndTick = currentTick + secondsToTicks(durationSeconds);
      member.mana -= shieldBlockSkill.manaCost;
      tankCooldowns.shieldBlockEndTick = currentTick + secondsToTicks(shieldBlockSkill.cooldown || 12);
      updateCombatState(prev => ({ 
        ...prev, 
        combatLog: [...prev.combatLog, { 
          timestamp: totalTime, 
          type: 'buff', 
          source: char.name, 
          target: char.name, 
          message: `${shieldBlockSkill.icon} ${char.name} raises Shield Block! (+${blockValue}% block for ${durationSeconds}s)` 
        }] 
      }));
      return;
    }
  }
  
  // Check Defensive Stance
  if (hasDefensiveStance && currentTick >= tankCooldowns.defensiveStanceEndTick && !member.armorBuff) {
    const defensiveStanceSkill = getSkillGemById('defensive_stance');
    if (defensiveStanceSkill && (member.recentDamageTaken || 0) > member.maxHealth * 0.05 && member.mana >= defensiveStanceSkill.manaCost) {
      const armorValue = defensiveStanceSkill.effects.find((e: any) => e.type === 'buffStat')?.value || 50;
      const durationSeconds = defensiveStanceSkill.effects.find((e: any) => e.type === 'buffStat')?.duration || 15;
      member.armorBuff = armorValue;
      member.armorBuffEndTick = currentTick + secondsToTicks(durationSeconds);
      member.mana -= defensiveStanceSkill.manaCost;
      tankCooldowns.defensiveStanceEndTick = currentTick + secondsToTicks(defensiveStanceSkill.cooldown || 30);
      updateCombatState(prev => ({ 
        ...prev, 
        combatLog: [...prev.combatLog, { 
          timestamp: totalTime, 
          type: 'buff', 
          source: char.name, 
          target: char.name, 
          message: `${defensiveStanceSkill.icon} ${char.name} enters Defensive Stance! (+${armorValue}% armor for ${durationSeconds}s)` 
        }] 
      }));
      return;
    }
  }
  
  // Attack enemies
  if (tickAliveEnemies.length > 0) {
    if (hasShieldSlam && currentTick >= tankCooldowns.shieldSlamEndTick) {
      const shieldSlamSkill = getSkillGemById('shield_slam');
      if (shieldSlamSkill && member.mana >= shieldSlamSkill.manaCost) {
        const target = tickAliveEnemies.reduce((lowest: any, e: any) => e.health < lowest.health ? e : lowest, tickAliveEnemies[0]);
        const attackPowerMultiplier = (shieldSlamSkill.damageEffectiveness || 100) / 100;
        const baseDmg = shieldSlamSkill.baseDamage || 75;
        const strengthBonus = 1 + (strength * 0.002);
        // Apply talent damage multiplier
        const talentDamageMultiplier = 1 + ((member.talentBonuses?.damageMultiplier || 0) / 100);
        const shieldSlamDmg = Math.floor(baseDmg * attackPowerMultiplier * strengthBonus * talentDamageMultiplier * (bloodlustActive ? 1.3 : 1));
        const critMultiplier = (char.baseStats?.criticalStrikeMultiplier || 150) / 100;
        const finalDamage = isCrit ? Math.floor(shieldSlamDmg * critMultiplier) : shieldSlamDmg;
        // Apply enemy armor and defensive stats
        const damageResult = calculatePlayerDamageToEnemy(
          finalDamage,
          'physical', // Shield Slam is physical
          target,
          member.accuracy
        );
        
        if (!damageResult.evaded) {
          target.energyShield = damageResult.esRemaining;
          target.health = damageResult.lifeRemaining;
          member.totalDamage = (member.totalDamage || 0) + damageResult.damage;
          member.damageBySpell = member.damageBySpell || {};
          member.damageBySpell['Shield Slam'] = (member.damageBySpell['Shield Slam'] || 0) + damageResult.damage;
        }
        
        // Apply talent mana cost reduction
        const talentManaCostReduction = member.talentBonuses?.manaCostReduction || 0;
        const effectiveManaCost = Math.max(0, shieldSlamSkill.manaCost * (1 - talentManaCostReduction / 100));
        member.mana -= effectiveManaCost;
        
        // Process onHit effects
        processOnHitEffects(member, finalDamage, currentTick, teamStates);
        
        // Apply lifesteal after damage is dealt
        applyLifesteal(member, finalDamage, floatNumbers, currentCombatState);
        tankCooldowns.shieldSlamEndTick = currentTick + secondsToTicks(shieldSlamSkill.cooldown || 6);
        const jitterX = (Math.random() * 80) - 40;
        const jitterY = (Math.random() * 60) - 30;
        if (isCrit) setScreenShake(prev => prev + 1);
        setTeamFightAnim(prev => prev + 1);
        setEnemyFightAnims(prev => ({ ...prev, [target.id]: (prev[target.id] || 0) + 1 }));
        const floatNum = createFloatingNumber(finalDamage, isCrit ? 'crit' : 'player', currentCombatState.teamPosition.x + jitterX, currentCombatState.teamPosition.y - 40 + jitterY);
        applyLifesteal(member, finalDamage, floatNumbers, currentCombatState);
        updateCombatState(prev => ({ 
          ...prev, 
          floatingNumbers: [...prev.floatingNumbers.slice(-20), floatNum, ...floatNumbers],
          combatLog: [...prev.combatLog, { 
            timestamp: totalTime, 
            type: 'damage', 
            source: char.name, 
            target: target.name, 
            value: finalDamage, 
            message: `${getSkillIconString(shieldSlamSkill)} ${char.name} Shield Slams ${target.name} for ${finalDamage}${isCrit ? ' CRIT!' : ''}!` 
          }] 
        }));
        return;
      }
    }
    
    // Thunder Clap (filler ability) - only if equipped and cooldown is ready
    const hasThunderClap = equippedSkillIds.includes('thunder_clap');
    if (hasThunderClap && currentTick >= tankCooldowns.thunderClapEndTick) {
      const thunderClapSkill = getSkillGemById('thunder_clap');
      if (thunderClapSkill && member.mana >= thunderClapSkill.manaCost) {
        // Apply talent damage multiplier
        const talentDamageMultiplier = 1 + ((member.talentBonuses?.damageMultiplier || 0) / 100);
        const thunderClapDmg = Math.floor(25 * (1 + strength / 150) * talentDamageMultiplier * (bloodlustActive ? 1.3 : 1));
        const finalDamage = isCrit ? Math.floor(thunderClapDmg * 1.5) : thunderClapDmg;
        let totalDamageDealt = 0;
        tickAliveEnemies.forEach(enemy => {
          // Apply enemy armor and defensive stats
          const damageResult = calculatePlayerDamageToEnemy(
            finalDamage,
            'physical', // Thunder Clap is physical AoE
            enemy,
            member.accuracy
          );
          
          if (!damageResult.evaded) {
            enemy.energyShield = damageResult.esRemaining;
            enemy.health = damageResult.lifeRemaining;
            totalDamageDealt += damageResult.damage;
            setEnemyFightAnims(prev => ({ ...prev, [enemy.id]: (prev[enemy.id] || 0) + 1 }));
          }
        });
        member.totalDamage = (member.totalDamage || 0) + totalDamageDealt;
        member.damageBySpell = member.damageBySpell || {};
        member.damageBySpell['Thunder Clap'] = (member.damageBySpell['Thunder Clap'] || 0) + totalDamageDealt;
        
        // Apply talent mana cost reduction
        const talentManaCostReduction = member.talentBonuses?.manaCostReduction || 0;
        const effectiveManaCost = Math.max(0, thunderClapSkill.manaCost * (1 - talentManaCostReduction / 100));
        member.mana -= effectiveManaCost;
        
        // Process onHit effects
        processOnHitEffects(member, totalDamageDealt, currentTick, teamStates);
        
        // Apply lifesteal after damage is dealt
        applyLifesteal(member, totalDamageDealt, floatNumbers, currentCombatState);
        tankCooldowns.thunderClapEndTick = currentTick + secondsToTicks(thunderClapSkill.cooldown || 4);
        const jitterX = (Math.random() * 80) - 40;
        const jitterY = (Math.random() * 60) - 30;
        if (isCrit) setScreenShake(prev => prev + 1);
        setTeamFightAnim(prev => prev + 1);
        const floatNum = createFloatingNumber(totalDamageDealt, isCrit ? 'crit' : 'player', currentCombatState.teamPosition.x + jitterX, currentCombatState.teamPosition.y - 40 + jitterY);
        const lifestealFloats: FloatingNumber[] = [];
        applyLifesteal(member, totalDamageDealt, lifestealFloats, currentCombatState);
        updateCombatState(prev => ({ 
          ...prev, 
          floatingNumbers: [...prev.floatingNumbers.slice(-20), floatNum, ...lifestealFloats],
          combatLog: [...prev.combatLog, { 
            timestamp: totalTime, 
            type: 'damage', 
            source: char.name, 
            target: tickAliveEnemies.length > 1 ? `${tickAliveEnemies.length} enemies` : tickAliveEnemies[0].name, 
            value: totalDamageDealt, 
            message: `⚡ ${char.name} Thunder Claps ${tickAliveEnemies.length > 1 ? tickAliveEnemies.length + ' enemies' : tickAliveEnemies[0].name} for ${finalDamage}${isCrit ? ' CRIT!' : ''} each!` 
          }] 
        }));
        return;
      }
    }
    
    // Auto-attack with weapon if no skills are available
    const weaponDamage = member.weaponDamage;
    if (weaponDamage && tickAliveEnemies.length > 0) {
      const target = tickAliveEnemies[0];
      
      // Calculate total weapon damage from all damage types
      const physDamage = (weaponDamage.physicalMin + weaponDamage.physicalMax) / 2;
      const fireDamage = (weaponDamage.fireMin + weaponDamage.fireMax) / 2;
      const coldDamage = (weaponDamage.coldMin + weaponDamage.coldMax) / 2;
      const lightningDamage = (weaponDamage.lightningMin + weaponDamage.lightningMax) / 2;
      const chaosDamage = (weaponDamage.chaosMin + weaponDamage.chaosMax) / 2;
      const totalWeaponDamage = physDamage + fireDamage + coldDamage + lightningDamage + chaosDamage;
      
      const talentDamageMultiplier = 1 + ((member.talentBonuses?.damageMultiplier || 0) / 100);
      let baseDamage = Math.floor(totalWeaponDamage * talentDamageMultiplier * (bloodlustActive ? 1.3 : 1));
      
      // Apply map affix player damage reduction
      const playerDamageReduction = context.mapAffixEffects?.playerDamageReduction || 0;
      baseDamage = Math.floor(baseDamage * (1 + playerDamageReduction));
      
      const critMultiplier = (char.baseStats?.criticalStrikeMultiplier || 150) / 100;
      const finalDamage = isCrit ? Math.floor(baseDamage * critMultiplier) : baseDamage;
      
      // Determine primary damage type (highest damage type from weapon)
      let primaryDamageType: 'physical' | 'fire' | 'cold' | 'lightning' | 'chaos' = 'physical';
      let highestDamage = physDamage;
      if (fireDamage > highestDamage) { primaryDamageType = 'fire'; highestDamage = fireDamage; }
      if (coldDamage > highestDamage) { primaryDamageType = 'cold'; highestDamage = coldDamage; }
      if (lightningDamage > highestDamage) { primaryDamageType = 'lightning'; highestDamage = lightningDamage; }
      if (chaosDamage > highestDamage) { primaryDamageType = 'chaos'; }
      
      const damageResult = calculatePlayerDamageToEnemy(
        finalDamage,
        primaryDamageType,
        target,
        member.accuracy
      );
      
      if (!damageResult.evaded) {
        target.energyShield = damageResult.esRemaining;
        target.health = damageResult.lifeRemaining;
        member.totalDamage = (member.totalDamage || 0) + damageResult.damage;
        member.damageBySpell = member.damageBySpell || {};
        member.damageBySpell['Auto Attack'] = (member.damageBySpell['Auto Attack'] || 0) + damageResult.damage;
        
        // Process onHit effects
        processOnHitEffects(member, damageResult.damage, currentTick, teamStates);
        
        // Apply lifesteal after damage is dealt
        applyLifesteal(member, damageResult.damage, floatNumbers, currentCombatState);
        
        const jitterX = (Math.random() * 80) - 40;
        const jitterY = (Math.random() * 60) - 30;
        if (isCrit) setScreenShake(prev => prev + 1);
        setTeamFightAnim(prev => prev + 1);
        setEnemyFightAnims(prev => ({ ...prev, [target.id]: (prev[target.id] || 0) + 1 }));
        
        const floatNum = createFloatingNumber(damageResult.damage, isCrit ? 'crit' : 'player', currentCombatState.teamPosition.x + jitterX, currentCombatState.teamPosition.y - 40 + jitterY);
        updateCombatState(prev => ({ 
          ...prev, 
          floatingNumbers: [...prev.floatingNumbers.slice(-20), floatNum, ...floatNumbers],
          combatLog: [...prev.combatLog, { 
            timestamp: totalTime, 
            type: 'damage', 
            source: char.name, 
            target: target.name, 
            value: damageResult.damage, 
            message: `⚔️ ${char.name} attacks ${target.name} for ${damageResult.damage}${isCrit ? ' CRIT!' : ''}!` 
          }] 
        }));
        
        // Auto-attack speed based on weapon (default 1.5s) - affected by haste
        // Tank auto-attack uses weapon attack speed (no GCD)
        const attackSpeed = weaponDamage.attackSpeed || 1.5;
        const attackTime = 1 / attackSpeed; // seconds per attack
        const attackTimeTicks = Math.max(1, Math.floor(secondsToTicks(attackTime)));
        member.castStartTick = currentTick;
        member.castEndTick = currentTick + attackTimeTicks;
        member.castTotalTicks = attackTimeTicks;
        member.isCasting = true; // Prevent spamming auto-attacks
      }
    }
  }
}
