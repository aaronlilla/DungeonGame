import type { CombatLogEntry, CombatLogMetadata, EntitySnapshot } from '../../types/dungeon';
import type { TeamMemberState, AnimatedEnemy } from '../../types/combat';
import type { Character } from '../../types/character';
import type { Dungeon } from '../../types/dungeon';

/**
 * Comprehensive verbose combat logger
 * Captures every detail of combat for debugging and analysis
 */
export class VerboseCombatLogger {
  private logEntries: CombatLogEntry[] = [];
  private combatStartTime: number = 0;
  private initialTeamState?: TeamMemberState[];
  private initialDungeonInfo?: {
    dungeon: Dungeon;
    keyLevel: number;
    mapTier?: number;
    mapAffixes?: string[];
  };

  constructor() {
    this.combatStartTime = Date.now();
  }

  /**
   * Initialize logger with combat start information
   */
  initialize(
    team: Character[],
    teamStates: TeamMemberState[],
    dungeon: Dungeon,
    keyLevel: number,
    mapContext?: {
      mapTier: number;
      quantityBonus: number;
      rarityBonus: number;
      mapAffixEffects: any;
      highestMapTierCompleted: number;
    }
  ): void {
    this.initialTeamState = JSON.parse(JSON.stringify(teamStates)); // Deep copy
    this.initialDungeonInfo = {
      dungeon,
      keyLevel,
      mapTier: mapContext?.mapTier,
      mapAffixes: []
    };

    // Log initial state
    this.logEntry({
      timestamp: 0,
      type: 'system',
      source: 'SYSTEM',
      target: '',
      message: 'COMBAT INITIALIZED',
      metadata: {
        combatPhase: 'traveling',
        dungeonDetails: {
          dungeonName: dungeon.name,
          keyLevel: keyLevel,
          mapTier: mapContext?.mapTier,
          mapAffixEffects: mapContext?.mapAffixEffects,
          scaling: {
            healthMultiplier: 1,
            damageMultiplier: 1,
            rewardMultiplier: 1
          }
        },
        allEntities: teamStates.map(state => this.serializeTeamMember(state, team.find(c => c.id === state.id))),
        talentDetails: {
          selectedTalents: {},
          talentBonuses: {}
        }
      }
    });
  }

  /**
   * Create entity snapshot for logging
   */
  private serializeTeamMember(member: TeamMemberState, _char?: Character): EntitySnapshot {
    const healthPercent = member.maxHealth > 0 ? (member.health / member.maxHealth) * 100 : 0;
    const manaPercent = member.maxMana > 0 ? (member.mana / member.maxMana) * 100 : 0;
    const esPercent = member.maxEnergyShield && member.maxEnergyShield > 0 
      ? ((member.energyShield || 0) / member.maxEnergyShield) * 100 
      : 0;

    return {
      id: member.id,
      name: member.name,
      type: 'team',
      role: member.role,
      health: member.health,
      maxHealth: member.maxHealth,
      healthPercent: Math.round(healthPercent * 10) / 10,
      mana: member.mana,
      maxMana: member.maxMana,
      manaPercent: Math.round(manaPercent * 10) / 10,
      energyShield: member.energyShield,
      maxEnergyShield: member.maxEnergyShield,
      esPercent: Math.round(esPercent * 10) / 10,
      stats: {
        armor: member.armor,
        evasion: member.evasion,
        accuracy: member.accuracy,
        blockChance: member.blockChance,
        spellBlockChance: member.spellBlockChance,
        spellSuppressionChance: member.spellSuppressionChance,
        criticalStrikeChance: member.criticalStrikeChance,
        criticalStrikeMultiplier: member.criticalStrikeMultiplier,
        fireResistance: member.fireResistance,
        coldResistance: member.coldResistance,
        lightningResistance: member.lightningResistance,
        chaosResistance: member.chaosResistance,
        lifeRegeneration: member.lifeRegeneration,
        manaRegeneration: member.manaRegeneration,
        damage: member.totalDamage
      },
      isDead: member.isDead,
      isCasting: member.isCasting,
      castAbility: member.castAbility,
      gcdRemaining: member.gcdEndTick ? Math.max(0, member.gcdEndTick - (this.currentTick || 0)) : undefined,
      buffs: this.extractBuffs(member),
      debuffs: [],
      hotEffects: member.hotEffects?.map(hot => ({
        name: hot.name,
        healPerTick: hot.healPerTick,
        expiresAtTick: hot.expiresAtTick
      })),
      talentBonuses: member.talentBonuses ? this.serializeTalentBonuses(member.talentBonuses) : undefined,
      totalDamage: member.totalDamage,
      totalHealing: member.totalHealing,
      damageTaken: member.damageTaken
    };
  }

