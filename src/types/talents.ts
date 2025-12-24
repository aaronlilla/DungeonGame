import type { CharacterClassId } from './classes';
import type { BaseStats } from './character';

// Talent tier levels - 6 rows unlocking as you level
export const TALENT_TIER_LEVELS = [10, 25, 40, 55, 70, 85] as const;
export type TalentTierLevel = typeof TALENT_TIER_LEVELS[number];

// Talent effect types
export type TalentEffectType =
  | 'statBonus' | 'statMultiplier' | 'damageIncrease' | 'damageReduction'
  | 'critBonus' | 'healingIncrease' | 'healingReceived' | 'hotEffectiveness'
  | 'blockBonus' | 'armorBonus' | 'resistanceBonus' | 'shieldBonus'
  | 'manaReduction' | 'manaRegen' | 'cooldownReduction' | 'lifesteal'
  | 'thorns' | 'aoeBonus' | 'castSpeed' | 'moveSpeed'
  | 'onHitEffect' | 'onHealEffect' | 'onBlockEffect' | 'onLowHealth'
  | 'onFullHealth' | 'grantAbility' | 'modifyAbility' | 'conditional'
  | 'blockEffectiveness' | 'bigHitReduction' | 'critImmunity' | 'allyProtection'
  | 'damageRedirect' | 'maxHitCap' | 'lifeOnBlock'
  // Iron Skirmisher specific effect types
  | 'evasionBonus' | 'enemyAttackSpeed' | 'enemyAccuracy' | 'attackDamageReduction'
  | 'armorEffectiveness' | 'physicalDamageReductionFromArmor' | 'evasionToMitigation'
  | 'selfDamageReduction'
  // Duel Warden specific effect types
  | 'onEvadeEffect' | 'onMissEffect' | 'blockToSpellBlock' | 'nonBlockedDamageReduction'
  | 'spellBlockBonus'
  // Shadow Warden specific effect types
  | 'spellSuppressionChance' | 'spellSuppressionEffect' | 'evadeChanceToSuppression'
  | 'enemyCritChance' | 'enemyCritMultiplier' | 'elementalDamageReduction'
  | 'evadeChance' | 'hitDamageReduction' | 'enemyCritDamageReduction'
  | 'suppressedNoCrit' | 'allySuppressionShare' | 'allyAccuracyDebuffShare'
  // Ghostblade specific effect types
  | 'armorReduction' | 'afterHitEffect' | 'consecutiveEvadeBonus'
  | 'allyEvadeChance' | 'conditionalEvasion' | 'lessDamageIfEvadedRecently'
  | 'enemyHitCooldown'
  // Arcane Bulwark specific effect types
  | 'esRechargeRate' | 'esRechargeDelay' | 'esRecoveryBonus' | 'esRegeneration'
  | 'spellDamageReduction' | 'maxESBonus' | 'maxLifeReduction'
  | 'esRechargeNotInterruptedByBlock' | 'blockedDamageToESFirst'
  | 'elementalResistanceBonus' | 'elementalDRWhileES' | 'blockDamageToES' | 'esLeech'
  | 'allyESFromYours' | 'allySpellDamageReduction' | 'onBlockAllyDR'
  | 'chaosDoesNotBypassES' | 'esOvercharge' | 'crystalCitadelEffect'
  // Null Templar specific effect types
  | 'armorToChaosDamage' | 'chaosResistance' | 'maxChaosResistance' | 'chaosDamagePrevention'
  | 'elementalDamageToES' | 'esRechargeSlowed' | 'esRechargeNotInterrupted'
  | 'allySpellDamageReductionOnHit' | 'allyChaosResistance' | 'allyElementalDamageReduction'
  | 'allySpellDamageRedirect' | 'chaosResToElementalDR' | 'spellDamageCap'
  | 'physicalToChaosDamage' | 'chaosDamageReduction' | 'entropyAnchorEffect'
  // Phase Guardian specific effect types
  | 'dodgeChance' | 'esRemovalDamageReduction' | 'onESRechargeStartDR'
  | 'spellDamageESReduction' | 'onDodgeESRecharge' | 'onDodgeDR' | 'onDodgeESRestore'
  | 'allyDRWhileRecharging' | 'allyEvasionRating' | 'untouchableWindowEffect' | 'maxESReduction'
  // High Cleric specific effect types
  | 'singleTargetHealingBonus' | 'areaHealingReduction' | 'excessHealingRedistribution'
  | 'areaTargetReduction' | 'areaHealingPerTargetBonus' | 'healingReduction'
  | 'excessHealingStorage' | 'faithfulChannelEffect' | 'lowLifeHealingBonus'
  | 'healingCannotCrit' | 'crisisFocusEffect' | 'beaconOfMercyEffect'
  | 'sharedSalvationEffect' | 'allyDRWhileHighLife' | 'healingToHoT'
  | 'hotEffectivenessReduction' | 'healingRemovesDoT' | 'perfectDisciplineEffect'
  | 'healingCannotBeInterrupted' | 'manaCostIncrease' | 'divineAllocationEffect'
  // Blood Confessor specific effect types
  | 'lifeCostReduction' | 'lifeSpentReturn' | 'lifeCostIncrease' | 'healingOutputBonus'
  | 'selfHealFromHealing' | 'lowLifeDamageReduction' | 'lifeRegenOnLifeSpend'
  | 'allyLifeRecoveryFromLifeSpent' | 'allyDRFromHealing' | 'allyLifeRegenFromHealing'
  | 'healingOverTimeFromHeal' | 'bigLifeLossDR' | 'allyHitDRFromHealing'
  | 'lowLifeHealingIncrease' | 'lifeCostFloor' | 'lifeCostChaosDamage'
  | 'endlessMartyrdomEffect' | 'lifeCostStackingHealing' | 'allyMaxLifeFromHealing'
  // Tactician specific effect types
  | 'allyDamageReduction' | 'lowLifeAllyDR' | 'dotDamageReduction'
  | 'defensiveCooldownReduction' | 'defensiveCooldownEffect' | 'defensiveCooldownCDR'
  | 'crisisProtocolDR' | 'damageRedistribution' | 'failSafeFormationDR'
  | 'directHealBonus' | 'healCooldownIncrease' | 'healingLifeRegen' | 'overhealingToRegen'
  | 'allyMaxLifeBonus' | 'allyCritDamageReduction' | 'allyDealLessDamage' | 'allyTakeLessDamage'
  | 'battlePlanAlphaDR' | 'perfectExecutionDR' | 'strategicMasteryEffect'
  // Grove Healer specific effect types
  | 'lifeRegenRate' | 'regenDuration' | 'flatLifeRegenPerSecond'
  | 'lowLifeRegenRate' | 'regenRatePerEffect' | 'regenRateSlower'
  | 'physicalDRWhileRegen' | 'elementalDRWhileRegen' | 'maxResWhileRegen'
  | 'regenRateAfterHit' | 'dotDRWhileRegen' | 'instantRegenPercent'
  | 'regenEffectMore' | 'regenSpeedFaster' | 'excessRegenToES'
  | 'additionalLifeRegenPerSecond' | 'regenEffectMoreBonus' | 'regenCannotBeReduced'
  | 'drWhileRegen' | 'regenShareToAllies' | 'regenDurationReduction';

export interface TalentEffect {
  type: TalentEffectType;
  value: number;
  stat?: keyof BaseStats | 'spellSuppression' | 'maxSpellSuppression' | 'maxSpellBlockChance';
  description: string;
  condition?: string;
}

// Icon names reference game-icons from react-icons/gi
export interface Talent {
  id: string;
  name: string;
  icon: string;              // Icon component name from react-icons/gi
  shortDesc: string;
  fullDesc: string;
  flavorNote?: string;
  effects: TalentEffect[];
  tier: TalentTierLevel;
  classId: CharacterClassId;
}

export interface TalentTier {
  level: TalentTierLevel;
  rowName: string;
  rowTheme: string;
  rowIcon: string;           // Icon for the row header
  talents: [Talent, Talent, Talent];
}

export interface ClassTalentTree {
  classId: CharacterClassId;
  className: string;
  classTheme: string;
  tiers: TalentTier[];
}

export type SelectedTalents = Partial<Record<TalentTierLevel, string>>;

export function isTierUnlocked(characterLevel: number, tierLevel: TalentTierLevel): boolean {
  return characterLevel >= tierLevel;
}

export function getAvailableTalentPoints(characterLevel: number): number {
  return TALENT_TIER_LEVELS.filter(level => characterLevel >= level).length;
}

export function countSelectedTalents(selectedTalents: SelectedTalents): number {
  return Object.values(selectedTalents).filter(id => id !== undefined).length;
}

// ==================== BASTION KNIGHT TALENTS ====================
const BASTION_KNIGHT_TALENTS: ClassTalentTree = {
  classId: 'bastion_knight',
  className: 'Bastion Knight',
  classTheme: 'Armor / Block Tank — High armor, reliable block, predictable mitigation',
  tiers: [
    // ROW 1 — Core Mitigation Axis
    {
      level: 10,
      rowName: 'Core Mitigation Axis',
      rowTheme: 'What kind of tank are you fundamentally?',
      rowIcon: 'GiChestArmor',
      talents: [
        {
          id: 'bk_r1_heavy_plating',
          name: 'Heavy Plating',
          icon: 'GiChestArmor',
          shortDesc: 'You have 15% more Armor',
          fullDesc: 'You have 15% more Armor',
          tier: 10,
          classId: 'bastion_knight',
          effects: [
            { type: 'armorBonus', value: 15, description: '15% more Armor' }
          ]
        },
        {
          id: 'bk_r1_shield_discipline',
          name: 'Shield Discipline',
          icon: 'GiVikingShield',
          shortDesc: '+10% Chance to Block Attack Damage',
          fullDesc: '+10% Chance to Block Attack Damage',
          tier: 10,
          classId: 'bastion_knight',
          effects: [
            { type: 'blockBonus', value: 10, description: '+10% Chance to Block Attack Damage' }
          ]
        },
        {
          id: 'bk_r1_bastioned_frame',
          name: 'Bastioned Frame',
          icon: 'GiShieldReflect',
          shortDesc: '8% reduced Physical Damage Taken',
          fullDesc: '8% reduced Physical Damage Taken',
          tier: 10,
          classId: 'bastion_knight',
          effects: [
            { type: 'damageReduction', value: 8, description: '8% reduced Physical Damage Taken', condition: 'physical' }
          ]
        }
      ]
    },
    // ROW 2 — Block Specialization
    {
      level: 25,
      rowName: 'Block Specialization',
      rowTheme: 'How block contributes to survival',
      rowIcon: 'GiShieldBash',
      talents: [
        {
          id: 'bk_r2_reinforced_guard',
          name: 'Reinforced Guard',
          icon: 'GiShieldBash',
          shortDesc: 'Your Blocks reduce damage by 50% instead of 30%',
          fullDesc: 'Your Block Damage Reduction is increased by 20% (30% → 50% damage reduction on block)',
          tier: 25,
          classId: 'bastion_knight',
          effects: [
            { type: 'blockEffectiveness', value: 20, description: 'Block Damage Reduction increased by 20% (30% → 50%)' }
          ]
        },
        {
          id: 'bk_r2_spellguard_training',
          name: 'Spellguard Training',
          icon: 'GiMagicShield',
          shortDesc: '+10% Chance to Block Spell Damage',
          fullDesc: '+10% Chance to Block Spell Damage',
          tier: 25,
          classId: 'bastion_knight',
          effects: [
            { type: 'blockBonus', value: 10, stat: 'spellBlockChance', description: '+10% Chance to Block Spell Damage' }
          ]
        },
        {
          id: 'bk_r2_bulwark_momentum',
          name: 'Bulwark Momentum',
          icon: 'GiCheckedShield',
          shortDesc: 'You take 5% reduced Damage if you blocked recently',
          fullDesc: 'You take 5% reduced Damage if you have blocked in the past 4 seconds',
          tier: 25,
          classId: 'bastion_knight',
          effects: [
            { type: 'onBlockEffect', value: 5, description: '5% reduced Damage Taken if blocked in past 4 seconds' }
          ]
        }
      ]
    },
    // ROW 3 — Physical Damage Control
    {
      level: 40,
      rowName: 'Physical Damage Control',
      rowTheme: 'Smoothing incoming melee pressure',
      rowIcon: 'GiCrossedSwords',
      talents: [
        {
          id: 'bk_r3_crushing_dampeners',
          name: 'Crushing Dampeners',
          icon: 'GiBoltShield',
          shortDesc: 'You take 10% reduced Damage from Enemy Hits',
          fullDesc: 'You take 10% reduced Damage from Enemy Hits (hits only, not DoTs)',
          tier: 40,
          classId: 'bastion_knight',
          effects: [
            { type: 'damageReduction', value: 10, description: '10% reduced Damage from Enemy Hits', condition: 'hits' }
          ]
        },
        {
          id: 'bk_r3_iron_reflex_core',
          name: 'Iron Reflex Core',
          icon: 'GiPoisonBottle',
          shortDesc: 'Your Armor applies to Chaos Damage at 50% effectiveness',
          fullDesc: 'Your Armor applies to Chaos Damage at 50% of its value',
          tier: 40,
          classId: 'bastion_knight',
          effects: [
            { type: 'armorBonus', value: 50, description: 'Armor applies to Chaos Damage at 50% effectiveness', condition: 'chaos' }
          ]
        },
        {
          id: 'bk_r3_steelback',
          name: 'Steelback',
          icon: 'GiAnvil',
          shortDesc: 'You take 20% reduced Extra Damage from Critical Strikes',
          fullDesc: 'You take 20% reduced Extra Damage from Critical Strikes',
          tier: 40,
          classId: 'bastion_knight',
          effects: [
            { type: 'critImmunity', value: 20, description: '20% reduced Extra Damage from Critical Strikes' }
          ]
        }
      ]
    },
    // ROW 4 — Party Defensive Identity
    {
      level: 55,
      rowName: 'Party Defensive Identity',
      rowTheme: 'How you help your team survive',
      rowIcon: 'GiTwoShadows',
      talents: [
        {
          id: 'bk_r4_phalanx_presence',
          name: 'Phalanx Presence',
          icon: 'GiShieldEchoes',
          shortDesc: 'Allies take 8% reduced Physical Damage',
          fullDesc: 'Allies take 8% reduced Physical Damage Taken',
          tier: 55,
          classId: 'bastion_knight',
          effects: [
            { type: 'allyProtection', value: 8, description: 'Allies: 8% reduced Physical Damage Taken', condition: 'physical' }
          ]
        },
        {
          id: 'bk_r4_shielded_advance',
          name: 'Shielded Advance',
          icon: 'GiVikingShield',
          shortDesc: 'Allies gain +6% Attack Block Chance',
          fullDesc: 'Allies gain +6% Chance to Block Attack Damage',
          tier: 55,
          classId: 'bastion_knight',
          effects: [
            { type: 'allyProtection', value: 6, description: 'Allies: +6% Chance to Block Attack Damage', condition: 'block' }
          ]
        },
        {
          id: 'bk_r4_bastion_standard',
          name: 'Bastion Standard',
          icon: 'GiChestArmor',
          shortDesc: 'Allies gain +10% increased Armor',
          fullDesc: 'Allies gain +10% increased Armor',
          tier: 55,
          classId: 'bastion_knight',
          effects: [
            { type: 'allyProtection', value: 10, description: 'Allies: +10% increased Armor', condition: 'armor' }
          ]
        }
      ]
    },
    // ROW 5 — Scaling & Reliability
    {
      level: 70,
      rowName: 'Scaling & Reliability',
      rowTheme: 'How mitigation scales into harder content',
      rowIcon: 'GiMountaintop',
      talents: [
        {
          id: 'bk_r5_impenetrable',
          name: 'Impenetrable',
          icon: 'GiShieldBounces',
          shortDesc: 'You take 10% reduced Damage if you blocked recently',
          fullDesc: 'You take 10% reduced Damage if you have blocked recently (last 4 seconds)',
          tier: 70,
          classId: 'bastion_knight',
          effects: [
            { type: 'onBlockEffect', value: 10, description: '10% reduced Damage Taken if blocked in last 4 seconds' }
          ]
        },
        {
          id: 'bk_r5_iron_will',
          name: 'Iron Will',
          icon: 'GiCrownedSkull',
          shortDesc: '20% reduced Enemy Physical Damage Modifiers',
          fullDesc: '20% reduced Effect of Enemy Physical Damage Modifiers (e.g. Vulnerability-style effects)',
          tier: 70,
          classId: 'bastion_knight',
          effects: [
            { type: 'damageReduction', value: 20, description: '20% reduced Effect of Enemy Physical Damage Modifiers', condition: 'enemyModifiers' }
          ]
        },
        {
          id: 'bk_r5_resolute_guard',
          name: 'Resolute Guard',
          icon: 'GiCheckedShield',
          shortDesc: 'Block Chance cannot go below 50%',
          fullDesc: 'Your Block Chance cannot be lowered below 50%',
          tier: 70,
          classId: 'bastion_knight',
          effects: [
            { type: 'blockBonus', value: 50, description: 'Block Chance floor: 50%', condition: 'floor' }
          ]
        }
      ]
    },
    // ROW 6 — Endgame Identity
    {
      level: 85,
      rowName: 'Endgame Identity',
      rowTheme: 'One big defining choice',
      rowIcon: 'GiCrown',
      talents: [
        {
          id: 'bk_r6_living_fortress',
          name: 'Living Fortress',
          icon: 'GiCastle',
          shortDesc: 'You take 15% reduced Damage while you have Block Chance',
          fullDesc: 'You take 15% reduced Damage while you have Block Chance',
          tier: 85,
          classId: 'bastion_knight',
          effects: [
            { type: 'damageReduction', value: 15, description: '15% reduced Damage Taken while you have Block Chance', condition: 'hasBlock' }
          ]
        },
        {
          id: 'bk_r6_unyielding_core',
          name: 'Unyielding Core',
          icon: 'GiPoisonBottle',
          shortDesc: 'Your Armor applies to Chaos Damage at 100% effectiveness',
          fullDesc: 'Your Armor applies to Chaos Damage at 100% of its value',
          tier: 85,
          classId: 'bastion_knight',
          effects: [
            { type: 'armorBonus', value: 100, description: 'Armor applies to Chaos Damage at 100% effectiveness', condition: 'chaos' }
          ]
        },
        {
          id: 'bk_r6_last_wall',
          name: 'Last Wall',
          icon: 'GiAnvil',
          shortDesc: 'Hits dealing >50% of your max Life deal 20% less Damage to you',
          fullDesc: 'Hits dealing more than 50% of your Maximum Life deal 20% less Damage to you',
          tier: 85,
          classId: 'bastion_knight',
          effects: [
            { type: 'bigHitReduction', value: 20, description: 'Hits >50% max Life deal 20% less Damage', condition: 'threshold:50' }
          ]
        }
      ]
    }
  ]
};

