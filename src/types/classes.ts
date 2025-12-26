import type { CharacterRole, BaseStats } from './character';
import React from 'react';
import { 
  GiShieldBash, GiHealthPotion, GiBroadsword,
  // Tank class icons
  GiCheckedShield, GiMagicShield, GiCrossedSwords, GiSwordClash, GiCloakDagger, GiGhost, 
  GiMagicSwirl, GiVortex, GiPortal,
  // Healer class icons  
  GiAngelWings, GiDrop, GiBookmark, GiOakLeaf, GiHeartPlus, GiPentacle,
  GiShield, GiSkullCrossedBones, GiChessRook,
} from 'react-icons/gi';

// Class IDs for all 18 classes
export type TankClassId = 
  | 'bastion_knight'
  | 'wardbreaker'
  | 'iron_skirmisher'
  | 'duel_warden'
  | 'shadow_warden'
  | 'ghostblade'
  | 'arcane_bulwark'
  | 'null_templar'
  | 'phase_guardian';

export type HealerClassId =
  | 'high_cleric'
  | 'blood_confessor'
  | 'tactician'
  | 'grove_healer'
  | 'vitalist'
  | 'ritual_warden'
  | 'aegis_keeper'
  | 'martyr'
  | 'bastion_strategist';

export type CharacterClassId = TankClassId | HealerClassId;

// Defense pool types
export type DefensePool = 'armor' | 'evasion' | 'energyShield';

// Mitigation types
export type MitigationType = 'block' | 'spellBlock' | 'spellSuppression' | 'dodge';

// Resource types for healers
export type ResourceType = 'mana' | 'life' | 'cooldowns';

// Healing style for healers
export type HealingStyle = 'casted' | 'hot' | 'shields' | 'damageReduction';

// Class definition
export interface CharacterClass {
  id: CharacterClassId;
  name: string;
  role: CharacterRole;
  description: string;
  fantasy: string;
  
  // Visual theming
  theme: string;
  primaryColor: string;
  secondaryColor: string;
  icon: React.ReactNode;
  
  // Tank-specific
  defensePool?: DefensePool;
  mitigationTypes?: MitigationType[];
  
  // Healer-specific
  healingStyle?: HealingStyle;
  resourceType?: ResourceType;
  
  // Key stats that define this class
  keyStats: string[];
  
  // Playstyle description
  playstyle: string;
  
  // Base stat modifiers (added to role bonuses)
  statModifiers: Partial<BaseStats>;
}

// ==================== TANK CLASSES ====================

const BASTION_KNIGHT: CharacterClass = {
  id: 'bastion_knight',
  name: 'Bastion Knight',
  role: 'tank',
  description: 'A heavily armored shieldbearer who stands immovable against enemy assaults.',
  fantasy: 'The archetypal frontline defender, built to endure relentless pressure.',
  theme: 'Discipline, Fortification',
  primaryColor: '#8B8B8B', // Steel Gray
  secondaryColor: '#FFD700', // Gold
  icon: React.createElement(GiCheckedShield),
  defensePool: 'armor',
  mitigationTypes: ['block', 'spellBlock'],
  keyStats: ['Armor', 'Block Chance', 'Spell Block', 'Maximum Life'],
  playstyle: 'Low variance and highly reliable. Ideal for players who prefer stability and control.',
  statModifiers: {
    // Attributes - bonuses on top of base 20
    strength: 50,
    dexterity: 10,
    intelligence: 5,
    // Defenses - Heavy armor + block focus
    life: 600,
    maxLife: 600,
    armor: 1500,
    evasion: 100,
    blockChance: 35,
    spellBlockChance: 25,
    // Regeneration
    lifeRegeneration: 1.0,
    manaRegeneration: 1.5,
    // Offense
    accuracy: 200,
    // Resistances
    fireResistance: 10,
    coldResistance: 10,
    lightningResistance: 10,
  }
};

