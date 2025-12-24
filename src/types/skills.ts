import React from 'react';
import type { CharacterRole } from './character';
import { 
  // Tank skill icons
  GiShieldBash,           // Shield Slam
  GiSonicShout,           // Thunder Clap
  GiCastle,               // Defensive Stance
  GiVibratingShield,      // Shield Block
  GiEnrage,               // Taunt
  
  // Healer skill icons
  GiWaveStrike,           // Healing Wave
  GiHealthPotion,         // Massive Heal
  GiLotusFlower,          // Rejuvenation
  GiHolySymbol,           // Circle of Healing
  GiShieldcomb,           // Pain Suppression
  GiSparkles,             // Dispel Magic
  
  // DPS skill icons
  GiFireball,             // Fireball
  GiIceBolt,              // Ice Lance
  GiLightningTear,        // Lightning Bolt
  GiGhost,                // Shadow Bolt
  GiMagicSwirl,           // Arcane Missiles
  GiExplosiveMaterials,   // Blow Up
  GiSnowflake1,           // Blizzard
  GiMeteorImpact,         // Meteor
  GiDeathSkull,           // Corruption
  GiBurningDot,           // Immolate
  
  // Channeling skill icons
  GiLaserBurst,           // Disintegrate
  GiVortex,               // Soul Siphon
  GiLightningStorm,       // Storm Call
  GiFlameSpin,            // Incinerate
  
  // Support gem icons
  GiSwordsPower,          // Increased Damage
  GiSpeedometer,          // Faster Casting
  GiEchoRipples,          // Spell Echo
  GiTripleScratches,      // Greater Multiple Projectiles
  GiWaterSplash,          // Melee Splash
  GiFire,                 // Added Fire Damage
  GiDrop,                 // Lifetap
  GiBullseye,             // Critical Strikes
  GiPowerLightning,       // Controlled Destruction
  GiCog,                  // Efficacy
  GiStarFormation         // Empower
} from 'react-icons/gi';

// ===== SKILL TAGS REFERENCE (PoE-style) =====
// These tags determine support gem compatibility and mechanics
//
// DAMAGE TYPE TAGS:
//   fire, cold, lightning, chaos, physical, holy, nature, arcane
//
// SKILL TYPE TAGS:
//   spell      - Cast with spell power
//   attack     - Uses weapon/attack power
//   melee      - Close range attack
//   projectile - Fires a projectile
//   aoe        - Area of effect
//   chaining   - Can chain between targets
//   channelling - Channeled skill (interruptible)
//
// EFFECT TAGS:
//   hit        - Deals direct damage/healing on impact
//   dot        - Damage over time
//   duration   - Has a lasting effect/buff
//   heal       - Restores health
//   buff       - Applies beneficial effects
//   curse      - Applies debuff to enemies
//
// MECHANIC TAGS:
//   elemental  - Deals elemental damage (fire/cold/lightning)
//   strike     - Single target melee attack
//   slam       - Ground-based melee attack
//   warcry     - Shout-based ability
//   guard      - Defensive buff
//   block      - Block-related ability
//   stance     - Stance-based buff
//   taunt      - Forces enemy attention
//   dispel     - Removes effects
//   instant    - No cast time

// Damage types in the game (PoE-style)
export type DamageType = 
  | 'physical' 
  | 'fire' 
  | 'cold'      // frost/ice damage
  | 'lightning' // electrical damage
  | 'chaos'     // shadow/void damage
  | 'nature'    // nature/poison damage
  | 'arcane'    // pure magical damage
  | 'holy';     // divine/light damage

// Alias for compatibility
export type ElementalDamageType = 'fire' | 'cold' | 'lightning';

// Skill targeting types
export type TargetType = 
  | 'self' 
  | 'ally' 
  | 'enemy' 
  | 'allAllies' 
  | 'allEnemies' 
  | 'aoe' 
  | 'cone' 
  | 'line';

// Skill categories
export type SkillCategory = 
  | 'attack' 
  | 'spell' 
  | 'heal' 
  | 'buff' 
  | 'debuff' 
  | 'defensive' 
  | 'utility';

// Base skill gem definition
export interface SkillGem {
  id: string;
  name: string;
  description: string; // Explains what the skill does mechanically
  icon: React.ReactNode;
  category: SkillCategory;
  damageType?: DamageType;
  targetType: TargetType;
  
  // Role restrictions (empty = any role can use)
  allowedRoles: CharacterRole[];
  
  // Base stats
  baseDamage?: number;
  baseDamageMax?: number; // For damage ranges (e.g., "Deals 10 to 15 Fire Damage")
  baseHealing?: number;
  manaCost: number;
  cooldown: number; // in seconds
  castTime: number; // 0 = instant
  
  // Support gem compatibility
  maxSupportSlots: number;
  supportTags: string[]; // Tags that determine which supports can modify this skill
  
