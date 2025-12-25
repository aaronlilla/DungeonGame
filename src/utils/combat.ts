import type { EnemyPack, EnemyType } from '../types/dungeon';
import { getEnemyById } from '../types/dungeon';
import type { Character, BaseStats } from '../types/character';
import type { Item } from '../types/items';
import type { EnemyBehavior, TeamMemberState, PlayerAbility, FloatingNumber } from '../types/combat';
import { calculatePassiveBonuses, getDefaultClassForRole } from '../types/passives';
import type { PassiveEffect } from '../types/passives';
import { calculateTalentBonuses, type TalentBonuses } from '../types/talents';
import { calculateEquipmentStats, getEquippedWeaponDamage, isDualWielding } from '../systems/equipmentStats';

// Determine enemy behavior based on their icon/type
export function getEnemyBehavior(enemyId: string): EnemyBehavior {
  // Boss behavior - minibosses and final boss: tankbuster + AoE pulse + melee
  const bossEnemies = ['bone_golem', 'death_knight', 'lich', 'necromancer_lord'];
  // Tankbusters - cast Crushing Blow on tank every 3s (uninterruptable)
  const tankbusters = ['bone_crusher', 'grave_executioner', 'tomb_smasher'];
  // Casters - kickable single target, bolt random teammates
  const casters = ['skeleton_mage', 'crypt_warlock', 'dark_sorcerer', 'necromancer'];
  // Archers - unkickable single target
  const archers = ['skeleton_archer', 'bone_thrower'];
  if (bossEnemies.includes(enemyId)) return 'boss';
  if (tankbusters.includes(enemyId)) return 'tankbuster';
  if (casters.includes(enemyId)) return 'caster';
  if (archers.includes(enemyId)) return 'archer';
  return 'melee';
}

// Get the dominant enemy type in a pack
export function getPackDominantType(pack: EnemyPack): EnemyType {
  for (const { enemyId } of pack.enemies) {
    const enemy = getEnemyById(enemyId);
    if (enemy?.type === 'boss') return 'boss';
    if (enemy?.type === 'miniboss') return 'miniboss';
  }
  for (const { enemyId } of pack.enemies) {
    const enemy = getEnemyById(enemyId);
    if (enemy?.type === 'elite') return 'elite';
  }
  return 'normal';
}

export function getPackMobCount(pack: EnemyPack): number {
  return pack.enemies.reduce((sum, e) => sum + e.count, 0);
}

/**
 * Apply team-affecting talents from all team members to each member
 */
