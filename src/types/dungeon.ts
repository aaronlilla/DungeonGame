import type { Item } from './items';
import React from 'react';
import { 
  GiSkullCrossedBones, GiRat, GiTombstone, GiCrossedSwords,
  GiWizardStaff, GiBatMask, GiSkullShield, GiShieldBash, GiBroadsword
} from 'react-icons/gi';

// Dungeon difficulty key level
export interface KeyLevel {
  level: number;
  healthMultiplier: number;
  damageMultiplier: number;
  rewardMultiplier: number;
  itemQuantity: number; // Item quantity multiplier (0% at +2, increases by 8% per level)
  itemRarity: number; // Item rarity multiplier (0% at +2, increases by 8% per level)
}

// Affix modifiers
export interface DungeonAffix {
  id: string;
  name: string;
  description: string;
  icon: string;
  minKeyLevel: number;
  effects: AffixEffect[];
}

export interface AffixEffect {
  type: AffixEffectType;
  value: number;
}

export type AffixEffectType = 'enemyDamageIncrease' | 'enemyHealthIncrease' | 'playerDamageReduction' | 'periodicDamage' | 'healingReduction' | 'explosionOnDeath' | 'enrage' | 'bolster' | 'sanguine' | 'quaking' | 'grievous' | 'tyrannical' | 'fortified';

// Enemy types - determines visual size
export type EnemyType = 'normal' | 'elite' | 'miniboss' | 'boss';

// An enemy definition
export interface DungeonEnemy {
  id: string;
  name: string;
  icon: React.ReactNode;
  type: EnemyType;
  baseHealth: number;
  baseDamage: number;
  abilities: EnemyAbility[];
  enemyForces: number;
  dangerLevel: number;
  // Defensive stats (based on PoE affix data)
  baseArmor?: number;        // Physical damage reduction
  baseEvasion?: number;       // Chance to evade attacks
  baseEnergyShield?: number;  // Secondary health pool
  baseFireResistance?: number;    // Fire resistance %
  baseColdResistance?: number;    // Cold resistance %
  baseLightningResistance?: number; // Lightning resistance %
  baseChaosResistance?: number;    // Chaos resistance %
}

// Ability tags for proper categorization (PoE style)
export type AbilityTag = 
  | 'attack' | 'spell'           // Attack type
  | 'melee' | 'ranged'           // Range type  
  | 'projectile' | 'aoe'         // Delivery type
  | 'physical' | 'fire' | 'cold' | 'lightning' | 'chaos' | 'shadow' | 'holy';  // Damage element

export interface EnemyAbility {
  id: string;
  name: string;
  description: string;
  damageType: 'physical' | 'fire' | 'cold' | 'lightning' | 'chaos' | 'shadow' | 'holy';
  tags: AbilityTag[];  // Proper categorization: ['spell', 'projectile', 'fire']
  damage?: number;
  castTime: number;
  cooldown: number;
  interruptible: boolean;
  avoidable: boolean;
  effects: string[];
  icon?: string;
}

// A pack of enemies
export interface EnemyPack {
  id: string;
  enemies: { enemyId: string; count: number }[];
  position: { x: number; y: number };
  pullRadius: number;
  totalForces: number;
  gate: 1 | 2 | 3;
  difficulty: number;
  isGateBoss?: boolean;
  displayName?: string; // Randomly assigned boss name for gate bosses
}

// Gate definition
export interface DungeonGate {
  id: number;
  name: string;
  requiredForces: number;
  xStart: number;
  xEnd: number;
  bossPackId: string;
}

// A dungeon definition
export interface Dungeon {
  id: string;
  name: string;
  description: string;
  requiredForces: number;
  timeLimitSeconds: number;
  enemyPacks: EnemyPack[];
  bosses: DungeonBoss[];
  availableEnemies: DungeonEnemy[];
  mapWidth: number;
  mapHeight: number;
  gates: DungeonGate[];
}

// Boss encounter (final boss)
export interface DungeonBoss {
  id: string;
  enemy: DungeonEnemy;
  position: { x: number; y: number };
  isFinalBoss: boolean;
  phases?: BossPhase[];
  gate: 1 | 2 | 3;
  displayName?: string; // Randomly assigned boss name
}

export interface BossPhase {
  healthThreshold: number;
  abilities: EnemyAbility[];
  description: string;
}

// Route types
export interface DungeonRoute {
  id: string;
  dungeonId: string;
  name: string;
  author: string;
  pulls: RoutePull[];
}

export interface RoutePull {
  pullNumber: number;
  packIds: string[];
  gate: 1 | 2 | 3;
}

export interface DungeonKey {
  id: string;
  dungeonId: string;
  level: number;
  affixes: string[];
  depleted: boolean;
}

export interface PlayerRunStats {
  id: string;
  name: string;
  role: 'tank' | 'healer' | 'dps';
  // Damage
  totalDamage: number;
  damageBySpell: Record<string, number>;
  dps: number; // damage per second
  // Healing
  totalHealing: number;
  healingBySpell: Record<string, number>;
  hps: number; // healing per second
  // Damage taken
  damageTaken: number;
  damageTakenBySource: Record<string, number>;
  damageTakenByAbility: Record<string, number>;
  dtps: number; // damage taken per second
  // Other stats
  deaths: number;
  timeAlive: number; // seconds alive during run
}

export interface DungeonRunResult {
  success: boolean;
  keyLevel: number;
  timeElapsed: number;
  timeLimit: number;
  upgradeLevel: number;
  loot: Item[];
  orbDrops: Record<string, number>;
  fragmentDrops?: import('./maps').Fragment[];
  experienceGained: number;
  deaths: number;
  forcesCleared: number;
  forcesRequired: number;
  combatLog: CombatLogEntry[];
  failReason?: 'wipe' | 'timeout';
  failedPullIndex?: number;
  deathCauses?: Record<string, string>;
  // Enhanced stats
  playerStats?: PlayerRunStats[];
  dungeonName?: string;
  affixes?: string[];
  startTime?: number; // timestamp when run started
  endTime?: number; // timestamp when run ended
  // Map system
  mapTier?: number;  // The tier of the map that was run
  mapDrops?: import('./maps').MapItem[];
}