// ==================== WARDBREAKER TALENTS ====================
const WARDBREAKER_TALENTS: ClassTalentTree = {
  classId: 'wardbreaker',
  className: 'Wardbreaker',
  classTheme: 'Anti-Magic Vanguard — Invalidates spell damage through suppression, armor scaling, and chaos control',
  tiers: [
    // ROW 1 — Baseline Magic Mitigation
    {
      level: 10,
      rowName: 'Baseline Magic Mitigation',
      rowTheme: 'How you personally reduce spell damage',
      rowIcon: 'GiFireShield',
      talents: [
        {
          id: 'wb_r1_elemental_dampeners',
          name: 'Elemental Dampeners',
          icon: 'GiFireShield',
          shortDesc: 'You take 10% reduced Elemental Damage',
          fullDesc: 'You take 10% reduced Elemental Damage.',
          tier: 10,
          classId: 'wardbreaker',
          effects: [
            { type: 'damageReduction', value: 10, description: '10% reduced Elemental Damage taken', condition: 'elemental' }
          ]
        },
        {
          id: 'wb_r1_spellshatter_plating',
          name: 'Spellshatter Plating',
          icon: 'GiBrokenShield',
          shortDesc: 'You have +20% chance to Suppress Spell Damage',
          fullDesc: 'You have +20% chance to Suppress Spell Damage.',
          tier: 10,
          classId: 'wardbreaker',
          effects: [
            { type: 'statBonus', value: 20, stat: 'spellSuppression', description: '+20% chance to Suppress Spell Damage' }
          ]
        },
        {
          id: 'wb_r1_runic_guard',
          name: 'Runic Guard',
          icon: 'GiMagicShield',
          shortDesc: 'You have +10% Spell Block Chance',
          fullDesc: 'You have +10% Spell Block Chance.',
          tier: 10,
          classId: 'wardbreaker',
          effects: [
            { type: 'blockBonus', value: 10, stat: 'spellBlockChance', description: '+10% Spell Block Chance' }
          ]
        }
      ]
    },
    // ROW 2 — Spell Hit Conversion
    {
      level: 25,
      rowName: 'Spell Hit Conversion',
      rowTheme: 'What happens when spells actually hit you',
      rowIcon: 'GiMagicShield',
      talents: [
        {
          id: 'wb_r2_partial_nullification',
          name: 'Partial Nullification',
          icon: 'GiShieldBounces',
          shortDesc: 'Suppressed Spells deal only 45% Damage to you instead of 50%',
          fullDesc: 'Suppressed Spell Damage deals only 45% of Damage to you instead of 50%.',
          tier: 25,
          classId: 'wardbreaker',
          effects: [
            { type: 'blockEffectiveness', value: 5, description: 'Suppressed Spell Damage deals 55% instead of 50%', condition: 'suppression' }
          ]
        },
        {
          id: 'wb_r2_arcane_weight',
          name: 'Arcane Weight',
          icon: 'GiShieldReflect',
          shortDesc: 'Blocked Spell Hits deal 40% Damage to you instead of 70%',
          fullDesc: 'Blocked Spell Hits deal 40% of Damage to you instead of 70%.',
          tier: 25,
          classId: 'wardbreaker',
          effects: [
            { type: 'blockEffectiveness', value: 30, description: 'Blocked Spell Hits deal 40% instead of 70%', condition: 'spellBlock' }
          ]
        },
        {
          id: 'wb_r2_void_reinforcement',
          name: 'Void Reinforcement',
          icon: 'GiSwapBag',
          shortDesc: '15% of Elemental Damage you take is taken as Physical instead',
          fullDesc: '15% of Elemental Damage you take is taken as Physical Damage instead.',
          tier: 25,
          classId: 'wardbreaker',
          effects: [
            { type: 'damageReduction', value: 15, description: '15% of Elemental Damage taken as Physical', condition: 'elementalToPhysical' }
          ]
        }
      ]
    },
    // ROW 3 — Armor vs Magic Interaction
    {
      level: 40,
      rowName: 'Armor vs Magic',
      rowTheme: 'How armor helps against magic (Wardbreaker specialty)',
      rowIcon: 'GiChestArmor',
      talents: [
        {
          id: 'wb_r3_spellforged_plates',
          name: 'Spellforged Plates',
          icon: 'GiChestArmor',
          shortDesc: 'Your Armor applies to Spell Hits at 30% effectiveness',
          fullDesc: 'Your Armor applies to Spell Hits at 30% of its value.',
          tier: 40,
          classId: 'wardbreaker',
          effects: [
            { type: 'armorBonus', value: 30, description: 'Armor applies to Spell Hits at 30% effectiveness', condition: 'spellHits' }
          ]
        },
        {
          id: 'wb_r3_aether_compression',
          name: 'Aether Compression',
          icon: 'GiAnvil',
          shortDesc: 'You have 10% more Armor while taking Spell Damage',
          fullDesc: 'You have 10% more Armor while taking Spell Damage.',
          tier: 40,
          classId: 'wardbreaker',
          effects: [
            { type: 'armorBonus', value: 10, description: '10% more Armor while taking Spell Damage', condition: 'takingSpellDamage' }
          ]
        },
        {
          id: 'wb_r3_runic_density',
          name: 'Runic Density',
          icon: 'GiEnergyShield',
          shortDesc: 'You take 15% reduced Damage from Hits while you have Energy Shield',
          fullDesc: 'You take 15% reduced Damage from Hits while you have Energy Shield.',
          tier: 40,
          classId: 'wardbreaker',
          effects: [
            { type: 'damageReduction', value: 15, description: '15% reduced Damage from Hits while you have ES', condition: 'hasES' }
          ]
        }
      ]
    },
    // ROW 4 — Party Magic Defense
    {
      level: 55,
      rowName: 'Party Magic Defense',
      rowTheme: 'How you protect the group',
      rowIcon: 'GiTwoShadows',
      talents: [
        {
          id: 'wb_r4_warding_presence',
          name: 'Warding Presence',
          icon: 'GiAura',
          shortDesc: 'Allies take 8% reduced Elemental Damage',
          fullDesc: 'Nearby Allies take 8% reduced Elemental Damage.',
          tier: 55,
          classId: 'wardbreaker',
          effects: [
            { type: 'allyProtection', value: 8, description: 'Allies: 8% reduced Elemental Damage', condition: 'elemental' }
          ]
        },
        {
          id: 'wb_r4_spellbreak_aura',
          name: 'Spellbreak Aura',
          icon: 'GiMagicShield',
          shortDesc: 'Allies gain +10% Spell Suppression',
          fullDesc: 'Nearby Allies gain +10% chance to Suppress Spell Damage.',
          tier: 55,
          classId: 'wardbreaker',
          effects: [
            { type: 'allyProtection', value: 10, description: 'Allies: +10% Spell Suppression Chance', condition: 'suppression' }
          ]
        },
        {
          id: 'wb_r4_runic_interference',
          name: 'Runic Interference',
          icon: 'GiShieldEchoes',
          shortDesc: 'Enemies deal 10% reduced Spell Damage to allies',
          fullDesc: 'Enemies deal 10% reduced Spell Damage to allies they are hitting.',
          tier: 55,
          classId: 'wardbreaker',
          effects: [
            { type: 'allyProtection', value: 10, description: 'Enemies: –10% Spell Damage to allies', condition: 'enemySpellDebuff' }
          ]
        }
      ]
    },
    // ROW 5 — Chaos & Bypass Control
    {
      level: 70,
      rowName: 'Chaos & Bypass Control',
      rowTheme: 'Handling the one damage type ES doesn\'t stop',
      rowIcon: 'GiPoisonBottle',
      talents: [
        {
          id: 'wb_r5_inoculating_plates',
          name: 'Inoculating Plates',
          icon: 'GiPoisonBottle',
          shortDesc: 'You take 10% reduced Chaos Damage',
          fullDesc: 'You take 10% reduced Chaos Damage.',
          tier: 70,
          classId: 'wardbreaker',
          effects: [
            { type: 'damageReduction', value: 10, description: '10% reduced Chaos Damage taken', condition: 'chaos' }
          ]
        },
        {
          id: 'wb_r5_void_sealed_armor',
          name: 'Void-Sealed Armor',
          icon: 'GiChestArmor',
          shortDesc: 'Your Armor applies to Chaos Damage at 25% effectiveness',
          fullDesc: 'Your Armor applies to Chaos Damage at 25% of its value.',
          tier: 70,
          classId: 'wardbreaker',
          effects: [
            { type: 'armorBonus', value: 25, description: 'Armor applies to Chaos Damage at 25% effectiveness', condition: 'chaos' }
          ]
        },
        {
          id: 'wb_r5_malice_dampening',
          name: 'Malice Dampening',
          icon: 'GiDeathSkull',
          shortDesc: 'You take 15% reduced Damage from Damage over Time',
          fullDesc: 'You take 15% reduced Damage from Damage over Time.',
          tier: 70,
          classId: 'wardbreaker',
          effects: [
            { type: 'damageReduction', value: 15, description: '15% reduced Damage from DoT', condition: 'dot' }
          ]
        }
      ]
    },
    // ROW 6 — Endgame Identity
    {
      level: 85,
      rowName: 'Endgame Identity',
      rowTheme: 'Defines what kind of Wardbreaker you are',
      rowIcon: 'GiCrown',
      talents: [
        {
          id: 'wb_r6_spellbreaker_prime',
          name: 'Spellbreaker Prime',
          icon: 'GiMagicShield',
          shortDesc: 'You have +15% to maximum Spell Suppression Chance',
          fullDesc: 'You have +15% to maximum Spell Suppression Chance.',
          tier: 85,
          classId: 'wardbreaker',
          effects: [
            { type: 'statBonus', value: 15, stat: 'maxSpellSuppression', description: '+15% to maximum Spell Suppression Chance' }
          ]
        },
        {
          id: 'wb_r6_runic_bulwark',
          name: 'Runic Bulwark',
          icon: 'GiVikingShield',
          shortDesc: 'You have +10% to maximum Spell Block Chance',
          fullDesc: 'You have +10% to maximum Spell Block Chance.',
          tier: 85,
          classId: 'wardbreaker',
          effects: [
            { type: 'statBonus', value: 10, stat: 'maxSpellBlockChance', description: '+10% to maximum Spell Block Chance' }
          ]
        },
        {
          id: 'wb_r6_anti_mage_vanguard',
          name: 'Anti-Mage Vanguard',
          icon: 'GiCastle',
          shortDesc: 'Enemies you tank deal 10% less Spell Damage to party',
          fullDesc: 'Enemies you are tanking deal 10% less Spell Damage to the entire party.',
          tier: 85,
          classId: 'wardbreaker',
          effects: [
            { type: 'allyProtection', value: 10, description: 'Tanked enemies: –10% Spell Damage to party', condition: 'tankedEnemies' }
          ]
        }
      ]
    }
  ]
};

// ==================== IRON SKIRMISHER TALENTS ====================
const IRON_SKIRMISHER_TALENTS: ClassTalentTree = {
  classId: 'iron_skirmisher',
  className: 'Iron Skirmisher',
  classTheme: 'Armor / Evasion Hybrid — Balances avoidance and absorption for flexible defense',
  tiers: [
    // ROW 1 — Core Defense Profile
    {
      level: 10,
      rowName: 'Core Defense Profile',
      rowTheme: 'How you avoid vs absorb attacks',
      rowIcon: 'GiChestArmor',
      talents: [
        {
          id: 'is_r1_agile_plating',
          name: 'Agile Plating',
          icon: 'GiRunningNinja',
          shortDesc: '+25% more Evasion Rating, but –10% reduced Armor',
          fullDesc: 'You have +25% more Evasion Rating\nYou have –10% reduced Armor',
          flavorNote: 'Lean harder into avoidance, accept thinner armor.',
          tier: 10,
          classId: 'iron_skirmisher',
          effects: [
            { type: 'evasionBonus', value: 25, description: 'You have +25% more Evasion Rating' },
            { type: 'armorBonus', value: -10, description: 'You have –10% reduced Armor' }
          ]
        },
        {
          id: 'is_r1_balanced_harness',
          name: 'Balanced Harness',
          icon: 'GiScales',
          shortDesc: '+15% more Armor and +15% more Evasion Rating',
          fullDesc: 'You have +15% more Armor\nYou have +15% more Evasion Rating',
          flavorNote: 'Safe, consistent hybrid baseline.',
          tier: 10,
          classId: 'iron_skirmisher',
          effects: [
            { type: 'armorBonus', value: 15, description: 'You have +15% more Armor' },
            { type: 'evasionBonus', value: 15, description: 'You have +15% more Evasion Rating' }
          ]
        },
        {
          id: 'is_r1_reactive_steel',
          name: 'Reactive Steel',
          icon: 'GiAnvil',
          shortDesc: '+25% more Armor, but –10% reduced Evasion Rating',
          fullDesc: 'You have +25% more Armor\nYou have –10% reduced Evasion Rating',
          flavorNote: 'Accept more hits, smooth them harder.',
          tier: 10,
          classId: 'iron_skirmisher',
          effects: [
            { type: 'armorBonus', value: 25, description: 'You have +25% more Armor' },
            { type: 'evasionBonus', value: -10, description: 'You have –10% reduced Evasion Rating' }
          ]
        }
      ]
    },
    // ROW 2 — Incoming Attack Control
    {
      level: 25,
      rowName: 'Incoming Attack Control',
      rowTheme: 'How enemy attacks behave against you',
      rowIcon: 'GiCrossedSwords',
      talents: [
        {
          id: 'is_r2_deflective_momentum',
          name: 'Deflective Momentum',
          icon: 'GiShieldBounces',
          shortDesc: 'Enemies have 10% reduced Attack Speed',
          fullDesc: 'Enemies have 10% reduced Attack Speed against you',
          tier: 25,
          classId: 'iron_skirmisher',
          effects: [
            { type: 'enemyAttackSpeed', value: 10, description: 'Enemies have 10% reduced Attack Speed against you' }
          ]
        },
        {
          id: 'is_r2_skirmishers_pressure',
          name: "Skirmisher's Pressure",
          icon: 'GiEyelashes',
          shortDesc: 'Enemies have 15% reduced Accuracy',
          fullDesc: 'Enemies have 15% reduced Accuracy against you',
          flavorNote: 'Strong synergy with evasion, weak vs spells (intentional).',
          tier: 25,
          classId: 'iron_skirmisher',
          effects: [
            { type: 'enemyAccuracy', value: 15, description: 'Enemies have 15% reduced Accuracy against you' }
          ]
        },
        {
          id: 'is_r2_blunted_assault',
          name: 'Blunted Assault',
          icon: 'GiBrokenShield',
          shortDesc: 'You take 10% reduced Damage from Attacks',
          fullDesc: 'You take 10% reduced Damage from Attacks',
          flavorNote: 'Simple, reliable, always useful.',
          tier: 25,
          classId: 'iron_skirmisher',
          effects: [
            { type: 'attackDamageReduction', value: 10, description: 'You take 10% reduced Damage from Attacks' }
          ]
        }
      ]
    },
    // ROW 3 — Damage Smoothing
    {
      level: 40,
      rowName: 'Damage Smoothing',
      rowTheme: 'How hits feel when they connect',
      rowIcon: 'GiShieldReflect',
      talents: [
        {
          id: 'is_r3_steel_absorption',
          name: 'Steel Absorption',
          icon: 'GiAbdominalArmor',
          shortDesc: 'You take 10% reduced Physical Damage from Attacks',
          fullDesc: 'You take 10% reduced Physical Damage from Attacks',
          flavorNote: 'Effectively multiplicative with armor.',
          tier: 40,
          classId: 'iron_skirmisher',
          effects: [
            { type: 'damageReduction', value: 10, description: 'You take 10% reduced Physical Damage from Attacks', condition: 'physicalAttacks' }
          ]
        },
        {
          id: 'is_r3_rolling_impact',
          name: 'Rolling Impact',
          icon: 'GiRollingEnergy',
          shortDesc: 'Enemies deal 10% reduced Attack Damage to you',
          fullDesc: 'Enemies deal 10% reduced Attack Damage to you',
          flavorNote: 'Applies before armor, excellent against fast hitters.',
          tier: 40,
          classId: 'iron_skirmisher',
          effects: [
            { type: 'attackDamageReduction', value: 10, description: 'Enemies deal 10% reduced Attack Damage to you', condition: 'preArmor' }
          ]
        },
        {
          id: 'is_r3_enduring_frame',
          name: 'Enduring Frame',
          icon: 'GiMuscularTorso',
          shortDesc: 'Your Armor provides +15% increased Physical Damage Reduction',
          fullDesc: 'You have +15% increased Physical Damage Reduction from Armor',
          flavorNote: 'Scales armor math directly without flat values.',
          tier: 40,
          classId: 'iron_skirmisher',
          effects: [
            { type: 'physicalDamageReductionFromArmor', value: 15, description: 'You have +15% increased Physical Damage Reduction from Armor' }
          ]
        }
      ]
    },
    // ROW 4 — Party Defense Utility
    {
      level: 55,
      rowName: 'Party Defense Utility',
      rowTheme: 'How you help the group survive',
      rowIcon: 'GiTwoShadows',
      talents: [
        {
          id: 'is_r4_disruptive_guard',
          name: 'Disruptive Guard',
          icon: 'GiShieldEchoes',
          shortDesc: 'Nearby enemies deal 8% reduced Damage to allies',
          fullDesc: 'Nearby enemies deal 8% reduced Damage to allies',
          tier: 55,
          classId: 'iron_skirmisher',
          effects: [
            { type: 'allyProtection', value: 8, description: 'Nearby enemies deal 8% reduced Damage to allies', condition: 'nearbyEnemies' }
          ]
        },
        {
          id: 'is_r4_evasive_formation',
          name: 'Evasive Formation',
          icon: 'GiDodging',
          shortDesc: 'Allies gain 10% increased Evasion Rating',
          fullDesc: 'Allies gain 10% increased Evasion Rating',
          flavorNote: 'Synergizes with dex / evasion DPS & healers.',
          tier: 55,
          classId: 'iron_skirmisher',
          effects: [
            { type: 'allyProtection', value: 10, description: 'Allies: +10% increased Evasion Rating', condition: 'evasion' }
          ]
        },
        {
          id: 'is_r4_frontline_pressure',
          name: 'Frontline Pressure',
          icon: 'GiSwordman',
          shortDesc: 'Enemies attacking you deal 10% reduced Damage to allies',
          fullDesc: 'Enemies attacking you deal 10% reduced Damage to allies',
          flavorNote: 'Encourages proper tank targeting without AI tricks.',
          tier: 55,
          classId: 'iron_skirmisher',
          effects: [
            { type: 'allyProtection', value: 10, description: 'Enemies attacking you deal 10% reduced Damage to allies', condition: 'tankingEnemies' }
          ]
        }
      ]
    },
    // ROW 5 — Scaling Against Content
    {
      level: 70,
      rowName: 'Scaling Against Content',
      rowTheme: 'How you handle harder enemies',
      rowIcon: 'GiMountaintop',
      talents: [
        {
          id: 'is_r5_adaptive_reinforcement',
          name: 'Adaptive Reinforcement',
          icon: 'GiUpgrade',
          shortDesc: 'You take 10% reduced Damage from Rare and Boss enemies',
          fullDesc: 'You take 10% reduced Damage from Rare and Boss enemies',
          tier: 70,
          classId: 'iron_skirmisher',
          effects: [
            { type: 'damageReduction', value: 10, description: 'You take 10% reduced Damage from Rare and Boss enemies', condition: 'rareAndBoss' }
          ]
        },
        {
          id: 'is_r5_attrition_specialist',
          name: 'Attrition Specialist',
          icon: 'GiSandsOfTime',
          shortDesc: 'Enemies deal 15% reduced Attack Damage to you if they attacked recently',
          fullDesc: 'Enemies deal 15% reduced Attack Damage to you if they have attacked recently',
          flavorNote: 'Works naturally in auto-battler combat loops.',
          tier: 70,
          classId: 'iron_skirmisher',
          effects: [
            { type: 'attackDamageReduction', value: 15, description: 'Enemies deal 15% reduced Attack Damage to you if they attacked recently', condition: 'enemyAttackedRecently' }
          ]
        },
        {
          id: 'is_r5_veteran_conditioning',
          name: 'Veteran Conditioning',
          icon: 'GiMedalSkull',
          shortDesc: '+20% increased Armor and Evasion Rating',
          fullDesc: 'You have +20% increased Armor and Evasion Rating',
          flavorNote: 'Simple, scaling, always good.',
          tier: 70,
          classId: 'iron_skirmisher',
          effects: [
            { type: 'armorBonus', value: 20, description: 'You have +20% increased Armor' },
            { type: 'evasionBonus', value: 20, description: 'You have +20% increased Evasion Rating' }
          ]
        }
      ]
    },
    // ROW 6 — Keystone Identity
    {
      level: 85,
      rowName: 'Keystone Identity',
      rowTheme: 'Defines how the Iron Skirmisher feels endgame',
      rowIcon: 'GiCrown',
      talents: [
        {
          id: 'is_r6_momentum_tank',
          name: 'Momentum Tank',
          icon: 'GiSpinningSword',
          shortDesc: '+20% more Evasion; Evasion also grants Physical Damage Reduction',
          fullDesc: 'You have +20% more Evasion Rating\nYour Evasion applies at 50% effectiveness to Physical Damage Reduction',
          flavorNote: 'Evasion partially converts into mitigation instead of avoidance.',
          tier: 85,
          classId: 'iron_skirmisher',
          effects: [
            { type: 'evasionBonus', value: 20, description: 'You have +20% more Evasion Rating' },
            { type: 'evasionToMitigation', value: 50, description: 'Your Evasion applies at 50% effectiveness to Physical Damage Reduction' }
          ]
        },
        {
          id: 'is_r6_steel_flow',
          name: 'Steel Flow',
          icon: 'GiMetalBar',
          shortDesc: 'Your Armor is 120% effective vs Attacks, but –20% Evasion',
          fullDesc: 'Your Armor applies to Attacks at 120% effectiveness\nYou have –20% reduced Evasion Rating',
          flavorNote: 'Turns the Skirmisher into a fast-hit armor tank.',
          tier: 85,
          classId: 'iron_skirmisher',
          effects: [
            { type: 'armorEffectiveness', value: 120, description: 'Your Armor applies to Attacks at 120% effectiveness', condition: 'attacks' },
            { type: 'evasionBonus', value: -20, description: 'You have –20% reduced Evasion Rating' }
          ]
        },
        {
          id: 'is_r6_battle_rhythm',
          name: 'Battle Rhythm',
          icon: 'GiHeartBeats',
          shortDesc: 'Enemies deal 15% less Damage to you, but you deal 10% less',
          fullDesc: 'Enemies attacking you deal 15% reduced Damage to you\nYou deal 10% reduced Damage',
          flavorNote: 'Pure survivability + party safety tradeoff.',
          tier: 85,
          classId: 'iron_skirmisher',
          effects: [
            { type: 'attackDamageReduction', value: 15, description: 'Enemies attacking you deal 15% reduced Damage to you' },
            { type: 'selfDamageReduction', value: 10, description: 'You deal 10% reduced Damage' }
          ]
        }
      ]
    }
  ]
};