const WARDBREAKER: CharacterClass = {
  id: 'wardbreaker',
  name: 'Wardbreaker',
  role: 'tank',
  description: 'An anti-magic vanguard trained to march through spellfire.',
  fantasy: 'Specializes in neutralizing magical threats while maintaining heavy protection.',
  theme: 'Anti-Magic, Warding',
  primaryColor: '#3D3D3D', // Dark Iron
  secondaryColor: '#6495ED', // Arcane Blue
  icon: React.createElement(GiMagicShield),
  defensePool: 'armor',
  mitigationTypes: ['spellSuppression'],
  keyStats: ['Armor', 'Spell Suppression', 'Elemental Resistances', 'Life'],
  playstyle: 'Excellent against caster-heavy encounters. Predictable but requires awareness of magic pressure.',
  statModifiers: {
    // Attributes
    strength: 40,
    dexterity: 10,
    intelligence: 20,
    // Defenses - Armor + spell suppression focus
    life: 500,
    maxLife: 500,
    armor: 1200,
    evasion: 100,
    blockChance: 15,
    spellBlockChance: 10,
    spellSuppressionChance: 45,
    // Regeneration
    lifeRegeneration: 0.8,
    manaRegeneration: 2.0,
    // Offense
    accuracy: 200,
    // Resistances - Higher elemental resistances
    fireResistance: 20,
    coldResistance: 20,
    lightningResistance: 20,
    chaosResistance: 5,
  }
};

const IRON_SKIRMISHER: CharacterClass = {
  id: 'iron_skirmisher',
  name: 'Iron Skirmisher',
  role: 'tank',
  description: 'A mobile armored fighter who relies on timing and movement.',
  fantasy: 'Dodges major telegraphed hits while armor smooths damage that gets through.',
  theme: 'Mobility, Tactical Combat',
  primaryColor: '#CD7F32', // Burnished Bronze
  secondaryColor: '#DC143C', // Crimson
  icon: React.createElement(GiCrossedSwords),
  defensePool: 'armor',
  mitigationTypes: ['dodge'],
  keyStats: ['Armor', 'Dodge Chance', 'Movement Speed', 'Life'],
  playstyle: 'Active and movement-focused. Rewards mechanical skill and situational awareness.',
  statModifiers: {
    // Attributes - Balanced str/dex
    strength: 30,
    dexterity: 35,
    intelligence: 5,
    // Defenses - Armor + evasion hybrid
    life: 450,
    maxLife: 450,
    armor: 1000,
    evasion: 400,
    blockChance: 10,
    spellBlockChance: 5,
    spellSuppressionChance: 10,
    // Regeneration
    lifeRegeneration: 0.6,
    manaRegeneration: 1.5,
    // Offense - More offensive
    accuracy: 250,
    criticalStrikeChance: 2,
    criticalStrikeMultiplier: 10,
    // Resistances
    fireResistance: 5,
    coldResistance: 5,
    lightningResistance: 5,
  }
};

const DUEL_WARDEN: CharacterClass = {
  id: 'duel_warden',
  name: 'Duel Warden',
  role: 'tank',
  description: 'A master duelist who parries and deflects attacks with precision.',
  fantasy: 'Attacks often miss due to evasion, while blocks handle the rest.',
  theme: 'Precision, Parry',
  primaryColor: '#C0C0C0', // Silver
  secondaryColor: '#50C878', // Emerald
  icon: React.createElement(GiSwordClash),
  defensePool: 'evasion',
  mitigationTypes: ['block', 'spellBlock'],
  keyStats: ['Evasion', 'Block Chance', 'Accuracy Reduction', 'Life'],
  playstyle: 'Strong against fast melee enemies. Weaker against heavy spell damage.',
  statModifiers: {
    // Attributes - High dex
    strength: 15,
    dexterity: 50,
    intelligence: 5,
    // Defenses - Evasion + block focus
    life: 400,
    maxLife: 400,
    armor: 400,
    evasion: 800,
    blockChance: 30,
    spellBlockChance: 15,
    // Regeneration
    lifeRegeneration: 0.6,
    manaRegeneration: 1.5,
    // Offense
    accuracy: 300,
    criticalStrikeChance: 3,
    criticalStrikeMultiplier: 15,
    // Resistances - Lower
    fireResistance: 3,
    coldResistance: 3,
    lightningResistance: 3,
  }
};