export interface CombatLogEntry {
  timestamp: number;
  type: 'damage' | 'heal' | 'death' | 'ability' | 'buff' | 'debuff' | 'pull' | 'phase' | 'boss' | 'travel' | 'loot' | 'system' | 'level';
  source: string;
  target: string;
  value?: number;
  ability?: string;
  message: string;
}

// ===== ENEMY DEFINITIONS =====
// TIERED DIFFICULTY - Easy packs are hard, Hard packs are BRUTAL
// Design principles:
// - Easy mobs (zombies, rats): challenging but manageable
// - Medium mobs (warriors, ghouls): harder, requires attention
// - Hard mobs (assassins, elite casters): VERY dangerous
// - Tankbusters/Elites: borderline impossible in double pulls
// - Two easy packs = hard fight | Two hard packs = near wipe
// BALANCED ENEMY DEFINITIONS
// Design goals for +2 key with level 4 characters:
// - Single pulls should be comfortable (healer can keep up)
// - Double pulls should be challenging but doable
// - Triple pulls or pulls with multiple elites = very dangerous
// - DPS should survive 5-6 caster bolts before dying
// - Tank should survive 30+ seconds of sustained damage
export const SAMPLE_ENEMIES: DungeonEnemy[] = [
  // ========== TANKBUSTERS - DANGEROUS ==========
  // Crushing Blow chunks the tank - multiple tankbusters require cooldowns
  // Base stats will be calculated from PoE monster data based on dangerLevel and type
  { id: 'bone_crusher', name: 'Bone Crusher', icon: React.createElement(GiShieldBash), type: 'normal', baseHealth: 0, baseDamage: 0, enemyForces: 2, dangerLevel: 3, abilities: [
    { id: 'crushing_blow', name: 'Crushing Blow', description: 'Deals massive physical damage to the tank', damageType: 'physical', tags: ['attack', 'melee', 'physical'], damage: 180, castTime: 2.0, cooldown: 4.0, interruptible: false, avoidable: false, effects: [] }
  ]},
  { id: 'grave_executioner', name: 'Grave Executioner', icon: React.createElement(GiSkullShield), type: 'normal', baseHealth: 0, baseDamage: 0, enemyForces: 2, dangerLevel: 3, abilities: [
    { id: 'crushing_blow', name: 'Crushing Blow', description: 'Deals massive physical damage to the tank', damageType: 'physical', tags: ['attack', 'melee', 'physical'], damage: 180, castTime: 2.0, cooldown: 4.0, interruptible: false, avoidable: false, effects: [] }
  ]},
  { id: 'tomb_smasher', name: 'Tomb Smasher', icon: React.createElement(GiShieldBash), type: 'elite', baseHealth: 0, baseDamage: 0, enemyForces: 4, dangerLevel: 4, abilities: [
    { id: 'crushing_blow', name: 'Crushing Blow', description: 'Deals massive physical damage to the tank', damageType: 'physical', tags: ['attack', 'melee', 'physical'], damage: 220, castTime: 2.0, cooldown: 4.0, interruptible: false, avoidable: false, effects: [] }
  ]},
  
  // ========== ELITE CASTERS - DANGEROUS ==========
  // Spell damage hurts but DPS can survive 5-6 hits
  { id: 'dark_sorcerer', name: 'Dark Sorcerer', icon: React.createElement(GiWizardStaff), type: 'elite', baseHealth: 0, baseDamage: 0, enemyForces: 4, dangerLevel: 3, abilities: [
    { id: 'ice_bolt', name: 'Ice Bolt', description: 'Fires a shard of ice at a random party member', damageType: 'cold', tags: ['spell', 'ranged', 'projectile', 'cold'], damage: 120, castTime: 1.5, cooldown: 2.5, interruptible: true, avoidable: false, effects: [] }
  ]},
  { id: 'necromancer', name: 'Lesser Necromancer', icon: React.createElement(GiWizardStaff), type: 'elite', baseHealth: 0, baseDamage: 0, enemyForces: 5, dangerLevel: 4, abilities: [
    { id: 'lightning_bolt', name: 'Lightning Bolt', description: 'Fires a bolt of lightning at a random party member', damageType: 'lightning', tags: ['spell', 'ranged', 'projectile', 'lightning'], damage: 140, castTime: 1.5, cooldown: 2.5, interruptible: true, avoidable: false, effects: [] }
  ]},
  
  // ========== NORMAL CASTERS - MODERATE ==========
  // Manageable damage, good for learning
  { id: 'skeleton_mage', name: 'Skeleton Mage', icon: React.createElement(GiWizardStaff), type: 'normal', baseHealth: 0, baseDamage: 0, enemyForces: 2, dangerLevel: 2, abilities: [
    { id: 'fire_bolt', name: 'Fire Bolt', description: 'Fires a bolt of fire at a random party member', damageType: 'fire', tags: ['spell', 'ranged', 'projectile', 'fire'], damage: 80, castTime: 1.5, cooldown: 2.5, interruptible: true, avoidable: false, effects: [] }
  ]},
  { id: 'crypt_warlock', name: 'Crypt Warlock', icon: React.createElement(GiWizardStaff), type: 'normal', baseHealth: 0, baseDamage: 0, enemyForces: 2, dangerLevel: 2, abilities: [
    { id: 'shadow_bolt', name: 'Shadow Bolt', description: 'Fires a bolt of shadow at a random party member', damageType: 'shadow', tags: ['spell', 'ranged', 'projectile', 'shadow'], damage: 90, castTime: 1.5, cooldown: 2.5, interruptible: true, avoidable: false, effects: [] }
  ]},
  
  // ========== HARD MELEE - ABOVE AVERAGE DAMAGE ==========
  { id: 'shadow_assassin', name: 'Shadow Assassin', icon: React.createElement(GiBroadsword), type: 'normal', baseHealth: 0, baseDamage: 0, enemyForces: 1, dangerLevel: 3, abilities: [] },
  { id: 'ghoul', name: 'Ravenous Ghoul', icon: React.createElement(GiSkullCrossedBones), type: 'normal', baseHealth: 0, baseDamage: 0, enemyForces: 1, dangerLevel: 2, abilities: [] },
  { id: 'cultist', name: 'Dark Cultist', icon: React.createElement(GiBatMask), type: 'normal', baseHealth: 0, baseDamage: 0, enemyForces: 1, dangerLevel: 2, abilities: [] },
  
  // ========== MEDIUM MELEE - MODERATE DAMAGE ==========
  { id: 'skeleton_warrior', name: 'Skeleton Warrior', icon: React.createElement(GiSkullCrossedBones), type: 'normal', baseHealth: 0, baseDamage: 0, enemyForces: 1, dangerLevel: 1, abilities: [] },
  { id: 'risen_corpse', name: 'Risen Corpse', icon: React.createElement(GiTombstone), type: 'normal', baseHealth: 0, baseDamage: 0, enemyForces: 1, dangerLevel: 1, abilities: [] },
  
  // ========== EASY MELEE - LOWER DAMAGE ==========
  { id: 'zombie', name: 'Shambling Zombie', icon: React.createElement(GiTombstone), type: 'normal', baseHealth: 0, baseDamage: 0, enemyForces: 1, dangerLevel: 1, abilities: [] },
  { id: 'grave_rat', name: 'Grave Rat', icon: React.createElement(GiRat), type: 'normal', baseHealth: 0, baseDamage: 0, enemyForces: 1, dangerLevel: 1, abilities: [] },
  
  // ========== ELITE MELEE - HIGH DAMAGE ==========
  // Hit harder than normals - require tank attention
  { id: 'skeleton_captain', name: 'Skeleton Captain', icon: React.createElement(GiCrossedSwords), type: 'elite', baseHealth: 0, baseDamage: 0, enemyForces: 3, dangerLevel: 3, abilities: [] },
  { id: 'grave_knight', name: 'Grave Knight', icon: React.createElement(GiShieldBash), type: 'elite', baseHealth: 0, baseDamage: 0, enemyForces: 4, dangerLevel: 4, abilities: [] },
  { id: 'tomb_guardian', name: 'Tomb Guardian', icon: React.createElement(GiShieldBash), type: 'elite', baseHealth: 0, baseDamage: 0, enemyForces: 5, dangerLevel: 4, abilities: [] },
  
  // ========== MINIBOSS - GATE BOSSES ==========
  // Tough fights - require active tanking and healing!
  { id: 'bone_golem', name: 'Bone Golem', icon: React.createElement(GiShieldBash), type: 'miniboss', baseHealth: 0, baseDamage: 0, enemyForces: 0, dangerLevel: 5, abilities: [
    { id: 'ground_slam', name: 'Ground Slam', description: 'Slams the ground with devastating force, crushing the tank', damageType: 'physical', tags: ['attack', 'melee', 'physical'], damage: 250, castTime: 1.5, cooldown: 5.0, interruptible: false, avoidable: false, effects: [] }
  ]},
  { id: 'death_knight', name: 'Death Knight', icon: React.createElement(GiSkullShield), type: 'miniboss', baseHealth: 0, baseDamage: 0, enemyForces: 0, dangerLevel: 5, abilities: [
    { id: 'mortal_strike', name: 'Mortal Strike', description: 'A brutal strike that wounds the tank deeply', damageType: 'physical', tags: ['attack', 'melee', 'physical'], damage: 280, castTime: 1.5, cooldown: 5.0, interruptible: false, avoidable: false, effects: [] }
  ]},
  { id: 'lich', name: 'Undying Lich', icon: React.createElement(GiWizardStaff), type: 'miniboss', baseHealth: 0, baseDamage: 0, enemyForces: 0, dangerLevel: 5, abilities: [
    { id: 'soul_rend', name: 'Soul Rend', description: 'Tears at the tank\'s soul with dark magic', damageType: 'shadow', tags: ['spell', 'ranged', 'shadow'], damage: 260, castTime: 1.5, cooldown: 5.0, interruptible: false, avoidable: false, effects: [] }
  ]},
  
  // ========== FINAL BOSS ==========
  // The ultimate challenge - requires coordination and cooldowns!
  { id: 'necromancer_lord', name: 'Necromancer Lord', icon: React.createElement(GiSkullShield), type: 'boss', baseHealth: 0, baseDamage: 0, enemyForces: 0, dangerLevel: 5, abilities: [
    { id: 'death_coil', name: 'Death Coil', description: 'Unleashes a devastating blast of necrotic energy at the tank', damageType: 'shadow', tags: ['spell', 'ranged', 'shadow'], damage: 350, castTime: 1.5, cooldown: 5.0, interruptible: false, avoidable: false, effects: [] }
  ]}
];

