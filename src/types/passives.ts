import type { BaseStats } from './character';
import type { CharacterClassId } from './classes';

// Types of passive nodes
export type PassiveNodeType = 
  | 'start'       // Starting node (always allocated)
  | 'minor'       // Small stat bonuses (1 point)
  | 'notable'     // Medium bonuses with mechanical effects (2 points)
  | 'keystone'    // Major build-defining effects (3 points)
  | 'mastery';    // Class-defining powerful nodes (2 points)

// Special effects from passive nodes
export type PassiveEffectType =
  | 'damageMultiplier'       // % more/less damage dealt
  | 'healingMultiplier'      // % more/less healing done
  | 'cooldownReduction'      // % reduced cooldowns
  | 'resourceGeneration'     // % increased resource regen
  | 'damageReduction'        // % less damage taken
  | 'blockChance'            // % increased block chance
  | 'spellBlockChance'       // % increased spell block chance
  | 'spellSuppression'       // % spell suppression chance
  | 'dodgeChance'            // % dodge chance
  | 'dotDamage'              // % increased DoT damage
  | 'aoeRadius'              // % increased AoE radius
  | 'critChance'             // % increased crit chance
  | 'critMultiplier'         // % increased crit damage
  | 'manaCostReduction'      // % reduced mana costs
  | 'lifeCostReduction'      // % reduced life costs
  | 'lifesteal'              // % of damage leeched as life
  | 'lifeRecoup'             // % of damage recouped as life over time
  | 'overhealing'            // % of overhealing converted to shield
  | 'shieldStrength'         // % increased shield strength
  | 'hotEffectiveness'       // % increased HoT healing
  | 'esRechargeRate'         // % increased ES recharge rate
  | 'esRechargeDelay'        // % reduced ES recharge delay
  | 'armorEffectiveness'     // % increased armor effectiveness
  | 'evasionRating'          // % increased evasion rating
  | 'maxResistance'          // +% to maximum elemental resistance
  | 'chaosResistance'        // +% chaos resistance
  | 'stunImmunity'           // Immune to stuns
  | 'bleedImmunity'          // Immune to bleeding
  | 'poisonImmunity'         // Immune to poison
  | 'lifeCostConversion'     // Spells cost life instead of mana
  | 'damageRedirection'      // Redirect X% of ally damage to self
  | 'chargeGeneration'       // Generate extra charges
  | 'castSpeed'              // % increased cast speed
  | 'attackSpeed'            // % increased attack speed
  | 'thorns'                 // Reflect % of damage taken
  | 'fortify'                // % reduced damage from hits
  | 'wardGeneration'         // Generate temporary shield
  | 'manaOnHit'              // Gain mana when hit
  | 'lifeOnBlock'            // Gain life when blocking
  | 'bonusPhysical'          // % increased physical damage
  | 'bonusElemental'         // % increased elemental damage
  | 'bonusFire'              // % increased fire damage
  | 'bonusCold'              // % increased cold damage
  | 'bonusLightning'         // % increased lightning damage
  | 'bonusChaos'             // % increased chaos damage
  | 'poisonChance'           // % chance to poison on hit
  | 'bleedChance'            // % chance to cause bleeding
  | 'igniteChance'           // % chance to ignite
  | 'shockChance'            // % chance to shock
  | 'freezeChance'           // % chance to freeze
  | 'curseEffect'            // % increased curse effectiveness
  | 'auraEffect'             // % increased aura effectiveness
  | 'flaskEffect'            // % increased flask effectiveness
  | 'projectileSpeed'        // % increased projectile speed
  | 'aoeSize'                // % increased area of effect
  | 'skillDuration'          // % increased skill duration
  | 'stunThreshold'          // % increased stun threshold
  | 'moveSpeed'              // % increased movement speed
  | 'damageOnLowLife'        // % more damage when on low life
  | 'defenseOnLowLife'       // % more defense when on low life
  | 'damageOnFullLife'       // % more damage when on full life
  | 'healingReceived'        // % increased healing received
  | 'shieldRecharge'         // Shields recharge faster
  | 'consecration'           // Standing still grants bonuses
  | 'momentum'               // Moving grants bonuses
  | 'counterattack';         // Chance to counter on block

export interface PassiveEffect {
  type: PassiveEffectType;
  value: number;
  condition?: string;
}

export interface PassiveNode {
  id: string;
  name: string;
  description: string;
  icon: string;
  nodeType: PassiveNodeType;
  position: { x: number; y: number };
  ring?: number;
  connections: string[];
  statBonuses: Partial<BaseStats>;
  specialEffects?: PassiveEffect[];
  pointCost: number;
  prerequisiteNodes?: string[];
  levelRequirement?: number;
  glowColor?: string;
  size?: 'small' | 'medium' | 'large';
}

export interface ClassPassiveTree {
  classId: CharacterClassId;
  nodes: PassiveNode[];
  startingNodeId: string;
  maxPoints: number;
  treeWidth: number;
  treeHeight: number;
  backgroundColor?: string;
  connectionColor?: string;
}

// ==================== HELPER FUNCTIONS ====================

function minor(
  id: string, name: string, desc: string, icon: string,
  pos: { x: number; y: number }, conn: string[],
  stats: Partial<BaseStats>, effects?: PassiveEffect[]
): PassiveNode {
  return {
    id, name, description: desc, icon, nodeType: 'minor',
    position: pos, connections: conn, statBonuses: stats,
    specialEffects: effects, pointCost: 1, size: 'small'
  };
}

function notable(
  id: string, name: string, desc: string, icon: string,
  pos: { x: number; y: number }, conn: string[],
  stats: Partial<BaseStats>, effects: PassiveEffect[], glow?: string
): PassiveNode {
  return {
    id, name, description: desc, icon, nodeType: 'notable',
    position: pos, connections: conn, statBonuses: stats,
    specialEffects: effects, pointCost: 2, size: 'medium', glowColor: glow
  };
}

function keystone(
  id: string, name: string, desc: string, icon: string,
  pos: { x: number; y: number }, conn: string[],
  stats: Partial<BaseStats>, effects: PassiveEffect[], glow?: string
): PassiveNode {
  return {
    id, name, description: desc, icon, nodeType: 'keystone',
    position: pos, connections: conn, statBonuses: stats,
    specialEffects: effects, pointCost: 3, size: 'large', glowColor: glow
  };
}

function mastery(
  id: string, name: string, desc: string, icon: string,
  pos: { x: number; y: number }, conn: string[],
  stats: Partial<BaseStats>, effects: PassiveEffect[], glow?: string
): PassiveNode {
  return {
    id, name, description: desc, icon, nodeType: 'mastery',
    position: pos, connections: conn, statBonuses: stats,
    specialEffects: effects, pointCost: 2, size: 'medium', glowColor: glow
  };
}

function start(
  id: string, name: string, desc: string, icon: string,
  pos: { x: number; y: number }, conn: string[],
  stats: Partial<BaseStats>
): PassiveNode {
  return {
    id, name, description: desc, icon, nodeType: 'start',
    position: pos, connections: conn, statBonuses: stats,
    pointCost: 0, size: 'medium'
  };
}

// ==================== BASTION KNIGHT ====================
// Theme: The Immovable Fortress - Armor, Block, Life, Unshakeable Defense
// Colors: Steel Gray (#8B8B8B) and Gold (#FFD700)

const BASTION_KNIGHT_TREE: ClassPassiveTree = {
  classId: 'bastion_knight',
  startingNodeId: 'bk_start',
  maxPoints: 65,
  treeWidth: 1400,
  treeHeight: 1200,
  backgroundColor: '#0d0d0d',
  connectionColor: '#FFD700',
  nodes: [
    // === STARTING NODE ===
    start('bk_start', 'Bastion\'s Foundation', 'The first lesson: Stand your ground.', '🏰', 
      { x: 700, y: 1100 }, ['bk_armor_1', 'bk_life_1', 'bk_block_1'], { armor: 50, life: 50, blockChance: 2 }),
    
    // === LEFT BRANCH: THE IRON PATH (Armor & Physical Mitigation) ===
    minor('bk_armor_1', 'Iron Skin', '+100 Armor', '🪨', { x: 500, y: 1020 }, ['bk_start', 'bk_armor_2'], { armor: 100 }),
    minor('bk_armor_2', 'Tempered Steel', '+120 Armor, +20 Life', '⚙️', { x: 400, y: 950 }, ['bk_armor_1', 'bk_armor_3', 'bk_armor_4'], { armor: 120, life: 20, maxLife: 20 }),
    minor('bk_armor_3', 'Hardened Plates', '+150 Armor', '🔧', { x: 300, y: 880 }, ['bk_armor_2', 'bk_armor_notable1'], { armor: 150 }),
    minor('bk_armor_4', 'Reinforced Core', '+80 Armor, +30 Life', '🛠️', { x: 500, y: 880 }, ['bk_armor_2', 'bk_armor_5'], { armor: 80, life: 30, maxLife: 30 }),
    minor('bk_armor_5', 'Steel Discipline', '+100 Armor, +1% Life Regen', '⚔️', { x: 500, y: 800 }, ['bk_armor_4', 'bk_armor_notable2'], { armor: 100, lifeRegeneration: 1 }),
    minor('bk_armor_1b', 'Layered Protection', '+90 Armor', '🧱', { x: 350, y: 950 }, ['bk_armor_2', 'bk_armor_3'], { armor: 90 }),
    
    notable('bk_armor_notable1', 'Unbreakable Bulwark', '+250 Armor. 8% increased Armor effectiveness.', '🏔️', 
      { x: 200, y: 800 }, ['bk_armor_3', 'bk_armor_6', 'bk_armor_6b'], { armor: 250 }, [{ type: 'armorEffectiveness', value: 8 }], '#FFD700'),
    notable('bk_armor_notable2', 'Stalwart Defender', '+200 Armor. Take 4% reduced physical damage.', '🛡️', 
      { x: 500, y: 720 }, ['bk_armor_5', 'bk_armor_7'], { armor: 200 }, [{ type: 'damageReduction', value: 4 }], '#FFD700'),
    
    minor('bk_armor_6', 'Mountain\'s Endurance', '+180 Armor', '🗻', { x: 120, y: 720 }, ['bk_armor_notable1', 'bk_armor_8'], { armor: 180 }),
    minor('bk_armor_6b', 'Stone Skin', '+100 Armor, +2% Phys Reduction', '🗿', { x: 200, y: 700 }, ['bk_armor_notable1', 'bk_armor_8'], { armor: 100 }, [{ type: 'damageReduction', value: 2 }]),
    minor('bk_armor_7', 'Fortress Mind', '+100 Armor, +50 Mana', '🧠', { x: 400, y: 640 }, ['bk_armor_notable2', 'bk_armor_9'], { armor: 100, mana: 50, maxMana: 50 }),
    minor('bk_armor_7b', 'Unyielding', '+120 Armor, +1% Regen', '💪', { x: 500, y: 640 }, ['bk_armor_notable2', 'bk_armor_9'], { armor: 120, lifeRegeneration: 1 }),
    minor('bk_armor_8', 'Living Fortress', '+200 Armor, +40 Life', '🏯', { x: 120, y: 640 }, ['bk_armor_6', 'bk_armor_6b', 'bk_keystone_iron'], { armor: 200, life: 40, maxLife: 40 }),
    minor('bk_armor_9', 'Crushing Weight', '+150 Armor. 3% increased damage.', '⚡', { x: 400, y: 560 }, ['bk_armor_7', 'bk_armor_7b', 'bk_keystone_iron'], { armor: 150 }, [{ type: 'damageMultiplier', value: 3 }]),
    minor('bk_armor_10', 'Impervious', '+100 Armor, +3% Block', '🛡️', { x: 200, y: 560 }, ['bk_armor_8', 'bk_keystone_iron'], { armor: 100 }, [{ type: 'blockChance', value: 3 }]),
    
    keystone('bk_keystone_iron', 'The Iron Titan', 'Your Armor applies to Chaos damage. 20% more Armor. Cannot Evade.', '🦏', 
      { x: 250, y: 450 }, ['bk_armor_8', 'bk_armor_9', 'bk_armor_10', 'bk_mastery_left'], { armor: 300 }, [{ type: 'armorEffectiveness', value: 20 }], '#FFD700'),
    
    // === CENTER BRANCH: THE LIVING WALL (Life & Regeneration) ===
    minor('bk_life_1', 'Vitality', '+80 Life', '❤️', { x: 700, y: 1000 }, ['bk_start', 'bk_life_2', 'bk_life_3'], { life: 80, maxLife: 80 }),
    minor('bk_life_2', 'Endurance', '+100 Life, +0.5% Life Regen', '💪', { x: 620, y: 920 }, ['bk_life_1', 'bk_life_4'], { life: 100, maxLife: 100, lifeRegeneration: 0.5 }),
    minor('bk_life_3', 'Vigor', '+100 Life', '🫀', { x: 780, y: 920 }, ['bk_life_1', 'bk_life_5'], { life: 100, maxLife: 100 }),
    minor('bk_life_4', 'Resilience', '+120 Life, +1% Life Regen', '🔄', { x: 580, y: 840 }, ['bk_life_2', 'bk_life_notable1'], { life: 120, maxLife: 120, lifeRegeneration: 1 }),
    minor('bk_life_5', 'Constitution', '+150 Life', '🗿', { x: 820, y: 840 }, ['bk_life_3', 'bk_life_notable2'], { life: 150, maxLife: 150 }),
    minor('bk_life_2b', 'Robust', '+80 Life, +20 Str', '💎', { x: 650, y: 840 }, ['bk_life_4', 'bk_life_notable1'], { life: 80, maxLife: 80, strength: 20 }),
    minor('bk_life_3b', 'Tough', '+80 Life, +20 Str', '🏋️', { x: 750, y: 840 }, ['bk_life_5', 'bk_life_notable2'], { life: 80, maxLife: 80, strength: 20 }),
    
    notable('bk_life_notable1', 'Heart of the Mountain', '+200 Life. Regenerate 2% of Life per second.', '💎', 
      { x: 580, y: 760 }, ['bk_life_4', 'bk_life_2b', 'bk_life_6', 'bk_life_7'], { life: 200, maxLife: 200, lifeRegeneration: 2 }, [], '#FFD700'),
    notable('bk_life_notable2', 'Titan\'s Blood', '+250 Life. 5% increased Life Recovery.', '🩸', 
      { x: 820, y: 760 }, ['bk_life_5', 'bk_life_3b', 'bk_life_8'], { life: 250, maxLife: 250 }, [{ type: 'healingReceived', value: 5 }], '#FFD700'),
    
    minor('bk_life_6', 'Undying Will', '+100 Life, +1.5% Life Regen', '🌟', { x: 500, y: 680 }, ['bk_life_notable1', 'bk_life_keystone'], { life: 100, maxLife: 100, lifeRegeneration: 1.5 }),
    minor('bk_life_7', 'Immortal Coil', '+150 Life', '♾️', { x: 660, y: 680 }, ['bk_life_notable1', 'bk_life_keystone'], { life: 150, maxLife: 150 }),
    minor('bk_life_8', 'Eternal Vigor', '+180 Life, +30 Strength', '⭐', { x: 820, y: 680 }, ['bk_life_notable2', 'bk_block_bridge'], { life: 180, maxLife: 180, strength: 30 }),
    minor('bk_life_9', 'Stalwart', '+100 Life, +50 Armor', '🏰', { x: 580, y: 600 }, ['bk_life_keystone', 'bk_presence_1'], { life: 100, maxLife: 100, armor: 50 }),
    
    notable('bk_life_keystone', 'Undying Sentinel', '+300 Life. When reduced to Low Life, gain 5% Life Regen for 4 seconds.', '🏛️', 
      { x: 580, y: 520 }, ['bk_life_6', 'bk_life_7', 'bk_life_9', 'bk_mastery_center'], { life: 300, maxLife: 300 }, [{ type: 'defenseOnLowLife', value: 50 }], '#FFD700'),
    
    // === RIGHT BRANCH: THE AEGIS PATH (Block & Spell Block) ===
    minor('bk_block_1', 'Shield Mastery', '+5% Block Chance', '🔰', { x: 900, y: 1020 }, ['bk_start', 'bk_block_2'], {}, [{ type: 'blockChance', value: 5 }]),
    minor('bk_block_2', 'Parrying Stance', '+4% Block, +3% Spell Block', '⚔️', { x: 1000, y: 950 }, ['bk_block_1', 'bk_block_3', 'bk_block_4'], {}, [{ type: 'blockChance', value: 4 }, { type: 'spellBlockChance', value: 3 }]),
    minor('bk_block_3', 'Shield Wall', '+6% Block Chance', '🛡️', { x: 1100, y: 880 }, ['bk_block_2', 'bk_block_notable1'], {}, [{ type: 'blockChance', value: 6 }]),
    minor('bk_block_4', 'Arcane Ward', '+5% Spell Block', '🔮', { x: 900, y: 880 }, ['bk_block_2', 'bk_block_5'], {}, [{ type: 'spellBlockChance', value: 5 }]),
    minor('bk_block_5', 'Mystic Barrier', '+4% Block, +4% Spell Block', '✨', { x: 900, y: 800 }, ['bk_block_4', 'bk_block_notable2'], {}, [{ type: 'blockChance', value: 4 }, { type: 'spellBlockChance', value: 4 }]),
    minor('bk_block_2b', 'Reflexes', '+3% Block, +2% Dodge', '💨', { x: 1050, y: 880 }, ['bk_block_2', 'bk_block_notable1'], {}, [{ type: 'blockChance', value: 3 }, { type: 'dodgeChance', value: 2 }]),
    minor('bk_block_4b', 'Warding', '+4% Spell Block, +30 Mana', '🌀', { x: 950, y: 800 }, ['bk_block_4', 'bk_block_notable2'], { mana: 30, maxMana: 30 }, [{ type: 'spellBlockChance', value: 4 }]),
    
    notable('bk_block_notable1', 'Aegis of the Dawn', '+10% Block Chance. Recover 20 Life on Block.', '🌅', 
      { x: 1180, y: 800 }, ['bk_block_3', 'bk_block_2b', 'bk_block_6'], {}, [{ type: 'blockChance', value: 10 }, { type: 'lifeOnBlock', value: 20 }], '#FFD700'),
    notable('bk_block_notable2', 'Spellbreaker', '+8% Spell Block. 10% of blocked spell damage reflected.', '💫', 
      { x: 900, y: 720 }, ['bk_block_5', 'bk_block_4b', 'bk_block_7'], {}, [{ type: 'spellBlockChance', value: 8 }, { type: 'thorns', value: 10 }], '#FFD700'),
    
    minor('bk_block_6', 'Perfect Defense', '+6% Block, +4% Spell Block', '🎯', { x: 1180, y: 720 }, ['bk_block_notable1', 'bk_keystone_aegis'], {}, [{ type: 'blockChance', value: 6 }, { type: 'spellBlockChance', value: 4 }]),
    minor('bk_block_7', 'Magical Deflection', '+6% Spell Block, +50 Mana', '🪄', { x: 1000, y: 640 }, ['bk_block_notable2', 'bk_keystone_aegis'], { mana: 50, maxMana: 50 }, [{ type: 'spellBlockChance', value: 6 }]),
    minor('bk_block_bridge', 'Harmonized Defense', '+4% Block, +80 Life', '🔗', { x: 900, y: 600 }, ['bk_life_8', 'bk_keystone_aegis'], { life: 80, maxLife: 80 }, [{ type: 'blockChance', value: 4 }]),
    minor('bk_block_8', 'Bastion Stance', '+5% Block, +100 Armor', '🏰', { x: 1100, y: 640 }, ['bk_block_6', 'bk_keystone_aegis'], { armor: 100 }, [{ type: 'blockChance', value: 5 }]),
    minor('bk_block_9', 'Reflective Shield', '+3% Block, 5% Thorns', '↩️', { x: 1000, y: 560 }, ['bk_keystone_aegis', 'bk_synergy_1'], {}, [{ type: 'blockChance', value: 3 }, { type: 'thorns', value: 5 }]),
    
    keystone('bk_keystone_aegis', 'Divine Aegis', 'Block Chance applies to all damage types equally. +15% Block. -20% Damage dealt.', '👼', 
      { x: 1080, y: 480 }, ['bk_block_6', 'bk_block_7', 'bk_block_bridge', 'bk_block_8', 'bk_mastery_right'], {}, [{ type: 'blockChance', value: 15 }, { type: 'damageMultiplier', value: -20 }], '#FFD700'),
    
    // === UPPER BRANCHES: Advanced Paths ===
    // Left Upper: Counter-Attack Path
    minor('bk_counter_1', 'Retribution', '+50 Armor. 2% Damage Reflection.', '⚡', { x: 150, y: 520 }, ['bk_keystone_iron', 'bk_counter_2'], { armor: 50 }, [{ type: 'thorns', value: 2 }]),
    minor('bk_counter_2', 'Vengeful Spirit', '+3% Damage Reflection, +30 Strength', '💢', { x: 100, y: 440 }, ['bk_counter_1', 'bk_counter_3'], { strength: 30 }, [{ type: 'thorns', value: 3 }]),
    minor('bk_counter_3', 'Painful Retaliation', '+4% Damage Reflection', '😤', { x: 100, y: 360 }, ['bk_counter_2', 'bk_counter_notable'], {}, [{ type: 'thorns', value: 4 }]),
    notable('bk_counter_notable', 'Wrath of the Bastion', '5% of damage taken reflected. 8% more damage after blocking.', '🔥', 
      { x: 100, y: 280 }, ['bk_counter_3', 'bk_mastery_left'], {}, [{ type: 'thorns', value: 5 }, { type: 'counterattack', value: 8 }], '#FFD700'),
    
    // Physical Damage Sub-branch
    minor('bk_phys_1', 'Heavy Blows', '+8% Physical Damage', '🔨', { x: 300, y: 380 }, ['bk_keystone_iron', 'bk_phys_2'], {}, [{ type: 'bonusPhysical', value: 8 }]),
    minor('bk_phys_2', 'Crushing Force', '+10% Physical, +50 Armor', '💥', { x: 250, y: 320 }, ['bk_phys_1', 'bk_phys_notable'], { armor: 50 }, [{ type: 'bonusPhysical', value: 10 }]),
    notable('bk_phys_notable', 'Earthshatter', '+20% Physical Damage. Crits stun enemies.', '🌍', 
      { x: 200, y: 250 }, ['bk_phys_2', 'bk_mastery_left'], {}, [{ type: 'bonusPhysical', value: 20 }], '#FFD700'),
    
    // Center Upper: Presence & Defense Path
    minor('bk_presence_1', 'Commanding Presence', '+5% Damage Reduction. +50 Life.', '📢', { x: 580, y: 440 }, ['bk_life_keystone', 'bk_presence_2'], { life: 50, maxLife: 50 }, [{ type: 'damageReduction', value: 5 }]),
    minor('bk_presence_2', 'Imposing Stature', '+100 Armor. +40 Strength.', '🗣️', { x: 580, y: 360 }, ['bk_presence_1', 'bk_presence_3'], { strength: 40, armor: 100 }, []),
    minor('bk_presence_3', 'War Cry', '+5% Damage Reduction, +80 Life', '📣', { x: 580, y: 280 }, ['bk_presence_2', 'bk_presence_notable'], { life: 80, maxLife: 80 }, [{ type: 'damageReduction', value: 5 }]),
    notable('bk_presence_notable', 'Beacon of Defiance', '+10% Damage Reduction. Recover 2% Life per second.', '🚨', 
      { x: 580, y: 200 }, ['bk_presence_3', 'bk_mastery_center'], { lifeRegeneration: 2 }, [{ type: 'damageReduction', value: 10 }], '#FFD700'),
    
    // Aura Path (Center-Right)
    minor('bk_aura_1', 'Protective Presence', '5% Aura Effect', '🌟', { x: 720, y: 440 }, ['bk_life_keystone', 'bk_aura_2'], {}, [{ type: 'auraEffect', value: 5 }]),
    minor('bk_aura_2', 'Guardian Aura', '8% Aura Effect, +50 Life', '💫', { x: 760, y: 360 }, ['bk_aura_1', 'bk_aura_notable'], { life: 50, maxLife: 50 }, [{ type: 'auraEffect', value: 8 }]),
    notable('bk_aura_notable', 'Inspiring Defense', '15% Aura Effect. Allies near you gain +50 Armor.', '✨', 
      { x: 800, y: 280 }, ['bk_aura_2', 'bk_mastery_center'], {}, [{ type: 'auraEffect', value: 15 }], '#FFD700'),
    
    // Right Upper: Shield Synergy Path
    minor('bk_synergy_1', 'Shieldbearer\'s Pride', '+5% Block, +100 Armor', '🏅', { x: 1180, y: 400 }, ['bk_keystone_aegis', 'bk_block_9', 'bk_synergy_2'], { armor: 100 }, [{ type: 'blockChance', value: 5 }]),
    minor('bk_synergy_2', 'Guardian\'s Oath', '+80 Life, +3% Block, +3% Spell Block', '📜', { x: 1180, y: 320 }, ['bk_synergy_1', 'bk_synergy_3'], { life: 80, maxLife: 80 }, [{ type: 'blockChance', value: 3 }, { type: 'spellBlockChance', value: 3 }]),
    minor('bk_synergy_3', 'Shield Expertise', '+4% Block, +60 Life', '🛡️', { x: 1180, y: 240 }, ['bk_synergy_2', 'bk_synergy_notable'], { life: 60, maxLife: 60 }, [{ type: 'blockChance', value: 4 }]),
    notable('bk_synergy_notable', 'Phalanx Master', 'Blocking grants 50 Armor for 3 seconds. +8% Block Chance.', '⚔️', 
      { x: 1150, y: 160 }, ['bk_synergy_3', 'bk_mastery_right'], { armor: 100 }, [{ type: 'blockChance', value: 8 }], '#FFD700'),
    
    // Mana/Utility Branch
    minor('bk_mana_1', 'Battle Meditation', '+60 Mana', '🧘', { x: 1000, y: 400 }, ['bk_keystone_aegis', 'bk_mana_2'], { mana: 60, maxMana: 60 }),
    minor('bk_mana_2', 'Focused Mind', '+80 Mana, +1% Mana Regen', '🎯', { x: 950, y: 320 }, ['bk_mana_1', 'bk_mana_notable'], { mana: 80, maxMana: 80, manaRegeneration: 1 }),
    notable('bk_mana_notable', 'Tactical Reserve', '+120 Mana. Skills cost 10% less.', '📖', 
      { x: 900, y: 240 }, ['bk_mana_2', 'bk_mastery_right'], { mana: 120, maxMana: 120 }, [{ type: 'manaCostReduction', value: 10 }], '#FFD700'),
    
    // === MASTERY NODES ===
    mastery('bk_mastery_left', 'Fortress Incarnate', 'Gain 1% of Armor as bonus Life. 5% more Armor.', '⭐', 
      { x: 150, y: 180 }, ['bk_counter_notable', 'bk_phys_notable', 'bk_apex'], {}, [{ type: 'armorEffectiveness', value: 5 }], '#FFD700'),
    mastery('bk_mastery_center', 'Undying Guardian', 'When you would die, instead heal to 25% Life. Once per dungeon.', '💫', 
      { x: 650, y: 120 }, ['bk_presence_notable', 'bk_aura_notable', 'bk_apex'], { life: 100, maxLife: 100 }, [], '#FFD700'),
    mastery('bk_mastery_right', 'Aegis Perfection', 'Maximum Block Chance is 80% instead of 75%. +5% Block.', '🌟', 
      { x: 1080, y: 100 }, ['bk_synergy_notable', 'bk_mana_notable', 'bk_apex'], {}, [{ type: 'blockChance', value: 5 }], '#FFD700'),
    
    // === APEX MASTERY ===
    keystone('bk_apex', 'The Eternal Bastion', 'You are immune to Critical Strikes. 10% of all damage taken is prevented. -30% Damage dealt.', '👑', 
      { x: 700, y: 50 }, ['bk_mastery_left', 'bk_mastery_center', 'bk_mastery_right'], { armor: 200, life: 200, maxLife: 200 }, [{ type: 'damageReduction', value: 10 }, { type: 'damageMultiplier', value: -30 }], '#FFD700'),
  ]
};