  // Damage Effectiveness (PoE style)
  // For spells: "Effectiveness of Added Damage: X%" - modifies added flat damage
  // For attacks: "Attack Damage: X% of Base" - modifies base weapon damage
  // Lower for multi-hit/chain/aoe skills, higher for single target
  damageEffectiveness: number; // Percentage (100 = 100%, 140 = 140%)
  
  // Critical Strike (PoE style)
  baseCriticalStrikeChance: number; // Base crit chance for this skill (e.g., 8%)
  
  // Special effects
  effects: SkillEffect[];
  
  // Requirements
  levelRequirement: number;
  
  // Skill tags (for support gems and mechanics)
  tags?: string[]; // e.g., ['projectile', 'fire', 'aoe', 'physical']
  
  // Multi-hit mechanics
  chainCount?: number; // Number of times the skill chains to additional targets (0 = no chain)
  chainDamageBonus?: number; // % more damage per remaining chain (e.g., 15 = +15% per chain remaining)
  projectileCount?: number; // Number of projectiles fired (for multi-projectile skills)
  hitCount?: number; // Number of hits per cast (for channeled/multi-hit skills)
  pierceCount?: number; // Number of enemies the projectile can pierce through
  
  // Channeling mechanics
  isChanneled?: boolean; // If true, skill channels continuously after initial cast
  channelTickRate?: number; // Base time between channel ticks in seconds (modified by cast speed)
  channelDuration?: number; // How long the channel lasts (0 = until cancelled/OOM)
  manaPerTick?: number; // Mana cost per tick while channeling (in addition to initial cost)
  channelRampUp?: number; // % more damage per second of channeling (for ramping damage)
  maxChannelStacks?: number; // Maximum ramp-up stacks
  
  // Damage conversion (PoE style - e.g., 100% physical to fire)
  physicalToFireConversion?: number; // Percentage (0-100)
  physicalToColdConversion?: number;
  physicalToLightningConversion?: number;
  physicalToChaosConversion?: number;
}

// Effects that skills can apply
export interface SkillEffect {
  type: EffectType;
  value: number;
  duration?: number; // in seconds
  stacks?: number;
  chance?: number; // 0-100
}

export type EffectType = 
  | 'damage'
  | 'heal'
  | 'dot' // damage over time
  | 'hot' // heal over time
  | 'shield'
  | 'taunt'
  | 'stun'
  | 'slow'
  | 'root'
  | 'silence'
  | 'interrupt'
  | 'knockback'
  | 'pull'
  | 'buffStat'
  | 'debuffStat'
  | 'damageReduction' // % damage reduction
  | 'dispel'
  | 'cleanse'
  | 'generateResource'
  | 'executeBonus';

// Support gems that modify skill gems
export interface SupportGem {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  
  // Which skill tags this support can apply to
  requiredTags: string[];
  
  // Stat modifications
  multipliers: SupportMultiplier[];
  
  // Added effects
  addedEffects: SkillEffect[];
  
  // Cost modifications
  manaCostMultiplier?: number;
  cooldownMultiplier?: number;
  
  // Level requirement
  levelRequirement: number;
}

export interface SupportMultiplier {
  stat: string;
  multiplier: number; // e.g., 1.3 = 30% more
  isMore: boolean; // "more" vs "increased" multiplicative vs additive
}