function applyTeamAffectingTalents(
  teamStates: TeamMemberState[],
  team: Character[]
): TeamMemberState[] {
  // Create a map of character IDs to their talent bonuses for quick lookup
  const talentBonusesMap = new Map<string, import('../types/talents').TalentBonuses>();
  team.forEach((char, idx) => {
    if (teamStates[idx]) {
      talentBonusesMap.set(char.id, teamStates[idx].talentBonuses!);
    }
  });
  
  // Apply team-affecting talents from each member to all other members
  return teamStates.map((member) => {
    let updatedMember = { ...member };
    
    // Ensure evasion is always a number (not undefined)
    if (updatedMember.evasion === undefined) {
      updatedMember.evasion = 0;
    }
    
    // Skip if this member doesn't have talent bonuses
    if (!updatedMember.talentBonuses) return updatedMember;
    
    // Store reference to avoid repeated null checks
    const memberTalentBonuses = updatedMember.talentBonuses;
    
    // Check all team members for team-affecting talents
    team.forEach((char, charIdx) => {
      if (char.id === member.id) return; // Skip self
      
      const otherMemberBonuses = talentBonusesMap.get(char.id);
      if (!otherMemberBonuses) return;

      // Apply allyProtection effects
      otherMemberBonuses.specialEffects.forEach(effect => {
        if (effect.type === 'allyProtection') {
          // Apply based on condition
          const condition = effect.condition || '';
          if (condition === 'physical') {
            memberTalentBonuses.damageReduction += effect.value;
          } else if (condition === 'block') {
            memberTalentBonuses.blockBonus += effect.value;
          } else if (condition === 'armor') {
            memberTalentBonuses.armorMultiplier += effect.value;
          } else if (condition === 'elemental') {
            memberTalentBonuses.elementalDamageReduction = (memberTalentBonuses.elementalDamageReduction || 0) + effect.value;
          } else if (condition === 'suppression') {
            memberTalentBonuses.spellSuppressionChance += effect.value;
          } else if (condition === 'evasion') {
            memberTalentBonuses.evasionMultiplier += effect.value;
          } else if (condition === 'attackDamage') {
            memberTalentBonuses.attackDamageReduction += effect.value;
          } else if (condition === 'evade') {
            memberTalentBonuses.evadeChance += effect.value;
          }
        } else if (effect.type === 'allyEvadeChance') {
          memberTalentBonuses.evadeChance += effect.value;
        } else if (effect.type === 'allyEvasionRating') {
          memberTalentBonuses.evasionMultiplier += effect.value;
        } else if (effect.type === 'allySpellDamageReduction') {
          memberTalentBonuses.spellDamageReduction += effect.value;
        } else if (effect.type === 'allyChaosResistance') {
          // Store in a way that can be applied to resistances
          memberTalentBonuses.chaosResistance += effect.value;
        } else if (effect.type === 'allyElementalDamageReduction') {
          memberTalentBonuses.elementalDamageReduction = (memberTalentBonuses.elementalDamageReduction || 0) + effect.value;
        } else if (effect.type === 'allyDamageReduction') {
          memberTalentBonuses.damageReduction += effect.value;
        } else if (effect.type === 'allyMaxLifeBonus') {
          memberTalentBonuses.healthMultiplier += effect.value;
        } else if (effect.type === 'allyMaxLifeFromHealing') {
          // This is applied dynamically when healing occurs
        } else if (effect.type === 'allyDRFromHealing') {
          // This is applied dynamically when healing occurs
        } else if (effect.type === 'allyLifeRegenFromHealing') {
          // This is applied dynamically when healing occurs
        } else if (effect.type === 'allyHitDRFromHealing') {
          // This is applied dynamically when healing occurs
        } else if (effect.type === 'allyLifeRecoveryFromLifeSpent') {
          // This is applied dynamically when life is spent
        } else if (effect.type === 'allySuppressionShare') {
          // Share suppression chance
          const sourceSuppression = otherMemberBonuses.spellSuppressionChance || 0;
          memberTalentBonuses.spellSuppressionChance += Math.floor(sourceSuppression * (effect.value / 100));
        } else if (effect.type === 'allyAccuracyDebuffShare') {
          // Share accuracy debuff
          const sourceAccuracyDebuff = otherMemberBonuses.enemyAccuracyReduction || 0;
          memberTalentBonuses.enemyAccuracyReduction += Math.floor(sourceAccuracyDebuff * (effect.value / 100));
        } else if (effect.type === 'allyESFromYours') {
          // Share ES percentage
          const sourceES = teamStates[charIdx]?.maxEnergyShield || 0;
          memberTalentBonuses.maxESBonus += Math.floor(sourceES * (effect.value / 100));
        } else if (effect.type === 'allyDRWhileRecharging') {
          // Applied dynamically when ES is recharging
        } else if (effect.type === 'allyDRWhileHighLife') {
          // Applied dynamically based on health
        } else if (effect.type === 'allyTakeLessDamage') {
          memberTalentBonuses.damageReduction += effect.value;
        } else if (effect.type === 'allyCritDamageReduction') {
          memberTalentBonuses.enemyCritDamageReduction += effect.value;
        } else if (effect.type === 'regenShareToAllies') {
          // Applied dynamically in buff processing
        }
      });
    });
    
    return updatedMember;
  });
}

