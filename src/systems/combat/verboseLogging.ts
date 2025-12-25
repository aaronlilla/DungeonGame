import type { CombatLogEntry } from '../../types/dungeon';
import type { TeamMemberState } from '../../types/combat';
import type { AnimatedEnemy } from '../../types/combat';

/**
 * Verbose logging utility for comprehensive combat tracking
 */

export interface EntityStats {
  // Basic stats
  name: string;
  health: number;
  maxHealth: number;
  healthPercent: number;
  // Energy Shield
  energyShield?: number;
  maxEnergyShield?: number;
  esPercent?: number;
  // Mana (for players)
  mana?: number;
  maxMana?: number;
  manaPercent?: number;
  // Offensive stats
  damage?: number;
  accuracy?: number;
  criticalStrikeChance?: number;
  criticalStrikeMultiplier?: number;
  // Defensive stats
  armor?: number;
  evasion?: number;
  blockChance?: number;
  spellBlockChance?: number;
  spellSuppressionChance?: number;
  // Resistances
  fireResistance?: number;
  coldResistance?: number;
  lightningResistance?: number;
  chaosResistance?: number;
  // Status
  isDead: boolean;
  isCasting?: boolean;
  castAbility?: string;
  // Buffs/Debuffs
  armorBuff?: number;
  blockBuff?: number;
  damageReduction?: number;
  // Talent bonuses
  talentBonuses?: {
    damageMultiplier?: number;
    healingMultiplier?: number;
    damageReduction?: number;
    blockEffectiveness?: number;
    evadeChance?: number;
    spellSuppressionChance?: number;
    thorns?: number;
    lifesteal?: number;
    manaRegenMultiplier?: number;
    manaCostReduction?: number;
    castSpeedBonus?: number;
  };
  // Combat tracking
  totalDamage?: number;
  totalHealing?: number;
  damageTaken?: number;
}

/**
 * Serialize team member stats for logging
 */
export function serializeTeamMemberStats(member: TeamMemberState): EntityStats {
  const healthPercent = member.maxHealth > 0 ? (member.health / member.maxHealth) * 100 : 0;
  const esPercent = member.maxEnergyShield && member.maxEnergyShield > 0 
    ? ((member.energyShield || 0) / member.maxEnergyShield) * 100 
    : undefined;
  const manaPercent = member.maxMana > 0 ? (member.mana / member.maxMana) * 100 : undefined;
  
  return {
    name: member.name,
    health: member.health,
    maxHealth: member.maxHealth,
    healthPercent: Math.round(healthPercent * 10) / 10,
    energyShield: member.energyShield,
    maxEnergyShield: member.maxEnergyShield,
    esPercent: esPercent !== undefined ? Math.round(esPercent * 10) / 10 : undefined,
    mana: member.mana,
    maxMana: member.maxMana,
    manaPercent: manaPercent !== undefined ? Math.round(manaPercent * 10) / 10 : undefined,
    accuracy: member.accuracy,
    armor: member.armor,
    evasion: member.evasion,
    blockChance: member.blockChance,
    spellBlockChance: member.spellBlockChance,
    spellSuppressionChance: member.spellSuppressionChance,
    fireResistance: member.fireResistance,
    coldResistance: member.coldResistance,
    lightningResistance: member.lightningResistance,
    chaosResistance: member.chaosResistance,
    isDead: member.isDead,
    isCasting: member.isCasting,
    castAbility: member.castAbility,
    armorBuff: member.armorBuff,
    blockBuff: member.blockBuff,
    damageReduction: member.damageReduction,
    criticalStrikeChance: member.criticalStrikeChance,
    criticalStrikeMultiplier: member.criticalStrikeMultiplier,
    talentBonuses: member.talentBonuses ? {
      damageMultiplier: member.talentBonuses.damageMultiplier,
      healingMultiplier: member.talentBonuses.healingMultiplier,
      damageReduction: member.talentBonuses.damageReduction,
      blockEffectiveness: member.talentBonuses.blockEffectiveness,
      evadeChance: member.talentBonuses.evadeChance,
      spellSuppressionChance: member.talentBonuses.spellSuppressionChance,
      thorns: member.talentBonuses.thorns,
      lifesteal: member.talentBonuses.lifesteal,
      manaRegenMultiplier: member.talentBonuses.manaRegenMultiplier,
      manaCostReduction: member.talentBonuses.manaCostReduction,
      castSpeedBonus: member.talentBonuses.castSpeedBonus
    } : undefined,
    totalDamage: member.totalDamage,
    totalHealing: member.totalHealing,
    damageTaken: member.damageTaken
  };
}

