/**
 * Path of Exile style crafting system
 * Uses actual PoE affix data to generate items
 */

import type { 
  ItemClassAffixes, 
  AffixGroup, 
  AffixTier, 
  RolledAffix, 
  RolledStat 
} from '../types/poeAffixes';
import { parseStatRange, rollStatValue, formatStatWithValue } from '../types/poeAffixes';
import type { PoeBaseItem, PoeItemClass } from '../types/poeItems';
import { ALL_POE_BASE_ITEMS, POE_IMPLICIT_MODS } from '../data/poeBaseItems';
import { getStatDisplayText } from './statTranslations';
import { getModGroupWeight, getTierWeightMultiplier, canModSpawnOnItem } from '../data/modWeights';

// Import all affix data files
import ringAffixes from '../items/ring_affixes.json';
import strengthBodyArmour from '../items/strength_body_armour_affixes.json';
import dexterityBodyArmour from '../items/dexterity_body_armour_affixes.json';
import intelligenceBodyArmour from '../items/intelligence_body_armour_affixes.json';
import strengthDexBodyArmour from '../items/strength_dexterity_body_armour_affixes.json';
import strengthIntBodyArmour from '../items/strength_intelligence_body_armour_affixes.json';
import dexIntBodyArmour from '../items/dexterity_intelligence_body_armour_affixes.json';
import strengthHelmet from '../items/strength_helmet_affixes.json';
import dexterityHelmet from '../items/dexterity_helmet_affixes.json';
import intelligenceHelmet from '../items/intelligence_helmet_affixes.json';
import strengthDexHelmet from '../items/strength_dexterity_helmets_affixes.json';
import strengthIntHelmet from '../items/strength_intelligence_helmets_affixes.json';
import dexIntHelmet from '../items/dexterity_intelligence_helmets_affixes.json';
import strengthGloves from '../items/strength_gloves_affixes.json';
import dexterityGloves from '../items/dexterity_gloves_affixes.json';
import intelligenceGloves from '../items/intelligence_gloves_affixes.json';
import strengthDexGloves from '../items/strength_dex_gloves_affixes.json';
import strengthIntGloves from '../items/strength_intelligence_gloves_affixes.json';
import dexIntGloves from '../items/dexterity_intelligence_gloves_affixes.json';
import strengthBoots from '../items/strength_boots_affixes.json';
import dexterityBoots from '../items/dexterity_boots_affixes.json';
import intelligenceBoots from '../items/intelligence_boots_affixes.json';
import strengthDexBoots from '../items/strength_dexterity_boots_affixes.json';
import strengthIntBoots from '../items/strength_intelligence_boots_affixes.json';
import dexIntBoots from '../items/dexterity_intelligence_boots_affixes.json';
import shieldsArmour from '../items/shields_armour.standard.affixes.json';
import shieldsEvasion from '../items/shields_evasion.standard.affixes.json';
import shieldsES from '../items/shields_energy_shield.standard.affixes.json';
import shieldsArmourEvasion from '../items/shields_armour_evasion.standard.affixes.json';
import shieldsArmourES from '../items/shields_armour_energy_shield.standard.affixes.json';
import shieldsEvasionES from '../items/shields_evasion_energy_shield.standard.affixes.json';
import oneHandSword from '../items/one_handed_sword_affixes.json';
import thrustingOneHandSword from '../items/thrusting_one_handed_sword_affixes.json';
import oneHandAxe from '../items/one_handed_axes_affixes.json';
import oneHandMace from '../items/one_handed_mace_affixes.json';
import dagger from '../items/dagger_affixes.json';
import runeDagger from '../items/rune_dagger_affixes.json';
import claw from '../items/claw_affixes.json';
import wand from '../items/wand_affixes.json';
import sceptre from '../items/sceptre_affixes.json';
import twoHandAxe from '../items/two_handed_axes_affixes.json';
import twoHandMace from '../items/two_handed_mace_affixes.json';
import staff from '../items/staff_affixes.json';
import warstaff from '../items/warstaff_affixes.json';
import bow from '../items/bow_affixes.json';
import quiver from '../items/quiver_affixes.json';

// ===== FORMAT NORMALIZATION =====
// The affix JSON files come in different formats, we normalize them all

interface RawStatObject {
  stat?: string;
  id?: string;
  text?: string;
  min?: number;
  max?: number;
}

interface RawModTier {
  name?: string;
  modifier?: string;
  ilvl?: number;
  iLvl?: number;
  stats?: (string | RawStatObject)[];
  tags?: string[];
}

interface RawAffixGroup {
  group: string;
  stats?: string[];
  description?: string | string[];
  modifiers?: RawModTier[];
  mods?: RawModTier[];
  tiers?: RawModTier[];  // Some files use 'tiers' instead of 'modifiers'
}

interface RawAffixData {
  item_class?: string;
  weapon_type?: string;
  itemClass?: string;
  base_attribute?: string;
  prefixes?: RawAffixGroup[];
  suffixes?: RawAffixGroup[];
  affixes?: {
    prefixes?: RawAffixGroup[];
    suffixes?: RawAffixGroup[];
  };
}

/**
 * Normalize a raw mod tier to our standard format
 */
function normalizeTier(raw: RawModTier): AffixTier | null {
  if (!raw) return null;
  
  // Ensure name is always a string (some raw data has objects)
  let name = 'Unknown';
  if (typeof raw.name === 'string' && raw.name) {
    name = raw.name;
  } else if (typeof raw.modifier === 'string' && raw.modifier) {
    name = raw.modifier;
  }
  
  const ilvl = raw.ilvl || raw.iLvl || 1;
  
  // Handle missing or invalid stats
  if (!raw.stats || !Array.isArray(raw.stats) || raw.stats.length === 0) {
    return {
      name,
      ilvl,
      stats: [],
      tags: raw.tags || []
    };
  }
  
  // Normalize stats - could be string[] or object[]
  const stats: string[] = raw.stats.map(s => {
    if (typeof s === 'string') return s;
    // Object format with 'text' field (most reliable)
    if (s && typeof s === 'object' && 'text' in s && typeof s.text === 'string') {
      return s.text;
    }
    // Object format: { stat, min, max }
    if (s && typeof s === 'object' && 'stat' in s) {
      const statObj = s as { stat: string; min: number; max: number };
      const statText = statObj.stat;
      
      // Check if the stat text already has a # placeholder
      if (statText.includes('#')) {
        // Replace # with the range or fixed value
        if (statObj.min === statObj.max) {
          return statText.replace('#', String(statObj.min));
        }
        return statText.replace('#', `(${statObj.min}-${statObj.max})`);
      }
      
      // Check if stat already has embedded range(s) - malformed dual-stat data
      const hasExistingRange = /\(\d+-\d+\)/.test(statText);
      if (hasExistingRange) {
        // Just prepend our range; formatStatWithValue will roll all ranges
        if (statObj.min === statObj.max) {
          return `+${statObj.min} ${statText}`;
        }
        return `+(${statObj.min}-${statObj.max}) ${statText}`;
      }
      
      // No placeholder - prepend the value/range
      if (statObj.min === statObj.max) {
        return `+${statObj.min} ${statText}`;
      }
      return `+(${statObj.min}-${statObj.max}) ${statText}`;
    }
    // Object format: { id, min, max } - fallback, use id as stat name
    if (s && typeof s === 'object' && 'id' in s && 'min' in s && 'max' in s) {
      const idObj = s as { id: string; min: number; max: number };
      const statName = idObj.id.replace(/_/g, ' ');
      if (idObj.min === idObj.max) {
        return `+${idObj.min} ${statName}`;
      }
      return `+(${idObj.min}-${idObj.max}) ${statName}`;
    }
    return String(s);
  });
  
  return {
    name,
    ilvl,
    stats,
    tags: raw.tags || []
  };
}

