/**
 * Equipment Stats System
 * 
 * Calculates character stats from equipped items, including:
 * - Base item stats (armor, ES, evasion)
 * - Implicit mods
 * - Prefix and suffix mods
 * - Weapon damage for combat
 */

import type { Character, BaseStats } from '../types/character';
import type { Item } from '../types/items';
import type { WeaponProperties, ArmourProperties } from '../types/poeItems';
import type { PoeItem } from './poeCrafting';
import type { RolledAffix, RolledStat } from '../types/poeAffixes';
import { parseStatRange } from '../types/poeAffixes';
import { isOffHandWeapon } from '../utils/equipmentValidation';
import { calculateTalentBonuses } from '../types/talents';
import { ALL_POE_BASE_ITEMS } from '../data/poeBaseItems';

// Stat text pattern matching
// Each entry maps a regex pattern to a stat key and optionally handles special cases
interface StatPattern {
  pattern: RegExp;
  stat: keyof BaseStats | 'allAttributes' | 'allElementalResistances';
  valueExtractor?: (text: string, match: RegExpMatchArray) => number;
}

const STAT_PATTERNS: StatPattern[] = [
  // Life and Mana - flat values
  { pattern: /\+?(\d+)\s*to\s*maximum\s*life/i, stat: 'life' },
  { pattern: /\+?(\d+)\s*to\s*maximum\s*mana/i, stat: 'mana' },
  { pattern: /\+?(\d+)\s*to\s*maximum\s*energy\s*shield/i, stat: 'energyShield' },
  
  // Attributes
  { pattern: /\+?(\d+)\s*to\s*strength/i, stat: 'strength' },
  { pattern: /\+?(\d+)\s*to\s*dexterity/i, stat: 'dexterity' },
  { pattern: /\+?(\d+)\s*to\s*intelligence/i, stat: 'intelligence' },
  { pattern: /\+?(\d+)\s*to\s*all\s*attributes/i, stat: 'allAttributes' },
  
  // Defenses - flat values
  { pattern: /\+?(\d+)\s*to\s*armour/i, stat: 'armor' },
  { pattern: /\+?(\d+)\s*to\s*evasion\s*rating/i, stat: 'evasion' },
  { pattern: /\+?(\d+)\s*to\s*accuracy\s*rating/i, stat: 'accuracy' },
  
  // Resistances
  { pattern: /\+?(\d+)%?\s*to\s*fire\s*resistance/i, stat: 'fireResistance' },
  { pattern: /\+?(\d+)%?\s*to\s*cold\s*resistance/i, stat: 'coldResistance' },
  { pattern: /\+?(\d+)%?\s*to\s*lightning\s*resistance/i, stat: 'lightningResistance' },
  { pattern: /\+?(\d+)%?\s*to\s*chaos\s*resistance/i, stat: 'chaosResistance' },
  { pattern: /\+?(\d+)%?\s*to\s*all\s*elemental\s*resistances/i, stat: 'allElementalResistances' },
  
  // Critical Strike
  { pattern: /\+?(\d+(?:\.\d+)?)%?\s*to\s*critical\s*strike\s*chance/i, stat: 'criticalStrikeChance' },
  { pattern: /\+?(\d+)%?\s*to\s*critical\s*strike\s*multiplier/i, stat: 'criticalStrikeMultiplier' },
  { pattern: /\+?(\d+(?:\.\d+)?)%?\s*to\s*global\s*critical\s*strike\s*chance/i, stat: 'criticalStrikeChance' },
  { pattern: /\+?(\d+)%?\s*to\s*global\s*critical\s*strike\s*multiplier/i, stat: 'criticalStrikeMultiplier' },
  
  // Block
  { pattern: /\+?(\d+)%?\s*chance\s*to\s*block/i, stat: 'blockChance' },
  { pattern: /\+?(\d+)%?\s*to\s*block\s*chance/i, stat: 'blockChance' },
  { pattern: /\+?(\d+)%?\s*chance\s*to\s*block\s*spell/i, stat: 'spellBlockChance' },
  { pattern: /\+?(\d+)%?\s*to\s*spell\s*block\s*chance/i, stat: 'spellBlockChance' },
  { pattern: /\+?(\d+)%?\s*chance\s*to\s*suppress\s*spell/i, stat: 'spellSuppressionChance' },
  
  // Life/Mana Regen
  { pattern: /regenerate\s*(\d+(?:\.\d+)?)%?\s*of\s*(?:maximum\s*)?life\s*per\s*second/i, stat: 'lifeRegeneration' },
  { pattern: /(\d+(?:\.\d+)?)%?\s*(?:of\s*)?life\s*regenerat/i, stat: 'lifeRegeneration' },
  { pattern: /(\d+)%?\s*increased\s*mana\s*regeneration/i, stat: 'manaRegeneration' },
  
  // Damage modifiers
  { pattern: /(\d+)%?\s*increased\s*damage/i, stat: 'increasedDamage' },
  { pattern: /(\d+)%?\s*increased\s*physical\s*damage/i, stat: 'increasedDamage' },
  { pattern: /(\d+)%?\s*increased\s*elemental\s*damage/i, stat: 'increasedDamage' },
  { pattern: /(\d+)%?\s*increased\s*spell\s*damage/i, stat: 'increasedDamage' },
  { pattern: /(\d+)%?\s*increased\s*fire\s*damage/i, stat: 'increasedDamage' },
  { pattern: /(\d+)%?\s*increased\s*cold\s*damage/i, stat: 'increasedDamage' },
  { pattern: /(\d+)%?\s*increased\s*lightning\s*damage/i, stat: 'increasedDamage' },
  
  // Speed
  { pattern: /(\d+)%?\s*increased\s*attack\s*speed/i, stat: 'increasedAttackSpeed' },
  { pattern: /(\d+)%?\s*increased\s*cast\s*speed/i, stat: 'increasedCastSpeed' },
];

