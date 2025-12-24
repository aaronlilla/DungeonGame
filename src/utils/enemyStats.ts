import type { DungeonEnemy } from '../types/dungeon';
import affixData from '../data/shields_armour_affixes.json';
import { calculateEnemyBaseStats, getMonsterStatsForLevel, dangerLevelToCharacterLevel } from './monsterStats';

/**
 * Parse armor affix data to get armor values by item level
 */
interface ArmorAffixMod {
  modifier: string;
  iLvl: number;
  stats: Array<{
    stat: string;
    min: number;
    max: number;
  }>;
}

interface ArmorAffixGroup {
  group: string;
  description: string;
  mods: ArmorAffixMod[];
}

interface ArmorAffixData {
  itemClass: string;
  affixes: {
    prefixes: ArmorAffixGroup[];
    suffixes: ArmorAffixGroup[];
  };
}

/**
 * Extract armor values by item level from affix data
 * Returns a map of iLvl -> average armor value
 */
export function parseArmorValuesByLevel(): Map<number, number> {
  const data = affixData as ArmorAffixData;
  const armorMap = new Map<number, number>();
  
  // Find the BaseLocalDefences group
  const baseDefencesGroup = data.affixes.prefixes.find(
    group => group.group === 'BaseLocalDefences'
  );
  
  if (baseDefencesGroup) {
    baseDefencesGroup.mods.forEach(mod => {
      const armorStat = mod.stats.find(stat => stat.stat === 'to Armour');
      if (armorStat) {
        // Use average of min and max
        const avgArmor = (armorStat.min + armorStat.max) / 2;
        armorMap.set(mod.iLvl, avgArmor);
      }
    });
  }
  
  return armorMap;
}

/**
 * Get armor value for a given level
 * Uses linear interpolation between known iLvl values
 */
export function getArmorForLevel(level: number, armorMap: Map<number, number>): number {
  if (armorMap.size === 0) return 0;
  
  // Get sorted levels
  const levels = Array.from(armorMap.keys()).sort((a, b) => a - b);
  
  // If level is below minimum, use minimum
  if (level <= levels[0]) {
    return armorMap.get(levels[0]) || 0;
  }
  
  // If level is above maximum, use maximum
  if (level >= levels[levels.length - 1]) {
    return armorMap.get(levels[levels.length - 1]) || 0;
  }
  
  // Find the two closest levels for interpolation
  let lowerLevel = levels[0];
  let upperLevel = levels[levels.length - 1];
  
  for (let i = 0; i < levels.length - 1; i++) {
    if (level >= levels[i] && level <= levels[i + 1]) {
      lowerLevel = levels[i];
      upperLevel = levels[i + 1];
      break;
    }
  }
  
  const lowerArmor = armorMap.get(lowerLevel) || 0;
  const upperArmor = armorMap.get(upperLevel) || 0;
  
  // Linear interpolation
  const ratio = (level - lowerLevel) / (upperLevel - lowerLevel);
  return Math.floor(lowerArmor + (upperArmor - lowerArmor) * ratio);
}

/**
 * Map enemy danger level to item level for stat calculation
 * Danger levels: 1-5, mapped to iLvl ranges
 */
function dangerLevelToItemLevel(dangerLevel: number, enemyType: 'normal' | 'elite' | 'miniboss' | 'boss'): number {
  // Base iLvl from danger level (roughly 1-5 maps to iLvl 1-50)
  let baseILvl = dangerLevel * 10;
  
  // Adjust by enemy type
  switch (enemyType) {
    case 'boss':
      baseILvl += 20; // Bosses are high level
      break;
    case 'miniboss':
      baseILvl += 15;
      break;
    case 'elite':
      baseILvl += 10;
      break;
    case 'normal':
      // No adjustment
      break;
  }
  
  // Clamp to reasonable range (1-69 based on affix data)
  return Math.max(1, Math.min(69, baseILvl));
}

/**
 * Assign defensive stats to an enemy based on PoE affix data
 */
export function assignEnemyDefensiveStats(enemy: DungeonEnemy): void {
  // First, ensure base health and damage are set from PoE monster stats
  // Only override if they're not set or are invalid
  if (!enemy.baseHealth || !enemy.baseDamage || enemy.baseHealth < 1 || enemy.baseDamage < 1) {
    const baseStats = calculateEnemyBaseStats(enemy);
    enemy.baseHealth = baseStats.baseHealth;
    enemy.baseDamage = baseStats.baseDamage;
  }
  
  // Get character level for this enemy's danger level
  const characterLevel = dangerLevelToCharacterLevel(enemy.dangerLevel);
  
  // Get PoE monster stats for defensive values
  const monsterStats = getMonsterStatsForLevel(characterLevel);
  
  const armorMap = parseArmorValuesByLevel();
  const itemLevel = dangerLevelToItemLevel(enemy.dangerLevel, enemy.type);
  
  // Get base armor from affix data
  const baseArmor = getArmorForLevel(itemLevel, armorMap);
  
  // Assign base values (can be overridden in enemy definitions)
  if (enemy.baseArmor === undefined) {
    // Use PoE monster armour value as base, scale by enemy type
    let armorMultiplier = 1.0;
    switch (enemy.type) {
      case 'boss':
        armorMultiplier = 2.5; // Bosses are much tankier
        break;
      case 'miniboss':
        armorMultiplier = 2.0;
        break;
      case 'elite':
        armorMultiplier = 1.5;
        break;
      case 'normal':
        armorMultiplier = 1.0;
        break;
    }
    // Use PoE armour value with type multiplier, or affix data as fallback
    enemy.baseArmor = Math.floor(monsterStats.armour * armorMultiplier);
  }
  
  // Default evasion from PoE monster stats
  if (enemy.baseEvasion === undefined) {
    let evasionMultiplier = 1.0;
    if (enemy.type === 'boss' || enemy.type === 'miniboss') {
      evasionMultiplier = 0.5; // Bosses are less evasive (more tanky)
    }
    enemy.baseEvasion = Math.floor(monsterStats.evasion * evasionMultiplier);
  }
  
  // Default energy shield (only for certain enemy types)
  if (enemy.baseEnergyShield === undefined) {
    if (enemy.type === 'boss' || enemy.type === 'miniboss') {
      // Bosses can have ES, scaled by health
      enemy.baseEnergyShield = Math.floor(enemy.baseHealth * 0.1);
    } else {
      enemy.baseEnergyShield = 0;
    }
  }
  
  // Default resistances (start low, can be customized)
  if (enemy.baseFireResistance === undefined) {
    enemy.baseFireResistance = 0;
  }
  if (enemy.baseColdResistance === undefined) {
    enemy.baseColdResistance = 0;
  }
  if (enemy.baseLightningResistance === undefined) {
    enemy.baseLightningResistance = 0;
  }
  if (enemy.baseChaosResistance === undefined) {
    enemy.baseChaosResistance = 0;
  }
}

