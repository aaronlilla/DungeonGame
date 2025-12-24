/**
 * Stat Translation System
 * Translates PoE stat IDs to human-readable display text
 */

import statTranslationsData from '../data/stat_translations.json';

interface StatCondition {
  min?: number;
  max?: number;
}

interface StatTranslation {
  condition: StatCondition[];
  format: string[];
  index_handlers: string[][];
  string: string;
}

interface TranslationEntry {
  English: StatTranslation[];
  ids: string[];
}

// Build lookup map from stat ID to translations
const translationMap = new Map<string, TranslationEntry>();

function initializeTranslations() {
  if (translationMap.size > 0) return;
  
  const data = statTranslationsData as TranslationEntry[];
  
  for (const entry of data) {
    for (const id of entry.ids) {
      translationMap.set(id, entry);
    }
  }
}

/**
 * Apply index handlers to transform the value
 */
function applyHandler(value: number, handlers: string[]): { value: number; decimals?: number } {
  let result = value;
  let decimals: number | undefined;
  
  for (const handler of handlers) {
    switch (handler) {
      case 'negate':
        result = -result;
        break;
      case 'divide_by_one_hundred':
        result = result / 100;
        decimals = 2;
        break;
      case 'per_minute_to_per_second':
        result = result / 60;
        decimals = 1;
        break;
      case 'per_minute_to_per_second_2dp':
      case 'per_minute_to_per_second_2dp_if_required':
        result = result / 60;
        decimals = 2;
        break;
      case 'divide_by_ten':
        result = result / 10;
        decimals = 1;
        break;
      case 'divide_by_twelve':
        result = result / 12;
        decimals = 1;
        break;
      case 'divide_by_fifteen':
        result = result / 15;
        decimals = 1;
        break;
      case 'divide_by_twenty':
        result = result / 20;
        decimals = 1;
        break;
      case 'divide_by_five':
        result = result / 5;
        decimals = 1;
        break;
      case 'divide_by_two':
        result = result / 2;
        decimals = 1;
        break;
      case 'multiply_by_four':
        result = result * 4;
        break;
      case 'milliseconds_to_seconds':
        result = result / 1000;
        decimals = 2;
        break;
      case 'milliseconds_to_seconds_2dp':
        result = result / 1000;
        decimals = 2;
        break;
      case 'deciseconds_to_seconds':
        result = result / 10;
        decimals = 1;
        break;
      case 'old_leech_percent':
        result = result / 5;
        decimals = 1;
        break;
      case 'old_leech_permyriad':
        result = result / 500;
        decimals = 2;
        break;
      // More handlers can be added as needed
    }
  }
  return { value: result, decimals };
}

/**
 * Check if a value matches a condition
 */
function matchesCondition(value: number, condition: StatCondition): boolean {
  if (Object.keys(condition).length === 0) return true;
  
  if (condition.min !== undefined && value < condition.min) return false;
  if (condition.max !== undefined && value > condition.max) return false;
  
  return true;
}

/**
 * Format a number for display
 */
function formatValue(value: number, format: string, decimals?: number): string {
  if (format === 'ignore') return '';
  
  // Format the number with appropriate precision
  let numStr: string;
  if (decimals !== undefined && decimals > 0) {
    // Check if we need decimal places
    const rounded = Number(value.toFixed(decimals));
    if (rounded === Math.floor(rounded)) {
      numStr = String(Math.floor(rounded));
    } else {
      numStr = rounded.toFixed(decimals);
    }
  } else {
    numStr = String(Math.round(value));
  }
  
  if (format === '#') return numStr;
  if (format === '+#') return value >= 0 ? `+${numStr}` : numStr;
  if (format === '#%') return `${numStr}%`;
  if (format === '+#%') return value >= 0 ? `+${numStr}%` : `${numStr}%`;
  return numStr;
}

/**
 * Translate a stat ID and value to display text
 */
export function translateStat(statId: string, values: number[]): string | null {
  initializeTranslations();
  
  const entry = translationMap.get(statId);
  if (!entry || !entry.English || entry.English.length === 0) {
    return null;
  }
  
  // Find the first matching translation
  for (const translation of entry.English) {
    // Check if conditions match
    let conditionsMatch = true;
    for (let i = 0; i < translation.condition.length; i++) {
      const condition = translation.condition[i];
      const value = values[i] ?? values[0];
      if (!matchesCondition(value, condition)) {
        conditionsMatch = false;
        break;
      }
    }
    
    if (!conditionsMatch) continue;
    
    // Apply handlers and format values
    let result = translation.string;
    
    for (let i = 0; i < values.length; i++) {
      const handlers = translation.index_handlers[i] || [];
      const format = translation.format[i] || '#';
      
      const { value: transformedValue, decimals } = applyHandler(values[i], handlers);
      
      const formatted = formatValue(transformedValue, format, decimals);
      result = result.replace(`{${i}}`, formatted);
    }
    
    // Clean up any remaining unfilled placeholders
    result = result.replace(/\{[0-9]+\}/g, '');
    
    return result;
  }
  
  return null;
}

