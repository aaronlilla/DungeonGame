/**
 * Boss Ability System
 * Each boss has 2-3 rotational abilities, 1 signature ability, and a kill buff
 */

export interface BossAbility {
  id: string;
  name: string;
  description: string;
  castTime: number; // seconds
  cooldown: number; // seconds
  isSignature: boolean; // Signature abilities are phase-defining
  isOncePerFight?: boolean; // Some signature abilities only happen once
  damage?: number; // Base damage (will be scaled)
  damageType?: 'physical' | 'fire' | 'cold' | 'lightning' | 'chaos' | 'mixed';
  targetType: 'all' | 'tank' | 'lowestLife' | 'highestDPS' | 'random' | 'self';
  effects?: BossAbilityEffect[];
}

export interface BossAbilityEffect {
  type: 'debuff' | 'buff' | 'stun' | 'silence' | 'statReduction' | 'removeBuffs' | 'removeCharges' | 'convertDamage' | 'summon' | 'counter';
  name: string;
  duration?: number; // turns/seconds
  value?: number; // effect magnitude
  stacks?: boolean; // Can stack
  maxStacks?: number;
}

export interface BossDebuff {
  id: string;
  name: string;
  stacks: number;
  duration: number; // ticks remaining
  value?: number;
}

export interface BossBuff {
  id: string;
  name: string;
  duration: number; // ticks remaining
  value?: number;
}

export interface BossKillBuff {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  effects: {
    type: 'damage' | 'armor' | 'damageReduction' | 'lifeRegen' | 'castSpeed' | 'maxHealth';
    value: number;
  }[];
}

