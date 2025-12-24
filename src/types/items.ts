import type { GearSlot, BaseStats, CharacterRole } from './character';
import { poeItemClassToGearSlot } from './poeItems';

// Re-export GearSlot for convenience
export type { GearSlot } from './character';

// Item rarity tiers
export type ItemRarity = 
  | 'normal'     // White - no affixes
  | 'magic'      // Blue - 1 prefix, 1 suffix max
  | 'rare'       // Yellow - 3 prefix, 3 suffix max
  | 'unique'     // Orange - fixed special mods
  | 'legendary'; // Red - powerful unique effects

// Item base types
export interface ItemBase {
  id: string;
  name: string;
  slot: GearSlot;
  levelRequirement: number;
  baseStats: Partial<BaseStats>;
  implicitMod?: ItemAffix; // Built-in mod on the base item
  roleRestriction?: CharacterRole;
}

// Affix types
export type AffixType = 'prefix' | 'suffix';

// Affix tier (higher = better rolls)
export interface AffixTier {
  tier: number;
  minValue: number;
  maxValue: number;
  itemLevelRequired: number;
}

// An affix definition
export interface AffixDefinition {
  id: string;
  name: string;
  type: AffixType;
  statModified: keyof BaseStats | 'addedDamage' | 'resistance' | 'lifeOnHit' | 'manaOnKill' | 'haste' | 'versatility' | 'mastery' | 'leech';
  tiers: AffixTier[];
  allowedSlots: GearSlot[];
  tags: string[];
  weight: number; // Spawn weight, higher = more common
}

// A rolled affix on an item
export interface ItemAffix {
  definitionId: string;
  tier: number;
  value: number;
}

// A complete item
export interface Item {
  id: string;
  baseId: string;
  name: string;
  rarity: ItemRarity;
  itemLevel: number;
  prefixes: ItemAffix[];
  suffixes: ItemAffix[];
  implicit?: ItemAffix;
  corrupted: boolean;
  influenced?: InfluenceType;
  sockets?: number;
  quality: number; // 0-20%, affects base stats
  uniqueId?: string; // For unique items
  slot?: GearSlot; // Optional direct slot reference (for PoE items)
  
  // PoE data extensions (optional, for new item system)
  _poeItem?: unknown; // Full PoeItem data for display
  _poeStats?: string[]; // Cached stat strings
}

// Influence types (like PoE's conqueror influences)
export type InfluenceType = 
  | 'void'      // Shadow/dark mods
  | 'radiant'   // Holy/light mods
  | 'primal'    // Nature mods
  | 'infernal'  // Fire mods
  | 'glacial'   // Frost mods
  | 'storm';    // Lightning mods

// ===== GRID INVENTORY SIZES (PoE-style) =====

// Grid dimensions for items in stash/inventory
export interface ItemGridSize {
  width: number;
  height: number;
}

// Mapping from gear slot to grid size (width x height in cells)
// These are fallback defaults - PoE items use their actual inventoryWidth/inventoryHeight
export const SLOT_GRID_SIZES: Record<GearSlot, ItemGridSize> = {
  mainHand: { width: 2, height: 4 },   // Weapons (1H or 2H) - tall slot like PoE
  offHand: { width: 2, height: 4 },    // Shields/quivers - tall slot like PoE
  chest: { width: 2, height: 3 },      // Body armor
  head: { width: 2, height: 2 },       // Helmets
  hands: { width: 2, height: 2 },      // Gloves
  feet: { width: 2, height: 2 },       // Boots
  waist: { width: 2, height: 1 },      // Belts
  neck: { width: 1, height: 1 },       // Amulets
  ring1: { width: 1, height: 1 },      // Rings
  ring2: { width: 1, height: 1 },      // Rings
  trinket1: { width: 1, height: 1 },   // Trinkets/Jewels
  trinket2: { width: 1, height: 1 },   // Trinkets/Jewels
};

// Interface for PoE base item (minimal for type checking)
interface PoeBaseItemSize {
  inventoryWidth: number;
  inventoryHeight: number;
  itemClass?: import('./poeItems').PoeItemClass;
}

interface PoeItemRef {
  baseItem: PoeBaseItemSize;
}