/**
 * Normalize a raw affix group to our standard format
 */
function normalizeGroup(raw: RawAffixGroup): AffixGroup | null {
  if (!raw || !raw.group) return null;
  
  // Look for tiers in multiple possible fields
  const tierData = raw.modifiers || raw.mods || raw.tiers || [];
  
  // Handle non-array tiers
  if (!Array.isArray(tierData)) {
    return {
      group: raw.group,
      stats: raw.stats || [],
      modifiers: []
    };
  }
  
  const normalizedTiers = tierData
    .map(normalizeTier)
    .filter((t): t is AffixTier => t !== null && t.stats.length > 0);
  
  // Get stats from either 'stats' or 'description' field
  let groupStats: string[] = [];
  if (raw.stats && Array.isArray(raw.stats)) {
    groupStats = raw.stats;
  } else if (raw.description) {
    if (Array.isArray(raw.description)) {
      groupStats = raw.description;
    } else if (typeof raw.description === 'string') {
      groupStats = [raw.description];
    }
  }
  
  return {
    group: raw.group,
    stats: groupStats,
    modifiers: normalizedTiers
  };
}

/**
 * Normalize raw affix data to our standard format
 */
function normalizeAffixData(raw: RawAffixData): ItemClassAffixes {
  // Handle nested affixes structure (shield format)
  let prefixes = raw.prefixes || raw.affixes?.prefixes || [];
  let suffixes = raw.suffixes || raw.affixes?.suffixes || [];
  
  // Some files have placeholder strings instead of arrays - handle gracefully
  if (!Array.isArray(prefixes)) {
    console.warn('Invalid prefixes data, using empty array');
    prefixes = [];
  }
  if (!Array.isArray(suffixes)) {
    console.warn('Invalid suffixes data, using empty array');
    suffixes = [];
  }
  
  const normalizedPrefixes = prefixes
    .map(normalizeGroup)
    .filter((g): g is AffixGroup => g !== null && g.modifiers.length > 0);
  
  const normalizedSuffixes = suffixes
    .map(normalizeGroup)
    .filter((g): g is AffixGroup => g !== null && g.modifiers.length > 0);
  
  return {
    item_class: raw.item_class || raw.weapon_type || raw.itemClass || 'Unknown',
    base_attribute: raw.base_attribute,
    prefixes: normalizedPrefixes,
    suffixes: normalizedSuffixes
  };
}

// ===== AFFIX DATA INDEX =====

// Map of item class + attribute to affix data
type AffixDataKey = string;
const AFFIX_DATA: Map<AffixDataKey, ItemClassAffixes> = new Map();

// Initialize affix data map
function initializeAffixData() {
  if (AFFIX_DATA.size > 0) return; // Already initialized
  
  // Rings - also used for Amulets and Belts as fallback
  const normalizedRing = normalizeAffixData(ringAffixes as RawAffixData);
  AFFIX_DATA.set('Ring', normalizedRing);
  AFFIX_DATA.set('Amulet', normalizedRing); // Fallback - amulets use similar mods
  AFFIX_DATA.set('Belt', normalizedRing);   // Fallback - belts use similar mods
  
  // Body Armour - use strength as default for any with broken data
  const strBodyArmour = normalizeAffixData(strengthBodyArmour as RawAffixData);
  AFFIX_DATA.set('Body Armour:strength', strBodyArmour);
  
  // Some files have placeholder data - use strength body armour as fallback
  const dexBodyData = normalizeAffixData(dexterityBodyArmour as unknown as RawAffixData);
  AFFIX_DATA.set('Body Armour:dexterity', dexBodyData.prefixes.length > 0 ? dexBodyData : strBodyArmour);

  const intBodyData = normalizeAffixData(intelligenceBodyArmour as unknown as RawAffixData);
  AFFIX_DATA.set('Body Armour:intelligence', intBodyData.prefixes.length > 0 ? intBodyData : strBodyArmour);

  const strDexBodyData = normalizeAffixData(strengthDexBodyArmour as unknown as RawAffixData);
  AFFIX_DATA.set('Body Armour:str_dex', strDexBodyData.prefixes.length > 0 ? strDexBodyData : strBodyArmour);

  const strIntBodyData = normalizeAffixData(strengthIntBodyArmour as unknown as RawAffixData);
  AFFIX_DATA.set('Body Armour:str_int', strIntBodyData.prefixes.length > 0 ? strIntBodyData : strBodyArmour);
  
  const dexIntBodyData = normalizeAffixData(dexIntBodyArmour as RawAffixData);
  AFFIX_DATA.set('Body Armour:dex_int', dexIntBodyData.prefixes.length > 0 ? dexIntBodyData : strBodyArmour);
  
  // Helmets
  AFFIX_DATA.set('Helmet:strength', normalizeAffixData(strengthHelmet as RawAffixData));
  AFFIX_DATA.set('Helmet:dexterity', normalizeAffixData(dexterityHelmet as RawAffixData));
  AFFIX_DATA.set('Helmet:intelligence', normalizeAffixData(intelligenceHelmet as RawAffixData));
  AFFIX_DATA.set('Helmet:str_dex', normalizeAffixData(strengthDexHelmet as RawAffixData));
  AFFIX_DATA.set('Helmet:str_int', normalizeAffixData(strengthIntHelmet as RawAffixData));
  AFFIX_DATA.set('Helmet:dex_int', normalizeAffixData(dexIntHelmet as RawAffixData));
  
  // Gloves
  AFFIX_DATA.set('Gloves:strength', normalizeAffixData(strengthGloves as RawAffixData));
  AFFIX_DATA.set('Gloves:dexterity', normalizeAffixData(dexterityGloves as RawAffixData));
  AFFIX_DATA.set('Gloves:intelligence', normalizeAffixData(intelligenceGloves as RawAffixData));
  AFFIX_DATA.set('Gloves:str_dex', normalizeAffixData(strengthDexGloves as RawAffixData));
  AFFIX_DATA.set('Gloves:str_int', normalizeAffixData(strengthIntGloves as RawAffixData));
  AFFIX_DATA.set('Gloves:dex_int', normalizeAffixData(dexIntGloves as RawAffixData));
  
  // Boots
  AFFIX_DATA.set('Boots:strength', normalizeAffixData(strengthBoots as RawAffixData));
  AFFIX_DATA.set('Boots:dexterity', normalizeAffixData(dexterityBoots as RawAffixData));
  AFFIX_DATA.set('Boots:intelligence', normalizeAffixData(intelligenceBoots as RawAffixData));
  AFFIX_DATA.set('Boots:str_dex', normalizeAffixData(strengthDexBoots as RawAffixData));
  AFFIX_DATA.set('Boots:str_int', normalizeAffixData(strengthIntBoots as RawAffixData));
  AFFIX_DATA.set('Boots:dex_int', normalizeAffixData(dexIntBoots as RawAffixData));
  
  // Shields
  AFFIX_DATA.set('Shield:armour', normalizeAffixData(shieldsArmour as RawAffixData));
  AFFIX_DATA.set('Shield:evasion', normalizeAffixData(shieldsEvasion as RawAffixData));
  AFFIX_DATA.set('Shield:energy_shield', normalizeAffixData(shieldsES as RawAffixData));
  AFFIX_DATA.set('Shield:armour_evasion', normalizeAffixData(shieldsArmourEvasion as RawAffixData));
  AFFIX_DATA.set('Shield:armour_es', normalizeAffixData(shieldsArmourES as RawAffixData));
  AFFIX_DATA.set('Shield:evasion_es', normalizeAffixData(shieldsEvasionES as RawAffixData));
  
  // Weapons
  AFFIX_DATA.set('One Hand Sword', normalizeAffixData(oneHandSword as RawAffixData));
  AFFIX_DATA.set('Thrusting One Hand Sword', normalizeAffixData(thrustingOneHandSword as RawAffixData));
  AFFIX_DATA.set('One Hand Axe', normalizeAffixData(oneHandAxe as RawAffixData));
  AFFIX_DATA.set('One Hand Mace', normalizeAffixData(oneHandMace as RawAffixData));
  AFFIX_DATA.set('Dagger', normalizeAffixData(dagger as RawAffixData));
  AFFIX_DATA.set('Rune Dagger', normalizeAffixData(runeDagger as RawAffixData));
  AFFIX_DATA.set('Claw', normalizeAffixData(claw as RawAffixData));
  AFFIX_DATA.set('Wand', normalizeAffixData(wand as RawAffixData));
  AFFIX_DATA.set('Sceptre', normalizeAffixData(sceptre as RawAffixData));
  AFFIX_DATA.set('Two Hand Axe', normalizeAffixData(twoHandAxe as RawAffixData));
  AFFIX_DATA.set('Two Hand Mace', normalizeAffixData(twoHandMace as RawAffixData));
  AFFIX_DATA.set('Staff', normalizeAffixData(staff as RawAffixData));
  AFFIX_DATA.set('Warstaff', normalizeAffixData(warstaff as RawAffixData));
  AFFIX_DATA.set('Bow', normalizeAffixData(bow as RawAffixData));
  AFFIX_DATA.set('Quiver', normalizeAffixData(quiver as RawAffixData));
  
  // Fallback for Two Hand Sword - use One Hand Sword for now
  AFFIX_DATA.set('Two Hand Sword', normalizeAffixData(oneHandSword as RawAffixData));
}