// Boss ability definitions
export const BOSS_ABILITIES: Record<string, BossAbility[]> = {
  // Vaelrix the Gilded Ruin
  'Vaelrix the Gilded Ruin': [
    {
      id: 'coinlash_barrage',
      name: 'Coinlash Barrage',
      description: 'Hits all enemies. Applies Gilded (+10% damage taken, stacks up to 5).',
      castTime: 0,
      cooldown: 2,
      isSignature: false,
      damage: 30, // Reduced from 50 - hits all party members, balanced for healing throughput
      damageType: 'physical',
      targetType: 'all',
      effects: [{ type: 'debuff', name: 'Gilded', duration: 5, stacks: true, maxStacks: 5, value: 10 }]
    },
    {
      id: 'molten_treasury',
      name: 'Molten Treasury',
      description: 'Fire + Physical hit. Converts 20% of damage taken by boss into temporary armour for 3 turns.',
      castTime: 2,
      cooldown: 6,
      isSignature: false,
      damage: 40, // Reduced from 60 - tank buster, but shouldn't one-shot when combined with other abilities
      damageType: 'mixed',
      targetType: 'tank',
      effects: [{ type: 'buff', name: 'Treasury Armor', duration: 3, value: 20 }]
    },
    {
      id: 'tax_of_excess',
      name: 'Tax of Excess',
      description: 'Removes all buffs from the highest-DPS party member.',
      castTime: 0,
      cooldown: 4,
      isSignature: false,
      damage: 0,
      targetType: 'highestDPS',
      effects: [{ type: 'removeBuffs', name: 'Tax of Excess' }]
    },
    {
      id: 'ruin_interest',
      name: 'Ruin Interest',
      description: 'Deals damage per buff stack currently active on the party.',
      castTime: 3,
      cooldown: 10,
      isSignature: true,
      damage: 30, // Scaled up for balanced DPS (~3 DPS)
      damageType: 'chaos',
      targetType: 'all'
    }
  ],

  // Morchant, Bell-Bearer of the Last Toll
  'Morchant, Bell-Bearer of the Last Toll': [
    {
      id: 'grave_toll',
      name: 'Grave Toll',
      description: 'Applies Doom Counter (takes +5% damage per turn).',
      castTime: 0,
      cooldown: 3,
      isSignature: false,
      damage: 0,
      targetType: 'all',
      effects: [{ type: 'debuff', name: 'Doom Counter', duration: 10, stacks: true, value: 5 }]
    },
    {
      id: 'funeral_resonance',
      name: 'Funeral Resonance',
      description: 'Damage increases for each dead enemy or fallen ally.',
      castTime: 2,
      cooldown: 6,
      isSignature: false,
      damage: 120, // Scaled up for balanced DPS (~20 DPS)
      damageType: 'physical',
      targetType: 'all'
    },
    {
      id: 'final_peal',
      name: 'Final Peal',
      description: 'Stuns the lowest-life party member for 1 turn.',
      castTime: 0,
      cooldown: 5,
      isSignature: false,
      damage: 75, // Scaled up for balanced DPS (~15 DPS)
      damageType: 'physical',
      targetType: 'lowestLife',
      effects: [{ type: 'stun', name: 'Final Peal', duration: 1 }]
    },
    {
      id: 'the_last_bell',
      name: 'The Last Bell',
      description: 'Instantly triggers all Doom Counters for massive damage.',
      castTime: 4,
      cooldown: 999, // Once per fight
      isSignature: true,
      isOncePerFight: true,
      damage: 50, // Base, +20 per Doom Counter stack
      damageType: 'chaos',
      targetType: 'all'
    }
  ],

  // Xyra Noctyss, Widow of the Black Sun
  'Xyra Noctyss, Widow of the Black Sun': [
    {
      id: 'blacklight_sever',
      name: 'Blacklight Sever',
      description: 'Chaos damage + −10% Chaos Res (stacks).',
      castTime: 0,
      cooldown: 2,
      isSignature: false,
      damage: 50, // Scaled up for balanced DPS (~25 DPS)
      damageType: 'chaos',
      targetType: 'all',
      effects: [{ type: 'debuff', name: 'Chaos Vulnerability', duration: 8, stacks: true, maxStacks: 5, value: -10 }]
    },
    {
      id: 'eclipse_veil',
      name: 'Eclipse Veil',
      description: 'Gains 40% chance to Evade for 3 turns.',
      castTime: 1,
      cooldown: 5,
      isSignature: false,
      damage: 0,
      targetType: 'self',
      effects: [{ type: 'buff', name: 'Eclipse Veil', duration: 3, value: 40 }]
    },
    {
      id: 'void_brood',
      name: 'Void Brood',
      description: 'Summons a damage-over-time debuff on all players.',
      castTime: 0,
      cooldown: 4,
      isSignature: false,
      damage: 0,
      targetType: 'all',
      effects: [{ type: 'debuff', name: 'Void Brood', duration: 5, value: 16 }] // Scaled up: 16 damage per turn
    },
    {
      id: 'singularity_bloom',
      name: 'Singularity Bloom',
      description: 'Damage increases per debuff currently on party.',
      castTime: 3,
      cooldown: 9,
      isSignature: true,
      damage: 40, // Scaled up for balanced DPS (~4.4 DPS)
      damageType: 'chaos',
      targetType: 'all'
    }
  ],

  // Thalos Grimmwake
  'Thalos Grimmwake': [
    {
      id: 'grave_rend',
      name: 'Grave Rend',
      description: 'Physical + Chaos damage, applies Maim.',
      castTime: 0,
      cooldown: 2,
      isSignature: false,
      damage: 50, // Scaled up for balanced DPS (~25 DPS)
      damageType: 'mixed',
      targetType: 'tank',
      effects: [{ type: 'debuff', name: 'Maim', duration: 4, value: 15 }] // -15% damage dealt
    },
    {
      id: 'rotting_covenant',
      name: 'Rotting Covenant',
      description: 'Converts boss damage dealt into Life Regen.',
      castTime: 2,
      cooldown: 6,
      isSignature: false,
      damage: 60, // Scaled up for balanced DPS (~10 DPS)
      damageType: 'chaos',
      targetType: 'all',
      effects: [{ type: 'buff', name: 'Rotting Covenant', duration: 3, value: 20 }] // 20% of damage as regen
    },
    {
      id: 'corpse_echo',
      name: 'Corpse Echo',
      description: 'Repeats the last ability used at 50% power.',
      castTime: 0,
      cooldown: 4,
      isSignature: false,
      damage: 0, // Will be calculated based on last ability
      targetType: 'all'
    },
    {
      id: 'march_of_the_unburied',
      name: 'March of the Unburied',
      description: 'Applies stacking damage-over-time to all enemies for 5 turns.',
      castTime: 3,
      cooldown: 10,
      isSignature: true,
      damage: 0,
      targetType: 'all',
      effects: [{ type: 'debuff', name: 'March of the Unburied', duration: 5, stacks: true, value: 24 }] // Scaled up: 24 damage per turn, stacks
    }
  ],

  // Eidolon Kareth, the Unremembered
  'Eidolon Kareth, the Unremembered': [
    {
      id: 'mind_bleach',
      name: 'Mind Bleach',
      description: 'Reduces all stats by 5% (stacks).',
      castTime: 0,
      cooldown: 3,
      isSignature: false,
      damage: 0,
      targetType: 'all',
      effects: [{ type: 'statReduction', name: 'Mind Bleach', duration: 10, stacks: true, value: 5 }]
    },
    {
      id: 'identity_collapse',
      name: 'Identity Collapse',
      description: 'Removes all Charges from party.',
      castTime: 2,
      cooldown: 7,
      isSignature: false,
      damage: 40, // Reduced from 70 - hits all party members, balanced for healing throughput
      damageType: 'chaos',
      targetType: 'all',
      effects: [{ type: 'removeCharges', name: 'Identity Collapse' }]
    },
    {
      id: 'blank_reflection',
      name: 'Blank Reflection',
      description: 'Copies the highest party stat and uses it offensively.',
      castTime: 0,
      cooldown: 4,
      isSignature: false,
      damage: 50, // Reduced from 100 - hits all party members, balanced for healing throughput
      damageType: 'chaos',
      targetType: 'all'
    },
    {
      id: 'total_amnesia',
      name: 'Total Amnesia',
      description: 'Clears all buffs, debuffs, and charges on both sides, then deals damage.',
      castTime: 4,
      cooldown: 999, // Once per fight
      isSignature: true,
      isOncePerFight: true,
      damage: 40, // Reduced from 60 - hits all party members, balanced for healing throughput
      damageType: 'chaos',
      targetType: 'all'
    }
  ],

  // The Ashbound Regent
  'The Ashbound Regent': [
    {
      id: 'cinder_decree',
      name: 'Cinder Decree',
      description: 'Fire damage + Ignite.',
      castTime: 0,
      cooldown: 2,
      isSignature: false,
      damage: 50, // Scaled up for balanced DPS (~25 DPS)
      damageType: 'fire',
      targetType: 'all',
      effects: [{ type: 'debuff', name: 'Ignite', duration: 4, value: 16 }] // Scaled up: 16 fire damage per turn
    },
    {
      id: 'royal_immolation',
      name: 'Royal Immolation',
      description: 'Fire damage increases each turn for 4 turns.',
      castTime: 2,
      cooldown: 6,
      isSignature: false,
      damage: 60, // Scaled up for balanced DPS (~10 DPS)
      damageType: 'fire',
      targetType: 'all'
    },
    {
      id: 'crown_of_embers',
      name: 'Crown of Embers',
      description: 'Converts Armour into Fire Damage for boss.',
      castTime: 0,
      cooldown: 4,
      isSignature: false,
      damage: 0,
      targetType: 'self',
      effects: [{ type: 'buff', name: 'Crown of Embers', duration: 3, value: 50 }] // +50% fire damage
    },
    {
      id: 'rule_by_flame',
      name: 'Rule by Flame',
      description: 'Boss gains +50% damage, loses 20% life over duration.',
      castTime: 3,
      cooldown: 10,
      isSignature: true,
      damage: 0,
      targetType: 'self',
      effects: [{ type: 'buff', name: 'Rule by Flame', duration: 5, value: 50 }] // +50% damage, -20% life
    }
  ],

  // Kaelthorne, He Who Will Not Fall
  'Kaelthorne, He Who Will Not Fall': [
    {
      id: 'unyielding_strike',
      name: 'Unyielding Strike',
      description: 'Damage scales with boss armour.',
      castTime: 0,
      cooldown: 2,
      isSignature: false,
      damage: 50, // Scaled up for balanced DPS (~25 DPS)
      damageType: 'physical',
      targetType: 'tank'
    },
    {
      id: 'stand_eternal',
      name: 'Stand Eternal',
      description: 'Gains massive Armour + Block for 3 turns.',
      castTime: 2,
      cooldown: 6,
      isSignature: false,
      damage: 0,
      targetType: 'self',
      effects: [{ type: 'buff', name: 'Stand Eternal', duration: 3, value: 100 }] // +100 armor, +25% block
    },
    {
      id: 'crushing_rebuttal',
      name: 'Crushing Rebuttal',
      description: 'Counter-attack after being hit.',
      castTime: 0,
      cooldown: 4,
      isSignature: false,
      damage: 40, // Scaled up for balanced DPS (~10 DPS)
      damageType: 'physical',
      targetType: 'random'
    },
    {
      id: 'last_bastion',
      name: 'Last Bastion',
      description: 'Cannot drop below 1 HP for 3 turns.',
      castTime: 3,
      cooldown: 999, // Once per fight
      isSignature: true,
      isOncePerFight: true,
      damage: 0,
      targetType: 'self',
      effects: [{ type: 'buff', name: 'Last Bastion', duration: 3, value: 1 }] // Invulnerable to death
    }
  ],

  // Ulthraxis of the Hungering Quiet
  'Ulthraxis of the Hungering Quiet': [
    {
      id: 'mute_reality',
      name: 'Mute Reality',
      description: 'Silence party for 1 turn.',
      castTime: 0,
      cooldown: 4,
      isSignature: false,
      damage: 20, // Reduced from 50 - hits all party members, balanced for tier 1 boss
      damageType: 'chaos',
      targetType: 'all',
      effects: [{ type: 'silence', name: 'Mute Reality', duration: 1 }]
    },
    {
      id: 'devour_sound',
      name: 'Devour Sound',
      description: 'Damage increases if party skipped actions.',
      castTime: 0,
      cooldown: 3,
      isSignature: false,
      damage: 20, // Reduced from 50 - hits all party members, balanced for tier 1 boss
      damageType: 'chaos',
      targetType: 'all'
    },
    {
      id: 'quiet_collapse',
      name: 'Quiet Collapse',
      description: 'Damage scales with missing mana.',
      castTime: 0,
      cooldown: 6,
      isSignature: false,
      damage: 15, // Reduced from 40 - hits all party members, scales with missing mana
      damageType: 'chaos',
      targetType: 'all'
    },
    {
      id: 'absolute_silence',
      name: 'Absolute Silence',
      description: 'No actions for 1 turn.',
      castTime: 0,
      cooldown: 999, // Once per fight
      isSignature: true,
      isOncePerFight: true,
      damage: 20, // Reduced from 40 - hits all party members, once per fight
      damageType: 'chaos',
      targetType: 'all',
      effects: [{ type: 'silence', name: 'Absolute Silence', duration: 1 }]
    }
  ],

  // Nyxavel, Mouth of the Void Choir
  'Nyxavel, Mouth of the Void Choir': [
    {
      id: 'chorus_of_hunger',
      name: 'Chorus of Hunger',
      description: 'Hits multiple times.',
      castTime: 0,
      cooldown: 2,
      isSignature: false,
      damage: 25, // Scaled up: Hits 3 times = 75 total (~37.5 DPS)
      damageType: 'chaos',
      targetType: 'all'
    },
    {
      id: 'echo_reversal',
      name: 'Echo Reversal',
      description: 'Repeats party\'s last action.',
      castTime: 0,
      cooldown: 5,
      isSignature: false,
      damage: 0, // Will repeat last party action
      targetType: 'all'
    },
    {
      id: 'unending_verse',
      name: 'Unending Verse',
      description: 'Damage ramps each cast.',
      castTime: 0,
      cooldown: 4,
      isSignature: false,
      damage: 0, // Base, increases by 10% each cast - removed damage to balance
      damageType: 'chaos',
      targetType: 'all'
    },
    {
      id: 'infinite_refrain',
      name: 'Infinite Refrain',
      description: 'Loops last 3 abilities.',
      castTime: 0,
      cooldown: 999, // Once per fight
      isSignature: true,
      isOncePerFight: true,
      damage: 0, // Will loop last 3 abilities
      targetType: 'all'
    }
  ],

  // Zha'karoth, The Fold Between Stars
  'Zha\'karoth, The Fold Between Stars': [
    {
      id: 'reality_tear',
      name: 'Reality Tear',
      description: 'Randomized damage type.',
      castTime: 0,
      cooldown: 2,
      isSignature: false,
      damage: 50, // Scaled up for balanced DPS (~25 DPS)
      damageType: 'mixed',
      targetType: 'all'
    },
    {
      id: 'non_euclidean_math',
      name: 'Non-Euclidean Math',
      description: 'Random stat inversion.',
      castTime: 0,
      cooldown: 5,
      isSignature: false,
      damage: 0,
      targetType: 'all',
      effects: [{ type: 'statReduction', name: 'Non-Euclidean Math', duration: 3, value: 20 }] // Random stat -20%
    },
    {
      id: 'causal_break',
      name: 'Causal Break',
      description: 'Resets cooldowns.',
      castTime: 0,
      cooldown: 7,
      isSignature: false,
      damage: 50, // Scaled up for balanced DPS (~7.14 DPS)
      damageType: 'chaos',
      targetType: 'all'
    },
    {
      id: 'impossible_outcome',
      name: 'Impossible Outcome',
      description: 'Random massive effect.',
      castTime: 0,
      cooldown: 999, // Once per fight
      isSignature: true,
      isOncePerFight: true,
      damage: 80, // Random massive damage
      damageType: 'mixed',
      targetType: 'all'
    }
  ],

  // ========== MINIBOSSES - GATE BOSSES ==========
  // Bone Golem
  'Bone Golem': [
    {
      id: 'ground_slam',
      name: 'Ground Slam',
      description: 'Slams the ground with devastating force, crushing the tank.',
      castTime: 1.5,
      cooldown: 5,
      isSignature: false,
      damage: 70, // Scaled up for balanced DPS (~14 DPS)
      damageType: 'physical',
      targetType: 'tank'
    },
    {
      id: 'bone_shards',
      name: 'Bone Shards',
      description: 'Fires sharp bone fragments at all enemies.',
      castTime: 0,
      cooldown: 3,
      isSignature: false,
      damage: 50, // Scaled up for balanced DPS (~16.67 DPS)
      damageType: 'physical',
      targetType: 'all'
    },
    {
      id: 'shatter',
      name: 'Shatter',
      description: 'Massive AoE explosion that deals heavy damage to all.',
      castTime: 2.5,
      cooldown: 8,
      isSignature: true,
      damage: 40, // Scaled up for balanced DPS (~5 DPS)
      damageType: 'physical',
      targetType: 'all'
    }
  ],

  // Death Knight
  'Death Knight': [
    {
      id: 'mortal_strike',
      name: 'Mortal Strike',
      description: 'A brutal strike that wounds the tank deeply.',
      castTime: 1.5,
      cooldown: 5,
      isSignature: false,
      damage: 70, // Scaled up for balanced DPS (~14 DPS)
      damageType: 'physical',
      targetType: 'tank'
    },
    {
      id: 'death_grip',
      name: 'Death Grip',
      description: 'Pulls the lowest-life party member and strikes them.',
      castTime: 0,
      cooldown: 4,
      isSignature: false,
      damage: 50, // Scaled up for balanced DPS (~12.5 DPS)
      damageType: 'physical',
      targetType: 'lowestLife'
    },
    {
      id: 'army_of_the_dead',
      name: 'Army of the Dead',
      description: 'Summons dark energy that damages all enemies over time.',
      castTime: 2,
      cooldown: 10,
      isSignature: true,
      damage: 0,
      damageType: 'chaos',
      targetType: 'all',
      effects: [{ type: 'debuff', name: 'Army of the Dead', duration: 5, value: 30 }] // Scaled up: 30 damage per turn
    }
  ],

  // Undying Lich
  'Undying Lich': [
    {
      id: 'soul_rend',
      name: 'Soul Rend',
      description: 'Tears at the tank\'s soul with dark magic.',
      castTime: 1.5,
      cooldown: 5,
      isSignature: false,
      damage: 70, // Scaled up for balanced DPS (~14 DPS)
      damageType: 'chaos',
      targetType: 'tank'
    },
    {
      id: 'frostbolt_volley',
      name: 'Frostbolt Volley',
      description: 'Fires multiple frostbolts at random targets.',
      castTime: 0,
      cooldown: 3,
      isSignature: false,
      damage: 50, // Scaled up for balanced DPS (~16.67 DPS)
      damageType: 'cold',
      targetType: 'random'
    },
    {
      id: 'death_and_decay',
      name: 'Death and Decay',
      description: 'Corrupts the ground, dealing damage over time to all enemies.',
      castTime: 2,
      cooldown: 8,
      isSignature: true,
      damage: 0,
      damageType: 'chaos',
      targetType: 'all',
      effects: [{ type: 'debuff', name: 'Death and Decay', duration: 6, value: 24 }] // Scaled up: 24 damage per turn
    }
  ],

  // Sable Hierophant Malverin
  'Sable Hierophant Malverin': [
    {
      id: 'shadow_liturgy',
      name: 'Shadow Liturgy',
      description: 'Dark prayers that sap vitality from all enemies.',
      castTime: 0,
      cooldown: 2,
      isSignature: false,
      damage: 50,
      damageType: 'chaos',
      targetType: 'all',
      effects: [{ type: 'debuff', name: 'Vitality Drain', duration: 4, value: 12 }]
    },
    {
      id: 'profane_blessing',
      name: 'Profane Blessing',
      description: 'Heals the boss and grants temporary damage boost.',
      castTime: 2,
      cooldown: 6,
      isSignature: false,
      damage: 0,
      targetType: 'self',
      effects: [{ type: 'buff', name: 'Profane Blessing', duration: 4, value: 30 }]
    },
    {
      id: 'dark_communion',
      name: 'Dark Communion',
      description: 'Links all party members, sharing damage taken.',
      castTime: 0,
      cooldown: 4,
      isSignature: false,
      damage: 40,
      damageType: 'chaos',
      targetType: 'all',
      effects: [{ type: 'debuff', name: 'Dark Link', duration: 3, value: 15 }]
    },
    {
      id: 'hierophants_decree',
      name: 'Hierophant\'s Decree',
      description: 'Massive chaos damage that increases with each debuff on the party.',
      castTime: 3,
      cooldown: 10,
      isSignature: true,
      damage: 35,
      damageType: 'chaos',
      targetType: 'all'
    }
  ],

  // Orryx of the Shattered Crown
  'Orryx of the Shattered Crown': [
    {
      id: 'crown_shard',
      name: 'Crown Shard',
      description: 'Fires razor-sharp crown fragments at all enemies.',
      castTime: 0,
      cooldown: 2,
      isSignature: false,
      damage: 50,
      damageType: 'physical',
      targetType: 'all',
      effects: [{ type: 'debuff', name: 'Bleeding', duration: 4, value: 14 }]
    },
    {
      id: 'royal_decree',
      name: 'Royal Decree',
      description: 'Commands the tank to kneel, stunning them briefly.',
      castTime: 1.5,
      cooldown: 5,
      isSignature: false,
      damage: 60,
      damageType: 'physical',
      targetType: 'tank',
      effects: [{ type: 'stun', name: 'Kneel', duration: 1 }]
    },
    {
      id: 'shattered_majesty',
      name: 'Shattered Majesty',
      description: 'Each fragment of the crown attacks independently.',
      castTime: 0,
      cooldown: 4,
      isSignature: false,
      damage: 30,
      damageType: 'physical',
      targetType: 'random'
    },
    {
      id: 'crown_of_ruin',
      name: 'Crown of Ruin',
      description: 'The crown explodes, dealing massive damage and removing all armor buffs.',
      castTime: 3,
      cooldown: 10,
      isSignature: true,
      damage: 40,
      damageType: 'physical',
      targetType: 'all',
      effects: [{ type: 'removeBuffs', name: 'Crown of Ruin' }]
    }
  ],

  // Virexa, Blood-Archivist Eternal
  'Virexa, Blood-Archivist Eternal': [
    {
      id: 'blood_script',
      name: 'Blood Script',
      description: 'Writes in blood, dealing damage and stealing life.',
      castTime: 0,
      cooldown: 2,
      isSignature: false,
      damage: 50,
      damageType: 'chaos',
      targetType: 'all',
      effects: [{ type: 'buff', name: 'Blood Script', duration: 3, value: 15 }]
    },
    {
      id: 'crimson_archive',
      name: 'Crimson Archive',
      description: 'Records damage taken and reflects it back.',
      castTime: 2,
      cooldown: 6,
      isSignature: false,
      damage: 0,
      targetType: 'self',
      effects: [{ type: 'buff', name: 'Crimson Archive', duration: 4, value: 25 }]
    },
    {
      id: 'exsanguinate',
      name: 'Exsanguinate',
      description: 'Drains blood from the lowest-life target.',
      castTime: 0,
      cooldown: 4,
      isSignature: false,
      damage: 70,
      damageType: 'chaos',
      targetType: 'lowestLife'
    },
    {
      id: 'eternal_ledger',
      name: 'Eternal Ledger',
      description: 'Deals damage equal to all damage dealt this fight.',
      castTime: 3,
      cooldown: 999,
      isSignature: true,
      isOncePerFight: true,
      damage: 45,
      damageType: 'chaos',
      targetType: 'all'
    }
  ],

  // The Pale Confluence
  'The Pale Confluence': [
    {
      id: 'pale_touch',
      name: 'Pale Touch',
      description: 'Drains color and warmth, dealing cold damage.',
      castTime: 0,
      cooldown: 2,
      isSignature: false,
      damage: 50,
      damageType: 'cold',
      targetType: 'all',
      effects: [{ type: 'debuff', name: 'Frostbite', duration: 4, value: 12 }]
    },
    {
      id: 'merging_streams',
      name: 'Merging Streams',
      description: 'Combines with fallen enemies to gain strength.',
      castTime: 2,
      cooldown: 6,
      isSignature: false,
      damage: 60,
      damageType: 'cold',
      targetType: 'all',
      effects: [{ type: 'buff', name: 'Confluence', duration: 4, value: 20 }]
    },
    {
      id: 'frozen_convergence',
      name: 'Frozen Convergence',
      description: 'Pulls all enemies together, dealing cold damage.',
      castTime: 0,
      cooldown: 4,
      isSignature: false,
      damage: 45,
      damageType: 'cold',
      targetType: 'all',
      effects: [{ type: 'stun', name: 'Frozen', duration: 1 }]
    },
    {
      id: 'absolute_zero',
      name: 'Absolute Zero',
      description: 'Freezes everything, dealing massive cold damage.',
      castTime: 3,
      cooldown: 10,
      isSignature: true,
      damage: 40,
      damageType: 'cold',
      targetType: 'all',
      effects: [{ type: 'debuff', name: 'Absolute Zero', duration: 3, value: 20 }]
    }
  ],

  // Ichorion, Dream-Leech Prime
  'Ichorion, Dream-Leech Prime': [
    {
      id: 'dream_siphon',
      name: 'Dream Siphon',
      description: 'Drains dreams, dealing chaos damage and reducing mana.',
      castTime: 0,
      cooldown: 2,
      isSignature: false,
      damage: 50,
      damageType: 'chaos',
      targetType: 'all',
      effects: [{ type: 'debuff', name: 'Mana Drain', duration: 4, value: 10 }]
    },
    {
      id: 'nightmare_weave',
      name: 'Nightmare Weave',
      description: 'Weaves nightmares that confuse and damage.',
      castTime: 2,
      cooldown: 6,
      isSignature: false,
      damage: 60,
      damageType: 'chaos',
      targetType: 'all',
      effects: [{ type: 'debuff', name: 'Confusion', duration: 3, value: 15 }]
    },
    {
      id: 'leech_swarm',
      name: 'Leech Swarm',
      description: 'Summons dream leeches that attach to random targets.',
      castTime: 0,
      cooldown: 4,
      isSignature: false,
      damage: 0,
      targetType: 'random',
      effects: [{ type: 'debuff', name: 'Leech', duration: 5, value: 18 }]
    },
    {
      id: 'eternal_slumber',
      name: 'Eternal Slumber',
      description: 'Puts the party to sleep, stunning all for 1 turn.',
      castTime: 3,
      cooldown: 10,
      isSignature: true,
      damage: 35,
      damageType: 'chaos',
      targetType: 'all',
      effects: [{ type: 'stun', name: 'Sleep', duration: 1 }]
    }
  ],

  // Qel'Thuun the Infinite Murmur
  'Qel\'Thuun the Infinite Murmur': [
    {
      id: 'whispered_curse',
      name: 'Whispered Curse',
      description: 'Whispers curses that stack and grow stronger.',
      castTime: 0,
      cooldown: 2,
      isSignature: false,
      damage: 50,
      damageType: 'chaos',
      targetType: 'all',
      effects: [{ type: 'debuff', name: 'Whispered Curse', duration: 6, stacks: true, maxStacks: 10, value: 5 }]
    },
    {
      id: 'echo_chamber',
      name: 'Echo Chamber',
      description: 'Repeats the last ability used at full power.',
      castTime: 2,
      cooldown: 6,
      isSignature: false,
      damage: 60,
      damageType: 'chaos',
      targetType: 'all'
    },
    {
      id: 'infinite_recursion',
      name: 'Infinite Recursion',
      description: 'Each hit spawns another weaker hit.',
      castTime: 0,
      cooldown: 4,
      isSignature: false,
      damage: 40,
      damageType: 'chaos',
      targetType: 'random'
    },
    {
      id: 'the_final_murmur',
      name: 'The Final Murmur',
      description: 'All whispered curses trigger at once for massive damage.',
      castTime: 3,
      cooldown: 999,
      isSignature: true,
      isOncePerFight: true,
      damage: 30,
      damageType: 'chaos',
      targetType: 'all'
    }
  ],

  // The Spiral Witness
  'The Spiral Witness': [
    {
      id: 'spiral_gaze',
      name: 'Spiral Gaze',
      description: 'Hypnotic gaze that reduces stats.',
      castTime: 0,
      cooldown: 2,
      isSignature: false,
      damage: 50,
      damageType: 'chaos',
      targetType: 'all',
      effects: [{ type: 'statReduction', name: 'Spiral Gaze', duration: 5, stacks: true, value: 8 }]
    },
    {
      id: 'witness_mark',
      name: 'Witness Mark',
      description: 'Marks a target, increasing damage taken.',
      castTime: 1.5,
      cooldown: 5,
      isSignature: false,
      damage: 70,
      damageType: 'chaos',
      targetType: 'highestDPS',
      effects: [{ type: 'debuff', name: 'Witness Mark', duration: 6, value: 25 }]
    },
    {
      id: 'spiral_descent',
      name: 'Spiral Descent',
      description: 'Pulls enemies into the spiral, dealing increasing damage.',
      castTime: 0,
      cooldown: 4,
      isSignature: false,
      damage: 45,
      damageType: 'chaos',
      targetType: 'all'
    },
    {
      id: 'infinite_spiral',
      name: 'Infinite Spiral',
      description: 'Traps all in an endless spiral, dealing damage over time.',
      castTime: 3,
      cooldown: 10,
      isSignature: true,
      damage: 0,
      targetType: 'all',
      effects: [{ type: 'debuff', name: 'Infinite Spiral', duration: 6, value: 22 }]
    }
  ],

  // Voruun, Born of Unlight
  'Voruun, Born of Unlight': [
    {
      id: 'unlight_beam',
      name: 'Unlight Beam',
      description: 'Beam of anti-light that pierces all defenses.',
      castTime: 0,
      cooldown: 2,
      isSignature: false,
      damage: 55,
      damageType: 'chaos',
      targetType: 'all',
      effects: [{ type: 'debuff', name: 'Unlight', duration: 4, value: 10 }]
    },
    {
      id: 'void_embrace',
      name: 'Void Embrace',
      description: 'Embraces the void, gaining massive damage reduction.',
      castTime: 2,
      cooldown: 6,
      isSignature: false,
      damage: 0,
      targetType: 'self',
      effects: [{ type: 'buff', name: 'Void Embrace', duration: 4, value: 40 }]
    },
    {
      id: 'birth_of_darkness',
      name: 'Birth of Darkness',
      description: 'Spawns darkness that damages over time.',
      castTime: 0,
      cooldown: 4,
      isSignature: false,
      damage: 0,
      targetType: 'all',
      effects: [{ type: 'debuff', name: 'Darkness', duration: 5, value: 20 }]
    },
    {
      id: 'unlight_apocalypse',
      name: 'Unlight Apocalypse',
      description: 'Unleashes all unlight at once, devastating the party.',
      castTime: 3,
      cooldown: 10,
      isSignature: true,
      damage: 45,
      damageType: 'chaos',
      targetType: 'all'
    }
  ],

  // Cenotaph Omega
  'Cenotaph Omega': [
    {
      id: 'monument_strike',
      name: 'Monument Strike',
      description: 'Massive physical strike that crushes armor.',
      castTime: 0,
      cooldown: 2,
      isSignature: false,
      damage: 55,
      damageType: 'physical',
      targetType: 'tank',
      effects: [{ type: 'debuff', name: 'Armor Break', duration: 4, value: 20 }]
    },
    {
      id: 'eternal_remembrance',
      name: 'Eternal Remembrance',
      description: 'Remembers all damage taken and reflects it.',
      castTime: 2,
      cooldown: 6,
      isSignature: false,
      damage: 60,
      damageType: 'physical',
      targetType: 'all',
      effects: [{ type: 'buff', name: 'Remembrance', duration: 4, value: 30 }]
    },
    {
      id: 'tomb_seal',
      name: 'Tomb Seal',
      description: 'Seals a random target, preventing actions.',
      castTime: 0,
      cooldown: 5,
      isSignature: false,
      damage: 40,
      damageType: 'physical',
      targetType: 'random',
      effects: [{ type: 'stun', name: 'Sealed', duration: 2 }]
    },
    {
      id: 'omega_protocol',
      name: 'Omega Protocol',
      description: 'Final protocol that deals massive damage based on fight duration.',
      castTime: 3,
      cooldown: 10,
      isSignature: true,
      damage: 40,
      damageType: 'mixed',
      targetType: 'all'
    }
  ]
};