// Stat ID to BaseStats mapping for implicits that have statId set
const STAT_ID_TO_BASESTATS: Record<string, keyof BaseStats> = {
  // Attributes
  'base_maximum_life': 'life',
  'base_maximum_mana': 'mana',
  'base_maximum_energy_shield': 'energyShield',
  'base_strength': 'strength',
  'base_dexterity': 'dexterity',
  'base_intelligence': 'intelligence',
  'additional_strength': 'strength',
  'additional_dexterity': 'dexterity',
  'additional_intelligence': 'intelligence',
  'additional_all_attributes': 'strength', // Special handling needed
  
  // Defenses
  'base_armour': 'armor',
  'base_evasion_rating': 'evasion',
  'local_armour': 'armor',
  'local_evasion_rating': 'evasion',
  'local_energy_shield': 'energyShield',
  'local_physical_damage_reduction_rating': 'armor',
  'local_base_evasion_rating': 'evasion',
  'base_physical_damage_reduction_rating': 'armor',
  
  // Resistances
  'base_fire_damage_resistance_%': 'fireResistance',
  'base_cold_damage_resistance_%': 'coldResistance',
  'base_lightning_damage_resistance_%': 'lightningResistance',
  'base_chaos_damage_resistance_%': 'chaosResistance',
  'fire_damage_resistance_%': 'fireResistance',
  'cold_damage_resistance_%': 'coldResistance',
  'lightning_damage_resistance_%': 'lightningResistance',
  'chaos_damage_resistance_%': 'chaosResistance',
  'base_resist_all_elements_%': 'fireResistance', // Special handling needed
  
  // Crit
  'critical_strike_chance_+%': 'criticalStrikeChance',
  'base_critical_strike_multiplier_+': 'criticalStrikeMultiplier',
  'local_critical_strike_chance_+%': 'criticalStrikeChance',
  
  // Block
  'base_block_%': 'blockChance',
  'base_spell_block_%': 'spellBlockChance',
  
  // Accuracy
  'accuracy_rating': 'accuracy',
  'base_accuracy_rating': 'accuracy',
  'local_accuracy_rating': 'accuracy',
  
  // Regen
  'life_regeneration_rate_per_minute_%': 'lifeRegeneration',
  'base_life_regeneration_rate_per_minute': 'lifeRegeneration',
  'mana_regeneration_rate_+%': 'manaRegeneration',
  
  // Speed
  'attack_speed_+%': 'increasedAttackSpeed',
  'cast_speed_+%': 'increasedCastSpeed',
  'local_attack_speed_+%': 'increasedAttackSpeed',
  'base_attack_speed_+%': 'increasedAttackSpeed',
  'base_cast_speed_+%': 'increasedCastSpeed',
};

/**
 * Extract numeric value from a stat - handles both number and [number, number] formats
 */
function extractStatValue(value: number | [number, number] | number[]): number {
  if (Array.isArray(value)) {
    // For damage ranges [min, max], we use the average for stat bonuses
    // But for most stats, take the first value
    if (value.length === 2) {
      return (value[0] + value[1]) / 2;
    }
    return value[0] || 0;
  }
  return value;
}

/**
 * Extract the numeric value from stat text (e.g., "+50 to maximum Life" -> 50)
 */