// ===== HELPER FUNCTIONS =====

/**
 * Get the attribute type from item tags for armour pieces
 */
function getAttributeKeyFromTags(tags: string[]): string {
  const hasStr = tags.some(t => t.includes('str_armour') || t === 'str_armour');
  const hasDex = tags.some(t => t.includes('dex_armour') || t === 'dex_armour');
  const hasInt = tags.some(t => t.includes('int_armour') || t === 'int_armour');
  
  // Check for combined tags
  if (tags.includes('str_dex_armour')) return 'str_dex';
  if (tags.includes('str_int_armour')) return 'str_int';
  if (tags.includes('dex_int_armour')) return 'dex_int';
  if (tags.includes('str_dex_int_armour')) return 'str_dex'; // Default to str_dex for 3-stat
  
  if (hasStr && hasDex) return 'str_dex';
  if (hasStr && hasInt) return 'str_int';
  if (hasDex && hasInt) return 'dex_int';
  if (hasStr) return 'strength';
  if (hasDex) return 'dexterity';
  if (hasInt) return 'intelligence';
  
  return 'strength'; // Default
}

/**
 * Get shield defense type from tags
 */
function getShieldTypeFromTags(tags: string[]): string {
  const hasArmour = tags.some(t => t.includes('str_shield'));
  const hasEvasion = tags.some(t => t.includes('dex_shield'));
  const hasES = tags.some(t => t.includes('int_shield'));
  
  if (hasArmour && hasEvasion) return 'armour_evasion';
  if (hasArmour && hasES) return 'armour_es';
  if (hasEvasion && hasES) return 'evasion_es';
  if (hasArmour) return 'armour';
  if (hasEvasion) return 'evasion';
  if (hasES) return 'energy_shield';
  
  return 'armour'; // Default
}

/**
 * Get affix data for a base item
 */
export function getAffixDataForItem(baseItem: PoeBaseItem): ItemClassAffixes | null {
  initializeAffixData();
  
  const itemClass = baseItem.itemClass;
  const tags = baseItem.tags || [];
  
  // Armor items need attribute-specific affixes
  if (['Body Armour', 'Helmet', 'Gloves', 'Boots'].includes(itemClass)) {
    const attrKey = getAttributeKeyFromTags(tags);
    const key = `${itemClass}:${attrKey}`;
    return AFFIX_DATA.get(key) || null;
  }
  
  // Shields need defense-type-specific affixes
  if (itemClass === 'Shield') {
    const shieldType = getShieldTypeFromTags(tags);
    const key = `Shield:${shieldType}`;
    return AFFIX_DATA.get(key) || null;
  }
  
  // Other items (weapons, rings, etc.) use direct lookup
  return AFFIX_DATA.get(itemClass) || null;
}

/**
 * Get the best tier of an affix that can roll at a given item level
 * PoE rolls the HIGHEST tier that the item level allows
 */
// @ts-ignore - intentionally unused
function _getBestTierForItemLevel(_group: AffixGroup, _itemLevel: number): AffixTier | null {
  // Filter tiers that can roll at this item level
  const availableTiers = _group.modifiers.filter((tier: AffixTier) => tier.ilvl <= _itemLevel);
  
  if (availableTiers.length === 0) return null;
  
  // Return the highest tier (highest ilvl requirement)
  return availableTiers.reduce((best: AffixTier, tier: AffixTier) => 
    tier.ilvl > best.ilvl ? tier : best
  );
}

/**
 * PoE-style tier weighting system
 * In PoE, higher tier mods (higher ilvl requirements) are significantly rarer
 * This creates the typical loot distribution where T1 mods are very rare
 * 
 * Weights are defined in src/data/modWeights.ts for easy configuration
 */

// Base weight for tier calculations
const BASE_TIER_WEIGHT = 1000;

/**
 * Calculate spawn weight for a tier based on its position
 * Uses the centralized tier weight multipliers from modWeights.ts
 */
function calculateTierWeight(tierNumber: number, _maxTier: number): number {
  // Use centralized tier weight multipliers
  const multiplier = getTierWeightMultiplier(tierNumber);
  return Math.floor(BASE_TIER_WEIGHT * multiplier);
}

/**
 * Get a random tier for an affix group using PoE-style weighted selection
 * Higher tier mods (higher ilvl requirements) are significantly rarer
 */