// Initialize team states from characters (PoE style stats)
// Includes passive bonuses, MoP-style talent bonuses, and equipment bonuses
export function initTeamStates(team: Character[], inventory: Item[] = []): TeamMemberState[] {
  let teamStates = team.map(char => {
    // Get passive bonuses from allocated nodes (legacy system)
    const classId = char.classId || getDefaultClassForRole(char.role);
    const passiveBonuses = classId 
      ? calculatePassiveBonuses(classId, char.allocatedPassives || [])
      : { stats: {} as Partial<BaseStats>, effects: [] as PassiveEffect[] };
    
    // Get talent bonuses from MoP-style talents
    const talentBonuses: TalentBonuses = classId && char.selectedTalents
      ? calculateTalentBonuses(classId, char.selectedTalents)
      : {
          damageMultiplier: 0, healingMultiplier: 0, damageReduction: 0,
          armorMultiplier: 0, evasionMultiplier: 0, healthMultiplier: 0, manaRegenMultiplier: 0,
          manaCostReduction: 0, cooldownReduction: 0, blockBonus: 0,
          blockEffectiveness: 0, critBonus: 0, castSpeedBonus: 0,
          lifesteal: 0, thorns: 0, resistanceBonus: 0,
          enemyAttackSpeedReduction: 0, enemyAccuracyReduction: 0,
          attackDamageReduction: 0, physicalDamageReductionFromArmor: 0,
          armorEffectivenessVsAttacks: 100, evasionToMitigationPercent: 0, selfDamageReduction: 0,
          spellBlockBonus: 0, nonBlockedDamageReduction: 0, blockToSpellBlockPercent: 0,
          spellSuppressionChance: 0, spellSuppressionEffect: 0,
          evadeChanceToSuppressionPercent: 0, evadeChance: 0,
          enemyCritChanceReduction: 0, enemyCritMultiplierReduction: 0,
          elementalDamageReduction: 0, hitDamageReduction: 0,
          enemyCritDamageReduction: 0, suppressedNoCrit: false,
          armorReduction: 0, allyEvadeChance: 0,
          esRechargeRate: 0, esRechargeDelay: 0, esRecoveryBonus: 0,
          esRegeneration: 0, spellDamageReduction: 0, maxESBonus: 0,
          maxLifeReduction: 0, elementalResistanceBonus: 0, esLeech: 0,
          allySpellDamageReduction: 0,
          chaosResistance: 0, maxChaosResistance: 0, chaosDamageReduction: 0,
          allyChaosResistance: 0, allyElementalDamageReduction: 0,
          dodgeChance: 0, allyEvasionRating: 0, maxESReduction: 0,
          singleTargetHealingBonus: 0, areaHealingReduction: 0,
          areaTargetReduction: 0, areaHealingPerTargetBonus: 0,
          healingReduction: 0, lowLifeHealingBonus: 0, healingCannotCrit: false,
          hotEffectivenessReduction: 0, manaCostIncrease: 0,
          lifeCostReduction: 0, lifeSpentReturn: 0, lifeCostIncrease: 0,
          healingOutputBonus: 0, selfHealFromHealing: 0, lowLifeDamageReduction: 0,
          lifeRegenOnLifeSpend: 0, allyLifeRecoveryFromLifeSpent: 0, allyDRFromHealing: 0,
          allyLifeRegenFromHealing: 0, healingOverTimeFromHeal: 0, bigLifeLossDR: 0,
          allyHitDRFromHealing: 0, lowLifeHealingIncrease: 0, lifeCostFloor: 0,
          lifeCostChaosDamage: 0, endlessMartyrdom: false, lifeCostStackingHealing: 0,
          allyMaxLifeFromHealing: 0,
          allyDamageReduction: 0, lowLifeAllyDR: 0, dotDamageReduction: 0,
          defensiveCooldownReduction: 0, defensiveCooldownEffect: 0, defensiveCooldownCDR: 0,
          crisisProtocolDR: 0, damageRedistribution: 0, failSafeFormationDR: 0,
          directHealBonus: 0, healCooldownIncrease: 0, healingLifeRegen: 0,
          overhealingToRegen: 0, allyMaxLifeBonus: 0, allyCritDamageReduction: 0,
          allyDealLessDamage: 0, allyTakeLessDamage: 0, battlePlanAlphaDR: 0,
          perfectExecutionDR: 0, strategicMastery: false,
          lifeRegenRate: 0, regenDuration: 0, flatLifeRegenPerSecond: 0,
          lowLifeRegenRate: 0, regenRatePerEffect: 0, regenRateSlower: 0,
          physicalDRWhileRegen: 0, elementalDRWhileRegen: 0, maxResWhileRegen: 0,
          regenRateAfterHit: 0, dotDRWhileRegen: 0, instantRegenPercent: 0,
          regenEffectMore: 0, regenSpeedFaster: 0, excessRegenToES: 0,
          additionalLifeRegenPerSecond: 0, regenEffectMoreBonus: 0, regenCannotBeReduced: false,
          drWhileRegen: 0, regenShareToAllies: 0, regenDurationReduction: 0,
          specialEffects: []
        };
    
    // Get equipment bonuses from equipped items
    const equippedItems: Item[] = [];
    for (const itemId of Object.values(char.equippedGear)) {
      if (itemId) {
        const item = inventory.find(i => i.id === itemId);
        if (item) equippedItems.push(item);
      }
    }
    const equipmentBonuses = calculateEquipmentStats(equippedItems);
    
    // Helper to get stat with passive + equipment bonus
    const getStat = (baseStat: number, key: keyof BaseStats): number => {
      const passiveBonus = ((passiveBonuses.stats[key] as number) || 0);
      const equipBonus = ((equipmentBonuses[key] as number) || 0);
      return baseStat + passiveBonus + equipBonus;
    };
    
    // Calculate final stats with passive and equipment bonuses
    let maxLife = getStat(char.baseStats.maxLife, 'maxLife');
    let maxMana = getStat(char.baseStats.maxMana, 'maxMana');
    let armor = getStat(char.baseStats.armor, 'armor');
    let evasion = getStat(char.baseStats.evasion ?? 0, 'evasion');
    let energyShield = getStat(char.baseStats.energyShield ?? 0, 'energyShield');
    
    // Apply talent percentage bonuses
    if (talentBonuses.healthMultiplier > 0) {
      maxLife = Math.floor(maxLife * (1 + talentBonuses.healthMultiplier / 100));
    }
    if (talentBonuses.armorMultiplier > 0) {
      armor = Math.floor(armor * (1 + talentBonuses.armorMultiplier / 100));
    }
    if (talentBonuses.evasionMultiplier > 0) {
      const baseEvasion = evasion;
      evasion = Math.floor(baseEvasion * (1 + talentBonuses.evasionMultiplier / 100));
    }
    if (talentBonuses.maxESBonus > 0) {
      const baseES = energyShield;
      energyShield = Math.floor(baseES * (1 + talentBonuses.maxESBonus / 100));
    }
    if (talentBonuses.maxLifeReduction > 0) {
      maxLife = Math.floor(maxLife * (1 - talentBonuses.maxLifeReduction / 100));
    }
    
    // Get base resistances
    let fireResistance = getStat(char.baseStats.fireResistance, 'fireResistance');
    let coldResistance = getStat(char.baseStats.coldResistance, 'coldResistance');
    let lightningResistance = getStat(char.baseStats.lightningResistance, 'lightningResistance');
    let chaosResistance = getStat(char.baseStats.chaosResistance, 'chaosResistance');
    
    // Apply special effects from passives
    let blockChance = getStat(char.baseStats.blockChance, 'blockChance');
    let spellBlockChance = getStat(char.baseStats.spellBlockChance, 'spellBlockChance');
    let spellSuppressionChance = getStat(char.baseStats.spellSuppressionChance, 'spellSuppressionChance');
    let critChance = getStat(char.baseStats.criticalStrikeChance, 'criticalStrikeChance');
    let critMultiplier = getStat(char.baseStats.criticalStrikeMultiplier, 'criticalStrikeMultiplier');
    
    // Apply talent flat bonuses
    blockChance += talentBonuses.blockBonus;
    spellBlockChance += talentBonuses.spellBlockBonus;
    
    // Apply blockToSpellBlock conversion (Duel Warden talent)
    if (talentBonuses.blockToSpellBlockPercent > 0 && blockChance > 0) {
      const convertedSpellBlock = Math.floor(blockChance * (talentBonuses.blockToSpellBlockPercent / 100));
      spellBlockChance += convertedSpellBlock;
    }
    
    spellSuppressionChance += talentBonuses.spellSuppressionChance;
    
    // Apply evadeChanceToSuppression conversion (Shadow Warden talent)
    if (talentBonuses.evadeChanceToSuppressionPercent > 0 && talentBonuses.evadeChance > 0) {
      // Convert a percentage of evade chance to spell suppression
      const evadeChancePercent = talentBonuses.evadeChance;
      const conversionPercent = talentBonuses.evadeChanceToSuppressionPercent;
      const convertedSuppression = Math.floor(evadeChancePercent * (conversionPercent / 100));
      spellSuppressionChance += convertedSuppression;
    }
    
    critChance += talentBonuses.critBonus;
    
    // Apply evasion bonus (evadeChance is a flat % chance, not a rating)
    // This is separate from evasion rating - it's a direct chance to evade
    if (talentBonuses.evadeChance > 0) {
      // Store in a way that can be used during combat
      // For now, we'll add it to evasion rating as a workaround
      // In a full implementation, this would be a separate evade chance check
      evasion += Math.floor(evasion * (talentBonuses.evadeChance / 100));
    }
    
    // Apply resistance bonus
    const resistanceBonus = talentBonuses.resistanceBonus || 0;
    if (resistanceBonus > 0) {
      fireResistance = Math.min(75, fireResistance + resistanceBonus);
      coldResistance = Math.min(75, coldResistance + resistanceBonus);
      lightningResistance = Math.min(75, lightningResistance + resistanceBonus);
    }
    
    // Apply talent chaos resistance
    if (talentBonuses.chaosResistance > 0) {
      chaosResistance = Math.min(75, chaosResistance + talentBonuses.chaosResistance);
    }
    
    // Apply elemental resistance bonus
    if (talentBonuses.elementalResistanceBonus > 0) {
      fireResistance = Math.min(75, fireResistance + talentBonuses.elementalResistanceBonus);
      coldResistance = Math.min(75, coldResistance + talentBonuses.elementalResistanceBonus);
      lightningResistance = Math.min(75, lightningResistance + talentBonuses.elementalResistanceBonus);
    }
    
    // Apply percentage-based effects from passives
    passiveBonuses.effects.forEach(effect => {
      switch (effect.type) {
        case 'blockChance':
          blockChance += effect.value;
          break;
        case 'spellBlockChance':
          spellBlockChance += effect.value;
          break;
        case 'spellSuppression':
          spellSuppressionChance += effect.value;
          break;
        case 'critChance':
          critChance += effect.value;
          break;
        case 'critMultiplier':
          critMultiplier += effect.value;
          break;
        // Other effects are handled during combat
      }
    });
    
    // Check if dual wielding
    const dualWielding = isDualWielding(equippedItems);
    
    // Apply dual wielding block bonus: +20% block chance
    if (dualWielding) {
      blockChance += 20;
    }
    
    // Get weapon damage from equipped weapons (start with mainHand for dual wielding)
    const weaponDamage = getEquippedWeaponDamage(equippedItems, null);
    
    return {
      id: char.id,
      name: char.name,
      role: char.role,
      health: maxLife,
      maxHealth: maxLife,
      mana: maxMana,
      maxMana: maxMana,
      armor: Math.max(0, armor), // Armor can't go negative
      evasion: Math.max(0, evasion) as number, // Always a number, not undefined
      energyShield: Math.max(0, energyShield) as number, // Always a number, not undefined
      maxEnergyShield: Math.max(0, energyShield) as number, // Always a number, not undefined
      isDead: false,
      gcdEndTick: 0,
      blockChance: Math.min(75, Math.max(0, blockChance)), // Cap at 75%
      spellBlockChance: Math.min(75, Math.max(0, spellBlockChance)),
      spellSuppressionChance: Math.min(100, Math.max(0, spellSuppressionChance)),
      fireResistance: fireResistance,
      coldResistance: coldResistance,
      lightningResistance: lightningResistance,
      chaosResistance: chaosResistance,
      criticalStrikeChance: Math.max(0, critChance),
      criticalStrikeMultiplier: Math.max(100, critMultiplier),
      totalDamage: 0,
      totalHealing: 0,
      // Store passive effects for combat system to use
      passiveEffects: passiveBonuses.effects,
      // Store talent bonuses for combat system
      talentBonuses,
      // Store weapon damage for attack skills
      weaponDamage: weaponDamage || undefined,
      // Dual wielding tracking
      lastWeaponUsed: null, // Start with null (will use mainHand first)
      isDualWielding: dualWielding
    };
  });
  
  // Apply team-affecting talents from all team members
  const updatedTeamStates = applyTeamAffectingTalents(teamStates, team);
  
  // Ensure all members have required properties as numbers (not undefined)
  return updatedTeamStates.map((member): TeamMemberState => {
    const result: TeamMemberState = {
      ...member,
      evasion: member.evasion ?? 0,
      energyShield: member.energyShield ?? 0,
      maxEnergyShield: member.maxEnergyShield ?? 0,
    };
    return result;
  });
}

