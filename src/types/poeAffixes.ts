// Path of Exile style affix types - parsed from processed affix data

/**
 * A single tier of a modifier (e.g., T1 "+100-114 Life", T2 "+85-99 Life", etc.)
 */
export interface AffixTier {
  name: string;          // Modifier name (e.g., "Virile", "of the Titan")
  ilvl: number;          // Required item level
  stats: string[];       // Stat lines with values (e.g., "+(100-114) to maximum Life")
  tags: string[];        // Mod tags for filtering
}

/**
 * A mod group containing all tiers (e.g., all tiers of +Life prefix)
 */
export interface AffixGroup {
  group: string;         // Group name for mutual exclusion (e.g., "IncreasedLife")
  stats: string[];       // Base stat description (e.g., "+# to maximum Life")
  modifiers: AffixTier[];
}

/**
 * Complete affix data for an item class
 */
export interface ItemClassAffixes {
  item_class: string;           // The item class name
  base_attribute?: string;      // For armor: strength/dexterity/intelligence
  prefixes: AffixGroup[];
  suffixes: AffixGroup[];
}

/**
 * A rolled affix on an item
 */
export interface RolledAffix {
  group: string;         // The mod group (for exclusion checking)
  name: string;          // The tier name (e.g., "Virile")
  type: 'prefix' | 'suffix';
  ilvl: number;          // The tier's required ilvl
  stats: RolledStat[];   // The actual rolled stats with values
  tags: string[];
  tier?: number;         // The tier number (T1 = best, higher = worse)
  maxTier?: number;      // Total number of tiers for this mod
}

/**
 * A single stat with its rolled value
 */
export interface RolledStat {
  text: string;          // The stat text (e.g., "+105 to maximum Life")
  statId?: string;       // Optional internal stat ID
  value: number | [number, number]; // Single value or min/max for damage ranges
}

/**
 * Item class to affix file mapping
 */
export const ITEM_CLASS_AFFIX_FILES: Record<string, string[]> = {
  // Rings
  'Ring': ['ring_affixes.json'],
  
  // Body Armour by attribute
  'Body Armour': [
    'strength_body_armour_affixes.json',
    'dexterity_body_armour_affixes.json', 
    'intelligence_body_armour_affixes.json',
    'strength_dexterity_body_armour_affixes.json',
    'strength_intelligence_body_armour_affixes.json',
    'dexterity_intelligence_body_armour_affixes.json',
  ],
  
  // Helmets by attribute
  'Helmet': [
    'strength_helmet_affixes.json',
    'dexterity_helmet_affixes.json',
    'intelligence_helmet_affixes.json',
    'strength_dexterity_helmets_affixes.json',
    'strength_intelligence_helmets_affixes.json',
    'dexterity_intelligence_helmets_affixes.json',
  ],
  
  // Gloves by attribute
  'Gloves': [
    'strength_gloves_affixes.json',
    'dexterity_gloves_affixes.json',
    'intelligence_gloves_affixes.json',
    'strength_dex_gloves_affixes.json',
    'strength_intelligence_gloves_affixes.json',
    'dexterity_intelligence_gloves_affixes.json',
  ],
  
  // Boots by attribute
  'Boots': [
    'strength_boots_affixes.json',
    'dexterity_boots_affixes.json',
    'intelligence_boots_affixes.json',
    'strength_dexterity_boots_affixes.json',
    'strength_intelligence_boots_affixes.json',
    'dexterity_intelligence_boots_affixes.json',
  ],
  
  // Shields by defense type
  'Shield': [
    'shields_armour.standard.affixes.json',
    'shields_evasion.standard.affixes.json',
    'shields_energy_shield.standard.affixes.json',
    'shields_armour_evasion.standard.affixes.json',
    'shields_armour_energy_shield.standard.affixes.json',
    'shields_evasion_energy_shield.standard.affixes.json',
  ],
  
  // One-handed weapons
  'One Hand Sword': ['one_handed_sword_affixes.json'],
  'Thrusting One Hand Sword': ['thrusting_one_handed_sword_affixes.json'],
  'One Hand Axe': ['one_handed_axes_affixes.json'],
  'One Hand Mace': ['one_handed_mace_affixes.json'],
  'Dagger': ['dagger_affixes.json'],
  'Rune Dagger': ['rune_dagger_affixes.json'],
  'Claw': ['claw_affixes.json'],
  'Wand': ['wand_affixes.json'],
  'Sceptre': ['sceptre_affixes.json'],
  
  // Two-handed weapons
  'Two Hand Axe': ['two_handed_axes_affixes.json'],
  'Two Hand Mace': ['two_handed_mace_affixes.json'],
  'Staff': ['staff_affixes.json'],
  'Warstaff': ['warstaff_affixes.json'],
  'Bow': ['bow_affixes.json'],
  
  // Other
  'Quiver': ['quiver_affixes.json'],
};

/**
 * Get the attribute type from item tags
 */