// ==================== WARDBREAKER ====================
// Theme: Anti-Magic Warrior - Armor, Spell Suppression, Resistance
// Colors: Cornflower Blue (#6495ED)

const WARDBREAKER_TREE: ClassPassiveTree = {
  classId: 'wardbreaker',
  startingNodeId: 'wb_start',
  maxPoints: 65,
  treeWidth: 1400,
  treeHeight: 1200,
  backgroundColor: '#0a0a14',
  connectionColor: '#6495ED',
  nodes: [
    // === STARTING NODE ===
    start('wb_start', 'Anti-Magic Training', 'Learn to shatter magical defenses.', '🔮', 
      { x: 700, y: 1100 }, ['wb_armor_1', 'wb_suppress_1', 'wb_resist_1'], { armor: 40, spellSuppressionChance: 5 }),
    
    // === LEFT BRANCH: RUNIC ARMOR (Armor + Magic Resist) ===
    minor('wb_armor_1', 'Warded Plate', '+90 Armor', '🪨', { x: 500, y: 1020 }, ['wb_start', 'wb_armor_2'], { armor: 90 }),
    minor('wb_armor_2', 'Runic Steel', '+100 Armor, +5% Spell Suppression', '⚙️', { x: 400, y: 950 }, ['wb_armor_1', 'wb_armor_3', 'wb_armor_4'], { armor: 100 }, [{ type: 'spellSuppression', value: 5 }]),
    minor('wb_armor_3', 'Nullifying Plates', '+120 Armor, +3% Chaos Resist', '🔧', { x: 300, y: 880 }, ['wb_armor_2', 'wb_armor_notable1'], { armor: 120, chaosResistance: 3 }),
    minor('wb_armor_4', 'Spellward Mesh', '+80 Armor, +6% Spell Suppression', '🔗', { x: 480, y: 880 }, ['wb_armor_2', 'wb_armor_5'], { armor: 80 }, [{ type: 'spellSuppression', value: 6 }]),
    minor('wb_armor_5', 'Arcane Dampener', '+100 Armor, +4% Spell Suppression', '🌀', { x: 480, y: 800 }, ['wb_armor_4', 'wb_armor_notable2'], { armor: 100 }, [{ type: 'spellSuppression', value: 4 }]),
    minor('wb_armor_3b', 'Tempered Wards', '+80 Armor, +4% Spell Supp', '🛡️', { x: 350, y: 880 }, ['wb_armor_2', 'wb_armor_notable1'], { armor: 80 }, [{ type: 'spellSuppression', value: 4 }]),
    
    notable('wb_armor_notable1', 'Spellbreaker Plate', '+200 Armor. Suppressed spells deal 60% less damage.', '🏔️', 
      { x: 200, y: 800 }, ['wb_armor_3', 'wb_armor_3b', 'wb_armor_6', 'wb_armor_6b'], { armor: 200 }, [{ type: 'damageReduction', value: 10 }], '#6495ED'),
    notable('wb_armor_notable2', 'Void-Touched Armor', '+150 Armor, +10% Spell Supp. Gain Mana when hit.', '🌑', 
      { x: 480, y: 720 }, ['wb_armor_5', 'wb_armor_7'], { armor: 150 }, [{ type: 'spellSuppression', value: 10 }, { type: 'manaOnHit', value: 5 }], '#6495ED'),
    
    minor('wb_armor_6', 'Rune-Etched Steel', '+180 Armor, +5% Chaos Resist', '📜', { x: 120, y: 720 }, ['wb_armor_notable1', 'wb_armor_8'], { armor: 180, chaosResistance: 5 }),
    minor('wb_armor_6b', 'Sigil Plate', '+100 Armor, +8% Spell Supp', '✨', { x: 200, y: 720 }, ['wb_armor_notable1', 'wb_armor_8'], { armor: 100 }, [{ type: 'spellSuppression', value: 8 }]),
    minor('wb_armor_7', 'Magical Absorption', '+100 Armor, +8% Spell Suppression', '💠', { x: 400, y: 640 }, ['wb_armor_notable2', 'wb_armor_9'], { armor: 100 }, [{ type: 'spellSuppression', value: 8 }]),
    minor('wb_armor_8', 'Arcane Fortress', '+200 Armor, +5% Spell Suppression', '🏯', { x: 120, y: 640 }, ['wb_armor_6', 'wb_armor_6b', 'wb_keystone_nullifier'], { armor: 200 }, [{ type: 'spellSuppression', value: 5 }]),
    minor('wb_armor_9', 'Spell Eater', '+60 Mana, +6% Spell Suppression', '👁️', { x: 400, y: 560 }, ['wb_armor_7', 'wb_keystone_nullifier'], { mana: 60, maxMana: 60 }, [{ type: 'spellSuppression', value: 6 }]),
    minor('wb_armor_10', 'Ward Breaker', '+150 Armor, 5% Dmg', '⚔️', { x: 280, y: 560 }, ['wb_armor_8', 'wb_keystone_nullifier'], { armor: 150 }, [{ type: 'damageMultiplier', value: 5 }]),
    
    keystone('wb_keystone_nullifier', 'The Nullifier', '100% Spell Suppression. Suppressed spells cannot inflict ailments. -15% Attack Speed.', '⚫', 
      { x: 280, y: 450 }, ['wb_armor_8', 'wb_armor_9', 'wb_armor_10', 'wb_mastery_left'], {}, [{ type: 'spellSuppression', value: 25 }, { type: 'attackSpeed', value: -15 }], '#6495ED'),
    
    // Chaos Sub-branch
    minor('wb_chaos_1', 'Chaos Warden', '+10% Chaos Resist', '☠️', { x: 150, y: 520 }, ['wb_keystone_nullifier', 'wb_chaos_2'], { chaosResistance: 10 }),
    minor('wb_chaos_2', 'Void Walker', '+15% Chaos Resist, +5% Spell Supp', '🌌', { x: 100, y: 440 }, ['wb_chaos_1', 'wb_chaos_3'], { chaosResistance: 15 }, [{ type: 'spellSuppression', value: 5 }]),
    minor('wb_chaos_3', 'Abyssal Guard', '+20% Chaos Resist', '⬛', { x: 100, y: 360 }, ['wb_chaos_2', 'wb_chaos_notable'], { chaosResistance: 20 }),
    notable('wb_chaos_notable', 'Chaos Immunity', '+30% Chaos Resist. Chaos damage cannot bypass ES.', '🕳️', 
      { x: 100, y: 280 }, ['wb_chaos_3', 'wb_mastery_left'], { chaosResistance: 30 }, [], '#6495ED'),
    
    // === CENTER BRANCH: RESISTANCE (Elemental Defense) ===
    minor('wb_resist_1', 'Elemental Warding', '+4% All Elemental Resist', '🌈', { x: 700, y: 1000 }, ['wb_start', 'wb_resist_2', 'wb_resist_3'], { fireResistance: 4, coldResistance: 4, lightningResistance: 4 }),
    minor('wb_resist_2', 'Fire Ward', '+8% Fire Resist, +40 Life', '🔥', { x: 620, y: 920 }, ['wb_resist_1', 'wb_resist_4'], { fireResistance: 8, life: 40, maxLife: 40 }),
    minor('wb_resist_3', 'Frost Ward', '+8% Cold Resist, +40 Life', '❄️', { x: 780, y: 920 }, ['wb_resist_1', 'wb_resist_5'], { coldResistance: 8, life: 40, maxLife: 40 }),
    minor('wb_resist_4', 'Blazing Resilience', '+10% Fire Resist, +60 Armor', '🌋', { x: 580, y: 840 }, ['wb_resist_2', 'wb_resist_notable1'], { fireResistance: 10, armor: 60 }),
    minor('wb_resist_5', 'Frozen Bulwark', '+10% Cold Resist, +60 Armor', '🧊', { x: 820, y: 840 }, ['wb_resist_3', 'wb_resist_notable2'], { coldResistance: 10, armor: 60 }),
    minor('wb_resist_2b', 'Flame Guard', '+6% Fire, +4% Spell Supp', '🔶', { x: 650, y: 840 }, ['wb_resist_2', 'wb_resist_notable1'], { fireResistance: 6 }, [{ type: 'spellSuppression', value: 4 }]),
    minor('wb_resist_3b', 'Ice Guard', '+6% Cold, +4% Spell Supp', '🔷', { x: 750, y: 840 }, ['wb_resist_3', 'wb_resist_notable2'], { coldResistance: 6 }, [{ type: 'spellSuppression', value: 4 }]),
    
    notable('wb_resist_notable1', 'Fireproof', '+1% Maximum Fire Resistance. +15% Fire Resist.', '🔶', 
      { x: 580, y: 760 }, ['wb_resist_4', 'wb_resist_2b', 'wb_resist_6', 'wb_resist_7'], { fireResistance: 15 }, [{ type: 'maxResistance', value: 1 }], '#6495ED'),
    notable('wb_resist_notable2', 'Coldproof', '+1% Maximum Cold Resistance. +15% Cold Resist.', '🔷', 
      { x: 820, y: 760 }, ['wb_resist_5', 'wb_resist_3b', 'wb_resist_8'], { coldResistance: 15 }, [{ type: 'maxResistance', value: 1 }], '#6495ED'),
    
    minor('wb_resist_6', 'Lightning Ward', '+12% Lightning Resist', '⚡', { x: 500, y: 680 }, ['wb_resist_notable1', 'wb_resist_keystone'], { lightningResistance: 12 }),
    minor('wb_resist_7', 'Balanced Elements', '+6% All Elemental Resist', '⚖️', { x: 660, y: 680 }, ['wb_resist_notable1', 'wb_resist_keystone'], { fireResistance: 6, coldResistance: 6, lightningResistance: 6 }),
    minor('wb_resist_8', 'Stormproof', '+1% Max Lightning Resist, +10% Lightning Resist', '🌩️', { x: 820, y: 680 }, ['wb_resist_notable2', 'wb_suppress_bridge'], { lightningResistance: 10 }, [{ type: 'maxResistance', value: 1 }]),
    minor('wb_resist_9', 'Elemental Armor', '+80 Armor, +4% All Resist', '🛡️', { x: 580, y: 600 }, ['wb_resist_keystone', 'wb_magic_1'], { armor: 80, fireResistance: 4, coldResistance: 4, lightningResistance: 4 }),
    
    notable('wb_resist_keystone', 'Elemental Equilibrium', '+2% to All Maximum Resistances. +10% All Elemental Resist.', '🌀', 
      { x: 580, y: 520 }, ['wb_resist_6', 'wb_resist_7', 'wb_resist_9', 'wb_mastery_center'], { fireResistance: 10, coldResistance: 10, lightningResistance: 10 }, [{ type: 'maxResistance', value: 2 }], '#6495ED'),
    
    // Mage Hunter Sub-branch
    minor('wb_magic_1', 'Mage Hunter', '8% increased damage vs Casters', '🎯', { x: 580, y: 440 }, ['wb_resist_keystone', 'wb_magic_2'], {}, [{ type: 'damageMultiplier', value: 8 }]),
    minor('wb_magic_2', 'Spell Slayer', '12% increased damage. +5% Spell Supp', '⚔️', { x: 580, y: 360 }, ['wb_magic_1', 'wb_magic_3'], {}, [{ type: 'damageMultiplier', value: 12 }, { type: 'spellSuppression', value: 5 }]),
    minor('wb_magic_3', 'Arcane Fury', '+15% Damage, +80 Life', '💢', { x: 580, y: 280 }, ['wb_magic_2', 'wb_magic_notable'], { life: 80, maxLife: 80 }, [{ type: 'damageMultiplier', value: 15 }]),
    notable('wb_magic_notable', 'Arcane Executioner', '20% more damage against casters.', '💀', 
      { x: 580, y: 200 }, ['wb_magic_3', 'wb_mastery_center'], {}, [{ type: 'damageMultiplier', value: 20 }], '#6495ED'),
    
    // === RIGHT BRANCH: SUPPRESSION (Pure Spell Suppression) ===
    minor('wb_suppress_1', 'Mental Fortitude', '+8% Spell Suppression', '🧠', { x: 900, y: 1020 }, ['wb_start', 'wb_suppress_2'], {}, [{ type: 'spellSuppression', value: 8 }]),
    minor('wb_suppress_2', 'Willpower', '+10% Spell Suppression, +30 Mana', '💪', { x: 1000, y: 950 }, ['wb_suppress_1', 'wb_suppress_3', 'wb_suppress_4'], { mana: 30, maxMana: 30 }, [{ type: 'spellSuppression', value: 10 }]),
    minor('wb_suppress_3', 'Iron Mind', '+12% Spell Suppression', '🔩', { x: 1100, y: 880 }, ['wb_suppress_2', 'wb_suppress_notable1'], {}, [{ type: 'spellSuppression', value: 12 }]),
    minor('wb_suppress_4', 'Arcane Rejection', '+8% Spell Supp, +50 Life', '🚫', { x: 920, y: 880 }, ['wb_suppress_2', 'wb_suppress_5'], { life: 50, maxLife: 50 }, [{ type: 'spellSuppression', value: 8 }]),
    minor('wb_suppress_5', 'Spell Deflector', '+10% Spell Suppression', '↩️', { x: 920, y: 800 }, ['wb_suppress_4', 'wb_suppress_notable2'], {}, [{ type: 'spellSuppression', value: 10 }]),
    minor('wb_suppress_3b', 'Focused Will', '+10% Spell Supp, +40 Mana', '🎯', { x: 1050, y: 880 }, ['wb_suppress_2', 'wb_suppress_notable1'], { mana: 40, maxMana: 40 }, [{ type: 'spellSuppression', value: 10 }]),
    
    notable('wb_suppress_notable1', 'Mind Over Magic', '+15% Spell Suppression. Recover 1% Mana when you Suppress.', '✨', 
      { x: 1180, y: 800 }, ['wb_suppress_3', 'wb_suppress_3b', 'wb_suppress_6'], {}, [{ type: 'spellSuppression', value: 15 }, { type: 'resourceGeneration', value: 1 }], '#6495ED'),
    notable('wb_suppress_notable2', 'Void Barrier', '+12% Spell Suppression. 10% Chance to Avoid Spell Damage.', '🌑', 
      { x: 920, y: 720 }, ['wb_suppress_5', 'wb_suppress_7'], {}, [{ type: 'spellSuppression', value: 12 }, { type: 'dodgeChance', value: 10 }], '#6495ED'),
    
    minor('wb_suppress_6', 'Absolute Rejection', '+10% Spell Suppression', '✋', { x: 1180, y: 720 }, ['wb_suppress_notable1', 'wb_keystone_void'], {}, [{ type: 'spellSuppression', value: 10 }]),
    minor('wb_suppress_7', 'Mystic Negation', '+8% Spell Supp, +60 Mana', '🔮', { x: 1000, y: 640 }, ['wb_suppress_notable2', 'wb_keystone_void'], { mana: 60, maxMana: 60 }, [{ type: 'spellSuppression', value: 8 }]),
    minor('wb_suppress_bridge', 'Harmonized Warding', '+6% Spell Supp, +8% Lightning Resist', '🔗', { x: 900, y: 600 }, ['wb_resist_8', 'wb_keystone_void'], { lightningResistance: 8 }, [{ type: 'spellSuppression', value: 6 }]),
    minor('wb_suppress_8', 'Perfect Suppression', '+8% Spell Supp', '💎', { x: 1100, y: 640 }, ['wb_suppress_6', 'wb_keystone_void'], {}, [{ type: 'spellSuppression', value: 8 }]),
    
    keystone('wb_keystone_void', 'Void Sentinel', 'Cannot be affected by Curses. +20% Spell Suppression. Spells cost 20% more Mana.', '🕳️', 
      { x: 1080, y: 520 }, ['wb_suppress_6', 'wb_suppress_7', 'wb_suppress_bridge', 'wb_suppress_8', 'wb_mastery_right'], {}, [{ type: 'spellSuppression', value: 20 }, { type: 'manaCostReduction', value: -20 }], '#6495ED'),
    
    // Reflection Sub-branch
    minor('wb_reflect_1', 'Spell Mirror', '3% of Spell Damage reflected', '🪞', { x: 1180, y: 440 }, ['wb_keystone_void', 'wb_reflect_2'], {}, [{ type: 'thorns', value: 3 }]),
    minor('wb_reflect_2', 'Arcane Reflection', '5% of Spell Damage reflected, +40 Mana', '💎', { x: 1200, y: 360 }, ['wb_reflect_1', 'wb_reflect_3'], { mana: 40, maxMana: 40 }, [{ type: 'thorns', value: 5 }]),
    minor('wb_reflect_3', 'Mirror Shield', '4% Reflect, +60 Armor', '🛡️', { x: 1200, y: 280 }, ['wb_reflect_2', 'wb_reflect_notable'], { armor: 60 }, [{ type: 'thorns', value: 4 }]),
    notable('wb_reflect_notable', 'Perfect Reflection', '10% of Suppressed Spell Damage is reflected.', '✨', 
      { x: 1150, y: 200 }, ['wb_reflect_3', 'wb_mastery_right'], {}, [{ type: 'thorns', value: 10 }], '#6495ED'),
    
    // Life Sub-branch
    minor('wb_life_1', 'Tough Skin', '+80 Life, +40 Armor', '💪', { x: 1000, y: 440 }, ['wb_keystone_void', 'wb_life_2'], { life: 80, maxLife: 80, armor: 40 }),
    minor('wb_life_2', 'Resilient', '+100 Life, +1% Life Regen', '❤️', { x: 960, y: 360 }, ['wb_life_1', 'wb_life_notable'], { life: 100, maxLife: 100, lifeRegeneration: 1 }),
    notable('wb_life_notable', 'Survivor', '+150 Life. +2% Life Regen while Suppressing.', '🏆', 
      { x: 920, y: 280 }, ['wb_life_2', 'wb_mastery_right'], { life: 150, maxLife: 150, lifeRegeneration: 2 }, [], '#6495ED'),
    
    // === MASTERY NODES ===
    mastery('wb_mastery_left', 'Null Zone', 'Enemies near you deal 10% less Spell Damage.', '⭐', 
      { x: 150, y: 200 }, ['wb_chaos_notable', 'wb_keystone_nullifier', 'wb_apex'], {}, [{ type: 'auraEffect', value: 10 }], '#6495ED'),
    mastery('wb_mastery_center', 'Elemental Purity', '+3% to All Maximum Resistances.', '💫', 
      { x: 580, y: 120 }, ['wb_resist_keystone', 'wb_magic_notable', 'wb_apex'], {}, [{ type: 'maxResistance', value: 3 }], '#6495ED'),
    mastery('wb_mastery_right', 'Supreme Suppression', 'Spell Suppression prevents 60% of damage.', '🌟', 
      { x: 1050, y: 120 }, ['wb_keystone_void', 'wb_reflect_notable', 'wb_life_notable', 'wb_apex'], {}, [{ type: 'damageReduction', value: 10 }], '#6495ED'),
    
    keystone('wb_apex', 'The Wardbreaker', 'Cannot be damaged by spells dealing <5% of Max Life. +100 Armor per 10% Spell Supp.', '👑', 
      { x: 700, y: 50 }, ['wb_mastery_left', 'wb_mastery_center', 'wb_mastery_right'], { armor: 100 }, [{ type: 'spellSuppression', value: 10 }], '#6495ED'),
  ]
};