// Cache for defensive stats initialization
let defensiveStatsInitialized = false;

export function getEnemyById(id: string): DungeonEnemy | undefined {
  const enemy = SAMPLE_ENEMIES.find(e => e.id === id);
  if (enemy && !defensiveStatsInitialized) {
    // Lazy load and assign defensive stats
    try {
      // Use dynamic import for code splitting
      import('../utils/enemyStats').then(({ assignEnemyDefensiveStats }) => {
        SAMPLE_ENEMIES.forEach(e => assignEnemyDefensiveStats(e));
        defensiveStatsInitialized = true;
      }).catch((e) => {
        // Fallback if module not available
        console.warn('Could not load enemy stats utility:', e);
      });
    } catch (e) {
      // Fallback if module not available
      console.warn('Could not load enemy stats utility:', e);
    }
  }
  return enemy;
}

export function getEnemySizeMultiplier(type: EnemyType): number {
  switch (type) {
    case 'boss': return 2.2;
    case 'miniboss': return 1.8;
    case 'elite': return 1.3;
    default: return 1.0;
  }
}

// ===== DUNGEON PACKS =====
// Gate 1 (0-1200): "The Graveyard" - Scattered tombstones, winding paths, organic spread
// Gate 2 (1200-2400): "The Catacombs" - Narrow corridors, tight clusters, branching tunnels  
// Gate 3 (2400-3600): "The Throne Chamber" - Grand hall, guarded positions, arena-like

