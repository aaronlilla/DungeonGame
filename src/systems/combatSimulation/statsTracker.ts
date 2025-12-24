import type { Character } from '../../types/character';
import type { CombatLogEntry } from '../../types/dungeon';

export interface StatsTracker {
  totalDamageDealt: number;
  totalDamageTaken: number;
  totalHealing: number;
  totalEnemiesKilled: number;
  deaths: number;
}

export function createStatsTracker(): StatsTracker {
  return {
    totalDamageDealt: 0,
    totalDamageTaken: 0,
    totalHealing: 0,
    totalEnemiesKilled: 0,
    deaths: 0
  };
}

/**
 * Parses combat log entries to extract and track statistics
 */
export function trackStatsFromLog(
  entry: CombatLogEntry,
  tracker: StatsTracker,
  team: Character[]
): void {
  if (entry.type === 'damage') {
    const damageMatch = entry.message.match(/(\d+)\s+damage/i);
    if (damageMatch) {
      const damage = parseInt(damageMatch[1]);
      if (entry.target && team.some(c => c.name === entry.target)) {
        tracker.totalDamageTaken += damage;
      } else {
        tracker.totalDamageDealt += damage;
      }
    }
  } else if (entry.type === 'heal') {
    const healMatch = entry.message.match(/(\d+)\s+heal/i);
    if (healMatch) {
      tracker.totalHealing += parseInt(healMatch[1]);
    }
  } else if (entry.type === 'death') {
    if (entry.target && team.some(c => c.name === entry.target)) {
      tracker.deaths++;
    } else {
      tracker.totalEnemiesKilled++;
    }
  }
}
