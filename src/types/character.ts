import type { CharacterClassId } from './classes';
import { getClassById } from './classes';

// Character Roles - the three archetypes
export type CharacterRole = 'tank' | 'healer' | 'dps';

// Path of Exile style base stats
export interface BaseStats {
  // Core Attributes (PoE style)
  strength: number;        // +1 Life per 2 Strength, +1% Melee Physical Damage per 5 Strength
  dexterity: number;       // +2 Accuracy per Dexterity, +1% Evasion Rating per 5 Dexterity
  intelligence: number;    // +1 Mana per 2 Intelligence, +1% Maximum Energy Shield per 5 Intelligence
  
  // Life and Mana
  life: number;            // Maximum life (base + from strength/gear)
  maxLife: number;         // Same as life
  mana: number;            // Maximum mana (base + from intelligence/gear)
  maxMana: number;         // Same as mana
  
  // Offensive Stats
  accuracy: number;        // Accuracy rating (PoE: +2 per Dexterity, affects hit chance vs evasion)
  
  // Defensive Stats
  armor: number;           // Physical damage reduction (PoE formula: Armor / (Armor + 5*Damage))
  evasion: number;         // Evasion rating (chance to avoid attacks)
  energyShield: number;    // Secondary health pool that protects life
  
  // Regeneration (PoE style - percentage of max per second)
  lifeRegeneration: number;        // % of max life regenerated per second
  manaRegeneration: number;        // % of max mana regenerated per second (base 1.75%)
  energyShieldRechargeRate: number; // % of max ES recharged per second (base 33.3%)
  energyShieldRechargeDelay: number; // Seconds before ES starts recharging (base 2.0)
  
  // Critical Strike
  criticalStrikeChance: number;      // Base 5%, chance to deal critical hits (%)
  criticalStrikeMultiplier: number;  // Base 150%, damage multiplier for crits (%)
  
  // Resistances (PoE style - direct percentage reduction, capped at 75%)
  fireResistance: number;      // Fire damage reduction (%)
  coldResistance: number;     // Cold damage reduction (%)
  lightningResistance: number; // Lightning damage reduction (%)
  chaosResistance: number;     // Chaos damage reduction (%)
  
  // Block and Spell Defense
  blockChance: number;              // Chance to block physical attacks (%, capped at 75%)
  spellBlockChance: number;         // Chance to block spells (%, capped at 75%)
  spellSuppressionChance: number;   // Chance to reduce spell damage by 50% (%, capped at 100%)
  
  // Damage Modifiers (PoE style - separate increased vs more)
  increasedDamage: number;          // Sum of all "increased damage" modifiers (%)
  // Note: "more" damage modifiers are handled per-skill as they stack multiplicatively
}

// Derived/computed stats from gear, talents, etc.
export interface ComputedStats extends BaseStats {
  effectiveHealth: number;
  damageReduction: number;
  healingPower: number;
  cooldownReduction: number;
}

// A character in your roster
export interface Character {
  id: string;
  name: string;
  role: CharacterRole;
  classId?: CharacterClassId; // Optional for backwards compatibility with existing characters
  level: number;
  experience: number;
  baseStats: BaseStats;
  equippedGear: EquippedGear;
  skillGems: EquippedSkillGem[];
  allocatedPassives: string[]; // DEPRECATED: Old passive tree system (kept for backwards compat)
  selectedTalents: SelectedTalents; // MoP-style talent choices (tier level -> talent ID)
  portrait: string; // portrait identifier
}

// Equipment slots
export type GearSlot = 
  | 'head' 
  | 'chest' 
  | 'hands' 
  | 'waist' 
  | 'feet' 
  | 'mainHand' 
  | 'offHand' 
  | 'neck' 
  | 'ring1' 
  | 'ring2' 
  | 'trinket1' 
  | 'trinket2';

// What gear a character has equipped
export type EquippedGear = {
  [slot in GearSlot]?: string; // Item ID
};

import type { SkillUsageConfig } from './skillUsage';
import type { SelectedTalents } from './talents';

// A skill gem equipped to a character with its supports
export interface EquippedSkillGem {
  slotIndex: number;
  skillGemId: string;
  supportGemIds: string[]; // Up to 5 support gems
  keybind?: string;
  usageConfig?: SkillUsageConfig; // Player-configurable skill usage conditions
}