const DUNGEON_PACKS: EnemyPack[] = [
  // ==================== GATE 1: THE GRAVEYARD ====================
  // Pack composition: 1-2 tankbusters, 2-3 casters, 3-6 melee
  
  // Cluster A - Entry (3 packs)
  { id: 'g1_01', enemies: [{ enemyId: 'bone_crusher', count: 1 }, { enemyId: 'skeleton_mage', count: 2 }, { enemyId: 'skeleton_warrior', count: 3 }], position: { x: 200, y: 380 }, pullRadius: 130, totalForces: 9, gate: 1, difficulty: 5 },
  { id: 'g1_02', enemies: [{ enemyId: 'grave_executioner', count: 1 }, { enemyId: 'crypt_warlock', count: 2 }, { enemyId: 'zombie', count: 4 }], position: { x: 280, y: 450 }, pullRadius: 130, totalForces: 10, gate: 1, difficulty: 5 },
  { id: 'g1_03', enemies: [{ enemyId: 'bone_crusher', count: 1 }, { enemyId: 'skeleton_mage', count: 2 }, { enemyId: 'ghoul', count: 3 }, { enemyId: 'grave_rat', count: 2 }], position: { x: 250, y: 300 }, pullRadius: 130, totalForces: 11, gate: 1, difficulty: 6 },
  
  // Cluster B - Upper graves (3 packs)
  { id: 'g1_04', enemies: [{ enemyId: 'bone_crusher', count: 1 }, { enemyId: 'crypt_warlock', count: 3 }, { enemyId: 'skeleton_warrior', count: 4 }], position: { x: 400, y: 200 }, pullRadius: 130, totalForces: 10, gate: 1, difficulty: 7 },
  { id: 'g1_05', enemies: [{ enemyId: 'grave_executioner', count: 1 }, { enemyId: 'skeleton_mage', count: 2 }, { enemyId: 'risen_corpse', count: 5 }], position: { x: 480, y: 280 }, pullRadius: 130, totalForces: 10, gate: 1, difficulty: 6 },
  { id: 'g1_06', enemies: [{ enemyId: 'bone_crusher', count: 2 }, { enemyId: 'crypt_warlock', count: 2 }, { enemyId: 'zombie', count: 3 }], position: { x: 420, y: 320 }, pullRadius: 130, totalForces: 10, gate: 1, difficulty: 7 },
  
  // Cluster C - Central mausoleum (3 packs)
  { id: 'g1_07', enemies: [{ enemyId: 'tomb_smasher', count: 1 }, { enemyId: 'dark_sorcerer', count: 2 }, { enemyId: 'skeleton_warrior', count: 4 }], position: { x: 500, y: 450 }, pullRadius: 130, totalForces: 11, gate: 1, difficulty: 8 },
  { id: 'g1_08', enemies: [{ enemyId: 'grave_executioner', count: 1 }, { enemyId: 'skeleton_mage', count: 3 }, { enemyId: 'cultist', count: 4 }], position: { x: 420, y: 520 }, pullRadius: 130, totalForces: 10, gate: 1, difficulty: 7 },
  { id: 'g1_09', enemies: [{ enemyId: 'bone_crusher', count: 2 }, { enemyId: 'crypt_warlock', count: 2 }, { enemyId: 'shadow_assassin', count: 3 }], position: { x: 580, y: 500 }, pullRadius: 130, totalForces: 11, gate: 1, difficulty: 8 },
  
  // Cluster D - Lower path (2 packs)
  { id: 'g1_10', enemies: [{ enemyId: 'tomb_smasher', count: 1 }, { enemyId: 'dark_sorcerer', count: 2 }, { enemyId: 'ghoul', count: 4 }], position: { x: 380, y: 650 }, pullRadius: 130, totalForces: 11, gate: 1, difficulty: 8 },
  { id: 'g1_11', enemies: [{ enemyId: 'grave_executioner', count: 1 }, { enemyId: 'skeleton_mage', count: 2 }, { enemyId: 'risen_corpse', count: 4 }], position: { x: 480, y: 620 }, pullRadius: 130, totalForces: 10, gate: 1, difficulty: 6 },
  
  // Cluster E - Eastern section (3 packs)
  { id: 'g1_12', enemies: [{ enemyId: 'bone_crusher', count: 1 }, { enemyId: 'necromancer', count: 2 }, { enemyId: 'skeleton_warrior', count: 5 }], position: { x: 680, y: 250 }, pullRadius: 130, totalForces: 12, gate: 1, difficulty: 9 },
  { id: 'g1_13', enemies: [{ enemyId: 'tomb_smasher', count: 1 }, { enemyId: 'dark_sorcerer', count: 3 }, { enemyId: 'grave_knight', count: 1 }, { enemyId: 'zombie', count: 3 }], position: { x: 750, y: 330 }, pullRadius: 130, totalForces: 13, gate: 1, difficulty: 10 },
  { id: 'g1_14', enemies: [{ enemyId: 'grave_executioner', count: 2 }, { enemyId: 'crypt_warlock', count: 2 }, { enemyId: 'cultist', count: 4 }], position: { x: 700, y: 420 }, pullRadius: 130, totalForces: 12, gate: 1, difficulty: 9 },
  
  // Cluster F - Hidden crypt (2 packs)
  { id: 'g1_15', enemies: [{ enemyId: 'bone_crusher', count: 1 }, { enemyId: 'necromancer', count: 2 }, { enemyId: 'skeleton_captain', count: 1 }, { enemyId: 'shadow_assassin', count: 3 }], position: { x: 650, y: 580 }, pullRadius: 130, totalForces: 13, gate: 1, difficulty: 10 },
  { id: 'g1_16', enemies: [{ enemyId: 'tomb_smasher', count: 1 }, { enemyId: 'dark_sorcerer', count: 2 }, { enemyId: 'ghoul', count: 5 }], position: { x: 730, y: 540 }, pullRadius: 130, totalForces: 12, gate: 1, difficulty: 9 },
  
  // Cluster G - Pre-boss (3 packs)
  { id: 'g1_17', enemies: [{ enemyId: 'tomb_smasher', count: 2 }, { enemyId: 'necromancer', count: 2 }, { enemyId: 'tomb_guardian', count: 1 }, { enemyId: 'skeleton_warrior', count: 3 }], position: { x: 900, y: 300 }, pullRadius: 130, totalForces: 15, gate: 1, difficulty: 12 },
  { id: 'g1_18', enemies: [{ enemyId: 'bone_crusher', count: 1 }, { enemyId: 'dark_sorcerer', count: 3 }, { enemyId: 'skeleton_captain', count: 1 }, { enemyId: 'cultist', count: 4 }], position: { x: 950, y: 400 }, pullRadius: 130, totalForces: 14, gate: 1, difficulty: 11 },
  { id: 'g1_19', enemies: [{ enemyId: 'grave_executioner', count: 1 }, { enemyId: 'necromancer', count: 2 }, { enemyId: 'grave_knight', count: 1 }, { enemyId: 'risen_corpse', count: 5 }], position: { x: 900, y: 500 }, pullRadius: 130, totalForces: 14, gate: 1, difficulty: 11 },
  
  // Cluster H - Gate line (3 packs)
  { id: 'g1_20', enemies: [{ enemyId: 'tomb_smasher', count: 1 }, { enemyId: 'dark_sorcerer', count: 3 }, { enemyId: 'skeleton_warrior', count: 6 }], position: { x: 1050, y: 280 }, pullRadius: 130, totalForces: 15, gate: 1, difficulty: 12 },
  { id: 'g1_21', enemies: [{ enemyId: 'bone_crusher', count: 2 }, { enemyId: 'necromancer', count: 2 }, { enemyId: 'zombie', count: 4 }], position: { x: 1080, y: 400 }, pullRadius: 130, totalForces: 14, gate: 1, difficulty: 11 },
  { id: 'g1_22', enemies: [{ enemyId: 'grave_executioner', count: 1 }, { enemyId: 'dark_sorcerer', count: 3 }, { enemyId: 'shadow_assassin', count: 4 }], position: { x: 1050, y: 520 }, pullRadius: 130, totalForces: 13, gate: 1, difficulty: 10 },
  
  // GATE 1 BOSS
  { id: 'g1_boss', enemies: [{ enemyId: 'bone_golem', count: 1 }], position: { x: 1100, y: 400 }, pullRadius: 120, totalForces: 0, gate: 1, difficulty: 14, isGateBoss: true },

  // ==================== GATE 2: THE CATACOMBS ====================
  
  // Cluster A - Entry corridor (3 packs)
  { id: 'g2_01', enemies: [{ enemyId: 'tomb_smasher', count: 1 }, { enemyId: 'dark_sorcerer', count: 2 }, { enemyId: 'skeleton_warrior', count: 5 }], position: { x: 1350, y: 400 }, pullRadius: 130, totalForces: 13, gate: 2, difficulty: 9 },
  { id: 'g2_02', enemies: [{ enemyId: 'bone_crusher', count: 1 }, { enemyId: 'crypt_warlock', count: 3 }, { enemyId: 'ghoul', count: 4 }], position: { x: 1400, y: 300 }, pullRadius: 130, totalForces: 11, gate: 2, difficulty: 8 },
  { id: 'g2_03', enemies: [{ enemyId: 'grave_executioner', count: 1 }, { enemyId: 'skeleton_mage', count: 2 }, { enemyId: 'zombie', count: 4 }, { enemyId: 'risen_corpse', count: 2 }], position: { x: 1400, y: 500 }, pullRadius: 130, totalForces: 11, gate: 2, difficulty: 8 },
  
  // Cluster B - North tunnel (3 packs)
  { id: 'g2_04', enemies: [{ enemyId: 'tomb_smasher', count: 1 }, { enemyId: 'necromancer', count: 2 }, { enemyId: 'shadow_assassin', count: 3 }, { enemyId: 'skeleton_warrior', count: 3 }], position: { x: 1520, y: 180 }, pullRadius: 130, totalForces: 14, gate: 2, difficulty: 11 },
  { id: 'g2_05', enemies: [{ enemyId: 'bone_crusher', count: 2 }, { enemyId: 'dark_sorcerer', count: 2 }, { enemyId: 'cultist', count: 4 }], position: { x: 1620, y: 200 }, pullRadius: 130, totalForces: 14, gate: 2, difficulty: 11 },
  { id: 'g2_06', enemies: [{ enemyId: 'grave_executioner', count: 1 }, { enemyId: 'crypt_warlock', count: 3 }, { enemyId: 'skeleton_captain', count: 1 }, { enemyId: 'ghoul', count: 3 }], position: { x: 1570, y: 280 }, pullRadius: 130, totalForces: 13, gate: 2, difficulty: 10 },
  
  // Cluster C - Central chamber (3 packs)
  { id: 'g2_07', enemies: [{ enemyId: 'tomb_smasher', count: 1 }, { enemyId: 'necromancer', count: 3 }, { enemyId: 'grave_knight', count: 1 }, { enemyId: 'zombie', count: 4 }], position: { x: 1580, y: 400 }, pullRadius: 130, totalForces: 15, gate: 2, difficulty: 12 },
  { id: 'g2_08', enemies: [{ enemyId: 'bone_crusher', count: 2 }, { enemyId: 'dark_sorcerer', count: 2 }, { enemyId: 'skeleton_captain', count: 1 }, { enemyId: 'skeleton_warrior', count: 5 }], position: { x: 1680, y: 380 }, pullRadius: 130, totalForces: 16, gate: 2, difficulty: 13 },
  { id: 'g2_09', enemies: [{ enemyId: 'grave_executioner', count: 1 }, { enemyId: 'necromancer', count: 2 }, { enemyId: 'cultist', count: 5 }], position: { x: 1630, y: 480 }, pullRadius: 130, totalForces: 13, gate: 2, difficulty: 11 },
  
  // Cluster D - South tunnel (3 packs)
  { id: 'g2_10', enemies: [{ enemyId: 'tomb_smasher', count: 1 }, { enemyId: 'dark_sorcerer', count: 3 }, { enemyId: 'shadow_assassin', count: 4 }], position: { x: 1520, y: 600 }, pullRadius: 130, totalForces: 14, gate: 2, difficulty: 11 },
  { id: 'g2_11', enemies: [{ enemyId: 'bone_crusher', count: 1 }, { enemyId: 'crypt_warlock', count: 2 }, { enemyId: 'grave_knight', count: 1 }, { enemyId: 'zombie', count: 5 }], position: { x: 1620, y: 620 }, pullRadius: 130, totalForces: 13, gate: 2, difficulty: 10 },
  { id: 'g2_12', enemies: [{ enemyId: 'grave_executioner', count: 2 }, { enemyId: 'skeleton_mage', count: 2 }, { enemyId: 'risen_corpse', count: 4 }], position: { x: 1570, y: 700 }, pullRadius: 130, totalForces: 12, gate: 2, difficulty: 9 },
  
  // Cluster E - Deep section (3 packs)
  { id: 'g2_13', enemies: [{ enemyId: 'tomb_smasher', count: 1 }, { enemyId: 'necromancer', count: 3 }, { enemyId: 'cultist', count: 5 }], position: { x: 1800, y: 250 }, pullRadius: 130, totalForces: 15, gate: 2, difficulty: 12 },
  { id: 'g2_14', enemies: [{ enemyId: 'bone_crusher', count: 2 }, { enemyId: 'dark_sorcerer', count: 2 }, { enemyId: 'tomb_guardian', count: 1 }, { enemyId: 'skeleton_warrior', count: 4 }], position: { x: 1880, y: 320 }, pullRadius: 130, totalForces: 16, gate: 2, difficulty: 13 },
  { id: 'g2_15', enemies: [{ enemyId: 'grave_executioner', count: 1 }, { enemyId: 'crypt_warlock', count: 3 }, { enemyId: 'ghoul', count: 4 }, { enemyId: 'shadow_assassin', count: 2 }], position: { x: 1840, y: 420 }, pullRadius: 130, totalForces: 14, gate: 2, difficulty: 11 },
  
  // Cluster F - Deep south (3 packs)
  { id: 'g2_16', enemies: [{ enemyId: 'tomb_smasher', count: 1 }, { enemyId: 'dark_sorcerer', count: 2 }, { enemyId: 'skeleton_captain', count: 1 }, { enemyId: 'cultist', count: 4 }], position: { x: 1800, y: 550 }, pullRadius: 130, totalForces: 14, gate: 2, difficulty: 11 },
  { id: 'g2_17', enemies: [{ enemyId: 'bone_crusher', count: 2 }, { enemyId: 'necromancer', count: 2 }, { enemyId: 'grave_knight', count: 1 }, { enemyId: 'zombie', count: 3 }], position: { x: 1880, y: 620 }, pullRadius: 130, totalForces: 15, gate: 2, difficulty: 12 },
  { id: 'g2_18', enemies: [{ enemyId: 'grave_executioner', count: 1 }, { enemyId: 'crypt_warlock', count: 3 }, { enemyId: 'skeleton_warrior', count: 6 }], position: { x: 1840, y: 700 }, pullRadius: 130, totalForces: 14, gate: 2, difficulty: 11 },
  
  // Cluster G - Ritual chamber (3 packs)
  { id: 'g2_19', enemies: [{ enemyId: 'tomb_smasher', count: 2 }, { enemyId: 'necromancer', count: 2 }, { enemyId: 'skeleton_captain', count: 1 }, { enemyId: 'shadow_assassin', count: 4 }], position: { x: 2020, y: 350 }, pullRadius: 130, totalForces: 16, gate: 2, difficulty: 14 },
  { id: 'g2_20', enemies: [{ enemyId: 'bone_crusher', count: 1 }, { enemyId: 'dark_sorcerer', count: 3 }, { enemyId: 'tomb_guardian', count: 1 }, { enemyId: 'cultist', count: 5 }], position: { x: 2100, y: 400 }, pullRadius: 130, totalForces: 16, gate: 2, difficulty: 14 },
  { id: 'g2_21', enemies: [{ enemyId: 'grave_executioner', count: 1 }, { enemyId: 'necromancer', count: 3 }, { enemyId: 'grave_knight', count: 1 }, { enemyId: 'risen_corpse', count: 4 }], position: { x: 2060, y: 480 }, pullRadius: 130, totalForces: 15, gate: 2, difficulty: 13 },
  
  // Cluster H - Pre-boss (2 packs)
  { id: 'g2_22', enemies: [{ enemyId: 'tomb_smasher', count: 2 }, { enemyId: 'dark_sorcerer', count: 2 }, { enemyId: 'skeleton_captain', count: 1 }, { enemyId: 'tomb_guardian', count: 1 }, { enemyId: 'skeleton_warrior', count: 3 }], position: { x: 2220, y: 350 }, pullRadius: 130, totalForces: 17, gate: 2, difficulty: 15 },
  { id: 'g2_23', enemies: [{ enemyId: 'bone_crusher', count: 1 }, { enemyId: 'necromancer', count: 3 }, { enemyId: 'cultist', count: 6 }], position: { x: 2220, y: 470 }, pullRadius: 130, totalForces: 16, gate: 2, difficulty: 14 },
  
  // GATE 2 BOSS
  { id: 'g2_boss', enemies: [{ enemyId: 'death_knight', count: 1 }], position: { x: 2300, y: 400 }, pullRadius: 120, totalForces: 0, gate: 2, difficulty: 17, isGateBoss: true },

  // ==================== GATE 3: THE THRONE CHAMBER ====================
  
  // Cluster A - Hall entrance (3 packs)
  { id: 'g3_01', enemies: [{ enemyId: 'tomb_smasher', count: 2 }, { enemyId: 'dark_sorcerer', count: 2 }, { enemyId: 'tomb_guardian', count: 1 }, { enemyId: 'skeleton_warrior', count: 4 }], position: { x: 2550, y: 400 }, pullRadius: 130, totalForces: 17, gate: 3, difficulty: 13 },
  { id: 'g3_02', enemies: [{ enemyId: 'bone_crusher', count: 1 }, { enemyId: 'necromancer', count: 3 }, { enemyId: 'skeleton_captain', count: 1 }, { enemyId: 'skeleton_warrior', count: 5 }], position: { x: 2600, y: 300 }, pullRadius: 130, totalForces: 16, gate: 3, difficulty: 13 },
  { id: 'g3_03', enemies: [{ enemyId: 'grave_executioner', count: 1 }, { enemyId: 'dark_sorcerer', count: 2 }, { enemyId: 'skeleton_captain', count: 1 }, { enemyId: 'cultist', count: 5 }], position: { x: 2600, y: 500 }, pullRadius: 130, totalForces: 15, gate: 3, difficulty: 12 },
  
  // Cluster B - Left wing (3 packs)
  { id: 'g3_04', enemies: [{ enemyId: 'tomb_smasher', count: 1 }, { enemyId: 'necromancer', count: 3 }, { enemyId: 'grave_knight', count: 1 }, { enemyId: 'shadow_assassin', count: 4 }], position: { x: 2720, y: 180 }, pullRadius: 130, totalForces: 16, gate: 3, difficulty: 14 },
  { id: 'g3_05', enemies: [{ enemyId: 'bone_crusher', count: 2 }, { enemyId: 'dark_sorcerer', count: 2 }, { enemyId: 'skeleton_warrior', count: 6 }], position: { x: 2820, y: 200 }, pullRadius: 130, totalForces: 16, gate: 3, difficulty: 14 },
  { id: 'g3_06', enemies: [{ enemyId: 'grave_executioner', count: 1 }, { enemyId: 'necromancer', count: 2 }, { enemyId: 'tomb_guardian', count: 1 }, { enemyId: 'zombie', count: 4 }], position: { x: 2770, y: 280 }, pullRadius: 130, totalForces: 15, gate: 3, difficulty: 13 },
  
  // Cluster C - Right wing (3 packs)
  { id: 'g3_07', enemies: [{ enemyId: 'tomb_smasher', count: 1 }, { enemyId: 'dark_sorcerer', count: 3 }, { enemyId: 'grave_knight', count: 1 }, { enemyId: 'ghoul', count: 5 }], position: { x: 2720, y: 620 }, pullRadius: 130, totalForces: 16, gate: 3, difficulty: 14 },
  { id: 'g3_08', enemies: [{ enemyId: 'bone_crusher', count: 2 }, { enemyId: 'necromancer', count: 2 }, { enemyId: 'skeleton_captain', count: 1 }, { enemyId: 'risen_corpse', count: 4 }], position: { x: 2820, y: 600 }, pullRadius: 130, totalForces: 16, gate: 3, difficulty: 14 },
  { id: 'g3_09', enemies: [{ enemyId: 'grave_executioner', count: 1 }, { enemyId: 'crypt_warlock', count: 3 }, { enemyId: 'cultist', count: 6 }], position: { x: 2770, y: 520 }, pullRadius: 130, totalForces: 14, gate: 3, difficulty: 12 },
  
  // Cluster D - Central approach (3 packs)
  { id: 'g3_10', enemies: [{ enemyId: 'tomb_smasher', count: 2 }, { enemyId: 'dark_sorcerer', count: 2 }, { enemyId: 'shadow_assassin', count: 5 }], position: { x: 2850, y: 400 }, pullRadius: 130, totalForces: 17, gate: 3, difficulty: 15 },
  { id: 'g3_11', enemies: [{ enemyId: 'bone_crusher', count: 1 }, { enemyId: 'necromancer', count: 3 }, { enemyId: 'skeleton_captain', count: 1 }, { enemyId: 'skeleton_warrior', count: 5 }], position: { x: 2930, y: 340 }, pullRadius: 130, totalForces: 16, gate: 3, difficulty: 14 },
  { id: 'g3_12', enemies: [{ enemyId: 'grave_executioner', count: 1 }, { enemyId: 'dark_sorcerer', count: 3 }, { enemyId: 'cultist', count: 6 }], position: { x: 2930, y: 460 }, pullRadius: 130, totalForces: 16, gate: 3, difficulty: 14 },
  
  // Cluster E - Elite guards (3 packs)
  { id: 'g3_13', enemies: [{ enemyId: 'tomb_smasher', count: 2 }, { enemyId: 'necromancer', count: 2 }, { enemyId: 'tomb_guardian', count: 1 }, { enemyId: 'grave_knight', count: 1 }, { enemyId: 'skeleton_warrior', count: 3 }], position: { x: 3050, y: 280 }, pullRadius: 130, totalForces: 18, gate: 3, difficulty: 16 },
  { id: 'g3_14', enemies: [{ enemyId: 'bone_crusher', count: 1 }, { enemyId: 'dark_sorcerer', count: 3 }, { enemyId: 'skeleton_captain', count: 1 }, { enemyId: 'shadow_assassin', count: 4 }], position: { x: 3100, y: 400 }, pullRadius: 130, totalForces: 16, gate: 3, difficulty: 15 },
  { id: 'g3_15', enemies: [{ enemyId: 'grave_executioner', count: 1 }, { enemyId: 'necromancer', count: 3 }, { enemyId: 'tomb_guardian', count: 1 }, { enemyId: 'grave_knight', count: 1 }, { enemyId: 'zombie', count: 4 }], position: { x: 3050, y: 520 }, pullRadius: 130, totalForces: 18, gate: 3, difficulty: 16 },
  
  // Cluster F - Inner sanctum (3 packs)
  { id: 'g3_16', enemies: [{ enemyId: 'tomb_smasher', count: 2 }, { enemyId: 'dark_sorcerer', count: 2 }, { enemyId: 'skeleton_captain', count: 1 }, { enemyId: 'ghoul', count: 5 }], position: { x: 3220, y: 280 }, pullRadius: 130, totalForces: 17, gate: 3, difficulty: 15 },
  { id: 'g3_17', enemies: [{ enemyId: 'bone_crusher', count: 1 }, { enemyId: 'necromancer', count: 3 }, { enemyId: 'tomb_guardian', count: 1 }, { enemyId: 'cultist', count: 6 }], position: { x: 3280, y: 400 }, pullRadius: 130, totalForces: 18, gate: 3, difficulty: 17 },
  { id: 'g3_18', enemies: [{ enemyId: 'grave_executioner', count: 1 }, { enemyId: 'dark_sorcerer', count: 3 }, { enemyId: 'grave_knight', count: 1 }, { enemyId: 'risen_corpse', count: 5 }], position: { x: 3220, y: 520 }, pullRadius: 130, totalForces: 17, gate: 3, difficulty: 15 },
  
  // Cluster G - Throne guardians (3 packs)
  { id: 'g3_19', enemies: [{ enemyId: 'tomb_smasher', count: 2 }, { enemyId: 'necromancer', count: 2 }, { enemyId: 'grave_knight', count: 1 }, { enemyId: 'skeleton_captain', count: 1 }, { enemyId: 'skeleton_warrior', count: 4 }], position: { x: 3400, y: 300 }, pullRadius: 130, totalForces: 19, gate: 3, difficulty: 17 },
  { id: 'g3_20', enemies: [{ enemyId: 'bone_crusher', count: 1 }, { enemyId: 'dark_sorcerer', count: 3 }, { enemyId: 'tomb_guardian', count: 1 }, { enemyId: 'cultist', count: 6 }], position: { x: 3450, y: 400 }, pullRadius: 130, totalForces: 18, gate: 3, difficulty: 18 },
  { id: 'g3_21', enemies: [{ enemyId: 'grave_executioner', count: 1 }, { enemyId: 'necromancer', count: 3 }, { enemyId: 'grave_knight', count: 1 }, { enemyId: 'skeleton_captain', count: 1 }, { enemyId: 'shadow_assassin', count: 4 }], position: { x: 3400, y: 500 }, pullRadius: 130, totalForces: 18, gate: 3, difficulty: 17 },
  
  // Gate 3 has no gate boss - the Final Boss serves that role
];