const SHADOW_WARDEN: CharacterClass = {
  id: 'shadow_warden',
  name: 'Shadow Warden',
  role: 'tank',
  description: 'A shadow-cloaked protector who dismantles enemy accuracy and magic alike.',
  fantasy: 'Evasion causes many attacks to miss, while spell suppression smooths spell damage.',
  theme: 'Stealth, Control',
  primaryColor: '#191970', // Midnight Black
  secondaryColor: '#008080', // Muted Teal
  icon: React.createElement(GiCloakDagger),
  defensePool: 'evasion',
  mitigationTypes: ['spellSuppression'],
  keyStats: ['Evasion', 'Spell Suppression', 'Blind/Hinder Effects', 'Life'],
  playstyle: 'Consistent and controlled for an evasion tank. Excels in mixed-damage encounters.',
  statModifiers: {
    // Attributes - Dex/Int hybrid
    strength: 5,
    dexterity: 40,
    intelligence: 25,
    // Defenses - Evasion + spell suppression
    life: 350,
    maxLife: 350,
    armor: 300,
    evasion: 700,
    energyShield: 100,
    blockChance: 5,
    spellBlockChance: 5,
    spellSuppressionChance: 40,
    // Regeneration
    lifeRegeneration: 0.5,
    manaRegeneration: 2.0,
    // Offense
    accuracy: 250,
    criticalStrikeChance: 2,
    // Resistances - Chaos focus
    fireResistance: 5,
    coldResistance: 5,
    lightningResistance: 5,
    chaosResistance: 20,
  }
};

const GHOSTBLADE: CharacterClass = {
  id: 'ghostblade',
  name: 'Ghostblade',
  role: 'tank',
  description: 'An elusive phantom who avoids nearly all incoming damage through sheer agility.',
  fantasy: 'Relies almost entirely on avoidance. Extremely low damage taken until something connects.',
  theme: 'Evasion, Phantom Movement',
  primaryColor: '#9370DB', // Pale Violet
  secondaryColor: '#696969', // Smoke Gray
  icon: React.createElement(GiGhost),
  defensePool: 'evasion',
  mitigationTypes: ['dodge'],
  keyStats: ['Evasion', 'Dodge Chance', 'Movement Speed', 'Life'],
  playstyle: 'High skill ceiling and high risk. Rewards mastery of movement and mechanics.',
  statModifiers: {
    // Attributes - Pure dex
    strength: 0,
    dexterity: 60,
    intelligence: 5,
    // Defenses - Maximum evasion, low life
    life: 200,
    maxLife: 200,
    armor: 100,
    evasion: 1200,
    blockChance: 3,
    spellBlockChance: 3,
    spellSuppressionChance: 15,
    // Regeneration
    lifeRegeneration: 0.3,
    manaRegeneration: 1.5,
    // Offense - High crit
    accuracy: 350,
    criticalStrikeChance: 5,
    criticalStrikeMultiplier: 25,
  }
};

const ARCANE_BULWARK: CharacterClass = {
  id: 'arcane_bulwark',
  name: 'Arcane Bulwark',
  role: 'tank',
  description: 'An arcane sentinel protected by layered magical barriers.',
  fantasy: 'Blocks preserve Energy Shield, allowing it to recharge between hits.',
  theme: 'Arcane Defense, Stability',
  primaryColor: '#4169E1', // Royal Blue
  secondaryColor: '#FFFFFF', // White
  icon: React.createElement(GiMagicSwirl),
  defensePool: 'energyShield',
  mitigationTypes: ['block', 'spellBlock'],
  keyStats: ['Energy Shield', 'Block Chance', 'Spell Block', 'ES Recharge Rate'],
  playstyle: 'Deliberate and methodical. Strong in sustained encounters.',
  statModifiers: {
    // Attributes - Int/Str hybrid
    strength: 25,
    dexterity: 5,
    intelligence: 45,
    // Defenses - ES + block focus
    life: 150,
    maxLife: 150,
    armor: 300,
    evasion: 50,
    energyShield: 600,
    blockChance: 30,
    spellBlockChance: 35,
    // Regeneration
    lifeRegeneration: 0.3,
    manaRegeneration: 2.5,
    energyShieldRechargeRate: 8,
    energyShieldRechargeDelay: -0.3,
    // Offense
    accuracy: 150,
    // Resistances
    fireResistance: 8,
    coldResistance: 8,
    lightningResistance: 8,
  }
};