function getRandomTierForItemLevel(group: AffixGroup, itemLevel: number): AffixTier | null {
  // Filter tiers that can roll at this item level
  const availableTiers = group.modifiers.filter(tier => tier.ilvl <= itemLevel);
  
  if (availableTiers.length === 0) return null;
  
  // Sort tiers by ilvl descending (T1 = highest ilvl, best stats)
  const sortedTiers = [...availableTiers].sort((a, b) => b.ilvl - a.ilvl);
  const maxTier = group.modifiers.length;
  
  // Calculate weights for each available tier
  const tiersWithWeights = sortedTiers.map((tier) => {
    // Find this tier's position in the full tier list (not just available ones)
    const fullTierIndex = [...group.modifiers]
      .sort((a, b) => b.ilvl - a.ilvl)
      .findIndex(t => t.ilvl === tier.ilvl && t.name === tier.name);
    const tierNumber = fullTierIndex + 1; // 1-indexed
    
    return {
      tier,
      weight: calculateTierWeight(tierNumber, maxTier)
    };
  });
  
  // Weighted random selection
  const totalWeight = tiersWithWeights.reduce((sum, tw) => sum + tw.weight, 0);
  let roll = Math.random() * totalWeight;
  
  for (const { tier, weight } of tiersWithWeights) {
    roll -= weight;
    if (roll <= 0) return tier;
  }
  
  // Fallback to last tier
  return tiersWithWeights[tiersWithWeights.length - 1]?.tier ?? null;
}

/**
 * Get spawn weight for an affix group using centralized weight data
 */
function getAffixGroupWeight(group: AffixGroup, itemTags: string[] = []): number {
  // Use centralized weight lookup
  const weight = getModGroupWeight(group.group);
  
  // Check if mod can spawn on this item type
  if (!canModSpawnOnItem(group.group, itemTags)) {
    return 0;
  }
  
  return weight;
}

/**
 * Roll a single affix from the available pool using weighted selection
 */
function rollSingleAffix(
  affixGroups: AffixGroup[],
  type: 'prefix' | 'suffix',
  itemLevel: number,
  excludeGroups: Set<string>
): RolledAffix | null {
  // Filter out groups that are already on the item
  const availableGroups = affixGroups.filter(g => !excludeGroups.has(g.group));
  
  // Further filter to groups that have at least one tier at this item level
  const rollableGroups = availableGroups.filter(g => 
    g.modifiers.some(tier => tier.ilvl <= itemLevel)
  );
  
  if (rollableGroups.length === 0) return null;
  
  // Calculate weights for each group
  const groupsWithWeights = rollableGroups.map(group => ({
    group,
    weight: getAffixGroupWeight(group)
  }));
  
  // Weighted random selection
  const totalWeight = groupsWithWeights.reduce((sum, gw) => sum + gw.weight, 0);
  let roll = Math.random() * totalWeight;
  
  let group: AffixGroup | null = null;
  for (const { group: g, weight } of groupsWithWeights) {
    roll -= weight;
    if (roll <= 0) {
      group = g;
      break;
    }
  }
  
  // Fallback
  if (!group) {
    group = groupsWithWeights[groupsWithWeights.length - 1]?.group ?? null;
  }
  
  if (!group) return null;
  
  // Pick a random tier from available tiers
  const tier = getRandomTierForItemLevel(group, itemLevel);
  if (!tier) return null;
  
  // Calculate tier number (T1 is highest/best ilvl, ascending)
  // Sort modifiers by ilvl descending to determine tier order
  const sortedTiers = [...group.modifiers].sort((a, b) => b.ilvl - a.ilvl);
  const tierNumber = sortedTiers.findIndex(t => t.ilvl === tier.ilvl && t.name === tier.name) + 1;
  const maxTier = group.modifiers.length;
  
  // Roll the stat values
  const rolledStats: RolledStat[] = [];
  for (const statText of tier.stats) {
    // Find all range patterns in this stat
    const rangeMatches = [...statText.matchAll(/\(([\d.]+)-([\d.]+)\)/g)];
    
    if (rangeMatches.length >= 2) {
      // Multiple ranges - roll each independently
      const rolledValues: number[] = rangeMatches.map(match => {
        const min = parseFloat(match[1]);
        const max = parseFloat(match[2]);
        return rollStatValue(min, max);
      });
      
      rolledStats.push({
        text: formatStatWithValue(statText, rolledValues),
        value: rolledValues.length === 2 ? [rolledValues[0], rolledValues[1]] : rolledValues[0]
      });
    } else if (rangeMatches.length === 1) {
      // Single range stat
      const min = parseFloat(rangeMatches[0][1]);
      const max = parseFloat(rangeMatches[0][2]);
      const rolledValue = rollStatValue(min, max);
      
      rolledStats.push({
        text: formatStatWithValue(statText, rolledValue),
        value: rolledValue
      });
    } else {
      // No range - might have # placeholder or be a fixed stat
      const parsed = parseStatRange(statText);
      const rolledValue = parsed.min === parsed.max ? parsed.min : rollStatValue(parsed.min, parsed.max);
      
      rolledStats.push({
        text: formatStatWithValue(statText, rolledValue),
        value: rolledValue
      });
    }
  }
  
  return {
    group: group.group,
    name: tier.name,
    type,
    ilvl: tier.ilvl,
    stats: rolledStats,
    tags: tier.tags,
    tier: tierNumber,
    maxTier: maxTier
  };
}

// ===== ITEM RARITY =====

export type PoeItemRarity = 'normal' | 'magic' | 'rare' | 'unique';

// ===== POE ITEM INTERFACE =====

/**
 * A complete PoE-style item
 */
export interface PoeItem {
  id: string;
  baseItem: PoeBaseItem;
  rarity: PoeItemRarity;
  itemLevel: number;
  name: string;           // Generated name based on affixes
  prefixes: RolledAffix[];
  suffixes: RolledAffix[];
  implicits: RolledAffix[];  // Implicit mods from base item
  corrupted: boolean;
  quality: number;        // 0-20%
  identified: boolean;
}

// ===== ITEM GENERATION =====

/**
 * Roll implicits for a base item
 * Handles combining min/max stat pairs (like "Adds X to Y Physical Damage")
 */
function rollImplicits(baseItem: PoeBaseItem): RolledAffix[] {
  const implicits: RolledAffix[] = [];
  
  for (const implicitId of baseItem.implicits) {
    const mod = POE_IMPLICIT_MODS[implicitId];
    if (!mod) continue;
    
    const rolledStats: RolledStat[] = [];
    const processedIndices = new Set<number>();
    
    // First pass: look for min/max pairs and combine them
    for (let i = 0; i < mod.stats.length; i++) {
      if (processedIndices.has(i)) continue;
      
      const stat = mod.stats[i];
      const statId = stat.id;
      
      // Check if this is a "minimum" stat that has a corresponding "maximum" stat
      if (statId.includes('minimum') || statId.includes('_min_')) {
        // Look for matching maximum stat
        const maxStatId = statId.replace('minimum', 'maximum').replace('_min_', '_max_');
        const maxStatIndex = mod.stats.findIndex((s, j) => j > i && s.id === maxStatId);
        
        if (maxStatIndex !== -1) {
          const maxStat = mod.stats[maxStatIndex];
          processedIndices.add(i);
          processedIndices.add(maxStatIndex);
          
          // Roll both values
          const minValue = rollStatValue(stat.min, stat.max);
          const maxValue = rollStatValue(maxStat.min, maxStat.max);
          
          // Generate combined display text
          const combinedText = getCombinedDamageText(statId, minValue, maxValue);
          
          rolledStats.push({
            text: combinedText,
            statId: statId, // Use min stat ID as the primary
            value: minValue // Store min value
          });
          continue;
        }
      }
      
      // Regular stat processing
      const rolledValue = rollStatValue(stat.min, stat.max);
      const statText = getStatDisplayText(statId, rolledValue, rolledValue);
      rolledStats.push({
        text: statText,
        statId: statId,
        value: rolledValue
      });
    }
    
    implicits.push({
      group: mod.groups?.[0] || implicitId,
      name: mod.name || implicitId,
      type: 'prefix', // Implicits don't have a type really
      ilvl: mod.requiredLevel || 1,
      stats: rolledStats,
      tags: []
    });
  }
  
  return implicits;
}