// ===== SAMPLE DUNGEON =====
export const SAMPLE_DUNGEON: Dungeon = {
  id: 'crypt_of_the_damned',
  name: 'Crypt of the Damned',
  description: 'An ancient burial ground corrupted by dark necromancy.',
  requiredForces: 225, // 75 * 3 gates
  timeLimitSeconds: 720, // 12 minutes
  mapWidth: 4200, // Extended to accommodate twin bosses side by side
  mapHeight: 800,
  availableEnemies: SAMPLE_ENEMIES,
  gates: [
    { id: 1, name: 'The Graveyard', requiredForces: 75, xStart: 0, xEnd: 1200, bossPackId: 'g1_boss' },
    { id: 2, name: 'The Catacombs', requiredForces: 75, xStart: 1200, xEnd: 2400, bossPackId: 'g2_boss' },
    { id: 3, name: 'Throne Chamber', requiredForces: 75, xStart: 2400, xEnd: 4200, bossPackId: '' } // No gate boss - Final Boss serves this role
  ],
  enemyPacks: DUNGEON_PACKS,
  bosses: [{
    id: 'final_boss',
    enemy: SAMPLE_ENEMIES.find(e => e.id === 'necromancer_lord')!,
    position: { x: 3750, y: 400 }, // Moved further right, away from other monsters
    isFinalBoss: true,
    gate: 3,
    phases: [
      { healthThreshold: 100, abilities: [], description: 'Phase 1' },
      { healthThreshold: 60, abilities: [], description: 'Phase 2' },
      { healthThreshold: 30, abilities: [], description: 'Phase 3: Enrage' }
    ]
  }]
};