/**
 * Translate a stat with a range (min-max)
 */
export function translateStatWithRange(statId: string, min: number, max: number): string {
  // Try translating with the min value
  const translated = translateStat(statId, [min]);
  
  if (!translated) {
    // Fall back to a formatted stat ID
    return formatFallbackStat(statId, min, max);
  }
  
  // If min and max are different, show the range
  if (min !== max) {
    // Check if the translation contains the value and replace it with range
    const minStr = String(Math.round(min));
    const maxStr = String(Math.round(max));
    
    // Try to replace the value with a range
    if (translated.includes(minStr)) {
      return translated.replace(minStr, `(${minStr}-${maxStr})`);
    }
  }
  
  return translated;
}

/**
 * Format a fallback stat when translation is not found
 */
function formatFallbackStat(statId: string, min: number, max: number): string {
  // Convert stat ID to readable format
  let readable = statId
    .replace(/_/g, ' ')
    .replace(/\+%/g, ' (increased)')
    .replace(/-%/g, ' (reduced)')
    .replace(/\+/g, ' ')
    .replace(/%/g, ' percent')
    .replace(/\s+/g, ' ')
    .trim();
  
  // Capitalize first letter
  readable = readable.charAt(0).toUpperCase() + readable.slice(1);
  
  if (min === max) {
    return `${readable}: ${min}`;
  }
  return `${readable}: ${min}-${max}`;
}

/**
 * Common stat ID to display string mappings for quick lookup
 * These provide fast translations for frequently used stats
 */