/**
 * Get combined display text for min/max damage stats
 */
function getCombinedDamageText(minStatId: string, minValue: number, maxValue: number): string {
  // Physical damage
  if (minStatId.includes('physical_damage')) {
    if (minStatId.includes('with_bow')) {
      return `Adds ${minValue} to ${maxValue} Physical Damage to Bow Attacks`;
    }
    return `Adds ${minValue} to ${maxValue} Physical Damage to Attacks`;
  }
  // Fire damage
  if (minStatId.includes('fire_damage')) {
    return `Adds ${minValue} to ${maxValue} Fire Damage to Attacks`;
  }
  // Cold damage
  if (minStatId.includes('cold_damage')) {
    return `Adds ${minValue} to ${maxValue} Cold Damage to Attacks`;
  }
  // Lightning damage
  if (minStatId.includes('lightning_damage')) {
    return `Adds ${minValue} to ${maxValue} Lightning Damage to Attacks`;
  }
  // Chaos damage
  if (minStatId.includes('chaos_damage')) {
    return `Adds ${minValue} to ${maxValue} Chaos Damage to Attacks`;
  }
  // Fallback
  return `Adds ${minValue} to ${maxValue} Damage`;
}

/**
 * Generate a magic item name (Prefix + Base + Suffix)
 */
function generateMagicName(baseItem: PoeBaseItem, prefixes: RolledAffix[], suffixes: RolledAffix[]): string {
  let name = baseItem.name;
  
  if (prefixes.length > 0 && prefixes[0].name && prefixes[0].name !== 'Unknown') {
    name = `${prefixes[0].name} ${name}`;
  }
  
  if (suffixes.length > 0 && suffixes[0].name && suffixes[0].name !== 'Unknown') {
    name = `${name} ${suffixes[0].name}`;
  }
  
  return name;
}

/**
 * Generate a rare item name (random word pairs in PoE style)
 */
const RARE_NAME_PREFIXES = [
  'Grim', 'Blood', 'Death', 'Soul', 'Storm', 'Dragon', 'Phoenix', 'Doom',
  'Hate', 'Pain', 'Wrath', 'Bane', 'Rune', 'Spirit', 'Shadow', 'Skull',
  'Chaos', 'Void', 'Rage', 'Venom', 'Plague', 'Foe', 'Blight', 'Horror',
  'Mind', 'Heart', 'Bone', 'Beast', 'Eagle', 'Wolf', 'Serpent', 'Crow',
  'Dread', 'Night', 'Ember', 'Frost', 'Thunder', 'Lightning', 'Flame', 'Ice'
];

const RARE_NAME_SUFFIXES = [
  'Bane', 'Bite', 'Call', 'Cry', 'Song', 'Roar', 'Howl', 'Scream',
  'Edge', 'Point', 'Spike', 'Thorn', 'Fang', 'Claw', 'Tooth', 'Horn',
  'Mark', 'Brand', 'Sign', 'Ward', 'Guard', 'Keep', 'Hold', 'Lock',
  'Strike', 'Blow', 'Touch', 'Grasp', 'Grip', 'Clutch', 'Reach', 'Span',
  'Shred', 'Rend', 'Scar', 'Break', 'Crack', 'Split', 'Cleave', 'Cut'
];

function generateRareName(): string {
  const prefix = RARE_NAME_PREFIXES[Math.floor(Math.random() * RARE_NAME_PREFIXES.length)];
  const suffix = RARE_NAME_SUFFIXES[Math.floor(Math.random() * RARE_NAME_SUFFIXES.length)];
  return `${prefix} ${suffix}`;
}

/**
 * Select a base item using PoE-style weighted selection
 * Bases closer to the item level are more likely to drop
 */
function selectWeightedBaseItem(candidates: PoeBaseItem[], itemLevel: number): PoeBaseItem {
  if (candidates.length === 0) {
    throw new Error('No candidates for base item selection');
  }
  if (candidates.length === 1) {
    return candidates[0];
  }
  
  // Calculate weights - bases closer to ilvl get much higher weights
  // This creates a distribution where you mostly find level-appropriate gear
  const basesWithWeights = candidates.map(base => {
    const levelDiff = itemLevel - base.dropLevel;
    // Weight formula: exponential decay based on level difference
    // Items at your level or 1-5 below: high weight
    // Items 10+ levels below: much lower weight
    let weight: number;
    if (levelDiff <= 5) {
      weight = 1000; // Near your level - very common
    } else if (levelDiff <= 10) {
      weight = 500; // Slightly below - common
    } else if (levelDiff <= 20) {
      weight = 200; // Moderately below - less common
    } else if (levelDiff <= 30) {
      weight = 50; // Much below - uncommon
    } else {
      weight = 10; // Very old gear - rare drop
    }
    
    return { base, weight };
  });
  
  // Weighted random selection
  const totalWeight = basesWithWeights.reduce((sum, bw) => sum + bw.weight, 0);
  let roll = Math.random() * totalWeight;
  
  for (const { base, weight } of basesWithWeights) {
    roll -= weight;
    if (roll <= 0) return base;
  }
  
  // Fallback to last (shouldn't happen)
  return basesWithWeights[basesWithWeights.length - 1].base;
}

/**
 * Generate a random item with PoE-style mod rolling
 */