// ==================== IRON SKIRMISHER ====================
// Theme: Aggressive Tank - Armor, Damage, Counterattacks
// Colors: Dark Orange (#CC5500)

const IRON_SKIRMISHER_TREE: ClassPassiveTree = {
  classId: 'iron_skirmisher',
  startingNodeId: 'is_start',
  maxPoints: 50,
  treeWidth: 1200,
  treeHeight: 1000,
  backgroundColor: '#0d0805',
  connectionColor: '#CC5500',
  nodes: [
    start('is_start', 'Skirmisher\'s Stance', 'The best defense is a brutal offense.', '⚔️', 
      { x: 600, y: 900 }, ['is_armor_1', 'is_damage_1', 'is_counter_1'], { armor: 50, strength: 10 }),
    
    // === LEFT: BATTLE ARMOR ===
    minor('is_armor_1', 'Combat Plating', '+80 Armor, +10 Strength', '🪨', { x: 400, y: 820 }, ['is_start', 'is_armor_2'], { armor: 80, strength: 10 }),
    minor('is_armor_2', 'War-Forged', '+100 Armor, 3% increased Damage', '⚙️', { x: 320, y: 750 }, ['is_armor_1', 'is_armor_3', 'is_armor_4'], { armor: 100 }, [{ type: 'damageMultiplier', value: 3 }]),
    minor('is_armor_3', 'Brutal Defense', '+120 Armor, +15 Strength', '💪', { x: 240, y: 680 }, ['is_armor_2', 'is_armor_notable1'], { armor: 120, strength: 15 }),
    minor('is_armor_4', 'Aggressive Stance', '+60 Armor, 5% increased Damage', '🔥', { x: 400, y: 680 }, ['is_armor_2', 'is_armor_5'], { armor: 60 }, [{ type: 'damageMultiplier', value: 5 }]),
    minor('is_armor_5', 'Relentless', '+80 Armor, +50 Life', '⚡', { x: 400, y: 600 }, ['is_armor_4', 'is_armor_notable2'], { armor: 80, life: 50, maxLife: 50 }),
    
    notable('is_armor_notable1', 'Warmonger\'s Plate', '+200 Armor. Gain 1% Damage per 100 Armor.', '🛡️', 
      { x: 160, y: 600 }, ['is_armor_3', 'is_armor_6'], { armor: 200 }, [{ type: 'damageMultiplier', value: 3 }], '#CC5500'),
    notable('is_armor_notable2', 'Battle Fury', '+100 Armor. 8% more Damage while at full Life.', '💢', 
      { x: 400, y: 520 }, ['is_armor_5', 'is_armor_7'], { armor: 100 }, [{ type: 'damageOnFullLife', value: 8 }], '#CC5500'),
    
    minor('is_armor_6', 'Unrelenting Force', '+150 Armor, +20 Strength', '🗿', { x: 100, y: 520 }, ['is_armor_notable1', 'is_armor_8'], { armor: 150, strength: 20 }),
    minor('is_armor_7', 'Berserker\'s Guard', '+80 Armor, 6% increased Damage', '🐻', { x: 320, y: 440 }, ['is_armor_notable2', 'is_armor_9'], { armor: 80 }, [{ type: 'damageMultiplier', value: 6 }]),
    minor('is_armor_8', 'Iron Will', '+180 Armor, +30 Life', '🔩', { x: 100, y: 440 }, ['is_armor_6', 'is_keystone_berserker'], { armor: 180, life: 30, maxLife: 30 }),
    minor('is_armor_9', 'Warrior\'s Tenacity', '+100 Armor, +80 Life', '⚔️', { x: 320, y: 360 }, ['is_armor_7', 'is_keystone_berserker'], { armor: 100, life: 80, maxLife: 80 }),
    
    keystone('is_keystone_berserker', 'Berserker\'s Wrath', '25% more Damage. Take 10% increased Damage. Cannot be Slowed.', '🔥', 
      { x: 200, y: 280 }, ['is_armor_8', 'is_armor_9', 'is_mastery_left'], {}, [{ type: 'damageMultiplier', value: 25 }, { type: 'damageReduction', value: -10 }], '#CC5500'),
    
    // === CENTER: RAW DAMAGE ===
    minor('is_damage_1', 'Brutal Strikes', '5% increased Damage', '💥', { x: 600, y: 800 }, ['is_start', 'is_damage_2', 'is_damage_3'], {}, [{ type: 'damageMultiplier', value: 5 }]),
    minor('is_damage_2', 'Vicious', '6% increased Damage, +20 Strength', '🗡️', { x: 520, y: 720 }, ['is_damage_1', 'is_damage_4'], { strength: 20 }, [{ type: 'damageMultiplier', value: 6 }]),
    minor('is_damage_3', 'Savage Blows', '5% increased Damage, 5% increased Crit Chance', '⚡', { x: 680, y: 720 }, ['is_damage_1', 'is_damage_5'], {}, [{ type: 'damageMultiplier', value: 5 }, { type: 'critChance', value: 5 }]),
    minor('is_damage_4', 'Executioner', '8% increased Damage', '☠️', { x: 480, y: 640 }, ['is_damage_2', 'is_damage_notable1'], {}, [{ type: 'damageMultiplier', value: 8 }]),
    minor('is_damage_5', 'Merciless', '6% increased Damage, 8% increased Crit Chance', '💀', { x: 720, y: 640 }, ['is_damage_3', 'is_damage_notable2'], {}, [{ type: 'damageMultiplier', value: 6 }, { type: 'critChance', value: 8 }]),
    
    notable('is_damage_notable1', 'Overwhelm', '15% more Damage. Attacks cannot be Evaded.', '🎯', 
      { x: 480, y: 560 }, ['is_damage_4', 'is_damage_6', 'is_damage_7'], {}, [{ type: 'damageMultiplier', value: 15 }], '#CC5500'),
    notable('is_damage_notable2', 'Critical Devastation', '+30% Critical Strike Multiplier. 10% increased Crit Chance.', '⚡', 
      { x: 720, y: 560 }, ['is_damage_5', 'is_damage_8'], {}, [{ type: 'critMultiplier', value: 30 }, { type: 'critChance', value: 10 }], '#CC5500'),
    
    minor('is_damage_6', 'Carnage', '10% increased Damage', '🔪', { x: 400, y: 480 }, ['is_damage_notable1', 'is_damage_keystone'], {}, [{ type: 'damageMultiplier', value: 10 }]),
    minor('is_damage_7', 'Bloodlust', '8% increased Damage, 2% Life Leech', '🩸', { x: 560, y: 480 }, ['is_damage_notable1', 'is_damage_keystone'], {}, [{ type: 'damageMultiplier', value: 8 }, { type: 'lifesteal', value: 2 }]),
    minor('is_damage_8', 'Deadly Precision', '15% increased Crit Chance, +20% Crit Multiplier', '🎯', { x: 720, y: 480 }, ['is_damage_notable2', 'is_counter_bridge'], {}, [{ type: 'critChance', value: 15 }, { type: 'critMultiplier', value: 20 }]),
    
    notable('is_damage_keystone', 'Apex Predator', '20% more Damage. 3% Life Leech. Your hits always apply Bleed.', '🐺', 
      { x: 480, y: 380 }, ['is_damage_6', 'is_damage_7', 'is_mastery_center'], {}, [{ type: 'damageMultiplier', value: 20 }, { type: 'lifesteal', value: 3 }, { type: 'bleedChance', value: 100 }], '#CC5500'),
    
    // === RIGHT: COUNTERATTACK ===
    minor('is_counter_1', 'Riposte', '3% Damage Reflection', '↩️', { x: 800, y: 820 }, ['is_start', 'is_counter_2'], {}, [{ type: 'thorns', value: 3 }]),
    minor('is_counter_2', 'Vengeance', '4% Damage Reflection, +40 Armor', '⚔️', { x: 880, y: 750 }, ['is_counter_1', 'is_counter_3', 'is_counter_4'], { armor: 40 }, [{ type: 'thorns', value: 4 }]),
    minor('is_counter_3', 'Retribution', '5% Damage Reflection', '💢', { x: 960, y: 680 }, ['is_counter_2', 'is_counter_notable1'], {}, [{ type: 'thorns', value: 5 }]),
    minor('is_counter_4', 'Spite', '3% Damage Reflection, 5% increased Damage', '😠', { x: 800, y: 680 }, ['is_counter_2', 'is_counter_5'], {}, [{ type: 'thorns', value: 3 }, { type: 'damageMultiplier', value: 5 }]),
    minor('is_counter_5', 'Wrath', '4% Damage Reflection, +60 Life', '🔥', { x: 800, y: 600 }, ['is_counter_4', 'is_counter_notable2'], { life: 60, maxLife: 60 }, [{ type: 'thorns', value: 4 }]),
    
    notable('is_counter_notable1', 'Thorn Armor', '10% Damage Reflection. Attackers take 50 physical damage.', '🌵', 
      { x: 1040, y: 600 }, ['is_counter_3', 'is_counter_6'], {}, [{ type: 'thorns', value: 10 }], '#CC5500'),
    notable('is_counter_notable2', 'Fury Unleashed', '8% Damage Reflection. Gain 10% Damage for 3s when hit.', '💥', 
      { x: 800, y: 520 }, ['is_counter_5', 'is_counter_7'], {}, [{ type: 'thorns', value: 8 }, { type: 'counterattack', value: 10 }], '#CC5500'),
    
    minor('is_counter_6', 'Living Weapon', '6% Damage Reflection, +80 Armor', '⚔️', { x: 1040, y: 520 }, ['is_counter_notable1', 'is_keystone_thorns'], { armor: 80 }, [{ type: 'thorns', value: 6 }]),
    minor('is_counter_7', 'Rage', '5% Damage Reflection, 8% increased Damage', '😤', { x: 880, y: 440 }, ['is_counter_notable2', 'is_keystone_thorns'], {}, [{ type: 'thorns', value: 5 }, { type: 'damageMultiplier', value: 8 }]),
    minor('is_counter_bridge', 'Aggressive Defense', '4% Damage Reflection, 10% Crit Chance', '🔗', { x: 800, y: 400 }, ['is_damage_8', 'is_keystone_thorns'], {}, [{ type: 'thorns', value: 4 }, { type: 'critChance', value: 10 }]),
    
    keystone('is_keystone_thorns', 'Living Fortress', '20% of Damage taken is reflected. Gain 100 Armor for each enemy reflecting damage to.', '🏰', 
      { x: 960, y: 340 }, ['is_counter_6', 'is_counter_7', 'is_counter_bridge', 'is_mastery_right'], {}, [{ type: 'thorns', value: 20 }], '#CC5500'),
    
    // === UPPER PATHS ===
    minor('is_bleed_1', 'Hemorrhage', '20% chance to Bleed', '🩸', { x: 120, y: 360 }, ['is_keystone_berserker', 'is_bleed_2'], {}, [{ type: 'bleedChance', value: 20 }]),
    minor('is_bleed_2', 'Lacerate', '30% chance to Bleed, 15% increased Bleed Damage', '🔪', { x: 80, y: 280 }, ['is_bleed_1', 'is_bleed_notable'], {}, [{ type: 'bleedChance', value: 30 }, { type: 'dotDamage', value: 15 }]),
    notable('is_bleed_notable', 'Crimson Tide', '50% chance to Bleed. Bleeding enemies deal 10% less damage.', '💉', 
      { x: 80, y: 200 }, ['is_bleed_2', 'is_mastery_left'], {}, [{ type: 'bleedChance', value: 50 }, { type: 'dotDamage', value: 20 }], '#CC5500'),
    
    minor('is_speed_1', 'Swift Strikes', '5% Attack Speed', '💨', { x: 480, y: 300 }, ['is_damage_keystone', 'is_speed_2'], {}, [{ type: 'attackSpeed', value: 5 }]),
    minor('is_speed_2', 'Flurry', '8% Attack Speed, 5% increased Damage', '🌪️', { x: 480, y: 220 }, ['is_speed_1', 'is_speed_notable'], {}, [{ type: 'attackSpeed', value: 8 }, { type: 'damageMultiplier', value: 5 }]),
    notable('is_speed_notable', 'Blade Storm', '15% Attack Speed. Each attack grants 1% more Damage (max 10 stacks).', '⚡', 
      { x: 480, y: 140 }, ['is_speed_2', 'is_mastery_center'], {}, [{ type: 'attackSpeed', value: 15 }, { type: 'damageMultiplier', value: 10 }], '#CC5500'),
    
    minor('is_leech_1', 'Vampiric Strikes', '2% Life Leech', '🧛', { x: 1040, y: 260 }, ['is_keystone_thorns', 'is_leech_2'], {}, [{ type: 'lifesteal', value: 2 }]),
    minor('is_leech_2', 'Sanguine', '3% Life Leech, +60 Life', '🩸', { x: 1040, y: 180 }, ['is_leech_1', 'is_leech_notable'], { life: 60, maxLife: 60 }, [{ type: 'lifesteal', value: 3 }]),
    notable('is_leech_notable', 'Bloodthirst', '5% Life Leech. Leech rate is doubled while on Low Life.', '💀', 
      { x: 1040, y: 100 }, ['is_leech_2', 'is_mastery_right'], {}, [{ type: 'lifesteal', value: 5 }, { type: 'defenseOnLowLife', value: 100 }], '#CC5500'),
    
    // === MASTERY NODES ===
    mastery('is_mastery_left', 'War Machine', 'Gain 2% Damage per 50 Armor. Your Armor is not bypassed by Critical Strikes.', '⭐', 
      { x: 120, y: 120 }, ['is_bleed_notable', 'is_keystone_berserker', 'is_apex'], { armor: 100 }, [{ type: 'damageMultiplier', value: 5 }], '#CC5500'),
    mastery('is_mastery_center', 'Unstoppable Force', 'Cannot be Stunned while attacking. 15% more Damage.', '💫', 
      { x: 480, y: 60 }, ['is_damage_keystone', 'is_speed_notable', 'is_apex'], {}, [{ type: 'stunImmunity', value: 1 }, { type: 'damageMultiplier', value: 15 }], '#CC5500'),
    mastery('is_mastery_right', 'Eternal Warrior', 'Recover 5% of Damage dealt as Life. Cannot die for 1 second after taking fatal damage.', '🌟', 
      { x: 960, y: 60 }, ['is_keystone_thorns', 'is_leech_notable', 'is_apex'], {}, [{ type: 'lifesteal', value: 5 }], '#CC5500'),
    
    keystone('is_apex', 'The Iron Skirmisher', '30% more Damage. 20% more Armor. Take 15% increased Damage.', '👑', 
      { x: 600, y: 40 }, ['is_mastery_left', 'is_mastery_center', 'is_mastery_right'], { armor: 150, strength: 30 }, [{ type: 'damageMultiplier', value: 30 }, { type: 'armorEffectiveness', value: 20 }, { type: 'damageReduction', value: -15 }], '#CC5500'),
  ]
};