function extractValueFromText(text: string): number {
  // First, try to find a leading number with optional +/-
  const leadingMatch = text.match(/^[+-]?(\d+(?:\.\d+)?)/);
  if (leadingMatch) {
    return parseFloat(leadingMatch[1]);
  }
  
  // Try to find any number in the text
  const anyNumber = text.match(/(\d+(?:\.\d+)?)/);
  if (anyNumber) {
    return parseFloat(anyNumber[1]);
  }
  
  return 0;
}

/**
 * Parse a single stat from its text and return the stat key and value
 */
function parseStatFromText(text: string): Map<keyof BaseStats, number> {
  const result = new Map<keyof BaseStats, number>();
  
  for (const { pattern, stat, valueExtractor } of STAT_PATTERNS) {
    const match = text.match(pattern);
    if (match) {
      const value = valueExtractor 
        ? valueExtractor(text, match) 
        : (match[1] ? parseFloat(match[1]) : extractValueFromText(text));
      
      if (value === 0 || isNaN(value)) continue;
      
      // Handle special cases
      if (stat === 'allAttributes') {
        // +X to all Attributes adds to STR, DEX, and INT
        result.set('strength', (result.get('strength') || 0) + value);
        result.set('dexterity', (result.get('dexterity') || 0) + value);
        result.set('intelligence', (result.get('intelligence') || 0) + value);
      } else if (stat === 'allElementalResistances') {
        // +X% to all Elemental Resistances adds to Fire, Cold, and Lightning
        result.set('fireResistance', (result.get('fireResistance') || 0) + value);
        result.set('coldResistance', (result.get('coldResistance') || 0) + value);
        result.set('lightningResistance', (result.get('lightningResistance') || 0) + value);
      } else {
        result.set(stat, (result.get(stat) || 0) + value);
      }
      
      // Only match the first pattern that applies
      break;
    }
  }
  
  return result;
}

/**
 * Parse a rolled stat and extract the stat key and value
 */
function parseRolledStat(stat: RolledStat): Map<keyof BaseStats, number> {
  const result = new Map<keyof BaseStats, number>();
  
  // First, try statId if available (for implicits)
  if (stat.statId) {
    const statIdLower = stat.statId.toLowerCase();
    
    // Check for direct mapping
    for (const [key, targetStat] of Object.entries(STAT_ID_TO_BASESTATS)) {
      if (statIdLower === key || statIdLower.includes(key) || key.includes(statIdLower)) {
        const value = extractStatValue(stat.value);
        
        // Handle special cases for all attributes
        if (key === 'additional_all_attributes' || statIdLower.includes('all_attributes')) {
          result.set('strength', value);
          result.set('dexterity', value);
          result.set('intelligence', value);
        } else if (key === 'base_resist_all_elements_%' || statIdLower.includes('resist_all')) {
          result.set('fireResistance', value);
          result.set('coldResistance', value);
          result.set('lightningResistance', value);
        } else {
          result.set(targetStat, value);
        }
        return result;
      }
    }
  }
  
  // Fall back to text-based parsing
  if (stat.text) {
    return parseStatFromText(stat.text);
  }
  
  return result;
}

/**
 * Parse a rolled affix and extract all stat bonuses
 */
function parseAffixStats(affix: RolledAffix): Map<keyof BaseStats, number> {
  const stats = new Map<keyof BaseStats, number>();
  
  for (const stat of affix.stats) {
    const parsedStats = parseRolledStat(stat);
    for (const [key, value] of parsedStats) {
      stats.set(key, (stats.get(key) || 0) + value);
    }
  }
  
  return stats;
}

/**
 * Parse flat added spell damage from an affix
 * Handles "Adds X to Y [Element] Damage to Spells" mods
 */