export function generatePoeItem(
  itemLevel: number,
  rarity: PoeItemRarity = 'normal',
  baseItemOrClass?: PoeBaseItem | PoeItemClass
): PoeItem | null {
  initializeAffixData();
  
  // Select base item
  let baseItem: PoeBaseItem;
  
  if (baseItemOrClass && typeof baseItemOrClass === 'object') {
    baseItem = baseItemOrClass;
  } else {
    // Filter base items by class if specified, and by drop level
    let candidates = ALL_POE_BASE_ITEMS.filter(b => b.dropLevel <= itemLevel);
    
    // Exclude talismans from random generation (they're special drops)
    // Check both tags array and itemClass/name for talisman references
    candidates = candidates.filter(b => {
      const hasTalismanTag = b.tags?.some(tag => tag.toLowerCase().includes('talisman')) || false;
      const isTalismanClass = b.itemClass?.toLowerCase().includes('talisman') || false;
      const isTalismanName = b.name?.toLowerCase().includes('talisman') || false;
      return !hasTalismanTag && !isTalismanClass && !isTalismanName;
    });
    
    if (typeof baseItemOrClass === 'string') {
      candidates = candidates.filter(b => b.itemClass === baseItemOrClass);
    }
    
    if (candidates.length === 0) {
      console.warn('No valid base items found for the given criteria');
      return null;
    }
    
    // First, pick an item class randomly to ensure balanced distribution
    // This prevents armor items from dominating due to having more entries
    const itemClasses = new Set(candidates.map(b => b.itemClass));
    const availableClasses = Array.from(itemClasses).filter(itemClass => {
      // Make sure this class has at least one valid candidate
      return candidates.some(b => b.itemClass === itemClass);
    });
    
    if (availableClasses.length > 0) {
      // Pick a random item class with equal probability
      const selectedClass = availableClasses[Math.floor(Math.random() * availableClasses.length)];
      
      // Filter to only candidates from this class
      const classCandidates = candidates.filter(b => b.itemClass === selectedClass);
      
      // Use weighted selection within the selected class - bases closer to ilvl are more common
      baseItem = selectWeightedBaseItem(classCandidates, itemLevel);
    } else {
      // Fallback to weighted selection across all candidates if something went wrong
      baseItem = selectWeightedBaseItem(candidates, itemLevel);
    }
  }
  
  // Get affix data for this item
  const affixData = getAffixDataForItem(baseItem);
  
  // Roll implicits
  const implicits = rollImplicits(baseItem);
  
  // Prepare item
  const item: PoeItem = {
    id: crypto.randomUUID(),
    baseItem,
    rarity,
    itemLevel,
    name: baseItem.name,
    prefixes: [],
    suffixes: [],
    implicits,
    corrupted: false,
    quality: 0,
    identified: true
  };
  
  // Roll affixes based on rarity
  if (rarity === 'normal') {
    // Normal items have no explicit mods
    return item;
  }
  
  // If we can't get affix data for magic/rare items, downgrade to normal
  if (!affixData) {
    console.warn(`No affix data for ${baseItem.itemClass} with tags [${baseItem.tags?.join(', ')}], downgrading to normal`);
    item.rarity = 'normal';
    item.name = baseItem.name;
    return item;
  }
  
  const usedGroups = new Set<string>();
  
  if (rarity === 'magic') {
    // Magic items: MUST have 1-2 affixes, max 1 prefix and 1 suffix
    const targetAffixes = Math.random() < 0.5 ? 1 : 2;
    
    // Try to roll at least 1 affix - try prefix first, then suffix
    let gotFirstAffix = false;
    
    // Try prefix
    const prefixAffix = rollSingleAffix(affixData.prefixes, 'prefix', itemLevel, usedGroups);
    if (prefixAffix) {
      item.prefixes.push(prefixAffix);
      usedGroups.add(prefixAffix.group);
      gotFirstAffix = true;
    }
    
    // If we didn't get a prefix, try suffix for first affix
    if (!gotFirstAffix) {
      const suffixAffix = rollSingleAffix(affixData.suffixes, 'suffix', itemLevel, usedGroups);
      if (suffixAffix) {
        item.suffixes.push(suffixAffix);
        usedGroups.add(suffixAffix.group);
        gotFirstAffix = true;
      }
    }
    
    // If we want 2 affixes and got a prefix, try to add a suffix
    if (targetAffixes === 2 && item.prefixes.length === 1) {
      const suffixAffix = rollSingleAffix(affixData.suffixes, 'suffix', itemLevel, usedGroups);
      if (suffixAffix) {
        item.suffixes.push(suffixAffix);
        usedGroups.add(suffixAffix.group);
      }
    }
    // If we want 2 affixes and got a suffix, try to add a prefix
    else if (targetAffixes === 2 && item.suffixes.length === 1) {
      const prefixAffix2 = rollSingleAffix(affixData.prefixes, 'prefix', itemLevel, usedGroups);
      if (prefixAffix2) {
        item.prefixes.push(prefixAffix2);
        usedGroups.add(prefixAffix2.group);
      }
    }
    
    // If we still have no mods, downgrade to normal
    if (item.prefixes.length === 0 && item.suffixes.length === 0) {
      item.rarity = 'normal';
      item.name = baseItem.name;
    } else {
      // Generate magic name
      item.name = generateMagicName(baseItem, item.prefixes, item.suffixes);
    }
    
  } else if (rarity === 'rare') {
    // Rare items: MUST have 3-6 affixes, max 3 prefixes and 3 suffixes
    const totalAffixes = 3 + Math.floor(Math.random() * 4); // 3, 4, 5, or 6
    
    // Guarantee at least 1 prefix
    const prefixAffix = rollSingleAffix(affixData.prefixes, 'prefix', itemLevel, usedGroups);
    if (prefixAffix) {
      item.prefixes.push(prefixAffix);
      usedGroups.add(prefixAffix.group);
    }
    
    // Guarantee at least 1 suffix
    const suffixAffix = rollSingleAffix(affixData.suffixes, 'suffix', itemLevel, usedGroups);
    if (suffixAffix) {
      item.suffixes.push(suffixAffix);
      usedGroups.add(suffixAffix.group);
    }
    
    // Fill remaining slots to reach target
    let attempts = 0;
    while (item.prefixes.length + item.suffixes.length < totalAffixes && attempts < 20) {
      attempts++;
      
      // Decide which type to roll
      const canPrefix = item.prefixes.length < 3;
      const canSuffix = item.suffixes.length < 3;
      
      if (!canPrefix && !canSuffix) break;
      
      let type: 'prefix' | 'suffix';
      if (!canPrefix) type = 'suffix';
      else if (!canSuffix) type = 'prefix';
      else type = Math.random() < 0.5 ? 'prefix' : 'suffix';
      
      const groups = type === 'prefix' ? affixData.prefixes : affixData.suffixes;
      const affix = rollSingleAffix(groups, type, itemLevel, usedGroups);
      if (affix) {
        if (type === 'prefix') item.prefixes.push(affix);
        else item.suffixes.push(affix);
        usedGroups.add(affix.group);
      }
    }
    
    // If we have fewer than 3 mods, downgrade to magic or normal
    const totalMods = item.prefixes.length + item.suffixes.length;
    if (totalMods === 0) {
      item.rarity = 'normal';
      item.name = baseItem.name;
    } else if (totalMods < 3) {
      item.rarity = 'magic';
      item.name = generateMagicName(baseItem, item.prefixes, item.suffixes);
    } else {
      // Generate rare name
      item.name = generateRareName();
    }
  }
  
  return item;
}

/**
 * Determine rarity based on drop chances
 */
export function rollItemRarity(magicChance = 0.25, rareChance = 0.05): PoeItemRarity {
  const roll = Math.random();
  if (roll < rareChance) return 'rare';
  if (roll < rareChance + magicChance) return 'magic';
  return 'normal';
}

/**
 * Calculate item level from dungeon key level
 * 
 * PoE-style zone level system:
 * - Key level corresponds directly to zone level (key +2 = zone 2)
 * - Item level equals zone level with small random variance
 * - Maximum item level for drops is 86 (endgame cap)
 * - Items can drop slightly below zone level (common in PoE)
 * 
 * @param keyLevel The dungeon key level
 * @returns The item level for drops
 */
export function calculateItemLevel(keyLevel: number): number {
  // Key level IS the zone level (key +2 = zone 2, key +50 = zone 50)
  const zoneLevel = keyLevel;
  
  // Small variance: items can be 0-2 levels below zone level
  const variance = Math.floor(Math.random() * 3);
  const ilvl = Math.max(1, zoneLevel - variance);
  
  // Cap at 86 (PoE's practical max for most content)
  return Math.min(86, ilvl);
}