export function getAttributeFromTags(tags: string[]): 'strength' | 'dexterity' | 'intelligence' | 'hybrid' | null {
  const hasStr = tags.some(t => t.includes('str_armour') || t === 'strength');
  const hasDex = tags.some(t => t.includes('dex_armour') || t === 'dexterity');
  const hasInt = tags.some(t => t.includes('int_armour') || t === 'intelligence');
  
  if (hasStr && hasDex && hasInt) return 'hybrid';
  if (hasStr && hasDex) return 'hybrid';
  if (hasStr && hasInt) return 'hybrid';
  if (hasDex && hasInt) return 'hybrid';
  if (hasStr) return 'strength';
  if (hasDex) return 'dexterity';
  if (hasInt) return 'intelligence';
  
  return null;
}

/**
 * Parse stat value ranges from stat text like "+(100-114) to maximum Life"
 * Returns [min, max] or [value, value] for fixed values
 * Supports decimal values like "(0.2-0.4)" or "(2.1-8)"
 */
export function parseStatRange(statText: string): { min: number; max: number; text: string } {
  // Match patterns like "(100-114)", "(0.2-0.4)", "(2.1-8)"
  const rangePattern = /\(([\d.]+)-([\d.]+)\)/g;
  const simplePattern = /([\d.]+) to ([\d.]+)/;
  const fixedPattern = /[+-]?([\d.]+)/;
  
  let min = 0;
  let max = 0;
  const text = statText;
  
  // Check for range pattern first
  const matches = [...statText.matchAll(rangePattern)];
  if (matches.length > 0) {
    // For damage ranges like "(3-5) to (7-8)", we take first range for min, second for max
    if (matches.length === 2) {
      // This is a damage range
      min = parseFloat(matches[0][1]); // min of first range
      max = parseFloat(matches[1][2]); // max of second range
    } else {
      // Single range like "(100-114)" or "(0.2-0.4)"
      min = parseFloat(matches[0][1]);
      max = parseFloat(matches[0][2]);
    }
  } else {
    // Check for simple "X to Y" pattern
    const simpleMatch = statText.match(simplePattern);
    if (simpleMatch) {
      min = parseFloat(simpleMatch[1]);
      max = parseFloat(simpleMatch[2]);
    } else {
      // Fixed value
      const fixedMatch = statText.match(fixedPattern);
      if (fixedMatch) {
        min = max = parseFloat(fixedMatch[1]);
      }
    }
  }
  
  return { min, max, text };
}

/**
 * Roll a random value within a stat's range
 * Handles both integer and decimal ranges appropriately
 */
export function rollStatValue(min: number, max: number): number {
  if (min === max) return min;
  
  // Check if we're dealing with decimal values
  const hasDecimals = !Number.isInteger(min) || !Number.isInteger(max);
  
  if (hasDecimals) {
    // For decimal ranges, roll a random decimal value
    // Use appropriate precision based on the input
    const precision = Math.max(
      (min.toString().split('.')[1] || '').length,
      (max.toString().split('.')[1] || '').length
    );
    const multiplier = Math.pow(10, precision);
    const minInt = Math.round(min * multiplier);
    const maxInt = Math.round(max * multiplier);
    const rolled = Math.floor(Math.random() * (maxInt - minInt + 1)) + minInt;
    return rolled / multiplier;
  }
  
  // Integer range
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * Format a number for display (removes unnecessary decimal places)
 */
function formatNumber(value: number): string {
  // If it's a whole number, show without decimals
  if (Number.isInteger(value)) {
    return value.toString();
  }
  // Otherwise show with appropriate precision (up to 2 decimal places)
  const fixed = value.toFixed(2);
  // Remove trailing zeros
  return parseFloat(fixed).toString();
}

/**
 * Format a stat line with a rolled value
 * Supports decimal values like "(0.2-0.4)"
 */
export function formatStatWithValue(statText: string, value: number | [number, number] | number[]): string {
  // Replace range patterns with the rolled value
  // Pattern matches decimals like (0.2-0.4), (100-114), (2.1-8)
  const rangePattern = /\(([\d.]+)-([\d.]+)\)/g;
  
  if (Array.isArray(value)) {
    // Multiple values - replace each range with corresponding value
    let matchIndex = 0;
    let result = statText.replace(rangePattern, () => {
      const val = value[matchIndex] ?? value[value.length - 1]; // Use last value if we run out
      matchIndex++;
      return formatNumber(val);
    });
    result = result.replace(/#/g, formatNumber(value[0]));
    return result;
  } else {
    // Single value - only replace the FIRST range pattern, not all of them
    // This prevents malformed dual-stat data from having both stats show the same value
    let replaced = false;
    let result = statText.replace(rangePattern, (match) => {
      if (!replaced) {
        replaced = true;
        return formatNumber(value);
      }
      return match; // Leave subsequent ranges unchanged
    });
    result = result.replace(/#/g, formatNumber(value));
    return result;
  }
}