/**
 * Serialize enemy stats for logging
 */
export function serializeEnemyStats(enemy: AnimatedEnemy): EntityStats {
  const healthPercent = enemy.maxHealth > 0 ? (enemy.health / enemy.maxHealth) * 100 : 0;
  const esPercent = enemy.maxEnergyShield && enemy.maxEnergyShield > 0 
    ? ((enemy.energyShield || 0) / enemy.maxEnergyShield) * 100 
    : undefined;
  
  return {
    name: enemy.name,
    health: enemy.health,
    maxHealth: enemy.maxHealth,
    healthPercent: Math.round(healthPercent * 10) / 10,
    energyShield: enemy.energyShield,
    maxEnergyShield: enemy.maxEnergyShield,
    esPercent: esPercent !== undefined ? Math.round(esPercent * 10) / 10 : undefined,
    damage: enemy.damage,
    armor: enemy.armor,
    evasion: enemy.evasion,
    fireResistance: enemy.fireResistance,
    coldResistance: enemy.coldResistance,
    lightningResistance: enemy.lightningResistance,
    chaosResistance: enemy.chaosResistance,
    isDead: enemy.isDead || false,
    isCasting: enemy.isCasting,
    castAbility: enemy.castAbility
  };
}

/**
 * Format stats as a readable string
 */
export function formatStatsString(stats: EntityStats): string {
  const parts: string[] = [];
  parts.push(`HP: ${stats.health}/${stats.maxHealth} (${stats.healthPercent}%)`);
  
  if (stats.energyShield !== undefined && stats.maxEnergyShield !== undefined && stats.maxEnergyShield > 0) {
    parts.push(`ES: ${stats.energyShield}/${stats.maxEnergyShield} (${stats.esPercent}%)`);
  }
  
  if (stats.mana !== undefined && stats.maxMana !== undefined) {
    parts.push(`Mana: ${stats.mana}/${stats.maxMana} (${stats.manaPercent}%)`);
  }
  
  if (stats.armor !== undefined) parts.push(`Armor: ${stats.armor}`);
  if (stats.evasion !== undefined) parts.push(`Evasion: ${stats.evasion}`);
  if (stats.blockChance !== undefined) parts.push(`Block: ${stats.blockChance}%`);
  if (stats.spellBlockChance !== undefined) parts.push(`SpellBlock: ${stats.spellBlockChance}%`);
  if (stats.spellSuppressionChance !== undefined) parts.push(`SpellSupp: ${stats.spellSuppressionChance}%`);
  
  const resists: string[] = [];
  if (stats.fireResistance !== undefined) resists.push(`Fire: ${stats.fireResistance}%`);
  if (stats.coldResistance !== undefined) resists.push(`Cold: ${stats.coldResistance}%`);
  if (stats.lightningResistance !== undefined) resists.push(`Light: ${stats.lightningResistance}%`);
  if (stats.chaosResistance !== undefined) resists.push(`Chaos: ${stats.chaosResistance}%`);
  if (resists.length > 0) parts.push(`Resists: ${resists.join(', ')}`);
  
  if (stats.damage !== undefined) parts.push(`Damage: ${stats.damage}`);
  if (stats.accuracy !== undefined) parts.push(`Accuracy: ${stats.accuracy}`);
  if (stats.criticalStrikeChance !== undefined) parts.push(`Crit: ${stats.criticalStrikeChance}%`);
  
  if (stats.armorBuff !== undefined) parts.push(`ArmorBuff: +${stats.armorBuff}%`);
  if (stats.blockBuff !== undefined) parts.push(`BlockBuff: +${stats.blockBuff}%`);
  if (stats.damageReduction !== undefined) parts.push(`DR: ${stats.damageReduction}%`);
  
  if (stats.isCasting && stats.castAbility) {
    parts.push(`Casting: ${stats.castAbility}`);
  }
  
  return parts.join(' | ');
}

export interface VerboseLogData {
  healthBefore?: number;
  healthAfter?: number;
  esBefore?: number;
  esAfter?: number;
  manaBefore?: number;
  manaAfter?: number;
  maxHealth?: number;
  maxES?: number;
  maxMana?: number;
  damageDealt?: number;
  damageBlocked?: number;
  damageEvaded?: boolean;
  damageReduced?: number;
  healingDone?: number;
  crit?: boolean;
  abilityName?: string;
  skillIcon?: string;
  damageType?: string;
  resistances?: {
    fire?: number;
    cold?: number;
    lightning?: number;
    chaos?: number;
  };
}

