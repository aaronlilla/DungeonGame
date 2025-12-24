import monsterStatsData from '../data/default_monster_stats.json';
import type { DungeonEnemy, EnemyType } from '../types/dungeon';

interface MonsterStatsByLevel {
  [level: string]: {
    accuracy: number;
    ally_life: number;
    armour: number;
    evasion: number;
    life: number;
    physical_damage: number;
  };
}

const monsterStats = monsterStatsData as MonsterStatsByLevel;

/**
 * Get monster stats from PoE data for a given level
 * Interpolates between available levels if exact level not found
 */
export function getMonsterStatsForLevel(level: number): {
  life: number;
  physical_damage: number;
  accuracy: number;
  armour: number;
  evasion: number;
} {
  const levelStr = level.toString();
  
  // If exact level exists, use it
  if (monsterStats[levelStr]) {
    const stats = monsterStats[levelStr];
    return {
      life: stats.life,
      physical_damage: stats.physical_damage,
      accuracy: stats.accuracy,
      armour: stats.armour,
      evasion: stats.evasion
    };
  }
  
  // Find closest levels for interpolation
  const levels = Object.keys(monsterStats)
    .map(k => parseInt(k))
    .filter(k => !isNaN(k))
    .sort((a, b) => a - b);
  
  if (levels.length === 0) {
    // Fallback to default level 1 stats
    return {
      life: 22,
      physical_damage: 5,
      accuracy: 14,
      armour: 22,
      evasion: 67
    };
  }
  
  // If below minimum, use minimum
  if (level <= levels[0]) {
    const stats = monsterStats[levels[0].toString()];
    return {
      life: stats.life,
      physical_damage: stats.physical_damage,
      accuracy: stats.accuracy,
      armour: stats.armour,
      evasion: stats.evasion
    };
  }
  
  // If above maximum, use maximum
  if (level >= levels[levels.length - 1]) {
    const stats = monsterStats[levels[levels.length - 1].toString()];
    return {
      life: stats.life,
      physical_damage: stats.physical_damage,
      accuracy: stats.accuracy,
      armour: stats.armour,
      evasion: stats.evasion
    };
  }
  
  // Find bounding levels for interpolation
  let lowerLevel = levels[0];
  let upperLevel = levels[levels.length - 1];
  
  for (let i = 0; i < levels.length - 1; i++) {
    if (level >= levels[i] && level <= levels[i + 1]) {
      lowerLevel = levels[i];
      upperLevel = levels[i + 1];
      break;
    }
  }
  
  // Linear interpolation
  const lowerStats = monsterStats[lowerLevel.toString()];
  const upperStats = monsterStats[upperLevel.toString()];
  const ratio = (level - lowerLevel) / (upperLevel - lowerLevel);
  
  return {
    life: Math.floor(lowerStats.life + (upperStats.life - lowerStats.life) * ratio),
    physical_damage: lowerStats.physical_damage + (upperStats.physical_damage - lowerStats.physical_damage) * ratio,
    accuracy: Math.floor(lowerStats.accuracy + (upperStats.accuracy - lowerStats.accuracy) * ratio),
    armour: Math.floor(lowerStats.armour + (upperStats.armour - lowerStats.armour) * ratio),
    evasion: Math.floor(lowerStats.evasion + (upperStats.evasion - lowerStats.evasion) * ratio)
  };
}

/**
 * Map enemy danger level to character level
 * Danger levels represent difficulty tiers within a key level
 * Danger 1 = easy enemies (same level), Danger 5 = bosses (higher level)
 * 
 * This function is exported so it can be used by enemyStats.ts
 */
export function dangerLevelToCharacterLevel(dangerLevel: number): number {
  // Base assumption: +2 key = level 2 characters fighting level 2 monsters
  // Danger levels adjust the monster level relative to character level
  // Danger 1-2: same level as characters
  // Danger 3-4: +1-2 levels above
  // Danger 5: +3-4 levels above (bosses)
  
  // For base stats, assume characters are around level 2-5 for early game
  // This maps to the early levels in PoE where stats start low
  const baseCharacterLevel = 2;
  
  // Danger level adjusts monster level relative to character level
  // Danger 1 = character level, Danger 5 = character level + 3
  const levelOffset = dangerLevel - 1;
  
  return Math.max(1, baseCharacterLevel + levelOffset);
}

/**
 * Get type multiplier for enemy stats
 * Elite enemies are stronger, bosses even more so
 */
function getTypeMultiplier(enemyType: EnemyType): { health: number; damage: number } {
  switch (enemyType) {
    case 'normal':
      return { health: 1.0, damage: 1.0 };
    case 'elite':
      return { health: 2.0, damage: 1.5 }; // Elites have 2x health, 1.5x damage
    case 'miniboss':
      return { health: 1.33, damage: 1.5 }; // INCREASED: Minibosses have 1.33x health, 1.5x damage (was 0.67x)
    case 'boss':
      return { health: 2.67, damage: 2.0 }; // INCREASED: Bosses have 2.67x health, 2.0x damage (was 1.0x)
    default:
      return { health: 1.0, damage: 1.0 };
  }
}

/**
 * Calculate base health and damage for an enemy based on PoE monster stats
 * This uses the actual PoE monster data scaled by enemy type
 */
export function calculateEnemyBaseStats(enemy: DungeonEnemy): {
  baseHealth: number;
  baseDamage: number;
} {
  // Map danger level to character level
  const characterLevel = dangerLevelToCharacterLevel(enemy.dangerLevel);
  
  // Get PoE monster stats for that level
  const monsterStats = getMonsterStatsForLevel(characterLevel);
  
  // Get type multipliers
  const typeMult = getTypeMultiplier(enemy.type);
  
  // Calculate base stats with type multipliers
  // Use PoE's life value directly (it's already balanced)
  const baseHealth = Math.floor(monsterStats.life * typeMult.health);
  
  // Use PoE's physical_damage value directly
  const baseDamage = Math.floor(monsterStats.physical_damage * typeMult.damage);
  
  return {
    baseHealth,
    baseDamage
  };
}