// ==================== DUEL WARDEN ====================
// Theme: Parry Master - Evasion, Block, Riposte, Dueling
// Colors: Crimson (#DC143C)

const DUEL_WARDEN_TREE: ClassPassiveTree = {
  classId: 'duel_warden',
  startingNodeId: 'dw_start',
  maxPoints: 50,
  treeWidth: 1200,
  treeHeight: 1000,
  backgroundColor: '#0d0508',
  connectionColor: '#DC143C',
  nodes: [
    start('dw_start', 'Duelist\'s Stance', 'Every attack is an opportunity.', '⚔️', 
      { x: 600, y: 900 }, ['dw_eva_1', 'dw_block_1', 'dw_riposte_1'], { evasion: 50, blockChance: 3 }),
    
    // EVASION BRANCH
    minor('dw_eva_1', 'Nimble', '+80 Evasion', '💨', { x: 400, y: 820 }, ['dw_start', 'dw_eva_2'], { evasion: 80 }),
    minor('dw_eva_2', 'Fleet Footed', '+100 Evasion, +5% Dodge', '🏃', { x: 320, y: 750 }, ['dw_eva_1', 'dw_eva_3'], { evasion: 100 }, [{ type: 'dodgeChance', value: 5 }]),
    minor('dw_eva_3', 'Dancer\'s Grace', '+120 Evasion, +3% Dodge', '💃', { x: 240, y: 680 }, ['dw_eva_2', 'dw_eva_notable1'], { evasion: 120 }, [{ type: 'dodgeChance', value: 3 }]),
    notable('dw_eva_notable1', 'Untouchable', '+200 Evasion. 10% Dodge Chance.', '✨', 
      { x: 160, y: 600 }, ['dw_eva_3', 'dw_eva_4'], { evasion: 200 }, [{ type: 'dodgeChance', value: 10 }], '#DC143C'),
    minor('dw_eva_4', 'Wind Walker', '+150 Evasion, 5% Move Speed', '🌬️', { x: 100, y: 520 }, ['dw_eva_notable1', 'dw_keystone_eva'], { evasion: 150 }, [{ type: 'moveSpeed', value: 5 }]),
    keystone('dw_keystone_eva', 'Phantom', '20% Dodge Chance. Dodging an attack grants 10% more damage for 2s.', '👻', 
      { x: 100, y: 400 }, ['dw_eva_4', 'dw_mastery_left'], { evasion: 100 }, [{ type: 'dodgeChance', value: 20 }], '#DC143C'),
    
    // BLOCK BRANCH  
    minor('dw_block_1', 'Parry', '+5% Block Chance', '🛡️', { x: 600, y: 800 }, ['dw_start', 'dw_block_2'], {}, [{ type: 'blockChance', value: 5 }]),
    minor('dw_block_2', 'Perfect Timing', '+6% Block, +50 Life', '⏱️', { x: 600, y: 700 }, ['dw_block_1', 'dw_block_3'], { life: 50, maxLife: 50 }, [{ type: 'blockChance', value: 6 }]),
    minor('dw_block_3', 'Counter Stance', '+5% Block, 5% Counterattack', '↩️', { x: 600, y: 600 }, ['dw_block_2', 'dw_block_notable'], {}, [{ type: 'blockChance', value: 5 }, { type: 'counterattack', value: 5 }]),
    notable('dw_block_notable', 'Blade Dance', '+10% Block. Counterattacks deal 50% more damage.', '💫', 
      { x: 600, y: 500 }, ['dw_block_3', 'dw_block_keystone'], {}, [{ type: 'blockChance', value: 10 }, { type: 'counterattack', value: 50 }], '#DC143C'),
    keystone('dw_block_keystone', 'Master Duelist', 'Blocking an attack triggers a counterattack. +15% Block.', '⚔️', 
      { x: 600, y: 380 }, ['dw_block_notable', 'dw_mastery_center'], {}, [{ type: 'blockChance', value: 15 }, { type: 'counterattack', value: 100 }], '#DC143C'),
    
    // RIPOSTE BRANCH
    minor('dw_riposte_1', 'Swift Retaliation', '5% Damage, 3% Attack Speed', '⚡', { x: 800, y: 820 }, ['dw_start', 'dw_riposte_2'], {}, [{ type: 'damageMultiplier', value: 5 }, { type: 'attackSpeed', value: 3 }]),
    minor('dw_riposte_2', 'Opportunist', '8% Damage after Blocking', '🎯', { x: 880, y: 750 }, ['dw_riposte_1', 'dw_riposte_3'], {}, [{ type: 'counterattack', value: 8 }]),
    minor('dw_riposte_3', 'Predator', '10% Crit Chance, +20 Dex', '🐆', { x: 960, y: 680 }, ['dw_riposte_2', 'dw_riposte_notable'], { dexterity: 20 }, [{ type: 'critChance', value: 10 }]),
    notable('dw_riposte_notable', 'First Blood', 'Critical Strikes deal 40% more damage. +15% Crit Chance.', '🩸', 
      { x: 1040, y: 600 }, ['dw_riposte_3', 'dw_riposte_4'], {}, [{ type: 'critChance', value: 15 }, { type: 'critMultiplier', value: 40 }], '#DC143C'),
    minor('dw_riposte_4', 'Killing Blow', '+25% Crit Multiplier', '💀', { x: 1040, y: 520 }, ['dw_riposte_notable', 'dw_keystone_riposte'], {}, [{ type: 'critMultiplier', value: 25 }]),
    keystone('dw_keystone_riposte', 'Executioner\'s Blade', 'Crits always Bleed. +30% Crit Multi. +20% Crit Chance.', '🗡️', 
      { x: 1000, y: 400 }, ['dw_riposte_4', 'dw_mastery_right'], {}, [{ type: 'critChance', value: 20 }, { type: 'critMultiplier', value: 30 }, { type: 'bleedChance', value: 100 }], '#DC143C'),
    
    // MASTERY
    mastery('dw_mastery_left', 'Ghost Step', 'After dodging, your next attack cannot miss. +10% Dodge.', '👻', 
      { x: 200, y: 300 }, ['dw_keystone_eva', 'dw_apex'], {}, [{ type: 'dodgeChance', value: 10 }], '#DC143C'),
    mastery('dw_mastery_center', 'Riposte Master', 'Blocking restores 2% Life and Mana.', '⚔️', 
      { x: 600, y: 280 }, ['dw_block_keystone', 'dw_apex'], {}, [{ type: 'lifeOnBlock', value: 40 }], '#DC143C'),
    mastery('dw_mastery_right', 'Deathblow', 'Enemies below 20% Life take 100% more Crit damage from you.', '💀', 
      { x: 900, y: 300 }, ['dw_keystone_riposte', 'dw_apex'], {}, [{ type: 'critMultiplier', value: 50 }], '#DC143C'),
    keystone('dw_apex', 'The Duel Warden', 'You cannot be hit by the same enemy twice in succession. +10% Block, +10% Dodge.', '👑', 
      { x: 600, y: 100 }, ['dw_mastery_left', 'dw_mastery_center', 'dw_mastery_right'], {}, [{ type: 'blockChance', value: 10 }, { type: 'dodgeChance', value: 10 }], '#DC143C'),
  ]
};

// ==================== SHADOW WARDEN ====================
// Theme: Stealth Tank - Evasion, Dodge, Stealth Bonuses
// Colors: Dark Purple (#301934)

const SHADOW_WARDEN_TREE: ClassPassiveTree = {
  classId: 'shadow_warden',
  startingNodeId: 'sw_start',
  maxPoints: 50,
  treeWidth: 1200,
  treeHeight: 1000,
  backgroundColor: '#050308',
  connectionColor: '#9370DB',
  nodes: [
    start('sw_start', 'Shadow Training', 'The darkness is your ally.', '🌑', 
      { x: 600, y: 900 }, ['sw_eva_1', 'sw_stealth_1', 'sw_shadow_1'], { evasion: 60, dexterity: 10 }),
    
    // EVASION
    minor('sw_eva_1', 'Shadowstep', '+100 Evasion', '👤', { x: 400, y: 820 }, ['sw_start', 'sw_eva_2'], { evasion: 100 }),
    minor('sw_eva_2', 'Fade', '+120 Evasion, +5% Dodge', '💨', { x: 320, y: 750 }, ['sw_eva_1', 'sw_eva_notable'], { evasion: 120 }, [{ type: 'dodgeChance', value: 5 }]),
    notable('sw_eva_notable', 'Unseen', '+200 Evasion. 10% Dodge. Enemies have reduced accuracy vs you.', '👁️', 
      { x: 240, y: 680 }, ['sw_eva_2', 'sw_eva_keystone'], { evasion: 200 }, [{ type: 'dodgeChance', value: 10 }], '#9370DB'),
    minor('sw_eva_3', 'Phantom Form', '+150 Evasion', '👻', { x: 160, y: 600 }, ['sw_eva_notable', 'sw_eva_keystone'], { evasion: 150 }),
    keystone('sw_eva_keystone', 'Living Shadow', '25% Dodge. When you Dodge, become untargetable for 0.5s.', '🌑', 
      { x: 120, y: 480 }, ['sw_eva_3', 'sw_mastery_left'], { evasion: 100 }, [{ type: 'dodgeChance', value: 25 }], '#9370DB'),
    
    // STEALTH
    minor('sw_stealth_1', 'Ambush', '+8% Damage from Stealth', '🗡️', { x: 600, y: 800 }, ['sw_start', 'sw_stealth_2'], {}, [{ type: 'damageMultiplier', value: 8 }]),
    minor('sw_stealth_2', 'Silent Killer', '+12% Crit from Stealth', '🎯', { x: 600, y: 700 }, ['sw_stealth_1', 'sw_stealth_notable'], {}, [{ type: 'critChance', value: 12 }]),
    notable('sw_stealth_notable', 'Assassinate', 'First hit from stealth is always Critical. +20% Crit Multi.', '💀', 
      { x: 600, y: 600 }, ['sw_stealth_2', 'sw_stealth_keystone'], {}, [{ type: 'critChance', value: 100 }, { type: 'critMultiplier', value: 20 }], '#9370DB'),
    keystone('sw_stealth_keystone', 'Death\'s Embrace', 'Killing blows restore 5% Life and grant Stealth.', '☠️', 
      { x: 600, y: 480 }, ['sw_stealth_notable', 'sw_mastery_center'], {}, [{ type: 'lifesteal', value: 5 }], '#9370DB'),
    
    // SHADOW DAMAGE
    minor('sw_shadow_1', 'Dark Power', '+10% Chaos Damage', '🖤', { x: 800, y: 820 }, ['sw_start', 'sw_shadow_2'], {}, [{ type: 'bonusChaos', value: 10 }]),
    minor('sw_shadow_2', 'Corruption', '+15% Chaos Damage, +5% Chaos Resist', '💜', { x: 880, y: 750 }, ['sw_shadow_1', 'sw_shadow_notable'], { chaosResistance: 5 }, [{ type: 'bonusChaos', value: 15 }]),
    notable('sw_shadow_notable', 'Void Touch', '+25% Chaos Damage. Attacks inflict Wither.', '🌀', 
      { x: 960, y: 680 }, ['sw_shadow_2', 'sw_shadow_keystone'], {}, [{ type: 'bonusChaos', value: 25 }], '#9370DB'),
    keystone('sw_shadow_keystone', 'Shadow Lord', '50% of Physical as extra Chaos. +10% Chaos Resist.', '👑', 
      { x: 1000, y: 560 }, ['sw_shadow_notable', 'sw_mastery_right'], { chaosResistance: 10 }, [{ type: 'bonusChaos', value: 50 }], '#9370DB'),
    
    // MASTERY
    mastery('sw_mastery_left', 'Ethereal Form', 'Take 20% less damage while moving.', '💨', 
      { x: 200, y: 380 }, ['sw_eva_keystone', 'sw_apex'], {}, [{ type: 'damageReduction', value: 20 }], '#9370DB'),
    mastery('sw_mastery_center', 'Perfect Assassin', 'Critical hits restore 2% Life.', '🗡️', 
      { x: 600, y: 380 }, ['sw_stealth_keystone', 'sw_apex'], {}, [{ type: 'lifesteal', value: 2 }], '#9370DB'),
    mastery('sw_mastery_right', 'Void Walker', 'Immune to Chaos damage. Deal 30% less Chaos damage.', '🌌', 
      { x: 900, y: 450 }, ['sw_shadow_keystone', 'sw_apex'], { chaosResistance: 75 }, [{ type: 'bonusChaos', value: -30 }], '#9370DB'),
    keystone('sw_apex', 'The Shadow Warden', 'You are always in Stealth in combat. +20% Evasion.', '👑', 
      { x: 600, y: 200 }, ['sw_mastery_left', 'sw_mastery_center', 'sw_mastery_right'], { evasion: 200 }, [{ type: 'evasionRating', value: 20 }], '#9370DB'),
  ]
};

// ==================== GHOSTBLADE ====================
// Theme: Ethereal Warrior - Evasion, Phasing, Spectral Damage
// Colors: Pale Blue (#B0E0E6)

const GHOSTBLADE_TREE: ClassPassiveTree = {
  classId: 'ghostblade',
  startingNodeId: 'gb_start',
  maxPoints: 50,
  treeWidth: 1200,
  treeHeight: 1000,
  backgroundColor: '#050810',
  connectionColor: '#B0E0E6',
  nodes: [
    start('gb_start', 'Spectral Form', 'Between life and death, you find power.', '👻', 
      { x: 600, y: 900 }, ['gb_phase_1', 'gb_spectral_1', 'gb_soul_1'], { evasion: 50, energyShield: 30 }),
    
    // PHASING
    minor('gb_phase_1', 'Ethereal', '+80 Evasion, +5% Dodge', '💨', { x: 400, y: 820 }, ['gb_start', 'gb_phase_2'], { evasion: 80 }, [{ type: 'dodgeChance', value: 5 }]),
    minor('gb_phase_2', 'Phase Shift', '+100 Evasion, +8% Dodge', '🌀', { x: 320, y: 750 }, ['gb_phase_1', 'gb_phase_notable'], { evasion: 100 }, [{ type: 'dodgeChance', value: 8 }]),
    notable('gb_phase_notable', 'Incorporeal', '15% Dodge. 10% chance to Phase through attacks.', '👻', 
      { x: 240, y: 680 }, ['gb_phase_2', 'gb_phase_keystone'], { evasion: 150 }, [{ type: 'dodgeChance', value: 15 }], '#B0E0E6'),
    keystone('gb_phase_keystone', 'Ghost Walk', '25% Dodge. Attacks pass through you. Cannot Block.', '🌌', 
      { x: 160, y: 560 }, ['gb_phase_notable', 'gb_mastery_left'], {}, [{ type: 'dodgeChance', value: 25 }, { type: 'blockChance', value: -100 }], '#B0E0E6'),
    
    // SPECTRAL DAMAGE
    minor('gb_spectral_1', 'Soul Blade', '+10% Cold Damage', '❄️', { x: 600, y: 800 }, ['gb_start', 'gb_spectral_2'], {}, [{ type: 'bonusCold', value: 10 }]),
    minor('gb_spectral_2', 'Frost Touch', '+15% Cold, 10% Freeze Chance', '🧊', { x: 600, y: 700 }, ['gb_spectral_1', 'gb_spectral_notable'], {}, [{ type: 'bonusCold', value: 15 }, { type: 'freezeChance', value: 10 }]),
    notable('gb_spectral_notable', 'Spectral Strike', '+30% Cold Damage. Chilled enemies take 10% more damage.', '💎', 
      { x: 600, y: 600 }, ['gb_spectral_2', 'gb_spectral_keystone'], {}, [{ type: 'bonusCold', value: 30 }], '#B0E0E6'),
    keystone('gb_spectral_keystone', 'Soul Reaver', 'Attacks always Chill. Killing Frozen enemies explodes them.', '💀', 
      { x: 600, y: 480 }, ['gb_spectral_notable', 'gb_mastery_center'], {}, [{ type: 'freezeChance', value: 100 }], '#B0E0E6'),
    
    // SOUL ENERGY
    minor('gb_soul_1', 'Soul Siphon', '+40 ES, +30 Mana', '💙', { x: 800, y: 820 }, ['gb_start', 'gb_soul_2'], { energyShield: 40, mana: 30, maxMana: 30 }),
    minor('gb_soul_2', 'Spirit Link', '+60 ES, 5% ES Recharge', '🔗', { x: 880, y: 750 }, ['gb_soul_1', 'gb_soul_notable'], { energyShield: 60 }, [{ type: 'esRechargeRate', value: 5 }]),
    notable('gb_soul_notable', 'Soul Shield', '+100 ES. ES starts recharging 20% faster.', '🛡️', 
      { x: 960, y: 680 }, ['gb_soul_2', 'gb_soul_keystone'], { energyShield: 100 }, [{ type: 'esRechargeDelay', value: 20 }], '#B0E0E6'),
    keystone('gb_soul_keystone', 'Spectral Guardian', 'ES protects Life. +150 ES. -50% Life.', '👼', 
      { x: 1000, y: 560 }, ['gb_soul_notable', 'gb_mastery_right'], { energyShield: 150 }, [], '#B0E0E6'),
    
    // MASTERY
    mastery('gb_mastery_left', 'Phantom Dance', 'Dodging grants 5% Attack Speed for 3s. Stacks.', '💃', 
      { x: 200, y: 460 }, ['gb_phase_keystone', 'gb_apex'], {}, [{ type: 'attackSpeed', value: 5 }], '#B0E0E6'),
    mastery('gb_mastery_center', 'Soul Harvest', 'Killing enemies grants +5 ES for 10s. Stacks.', '🌾', 
      { x: 600, y: 380 }, ['gb_spectral_keystone', 'gb_apex'], {}, [], '#B0E0E6'),
    mastery('gb_mastery_right', 'Undying Spirit', 'When ES is depleted, gain 30% Dodge for 4s.', '✨', 
      { x: 900, y: 460 }, ['gb_soul_keystone', 'gb_apex'], {}, [{ type: 'dodgeChance', value: 30 }], '#B0E0E6'),
    keystone('gb_apex', 'The Ghostblade', 'You exist between realms. 50% of damage bypasses ES but you take 25% less damage.', '👑', 
      { x: 600, y: 200 }, ['gb_mastery_left', 'gb_mastery_center', 'gb_mastery_right'], { energyShield: 100, evasion: 100 }, [{ type: 'damageReduction', value: 25 }], '#B0E0E6'),
  ]
};