const NULL_TEMPLAR: CharacterClass = {
  id: 'null_templar',
  name: 'Null Templar',
  role: 'tank',
  description: 'A void-aligned defender who dampens magical energy at its source.',
  fantasy: 'Spell suppression reduces incoming magic damage, keeping Energy Shield stable.',
  theme: 'Void, Suppression',
  primaryColor: '#800080', // Void Purple
  secondaryColor: '#808080', // Ash Gray
  icon: React.createElement(GiVortex),
  defensePool: 'energyShield',
  mitigationTypes: ['spellSuppression'],
  keyStats: ['Energy Shield', 'Spell Suppression', 'Chaos Resistance', 'ES Recharge'],
  playstyle: 'Excels in magic-heavy content. Weak to physical burst damage.',
  statModifiers: {
    // Attributes - Pure int
    strength: 5,
    dexterity: 15,
    intelligence: 50,
    // Defenses - ES + spell suppression
    life: 100,
    maxLife: 100,
    armor: 200,
    evasion: 200,
    energyShield: 550,
    blockChance: 10,
    spellBlockChance: 15,
    spellSuppressionChance: 55,
    // Regeneration
    lifeRegeneration: 0.2,
    manaRegeneration: 3.0,
    energyShieldRechargeRate: 12,
    energyShieldRechargeDelay: -0.5,
    // Offense
    accuracy: 150,
    criticalStrikeChance: 1,
    // Resistances - High chaos res
    fireResistance: 10,
    coldResistance: 10,
    lightningResistance: 10,
    chaosResistance: 30,
  }
};

const PHASE_GUARDIAN: CharacterClass = {
  id: 'phase_guardian',
  name: 'Phase Guardian',
  role: 'tank',
  description: 'A reality-phasing defender who slips between blows.',
  fantasy: 'Dodging avoids hits and preserves Energy Shield recharge windows.',
  theme: 'Phasing, Temporal Defense',
  primaryColor: '#00FFFF', // Cyan
  secondaryColor: '#E6E6FA', // Soft Lavender
  icon: React.createElement(GiPortal),
  defensePool: 'energyShield',
  mitigationTypes: ['dodge'],
  keyStats: ['Energy Shield', 'Dodge Chance', 'Cooldown Recovery', 'ES Recharge Delay Reduction'],
  playstyle: 'Timing-based and mobile. Punished by sustained unavoidable damage.',
  statModifiers: {
    // Attributes - Int/Dex hybrid
    strength: 0,
    dexterity: 35,
    intelligence: 35,
    // Defenses - ES + evasion hybrid
    life: 100,
    maxLife: 100,
    armor: 100,
    evasion: 700,
    energyShield: 450,
    blockChance: 5,
    spellBlockChance: 10,
    spellSuppressionChance: 20,
    // Regeneration
    lifeRegeneration: 0.2,
    manaRegeneration: 2.5,
    energyShieldRechargeRate: 15,
    energyShieldRechargeDelay: -0.7,
    // Offense
    accuracy: 200,
    criticalStrikeChance: 2,
    // Resistances
    fireResistance: 3,
    coldResistance: 3,
    lightningResistance: 3,
    chaosResistance: 8,
  }
};

// ==================== HEALER CLASSES ====================

const HIGH_CLERIC: CharacterClass = {
  id: 'high_cleric',
  name: 'High Cleric',
  role: 'healer',
  description: 'A devoted healer who channels restorative magic with discipline and precision.',
  fantasy: 'Reactive single-target and small-area heals used after damage occurs.',
  theme: 'Faith, Restoration',
  primaryColor: '#FFFFF0', // Ivory White
  secondaryColor: '#FFD700', // Gold
  icon: React.createElement(GiAngelWings),
  healingStyle: 'casted',
  resourceType: 'mana',
  keyStats: ['Mana', 'Mana Regeneration', 'Cast Speed', 'Healing Effectiveness'],
  playstyle: 'Straightforward and reliable. Ideal for new healers.',
  statModifiers: {
    // Attributes - Balanced caster
    strength: 5,
    dexterity: 15,
    intelligence: 45,
    // Defenses - Balanced healer
    life: 250,
    maxLife: 250,
    mana: 200,
    maxMana: 200,
    armor: 200,
    evasion: 250,
    energyShield: 150,
    blockChance: 3,
    spellBlockChance: 8,
    spellSuppressionChance: 15,
    // Regeneration - High mana regen
    lifeRegeneration: 0.3,
    manaRegeneration: 3.5,
    // Offense
    accuracy: 100,
    criticalStrikeChance: 2,
    // Resistances
    fireResistance: 10,
    coldResistance: 10,
    lightningResistance: 10,
  }
};