function parseAddedSpellDamage(affix: RolledAffix, bonuses: Partial<BaseStats>): void {
  for (const stat of affix.stats) {
    const text = stat.text?.toLowerCase() || '';
    const statIdLower = stat.statId?.toLowerCase() || '';
    
    // Check if this is a "adds damage to spells" mod
    if ((text.includes('adds') && text.includes('damage') && text.includes('spell')) ||
        (statIdLower.includes('spell') && (statIdLower.includes('added') || statIdLower.includes('damage')))) {
      
      const value = stat.value;
      
      // Extract min and max values
      let min = 0;
      let max = 0;
      
      if (Array.isArray(value) && value.length === 2) {
        min = value[0];
        max = value[1];
      } else {
        // Parse from text as fallback
        const { min: parsedMin, max: parsedMax } = parseStatRange(stat.text);
        min = parsedMin;
        max = parsedMax;
      }
      
      // Determine damage type and add to appropriate fields
      if (text.includes('physical') || statIdLower.includes('physical')) {
        bonuses.addedPhysicalSpellDamageMin = (bonuses.addedPhysicalSpellDamageMin || 0) + min;
        bonuses.addedPhysicalSpellDamageMax = (bonuses.addedPhysicalSpellDamageMax || 0) + max;
      } else if (text.includes('fire') || statIdLower.includes('fire')) {
        bonuses.addedFireSpellDamageMin = (bonuses.addedFireSpellDamageMin || 0) + min;
        bonuses.addedFireSpellDamageMax = (bonuses.addedFireSpellDamageMax || 0) + max;
      } else if (text.includes('cold') || statIdLower.includes('cold')) {
        bonuses.addedColdSpellDamageMin = (bonuses.addedColdSpellDamageMin || 0) + min;
        bonuses.addedColdSpellDamageMax = (bonuses.addedColdSpellDamageMax || 0) + max;
      } else if (text.includes('lightning') || statIdLower.includes('lightning')) {
        bonuses.addedLightningSpellDamageMin = (bonuses.addedLightningSpellDamageMin || 0) + min;
        bonuses.addedLightningSpellDamageMax = (bonuses.addedLightningSpellDamageMax || 0) + max;
      } else if (text.includes('chaos') || statIdLower.includes('chaos')) {
        bonuses.addedChaosSpellDamageMin = (bonuses.addedChaosSpellDamageMin || 0) + min;
        bonuses.addedChaosSpellDamageMax = (bonuses.addedChaosSpellDamageMax || 0) + max;
      }
    }
  }
}

/**
 * Calculate all stats from an array of equipped items
 */
export function calculateEquipmentStats(items: Item[]): Partial<BaseStats> {
  const bonuses: Partial<BaseStats> = {};
  
  for (const item of items) {
    // Check if this is a PoE item with detailed data
    const poeItem = item._poeItem as PoeItem | undefined;
    
    if (poeItem) {
      // Handle PoE items
      // 1. Base item properties (armor, ES, evasion, etc.)
      if (poeItem.baseItem) {
        const props = poeItem.baseItem.properties;
        
        // Check for armor-type properties
        if (props && typeof props === 'object') {
          const armourProps = props as ArmourProperties;
          
          // Armour value
          if (armourProps.armour) {
            const avgArmour = (armourProps.armour.min + armourProps.armour.max) / 2;
            bonuses.armor = (bonuses.armor || 0) + avgArmour;
          }
          
          // Energy Shield value
          if (armourProps.energy_shield) {
            const avgES = (armourProps.energy_shield.min + armourProps.energy_shield.max) / 2;
            bonuses.energyShield = (bonuses.energyShield || 0) + avgES;
          }
          // Also check for camelCase version
          if ('energyShield' in armourProps && (armourProps as any).energyShield) {
            const avgES = ((armourProps as any).energyShield.min + (armourProps as any).energyShield.max) / 2;
            bonuses.energyShield = (bonuses.energyShield || 0) + avgES;
          }
          
          // Evasion value
          if (armourProps.evasion) {
            const avgEvasion = (armourProps.evasion.min + armourProps.evasion.max) / 2;
            bonuses.evasion = (bonuses.evasion || 0) + avgEvasion;
          }
          
          // Block chance (for shields)
          if (armourProps.block) {
            bonuses.blockChance = (bonuses.blockChance || 0) + armourProps.block;
          }
        }
      }
      
      // 2. Parse implicits
      if (poeItem.implicits) {
        for (const implicit of poeItem.implicits) {
          const affixStats = parseAffixStats(implicit);
          for (const [stat, value] of affixStats) {
            bonuses[stat] = (bonuses[stat] || 0) + value;
          }
          // Also check for flat added spell damage
          parseAddedSpellDamage(implicit, bonuses);
        }
      }
      
      // 3. Parse prefixes
      if (poeItem.prefixes) {
        for (const prefix of poeItem.prefixes) {
          const affixStats = parseAffixStats(prefix);
          for (const [stat, value] of affixStats) {
            bonuses[stat] = (bonuses[stat] || 0) + value;
          }
          // Also check for flat added spell damage
          parseAddedSpellDamage(prefix, bonuses);
        }
      }
      
      // 4. Parse suffixes
      if (poeItem.suffixes) {
        for (const suffix of poeItem.suffixes) {
          const affixStats = parseAffixStats(suffix);
          for (const [stat, value] of affixStats) {
            bonuses[stat] = (bonuses[stat] || 0) + value;
          }
          // Also check for flat added spell damage
          parseAddedSpellDamage(suffix, bonuses);
        }
      }
    } else {
      // Handle legacy items (use the old calculateItemStats approach)
      // This is a simpler fallback
    }
  }
  
  return bonuses;
}