  private serializeEnemy(enemy: AnimatedEnemy): EntitySnapshot {
    const healthPercent = enemy.maxHealth > 0 ? (enemy.health / enemy.maxHealth) * 100 : 0;
    const esPercent = enemy.maxEnergyShield && enemy.maxEnergyShield > 0 
      ? ((enemy.energyShield || 0) / enemy.maxEnergyShield) * 100 
      : 0;

    return {
      id: enemy.id,
      name: enemy.name,
      type: 'enemy',
      health: enemy.health,
      maxHealth: enemy.maxHealth,
      healthPercent: Math.round(healthPercent * 10) / 10,
      energyShield: enemy.energyShield,
      maxEnergyShield: enemy.maxEnergyShield,
      esPercent: Math.round(esPercent * 10) / 10,
      stats: {
        armor: enemy.armor,
        evasion: enemy.evasion,
        damage: enemy.damage,
        fireResistance: enemy.fireResistance,
        coldResistance: enemy.coldResistance,
        lightningResistance: enemy.lightningResistance,
        chaosResistance: enemy.chaosResistance
      },
      isDead: enemy.isDead || false,
      isCasting: enemy.isCasting,
      castAbility: enemy.castAbility
    };
  }

  private extractBuffs(member: TeamMemberState): Array<{ name: string; duration?: number; stacks?: number; value?: any }> {
    const buffs: Array<{ name: string; duration?: number; stacks?: number; value?: any }> = [];
    
    if (member.armorBuff && member.armorBuffEndTick) {
      buffs.push({ name: 'Armor Buff', duration: member.armorBuffEndTick, value: member.armorBuff });
    }
    if (member.blockBuff && member.blockBuffEndTick) {
      buffs.push({ name: 'Block Buff', duration: member.blockBuffEndTick, value: member.blockBuff });
    }
    if (member.damageReduction && member.damageReductionEndTick) {
      buffs.push({ name: 'Damage Reduction', duration: member.damageReductionEndTick, value: member.damageReduction });
    }
    if (member.hasRejuv) {
      buffs.push({ name: 'Rejuvenation', duration: 0 });
    }
    
    return buffs;
  }

  private serializeTalentBonuses(talentBonuses: any): Record<string, number> {
    const result: Record<string, number> = {};
    if (talentBonuses.damageMultiplier) result.damageMultiplier = talentBonuses.damageMultiplier;
    if (talentBonuses.healingMultiplier) result.healingMultiplier = talentBonuses.healingMultiplier;
    if (talentBonuses.damageReduction) result.damageReduction = talentBonuses.damageReduction;
    if (talentBonuses.blockBonus) result.blockBonus = talentBonuses.blockBonus;
    if (talentBonuses.blockEffectiveness) result.blockEffectiveness = talentBonuses.blockEffectiveness;
    if (talentBonuses.critBonus) result.critBonus = talentBonuses.critBonus;
    if (talentBonuses.castSpeedBonus) result.castSpeedBonus = talentBonuses.castSpeedBonus;
    if (talentBonuses.lifesteal) result.lifesteal = talentBonuses.lifesteal;
    if (talentBonuses.thorns) result.thorns = talentBonuses.thorns;
    if (talentBonuses.manaRegenMultiplier) result.manaRegenMultiplier = talentBonuses.manaRegenMultiplier;
    if (talentBonuses.manaCostReduction) result.manaCostReduction = talentBonuses.manaCostReduction;
    if (talentBonuses.spellSuppressionChance) result.spellSuppressionChance = talentBonuses.spellSuppressionChance;
    if (talentBonuses.evadeChance) result.evadeChance = talentBonuses.evadeChance;
    return result;
  }