// Role-specific bonuses - DEPRECATED
// These are now minimal fallbacks. All real stats come from class definitions.
// Only used when a character has no class assigned (legacy compatibility)
// These should be very small - just enough to make a character functional without a class
export const ROLE_BONUSES: Record<CharacterRole, Partial<BaseStats>> = {
  tank: {
    // Minimal fallback stats for characters without a class
    // Base life is 38, so add just a small amount
    life: 20,
    maxLife: 20,
    armor: 50,
  },
  healer: {
    // Minimal fallback stats for characters without a class
    life: 10,
    maxLife: 10,
    mana: 20,
    maxMana: 20,
  },
  dps: {
    // Minimal fallback stats for characters without a class
    // Should be similar to base stats, not huge bonuses
    life: 10,
    maxLife: 10,
    accuracy: 20,
  }
};

// Path of Exile Armor formula (PoE 0.9.3+): Physical damage reduction = Armor / (Armor + 25 * Damage)
// Returns a multiplier between 0 and 1 representing how much damage GETS THROUGH
// e.g., 0.7 means 70% of damage gets through (30% reduction)
// This formula makes armor more effective against smaller hits and less effective against larger hits
// As enemy damage scales with level, the same armor provides less % reduction at higher levels
export function calculateArmorReduction(armor: number, incomingDamage: number): number {
  if (armor <= 0) return 1.0; // No armor = no reduction (100% damage gets through)
  if (incomingDamage <= 0) return 1.0; // No damage = no calculation needed
  
  // PoE formula: Reduction % = Armor / (Armor + 25 * Damage)
  // Example: armor=2000, damage=500 -> 2000/(2000+12500) = 0.138 = 13.8% reduction
  // So damage multiplier = 1 - 0.138 = 0.862 (86.2% of damage gets through)
  // At low levels with low damage (e.g., 100 damage): 2000/(2000+2500) = 0.444 = 44.4% reduction
  // This shows armor is much more effective against smaller hits
  const reductionPercent = armor / (armor + (25 * incomingDamage));
  
  // Cap reduction at 90% (so at least 10% of damage always gets through)
  const cappedReduction = Math.min(reductionPercent, 0.90);
  
  // Return the damage multiplier (how much damage gets through)
  return 1 - cappedReduction;
}

// Path of Exile Evasion formula: Chance to Hit = Accuracy / (Accuracy + (Evasion/4)^0.8)
// Chance to Evade = 1 - Chance to Hit
// This formula makes evasion more effective at higher values
export function calculateEvasionChance(evasion: number, attackerAccuracy: number): number {
  if (evasion <= 0) return 0;
  if (attackerAccuracy <= 0) return 0.95; // No accuracy = almost always evade
  
  // PoE formula: Chance to Hit = Accuracy / (Accuracy + (Evasion/4)^0.8)
  // Example: evasion=1000, accuracy=500 -> hit = 500 / (500 + (250)^0.8) = 500 / (500 + 89.1) ≈ 85%
  // So evade chance = 1 - 0.85 = 0.15 (15%)
  const evasionFactor = Math.pow(evasion / 4, 0.8);
  const chanceToHit = attackerAccuracy / (attackerAccuracy + evasionFactor);
  const chanceToEvade = 1 - chanceToHit;
  
  // PoE caps: minimum 5% chance to hit, so max 95% evasion
  return Math.min(Math.max(chanceToEvade, 0), 0.95);
}

// Calculate accuracy rating from dexterity (PoE: +2 Accuracy per Dexterity)
export function calculateAccuracyFromDexterity(dexterity: number): number {
  return dexterity * 2;
}

// Calculate life from strength (PoE: +1 Life per 2 Strength)
export function calculateLifeFromStrength(strength: number): number {
  return Math.floor(strength / 2);
}

// Calculate mana from intelligence (PoE: +1 Mana per 2 Intelligence)
export function calculateManaFromIntelligence(intelligence: number): number {
  return Math.floor(intelligence / 2);
}

