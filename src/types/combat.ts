import type { EnemyType } from './dungeon';

// Enemy combat behavior types
export type EnemyBehavior = 'melee' | 'caster' | 'archer' | 'aoe' | 'tankbuster' | 'boss';

import React from 'react';

export interface AnimatedEnemy {
  id: string;
  enemyId: string;
  name: string;
  icon: React.ReactNode;
  type: EnemyType;
  behavior: EnemyBehavior;
  health: number;
  maxHealth: number;
  damage: number;
  // Defensive stats
  armor?: number;
  evasion?: number;
  energyShield?: number;
  maxEnergyShield?: number;
  fireResistance?: number;
  coldResistance?: number;
  lightningResistance?: number;
  chaosResistance?: number;
  // Tick-based casting state
  isCasting: boolean;
  castStartTick?: number; // tick when cast started
  castEndTick?: number; // tick when cast completes
  castTotalTicks?: number; // total ticks for the cast (for UI progress)
  // Tick-based GCD tracking - GCD starts when ability STARTS
  gcdEndTick?: number; // tick when GCD expires (can cast again)
  // Tick-based cooldowns
  aoeCooldownEndTick?: number; // for aoe pulsing mobs
  tankbusterCooldownEndTick?: number; // for tankbuster mobs  
  autoAttackEndTick?: number; // per-enemy auto attack timer
  // Targeting
  castTarget?: string;
  castAbility?: string;
  lastCastTarget?: string;
  lastShotTarget?: string; // for archers to spread damage
  // Death state
  isDead?: boolean;
  deathTick?: number; // tick when enemy died (for death animation)
  // Legacy fields for UI animation (real-time based)
  castStartTime?: number; // timestamp for smooth UI animation
  castTotalTime?: number; // seconds for smooth UI animation
  deathTime?: number; // timestamp for death animation
  // Boss ability system state
  bossAbilityState?: import('../systems/combat/bossAbilities').BossAbilityState;
  partyDebuffs?: import('../systems/combat/bossAbilities').PartyDebuffState;
  partyBuffs?: import('../systems/combat/bossAbilities').PartyBuffState;
  bossBuffs?: import('../systems/combat/bossAbilities').BossBuffState;
}

export interface HotEffect {
  name: string;
  icon: string;
  healPerTick: number;
  expiresAtTick: number; // tick when HoT expires
  tickIntervalTicks: number; // ticks between heals (e.g., 20 = every 2 seconds)
  nextTickAtTick: number; // tick when next heal occurs
  sourceId: string; // ID of the healer who cast this HoT
}

export interface TeamMemberState {
  id: string;
  name: string;
  role: 'tank' | 'healer' | 'dps';
  health: number; // Current life (PoE: life)
  maxHealth: number; // Maximum life
  mana: number;
  maxMana: number;
  // PoE Offensive Stats
  accuracy?: number; // Accuracy rating (affects hit chance vs evasion)
  // PoE Defensive Stats
  armor: number; // Physical damage reduction (PoE formula)
  evasion?: number; // Evasion rating (chance to avoid attacks)
  energyShield?: number; // Current energy shield
  maxEnergyShield?: number; // Maximum energy shield
  // PoE Regeneration
  lifeRegeneration?: number; // % of max life regenerated per second
  manaRegeneration?: number; // % of max mana regenerated per second
  energyShieldRechargeRate?: number; // % of max ES recharged per second
  energyShieldRechargeDelay?: number; // Seconds before ES starts recharging
  lastDamageTakenTick?: number; // Tick when last damage was taken (for ES recharge delay)
  // PoE Resistances
  fireResistance?: number; // Fire damage reduction (%)
  coldResistance?: number; // Cold damage reduction (%)
  lightningResistance?: number; // Lightning damage reduction (%)
  chaosResistance?: number; // Chaos damage reduction (%)
  // PoE Block and Spell Defense
  blockChance?: number; // Chance to block physical attacks (%)
  spellBlockChance?: number; // Chance to block spells (%)
  spellSuppressionChance?: number; // Chance to reduce spell damage by 50% (%)
  // PoE Critical Strike
  criticalStrikeChance?: number; // Chance to deal critical hits (%)
  criticalStrikeMultiplier?: number; // Damage multiplier for crits (%)
  isDead: boolean;
  // Tick-based GCD tracking - GCD starts when ability STARTS
  gcdEndTick?: number; // tick when GCD expires (can start new cast)
  // Tick-based casting state
  isCasting?: boolean;
  castStartTick?: number; // tick when cast started
  castEndTick?: number; // tick when cast completes
  castTotalTicks?: number; // total ticks for the cast (for UI progress)
  castTargetId?: string; // who we're casting on
  castAbility?: string; // what we're casting
  // Legacy UI animation fields (real-time based for smooth visuals)
  castStartTime?: number; // timestamp for smooth UI animation
  castTotalTime?: number; // seconds for smooth UI animation
  // Buffs and effects (tick-based durations)
  hotEffects?: HotEffect[]; // Healing over time effects
  damageReduction?: number; // % damage reduction (0-100)
  damageReductionEndTick?: number; // tick when buff expires
  recentDamageTaken?: number; // damage taken in last few seconds
  hasRejuv?: boolean; // has rejuvenation active
  // Tank buffs (tick-based durations)
  armorBuff?: number; // % armor increase from Defensive Stance
  armorBuffEndTick?: number; // tick when armor buff expires
  blockBuff?: number; // % block chance increase from Shield Block
  blockBuffEndTick?: number; // tick when block buff expires
  // Block animation (real-time for UI)
  lastBlockTime?: number;
  // Resurrection animation (real-time for UI)
  lastResurrectTime?: number;
  // Heal/External animations (real-time for UI)
  lastHealTime?: number;
  lastHealAmount?: number;
  lastHealCrit?: boolean;
  lastExternalTime?: number;
  lastExternalName?: string;
  // Tick-based channeling state
  isChanneling?: boolean; // Whether currently channeling a skill
  channelStacks?: number; // Current ramp-up stacks for ramping channels
  maxChannelStacks?: number; // Maximum ramp-up stacks
  channelNextTickAt?: number; // tick when next channel damage occurs
  channelSkillId?: string; // ID of skill being channeled
  channelManaPerTick?: number; // Mana cost per tick
  // Combat stats tracking
  totalDamage?: number;
  totalHealing?: number;
  damageBySpell?: Record<string, number>;
  healingBySpell?: Record<string, number>;
  // Damage taken tracking
  damageTaken?: number;
  damageTakenBySource?: Record<string, number>; // source name -> damage taken
  damageTakenByAbility?: Record<string, number>; // ability name -> damage taken
  // Passive effects from talent tree
  passiveEffects?: import('./passives').PassiveEffect[];
  // MoP-style talent bonuses
  talentBonuses?: import('./talents').TalentBonuses;
  // Weapon damage from equipped weapon (for attack skills)
  weaponDamage?: {
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
  };
  // Debuff effects from bosses
  healAbsorb?: number; // Amount of healing absorbed before actual healing applies
  canCastSpells?: boolean; // Whether the player can cast spells (false when silenced)
  confusionMissChance?: number; // % chance to miss attacks when confused
  hitChance?: number; // Base hit chance (reduced by blind)
  gcdMultiplier?: number; // GCD multiplier (increased by slow)
  lifesteal?: number; // % of damage dealt converted to healing
  healShield?: number; // Temporary shield amount
  leechShield?: number; // Shield from leeching
}