// ==================== ARCANE BULWARK ====================
// Theme: Magic Tank - Energy Shield, Armor, Spell Defense
// Colors: Purple (#800080)

const ARCANE_BULWARK_TREE: ClassPassiveTree = {
  classId: 'arcane_bulwark',
  startingNodeId: 'ab_start',
  maxPoints: 50,
  treeWidth: 1200,
  treeHeight: 1000,
  backgroundColor: '#080508',
  connectionColor: '#9932CC',
  nodes: [
    start('ab_start', 'Arcane Foundation', 'Magic is the ultimate shield.', '🔮', 
      { x: 600, y: 900 }, ['ab_es_1', 'ab_armor_1', 'ab_spell_1'], { energyShield: 50, armor: 30, intelligence: 10 }),
    
    // ENERGY SHIELD
    minor('ab_es_1', 'Arcane Barrier', '+60 ES', '💠', { x: 400, y: 820 }, ['ab_start', 'ab_es_2'], { energyShield: 60 }),
    minor('ab_es_2', 'Mana Shield', '+80 ES, +40 Mana', '🛡️', { x: 320, y: 750 }, ['ab_es_1', 'ab_es_notable'], { energyShield: 80, mana: 40, maxMana: 40 }),
    notable('ab_es_notable', 'Arcane Fortress', '+150 ES. 10% faster ES Recharge.', '🏰', 
      { x: 240, y: 680 }, ['ab_es_2', 'ab_es_keystone'], { energyShield: 150 }, [{ type: 'esRechargeRate', value: 10 }], '#9932CC'),
    minor('ab_es_3', 'Mystic Ward', '+100 ES, +20 Int', '✨', { x: 160, y: 600 }, ['ab_es_notable', 'ab_es_keystone'], { energyShield: 100, intelligence: 20 }),
    keystone('ab_es_keystone', 'Arcane Supremacy', '+200 ES. ES protects Mana. 50% of Mana spent is absorbed by ES.', '💎', 
      { x: 120, y: 480 }, ['ab_es_3', 'ab_mastery_left'], { energyShield: 200 }, [], '#9932CC'),
    
    // HYBRID ARMOR
    minor('ab_armor_1', 'Enchanted Plate', '+80 Armor, +30 ES', '⚙️', { x: 600, y: 800 }, ['ab_start', 'ab_armor_2'], { armor: 80, energyShield: 30 }),
    minor('ab_armor_2', 'Runic Defense', '+100 Armor, +50 ES', '📜', { x: 600, y: 700 }, ['ab_armor_1', 'ab_armor_notable'], { armor: 100, energyShield: 50 }),
    notable('ab_armor_notable', 'Magical Plating', '+150 Armor, +100 ES. Armor applies to Spell Damage.', '🔰', 
      { x: 600, y: 600 }, ['ab_armor_2', 'ab_armor_keystone'], { armor: 150, energyShield: 100 }, [{ type: 'armorEffectiveness', value: 15 }], '#9932CC'),
    keystone('ab_armor_keystone', 'Arcane Armor', 'Your Armor and ES are combined. +100 to both.', '🛡️', 
      { x: 600, y: 480 }, ['ab_armor_notable', 'ab_mastery_center'], { armor: 100, energyShield: 100 }, [], '#9932CC'),
    
    // SPELL DEFENSE
    minor('ab_spell_1', 'Spell Ward', '+10% Spell Block', '🌀', { x: 800, y: 820 }, ['ab_start', 'ab_spell_2'], {}, [{ type: 'spellBlockChance', value: 10 }]),
    minor('ab_spell_2', 'Mystic Barrier', '+12% Spell Block, +40 Mana', '🔮', { x: 880, y: 750 }, ['ab_spell_1', 'ab_spell_notable'], { mana: 40, maxMana: 40 }, [{ type: 'spellBlockChance', value: 12 }]),
    notable('ab_spell_notable', 'Spell Reflector', '+15% Spell Block. Blocked spells restore 3% Mana.', '↩️', 
      { x: 960, y: 680 }, ['ab_spell_2', 'ab_spell_keystone'], {}, [{ type: 'spellBlockChance', value: 15 }], '#9932CC'),
    keystone('ab_spell_keystone', 'Null Magic', '30% Spell Block. Spells blocked restore 5% ES.', '⚫', 
      { x: 1000, y: 560 }, ['ab_spell_notable', 'ab_mastery_right'], {}, [{ type: 'spellBlockChance', value: 30 }], '#9932CC'),
    
    // MASTERY
    mastery('ab_mastery_left', 'Endless Energy', 'ES Recharge cannot be interrupted by damage.', '♾️', 
      { x: 200, y: 380 }, ['ab_es_keystone', 'ab_apex'], { energyShield: 50 }, [], '#9932CC'),
    mastery('ab_mastery_center', 'Perfect Balance', 'Gain 1% Damage per 50 ES. Gain 10 ES per 50 Armor.', '⚖️', 
      { x: 600, y: 380 }, ['ab_armor_keystone', 'ab_apex'], {}, [{ type: 'damageMultiplier', value: 5 }], '#9932CC'),
    mastery('ab_mastery_right', 'Spell Mastery', 'Casting spells grants +20 ES for 5s. Stacks.', '📖', 
      { x: 900, y: 460 }, ['ab_spell_keystone', 'ab_apex'], {}, [], '#9932CC'),
    keystone('ab_apex', 'The Arcane Bulwark', 'Your ES is doubled but cannot Recharge naturally. Blocked attacks restore 2% ES.', '👑', 
      { x: 600, y: 200 }, ['ab_mastery_left', 'ab_mastery_center', 'ab_mastery_right'], { energyShield: 150, armor: 100 }, [], '#9932CC'),
  ]
};

// ==================== NULL TEMPLAR ====================
// Theme: Anti-Magic Paladin - Spell Suppression, Damage Immunity
// Colors: Silver (#C0C0C0)

const NULL_TEMPLAR_TREE: ClassPassiveTree = {
  classId: 'null_templar',
  startingNodeId: 'nt_start',
  maxPoints: 50,
  treeWidth: 1200,
  treeHeight: 1000,
  backgroundColor: '#0a0a0a',
  connectionColor: '#C0C0C0',
  nodes: [
    start('nt_start', 'Null Initiation', 'Magic is the enemy.', '⚔️', 
      { x: 600, y: 900 }, ['nt_null_1', 'nt_purity_1', 'nt_crusade_1'], { armor: 40, spellSuppressionChance: 8 }),
    
    // NULL MAGIC
    minor('nt_null_1', 'Void Touch', '+10% Spell Suppression', '🌑', { x: 400, y: 820 }, ['nt_start', 'nt_null_2'], {}, [{ type: 'spellSuppression', value: 10 }]),
    minor('nt_null_2', 'Magic Void', '+12% Spell Suppression, +50 Life', '⬛', { x: 320, y: 750 }, ['nt_null_1', 'nt_null_notable'], { life: 50, maxLife: 50 }, [{ type: 'spellSuppression', value: 12 }]),
    notable('nt_null_notable', 'Null Zone', '+15% Spell Suppression. Enemies near you deal 10% less Spell Damage.', '🕳️', 
      { x: 240, y: 680 }, ['nt_null_2', 'nt_null_keystone'], {}, [{ type: 'spellSuppression', value: 15 }], '#C0C0C0'),
    keystone('nt_null_keystone', 'Absolute Null', '100% Spell Suppression. Cannot use Spells. +200 Armor.', '⚫', 
      { x: 160, y: 560 }, ['nt_null_notable', 'nt_mastery_left'], { armor: 200 }, [{ type: 'spellSuppression', value: 30 }], '#C0C0C0'),
    
    // PURITY
    minor('nt_purity_1', 'Purity', '+6% All Resist', '✨', { x: 600, y: 800 }, ['nt_start', 'nt_purity_2'], { fireResistance: 6, coldResistance: 6, lightningResistance: 6 }),
    minor('nt_purity_2', 'Cleansing', '+8% All Resist, +40 Life', '🌟', { x: 600, y: 700 }, ['nt_purity_1', 'nt_purity_notable'], { fireResistance: 8, coldResistance: 8, lightningResistance: 8, life: 40, maxLife: 40 }),
    notable('nt_purity_notable', 'Divine Protection', '+1% Max All Resist. +10% All Resist.', '👼', 
      { x: 600, y: 600 }, ['nt_purity_2', 'nt_purity_keystone'], { fireResistance: 10, coldResistance: 10, lightningResistance: 10 }, [{ type: 'maxResistance', value: 1 }], '#C0C0C0'),
    keystone('nt_purity_keystone', 'Incorruptible', '+3% Max All Resist. Immune to Curses.', '💎', 
      { x: 600, y: 480 }, ['nt_purity_notable', 'nt_mastery_center'], {}, [{ type: 'maxResistance', value: 3 }], '#C0C0C0'),
    
    // CRUSADE
    minor('nt_crusade_1', 'Holy Strike', '+8% Damage vs Casters', '⚔️', { x: 800, y: 820 }, ['nt_start', 'nt_crusade_2'], {}, [{ type: 'damageMultiplier', value: 8 }]),
    minor('nt_crusade_2', 'Zealot', '+12% Damage, +30 Str', '🔥', { x: 880, y: 750 }, ['nt_crusade_1', 'nt_crusade_notable'], { strength: 30 }, [{ type: 'damageMultiplier', value: 12 }]),
    notable('nt_crusade_notable', 'Purge', '+20% Damage vs Magic enemies. Attacks remove buffs.', '💀', 
      { x: 960, y: 680 }, ['nt_crusade_2', 'nt_crusade_keystone'], {}, [{ type: 'damageMultiplier', value: 20 }], '#C0C0C0'),
    keystone('nt_crusade_keystone', 'Inquisitor', 'Your damage ignores Magic resistances. +15% Damage.', '⚖️', 
      { x: 1000, y: 560 }, ['nt_crusade_notable', 'nt_mastery_right'], {}, [{ type: 'damageMultiplier', value: 15 }], '#C0C0C0'),
    
    // MASTERY
    mastery('nt_mastery_left', 'Void Shield', 'Suppressed Spells heal you for 3% of damage prevented.', '🛡️', 
      { x: 200, y: 460 }, ['nt_null_keystone', 'nt_apex'], {}, [], '#C0C0C0'),
    mastery('nt_mastery_center', 'Divine Bulwark', 'Cannot take more than 30% of Life as damage from a single hit.', '🏛️', 
      { x: 600, y: 380 }, ['nt_purity_keystone', 'nt_apex'], {}, [], '#C0C0C0'),
    mastery('nt_mastery_right', 'Executioner', 'Enemies you hit cannot cast for 0.5s.', '⚔️', 
      { x: 900, y: 460 }, ['nt_crusade_keystone', 'nt_apex'], {}, [], '#C0C0C0'),
    keystone('nt_apex', 'The Null Templar', 'Magic damage cannot reduce you below 1 Life. +100 Life, +100 Armor.', '👑', 
      { x: 600, y: 200 }, ['nt_mastery_left', 'nt_mastery_center', 'nt_mastery_right'], { life: 100, maxLife: 100, armor: 100 }, [], '#C0C0C0'),
  ]
};

// ==================== PHASE GUARDIAN ====================
// Theme: Dimensional Tank - Phasing, Teleportation, ES
// Colors: Teal (#008080)

const PHASE_GUARDIAN_TREE: ClassPassiveTree = {
  classId: 'phase_guardian',
  startingNodeId: 'pg_start',
  maxPoints: 50,
  treeWidth: 1200,
  treeHeight: 1000,
  backgroundColor: '#050808',
  connectionColor: '#20B2AA',
  nodes: [
    start('pg_start', 'Phase Training', 'Reality is merely a suggestion.', '🌀', 
      { x: 600, y: 900 }, ['pg_phase_1', 'pg_es_1', 'pg_warp_1'], { energyShield: 40, evasion: 40 }),
    
    // PHASING
    minor('pg_phase_1', 'Reality Shift', '+80 Evasion, +5% Dodge', '💨', { x: 400, y: 820 }, ['pg_start', 'pg_phase_2'], { evasion: 80 }, [{ type: 'dodgeChance', value: 5 }]),
    minor('pg_phase_2', 'Dimensional Step', '+100 Evasion, +8% Dodge', '🌀', { x: 320, y: 750 }, ['pg_phase_1', 'pg_phase_notable'], { evasion: 100 }, [{ type: 'dodgeChance', value: 8 }]),
    notable('pg_phase_notable', 'Ethereal Shift', '+150 Evasion. 15% Dodge. Dodging teleports you.', '✨', 
      { x: 240, y: 680 }, ['pg_phase_2', 'pg_phase_keystone'], { evasion: 150 }, [{ type: 'dodgeChance', value: 15 }], '#20B2AA'),
    keystone('pg_phase_keystone', 'Quantum Lock', '25% Dodge. You phase through 50% of all attacks.', '🔮', 
      { x: 160, y: 560 }, ['pg_phase_notable', 'pg_mastery_left'], {}, [{ type: 'dodgeChance', value: 25 }, { type: 'damageReduction', value: 50 }], '#20B2AA'),
    
    // ENERGY SHIELD
    minor('pg_es_1', 'Phase Barrier', '+60 ES', '💠', { x: 600, y: 800 }, ['pg_start', 'pg_es_2'], { energyShield: 60 }),
    minor('pg_es_2', 'Dimensional Ward', '+80 ES, 5% ES Recharge', '🛡️', { x: 600, y: 700 }, ['pg_es_1', 'pg_es_notable'], { energyShield: 80 }, [{ type: 'esRechargeRate', value: 5 }]),
    notable('pg_es_notable', 'Temporal Shield', '+120 ES. ES recharges instantly when you Dodge.', '⏰', 
      { x: 600, y: 600 }, ['pg_es_2', 'pg_es_keystone'], { energyShield: 120 }, [], '#20B2AA'),
    keystone('pg_es_keystone', 'Phase Lock', '+200 ES. ES cannot be bypassed. Take 10% more Physical.', '🔒', 
      { x: 600, y: 480 }, ['pg_es_notable', 'pg_mastery_center'], { energyShield: 200 }, [{ type: 'damageReduction', value: -10 }], '#20B2AA'),
    
    // WARP
    minor('pg_warp_1', 'Blink Strike', '+5% Attack Speed, +10 Dex', '⚡', { x: 800, y: 820 }, ['pg_start', 'pg_warp_2'], { dexterity: 10 }, [{ type: 'attackSpeed', value: 5 }]),
    minor('pg_warp_2', 'Warp Blade', '+8% Attack Speed, +8% Damage', '🗡️', { x: 880, y: 750 }, ['pg_warp_1', 'pg_warp_notable'], {}, [{ type: 'attackSpeed', value: 8 }, { type: 'damageMultiplier', value: 8 }]),
    notable('pg_warp_notable', 'Reality Cutter', '+15% Attack Speed. Attacks hit twice (second hit 30% damage).', '✂️', 
      { x: 960, y: 680 }, ['pg_warp_2', 'pg_warp_keystone'], {}, [{ type: 'attackSpeed', value: 15 }], '#20B2AA'),
    keystone('pg_warp_keystone', 'Time Dilation', 'Every 5th attack is instant. +20% Attack Speed.', '⏱️', 
      { x: 1000, y: 560 }, ['pg_warp_notable', 'pg_mastery_right'], {}, [{ type: 'attackSpeed', value: 20 }], '#20B2AA'),
    
    // MASTERY
    mastery('pg_mastery_left', 'Untethered', 'You cannot be Slowed or Rooted.', '🌬️', 
      { x: 200, y: 460 }, ['pg_phase_keystone', 'pg_apex'], {}, [], '#20B2AA'),
    mastery('pg_mastery_center', 'Paradox', 'Damage taken is delayed by 1 second.', '⏳', 
      { x: 600, y: 380 }, ['pg_es_keystone', 'pg_apex'], {}, [], '#20B2AA'),
    mastery('pg_mastery_right', 'Speed Force', '+10% Move Speed per 10% Attack Speed.', '💨', 
      { x: 900, y: 460 }, ['pg_warp_keystone', 'pg_apex'], {}, [{ type: 'moveSpeed', value: 10 }], '#20B2AA'),
    keystone('pg_apex', 'The Phase Guardian', 'You exist in multiple phases. Take 30% less damage but deal 20% less.', '👑', 
      { x: 600, y: 200 }, ['pg_mastery_left', 'pg_mastery_center', 'pg_mastery_right'], { energyShield: 100, evasion: 100 }, [{ type: 'damageReduction', value: 30 }, { type: 'damageMultiplier', value: -20 }], '#20B2AA'),
  ]
};

// ==================== HEALER TREES ====================

// ==================== HIGH CLERIC ====================
// Theme: Divine Healer - Casted Heals, Holy Power, Mana
// Colors: Gold (#FFD700)