/**
 * Update a single team member's stats from their character data
 * Used when a character levels up mid-combat
 */
export function updateTeamMemberStats(
  member: TeamMemberState,
  character: Character,
  inventory: Item[],
  allTeamMembers: Character[]
): TeamMemberState {
  // Get passive bonuses from allocated nodes (legacy system)
  const classId = character.classId || getDefaultClassForRole(character.role);
  const passiveBonuses = classId 
    ? calculatePassiveBonuses(classId, character.allocatedPassives || [])
    : { stats: {} as Partial<BaseStats>, effects: [] as PassiveEffect[] };
  
  // Get talent bonuses from MoP-style talents
  const talentBonuses: TalentBonuses = classId && character.selectedTalents
    ? calculateTalentBonuses(classId, character.selectedTalents)
    : {
        damageMultiplier: 0, healingMultiplier: 0, damageReduction: 0,
        armorMultiplier: 0, evasionMultiplier: 0, healthMultiplier: 0, manaRegenMultiplier: 0,
        manaCostReduction: 0, cooldownReduction: 0, blockBonus: 0,
        blockEffectiveness: 0, critBonus: 0, castSpeedBonus: 0,
        lifesteal: 0, thorns: 0, resistanceBonus: 0,
        enemyAttackSpeedReduction: 0, enemyAccuracyReduction: 0,
        attackDamageReduction: 0, physicalDamageReductionFromArmor: 0,
        armorEffectivenessVsAttacks: 100, evasionToMitigationPercent: 0, selfDamageReduction: 0,
        spellBlockBonus: 0, nonBlockedDamageReduction: 0, blockToSpellBlockPercent: 0,
        spellSuppressionChance: 0, spellSuppressionEffect: 0,
        evadeChanceToSuppressionPercent: 0, evadeChance: 0,
        enemyCritChanceReduction: 0, enemyCritMultiplierReduction: 0,
        elementalDamageReduction: 0, hitDamageReduction: 0,
        enemyCritDamageReduction: 0, suppressedNoCrit: false,
        armorReduction: 0, allyEvadeChance: 0,
        esRechargeRate: 0, esRechargeDelay: 0, esRecoveryBonus: 0,
        esRegeneration: 0, spellDamageReduction: 0, maxESBonus: 0,
        maxLifeReduction: 0, elementalResistanceBonus: 0, esLeech: 0,
        allySpellDamageReduction: 0,
        chaosResistance: 0, maxChaosResistance: 0, chaosDamageReduction: 0,
        allyChaosResistance: 0, allyElementalDamageReduction: 0,
        dodgeChance: 0, allyEvasionRating: 0, maxESReduction: 0,
        singleTargetHealingBonus: 0, areaHealingReduction: 0,
        areaTargetReduction: 0, areaHealingPerTargetBonus: 0,
        healingReduction: 0, lowLifeHealingBonus: 0, healingCannotCrit: false,
        hotEffectivenessReduction: 0, manaCostIncrease: 0,
        lifeCostReduction: 0, lifeSpentReturn: 0, lifeCostIncrease: 0,
        healingOutputBonus: 0, selfHealFromHealing: 0, lowLifeDamageReduction: 0,
        lifeRegenOnLifeSpend: 0, allyLifeRecoveryFromLifeSpent: 0, allyDRFromHealing: 0,
        allyLifeRegenFromHealing: 0, healingOverTimeFromHeal: 0, bigLifeLossDR: 0,
        allyHitDRFromHealing: 0, lowLifeHealingIncrease: 0, lifeCostFloor: 0,
        lifeCostChaosDamage: 0, endlessMartyrdom: false, lifeCostStackingHealing: 0,
        allyMaxLifeFromHealing: 0,
        allyDamageReduction: 0, lowLifeAllyDR: 0, dotDamageReduction: 0,
        defensiveCooldownReduction: 0, defensiveCooldownEffect: 0, defensiveCooldownCDR: 0,
        crisisProtocolDR: 0, damageRedistribution: 0, failSafeFormationDR: 0,
        directHealBonus: 0, healCooldownIncrease: 0, healingLifeRegen: 0,
        overhealingToRegen: 0, allyMaxLifeBonus: 0, allyCritDamageReduction: 0,
        allyDealLessDamage: 0, allyTakeLessDamage: 0, battlePlanAlphaDR: 0,
        perfectExecutionDR: 0, strategicMastery: false,
        lifeRegenRate: 0, regenDuration: 0, flatLifeRegenPerSecond: 0,
        lowLifeRegenRate: 0, regenRatePerEffect: 0, regenRateSlower: 0,
        physicalDRWhileRegen: 0, elementalDRWhileRegen: 0, maxResWhileRegen: 0,
        regenRateAfterHit: 0, dotDRWhileRegen: 0, instantRegenPercent: 0,
        regenEffectMore: 0, regenSpeedFaster: 0, excessRegenToES: 0,
        additionalLifeRegenPerSecond: 0, regenEffectMoreBonus: 0, regenCannotBeReduced: false,
        drWhileRegen: 0, regenShareToAllies: 0, regenDurationReduction: 0,
        specialEffects: []
      };
  
  // Get equipment bonuses from equipped items
  const equippedItems: Item[] = [];
  for (const itemId of Object.values(character.equippedGear)) {
    if (itemId) {
      const item = inventory.find(i => i.id === itemId);
      if (item) equippedItems.push(item);
    }
  }
  const equipmentBonuses = calculateEquipmentStats(equippedItems);
  
  // Helper to get stat with passive + equipment bonus
  const getStat = (baseStat: number, key: keyof BaseStats): number => {
    const passiveBonus = ((passiveBonuses.stats[key] as number) || 0);
    const equipBonus = ((equipmentBonuses[key] as number) || 0);
    return baseStat + passiveBonus + equipBonus;
  };
  
  // Calculate final stats with passive and equipment bonuses
  let maxLife = getStat(character.baseStats.maxLife, 'maxLife');
  let maxMana = getStat(character.baseStats.maxMana, 'maxMana');
  let armor = getStat(character.baseStats.armor, 'armor');
  let evasion = getStat(character.baseStats.evasion ?? 0, 'evasion');
  let energyShield = getStat(character.baseStats.energyShield ?? 0, 'energyShield');
  
  // Apply talent percentage bonuses
  if (talentBonuses.healthMultiplier > 0) {
    maxLife = Math.floor(maxLife * (1 + talentBonuses.healthMultiplier / 100));
  }
  if (talentBonuses.armorMultiplier > 0) {
    armor = Math.floor(armor * (1 + talentBonuses.armorMultiplier / 100));
  }
  if (talentBonuses.evasionMultiplier > 0) {
    const baseEvasion = evasion;
    evasion = Math.floor(baseEvasion * (1 + talentBonuses.evasionMultiplier / 100));
  }
  if (talentBonuses.maxESBonus > 0) {
    const baseES = energyShield;
    energyShield = Math.floor(baseES * (1 + talentBonuses.maxESBonus / 100));
  }
  if (talentBonuses.maxLifeReduction > 0) {
    maxLife = Math.floor(maxLife * (1 - talentBonuses.maxLifeReduction / 100));
  }
  
  // Get base resistances
  let fireResistance = getStat(character.baseStats.fireResistance, 'fireResistance');
  let coldResistance = getStat(character.baseStats.coldResistance, 'coldResistance');
  let lightningResistance = getStat(character.baseStats.lightningResistance, 'lightningResistance');
  let chaosResistance = getStat(character.baseStats.chaosResistance, 'chaosResistance');
  
  // Apply special effects from passives
  let blockChance = getStat(character.baseStats.blockChance, 'blockChance');
  let spellBlockChance = getStat(character.baseStats.spellBlockChance, 'spellBlockChance');
  let spellSuppressionChance = getStat(character.baseStats.spellSuppressionChance, 'spellSuppressionChance');
  let critChance = getStat(character.baseStats.criticalStrikeChance, 'criticalStrikeChance');
  let critMultiplier = getStat(character.baseStats.criticalStrikeMultiplier, 'criticalStrikeMultiplier');
  
  // Apply talent flat bonuses
  blockChance += talentBonuses.blockBonus;
  spellBlockChance += talentBonuses.spellBlockBonus;
  
  // Apply blockToSpellBlock conversion (Duel Warden talent)
  if (talentBonuses.blockToSpellBlockPercent > 0 && blockChance > 0) {
    const convertedSpellBlock = Math.floor(blockChance * (talentBonuses.blockToSpellBlockPercent / 100));
    spellBlockChance += convertedSpellBlock;
  }
  
  spellSuppressionChance += talentBonuses.spellSuppressionChance;
  
  // Apply evadeChanceToSuppression conversion (Shadow Warden talent)
  if (talentBonuses.evadeChanceToSuppressionPercent > 0 && talentBonuses.evadeChance > 0) {
    // Convert a percentage of evade chance to spell suppression
    const evadeChancePercent = talentBonuses.evadeChance;
    const conversionPercent = talentBonuses.evadeChanceToSuppressionPercent;
    const convertedSuppression = Math.floor(evadeChancePercent * (conversionPercent / 100));
    spellSuppressionChance += convertedSuppression;
  }
  
  critChance += talentBonuses.critBonus;
  
  // Apply evasion bonus
  if (talentBonuses.evadeChance > 0) {
    evasion += Math.floor(evasion * (talentBonuses.evadeChance / 100));
  }
  
  // Apply resistance bonus
  const resistanceBonus = talentBonuses.resistanceBonus || 0;
  if (resistanceBonus > 0) {
    fireResistance = Math.min(75, fireResistance + resistanceBonus);
    coldResistance = Math.min(75, coldResistance + resistanceBonus);
    lightningResistance = Math.min(75, lightningResistance + resistanceBonus);
  }
  
  // Apply talent chaos resistance
  if (talentBonuses.chaosResistance > 0) {
    chaosResistance = Math.min(75, chaosResistance + talentBonuses.chaosResistance);
  }
  
  // Apply elemental resistance bonus
  if (talentBonuses.elementalResistanceBonus > 0) {
    fireResistance = Math.min(75, fireResistance + talentBonuses.elementalResistanceBonus);
    coldResistance = Math.min(75, coldResistance + talentBonuses.elementalResistanceBonus);
    lightningResistance = Math.min(75, lightningResistance + talentBonuses.elementalResistanceBonus);
  }
  
  // Apply percentage-based effects from passives
  passiveBonuses.effects.forEach(effect => {
    switch (effect.type) {
      case 'blockChance':
        blockChance += effect.value;
        break;
      case 'spellBlockChance':
        spellBlockChance += effect.value;
        break;
      case 'spellSuppression':
        spellSuppressionChance += effect.value;
        break;
      case 'critChance':
        critChance += effect.value;
        break;
      case 'critMultiplier':
        critMultiplier += effect.value;
        break;
    }
  });
  
  // Get weapon damage from equipped main hand weapon
  const weaponDamage = getEquippedWeaponDamage(equippedItems);
  
  // Full heal and full mana on level up (mid-combat)
  const newHealth = maxLife;
  const newMana = maxMana;
  
  // Create updated member with new stats
  const updatedMember: TeamMemberState = {
    ...member,
    maxHealth: maxLife,
    health: newHealth,
    maxMana: maxMana,
    mana: newMana,
    armor: Math.max(0, armor),
    evasion: Math.max(0, evasion) as number,
    energyShield: Math.max(0, energyShield) as number,
    maxEnergyShield: Math.max(0, energyShield) as number,
    blockChance: Math.min(75, Math.max(0, blockChance)),
    spellBlockChance: Math.min(75, Math.max(0, spellBlockChance)),
    spellSuppressionChance: Math.min(100, Math.max(0, spellSuppressionChance)),
    fireResistance: fireResistance,
    coldResistance: coldResistance,
    lightningResistance: lightningResistance,
    chaosResistance: chaosResistance,
    criticalStrikeChance: Math.max(0, critChance),
    criticalStrikeMultiplier: Math.max(100, critMultiplier),
    passiveEffects: passiveBonuses.effects,
    talentBonuses,
    weaponDamage: weaponDamage || undefined
  };
  
  // Apply team-affecting talents from all team members
  const teamStatesWithThisMember = [updatedMember];
  const withTeamTalents = applyTeamAffectingTalents(teamStatesWithThisMember, allTeamMembers);
  
  return withTeamTalents[0];
}