// ==================== DUEL WARDEN TALENTS ====================
const DUEL_WARDEN_TALENTS: ClassTalentTree = {
  classId: 'duel_warden',
  className: 'Duel Warden',
  classTheme: 'Evasion / Block Hybrid — Masters both avoidance and parrying for layered defense',
  tiers: [
    // ROW 1 — How attacks fail
    {
      level: 10,
      rowName: 'How Attacks Fail',
      rowTheme: 'Choose: scale evasion, lean into block, or globally reduce enemy hit chance',
      rowIcon: 'GiDodging',
      talents: [
        {
          id: 'dw_r1_refined_footwork',
          name: 'Refined Footwork',
          icon: 'GiRunningNinja',
          shortDesc: 'You have 15% more Evasion Rating',
          fullDesc: 'You have 15% more Evasion Rating',
          tier: 10,
          classId: 'duel_warden',
          effects: [
            { type: 'evasionBonus', value: 15, description: 'You have 15% more Evasion Rating' }
          ]
        },
        {
          id: 'dw_r1_measured_defense',
          name: 'Measured Defense',
          icon: 'GiVikingShield',
          shortDesc: '+10% Attack Block Chance, but –10% Spell Block Chance',
          fullDesc: 'You have +10% Attack Block Chance\nYou have –10% Spell Block Chance',
          tier: 10,
          classId: 'duel_warden',
          effects: [
            { type: 'blockBonus', value: 10, description: 'You have +10% Attack Block Chance' },
            { type: 'spellBlockBonus', value: -10, description: 'You have –10% Spell Block Chance' }
          ]
        },
        {
          id: 'dw_r1_elusive_target',
          name: 'Elusive Target',
          icon: 'GiEyelashes',
          shortDesc: 'Enemies have 10% reduced Accuracy Rating',
          fullDesc: 'Enemies have 10% reduced Accuracy Rating against you',
          tier: 10,
          classId: 'duel_warden',
          effects: [
            { type: 'enemyAccuracy', value: 10, description: 'Enemies have 10% reduced Accuracy Rating against you' }
          ]
        }
      ]
    },
    // ROW 2 — What happens when attacks miss
    {
      level: 25,
      rowName: 'What Happens When Attacks Miss',
      rowTheme: 'Misses protect you, your mitigation, or the party',
      rowIcon: 'GiShieldBounces',
      talents: [
        {
          id: 'dw_r2_punishing_miss',
          name: 'Punishing Miss',
          icon: 'GiPunchBlast',
          shortDesc: 'Enemies that miss you deal 10% reduced damage to all targets for 4s',
          fullDesc: 'When an enemy attack misses you:\nThat enemy deals 10% reduced damage to all targets for 4 seconds',
          tier: 25,
          classId: 'duel_warden',
          effects: [
            { type: 'onMissEffect', value: 10, description: 'Enemies that miss you deal 10% reduced damage for 4 seconds', condition: 'duration:4' }
          ]
        },
        {
          id: 'dw_r2_controlled_tempo',
          name: 'Controlled Tempo',
          icon: 'GiSandsOfTime',
          shortDesc: 'When you evade, gain +5% Block Chance for 3s (stacks 3x)',
          fullDesc: 'Each time you evade an attack:\nYou gain 5% increased Attack Block Chance for 3 seconds\nStacks up to 3 times',
          tier: 25,
          classId: 'duel_warden',
          effects: [
            { type: 'onEvadeEffect', value: 5, description: 'When you evade: +5% Attack Block Chance for 3s (stacks 3x)', condition: 'stacks:3,duration:3' }
          ]
        },
        {
          id: 'dw_r2_disrupting_presence',
          name: 'Disrupting Presence',
          icon: 'GiShieldEchoes',
          shortDesc: 'Enemies that miss you deal 10% reduced damage to allies',
          fullDesc: 'Enemies that miss you deal 10% reduced damage to allies',
          tier: 25,
          classId: 'duel_warden',
          effects: [
            { type: 'allyProtection', value: 10, description: 'Enemies that miss you deal 10% reduced damage to allies', condition: 'onMiss' }
          ]
        }
      ]
    },
    // ROW 3 — Handling successful hits
    {
      level: 40,
      rowName: 'Handling Successful Hits',
      rowTheme: 'Smooths damage intake without relying on "sometimes" conditions',
      rowIcon: 'GiShieldReflect',
      talents: [
        {
          id: 'dw_r3_perfect_parry',
          name: 'Perfect Parry',
          icon: 'GiSwordClash',
          shortDesc: 'Blocked attacks deal 40% less damage to you instead of 30%',
          fullDesc: 'Blocked attacks deal 40% less damage to you instead of 30%',
          tier: 40,
          classId: 'duel_warden',
          effects: [
            { type: 'blockEffectiveness', value: 10, description: 'Blocked attacks deal 40% less damage instead of 30%' }
          ]
        },
        {
          id: 'dw_r3_deflecting_force',
          name: 'Deflecting Force',
          icon: 'GiShieldBash',
          shortDesc: 'Blocking grants you 10% less Physical Damage Taken for 2s',
          fullDesc: 'Blocking an attack grants you 10% less Physical Damage Taken for 2 seconds',
          tier: 40,
          classId: 'duel_warden',
          effects: [
            { type: 'onBlockEffect', value: 10, description: 'Blocking grants you 10% less Physical Damage Taken for 2 seconds', condition: 'duration:2' }
          ]
        },
        {
          id: 'dw_r3_slip_through',
          name: 'Slip Through',
          icon: 'GiDodging',
          shortDesc: 'Hits that are not blocked deal 10% reduced damage to you',
          fullDesc: 'Hits that are not blocked deal 10% reduced damage to you',
          tier: 40,
          classId: 'duel_warden',
          effects: [
            { type: 'nonBlockedDamageReduction', value: 10, description: 'Hits that are not blocked deal 10% reduced damage to you' }
          ]
        }
      ]
    },
    // ROW 4 — Consistency vs variance
    {
      level: 55,
      rowName: 'Consistency vs Variance',
      rowTheme: 'A hard identity row that meaningfully reshapes your stat profile',
      rowIcon: 'GiScales',
      talents: [
        {
          id: 'dw_r4_calculated_risk',
          name: 'Calculated Risk',
          icon: 'GiRunningNinja',
          shortDesc: '20% more Evasion Rating, but –10% Attack Block Chance',
          fullDesc: 'You have 20% more Evasion Rating\nYou have –10% Attack Block Chance',
          tier: 55,
          classId: 'duel_warden',
          effects: [
            { type: 'evasionBonus', value: 20, description: 'You have 20% more Evasion Rating' },
            { type: 'blockBonus', value: -10, description: 'You have –10% Attack Block Chance' }
          ]
        },
        {
          id: 'dw_r4_steel_discipline',
          name: 'Steel Discipline',
          icon: 'GiVikingShield',
          shortDesc: '15% more Attack Block Chance, but –10% Evasion Rating',
          fullDesc: 'You have 15% more Attack Block Chance\nYou have –10% Evasion Rating',
          tier: 55,
          classId: 'duel_warden',
          effects: [
            { type: 'blockBonus', value: 15, description: 'You have 15% more Attack Block Chance' },
            { type: 'evasionBonus', value: -10, description: 'You have –10% Evasion Rating' }
          ]
        },
        {
          id: 'dw_r4_balanced_guard',
          name: 'Balanced Guard',
          icon: 'GiScales',
          shortDesc: 'You have 10% more Evasion and Attack Block',
          fullDesc: 'You have 10% more Evasion Rating\nYou have 10% more Attack Block Chance',
          tier: 55,
          classId: 'duel_warden',
          effects: [
            { type: 'evasionBonus', value: 10, description: 'You have 10% more Evasion Rating' },
            { type: 'blockBonus', value: 10, description: 'You have 10% more Attack Block Chance' }
          ]
        }
      ]
    },
    // ROW 5 — Party mitigation identity
    {
      level: 70,
      rowName: 'Party Mitigation Identity',
      rowTheme: 'Helps the party by attacking accuracy and physical hit reliability, not spells',
      rowIcon: 'GiTwoShadows',
      talents: [
        {
          id: 'dw_r5_duellists_example',
          name: "Duellist's Example",
          icon: 'GiDodging',
          shortDesc: 'Allies gain 10% increased Evasion Rating',
          fullDesc: 'Allies gain 10% increased Evasion Rating',
          tier: 70,
          classId: 'duel_warden',
          effects: [
            { type: 'allyProtection', value: 10, description: 'Allies gain 10% increased Evasion Rating', condition: 'evasion' }
          ]
        },
        {
          id: 'dw_r5_opening_control',
          name: 'Opening Control',
          icon: 'GiShieldEchoes',
          shortDesc: 'Enemies deal 8% reduced Attack Damage to allies',
          fullDesc: 'Enemies deal 8% reduced Attack Damage to allies',
          tier: 70,
          classId: 'duel_warden',
          effects: [
            { type: 'allyProtection', value: 8, description: 'Enemies deal 8% reduced Attack Damage to allies', condition: 'attackDamage' }
          ]
        },
        {
          id: 'dw_r5_covering_defense',
          name: 'Covering Defense',
          icon: 'GiVikingShield',
          shortDesc: 'Allies gain +5% Attack Block Chance',
          fullDesc: 'Allies gain +5% Attack Block Chance',
          tier: 70,
          classId: 'duel_warden',
          effects: [
            { type: 'allyProtection', value: 5, description: 'Allies gain +5% Attack Block Chance', condition: 'block' }
          ]
        }
      ]
    },
    // ROW 6 — Capstone philosophy
    {
      level: 85,
      rowName: 'Capstone Philosophy',
      rowTheme: 'No gimmicks. No "brief immunity." Just powerful, always-relevant mitigation',
      rowIcon: 'GiCrown',
      talents: [
        {
          id: 'dw_r6_untouchable_rhythm',
          name: 'Untouchable Rhythm',
          icon: 'GiSpinningSword',
          shortDesc: 'While evading regularly, you take 15% less Physical Damage',
          fullDesc: 'If you evade at least one attack every second:\nYou take 15% less Physical Damage',
          tier: 85,
          classId: 'duel_warden',
          effects: [
            { type: 'damageReduction', value: 15, description: 'You take 15% less Physical Damage while evading regularly', condition: 'evadePerSecond' }
          ]
        },
        {
          id: 'dw_r6_impeccable_guard',
          name: 'Impeccable Guard',
          icon: 'GiMagicShield',
          shortDesc: 'Your Attack Block Chance also applies to Spell Block at 75%',
          fullDesc: 'Your Attack Block Chance applies at 75% effectiveness to Spell Block',
          tier: 85,
          classId: 'duel_warden',
          effects: [
            { type: 'blockToSpellBlock', value: 75, description: 'Your Attack Block Chance applies at 75% effectiveness to Spell Block' }
          ]
        },
        {
          id: 'dw_r6_master_of_exchanges',
          name: 'Master of Exchanges',
          icon: 'GiSwordClash',
          shortDesc: 'Enemies that miss or are blocked by you deal 15% reduced damage to all targets',
          fullDesc: 'Enemies that miss or are blocked by you deal 15% reduced damage to all targets',
          tier: 85,
          classId: 'duel_warden',
          effects: [
            { type: 'onMissEffect', value: 15, description: 'Enemies that miss you deal 15% reduced damage', condition: 'permanent' },
            { type: 'onBlockEffect', value: 15, description: 'Enemies blocked by you deal 15% reduced damage', condition: 'permanent' }
          ]
        }
      ]
    }
  ]
};

// ==================== SHADOW WARDEN TALENTS ====================
const SHADOW_WARDEN_TALENTS: ClassTalentTree = {
  classId: 'shadow_warden',
  className: 'Shadow Warden',
  classTheme: 'Evasion + Suppression Control — Reduces enemy accuracy, avoids attacks, and smooths spell damage through suppression',
  tiers: [
    // ROW 1 — How you avoid attacks
    {
      level: 10,
      rowName: 'How You Avoid Attacks',
      rowTheme: 'Choose your primary avoidance method',
      rowIcon: 'GiCloakDagger',
      talents: [
        {
          id: 'sw_r1_veil_of_shadows',
          name: 'Veil of Shadows',
          icon: 'GiMoon',
          shortDesc: '+20% Evasion Rating; Enemies have 10% reduced Accuracy',
          fullDesc: 'You have +20% increased Evasion Rating\nEnemies have 10% reduced Accuracy against you',
          tier: 10,
          classId: 'shadow_warden',
          effects: [
            { type: 'evasionBonus', value: 20, description: 'You have +20% increased Evasion Rating' },
            { type: 'enemyAccuracy', value: 10, description: 'Enemies have 10% reduced Accuracy against you' }
          ]
        },
        {
          id: 'sw_r1_unseen_defender',
          name: 'Unseen Defender',
          icon: 'GiCloak',
          shortDesc: '+10% chance to Evade Attacks, but –10% Block Chance',
          fullDesc: 'You have +10% chance to Evade Attacks\nYou have –10% Block Chance',
          tier: 10,
          classId: 'shadow_warden',
          effects: [
            { type: 'evadeChance', value: 10, description: 'You have +10% chance to Evade Attacks' },
            { type: 'blockBonus', value: -10, description: 'You have –10% Block Chance' }
          ]
        },
        {
          id: 'sw_r1_mistbound_form',
          name: 'Mistbound Form',
          icon: 'GiMist',
          shortDesc: '15% of your Evade Chance is added as Spell Suppression',
          fullDesc: '15% of your chance to Evade Attacks is added as Spell Suppression Chance',
          tier: 10,
          classId: 'shadow_warden',
          effects: [
            { type: 'evadeChanceToSuppression', value: 15, description: '15% of your chance to Evade Attacks is added as Spell Suppression Chance' }
          ]
        }
      ]
    },
    // ROW 2 — How you handle spell damage
    {
      level: 25,
      rowName: 'How You Handle Spell Damage',
      rowTheme: 'Choose your spell mitigation strategy',
      rowIcon: 'GiMagicShield',
      talents: [
        {
          id: 'sw_r2_dampening_veil',
          name: 'Dampening Veil',
          icon: 'GiFireShield',
          shortDesc: 'You take 10% reduced Elemental Damage',
          fullDesc: 'You take 10% reduced Elemental Damage',
          tier: 25,
          classId: 'shadow_warden',
          effects: [
            { type: 'elementalDamageReduction', value: 10, description: 'You take 10% reduced Elemental Damage' }
          ]
        },
        {
          id: 'sw_r2_shadow_suppression',
          name: 'Shadow Suppression',
          icon: 'GiSpellBook',
          shortDesc: 'You have +15% chance to Suppress Spell Damage',
          fullDesc: 'You have +15% chance to Suppress Spell Damage',
          tier: 25,
          classId: 'shadow_warden',
          effects: [
            { type: 'spellSuppressionChance', value: 15, description: 'You have +15% chance to Suppress Spell Damage' }
          ]
        },
        {
          id: 'sw_r2_lingering_wards',
          name: 'Lingering Wards',
          icon: 'GiShieldBounces',
          shortDesc: 'Suppressed Spells deal 55% reduced Damage to you instead of 50%',
          fullDesc: 'Suppressed Spell Damage is reduced by 55% instead of 50%',
          tier: 25,
          classId: 'shadow_warden',
          effects: [
            { type: 'spellSuppressionEffect', value: 5, description: 'Suppressed Spell Damage is reduced by 55% instead of 50%' }
          ]
        }
      ]
    },
    // ROW 3 — Party-wide defensive influence
    {
      level: 40,
      rowName: 'Party-Wide Defensive Influence',
      rowTheme: 'How you protect your allies',
      rowIcon: 'GiTwoShadows',
      talents: [
        {
          id: 'sw_r3_cloak_of_misfortune',
          name: 'Cloak of Misfortune',
          icon: 'GiBlindness',
          shortDesc: 'Nearby enemies have 10% reduced Accuracy against all targets',
          fullDesc: 'Nearby enemies have 10% reduced Accuracy\nThis effect applies to enemies attacking allies',
          tier: 40,
          classId: 'shadow_warden',
          effects: [
            { type: 'enemyAccuracy', value: 10, description: 'Nearby enemies have 10% reduced Accuracy against all targets', condition: 'aura' }
          ]
        },
        {
          id: 'sw_r3_shared_obscurity',
          name: 'Shared Obscurity',
          icon: 'GiDodging',
          shortDesc: 'Allies gain 5% chance to Evade Attacks',
          fullDesc: 'Allies gain 5% chance to Evade Attacks',
          tier: 40,
          classId: 'shadow_warden',
          effects: [
            { type: 'allyProtection', value: 5, description: 'Allies gain 5% chance to Evade Attacks', condition: 'evade' }
          ]
        },
        {
          id: 'sw_r3_umbra_guard',
          name: 'Umbra Guard',
          icon: 'GiShieldEchoes',
          shortDesc: 'Allies take 5% reduced Elemental Damage',
          fullDesc: 'Allies take 5% reduced Elemental Damage',
          tier: 40,
          classId: 'shadow_warden',
          effects: [
            { type: 'allyProtection', value: 5, description: 'Allies take 5% reduced Elemental Damage', condition: 'elemental' }
          ]
        }
      ]
    },
    // ROW 4 — How you scale under pressure
    {
      level: 55,
      rowName: 'How You Scale Under Pressure',
      rowTheme: 'Always-relevant defensive scaling',
      rowIcon: 'GiMountaintop',
      talents: [
        {
          id: 'sw_r4_persistent_shroud',
          name: 'Persistent Shroud',
          icon: 'GiHealthNormal',
          shortDesc: 'You always have +20% increased Evasion Rating',
          fullDesc: 'You have 20% increased Evasion Rating while on Full Life\nYou have 20% increased Evasion Rating while not on Full Life\n(Always active)',
          flavorNote: 'No trap condition — always on.',
          tier: 55,
          classId: 'shadow_warden',
          effects: [
            { type: 'evasionBonus', value: 20, description: 'You always have +20% increased Evasion Rating' }
          ]
        },
        {
          id: 'sw_r4_night_adaptation',
          name: 'Night Adaptation',
          icon: 'GiShieldReflect',
          shortDesc: 'You take 10% reduced Damage from Hits (attacks and spells)',
          fullDesc: 'You take 10% reduced Damage from Hits\nApplies to both attacks and spells',
          tier: 55,
          classId: 'shadow_warden',
          effects: [
            { type: 'hitDamageReduction', value: 10, description: 'You take 10% reduced Damage from Hits' }
          ]
        },
        {
          id: 'sw_r4_dark_equilibrium',
          name: 'Dark Equilibrium',
          icon: 'GiPiercedHeart',
          shortDesc: 'Enemies have –5% Critical Strike Chance against all targets',
          fullDesc: 'Enemies have –5% to all Critical Strike Chance',
          tier: 55,
          classId: 'shadow_warden',
          effects: [
            { type: 'enemyCritChance', value: 5, description: 'Enemies have –5% to Critical Strike Chance' }
          ]
        }
      ]
    },
    // ROW 5 — Anti-spike mechanics
    {
      level: 70,
      rowName: 'Anti-Spike Mechanics',
      rowTheme: 'Prevent sudden deaths from big hits',
      rowIcon: 'GiHeartShield',
      talents: [
        {
          id: 'sw_r5_blunted_precision',
          name: 'Blunted Precision',
          icon: 'GiCrownedSkull',
          shortDesc: 'Enemy Critical Strikes deal 20% less Damage to you',
          fullDesc: 'Enemy Critical Strikes deal 20% less Damage to you',
          tier: 70,
          classId: 'shadow_warden',
          effects: [
            { type: 'enemyCritDamageReduction', value: 20, description: 'Enemy Critical Strikes deal 20% less Damage to you' }
          ]
        },
        {
          id: 'sw_r5_veiled_deflection',
          name: 'Veiled Deflection',
          icon: 'GiShieldBash',
          shortDesc: 'Blocked Hits deal 40% reduced Damage to you instead of 30%',
          fullDesc: 'Blocked Hits deal 40% reduced Damage to you instead of 30%',
          tier: 70,
          classId: 'shadow_warden',
          effects: [
            { type: 'blockEffectiveness', value: 10, description: 'Blocked Hits deal 40% reduced Damage to you instead of 30%' }
          ]
        },
        {
          id: 'sw_r5_spellfade',
          name: 'Spellfade',
          icon: 'GiMagicShield',
          shortDesc: 'Suppressed Spell Damage cannot Critically Strike you',
          fullDesc: 'Suppressed Spell Damage cannot Critically Strike you',
          tier: 70,
          classId: 'shadow_warden',
          effects: [
            { type: 'suppressedNoCrit', value: 1, description: 'Suppressed Spell Damage cannot Critically Strike you' }
          ]
        }
      ]
    },
    // ROW 6 — Capstone identity
    {
      level: 85,
      rowName: 'Capstone Identity',
      rowTheme: 'Defines your endgame Shadow Warden fantasy',
      rowIcon: 'GiCrown',
      talents: [
        {
          id: 'sw_r6_master_of_shadows',
          name: 'Master of Shadows',
          icon: 'GiNinjaHeroicStance',
          shortDesc: 'Enemies have –15% Accuracy and –10% Crit Chance',
          fullDesc: 'Enemies have 15% reduced Accuracy against you\nEnemies have –10% Critical Strike Chance',
          tier: 85,
          classId: 'shadow_warden',
          effects: [
            { type: 'enemyAccuracy', value: 15, description: 'Enemies have 15% reduced Accuracy against you' },
            { type: 'enemyCritChance', value: 10, description: 'Enemies have –10% Critical Strike Chance' }
          ]
        },
        {
          id: 'sw_r6_perfect_suppression',
          name: 'Perfect Suppression',
          icon: 'GiSpellBook',
          shortDesc: 'At 100% Suppression, suppressed spells deal 60% reduced Damage',
          fullDesc: 'If you have 100% chance to Suppress Spell Damage, suppressed spells deal 60% reduced Damage to you instead of 50%',
          tier: 85,
          classId: 'shadow_warden',
          effects: [
            { type: 'spellSuppressionEffect', value: 10, description: 'At 100% Suppression Chance, suppressed spells deal 60% reduced Damage', condition: 'fullSuppression' }
          ]
        },
        {
          id: 'sw_r6_living_umbra',
          name: 'Living Umbra',
          icon: 'GiShadowGrasp',
          shortDesc: 'Allies gain half your Suppression and Accuracy debuff effects',
          fullDesc: 'Allies gain half of your Spell Suppression Chance\nAllies gain half of your reduced Enemy Accuracy effects',
          tier: 85,
          classId: 'shadow_warden',
          effects: [
            { type: 'allySuppressionShare', value: 50, description: 'Allies gain half of your Spell Suppression Chance' },
            { type: 'allyAccuracyDebuffShare', value: 50, description: 'Allies gain half of your reduced Enemy Accuracy effects' }
          ]
        }
      ]
    }
  ]
};