  private currentTick: number = 0;

  setCurrentTick(tick: number): void {
    this.currentTick = tick;
  }

  /**
   * Add an entry to the log
   */
  private logEntry(entry: CombatLogEntry): void {
    this.logEntries.push(entry);
  }

  /**
   * Log damage with full details
   */
  logDamage(
    timestamp: number,
    source: string,
    target: string,
    damage: number,
    sourceState?: TeamMemberState | AnimatedEnemy,
    targetState?: TeamMemberState | AnimatedEnemy,
    details?: {
      ability?: string;
      crit?: boolean;
      critMultiplier?: number;
      damageType?: string;
      blocked?: boolean;
      blockAmount?: number;
      evaded?: boolean;
      mitigated?: boolean;
      mitigationAmount?: number;
      baseDamage?: number;
      beforeHealth?: number;
      afterHealth?: number;
      beforeES?: number;
      afterES?: number;
      skillId?: string;
      skillName?: string;
      skillIcon?: string;
      castTime?: number;
      manaCost?: number;
      supportGems?: string[];
      damageMultiplier?: number;
      bloodlustActive?: boolean;
    },
    allTeamStates?: TeamMemberState[],
    allEnemies?: AnimatedEnemy[],
    char?: Character
  ): void {
    const metadata: CombatLogMetadata = {
      tick: this.currentTick,
      damageDetails: {
        baseDamage: details?.baseDamage,
        crit: details?.crit,
        critMultiplier: details?.critMultiplier,
        damageType: details?.damageType as any,
        blocked: details?.blocked,
        blockAmount: details?.blockAmount,
        evaded: details?.evaded,
        mitigated: details?.mitigated,
        mitigationAmount: details?.mitigationAmount,
        beforeHealth: details?.beforeHealth ?? (targetState && 'health' in targetState ? targetState.health : undefined),
        afterHealth: details?.afterHealth,
        beforeES: details?.beforeES ?? (targetState && 'energyShield' in targetState ? (targetState.energyShield || 0) : undefined),
        afterES: details?.afterES
      },
      abilityDetails: details?.ability ? {
        skillName: details.skillName || details.ability,
        skillId: details.skillId,
        skillIcon: details.skillIcon,
        castTime: details.castTime,
        manaCost: details.manaCost,
        supportGems: details.supportGems,
        damageMultiplier: details.damageMultiplier,
        bloodlustActive: details.bloodlustActive
      } : undefined
    };

    if (sourceState) {
      metadata.sourceState = 'mana' in sourceState
        ? this.serializeTeamMember(sourceState as TeamMemberState, char)
        : this.serializeEnemy(sourceState as AnimatedEnemy);
    }

    if (targetState) {
      metadata.targetState = 'mana' in targetState
        ? this.serializeTeamMember(targetState as TeamMemberState)
        : this.serializeEnemy(targetState as AnimatedEnemy);
    }

    if (allTeamStates && allEnemies) {
      metadata.allEntities = [
        ...allTeamStates.map(state => {
          const charForState = char?.id === state.id ? char : undefined;
          return this.serializeTeamMember(state, charForState);
        }),
        ...allEnemies.map(enemy => this.serializeEnemy(enemy))
      ];
    }

    let message = `${source} deals ${damage} damage to ${target}`;
    if (details?.blocked && details.blockAmount) {
      message += ` (${details.blockAmount} blocked)`;
    }
    if (details?.evaded) {
      message += ` (EVADED)`;
    }
    if (details?.crit) {
      message += ` (CRIT!)`;
    }
    if (details?.ability) {
      message += ` with ${details.ability}`;
    }

    this.logEntry({
      timestamp,
      type: 'damage',
      source,
      target,
      value: damage,
      ability: details?.ability,
      message,
      metadata
    });
  }