const HIGH_CLERIC_TREE: ClassPassiveTree = {
  classId: 'high_cleric',
  startingNodeId: 'hc_start',
  maxPoints: 65,
  treeWidth: 1400,
  treeHeight: 1200,
  backgroundColor: '#0d0d05',
  connectionColor: '#FFD700',
  nodes: [
    start('hc_start', 'Divine Calling', 'The light answers to those who believe.', '✨', 
      { x: 700, y: 1100 }, ['hc_heal_1', 'hc_mana_1', 'hc_holy_1'], { mana: 50, intelligence: 10 }),
    
    // === LEFT BRANCH: HEALING MASTERY ===
    minor('hc_heal_1', 'Blessed Hands', '+8% Healing', '🙏', { x: 500, y: 1020 }, ['hc_start', 'hc_heal_2'], {}, [{ type: 'healingMultiplier', value: 8 }]),
    minor('hc_heal_2', 'Divine Grace', '+10% Healing, +30 Mana', '💫', { x: 400, y: 950 }, ['hc_heal_1', 'hc_heal_3', 'hc_heal_2b'], { mana: 30, maxMana: 30 }, [{ type: 'healingMultiplier', value: 10 }]),
    minor('hc_heal_3', 'Tender Care', '+12% Healing', '💕', { x: 300, y: 880 }, ['hc_heal_2', 'hc_heal_notable1'], {}, [{ type: 'healingMultiplier', value: 12 }]),
    minor('hc_heal_2b', 'Compassion', '+8% Healing, +40 Life', '❤️', { x: 450, y: 880 }, ['hc_heal_2', 'hc_heal_notable1'], { life: 40, maxLife: 40 }, [{ type: 'healingMultiplier', value: 8 }]),
    
    notable('hc_heal_notable1', 'Sacred Touch', '+20% Healing. Critical heals heal for 50% more.', '🌟', 
      { x: 280, y: 800 }, ['hc_heal_3', 'hc_heal_2b', 'hc_heal_4', 'hc_heal_5'], {}, [{ type: 'healingMultiplier', value: 20 }], '#FFD700'),
    
    minor('hc_heal_4', 'Mercy', '+15% Healing', '💛', { x: 180, y: 720 }, ['hc_heal_notable1', 'hc_heal_notable2'], {}, [{ type: 'healingMultiplier', value: 15 }]),
    minor('hc_heal_5', 'Benevolence', '+10% Healing, +5% Cast Speed', '🌸', { x: 320, y: 720 }, ['hc_heal_notable1', 'hc_heal_notable2'], {}, [{ type: 'healingMultiplier', value: 10 }, { type: 'castSpeed', value: 5 }]),
    
    notable('hc_heal_notable2', 'Healing Surge', '+25% Healing. Heals have 10% Crit Chance.', '⚡', 
      { x: 250, y: 640 }, ['hc_heal_4', 'hc_heal_5', 'hc_heal_6', 'hc_heal_7'], {}, [{ type: 'healingMultiplier', value: 25 }, { type: 'critChance', value: 10 }], '#FFD700'),
    
    minor('hc_heal_6', 'Divine Favor', '+12% Healing, +50 Mana', '✨', { x: 150, y: 560 }, ['hc_heal_notable2', 'hc_heal_keystone'], { mana: 50, maxMana: 50 }, [{ type: 'healingMultiplier', value: 12 }]),
    minor('hc_heal_7', 'Sanctified', '+15% Healing', '🕊️', { x: 280, y: 560 }, ['hc_heal_notable2', 'hc_heal_keystone'], {}, [{ type: 'healingMultiplier', value: 15 }]),
    
    keystone('hc_heal_keystone', 'Divine Intervention', 'Heals can Critical Strike. +30% Healing. +20% Crit Chance on heals.', '👼', 
      { x: 200, y: 460 }, ['hc_heal_6', 'hc_heal_7', 'hc_mastery_left'], {}, [{ type: 'healingMultiplier', value: 30 }, { type: 'critChance', value: 20 }], '#FFD700'),
    
    // Emergency Healing Sub-branch
    minor('hc_emergency_1', 'Swift Aid', '+8% Cast Speed on Heals', '💨', { x: 100, y: 480 }, ['hc_heal_keystone', 'hc_emergency_2'], {}, [{ type: 'castSpeed', value: 8 }]),
    minor('hc_emergency_2', 'Emergency Response', '+10% Healing to Low Life', '🚨', { x: 80, y: 400 }, ['hc_emergency_1', 'hc_emergency_notable'], {}, [{ type: 'healingMultiplier', value: 10 }]),
    notable('hc_emergency_notable', 'Lifesaver', 'Healing allies below 25% heals for 100% more.', '💖', 
      { x: 100, y: 320 }, ['hc_emergency_2', 'hc_mastery_left'], {}, [{ type: 'healingMultiplier', value: 100 }], '#FFD700'),
    
    // === CENTER BRANCH: MANA MASTERY ===
    minor('hc_mana_1', 'Mana Flow', '+60 Mana, +1% Mana Regen', '💧', { x: 700, y: 1000 }, ['hc_start', 'hc_mana_2', 'hc_mana_1b'], { mana: 60, maxMana: 60, manaRegeneration: 1 }),
    minor('hc_mana_2', 'Arcane Wisdom', '+80 Mana, +20 Int', '📖', { x: 620, y: 920 }, ['hc_mana_1', 'hc_mana_3'], { mana: 80, maxMana: 80, intelligence: 20 }),
    minor('hc_mana_1b', 'Mental Clarity', '+50 Mana, +0.5% Regen', '🧠', { x: 780, y: 920 }, ['hc_mana_1', 'hc_mana_3b'], { mana: 50, maxMana: 50, manaRegeneration: 0.5 }),
    minor('hc_mana_3', 'Deep Wells', '+100 Mana', '🌊', { x: 580, y: 840 }, ['hc_mana_2', 'hc_mana_notable1'], { mana: 100, maxMana: 100 }),
    minor('hc_mana_3b', 'Meditation', '+1.5% Mana Regen', '🧘', { x: 820, y: 840 }, ['hc_mana_1b', 'hc_mana_notable1b'], { manaRegeneration: 1.5 }),
    
    notable('hc_mana_notable1', 'Infinite Wellspring', '+120 Mana. 15% reduced Mana costs.', '⛲', 
      { x: 580, y: 760 }, ['hc_mana_3', 'hc_mana_4', 'hc_mana_5'], { mana: 120, maxMana: 120 }, [{ type: 'manaCostReduction', value: 15 }], '#FFD700'),
    notable('hc_mana_notable1b', 'Boundless Spirit', '+2% Mana Regen. +10% Healing.', '✨', 
      { x: 820, y: 760 }, ['hc_mana_3b', 'hc_mana_5b'], { manaRegeneration: 2 }, [{ type: 'healingMultiplier', value: 10 }], '#FFD700'),
    
    minor('hc_mana_4', 'Efficient Casting', '10% Reduced Mana Cost', '💎', { x: 500, y: 680 }, ['hc_mana_notable1', 'hc_mana_keystone'], {}, [{ type: 'manaCostReduction', value: 10 }]),
    minor('hc_mana_5', 'Arcane Reserve', '+80 Mana, +30 Int', '📚', { x: 660, y: 680 }, ['hc_mana_notable1', 'hc_mana_keystone'], { mana: 80, maxMana: 80, intelligence: 30 }),
    minor('hc_mana_5b', 'Spiritual Link', '+60 Mana, +1% Regen', '🔗', { x: 820, y: 680 }, ['hc_mana_notable1b', 'hc_mana_keystone'], { mana: 60, maxMana: 60, manaRegeneration: 1 }),
    minor('hc_mana_6', 'Focused Mind', '+10% CDR', '🎯', { x: 580, y: 600 }, ['hc_mana_4', 'hc_mana_5', 'hc_mana_keystone'], {}, [{ type: 'cooldownReduction', value: 10 }]),
    
    keystone('hc_mana_keystone', 'Divine Font', '+200 Mana. 3% Mana Regen. Healing costs 25% less.', '⛲', 
      { x: 660, y: 500 }, ['hc_mana_4', 'hc_mana_5', 'hc_mana_5b', 'hc_mana_6', 'hc_mastery_center'], { mana: 200, maxMana: 200, manaRegeneration: 3 }, [{ type: 'manaCostReduction', value: 25 }], '#FFD700'),
    
    // Cooldown Sub-branch
    minor('hc_cdr_1', 'Quick Recovery', '+5% CDR', '⏱️', { x: 700, y: 420 }, ['hc_mana_keystone', 'hc_cdr_2'], {}, [{ type: 'cooldownReduction', value: 5 }]),
    minor('hc_cdr_2', 'Haste', '+8% CDR, +5% Cast Speed', '⚡', { x: 720, y: 340 }, ['hc_cdr_1', 'hc_cdr_notable'], {}, [{ type: 'cooldownReduction', value: 8 }, { type: 'castSpeed', value: 5 }]),
    notable('hc_cdr_notable', 'Perfect Timing', '+15% CDR. First heal each combat is instant.', '⏳', 
      { x: 760, y: 260 }, ['hc_cdr_2', 'hc_mastery_center'], {}, [{ type: 'cooldownReduction', value: 15 }], '#FFD700'),
    
    // === RIGHT BRANCH: HOLY POWER ===
    minor('hc_holy_1', 'Holy Light', '+10% Holy Damage', '☀️', { x: 900, y: 1020 }, ['hc_start', 'hc_holy_2'], {}, [{ type: 'bonusFire', value: 10 }]),
    minor('hc_holy_2', 'Radiance', '+12% Holy Damage, +8% Healing', '🌞', { x: 1000, y: 950 }, ['hc_holy_1', 'hc_holy_3', 'hc_holy_2b'], {}, [{ type: 'bonusFire', value: 12 }, { type: 'healingMultiplier', value: 8 }]),
    minor('hc_holy_3', 'Blazing Faith', '+15% Holy Damage', '🔥', { x: 1100, y: 880 }, ['hc_holy_2', 'hc_holy_notable1'], {}, [{ type: 'bonusFire', value: 15 }]),
    minor('hc_holy_2b', 'Warm Light', '+8% Holy, +50 Life', '🕯️', { x: 950, y: 880 }, ['hc_holy_2', 'hc_holy_notable1'], { life: 50, maxLife: 50 }, [{ type: 'bonusFire', value: 8 }]),
    
    notable('hc_holy_notable1', 'Divine Radiance', '+25% Holy Damage. Damage heals nearby allies for 10%.', '💥', 
      { x: 1100, y: 800 }, ['hc_holy_3', 'hc_holy_2b', 'hc_holy_4', 'hc_holy_5'], {}, [{ type: 'bonusFire', value: 25 }, { type: 'healingMultiplier', value: 10 }], '#FFD700'),
    
    minor('hc_holy_4', 'Smite', '+15% Holy Damage', '⚔️', { x: 1180, y: 720 }, ['hc_holy_notable1', 'hc_holy_keystone'], {}, [{ type: 'bonusFire', value: 15 }]),
    minor('hc_holy_5', 'Righteous Fury', '+10% Holy, +10% Crit', '💢', { x: 1050, y: 720 }, ['hc_holy_notable1', 'hc_holy_keystone'], {}, [{ type: 'bonusFire', value: 10 }, { type: 'critChance', value: 10 }]),
    minor('hc_holy_6', 'Divine Wrath', '+12% Holy, +15% Crit Multi', '🌟', { x: 1120, y: 640 }, ['hc_holy_4', 'hc_holy_5', 'hc_holy_keystone'], {}, [{ type: 'bonusFire', value: 12 }, { type: 'critMultiplier', value: 15 }]),
    
    keystone('hc_holy_keystone', 'Avatar of Light', 'Your Healing also deals damage to enemies. +25% to both.', '⚡', 
      { x: 1150, y: 540 }, ['hc_holy_4', 'hc_holy_5', 'hc_holy_6', 'hc_mastery_right'], {}, [{ type: 'healingMultiplier', value: 25 }, { type: 'damageMultiplier', value: 25 }], '#FFD700'),
    
    // Smiting Sub-branch
    minor('hc_smite_1', 'Holy Fire', '+10% Fire Damage', '🔥', { x: 1250, y: 480 }, ['hc_holy_keystone', 'hc_smite_2'], {}, [{ type: 'bonusFire', value: 10 }]),
    minor('hc_smite_2', 'Purifying Flames', '+15% Fire, Burn enemies', '🌋', { x: 1250, y: 400 }, ['hc_smite_1', 'hc_smite_notable'], {}, [{ type: 'bonusFire', value: 15 }, { type: 'igniteChance', value: 20 }]),
    notable('hc_smite_notable', 'Wrath of Heaven', '+30% Holy Damage. Burning enemies take 20% more healing from you.', '💀', 
      { x: 1200, y: 320 }, ['hc_smite_2', 'hc_mastery_right'], {}, [{ type: 'bonusFire', value: 30 }], '#FFD700'),
    
    // Protection Sub-branch
    minor('hc_protect_1', 'Divine Shield', '+50 Armor, +10% Healing', '🛡️', { x: 980, y: 500 }, ['hc_holy_keystone', 'hc_protect_2'], { armor: 50 }, [{ type: 'healingMultiplier', value: 10 }]),
    minor('hc_protect_2', 'Holy Armor', '+80 Armor, +5% Block', '⚔️', { x: 950, y: 420 }, ['hc_protect_1', 'hc_protect_notable'], { armor: 80 }, [{ type: 'blockChance', value: 5 }]),
    notable('hc_protect_notable', 'Guardian Angel', '+100 Armor. Healed allies gain 50 Armor for 3s.', '👼', 
      { x: 900, y: 340 }, ['hc_protect_2', 'hc_mastery_right'], { armor: 100 }, [], '#FFD700'),
    
    // === MASTERY NODES ===
    mastery('hc_mastery_left', 'Miracle Worker', 'Healing an ally below 30% Life heals for 50% more.', '✨', 
      { x: 150, y: 240 }, ['hc_heal_keystone', 'hc_emergency_notable', 'hc_apex'], {}, [{ type: 'healingMultiplier', value: 50 }], '#FFD700'),
    mastery('hc_mastery_center', 'Endless Devotion', 'Casting heals restores 3% Mana.', '♾️', 
      { x: 660, y: 180 }, ['hc_mana_keystone', 'hc_cdr_notable', 'hc_apex'], {}, [{ type: 'resourceGeneration', value: 3 }], '#FFD700'),
    mastery('hc_mastery_right', 'Holy Nova', 'Your heals explode, healing all nearby allies for 30%.', '💫', 
      { x: 1050, y: 200 }, ['hc_holy_keystone', 'hc_smite_notable', 'hc_protect_notable', 'hc_apex'], {}, [{ type: 'aoeRadius', value: 50 }], '#FFD700'),
    
    keystone('hc_apex', 'The High Cleric', '+50% Healing. Allies you heal gain 8% damage reduction for 3s.', '👑', 
      { x: 700, y: 80 }, ['hc_mastery_left', 'hc_mastery_center', 'hc_mastery_right'], { mana: 150, maxMana: 150, intelligence: 40 }, [{ type: 'healingMultiplier', value: 50 }], '#FFD700'),
  ]
};

// ==================== BLOOD CONFESSOR ====================
// Theme: Life-Cost Healer - Blood Magic, Sacrifice, Power
// Colors: Dark Red (#8B0000)

const BLOOD_CONFESSOR_TREE: ClassPassiveTree = {
  classId: 'blood_confessor',
  startingNodeId: 'bc_start',
  maxPoints: 50,
  treeWidth: 1200,
  treeHeight: 1000,
  backgroundColor: '#0d0505',
  connectionColor: '#DC143C',
  nodes: [
    start('bc_start', 'Blood Pact', 'Your life is your power.', '🩸', 
      { x: 600, y: 900 }, ['bc_blood_1', 'bc_life_1', 'bc_power_1'], { life: 80, maxLife: 80 }),
    
    // BLOOD MAGIC
    minor('bc_blood_1', 'Crimson Arts', '+10% Healing, Life cost -10%', '💉', { x: 400, y: 820 }, ['bc_start', 'bc_blood_2'], {}, [{ type: 'healingMultiplier', value: 10 }, { type: 'lifeCostReduction', value: 10 }]),
    minor('bc_blood_2', 'Sanguine Power', '+15% Healing from Life costs', '🩸', { x: 320, y: 750 }, ['bc_blood_1', 'bc_blood_notable'], {}, [{ type: 'healingMultiplier', value: 15 }]),
    notable('bc_blood_notable', 'Blood Sacrifice', '+30% Healing. Skills cost 20% less Life.', '⚰️', 
      { x: 240, y: 680 }, ['bc_blood_2', 'bc_blood_keystone'], {}, [{ type: 'healingMultiplier', value: 30 }, { type: 'lifeCostReduction', value: 20 }], '#DC143C'),
    keystone('bc_blood_keystone', 'Crimson Covenant', 'Skills cost Life instead of Mana. +50% Healing.', '📜', 
      { x: 160, y: 560 }, ['bc_blood_notable', 'bc_mastery_left'], {}, [{ type: 'lifeCostConversion', value: 100 }, { type: 'healingMultiplier', value: 50 }], '#DC143C'),
    
    // LIFE POOL
    minor('bc_life_1', 'Vitality', '+100 Life', '❤️', { x: 600, y: 800 }, ['bc_start', 'bc_life_2'], { life: 100, maxLife: 100 }),
    minor('bc_life_2', 'Endurance', '+150 Life, +2% Life Regen', '💪', { x: 600, y: 700 }, ['bc_life_1', 'bc_life_notable'], { life: 150, maxLife: 150, lifeRegeneration: 2 }),
    notable('bc_life_notable', 'Immortal Blood', '+200 Life. 3% Life Regen. Life Leech is doubled.', '🧛', 
      { x: 600, y: 600 }, ['bc_life_2', 'bc_life_keystone'], { life: 200, maxLife: 200, lifeRegeneration: 3 }, [{ type: 'lifesteal', value: 100 }], '#DC143C'),
    keystone('bc_life_keystone', 'Undying', '+300 Life. Cannot die while above 50% Life.', '💀', 
      { x: 600, y: 480 }, ['bc_life_notable', 'bc_mastery_center'], { life: 300, maxLife: 300 }, [], '#DC143C'),
    
    // POWER
    minor('bc_power_1', 'Dark Power', '+10% Damage', '⚫', { x: 800, y: 820 }, ['bc_start', 'bc_power_2'], {}, [{ type: 'damageMultiplier', value: 10 }]),
    minor('bc_power_2', 'Blood Fury', '+15% Damage, +5% Life Leech', '🔥', { x: 880, y: 750 }, ['bc_power_1', 'bc_power_notable'], {}, [{ type: 'damageMultiplier', value: 15 }, { type: 'lifesteal', value: 5 }]),
    notable('bc_power_notable', 'Sanguine Strike', '+25% Damage. Damage heals you for 10%.', '⚔️', 
      { x: 960, y: 680 }, ['bc_power_2', 'bc_power_keystone'], {}, [{ type: 'damageMultiplier', value: 25 }, { type: 'lifesteal', value: 10 }], '#DC143C'),
    keystone('bc_power_keystone', 'Blood Lord', '+40% Damage. Your Life becomes your Mana pool.', '👑', 
      { x: 1000, y: 560 }, ['bc_power_notable', 'bc_mastery_right'], {}, [{ type: 'damageMultiplier', value: 40 }], '#DC143C'),
    
    // MASTERY
    mastery('bc_mastery_left', 'Transfusion', 'When you heal allies, you heal for 20% of amount.', '💕', 
      { x: 200, y: 460 }, ['bc_blood_keystone', 'bc_apex'], {}, [{ type: 'healingReceived', value: 20 }], '#DC143C'),
    mastery('bc_mastery_center', 'Eternal Hunger', 'Life Leech has no cap. Overhealing becomes ES.', '🧛', 
      { x: 600, y: 380 }, ['bc_life_keystone', 'bc_apex'], {}, [{ type: 'overhealing', value: 100 }], '#DC143C'),
    mastery('bc_mastery_right', 'Avatar of Blood', 'Deal 1% more damage per 1% missing Life.', '💢', 
      { x: 900, y: 460 }, ['bc_power_keystone', 'bc_apex'], {}, [{ type: 'damageOnLowLife', value: 100 }], '#DC143C'),
    keystone('bc_apex', 'The Blood Confessor', 'You share Life with your party. All healing is shared equally.', '👑', 
      { x: 600, y: 200 }, ['bc_mastery_left', 'bc_mastery_center', 'bc_mastery_right'], { life: 200, maxLife: 200 }, [{ type: 'healingMultiplier', value: 30 }], '#DC143C'),
  ]
};

// Continue with more healer trees...
// Simplified versions for remaining trees

const TACTICIAN_TREE: ClassPassiveTree = {
  classId: 'tactician',
  startingNodeId: 'ta_start',
  maxPoints: 50,
  treeWidth: 1200,
  treeHeight: 1000,
  backgroundColor: '#08080d',
  connectionColor: '#4169E1',
  nodes: [
    start('ta_start', 'Strategic Mind', 'Knowledge is the greatest weapon.', '📖', 
      { x: 600, y: 900 }, ['ta_cooldown_1', 'ta_buff_1', 'ta_debuff_1'], { mana: 60, intelligence: 15 }),
    minor('ta_cooldown_1', 'Efficiency', '5% Cooldown Reduction', '⏱️', { x: 400, y: 820 }, ['ta_start', 'ta_cooldown_2'], {}, [{ type: 'cooldownReduction', value: 5 }]),
    minor('ta_cooldown_2', 'Haste', '8% Cooldown Reduction', '⚡', { x: 320, y: 750 }, ['ta_cooldown_1', 'ta_cooldown_notable'], {}, [{ type: 'cooldownReduction', value: 8 }]),
    notable('ta_cooldown_notable', 'Time Warp', '15% Cooldown Reduction. Skills refresh 10% faster.', '⏳', 
      { x: 240, y: 680 }, ['ta_cooldown_2', 'ta_keystone_1'], {}, [{ type: 'cooldownReduction', value: 15 }], '#4169E1'),
    keystone('ta_keystone_1', 'Infinite Preparation', '25% CDR. First use of each skill per combat is instant.', '♾️', 
      { x: 160, y: 560 }, ['ta_cooldown_notable', 'ta_mastery'], {}, [{ type: 'cooldownReduction', value: 25 }], '#4169E1'),
    minor('ta_buff_1', 'Inspire', '+10% Aura Effect', '📢', { x: 600, y: 800 }, ['ta_start', 'ta_buff_2'], {}, [{ type: 'auraEffect', value: 10 }]),
    minor('ta_buff_2', 'Rally', '+15% Aura Effect, +10% Healing', '🚩', { x: 600, y: 700 }, ['ta_buff_1', 'ta_buff_notable'], {}, [{ type: 'auraEffect', value: 15 }, { type: 'healingMultiplier', value: 10 }]),
    notable('ta_buff_notable', 'Commander', '+25% Aura Effect. Allies deal 5% more damage.', '⭐', 
      { x: 600, y: 600 }, ['ta_buff_2', 'ta_keystone_2'], {}, [{ type: 'auraEffect', value: 25 }], '#4169E1'),
    keystone('ta_keystone_2', 'Warlord', 'Your Auras affect double the area. +20% Aura Effect.', '👑', 
      { x: 600, y: 480 }, ['ta_buff_notable', 'ta_mastery'], {}, [{ type: 'auraEffect', value: 20 }, { type: 'aoeRadius', value: 100 }], '#4169E1'),
    minor('ta_debuff_1', 'Weaken', '+10% Curse Effect', '☠️', { x: 800, y: 820 }, ['ta_start', 'ta_debuff_notable'], {}, [{ type: 'curseEffect', value: 10 }]),
    notable('ta_debuff_notable', 'Cripple', '+25% Curse Effect. Cursed enemies deal 10% less.', '💀', 
      { x: 960, y: 680 }, ['ta_debuff_1', 'ta_keystone_2'], {}, [{ type: 'curseEffect', value: 25 }], '#4169E1'),
    mastery('ta_mastery', 'Supreme Tactician', 'Allies in Auras gain 10% CDR and 10% more Healing.', '🎖️', 
      { x: 400, y: 400 }, ['ta_keystone_1', 'ta_keystone_2', 'ta_apex'], {}, [{ type: 'cooldownReduction', value: 10 }, { type: 'healingMultiplier', value: 10 }], '#4169E1'),
    keystone('ta_apex', 'The Tactician', 'Your strategies are flawless. +30% CDR, +30% Aura Effect.', '👑', 
      { x: 600, y: 200 }, ['ta_mastery'], { mana: 100, intelligence: 30 }, [{ type: 'cooldownReduction', value: 30 }, { type: 'auraEffect', value: 30 }], '#4169E1'),
  ]
};