// ==================== GHOSTBLADE TALENTS ====================
const GHOSTBLADE_TALENTS: ClassTalentTree = {
  classId: 'ghostblade',
  className: 'Ghostblade',
  classTheme: 'Pure Evasion Tank — Avoids attacks entirely, punishes missed hits, and smooths the bad RNG moments',
  tiers: [
    // ROW 1 — Evasion Scaling
    {
      level: 10,
      rowName: 'Evasion Scaling',
      rowTheme: 'How far you push avoidance',
      rowIcon: 'GiGhost',
      talents: [
        {
          id: 'gb_r1_blurred_form',
          name: 'Blurred Form',
          icon: 'GiSpeedometer',
          shortDesc: 'You have 20% more Evasion Rating',
          fullDesc: 'You have 20% more Evasion Rating',
          tier: 10,
          classId: 'ghostblade',
          effects: [
            { type: 'evasionBonus', value: 20, description: 'You have 20% more Evasion Rating' }
          ]
        },
        {
          id: 'gb_r1_ghost_reflexes',
          name: 'Ghost Reflexes',
          icon: 'GiReflexes',
          shortDesc: 'You have +15% chance to Evade Attacks (cap: 95%)',
          fullDesc: 'You have +15% increased chance to Evade Attacks\n(Subject to the global 95% cap)',
          tier: 10,
          classId: 'ghostblade',
          effects: [
            { type: 'evadeChance', value: 15, description: 'You have +15% increased chance to Evade Attacks' }
          ]
        },
        {
          id: 'gb_r1_wraithstep',
          name: 'Wraithstep',
          icon: 'GiFootsteps',
          shortDesc: '+30% Evasion Rating, but –10% Armour',
          fullDesc: 'You have +30% increased Evasion Rating\nYou have –10% reduced Armour',
          flavorNote: 'Pure evasion choice vs hybrid stat trade',
          tier: 10,
          classId: 'ghostblade',
          effects: [
            { type: 'evasionBonus', value: 30, description: 'You have +30% increased Evasion Rating' },
            { type: 'armorReduction', value: 10, description: 'You have –10% reduced Armour' }
          ]
        }
      ]
    },
    // ROW 2 — What Happens When You Evade
    {
      level: 25,
      rowName: 'When You Evade',
      rowTheme: 'Rewards for avoiding hits',
      rowIcon: 'GiDodge',
      talents: [
        {
          id: 'gb_r2_untouchable_flow',
          name: 'Untouchable Flow',
          icon: 'GiShield',
          shortDesc: 'After evading, you take 10% less Damage for 1s',
          fullDesc: 'After Evading an attack:\nYou take 10% less Damage Taken for 1 second',
          tier: 25,
          classId: 'ghostblade',
          effects: [
            { type: 'onEvadeEffect', value: 10, description: 'After Evading, you take 10% less Damage for 1s' }
          ]
        },
        {
          id: 'gb_r2_phantom_momentum',
          name: 'Phantom Momentum',
          icon: 'GiRunningNinja',
          shortDesc: 'After evading, +20% Attack and Cast Speed for 1s',
          fullDesc: 'After Evading an attack:\nYou gain 20% increased Attack and Cast Speed for 1 second',
          tier: 25,
          classId: 'ghostblade',
          effects: [
            { type: 'onEvadeEffect', value: 20, description: 'After Evading, you gain 20% increased Attack and Cast Speed for 1s' }
          ]
        },
        {
          id: 'gb_r2_lingering_mist',
          name: 'Lingering Mist',
          icon: 'GiFog',
          shortDesc: 'After evading, that enemy deals 10% reduced Damage for 1.5s',
          fullDesc: 'After Evading an attack:\nThe attacker deals 10% reduced Damage for 1.5 seconds',
          tier: 25,
          classId: 'ghostblade',
          effects: [
            { type: 'onEvadeEffect', value: 10, description: 'After Evading, that enemy deals 10% reduced Damage for 1.5s' }
          ]
        }
      ]
    },
    // ROW 3 — What Happens When You Get Hit
    {
      level: 40,
      rowName: 'When You Get Hit',
      rowTheme: 'The "oh shit" layer',
      rowIcon: 'GiHeartBeats',
      talents: [
        {
          id: 'gb_r3_slip_the_blade',
          name: 'Slip the Blade',
          icon: 'GiEvasion',
          shortDesc: 'After taking a Hit, +25% Evade chance for 2s',
          fullDesc: 'After taking a Hit:\nYou have +25% increased chance to Evade Attacks for 2 seconds',
          tier: 40,
          classId: 'ghostblade',
          effects: [
            { type: 'afterHitEffect', value: 25, description: 'After taking a Hit, you have +25% Evade chance for 2s' }
          ]
        },
        {
          id: 'gb_r3_ethereal_buffer',
          name: 'Ethereal Buffer',
          icon: 'GiShieldReflect',
          shortDesc: 'After taking a Hit, you take 20% less Damage for 1s',
          fullDesc: 'After taking a Hit:\nYou take 20% less Damage Taken from Hits for 1 second',
          tier: 40,
          classId: 'ghostblade',
          effects: [
            { type: 'afterHitEffect', value: 20, description: 'After taking a Hit, you take 20% less Damage for 1s' }
          ]
        },
        {
          id: 'gb_r3_phase_scar',
          name: 'Phase Scar',
          icon: 'GiHealing',
          shortDesc: 'After taking a Hit, regenerate 15% of Max Life over 2s',
          fullDesc: 'After taking a Hit:\nYou gain 15% of Maximum Life as Life over 2 seconds',
          flavorNote: 'Ensures Ghostblade doesn\'t explode to one bad roll',
          tier: 40,
          classId: 'ghostblade',
          effects: [
            { type: 'afterHitEffect', value: 15, description: 'After taking a Hit, regenerate 15% of Max Life over 2s' }
          ]
        }
      ]
    },
    // ROW 4 — Anti-Burst Identity
    {
      level: 55,
      rowName: 'Anti-Burst Identity',
      rowTheme: 'How you survive tank busters',
      rowIcon: 'GiShieldBounces',
      talents: [
        {
          id: 'gb_r4_miss_chain',
          name: 'Miss Chain',
          icon: 'GiChainLightning',
          shortDesc: 'Evading 2 hits in a row: next hit deals 30% less Damage',
          fullDesc: 'If you Evade 2 consecutive Hits:\nYou take 30% less Damage from the next Hit',
          tier: 55,
          classId: 'ghostblade',
          effects: [
            { type: 'consecutiveEvadeBonus', value: 30, description: 'After evading 2 consecutive hits, next hit deals 30% less Damage' }
          ]
        },
        {
          id: 'gb_r4_one_bad_moment',
          name: 'One Bad Moment',
          icon: 'GiHealthDecrease',
          shortDesc: 'Hits dealing >40% of your Max Life deal 20% less Damage',
          fullDesc: 'Hits that deal more than 40% of your Maximum Life\nDeal 20% less Damage to you',
          tier: 55,
          classId: 'ghostblade',
          effects: [
            { type: 'bigHitReduction', value: 20, description: 'Hits dealing >40% Max Life deal 20% less Damage', condition: 'bigHit40' }
          ]
        },
        {
          id: 'gb_r4_shallow_reality',
          name: 'Shallow Reality',
          icon: 'GiCrystalWand',
          shortDesc: 'Enemy Critical Strikes deal 25% reduced Crit Damage to you',
          fullDesc: 'Critical Strikes against you deal\n25% reduced Critical Strike Damage',
          tier: 55,
          classId: 'ghostblade',
          effects: [
            { type: 'enemyCritDamageReduction', value: 25, description: 'Enemy crits deal 25% reduced Critical Damage to you' }
          ]
        }
      ]
    },
    // ROW 5 — Party Utility
    {
      level: 70,
      rowName: 'Party Utility',
      rowTheme: 'Ghostblade helps the group indirectly',
      rowIcon: 'GiTwoShadows',
      talents: [
        {
          id: 'gb_r5_veil_of_doubt',
          name: 'Veil of Doubt',
          icon: 'GiSmokeBomb',
          shortDesc: 'Enemies you Evade deal 10% less Damage to Allies for 2s',
          fullDesc: 'Enemies you Evade deal\n10% reduced Damage to Allies for 2 seconds',
          tier: 70,
          classId: 'ghostblade',
          effects: [
            { type: 'onEvadeEffect', value: 10, description: 'Enemies you Evade deal 10% reduced Damage to Allies for 2s' }
          ]
        },
        {
          id: 'gb_r5_phantom_pressure',
          name: 'Phantom Pressure',
          icon: 'GiPressureCooker',
          shortDesc: 'Nearby enemies have 15% reduced Accuracy Rating',
          fullDesc: 'Enemies near you have\n15% reduced Accuracy Rating',
          tier: 70,
          classId: 'ghostblade',
          effects: [
            { type: 'enemyAccuracy', value: 15, description: 'Nearby enemies have 15% reduced Accuracy Rating' }
          ]
        },
        {
          id: 'gb_r5_shadow_screen',
          name: 'Shadow Screen',
          icon: 'GiShield',
          shortDesc: 'Allies gain +10% chance to Evade Attacks',
          fullDesc: 'Allies gain\n10% increased chance to Evade Attacks',
          flavorNote: 'Makes Ghostblade valuable even if RNG is being cruel',
          tier: 70,
          classId: 'ghostblade',
          effects: [
            { type: 'allyEvadeChance', value: 10, description: 'Allies gain +10% chance to Evade Attacks' }
          ]
        }
      ]
    },
    // ROW 6 — Capstone Identity
    {
      level: 85,
      rowName: 'Capstone Identity',
      rowTheme: 'Defines the endgame feel',
      rowIcon: 'GiCrown',
      talents: [
        {
          id: 'gb_r6_untethered',
          name: 'Untethered',
          icon: 'GiAura',
          shortDesc: 'While above 75% Life, you have 20% more Evasion Rating',
          fullDesc: 'While above 75% Life:\nYou have 20% more Evasion Rating',
          tier: 85,
          classId: 'ghostblade',
          effects: [
            { type: 'conditionalEvasion', value: 20, description: 'While above 75% Life, you have 20% more Evasion Rating', condition: 'above75Life' }
          ]
        },
        {
          id: 'gb_r6_fade_between_hits',
          name: 'Fade Between Hits',
          icon: 'GiPhantom',
          shortDesc: 'If you Evaded recently, you take 15% less Damage',
          fullDesc: 'If you have Evaded a Hit Recently:\nYou take 15% less Damage',
          tier: 85,
          classId: 'ghostblade',
          effects: [
            { type: 'lessDamageIfEvadedRecently', value: 15, description: 'If you Evaded recently, you take 15% less Damage' }
          ]
        },
        {
          id: 'gb_r6_inevitable_miss',
          name: 'Inevitable Miss',
          icon: 'GiHourglass',
          shortDesc: 'Enemies cannot hit you more than once every 0.5 seconds',
          fullDesc: 'Enemies cannot hit you more than\nonce every 0.5 seconds',
          flavorNote: 'Hard cap smoothing without breaking PoE rules',
          tier: 85,
          classId: 'ghostblade',
          effects: [
            { type: 'enemyHitCooldown', value: 0.5, description: 'Enemies cannot hit you more than once every 0.5s' }
          ]
        }
      ]
    }
  ]
};

// ==================== ARCANE BULWARK TALENTS ====================
const ARCANE_BULWARK_TALENTS: ClassTalentTree = {
  classId: 'arcane_bulwark',
  className: 'Arcane Bulwark',
  classTheme: 'Energy Shield / Arcane Defense Tank — Leans fully into ES as primary health, stabilizes through block interactions and elemental mitigation',
  tiers: [
    // ROW 1 — How your Energy Shield behaves
    {
      level: 10,
      rowName: 'Energy Shield Behavior',
      rowTheme: 'Big ES pool vs faster recovery vs consistency under pressure',
      rowIcon: 'GiEnergyShield',
      talents: [
        {
          id: 'ab_r1_reinforced_barriers',
          name: 'Reinforced Barriers',
          icon: 'GiShieldBounces',
          shortDesc: 'You have 30% more Energy Shield',
          fullDesc: 'You have 30% more Energy Shield',
          tier: 10,
          classId: 'arcane_bulwark',
          effects: [
            { type: 'maxESBonus', value: 30, description: 'You have 30% more Energy Shield' }
          ]
        },
        {
          id: 'ab_r1_rapid_reconstitution',
          name: 'Rapid Reconstitution',
          icon: 'GiSpeedometer',
          shortDesc: '+40% ES Recharge Rate, –30% Recharge Delay',
          fullDesc: 'You have 40% increased Energy Shield Recharge Rate\nYou have 30% reduced Energy Shield Recharge Delay',
          tier: 10,
          classId: 'arcane_bulwark',
          effects: [
            { type: 'esRechargeRate', value: 40, description: 'You have 40% increased ES Recharge Rate' },
            { type: 'esRechargeDelay', value: 30, description: 'You have 30% reduced ES Recharge Delay' }
          ]
        },
        {
          id: 'ab_r1_stable_matrix',
          name: 'Stable Matrix',
          icon: 'GiCrystalGrowth',
          shortDesc: 'ES Recharge is not interrupted by blocked hits',
          fullDesc: 'Your Energy Shield Recharge is not interrupted by blocked hits',
          tier: 10,
          classId: 'arcane_bulwark',
          effects: [
            { type: 'esRechargeNotInterruptedByBlock', value: 1, description: 'ES Recharge is not interrupted by blocked hits' }
          ]
        }
      ]
    },
    // ROW 2 — Block interaction with Energy Shield
    {
      level: 25,
      rowName: 'Block & ES Interaction',
      rowTheme: 'Redirect damage, reduce damage, or block more often',
      rowIcon: 'GiShieldBash',
      talents: [
        {
          id: 'ab_r2_arcane_parry',
          name: 'Arcane Parry',
          icon: 'GiShieldReflect',
          shortDesc: 'Blocked hits deal damage to ES before Life',
          fullDesc: 'Blocked hits deal damage to Energy Shield before Life\n(Even if Life would normally be hit)',
          tier: 25,
          classId: 'arcane_bulwark',
          effects: [
            { type: 'blockedDamageToESFirst', value: 1, description: 'Blocked hits deal damage to ES before Life' }
          ]
        },
        {
          id: 'ab_r2_runic_deflection',
          name: 'Runic Deflection',
          icon: 'GiRuneStone',
          shortDesc: 'Blocked hits deal 20% less damage',
          fullDesc: 'Blocked hits deal 20% less damage',
          tier: 25,
          classId: 'arcane_bulwark',
          effects: [
            { type: 'blockEffectiveness', value: 20, description: 'Blocked hits deal 20% less damage' }
          ]
        },
        {
          id: 'ab_r2_shielded_core',
          name: 'Shielded Core',
          icon: 'GiMagicShield',
          shortDesc: '+15% Attack Block, +15% Spell Block',
          fullDesc: 'You have +15% chance to Block Attack Damage\nYou have +15% chance to Block Spell Damage',
          tier: 25,
          classId: 'arcane_bulwark',
          effects: [
            { type: 'blockBonus', value: 15, description: 'You have +15% chance to Block Attack Damage' },
            { type: 'spellBlockBonus', value: 15, description: 'You have +15% chance to Block Spell Damage' }
          ]
        }
      ]
    },
    // ROW 3 — Elemental pressure handling
    {
      level: 40,
      rowName: 'Elemental Pressure',
      rowTheme: 'General reduction vs higher caps vs ES-gated mitigation',
      rowIcon: 'GiMagicSwirl',
      talents: [
        {
          id: 'ab_r3_elemental_dampeners',
          name: 'Elemental Dampeners',
          icon: 'GiWaveCrest',
          shortDesc: 'You take 10% reduced Elemental Damage',
          fullDesc: 'You take 10% reduced Elemental Damage',
          tier: 40,
          classId: 'arcane_bulwark',
          effects: [
            { type: 'elementalDamageReduction', value: 10, description: 'You take 10% reduced Elemental Damage' }
          ]
        },
        {
          id: 'ab_r3_arcane_insulation',
          name: 'Arcane Insulation',
          icon: 'GiFireShield',
          shortDesc: '+5% to all Elemental Resistances (can exceed cap)',
          fullDesc: 'You have +5% to all Elemental Resistances\n(Can exceed the normal cap)',
          tier: 40,
          classId: 'arcane_bulwark',
          effects: [
            { type: 'elementalResistanceBonus', value: 5, description: '+5% to all Elemental Resistances (can exceed cap)' }
          ]
        },
        {
          id: 'ab_r3_prismatic_guard',
          name: 'Prismatic Guard',
          icon: 'GiPrism',
          shortDesc: 'While ES > 0, you take 15% less Elemental Damage',
          fullDesc: 'While on Energy Shield, you take 15% less Elemental Damage\n(Applies as long as ES > 0)',
          tier: 40,
          classId: 'arcane_bulwark',
          effects: [
            { type: 'elementalDRWhileES', value: 15, description: 'While ES > 0, you take 15% less Elemental Damage' }
          ]
        }
      ]
    },
    // ROW 4 — Energy Shield sustain model
    {
      level: 55,
      rowName: 'ES Sustain Model',
      rowTheme: 'Block sustain vs always-on recharge vs offensive sustain',
      rowIcon: 'GiHealing',
      talents: [
        {
          id: 'ab_r4_feedback_loop',
          name: 'Feedback Loop',
          icon: 'GiRecycle',
          shortDesc: '10% of damage blocked is recovered as ES',
          fullDesc: '10% of damage blocked is recovered as Energy Shield',
          tier: 55,
          classId: 'arcane_bulwark',
          effects: [
            { type: 'blockDamageToES', value: 10, description: '10% of damage blocked is recovered as ES' }
          ]
        },
        {
          id: 'ab_r4_overflow_lattice',
          name: 'Overflow Lattice',
          icon: 'GiWaterfall',
          shortDesc: 'ES Recharge continues while taking damage (50% slower)',
          fullDesc: 'Your Energy Shield Recharge continues while taking damage\nYour Recharge Rate is 50% less',
          tier: 55,
          classId: 'arcane_bulwark',
          effects: [
            { type: 'esRechargeNotInterrupted', value: 1, description: 'ES Recharge continues while taking damage' },
            { type: 'esRechargeSlowed', value: 50, description: 'Your ES Recharge Rate is 50% less' }
          ]
        },
        {
          id: 'ab_r4_arcane_leech',
          name: 'Arcane Leech',
          icon: 'GiVampireDracula',
          shortDesc: '1% of Damage dealt is Leeched as Energy Shield',
          fullDesc: '1% of Damage dealt is Leeched as Energy Shield',
          tier: 55,
          classId: 'arcane_bulwark',
          effects: [
            { type: 'esLeech', value: 1, description: '1% of Damage dealt is Leeched as ES' }
          ]
        }
      ]
    },
    // ROW 5 — Party utility
    {
      level: 70,
      rowName: 'Party Utility',
      rowTheme: 'Shield sharing vs elemental protection vs reactive DR',
      rowIcon: 'GiTwoShadows',
      talents: [
        {
          id: 'ab_r5_mana_aegis',
          name: 'Mana Aegis',
          icon: 'GiShieldEchoes',
          shortDesc: 'Allies gain 10% of your ES as additional ES',
          fullDesc: 'Nearby allies gain 10% of your Energy Shield as additional Energy Shield',
          tier: 70,
          classId: 'arcane_bulwark',
          effects: [
            { type: 'allyESFromYours', value: 10, description: 'Allies gain 10% of your ES as additional ES' }
          ]
        },
        {
          id: 'ab_r5_arcane_bastion',
          name: 'Arcane Bastion',
          icon: 'GiCastle',
          shortDesc: 'Nearby allies take 8% reduced Elemental Damage',
          fullDesc: 'Nearby allies take 8% reduced Elemental Damage',
          tier: 70,
          classId: 'arcane_bulwark',
          effects: [
            { type: 'allyElementalDamageReduction', value: 8, description: 'Nearby allies take 8% reduced Elemental Damage' }
          ]
        },
        {
          id: 'ab_r5_shared_barriers',
          name: 'Shared Barriers',
          icon: 'GiShieldBounces',
          shortDesc: 'When you block, allies gain 5% reduced Damage for 3s',
          fullDesc: 'When you block, allies gain 5% reduced Damage taken for 3 seconds',
          tier: 70,
          classId: 'arcane_bulwark',
          effects: [
            { type: 'onBlockAllyDR', value: 5, description: 'When you block, allies gain 5% reduced Damage for 3s' }
          ]
        }
      ]
    },
    // ROW 6 — Capstone Identity
    {
      level: 85,
      rowName: 'Capstone Identity',
      rowTheme: 'Chaos solution vs ES buffer vs high-risk high-reward stability',
      rowIcon: 'GiCrown',
      talents: [
        {
          id: 'ab_r6_infinite_shell',
          name: 'Infinite Shell',
          icon: 'GiMagicShield',
          shortDesc: 'Chaos Damage no longer bypasses Energy Shield',
          fullDesc: 'Damage taken cannot bypass Energy Shield\n(Chaos damage no longer bypasses ES)',
          tier: 85,
          classId: 'arcane_bulwark',
          effects: [
            { type: 'chaosDoesNotBypassES', value: 1, description: 'Chaos Damage no longer bypasses Energy Shield' }
          ]
        },
        {
          id: 'ab_r6_overcharged_wards',
          name: 'Overcharged Wards',
          icon: 'GiLightningShield',
          shortDesc: 'ES can exceed maximum by 20% (excess decays)',
          fullDesc: 'Energy Shield can exceed maximum by 20%\nExcess ES decays over time',
          tier: 85,
          classId: 'arcane_bulwark',
          effects: [
            { type: 'esOvercharge', value: 20, description: 'ES can exceed maximum by 20% (excess decays)' }
          ]
        },
        {
          id: 'ab_r6_crystal_citadel',
          name: 'Crystal Citadel',
          icon: 'GiCrystalBars',
          shortDesc: 'Full ES: 25% less Damage; Not full: 10% more Damage',
          fullDesc: 'While on full Energy Shield, you take 25% less Damage\nWhile not on full Energy Shield, you take 10% more Damage',
          tier: 85,
          classId: 'arcane_bulwark',
          effects: [
            { type: 'crystalCitadelEffect', value: 25, description: 'Full ES: 25% less Damage; Not full: 10% more Damage' }
          ]
        }
      ]
    }
  ]
};

// ==================== NULL TEMPLAR TALENTS ====================
const NULL_TEMPLAR_TALENTS: ClassTalentTree = {
  classId: 'null_templar',
  className: 'Null Templar',
  classTheme: 'Void / Chaos Dampening Tank — Stabilizes chaos damage, dampens magical pressure, and protects allies from spell-heavy encounters',
  tiers: [
    // ROW 1 — How You Handle Chaos Damage
    {
      level: 10,
      rowName: 'Chaos Damage Control',
      rowTheme: 'Chaos is the defining weakness of ES tanks. Pick how you address it.',
      rowIcon: 'GiVortex',
      talents: [
        {
          id: 'nt_r1_void_tempering',
          name: 'Void Tempering',
          icon: 'GiAnvil',
          shortDesc: 'Your Armour applies to Chaos Damage at 50% effectiveness',
          fullDesc: 'Armour applies to Chaos Damage at 50% effectiveness',
          tier: 10,
          classId: 'null_templar',
          effects: [
            { type: 'armorToChaosDamage', value: 50, description: 'Your Armour applies to Chaos Damage at 50% effectiveness' }
          ]
        },
        {
          id: 'nt_r1_unholy_resistance',
          name: 'Unholy Resistance',
          icon: 'GiPentacle',
          shortDesc: '+15% Chaos Resistance, +5% to maximum Chaos Resistance',
          fullDesc: 'You have +15% Chaos Resistance\nYou have +5% to maximum Chaos Resistance',
          tier: 10,
          classId: 'null_templar',
          effects: [
            { type: 'chaosResistance', value: 15, description: 'You have +15% Chaos Resistance' },
            { type: 'maxChaosResistance', value: 5, description: 'You have +5% to maximum Chaos Resistance' }
          ]
        },
        {
          id: 'nt_r1_entropic_buffer',
          name: 'Entropic Buffer',
          icon: 'GiAbsorb',
          shortDesc: '25% of Chaos Damage is prevented, but lost as ES instead',
          fullDesc: '25% of Chaos Damage taken is prevented\nPrevented damage is lost as Energy Shield instead',
          tier: 10,
          classId: 'null_templar',
          effects: [
            { type: 'chaosDamagePrevention', value: 25, description: '25% of Chaos Damage is prevented, lost as ES instead' }
          ]
        }
      ]
    },
    // ROW 2 — Energy Shield Stability
    {
      level: 25,
      rowName: 'Energy Shield Stability',
      rowTheme: 'You will always be taking hits. This defines how ES behaves under pressure.',
      rowIcon: 'GiEnergyShield',
      talents: [
        {
          id: 'nt_r2_void_lattice',
          name: 'Void Lattice',
          icon: 'GiCrystalGrowth',
          shortDesc: 'Your Energy Shield Recharge Delay is 30% shorter',
          fullDesc: 'Your Energy Shield Recharge Delay is reduced by 30%',
          tier: 25,
          classId: 'null_templar',
          effects: [
            { type: 'esRechargeDelay', value: 30, description: 'Your ES Recharge Delay is reduced by 30%' }
          ]
        },
        {
          id: 'nt_r2_null_feedback',
          name: 'Null Feedback',
          icon: 'GiRecycle',
          shortDesc: '10% of Elemental Damage taken is recouped as ES',
          fullDesc: '10% of Elemental Damage taken is recouped as Energy Shield',
          tier: 25,
          classId: 'null_templar',
          effects: [
            { type: 'elementalDamageToES', value: 10, description: '10% of Elemental Damage taken is recouped as ES' }
          ]
        },
        {
          id: 'nt_r2_collapsed_aegis',
          name: 'Collapsed Aegis',
          icon: 'GiShieldDisabled',
          shortDesc: 'ES Recharge is 40% slower, but never interrupted by damage',
          fullDesc: 'Your Energy Shield Recharge Rate is 40% slower\nYour Energy Shield Recharge is not interrupted by damage',
          flavorNote: 'Very PoE. Very strong. Clear downside.',
          tier: 25,
          classId: 'null_templar',
          effects: [
            { type: 'esRechargeSlowed', value: 40, description: 'Your ES Recharge Rate is 40% slower' },
            { type: 'esRechargeNotInterrupted', value: 1, description: 'Your ES Recharge is not interrupted by damage' }
          ]
        }
      ]
    },
    // ROW 3 — Spell Pressure Smoothing
    {
      level: 40,
      rowName: 'Spell Pressure Smoothing',
      rowTheme: 'Not avoidance — reduction and consistency',
      rowIcon: 'GiMagicSwirl',
      talents: [
        {
          id: 'nt_r3_arcane_dampeners',
          name: 'Arcane Dampeners',
          icon: 'GiWaveCrest',
          shortDesc: 'You take 10% reduced Elemental Damage',
          fullDesc: 'You take 10% reduced Elemental Damage',
          tier: 40,
          classId: 'null_templar',
          effects: [
            { type: 'elementalDamageReduction', value: 10, description: 'You take 10% reduced Elemental Damage' }
          ]
        },
        {
          id: 'nt_r3_void_attenuation',
          name: 'Void Attenuation',
          icon: 'GiSpellBook',
          shortDesc: 'You take 8% reduced Spell Damage',
          fullDesc: 'Spell Damage taken is reduced by 8%',
          tier: 40,
          classId: 'null_templar',
          effects: [
            { type: 'spellDamageReduction', value: 8, description: 'You take 8% reduced Spell Damage' }
          ]
        },
        {
          id: 'nt_r3_entropy_sink',
          name: 'Entropy Sink',
          icon: 'GiAbsorbtion',
          shortDesc: 'When you take Spell Damage, allies take 6% less Spell Damage for 3s',
          fullDesc: 'When you take Spell Damage, allies take 6% reduced Spell Damage\nDuration: 3 seconds\nEffect refreshes on spell hit',
          tier: 40,
          classId: 'null_templar',
          effects: [
            { type: 'allySpellDamageReductionOnHit', value: 6, description: 'When you take Spell Damage, allies take 6% less for 3s' }
          ]
        }
      ]
    },
    // ROW 4 — Party Protection
    {
      level: 55,
      rowName: 'Party Protection',
      rowTheme: 'Null Templar should make caster-heavy fights easier for the whole group',
      rowIcon: 'GiTwoShadows',
      talents: [
        {
          id: 'nt_r4_void_bastion',
          name: 'Void Bastion',
          icon: 'GiCastle',
          shortDesc: 'Nearby allies gain +10% Chaos Resistance',
          fullDesc: 'Nearby allies gain +10% Chaos Resistance',
          tier: 55,
          classId: 'null_templar',
          effects: [
            { type: 'allyChaosResistance', value: 10, description: 'Nearby allies gain +10% Chaos Resistance' }
          ]
        },
        {
          id: 'nt_r4_arcane_nullfield',
          name: 'Arcane Nullfield',
          icon: 'GiMagicShield',
          shortDesc: 'Nearby allies take 6% reduced Elemental Damage',
          fullDesc: 'Nearby allies take 6% reduced Elemental Damage',
          tier: 55,
          classId: 'null_templar',
          effects: [
            { type: 'allyElementalDamageReduction', value: 6, description: 'Nearby allies take 6% reduced Elemental Damage' }
          ]
        },
        {
          id: 'nt_r4_shared_dissolution',
          name: 'Shared Dissolution',
          icon: 'GiShadowGrasp',
          shortDesc: '5% of ally Spell Damage is redirected to you as Chaos Damage',
          fullDesc: '5% of Spell Damage taken by allies is redirected to you\nYou take this damage as Chaos Damage',
          flavorNote: 'Synergizes heavily with Row 1 choices.',
          tier: 55,
          classId: 'null_templar',
          effects: [
            { type: 'allySpellDamageRedirect', value: 5, description: '5% of ally Spell Damage is redirected to you as Chaos' }
          ]
        }
      ]
    },
    // ROW 5 — Scaling Defense Identity
    {
      level: 70,
      rowName: 'Scaling Defense Identity',
      rowTheme: 'How the tank grows with gear and content',
      rowIcon: 'GiUpgrade',
      talents: [
        {
          id: 'nt_r5_void_forged_plating',
          name: 'Void-forged Plating',
          icon: 'GiChestArmor',
          shortDesc: 'You have 20% more Armour',
          fullDesc: 'You have 20% more Armour',
          tier: 70,
          classId: 'null_templar',
          effects: [
            { type: 'armorBonus', value: 20, description: 'You have 20% more Armour' }
          ]
        },
        {
          id: 'nt_r5_entropy_engine',
          name: 'Entropy Engine',
          icon: 'GiEnergyShield',
          shortDesc: 'You have 15% more maximum Energy Shield',
          fullDesc: 'You have 15% more maximum Energy Shield',
          tier: 70,
          classId: 'null_templar',
          effects: [
            { type: 'maxESBonus', value: 15, description: 'You have 15% more maximum Energy Shield' }
          ]
        },
        {
          id: 'nt_r5_chaotic_reinforcement',
          name: 'Chaotic Reinforcement',
          icon: 'GiPentarrowsTornado',
          shortDesc: 'Chaos Resistance also reduces Elemental Damage at 25% value',
          fullDesc: 'Chaos Resistance also applies to Elemental Damage at 25% of its value\n(Example: 60% Chaos Res → 15% Elemental DR)',
          tier: 70,
          classId: 'null_templar',
          effects: [
            { type: 'chaosResToElementalDR', value: 25, description: 'Chaos Res applies to Elemental Damage at 25% effectiveness' }
          ]
        }
      ]
    },
    // ROW 6 — Capstone: Encounter Warping
    {
      level: 85,
      rowName: 'Capstone Identity',
      rowTheme: 'These should feel build-defining but not invincible',
      rowIcon: 'GiCrown',
      talents: [
        {
          id: 'nt_r6_absolute_null',
          name: 'Absolute Null',
          icon: 'GiVoid',
          shortDesc: 'Spell Damage cannot exceed 50% of your maximum Life',
          fullDesc: 'Damage taken from Spells cannot exceed 50% of your maximum Life',
          flavorNote: 'Tank-buster protection without trivializing everything.',
          tier: 85,
          classId: 'null_templar',
          effects: [
            { type: 'spellDamageCap', value: 50, description: 'Spell Damage cannot exceed 50% of your maximum Life' }
          ]
        },
        {
          id: 'nt_r6_void_incarnation',
          name: 'Void Incarnation',
          icon: 'GiDragonSpiral',
          shortDesc: '20% of Physical Damage taken as Chaos; 10% reduced Chaos Damage',
          fullDesc: '20% of Physical Damage taken is converted to Chaos Damage\nYou take 10% reduced Chaos Damage',
          tier: 85,
          classId: 'null_templar',
          effects: [
            { type: 'physicalToChaosDamage', value: 20, description: '20% of Physical Damage taken is converted to Chaos' },
            { type: 'chaosDamageReduction', value: 10, description: 'You take 10% reduced Chaos Damage' }
          ]
        },
        {
          id: 'nt_r6_entropy_anchor',
          name: 'Entropy Anchor',
          icon: 'GiAnchor',
          shortDesc: 'ES > 0: 10% reduced Damage; ES = 0: 10% increased Damage',
          fullDesc: 'While Energy Shield is above 0:\nYou take 10% reduced Damage\nWhile Energy Shield is 0:\nYou take 10% increased Damage',
          flavorNote: 'Strong, honest, risky.',
          tier: 85,
          classId: 'null_templar',
          effects: [
            { type: 'entropyAnchorEffect', value: 10, description: 'ES > 0: 10% reduced Damage; ES = 0: 10% increased Damage' }
          ]
        }
      ]
    }
  ]
};

