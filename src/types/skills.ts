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
  GiVortex,               // Soul Siphon, Tornado Shot
  GiLightningStorm,       // Storm Call
  GiFlameSpin,            // Incinerate, Cyclone
  
  // Bow skill icons (reusing existing icons)
  GiTripleScratches,      // Split Arrow, Greater Multiple Projectiles
  // GiSnowflake1, GiMagicSwirl, GiIceBolt, GiLightningTear - reused from above
  
  // Melee skill icons (reusing existing icons)
  GiSwordsPower,          // Cleave, Increased Damage
  // GiShieldBash - reused from above
  GiEchoRipples,          // Double Strike, Spell Echo
  GiWaterSplash,          // Reave, Melee Splash
  // GiSonicShout - reused from above
  
  // Support gem icons
  GiSpeedometer,          // Faster Casting
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
  
  // Target Cap (for AOE skills)
  // Limits how many enemies can be hit by this skill
  // undefined = unlimited targets
  maxTargets?: number;
  
  // Critical Strike (PoE style)
  baseCriticalStrikeChance: number; // Base crit chance for this skill (e.g., 8%)
  
  // Special effects
  effects: SkillEffect[];
  
  // Requirements
  levelRequirement: number;
  
  // Level Scaling (optional - for skills that need to scale with character level)
  // If true, skill damage scales from 40% at level 1 to 100% at level 90
  // Primarily used for melee skills that are too strong early game
  levelScaling?: boolean;
  
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
    manaCost: 5,
    cooldown: 6,
    castTime: 0,
    maxSupportSlots: 4,
    supportTags: ['attack', 'melee', 'physical', 'strike', 'hit'],
    tags: ['attack', 'melee', 'physical', 'strike', 'hit', 'slam'],
    damageEffectiveness: 180, // 120 * 1.5
    baseCriticalStrikeChance: 5,
    levelScaling: true, // Scales from 40% at level 1 to 100% at level 90
    effects: [
      { type: 'damage', value: 75 }
    ],
    levelRequirement: 1
  },
  {
    id: 'thunder_clap',
    name: 'Thunder Clap',
    description: 'Smash the ground to create a shockwave that hits up to 5 nearby enemies. Lower effectiveness per target due to AoE nature.',
    icon: React.createElement(GiSonicShout),
    category: 'attack',
    damageType: 'physical',
    targetType: 'allEnemies',
    allowedRoles: ['tank'],
    baseDamage: 5,
    baseDamageMax: 7.5,
    manaCost: 4,
    cooldown: 4,
    castTime: 0,
    maxTargets: 5, // Cap at 5 enemies
    maxSupportSlots: 4,
    supportTags: ['attack', 'melee', 'physical', 'aoe', 'hit'],
    tags: ['attack', 'melee', 'physical', 'aoe', 'hit', 'slam', 'warcry'],
    damageEffectiveness: 120, // 80 * 1.5
    baseCriticalStrikeChance: 5,
    levelScaling: true, // Scales from 40% at level 1 to 100% at level 90
    effects: [
      { type: 'damage', value: 25 }
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
    baseHealing: 60, // BALANCED: 60 base * 2.5 scaling = ~150 HP per cast at level 2, ~12.5 HPS (1.2s cast)
    manaCost: 5,
    cooldown: 0,
    castTime: 1.2,
    maxSupportSlots: 5,
    supportTags: ['spell', 'heal'],
    tags: ['spell', 'holy', 'heal', 'hit'],
    damageEffectiveness: 150,
    baseCriticalStrikeChance: 8,
    effects: [
      { type: 'heal', value: 60 }
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
    baseHealing: 250, // BALANCED: 250 base * 3.0 scaling = ~750 HP, emergency heal
    manaCost: 22,
    cooldown: 0,
    castTime: 2.4,
    maxSupportSlots: 4,
    supportTags: ['spell', 'heal'],
    tags: ['spell', 'holy', 'heal', 'hit'],
    damageEffectiveness: 200,
    baseCriticalStrikeChance: 8,
    effects: [
      { type: 'heal', value: 250 }
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
    manaCost: 5,
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
    baseDamage: 55,
    baseDamageMax: 80,
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
    baseDamage: 55,
    baseDamageMax: 85,
    manaCost: 7,
    cooldown: 0,
    castTime: 1.0,
    maxSupportSlots: 5,
    supportTags: ['spell', 'lightning', 'hit', 'chaining'],
    tags: ['spell', 'lightning', 'hit', 'chaining', 'elemental'],
    damageEffectiveness: 120,
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
    baseDamage: 60,
    baseDamageMax: 90,
    manaCost: 8,
    cooldown: 0,
    castTime: 1.4,
    maxSupportSlots: 5,
    supportTags: ['spell', 'chaos', 'projectile', 'hit', 'chaining'],
    tags: ['spell', 'chaos', 'projectile', 'hit', 'chaining'],
    damageEffectiveness: 125,
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
    baseDamage: 26,
    baseDamageMax: 38,
    manaCost: 8,
    cooldown: 0,
    castTime: 0.5,
    maxSupportSlots: 5,
    supportTags: ['spell', 'projectile', 'hit', 'channelling'],
    tags: ['spell', 'arcane', 'projectile', 'hit', 'channelling'],
    damageEffectiveness: 50,
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
    description: 'Explosive AoE that hits up to 10 enemies. Lower effectiveness per target due to AoE nature. Best for large packs.',
    icon: React.createElement(GiExplosiveMaterials),
    category: 'spell',
    damageType: 'fire',
    targetType: 'allEnemies',
    allowedRoles: ['dps'],
    baseDamage: 75,
    baseDamageMax: 110,
    manaCost: 6,
    cooldown: 0,
    castTime: 2.4,
    maxTargets: 10, // Cap at 10 enemies
    maxSupportSlots: 5,
    supportTags: ['spell', 'fire', 'aoe', 'hit'],
    tags: ['spell', 'fire', 'aoe', 'hit', 'elemental'],
    damageEffectiveness: 75,
    baseCriticalStrikeChance: 8,
    effects: [
      { type: 'damage', value: 100 }
    ],
    levelRequirement: 1
  },
  {
    id: 'blizzard',
    name: 'Blizzard',
    description: 'Creates a blizzard that damages up to 12 enemies over 8 seconds. Very low effectiveness per tick but hits multiple enemies every second. Also slows by 30%.',
    icon: React.createElement(GiSnowflake1),
    category: 'spell',
    damageType: 'cold',
    targetType: 'allEnemies',
    allowedRoles: ['dps'],
    baseDamage: 35,
    baseDamageMax: 50,
    manaCost: 8,
    cooldown: 0,
    castTime: 2.5,
    maxTargets: 12, // Cap at 12 enemies (DOT skills can hit more)
    maxSupportSlots: 5,
    supportTags: ['spell', 'cold', 'aoe', 'duration', 'dot'],
    tags: ['spell', 'cold', 'aoe', 'duration', 'dot', 'elemental'],
    damageEffectiveness: 50,
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
    description: 'Massive AoE nuke that hits up to 12 enemies with a long cast time and cooldown. High effectiveness due to the significant cast time and cooldown investment.',
    icon: React.createElement(GiMeteorImpact),
    category: 'spell',
    damageType: 'fire',
    targetType: 'allEnemies',
    allowedRoles: ['dps'],
    baseDamage: 800,
    baseDamageMax: 1200,
    manaCost: 35,
    cooldown: 30,
    castTime: 4.0,
    maxTargets: 12, // Cap at 12 enemies (long cooldown justifies more targets)
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
    description: 'Instant cast DoT curse that deals chaos damage over 18 seconds. Very low effectiveness per tick, but instant cast and long duration make it mana-efficient. Apply to multiple enemies.',
    icon: React.createElement(GiDeathSkull),
    category: 'spell',
    damageType: 'chaos',
    targetType: 'enemy',
    allowedRoles: ['dps'],
    baseDamage: 50,
    baseDamageMax: 75,
    manaCost: 5,
    cooldown: 0,
    castTime: 0,
    maxSupportSlots: 4,
    supportTags: ['spell', 'chaos', 'duration', 'dot'],
    tags: ['spell', 'chaos', 'duration', 'dot', 'curse'],
    damageEffectiveness: 45,
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
    baseDamage: 35,
    baseDamageMax: 50,
    manaCost: 8,
    cooldown: 0,
    castTime: 1.5,
    maxSupportSlots: 4,
    supportTags: ['spell', 'fire', 'duration', 'dot', 'hit'],
    tags: ['spell', 'fire', 'duration', 'dot', 'hit', 'elemental'],
    damageEffectiveness: 100,
    baseCriticalStrikeChance: 8,
    effects: [
      { type: 'damage', value: 65 },
      { type: 'dot', value: 40, duration: 12 }
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
    baseDamage: 42,
    baseDamageMax: 62,
    manaCost: 12,
    cooldown: 0,
    castTime: 0.3,
    maxSupportSlots: 5,
    supportTags: ['spell', 'hit', 'channelling'],
    tags: ['spell', 'arcane', 'hit', 'channelling', 'beam'],
    damageEffectiveness: 65,
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
    baseDamage: 38,
    baseDamageMax: 55,
    manaCost: 10,
    cooldown: 0,
    castTime: 0.4,
    maxSupportSlots: 4,
    supportTags: ['spell', 'chaos', 'hit', 'channelling'],
    tags: ['spell', 'chaos', 'hit', 'channelling', 'drain'],
    damageEffectiveness: 55,
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
    description: 'Channel a violent lightning storm that strikes up to 8 enemies repeatedly. Each tick randomly strikes enemies. Very high mana cost but excellent for packs.',
    icon: React.createElement(GiLightningStorm),
    category: 'spell',
    damageType: 'lightning',
    targetType: 'allEnemies',
    allowedRoles: ['dps'],
    baseDamage: 22,
    baseDamageMax: 32,
    manaCost: 15,
    cooldown: 0,
    castTime: 0.8,
    maxTargets: 8, // Cap at 8 enemies
    maxSupportSlots: 5,
    supportTags: ['spell', 'lightning', 'aoe', 'hit', 'channelling'],
    tags: ['spell', 'lightning', 'aoe', 'hit', 'channelling', 'elemental', 'storm'],
    damageEffectiveness: 60,
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
    description: 'Channel a torrent of fire that hits up to 5 enemies in a cone. Applies a stacking burn that increases in damage the longer you channel. Initial hit + burn DoT.',
    icon: React.createElement(GiFlameSpin),
    category: 'spell',
    damageType: 'fire',
    targetType: 'enemy',
    allowedRoles: ['dps'],
    baseDamage: 18,
    baseDamageMax: 26,
    manaCost: 10,
    cooldown: 0,
    castTime: 0.5,
    maxTargets: 5,
    maxSupportSlots: 5,
    supportTags: ['spell', 'fire', 'hit', 'channelling', 'aoe', 'dot'],
    tags: ['spell', 'fire', 'hit', 'channelling', 'elemental', 'cone', 'dot'],
    damageEffectiveness: 55,
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
  },

  // ===== BOW ATTACK SKILLS =====
  {
    id: 'split_arrow',
    name: 'Split Arrow',
    description: 'Fires multiple arrows in a cone, hitting multiple enemies. Lower damage effectiveness per target due to multi-hit nature, but excellent for clearing packs.',
    icon: React.createElement(GiTripleScratches),
    category: 'attack',
    damageType: 'physical',
    targetType: 'enemy',
    allowedRoles: ['dps'],
    baseDamage: 0, // Attack skills use weapon damage only (PoE style)
    baseDamageMax: 0,
    manaCost: 3,
    cooldown: 0,
    castTime: 0,
    maxSupportSlots: 5,
    supportTags: ['attack', 'ranged', 'projectile', 'physical', 'hit'],
    tags: ['attack', 'ranged', 'projectile', 'physical', 'hit'],
    damageEffectiveness: 120, // 80 * 1.5 - hits 5 projectiles
    projectileCount: 5,
    baseCriticalStrikeChance: 5,
    effects: [
      { type: 'damage', value: 100 }
    ],
    levelRequirement: 1
  },
  {
    id: 'rain_of_arrows',
    name: 'Rain of Arrows',
    description: 'Launches a volley of arrows into the air that rain down on a targeted area, hitting up to 10 enemies. Lower effectiveness per target due to AoE nature.',
    icon: React.createElement(GiSnowflake1),
    category: 'attack',
    damageType: 'physical',
    targetType: 'allEnemies',
    allowedRoles: ['dps'],
    baseDamage: 0, // Attack skills use weapon damage only (PoE style)
    baseDamageMax: 0,
    manaCost: 8,
    cooldown: 0,
    castTime: 0.8,
    maxTargets: 10, // Cap at 10 enemies
    maxSupportSlots: 5,
    supportTags: ['attack', 'ranged', 'aoe', 'physical', 'hit'],
    tags: ['attack', 'ranged', 'aoe', 'physical', 'hit'],
    damageEffectiveness: 75, // 50 * 1.5 - AoE skill
    baseCriticalStrikeChance: 5,
    effects: [
      { type: 'damage', value: 100 }
    ],
    levelRequirement: 4
  },
  {
    id: 'barrage',
    name: 'Barrage',
    description: 'Rapidly fires a stream of arrows at a single target. High damage effectiveness due to single-target focus. Each arrow hits the same target.',
    icon: React.createElement(GiMagicSwirl),
    category: 'attack',
    damageType: 'physical',
    targetType: 'enemy',
    allowedRoles: ['dps'],
    baseDamage: 0, // Attack skills use weapon damage only (PoE style)
    baseDamageMax: 0,
    manaCost: 4,
    cooldown: 0,
    castTime: 0,
    maxSupportSlots: 5,
    supportTags: ['attack', 'ranged', 'projectile', 'physical', 'hit'],
    tags: ['attack', 'ranged', 'projectile', 'physical', 'hit'],
    damageEffectiveness: 105, // 70 * 1.5 - fires 3 arrows at same target
    projectileCount: 3,
    hitCount: 3,
    baseCriticalStrikeChance: 6,
    effects: [
      { type: 'damage', value: 100 }
    ],
    levelRequirement: 6
  },
  {
    id: 'tornado_shot',
    name: 'Tornado Shot',
    description: 'Fires an arrow that splits into multiple projectiles in a spiral pattern, chaining to nearby enemies. Medium effectiveness due to multi-target nature.',
    icon: React.createElement(GiVortex),
    category: 'attack',
    damageType: 'physical',
    targetType: 'enemy',
    allowedRoles: ['dps'],
    baseDamage: 0, // Attack skills use weapon damage only (PoE style)
    baseDamageMax: 0,
    manaCost: 8,
    cooldown: 0,
    castTime: 0,
    maxSupportSlots: 5,
    supportTags: ['attack', 'ranged', 'projectile', 'physical', 'hit', 'chaining'],
    tags: ['attack', 'ranged', 'projectile', 'physical', 'hit', 'chaining'],
    damageEffectiveness: 135, // 90 * 1.5 - 3 projectiles that chain
    projectileCount: 3,
    chainCount: 2,
    chainDamageBonus: 10,
    baseCriticalStrikeChance: 6,
    effects: [
      { type: 'damage', value: 100 }
    ],
    levelRequirement: 8
  },
  {
    id: 'ice_shot',
    name: 'Ice Shot',
    description: 'Fires a freezing arrow that deals cold damage and has a chance to slow enemies. The arrow creates a small cold explosion on impact.',
    icon: React.createElement(GiIceBolt),
    category: 'attack',
    damageType: 'cold',
    targetType: 'enemy',
    allowedRoles: ['dps'],
    baseDamage: 0, // Attack skills use weapon damage only (PoE style)
    baseDamageMax: 0,
    manaCost: 6,
    cooldown: 0,
    castTime: 0,
    maxSupportSlots: 5,
    supportTags: ['attack', 'ranged', 'projectile', 'cold', 'hit', 'elemental'],
    tags: ['attack', 'ranged', 'projectile', 'cold', 'hit', 'elemental'],
    damageEffectiveness: 210, // 140 * 1.5 - single target with conversion
    baseCriticalStrikeChance: 6,
    effects: [
      { type: 'damage', value: 100 },
      { type: 'slow', value: 25, duration: 3, chance: 40 }
    ],
    levelRequirement: 3
  },
  {
    id: 'lightning_arrow',
    name: 'Lightning Arrow',
    description: 'Fires a lightning-charged arrow that chains to nearby enemies after impact. Deals lightning damage and has a chance to shock targets.',
    icon: React.createElement(GiLightningTear),
    category: 'attack',
    damageType: 'lightning',
    targetType: 'enemy',
    allowedRoles: ['dps'],
    baseDamage: 0, // Attack skills use weapon damage only (PoE style)
    baseDamageMax: 0,
    manaCost: 7,
    cooldown: 0,
    castTime: 0,
    maxSupportSlots: 5,
    supportTags: ['attack', 'ranged', 'projectile', 'lightning', 'hit', 'chaining', 'elemental'],
    tags: ['attack', 'ranged', 'projectile', 'lightning', 'hit', 'chaining', 'elemental'],
    damageEffectiveness: 180, // 120 * 1.5 - chains to 3 total targets
    chainCount: 2,
    chainDamageBonus: 15,
    baseCriticalStrikeChance: 7,
    effects: [
      { type: 'damage', value: 100 }
    ],
    levelRequirement: 5
  },

  // ===== MELEE ATTACK SKILLS =====
  {
    id: 'cleave',
    name: 'Cleave',
    description: 'Performs a wide horizontal swing that hits up to 8 enemies in front of you. Lower effectiveness per target due to AoE nature, but excellent for clearing packs.',
    icon: React.createElement(GiSwordsPower),
    category: 'attack',
    damageType: 'physical',
    targetType: 'allEnemies',
    allowedRoles: ['dps'],
    baseDamage: 0, // Attack skills use weapon damage only (PoE style)
    baseDamageMax: 0,
    manaCost: 5,
    cooldown: 0,
    castTime: 0,
    maxTargets: 8, // Cap at 8 enemies
    maxSupportSlots: 5,
    supportTags: ['attack', 'melee', 'physical', 'aoe', 'hit'],
    tags: ['attack', 'melee', 'physical', 'aoe', 'hit'],
    damageEffectiveness: 120, // 80 * 1.5 - AoE melee
    baseCriticalStrikeChance: 5,
    levelScaling: true, // Scales from 40% at level 1 to 100% at level 90
    effects: [
      { type: 'damage', value: 100 }
    ],
    levelRequirement: 1
  },
  {
    id: 'heavy_strike',
    name: 'Heavy Strike',
    description: 'A powerful single-target melee attack with high damage effectiveness. Slower but devastating against single enemies. Has a chance to stun.',
    icon: React.createElement(GiShieldBash),
    category: 'attack',
    damageType: 'physical',
    targetType: 'enemy',
    allowedRoles: ['dps'],
    baseDamage: 0, // Attack skills use weapon damage only (PoE style)
    baseDamageMax: 0,
    manaCost: 6,
    cooldown: 0,
    castTime: 0,
    maxSupportSlots: 5,
    supportTags: ['attack', 'melee', 'physical', 'strike', 'hit'],
    tags: ['attack', 'melee', 'physical', 'strike', 'hit'],
    damageEffectiveness: 255, // 170 * 1.5 - single target, slow
    baseCriticalStrikeChance: 5,
    levelScaling: true, // Scales from 40% at level 1 to 100% at level 90
    effects: [
      { type: 'damage', value: 100 }
    ],
    levelRequirement: 1
  },
  {
    id: 'double_strike',
    name: 'Double Strike',
    description: 'Rapidly strikes twice with your weapon, dealing two hits to a single target. Fast and efficient for single-target damage.',
    icon: React.createElement(GiEchoRipples),
    category: 'attack',
    damageType: 'physical',
    targetType: 'enemy',
    allowedRoles: ['dps'],
    baseDamage: 0, // Attack skills use weapon damage only (PoE style)
    baseDamageMax: 0,
    manaCost: 4,
    cooldown: 0,
    castTime: 0,
    maxSupportSlots: 5,
    supportTags: ['attack', 'melee', 'physical', 'strike', 'hit'],
    tags: ['attack', 'melee', 'physical', 'strike', 'hit'],
    damageEffectiveness: 165, // 110 * 1.5 - hits twice
    hitCount: 2,
    baseCriticalStrikeChance: 6,
    effects: [
      { type: 'damage', value: 100 }
    ],
    levelRequirement: 2
  },
  {
    id: 'cyclone',
    name: 'Cyclone',
    description: 'Channel a spinning attack that hits up to 8 enemies around you repeatedly. Lower effectiveness per hit but hits many times. Can be interrupted.',
    icon: React.createElement(GiFlameSpin),
    category: 'attack',
    damageType: 'physical',
    targetType: 'allEnemies',
    allowedRoles: ['dps'],
    baseDamage: 0, // Attack skills use weapon damage only (PoE style)
    baseDamageMax: 0,
    manaCost: 8,
    cooldown: 0,
    castTime: 0.2,
    maxTargets: 8, // Cap at 8 enemies
    maxSupportSlots: 5,
    supportTags: ['attack', 'melee', 'physical', 'aoe', 'hit', 'channelling'],
    tags: ['attack', 'melee', 'physical', 'aoe', 'hit', 'channelling'],
    damageEffectiveness: 90, // 60 * 1.5 - channeled AoE
    isChanneled: true,
    channelTickRate: 0.4,
    channelDuration: 0,
    manaPerTick: 2,
    baseCriticalStrikeChance: 5,
    effects: [
      { type: 'damage', value: 100 }
    ],
    levelRequirement: 7
  },
  {
    id: 'reave',
    name: 'Reave',
    description: 'Slashes in a wide arc in front of you, hitting up to 8 enemies in a cone. Gains increased area of effect with each consecutive use.',
    icon: React.createElement(GiWaterSplash),
    category: 'attack',
    damageType: 'physical',
    targetType: 'allEnemies',
    allowedRoles: ['dps'],
    baseDamage: 0, // Attack skills use weapon damage only (PoE style)
    baseDamageMax: 0,
    manaCost: 6,
    cooldown: 0,
    castTime: 0,
    maxTargets: 8, // Cap at 8 enemies
    maxSupportSlots: 5,
    supportTags: ['attack', 'melee', 'physical', 'aoe', 'hit'],
    tags: ['attack', 'melee', 'physical', 'aoe', 'hit'],
    damageEffectiveness: 135, // 90 * 1.5 - AoE melee
    baseCriticalStrikeChance: 5,
    effects: [
      { type: 'damage', value: 100 }
    ],
    levelRequirement: 4
  },
  {
    id: 'lacerate',
    name: 'Lacerate',
    description: 'Slashes twice in a cross pattern, dealing physical damage and applying a bleeding DoT. Good for sustained damage over time.',
    icon: React.createElement(GiSonicShout),
    category: 'attack',
    damageType: 'physical',
    targetType: 'enemy',
    allowedRoles: ['dps'],
    baseDamage: 0, // Attack skills use weapon damage only (PoE style)
    baseDamageMax: 0,
    manaCost: 7,
    cooldown: 0,
    castTime: 0,
    maxSupportSlots: 5,
    supportTags: ['attack', 'melee', 'physical', 'hit', 'dot'],
    tags: ['attack', 'melee', 'physical', 'hit', 'dot'],
    damageEffectiveness: 150, // 100 * 1.5 - hits twice with DoT
    hitCount: 2,
    baseCriticalStrikeChance: 6,
    effects: [
      { type: 'damage', value: 100 },
      { type: 'dot', value: 20, duration: 8 }
    ],
    levelRequirement: 5
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
    // DPS - Spells
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
    // DPS - Attack Skills (use weapon damage)
    'Split Arrow': 'split_arrow',
    'Barrage': 'barrage',
    'Rain of Arrows': 'rain_of_arrows',
    'Tornado Shot': 'tornado_shot',
    'Puncture': 'puncture',
    'Burning Arrow': 'burning_arrow',
    'Ice Shot': 'ice_shot',
    'Lightning Arrow': 'lightning_arrow',
    'Caustic Arrow': 'caustic_arrow',
    'Elemental Hit': 'elemental_hit',
    'Double Strike': 'double_strike',
    'Cleave': 'cleave',
    'Sweep': 'sweep',
    'Ground Slam': 'ground_slam',
    'Leap Slam': 'leap_slam',
    'Cyclone': 'cyclone',
    'Blade Flurry': 'blade_flurry',
    'Lacerate': 'lacerate',
    'Bladestorm': 'bladestorm',
    'Reave': 'reave',
    'Spectral Throw': 'spectral_throw',
    'Wild Strike': 'wild_strike',
    'Molten Strike': 'molten_strike',
    'Frost Blades': 'frost_blades',
    'Lightning Strike': 'lightning_strike',
    'Viper Strike': 'viper_strike',
    'Dual Strike': 'dual_strike',
    'Flicker Strike': 'flicker_strike',
    'Heavy Strike': 'heavy_strike',
    'Glacial Hammer': 'glacial_hammer',
    'Infernal Blow': 'infernal_blow',
    'Static Strike': 'static_strike',
    'Smite': 'smite',
    'Consecrated Path': 'consecrated_path',
    'Tectonic Slam': 'tectonic_slam',
    'Earthquake': 'earthquake',
    'Sunder': 'sunder',
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
  // Healing spells should NOT accept damage-only supports
  const isHealingSkill = skill.supportTags.includes('heal') || skill.category === 'heal';
  
  // Damage-only supports that should NOT work with healing spells
  const damageOnlySupports = [
    'increased_damage', // Only increases damage, not healing
    'added_fire_damage', // Adds damage, not healing
    'controlled_destruction', // Only affects spell damage
    'greater_multiple_projectiles', // Projectiles don't make sense for healing
    'melee_splash' // Melee splash doesn't make sense for healing
  ];
  
  if (isHealingSkill && damageOnlySupports.includes(support.id)) {
    return false;
  }
  
  // Non-healing skills should NOT accept healing-only supports (if we add any in the future)
  // For now, all supports that work with healing also work with damage spells
  
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

// Get a default support gem for a skill (first compatible support gem)
export function getDefaultSupportGemForSkill(skill: SkillGem): string | null {
  // Smart support selection based on skill characteristics
  const tags = skill.tags || [];
  
  // Priority 1: Skill-specific optimal supports
  
  // For AOE skills, prioritize AOE-enhancing supports
  if (skill.targetType === 'allEnemies' || tags.includes('aoe')) {
    // AOE skills benefit from: increased_damage, controlled_destruction (for spells), added_fire_damage
    if (tags.includes('spell')) {
      // Spell AOE: controlled_destruction is great for non-crit builds
      if (canSupportApplyToSkill(getSupportGemById('controlled_destruction')!, skill)) {
        return 'controlled_destruction';
      }
      if (canSupportApplyToSkill(getSupportGemById('increased_damage')!, skill)) {
        return 'increased_damage';
      }
    } else if (tags.includes('attack')) {
      // Attack AOE: increased_damage or added_fire_damage
      if (canSupportApplyToSkill(getSupportGemById('increased_damage')!, skill)) {
        return 'increased_damage';
      }
      if (canSupportApplyToSkill(getSupportGemById('added_fire_damage')!, skill)) {
        return 'added_fire_damage';
      }
    }
  }
  
  // For single-target skills, prioritize damage multipliers
  if (skill.targetType === 'enemy' || tags.includes('strike')) {
    if (tags.includes('spell')) {
      // Single target spells: controlled_destruction or faster_casting
      if (canSupportApplyToSkill(getSupportGemById('controlled_destruction')!, skill)) {
        return 'controlled_destruction';
      }
      if (canSupportApplyToSkill(getSupportGemById('faster_casting')!, skill)) {
        return 'faster_casting';
      }
    } else if (tags.includes('attack')) {
      // Single target attacks: increased_damage or added_fire_damage
      if (canSupportApplyToSkill(getSupportGemById('increased_damage')!, skill)) {
        return 'increased_damage';
      }
      if (canSupportApplyToSkill(getSupportGemById('added_fire_damage')!, skill)) {
        return 'added_fire_damage';
      }
    }
  }
  
  // For healing skills
  if (skill.category === 'heal') {
    if (canSupportApplyToSkill(getSupportGemById('faster_casting')!, skill)) {
      return 'faster_casting';
    }
    if (canSupportApplyToSkill(getSupportGemById('increased_damage')!, skill)) {
      return 'increased_damage'; // Works for healing too
    }
  }
  
  // Priority 2: General good supports
  const defaultSupports = ['increased_damage', 'faster_casting', 'added_fire_damage'];
  
  for (const supportId of defaultSupports) {
    const support = getSupportGemById(supportId);
    if (support && canSupportApplyToSkill(support, skill)) {
      return supportId;
    }
  }
  
  // Priority 3: Find any compatible support
  for (const support of SUPPORT_GEMS) {
    if (canSupportApplyToSkill(support, skill)) {
      return support.id;
    }
  }
  
  return null;
}

/**
 * Result of applying support gems to a skill
 */
export interface SupportGemResult {
  damageMultiplier: number; // Combined multiplier for damage (more multipliers are multiplicative, increased are additive)
  healingMultiplier: number; // Combined multiplier for healing
  castTimeMultiplier: number; // Combined multiplier for cast time (lower = faster)
  critChanceMultiplier: number; // Combined multiplier for crit chance
  manaCostMultiplier: number; // Combined multiplier for mana cost
  addedDamage: number; // Flat added damage
  addedHealing: number; // Flat added healing
  hasMeleeSplash: boolean; // Whether melee splash is active
  hasSpellEcho: boolean; // Whether spell echo is active
  hasGMP: boolean; // Whether Greater Multiple Projectiles is active
  projectileCount: number; // Additional projectiles from GMP
  levelBonus: number; // Level bonus from Empower support
}

/**
 * Apply support gems to a skill and return the combined modifiers
 */
export function applySupportGems(
  skill: SkillGem,
  supportGemIds: string[],
  _inventory: any[] = []
): SupportGemResult {
  const result: SupportGemResult = {
    damageMultiplier: 1.0,
    healingMultiplier: 1.0,
    castTimeMultiplier: 1.0,
    critChanceMultiplier: 1.0,
    manaCostMultiplier: 1.0,
    addedDamage: 0,
    addedHealing: 0,
    hasMeleeSplash: false,
    hasSpellEcho: false,
    hasGMP: false,
    projectileCount: 0,
    levelBonus: 0
  };
  
  // Separate "more" and "increased" multipliers
  let increasedDamageMultiplier = 1.0;
  let moreDamageMultiplier = 1.0;
  let increasedHealingMultiplier = 1.0;
  let moreHealingMultiplier = 1.0;
  
  for (const supportId of supportGemIds) {
    if (!supportId) continue;
    
    const support = getSupportGemById(supportId);
    if (!support) continue;
    
    // Check compatibility
    if (!canSupportApplyToSkill(support, skill)) continue;
    
    // Apply multipliers
    for (const mult of support.multipliers) {
      if (mult.stat === 'damage') {
        if (mult.isMore) {
          moreDamageMultiplier *= mult.multiplier;
        } else {
          increasedDamageMultiplier += (mult.multiplier - 1.0);
        }
      } else if (mult.stat === 'healing') {
        if (mult.isMore) {
          moreHealingMultiplier *= mult.multiplier;
        } else {
          increasedHealingMultiplier += (mult.multiplier - 1.0);
        }
      } else if (mult.stat === 'castTime') {
        result.castTimeMultiplier *= mult.multiplier;
      } else if (mult.stat === 'criticalStrikeChance' || mult.stat === 'critChance') {
        if (mult.isMore) {
          result.critChanceMultiplier *= mult.multiplier;
        } else {
          result.critChanceMultiplier += (mult.multiplier - 1.0);
        }
      } else if (mult.stat === 'level') {
        // Empower support - adds level to skill
        result.levelBonus += mult.multiplier;
      }
    }
    
    // Apply added effects
    for (const effect of support.addedEffects) {
      if (effect.type === 'damage') {
        result.addedDamage += effect.value || 0;
      } else if (effect.type === 'heal') {
        result.addedHealing += effect.value || 0;
      }
    }
    
    // Apply mana cost multiplier
    if (support.manaCostMultiplier !== undefined) {
      result.manaCostMultiplier *= support.manaCostMultiplier;
    }
    
    // Check for special support gems
    if (support.id === 'melee_splash') {
      result.hasMeleeSplash = true;
    } else if (support.id === 'spell_echo') {
      result.hasSpellEcho = true;
    } else if (support.id === 'greater_multiple_projectiles') {
      result.hasGMP = true;
      result.projectileCount = 4; // GMP adds 4 projectiles
    }
  }
  
  // Combine increased and more multipliers (increased are additive, more are multiplicative)
  result.damageMultiplier = (1.0 + increasedDamageMultiplier - 1.0) * moreDamageMultiplier;
  result.healingMultiplier = (1.0 + increasedHealingMultiplier - 1.0) * moreHealingMultiplier;
  
  return result;
}