// Calculate energy shield from intelligence (PoE: +0.2% Energy Shield per Intelligence)
export function calculateEnergyShieldFromIntelligence(intelligence: number, baseEnergyShield: number): number {
  const bonus = baseEnergyShield * (intelligence * 0.002); // 0.2% per intelligence
  return Math.floor(baseEnergyShield + bonus);
}

// Calculate melee physical damage bonus from strength: +1% per 5 Strength
export function calculateMeleeDamageBonus(strength: number): number {
  return strength * 0.002; // 1% per 5 strength = 0.2% per strength
}

// Calculate evasion rating bonus from dexterity: +1% per 5 Dexterity
export function calculateEvasionBonus(dexterity: number, baseEvasion: number): number {
  const bonus = baseEvasion * (dexterity * 0.002); // 1% per 5 dexterity = 0.2% per dexterity
  return Math.floor(baseEvasion + bonus);
}

// PoE Base Life Formula: Base life scales with level
// Level 1: 38 life, +12 per level
export function calculateBaseLifeFromLevel(level: number): number {
  return 38 + (level - 1) * 12;
}

// PoE Base Mana Formula: Base mana scales with level
// Level 1: 34 mana, +6 per level
export function calculateBaseManaFromLevel(level: number): number {
  return 34 + (level - 1) * 6;
}

// PoE Base Accuracy Formula: Base accuracy scales with level
// Level 1: 100 accuracy, +2 per level
export function calculateBaseAccuracyFromLevel(level: number): number {
  return 100 + (level - 1) * 2;
}

// PoE Base Evasion Formula: Base evasion scales with level
// Level 1: 50 evasion, +3 per level
export function calculateBaseEvasionFromLevel(level: number): number {
  return 50 + (level - 1) * 3;
}

// Class bonus level scaling - bonuses scale from 10% at level 1 to 100% at level 100
// This ensures characters grow into their class identity as they level
export function calculateClassBonusMultiplier(level: number): number {
  // Linear scaling: 10% at level 1, 100% at level 100
  // Formula: 0.1 + 0.9 * (level - 1) / 99
  const minMultiplier = 0.10; // 10% at level 1
  const maxMultiplier = 1.00; // 100% at level 100
  const levelProgress = (level - 1) / 99;
  return minMultiplier + (maxMultiplier - minMultiplier) * levelProgress;
}

// Apply scaled class stat modifiers based on character level
// NOTE: Percentage-based stats (block, spell block, spell suppression, resistances, crit chance)
// should NOT be scaled - they are already percentages and should be applied at full value
export function applyScaledClassModifiers(
  baseStats: BaseStats,
  classModifiers: Partial<BaseStats>,
  level: number
): void {
  const multiplier = calculateClassBonusMultiplier(level);
  
  // Stats that should NOT be scaled (they are already percentages or special values)
  const noScaleStats: (keyof BaseStats)[] = [
    'blockChance',
    'spellBlockChance',
    'spellSuppressionChance',
    'fireResistance',
    'coldResistance',
    'lightningResistance',
    'chaosResistance',
    'criticalStrikeChance',
    'criticalStrikeMultiplier',
    'lifeRegeneration',
    'manaRegeneration',
    'energyShieldRechargeRate',
    'energyShieldRechargeDelay',
    'increasedDamage',
  ];
  
  Object.entries(classModifiers).forEach(([key, value]) => {
    if (key in baseStats && value !== undefined) {
      const statKey = key as keyof BaseStats;
      // Apply full value for percentage-based stats, scale others
      if (noScaleStats.includes(statKey)) {
        (baseStats as any)[statKey] += value;
      } else {
        const scaledValue = Math.floor(value * multiplier);
        (baseStats as any)[statKey] += scaledValue;
      }
    }
  });
}