// ==================== PHASE GUARDIAN TALENTS ====================
const PHASE_GUARDIAN_TALENTS: ClassTalentTree = {
  classId: 'phase_guardian',
  className: 'Phase Guardian',
  classTheme: 'Dodge / Energy Shield Tank — Phases through attacks, rewards successful avoidance with ES sustain and damage reduction',
  tiers: [
    // ROW 1 — Avoidance Pattern
    {
      level: 10,
      rowName: 'Avoidance Pattern',
      rowTheme: 'How do you avoid hits?',
      rowIcon: 'GiDodge',
      talents: [
        {
          id: 'pg_r1_phase_reflexes',
          name: 'Phase Reflexes',
          icon: 'GiReflexes',
          shortDesc: '+15% Dodge, but –20% ES Recharge Rate',
          fullDesc: 'You have +15% chance to Dodge Attacks\nYou have –20% Energy Shield Recharge Rate',
          flavorNote: 'Maximum avoidance, weaker sustain',
          tier: 10,
          classId: 'phase_guardian',
          effects: [
            { type: 'dodgeChance', value: 15, description: 'You have +15% chance to Dodge Attacks' },
            { type: 'esRechargeRate', value: -20, description: 'You have –20% ES Recharge Rate' }
          ]
        },
        {
          id: 'pg_r1_anchored_phase',
          name: 'Anchored Phase',
          icon: 'GiAnchor',
          shortDesc: '–10% Dodge, but +40% ES Recharge Rate',
          fullDesc: 'You have –10% chance to Dodge Attacks\nYou have +40% Energy Shield Recharge Rate',
          flavorNote: 'More reliable ES uptime, fewer dodges',
          tier: 10,
          classId: 'phase_guardian',
          effects: [
            { type: 'dodgeChance', value: -10, description: 'You have –10% chance to Dodge Attacks' },
            { type: 'esRechargeRate', value: 40, description: 'You have +40% ES Recharge Rate' }
          ]
        },
        {
          id: 'pg_r1_split_reality',
          name: 'Split Reality',
          icon: 'GiSplitCross',
          shortDesc: '+10% Dodge, +10% Spell Suppression',
          fullDesc: 'You have +10% chance to Dodge Attacks\nYou have +10% chance to Suppress Spell Damage',
          flavorNote: 'Balanced attack + spell smoothing',
          tier: 10,
          classId: 'phase_guardian',
          effects: [
            { type: 'dodgeChance', value: 10, description: 'You have +10% chance to Dodge Attacks' },
            { type: 'spellSuppressionChance', value: 10, description: 'You have +10% chance to Suppress Spell Damage' }
          ]
        }
      ]
    },
    // ROW 2 — Energy Shield Stability
    {
      level: 25,
      rowName: 'Energy Shield Stability',
      rowTheme: 'What happens when you do get hit?',
      rowIcon: 'GiEnergyShield',
      talents: [
        {
          id: 'pg_r2_phased_recovery',
          name: 'Phased Recovery',
          icon: 'GiSpeedometer',
          shortDesc: 'ES Recharge Delay is 30% shorter',
          fullDesc: 'Your Energy Shield Recharge Delay is reduced by 30%',
          flavorNote: 'ES comes back faster after hits',
          tier: 25,
          classId: 'phase_guardian',
          effects: [
            { type: 'esRechargeDelay', value: 30, description: 'ES Recharge Delay is reduced by 30%' }
          ]
        },
        {
          id: 'pg_r2_ghosted_impact',
          name: 'Ghosted Impact',
          icon: 'GiGhost',
          shortDesc: 'Hits that remove ES deal 15% less damage',
          fullDesc: 'Hits that remove Energy Shield deal 15% reduced damage',
          flavorNote: 'Smoother ES loss, better against fast hits',
          tier: 25,
          classId: 'phase_guardian',
          effects: [
            { type: 'esRemovalDamageReduction', value: 15, description: 'Hits that remove ES deal 15% less damage' }
          ]
        },
        {
          id: 'pg_r2_residual_phase',
          name: 'Residual Phase',
          icon: 'GiShieldReflect',
          shortDesc: 'When ES Recharge starts, gain 10% DR for 2s',
          fullDesc: 'When Energy Shield Recharge starts, you gain 10% reduced damage taken for 2 seconds',
          flavorNote: 'Short defensive window during recharge',
          tier: 25,
          classId: 'phase_guardian',
          effects: [
            { type: 'onESRechargeStartDR', value: 10, description: 'When ES Recharge starts, gain 10% DR for 2s' }
          ]
        }
      ]
    },
    // ROW 3 — Spell Interaction
    {
      level: 40,
      rowName: 'Spell Interaction',
      rowTheme: 'How do spells feel against you?',
      rowIcon: 'GiMagicSwirl',
      talents: [
        {
          id: 'pg_r3_slip_the_weave',
          name: 'Slip the Weave',
          icon: 'GiSpellBook',
          shortDesc: '+20% chance to Suppress Spell Damage',
          fullDesc: 'You have +20% chance to Suppress Spell Damage',
          flavorNote: 'Reliable spell smoothing',
          tier: 40,
          classId: 'phase_guardian',
          effects: [
            { type: 'spellSuppressionChance', value: 20, description: 'You have +20% chance to Suppress Spell Damage' }
          ]
        },
        {
          id: 'pg_r3_phase_diffusion',
          name: 'Phase Diffusion',
          icon: 'GiWaveCrest',
          shortDesc: 'Suppressed Spell Damage deals 10% less damage',
          fullDesc: 'Suppressed Spell Damage deals 10% less damage',
          flavorNote: 'Makes suppression stronger, not more frequent',
          tier: 40,
          classId: 'phase_guardian',
          effects: [
            { type: 'spellSuppressionEffect', value: 10, description: 'Suppressed Spell Damage deals 10% less damage' }
          ]
        },
        {
          id: 'pg_r3_ethereal_buffer',
          name: 'Ethereal Buffer',
          icon: 'GiAura',
          shortDesc: 'Spell Damage removes 10% less ES',
          fullDesc: 'Spell Damage taken from hits removes 10% less Energy Shield',
          flavorNote: 'Direct ES protection vs spells',
          tier: 40,
          classId: 'phase_guardian',
          effects: [
            { type: 'spellDamageESReduction', value: 10, description: 'Spell Damage removes 10% less ES' }
          ]
        }
      ]
    },
    // ROW 4 — Avoidance Payoff
    {
      level: 55,
      rowName: 'Avoidance Payoff',
      rowTheme: 'What do dodges give you?',
      rowIcon: 'GiPerspectiveDiceSixFacesRandom',
      talents: [
        {
          id: 'pg_r4_temporal_echo',
          name: 'Temporal Echo',
          icon: 'GiRecycle',
          shortDesc: 'Dodging grants +20% ES Recharge Rate for 2s',
          fullDesc: 'Dodging an Attack grants 20% increased Energy Shield Recharge Rate for 2 seconds',
          flavorNote: 'Avoidance fuels sustain',
          tier: 55,
          classId: 'phase_guardian',
          effects: [
            { type: 'onDodgeESRecharge', value: 20, description: 'Dodging grants +20% ES Recharge Rate for 2s' }
          ]
        },
        {
          id: 'pg_r4_afterphase',
          name: 'Afterphase',
          icon: 'GiShield',
          shortDesc: 'Dodging grants 8% reduced damage taken for 2s',
          fullDesc: 'Dodging an Attack grants 8% reduced damage taken for 2 seconds',
          flavorNote: 'Anti-RNG smoothing',
          tier: 55,
          classId: 'phase_guardian',
          effects: [
            { type: 'onDodgeDR', value: 8, description: 'Dodging grants 8% reduced damage taken for 2s' }
          ]
        },
        {
          id: 'pg_r4_phase_overlap',
          name: 'Phase Overlap',
          icon: 'GiHealing',
          shortDesc: 'Dodging restores 3% of maximum ES',
          fullDesc: 'Dodging an Attack restores 3% of maximum Energy Shield',
          flavorNote: 'Small but consistent recovery',
          tier: 55,
          classId: 'phase_guardian',
          effects: [
            { type: 'onDodgeESRestore', value: 3, description: 'Dodging restores 3% of maximum ES' }
          ]
        }
      ]
    },
    // ROW 5 — Party Utility
    {
      level: 70,
      rowName: 'Party Utility',
      rowTheme: 'How do you help the team survive?',
      rowIcon: 'GiTwoShadows',
      talents: [
        {
          id: 'pg_r5_phase_veil',
          name: 'Phase Veil',
          icon: 'GiSmokeBomb',
          shortDesc: 'Allies take 5% less damage while your ES is recharging',
          fullDesc: 'Allies take 5% reduced damage while your Energy Shield is recharging',
          flavorNote: 'Rewards successful avoidance play',
          tier: 70,
          classId: 'phase_guardian',
          effects: [
            { type: 'allyDRWhileRecharging', value: 5, description: 'Allies take 5% less damage while your ES is recharging' }
          ]
        },
        {
          id: 'pg_r5_distortion_field',
          name: 'Distortion Field',
          icon: 'GiVortex',
          shortDesc: 'Enemies have 10% reduced Accuracy targeting you',
          fullDesc: 'Enemies have 10% reduced Accuracy while targeting you',
          flavorNote: 'Indirect party mitigation',
          tier: 70,
          classId: 'phase_guardian',
          effects: [
            { type: 'enemyAccuracy', value: 10, description: 'Enemies have 10% reduced Accuracy targeting you' }
          ]
        },
        {
          id: 'pg_r5_slipstream_guard',
          name: 'Slipstream Guard',
          icon: 'GiRunningNinja',
          shortDesc: 'Allies gain +10% increased Evasion Rating',
          fullDesc: 'Allies gain 10% increased Evasion Rating',
          flavorNote: 'Passive, always useful',
          tier: 70,
          classId: 'phase_guardian',
          effects: [
            { type: 'allyEvasionRating', value: 10, description: 'Allies gain +10% increased Evasion Rating' }
          ]
        }
      ]
    },
    // ROW 6 — Capstone Identity
    {
      level: 85,
      rowName: 'Capstone Identity',
      rowTheme: 'What kind of Phase Guardian are you?',
      rowIcon: 'GiCrown',
      talents: [
        {
          id: 'pg_r6_untouchable_window',
          name: 'Untouchable Window',
          icon: 'GiHourglass',
          shortDesc: 'Dodging grants 50% DR for 1s (4s cooldown)',
          fullDesc: 'Dodging an Attack grants 50% reduced damage taken for 1 second\nCan only occur once every 4 seconds',
          flavorNote: 'Spike protection, controlled power',
          tier: 85,
          classId: 'phase_guardian',
          effects: [
            { type: 'untouchableWindowEffect', value: 50, description: 'Dodging grants 50% DR for 1s (4s cooldown)' }
          ]
        },
        {
          id: 'pg_r6_stable_paradox',
          name: 'Stable Paradox',
          icon: 'GiShieldReflect',
          shortDesc: 'ES Recharge is 30% slower but cannot be interrupted',
          fullDesc: 'Your Energy Shield Recharge Rate is 30% slower\nYour Energy Shield Recharge cannot be interrupted by damage',
          flavorNote: 'Extremely consistent ES tank',
          tier: 85,
          classId: 'phase_guardian',
          effects: [
            { type: 'esRechargeSlowed', value: 30, description: 'ES Recharge Rate is 30% slower' },
            { type: 'esRechargeNotInterrupted', value: 1, description: 'ES Recharge cannot be interrupted by damage' }
          ]
        },
        {
          id: 'pg_r6_phase_singularity',
          name: 'Phase Singularity',
          icon: 'GiVortex',
          shortDesc: '+20% Dodge, but –20% maximum ES',
          fullDesc: 'You have +20% chance to Dodge Attacks\nYou have –20% maximum Energy Shield',
          flavorNote: 'High-risk, high-avoidance archetype',
          tier: 85,
          classId: 'phase_guardian',
          effects: [
            { type: 'dodgeChance', value: 20, description: 'You have +20% chance to Dodge Attacks' },
            { type: 'maxESReduction', value: 20, description: 'You have –20% maximum Energy Shield' }
          ]
        }
      ]
    }
  ]
};

// ==================== HIGH CLERIC TALENTS ====================
const HIGH_CLERIC_TALENTS: ClassTalentTree = {
  classId: 'high_cleric',
  className: 'High Cleric',
  classTheme: 'Holy / Direct Healer — Master of single-target healing with powerful low-life response and party stabilization',
  tiers: [
    // ROW 1 — Single Target vs Area Focus
    {
      level: 10,
      rowName: 'Healing Focus',
      rowTheme: 'Single target vs area healing trade-offs',
      rowIcon: 'GiHealthPotion',
      talents: [
        {
          id: 'hc_r1_focused_benediction',
          name: 'Focused Benediction',
          icon: 'GiHealing',
          shortDesc: '+30% single-target Healing, –20% area Healing',
          fullDesc: 'Your single-target healing skills heal for 30% more\nYour area healing skills heal for 20% less',
          tier: 10,
          classId: 'high_cleric',
          effects: [
            { type: 'singleTargetHealingBonus', value: 30, description: 'Single-target healing skills heal for 30% more' },
            { type: 'areaHealingReduction', value: 20, description: 'Area healing skills heal for 20% less' }
          ]
        },
        {
          id: 'hc_r1_radiant_spillover',
          name: 'Radiant Spillover',
          icon: 'GiSparkles',
          shortDesc: '40% of excess Healing is redistributed to nearby allies',
          fullDesc: '40% of Excess Healing is redistributed evenly to nearby allies',
          tier: 10,
          classId: 'high_cleric',
          effects: [
            { type: 'excessHealingRedistribution', value: 40, description: '40% of excess Healing is redistributed to allies' }
          ]
        },
        {
          id: 'hc_r1_measured_reach',
          name: 'Measured Reach',
          icon: 'GiFocusedLightning',
          shortDesc: 'Area heals hit 25% fewer targets for 35% more Healing each',
          fullDesc: 'Area healing skills affect 25% fewer targets\nAffected targets receive 35% more Healing',
          tier: 10,
          classId: 'high_cleric',
          effects: [
            { type: 'areaTargetReduction', value: 25, description: 'Area heals affect 25% fewer targets' },
            { type: 'areaHealingPerTargetBonus', value: 35, description: 'Affected targets receive 35% more Healing' }
          ]
        }
      ]
    },
    // ROW 2 — Mana Efficiency Model
    {
      level: 25,
      rowName: 'Mana Efficiency',
      rowTheme: 'How you manage your healing resources',
      rowIcon: 'GiWaterDrop',
      talents: [
        {
          id: 'hc_r2_sacred_economy',
          name: 'Sacred Economy',
          icon: 'GiMoneyStack',
          shortDesc: 'Healing costs 20% less Mana, heals for 15% less',
          fullDesc: 'Your healing skills cost 20% less Mana\nYour healing skills heal for 15% less',
          tier: 25,
          classId: 'high_cleric',
          effects: [
            { type: 'manaReduction', value: 20, description: 'Healing skills cost 20% less Mana' },
            { type: 'healingReduction', value: 15, description: 'Healing skills heal for 15% less' }
          ]
        },
        {
          id: 'hc_r2_overflow_devotion',
          name: 'Overflow Devotion',
          icon: 'GiWaterfall',
          shortDesc: 'Excess Healing is stored and released when ally drops below 50%',
          fullDesc: 'Excess Healing is stored (up to 10% of your maximum Mana)\nStored healing is released automatically when an ally drops below 50% Life',
          tier: 25,
          classId: 'high_cleric',
          effects: [
            { type: 'excessHealingStorage', value: 10, description: 'Store excess healing, release when ally < 50% Life' }
          ]
        },
        {
          id: 'hc_r2_faithful_channel',
          name: 'Faithful Channel',
          icon: 'GiPrayerBeads',
          shortDesc: 'Repeatedly healing same target grants +8% Healing (stacks 5x)',
          fullDesc: 'Repeatedly healing the same target grants 8% increased Healing, stacking up to 5 times\nStacks reset if you heal a different target',
          tier: 25,
          classId: 'high_cleric',
          effects: [
            { type: 'faithfulChannelEffect', value: 8, description: 'Repeated healing same target +8% per stack (max 5)' }
          ]
        }
      ]
    },
    // ROW 3 — Low-Life Response
    {
      level: 40,
      rowName: 'Low-Life Response',
      rowTheme: 'How you respond to critically injured allies',
      rowIcon: 'GiHeartBeats',
      talents: [
        {
          id: 'hc_r3_last_rites',
          name: 'Last Rites',
          icon: 'GiAngelWings',
          shortDesc: '+40% Healing on targets below 35% Life',
          fullDesc: 'Your healing skills heal for 40% more on targets below 35% Life',
          tier: 40,
          classId: 'high_cleric',
          effects: [
            { type: 'lowLifeHealingBonus', value: 40, description: 'Healing is 40% more effective on targets below 35% Life' }
          ]
        },
        {
          id: 'hc_r3_steady_grace',
          name: 'Steady Grace',
          icon: 'GiMeditation',
          shortDesc: '+20% Healing, but healing cannot Crit',
          fullDesc: 'Your healing skills heal for 20% more\nYour healing skills cannot Critically Strike',
          tier: 40,
          classId: 'high_cleric',
          effects: [
            { type: 'healingIncrease', value: 20, description: 'Healing skills heal for 20% more' },
            { type: 'healingCannotCrit', value: 1, description: 'Healing skills cannot Critically Strike' }
          ]
        },
        {
          id: 'hc_r3_crisis_focus',
          name: 'Crisis Focus',
          icon: 'GiEmergencyElevator',
          shortDesc: 'After ally takes 20%+ Life hit, next heal on them is +50%',
          fullDesc: 'After an ally takes a hit dealing 20% or more of their maximum Life:\nYour next heal on them has 50% increased Healing',
          tier: 40,
          classId: 'high_cleric',
          effects: [
            { type: 'crisisFocusEffect', value: 50, description: 'After ally takes big hit, next heal +50%' }
          ]
        }
      ]
    },
    // ROW 4 — Party Stabilization
    {
      level: 55,
      rowName: 'Party Stabilization',
      rowTheme: 'How you keep the whole party stable',
      rowIcon: 'GiTwoShadows',
      talents: [
        {
          id: 'hc_r4_beacon_of_mercy',
          name: 'Beacon of Mercy',
          icon: 'GiLighthouse',
          shortDesc: '30% of lowest-Life ally healing is duplicated to another injured ally',
          fullDesc: '30% of Healing you deal to the lowest-Life party member is duplicated to another injured ally',
          tier: 55,
          classId: 'high_cleric',
          effects: [
            { type: 'beaconOfMercyEffect', value: 30, description: '30% of lowest-Life healing is duplicated' }
          ]
        },
        {
          id: 'hc_r4_shared_salvation',
          name: 'Shared Salvation',
          icon: 'GiHeartPlus',
          shortDesc: 'Healing ally above 90% redirects 20% to most injured',
          fullDesc: 'When you heal an ally above 90% Life:\n20% of that healing is redirected to the most injured party member',
          tier: 55,
          classId: 'high_cleric',
          effects: [
            { type: 'sharedSalvationEffect', value: 20, description: 'Overhealing above 90% redirects 20% to most injured' }
          ]
        },
        {
          id: 'hc_r4_unified_faith',
          name: 'Unified Faith',
          icon: 'GiShieldEchoes',
          shortDesc: 'Allies above 70% Life take 10% reduced Damage',
          fullDesc: 'Party members within your healing range take 10% reduced Damage while above 70% Life',
          tier: 55,
          classId: 'high_cleric',
          effects: [
            { type: 'allyDRWhileHighLife', value: 10, description: 'Allies above 70% Life take 10% reduced Damage' }
          ]
        }
      ]
    },
    // ROW 5 — Recovery vs Throughput
    {
      level: 70,
      rowName: 'Recovery vs Throughput',
      rowTheme: 'Sustained healing over time vs burst healing',
      rowIcon: 'GiHealing',
      talents: [
        {
          id: 'hc_r5_lingering_light',
          name: 'Lingering Light',
          icon: 'GiSunbeams',
          shortDesc: 'Healing skills also apply 25% of healing as HoT over 4s',
          fullDesc: 'Healing skills apply a heal-over-time effect equal to 25% of the healing dealt over 4 seconds',
          tier: 70,
          classId: 'high_cleric',
          effects: [
            { type: 'healingToHoT', value: 25, description: 'Healing skills also apply 25% as HoT over 4s' }
          ]
        },
        {
          id: 'hc_r5_immediate_relief',
          name: 'Immediate Relief',
          icon: 'GiHealthNormal',
          shortDesc: '+25% Healing, but HoTs are 50% less effective',
          fullDesc: 'Your healing skills heal for 25% more\nHealing-over-time effects from your skills heal for 50% less',
          tier: 70,
          classId: 'high_cleric',
          effects: [
            { type: 'healingIncrease', value: 25, description: 'Healing skills heal for 25% more' },
            { type: 'hotEffectivenessReduction', value: 50, description: 'HoT effects heal for 50% less' }
          ]
        },
        {
          id: 'hc_r5_clean_restoration',
          name: 'Clean Restoration',
          icon: 'GiHeartBottle',
          shortDesc: 'Healing removes 10% of current DoT effects from target',
          fullDesc: 'Healing removes 10% of current damage-over-time effects from the target',
          tier: 70,
          classId: 'high_cleric',
          effects: [
            { type: 'healingRemovesDoT', value: 10, description: 'Healing removes 10% of DoT effects from target' }
          ]
        }
      ]
    },
    // ROW 6 — Capstone Philosophy
    {
      level: 85,
      rowName: 'Capstone Philosophy',
      rowTheme: 'Your defining healing identity',
      rowIcon: 'GiCrown',
      talents: [
        {
          id: 'hc_r6_perfect_discipline',
          name: 'Perfect Discipline',
          icon: 'GiAura',
          shortDesc: 'No overheal for 4s = +30% Healing (lost on overheal)',
          fullDesc: 'If no healing is wasted (no excess healing) for 4 seconds:\nYou gain 30% increased Healing\nBuff is lost immediately upon overhealing',
          tier: 85,
          classId: 'high_cleric',
          effects: [
            { type: 'perfectDisciplineEffect', value: 30, description: 'No overheal for 4s = +30% Healing' }
          ]
        },
        {
          id: 'hc_r6_unwavering_faith',
          name: 'Unwavering Faith',
          icon: 'GiShield',
          shortDesc: 'Healing cannot be interrupted, costs 15% more Mana',
          fullDesc: 'Your healing skills cannot be interrupted\nYour healing skills cost 15% more Mana',
          tier: 85,
          classId: 'high_cleric',
          effects: [
            { type: 'healingCannotBeInterrupted', value: 1, description: 'Healing skills cannot be interrupted' },
            { type: 'manaCostIncrease', value: 15, description: 'Healing skills cost 15% more Mana' }
          ]
        },
        {
          id: 'hc_r6_divine_allocation',
          name: 'Divine Allocation',
          icon: 'GiHolySymbol',
          shortDesc: 'Your healing auto-distributes to 2 lowest-Life allies at 60% each',
          fullDesc: 'At the end of each second:\nYour healing is automatically distributed to the 2 lowest-Life allies\nEach receives 60% of normal Healing',
          tier: 85,
          classId: 'high_cleric',
          effects: [
            { type: 'divineAllocationEffect', value: 60, description: 'Healing auto-distributes to 2 lowest-Life at 60% each' }
          ]
        }
      ]
    }
  ]
};