// Pre-defined skill gems
export const SKILL_GEMS: SkillGem[] = [
  // ===== TANK SKILLS =====
  {
    id: 'shield_slam',
    name: 'Shield Slam',
    description: 'Slam a single enemy with your shield, dealing high physical damage. High damage effectiveness due to single-target nature.',
    icon: React.createElement(GiShieldBash),
    category: 'attack',
    damageType: 'physical',
    targetType: 'enemy',
    allowedRoles: ['tank'],
    baseDamage: 30,
    baseDamageMax: 45,
    manaCost: 12,
    cooldown: 6,
    castTime: 0,
    maxSupportSlots: 4,
    supportTags: ['attack', 'melee', 'physical', 'strike', 'hit'],
    tags: ['attack', 'melee', 'physical', 'strike', 'hit', 'slam'],
    damageEffectiveness: 120,
    baseCriticalStrikeChance: 5,
    effects: [
      { type: 'damage', value: 75 }
    ],
    levelRequirement: 1
  },
  {
    id: 'thunder_clap',
    name: 'Thunder Clap',
    description: 'Smash the ground to create a shockwave that hits ALL enemies in range. Lower effectiveness per target due to AoE nature.',
    icon: React.createElement(GiSonicShout),
    category: 'attack',
    damageType: 'physical',
    targetType: 'allEnemies',
    allowedRoles: ['tank'],
    baseDamage: 10,
    baseDamageMax: 15,
    manaCost: 8,
    cooldown: 0,
    castTime: 0,
    maxSupportSlots: 4,
    supportTags: ['attack', 'melee', 'physical', 'aoe', 'hit'],
    tags: ['attack', 'melee', 'physical', 'aoe', 'hit', 'slam', 'warcry'],
    damageEffectiveness: 80,
    baseCriticalStrikeChance: 5,
    effects: [
      { type: 'damage', value: 50 }
    ],
    levelRequirement: 1
  },
  {
    id: 'defensive_stance',
    name: 'Defensive Stance',
    description: 'Enter a defensive stance that increases your armor by 50% for 15 seconds. Long cooldown but powerful defensive buff.',
    icon: React.createElement(GiCastle),
    category: 'defensive',
    targetType: 'self',
    allowedRoles: ['tank'],
    manaCost: 25,
    cooldown: 30,
    castTime: 0,
    maxSupportSlots: 3,
    supportTags: ['buff', 'duration'],
    tags: ['buff', 'defensive', 'stance', 'duration', 'guard'],
    damageEffectiveness: 0,
    baseCriticalStrikeChance: 0,
    effects: [
      { type: 'buffStat', value: 50, duration: 15 }
    ],
    levelRequirement: 1
  },
  {
    id: 'shield_block',
    name: 'Shield Block',
    description: 'Raise your shield to increase block chance and spell block chance by 30% for 6 seconds. Use before heavy incoming damage.',
    icon: React.createElement(GiVibratingShield),
    category: 'defensive',
    targetType: 'self',
    allowedRoles: ['tank'],
    manaCost: 15,
    cooldown: 12,
    castTime: 0,
    maxSupportSlots: 2,
    supportTags: ['buff', 'duration'],
    tags: ['buff', 'defensive', 'guard', 'duration', 'block'],
    damageEffectiveness: 0,
    baseCriticalStrikeChance: 0,
    effects: [
      { type: 'buffStat', value: 30, duration: 6 }
    ],
    levelRequirement: 1
  },
  {
    id: 'taunt',
    name: 'Taunt',
    description: 'Force a single enemy to attack you for 3 seconds. Essential for pulling enemies off allies.',
    icon: React.createElement(GiEnrage),
    category: 'utility',
    targetType: 'enemy',
    allowedRoles: ['tank'],
    manaCost: 5,
    cooldown: 8,
    castTime: 0,
    maxSupportSlots: 2,
    supportTags: [],
    tags: ['taunt', 'instant'],
    damageEffectiveness: 0,
    baseCriticalStrikeChance: 0,
    effects: [
      { type: 'taunt', value: 1, duration: 3 }
    ],
    levelRequirement: 1
  },

  // ===== HEALER SKILLS =====
  {
    id: 'healing_wave',
    name: 'Healing Wave',
    description: 'Your bread-and-butter single target heal. Moderate cast time with high effectiveness. Use for sustained tank healing.',
    icon: React.createElement(GiWaveStrike),
    category: 'heal',
    damageType: 'holy',
    targetType: 'ally',
    allowedRoles: ['healer'],
    baseHealing: 150,
    manaCost: 10,
    cooldown: 0,
    castTime: 1.2,
    maxSupportSlots: 5,
    supportTags: ['spell', 'heal'],
    tags: ['spell', 'holy', 'heal', 'hit'],
    damageEffectiveness: 150,
    baseCriticalStrikeChance: 8,
    effects: [
      { type: 'heal', value: 150 }
    ],
    levelRequirement: 1
  },
  {
    id: 'massive_heal',
    name: 'Massive Heal',
    description: 'A powerful but slow heal for emergencies. Very high effectiveness and base healing, but long cast time makes it risky. Use when target has time to survive.',
    icon: React.createElement(GiHealthPotion),
    category: 'heal',
    damageType: 'holy',
    targetType: 'ally',
    allowedRoles: ['healer'],
    baseHealing: 525,
    manaCost: 22,
    cooldown: 0,
    castTime: 2.4,
    maxSupportSlots: 4,
    supportTags: ['spell', 'heal'],
    tags: ['spell', 'holy', 'heal', 'hit'],
    damageEffectiveness: 200,
    baseCriticalStrikeChance: 8,
    effects: [
      { type: 'heal', value: 525 }
    ],
    levelRequirement: 1
  },
  {
    id: 'rejuvenation',
    name: 'Rejuvenation',
    description: 'Instant cast heal over time (HoT). Low effectiveness per tick but efficient mana-wise over the full duration. Stack on multiple allies for group healing.',
    icon: React.createElement(GiLotusFlower),
    category: 'heal',
    damageType: 'nature',
    targetType: 'ally',
    allowedRoles: ['healer'],
    baseHealing: 60,
    manaCost: 5,
    cooldown: 0,
    castTime: 0,
    maxSupportSlots: 4,
    supportTags: ['spell', 'heal', 'duration', 'hot'],
    tags: ['spell', 'nature', 'heal', 'duration', 'hot'],
    damageEffectiveness: 30,
    baseCriticalStrikeChance: 8,
    effects: [
      { type: 'hot', value: 60, duration: 12 }
    ],
    levelRequirement: 1
  },
  {
    id: 'circle_of_healing',
    name: 'Circle of Healing',
    description: 'Heals ALL allies at once. Lower effectiveness per target due to AoE nature. Best used when entire party is taking damage.',
    icon: React.createElement(GiHolySymbol),
    category: 'heal',
    damageType: 'holy',
    targetType: 'allAllies',
    allowedRoles: ['healer'],
    baseHealing: 80,
    manaCost: 28,
    cooldown: 0,
    castTime: 2.0,
    maxSupportSlots: 4,
    supportTags: ['spell', 'heal', 'aoe'],
    tags: ['spell', 'holy', 'heal', 'aoe', 'hit'],
    damageEffectiveness: 80,
    baseCriticalStrikeChance: 8,
    effects: [
      { type: 'heal', value: 80 }
    ],
    levelRequirement: 5
  },
  {
    id: 'pain_suppression',
    name: 'Pain Suppression',
    description: 'Powerful defensive cooldown. Reduces target\'s damage taken by 40% for 6 seconds. Save for tankbusters or emergency situations.',
    icon: React.createElement(GiShieldcomb),
    category: 'buff',
    damageType: 'holy',
    targetType: 'ally',
    allowedRoles: ['healer'],
    baseHealing: 0,
    manaCost: 25,
    cooldown: 30,
    castTime: 0,
    maxSupportSlots: 2,
    supportTags: ['spell', 'buff', 'duration'],
    tags: ['spell', 'holy', 'buff', 'defensive', 'duration', 'guard'],
    damageEffectiveness: 0,
    baseCriticalStrikeChance: 0,
    effects: [
      { type: 'damageReduction', value: 40, duration: 6 }
    ],
    levelRequirement: 1
  },
  {
    id: 'dispel_magic',
    name: 'Dispel Magic',
    description: 'Removes one harmful magic debuff from an ally. Essential for cleansing dangerous enemy effects.',
    icon: React.createElement(GiSparkles),
    category: 'utility',
    damageType: 'holy',
    targetType: 'ally',
    allowedRoles: ['healer'],
    manaCost: 12,
    cooldown: 8,
    castTime: 0,
    maxSupportSlots: 1,
    supportTags: ['spell'],
    tags: ['spell', 'holy', 'dispel', 'instant'],
    damageEffectiveness: 0,
    baseCriticalStrikeChance: 0,
    effects: [
      { type: 'dispel', value: 1 }
    ],
    levelRequirement: 3
  },

  // ===== DPS SKILLS =====
  // Balance philosophy:
  // - Single target: High effectiveness (130-150%)
  // - Chaining (2-3 targets): Medium effectiveness (90-110%), +damage per chain remaining
  // - AoE (all targets): Low effectiveness (60-80%)
  // - DoT: Very low effectiveness (30-50%) but sustained damage
  // - Channeled: Low effectiveness per hit (40-60%) but many hits
  {
    id: 'fireball',
    name: 'Fireball',
    description: 'The quintessential single-target nuke. High damage effectiveness because it only hits one enemy. Strong, reliable damage with no special mechanics.',
    icon: React.createElement(GiFireball),
    category: 'spell',
    damageType: 'fire',
    targetType: 'enemy',
    allowedRoles: ['dps'],
    baseDamage: 60,
    baseDamageMax: 90,
    manaCost: 6,
    cooldown: 0,
    castTime: 1.2,
    maxSupportSlots: 5,
    supportTags: ['spell', 'projectile', 'fire', 'hit'],
    tags: ['spell', 'fire', 'projectile', 'hit', 'elemental'],
    damageEffectiveness: 140,
    baseCriticalStrikeChance: 8,
    effects: [
      { type: 'damage', value: 150 }
    ],
    levelRequirement: 1
  },
  {
    id: 'ice_lance',
    name: 'Ice Lance',
    description: 'Fast-casting single target spell with high crit chance. Lower base damage but quick cast time makes it efficient. 30% chance to slow enemies.',
    icon: React.createElement(GiIceBolt),
    category: 'spell',
    damageType: 'cold',
    targetType: 'enemy',
    allowedRoles: ['dps'],
    baseDamage: 80,
    baseDamageMax: 120,
    manaCost: 4,
    cooldown: 0,
    castTime: 0.8,
    maxSupportSlots: 5,
    supportTags: ['spell', 'projectile', 'cold', 'hit'],
    tags: ['spell', 'cold', 'projectile', 'hit', 'elemental'],
    damageEffectiveness: 100,
    baseCriticalStrikeChance: 12,
    effects: [
      { type: 'damage', value: 100 },
      { type: 'slow', value: 20, duration: 3, chance: 30 }
    ],
    levelRequirement: 1
  },
  {
    id: 'lightning_bolt',
    name: 'Lightning Bolt',
    description: 'Chains to 2 additional enemies after hitting the primary target (3 total hits). Each chain deals 15% MORE damage than the previous. Lower base effectiveness due to multi-target nature.',
    icon: React.createElement(GiLightningTear),
    category: 'spell',
    damageType: 'lightning',
    targetType: 'enemy',
    allowedRoles: ['dps'],
    baseDamage: 20,
    baseDamageMax: 60,
    manaCost: 7,
    cooldown: 0,
    castTime: 1.0,
    maxSupportSlots: 5,
    supportTags: ['spell', 'lightning', 'hit', 'chaining'],
    tags: ['spell', 'lightning', 'hit', 'chaining', 'elemental'],
    damageEffectiveness: 90,
    chainCount: 2,
    chainDamageBonus: 15,
    baseCriticalStrikeChance: 8,
    effects: [
      { type: 'damage', value: 80 }
    ],
    levelRequirement: 1
  },
  {
    id: 'shadow_bolt',
    name: 'Shadow Bolt',
    description: 'Chaos projectile that chains to 2 additional enemies (3 total hits). Gains 20% MORE damage per remaining chain. Chaos damage bypasses elemental resistances.',
    icon: React.createElement(GiGhost),
    category: 'spell',
    damageType: 'chaos',
    targetType: 'enemy',
    allowedRoles: ['dps'],
    baseDamage: 30,
    baseDamageMax: 50,
    manaCost: 8,
    cooldown: 0,
    castTime: 1.4,
    maxSupportSlots: 5,
    supportTags: ['spell', 'chaos', 'projectile', 'hit', 'chaining'],
    tags: ['spell', 'chaos', 'projectile', 'hit', 'chaining'],
    damageEffectiveness: 95,
    chainCount: 2,
    chainDamageBonus: 20,
    baseCriticalStrikeChance: 6,
    effects: [
      { type: 'damage', value: 80 }
    ],
    levelRequirement: 1
  },
  {
    id: 'arcane_missiles',
    name: 'Arcane Missiles',
    description: 'Channel a barrage of arcane missiles at a single target. Ticks rapidly, dealing low damage per tick but high sustained DPS. Drains mana continuously while channeling.',
    icon: React.createElement(GiMagicSwirl),
    category: 'spell',
    damageType: 'arcane',
    targetType: 'enemy',
    allowedRoles: ['dps'],
    baseDamage: 9,
    baseDamageMax: 14,
    manaCost: 8,
    cooldown: 0,
    castTime: 0.5,
    maxSupportSlots: 5,
    supportTags: ['spell', 'projectile', 'hit', 'channelling'],
    tags: ['spell', 'arcane', 'projectile', 'hit', 'channelling'],
    damageEffectiveness: 35,
    isChanneled: true,
    channelTickRate: 0.4,
    channelDuration: 0,
    manaPerTick: 1,
    baseCriticalStrikeChance: 6,
    effects: [
      { type: 'damage', value: 23 }
    ],
    levelRequirement: 3
  },
  {
    id: 'blow_up',
    name: 'Blow Up',
    description: 'Explosive AoE that hits ALL enemies. Lower effectiveness per target due to AoE nature, but total damage scales with enemy count. Best for large packs.',
    icon: React.createElement(GiExplosiveMaterials),
    category: 'spell',
    damageType: 'fire',
    targetType: 'allEnemies',
    allowedRoles: ['dps'],
    baseDamage: 80,
    baseDamageMax: 120,
    manaCost: 6,
    cooldown: 0,
    castTime: 2.4,
    maxSupportSlots: 5,
    supportTags: ['spell', 'fire', 'aoe', 'hit'],
    tags: ['spell', 'fire', 'aoe', 'hit', 'elemental'],
    damageEffectiveness: 70,
    baseCriticalStrikeChance: 8,
    effects: [
      { type: 'damage', value: 100 }
    ],
    levelRequirement: 1
  },
  {
    id: 'blizzard',
    name: 'Blizzard',
    description: 'Creates a blizzard that damages ALL enemies over 8 seconds. Very low effectiveness per tick but hits all enemies every second. Also slows by 30%.',
    icon: React.createElement(GiSnowflake1),
    category: 'spell',
    damageType: 'cold',
    targetType: 'allEnemies',
    allowedRoles: ['dps'],
    baseDamage: 10,
    baseDamageMax: 15,
    manaCost: 8,
    cooldown: 0,
    castTime: 2.5,
    maxSupportSlots: 5,
    supportTags: ['spell', 'cold', 'aoe', 'duration', 'dot'],
    tags: ['spell', 'cold', 'aoe', 'duration', 'dot', 'elemental'],
    damageEffectiveness: 35,
    baseCriticalStrikeChance: 6,
    effects: [
      { type: 'dot', value: 25, duration: 8 },
      { type: 'slow', value: 30, duration: 8 }
    ],
    levelRequirement: 5
  },
  {
    id: 'meteor',
    name: 'Meteor',
    description: 'Massive AoE nuke with a long cast time and cooldown. Despite hitting all enemies, high effectiveness due to the significant cast time and cooldown investment.',
    icon: React.createElement(GiMeteorImpact),
    category: 'spell',
    damageType: 'fire',
    targetType: 'allEnemies',
    allowedRoles: ['dps'],
    baseDamage: 150,
    baseDamageMax: 225,
    manaCost: 35,
    cooldown: 30,
    castTime: 4.0,
    maxSupportSlots: 4,
    supportTags: ['spell', 'fire', 'aoe', 'hit'],
    tags: ['spell', 'fire', 'aoe', 'hit', 'elemental', 'projectile'],
    damageEffectiveness: 180,
    baseCriticalStrikeChance: 10,
    effects: [
      { type: 'damage', value: 375 }
    ],
    levelRequirement: 10
  },
  {
    id: 'corruption',
    name: 'Corruption',
    description: 'Instant cast DoT curse that deals chaos damage over 18 seconds. Very low effectiveness per tick, but instant cast and long duration make it mana-efficient. Apply to all enemies.',
    icon: React.createElement(GiDeathSkull),
    category: 'spell',
    damageType: 'chaos',
    targetType: 'enemy',
    allowedRoles: ['dps'],
    baseDamage: 8,
    baseDamageMax: 13,
    manaCost: 5,
    cooldown: 0,
    castTime: 0,
    maxSupportSlots: 4,
    supportTags: ['spell', 'chaos', 'duration', 'dot'],
    tags: ['spell', 'chaos', 'duration', 'dot', 'curse'],
    damageEffectiveness: 30,
    baseCriticalStrikeChance: 5,
    effects: [
      { type: 'dot', value: 20, duration: 18 }
    ],
    levelRequirement: 3
  },
  {
    id: 'immolate',
    name: 'Immolate',
    description: 'Hybrid spell that deals instant fire damage PLUS a DoT. Medium effectiveness for initial hit, low effectiveness for DoT portion. Good for sustained single-target damage.',
    icon: React.createElement(GiBurningDot),
    category: 'spell',
    damageType: 'fire',
    targetType: 'enemy',
    allowedRoles: ['dps'],
    baseDamage: 25,
    baseDamageMax: 40,
    manaCost: 8,
    cooldown: 0,
    castTime: 1.5,
    maxSupportSlots: 4,
    supportTags: ['spell', 'fire', 'duration', 'dot', 'hit'],
    tags: ['spell', 'fire', 'duration', 'dot', 'hit', 'elemental'],
    damageEffectiveness: 80,
    baseCriticalStrikeChance: 8,
    effects: [
      { type: 'damage', value: 65 },
      { type: 'dot', value: 25, duration: 15 }
    ],
    levelRequirement: 3
  },

  // ===== CHANNELING SKILLS =====
  // These skills have high initial mana cost, then drain mana per tick while channeling.
  // Channeling can be interrupted. Tick rate scales with cast speed.
  // Generally lower effectiveness per tick but very high sustained damage.
  
  {
    id: 'disintegrate',
    name: 'Disintegrate',
    description: 'Channel an intense arcane beam at a single target. Damage RAMPS UP the longer you channel, gaining +10% more damage per second up to 5 stacks (+50% max). Devastating against bosses.',
    icon: React.createElement(GiLaserBurst),
    category: 'spell',
    damageType: 'arcane',
    targetType: 'enemy',
    allowedRoles: ['dps'],
    baseDamage: 30,
    baseDamageMax: 45,
    manaCost: 12,
    cooldown: 0,
    castTime: 0.3,
    maxSupportSlots: 5,
    supportTags: ['spell', 'hit', 'channelling'],
    tags: ['spell', 'arcane', 'hit', 'channelling', 'beam'],
    damageEffectiveness: 55,
    isChanneled: true,
    channelTickRate: 0.5,
    channelDuration: 0,
    manaPerTick: 2,
    channelRampUp: 10,
    maxChannelStacks: 5,
    baseCriticalStrikeChance: 7,
    effects: [
      { type: 'damage', value: 38 }
    ],
    levelRequirement: 8
  },
  {
    id: 'soul_siphon',
    name: 'Soul Siphon',
    description: 'Channel dark energy to drain life from an enemy, healing yourself for 50% of damage dealt. Lower damage but provides sustain. Chaos damage ignores elemental resistances.',
    icon: React.createElement(GiVortex),
    category: 'spell',
    damageType: 'chaos',
    targetType: 'enemy',
    allowedRoles: ['dps'],
    baseDamage: 20,
    baseDamageMax: 35,
    manaCost: 10,
    cooldown: 0,
    castTime: 0.4,
    maxSupportSlots: 4,
    supportTags: ['spell', 'chaos', 'hit', 'channelling'],
    tags: ['spell', 'chaos', 'hit', 'channelling', 'drain'],
    damageEffectiveness: 40,
    isChanneled: true,
    channelTickRate: 0.6,
    channelDuration: 0,
    manaPerTick: 2,
    baseCriticalStrikeChance: 5,
    effects: [
      { type: 'damage', value: 28 },
      { type: 'heal', value: 14 }
    ],
    levelRequirement: 6
  },
  {
    id: 'storm_call',
    name: 'Storm Call',
    description: 'Channel a violent lightning storm that strikes ALL enemies repeatedly. Each tick randomly strikes 2-4 enemies. Very high mana cost but excellent for large packs.',
    icon: React.createElement(GiLightningStorm),
    category: 'spell',
    damageType: 'lightning',
    targetType: 'allEnemies',
    allowedRoles: ['dps'],
    baseDamage: 13,
    baseDamageMax: 38,
    manaCost: 15,
    cooldown: 0,
    castTime: 0.8,
    maxSupportSlots: 5,
    supportTags: ['spell', 'lightning', 'aoe', 'hit', 'channelling'],
    tags: ['spell', 'lightning', 'aoe', 'hit', 'channelling', 'elemental', 'storm'],
    damageEffectiveness: 45,
    isChanneled: true,
    channelTickRate: 0.7,
    channelDuration: 0,
    manaPerTick: 3,
    baseCriticalStrikeChance: 10,
    effects: [
      { type: 'damage', value: 50 }
    ],
    levelRequirement: 12
  },
  {
    id: 'incinerate',
    name: 'Incinerate',
    description: 'Channel a torrent of fire that hits up to 3 enemies in a cone. Applies a stacking burn that increases in damage the longer you channel. Initial hit + burn DoT.',
    icon: React.createElement(GiFlameSpin),
    category: 'spell',
    damageType: 'fire',
    targetType: 'enemy',
    allowedRoles: ['dps'],
    baseDamage: 8,
    baseDamageMax: 13,
    manaCost: 10,
    cooldown: 0,
    castTime: 0.5,
    maxSupportSlots: 5,
    supportTags: ['spell', 'fire', 'hit', 'channelling', 'aoe', 'dot'],
    tags: ['spell', 'fire', 'hit', 'channelling', 'elemental', 'cone', 'dot'],
    damageEffectiveness: 30,
    isChanneled: true,
    channelTickRate: 0.35,
    channelDuration: 0,
    manaPerTick: 2,
    chainCount: 2,
    channelRampUp: 8,
    maxChannelStacks: 8,
    baseCriticalStrikeChance: 6,
    effects: [
      { type: 'damage', value: 20 },
      { type: 'dot', value: 8, duration: 4 }
    ],
    levelRequirement: 10
  }
];

