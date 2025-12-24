// Auto-generated from PoE data files
// Run: node scripts/extractBaseItems.cjs to regenerate

import type { PoeBaseItem, PoeMod } from '../types/poeItems';

// ===== IMPLICIT MODS =====
// These are the built-in mods on base items
export const POE_IMPLICIT_MODS: Record<string, PoeMod> = {
  "ManaRegenerationImplicitAmulet2": {
      "id": "ManaRegenerationImplicitAmulet2",
      "name": "",
      "requiredLevel": 97,
      "stats": [
          {
              "id": "mana_regeneration_rate_+%",
              "max": 56,
              "min": 48
          }
      ],
      "groups": [
          "ManaRegeneration"
      ]
  },
  "LifeRegenerationImplicitAmulet2": {
      "id": "LifeRegenerationImplicitAmulet2",
      "name": "",
      "requiredLevel": 93,
      "stats": [
          {
              "id": "life_regeneration_rate_per_minute_%",
              "max": 96,
              "min": 72
          }
      ],
      "groups": [
          "LifeRegenerationRatePercentage"
      ]
  },
  "ReducedEnergyShieldDelayImplicit1_": {
      "id": "ReducedEnergyShieldDelayImplicit1_",
      "name": "",
      "requiredLevel": 93,
      "stats": [
          {
              "id": "energy_shield_delay_-%",
              "max": 15,
              "min": 10
          }
      ],
      "groups": [
          "EnergyShieldDelay"
      ]
  },
  "ManaRegenerationImplicitAmulet1": {
      "id": "ManaRegenerationImplicitAmulet1",
      "name": "",
      "requiredLevel": 2,
      "stats": [
          {
              "id": "mana_regeneration_rate_+%",
              "max": 30,
              "min": 20
          }
      ],
      "groups": [
          "ManaRegeneration"
      ]
  },
  "HybridStrDex": {
      "id": "HybridStrDex",
      "name": "",
      "requiredLevel": 20,
      "stats": [
          {
              "id": "additional_strength_and_dexterity",
              "max": 24,
              "min": 16
          }
      ],
      "groups": [
          "HybridStat"
      ]
  },
  "LifeRegenerationImplicitAmulet1": {
      "id": "LifeRegenerationImplicitAmulet1",
      "name": "",
      "requiredLevel": 2,
      "stats": [
          {
              "id": "base_life_regeneration_rate_per_minute",
              "max": 240,
              "min": 120
          }
      ],
      "groups": [
          "LifeRegeneration"
      ]
  },
  "StrengthImplicitAmulet1": {
      "id": "StrengthImplicitAmulet1",
      "name": "",
      "requiredLevel": 7,
      "stats": [
          {
              "id": "additional_strength",
              "max": 30,
              "min": 20
          }
      ],
      "groups": [
          "Strength"
      ]
  },
  "DexterityImplicitAmulet1": {
      "id": "DexterityImplicitAmulet1",
      "name": "",
      "requiredLevel": 7,
      "stats": [
          {
              "id": "additional_dexterity",
              "max": 30,
              "min": 20
          }
      ],
      "groups": [
          "Dexterity"
      ]
  },
  "IntelligenceImplicitAmulet1": {
      "id": "IntelligenceImplicitAmulet1",
      "name": "",
      "requiredLevel": 7,
      "stats": [
          {
              "id": "additional_intelligence",
              "max": 30,
              "min": 20
          }
      ],
      "groups": [
          "Intelligence"
      ]
  },
  "ItemFoundRarityIncreaseImplicitAmulet1": {
      "id": "ItemFoundRarityIncreaseImplicitAmulet1",
      "name": "",
      "requiredLevel": 10,
      "stats": [
          {
              "id": "base_item_found_rarity_+%",
              "max": 20,
              "min": 12
          }
      ],
      "groups": [
          "ItemFoundRarityIncrease"
      ]
  },
  "AllAttributesImplicitAmulet1": {
      "id": "AllAttributesImplicitAmulet1",
      "name": "",
      "requiredLevel": 25,
      "stats": [
          {
              "id": "additional_all_attributes",
              "max": 16,
              "min": 10
          }
      ],
      "groups": [
          "AllAttributes"
      ]
  },
  "HybridDexInt": {
      "id": "HybridDexInt",
      "name": "",
      "requiredLevel": 20,
      "stats": [
          {
              "id": "additional_dexterity_and_intelligence",
              "max": 24,
              "min": 16
          }
      ],
      "groups": [
          "HybridStat"
      ]
  },
  "HybridStrInt": {
      "id": "HybridStrInt",
      "name": "",
      "requiredLevel": 20,
      "stats": [
          {
              "id": "additional_strength_and_intelligence",
              "max": 24,
              "min": 16
          }
      ],
      "groups": [
          "HybridStat"
      ]
  },
  "TalismanHasOneSocket_": {
      "id": "TalismanHasOneSocket_",
      "name": "",
      "requiredLevel": 1,
      "stats": [
          {
              "id": "local_has_X_sockets",
              "max": 1,
              "min": 1
          }
      ],
      "groups": [
          "Other"
      ]
  },
  "TalismanCanBePickedUpByMonster": {
      "id": "TalismanCanBePickedUpByMonster",
      "name": "",
      "requiredLevel": 1,
      "stats": [
          {
              "id": "local_stat_monsters_pick_up_item",
              "max": 1,
              "min": 1
          }
      ],
      "groups": [
          "TalismanPickUp"
      ]
  },
  "TalismanAttackAndCastSpeed": {
      "id": "TalismanAttackAndCastSpeed",
      "name": "",
      "requiredLevel": 1,
      "stats": [
          {
              "id": "attack_and_cast_speed_+%",
              "max": 10,
              "min": 6
          }
      ],
      "groups": [
          "AttackCastSpeed"
      ]
  },
  "TalismanSpellDamage": {
      "id": "TalismanSpellDamage",
      "name": "",
      "requiredLevel": 1,
      "stats": [
          {
              "id": "spell_damage_+%",
              "max": 30,
              "min": 20
          }
      ],
      "groups": [
          "SpellDamage"
      ]
  },
  "TalismanAttackDamage": {
      "id": "TalismanAttackDamage",
      "name": "",
      "requiredLevel": 1,
      "stats": [
          {
              "id": "attack_damage_+%",
              "max": 30,
              "min": 20
          }
      ],
      "groups": [
          "AttackDamage"
      ]
  },
  "TalismanIncreasedMana": {
      "id": "TalismanIncreasedMana",
      "name": "",
      "requiredLevel": 1,
      "stats": [
          {
              "id": "maximum_mana_+%",
              "max": 30,
              "min": 20
          }
      ],
      "groups": [
          "MaximumManaIncreasePercent"
      ]
  },
  "TalismanIncreasedFireDamage": {
      "id": "TalismanIncreasedFireDamage",
      "name": "",
      "requiredLevel": 1,
      "stats": [
          {
              "id": "fire_damage_+%",
              "max": 30,
              "min": 20
          }
      ],
      "groups": [
          "FireDamagePercentage"
      ]
  },
  "TalismanIncreasedLightningDamage": {
      "id": "TalismanIncreasedLightningDamage",
      "name": "",
      "requiredLevel": 1,
      "stats": [
          {
              "id": "lightning_damage_+%",
              "max": 30,
              "min": 20
          }
      ],
      "groups": [
          "LightningDamagePercentage"
      ]
  },
  "TalismanIncreasedColdDamage": {
      "id": "TalismanIncreasedColdDamage",
      "name": "",
      "requiredLevel": 1,
      "stats": [
          {
              "id": "cold_damage_+%",
              "max": 30,
              "min": 20
          }
      ],
      "groups": [
          "ColdDamagePercentage"
      ]
  },
  "TalismanIncreasedPhysicalDamage": {
      "id": "TalismanIncreasedPhysicalDamage",
      "name": "",
      "requiredLevel": 1,
      "stats": [
          {
              "id": "physical_damage_+%",
              "max": 30,
              "min": 20
          }
      ],
      "groups": [
          "PhysicalDamagePercent"
      ]
  },
  "TalismanIncreasedChaosDamage": {
      "id": "TalismanIncreasedChaosDamage",
      "name": "",
      "requiredLevel": 1,
      "stats": [
          {
              "id": "chaos_damage_+%",
              "max": 31,
              "min": 19
          }
      ],
      "groups": [
          "IncreasedChaosDamage"
      ]
  },
  "TalismanAdditionalZombie": {
      "id": "TalismanAdditionalZombie",
      "name": "",
      "requiredLevel": 1,
      "stats": [
          {
              "id": "base_number_of_zombies_allowed",
              "max": 1,
              "min": 1
          },
          {
              "id": "base_number_of_skeletons_allowed",
              "max": 0,
              "min": 0
          },
          {
              "id": "base_number_of_spectres_allowed",
              "max": 0,
              "min": 0
          }
      ],
      "groups": [
          "MaximumMinionCount"
      ]
  },
  "TalismanFishBiteSensitivity": {
      "id": "TalismanFishBiteSensitivity",
      "name": "",
      "requiredLevel": 1,
      "stats": [
          {
              "id": "fishing_bite_sensitivity_+%",
              "max": 40,
              "min": 30
          }
      ],
      "groups": [
          "FishingBiteSensitivity"
      ]
  },
  "TalismanIncreasedCriticalChance": {
      "id": "TalismanIncreasedCriticalChance",
      "name": "",
      "requiredLevel": 1,
      "stats": [
          {
              "id": "critical_strike_chance_+%",
              "max": 50,
              "min": 40
          }
      ],
      "groups": [
          "CriticalStrikeChanceIncrease"
      ]
  },
  "TalismanPercentLifeRegeneration": {
      "id": "TalismanPercentLifeRegeneration",
      "name": "",
      "requiredLevel": 1,
      "stats": [
          {
              "id": "life_regeneration_rate_per_minute_%",
              "max": 120,
              "min": 120
          }
      ],
      "groups": [
          "LifeRegenerationRatePercentage"
      ]
  },
  "TalismanIncreasedCriticalStrikeMultiplier_": {
      "id": "TalismanIncreasedCriticalStrikeMultiplier_",
      "name": "",
      "requiredLevel": 1,
      "stats": [
          {
              "id": "base_critical_strike_multiplier_+",
              "max": 36,
              "min": 24
          }
      ],
      "groups": [
          "CriticalStrikeMultiplier"
      ]
  },
  "TalismanChanceToFreezeShockIgnite_": {
      "id": "TalismanChanceToFreezeShockIgnite_",
      "name": "",
      "requiredLevel": 1,
      "stats": [
          {
              "id": "chance_to_freeze_shock_ignite_%",
              "max": 6,
              "min": 4
          }
      ],
      "groups": [
          "ChanceToFreezeShockIgnite"
      ]
  },
  "TalismanGlobalDefensesPercent": {
      "id": "TalismanGlobalDefensesPercent",
      "name": "",
      "requiredLevel": 1,
      "stats": [
          {
              "id": "global_defences_+%",
              "max": 25,
              "min": 15
          }
      ],
      "groups": [
          "AllDefences"
      ]
  },
  "TalismanFireTakenAsCold": {
      "id": "TalismanFireTakenAsCold",
      "name": "",
      "requiredLevel": 1,
      "stats": [
          {
              "id": "fire_damage_taken_%_as_cold",
              "max": 50,
              "min": 50
          }
      ],
      "groups": [
          "ElementalDamageTakenAsAnotherElement"
      ]
  },
  "TalismanFireTakenAsLightning": {
      "id": "TalismanFireTakenAsLightning",
      "name": "",
      "requiredLevel": 1,
      "stats": [
          {
              "id": "fire_damage_taken_%_as_lightning",
              "max": 50,
              "min": 50
          }
      ],
      "groups": [
          "ElementalDamageTakenAsAnotherElement"
      ]
  },
  "TalismanColdTakenAsFire": {
      "id": "TalismanColdTakenAsFire",
      "name": "",
      "requiredLevel": 1,
      "stats": [
          {
              "id": "cold_damage_taken_%_as_fire",
              "max": 50,
              "min": 50
          }
      ],
      "groups": [
          "ElementalDamageTakenAsAnotherElement"
      ]
  },
  "TalismanColdTakenAsLightning": {
      "id": "TalismanColdTakenAsLightning",
      "name": "",
      "requiredLevel": 1,
      "stats": [
          {
              "id": "cold_damage_taken_%_as_lightning",
              "max": 50,
              "min": 50
          }
      ],
      "groups": [
          "ElementalDamageTakenAsAnotherElement"
      ]
  },
  "TalismanLightningTakenAsCold": {
      "id": "TalismanLightningTakenAsCold",
      "name": "",
      "requiredLevel": 1,
      "stats": [
          {
              "id": "lightning_damage_taken_%_as_cold",
              "max": 50,
              "min": 50
          }
      ],
      "groups": [
          "ElementalDamageTakenAsAnotherElement"
      ]
  },
  "TalismanLightningTakenAsFire": {
      "id": "TalismanLightningTakenAsFire",
      "name": "",
      "requiredLevel": 1,
      "stats": [
          {
              "id": "lightning_damage_taken_%_as_fire",
              "max": 50,
              "min": 50
          }
      ],
      "groups": [
          "ElementalDamageTakenAsAnotherElement"
      ]
  },
  "TalismanIncreasedLife": {
      "id": "TalismanIncreasedLife",
      "name": "",
      "requiredLevel": 1,
      "stats": [
          {
              "id": "maximum_life_+%",
              "max": 12,
              "min": 8
          }
      ],
      "groups": [
          "MaximumLifeIncreasePercent"
      ]
  },
  "TalismanAdditionalPierce": {
      "id": "TalismanAdditionalPierce",
      "name": "",
      "requiredLevel": 1,
      "stats": [
          {
              "id": "projectile_base_number_of_targets_to_pierce",
              "max": 2,
              "min": 2
          }
      ],
      "groups": [
          "Pierce"
      ]
  },
  "TalismanIncreasedItemQuantity": {
      "id": "TalismanIncreasedItemQuantity",
      "name": "",
      "requiredLevel": 1,
      "stats": [
          {
              "id": "base_item_found_quantity_+%",
              "max": 10,
              "min": 6
          }
      ],
      "groups": [
          "Other"
      ]
  },
  "TalismanIncreasedAllAttributes": {
      "id": "TalismanIncreasedAllAttributes",
      "name": "",
      "requiredLevel": 1,
      "stats": [
          {
              "id": "all_attributes_+%",
              "max": 16,
              "min": 12
          }
      ],
      "groups": [
          "PercentageAllAttributes"
      ]
  },
  "TalismanIncreasedAreaOfEffect": {
      "id": "TalismanIncreasedAreaOfEffect",
      "name": "",
      "requiredLevel": 1,
      "stats": [
          {
              "id": "base_skill_area_of_effect_+%",
              "max": 8,
              "min": 5
          }
      ],
      "groups": [
          "AreaOfEffect"
      ]
  },
  "TalismanReducedPhysicalDamageTaken_": {
      "id": "TalismanReducedPhysicalDamageTaken_",
      "name": "",
      "requiredLevel": 1,
      "stats": [
          {
              "id": "base_additional_physical_damage_reduction_%",
              "max": 6,
              "min": 4
          }
      ],
      "groups": [
          "ReducedPhysicalDamageTaken"
      ]
  },
  "TalismanIncreasedDamage": {
      "id": "TalismanIncreasedDamage",
      "name": "",
      "requiredLevel": 1,
      "stats": [
          {
              "id": "damage_+%",
              "max": 35,
              "min": 25
          }
      ],
      "groups": [
          "AllDamage"
      ]
  },
  "TalismanPowerChargeOnKill": {
      "id": "TalismanPowerChargeOnKill",
      "name": "",
      "requiredLevel": 1,
      "stats": [
          {
              "id": "add_power_charge_on_kill_%_chance",
              "max": 10,
              "min": 10
          }
      ],
      "groups": [
          "PowerChargeOnKillChance"
      ]
  },
  "TalismanFrenzyChargeOnKill": {
      "id": "TalismanFrenzyChargeOnKill",
      "name": "",
      "requiredLevel": 1,
      "stats": [
          {
              "id": "add_frenzy_charge_on_kill_%_chance",
              "max": 10,
              "min": 10
          }
      ],
      "groups": [
          "FrenzyChargeOnKillChance"
      ]
  },
  "TalismanEnduranceChargeOnKill_": {
      "id": "TalismanEnduranceChargeOnKill_",
      "name": "",
      "requiredLevel": 1,
      "stats": [
          {
              "id": "endurance_charge_on_kill_%",
              "max": 10,
              "min": 10
          }
      ],
      "groups": [
          "EnduranceChargeOnKillChance"
      ]
  },
  "TalismanDamageDealtAddedAsRandomElement": {
      "id": "TalismanDamageDealtAddedAsRandomElement",
      "name": "",
      "requiredLevel": 1,
      "stats": [
          {
              "id": "physical_damage_%_to_add_as_random_element",
              "max": 12,
              "min": 6
          }
      ],
      "groups": [
          "PhysicalDamageAddedAsRandomElement"
      ]
  },
  "MovementVelocityImplicitArmour1": {
      "id": "MovementVelocityImplicitArmour1",
      "name": "",
      "requiredLevel": 1,
      "stats": [
          {
              "id": "base_movement_velocity_+%",
              "max": 3,
              "min": 3
          }
      ],
      "groups": [
          "MovementVelocity"
      ]
  },
  "IncreasedManaImplicitArmour1": {
      "id": "IncreasedManaImplicitArmour1",
      "name": "",
      "requiredLevel": 1,
      "stats": [
          {
              "id": "base_maximum_mana",
              "max": 25,
              "min": 20
          }
      ],
      "groups": [
          "IncreasedMana"
      ]
  },
  "SpellDamageImplicitArmour1": {
      "id": "SpellDamageImplicitArmour1",
      "name": "",
      "requiredLevel": 1,
      "stats": [
          {
              "id": "spell_damage_+%",
              "max": 10,
              "min": 3
          }
      ],
      "groups": [
          "SpellDamage"
      ]
  },
  "AllResistancesImplicitArmour1": {
      "id": "AllResistancesImplicitArmour1",
      "name": "",
      "requiredLevel": 1,
      "stats": [
          {
              "id": "base_resist_all_elements_%",
              "max": 12,
              "min": 8
          }
      ],
      "groups": [
          "AllResistances"
      ]
  },
  "ColdAndLightningResistImplicitBoots1": {
      "id": "ColdAndLightningResistImplicitBoots1",
      "name": "",
      "requiredLevel": 78,
      "stats": [
          {
              "id": "cold_and_lightning_damage_resistance_%",
              "max": 12,
              "min": 8
          }
      ],
      "groups": [
          "ColdAndLightningResistance"
      ]
  },
  "FireAndColdResistImplicitBoots1_": {
      "id": "FireAndColdResistImplicitBoots1_",
      "name": "",
      "requiredLevel": 78,
      "stats": [
          {
              "id": "fire_and_cold_damage_resistance_%",
              "max": 12,
              "min": 8
          }
      ],
      "groups": [
          "FireAndColdResistance"
      ]
  },
  "FireAndLightningResistImplicitBoots1": {
      "id": "FireAndLightningResistImplicitBoots1",
      "name": "",
      "requiredLevel": 78,
      "stats": [
          {
              "id": "fire_and_lightning_damage_resistance_%",
              "max": 12,
              "min": 8
          }
      ],
      "groups": [
          "FireAndLightningResistance"
      ]
  },
  "ChaosResistImplicitBoots1": {
      "id": "ChaosResistImplicitBoots1",
      "name": "",
      "requiredLevel": 85,
      "stats": [
          {
              "id": "base_chaos_damage_resistance_%",
              "max": 17,
              "min": 13
          }
      ],
      "groups": [
          "ChaosResistance"
      ]
  },
  "ProjectileAttackDamageImplicitGloves1": {
      "id": "ProjectileAttackDamageImplicitGloves1",
      "name": "",
      "requiredLevel": 1,
      "stats": [
          {
              "id": "projectile_attack_damage_+%",
              "max": 18,
              "min": 14
          }
      ],
      "groups": [
          "ProjectileAttackDamage"
      ]
  },
  "SpellDamageImplicitGloves1": {
      "id": "SpellDamageImplicitGloves1",
      "name": "",
      "requiredLevel": 1,
      "stats": [
          {
              "id": "spell_damage_+%",
              "max": 16,
              "min": 12
          }
      ],
      "groups": [
          "SpellDamage"
      ]
  },
  "MeleeDamageImplicitGloves1": {
      "id": "MeleeDamageImplicitGloves1",
      "name": "",
      "requiredLevel": 78,
      "stats": [
          {
              "id": "melee_damage_+%",
              "max": 20,
              "min": 16
          }
      ],
      "groups": [
          "MeleeDamage"
      ]
  },
  "DegenerationDamageImplicit1": {
      "id": "DegenerationDamageImplicit1",
      "name": "",
      "requiredLevel": 85,
      "stats": [
          {
              "id": "damage_over_time_+%",
              "max": 18,
              "min": 14
          }
      ],
      "groups": [
          "DegenerationDamage"
      ]
  },
  "MinionDamageImplicitHelmet1": {
      "id": "MinionDamageImplicitHelmet1",
      "name": "",
      "requiredLevel": 78,
      "stats": [
          {
              "id": "minion_damage_+%",
              "max": 20,
              "min": 15
          }
      ],
      "groups": [
          "MinionDamage"
      ]
  },
  "MovementVelocityImplicitShield1": {
      "id": "MovementVelocityImplicitShield1",
      "name": "",
      "requiredLevel": 1,
      "stats": [
          {
              "id": "base_movement_velocity_+%",
              "max": 3,
              "min": 3
          }
      ],
      "groups": [
          "MovementVelocity"
      ]
  },
  "MovementVelocityImplicitShield3": {
      "id": "MovementVelocityImplicitShield3",
      "name": "",
      "requiredLevel": 1,
      "stats": [
          {
              "id": "base_movement_velocity_+%",
              "max": 9,
              "min": 9
          }
      ],
      "groups": [
          "MovementVelocity"
      ]
  },
  "MovementVelocityImplicitShield2": {
      "id": "MovementVelocityImplicitShield2",
      "name": "",
      "requiredLevel": 1,
      "stats": [
          {
              "id": "base_movement_velocity_+%",
              "max": 6,
              "min": 6
          }
      ],
      "groups": [
          "MovementVelocity"
      ]
  },
  "ChanceToDodgeImplicitShield1": {
      "id": "ChanceToDodgeImplicitShield1",
      "name": "",
      "requiredLevel": 1,
      "stats": [
          {
              "id": "base_spell_suppression_chance_%",
              "max": 3,
              "min": 3
          }
      ],
      "groups": [
          "ChanceToSuppressSpells"
      ]
  },
  "ChanceToDodgeSpellsImplicitShield1": {
      "id": "ChanceToDodgeSpellsImplicitShield1",
      "name": "",
      "requiredLevel": 1,
      "stats": [
          {
              "id": "base_spell_suppression_chance_%",
              "max": 3,
              "min": 3
          }
      ],
      "groups": [
          "ChanceToSuppressSpells"
      ]
  },
  "ChanceToDodgeImplicitShield2": {
      "id": "ChanceToDodgeImplicitShield2",
      "name": "",
      "requiredLevel": 1,
      "stats": [
          {
              "id": "base_spell_suppression_chance_%",
              "max": 5,
              "min": 5
          }
      ],
      "groups": [
          "ChanceToSuppressSpells"
      ]
  },
  "ChanceToDodgeSpellsImplicitShield2": {
      "id": "ChanceToDodgeSpellsImplicitShield2",
      "name": "",
      "requiredLevel": 1,
      "stats": [
          {
              "id": "base_spell_suppression_chance_%",
              "max": 5,
              "min": 5
          }
      ],
      "groups": [
          "ChanceToSuppressSpells"
      ]
  },
  "SpellDamageImplicitShield2": {
      "id": "SpellDamageImplicitShield2",
      "name": "",
      "requiredLevel": 1,
      "stats": [
          {
              "id": "spell_damage_+%",
              "max": 15,
              "min": 10
          }
      ],
      "groups": [
          "SpellDamage"
      ]
  },
  "SpellDamageImplicitShield1": {
      "id": "SpellDamageImplicitShield1",
      "name": "",
      "requiredLevel": 1,
      "stats": [
          {
              "id": "spell_damage_+%",
              "max": 10,
              "min": 5
          }
      ],
      "groups": [
          "SpellDamage"
      ]
  },
  "MinionDamageImplicitShield1": {
      "id": "MinionDamageImplicitShield1",
      "name": "",
      "requiredLevel": 1,
      "stats": [
          {
              "id": "minion_damage_+%",
              "max": 10,
              "min": 5
          }
      ],
      "groups": [
          "MinionDamage"
      ]
  },
  "IncreasedLifeImplicitShield3": {
      "id": "IncreasedLifeImplicitShield3",
      "name": "",
      "requiredLevel": 1,
      "stats": [
          {
              "id": "base_maximum_life",
              "max": 40,
              "min": 30
          }
      ],
      "groups": [
          "IncreasedLife"
      ]
  },
  "IncreasedLifeImplicitShield1": {
      "id": "IncreasedLifeImplicitShield1",
      "name": "",
      "requiredLevel": 1,
      "stats": [
          {
              "id": "base_maximum_life",
              "max": 20,
              "min": 10
          }
      ],
      "groups": [
          "IncreasedLife"
      ]
  },
  "IncreasedLifeImplicitShield2": {
      "id": "IncreasedLifeImplicitShield2",
      "name": "",
      "requiredLevel": 1,
      "stats": [
          {
              "id": "base_maximum_life",
              "max": 30,
              "min": 20
          }
      ],
      "groups": [
          "IncreasedLife"
      ]
  },
  "BlockRecoveryImplicitShield1": {
      "id": "BlockRecoveryImplicitShield1",
      "name": "",
      "requiredLevel": 1,
      "stats": [
          {
              "id": "block_recovery_+%",
              "max": 60,
              "min": 60
          }
      ],
      "groups": [
          "BlockRecovery"
      ]
  },
  "BlockRecoveryImplicitShield3": {
      "id": "BlockRecoveryImplicitShield3",
      "name": "",
      "requiredLevel": 1,
      "stats": [
          {
              "id": "block_recovery_+%",
              "max": 180,
              "min": 180
          }
      ],
      "groups": [
          "BlockRecovery"
      ]
  },
  "BlockRecoveryImplicitShield2": {
      "id": "BlockRecoveryImplicitShield2",
      "name": "",
      "requiredLevel": 1,
      "stats": [
          {
              "id": "block_recovery_+%",
              "max": 120,
              "min": 120
          }
      ],
      "groups": [
          "BlockRecovery"
      ]
  },
  "AllResistancesImplicitShield1": {
      "id": "AllResistancesImplicitShield1",
      "name": "",
      "requiredLevel": 1,
      "stats": [
          {
              "id": "base_resist_all_elements_%",
              "max": 4,
              "min": 4
          }
      ],
      "groups": [
          "AllResistances"
      ]
  },
  "AllResistancesImplicitShield2": {
      "id": "AllResistancesImplicitShield2",
      "name": "",
      "requiredLevel": 1,
      "stats": [
          {
              "id": "base_resist_all_elements_%",
              "max": 8,
              "min": 8
          }
      ],
      "groups": [
          "AllResistances"
      ]
  },
  "AllResistancesImplicitShield3": {
      "id": "AllResistancesImplicitShield3",
      "name": "",
      "requiredLevel": 1,
      "stats": [
          {
              "id": "base_resist_all_elements_%",
              "max": 12,
              "min": 12
          }
      ],
      "groups": [
          "AllResistances"
      ]
  },
  "IncreasedPhysicalDamagePercentImplicitBelt1": {
      "id": "IncreasedPhysicalDamagePercentImplicitBelt1",
      "name": "",
      "requiredLevel": 2,
      "stats": [
          {
              "id": "physical_damage_+%",
              "max": 24,
              "min": 12
          }
      ],
      "groups": [
          "PhysicalDamagePercent"
      ]
  },
  "IncreasedEnergyShieldImplicitBelt1": {
      "id": "IncreasedEnergyShieldImplicitBelt1",
      "name": "",
      "requiredLevel": 2,
      "stats": [
          {
              "id": "base_maximum_energy_shield",
              "max": 20,
              "min": 9
          }
      ],
      "groups": [
          "IncreasedEnergyShield"
      ]
  },
  "IncreasedLifeImplicitBelt1": {
      "id": "IncreasedLifeImplicitBelt1",
      "name": "",
      "requiredLevel": 10,
      "stats": [
          {
              "id": "base_maximum_life",
              "max": 40,
              "min": 25
          }
      ],
      "groups": [
          "IncreasedLife"
      ]
  },
  "StrengthImplicitBelt1": {
      "id": "StrengthImplicitBelt1",
      "name": "",
      "requiredLevel": 10,
      "stats": [
          {
              "id": "additional_strength",
              "max": 35,
              "min": 25
          }
      ],
      "groups": [
          "Strength"
      ]
  },
  "StunRecoveryImplicitBelt1": {
      "id": "StunRecoveryImplicitBelt1",
      "name": "",
      "requiredLevel": 20,
      "stats": [
          {
              "id": "base_stun_recovery_+%",
              "max": 25,
              "min": 15
          }
      ],
      "groups": [
          "StunRecovery"
      ]
  },
  "StunDurationImplicitBelt1": {
      "id": "StunDurationImplicitBelt1",
      "name": "",
      "requiredLevel": 20,
      "stats": [
          {
              "id": "base_stun_duration_+%",
              "max": 30,
              "min": 20
          }
      ],
      "groups": [
          "StunDurationIncreasePercent"
      ]
  },
  "ArmourAndEvasionImplicitBelt1": {
      "id": "ArmourAndEvasionImplicitBelt1",
      "name": "",
      "requiredLevel": 98,
      "stats": [
          {
              "id": "base_physical_damage_reduction_and_evasion_rating",
              "max": 320,
              "min": 260
          }
      ],
      "groups": [
          "BaseArmourAndEvasion"
      ]
  },
  "IncreasedEnergyShieldImplicitBelt2": {
      "id": "IncreasedEnergyShieldImplicitBelt2",
      "name": "",
      "requiredLevel": 99,
      "stats": [
          {
              "id": "base_maximum_energy_shield",
              "max": 80,
              "min": 60
          }
      ],
      "groups": [
          "IncreasedEnergyShield"
      ]
  },
  "CannotUseFlaskInFifthSlotImplicitE1_": {
      "id": "CannotUseFlaskInFifthSlotImplicitE1_",
      "name": "",
      "requiredLevel": 30,
      "stats": [
          {
              "id": "cannot_use_flask_in_fifth_slot",
              "max": 1,
              "min": 1
          },
          {
              "id": "flask_effect_+%",
              "max": 20,
              "min": 20
          }
      ],
      "groups": [
          "CannotUseFlaskInFifthSlot"
      ]
  },
  "SummonTauntingContraptionOnFlaskUseImplicitE1": {
      "id": "SummonTauntingContraptionOnFlaskUseImplicitE1",
      "name": "",
      "requiredLevel": 70,
      "stats": [
          {
              "id": "local_display_trigger_summon_taunting_contraption_on_flask_use",
              "max": 20,
              "min": 20
          }
      ],
      "groups": [
          "SummonTauntingContraptionOnFlaskUse"
      ]
  },
  "AddedFireDamageImplicitQuiver10": {
      "id": "AddedFireDamageImplicitQuiver10",
      "name": "",
      "requiredLevel": 28,
      "stats": [
          {
              "id": "attack_minimum_added_fire_damage_with_bow",
              "max": 4,
              "min": 4
          },
          {
              "id": "attack_maximum_added_fire_damage_with_bow",
              "max": 8,
              "min": 8
          }
      ],
      "groups": [
          "FireDamage"
      ]
  },
  "AddedPhysicalDamageImplicitQuiver11": {
      "id": "AddedPhysicalDamageImplicitQuiver11",
      "name": "",
      "requiredLevel": 35,
      "stats": [
          {
              "id": "attack_minimum_added_physical_damage_with_bow",
              "max": 6,
              "min": 6
          },
          {
              "id": "attack_maximum_added_physical_damage_with_bow",
              "max": 12,
              "min": 12
          }
      ],
      "groups": [
          "PhysicalDamage"
      ]
  },
  "AdditionalArrowPierceImplicitQuiver12_": {
      "id": "AdditionalArrowPierceImplicitQuiver12_",
      "name": "",
      "requiredLevel": 45,
      "stats": [
          {
              "id": "arrow_base_number_of_targets_to_pierce",
              "max": 1,
              "min": 1
          }
      ],
      "groups": [
          "ArrowPierce"
      ]
  },
  "CriticalStrikeChanceImplicitQuiver13": {
      "id": "CriticalStrikeChanceImplicitQuiver13",
      "name": "",
      "requiredLevel": 57,
      "stats": [
          {
              "id": "critical_strike_chance_+%",
              "max": 30,
              "min": 20
          }
      ],
      "groups": [
          "CriticalStrikeChanceIncrease"
      ]
  },
  "AddedPhysicalDamageImplicitQuiver6_": {
      "id": "AddedPhysicalDamageImplicitQuiver6_",
      "name": "",
      "requiredLevel": 7,
      "stats": [
          {
              "id": "attack_minimum_added_physical_damage_with_bow",
              "max": 1,
              "min": 1
          },
          {
              "id": "attack_maximum_added_physical_damage_with_bow",
              "max": 4,
              "min": 4
          }
      ],
      "groups": [
          "PhysicalDamage"
      ]
  },
  "IncreasedAccuracyPercentImplicitQuiver7": {
      "id": "IncreasedAccuracyPercentImplicitQuiver7",
      "name": "",
      "requiredLevel": 5,
      "stats": [
          {
              "id": "accuracy_rating_+%",
              "max": 30,
              "min": 20
          }
      ],
      "groups": [
          "IncreasedAccuracyPercent"
      ]
  },
  "LifeGainPerTargetImplicitQuiver8": {
      "id": "LifeGainPerTargetImplicitQuiver8",
      "name": "",
      "requiredLevel": 13,
      "stats": [
          {
              "id": "base_life_gain_per_target",
              "max": 4,
              "min": 3
          }
      ],
      "groups": [
          "LifeGainPerTarget"
      ]
  },
  "StunDurationImplicitQuiver9": {
      "id": "StunDurationImplicitQuiver9",
      "name": "",
      "requiredLevel": 20,
      "stats": [
          {
              "id": "base_stun_duration_+%",
              "max": 35,
              "min": 25
          }
      ],
      "groups": [
          "StunDurationIncreasePercent"
      ]
  },
  "SummonTotemCastSpeedImplicit1": {
      "id": "SummonTotemCastSpeedImplicit1",
      "name": "",
      "requiredLevel": 93,
      "stats": [
          {
              "id": "summon_totem_cast_speed_+%",
              "max": 30,
              "min": 20
          }
      ],
      "groups": [
          "SummonTotemCastSpeed"
      ]
  },
  "AddedPhysicalDamageImplicitQuiver1New": {
      "id": "AddedPhysicalDamageImplicitQuiver1New",
      "name": "",
      "requiredLevel": 5,
      "stats": [
          {
              "id": "attack_minimum_added_physical_damage",
              "max": 1,
              "min": 1
          },
          {
              "id": "attack_maximum_added_physical_damage",
              "max": 4,
              "min": 4
          }
      ],
      "groups": [
          "PhysicalDamage"
      ]
  },
  "IncreasedAttackSpeedImplicitQuiver10New": {
      "id": "IncreasedAttackSpeedImplicitQuiver10New",
      "name": "",
      "requiredLevel": 62,
      "stats": [
          {
              "id": "attack_speed_+%",
              "max": 10,
              "min": 8
          }
      ],
      "groups": [
          "IncreasedAttackSpeed"
      ]
  },
  "PhysicalDamageAddedAsChaosImplicitQuiver11New": {
      "id": "PhysicalDamageAddedAsChaosImplicitQuiver11New",
      "name": "",
      "requiredLevel": 69,
      "stats": [
          {
              "id": "physical_damage_%_to_add_as_chaos",
              "max": 15,
              "min": 10
          }
      ],
      "groups": [
          "PhysicalDamageAddedAsChaos"
      ]
  },
  "AddedPhysicalDamageImplicitQuiver12New": {
      "id": "AddedPhysicalDamageImplicitQuiver12New",
      "name": "",
      "requiredLevel": 77,
      "stats": [
          {
              "id": "attack_minimum_added_physical_damage",
              "max": 15,
              "min": 12
          },
          {
              "id": "attack_maximum_added_physical_damage",
              "max": 27,
              "min": 24
          }
      ],
      "groups": [
          "PhysicalDamage"
      ]
  },
  "WeaponElementalDamageImplicitQuiver13New": {
      "id": "WeaponElementalDamageImplicitQuiver13New",
      "name": "",
      "requiredLevel": 83,
      "stats": [
          {
              "id": "elemental_damage_with_attack_skills_+%",
              "max": 30,
              "min": 20
          }
      ],
      "groups": [
          "IncreasedWeaponElementalDamagePercent"
      ]
  },
  "AddedFireDamageImplicitQuiver2New": {
      "id": "AddedFireDamageImplicitQuiver2New",
      "name": "",
      "requiredLevel": 12,
      "stats": [
          {
              "id": "attack_minimum_added_fire_damage",
              "max": 3,
              "min": 3
          },
          {
              "id": "attack_maximum_added_fire_damage",
              "max": 5,
              "min": 5
          }
      ],
      "groups": [
          "FireDamage"
      ]
  },
  "LifeGainPerTargetImplicitQuiver3New": {
      "id": "LifeGainPerTargetImplicitQuiver3New",
      "name": "",
      "requiredLevel": 18,
      "stats": [
          {
              "id": "base_life_gain_per_target",
              "max": 8,
              "min": 6
          }
      ],
      "groups": [
          "LifeGainPerTarget"
      ]
  },
  "ProjectileSpeedImplicitQuiver4New": {
      "id": "ProjectileSpeedImplicitQuiver4New",
      "name": "",
      "requiredLevel": 25,
      "stats": [
          {
              "id": "base_projectile_speed_+%",
              "max": 30,
              "min": 20
          }
      ],
      "groups": [
          "ProjectileSpeed"
      ]
  },
  "AdditionalArrowPierceImplicitQuiver5New": {
      "id": "AdditionalArrowPierceImplicitQuiver5New",
      "name": "",
      "requiredLevel": 32,
      "stats": [
          {
              "id": "arrow_base_number_of_targets_to_pierce",
              "max": 1,
              "min": 1
          }
      ],
      "groups": [
          "ArrowPierce"
      ]
  },
  "AddedPhysicalDamageImplicitQuiver6New": {
      "id": "AddedPhysicalDamageImplicitQuiver6New",
      "name": "",
      "requiredLevel": 39,
      "stats": [
          {
              "id": "attack_minimum_added_physical_damage",
              "max": 9,
              "min": 7
          },
          {
              "id": "attack_maximum_added_physical_damage",
              "max": 16,
              "min": 13
          }
      ],
      "groups": [
          "PhysicalDamage"
      ]
  },
  "IncreasedAccuracyPercentImplicitQuiver7New": {
      "id": "IncreasedAccuracyPercentImplicitQuiver7New",
      "name": "",
      "requiredLevel": 45,
      "stats": [
          {
              "id": "accuracy_rating_+%",
              "max": 30,
              "min": 20
          }
      ],
      "groups": [
          "IncreasedAccuracyPercent"
      ]
  },
  "CriticalStrikeChanceImplicitQuiver8New": {
      "id": "CriticalStrikeChanceImplicitQuiver8New",
      "name": "",
      "requiredLevel": 50,
      "stats": [
          {
              "id": "bow_critical_strike_chance_+%",
              "max": 30,
              "min": 20
          }
      ],
      "groups": [
          "CriticalStrikeChanceIncrease"
      ]
  },
  "AddedFireDamageImplicitQuiver9New": {
      "id": "AddedFireDamageImplicitQuiver9New",
      "name": "",
      "requiredLevel": 57,
      "stats": [
          {
              "id": "attack_minimum_added_fire_damage",
              "max": 15,
              "min": 12
          },
          {
              "id": "attack_maximum_added_fire_damage",
              "max": 27,
              "min": 24
          }
      ],
      "groups": [
          "FireDamage"
      ]
  },
  "AddedPhysicalDamageImplicitRing1": {
      "id": "AddedPhysicalDamageImplicitRing1",
      "name": "",
      "requiredLevel": 2,
      "stats": [
          {
              "id": "attack_minimum_added_physical_damage",
              "max": 1,
              "min": 1
          },
          {
              "id": "attack_maximum_added_physical_damage",
              "max": 4,
              "min": 4
          }
      ],
      "groups": [
          "PhysicalDamage"
      ]
  },
  "ChaosResistImplicitRing1": {
      "id": "ChaosResistImplicitRing1",
      "name": "",
      "requiredLevel": 38,
      "stats": [
          {
              "id": "base_chaos_damage_resistance_%",
              "max": 23,
              "min": 17
          }
      ],
      "groups": [
          "ChaosResistance"
      ]
  },
  "CriticalStrikeChanceImplicitRing1": {
      "id": "CriticalStrikeChanceImplicitRing1",
      "name": "",
      "requiredLevel": 25,
      "stats": [
          {
              "id": "critical_strike_chance_+%",
              "max": 30,
              "min": 20
          }
      ],
      "groups": [
          "CriticalStrikeChanceIncrease"
      ]
  },
  "FireAndLightningResistImplicitRing1": {
      "id": "FireAndLightningResistImplicitRing1",
      "name": "",
      "requiredLevel": 25,
      "stats": [
          {
              "id": "fire_and_lightning_damage_resistance_%",
              "max": 16,
              "min": 12
          }
      ],
      "groups": [
          "FireAndLightningResistance"
      ]
  },
  "ColdAndLightningResistImplicitRing1": {
      "id": "ColdAndLightningResistImplicitRing1",
      "name": "",
      "requiredLevel": 25,
      "stats": [
          {
              "id": "cold_and_lightning_damage_resistance_%",
              "max": 16,
              "min": 12
          }
      ],
      "groups": [
          "ColdAndLightningResistance"
      ]
  },
  "FireAndColdResistImplicitRing1": {
      "id": "FireAndColdResistImplicitRing1",
      "name": "",
      "requiredLevel": 25,
      "stats": [
          {
              "id": "fire_and_cold_damage_resistance_%",
              "max": 16,
              "min": 12
          }
      ],
      "groups": [
          "FireAndColdResistance"
      ]
  },
  "RingHasOneSocket": {
      "id": "RingHasOneSocket",
      "name": "",
      "requiredLevel": 7,
      "stats": [
          {
              "id": "local_has_X_sockets",
              "max": 1,
              "min": 1
          }
      ],
      "groups": [
          "Other"
      ]
  },
  "MinionElementalResistanceImplicitRing1": {
      "id": "MinionElementalResistanceImplicitRing1",
      "name": "",
      "requiredLevel": 32,
      "stats": [
          {
              "id": "minion_elemental_resistance_%",
              "max": 15,
              "min": 10
          }
      ],
      "groups": [
          "MinionElementalResistances"
      ]
  },
  "IncreasedLifeImplicitRing1": {
      "id": "IncreasedLifeImplicitRing1",
      "name": "",
      "requiredLevel": 2,
      "stats": [
          {
              "id": "base_maximum_life",
              "max": 30,
              "min": 20
          }
      ],
      "groups": [
          "IncreasedLife"
      ]
  },
  "IncreasedManaImplicitRing1": {
      "id": "IncreasedManaImplicitRing1",
      "name": "",
      "requiredLevel": 2,
      "stats": [
          {
              "id": "base_maximum_mana",
              "max": 30,
              "min": 20
          }
      ],
      "groups": [
          "IncreasedMana"
      ]
  },
  "ItemFoundRarityIncreaseImplicitRing1": {
      "id": "ItemFoundRarityIncreaseImplicitRing1",
      "name": "",
      "requiredLevel": 25,
      "stats": [
          {
              "id": "base_item_found_rarity_+%",
              "max": 15,
              "min": 6
          }
      ],
      "groups": [
          "ItemFoundRarityIncrease"
      ]
  },
  "LightningResistImplicitRing1": {
      "id": "LightningResistImplicitRing1",
      "name": "",
      "requiredLevel": 15,
      "stats": [
          {
              "id": "base_lightning_damage_resistance_%",
              "max": 30,
              "min": 20
          }
      ],
      "groups": [
          "LightningResistance"
      ]
  },
  "ColdResistImplicitRing1": {
      "id": "ColdResistImplicitRing1",
      "name": "",
      "requiredLevel": 10,
      "stats": [
          {
              "id": "base_cold_damage_resistance_%",
              "max": 30,
              "min": 20
          }
      ],
      "groups": [
          "ColdResistance"
      ]
  },
  "FireResistImplicitRing1": {
      "id": "FireResistImplicitRing1",
      "name": "",
      "requiredLevel": 20,
      "stats": [
          {
              "id": "base_fire_damage_resistance_%",
              "max": 30,
              "min": 20
          }
      ],
      "groups": [
          "FireResistance"
      ]
  },
  "AllResistancesImplicitRing1": {
      "id": "AllResistancesImplicitRing1",
      "name": "",
      "requiredLevel": 38,
      "stats": [
          {
              "id": "base_resist_all_elements_%",
              "max": 10,
              "min": 8
          }
      ],
      "groups": [
          "AllResistances"
      ]
  },
  "IncreasedEnergyShieldImplicitRing1": {
      "id": "IncreasedEnergyShieldImplicitRing1",
      "name": "",
      "requiredLevel": 25,
      "stats": [
          {
              "id": "base_maximum_energy_shield",
              "max": 25,
              "min": 15
          }
      ],
      "groups": [
          "IncreasedEnergyShield"
      ]
  },
  "AddedPhysicalDamageImplicitRing2": {
      "id": "AddedPhysicalDamageImplicitRing2",
      "name": "",
      "requiredLevel": 100,
      "stats": [
          {
              "id": "attack_minimum_added_physical_damage",
              "max": 4,
              "min": 3
          },
          {
              "id": "attack_maximum_added_physical_damage",
              "max": 14,
              "min": 10
          }
      ],
      "groups": [
          "PhysicalDamage"
      ]
  },
  "ElementalDamagePercentImplicitAtlasRing_": {
      "id": "ElementalDamagePercentImplicitAtlasRing_",
      "name": "",
      "requiredLevel": 100,
      "stats": [
          {
              "id": "elemental_damage_+%",
              "max": 25,
              "min": 15
          }
      ],
      "groups": [
          "ElementalDamagePercent"
      ]
  },
  "MaximumLifeImplicitAtlasRing": {
      "id": "MaximumLifeImplicitAtlasRing",
      "name": "",
      "requiredLevel": 100,
      "stats": [
          {
              "id": "maximum_life_+%",
              "max": 7,
              "min": 5
          }
      ],
      "groups": [
          "MaximumLifeIncreasePercent"
      ]
  },
  "MaximumManaImplicitAtlasRing_": {
      "id": "MaximumManaImplicitAtlasRing_",
      "name": "",
      "requiredLevel": 100,
      "stats": [
          {
              "id": "maximum_mana_+%",
              "max": 10,
              "min": 8
          }
      ],
      "groups": [
          "MaximumManaIncreasePercent"
      ]
  },
  "IncreasedChaosDamageImplicit1_": {
      "id": "IncreasedChaosDamageImplicit1_",
      "name": "",
      "requiredLevel": 100,
      "stats": [
          {
              "id": "chaos_damage_+%",
              "max": 23,
              "min": 17
          }
      ],
      "groups": [
          "IncreasedChaosDamage"
      ]
  },
  "LifeGainPerTargetImplicit2Claw1": {
      "id": "LifeGainPerTargetImplicit2Claw1",
      "name": "",
      "requiredLevel": 1,
      "stats": [
          {
              "id": "local_life_gain_per_target",
              "max": 3,
              "min": 3
          }
      ],
      "groups": [
          "LifeGainPerTarget"
      ]
  },
  "LifeGainPerTargetImplicit2Claw7": {
      "id": "LifeGainPerTargetImplicit2Claw7",
      "name": "",
      "requiredLevel": 1,
      "stats": [
          {
              "id": "local_life_gain_per_target",
              "max": 24,
              "min": 24
          }
      ],
      "groups": [
          "LifeGainPerTarget"
      ]
  },
  "LifeLeechPermyriadImplicitClaw1": {
      "id": "LifeLeechPermyriadImplicitClaw1",
      "name": "",
      "requiredLevel": 1,
      "stats": [
          {
              "id": "local_life_leech_from_physical_damage_permyriad",
              "max": 160,
              "min": 160
          }
      ],
      "groups": [
          "LifeLeech"
      ]
  },
  "LifeGainPerTargetImplicit2Claw8": {
      "id": "LifeGainPerTargetImplicit2Claw8",
      "name": "",
      "requiredLevel": 1,
      "stats": [
          {
              "id": "local_life_gain_per_target",
              "max": 44,
              "min": 44
          }
      ],
      "groups": [
          "LifeGainPerTarget"
      ]
  },
  "LifeLeechPermyriadImplicitClaw2": {
      "id": "LifeLeechPermyriadImplicitClaw2",
      "name": "",
      "requiredLevel": 1,
      "stats": [
          {
              "id": "local_life_leech_from_physical_damage_permyriad",
              "max": 200,
              "min": 200
          }
      ],
      "groups": [
          "LifeLeech"
      ]
  },
  "LifeGainPerTargetImplicit2Claw9_": {
      "id": "LifeGainPerTargetImplicit2Claw9_",
      "name": "",
      "requiredLevel": 1,
      "stats": [
          {
              "id": "local_life_gain_per_target",
              "max": 40,
              "min": 40
          }
      ],
      "groups": [
          "LifeGainPerTarget"
      ]
  },
  "LifeGainPerTargetImplicit2Claw10": {
      "id": "LifeGainPerTargetImplicit2Claw10",
      "name": "",
      "requiredLevel": 1,
      "stats": [
          {
              "id": "local_life_gain_per_target",
              "max": 46,
              "min": 46
          }
      ],
      "groups": [
          "LifeGainPerTarget"
      ]
  },
  "LifeGainPerTargetImplicit2Claw11_": {
      "id": "LifeGainPerTargetImplicit2Claw11_",
      "name": "",
      "requiredLevel": 1,
      "stats": [
          {
              "id": "local_life_gain_per_target",
              "max": 40,
              "min": 40
          }
      ],
      "groups": [
          "LifeGainPerTarget"
      ]
  },
  "LifeGainPerTargetImplicit2Claw12": {
      "id": "LifeGainPerTargetImplicit2Claw12",
      "name": "",
      "requiredLevel": 1,
      "stats": [
          {
              "id": "local_life_gain_per_target",
              "max": 50,
              "min": 50
          }
      ],
      "groups": [
          "LifeGainPerTarget"
      ]
  },
  "LifeGainPerTargetImplicit2Claw2": {
      "id": "LifeGainPerTargetImplicit2Claw2",
      "name": "",
      "requiredLevel": 1,
      "stats": [
          {
              "id": "local_life_gain_per_target",
              "max": 6,
              "min": 6
          }
      ],
      "groups": [
          "LifeGainPerTarget"
      ]
  },
  "LifeGainPerTargetImplicit2Claw13": {
      "id": "LifeGainPerTargetImplicit2Claw13",
      "name": "",
      "requiredLevel": 1,
      "stats": [
          {
              "id": "local_life_gain_per_target",
              "max": 46,
              "min": 46
          }
      ],
      "groups": [
          "LifeGainPerTarget"
      ]
  },
  "LifeGainPerTargetImplicit2Claw3": {
      "id": "LifeGainPerTargetImplicit2Claw3",
      "name": "",
      "requiredLevel": 1,
      "stats": [
          {
              "id": "local_life_gain_per_target",
              "max": 7,
              "min": 7
          }
      ],
      "groups": [
          "LifeGainPerTarget"
      ]
  },
  "LifeGainPerTargetImplicit2Claw3_1": {
      "id": "LifeGainPerTargetImplicit2Claw3_1",
      "name": "",
      "requiredLevel": 1,
      "stats": [
          {
              "id": "local_life_gain_per_target",
              "max": 8,
              "min": 8
          }
      ],
      "groups": [
          "LifeGainPerTarget"
      ]
  },
  "LifeGainPerTargetImplicit2Claw4": {
      "id": "LifeGainPerTargetImplicit2Claw4",
      "name": "",
      "requiredLevel": 1,
      "stats": [
          {
              "id": "local_life_gain_per_target",
              "max": 12,
              "min": 12
          }
      ],
      "groups": [
          "LifeGainPerTarget"
      ]
  },
  "LifeGainPerTargetImplicit2Claw4_1": {
      "id": "LifeGainPerTargetImplicit2Claw4_1",
      "name": "",
      "requiredLevel": 1,
      "stats": [
          {
              "id": "local_life_gain_per_target",
              "max": 19,
              "min": 19
          }
      ],
      "groups": [
          "LifeGainPerTarget"
      ]
  },
  "LifeGainPerTargetImplicit2Claw5": {
      "id": "LifeGainPerTargetImplicit2Claw5",
      "name": "",
      "requiredLevel": 1,
      "stats": [
          {
              "id": "local_life_gain_per_target",
              "max": 15,
              "min": 15
          }
      ],
      "groups": [
          "LifeGainPerTarget"
      ]
  },
  "LifeGainPerTargetImplicit2Claw5_1": {
      "id": "LifeGainPerTargetImplicit2Claw5_1",
      "name": "",
      "requiredLevel": 1,
      "stats": [
          {
              "id": "local_life_gain_per_target",
              "max": 20,
              "min": 20
          }
      ],
      "groups": [
          "LifeGainPerTarget"
      ]
  },
  "LifeGainPerTargetImplicit2Claw6": {
      "id": "LifeGainPerTargetImplicit2Claw6",
      "name": "",
      "requiredLevel": 1,
      "stats": [
          {
              "id": "local_life_gain_per_target",
              "max": 25,
              "min": 25
          }
      ],
      "groups": [
          "LifeGainPerTarget"
      ]
  },
  "CriticalStrikeChanceImplicitDaggerNew1": {
      "id": "CriticalStrikeChanceImplicitDaggerNew1",
      "name": "",
      "requiredLevel": 1,
      "stats": [
          {
              "id": "critical_strike_chance_+%",
              "max": 30,
              "min": 30
          }
      ],
      "groups": [
          "CriticalStrikeChanceIncrease"
      ]
  },
  "CriticalStrikeChanceImplicitDaggerNew3": {
      "id": "CriticalStrikeChanceImplicitDaggerNew3",
      "name": "",
      "requiredLevel": 1,
      "stats": [
          {
              "id": "critical_strike_chance_+%",
              "max": 50,
              "min": 50
          }
      ],
      "groups": [
          "CriticalStrikeChanceIncrease"
      ]
  },
  "CriticalStrikeChanceImplicitDaggerNew2": {
      "id": "CriticalStrikeChanceImplicitDaggerNew2",
      "name": "",
      "requiredLevel": 1,
      "stats": [
          {
              "id": "critical_strike_chance_+%",
              "max": 40,
              "min": 40
          }
      ],
      "groups": [
          "CriticalStrikeChanceIncrease"
      ]
  },
  "StunThresholdReductionImplicitMace1": {
      "id": "StunThresholdReductionImplicitMace1",
      "name": "",
      "requiredLevel": 1,
      "stats": [
          {
              "id": "base_stun_threshold_reduction_+%",
              "max": 10,
              "min": 10
          }
      ],
      "groups": [
          "StunThresholdReduction"
      ]
  },
  "StunThresholdReductionImplicitMace2": {
      "id": "StunThresholdReductionImplicitMace2",
      "name": "",
      "requiredLevel": 1,
      "stats": [
          {
              "id": "base_stun_threshold_reduction_+%",
              "max": 15,
              "min": 15
          }
      ],
      "groups": [
          "StunThresholdReduction"
      ]
  },
  "ElementalDamagePercentImplicitSceptreNew1": {
      "id": "ElementalDamagePercentImplicitSceptreNew1",
      "name": "",
      "requiredLevel": 1,
      "stats": [
          {
              "id": "elemental_damage_+%",
              "max": 10,
              "min": 10
          }
      ],
      "groups": [
          "ElementalDamagePercent"
      ]
  },
  "ElementalDamagePercentImplicitSceptreNew10": {
      "id": "ElementalDamagePercentImplicitSceptreNew10",
      "name": "",
      "requiredLevel": 1,
      "stats": [
          {
              "id": "elemental_damage_+%",
              "max": 18,
              "min": 18
          }
      ],
      "groups": [
          "ElementalDamagePercent"
      ]
  },
  "ElementalDamagePercentImplicitSceptreNew11": {
      "id": "ElementalDamagePercentImplicitSceptreNew11",
      "name": "",
      "requiredLevel": 1,
      "stats": [
          {
              "id": "elemental_damage_+%",
              "max": 30,
              "min": 30
          }
      ],
      "groups": [
          "ElementalDamagePercent"
      ]
  },
  "ElementalDamagePercentImplicitSceptreNew12___": {
      "id": "ElementalDamagePercentImplicitSceptreNew12___",
      "name": "",
      "requiredLevel": 1,
      "stats": [
          {
              "id": "elemental_damage_+%",
              "max": 22,
              "min": 22
          }
      ],
      "groups": [
          "ElementalDamagePercent"
      ]
  },
  "ElementalDamagePercentImplicitSceptreNew13": {
      "id": "ElementalDamagePercentImplicitSceptreNew13",
      "name": "",
      "requiredLevel": 1,
      "stats": [
          {
              "id": "elemental_damage_+%",
              "max": 24,
              "min": 24
          }
      ],
      "groups": [
          "ElementalDamagePercent"
      ]
  },
  "ElementalDamagePercentImplicitSceptreNew14": {
      "id": "ElementalDamagePercentImplicitSceptreNew14",
      "name": "",
      "requiredLevel": 1,
      "stats": [
          {
              "id": "elemental_damage_+%",
              "max": 24,
              "min": 24
          }
      ],
      "groups": [
          "ElementalDamagePercent"
      ]
  },
  "ElementalDamagePercentImplicitSceptreNew15": {
      "id": "ElementalDamagePercentImplicitSceptreNew15",
      "name": "",
      "requiredLevel": 1,
      "stats": [
          {
              "id": "elemental_damage_+%",
              "max": 30,
              "min": 30
          }
      ],
      "groups": [
          "ElementalDamagePercent"
      ]
  },
  "ElementalDamagePercentImplicitSceptreNew16": {
      "id": "ElementalDamagePercentImplicitSceptreNew16",
      "name": "",
      "requiredLevel": 1,
      "stats": [
          {
              "id": "elemental_damage_+%",
              "max": 26,
              "min": 26
          }
      ],
      "groups": [
          "ElementalDamagePercent"
      ]
  },
  "ElementalDamagePercentImplicitSceptreNew17": {
      "id": "ElementalDamagePercentImplicitSceptreNew17",
      "name": "",
      "requiredLevel": 1,
      "stats": [
          {
              "id": "elemental_damage_+%",
              "max": 26,
              "min": 26
          }
      ],
      "groups": [
          "ElementalDamagePercent"
      ]
  },
  "ElementalDamagePercentImplicitSceptreNew18": {
      "id": "ElementalDamagePercentImplicitSceptreNew18",
      "name": "",
      "requiredLevel": 1,
      "stats": [
          {
              "id": "elemental_damage_+%",
              "max": 40,
              "min": 40
          }
      ],
      "groups": [
          "ElementalDamagePercent"
      ]
  },
  "ElementalDamagePercentImplicitSceptreNew19": {
      "id": "ElementalDamagePercentImplicitSceptreNew19",
      "name": "",
      "requiredLevel": 1,
      "stats": [
          {
              "id": "elemental_damage_+%",
              "max": 30,
              "min": 30
          }
      ],
      "groups": [
          "ElementalDamagePercent"
      ]
  },
  "ElementalDamagePercentImplicitSceptreNew2": {
      "id": "ElementalDamagePercentImplicitSceptreNew2",
      "name": "",
      "requiredLevel": 1,
      "stats": [
          {
              "id": "elemental_damage_+%",
              "max": 12,
              "min": 12
          }
      ],
      "groups": [
          "ElementalDamagePercent"
      ]
  },
  "ElementalDamagePercentImplicitSceptreNew20": {
      "id": "ElementalDamagePercentImplicitSceptreNew20",
      "name": "",
      "requiredLevel": 1,
      "stats": [
          {
              "id": "elemental_damage_+%",
              "max": 32,
              "min": 32
          }
      ],
      "groups": [
          "ElementalDamagePercent"
      ]
  },
  "ElementalDamagePercentImplicitSceptreNew21__": {
      "id": "ElementalDamagePercentImplicitSceptreNew21__",
      "name": "",
      "requiredLevel": 1,
      "stats": [
          {
              "id": "elemental_damage_+%",
              "max": 32,
              "min": 32
          }
      ],
      "groups": [
          "ElementalDamagePercent"
      ]
  },
  "ElementalDamagePercentImplicitSceptreNew22": {
      "id": "ElementalDamagePercentImplicitSceptreNew22",
      "name": "",
      "requiredLevel": 1,
      "stats": [
          {
              "id": "elemental_damage_+%",
              "max": 40,
              "min": 40
          }
      ],
      "groups": [
          "ElementalDamagePercent"
      ]
  },
  "ElementalDamagePercentImplicitSceptreNew3": {
      "id": "ElementalDamagePercentImplicitSceptreNew3",
      "name": "",
      "requiredLevel": 1,
      "stats": [
          {
              "id": "elemental_damage_+%",
              "max": 12,
              "min": 12
          }
      ],
      "groups": [
          "ElementalDamagePercent"
      ]
  },
  "ElementalDamagePercentImplicitSceptreNew4": {
      "id": "ElementalDamagePercentImplicitSceptreNew4",
      "name": "",
      "requiredLevel": 1,
      "stats": [
          {
              "id": "elemental_damage_+%",
              "max": 20,
              "min": 20
          }
      ],
      "groups": [
          "ElementalDamagePercent"
      ]
  },
  "ElementalDamagePercentImplicitSceptreNew5": {
      "id": "ElementalDamagePercentImplicitSceptreNew5",
      "name": "",
      "requiredLevel": 1,
      "stats": [
          {
              "id": "elemental_damage_+%",
              "max": 14,
              "min": 14
          }
      ],
      "groups": [
          "ElementalDamagePercent"
      ]
  },
  "ElementalDamagePercentImplicitSceptreNew6": {
      "id": "ElementalDamagePercentImplicitSceptreNew6",
      "name": "",
      "requiredLevel": 1,
      "stats": [
          {
              "id": "elemental_damage_+%",
              "max": 16,
              "min": 16
          }
      ],
      "groups": [
          "ElementalDamagePercent"
      ]
  },
  "ElementalDamagePercentImplicitSceptreNew7": {
      "id": "ElementalDamagePercentImplicitSceptreNew7",
      "name": "",
      "requiredLevel": 1,
      "stats": [
          {
              "id": "elemental_damage_+%",
              "max": 16,
              "min": 16
          }
      ],
      "groups": [
          "ElementalDamagePercent"
      ]
  },
  "ElementalDamagePercentImplicitSceptreNew8": {
      "id": "ElementalDamagePercentImplicitSceptreNew8",
      "name": "",
      "requiredLevel": 1,
      "stats": [
          {
              "id": "elemental_damage_+%",
              "max": 22,
              "min": 22
          }
      ],
      "groups": [
          "ElementalDamagePercent"
      ]
  },
  "ElementalDamagePercentImplicitSceptreNew9": {
      "id": "ElementalDamagePercentImplicitSceptreNew9",
      "name": "",
      "requiredLevel": 1,
      "stats": [
          {
              "id": "elemental_damage_+%",
              "max": 18,
              "min": 18
          }
      ],
      "groups": [
          "ElementalDamagePercent"
      ]
  },
  "AccuracyPercentImplicitSword1": {
      "id": "AccuracyPercentImplicitSword1",
      "name": "",
      "requiredLevel": 1,
      "stats": [
          {
              "id": "accuracy_rating_+%",
              "max": 40,
              "min": 40
          }
      ],
      "groups": [
          "IncreasedAccuracy"
      ]
  },
  "IncreasedAccuracySwordImplicit5": {
      "id": "IncreasedAccuracySwordImplicit5",
      "name": "",
      "requiredLevel": 1,
      "stats": [
          {
              "id": "local_accuracy_rating",
              "max": 330,
              "min": 330
          }
      ],
      "groups": [
          "IncreasedAccuracy"
      ]
  },
  "IncreasedAccuracySwordImplicit6": {
      "id": "IncreasedAccuracySwordImplicit6",
      "name": "",
      "requiredLevel": 1,
      "stats": [
          {
              "id": "local_accuracy_rating",
              "max": 350,
              "min": 350
          }
      ],
      "groups": [
          "IncreasedAccuracy"
      ]
  },
  "IncreasedAccuracySwordImplicit7": {
      "id": "IncreasedAccuracySwordImplicit7",
      "name": "",
      "requiredLevel": 1,
      "stats": [
          {
              "id": "local_accuracy_rating",
              "max": 400,
              "min": 400
          }
      ],
      "groups": [
          "IncreasedAccuracy"
      ]
  },
  "IncreasedAccuracySwordImplicit1": {
      "id": "IncreasedAccuracySwordImplicit1",
      "name": "",
      "requiredLevel": 1,
      "stats": [
          {
              "id": "local_accuracy_rating",
              "max": 45,
              "min": 45
          }
      ],
      "groups": [
          "IncreasedAccuracy"
      ]
  },
  "IncreasedAccuracySwordImplicit8": {
      "id": "IncreasedAccuracySwordImplicit8",
      "name": "",
      "requiredLevel": 1,
      "stats": [
          {
              "id": "local_accuracy_rating",
              "max": 460,
              "min": 460
          }
      ],
      "groups": [
          "IncreasedAccuracy"
      ]
  },
  "IncreasedAccuracySwordImplicit9": {
      "id": "IncreasedAccuracySwordImplicit9",
      "name": "",
      "requiredLevel": 1,
      "stats": [
          {
              "id": "local_accuracy_rating",
              "max": 475,
              "min": 475
          }
      ],
      "groups": [
          "IncreasedAccuracy"
      ]
  },
  "IncreasedAccuracySwordImplicit2": {
      "id": "IncreasedAccuracySwordImplicit2",
      "name": "",
      "requiredLevel": 1,
      "stats": [
          {
              "id": "local_accuracy_rating",
              "max": 165,
              "min": 165
          }
      ],
      "groups": [
          "IncreasedAccuracy"
      ]
  },
  "IncreasedAccuracySwordImplicit3": {
      "id": "IncreasedAccuracySwordImplicit3",
      "name": "",
      "requiredLevel": 1,
      "stats": [
          {
              "id": "local_accuracy_rating",
              "max": 190,
              "min": 190
          }
      ],
      "groups": [
          "IncreasedAccuracy"
      ]
  },
  "IncreasedAccuracySwordImplicit4": {
      "id": "IncreasedAccuracySwordImplicit4",
      "name": "",
      "requiredLevel": 1,
      "stats": [
          {
              "id": "local_accuracy_rating",
              "max": 240,
              "min": 240
          }
      ],
      "groups": [
          "IncreasedAccuracy"
      ]
  },
  "CriticalMultiplierImplicitSword1": {
      "id": "CriticalMultiplierImplicitSword1",
      "name": "",
      "requiredLevel": 1,
      "stats": [
          {
              "id": "base_critical_strike_multiplier_+",
              "max": 25,
              "min": 25
          }
      ],
      "groups": [
          "CriticalStrikeMultiplier"
      ]
  },
  "CriticalMultiplierImplicitSword2": {
      "id": "CriticalMultiplierImplicitSword2",
      "name": "",
      "requiredLevel": 1,
      "stats": [
          {
              "id": "base_critical_strike_multiplier_+",
              "max": 35,
              "min": 35
          }
      ],
      "groups": [
          "CriticalStrikeMultiplier"
      ]
  },
  "SpellDamageOnWeaponImplicitWand1": {
      "id": "SpellDamageOnWeaponImplicitWand1",
      "name": "",
      "requiredLevel": 1,
      "stats": [
          {
              "id": "spell_damage_+%",
              "max": 12,
              "min": 8
          }
      ],
      "groups": [
          "SpellDamage"
      ]
  },
  "SpellDamageOnWeaponImplicitWand11": {
      "id": "SpellDamageOnWeaponImplicitWand11",
      "name": "",
      "requiredLevel": 1,
      "stats": [
          {
              "id": "spell_damage_+%",
              "max": 30,
              "min": 26
          }
      ],
      "groups": [
          "SpellDamage"
      ]
  },
  "SpellDamageOnWeaponImplicitWand12": {
      "id": "SpellDamageOnWeaponImplicitWand12",
      "name": "",
      "requiredLevel": 1,
      "stats": [
          {
              "id": "spell_damage_+%",
              "max": 31,
              "min": 27
          }
      ],
      "groups": [
          "SpellDamage"
      ]
  },
  "SpellDamageOnWeaponImplicitWand14": {
      "id": "SpellDamageOnWeaponImplicitWand14",
      "name": "",
      "requiredLevel": 1,
      "stats": [
          {
              "id": "spell_damage_+%",
              "max": 35,
              "min": 31
          }
      ],
      "groups": [
          "SpellDamage"
      ]
  },
  "SpellDamageOnWeaponImplicitWand15": {
      "id": "SpellDamageOnWeaponImplicitWand15",
      "name": "",
      "requiredLevel": 1,
      "stats": [
          {
              "id": "spell_damage_+%",
              "max": 37,
              "min": 33
          }
      ],
      "groups": [
          "SpellDamage"
      ]
  },
  "SpellDamageOnWeaponImplicitWand18": {
      "id": "SpellDamageOnWeaponImplicitWand18",
      "name": "",
      "requiredLevel": 1,
      "stats": [
          {
              "id": "spell_damage_+%",
              "max": 42,
              "min": 38
          }
      ],
      "groups": [
          "SpellDamage"
      ]
  },
  "SpellDamageOnWeaponImplicitWand16": {
      "id": "SpellDamageOnWeaponImplicitWand16",
      "name": "",
      "requiredLevel": 1,
      "stats": [
          {
              "id": "spell_damage_+%",
              "max": 39,
              "min": 35
          }
      ],
      "groups": [
          "SpellDamage"
      ]
  },
  "SpellDamageOnWeaponImplicitWand17": {
      "id": "SpellDamageOnWeaponImplicitWand17",
      "name": "",
      "requiredLevel": 1,
      "stats": [
          {
              "id": "spell_damage_+%",
              "max": 40,
              "min": 36
          }
      ],
      "groups": [
          "SpellDamage"
      ]
  },
  "SpellDamageOnWeaponImplicitWand2": {
      "id": "SpellDamageOnWeaponImplicitWand2",
      "name": "",
      "requiredLevel": 1,
      "stats": [
          {
              "id": "spell_damage_+%",
              "max": 14,
              "min": 10
          }
      ],
      "groups": [
          "SpellDamage"
      ]
  },
  "SpellDamageOnWeaponImplicitWand3": {
      "id": "SpellDamageOnWeaponImplicitWand3",
      "name": "",
      "requiredLevel": 1,
      "stats": [
          {
              "id": "spell_damage_+%",
              "max": 15,
              "min": 11
          }
      ],
      "groups": [
          "SpellDamage"
      ]
  },
  "SpellDamageOnWeaponImplicitWand7": {
      "id": "SpellDamageOnWeaponImplicitWand7",
      "name": "",
      "requiredLevel": 1,
      "stats": [
          {
              "id": "spell_damage_+%",
              "max": 22,
              "min": 18
          }
      ],
      "groups": [
          "SpellDamage"
      ]
  },
  "SpellDamageOnWeaponImplicitWand5": {
      "id": "SpellDamageOnWeaponImplicitWand5",
      "name": "",
      "requiredLevel": 1,
      "stats": [
          {
              "id": "spell_damage_+%",
              "max": 19,
              "min": 15
          }
      ],
      "groups": [
          "SpellDamage"
      ]
  },
  "SpellDamageOnWeaponImplicitWand6": {
      "id": "SpellDamageOnWeaponImplicitWand6",
      "name": "",
      "requiredLevel": 1,
      "stats": [
          {
              "id": "spell_damage_+%",
              "max": 21,
              "min": 17
          }
      ],
      "groups": [
          "SpellDamage"
      ]
  },
  "SpellDamageOnWeaponImplicitWand8": {
      "id": "SpellDamageOnWeaponImplicitWand8",
      "name": "",
      "requiredLevel": 1,
      "stats": [
          {
              "id": "spell_damage_+%",
              "max": 24,
              "min": 20
          }
      ],
      "groups": [
          "SpellDamage"
      ]
  },
  "SpellDamageOnWeaponImplicitWand9": {
      "id": "SpellDamageOnWeaponImplicitWand9",
      "name": "",
      "requiredLevel": 1,
      "stats": [
          {
              "id": "spell_damage_+%",
              "max": 26,
              "min": 22
          }
      ],
      "groups": [
          "SpellDamage"
      ]
  },
  "SpellDamageOnWeaponImplicitWand13": {
      "id": "SpellDamageOnWeaponImplicitWand13",
      "name": "",
      "requiredLevel": 1,
      "stats": [
          {
              "id": "spell_damage_+%",
              "max": 33,
              "min": 29
          }
      ],
      "groups": [
          "SpellDamage"
      ]
  },
  "MinionDamageImplicitWand1": {
      "id": "MinionDamageImplicitWand1",
      "name": "",
      "requiredLevel": 1,
      "stats": [
          {
              "id": "minion_damage_+%",
              "max": 30,
              "min": 26
          }
      ],
      "groups": [
          "MinionDamage"
      ]
  },
  "MinionDamageImplicitWand3": {
      "id": "MinionDamageImplicitWand3",
      "name": "",
      "requiredLevel": 1,
      "stats": [
          {
              "id": "minion_damage_+%",
              "max": 16,
              "min": 12
          }
      ],
      "groups": [
          "MinionDamage"
      ]
  },
  "MinionDamageImplicitWand2": {
      "id": "MinionDamageImplicitWand2",
      "name": "",
      "requiredLevel": 1,
      "stats": [
          {
              "id": "minion_damage_+%",
              "max": 24,
              "min": 20
          }
      ],
      "groups": [
          "MinionDamage"
      ]
  },
  "CriticalMultiplierImplicitBow1": {
      "id": "CriticalMultiplierImplicitBow1",
      "name": "",
      "requiredLevel": 1,
      "stats": [
          {
              "id": "base_critical_strike_multiplier_+",
              "max": 25,
              "min": 15
          }
      ],
      "groups": [
          "CriticalStrikeMultiplier"
      ]
  },
  "WeaponElementalDamageImplicitBow1": {
      "id": "WeaponElementalDamageImplicitBow1",
      "name": "",
      "requiredLevel": 1,
      "stats": [
          {
              "id": "elemental_damage_with_attack_skills_+%",
              "max": 24,
              "min": 20
          }
      ],
      "groups": [
          "IncreasedWeaponElementalDamagePercent"
      ]
  },
  "LocalCriticalStrikeChanceImplicitBow1": {
      "id": "LocalCriticalStrikeChanceImplicitBow1",
      "name": "",
      "requiredLevel": 1,
      "stats": [
          {
              "id": "local_critical_strike_chance_+%",
              "max": 50,
              "min": 30
          }
      ],
      "groups": [
          "CriticalStrikeChanceIncrease"
      ]
  },
  "StaffBlockPercentImplicitStaff1": {
      "id": "StaffBlockPercentImplicitStaff1",
      "name": "",
      "requiredLevel": 1,
      "stats": [
          {
              "id": "staff_block_%",
              "max": 18,
              "min": 18
          }
      ],
      "groups": [
          "StaffBlockPercent"
      ]
  },
  "StaffBlockPercentImplicitStaff2": {
      "id": "StaffBlockPercentImplicitStaff2",
      "name": "",
      "requiredLevel": 1,
      "stats": [
          {
              "id": "staff_block_%",
              "max": 20,
              "min": 20
          }
      ],
      "groups": [
          "StaffBlockPercent"
      ]
  },
  "StaffBlockPercentImplicitStaff3": {
      "id": "StaffBlockPercentImplicitStaff3",
      "name": "",
      "requiredLevel": 1,
      "stats": [
          {
              "id": "staff_block_%",
              "max": 25,
              "min": 25
          }
      ],
      "groups": [
          "StaffBlockPercent"
      ]
  },
  "StaffSpellBlockPercentImplicitStaff__1": {
      "id": "StaffSpellBlockPercentImplicitStaff__1",
      "name": "",
      "requiredLevel": 1,
      "stats": [
          {
              "id": "spell_block_with_staff_%",
              "max": 20,
              "min": 20
          }
      ],
      "groups": [
          "StaffSpellBlockPercent"
      ]
  },
  "BleedDotMultiplier2HImplicit1": {
      "id": "BleedDotMultiplier2HImplicit1",
      "name": "",
      "requiredLevel": 1,
      "stats": [
          {
              "id": "bleeding_dot_multiplier_+",
              "max": 20,
              "min": 20
          }
      ],
      "groups": [
          "BleedingDamage"
      ]
  },
  "LocalMaimOnHit2HImplicit_1": {
      "id": "LocalMaimOnHit2HImplicit_1",
      "name": "",
      "requiredLevel": 1,
      "stats": [
          {
              "id": "local_maim_on_hit_%",
              "max": 25,
              "min": 25
          }
      ],
      "groups": [
          "LocalMaimOnHit"
      ]
  },
  "StunDurationImplicitMace1": {
      "id": "StunDurationImplicitMace1",
      "name": "",
      "requiredLevel": 1,
      "stats": [
          {
              "id": "base_stun_duration_+%",
              "max": 30,
              "min": 30
          }
      ],
      "groups": [
          "StunDurationIncreasePercent"
      ]
  },
  "StunDurationImplicitMace2": {
      "id": "StunDurationImplicitMace2",
      "name": "",
      "requiredLevel": 1,
      "stats": [
          {
              "id": "base_stun_duration_+%",
              "max": 45,
              "min": 45
          }
      ],
      "groups": [
          "StunDurationIncreasePercent"
      ]
  },
  "AreaDamageImplicitMace1": {
      "id": "AreaDamageImplicitMace1",
      "name": "",
      "requiredLevel": 1,
      "stats": [
          {
              "id": "area_damage_+%",
              "max": 30,
              "min": 30
          }
      ],
      "groups": [
          "AreaDamage"
      ]
  },
  "StunThresholdReductionImplicitMace3_": {
      "id": "StunThresholdReductionImplicitMace3_",
      "name": "",
      "requiredLevel": 1,
      "stats": [
          {
              "id": "base_stun_threshold_reduction_+%",
              "max": 20,
              "min": 20
          }
      ],
      "groups": [
          "StunThresholdReduction"
      ]
  },
  "DoubleDamageChanceImplicitMace1": {
      "id": "DoubleDamageChanceImplicitMace1",
      "name": "",
      "requiredLevel": 1,
      "stats": [
          {
              "id": "chance_to_deal_double_damage_%",
              "max": 5,
              "min": 5
          }
      ],
      "groups": [
          "DoubleDamage"
      ]
  },
  "PercentageStrengthImplicitMace1": {
      "id": "PercentageStrengthImplicitMace1",
      "name": "",
      "requiredLevel": 1,
      "stats": [
          {
              "id": "strength_+%",
              "max": 10,
              "min": 10
          }
      ],
      "groups": [
          "PercentageStrength"
      ]
  },
  "ChanceForDoubleStunDurationImplicitMace_1": {
      "id": "ChanceForDoubleStunDurationImplicitMace_1",
      "name": "",
      "requiredLevel": 1,
      "stats": [
          {
              "id": "chance_to_double_stun_duration_%",
              "max": 25,
              "min": 25
          }
      ],
      "groups": [
          "ChanceForDoubleStunDuration"
      ]
  },
  "IncreasedAccuracy2hSwordImplicit5": {
      "id": "IncreasedAccuracy2hSwordImplicit5",
      "name": "",
      "requiredLevel": 1,
      "stats": [
          {
              "id": "local_accuracy_rating",
              "max": 305,
              "min": 305
          }
      ],
      "groups": [
          "IncreasedAccuracy"
      ]
  },
  "AccuracyPercentImplicit2HSword1": {
      "id": "AccuracyPercentImplicit2HSword1",
      "name": "",
      "requiredLevel": 1,
      "stats": [
          {
              "id": "accuracy_rating_+%",
              "max": 60,
              "min": 60
          }
      ],
      "groups": [
          "IncreasedAccuracy"
      ]
  },
  "IncreasedAccuracy2hSwordImplicit6": {
      "id": "IncreasedAccuracy2hSwordImplicit6",
      "name": "",
      "requiredLevel": 1,
      "stats": [
          {
              "id": "local_accuracy_rating",
              "max": 360,
              "min": 360
          }
      ],
      "groups": [
          "IncreasedAccuracy"
      ]
  },
  "AccuracyPercentImplicit2HSword2_": {
      "id": "AccuracyPercentImplicit2HSword2_",
      "name": "",
      "requiredLevel": 1,
      "stats": [
          {
              "id": "accuracy_rating_+%",
              "max": 45,
              "min": 45
          }
      ],
      "groups": [
          "IncreasedAccuracy"
      ]
  },
  "IncreasedAccuracy2hSwordImplicit7": {
      "id": "IncreasedAccuracy2hSwordImplicit7",
      "name": "",
      "requiredLevel": 1,
      "stats": [
          {
              "id": "local_accuracy_rating",
              "max": 400,
              "min": 400
          }
      ],
      "groups": [
          "IncreasedAccuracy"
      ]
  },
  "CriticalMultiplierImplicitSword2H1": {
      "id": "CriticalMultiplierImplicitSword2H1",
      "name": "",
      "requiredLevel": 1,
      "stats": [
          {
              "id": "base_critical_strike_multiplier_+",
              "max": 25,
              "min": 25
          }
      ],
      "groups": [
          "CriticalStrikeMultiplier"
      ]
  },
  "IncreasedAccuracy2hSwordImplicit9": {
      "id": "IncreasedAccuracy2hSwordImplicit9",
      "name": "",
      "requiredLevel": 1,
      "stats": [
          {
              "id": "local_accuracy_rating",
              "max": 470,
              "min": 470
          }
      ],
      "groups": [
          "IncreasedAccuracy"
      ]
  },
  "StrengthDexterityImplicitSword_1": {
      "id": "StrengthDexterityImplicitSword_1",
      "name": "",
      "requiredLevel": 1,
      "stats": [
          {
              "id": "additional_strength_and_dexterity",
              "max": 50,
              "min": 50
          }
      ],
      "groups": [
          "StrengthDexterity"
      ]
  },
  "WeaponElementalDamageImplicitSword1": {
      "id": "WeaponElementalDamageImplicitSword1",
      "name": "",
      "requiredLevel": 1,
      "stats": [
          {
              "id": "elemental_damage_with_attack_skills_+%",
              "max": 30,
              "min": 30
          }
      ],
      "groups": [
          "IncreasedWeaponElementalDamagePercent"
      ]
  },
  "IncreasedAccuracy2hSwordImplicit1": {
      "id": "IncreasedAccuracy2hSwordImplicit1",
      "name": "",
      "requiredLevel": 1,
      "stats": [
          {
              "id": "local_accuracy_rating",
              "max": 60,
              "min": 60
          }
      ],
      "groups": [
          "IncreasedAccuracy"
      ]
  },
  "IncreasedAccuracy2hSwordImplicit2": {
      "id": "IncreasedAccuracy2hSwordImplicit2",
      "name": "",
      "requiredLevel": 1,
      "stats": [
          {
              "id": "local_accuracy_rating",
              "max": 120,
              "min": 120
          }
      ],
      "groups": [
          "IncreasedAccuracy"
      ]
  },
  "IncreasedAccuracy2hSwordImplicit3": {
      "id": "IncreasedAccuracy2hSwordImplicit3",
      "name": "",
      "requiredLevel": 1,
      "stats": [
          {
              "id": "local_accuracy_rating",
              "max": 185,
              "min": 185
          }
      ],
      "groups": [
          "IncreasedAccuracy"
      ]
  },
  "IncreasedAccuracy2hSwordImplicit4": {
      "id": "IncreasedAccuracy2hSwordImplicit4",
      "name": "",
      "requiredLevel": 1,
      "stats": [
          {
              "id": "local_accuracy_rating",
              "max": 250,
              "min": 250
          }
      ],
      "groups": [
          "IncreasedAccuracy"
      ]
  },
};

// ===== BASE ITEMS =====

// Amulet (48 items)
export const AMULET_BASES: PoeBaseItem[] = [
  {
      "id": "Metadata/Items/Amulets/Talismans/Talisman1_1",
      "name": "Black Maw Talisman",
      "itemClass": "Amulet",
      "dropLevel": 1,
      "inventoryWidth": 1,
      "inventoryHeight": 1,
      "requirements": null,
      "properties": {},
      "implicits": [
          "TalismanHasOneSocket_",
          "TalismanCanBePickedUpByMonster"
      ],
      "tags": [
          "talisman",
          "amulet",
          "default"
      ],
      "visualIdentity": {
          "ddsFile": "Art/2DItems/Amulets/TalismanWhite3.dds",
          "id": "OddskullTalisman"
      }
  },
  {
      "id": "Metadata/Items/Amulets/Talismans/Talisman1_10",
      "name": "Mandible Talisman",
      "itemClass": "Amulet",
      "dropLevel": 1,
      "inventoryWidth": 1,
      "inventoryHeight": 1,
      "requirements": null,
      "properties": {},
      "implicits": [
          "TalismanAttackAndCastSpeed",
          "TalismanCanBePickedUpByMonster"
      ],
      "tags": [
          "talisman",
          "amulet",
          "default"
      ],
      "visualIdentity": {
          "ddsFile": "Art/2DItems/Amulets/NewTalisman.dds",
          "id": "MandibleTalisman"
      }
  },
  {
      "id": "Metadata/Items/Amulets/Talismans/Talisman1_2",
      "name": "Bonespire Talisman",
      "itemClass": "Amulet",
      "dropLevel": 1,
      "inventoryWidth": 1,
      "inventoryHeight": 1,
      "requirements": null,
      "properties": {},
      "implicits": [
          "TalismanIncreasedMana",
          "TalismanCanBePickedUpByMonster"
      ],
      "tags": [
          "talisman",
          "amulet",
          "default"
      ],
      "visualIdentity": {
          "ddsFile": "Art/2DItems/Amulets/TalismanWhite7.dds",
          "id": "BonespireTalisman"
      }
  },
  {
      "id": "Metadata/Items/Amulets/Talismans/Talisman1_3",
      "name": "Ashscale Talisman",
      "itemClass": "Amulet",
      "dropLevel": 1,
      "inventoryWidth": 1,
      "inventoryHeight": 1,
      "requirements": null,
      "properties": {},
      "implicits": [
          "TalismanIncreasedFireDamage",
          "TalismanCanBePickedUpByMonster"
      ],
      "tags": [
          "talisman",
          "amulet",
          "default"
      ],
      "visualIdentity": {
          "ddsFile": "Art/2DItems/Amulets/TalismanWhite8.dds",
          "id": "AshscaleTalisman"
      }
  },
  {
      "id": "Metadata/Items/Amulets/Talismans/Talisman1_4",
      "name": "Lone Antler Talisman",
      "itemClass": "Amulet",
      "dropLevel": 1,
      "inventoryWidth": 1,
      "inventoryHeight": 1,
      "requirements": null,
      "properties": {},
      "implicits": [
          "TalismanIncreasedLightningDamage",
          "TalismanCanBePickedUpByMonster"
      ],
      "tags": [
          "talisman",
          "amulet",
          "default"
      ],
      "visualIdentity": {
          "ddsFile": "Art/2DItems/Amulets/TalismanWhite2.dds",
          "id": "LoneAntlerTalisman"
      }
  },
  {
      "id": "Metadata/Items/Amulets/Talismans/Talisman1_5",
      "name": "Deep One Talisman",
      "itemClass": "Amulet",
      "dropLevel": 1,
      "inventoryWidth": 1,
      "inventoryHeight": 1,
      "requirements": null,
      "properties": {},
      "implicits": [
          "TalismanIncreasedColdDamage",
          "TalismanCanBePickedUpByMonster"
      ],
      "tags": [
          "talisman",
          "amulet",
          "default"
      ],
      "visualIdentity": {
          "ddsFile": "Art/2DItems/Amulets/TalismanWhite5.dds",
          "id": "DeepmawTalisman"
      }
  },
  {
      "id": "Metadata/Items/Amulets/Talismans/Talisman1_6",
      "name": "Breakrib Talisman",
      "itemClass": "Amulet",
      "dropLevel": 1,
      "inventoryWidth": 1,
      "inventoryHeight": 1,
      "requirements": null,
      "properties": {},
      "implicits": [
          "TalismanIncreasedPhysicalDamage",
          "TalismanCanBePickedUpByMonster"
      ],
      "tags": [
          "talisman",
          "amulet",
          "default"
      ],
      "visualIdentity": {
          "ddsFile": "Art/2DItems/Amulets/TalismanWhite1.dds",
          "id": "BrokenRibTalisman"
      }
  },
  {
      "id": "Metadata/Items/Amulets/Talismans/Talisman1_7",
      "name": "Deadhand Talisman",
      "itemClass": "Amulet",
      "dropLevel": 1,
      "inventoryWidth": 1,
      "inventoryHeight": 1,
      "requirements": null,
      "properties": {},
      "implicits": [
          "TalismanIncreasedChaosDamage",
          "TalismanCanBePickedUpByMonster"
      ],
      "tags": [
          "talisman",
          "amulet",
          "default"
      ],
      "visualIdentity": {
          "ddsFile": "Art/2DItems/Amulets/TalismanWhite4.dds",
          "id": "DeadhandTalisman"
      }
  },
  {
      "id": "Metadata/Items/Amulets/Talismans/Talisman1_8",
      "name": "Undying Flesh Talisman",
      "itemClass": "Amulet",
      "dropLevel": 1,
      "inventoryWidth": 1,
      "inventoryHeight": 1,
      "requirements": null,
      "properties": {},
      "implicits": [
          "TalismanAdditionalZombie",
          "TalismanCanBePickedUpByMonster"
      ],
      "tags": [
          "talisman",
          "amulet",
          "default"
      ],
      "visualIdentity": {
          "ddsFile": "Art/2DItems/Amulets/TalismanWhite6.dds",
          "id": "UndyingFleshTalisman"
      }
  },
  {
      "id": "Metadata/Items/Amulets/Talismans/Talisman1_9",
      "name": "Rot Head Talisman",
      "itemClass": "Amulet",
      "dropLevel": 1,
      "inventoryWidth": 1,
      "inventoryHeight": 1,
      "requirements": null,
      "properties": {},
      "implicits": [
          "TalismanFishBiteSensitivity",
          "TalismanCanBePickedUpByMonster"
      ],
      "tags": [
          "talisman",
          "amulet",
          "default"
      ],
      "visualIdentity": {
          "ddsFile": "Art/2DItems/Amulets/FishTalisman.dds",
          "id": "RotHeadTalisman"
      }
  },
  {
      "id": "Metadata/Items/Amulets/Talismans/Talisman2_1",
      "name": "Hexclaw Talisman",
      "itemClass": "Amulet",
      "dropLevel": 1,
      "inventoryWidth": 1,
      "inventoryHeight": 1,
      "requirements": null,
      "properties": {},
      "implicits": [
          "TalismanIncreasedCriticalChance",
          "TalismanCanBePickedUpByMonster"
      ],
      "tags": [
          "talisman",
          "amulet",
          "default"
      ],
      "visualIdentity": {
          "ddsFile": "Art/2DItems/Amulets/TalismanBlack6.dds",
          "id": "ManyClawedTalisman"
      }
  },
  {
      "id": "Metadata/Items/Amulets/Talismans/Talisman2_2",
      "name": "Primal Skull Talisman",
      "itemClass": "Amulet",
      "dropLevel": 1,
      "inventoryWidth": 1,
      "inventoryHeight": 1,
      "requirements": null,
      "properties": {},
      "implicits": [
          "TalismanPercentLifeRegeneration",
          "TalismanCanBePickedUpByMonster"
      ],
      "tags": [
          "talisman",
          "amulet",
          "default"
      ],
      "visualIdentity": {
          "ddsFile": "Art/2DItems/Amulets/TalismanBlack7.dds",
          "id": "PrimalSkullTalisman"
      }
  },
  {
      "id": "Metadata/Items/Amulets/Talismans/Talisman2_3",
      "name": "Wereclaw Talisman",
      "itemClass": "Amulet",
      "dropLevel": 1,
      "inventoryWidth": 1,
      "inventoryHeight": 1,
      "requirements": null,
      "properties": {},
      "implicits": [
          "TalismanIncreasedCriticalStrikeMultiplier_",
          "TalismanCanBePickedUpByMonster"
      ],
      "tags": [
          "talisman",
          "amulet",
          "default"
      ],
      "visualIdentity": {
          "ddsFile": "Art/2DItems/Amulets/DireClawTalisman.dds",
          "id": "WereclawTalisman"
      }
  },
  {
      "id": "Metadata/Items/Amulets/Talismans/Talisman2_4",
      "name": "Splitnewt Talisman",
      "itemClass": "Amulet",
      "dropLevel": 1,
      "inventoryWidth": 1,
      "inventoryHeight": 1,
      "requirements": null,
      "properties": {},
      "implicits": [
          "TalismanChanceToFreezeShockIgnite_",
          "TalismanCanBePickedUpByMonster"
      ],
      "tags": [
          "talisman",
          "amulet",
          "default"
      ],
      "visualIdentity": {
          "ddsFile": "Art/2DItems/Amulets/TalismanBlack4.dds",
          "id": "SplitnewtTalisman"
      }
  },
  {
      "id": "Metadata/Items/Amulets/Talismans/Talisman2_5",
      "name": "Clutching Talisman",
      "itemClass": "Amulet",
      "dropLevel": 1,
      "inventoryWidth": 1,
      "inventoryHeight": 1,
      "requirements": null,
      "properties": {},
      "implicits": [
          "TalismanGlobalDefensesPercent",
          "TalismanCanBePickedUpByMonster"
      ],
      "tags": [
          "talisman",
          "amulet",
          "default"
      ],
      "visualIdentity": {
          "ddsFile": "Art/2DItems/Amulets/TalismanBlack3.dds",
          "id": "ClutchingTalisman"
      }
  },
  {
      "id": "Metadata/Items/Amulets/Talismans/Talisman2_6_1",
      "name": "Avian Twins Talisman",
      "itemClass": "Amulet",
      "dropLevel": 1,
      "inventoryWidth": 1,
      "inventoryHeight": 1,
      "requirements": null,
      "properties": {},
      "implicits": [
          "TalismanFireTakenAsCold",
          "TalismanCanBePickedUpByMonster"
      ],
      "tags": [
          "talisman",
          "amulet",
          "default"
      ],
      "visualIdentity": {
          "ddsFile": "Art/2DItems/Amulets/TalismanBlack2.dds",
          "id": "AvianTwinsTalisman"
      }
  },
  {
      "id": "Metadata/Items/Amulets/Talismans/Talisman2_6_2",
      "name": "Avian Twins Talisman",
      "itemClass": "Amulet",
      "dropLevel": 1,
      "inventoryWidth": 1,
      "inventoryHeight": 1,
      "requirements": null,
      "properties": {},
      "implicits": [
          "TalismanFireTakenAsLightning",
          "TalismanCanBePickedUpByMonster"
      ],
      "tags": [
          "talisman",
          "amulet",
          "default"
      ],
      "visualIdentity": {
          "ddsFile": "Art/2DItems/Amulets/TalismanBlack2.dds",
          "id": "AvianTwinsTalisman"
      }
  },
  {
      "id": "Metadata/Items/Amulets/Talismans/Talisman2_6_3",
      "name": "Avian Twins Talisman",
      "itemClass": "Amulet",
      "dropLevel": 1,
      "inventoryWidth": 1,
      "inventoryHeight": 1,
      "requirements": null,
      "properties": {},
      "implicits": [
          "TalismanColdTakenAsFire",
          "TalismanCanBePickedUpByMonster"
      ],
      "tags": [
          "talisman",
          "amulet",
          "default"
      ],
      "visualIdentity": {
          "ddsFile": "Art/2DItems/Amulets/TalismanBlack2.dds",
          "id": "AvianTwinsTalisman"
      }
  },
  {
      "id": "Metadata/Items/Amulets/Talismans/Talisman2_6_4",
      "name": "Avian Twins Talisman",
      "itemClass": "Amulet",
      "dropLevel": 1,
      "inventoryWidth": 1,
      "inventoryHeight": 1,
      "requirements": null,
      "properties": {},
      "implicits": [
          "TalismanColdTakenAsLightning",
          "TalismanCanBePickedUpByMonster"
      ],
      "tags": [
          "talisman",
          "amulet",
          "default"
      ],
      "visualIdentity": {
          "ddsFile": "Art/2DItems/Amulets/TalismanBlack2.dds",
          "id": "AvianTwinsTalisman"
      }
  },
  {
      "id": "Metadata/Items/Amulets/Talismans/Talisman2_6_5",
      "name": "Avian Twins Talisman",
      "itemClass": "Amulet",
      "dropLevel": 1,
      "inventoryWidth": 1,
      "inventoryHeight": 1,
      "requirements": null,
      "properties": {},
      "implicits": [
          "TalismanLightningTakenAsCold",
          "TalismanCanBePickedUpByMonster"
      ],
      "tags": [
          "talisman",
          "amulet",
          "default"
      ],
      "visualIdentity": {
          "ddsFile": "Art/2DItems/Amulets/TalismanBlack2.dds",
          "id": "AvianTwinsTalisman"
      }
  },
  {
      "id": "Metadata/Items/Amulets/Talismans/Talisman2_6_6",
      "name": "Avian Twins Talisman",
      "itemClass": "Amulet",
      "dropLevel": 1,
      "inventoryWidth": 1,
      "inventoryHeight": 1,
      "requirements": null,
      "properties": {},
      "implicits": [
          "TalismanLightningTakenAsFire",
          "TalismanCanBePickedUpByMonster"
      ],
      "tags": [
          "talisman",
          "amulet",
          "default"
      ],
      "visualIdentity": {
          "ddsFile": "Art/2DItems/Amulets/TalismanBlack2.dds",
          "id": "AvianTwinsTalisman"
      }
  },
  {
      "id": "Metadata/Items/Amulets/Talismans/Talisman2_7",
      "name": "Fangjaw Talisman",
      "itemClass": "Amulet",
      "dropLevel": 1,
      "inventoryWidth": 1,
      "inventoryHeight": 1,
      "requirements": null,
      "properties": {},
      "implicits": [
          "TalismanIncreasedLife",
          "TalismanCanBePickedUpByMonster"
      ],
      "tags": [
          "talisman",
          "amulet",
          "default"
      ],
      "visualIdentity": {
          "ddsFile": "Art/2DItems/Amulets/TalismanBlack5.dds",
          "id": "UndermawTalisman"
      }
  },
  {
      "id": "Metadata/Items/Amulets/Talismans/Talisman2_8",
      "name": "Horned Talisman",
      "itemClass": "Amulet",
      "dropLevel": 1,
      "inventoryWidth": 1,
      "inventoryHeight": 1,
      "requirements": null,
      "properties": {},
      "implicits": [
          "TalismanAdditionalPierce",
          "TalismanCanBePickedUpByMonster"
      ],
      "tags": [
          "talisman",
          "amulet",
          "default"
      ],
      "visualIdentity": {
          "ddsFile": "Art/2DItems/Amulets/NewTalisman7.dds",
          "id": "HornedTalisman"
      }
  },
  {
      "id": "Metadata/Items/Amulets/Talismans/Talisman3_1",
      "name": "Spinefuse Talisman",
      "itemClass": "Amulet",
      "dropLevel": 1,
      "inventoryWidth": 1,
      "inventoryHeight": 1,
      "requirements": null,
      "properties": {},
      "implicits": [
          "TalismanIncreasedItemQuantity",
          "TalismanCanBePickedUpByMonster"
      ],
      "tags": [
          "talisman",
          "amulet",
          "default"
      ],
      "visualIdentity": {
          "ddsFile": "Art/2DItems/Amulets/TalismanRed3.dds",
          "id": "BonefuseTalisman"
      }
  },
  {
      "id": "Metadata/Items/Amulets/Talismans/Talisman3_2",
      "name": "Three Rat Talisman",
      "itemClass": "Amulet",
      "dropLevel": 1,
      "inventoryWidth": 1,
      "inventoryHeight": 1,
      "requirements": null,
      "properties": {},
      "implicits": [
          "TalismanIncreasedAllAttributes",
          "TalismanCanBePickedUpByMonster"
      ],
      "tags": [
          "talisman",
          "amulet",
          "default"
      ],
      "visualIdentity": {
          "ddsFile": "Art/2DItems/Amulets/TalismanRed7.dds",
          "id": "ThreeRodentsTalisman_"
      }
  },
  {
      "id": "Metadata/Items/Amulets/Talismans/Talisman3_3",
      "name": "Monkey Twins Talisman",
      "itemClass": "Amulet",
      "dropLevel": 1,
      "inventoryWidth": 1,
      "inventoryHeight": 1,
      "requirements": null,
      "properties": {},
      "implicits": [
          "TalismanIncreasedAreaOfEffect",
          "TalismanCanBePickedUpByMonster"
      ],
      "tags": [
          "talisman",
          "amulet",
          "default"
      ],
      "visualIdentity": {
          "ddsFile": "Art/2DItems/Amulets/TalismanRed6.dds",
          "id": "MonkeyTwinsTalisman"
      }
  },
  {
      "id": "Metadata/Items/Amulets/Talismans/Talisman3_4",
      "name": "Longtooth Talisman",
      "itemClass": "Amulet",
      "dropLevel": 1,
      "inventoryWidth": 1,
      "inventoryHeight": 1,
      "requirements": null,
      "properties": {},
      "implicits": [
          "TalismanReducedPhysicalDamageTaken_",
          "TalismanCanBePickedUpByMonster"
      ],
      "tags": [
          "talisman",
          "amulet",
          "default"
      ],
      "visualIdentity": {
          "ddsFile": "Art/2DItems/Amulets/TalismanRed4.dds",
          "id": "LongtoothTalisman_"
      }
  },
  {
      "id": "Metadata/Items/Amulets/Talismans/Talisman3_5",
      "name": "Rotfeather Talisman",
      "itemClass": "Amulet",
      "dropLevel": 1,
      "inventoryWidth": 1,
      "inventoryHeight": 1,
      "requirements": null,
      "properties": {},
      "implicits": [
          "TalismanIncreasedDamage",
          "TalismanCanBePickedUpByMonster"
      ],
      "tags": [
          "talisman",
          "amulet",
          "default"
      ],
      "visualIdentity": {
          "ddsFile": "Art/2DItems/Amulets/TalismanRed1.dds",
          "id": "RottingSkiesTalisman_"
      }
  },
  {
      "id": "Metadata/Items/Amulets/Talismans/Talisman3_6_1",
      "name": "Monkey Paw Talisman",
      "itemClass": "Amulet",
      "dropLevel": 1,
      "inventoryWidth": 1,
      "inventoryHeight": 1,
      "requirements": null,
      "properties": {},
      "implicits": [
          "TalismanPowerChargeOnKill",
          "TalismanCanBePickedUpByMonster"
      ],
      "tags": [
          "talisman",
          "amulet",
          "default"
      ],
      "visualIdentity": {
          "ddsFile": "Art/2DItems/Amulets/MonkeyPawTalisman.dds",
          "id": "MonkeyPawTalisman"
      }
  },
  {
      "id": "Metadata/Items/Amulets/Talismans/Talisman3_6_2",
      "name": "Monkey Paw Talisman",
      "itemClass": "Amulet",
      "dropLevel": 1,
      "inventoryWidth": 1,
      "inventoryHeight": 1,
      "requirements": null,
      "properties": {},
      "implicits": [
          "TalismanFrenzyChargeOnKill",
          "TalismanCanBePickedUpByMonster"
      ],
      "tags": [
          "talisman",
          "amulet",
          "default"
      ],
      "visualIdentity": {
          "ddsFile": "Art/2DItems/Amulets/MonkeyPawTalisman.dds",
          "id": "MonkeyPawTalisman"
      }
  },
  {
      "id": "Metadata/Items/Amulets/Talismans/Talisman3_6_3",
      "name": "Monkey Paw Talisman",
      "itemClass": "Amulet",
      "dropLevel": 1,
      "inventoryWidth": 1,
      "inventoryHeight": 1,
      "requirements": null,
      "properties": {},
      "implicits": [
          "TalismanEnduranceChargeOnKill_",
          "TalismanCanBePickedUpByMonster"
      ],
      "tags": [
          "talisman",
          "amulet",
          "default"
      ],
      "visualIdentity": {
          "ddsFile": "Art/2DItems/Amulets/MonkeyPawTalisman.dds",
          "id": "MonkeyPawTalisman"
      }
  },
  {
      "id": "Metadata/Items/Amulets/Talismans/Talisman3_7",
      "name": "Three Hands Talisman",
      "itemClass": "Amulet",
      "dropLevel": 1,
      "inventoryWidth": 1,
      "inventoryHeight": 1,
      "requirements": null,
      "properties": {},
      "implicits": [
          "TalismanDamageDealtAddedAsRandomElement",
          "TalismanCanBePickedUpByMonster"
      ],
      "tags": [
          "talisman",
          "amulet",
          "default"
      ],
      "visualIdentity": {
          "ddsFile": "Art/2DItems/Amulets/TalismanRed8.dds",
          "id": "ThreeHandsTalisman"
      }
  },
  {
      "id": "Metadata/Items/Amulets/Talismans/Talisman4",
      "name": "Greatwolf Talisman",
      "itemClass": "Amulet",
      "dropLevel": 1,
      "inventoryWidth": 1,
      "inventoryHeight": 1,
      "requirements": null,
      "properties": {},
      "implicits": [],
      "tags": [
          "amulet",
          "default"
      ],
      "visualIdentity": {
          "ddsFile": "Art/2DItems/Amulets/T4Talisman.dds",
          "id": "GreatwolfTalisman"
      }
  },
  {
      "id": "Metadata/Items/Amulets/Amulet1",
      "name": "Paua Amulet",
      "itemClass": "Amulet",
      "dropLevel": 3,
      "inventoryWidth": 1,
      "inventoryHeight": 1,
      "requirements": null,
      "properties": {},
      "implicits": [
          "ManaRegenerationImplicitAmulet1"
      ],
      "tags": [
          "amulet",
          "default"
      ],
      "visualIdentity": {
          "ddsFile": "Art/2DItems/Amulets/Amulet1.dds",
          "id": "Amulet1"
      }
  },
  {
      "id": "Metadata/Items/Amulets/Amulet2",
      "name": "Coral Amulet",
      "itemClass": "Amulet",
      "dropLevel": 3,
      "inventoryWidth": 1,
      "inventoryHeight": 1,
      "requirements": null,
      "properties": {},
      "implicits": [
          "LifeRegenerationImplicitAmulet1"
      ],
      "tags": [
          "amulet",
          "default"
      ],
      "visualIdentity": {
          "ddsFile": "Art/2DItems/Amulets/Amulet2.dds",
          "id": "Amulet2"
      }
  },
  {
      "id": "Metadata/Items/Amulets/Amulet3",
      "name": "Amber Amulet",
      "itemClass": "Amulet",
      "dropLevel": 7,
      "inventoryWidth": 1,
      "inventoryHeight": 1,
      "requirements": null,
      "properties": {},
      "implicits": [
          "StrengthImplicitAmulet1"
      ],
      "tags": [
          "amulet",
          "default"
      ],
      "visualIdentity": {
          "ddsFile": "Art/2DItems/Amulets/Amulet3.dds",
          "id": "Amulet3"
      }
  },
  {
      "id": "Metadata/Items/Amulets/Amulet4",
      "name": "Jade Amulet",
      "itemClass": "Amulet",
      "dropLevel": 7,
      "inventoryWidth": 1,
      "inventoryHeight": 1,
      "requirements": null,
      "properties": {},
      "implicits": [
          "DexterityImplicitAmulet1"
      ],
      "tags": [
          "amulet",
          "default"
      ],
      "visualIdentity": {
          "ddsFile": "Art/2DItems/Amulets/Amulet4.dds",
          "id": "Amulet4"
      }
  },
  {
      "id": "Metadata/Items/Amulets/Amulet5",
      "name": "Lapis Amulet",
      "itemClass": "Amulet",
      "dropLevel": 7,
      "inventoryWidth": 1,
      "inventoryHeight": 1,
      "requirements": null,
      "properties": {},
      "implicits": [
          "IntelligenceImplicitAmulet1"
      ],
      "tags": [
          "amulet",
          "default"
      ],
      "visualIdentity": {
          "ddsFile": "Art/2DItems/Amulets/Amulet5.dds",
          "id": "Amulet5"
      }
  },
  {
      "id": "Metadata/Items/Amulets/Amulet6",
      "name": "Gold Amulet",
      "itemClass": "Amulet",
      "dropLevel": 15,
      "inventoryWidth": 1,
      "inventoryHeight": 1,
      "requirements": null,
      "properties": {},
      "implicits": [
          "ItemFoundRarityIncreaseImplicitAmulet1"
      ],
      "tags": [
          "amulet",
          "default"
      ],
      "visualIdentity": {
          "ddsFile": "Art/2DItems/Amulets/Amulet6.dds",
          "id": "Amulet6"
      }
  },
  {
      "id": "Metadata/Items/Amulets/Amulet10",
      "name": "Citrine Amulet",
      "itemClass": "Amulet",
      "dropLevel": 20,
      "inventoryWidth": 1,
      "inventoryHeight": 1,
      "requirements": null,
      "properties": {},
      "implicits": [
          "HybridStrDex"
      ],
      "tags": [
          "amulet",
          "default"
      ],
      "visualIdentity": {
          "ddsFile": "Art/2DItems/Amulets/CitrineAmulet.dds",
          "id": "Amulet10"
      }
  },
  {
      "id": "Metadata/Items/Amulets/Amulet8",
      "name": "Turquoise Amulet",
      "itemClass": "Amulet",
      "dropLevel": 20,
      "inventoryWidth": 1,
      "inventoryHeight": 1,
      "requirements": null,
      "properties": {},
      "implicits": [
          "HybridDexInt"
      ],
      "tags": [
          "amulet",
          "default"
      ],
      "visualIdentity": {
          "ddsFile": "Art/2DItems/Amulets/TurquoiseAmulet.dds",
          "id": "Amulet8"
      }
  },
  {
      "id": "Metadata/Items/Amulets/Amulet9",
      "name": "Agate Amulet",
      "itemClass": "Amulet",
      "dropLevel": 20,
      "inventoryWidth": 1,
      "inventoryHeight": 1,
      "requirements": null,
      "properties": {},
      "implicits": [
          "HybridStrInt"
      ],
      "tags": [
          "amulet",
          "default"
      ],
      "visualIdentity": {
          "ddsFile": "Art/2DItems/Amulets/AgateAmulet.dds",
          "id": "Amulet9"
      }
  },
  {
      "id": "Metadata/Items/Amulets/Amulet7",
      "name": "Onyx Amulet",
      "itemClass": "Amulet",
      "dropLevel": 25,
      "inventoryWidth": 1,
      "inventoryHeight": 1,
      "requirements": null,
      "properties": {},
      "implicits": [
          "AllAttributesImplicitAmulet1"
      ],
      "tags": [
          "amulet",
          "default"
      ],
      "visualIdentity": {
          "ddsFile": "Art/2DItems/Amulets/Amulet7.dds",
          "id": "Amulet7"
      }
  },
  {
      "id": "Metadata/Items/Amulets/Talismans/Talisman1_11",
      "name": "Chrysalis Talisman",
      "itemClass": "Amulet",
      "dropLevel": 35,
      "inventoryWidth": 1,
      "inventoryHeight": 1,
      "requirements": null,
      "properties": {},
      "implicits": [
          "TalismanSpellDamage",
          "TalismanCanBePickedUpByMonster"
      ],
      "tags": [
          "talisman",
          "amulet",
          "default"
      ],
      "visualIdentity": {
          "ddsFile": "Art/2DItems/Amulets/NewTalisman2.dds",
          "id": "ChrysalisTalisman"
      }
  },
  {
      "id": "Metadata/Items/Amulets/Talismans/Talisman1_12",
      "name": "Writhing Talisman",
      "itemClass": "Amulet",
      "dropLevel": 35,
      "inventoryWidth": 1,
      "inventoryHeight": 1,
      "requirements": null,
      "properties": {},
      "implicits": [
          "TalismanAttackDamage",
          "TalismanCanBePickedUpByMonster"
      ],
      "tags": [
          "talisman",
          "amulet",
          "default"
      ],
      "visualIdentity": {
          "ddsFile": "Art/2DItems/Amulets/NewTalisman3.dds",
          "id": "WrithingTalisman"
      }
  },
  {
      "id": "Metadata/Items/Amulet/AmuletAtlas2",
      "name": "Marble Amulet",
      "itemClass": "Amulet",
      "dropLevel": 74,
      "inventoryWidth": 1,
      "inventoryHeight": 1,
      "requirements": null,
      "properties": {},
      "implicits": [
          "LifeRegenerationImplicitAmulet2"
      ],
      "tags": [
          "not_for_sale",
          "atlas_base_type",
          "amuletatlas2",
          "amulet",
          "default"
      ],
      "visualIdentity": {
          "ddsFile": "Art/2DItems/Amulets/MarbleAmulet.dds",
          "id": "AmuletAtlas2"
      }
  },
  {
      "id": "Metadata/Items/Amulet/AmuletAtlas3",
      "name": "Seaglass Amulet",
      "itemClass": "Amulet",
      "dropLevel": 74,
      "inventoryWidth": 1,
      "inventoryHeight": 1,
      "requirements": null,
      "properties": {},
      "implicits": [
          "ReducedEnergyShieldDelayImplicit1_"
      ],
      "tags": [
          "not_for_sale",
          "atlas_base_type",
          "amuletatlas3",
          "amulet",
          "default"
      ],
      "visualIdentity": {
          "ddsFile": "Art/2DItems/Amulets/CrescentAmulet.dds",
          "id": "AmuletAtlas3"
      }
  },
  {
      "id": "Metadata/Items/Amulet/AmuletAtlas1",
      "name": "Blue Pearl Amulet",
      "itemClass": "Amulet",
      "dropLevel": 77,
      "inventoryWidth": 1,
      "inventoryHeight": 1,
      "requirements": null,
      "properties": {},
      "implicits": [
          "ManaRegenerationImplicitAmulet2"
      ],
      "tags": [
          "not_for_sale",
          "atlas_base_type",
          "amuletatlas1",
          "amulet",
          "default"
      ],
      "visualIdentity": {
          "ddsFile": "Art/2DItems/Amulets/BluePearlAmulet.dds",
          "id": "AmuletAtlas1"
      }
  },
];

// Belt (10 items)
export const BELT_BASES: PoeBaseItem[] = [
  {
      "id": "Metadata/Items/Belts/Belt1",
      "name": "Rustic Sash",
      "itemClass": "Belt",
      "dropLevel": 2,
      "inventoryWidth": 2,
      "inventoryHeight": 1,
      "requirements": null,
      "properties": {},
      "implicits": [
          "IncreasedPhysicalDamagePercentImplicitBelt1"
      ],
      "tags": [
          "belt",
          "default"
      ],
      "visualIdentity": {
          "ddsFile": "Art/2DItems/Belts/Belt1.dds",
          "id": "Belt1"
      }
  },
  {
      "id": "Metadata/Items/Belts/Belt2",
      "name": "Chain Belt",
      "itemClass": "Belt",
      "dropLevel": 2,
      "inventoryWidth": 2,
      "inventoryHeight": 1,
      "requirements": null,
      "properties": {},
      "implicits": [
          "IncreasedEnergyShieldImplicitBelt1"
      ],
      "tags": [
          "belt",
          "default"
      ],
      "visualIdentity": {
          "ddsFile": "Art/2DItems/Belts/Belt2.dds",
          "id": "Belt2"
      }
  },
  {
      "id": "Metadata/Items/Belts/Belt3",
      "name": "Leather Belt",
      "itemClass": "Belt",
      "dropLevel": 10,
      "inventoryWidth": 2,
      "inventoryHeight": 1,
      "requirements": null,
      "properties": {},
      "implicits": [
          "IncreasedLifeImplicitBelt1"
      ],
      "tags": [
          "belt",
          "default"
      ],
      "visualIdentity": {
          "ddsFile": "Art/2DItems/Belts/Belt3.dds",
          "id": "Belt3"
      }
  },
  {
      "id": "Metadata/Items/Belts/Belt4",
      "name": "Heavy Belt",
      "itemClass": "Belt",
      "dropLevel": 10,
      "inventoryWidth": 2,
      "inventoryHeight": 1,
      "requirements": null,
      "properties": {},
      "implicits": [
          "StrengthImplicitBelt1"
      ],
      "tags": [
          "belt",
          "default"
      ],
      "visualIdentity": {
          "ddsFile": "Art/2DItems/Belts/Belt5.dds",
          "id": "Belt5"
      }
  },
  {
      "id": "Metadata/Items/Belts/Belt5",
      "name": "Cloth Belt",
      "itemClass": "Belt",
      "dropLevel": 20,
      "inventoryWidth": 2,
      "inventoryHeight": 1,
      "requirements": null,
      "properties": {},
      "implicits": [
          "StunRecoveryImplicitBelt1"
      ],
      "tags": [
          "belt",
          "default"
      ],
      "visualIdentity": {
          "ddsFile": "Art/2DItems/Belts/Belt4.dds",
          "id": "Belt4"
      }
  },
  {
      "id": "Metadata/Items/Belts/Belt6",
      "name": "Studded Belt",
      "itemClass": "Belt",
      "dropLevel": 20,
      "inventoryWidth": 2,
      "inventoryHeight": 1,
      "requirements": null,
      "properties": {},
      "implicits": [
          "StunDurationImplicitBelt1"
      ],
      "tags": [
          "belt",
          "default"
      ],
      "visualIdentity": {
          "ddsFile": "Art/2DItems/Belts/Belt6.dds",
          "id": "Belt6"
      }
  },
  {
      "id": "Metadata/Items/Belts/BeltE1",
      "name": "Micro-Distillery Belt",
      "itemClass": "Belt",
      "dropLevel": 20,
      "inventoryWidth": 2,
      "inventoryHeight": 1,
      "requirements": null,
      "properties": {},
      "implicits": [
          "CannotUseFlaskInFifthSlotImplicitE1_"
      ],
      "tags": [
          "belt",
          "default"
      ],
      "visualIdentity": {
          "ddsFile": "Art/2DItems/Belts/HeistBelt1.dds",
          "id": "BeltE1"
      }
  },
  {
      "id": "Metadata/Items/Belts/BeltE2",
      "name": "Mechalarm Belt",
      "itemClass": "Belt",
      "dropLevel": 70,
      "inventoryWidth": 2,
      "inventoryHeight": 1,
      "requirements": null,
      "properties": {},
      "implicits": [
          "SummonTauntingContraptionOnFlaskUseImplicitE1"
      ],
      "tags": [
          "belt",
          "default"
      ],
      "visualIdentity": {
          "ddsFile": "Art/2DItems/Belts/HeistBelt2.dds",
          "id": "BeltE2_"
      }
  },
  {
      "id": "Metadata/Items/Belts/BeltAtlas1",
      "name": "Vanguard Belt",
      "itemClass": "Belt",
      "dropLevel": 73,
      "inventoryWidth": 2,
      "inventoryHeight": 1,
      "requirements": null,
      "properties": {},
      "implicits": [
          "ArmourAndEvasionImplicitBelt1"
      ],
      "tags": [
          "not_for_sale",
          "atlas_base_type",
          "beltatlas1",
          "belt",
          "default"
      ],
      "visualIdentity": {
          "ddsFile": "Art/2DItems/Belts/Belt7.dds",
          "id": "BeltAtlas1"
      }
  },
  {
      "id": "Metadata/Items/Belts/BeltAtlas2",
      "name": "Crystal Belt",
      "itemClass": "Belt",
      "dropLevel": 73,
      "inventoryWidth": 2,
      "inventoryHeight": 1,
      "requirements": null,
      "properties": {},
      "implicits": [
          "IncreasedEnergyShieldImplicitBelt2"
      ],
      "tags": [
          "not_for_sale",
          "atlas_base_type",
          "beltatlas2",
          "belt",
          "default"
      ],
      "visualIdentity": {
          "ddsFile": "Art/2DItems/Belts/CrystalBelt.dds",
          "id": "BeltAtlas2"
      }
  },
];

// Body Armour (102 items)
export const BODY_ARMOUR_BASES: PoeBaseItem[] = [
  {
      "id": "Metadata/Items/Armours/BodyArmours/BodyStr1",
      "name": "Plate Vest",
      "itemClass": "Body Armour",
      "dropLevel": 1,
      "inventoryWidth": 2,
      "inventoryHeight": 3,
      "requirements": {
          "level": 1,
          "strength": 12,
          "dexterity": 0,
          "intelligence": 0
      },
      "properties": {
          "armour": {
              "max": 27,
              "min": 19
          },
          "movement_speed": -3
      },
      "implicits": [],
      "tags": [
          "str_armour",
          "body_armour",
          "armour",
          "default"
      ],
      "visualIdentity": {
          "ddsFile": "Art/2DItems/Armours/BodyArmours/BodyStr1A.dds",
          "id": "BodyStr1A"
      }
  },
  {
      "id": "Metadata/Items/Armours/BodyArmours/BodyDex1",
      "name": "Shabby Jerkin",
      "itemClass": "Body Armour",
      "dropLevel": 2,
      "inventoryWidth": 2,
      "inventoryHeight": 3,
      "requirements": {
          "level": 2,
          "strength": 0,
          "dexterity": 14,
          "intelligence": 0
      },
      "properties": {
          "evasion": {
              "max": 41,
              "min": 29
          },
          "movement_speed": -3
      },
      "implicits": [],
      "tags": [
          "dex_armour",
          "body_armour",
          "armour",
          "default"
      ],
      "visualIdentity": {
          "ddsFile": "Art/2DItems/Armours/BodyArmours/BodyDex1A.dds",
          "id": "BodyDex1A"
      }
  },
  {
      "id": "Metadata/Items/Armours/BodyArmours/BodyInt1",
      "name": "Simple Robe",
      "itemClass": "Body Armour",
      "dropLevel": 3,
      "inventoryWidth": 2,
      "inventoryHeight": 3,
      "requirements": {
          "level": 3,
          "strength": 0,
          "dexterity": 0,
          "intelligence": 17
      },
      "properties": {
          "energy_shield": {
              "max": 20,
              "min": 14
          },
          "movement_speed": -3
      },
      "implicits": [],
      "tags": [
          "int_armour",
          "body_armour",
          "armour",
          "default"
      ],
      "visualIdentity": {
          "ddsFile": "Art/2DItems/Armours/BodyArmours/BodyInt1A.dds",
          "id": "BodyInt1A"
      }
  },
  {
      "id": "Metadata/Items/Armours/BodyArmours/BodyDexInt1",
      "name": "Padded Vest",
      "itemClass": "Body Armour",
      "dropLevel": 4,
      "inventoryWidth": 2,
      "inventoryHeight": 3,
      "requirements": {
          "level": 4,
          "strength": 0,
          "dexterity": 10,
          "intelligence": 10
      },
      "properties": {
          "energy_shield": {
              "max": 13,
              "min": 9
          },
          "evasion": {
              "max": 38,
              "min": 27
          },
          "movement_speed": -3
      },
      "implicits": [],
      "tags": [
          "dex_int_armour",
          "body_armour",
          "armour",
          "default"
      ],
      "visualIdentity": {
          "ddsFile": "Art/2DItems/Armours/BodyArmours/BodyDexInt1A.dds",
          "id": "BodyDexInt1A"
      }
  },
  {
      "id": "Metadata/Items/Armours/BodyArmours/BodyStrDex1",
      "name": "Scale Vest",
      "itemClass": "Body Armour",
      "dropLevel": 4,
      "inventoryWidth": 2,
      "inventoryHeight": 3,
      "requirements": {
          "level": 4,
          "strength": 10,
          "dexterity": 10,
          "intelligence": 0
      },
      "properties": {
          "armour": {
              "max": 38,
              "min": 27
          },
          "evasion": {
              "max": 38,
              "min": 27
          },
          "movement_speed": -3
      },
      "implicits": [],
      "tags": [
          "str_dex_armour",
          "body_armour",
          "armour",
          "default"
      ],
      "visualIdentity": {
          "ddsFile": "Art/2DItems/Armours/BodyArmours/BodyStrDex1A.dds",
          "id": "BodyStrDex1A"
      }
  },
  {
      "id": "Metadata/Items/Armours/BodyArmours/BodyStrInt1",
      "name": "Chainmail Vest",
      "itemClass": "Body Armour",
      "dropLevel": 4,
      "inventoryWidth": 2,
      "inventoryHeight": 3,
      "requirements": {
          "level": 4,
          "strength": 10,
          "dexterity": 0,
          "intelligence": 10
      },
      "properties": {
          "armour": {
              "max": 38,
              "min": 27
          },
          "energy_shield": {
              "max": 13,
              "min": 9
          },
          "movement_speed": -5
      },
      "implicits": [],
      "tags": [
          "str_int_armour",
          "body_armour",
          "armour",
          "default"
      ],
      "visualIdentity": {
          "ddsFile": "Art/2DItems/Armours/BodyArmours/BodyStrInt1A.dds",
          "id": "BodyStrInt1A_"
      }
  },
  {
      "id": "Metadata/Items/Armours/BodyArmours/BodyStr2",
      "name": "Chestplate",
      "itemClass": "Body Armour",
      "dropLevel": 6,
      "inventoryWidth": 2,
      "inventoryHeight": 3,
      "requirements": {
          "level": 6,
          "strength": 25,
          "dexterity": 0,
          "intelligence": 0
      },
      "properties": {
          "armour": {
              "max": 89,
              "min": 68
          },
          "movement_speed": -5
      },
      "implicits": [],
      "tags": [
          "str_armour",
          "body_armour",
          "armour",
          "default"
      ],
      "visualIdentity": {
          "ddsFile": "Art/2DItems/Armours/BodyArmours/BodyStr2A.dds",
          "id": "BodyStr2A"
      }
  },
  {
      "id": "Metadata/Items/Armours/BodyArmours/BodyStrDex2",
      "name": "Light Brigandine",
      "itemClass": "Body Armour",
      "dropLevel": 8,
      "inventoryWidth": 2,
      "inventoryHeight": 3,
      "requirements": {
          "level": 8,
          "strength": 16,
          "dexterity": 16,
          "intelligence": 0
      },
      "properties": {
          "armour": {
              "max": 63,
              "min": 48
          },
          "evasion": {
              "max": 63,
              "min": 48
          },
          "movement_speed": -3
      },
      "implicits": [],
      "tags": [
          "str_dex_armour",
          "body_armour",
          "armour",
          "default"
      ],
      "visualIdentity": {
          "ddsFile": "Art/2DItems/Armours/BodyArmours/BodyStrDex2A.dds",
          "id": "BodyStrDex2A"
      }
  },
  {
      "id": "Metadata/Items/Armours/BodyArmours/BodyStrInt2",
      "name": "Chainmail Tunic",
      "itemClass": "Body Armour",
      "dropLevel": 8,
      "inventoryWidth": 2,
      "inventoryHeight": 3,
      "requirements": {
          "level": 8,
          "strength": 16,
          "dexterity": 0,
          "intelligence": 16
      },
      "properties": {
          "armour": {
              "max": 63,
              "min": 48
          },
          "energy_shield": {
              "max": 17,
              "min": 13
          },
          "movement_speed": -5
      },
      "implicits": [],
      "tags": [
          "str_int_armour",
          "body_armour",
          "armour",
          "default"
      ],
      "visualIdentity": {
          "ddsFile": "Art/2DItems/Armours/BodyArmours/BodyStrInt2A.dds",
          "id": "BodyStrInt2A"
      }
  },
  {
      "id": "Metadata/Items/Armours/BodyArmours/BodyDex2",
      "name": "Strapped Leather",
      "itemClass": "Body Armour",
      "dropLevel": 9,
      "inventoryWidth": 2,
      "inventoryHeight": 3,
      "requirements": {
          "level": 9,
          "strength": 0,
          "dexterity": 32,
          "intelligence": 0
      },
      "properties": {
          "evasion": {
              "max": 127,
              "min": 98
          },
          "movement_speed": -3
      },
      "implicits": [],
      "tags": [
          "dex_armour",
          "body_armour",
          "armour",
          "default"
      ],
      "visualIdentity": {
          "ddsFile": "Art/2DItems/Armours/BodyArmours/BodyDex3A.dds",
          "id": "BodyDex3A"
      }
  },
  {
      "id": "Metadata/Items/Armours/BodyArmours/BodyDexInt2",
      "name": "Oiled Vest",
      "itemClass": "Body Armour",
      "dropLevel": 9,
      "inventoryWidth": 2,
      "inventoryHeight": 3,
      "requirements": {
          "level": 9,
          "strength": 0,
          "dexterity": 17,
          "intelligence": 17
      },
      "properties": {
          "energy_shield": {
              "max": 18,
              "min": 14
          },
          "evasion": {
              "max": 70,
              "min": 54
          },
          "movement_speed": -3
      },
      "implicits": [],
      "tags": [
          "dex_int_armour",
          "body_armour",
          "armour",
          "default"
      ],
      "visualIdentity": {
          "ddsFile": "Art/2DItems/Armours/BodyArmours/BodyDexInt2A.dds",
          "id": "BodyDexInt2A"
      }
  },
  {
      "id": "Metadata/Items/Armours/BodyArmours/BodyInt2",
      "name": "Silken Vest",
      "itemClass": "Body Armour",
      "dropLevel": 11,
      "inventoryWidth": 2,
      "inventoryHeight": 3,
      "requirements": {
          "level": 11,
          "strength": 0,
          "dexterity": 0,
          "intelligence": 37
      },
      "properties": {
          "energy_shield": {
              "max": 38,
              "min": 30
          },
          "movement_speed": -3
      },
      "implicits": [],
      "tags": [
          "int_armour",
          "body_armour",
          "armour",
          "default"
      ],
      "visualIdentity": {
          "ddsFile": "Art/2DItems/Armours/BodyArmours/BodyInt2A.dds",
          "id": "BodyInt2A"
      }
  },
  {
      "id": "Metadata/Items/Armours/BodyArmours/BodyDex3",
      "name": "Buckskin Tunic",
      "itemClass": "Body Armour",
      "dropLevel": 17,
      "inventoryWidth": 2,
      "inventoryHeight": 3,
      "requirements": {
          "level": 17,
          "strength": 0,
          "dexterity": 53,
          "intelligence": 0
      },
      "properties": {
          "evasion": {
              "max": 221,
              "min": 176
          },
          "movement_speed": -3
      },
      "implicits": [],
      "tags": [
          "dex_armour",
          "body_armour",
          "armour",
          "default"
      ],
      "visualIdentity": {
          "ddsFile": "Art/2DItems/Armours/BodyArmours/BodyDex1B.dds",
          "id": "BodyDex1B"
      }
  },
  {
      "id": "Metadata/Items/Armours/BodyArmours/BodyStr3",
      "name": "Copper Plate",
      "itemClass": "Body Armour",
      "dropLevel": 17,
      "inventoryWidth": 2,
      "inventoryHeight": 3,
      "requirements": {
          "level": 17,
          "strength": 53,
          "dexterity": 0,
          "intelligence": 0
      },
      "properties": {
          "armour": {
              "max": 221,
              "min": 176
          },
          "movement_speed": -5
      },
      "implicits": [],
      "tags": [
          "str_armour",
          "body_armour",
          "armour",
          "default"
      ],
      "visualIdentity": {
          "ddsFile": "Art/2DItems/Armours/BodyArmours/BodyStr1B.dds",
          "id": "BodyStr1B"
      }
  },
  {
      "id": "Metadata/Items/Armours/BodyArmours/BodyStrDex3",
      "name": "Scale Doublet",
      "itemClass": "Body Armour",
      "dropLevel": 17,
      "inventoryWidth": 2,
      "inventoryHeight": 3,
      "requirements": {
          "level": 17,
          "strength": 28,
          "dexterity": 28,
          "intelligence": 0
      },
      "properties": {
          "armour": {
              "max": 121,
              "min": 97
          },
          "evasion": {
              "max": 121,
              "min": 97
          },
          "movement_speed": -3
      },
      "implicits": [],
      "tags": [
          "str_dex_armour",
          "body_armour",
          "armour",
          "default"
      ],
      "visualIdentity": {
          "ddsFile": "Art/2DItems/Armours/BodyArmours/BodyStrDex1B.dds",
          "id": "BodyStrDex1B"
      }
  },
  {
      "id": "Metadata/Items/Armours/BodyArmours/BodyStrInt3",
      "name": "Ringmail Coat",
      "itemClass": "Body Armour",
      "dropLevel": 17,
      "inventoryWidth": 2,
      "inventoryHeight": 3,
      "requirements": {
          "level": 17,
          "strength": 28,
          "dexterity": 0,
          "intelligence": 28
      },
      "properties": {
          "armour": {
              "max": 121,
              "min": 97
          },
          "energy_shield": {
              "max": 28,
              "min": 22
          },
          "movement_speed": -5
      },
      "implicits": [],
      "tags": [
          "str_int_armour",
          "body_armour",
          "armour",
          "default"
      ],
      "visualIdentity": {
          "ddsFile": "Art/2DItems/Armours/BodyArmours/BodyStrInt1B.dds",
          "id": "BodyStrInt1B"
      }
  },
  {
      "id": "Metadata/Items/Armours/BodyArmours/BodyDexInt3",
      "name": "Padded Jacket",
      "itemClass": "Body Armour",
      "dropLevel": 18,
      "inventoryWidth": 2,
      "inventoryHeight": 3,
      "requirements": {
          "level": 18,
          "strength": 0,
          "dexterity": 30,
          "intelligence": 30
      },
      "properties": {
          "energy_shield": {
              "max": 29,
              "min": 24
          },
          "evasion": {
              "max": 128,
              "min": 102
          },
          "movement_speed": -3
      },
      "implicits": [],
      "tags": [
          "dex_int_armour",
          "body_armour",
          "armour",
          "default"
      ],
      "visualIdentity": {
          "ddsFile": "Art/2DItems/Armours/BodyArmours/BodyDexInt1B.dds",
          "id": "BodyDexInt1B"
      }
  },
  {
      "id": "Metadata/Items/Armours/BodyArmours/BodyInt3",
      "name": "Scholar's Robe",
      "itemClass": "Body Armour",
      "dropLevel": 18,
      "inventoryWidth": 2,
      "inventoryHeight": 3,
      "requirements": {
          "level": 18,
          "strength": 0,
          "dexterity": 0,
          "intelligence": 55
      },
      "properties": {
          "energy_shield": {
              "max": 53,
              "min": 43
          },
          "movement_speed": -3
      },
      "implicits": [],
      "tags": [
          "int_armour",
          "body_armour",
          "armour",
          "default"
      ],
      "visualIdentity": {
          "ddsFile": "Art/2DItems/Armours/BodyArmours/BodyInt1B.dds",
          "id": "BodyInt1B"
      }
  },
  {
      "id": "Metadata/Items/Armours/BodyArmours/BodyStr4",
      "name": "War Plate",
      "itemClass": "Body Armour",
      "dropLevel": 21,
      "inventoryWidth": 2,
      "inventoryHeight": 3,
      "requirements": {
          "level": 21,
          "strength": 63,
          "dexterity": 0,
          "intelligence": 0
      },
      "properties": {
          "armour": {
              "max": 248,
              "min": 216
          },
          "movement_speed": -5
      },
      "implicits": [],
      "tags": [
          "str_armour",
          "body_armour",
          "armour",
          "default"
      ],
      "visualIdentity": {
          "ddsFile": "Art/2DItems/Armours/BodyArmours/BodyStr2B.dds",
          "id": "BodyStr2B"
      }
  },
  {
      "id": "Metadata/Items/Armours/BodyArmours/BodyStrDex4",
      "name": "Infantry Brigandine",
      "itemClass": "Body Armour",
      "dropLevel": 21,
      "inventoryWidth": 2,
      "inventoryHeight": 3,
      "requirements": {
          "level": 21,
          "strength": 34,
          "dexterity": 34,
          "intelligence": 0
      },
      "properties": {
          "armour": {
              "max": 142,
              "min": 119
          },
          "evasion": {
              "max": 142,
              "min": 119
          },
          "movement_speed": -3
      },
      "implicits": [],
      "tags": [
          "str_dex_armour",
          "body_armour",
          "armour",
          "default"
      ],
      "visualIdentity": {
          "ddsFile": "Art/2DItems/Armours/BodyArmours/BodyStrDex2B.dds",
          "id": "BodyStrDex2B"
      }
  },
  {
      "id": "Metadata/Items/Armours/BodyArmours/BodyStrInt4",
      "name": "Chainmail Doublet",
      "itemClass": "Body Armour",
      "dropLevel": 21,
      "inventoryWidth": 2,
      "inventoryHeight": 3,
      "requirements": {
          "level": 21,
          "strength": 34,
          "dexterity": 0,
          "intelligence": 34
      },
      "properties": {
          "armour": {
              "max": 140,
              "min": 119
          },
          "energy_shield": {
              "max": 31,
              "min": 27
          },
          "movement_speed": -5
      },
      "implicits": [],
      "tags": [
          "str_int_armour",
          "body_armour",
          "armour",
          "default"
      ],
      "visualIdentity": {
          "ddsFile": "Art/2DItems/Armours/BodyArmours/BodyStrInt2B.dds",
          "id": "BodyStrInt2B"
      }
  },
  {
      "id": "Metadata/Items/Armours/BodyArmours/BodyDexInt4",
      "name": "Oiled Coat",
      "itemClass": "Body Armour",
      "dropLevel": 22,
      "inventoryWidth": 2,
      "inventoryHeight": 3,
      "requirements": {
          "level": 22,
          "strength": 0,
          "dexterity": 35,
          "intelligence": 35
      },
      "properties": {
          "energy_shield": {
              "max": 33,
              "min": 28
          },
          "evasion": {
              "max": 146,
              "min": 124
          },
          "movement_speed": -3
      },
      "implicits": [],
      "tags": [
          "dex_int_armour",
          "body_armour",
          "armour",
          "default"
      ],
      "visualIdentity": {
          "ddsFile": "Art/2DItems/Armours/BodyArmours/BodyDexInt2B.dds",
          "id": "BodyDexInt2B"
      }
  },
  {
      "id": "Metadata/Items/Armours/BodyArmours/BodyDex4",
      "name": "Wild Leather",
      "itemClass": "Body Armour",
      "dropLevel": 25,
      "inventoryWidth": 2,
      "inventoryHeight": 3,
      "requirements": {
          "level": 25,
          "strength": 0,
          "dexterity": 73,
          "intelligence": 0
      },
      "properties": {
          "evasion": {
              "max": 306,
              "min": 255
          },
          "movement_speed": -3
      },
      "implicits": [],
      "tags": [
          "dex_armour",
          "body_armour",
          "armour",
          "default"
      ],
      "visualIdentity": {
          "ddsFile": "Art/2DItems/Armours/BodyArmours/BodyDex3B.dds",
          "id": "BodyDex3B"
      }
  },
  {
      "id": "Metadata/Items/Armours/BodyArmours/BodyInt4",
      "name": "Silken Garb",
      "itemClass": "Body Armour",
      "dropLevel": 25,
      "inventoryWidth": 2,
      "inventoryHeight": 3,
      "requirements": {
          "level": 25,
          "strength": 0,
          "dexterity": 0,
          "intelligence": 73
      },
      "properties": {
          "energy_shield": {
              "max": 64,
              "min": 56
          },
          "movement_speed": -3
      },
      "implicits": [],
      "tags": [
          "int_armour",
          "body_armour",
          "armour",
          "default"
      ],
      "visualIdentity": {
          "ddsFile": "Art/2DItems/Armours/BodyArmours/BodyInt2B.dds",
          "id": "BodyInt2B"
      }
  },
  {
      "id": "Metadata/Items/Armours/BodyArmours/BodyDex5",
      "name": "Full Leather",
      "itemClass": "Body Armour",
      "dropLevel": 28,
      "inventoryWidth": 2,
      "inventoryHeight": 3,
      "requirements": {
          "level": 28,
          "strength": 0,
          "dexterity": 81,
          "intelligence": 0
      },
      "properties": {
          "evasion": {
              "max": 327,
              "min": 284
          },
          "movement_speed": -3
      },
      "implicits": [],
      "tags": [
          "dex_armour",
          "body_armour",
          "armour",
          "default"
      ],
      "visualIdentity": {
          "ddsFile": "Art/2DItems/Armours/BodyArmours/BodyDex1C.dds",
          "id": "BodyDex1C"
      }
  },
  {
      "id": "Metadata/Items/Armours/BodyArmours/BodyDexInt5",
      "name": "Scarlet Raiment",
      "itemClass": "Body Armour",
      "dropLevel": 28,
      "inventoryWidth": 2,
      "inventoryHeight": 3,
      "requirements": {
          "level": 28,
          "strength": 0,
          "dexterity": 43,
          "intelligence": 43
      },
      "properties": {
          "energy_shield": {
              "max": 39,
              "min": 34
          },
          "evasion": {
              "max": 180,
              "min": 156
          },
          "movement_speed": -3
      },
      "implicits": [],
      "tags": [
          "dex_int_armour",
          "body_armour",
          "armour",
          "default"
      ],
      "visualIdentity": {
          "ddsFile": "Art/2DItems/Armours/BodyArmours/BodyDexInt1C.dds",
          "id": "BodyDexInt1C"
      }
  },
  {
      "id": "Metadata/Items/Armours/BodyArmours/BodyInt5",
      "name": "Mage's Vestment",
      "itemClass": "Body Armour",
      "dropLevel": 28,
      "inventoryWidth": 2,
      "inventoryHeight": 3,
      "requirements": {
          "level": 28,
          "strength": 0,
          "dexterity": 0,
          "intelligence": 81
      },
      "properties": {
          "energy_shield": {
              "max": 69,
              "min": 62
          },
          "movement_speed": -3
      },
      "implicits": [],
      "tags": [
          "int_armour",
          "body_armour",
          "armour",
          "default"
      ],
      "visualIdentity": {
          "ddsFile": "Art/2DItems/Armours/BodyArmours/BodyInt1C.dds",
          "id": "BodyInt1C"
      }
  },
  {
      "id": "Metadata/Items/Armours/BodyArmours/BodyStr5",
      "name": "Full Plate",
      "itemClass": "Body Armour",
      "dropLevel": 28,
      "inventoryWidth": 2,
      "inventoryHeight": 3,
      "requirements": {
          "level": 28,
          "strength": 81,
          "dexterity": 0,
          "intelligence": 0
      },
      "properties": {
          "armour": {
              "max": 319,
              "min": 284
          },
          "movement_speed": -5
      },
      "implicits": [],
      "tags": [
          "str_armour",
          "body_armour",
          "armour",
          "default"
      ],
      "visualIdentity": {
          "ddsFile": "Art/2DItems/Armours/BodyArmours/BodyStr1C.dds",
          "id": "BodyStr1C"
      }
  },
  {
      "id": "Metadata/Items/Armours/BodyArmours/BodyStrDex5",
      "name": "Full Scale Armour",
      "itemClass": "Body Armour",
      "dropLevel": 28,
      "inventoryWidth": 2,
      "inventoryHeight": 3,
      "requirements": {
          "level": 28,
          "strength": 43,
          "dexterity": 43,
          "intelligence": 0
      },
      "properties": {
          "armour": {
              "max": 180,
              "min": 156
          },
          "evasion": {
              "max": 180,
              "min": 156
          },
          "movement_speed": -3
      },
      "implicits": [],
      "tags": [
          "str_dex_armour",
          "body_armour",
          "armour",
          "default"
      ],
      "visualIdentity": {
          "ddsFile": "Art/2DItems/Armours/BodyArmours/BodyStrDex1C.dds",
          "id": "BodyStrDex1C"
      }
  },
  {
      "id": "Metadata/Items/Armours/BodyArmours/BodyStrInt5",
      "name": "Full Ringmail",
      "itemClass": "Body Armour",
      "dropLevel": 28,
      "inventoryWidth": 2,
      "inventoryHeight": 3,
      "requirements": {
          "level": 28,
          "strength": 43,
          "dexterity": 0,
          "intelligence": 43
      },
      "properties": {
          "armour": {
              "max": 180,
              "min": 156
          },
          "energy_shield": {
              "max": 39,
              "min": 34
          },
          "movement_speed": -5
      },
      "implicits": [],
      "tags": [
          "str_int_armour",
          "body_armour",
          "armour",
          "default"
      ],
      "visualIdentity": {
          "ddsFile": "Art/2DItems/Armours/BodyArmours/BodyStrInt1C.dds",
          "id": "BodyStrInt1C"
      }
  },
  {
      "id": "Metadata/Items/Armours/BodyArmours/BodyDex6",
      "name": "Sun Leather",
      "itemClass": "Body Armour",
      "dropLevel": 32,
      "inventoryWidth": 2,
      "inventoryHeight": 3,
      "requirements": {
          "level": 32,
          "strength": 0,
          "dexterity": 91,
          "intelligence": 0
      },
      "properties": {
          "evasion": {
              "max": 382,
              "min": 324
          },
          "movement_speed": -3
      },
      "implicits": [],
      "tags": [
          "dex_armour",
          "body_armour",
          "armour",
          "default"
      ],
      "visualIdentity": {
          "ddsFile": "Art/2DItems/Armours/BodyArmours/BodyDex3C.dds",
          "id": "BodyDex3C"
      }
  },
  {
      "id": "Metadata/Items/Armours/BodyArmours/BodyDexInt6",
      "name": "Waxed Garb",
      "itemClass": "Body Armour",
      "dropLevel": 32,
      "inventoryWidth": 2,
      "inventoryHeight": 3,
      "requirements": {
          "level": 32,
          "strength": 0,
          "dexterity": 48,
          "intelligence": 48
      },
      "properties": {
          "energy_shield": {
              "max": 44,
              "min": 38
          },
          "evasion": {
              "max": 205,
              "min": 178
          },
          "movement_speed": -3
      },
      "implicits": [],
      "tags": [
          "dex_int_armour",
          "body_armour",
          "armour",
          "default"
      ],
      "visualIdentity": {
          "ddsFile": "Art/2DItems/Armours/BodyArmours/BodyDexInt2C.dds",
          "id": "BodyDexInt2C"
      }
  },
  {
      "id": "Metadata/Items/Armours/BodyArmours/BodyInt6",
      "name": "Silk Robe",
      "itemClass": "Body Armour",
      "dropLevel": 32,
      "inventoryWidth": 2,
      "inventoryHeight": 3,
      "requirements": {
          "level": 32,
          "strength": 0,
          "dexterity": 0,
          "intelligence": 91
      },
      "properties": {
          "energy_shield": {
              "max": 80,
              "min": 69
          },
          "movement_speed": -3
      },
      "implicits": [],
      "tags": [
          "int_armour",
          "body_armour",
          "armour",
          "default"
      ],
      "visualIdentity": {
          "ddsFile": "Art/2DItems/Armours/BodyArmours/BodyInt2C.dds",
          "id": "BodyInt2C"
      }
  },
  {
      "id": "Metadata/Items/Armours/BodyArmours/BodyStr6",
      "name": "Arena Plate",
      "itemClass": "Body Armour",
      "dropLevel": 32,
      "inventoryWidth": 2,
      "inventoryHeight": 3,
      "requirements": {
          "level": 32,
          "strength": 91,
          "dexterity": 0,
          "intelligence": 0
      },
      "properties": {
          "armour": {
              "max": 389,
              "min": 324
          },
          "movement_speed": -5
      },
      "implicits": [],
      "tags": [
          "str_armour",
          "body_armour",
          "armour",
          "default"
      ],
      "visualIdentity": {
          "ddsFile": "Art/2DItems/Armours/BodyArmours/BodyStr2C.dds",
          "id": "BodyStr2C"
      }
  },
  {
      "id": "Metadata/Items/Armours/BodyArmours/BodyStrDex6",
      "name": "Soldier's Brigandine",
      "itemClass": "Body Armour",
      "dropLevel": 32,
      "inventoryWidth": 2,
      "inventoryHeight": 3,
      "requirements": {
          "level": 32,
          "strength": 48,
          "dexterity": 48,
          "intelligence": 0
      },
      "properties": {
          "armour": {
              "max": 210,
              "min": 178
          },
          "evasion": {
              "max": 210,
              "min": 178
          },
          "movement_speed": -3
      },
      "implicits": [],
      "tags": [
          "str_dex_armour",
          "body_armour",
          "armour",
          "default"
      ],
      "visualIdentity": {
          "ddsFile": "Art/2DItems/Armours/BodyArmours/BodyStrDex2C.dds",
          "id": "BodyStrDex2C"
      }
  },
  {
      "id": "Metadata/Items/Armours/BodyArmours/BodyStrInt6",
      "name": "Full Chainmail",
      "itemClass": "Body Armour",
      "dropLevel": 32,
      "inventoryWidth": 2,
      "inventoryHeight": 3,
      "requirements": {
          "level": 32,
          "strength": 48,
          "dexterity": 0,
          "intelligence": 48
      },
      "properties": {
          "armour": {
              "max": 199,
              "min": 178
          },
          "energy_shield": {
              "max": 43,
              "min": 38
          },
          "movement_speed": -5
      },
      "implicits": [],
      "tags": [
          "str_int_armour",
          "body_armour",
          "armour",
          "default"
      ],
      "visualIdentity": {
          "ddsFile": "Art/2DItems/Armours/BodyArmours/BodyStrInt2C.dds",
          "id": "BodyStrInt2C"
      }
  },
  {
      "id": "Metadata/Items/Armours/BodyArmours/BodyDex7",
      "name": "Thief's Garb",
      "itemClass": "Body Armour",
      "dropLevel": 35,
      "inventoryWidth": 2,
      "inventoryHeight": 3,
      "requirements": {
          "level": 35,
          "strength": 0,
          "dexterity": 99,
          "intelligence": 0
      },
      "properties": {
          "evasion": {
              "max": 396,
              "min": 353
          },
          "movement_speed": -3
      },
      "implicits": [],
      "tags": [
          "dex_armour",
          "body_armour",
          "armour",
          "default"
      ],
      "visualIdentity": {
          "ddsFile": "Art/2DItems/Armours/BodyArmours/BodyDex2C.dds",
          "id": "BodyDex2C"
      }
  },
  {
      "id": "Metadata/Items/Armours/BodyArmours/BodyDexInt7",
      "name": "Bone Armour",
      "itemClass": "Body Armour",
      "dropLevel": 35,
      "inventoryWidth": 2,
      "inventoryHeight": 3,
      "requirements": {
          "level": 35,
          "strength": 0,
          "dexterity": 53,
          "intelligence": 53
      },
      "properties": {
          "energy_shield": {
              "max": 49,
              "min": 41
          },
          "evasion": {
              "max": 233,
              "min": 194
          },
          "movement_speed": -3
      },
      "implicits": [],
      "tags": [
          "dex_int_armour",
          "body_armour",
          "armour",
          "default"
      ],
      "visualIdentity": {
          "ddsFile": "Art/2DItems/Armours/BodyArmours/BodyDexInt4C.dds",
          "id": "BodyDexInt4C"
      }
  },
  {
      "id": "Metadata/Items/Armours/BodyArmours/BodyInt7",
      "name": "Cabalist Regalia",
      "itemClass": "Body Armour",
      "dropLevel": 35,
      "inventoryWidth": 2,
      "inventoryHeight": 3,
      "requirements": {
          "level": 35,
          "strength": 0,
          "dexterity": 0,
          "intelligence": 99
      },
      "properties": {
          "energy_shield": {
              "max": 88,
              "min": 75
          },
          "movement_speed": -3
      },
      "implicits": [],
      "tags": [
          "int_armour",
          "body_armour",
          "armour",
          "default"
      ],
      "visualIdentity": {
          "ddsFile": "Art/2DItems/Armours/BodyArmours/BodyStrDexInt1C.dds",
          "id": "BodyStrDexInt1C"
      }
  },
  {
      "id": "Metadata/Items/Armours/BodyArmours/BodyStr7",
      "name": "Lordly Plate",
      "itemClass": "Body Armour",
      "dropLevel": 35,
      "inventoryWidth": 2,
      "inventoryHeight": 3,
      "requirements": {
          "level": 35,
          "strength": 99,
          "dexterity": 0,
          "intelligence": 0
      },
      "properties": {
          "armour": {
              "max": 417,
              "min": 353
          },
          "movement_speed": -5
      },
      "implicits": [],
      "tags": [
          "str_armour",
          "body_armour",
          "armour",
          "default"
      ],
      "visualIdentity": {
          "ddsFile": "Art/2DItems/Armours/BodyArmours/BodyStr3C.dds",
          "id": "BodyStr3C"
      }
  },
  {
      "id": "Metadata/Items/Armours/BodyArmours/BodyStrDex7",
      "name": "Field Lamellar",
      "itemClass": "Body Armour",
      "dropLevel": 35,
      "inventoryWidth": 2,
      "inventoryHeight": 3,
      "requirements": {
          "level": 35,
          "strength": 53,
          "dexterity": 53,
          "intelligence": 0
      },
      "properties": {
          "armour": {
              "max": 223,
              "min": 194
          },
          "evasion": {
              "max": 223,
              "min": 194
          },
          "movement_speed": -3
      },
      "implicits": [],
      "tags": [
          "str_dex_armour",
          "body_armour",
          "armour",
          "default"
      ],
      "visualIdentity": {
          "ddsFile": "Art/2DItems/Armours/BodyArmours/BodyStr4A.dds",
          "id": "BodyStr4A"
      }
  },
  {
      "id": "Metadata/Items/Armours/BodyArmours/BodyStrInt7",
      "name": "Holy Chainmail",
      "itemClass": "Body Armour",
      "dropLevel": 35,
      "inventoryWidth": 2,
      "inventoryHeight": 3,
      "requirements": {
          "level": 35,
          "strength": 53,
          "dexterity": 0,
          "intelligence": 53
      },
      "properties": {
          "armour": {
              "max": 233,
              "min": 194
          },
          "energy_shield": {
              "max": 49,
              "min": 41
          },
          "movement_speed": -5
      },
      "implicits": [],
      "tags": [
          "str_int_armour",
          "body_armour",
          "armour",
          "default"
      ],
      "visualIdentity": {
          "ddsFile": "Art/2DItems/Armours/BodyArmours/BodyStrInt3C.dds",
          "id": "BodyStrInt3C"
      }
  },
  {
      "id": "Metadata/Items/Armours/BodyArmours/BodyDex8",
      "name": "Eelskin Tunic",
      "itemClass": "Body Armour",
      "dropLevel": 37,
      "inventoryWidth": 2,
      "inventoryHeight": 3,
      "requirements": {
          "level": 37,
          "strength": 0,
          "dexterity": 104,
          "intelligence": 0
      },
      "properties": {
          "evasion": {
              "max": 429,
              "min": 373
          },
          "movement_speed": -3
      },
      "implicits": [],
      "tags": [
          "dex_armour",
          "body_armour",
          "armour",
          "default"
      ],
      "visualIdentity": {
          "ddsFile": "Art/2DItems/Armours/BodyArmours/BodyDex1B.dds",
          "id": "BodyDex1B"
      }
  },
  {
      "id": "Metadata/Items/Armours/BodyArmours/BodyInt8",
      "name": "Sage's Robe",
      "itemClass": "Body Armour",
      "dropLevel": 37,
      "inventoryWidth": 2,
      "inventoryHeight": 3,
      "requirements": {
          "level": 37,
          "strength": 0,
          "dexterity": 0,
          "intelligence": 104
      },
      "properties": {
          "energy_shield": {
              "max": 90,
              "min": 79
          },
          "movement_speed": -3
      },
      "implicits": [],
      "tags": [
          "int_armour",
          "body_armour",
          "armour",
          "default"
      ],
      "visualIdentity": {
          "ddsFile": "Art/2DItems/Armours/BodyArmours/BodyInt1B.dds",
          "id": "BodyInt1B"
      }
  },
  {
      "id": "Metadata/Items/Armours/BodyArmours/BodyStr8",
      "name": "Bronze Plate",
      "itemClass": "Body Armour",
      "dropLevel": 37,
      "inventoryWidth": 2,
      "inventoryHeight": 3,
      "requirements": {
          "level": 37,
          "strength": 104,
          "dexterity": 0,
          "intelligence": 0
      },
      "properties": {
          "armour": {
              "max": 429,
              "min": 373
          },
          "movement_speed": -5
      },
      "implicits": [],
      "tags": [
          "str_armour",
          "body_armour",
          "armour",
          "default"
      ],
      "visualIdentity": {
          "ddsFile": "Art/2DItems/Armours/BodyArmours/BodyStr1B.dds",
          "id": "BodyStr1B"
      }
  },
  {
      "id": "Metadata/Items/Armours/BodyArmours/BodyStrDex8",
      "name": "Wyrmscale Doublet",
      "itemClass": "Body Armour",
      "dropLevel": 38,
      "inventoryWidth": 2,
      "inventoryHeight": 3,
      "requirements": {
          "level": 38,
          "strength": 57,
          "dexterity": 57,
          "intelligence": 0
      },
      "properties": {
          "armour": {
              "max": 236,
              "min": 210
          },
          "evasion": {
              "max": 236,
              "min": 210
          },
          "movement_speed": -3
      },
      "implicits": [],
      "tags": [
          "str_dex_armour",
          "body_armour",
          "armour",
          "default"
      ],
      "visualIdentity": {
          "ddsFile": "Art/2DItems/Armours/BodyArmours/BodyStrDex1B.dds",
          "id": "BodyStrDex1B"
      }
  },
  {
      "id": "Metadata/Items/Armours/BodyArmours/BodyStrInt8",
      "name": "Latticed Ringmail",
      "itemClass": "Body Armour",
      "dropLevel": 39,
      "inventoryWidth": 2,
      "inventoryHeight": 3,
      "requirements": {
          "level": 39,
          "strength": 59,
          "dexterity": 0,
          "intelligence": 59
      },
      "properties": {
          "armour": {
              "max": 248,
              "min": 216
          },
          "energy_shield": {
              "max": 52,
              "min": 45
          },
          "movement_speed": -5
      },
      "implicits": [],
      "tags": [
          "str_int_armour",
          "body_armour",
          "armour",
          "default"
      ],
      "visualIdentity": {
          "ddsFile": "Art/2DItems/Armours/BodyArmours/BodyStrInt1B.dds",
          "id": "BodyStrInt1B"
      }
  },
  {
      "id": "Metadata/Items/Armours/BodyArmours/BodyDexInt8",
      "name": "Quilted Jacket",
      "itemClass": "Body Armour",
      "dropLevel": 40,
      "inventoryWidth": 2,
      "inventoryHeight": 3,
      "requirements": {
          "level": 40,
          "strength": 0,
          "dexterity": 60,
          "intelligence": 60
      },
      "properties": {
          "energy_shield": {
              "max": 52,
              "min": 46
          },
          "evasion": {
              "max": 248,
              "min": 221
          },
          "movement_speed": -3
      },
      "implicits": [],
      "tags": [
          "dex_int_armour",
          "body_armour",
          "armour",
          "default"
      ],
      "visualIdentity": {
          "ddsFile": "Art/2DItems/Armours/BodyArmours/BodyDexInt1B.dds",
          "id": "BodyDexInt1B"
      }
  },
  {
      "id": "Metadata/Items/Armours/BodyArmours/BodyDex9",
      "name": "Frontier Leather",
      "itemClass": "Body Armour",
      "dropLevel": 41,
      "inventoryWidth": 2,
      "inventoryHeight": 3,
      "requirements": {
          "level": 41,
          "strength": 0,
          "dexterity": 114,
          "intelligence": 0
      },
      "properties": {
          "evasion": {
              "max": 495,
              "min": 412
          },
          "movement_speed": -3
      },
      "implicits": [],
      "tags": [
          "dex_armour",
          "body_armour",
          "armour",
          "default"
      ],
      "visualIdentity": {
          "ddsFile": "Art/2DItems/Armours/BodyArmours/BodyDex3B.dds",
          "id": "BodyDex3B"
      }
  },
  {
      "id": "Metadata/Items/Armours/BodyArmours/BodyInt9",
      "name": "Silken Wrap",
      "itemClass": "Body Armour",
      "dropLevel": 41,
      "inventoryWidth": 2,
      "inventoryHeight": 3,
      "requirements": {
          "level": 41,
          "strength": 0,
          "dexterity": 0,
          "intelligence": 114
      },
      "properties": {
          "energy_shield": {
              "max": 104,
              "min": 86
          },
          "movement_speed": -3
      },
      "implicits": [],
      "tags": [
          "int_armour",
          "body_armour",
          "armour",
          "default"
      ],
      "visualIdentity": {
          "ddsFile": "Art/2DItems/Armours/BodyArmours/BodyInt2B.dds",
          "id": "BodyInt2B"
      }
  },
  {
      "id": "Metadata/Items/Armours/BodyArmours/BodyStr9",
      "name": "Battle Plate",
      "itemClass": "Body Armour",
      "dropLevel": 41,
      "inventoryWidth": 2,
      "inventoryHeight": 3,
      "requirements": {
          "level": 41,
          "strength": 114,
          "dexterity": 0,
          "intelligence": 0
      },
      "properties": {
          "armour": {
              "max": 474,
              "min": 412
          },
          "movement_speed": -5
      },
      "implicits": [],
      "tags": [
          "str_armour",
          "body_armour",
          "armour",
          "default"
      ],
      "visualIdentity": {
          "ddsFile": "Art/2DItems/Armours/BodyArmours/BodyStr2B.dds",
          "id": "BodyStr2B"
      }
  },
  {
      "id": "Metadata/Items/Armours/BodyArmours/BodyStrDex9",
      "name": "Hussar Brigandine",
      "itemClass": "Body Armour",
      "dropLevel": 42,
      "inventoryWidth": 2,
      "inventoryHeight": 3,
      "requirements": {
          "level": 42,
          "strength": 62,
          "dexterity": 62,
          "intelligence": 0
      },
      "properties": {
          "armour": {
              "max": 278,
              "min": 232
          },
          "evasion": {
              "max": 278,
              "min": 232
          },
          "movement_speed": -3
      },
      "implicits": [],
      "tags": [
          "str_dex_armour",
          "body_armour",
          "armour",
          "default"
      ],
      "visualIdentity": {
          "ddsFile": "Art/2DItems/Armours/BodyArmours/BodyStrDex2B.dds",
          "id": "BodyStrDex2B"
      }
  },
  {
      "id": "Metadata/Items/Armours/BodyArmours/BodyStrInt9",
      "name": "Crusader Chainmail",
      "itemClass": "Body Armour",
      "dropLevel": 43,
      "inventoryWidth": 2,
      "inventoryHeight": 3,
      "requirements": {
          "level": 43,
          "strength": 64,
          "dexterity": 0,
          "intelligence": 64
      },
      "properties": {
          "armour": {
              "max": 266,
              "min": 237
          },
          "energy_shield": {
              "max": 55,
              "min": 50
          },
          "movement_speed": -5
      },
      "implicits": [],
      "tags": [
          "str_int_armour",
          "body_armour",
          "armour",
          "default"
      ],
      "visualIdentity": {
          "ddsFile": "Art/2DItems/Armours/BodyArmours/BodyStrInt2B.dds",
          "id": "BodyStrInt2B"
      }
  },
  {
      "id": "Metadata/Items/Armours/BodyArmours/BodyDexInt9",
      "name": "Sleek Coat",
      "itemClass": "Body Armour",
      "dropLevel": 44,
      "inventoryWidth": 2,
      "inventoryHeight": 3,
      "requirements": {
          "level": 44,
          "strength": 0,
          "dexterity": 65,
          "intelligence": 65
      },
      "properties": {
          "energy_shield": {
              "max": 60,
              "min": 51
          },
          "evasion": {
              "max": 287,
              "min": 243
          },
          "movement_speed": -3
      },
      "implicits": [],
      "tags": [
          "dex_int_armour",
          "body_armour",
          "armour",
          "default"
      ],
      "visualIdentity": {
          "ddsFile": "Art/2DItems/Armours/BodyArmours/BodyDexInt2B.dds",
          "id": "BodyDexInt2B"
      }
  },
  {
      "id": "Metadata/Items/Armours/BodyArmours/BodyDex10",
      "name": "Glorious Leather",
      "itemClass": "Body Armour",
      "dropLevel": 45,
      "inventoryWidth": 2,
      "inventoryHeight": 3,
      "requirements": {
          "level": 45,
          "strength": 0,
          "dexterity": 124,
          "intelligence": 0
      },
      "properties": {
          "evasion": {
              "max": 519,
              "min": 451
          },
          "movement_speed": -3
      },
      "implicits": [],
      "tags": [
          "dex_armour",
          "body_armour",
          "armour",
          "default"
      ],
      "visualIdentity": {
          "ddsFile": "Art/2DItems/Armours/BodyArmours/BodyDex1C.dds",
          "id": "BodyDex1C"
      }
  },
  {
      "id": "Metadata/Items/Armours/BodyArmours/BodyInt10",
      "name": "Conjurer's Vestment",
      "itemClass": "Body Armour",
      "dropLevel": 45,
      "inventoryWidth": 2,
      "inventoryHeight": 3,
      "requirements": {
          "level": 45,
          "strength": 0,
          "dexterity": 0,
          "intelligence": 124
      },
      "properties": {
          "energy_shield": {
              "max": 105,
              "min": 94
          },
          "movement_speed": -3
      },
      "implicits": [],
      "tags": [
          "int_armour",
          "body_armour",
          "armour",
          "default"
      ],
      "visualIdentity": {
          "ddsFile": "Art/2DItems/Armours/BodyArmours/BodyInt1C.dds",
          "id": "BodyInt1C"
      }
  },
  {
      "id": "Metadata/Items/Armours/BodyArmours/BodyStr10",
      "name": "Sun Plate",
      "itemClass": "Body Armour",
      "dropLevel": 45,
      "inventoryWidth": 2,
      "inventoryHeight": 3,
      "requirements": {
          "level": 45,
          "strength": 124,
          "dexterity": 0,
          "intelligence": 0
      },
      "properties": {
          "armour": {
              "max": 506,
              "min": 451
          },
          "movement_speed": -5
      },
      "implicits": [],
      "tags": [
          "str_armour",
          "body_armour",
          "armour",
          "default"
      ],
      "visualIdentity": {
          "ddsFile": "Art/2DItems/Armours/BodyArmours/BodyStr1C.dds",
          "id": "BodyStr1C"
      }
  },
  {
      "id": "Metadata/Items/Armours/BodyArmours/BodyStrDex10",
      "name": "Full Wyrmscale",
      "itemClass": "Body Armour",
      "dropLevel": 46,
      "inventoryWidth": 2,
      "inventoryHeight": 3,
      "requirements": {
          "level": 46,
          "strength": 68,
          "dexterity": 68,
          "intelligence": 0
      },
      "properties": {
          "armour": {
              "max": 292,
              "min": 254
          },
          "evasion": {
              "max": 292,
              "min": 254
          },
          "movement_speed": -3
      },
      "implicits": [],
      "tags": [
          "str_dex_armour",
          "body_armour",
          "armour",
          "default"
      ],
      "visualIdentity": {
          "ddsFile": "Art/2DItems/Armours/BodyArmours/BodyStrDex1C.dds",
          "id": "BodyStrDex1C"
      }
  },
  {
      "id": "Metadata/Items/Armours/BodyArmours/BodyStrInt10",
      "name": "Ornate Ringmail",
      "itemClass": "Body Armour",
      "dropLevel": 47,
      "inventoryWidth": 2,
      "inventoryHeight": 3,
      "requirements": {
          "level": 47,
          "strength": 69,
          "dexterity": 0,
          "intelligence": 69
      },
      "properties": {
          "armour": {
              "max": 298,
              "min": 259
          },
          "energy_shield": {
              "max": 62,
              "min": 54
          },
          "movement_speed": -5
      },
      "implicits": [],
      "tags": [
          "str_int_armour",
          "body_armour",
          "armour",
          "default"
      ],
      "visualIdentity": {
          "ddsFile": "Art/2DItems/Armours/BodyArmours/BodyStrInt1C.dds",
          "id": "BodyStrInt1C"
      }
  },
  {
      "id": "Metadata/Items/Armours/BodyArmours/BodyDexInt10",
      "name": "Crimson Raiment",
      "itemClass": "Body Armour",
      "dropLevel": 48,
      "inventoryWidth": 2,
      "inventoryHeight": 3,
      "requirements": {
          "level": 48,
          "strength": 0,
          "dexterity": 71,
          "intelligence": 71
      },
      "properties": {
          "energy_shield": {
              "max": 63,
              "min": 55
          },
          "evasion": {
              "max": 304,
              "min": 264
          },
          "movement_speed": -3
      },
      "implicits": [],
      "tags": [
          "dex_int_armour",
          "body_armour",
          "armour",
          "default"
      ],
      "visualIdentity": {
          "ddsFile": "Art/2DItems/Armours/BodyArmours/BodyDexInt1C.dds",
          "id": "BodyDexInt1C"
      }
  },
  {
      "id": "Metadata/Items/Armours/BodyArmours/BodyDex11",
      "name": "Coronal Leather",
      "itemClass": "Body Armour",
      "dropLevel": 49,
      "inventoryWidth": 2,
      "inventoryHeight": 3,
      "requirements": {
          "level": 49,
          "strength": 0,
          "dexterity": 134,
          "intelligence": 0
      },
      "properties": {
          "evasion": {
              "max": 579,
              "min": 491
          },
          "movement_speed": -3
      },
      "implicits": [],
      "tags": [
          "dex_armour",
          "body_armour",
          "armour",
          "default"
      ],
      "visualIdentity": {
          "ddsFile": "Art/2DItems/Armours/BodyArmours/BodyDex3C.dds",
          "id": "BodyDex3C"
      }
  },
  {
      "id": "Metadata/Items/Armours/BodyArmours/BodyInt11",
      "name": "Spidersilk Robe",
      "itemClass": "Body Armour",
      "dropLevel": 49,
      "inventoryWidth": 2,
      "inventoryHeight": 3,
      "requirements": {
          "level": 49,
          "strength": 0,
          "dexterity": 0,
          "intelligence": 134
      },
      "properties": {
          "energy_shield": {
              "max": 117,
              "min": 101
          },
          "movement_speed": -3
      },
      "implicits": [],
      "tags": [
          "int_armour",
          "body_armour",
          "armour",
          "default"
      ],
      "visualIdentity": {
          "ddsFile": "Art/2DItems/Armours/BodyArmours/BodyInt2C.dds",
          "id": "BodyInt2C"
      }
  },
  {
      "id": "Metadata/Items/Armours/BodyArmours/BodyStr11",
      "name": "Colosseum Plate",
      "itemClass": "Body Armour",
      "dropLevel": 49,
      "inventoryWidth": 2,
      "inventoryHeight": 3,
      "requirements": {
          "level": 49,
          "strength": 134,
          "dexterity": 0,
          "intelligence": 0
      },
      "properties": {
          "armour": {
              "max": 589,
              "min": 491
          },
          "movement_speed": -5
      },
      "implicits": [],
      "tags": [
          "str_armour",
          "body_armour",
          "armour",
          "default"
      ],
      "visualIdentity": {
          "ddsFile": "Art/2DItems/Armours/BodyArmours/BodyStr2C.dds",
          "id": "BodyStr2C"
      }
  },
  {
      "id": "Metadata/Items/Armours/BodyArmours/BodyStrDex11",
      "name": "Commander's Brigandine",
      "itemClass": "Body Armour",
      "dropLevel": 50,
      "inventoryWidth": 2,
      "inventoryHeight": 3,
      "requirements": {
          "level": 50,
          "strength": 73,
          "dexterity": 73,
          "intelligence": 0
      },
      "properties": {
          "armour": {
              "max": 325,
              "min": 275
          },
          "evasion": {
              "max": 325,
              "min": 275
          },
          "movement_speed": -3
      },
      "implicits": [],
      "tags": [
          "str_dex_armour",
          "body_armour",
          "armour",
          "default"
      ],
      "visualIdentity": {
          "ddsFile": "Art/2DItems/Armours/BodyArmours/BodyStrDex2C.dds",
          "id": "BodyStrDex2C"
      }
  },
  {
      "id": "Metadata/Items/Armours/BodyArmours/BodyStrInt11",
      "name": "Chain Hauberk",
      "itemClass": "Body Armour",
      "dropLevel": 51,
      "inventoryWidth": 2,
      "inventoryHeight": 3,
      "requirements": {
          "level": 51,
          "strength": 75,
          "dexterity": 0,
          "intelligence": 75
      },
      "properties": {
          "armour": {
              "max": 314,
              "min": 281
          },
          "energy_shield": {
              "max": 65,
              "min": 58
          },
          "movement_speed": -5
      },
      "implicits": [],
      "tags": [
          "str_int_armour",
          "body_armour",
          "armour",
          "default"
      ],
      "visualIdentity": {
          "ddsFile": "Art/2DItems/Armours/BodyArmours/BodyStrInt2C.dds",
          "id": "BodyStrInt2C"
      }
  },
  {
      "id": "Metadata/Items/Armours/BodyArmours/BodyDexInt11",
      "name": "Lacquered Garb",
      "itemClass": "Body Armour",
      "dropLevel": 52,
      "inventoryWidth": 2,
      "inventoryHeight": 3,
      "requirements": {
          "level": 52,
          "strength": 0,
          "dexterity": 76,
          "intelligence": 76
      },
      "properties": {
          "energy_shield": {
              "max": 68,
              "min": 59
          },
          "evasion": {
              "max": 329,
              "min": 286
          },
          "movement_speed": -3
      },
      "implicits": [],
      "tags": [
          "dex_int_armour",
          "body_armour",
          "armour",
          "default"
      ],
      "visualIdentity": {
          "ddsFile": "Art/2DItems/Armours/BodyArmours/BodyDexInt2C.dds",
          "id": "BodyDexInt2C"
      }
  },
  {
      "id": "Metadata/Items/Armours/BodyArmours/BodyDex12",
      "name": "Cutthroat's Garb",
      "itemClass": "Body Armour",
      "dropLevel": 53,
      "inventoryWidth": 2,
      "inventoryHeight": 3,
      "requirements": {
          "level": 53,
          "strength": 0,
          "dexterity": 145,
          "intelligence": 0
      },
      "properties": {
          "evasion": {
              "max": 594,
              "min": 530
          },
          "movement_speed": -3
      },
      "implicits": [],
      "tags": [
          "dex_armour",
          "body_armour",
          "armour",
          "default"
      ],
      "visualIdentity": {
          "ddsFile": "Art/2DItems/Armours/BodyArmours/BodyDex2C.dds",
          "id": "BodyDex2C"
      }
  },
  {
      "id": "Metadata/Items/Armours/BodyArmours/BodyInt12",
      "name": "Destroyer Regalia",
      "itemClass": "Body Armour",
      "dropLevel": 53,
      "inventoryWidth": 2,
      "inventoryHeight": 3,
      "requirements": {
          "level": 53,
          "strength": 0,
          "dexterity": 0,
          "intelligence": 145
      },
      "properties": {
          "energy_shield": {
              "max": 129,
              "min": 109
          },
          "movement_speed": -3
      },
      "implicits": [],
      "tags": [
          "int_armour",
          "body_armour",
          "armour",
          "default"
      ],
      "visualIdentity": {
          "ddsFile": "Art/2DItems/Armours/BodyArmours/BodyStrDexInt1C.dds",
          "id": "BodyStrDexInt1C"
      }
  },
  {
      "id": "Metadata/Items/Armours/BodyArmours/BodyStr12",
      "name": "Majestic Plate",
      "itemClass": "Body Armour",
      "dropLevel": 53,
      "inventoryWidth": 2,
      "inventoryHeight": 3,
      "requirements": {
          "level": 53,
          "strength": 145,
          "dexterity": 0,
          "intelligence": 0
      },
      "properties": {
          "armour": {
              "max": 625,
              "min": 530
          },
          "movement_speed": -5
      },
      "implicits": [],
      "tags": [
          "str_armour",
          "body_armour",
          "armour",
          "default"
      ],
      "visualIdentity": {
          "ddsFile": "Art/2DItems/Armours/BodyArmours/BodyStr3C.dds",
          "id": "BodyStr3C"
      }
  },
  {
      "id": "Metadata/Items/Armours/BodyArmours/BodyStrDex12",
      "name": "Battle Lamellar",
      "itemClass": "Body Armour",
      "dropLevel": 54,
      "inventoryWidth": 2,
      "inventoryHeight": 3,
      "requirements": {
          "level": 54,
          "strength": 79,
          "dexterity": 79,
          "intelligence": 0
      },
      "properties": {
          "armour": {
              "max": 341,
              "min": 297
          },
          "evasion": {
              "max": 341,
              "min": 297
          },
          "movement_speed": -3
      },
      "implicits": [],
      "tags": [
          "str_dex_armour",
          "body_armour",
          "armour",
          "default"
      ],
      "visualIdentity": {
          "ddsFile": "Art/2DItems/Armours/BodyArmours/BodyStr4A.dds",
          "id": "BodyStr4A"
      }
  },
  {
      "id": "Metadata/Items/Armours/BodyArmours/BodyStrInt12",
      "name": "Devout Chainmail",
      "itemClass": "Body Armour",
      "dropLevel": 55,
      "inventoryWidth": 2,
      "inventoryHeight": 3,
      "requirements": {
          "level": 55,
          "strength": 80,
          "dexterity": 0,
          "intelligence": 80
      },
      "properties": {
          "armour": {
              "max": 363,
              "min": 302
          },
          "energy_shield": {
              "max": 74,
              "min": 62
          },
          "movement_speed": -5
      },
      "implicits": [],
      "tags": [
          "str_int_armour",
          "body_armour",
          "armour",
          "default"
      ],
      "visualIdentity": {
          "ddsFile": "Art/2DItems/Armours/BodyArmours/BodyStrInt3C.dds",
          "id": "BodyStrInt3C"
      }
  },
  {
      "id": "Metadata/Items/Armours/BodyArmours/BodyDex13",
      "name": "Sharkskin Tunic",
      "itemClass": "Body Armour",
      "dropLevel": 56,
      "inventoryWidth": 2,
      "inventoryHeight": 3,
      "requirements": {
          "level": 56,
          "strength": 0,
          "dexterity": 152,
          "intelligence": 0
      },
      "properties": {
          "evasion": {
              "max": 643,
              "min": 559
          },
          "movement_speed": -3
      },
      "implicits": [],
      "tags": [
          "dex_armour",
          "body_armour",
          "armour",
          "default"
      ],
      "visualIdentity": {
          "ddsFile": "Art/2DItems/Armours/BodyArmours/BodyDex1B.dds",
          "id": "BodyDex1B"
      }
  },
  {
      "id": "Metadata/Items/Armours/BodyArmours/BodyDexInt12",
      "name": "Crypt Armour",
      "itemClass": "Body Armour",
      "dropLevel": 56,
      "inventoryWidth": 2,
      "inventoryHeight": 3,
      "requirements": {
          "level": 56,
          "strength": 0,
          "dexterity": 82,
          "intelligence": 82
      },
      "properties": {
          "energy_shield": {
              "max": 76,
              "min": 63
          },
          "evasion": {
              "max": 369,
              "min": 308
          },
          "movement_speed": -3
      },
      "implicits": [],
      "tags": [
          "dex_int_armour",
          "body_armour",
          "armour",
          "default"
      ],
      "visualIdentity": {
          "ddsFile": "Art/2DItems/Armours/BodyArmours/BodyDexInt4C.dds",
          "id": "BodyDexInt4C"
      }
  },
  {
      "id": "Metadata/Items/Armours/BodyArmours/BodyInt13",
      "name": "Savant's Robe",
      "itemClass": "Body Armour",
      "dropLevel": 56,
      "inventoryWidth": 2,
      "inventoryHeight": 3,
      "requirements": {
          "level": 56,
          "strength": 0,
          "dexterity": 0,
          "intelligence": 152
      },
      "properties": {
          "energy_shield": {
              "max": 132,
              "min": 115
          },
          "movement_speed": -3
      },
      "implicits": [],
      "tags": [
          "int_armour",
          "body_armour",
          "armour",
          "default"
      ],
      "visualIdentity": {
          "ddsFile": "Art/2DItems/Armours/BodyArmours/BodyInt1B.dds",
          "id": "BodyInt1B"
      }
  },
  {
      "id": "Metadata/Items/Armours/BodyArmours/BodyStr13",
      "name": "Golden Plate",
      "itemClass": "Body Armour",
      "dropLevel": 56,
      "inventoryWidth": 2,
      "inventoryHeight": 3,
      "requirements": {
          "level": 56,
          "strength": 152,
          "dexterity": 0,
          "intelligence": 0
      },
      "properties": {
          "armour": {
              "max": 643,
              "min": 559
          },
          "movement_speed": -5
      },
      "implicits": [],
      "tags": [
          "str_armour",
          "body_armour",
          "armour",
          "default"
      ],
      "visualIdentity": {
          "ddsFile": "Art/2DItems/Armours/BodyArmours/BodyStr1B.dds",
          "id": "BodyStr1B"
      }
  },
  {
      "id": "Metadata/Items/Armours/BodyArmours/BodyStrDex13",
      "name": "Dragonscale Doublet",
      "itemClass": "Body Armour",
      "dropLevel": 57,
      "inventoryWidth": 2,
      "inventoryHeight": 3,
      "requirements": {
          "level": 57,
          "strength": 83,
          "dexterity": 83,
          "intelligence": 0
      },
      "properties": {
          "armour": {
              "max": 351,
              "min": 313
          },
          "evasion": {
              "max": 351,
              "min": 313
          },
          "movement_speed": -3
      },
      "implicits": [],
      "tags": [
          "str_dex_armour",
          "body_armour",
          "armour",
          "default"
      ],
      "visualIdentity": {
          "ddsFile": "Art/2DItems/Armours/BodyArmours/BodyStrDex1B.dds",
          "id": "BodyStrDex1B"
      }
  },
  {
      "id": "Metadata/Items/Armours/BodyArmours/BodyStrInt13",
      "name": "Loricated Ringmail",
      "itemClass": "Body Armour",
      "dropLevel": 58,
      "inventoryWidth": 2,
      "inventoryHeight": 3,
      "requirements": {
          "level": 58,
          "strength": 84,
          "dexterity": 0,
          "intelligence": 84
      },
      "properties": {
          "armour": {
              "max": 374,
              "min": 325
          },
          "energy_shield": {
              "max": 76,
              "min": 66
          },
          "movement_speed": -5
      },
      "implicits": [],
      "tags": [
          "str_int_armour",
          "body_armour",
          "armour",
          "default"
      ],
      "visualIdentity": {
          "ddsFile": "Art/2DItems/Armours/BodyArmours/BodyStrInt1B.dds",
          "id": "BodyStrInt1B"
      }
  },
  {
      "id": "Metadata/Items/Armours/BodyArmours/BodyDex14",
      "name": "Destiny Leather",
      "itemClass": "Body Armour",
      "dropLevel": 59,
      "inventoryWidth": 2,
      "inventoryHeight": 3,
      "requirements": {
          "level": 59,
          "strength": 0,
          "dexterity": 160,
          "intelligence": 0
      },
      "properties": {
          "evasion": {
              "max": 721,
              "min": 601
          },
          "movement_speed": -3
      },
      "implicits": [],
      "tags": [
          "dex_armour",
          "body_armour",
          "armour",
          "default"
      ],
      "visualIdentity": {
          "ddsFile": "Art/2DItems/Armours/BodyArmours/BodyDex3B.dds",
          "id": "BodyDex3B"
      }
  },
  {
      "id": "Metadata/Items/Armours/BodyArmours/BodyDexInt13",
      "name": "Sentinel Jacket",
      "itemClass": "Body Armour",
      "dropLevel": 59,
      "inventoryWidth": 2,
      "inventoryHeight": 3,
      "requirements": {
          "level": 59,
          "strength": 0,
          "dexterity": 86,
          "intelligence": 86
      },
      "properties": {
          "energy_shield": {
              "max": 76,
              "min": 67
          },
          "evasion": {
              "max": 370,
              "min": 330
          },
          "movement_speed": -3
      },
      "implicits": [],
      "tags": [
          "dex_int_armour",
          "body_armour",
          "armour",
          "default"
      ],
      "visualIdentity": {
          "ddsFile": "Art/2DItems/Armours/BodyArmours/BodyDexInt1B.dds",
          "id": "BodyDexInt1B"
      }
  },
  {
      "id": "Metadata/Items/Armours/BodyArmours/BodyInt14",
      "name": "Necromancer Silks",
      "itemClass": "Body Armour",
      "dropLevel": 59,
      "inventoryWidth": 2,
      "inventoryHeight": 3,
      "requirements": {
          "level": 59,
          "strength": 0,
          "dexterity": 0,
          "intelligence": 160
      },
      "properties": {
          "energy_shield": {
              "max": 147,
              "min": 123
          },
          "movement_speed": -3
      },
      "implicits": [],
      "tags": [
          "int_armour",
          "body_armour",
          "armour",
          "default"
      ],
      "visualIdentity": {
          "ddsFile": "Art/2DItems/Armours/BodyArmours/BodyInt2B.dds",
          "id": "BodyInt2B"
      }
  },
  {
      "id": "Metadata/Items/Armours/BodyArmours/BodyStr14",
      "name": "Crusader Plate",
      "itemClass": "Body Armour",
      "dropLevel": 59,
      "inventoryWidth": 2,
      "inventoryHeight": 3,
      "requirements": {
          "level": 59,
          "strength": 160,
          "dexterity": 0,
          "intelligence": 0
      },
      "properties": {
          "armour": {
              "max": 691,
              "min": 601
          },
          "movement_speed": -5
      },
      "implicits": [],
      "tags": [
          "str_armour",
          "body_armour",
          "armour",
          "default"
      ],
      "visualIdentity": {
          "ddsFile": "Art/2DItems/Armours/BodyArmours/BodyStr2B.dds",
          "id": "BodyStr2B"
      }
  },
  {
      "id": "Metadata/Items/Armours/BodyArmours/BodyStrDex14",
      "name": "Desert Brigandine",
      "itemClass": "Body Armour",
      "dropLevel": 60,
      "inventoryWidth": 2,
      "inventoryHeight": 3,
      "requirements": {
          "level": 60,
          "strength": 96,
          "dexterity": 96,
          "intelligence": 0
      },
      "properties": {
          "armour": {
              "max": 451,
              "min": 376
          },
          "evasion": {
              "max": 451,
              "min": 376
          },
          "movement_speed": -3
      },
      "implicits": [],
      "tags": [
          "str_dex_armour",
          "body_armour",
          "armour",
          "default"
      ],
      "visualIdentity": {
          "ddsFile": "Art/2DItems/Armours/BodyArmours/BodyStrDex2B.dds",
          "id": "BodyStrDex2B"
      }
  },
  {
      "id": "Metadata/Items/Armours/BodyArmours/BodyStrInt14",
      "name": "Conquest Chainmail",
      "itemClass": "Body Armour",
      "dropLevel": 61,
      "inventoryWidth": 2,
      "inventoryHeight": 3,
      "requirements": {
          "level": 61,
          "strength": 96,
          "dexterity": 0,
          "intelligence": 96
      },
      "properties": {
          "armour": {
              "max": 445,
              "min": 387
          },
          "energy_shield": {
              "max": 91,
              "min": 79
          },
          "movement_speed": -5
      },
      "implicits": [],
      "tags": [
          "str_int_armour",
          "body_armour",
          "armour",
          "default"
      ],
      "visualIdentity": {
          "ddsFile": "Art/2DItems/Armours/BodyArmours/BodyStrInt2B.dds",
          "id": "BodyStrInt2B"
      }
  },
  {
      "id": "Metadata/Items/Armours/BodyArmours/BodyDex15",
      "name": "Exquisite Leather",
      "itemClass": "Body Armour",
      "dropLevel": 62,
      "inventoryWidth": 2,
      "inventoryHeight": 3,
      "requirements": {
          "level": 62,
          "strength": 0,
          "dexterity": 170,
          "intelligence": 0
      },
      "properties": {
          "evasion": {
              "max": 810,
              "min": 704
          },
          "movement_speed": -3
      },
      "implicits": [],
      "tags": [
          "dex_armour",
          "body_armour",
          "armour",
          "default"
      ],
      "visualIdentity": {
          "ddsFile": "Art/2DItems/Armours/BodyArmours/BodyDex1C.dds",
          "id": "BodyDex1C"
      }
  },
  {
      "id": "Metadata/Items/Armours/BodyArmours/BodyDexInt14",
      "name": "Varnished Coat",
      "itemClass": "Body Armour",
      "dropLevel": 62,
      "inventoryWidth": 2,
      "inventoryHeight": 3,
      "requirements": {
          "level": 62,
          "strength": 0,
          "dexterity": 96,
          "intelligence": 96
      },
      "properties": {
          "energy_shield": {
              "max": 89,
              "min": 79
          },
          "evasion": {
              "max": 434,
              "min": 387
          },
          "movement_speed": -3
      },
      "implicits": [],
      "tags": [
          "dex_int_armour",
          "body_armour",
          "armour",
          "default"
      ],
      "visualIdentity": {
          "ddsFile": "Art/2DItems/Armours/BodyArmours/BodyDexInt2B.dds",
          "id": "BodyDexInt2B"
      }
  },
  {
      "id": "Metadata/Items/Armours/BodyArmours/BodyInt15",
      "name": "Occultist's Vestment",
      "itemClass": "Body Armour",
      "dropLevel": 62,
      "inventoryWidth": 2,
      "inventoryHeight": 3,
      "requirements": {
          "level": 62,
          "strength": 0,
          "dexterity": 0,
          "intelligence": 180
      },
      "properties": {
          "energy_shield": {
              "max": 151,
              "min": 137
          },
          "movement_speed": -3
      },
      "implicits": [
          "SpellDamageImplicitArmour1"
      ],
      "tags": [
          "int_armour",
          "body_armour",
          "armour",
          "default"
      ],
      "visualIdentity": {
          "ddsFile": "Art/2DItems/Armours/BodyArmours/BodyInt1C.dds",
          "id": "BodyInt1C"
      }
  },
  {
      "id": "Metadata/Items/Armours/BodyArmours/BodyStr15",
      "name": "Astral Plate",
      "itemClass": "Body Armour",
      "dropLevel": 62,
      "inventoryWidth": 2,
      "inventoryHeight": 3,
      "requirements": {
          "level": 62,
          "strength": 180,
          "dexterity": 0,
          "intelligence": 0
      },
      "properties": {
          "armour": {
              "max": 782,
              "min": 711
          },
          "movement_speed": -5
      },
      "implicits": [
          "AllResistancesImplicitArmour1"
      ],
      "tags": [
          "str_armour",
          "body_armour",
          "armour",
          "default"
      ],
      "visualIdentity": {
          "ddsFile": "Art/2DItems/Armours/BodyArmours/BodyStr1C.dds",
          "id": "BodyStr1C"
      }
  },
  {
      "id": "Metadata/Items/Armours/BodyArmours/BodyStrDex15",
      "name": "Full Dragonscale",
      "itemClass": "Body Armour",
      "dropLevel": 63,
      "inventoryWidth": 2,
      "inventoryHeight": 3,
      "requirements": {
          "level": 63,
          "strength": 115,
          "dexterity": 94,
          "intelligence": 0
      },
      "properties": {
          "armour": {
              "max": 541,
              "min": 470
          },
          "evasion": {
              "max": 429,
              "min": 373
          },
          "movement_speed": -3
      },
      "implicits": [],
      "tags": [
          "str_dex_armour",
          "body_armour",
          "armour",
          "default"
      ],
      "visualIdentity": {
          "ddsFile": "Art/2DItems/Armours/BodyArmours/BodyStrDex1C.dds",
          "id": "BodyStrDex1C"
      }
  },
  {
      "id": "Metadata/Items/Armours/BodyArmours/BodyStrInt15",
      "name": "Elegant Ringmail",
      "itemClass": "Body Armour",
      "dropLevel": 64,
      "inventoryWidth": 2,
      "inventoryHeight": 3,
      "requirements": {
          "level": 64,
          "strength": 90,
          "dexterity": 0,
          "intelligence": 105
      },
      "properties": {
          "armour": {
              "max": 433,
              "min": 377
          },
          "energy_shield": {
              "max": 105,
              "min": 92
          },
          "movement_speed": -5
      },
      "implicits": [],
      "tags": [
          "str_int_armour",
          "body_armour",
          "armour",
          "default"
      ],
      "visualIdentity": {
          "ddsFile": "Art/2DItems/Armours/BodyArmours/BodyStrInt1C.dds",
          "id": "BodyStrInt1C"
      }
  },
  {
      "id": "Metadata/Items/Armours/BodyArmours/BodyDex16",
      "name": "Zodiac Leather",
      "itemClass": "Body Armour",
      "dropLevel": 65,
      "inventoryWidth": 2,
      "inventoryHeight": 3,
      "requirements": {
          "level": 65,
          "strength": 0,
          "dexterity": 197,
          "intelligence": 0
      },
      "properties": {
          "evasion": {
              "max": 982,
              "min": 854
          },
          "movement_speed": -3
      },
      "implicits": [],
      "tags": [
          "dex_armour",
          "body_armour",
          "armour",
          "default"
      ],
      "visualIdentity": {
          "ddsFile": "Art/2DItems/Armours/BodyArmours/BodyDex3C.dds",
          "id": "BodyDex3C"
      }
  },
  {
      "id": "Metadata/Items/Armours/BodyArmours/BodyDexInt15",
      "name": "Blood Raiment",
      "itemClass": "Body Armour",
      "dropLevel": 65,
      "inventoryWidth": 2,
      "inventoryHeight": 3,
      "requirements": {
          "level": 65,
          "strength": 0,
          "dexterity": 107,
          "intelligence": 90
      },
      "properties": {
          "energy_shield": {
              "max": 84,
              "min": 73
          },
          "evasion": {
              "max": 501,
              "min": 436
          },
          "movement_speed": -3
      },
      "implicits": [],
      "tags": [
          "dex_int_armour",
          "body_armour",
          "armour",
          "default"
      ],
      "visualIdentity": {
          "ddsFile": "Art/2DItems/Armours/BodyArmours/BodyDexInt1C.dds",
          "id": "BodyDexInt1C"
      }
  },
  {
      "id": "Metadata/Items/Armours/BodyArmours/BodyInt16",
      "name": "Widowsilk Robe",
      "itemClass": "Body Armour",
      "dropLevel": 65,
      "inventoryWidth": 2,
      "inventoryHeight": 3,
      "requirements": {
          "level": 65,
          "strength": 0,
          "dexterity": 0,
          "intelligence": 187
      },
      "properties": {
          "energy_shield": {
              "max": 181,
              "min": 157
          },
          "movement_speed": -3
      },
      "implicits": [],
      "tags": [
          "int_armour",
          "body_armour",
          "armour",
          "default"
      ],
      "visualIdentity": {
          "ddsFile": "Art/2DItems/Armours/BodyArmours/BodyInt2C.dds",
          "id": "BodyInt2C"
      }
  },
  {
      "id": "Metadata/Items/Armours/BodyArmours/BodyStr16",
      "name": "Gladiator Plate",
      "itemClass": "Body Armour",
      "dropLevel": 65,
      "inventoryWidth": 2,
      "inventoryHeight": 3,
      "requirements": {
          "level": 65,
          "strength": 177,
          "dexterity": 0,
          "intelligence": 0
      },
      "properties": {
          "armour": {
              "max": 848,
              "min": 738
          },
          "movement_speed": -5
      },
      "implicits": [],
      "tags": [
          "str_armour",
          "body_armour",
          "armour",
          "default"
      ],
      "visualIdentity": {
          "ddsFile": "Art/2DItems/Armours/BodyArmours/BodyStr2C.dds",
          "id": "BodyStr2C"
      }
  },
  {
      "id": "Metadata/Items/Armours/BodyArmours/BodyStrDex16",
      "name": "General's Brigandine",
      "itemClass": "Body Armour",
      "dropLevel": 66,
      "inventoryWidth": 2,
      "inventoryHeight": 3,
      "requirements": {
          "level": 66,
          "strength": 103,
          "dexterity": 103,
          "intelligence": 0
      },
      "properties": {
          "armour": {
              "max": 465,
              "min": 415
          },
          "evasion": {
              "max": 465,
              "min": 415
          },
          "movement_speed": -3
      },
      "implicits": [],
      "tags": [
          "str_dex_armour",
          "body_armour",
          "armour",
          "default"
      ],
      "visualIdentity": {
          "ddsFile": "Art/2DItems/Armours/BodyArmours/BodyStrDex2C.dds",
          "id": "BodyStrDex2C"
      }
  },
  {
      "id": "Metadata/Items/Armours/BodyArmours/BodyStrInt16",
      "name": "Saint's Hauberk",
      "itemClass": "Body Armour",
      "dropLevel": 67,
      "inventoryWidth": 2,
      "inventoryHeight": 3,
      "requirements": {
          "level": 67,
          "strength": 109,
          "dexterity": 0,
          "intelligence": 94
      },
      "properties": {
          "armour": {
              "max": 496,
              "min": 443
          },
          "energy_shield": {
              "max": 85,
              "min": 76
          },
          "movement_speed": -5
      },
      "implicits": [],
      "tags": [
          "str_int_armour",
          "body_armour",
          "armour",
          "default"
      ],
      "visualIdentity": {
          "ddsFile": "Art/2DItems/Armours/BodyArmours/BodyStrInt2C.dds",
          "id": "BodyStrInt2C"
      }
  },
  {
      "id": "Metadata/Items/Armours/BodyArmours/BodyDex17",
      "name": "Assassin's Garb",
      "itemClass": "Body Armour",
      "dropLevel": 68,
      "inventoryWidth": 2,
      "inventoryHeight": 3,
      "requirements": {
          "level": 68,
          "strength": 0,
          "dexterity": 183,
          "intelligence": 0
      },
      "properties": {
          "evasion": {
              "max": 811,
              "min": 737
          }
      },
      "implicits": [
          "MovementVelocityImplicitArmour1"
      ],
      "tags": [
          "dex_armour",
          "body_armour",
          "armour",
          "default"
      ],
      "visualIdentity": {
          "ddsFile": "Art/2DItems/Armours/BodyArmours/BodyDex2C.dds",
          "id": "BodyDex2C"
      }
  },
  {
      "id": "Metadata/Items/Armours/BodyArmours/BodyDexInt16",
      "name": "Sadist Garb",
      "itemClass": "Body Armour",
      "dropLevel": 68,
      "inventoryWidth": 2,
      "inventoryHeight": 3,
      "requirements": {
          "level": 68,
          "strength": 0,
          "dexterity": 103,
          "intelligence": 109
      },
      "properties": {
          "energy_shield": {
              "max": 107,
              "min": 93
          },
          "evasion": {
              "max": 491,
              "min": 427
          },
          "movement_speed": -3
      },
      "implicits": [],
      "tags": [
          "dex_int_armour",
          "body_armour",
          "armour",
          "default"
      ],
      "visualIdentity": {
          "ddsFile": "Art/2DItems/Armours/BodyArmours/BodyDexInt2C.dds",
          "id": "BodyDexInt2C"
      }
  },
  {
      "id": "Metadata/Items/Armours/BodyArmours/BodyInt17",
      "name": "Vaal Regalia",
      "itemClass": "Body Armour",
      "dropLevel": 68,
      "inventoryWidth": 2,
      "inventoryHeight": 3,
      "requirements": {
          "level": 68,
          "strength": 0,
          "dexterity": 0,
          "intelligence": 194
      },
      "properties": {
          "energy_shield": {
              "max": 197,
              "min": 171
          },
          "movement_speed": -3
      },
      "implicits": [],
      "tags": [
          "int_armour",
          "body_armour",
          "armour",
          "default"
      ],
      "visualIdentity": {
          "ddsFile": "Art/2DItems/Armours/BodyArmours/BodyStrDexInt1C.dds",
          "id": "BodyStrDexInt1C"
      }
  },
  {
      "id": "Metadata/Items/Armours/BodyArmours/BodyStr17",
      "name": "Glorious Plate",
      "itemClass": "Body Armour",
      "dropLevel": 68,
      "inventoryWidth": 2,
      "inventoryHeight": 3,
      "requirements": {
          "level": 68,
          "strength": 191,
          "dexterity": 0,
          "intelligence": 0
      },
      "properties": {
          "armour": {
              "max": 892,
              "min": 776
          }
      },
      "implicits": [],
      "tags": [
          "str_armour",
          "body_armour",
          "armour",
          "default"
      ],
      "visualIdentity": {
          "ddsFile": "Art/2DItems/Armours/BodyArmours/BodyStr3C.dds",
          "id": "BodyStr3C"
      }
  },
  {
      "id": "Metadata/Items/Armours/BodyArmours/BodyStrDex17",
      "name": "Triumphant Lamellar",
      "itemClass": "Body Armour",
      "dropLevel": 69,
      "inventoryWidth": 2,
      "inventoryHeight": 3,
      "requirements": {
          "level": 69,
          "strength": 95,
          "dexterity": 116,
          "intelligence": 0
      },
      "properties": {
          "armour": {
              "max": 437,
              "min": 380
          },
          "evasion": {
              "max": 549,
              "min": 477
          },
          "movement_speed": -3
      },
      "implicits": [],
      "tags": [
          "str_dex_armour",
          "body_armour",
          "armour",
          "default"
      ],
      "visualIdentity": {
          "ddsFile": "Art/2DItems/Armours/BodyArmours/BodyStr4A.dds",
          "id": "BodyStr4A"
      }
  },
  {
      "id": "Metadata/Items/Armours/BodyArmours/BodyStrInt17",
      "name": "Saintly Chainmail",
      "itemClass": "Body Armour",
      "dropLevel": 70,
      "inventoryWidth": 2,
      "inventoryHeight": 3,
      "requirements": {
          "level": 70,
          "strength": 99,
          "dexterity": 0,
          "intelligence": 115
      },
      "properties": {
          "armour": {
              "max": 461,
              "min": 401
          },
          "energy_shield": {
              "max": 110,
              "min": 96
          },
          "movement_speed": -5
      },
      "implicits": [],
      "tags": [
          "str_int_armour",
          "body_armour",
          "armour",
          "default"
      ],
      "visualIdentity": {
          "ddsFile": "Art/2DItems/Armours/BodyArmours/BodyStrInt3C.dds",
          "id": "BodyStrInt3C"
      }
  },
  {
      "id": "Metadata/Items/Armours/BodyArmours/BodyDexInt17",
      "name": "Carnal Armour",
      "itemClass": "Body Armour",
      "dropLevel": 71,
      "inventoryWidth": 2,
      "inventoryHeight": 3,
      "requirements": {
          "level": 71,
          "strength": 0,
          "dexterity": 88,
          "intelligence": 122
      },
      "properties": {
          "energy_shield": {
              "max": 113,
              "min": 103
          },
          "evasion": {
              "max": 388,
              "min": 353
          },
          "movement_speed": -3
      },
      "implicits": [
          "IncreasedManaImplicitArmour1"
      ],
      "tags": [
          "dex_int_armour",
          "body_armour",
          "armour",
          "default"
      ],
      "visualIdentity": {
          "ddsFile": "Art/2DItems/Armours/BodyArmours/BodyDexInt4C.dds",
          "id": "BodyDexInt4C"
      }
  },
];

// Boots (56 items)
export const BOOTS_BASES: PoeBaseItem[] = [
  {
      "id": "Metadata/Items/Armours/Boots/BootsStr1",
      "name": "Iron Greaves",
      "itemClass": "Boots",
      "dropLevel": 1,
      "inventoryWidth": 2,
      "inventoryHeight": 2,
      "requirements": {
          "level": 1,
          "strength": 8,
          "dexterity": 0,
          "intelligence": 0
      },
      "properties": {
          "armour": {
              "max": 9,
              "min": 6
          }
      },
      "implicits": [],
      "tags": [
          "str_armour",
          "boots",
          "armour",
          "default"
      ],
      "visualIdentity": {
          "ddsFile": "Art/2DItems/Armours/Boots/BootsStr1.dds",
          "id": "BootsStr1"
      }
  },
  {
      "id": "Metadata/Items/Armours/Boots/BootsDex1",
      "name": "Rawhide Boots",
      "itemClass": "Boots",
      "dropLevel": 3,
      "inventoryWidth": 2,
      "inventoryHeight": 2,
      "requirements": {
          "level": 3,
          "strength": 0,
          "dexterity": 11,
          "intelligence": 0
      },
      "properties": {
          "evasion": {
              "max": 18,
              "min": 13
          }
      },
      "implicits": [],
      "tags": [
          "dex_armour",
          "boots",
          "armour",
          "default"
      ],
      "visualIdentity": {
          "ddsFile": "Art/2DItems/Armours/Boots/BootsDex1.dds",
          "id": "BootsDex1"
      }
  },
  {
      "id": "Metadata/Items/Armours/Boots/BootsInt1",
      "name": "Wool Shoes",
      "itemClass": "Boots",
      "dropLevel": 3,
      "inventoryWidth": 2,
      "inventoryHeight": 2,
      "requirements": {
          "level": 3,
          "strength": 0,
          "dexterity": 0,
          "intelligence": 11
      },
      "properties": {
          "energy_shield": {
              "max": 7,
              "min": 5
          }
      },
      "implicits": [],
      "tags": [
          "int_armour",
          "boots",
          "armour",
          "default"
      ],
      "visualIdentity": {
          "ddsFile": "Art/2DItems/Armours/Boots/BootsInt1.dds",
          "id": "BootsInt1"
      }
  },
  {
      "id": "Metadata/Items/Armours/Boots/BootsStrInt1",
      "name": "Chain Boots",
      "itemClass": "Boots",
      "dropLevel": 5,
      "inventoryWidth": 2,
      "inventoryHeight": 2,
      "requirements": {
          "level": 5,
          "strength": 8,
          "dexterity": 0,
          "intelligence": 8
      },
      "properties": {
          "armour": {
              "max": 15,
              "min": 11
          },
          "energy_shield": {
              "max": 5,
              "min": 3
          }
      },
      "implicits": [],
      "tags": [
          "str_int_armour",
          "boots",
          "armour",
          "default"
      ],
      "visualIdentity": {
          "ddsFile": "Art/2DItems/Armours/Boots/BootsStrInt1.dds",
          "id": "BootsStrInt1"
      }
  },
  {
      "id": "Metadata/Items/Armours/Boots/BootsDexInt1",
      "name": "Wrapped Boots",
      "itemClass": "Boots",
      "dropLevel": 6,
      "inventoryWidth": 2,
      "inventoryHeight": 2,
      "requirements": {
          "level": 6,
          "strength": 0,
          "dexterity": 9,
          "intelligence": 9
      },
      "properties": {
          "energy_shield": {
              "max": 5,
              "min": 4
          },
          "evasion": {
              "max": 17,
              "min": 12
          }
      },
      "implicits": [],
      "tags": [
          "dex_int_armour",
          "boots",
          "armour",
          "default"
      ],
      "visualIdentity": {
          "ddsFile": "Art/2DItems/Armours/Boots/BootsDexInt1.dds",
          "id": "BootsDexInt1"
      }
  },
  {
      "id": "Metadata/Items/Armours/Boots/BootsStrDex1",
      "name": "Leatherscale Boots",
      "itemClass": "Boots",
      "dropLevel": 6,
      "inventoryWidth": 2,
      "inventoryHeight": 2,
      "requirements": {
          "level": 6,
          "strength": 9,
          "dexterity": 9,
          "intelligence": 0
      },
      "properties": {
          "armour": {
              "max": 17,
              "min": 12
          },
          "evasion": {
              "max": 17,
              "min": 12
          }
      },
      "implicits": [],
      "tags": [
          "str_dex_armour",
          "boots",
          "armour",
          "default"
      ],
      "visualIdentity": {
          "ddsFile": "Art/2DItems/Armours/Boots/BootsStrDex1.dds",
          "id": "BootsStrDex1"
      }
  },
  {
      "id": "Metadata/Items/Armours/Boots/BootsInt2",
      "name": "Velvet Slippers",
      "itemClass": "Boots",
      "dropLevel": 9,
      "inventoryWidth": 2,
      "inventoryHeight": 2,
      "requirements": {
          "level": 9,
          "strength": 0,
          "dexterity": 0,
          "intelligence": 21
      },
      "properties": {
          "energy_shield": {
              "max": 11,
              "min": 8
          }
      },
      "implicits": [],
      "tags": [
          "int_armour",
          "boots",
          "armour",
          "default"
      ],
      "visualIdentity": {
          "ddsFile": "Art/2DItems/Armours/Boots/BootsInt2.dds",
          "id": "BootsInt2"
      }
  },
  {
      "id": "Metadata/Items/Armours/Boots/BootsStr2",
      "name": "Steel Greaves",
      "itemClass": "Boots",
      "dropLevel": 9,
      "inventoryWidth": 2,
      "inventoryHeight": 2,
      "requirements": {
          "level": 9,
          "strength": 21,
          "dexterity": 0,
          "intelligence": 0
      },
      "properties": {
          "armour": {
              "max": 42,
              "min": 32
          }
      },
      "implicits": [],
      "tags": [
          "str_armour",
          "boots",
          "armour",
          "default"
      ],
      "visualIdentity": {
          "ddsFile": "Art/2DItems/Armours/Boots/BootsStr2.dds",
          "id": "BootsStr2"
      }
  },
  {
      "id": "Metadata/Items/Armours/Boots/BootsDex2",
      "name": "Goathide Boots",
      "itemClass": "Boots",
      "dropLevel": 12,
      "inventoryWidth": 2,
      "inventoryHeight": 2,
      "requirements": {
          "level": 12,
          "strength": 0,
          "dexterity": 26,
          "intelligence": 0
      },
      "properties": {
          "evasion": {
              "max": 54,
              "min": 42
          }
      },
      "implicits": [],
      "tags": [
          "dex_armour",
          "boots",
          "armour",
          "default"
      ],
      "visualIdentity": {
          "ddsFile": "Art/2DItems/Armours/Boots/BootsDex2.dds",
          "id": "BootsDex2"
      }
  },
  {
      "id": "Metadata/Items/Armours/Boots/BootsStrInt2",
      "name": "Ringmail Boots",
      "itemClass": "Boots",
      "dropLevel": 13,
      "inventoryWidth": 2,
      "inventoryHeight": 2,
      "requirements": {
          "level": 13,
          "strength": 15,
          "dexterity": 0,
          "intelligence": 15
      },
      "properties": {
          "armour": {
              "max": 32,
              "min": 25
          },
          "energy_shield": {
              "max": 8,
              "min": 6
          }
      },
      "implicits": [],
      "tags": [
          "str_int_armour",
          "boots",
          "armour",
          "default"
      ],
      "visualIdentity": {
          "ddsFile": "Art/2DItems/Armours/Boots/BootsStrInt2.dds",
          "id": "BootsStrInt2"
      }
  },
  {
      "id": "Metadata/Items/Armours/Boots/BootsDexInt2",
      "name": "Strapped Boots",
      "itemClass": "Boots",
      "dropLevel": 16,
      "inventoryWidth": 2,
      "inventoryHeight": 2,
      "requirements": {
          "level": 16,
          "strength": 0,
          "dexterity": 18,
          "intelligence": 18
      },
      "properties": {
          "energy_shield": {
              "max": 9,
              "min": 7
          },
          "evasion": {
              "max": 39,
              "min": 30
          }
      },
      "implicits": [],
      "tags": [
          "dex_int_armour",
          "boots",
          "armour",
          "default"
      ],
      "visualIdentity": {
          "ddsFile": "Art/2DItems/Armours/Boots/BootsDexInt2.dds",
          "id": "BootsDexInt2"
      }
  },
  {
      "id": "Metadata/Items/Armours/Boots/BootsStrDex2",
      "name": "Ironscale Boots",
      "itemClass": "Boots",
      "dropLevel": 18,
      "inventoryWidth": 2,
      "inventoryHeight": 2,
      "requirements": {
          "level": 18,
          "strength": 19,
          "dexterity": 19,
          "intelligence": 0
      },
      "properties": {
          "armour": {
              "max": 44,
              "min": 34
          },
          "evasion": {
              "max": 44,
              "min": 34
          }
      },
      "implicits": [],
      "tags": [
          "str_dex_armour",
          "boots",
          "armour",
          "default"
      ],
      "visualIdentity": {
          "ddsFile": "Art/2DItems/Armours/Boots/BootsStrDex2.dds",
          "id": "BootsStrDex2"
      }
  },
  {
      "id": "Metadata/Items/Armours/Boots/BootsDex3",
      "name": "Deerskin Boots",
      "itemClass": "Boots",
      "dropLevel": 22,
      "inventoryWidth": 2,
      "inventoryHeight": 2,
      "requirements": {
          "level": 22,
          "strength": 0,
          "dexterity": 42,
          "intelligence": 0
      },
      "properties": {
          "evasion": {
              "max": 92,
              "min": 74
          }
      },
      "implicits": [],
      "tags": [
          "dex_armour",
          "boots",
          "armour",
          "default"
      ],
      "visualIdentity": {
          "ddsFile": "Art/2DItems/Armours/Boots/BootsDex3.dds",
          "id": "BootsDex3"
      }
  },
  {
      "id": "Metadata/Items/Armours/Boots/BootsInt3",
      "name": "Silk Slippers",
      "itemClass": "Boots",
      "dropLevel": 22,
      "inventoryWidth": 2,
      "inventoryHeight": 2,
      "requirements": {
          "level": 22,
          "strength": 0,
          "dexterity": 0,
          "intelligence": 42
      },
      "properties": {
          "energy_shield": {
              "max": 21,
              "min": 17
          }
      },
      "implicits": [],
      "tags": [
          "int_armour",
          "boots",
          "armour",
          "default"
      ],
      "visualIdentity": {
          "ddsFile": "Art/2DItems/Armours/Boots/BootsInt3.dds",
          "id": "BootsInt3"
      }
  },
  {
      "id": "Metadata/Items/Armours/Boots/BootsStr3",
      "name": "Plated Greaves",
      "itemClass": "Boots",
      "dropLevel": 23,
      "inventoryWidth": 2,
      "inventoryHeight": 2,
      "requirements": {
          "level": 23,
          "strength": 44,
          "dexterity": 0,
          "intelligence": 0
      },
      "properties": {
          "armour": {
              "max": 96,
              "min": 77
          }
      },
      "implicits": [],
      "tags": [
          "str_armour",
          "boots",
          "armour",
          "default"
      ],
      "visualIdentity": {
          "ddsFile": "Art/2DItems/Armours/Boots/BootsStr3.dds",
          "id": "BootsStr3"
      }
  },
  {
      "id": "Metadata/Items/Armours/Boots/BootsDexInt3",
      "name": "Clasped Boots",
      "itemClass": "Boots",
      "dropLevel": 27,
      "inventoryWidth": 2,
      "inventoryHeight": 2,
      "requirements": {
          "level": 27,
          "strength": 0,
          "dexterity": 27,
          "intelligence": 27
      },
      "properties": {
          "energy_shield": {
              "max": 12,
              "min": 11
          },
          "evasion": {
              "max": 57,
              "min": 50
          }
      },
      "implicits": [],
      "tags": [
          "dex_int_armour",
          "boots",
          "armour",
          "default"
      ],
      "visualIdentity": {
          "ddsFile": "Art/2DItems/Armours/Boots/BootsDexInt3.dds",
          "id": "BootsDexInt3"
      }
  },
  {
      "id": "Metadata/Items/Armours/Boots/BootsStrInt3",
      "name": "Mesh Boots",
      "itemClass": "Boots",
      "dropLevel": 28,
      "inventoryWidth": 2,
      "inventoryHeight": 2,
      "requirements": {
          "level": 28,
          "strength": 28,
          "dexterity": 0,
          "intelligence": 28
      },
      "properties": {
          "armour": {
              "max": 64,
              "min": 51
          },
          "energy_shield": {
              "max": 14,
              "min": 11
          }
      },
      "implicits": [],
      "tags": [
          "str_int_armour",
          "boots",
          "armour",
          "default"
      ],
      "visualIdentity": {
          "ddsFile": "Art/2DItems/Armours/Boots/BootsStrInt3.dds",
          "id": "BootsStrInt3"
      }
  },
  {
      "id": "Metadata/Items/Armours/Boots/BootsStrDex3",
      "name": "Bronzescale Boots",
      "itemClass": "Boots",
      "dropLevel": 30,
      "inventoryWidth": 2,
      "inventoryHeight": 2,
      "requirements": {
          "level": 30,
          "strength": 30,
          "dexterity": 30,
          "intelligence": 0
      },
      "properties": {
          "armour": {
              "max": 63,
              "min": 55
          },
          "evasion": {
              "max": 63,
              "min": 55
          }
      },
      "implicits": [],
      "tags": [
          "str_dex_armour",
          "boots",
          "armour",
          "default"
      ],
      "visualIdentity": {
          "ddsFile": "Art/2DItems/Armours/Boots/BootsStrDex3.dds",
          "id": "BootsStrDex3"
      }
  },
  {
      "id": "Metadata/Items/Armours/Boots/BootsInt4",
      "name": "Scholar Boots",
      "itemClass": "Boots",
      "dropLevel": 32,
      "inventoryWidth": 2,
      "inventoryHeight": 2,
      "requirements": {
          "level": 32,
          "strength": 0,
          "dexterity": 0,
          "intelligence": 59
      },
      "properties": {
          "energy_shield": {
              "max": 25,
              "min": 23
          }
      },
      "implicits": [],
      "tags": [
          "int_armour",
          "boots",
          "armour",
          "default"
      ],
      "visualIdentity": {
          "ddsFile": "Art/2DItems/Armours/Boots/BootsInt4.dds",
          "id": "BootsInt4"
      }
  },
  {
      "id": "Metadata/Items/Armours/Boots/BootsStr4",
      "name": "Reinforced Greaves",
      "itemClass": "Boots",
      "dropLevel": 33,
      "inventoryWidth": 2,
      "inventoryHeight": 2,
      "requirements": {
          "level": 33,
          "strength": 61,
          "dexterity": 0,
          "intelligence": 0
      },
      "properties": {
          "armour": {
              "max": 120,
              "min": 109
          }
      },
      "implicits": [],
      "tags": [
          "str_armour",
          "boots",
          "armour",
          "default"
      ],
      "visualIdentity": {
          "ddsFile": "Art/2DItems/Armours/Boots/BootsStr4.dds",
          "id": "BootsStr4"
      }
  },
  {
      "id": "Metadata/Items/Armours/Boots/BootsDex4",
      "name": "Nubuck Boots",
      "itemClass": "Boots",
      "dropLevel": 34,
      "inventoryWidth": 2,
      "inventoryHeight": 2,
      "requirements": {
          "level": 34,
          "strength": 0,
          "dexterity": 62,
          "intelligence": 0
      },
      "properties": {
          "evasion": {
              "max": 126,
              "min": 113
          }
      },
      "implicits": [],
      "tags": [
          "dex_armour",
          "boots",
          "armour",
          "default"
      ],
      "visualIdentity": {
          "ddsFile": "Art/2DItems/Armours/Boots/BootsDex4.dds",
          "id": "BootsDex4"
      }
  },
  {
      "id": "Metadata/Items/Armours/Boots/BootsDexInt4",
      "name": "Shackled Boots",
      "itemClass": "Boots",
      "dropLevel": 34,
      "inventoryWidth": 2,
      "inventoryHeight": 2,
      "requirements": {
          "level": 34,
          "strength": 0,
          "dexterity": 34,
          "intelligence": 34
      },
      "properties": {
          "energy_shield": {
              "max": 15,
              "min": 13
          },
          "evasion": {
              "max": 71,
              "min": 62
          }
      },
      "implicits": [],
      "tags": [
          "dex_int_armour",
          "boots",
          "armour",
          "default"
      ],
      "visualIdentity": {
          "ddsFile": "Art/2DItems/Armours/Boots/BootsDexInt4.dds",
          "id": "BootsDexInt4"
      }
  },
  {
      "id": "Metadata/Items/Armours/Boots/BootsStrDex4",
      "name": "Steelscale Boots",
      "itemClass": "Boots",
      "dropLevel": 36,
      "inventoryWidth": 2,
      "inventoryHeight": 2,
      "requirements": {
          "level": 36,
          "strength": 35,
          "dexterity": 35,
          "intelligence": 0
      },
      "properties": {
          "armour": {
              "max": 75,
              "min": 65
          },
          "evasion": {
              "max": 75,
              "min": 65
          }
      },
      "implicits": [],
      "tags": [
          "str_dex_armour",
          "boots",
          "armour",
          "default"
      ],
      "visualIdentity": {
          "ddsFile": "Art/2DItems/Armours/Boots/BootsStrDex1.dds",
          "id": "BootsStrDex1"
      }
  },
  {
      "id": "Metadata/Items/Armours/Boots/BootsStrInt4",
      "name": "Riveted Boots",
      "itemClass": "Boots",
      "dropLevel": 36,
      "inventoryWidth": 2,
      "inventoryHeight": 2,
      "requirements": {
          "level": 36,
          "strength": 35,
          "dexterity": 0,
          "intelligence": 35
      },
      "properties": {
          "armour": {
              "max": 71,
              "min": 65
          },
          "energy_shield": {
              "max": 15,
              "min": 14
          }
      },
      "implicits": [],
      "tags": [
          "str_int_armour",
          "boots",
          "armour",
          "default"
      ],
      "visualIdentity": {
          "ddsFile": "Art/2DItems/Armours/Boots/BootsStrInt1.dds",
          "id": "BootsStrInt1"
      }
  },
  {
      "id": "Metadata/Items/Armours/Boots/BootsStr5",
      "name": "Antique Greaves",
      "itemClass": "Boots",
      "dropLevel": 37,
      "inventoryWidth": 2,
      "inventoryHeight": 2,
      "requirements": {
          "level": 37,
          "strength": 67,
          "dexterity": 0,
          "intelligence": 0
      },
      "properties": {
          "armour": {
              "max": 144,
              "min": 122
          }
      },
      "implicits": [],
      "tags": [
          "str_armour",
          "boots",
          "armour",
          "default"
      ],
      "visualIdentity": {
          "ddsFile": "Art/2DItems/Armours/Boots/BootsStr2.dds",
          "id": "BootsStr2"
      }
  },
  {
      "id": "Metadata/Items/Armours/Boots/BootsInt5",
      "name": "Satin Slippers",
      "itemClass": "Boots",
      "dropLevel": 38,
      "inventoryWidth": 2,
      "inventoryHeight": 2,
      "requirements": {
          "level": 38,
          "strength": 0,
          "dexterity": 0,
          "intelligence": 69
      },
      "properties": {
          "energy_shield": {
              "max": 30,
              "min": 26
          }
      },
      "implicits": [],
      "tags": [
          "int_armour",
          "boots",
          "armour",
          "default"
      ],
      "visualIdentity": {
          "ddsFile": "Art/2DItems/Armours/Boots/BootsInt2.dds",
          "id": "BootsInt2"
      }
  },
  {
      "id": "Metadata/Items/Armours/Boots/BootsDex5",
      "name": "Eelskin Boots",
      "itemClass": "Boots",
      "dropLevel": 39,
      "inventoryWidth": 2,
      "inventoryHeight": 2,
      "requirements": {
          "level": 39,
          "strength": 0,
          "dexterity": 70,
          "intelligence": 0
      },
      "properties": {
          "evasion": {
              "max": 148,
              "min": 129
          }
      },
      "implicits": [],
      "tags": [
          "dex_armour",
          "boots",
          "armour",
          "default"
      ],
      "visualIdentity": {
          "ddsFile": "Art/2DItems/Armours/Boots/BootsDex2.dds",
          "id": "BootsDex2"
      }
  },
  {
      "id": "Metadata/Items/Armours/Boots/BootsStrInt5",
      "name": "Zealot Boots",
      "itemClass": "Boots",
      "dropLevel": 40,
      "inventoryWidth": 2,
      "inventoryHeight": 2,
      "requirements": {
          "level": 40,
          "strength": 39,
          "dexterity": 0,
          "intelligence": 39
      },
      "properties": {
          "armour": {
              "max": 87,
              "min": 73
          },
          "energy_shield": {
              "max": 18,
              "min": 15
          }
      },
      "implicits": [],
      "tags": [
          "str_int_armour",
          "boots",
          "armour",
          "default"
      ],
      "visualIdentity": {
          "ddsFile": "Art/2DItems/Armours/Boots/BootsStrInt2.dds",
          "id": "BootsStrInt2"
      }
  },
  {
      "id": "Metadata/Items/Armours/Boots/BootsDexInt5",
      "name": "Trapper Boots",
      "itemClass": "Boots",
      "dropLevel": 41,
      "inventoryWidth": 2,
      "inventoryHeight": 2,
      "requirements": {
          "level": 41,
          "strength": 0,
          "dexterity": 40,
          "intelligence": 40
      },
      "properties": {
          "energy_shield": {
              "max": 18,
              "min": 16
          },
          "evasion": {
              "max": 85,
              "min": 74
          }
      },
      "implicits": [],
      "tags": [
          "dex_int_armour",
          "boots",
          "armour",
          "default"
      ],
      "visualIdentity": {
          "ddsFile": "Art/2DItems/Armours/Boots/BootsDexInt2.dds",
          "id": "BootsDexInt2"
      }
  },
  {
      "id": "Metadata/Items/Armours/Boots/BootsStrDex5",
      "name": "Serpentscale Boots",
      "itemClass": "Boots",
      "dropLevel": 42,
      "inventoryWidth": 2,
      "inventoryHeight": 2,
      "requirements": {
          "level": 42,
          "strength": 40,
          "dexterity": 40,
          "intelligence": 0
      },
      "properties": {
          "armour": {
              "max": 90,
              "min": 76
          },
          "evasion": {
              "max": 90,
              "min": 76
          }
      },
      "implicits": [],
      "tags": [
          "str_dex_armour",
          "boots",
          "armour",
          "default"
      ],
      "visualIdentity": {
          "ddsFile": "Art/2DItems/Armours/Boots/BootsStrDex2.dds",
          "id": "BootsStrDex2"
      }
  },
  {
      "id": "Metadata/Items/Armours/Boots/BootsDex6",
      "name": "Sharkskin Boots",
      "itemClass": "Boots",
      "dropLevel": 44,
      "inventoryWidth": 2,
      "inventoryHeight": 2,
      "requirements": {
          "level": 44,
          "strength": 0,
          "dexterity": 79,
          "intelligence": 0
      },
      "properties": {
          "evasion": {
              "max": 171,
              "min": 145
          }
      },
      "implicits": [],
      "tags": [
          "dex_armour",
          "boots",
          "armour",
          "default"
      ],
      "visualIdentity": {
          "ddsFile": "Art/2DItems/Armours/Boots/BootsDex3.dds",
          "id": "BootsDex3"
      }
  },
  {
      "id": "Metadata/Items/Armours/Boots/BootsInt6",
      "name": "Samite Slippers",
      "itemClass": "Boots",
      "dropLevel": 44,
      "inventoryWidth": 2,
      "inventoryHeight": 2,
      "requirements": {
          "level": 44,
          "strength": 0,
          "dexterity": 0,
          "intelligence": 79
      },
      "properties": {
          "energy_shield": {
              "max": 35,
              "min": 30
          }
      },
      "implicits": [],
      "tags": [
          "int_armour",
          "boots",
          "armour",
          "default"
      ],
      "visualIdentity": {
          "ddsFile": "Art/2DItems/Armours/Boots/BootsInt3.dds",
          "id": "BootsInt3"
      }
  },
  {
      "id": "Metadata/Items/Armours/Boots/BootsStr6",
      "name": "Ancient Greaves",
      "itemClass": "Boots",
      "dropLevel": 46,
      "inventoryWidth": 2,
      "inventoryHeight": 2,
      "requirements": {
          "level": 46,
          "strength": 82,
          "dexterity": 0,
          "intelligence": 0
      },
      "properties": {
          "armour": {
              "max": 174,
              "min": 151
          }
      },
      "implicits": [],
      "tags": [
          "str_armour",
          "boots",
          "armour",
          "default"
      ],
      "visualIdentity": {
          "ddsFile": "Art/2DItems/Armours/Boots/BootsStr3.dds",
          "id": "BootsStr3"
      }
  },
  {
      "id": "Metadata/Items/Armours/Boots/BootsDexInt6",
      "name": "Ambush Boots",
      "itemClass": "Boots",
      "dropLevel": 47,
      "inventoryWidth": 2,
      "inventoryHeight": 2,
      "requirements": {
          "level": 47,
          "strength": 0,
          "dexterity": 45,
          "intelligence": 45
      },
      "properties": {
          "energy_shield": {
              "max": 20,
              "min": 18
          },
          "evasion": {
              "max": 95,
              "min": 85
          }
      },
      "implicits": [],
      "tags": [
          "dex_int_armour",
          "boots",
          "armour",
          "default"
      ],
      "visualIdentity": {
          "ddsFile": "Art/2DItems/Armours/Boots/BootsDexInt3.dds",
          "id": "BootsDexInt3"
      }
  },
  {
      "id": "Metadata/Items/Armours/Boots/BootsStrInt6",
      "name": "Soldier Boots",
      "itemClass": "Boots",
      "dropLevel": 49,
      "inventoryWidth": 2,
      "inventoryHeight": 2,
      "requirements": {
          "level": 49,
          "strength": 47,
          "dexterity": 0,
          "intelligence": 47
      },
      "properties": {
          "armour": {
              "max": 99,
              "min": 88
          },
          "energy_shield": {
              "max": 20,
              "min": 18
          }
      },
      "implicits": [],
      "tags": [
          "str_int_armour",
          "boots",
          "armour",
          "default"
      ],
      "visualIdentity": {
          "ddsFile": "Art/2DItems/Armours/Boots/BootsStrInt3.dds",
          "id": "BootsStrInt3"
      }
  },
  {
      "id": "Metadata/Items/Armours/Boots/BootsStrDex6",
      "name": "Wyrmscale Boots",
      "itemClass": "Boots",
      "dropLevel": 51,
      "inventoryWidth": 2,
      "inventoryHeight": 2,
      "requirements": {
          "level": 51,
          "strength": 48,
          "dexterity": 48,
          "intelligence": 0
      },
      "properties": {
          "armour": {
              "max": 103,
              "min": 92
          },
          "evasion": {
              "max": 103,
              "min": 92
          }
      },
      "implicits": [],
      "tags": [
          "str_dex_armour",
          "boots",
          "armour",
          "default"
      ],
      "visualIdentity": {
          "ddsFile": "Art/2DItems/Armours/Boots/BootsStrDex3.dds",
          "id": "BootsStrDex3"
      }
  },
  {
      "id": "Metadata/Items/Armours/Boots/BootsInt7",
      "name": "Conjurer Boots",
      "itemClass": "Boots",
      "dropLevel": 53,
      "inventoryWidth": 2,
      "inventoryHeight": 2,
      "requirements": {
          "level": 53,
          "strength": 0,
          "dexterity": 0,
          "intelligence": 94
      },
      "properties": {
          "energy_shield": {
              "max": 42,
              "min": 36
          }
      },
      "implicits": [],
      "tags": [
          "int_armour",
          "boots",
          "armour",
          "default"
      ],
      "visualIdentity": {
          "ddsFile": "Art/2DItems/Armours/Boots/BootsInt4.dds",
          "id": "BootsInt4"
      }
  },
  {
      "id": "Metadata/Items/Armours/Boots/BootsStr7",
      "name": "Goliath Greaves",
      "itemClass": "Boots",
      "dropLevel": 54,
      "inventoryWidth": 2,
      "inventoryHeight": 2,
      "requirements": {
          "level": 54,
          "strength": 95,
          "dexterity": 0,
          "intelligence": 0
      },
      "properties": {
          "armour": {
              "max": 209,
              "min": 177
          }
      },
      "implicits": [],
      "tags": [
          "str_armour",
          "boots",
          "armour",
          "default"
      ],
      "visualIdentity": {
          "ddsFile": "Art/2DItems/Armours/Boots/BootsStr4.dds",
          "id": "BootsStr4"
      }
  },
  {
      "id": "Metadata/Items/Armours/Boots/BootsDex7",
      "name": "Shagreen Boots",
      "itemClass": "Boots",
      "dropLevel": 55,
      "inventoryWidth": 2,
      "inventoryHeight": 2,
      "requirements": {
          "level": 55,
          "strength": 0,
          "dexterity": 97,
          "intelligence": 0
      },
      "properties": {
          "evasion": {
              "max": 216,
              "min": 180
          }
      },
      "implicits": [],
      "tags": [
          "dex_armour",
          "boots",
          "armour",
          "default"
      ],
      "visualIdentity": {
          "ddsFile": "Art/2DItems/Armours/Boots/BootsDex4.dds",
          "id": "BootsDex4"
      }
  },
  {
      "id": "Metadata/Items/Armours/Boots/BootsDexInt7",
      "name": "Carnal Boots",
      "itemClass": "Boots",
      "dropLevel": 55,
      "inventoryWidth": 2,
      "inventoryHeight": 2,
      "requirements": {
          "level": 55,
          "strength": 0,
          "dexterity": 52,
          "intelligence": 52
      },
      "properties": {
          "energy_shield": {
              "max": 24,
              "min": 20
          },
          "evasion": {
              "max": 117,
              "min": 99
          }
      },
      "implicits": [],
      "tags": [
          "dex_int_armour",
          "boots",
          "armour",
          "default"
      ],
      "visualIdentity": {
          "ddsFile": "Art/2DItems/Armours/Boots/BootsDexInt4.dds",
          "id": "BootsDexInt4"
      }
  },
  {
      "id": "Metadata/Items/Armours/Boots/BootsStrInt7",
      "name": "Legion Boots",
      "itemClass": "Boots",
      "dropLevel": 58,
      "inventoryWidth": 2,
      "inventoryHeight": 2,
      "requirements": {
          "level": 58,
          "strength": 54,
          "dexterity": 0,
          "intelligence": 54
      },
      "properties": {
          "armour": {
              "max": 120,
              "min": 104
          },
          "energy_shield": {
              "max": 25,
              "min": 21
          }
      },
      "implicits": [],
      "tags": [
          "str_int_armour",
          "boots",
          "armour",
          "default"
      ],
      "visualIdentity": {
          "ddsFile": "Art/2DItems/Armours/Boots/BootsStrInt2.dds",
          "id": "BootsStrInt2"
      }
  },
  {
      "id": "Metadata/Items/Armours/Boots/BootsStrDex7",
      "name": "Hydrascale Boots",
      "itemClass": "Boots",
      "dropLevel": 59,
      "inventoryWidth": 2,
      "inventoryHeight": 2,
      "requirements": {
          "level": 59,
          "strength": 56,
          "dexterity": 56,
          "intelligence": 0
      },
      "properties": {
          "armour": {
              "max": 122,
              "min": 106
          },
          "evasion": {
              "max": 122,
              "min": 106
          }
      },
      "implicits": [],
      "tags": [
          "str_dex_armour",
          "boots",
          "armour",
          "default"
      ],
      "visualIdentity": {
          "ddsFile": "Art/2DItems/Armours/Boots/BootsStrDex2.dds",
          "id": "BootsStrDex2"
      }
  },
  {
      "id": "Metadata/Items/Armours/Boots/BootsInt8",
      "name": "Arcanist Slippers",
      "itemClass": "Boots",
      "dropLevel": 61,
      "inventoryWidth": 2,
      "inventoryHeight": 2,
      "requirements": {
          "level": 61,
          "strength": 0,
          "dexterity": 0,
          "intelligence": 119
      },
      "properties": {
          "energy_shield": {
              "max": 55,
              "min": 47
          }
      },
      "implicits": [],
      "tags": [
          "int_armour",
          "boots",
          "armour",
          "default"
      ],
      "visualIdentity": {
          "ddsFile": "Art/2DItems/Armours/Boots/BootsInt3.dds",
          "id": "BootsInt3"
      }
  },
  {
      "id": "Metadata/Items/Armours/Boots/BootsDex8",
      "name": "Stealth Boots",
      "itemClass": "Boots",
      "dropLevel": 62,
      "inventoryWidth": 2,
      "inventoryHeight": 2,
      "requirements": {
          "level": 62,
          "strength": 0,
          "dexterity": 117,
          "intelligence": 0
      },
      "properties": {
          "evasion": {
              "max": 253,
              "min": 220
          }
      },
      "implicits": [],
      "tags": [
          "dex_armour",
          "boots",
          "armour",
          "default"
      ],
      "visualIdentity": {
          "ddsFile": "Art/2DItems/Armours/Boots/BootsDex3.dds",
          "id": "BootsDex3"
      }
  },
  {
      "id": "Metadata/Items/Armours/Boots/BootsStr8",
      "name": "Vaal Greaves",
      "itemClass": "Boots",
      "dropLevel": 62,
      "inventoryWidth": 2,
      "inventoryHeight": 2,
      "requirements": {
          "level": 62,
          "strength": 117,
          "dexterity": 0,
          "intelligence": 0
      },
      "properties": {
          "armour": {
              "max": 253,
              "min": 220
          }
      },
      "implicits": [],
      "tags": [
          "str_armour",
          "boots",
          "armour",
          "default"
      ],
      "visualIdentity": {
          "ddsFile": "Art/2DItems/Armours/Boots/BootsStr3.dds",
          "id": "BootsStr3"
      }
  },
  {
      "id": "Metadata/Items/Armours/Boots/BootsDexInt8",
      "name": "Assassin's Boots",
      "itemClass": "Boots",
      "dropLevel": 63,
      "inventoryWidth": 2,
      "inventoryHeight": 2,
      "requirements": {
          "level": 63,
          "strength": 0,
          "dexterity": 62,
          "intelligence": 62
      },
      "properties": {
          "energy_shield": {
              "max": 28,
              "min": 25
          },
          "evasion": {
              "max": 139,
              "min": 121
          }
      },
      "implicits": [],
      "tags": [
          "dex_int_armour",
          "boots",
          "armour",
          "default"
      ],
      "visualIdentity": {
          "ddsFile": "Art/2DItems/Armours/Boots/BootsDexInt3.dds",
          "id": "BootsDexInt3"
      }
  },
  {
      "id": "Metadata/Items/Armours/Boots/BootsStrInt8",
      "name": "Crusader Boots",
      "itemClass": "Boots",
      "dropLevel": 64,
      "inventoryWidth": 2,
      "inventoryHeight": 2,
      "requirements": {
          "level": 64,
          "strength": 62,
          "dexterity": 0,
          "intelligence": 62
      },
      "properties": {
          "armour": {
              "max": 139,
              "min": 121
          },
          "energy_shield": {
              "max": 28,
              "min": 25
          }
      },
      "implicits": [],
      "tags": [
          "str_int_armour",
          "boots",
          "armour",
          "default"
      ],
      "visualIdentity": {
          "ddsFile": "Art/2DItems/Armours/Boots/BootsStrInt3.dds",
          "id": "BootsStrInt3"
      }
  },
  {
      "id": "Metadata/Items/Armours/Boots/BootsStrDex8",
      "name": "Dragonscale Boots",
      "itemClass": "Boots",
      "dropLevel": 65,
      "inventoryWidth": 2,
      "inventoryHeight": 2,
      "requirements": {
          "level": 65,
          "strength": 62,
          "dexterity": 62,
          "intelligence": 0
      },
      "properties": {
          "armour": {
              "max": 139,
              "min": 121
          },
          "evasion": {
              "max": 139,
              "min": 121
          }
      },
      "implicits": [],
      "tags": [
          "str_dex_armour",
          "boots",
          "armour",
          "default"
      ],
      "visualIdentity": {
          "ddsFile": "Art/2DItems/Armours/Boots/BootsStrDex3.dds",
          "id": "BootsStrDex3"
      }
  },
  {
      "id": "Metadata/Items/Armours/Boots/BootsInt9",
      "name": "Sorcerer Boots",
      "itemClass": "Boots",
      "dropLevel": 67,
      "inventoryWidth": 2,
      "inventoryHeight": 2,
      "requirements": {
          "level": 67,
          "strength": 0,
          "dexterity": 0,
          "intelligence": 123
      },
      "properties": {
          "energy_shield": {
              "max": 59,
              "min": 51
          }
      },
      "implicits": [],
      "tags": [
          "int_armour",
          "boots",
          "armour",
          "default"
      ],
      "visualIdentity": {
          "ddsFile": "Art/2DItems/Armours/Boots/BootsInt4.dds",
          "id": "BootsInt4"
      }
  },
  {
      "id": "Metadata/Items/Armours/Boots/BootsStr9",
      "name": "Titan Greaves",
      "itemClass": "Boots",
      "dropLevel": 68,
      "inventoryWidth": 2,
      "inventoryHeight": 2,
      "requirements": {
          "level": 68,
          "strength": 120,
          "dexterity": 0,
          "intelligence": 0
      },
      "properties": {
          "armour": {
              "max": 278,
              "min": 241
          }
      },
      "implicits": [],
      "tags": [
          "str_armour",
          "boots",
          "armour",
          "default"
      ],
      "visualIdentity": {
          "ddsFile": "Art/2DItems/Armours/Boots/BootsStr4.dds",
          "id": "BootsStr4"
      }
  },
  {
      "id": "Metadata/Items/Armours/Boots/BootsDex9",
      "name": "Slink Boots",
      "itemClass": "Boots",
      "dropLevel": 69,
      "inventoryWidth": 2,
      "inventoryHeight": 2,
      "requirements": {
          "level": 69,
          "strength": 0,
          "dexterity": 120,
          "intelligence": 0
      },
      "properties": {
          "evasion": {
              "max": 283,
              "min": 246
          }
      },
      "implicits": [],
      "tags": [
          "dex_armour",
          "boots",
          "armour",
          "default"
      ],
      "visualIdentity": {
          "ddsFile": "Art/2DItems/Armours/Boots/BootsDex4.dds",
          "id": "BootsDex4"
      }
  },
  {
      "id": "Metadata/Items/Armours/Boots/BootsDexInt9",
      "name": "Murder Boots",
      "itemClass": "Boots",
      "dropLevel": 69,
      "inventoryWidth": 2,
      "inventoryHeight": 2,
      "requirements": {
          "level": 69,
          "strength": 0,
          "dexterity": 82,
          "intelligence": 42
      },
      "properties": {
          "energy_shield": {
              "max": 21,
              "min": 18
          },
          "evasion": {
              "max": 213,
              "min": 185
          }
      },
      "implicits": [],
      "tags": [
          "dex_int_armour",
          "boots",
          "armour",
          "default"
      ],
      "visualIdentity": {
          "ddsFile": "Art/2DItems/Armours/Boots/BootsDexInt4.dds",
          "id": "BootsDexInt4"
      }
  },
  {
      "id": "Metadata/Items/Armours/Boots/BootsAtlas1",
      "name": "Two-Toned Boots",
      "itemClass": "Boots",
      "dropLevel": 70,
      "inventoryWidth": 2,
      "inventoryHeight": 2,
      "requirements": {
          "level": 70,
          "strength": 0,
          "dexterity": 62,
          "intelligence": 62
      },
      "properties": {
          "energy_shield": {
              "max": 30,
              "min": 26
          },
          "evasion": {
              "max": 145,
              "min": 126
          }
      },
      "implicits": [
          "ColdAndLightningResistImplicitBoots1"
      ],
      "tags": [
          "not_for_sale",
          "atlas_base_type",
          "bootsatlas1",
          "dex_int_armour",
          "boots",
          "armour",
          "default"
      ],
      "visualIdentity": {
          "ddsFile": "Art/2DItems/Armours/Boots/TwoTonedBoots.dds",
          "id": "BootsAtlas1"
      }
  },
  {
      "id": "Metadata/Items/Armours/Boots/BootsAtlas2",
      "name": "Two-Toned Boots",
      "itemClass": "Boots",
      "dropLevel": 70,
      "inventoryWidth": 2,
      "inventoryHeight": 2,
      "requirements": {
          "level": 70,
          "strength": 62,
          "dexterity": 62,
          "intelligence": 0
      },
      "properties": {
          "armour": {
              "max": 145,
              "min": 126
          },
          "evasion": {
              "max": 145,
              "min": 126
          }
      },
      "implicits": [
          "FireAndColdResistImplicitBoots1_"
      ],
      "tags": [
          "not_for_sale",
          "atlas_base_type",
          "bootsatlas2",
          "str_dex_armour",
          "boots",
          "armour",
          "default"
      ],
      "visualIdentity": {
          "ddsFile": "Art/2DItems/Armours/Boots/TwoTonedBoots2B.dds",
          "id": "BootsAtlas2"
      }
  },
  {
      "id": "Metadata/Items/Armours/Boots/BootsAtlas3",
      "name": "Two-Toned Boots",
      "itemClass": "Boots",
      "dropLevel": 70,
      "inventoryWidth": 2,
      "inventoryHeight": 2,
      "requirements": {
          "level": 70,
          "strength": 62,
          "dexterity": 0,
          "intelligence": 62
      },
      "properties": {
          "armour": {
              "max": 145,
              "min": 126
          },
          "energy_shield": {
              "max": 30,
              "min": 26
          }
      },
      "implicits": [
          "FireAndLightningResistImplicitBoots1"
      ],
      "tags": [
          "not_for_sale",
          "atlas_base_type",
          "bootsatlas3",
          "str_int_armour",
          "boots",
          "armour",
          "default"
      ],
      "visualIdentity": {
          "ddsFile": "Art/2DItems/Armours/Boots/TwoTonedBoots3B.dds",
          "id": "BootsAtlas3"
      }
  },
  {
      "id": "Metadata/Items/Armours/Boots/BootsAtlas4",
      "name": "Fugitive Boots",
      "itemClass": "Boots",
      "dropLevel": 70,
      "inventoryWidth": 2,
      "inventoryHeight": 2,
      "requirements": {
          "level": 70,
          "strength": 0,
          "dexterity": 56,
          "intelligence": 76
      },
      "properties": {
          "energy_shield": {
              "max": 37,
              "min": 32
          },
          "evasion": {
              "max": 129,
              "min": 112
          }
      },
      "implicits": [
          "ChaosResistImplicitBoots1"
      ],
      "tags": [
          "not_for_sale",
          "atlas_base_type",
          "bootsatlasdexint",
          "dex_int_armour",
          "boots",
          "armour",
          "default"
      ],
      "visualIdentity": {
          "ddsFile": "Art/2DItems/Armours/Boots/HalfTonedBoots.dds",
          "id": "BootsAtlas4_"
      }
  },
];

// Bow (23 items)
export const BOW_BASES: PoeBaseItem[] = [
  {
      "id": "Metadata/Items/Weapons/TwoHandWeapons/Bows/Bow1",
      "name": "Crude Bow",
      "itemClass": "Bow",
      "dropLevel": 1,
      "inventoryWidth": 2,
      "inventoryHeight": 3,
      "requirements": {
          "level": 1,
          "strength": 0,
          "dexterity": 14,
          "intelligence": 0
      },
      "properties": {
          "attack_time": 714,
          "critical_strike_chance": 500,
          "physical_damage_max": 13,
          "physical_damage_min": 5,
          "range": 120
      },
      "implicits": [],
      "tags": [
          "bow",
          "ranged",
          "two_hand_weapon",
          "twohand",
          "weapon",
          "default"
      ],
      "visualIdentity": {
          "ddsFile": "Art/2DItems/Weapons/TwoHandWeapons/Bows/Bow1.dds",
          "id": "Bow1"
      }
  },
  {
      "id": "Metadata/Items/Weapons/TwoHandWeapons/Bows/Bow1Royale",
      "name": "Crude Bow",
      "itemClass": "Bow",
      "dropLevel": 1,
      "inventoryWidth": 2,
      "inventoryHeight": 3,
      "requirements": {
          "level": 1,
          "strength": 0,
          "dexterity": 14,
          "intelligence": 0
      },
      "properties": {
          "attack_time": 741,
          "critical_strike_chance": 500,
          "physical_damage_max": 10,
          "physical_damage_min": 4,
          "range": 120
      },
      "implicits": [],
      "tags": [
          "bow",
          "ranged",
          "two_hand_weapon",
          "twohand",
          "weapon",
          "default"
      ],
      "visualIdentity": {
          "ddsFile": "Art/2DItems/Weapons/TwoHandWeapons/Bows/Bow1.dds",
          "id": "Bow1"
      }
  },
  {
      "id": "Metadata/Items/Weapons/TwoHandWeapons/Bows/Bow2",
      "name": "Short Bow",
      "itemClass": "Bow",
      "dropLevel": 5,
      "inventoryWidth": 2,
      "inventoryHeight": 3,
      "requirements": {
          "level": 5,
          "strength": 0,
          "dexterity": 26,
          "intelligence": 0
      },
      "properties": {
          "attack_time": 667,
          "critical_strike_chance": 500,
          "physical_damage_max": 16,
          "physical_damage_min": 6,
          "range": 120
      },
      "implicits": [],
      "tags": [
          "bow",
          "ranged",
          "two_hand_weapon",
          "twohand",
          "weapon",
          "default"
      ],
      "visualIdentity": {
          "ddsFile": "Art/2DItems/Weapons/TwoHandWeapons/Bows/Bow2.dds",
          "id": "Bow2"
      }
  },
  {
      "id": "Metadata/Items/Weapons/TwoHandWeapons/Bows/Bow3",
      "name": "Long Bow",
      "itemClass": "Bow",
      "dropLevel": 9,
      "inventoryWidth": 2,
      "inventoryHeight": 4,
      "requirements": {
          "level": 9,
          "strength": 0,
          "dexterity": 38,
          "intelligence": 0
      },
      "properties": {
          "attack_time": 769,
          "critical_strike_chance": 600,
          "physical_damage_max": 33,
          "physical_damage_min": 8,
          "range": 120
      },
      "implicits": [],
      "tags": [
          "bow",
          "ranged",
          "two_hand_weapon",
          "twohand",
          "weapon",
          "default"
      ],
      "visualIdentity": {
          "ddsFile": "Art/2DItems/Weapons/TwoHandWeapons/Bows/Bow3.dds",
          "id": "Bow3"
      }
  },
  {
      "id": "Metadata/Items/Weapons/TwoHandWeapons/Bows/Bow4",
      "name": "Composite Bow",
      "itemClass": "Bow",
      "dropLevel": 14,
      "inventoryWidth": 2,
      "inventoryHeight": 4,
      "requirements": {
          "level": 14,
          "strength": 0,
          "dexterity": 53,
          "intelligence": 0
      },
      "properties": {
          "attack_time": 769,
          "critical_strike_chance": 600,
          "physical_damage_max": 34,
          "physical_damage_min": 16,
          "range": 120
      },
      "implicits": [],
      "tags": [
          "bow",
          "ranged",
          "two_hand_weapon",
          "twohand",
          "weapon",
          "default"
      ],
      "visualIdentity": {
          "ddsFile": "Art/2DItems/Weapons/TwoHandWeapons/Bows/Bow4.dds",
          "id": "Bow4"
      }
  },
  {
      "id": "Metadata/Items/Weapons/TwoHandWeapons/Bows/Bow5",
      "name": "Recurve Bow",
      "itemClass": "Bow",
      "dropLevel": 18,
      "inventoryWidth": 2,
      "inventoryHeight": 4,
      "requirements": {
          "level": 18,
          "strength": 0,
          "dexterity": 65,
          "intelligence": 0
      },
      "properties": {
          "attack_time": 800,
          "critical_strike_chance": 670,
          "physical_damage_max": 45,
          "physical_damage_min": 15,
          "range": 120
      },
      "implicits": [
          "CriticalMultiplierImplicitBow1"
      ],
      "tags": [
          "bow",
          "ranged",
          "two_hand_weapon",
          "twohand",
          "weapon",
          "default"
      ],
      "visualIdentity": {
          "ddsFile": "Art/2DItems/Weapons/TwoHandWeapons/Bows/Bow5.dds",
          "id": "Bow5"
      }
  },
  {
      "id": "Metadata/Items/Weapons/TwoHandWeapons/Bows/Bow6",
      "name": "Bone Bow",
      "itemClass": "Bow",
      "dropLevel": 23,
      "inventoryWidth": 2,
      "inventoryHeight": 4,
      "requirements": {
          "level": 23,
          "strength": 0,
          "dexterity": 80,
          "intelligence": 0
      },
      "properties": {
          "attack_time": 714,
          "critical_strike_chance": 650,
          "physical_damage_max": 45,
          "physical_damage_min": 15,
          "range": 120
      },
      "implicits": [],
      "tags": [
          "bow",
          "ranged",
          "two_hand_weapon",
          "twohand",
          "weapon",
          "default"
      ],
      "visualIdentity": {
          "ddsFile": "Art/2DItems/Weapons/TwoHandWeapons/Bows/Bow6.dds",
          "id": "Bow6"
      }
  },
  {
      "id": "Metadata/Items/Weapons/TwoHandWeapons/Bows/Bow7",
      "name": "Royal Bow",
      "itemClass": "Bow",
      "dropLevel": 28,
      "inventoryWidth": 2,
      "inventoryHeight": 4,
      "requirements": {
          "level": 28,
          "strength": 0,
          "dexterity": 95,
          "intelligence": 0
      },
      "properties": {
          "attack_time": 690,
          "critical_strike_chance": 500,
          "physical_damage_max": 56,
          "physical_damage_min": 14,
          "range": 120
      },
      "implicits": [
          "WeaponElementalDamageImplicitBow1"
      ],
      "tags": [
          "bow",
          "ranged",
          "two_hand_weapon",
          "twohand",
          "weapon",
          "default"
      ],
      "visualIdentity": {
          "ddsFile": "Art/2DItems/Weapons/TwoHandWeapons/Bows/Bow7.dds",
          "id": "Bow7"
      }
  },
  {
      "id": "Metadata/Items/Weapons/TwoHandWeapons/Bows/Bow8",
      "name": "Death Bow",
      "itemClass": "Bow",
      "dropLevel": 32,
      "inventoryWidth": 2,
      "inventoryHeight": 4,
      "requirements": {
          "level": 32,
          "strength": 0,
          "dexterity": 107,
          "intelligence": 0
      },
      "properties": {
          "attack_time": 833,
          "critical_strike_chance": 500,
          "physical_damage_max": 73,
          "physical_damage_min": 28,
          "range": 120
      },
      "implicits": [
          "LocalCriticalStrikeChanceImplicitBow1"
      ],
      "tags": [
          "bow",
          "ranged",
          "two_hand_weapon",
          "twohand",
          "weapon",
          "default"
      ],
      "visualIdentity": {
          "ddsFile": "Art/2DItems/Weapons/TwoHandWeapons/Bows/Bow8.dds",
          "id": "Bow8"
      }
  },
  {
      "id": "Metadata/Items/Weapons/TwoHandWeapons/Bows/Bow9",
      "name": "Grove Bow",
      "itemClass": "Bow",
      "dropLevel": 35,
      "inventoryWidth": 2,
      "inventoryHeight": 3,
      "requirements": {
          "level": 35,
          "strength": 0,
          "dexterity": 116,
          "intelligence": 0
      },
      "properties": {
          "attack_time": 667,
          "critical_strike_chance": 500,
          "physical_damage_max": 61,
          "physical_damage_min": 20,
          "range": 120
      },
      "implicits": [],
      "tags": [
          "bow",
          "ranged",
          "two_hand_weapon",
          "twohand",
          "weapon",
          "default"
      ],
      "visualIdentity": {
          "ddsFile": "Art/2DItems/Weapons/TwoHandWeapons/Bows/Bow2.dds",
          "id": "Bow2"
      }
  },
  {
      "id": "Metadata/Items/Weapons/TwoHandWeapons/Bows/Bow10",
      "name": "Decurve Bow",
      "itemClass": "Bow",
      "dropLevel": 38,
      "inventoryWidth": 2,
      "inventoryHeight": 4,
      "requirements": {
          "level": 38,
          "strength": 0,
          "dexterity": 125,
          "intelligence": 0
      },
      "properties": {
          "attack_time": 800,
          "critical_strike_chance": 600,
          "physical_damage_max": 96,
          "physical_damage_min": 24,
          "range": 120
      },
      "implicits": [],
      "tags": [
          "bow",
          "ranged",
          "two_hand_weapon",
          "twohand",
          "weapon",
          "default"
      ],
      "visualIdentity": {
          "ddsFile": "Art/2DItems/Weapons/TwoHandWeapons/Bows/Bow3.dds",
          "id": "Bow3"
      }
  },
  {
      "id": "Metadata/Items/Weapons/TwoHandWeapons/Bows/Bow11",
      "name": "Compound Bow",
      "itemClass": "Bow",
      "dropLevel": 41,
      "inventoryWidth": 2,
      "inventoryHeight": 4,
      "requirements": {
          "level": 41,
          "strength": 0,
          "dexterity": 134,
          "intelligence": 0
      },
      "properties": {
          "attack_time": 769,
          "critical_strike_chance": 600,
          "physical_damage_max": 76,
          "physical_damage_min": 37,
          "range": 120
      },
      "implicits": [],
      "tags": [
          "bow",
          "ranged",
          "two_hand_weapon",
          "twohand",
          "weapon",
          "default"
      ],
      "visualIdentity": {
          "ddsFile": "Art/2DItems/Weapons/TwoHandWeapons/Bows/Bow4.dds",
          "id": "Bow4"
      }
  },
  {
      "id": "Metadata/Items/Weapons/TwoHandWeapons/Bows/Bow12",
      "name": "Sniper Bow",
      "itemClass": "Bow",
      "dropLevel": 44,
      "inventoryWidth": 2,
      "inventoryHeight": 4,
      "requirements": {
          "level": 44,
          "strength": 0,
          "dexterity": 143,
          "intelligence": 0
      },
      "properties": {
          "attack_time": 800,
          "critical_strike_chance": 670,
          "physical_damage_max": 96,
          "physical_damage_min": 32,
          "range": 120
      },
      "implicits": [
          "CriticalMultiplierImplicitBow1"
      ],
      "tags": [
          "bow",
          "ranged",
          "two_hand_weapon",
          "twohand",
          "weapon",
          "default"
      ],
      "visualIdentity": {
          "ddsFile": "Art/2DItems/Weapons/TwoHandWeapons/Bows/Bow5.dds",
          "id": "Bow5"
      }
  },
  {
      "id": "Metadata/Items/Weapons/TwoHandWeapons/Bows/Bow13",
      "name": "Ivory Bow",
      "itemClass": "Bow",
      "dropLevel": 47,
      "inventoryWidth": 2,
      "inventoryHeight": 4,
      "requirements": {
          "level": 47,
          "strength": 0,
          "dexterity": 152,
          "intelligence": 0
      },
      "properties": {
          "attack_time": 714,
          "critical_strike_chance": 650,
          "physical_damage_max": 86,
          "physical_damage_min": 29,
          "range": 120
      },
      "implicits": [],
      "tags": [
          "bow",
          "ranged",
          "two_hand_weapon",
          "twohand",
          "weapon",
          "default"
      ],
      "visualIdentity": {
          "ddsFile": "Art/2DItems/Weapons/TwoHandWeapons/Bows/Bow6.dds",
          "id": "Bow6"
      }
  },
  {
      "id": "Metadata/Items/Weapons/TwoHandWeapons/Bows/Bow14",
      "name": "Highborn Bow",
      "itemClass": "Bow",
      "dropLevel": 50,
      "inventoryWidth": 2,
      "inventoryHeight": 4,
      "requirements": {
          "level": 50,
          "strength": 0,
          "dexterity": 161,
          "intelligence": 0
      },
      "properties": {
          "attack_time": 690,
          "critical_strike_chance": 500,
          "physical_damage_max": 94,
          "physical_damage_min": 24,
          "range": 120
      },
      "implicits": [
          "WeaponElementalDamageImplicitBow1"
      ],
      "tags": [
          "bow",
          "ranged",
          "two_hand_weapon",
          "twohand",
          "weapon",
          "default"
      ],
      "visualIdentity": {
          "ddsFile": "Art/2DItems/Weapons/TwoHandWeapons/Bows/Bow7.dds",
          "id": "Bow7"
      }
  },
  {
      "id": "Metadata/Items/Weapons/TwoHandWeapons/Bows/Bow15",
      "name": "Decimation Bow",
      "itemClass": "Bow",
      "dropLevel": 53,
      "inventoryWidth": 2,
      "inventoryHeight": 4,
      "requirements": {
          "level": 53,
          "strength": 0,
          "dexterity": 170,
          "intelligence": 0
      },
      "properties": {
          "attack_time": 833,
          "critical_strike_chance": 500,
          "physical_damage_max": 116,
          "physical_damage_min": 44,
          "range": 120
      },
      "implicits": [
          "LocalCriticalStrikeChanceImplicitBow1"
      ],
      "tags": [
          "bow",
          "ranged",
          "two_hand_weapon",
          "twohand",
          "weapon",
          "default"
      ],
      "visualIdentity": {
          "ddsFile": "Art/2DItems/Weapons/TwoHandWeapons/Bows/Bow8.dds",
          "id": "Bow8"
      }
  },
  {
      "id": "Metadata/Items/Weapons/TwoHandWeapons/Bows/Bow16",
      "name": "Thicket Bow",
      "itemClass": "Bow",
      "dropLevel": 56,
      "inventoryWidth": 2,
      "inventoryHeight": 3,
      "requirements": {
          "level": 56,
          "strength": 0,
          "dexterity": 179,
          "intelligence": 0
      },
      "properties": {
          "attack_time": 667,
          "critical_strike_chance": 500,
          "physical_damage_max": 96,
          "physical_damage_min": 32,
          "range": 120
      },
      "implicits": [],
      "tags": [
          "bow",
          "ranged",
          "two_hand_weapon",
          "twohand",
          "weapon",
          "default"
      ],
      "visualIdentity": {
          "ddsFile": "Art/2DItems/Weapons/TwoHandWeapons/Bows/Bow2.dds",
          "id": "Bow2"
      }
  },
  {
      "id": "Metadata/Items/Weapons/TwoHandWeapons/Bows/Bow17",
      "name": "Citadel Bow",
      "itemClass": "Bow",
      "dropLevel": 58,
      "inventoryWidth": 2,
      "inventoryHeight": 4,
      "requirements": {
          "level": 58,
          "strength": 0,
          "dexterity": 185,
          "intelligence": 0
      },
      "properties": {
          "attack_time": 800,
          "critical_strike_chance": 600,
          "physical_damage_max": 144,
          "physical_damage_min": 36,
          "range": 120
      },
      "implicits": [],
      "tags": [
          "bow",
          "ranged",
          "two_hand_weapon",
          "twohand",
          "weapon",
          "default"
      ],
      "visualIdentity": {
          "ddsFile": "Art/2DItems/Weapons/TwoHandWeapons/Bows/Bow3.dds",
          "id": "Bow3"
      }
  },
  {
      "id": "Metadata/Items/Weapons/TwoHandWeapons/Bows/Bow18",
      "name": "Ranger Bow",
      "itemClass": "Bow",
      "dropLevel": 60,
      "inventoryWidth": 2,
      "inventoryHeight": 4,
      "requirements": {
          "level": 60,
          "strength": 0,
          "dexterity": 212,
          "intelligence": 0
      },
      "properties": {
          "attack_time": 769,
          "critical_strike_chance": 600,
          "physical_damage_max": 117,
          "physical_damage_min": 56,
          "range": 120
      },
      "implicits": [],
      "tags": [
          "bow",
          "ranged",
          "two_hand_weapon",
          "twohand",
          "weapon",
          "default"
      ],
      "visualIdentity": {
          "ddsFile": "Art/2DItems/Weapons/TwoHandWeapons/Bows/Bow4.dds",
          "id": "Bow4"
      }
  },
  {
      "id": "Metadata/Items/Weapons/TwoHandWeapons/Bows/Bow19",
      "name": "Assassin Bow",
      "itemClass": "Bow",
      "dropLevel": 62,
      "inventoryWidth": 2,
      "inventoryHeight": 4,
      "requirements": {
          "level": 62,
          "strength": 0,
          "dexterity": 212,
          "intelligence": 0
      },
      "properties": {
          "attack_time": 800,
          "critical_strike_chance": 670,
          "physical_damage_max": 130,
          "physical_damage_min": 43,
          "range": 120
      },
      "implicits": [
          "CriticalMultiplierImplicitBow1"
      ],
      "tags": [
          "bow",
          "ranged",
          "two_hand_weapon",
          "twohand",
          "weapon",
          "default"
      ],
      "visualIdentity": {
          "ddsFile": "Art/2DItems/Weapons/TwoHandWeapons/Bows/Bow5.dds",
          "id": "Bow5"
      }
  },
  {
      "id": "Metadata/Items/Weapons/TwoHandWeapons/Bows/Bow20",
      "name": "Spine Bow",
      "itemClass": "Bow",
      "dropLevel": 64,
      "inventoryWidth": 2,
      "inventoryHeight": 4,
      "requirements": {
          "level": 64,
          "strength": 0,
          "dexterity": 212,
          "intelligence": 0
      },
      "properties": {
          "attack_time": 714,
          "critical_strike_chance": 650,
          "physical_damage_max": 115,
          "physical_damage_min": 38,
          "range": 120
      },
      "implicits": [],
      "tags": [
          "bow",
          "ranged",
          "two_hand_weapon",
          "twohand",
          "weapon",
          "default"
      ],
      "visualIdentity": {
          "ddsFile": "Art/2DItems/Weapons/TwoHandWeapons/Bows/Bow6.dds",
          "id": "Bow6"
      }
  },
  {
      "id": "Metadata/Items/Weapons/TwoHandWeapons/Bows/Bow21",
      "name": "Imperial Bow",
      "itemClass": "Bow",
      "dropLevel": 66,
      "inventoryWidth": 2,
      "inventoryHeight": 4,
      "requirements": {
          "level": 66,
          "strength": 0,
          "dexterity": 212,
          "intelligence": 0
      },
      "properties": {
          "attack_time": 690,
          "critical_strike_chance": 500,
          "physical_damage_max": 117,
          "physical_damage_min": 29,
          "range": 120
      },
      "implicits": [
          "WeaponElementalDamageImplicitBow1"
      ],
      "tags": [
          "bow",
          "ranged",
          "two_hand_weapon",
          "twohand",
          "weapon",
          "default"
      ],
      "visualIdentity": {
          "ddsFile": "Art/2DItems/Weapons/TwoHandWeapons/Bows/Bow7.dds",
          "id": "Bow7"
      }
  },
  {
      "id": "Metadata/Items/Weapons/TwoHandWeapons/Bows/Bow22",
      "name": "Harbinger Bow",
      "itemClass": "Bow",
      "dropLevel": 68,
      "inventoryWidth": 2,
      "inventoryHeight": 4,
      "requirements": {
          "level": 68,
          "strength": 0,
          "dexterity": 212,
          "intelligence": 0
      },
      "properties": {
          "attack_time": 833,
          "critical_strike_chance": 500,
          "physical_damage_max": 133,
          "physical_damage_min": 50,
          "range": 120
      },
      "implicits": [
          "LocalCriticalStrikeChanceImplicitBow1"
      ],
      "tags": [
          "bow",
          "ranged",
          "two_hand_weapon",
          "twohand",
          "weapon",
          "default"
      ],
      "visualIdentity": {
          "ddsFile": "Art/2DItems/Weapons/TwoHandWeapons/Bows/Bow8.dds",
          "id": "Bow8"
      }
  },
];

// Claw (22 items)
export const CLAW_BASES: PoeBaseItem[] = [
  {
      "id": "Metadata/Items/Weapons/OneHandWeapons/Claws/Claw1",
      "name": "Nailed Fist",
      "itemClass": "Claw",
      "dropLevel": 3,
      "inventoryWidth": 2,
      "inventoryHeight": 2,
      "requirements": {
          "level": 3,
          "strength": 0,
          "dexterity": 11,
          "intelligence": 11
      },
      "properties": {
          "attack_time": 625,
          "critical_strike_chance": 620,
          "physical_damage_max": 11,
          "physical_damage_min": 4,
          "range": 11
      },
      "implicits": [
          "LifeGainPerTargetImplicit2Claw1"
      ],
      "tags": [
          "claw",
          "one_hand_weapon",
          "onehand",
          "weapon",
          "default"
      ],
      "visualIdentity": {
          "ddsFile": "Art/2DItems/Weapons/OneHandWeapons/Claws/Claw1.dds",
          "id": "Claw1"
      }
  },
  {
      "id": "Metadata/Items/Weapons/OneHandWeapons/Claws/Claw2",
      "name": "Sharktooth Claw",
      "itemClass": "Claw",
      "dropLevel": 7,
      "inventoryWidth": 2,
      "inventoryHeight": 2,
      "requirements": {
          "level": 7,
          "strength": 0,
          "dexterity": 14,
          "intelligence": 20
      },
      "properties": {
          "attack_time": 667,
          "critical_strike_chance": 650,
          "physical_damage_max": 17,
          "physical_damage_min": 6,
          "range": 11
      },
      "implicits": [
          "LifeGainPerTargetImplicit2Claw2"
      ],
      "tags": [
          "claw",
          "one_hand_weapon",
          "onehand",
          "weapon",
          "default"
      ],
      "visualIdentity": {
          "ddsFile": "Art/2DItems/Weapons/OneHandWeapons/Claws/Claw2.dds",
          "id": "Claw2"
      }
  },
  {
      "id": "Metadata/Items/Weapons/OneHandWeapons/Claws/Claw3",
      "name": "Awl",
      "itemClass": "Claw",
      "dropLevel": 12,
      "inventoryWidth": 2,
      "inventoryHeight": 2,
      "requirements": {
          "level": 12,
          "strength": 0,
          "dexterity": 25,
          "intelligence": 25
      },
      "properties": {
          "attack_time": 645,
          "critical_strike_chance": 630,
          "physical_damage_max": 23,
          "physical_damage_min": 7,
          "range": 11
      },
      "implicits": [
          "LifeGainPerTargetImplicit2Claw3"
      ],
      "tags": [
          "claw",
          "one_hand_weapon",
          "onehand",
          "weapon",
          "default"
      ],
      "visualIdentity": {
          "ddsFile": "Art/2DItems/Weapons/OneHandWeapons/Claws/Claw3.dds",
          "id": "Claw3"
      }
  },
  {
      "id": "Metadata/Items/Weapons/OneHandWeapons/Claws/Claw4",
      "name": "Cat's Paw",
      "itemClass": "Claw",
      "dropLevel": 17,
      "inventoryWidth": 2,
      "inventoryHeight": 2,
      "requirements": {
          "level": 17,
          "strength": 0,
          "dexterity": 39,
          "intelligence": 27
      },
      "properties": {
          "attack_time": 625,
          "critical_strike_chance": 600,
          "physical_damage_max": 22,
          "physical_damage_min": 12,
          "range": 11
      },
      "implicits": [
          "LifeGainPerTargetImplicit2Claw3_1"
      ],
      "tags": [
          "claw",
          "one_hand_weapon",
          "onehand",
          "weapon",
          "default"
      ],
      "visualIdentity": {
          "ddsFile": "Art/2DItems/Weapons/OneHandWeapons/Claws/Claw4.dds",
          "id": "Claw4"
      }
  },
  {
      "id": "Metadata/Items/Weapons/OneHandWeapons/Claws/Claw5",
      "name": "Blinder",
      "itemClass": "Claw",
      "dropLevel": 22,
      "inventoryWidth": 2,
      "inventoryHeight": 2,
      "requirements": {
          "level": 22,
          "strength": 0,
          "dexterity": 41,
          "intelligence": 41
      },
      "properties": {
          "attack_time": 645,
          "critical_strike_chance": 630,
          "physical_damage_max": 31,
          "physical_damage_min": 12,
          "range": 11
      },
      "implicits": [
          "LifeGainPerTargetImplicit2Claw4"
      ],
      "tags": [
          "claw",
          "one_hand_weapon",
          "onehand",
          "weapon",
          "default"
      ],
      "visualIdentity": {
          "ddsFile": "Art/2DItems/Weapons/OneHandWeapons/Claws/Claw5.dds",
          "id": "Claw5"
      }
  },
  {
      "id": "Metadata/Items/Weapons/OneHandWeapons/Claws/Claw6",
      "name": "Timeworn Claw",
      "itemClass": "Claw",
      "dropLevel": 26,
      "inventoryWidth": 2,
      "inventoryHeight": 2,
      "requirements": {
          "level": 26,
          "strength": 0,
          "dexterity": 39,
          "intelligence": 56
      },
      "properties": {
          "attack_time": 769,
          "critical_strike_chance": 650,
          "physical_damage_max": 43,
          "physical_damage_min": 16,
          "range": 11
      },
      "implicits": [
          "LifeGainPerTargetImplicit2Claw4_1"
      ],
      "tags": [
          "claw",
          "one_hand_weapon",
          "onehand",
          "weapon",
          "default"
      ],
      "visualIdentity": {
          "ddsFile": "Art/2DItems/Weapons/OneHandWeapons/Claws/Claw6.dds",
          "id": "Claw6"
      }
  },
  {
      "id": "Metadata/Items/Weapons/OneHandWeapons/Claws/Claw7",
      "name": "Sparkling Claw",
      "itemClass": "Claw",
      "dropLevel": 30,
      "inventoryWidth": 2,
      "inventoryHeight": 2,
      "requirements": {
          "level": 30,
          "strength": 0,
          "dexterity": 64,
          "intelligence": 44
      },
      "properties": {
          "attack_time": 625,
          "critical_strike_chance": 600,
          "physical_damage_max": 38,
          "physical_damage_min": 14,
          "range": 11
      },
      "implicits": [
          "LifeGainPerTargetImplicit2Claw5"
      ],
      "tags": [
          "claw",
          "one_hand_weapon",
          "onehand",
          "weapon",
          "default"
      ],
      "visualIdentity": {
          "ddsFile": "Art/2DItems/Weapons/OneHandWeapons/Claws/Claw7.dds",
          "id": "Claw7"
      }
  },
  {
      "id": "Metadata/Items/Weapons/OneHandWeapons/Claws/Claw8",
      "name": "Fright Claw",
      "itemClass": "Claw",
      "dropLevel": 34,
      "inventoryWidth": 2,
      "inventoryHeight": 2,
      "requirements": {
          "level": 34,
          "strength": 0,
          "dexterity": 61,
          "intelligence": 61
      },
      "properties": {
          "attack_time": 667,
          "critical_strike_chance": 630,
          "physical_damage_max": 46,
          "physical_damage_min": 12,
          "range": 11
      },
      "implicits": [
          "LifeGainPerTargetImplicit2Claw5_1"
      ],
      "tags": [
          "claw",
          "one_hand_weapon",
          "onehand",
          "weapon",
          "default"
      ],
      "visualIdentity": {
          "ddsFile": "Art/2DItems/Weapons/OneHandWeapons/Claws/Claw8.dds",
          "id": "Claw8"
      }
  },
  {
      "id": "Metadata/Items/Weapons/OneHandWeapons/Claws/Claw9",
      "name": "Thresher Claw",
      "itemClass": "Claw",
      "dropLevel": 37,
      "inventoryWidth": 2,
      "inventoryHeight": 2,
      "requirements": {
          "level": 37,
          "strength": 0,
          "dexterity": 53,
          "intelligence": 77
      },
      "properties": {
          "attack_time": 769,
          "critical_strike_chance": 650,
          "physical_damage_max": 53,
          "physical_damage_min": 20,
          "range": 11
      },
      "implicits": [
          "LifeGainPerTargetImplicit2Claw6"
      ],
      "tags": [
          "claw",
          "one_hand_weapon",
          "onehand",
          "weapon",
          "default"
      ],
      "visualIdentity": {
          "ddsFile": "Art/2DItems/Weapons/OneHandWeapons/Claws/Claw2.dds",
          "id": "Claw2"
      }
  },
  {
      "id": "Metadata/Items/Weapons/OneHandWeapons/Claws/Claw10",
      "name": "Gouger",
      "itemClass": "Claw",
      "dropLevel": 40,
      "inventoryWidth": 2,
      "inventoryHeight": 2,
      "requirements": {
          "level": 40,
          "strength": 0,
          "dexterity": 70,
          "intelligence": 70
      },
      "properties": {
          "attack_time": 667,
          "critical_strike_chance": 630,
          "physical_damage_max": 51,
          "physical_damage_min": 15,
          "range": 11
      },
      "implicits": [
          "LifeGainPerTargetImplicit2Claw7"
      ],
      "tags": [
          "claw",
          "one_hand_weapon",
          "onehand",
          "weapon",
          "default"
      ],
      "visualIdentity": {
          "ddsFile": "Art/2DItems/Weapons/OneHandWeapons/Claws/Claw3.dds",
          "id": "Claw3"
      }
  },
  {
      "id": "Metadata/Items/Weapons/OneHandWeapons/Claws/Claw11",
      "name": "Tiger's Paw",
      "itemClass": "Claw",
      "dropLevel": 43,
      "inventoryWidth": 2,
      "inventoryHeight": 2,
      "requirements": {
          "level": 43,
          "strength": 0,
          "dexterity": 88,
          "intelligence": 61
      },
      "properties": {
          "attack_time": 625,
          "critical_strike_chance": 600,
          "physical_damage_max": 43,
          "physical_damage_min": 23,
          "range": 11
      },
      "implicits": [
          "LifeLeechPermyriadImplicitClaw1"
      ],
      "tags": [
          "claw",
          "one_hand_weapon",
          "onehand",
          "weapon",
          "default"
      ],
      "visualIdentity": {
          "ddsFile": "Art/2DItems/Weapons/OneHandWeapons/Claws/Claw4.dds",
          "id": "Claw4"
      }
  },
  {
      "id": "Metadata/Items/Weapons/OneHandWeapons/Claws/Claw12",
      "name": "Gut Ripper",
      "itemClass": "Claw",
      "dropLevel": 46,
      "inventoryWidth": 2,
      "inventoryHeight": 2,
      "requirements": {
          "level": 46,
          "strength": 0,
          "dexterity": 80,
          "intelligence": 80
      },
      "properties": {
          "attack_time": 667,
          "critical_strike_chance": 630,
          "physical_damage_max": 53,
          "physical_damage_min": 20,
          "range": 11
      },
      "implicits": [
          "LifeGainPerTargetImplicit2Claw8"
      ],
      "tags": [
          "claw",
          "one_hand_weapon",
          "onehand",
          "weapon",
          "default"
      ],
      "visualIdentity": {
          "ddsFile": "Art/2DItems/Weapons/OneHandWeapons/Claws/Claw5.dds",
          "id": "Claw5"
      }
  },
  {
      "id": "Metadata/Items/Weapons/OneHandWeapons/Claws/Claw13",
      "name": "Prehistoric Claw",
      "itemClass": "Claw",
      "dropLevel": 49,
      "inventoryWidth": 2,
      "inventoryHeight": 2,
      "requirements": {
          "level": 49,
          "strength": 0,
          "dexterity": 69,
          "intelligence": 100
      },
      "properties": {
          "attack_time": 769,
          "critical_strike_chance": 650,
          "physical_damage_max": 68,
          "physical_damage_min": 26,
          "range": 11
      },
      "implicits": [
          "LifeLeechPermyriadImplicitClaw2"
      ],
      "tags": [
          "claw",
          "one_hand_weapon",
          "onehand",
          "weapon",
          "default"
      ],
      "visualIdentity": {
          "ddsFile": "Art/2DItems/Weapons/OneHandWeapons/Claws/Claw6.dds",
          "id": "Claw6"
      }
  },
  {
      "id": "Metadata/Items/Weapons/OneHandWeapons/Claws/Claw14",
      "name": "Noble Claw",
      "itemClass": "Claw",
      "dropLevel": 52,
      "inventoryWidth": 2,
      "inventoryHeight": 2,
      "requirements": {
          "level": 52,
          "strength": 0,
          "dexterity": 105,
          "intelligence": 73
      },
      "properties": {
          "attack_time": 625,
          "critical_strike_chance": 600,
          "physical_damage_max": 56,
          "physical_damage_min": 21,
          "range": 11
      },
      "implicits": [
          "LifeGainPerTargetImplicit2Claw9_"
      ],
      "tags": [
          "claw",
          "one_hand_weapon",
          "onehand",
          "weapon",
          "default"
      ],
      "visualIdentity": {
          "ddsFile": "Art/2DItems/Weapons/OneHandWeapons/Claws/Claw7.dds",
          "id": "Claw7"
      }
  },
  {
      "id": "Metadata/Items/Weapons/OneHandWeapons/Claws/Claw15",
      "name": "Eagle Claw",
      "itemClass": "Claw",
      "dropLevel": 55,
      "inventoryWidth": 2,
      "inventoryHeight": 2,
      "requirements": {
          "level": 55,
          "strength": 0,
          "dexterity": 94,
          "intelligence": 94
      },
      "properties": {
          "attack_time": 667,
          "critical_strike_chance": 630,
          "physical_damage_max": 69,
          "physical_damage_min": 17,
          "range": 11
      },
      "implicits": [
          "LifeLeechPermyriadImplicitClaw2"
      ],
      "tags": [
          "claw",
          "one_hand_weapon",
          "onehand",
          "weapon",
          "default"
      ],
      "visualIdentity": {
          "ddsFile": "Art/2DItems/Weapons/OneHandWeapons/Claws/Claw8.dds",
          "id": "Claw8"
      }
  },
  {
      "id": "Metadata/Items/Weapons/OneHandWeapons/Claws/Claw16",
      "name": "Great White Claw",
      "itemClass": "Claw",
      "dropLevel": 58,
      "inventoryWidth": 2,
      "inventoryHeight": 2,
      "requirements": {
          "level": 58,
          "strength": 0,
          "dexterity": 81,
          "intelligence": 117
      },
      "properties": {
          "attack_time": 769,
          "critical_strike_chance": 650,
          "physical_damage_max": 78,
          "physical_damage_min": 30,
          "range": 11
      },
      "implicits": [
          "LifeGainPerTargetImplicit2Claw10"
      ],
      "tags": [
          "claw",
          "one_hand_weapon",
          "onehand",
          "weapon",
          "default"
      ],
      "visualIdentity": {
          "ddsFile": "Art/2DItems/Weapons/OneHandWeapons/Claws/Claw2.dds",
          "id": "Claw2"
      }
  },
  {
      "id": "Metadata/Items/Weapons/OneHandWeapons/Claws/Claw17",
      "name": "Throat Stabber",
      "itemClass": "Claw",
      "dropLevel": 60,
      "inventoryWidth": 2,
      "inventoryHeight": 2,
      "requirements": {
          "level": 60,
          "strength": 0,
          "dexterity": 113,
          "intelligence": 113
      },
      "properties": {
          "attack_time": 667,
          "critical_strike_chance": 630,
          "physical_damage_max": 73,
          "physical_damage_min": 21,
          "range": 11
      },
      "implicits": [
          "LifeGainPerTargetImplicit2Claw11_"
      ],
      "tags": [
          "claw",
          "one_hand_weapon",
          "onehand",
          "weapon",
          "default"
      ],
      "visualIdentity": {
          "ddsFile": "Art/2DItems/Weapons/OneHandWeapons/Claws/Claw3.dds",
          "id": "Claw3"
      }
  },
  {
      "id": "Metadata/Items/Weapons/OneHandWeapons/Claws/Claw18",
      "name": "Hellion's Paw",
      "itemClass": "Claw",
      "dropLevel": 62,
      "inventoryWidth": 2,
      "inventoryHeight": 2,
      "requirements": {
          "level": 62,
          "strength": 0,
          "dexterity": 131,
          "intelligence": 95
      },
      "properties": {
          "attack_time": 625,
          "critical_strike_chance": 600,
          "physical_damage_max": 55,
          "physical_damage_min": 29,
          "range": 11
      },
      "implicits": [
          "LifeLeechPermyriadImplicitClaw1"
      ],
      "tags": [
          "claw",
          "one_hand_weapon",
          "onehand",
          "weapon",
          "default"
      ],
      "visualIdentity": {
          "ddsFile": "Art/2DItems/Weapons/OneHandWeapons/Claws/Claw4.dds",
          "id": "Claw4"
      }
  },
  {
      "id": "Metadata/Items/Weapons/OneHandWeapons/Claws/Claw19",
      "name": "Eye Gouger",
      "itemClass": "Claw",
      "dropLevel": 64,
      "inventoryWidth": 2,
      "inventoryHeight": 2,
      "requirements": {
          "level": 64,
          "strength": 0,
          "dexterity": 113,
          "intelligence": 113
      },
      "properties": {
          "attack_time": 667,
          "critical_strike_chance": 630,
          "physical_damage_max": 68,
          "physical_damage_min": 26,
          "range": 11
      },
      "implicits": [
          "LifeGainPerTargetImplicit2Claw12"
      ],
      "tags": [
          "claw",
          "one_hand_weapon",
          "onehand",
          "weapon",
          "default"
      ],
      "visualIdentity": {
          "ddsFile": "Art/2DItems/Weapons/OneHandWeapons/Claws/Claw5.dds",
          "id": "Claw5"
      }
  },
  {
      "id": "Metadata/Items/Weapons/OneHandWeapons/Claws/Claw20",
      "name": "Vaal Claw",
      "itemClass": "Claw",
      "dropLevel": 66,
      "inventoryWidth": 2,
      "inventoryHeight": 2,
      "requirements": {
          "level": 66,
          "strength": 0,
          "dexterity": 95,
          "intelligence": 131
      },
      "properties": {
          "attack_time": 769,
          "critical_strike_chance": 650,
          "physical_damage_max": 76,
          "physical_damage_min": 29,
          "range": 11
      },
      "implicits": [
          "LifeLeechPermyriadImplicitClaw2"
      ],
      "tags": [
          "claw",
          "one_hand_weapon",
          "onehand",
          "weapon",
          "default"
      ],
      "visualIdentity": {
          "ddsFile": "Art/2DItems/Weapons/OneHandWeapons/Claws/Claw6.dds",
          "id": "Claw6"
      }
  },
  {
      "id": "Metadata/Items/Weapons/OneHandWeapons/Claws/Claw21",
      "name": "Imperial Claw",
      "itemClass": "Claw",
      "dropLevel": 68,
      "inventoryWidth": 2,
      "inventoryHeight": 2,
      "requirements": {
          "level": 68,
          "strength": 0,
          "dexterity": 131,
          "intelligence": 95
      },
      "properties": {
          "attack_time": 625,
          "critical_strike_chance": 600,
          "physical_damage_max": 65,
          "physical_damage_min": 25,
          "range": 11
      },
      "implicits": [
          "LifeGainPerTargetImplicit2Claw13"
      ],
      "tags": [
          "claw",
          "one_hand_weapon",
          "onehand",
          "weapon",
          "default"
      ],
      "visualIdentity": {
          "ddsFile": "Art/2DItems/Weapons/OneHandWeapons/Claws/Claw7.dds",
          "id": "Claw7"
      }
  },
  {
      "id": "Metadata/Items/Weapons/OneHandWeapons/Claws/Claw22",
      "name": "Terror Claw",
      "itemClass": "Claw",
      "dropLevel": 70,
      "inventoryWidth": 2,
      "inventoryHeight": 2,
      "requirements": {
          "level": 70,
          "strength": 0,
          "dexterity": 113,
          "intelligence": 113
      },
      "properties": {
          "attack_time": 667,
          "critical_strike_chance": 630,
          "physical_damage_max": 71,
          "physical_damage_min": 18,
          "range": 11
      },
      "implicits": [
          "LifeLeechPermyriadImplicitClaw2"
      ],
      "tags": [
          "claw",
          "one_hand_weapon",
          "onehand",
          "weapon",
          "default"
      ],
      "visualIdentity": {
          "ddsFile": "Art/2DItems/Weapons/OneHandWeapons/Claws/Claw8.dds",
          "id": "Claw8"
      }
  },
];

// Dagger (7 items)
export const DAGGER_BASES: PoeBaseItem[] = [
  {
      "id": "Metadata/Items/Weapons/OneHandWeapons/Daggers/Dagger1",
      "name": "Glass Shank",
      "itemClass": "Dagger",
      "dropLevel": 1,
      "inventoryWidth": 1,
      "inventoryHeight": 3,
      "requirements": {
          "level": 1,
          "strength": 0,
          "dexterity": 9,
          "intelligence": 6
      },
      "properties": {
          "attack_time": 667,
          "critical_strike_chance": 600,
          "physical_damage_max": 10,
          "physical_damage_min": 6,
          "range": 10
      },
      "implicits": [
          "CriticalStrikeChanceImplicitDaggerNew1"
      ],
      "tags": [
          "dagger",
          "attack_dagger",
          "one_hand_weapon",
          "onehand",
          "weapon",
          "default"
      ],
      "visualIdentity": {
          "ddsFile": "Art/2DItems/Weapons/OneHandWeapons/Daggers/Dagger1.dds",
          "id": "Dagger1"
      }
  },
  {
      "id": "Metadata/Items/Weapons/OneHandWeapons/Daggers/Dagger2",
      "name": "Skinning Knife",
      "itemClass": "Dagger",
      "dropLevel": 5,
      "inventoryWidth": 1,
      "inventoryHeight": 3,
      "requirements": {
          "level": 5,
          "strength": 0,
          "dexterity": 16,
          "intelligence": 11
      },
      "properties": {
          "attack_time": 690,
          "critical_strike_chance": 600,
          "physical_damage_max": 17,
          "physical_damage_min": 4,
          "range": 10
      },
      "implicits": [
          "CriticalStrikeChanceImplicitDaggerNew1"
      ],
      "tags": [
          "dagger",
          "attack_dagger",
          "one_hand_weapon",
          "onehand",
          "weapon",
          "default"
      ],
      "visualIdentity": {
          "ddsFile": "Art/2DItems/Weapons/OneHandWeapons/Daggers/Dagger2.dds",
          "id": "Dagger2"
      }
  },
  {
      "id": "Metadata/Items/Weapons/OneHandWeapons/Daggers/Dagger4",
      "name": "Stiletto",
      "itemClass": "Dagger",
      "dropLevel": 15,
      "inventoryWidth": 1,
      "inventoryHeight": 3,
      "requirements": {
          "level": 15,
          "strength": 0,
          "dexterity": 30,
          "intelligence": 30
      },
      "properties": {
          "attack_time": 667,
          "critical_strike_chance": 610,
          "physical_damage_max": 27,
          "physical_damage_min": 7,
          "range": 10
      },
      "implicits": [
          "CriticalStrikeChanceImplicitDaggerNew1"
      ],
      "tags": [
          "dagger",
          "attack_dagger",
          "one_hand_weapon",
          "onehand",
          "weapon",
          "default"
      ],
      "visualIdentity": {
          "ddsFile": "Art/2DItems/Weapons/OneHandWeapons/Daggers/Dagger4.dds",
          "id": "Dagger4"
      }
  },
  {
      "id": "Metadata/Items/Weapons/OneHandWeapons/Daggers/Dagger9",
      "name": "Flaying Knife",
      "itemClass": "Dagger",
      "dropLevel": 30,
      "inventoryWidth": 1,
      "inventoryHeight": 3,
      "requirements": {
          "level": 30,
          "strength": 0,
          "dexterity": 64,
          "intelligence": 44
      },
      "properties": {
          "attack_time": 714,
          "critical_strike_chance": 600,
          "physical_damage_max": 45,
          "physical_damage_min": 11,
          "range": 10
      },
      "implicits": [
          "CriticalStrikeChanceImplicitDaggerNew1"
      ],
      "tags": [
          "dagger",
          "attack_dagger",
          "one_hand_weapon",
          "onehand",
          "weapon",
          "default"
      ],
      "visualIdentity": {
          "ddsFile": "Art/2DItems/Weapons/OneHandWeapons/Daggers/Dagger2.dds",
          "id": "Dagger2"
      }
  },
  {
      "id": "Metadata/Items/Weapons/OneHandWeapons/Daggers/Dagger11",
      "name": "Poignard",
      "itemClass": "Dagger",
      "dropLevel": 41,
      "inventoryWidth": 1,
      "inventoryHeight": 3,
      "requirements": {
          "level": 41,
          "strength": 0,
          "dexterity": 72,
          "intelligence": 72
      },
      "properties": {
          "attack_time": 667,
          "critical_strike_chance": 610,
          "physical_damage_max": 52,
          "physical_damage_min": 13,
          "range": 10
      },
      "implicits": [
          "CriticalStrikeChanceImplicitDaggerNew1"
      ],
      "tags": [
          "dagger",
          "attack_dagger",
          "one_hand_weapon",
          "onehand",
          "weapon",
          "default"
      ],
      "visualIdentity": {
          "ddsFile": "Art/2DItems/Weapons/OneHandWeapons/Daggers/Dagger4.dds",
          "id": "Dagger4"
      }
  },
  {
      "id": "Metadata/Items/Weapons/OneHandWeapons/Daggers/Dagger16",
      "name": "Gutting Knife",
      "itemClass": "Dagger",
      "dropLevel": 56,
      "inventoryWidth": 1,
      "inventoryHeight": 3,
      "requirements": {
          "level": 56,
          "strength": 0,
          "dexterity": 113,
          "intelligence": 78
      },
      "properties": {
          "attack_time": 714,
          "critical_strike_chance": 650,
          "physical_damage_max": 76,
          "physical_damage_min": 19,
          "range": 10
      },
      "implicits": [
          "CriticalStrikeChanceImplicitDaggerNew1"
      ],
      "tags": [
          "dagger",
          "attack_dagger",
          "one_hand_weapon",
          "onehand",
          "weapon",
          "default"
      ],
      "visualIdentity": {
          "ddsFile": "Art/2DItems/Weapons/OneHandWeapons/Daggers/Dagger2.dds",
          "id": "Dagger2"
      }
  },
  {
      "id": "Metadata/Items/Weapons/OneHandWeapons/Daggers/Dagger18",
      "name": "Ambusher",
      "itemClass": "Dagger",
      "dropLevel": 60,
      "inventoryWidth": 1,
      "inventoryHeight": 3,
      "requirements": {
          "level": 60,
          "strength": 0,
          "dexterity": 113,
          "intelligence": 113
      },
      "properties": {
          "attack_time": 667,
          "critical_strike_chance": 610,
          "physical_damage_max": 74,
          "physical_damage_min": 19,
          "range": 10
      },
      "implicits": [
          "CriticalStrikeChanceImplicitDaggerNew1"
      ],
      "tags": [
          "dagger",
          "attack_dagger",
          "one_hand_weapon",
          "onehand",
          "weapon",
          "default"
      ],
      "visualIdentity": {
          "ddsFile": "Art/2DItems/Weapons/OneHandWeapons/Daggers/Dagger4.dds",
          "id": "Dagger4"
      }
  },
];

// Gloves (55 items)
export const GLOVES_BASES: PoeBaseItem[] = [
  {
      "id": "Metadata/Items/Armours/Gloves/GlovesStr1",
      "name": "Iron Gauntlets",
      "itemClass": "Gloves",
      "dropLevel": 1,
      "inventoryWidth": 2,
      "inventoryHeight": 2,
      "requirements": {
          "level": 1,
          "strength": 6,
          "dexterity": 0,
          "intelligence": 0
      },
      "properties": {
          "armour": {
              "max": 9,
              "min": 6
          }
      },
      "implicits": [],
      "tags": [
          "str_armour",
          "gloves",
          "armour",
          "default"
      ],
      "visualIdentity": {
          "ddsFile": "Art/2DItems/Armours/Gloves/GlovesStr1.dds",
          "id": "GlovesStr1"
      }
  },
  {
      "id": "Metadata/Items/Armours/Gloves/GlovesDex1",
      "name": "Rawhide Gloves",
      "itemClass": "Gloves",
      "dropLevel": 3,
      "inventoryWidth": 2,
      "inventoryHeight": 2,
      "requirements": {
          "level": 3,
          "strength": 0,
          "dexterity": 9,
          "intelligence": 0
      },
      "properties": {
          "evasion": {
              "max": 18,
              "min": 13
          }
      },
      "implicits": [],
      "tags": [
          "dex_armour",
          "gloves",
          "armour",
          "default"
      ],
      "visualIdentity": {
          "ddsFile": "Art/2DItems/Armours/Gloves/GlovesDex1.dds",
          "id": "GlovesDex1"
      }
  },
  {
      "id": "Metadata/Items/Armours/Gloves/GlovesInt1",
      "name": "Wool Gloves",
      "itemClass": "Gloves",
      "dropLevel": 3,
      "inventoryWidth": 2,
      "inventoryHeight": 2,
      "requirements": {
          "level": 3,
          "strength": 0,
          "dexterity": 0,
          "intelligence": 9
      },
      "properties": {
          "energy_shield": {
              "max": 7,
              "min": 5
          }
      },
      "implicits": [],
      "tags": [
          "int_armour",
          "gloves",
          "armour",
          "default"
      ],
      "visualIdentity": {
          "ddsFile": "Art/2DItems/Armours/Gloves/GlovesInt1.dds",
          "id": "GlovesInt1"
      }
  },
  {
      "id": "Metadata/Items/Armours/Gloves/GlovesStrDex1",
      "name": "Fishscale Gauntlets",
      "itemClass": "Gloves",
      "dropLevel": 4,
      "inventoryWidth": 2,
      "inventoryHeight": 2,
      "requirements": {
          "level": 4,
          "strength": 5,
          "dexterity": 5,
          "intelligence": 0
      },
      "properties": {
          "armour": {
              "max": 12,
              "min": 9
          },
          "evasion": {
              "max": 12,
              "min": 9
          }
      },
      "implicits": [],
      "tags": [
          "str_dex_armour",
          "gloves",
          "armour",
          "default"
      ],
      "visualIdentity": {
          "ddsFile": "Art/2DItems/Armours/Gloves/GlovesStrDex1.dds",
          "id": "GlovesStrDex1"
      }
  },
  {
      "id": "Metadata/Items/Armours/Gloves/GlovesDexInt1",
      "name": "Wrapped Mitts",
      "itemClass": "Gloves",
      "dropLevel": 5,
      "inventoryWidth": 2,
      "inventoryHeight": 2,
      "requirements": {
          "level": 5,
          "strength": 0,
          "dexterity": 6,
          "intelligence": 6
      },
      "properties": {
          "energy_shield": {
              "max": 5,
              "min": 3
          },
          "evasion": {
              "max": 15,
              "min": 11
          }
      },
      "implicits": [],
      "tags": [
          "dex_int_armour",
          "gloves",
          "armour",
          "default"
      ],
      "visualIdentity": {
          "ddsFile": "Art/2DItems/Armours/Gloves/GlovesDexInt1.dds",
          "id": "GlovesDexInt1"
      }
  },
  {
      "id": "Metadata/Items/Armours/Gloves/GlovesStrInt1",
      "name": "Chain Gloves",
      "itemClass": "Gloves",
      "dropLevel": 7,
      "inventoryWidth": 2,
      "inventoryHeight": 2,
      "requirements": {
          "level": 7,
          "strength": 8,
          "dexterity": 0,
          "intelligence": 8
      },
      "properties": {
          "armour": {
              "max": 20,
              "min": 14
          },
          "energy_shield": {
              "max": 6,
              "min": 4
          }
      },
      "implicits": [],
      "tags": [
          "str_int_armour",
          "gloves",
          "armour",
          "default"
      ],
      "visualIdentity": {
          "ddsFile": "Art/2DItems/Armours/Gloves/GlovesStrInt1.dds",
          "id": "GlovesStrInt1"
      }
  },
  {
      "id": "Metadata/Items/Armours/Gloves/GlovesDex2",
      "name": "Goathide Gloves",
      "itemClass": "Gloves",
      "dropLevel": 9,
      "inventoryWidth": 2,
      "inventoryHeight": 2,
      "requirements": {
          "level": 9,
          "strength": 0,
          "dexterity": 17,
          "intelligence": 0
      },
      "properties": {
          "evasion": {
              "max": 42,
              "min": 32
          }
      },
      "implicits": [],
      "tags": [
          "dex_armour",
          "gloves",
          "armour",
          "default"
      ],
      "visualIdentity": {
          "ddsFile": "Art/2DItems/Armours/Gloves/GlovesDex2.dds",
          "id": "GlovesDex2"
      }
  },
  {
      "id": "Metadata/Items/Armours/Gloves/GlovesStr2",
      "name": "Plated Gauntlets",
      "itemClass": "Gloves",
      "dropLevel": 11,
      "inventoryWidth": 2,
      "inventoryHeight": 2,
      "requirements": {
          "level": 11,
          "strength": 20,
          "dexterity": 0,
          "intelligence": 0
      },
      "properties": {
          "armour": {
              "max": 50,
              "min": 39
          }
      },
      "implicits": [],
      "tags": [
          "str_armour",
          "gloves",
          "armour",
          "default"
      ],
      "visualIdentity": {
          "ddsFile": "Art/2DItems/Armours/Gloves/GlovesStr2.dds",
          "id": "GlovesStr2"
      }
  },
  {
      "id": "Metadata/Items/Armours/Gloves/GlovesInt2",
      "name": "Velvet Gloves",
      "itemClass": "Gloves",
      "dropLevel": 12,
      "inventoryWidth": 2,
      "inventoryHeight": 2,
      "requirements": {
          "level": 12,
          "strength": 0,
          "dexterity": 0,
          "intelligence": 21
      },
      "properties": {
          "energy_shield": {
              "max": 13,
              "min": 10
          }
      },
      "implicits": [],
      "tags": [
          "int_armour",
          "gloves",
          "armour",
          "default"
      ],
      "visualIdentity": {
          "ddsFile": "Art/2DItems/Armours/Gloves/GlovesInt2.dds",
          "id": "GlovesInt2"
      }
  },
  {
      "id": "Metadata/Items/Armours/Gloves/GlovesStrDex2",
      "name": "Ironscale Gauntlets",
      "itemClass": "Gloves",
      "dropLevel": 15,
      "inventoryWidth": 2,
      "inventoryHeight": 2,
      "requirements": {
          "level": 15,
          "strength": 14,
          "dexterity": 14,
          "intelligence": 0
      },
      "properties": {
          "armour": {
              "max": 37,
              "min": 28
          },
          "evasion": {
              "max": 37,
              "min": 28
          }
      },
      "implicits": [],
      "tags": [
          "str_dex_armour",
          "gloves",
          "armour",
          "default"
      ],
      "visualIdentity": {
          "ddsFile": "Art/2DItems/Armours/Gloves/GlovesStrDex2.dds",
          "id": "GlovesStrDex2"
      }
  },
  {
      "id": "Metadata/Items/Armours/Gloves/GlovesDexInt2",
      "name": "Strapped Mitts",
      "itemClass": "Gloves",
      "dropLevel": 16,
      "inventoryWidth": 2,
      "inventoryHeight": 2,
      "requirements": {
          "level": 16,
          "strength": 0,
          "dexterity": 14,
          "intelligence": 14
      },
      "properties": {
          "energy_shield": {
              "max": 9,
              "min": 7
          },
          "evasion": {
              "max": 39,
              "min": 30
          }
      },
      "implicits": [],
      "tags": [
          "dex_int_armour",
          "gloves",
          "armour",
          "default"
      ],
      "visualIdentity": {
          "ddsFile": "Art/2DItems/Armours/Gloves/GlovesDexInt2.dds",
          "id": "GlovesDexInt2"
      }
  },
  {
      "id": "Metadata/Items/Armours/Gloves/GlovesStrInt2",
      "name": "Ringmail Gloves",
      "itemClass": "Gloves",
      "dropLevel": 19,
      "inventoryWidth": 2,
      "inventoryHeight": 2,
      "requirements": {
          "level": 19,
          "strength": 16,
          "dexterity": 0,
          "intelligence": 16
      },
      "properties": {
          "armour": {
              "max": 46,
              "min": 35
          },
          "energy_shield": {
              "max": 10,
              "min": 8
          }
      },
      "implicits": [],
      "tags": [
          "str_int_armour",
          "gloves",
          "armour",
          "default"
      ],
      "visualIdentity": {
          "ddsFile": "Art/2DItems/Armours/Gloves/GlovesStrInt2.dds",
          "id": "GlovesStrInt2"
      }
  },
  {
      "id": "Metadata/Items/Armours/Gloves/GlovesDex3",
      "name": "Deerskin Gloves",
      "itemClass": "Gloves",
      "dropLevel": 21,
      "inventoryWidth": 2,
      "inventoryHeight": 2,
      "requirements": {
          "level": 21,
          "strength": 0,
          "dexterity": 33,
          "intelligence": 0
      },
      "properties": {
          "evasion": {
              "max": 88,
              "min": 71
          }
      },
      "implicits": [],
      "tags": [
          "dex_armour",
          "gloves",
          "armour",
          "default"
      ],
      "visualIdentity": {
          "ddsFile": "Art/2DItems/Armours/Gloves/GlovesDex3.dds",
          "id": "GlovesDex3"
      }
  },
  {
      "id": "Metadata/Items/Armours/Gloves/GlovesStr3",
      "name": "Bronze Gauntlets",
      "itemClass": "Gloves",
      "dropLevel": 23,
      "inventoryWidth": 2,
      "inventoryHeight": 2,
      "requirements": {
          "level": 23,
          "strength": 36,
          "dexterity": 0,
          "intelligence": 0
      },
      "properties": {
          "armour": {
              "max": 96,
              "min": 77
          }
      },
      "implicits": [],
      "tags": [
          "str_armour",
          "gloves",
          "armour",
          "default"
      ],
      "visualIdentity": {
          "ddsFile": "Art/2DItems/Armours/Gloves/GlovesStr3.dds",
          "id": "GlovesStr3"
      }
  },
  {
      "id": "Metadata/Items/Armours/Gloves/GlovesInt3",
      "name": "Silk Gloves",
      "itemClass": "Gloves",
      "dropLevel": 25,
      "inventoryWidth": 2,
      "inventoryHeight": 2,
      "requirements": {
          "level": 25,
          "strength": 0,
          "dexterity": 0,
          "intelligence": 39
      },
      "properties": {
          "energy_shield": {
              "max": 23,
              "min": 18
          }
      },
      "implicits": [],
      "tags": [
          "int_armour",
          "gloves",
          "armour",
          "default"
      ],
      "visualIdentity": {
          "ddsFile": "Art/2DItems/Armours/Gloves/GlovesInt3.dds",
          "id": "GlovesInt3"
      }
  },
  {
      "id": "Metadata/Items/Armours/Gloves/GlovesStrDex3",
      "name": "Bronzescale Gauntlets",
      "itemClass": "Gloves",
      "dropLevel": 27,
      "inventoryWidth": 2,
      "inventoryHeight": 2,
      "requirements": {
          "level": 27,
          "strength": 22,
          "dexterity": 22,
          "intelligence": 0
      },
      "properties": {
          "armour": {
              "max": 62,
              "min": 50
          },
          "evasion": {
              "max": 62,
              "min": 50
          }
      },
      "implicits": [],
      "tags": [
          "str_dex_armour",
          "gloves",
          "armour",
          "default"
      ],
      "visualIdentity": {
          "ddsFile": "Art/2DItems/Armours/Gloves/GlovesStrDex3.dds",
          "id": "GlovesStrDex3"
      }
  },
  {
      "id": "Metadata/Items/Armours/Gloves/GlovesDexInt3",
      "name": "Clasped Mitts",
      "itemClass": "Gloves",
      "dropLevel": 31,
      "inventoryWidth": 2,
      "inventoryHeight": 2,
      "requirements": {
          "level": 31,
          "strength": 0,
          "dexterity": 25,
          "intelligence": 25
      },
      "properties": {
          "energy_shield": {
              "max": 14,
              "min": 12
          },
          "evasion": {
              "max": 65,
              "min": 57
          }
      },
      "implicits": [],
      "tags": [
          "dex_int_armour",
          "gloves",
          "armour",
          "default"
      ],
      "visualIdentity": {
          "ddsFile": "Art/2DItems/Armours/Gloves/GlovesDexInt3.dds",
          "id": "GlovesDexInt3"
      }
  },
  {
      "id": "Metadata/Items/Armours/Gloves/GlovesStrInt3",
      "name": "Mesh Gloves",
      "itemClass": "Gloves",
      "dropLevel": 32,
      "inventoryWidth": 2,
      "inventoryHeight": 2,
      "requirements": {
          "level": 32,
          "strength": 26,
          "dexterity": 0,
          "intelligence": 26
      },
      "properties": {
          "armour": {
              "max": 67,
              "min": 58
          },
          "energy_shield": {
              "max": 14,
              "min": 12
          }
      },
      "implicits": [],
      "tags": [
          "str_int_armour",
          "gloves",
          "armour",
          "default"
      ],
      "visualIdentity": {
          "ddsFile": "Art/2DItems/Armours/Gloves/GlovesStrInt3.dds",
          "id": "GlovesStrInt3"
      }
  },
  {
      "id": "Metadata/Items/Armours/Gloves/GlovesDex4",
      "name": "Nubuck Gloves",
      "itemClass": "Gloves",
      "dropLevel": 33,
      "inventoryWidth": 2,
      "inventoryHeight": 2,
      "requirements": {
          "level": 33,
          "strength": 0,
          "dexterity": 50,
          "intelligence": 0
      },
      "properties": {
          "evasion": {
              "max": 122,
              "min": 109
          }
      },
      "implicits": [],
      "tags": [
          "dex_armour",
          "gloves",
          "armour",
          "default"
      ],
      "visualIdentity": {
          "ddsFile": "Art/2DItems/Armours/Gloves/GlovesDex4.dds",
          "id": "GlovesDex4"
      }
  },
  {
      "id": "Metadata/Items/Armours/Gloves/GlovesStr4",
      "name": "Steel Gauntlets",
      "itemClass": "Gloves",
      "dropLevel": 35,
      "inventoryWidth": 2,
      "inventoryHeight": 2,
      "requirements": {
          "level": 35,
          "strength": 52,
          "dexterity": 0,
          "intelligence": 0
      },
      "properties": {
          "armour": {
              "max": 127,
              "min": 116
          }
      },
      "implicits": [],
      "tags": [
          "str_armour",
          "gloves",
          "armour",
          "default"
      ],
      "visualIdentity": {
          "ddsFile": "Art/2DItems/Armours/Gloves/GlovesStr4.dds",
          "id": "GlovesStr4"
      }
  },
  {
      "id": "Metadata/Items/Armours/Gloves/GlovesDexInt4",
      "name": "Trapper Mitts",
      "itemClass": "Gloves",
      "dropLevel": 36,
      "inventoryWidth": 2,
      "inventoryHeight": 2,
      "requirements": {
          "level": 36,
          "strength": 0,
          "dexterity": 29,
          "intelligence": 29
      },
      "properties": {
          "energy_shield": {
              "max": 16,
              "min": 14
          },
          "evasion": {
              "max": 77,
              "min": 65
          }
      },
      "implicits": [],
      "tags": [
          "dex_int_armour",
          "gloves",
          "armour",
          "default"
      ],
      "visualIdentity": {
          "ddsFile": "Art/2DItems/Armours/Gloves/GlovesDexInt1.dds",
          "id": "GlovesDexInt1"
      }
  },
  {
      "id": "Metadata/Items/Armours/Gloves/GlovesInt4",
      "name": "Embroidered Gloves",
      "itemClass": "Gloves",
      "dropLevel": 36,
      "inventoryWidth": 2,
      "inventoryHeight": 2,
      "requirements": {
          "level": 36,
          "strength": 0,
          "dexterity": 0,
          "intelligence": 54
      },
      "properties": {
          "energy_shield": {
              "max": 28,
              "min": 25
          }
      },
      "implicits": [],
      "tags": [
          "int_armour",
          "gloves",
          "armour",
          "default"
      ],
      "visualIdentity": {
          "ddsFile": "Art/2DItems/Armours/Gloves/GlovesInt4.dds",
          "id": "GlovesInt4"
      }
  },
  {
      "id": "Metadata/Items/Armours/Gloves/GlovesStrDex4",
      "name": "Steelscale Gauntlets",
      "itemClass": "Gloves",
      "dropLevel": 36,
      "inventoryWidth": 2,
      "inventoryHeight": 2,
      "requirements": {
          "level": 36,
          "strength": 29,
          "dexterity": 29,
          "intelligence": 0
      },
      "properties": {
          "armour": {
              "max": 75,
              "min": 65
          },
          "evasion": {
              "max": 75,
              "min": 65
          }
      },
      "implicits": [],
      "tags": [
          "str_dex_armour",
          "gloves",
          "armour",
          "default"
      ],
      "visualIdentity": {
          "ddsFile": "Art/2DItems/Armours/Gloves/GlovesStrDex1.dds",
          "id": "GlovesStrDex1"
      }
  },
  {
      "id": "Metadata/Items/Armours/Gloves/GlovesStrInt4",
      "name": "Riveted Gloves",
      "itemClass": "Gloves",
      "dropLevel": 37,
      "inventoryWidth": 2,
      "inventoryHeight": 2,
      "requirements": {
          "level": 37,
          "strength": 29,
          "dexterity": 0,
          "intelligence": 29
      },
      "properties": {
          "armour": {
              "max": 77,
              "min": 67
          },
          "energy_shield": {
              "max": 16,
              "min": 14
          }
      },
      "implicits": [],
      "tags": [
          "str_int_armour",
          "gloves",
          "armour",
          "default"
      ],
      "visualIdentity": {
          "ddsFile": "Art/2DItems/Armours/Gloves/GlovesStrInt1.dds",
          "id": "GlovesStrInt1"
      }
  },
  {
      "id": "Metadata/Items/Armours/Gloves/GlovesDex5",
      "name": "Eelskin Gloves",
      "itemClass": "Gloves",
      "dropLevel": 38,
      "inventoryWidth": 2,
      "inventoryHeight": 2,
      "requirements": {
          "level": 38,
          "strength": 0,
          "dexterity": 56,
          "intelligence": 0
      },
      "properties": {
          "evasion": {
              "max": 148,
              "min": 125
          }
      },
      "implicits": [],
      "tags": [
          "dex_armour",
          "gloves",
          "armour",
          "default"
      ],
      "visualIdentity": {
          "ddsFile": "Art/2DItems/Armours/Gloves/GlovesDex2.dds",
          "id": "GlovesDex2"
      }
  },
  {
      "id": "Metadata/Items/Armours/Gloves/GlovesStr5",
      "name": "Antique Gauntlets",
      "itemClass": "Gloves",
      "dropLevel": 39,
      "inventoryWidth": 2,
      "inventoryHeight": 2,
      "requirements": {
          "level": 39,
          "strength": 58,
          "dexterity": 0,
          "intelligence": 0
      },
      "properties": {
          "armour": {
              "max": 154,
              "min": 129
          }
      },
      "implicits": [],
      "tags": [
          "str_armour",
          "gloves",
          "armour",
          "default"
      ],
      "visualIdentity": {
          "ddsFile": "Art/2DItems/Armours/Gloves/GlovesStr2.dds",
          "id": "GlovesStr2"
      }
  },
  {
      "id": "Metadata/Items/Armours/Gloves/GlovesInt5",
      "name": "Satin Gloves",
      "itemClass": "Gloves",
      "dropLevel": 41,
      "inventoryWidth": 2,
      "inventoryHeight": 2,
      "requirements": {
          "level": 41,
          "strength": 0,
          "dexterity": 0,
          "intelligence": 60
      },
      "properties": {
          "energy_shield": {
              "max": 33,
              "min": 28
          }
      },
      "implicits": [],
      "tags": [
          "int_armour",
          "gloves",
          "armour",
          "default"
      ],
      "visualIdentity": {
          "ddsFile": "Art/2DItems/Armours/Gloves/GlovesInt2.dds",
          "id": "GlovesInt2"
      }
  },
  {
      "id": "Metadata/Items/Armours/Gloves/GlovesStrDex5",
      "name": "Serpentscale Gauntlets",
      "itemClass": "Gloves",
      "dropLevel": 43,
      "inventoryWidth": 2,
      "inventoryHeight": 2,
      "requirements": {
          "level": 43,
          "strength": 34,
          "dexterity": 34,
          "intelligence": 0
      },
      "properties": {
          "armour": {
              "max": 87,
              "min": 78
          },
          "evasion": {
              "max": 87,
              "min": 78
          }
      },
      "implicits": [],
      "tags": [
          "str_dex_armour",
          "gloves",
          "armour",
          "default"
      ],
      "visualIdentity": {
          "ddsFile": "Art/2DItems/Armours/Gloves/GlovesStrDex2.dds",
          "id": "GlovesStrDex2"
      }
  },
  {
      "id": "Metadata/Items/Armours/Gloves/GlovesStrInt5",
      "name": "Zealot Gloves",
      "itemClass": "Gloves",
      "dropLevel": 43,
      "inventoryWidth": 2,
      "inventoryHeight": 2,
      "requirements": {
          "level": 43,
          "strength": 34,
          "dexterity": 0,
          "intelligence": 34
      },
      "properties": {
          "armour": {
              "max": 92,
              "min": 78
          },
          "energy_shield": {
              "max": 19,
              "min": 16
          }
      },
      "implicits": [],
      "tags": [
          "str_int_armour",
          "gloves",
          "armour",
          "default"
      ],
      "visualIdentity": {
          "ddsFile": "Art/2DItems/Armours/Gloves/GlovesStrInt2.dds",
          "id": "GlovesStrInt2"
      }
  },
  {
      "id": "Metadata/Items/Armours/Gloves/GlovesDex6",
      "name": "Sharkskin Gloves",
      "itemClass": "Gloves",
      "dropLevel": 45,
      "inventoryWidth": 2,
      "inventoryHeight": 2,
      "requirements": {
          "level": 45,
          "strength": 0,
          "dexterity": 66,
          "intelligence": 0
      },
      "properties": {
          "evasion": {
              "max": 163,
              "min": 148
          }
      },
      "implicits": [],
      "tags": [
          "dex_armour",
          "gloves",
          "armour",
          "default"
      ],
      "visualIdentity": {
          "ddsFile": "Art/2DItems/Armours/Gloves/GlovesDex3.dds",
          "id": "GlovesDex3"
      }
  },
  {
      "id": "Metadata/Items/Armours/Gloves/GlovesDexInt5",
      "name": "Ambush Mitts",
      "itemClass": "Gloves",
      "dropLevel": 45,
      "inventoryWidth": 2,
      "inventoryHeight": 2,
      "requirements": {
          "level": 45,
          "strength": 0,
          "dexterity": 35,
          "intelligence": 35
      },
      "properties": {
          "energy_shield": {
              "max": 19,
              "min": 17
          },
          "evasion": {
              "max": 91,
              "min": 81
          }
      },
      "implicits": [],
      "tags": [
          "dex_int_armour",
          "gloves",
          "armour",
          "default"
      ],
      "visualIdentity": {
          "ddsFile": "Art/2DItems/Armours/Gloves/GlovesDexInt2.dds",
          "id": "GlovesDexInt2"
      }
  },
  {
      "id": "Metadata/Items/Armours/Gloves/GlovesInt6",
      "name": "Samite Gloves",
      "itemClass": "Gloves",
      "dropLevel": 47,
      "inventoryWidth": 2,
      "inventoryHeight": 2,
      "requirements": {
          "level": 47,
          "strength": 0,
          "dexterity": 0,
          "intelligence": 68
      },
      "properties": {
          "energy_shield": {
              "max": 37,
              "min": 32
          }
      },
      "implicits": [],
      "tags": [
          "int_armour",
          "gloves",
          "armour",
          "default"
      ],
      "visualIdentity": {
          "ddsFile": "Art/2DItems/Armours/Gloves/GlovesInt3.dds",
          "id": "GlovesInt3"
      }
  },
  {
      "id": "Metadata/Items/Armours/Gloves/GlovesStr6",
      "name": "Ancient Gauntlets",
      "itemClass": "Gloves",
      "dropLevel": 47,
      "inventoryWidth": 2,
      "inventoryHeight": 2,
      "requirements": {
          "level": 47,
          "strength": 68,
          "dexterity": 0,
          "intelligence": 0
      },
      "properties": {
          "armour": {
              "max": 173,
              "min": 154
          }
      },
      "implicits": [],
      "tags": [
          "str_armour",
          "gloves",
          "armour",
          "default"
      ],
      "visualIdentity": {
          "ddsFile": "Art/2DItems/Armours/Gloves/GlovesStr3.dds",
          "id": "GlovesStr3"
      }
  },
  {
      "id": "Metadata/Items/Armours/Gloves/GlovesStrDex6",
      "name": "Wyrmscale Gauntlets",
      "itemClass": "Gloves",
      "dropLevel": 49,
      "inventoryWidth": 2,
      "inventoryHeight": 2,
      "requirements": {
          "level": 49,
          "strength": 38,
          "dexterity": 38,
          "intelligence": 0
      },
      "properties": {
          "armour": {
              "max": 104,
              "min": 88
          },
          "evasion": {
              "max": 104,
              "min": 88
          }
      },
      "implicits": [],
      "tags": [
          "str_dex_armour",
          "gloves",
          "armour",
          "default"
      ],
      "visualIdentity": {
          "ddsFile": "Art/2DItems/Armours/Gloves/GlovesStrDex3.dds",
          "id": "GlovesStrDex3"
      }
  },
  {
      "id": "Metadata/Items/Armours/Gloves/GlovesDexInt6",
      "name": "Carnal Mitts",
      "itemClass": "Gloves",
      "dropLevel": 50,
      "inventoryWidth": 2,
      "inventoryHeight": 2,
      "requirements": {
          "level": 50,
          "strength": 0,
          "dexterity": 39,
          "intelligence": 39
      },
      "properties": {
          "energy_shield": {
              "max": 21,
              "min": 19
          },
          "evasion": {
              "max": 101,
              "min": 90
          }
      },
      "implicits": [],
      "tags": [
          "dex_int_armour",
          "gloves",
          "armour",
          "default"
      ],
      "visualIdentity": {
          "ddsFile": "Art/2DItems/Armours/Gloves/GlovesDexInt3.dds",
          "id": "GlovesDexInt3"
      }
  },
  {
      "id": "Metadata/Items/Armours/Gloves/GlovesStrInt6",
      "name": "Soldier Gloves",
      "itemClass": "Gloves",
      "dropLevel": 51,
      "inventoryWidth": 2,
      "inventoryHeight": 2,
      "requirements": {
          "level": 51,
          "strength": 40,
          "dexterity": 0,
          "intelligence": 40
      },
      "properties": {
          "armour": {
              "max": 103,
              "min": 92
          },
          "energy_shield": {
              "max": 21,
              "min": 19
          }
      },
      "implicits": [],
      "tags": [
          "str_int_armour",
          "gloves",
          "armour",
          "default"
      ],
      "visualIdentity": {
          "ddsFile": "Art/2DItems/Armours/Gloves/GlovesStrInt3.dds",
          "id": "GlovesStrInt3"
      }
  },
  {
      "id": "Metadata/Items/Armours/Gloves/GlovesStr7",
      "name": "Goliath Gauntlets",
      "itemClass": "Gloves",
      "dropLevel": 53,
      "inventoryWidth": 2,
      "inventoryHeight": 2,
      "requirements": {
          "level": 53,
          "strength": 77,
          "dexterity": 0,
          "intelligence": 0
      },
      "properties": {
          "armour": {
              "max": 200,
              "min": 174
          }
      },
      "implicits": [],
      "tags": [
          "str_armour",
          "gloves",
          "armour",
          "default"
      ],
      "visualIdentity": {
          "ddsFile": "Art/2DItems/Armours/Gloves/GlovesStr4.dds",
          "id": "GlovesStr4"
      }
  },
  {
      "id": "Metadata/Items/Armours/Gloves/GlovesDex7",
      "name": "Shagreen Gloves",
      "itemClass": "Gloves",
      "dropLevel": 54,
      "inventoryWidth": 2,
      "inventoryHeight": 2,
      "requirements": {
          "level": 54,
          "strength": 0,
          "dexterity": 78,
          "intelligence": 0
      },
      "properties": {
          "evasion": {
              "max": 212,
              "min": 177
          }
      },
      "implicits": [],
      "tags": [
          "dex_armour",
          "gloves",
          "armour",
          "default"
      ],
      "visualIdentity": {
          "ddsFile": "Art/2DItems/Armours/Gloves/GlovesDex4.dds",
          "id": "GlovesDex4"
      }
  },
  {
      "id": "Metadata/Items/Armours/Gloves/GlovesInt7",
      "name": "Conjurer Gloves",
      "itemClass": "Gloves",
      "dropLevel": 55,
      "inventoryWidth": 2,
      "inventoryHeight": 2,
      "requirements": {
          "level": 55,
          "strength": 0,
          "dexterity": 0,
          "intelligence": 79
      },
      "properties": {
          "energy_shield": {
              "max": 44,
              "min": 37
          }
      },
      "implicits": [],
      "tags": [
          "int_armour",
          "gloves",
          "armour",
          "default"
      ],
      "visualIdentity": {
          "ddsFile": "Art/2DItems/Armours/Gloves/GlovesInt4.dds",
          "id": "GlovesInt4"
      }
  },
  {
      "id": "Metadata/Items/Armours/Gloves/GlovesStrInt7",
      "name": "Legion Gloves",
      "itemClass": "Gloves",
      "dropLevel": 57,
      "inventoryWidth": 2,
      "inventoryHeight": 2,
      "requirements": {
          "level": 57,
          "strength": 44,
          "dexterity": 0,
          "intelligence": 44
      },
      "properties": {
          "armour": {
              "max": 121,
              "min": 103
          },
          "energy_shield": {
              "max": 25,
              "min": 21
          }
      },
      "implicits": [],
      "tags": [
          "str_int_armour",
          "gloves",
          "armour",
          "default"
      ],
      "visualIdentity": {
          "ddsFile": "Art/2DItems/Armours/Gloves/GlovesStrInt2.dds",
          "id": "GlovesStrInt2"
      }
  },
  {
      "id": "Metadata/Items/Armours/Gloves/GlovesDexInt7",
      "name": "Assassin's Mitts",
      "itemClass": "Gloves",
      "dropLevel": 58,
      "inventoryWidth": 2,
      "inventoryHeight": 2,
      "requirements": {
          "level": 58,
          "strength": 0,
          "dexterity": 45,
          "intelligence": 45
      },
      "properties": {
          "energy_shield": {
              "max": 25,
              "min": 21
          },
          "evasion": {
              "max": 123,
              "min": 104
          }
      },
      "implicits": [],
      "tags": [
          "dex_int_armour",
          "gloves",
          "armour",
          "default"
      ],
      "visualIdentity": {
          "ddsFile": "Art/2DItems/Armours/Gloves/GlovesDexInt2.dds",
          "id": "GlovesDexInt2"
      }
  },
  {
      "id": "Metadata/Items/Armours/Gloves/GlovesStrDex7",
      "name": "Hydrascale Gauntlets",
      "itemClass": "Gloves",
      "dropLevel": 59,
      "inventoryWidth": 2,
      "inventoryHeight": 2,
      "requirements": {
          "level": 59,
          "strength": 45,
          "dexterity": 45,
          "intelligence": 0
      },
      "properties": {
          "armour": {
              "max": 122,
              "min": 106
          },
          "evasion": {
              "max": 122,
              "min": 106
          }
      },
      "implicits": [],
      "tags": [
          "str_dex_armour",
          "gloves",
          "armour",
          "default"
      ],
      "visualIdentity": {
          "ddsFile": "Art/2DItems/Armours/Gloves/GlovesStrDex2.dds",
          "id": "GlovesStrDex2"
      }
  },
  {
      "id": "Metadata/Items/Armours/Gloves/GlovesInt8",
      "name": "Arcanist Gloves",
      "itemClass": "Gloves",
      "dropLevel": 60,
      "inventoryWidth": 2,
      "inventoryHeight": 2,
      "requirements": {
          "level": 60,
          "strength": 0,
          "dexterity": 0,
          "intelligence": 95
      },
      "properties": {
          "energy_shield": {
              "max": 52,
              "min": 45
          }
      },
      "implicits": [],
      "tags": [
          "int_armour",
          "gloves",
          "armour",
          "default"
      ],
      "visualIdentity": {
          "ddsFile": "Art/2DItems/Armours/Gloves/GlovesInt3.dds",
          "id": "GlovesInt3"
      }
  },
  {
      "id": "Metadata/Items/Armours/Gloves/GlovesDex8",
      "name": "Stealth Gloves",
      "itemClass": "Gloves",
      "dropLevel": 62,
      "inventoryWidth": 2,
      "inventoryHeight": 2,
      "requirements": {
          "level": 62,
          "strength": 0,
          "dexterity": 97,
          "intelligence": 0
      },
      "properties": {
          "evasion": {
              "max": 265,
              "min": 231
          }
      },
      "implicits": [],
      "tags": [
          "dex_armour",
          "gloves",
          "armour",
          "default"
      ],
      "visualIdentity": {
          "ddsFile": "Art/2DItems/Armours/Gloves/GlovesDex3.dds",
          "id": "GlovesDex3"
      }
  },
  {
      "id": "Metadata/Items/Armours/Gloves/GlovesStr8",
      "name": "Vaal Gauntlets",
      "itemClass": "Gloves",
      "dropLevel": 63,
      "inventoryWidth": 2,
      "inventoryHeight": 2,
      "requirements": {
          "level": 63,
          "strength": 100,
          "dexterity": 0,
          "intelligence": 0
      },
      "properties": {
          "armour": {
              "max": 266,
              "min": 232
          }
      },
      "implicits": [],
      "tags": [
          "str_armour",
          "gloves",
          "armour",
          "default"
      ],
      "visualIdentity": {
          "ddsFile": "Art/2DItems/Armours/Gloves/GlovesStr3.dds",
          "id": "GlovesStr3"
      }
  },
  {
      "id": "Metadata/Items/Armours/Gloves/GlovesStrInt8",
      "name": "Crusader Gloves",
      "itemClass": "Gloves",
      "dropLevel": 66,
      "inventoryWidth": 2,
      "inventoryHeight": 2,
      "requirements": {
          "level": 66,
          "strength": 51,
          "dexterity": 0,
          "intelligence": 51
      },
      "properties": {
          "armour": {
              "max": 139,
              "min": 121
          },
          "energy_shield": {
              "max": 28,
              "min": 25
          }
      },
      "implicits": [],
      "tags": [
          "str_int_armour",
          "gloves",
          "armour",
          "default"
      ],
      "visualIdentity": {
          "ddsFile": "Art/2DItems/Armours/Gloves/GlovesStrInt3.dds",
          "id": "GlovesStrInt3"
      }
  },
  {
      "id": "Metadata/Items/Armours/Gloves/GlovesDexInt8",
      "name": "Murder Mitts",
      "itemClass": "Gloves",
      "dropLevel": 67,
      "inventoryWidth": 2,
      "inventoryHeight": 2,
      "requirements": {
          "level": 67,
          "strength": 0,
          "dexterity": 51,
          "intelligence": 51
      },
      "properties": {
          "energy_shield": {
              "max": 28,
              "min": 25
          },
          "evasion": {
              "max": 139,
              "min": 121
          }
      },
      "implicits": [],
      "tags": [
          "dex_int_armour",
          "gloves",
          "armour",
          "default"
      ],
      "visualIdentity": {
          "ddsFile": "Art/2DItems/Armours/Gloves/GlovesDexInt3.dds",
          "id": "GlovesDexInt3"
      }
  },
  {
      "id": "Metadata/Items/Armours/Gloves/GlovesStrDex8",
      "name": "Dragonscale Gauntlets",
      "itemClass": "Gloves",
      "dropLevel": 67,
      "inventoryWidth": 2,
      "inventoryHeight": 2,
      "requirements": {
          "level": 67,
          "strength": 51,
          "dexterity": 51,
          "intelligence": 0
      },
      "properties": {
          "armour": {
              "max": 139,
              "min": 121
          },
          "evasion": {
              "max": 139,
              "min": 121
          }
      },
      "implicits": [],
      "tags": [
          "str_dex_armour",
          "gloves",
          "armour",
          "default"
      ],
      "visualIdentity": {
          "ddsFile": "Art/2DItems/Armours/Gloves/GlovesStrDex3.dds",
          "id": "GlovesStrDex3"
      }
  },
  {
      "id": "Metadata/Items/Armours/Gloves/GlovesInt9",
      "name": "Sorcerer Gloves",
      "itemClass": "Gloves",
      "dropLevel": 69,
      "inventoryWidth": 2,
      "inventoryHeight": 2,
      "requirements": {
          "level": 69,
          "strength": 0,
          "dexterity": 0,
          "intelligence": 97
      },
      "properties": {
          "energy_shield": {
              "max": 57,
              "min": 49
          }
      },
      "implicits": [],
      "tags": [
          "int_armour",
          "gloves",
          "armour",
          "default"
      ],
      "visualIdentity": {
          "ddsFile": "Art/2DItems/Armours/Gloves/GlovesInt4.dds",
          "id": "GlovesInt4"
      }
  },
  {
      "id": "Metadata/Items/Armours/Gloves/GlovesStr9",
      "name": "Titan Gauntlets",
      "itemClass": "Gloves",
      "dropLevel": 69,
      "inventoryWidth": 2,
      "inventoryHeight": 2,
      "requirements": {
          "level": 69,
          "strength": 98,
          "dexterity": 0,
          "intelligence": 0
      },
      "properties": {
          "armour": {
              "max": 278,
              "min": 242
          }
      },
      "implicits": [],
      "tags": [
          "str_armour",
          "gloves",
          "armour",
          "default"
      ],
      "visualIdentity": {
          "ddsFile": "Art/2DItems/Armours/Gloves/GlovesStr4.dds",
          "id": "GlovesStr4"
      }
  },
  {
      "id": "Metadata/Items/Armours/Gloves/GlovesAtlasDex",
      "name": "Gripped Gloves",
      "itemClass": "Gloves",
      "dropLevel": 70,
      "inventoryWidth": 2,
      "inventoryHeight": 2,
      "requirements": {
          "level": 70,
          "strength": 0,
          "dexterity": 95,
          "intelligence": 0
      },
      "properties": {
          "evasion": {
              "max": 253,
              "min": 220
          }
      },
      "implicits": [
          "ProjectileAttackDamageImplicitGloves1"
      ],
      "tags": [
          "not_for_sale",
          "atlas_base_type",
          "glovesatlasdex",
          "dex_armour",
          "gloves",
          "armour",
          "default"
      ],
      "visualIdentity": {
          "ddsFile": "Art/2DItems/Armours/Gloves/GripGlovesBaseType.dds",
          "id": "GlovesAtlasDex"
      }
  },
  {
      "id": "Metadata/Items/Armours/Gloves/GlovesAtlasInt",
      "name": "Fingerless Silk Gloves",
      "itemClass": "Gloves",
      "dropLevel": 70,
      "inventoryWidth": 2,
      "inventoryHeight": 2,
      "requirements": {
          "level": 70,
          "strength": 0,
          "dexterity": 0,
          "intelligence": 95
      },
      "properties": {
          "energy_shield": {
              "max": 52,
              "min": 45
          }
      },
      "implicits": [
          "SpellDamageImplicitGloves1"
      ],
      "tags": [
          "not_for_sale",
          "atlas_base_type",
          "glovesatlasint",
          "int_armour",
          "gloves",
          "armour",
          "default"
      ],
      "visualIdentity": {
          "ddsFile": "Art/2DItems/Armours/Gloves/FingerlessSilkGloves.dds",
          "id": "GlovesAtlasInt"
      }
  },
  {
      "id": "Metadata/Items/Armours/Gloves/GlovesAtlasStr",
      "name": "Spiked Gloves",
      "itemClass": "Gloves",
      "dropLevel": 70,
      "inventoryWidth": 2,
      "inventoryHeight": 2,
      "requirements": {
          "level": 70,
          "strength": 95,
          "dexterity": 0,
          "intelligence": 0
      },
      "properties": {
          "armour": {
              "max": 253,
              "min": 220
          }
      },
      "implicits": [
          "MeleeDamageImplicitGloves1"
      ],
      "tags": [
          "not_for_sale",
          "atlas_base_type",
          "glovesatlasstr",
          "str_armour",
          "gloves",
          "armour",
          "default"
      ],
      "visualIdentity": {
          "ddsFile": "Art/2DItems/Armours/Gloves/SpikedGloves.dds",
          "id": "GlovesAtlasStr"
      }
  },
  {
      "id": "Metadata/Items/Armours/Gloves/GlovesAtlasStrInt",
      "name": "Apothecary's Gloves",
      "itemClass": "Gloves",
      "dropLevel": 70,
      "inventoryWidth": 2,
      "inventoryHeight": 2,
      "requirements": {
          "level": 70,
          "strength": 46,
          "dexterity": 0,
          "intelligence": 59
      },
      "properties": {
          "armour": {
              "max": 124,
              "min": 108
          },
          "energy_shield": {
              "max": 33,
              "min": 29
          }
      },
      "implicits": [
          "DegenerationDamageImplicit1"
      ],
      "tags": [
          "not_for_sale",
          "atlas_base_type",
          "glovesatlasstrint",
          "str_int_armour",
          "gloves",
          "armour",
          "default"
      ],
      "visualIdentity": {
          "ddsFile": "Art/2DItems/Armours/Gloves/ChemistGloves.dds",
          "id": "GlovesAtlasStrInt"
      }
  },
  {
      "id": "Metadata/Items/Armours/Gloves/GlovesDex9",
      "name": "Slink Gloves",
      "itemClass": "Gloves",
      "dropLevel": 70,
      "inventoryWidth": 2,
      "inventoryHeight": 2,
      "requirements": {
          "level": 70,
          "strength": 0,
          "dexterity": 95,
          "intelligence": 0
      },
      "properties": {
          "evasion": {
              "max": 278,
              "min": 242
          }
      },
      "implicits": [],
      "tags": [
          "dex_armour",
          "gloves",
          "armour",
          "default"
      ],
      "visualIdentity": {
          "ddsFile": "Art/2DItems/Armours/Gloves/GlovesDex4.dds",
          "id": "GlovesDex4"
      }
  },
];

// Helmet (64 items)
export const HELMET_BASES: PoeBaseItem[] = [
  {
      "id": "Metadata/Items/Armours/Helmets/HelmetStr1",
      "name": "Iron Hat",
      "itemClass": "Helmet",
      "dropLevel": 1,
      "inventoryWidth": 2,
      "inventoryHeight": 2,
      "requirements": {
          "level": 1,
          "strength": 9,
          "dexterity": 0,
          "intelligence": 0
      },
      "properties": {
          "armour": {
              "max": 13,
              "min": 9
          }
      },
      "implicits": [],
      "tags": [
          "str_armour",
          "helmet",
          "armour",
          "default"
      ],
      "visualIdentity": {
          "ddsFile": "Art/2DItems/Armours/Helmets/HelmetStr1.dds",
          "id": "HelmetStr1"
      }
  },
  {
      "id": "Metadata/Items/Armours/Helmets/HelmetDex1",
      "name": "Leather Cap",
      "itemClass": "Helmet",
      "dropLevel": 3,
      "inventoryWidth": 2,
      "inventoryHeight": 2,
      "requirements": {
          "level": 3,
          "strength": 0,
          "dexterity": 13,
          "intelligence": 0
      },
      "properties": {
          "evasion": {
              "max": 27,
              "min": 19
          }
      },
      "implicits": [],
      "tags": [
          "dex_armour",
          "helmet",
          "armour",
          "default"
      ],
      "visualIdentity": {
          "ddsFile": "Art/2DItems/Armours/Helmets/HelmetDex1.dds",
          "id": "HelmetDex1"
      }
  },
  {
      "id": "Metadata/Items/Armours/Helmets/HelmetInt1",
      "name": "Vine Circlet",
      "itemClass": "Helmet",
      "dropLevel": 3,
      "inventoryWidth": 2,
      "inventoryHeight": 2,
      "requirements": {
          "level": 3,
          "strength": 0,
          "dexterity": 0,
          "intelligence": 13
      },
      "properties": {
          "energy_shield": {
              "max": 10,
              "min": 7
          }
      },
      "implicits": [],
      "tags": [
          "int_armour",
          "helmet",
          "armour",
          "default"
      ],
      "visualIdentity": {
          "ddsFile": "Art/2DItems/Armours/Helmets/HelmetInt1.dds",
          "id": "HelmetInt1"
      }
  },
  {
      "id": "Metadata/Items/Armours/Helmets/HelmetDexInt1",
      "name": "Scare Mask",
      "itemClass": "Helmet",
      "dropLevel": 4,
      "inventoryWidth": 2,
      "inventoryHeight": 2,
      "requirements": {
          "level": 4,
          "strength": 0,
          "dexterity": 8,
          "intelligence": 8
      },
      "properties": {
          "energy_shield": {
              "max": 6,
              "min": 4
          },
          "evasion": {
              "max": 18,
              "min": 13
          }
      },
      "implicits": [],
      "tags": [
          "dex_int_armour",
          "helmet",
          "armour",
          "default"
      ],
      "visualIdentity": {
          "ddsFile": "Art/2DItems/Armours/Helmets/HelmetDexInt1.dds",
          "id": "HelmetDexInt1"
      }
  },
  {
      "id": "Metadata/Items/Armours/Helmets/HelmetStrDex1",
      "name": "Battered Helm",
      "itemClass": "Helmet",
      "dropLevel": 4,
      "inventoryWidth": 2,
      "inventoryHeight": 2,
      "requirements": {
          "level": 4,
          "strength": 8,
          "dexterity": 8,
          "intelligence": 0
      },
      "properties": {
          "armour": {
              "max": 18,
              "min": 13
          },
          "evasion": {
              "max": 18,
              "min": 13
          }
      },
      "implicits": [],
      "tags": [
          "str_dex_armour",
          "helmet",
          "armour",
          "default"
      ],
      "visualIdentity": {
          "ddsFile": "Art/2DItems/Armours/Helmets/HelmetStrDex1.dds",
          "id": "HelmetStrDex1"
      }
  },
  {
      "id": "Metadata/Items/Armours/Helmets/HelmetStrInt1",
      "name": "Rusted Coif",
      "itemClass": "Helmet",
      "dropLevel": 5,
      "inventoryWidth": 2,
      "inventoryHeight": 2,
      "requirements": {
          "level": 5,
          "strength": 9,
          "dexterity": 0,
          "intelligence": 9
      },
      "properties": {
          "armour": {
              "max": 22,
              "min": 16
          },
          "energy_shield": {
              "max": 7,
              "min": 5
          }
      },
      "implicits": [],
      "tags": [
          "str_int_armour",
          "helmet",
          "armour",
          "default"
      ],
      "visualIdentity": {
          "ddsFile": "Art/2DItems/Armours/Helmets/HelmetStrInt1.dds",
          "id": "HelmetStrInt1"
      }
  },
  {
      "id": "Metadata/Items/Armours/Helmets/HelmetStr2",
      "name": "Cone Helmet",
      "itemClass": "Helmet",
      "dropLevel": 7,
      "inventoryWidth": 2,
      "inventoryHeight": 2,
      "requirements": {
          "level": 7,
          "strength": 21,
          "dexterity": 0,
          "intelligence": 0
      },
      "properties": {
          "armour": {
              "max": 50,
              "min": 38
          }
      },
      "implicits": [],
      "tags": [
          "str_armour",
          "helmet",
          "armour",
          "default"
      ],
      "visualIdentity": {
          "ddsFile": "Art/2DItems/Armours/Helmets/HelmetStr2.dds",
          "id": "HelmetStr2"
      }
  },
  {
      "id": "Metadata/Items/Armours/Helmets/HelmetInt2",
      "name": "Iron Circlet",
      "itemClass": "Helmet",
      "dropLevel": 8,
      "inventoryWidth": 2,
      "inventoryHeight": 2,
      "requirements": {
          "level": 8,
          "strength": 0,
          "dexterity": 0,
          "intelligence": 23
      },
      "properties": {
          "energy_shield": {
              "max": 15,
              "min": 12
          }
      },
      "implicits": [],
      "tags": [
          "int_armour",
          "helmet",
          "armour",
          "default"
      ],
      "visualIdentity": {
          "ddsFile": "Art/2DItems/Armours/Helmets/HelmetInt2.dds",
          "id": "HelmetInt2"
      }
  },
  {
      "id": "Metadata/Items/Armours/Helmets/HelmetDex2",
      "name": "Tricorne",
      "itemClass": "Helmet",
      "dropLevel": 10,
      "inventoryWidth": 2,
      "inventoryHeight": 2,
      "requirements": {
          "level": 10,
          "strength": 0,
          "dexterity": 27,
          "intelligence": 0
      },
      "properties": {
          "evasion": {
              "max": 69,
              "min": 53
          }
      },
      "implicits": [],
      "tags": [
          "dex_armour",
          "helmet",
          "armour",
          "default"
      ],
      "visualIdentity": {
          "ddsFile": "Art/2DItems/Armours/Helmets/HelmetDex2.dds",
          "id": "HelmetDex2"
      }
  },
  {
      "id": "Metadata/Items/Armours/Helmets/HelmetDexInt2",
      "name": "Plague Mask",
      "itemClass": "Helmet",
      "dropLevel": 10,
      "inventoryWidth": 2,
      "inventoryHeight": 2,
      "requirements": {
          "level": 10,
          "strength": 0,
          "dexterity": 14,
          "intelligence": 14
      },
      "properties": {
          "energy_shield": {
              "max": 10,
              "min": 7
          },
          "evasion": {
              "max": 38,
              "min": 29
          }
      },
      "implicits": [],
      "tags": [
          "dex_int_armour",
          "helmet",
          "armour",
          "default"
      ],
      "visualIdentity": {
          "ddsFile": "Art/2DItems/Armours/Helmets/HelmetDexInt2.dds",
          "id": "HelmetDexInt2"
      }
  },
  {
      "id": "Metadata/Items/Armours/Helmets/HelmetStrInt2",
      "name": "Soldier Helmet",
      "itemClass": "Helmet",
      "dropLevel": 12,
      "inventoryWidth": 2,
      "inventoryHeight": 2,
      "requirements": {
          "level": 12,
          "strength": 16,
          "dexterity": 0,
          "intelligence": 16
      },
      "properties": {
          "armour": {
              "max": 45,
              "min": 34
          },
          "energy_shield": {
              "max": 11,
              "min": 8
          }
      },
      "implicits": [],
      "tags": [
          "str_int_armour",
          "helmet",
          "armour",
          "default"
      ],
      "visualIdentity": {
          "ddsFile": "Art/2DItems/Armours/Helmets/HelmetStrInt2.dds",
          "id": "HelmetStrInt2"
      }
  },
  {
      "id": "Metadata/Items/Armours/Helmets/HelmetStrDex2",
      "name": "Sallet",
      "itemClass": "Helmet",
      "dropLevel": 13,
      "inventoryWidth": 2,
      "inventoryHeight": 2,
      "requirements": {
          "level": 13,
          "strength": 18,
          "dexterity": 18,
          "intelligence": 0
      },
      "properties": {
          "armour": {
              "max": 48,
              "min": 37
          },
          "evasion": {
              "max": 48,
              "min": 37
          }
      },
      "implicits": [],
      "tags": [
          "str_dex_armour",
          "helmet",
          "armour",
          "default"
      ],
      "visualIdentity": {
          "ddsFile": "Art/2DItems/Armours/Helmets/HelmetStrDex2.dds",
          "id": "HelmetStrDex2"
      }
  },
  {
      "id": "Metadata/Items/Armours/Helmets/HelmetDexInt3",
      "name": "Iron Mask",
      "itemClass": "Helmet",
      "dropLevel": 17,
      "inventoryWidth": 2,
      "inventoryHeight": 2,
      "requirements": {
          "level": 17,
          "strength": 0,
          "dexterity": 21,
          "intelligence": 21
      },
      "properties": {
          "energy_shield": {
              "max": 14,
              "min": 11
          },
          "evasion": {
              "max": 60,
              "min": 48
          }
      },
      "implicits": [],
      "tags": [
          "dex_int_armour",
          "helmet",
          "armour",
          "default"
      ],
      "visualIdentity": {
          "ddsFile": "Art/2DItems/Armours/Helmets/HelmetDexInt3.dds",
          "id": "HelmetDexInt3"
      }
  },
  {
      "id": "Metadata/Items/Armours/Helmets/HelmetInt3",
      "name": "Torture Cage",
      "itemClass": "Helmet",
      "dropLevel": 17,
      "inventoryWidth": 2,
      "inventoryHeight": 2,
      "requirements": {
          "level": 17,
          "strength": 0,
          "dexterity": 0,
          "intelligence": 40
      },
      "properties": {
          "energy_shield": {
              "max": 25,
              "min": 20
          }
      },
      "implicits": [],
      "tags": [
          "int_armour",
          "helmet",
          "armour",
          "default"
      ],
      "visualIdentity": {
          "ddsFile": "Art/2DItems/Armours/Helmets/HelmetInt3.dds",
          "id": "HelmetInt3"
      }
  },
  {
      "id": "Metadata/Items/Armours/Helmets/HelmetStr3",
      "name": "Barbute Helmet",
      "itemClass": "Helmet",
      "dropLevel": 18,
      "inventoryWidth": 2,
      "inventoryHeight": 2,
      "requirements": {
          "level": 18,
          "strength": 42,
          "dexterity": 0,
          "intelligence": 0
      },
      "properties": {
          "armour": {
              "max": 115,
              "min": 92
          }
      },
      "implicits": [],
      "tags": [
          "str_armour",
          "helmet",
          "armour",
          "default"
      ],
      "visualIdentity": {
          "ddsFile": "Art/2DItems/Armours/Helmets/HelmetStr3.dds",
          "id": "HelmetStr3"
      }
  },
  {
      "id": "Metadata/Items/Armours/Helmets/HelmetDex3",
      "name": "Leather Hood",
      "itemClass": "Helmet",
      "dropLevel": 20,
      "inventoryWidth": 2,
      "inventoryHeight": 2,
      "requirements": {
          "level": 20,
          "strength": 0,
          "dexterity": 46,
          "intelligence": 0
      },
      "properties": {
          "evasion": {
              "max": 127,
              "min": 101
          }
      },
      "implicits": [],
      "tags": [
          "dex_armour",
          "helmet",
          "armour",
          "default"
      ],
      "visualIdentity": {
          "ddsFile": "Art/2DItems/Armours/Helmets/HelmetDex3.dds",
          "id": "HelmetDex3"
      }
  },
  {
      "id": "Metadata/Items/Armours/Helmets/HelmetStrInt3",
      "name": "Great Helmet",
      "itemClass": "Helmet",
      "dropLevel": 22,
      "inventoryWidth": 2,
      "inventoryHeight": 2,
      "requirements": {
          "level": 22,
          "strength": 27,
          "dexterity": 0,
          "intelligence": 27
      },
      "properties": {
          "armour": {
              "max": 76,
              "min": 61
          },
          "energy_shield": {
              "max": 17,
              "min": 14
          }
      },
      "implicits": [],
      "tags": [
          "str_int_armour",
          "helmet",
          "armour",
          "default"
      ],
      "visualIdentity": {
          "ddsFile": "Art/2DItems/Armours/Helmets/HelmetStrInt3.dds",
          "id": "HelmetStrInt3"
      }
  },
  {
      "id": "Metadata/Items/Armours/Helmets/HelmetStrDex3",
      "name": "Visored Sallet",
      "itemClass": "Helmet",
      "dropLevel": 23,
      "inventoryWidth": 2,
      "inventoryHeight": 2,
      "requirements": {
          "level": 23,
          "strength": 28,
          "dexterity": 28,
          "intelligence": 0
      },
      "properties": {
          "armour": {
              "max": 80,
              "min": 64
          },
          "evasion": {
              "max": 80,
              "min": 64
          }
      },
      "implicits": [],
      "tags": [
          "str_dex_armour",
          "helmet",
          "armour",
          "default"
      ],
      "visualIdentity": {
          "ddsFile": "Art/2DItems/Armours/Helmets/HelmetStrDex3.dds",
          "id": "HelmetStrDex3"
      }
  },
  {
      "id": "Metadata/Items/Armours/Helmets/HelmetInt4",
      "name": "Tribal Circlet",
      "itemClass": "Helmet",
      "dropLevel": 26,
      "inventoryWidth": 2,
      "inventoryHeight": 2,
      "requirements": {
          "level": 26,
          "strength": 0,
          "dexterity": 0,
          "intelligence": 58
      },
      "properties": {
          "energy_shield": {
              "max": 33,
              "min": 28
          }
      },
      "implicits": [],
      "tags": [
          "int_armour",
          "helmet",
          "armour",
          "default"
      ],
      "visualIdentity": {
          "ddsFile": "Art/2DItems/Armours/Helmets/HelmetInt4.dds",
          "id": "HelmetInt4"
      }
  },
  {
      "id": "Metadata/Items/Armours/Helmets/HelmetStr4",
      "name": "Close Helmet",
      "itemClass": "Helmet",
      "dropLevel": 26,
      "inventoryWidth": 2,
      "inventoryHeight": 2,
      "requirements": {
          "level": 26,
          "strength": 58,
          "dexterity": 0,
          "intelligence": 0
      },
      "properties": {
          "armour": {
              "max": 150,
              "min": 130
          }
      },
      "implicits": [],
      "tags": [
          "str_armour",
          "helmet",
          "armour",
          "default"
      ],
      "visualIdentity": {
          "ddsFile": "Art/2DItems/Armours/Helmets/HelmetStr4.dds",
          "id": "HelmetStr4"
      }
  },
  {
      "id": "Metadata/Items/Armours/Helmets/HelmetDexInt4",
      "name": "Festival Mask",
      "itemClass": "Helmet",
      "dropLevel": 28,
      "inventoryWidth": 2,
      "inventoryHeight": 2,
      "requirements": {
          "level": 28,
          "strength": 0,
          "dexterity": 33,
          "intelligence": 33
      },
      "properties": {
          "energy_shield": {
              "max": 19,
              "min": 17
          },
          "evasion": {
              "max": 88,
              "min": 77
          }
      },
      "implicits": [],
      "tags": [
          "dex_int_armour",
          "helmet",
          "armour",
          "default"
      ],
      "visualIdentity": {
          "ddsFile": "Art/2DItems/Armours/Helmets/HelmetDexInt4.dds",
          "id": "HelmetDexInt4"
      }
  },
  {
      "id": "Metadata/Items/Armours/Helmets/HelmetDex4",
      "name": "Wolf Pelt",
      "itemClass": "Helmet",
      "dropLevel": 30,
      "inventoryWidth": 2,
      "inventoryHeight": 2,
      "requirements": {
          "level": 30,
          "strength": 0,
          "dexterity": 66,
          "intelligence": 0
      },
      "properties": {
          "evasion": {
              "max": 172,
              "min": 150
          }
      },
      "implicits": [],
      "tags": [
          "dex_armour",
          "helmet",
          "armour",
          "default"
      ],
      "visualIdentity": {
          "ddsFile": "Art/2DItems/Armours/Helmets/HelmetDex4.dds",
          "id": "HelmetDex4"
      }
  },
  {
      "id": "Metadata/Items/Armours/Helmets/HelmetStrInt4",
      "name": "Crusader Helmet",
      "itemClass": "Helmet",
      "dropLevel": 31,
      "inventoryWidth": 2,
      "inventoryHeight": 2,
      "requirements": {
          "level": 31,
          "strength": 36,
          "dexterity": 0,
          "intelligence": 36
      },
      "properties": {
          "armour": {
              "max": 95,
              "min": 85
          },
          "energy_shield": {
              "max": 20,
              "min": 18
          }
      },
      "implicits": [],
      "tags": [
          "str_int_armour",
          "helmet",
          "armour",
          "default"
      ],
      "visualIdentity": {
          "ddsFile": "Art/2DItems/Armours/Helmets/HelmetStrInt4.dds",
          "id": "HelmetStrInt4"
      }
  },
  {
      "id": "Metadata/Items/Armours/Helmets/HelmetStrDex4",
      "name": "Gilded Sallet",
      "itemClass": "Helmet",
      "dropLevel": 33,
      "inventoryWidth": 2,
      "inventoryHeight": 2,
      "requirements": {
          "level": 33,
          "strength": 38,
          "dexterity": 38,
          "intelligence": 0
      },
      "properties": {
          "armour": {
              "max": 97,
              "min": 90
          },
          "evasion": {
              "max": 97,
              "min": 90
          }
      },
      "implicits": [],
      "tags": [
          "str_dex_armour",
          "helmet",
          "armour",
          "default"
      ],
      "visualIdentity": {
          "ddsFile": "Art/2DItems/Armours/Helmets/HelmetStrDex4.dds",
          "id": "HelmetStrDex4"
      }
  },
  {
      "id": "Metadata/Items/Armours/Helmets/HelmetInt5",
      "name": "Bone Circlet",
      "itemClass": "Helmet",
      "dropLevel": 34,
      "inventoryWidth": 2,
      "inventoryHeight": 2,
      "requirements": {
          "level": 34,
          "strength": 0,
          "dexterity": 0,
          "intelligence": 73
      },
      "properties": {
          "energy_shield": {
              "max": 40,
              "min": 36
          }
      },
      "implicits": [],
      "tags": [
          "int_armour",
          "helmet",
          "armour",
          "default"
      ],
      "visualIdentity": {
          "ddsFile": "Art/2DItems/Armours/Helmets/HelmetInt5.dds",
          "id": "HelmetInt5"
      }
  },
  {
      "id": "Metadata/Items/Armours/Helmets/HelmetDexInt5",
      "name": "Golden Mask",
      "itemClass": "Helmet",
      "dropLevel": 35,
      "inventoryWidth": 2,
      "inventoryHeight": 2,
      "requirements": {
          "level": 35,
          "strength": 0,
          "dexterity": 40,
          "intelligence": 40
      },
      "properties": {
          "energy_shield": {
              "max": 22,
              "min": 20
          },
          "evasion": {
              "max": 103,
              "min": 96
          }
      },
      "implicits": [],
      "tags": [
          "dex_int_armour",
          "helmet",
          "armour",
          "default"
      ],
      "visualIdentity": {
          "ddsFile": "Art/2DItems/Armours/Helmets/HelmetDexInt5.dds",
          "id": "HelmetDexInt5"
      }
  },
  {
      "id": "Metadata/Items/Armours/Helmets/HelmetStr5",
      "name": "Gladiator Helmet",
      "itemClass": "Helmet",
      "dropLevel": 35,
      "inventoryWidth": 2,
      "inventoryHeight": 2,
      "requirements": {
          "level": 35,
          "strength": 75,
          "dexterity": 0,
          "intelligence": 0
      },
      "properties": {
          "armour": {
              "max": 195,
              "min": 174
          }
      },
      "implicits": [],
      "tags": [
          "str_armour",
          "helmet",
          "armour",
          "default"
      ],
      "visualIdentity": {
          "ddsFile": "Art/2DItems/Armours/Helmets/HelmetStr5.dds",
          "id": "HelmetStr5"
      }
  },
  {
      "id": "Metadata/Items/Armours/Helmets/HelmetStrDex5",
      "name": "Secutor Helm",
      "itemClass": "Helmet",
      "dropLevel": 36,
      "inventoryWidth": 2,
      "inventoryHeight": 2,
      "requirements": {
          "level": 36,
          "strength": 42,
          "dexterity": 42,
          "intelligence": 0
      },
      "properties": {
          "armour": {
              "max": 116,
              "min": 98
          },
          "evasion": {
              "max": 116,
              "min": 98
          }
      },
      "implicits": [],
      "tags": [
          "str_dex_armour",
          "helmet",
          "armour",
          "default"
      ],
      "visualIdentity": {
          "ddsFile": "Art/2DItems/Armours/Helmets/HelmetStrDex5.dds",
          "id": "HelmetStrDex5"
      }
  },
  {
      "id": "Metadata/Items/Armours/Helmets/HelmetStrInt5",
      "name": "Aventail Helmet",
      "itemClass": "Helmet",
      "dropLevel": 37,
      "inventoryWidth": 2,
      "inventoryHeight": 2,
      "requirements": {
          "level": 37,
          "strength": 42,
          "dexterity": 0,
          "intelligence": 42
      },
      "properties": {
          "armour": {
              "max": 119,
              "min": 101
          },
          "energy_shield": {
              "max": 25,
              "min": 21
          }
      },
      "implicits": [],
      "tags": [
          "str_int_armour",
          "helmet",
          "armour",
          "default"
      ],
      "visualIdentity": {
          "ddsFile": "Art/2DItems/Armours/Helmets/HelmetStrInt5.dds",
          "id": "HelmetStrInt5"
      }
  },
  {
      "id": "Metadata/Items/Armours/Helmets/HelmetDexInt6",
      "name": "Raven Mask",
      "itemClass": "Helmet",
      "dropLevel": 38,
      "inventoryWidth": 2,
      "inventoryHeight": 2,
      "requirements": {
          "level": 38,
          "strength": 0,
          "dexterity": 44,
          "intelligence": 44
      },
      "properties": {
          "energy_shield": {
              "max": 25,
              "min": 22
          },
          "evasion": {
              "max": 119,
              "min": 104
          }
      },
      "implicits": [],
      "tags": [
          "dex_int_armour",
          "helmet",
          "armour",
          "default"
      ],
      "visualIdentity": {
          "ddsFile": "Art/2DItems/Armours/Helmets/HelmetDexInt6.dds",
          "id": "HelmetDexInt6"
      }
  },
  {
      "id": "Metadata/Items/Armours/Helmets/HelmetInt6",
      "name": "Lunaris Circlet",
      "itemClass": "Helmet",
      "dropLevel": 39,
      "inventoryWidth": 2,
      "inventoryHeight": 2,
      "requirements": {
          "level": 39,
          "strength": 0,
          "dexterity": 0,
          "intelligence": 83
      },
      "properties": {
          "energy_shield": {
              "max": 48,
              "min": 41
          }
      },
      "implicits": [],
      "tags": [
          "int_armour",
          "helmet",
          "armour",
          "default"
      ],
      "visualIdentity": {
          "ddsFile": "Art/2DItems/Armours/Helmets/HelmetInt6.dds",
          "id": "HelmetInt6"
      }
  },
  {
      "id": "Metadata/Items/Armours/Helmets/HelmetStr6",
      "name": "Reaver Helmet",
      "itemClass": "Helmet",
      "dropLevel": 40,
      "inventoryWidth": 2,
      "inventoryHeight": 2,
      "requirements": {
          "level": 40,
          "strength": 85,
          "dexterity": 0,
          "intelligence": 0
      },
      "properties": {
          "armour": {
              "max": 233,
              "min": 198
          }
      },
      "implicits": [],
      "tags": [
          "str_armour",
          "helmet",
          "armour",
          "default"
      ],
      "visualIdentity": {
          "ddsFile": "Art/2DItems/Armours/Helmets/HelmetStr6.dds",
          "id": "HelmetStr6"
      }
  },
  {
      "id": "Metadata/Items/Armours/Helmets/HelmetDex5",
      "name": "Hunter Hood",
      "itemClass": "Helmet",
      "dropLevel": 41,
      "inventoryWidth": 2,
      "inventoryHeight": 2,
      "requirements": {
          "level": 41,
          "strength": 0,
          "dexterity": 87,
          "intelligence": 0
      },
      "properties": {
          "evasion": {
              "max": 227,
              "min": 203
          }
      },
      "implicits": [],
      "tags": [
          "dex_armour",
          "helmet",
          "armour",
          "default"
      ],
      "visualIdentity": {
          "ddsFile": "Art/2DItems/Armours/Helmets/HelmetDex5.dds",
          "id": "HelmetDex5"
      }
  },
  {
      "id": "Metadata/Items/Armours/Helmets/HelmetStrDex6",
      "name": "Fencer Helm",
      "itemClass": "Helmet",
      "dropLevel": 43,
      "inventoryWidth": 2,
      "inventoryHeight": 2,
      "requirements": {
          "level": 43,
          "strength": 49,
          "dexterity": 49,
          "intelligence": 0
      },
      "properties": {
          "armour": {
              "max": 134,
              "min": 117
          },
          "evasion": {
              "max": 134,
              "min": 117
          }
      },
      "implicits": [],
      "tags": [
          "str_dex_armour",
          "helmet",
          "armour",
          "default"
      ],
      "visualIdentity": {
          "ddsFile": "Art/2DItems/Armours/Helmets/HelmetStrDex6.dds",
          "id": "HelmetStrDex6"
      }
  },
  {
      "id": "Metadata/Items/Armours/Helmets/HelmetStrInt6",
      "name": "Zealot Helmet",
      "itemClass": "Helmet",
      "dropLevel": 44,
      "inventoryWidth": 2,
      "inventoryHeight": 2,
      "requirements": {
          "level": 44,
          "strength": 50,
          "dexterity": 0,
          "intelligence": 50
      },
      "properties": {
          "armour": {
              "max": 137,
              "min": 119
          },
          "energy_shield": {
              "max": 29,
              "min": 25
          }
      },
      "implicits": [],
      "tags": [
          "str_int_armour",
          "helmet",
          "armour",
          "default"
      ],
      "visualIdentity": {
          "ddsFile": "Art/2DItems/Armours/Helmets/HelmetStrInt6.dds",
          "id": "HelmetStrInt6"
      }
  },
  {
      "id": "Metadata/Items/Armours/Helmets/HelmetDexInt7",
      "name": "Callous Mask",
      "itemClass": "Helmet",
      "dropLevel": 45,
      "inventoryWidth": 2,
      "inventoryHeight": 2,
      "requirements": {
          "level": 45,
          "strength": 0,
          "dexterity": 51,
          "intelligence": 51
      },
      "properties": {
          "energy_shield": {
              "max": 28,
              "min": 25
          },
          "evasion": {
              "max": 137,
              "min": 122
          }
      },
      "implicits": [],
      "tags": [
          "dex_int_armour",
          "helmet",
          "armour",
          "default"
      ],
      "visualIdentity": {
          "ddsFile": "Art/2DItems/Armours/Helmets/HelmetDexInt7.dds",
          "id": "HelmetDexInt7"
      }
  },
  {
      "id": "Metadata/Items/Armours/Helmets/HelmetDex6",
      "name": "Noble Tricorne",
      "itemClass": "Helmet",
      "dropLevel": 47,
      "inventoryWidth": 2,
      "inventoryHeight": 2,
      "requirements": {
          "level": 47,
          "strength": 0,
          "dexterity": 99,
          "intelligence": 0
      },
      "properties": {
          "evasion": {
              "max": 266,
              "min": 232
          }
      },
      "implicits": [],
      "tags": [
          "dex_armour",
          "helmet",
          "armour",
          "default"
      ],
      "visualIdentity": {
          "ddsFile": "Art/2DItems/Armours/Helmets/HelmetDex6.dds",
          "id": "HelmetDex6"
      }
  },
  {
      "id": "Metadata/Items/Armours/Helmets/HelmetInt7",
      "name": "Steel Circlet",
      "itemClass": "Helmet",
      "dropLevel": 48,
      "inventoryWidth": 2,
      "inventoryHeight": 2,
      "requirements": {
          "level": 48,
          "strength": 0,
          "dexterity": 0,
          "intelligence": 101
      },
      "properties": {
          "energy_shield": {
              "max": 55,
              "min": 49
          }
      },
      "implicits": [],
      "tags": [
          "int_armour",
          "helmet",
          "armour",
          "default"
      ],
      "visualIdentity": {
          "ddsFile": "Art/2DItems/Armours/Helmets/HelmetInt7.dds",
          "id": "HelmetInt7"
      }
  },
  {
      "id": "Metadata/Items/Armours/Helmets/HelmetStr7",
      "name": "Siege Helmet",
      "itemClass": "Helmet",
      "dropLevel": 48,
      "inventoryWidth": 2,
      "inventoryHeight": 2,
      "requirements": {
          "level": 48,
          "strength": 101,
          "dexterity": 0,
          "intelligence": 0
      },
      "properties": {
          "armour": {
              "max": 272,
              "min": 237
          }
      },
      "implicits": [],
      "tags": [
          "str_armour",
          "helmet",
          "armour",
          "default"
      ],
      "visualIdentity": {
          "ddsFile": "Art/2DItems/Armours/Helmets/HelmetStr7.dds",
          "id": "HelmetStr7"
      }
  },
  {
      "id": "Metadata/Items/Armours/Helmets/HelmetStrDex7",
      "name": "Lacquered Helmet",
      "itemClass": "Helmet",
      "dropLevel": 51,
      "inventoryWidth": 2,
      "inventoryHeight": 2,
      "requirements": {
          "level": 51,
          "strength": 57,
          "dexterity": 57,
          "intelligence": 0
      },
      "properties": {
          "armour": {
              "max": 155,
              "min": 138
          },
          "evasion": {
              "max": 155,
              "min": 138
          }
      },
      "implicits": [],
      "tags": [
          "str_dex_armour",
          "helmet",
          "armour",
          "default"
      ],
      "visualIdentity": {
          "ddsFile": "Art/2DItems/Armours/Helmets/HelmetStrDex7.dds",
          "id": "HelmetStrDex7"
      }
  },
  {
      "id": "Metadata/Items/Armours/Helmets/HelmetDexInt8",
      "name": "Regicide Mask",
      "itemClass": "Helmet",
      "dropLevel": 52,
      "inventoryWidth": 2,
      "inventoryHeight": 2,
      "requirements": {
          "level": 52,
          "strength": 0,
          "dexterity": 58,
          "intelligence": 58
      },
      "properties": {
          "energy_shield": {
              "max": 32,
              "min": 29
          },
          "evasion": {
              "max": 158,
              "min": 141
          }
      },
      "implicits": [],
      "tags": [
          "dex_int_armour",
          "helmet",
          "armour",
          "default"
      ],
      "visualIdentity": {
          "ddsFile": "Art/2DItems/Armours/Helmets/HelmetDexInt8.dds",
          "id": "HelmetDexInt8"
      }
  },
  {
      "id": "Metadata/Items/Armours/Helmets/HelmetStrInt7",
      "name": "Great Crown",
      "itemClass": "Helmet",
      "dropLevel": 53,
      "inventoryWidth": 2,
      "inventoryHeight": 2,
      "requirements": {
          "level": 53,
          "strength": 59,
          "dexterity": 0,
          "intelligence": 59
      },
      "properties": {
          "armour": {
              "max": 161,
              "min": 143
          },
          "energy_shield": {
              "max": 33,
              "min": 29
          }
      },
      "implicits": [],
      "tags": [
          "str_int_armour",
          "helmet",
          "armour",
          "default"
      ],
      "visualIdentity": {
          "ddsFile": "Art/2DItems/Armours/Helmets/HelmetStrInt7.dds",
          "id": "HelmetStrInt7"
      }
  },
  {
      "id": "Metadata/Items/Armours/Helmets/HelmetInt8",
      "name": "Necromancer Circlet",
      "itemClass": "Helmet",
      "dropLevel": 54,
      "inventoryWidth": 2,
      "inventoryHeight": 2,
      "requirements": {
          "level": 54,
          "strength": 0,
          "dexterity": 0,
          "intelligence": 112
      },
      "properties": {
          "energy_shield": {
              "max": 64,
              "min": 55
          }
      },
      "implicits": [],
      "tags": [
          "int_armour",
          "helmet",
          "armour",
          "default"
      ],
      "visualIdentity": {
          "ddsFile": "Art/2DItems/Armours/Helmets/HelmetInt8.dds",
          "id": "HelmetInt8"
      }
  },
  {
      "id": "Metadata/Items/Armours/Helmets/HelmetDex7",
      "name": "Ursine Pelt",
      "itemClass": "Helmet",
      "dropLevel": 55,
      "inventoryWidth": 2,
      "inventoryHeight": 2,
      "requirements": {
          "level": 55,
          "strength": 0,
          "dexterity": 114,
          "intelligence": 0
      },
      "properties": {
          "evasion": {
              "max": 325,
              "min": 276
          }
      },
      "implicits": [],
      "tags": [
          "dex_armour",
          "helmet",
          "armour",
          "default"
      ],
      "visualIdentity": {
          "ddsFile": "Art/2DItems/Armours/Helmets/HelmetDex7.dds",
          "id": "HelmetDex7"
      }
  },
  {
      "id": "Metadata/Items/Armours/Helmets/HelmetStr8",
      "name": "Samnite Helmet",
      "itemClass": "Helmet",
      "dropLevel": 55,
      "inventoryWidth": 2,
      "inventoryHeight": 2,
      "requirements": {
          "level": 55,
          "strength": 114,
          "dexterity": 0,
          "intelligence": 0
      },
      "properties": {
          "armour": {
              "max": 325,
              "min": 276
          }
      },
      "implicits": [],
      "tags": [
          "str_armour",
          "helmet",
          "armour",
          "default"
      ],
      "visualIdentity": {
          "ddsFile": "Art/2DItems/Armours/Helmets/HelmetStr8.dds",
          "id": "HelmetStr8"
      }
  },
  {
      "id": "Metadata/Items/Armours/Helmets/HelmetDexInt9",
      "name": "Harlequin Mask",
      "itemClass": "Helmet",
      "dropLevel": 57,
      "inventoryWidth": 2,
      "inventoryHeight": 2,
      "requirements": {
          "level": 57,
          "strength": 0,
          "dexterity": 64,
          "intelligence": 64
      },
      "properties": {
          "energy_shield": {
              "max": 38,
              "min": 32
          },
          "evasion": {
              "max": 185,
              "min": 157
          }
      },
      "implicits": [],
      "tags": [
          "dex_int_armour",
          "helmet",
          "armour",
          "default"
      ],
      "visualIdentity": {
          "ddsFile": "Art/2DItems/Armours/Helmets/HelmetDexInt9.dds",
          "id": "HelmetDexInt9"
      }
  },
  {
      "id": "Metadata/Items/Armours/Helmets/HelmetStrDex8",
      "name": "Fluted Bascinet",
      "itemClass": "Helmet",
      "dropLevel": 58,
      "inventoryWidth": 2,
      "inventoryHeight": 2,
      "requirements": {
          "level": 58,
          "strength": 64,
          "dexterity": 64,
          "intelligence": 0
      },
      "properties": {
          "armour": {
              "max": 189,
              "min": 160
          },
          "evasion": {
              "max": 189,
              "min": 160
          }
      },
      "implicits": [],
      "tags": [
          "str_dex_armour",
          "helmet",
          "armour",
          "default"
      ],
      "visualIdentity": {
          "ddsFile": "Art/2DItems/Armours/Helmets/HelmetStrDex8.dds",
          "id": "HelmetStrDex8"
      }
  },
  {
      "id": "Metadata/Items/Armours/Helmets/HelmetStrInt8",
      "name": "Magistrate Crown",
      "itemClass": "Helmet",
      "dropLevel": 58,
      "inventoryWidth": 2,
      "inventoryHeight": 2,
      "requirements": {
          "level": 58,
          "strength": 64,
          "dexterity": 0,
          "intelligence": 64
      },
      "properties": {
          "armour": {
              "max": 189,
              "min": 160
          },
          "energy_shield": {
              "max": 39,
              "min": 33
          }
      },
      "implicits": [],
      "tags": [
          "str_int_armour",
          "helmet",
          "armour",
          "default"
      ],
      "visualIdentity": {
          "ddsFile": "Art/2DItems/Armours/Helmets/HelmetStrInt8.dds",
          "id": "HelmetStrInt8"
      }
  },
  {
      "id": "Metadata/Items/Armours/Helmets/HelmetInt9",
      "name": "Solaris Circlet",
      "itemClass": "Helmet",
      "dropLevel": 59,
      "inventoryWidth": 2,
      "inventoryHeight": 2,
      "requirements": {
          "level": 59,
          "strength": 0,
          "dexterity": 0,
          "intelligence": 122
      },
      "properties": {
          "energy_shield": {
              "max": 68,
              "min": 60
          }
      },
      "implicits": [],
      "tags": [
          "int_armour",
          "helmet",
          "armour",
          "default"
      ],
      "visualIdentity": {
          "ddsFile": "Art/2DItems/Armours/Helmets/HelmetInt9.dds",
          "id": "HelmetInt9"
      }
  },
  {
      "id": "Metadata/Items/Armours/Helmets/HelmetDex8",
      "name": "Silken Hood",
      "itemClass": "Helmet",
      "dropLevel": 60,
      "inventoryWidth": 2,
      "inventoryHeight": 2,
      "requirements": {
          "level": 60,
          "strength": 0,
          "dexterity": 138,
          "intelligence": 0
      },
      "properties": {
          "evasion": {
              "max": 381,
              "min": 346
          }
      },
      "implicits": [],
      "tags": [
          "dex_armour",
          "helmet",
          "armour",
          "default"
      ],
      "visualIdentity": {
          "ddsFile": "Art/2DItems/Armours/Helmets/HelmetDex8.dds",
          "id": "HelmetDex8"
      }
  },
  {
      "id": "Metadata/Items/Armours/Helmets/HelmetStr9",
      "name": "Ezomyte Burgonet",
      "itemClass": "Helmet",
      "dropLevel": 60,
      "inventoryWidth": 2,
      "inventoryHeight": 2,
      "requirements": {
          "level": 60,
          "strength": 138,
          "dexterity": 0,
          "intelligence": 0
      },
      "properties": {
          "armour": {
              "max": 381,
              "min": 346
          }
      },
      "implicits": [],
      "tags": [
          "str_armour",
          "helmet",
          "armour",
          "default"
      ],
      "visualIdentity": {
          "ddsFile": "Art/2DItems/Armours/Helmets/HelmetStr9.dds",
          "id": "HelmetStr9"
      }
  },
  {
      "id": "Metadata/Items/Armours/Helmets/HelmetDexInt10",
      "name": "Vaal Mask",
      "itemClass": "Helmet",
      "dropLevel": 62,
      "inventoryWidth": 2,
      "inventoryHeight": 2,
      "requirements": {
          "level": 62,
          "strength": 0,
          "dexterity": 79,
          "intelligence": 72
      },
      "properties": {
          "energy_shield": {
              "max": 43,
              "min": 37
          },
          "evasion": {
              "max": 239,
              "min": 207
          }
      },
      "implicits": [],
      "tags": [
          "dex_int_armour",
          "helmet",
          "armour",
          "default"
      ],
      "visualIdentity": {
          "ddsFile": "Art/2DItems/Armours/Helmets/HelmetDexInt10.dds",
          "id": "HelmetDexInt10"
      }
  },
  {
      "id": "Metadata/Items/Armours/Helmets/HelmetStrDex9",
      "name": "Pig-Faced Bascinet",
      "itemClass": "Helmet",
      "dropLevel": 63,
      "inventoryWidth": 2,
      "inventoryHeight": 2,
      "requirements": {
          "level": 63,
          "strength": 85,
          "dexterity": 62,
          "intelligence": 0
      },
      "properties": {
          "armour": {
              "max": 263,
              "min": 229
          },
          "evasion": {
              "max": 183,
              "min": 159
          }
      },
      "implicits": [],
      "tags": [
          "str_dex_armour",
          "helmet",
          "armour",
          "default"
      ],
      "visualIdentity": {
          "ddsFile": "Art/2DItems/Armours/Helmets/HelmetStrDex9.dds",
          "id": "HelmetStrDex9"
      }
  },
  {
      "id": "Metadata/Items/Armours/Helmets/HelmetStrInt9",
      "name": "Prophet Crown",
      "itemClass": "Helmet",
      "dropLevel": 63,
      "inventoryWidth": 2,
      "inventoryHeight": 2,
      "requirements": {
          "level": 63,
          "strength": 85,
          "dexterity": 0,
          "intelligence": 62
      },
      "properties": {
          "armour": {
              "max": 258,
              "min": 224
          },
          "energy_shield": {
              "max": 37,
              "min": 32
          }
      },
      "implicits": [],
      "tags": [
          "str_int_armour",
          "helmet",
          "armour",
          "default"
      ],
      "visualIdentity": {
          "ddsFile": "Art/2DItems/Armours/Helmets/HelmetStrInt9.dds",
          "id": "HelmetStrInt9"
      }
  },
  {
      "id": "Metadata/Items/Armours/Helmets/HelmetDex9",
      "name": "Sinner Tricorne",
      "itemClass": "Helmet",
      "dropLevel": 64,
      "inventoryWidth": 2,
      "inventoryHeight": 2,
      "requirements": {
          "level": 64,
          "strength": 0,
          "dexterity": 138,
          "intelligence": 0
      },
      "properties": {
          "evasion": {
              "max": 425,
              "min": 369
          }
      },
      "implicits": [],
      "tags": [
          "dex_armour",
          "helmet",
          "armour",
          "default"
      ],
      "visualIdentity": {
          "ddsFile": "Art/2DItems/Armours/Helmets/HelmetDex9.dds",
          "id": "HelmetDex9"
      }
  },
  {
      "id": "Metadata/Items/Armours/Helmets/HelmetInt10",
      "name": "Mind Cage",
      "itemClass": "Helmet",
      "dropLevel": 65,
      "inventoryWidth": 2,
      "inventoryHeight": 2,
      "requirements": {
          "level": 65,
          "strength": 0,
          "dexterity": 0,
          "intelligence": 138
      },
      "properties": {
          "energy_shield": {
              "max": 84,
              "min": 73
          }
      },
      "implicits": [],
      "tags": [
          "int_armour",
          "helmet",
          "armour",
          "default"
      ],
      "visualIdentity": {
          "ddsFile": "Art/2DItems/Armours/Helmets/HelmetInt10.dds",
          "id": "HelmetInt10"
      }
  },
  {
      "id": "Metadata/Items/Armours/Helmets/HelmetStr10",
      "name": "Royal Burgonet",
      "itemClass": "Helmet",
      "dropLevel": 65,
      "inventoryWidth": 2,
      "inventoryHeight": 2,
      "requirements": {
          "level": 65,
          "strength": 148,
          "dexterity": 0,
          "intelligence": 0
      },
      "properties": {
          "armour": {
              "max": 434,
              "min": 377
          }
      },
      "implicits": [],
      "tags": [
          "str_armour",
          "helmet",
          "armour",
          "default"
      ],
      "visualIdentity": {
          "ddsFile": "Art/2DItems/Armours/Helmets/HelmetStr10.dds",
          "id": "HelmetStr10"
      }
  },
  {
      "id": "Metadata/Items/Armours/Helmets/HelmetDexInt11",
      "name": "Deicide Mask",
      "itemClass": "Helmet",
      "dropLevel": 67,
      "inventoryWidth": 2,
      "inventoryHeight": 2,
      "requirements": {
          "level": 67,
          "strength": 0,
          "dexterity": 73,
          "intelligence": 88
      },
      "properties": {
          "energy_shield": {
              "max": 54,
              "min": 47
          },
          "evasion": {
              "max": 219,
              "min": 190
          }
      },
      "implicits": [],
      "tags": [
          "dex_int_armour",
          "helmet",
          "armour",
          "default"
      ],
      "visualIdentity": {
          "ddsFile": "Art/2DItems/Armours/Helmets/HelmetDexInt11.dds",
          "id": "HelmetDexInt11"
      }
  },
  {
      "id": "Metadata/Items/Armours/Helmets/HelmetStrDex10",
      "name": "Nightmare Bascinet",
      "itemClass": "Helmet",
      "dropLevel": 67,
      "inventoryWidth": 2,
      "inventoryHeight": 2,
      "requirements": {
          "level": 67,
          "strength": 62,
          "dexterity": 85,
          "intelligence": 0
      },
      "properties": {
          "armour": {
              "max": 187,
              "min": 162
          },
          "evasion": {
              "max": 268,
              "min": 233
          }
      },
      "implicits": [],
      "tags": [
          "str_dex_armour",
          "helmet",
          "armour",
          "default"
      ],
      "visualIdentity": {
          "ddsFile": "Art/2DItems/Armours/Helmets/HelmetStrDex10.dds",
          "id": "HelmetStrDex10"
      }
  },
  {
      "id": "Metadata/Items/Armours/Helmets/HelmetStrInt10",
      "name": "Praetor Crown",
      "itemClass": "Helmet",
      "dropLevel": 68,
      "inventoryWidth": 2,
      "inventoryHeight": 2,
      "requirements": {
          "level": 68,
          "strength": 62,
          "dexterity": 0,
          "intelligence": 91
      },
      "properties": {
          "armour": {
              "max": 185,
              "min": 161
          },
          "energy_shield": {
              "max": 58,
              "min": 51
          }
      },
      "implicits": [],
      "tags": [
          "str_int_armour",
          "helmet",
          "armour",
          "default"
      ],
      "visualIdentity": {
          "ddsFile": "Art/2DItems/Armours/Helmets/HelmetStrInt10.dds",
          "id": "HelmetStrInt10"
      }
  },
  {
      "id": "Metadata/Items/Armours/Helmets/HelmetInt11",
      "name": "Hubris Circlet",
      "itemClass": "Helmet",
      "dropLevel": 69,
      "inventoryWidth": 2,
      "inventoryHeight": 2,
      "requirements": {
          "level": 69,
          "strength": 0,
          "dexterity": 0,
          "intelligence": 154
      },
      "properties": {
          "energy_shield": {
              "max": 92,
              "min": 80
          }
      },
      "implicits": [],
      "tags": [
          "int_armour",
          "helmet",
          "armour",
          "default"
      ],
      "visualIdentity": {
          "ddsFile": "Art/2DItems/Armours/Helmets/HelmetInt11.dds",
          "id": "HelmetInt11"
      }
  },
  {
      "id": "Metadata/Items/Armours/Helmets/HelmetStr11",
      "name": "Eternal Burgonet",
      "itemClass": "Helmet",
      "dropLevel": 69,
      "inventoryWidth": 2,
      "inventoryHeight": 2,
      "requirements": {
          "level": 69,
          "strength": 138,
          "dexterity": 0,
          "intelligence": 0
      },
      "properties": {
          "armour": {
              "max": 429,
              "min": 373
          }
      },
      "implicits": [],
      "tags": [
          "str_armour",
          "helmet",
          "armour",
          "default"
      ],
      "visualIdentity": {
          "ddsFile": "Art/2DItems/Armours/Helmets/HelmetStr11.dds",
          "id": "HelmetStr11"
      }
  },
  {
      "id": "Metadata/Items/Armours/Helmets/HelmetDex10",
      "name": "Lion Pelt",
      "itemClass": "Helmet",
      "dropLevel": 70,
      "inventoryWidth": 2,
      "inventoryHeight": 2,
      "requirements": {
          "level": 70,
          "strength": 0,
          "dexterity": 150,
          "intelligence": 0
      },
      "properties": {
          "evasion": {
              "max": 437,
              "min": 380
          }
      },
      "implicits": [],
      "tags": [
          "dex_armour",
          "helmet",
          "armour",
          "default"
      ],
      "visualIdentity": {
          "ddsFile": "Art/2DItems/Armours/Helmets/HelmetDex10.dds",
          "id": "HelmetDex10"
      }
  },
  {
      "id": "Metadata/Items/Armours/Helmets/HelmetAtlas1",
      "name": "Bone Helmet",
      "itemClass": "Helmet",
      "dropLevel": 73,
      "inventoryWidth": 2,
      "inventoryHeight": 2,
      "requirements": {
          "level": 73,
          "strength": 76,
          "dexterity": 0,
          "intelligence": 76
      },
      "properties": {
          "armour": {
              "max": 227,
              "min": 197
          },
          "energy_shield": {
              "max": 46,
              "min": 40
          }
      },
      "implicits": [
          "MinionDamageImplicitHelmet1"
      ],
      "tags": [
          "not_for_sale",
          "atlas_base_type",
          "helmetatlas1",
          "str_int_armour",
          "helmet",
          "armour",
          "default"
      ],
      "visualIdentity": {
          "ddsFile": "Art/2DItems/Armours/Helmets/BoneHelm.dds",
          "id": "HelmetAtlas1_"
      }
  },
];

// One Hand Axe (22 items)
export const ONE_HAND_AXE_BASES: PoeBaseItem[] = [
  {
      "id": "Metadata/Items/Weapons/OneHandWeapons/OneHandAxes/OneHandAxe1",
      "name": "Rusted Hatchet",
      "itemClass": "One Hand Axe",
      "dropLevel": 2,
      "inventoryWidth": 1,
      "inventoryHeight": 3,
      "requirements": {
          "level": 2,
          "strength": 12,
          "dexterity": 6,
          "intelligence": 0
      },
      "properties": {
          "attack_time": 667,
          "critical_strike_chance": 500,
          "physical_damage_max": 11,
          "physical_damage_min": 6,
          "range": 11
      },
      "implicits": [],
      "tags": [
          "axe",
          "one_hand_weapon",
          "onehand",
          "weapon",
          "default"
      ],
      "visualIdentity": {
          "ddsFile": "Art/2DItems/Weapons/OneHandWeapons/OneHandAxes/OneHandAxe1.dds",
          "id": "OneHandAxe1"
      }
  },
  {
      "id": "Metadata/Items/Weapons/OneHandWeapons/OneHandAxes/OneHandAxe2",
      "name": "Jade Hatchet",
      "itemClass": "One Hand Axe",
      "dropLevel": 6,
      "inventoryWidth": 2,
      "inventoryHeight": 3,
      "requirements": {
          "level": 6,
          "strength": 21,
          "dexterity": 10,
          "intelligence": 0
      },
      "properties": {
          "attack_time": 690,
          "critical_strike_chance": 500,
          "physical_damage_max": 15,
          "physical_damage_min": 10,
          "range": 11
      },
      "implicits": [],
      "tags": [
          "axe",
          "one_hand_weapon",
          "onehand",
          "weapon",
          "default"
      ],
      "visualIdentity": {
          "ddsFile": "Art/2DItems/Weapons/OneHandWeapons/OneHandAxes/OneHandAxe2.dds",
          "id": "OneHandAxe2"
      }
  },
  {
      "id": "Metadata/Items/Weapons/OneHandWeapons/OneHandAxes/OneHandAxe3",
      "name": "Boarding Axe",
      "itemClass": "One Hand Axe",
      "dropLevel": 11,
      "inventoryWidth": 2,
      "inventoryHeight": 3,
      "requirements": {
          "level": 11,
          "strength": 28,
          "dexterity": 19,
          "intelligence": 0
      },
      "properties": {
          "attack_time": 667,
          "critical_strike_chance": 500,
          "physical_damage_max": 21,
          "physical_damage_min": 11,
          "range": 11
      },
      "implicits": [],
      "tags": [
          "axe",
          "one_hand_weapon",
          "onehand",
          "weapon",
          "default"
      ],
      "visualIdentity": {
          "ddsFile": "Art/2DItems/Weapons/OneHandWeapons/OneHandAxes/OneHandAxe3.dds",
          "id": "OneHandAxe3"
      }
  },
  {
      "id": "Metadata/Items/Weapons/OneHandWeapons/OneHandAxes/OneHandAxe4",
      "name": "Cleaver",
      "itemClass": "One Hand Axe",
      "dropLevel": 16,
      "inventoryWidth": 2,
      "inventoryHeight": 3,
      "requirements": {
          "level": 16,
          "strength": 48,
          "dexterity": 14,
          "intelligence": 0
      },
      "properties": {
          "attack_time": 769,
          "critical_strike_chance": 500,
          "physical_damage_max": 35,
          "physical_damage_min": 12,
          "range": 11
      },
      "implicits": [],
      "tags": [
          "axe",
          "one_hand_weapon",
          "onehand",
          "weapon",
          "default"
      ],
      "visualIdentity": {
          "ddsFile": "Art/2DItems/Weapons/OneHandWeapons/OneHandAxes/OneHandAxe4.dds",
          "id": "OneHandAxe4"
      }
  },
  {
      "id": "Metadata/Items/Weapons/OneHandWeapons/OneHandAxes/OneHandAxe5",
      "name": "Broad Axe",
      "itemClass": "One Hand Axe",
      "dropLevel": 21,
      "inventoryWidth": 2,
      "inventoryHeight": 3,
      "requirements": {
          "level": 21,
          "strength": 54,
          "dexterity": 25,
          "intelligence": 0
      },
      "properties": {
          "attack_time": 741,
          "critical_strike_chance": 500,
          "physical_damage_max": 34,
          "physical_damage_min": 19,
          "range": 11
      },
      "implicits": [],
      "tags": [
          "axe",
          "one_hand_weapon",
          "onehand",
          "weapon",
          "default"
      ],
      "visualIdentity": {
          "ddsFile": "Art/2DItems/Weapons/OneHandWeapons/OneHandAxes/OneHandAxe5.dds",
          "id": "OneHandAxe5"
      }
  },
  {
      "id": "Metadata/Items/Weapons/OneHandWeapons/OneHandAxes/OneHandAxe6",
      "name": "Arming Axe",
      "itemClass": "One Hand Axe",
      "dropLevel": 25,
      "inventoryWidth": 2,
      "inventoryHeight": 3,
      "requirements": {
          "level": 25,
          "strength": 58,
          "dexterity": 33,
          "intelligence": 0
      },
      "properties": {
          "attack_time": 714,
          "critical_strike_chance": 500,
          "physical_damage_max": 42,
          "physical_damage_min": 14,
          "range": 11
      },
      "implicits": [],
      "tags": [
          "axe",
          "one_hand_weapon",
          "onehand",
          "weapon",
          "default"
      ],
      "visualIdentity": {
          "ddsFile": "Art/2DItems/Weapons/OneHandWeapons/OneHandAxes/OneHandAxe6.dds",
          "id": "OneHandAxe6"
      }
  },
  {
      "id": "Metadata/Items/Weapons/OneHandWeapons/OneHandAxes/OneHandAxe7",
      "name": "Decorative Axe",
      "itemClass": "One Hand Axe",
      "dropLevel": 29,
      "inventoryWidth": 2,
      "inventoryHeight": 3,
      "requirements": {
          "level": 29,
          "strength": 80,
          "dexterity": 23,
          "intelligence": 0
      },
      "properties": {
          "attack_time": 833,
          "critical_strike_chance": 500,
          "physical_damage_max": 50,
          "physical_damage_min": 27,
          "range": 11
      },
      "implicits": [],
      "tags": [
          "axe",
          "one_hand_weapon",
          "onehand",
          "weapon",
          "default"
      ],
      "visualIdentity": {
          "ddsFile": "Art/2DItems/Weapons/OneHandWeapons/OneHandAxes/OneHandAxe7.dds",
          "id": "OneHandAxe7"
      }
  },
  {
      "id": "Metadata/Items/Weapons/OneHandWeapons/OneHandAxes/OneHandAxe8",
      "name": "Spectral Axe",
      "itemClass": "One Hand Axe",
      "dropLevel": 33,
      "inventoryWidth": 2,
      "inventoryHeight": 3,
      "requirements": {
          "level": 33,
          "strength": 85,
          "dexterity": 37,
          "intelligence": 0
      },
      "properties": {
          "attack_time": 769,
          "critical_strike_chance": 500,
          "physical_damage_max": 48,
          "physical_damage_min": 29,
          "range": 11
      },
      "implicits": [],
      "tags": [
          "axe",
          "one_hand_weapon",
          "onehand",
          "weapon",
          "default"
      ],
      "visualIdentity": {
          "ddsFile": "Art/2DItems/Weapons/OneHandWeapons/OneHandAxes/OneHandAxe8.dds",
          "id": "OneHandAxe8"
      }
  },
  {
      "id": "Metadata/Items/Weapons/OneHandWeapons/OneHandAxes/OneHandAxe9",
      "name": "Jasper Axe",
      "itemClass": "One Hand Axe",
      "dropLevel": 36,
      "inventoryWidth": 2,
      "inventoryHeight": 3,
      "requirements": {
          "level": 36,
          "strength": 86,
          "dexterity": 40,
          "intelligence": 0
      },
      "properties": {
          "attack_time": 769,
          "critical_strike_chance": 500,
          "physical_damage_max": 50,
          "physical_damage_min": 32,
          "range": 11
      },
      "implicits": [],
      "tags": [
          "axe",
          "one_hand_weapon",
          "onehand",
          "weapon",
          "default"
      ],
      "visualIdentity": {
          "ddsFile": "Art/2DItems/Weapons/OneHandWeapons/OneHandAxes/OneHandAxe2.dds",
          "id": "OneHandAxe2"
      }
  },
  {
      "id": "Metadata/Items/Weapons/OneHandWeapons/OneHandAxes/OneHandAxe10",
      "name": "Tomahawk",
      "itemClass": "One Hand Axe",
      "dropLevel": 39,
      "inventoryWidth": 2,
      "inventoryHeight": 3,
      "requirements": {
          "level": 39,
          "strength": 81,
          "dexterity": 56,
          "intelligence": 0
      },
      "properties": {
          "attack_time": 667,
          "critical_strike_chance": 500,
          "physical_damage_max": 46,
          "physical_damage_min": 25,
          "range": 11
      },
      "implicits": [],
      "tags": [
          "axe",
          "one_hand_weapon",
          "onehand",
          "weapon",
          "default"
      ],
      "visualIdentity": {
          "ddsFile": "Art/2DItems/Weapons/OneHandWeapons/OneHandAxes/OneHandAxe3.dds",
          "id": "OneHandAxe3"
      }
  },
  {
      "id": "Metadata/Items/Weapons/OneHandWeapons/OneHandAxes/OneHandAxe11",
      "name": "Wrist Chopper",
      "itemClass": "One Hand Axe",
      "dropLevel": 42,
      "inventoryWidth": 2,
      "inventoryHeight": 3,
      "requirements": {
          "level": 42,
          "strength": 112,
          "dexterity": 32,
          "intelligence": 0
      },
      "properties": {
          "attack_time": 833,
          "critical_strike_chance": 500,
          "physical_damage_max": 79,
          "physical_damage_min": 26,
          "range": 11
      },
      "implicits": [],
      "tags": [
          "axe",
          "one_hand_weapon",
          "onehand",
          "weapon",
          "default"
      ],
      "visualIdentity": {
          "ddsFile": "Art/2DItems/Weapons/OneHandWeapons/OneHandAxes/OneHandAxe4.dds",
          "id": "OneHandAxe4"
      }
  },
  {
      "id": "Metadata/Items/Weapons/OneHandWeapons/OneHandAxes/OneHandAxe12",
      "name": "War Axe",
      "itemClass": "One Hand Axe",
      "dropLevel": 45,
      "inventoryWidth": 2,
      "inventoryHeight": 3,
      "requirements": {
          "level": 45,
          "strength": 106,
          "dexterity": 49,
          "intelligence": 0
      },
      "properties": {
          "attack_time": 769,
          "critical_strike_chance": 500,
          "physical_damage_max": 65,
          "physical_damage_min": 35,
          "range": 11
      },
      "implicits": [],
      "tags": [
          "axe",
          "one_hand_weapon",
          "onehand",
          "weapon",
          "default"
      ],
      "visualIdentity": {
          "ddsFile": "Art/2DItems/Weapons/OneHandWeapons/OneHandAxes/OneHandAxe5.dds",
          "id": "OneHandAxe5"
      }
  },
  {
      "id": "Metadata/Items/Weapons/OneHandWeapons/OneHandAxes/OneHandAxe13",
      "name": "Chest Splitter",
      "itemClass": "One Hand Axe",
      "dropLevel": 48,
      "inventoryWidth": 2,
      "inventoryHeight": 3,
      "requirements": {
          "level": 48,
          "strength": 105,
          "dexterity": 60,
          "intelligence": 0
      },
      "properties": {
          "attack_time": 714,
          "critical_strike_chance": 500,
          "physical_damage_max": 71,
          "physical_damage_min": 24,
          "range": 11
      },
      "implicits": [],
      "tags": [
          "axe",
          "one_hand_weapon",
          "onehand",
          "weapon",
          "default"
      ],
      "visualIdentity": {
          "ddsFile": "Art/2DItems/Weapons/OneHandWeapons/OneHandAxes/OneHandAxe6.dds",
          "id": "OneHandAxe6"
      }
  },
  {
      "id": "Metadata/Items/Weapons/OneHandWeapons/OneHandAxes/OneHandAxe14",
      "name": "Ceremonial Axe",
      "itemClass": "One Hand Axe",
      "dropLevel": 51,
      "inventoryWidth": 2,
      "inventoryHeight": 3,
      "requirements": {
          "level": 51,
          "strength": 134,
          "dexterity": 39,
          "intelligence": 0
      },
      "properties": {
          "attack_time": 833,
          "critical_strike_chance": 500,
          "physical_damage_max": 83,
          "physical_damage_min": 45,
          "range": 11
      },
      "implicits": [],
      "tags": [
          "axe",
          "one_hand_weapon",
          "onehand",
          "weapon",
          "default"
      ],
      "visualIdentity": {
          "ddsFile": "Art/2DItems/Weapons/OneHandWeapons/OneHandAxes/OneHandAxe7.dds",
          "id": "OneHandAxe7"
      }
  },
  {
      "id": "Metadata/Items/Weapons/OneHandWeapons/OneHandAxes/OneHandAxe15",
      "name": "Wraith Axe",
      "itemClass": "One Hand Axe",
      "dropLevel": 54,
      "inventoryWidth": 2,
      "inventoryHeight": 3,
      "requirements": {
          "level": 54,
          "strength": 134,
          "dexterity": 59,
          "intelligence": 0
      },
      "properties": {
          "attack_time": 769,
          "critical_strike_chance": 500,
          "physical_damage_max": 75,
          "physical_damage_min": 45,
          "range": 11
      },
      "implicits": [],
      "tags": [
          "axe",
          "one_hand_weapon",
          "onehand",
          "weapon",
          "default"
      ],
      "visualIdentity": {
          "ddsFile": "Art/2DItems/Weapons/OneHandWeapons/OneHandAxes/OneHandAxe8.dds",
          "id": "OneHandAxe8"
      }
  },
  {
      "id": "Metadata/Items/Weapons/OneHandWeapons/OneHandAxes/OneHandAxe16",
      "name": "Karui Axe",
      "itemClass": "One Hand Axe",
      "dropLevel": 57,
      "inventoryWidth": 2,
      "inventoryHeight": 3,
      "requirements": {
          "level": 57,
          "strength": 132,
          "dexterity": 62,
          "intelligence": 0
      },
      "properties": {
          "attack_time": 769,
          "critical_strike_chance": 500,
          "physical_damage_max": 77,
          "physical_damage_min": 49,
          "range": 11
      },
      "implicits": [],
      "tags": [
          "axe",
          "one_hand_weapon",
          "onehand",
          "weapon",
          "default"
      ],
      "visualIdentity": {
          "ddsFile": "Art/2DItems/Weapons/OneHandWeapons/OneHandAxes/OneHandAxe2.dds",
          "id": "OneHandAxe2"
      }
  },
  {
      "id": "Metadata/Items/Weapons/OneHandWeapons/OneHandAxes/OneHandAxe17",
      "name": "Siege Axe",
      "itemClass": "One Hand Axe",
      "dropLevel": 59,
      "inventoryWidth": 2,
      "inventoryHeight": 3,
      "requirements": {
          "level": 59,
          "strength": 119,
          "dexterity": 82,
          "intelligence": 0
      },
      "properties": {
          "attack_time": 667,
          "critical_strike_chance": 500,
          "physical_damage_max": 70,
          "physical_damage_min": 38,
          "range": 11
      },
      "implicits": [],
      "tags": [
          "axe",
          "one_hand_weapon",
          "onehand",
          "weapon",
          "default"
      ],
      "visualIdentity": {
          "ddsFile": "Art/2DItems/Weapons/OneHandWeapons/OneHandAxes/OneHandAxe3.dds",
          "id": "OneHandAxe3"
      }
  },
  {
      "id": "Metadata/Items/Weapons/OneHandWeapons/OneHandAxes/OneHandAxe18",
      "name": "Reaver Axe",
      "itemClass": "One Hand Axe",
      "dropLevel": 61,
      "inventoryWidth": 2,
      "inventoryHeight": 3,
      "requirements": {
          "level": 61,
          "strength": 167,
          "dexterity": 57,
          "intelligence": 0
      },
      "properties": {
          "attack_time": 833,
          "critical_strike_chance": 500,
          "physical_damage_max": 114,
          "physical_damage_min": 38,
          "range": 11
      },
      "implicits": [],
      "tags": [
          "axe",
          "one_hand_weapon",
          "onehand",
          "weapon",
          "default"
      ],
      "visualIdentity": {
          "ddsFile": "Art/2DItems/Weapons/OneHandWeapons/OneHandAxes/OneHandAxe4.dds",
          "id": "OneHandAxe4"
      }
  },
  {
      "id": "Metadata/Items/Weapons/OneHandWeapons/OneHandAxes/OneHandAxe19",
      "name": "Butcher Axe",
      "itemClass": "One Hand Axe",
      "dropLevel": 63,
      "inventoryWidth": 2,
      "inventoryHeight": 3,
      "requirements": {
          "level": 63,
          "strength": 149,
          "dexterity": 76,
          "intelligence": 0
      },
      "properties": {
          "attack_time": 769,
          "critical_strike_chance": 500,
          "physical_damage_max": 87,
          "physical_damage_min": 47,
          "range": 11
      },
      "implicits": [],
      "tags": [
          "axe",
          "one_hand_weapon",
          "onehand",
          "weapon",
          "default"
      ],
      "visualIdentity": {
          "ddsFile": "Art/2DItems/Weapons/OneHandWeapons/OneHandAxes/OneHandAxe5.dds",
          "id": "OneHandAxe5"
      }
  },
  {
      "id": "Metadata/Items/Weapons/OneHandWeapons/OneHandAxes/OneHandAxe20",
      "name": "Vaal Hatchet",
      "itemClass": "One Hand Axe",
      "dropLevel": 65,
      "inventoryWidth": 2,
      "inventoryHeight": 3,
      "requirements": {
          "level": 65,
          "strength": 140,
          "dexterity": 86,
          "intelligence": 0
      },
      "properties": {
          "attack_time": 714,
          "critical_strike_chance": 500,
          "physical_damage_max": 90,
          "physical_damage_min": 30,
          "range": 11
      },
      "implicits": [],
      "tags": [
          "axe",
          "one_hand_weapon",
          "onehand",
          "weapon",
          "default"
      ],
      "visualIdentity": {
          "ddsFile": "Art/2DItems/Weapons/OneHandWeapons/OneHandAxes/OneHandAxe6.dds",
          "id": "OneHandAxe6"
      }
  },
  {
      "id": "Metadata/Items/Weapons/OneHandWeapons/OneHandAxes/OneHandAxe21",
      "name": "Royal Axe",
      "itemClass": "One Hand Axe",
      "dropLevel": 67,
      "inventoryWidth": 2,
      "inventoryHeight": 3,
      "requirements": {
          "level": 67,
          "strength": 167,
          "dexterity": 57,
          "intelligence": 0
      },
      "properties": {
          "attack_time": 833,
          "critical_strike_chance": 500,
          "physical_damage_max": 100,
          "physical_damage_min": 54,
          "range": 11
      },
      "implicits": [],
      "tags": [
          "axe",
          "one_hand_weapon",
          "onehand",
          "weapon",
          "default"
      ],
      "visualIdentity": {
          "ddsFile": "Art/2DItems/Weapons/OneHandWeapons/OneHandAxes/OneHandAxe7.dds",
          "id": "OneHandAxe7"
      }
  },
  {
      "id": "Metadata/Items/Weapons/OneHandWeapons/OneHandAxes/OneHandAxe22",
      "name": "Infernal Axe",
      "itemClass": "One Hand Axe",
      "dropLevel": 69,
      "inventoryWidth": 2,
      "inventoryHeight": 3,
      "requirements": {
          "level": 69,
          "strength": 158,
          "dexterity": 76,
          "intelligence": 0
      },
      "properties": {
          "attack_time": 769,
          "critical_strike_chance": 500,
          "physical_damage_max": 85,
          "physical_damage_min": 51,
          "range": 11
      },
      "implicits": [],
      "tags": [
          "axe",
          "one_hand_weapon",
          "onehand",
          "weapon",
          "default"
      ],
      "visualIdentity": {
          "ddsFile": "Art/2DItems/Weapons/OneHandWeapons/OneHandAxes/OneHandAxe8.dds",
          "id": "OneHandAxe8"
      }
  },
];

// One Hand Mace (22 items)
export const ONE_HAND_MACE_BASES: PoeBaseItem[] = [
  {
      "id": "Metadata/Items/Weapons/OneHandWeapons/OneHandMaces/OneHandMace1",
      "name": "Driftwood Club",
      "itemClass": "One Hand Mace",
      "dropLevel": 1,
      "inventoryWidth": 1,
      "inventoryHeight": 3,
      "requirements": {
          "level": 1,
          "strength": 14,
          "dexterity": 0,
          "intelligence": 0
      },
      "properties": {
          "attack_time": 690,
          "critical_strike_chance": 500,
          "physical_damage_max": 8,
          "physical_damage_min": 6,
          "range": 11
      },
      "implicits": [
          "StunThresholdReductionImplicitMace1"
      ],
      "tags": [
          "mace",
          "one_hand_weapon",
          "onehand",
          "weapon",
          "default"
      ],
      "visualIdentity": {
          "ddsFile": "Art/2DItems/Weapons/OneHandWeapons/OneHandMaces/OneHandMace1.dds",
          "id": "OneHandMace1"
      }
  },
  {
      "id": "Metadata/Items/Weapons/OneHandWeapons/OneHandMaces/OneHandMace2",
      "name": "Tribal Club",
      "itemClass": "One Hand Mace",
      "dropLevel": 5,
      "inventoryWidth": 1,
      "inventoryHeight": 3,
      "requirements": {
          "level": 5,
          "strength": 26,
          "dexterity": 0,
          "intelligence": 0
      },
      "properties": {
          "attack_time": 714,
          "critical_strike_chance": 500,
          "physical_damage_max": 13,
          "physical_damage_min": 8,
          "range": 11
      },
      "implicits": [
          "StunThresholdReductionImplicitMace1"
      ],
      "tags": [
          "mace",
          "one_hand_weapon",
          "onehand",
          "weapon",
          "default"
      ],
      "visualIdentity": {
          "ddsFile": "Art/2DItems/Weapons/OneHandWeapons/OneHandMaces/OneHandMace2.dds",
          "id": "OneHandMace2"
      }
  },
  {
      "id": "Metadata/Items/Weapons/OneHandWeapons/OneHandMaces/OneHandMace3",
      "name": "Spiked Club",
      "itemClass": "One Hand Mace",
      "dropLevel": 10,
      "inventoryWidth": 1,
      "inventoryHeight": 3,
      "requirements": {
          "level": 10,
          "strength": 41,
          "dexterity": 0,
          "intelligence": 0
      },
      "properties": {
          "attack_time": 690,
          "critical_strike_chance": 500,
          "physical_damage_max": 16,
          "physical_damage_min": 13,
          "range": 11
      },
      "implicits": [
          "StunThresholdReductionImplicitMace1"
      ],
      "tags": [
          "mace",
          "one_hand_weapon",
          "onehand",
          "weapon",
          "default"
      ],
      "visualIdentity": {
          "ddsFile": "Art/2DItems/Weapons/OneHandWeapons/OneHandMaces/OneHandMace3.dds",
          "id": "OneHandMace3"
      }
  },
  {
      "id": "Metadata/Items/Weapons/OneHandWeapons/OneHandMaces/OneHandMace4",
      "name": "Stone Hammer",
      "itemClass": "One Hand Mace",
      "dropLevel": 15,
      "inventoryWidth": 2,
      "inventoryHeight": 3,
      "requirements": {
          "level": 15,
          "strength": 56,
          "dexterity": 0,
          "intelligence": 0
      },
      "properties": {
          "attack_time": 769,
          "critical_strike_chance": 500,
          "physical_damage_max": 27,
          "physical_damage_min": 15,
          "range": 11
      },
      "implicits": [
          "StunThresholdReductionImplicitMace2"
      ],
      "tags": [
          "mace",
          "one_hand_weapon",
          "onehand",
          "weapon",
          "default"
      ],
      "visualIdentity": {
          "ddsFile": "Art/2DItems/Weapons/OneHandWeapons/OneHandMaces/OneHandMace4.dds",
          "id": "OneHandMace4"
      }
  },
  {
      "id": "Metadata/Items/Weapons/OneHandWeapons/OneHandMaces/OneHandMace5",
      "name": "War Hammer",
      "itemClass": "One Hand Mace",
      "dropLevel": 20,
      "inventoryWidth": 2,
      "inventoryHeight": 3,
      "requirements": {
          "level": 20,
          "strength": 71,
          "dexterity": 0,
          "intelligence": 0
      },
      "properties": {
          "attack_time": 690,
          "critical_strike_chance": 500,
          "physical_damage_max": 31,
          "physical_damage_min": 13,
          "range": 11
      },
      "implicits": [
          "StunThresholdReductionImplicitMace1"
      ],
      "tags": [
          "mace",
          "one_hand_weapon",
          "onehand",
          "weapon",
          "default"
      ],
      "visualIdentity": {
          "ddsFile": "Art/2DItems/Weapons/OneHandWeapons/OneHandMaces/OneHandMace5.dds",
          "id": "OneHandMace5"
      }
  },
  {
      "id": "Metadata/Items/Weapons/OneHandWeapons/OneHandMaces/OneHandMace6",
      "name": "Bladed Mace",
      "itemClass": "One Hand Mace",
      "dropLevel": 24,
      "inventoryWidth": 2,
      "inventoryHeight": 3,
      "requirements": {
          "level": 24,
          "strength": 83,
          "dexterity": 0,
          "intelligence": 0
      },
      "properties": {
          "attack_time": 714,
          "critical_strike_chance": 500,
          "physical_damage_max": 32,
          "physical_damage_min": 19,
          "range": 11
      },
      "implicits": [
          "StunThresholdReductionImplicitMace1"
      ],
      "tags": [
          "mace",
          "one_hand_weapon",
          "onehand",
          "weapon",
          "default"
      ],
      "visualIdentity": {
          "ddsFile": "Art/2DItems/Weapons/OneHandWeapons/OneHandMaces/OneHandMace6.dds",
          "id": "OneHandMace6"
      }
  },
  {
      "id": "Metadata/Items/Weapons/OneHandWeapons/OneHandMaces/OneHandMace7",
      "name": "Ceremonial Mace",
      "itemClass": "One Hand Mace",
      "dropLevel": 28,
      "inventoryWidth": 2,
      "inventoryHeight": 3,
      "requirements": {
          "level": 28,
          "strength": 95,
          "dexterity": 0,
          "intelligence": 0
      },
      "properties": {
          "attack_time": 833,
          "critical_strike_chance": 500,
          "physical_damage_max": 40,
          "physical_damage_min": 32,
          "range": 11
      },
      "implicits": [
          "StunThresholdReductionImplicitMace2"
      ],
      "tags": [
          "mace",
          "one_hand_weapon",
          "onehand",
          "weapon",
          "default"
      ],
      "visualIdentity": {
          "ddsFile": "Art/2DItems/Weapons/OneHandWeapons/OneHandMaces/OneHandMace7.dds",
          "id": "OneHandMace7"
      }
  },
  {
      "id": "Metadata/Items/Weapons/OneHandWeapons/OneHandMaces/OneHandMace8",
      "name": "Dream Mace",
      "itemClass": "One Hand Mace",
      "dropLevel": 32,
      "inventoryWidth": 2,
      "inventoryHeight": 3,
      "requirements": {
          "level": 32,
          "strength": 107,
          "dexterity": 0,
          "intelligence": 0
      },
      "properties": {
          "attack_time": 714,
          "critical_strike_chance": 500,
          "physical_damage_max": 43,
          "physical_damage_min": 21,
          "range": 11
      },
      "implicits": [
          "StunThresholdReductionImplicitMace1"
      ],
      "tags": [
          "mace",
          "one_hand_weapon",
          "onehand",
          "weapon",
          "default"
      ],
      "visualIdentity": {
          "ddsFile": "Art/2DItems/Weapons/OneHandWeapons/OneHandMaces/OneHandMace8.dds",
          "id": "OneHandMace8"
      }
  },
  {
      "id": "Metadata/Items/Weapons/OneHandWeapons/OneHandMaces/OneHandMace9",
      "name": "Petrified Club",
      "itemClass": "One Hand Mace",
      "dropLevel": 35,
      "inventoryWidth": 1,
      "inventoryHeight": 3,
      "requirements": {
          "level": 35,
          "strength": 116,
          "dexterity": 0,
          "intelligence": 0
      },
      "properties": {
          "attack_time": 800,
          "critical_strike_chance": 500,
          "physical_damage_max": 51,
          "physical_damage_min": 31,
          "range": 11
      },
      "implicits": [
          "StunThresholdReductionImplicitMace1"
      ],
      "tags": [
          "mace",
          "one_hand_weapon",
          "onehand",
          "weapon",
          "default"
      ],
      "visualIdentity": {
          "ddsFile": "Art/2DItems/Weapons/OneHandWeapons/OneHandMaces/OneHandMace2.dds",
          "id": "OneHandMace2"
      }
  },
  {
      "id": "Metadata/Items/Weapons/OneHandWeapons/OneHandMaces/OneHandMace10",
      "name": "Barbed Club",
      "itemClass": "One Hand Mace",
      "dropLevel": 38,
      "inventoryWidth": 1,
      "inventoryHeight": 3,
      "requirements": {
          "level": 38,
          "strength": 125,
          "dexterity": 0,
          "intelligence": 0
      },
      "properties": {
          "attack_time": 714,
          "critical_strike_chance": 500,
          "physical_damage_max": 42,
          "physical_damage_min": 33,
          "range": 11
      },
      "implicits": [
          "StunThresholdReductionImplicitMace1"
      ],
      "tags": [
          "mace",
          "one_hand_weapon",
          "onehand",
          "weapon",
          "default"
      ],
      "visualIdentity": {
          "ddsFile": "Art/2DItems/Weapons/OneHandWeapons/OneHandMaces/OneHandMace3.dds",
          "id": "OneHandMace3"
      }
  },
  {
      "id": "Metadata/Items/Weapons/OneHandWeapons/OneHandMaces/OneHandMace11",
      "name": "Rock Breaker",
      "itemClass": "One Hand Mace",
      "dropLevel": 41,
      "inventoryWidth": 2,
      "inventoryHeight": 3,
      "requirements": {
          "level": 41,
          "strength": 134,
          "dexterity": 0,
          "intelligence": 0
      },
      "properties": {
          "attack_time": 870,
          "critical_strike_chance": 500,
          "physical_damage_max": 69,
          "physical_damage_min": 37,
          "range": 11
      },
      "implicits": [
          "StunThresholdReductionImplicitMace2"
      ],
      "tags": [
          "mace",
          "one_hand_weapon",
          "onehand",
          "weapon",
          "default"
      ],
      "visualIdentity": {
          "ddsFile": "Art/2DItems/Weapons/OneHandWeapons/OneHandMaces/OneHandMace4.dds",
          "id": "OneHandMace4"
      }
  },
  {
      "id": "Metadata/Items/Weapons/OneHandWeapons/OneHandMaces/OneHandMace12",
      "name": "Battle Hammer",
      "itemClass": "One Hand Mace",
      "dropLevel": 44,
      "inventoryWidth": 2,
      "inventoryHeight": 3,
      "requirements": {
          "level": 44,
          "strength": 143,
          "dexterity": 0,
          "intelligence": 0
      },
      "properties": {
          "attack_time": 714,
          "critical_strike_chance": 500,
          "physical_damage_max": 59,
          "physical_damage_min": 25,
          "range": 11
      },
      "implicits": [
          "StunThresholdReductionImplicitMace1"
      ],
      "tags": [
          "mace",
          "one_hand_weapon",
          "onehand",
          "weapon",
          "default"
      ],
      "visualIdentity": {
          "ddsFile": "Art/2DItems/Weapons/OneHandWeapons/OneHandMaces/OneHandMace5.dds",
          "id": "OneHandMace5"
      }
  },
  {
      "id": "Metadata/Items/Weapons/OneHandWeapons/OneHandMaces/OneHandMace13",
      "name": "Flanged Mace",
      "itemClass": "One Hand Mace",
      "dropLevel": 47,
      "inventoryWidth": 2,
      "inventoryHeight": 3,
      "requirements": {
          "level": 47,
          "strength": 152,
          "dexterity": 0,
          "intelligence": 0
      },
      "properties": {
          "attack_time": 769,
          "critical_strike_chance": 500,
          "physical_damage_max": 63,
          "physical_damage_min": 38,
          "range": 11
      },
      "implicits": [
          "StunThresholdReductionImplicitMace1"
      ],
      "tags": [
          "mace",
          "one_hand_weapon",
          "onehand",
          "weapon",
          "default"
      ],
      "visualIdentity": {
          "ddsFile": "Art/2DItems/Weapons/OneHandWeapons/OneHandMaces/OneHandMace6.dds",
          "id": "OneHandMace6"
      }
  },
  {
      "id": "Metadata/Items/Weapons/OneHandWeapons/OneHandMaces/OneHandMace14",
      "name": "Ornate Mace",
      "itemClass": "One Hand Mace",
      "dropLevel": 50,
      "inventoryWidth": 2,
      "inventoryHeight": 3,
      "requirements": {
          "level": 50,
          "strength": 161,
          "dexterity": 0,
          "intelligence": 0
      },
      "properties": {
          "attack_time": 833,
          "critical_strike_chance": 500,
          "physical_damage_max": 67,
          "physical_damage_min": 53,
          "range": 11
      },
      "implicits": [
          "StunThresholdReductionImplicitMace2"
      ],
      "tags": [
          "mace",
          "one_hand_weapon",
          "onehand",
          "weapon",
          "default"
      ],
      "visualIdentity": {
          "ddsFile": "Art/2DItems/Weapons/OneHandWeapons/OneHandMaces/OneHandMace7.dds",
          "id": "OneHandMace7"
      }
  },
  {
      "id": "Metadata/Items/Weapons/OneHandWeapons/OneHandMaces/OneHandMace15",
      "name": "Phantom Mace",
      "itemClass": "One Hand Mace",
      "dropLevel": 53,
      "inventoryWidth": 2,
      "inventoryHeight": 3,
      "requirements": {
          "level": 53,
          "strength": 170,
          "dexterity": 0,
          "intelligence": 0
      },
      "properties": {
          "attack_time": 714,
          "critical_strike_chance": 500,
          "physical_damage_max": 69,
          "physical_damage_min": 33,
          "range": 11
      },
      "implicits": [
          "StunThresholdReductionImplicitMace1"
      ],
      "tags": [
          "mace",
          "one_hand_weapon",
          "onehand",
          "weapon",
          "default"
      ],
      "visualIdentity": {
          "ddsFile": "Art/2DItems/Weapons/OneHandWeapons/OneHandMaces/OneHandMace8.dds",
          "id": "OneHandMace8"
      }
  },
  {
      "id": "Metadata/Items/Weapons/OneHandWeapons/OneHandMaces/OneHandMace16",
      "name": "Ancestral Club",
      "itemClass": "One Hand Mace",
      "dropLevel": 56,
      "inventoryWidth": 1,
      "inventoryHeight": 3,
      "requirements": {
          "level": 56,
          "strength": 179,
          "dexterity": 0,
          "intelligence": 0
      },
      "properties": {
          "attack_time": 800,
          "critical_strike_chance": 500,
          "physical_damage_max": 80,
          "physical_damage_min": 48,
          "range": 11
      },
      "implicits": [
          "StunThresholdReductionImplicitMace1"
      ],
      "tags": [
          "mace",
          "one_hand_weapon",
          "onehand",
          "weapon",
          "default"
      ],
      "visualIdentity": {
          "ddsFile": "Art/2DItems/Weapons/OneHandWeapons/OneHandMaces/OneHandMace2.dds",
          "id": "OneHandMace2"
      }
  },
  {
      "id": "Metadata/Items/Weapons/OneHandWeapons/OneHandMaces/OneHandMace17",
      "name": "Tenderizer",
      "itemClass": "One Hand Mace",
      "dropLevel": 58,
      "inventoryWidth": 1,
      "inventoryHeight": 3,
      "requirements": {
          "level": 58,
          "strength": 185,
          "dexterity": 0,
          "intelligence": 0
      },
      "properties": {
          "attack_time": 714,
          "critical_strike_chance": 500,
          "physical_damage_max": 62,
          "physical_damage_min": 49,
          "range": 11
      },
      "implicits": [
          "StunThresholdReductionImplicitMace1"
      ],
      "tags": [
          "mace",
          "one_hand_weapon",
          "onehand",
          "weapon",
          "default"
      ],
      "visualIdentity": {
          "ddsFile": "Art/2DItems/Weapons/OneHandWeapons/OneHandMaces/OneHandMace3.dds",
          "id": "OneHandMace3"
      }
  },
  {
      "id": "Metadata/Items/Weapons/OneHandWeapons/OneHandMaces/OneHandMace18",
      "name": "Gavel",
      "itemClass": "One Hand Mace",
      "dropLevel": 60,
      "inventoryWidth": 2,
      "inventoryHeight": 3,
      "requirements": {
          "level": 60,
          "strength": 212,
          "dexterity": 0,
          "intelligence": 0
      },
      "properties": {
          "attack_time": 870,
          "critical_strike_chance": 500,
          "physical_damage_max": 101,
          "physical_damage_min": 54,
          "range": 11
      },
      "implicits": [
          "StunThresholdReductionImplicitMace2"
      ],
      "tags": [
          "mace",
          "one_hand_weapon",
          "onehand",
          "weapon",
          "default"
      ],
      "visualIdentity": {
          "ddsFile": "Art/2DItems/Weapons/OneHandWeapons/OneHandMaces/OneHandMace4.dds",
          "id": "OneHandMace4"
      }
  },
  {
      "id": "Metadata/Items/Weapons/OneHandWeapons/OneHandMaces/OneHandMace19",
      "name": "Legion Hammer",
      "itemClass": "One Hand Mace",
      "dropLevel": 62,
      "inventoryWidth": 2,
      "inventoryHeight": 3,
      "requirements": {
          "level": 62,
          "strength": 212,
          "dexterity": 0,
          "intelligence": 0
      },
      "properties": {
          "attack_time": 714,
          "critical_strike_chance": 500,
          "physical_damage_max": 81,
          "physical_damage_min": 35,
          "range": 11
      },
      "implicits": [
          "StunThresholdReductionImplicitMace1"
      ],
      "tags": [
          "mace",
          "one_hand_weapon",
          "onehand",
          "weapon",
          "default"
      ],
      "visualIdentity": {
          "ddsFile": "Art/2DItems/Weapons/OneHandWeapons/OneHandMaces/OneHandMace5.dds",
          "id": "OneHandMace5"
      }
  },
  {
      "id": "Metadata/Items/Weapons/OneHandWeapons/OneHandMaces/OneHandMace20",
      "name": "Pernach",
      "itemClass": "One Hand Mace",
      "dropLevel": 64,
      "inventoryWidth": 2,
      "inventoryHeight": 3,
      "requirements": {
          "level": 64,
          "strength": 212,
          "dexterity": 0,
          "intelligence": 0
      },
      "properties": {
          "attack_time": 769,
          "critical_strike_chance": 500,
          "physical_damage_max": 82,
          "physical_damage_min": 49,
          "range": 11
      },
      "implicits": [
          "StunThresholdReductionImplicitMace1"
      ],
      "tags": [
          "mace",
          "one_hand_weapon",
          "onehand",
          "weapon",
          "default"
      ],
      "visualIdentity": {
          "ddsFile": "Art/2DItems/Weapons/OneHandWeapons/OneHandMaces/OneHandMace6.dds",
          "id": "OneHandMace6"
      }
  },
  {
      "id": "Metadata/Items/Weapons/OneHandWeapons/OneHandMaces/OneHandMace21",
      "name": "Auric Mace",
      "itemClass": "One Hand Mace",
      "dropLevel": 66,
      "inventoryWidth": 2,
      "inventoryHeight": 3,
      "requirements": {
          "level": 66,
          "strength": 212,
          "dexterity": 0,
          "intelligence": 0
      },
      "properties": {
          "attack_time": 833,
          "critical_strike_chance": 500,
          "physical_damage_max": 82,
          "physical_damage_min": 65,
          "range": 11
      },
      "implicits": [
          "StunThresholdReductionImplicitMace2"
      ],
      "tags": [
          "mace",
          "one_hand_weapon",
          "onehand",
          "weapon",
          "default"
      ],
      "visualIdentity": {
          "ddsFile": "Art/2DItems/Weapons/OneHandWeapons/OneHandMaces/OneHandMace7.dds",
          "id": "OneHandMace7"
      }
  },
  {
      "id": "Metadata/Items/Weapons/OneHandWeapons/OneHandMaces/OneHandMace22",
      "name": "Nightmare Mace",
      "itemClass": "One Hand Mace",
      "dropLevel": 68,
      "inventoryWidth": 2,
      "inventoryHeight": 3,
      "requirements": {
          "level": 68,
          "strength": 212,
          "dexterity": 0,
          "intelligence": 0
      },
      "properties": {
          "attack_time": 714,
          "critical_strike_chance": 500,
          "physical_damage_max": 80,
          "physical_damage_min": 38,
          "range": 11
      },
      "implicits": [
          "StunThresholdReductionImplicitMace1"
      ],
      "tags": [
          "mace",
          "one_hand_weapon",
          "onehand",
          "weapon",
          "default"
      ],
      "visualIdentity": {
          "ddsFile": "Art/2DItems/Weapons/OneHandWeapons/OneHandMaces/OneHandMace8.dds",
          "id": "OneHandMace8"
      }
  },
];

// One Hand Sword (22 items)
export const ONE_HAND_SWORD_BASES: PoeBaseItem[] = [
  {
      "id": "Metadata/Items/Weapons/OneHandWeapons/OneHandSwords/OneHandSword1",
      "name": "Rusted Sword",
      "itemClass": "One Hand Sword",
      "dropLevel": 1,
      "inventoryWidth": 1,
      "inventoryHeight": 3,
      "requirements": {
          "level": 1,
          "strength": 8,
          "dexterity": 8,
          "intelligence": 0
      },
      "properties": {
          "attack_time": 645,
          "critical_strike_chance": 500,
          "physical_damage_max": 9,
          "physical_damage_min": 4,
          "range": 11
      },
      "implicits": [
          "AccuracyPercentImplicitSword1"
      ],
      "tags": [
          "sword",
          "one_hand_weapon",
          "onehand",
          "weapon",
          "default"
      ],
      "visualIdentity": {
          "ddsFile": "Art/2DItems/Weapons/OneHandWeapons/OneHandSwords/OneHandSword1.dds",
          "id": "OneHandSword1"
      }
  },
  {
      "id": "Metadata/Items/Weapons/OneHandWeapons/OneHandSwords/OneHandSword2",
      "name": "Copper Sword",
      "itemClass": "One Hand Sword",
      "dropLevel": 5,
      "inventoryWidth": 1,
      "inventoryHeight": 3,
      "requirements": {
          "level": 5,
          "strength": 14,
          "dexterity": 14,
          "intelligence": 0
      },
      "properties": {
          "attack_time": 667,
          "critical_strike_chance": 500,
          "physical_damage_max": 14,
          "physical_damage_min": 6,
          "range": 11
      },
      "implicits": [
          "IncreasedAccuracySwordImplicit1"
      ],
      "tags": [
          "sword",
          "one_hand_weapon",
          "onehand",
          "weapon",
          "default"
      ],
      "visualIdentity": {
          "ddsFile": "Art/2DItems/Weapons/OneHandWeapons/OneHandSwords/OneHandSword2.dds",
          "id": "OneHandSword2"
      }
  },
  {
      "id": "Metadata/Items/Weapons/OneHandWeapons/OneHandSwords/OneHandSword3",
      "name": "Sabre",
      "itemClass": "One Hand Sword",
      "dropLevel": 10,
      "inventoryWidth": 1,
      "inventoryHeight": 3,
      "requirements": {
          "level": 10,
          "strength": 18,
          "dexterity": 26,
          "intelligence": 0
      },
      "properties": {
          "attack_time": 645,
          "critical_strike_chance": 500,
          "physical_damage_max": 22,
          "physical_damage_min": 5,
          "range": 11
      },
      "implicits": [
          "AccuracyPercentImplicitSword1"
      ],
      "tags": [
          "sword",
          "one_hand_weapon",
          "onehand",
          "weapon",
          "default"
      ],
      "visualIdentity": {
          "ddsFile": "Art/2DItems/Weapons/OneHandWeapons/OneHandSwords/OneHandSword3.dds",
          "id": "OneHandSword3"
      }
  },
  {
      "id": "Metadata/Items/Weapons/OneHandWeapons/OneHandSwords/OneHandSword4",
      "name": "Broad Sword",
      "itemClass": "One Hand Sword",
      "dropLevel": 15,
      "inventoryWidth": 2,
      "inventoryHeight": 3,
      "requirements": {
          "level": 15,
          "strength": 30,
          "dexterity": 30,
          "intelligence": 0
      },
      "properties": {
          "attack_time": 690,
          "critical_strike_chance": 500,
          "physical_damage_max": 21,
          "physical_damage_min": 15,
          "range": 11
      },
      "implicits": [
          "AccuracyPercentImplicitSword1"
      ],
      "tags": [
          "sword",
          "one_hand_weapon",
          "onehand",
          "weapon",
          "default"
      ],
      "visualIdentity": {
          "ddsFile": "Art/2DItems/Weapons/OneHandWeapons/OneHandSwords/OneHandSword4.dds",
          "id": "OneHandSword4"
      }
  },
  {
      "id": "Metadata/Items/Weapons/OneHandWeapons/OneHandSwords/OneHandSword5",
      "name": "War Sword",
      "itemClass": "One Hand Sword",
      "dropLevel": 20,
      "inventoryWidth": 2,
      "inventoryHeight": 3,
      "requirements": {
          "level": 20,
          "strength": 41,
          "dexterity": 35,
          "intelligence": 0
      },
      "properties": {
          "attack_time": 714,
          "critical_strike_chance": 500,
          "physical_damage_max": 30,
          "physical_damage_min": 16,
          "range": 11
      },
      "implicits": [
          "AccuracyPercentImplicitSword1"
      ],
      "tags": [
          "sword",
          "one_hand_weapon",
          "onehand",
          "weapon",
          "default"
      ],
      "visualIdentity": {
          "ddsFile": "Art/2DItems/Weapons/OneHandWeapons/OneHandSwords/OneHandSword5.dds",
          "id": "OneHandSword5"
      }
  },
  {
      "id": "Metadata/Items/Weapons/OneHandWeapons/OneHandSwords/OneHandSword6",
      "name": "Ancient Sword",
      "itemClass": "One Hand Sword",
      "dropLevel": 24,
      "inventoryWidth": 2,
      "inventoryHeight": 3,
      "requirements": {
          "level": 24,
          "strength": 44,
          "dexterity": 44,
          "intelligence": 0
      },
      "properties": {
          "attack_time": 690,
          "critical_strike_chance": 500,
          "physical_damage_max": 33,
          "physical_damage_min": 18,
          "range": 11
      },
      "implicits": [
          "IncreasedAccuracySwordImplicit2"
      ],
      "tags": [
          "sword",
          "one_hand_weapon",
          "onehand",
          "weapon",
          "default"
      ],
      "visualIdentity": {
          "ddsFile": "Art/2DItems/Weapons/OneHandWeapons/OneHandSwords/OneHandSword6.dds",
          "id": "OneHandSword6"
      }
  },
  {
      "id": "Metadata/Items/Weapons/OneHandWeapons/OneHandSwords/OneHandSword7",
      "name": "Elegant Sword",
      "itemClass": "One Hand Sword",
      "dropLevel": 28,
      "inventoryWidth": 2,
      "inventoryHeight": 3,
      "requirements": {
          "level": 28,
          "strength": 46,
          "dexterity": 55,
          "intelligence": 0
      },
      "properties": {
          "attack_time": 667,
          "critical_strike_chance": 500,
          "physical_damage_max": 33,
          "physical_damage_min": 20,
          "range": 11
      },
      "implicits": [
          "IncreasedAccuracySwordImplicit3"
      ],
      "tags": [
          "sword",
          "one_hand_weapon",
          "onehand",
          "weapon",
          "default"
      ],
      "visualIdentity": {
          "ddsFile": "Art/2DItems/Weapons/OneHandWeapons/OneHandSwords/OneHandSword7.dds",
          "id": "OneHandSword7"
      }
  },
  {
      "id": "Metadata/Items/Weapons/OneHandWeapons/OneHandSwords/OneHandSword8",
      "name": "Dusk Blade",
      "itemClass": "One Hand Sword",
      "dropLevel": 32,
      "inventoryWidth": 2,
      "inventoryHeight": 3,
      "requirements": {
          "level": 32,
          "strength": 57,
          "dexterity": 57,
          "intelligence": 0
      },
      "properties": {
          "attack_time": 769,
          "critical_strike_chance": 500,
          "physical_damage_max": 54,
          "physical_damage_min": 19,
          "range": 11
      },
      "implicits": [
          "AccuracyPercentImplicitSword1"
      ],
      "tags": [
          "sword",
          "one_hand_weapon",
          "onehand",
          "weapon",
          "default"
      ],
      "visualIdentity": {
          "ddsFile": "Art/2DItems/Weapons/OneHandWeapons/OneHandSwords/OneHandSword8.dds",
          "id": "OneHandSword8"
      }
  },
  {
      "id": "Metadata/Items/Weapons/OneHandWeapons/OneHandSwords/OneHandSword9",
      "name": "Variscite Blade",
      "itemClass": "One Hand Sword",
      "dropLevel": 35,
      "inventoryWidth": 1,
      "inventoryHeight": 3,
      "requirements": {
          "level": 35,
          "strength": 62,
          "dexterity": 62,
          "intelligence": 0
      },
      "properties": {
          "attack_time": 769,
          "critical_strike_chance": 500,
          "physical_damage_max": 53,
          "physical_damage_min": 25,
          "range": 11
      },
      "implicits": [
          "IncreasedAccuracySwordImplicit4"
      ],
      "tags": [
          "sword",
          "one_hand_weapon",
          "onehand",
          "weapon",
          "default"
      ],
      "visualIdentity": {
          "ddsFile": "Art/2DItems/Weapons/OneHandWeapons/OneHandSwords/OneHandSword2.dds",
          "id": "OneHandSword2"
      }
  },
  {
      "id": "Metadata/Items/Weapons/OneHandWeapons/OneHandSwords/OneHandSword10",
      "name": "Cutlass",
      "itemClass": "One Hand Sword",
      "dropLevel": 38,
      "inventoryWidth": 1,
      "inventoryHeight": 3,
      "requirements": {
          "level": 38,
          "strength": 55,
          "dexterity": 79,
          "intelligence": 0
      },
      "properties": {
          "attack_time": 645,
          "critical_strike_chance": 500,
          "physical_damage_max": 53,
          "physical_damage_min": 13,
          "range": 11
      },
      "implicits": [
          "AccuracyPercentImplicitSword1"
      ],
      "tags": [
          "sword",
          "one_hand_weapon",
          "onehand",
          "weapon",
          "default"
      ],
      "visualIdentity": {
          "ddsFile": "Art/2DItems/Weapons/OneHandWeapons/OneHandSwords/OneHandSword3.dds",
          "id": "OneHandSword3"
      }
  },
  {
      "id": "Metadata/Items/Weapons/OneHandWeapons/OneHandSwords/OneHandSword11",
      "name": "Baselard",
      "itemClass": "One Hand Sword",
      "dropLevel": 41,
      "inventoryWidth": 2,
      "inventoryHeight": 3,
      "requirements": {
          "level": 41,
          "strength": 72,
          "dexterity": 72,
          "intelligence": 0
      },
      "properties": {
          "attack_time": 769,
          "critical_strike_chance": 500,
          "physical_damage_max": 53,
          "physical_damage_min": 37,
          "range": 11
      },
      "implicits": [
          "AccuracyPercentImplicitSword1"
      ],
      "tags": [
          "sword",
          "one_hand_weapon",
          "onehand",
          "weapon",
          "default"
      ],
      "visualIdentity": {
          "ddsFile": "Art/2DItems/Weapons/OneHandWeapons/OneHandSwords/OneHandSword4.dds",
          "id": "OneHandSword4"
      }
  },
  {
      "id": "Metadata/Items/Weapons/OneHandWeapons/OneHandSwords/OneHandSword12",
      "name": "Battle Sword",
      "itemClass": "One Hand Sword",
      "dropLevel": 44,
      "inventoryWidth": 2,
      "inventoryHeight": 3,
      "requirements": {
          "level": 44,
          "strength": 83,
          "dexterity": 70,
          "intelligence": 0
      },
      "properties": {
          "attack_time": 833,
          "critical_strike_chance": 500,
          "physical_damage_max": 70,
          "physical_damage_min": 38,
          "range": 11
      },
      "implicits": [
          "AccuracyPercentImplicitSword1"
      ],
      "tags": [
          "sword",
          "one_hand_weapon",
          "onehand",
          "weapon",
          "default"
      ],
      "visualIdentity": {
          "ddsFile": "Art/2DItems/Weapons/OneHandWeapons/OneHandSwords/OneHandSword5.dds",
          "id": "OneHandSword5"
      }
  },
  {
      "id": "Metadata/Items/Weapons/OneHandWeapons/OneHandSwords/OneHandSword13",
      "name": "Elder Sword",
      "itemClass": "One Hand Sword",
      "dropLevel": 47,
      "inventoryWidth": 2,
      "inventoryHeight": 3,
      "requirements": {
          "level": 47,
          "strength": 81,
          "dexterity": 81,
          "intelligence": 0
      },
      "properties": {
          "attack_time": 769,
          "critical_strike_chance": 500,
          "physical_damage_max": 66,
          "physical_damage_min": 36,
          "range": 11
      },
      "implicits": [
          "IncreasedAccuracySwordImplicit5"
      ],
      "tags": [
          "sword",
          "one_hand_weapon",
          "onehand",
          "weapon",
          "default"
      ],
      "visualIdentity": {
          "ddsFile": "Art/2DItems/Weapons/OneHandWeapons/OneHandSwords/OneHandSword6.dds",
          "id": "OneHandSword6"
      }
  },
  {
      "id": "Metadata/Items/Weapons/OneHandWeapons/OneHandSwords/OneHandSword14",
      "name": "Graceful Sword",
      "itemClass": "One Hand Sword",
      "dropLevel": 50,
      "inventoryWidth": 2,
      "inventoryHeight": 3,
      "requirements": {
          "level": 50,
          "strength": 78,
          "dexterity": 94,
          "intelligence": 0
      },
      "properties": {
          "attack_time": 667,
          "critical_strike_chance": 500,
          "physical_damage_max": 55,
          "physical_damage_min": 34,
          "range": 11
      },
      "implicits": [
          "IncreasedAccuracySwordImplicit6"
      ],
      "tags": [
          "sword",
          "one_hand_weapon",
          "onehand",
          "weapon",
          "default"
      ],
      "visualIdentity": {
          "ddsFile": "Art/2DItems/Weapons/OneHandWeapons/OneHandSwords/OneHandSword7.dds",
          "id": "OneHandSword7"
      }
  },
  {
      "id": "Metadata/Items/Weapons/OneHandWeapons/OneHandSwords/OneHandSword15",
      "name": "Twilight Blade",
      "itemClass": "One Hand Sword",
      "dropLevel": 53,
      "inventoryWidth": 2,
      "inventoryHeight": 3,
      "requirements": {
          "level": 53,
          "strength": 91,
          "dexterity": 91,
          "intelligence": 0
      },
      "properties": {
          "attack_time": 769,
          "critical_strike_chance": 500,
          "physical_damage_max": 86,
          "physical_damage_min": 30,
          "range": 11
      },
      "implicits": [
          "AccuracyPercentImplicitSword1"
      ],
      "tags": [
          "sword",
          "one_hand_weapon",
          "onehand",
          "weapon",
          "default"
      ],
      "visualIdentity": {
          "ddsFile": "Art/2DItems/Weapons/OneHandWeapons/OneHandSwords/OneHandSword8.dds",
          "id": "OneHandSword8"
      }
  },
  {
      "id": "Metadata/Items/Weapons/OneHandWeapons/OneHandSwords/OneHandSword16",
      "name": "Gemstone Sword",
      "itemClass": "One Hand Sword",
      "dropLevel": 56,
      "inventoryWidth": 1,
      "inventoryHeight": 3,
      "requirements": {
          "level": 56,
          "strength": 96,
          "dexterity": 96,
          "intelligence": 0
      },
      "properties": {
          "attack_time": 769,
          "critical_strike_chance": 500,
          "physical_damage_max": 83,
          "physical_damage_min": 39,
          "range": 11
      },
      "implicits": [
          "IncreasedAccuracySwordImplicit7"
      ],
      "tags": [
          "sword",
          "one_hand_weapon",
          "onehand",
          "weapon",
          "default"
      ],
      "visualIdentity": {
          "ddsFile": "Art/2DItems/Weapons/OneHandWeapons/OneHandSwords/OneHandSword2.dds",
          "id": "OneHandSword2"
      }
  },
  {
      "id": "Metadata/Items/Weapons/OneHandWeapons/OneHandSwords/OneHandSword17",
      "name": "Corsair Sword",
      "itemClass": "One Hand Sword",
      "dropLevel": 58,
      "inventoryWidth": 1,
      "inventoryHeight": 3,
      "requirements": {
          "level": 58,
          "strength": 81,
          "dexterity": 117,
          "intelligence": 0
      },
      "properties": {
          "attack_time": 645,
          "critical_strike_chance": 500,
          "physical_damage_max": 80,
          "physical_damage_min": 20,
          "range": 11
      },
      "implicits": [
          "AccuracyPercentImplicitSword1"
      ],
      "tags": [
          "sword",
          "one_hand_weapon",
          "onehand",
          "weapon",
          "default"
      ],
      "visualIdentity": {
          "ddsFile": "Art/2DItems/Weapons/OneHandWeapons/OneHandSwords/OneHandSword3.dds",
          "id": "OneHandSword3"
      }
  },
  {
      "id": "Metadata/Items/Weapons/OneHandWeapons/OneHandSwords/OneHandSword18",
      "name": "Gladius",
      "itemClass": "One Hand Sword",
      "dropLevel": 60,
      "inventoryWidth": 2,
      "inventoryHeight": 3,
      "requirements": {
          "level": 60,
          "strength": 113,
          "dexterity": 113,
          "intelligence": 0
      },
      "properties": {
          "attack_time": 769,
          "critical_strike_chance": 500,
          "physical_damage_max": 78,
          "physical_damage_min": 54,
          "range": 11
      },
      "implicits": [
          "AccuracyPercentImplicitSword1"
      ],
      "tags": [
          "sword",
          "one_hand_weapon",
          "onehand",
          "weapon",
          "default"
      ],
      "visualIdentity": {
          "ddsFile": "Art/2DItems/Weapons/OneHandWeapons/OneHandSwords/OneHandSword4.dds",
          "id": "OneHandSword4"
      }
  },
  {
      "id": "Metadata/Items/Weapons/OneHandWeapons/OneHandSwords/OneHandSword19",
      "name": "Legion Sword",
      "itemClass": "One Hand Sword",
      "dropLevel": 62,
      "inventoryWidth": 2,
      "inventoryHeight": 3,
      "requirements": {
          "level": 62,
          "strength": 122,
          "dexterity": 104,
          "intelligence": 0
      },
      "properties": {
          "attack_time": 833,
          "critical_strike_chance": 500,
          "physical_damage_max": 98,
          "physical_damage_min": 53,
          "range": 11
      },
      "implicits": [
          "AccuracyPercentImplicitSword1"
      ],
      "tags": [
          "sword",
          "one_hand_weapon",
          "onehand",
          "weapon",
          "default"
      ],
      "visualIdentity": {
          "ddsFile": "Art/2DItems/Weapons/OneHandWeapons/OneHandSwords/OneHandSword5.dds",
          "id": "OneHandSword5"
      }
  },
  {
      "id": "Metadata/Items/Weapons/OneHandWeapons/OneHandSwords/OneHandSword20",
      "name": "Vaal Blade",
      "itemClass": "One Hand Sword",
      "dropLevel": 64,
      "inventoryWidth": 2,
      "inventoryHeight": 3,
      "requirements": {
          "level": 64,
          "strength": 113,
          "dexterity": 113,
          "intelligence": 0
      },
      "properties": {
          "attack_time": 769,
          "critical_strike_chance": 500,
          "physical_damage_max": 86,
          "physical_damage_min": 46,
          "range": 11
      },
      "implicits": [
          "IncreasedAccuracySwordImplicit8"
      ],
      "tags": [
          "sword",
          "one_hand_weapon",
          "onehand",
          "weapon",
          "default"
      ],
      "visualIdentity": {
          "ddsFile": "Art/2DItems/Weapons/OneHandWeapons/OneHandSwords/OneHandSword6.dds",
          "id": "OneHandSword6"
      }
  },
  {
      "id": "Metadata/Items/Weapons/OneHandWeapons/OneHandSwords/OneHandSword21",
      "name": "Eternal Sword",
      "itemClass": "One Hand Sword",
      "dropLevel": 66,
      "inventoryWidth": 2,
      "inventoryHeight": 3,
      "requirements": {
          "level": 66,
          "strength": 104,
          "dexterity": 122,
          "intelligence": 0
      },
      "properties": {
          "attack_time": 667,
          "critical_strike_chance": 500,
          "physical_damage_max": 68,
          "physical_damage_min": 41,
          "range": 11
      },
      "implicits": [
          "IncreasedAccuracySwordImplicit9"
      ],
      "tags": [
          "sword",
          "one_hand_weapon",
          "onehand",
          "weapon",
          "default"
      ],
      "visualIdentity": {
          "ddsFile": "Art/2DItems/Weapons/OneHandWeapons/OneHandSwords/OneHandSword7.dds",
          "id": "OneHandSword7"
      }
  },
  {
      "id": "Metadata/Items/Weapons/OneHandWeapons/OneHandSwords/OneHandSword22",
      "name": "Midnight Blade",
      "itemClass": "One Hand Sword",
      "dropLevel": 68,
      "inventoryWidth": 2,
      "inventoryHeight": 3,
      "requirements": {
          "level": 68,
          "strength": 113,
          "dexterity": 113,
          "intelligence": 0
      },
      "properties": {
          "attack_time": 769,
          "critical_strike_chance": 500,
          "physical_damage_max": 99,
          "physical_damage_min": 35,
          "range": 11
      },
      "implicits": [
          "AccuracyPercentImplicitSword1"
      ],
      "tags": [
          "sword",
          "one_hand_weapon",
          "onehand",
          "weapon",
          "default"
      ],
      "visualIdentity": {
          "ddsFile": "Art/2DItems/Weapons/OneHandWeapons/OneHandSwords/OneHandSword8.dds",
          "id": "OneHandSword8"
      }
  },
];

// Quiver (22 items)
export const QUIVER_BASES: PoeBaseItem[] = [
  {
      "id": "Metadata/Items/Quivers/QuiverNew1",
      "name": "Serrated Arrow Quiver",
      "itemClass": "Quiver",
      "dropLevel": 4,
      "inventoryWidth": 2,
      "inventoryHeight": 3,
      "requirements": null,
      "properties": {},
      "implicits": [
          "AddedPhysicalDamageImplicitQuiver1New"
      ],
      "tags": [
          "quiver",
          "default"
      ],
      "visualIdentity": {
          "ddsFile": "Art/2DItems/Quivers/QuiverSerrated.dds",
          "id": "QuiverNew1"
      }
  },
  {
      "id": "Metadata/Items/Quivers/Quiver6",
      "name": "Serrated Arrow Quiver",
      "itemClass": "Quiver",
      "dropLevel": 5,
      "inventoryWidth": 2,
      "inventoryHeight": 3,
      "requirements": null,
      "properties": {},
      "implicits": [
          "AddedPhysicalDamageImplicitQuiver6_"
      ],
      "tags": [
          "trade_market_legacy_item",
          "quiver",
          "default"
      ],
      "visualIdentity": {
          "ddsFile": "Art/2DItems/Quivers/QuiverSerrated.dds",
          "id": "Quiver6"
      }
  },
  {
      "id": "Metadata/Items/Quivers/Quiver7",
      "name": "Two-Point Arrow Quiver",
      "itemClass": "Quiver",
      "dropLevel": 5,
      "inventoryWidth": 2,
      "inventoryHeight": 3,
      "requirements": null,
      "properties": {},
      "implicits": [
          "IncreasedAccuracyPercentImplicitQuiver7"
      ],
      "tags": [
          "trade_market_legacy_item",
          "quiver",
          "default"
      ],
      "visualIdentity": {
          "ddsFile": "Art/2DItems/Quivers/QuiverTwo-Point.dds",
          "id": "Quiver7"
      }
  },
  {
      "id": "Metadata/Items/Quivers/QuiverNew2",
      "name": "Fire Arrow Quiver",
      "itemClass": "Quiver",
      "dropLevel": 9,
      "inventoryWidth": 2,
      "inventoryHeight": 3,
      "requirements": null,
      "properties": {},
      "implicits": [
          "AddedFireDamageImplicitQuiver2New"
      ],
      "tags": [
          "quiver",
          "default"
      ],
      "visualIdentity": {
          "ddsFile": "Art/2DItems/Quivers/QuiverFire.dds",
          "id": "QuiverNew2"
      }
  },
  {
      "id": "Metadata/Items/Quivers/Quiver8",
      "name": "Sharktooth Arrow Quiver",
      "itemClass": "Quiver",
      "dropLevel": 10,
      "inventoryWidth": 2,
      "inventoryHeight": 3,
      "requirements": null,
      "properties": {},
      "implicits": [
          "LifeGainPerTargetImplicitQuiver8"
      ],
      "tags": [
          "trade_market_legacy_item",
          "quiver",
          "default"
      ],
      "visualIdentity": {
          "ddsFile": "Art/2DItems/Quivers/QuiverSharktooth.dds",
          "id": "Quiver8"
      }
  },
  {
      "id": "Metadata/Items/Quivers/QuiverNew3",
      "name": "Sharktooth Arrow Quiver",
      "itemClass": "Quiver",
      "dropLevel": 14,
      "inventoryWidth": 2,
      "inventoryHeight": 3,
      "requirements": null,
      "properties": {},
      "implicits": [
          "LifeGainPerTargetImplicitQuiver3New"
      ],
      "tags": [
          "quiver",
          "default"
      ],
      "visualIdentity": {
          "ddsFile": "Art/2DItems/Quivers/QuiverSharktooth.dds",
          "id": "QuiverNew3"
      }
  },
  {
      "id": "Metadata/Items/Quivers/Quiver9",
      "name": "Blunt Arrow Quiver",
      "itemClass": "Quiver",
      "dropLevel": 16,
      "inventoryWidth": 2,
      "inventoryHeight": 3,
      "requirements": null,
      "properties": {},
      "implicits": [
          "StunDurationImplicitQuiver9"
      ],
      "tags": [
          "trade_market_legacy_item",
          "quiver",
          "default"
      ],
      "visualIdentity": {
          "ddsFile": "Art/2DItems/Quivers/QuiverBlunt.dds",
          "id": "Quiver9"
      }
  },
  {
      "id": "Metadata/Items/Quivers/QuiverNew4",
      "name": "Feathered Arrow Quiver",
      "itemClass": "Quiver",
      "dropLevel": 20,
      "inventoryWidth": 2,
      "inventoryHeight": 3,
      "requirements": null,
      "properties": {},
      "implicits": [
          "ProjectileSpeedImplicitQuiver4New"
      ],
      "tags": [
          "quiver",
          "default"
      ],
      "visualIdentity": {
          "ddsFile": "Art/2DItems/Quivers/FeatheredArrowQuiver.dds",
          "id": "QuiverNew4"
      }
  },
  {
      "id": "Metadata/Items/Quivers/Quiver10",
      "name": "Fire Arrow Quiver",
      "itemClass": "Quiver",
      "dropLevel": 22,
      "inventoryWidth": 2,
      "inventoryHeight": 3,
      "requirements": null,
      "properties": {},
      "implicits": [
          "AddedFireDamageImplicitQuiver10"
      ],
      "tags": [
          "trade_market_legacy_item",
          "quiver",
          "default"
      ],
      "visualIdentity": {
          "ddsFile": "Art/2DItems/Quivers/QuiverFire.dds",
          "id": "Quiver10"
      }
  },
  {
      "id": "Metadata/Items/Quivers/QuiverNew5",
      "name": "Penetrating Arrow Quiver",
      "itemClass": "Quiver",
      "dropLevel": 25,
      "inventoryWidth": 2,
      "inventoryHeight": 3,
      "requirements": null,
      "properties": {},
      "implicits": [
          "AdditionalArrowPierceImplicitQuiver5New"
      ],
      "tags": [
          "quiver",
          "default"
      ],
      "visualIdentity": {
          "ddsFile": "Art/2DItems/Quivers/QuiverPenetrating.dds",
          "id": "QuiverNew5"
      }
  },
  {
      "id": "Metadata/Items/Quivers/Quiver11",
      "name": "Broadhead Arrow Quiver",
      "itemClass": "Quiver",
      "dropLevel": 28,
      "inventoryWidth": 2,
      "inventoryHeight": 3,
      "requirements": null,
      "properties": {},
      "implicits": [
          "AddedPhysicalDamageImplicitQuiver11"
      ],
      "tags": [
          "trade_market_legacy_item",
          "quiver",
          "default"
      ],
      "visualIdentity": {
          "ddsFile": "Art/2DItems/Quivers/QuiverBroadhead.dds",
          "id": "Quiver11"
      }
  },
  {
      "id": "Metadata/Items/Quivers/QuiverNew6",
      "name": "Blunt Arrow Quiver",
      "itemClass": "Quiver",
      "dropLevel": 31,
      "inventoryWidth": 2,
      "inventoryHeight": 3,
      "requirements": null,
      "properties": {},
      "implicits": [
          "AddedPhysicalDamageImplicitQuiver6New"
      ],
      "tags": [
          "quiver",
          "default"
      ],
      "visualIdentity": {
          "ddsFile": "Art/2DItems/Quivers/QuiverBlunt.dds",
          "id": "QuiverNew6"
      }
  },
  {
      "id": "Metadata/Items/Quivers/Quiver12",
      "name": "Penetrating Arrow Quiver",
      "itemClass": "Quiver",
      "dropLevel": 36,
      "inventoryWidth": 2,
      "inventoryHeight": 3,
      "requirements": null,
      "properties": {},
      "implicits": [
          "AdditionalArrowPierceImplicitQuiver12_"
      ],
      "tags": [
          "trade_market_legacy_item",
          "quiver",
          "default"
      ],
      "visualIdentity": {
          "ddsFile": "Art/2DItems/Quivers/QuiverPenetrating.dds",
          "id": "Quiver12"
      }
  },
  {
      "id": "Metadata/Items/Quivers/QuiverNew7",
      "name": "Two-Point Arrow Quiver",
      "itemClass": "Quiver",
      "dropLevel": 36,
      "inventoryWidth": 2,
      "inventoryHeight": 3,
      "requirements": null,
      "properties": {},
      "implicits": [
          "IncreasedAccuracyPercentImplicitQuiver7New"
      ],
      "tags": [
          "quiver",
          "default"
      ],
      "visualIdentity": {
          "ddsFile": "Art/2DItems/Quivers/QuiverTwo-Point.dds",
          "id": "QuiverNew7_"
      }
  },
  {
      "id": "Metadata/Items/Quivers/QuiverNew8",
      "name": "Spike-Point Arrow Quiver",
      "itemClass": "Quiver",
      "dropLevel": 40,
      "inventoryWidth": 2,
      "inventoryHeight": 3,
      "requirements": null,
      "properties": {},
      "implicits": [
          "CriticalStrikeChanceImplicitQuiver8New"
      ],
      "tags": [
          "quiver",
          "default"
      ],
      "visualIdentity": {
          "ddsFile": "Art/2DItems/Quivers/QuiverSpike-Point.dds",
          "id": "QuiverNew8"
      }
  },
  {
      "id": "Metadata/Items/Quivers/Quiver13",
      "name": "Spike-Point Arrow Quiver",
      "itemClass": "Quiver",
      "dropLevel": 45,
      "inventoryWidth": 2,
      "inventoryHeight": 3,
      "requirements": null,
      "properties": {},
      "implicits": [
          "CriticalStrikeChanceImplicitQuiver13"
      ],
      "tags": [
          "trade_market_legacy_item",
          "quiver",
          "default"
      ],
      "visualIdentity": {
          "ddsFile": "Art/2DItems/Quivers/QuiverSpike-Point.dds",
          "id": "Quiver13"
      }
  },
  {
      "id": "Metadata/Items/Quivers/QuiverNew9",
      "name": "Blazing Arrow Quiver",
      "itemClass": "Quiver",
      "dropLevel": 45,
      "inventoryWidth": 2,
      "inventoryHeight": 3,
      "requirements": null,
      "properties": {},
      "implicits": [
          "AddedFireDamageImplicitQuiver9New"
      ],
      "tags": [
          "quiver",
          "default"
      ],
      "visualIdentity": {
          "ddsFile": "Art/2DItems/Quivers/QuiverFire.dds",
          "id": "QuiverNew9"
      }
  },
  {
      "id": "Metadata/Items/Quivers/QuiverNew10",
      "name": "Broadhead Arrow Quiver",
      "itemClass": "Quiver",
      "dropLevel": 49,
      "inventoryWidth": 2,
      "inventoryHeight": 3,
      "requirements": null,
      "properties": {},
      "implicits": [
          "IncreasedAttackSpeedImplicitQuiver10New"
      ],
      "tags": [
          "quiver",
          "default"
      ],
      "visualIdentity": {
          "ddsFile": "Art/2DItems/Quivers/QuiverBroadhead.dds",
          "id": "QuiverNew10"
      }
  },
  {
      "id": "Metadata/Items/Quivers/QuiverNew11",
      "name": "Vile Arrow Quiver",
      "itemClass": "Quiver",
      "dropLevel": 55,
      "inventoryWidth": 2,
      "inventoryHeight": 3,
      "requirements": null,
      "properties": {},
      "implicits": [
          "PhysicalDamageAddedAsChaosImplicitQuiver11New"
      ],
      "tags": [
          "quiver",
          "default"
      ],
      "visualIdentity": {
          "ddsFile": "Art/2DItems/Quivers/VileArrowQuiver.dds",
          "id": "QuiverNew11__"
      }
  },
  {
      "id": "Metadata/Items/Quivers/QuiverNew12",
      "name": "Heavy Arrow Quiver",
      "itemClass": "Quiver",
      "dropLevel": 61,
      "inventoryWidth": 2,
      "inventoryHeight": 3,
      "requirements": null,
      "properties": {},
      "implicits": [
          "AddedPhysicalDamageImplicitQuiver12New"
      ],
      "tags": [
          "quiver",
          "default"
      ],
      "visualIdentity": {
          "ddsFile": "Art/2DItems/Quivers/QuiverBlunt.dds",
          "id": "QuiverNew12"
      }
  },
  {
      "id": "Metadata/Items/Quivers/QuiverNew13",
      "name": "Primal Arrow Quiver",
      "itemClass": "Quiver",
      "dropLevel": 66,
      "inventoryWidth": 2,
      "inventoryHeight": 3,
      "requirements": null,
      "properties": {},
      "implicits": [
          "WeaponElementalDamageImplicitQuiver13New"
      ],
      "tags": [
          "quiver",
          "default"
      ],
      "visualIdentity": {
          "ddsFile": "Art/2DItems/Quivers/RikerRinQuiver.dds",
          "id": "QuiverNew13"
      }
  },
  {
      "id": "Metadata/Items/Quivers/QuiverAtlas1",
      "name": "Artillery Quiver",
      "itemClass": "Quiver",
      "dropLevel": 74,
      "inventoryWidth": 2,
      "inventoryHeight": 3,
      "requirements": null,
      "properties": {},
      "implicits": [
          "SummonTotemCastSpeedImplicit1"
      ],
      "tags": [
          "not_for_sale",
          "atlas_base_type",
          "quiveratlas1",
          "quiver",
          "default"
      ],
      "visualIdentity": {
          "ddsFile": "Art/2DItems/Quivers/ChiselQuiver.dds",
          "id": "QuiverAtlas1__"
      }
  },
];

// Ring (21 items)
export const RING_BASES: PoeBaseItem[] = [
  {
      "id": "Metadata/Items/Rings/Ring1",
      "name": "Iron Ring",
      "itemClass": "Ring",
      "dropLevel": 2,
      "inventoryWidth": 1,
      "inventoryHeight": 1,
      "requirements": null,
      "properties": {},
      "implicits": [
          "AddedPhysicalDamageImplicitRing1"
      ],
      "tags": [
          "ring",
          "default"
      ],
      "visualIdentity": {
          "ddsFile": "Art/2DItems/Rings/Ring1.dds",
          "id": "Ring1"
      }
  },
  {
      "id": "Metadata/Items/Rings/Ring2",
      "name": "Coral Ring",
      "itemClass": "Ring",
      "dropLevel": 4,
      "inventoryWidth": 1,
      "inventoryHeight": 1,
      "requirements": null,
      "properties": {},
      "implicits": [
          "IncreasedLifeImplicitRing1"
      ],
      "tags": [
          "ring",
          "default"
      ],
      "visualIdentity": {
          "ddsFile": "Art/2DItems/Rings/Ring2.dds",
          "id": "Ring2"
      }
  },
  {
      "id": "Metadata/Items/Rings/Ring3",
      "name": "Paua Ring",
      "itemClass": "Ring",
      "dropLevel": 5,
      "inventoryWidth": 1,
      "inventoryHeight": 1,
      "requirements": null,
      "properties": {},
      "implicits": [
          "IncreasedManaImplicitRing1"
      ],
      "tags": [
          "ring",
          "default"
      ],
      "visualIdentity": {
          "ddsFile": "Art/2DItems/Rings/Ring3.dds",
          "id": "Ring3"
      }
  },
  {
      "id": "Metadata/Items/Rings/Ring6",
      "name": "Sapphire Ring",
      "itemClass": "Ring",
      "dropLevel": 8,
      "inventoryWidth": 1,
      "inventoryHeight": 1,
      "requirements": null,
      "properties": {},
      "implicits": [
          "ColdResistImplicitRing1"
      ],
      "tags": [
          "ring",
          "default"
      ],
      "visualIdentity": {
          "ddsFile": "Art/2DItems/Rings/Ring6.dds",
          "id": "Ring6"
      }
  },
  {
      "id": "Metadata/Items/Rings/Ring5",
      "name": "Topaz Ring",
      "itemClass": "Ring",
      "dropLevel": 12,
      "inventoryWidth": 1,
      "inventoryHeight": 1,
      "requirements": null,
      "properties": {},
      "implicits": [
          "LightningResistImplicitRing1"
      ],
      "tags": [
          "ring",
          "default"
      ],
      "visualIdentity": {
          "ddsFile": "Art/2DItems/Rings/Ring5.dds",
          "id": "Ring5"
      }
  },
  {
      "id": "Metadata/Items/Rings/Ring7",
      "name": "Ruby Ring",
      "itemClass": "Ring",
      "dropLevel": 16,
      "inventoryWidth": 1,
      "inventoryHeight": 1,
      "requirements": null,
      "properties": {},
      "implicits": [
          "FireResistImplicitRing1"
      ],
      "tags": [
          "ring",
          "default"
      ],
      "visualIdentity": {
          "ddsFile": "Art/2DItems/Rings/Ring7.dds",
          "id": "Ring7"
      }
  },
  {
      "id": "Metadata/Items/Rings/Ring12",
      "name": "Two-Stone Ring",
      "itemClass": "Ring",
      "dropLevel": 20,
      "inventoryWidth": 1,
      "inventoryHeight": 1,
      "requirements": null,
      "properties": {},
      "implicits": [
          "FireAndLightningResistImplicitRing1"
      ],
      "tags": [
          "twostonering",
          "ring",
          "default"
      ],
      "visualIdentity": {
          "ddsFile": "Art/2DItems/Rings/TopazRuby.dds",
          "id": "Ring12"
      }
  },
  {
      "id": "Metadata/Items/Rings/Ring13",
      "name": "Two-Stone Ring",
      "itemClass": "Ring",
      "dropLevel": 20,
      "inventoryWidth": 1,
      "inventoryHeight": 1,
      "requirements": null,
      "properties": {},
      "implicits": [
          "ColdAndLightningResistImplicitRing1"
      ],
      "tags": [
          "twostonering",
          "ring",
          "default"
      ],
      "visualIdentity": {
          "ddsFile": "Art/2DItems/Rings/TopazSapphire.dds",
          "id": "Ring13"
      }
  },
  {
      "id": "Metadata/Items/Rings/Ring14",
      "name": "Two-Stone Ring",
      "itemClass": "Ring",
      "dropLevel": 20,
      "inventoryWidth": 1,
      "inventoryHeight": 1,
      "requirements": null,
      "properties": {},
      "implicits": [
          "FireAndColdResistImplicitRing1"
      ],
      "tags": [
          "twostonering",
          "ring",
          "default"
      ],
      "visualIdentity": {
          "ddsFile": "Art/2DItems/Rings/SapphireRuby.dds",
          "id": "Ring14"
      }
  },
  {
      "id": "Metadata/Items/Rings/Ring4",
      "name": "Gold Ring",
      "itemClass": "Ring",
      "dropLevel": 20,
      "inventoryWidth": 1,
      "inventoryHeight": 1,
      "requirements": null,
      "properties": {},
      "implicits": [
          "ItemFoundRarityIncreaseImplicitRing1"
      ],
      "tags": [
          "ring",
          "default"
      ],
      "visualIdentity": {
          "ddsFile": "Art/2DItems/Rings/Ring4.dds",
          "id": "Ring4"
      }
  },
  {
      "id": "Metadata/Items/Rings/Ring11",
      "name": "Diamond Ring",
      "itemClass": "Ring",
      "dropLevel": 25,
      "inventoryWidth": 1,
      "inventoryHeight": 1,
      "requirements": null,
      "properties": {},
      "implicits": [
          "CriticalStrikeChanceImplicitRing1"
      ],
      "tags": [
          "ring",
          "default"
      ],
      "visualIdentity": {
          "ddsFile": "Art/2DItems/Rings/DiamondRing.dds",
          "id": "Ring11"
      }
  },
  {
      "id": "Metadata/Items/Rings/Ring9",
      "name": "Moonstone Ring",
      "itemClass": "Ring",
      "dropLevel": 25,
      "inventoryWidth": 1,
      "inventoryHeight": 1,
      "requirements": null,
      "properties": {},
      "implicits": [
          "IncreasedEnergyShieldImplicitRing1"
      ],
      "tags": [
          "ring",
          "default"
      ],
      "visualIdentity": {
          "ddsFile": "Art/2DItems/Rings/MoonstoneRing.dds",
          "id": "Ring9"
      }
  },
  {
      "id": "Metadata/Items/Rings/Ring16",
      "name": "Bone Ring",
      "itemClass": "Ring",
      "dropLevel": 30,
      "inventoryWidth": 1,
      "inventoryHeight": 1,
      "requirements": null,
      "properties": {},
      "implicits": [
          "MinionElementalResistanceImplicitRing1"
      ],
      "tags": [
          "ring_can_roll_minion_modifiers",
          "ring",
          "default"
      ],
      "visualIdentity": {
          "ddsFile": "Art/2DItems/Rings/BoneRing.dds",
          "id": "Ring16"
      }
  },
  {
      "id": "Metadata/Items/Rings/Ring8",
      "name": "Prismatic Ring",
      "itemClass": "Ring",
      "dropLevel": 30,
      "inventoryWidth": 1,
      "inventoryHeight": 1,
      "requirements": null,
      "properties": {},
      "implicits": [
          "AllResistancesImplicitRing1"
      ],
      "tags": [
          "ring",
          "default"
      ],
      "visualIdentity": {
          "ddsFile": "Art/2DItems/Rings/Ring12.dds",
          "id": "Ring8"
      }
  },
  {
      "id": "Metadata/Items/Rings/Ring10",
      "name": "Amethyst Ring",
      "itemClass": "Ring",
      "dropLevel": 38,
      "inventoryWidth": 1,
      "inventoryHeight": 1,
      "requirements": null,
      "properties": {},
      "implicits": [
          "ChaosResistImplicitRing1"
      ],
      "tags": [
          "ring",
          "default"
      ],
      "visualIdentity": {
          "ddsFile": "Art/2DItems/Rings/AmethystRing.dds",
          "id": "Ring10"
      }
  },
  {
      "id": "Metadata/Items/Rings/Ring15",
      "name": "Unset Ring",
      "itemClass": "Ring",
      "dropLevel": 45,
      "inventoryWidth": 1,
      "inventoryHeight": 1,
      "requirements": null,
      "properties": {},
      "implicits": [
          "RingHasOneSocket"
      ],
      "tags": [
          "unset_ring",
          "ring",
          "default"
      ],
      "visualIdentity": {
          "ddsFile": "Art/2DItems/Rings/Empty-Socket.dds",
          "id": "Ring15"
      }
  },
  {
      "id": "Metadata/Items/Rings/RingAtlas1",
      "name": "Steel Ring",
      "itemClass": "Ring",
      "dropLevel": 78,
      "inventoryWidth": 1,
      "inventoryHeight": 1,
      "requirements": null,
      "properties": {},
      "implicits": [
          "AddedPhysicalDamageImplicitRing2"
      ],
      "tags": [
          "not_for_sale",
          "atlas_base_type",
          "ringatlas1",
          "ring",
          "default"
      ],
      "visualIdentity": {
          "ddsFile": "Art/2DItems/Rings/AdamantineRing.dds",
          "id": "RingAtlas1"
      }
  },
  {
      "id": "Metadata/Items/Rings/RingAtlas2",
      "name": "Opal Ring",
      "itemClass": "Ring",
      "dropLevel": 78,
      "inventoryWidth": 1,
      "inventoryHeight": 1,
      "requirements": null,
      "properties": {},
      "implicits": [
          "ElementalDamagePercentImplicitAtlasRing_"
      ],
      "tags": [
          "not_for_sale",
          "atlas_base_type",
          "ringatlas2",
          "ring",
          "default"
      ],
      "visualIdentity": {
          "ddsFile": "Art/2DItems/Rings/OpalRing.dds",
          "id": "RingAtlas2"
      }
  },
  {
      "id": "Metadata/Items/Rings/RingAtlas5",
      "name": "Iolite Ring",
      "itemClass": "Ring",
      "dropLevel": 78,
      "inventoryWidth": 1,
      "inventoryHeight": 1,
      "requirements": null,
      "properties": {},
      "implicits": [
          "IncreasedChaosDamageImplicit1_"
      ],
      "tags": [
          "not_for_sale",
          "atlas_base_type",
          "ringatlas5",
          "ring",
          "default"
      ],
      "visualIdentity": {
          "ddsFile": "Art/2DItems/Rings/ChaosDmgRing.dds",
          "id": "RingAtlas5"
      }
  },
  {
      "id": "Metadata/Items/Rings/RingAtlas3",
      "name": "Vermillion Ring",
      "itemClass": "Ring",
      "dropLevel": 80,
      "inventoryWidth": 1,
      "inventoryHeight": 1,
      "requirements": null,
      "properties": {},
      "implicits": [
          "MaximumLifeImplicitAtlasRing"
      ],
      "tags": [
          "not_for_sale",
          "atlas_base_type",
          "ringatlas3",
          "ring",
          "default"
      ],
      "visualIdentity": {
          "ddsFile": "Art/2DItems/Rings/VermillionRing.dds",
          "id": "RingAtlas3"
      }
  },
  {
      "id": "Metadata/Items/Rings/RingAtlas4",
      "name": "Cerulean Ring",
      "itemClass": "Ring",
      "dropLevel": 80,
      "inventoryWidth": 1,
      "inventoryHeight": 1,
      "requirements": null,
      "properties": {},
      "implicits": [
          "MaximumManaImplicitAtlasRing_"
      ],
      "tags": [
          "not_for_sale",
          "atlas_base_type",
          "ringatlas4",
          "ring",
          "default"
      ],
      "visualIdentity": {
          "ddsFile": "Art/2DItems/Rings/CeruleanRing.dds",
          "id": "RingAtlas4"
      }
  },
];

// Rune Dagger (15 items)
export const RUNE_DAGGER_BASES: PoeBaseItem[] = [
  {
      "id": "Metadata/Items/Weapons/OneHandWeapons/Daggers/Dagger3",
      "name": "Carving Knife",
      "itemClass": "Rune Dagger",
      "dropLevel": 10,
      "inventoryWidth": 1,
      "inventoryHeight": 3,
      "requirements": {
          "level": 10,
          "strength": 0,
          "dexterity": 18,
          "intelligence": 26
      },
      "properties": {
          "attack_time": 690,
          "critical_strike_chance": 630,
          "physical_damage_max": 26,
          "physical_damage_min": 3,
          "range": 10
      },
      "implicits": [
          "CriticalStrikeChanceImplicitDaggerNew1"
      ],
      "tags": [
          "dagger",
          "one_hand_weapon",
          "onehand",
          "weapon",
          "default"
      ],
      "visualIdentity": {
          "ddsFile": "Art/2DItems/Weapons/OneHandWeapons/Daggers/Dagger3.dds",
          "id": "Dagger3"
      }
  },
  {
      "id": "Metadata/Items/Weapons/OneHandWeapons/Daggers/Dagger5",
      "name": "Boot Knife",
      "itemClass": "Rune Dagger",
      "dropLevel": 20,
      "inventoryWidth": 1,
      "inventoryHeight": 3,
      "requirements": {
          "level": 20,
          "strength": 0,
          "dexterity": 31,
          "intelligence": 45
      },
      "properties": {
          "attack_time": 690,
          "critical_strike_chance": 630,
          "physical_damage_max": 34,
          "physical_damage_min": 8,
          "range": 10
      },
      "implicits": [
          "CriticalStrikeChanceImplicitDaggerNew1"
      ],
      "tags": [
          "dagger",
          "one_hand_weapon",
          "onehand",
          "weapon",
          "default"
      ],
      "visualIdentity": {
          "ddsFile": "Art/2DItems/Weapons/OneHandWeapons/Daggers/Dagger5.dds",
          "id": "Dagger5"
      }
  },
  {
      "id": "Metadata/Items/Weapons/OneHandWeapons/Daggers/Dagger6",
      "name": "Copper Kris",
      "itemClass": "Rune Dagger",
      "dropLevel": 24,
      "inventoryWidth": 1,
      "inventoryHeight": 3,
      "requirements": {
          "level": 24,
          "strength": 0,
          "dexterity": 28,
          "intelligence": 60
      },
      "properties": {
          "attack_time": 769,
          "critical_strike_chance": 650,
          "physical_damage_max": 41,
          "physical_damage_min": 10,
          "range": 10
      },
      "implicits": [
          "CriticalStrikeChanceImplicitDaggerNew3"
      ],
      "tags": [
          "dagger",
          "one_hand_weapon",
          "onehand",
          "weapon",
          "default"
      ],
      "visualIdentity": {
          "ddsFile": "Art/2DItems/Weapons/OneHandWeapons/Daggers/Dagger6.dds",
          "id": "Dagger6"
      }
  },
  {
      "id": "Metadata/Items/Weapons/OneHandWeapons/Daggers/Dagger7",
      "name": "Skean",
      "itemClass": "Rune Dagger",
      "dropLevel": 28,
      "inventoryWidth": 1,
      "inventoryHeight": 3,
      "requirements": {
          "level": 28,
          "strength": 0,
          "dexterity": 42,
          "intelligence": 60
      },
      "properties": {
          "attack_time": 690,
          "critical_strike_chance": 630,
          "physical_damage_max": 43,
          "physical_damage_min": 11,
          "range": 10
      },
      "implicits": [
          "CriticalStrikeChanceImplicitDaggerNew1"
      ],
      "tags": [
          "dagger",
          "one_hand_weapon",
          "onehand",
          "weapon",
          "default"
      ],
      "visualIdentity": {
          "ddsFile": "Art/2DItems/Weapons/OneHandWeapons/Daggers/Dagger7.dds",
          "id": "Dagger7"
      }
  },
  {
      "id": "Metadata/Items/Weapons/OneHandWeapons/Daggers/Dagger8",
      "name": "Imp Dagger",
      "itemClass": "Rune Dagger",
      "dropLevel": 32,
      "inventoryWidth": 1,
      "inventoryHeight": 3,
      "requirements": {
          "level": 32,
          "strength": 0,
          "dexterity": 36,
          "intelligence": 78
      },
      "properties": {
          "attack_time": 833,
          "critical_strike_chance": 650,
          "physical_damage_max": 59,
          "physical_damage_min": 15,
          "range": 10
      },
      "implicits": [
          "CriticalStrikeChanceImplicitDaggerNew2"
      ],
      "tags": [
          "dagger",
          "one_hand_weapon",
          "onehand",
          "weapon",
          "default"
      ],
      "visualIdentity": {
          "ddsFile": "Art/2DItems/Weapons/OneHandWeapons/Daggers/Dagger8.dds",
          "id": "Dagger8"
      }
  },
  {
      "id": "Metadata/Items/Weapons/OneHandWeapons/Daggers/Dagger10",
      "name": "Butcher Knife",
      "itemClass": "Rune Dagger",
      "dropLevel": 38,
      "inventoryWidth": 1,
      "inventoryHeight": 3,
      "requirements": {
          "level": 38,
          "strength": 0,
          "dexterity": 55,
          "intelligence": 79
      },
      "properties": {
          "attack_time": 714,
          "critical_strike_chance": 630,
          "physical_damage_max": 62,
          "physical_damage_min": 7,
          "range": 10
      },
      "implicits": [
          "CriticalStrikeChanceImplicitDaggerNew1"
      ],
      "tags": [
          "dagger",
          "one_hand_weapon",
          "onehand",
          "weapon",
          "default"
      ],
      "visualIdentity": {
          "ddsFile": "Art/2DItems/Weapons/OneHandWeapons/Daggers/Dagger3.dds",
          "id": "Dagger3"
      }
  },
  {
      "id": "Metadata/Items/Weapons/OneHandWeapons/Daggers/Dagger12",
      "name": "Boot Blade",
      "itemClass": "Rune Dagger",
      "dropLevel": 44,
      "inventoryWidth": 1,
      "inventoryHeight": 3,
      "requirements": {
          "level": 44,
          "strength": 0,
          "dexterity": 63,
          "intelligence": 90
      },
      "properties": {
          "attack_time": 714,
          "critical_strike_chance": 630,
          "physical_damage_max": 59,
          "physical_damage_min": 15,
          "range": 10
      },
      "implicits": [
          "CriticalStrikeChanceImplicitDaggerNew1"
      ],
      "tags": [
          "dagger",
          "one_hand_weapon",
          "onehand",
          "weapon",
          "default"
      ],
      "visualIdentity": {
          "ddsFile": "Art/2DItems/Weapons/OneHandWeapons/Daggers/Dagger5.dds",
          "id": "Dagger5"
      }
  },
  {
      "id": "Metadata/Items/Weapons/OneHandWeapons/Daggers/Dagger13",
      "name": "Golden Kris",
      "itemClass": "Rune Dagger",
      "dropLevel": 47,
      "inventoryWidth": 1,
      "inventoryHeight": 3,
      "requirements": {
          "level": 47,
          "strength": 0,
          "dexterity": 51,
          "intelligence": 110
      },
      "properties": {
          "attack_time": 833,
          "critical_strike_chance": 650,
          "physical_damage_max": 75,
          "physical_damage_min": 19,
          "range": 10
      },
      "implicits": [
          "CriticalStrikeChanceImplicitDaggerNew3"
      ],
      "tags": [
          "dagger",
          "one_hand_weapon",
          "onehand",
          "weapon",
          "default"
      ],
      "visualIdentity": {
          "ddsFile": "Art/2DItems/Weapons/OneHandWeapons/Daggers/Dagger6.dds",
          "id": "Dagger6"
      }
  },
  {
      "id": "Metadata/Items/Weapons/OneHandWeapons/Daggers/Dagger14",
      "name": "Royal Skean",
      "itemClass": "Rune Dagger",
      "dropLevel": 50,
      "inventoryWidth": 1,
      "inventoryHeight": 3,
      "requirements": {
          "level": 50,
          "strength": 0,
          "dexterity": 71,
          "intelligence": 102
      },
      "properties": {
          "attack_time": 690,
          "critical_strike_chance": 630,
          "physical_damage_max": 64,
          "physical_damage_min": 16,
          "range": 10
      },
      "implicits": [
          "CriticalStrikeChanceImplicitDaggerNew1"
      ],
      "tags": [
          "dagger",
          "one_hand_weapon",
          "onehand",
          "weapon",
          "default"
      ],
      "visualIdentity": {
          "ddsFile": "Art/2DItems/Weapons/OneHandWeapons/Daggers/Dagger7.dds",
          "id": "Dagger7"
      }
  },
  {
      "id": "Metadata/Items/Weapons/OneHandWeapons/Daggers/Dagger15",
      "name": "Fiend Dagger",
      "itemClass": "Rune Dagger",
      "dropLevel": 53,
      "inventoryWidth": 1,
      "inventoryHeight": 3,
      "requirements": {
          "level": 53,
          "strength": 0,
          "dexterity": 58,
          "intelligence": 123
      },
      "properties": {
          "attack_time": 833,
          "critical_strike_chance": 650,
          "physical_damage_max": 87,
          "physical_damage_min": 22,
          "range": 10
      },
      "implicits": [
          "CriticalStrikeChanceImplicitDaggerNew2"
      ],
      "tags": [
          "dagger",
          "one_hand_weapon",
          "onehand",
          "weapon",
          "default"
      ],
      "visualIdentity": {
          "ddsFile": "Art/2DItems/Weapons/OneHandWeapons/Daggers/Dagger8.dds",
          "id": "Dagger8"
      }
  },
  {
      "id": "Metadata/Items/Weapons/OneHandWeapons/Daggers/Dagger17",
      "name": "Slaughter Knife",
      "itemClass": "Rune Dagger",
      "dropLevel": 58,
      "inventoryWidth": 1,
      "inventoryHeight": 3,
      "requirements": {
          "level": 58,
          "strength": 0,
          "dexterity": 81,
          "intelligence": 117
      },
      "properties": {
          "attack_time": 714,
          "critical_strike_chance": 630,
          "physical_damage_max": 86,
          "physical_damage_min": 10,
          "range": 10
      },
      "implicits": [
          "CriticalStrikeChanceImplicitDaggerNew1"
      ],
      "tags": [
          "dagger",
          "one_hand_weapon",
          "onehand",
          "weapon",
          "default"
      ],
      "visualIdentity": {
          "ddsFile": "Art/2DItems/Weapons/OneHandWeapons/Daggers/Dagger3.dds",
          "id": "Dagger3"
      }
  },
  {
      "id": "Metadata/Items/Weapons/OneHandWeapons/Daggers/Dagger19",
      "name": "Ezomyte Dagger",
      "itemClass": "Rune Dagger",
      "dropLevel": 62,
      "inventoryWidth": 1,
      "inventoryHeight": 3,
      "requirements": {
          "level": 62,
          "strength": 0,
          "dexterity": 95,
          "intelligence": 131
      },
      "properties": {
          "attack_time": 714,
          "critical_strike_chance": 630,
          "physical_damage_max": 79,
          "physical_damage_min": 20,
          "range": 10
      },
      "implicits": [
          "CriticalStrikeChanceImplicitDaggerNew1"
      ],
      "tags": [
          "dagger",
          "one_hand_weapon",
          "onehand",
          "weapon",
          "default"
      ],
      "visualIdentity": {
          "ddsFile": "Art/2DItems/Weapons/OneHandWeapons/Daggers/Dagger5.dds",
          "id": "Dagger5"
      }
  },
  {
      "id": "Metadata/Items/Weapons/OneHandWeapons/Daggers/Dagger20",
      "name": "Platinum Kris",
      "itemClass": "Rune Dagger",
      "dropLevel": 64,
      "inventoryWidth": 1,
      "inventoryHeight": 3,
      "requirements": {
          "level": 64,
          "strength": 0,
          "dexterity": 76,
          "intelligence": 149
      },
      "properties": {
          "attack_time": 833,
          "critical_strike_chance": 650,
          "physical_damage_max": 95,
          "physical_damage_min": 24,
          "range": 10
      },
      "implicits": [
          "CriticalStrikeChanceImplicitDaggerNew3"
      ],
      "tags": [
          "dagger",
          "one_hand_weapon",
          "onehand",
          "weapon",
          "default"
      ],
      "visualIdentity": {
          "ddsFile": "Art/2DItems/Weapons/OneHandWeapons/Daggers/Dagger6.dds",
          "id": "Dagger6"
      }
  },
  {
      "id": "Metadata/Items/Weapons/OneHandWeapons/Daggers/Dagger21",
      "name": "Imperial Skean",
      "itemClass": "Rune Dagger",
      "dropLevel": 66,
      "inventoryWidth": 1,
      "inventoryHeight": 3,
      "requirements": {
          "level": 66,
          "strength": 0,
          "dexterity": 95,
          "intelligence": 131
      },
      "properties": {
          "attack_time": 667,
          "critical_strike_chance": 630,
          "physical_damage_max": 73,
          "physical_damage_min": 18,
          "range": 10
      },
      "implicits": [
          "CriticalStrikeChanceImplicitDaggerNew1"
      ],
      "tags": [
          "dagger",
          "one_hand_weapon",
          "onehand",
          "weapon",
          "default"
      ],
      "visualIdentity": {
          "ddsFile": "Art/2DItems/Weapons/OneHandWeapons/Daggers/Dagger7.dds",
          "id": "Dagger7"
      }
  },
  {
      "id": "Metadata/Items/Weapons/OneHandWeapons/Daggers/Dagger22",
      "name": "Demon Dagger",
      "itemClass": "Rune Dagger",
      "dropLevel": 68,
      "inventoryWidth": 1,
      "inventoryHeight": 3,
      "requirements": {
          "level": 68,
          "strength": 0,
          "dexterity": 76,
          "intelligence": 149
      },
      "properties": {
          "attack_time": 833,
          "critical_strike_chance": 650,
          "physical_damage_max": 97,
          "physical_damage_min": 24,
          "range": 10
      },
      "implicits": [
          "CriticalStrikeChanceImplicitDaggerNew2"
      ],
      "tags": [
          "dagger",
          "one_hand_weapon",
          "onehand",
          "weapon",
          "default"
      ],
      "visualIdentity": {
          "ddsFile": "Art/2DItems/Weapons/OneHandWeapons/Daggers/Dagger8.dds",
          "id": "Dagger8"
      }
  },
];

// Sceptre (22 items)
export const SCEPTRE_BASES: PoeBaseItem[] = [
  {
      "id": "Metadata/Items/Weapons/OneHandWeapons/OneHandMaces/Sceptre1",
      "name": "Driftwood Sceptre",
      "itemClass": "Sceptre",
      "dropLevel": 1,
      "inventoryWidth": 1,
      "inventoryHeight": 3,
      "requirements": {
          "level": 1,
          "strength": 8,
          "dexterity": 0,
          "intelligence": 8
      },
      "properties": {
          "attack_time": 645,
          "critical_strike_chance": 600,
          "physical_damage_max": 8,
          "physical_damage_min": 5,
          "range": 11
      },
      "implicits": [
          "ElementalDamagePercentImplicitSceptreNew1"
      ],
      "tags": [
          "sceptre",
          "sceptre",
          "one_hand_weapon",
          "onehand",
          "weapon",
          "default"
      ],
      "visualIdentity": {
          "ddsFile": "Art/2DItems/Weapons/OneHandWeapons/Scepters/scepter1.dds",
          "id": "Sceptre1"
      }
  },
  {
      "id": "Metadata/Items/Weapons/OneHandWeapons/OneHandMaces/Sceptre2",
      "name": "Darkwood Sceptre",
      "itemClass": "Sceptre",
      "dropLevel": 5,
      "inventoryWidth": 2,
      "inventoryHeight": 3,
      "requirements": {
          "level": 5,
          "strength": 14,
          "dexterity": 0,
          "intelligence": 14
      },
      "properties": {
          "attack_time": 667,
          "critical_strike_chance": 600,
          "physical_damage_max": 12,
          "physical_damage_min": 8,
          "range": 11
      },
      "implicits": [
          "ElementalDamagePercentImplicitSceptreNew2"
      ],
      "tags": [
          "sceptre",
          "sceptre",
          "one_hand_weapon",
          "onehand",
          "weapon",
          "default"
      ],
      "visualIdentity": {
          "ddsFile": "Art/2DItems/Weapons/OneHandWeapons/Scepters/scepter2.dds",
          "id": "Sceptre2"
      }
  },
  {
      "id": "Metadata/Items/Weapons/OneHandWeapons/OneHandMaces/Sceptre3",
      "name": "Bronze Sceptre",
      "itemClass": "Sceptre",
      "dropLevel": 10,
      "inventoryWidth": 2,
      "inventoryHeight": 3,
      "requirements": {
          "level": 10,
          "strength": 22,
          "dexterity": 0,
          "intelligence": 22
      },
      "properties": {
          "attack_time": 714,
          "critical_strike_chance": 600,
          "physical_damage_max": 19,
          "physical_damage_min": 10,
          "range": 11
      },
      "implicits": [
          "ElementalDamagePercentImplicitSceptreNew3"
      ],
      "tags": [
          "sceptre",
          "sceptre",
          "one_hand_weapon",
          "onehand",
          "weapon",
          "default"
      ],
      "visualIdentity": {
          "ddsFile": "Art/2DItems/Weapons/OneHandWeapons/Scepters/scepter3.dds",
          "id": "Sceptre3"
      }
  },
  {
      "id": "Metadata/Items/Weapons/OneHandWeapons/OneHandMaces/Sceptre4",
      "name": "Quartz Sceptre",
      "itemClass": "Sceptre",
      "dropLevel": 15,
      "inventoryWidth": 2,
      "inventoryHeight": 3,
      "requirements": {
          "level": 15,
          "strength": 25,
          "dexterity": 0,
          "intelligence": 35
      },
      "properties": {
          "attack_time": 714,
          "critical_strike_chance": 650,
          "physical_damage_max": 22,
          "physical_damage_min": 14,
          "range": 11
      },
      "implicits": [
          "ElementalDamagePercentImplicitSceptreNew4"
      ],
      "tags": [
          "sceptre",
          "sceptre",
          "one_hand_weapon",
          "onehand",
          "weapon",
          "default"
      ],
      "visualIdentity": {
          "ddsFile": "Art/2DItems/Weapons/OneHandWeapons/Scepters/scepter4.dds",
          "id": "Sceptre4"
      }
  },
  {
      "id": "Metadata/Items/Weapons/OneHandWeapons/OneHandMaces/Sceptre5",
      "name": "Iron Sceptre",
      "itemClass": "Sceptre",
      "dropLevel": 20,
      "inventoryWidth": 2,
      "inventoryHeight": 3,
      "requirements": {
          "level": 20,
          "strength": 38,
          "dexterity": 0,
          "intelligence": 38
      },
      "properties": {
          "attack_time": 714,
          "critical_strike_chance": 600,
          "physical_damage_max": 27,
          "physical_damage_min": 18,
          "range": 11
      },
      "implicits": [
          "ElementalDamagePercentImplicitSceptreNew5"
      ],
      "tags": [
          "sceptre",
          "sceptre",
          "one_hand_weapon",
          "onehand",
          "weapon",
          "default"
      ],
      "visualIdentity": {
          "ddsFile": "Art/2DItems/Weapons/OneHandWeapons/Scepters/scepter5.dds",
          "id": "Sceptre5"
      }
  },
  {
      "id": "Metadata/Items/Weapons/OneHandWeapons/OneHandMaces/Sceptre6",
      "name": "Ochre Sceptre",
      "itemClass": "Sceptre",
      "dropLevel": 24,
      "inventoryWidth": 2,
      "inventoryHeight": 3,
      "requirements": {
          "level": 24,
          "strength": 44,
          "dexterity": 0,
          "intelligence": 44
      },
      "properties": {
          "attack_time": 690,
          "critical_strike_chance": 600,
          "physical_damage_max": 31,
          "physical_damage_min": 17,
          "range": 11
      },
      "implicits": [
          "ElementalDamagePercentImplicitSceptreNew6"
      ],
      "tags": [
          "sceptre",
          "sceptre",
          "one_hand_weapon",
          "onehand",
          "weapon",
          "default"
      ],
      "visualIdentity": {
          "ddsFile": "Art/2DItems/Weapons/OneHandWeapons/Scepters/scepter6.dds",
          "id": "Sceptre6"
      }
  },
  {
      "id": "Metadata/Items/Weapons/OneHandWeapons/OneHandMaces/Sceptre7",
      "name": "Ritual Sceptre",
      "itemClass": "Sceptre",
      "dropLevel": 28,
      "inventoryWidth": 2,
      "inventoryHeight": 3,
      "requirements": {
          "level": 28,
          "strength": 51,
          "dexterity": 0,
          "intelligence": 51
      },
      "properties": {
          "attack_time": 833,
          "critical_strike_chance": 600,
          "physical_damage_max": 50,
          "physical_damage_min": 21,
          "range": 11
      },
      "implicits": [
          "ElementalDamagePercentImplicitSceptreNew7"
      ],
      "tags": [
          "sceptre",
          "sceptre",
          "one_hand_weapon",
          "onehand",
          "weapon",
          "default"
      ],
      "visualIdentity": {
          "ddsFile": "Art/2DItems/Weapons/OneHandWeapons/Scepters/scepter7.dds",
          "id": "Sceptre7"
      }
  },
  {
      "id": "Metadata/Items/Weapons/OneHandWeapons/OneHandMaces/Sceptre8",
      "name": "Shadow Sceptre",
      "itemClass": "Sceptre",
      "dropLevel": 32,
      "inventoryWidth": 2,
      "inventoryHeight": 3,
      "requirements": {
          "level": 32,
          "strength": 52,
          "dexterity": 0,
          "intelligence": 62
      },
      "properties": {
          "attack_time": 800,
          "critical_strike_chance": 620,
          "physical_damage_max": 44,
          "physical_damage_min": 29,
          "range": 11
      },
      "implicits": [
          "ElementalDamagePercentImplicitSceptreNew8"
      ],
      "tags": [
          "sceptre",
          "sceptre",
          "one_hand_weapon",
          "onehand",
          "weapon",
          "default"
      ],
      "visualIdentity": {
          "ddsFile": "Art/2DItems/Weapons/OneHandWeapons/Scepters/scepter8.dds",
          "id": "Sceptre8"
      }
  },
  {
      "id": "Metadata/Items/Weapons/OneHandWeapons/OneHandMaces/Sceptre9",
      "name": "Grinning Fetish",
      "itemClass": "Sceptre",
      "dropLevel": 35,
      "inventoryWidth": 2,
      "inventoryHeight": 3,
      "requirements": {
          "level": 35,
          "strength": 62,
          "dexterity": 0,
          "intelligence": 62
      },
      "properties": {
          "attack_time": 667,
          "critical_strike_chance": 600,
          "physical_damage_max": 36,
          "physical_damage_min": 24,
          "range": 11
      },
      "implicits": [
          "ElementalDamagePercentImplicitSceptreNew9"
      ],
      "tags": [
          "sceptre",
          "sceptre",
          "one_hand_weapon",
          "onehand",
          "weapon",
          "default"
      ],
      "visualIdentity": {
          "ddsFile": "Art/2DItems/Weapons/OneHandWeapons/Scepters/scepter2.dds",
          "id": "Sceptre2"
      }
  },
  {
      "id": "Metadata/Items/Weapons/OneHandWeapons/OneHandMaces/Sceptre10",
      "name": "Sekhem",
      "itemClass": "Sceptre",
      "dropLevel": 38,
      "inventoryWidth": 2,
      "inventoryHeight": 3,
      "requirements": {
          "level": 38,
          "strength": 67,
          "dexterity": 0,
          "intelligence": 67
      },
      "properties": {
          "attack_time": 800,
          "critical_strike_chance": 600,
          "physical_damage_max": 55,
          "physical_damage_min": 30,
          "range": 11
      },
      "implicits": [
          "ElementalDamagePercentImplicitSceptreNew10"
      ],
      "tags": [
          "sceptre",
          "sceptre",
          "one_hand_weapon",
          "onehand",
          "weapon",
          "default"
      ],
      "visualIdentity": {
          "ddsFile": "Art/2DItems/Weapons/OneHandWeapons/Scepters/scepter3.dds",
          "id": "Sceptre3"
      }
  },
  {
      "id": "Metadata/Items/Weapons/OneHandWeapons/OneHandMaces/Sceptre11",
      "name": "Crystal Sceptre",
      "itemClass": "Sceptre",
      "dropLevel": 41,
      "inventoryWidth": 2,
      "inventoryHeight": 3,
      "requirements": {
          "level": 41,
          "strength": 59,
          "dexterity": 0,
          "intelligence": 85
      },
      "properties": {
          "attack_time": 800,
          "critical_strike_chance": 650,
          "physical_damage_max": 52,
          "physical_damage_min": 35,
          "range": 11
      },
      "implicits": [
          "ElementalDamagePercentImplicitSceptreNew11"
      ],
      "tags": [
          "sceptre",
          "sceptre",
          "one_hand_weapon",
          "onehand",
          "weapon",
          "default"
      ],
      "visualIdentity": {
          "ddsFile": "Art/2DItems/Weapons/OneHandWeapons/Scepters/scepter4.dds",
          "id": "Sceptre4"
      }
  },
  {
      "id": "Metadata/Items/Weapons/OneHandWeapons/OneHandMaces/Sceptre12",
      "name": "Lead Sceptre",
      "itemClass": "Sceptre",
      "dropLevel": 44,
      "inventoryWidth": 2,
      "inventoryHeight": 3,
      "requirements": {
          "level": 44,
          "strength": 77,
          "dexterity": 0,
          "intelligence": 77
      },
      "properties": {
          "attack_time": 800,
          "critical_strike_chance": 600,
          "physical_damage_max": 57,
          "physical_damage_min": 38,
          "range": 11
      },
      "implicits": [
          "ElementalDamagePercentImplicitSceptreNew12___"
      ],
      "tags": [
          "sceptre",
          "sceptre",
          "one_hand_weapon",
          "onehand",
          "weapon",
          "default"
      ],
      "visualIdentity": {
          "ddsFile": "Art/2DItems/Weapons/OneHandWeapons/Scepters/scepter5.dds",
          "id": "Sceptre5"
      }
  },
  {
      "id": "Metadata/Items/Weapons/OneHandWeapons/OneHandMaces/Sceptre13",
      "name": "Blood Sceptre",
      "itemClass": "Sceptre",
      "dropLevel": 47,
      "inventoryWidth": 2,
      "inventoryHeight": 3,
      "requirements": {
          "level": 47,
          "strength": 81,
          "dexterity": 0,
          "intelligence": 81
      },
      "properties": {
          "attack_time": 714,
          "critical_strike_chance": 600,
          "physical_damage_max": 55,
          "physical_damage_min": 30,
          "range": 11
      },
      "implicits": [
          "ElementalDamagePercentImplicitSceptreNew13"
      ],
      "tags": [
          "sceptre",
          "sceptre",
          "one_hand_weapon",
          "onehand",
          "weapon",
          "default"
      ],
      "visualIdentity": {
          "ddsFile": "Art/2DItems/Weapons/OneHandWeapons/Scepters/scepter6.dds",
          "id": "Sceptre6"
      }
  },
  {
      "id": "Metadata/Items/Weapons/OneHandWeapons/OneHandMaces/Sceptre14",
      "name": "Royal Sceptre",
      "itemClass": "Sceptre",
      "dropLevel": 50,
      "inventoryWidth": 2,
      "inventoryHeight": 3,
      "requirements": {
          "level": 50,
          "strength": 86,
          "dexterity": 0,
          "intelligence": 86
      },
      "properties": {
          "attack_time": 833,
          "critical_strike_chance": 600,
          "physical_damage_max": 80,
          "physical_damage_min": 34,
          "range": 11
      },
      "implicits": [
          "ElementalDamagePercentImplicitSceptreNew14"
      ],
      "tags": [
          "sceptre",
          "sceptre",
          "one_hand_weapon",
          "onehand",
          "weapon",
          "default"
      ],
      "visualIdentity": {
          "ddsFile": "Art/2DItems/Weapons/OneHandWeapons/Scepters/scepter7.dds",
          "id": "Sceptre7"
      }
  },
  {
      "id": "Metadata/Items/Weapons/OneHandWeapons/OneHandMaces/Sceptre15",
      "name": "Abyssal Sceptre",
      "itemClass": "Sceptre",
      "dropLevel": 53,
      "inventoryWidth": 2,
      "inventoryHeight": 3,
      "requirements": {
          "level": 53,
          "strength": 83,
          "dexterity": 0,
          "intelligence": 99
      },
      "properties": {
          "attack_time": 800,
          "critical_strike_chance": 620,
          "physical_damage_max": 67,
          "physical_damage_min": 45,
          "range": 11
      },
      "implicits": [
          "ElementalDamagePercentImplicitSceptreNew15"
      ],
      "tags": [
          "sceptre",
          "sceptre",
          "one_hand_weapon",
          "onehand",
          "weapon",
          "default"
      ],
      "visualIdentity": {
          "ddsFile": "Art/2DItems/Weapons/OneHandWeapons/Scepters/scepter8.dds",
          "id": "Sceptre8"
      }
  },
  {
      "id": "Metadata/Items/Weapons/OneHandWeapons/OneHandMaces/Sceptre16",
      "name": "Karui Sceptre",
      "itemClass": "Sceptre",
      "dropLevel": 56,
      "inventoryWidth": 2,
      "inventoryHeight": 3,
      "requirements": {
          "level": 56,
          "strength": 96,
          "dexterity": 0,
          "intelligence": 96
      },
      "properties": {
          "attack_time": 667,
          "critical_strike_chance": 600,
          "physical_damage_max": 55,
          "physical_damage_min": 37,
          "range": 11
      },
      "implicits": [
          "ElementalDamagePercentImplicitSceptreNew16"
      ],
      "tags": [
          "sceptre",
          "sceptre",
          "one_hand_weapon",
          "onehand",
          "weapon",
          "default"
      ],
      "visualIdentity": {
          "ddsFile": "Art/2DItems/Weapons/OneHandWeapons/Scepters/scepter2.dds",
          "id": "Sceptre2"
      }
  },
  {
      "id": "Metadata/Items/Weapons/OneHandWeapons/OneHandMaces/Sceptre17",
      "name": "Tyrant's Sekhem",
      "itemClass": "Sceptre",
      "dropLevel": 58,
      "inventoryWidth": 2,
      "inventoryHeight": 3,
      "requirements": {
          "level": 58,
          "strength": 99,
          "dexterity": 0,
          "intelligence": 99
      },
      "properties": {
          "attack_time": 800,
          "critical_strike_chance": 600,
          "physical_damage_max": 80,
          "physical_damage_min": 43,
          "range": 11
      },
      "implicits": [
          "ElementalDamagePercentImplicitSceptreNew17"
      ],
      "tags": [
          "sceptre",
          "sceptre",
          "one_hand_weapon",
          "onehand",
          "weapon",
          "default"
      ],
      "visualIdentity": {
          "ddsFile": "Art/2DItems/Weapons/OneHandWeapons/Scepters/scepter3.dds",
          "id": "Sceptre3"
      }
  },
  {
      "id": "Metadata/Items/Weapons/OneHandWeapons/OneHandMaces/Sceptre18",
      "name": "Opal Sceptre",
      "itemClass": "Sceptre",
      "dropLevel": 60,
      "inventoryWidth": 2,
      "inventoryHeight": 3,
      "requirements": {
          "level": 60,
          "strength": 95,
          "dexterity": 0,
          "intelligence": 131
      },
      "properties": {
          "attack_time": 800,
          "critical_strike_chance": 650,
          "physical_damage_max": 73,
          "physical_damage_min": 49,
          "range": 11
      },
      "implicits": [
          "ElementalDamagePercentImplicitSceptreNew18"
      ],
      "tags": [
          "sceptre",
          "sceptre",
          "one_hand_weapon",
          "onehand",
          "weapon",
          "default"
      ],
      "visualIdentity": {
          "ddsFile": "Art/2DItems/Weapons/OneHandWeapons/Scepters/scepter4.dds",
          "id": "Sceptre4"
      }
  },
  {
      "id": "Metadata/Items/Weapons/OneHandWeapons/OneHandMaces/Sceptre19",
      "name": "Platinum Sceptre",
      "itemClass": "Sceptre",
      "dropLevel": 62,
      "inventoryWidth": 2,
      "inventoryHeight": 3,
      "requirements": {
          "level": 62,
          "strength": 113,
          "dexterity": 0,
          "intelligence": 113
      },
      "properties": {
          "attack_time": 800,
          "critical_strike_chance": 600,
          "physical_damage_max": 76,
          "physical_damage_min": 51,
          "range": 11
      },
      "implicits": [
          "ElementalDamagePercentImplicitSceptreNew19"
      ],
      "tags": [
          "sceptre",
          "sceptre",
          "one_hand_weapon",
          "onehand",
          "weapon",
          "default"
      ],
      "visualIdentity": {
          "ddsFile": "Art/2DItems/Weapons/OneHandWeapons/Scepters/scepter5.dds",
          "id": "Sceptre5"
      }
  },
  {
      "id": "Metadata/Items/Weapons/OneHandWeapons/OneHandMaces/Sceptre20",
      "name": "Vaal Sceptre",
      "itemClass": "Sceptre",
      "dropLevel": 64,
      "inventoryWidth": 2,
      "inventoryHeight": 3,
      "requirements": {
          "level": 64,
          "strength": 113,
          "dexterity": 0,
          "intelligence": 113
      },
      "properties": {
          "attack_time": 714,
          "critical_strike_chance": 600,
          "physical_damage_max": 70,
          "physical_damage_min": 37,
          "range": 11
      },
      "implicits": [
          "ElementalDamagePercentImplicitSceptreNew20"
      ],
      "tags": [
          "sceptre",
          "sceptre",
          "one_hand_weapon",
          "onehand",
          "weapon",
          "default"
      ],
      "visualIdentity": {
          "ddsFile": "Art/2DItems/Weapons/OneHandWeapons/Scepters/scepter6.dds",
          "id": "Sceptre6"
      }
  },
  {
      "id": "Metadata/Items/Weapons/OneHandWeapons/OneHandMaces/Sceptre21",
      "name": "Carnal Sceptre",
      "itemClass": "Sceptre",
      "dropLevel": 66,
      "inventoryWidth": 2,
      "inventoryHeight": 3,
      "requirements": {
          "level": 66,
          "strength": 113,
          "dexterity": 0,
          "intelligence": 113
      },
      "properties": {
          "attack_time": 833,
          "critical_strike_chance": 600,
          "physical_damage_max": 95,
          "physical_damage_min": 41,
          "range": 11
      },
      "implicits": [
          "ElementalDamagePercentImplicitSceptreNew21__"
      ],
      "tags": [
          "sceptre",
          "sceptre",
          "one_hand_weapon",
          "onehand",
          "weapon",
          "default"
      ],
      "visualIdentity": {
          "ddsFile": "Art/2DItems/Weapons/OneHandWeapons/Scepters/scepter7.dds",
          "id": "Sceptre7"
      }
  },
  {
      "id": "Metadata/Items/Weapons/OneHandWeapons/OneHandMaces/Sceptre22",
      "name": "Void Sceptre",
      "itemClass": "Sceptre",
      "dropLevel": 68,
      "inventoryWidth": 2,
      "inventoryHeight": 3,
      "requirements": {
          "level": 68,
          "strength": 104,
          "dexterity": 0,
          "intelligence": 122
      },
      "properties": {
          "attack_time": 800,
          "critical_strike_chance": 620,
          "physical_damage_max": 76,
          "physical_damage_min": 50,
          "range": 11
      },
      "implicits": [
          "ElementalDamagePercentImplicitSceptreNew22"
      ],
      "tags": [
          "sceptre",
          "sceptre",
          "one_hand_weapon",
          "onehand",
          "weapon",
          "default"
      ],
      "visualIdentity": {
          "ddsFile": "Art/2DItems/Weapons/OneHandWeapons/Scepters/scepter8.dds",
          "id": "Sceptre8"
      }
  },
];

// Shield (88 items)
export const SHIELD_BASES: PoeBaseItem[] = [
  {
      "id": "Metadata/Items/Armours/Shields/ShieldStr1",
      "name": "Splintered Tower Shield",
      "itemClass": "Shield",
      "dropLevel": 1,
      "inventoryWidth": 2,
      "inventoryHeight": 4,
      "requirements": {
          "level": 1,
          "strength": 11,
          "dexterity": 0,
          "intelligence": 0
      },
      "properties": {
          "armour": {
              "max": 12,
              "min": 9
          },
          "block": 24,
          "movement_speed": -3
      },
      "implicits": [],
      "tags": [
          "str_armour",
          "str_shield",
          "shield",
          "armour",
          "default"
      ],
      "visualIdentity": {
          "ddsFile": "Art/2DItems/Armours/Shields/ShieldStr1.dds",
          "id": "ShieldStr1"
      }
  },
  {
      "id": "Metadata/Items/Armours/Shields/ShieldDex1",
      "name": "Goathide Buckler",
      "itemClass": "Shield",
      "dropLevel": 2,
      "inventoryWidth": 2,
      "inventoryHeight": 2,
      "requirements": {
          "level": 2,
          "strength": 0,
          "dexterity": 13,
          "intelligence": 0
      },
      "properties": {
          "block": 25,
          "evasion": {
              "max": 20,
              "min": 14
          },
          "movement_speed": -3
      },
      "implicits": [
          "MovementVelocityImplicitShield1"
      ],
      "tags": [
          "dex_armour",
          "dex_shield",
          "shield",
          "armour",
          "default"
      ],
      "visualIdentity": {
          "ddsFile": "Art/2DItems/Armours/Shields/ShieldDex1.dds",
          "id": "ShieldDex1"
      }
  },
  {
      "id": "Metadata/Items/Armours/Shields/ShieldInt1",
      "name": "Twig Spirit Shield",
      "itemClass": "Shield",
      "dropLevel": 3,
      "inventoryWidth": 2,
      "inventoryHeight": 2,
      "requirements": {
          "level": 3,
          "strength": 0,
          "dexterity": 0,
          "intelligence": 15
      },
      "properties": {
          "block": 22,
          "energy_shield": {
              "max": 8,
              "min": 6
          },
          "movement_speed": -3
      },
      "implicits": [
          "SpellDamageImplicitShield2"
      ],
      "tags": [
          "int_armour",
          "focus",
          "shield",
          "armour",
          "default"
      ],
      "visualIdentity": {
          "ddsFile": "Art/2DItems/Armours/Shields/ShieldInt1.dds",
          "id": "ShieldInt1"
      }
  },
  {
      "id": "Metadata/Items/Armours/Shields/ShieldDexInt1",
      "name": "Spiked Bundle",
      "itemClass": "Shield",
      "dropLevel": 5,
      "inventoryWidth": 2,
      "inventoryHeight": 2,
      "requirements": {
          "level": 5,
          "strength": 0,
          "dexterity": 11,
          "intelligence": 11
      },
      "properties": {
          "block": 24,
          "energy_shield": {
              "max": 6,
              "min": 4
          },
          "evasion": {
              "max": 18,
              "min": 13
          },
          "movement_speed": -3
      },
      "implicits": [
          "ChanceToDodgeImplicitShield1"
      ],
      "tags": [
          "dex_int_armour",
          "dex_int_shield",
          "shield",
          "armour",
          "default"
      ],
      "visualIdentity": {
          "ddsFile": "Art/2DItems/Armours/Shields/ShieldDexInt1.dds",
          "id": "ShieldDexInt1"
      }
  },
  {
      "id": "Metadata/Items/Armours/Shields/ShieldStr2",
      "name": "Corroded Tower Shield",
      "itemClass": "Shield",
      "dropLevel": 5,
      "inventoryWidth": 2,
      "inventoryHeight": 4,
      "requirements": {
          "level": 5,
          "strength": 20,
          "dexterity": 0,
          "intelligence": 0
      },
      "properties": {
          "armour": {
              "max": 47,
              "min": 36
          },
          "block": 23,
          "movement_speed": -3
      },
      "implicits": [
          "IncreasedLifeImplicitShield1"
      ],
      "tags": [
          "str_armour",
          "str_shield",
          "shield",
          "armour",
          "default"
      ],
      "visualIdentity": {
          "ddsFile": "Art/2DItems/Armours/Shields/ShieldStr2.dds",
          "id": "ShieldStr2"
      }
  },
  {
      "id": "Metadata/Items/Armours/Shields/ShieldStrDex1",
      "name": "Rotted Round Shield",
      "itemClass": "Shield",
      "dropLevel": 5,
      "inventoryWidth": 2,
      "inventoryHeight": 3,
      "requirements": {
          "level": 5,
          "strength": 11,
          "dexterity": 11,
          "intelligence": 0
      },
      "properties": {
          "armour": {
              "max": 18,
              "min": 13
          },
          "block": 24,
          "evasion": {
              "max": 18,
              "min": 13
          },
          "movement_speed": -3
      },
      "implicits": [
          "BlockRecoveryImplicitShield1"
      ],
      "tags": [
          "str_dex_armour",
          "str_dex_shield",
          "shield",
          "armour",
          "default"
      ],
      "visualIdentity": {
          "ddsFile": "Art/2DItems/Armours/Shields/ShieldStrDex1.dds",
          "id": "ShieldStrDex1"
      }
  },
  {
      "id": "Metadata/Items/Armours/Shields/ShieldStrInt1",
      "name": "Plank Kite Shield",
      "itemClass": "Shield",
      "dropLevel": 7,
      "inventoryWidth": 2,
      "inventoryHeight": 3,
      "requirements": {
          "level": 7,
          "strength": 13,
          "dexterity": 0,
          "intelligence": 13
      },
      "properties": {
          "armour": {
              "max": 25,
              "min": 18
          },
          "block": 22,
          "energy_shield": {
              "max": 7,
              "min": 5
          },
          "movement_speed": -3
      },
      "implicits": [
          "AllResistancesImplicitShield1"
      ],
      "tags": [
          "str_int_armour",
          "str_int_shield",
          "shield",
          "armour",
          "default"
      ],
      "visualIdentity": {
          "ddsFile": "Art/2DItems/Armours/Shields/ShieldStrInt1.dds",
          "id": "ShieldStrInt1"
      }
  },
  {
      "id": "Metadata/Items/Armours/Shields/ShieldDex2",
      "name": "Pine Buckler",
      "itemClass": "Shield",
      "dropLevel": 8,
      "inventoryWidth": 2,
      "inventoryHeight": 2,
      "requirements": {
          "level": 8,
          "strength": 0,
          "dexterity": 26,
          "intelligence": 0
      },
      "properties": {
          "block": 26,
          "evasion": {
              "max": 66,
              "min": 51
          },
          "movement_speed": -3
      },
      "implicits": [
          "MovementVelocityImplicitShield1"
      ],
      "tags": [
          "dex_armour",
          "dex_shield",
          "shield",
          "armour",
          "default"
      ],
      "visualIdentity": {
          "ddsFile": "Art/2DItems/Armours/Shields/ShieldDex2.dds",
          "id": "ShieldDex2"
      }
  },
  {
      "id": "Metadata/Items/Armours/Shields/ShieldInt2",
      "name": "Yew Spirit Shield",
      "itemClass": "Shield",
      "dropLevel": 9,
      "inventoryWidth": 2,
      "inventoryHeight": 2,
      "requirements": {
          "level": 9,
          "strength": 0,
          "dexterity": 0,
          "intelligence": 29
      },
      "properties": {
          "block": 24,
          "energy_shield": {
              "max": 14,
              "min": 11
          },
          "movement_speed": -3
      },
      "implicits": [
          "SpellDamageImplicitShield1"
      ],
      "tags": [
          "int_armour",
          "focus",
          "shield",
          "armour",
          "default"
      ],
      "visualIdentity": {
          "ddsFile": "Art/2DItems/Armours/Shields/ShieldInt2.dds",
          "id": "ShieldInt2"
      }
  },
  {
      "id": "Metadata/Items/Armours/Shields/ShieldStr3",
      "name": "Rawhide Tower Shield",
      "itemClass": "Shield",
      "dropLevel": 11,
      "inventoryWidth": 2,
      "inventoryHeight": 4,
      "requirements": {
          "level": 11,
          "strength": 33,
          "dexterity": 0,
          "intelligence": 0
      },
      "properties": {
          "armour": {
              "max": 66,
              "min": 53
          },
          "block": 26,
          "movement_speed": -3
      },
      "implicits": [
          "IncreasedLifeImplicitShield1"
      ],
      "tags": [
          "str_armour",
          "str_shield",
          "shield",
          "armour",
          "default"
      ],
      "visualIdentity": {
          "ddsFile": "Art/2DItems/Armours/Shields/ShieldStr3.dds",
          "id": "ShieldStr3"
      }
  },
  {
      "id": "Metadata/Items/Armours/Shields/ShieldDexInt2",
      "name": "Driftwood Spiked Shield",
      "itemClass": "Shield",
      "dropLevel": 12,
      "inventoryWidth": 2,
      "inventoryHeight": 2,
      "requirements": {
          "level": 12,
          "strength": 0,
          "dexterity": 19,
          "intelligence": 19
      },
      "properties": {
          "block": 24,
          "energy_shield": {
              "max": 15,
              "min": 11
          },
          "evasion": {
              "max": 60,
              "min": 46
          },
          "movement_speed": -3
      },
      "implicits": [
          "ChanceToDodgeImplicitShield1"
      ],
      "tags": [
          "dex_int_armour",
          "dex_int_shield",
          "shield",
          "armour",
          "default"
      ],
      "visualIdentity": {
          "ddsFile": "Art/2DItems/Armours/Shields/ShieldDexInt2.dds",
          "id": "ShieldDexInt2"
      }
  },
  {
      "id": "Metadata/Items/Armours/Shields/ShieldStrDex2",
      "name": "Fir Round Shield",
      "itemClass": "Shield",
      "dropLevel": 12,
      "inventoryWidth": 2,
      "inventoryHeight": 3,
      "requirements": {
          "level": 12,
          "strength": 19,
          "dexterity": 19,
          "intelligence": 0
      },
      "properties": {
          "armour": {
              "max": 37,
              "min": 29
          },
          "block": 24,
          "evasion": {
              "max": 37,
              "min": 29
          },
          "movement_speed": -3
      },
      "implicits": [
          "BlockRecoveryImplicitShield3"
      ],
      "tags": [
          "str_dex_armour",
          "str_dex_shield",
          "shield",
          "armour",
          "default"
      ],
      "visualIdentity": {
          "ddsFile": "Art/2DItems/Armours/Shields/ShieldStrDex2.dds",
          "id": "ShieldStrDex2"
      }
  },
  {
      "id": "Metadata/Items/Armours/Shields/ShieldStrInt2",
      "name": "Linden Kite Shield",
      "itemClass": "Shield",
      "dropLevel": 13,
      "inventoryWidth": 2,
      "inventoryHeight": 3,
      "requirements": {
          "level": 13,
          "strength": 20,
          "dexterity": 0,
          "intelligence": 20
      },
      "properties": {
          "armour": {
              "max": 56,
              "min": 43
          },
          "block": 24,
          "energy_shield": {
              "max": 14,
              "min": 11
          },
          "movement_speed": -3
      },
      "implicits": [
          "AllResistancesImplicitShield1"
      ],
      "tags": [
          "str_int_armour",
          "str_int_shield",
          "shield",
          "armour",
          "default"
      ],
      "visualIdentity": {
          "ddsFile": "Art/2DItems/Armours/Shields/ShieldStrInt2.dds",
          "id": "ShieldStrInt2"
      }
  },
  {
      "id": "Metadata/Items/Armours/Shields/ShieldInt3",
      "name": "Bone Spirit Shield",
      "itemClass": "Shield",
      "dropLevel": 15,
      "inventoryWidth": 2,
      "inventoryHeight": 2,
      "requirements": {
          "level": 15,
          "strength": 0,
          "dexterity": 0,
          "intelligence": 42
      },
      "properties": {
          "block": 22,
          "energy_shield": {
              "max": 19,
              "min": 15
          },
          "movement_speed": -3
      },
      "implicits": [
          "MinionDamageImplicitShield1"
      ],
      "tags": [
          "int_armour",
          "focus",
          "focus_can_roll_minion_modifiers",
          "shield",
          "armour",
          "default"
      ],
      "visualIdentity": {
          "ddsFile": "Art/2DItems/Armours/Shields/ShieldInt3.dds",
          "id": "ShieldInt3"
      }
  },
  {
      "id": "Metadata/Items/Armours/Shields/ShieldDex3",
      "name": "Painted Buckler",
      "itemClass": "Shield",
      "dropLevel": 16,
      "inventoryWidth": 2,
      "inventoryHeight": 2,
      "requirements": {
          "level": 16,
          "strength": 0,
          "dexterity": 44,
          "intelligence": 0
      },
      "properties": {
          "block": 24,
          "evasion": {
              "max": 154,
              "min": 123
          },
          "movement_speed": -3
      },
      "implicits": [
          "MovementVelocityImplicitShield2"
      ],
      "tags": [
          "dex_armour",
          "dex_shield",
          "shield",
          "armour",
          "default"
      ],
      "visualIdentity": {
          "ddsFile": "Art/2DItems/Armours/Shields/ShieldDex3.dds",
          "id": "ShieldDex3"
      }
  },
  {
      "id": "Metadata/Items/Armours/Shields/ShieldStr4",
      "name": "Cedar Tower Shield",
      "itemClass": "Shield",
      "dropLevel": 17,
      "inventoryWidth": 2,
      "inventoryHeight": 4,
      "requirements": {
          "level": 17,
          "strength": 47,
          "dexterity": 0,
          "intelligence": 0
      },
      "properties": {
          "armour": {
              "max": 113,
              "min": 94
          },
          "block": 25,
          "movement_speed": -3
      },
      "implicits": [
          "IncreasedLifeImplicitShield2"
      ],
      "tags": [
          "str_armour",
          "str_shield",
          "shield",
          "armour",
          "default"
      ],
      "visualIdentity": {
          "ddsFile": "Art/2DItems/Armours/Shields/ShieldStr4.dds",
          "id": "ShieldStr4"
      }
  },
  {
      "id": "Metadata/Items/Armours/Shields/ShieldDexInt3",
      "name": "Alloyed Spiked Shield",
      "itemClass": "Shield",
      "dropLevel": 20,
      "inventoryWidth": 2,
      "inventoryHeight": 2,
      "requirements": {
          "level": 20,
          "strength": 0,
          "dexterity": 29,
          "intelligence": 29
      },
      "properties": {
          "block": 25,
          "energy_shield": {
              "max": 16,
              "min": 13
          },
          "evasion": {
              "max": 70,
              "min": 56
          },
          "movement_speed": -3
      },
      "implicits": [
          "ChanceToDodgeSpellsImplicitShield1"
      ],
      "tags": [
          "dex_int_armour",
          "dex_int_shield",
          "shield",
          "armour",
          "default"
      ],
      "visualIdentity": {
          "ddsFile": "Art/2DItems/Armours/Shields/ShieldDexInt3.dds",
          "id": "ShieldDexInt3"
      }
  },
  {
      "id": "Metadata/Items/Armours/Shields/ShieldStrDex3",
      "name": "Studded Round Shield",
      "itemClass": "Shield",
      "dropLevel": 20,
      "inventoryWidth": 2,
      "inventoryHeight": 3,
      "requirements": {
          "level": 20,
          "strength": 29,
          "dexterity": 29,
          "intelligence": 0
      },
      "properties": {
          "armour": {
              "max": 58,
              "min": 46
          },
          "block": 27,
          "evasion": {
              "max": 58,
              "min": 46
          },
          "movement_speed": -3
      },
      "implicits": [
          "BlockRecoveryImplicitShield1"
      ],
      "tags": [
          "str_dex_armour",
          "str_dex_shield",
          "shield",
          "armour",
          "default"
      ],
      "visualIdentity": {
          "ddsFile": "Art/2DItems/Armours/Shields/ShieldStrDex3.dds",
          "id": "ShieldStrDex3"
      }
  },
  {
      "id": "Metadata/Items/Armours/Shields/ShieldStrInt3",
      "name": "Reinforced Kite Shield",
      "itemClass": "Shield",
      "dropLevel": 20,
      "inventoryWidth": 2,
      "inventoryHeight": 3,
      "requirements": {
          "level": 20,
          "strength": 29,
          "dexterity": 0,
          "intelligence": 29
      },
      "properties": {
          "armour": {
              "max": 81,
              "min": 65
          },
          "block": 26,
          "energy_shield": {
              "max": 18,
              "min": 15
          },
          "movement_speed": -3
      },
      "implicits": [],
      "tags": [
          "str_int_armour",
          "str_int_shield",
          "shield",
          "armour",
          "default"
      ],
      "visualIdentity": {
          "ddsFile": "Art/2DItems/Armours/Shields/ShieldStrInt4.dds",
          "id": "ShieldStrInt3"
      }
  },
  {
      "id": "Metadata/Items/Armours/Shields/ShieldDex4",
      "name": "Hammered Buckler",
      "itemClass": "Shield",
      "dropLevel": 23,
      "inventoryWidth": 2,
      "inventoryHeight": 2,
      "requirements": {
          "level": 23,
          "strength": 0,
          "dexterity": 60,
          "intelligence": 0
      },
      "properties": {
          "block": 27,
          "evasion": {
              "max": 139,
              "min": 116
          },
          "movement_speed": -3
      },
      "implicits": [
          "MovementVelocityImplicitShield1"
      ],
      "tags": [
          "dex_armour",
          "dex_shield",
          "shield",
          "armour",
          "default"
      ],
      "visualIdentity": {
          "ddsFile": "Art/2DItems/Armours/Shields/ShieldDex4.dds",
          "id": "ShieldDex4"
      }
  },
  {
      "id": "Metadata/Items/Armours/Shields/ShieldInt4",
      "name": "Tarnished Spirit Shield",
      "itemClass": "Shield",
      "dropLevel": 23,
      "inventoryWidth": 2,
      "inventoryHeight": 2,
      "requirements": {
          "level": 23,
          "strength": 0,
          "dexterity": 0,
          "intelligence": 60
      },
      "properties": {
          "block": 24,
          "energy_shield": {
              "max": 25,
              "min": 21
          },
          "movement_speed": -3
      },
      "implicits": [
          "SpellDamageImplicitShield1"
      ],
      "tags": [
          "int_armour",
          "focus",
          "shield",
          "armour",
          "default"
      ],
      "visualIdentity": {
          "ddsFile": "Art/2DItems/Armours/Shields/ShieldInt4.dds",
          "id": "ShieldInt4"
      }
  },
  {
      "id": "Metadata/Items/Armours/Shields/ShieldStr5",
      "name": "Copper Tower Shield",
      "itemClass": "Shield",
      "dropLevel": 24,
      "inventoryWidth": 2,
      "inventoryHeight": 4,
      "requirements": {
          "level": 24,
          "strength": 62,
          "dexterity": 0,
          "intelligence": 0
      },
      "properties": {
          "armour": {
              "max": 173,
              "min": 151
          },
          "block": 24,
          "movement_speed": -3
      },
      "implicits": [
          "IncreasedLifeImplicitShield3"
      ],
      "tags": [
          "str_armour",
          "str_shield",
          "shield",
          "armour",
          "default"
      ],
      "visualIdentity": {
          "ddsFile": "Art/2DItems/Armours/Shields/ShieldStr5.dds",
          "id": "ShieldStr5"
      }
  },
  {
      "id": "Metadata/Items/Armours/Shields/ShieldDexInt4",
      "name": "Burnished Spiked Shield",
      "itemClass": "Shield",
      "dropLevel": 27,
      "inventoryWidth": 2,
      "inventoryHeight": 2,
      "requirements": {
          "level": 27,
          "strength": 0,
          "dexterity": 37,
          "intelligence": 37
      },
      "properties": {
          "block": 26,
          "energy_shield": {
              "max": 16,
              "min": 13
          },
          "evasion": {
              "max": 73,
              "min": 62
          },
          "movement_speed": -3
      },
      "implicits": [
          "ChanceToDodgeImplicitShield2"
      ],
      "tags": [
          "dex_int_armour",
          "dex_int_shield",
          "shield",
          "armour",
          "default"
      ],
      "visualIdentity": {
          "ddsFile": "Art/2DItems/Armours/Shields/ShieldDexInt4.dds",
          "id": "ShieldDexInt4"
      }
  },
  {
      "id": "Metadata/Items/Armours/Shields/ShieldStrDex4",
      "name": "Scarlet Round Shield",
      "itemClass": "Shield",
      "dropLevel": 27,
      "inventoryWidth": 2,
      "inventoryHeight": 3,
      "requirements": {
          "level": 27,
          "strength": 37,
          "dexterity": 37,
          "intelligence": 0
      },
      "properties": {
          "armour": {
              "max": 100,
              "min": 87
          },
          "block": 26,
          "evasion": {
              "max": 100,
              "min": 87
          },
          "movement_speed": -3
      },
      "implicits": [],
      "tags": [
          "str_dex_armour",
          "str_dex_shield",
          "shield",
          "armour",
          "default"
      ],
      "visualIdentity": {
          "ddsFile": "Art/2DItems/Armours/Shields/ShieldStrDex4.dds",
          "id": "ShieldStrDex4"
      }
  },
  {
      "id": "Metadata/Items/Armours/Shields/ShieldStrInt4",
      "name": "Layered Kite Shield",
      "itemClass": "Shield",
      "dropLevel": 27,
      "inventoryWidth": 2,
      "inventoryHeight": 3,
      "requirements": {
          "level": 27,
          "strength": 37,
          "dexterity": 0,
          "intelligence": 37
      },
      "properties": {
          "armour": {
              "max": 73,
              "min": 62
          },
          "block": 24,
          "energy_shield": {
              "max": 16,
              "min": 13
          },
          "movement_speed": -3
      },
      "implicits": [
          "AllResistancesImplicitShield2"
      ],
      "tags": [
          "str_int_armour",
          "str_int_shield",
          "shield",
          "armour",
          "default"
      ],
      "visualIdentity": {
          "ddsFile": "Art/2DItems/Armours/Shields/ShieldStrInt3.dds",
          "id": "ShieldStrInt4"
      }
  },
  {
      "id": "Metadata/Items/Armours/Shields/ShieldInt5",
      "name": "Jingling Spirit Shield",
      "itemClass": "Shield",
      "dropLevel": 28,
      "inventoryWidth": 2,
      "inventoryHeight": 2,
      "requirements": {
          "level": 28,
          "strength": 0,
          "dexterity": 0,
          "intelligence": 71
      },
      "properties": {
          "block": 23,
          "energy_shield": {
              "max": 29,
              "min": 25
          },
          "movement_speed": -3
      },
      "implicits": [
          "SpellDamageImplicitShield2"
      ],
      "tags": [
          "int_armour",
          "focus",
          "shield",
          "armour",
          "default"
      ],
      "visualIdentity": {
          "ddsFile": "Art/2DItems/Armours/Shields/ShieldInt5.dds",
          "id": "ShieldInt5"
      }
  },
  {
      "id": "Metadata/Items/Armours/Shields/ShieldDex5",
      "name": "War Buckler",
      "itemClass": "Shield",
      "dropLevel": 29,
      "inventoryWidth": 2,
      "inventoryHeight": 2,
      "requirements": {
          "level": 29,
          "strength": 0,
          "dexterity": 74,
          "intelligence": 0
      },
      "properties": {
          "block": 26,
          "evasion": {
              "max": 194,
              "min": 169
          },
          "movement_speed": -3
      },
      "implicits": [
          "MovementVelocityImplicitShield3"
      ],
      "tags": [
          "dex_armour",
          "dex_shield",
          "shield",
          "armour",
          "default"
      ],
      "visualIdentity": {
          "ddsFile": "Art/2DItems/Armours/Shields/ShieldDex5.dds",
          "id": "ShieldDex5"
      }
  },
  {
      "id": "Metadata/Items/Armours/Shields/ShieldStr6",
      "name": "Reinforced Tower Shield",
      "itemClass": "Shield",
      "dropLevel": 30,
      "inventoryWidth": 2,
      "inventoryHeight": 4,
      "requirements": {
          "level": 30,
          "strength": 76,
          "dexterity": 0,
          "intelligence": 0
      },
      "properties": {
          "armour": {
              "max": 260,
              "min": 237
          },
          "block": 23,
          "movement_speed": -3
      },
      "implicits": [
          "IncreasedLifeImplicitShield1"
      ],
      "tags": [
          "str_armour",
          "str_shield",
          "shield",
          "armour",
          "default"
      ],
      "visualIdentity": {
          "ddsFile": "Art/2DItems/Armours/Shields/ShieldStr6.dds",
          "id": "ShieldStr6"
      }
  },
  {
      "id": "Metadata/Items/Armours/Shields/ShieldDexInt5",
      "name": "Ornate Spiked Shield",
      "itemClass": "Shield",
      "dropLevel": 33,
      "inventoryWidth": 2,
      "inventoryHeight": 2,
      "requirements": {
          "level": 33,
          "strength": 0,
          "dexterity": 44,
          "intelligence": 44
      },
      "properties": {
          "block": 24,
          "energy_shield": {
              "max": 29,
              "min": 26
          },
          "evasion": {
              "max": 135,
              "min": 120
          },
          "movement_speed": -3
      },
      "implicits": [
          "ChanceToDodgeSpellsImplicitShield2"
      ],
      "tags": [
          "dex_int_armour",
          "dex_int_shield",
          "shield",
          "armour",
          "default"
      ],
      "visualIdentity": {
          "ddsFile": "Art/2DItems/Armours/Shields/ShieldDexInt5.dds",
          "id": "ShieldDexInt5"
      }
  },
  {
      "id": "Metadata/Items/Armours/Shields/ShieldInt6",
      "name": "Brass Spirit Shield",
      "itemClass": "Shield",
      "dropLevel": 33,
      "inventoryWidth": 2,
      "inventoryHeight": 2,
      "requirements": {
          "level": 33,
          "strength": 0,
          "dexterity": 0,
          "intelligence": 83
      },
      "properties": {
          "block": 25,
          "energy_shield": {
              "max": 40,
              "min": 35
          },
          "movement_speed": -3
      },
      "implicits": [],
      "tags": [
          "int_armour",
          "focus",
          "shield",
          "armour",
          "default"
      ],
      "visualIdentity": {
          "ddsFile": "Art/2DItems/Armours/Shields/ShieldInt6.dds",
          "id": "ShieldInt6"
      }
  },
  {
      "id": "Metadata/Items/Armours/Shields/ShieldStrDex5",
      "name": "Splendid Round Shield",
      "itemClass": "Shield",
      "dropLevel": 33,
      "inventoryWidth": 2,
      "inventoryHeight": 3,
      "requirements": {
          "level": 33,
          "strength": 44,
          "dexterity": 44,
          "intelligence": 0
      },
      "properties": {
          "armour": {
              "max": 86,
              "min": 75
          },
          "block": 25,
          "evasion": {
              "max": 86,
              "min": 75
          },
          "movement_speed": -3
      },
      "implicits": [
          "BlockRecoveryImplicitShield2"
      ],
      "tags": [
          "str_dex_armour",
          "str_dex_shield",
          "shield",
          "armour",
          "default"
      ],
      "visualIdentity": {
          "ddsFile": "Art/2DItems/Armours/Shields/ShieldStrDex5.dds",
          "id": "ShieldStrDex5"
      }
  },
  {
      "id": "Metadata/Items/Armours/Shields/ShieldDex6",
      "name": "Gilded Buckler",
      "itemClass": "Shield",
      "dropLevel": 34,
      "inventoryWidth": 2,
      "inventoryHeight": 2,
      "requirements": {
          "level": 34,
          "strength": 0,
          "dexterity": 85,
          "intelligence": 0
      },
      "properties": {
          "block": 25,
          "evasion": {
              "max": 259,
              "min": 225
          },
          "movement_speed": -3
      },
      "implicits": [
          "MovementVelocityImplicitShield2"
      ],
      "tags": [
          "dex_armour",
          "dex_shield",
          "shield",
          "armour",
          "default"
      ],
      "visualIdentity": {
          "ddsFile": "Art/2DItems/Armours/Shields/ShieldDex6.dds",
          "id": "ShieldDex6"
      }
  },
  {
      "id": "Metadata/Items/Armours/Shields/ShieldStrInt5",
      "name": "Ceremonial Kite Shield",
      "itemClass": "Shield",
      "dropLevel": 34,
      "inventoryWidth": 2,
      "inventoryHeight": 3,
      "requirements": {
          "level": 34,
          "strength": 46,
          "dexterity": 0,
          "intelligence": 46
      },
      "properties": {
          "armour": {
              "max": 89,
              "min": 77
          },
          "block": 22,
          "energy_shield": {
              "max": 19,
              "min": 16
          },
          "movement_speed": -3
      },
      "implicits": [
          "AllResistancesImplicitShield3"
      ],
      "tags": [
          "str_int_armour",
          "str_int_shield",
          "shield",
          "armour",
          "default"
      ],
      "visualIdentity": {
          "ddsFile": "Art/2DItems/Armours/Shields/ShieldStrInt5.dds",
          "id": "ShieldStrInt5"
      }
  },
  {
      "id": "Metadata/Items/Armours/Shields/ShieldStr7",
      "name": "Painted Tower Shield",
      "itemClass": "Shield",
      "dropLevel": 35,
      "inventoryWidth": 2,
      "inventoryHeight": 4,
      "requirements": {
          "level": 35,
          "strength": 87,
          "dexterity": 0,
          "intelligence": 0
      },
      "properties": {
          "armour": {
              "max": 216,
              "min": 188
          },
          "block": 25,
          "movement_speed": -3
      },
      "implicits": [
          "IncreasedLifeImplicitShield2"
      ],
      "tags": [
          "str_armour",
          "str_shield",
          "shield",
          "armour",
          "default"
      ],
      "visualIdentity": {
          "ddsFile": "Art/2DItems/Armours/Shields/ShieldStr7.dds",
          "id": "ShieldStr7"
      }
  },
  {
      "id": "Metadata/Items/Armours/Shields/ShieldInt7",
      "name": "Walnut Spirit Shield",
      "itemClass": "Shield",
      "dropLevel": 37,
      "inventoryWidth": 2,
      "inventoryHeight": 2,
      "requirements": {
          "level": 37,
          "strength": 0,
          "dexterity": 0,
          "intelligence": 92
      },
      "properties": {
          "block": 24,
          "energy_shield": {
              "max": 38,
              "min": 32
          },
          "movement_speed": -3
      },
      "implicits": [
          "SpellDamageImplicitShield1"
      ],
      "tags": [
          "int_armour",
          "focus",
          "shield",
          "armour",
          "default"
      ],
      "visualIdentity": {
          "ddsFile": "Art/2DItems/Armours/Shields/ShieldInt2.dds",
          "id": "ShieldInt2"
      }
  },
  {
      "id": "Metadata/Items/Armours/Shields/ShieldDex7",
      "name": "Oak Buckler",
      "itemClass": "Shield",
      "dropLevel": 38,
      "inventoryWidth": 2,
      "inventoryHeight": 2,
      "requirements": {
          "level": 38,
          "strength": 0,
          "dexterity": 94,
          "intelligence": 0
      },
      "properties": {
          "block": 26,
          "evasion": {
              "max": 259,
              "min": 220
          },
          "movement_speed": -3
      },
      "implicits": [
          "MovementVelocityImplicitShield1"
      ],
      "tags": [
          "dex_armour",
          "dex_shield",
          "shield",
          "armour",
          "default"
      ],
      "visualIdentity": {
          "ddsFile": "Art/2DItems/Armours/Shields/ShieldDex2.dds",
          "id": "ShieldDex2"
      }
  },
  {
      "id": "Metadata/Items/Armours/Shields/ShieldDexInt6",
      "name": "Redwood Spiked Shield",
      "itemClass": "Shield",
      "dropLevel": 39,
      "inventoryWidth": 2,
      "inventoryHeight": 2,
      "requirements": {
          "level": 39,
          "strength": 0,
          "dexterity": 52,
          "intelligence": 52
      },
      "properties": {
          "block": 24,
          "energy_shield": {
              "max": 34,
              "min": 30
          },
          "evasion": {
              "max": 163,
              "min": 142
          },
          "movement_speed": -3
      },
      "implicits": [
          "ChanceToDodgeImplicitShield1"
      ],
      "tags": [
          "dex_int_armour",
          "dex_int_shield",
          "shield",
          "armour",
          "default"
      ],
      "visualIdentity": {
          "ddsFile": "Art/2DItems/Armours/Shields/ShieldDexInt2.dds",
          "id": "ShieldDexInt2"
      }
  },
  {
      "id": "Metadata/Items/Armours/Shields/ShieldStr8",
      "name": "Buckskin Tower Shield",
      "itemClass": "Shield",
      "dropLevel": 39,
      "inventoryWidth": 2,
      "inventoryHeight": 4,
      "requirements": {
          "level": 39,
          "strength": 96,
          "dexterity": 0,
          "intelligence": 0
      },
      "properties": {
          "armour": {
              "max": 209,
              "min": 177
          },
          "block": 26,
          "movement_speed": -3
      },
      "implicits": [
          "IncreasedLifeImplicitShield1"
      ],
      "tags": [
          "str_armour",
          "str_shield",
          "shield",
          "armour",
          "default"
      ],
      "visualIdentity": {
          "ddsFile": "Art/2DItems/Armours/Shields/ShieldStr3.dds",
          "id": "ShieldStr3"
      }
  },
  {
      "id": "Metadata/Items/Armours/Shields/ShieldStrDex6",
      "name": "Maple Round Shield",
      "itemClass": "Shield",
      "dropLevel": 39,
      "inventoryWidth": 2,
      "inventoryHeight": 3,
      "requirements": {
          "level": 39,
          "strength": 52,
          "dexterity": 52,
          "intelligence": 0
      },
      "properties": {
          "armour": {
              "max": 99,
              "min": 88
          },
          "block": 24,
          "evasion": {
              "max": 99,
              "min": 88
          },
          "movement_speed": -3
      },
      "implicits": [
          "BlockRecoveryImplicitShield3"
      ],
      "tags": [
          "str_dex_armour",
          "str_dex_shield",
          "shield",
          "armour",
          "default"
      ],
      "visualIdentity": {
          "ddsFile": "Art/2DItems/Armours/Shields/ShieldStrDex2.dds",
          "id": "ShieldStrDex2"
      }
  },
  {
      "id": "Metadata/Items/Armours/Shields/ShieldStrInt6",
      "name": "Etched Kite Shield",
      "itemClass": "Shield",
      "dropLevel": 40,
      "inventoryWidth": 2,
      "inventoryHeight": 3,
      "requirements": {
          "level": 40,
          "strength": 53,
          "dexterity": 0,
          "intelligence": 53
      },
      "properties": {
          "armour": {
              "max": 142,
              "min": 127
          },
          "block": 24,
          "energy_shield": {
              "max": 30,
              "min": 27
          },
          "movement_speed": -3
      },
      "implicits": [
          "AllResistancesImplicitShield1"
      ],
      "tags": [
          "str_int_armour",
          "str_int_shield",
          "shield",
          "armour",
          "default"
      ],
      "visualIdentity": {
          "ddsFile": "Art/2DItems/Armours/Shields/ShieldStrInt2.dds",
          "id": "ShieldStrInt2"
      }
  },
  {
      "id": "Metadata/Items/Armours/Shields/ShieldInt8",
      "name": "Ivory Spirit Shield",
      "itemClass": "Shield",
      "dropLevel": 41,
      "inventoryWidth": 2,
      "inventoryHeight": 2,
      "requirements": {
          "level": 41,
          "strength": 0,
          "dexterity": 0,
          "intelligence": 101
      },
      "properties": {
          "block": 22,
          "energy_shield": {
              "max": 40,
              "min": 35
          },
          "movement_speed": -3
      },
      "implicits": [
          "MinionDamageImplicitShield1"
      ],
      "tags": [
          "int_armour",
          "focus",
          "focus_can_roll_minion_modifiers",
          "shield",
          "armour",
          "default"
      ],
      "visualIdentity": {
          "ddsFile": "Art/2DItems/Armours/Shields/ShieldInt3.dds",
          "id": "ShieldInt3"
      }
  },
  {
      "id": "Metadata/Items/Armours/Shields/ShieldDex8",
      "name": "Enameled Buckler",
      "itemClass": "Shield",
      "dropLevel": 42,
      "inventoryWidth": 2,
      "inventoryHeight": 2,
      "requirements": {
          "level": 42,
          "strength": 0,
          "dexterity": 103,
          "intelligence": 0
      },
      "properties": {
          "block": 24,
          "evasion": {
              "max": 349,
              "min": 311
          },
          "movement_speed": -3
      },
      "implicits": [
          "MovementVelocityImplicitShield2"
      ],
      "tags": [
          "dex_armour",
          "dex_shield",
          "shield",
          "armour",
          "default"
      ],
      "visualIdentity": {
          "ddsFile": "Art/2DItems/Armours/Shields/ShieldDex3.dds",
          "id": "ShieldDex3"
      }
  },
  {
      "id": "Metadata/Items/Armours/Shields/ShieldStr9",
      "name": "Mahogany Tower Shield",
      "itemClass": "Shield",
      "dropLevel": 43,
      "inventoryWidth": 2,
      "inventoryHeight": 4,
      "requirements": {
          "level": 43,
          "strength": 105,
          "dexterity": 0,
          "intelligence": 0
      },
      "properties": {
          "armour": {
              "max": 265,
              "min": 230
          },
          "block": 25,
          "movement_speed": -3
      },
      "implicits": [
          "IncreasedLifeImplicitShield2"
      ],
      "tags": [
          "str_armour",
          "str_shield",
          "shield",
          "armour",
          "default"
      ],
      "visualIdentity": {
          "ddsFile": "Art/2DItems/Armours/Shields/ShieldStr4.dds",
          "id": "ShieldStr4"
      }
  },
  {
      "id": "Metadata/Items/Armours/Shields/ShieldDexInt7",
      "name": "Compound Spiked Shield",
      "itemClass": "Shield",
      "dropLevel": 45,
      "inventoryWidth": 2,
      "inventoryHeight": 2,
      "requirements": {
          "level": 45,
          "strength": 0,
          "dexterity": 59,
          "intelligence": 59
      },
      "properties": {
          "block": 25,
          "energy_shield": {
              "max": 30,
              "min": 25
          },
          "evasion": {
              "max": 144,
              "min": 122
          },
          "movement_speed": -3
      },
      "implicits": [
          "ChanceToDodgeSpellsImplicitShield1"
      ],
      "tags": [
          "dex_int_armour",
          "dex_int_shield",
          "shield",
          "armour",
          "default"
      ],
      "visualIdentity": {
          "ddsFile": "Art/2DItems/Armours/Shields/ShieldDexInt3.dds",
          "id": "ShieldDexInt3"
      }
  },
  {
      "id": "Metadata/Items/Armours/Shields/ShieldInt9",
      "name": "Ancient Spirit Shield",
      "itemClass": "Shield",
      "dropLevel": 45,
      "inventoryWidth": 2,
      "inventoryHeight": 2,
      "requirements": {
          "level": 45,
          "strength": 0,
          "dexterity": 0,
          "intelligence": 110
      },
      "properties": {
          "block": 24,
          "energy_shield": {
              "max": 45,
              "min": 38
          },
          "movement_speed": -3
      },
      "implicits": [
          "SpellDamageImplicitShield1"
      ],
      "tags": [
          "int_armour",
          "focus",
          "shield",
          "armour",
          "default"
      ],
      "visualIdentity": {
          "ddsFile": "Art/2DItems/Armours/Shields/ShieldInt4.dds",
          "id": "ShieldInt4"
      }
  },
  {
      "id": "Metadata/Items/Armours/Shields/ShieldStrDex7",
      "name": "Spiked Round Shield",
      "itemClass": "Shield",
      "dropLevel": 45,
      "inventoryWidth": 2,
      "inventoryHeight": 3,
      "requirements": {
          "level": 45,
          "strength": 59,
          "dexterity": 59,
          "intelligence": 0
      },
      "properties": {
          "armour": {
              "max": 120,
              "min": 102
          },
          "block": 27,
          "evasion": {
              "max": 120,
              "min": 102
          },
          "movement_speed": -3
      },
      "implicits": [
          "BlockRecoveryImplicitShield1"
      ],
      "tags": [
          "str_dex_armour",
          "str_dex_shield",
          "shield",
          "armour",
          "default"
      ],
      "visualIdentity": {
          "ddsFile": "Art/2DItems/Armours/Shields/ShieldStrDex3.dds",
          "id": "ShieldStrDex3"
      }
  },
  {
      "id": "Metadata/Items/Armours/Shields/ShieldDex9",
      "name": "Corrugated Buckler",
      "itemClass": "Shield",
      "dropLevel": 46,
      "inventoryWidth": 2,
      "inventoryHeight": 2,
      "requirements": {
          "level": 46,
          "strength": 0,
          "dexterity": 112,
          "intelligence": 0
      },
      "properties": {
          "block": 27,
          "evasion": {
              "max": 272,
              "min": 227
          },
          "movement_speed": -3
      },
      "implicits": [
          "MovementVelocityImplicitShield1"
      ],
      "tags": [
          "dex_armour",
          "dex_shield",
          "shield",
          "armour",
          "default"
      ],
      "visualIdentity": {
          "ddsFile": "Art/2DItems/Armours/Shields/ShieldDex4.dds",
          "id": "ShieldDex4"
      }
  },
  {
      "id": "Metadata/Items/Armours/Shields/ShieldStrInt7",
      "name": "Steel Kite Shield",
      "itemClass": "Shield",
      "dropLevel": 46,
      "inventoryWidth": 2,
      "inventoryHeight": 3,
      "requirements": {
          "level": 46,
          "strength": 60,
          "dexterity": 0,
          "intelligence": 60
      },
      "properties": {
          "armour": {
              "max": 167,
              "min": 146
          },
          "block": 26,
          "energy_shield": {
              "max": 35,
              "min": 30
          },
          "movement_speed": -3
      },
      "implicits": [],
      "tags": [
          "str_int_armour",
          "str_int_shield",
          "shield",
          "armour",
          "default"
      ],
      "visualIdentity": {
          "ddsFile": "Art/2DItems/Armours/Shields/ShieldStrInt4.dds",
          "id": "ShieldStrInt3"
      }
  },
  {
      "id": "Metadata/Items/Armours/Shields/ShieldStr10",
      "name": "Bronze Tower Shield",
      "itemClass": "Shield",
      "dropLevel": 47,
      "inventoryWidth": 2,
      "inventoryHeight": 4,
      "requirements": {
          "level": 47,
          "strength": 114,
          "dexterity": 0,
          "intelligence": 0
      },
      "properties": {
          "armour": {
              "max": 324,
              "min": 290
          },
          "block": 24,
          "movement_speed": -3
      },
      "implicits": [
          "IncreasedLifeImplicitShield3"
      ],
      "tags": [
          "str_armour",
          "str_shield",
          "shield",
          "armour",
          "default"
      ],
      "visualIdentity": {
          "ddsFile": "Art/2DItems/Armours/Shields/ShieldStr5.dds",
          "id": "ShieldStr5"
      }
  },
  {
      "id": "Metadata/Items/Armours/Shields/ShieldDexInt8",
      "name": "Polished Spiked Shield",
      "itemClass": "Shield",
      "dropLevel": 49,
      "inventoryWidth": 2,
      "inventoryHeight": 2,
      "requirements": {
          "level": 49,
          "strength": 0,
          "dexterity": 64,
          "intelligence": 64
      },
      "properties": {
          "block": 26,
          "energy_shield": {
              "max": 27,
              "min": 23
          },
          "evasion": {
              "max": 131,
              "min": 111
          },
          "movement_speed": -3
      },
      "implicits": [
          "ChanceToDodgeImplicitShield2"
      ],
      "tags": [
          "dex_int_armour",
          "dex_int_shield",
          "shield",
          "armour",
          "default"
      ],
      "visualIdentity": {
          "ddsFile": "Art/2DItems/Armours/Shields/ShieldDexInt4.dds",
          "id": "ShieldDexInt4"
      }
  },
  {
      "id": "Metadata/Items/Armours/Shields/ShieldInt10",
      "name": "Chiming Spirit Shield",
      "itemClass": "Shield",
      "dropLevel": 49,
      "inventoryWidth": 2,
      "inventoryHeight": 2,
      "requirements": {
          "level": 49,
          "strength": 0,
          "dexterity": 0,
          "intelligence": 119
      },
      "properties": {
          "block": 23,
          "energy_shield": {
              "max": 48,
              "min": 42
          },
          "movement_speed": -3
      },
      "implicits": [
          "SpellDamageImplicitShield2"
      ],
      "tags": [
          "int_armour",
          "focus",
          "shield",
          "armour",
          "default"
      ],
      "visualIdentity": {
          "ddsFile": "Art/2DItems/Armours/Shields/ShieldInt5.dds",
          "id": "ShieldInt5"
      }
  },
  {
      "id": "Metadata/Items/Armours/Shields/ShieldStrDex8",
      "name": "Crimson Round Shield",
      "itemClass": "Shield",
      "dropLevel": 49,
      "inventoryWidth": 2,
      "inventoryHeight": 3,
      "requirements": {
          "level": 49,
          "strength": 64,
          "dexterity": 64,
          "intelligence": 0
      },
      "properties": {
          "armour": {
              "max": 178,
              "min": 155
          },
          "block": 26,
          "evasion": {
              "max": 178,
              "min": 155
          },
          "movement_speed": -3
      },
      "implicits": [],
      "tags": [
          "str_dex_armour",
          "str_dex_shield",
          "shield",
          "armour",
          "default"
      ],
      "visualIdentity": {
          "ddsFile": "Art/2DItems/Armours/Shields/ShieldStrDex4.dds",
          "id": "ShieldStrDex4"
      }
  },
  {
      "id": "Metadata/Items/Armours/Shields/ShieldDex10",
      "name": "Battle Buckler",
      "itemClass": "Shield",
      "dropLevel": 50,
      "inventoryWidth": 2,
      "inventoryHeight": 2,
      "requirements": {
          "level": 50,
          "strength": 0,
          "dexterity": 121,
          "intelligence": 0
      },
      "properties": {
          "block": 26,
          "evasion": {
              "max": 330,
              "min": 287
          },
          "movement_speed": -3
      },
      "implicits": [
          "MovementVelocityImplicitShield3"
      ],
      "tags": [
          "dex_armour",
          "dex_shield",
          "shield",
          "armour",
          "default"
      ],
      "visualIdentity": {
          "ddsFile": "Art/2DItems/Armours/Shields/ShieldDex5.dds",
          "id": "ShieldDex5"
      }
  },
  {
      "id": "Metadata/Items/Armours/Shields/ShieldStrInt8",
      "name": "Laminated Kite Shield",
      "itemClass": "Shield",
      "dropLevel": 50,
      "inventoryWidth": 2,
      "inventoryHeight": 3,
      "requirements": {
          "level": 50,
          "strength": 65,
          "dexterity": 0,
          "intelligence": 65
      },
      "properties": {
          "armour": {
              "max": 133,
              "min": 113
          },
          "block": 24,
          "energy_shield": {
              "max": 27,
              "min": 23
          },
          "movement_speed": -3
      },
      "implicits": [
          "AllResistancesImplicitShield2"
      ],
      "tags": [
          "str_int_armour",
          "str_int_shield",
          "shield",
          "armour",
          "default"
      ],
      "visualIdentity": {
          "ddsFile": "Art/2DItems/Armours/Shields/ShieldStrInt3.dds",
          "id": "ShieldStrInt4"
      }
  },
  {
      "id": "Metadata/Items/Armours/Shields/ShieldStr11",
      "name": "Girded Tower Shield",
      "itemClass": "Shield",
      "dropLevel": 51,
      "inventoryWidth": 2,
      "inventoryHeight": 4,
      "requirements": {
          "level": 51,
          "strength": 123,
          "dexterity": 0,
          "intelligence": 0
      },
      "properties": {
          "armour": {
              "max": 437,
              "min": 397
          },
          "block": 23,
          "movement_speed": -3
      },
      "implicits": [
          "IncreasedLifeImplicitShield1"
      ],
      "tags": [
          "str_armour",
          "str_shield",
          "shield",
          "armour",
          "default"
      ],
      "visualIdentity": {
          "ddsFile": "Art/2DItems/Armours/Shields/ShieldStr6.dds",
          "id": "ShieldStr6"
      }
  },
  {
      "id": "Metadata/Items/Armours/Shields/ShieldInt11",
      "name": "Thorium Spirit Shield",
      "itemClass": "Shield",
      "dropLevel": 53,
      "inventoryWidth": 2,
      "inventoryHeight": 2,
      "requirements": {
          "level": 53,
          "strength": 0,
          "dexterity": 0,
          "intelligence": 128
      },
      "properties": {
          "block": 25,
          "energy_shield": {
              "max": 62,
              "min": 54
          },
          "movement_speed": -3
      },
      "implicits": [],
      "tags": [
          "int_armour",
          "focus",
          "shield",
          "armour",
          "default"
      ],
      "visualIdentity": {
          "ddsFile": "Art/2DItems/Armours/Shields/ShieldInt6.dds",
          "id": "ShieldInt6"
      }
  },
  {
      "id": "Metadata/Items/Armours/Shields/ShieldDex11",
      "name": "Golden Buckler",
      "itemClass": "Shield",
      "dropLevel": 54,
      "inventoryWidth": 2,
      "inventoryHeight": 2,
      "requirements": {
          "level": 54,
          "strength": 0,
          "dexterity": 130,
          "intelligence": 0
      },
      "properties": {
          "block": 25,
          "evasion": {
              "max": 407,
              "min": 354
          },
          "movement_speed": -3
      },
      "implicits": [
          "MovementVelocityImplicitShield2"
      ],
      "tags": [
          "dex_armour",
          "dex_shield",
          "shield",
          "armour",
          "default"
      ],
      "visualIdentity": {
          "ddsFile": "Art/2DItems/Armours/Shields/ShieldDex6.dds",
          "id": "ShieldDex6"
      }
  },
  {
      "id": "Metadata/Items/Armours/Shields/ShieldDexInt9",
      "name": "Sovereign Spiked Shield",
      "itemClass": "Shield",
      "dropLevel": 54,
      "inventoryWidth": 2,
      "inventoryHeight": 2,
      "requirements": {
          "level": 54,
          "strength": 0,
          "dexterity": 70,
          "intelligence": 70
      },
      "properties": {
          "block": 24,
          "energy_shield": {
              "max": 45,
              "min": 40
          },
          "evasion": {
              "max": 218,
              "min": 195
          },
          "movement_speed": -3
      },
      "implicits": [
          "ChanceToDodgeSpellsImplicitShield2"
      ],
      "tags": [
          "dex_int_armour",
          "dex_int_shield",
          "shield",
          "armour",
          "default"
      ],
      "visualIdentity": {
          "ddsFile": "Art/2DItems/Armours/Shields/ShieldDexInt5.dds",
          "id": "ShieldDexInt5"
      }
  },
  {
      "id": "Metadata/Items/Armours/Shields/ShieldStrDex9",
      "name": "Baroque Round Shield",
      "itemClass": "Shield",
      "dropLevel": 54,
      "inventoryWidth": 2,
      "inventoryHeight": 3,
      "requirements": {
          "level": 54,
          "strength": 70,
          "dexterity": 70,
          "intelligence": 0
      },
      "properties": {
          "armour": {
              "max": 140,
              "min": 122
          },
          "block": 25,
          "evasion": {
              "max": 140,
              "min": 122
          },
          "movement_speed": -3
      },
      "implicits": [
          "BlockRecoveryImplicitShield2"
      ],
      "tags": [
          "str_dex_armour",
          "str_dex_shield",
          "shield",
          "armour",
          "default"
      ],
      "visualIdentity": {
          "ddsFile": "Art/2DItems/Armours/Shields/ShieldStrDex5.dds",
          "id": "ShieldStrDex5"
      }
  },
  {
      "id": "Metadata/Items/Armours/Shields/ShieldStr12",
      "name": "Crested Tower Shield",
      "itemClass": "Shield",
      "dropLevel": 55,
      "inventoryWidth": 2,
      "inventoryHeight": 4,
      "requirements": {
          "level": 55,
          "strength": 132,
          "dexterity": 0,
          "intelligence": 0
      },
      "properties": {
          "armour": {
              "max": 337,
              "min": 293
          },
          "block": 25,
          "movement_speed": -3
      },
      "implicits": [
          "IncreasedLifeImplicitShield2"
      ],
      "tags": [
          "str_armour",
          "str_shield",
          "shield",
          "armour",
          "default"
      ],
      "visualIdentity": {
          "ddsFile": "Art/2DItems/Armours/Shields/ShieldStr7.dds",
          "id": "ShieldStr7"
      }
  },
  {
      "id": "Metadata/Items/Armours/Shields/ShieldStrInt9",
      "name": "Angelic Kite Shield",
      "itemClass": "Shield",
      "dropLevel": 55,
      "inventoryWidth": 2,
      "inventoryHeight": 3,
      "requirements": {
          "level": 55,
          "strength": 71,
          "dexterity": 0,
          "intelligence": 71
      },
      "properties": {
          "armour": {
              "max": 142,
              "min": 124
          },
          "block": 22,
          "energy_shield": {
              "max": 29,
              "min": 25
          },
          "movement_speed": -3
      },
      "implicits": [
          "AllResistancesImplicitShield3"
      ],
      "tags": [
          "str_int_armour",
          "str_int_shield",
          "shield",
          "armour",
          "default"
      ],
      "visualIdentity": {
          "ddsFile": "Art/2DItems/Armours/Shields/ShieldStrInt5.dds",
          "id": "ShieldStrInt5"
      }
  },
  {
      "id": "Metadata/Items/Armours/Shields/ShieldInt12",
      "name": "Lacewood Spirit Shield",
      "itemClass": "Shield",
      "dropLevel": 56,
      "inventoryWidth": 2,
      "inventoryHeight": 2,
      "requirements": {
          "level": 56,
          "strength": 0,
          "dexterity": 0,
          "intelligence": 134
      },
      "properties": {
          "block": 24,
          "energy_shield": {
              "max": 55,
              "min": 47
          },
          "movement_speed": -3
      },
      "implicits": [
          "SpellDamageImplicitShield1"
      ],
      "tags": [
          "int_armour",
          "focus",
          "shield",
          "armour",
          "default"
      ],
      "visualIdentity": {
          "ddsFile": "Art/2DItems/Armours/Shields/ShieldInt2.dds",
          "id": "ShieldInt2"
      }
  },
  {
      "id": "Metadata/Items/Armours/Shields/ShieldDex12",
      "name": "Ironwood Buckler",
      "itemClass": "Shield",
      "dropLevel": 57,
      "inventoryWidth": 2,
      "inventoryHeight": 2,
      "requirements": {
          "level": 57,
          "strength": 0,
          "dexterity": 137,
          "intelligence": 0
      },
      "properties": {
          "block": 26,
          "evasion": {
              "max": 385,
              "min": 327
          },
          "movement_speed": -3
      },
      "implicits": [
          "MovementVelocityImplicitShield1"
      ],
      "tags": [
          "dex_armour",
          "dex_shield",
          "shield",
          "armour",
          "default"
      ],
      "visualIdentity": {
          "ddsFile": "Art/2DItems/Armours/Shields/ShieldDex2.dds",
          "id": "ShieldDex2"
      }
  },
  {
      "id": "Metadata/Items/Armours/Shields/ShieldDexInt10",
      "name": "Alder Spiked Shield",
      "itemClass": "Shield",
      "dropLevel": 58,
      "inventoryWidth": 2,
      "inventoryHeight": 2,
      "requirements": {
          "level": 58,
          "strength": 0,
          "dexterity": 74,
          "intelligence": 74
      },
      "properties": {
          "block": 24,
          "energy_shield": {
              "max": 49,
              "min": 43
          },
          "evasion": {
              "max": 240,
              "min": 209
          },
          "movement_speed": -3
      },
      "implicits": [
          "ChanceToDodgeImplicitShield1"
      ],
      "tags": [
          "dex_int_armour",
          "dex_int_shield",
          "shield",
          "armour",
          "default"
      ],
      "visualIdentity": {
          "ddsFile": "Art/2DItems/Armours/Shields/ShieldDexInt2.dds",
          "id": "ShieldDexInt2"
      }
  },
  {
      "id": "Metadata/Items/Armours/Shields/ShieldStr13",
      "name": "Shagreen Tower Shield",
      "itemClass": "Shield",
      "dropLevel": 58,
      "inventoryWidth": 2,
      "inventoryHeight": 4,
      "requirements": {
          "level": 58,
          "strength": 139,
          "dexterity": 0,
          "intelligence": 0
      },
      "properties": {
          "armour": {
              "max": 308,
              "min": 261
          },
          "block": 26,
          "movement_speed": -3
      },
      "implicits": [
          "IncreasedLifeImplicitShield1"
      ],
      "tags": [
          "str_armour",
          "str_shield",
          "shield",
          "armour",
          "default"
      ],
      "visualIdentity": {
          "ddsFile": "Art/2DItems/Armours/Shields/ShieldStr3.dds",
          "id": "ShieldStr3"
      }
  },
  {
      "id": "Metadata/Items/Armours/Shields/ShieldStrDex10",
      "name": "Teak Round Shield",
      "itemClass": "Shield",
      "dropLevel": 58,
      "inventoryWidth": 2,
      "inventoryHeight": 3,
      "requirements": {
          "level": 58,
          "strength": 74,
          "dexterity": 74,
          "intelligence": 0
      },
      "properties": {
          "armour": {
              "max": 146,
              "min": 131
          },
          "block": 24,
          "evasion": {
              "max": 146,
              "min": 131
          },
          "movement_speed": -3
      },
      "implicits": [
          "BlockRecoveryImplicitShield3"
      ],
      "tags": [
          "str_dex_armour",
          "str_dex_shield",
          "shield",
          "armour",
          "default"
      ],
      "visualIdentity": {
          "ddsFile": "Art/2DItems/Armours/Shields/ShieldStrDex2.dds",
          "id": "ShieldStrDex2"
      }
  },
  {
      "id": "Metadata/Items/Armours/Shields/ShieldInt13",
      "name": "Fossilised Spirit Shield",
      "itemClass": "Shield",
      "dropLevel": 59,
      "inventoryWidth": 2,
      "inventoryHeight": 2,
      "requirements": {
          "level": 59,
          "strength": 0,
          "dexterity": 0,
          "intelligence": 141
      },
      "properties": {
          "block": 22,
          "energy_shield": {
              "max": 55,
              "min": 49
          },
          "movement_speed": -3
      },
      "implicits": [
          "MinionDamageImplicitShield1"
      ],
      "tags": [
          "int_armour",
          "focus",
          "focus_can_roll_minion_modifiers",
          "shield",
          "armour",
          "default"
      ],
      "visualIdentity": {
          "ddsFile": "Art/2DItems/Armours/Shields/ShieldInt3.dds",
          "id": "ShieldInt3"
      }
  },
  {
      "id": "Metadata/Items/Armours/Shields/ShieldStrInt10",
      "name": "Branded Kite Shield",
      "itemClass": "Shield",
      "dropLevel": 59,
      "inventoryWidth": 2,
      "inventoryHeight": 3,
      "requirements": {
          "level": 59,
          "strength": 76,
          "dexterity": 0,
          "intelligence": 76
      },
      "properties": {
          "armour": {
              "max": 208,
              "min": 186
          },
          "block": 24,
          "energy_shield": {
              "max": 43,
              "min": 38
          },
          "movement_speed": -3
      },
      "implicits": [
          "AllResistancesImplicitShield1"
      ],
      "tags": [
          "str_int_armour",
          "str_int_shield",
          "shield",
          "armour",
          "default"
      ],
      "visualIdentity": {
          "ddsFile": "Art/2DItems/Armours/Shields/ShieldStrInt2.dds",
          "id": "ShieldStrInt2"
      }
  },
  {
      "id": "Metadata/Items/Armours/Shields/ShieldDex13",
      "name": "Lacquered Buckler",
      "itemClass": "Shield",
      "dropLevel": 60,
      "inventoryWidth": 2,
      "inventoryHeight": 2,
      "requirements": {
          "level": 60,
          "strength": 0,
          "dexterity": 154,
          "intelligence": 0
      },
      "properties": {
          "block": 24,
          "evasion": {
              "max": 549,
              "min": 477
          },
          "movement_speed": -3
      },
      "implicits": [
          "MovementVelocityImplicitShield2"
      ],
      "tags": [
          "dex_armour",
          "dex_shield",
          "shield",
          "armour",
          "default"
      ],
      "visualIdentity": {
          "ddsFile": "Art/2DItems/Armours/Shields/ShieldDex3.dds",
          "id": "ShieldDex3"
      }
  },
  {
      "id": "Metadata/Items/Armours/Shields/ShieldStr14",
      "name": "Ebony Tower Shield",
      "itemClass": "Shield",
      "dropLevel": 61,
      "inventoryWidth": 2,
      "inventoryHeight": 4,
      "requirements": {
          "level": 61,
          "strength": 159,
          "dexterity": 0,
          "intelligence": 0
      },
      "properties": {
          "armour": {
              "max": 411,
              "min": 357
          },
          "block": 25,
          "movement_speed": -3
      },
      "implicits": [
          "IncreasedLifeImplicitShield2"
      ],
      "tags": [
          "str_armour",
          "str_shield",
          "shield",
          "armour",
          "default"
      ],
      "visualIdentity": {
          "ddsFile": "Art/2DItems/Armours/Shields/ShieldStr4.dds",
          "id": "ShieldStr4"
      }
  },
  {
      "id": "Metadata/Items/Armours/Shields/ShieldDexInt11",
      "name": "Ezomyte Spiked Shield",
      "itemClass": "Shield",
      "dropLevel": 62,
      "inventoryWidth": 2,
      "inventoryHeight": 2,
      "requirements": {
          "level": 62,
          "strength": 0,
          "dexterity": 85,
          "intelligence": 85
      },
      "properties": {
          "block": 25,
          "energy_shield": {
              "max": 43,
              "min": 37
          },
          "evasion": {
              "max": 209,
              "min": 181
          },
          "movement_speed": -3
      },
      "implicits": [
          "ChanceToDodgeSpellsImplicitShield1"
      ],
      "tags": [
          "dex_int_armour",
          "dex_int_shield",
          "shield",
          "armour",
          "default"
      ],
      "visualIdentity": {
          "ddsFile": "Art/2DItems/Armours/Shields/ShieldDexInt3.dds",
          "id": "ShieldDexInt3"
      }
  },
  {
      "id": "Metadata/Items/Armours/Shields/ShieldInt14",
      "name": "Vaal Spirit Shield",
      "itemClass": "Shield",
      "dropLevel": 62,
      "inventoryWidth": 2,
      "inventoryHeight": 2,
      "requirements": {
          "level": 62,
          "strength": 0,
          "dexterity": 0,
          "intelligence": 159
      },
      "properties": {
          "block": 24,
          "energy_shield": {
              "max": 64,
              "min": 56
          },
          "movement_speed": -3
      },
      "implicits": [
          "SpellDamageImplicitShield1"
      ],
      "tags": [
          "int_armour",
          "focus",
          "shield",
          "armour",
          "default"
      ],
      "visualIdentity": {
          "ddsFile": "Art/2DItems/Armours/Shields/ShieldInt4.dds",
          "id": "ShieldInt4"
      }
  },
  {
      "id": "Metadata/Items/Armours/Shields/ShieldStrDex11",
      "name": "Spiny Round Shield",
      "itemClass": "Shield",
      "dropLevel": 62,
      "inventoryWidth": 2,
      "inventoryHeight": 3,
      "requirements": {
          "level": 62,
          "strength": 85,
          "dexterity": 85,
          "intelligence": 0
      },
      "properties": {
          "armour": {
              "max": 177,
              "min": 154
          },
          "block": 27,
          "evasion": {
              "max": 177,
              "min": 154
          },
          "movement_speed": -3
      },
      "implicits": [
          "BlockRecoveryImplicitShield1"
      ],
      "tags": [
          "str_dex_armour",
          "str_dex_shield",
          "shield",
          "armour",
          "default"
      ],
      "visualIdentity": {
          "ddsFile": "Art/2DItems/Armours/Shields/ShieldStrDex3.dds",
          "id": "ShieldStrDex3"
      }
  },
  {
      "id": "Metadata/Items/Armours/Shields/ShieldStrInt11",
      "name": "Champion Kite Shield",
      "itemClass": "Shield",
      "dropLevel": 62,
      "inventoryWidth": 2,
      "inventoryHeight": 3,
      "requirements": {
          "level": 62,
          "strength": 85,
          "dexterity": 0,
          "intelligence": 85
      },
      "properties": {
          "armour": {
              "max": 247,
              "min": 215
          },
          "block": 26,
          "energy_shield": {
              "max": 50,
              "min": 44
          },
          "movement_speed": -3
      },
      "implicits": [],
      "tags": [
          "str_int_armour",
          "str_int_shield",
          "shield",
          "armour",
          "default"
      ],
      "visualIdentity": {
          "ddsFile": "Art/2DItems/Armours/Shields/ShieldStrInt4.dds",
          "id": "ShieldStrInt3"
      }
  },
  {
      "id": "Metadata/Items/Armours/Shields/ShieldDex14",
      "name": "Vaal Buckler",
      "itemClass": "Shield",
      "dropLevel": 63,
      "inventoryWidth": 2,
      "inventoryHeight": 2,
      "requirements": {
          "level": 63,
          "strength": 0,
          "dexterity": 159,
          "intelligence": 0
      },
      "properties": {
          "block": 27,
          "evasion": {
              "max": 379,
              "min": 330
          },
          "movement_speed": -3
      },
      "implicits": [
          "MovementVelocityImplicitShield1"
      ],
      "tags": [
          "dex_armour",
          "dex_shield",
          "shield",
          "armour",
          "default"
      ],
      "visualIdentity": {
          "ddsFile": "Art/2DItems/Armours/Shields/ShieldDex4.dds",
          "id": "ShieldDex4"
      }
  },
  {
      "id": "Metadata/Items/Armours/Shields/ShieldStr15",
      "name": "Ezomyte Tower Shield",
      "itemClass": "Shield",
      "dropLevel": 64,
      "inventoryWidth": 2,
      "inventoryHeight": 4,
      "requirements": {
          "level": 64,
          "strength": 159,
          "dexterity": 0,
          "intelligence": 0
      },
      "properties": {
          "armour": {
              "max": 474,
              "min": 412
          },
          "block": 24,
          "movement_speed": -3
      },
      "implicits": [
          "IncreasedLifeImplicitShield3"
      ],
      "tags": [
          "str_armour",
          "str_shield",
          "shield",
          "armour",
          "default"
      ],
      "visualIdentity": {
          "ddsFile": "Art/2DItems/Armours/Shields/ShieldStr5.dds",
          "id": "ShieldStr5"
      }
  },
  {
      "id": "Metadata/Items/Armours/Shields/ShieldInt15",
      "name": "Harmonic Spirit Shield",
      "itemClass": "Shield",
      "dropLevel": 65,
      "inventoryWidth": 2,
      "inventoryHeight": 2,
      "requirements": {
          "level": 65,
          "strength": 0,
          "dexterity": 0,
          "intelligence": 159
      },
      "properties": {
          "block": 23,
          "energy_shield": {
              "max": 66,
              "min": 58
          },
          "movement_speed": -3
      },
      "implicits": [
          "SpellDamageImplicitShield2"
      ],
      "tags": [
          "int_armour",
          "focus",
          "shield",
          "armour",
          "default"
      ],
      "visualIdentity": {
          "ddsFile": "Art/2DItems/Armours/Shields/ShieldInt5.dds",
          "id": "ShieldInt5"
      }
  },
  {
      "id": "Metadata/Items/Armours/Shields/ShieldStrInt12",
      "name": "Mosaic Kite Shield",
      "itemClass": "Shield",
      "dropLevel": 65,
      "inventoryWidth": 2,
      "inventoryHeight": 3,
      "requirements": {
          "level": 65,
          "strength": 85,
          "dexterity": 0,
          "intelligence": 85
      },
      "properties": {
          "armour": {
              "max": 169,
              "min": 147
          },
          "block": 24,
          "energy_shield": {
              "max": 34,
              "min": 30
          },
          "movement_speed": -3
      },
      "implicits": [
          "AllResistancesImplicitShield2"
      ],
      "tags": [
          "str_int_armour",
          "str_int_shield",
          "shield",
          "armour",
          "default"
      ],
      "visualIdentity": {
          "ddsFile": "Art/2DItems/Armours/Shields/ShieldStrInt3.dds",
          "id": "ShieldStrInt4"
      }
  },
  {
      "id": "Metadata/Items/Armours/Shields/ShieldDex15",
      "name": "Crusader Buckler",
      "itemClass": "Shield",
      "dropLevel": 66,
      "inventoryWidth": 2,
      "inventoryHeight": 2,
      "requirements": {
          "level": 66,
          "strength": 0,
          "dexterity": 159,
          "intelligence": 0
      },
      "properties": {
          "block": 26,
          "evasion": {
              "max": 442,
              "min": 385
          },
          "movement_speed": -3
      },
      "implicits": [
          "MovementVelocityImplicitShield3"
      ],
      "tags": [
          "dex_armour",
          "dex_shield",
          "shield",
          "armour",
          "default"
      ],
      "visualIdentity": {
          "ddsFile": "Art/2DItems/Armours/Shields/ShieldDex5.dds",
          "id": "ShieldDex5"
      }
  },
  {
      "id": "Metadata/Items/Armours/Shields/ShieldDexInt12",
      "name": "Mirrored Spiked Shield",
      "itemClass": "Shield",
      "dropLevel": 66,
      "inventoryWidth": 2,
      "inventoryHeight": 2,
      "requirements": {
          "level": 66,
          "strength": 0,
          "dexterity": 85,
          "intelligence": 85
      },
      "properties": {
          "block": 26,
          "energy_shield": {
              "max": 35,
              "min": 31
          },
          "evasion": {
              "max": 174,
              "min": 151
          },
          "movement_speed": -3
      },
      "implicits": [
          "ChanceToDodgeImplicitShield2"
      ],
      "tags": [
          "dex_int_armour",
          "dex_int_shield",
          "shield",
          "armour",
          "default"
      ],
      "visualIdentity": {
          "ddsFile": "Art/2DItems/Armours/Shields/ShieldDexInt4.dds",
          "id": "ShieldDexInt4"
      }
  },
  {
      "id": "Metadata/Items/Armours/Shields/ShieldStrDex12",
      "name": "Cardinal Round Shield",
      "itemClass": "Shield",
      "dropLevel": 66,
      "inventoryWidth": 2,
      "inventoryHeight": 3,
      "requirements": {
          "level": 66,
          "strength": 85,
          "dexterity": 85,
          "intelligence": 0
      },
      "properties": {
          "armour": {
              "max": 240,
              "min": 209
          },
          "block": 26,
          "evasion": {
              "max": 240,
              "min": 209
          },
          "movement_speed": -3
      },
      "implicits": [],
      "tags": [
          "str_dex_armour",
          "str_dex_shield",
          "shield",
          "armour",
          "default"
      ],
      "visualIdentity": {
          "ddsFile": "Art/2DItems/Armours/Shields/ShieldStrDex4.dds",
          "id": "ShieldStrDex4"
      }
  },
  {
      "id": "Metadata/Items/Armours/Shields/ShieldStr16",
      "name": "Colossal Tower Shield",
      "itemClass": "Shield",
      "dropLevel": 67,
      "inventoryWidth": 2,
      "inventoryHeight": 4,
      "requirements": {
          "level": 67,
          "strength": 159,
          "dexterity": 0,
          "intelligence": 0
      },
      "properties": {
          "armour": {
              "max": 601,
              "min": 522
          },
          "block": 23,
          "movement_speed": -3
      },
      "implicits": [
          "IncreasedLifeImplicitShield1"
      ],
      "tags": [
          "str_armour",
          "str_shield",
          "shield",
          "armour",
          "default"
      ],
      "visualIdentity": {
          "ddsFile": "Art/2DItems/Armours/Shields/ShieldStr6.dds",
          "id": "ShieldStr6"
      }
  },
  {
      "id": "Metadata/Items/Armours/Shields/ShieldInt16",
      "name": "Titanium Spirit Shield",
      "itemClass": "Shield",
      "dropLevel": 68,
      "inventoryWidth": 2,
      "inventoryHeight": 2,
      "requirements": {
          "level": 68,
          "strength": 0,
          "dexterity": 0,
          "intelligence": 159
      },
      "properties": {
          "block": 25,
          "energy_shield": {
              "max": 77,
              "min": 67
          },
          "movement_speed": -3
      },
      "implicits": [],
      "tags": [
          "int_armour",
          "focus",
          "shield",
          "armour",
          "default"
      ],
      "visualIdentity": {
          "ddsFile": "Art/2DItems/Armours/Shields/ShieldInt6.dds",
          "id": "ShieldInt6"
      }
  },
  {
      "id": "Metadata/Items/Armours/Shields/ShieldStrInt13",
      "name": "Archon Kite Shield",
      "itemClass": "Shield",
      "dropLevel": 68,
      "inventoryWidth": 2,
      "inventoryHeight": 3,
      "requirements": {
          "level": 68,
          "strength": 85,
          "dexterity": 0,
          "intelligence": 85
      },
      "properties": {
          "armour": {
              "max": 179,
              "min": 156
          },
          "block": 22,
          "energy_shield": {
              "max": 37,
              "min": 32
          },
          "movement_speed": -3
      },
      "implicits": [
          "AllResistancesImplicitShield3"
      ],
      "tags": [
          "str_int_armour",
          "str_int_shield",
          "shield",
          "armour",
          "default"
      ],
      "visualIdentity": {
          "ddsFile": "Art/2DItems/Armours/Shields/ShieldStrInt5.dds",
          "id": "ShieldStrInt5"
      }
  },
  {
      "id": "Metadata/Items/Armours/Shields/ShieldDex16",
      "name": "Imperial Buckler",
      "itemClass": "Shield",
      "dropLevel": 69,
      "inventoryWidth": 2,
      "inventoryHeight": 2,
      "requirements": {
          "level": 69,
          "strength": 0,
          "dexterity": 159,
          "intelligence": 0
      },
      "properties": {
          "block": 25,
          "evasion": {
              "max": 506,
              "min": 440
          },
          "movement_speed": -3
      },
      "implicits": [
          "MovementVelocityImplicitShield2"
      ],
      "tags": [
          "dex_armour",
          "dex_shield",
          "shield",
          "armour",
          "default"
      ],
      "visualIdentity": {
          "ddsFile": "Art/2DItems/Armours/Shields/ShieldDex6.dds",
          "id": "ShieldDex6"
      }
  },
  {
      "id": "Metadata/Items/Armours/Shields/ShieldDexInt13",
      "name": "Supreme Spiked Shield",
      "itemClass": "Shield",
      "dropLevel": 70,
      "inventoryWidth": 2,
      "inventoryHeight": 2,
      "requirements": {
          "level": 70,
          "strength": 0,
          "dexterity": 85,
          "intelligence": 85
      },
      "properties": {
          "block": 24,
          "energy_shield": {
              "max": 57,
              "min": 49
          },
          "evasion": {
              "max": 278,
              "min": 242
          },
          "movement_speed": -3
      },
      "implicits": [
          "ChanceToDodgeSpellsImplicitShield2"
      ],
      "tags": [
          "dex_int_armour",
          "dex_int_shield",
          "shield",
          "armour",
          "default"
      ],
      "visualIdentity": {
          "ddsFile": "Art/2DItems/Armours/Shields/ShieldDexInt5.dds",
          "id": "ShieldDexInt5"
      }
  },
  {
      "id": "Metadata/Items/Armours/Shields/ShieldStr17",
      "name": "Pinnacle Tower Shield",
      "itemClass": "Shield",
      "dropLevel": 70,
      "inventoryWidth": 2,
      "inventoryHeight": 4,
      "requirements": {
          "level": 70,
          "strength": 159,
          "dexterity": 0,
          "intelligence": 0
      },
      "properties": {
          "armour": {
              "max": 537,
              "min": 467
          },
          "block": 25,
          "movement_speed": -3
      },
      "implicits": [
          "IncreasedLifeImplicitShield2"
      ],
      "tags": [
          "str_armour",
          "str_shield",
          "shield",
          "armour",
          "default"
      ],
      "visualIdentity": {
          "ddsFile": "Art/2DItems/Armours/Shields/ShieldStr7.dds",
          "id": "ShieldStr7"
      }
  },
  {
      "id": "Metadata/Items/Armours/Shields/ShieldStrDex13",
      "name": "Elegant Round Shield",
      "itemClass": "Shield",
      "dropLevel": 70,
      "inventoryWidth": 2,
      "inventoryHeight": 3,
      "requirements": {
          "level": 70,
          "strength": 85,
          "dexterity": 85,
          "intelligence": 0
      },
      "properties": {
          "armour": {
              "max": 170,
              "min": 148
          },
          "block": 25,
          "evasion": {
              "max": 170,
              "min": 148
          },
          "movement_speed": -3
      },
      "implicits": [
          "BlockRecoveryImplicitShield2"
      ],
      "tags": [
          "str_dex_armour",
          "str_dex_shield",
          "shield",
          "armour",
          "default"
      ],
      "visualIdentity": {
          "ddsFile": "Art/2DItems/Armours/Shields/ShieldStrDex5.dds",
          "id": "ShieldStrDex5"
      }
  },
];

// Staff (10 items)
export const STAFF_BASES: PoeBaseItem[] = [
  {
      "id": "Metadata/Items/Weapons/TwoHandWeapons/Staves/Staff1",
      "name": "Gnarled Branch",
      "itemClass": "Staff",
      "dropLevel": 4,
      "inventoryWidth": 1,
      "inventoryHeight": 4,
      "requirements": {
          "level": 4,
          "strength": 12,
          "dexterity": 0,
          "intelligence": 12
      },
      "properties": {
          "attack_time": 769,
          "critical_strike_chance": 600,
          "physical_damage_max": 19,
          "physical_damage_min": 9,
          "range": 13
      },
      "implicits": [
          "StaffBlockPercentImplicitStaff1"
      ],
      "tags": [
          "small_staff",
          "staff",
          "two_hand_weapon",
          "twohand",
          "weapon",
          "default"
      ],
      "visualIdentity": {
          "ddsFile": "Art/2DItems/Weapons/TwoHandWeapons/Staves/Staff1.dds",
          "id": "Staff1"
      }
  },
  {
      "id": "Metadata/Items/Weapons/TwoHandWeapons/Staves/Staff2",
      "name": "Primitive Staff",
      "itemClass": "Staff",
      "dropLevel": 9,
      "inventoryWidth": 2,
      "inventoryHeight": 4,
      "requirements": {
          "level": 9,
          "strength": 20,
          "dexterity": 0,
          "intelligence": 20
      },
      "properties": {
          "attack_time": 769,
          "critical_strike_chance": 620,
          "physical_damage_max": 31,
          "physical_damage_min": 10,
          "range": 13
      },
      "implicits": [
          "StaffBlockPercentImplicitStaff1"
      ],
      "tags": [
          "staff",
          "two_hand_weapon",
          "twohand",
          "weapon",
          "default"
      ],
      "visualIdentity": {
          "ddsFile": "Art/2DItems/Weapons/TwoHandWeapons/Staves/Staff2.dds",
          "id": "Staff2"
      }
  },
  {
      "id": "Metadata/Items/Weapons/TwoHandWeapons/Staves/Staff3",
      "name": "Long Staff",
      "itemClass": "Staff",
      "dropLevel": 18,
      "inventoryWidth": 2,
      "inventoryHeight": 4,
      "requirements": {
          "level": 18,
          "strength": 35,
          "dexterity": 0,
          "intelligence": 35
      },
      "properties": {
          "attack_time": 769,
          "critical_strike_chance": 600,
          "physical_damage_max": 41,
          "physical_damage_min": 24,
          "range": 13
      },
      "implicits": [
          "StaffBlockPercentImplicitStaff1"
      ],
      "tags": [
          "staff",
          "two_hand_weapon",
          "twohand",
          "weapon",
          "default"
      ],
      "visualIdentity": {
          "ddsFile": "Art/2DItems/Weapons/TwoHandWeapons/Staves/Staff3.dds",
          "id": "Staff3"
      }
  },
  {
      "id": "Metadata/Items/Weapons/TwoHandWeapons/Staves/Staff6",
      "name": "Royal Staff",
      "itemClass": "Staff",
      "dropLevel": 28,
      "inventoryWidth": 2,
      "inventoryHeight": 4,
      "requirements": {
          "level": 28,
          "strength": 51,
          "dexterity": 0,
          "intelligence": 51
      },
      "properties": {
          "attack_time": 870,
          "critical_strike_chance": 650,
          "physical_damage_max": 81,
          "physical_damage_min": 27,
          "range": 13
      },
      "implicits": [
          "StaffBlockPercentImplicitStaff1"
      ],
      "tags": [
          "staff",
          "two_hand_weapon",
          "twohand",
          "weapon",
          "default"
      ],
      "visualIdentity": {
          "ddsFile": "Art/2DItems/Weapons/TwoHandWeapons/Staves/Staff6.dds",
          "id": "Staff6"
      }
  },
  {
      "id": "Metadata/Items/Weapons/TwoHandWeapons/Staves/Staff8",
      "name": "Woodful Staff",
      "itemClass": "Staff",
      "dropLevel": 37,
      "inventoryWidth": 2,
      "inventoryHeight": 4,
      "requirements": {
          "level": 37,
          "strength": 65,
          "dexterity": 0,
          "intelligence": 65
      },
      "properties": {
          "attack_time": 870,
          "critical_strike_chance": 620,
          "physical_damage_max": 102,
          "physical_damage_min": 34,
          "range": 13
      },
      "implicits": [
          "StaffBlockPercentImplicitStaff1"
      ],
      "tags": [
          "staff",
          "two_hand_weapon",
          "twohand",
          "weapon",
          "default"
      ],
      "visualIdentity": {
          "ddsFile": "Art/2DItems/Weapons/TwoHandWeapons/Staves/Staff2.dds",
          "id": "Staff2"
      }
  },
  {
      "id": "Metadata/Items/Weapons/TwoHandWeapons/Staves/Staff9",
      "name": "Quarterstaff",
      "itemClass": "Staff",
      "dropLevel": 45,
      "inventoryWidth": 2,
      "inventoryHeight": 4,
      "requirements": {
          "level": 45,
          "strength": 78,
          "dexterity": 0,
          "intelligence": 78
      },
      "properties": {
          "attack_time": 769,
          "critical_strike_chance": 600,
          "physical_damage_max": 86,
          "physical_damage_min": 51,
          "range": 13
      },
      "implicits": [
          "StaffBlockPercentImplicitStaff1"
      ],
      "tags": [
          "staff",
          "two_hand_weapon",
          "twohand",
          "weapon",
          "default"
      ],
      "visualIdentity": {
          "ddsFile": "Art/2DItems/Weapons/TwoHandWeapons/Staves/Staff3.dds",
          "id": "Staff3"
      }
  },
  {
      "id": "Metadata/Items/Weapons/TwoHandWeapons/Staves/Staff12",
      "name": "Highborn Staff",
      "itemClass": "Staff",
      "dropLevel": 52,
      "inventoryWidth": 2,
      "inventoryHeight": 4,
      "requirements": {
          "level": 52,
          "strength": 89,
          "dexterity": 0,
          "intelligence": 89
      },
      "properties": {
          "attack_time": 870,
          "critical_strike_chance": 650,
          "physical_damage_max": 145,
          "physical_damage_min": 48,
          "range": 13
      },
      "implicits": [
          "StaffBlockPercentImplicitStaff1"
      ],
      "tags": [
          "staff",
          "two_hand_weapon",
          "twohand",
          "weapon",
          "default"
      ],
      "visualIdentity": {
          "ddsFile": "Art/2DItems/Weapons/TwoHandWeapons/Staves/Staff6.dds",
          "id": "Staff6"
      }
  },
  {
      "id": "Metadata/Items/Weapons/TwoHandWeapons/Staves/Staff14",
      "name": "Primordial Staff",
      "itemClass": "Staff",
      "dropLevel": 58,
      "inventoryWidth": 2,
      "inventoryHeight": 4,
      "requirements": {
          "level": 58,
          "strength": 99,
          "dexterity": 0,
          "intelligence": 99
      },
      "properties": {
          "attack_time": 870,
          "critical_strike_chance": 620,
          "physical_damage_max": 165,
          "physical_damage_min": 55,
          "range": 13
      },
      "implicits": [
          "StaffBlockPercentImplicitStaff1"
      ],
      "tags": [
          "staff",
          "two_hand_weapon",
          "twohand",
          "weapon",
          "default"
      ],
      "visualIdentity": {
          "ddsFile": "Art/2DItems/Weapons/TwoHandWeapons/Staves/Staff2.dds",
          "id": "Staff2"
      }
  },
  {
      "id": "Metadata/Items/Weapons/TwoHandWeapons/Staves/Staff15",
      "name": "Lathi",
      "itemClass": "Staff",
      "dropLevel": 62,
      "inventoryWidth": 2,
      "inventoryHeight": 4,
      "requirements": {
          "level": 62,
          "strength": 113,
          "dexterity": 0,
          "intelligence": 113
      },
      "properties": {
          "attack_time": 769,
          "critical_strike_chance": 600,
          "physical_damage_max": 120,
          "physical_damage_min": 72,
          "range": 13
      },
      "implicits": [
          "StaffBlockPercentImplicitStaff1"
      ],
      "tags": [
          "staff",
          "two_hand_weapon",
          "twohand",
          "weapon",
          "default"
      ],
      "visualIdentity": {
          "ddsFile": "Art/2DItems/Weapons/TwoHandWeapons/Staves/Staff3.dds",
          "id": "Staff3"
      }
  },
  {
      "id": "Metadata/Items/Weapons/TwoHandWeapons/Staves/Staff18",
      "name": "Imperial Staff",
      "itemClass": "Staff",
      "dropLevel": 66,
      "inventoryWidth": 2,
      "inventoryHeight": 4,
      "requirements": {
          "level": 66,
          "strength": 113,
          "dexterity": 0,
          "intelligence": 113
      },
      "properties": {
          "attack_time": 870,
          "critical_strike_chance": 700,
          "physical_damage_max": 171,
          "physical_damage_min": 57,
          "range": 13
      },
      "implicits": [
          "StaffBlockPercentImplicitStaff1"
      ],
      "tags": [
          "staff",
          "two_hand_weapon",
          "twohand",
          "weapon",
          "default"
      ],
      "visualIdentity": {
          "ddsFile": "Art/2DItems/Weapons/TwoHandWeapons/Staves/Staff6.dds",
          "id": "Staff6"
      }
  },
];

// Thrusting One Hand Sword (22 items)
export const THRUSTING_ONE_HAND_SWORD_BASES: PoeBaseItem[] = [
  {
      "id": "Metadata/Items/Weapons/OneHandWeapons/OneHandThrustingSwords/Rapier1",
      "name": "Rusted Spike",
      "itemClass": "Thrusting One Hand Sword",
      "dropLevel": 3,
      "inventoryWidth": 1,
      "inventoryHeight": 4,
      "requirements": {
          "level": 3,
          "strength": 0,
          "dexterity": 20,
          "intelligence": 0
      },
      "properties": {
          "attack_time": 645,
          "critical_strike_chance": 550,
          "physical_damage_max": 11,
          "physical_damage_min": 5,
          "range": 14
      },
      "implicits": [
          "CriticalMultiplierImplicitSword1"
      ],
      "tags": [
          "rapier",
          "sword",
          "one_hand_weapon",
          "onehand",
          "weapon",
          "default"
      ],
      "visualIdentity": {
          "ddsFile": "Art/2DItems/Weapons/OneHandWeapons/Rapiers/Rapier1.dds",
          "id": "Rapier1"
      }
  },
  {
      "id": "Metadata/Items/Weapons/OneHandWeapons/OneHandThrustingSwords/Rapier2",
      "name": "Whalebone Rapier",
      "itemClass": "Thrusting One Hand Sword",
      "dropLevel": 7,
      "inventoryWidth": 1,
      "inventoryHeight": 4,
      "requirements": {
          "level": 7,
          "strength": 0,
          "dexterity": 32,
          "intelligence": 0
      },
      "properties": {
          "attack_time": 625,
          "critical_strike_chance": 550,
          "physical_damage_max": 17,
          "physical_damage_min": 4,
          "range": 14
      },
      "implicits": [
          "CriticalMultiplierImplicitSword1"
      ],
      "tags": [
          "rapier",
          "sword",
          "one_hand_weapon",
          "onehand",
          "weapon",
          "default"
      ],
      "visualIdentity": {
          "ddsFile": "Art/2DItems/Weapons/OneHandWeapons/Rapiers/Rapier2.dds",
          "id": "Rapier2"
      }
  },
  {
      "id": "Metadata/Items/Weapons/OneHandWeapons/OneHandThrustingSwords/Rapier3",
      "name": "Battered Foil",
      "itemClass": "Thrusting One Hand Sword",
      "dropLevel": 12,
      "inventoryWidth": 1,
      "inventoryHeight": 4,
      "requirements": {
          "level": 12,
          "strength": 0,
          "dexterity": 47,
          "intelligence": 0
      },
      "properties": {
          "attack_time": 667,
          "critical_strike_chance": 600,
          "physical_damage_max": 20,
          "physical_damage_min": 11,
          "range": 14
      },
      "implicits": [
          "CriticalMultiplierImplicitSword1"
      ],
      "tags": [
          "rapier",
          "sword",
          "one_hand_weapon",
          "onehand",
          "weapon",
          "default"
      ],
      "visualIdentity": {
          "ddsFile": "Art/2DItems/Weapons/OneHandWeapons/Rapiers/Rapier3.dds",
          "id": "Rapier3"
      }
  },
  {
      "id": "Metadata/Items/Weapons/OneHandWeapons/OneHandThrustingSwords/Rapier4",
      "name": "Basket Rapier",
      "itemClass": "Thrusting One Hand Sword",
      "dropLevel": 17,
      "inventoryWidth": 1,
      "inventoryHeight": 4,
      "requirements": {
          "level": 17,
          "strength": 0,
          "dexterity": 62,
          "intelligence": 0
      },
      "properties": {
          "attack_time": 645,
          "critical_strike_chance": 550,
          "physical_damage_max": 25,
          "physical_damage_min": 11,
          "range": 14
      },
      "implicits": [
          "CriticalMultiplierImplicitSword1"
      ],
      "tags": [
          "rapier",
          "sword",
          "one_hand_weapon",
          "onehand",
          "weapon",
          "default"
      ],
      "visualIdentity": {
          "ddsFile": "Art/2DItems/Weapons/OneHandWeapons/Rapiers/Rapier4.dds",
          "id": "Rapier4"
      }
  },
  {
      "id": "Metadata/Items/Weapons/OneHandWeapons/OneHandThrustingSwords/Rapier5",
      "name": "Jagged Foil",
      "itemClass": "Thrusting One Hand Sword",
      "dropLevel": 22,
      "inventoryWidth": 1,
      "inventoryHeight": 4,
      "requirements": {
          "level": 22,
          "strength": 0,
          "dexterity": 77,
          "intelligence": 0
      },
      "properties": {
          "attack_time": 625,
          "critical_strike_chance": 550,
          "physical_damage_max": 29,
          "physical_damage_min": 12,
          "range": 14
      },
      "implicits": [
          "CriticalMultiplierImplicitSword1"
      ],
      "tags": [
          "rapier",
          "sword",
          "one_hand_weapon",
          "onehand",
          "weapon",
          "default"
      ],
      "visualIdentity": {
          "ddsFile": "Art/2DItems/Weapons/OneHandWeapons/Rapiers/Rapier5.dds",
          "id": "Rapier5"
      }
  },
  {
      "id": "Metadata/Items/Weapons/OneHandWeapons/OneHandThrustingSwords/Rapier6",
      "name": "Antique Rapier",
      "itemClass": "Thrusting One Hand Sword",
      "dropLevel": 26,
      "inventoryWidth": 1,
      "inventoryHeight": 4,
      "requirements": {
          "level": 26,
          "strength": 0,
          "dexterity": 89,
          "intelligence": 0
      },
      "properties": {
          "attack_time": 769,
          "critical_strike_chance": 650,
          "physical_damage_max": 46,
          "physical_damage_min": 12,
          "range": 14
      },
      "implicits": [
          "CriticalMultiplierImplicitSword1"
      ],
      "tags": [
          "rapier",
          "sword",
          "one_hand_weapon",
          "onehand",
          "weapon",
          "default"
      ],
      "visualIdentity": {
          "ddsFile": "Art/2DItems/Weapons/OneHandWeapons/Rapiers/Rapier6.dds",
          "id": "Rapier6"
      }
  },
  {
      "id": "Metadata/Items/Weapons/OneHandWeapons/OneHandThrustingSwords/Rapier7",
      "name": "Elegant Foil",
      "itemClass": "Thrusting One Hand Sword",
      "dropLevel": 30,
      "inventoryWidth": 1,
      "inventoryHeight": 4,
      "requirements": {
          "level": 30,
          "strength": 0,
          "dexterity": 101,
          "intelligence": 0
      },
      "properties": {
          "attack_time": 625,
          "critical_strike_chance": 550,
          "physical_damage_max": 33,
          "physical_damage_min": 18,
          "range": 14
      },
      "implicits": [
          "CriticalMultiplierImplicitSword1"
      ],
      "tags": [
          "rapier",
          "sword",
          "one_hand_weapon",
          "onehand",
          "weapon",
          "default"
      ],
      "visualIdentity": {
          "ddsFile": "Art/2DItems/Weapons/OneHandWeapons/Rapiers/Rapier7.dds",
          "id": "Rapier7"
      }
  },
  {
      "id": "Metadata/Items/Weapons/OneHandWeapons/OneHandThrustingSwords/Rapier8",
      "name": "Thorn Rapier",
      "itemClass": "Thrusting One Hand Sword",
      "dropLevel": 34,
      "inventoryWidth": 1,
      "inventoryHeight": 4,
      "requirements": {
          "level": 34,
          "strength": 0,
          "dexterity": 113,
          "intelligence": 0
      },
      "properties": {
          "attack_time": 714,
          "critical_strike_chance": 570,
          "physical_damage_max": 44,
          "physical_damage_min": 19,
          "range": 14
      },
      "implicits": [
          "CriticalMultiplierImplicitSword2"
      ],
      "tags": [
          "rapier",
          "sword",
          "one_hand_weapon",
          "onehand",
          "weapon",
          "default"
      ],
      "visualIdentity": {
          "ddsFile": "Art/2DItems/Weapons/OneHandWeapons/Rapiers/Rapier8.dds",
          "id": "Rapier8"
      }
  },
  {
      "id": "Metadata/Items/Weapons/OneHandWeapons/OneHandThrustingSwords/Rapier9",
      "name": "Wyrmbone Rapier",
      "itemClass": "Thrusting One Hand Sword",
      "dropLevel": 37,
      "inventoryWidth": 1,
      "inventoryHeight": 4,
      "requirements": {
          "level": 37,
          "strength": 0,
          "dexterity": 122,
          "intelligence": 0
      },
      "properties": {
          "attack_time": 667,
          "critical_strike_chance": 550,
          "physical_damage_max": 51,
          "physical_damage_min": 13,
          "range": 14
      },
      "implicits": [
          "CriticalMultiplierImplicitSword1"
      ],
      "tags": [
          "rapier",
          "sword",
          "one_hand_weapon",
          "onehand",
          "weapon",
          "default"
      ],
      "visualIdentity": {
          "ddsFile": "Art/2DItems/Weapons/OneHandWeapons/Rapiers/Rapier2.dds",
          "id": "Rapier2"
      }
  },
  {
      "id": "Metadata/Items/Weapons/OneHandWeapons/OneHandThrustingSwords/Rapier10",
      "name": "Burnished Foil",
      "itemClass": "Thrusting One Hand Sword",
      "dropLevel": 40,
      "inventoryWidth": 1,
      "inventoryHeight": 4,
      "requirements": {
          "level": 40,
          "strength": 0,
          "dexterity": 131,
          "intelligence": 0
      },
      "properties": {
          "attack_time": 714,
          "critical_strike_chance": 600,
          "physical_damage_max": 46,
          "physical_damage_min": 25,
          "range": 14
      },
      "implicits": [
          "CriticalMultiplierImplicitSword1"
      ],
      "tags": [
          "rapier",
          "sword",
          "one_hand_weapon",
          "onehand",
          "weapon",
          "default"
      ],
      "visualIdentity": {
          "ddsFile": "Art/2DItems/Weapons/OneHandWeapons/Rapiers/Rapier3.dds",
          "id": "Rapier3"
      }
  },
  {
      "id": "Metadata/Items/Weapons/OneHandWeapons/OneHandThrustingSwords/Rapier11",
      "name": "Estoc",
      "itemClass": "Thrusting One Hand Sword",
      "dropLevel": 43,
      "inventoryWidth": 1,
      "inventoryHeight": 4,
      "requirements": {
          "level": 43,
          "strength": 0,
          "dexterity": 140,
          "intelligence": 0
      },
      "properties": {
          "attack_time": 667,
          "critical_strike_chance": 550,
          "physical_damage_max": 50,
          "physical_damage_min": 21,
          "range": 14
      },
      "implicits": [
          "CriticalMultiplierImplicitSword1"
      ],
      "tags": [
          "rapier",
          "sword",
          "one_hand_weapon",
          "onehand",
          "weapon",
          "default"
      ],
      "visualIdentity": {
          "ddsFile": "Art/2DItems/Weapons/OneHandWeapons/Rapiers/Rapier4.dds",
          "id": "Rapier4"
      }
  },
  {
      "id": "Metadata/Items/Weapons/OneHandWeapons/OneHandThrustingSwords/Rapier12",
      "name": "Serrated Foil",
      "itemClass": "Thrusting One Hand Sword",
      "dropLevel": 46,
      "inventoryWidth": 1,
      "inventoryHeight": 4,
      "requirements": {
          "level": 46,
          "strength": 0,
          "dexterity": 149,
          "intelligence": 0
      },
      "properties": {
          "attack_time": 625,
          "critical_strike_chance": 550,
          "physical_damage_max": 49,
          "physical_damage_min": 21,
          "range": 14
      },
      "implicits": [
          "CriticalMultiplierImplicitSword1"
      ],
      "tags": [
          "rapier",
          "sword",
          "one_hand_weapon",
          "onehand",
          "weapon",
          "default"
      ],
      "visualIdentity": {
          "ddsFile": "Art/2DItems/Weapons/OneHandWeapons/Rapiers/Rapier5.dds",
          "id": "Rapier5"
      }
  },
  {
      "id": "Metadata/Items/Weapons/OneHandWeapons/OneHandThrustingSwords/Rapier13",
      "name": "Primeval Rapier",
      "itemClass": "Thrusting One Hand Sword",
      "dropLevel": 49,
      "inventoryWidth": 1,
      "inventoryHeight": 4,
      "requirements": {
          "level": 49,
          "strength": 0,
          "dexterity": 158,
          "intelligence": 0
      },
      "properties": {
          "attack_time": 769,
          "critical_strike_chance": 650,
          "physical_damage_max": 73,
          "physical_damage_min": 18,
          "range": 14
      },
      "implicits": [
          "CriticalMultiplierImplicitSword1"
      ],
      "tags": [
          "rapier",
          "sword",
          "one_hand_weapon",
          "onehand",
          "weapon",
          "default"
      ],
      "visualIdentity": {
          "ddsFile": "Art/2DItems/Weapons/OneHandWeapons/Rapiers/Rapier6.dds",
          "id": "Rapier6"
      }
  },
  {
      "id": "Metadata/Items/Weapons/OneHandWeapons/OneHandThrustingSwords/Rapier14",
      "name": "Fancy Foil",
      "itemClass": "Thrusting One Hand Sword",
      "dropLevel": 52,
      "inventoryWidth": 1,
      "inventoryHeight": 4,
      "requirements": {
          "level": 52,
          "strength": 0,
          "dexterity": 167,
          "intelligence": 0
      },
      "properties": {
          "attack_time": 625,
          "critical_strike_chance": 550,
          "physical_damage_max": 51,
          "physical_damage_min": 28,
          "range": 14
      },
      "implicits": [
          "CriticalMultiplierImplicitSword1"
      ],
      "tags": [
          "rapier",
          "sword",
          "one_hand_weapon",
          "onehand",
          "weapon",
          "default"
      ],
      "visualIdentity": {
          "ddsFile": "Art/2DItems/Weapons/OneHandWeapons/Rapiers/Rapier7.dds",
          "id": "Rapier7"
      }
  },
  {
      "id": "Metadata/Items/Weapons/OneHandWeapons/OneHandThrustingSwords/Rapier15",
      "name": "Apex Rapier",
      "itemClass": "Thrusting One Hand Sword",
      "dropLevel": 55,
      "inventoryWidth": 1,
      "inventoryHeight": 4,
      "requirements": {
          "level": 55,
          "strength": 0,
          "dexterity": 176,
          "intelligence": 0
      },
      "properties": {
          "attack_time": 714,
          "critical_strike_chance": 570,
          "physical_damage_max": 67,
          "physical_damage_min": 29,
          "range": 14
      },
      "implicits": [
          "CriticalMultiplierImplicitSword2"
      ],
      "tags": [
          "rapier",
          "sword",
          "one_hand_weapon",
          "onehand",
          "weapon",
          "default"
      ],
      "visualIdentity": {
          "ddsFile": "Art/2DItems/Weapons/OneHandWeapons/Rapiers/Rapier8.dds",
          "id": "Rapier8"
      }
  },
  {
      "id": "Metadata/Items/Weapons/OneHandWeapons/OneHandThrustingSwords/Rapier16",
      "name": "Dragonbone Rapier",
      "itemClass": "Thrusting One Hand Sword",
      "dropLevel": 58,
      "inventoryWidth": 1,
      "inventoryHeight": 4,
      "requirements": {
          "level": 58,
          "strength": 0,
          "dexterity": 185,
          "intelligence": 0
      },
      "properties": {
          "attack_time": 667,
          "critical_strike_chance": 550,
          "physical_damage_max": 75,
          "physical_damage_min": 19,
          "range": 14
      },
      "implicits": [
          "CriticalMultiplierImplicitSword1"
      ],
      "tags": [
          "rapier",
          "sword",
          "one_hand_weapon",
          "onehand",
          "weapon",
          "default"
      ],
      "visualIdentity": {
          "ddsFile": "Art/2DItems/Weapons/OneHandWeapons/Rapiers/Rapier2.dds",
          "id": "Rapier2"
      }
  },
  {
      "id": "Metadata/Items/Weapons/OneHandWeapons/OneHandThrustingSwords/Rapier17",
      "name": "Tempered Foil",
      "itemClass": "Thrusting One Hand Sword",
      "dropLevel": 60,
      "inventoryWidth": 1,
      "inventoryHeight": 4,
      "requirements": {
          "level": 60,
          "strength": 0,
          "dexterity": 212,
          "intelligence": 0
      },
      "properties": {
          "attack_time": 714,
          "critical_strike_chance": 600,
          "physical_damage_max": 65,
          "physical_damage_min": 35,
          "range": 14
      },
      "implicits": [
          "CriticalMultiplierImplicitSword1"
      ],
      "tags": [
          "rapier",
          "sword",
          "one_hand_weapon",
          "onehand",
          "weapon",
          "default"
      ],
      "visualIdentity": {
          "ddsFile": "Art/2DItems/Weapons/OneHandWeapons/Rapiers/Rapier3.dds",
          "id": "Rapier3"
      }
  },
  {
      "id": "Metadata/Items/Weapons/OneHandWeapons/OneHandThrustingSwords/Rapier18",
      "name": "Pecoraro",
      "itemClass": "Thrusting One Hand Sword",
      "dropLevel": 62,
      "inventoryWidth": 1,
      "inventoryHeight": 4,
      "requirements": {
          "level": 62,
          "strength": 0,
          "dexterity": 212,
          "intelligence": 0
      },
      "properties": {
          "attack_time": 667,
          "critical_strike_chance": 550,
          "physical_damage_max": 69,
          "physical_damage_min": 29,
          "range": 14
      },
      "implicits": [
          "CriticalMultiplierImplicitSword1"
      ],
      "tags": [
          "rapier",
          "sword",
          "one_hand_weapon",
          "onehand",
          "weapon",
          "default"
      ],
      "visualIdentity": {
          "ddsFile": "Art/2DItems/Weapons/OneHandWeapons/Rapiers/Rapier4.dds",
          "id": "Rapier4"
      }
  },
  {
      "id": "Metadata/Items/Weapons/OneHandWeapons/OneHandThrustingSwords/Rapier19",
      "name": "Spiraled Foil",
      "itemClass": "Thrusting One Hand Sword",
      "dropLevel": 64,
      "inventoryWidth": 1,
      "inventoryHeight": 4,
      "requirements": {
          "level": 64,
          "strength": 0,
          "dexterity": 212,
          "intelligence": 0
      },
      "properties": {
          "attack_time": 625,
          "critical_strike_chance": 550,
          "physical_damage_max": 64,
          "physical_damage_min": 27,
          "range": 14
      },
      "implicits": [
          "CriticalMultiplierImplicitSword1"
      ],
      "tags": [
          "rapier",
          "sword",
          "one_hand_weapon",
          "onehand",
          "weapon",
          "default"
      ],
      "visualIdentity": {
          "ddsFile": "Art/2DItems/Weapons/OneHandWeapons/Rapiers/Rapier5.dds",
          "id": "Rapier5"
      }
  },
  {
      "id": "Metadata/Items/Weapons/OneHandWeapons/OneHandThrustingSwords/Rapier20",
      "name": "Vaal Rapier",
      "itemClass": "Thrusting One Hand Sword",
      "dropLevel": 66,
      "inventoryWidth": 1,
      "inventoryHeight": 4,
      "requirements": {
          "level": 66,
          "strength": 0,
          "dexterity": 212,
          "intelligence": 0
      },
      "properties": {
          "attack_time": 769,
          "critical_strike_chance": 650,
          "physical_damage_max": 87,
          "physical_damage_min": 22,
          "range": 14
      },
      "implicits": [
          "CriticalMultiplierImplicitSword1"
      ],
      "tags": [
          "rapier",
          "sword",
          "one_hand_weapon",
          "onehand",
          "weapon",
          "default"
      ],
      "visualIdentity": {
          "ddsFile": "Art/2DItems/Weapons/OneHandWeapons/Rapiers/Rapier6.dds",
          "id": "Rapier6"
      }
  },
  {
      "id": "Metadata/Items/Weapons/OneHandWeapons/OneHandThrustingSwords/Rapier21",
      "name": "Jewelled Foil",
      "itemClass": "Thrusting One Hand Sword",
      "dropLevel": 68,
      "inventoryWidth": 1,
      "inventoryHeight": 4,
      "requirements": {
          "level": 68,
          "strength": 0,
          "dexterity": 212,
          "intelligence": 0
      },
      "properties": {
          "attack_time": 625,
          "critical_strike_chance": 550,
          "physical_damage_max": 60,
          "physical_damage_min": 32,
          "range": 14
      },
      "implicits": [
          "CriticalMultiplierImplicitSword1"
      ],
      "tags": [
          "rapier",
          "sword",
          "one_hand_weapon",
          "onehand",
          "weapon",
          "default"
      ],
      "visualIdentity": {
          "ddsFile": "Art/2DItems/Weapons/OneHandWeapons/Rapiers/Rapier7.dds",
          "id": "Rapier7"
      }
  },
  {
      "id": "Metadata/Items/Weapons/OneHandWeapons/OneHandThrustingSwords/Rapier22",
      "name": "Harpy Rapier",
      "itemClass": "Thrusting One Hand Sword",
      "dropLevel": 70,
      "inventoryWidth": 1,
      "inventoryHeight": 4,
      "requirements": {
          "level": 70,
          "strength": 0,
          "dexterity": 212,
          "intelligence": 0
      },
      "properties": {
          "attack_time": 714,
          "critical_strike_chance": 570,
          "physical_damage_max": 72,
          "physical_damage_min": 31,
          "range": 14
      },
      "implicits": [
          "CriticalMultiplierImplicitSword2"
      ],
      "tags": [
          "rapier",
          "sword",
          "one_hand_weapon",
          "onehand",
          "weapon",
          "default"
      ],
      "visualIdentity": {
          "ddsFile": "Art/2DItems/Weapons/OneHandWeapons/Rapiers/Rapier8.dds",
          "id": "Rapier8"
      }
  },
];

// Two Hand Axe (19 items)
export const TWO_HAND_AXE_BASES: PoeBaseItem[] = [
  {
      "id": "Metadata/Items/Weapons/TwoHandWeapons/TwoHandAxes/TwoHandAxe1",
      "name": "Stone Axe",
      "itemClass": "Two Hand Axe",
      "dropLevel": 4,
      "inventoryWidth": 2,
      "inventoryHeight": 4,
      "requirements": {
          "level": 4,
          "strength": 17,
          "dexterity": 8,
          "intelligence": 0
      },
      "properties": {
          "attack_time": 769,
          "critical_strike_chance": 500,
          "physical_damage_max": 20,
          "physical_damage_min": 12,
          "range": 13
      },
      "implicits": [],
      "tags": [
          "axe",
          "two_hand_weapon",
          "twohand",
          "weapon",
          "default"
      ],
      "visualIdentity": {
          "ddsFile": "Art/2DItems/Weapons/TwoHandWeapons/TwoHandAxes/TwoHandAxe1.dds",
          "id": "TwoHandAxe1"
      }
  },
  {
      "id": "Metadata/Items/Weapons/TwoHandWeapons/TwoHandAxes/TwoHandAxe2",
      "name": "Jade Chopper",
      "itemClass": "Two Hand Axe",
      "dropLevel": 9,
      "inventoryWidth": 2,
      "inventoryHeight": 4,
      "requirements": {
          "level": 9,
          "strength": 31,
          "dexterity": 9,
          "intelligence": 0
      },
      "properties": {
          "attack_time": 800,
          "critical_strike_chance": 500,
          "physical_damage_max": 30,
          "physical_damage_min": 19,
          "range": 13
      },
      "implicits": [],
      "tags": [
          "axe",
          "two_hand_weapon",
          "twohand",
          "weapon",
          "default"
      ],
      "visualIdentity": {
          "ddsFile": "Art/2DItems/Weapons/TwoHandWeapons/TwoHandAxes/TwoHandAxe2.dds",
          "id": "TwoHandAxe2"
      }
  },
  {
      "id": "Metadata/Items/Weapons/TwoHandWeapons/TwoHandAxes/TwoHandAxe3",
      "name": "Woodsplitter",
      "itemClass": "Two Hand Axe",
      "dropLevel": 13,
      "inventoryWidth": 2,
      "inventoryHeight": 4,
      "requirements": {
          "level": 13,
          "strength": 36,
          "dexterity": 17,
          "intelligence": 0
      },
      "properties": {
          "attack_time": 769,
          "critical_strike_chance": 500,
          "physical_damage_max": 39,
          "physical_damage_min": 19,
          "range": 13
      },
      "implicits": [],
      "tags": [
          "axe",
          "two_hand_weapon",
          "twohand",
          "weapon",
          "default"
      ],
      "visualIdentity": {
          "ddsFile": "Art/2DItems/Weapons/TwoHandWeapons/TwoHandAxes/TwoHandAxe3.dds",
          "id": "TwoHandAxe3"
      }
  },
  {
      "id": "Metadata/Items/Weapons/TwoHandWeapons/TwoHandAxes/TwoHandAxe4",
      "name": "Poleaxe",
      "itemClass": "Two Hand Axe",
      "dropLevel": 18,
      "inventoryWidth": 2,
      "inventoryHeight": 4,
      "requirements": {
          "level": 18,
          "strength": 44,
          "dexterity": 25,
          "intelligence": 0
      },
      "properties": {
          "attack_time": 769,
          "critical_strike_chance": 500,
          "physical_damage_max": 43,
          "physical_damage_min": 29,
          "range": 13
      },
      "implicits": [],
      "tags": [
          "axe",
          "two_hand_weapon",
          "twohand",
          "weapon",
          "default"
      ],
      "visualIdentity": {
          "ddsFile": "Art/2DItems/Weapons/TwoHandWeapons/TwoHandAxes/TwoHandAxe4.dds",
          "id": "TwoHandAxe4"
      }
  },
  {
      "id": "Metadata/Items/Weapons/TwoHandWeapons/TwoHandAxes/TwoHandAxe5",
      "name": "Double Axe",
      "itemClass": "Two Hand Axe",
      "dropLevel": 23,
      "inventoryWidth": 2,
      "inventoryHeight": 4,
      "requirements": {
          "level": 23,
          "strength": 62,
          "dexterity": 27,
          "intelligence": 0
      },
      "properties": {
          "attack_time": 800,
          "critical_strike_chance": 500,
          "physical_damage_max": 60,
          "physical_damage_min": 36,
          "range": 13
      },
      "implicits": [],
      "tags": [
          "axe",
          "two_hand_weapon",
          "twohand",
          "weapon",
          "default"
      ],
      "visualIdentity": {
          "ddsFile": "Art/2DItems/Weapons/TwoHandWeapons/TwoHandAxes/TwoHandAxe5.dds",
          "id": "TwoHandAxe5"
      }
  },
  {
      "id": "Metadata/Items/Weapons/TwoHandWeapons/TwoHandAxes/TwoHandAxe6",
      "name": "Gilded Axe",
      "itemClass": "Two Hand Axe",
      "dropLevel": 28,
      "inventoryWidth": 2,
      "inventoryHeight": 4,
      "requirements": {
          "level": 28,
          "strength": 64,
          "dexterity": 37,
          "intelligence": 0
      },
      "properties": {
          "attack_time": 769,
          "critical_strike_chance": 500,
          "physical_damage_max": 58,
          "physical_damage_min": 43,
          "range": 13
      },
      "implicits": [],
      "tags": [
          "axe",
          "two_hand_weapon",
          "twohand",
          "weapon",
          "default"
      ],
      "visualIdentity": {
          "ddsFile": "Art/2DItems/Weapons/TwoHandWeapons/TwoHandAxes/TwoHandAxe6.dds",
          "id": "TwoHandAxe6"
      }
  },
  {
      "id": "Metadata/Items/Weapons/TwoHandWeapons/TwoHandAxes/TwoHandAxe7",
      "name": "Shadow Axe",
      "itemClass": "Two Hand Axe",
      "dropLevel": 33,
      "inventoryWidth": 2,
      "inventoryHeight": 4,
      "requirements": {
          "level": 33,
          "strength": 80,
          "dexterity": 37,
          "intelligence": 0
      },
      "properties": {
          "attack_time": 800,
          "critical_strike_chance": 500,
          "physical_damage_max": 73,
          "physical_damage_min": 49,
          "range": 13
      },
      "implicits": [],
      "tags": [
          "axe",
          "two_hand_weapon",
          "twohand",
          "weapon",
          "default"
      ],
      "visualIdentity": {
          "ddsFile": "Art/2DItems/Weapons/TwoHandWeapons/TwoHandAxes/TwoHandAxe7.dds",
          "id": "TwoHandAxe7"
      }
  },
  {
      "id": "Metadata/Items/Weapons/TwoHandWeapons/TwoHandAxes/TwoHandAxe8",
      "name": "Jasper Chopper",
      "itemClass": "Two Hand Axe",
      "dropLevel": 37,
      "inventoryWidth": 2,
      "inventoryHeight": 4,
      "requirements": {
          "level": 37,
          "strength": 100,
          "dexterity": 29,
          "intelligence": 0
      },
      "properties": {
          "attack_time": 870,
          "critical_strike_chance": 500,
          "physical_damage_max": 91,
          "physical_damage_min": 58,
          "range": 13
      },
      "implicits": [],
      "tags": [
          "axe",
          "two_hand_weapon",
          "twohand",
          "weapon",
          "default"
      ],
      "visualIdentity": {
          "ddsFile": "Art/2DItems/Weapons/TwoHandWeapons/TwoHandAxes/TwoHandAxe2.dds",
          "id": "TwoHandAxe2"
      }
  },
  {
      "id": "Metadata/Items/Weapons/TwoHandWeapons/TwoHandAxes/TwoHandAxe9",
      "name": "Timber Axe",
      "itemClass": "Two Hand Axe",
      "dropLevel": 41,
      "inventoryWidth": 2,
      "inventoryHeight": 4,
      "requirements": {
          "level": 41,
          "strength": 97,
          "dexterity": 45,
          "intelligence": 0
      },
      "properties": {
          "attack_time": 800,
          "critical_strike_chance": 500,
          "physical_damage_max": 99,
          "physical_damage_min": 48,
          "range": 13
      },
      "implicits": [],
      "tags": [
          "axe",
          "two_hand_weapon",
          "twohand",
          "weapon",
          "default"
      ],
      "visualIdentity": {
          "ddsFile": "Art/2DItems/Weapons/TwoHandWeapons/TwoHandAxes/TwoHandAxe3.dds",
          "id": "TwoHandAxe3"
      }
  },
  {
      "id": "Metadata/Items/Weapons/TwoHandWeapons/TwoHandAxes/TwoHandAxe10",
      "name": "Headsman Axe",
      "itemClass": "Two Hand Axe",
      "dropLevel": 45,
      "inventoryWidth": 2,
      "inventoryHeight": 4,
      "requirements": {
          "level": 45,
          "strength": 99,
          "dexterity": 57,
          "intelligence": 0
      },
      "properties": {
          "attack_time": 769,
          "critical_strike_chance": 500,
          "physical_damage_max": 92,
          "physical_damage_min": 61,
          "range": 13
      },
      "implicits": [],
      "tags": [
          "axe",
          "two_hand_weapon",
          "twohand",
          "weapon",
          "default"
      ],
      "visualIdentity": {
          "ddsFile": "Art/2DItems/Weapons/TwoHandWeapons/TwoHandAxes/TwoHandAxe4.dds",
          "id": "TwoHandAxe4"
      }
  },
  {
      "id": "Metadata/Items/Weapons/TwoHandWeapons/TwoHandAxes/TwoHandAxe11",
      "name": "Labrys",
      "itemClass": "Two Hand Axe",
      "dropLevel": 49,
      "inventoryWidth": 2,
      "inventoryHeight": 4,
      "requirements": {
          "level": 49,
          "strength": 122,
          "dexterity": 53,
          "intelligence": 0
      },
      "properties": {
          "attack_time": 833,
          "critical_strike_chance": 500,
          "physical_damage_max": 123,
          "physical_damage_min": 74,
          "range": 13
      },
      "implicits": [],
      "tags": [
          "axe",
          "two_hand_weapon",
          "twohand",
          "weapon",
          "default"
      ],
      "visualIdentity": {
          "ddsFile": "Art/2DItems/Weapons/TwoHandWeapons/TwoHandAxes/TwoHandAxe5.dds",
          "id": "TwoHandAxe5"
      }
  },
  {
      "id": "Metadata/Items/Weapons/TwoHandWeapons/TwoHandAxes/TwoHandAxe12",
      "name": "Noble Axe",
      "itemClass": "Two Hand Axe",
      "dropLevel": 52,
      "inventoryWidth": 2,
      "inventoryHeight": 4,
      "requirements": {
          "level": 52,
          "strength": 113,
          "dexterity": 65,
          "intelligence": 0
      },
      "properties": {
          "attack_time": 769,
          "critical_strike_chance": 500,
          "physical_damage_max": 103,
          "physical_damage_min": 76,
          "range": 13
      },
      "implicits": [],
      "tags": [
          "axe",
          "two_hand_weapon",
          "twohand",
          "weapon",
          "default"
      ],
      "visualIdentity": {
          "ddsFile": "Art/2DItems/Weapons/TwoHandWeapons/TwoHandAxes/TwoHandAxe6.dds",
          "id": "TwoHandAxe6"
      }
  },
  {
      "id": "Metadata/Items/Weapons/TwoHandWeapons/TwoHandAxes/TwoHandAxe13",
      "name": "Abyssal Axe",
      "itemClass": "Two Hand Axe",
      "dropLevel": 55,
      "inventoryWidth": 2,
      "inventoryHeight": 4,
      "requirements": {
          "level": 55,
          "strength": 128,
          "dexterity": 60,
          "intelligence": 0
      },
      "properties": {
          "attack_time": 800,
          "critical_strike_chance": 500,
          "physical_damage_max": 121,
          "physical_damage_min": 81,
          "range": 13
      },
      "implicits": [],
      "tags": [
          "axe",
          "two_hand_weapon",
          "twohand",
          "weapon",
          "default"
      ],
      "visualIdentity": {
          "ddsFile": "Art/2DItems/Weapons/TwoHandWeapons/TwoHandAxes/TwoHandAxe7.dds",
          "id": "TwoHandAxe7"
      }
  },
  {
      "id": "Metadata/Items/Weapons/TwoHandWeapons/TwoHandAxes/TwoHandAxe14",
      "name": "Karui Chopper",
      "itemClass": "Two Hand Axe",
      "dropLevel": 58,
      "inventoryWidth": 2,
      "inventoryHeight": 4,
      "requirements": {
          "level": 58,
          "strength": 151,
          "dexterity": 43,
          "intelligence": 0
      },
      "properties": {
          "attack_time": 952,
          "critical_strike_chance": 500,
          "physical_damage_max": 189,
          "physical_damage_min": 121,
          "range": 13
      },
      "implicits": [],
      "tags": [
          "axe",
          "two_hand_weapon",
          "twohand",
          "weapon",
          "default"
      ],
      "visualIdentity": {
          "ddsFile": "Art/2DItems/Weapons/TwoHandWeapons/TwoHandAxes/TwoHandAxe2.dds",
          "id": "TwoHandAxe2"
      }
  },
  {
      "id": "Metadata/Items/Weapons/TwoHandWeapons/TwoHandAxes/TwoHandAxe15",
      "name": "Sundering Axe",
      "itemClass": "Two Hand Axe",
      "dropLevel": 60,
      "inventoryWidth": 2,
      "inventoryHeight": 4,
      "requirements": {
          "level": 60,
          "strength": 149,
          "dexterity": 76,
          "intelligence": 0
      },
      "properties": {
          "attack_time": 769,
          "critical_strike_chance": 500,
          "physical_damage_max": 155,
          "physical_damage_min": 74,
          "range": 13
      },
      "implicits": [
          "BleedDotMultiplier2HImplicit1"
      ],
      "tags": [
          "axe",
          "two_hand_weapon",
          "twohand",
          "weapon",
          "default"
      ],
      "visualIdentity": {
          "ddsFile": "Art/2DItems/Weapons/TwoHandWeapons/TwoHandAxes/TwoHandAxe3.dds",
          "id": "TwoHandAxe3"
      }
  },
  {
      "id": "Metadata/Items/Weapons/TwoHandWeapons/TwoHandAxes/TwoHandAxe16",
      "name": "Ezomyte Axe",
      "itemClass": "Two Hand Axe",
      "dropLevel": 62,
      "inventoryWidth": 2,
      "inventoryHeight": 4,
      "requirements": {
          "level": 62,
          "strength": 140,
          "dexterity": 86,
          "intelligence": 0
      },
      "properties": {
          "attack_time": 741,
          "critical_strike_chance": 570,
          "physical_damage_max": 131,
          "physical_damage_min": 87,
          "range": 13
      },
      "implicits": [],
      "tags": [
          "axe",
          "two_hand_weapon",
          "twohand",
          "weapon",
          "default"
      ],
      "visualIdentity": {
          "ddsFile": "Art/2DItems/Weapons/TwoHandWeapons/TwoHandAxes/TwoHandAxe4.dds",
          "id": "TwoHandAxe4"
      }
  },
  {
      "id": "Metadata/Items/Weapons/TwoHandWeapons/TwoHandAxes/TwoHandAxe17",
      "name": "Vaal Axe",
      "itemClass": "Two Hand Axe",
      "dropLevel": 64,
      "inventoryWidth": 2,
      "inventoryHeight": 4,
      "requirements": {
          "level": 64,
          "strength": 158,
          "dexterity": 76,
          "intelligence": 0
      },
      "properties": {
          "attack_time": 870,
          "critical_strike_chance": 500,
          "physical_damage_max": 174,
          "physical_damage_min": 104,
          "range": 13
      },
      "implicits": [
          "LocalMaimOnHit2HImplicit_1"
      ],
      "tags": [
          "axe",
          "two_hand_weapon",
          "twohand",
          "weapon",
          "default"
      ],
      "visualIdentity": {
          "ddsFile": "Art/2DItems/Weapons/TwoHandWeapons/TwoHandAxes/TwoHandAxe5.dds",
          "id": "TwoHandAxe5"
      }
  },
  {
      "id": "Metadata/Items/Weapons/TwoHandWeapons/TwoHandAxes/TwoHandAxe18",
      "name": "Despot Axe",
      "itemClass": "Two Hand Axe",
      "dropLevel": 66,
      "inventoryWidth": 2,
      "inventoryHeight": 4,
      "requirements": {
          "level": 66,
          "strength": 140,
          "dexterity": 86,
          "intelligence": 0
      },
      "properties": {
          "attack_time": 714,
          "critical_strike_chance": 500,
          "physical_damage_max": 122,
          "physical_damage_min": 90,
          "range": 13
      },
      "implicits": [],
      "tags": [
          "axe",
          "two_hand_weapon",
          "twohand",
          "weapon",
          "default"
      ],
      "visualIdentity": {
          "ddsFile": "Art/2DItems/Weapons/TwoHandWeapons/TwoHandAxes/TwoHandAxe6.dds",
          "id": "TwoHandAxe6"
      }
  },
  {
      "id": "Metadata/Items/Weapons/TwoHandWeapons/TwoHandAxes/TwoHandAxe19",
      "name": "Void Axe",
      "itemClass": "Two Hand Axe",
      "dropLevel": 68,
      "inventoryWidth": 2,
      "inventoryHeight": 4,
      "requirements": {
          "level": 68,
          "strength": 149,
          "dexterity": 76,
          "intelligence": 0
      },
      "properties": {
          "attack_time": 800,
          "critical_strike_chance": 600,
          "physical_damage_max": 144,
          "physical_damage_min": 96,
          "range": 13
      },
      "implicits": [],
      "tags": [
          "axe",
          "two_hand_weapon",
          "twohand",
          "weapon",
          "default"
      ],
      "visualIdentity": {
          "ddsFile": "Art/2DItems/Weapons/TwoHandWeapons/TwoHandAxes/TwoHandAxe7.dds",
          "id": "TwoHandAxe7"
      }
  },
];

// Two Hand Mace (19 items)
export const TWO_HAND_MACE_BASES: PoeBaseItem[] = [
  {
      "id": "Metadata/Items/Weapons/TwoHandWeapons/TwoHandMaces/TwoHandMace1",
      "name": "Driftwood Maul",
      "itemClass": "Two Hand Mace",
      "dropLevel": 3,
      "inventoryWidth": 2,
      "inventoryHeight": 4,
      "requirements": {
          "level": 3,
          "strength": 20,
          "dexterity": 0,
          "intelligence": 0
      },
      "properties": {
          "attack_time": 769,
          "critical_strike_chance": 500,
          "physical_damage_max": 16,
          "physical_damage_min": 10,
          "range": 13
      },
      "implicits": [
          "StunDurationImplicitMace1"
      ],
      "tags": [
          "mace",
          "two_hand_weapon",
          "twohand",
          "weapon",
          "default"
      ],
      "visualIdentity": {
          "ddsFile": "Art/2DItems/Weapons/TwoHandWeapons/TwoHandMaces/TwoHandMace1.dds",
          "id": "TwoHandMace1"
      }
  },
  {
      "id": "Metadata/Items/Weapons/TwoHandWeapons/TwoHandMaces/TwoHandMace2",
      "name": "Tribal Maul",
      "itemClass": "Two Hand Mace",
      "dropLevel": 8,
      "inventoryWidth": 2,
      "inventoryHeight": 4,
      "requirements": {
          "level": 8,
          "strength": 35,
          "dexterity": 0,
          "intelligence": 0
      },
      "properties": {
          "attack_time": 800,
          "critical_strike_chance": 500,
          "physical_damage_max": 25,
          "physical_damage_min": 17,
          "range": 13
      },
      "implicits": [
          "StunDurationImplicitMace1"
      ],
      "tags": [
          "mace",
          "two_hand_weapon",
          "twohand",
          "weapon",
          "default"
      ],
      "visualIdentity": {
          "ddsFile": "Art/2DItems/Weapons/TwoHandWeapons/TwoHandMaces/TwoHandMace2.dds",
          "id": "TwoHandMace2"
      }
  },
  {
      "id": "Metadata/Items/Weapons/TwoHandWeapons/TwoHandMaces/TwoHandMace3",
      "name": "Mallet",
      "itemClass": "Two Hand Mace",
      "dropLevel": 12,
      "inventoryWidth": 2,
      "inventoryHeight": 4,
      "requirements": {
          "level": 12,
          "strength": 47,
          "dexterity": 0,
          "intelligence": 0
      },
      "properties": {
          "attack_time": 769,
          "critical_strike_chance": 500,
          "physical_damage_max": 33,
          "physical_damage_min": 16,
          "range": 13
      },
      "implicits": [
          "StunDurationImplicitMace1"
      ],
      "tags": [
          "mace",
          "two_hand_weapon",
          "twohand",
          "weapon",
          "default"
      ],
      "visualIdentity": {
          "ddsFile": "Art/2DItems/Weapons/TwoHandWeapons/TwoHandMaces/TwoHandMace3.dds",
          "id": "TwoHandMace3"
      }
  },
  {
      "id": "Metadata/Items/Weapons/TwoHandWeapons/TwoHandMaces/TwoHandMace4",
      "name": "Sledgehammer",
      "itemClass": "Two Hand Mace",
      "dropLevel": 17,
      "inventoryWidth": 2,
      "inventoryHeight": 4,
      "requirements": {
          "level": 17,
          "strength": 62,
          "dexterity": 0,
          "intelligence": 0
      },
      "properties": {
          "attack_time": 769,
          "critical_strike_chance": 500,
          "physical_damage_max": 38,
          "physical_damage_min": 25,
          "range": 13
      },
      "implicits": [
          "StunDurationImplicitMace2"
      ],
      "tags": [
          "mace",
          "two_hand_weapon",
          "twohand",
          "weapon",
          "default"
      ],
      "visualIdentity": {
          "ddsFile": "Art/2DItems/Weapons/TwoHandWeapons/TwoHandMaces/TwoHandMace4.dds",
          "id": "TwoHandMace4"
      }
  },
  {
      "id": "Metadata/Items/Weapons/TwoHandWeapons/TwoHandMaces/TwoHandMace5",
      "name": "Jagged Maul",
      "itemClass": "Two Hand Mace",
      "dropLevel": 22,
      "inventoryWidth": 2,
      "inventoryHeight": 4,
      "requirements": {
          "level": 22,
          "strength": 77,
          "dexterity": 0,
          "intelligence": 0
      },
      "properties": {
          "attack_time": 769,
          "critical_strike_chance": 500,
          "physical_damage_max": 49,
          "physical_damage_min": 27,
          "range": 13
      },
      "implicits": [
          "StunDurationImplicitMace1"
      ],
      "tags": [
          "mace",
          "two_hand_weapon",
          "twohand",
          "weapon",
          "default"
      ],
      "visualIdentity": {
          "ddsFile": "Art/2DItems/Weapons/TwoHandWeapons/TwoHandMaces/TwoHandMace5.dds",
          "id": "TwoHandMace5"
      }
  },
  {
      "id": "Metadata/Items/Weapons/TwoHandWeapons/TwoHandMaces/TwoHandMace6",
      "name": "Brass Maul",
      "itemClass": "Two Hand Mace",
      "dropLevel": 27,
      "inventoryWidth": 2,
      "inventoryHeight": 4,
      "requirements": {
          "level": 27,
          "strength": 92,
          "dexterity": 0,
          "intelligence": 0
      },
      "properties": {
          "attack_time": 833,
          "critical_strike_chance": 500,
          "physical_damage_max": 60,
          "physical_damage_min": 40,
          "range": 13
      },
      "implicits": [
          "StunDurationImplicitMace1"
      ],
      "tags": [
          "mace",
          "two_hand_weapon",
          "twohand",
          "weapon",
          "default"
      ],
      "visualIdentity": {
          "ddsFile": "Art/2DItems/Weapons/TwoHandWeapons/TwoHandMaces/TwoHandMace6.dds",
          "id": "TwoHandMace6"
      }
  },
  {
      "id": "Metadata/Items/Weapons/TwoHandWeapons/TwoHandMaces/TwoHandMace7",
      "name": "Fright Maul",
      "itemClass": "Two Hand Mace",
      "dropLevel": 32,
      "inventoryWidth": 2,
      "inventoryHeight": 4,
      "requirements": {
          "level": 32,
          "strength": 107,
          "dexterity": 0,
          "intelligence": 0
      },
      "properties": {
          "attack_time": 800,
          "critical_strike_chance": 500,
          "physical_damage_max": 62,
          "physical_damage_min": 46,
          "range": 13
      },
      "implicits": [
          "StunDurationImplicitMace1"
      ],
      "tags": [
          "mace",
          "two_hand_weapon",
          "twohand",
          "weapon",
          "default"
      ],
      "visualIdentity": {
          "ddsFile": "Art/2DItems/Weapons/TwoHandWeapons/TwoHandMaces/TwoHandMace7.dds",
          "id": "TwoHandMace7"
      }
  },
  {
      "id": "Metadata/Items/Weapons/TwoHandWeapons/TwoHandMaces/TwoHandMace8",
      "name": "Totemic Maul",
      "itemClass": "Two Hand Mace",
      "dropLevel": 36,
      "inventoryWidth": 2,
      "inventoryHeight": 4,
      "requirements": {
          "level": 36,
          "strength": 119,
          "dexterity": 0,
          "intelligence": 0
      },
      "properties": {
          "attack_time": 909,
          "critical_strike_chance": 500,
          "physical_damage_max": 85,
          "physical_damage_min": 57,
          "range": 13
      },
      "implicits": [
          "StunDurationImplicitMace1"
      ],
      "tags": [
          "mace",
          "two_hand_weapon",
          "twohand",
          "weapon",
          "default"
      ],
      "visualIdentity": {
          "ddsFile": "Art/2DItems/Weapons/TwoHandWeapons/TwoHandMaces/TwoHandMace2.dds",
          "id": "TwoHandMace2"
      }
  },
  {
      "id": "Metadata/Items/Weapons/TwoHandWeapons/TwoHandMaces/TwoHandMace9",
      "name": "Great Mallet",
      "itemClass": "Two Hand Mace",
      "dropLevel": 40,
      "inventoryWidth": 2,
      "inventoryHeight": 4,
      "requirements": {
          "level": 40,
          "strength": 131,
          "dexterity": 0,
          "intelligence": 0
      },
      "properties": {
          "attack_time": 800,
          "critical_strike_chance": 500,
          "physical_damage_max": 88,
          "physical_damage_min": 43,
          "range": 13
      },
      "implicits": [
          "StunDurationImplicitMace1"
      ],
      "tags": [
          "mace",
          "two_hand_weapon",
          "twohand",
          "weapon",
          "default"
      ],
      "visualIdentity": {
          "ddsFile": "Art/2DItems/Weapons/TwoHandWeapons/TwoHandMaces/TwoHandMace3.dds",
          "id": "TwoHandMace3"
      }
  },
  {
      "id": "Metadata/Items/Weapons/TwoHandWeapons/TwoHandMaces/TwoHandMace10",
      "name": "Steelhead",
      "itemClass": "Two Hand Mace",
      "dropLevel": 44,
      "inventoryWidth": 2,
      "inventoryHeight": 4,
      "requirements": {
          "level": 44,
          "strength": 143,
          "dexterity": 0,
          "intelligence": 0
      },
      "properties": {
          "attack_time": 769,
          "critical_strike_chance": 500,
          "physical_damage_max": 81,
          "physical_damage_min": 54,
          "range": 13
      },
      "implicits": [
          "StunDurationImplicitMace2"
      ],
      "tags": [
          "mace",
          "two_hand_weapon",
          "twohand",
          "weapon",
          "default"
      ],
      "visualIdentity": {
          "ddsFile": "Art/2DItems/Weapons/TwoHandWeapons/TwoHandMaces/TwoHandMace4.dds",
          "id": "TwoHandMace4"
      }
  },
  {
      "id": "Metadata/Items/Weapons/TwoHandWeapons/TwoHandMaces/TwoHandMace11",
      "name": "Spiny Maul",
      "itemClass": "Two Hand Mace",
      "dropLevel": 48,
      "inventoryWidth": 2,
      "inventoryHeight": 4,
      "requirements": {
          "level": 48,
          "strength": 155,
          "dexterity": 0,
          "intelligence": 0
      },
      "properties": {
          "attack_time": 800,
          "critical_strike_chance": 500,
          "physical_damage_max": 103,
          "physical_damage_min": 55,
          "range": 13
      },
      "implicits": [
          "StunDurationImplicitMace1"
      ],
      "tags": [
          "mace",
          "two_hand_weapon",
          "twohand",
          "weapon",
          "default"
      ],
      "visualIdentity": {
          "ddsFile": "Art/2DItems/Weapons/TwoHandWeapons/TwoHandMaces/TwoHandMace5.dds",
          "id": "TwoHandMace5"
      }
  },
  {
      "id": "Metadata/Items/Weapons/TwoHandWeapons/TwoHandMaces/TwoHandMace12",
      "name": "Plated Maul",
      "itemClass": "Two Hand Mace",
      "dropLevel": 51,
      "inventoryWidth": 2,
      "inventoryHeight": 4,
      "requirements": {
          "level": 51,
          "strength": 164,
          "dexterity": 0,
          "intelligence": 0
      },
      "properties": {
          "attack_time": 833,
          "critical_strike_chance": 500,
          "physical_damage_max": 108,
          "physical_damage_min": 72,
          "range": 13
      },
      "implicits": [
          "StunDurationImplicitMace1"
      ],
      "tags": [
          "mace",
          "two_hand_weapon",
          "twohand",
          "weapon",
          "default"
      ],
      "visualIdentity": {
          "ddsFile": "Art/2DItems/Weapons/TwoHandWeapons/TwoHandMaces/TwoHandMace6.dds",
          "id": "TwoHandMace6"
      }
  },
  {
      "id": "Metadata/Items/Weapons/TwoHandWeapons/TwoHandMaces/TwoHandMace13",
      "name": "Dread Maul",
      "itemClass": "Two Hand Mace",
      "dropLevel": 54,
      "inventoryWidth": 2,
      "inventoryHeight": 4,
      "requirements": {
          "level": 54,
          "strength": 173,
          "dexterity": 0,
          "intelligence": 0
      },
      "properties": {
          "attack_time": 800,
          "critical_strike_chance": 500,
          "physical_damage_max": 104,
          "physical_damage_min": 77,
          "range": 13
      },
      "implicits": [
          "StunDurationImplicitMace1"
      ],
      "tags": [
          "mace",
          "two_hand_weapon",
          "twohand",
          "weapon",
          "default"
      ],
      "visualIdentity": {
          "ddsFile": "Art/2DItems/Weapons/TwoHandWeapons/TwoHandMaces/TwoHandMace7.dds",
          "id": "TwoHandMace7"
      }
  },
  {
      "id": "Metadata/Items/Weapons/TwoHandWeapons/TwoHandMaces/TwoHandMace14",
      "name": "Karui Maul",
      "itemClass": "Two Hand Mace",
      "dropLevel": 57,
      "inventoryWidth": 2,
      "inventoryHeight": 4,
      "requirements": {
          "level": 57,
          "strength": 182,
          "dexterity": 0,
          "intelligence": 0
      },
      "properties": {
          "attack_time": 1000,
          "critical_strike_chance": 500,
          "physical_damage_max": 168,
          "physical_damage_min": 112,
          "range": 13
      },
      "implicits": [
          "StunDurationImplicitMace2"
      ],
      "tags": [
          "mace",
          "two_hand_weapon",
          "twohand",
          "weapon",
          "default"
      ],
      "visualIdentity": {
          "ddsFile": "Art/2DItems/Weapons/TwoHandWeapons/TwoHandMaces/TwoHandMace2.dds",
          "id": "TwoHandMace2"
      }
  },
  {
      "id": "Metadata/Items/Weapons/TwoHandWeapons/TwoHandMaces/TwoHandMace15",
      "name": "Colossus Mallet",
      "itemClass": "Two Hand Mace",
      "dropLevel": 59,
      "inventoryWidth": 2,
      "inventoryHeight": 4,
      "requirements": {
          "level": 59,
          "strength": 188,
          "dexterity": 0,
          "intelligence": 0
      },
      "properties": {
          "attack_time": 769,
          "critical_strike_chance": 550,
          "physical_damage_max": 135,
          "physical_damage_min": 65,
          "range": 13
      },
      "implicits": [
          "AreaDamageImplicitMace1"
      ],
      "tags": [
          "mace",
          "two_hand_weapon",
          "twohand",
          "weapon",
          "default"
      ],
      "visualIdentity": {
          "ddsFile": "Art/2DItems/Weapons/TwoHandWeapons/TwoHandMaces/TwoHandMace3.dds",
          "id": "TwoHandMace3"
      }
  },
  {
      "id": "Metadata/Items/Weapons/TwoHandWeapons/TwoHandMaces/TwoHandMace16",
      "name": "Piledriver",
      "itemClass": "Two Hand Mace",
      "dropLevel": 61,
      "inventoryWidth": 2,
      "inventoryHeight": 4,
      "requirements": {
          "level": 61,
          "strength": 212,
          "dexterity": 0,
          "intelligence": 0
      },
      "properties": {
          "attack_time": 741,
          "critical_strike_chance": 500,
          "physical_damage_max": 115,
          "physical_damage_min": 77,
          "range": 13
      },
      "implicits": [
          "StunThresholdReductionImplicitMace3_"
      ],
      "tags": [
          "mace",
          "two_hand_weapon",
          "twohand",
          "weapon",
          "default"
      ],
      "visualIdentity": {
          "ddsFile": "Art/2DItems/Weapons/TwoHandWeapons/TwoHandMaces/TwoHandMace4.dds",
          "id": "TwoHandMace4"
      }
  },
  {
      "id": "Metadata/Items/Weapons/TwoHandWeapons/TwoHandMaces/TwoHandMace17",
      "name": "Meatgrinder",
      "itemClass": "Two Hand Mace",
      "dropLevel": 63,
      "inventoryWidth": 2,
      "inventoryHeight": 4,
      "requirements": {
          "level": 63,
          "strength": 212,
          "dexterity": 0,
          "intelligence": 0
      },
      "properties": {
          "attack_time": 800,
          "critical_strike_chance": 500,
          "physical_damage_max": 138,
          "physical_damage_min": 74,
          "range": 13
      },
      "implicits": [
          "DoubleDamageChanceImplicitMace1"
      ],
      "tags": [
          "mace",
          "two_hand_weapon",
          "twohand",
          "weapon",
          "default"
      ],
      "visualIdentity": {
          "ddsFile": "Art/2DItems/Weapons/TwoHandWeapons/TwoHandMaces/TwoHandMace5.dds",
          "id": "TwoHandMace5"
      }
  },
  {
      "id": "Metadata/Items/Weapons/TwoHandWeapons/TwoHandMaces/TwoHandMace18",
      "name": "Imperial Maul",
      "itemClass": "Two Hand Mace",
      "dropLevel": 65,
      "inventoryWidth": 2,
      "inventoryHeight": 4,
      "requirements": {
          "level": 65,
          "strength": 212,
          "dexterity": 0,
          "intelligence": 0
      },
      "properties": {
          "attack_time": 909,
          "critical_strike_chance": 500,
          "physical_damage_max": 153,
          "physical_damage_min": 102,
          "range": 13
      },
      "implicits": [
          "PercentageStrengthImplicitMace1"
      ],
      "tags": [
          "mace",
          "two_hand_weapon",
          "twohand",
          "weapon",
          "default"
      ],
      "visualIdentity": {
          "ddsFile": "Art/2DItems/Weapons/TwoHandWeapons/TwoHandMaces/TwoHandMace6.dds",
          "id": "TwoHandMace6"
      }
  },
  {
      "id": "Metadata/Items/Weapons/TwoHandWeapons/TwoHandMaces/TwoHandMace19",
      "name": "Terror Maul",
      "itemClass": "Two Hand Mace",
      "dropLevel": 67,
      "inventoryWidth": 2,
      "inventoryHeight": 4,
      "requirements": {
          "level": 67,
          "strength": 212,
          "dexterity": 0,
          "intelligence": 0
      },
      "properties": {
          "attack_time": 870,
          "critical_strike_chance": 600,
          "physical_damage_max": 137,
          "physical_damage_min": 101,
          "range": 13
      },
      "implicits": [
          "ChanceForDoubleStunDurationImplicitMace_1"
      ],
      "tags": [
          "mace",
          "two_hand_weapon",
          "twohand",
          "weapon",
          "default"
      ],
      "visualIdentity": {
          "ddsFile": "Art/2DItems/Weapons/TwoHandWeapons/TwoHandMaces/TwoHandMace7.dds",
          "id": "TwoHandMace7"
      }
  },
];

// Two Hand Sword (19 items)
export const TWO_HAND_SWORD_BASES: PoeBaseItem[] = [
  {
      "id": "Metadata/Items/Weapons/TwoHandWeapons/TwoHandSwords/TwoHandSword1",
      "name": "Corroded Blade",
      "itemClass": "Two Hand Sword",
      "dropLevel": 3,
      "inventoryWidth": 1,
      "inventoryHeight": 4,
      "requirements": {
          "level": 3,
          "strength": 11,
          "dexterity": 11,
          "intelligence": 0
      },
      "properties": {
          "attack_time": 690,
          "critical_strike_chance": 500,
          "physical_damage_max": 16,
          "physical_damage_min": 8,
          "range": 13
      },
      "implicits": [
          "AccuracyPercentImplicitSword1"
      ],
      "tags": [
          "sword",
          "two_hand_weapon",
          "twohand",
          "weapon",
          "default"
      ],
      "visualIdentity": {
          "ddsFile": "Art/2DItems/Weapons/TwoHandWeapons/TwoHandSwords/TwoHandSword1.dds",
          "id": "TwoHandSword1"
      }
  },
  {
      "id": "Metadata/Items/Weapons/TwoHandWeapons/TwoHandSwords/TwoHandSword2",
      "name": "Longsword",
      "itemClass": "Two Hand Sword",
      "dropLevel": 8,
      "inventoryWidth": 2,
      "inventoryHeight": 4,
      "requirements": {
          "level": 8,
          "strength": 20,
          "dexterity": 17,
          "intelligence": 0
      },
      "properties": {
          "attack_time": 714,
          "critical_strike_chance": 500,
          "physical_damage_max": 26,
          "physical_damage_min": 11,
          "range": 13
      },
      "implicits": [
          "IncreasedAccuracy2hSwordImplicit1"
      ],
      "tags": [
          "sword",
          "two_hand_weapon",
          "twohand",
          "weapon",
          "default"
      ],
      "visualIdentity": {
          "ddsFile": "Art/2DItems/Weapons/TwoHandWeapons/TwoHandSwords/TwoHandSword2.dds",
          "id": "TwoHandSword2"
      }
  },
  {
      "id": "Metadata/Items/Weapons/TwoHandWeapons/TwoHandSwords/TwoHandSword3",
      "name": "Bastard Sword",
      "itemClass": "Two Hand Sword",
      "dropLevel": 12,
      "inventoryWidth": 2,
      "inventoryHeight": 4,
      "requirements": {
          "level": 12,
          "strength": 21,
          "dexterity": 30,
          "intelligence": 0
      },
      "properties": {
          "attack_time": 690,
          "critical_strike_chance": 500,
          "physical_damage_max": 29,
          "physical_damage_min": 17,
          "range": 13
      },
      "implicits": [
          "AccuracyPercentImplicit2HSword1"
      ],
      "tags": [
          "sword",
          "two_hand_weapon",
          "twohand",
          "weapon",
          "default"
      ],
      "visualIdentity": {
          "ddsFile": "Art/2DItems/Weapons/TwoHandWeapons/TwoHandSwords/TwoHandSword3.dds",
          "id": "TwoHandSword3"
      }
  },
  {
      "id": "Metadata/Items/Weapons/TwoHandWeapons/TwoHandSwords/TwoHandSword4",
      "name": "Two-Handed Sword",
      "itemClass": "Two Hand Sword",
      "dropLevel": 17,
      "inventoryWidth": 2,
      "inventoryHeight": 4,
      "requirements": {
          "level": 17,
          "strength": 33,
          "dexterity": 33,
          "intelligence": 0
      },
      "properties": {
          "attack_time": 714,
          "critical_strike_chance": 500,
          "physical_damage_max": 38,
          "physical_damage_min": 20,
          "range": 13
      },
      "implicits": [
          "IncreasedAccuracy2hSwordImplicit2"
      ],
      "tags": [
          "sword",
          "two_hand_weapon",
          "twohand",
          "weapon",
          "default"
      ],
      "visualIdentity": {
          "ddsFile": "Art/2DItems/Weapons/TwoHandWeapons/TwoHandSwords/TwoHandSword4.dds",
          "id": "TwoHandSword4"
      }
  },
  {
      "id": "Metadata/Items/Weapons/TwoHandWeapons/TwoHandSwords/TwoHandSword5",
      "name": "Etched Greatsword",
      "itemClass": "Two Hand Sword",
      "dropLevel": 22,
      "inventoryWidth": 2,
      "inventoryHeight": 4,
      "requirements": {
          "level": 22,
          "strength": 45,
          "dexterity": 38,
          "intelligence": 0
      },
      "properties": {
          "attack_time": 714,
          "critical_strike_chance": 500,
          "physical_damage_max": 48,
          "physical_damage_min": 23,
          "range": 13
      },
      "implicits": [
          "AccuracyPercentImplicit2HSword1"
      ],
      "tags": [
          "sword",
          "two_hand_weapon",
          "twohand",
          "weapon",
          "default"
      ],
      "visualIdentity": {
          "ddsFile": "Art/2DItems/Weapons/TwoHandWeapons/TwoHandSwords/TwoHandSword5.dds",
          "id": "TwoHandSword5"
      }
  },
  {
      "id": "Metadata/Items/Weapons/TwoHandWeapons/TwoHandSwords/TwoHandSword6",
      "name": "Ornate Sword",
      "itemClass": "Two Hand Sword",
      "dropLevel": 27,
      "inventoryWidth": 2,
      "inventoryHeight": 4,
      "requirements": {
          "level": 27,
          "strength": 45,
          "dexterity": 54,
          "intelligence": 0
      },
      "properties": {
          "attack_time": 714,
          "critical_strike_chance": 500,
          "physical_damage_max": 50,
          "physical_damage_min": 30,
          "range": 13
      },
      "implicits": [
          "IncreasedAccuracy2hSwordImplicit3"
      ],
      "tags": [
          "sword",
          "two_hand_weapon",
          "twohand",
          "weapon",
          "default"
      ],
      "visualIdentity": {
          "ddsFile": "Art/2DItems/Weapons/TwoHandWeapons/TwoHandSwords/TwoHandSword6.dds",
          "id": "TwoHandSword6"
      }
  },
  {
      "id": "Metadata/Items/Weapons/TwoHandWeapons/TwoHandSwords/TwoHandSword7",
      "name": "Spectral Sword",
      "itemClass": "Two Hand Sword",
      "dropLevel": 32,
      "inventoryWidth": 2,
      "inventoryHeight": 4,
      "requirements": {
          "level": 32,
          "strength": 57,
          "dexterity": 57,
          "intelligence": 0
      },
      "properties": {
          "attack_time": 741,
          "critical_strike_chance": 500,
          "physical_damage_max": 65,
          "physical_damage_min": 31,
          "range": 13
      },
      "implicits": [
          "AccuracyPercentImplicit2HSword2_"
      ],
      "tags": [
          "sword",
          "two_hand_weapon",
          "twohand",
          "weapon",
          "default"
      ],
      "visualIdentity": {
          "ddsFile": "Art/2DItems/Weapons/TwoHandWeapons/TwoHandSwords/TwoHandSword7.dds",
          "id": "TwoHandSword7"
      }
  },
  {
      "id": "Metadata/Items/Weapons/TwoHandWeapons/TwoHandSwords/TwoHandSword8",
      "name": "Butcher Sword",
      "itemClass": "Two Hand Sword",
      "dropLevel": 36,
      "inventoryWidth": 2,
      "inventoryHeight": 4,
      "requirements": {
          "level": 36,
          "strength": 69,
          "dexterity": 58,
          "intelligence": 0
      },
      "properties": {
          "attack_time": 769,
          "critical_strike_chance": 500,
          "physical_damage_max": 79,
          "physical_damage_min": 34,
          "range": 13
      },
      "implicits": [
          "IncreasedAccuracy2hSwordImplicit4"
      ],
      "tags": [
          "sword",
          "two_hand_weapon",
          "twohand",
          "weapon",
          "default"
      ],
      "visualIdentity": {
          "ddsFile": "Art/2DItems/Weapons/TwoHandWeapons/TwoHandSwords/TwoHandSword2.dds",
          "id": "TwoHandSword2"
      }
  },
  {
      "id": "Metadata/Items/Weapons/TwoHandWeapons/TwoHandSwords/TwoHandSword9",
      "name": "Footman Sword",
      "itemClass": "Two Hand Sword",
      "dropLevel": 40,
      "inventoryWidth": 2,
      "inventoryHeight": 4,
      "requirements": {
          "level": 40,
          "strength": 57,
          "dexterity": 83,
          "intelligence": 0
      },
      "properties": {
          "attack_time": 690,
          "critical_strike_chance": 500,
          "physical_damage_max": 65,
          "physical_damage_min": 39,
          "range": 13
      },
      "implicits": [
          "AccuracyPercentImplicit2HSword1"
      ],
      "tags": [
          "sword",
          "two_hand_weapon",
          "twohand",
          "weapon",
          "default"
      ],
      "visualIdentity": {
          "ddsFile": "Art/2DItems/Weapons/TwoHandWeapons/TwoHandSwords/TwoHandSword3.dds",
          "id": "TwoHandSword3"
      }
  },
  {
      "id": "Metadata/Items/Weapons/TwoHandWeapons/TwoHandSwords/TwoHandSword10",
      "name": "Highland Blade",
      "itemClass": "Two Hand Sword",
      "dropLevel": 44,
      "inventoryWidth": 2,
      "inventoryHeight": 4,
      "requirements": {
          "level": 44,
          "strength": 77,
          "dexterity": 77,
          "intelligence": 0
      },
      "properties": {
          "attack_time": 741,
          "critical_strike_chance": 500,
          "physical_damage_max": 84,
          "physical_damage_min": 45,
          "range": 13
      },
      "implicits": [
          "IncreasedAccuracy2hSwordImplicit5"
      ],
      "tags": [
          "sword",
          "two_hand_weapon",
          "twohand",
          "weapon",
          "default"
      ],
      "visualIdentity": {
          "ddsFile": "Art/2DItems/Weapons/TwoHandWeapons/TwoHandSwords/TwoHandSword4.dds",
          "id": "TwoHandSword4"
      }
  },
  {
      "id": "Metadata/Items/Weapons/TwoHandWeapons/TwoHandSwords/TwoHandSword11",
      "name": "Engraved Greatsword",
      "itemClass": "Two Hand Sword",
      "dropLevel": 48,
      "inventoryWidth": 2,
      "inventoryHeight": 4,
      "requirements": {
          "level": 48,
          "strength": 91,
          "dexterity": 76,
          "intelligence": 0
      },
      "properties": {
          "attack_time": 769,
          "critical_strike_chance": 500,
          "physical_damage_max": 102,
          "physical_damage_min": 49,
          "range": 13
      },
      "implicits": [
          "AccuracyPercentImplicit2HSword1"
      ],
      "tags": [
          "sword",
          "two_hand_weapon",
          "twohand",
          "weapon",
          "default"
      ],
      "visualIdentity": {
          "ddsFile": "Art/2DItems/Weapons/TwoHandWeapons/TwoHandSwords/TwoHandSword5.dds",
          "id": "TwoHandSword5"
      }
  },
  {
      "id": "Metadata/Items/Weapons/TwoHandWeapons/TwoHandSwords/TwoHandSword12",
      "name": "Tiger Sword",
      "itemClass": "Two Hand Sword",
      "dropLevel": 51,
      "inventoryWidth": 2,
      "inventoryHeight": 4,
      "requirements": {
          "level": 51,
          "strength": 80,
          "dexterity": 96,
          "intelligence": 0
      },
      "properties": {
          "attack_time": 714,
          "critical_strike_chance": 500,
          "physical_damage_max": 89,
          "physical_damage_min": 54,
          "range": 13
      },
      "implicits": [
          "IncreasedAccuracy2hSwordImplicit6"
      ],
      "tags": [
          "sword",
          "two_hand_weapon",
          "twohand",
          "weapon",
          "default"
      ],
      "visualIdentity": {
          "ddsFile": "Art/2DItems/Weapons/TwoHandWeapons/TwoHandSwords/TwoHandSword6.dds",
          "id": "TwoHandSword6"
      }
  },
  {
      "id": "Metadata/Items/Weapons/TwoHandWeapons/TwoHandSwords/TwoHandSword13",
      "name": "Wraith Sword",
      "itemClass": "Two Hand Sword",
      "dropLevel": 54,
      "inventoryWidth": 2,
      "inventoryHeight": 4,
      "requirements": {
          "level": 54,
          "strength": 93,
          "dexterity": 93,
          "intelligence": 0
      },
      "properties": {
          "attack_time": 741,
          "critical_strike_chance": 500,
          "physical_damage_max": 109,
          "physical_damage_min": 52,
          "range": 13
      },
      "implicits": [
          "AccuracyPercentImplicit2HSword2_"
      ],
      "tags": [
          "sword",
          "two_hand_weapon",
          "twohand",
          "weapon",
          "default"
      ],
      "visualIdentity": {
          "ddsFile": "Art/2DItems/Weapons/TwoHandWeapons/TwoHandSwords/TwoHandSword7.dds",
          "id": "TwoHandSword7"
      }
  },
  {
      "id": "Metadata/Items/Weapons/TwoHandWeapons/TwoHandSwords/TwoHandSword14",
      "name": "Headman's Sword",
      "itemClass": "Two Hand Sword",
      "dropLevel": 57,
      "inventoryWidth": 2,
      "inventoryHeight": 4,
      "requirements": {
          "level": 57,
          "strength": 106,
          "dexterity": 89,
          "intelligence": 0
      },
      "properties": {
          "attack_time": 769,
          "critical_strike_chance": 500,
          "physical_damage_max": 128,
          "physical_damage_min": 55,
          "range": 13
      },
      "implicits": [
          "IncreasedAccuracy2hSwordImplicit7"
      ],
      "tags": [
          "sword",
          "two_hand_weapon",
          "twohand",
          "weapon",
          "default"
      ],
      "visualIdentity": {
          "ddsFile": "Art/2DItems/Weapons/TwoHandWeapons/TwoHandSwords/TwoHandSword2.dds",
          "id": "TwoHandSword2"
      }
  },
  {
      "id": "Metadata/Items/Weapons/TwoHandWeapons/TwoHandSwords/TwoHandSword15",
      "name": "Reaver Sword",
      "itemClass": "Two Hand Sword",
      "dropLevel": 59,
      "inventoryWidth": 2,
      "inventoryHeight": 4,
      "requirements": {
          "level": 59,
          "strength": 82,
          "dexterity": 119,
          "intelligence": 0
      },
      "properties": {
          "attack_time": 667,
          "critical_strike_chance": 500,
          "physical_damage_max": 104,
          "physical_damage_min": 62,
          "range": 13
      },
      "implicits": [
          "AccuracyPercentImplicit2HSword1"
      ],
      "tags": [
          "sword",
          "two_hand_weapon",
          "twohand",
          "weapon",
          "default"
      ],
      "visualIdentity": {
          "ddsFile": "Art/2DItems/Weapons/TwoHandWeapons/TwoHandSwords/TwoHandSword3.dds",
          "id": "TwoHandSword3"
      }
  },
  {
      "id": "Metadata/Items/Weapons/TwoHandWeapons/TwoHandSwords/TwoHandSword16",
      "name": "Ezomyte Blade",
      "itemClass": "Two Hand Sword",
      "dropLevel": 61,
      "inventoryWidth": 2,
      "inventoryHeight": 4,
      "requirements": {
          "level": 61,
          "strength": 113,
          "dexterity": 113,
          "intelligence": 0
      },
      "properties": {
          "attack_time": 714,
          "critical_strike_chance": 650,
          "physical_damage_max": 115,
          "physical_damage_min": 62,
          "range": 13
      },
      "implicits": [
          "CriticalMultiplierImplicitSword2H1"
      ],
      "tags": [
          "sword",
          "two_hand_weapon",
          "twohand",
          "weapon",
          "default"
      ],
      "visualIdentity": {
          "ddsFile": "Art/2DItems/Weapons/TwoHandWeapons/TwoHandSwords/TwoHandSword4.dds",
          "id": "TwoHandSword4"
      }
  },
  {
      "id": "Metadata/Items/Weapons/TwoHandWeapons/TwoHandSwords/TwoHandSword17",
      "name": "Vaal Greatsword",
      "itemClass": "Two Hand Sword",
      "dropLevel": 63,
      "inventoryWidth": 2,
      "inventoryHeight": 4,
      "requirements": {
          "level": 63,
          "strength": 122,
          "dexterity": 104,
          "intelligence": 0
      },
      "properties": {
          "attack_time": 769,
          "critical_strike_chance": 500,
          "physical_damage_max": 142,
          "physical_damage_min": 68,
          "range": 13
      },
      "implicits": [
          "IncreasedAccuracy2hSwordImplicit9"
      ],
      "tags": [
          "sword",
          "two_hand_weapon",
          "twohand",
          "weapon",
          "default"
      ],
      "visualIdentity": {
          "ddsFile": "Art/2DItems/Weapons/TwoHandWeapons/TwoHandSwords/TwoHandSword5.dds",
          "id": "TwoHandSword5"
      }
  },
  {
      "id": "Metadata/Items/Weapons/TwoHandWeapons/TwoHandSwords/TwoHandSword18",
      "name": "Lion Sword",
      "itemClass": "Two Hand Sword",
      "dropLevel": 65,
      "inventoryWidth": 2,
      "inventoryHeight": 4,
      "requirements": {
          "level": 65,
          "strength": 104,
          "dexterity": 122,
          "intelligence": 0
      },
      "properties": {
          "attack_time": 690,
          "critical_strike_chance": 500,
          "physical_damage_max": 115,
          "physical_damage_min": 69,
          "range": 13
      },
      "implicits": [
          "StrengthDexterityImplicitSword_1"
      ],
      "tags": [
          "sword",
          "two_hand_weapon",
          "twohand",
          "weapon",
          "default"
      ],
      "visualIdentity": {
          "ddsFile": "Art/2DItems/Weapons/TwoHandWeapons/TwoHandSwords/TwoHandSword6.dds",
          "id": "TwoHandSword6"
      }
  },
  {
      "id": "Metadata/Items/Weapons/TwoHandWeapons/TwoHandSwords/TwoHandSword19",
      "name": "Infernal Sword",
      "itemClass": "Two Hand Sword",
      "dropLevel": 67,
      "inventoryWidth": 2,
      "inventoryHeight": 4,
      "requirements": {
          "level": 67,
          "strength": 113,
          "dexterity": 113,
          "intelligence": 0
      },
      "properties": {
          "attack_time": 741,
          "critical_strike_chance": 500,
          "physical_damage_max": 129,
          "physical_damage_min": 62,
          "range": 13
      },
      "implicits": [
          "WeaponElementalDamageImplicitSword1"
      ],
      "tags": [
          "sword",
          "two_hand_weapon",
          "twohand",
          "weapon",
          "default"
      ],
      "visualIdentity": {
          "ddsFile": "Art/2DItems/Weapons/TwoHandWeapons/TwoHandSwords/TwoHandSword7.dds",
          "id": "TwoHandSword7"
      }
  },
];

// Wand (20 items)
export const WAND_BASES: PoeBaseItem[] = [
  {
      "id": "Metadata/Items/Weapons/OneHandWeapons/Wands/Wand1",
      "name": "Driftwood Wand",
      "itemClass": "Wand",
      "dropLevel": 1,
      "inventoryWidth": 1,
      "inventoryHeight": 3,
      "requirements": {
          "level": 1,
          "strength": 0,
          "dexterity": 0,
          "intelligence": 14
      },
      "properties": {
          "attack_time": 714,
          "critical_strike_chance": 700,
          "physical_damage_max": 9,
          "physical_damage_min": 5,
          "range": 120
      },
      "implicits": [
          "SpellDamageOnWeaponImplicitWand1"
      ],
      "tags": [
          "wand",
          "ranged",
          "one_hand_weapon",
          "onehand",
          "weapon",
          "default"
      ],
      "visualIdentity": {
          "ddsFile": "Art/2DItems/Weapons/OneHandWeapons/Wands/Wand1.dds",
          "id": "Wand1"
      }
  },
  {
      "id": "Metadata/Items/Weapons/OneHandWeapons/Wands/Wand1Royale",
      "name": "Driftwood Wand",
      "itemClass": "Wand",
      "dropLevel": 1,
      "inventoryWidth": 1,
      "inventoryHeight": 3,
      "requirements": {
          "level": 1,
          "strength": 0,
          "dexterity": 0,
          "intelligence": 14
      },
      "properties": {
          "attack_time": 800,
          "critical_strike_chance": 700,
          "physical_damage_max": 9,
          "physical_damage_min": 5,
          "range": 120
      },
      "implicits": [
          "SpellDamageOnWeaponImplicitWand1"
      ],
      "tags": [
          "wand",
          "ranged",
          "one_hand_weapon",
          "onehand",
          "weapon",
          "default"
      ],
      "visualIdentity": {
          "ddsFile": "Art/2DItems/Weapons/OneHandWeapons/Wands/Wand1.dds",
          "id": "Wand1"
      }
  },
  {
      "id": "Metadata/Items/Weapons/OneHandWeapons/Wands/Wand2",
      "name": "Goat's Horn",
      "itemClass": "Wand",
      "dropLevel": 6,
      "inventoryWidth": 1,
      "inventoryHeight": 3,
      "requirements": {
          "level": 6,
          "strength": 0,
          "dexterity": 0,
          "intelligence": 29
      },
      "properties": {
          "attack_time": 833,
          "critical_strike_chance": 700,
          "physical_damage_max": 16,
          "physical_damage_min": 9,
          "range": 120
      },
      "implicits": [
          "SpellDamageOnWeaponImplicitWand2"
      ],
      "tags": [
          "wand",
          "ranged",
          "one_hand_weapon",
          "onehand",
          "weapon",
          "default"
      ],
      "visualIdentity": {
          "ddsFile": "Art/2DItems/Weapons/OneHandWeapons/Wands/Wand2.dds",
          "id": "Wand2"
      }
  },
  {
      "id": "Metadata/Items/Weapons/OneHandWeapons/Wands/Wand3",
      "name": "Carved Wand",
      "itemClass": "Wand",
      "dropLevel": 12,
      "inventoryWidth": 1,
      "inventoryHeight": 3,
      "requirements": {
          "level": 12,
          "strength": 0,
          "dexterity": 0,
          "intelligence": 47
      },
      "properties": {
          "attack_time": 667,
          "critical_strike_chance": 700,
          "physical_damage_max": 17,
          "physical_damage_min": 9,
          "range": 120
      },
      "implicits": [
          "SpellDamageOnWeaponImplicitWand3"
      ],
      "tags": [
          "wand",
          "ranged",
          "one_hand_weapon",
          "onehand",
          "weapon",
          "default"
      ],
      "visualIdentity": {
          "ddsFile": "Art/2DItems/Weapons/OneHandWeapons/Wands/Wand3.dds",
          "id": "Wand3"
      }
  },
  {
      "id": "Metadata/Items/Weapons/OneHandWeapons/Wands/Wand4",
      "name": "Quartz Wand",
      "itemClass": "Wand",
      "dropLevel": 18,
      "inventoryWidth": 1,
      "inventoryHeight": 3,
      "requirements": {
          "level": 18,
          "strength": 0,
          "dexterity": 0,
          "intelligence": 65
      },
      "properties": {
          "attack_time": 769,
          "critical_strike_chance": 700,
          "physical_damage_max": 27,
          "physical_damage_min": 14,
          "range": 120
      },
      "implicits": [
          "SpellDamageOnWeaponImplicitWand7"
      ],
      "tags": [
          "wand",
          "ranged",
          "one_hand_weapon",
          "onehand",
          "weapon",
          "default"
      ],
      "visualIdentity": {
          "ddsFile": "Art/2DItems/Weapons/OneHandWeapons/Wands/Wand4.dds",
          "id": "Wand4"
      }
  },
  {
      "id": "Metadata/Items/Weapons/OneHandWeapons/Wands/WandMinion1",
      "name": "Calling Wand",
      "itemClass": "Wand",
      "dropLevel": 20,
      "inventoryWidth": 1,
      "inventoryHeight": 3,
      "requirements": {
          "level": 20,
          "strength": 0,
          "dexterity": 0,
          "intelligence": 81
      },
      "properties": {
          "attack_time": 714,
          "critical_strike_chance": 700,
          "physical_damage_max": 25,
          "physical_damage_min": 13,
          "range": 120
      },
      "implicits": [
          "MinionDamageImplicitWand3"
      ],
      "tags": [
          "weapon_can_roll_minion_modifiers",
          "wand",
          "ranged",
          "one_hand_weapon",
          "onehand",
          "weapon",
          "default"
      ],
      "visualIdentity": {
          "ddsFile": "Art/2DItems/Weapons/OneHandWeapons/Wands/ConvokingWand.dds",
          "id": "WandAtlas1"
      }
  },
  {
      "id": "Metadata/Items/Weapons/OneHandWeapons/Wands/Wand5",
      "name": "Spiraled Wand",
      "itemClass": "Wand",
      "dropLevel": 24,
      "inventoryWidth": 1,
      "inventoryHeight": 3,
      "requirements": {
          "level": 24,
          "strength": 0,
          "dexterity": 0,
          "intelligence": 83
      },
      "properties": {
          "attack_time": 769,
          "critical_strike_chance": 700,
          "physical_damage_max": 37,
          "physical_damage_min": 12,
          "range": 120
      },
      "implicits": [
          "SpellDamageOnWeaponImplicitWand5"
      ],
      "tags": [
          "wand",
          "ranged",
          "one_hand_weapon",
          "onehand",
          "weapon",
          "default"
      ],
      "visualIdentity": {
          "ddsFile": "Art/2DItems/Weapons/OneHandWeapons/Wands/Wand5.dds",
          "id": "Wand5"
      }
  },
  {
      "id": "Metadata/Items/Weapons/OneHandWeapons/Wands/Wand6",
      "name": "Sage Wand",
      "itemClass": "Wand",
      "dropLevel": 30,
      "inventoryWidth": 1,
      "inventoryHeight": 3,
      "requirements": {
          "level": 30,
          "strength": 0,
          "dexterity": 0,
          "intelligence": 119
      },
      "properties": {
          "attack_time": 833,
          "critical_strike_chance": 800,
          "physical_damage_max": 42,
          "physical_damage_min": 23,
          "range": 120
      },
      "implicits": [
          "SpellDamageOnWeaponImplicitWand6"
      ],
      "tags": [
          "wand",
          "ranged",
          "one_hand_weapon",
          "onehand",
          "weapon",
          "default"
      ],
      "visualIdentity": {
          "ddsFile": "Art/2DItems/Weapons/OneHandWeapons/Wands/Wand6.dds",
          "id": "Wand6"
      }
  },
  {
      "id": "Metadata/Items/Weapons/OneHandWeapons/Wands/Wand7",
      "name": "Faun's Horn",
      "itemClass": "Wand",
      "dropLevel": 35,
      "inventoryWidth": 1,
      "inventoryHeight": 3,
      "requirements": {
          "level": 35,
          "strength": 0,
          "dexterity": 0,
          "intelligence": 116
      },
      "properties": {
          "attack_time": 833,
          "critical_strike_chance": 700,
          "physical_damage_max": 48,
          "physical_damage_min": 26,
          "range": 120
      },
      "implicits": [
          "SpellDamageOnWeaponImplicitWand8"
      ],
      "tags": [
          "wand",
          "ranged",
          "one_hand_weapon",
          "onehand",
          "weapon",
          "default"
      ],
      "visualIdentity": {
          "ddsFile": "Art/2DItems/Weapons/OneHandWeapons/Wands/Wand2.dds",
          "id": "Wand2"
      }
  },
  {
      "id": "Metadata/Items/Weapons/OneHandWeapons/Wands/Wand8",
      "name": "Engraved Wand",
      "itemClass": "Wand",
      "dropLevel": 40,
      "inventoryWidth": 1,
      "inventoryHeight": 3,
      "requirements": {
          "level": 40,
          "strength": 0,
          "dexterity": 0,
          "intelligence": 131
      },
      "properties": {
          "attack_time": 667,
          "critical_strike_chance": 700,
          "physical_damage_max": 38,
          "physical_damage_min": 21,
          "range": 120
      },
      "implicits": [
          "SpellDamageOnWeaponImplicitWand9"
      ],
      "tags": [
          "wand",
          "ranged",
          "one_hand_weapon",
          "onehand",
          "weapon",
          "default"
      ],
      "visualIdentity": {
          "ddsFile": "Art/2DItems/Weapons/OneHandWeapons/Wands/Wand3.dds",
          "id": "Wand3"
      }
  },
  {
      "id": "Metadata/Items/Weapons/OneHandWeapons/Wands/Wand9",
      "name": "Crystal Wand",
      "itemClass": "Wand",
      "dropLevel": 45,
      "inventoryWidth": 1,
      "inventoryHeight": 3,
      "requirements": {
          "level": 45,
          "strength": 0,
          "dexterity": 0,
          "intelligence": 146
      },
      "properties": {
          "attack_time": 769,
          "critical_strike_chance": 700,
          "physical_damage_max": 52,
          "physical_damage_min": 28,
          "range": 120
      },
      "implicits": [
          "SpellDamageOnWeaponImplicitWand13"
      ],
      "tags": [
          "wand",
          "ranged",
          "one_hand_weapon",
          "onehand",
          "weapon",
          "default"
      ],
      "visualIdentity": {
          "ddsFile": "Art/2DItems/Weapons/OneHandWeapons/Wands/Wand4.dds",
          "id": "Wand4"
      }
  },
  {
      "id": "Metadata/Items/Weapons/OneHandWeapons/Wands/Wand10",
      "name": "Serpent Wand",
      "itemClass": "Wand",
      "dropLevel": 49,
      "inventoryWidth": 1,
      "inventoryHeight": 3,
      "requirements": {
          "level": 49,
          "strength": 0,
          "dexterity": 0,
          "intelligence": 158
      },
      "properties": {
          "attack_time": 769,
          "critical_strike_chance": 700,
          "physical_damage_max": 64,
          "physical_damage_min": 21,
          "range": 120
      },
      "implicits": [
          "SpellDamageOnWeaponImplicitWand11"
      ],
      "tags": [
          "wand",
          "ranged",
          "one_hand_weapon",
          "onehand",
          "weapon",
          "default"
      ],
      "visualIdentity": {
          "ddsFile": "Art/2DItems/Weapons/OneHandWeapons/Wands/Wand5.dds",
          "id": "Wand5"
      }
  },
  {
      "id": "Metadata/Items/Weapons/OneHandWeapons/Wands/WandMinion2",
      "name": "Convening Wand",
      "itemClass": "Wand",
      "dropLevel": 50,
      "inventoryWidth": 1,
      "inventoryHeight": 3,
      "requirements": {
          "level": 50,
          "strength": 0,
          "dexterity": 0,
          "intelligence": 183
      },
      "properties": {
          "attack_time": 714,
          "critical_strike_chance": 700,
          "physical_damage_max": 50,
          "physical_damage_min": 27,
          "range": 120
      },
      "implicits": [
          "MinionDamageImplicitWand2"
      ],
      "tags": [
          "weapon_can_roll_minion_modifiers",
          "wand",
          "ranged",
          "one_hand_weapon",
          "onehand",
          "weapon",
          "default"
      ],
      "visualIdentity": {
          "ddsFile": "Art/2DItems/Weapons/OneHandWeapons/Wands/ConvokingWand.dds",
          "id": "WandAtlas1"
      }
  },
  {
      "id": "Metadata/Items/Weapons/OneHandWeapons/Wands/Wand11",
      "name": "Omen Wand",
      "itemClass": "Wand",
      "dropLevel": 53,
      "inventoryWidth": 1,
      "inventoryHeight": 3,
      "requirements": {
          "level": 53,
          "strength": 0,
          "dexterity": 0,
          "intelligence": 200
      },
      "properties": {
          "attack_time": 833,
          "critical_strike_chance": 800,
          "physical_damage_max": 61,
          "physical_damage_min": 33,
          "range": 120
      },
      "implicits": [
          "SpellDamageOnWeaponImplicitWand12"
      ],
      "tags": [
          "wand",
          "ranged",
          "one_hand_weapon",
          "onehand",
          "weapon",
          "default"
      ],
      "visualIdentity": {
          "ddsFile": "Art/2DItems/Weapons/OneHandWeapons/Wands/Wand6.dds",
          "id": "Wand6"
      }
  },
  {
      "id": "Metadata/Items/Weapons/OneHandWeapons/Wands/Wand12",
      "name": "Demon's Horn",
      "itemClass": "Wand",
      "dropLevel": 56,
      "inventoryWidth": 1,
      "inventoryHeight": 3,
      "requirements": {
          "level": 56,
          "strength": 0,
          "dexterity": 0,
          "intelligence": 179
      },
      "properties": {
          "attack_time": 833,
          "critical_strike_chance": 700,
          "physical_damage_max": 71,
          "physical_damage_min": 38,
          "range": 120
      },
      "implicits": [
          "SpellDamageOnWeaponImplicitWand14"
      ],
      "tags": [
          "wand",
          "ranged",
          "one_hand_weapon",
          "onehand",
          "weapon",
          "default"
      ],
      "visualIdentity": {
          "ddsFile": "Art/2DItems/Weapons/OneHandWeapons/Wands/Wand2.dds",
          "id": "Wand2"
      }
  },
  {
      "id": "Metadata/Items/Weapons/OneHandWeapons/Wands/Wand13",
      "name": "Imbued Wand",
      "itemClass": "Wand",
      "dropLevel": 59,
      "inventoryWidth": 1,
      "inventoryHeight": 3,
      "requirements": {
          "level": 59,
          "strength": 0,
          "dexterity": 0,
          "intelligence": 188
      },
      "properties": {
          "attack_time": 667,
          "critical_strike_chance": 700,
          "physical_damage_max": 53,
          "physical_damage_min": 29,
          "range": 120
      },
      "implicits": [
          "SpellDamageOnWeaponImplicitWand15"
      ],
      "tags": [
          "wand",
          "ranged",
          "one_hand_weapon",
          "onehand",
          "weapon",
          "default"
      ],
      "visualIdentity": {
          "ddsFile": "Art/2DItems/Weapons/OneHandWeapons/Wands/Wand3.dds",
          "id": "Wand3"
      }
  },
  {
      "id": "Metadata/Items/Weapons/OneHandWeapons/Wands/Wand14",
      "name": "Opal Wand",
      "itemClass": "Wand",
      "dropLevel": 62,
      "inventoryWidth": 1,
      "inventoryHeight": 3,
      "requirements": {
          "level": 62,
          "strength": 0,
          "dexterity": 0,
          "intelligence": 212
      },
      "properties": {
          "attack_time": 769,
          "critical_strike_chance": 700,
          "physical_damage_max": 65,
          "physical_damage_min": 35,
          "range": 120
      },
      "implicits": [
          "SpellDamageOnWeaponImplicitWand18"
      ],
      "tags": [
          "wand",
          "ranged",
          "one_hand_weapon",
          "onehand",
          "weapon",
          "default"
      ],
      "visualIdentity": {
          "ddsFile": "Art/2DItems/Weapons/OneHandWeapons/Wands/Wand4.dds",
          "id": "Wand4"
      }
  },
  {
      "id": "Metadata/Items/Weapons/OneHandWeapons/Wands/Wand15",
      "name": "Tornado Wand",
      "itemClass": "Wand",
      "dropLevel": 65,
      "inventoryWidth": 1,
      "inventoryHeight": 3,
      "requirements": {
          "level": 65,
          "strength": 0,
          "dexterity": 0,
          "intelligence": 212
      },
      "properties": {
          "attack_time": 769,
          "critical_strike_chance": 700,
          "physical_damage_max": 75,
          "physical_damage_min": 25,
          "range": 120
      },
      "implicits": [
          "SpellDamageOnWeaponImplicitWand16"
      ],
      "tags": [
          "wand",
          "ranged",
          "one_hand_weapon",
          "onehand",
          "weapon",
          "default"
      ],
      "visualIdentity": {
          "ddsFile": "Art/2DItems/Weapons/OneHandWeapons/Wands/Wand5.dds",
          "id": "Wand5"
      }
  },
  {
      "id": "Metadata/Items/Weapons/OneHandWeapons/Wands/Wand16",
      "name": "Prophecy Wand",
      "itemClass": "Wand",
      "dropLevel": 68,
      "inventoryWidth": 1,
      "inventoryHeight": 3,
      "requirements": {
          "level": 68,
          "strength": 0,
          "dexterity": 0,
          "intelligence": 245
      },
      "properties": {
          "attack_time": 833,
          "critical_strike_chance": 800,
          "physical_damage_max": 64,
          "physical_damage_min": 35,
          "range": 120
      },
      "implicits": [
          "SpellDamageOnWeaponImplicitWand17"
      ],
      "tags": [
          "wand",
          "ranged",
          "one_hand_weapon",
          "onehand",
          "weapon",
          "default"
      ],
      "visualIdentity": {
          "ddsFile": "Art/2DItems/Weapons/OneHandWeapons/Wands/Wand6.dds",
          "id": "Wand6"
      }
  },
  {
      "id": "Metadata/Items/Weapons/OneHandWeapons/Wands/WandAtlas1",
      "name": "Convoking Wand",
      "itemClass": "Wand",
      "dropLevel": 72,
      "inventoryWidth": 1,
      "inventoryHeight": 3,
      "requirements": {
          "level": 72,
          "strength": 0,
          "dexterity": 0,
          "intelligence": 242
      },
      "properties": {
          "attack_time": 714,
          "critical_strike_chance": 700,
          "physical_damage_max": 55,
          "physical_damage_min": 30,
          "range": 120
      },
      "implicits": [
          "MinionDamageImplicitWand1"
      ],
      "tags": [
          "atlas_base_type",
          "wandatlas1",
          "weapon_can_roll_minion_modifiers",
          "wand",
          "ranged",
          "one_hand_weapon",
          "onehand",
          "weapon",
          "default"
      ],
      "visualIdentity": {
          "ddsFile": "Art/2DItems/Weapons/OneHandWeapons/Wands/ConvokingWand.dds",
          "id": "WandAtlas1"
      }
  },
];

// Warstaff (9 items)
export const WARSTAFF_BASES: PoeBaseItem[] = [
  {
      "id": "Metadata/Items/Weapons/TwoHandWeapons/Staves/Staff4",
      "name": "Iron Staff",
      "itemClass": "Warstaff",
      "dropLevel": 13,
      "inventoryWidth": 2,
      "inventoryHeight": 4,
      "requirements": {
          "level": 13,
          "strength": 27,
          "dexterity": 0,
          "intelligence": 27
      },
      "properties": {
          "attack_time": 769,
          "critical_strike_chance": 640,
          "physical_damage_max": 42,
          "physical_damage_min": 14,
          "range": 13
      },
      "implicits": [
          "StaffBlockPercentImplicitStaff1"
      ],
      "tags": [
          "warstaff",
          "staff",
          "attack_staff",
          "two_hand_weapon",
          "twohand",
          "weapon",
          "default"
      ],
      "visualIdentity": {
          "ddsFile": "Art/2DItems/Weapons/TwoHandWeapons/Staves/Staff4.dds",
          "id": "Staff4"
      }
  },
  {
      "id": "Metadata/Items/Weapons/TwoHandWeapons/Staves/Staff5",
      "name": "Coiled Staff",
      "itemClass": "Warstaff",
      "dropLevel": 23,
      "inventoryWidth": 2,
      "inventoryHeight": 4,
      "requirements": {
          "level": 23,
          "strength": 43,
          "dexterity": 0,
          "intelligence": 43
      },
      "properties": {
          "attack_time": 769,
          "critical_strike_chance": 620,
          "physical_damage_max": 57,
          "physical_damage_min": 27,
          "range": 13
      },
      "implicits": [
          "StaffBlockPercentImplicitStaff2"
      ],
      "tags": [
          "warstaff",
          "staff",
          "attack_staff",
          "two_hand_weapon",
          "twohand",
          "weapon",
          "default"
      ],
      "visualIdentity": {
          "ddsFile": "Art/2DItems/Weapons/TwoHandWeapons/Staves/Staff5.dds",
          "id": "Staff5"
      }
  },
  {
      "id": "Metadata/Items/Weapons/TwoHandWeapons/Staves/Staff7",
      "name": "Vile Staff",
      "itemClass": "Warstaff",
      "dropLevel": 33,
      "inventoryWidth": 2,
      "inventoryHeight": 4,
      "requirements": {
          "level": 33,
          "strength": 59,
          "dexterity": 0,
          "intelligence": 59
      },
      "properties": {
          "attack_time": 769,
          "critical_strike_chance": 610,
          "physical_damage_max": 76,
          "physical_damage_min": 41,
          "range": 13
      },
      "implicits": [
          "StaffBlockPercentImplicitStaff1"
      ],
      "tags": [
          "warstaff",
          "staff",
          "attack_staff",
          "two_hand_weapon",
          "twohand",
          "weapon",
          "default"
      ],
      "visualIdentity": {
          "ddsFile": "Art/2DItems/Weapons/TwoHandWeapons/Staves/Staff7.dds",
          "id": "Staff7"
      }
  },
  {
      "id": "Metadata/Items/Weapons/TwoHandWeapons/Staves/Staff10",
      "name": "Military Staff",
      "itemClass": "Warstaff",
      "dropLevel": 41,
      "inventoryWidth": 2,
      "inventoryHeight": 4,
      "requirements": {
          "level": 41,
          "strength": 72,
          "dexterity": 0,
          "intelligence": 72
      },
      "properties": {
          "attack_time": 800,
          "critical_strike_chance": 660,
          "physical_damage_max": 114,
          "physical_damage_min": 38,
          "range": 13
      },
      "implicits": [
          "StaffBlockPercentImplicitStaff1"
      ],
      "tags": [
          "warstaff",
          "staff",
          "attack_staff",
          "two_hand_weapon",
          "twohand",
          "weapon",
          "default"
      ],
      "visualIdentity": {
          "ddsFile": "Art/2DItems/Weapons/TwoHandWeapons/Staves/Staff4.dds",
          "id": "Staff4"
      }
  },
  {
      "id": "Metadata/Items/Weapons/TwoHandWeapons/Staves/Staff11",
      "name": "Serpentine Staff",
      "itemClass": "Warstaff",
      "dropLevel": 49,
      "inventoryWidth": 2,
      "inventoryHeight": 4,
      "requirements": {
          "level": 49,
          "strength": 85,
          "dexterity": 0,
          "intelligence": 85
      },
      "properties": {
          "attack_time": 800,
          "critical_strike_chance": 630,
          "physical_damage_max": 117,
          "physical_damage_min": 56,
          "range": 13
      },
      "implicits": [
          "StaffBlockPercentImplicitStaff2"
      ],
      "tags": [
          "warstaff",
          "staff",
          "attack_staff",
          "two_hand_weapon",
          "twohand",
          "weapon",
          "default"
      ],
      "visualIdentity": {
          "ddsFile": "Art/2DItems/Weapons/TwoHandWeapons/Staves/Staff5.dds",
          "id": "Staff5"
      }
  },
  {
      "id": "Metadata/Items/Weapons/TwoHandWeapons/Staves/Staff13",
      "name": "Foul Staff",
      "itemClass": "Warstaff",
      "dropLevel": 55,
      "inventoryWidth": 2,
      "inventoryHeight": 4,
      "requirements": {
          "level": 55,
          "strength": 94,
          "dexterity": 0,
          "intelligence": 94
      },
      "properties": {
          "attack_time": 769,
          "critical_strike_chance": 610,
          "physical_damage_max": 121,
          "physical_damage_min": 65,
          "range": 13
      },
      "implicits": [
          "StaffBlockPercentImplicitStaff1"
      ],
      "tags": [
          "warstaff",
          "staff",
          "attack_staff",
          "two_hand_weapon",
          "twohand",
          "weapon",
          "default"
      ],
      "visualIdentity": {
          "ddsFile": "Art/2DItems/Weapons/TwoHandWeapons/Staves/Staff7.dds",
          "id": "Staff7"
      }
  },
  {
      "id": "Metadata/Items/Weapons/TwoHandWeapons/Staves/Staff16",
      "name": "Ezomyte Staff",
      "itemClass": "Warstaff",
      "dropLevel": 60,
      "inventoryWidth": 2,
      "inventoryHeight": 4,
      "requirements": {
          "level": 60,
          "strength": 113,
          "dexterity": 0,
          "intelligence": 113
      },
      "properties": {
          "attack_time": 800,
          "critical_strike_chance": 730,
          "physical_damage_max": 160,
          "physical_damage_min": 53,
          "range": 13
      },
      "implicits": [
          "StaffBlockPercentImplicitStaff2"
      ],
      "tags": [
          "warstaff",
          "staff",
          "attack_staff",
          "two_hand_weapon",
          "twohand",
          "weapon",
          "default"
      ],
      "visualIdentity": {
          "ddsFile": "Art/2DItems/Weapons/TwoHandWeapons/Staves/Staff4.dds",
          "id": "Staff4"
      }
  },
  {
      "id": "Metadata/Items/Weapons/TwoHandWeapons/Staves/Staff17",
      "name": "Maelström Staff",
      "itemClass": "Warstaff",
      "dropLevel": 64,
      "inventoryWidth": 2,
      "inventoryHeight": 4,
      "requirements": {
          "level": 64,
          "strength": 113,
          "dexterity": 0,
          "intelligence": 113
      },
      "properties": {
          "attack_time": 800,
          "critical_strike_chance": 680,
          "physical_damage_max": 147,
          "physical_damage_min": 71,
          "range": 13
      },
      "implicits": [
          "StaffBlockPercentImplicitStaff3"
      ],
      "tags": [
          "warstaff",
          "staff",
          "attack_staff",
          "two_hand_weapon",
          "twohand",
          "weapon",
          "default"
      ],
      "visualIdentity": {
          "ddsFile": "Art/2DItems/Weapons/TwoHandWeapons/Staves/Staff5.dds",
          "id": "Staff5"
      }
  },
  {
      "id": "Metadata/Items/Weapons/TwoHandWeapons/Staves/Staff19",
      "name": "Judgement Staff",
      "itemClass": "Warstaff",
      "dropLevel": 68,
      "inventoryWidth": 2,
      "inventoryHeight": 4,
      "requirements": {
          "level": 68,
          "strength": 113,
          "dexterity": 0,
          "intelligence": 113
      },
      "properties": {
          "attack_time": 769,
          "critical_strike_chance": 650,
          "physical_damage_max": 136,
          "physical_damage_min": 73,
          "range": 13
      },
      "implicits": [
          "StaffSpellBlockPercentImplicitStaff__1"
      ],
      "tags": [
          "warstaff",
          "staff",
          "attack_staff",
          "two_hand_weapon",
          "twohand",
          "weapon",
          "default"
      ],
      "visualIdentity": {
          "ddsFile": "Art/2DItems/Weapons/TwoHandWeapons/Staves/Staff7.dds",
          "id": "Staff7"
      }
  },
];

// ===== ALL BASE ITEMS COMBINED =====
export const ALL_POE_BASE_ITEMS: PoeBaseItem[] = [
  ...AMULET_BASES,
  ...BELT_BASES,
  ...BODY_ARMOUR_BASES,
  ...BOOTS_BASES,
  ...BOW_BASES,
  ...CLAW_BASES,
  ...DAGGER_BASES,
  ...GLOVES_BASES,
  ...HELMET_BASES,
  ...ONE_HAND_AXE_BASES,
  ...ONE_HAND_MACE_BASES,
  ...ONE_HAND_SWORD_BASES,
  ...QUIVER_BASES,
  ...RING_BASES,
  ...RUNE_DAGGER_BASES,
  ...SCEPTRE_BASES,
  ...SHIELD_BASES,
  ...STAFF_BASES,
  ...THRUSTING_ONE_HAND_SWORD_BASES,
  ...TWO_HAND_AXE_BASES,
  ...TWO_HAND_MACE_BASES,
  ...TWO_HAND_SWORD_BASES,
  ...WAND_BASES,
  ...WARSTAFF_BASES,
];

// ===== HELPER FUNCTIONS =====

// Get a base item by its ID
export function getPoeBaseItemById(id: string): PoeBaseItem | undefined {
  return ALL_POE_BASE_ITEMS.find(item => item.id === id);
}

// Get a base item by its name
export function getPoeBaseItemByName(name: string): PoeBaseItem | undefined {
  return ALL_POE_BASE_ITEMS.find(item => item.name === name);
}

// Get all base items for a specific item class
export function getPoeBaseItemsByClass(itemClass: string): PoeBaseItem[] {
  return ALL_POE_BASE_ITEMS.filter(item => item.itemClass === itemClass);
}

// Get all base items within a drop level range
export function getPoeBaseItemsByDropLevel(minLevel: number, maxLevel: number): PoeBaseItem[] {
  return ALL_POE_BASE_ITEMS.filter(item => item.dropLevel >= minLevel && item.dropLevel <= maxLevel);
}

// Get implicit mod by ID
export function getImplicitMod(modId: string): PoeMod | undefined {
  return POE_IMPLICIT_MODS[modId];
}

// Get all implicit mods for a base item
export function getImplicitsForBaseItem(baseItem: PoeBaseItem): PoeMod[] {
  return baseItem.implicits
    .map(id => POE_IMPLICIT_MODS[id])
    .filter((mod): mod is PoeMod => mod !== undefined);
}

// Format implicit mod stats as readable text
export function formatImplicitStats(mod: PoeMod): string[] {
  return mod.stats.map(stat => {
    const value = stat.min === stat.max ? stat.min.toString() : `${stat.min}-${stat.max}`;
    // Simple formatting - in production you'd use stat_translations.json
    return `${stat.id.replace(/_/g, ' ')}: ${value}`;
  });
}