// Helper to get grid size for an item
export function getItemGridSize(item: Item): ItemGridSize {
  // First, check if this is a PoE item with actual inventory dimensions
  if (item._poeItem) {
    const poeItem = item._poeItem as PoeItemRef;
    if (poeItem.baseItem?.inventoryWidth && poeItem.baseItem?.inventoryHeight) {
      return {
        width: poeItem.baseItem.inventoryWidth,
        height: poeItem.baseItem.inventoryHeight
      };
    }
  }
  
  // If slot is directly on the item, use the default slot sizes
  if (item.slot) {
    return SLOT_GRID_SIZES[item.slot] || { width: 1, height: 1 };
  }
  
  // Fall back to base item lookup (legacy system)
  const base = getItemBaseById(item.baseId);
  if (base) {
    return SLOT_GRID_SIZES[base.slot] || { width: 1, height: 1 };
  }
  
  return { width: 1, height: 1 };
}

// Helper to get the equipment slot for an item
export function getItemSlot(item: Item): GearSlot | null {
  // First, check if slot is directly on the item
  if (item.slot) {
    return item.slot;
  }
  
  // Check if this is a PoE item with itemClass
  if (item._poeItem) {
    const poeItem = item._poeItem as PoeItemRef;
    if (poeItem.baseItem?.itemClass) {
      return poeItemClassToGearSlot(poeItem.baseItem.itemClass) as GearSlot;
    }
  }
  
  // Fall back to base item lookup (legacy system)
  const base = getItemBaseById(item.baseId);
  if (base) {
    return base.slot;
  }
  
  return null;
}

// ===== ITEM BASES =====
export const ITEM_BASES: ItemBase[] = [
  // ===== HELMETS =====
  {
    id: 'plate_helm',
    name: 'Plate Helm',
    slot: 'head',
    levelRequirement: 1,
    baseStats: { armor: 50 },
    roleRestriction: 'tank'
  },
  {
    id: 'cloth_hood',
    name: 'Cloth Hood',
    slot: 'head',
    levelRequirement: 1,
    baseStats: { intelligence: 5 } // PoE: intelligence scales spell power
  },
  {
    id: 'leather_cowl',
    name: 'Leather Cowl',
    slot: 'head',
    levelRequirement: 1,
    baseStats: { criticalStrikeChance: 2, armor: 20 }
  },
  {
    id: 'titan_helm',
    name: 'Titan Helm',
    slot: 'head',
    levelRequirement: 50,
    baseStats: { armor: 200, life: 100 },
    roleRestriction: 'tank'
  },

  // ===== CHESTS =====
  {
    id: 'plate_chest',
    name: 'Plate Chestguard',
    slot: 'chest',
    levelRequirement: 1,
    baseStats: { armor: 100 },
    roleRestriction: 'tank'
  },
  {
    id: 'cloth_robe',
    name: 'Cloth Robe',
    slot: 'chest',
    levelRequirement: 1,
    baseStats: { intelligence: 10, mana: 50 }
  },
  {
    id: 'leather_vest',
    name: 'Leather Vest',
    slot: 'chest',
    levelRequirement: 1,
    baseStats: { strength: 8, armor: 40 } // PoE: strength scales melee damage
  },

  // ===== WEAPONS =====
  {
    id: 'sword',
    name: 'Steel Sword',
    slot: 'mainHand',
    levelRequirement: 1,
    baseStats: { strength: 15 }
  },
  {
    id: 'staff',
    name: 'Oak Staff',
    slot: 'mainHand',
    levelRequirement: 1,
    baseStats: { intelligence: 20 }
  },
  {
    id: 'shield',
    name: 'Tower Shield',
    slot: 'offHand',
    levelRequirement: 1,
    baseStats: { armor: 80 },
    roleRestriction: 'tank'
  },
  {
    id: 'dagger',
    name: 'Steel Dagger',
    slot: 'mainHand',
    levelRequirement: 1,
    baseStats: { strength: 10, criticalStrikeChance: 3 }
  },
  {
    id: 'tome',
    name: 'Spell Tome',
    slot: 'offHand',
    levelRequirement: 1,
    baseStats: { intelligence: 13, mana: 30 }
  },

  // ===== ACCESSORIES =====
  {
    id: 'gold_ring',
    name: 'Gold Ring',
    slot: 'ring1',
    levelRequirement: 1,
    baseStats: {}
  },
  {
    id: 'iron_ring',
    name: 'Iron Ring',
    slot: 'ring1',
    levelRequirement: 1,
    baseStats: { strength: 3 }
  },
  {
    id: 'jade_amulet',
    name: 'Jade Amulet',
    slot: 'neck',
    levelRequirement: 1,
    baseStats: { fireResistance: 5, coldResistance: 5, lightningResistance: 5 }
  },
  {
    id: 'ruby_amulet',
    name: 'Ruby Amulet',
    slot: 'neck',
    levelRequirement: 1,
    baseStats: { life: 25 }
  },

  // ===== TRINKETS =====
  {
    id: 'bone_dice',
    name: 'Bone Dice',
    slot: 'trinket1',
    levelRequirement: 1,
    baseStats: { criticalStrikeChance: 1 }
  },
  {
    id: 'war_horn',
    name: 'War Horn',
    slot: 'trinket1',
    levelRequirement: 1,
    baseStats: { strength: 5 }
  }
];

