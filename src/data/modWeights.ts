/**
 * PoE Mod Spawn Weights
 * 
 * This file contains spawn weight data extracted from PoE's mod database.
 * Weights determine how likely a mod is to spawn on an item during crafting/drops.
 * 
 * Weight scale:
 * - 0: Cannot spawn
 * - 100-500: Uncommon
 * - 500-1000: Common
 * - 1000-2000: Very common
 * - 2000+: Extremely common
 * 
 * The system uses:
 * 1. Group weights: Base weight for the mod group (e.g., "IncreasedLife")
 * 2. Tier weights: Modifier based on tier within the group (higher tiers = rarer)
 * 3. Tag filtering: Some mods only appear on certain item types
 */

export interface ModSpawnWeight {
  group: string;
  baseWeight: number;
  tags?: string[]; // Item tags this mod can spawn on (empty = all items)
  excludeTags?: string[]; // Item tags this mod cannot spawn on
}

/**
 * Base spawn weights for mod groups
 * These are derived from PoE's mods.json spawn_weights
 * Weights represent the relative chance of a mod group being selected
 */
export const MOD_GROUP_WEIGHTS: Record<string, ModSpawnWeight> = {
  // === LIFE & RESOURCES ===
  'IncreasedLife': { group: 'IncreasedLife', baseWeight: 1000 },
  'IncreasedMana': { group: 'IncreasedMana', baseWeight: 1000 },
  'LifeRegeneration': { group: 'LifeRegeneration', baseWeight: 1000 },
  'ManaRegeneration': { group: 'ManaRegeneration', baseWeight: 1000, tags: ['ring', 'amulet', 'belt'] },
  'PercentManaRegeneration': { group: 'PercentManaRegeneration', baseWeight: 1000 },
  
  // === ATTRIBUTES ===
  'Strength': { group: 'Strength', baseWeight: 1000 },
  'Dexterity': { group: 'Dexterity', baseWeight: 1000 },
  'Intelligence': { group: 'Intelligence', baseWeight: 1000 },
  'AllAttributes': { group: 'AllAttributes', baseWeight: 500 }, // Rarer
  'StrengthDexterity': { group: 'StrengthDexterity', baseWeight: 500 },
  'StrengthIntelligence': { group: 'StrengthIntelligence', baseWeight: 500 },
  'DexterityIntelligence': { group: 'DexterityIntelligence', baseWeight: 500 },
  
  // === RESISTANCES ===
  'FireResistance': { group: 'FireResistance', baseWeight: 1000 },
  'ColdResistance': { group: 'ColdResistance', baseWeight: 1000 },
  'LightningResistance': { group: 'LightningResistance', baseWeight: 1000 },
  'ChaosResistance': { group: 'ChaosResistance', baseWeight: 500 }, // Rarer
  'AllResistances': { group: 'AllResistances', baseWeight: 250 }, // Very rare
  'FireColdResistance': { group: 'FireColdResistance', baseWeight: 500 },
  'FireLightningResistance': { group: 'FireLightningResistance', baseWeight: 500 },
  'ColdLightningResistance': { group: 'ColdLightningResistance', baseWeight: 500 },
  
  // === DEFENSE (LOCAL) ===
  'LocalIncreasedArmour': { group: 'LocalIncreasedArmour', baseWeight: 1000, tags: ['str_armour', 'str_dex_armour', 'str_int_armour'] },
  'LocalIncreasedEvasion': { group: 'LocalIncreasedEvasion', baseWeight: 1000, tags: ['dex_armour', 'str_dex_armour', 'dex_int_armour'] },
  'LocalIncreasedEnergyShield': { group: 'LocalIncreasedEnergyShield', baseWeight: 1000, tags: ['int_armour', 'str_int_armour', 'dex_int_armour'] },
  'IncreasedArmourPercent': { group: 'IncreasedArmourPercent', baseWeight: 1000 },
  'IncreasedEvasionPercent': { group: 'IncreasedEvasionPercent', baseWeight: 1000 },
  'IncreasedEnergyShieldPercent': { group: 'IncreasedEnergyShieldPercent', baseWeight: 1000 },
  
  // === DEFENSE (BLOCK) ===
  'BlockChance': { group: 'BlockChance', baseWeight: 1000, tags: ['shield', 'staff'] },
  'SpellBlockChance': { group: 'SpellBlockChance', baseWeight: 500, tags: ['shield'] },
  
  // === OFFENSE (WEAPON LOCAL) ===
  'LocalIncreasedPhysicalDamagePercent': { group: 'LocalIncreasedPhysicalDamagePercent', baseWeight: 1000, tags: ['weapon'] },
  'LocalPhysicalDamagePercent': { group: 'LocalPhysicalDamagePercent', baseWeight: 1000, tags: ['weapon'] },
  'LocalIncreasedPhysicalDamagePercentAndAccuracyRating': { group: 'LocalIncreasedPhysicalDamagePercentAndAccuracyRating', baseWeight: 750, tags: ['weapon'] },
  'LocalAddedPhysicalDamage': { group: 'LocalAddedPhysicalDamage', baseWeight: 1000, tags: ['weapon'] },
  'LocalAddedFireDamage': { group: 'LocalAddedFireDamage', baseWeight: 750, tags: ['weapon'] },
  'LocalAddedColdDamage': { group: 'LocalAddedColdDamage', baseWeight: 750, tags: ['weapon'] },
  'LocalAddedLightningDamage': { group: 'LocalAddedLightningDamage', baseWeight: 750, tags: ['weapon'] },
  'LocalAddedChaosDamage': { group: 'LocalAddedChaosDamage', baseWeight: 500, tags: ['weapon'] },
  
  // === OFFENSE (GLOBAL ADDED DAMAGE) ===
  'PhysicalDamage': { group: 'PhysicalDamage', baseWeight: 500, tags: ['ring', 'amulet', 'gloves'] },
  'FireDamage': { group: 'FireDamage', baseWeight: 500, tags: ['ring', 'amulet', 'gloves'] },
  'ColdDamage': { group: 'ColdDamage', baseWeight: 500, tags: ['ring', 'amulet', 'gloves'] },
  'LightningDamage': { group: 'LightningDamage', baseWeight: 500, tags: ['ring', 'amulet', 'gloves'] },
  'ChaosDamage': { group: 'ChaosDamage', baseWeight: 250, tags: ['ring', 'amulet', 'gloves'] },
  
  // === ATTACK ===
  'IncreasedAccuracy': { group: 'IncreasedAccuracy', baseWeight: 1000 },
  'LocalIncreasedAccuracy': { group: 'LocalIncreasedAccuracy', baseWeight: 1000, tags: ['weapon'] },
  'IncreasedAttackSpeed': { group: 'IncreasedAttackSpeed', baseWeight: 750 },
  'LocalIncreasedAttackSpeed': { group: 'LocalIncreasedAttackSpeed', baseWeight: 750, tags: ['weapon'] },
  
  // === CRIT ===
  'CriticalStrikeChance': { group: 'CriticalStrikeChance', baseWeight: 500 },
  'LocalCriticalStrikeChance': { group: 'LocalCriticalStrikeChance', baseWeight: 500, tags: ['weapon'] },
  'CriticalStrikeMultiplier': { group: 'CriticalStrikeMultiplier', baseWeight: 400 },
  'GlobalCriticalStrikeMultiplier': { group: 'GlobalCriticalStrikeMultiplier', baseWeight: 400 },
  
  // === CASTER ===
  'SpellDamage': { group: 'SpellDamage', baseWeight: 750, tags: ['wand', 'sceptre', 'shield', 'amulet'] },
  'IncreasedCastSpeed': { group: 'IncreasedCastSpeed', baseWeight: 500 },
  'SpellCriticalStrikeChance': { group: 'SpellCriticalStrikeChance', baseWeight: 500 },
  
  // === ELEMENTAL DAMAGE ===
  'IncreasedWeaponElementalDamagePercent': { group: 'IncreasedWeaponElementalDamagePercent', baseWeight: 750, tags: ['weapon', 'ring', 'amulet'] },
  'ElementalDamagePercent': { group: 'ElementalDamagePercent', baseWeight: 500 },
  
  // === UTILITY ===
  'MovementSpeed': { group: 'MovementSpeed', baseWeight: 500, tags: ['boots'] },
  'StunRecovery': { group: 'StunRecovery', baseWeight: 1000 },
  'StunDuration': { group: 'StunDuration', baseWeight: 500 },
  'Rarity': { group: 'Rarity', baseWeight: 1000 },
  
  // === LEECH ===
  'LifeLeech': { group: 'LifeLeech', baseWeight: 300, tags: ['ring', 'amulet', 'gloves'] },
  'ManaLeech': { group: 'ManaLeech', baseWeight: 300, tags: ['ring', 'amulet', 'gloves'] },
  'LifeGainOnHit': { group: 'LifeGainOnHit', baseWeight: 500 },
  'ManaGainOnHit': { group: 'ManaGainOnHit', baseWeight: 500 },
};