// ==================== GROVE HEALER ====================
// Theme: Nature Healer - HoTs, Nature Damage, Regeneration
// Colors: Forest Green (#228B22)

const GROVE_HEALER_TREE: ClassPassiveTree = {
  classId: 'grove_healer',
  startingNodeId: 'gh_start',
  maxPoints: 50,
  treeWidth: 1200,
  treeHeight: 1000,
  backgroundColor: '#050d05',
  connectionColor: '#228B22',
  nodes: [
    start('gh_start', 'Nature\'s Embrace', 'The forest welcomes you.', '🌿', 
      { x: 600, y: 900 }, ['gh_hot_1', 'gh_nature_1', 'gh_regen_1'], { mana: 40, life: 40, maxLife: 40 }),
    
    // HOT PATH
    minor('gh_hot_1', 'Rejuvenation', '+10% HoT Effectiveness', '🌱', { x: 400, y: 820 }, ['gh_start', 'gh_hot_2'], {}, [{ type: 'hotEffectiveness', value: 10 }]),
    minor('gh_hot_2', 'Flourish', '+15% HoT Effect, +5% Healing', '🌸', { x: 320, y: 750 }, ['gh_hot_1', 'gh_hot_notable'], {}, [{ type: 'hotEffectiveness', value: 15 }, { type: 'healingMultiplier', value: 5 }]),
    notable('gh_hot_notable', 'Wild Growth', '+25% HoT Effect. HoTs can stack.', '🌳', 
      { x: 240, y: 680 }, ['gh_hot_2', 'gh_hot_keystone'], {}, [{ type: 'hotEffectiveness', value: 25 }], '#228B22'),
    minor('gh_hot_3', 'Bloom', '+20% HoT Effect', '🌺', { x: 160, y: 600 }, ['gh_hot_notable', 'gh_hot_keystone'], {}, [{ type: 'hotEffectiveness', value: 20 }]),
    keystone('gh_hot_keystone', 'Eternal Spring', 'HoTs last 50% longer. +30% HoT Effect.', '🌻', 
      { x: 120, y: 480 }, ['gh_hot_3', 'gh_mastery_left'], {}, [{ type: 'hotEffectiveness', value: 30 }, { type: 'skillDuration', value: 50 }], '#228B22'),
    
    // NATURE DAMAGE
    minor('gh_nature_1', 'Thorns', '+10% Nature Damage', '🌵', { x: 600, y: 800 }, ['gh_start', 'gh_nature_2'], {}, [{ type: 'bonusChaos', value: 10 }]),
    minor('gh_nature_2', 'Poison Ivy', '+15% Nature, 10% Poison Chance', '☠️', { x: 600, y: 700 }, ['gh_nature_1', 'gh_nature_notable'], {}, [{ type: 'bonusChaos', value: 15 }, { type: 'poisonChance', value: 10 }]),
    notable('gh_nature_notable', 'Wrath of Nature', '+25% Nature Damage. Poisoned enemies heal allies near them.', '🌪️', 
      { x: 600, y: 600 }, ['gh_nature_2', 'gh_nature_keystone'], {}, [{ type: 'bonusChaos', value: 25 }, { type: 'poisonChance', value: 20 }], '#228B22'),
    keystone('gh_nature_keystone', 'Avatar of Nature', 'Your damage heals allies for 20% of damage dealt.', '🌲', 
      { x: 600, y: 480 }, ['gh_nature_notable', 'gh_mastery_center'], {}, [{ type: 'healingMultiplier', value: 20 }], '#228B22'),
    
    // REGENERATION
    minor('gh_regen_1', 'Life Force', '+1% Life Regen, +50 Life', '💚', { x: 800, y: 820 }, ['gh_start', 'gh_regen_2'], { life: 50, maxLife: 50, lifeRegeneration: 1 }),
    minor('gh_regen_2', 'Renewal', '+1.5% Life Regen, +10% Healing', '🔄', { x: 880, y: 750 }, ['gh_regen_1', 'gh_regen_notable'], { lifeRegeneration: 1.5 }, [{ type: 'healingMultiplier', value: 10 }]),
    notable('gh_regen_notable', 'Cycle of Life', '+2% Life Regen. Regen affects nearby allies.', '♻️', 
      { x: 960, y: 680 }, ['gh_regen_2', 'gh_regen_keystone'], { lifeRegeneration: 2 }, [{ type: 'aoeRadius', value: 30 }], '#228B22'),
    keystone('gh_regen_keystone', 'Nature\'s Blessing', '+3% Life Regen. Cannot be reduced below 1% Regen.', '🌈', 
      { x: 1000, y: 560 }, ['gh_regen_notable', 'gh_mastery_right'], { lifeRegeneration: 3 }, [], '#228B22'),
    
    // MASTERY
    mastery('gh_mastery_left', 'Evergreen', 'HoTs refresh when they would expire on low health allies.', '🌲', 
      { x: 200, y: 380 }, ['gh_hot_keystone', 'gh_apex'], {}, [{ type: 'hotEffectiveness', value: 20 }], '#228B22'),
    mastery('gh_mastery_center', 'Photosynthesis', 'Standing still increases healing by 5% per second.', '☀️', 
      { x: 600, y: 380 }, ['gh_nature_keystone', 'gh_apex'], {}, [{ type: 'consecration', value: 5 }], '#228B22'),
    mastery('gh_mastery_right', 'Verdant Shield', 'Allies with HoTs take 10% less damage.', '🛡️', 
      { x: 900, y: 460 }, ['gh_regen_keystone', 'gh_apex'], {}, [{ type: 'damageReduction', value: 10 }], '#228B22'),
    keystone('gh_apex', 'The Grove Healer', 'Your HoTs can critically heal. +40% HoT Effect, +20% Healing.', '👑', 
      { x: 600, y: 200 }, ['gh_mastery_left', 'gh_mastery_center', 'gh_mastery_right'], { life: 100, maxLife: 100 }, [{ type: 'hotEffectiveness', value: 40 }, { type: 'healingMultiplier', value: 20 }], '#228B22'),
  ]
};

// ==================== VITALIST ====================
// Theme: Life Force Healer - Direct Heals, Life Transfer, Empowerment
// Colors: Coral (#FF6347)

const VITALIST_TREE: ClassPassiveTree = {
  classId: 'vitalist',
  startingNodeId: 'vi_start',
  maxPoints: 50,
  treeWidth: 1200,
  treeHeight: 1000,
  backgroundColor: '#0d0805',
  connectionColor: '#FF6347',
  nodes: [
    start('vi_start', 'Life Conduit', 'You are a vessel for vital energy.', '💖', 
      { x: 600, y: 900 }, ['vi_heal_1', 'vi_transfer_1', 'vi_empower_1'], { life: 60, maxLife: 60, mana: 30 }),
    
    // HEALING
    minor('vi_heal_1', 'Vital Touch', '+12% Healing', '🙌', { x: 400, y: 820 }, ['vi_start', 'vi_heal_2'], {}, [{ type: 'healingMultiplier', value: 12 }]),
    minor('vi_heal_2', 'Life Surge', '+15% Healing, +5% Cast Speed', '💫', { x: 320, y: 750 }, ['vi_heal_1', 'vi_heal_notable'], {}, [{ type: 'healingMultiplier', value: 15 }, { type: 'castSpeed', value: 5 }]),
    notable('vi_heal_notable', 'Vital Infusion', '+25% Healing. Heals grant 2% damage buff for 5s.', '✨', 
      { x: 240, y: 680 }, ['vi_heal_2', 'vi_heal_keystone'], {}, [{ type: 'healingMultiplier', value: 25 }], '#FF6347'),
    keystone('vi_heal_keystone', 'Lifebringer', '+40% Healing. Heals can overheal to create shield.', '👼', 
      { x: 160, y: 560 }, ['vi_heal_notable', 'vi_mastery_left'], {}, [{ type: 'healingMultiplier', value: 40 }, { type: 'overhealing', value: 100 }], '#FF6347'),
    
    // TRANSFER
    minor('vi_transfer_1', 'Share Life', '+80 Life, +10% Healing Received', '❤️', { x: 600, y: 800 }, ['vi_start', 'vi_transfer_2'], { life: 80, maxLife: 80 }, [{ type: 'healingReceived', value: 10 }]),
    minor('vi_transfer_2', 'Vitality Link', '+100 Life, +15% Healing', '🔗', { x: 600, y: 700 }, ['vi_transfer_1', 'vi_transfer_notable'], { life: 100, maxLife: 100 }, [{ type: 'healingMultiplier', value: 15 }]),
    notable('vi_transfer_notable', 'Life Bond', 'Take 10% of ally damage. Heal allies for 5% of your Life Regen.', '💕', 
      { x: 600, y: 600 }, ['vi_transfer_2', 'vi_transfer_keystone'], { life: 50, maxLife: 50 }, [{ type: 'damageRedirection', value: 10 }], '#FF6347'),
    keystone('vi_transfer_keystone', 'Life Nexus', 'Share 20% of healing you receive with lowest health ally.', '🌟', 
      { x: 600, y: 480 }, ['vi_transfer_notable', 'vi_mastery_center'], {}, [{ type: 'healingMultiplier', value: 20 }], '#FF6347'),
    
    // EMPOWERMENT
    minor('vi_empower_1', 'Inspire', 'Healed allies deal 5% more damage', '📢', { x: 800, y: 820 }, ['vi_start', 'vi_empower_2'], {}, [{ type: 'auraEffect', value: 5 }]),
    minor('vi_empower_2', 'Invigorate', 'Healed allies gain 5% attack speed', '⚡', { x: 880, y: 750 }, ['vi_empower_1', 'vi_empower_notable'], {}, [{ type: 'auraEffect', value: 8 }]),
    notable('vi_empower_notable', 'Surge of Life', 'Critically healing grants ally 15% more damage for 3s.', '💪', 
      { x: 960, y: 680 }, ['vi_empower_2', 'vi_empower_keystone'], {}, [{ type: 'auraEffect', value: 15 }], '#FF6347'),
    keystone('vi_empower_keystone', 'Avatar of Vitality', 'Healed allies are immune to damage for 0.5s.', '🛡️', 
      { x: 1000, y: 560 }, ['vi_empower_notable', 'vi_mastery_right'], {}, [], '#FF6347'),
    
    // MASTERY
    mastery('vi_mastery_left', 'Endless Vitality', 'Your healing cannot be reduced. +20% Healing.', '♾️', 
      { x: 200, y: 460 }, ['vi_heal_keystone', 'vi_apex'], {}, [{ type: 'healingMultiplier', value: 20 }], '#FF6347'),
    mastery('vi_mastery_center', 'Perfect Symbiosis', 'When you heal, you are healed for 10%.', '🤝', 
      { x: 600, y: 380 }, ['vi_transfer_keystone', 'vi_apex'], {}, [{ type: 'healingReceived', value: 10 }], '#FF6347'),
    mastery('vi_mastery_right', 'Ascendant', 'Healed allies gain 5% Life Regen for 5s.', '☀️', 
      { x: 900, y: 460 }, ['vi_empower_keystone', 'vi_apex'], {}, [], '#FF6347'),
    keystone('vi_apex', 'The Vitalist', 'Your Life is shared with your party. +300 Life, +50% Healing.', '👑', 
      { x: 600, y: 200 }, ['vi_mastery_left', 'vi_mastery_center', 'vi_mastery_right'], { life: 300, maxLife: 300 }, [{ type: 'healingMultiplier', value: 50 }], '#FF6347'),
  ]
};

// ==================== RITUAL WARDEN ====================
// Theme: Dark Ritualist - Blood Magic, Curses, Sacrifice
// Colors: Dark Violet (#9400D3)

const RITUAL_WARDEN_TREE: ClassPassiveTree = {
  classId: 'ritual_warden',
  startingNodeId: 'rw_start',
  maxPoints: 50,
  treeWidth: 1200,
  treeHeight: 1000,
  backgroundColor: '#080508',
  connectionColor: '#9400D3',
  nodes: [
    start('rw_start', 'Dark Initiate', 'The old ways hold power.', '🔮', 
      { x: 600, y: 900 }, ['rw_ritual_1', 'rw_curse_1', 'rw_blood_1'], { mana: 50, intelligence: 15 }),
    
    // RITUAL
    minor('rw_ritual_1', 'Ritual Focus', '+10% Healing, +10% Curse Effect', '🕯️', { x: 400, y: 820 }, ['rw_start', 'rw_ritual_2'], {}, [{ type: 'healingMultiplier', value: 10 }, { type: 'curseEffect', value: 10 }]),
    minor('rw_ritual_2', 'Dark Arts', '+15% Healing, +5% Damage', '📜', { x: 320, y: 750 }, ['rw_ritual_1', 'rw_ritual_notable'], {}, [{ type: 'healingMultiplier', value: 15 }, { type: 'damageMultiplier', value: 5 }]),
    notable('rw_ritual_notable', 'Forbidden Knowledge', '+25% Healing. Damage dealt heals lowest ally.', '📖', 
      { x: 240, y: 680 }, ['rw_ritual_2', 'rw_ritual_keystone'], {}, [{ type: 'healingMultiplier', value: 25 }], '#9400D3'),
    keystone('rw_ritual_keystone', 'Elder Ritual', 'Killing enemies heals all allies. +30% Healing.', '⚰️', 
      { x: 160, y: 560 }, ['rw_ritual_notable', 'rw_mastery_left'], {}, [{ type: 'healingMultiplier', value: 30 }], '#9400D3'),
    
    // CURSE
    minor('rw_curse_1', 'Hex', '+15% Curse Effect', '☠️', { x: 600, y: 800 }, ['rw_start', 'rw_curse_2'], {}, [{ type: 'curseEffect', value: 15 }]),
    minor('rw_curse_2', 'Blight', '+20% Curse Effect, +10% DoT', '💀', { x: 600, y: 700 }, ['rw_curse_1', 'rw_curse_notable'], {}, [{ type: 'curseEffect', value: 20 }, { type: 'dotDamage', value: 10 }]),
    notable('rw_curse_notable', 'Soul Drain', 'Cursed enemies heal you when damaged.', '👁️', 
      { x: 600, y: 600 }, ['rw_curse_2', 'rw_curse_keystone'], {}, [{ type: 'curseEffect', value: 25 }, { type: 'lifesteal', value: 5 }], '#9400D3'),
    keystone('rw_curse_keystone', 'Doom', 'Cursed enemies take 20% more damage from all sources.', '💢', 
      { x: 600, y: 480 }, ['rw_curse_notable', 'rw_mastery_center'], {}, [{ type: 'curseEffect', value: 30 }], '#9400D3'),
    
    // BLOOD
    minor('rw_blood_1', 'Blood Rite', '+60 Life, Skills can cost Life', '🩸', { x: 800, y: 820 }, ['rw_start', 'rw_blood_2'], { life: 60, maxLife: 60 }),
    minor('rw_blood_2', 'Sacrifice', '+80 Life, +15% Healing from Life cost', '⚔️', { x: 880, y: 750 }, ['rw_blood_1', 'rw_blood_notable'], { life: 80, maxLife: 80 }, [{ type: 'healingMultiplier', value: 15 }]),
    notable('rw_blood_notable', 'Dark Pact', 'Life costs are reduced 30%. +20% Healing.', '🖤', 
      { x: 960, y: 680 }, ['rw_blood_2', 'rw_blood_keystone'], {}, [{ type: 'lifeCostReduction', value: 30 }, { type: 'healingMultiplier', value: 20 }], '#9400D3'),
    keystone('rw_blood_keystone', 'Blood Magic', 'Mana is replaced by Life. +100 Life. +40% Healing.', '💉', 
      { x: 1000, y: 560 }, ['rw_blood_notable', 'rw_mastery_right'], { life: 100, maxLife: 100 }, [{ type: 'lifeCostConversion', value: 100 }, { type: 'healingMultiplier', value: 40 }], '#9400D3'),
    
    // MASTERY
    mastery('rw_mastery_left', 'Unholy Power', 'Rituals heal 50% more when you are on low life.', '⚡', 
      { x: 200, y: 460 }, ['rw_ritual_keystone', 'rw_apex'], {}, [{ type: 'damageOnLowLife', value: 50 }], '#9400D3'),
    mastery('rw_mastery_center', 'Spreading Corruption', 'Curses spread to nearby enemies.', '🌀', 
      { x: 600, y: 380 }, ['rw_curse_keystone', 'rw_apex'], {}, [{ type: 'aoeRadius', value: 50 }], '#9400D3'),
    mastery('rw_mastery_right', 'Immortal Coil', 'Cannot die from Life costs. +150 Life.', '♾️', 
      { x: 900, y: 460 }, ['rw_blood_keystone', 'rw_apex'], { life: 150, maxLife: 150 }, [], '#9400D3'),
    keystone('rw_apex', 'The Ritual Warden', 'Your rituals affect all allies. +40% Healing, +40% Curse Effect.', '👑', 
      { x: 600, y: 200 }, ['rw_mastery_left', 'rw_mastery_center', 'rw_mastery_right'], { life: 100, maxLife: 100, mana: 100 }, [{ type: 'healingMultiplier', value: 40 }, { type: 'curseEffect', value: 40 }], '#9400D3'),
  ]
};

// ==================== AEGIS KEEPER ====================
// Theme: Shield Healer - Barriers, Damage Prevention, Protection
// Colors: Steel Blue (#4682B4)