// Kill buffs for gate minibosses (permanent for the rest of the dungeon run)
export const MINIBOSS_KILL_BUFFS: Record<string, BossKillBuff> = {
  'bone_golem': {
    id: 'bone_barrier',
    name: 'Bone Barrier',
    description: '+8% Armor',
    icon: '🦴',
    color: '#a0a0a0',
    effects: [{ type: 'armor', value: 8 }]
  },
  'death_knight': {
    id: 'deathbringer',
    name: 'Deathbringer',
    description: '+8% Damage',
    icon: '⚔️',
    color: '#8b4513',
    effects: [{ type: 'damage', value: 8 }]
  },
  'lich': {
    id: 'soul_siphon',
    name: 'Soul Siphon',
    description: '+1% Life Regeneration per second',
    icon: '💀',
    color: '#6b5b95',
    effects: [{ type: 'lifeRegen', value: 1 }]
  }
};

// Kill buffs for final bosses (permanent for the rest of the dungeon run)
export const BOSS_KILL_BUFFS: Record<string, BossKillBuff> = {
  'Vaelrix the Gilded Ruin': {
    id: 'gilded_fortune',
    name: 'Gilded Fortune',
    description: '+12% Damage',
    icon: '💰',
    color: '#ffd700',
    effects: [{ type: 'damage', value: 12 }]
  },
  'Morchant, Bell-Bearer of the Last Toll': {
    id: 'deaths_punctuality',
    name: 'Death\'s Toll',
    description: '+10% Cast Speed',
    icon: '🔔',
    color: '#4a4a4a',
    effects: [{ type: 'castSpeed', value: 10 }]
  },
  'Xyra Noctyss, Widow of the Black Sun': {
    id: 'black_suns_grace',
    name: 'Black Sun\'s Grace',
    description: '+10% Damage, +5% Damage Reduction',
    icon: '🌑',
    color: '#1a1a2e',
    effects: [
      { type: 'damage', value: 10 },
      { type: 'damageReduction', value: 5 }
    ]
  },
  'Thalos Grimmwake': {
    id: 'grim_vitality',
    name: 'Grim Vitality',
    description: '+2% Life Regeneration per second',
    icon: '🩸',
    color: '#8b0000',
    effects: [{ type: 'lifeRegen', value: 2 }]
  },
  'Eidolon Kareth, the Unremembered': {
    id: 'echo_of_self',
    name: 'Echo of Self',
    description: '+10% Maximum Health',
    icon: '👻',
    color: '#e0e0e0',
    effects: [{ type: 'maxHealth', value: 10 }]
  },
  'The Ashbound Regent': {
    id: 'ashen_authority',
    name: 'Ashen Authority',
    description: '+15% Damage',
    icon: '🔥',
    color: '#ff4500',
    effects: [{ type: 'damage', value: 15 }]
  },
  'Kaelthorne, He Who Will Not Fall': {
    id: 'iron_resolve',
    name: 'Iron Resolve',
    description: '+15% Armor',
    icon: '🛡️',
    color: '#708090',
    effects: [{ type: 'armor', value: 15 }]
  },
  'Ulthraxis of the Hungering Quiet': {
    id: 'hungering_quiet',
    name: 'Hungering Quiet',
    description: '+8% Damage Reduction',
    icon: '🤫',
    color: '#2f4f4f',
    effects: [{ type: 'damageReduction', value: 8 }]
  },
  'Nyxavel, Mouth of the Void Choir': {
    id: 'void_choir',
    name: 'Void Choir',
    description: '+12% Cast Speed',
    icon: '🎭',
    color: '#4b0082',
    effects: [{ type: 'castSpeed', value: 12 }]
  },
  'Zha\'karoth, The Fold Between Stars': {
    id: 'fold_between_stars',
    name: 'Fold Between Stars',
    description: '+6% Damage Reduction, +6% Damage',
    icon: '✨',
    color: '#9400d3',
    effects: [
      { type: 'damageReduction', value: 6 },
      { type: 'damage', value: 6 }
    ]
  },
  'Sable Hierophant Malverin': {
    id: 'shadow_blessing',
    name: 'Shadow Blessing',
    description: '+10% Damage, +5% Damage Reduction',
    icon: '🌑',
    color: '#2c2c3e',
    effects: [
      { type: 'damage', value: 10 },
      { type: 'damageReduction', value: 5 }
    ]
  },
  'Orryx of the Shattered Crown': {
    id: 'royal_authority',
    name: 'Royal Authority',
    description: '+12% Armor',
    icon: '👑',
    color: '#c0c0c0',
    effects: [{ type: 'armor', value: 12 }]
  },
  'Virexa, Blood-Archivist Eternal': {
    id: 'blood_knowledge',
    name: 'Blood Knowledge',
    description: '+1.5% Life Regeneration per second',
    icon: '📖',
    color: '#8b0000',
    effects: [{ type: 'lifeRegen', value: 1.5 }]
  },
  'The Pale Confluence': {
    id: 'pale_blessing',
    name: 'Pale Blessing',
    description: '+8% Damage Reduction',
    icon: '❄️',
    color: '#e0e0e0',
    effects: [{ type: 'damageReduction', value: 8 }]
  },
  'Ichorion, Dream-Leech Prime': {
    id: 'dream_power',
    name: 'Dream Power',
    description: '+10% Cast Speed',
    icon: '💭',
    color: '#9370db',
    effects: [{ type: 'castSpeed', value: 10 }]
  },
  'Qel\'Thuun the Infinite Murmur': {
    id: 'infinite_echo',
    name: 'Infinite Echo',
    description: '+12% Damage',
    icon: '🔊',
    color: '#4b0082',
    effects: [{ type: 'damage', value: 12 }]
  },
  'The Spiral Witness': {
    id: 'spiral_power',
    name: 'Spiral Power',
    description: '+10% Damage, +5% Cast Speed',
    icon: '🌀',
    color: '#6a5acd',
    effects: [
      { type: 'damage', value: 10 },
      { type: 'castSpeed', value: 5 }
    ]
  },
  'Voruun, Born of Unlight': {
    id: 'unlight_blessing',
    name: 'Unlight Blessing',
    description: '+15% Damage',
    icon: '⚫',
    color: '#1a1a1a',
    effects: [{ type: 'damage', value: 15 }]
  },
  'Cenotaph Omega': {
    id: 'omega_power',
    name: 'Omega Power',
    description: '+10% Maximum Health, +8% Armor',
    icon: '🗿',
    color: '#696969',
    effects: [
      { type: 'maxHealth', value: 10 },
      { type: 'armor', value: 8 }
    ]
  }
};