/**
 * Generate dungeon loot with PoE-style items
 * Uses proper PoE-style item level calculation and tier weighting
 */
export function generatePoeDungeonLoot(
  keyLevel: number,
  success: boolean,
  upgradeLevel: number,
  itemQuantity: number = 0,
  itemRarity: number = 0
): PoeItem[] {
  const items: PoeItem[] = [];
  
  // Base number of items
  let baseNumItems = success ? 3 + upgradeLevel : 1;
  
  // Apply item quantity multiplier
  const quantityMultiplier = 1 + itemQuantity;
  let numItems = Math.floor(baseNumItems * quantityMultiplier);
  
  if (success && numItems < 1) numItems = 1;
  
  // Rarity distribution based on itemRarity multiplier and key level
  // Higher key levels naturally have better rarity due to progression
  const keyLevelBonus = Math.min(0.15, keyLevel * 0.002); // Up to 15% at key 75+
  const baseRareChance = 0.05 + keyLevelBonus;
  const baseMagicChance = 0.25;
  
  // Higher rarity = more magic/rare items
  const rareChance = Math.min(0.35, baseRareChance + (itemRarity * 0.25));
  const magicChance = Math.min(0.50, baseMagicChance + (itemRarity * 0.25));
  
  for (let i = 0; i < numItems; i++) {
    // Each item gets its own ilvl roll (with variance)
    const itemLevel = calculateItemLevel(keyLevel);
    const rarity = rollItemRarity(magicChance, rareChance);
    const item = generatePoeItem(itemLevel, rarity);
    if (item) items.push(item);
  }
  
  return items;
}

// ===== CRAFTING ORBS =====

export type CraftingOrbType = 
  | 'transmutation'  // Normal -> Magic (1-2 mods)
  | 'alteration'     // Reroll magic item mods
  | 'augmentation'   // Add mod to magic item with < 2 mods
  | 'alchemy'        // Normal -> Rare (4-6 mods)
  | 'chaos'          // Reroll rare item mods
  | 'exalted'        // Add mod to rare item with < 6 mods
  | 'annulment'      // Remove random mod
  | 'regal'          // Magic -> Rare (keeps mods, adds 1)
  | 'scouring';      // Remove all mods (-> Normal)

export interface CraftingResult {
  success: boolean;
  item?: PoeItem;
  message: string;
}

/**
 * Apply a crafting orb to an item
 */