/**
 * Get the spawn weight for a mod group
 * Returns the base weight, or a default if not found
 */
export function getModGroupWeight(groupName: string): number {
  // Direct match
  if (MOD_GROUP_WEIGHTS[groupName]) {
    return MOD_GROUP_WEIGHTS[groupName].baseWeight;
  }
  
  // Try partial match (for groups like "LocalIncreasedArmourAndEvasion")
  for (const [key, data] of Object.entries(MOD_GROUP_WEIGHTS)) {
    if (groupName.includes(key) || key.includes(groupName)) {
      return data.baseWeight;
    }
  }
  
  // Default weight for unknown groups
  return 500;
}

/**
 * Check if a mod group can spawn on an item with given tags
 */
export function canModSpawnOnItem(groupName: string, itemTags: string[]): boolean {
  const modData = MOD_GROUP_WEIGHTS[groupName];
  if (!modData) return true; // Unknown groups can spawn anywhere
  
  // Check exclusions first
  if (modData.excludeTags) {
    for (const tag of modData.excludeTags) {
      if (itemTags.includes(tag)) return false;
    }
  }
  
  // If no specific tags required, can spawn anywhere
  if (!modData.tags || modData.tags.length === 0) return true;
  
  // Check if item has any of the required tags
  for (const tag of modData.tags) {
    if (itemTags.includes(tag)) return true;
  }
  
  return false;
}