// ==================== BLOOD CONFESSOR TALENTS ====================
const BLOOD_CONFESSOR_TALENTS: ClassTalentTree = {
  classId: 'blood_confessor',
  className: 'Blood Confessor',
  classTheme: 'Life Sacrifice / Blood Magic — Healer who spends their own life to fuel powerful healing for allies',
  tiers: [
    // ROW 1 — Cost of Healing
    {
      level: 10,
      rowName: 'Cost of Healing',
      rowTheme: 'How painful healing is to YOU',
      rowIcon: 'GiDrop',
      talents: [
        {
          id: 'bc_r1_sanguine_efficiency',
          name: 'Sanguine Efficiency',
          icon: 'GiDrop',
          shortDesc: 'Life costs of healing skills are 20% reduced',
          fullDesc: 'Life costs of healing skills are 20% reduced\nSpend less of your own life to heal others',
          tier: 10,
          classId: 'blood_confessor',
          effects: [
            { type: 'lifeCostReduction', value: 20, description: 'Life costs of healing skills are 20% reduced' }
          ]
        },
        {
          id: 'bc_r1_crimson_overflow',
          name: 'Crimson Overflow',
          icon: 'GiHealthPotion',
          shortDesc: '30% of life spent on healing is returned over 3 seconds',
          fullDesc: '30% of life spent on healing is returned over 3 seconds\nYour sacrifice is partially restored through blood magic',
          tier: 10,
          classId: 'blood_confessor',
          effects: [
            { type: 'lifeSpentReturn', value: 30, description: '30% of life spent on healing is returned over 3 seconds' }
          ]
        },
        {
          id: 'bc_r1_bleeding_zeal',
          name: 'Bleeding Zeal',
          icon: 'GiFire',
          shortDesc: 'Healing costs 20% more life, +20% healing output',
          fullDesc: 'Healing skills cost 20% more life\nYou gain 20% increased healing output\nPain fuels your power',
          tier: 10,
          classId: 'blood_confessor',
          effects: [
            { type: 'lifeCostIncrease', value: 20, description: 'Healing skills cost 20% more life' },
            { type: 'healingOutputBonus', value: 20, description: 'You gain 20% increased healing output' }
          ]
        }
      ]
    },
    // ROW 2 — Self-Sustain Model
    {
      level: 25,
      rowName: 'Self-Sustain Model',
      rowTheme: 'How you stay alive while bleeding',
      rowIcon: 'GiHeartPlus',
      talents: [
        {
          id: 'bc_r2_blood_reclamation',
          name: 'Blood Reclamation',
          icon: 'GiHeartPlus',
          shortDesc: '25% of healing you deal also heals you',
          fullDesc: '25% of healing you deal also heals you\nYour blood magic flows both ways',
          tier: 25,
          classId: 'blood_confessor',
          effects: [
            { type: 'selfHealFromHealing', value: 25, description: '25% of healing you deal also heals you' }
          ]
        },
        {
          id: 'bc_r2_scarred_flesh',
          name: 'Scarred Flesh',
          icon: 'GiShield',
          shortDesc: '10% reduced damage taken while below 70% life',
          fullDesc: '10% reduced damage taken while below 70% life\nYour wounds have made you resilient',
          tier: 25,
          classId: 'blood_confessor',
          effects: [
            { type: 'lowLifeDamageReduction', value: 10, description: '10% reduced damage taken while below 70% life', condition: 'below70' }
          ]
        },
        {
          id: 'bc_r2_vital_drain',
          name: 'Vital Drain',
          icon: 'GiVortex',
          shortDesc: 'Spending life to heal grants 2% life regen/s for 3s',
          fullDesc: 'When you spend life to heal, regenerate 2% of life per second for 3 seconds\nYour sacrifice triggers a restorative flow',
          tier: 25,
          classId: 'blood_confessor',
          effects: [
            { type: 'lifeRegenOnLifeSpend', value: 2, description: 'Regenerate 2% life/s for 3s when spending life to heal' }
          ]
        }
      ]
    },
    // ROW 3 — Party Conversion
    {
      level: 40,
      rowName: 'Party Conversion',
      rowTheme: 'How your pain helps the group',
      rowIcon: 'GiSparkles',
      talents: [
        {
          id: 'bc_r3_shared_suffering',
          name: 'Shared Suffering',
          icon: 'GiWaterDrop',
          shortDesc: '15% of life you spend is recovered by lowest-life ally',
          fullDesc: '15% of life you spend on healing is recovered by the lowest-life ally\nYour sacrifice becomes their salvation',
          tier: 40,
          classId: 'blood_confessor',
          effects: [
            { type: 'allyLifeRecoveryFromLifeSpent', value: 15, description: '15% of life spent is recovered by lowest-life ally' }
          ]
        },
        {
          id: 'bc_r3_blood_communion',
          name: 'Blood Communion',
          icon: 'GiMagicShield',
          shortDesc: 'Allies healed by you gain 5% reduced damage for 3s',
          fullDesc: 'Allies healed by you gain 5% reduced damage taken for 3 seconds\nYour blood forms a protective bond',
          tier: 40,
          classId: 'blood_confessor',
          effects: [
            { type: 'allyDRFromHealing', value: 5, description: 'Allies healed gain 5% reduced damage taken for 3s' }
          ]
        },
        {
          id: 'bc_r3_crimson_pact',
          name: 'Crimson Pact',
          icon: 'GiLotusFlower',
          shortDesc: 'Allies healed gain 10% life regen for 4s',
          fullDesc: 'Allies healed by you gain 10% increased life regeneration for 4 seconds\nYour blood magic lingers in their veins',
          tier: 40,
          classId: 'blood_confessor',
          effects: [
            { type: 'allyLifeRegenFromHealing', value: 10, description: 'Allies healed gain 10% increased life regen for 4s' }
          ]
        }
      ]
    },
    // ROW 4 — Damage Smoothing
    {
      level: 55,
      rowName: 'Damage Smoothing',
      rowTheme: 'Handling burst and spike damage',
      rowIcon: 'GiShieldReflect',
      talents: [
        {
          id: 'bc_r4_hemostatic_flow',
          name: 'Hemostatic Flow',
          icon: 'GiHealthNormal',
          shortDesc: 'Your healing applies 40% as HoT over 4 seconds',
          fullDesc: 'Your healing applies a life recovery over time equal to 40% of the heal over 4 seconds\nYour blood magic continues to heal after the initial burst',
          tier: 55,
          classId: 'blood_confessor',
          effects: [
            { type: 'healingOverTimeFromHeal', value: 40, description: 'Healing applies 40% as HoT over 4 seconds' }
          ]
        },
        {
          id: 'bc_r4_pain_buffer',
          name: 'Pain Buffer',
          icon: 'GiBoltShield',
          shortDesc: 'Losing 15%+ life in 1s grants 15% DR for 3s',
          fullDesc: 'When you lose more than 15% of your life in 1 second, gain 15% reduced damage taken for 3 seconds\nMassive pain triggers a protective response',
          tier: 55,
          classId: 'blood_confessor',
          effects: [
            { type: 'bigLifeLossDR', value: 15, description: 'Losing 15%+ life in 1s grants 15% DR for 3s' }
          ]
        },
        {
          id: 'bc_r4_bloodguard',
          name: 'Bloodguard',
          icon: 'GiVibratingShield',
          shortDesc: 'Allies healed take 10% less hit damage for 2s',
          fullDesc: 'Allies healed by you take 10% less damage from hits for 2 seconds\nYour blood forms a brief barrier',
          tier: 55,
          classId: 'blood_confessor',
          effects: [
            { type: 'allyHitDRFromHealing', value: 10, description: 'Allies healed take 10% less hit damage for 2s' }
          ]
        }
      ]
    },
    // ROW 5 — Risk vs Reward
    {
      level: 70,
      rowName: 'Risk vs Reward',
      rowTheme: 'How close to death you\'re willing to play',
      rowIcon: 'GiDeathSkull',
      talents: [
        {
          id: 'bc_r5_low_life_zeal',
          name: 'Low-Life Zeal',
          icon: 'GiHeartPlus',
          shortDesc: 'Below 50% life: +25% increased healing',
          fullDesc: 'While below 50% life, you gain 25% increased healing\nDesperation fuels your power',
          tier: 70,
          classId: 'blood_confessor',
          effects: [
            { type: 'lowLifeHealingIncrease', value: 25, description: 'Below 50% life: 25% increased healing' }
          ]
        },
        {
          id: 'bc_r5_controlled_bleeding',
          name: 'Controlled Bleeding',
          icon: 'GiShield',
          shortDesc: 'Life costs cannot reduce you below 10% life',
          fullDesc: 'Life costs cannot reduce you below 10% life\nYou maintain control even at the edge of death',
          tier: 70,
          classId: 'blood_confessor',
          effects: [
            { type: 'lifeCostFloor', value: 10, description: 'Life costs cannot reduce you below 10% life' }
          ]
        },
        {
          id: 'bc_r5_exsanguinate',
          name: 'Exsanguinate',
          icon: 'GiSkullCrossedBones',
          shortDesc: 'Healing deals 10% of life spent as chaos damage',
          fullDesc: 'Healing skills deal 10% of life spent as chaos damage to nearby enemies\nYour spilled blood becomes a weapon',
          tier: 70,
          classId: 'blood_confessor',
          effects: [
            { type: 'lifeCostChaosDamage', value: 10, description: 'Healing deals 10% of life spent as chaos damage to enemies' }
          ]
        }
      ]
    },
    // ROW 6 — Capstone Identity
    {
      level: 85,
      rowName: 'Capstone Identity',
      rowTheme: 'What kind of Blood Confessor you are',
      rowIcon: 'GiCrown',
      talents: [
        {
          id: 'bc_r6_endless_martyrdom',
          name: 'Endless Martyrdom',
          icon: 'GiAngelWings',
          shortDesc: 'Life spent on healing is never lethal',
          fullDesc: 'Life spent on healing is never lethal\nYou cannot die from your own healing costs\nYour sacrifice knows no bounds',
          tier: 85,
          classId: 'blood_confessor',
          effects: [
            { type: 'endlessMartyrdomEffect', value: 1, description: 'Life spent on healing cannot kill you' }
          ]
        },
        {
          id: 'bc_r6_crimson_engine',
          name: 'Crimson Engine',
          icon: 'GiFlameSpin',
          shortDesc: 'Per 10% life spent recently: +5% healing (max 25%)',
          fullDesc: 'For every 10% of life spent in the last 5 seconds, gain 5% increased healing\nMaximum 25% increased healing\nYour blood fuels an engine of restoration',
          tier: 85,
          classId: 'blood_confessor',
          effects: [
            { type: 'lifeCostStackingHealing', value: 5, description: 'Per 10% life spent in 5s: +5% healing (max 25%)' }
          ]
        },
        {
          id: 'bc_r6_blood_sovereign',
          name: 'Blood Sovereign',
          icon: 'GiCrown',
          shortDesc: 'Allies healed gain 10% max life for 6s',
          fullDesc: 'Allies healed by you gain 10% increased maximum life for 6 seconds\nDoes not stack with itself\nYour blood empowers their very essence',
          tier: 85,
          classId: 'blood_confessor',
          effects: [
            { type: 'allyMaxLifeFromHealing', value: 10, description: 'Allies healed gain 10% max life for 6s (non-stacking)' }
          ]
        }
      ]
    }
  ]
};

// ==================== TACTICIAN TALENTS ====================
const TACTICIAN_TALENTS: ClassTalentTree = {
  classId: 'tactician',
  className: 'Tactician',
  classTheme: 'Strategic / Cooldown Healer — Uses defensive cooldowns and damage mitigation to protect allies',
  tiers: [
    // ROW 1 — How you smooth incoming damage
    {
      level: 10,
      rowName: 'Damage Smoothing',
      rowTheme: 'Baseline defensive philosophy',
      rowIcon: 'GiShield',
      talents: [
        {
          id: 'tc_r1_preemptive_orders',
          name: 'Preemptive Orders',
          icon: 'GiShield',
          shortDesc: 'Allies take 10% reduced damage (always active)',
          fullDesc: 'Allies take 10% reduced damage\nAlways active',
          tier: 10,
          classId: 'tactician',
          effects: [
            { type: 'allyDamageReduction', value: 10, description: 'Allies take 10% reduced damage' }
          ]
        },
        {
          id: 'tc_r1_reactive_doctrine',
          name: 'Reactive Doctrine',
          icon: 'GiShieldReflect',
          shortDesc: 'Ally below 50% life: 15% DR for 4s (12s ICD)',
          fullDesc: 'When an ally drops below 50% Life, they take 15% reduced damage for 4s\nInternal cooldown: 12s per ally',
          tier: 10,
          classId: 'tactician',
          effects: [
            { type: 'lowLifeAllyDR', value: 15, description: 'Ally below 50% life: 15% DR for 4s (12s ICD per ally)' }
          ]
        },
        {
          id: 'tc_r1_layered_defense',
          name: 'Layered Defense',
          icon: 'GiVibratingShield',
          shortDesc: 'DoT effects deal 20% reduced damage to allies',
          fullDesc: 'Damage over time effects deal 20% reduced damage to allies',
          tier: 10,
          classId: 'tactician',
          effects: [
            { type: 'dotDamageReduction', value: 20, description: 'DoT effects deal 20% reduced damage to allies' }
          ]
        }
      ]
    },
    // ROW 2 — How your cooldowns function
    {
      level: 25,
      rowName: 'Cooldown Philosophy',
      rowTheme: 'Frequency vs power',
      rowIcon: 'GiCog',
      talents: [
        {
          id: 'tc_r2_short_rotation',
          name: 'Short Rotation',
          icon: 'GiVortex',
          shortDesc: '−20% defensive CD cooldowns, −10% effect',
          fullDesc: 'Your defensive cooldowns have 20% reduced cooldown\nCooldowns grant 10% less damage reduction',
          tier: 25,
          classId: 'tactician',
          effects: [
            { type: 'defensiveCooldownReduction', value: 20, description: 'Defensive cooldowns have 20% reduced cooldown' },
            { type: 'defensiveCooldownEffect', value: -10, description: 'Cooldowns grant 10% less damage reduction' }
          ]
        },
        {
          id: 'tc_r2_long_game',
          name: 'Long Game',
          icon: 'GiChessRook',
          shortDesc: '+25% defensive CD effect, +20% longer CDs',
          fullDesc: 'Your defensive cooldowns have 25% increased effect\nCooldowns have 20% increased cooldown',
          tier: 25,
          classId: 'tactician',
          effects: [
            { type: 'defensiveCooldownEffect', value: 25, description: 'Defensive cooldowns have 25% increased effect' },
            { type: 'defensiveCooldownReduction', value: -20, description: 'Cooldowns have 20% increased cooldown' }
          ]
        },
        {
          id: 'tc_r2_tactical_flexibility',
          name: 'Tactical Flexibility',
          icon: 'GiBrain',
          shortDesc: 'Using a defensive CD reduces other CDs by 10%',
          fullDesc: 'Using a defensive cooldown reduces the cooldown of your other defensive cooldowns by 10%',
          tier: 25,
          classId: 'tactician',
          effects: [
            { type: 'defensiveCooldownCDR', value: 10, description: 'Using a defensive CD reduces other CDs by 10%' }
          ]
        }
      ]
    },
    // ROW 3 — Emergency response model
    {
      level: 40,
      rowName: 'Emergency Response',
      rowTheme: 'What happens when things go wrong',
      rowIcon: 'GiHealthPotion',
      talents: [
        {
          id: 'tc_r3_crisis_protocol',
          name: 'Crisis Protocol',
          icon: 'GiBoltShield',
          shortDesc: 'Ally hit for 30%+ max life: 20% DR for 3s (10s ICD)',
          fullDesc: 'When an ally takes a hit dealing 30% or more of their maximum Life, they gain:\n20% reduced damage taken for 3s\nInternal cooldown: 10s per ally',
          tier: 40,
          classId: 'tactician',
          effects: [
            { type: 'crisisProtocolDR', value: 20, description: 'Ally hit for 30%+ max life: 20% DR for 3s (10s ICD)' }
          ]
        },
        {
          id: 'tc_r3_damage_redistribution',
          name: 'Damage Redistribution',
          icon: 'GiMagicSwirl',
          shortDesc: '10% of ally damage redistributed across party',
          fullDesc: '10% of damage taken by allies is redirected evenly across the party (cannot affect you)',
          tier: 40,
          classId: 'tactician',
          effects: [
            { type: 'damageRedistribution', value: 10, description: '10% of ally damage redistributed across party' }
          ]
        },
        {
          id: 'tc_r3_fail_safe_formation',
          name: 'Fail-Safe Formation',
          icon: 'GiMagicShield',
          shortDesc: '2+ allies below 40% life: party 12% DR for 5s (20s CD)',
          fullDesc: 'If two or more allies drop below 40% Life, the party takes 12% reduced damage for 5s\nCooldown: 20s',
          tier: 40,
          classId: 'tactician',
          effects: [
            { type: 'failSafeFormationDR', value: 12, description: '2+ allies below 40%: party 12% DR for 5s (20s CD)' }
          ]
        }
      ]
    },
    // ROW 4 — How you contribute healing
    {
      level: 55,
      rowName: 'Healing Contribution',
      rowTheme: 'Limited, deliberate healing',
      rowIcon: 'GiHeartPlus',
      talents: [
        {
          id: 'tc_r4_directed_aid',
          name: 'Directed Aid',
          icon: 'GiHealthPotion',
          shortDesc: '+30% direct heal strength, +20% heal CDs',
          fullDesc: 'Your direct heals are 30% stronger\nHealing cooldowns increased by 20%',
          tier: 55,
          classId: 'tactician',
          effects: [
            { type: 'directHealBonus', value: 30, description: 'Direct heals are 30% stronger' },
            { type: 'healCooldownIncrease', value: 20, description: 'Healing cooldowns increased by 20%' }
          ]
        },
        {
          id: 'tc_r4_stabilization',
          name: 'Stabilization',
          icon: 'GiHealthIncrease',
          shortDesc: 'Healing grants 5% life regen/s for 4s',
          fullDesc: 'Healing an ally grants 5% Life regeneration per second for 4s',
          tier: 55,
          classId: 'tactician',
          effects: [
            { type: 'healingLifeRegen', value: 5, description: 'Healing grants 5% life regen/s for 4s' }
          ]
        },
        {
          id: 'tc_r4_overflow_planning',
          name: 'Overflow Planning',
          icon: 'GiWaterDrop',
          shortDesc: '20% of overhealing becomes life regen over 4s',
          fullDesc: '20% of overhealing is converted into Life regeneration over 4s',
          tier: 55,
          classId: 'tactician',
          effects: [
            { type: 'overhealingToRegen', value: 20, description: '20% of overhealing becomes life regen over 4s' }
          ]
        }
      ]
    },
    // ROW 5 — Party-wide tactical buffs
    {
      level: 70,
      rowName: 'Tactical Buffs',
      rowTheme: 'Unique team identity',
      rowIcon: 'GiStarFormation',
      talents: [
        {
          id: 'tc_r5_command_presence',
          name: 'Command Presence',
          icon: 'GiMuscleUp',
          shortDesc: 'Allies gain 5% increased maximum life',
          fullDesc: 'Allies gain 5% increased maximum Life',
          tier: 70,
          classId: 'tactician',
          effects: [
            { type: 'allyMaxLifeBonus', value: 5, description: 'Allies gain 5% increased maximum life' }
          ]
        },
        {
          id: 'tc_r5_damage_forecasting',
          name: 'Damage Forecasting',
          icon: 'GiBrain',
          shortDesc: 'Allies take 10% reduced critical strike damage',
          fullDesc: 'Allies take 10% reduced critical strike damage',
          tier: 70,
          classId: 'tactician',
          effects: [
            { type: 'allyCritDamageReduction', value: 10, description: 'Allies take 10% reduced critical strike damage' }
          ]
        },
        {
          id: 'tc_r5_controlled_tempo',
          name: 'Controlled Tempo',
          icon: 'GiCog',
          shortDesc: 'Allies deal 5% less, take 10% less damage',
          fullDesc: 'Allies deal 5% reduced damage\nAllies take 10% reduced damage',
          tier: 70,
          classId: 'tactician',
          effects: [
            { type: 'allyDealLessDamage', value: 5, description: 'Allies deal 5% reduced damage' },
            { type: 'allyTakeLessDamage', value: 10, description: 'Allies take 10% reduced damage' }
          ]
        }
      ]
    },
    // ROW 6 — Capstone Strategy
    {
      level: 85,
      rowName: 'Capstone Strategy',
      rowTheme: 'Defines endgame playstyle',
      rowIcon: 'GiCrown',
      talents: [
        {
          id: 'tc_r6_battle_plan_alpha',
          name: 'Battle Plan Alpha',
          icon: 'GiScrollUnfurled',
          shortDesc: 'Every 20s: party gains 15% DR for 4s',
          fullDesc: 'Every 20s, the party gains 15% reduced damage taken for 4s',
          tier: 85,
          classId: 'tactician',
          effects: [
            { type: 'battlePlanAlphaDR', value: 15, description: 'Every 20s: party gains 15% DR for 4s' }
          ]
        },
        {
          id: 'tc_r6_perfect_execution',
          name: 'Perfect Execution',
          icon: 'GiStarFormation',
          shortDesc: 'Using defensive CD: +20% DR from all sources for 3s',
          fullDesc: 'Using a defensive cooldown grants 20% increased damage reduction from all sources for 3s',
          tier: 85,
          classId: 'tactician',
          effects: [
            { type: 'perfectExecutionDR', value: 20, description: 'Using defensive CD: +20% DR from all sources for 3s' }
          ]
        },
        {
          id: 'tc_r6_strategic_mastery',
          name: 'Strategic Mastery',
          icon: 'GiCrown',
          shortDesc: 'Defensive CD effects stack additively',
          fullDesc: 'Defensive cooldown effects stack additively instead of overwriting\n(e.g. multiple sources of reduced damage apply fully)',
          tier: 85,
          classId: 'tactician',
          effects: [
            { type: 'strategicMasteryEffect', value: 1, description: 'Defensive CD effects stack additively' }
          ]
        }
      ]
    }
  ]
};