// Weapon damage calculation for combat
export interface WeaponDamage {
  physicalMin: number;
  physicalMax: number;
  fireMin: number;
  fireMax: number;
  coldMin: number;
  coldMax: number;
  lightningMin: number;
  lightningMax: number;
  chaosMin: number;
  chaosMax: number;
  attackSpeed: number;
  criticalStrikeChance: number;
}

// Get weapon damage from a specific weapon item
function getWeaponDamageFromItem(item: Item, verboseLogger?: any, characterName?: string): WeaponDamage | null {
  const poeItem = item._poeItem as PoeItem | undefined;

  // Try to get properties from _poeItem first
  let props: Record<string, unknown> | null = null;
  let allAffixes: RolledAffix[] = [];

  if (poeItem?.baseItem?.properties) {
    props = poeItem.baseItem.properties as Record<string, unknown>;
    allAffixes = [...(poeItem.prefixes || []), ...(poeItem.suffixes || [])];
  }

  // Fallback: Look up base item from ALL_POE_BASE_ITEMS using item.baseId
  if (!props && item.baseId) {
    const baseItem = ALL_POE_BASE_ITEMS.find(b => b.id === item.baseId);
    if (baseItem?.properties) {
      props = baseItem.properties as Record<string, unknown>;
      if (verboseLogger && characterName) {
        verboseLogger.logDebug(0, 'WeaponLoading', `${characterName}: Loaded weapon properties for ${item.name} (${item.baseId})`, {
          itemName: item.name,
          baseId: item.baseId,
          properties: props
        });
      }
    } else {
      if (verboseLogger && characterName) {
        verboseLogger.logDebug(0, 'WeaponLoading', `${characterName}: ⚠️ No base item found for ${item.name} with baseId: ${item.baseId}`, {
          itemName: item.name,
          baseId: item.baseId,
          slot: item.slot
        });
      }
    }
  }

  if (!props || typeof props !== 'object') {
    if (verboseLogger && characterName) {
      verboseLogger.logDebug(0, 'WeaponLoading', `${characterName}: ⚠️ No properties found for weapon ${item.name} (${item.baseId})`, {
        itemName: item.name,
        baseId: item.baseId,
        hasPoeItem: !!poeItem,
        slot: item.slot
      });
    }
    return null;
  }

  // Check for weapon properties - cast through unknown to avoid type error
  const weaponProps = props as unknown as WeaponProperties;
  
  const damage: WeaponDamage = {
    physicalMin: weaponProps.physical_damage_min || 0,
    physicalMax: weaponProps.physical_damage_max || 0,
    fireMin: 0,
    fireMax: 0,
    coldMin: 0,
    coldMax: 0,
    lightningMin: 0,
    lightningMax: 0,
    chaosMin: 0,
    chaosMax: 0,
    attackSpeed: weaponProps.attack_time ? (1000 / weaponProps.attack_time) : 1.0,
    criticalStrikeChance: weaponProps.critical_strike_chance ? weaponProps.critical_strike_chance / 100 : 5,
  };
  
  if (verboseLogger && characterName) {
    verboseLogger.logDebug(0, 'WeaponLoading', `${characterName}: Calculated weapon damage for ${item.name}`, {
      itemName: item.name,
      baseId: item.baseId,
      damage: {
        physical: `${damage.physicalMin}-${damage.physicalMax}`,
        attackSpeed: damage.attackSpeed.toFixed(2),
        crit: `${damage.criticalStrikeChance}%`
      }
    });
  }

  // Add any elemental damage from affixes (allAffixes was already populated above)
  for (const affix of allAffixes) {
    for (const stat of affix.stats) {
      const text = stat.text.toLowerCase();
      
      // Check for added elemental damage
      if (text.includes('adds') && text.includes('damage')) {
        const value = stat.value;
        
        if (Array.isArray(value) && value.length === 2) {
          if (text.includes('fire')) {
            damage.fireMin += value[0];
            damage.fireMax += value[1];
          } else if (text.includes('cold')) {
            damage.coldMin += value[0];
            damage.coldMax += value[1];
          } else if (text.includes('lightning')) {
            damage.lightningMin += value[0];
            damage.lightningMax += value[1];
          } else if (text.includes('chaos')) {
            damage.chaosMin += value[0];
            damage.chaosMax += value[1];
          } else if (text.includes('physical')) {
            damage.physicalMin += value[0];
            damage.physicalMax += value[1];
          }
        } else {
          // Parse from text as fallback
          const { min, max } = parseStatRange(stat.text);
          if (text.includes('fire')) {
            damage.fireMin += min;
            damage.fireMax += max;
          } else if (text.includes('cold')) {
            damage.coldMin += min;
            damage.coldMax += max;
          } else if (text.includes('lightning')) {
            damage.lightningMin += min;
            damage.lightningMax += max;
          } else if (text.includes('chaos')) {
            damage.chaosMin += min;
            damage.chaosMax += max;
          }
        }
      }
    }
  }
  
  // If weapon has no damage at all (all values are 0), return null
  // This will trigger the fallback damage calculation in calculateSkillDamage
  const totalDamage = damage.physicalMin + damage.physicalMax + 
                      damage.fireMin + damage.fireMax +
                      damage.coldMin + damage.coldMax +
                      damage.lightningMin + damage.lightningMax +
                      damage.chaosMin + damage.chaosMax;
  
  if (totalDamage <= 0) {
    if (verboseLogger && characterName) {
      verboseLogger.logDebug(0, 'WeaponLoading', `${characterName}: ❌ Weapon ${item.name} has ZERO damage! This will cause 0 DPS.`, {
        itemName: item.name,
        baseId: item.baseId,
        slot: item.slot,
        weaponProps: {
          physical_damage_min: weaponProps.physical_damage_min,
          physical_damage_max: weaponProps.physical_damage_max,
          attack_time: weaponProps.attack_time,
          critical_strike_chance: weaponProps.critical_strike_chance
        },
        calculatedDamage: damage
      });
    }
    return null;
  }
  
  return damage;
}