// Helper functions
export function calculateKeyScaling(level: number): KeyLevel {
  // BALANCED SCALING SYSTEM
  // +2 is baseline (1.0x) - designed for fresh teams with base stats
  // Scaling ramps up quickly so higher keys REQUIRE gear upgrades
  // +10 expects ~40% resistances and proportionally more armor from gear
  
  // 12% multiplicative per level above +2 (steeper than before)
  // +2: 1.0x, +5: 1.40x, +10: 2.49x, +15: 4.40x, +20: 7.79x
  const scalingLevel = Math.max(0, level - 2);
  
  // Health scales slightly faster than damage to make fights longer at high keys
  const healthMultiplier = Math.pow(1.14, scalingLevel);
  // Damage scales at 12% per level
  const damageMultiplier = Math.pow(1.12, scalingLevel);
  
  return {
    level,
    healthMultiplier,
    damageMultiplier,
    rewardMultiplier: Math.pow(1.15, level),
    itemQuantity: scalingLevel * 0.10, // 10% more items per level
    itemRarity: scalingLevel * 0.10   // 10% better item quality per level
  };
}

export function getPacksInRadius(pack: EnemyPack, allPacks: EnemyPack[]): EnemyPack[] {
  return allPacks.filter(p => {
    if (p.id === pack.id) return false;
    if (p.gate !== pack.gate) return false;
    const distance = Math.sqrt(Math.pow(p.position.x - pack.position.x, 2) + Math.pow(p.position.y - pack.position.y, 2));
    return distance <= pack.pullRadius;
  });
}