// ==================== GROVE HEALER TALENTS ====================
const GROVE_HEALER_TALENTS: ClassTalentTree = {
  classId: 'grove_healer',
  className: 'Grove Healer',
  classTheme: 'Nature / HoT Specialist — Master of regeneration and sustained healing over time',
  tiers: [
    // ROW 1 — Baseline Regeneration Style
    {
      level: 10,
      rowName: 'Regeneration Style',
      rowTheme: 'How your healing is delivered',
      rowIcon: 'GiOakLeaf',
      talents: [
        {
          id: 'gh_r1_verdant_flow',
          name: 'Verdant Flow',
          icon: 'GiOakLeaf',
          shortDesc: 'You and allies regenerate Life 20% faster',
          fullDesc: 'You and allies have 20% increased Life Regeneration Rate\nNature flows through the party, accelerating recovery',
          tier: 10,
          classId: 'grove_healer',
          effects: [
            { type: 'lifeRegenRate', value: 20, description: 'You and allies regenerate Life 20% faster' }
          ]
        },
        {
          id: 'gh_r1_wild_growth',
          name: 'Wild Growth',
          icon: 'GiLotusFlower',
          shortDesc: 'Your Regeneration effects on allies last 30% longer',
          fullDesc: 'Your Regeneration effects on allies have 30% increased duration\nNature lingers longer, sustaining allies through extended fights',
          tier: 10,
          classId: 'grove_healer',
          effects: [
            { type: 'regenDuration', value: 30, description: 'Your Regen effects on allies last 30% longer' }
          ]
        },
        {
          id: 'gh_r1_deep_roots',
          name: 'Deep Roots',
          icon: 'GiHealthIncrease',
          shortDesc: 'Allies passively regenerate +1% of their maximum Life per second',
          fullDesc: 'Allies gain +1% Life Regeneration per second\nDeep roots of nature continuously restore ally vitality',
          tier: 10,
          classId: 'grove_healer',
          effects: [
            { type: 'flatLifeRegenPerSecond', value: 1, description: 'Allies passively regenerate +1% max Life per second' }
          ]
        }
      ]
    },
    // ROW 2 — Regeneration Scaling
    {
      level: 25,
      rowName: 'Regeneration Scaling',
      rowTheme: 'How regen scales under pressure',
      rowIcon: 'GiSparkles',
      talents: [
        {
          id: 'gh_r2_flourishing_canopy',
          name: 'Flourishing Canopy',
          icon: 'GiHeartPlus',
          shortDesc: 'Allies regenerate Life 25% faster while below 50% Life',
          fullDesc: 'Allies have 25% increased Life Regeneration Rate while below 50% Life\nNature responds urgently to wounded allies',
          tier: 25,
          classId: 'grove_healer',
          effects: [
            { type: 'lowLifeRegenRate', value: 25, description: 'Allies regenerate 25% faster while below 50% Life' }
          ]
        },
        {
          id: 'gh_r2_overgrowth',
          name: 'Overgrowth',
          icon: 'GiVortex',
          shortDesc: 'Allies regenerate Life 15% faster for each active Regen effect on them',
          fullDesc: 'Allies gain 15% increased Life Regeneration Rate per active regeneration effect on them\nStacking regeneration becomes increasingly powerful',
          tier: 25,
          classId: 'grove_healer',
          effects: [
            { type: 'regenRatePerEffect', value: 15, description: 'Allies regen 15% faster per active Regen effect' }
          ]
        },
        {
          id: 'gh_r2_natural_abundance',
          name: 'Natural Abundance',
          icon: 'GiHealthNormal',
          shortDesc: 'Allies regenerate 40% more Life total, but healing applies 10% slower',
          fullDesc: 'Allies have 40% increased Life Regeneration Rate, but regeneration heals 10% slower\nMore total healing, delivered gradually over extended time',
          tier: 25,
          classId: 'grove_healer',
          effects: [
            { type: 'lifeRegenRate', value: 40, description: 'Allies regenerate 40% more Life total' },
            { type: 'regenRateSlower', value: 10, description: 'Regeneration healing applies 10% slower' }
          ]
        }
      ]
    },
    // ROW 3 — Party Utility
    {
      level: 40,
      rowName: 'Party Utility',
      rowTheme: 'How your regen helps the group beyond raw healing',
      rowIcon: 'GiShield',
      talents: [
        {
          id: 'gh_r3_barkskin_aura',
          name: 'Barkskin Aura',
          icon: 'GiShield',
          shortDesc: 'Allies take 10% reduced Physical Damage from enemies while regenerating Life',
          fullDesc: 'Allies take 10% reduced Physical Damage from enemies while regenerating Life\nNature hardens their skin against physical blows',
          tier: 40,
          classId: 'grove_healer',
          effects: [
            { type: 'physicalDRWhileRegen', value: 10, description: 'Allies take 10% reduced Physical Damage from enemies while regenerating' }
          ]
        },
        {
          id: 'gh_r3_living_thicket',
          name: 'Living Thicket',
          icon: 'GiMagicShield',
          shortDesc: 'Allies take 8% reduced Elemental Damage from enemies while regenerating Life',
          fullDesc: 'Allies take 8% reduced Elemental Damage from enemies while regenerating Life\nThe grove shields them from fire, cold, and lightning',
          tier: 40,
          classId: 'grove_healer',
          effects: [
            { type: 'elementalDRWhileRegen', value: 8, description: 'Allies take 8% reduced Elemental Damage from enemies while regenerating' }
          ]
        },
        {
          id: 'gh_r3_verdant_resilience',
          name: 'Verdant Resilience',
          icon: 'GiVibratingShield',
          shortDesc: 'Allies gain +5% to all maximum Resistances while regenerating Life',
          fullDesc: 'Allies gain +5% to all maximum Resistances while regenerating Life\nNature fortifies their resistance to all damage types',
          tier: 40,
          classId: 'grove_healer',
          effects: [
            { type: 'maxResWhileRegen', value: 5, description: 'Allies gain +5% to all maximum Resistances while regenerating' }
          ]
        }
      ]
    },
    // ROW 4 — Smoothing Damage Intake
    {
      level: 55,
      rowName: 'Damage Smoothing',
      rowTheme: 'How regen interacts with incoming damage',
      rowIcon: 'GiHealthPotion',
      talents: [
        {
          id: 'gh_r4_rejuvenating_response',
          name: 'Rejuvenating Response',
          icon: 'GiBoltShield',
          shortDesc: 'Allies gain 20% increased Life Regen Rate after being hit by an enemy',
          fullDesc: 'Allies gain 20% increased Life Regeneration Rate for 4 seconds after being hit by an enemy\nDamage triggers accelerated recovery',
          tier: 55,
          classId: 'grove_healer',
          effects: [
            { type: 'regenRateAfterHit', value: 20, description: 'Allies gain 20% increased Life Regen Rate after being hit' }
          ]
        },
        {
          id: 'gh_r4_steady_renewal',
          name: 'Steady Renewal',
          icon: 'GiShieldReflect',
          shortDesc: 'Allies take 10% reduced Damage over Time from enemies while regenerating Life',
          fullDesc: 'Allies take 10% reduced Damage over Time from enemies while regenerating Life\nRegeneration counters enemy poison, bleeds, and burns',
          tier: 55,
          classId: 'grove_healer',
          effects: [
            { type: 'dotDRWhileRegen', value: 10, description: 'Allies take 10% reduced DoT from enemies while regenerating' }
          ]
        },
        {
          id: 'gh_r4_vital_circulation',
          name: 'Vital Circulation',
          icon: 'GiHealthIncrease',
          shortDesc: '30% of your Life Regeneration healing applies instantly to allies',
          fullDesc: '30% of Life Regeneration applies instantly instead of over time\nFrontloads healing for faster response to damage',
          tier: 55,
          classId: 'grove_healer',
          effects: [
            { type: 'instantRegenPercent', value: 30, description: '30% of Life Regen applies instantly to allies' }
          ]
        }
      ]
    },
    // ROW 5 — High-Impact Scaling
    {
      level: 70,
      rowName: 'High-Impact Scaling',
      rowTheme: 'Build-defining regen modifiers',
      rowIcon: 'GiStarFormation',
      talents: [
        {
          id: 'gh_r5_ancient_growth',
          name: 'Ancient Growth',
          icon: 'GiMuscleUp',
          shortDesc: 'Your Life Regeneration effects on allies have 25% more Effect',
          fullDesc: 'Your Life Regeneration effects on allies have 25% more Effect\nAncient nature magic amplifies all regeneration you provide',
          tier: 70,
          classId: 'grove_healer',
          effects: [
            { type: 'regenEffectMore', value: 25, description: 'Your Life Regen effects on allies have 25% more Effect' }
          ]
        },
        {
          id: 'gh_r5_natures_rhythm',
          name: "Nature's Rhythm",
          icon: 'GiVortex',
          shortDesc: 'Your Life Regeneration heals allies 20% faster (same total healing)',
          fullDesc: "Your Life Regeneration heals allies 20% faster, but total healing remains the same\nFrontloads regeneration without increasing total healing output",
          tier: 70,
          classId: 'grove_healer',
          effects: [
            { type: 'regenSpeedFaster', value: 20, description: 'Your Life Regen heals allies 20% faster (same total)' }
          ]
        },
        {
          id: 'gh_r5_verdant_overflow',
          name: 'Verdant Overflow',
          icon: 'GiSparkles',
          shortDesc: 'Excess Life Regeneration on allies grants them Energy Shield instead',
          fullDesc: 'When allies are at full Life, excess Life Regeneration grants Energy Shield instead\nUp to 10% of their maximum Life per second',
          tier: 70,
          classId: 'grove_healer',
          effects: [
            { type: 'excessRegenToES', value: 10, description: 'Excess Life Regen grants allies ES (up to 10% max Life/s)' }
          ]
        }
      ]
    },
    // ROW 6 — Capstones
    {
      level: 85,
      rowName: 'Capstone Identity',
      rowTheme: 'Identity lock-in',
      rowIcon: 'GiCrown',
      talents: [
        {
          id: 'gh_r6_heart_of_the_grove',
          name: 'Heart of the Grove',
          icon: 'GiOakLeaf',
          shortDesc: 'Allies gain +1% Life Regen/s. Your Regen effects have 20% more Effect',
          fullDesc: 'Allies gain 1% additional Life Regeneration per second\nYour Life Regeneration effects on allies have 20% more Effect\nYou become the heart of nature itself',
          tier: 85,
          classId: 'grove_healer',
          effects: [
            { type: 'additionalLifeRegenPerSecond', value: 1, description: 'Allies gain +1% Life Regen per second' },
            { type: 'regenEffectMoreBonus', value: 20, description: 'Your Regen effects on allies have 20% more Effect' }
          ]
        },
        {
          id: 'gh_r6_avatar_of_renewal',
          name: 'Avatar of Renewal',
          icon: 'GiAngelWings',
          shortDesc: 'Ally Life Regen cannot be reduced. Allies take 15% less damage from enemies while regenerating',
          fullDesc: "Allies' Life Regeneration cannot be reduced by enemy effects\nAllies take 15% reduced Damage from enemies while regenerating Life\nNature shields those it heals",
          tier: 85,
          classId: 'grove_healer',
          effects: [
            { type: 'regenCannotBeReduced', value: 1, description: 'Ally Life Regen cannot be reduced by enemies' },
            { type: 'drWhileRegen', value: 15, description: 'Allies take 15% less damage from enemies while regenerating' }
          ]
        },
        {
          id: 'gh_r6_evergreen_covenant',
          name: 'Evergreen Covenant',
          icon: 'GiCrown',
          shortDesc: '50% of any ally Life Regen spreads to nearby allies. Regen duration −30%',
          fullDesc: '50% of Life Regeneration on any ally also applies to nearby allies\nRegeneration effects have 30% reduced duration\nThe grove shares its healing with all',
          tier: 85,
          classId: 'grove_healer',
          effects: [
            { type: 'regenShareToAllies', value: 50, description: '50% of ally Life Regen spreads to nearby allies' },
            { type: 'regenDurationReduction', value: 30, description: 'Regen effects have 30% reduced duration' }
          ]
        }
      ]
    }
  ]
};

// Generic talent tree generator for other classes
function createGenericTalentTree(classId: CharacterClassId, className: string, classTheme: string, role: 'tank' | 'healer'): ClassTalentTree {
  const isTank = role === 'tank';
  
  const tankRows = [
    { name: 'Core Mitigation', theme: 'How you reduce damage', icon: 'GiChestArmor' },
    { name: 'Burst Survival', theme: 'Handling big hits', icon: 'GiExplosiveMeeting' },
    { name: 'Defense Specialty', theme: 'Your defensive niche', icon: 'GiShieldBash' },
    { name: 'Positioning', theme: 'Movement and control', icon: 'GiFootprint' },
    { name: 'Ally Protection', theme: 'Guarding your team', icon: 'GiTwoShadows' },
    { name: 'Capstone Identity', theme: 'Your defining power', icon: 'GiCastle' }
  ];
  
  const healerRows = [
    { name: 'Core Healing', theme: 'Your primary healing style', icon: 'GiHealthPotion' },
    { name: 'Emergency Response', theme: 'Saving dying allies', icon: 'GiAngelWings' },
    { name: 'Mana Efficiency', theme: 'Managing your resources', icon: 'GiWaterDrop' },
    { name: 'Group Utility', theme: 'Supporting the party', icon: 'GiTwoShadows' },
    { name: 'Healing Synergy', theme: 'Amplifying your heals', icon: 'GiHeartPlus' },
    { name: 'Capstone Identity', theme: 'Your defining power', icon: 'GiCrown' }
  ];
  
  const rows = isTank ? tankRows : healerRows;
  
  const tankIcons = [
    ['GiAnvil', 'GiShieldBounces', 'GiCrystalShine'],
    ['GiDeathSkull', 'GiShieldReflect', 'GiMountaintop'],
    ['GiVikingShield', 'GiBroadsword', 'GiLockedFortress'],
    ['GiAnchor', 'GiWalkingBoot', 'GiCrossedSwords'],
    ['GiShieldEchoes', 'GiArrowDunk', 'GiTemplarShield'],
    ['GiHeartPlus', 'GiBrokenShield', 'GiCrown']
  ];
  
  const healerIcons = [
    ['GiHealthPotion', 'GiHolySymbol', 'GiSunbeams'],
    ['GiAngelWings', 'GiPrayerBeads', 'GiLifeSupport'],
    ['GiWaterDrop', 'GiMagicSwirl', 'GiMeditation'],
    ['GiLightningArc', 'GiSunflower', 'GiCircleClaws'],
    ['GiHeartPlus', 'GiHealing', 'GiHealingShield'],
    ['GiCrown', 'GiSunRadiations', 'GiAngelOutfit']
  ];
  
  const icons = isTank ? tankIcons : healerIcons;
  
  return {
    classId,
    className,
    classTheme,
    tiers: TALENT_TIER_LEVELS.map((level, i) => ({
      level,
      rowName: rows[i].name,
      rowTheme: rows[i].theme,
      rowIcon: rows[i].icon,
      talents: [
        {
          id: `${classId}_r${i + 1}_a`,
          name: `${className} ${i + 1}A`,
          icon: icons[i][0],
          shortDesc: `${rows[i].name} - Option A`,
          fullDesc: `Placeholder talent for ${className}`,
          tier: level,
          classId,
          effects: [{ type: isTank ? 'armorBonus' : 'healingIncrease', value: 15, description: `+15% ${isTank ? 'Armor' : 'Healing'}` }]
        },
        {
          id: `${classId}_r${i + 1}_b`,
          name: `${className} ${i + 1}B`,
          icon: icons[i][1],
          shortDesc: `${rows[i].name} - Option B`,
          fullDesc: `Placeholder talent for ${className}`,
          tier: level,
          classId,
          effects: [{ type: isTank ? 'blockBonus' : 'manaRegen', value: 15, description: `+15% ${isTank ? 'Block' : 'Mana Regen'}` }]
        },
        {
          id: `${classId}_r${i + 1}_c`,
          name: `${className} ${i + 1}C`,
          icon: icons[i][2],
          shortDesc: `${rows[i].name} - Option C`,
          fullDesc: `Placeholder talent for ${className}`,
          tier: level,
          classId,
          effects: [{ type: 'damageReduction', value: 10, description: '+10% Damage Reduction' }]
        }
      ] as [Talent, Talent, Talent]
    }))
  };
}

// All class talent trees
export const CLASS_TALENT_TREES: Record<CharacterClassId, ClassTalentTree> = {
  bastion_knight: BASTION_KNIGHT_TALENTS,
  wardbreaker: WARDBREAKER_TALENTS,
  iron_skirmisher: IRON_SKIRMISHER_TALENTS,
  duel_warden: DUEL_WARDEN_TALENTS,
  shadow_warden: SHADOW_WARDEN_TALENTS,
  ghostblade: GHOSTBLADE_TALENTS,
  arcane_bulwark: ARCANE_BULWARK_TALENTS,
  null_templar: NULL_TEMPLAR_TALENTS,
  phase_guardian: PHASE_GUARDIAN_TALENTS,
  high_cleric: HIGH_CLERIC_TALENTS,
  blood_confessor: BLOOD_CONFESSOR_TALENTS,
  tactician: TACTICIAN_TALENTS,
  grove_healer: GROVE_HEALER_TALENTS,
  vitalist: createGenericTalentTree('vitalist', 'Vitalist', 'Life Force / Vitality Healer', 'healer'),
  ritual_warden: createGenericTalentTree('ritual_warden', 'Ritual Warden', 'Ritual / Channeled Healer', 'healer'),
  aegis_keeper: createGenericTalentTree('aegis_keeper', 'Aegis Keeper', 'Shield / Barrier Healer', 'healer'),
  martyr: createGenericTalentTree('martyr', 'Martyr', 'Self-Sacrifice / Emergency Healer', 'healer'),
  bastion_strategist: createGenericTalentTree('bastion_strategist', 'Bastion Strategist', 'Tactical / Damage Reduction Healer', 'healer'),
};

export function getTalentTree(classId: CharacterClassId): ClassTalentTree {
  return CLASS_TALENT_TREES[classId];
}

export function getTalentById(talentId: string): Talent | undefined {
  for (const tree of Object.values(CLASS_TALENT_TREES)) {
    for (const tier of tree.tiers) {
      for (const talent of tier.talents) {
        if (talent.id === talentId) return talent;
      }
    }
  }
  return undefined;
}

export function getSelectedTalentEffects(classId: CharacterClassId, selectedTalents: SelectedTalents): TalentEffect[] {
  const effects: TalentEffect[] = [];
  const tree = getTalentTree(classId);
  
  for (const tier of tree.tiers) {
    const selectedId = selectedTalents[tier.level];
    if (selectedId) {
      const talent = tier.talents.find(t => t.id === selectedId);
      if (talent) effects.push(...talent.effects);
    }
  }
  return effects;
}