const BLOOD_CONFESSOR: CharacterClass = {
  id: 'blood_confessor',
  name: 'Blood Confessor',
  role: 'healer',
  description: 'A flagellant healer who sacrifices their own vitality to mend others.',
  fantasy: 'Healing spells cost life instead of mana, shifting survivability onto the healer.',
  theme: 'Sacrifice, Penance',
  primaryColor: '#8B0000', // Deep Red
  secondaryColor: '#36454F', // Charcoal
  icon: React.createElement(GiDrop),
  healingStyle: 'casted',
  resourceType: 'life',
  keyStats: ['Maximum Life', 'Life Recoup', 'Damage Reduction'],
  playstyle: 'High risk and high responsibility. Rewards awareness and restraint.',
  statModifiers: {
    // Attributes - Str/Int for life and casting
    strength: 30,
    dexterity: 5,
    intelligence: 35,
    // Defenses - High life, low mana
    life: 450,
    maxLife: 450,
    mana: 50,
    maxMana: 50,
    armor: 350,
    evasion: 200,
    energyShield: 50,
    blockChance: 8,
    spellBlockChance: 8,
    spellSuppressionChance: 10,
    // Regeneration - High life regen
    lifeRegeneration: 2.0,
    manaRegeneration: 1.5,
    // Offense
    accuracy: 100,
    criticalStrikeChance: 1,
    // Resistances
    fireResistance: 15,
    coldResistance: 8,
    lightningResistance: 8,
    chaosResistance: 12,
  }
};

const TACTICIAN: CharacterClass = {
  id: 'tactician',
  name: 'Tactician',
  role: 'healer',
  description: 'A battlefield coordinator who heals at precise, decisive moments.',
  fantasy: 'Limited but powerful heals governed by cooldowns and charges.',
  theme: 'Order, Control',
  primaryColor: '#708090', // Slate Blue
  secondaryColor: '#B8860B', // Brass
  icon: React.createElement(GiBookmark),
  healingStyle: 'casted',
  resourceType: 'cooldowns',
  keyStats: ['Cooldown Recovery', 'Charges', 'Cast Speed'],
  playstyle: 'Planning-focused. Punishes panic casting.',
  statModifiers: {
    // Attributes - Balanced
    strength: 15,
    dexterity: 15,
    intelligence: 35,
    // Defenses - Balanced, moderate
    life: 300,
    maxLife: 300,
    mana: 150,
    maxMana: 150,
    armor: 250,
    evasion: 250,
    energyShield: 100,
    blockChance: 8,
    spellBlockChance: 12,
    spellSuppressionChance: 15,
    // Regeneration
    lifeRegeneration: 0.5,
    manaRegeneration: 2.5,
    // Offense
    accuracy: 150,
    criticalStrikeChance: 2,
    // Resistances
    fireResistance: 10,
    coldResistance: 10,
    lightningResistance: 10,
    chaosResistance: 3,
  }
};

const GROVE_HEALER: CharacterClass = {
  id: 'grove_healer',
  name: 'Grove Healer',
  role: 'healer',
  description: 'A nature-bound caretaker who sustains allies through steady regeneration.',
  fantasy: 'Applies HoTs proactively to smooth incoming damage.',
  theme: 'Nature, Renewal',
  primaryColor: '#228B22', // Leaf Green
  secondaryColor: '#8B4513', // Warm Brown
  icon: React.createElement(GiOakLeaf),
  healingStyle: 'hot',
  resourceType: 'mana',
  keyStats: ['Mana Regeneration', 'Duration', 'HoT Effectiveness'],
  playstyle: 'Calm and predictive. Weak to sudden burst damage.',
  statModifiers: {
    // Attributes - Int/Dex nature hybrid
    strength: 5,
    dexterity: 25,
    intelligence: 40,
    // Defenses - Evasion focus
    life: 200,
    maxLife: 200,
    mana: 180,
    maxMana: 180,
    armor: 150,
    evasion: 400,
    energyShield: 80,
    spellBlockChance: 3,
    spellSuppressionChance: 18,
    // Regeneration - High mana regen for sustained HoTs
    lifeRegeneration: 0.6,
    manaRegeneration: 4.5,
    // Offense
    accuracy: 150,
    // Resistances - Nature themed
    fireResistance: 8,
    coldResistance: 8,
    lightningResistance: 8,
    chaosResistance: 8,
  }
};