/**
 * Create a verbose damage log entry with before/after health and full stats
 */
export function createVerboseDamageLog(
  timestamp: number,
  source: string,
  target: string,
  damage: number,
  targetState: TeamMemberState | AnimatedEnemy,
  data?: VerboseLogData,
  sourceState?: TeamMemberState | AnimatedEnemy,
  allTeamStates?: TeamMemberState[],
  allEnemies?: AnimatedEnemy[]
): CombatLogEntry {
  const healthBefore = data?.healthBefore ?? targetState.health;
  const healthAfter = data?.healthAfter ?? (targetState.health - damage);
  const esBefore = data?.esBefore ?? ('energyShield' in targetState ? (targetState.energyShield ?? 0) : 0);
  const esAfter = data?.esAfter ?? ('energyShield' in targetState ? ((targetState.energyShield ?? 0) - damage) : 0);
  const maxHealth = data?.maxHealth ?? targetState.maxHealth;
  const maxES = data?.maxES ?? ('maxEnergyShield' in targetState ? (targetState.maxEnergyShield ?? 0) : 0);
  
  let message = `${source} deals ${damage} damage to ${target}`;
  if (data?.damageBlocked) {
    message += ` (${data.damageBlocked} blocked)`;
  }
  if (data?.damageEvaded) {
    message += ` (EVADED)`;
  }
  if (data?.crit) {
    message += ` (CRIT!)`;
  }
  if (data?.abilityName) {
    message += ` with ${data.abilityName}`;
  }
  message += `\n  Target Health: ${healthBefore}/${maxHealth} -> ${healthAfter}/${maxHealth}`;
  if (maxES !== undefined && maxES > 0) {
    message += ` | ES: ${esBefore}/${maxES} -> ${esAfter}/${maxES}`;
  }
  if (data?.damageType) {
    message += ` | Type: ${data.damageType}`;
  }
  if (data?.damageReduced) {
    message += ` | Reduced by: ${data.damageReduced}`;
  }
  
  // Add source stats
  if (sourceState) {
    const sourceStats = 'mana' in sourceState 
      ? serializeTeamMemberStats(sourceState as TeamMemberState)
      : serializeEnemyStats(sourceState as AnimatedEnemy);
    message += `\n  [SOURCE] ${formatStatsString(sourceStats)}`;
  }
  
  // Add target stats
  const targetStats = 'mana' in targetState 
    ? serializeTeamMemberStats(targetState as TeamMemberState)
    : serializeEnemyStats(targetState as AnimatedEnemy);
  message += `\n  [TARGET] ${formatStatsString(targetStats)}`;
  
  // Add all entity stats snapshot
  if (allTeamStates && allEnemies) {
    message += `\n  [ALL ENTITIES]`;
    allTeamStates.forEach(m => {
      const stats = serializeTeamMemberStats(m);
      message += `\n    Team-${stats.name}: ${formatStatsString(stats)}`;
    });
    allEnemies.forEach(e => {
      const stats = serializeEnemyStats(e);
      message += `\n    Enemy-${stats.name}: ${formatStatsString(stats)}`;
    });
  }
  
  return {
    timestamp,
    type: 'damage',
    source,
    target,
    value: damage,
    ability: data?.abilityName,
    message
  };
}

/**
 * Create a verbose heal log entry with before/after health and full stats
 */