const AEGIS_KEEPER_TREE: ClassPassiveTree = {
  classId: 'aegis_keeper',
  startingNodeId: 'ak_start',
  maxPoints: 50,
  treeWidth: 1200,
  treeHeight: 1000,
  backgroundColor: '#050508',
  connectionColor: '#4682B4',
  nodes: [
    start('ak_start', 'Warden\'s Oath', 'Your shields protect the worthy.', '🛡️', 
      { x: 600, y: 900 }, ['ak_shield_1', 'ak_protect_1', 'ak_barrier_1'], { mana: 60, energyShield: 30 }),
    
    // SHIELDS
    minor('ak_shield_1', 'Ward', '+15% Shield Strength', '🔰', { x: 400, y: 820 }, ['ak_start', 'ak_shield_2'], {}, [{ type: 'shieldStrength', value: 15 }]),
    minor('ak_shield_2', 'Fortify', '+20% Shield Strength, +5% Healing', '🏰', { x: 320, y: 750 }, ['ak_shield_1', 'ak_shield_notable'], {}, [{ type: 'shieldStrength', value: 20 }, { type: 'healingMultiplier', value: 5 }]),
    notable('ak_shield_notable', 'Impenetrable', '+30% Shield Strength. Shields absorb 20% more.', '💠', 
      { x: 240, y: 680 }, ['ak_shield_2', 'ak_shield_keystone'], {}, [{ type: 'shieldStrength', value: 30 }], '#4682B4'),
    keystone('ak_shield_keystone', 'Absolute Barrier', '+50% Shield Strength. Shields cannot be bypassed.', '🌟', 
      { x: 160, y: 560 }, ['ak_shield_notable', 'ak_mastery_left'], {}, [{ type: 'shieldStrength', value: 50 }], '#4682B4'),
    
    // PROTECTION
    minor('ak_protect_1', 'Sanctuary', 'Allies take 3% less damage', '🏛️', { x: 600, y: 800 }, ['ak_start', 'ak_protect_2'], {}, [{ type: 'damageReduction', value: 3 }]),
    minor('ak_protect_2', 'Divine Protection', 'Allies take 5% less, +10% Healing', '✨', { x: 600, y: 700 }, ['ak_protect_1', 'ak_protect_notable'], {}, [{ type: 'damageReduction', value: 5 }, { type: 'healingMultiplier', value: 10 }]),
    notable('ak_protect_notable', 'Guardian Aura', 'Nearby allies take 10% less damage.', '👼', 
      { x: 600, y: 600 }, ['ak_protect_2', 'ak_protect_keystone'], {}, [{ type: 'damageReduction', value: 10 }, { type: 'aoeRadius', value: 30 }], '#4682B4'),
    keystone('ak_protect_keystone', 'Invincibility', 'Shield targets become immune for 0.5s. +20% Healing.', '⭐', 
      { x: 600, y: 480 }, ['ak_protect_notable', 'ak_mastery_center'], {}, [{ type: 'healingMultiplier', value: 20 }], '#4682B4'),
    
    // BARRIER
    minor('ak_barrier_1', 'Energy Infusion', '+50 ES, +10% ES Recharge', '💙', { x: 800, y: 820 }, ['ak_start', 'ak_barrier_2'], { energyShield: 50 }, [{ type: 'esRechargeRate', value: 10 }]),
    minor('ak_barrier_2', 'Arcane Shield', '+80 ES, +15% Shield Strength', '🔮', { x: 880, y: 750 }, ['ak_barrier_1', 'ak_barrier_notable'], { energyShield: 80 }, [{ type: 'shieldStrength', value: 15 }]),
    notable('ak_barrier_notable', 'Mana Shield', 'Spend Mana to empower shields. +25% Shield Strength.', '🌀', 
      { x: 960, y: 680 }, ['ak_barrier_2', 'ak_barrier_keystone'], {}, [{ type: 'shieldStrength', value: 25 }], '#4682B4'),
    keystone('ak_barrier_keystone', 'Aegis Perfection', 'Shields restore 2% Mana when they expire. +40% Strength.', '💎', 
      { x: 1000, y: 560 }, ['ak_barrier_notable', 'ak_mastery_right'], {}, [{ type: 'shieldStrength', value: 40 }, { type: 'resourceGeneration', value: 2 }], '#4682B4'),
    
    // MASTERY
    mastery('ak_mastery_left', 'Unbreakable Will', 'Shields persist through death.', '♾️', 
      { x: 200, y: 460 }, ['ak_shield_keystone', 'ak_apex'], {}, [{ type: 'shieldStrength', value: 20 }], '#4682B4'),
    mastery('ak_mastery_center', 'Mass Shield', 'Single target shields also apply to 2 nearby allies.', '👥', 
      { x: 600, y: 380 }, ['ak_protect_keystone', 'ak_apex'], {}, [{ type: 'aoeRadius', value: 30 }], '#4682B4'),
    mastery('ak_mastery_right', 'Eternal Aegis', 'Shields decay 50% slower.', '⏳', 
      { x: 900, y: 460 }, ['ak_barrier_keystone', 'ak_apex'], {}, [{ type: 'skillDuration', value: 50 }], '#4682B4'),
    keystone('ak_apex', 'The Aegis Keeper', '+60% Shield Strength. Overhealing becomes Shield.', '👑', 
      { x: 600, y: 200 }, ['ak_mastery_left', 'ak_mastery_center', 'ak_mastery_right'], { energyShield: 100, mana: 100 }, [{ type: 'shieldStrength', value: 60 }, { type: 'overhealing', value: 100 }], '#4682B4'),
  ]
};

// ==================== MARTYR ====================
// Theme: Self-Sacrifice Healer - Damage Redirect, Self-Harm Healing
// Colors: Saddle Brown (#8B4513)

const MARTYR_TREE: ClassPassiveTree = {
  classId: 'martyr',
  startingNodeId: 'ma_start',
  maxPoints: 50,
  treeWidth: 1200,
  treeHeight: 1000,
  backgroundColor: '#0d0805',
  connectionColor: '#CD853F',
  nodes: [
    start('ma_start', 'Martyr\'s Vow', 'Your suffering is their salvation.', '✝️', 
      { x: 600, y: 900 }, ['ma_sacrifice_1', 'ma_redirect_1', 'ma_faith_1'], { life: 100, maxLife: 100, armor: 30 }),
    
    // SACRIFICE
    minor('ma_sacrifice_1', 'Selfless', '+15% Healing, +50 Life', '🙏', { x: 400, y: 820 }, ['ma_start', 'ma_sacrifice_2'], { life: 50, maxLife: 50 }, [{ type: 'healingMultiplier', value: 15 }]),
    minor('ma_sacrifice_2', 'Devotion', '+20% Healing from Self-Damage', '💔', { x: 320, y: 750 }, ['ma_sacrifice_1', 'ma_sacrifice_notable'], {}, [{ type: 'healingMultiplier', value: 20 }]),
    notable('ma_sacrifice_notable', 'Blood Price', 'Spend 10% Life to heal allies for 30% more.', '🩸', 
      { x: 240, y: 680 }, ['ma_sacrifice_2', 'ma_sacrifice_keystone'], {}, [{ type: 'healingMultiplier', value: 30 }], '#CD853F'),
    keystone('ma_sacrifice_keystone', 'Ultimate Sacrifice', 'When ally would die, sacrifice 50% of your Life to save them.', '💀', 
      { x: 160, y: 560 }, ['ma_sacrifice_notable', 'ma_mastery_left'], {}, [{ type: 'damageRedirection', value: 50 }], '#CD853F'),
    
    // REDIRECT
    minor('ma_redirect_1', 'Interpose', 'Redirect 5% of ally damage to self', '🛡️', { x: 600, y: 800 }, ['ma_start', 'ma_redirect_2'], {}, [{ type: 'damageRedirection', value: 5 }]),
    minor('ma_redirect_2', 'Guardian', 'Redirect 10%, +80 Armor', '⚔️', { x: 600, y: 700 }, ['ma_redirect_1', 'ma_redirect_notable'], { armor: 80 }, [{ type: 'damageRedirection', value: 10 }]),
    notable('ma_redirect_notable', 'Living Shield', 'Redirect 15%. Take 10% less redirected damage.', '🏰', 
      { x: 600, y: 600 }, ['ma_redirect_2', 'ma_redirect_keystone'], { armor: 100 }, [{ type: 'damageRedirection', value: 15 }, { type: 'damageReduction', value: 10 }], '#CD853F'),
    keystone('ma_redirect_keystone', 'Absolute Guardian', 'Redirect 25% of all ally damage. +200 Armor.', '👼', 
      { x: 600, y: 480 }, ['ma_redirect_notable', 'ma_mastery_center'], { armor: 200 }, [{ type: 'damageRedirection', value: 25 }], '#CD853F'),
    
    // FAITH
    minor('ma_faith_1', 'Holy Resilience', '+100 Life, +2% Life Regen', '❤️', { x: 800, y: 820 }, ['ma_start', 'ma_faith_2'], { life: 100, maxLife: 100, lifeRegeneration: 2 }),
    minor('ma_faith_2', 'Unwavering Faith', '+3% Life Regen, +20% Healing Received', '🌟', { x: 880, y: 750 }, ['ma_faith_1', 'ma_faith_notable'], { lifeRegeneration: 3 }, [{ type: 'healingReceived', value: 20 }]),
    notable('ma_faith_notable', 'Divine Fortitude', '+5% Life Regen. Cannot be reduced below 1 Life by ally damage.', '✨', 
      { x: 960, y: 680 }, ['ma_faith_2', 'ma_faith_keystone'], { lifeRegeneration: 5 }, [], '#CD853F'),
    keystone('ma_faith_keystone', 'Immortal Faith', 'Regen doubles when below 50% Life. +200 Life.', '⭐', 
      { x: 1000, y: 560 }, ['ma_faith_notable', 'ma_mastery_right'], { life: 200, maxLife: 200 }, [{ type: 'defenseOnLowLife', value: 100 }], '#CD853F'),
    
    // MASTERY
    mastery('ma_mastery_left', 'Endless Devotion', 'When you save an ally, heal for 20% of your Life.', '💕', 
      { x: 200, y: 460 }, ['ma_sacrifice_keystone', 'ma_apex'], {}, [{ type: 'healingReceived', value: 20 }], '#CD853F'),
    mastery('ma_mastery_center', 'Impenetrable Bond', 'Redirected damage heals you for 5%.', '🔗', 
      { x: 600, y: 380 }, ['ma_redirect_keystone', 'ma_apex'], {}, [{ type: 'lifesteal', value: 5 }], '#CD853F'),
    mastery('ma_mastery_right', 'Eternal Martyr', 'When you die, revive at 30% Life after 3s. Once per dungeon.', '☀️', 
      { x: 900, y: 460 }, ['ma_faith_keystone', 'ma_apex'], {}, [], '#CD853F'),
    keystone('ma_apex', 'The Martyr', 'Your pain is their healing. +50% Healing, +300 Life.', '👑', 
      { x: 600, y: 200 }, ['ma_mastery_left', 'ma_mastery_center', 'ma_mastery_right'], { life: 300, maxLife: 300, armor: 100 }, [{ type: 'healingMultiplier', value: 50 }], '#CD853F'),
  ]
};

// ==================== BASTION STRATEGIST ====================
// Theme: Defensive Support - Damage Reduction, Buffs, Tactics
// Colors: Slate Gray (#708090)

const BASTION_STRATEGIST_TREE: ClassPassiveTree = {
  classId: 'bastion_strategist',
  startingNodeId: 'bs_start',
  maxPoints: 50,
  treeWidth: 1200,
  treeHeight: 1000,
  backgroundColor: '#080808',
  connectionColor: '#778899',
  nodes: [
    start('bs_start', 'Strategic Foundation', 'Victory through preparation.', '📖', 
      { x: 600, y: 900 }, ['bs_defense_1', 'bs_buff_1', 'bs_tactical_1'], { mana: 50, armor: 30, life: 30, maxLife: 30 }),
    
    // DEFENSE
    minor('bs_defense_1', 'Fortification', 'Allies gain +50 Armor', '🏰', { x: 400, y: 820 }, ['bs_start', 'bs_defense_2'], { armor: 50 }, [{ type: 'auraEffect', value: 5 }]),
    minor('bs_defense_2', 'Barricade', 'Allies gain +80 Armor, +5% Damage Reduction', '🧱', { x: 320, y: 750 }, ['bs_defense_1', 'bs_defense_notable'], { armor: 80 }, [{ type: 'auraEffect', value: 10 }]),
    notable('bs_defense_notable', 'Iron Fortress', 'Allies gain +150 Armor. Your Armor aura affects +30% area.', '🏛️', 
      { x: 240, y: 680 }, ['bs_defense_2', 'bs_defense_keystone'], { armor: 100 }, [{ type: 'aoeRadius', value: 30 }], '#778899'),
    keystone('bs_defense_keystone', 'Invulnerable Formation', 'Allies in formation take 15% less damage.', '🛡️', 
      { x: 160, y: 560 }, ['bs_defense_notable', 'bs_mastery_left'], {}, [{ type: 'damageReduction', value: 15 }], '#778899'),
    
    // BUFFS
    minor('bs_buff_1', 'Rally Cry', '+10% Aura Effect', '📢', { x: 600, y: 800 }, ['bs_start', 'bs_buff_2'], {}, [{ type: 'auraEffect', value: 10 }]),
    minor('bs_buff_2', 'Inspire Greatness', '+15% Aura Effect, +5% CDR', '🚩', { x: 600, y: 700 }, ['bs_buff_1', 'bs_buff_notable'], {}, [{ type: 'auraEffect', value: 15 }, { type: 'cooldownReduction', value: 5 }]),
    notable('bs_buff_notable', 'Commander\'s Presence', '+25% Aura Effect. Allies deal 8% more damage.', '⭐', 
      { x: 600, y: 600 }, ['bs_buff_2', 'bs_buff_keystone'], {}, [{ type: 'auraEffect', value: 25 }], '#778899'),
    keystone('bs_buff_keystone', 'Supreme Commander', 'Your auras affect double area. +30% Aura Effect.', '👑', 
      { x: 600, y: 480 }, ['bs_buff_notable', 'bs_mastery_center'], {}, [{ type: 'auraEffect', value: 30 }, { type: 'aoeRadius', value: 100 }], '#778899'),
    
    // TACTICAL
    minor('bs_tactical_1', 'Tactical Mind', '+8% CDR, +10% Healing', '🧠', { x: 800, y: 820 }, ['bs_start', 'bs_tactical_2'], {}, [{ type: 'cooldownReduction', value: 8 }, { type: 'healingMultiplier', value: 10 }]),
    minor('bs_tactical_2', 'Prepared', '+12% CDR, +15% Healing', '📋', { x: 880, y: 750 }, ['bs_tactical_1', 'bs_tactical_notable'], {}, [{ type: 'cooldownReduction', value: 12 }, { type: 'healingMultiplier', value: 15 }]),
    notable('bs_tactical_notable', 'Master Strategist', '+20% CDR. First ability each combat is instant.', '♟️', 
      { x: 960, y: 680 }, ['bs_tactical_2', 'bs_tactical_keystone'], {}, [{ type: 'cooldownReduction', value: 20 }], '#778899'),
    keystone('bs_tactical_keystone', 'Perfect Timing', '+30% CDR. Abilities grant allies 5% damage for 3s.', '⏱️', 
      { x: 1000, y: 560 }, ['bs_tactical_notable', 'bs_mastery_right'], {}, [{ type: 'cooldownReduction', value: 30 }], '#778899'),
    
    // MASTERY
    mastery('bs_mastery_left', 'Impregnable', 'Damage reduction effects are 50% more effective.', '🏔️', 
      { x: 200, y: 460 }, ['bs_defense_keystone', 'bs_apex'], {}, [{ type: 'damageReduction', value: 25 }], '#778899'),
    mastery('bs_mastery_center', 'Overwhelming Force', 'Allies in auras deal 15% more damage.', '⚔️', 
      { x: 600, y: 380 }, ['bs_buff_keystone', 'bs_apex'], {}, [{ type: 'auraEffect', value: 15 }], '#778899'),
    mastery('bs_mastery_right', 'Absolute Preparation', 'All cooldowns reduced by 2s at combat start.', '⚡', 
      { x: 900, y: 460 }, ['bs_tactical_keystone', 'bs_apex'], {}, [{ type: 'cooldownReduction', value: 10 }], '#778899'),
    keystone('bs_apex', 'The Bastion Strategist', 'Your strategies are perfect. +40% Aura, +40% CDR.', '👑', 
      { x: 600, y: 200 }, ['bs_mastery_left', 'bs_mastery_center', 'bs_mastery_right'], { armor: 100, mana: 100, life: 100, maxLife: 100 }, [{ type: 'auraEffect', value: 40 }, { type: 'cooldownReduction', value: 40 }], '#778899'),
  ]
};

// ==================== TREE REGISTRY ====================

export const CLASS_PASSIVE_TREES: Record<CharacterClassId, ClassPassiveTree> = {
  // Tanks
  bastion_knight: BASTION_KNIGHT_TREE,
  wardbreaker: WARDBREAKER_TREE,
  iron_skirmisher: IRON_SKIRMISHER_TREE,
  duel_warden: DUEL_WARDEN_TREE,
  shadow_warden: SHADOW_WARDEN_TREE,
  ghostblade: GHOSTBLADE_TREE,
  arcane_bulwark: ARCANE_BULWARK_TREE,
  null_templar: NULL_TEMPLAR_TREE,
  phase_guardian: PHASE_GUARDIAN_TREE,
  // Healers
  high_cleric: HIGH_CLERIC_TREE,
  blood_confessor: BLOOD_CONFESSOR_TREE,
  tactician: TACTICIAN_TREE,
  grove_healer: GROVE_HEALER_TREE,
  vitalist: VITALIST_TREE,
  ritual_warden: RITUAL_WARDEN_TREE,
  aegis_keeper: AEGIS_KEEPER_TREE,
  martyr: MARTYR_TREE,
  bastion_strategist: BASTION_STRATEGIST_TREE,
};

// ==================== HELPER FUNCTIONS ====================

export function getPassiveTreeForClass(classId: CharacterClassId): ClassPassiveTree {
  return CLASS_PASSIVE_TREES[classId];
}

export function getPassiveNodeById(classId: CharacterClassId, nodeId: string): PassiveNode | undefined {
  const tree = CLASS_PASSIVE_TREES[classId];
  return tree?.nodes.find(n => n.id === nodeId);
}

export function calculatePassiveBonuses(
  classId: CharacterClassId,
  allocatedNodes: string[]
): { stats: Partial<BaseStats>; effects: PassiveEffect[] } {
  const stats: Partial<BaseStats> = {};
  const effects: PassiveEffect[] = [];
  
  allocatedNodes.forEach(nodeId => {
    const node = getPassiveNodeById(classId, nodeId);
    if (!node) return;
    
    Object.entries(node.statBonuses).forEach(([key, value]) => {
      const statKey = key as keyof BaseStats;
      stats[statKey] = ((stats[statKey] as number) || 0) + (value as number);
    });
    
    if (node.specialEffects) {
      effects.push(...node.specialEffects);
    }
  });
  
  return { stats, effects };
}

export function getTotalAllocatedPoints(
  classId: CharacterClassId,
  allocatedNodes: string[]
): number {
  let total = 0;
  allocatedNodes.forEach(nodeId => {
    const node = getPassiveNodeById(classId, nodeId);
    if (node) total += node.pointCost;
  });
  return total;
}

export function getAvailablePoints(
  classId: CharacterClassId,
  allocatedNodes: string[],
  characterLevel: number
): number {
  const tree = CLASS_PASSIVE_TREES[classId];
  const maxFromLevel = Math.min(characterLevel, tree.maxPoints);
  const used = getTotalAllocatedPoints(classId, allocatedNodes);
  return maxFromLevel - used;
}

export function getDefaultClassForRole(role: 'tank' | 'healer' | 'dps'): CharacterClassId {
  switch (role) {
    case 'tank': return 'bastion_knight';
    case 'healer': return 'high_cleric';
    case 'dps': return 'bastion_knight'; // Fallback
  }
}

export function canAllocateNode(
  classId: CharacterClassId,
  nodeId: string,
  allocatedNodes: string[],
  characterLevel: number
): boolean {
  const node = getPassiveNodeById(classId, nodeId);
  if (!node) return false;
  if (allocatedNodes.includes(nodeId)) return false;
  
  const availablePoints = getAvailablePoints(classId, allocatedNodes, characterLevel);
  if (availablePoints < node.pointCost) return false;
  
  // Check if connected to an allocated node (or is start node)
  const tree = CLASS_PASSIVE_TREES[classId];
  if (nodeId === tree.startingNodeId) return true;
  
  const isConnected = node.connections.some(connId => allocatedNodes.includes(connId));
  return isConnected;
}