/**
 * Tier weight multipliers
 * Higher tiers (lower numbers) are rarer
 * These are percentage multipliers applied to the base weight
 */
export const TIER_WEIGHT_MULTIPLIERS: Record<number, number> = {
  1: 0.10,   // T1 - Very rare (10% of base weight)
  2: 0.18,   // T2
  3: 0.28,   // T3
  4: 0.40,   // T4
  5: 0.55,   // T5
  6: 0.72,   // T6
  7: 0.85,   // T7
  8: 1.00,   // T8+ - Full weight
};

/**
 * Get the weight multiplier for a tier
 * Tier 1 is best/rarest, higher tiers are more common
 */
export function getTierWeightMultiplier(tier: number): number {
  if (tier <= 0) return 1.0;
  if (tier >= 8) return 1.0;
  return TIER_WEIGHT_MULTIPLIERS[tier] || 1.0;
}

/**
 * Calculate final spawn weight for a mod tier
 */
export function calculateModSpawnWeight(
  groupName: string, 
  tierNumber: number, 
  _maxTier: number,
  itemTags: string[] = []
): number {
  // Check if mod can spawn on this item type
  if (!canModSpawnOnItem(groupName, itemTags)) {
    return 0;
  }
  
  const baseWeight = getModGroupWeight(groupName);
  const tierMultiplier = getTierWeightMultiplier(tierNumber);
  
  return Math.floor(baseWeight * tierMultiplier);
}