// Pre-defined support gems
export const SUPPORT_GEMS: SupportGem[] = [
  {
    id: 'increased_damage',
    name: 'Increased Damage Support',
    description: '35% increased damage. 20% increased mana cost. Requires attack or spell tag.',
    icon: React.createElement(GiSwordsPower),
    requiredTags: ['attack', 'spell'],
    multipliers: [
      { stat: 'damage', multiplier: 1.35, isMore: false }
    ],
    addedEffects: [],
    manaCostMultiplier: 1.2,
    levelRequirement: 1
  },
  {
    id: 'faster_casting',
    name: 'Faster Casting Support',
    description: '30% more cast speed. 15% increased mana cost. Requires spell tag.',
    icon: React.createElement(GiSpeedometer),
    requiredTags: ['spell'],
    multipliers: [
      { stat: 'castTime', multiplier: 0.7, isMore: true }
    ],
    addedEffects: [],
    manaCostMultiplier: 1.15,
    levelRequirement: 5
  },
  {
    id: 'spell_echo',
    name: 'Spell Echo Support',
    description: 'Supported spells repeat once. 20% less damage per repeat. 40% increased mana cost. Requires spell tag.',
    icon: React.createElement(GiEchoRipples),
    requiredTags: ['spell'],
    multipliers: [
      { stat: 'damage', multiplier: 0.8, isMore: true }
    ],
    addedEffects: [],
    manaCostMultiplier: 1.4,
    levelRequirement: 15
  },
  {
    id: 'greater_multiple_projectiles',
    name: 'Greater Multiple Projectiles',
    description: 'Fires 4 additional projectiles. 26% less damage. 50% increased mana cost. Requires projectile tag.',
    icon: React.createElement(GiTripleScratches),
    requiredTags: ['projectile'],
    multipliers: [
      { stat: 'damage', multiplier: 0.74, isMore: true }
    ],
    addedEffects: [],
    manaCostMultiplier: 1.5,
    levelRequirement: 20
  },
  {
    id: 'melee_splash',
    name: 'Melee Splash Support',
    description: 'Melee attacks deal splash damage to nearby enemies. 15% less damage. Requires melee attack tag.',
    icon: React.createElement(GiWaterSplash),
    requiredTags: ['melee', 'attack'],
    multipliers: [
      { stat: 'damage', multiplier: 0.85, isMore: true }
    ],
    addedEffects: [],
    levelRequirement: 8
  },
  {
    id: 'added_fire_damage',
    name: 'Added Fire Damage Support',
    description: 'Adds 50 flat fire damage to supported skills. 10% increased mana cost. Requires attack or spell tag.',
    icon: React.createElement(GiFire),
    requiredTags: ['attack', 'spell'],
    multipliers: [],
    addedEffects: [
      { type: 'damage', value: 50 }
    ],
    manaCostMultiplier: 1.1,
    levelRequirement: 1
  },
  {
    id: 'lifetap',
    name: 'Lifetap Support',
    description: 'Supported skills cost life instead of mana. 20% more damage. Requires spell or attack tag.',
    icon: React.createElement(GiDrop),
    requiredTags: ['spell', 'attack'],
    multipliers: [
      { stat: 'damage', multiplier: 1.2, isMore: true }
    ],
    addedEffects: [],
    manaCostMultiplier: 0,
    levelRequirement: 10
  },
  {
    id: 'critical_strikes',
    name: 'Increased Critical Strikes',
    description: '100% increased critical strike chance. 10% increased mana cost. Requires attack or spell tag.',
    icon: React.createElement(GiBullseye),
    requiredTags: ['attack', 'spell'],
    multipliers: [
      { stat: 'criticalStrikeChance', multiplier: 2.0, isMore: false }
    ],
    addedEffects: [],
    manaCostMultiplier: 1.1,
    levelRequirement: 12
  },
  {
    id: 'controlled_destruction',
    name: 'Controlled Destruction Support',
    description: '44% more spell damage. 50% less critical strike chance. 15% increased mana cost. Requires spell tag.',
    icon: React.createElement(GiPowerLightning),
    requiredTags: ['spell'],
    multipliers: [
      { stat: 'damage', multiplier: 1.44, isMore: true },
      { stat: 'critChance', multiplier: 0.5, isMore: true }
    ],
    addedEffects: [],
    manaCostMultiplier: 1.15,
    levelRequirement: 18
  },
  {
    id: 'efficacy',
    name: 'Efficacy Support',
    description: '25% more damage. 20% increased duration. 10% increased mana cost. Requires spell with dot or hot effect.',
    icon: React.createElement(GiCog),
    requiredTags: ['spell', 'efficacy'], // Special tag - will be handled in compatibility function
    multipliers: [
      { stat: 'damage', multiplier: 1.25, isMore: true },
      { stat: 'duration', multiplier: 1.2, isMore: false }
    ],
    addedEffects: [],
    manaCostMultiplier: 1.1,
    levelRequirement: 8
  },
  {
    id: 'empower',
    name: 'Empower Support',
    description: 'Increases the level of supported skill gems by 1. Works with any skill.',
    icon: React.createElement(GiStarFormation),
    requiredTags: [],
    multipliers: [
      { stat: 'level', multiplier: 1, isMore: false }
    ],
    addedEffects: [],
    levelRequirement: 25
  }
];