// Check if character is dual wielding
export function isDualWielding(items: Item[]): boolean {
  const mainHand = items.find(item => item.slot === 'mainHand');
  const offHand = items.find(item => item.slot === 'offHand');
  
  if (!mainHand || !offHand) return false;
  
  // Check if both are weapons (not shields or quivers)
  return isOffHandWeapon(mainHand) && isOffHandWeapon(offHand);
}

// Get weapon damage from equipped weapons, supporting dual wielding with alternation
// lastWeaponUsed: 'mainHand' | 'offHand' | null - tracks which weapon was used last
export function getEquippedWeaponDamage(
  items: Item[],
  lastWeaponUsed: 'mainHand' | 'offHand' | null = null,
  verboseLogger?: any,
  characterName?: string
): WeaponDamage | null {
  const mainHand = items.find(item => item.slot === 'mainHand');
  const offHand = items.find(item => item.slot === 'offHand');
  
  // Check if dual wielding
  const dualWielding = mainHand && offHand && isOffHandWeapon(mainHand) && isOffHandWeapon(offHand);
  
  let weaponDamage: WeaponDamage | null = null;
  
  if (dualWielding) {
    // Dual wielding: alternate between weapons
    // If lastWeaponUsed is null or 'offHand', use mainHand next
    // If lastWeaponUsed is 'mainHand', use offHand next
    const useMainHand = lastWeaponUsed !== 'mainHand';
    const weaponToUse = useMainHand ? mainHand : offHand;
    
    if (weaponToUse) {
      weaponDamage = getWeaponDamageFromItem(weaponToUse, verboseLogger, characterName);
      if (weaponDamage) {
        // Apply dual wielding attack speed bonus: 10% more attack speed
        weaponDamage.attackSpeed = weaponDamage.attackSpeed * 1.1;
      }
    }
  } else if (mainHand) {
    // Single weapon or no dual wielding: use main hand
    weaponDamage = getWeaponDamageFromItem(mainHand, verboseLogger, characterName);
  }
  
  // Add flat damage from ALL equipped items (rings, amulets, belts, etc.)
  if (weaponDamage) {
    for (const item of items) {
      // Skip the weapon itself (already counted)
      if (item.slot === 'mainHand' || item.slot === 'offHand') continue;
      
      const poeItem = item._poeItem as PoeItem | undefined;
      if (!poeItem) continue;
      
      // Check implicits, prefixes, and suffixes for added damage
      const allAffixes = [
        ...(poeItem.implicits || []),
        ...(poeItem.prefixes || []),
        ...(poeItem.suffixes || [])
      ];
      
      for (const affix of allAffixes) {
        for (const stat of affix.stats) {
          const statIdLower = stat.statId?.toLowerCase() || '';
          const text = stat.text?.toLowerCase() || '';
          
          // Check for added attack damage
          if (statIdLower.includes('attack') && (statIdLower.includes('added') || statIdLower.includes('damage'))) {
            const value = stat.value;
            
            if (Array.isArray(value) && value.length === 2) {
              if (statIdLower.includes('physical')) {
                weaponDamage.physicalMin += value[0];
                weaponDamage.physicalMax += value[1];
              } else if (statIdLower.includes('fire')) {
                weaponDamage.fireMin += value[0];
                weaponDamage.fireMax += value[1];
              } else if (statIdLower.includes('cold')) {
                weaponDamage.coldMin += value[0];
                weaponDamage.coldMax += value[1];
              } else if (statIdLower.includes('lightning')) {
                weaponDamage.lightningMin += value[0];
                weaponDamage.lightningMax += value[1];
              } else if (statIdLower.includes('chaos')) {
                weaponDamage.chaosMin += value[0];
                weaponDamage.chaosMax += value[1];
              }
            }
          } else if (text.includes('adds') && text.includes('damage') && text.includes('attack')) {
            // Parse from text as fallback
            const { min, max } = parseStatRange(stat.text);
            if (text.includes('physical')) {
              weaponDamage.physicalMin += min;
              weaponDamage.physicalMax += max;
            } else if (text.includes('fire')) {
              weaponDamage.fireMin += min;
              weaponDamage.fireMax += max;
            } else if (text.includes('cold')) {
              weaponDamage.coldMin += min;
              weaponDamage.coldMax += max;
            } else if (text.includes('lightning')) {
              weaponDamage.lightningMin += min;
              weaponDamage.lightningMax += max;
            } else if (text.includes('chaos')) {
              weaponDamage.chaosMin += min;
              weaponDamage.chaosMax += max;
            }
          }
        }
      }
    }
    
    if (verboseLogger && characterName) {
      verboseLogger.logDebug(0, 'WeaponLoading', `${characterName}: Final weapon damage (including equipment bonuses)`, {
        damage: {
          physical: `${weaponDamage.physicalMin}-${weaponDamage.physicalMax}`,
          fire: `${weaponDamage.fireMin}-${weaponDamage.fireMax}`,
          cold: `${weaponDamage.coldMin}-${weaponDamage.coldMax}`,
          lightning: `${weaponDamage.lightningMin}-${weaponDamage.lightningMax}`,
          chaos: `${weaponDamage.chaosMin}-${weaponDamage.chaosMax}`,
          attackSpeed: weaponDamage.attackSpeed.toFixed(2),
          crit: `${weaponDamage.criticalStrikeChance}%`
        }
      });
    }
  }
  
  return weaponDamage;
}