// ===== AFFIX DEFINITIONS =====
export const AFFIX_DEFINITIONS: AffixDefinition[] = [
  // ===== PREFIXES =====
  // Life
  {
    id: 'flat_life',
    name: 'of the Whale',
    type: 'prefix',
    statModified: 'life',
    tiers: [
      { tier: 1, minValue: 10, maxValue: 19, itemLevelRequired: 1 },
      { tier: 2, minValue: 20, maxValue: 39, itemLevelRequired: 10 },
      { tier: 3, minValue: 40, maxValue: 59, itemLevelRequired: 25 },
      { tier: 4, minValue: 60, maxValue: 89, itemLevelRequired: 40 },
      { tier: 5, minValue: 90, maxValue: 120, itemLevelRequired: 60 },
      { tier: 6, minValue: 121, maxValue: 150, itemLevelRequired: 80 }
    ],
    allowedSlots: ['head', 'chest', 'hands', 'waist', 'feet', 'neck', 'ring1', 'ring2'],
    tags: ['life', 'defense'],
    weight: 1000
  },
  // Armor
  {
    id: 'flat_armor',
    name: 'of the Armadillo',
    type: 'prefix',
    statModified: 'armor',
    tiers: [
      { tier: 1, minValue: 15, maxValue: 30, itemLevelRequired: 1 },
      { tier: 2, minValue: 31, maxValue: 60, itemLevelRequired: 15 },
      { tier: 3, minValue: 61, maxValue: 100, itemLevelRequired: 30 },
      { tier: 4, minValue: 101, maxValue: 150, itemLevelRequired: 50 },
      { tier: 5, minValue: 151, maxValue: 200, itemLevelRequired: 70 }
    ],
    allowedSlots: ['head', 'chest', 'hands', 'waist', 'feet'],
    tags: ['armor', 'defense'],
    weight: 800
  },
  // Attack Power
  {
    id: 'flat_attack',
    name: 'Warrior\'s',
    type: 'prefix',
    statModified: 'strength',
    tiers: [
      { tier: 1, minValue: 5, maxValue: 10, itemLevelRequired: 1 },
      { tier: 2, minValue: 11, maxValue: 20, itemLevelRequired: 15 },
      { tier: 3, minValue: 21, maxValue: 35, itemLevelRequired: 35 },
      { tier: 4, minValue: 36, maxValue: 50, itemLevelRequired: 55 },
      { tier: 5, minValue: 51, maxValue: 75, itemLevelRequired: 75 }
    ],
    allowedSlots: ['mainHand', 'offHand', 'neck', 'ring1', 'ring2', 'trinket1', 'trinket2'],
    tags: ['attack', 'damage'],
    weight: 700
  },
  // Spell Power
  {
    id: 'flat_spell',
    name: 'Wizard\'s',
    type: 'prefix',
    statModified: 'intelligence',
    tiers: [
      { tier: 1, minValue: 5, maxValue: 10, itemLevelRequired: 1 },
      { tier: 2, minValue: 11, maxValue: 22, itemLevelRequired: 15 },
      { tier: 3, minValue: 23, maxValue: 38, itemLevelRequired: 35 },
      { tier: 4, minValue: 39, maxValue: 55, itemLevelRequired: 55 },
      { tier: 5, minValue: 56, maxValue: 80, itemLevelRequired: 75 }
    ],
    allowedSlots: ['mainHand', 'offHand', 'head', 'neck', 'ring1', 'ring2'],
    tags: ['spell', 'damage'],
    weight: 700
  },
  // Mana
  {
    id: 'flat_mana',
    name: 'of the Sage',
    type: 'prefix',
    statModified: 'mana',
    tiers: [
      { tier: 1, minValue: 15, maxValue: 30, itemLevelRequired: 1 },
      { tier: 2, minValue: 31, maxValue: 50, itemLevelRequired: 20 },
      { tier: 3, minValue: 51, maxValue: 80, itemLevelRequired: 40 },
      { tier: 4, minValue: 81, maxValue: 120, itemLevelRequired: 60 }
    ],
    allowedSlots: ['head', 'chest', 'offHand', 'neck', 'ring1', 'ring2'],
    tags: ['mana', 'resource'],
    weight: 600
  },

  // ===== SUFFIXES =====
  // Critical Strike Chance
  {
    id: 'crit_chance',
    name: 'of Precision',
    type: 'suffix',
    statModified: 'criticalStrikeChance',
    tiers: [
      { tier: 1, minValue: 1, maxValue: 2, itemLevelRequired: 1 },
      { tier: 2, minValue: 3, maxValue: 4, itemLevelRequired: 20 },
      { tier: 3, minValue: 5, maxValue: 6, itemLevelRequired: 40 },
      { tier: 4, minValue: 7, maxValue: 8, itemLevelRequired: 60 },
      { tier: 5, minValue: 9, maxValue: 10, itemLevelRequired: 80 }
    ],
    allowedSlots: ['mainHand', 'offHand', 'hands', 'ring1', 'ring2', 'neck'],
    tags: ['critical', 'offense'],
    weight: 500
  },
  // Critical Strike Damage
  {
    id: 'crit_damage',
    name: 'of Destruction',
    type: 'suffix',
    statModified: 'criticalStrikeMultiplier',
    tiers: [
      { tier: 1, minValue: 10, maxValue: 15, itemLevelRequired: 1 },
      { tier: 2, minValue: 16, maxValue: 25, itemLevelRequired: 25 },
      { tier: 3, minValue: 26, maxValue: 40, itemLevelRequired: 50 },
      { tier: 4, minValue: 41, maxValue: 60, itemLevelRequired: 75 }
    ],
    allowedSlots: ['mainHand', 'offHand', 'hands', 'ring1', 'ring2'],
    tags: ['critical', 'offense'],
    weight: 400
  },
  // Haste
  {
    id: 'haste',
    name: 'of Speed',
    type: 'suffix',
    statModified: 'haste',
    tiers: [
      { tier: 1, minValue: 1, maxValue: 3, itemLevelRequired: 1 },
      { tier: 2, minValue: 4, maxValue: 6, itemLevelRequired: 20 },
      { tier: 3, minValue: 7, maxValue: 10, itemLevelRequired: 45 },
      { tier: 4, minValue: 11, maxValue: 15, itemLevelRequired: 70 }
    ],
    allowedSlots: ['hands', 'feet', 'mainHand', 'ring1', 'ring2', 'trinket1', 'trinket2'],
    tags: ['speed', 'utility'],
    weight: 600
  },
  // Versatility
  {
    id: 'versatility',
    name: 'of the Chameleon',
    type: 'suffix',
    statModified: 'versatility',
    tiers: [
      { tier: 1, minValue: 1, maxValue: 2, itemLevelRequired: 1 },
      { tier: 2, minValue: 3, maxValue: 5, itemLevelRequired: 25 },
      { tier: 3, minValue: 6, maxValue: 8, itemLevelRequired: 50 },
      { tier: 4, minValue: 9, maxValue: 12, itemLevelRequired: 75 }
    ],
    allowedSlots: ['head', 'chest', 'hands', 'waist', 'feet', 'neck', 'ring1', 'ring2'],
    tags: ['versatility', 'hybrid'],
    weight: 500
  },
  // Mastery
  {
    id: 'mastery',
    name: 'of Mastery',
    type: 'suffix',
    statModified: 'mastery',
    tiers: [
      { tier: 1, minValue: 2, maxValue: 4, itemLevelRequired: 10 },
      { tier: 2, minValue: 5, maxValue: 8, itemLevelRequired: 30 },
      { tier: 3, minValue: 9, maxValue: 14, itemLevelRequired: 55 },
      { tier: 4, minValue: 15, maxValue: 20, itemLevelRequired: 80 }
    ],
    allowedSlots: ['head', 'chest', 'mainHand', 'offHand', 'trinket1', 'trinket2'],
    tags: ['mastery', 'specialization'],
    weight: 450
  },
  // Leech
  {
    id: 'leech',
    name: 'of the Vampire',
    type: 'suffix',
    statModified: 'leech',
    tiers: [
      { tier: 1, minValue: 1, maxValue: 1, itemLevelRequired: 20 },
      { tier: 2, minValue: 2, maxValue: 2, itemLevelRequired: 45 },
      { tier: 3, minValue: 3, maxValue: 4, itemLevelRequired: 70 }
    ],
    allowedSlots: ['mainHand', 'ring1', 'ring2', 'neck'],
    tags: ['leech', 'sustain'],
    weight: 200
  },
  // Resistance
  {
    id: 'resistance',
    name: 'of Warding',
    type: 'suffix',
    statModified: 'resistance',
    tiers: [
      { tier: 1, minValue: 5, maxValue: 10, itemLevelRequired: 1 },
      { tier: 2, minValue: 11, maxValue: 20, itemLevelRequired: 20 },
      { tier: 3, minValue: 21, maxValue: 30, itemLevelRequired: 40 },
      { tier: 4, minValue: 31, maxValue: 45, itemLevelRequired: 65 }
    ],
    allowedSlots: ['head', 'chest', 'hands', 'waist', 'feet', 'offHand', 'ring1', 'ring2'],
    tags: ['resistance', 'defense'],
    weight: 700
  }
];