export function applyCraftingOrb(item: PoeItem, orbType: CraftingOrbType): CraftingResult {
  if (item.corrupted) {
    return { success: false, message: 'Cannot modify corrupted items' };
  }
  
  const affixData = getAffixDataForItem(item.baseItem);
  if (!affixData && orbType !== 'scouring' && orbType !== 'annulment') {
    return { success: false, message: 'No affix data available for this item type' };
  }
  
  // Clone the item
  const newItem: PoeItem = {
    ...item,
    prefixes: [...item.prefixes],
    suffixes: [...item.suffixes],
    implicits: [...item.implicits]
  };
  
  const usedGroups = new Set<string>([
    ...newItem.prefixes.map(a => a.group),
    ...newItem.suffixes.map(a => a.group)
  ]);
  
  switch (orbType) {
    case 'transmutation': {
      if (item.rarity !== 'normal') {
        return { success: false, message: 'Can only use on normal items' };
      }
      
      newItem.rarity = 'magic';
      newItem.prefixes = [];
      newItem.suffixes = [];
      usedGroups.clear();
      
      // Add 1-2 mods
      const numMods = Math.random() < 0.5 ? 1 : 2;
      const rollPrefix = Math.random() < 0.5;
      
      if (affixData) {
        if (numMods >= 1) {
          const type = rollPrefix ? 'prefix' : 'suffix';
          const groups = type === 'prefix' ? affixData.prefixes : affixData.suffixes;
          const affix = rollSingleAffix(groups, type, item.itemLevel, usedGroups);
          if (affix) {
            if (type === 'prefix') newItem.prefixes.push(affix);
            else newItem.suffixes.push(affix);
            usedGroups.add(affix.group);
          }
        }
        
        if (numMods >= 2) {
          const type = rollPrefix ? 'suffix' : 'prefix';
          const groups = type === 'prefix' ? affixData.prefixes : affixData.suffixes;
          const affix = rollSingleAffix(groups, type, item.itemLevel, usedGroups);
          if (affix) {
            if (type === 'prefix') newItem.prefixes.push(affix);
            else newItem.suffixes.push(affix);
          }
        }
      }
      
      newItem.name = generateMagicName(newItem.baseItem, newItem.prefixes, newItem.suffixes);
      return { success: true, item: newItem, message: 'Item transmuted to magic' };
    }
    
    case 'alteration': {
      if (item.rarity !== 'magic') {
        return { success: false, message: 'Can only use on magic items' };
      }
      
      newItem.prefixes = [];
      newItem.suffixes = [];
      usedGroups.clear();
      
      // Add 1-2 mods
      const numMods = Math.random() < 0.5 ? 1 : 2;
      
      if (affixData) {
        for (let i = 0; i < numMods; i++) {
          const canPrefix = newItem.prefixes.length < 1;
          const canSuffix = newItem.suffixes.length < 1;
          
          if (!canPrefix && !canSuffix) break;
          
          let type: 'prefix' | 'suffix';
          if (!canPrefix) type = 'suffix';
          else if (!canSuffix) type = 'prefix';
          else type = Math.random() < 0.5 ? 'prefix' : 'suffix';
          
          const groups = type === 'prefix' ? affixData.prefixes : affixData.suffixes;
          const affix = rollSingleAffix(groups, type, item.itemLevel, usedGroups);
          if (affix) {
            if (type === 'prefix') newItem.prefixes.push(affix);
            else newItem.suffixes.push(affix);
            usedGroups.add(affix.group);
          }
        }
      }
      
      newItem.name = generateMagicName(newItem.baseItem, newItem.prefixes, newItem.suffixes);
      return { success: true, item: newItem, message: 'Item mods rerolled' };
    }
    
    case 'augmentation': {
      if (item.rarity !== 'magic') {
        return { success: false, message: 'Can only use on magic items' };
      }
      
      const canPrefix = newItem.prefixes.length < 1;
      const canSuffix = newItem.suffixes.length < 1;
      
      if (!canPrefix && !canSuffix) {
        return { success: false, message: 'Item already has maximum mods' };
      }
      
      if (affixData) {
        let type: 'prefix' | 'suffix';
        if (!canPrefix) type = 'suffix';
        else if (!canSuffix) type = 'prefix';
        else type = Math.random() < 0.5 ? 'prefix' : 'suffix';
        
        const groups = type === 'prefix' ? affixData.prefixes : affixData.suffixes;
        const affix = rollSingleAffix(groups, type, item.itemLevel, usedGroups);
        if (affix) {
          if (type === 'prefix') newItem.prefixes.push(affix);
          else newItem.suffixes.push(affix);
        }
      }
      
      newItem.name = generateMagicName(newItem.baseItem, newItem.prefixes, newItem.suffixes);
      return { success: true, item: newItem, message: 'Added new mod' };
    }
    
    case 'alchemy': {
      if (item.rarity !== 'normal') {
        return { success: false, message: 'Can only use on normal items' };
      }
      
      newItem.rarity = 'rare';
      newItem.prefixes = [];
      newItem.suffixes = [];
      usedGroups.clear();
      
      const totalMods = 4 + Math.floor(Math.random() * 3);
      
      if (affixData) {
        // Guarantee 1 prefix and 1 suffix
        const prefixAffix = rollSingleAffix(affixData.prefixes, 'prefix', item.itemLevel, usedGroups);
        if (prefixAffix) {
          newItem.prefixes.push(prefixAffix);
          usedGroups.add(prefixAffix.group);
        }
        
        const suffixAffix = rollSingleAffix(affixData.suffixes, 'suffix', item.itemLevel, usedGroups);
        if (suffixAffix) {
          newItem.suffixes.push(suffixAffix);
          usedGroups.add(suffixAffix.group);
        }
        
        // Fill remaining
        const remaining = totalMods - newItem.prefixes.length - newItem.suffixes.length;
        for (let i = 0; i < remaining; i++) {
          const canPrefix = newItem.prefixes.length < 3;
          const canSuffix = newItem.suffixes.length < 3;
          
          if (!canPrefix && !canSuffix) break;
          
          let type: 'prefix' | 'suffix';
          if (!canPrefix) type = 'suffix';
          else if (!canSuffix) type = 'prefix';
          else type = Math.random() < 0.5 ? 'prefix' : 'suffix';
          
          const groups = type === 'prefix' ? affixData.prefixes : affixData.suffixes;
          const affix = rollSingleAffix(groups, type, item.itemLevel, usedGroups);
          if (affix) {
            if (type === 'prefix') newItem.prefixes.push(affix);
            else newItem.suffixes.push(affix);
            usedGroups.add(affix.group);
          }
        }
      }
      
      newItem.name = generateRareName();
      return { success: true, item: newItem, message: 'Item alchemized to rare' };
    }
    
    case 'chaos': {
      if (item.rarity !== 'rare') {
        return { success: false, message: 'Can only use on rare items' };
      }
      
      newItem.prefixes = [];
      newItem.suffixes = [];
      usedGroups.clear();
      
      const totalMods = 4 + Math.floor(Math.random() * 3);
      
      if (affixData) {
        // Guarantee 1 prefix and 1 suffix
        const prefixAffix = rollSingleAffix(affixData.prefixes, 'prefix', item.itemLevel, usedGroups);
        if (prefixAffix) {
          newItem.prefixes.push(prefixAffix);
          usedGroups.add(prefixAffix.group);
        }
        
        const suffixAffix = rollSingleAffix(affixData.suffixes, 'suffix', item.itemLevel, usedGroups);
        if (suffixAffix) {
          newItem.suffixes.push(suffixAffix);
          usedGroups.add(suffixAffix.group);
        }
        
        const remaining = totalMods - newItem.prefixes.length - newItem.suffixes.length;
        for (let i = 0; i < remaining; i++) {
          const canPrefix = newItem.prefixes.length < 3;
          const canSuffix = newItem.suffixes.length < 3;
          
          if (!canPrefix && !canSuffix) break;
          
          let type: 'prefix' | 'suffix';
          if (!canPrefix) type = 'suffix';
          else if (!canSuffix) type = 'prefix';
          else type = Math.random() < 0.5 ? 'prefix' : 'suffix';
          
          const groups = type === 'prefix' ? affixData.prefixes : affixData.suffixes;
          const affix = rollSingleAffix(groups, type, item.itemLevel, usedGroups);
          if (affix) {
            if (type === 'prefix') newItem.prefixes.push(affix);
            else newItem.suffixes.push(affix);
            usedGroups.add(affix.group);
          }
        }
      }
      
      newItem.name = generateRareName();
      return { success: true, item: newItem, message: 'Item mods rerolled' };
    }
    
    case 'exalted': {
      if (item.rarity !== 'rare') {
        return { success: false, message: 'Can only use on rare items' };
      }
      
      const canPrefix = newItem.prefixes.length < 3;
      const canSuffix = newItem.suffixes.length < 3;
      
      if (!canPrefix && !canSuffix) {
        return { success: false, message: 'Item already has maximum mods (6)' };
      }
      
      if (affixData) {
        let type: 'prefix' | 'suffix';
        if (!canPrefix) type = 'suffix';
        else if (!canSuffix) type = 'prefix';
        else type = Math.random() < 0.5 ? 'prefix' : 'suffix';
        
        const groups = type === 'prefix' ? affixData.prefixes : affixData.suffixes;
        const affix = rollSingleAffix(groups, type, item.itemLevel, usedGroups);
        if (affix) {
          if (type === 'prefix') newItem.prefixes.push(affix);
          else newItem.suffixes.push(affix);
        }
      }
      
      return { success: true, item: newItem, message: 'Added powerful mod' };
    }
    
    case 'annulment': {
      const totalMods = newItem.prefixes.length + newItem.suffixes.length;
      if (totalMods === 0) {
        return { success: false, message: 'Item has no mods to remove' };
      }
      
      // Pick random mod to remove
      const removeIndex = Math.floor(Math.random() * totalMods);
      
      if (removeIndex < newItem.prefixes.length) {
        newItem.prefixes.splice(removeIndex, 1);
      } else {
        newItem.suffixes.splice(removeIndex - newItem.prefixes.length, 1);
      }
      
      // Update name
      if (newItem.rarity === 'magic') {
        newItem.name = generateMagicName(newItem.baseItem, newItem.prefixes, newItem.suffixes);
      }
      
      return { success: true, item: newItem, message: 'Removed random mod' };
    }
    
    case 'regal': {
      if (item.rarity !== 'magic') {
        return { success: false, message: 'Can only use on magic items' };
      }
      
      newItem.rarity = 'rare';
      
      // Add one random mod
      if (affixData) {
        const canPrefix = newItem.prefixes.length < 3;
        const canSuffix = newItem.suffixes.length < 3;
        
        let type: 'prefix' | 'suffix';
        if (!canPrefix) type = 'suffix';
        else if (!canSuffix) type = 'prefix';
        else type = Math.random() < 0.5 ? 'prefix' : 'suffix';
        
        const groups = type === 'prefix' ? affixData.prefixes : affixData.suffixes;
        const affix = rollSingleAffix(groups, type, item.itemLevel, usedGroups);
        if (affix) {
          if (type === 'prefix') newItem.prefixes.push(affix);
          else newItem.suffixes.push(affix);
        }
      }
      
      newItem.name = generateRareName();
      return { success: true, item: newItem, message: 'Item upgraded to rare' };
    }
    
    case 'scouring': {
      if (item.rarity === 'normal') {
        return { success: false, message: 'Item is already normal' };
      }
      if (item.rarity === 'unique') {
        return { success: false, message: 'Cannot scour unique items' };
      }
      
      newItem.rarity = 'normal';
      newItem.prefixes = [];
      newItem.suffixes = [];
      newItem.name = newItem.baseItem.name;
      
      return { success: true, item: newItem, message: 'Removed all mods' };
    }
    
    default:
      return { success: false, message: 'Unknown orb type' };
  }
}

// Initialize on module load
initializeAffixData();