export function createVerboseHealLog(
  timestamp: number,
  source: string,
  target: string,
  healing: number,
  targetState: TeamMemberState,
  data?: VerboseLogData,
  sourceState?: TeamMemberState,
  allTeamStates?: TeamMemberState[],
  allEnemies?: AnimatedEnemy[]
): CombatLogEntry {
  const healthBefore = data?.healthBefore ?? targetState.health;
  const healthAfter = data?.healthAfter ?? Math.min(targetState.maxHealth, targetState.health + healing);
  const maxHealth = data?.maxHealth ?? targetState.maxHealth;
  
  const skillIcon = data?.skillIcon || '';
  const abilityName = data?.abilityName || 'heal';
  let message = skillIcon 
    ? `${skillIcon} ${source} casts ${abilityName} on ${target} for ${healing}`
    : `${source} heals ${target} for ${healing}${abilityName !== 'heal' ? ` with ${abilityName}` : ''}`;
  if (data?.crit) {
    message += ` (CRIT!)`;
  }
  message += `\n  Target Health: ${healthBefore}/${maxHealth} -> ${healthAfter}/${maxHealth}`;
  
  // Add source stats
  if (sourceState) {
    const sourceStats = serializeTeamMemberStats(sourceState);
    message += `\n  [SOURCE] ${formatStatsString(sourceStats)}`;
  }
  
  // Add target stats
  const targetStats = serializeTeamMemberStats(targetState);
  message += `\n  [TARGET] ${formatStatsString(targetStats)}`;
  
  // Add all entity stats snapshot
  if (allTeamStates && allEnemies) {
    message += `\n  [ALL ENTITIES]`;
    allTeamStates.forEach(m => {
      const stats = serializeTeamMemberStats(m);
      message += `\n    Team-${stats.name}: ${formatStatsString(stats)}`;
    });
    allEnemies.forEach(e => {
      const stats = serializeEnemyStats(e);
      message += `\n    Enemy-${stats.name}: ${formatStatsString(stats)}`;
    });
  }
  
  return {
    timestamp,
    type: 'heal',
    source,
    target,
    value: healing,
    ability: data?.abilityName,
    message
  };
}

/**
 * Create a verbose state log entry for character/enemy state changes
 */
export function createVerboseStateLog(
  timestamp: number,
  entityName: string,
  entityState: TeamMemberState | AnimatedEnemy,
  reason: string
): CombatLogEntry {
  const health = entityState.health;
  const maxHealth = entityState.maxHealth;
  const healthPercent = maxHealth > 0 ? ((health / maxHealth) * 100).toFixed(1) : '0.0';
  
  let message = `[STATE] ${entityName}: Health ${health}/${maxHealth} (${healthPercent}%)`;
  
  if ('energyShield' in entityState && (entityState.energyShield ?? 0) > 0) {
    const maxES = entityState.maxEnergyShield ?? 0;
    const esPercent = maxES > 0 ? (((entityState.energyShield ?? 0) / maxES) * 100).toFixed(1) : '0.0';
    message += ` | ES ${entityState.energyShield}/${maxES} (${esPercent}%)`;
  }
  
  if ('mana' in entityState) {
    const maxMana = entityState.maxMana || 0;
    const manaPercent = maxMana > 0 ? ((entityState.mana / maxMana) * 100).toFixed(1) : '0.0';
    message += ` | Mana ${entityState.mana}/${maxMana} (${manaPercent}%)`;
  }
  
  if (reason) {
    message += ` | Reason: ${reason}`;
  }
  
  return {
    timestamp,
    type: 'phase',
    source: entityName,
    target: '',
    message
  };
}

/**
 * Create a verbose tick summary log entry with full stats for all entities
 */
export function createVerboseTickSummary(
  timestamp: number,
  tick: number,
  teamStates: TeamMemberState[],
  enemies: AnimatedEnemy[]
): CombatLogEntry {
  
  let message = `[TICK ${tick}] Full Entity State Snapshot:\n`;
  
  // Team member stats
  message += `  [TEAM MEMBERS]\n`;
  teamStates.forEach(m => {
    const stats = serializeTeamMemberStats(m);
    const status = m.isDead ? '[DEAD]' : '';
    message += `    ${status} ${stats.name}: ${formatStatsString(stats)}\n`;
  });
  
  // Enemy stats
  message += `  [ENEMIES]\n`;
  enemies.forEach(e => {
    const stats = serializeEnemyStats(e);
    const status = (e.isDead || e.health <= 0) ? '[DEAD]' : '';
    message += `    ${status} ${stats.name}: ${formatStatsString(stats)}\n`;
  });
  
  return {
    timestamp,
    type: 'phase',
    source: '',
    target: '',
    message
  };
}

/**
 * Create a verbose ability cast log entry
 */
export function createVerboseAbilityLog(
  timestamp: number,
  caster: string,
  abilityName: string,
  target: string | null,
  castTime: number,
  isStarting: boolean
): CombatLogEntry {
  const action = isStarting ? 'starts casting' : 'casts';
  const message = `${caster} ${action} ${abilityName}${target ? ` on ${target}` : ''} (${castTime.toFixed(1)}s cast time)`;
  
  return {
    timestamp,
    type: 'ability',
    source: caster,
    target: target || '',
    ability: abilityName,
    message
  };
}