  /**
   * Log healing with full details
   */
  logHeal(
    timestamp: number,
    source: string,
    target: string,
    healing: number,
    sourceState?: TeamMemberState,
    targetState?: TeamMemberState,
    details?: {
      ability?: string;
      crit?: boolean;
      skillId?: string;
      skillName?: string;
      skillIcon?: string;
      beforeHealth?: number;
      afterHealth?: number;
    },
    allTeamStates?: TeamMemberState[],
    allEnemies?: AnimatedEnemy[]
  ): void {
    const metadata: CombatLogMetadata = {
      tick: this.currentTick,
      damageDetails: {
        beforeHealth: details?.beforeHealth ?? targetState?.health,
        afterHealth: details?.afterHealth
      },
      abilityDetails: details?.ability ? {
        skillName: details.skillName || details.ability,
        skillId: details.skillId,
        skillIcon: details.skillIcon
      } : undefined
    };

    if (sourceState) {
      metadata.sourceState = this.serializeTeamMember(sourceState);
    }

    if (targetState) {
      metadata.targetState = this.serializeTeamMember(targetState);
    }

    if (allTeamStates && allEnemies) {
      metadata.allEntities = [
        ...allTeamStates.map(state => this.serializeTeamMember(state)),
        ...allEnemies.map(enemy => this.serializeEnemy(enemy))
      ];
    }

    let message = `${source} heals ${target} for ${healing}`;
    if (details?.crit) {
      message += ` (CRIT!)`;
    }
    if (details?.ability) {
      message += ` with ${details.ability}`;
    }

    this.logEntry({
      timestamp,
      type: 'heal',
      source,
      target,
      value: healing,
      ability: details?.ability,
      message,
      metadata
    });
  }

  /**
   * Log ability cast
   */
  logAbility(
    timestamp: number,
    caster: string,
    abilityName: string,
    target: string | null,
    casterState?: TeamMemberState | AnimatedEnemy,
    details?: {
      castTime?: number;
      cooldown?: number;
      manaCost?: number;
      skillId?: string;
      skillIcon?: string;
      supportGems?: string[];
    },
    allTeamStates?: TeamMemberState[],
    allEnemies?: AnimatedEnemy[]
  ): void {
    const metadata: CombatLogMetadata = {
      tick: this.currentTick,
      abilityDetails: {
        skillName: abilityName,
        skillId: details?.skillId,
        skillIcon: details?.skillIcon,
        castTime: details?.castTime,
        cooldown: details?.cooldown,
        manaCost: details?.manaCost,
        supportGems: details?.supportGems
      }
    };

    if (casterState) {
      metadata.sourceState = 'mana' in casterState
        ? this.serializeTeamMember(casterState as TeamMemberState)
        : this.serializeEnemy(casterState as AnimatedEnemy);
    }

    if (allTeamStates && allEnemies) {
      metadata.allEntities = [
        ...allTeamStates.map(state => this.serializeTeamMember(state)),
        ...allEnemies.map(enemy => this.serializeEnemy(enemy))
      ];
    }

    this.logEntry({
      timestamp,
      type: 'ability',
      source: caster,
      target: target || '',
      ability: abilityName,
      message: `${caster} casts ${abilityName}${target ? ` on ${target}` : ''}`,
      metadata
    });
  }

  /**
   * Log buff/debuff application
   */
  logBuff(
    timestamp: number,
    source: string,
    target: string,
    buffName: string,
    isDebuff: boolean,
    targetState?: TeamMemberState | AnimatedEnemy,
    details?: {
      duration?: number;
      stacks?: number;
      value?: any;
    }
  ): void {
    const metadata: CombatLogMetadata = {
      tick: this.currentTick
    };

    if (targetState) {
      metadata.targetState = 'mana' in targetState
        ? this.serializeTeamMember(targetState as TeamMemberState)
        : this.serializeEnemy(targetState as AnimatedEnemy);
    }

    this.logEntry({
      timestamp,
      type: isDebuff ? 'debuff' : 'buff',
      source,
      target,
      ability: buffName,
      message: `${source} applies ${buffName} to ${target}${details?.duration ? ` (${details.duration}s)` : ''}${details?.stacks ? ` [${details.stacks} stacks]` : ''}`,
      metadata
    });
  }