/**
 * Calculate final character stats (base + equipment)
 */
export function calculateTotalCharacterStats(
  character: Character,
  inventory: Item[]
): BaseStats {
  // Get all equipped items
  const equippedItems: Item[] = [];
  
  for (const [, itemId] of Object.entries(character.equippedGear)) {
    if (itemId) {
      const item = inventory.find(i => i.id === itemId);
      if (item) {
        equippedItems.push(item);
      }
    }
  }
  
  // Start with character's base stats
  const totalStats: BaseStats = { ...character.baseStats };
  
  // Add equipment bonuses
  const equipmentBonuses = calculateEquipmentStats(equippedItems);
  
  for (const [stat, value] of Object.entries(equipmentBonuses)) {
    const key = stat as keyof BaseStats;
    if (typeof totalStats[key] === 'number' && typeof value === 'number') {
      (totalStats as unknown as Record<string, number>)[key] = (totalStats[key] as number) + value;
    }
  }
  
  // Apply attribute-derived stats (PoE style)
  // Note: We need to calculate the BONUS from equipment attributes, not double-count base
  const equipStr = (equipmentBonuses.strength || 0);
  const equipInt = (equipmentBonuses.intelligence || 0);
  const equipDex = (equipmentBonuses.dexterity || 0);
  
  // +1 Life per 2 Strength from equipment
  totalStats.life += Math.floor(equipStr / 2);
  totalStats.maxLife = totalStats.life;
  
  // +1 Mana per 2 Intelligence from equipment
  totalStats.mana += Math.floor(equipInt / 2);
  totalStats.maxMana = totalStats.mana;
  
  // +2 Accuracy per Dexterity from equipment
  totalStats.accuracy += equipDex * 2;
  
  // Apply talent bonuses
  const classId = character.classId;
  if (classId && character.selectedTalents) {
    const talentBonuses = calculateTalentBonuses(classId, character.selectedTalents);
    
    // Apply flat talent bonuses to block chance and spell block chance
    totalStats.blockChance += talentBonuses.blockBonus;
    totalStats.spellBlockChance += talentBonuses.spellBlockBonus;
    
    // Apply blockToSpellBlock conversion (Duel Warden talent)
    if (talentBonuses.blockToSpellBlockPercent > 0 && totalStats.blockChance > 0) {
      const convertedSpellBlock = Math.floor(totalStats.blockChance * (talentBonuses.blockToSpellBlockPercent / 100));
      totalStats.spellBlockChance += convertedSpellBlock;
    }
    
    // Apply spell suppression chance
    totalStats.spellSuppressionChance += talentBonuses.spellSuppressionChance;
    
    // Apply crit chance bonus
    totalStats.criticalStrikeChance += talentBonuses.critBonus;
    
    // Apply percentage-based multipliers
    if (talentBonuses.healthMultiplier > 0) {
      totalStats.life = Math.floor(totalStats.life * (1 + talentBonuses.healthMultiplier / 100));
      totalStats.maxLife = totalStats.life;
    }
    if (talentBonuses.armorMultiplier > 0) {
      totalStats.armor = Math.floor(totalStats.armor * (1 + talentBonuses.armorMultiplier / 100));
    }
    if (talentBonuses.evasionMultiplier > 0) {
      totalStats.evasion = Math.floor(totalStats.evasion * (1 + talentBonuses.evasionMultiplier / 100));
    }
    
    // Apply resistance bonus
    if (talentBonuses.resistanceBonus > 0) {
      totalStats.fireResistance += talentBonuses.resistanceBonus;
      totalStats.coldResistance += talentBonuses.resistanceBonus;
      totalStats.lightningResistance += talentBonuses.resistanceBonus;
    }
    
    // Apply chaos resistance
    if (talentBonuses.chaosResistance > 0) {
      totalStats.chaosResistance += talentBonuses.chaosResistance;
    }
    
    // Apply elemental resistance bonus
    if (talentBonuses.elementalResistanceBonus > 0) {
      totalStats.fireResistance += talentBonuses.elementalResistanceBonus;
      totalStats.coldResistance += talentBonuses.elementalResistanceBonus;
      totalStats.lightningResistance += talentBonuses.elementalResistanceBonus;
    }
    
    // Apply Energy Shield bonuses
    if (talentBonuses.maxESBonus > 0) {
      totalStats.energyShield = Math.floor(totalStats.energyShield * (1 + talentBonuses.maxESBonus / 100));
    }
    
    // Apply ES recharge rate bonus
    if (talentBonuses.esRechargeRate > 0) {
      totalStats.energyShieldRechargeRate = totalStats.energyShieldRechargeRate * (1 + talentBonuses.esRechargeRate / 100);
    }
    
    // Apply ES recharge delay reduction (negative values reduce delay)
    if (talentBonuses.esRechargeDelay !== 0) {
      totalStats.energyShieldRechargeDelay = totalStats.energyShieldRechargeDelay * (1 - talentBonuses.esRechargeDelay / 100);
    }
    
    // Apply ES regeneration bonus
    if (talentBonuses.esRegeneration > 0) {
      // ES regeneration is a flat % of max ES per second
      totalStats.lifeRegeneration += talentBonuses.esRegeneration;
    }
    
    // Apply max life reduction (e.g., Crystalline Ascendant talent)
    if (talentBonuses.maxLifeReduction > 0) {
      totalStats.life = Math.floor(totalStats.life * (1 - talentBonuses.maxLifeReduction / 100));
      totalStats.maxLife = totalStats.life;
    }
    
    // Apply cast speed bonus
    if (talentBonuses.castSpeedBonus > 0) {
      totalStats.increasedCastSpeed += talentBonuses.castSpeedBonus;
    }
    
    // Apply mana regeneration multiplier
    if (talentBonuses.manaRegenMultiplier > 0) {
      totalStats.manaRegeneration = totalStats.manaRegeneration * (1 + talentBonuses.manaRegenMultiplier / 100);
    }
    
    // Apply increased damage bonus
    if (talentBonuses.damageMultiplier > 0) {
      totalStats.increasedDamage += talentBonuses.damageMultiplier;
    }
  }
  
  // Cap resistances at 75% (default cap)
  totalStats.fireResistance = Math.min(75, totalStats.fireResistance);
  totalStats.coldResistance = Math.min(75, totalStats.coldResistance);
  totalStats.lightningResistance = Math.min(75, totalStats.lightningResistance);
  // Chaos resistance cap is also 75%
  totalStats.chaosResistance = Math.min(75, totalStats.chaosResistance);
  
  // Cap block chances at 75%
  totalStats.blockChance = Math.min(75, totalStats.blockChance);
  totalStats.spellBlockChance = Math.min(75, totalStats.spellBlockChance);
  
  return totalStats;
}