// Create default base stats (PoE style) for level 1
export function createDefaultBaseStats(): BaseStats {
  return {
    // Core Attributes
    strength: 20,
    dexterity: 20,
    intelligence: 20,
    
    // Life and Mana (base values for level 1, will be modified by attributes and level)
    life: 38,        // PoE base life at level 1
    maxLife: 38,
    mana: 34,        // PoE base mana at level 1
    maxMana: 34,
    
    // Offensive Stats
    accuracy: 100,   // Base accuracy at level 1
    
    // Defensive Stats
    armor: 0,        // No base armor (comes from gear)
    evasion: 50,     // Base evasion at level 1
    energyShield: 0, // No base ES (comes from gear/intelligence)
    
    // Regeneration (PoE defaults)
    lifeRegeneration: 0,         // No base life regen (from passives/gear)
    manaRegeneration: 1.75,      // PoE base: 1.75% of max mana per second
    energyShieldRechargeRate: 33.3, // PoE base: 33.3% of max ES per second
    energyShieldRechargeDelay: 2.0, // PoE base: 2 seconds before recharge starts
    
    // Critical Strike
    criticalStrikeChance: 5,      // Base 5%
    criticalStrikeMultiplier: 150, // Base 150%
    
    // Resistances (PoE: start at 0%, must be built up)
    fireResistance: 0,
    coldResistance: 0,
    lightningResistance: 0,
    chaosResistance: 0,   // Chaos resistance can go negative, harder to cap
    
    // Block and Spell Defense
    blockChance: 0,
    spellBlockChance: 0,
    spellSuppressionChance: 0,
    
    // Damage Modifiers
    increasedDamage: 0,
  };
}

// Block calculation - returns true if the attack was blocked (PoE: capped at 75%)
// Blocked attacks deal 30% less damage
export function rollBlock(blockChance: number, blockBuff: number = 0): boolean {
  const totalBlockChance = Math.min(blockChance + blockBuff, 75); // PoE cap: 75%
  return Math.random() * 100 < totalBlockChance;
}

// Spell Block calculation - returns true if the spell was blocked (PoE: capped at 75%)
export function rollSpellBlock(spellBlockChance: number, spellBlockBuff: number = 0): boolean {
  const totalSpellBlockChance = Math.min(spellBlockChance + spellBlockBuff, 75); // PoE cap: 75%
  return Math.random() * 100 < totalSpellBlockChance;
}

// Spell Suppression calculation - returns true if spell damage is suppressed (PoE: capped at 100%)
// Suppressed spells deal 50% less damage
export function rollSpellSuppression(spellSuppressionChance: number): boolean {
  const cappedChance = Math.min(spellSuppressionChance, 100); // PoE cap: 100%
  return Math.random() * 100 < cappedChance;
}

// Block damage reduction (30% of damage blocked)
export const BLOCK_DAMAGE_REDUCTION = 0.30;

// Spell Suppression damage reduction (50% of damage suppressed)
export const SPELL_SUPPRESSION_DAMAGE_REDUCTION = 0.50;

// Calculate elemental resistance reduction (PoE style - capped at 75%)
export function calculateElementalResistance(resistance: number): number {
  // PoE: Resistances are capped at 75% (can be increased with items/passives)
  const cappedResistance = Math.min(resistance, 75);
  return cappedResistance / 100; // Return as multiplier (0.75 = 75% reduction)
}

// Calculate chaos resistance reduction (PoE style - capped at 75%)
export function calculateChaosResistance(resistance: number): number {
  const cappedResistance = Math.min(resistance, 75);
  return cappedResistance / 100;
}