const VITALIST: CharacterClass = {
  id: 'vitalist',
  name: 'Vitalist',
  role: 'healer',
  description: 'A healer who channels raw vitality to keep allies continually restored.',
  fantasy: 'HoTs cost life, requiring careful self-management.',
  theme: 'Vital Force, Endurance',
  primaryColor: '#DC143C', // Crimson
  secondaryColor: '#FFB6C1', // Soft Pink
  icon: React.createElement(GiHeartPlus),
  healingStyle: 'hot',
  resourceType: 'life',
  keyStats: ['Life', 'Regeneration', 'Recoup'],
  playstyle: 'Strong during sustained combat. Vulnerable during downtime.',
  statModifiers: {
    // Attributes - Str/Int for life and spells
    strength: 35,
    dexterity: 10,
    intelligence: 25,
    // Defenses - High life, low mana
    life: 400,
    maxLife: 400,
    mana: 80,
    maxMana: 80,
    armor: 250,
    evasion: 200,
    energyShield: 30,
    blockChance: 3,
    spellBlockChance: 3,
    spellSuppressionChance: 8,
    // Regeneration - Very high life regen
    lifeRegeneration: 2.5,
    manaRegeneration: 2.0,
    // Offense
    accuracy: 100,
    // Resistances
    fireResistance: 10,
    coldResistance: 10,
    lightningResistance: 10,
    chaosResistance: 8,
  }
};

const RITUAL_WARDEN: CharacterClass = {
  id: 'ritual_warden',
  name: 'Ritual Warden',
  role: 'healer',
  description: 'A ritualist who prepares healing circles before damage occurs.',
  fantasy: 'Places long-duration healing effects in advance.',
  theme: 'Ceremony, Preparation',
  primaryColor: '#4B0082', // Indigo
  secondaryColor: '#FFFAF0', // Bone White
  icon: React.createElement(GiPentacle),
  healingStyle: 'hot',
  resourceType: 'cooldowns',
  keyStats: ['Cooldown Recovery', 'Duration', 'Area Scaling'],
  playstyle: 'Rewards route knowledge and pre-planning.',
  statModifiers: {
    // Attributes - Int focus
    strength: 5,
    dexterity: 15,
    intelligence: 45,
    // Defenses - ES hybrid
    life: 200,
    maxLife: 200,
    mana: 150,
    maxMana: 150,
    armor: 150,
    evasion: 250,
    energyShield: 180,
    blockChance: 3,
    spellBlockChance: 12,
    spellSuppressionChance: 18,
    // Regeneration
    lifeRegeneration: 0.5,
    manaRegeneration: 3.0,
    energyShieldRechargeRate: 5,
    // Offense
    accuracy: 100,
    criticalStrikeChance: 1,
    // Resistances
    fireResistance: 8,
    coldResistance: 8,
    lightningResistance: 8,
    chaosResistance: 12,
  }
};

const AEGIS_KEEPER: CharacterClass = {
  id: 'aegis_keeper',
  name: 'Aegis Keeper',
  role: 'healer',
  description: 'A protective warder who prevents harm before it happens.',
  fantasy: 'Applies absorb shields to negate incoming burst damage.',
  theme: 'Protection, Warding',
  primaryColor: '#87CEEB', // Sky Blue
  secondaryColor: '#C0C0C0', // Silver
  icon: React.createElement(GiShield),
  healingStyle: 'shields',
  resourceType: 'mana',
  keyStats: ['Mana', 'Shield Strength', 'Shield Duration'],
  playstyle: 'Preventive and deliberate. Weak to sustained damage.',
  statModifiers: {
    // Attributes - Int focus with some str
    strength: 12,
    dexterity: 12,
    intelligence: 45,
    // Defenses - ES focus, protective
    life: 200,
    maxLife: 200,
    mana: 200,
    maxMana: 200,
    armor: 220,
    evasion: 180,
    energyShield: 250,
    blockChance: 12,
    spellBlockChance: 16,
    spellSuppressionChance: 12,
    // Regeneration
    lifeRegeneration: 0.3,
    manaRegeneration: 3.5,
    energyShieldRechargeRate: 8,
    // Offense
    accuracy: 100,
    // Resistances
    fireResistance: 10,
    coldResistance: 10,
    lightningResistance: 10,
    chaosResistance: 3,
  }
};