export function calculateTimerUpgrade(timeElapsed: number, timeLimit: number): number {
  const percentLeft = (timeLimit - timeElapsed) / timeLimit;
  if (timeElapsed > timeLimit) return 0;
  if (percentLeft >= 0.4) return 3;
  if (percentLeft >= 0.2) return 2;
  return 1;
}

// Randomize gate boss positions within their gates (avoiding overlap with other packs)
export function randomizeGateBossPositions(dungeon: Dungeon): Dungeon {
  const nonBossPacks = dungeon.enemyPacks.filter(p => !p.isGateBoss);
  
  const newPacks = dungeon.enemyPacks.map(pack => {
    if (!pack.isGateBoss) return pack;
    
    const gate = dungeon.gates.find(g => g.id === pack.gate);
    if (!gate) return pack;
    
    // Get all packs in the same gate (excluding this boss)
    const packsInGate = nonBossPacks.filter(p => p.gate === pack.gate);
    
    // Calculate bounds within gate
    const minX = gate.xStart + 150;
    const maxX = gate.xEnd - 150;
    const minY = 150;
    const maxY = dungeon.mapHeight - 150;
    
    // Minimum distance to avoid overlap (boss radius + pack radius + buffer)
    const minSeparation = 180;
    
    // Try to find a valid position (max 50 attempts)
    let bestPosition = { x: pack.position.x, y: pack.position.y };
    let bestMinDistance = 0;
    
    for (let attempt = 0; attempt < 50; attempt++) {
      const randomX = Math.floor(minX + Math.random() * (maxX - minX));
      const randomY = Math.floor(minY + Math.random() * (maxY - minY));
      
      // Check distance to all packs in this gate
      let minDistanceToAnyPack = Infinity;
      let isValid = true;
      
      for (const otherPack of packsInGate) {
        const distance = Math.sqrt(
          Math.pow(randomX - otherPack.position.x, 2) + 
          Math.pow(randomY - otherPack.position.y, 2)
        );
        minDistanceToAnyPack = Math.min(minDistanceToAnyPack, distance);
        if (distance < minSeparation) {
          isValid = false;
        }
      }
      
      // If valid position found, use it
      if (isValid) {
        bestPosition = { x: randomX, y: randomY };
        break;
      }
      
      // Track the best position even if not perfect (furthest from any pack)
      if (minDistanceToAnyPack > bestMinDistance) {
        bestMinDistance = minDistanceToAnyPack;
        bestPosition = { x: randomX, y: randomY };
      }
    }
    
    return {
      ...pack,
      position: bestPosition
    };
  });
  
  return {
    ...dungeon,
    enemyPacks: newPacks
  };
}