// Calculate damage with resistances and energy shield (PoE style)
// Energy shield protects against ALL damage types - damage hits ES first, then life
export function calculateDamageWithResistances(
  rawDamage: number,
  damageType: 'physical' | 'fire' | 'cold' | 'lightning' | 'chaos' | 'shadow' | 'holy' | 'magic',
  target: { 
    health: number; 
    maxHealth: number; 
    energyShield: number; 
    maxEnergyShield: number;
    fireResistance?: number;
    coldResistance?: number;
    lightningResistance?: number;
    chaosResistance?: number;
  }
): { 
  damageToES: number; 
  damageToLife: number; 
  totalDamage: number;
  esRemaining: number;
  lifeRemaining: number;
} {
  let damageAfterResistance = rawDamage;
  
  // Apply resistance based on damage type (PoE style)
  if (damageType === 'fire') {
    const resistance = calculateElementalResistance(target.fireResistance || 0);
    damageAfterResistance = rawDamage * (1 - resistance);
  } else if (damageType === 'cold') {
    const resistance = calculateElementalResistance(target.coldResistance || 0);
    damageAfterResistance = rawDamage * (1 - resistance);
  } else if (damageType === 'lightning') {
    const resistance = calculateElementalResistance(target.lightningResistance || 0);
    damageAfterResistance = rawDamage * (1 - resistance);
  } else if (damageType === 'chaos') {
    const resistance = calculateChaosResistance(target.chaosResistance || 0);
    damageAfterResistance = rawDamage * (1 - resistance);
  } else if (damageType === 'shadow' || damageType === 'magic') {
    // Shadow/magic damage uses chaos resistance in PoE (or can be treated as chaos)
    const resistance = calculateChaosResistance(target.chaosResistance || 0);
    damageAfterResistance = rawDamage * (1 - resistance);
  }
  // Physical damage doesn't use resistances (uses armor instead, but still hits ES)
  
  // Safety checks: ensure all inputs are valid numbers
  const safeRawDamage = isNaN(rawDamage) || !isFinite(rawDamage) ? 0 : Math.max(0, rawDamage);
  const safeDamageAfterResistance = isNaN(damageAfterResistance) || !isFinite(damageAfterResistance) ? safeRawDamage : Math.max(0, damageAfterResistance);
  const safeHealth = isNaN(target.health) || !isFinite(target.health) ? (target.maxHealth || 0) : target.health;
  const safeMaxHealth = isNaN(target.maxHealth) || !isFinite(target.maxHealth) ? safeHealth : target.maxHealth;
  const safeEnergyShield = isNaN(target.energyShield) || !isFinite(target.energyShield) ? 0 : Math.max(0, target.energyShield);
  
  // Energy shield protects against ALL damage types (PoE mechanic)
  // Damage hits ES first, then life
  const damageToES = Math.min(safeDamageAfterResistance, safeEnergyShield);
  const damageToLife = Math.max(0, safeDamageAfterResistance - safeEnergyShield);
  
  const esRemaining = Math.max(0, safeEnergyShield - damageToES);
  const lifeRemaining = Math.max(0, Math.min(safeMaxHealth, safeHealth - damageToLife));
  
  // Final safety check: ensure no NaN values in return
  return {
    damageToES: isNaN(damageToES) ? 0 : damageToES,
    damageToLife: isNaN(damageToLife) ? 0 : damageToLife,
    totalDamage: isNaN(safeDamageAfterResistance) ? 0 : safeDamageAfterResistance,
    esRemaining: isNaN(esRemaining) ? 0 : esRemaining,
    lifeRemaining: isNaN(lifeRemaining) ? safeMaxHealth : lifeRemaining
  };
}

// Create a new character (PoE style)
// Stats come from class definitions. Role bonuses only used as fallback for legacy characters without a class.
export function createCharacter(name: string, role: CharacterRole, level: number = 1, classId?: CharacterClassId): Character {
  // Override name with class name if classId is provided
  const actualName = classId ? (getClassById(classId)?.name || name) : name;
  const baseStats = createDefaultBaseStats();
  
  // Apply class-specific stat modifiers if a class is selected (primary stat source)
  // Class bonuses scale with level - 10% at level 1, 100% at level 100
  if (classId) {
    const classData = getClassById(classId);
    if (classData && classData.statModifiers) {
      applyScaledClassModifiers(baseStats, classData.statModifiers, level);
    }
  } else {
    // Fallback: Apply minimal role bonuses only if no class is selected (legacy support)
    // These are small enough that we don't need to scale them
    const roleBonus = ROLE_BONUSES[role];
    Object.entries(roleBonus).forEach(([key, value]) => {
      if (key in baseStats && value !== undefined) {
        (baseStats as any)[key] += value;
      }
    });
  }

  // Apply level-based scaling (PoE formulas)
  const levelBonusLife = calculateBaseLifeFromLevel(level) - 38; // Subtract base level 1
  const levelBonusMana = calculateBaseManaFromLevel(level) - 34;
  const levelBonusAccuracy = calculateBaseAccuracyFromLevel(level) - 100;
  const levelBonusEvasion = calculateBaseEvasionFromLevel(level) - 50;
  
  baseStats.life += levelBonusLife;
  baseStats.mana += levelBonusMana;
  baseStats.accuracy += levelBonusAccuracy;
  baseStats.evasion += levelBonusEvasion;

  // Apply PoE attribute bonuses
  // Life from Strength: +1 Life per 2 Strength
  const lifeFromStrength = calculateLifeFromStrength(baseStats.strength);
  baseStats.life += lifeFromStrength;
  baseStats.maxLife = baseStats.life;
  
  // Mana from Intelligence: +1 Mana per 2 Intelligence
  const manaFromIntelligence = calculateManaFromIntelligence(baseStats.intelligence);
  baseStats.mana += manaFromIntelligence;
  baseStats.maxMana = baseStats.mana;
  
  // Accuracy from Dexterity: +2 Accuracy per Dexterity (PoE)
  const accuracyFromDexterity = calculateAccuracyFromDexterity(baseStats.dexterity);
  baseStats.accuracy += accuracyFromDexterity;
  
  // Energy Shield from Intelligence: +1% Maximum Energy Shield per 5 Intelligence
  // Use the class-provided ES as base, not role-based
  const baseES = baseStats.energyShield || 0;
  const esMultiplier = 1 + (baseStats.intelligence * 0.002); // 1% per 5 intelligence = 0.2% per intelligence
  baseStats.energyShield = Math.floor(baseES * esMultiplier);
  
  // Evasion bonus from Dexterity: +1% Evasion Rating per 5 Dexterity
  baseStats.evasion = calculateEvasionBonus(baseStats.dexterity, baseStats.evasion);

  return {
    id: crypto.randomUUID(),
    name: actualName,
    role,
    classId,
    level,
    experience: 0,
    baseStats,
    equippedGear: {},
    skillGems: [],
    allocatedPassives: [], // Deprecated
    selectedTalents: {},   // MoP-style talents
    portrait: `${role}_default`,
  };
}