const MARTYR: CharacterClass = {
  id: 'martyr',
  name: 'Martyr',
  role: 'healer',
  description: 'A self-sacrificing protector who takes pain meant for others.',
  fantasy: 'Redirects damage from allies to themselves.',
  theme: 'Self-Sacrifice, Resolve',
  primaryColor: '#8B0000', // Dark Red
  secondaryColor: '#FAF0E6', // Off-White
  icon: React.createElement(GiSkullCrossedBones),
  healingStyle: 'shields',
  resourceType: 'life',
  keyStats: ['Life', 'Damage Redirection', 'Recoup'],
  playstyle: 'Very high difficulty. Demands positioning and awareness.',
  statModifiers: {
    // Attributes - Str/Int tanky healer
    strength: 40,
    dexterity: 5,
    intelligence: 25,
    // Defenses - Very high life, tanky for a healer
    life: 500,
    maxLife: 500,
    mana: 50,
    maxMana: 50,
    armor: 450,
    evasion: 100,
    energyShield: 50,
    blockChance: 15,
    spellBlockChance: 12,
    spellSuppressionChance: 8,
    // Regeneration - High life regen
    lifeRegeneration: 1.8,
    manaRegeneration: 1.5,
    // Offense
    accuracy: 150,
    // Resistances - Needs resistances to tank
    fireResistance: 15,
    coldResistance: 15,
    lightningResistance: 15,
    chaosResistance: 8,
  }
};

const BASTION_STRATEGIST: CharacterClass = {
  id: 'bastion_strategist',
  name: 'Bastion Strategist',
  role: 'healer',
  description: 'A tactical mastermind who schedules survivability windows.',
  fantasy: 'Rotates powerful damage-reduction effects instead of raw healing.',
  theme: 'Command, Mitigation',
  primaryColor: '#000080', // Navy Blue
  secondaryColor: '#708090', // Iron Gray
  icon: React.createElement(GiChessRook),
  healingStyle: 'damageReduction',
  resourceType: 'cooldowns',
  keyStats: ['Cooldown Recovery', 'Charges', 'Damage Reduction'],
  playstyle: 'Extremely strong in coordinated groups. Punishes poor timing.',
  statModifiers: {
    // Attributes - Balanced commander
    strength: 20,
    dexterity: 15,
    intelligence: 30,
    // Defenses - Balanced, moderate tankiness
    life: 350,
    maxLife: 350,
    mana: 150,
    maxMana: 150,
    armor: 350,
    evasion: 200,
    energyShield: 120,
    blockChance: 12,
    spellBlockChance: 12,
    spellSuppressionChance: 15,
    // Regeneration
    lifeRegeneration: 0.7,
    manaRegeneration: 2.8,
    // Offense
    accuracy: 150,
    criticalStrikeChance: 1,
    // Resistances - Balanced
    fireResistance: 10,
    coldResistance: 10,
    lightningResistance: 10,
    chaosResistance: 3,
  }
};

// ==================== CLASS REGISTRY ====================

export const TANK_CLASSES: CharacterClass[] = [
  BASTION_KNIGHT,
  WARDBREAKER,
  IRON_SKIRMISHER,
  DUEL_WARDEN,
  SHADOW_WARDEN,
  GHOSTBLADE,
  ARCANE_BULWARK,
  NULL_TEMPLAR,
  PHASE_GUARDIAN,
];

export const HEALER_CLASSES: CharacterClass[] = [
  HIGH_CLERIC,
  BLOOD_CONFESSOR,
  TACTICIAN,
  GROVE_HEALER,
  VITALIST,
  RITUAL_WARDEN,
  AEGIS_KEEPER,
  MARTYR,
  BASTION_STRATEGIST,
];