// Talent bonuses for combat system
export interface TalentBonuses {
  damageMultiplier: number;
  healingMultiplier: number;
  damageReduction: number;
  armorMultiplier: number;
  evasionMultiplier: number;
  healthMultiplier: number;
  manaRegenMultiplier: number;
  manaCostReduction: number;
  cooldownReduction: number;
  blockBonus: number;
  blockEffectiveness: number;
  critBonus: number;
  castSpeedBonus: number;
  lifesteal: number;
  thorns: number;
  resistanceBonus: number;
  // Iron Skirmisher specific bonuses
  enemyAttackSpeedReduction: number;
  enemyAccuracyReduction: number;
  attackDamageReduction: number;
  physicalDamageReductionFromArmor: number;
  armorEffectivenessVsAttacks: number;
  evasionToMitigationPercent: number;
  selfDamageReduction: number;
  // Duel Warden specific bonuses
  spellBlockBonus: number;
  nonBlockedDamageReduction: number;
  blockToSpellBlockPercent: number;
  // Shadow Warden specific bonuses
  spellSuppressionChance: number;
  spellSuppressionEffect: number;
  evadeChanceToSuppressionPercent: number;
  evadeChance: number;
  enemyCritChanceReduction: number;
  enemyCritMultiplierReduction: number;
  elementalDamageReduction: number;
  hitDamageReduction: number;
  enemyCritDamageReduction: number;
  suppressedNoCrit: boolean;
  // Ghostblade specific bonuses
  armorReduction: number;
  allyEvadeChance: number;
  // Arcane Bulwark specific bonuses
  esRechargeRate: number;
  esRechargeDelay: number;
  esRecoveryBonus: number;
  esRegeneration: number;
  spellDamageReduction: number;
  maxESBonus: number;
  maxLifeReduction: number;
  elementalResistanceBonus: number;
  esLeech: number;
  allySpellDamageReduction: number;
  // Null Templar specific bonuses
  chaosResistance: number;
  maxChaosResistance: number;
  chaosDamageReduction: number;
  allyChaosResistance: number;
  allyElementalDamageReduction: number;
  // Phase Guardian specific bonuses
  dodgeChance: number;
  allyEvasionRating: number;
  maxESReduction: number;
  // High Cleric specific bonuses
  singleTargetHealingBonus: number;
  areaHealingReduction: number;
  areaTargetReduction: number;
  areaHealingPerTargetBonus: number;
  healingReduction: number;
  lowLifeHealingBonus: number;
  healingCannotCrit: boolean;
  hotEffectivenessReduction: number;
  manaCostIncrease: number;
  // Blood Confessor specific bonuses
  lifeCostReduction: number;
  lifeSpentReturn: number;
  lifeCostIncrease: number;
  healingOutputBonus: number;
  selfHealFromHealing: number;
  lowLifeDamageReduction: number;
  lifeRegenOnLifeSpend: number;
  allyLifeRecoveryFromLifeSpent: number;
  allyDRFromHealing: number;
  allyLifeRegenFromHealing: number;
  healingOverTimeFromHeal: number;
  bigLifeLossDR: number;
  allyHitDRFromHealing: number;
  lowLifeHealingIncrease: number;
  lifeCostFloor: number;
  lifeCostChaosDamage: number;
  endlessMartyrdom: boolean;
  lifeCostStackingHealing: number;
  allyMaxLifeFromHealing: number;
  // Tactician specific bonuses
  allyDamageReduction: number;
  lowLifeAllyDR: number;
  dotDamageReduction: number;
  defensiveCooldownReduction: number;
  defensiveCooldownEffect: number;
  defensiveCooldownCDR: number;
  crisisProtocolDR: number;
  damageRedistribution: number;
  failSafeFormationDR: number;
  directHealBonus: number;
  healCooldownIncrease: number;
  healingLifeRegen: number;
  overhealingToRegen: number;
  allyMaxLifeBonus: number;
  allyCritDamageReduction: number;
  allyDealLessDamage: number;
  allyTakeLessDamage: number;
  battlePlanAlphaDR: number;
  perfectExecutionDR: number;
  strategicMastery: boolean;
  // Grove Healer specific bonuses
  lifeRegenRate: number;
  regenDuration: number;
  flatLifeRegenPerSecond: number;
  lowLifeRegenRate: number;
  regenRatePerEffect: number;
  regenRateSlower: number;
  physicalDRWhileRegen: number;
  elementalDRWhileRegen: number;
  maxResWhileRegen: number;
  regenRateAfterHit: number;
  dotDRWhileRegen: number;
  instantRegenPercent: number;
  regenEffectMore: number;
  regenSpeedFaster: number;
  excessRegenToES: number;
  additionalLifeRegenPerSecond: number;
  regenEffectMoreBonus: number;
  regenCannotBeReduced: boolean;
  drWhileRegen: number;
  regenShareToAllies: number;
  regenDurationReduction: number;
  specialEffects: TalentEffect[];
}

export function calculateTalentBonuses(classId: CharacterClassId, selectedTalents: SelectedTalents): TalentBonuses {
  const bonuses: TalentBonuses = {
    damageMultiplier: 0, healingMultiplier: 0, damageReduction: 0,
    armorMultiplier: 0, evasionMultiplier: 0, healthMultiplier: 0, manaRegenMultiplier: 0,
    manaCostReduction: 0, cooldownReduction: 0, blockBonus: 0,
    blockEffectiveness: 0, critBonus: 0, castSpeedBonus: 0, 
    lifesteal: 0, thorns: 0, resistanceBonus: 0,
    // Iron Skirmisher specific
    enemyAttackSpeedReduction: 0, enemyAccuracyReduction: 0,
    attackDamageReduction: 0, physicalDamageReductionFromArmor: 0,
    armorEffectivenessVsAttacks: 100, // Default 100% (normal)
    evasionToMitigationPercent: 0, selfDamageReduction: 0,
    // Duel Warden specific
    spellBlockBonus: 0, nonBlockedDamageReduction: 0,
    blockToSpellBlockPercent: 0,
    // Shadow Warden specific
    spellSuppressionChance: 0, spellSuppressionEffect: 0,
    evadeChanceToSuppressionPercent: 0, evadeChance: 0,
    enemyCritChanceReduction: 0, enemyCritMultiplierReduction: 0,
    elementalDamageReduction: 0, hitDamageReduction: 0,
    enemyCritDamageReduction: 0, suppressedNoCrit: false,
    // Ghostblade specific
    armorReduction: 0, allyEvadeChance: 0,
    // Arcane Bulwark specific
    esRechargeRate: 0, esRechargeDelay: 0, esRecoveryBonus: 0,
    esRegeneration: 0, spellDamageReduction: 0, maxESBonus: 0,
    maxLifeReduction: 0, elementalResistanceBonus: 0, esLeech: 0,
    allySpellDamageReduction: 0,
    // Null Templar specific
    chaosResistance: 0, maxChaosResistance: 0, chaosDamageReduction: 0,
    allyChaosResistance: 0, allyElementalDamageReduction: 0,
    // Phase Guardian specific
    dodgeChance: 0, allyEvasionRating: 0, maxESReduction: 0,
    // High Cleric specific
    singleTargetHealingBonus: 0, areaHealingReduction: 0,
    areaTargetReduction: 0, areaHealingPerTargetBonus: 0,
    healingReduction: 0, lowLifeHealingBonus: 0, healingCannotCrit: false,
    hotEffectivenessReduction: 0, manaCostIncrease: 0,
    // Blood Confessor specific
    lifeCostReduction: 0, lifeSpentReturn: 0, lifeCostIncrease: 0,
    healingOutputBonus: 0, selfHealFromHealing: 0, lowLifeDamageReduction: 0,
    lifeRegenOnLifeSpend: 0, allyLifeRecoveryFromLifeSpent: 0, allyDRFromHealing: 0,
    allyLifeRegenFromHealing: 0, healingOverTimeFromHeal: 0, bigLifeLossDR: 0,
    allyHitDRFromHealing: 0, lowLifeHealingIncrease: 0, lifeCostFloor: 0,
    lifeCostChaosDamage: 0, endlessMartyrdom: false, lifeCostStackingHealing: 0,
    allyMaxLifeFromHealing: 0,
    // Tactician specific
    allyDamageReduction: 0, lowLifeAllyDR: 0, dotDamageReduction: 0,
    defensiveCooldownReduction: 0, defensiveCooldownEffect: 0, defensiveCooldownCDR: 0,
    crisisProtocolDR: 0, damageRedistribution: 0, failSafeFormationDR: 0,
    directHealBonus: 0, healCooldownIncrease: 0, healingLifeRegen: 0,
    overhealingToRegen: 0, allyMaxLifeBonus: 0, allyCritDamageReduction: 0,
    allyDealLessDamage: 0, allyTakeLessDamage: 0, battlePlanAlphaDR: 0,
    perfectExecutionDR: 0, strategicMastery: false,
    // Grove Healer specific
    lifeRegenRate: 0, regenDuration: 0, flatLifeRegenPerSecond: 0,
    lowLifeRegenRate: 0, regenRatePerEffect: 0, regenRateSlower: 0,
    physicalDRWhileRegen: 0, elementalDRWhileRegen: 0, maxResWhileRegen: 0,
    regenRateAfterHit: 0, dotDRWhileRegen: 0, instantRegenPercent: 0,
    regenEffectMore: 0, regenSpeedFaster: 0, excessRegenToES: 0,
    additionalLifeRegenPerSecond: 0, regenEffectMoreBonus: 0, regenCannotBeReduced: false,
    drWhileRegen: 0, regenShareToAllies: 0, regenDurationReduction: 0,
    specialEffects: []
  };
  
  const effects = getSelectedTalentEffects(classId, selectedTalents);
  
  for (const effect of effects) {
    switch (effect.type) {
      case 'damageIncrease': bonuses.damageMultiplier += effect.value; break;
      case 'healingIncrease': bonuses.healingMultiplier += effect.value; break;
      case 'damageReduction': bonuses.damageReduction += effect.value; break;
      case 'armorBonus': bonuses.armorMultiplier += effect.value; break;
      case 'evasionBonus': bonuses.evasionMultiplier += effect.value; break;
      case 'resistanceBonus': bonuses.resistanceBonus += effect.value; break;
      case 'manaRegen': bonuses.manaRegenMultiplier += effect.value; break;
      case 'manaReduction': bonuses.manaCostReduction += effect.value; break;
      case 'cooldownReduction': bonuses.cooldownReduction += effect.value; break;
      case 'blockBonus': bonuses.blockBonus += effect.value; break;
      case 'blockEffectiveness': bonuses.blockEffectiveness += effect.value; break;
      case 'critBonus': bonuses.critBonus += effect.value; break;
      case 'castSpeed': bonuses.castSpeedBonus += effect.value; break;
      case 'lifesteal': bonuses.lifesteal += effect.value; break;
      case 'thorns': bonuses.thorns += effect.value; break;
      // Iron Skirmisher specific effect types
      case 'enemyAttackSpeed': bonuses.enemyAttackSpeedReduction += effect.value; break;
      case 'enemyAccuracy': bonuses.enemyAccuracyReduction += effect.value; break;
      case 'attackDamageReduction': bonuses.attackDamageReduction += effect.value; break;
      case 'physicalDamageReductionFromArmor': bonuses.physicalDamageReductionFromArmor += effect.value; break;
      case 'armorEffectiveness': bonuses.armorEffectivenessVsAttacks = effect.value; break;
      case 'evasionToMitigation': bonuses.evasionToMitigationPercent = effect.value; break;
      case 'selfDamageReduction': bonuses.selfDamageReduction += effect.value; break;
      // Duel Warden specific effect types
      case 'spellBlockBonus': bonuses.spellBlockBonus += effect.value; break;
      case 'nonBlockedDamageReduction': bonuses.nonBlockedDamageReduction += effect.value; break;
      case 'blockToSpellBlock': bonuses.blockToSpellBlockPercent = effect.value; break;
      // Shadow Warden specific effect types
      case 'spellSuppressionChance': bonuses.spellSuppressionChance += effect.value; break;
      case 'spellSuppressionEffect': bonuses.spellSuppressionEffect += effect.value; break;
      case 'evadeChanceToSuppression': bonuses.evadeChanceToSuppressionPercent = effect.value; break;
      case 'evadeChance': bonuses.evadeChance += effect.value; break;
      case 'enemyCritChance': bonuses.enemyCritChanceReduction += effect.value; break;
      case 'enemyCritMultiplier': bonuses.enemyCritMultiplierReduction += effect.value; break;
      case 'elementalDamageReduction': bonuses.elementalDamageReduction += effect.value; break;
      case 'hitDamageReduction': bonuses.hitDamageReduction += effect.value; break;
      case 'enemyCritDamageReduction': bonuses.enemyCritDamageReduction += effect.value; break;
      case 'suppressedNoCrit': bonuses.suppressedNoCrit = true; break;
      case 'statMultiplier':
        if (effect.stat === 'armor') bonuses.armorMultiplier += effect.value;
        else if (effect.stat === 'life') bonuses.healthMultiplier += effect.value;
        else if (effect.stat === 'evasion') bonuses.evasionMultiplier += effect.value;
        break;
      // Ghostblade specific effect types
      case 'armorReduction': bonuses.armorReduction += effect.value; break;
      case 'allyEvadeChance': bonuses.allyEvadeChance += effect.value; break;
      // Arcane Bulwark specific effect types
      case 'esRechargeRate': bonuses.esRechargeRate += effect.value; break;
      case 'esRechargeDelay': bonuses.esRechargeDelay += effect.value; break;
      case 'esRecoveryBonus': bonuses.esRecoveryBonus += effect.value; break;
      case 'esRegeneration': bonuses.esRegeneration += effect.value; break;
      case 'spellDamageReduction': bonuses.spellDamageReduction += effect.value; break;
      case 'maxESBonus': bonuses.maxESBonus += effect.value; break;
      case 'maxLifeReduction': bonuses.maxLifeReduction += effect.value; break;
      case 'elementalResistanceBonus': bonuses.elementalResistanceBonus += effect.value; break;
      case 'esLeech': bonuses.esLeech += effect.value; break;
      case 'allySpellDamageReduction': bonuses.allySpellDamageReduction += effect.value; break;
      // Null Templar specific effect types
      case 'chaosResistance': bonuses.chaosResistance += effect.value; break;
      case 'maxChaosResistance': bonuses.maxChaosResistance += effect.value; break;
      case 'chaosDamageReduction': bonuses.chaosDamageReduction += effect.value; break;
      case 'allyChaosResistance': bonuses.allyChaosResistance += effect.value; break;
      case 'allyElementalDamageReduction': bonuses.allyElementalDamageReduction += effect.value; break;
      // Phase Guardian specific effect types
      case 'dodgeChance': bonuses.dodgeChance += effect.value; break;
      case 'allyEvasionRating': bonuses.allyEvasionRating += effect.value; break;
      case 'maxESReduction': bonuses.maxESReduction += effect.value; break;
      // High Cleric specific effect types
      case 'singleTargetHealingBonus': bonuses.singleTargetHealingBonus += effect.value; break;
      case 'areaHealingReduction': bonuses.areaHealingReduction += effect.value; break;
      case 'areaTargetReduction': bonuses.areaTargetReduction += effect.value; break;
      case 'areaHealingPerTargetBonus': bonuses.areaHealingPerTargetBonus += effect.value; break;
      case 'healingReduction': bonuses.healingReduction += effect.value; break;
      case 'lowLifeHealingBonus': bonuses.lowLifeHealingBonus += effect.value; break;
      case 'healingCannotCrit': bonuses.healingCannotCrit = true; break;
      case 'hotEffectivenessReduction': bonuses.hotEffectivenessReduction += effect.value; break;
      case 'manaCostIncrease': bonuses.manaCostIncrease += effect.value; break;
      // Complex effects stored for combat system to handle
      case 'onHitEffect': case 'onHealEffect': case 'onBlockEffect':
      case 'onLowHealth': case 'onFullHealth': case 'grantAbility':
      case 'modifyAbility': case 'conditional': case 'bigHitReduction':
      case 'critImmunity': case 'allyProtection': case 'damageRedirect':
      case 'maxHitCap': case 'lifeOnBlock':
      // Duel Warden complex effects
      case 'onEvadeEffect': case 'onMissEffect':
      // Shadow Warden complex effects
      case 'allySuppressionShare': case 'allyAccuracyDebuffShare':
      // Ghostblade complex effects
      case 'afterHitEffect': case 'consecutiveEvadeBonus':
      case 'conditionalEvasion': case 'lessDamageIfEvadedRecently':
      case 'enemyHitCooldown':
      // Arcane Bulwark complex effects
      case 'esRechargeNotInterruptedByBlock': case 'blockedDamageToESFirst':
      case 'elementalDRWhileES': case 'blockDamageToES': case 'allyESFromYours':
      case 'onBlockAllyDR': case 'chaosDoesNotBypassES': case 'esOvercharge':
      case 'crystalCitadelEffect':
      // Null Templar complex effects
      case 'armorToChaosDamage': case 'chaosDamagePrevention': case 'elementalDamageToES':
      case 'esRechargeSlowed': case 'esRechargeNotInterrupted': case 'allySpellDamageReductionOnHit':
      case 'allySpellDamageRedirect': case 'chaosResToElementalDR': case 'spellDamageCap':
      case 'physicalToChaosDamage': case 'entropyAnchorEffect':
      // Phase Guardian complex effects
      case 'esRemovalDamageReduction': case 'onESRechargeStartDR': case 'spellDamageESReduction':
      case 'onDodgeESRecharge': case 'onDodgeDR': case 'onDodgeESRestore':
      case 'allyDRWhileRecharging': case 'untouchableWindowEffect':
      // High Cleric complex effects
      case 'excessHealingRedistribution': case 'excessHealingStorage': case 'faithfulChannelEffect':
      case 'crisisFocusEffect': case 'beaconOfMercyEffect': case 'sharedSalvationEffect':
      case 'allyDRWhileHighLife': case 'healingToHoT': case 'healingRemovesDoT':
      case 'perfectDisciplineEffect': case 'healingCannotBeInterrupted': case 'divineAllocationEffect':
        bonuses.specialEffects.push(effect);
        break;
      // Blood Confessor specific effect types
      case 'lifeCostReduction': bonuses.lifeCostReduction += effect.value; break;
      case 'lifeSpentReturn': bonuses.lifeSpentReturn += effect.value; break;
      case 'lifeCostIncrease': bonuses.lifeCostIncrease += effect.value; break;
      case 'healingOutputBonus': bonuses.healingOutputBonus += effect.value; break;
      case 'selfHealFromHealing': bonuses.selfHealFromHealing += effect.value; break;
      case 'lowLifeDamageReduction': bonuses.lowLifeDamageReduction += effect.value; break;
      case 'lifeRegenOnLifeSpend': bonuses.lifeRegenOnLifeSpend += effect.value; break;
      case 'allyLifeRecoveryFromLifeSpent': bonuses.allyLifeRecoveryFromLifeSpent += effect.value; break;
      case 'allyDRFromHealing': bonuses.allyDRFromHealing += effect.value; break;
      case 'allyLifeRegenFromHealing': bonuses.allyLifeRegenFromHealing += effect.value; break;
      case 'healingOverTimeFromHeal': bonuses.healingOverTimeFromHeal += effect.value; break;
      case 'bigLifeLossDR': bonuses.bigLifeLossDR += effect.value; break;
      case 'allyHitDRFromHealing': bonuses.allyHitDRFromHealing += effect.value; break;
      case 'lowLifeHealingIncrease': bonuses.lowLifeHealingIncrease += effect.value; break;
      case 'lifeCostFloor': bonuses.lifeCostFloor = Math.max(bonuses.lifeCostFloor, effect.value); break;
      case 'lifeCostChaosDamage': bonuses.lifeCostChaosDamage += effect.value; break;
      case 'endlessMartyrdomEffect': bonuses.endlessMartyrdom = true; break;
      case 'lifeCostStackingHealing': bonuses.lifeCostStackingHealing += effect.value; break;
      case 'allyMaxLifeFromHealing': bonuses.allyMaxLifeFromHealing += effect.value; break;
      // Tactician specific effect types
      case 'allyDamageReduction': bonuses.allyDamageReduction += effect.value; break;
      case 'lowLifeAllyDR': bonuses.lowLifeAllyDR += effect.value; break;
      case 'dotDamageReduction': bonuses.dotDamageReduction += effect.value; break;
      case 'defensiveCooldownReduction': bonuses.defensiveCooldownReduction += effect.value; break;
      case 'defensiveCooldownEffect': bonuses.defensiveCooldownEffect += effect.value; break;
      case 'defensiveCooldownCDR': bonuses.defensiveCooldownCDR += effect.value; break;
      case 'crisisProtocolDR': bonuses.crisisProtocolDR += effect.value; break;
      case 'damageRedistribution': bonuses.damageRedistribution += effect.value; break;
      case 'failSafeFormationDR': bonuses.failSafeFormationDR += effect.value; break;
      case 'directHealBonus': bonuses.directHealBonus += effect.value; break;
      case 'healCooldownIncrease': bonuses.healCooldownIncrease += effect.value; break;
      case 'healingLifeRegen': bonuses.healingLifeRegen += effect.value; break;
      case 'overhealingToRegen': bonuses.overhealingToRegen += effect.value; break;
      case 'allyMaxLifeBonus': bonuses.allyMaxLifeBonus += effect.value; break;
      case 'allyCritDamageReduction': bonuses.allyCritDamageReduction += effect.value; break;
      case 'allyDealLessDamage': bonuses.allyDealLessDamage += effect.value; break;
      case 'allyTakeLessDamage': bonuses.allyTakeLessDamage += effect.value; break;
      case 'battlePlanAlphaDR': bonuses.battlePlanAlphaDR += effect.value; break;
      case 'perfectExecutionDR': bonuses.perfectExecutionDR += effect.value; break;
      case 'strategicMasteryEffect': bonuses.strategicMastery = true; break;
      // Grove Healer specific effect types
      case 'lifeRegenRate': bonuses.lifeRegenRate += effect.value; break;
      case 'regenDuration': bonuses.regenDuration += effect.value; break;
      case 'flatLifeRegenPerSecond': bonuses.flatLifeRegenPerSecond += effect.value; break;
      case 'lowLifeRegenRate': bonuses.lowLifeRegenRate += effect.value; break;
      case 'regenRatePerEffect': bonuses.regenRatePerEffect += effect.value; break;
      case 'regenRateSlower': bonuses.regenRateSlower += effect.value; break;
      case 'physicalDRWhileRegen': bonuses.physicalDRWhileRegen += effect.value; break;
      case 'elementalDRWhileRegen': bonuses.elementalDRWhileRegen += effect.value; break;
      case 'maxResWhileRegen': bonuses.maxResWhileRegen += effect.value; break;
      case 'regenRateAfterHit': bonuses.regenRateAfterHit += effect.value; break;
      case 'dotDRWhileRegen': bonuses.dotDRWhileRegen += effect.value; break;
      case 'instantRegenPercent': bonuses.instantRegenPercent += effect.value; break;
      case 'regenEffectMore': bonuses.regenEffectMore += effect.value; break;
      case 'regenSpeedFaster': bonuses.regenSpeedFaster += effect.value; break;
      case 'excessRegenToES': bonuses.excessRegenToES += effect.value; break;
      case 'additionalLifeRegenPerSecond': bonuses.additionalLifeRegenPerSecond += effect.value; break;
      case 'regenEffectMoreBonus': bonuses.regenEffectMoreBonus += effect.value; break;
      case 'regenCannotBeReduced': bonuses.regenCannotBeReduced = true; break;
      case 'drWhileRegen': bonuses.drWhileRegen += effect.value; break;
      case 'regenShareToAllies': bonuses.regenShareToAllies += effect.value; break;
      case 'regenDurationReduction': bonuses.regenDurationReduction += effect.value; break;
    }
  }
  
  return bonuses;
}