  /**
   * Log tick summary (full state snapshot)
   */
  logTickSummary(
    timestamp: number,
    tick: number,
    teamStates: TeamMemberState[],
    enemies: AnimatedEnemy[],
    combatPhase?: string,
    pullIndex?: number
  ): void {
    const metadata: CombatLogMetadata = {
      tick,
      combatPhase: combatPhase as any,
      pullIndex,
      allEntities: [
        ...teamStates.map(state => this.serializeTeamMember(state)),
        ...enemies.map(enemy => this.serializeEnemy(enemy))
      ]
    };

    this.logEntry({
      timestamp,
      type: 'system',
      source: 'SYSTEM',
      target: '',
      message: `[TICK ${tick}] Full State Snapshot`,
      metadata
    });
  }

  /**
   * Log phase change
   */
  logPhase(
    timestamp: number,
    phase: string,
    details?: {
      pullIndex?: number;
      message?: string;
    }
  ): void {
    const metadata: CombatLogMetadata = {
      tick: this.currentTick,
      combatPhase: phase as any,
      pullIndex: details?.pullIndex
    };

    this.logEntry({
      timestamp,
      type: 'phase',
      source: 'SYSTEM',
      target: '',
      message: details?.message || `Phase: ${phase}`,
      metadata
    });
  }

  /**
   * Log pull start
   */
  logPullStart(
    timestamp: number,
    pullIndex: number,
    enemies: AnimatedEnemy[],
    teamStates: TeamMemberState[]
  ): void {
    const metadata: CombatLogMetadata = {
      tick: this.currentTick,
      combatPhase: 'combat',
      pullIndex,
      allEntities: [
        ...teamStates.map(state => this.serializeTeamMember(state)),
        ...enemies.map(enemy => this.serializeEnemy(enemy))
      ]
    };

    this.logEntry({
      timestamp,
      type: 'pull',
      source: 'SYSTEM',
      target: '',
      message: `Pull ${pullIndex + 1} started with ${enemies.length} enemies`,
      metadata
    });
  }

  /**
   * Log debug information (weapon loading, initialization, etc.)
   */
  logDebug(
    timestamp: number,
    category: string,
    message: string,
    data?: Record<string, any>
  ): void {
    this.logEntry({
      timestamp,
      type: 'system',
      source: 'DEBUG',
      target: category,
      message,
      metadata: {
        tick: this.currentTick,
        debugData: data
      }
    });
  }

  /**
   * Internal method to add log entry
   */
  private logEntry(entry: CombatLogEntry): void {
    this.logEntries.push(entry);
  }

  /**
   * Log entry and optionally add to combat state
   * This allows the verbose logger to also update the regular combat log
   */
  logEntryAndUpdateState(entry: CombatLogEntry, updateCombatState?: (updater: (prev: any) => any) => void): void {
    this.logEntry(entry);
    // Also add to regular combat log if update function provided
    if (updateCombatState) {
      updateCombatState(prev => ({
        ...prev,
        combatLog: [...prev.combatLog, entry]
      }));
    }
  }

  /**
   * Get all log entries
   */
  getLogs(): CombatLogEntry[] {
    return [...this.logEntries];
  }

  /**
   * Clear logs
   */
  clear(): void {
    this.logEntries = [];
  }

  /**
   * Export logs as JSON
   */
  exportJSON(): string {
    return JSON.stringify({
      version: '1.0',
      combatStartTime: this.combatStartTime,
      combatEndTime: Date.now(),
      initialTeamState: this.initialTeamState,
      initialDungeonInfo: this.initialDungeonInfo,
      logEntries: this.logEntries
    }, null, 2);
  }
}

// Global logger instance
let globalLogger: VerboseCombatLogger | null = null;

export function getVerboseLogger(): VerboseCombatLogger {
  if (!globalLogger) {
    globalLogger = new VerboseCombatLogger();
  }
  return globalLogger;
}

export function resetVerboseLogger(): VerboseCombatLogger {
  globalLogger = new VerboseCombatLogger();
  return globalLogger;
}