export const ALL_CLASSES: CharacterClass[] = [
  ...TANK_CLASSES,
  ...HEALER_CLASSES,
];

// Helper functions
export function getClassById(classId: CharacterClassId): CharacterClass | undefined {
  return ALL_CLASSES.find(c => c.id === classId);
}

export function getClassesForRole(role: CharacterRole): CharacterClass[] {
  if (role === 'tank') return TANK_CLASSES;
  if (role === 'healer') return HEALER_CLASSES;
  return []; // No DPS classes yet
}

export function getClassColor(classId: CharacterClassId): { primary: string; secondary: string } {
  const cls = getClassById(classId);
  return cls 
    ? { primary: cls.primaryColor, secondary: cls.secondaryColor }
    : { primary: '#888888', secondary: '#444444' };
}

// Import all background images (used for both backgrounds and portraits)
import aegiskeeperBg from '../assets/backgrounds/aegiskeeper.png';
import arcanebulwarkBg from '../assets/backgrounds/arcanebulwark.png';
import bastionknightBg from '../assets/backgrounds/bastionknight.png';
import bastionstrategistBg from '../assets/backgrounds/bastionstrategist.png';
import bloodconfessorBg from '../assets/backgrounds/bloodconfessor.png';
import duelwardenBg from '../assets/backgrounds/duelwarden.png';
import ghostbladeBg from '../assets/backgrounds/ghostblade.png';
import grovehealerBg from '../assets/backgrounds/grovehealer.png';
import highclericBg from '../assets/backgrounds/highcleric.png';
import ironskirmisherBg from '../assets/backgrounds/ironskirmisher.png';
import martyrBg from '../assets/backgrounds/martyr.png';
import nulltemplarBg from '../assets/backgrounds/nulltemplar.png';
import phaseguardianBg from '../assets/backgrounds/phaseguardian.png';
import ritualwardenBg from '../assets/backgrounds/ritualwarden.png';
import shadowwardenBg from '../assets/backgrounds/shadowwarden.png';
import tacticianBg from '../assets/backgrounds/tactician.png';
import vitalistBg from '../assets/backgrounds/vitalist.png';
import wardbreakerBg from '../assets/backgrounds/wardbreaker.png';
import defaultdpsBg from '../assets/backgrounds/defaultdps.png';

// Map classIds to imported background images
const CLASS_IMAGE_MAP: Record<string, string> = {
  'aegis_keeper': aegiskeeperBg,
  'arcane_bulwark': arcanebulwarkBg,
  'bastion_knight': bastionknightBg,
  'bastion_strategist': bastionstrategistBg,
  'blood_confessor': bloodconfessorBg,
  'duel_warden': duelwardenBg,
  'ghostblade': ghostbladeBg,
  'grove_healer': grovehealerBg,
  'high_cleric': highclericBg,
  'iron_skirmisher': ironskirmisherBg,
  'martyr': martyrBg,
  'null_templar': nulltemplarBg,
  'phase_guardian': phaseguardianBg,
  'ritual_warden': ritualwardenBg,
  'shadow_warden': shadowwardenBg,
  'tactician': tacticianBg,
  'vitalist': vitalistBg,
  'wardbreaker': wardbreakerBg,
};

// Get the class image (used for both portrait and background, styled differently via CSS)
export function getClassPortrait(classId: CharacterClassId): string | null {
  return CLASS_IMAGE_MAP[classId] || null;
}

// Get the class background image (same as portrait, different styling)
export function getClassBackground(classId: CharacterClassId): string | null {
  return CLASS_IMAGE_MAP[classId] || null;
}

// Get the default DPS portrait for characters without a class
export function getDefaultDpsPortrait(): string {
  return defaultdpsBg;
}

// Role icons - consistent across the app
export const ROLE_ICONS: Record<CharacterRole, React.ReactNode> = {
  tank: React.createElement(GiShieldBash),
  healer: React.createElement(GiHealthPotion),
  dps: React.createElement(GiBroadsword),
};

// Get role icon
export function getRoleIcon(role: CharacterRole): React.ReactNode {
  return ROLE_ICONS[role];
}