// Initialize player abilities
export function initAbilities(): PlayerAbility[] {
  return [
    { id: 'bloodlust', name: 'Bloodlust', icon: '⚡', cooldown: 600, currentCooldown: 0, duration: 15, description: '+30% Haste for 15s (10m CD)' },
    { id: 'battlerez', name: 'Battle Res', icon: '✟', cooldown: 240, currentCooldown: 0, description: 'Resurrect a random dead ally (4m CD)' },
  ];
}

// Counter for unique floating number IDs
let floatingNumberId = 0;

// Create a floating damage/heal number with position
export function createFloatingNumber(value: number | string, type: 'player' | 'enemy' | 'heal' | 'crit' | 'blocked' | 'levelup', x?: number, y?: number, level?: number): FloatingNumber {
  floatingNumberId++;
  // Ensure numeric values are integers (no decimals) and handle NaN
  let displayValue: number | string;
  if (typeof value === 'number') {
    // Safety check for NaN and invalid numbers
    if (isNaN(value) || !isFinite(value)) {
      displayValue = 0; // Default to 0 if NaN or infinite
    } else {
      displayValue = Math.floor(value);
    }
  } else {
    displayValue = value;
  }
  
  // Large random offset to spread numbers out significantly and minimize overlap
  // Level up numbers are centered (no random offset)
  const offsetX = type === 'levelup' ? 0 : (Math.random() - 0.5) * 200; // Wide horizontal spread
  const offsetY = type === 'levelup' ? -80 : (Math.random() - 0.5) * 100 - 60; // Tall vertical spread, mostly above center
  return {
    id: `fn-${floatingNumberId}`,
    value: displayValue,
    type,
    offsetX,
    offsetY,
    x: x ?? 0,
    y: y ?? 0,
    timestamp: Date.now(),
    level
  };
}