const COMMON_TRANSLATIONS: Record<string, (min: number, max: number) => string> = {
  // Life
  'base_maximum_life': (min, max) => min === max ? `+${min} to maximum Life` : `+(${min}-${max}) to maximum Life`,
  // Mana
  'base_maximum_mana': (min, max) => min === max ? `+${min} to maximum Mana` : `+(${min}-${max}) to maximum Mana`,
  // Energy Shield
  'base_maximum_energy_shield': (min, max) => min === max ? `+${min} to maximum Energy Shield` : `+(${min}-${max}) to maximum Energy Shield`,
  // Attributes
  'additional_strength': (min, max) => min === max ? `+${min} to Strength` : `+(${min}-${max}) to Strength`,
  'additional_dexterity': (min, max) => min === max ? `+${min} to Dexterity` : `+(${min}-${max}) to Dexterity`,
  'additional_intelligence': (min, max) => min === max ? `+${min} to Intelligence` : `+(${min}-${max}) to Intelligence`,
  'additional_all_attributes': (min, max) => min === max ? `+${min} to all Attributes` : `+(${min}-${max}) to all Attributes`,
  'additional_strength_and_dexterity': (min, max) => min === max ? `+${min} to Strength and Dexterity` : `+(${min}-${max}) to Strength and Dexterity`,
  'additional_strength_and_intelligence': (min, max) => min === max ? `+${min} to Strength and Intelligence` : `+(${min}-${max}) to Strength and Intelligence`,
  'additional_dexterity_and_intelligence': (min, max) => min === max ? `+${min} to Dexterity and Intelligence` : `+(${min}-${max}) to Dexterity and Intelligence`,
  // Resistances
  'base_fire_damage_resistance_%': (min, max) => min === max ? `+${min}% to Fire Resistance` : `+(${min}-${max})% to Fire Resistance`,
  'base_cold_damage_resistance_%': (min, max) => min === max ? `+${min}% to Cold Resistance` : `+(${min}-${max})% to Cold Resistance`,
  'base_lightning_damage_resistance_%': (min, max) => min === max ? `+${min}% to Lightning Resistance` : `+(${min}-${max})% to Lightning Resistance`,
  'base_chaos_damage_resistance_%': (min, max) => min === max ? `+${min}% to Chaos Resistance` : `+(${min}-${max})% to Chaos Resistance`,
  'base_resist_all_elements_%': (min, max) => min === max ? `+${min}% to all Elemental Resistances` : `+(${min}-${max})% to all Elemental Resistances`,
  // Life Regen (per minute values converted to per second)
  'base_life_regeneration_rate_per_minute': (min, max) => {
    const perSec = (v: number) => {
      const val = v / 60;
      return val === Math.floor(val) ? String(val) : val.toFixed(1);
    };
    return min === max ? `Regenerate ${perSec(min)} Life per second` : `Regenerate ${perSec(min)}-${perSec(max)} Life per second`;
  },
  'life_regeneration_rate_per_minute_%': (min, max) => {
    const perSec = (v: number) => {
      const val = v / 60;
      return val === Math.floor(val) ? String(val) : val.toFixed(2);
    };
    return min === max ? `Regenerate ${perSec(min)}% of Life per second` : `Regenerate ${perSec(min)}-${perSec(max)}% of Life per second`;
  },
  // Mana Regen
  'mana_regeneration_rate_+%': (min, max) => min === max ? `${min}% increased Mana Regeneration Rate` : `(${min}-${max})% increased Mana Regeneration Rate`,
  // Movement Speed
  'base_movement_velocity_+%': (min, max) => min === max ? `${min}% increased Movement Speed` : `(${min}-${max})% increased Movement Speed`,
  // Attack Speed
  'attack_speed_+%': (min, max) => min === max ? `${min}% increased Attack Speed` : `(${min}-${max})% increased Attack Speed`,
  // Cast Speed
  'base_cast_speed_+%': (min, max) => min === max ? `${min}% increased Cast Speed` : `(${min}-${max})% increased Cast Speed`,
  // Crit
  'critical_strike_chance_+%': (min, max) => min === max ? `${min}% increased Critical Strike Chance` : `(${min}-${max})% increased Critical Strike Chance`,
  'base_critical_strike_multiplier_+': (min, max) => min === max ? `+${min}% to Critical Strike Multiplier` : `+(${min}-${max})% to Critical Strike Multiplier`,
  // Accuracy
  'accuracy_rating': (min, max) => min === max ? `+${min} to Accuracy Rating` : `+(${min}-${max}) to Accuracy Rating`,
  'accuracy_rating_+%': (min, max) => min === max ? `${min}% increased Global Accuracy Rating` : `(${min}-${max})% increased Global Accuracy Rating`,
  // Damage
  'physical_damage_+%': (min, max) => min === max ? `${min}% increased Physical Damage` : `(${min}-${max})% increased Physical Damage`,
  'spell_damage_+%': (min, max) => min === max ? `${min}% increased Spell Damage` : `(${min}-${max})% increased Spell Damage`,
  'elemental_damage_+%': (min, max) => min === max ? `${min}% increased Elemental Damage` : `(${min}-${max})% increased Elemental Damage`,
  // Armour/Evasion/ES
  'base_physical_damage_reduction_rating': (min, max) => min === max ? `+${min} to Armour` : `+(${min}-${max}) to Armour`,
  'base_evasion_rating': (min, max) => min === max ? `+${min} to Evasion Rating` : `+(${min}-${max}) to Evasion Rating`,
  'local_physical_damage_reduction_rating_+%': (min, max) => min === max ? `${min}% increased Armour` : `(${min}-${max})% increased Armour`,
  'local_evasion_rating_+%': (min, max) => min === max ? `${min}% increased Evasion Rating` : `(${min}-${max})% increased Evasion Rating`,
  'local_energy_shield_+%': (min, max) => min === max ? `${min}% increased Energy Shield` : `(${min}-${max})% increased Energy Shield`,
  // Energy Shield Delay
  'energy_shield_delay_-%': (min, max) => min === max ? `${min}% faster start of Energy Shield Recharge` : `(${min}-${max})% faster start of Energy Shield Recharge`,
  // Item Rarity
  'base_item_found_rarity_+%': (min, max) => min === max ? `${min}% increased Rarity of Items found` : `(${min}-${max})% increased Rarity of Items found`,
  // Block
  'base_block_%': (min, max) => min === max ? `+${min}% Chance to Block` : `+(${min}-${max})% Chance to Block`,
  // Weapon implicits
  'local_critical_strike_chance_+%': (min, max) => min === max ? `${min}% increased Critical Strike Chance` : `(${min}-${max})% increased Critical Strike Chance`,
  'local_accuracy_rating_+%': (min, max) => min === max ? `${min}% increased Accuracy Rating` : `(${min}-${max})% increased Accuracy Rating`,
};

/**
 * Get display text for a stat, using common translations first, then falling back to the translation file
 */
export function getStatDisplayText(statId: string, min: number, max: number): string {
  // Check common translations first (fast path)
  const common = COMMON_TRANSLATIONS[statId];
  if (common) {
    return common(min, max);
  }
  
  // Fall back to translation file
  const translated = translateStatWithRange(statId, min, max);
  return translated;
}