// Helper functions
export function getItemBaseById(id: string): ItemBase | undefined {
  return ITEM_BASES.find(base => base.id === id);
}

export function getAffixDefinitionById(id: string): AffixDefinition | undefined {
  return AFFIX_DEFINITIONS.find(affix => affix.id === id);
}

export function getAffixesForSlot(slot: GearSlot, type: AffixType): AffixDefinition[] {
  return AFFIX_DEFINITIONS.filter(
    affix => affix.type === type && affix.allowedSlots.includes(slot)
  );
}

export function getBasesForSlot(slot: GearSlot): ItemBase[] {
  return ITEM_BASES.filter(base => base.slot === slot);
}

// Get the max tier available for an affix at a given item level
export function getMaxTierForItemLevel(affix: AffixDefinition, itemLevel: number): AffixTier | undefined {
  const availableTiers = affix.tiers.filter(t => t.itemLevelRequired <= itemLevel);
  return availableTiers.length > 0 
    ? availableTiers.reduce((max, t) => t.tier > max.tier ? t : max)
    : undefined;
}

// Calculate total stats from an item
export function calculateItemStats(item: Item): Partial<BaseStats> {
  const base = getItemBaseById(item.baseId);
  if (!base) return {};

  const stats: Partial<BaseStats> = { ...base.baseStats };
  
  // Apply quality bonus to base stats
  const qualityMultiplier = 1 + (item.quality / 100);
  Object.keys(stats).forEach(key => {
    const statKey = key as keyof BaseStats;
    if (stats[statKey] !== undefined) {
      stats[statKey] = Math.floor(stats[statKey]! * qualityMultiplier);
    }
  });

  // Apply affixes
  const allAffixes = [...item.prefixes, ...item.suffixes];
  if (item.implicit) allAffixes.push(item.implicit);

  allAffixes.forEach(affix => {
    const definition = getAffixDefinitionById(affix.definitionId);
    if (!definition) return;
    
    const statKey = definition.statModified as keyof BaseStats;
    if (statKey in stats) {
      stats[statKey] = (stats[statKey] || 0) + affix.value;
    } else {
      (stats as any)[statKey] = affix.value;
    }
  });

  return stats;
}