export interface PlayerAbility {
  id: string;
  name: string;
  icon: string;
  cooldown: number;
  currentCooldown: number;
  duration?: number;
  description: string;
}

export interface FloatingNumber {
  id: string;
  value: number | string; // Can be number for damage/heal, or string for "LEVEL UP!"
  type: 'player' | 'enemy' | 'heal' | 'crit' | 'blocked' | 'levelup';
  offsetX: number; // offset from team position
  offsetY: number; // offset from team position
  x: number; // absolute x position
  y: number; // absolute y position
  timestamp: number;
  level?: number; // For level up, store the new level
}

export interface LevelUpAnimation {
  characterId: string;
  newLevel: number;
  timestamp: number;
}

// Loot drop on the dungeon map (visible during combat)
export interface MapLootDrop {
  id: string;
  type: 'item' | 'orb' | 'map' | 'fragment';
  item?: import('./items').Item;
  orbType?: string;
  orbCount?: number;
  map?: import('./maps').MapItem;
  fragment?: import('./maps').Fragment;
  position: { x: number; y: number };
  droppedAt: number; // Timestamp when dropped
  collected: boolean;
  source: 'monster' | 'boss' | 'chest' | 'league';
  rarity: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';
  offScreen: boolean;
}

export interface CombatState {
  phase: 'idle' | 'traveling' | 'combat' | 'victory' | 'defeat';
  currentPullIndex: number;
  teamPosition: { x: number; y: number };
  enemies: AnimatedEnemy[];
  queuedEnemies: AnimatedEnemy[]; // Enemies waiting to trickle into combat
  teamStates: TeamMemberState[];
  combatLog: import('./dungeon').CombatLogEntry[];
  forcesCleared: number;
  timeElapsed: number;
  killedGateBosses: Set<string>;
  abilities: PlayerAbility[];
  bloodlustActive: boolean;
  bloodlustTimer: number;
  healerCasting?: { ability: string; progress: number; startTime: number };
  floatingNumbers: FloatingNumber[];
  levelUpAnimations: LevelUpAnimation[]; // Track level ups for frame animations
  lootDrops: MapLootDrop[]; // Loot dropped on the dungeon map during combat
  leagueEncounters: import('./maps').LeagueEncounter[]; // Random league mechanics on the map
}

export interface CombatRef {
  stop: boolean;
  paused: boolean;
  resurrectRequest: string | null;
  resurrectCastStartTick?: number;
  resurrectCastEndTick?: number;
  bloodlustRequest: boolean;
  abilityCooldowns: Record<string, number>;
  // For simulation: reference to update context teamStates for auto-resurrection
  simulationContextRef?: { teamStates?: TeamMemberState[] };
}