// Helper functions
export function getSkillGemById(id: string): SkillGem | undefined {
  return SKILL_GEMS.find(gem => gem.id === id);
}

// Calculate PoE-style critical strike chance: baseCritChance * (1 + increasedCritChance / 100)
export function calculateCriticalStrikeChance(baseCritChance: number, increasedCritChance: number): number {
  return baseCritChance * (1 + increasedCritChance / 100);
}

// Map ability names to skill IDs (for combat system)
export function getSkillIdFromAbilityName(abilityName: string): string | undefined {
  const nameToId: Record<string, string> = {
    // Tank
    'Shield Slam': 'shield_slam',
    'Thunder Clap': 'thunder_clap',
    'Defensive Stance': 'defensive_stance',
    'Shield Block': 'shield_block',
    'Taunt': 'taunt',
    // Healer
    'Healing Wave': 'healing_wave',
    'Massive Heal': 'massive_heal',
    'Rejuvenation': 'rejuvenation',
    'Circle of Healing': 'circle_of_healing',
    'Pain Suppression': 'pain_suppression',
    'Dispel Magic': 'dispel_magic',
    // DPS
    'Fireball': 'fireball',
    'Ice Lance': 'ice_lance',
    'Lightning Bolt': 'lightning_bolt',
    'Shadow Bolt': 'shadow_bolt',
    'Arcane Missiles': 'arcane_missiles',
    'Blow Up': 'blow_up',
    'Blizzard': 'blizzard',
    'Meteor': 'meteor',
    'Corruption': 'corruption',
    'Immolate': 'immolate',
  };
  return nameToId[abilityName];
}

export function getSupportGemById(id: string): SupportGem | undefined {
  return SUPPORT_GEMS.find(gem => gem.id === id);
}

export function getSkillsForRole(role: CharacterRole): SkillGem[] {
  return SKILL_GEMS.filter(gem => 
    gem.allowedRoles.length === 0 || gem.allowedRoles.includes(role)
  );
}

export function canSupportApplyToSkill(support: SupportGem, skill: SkillGem): boolean {
  if (support.requiredTags.length === 0) return true;
  
  // Special case for efficacy: requires spell AND (dot OR hot)
  if (support.id === 'efficacy') {
    const hasSpell = skill.supportTags.includes('spell');
    const hasDot = skill.supportTags.includes('dot');
    const hasHot = skill.supportTags.includes('hot');
    return hasSpell && (hasDot || hasHot);
  }
  
  // For melee_splash: requires both melee AND attack
  if (support.id === 'melee_splash') {
    return skill.supportTags.includes('melee') && skill.supportTags.includes('attack');
  }
  
  // Default: skill must have at least one of the required tags
  return support.requiredTags.some(tag => skill.supportTags.includes(tag));
}