// Recalculate character stats for a given level (call when leveling up)
export function recalculateStatsForLevel(character: Character): void {
  const level = character.level;
  const role = character.role;
  const classId = character.classId;
  
  // Start with default base stats
  const baseStats = createDefaultBaseStats();
  
  // Apply class-specific stat modifiers if a class is selected (primary stat source)
  // Class bonuses scale with level - 10% at level 1, 100% at level 100
  if (classId) {
    const classData = getClassById(classId);
    if (classData && classData.statModifiers) {
      applyScaledClassModifiers(baseStats, classData.statModifiers, level);
    }
  } else {
    // Fallback: Apply minimal role bonuses only if no class is selected (legacy support)
    // These are small enough that we don't need to scale them
    const roleBonus = ROLE_BONUSES[role];
    Object.entries(roleBonus).forEach(([key, value]) => {
      if (key in baseStats && value !== undefined) {
        (baseStats as any)[key] += value;
      }
    });
  }
  
  // Apply level-based scaling
  const levelBonusLife = calculateBaseLifeFromLevel(level) - 38;
  const levelBonusMana = calculateBaseManaFromLevel(level) - 34;
  const levelBonusAccuracy = calculateBaseAccuracyFromLevel(level) - 100;
  const levelBonusEvasion = calculateBaseEvasionFromLevel(level) - 50;
  
  baseStats.life += levelBonusLife;
  baseStats.mana += levelBonusMana;
  baseStats.accuracy += levelBonusAccuracy;
  baseStats.evasion += levelBonusEvasion;
  
  // Apply attribute bonuses
  baseStats.life += calculateLifeFromStrength(baseStats.strength);
  baseStats.maxLife = baseStats.life;
  baseStats.mana += calculateManaFromIntelligence(baseStats.intelligence);
  baseStats.maxMana = baseStats.mana;
  baseStats.accuracy += calculateAccuracyFromDexterity(baseStats.dexterity);
  
  // Energy Shield from Intelligence: +1% Maximum Energy Shield per 5 Intelligence
  const baseES = baseStats.energyShield || 0;
  baseStats.energyShield = Math.floor(baseES * (1 + baseStats.intelligence * 0.002)); // 1% per 5 intelligence = 0.2% per intelligence
  // Evasion bonus from Dexterity: +1% Evasion Rating per 5 Dexterity
  baseStats.evasion = calculateEvasionBonus(baseStats.dexterity, baseStats.evasion);
  
  // Update the character
  character.baseStats = baseStats;
}

