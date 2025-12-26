/**
 * Map System Types - Path of Exile style mapping endgame
 * 
 * Maps replace keystones as the entry mechanism to dungeons.
 * Maps have tiers that scale infinitely, affixes that modify difficulty,
 * and quantity/rarity modifiers that affect loot.
 */

import type { Item } from './items';

// Import fragment images
import sixthFragmentImg from '../assets/fragments/The Sixth Fragment.png';
import fragmentThatRemembersImg from '../assets/fragments/The Fragment That Remembers.png';
import fragmentThatShouldNotPersistImg from '../assets/fragments/The Fragment That Should Not Persist.png';
import brokenConstantImg from '../assets/fragments/The Broken Constant.png';
import uncountedShardImg from '../assets/fragments/The Uncounted Shard.png';
import finalPartialImg from '../assets/fragments/The Final Partial.png';

// ===== MAP TYPES =====

// Map rarity (affects number of affixes)
export type MapRarity = 'normal' | 'magic' | 'rare' | 'corrupted';

// Map base types - different maps have different layouts/bosses
export interface MapBase {
  id: string;
  name: string;
  icon: string;  // Emoji or icon reference
  description: string;
  dungeonId: string;  // Links to the dungeon this map opens
  baseDifficulty: number;  // Base difficulty modifier
  dropWeight: number;  // How commonly this map drops
  tags: string[];  // For affix restrictions
}

// A rolled affix on a map
export interface MapAffix {
  id: string;
  name: string;
  description: string;
  quantityBonus: number;  // e.g., 0.15 = +15% quantity
  rarityBonus: number;    // e.g., 0.10 = +10% rarity
  difficultyMultiplier: number;  // e.g., 1.2 = 20% harder
  effects: MapAffixEffect[];
}

// Specific effects from map affixes
export interface MapAffixEffect {
  type: MapAffixEffectType;
  value: number;
}

export type MapAffixEffectType = 
  | 'enemyDamageIncrease'
  | 'enemyHealthIncrease'
  | 'playerDamageReduction'
  | 'enemySpeed'
  | 'twinBoss';

// A Map item that can be used in the Map Device
export interface MapItem {
  id: string;
  baseId: string;  // Reference to MapBase
  name: string;
  tier: number;  // 1-16+ (scales infinitely)
  rarity: MapRarity;
  affixes: MapAffix[];
  
  // Aggregate bonuses (calculated from affixes)
  quantityBonus: number;  // Total item quantity bonus
  rarityBonus: number;    // Total item rarity bonus
  packSize: number;       // Bonus monster pack size %
  
  // Map-specific properties
  corrupted: boolean;
  itemLevel: number;  // Affects which affixes can roll
  
  // Grid position (for map stash)
  gridPosition?: { x: number; y: number };
}

// ===== FRAGMENT TYPES =====

// Fragments boost map rewards
export interface Fragment {
  id: string;
  baseId: string;
  name: string;
  icon: string;
  image?: string;
  description: string;
  quantityBonus: number;  // e.g., 0.05 = +5% quantity per fragment
  rarityBonus: number;    // Bonus to item rarity
  specialEffect?: FragmentEffect;
  
  // Grid position (for stash)
  gridPosition?: { x: number; y: number };
}

export interface FragmentEffect {
  type: 'boss_drops' | 'currency_drops' | 'map_drops' | 'experience';
  value: number;
}

// ===== MAP DEVICE =====

// Map Device slots
export interface MapDeviceSlot {
  slotId: number;
  type: 'map' | 'fragment';
  item: MapItem | Fragment | null;
}

export interface MapDeviceState {
  mapSlot: MapItem | null;
  fragmentSlots: (Fragment | null)[];  // Up to 4 fragment slots
  isOpen: boolean;
}

// ===== LOOT DROP =====

// A loot drop on the dungeon map (visible during combat)
export interface LootDrop {
  id: string;
  item: Item;
  position: { x: number; y: number };
  droppedAt: number;  // Timestamp when dropped
  collected: boolean;
  source: 'monster' | 'boss' | 'chest' | 'league_mechanic';
  offScreen: boolean;  // If dropped off-screen, show in end modal
  filterSound?: LootFilterSound;
}

// Loot filter sound tiers
export type LootFilterSound = 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary' | 'unique';

// ===== LEAGUE MECHANICS =====

// Random encounters that spawn on maps
export interface LeagueMechanic {
  id: string;
  name: string;
  icon: string;
  description: string;
  bonusQuantity: number;
  bonusRarity: number;
  encounterType: LeagueEncounterType;
  timerPenalty: number;  // Extra time it costs to engage
}

export type LeagueEncounterType = 
  | 'breach'      // Portal opens, monsters stream out
  | 'abyss'       // Crack in ground, follow for loot
  | 'ritual'      // Sacrifice enemies for tribute shop
  | 'expedition'  // Dig sites with explosives
  | 'delirium'    // Mist that makes everything harder
  | 'essence';    // Frozen monster with essence rewards

// Position of a league mechanic on the map
export interface LeagueEncounter {
  id: string;
  mechanic: LeagueMechanic;
  position: { x: number; y: number };
  engaged: boolean;
  completed: boolean;
  lootDrops: LootDrop[];
}

// ===== MAP AFFIX POOL =====

export const MAP_AFFIXES: MapAffix[] = [
  // Quantity-focused affixes (easier)
  {
    id: 'bountiful',
    name: 'Bountiful',
    description: 'Increased Item Quantity',
    quantityBonus: 0.10,
    rarityBonus: 0,
    difficultyMultiplier: 1.0,
    effects: []
  },
  {
    id: 'plentiful',
    name: 'Plentiful',
    description: 'More Monster Packs',
    quantityBonus: 0.05,
    rarityBonus: 0.025,
    difficultyMultiplier: 1.025,
    effects: []
  },
  
  // Rarity-focused affixes
  {
    id: 'enriched',
    name: 'Enriched',
    description: 'Increased Item Rarity',
    quantityBonus: 0.025,
    rarityBonus: 0.125,
    difficultyMultiplier: 1.0,
    effects: []
  },
  
  // Difficulty affixes (reward with challenge)
  {
    id: 'deadly',
    name: 'Deadly',
    description: 'Monsters deal 12% increased Damage',
    quantityBonus: 0.075,
    rarityBonus: 0.05,
    difficultyMultiplier: 1.125,
    effects: [{ type: 'enemyDamageIncrease', value: 0.125 }]
  },
  {
    id: 'massive',
    name: 'Massive',
    description: 'Monsters have 15% increased Life',
    quantityBonus: 0.09,
    rarityBonus: 0.04,
    difficultyMultiplier: 1.15,
    effects: [{ type: 'enemyHealthIncrease', value: 0.15 }]
  },
  {
    id: 'swift',
    name: 'Swift',
    description: 'Monsters have 10% increased Movement and Attack Speed',
    quantityBonus: 0.06,
    rarityBonus: 0.03,
    difficultyMultiplier: 1.10,
    effects: [{ type: 'enemySpeed', value: 0.10 }]
  },
  {
    id: 'empowered',
    name: 'Empowered',
    description: 'Monsters deal 20% increased Damage',
    quantityBonus: 0.125,
    rarityBonus: 0.075,
    difficultyMultiplier: 1.20,
    effects: [{ type: 'enemyDamageIncrease', value: 0.20 }]
  },
  {
    id: 'armored',
    name: 'Armored',
    description: 'Monsters have 25% increased Life',
    quantityBonus: 0.14,
    rarityBonus: 0.06,
    difficultyMultiplier: 1.25,
    effects: [{ type: 'enemyHealthIncrease', value: 0.25 }]
  },
  {
    id: 'twinned',
    name: 'Twinned',
    description: 'Area contains two Unique Bosses',
    quantityBonus: 1.0, // 100% increased quantity
    rarityBonus: 1.0, // 100% increased rarity
    difficultyMultiplier: 1.5,
    effects: [{ type: 'twinBoss', value: 1 }]
  },
  
  // Player debuff affixes
  {
    id: 'smothering',
    name: 'Smothering',
    description: 'Players have 7% reduced Damage',
    quantityBonus: 0.06,
    rarityBonus: 0.04,
    difficultyMultiplier: 1.075,
    effects: [{ type: 'playerDamageReduction', value: 0.075 }]
  },
  {
    id: 'hexed',
    name: 'Hexed',
    description: 'Players take 10% increased Damage',
    quantityBonus: 0.09,
    rarityBonus: 0.05,
    difficultyMultiplier: 1.125,
    effects: [{ type: 'playerDamageReduction', value: -0.10 }] // Negative = take more damage
  }
];

// ===== MAP BASES =====

export const MAP_BASES: MapBase[] = [
  {
    id: 'crypt_map',
    name: 'Crypt Map',
    icon: '🗺️',
    description: 'A map leading to an ancient burial ground.',
    dungeonId: 'crypt_of_the_damned',
    baseDifficulty: 1.0,
    dropWeight: 100,
    tags: ['undead', 'indoor']
  },
  {
    id: 'graveyard_map',
    name: 'Graveyard Map',
    icon: '⚰️',
    description: 'A map to a haunted graveyard.',
    dungeonId: 'crypt_of_the_damned',
    baseDifficulty: 1.05,
    dropWeight: 80,
    tags: ['undead', 'outdoor']
  },
  {
    id: 'catacomb_map',
    name: 'Catacomb Map',
    icon: '💀',
    description: 'A map to deep underground catacombs.',
    dungeonId: 'crypt_of_the_damned',
    baseDifficulty: 1.1,
    dropWeight: 60,
    tags: ['undead', 'underground']
  },
  {
    id: 'necropolis_map',
    name: 'Necropolis Map',
    icon: '🏛️',
    description: 'A map to an ancient city of the dead.',
    dungeonId: 'crypt_of_the_damned',
    baseDifficulty: 1.15,
    dropWeight: 40,
    tags: ['undead', 'boss_enhanced']
  }
];

// ===== FRAGMENT BASES =====

export const FRAGMENT_BASES = [
  {
    id: 'the_sixth_fragment',
    name: 'The Sixth Fragment',
    icon: '🔷',
    image: sixthFragmentImg,
    description: 'A fragment of something greater.',
    quantityBonus: 0.15,
    rarityBonus: 0.15,
    dropWeight: 100
  },
  {
    id: 'the_fragment_that_remembers',
    name: 'The Fragment That Remembers',
    icon: '💎',
    image: fragmentThatRemembersImg,
    description: 'Echoes of forgotten power.',
    quantityBonus: 0.15,
    rarityBonus: 0.15,
    dropWeight: 100
  },
  {
    id: 'the_fragment_that_should_not_persist',
    name: 'The Fragment That Should Not Persist',
    icon: '⭐',
    image: fragmentThatShouldNotPersistImg,
    description: 'Defying the natural order.',
    quantityBonus: 0.15,
    rarityBonus: 0.15,
    dropWeight: 100
  },
  {
    id: 'the_broken_constant',
    name: 'The Broken Constant',
    icon: '💔',
    image: brokenConstantImg,
    description: 'Once immutable, now fractured.',
    quantityBonus: 0.20,
    rarityBonus: 0.20,
    dropWeight: 80
  },
  {
    id: 'the_uncounted_shard',
    name: 'The Uncounted Shard',
    icon: '🔸',
    image: uncountedShardImg,
    description: 'Beyond enumeration.',
    quantityBonus: 0.20,
    rarityBonus: 0.20,
    dropWeight: 80
  },
  {
    id: 'the_final_partial',
    name: 'The Final Partial',
    icon: '🟣',
    image: finalPartialImg,
    description: 'The last piece of infinity.',
    quantityBonus: 0.25,
    rarityBonus: 0.25,
    dropWeight: 60
  }
];

// ===== LEAGUE MECHANICS POOL =====

// DISABLED: League mechanics are not yet implemented
export const LEAGUE_MECHANICS: LeagueMechanic[] = [
  // {
  //   id: 'breach',
  //   name: 'Breach',
  //   icon: '🌀',
  //   description: 'A portal opens, spawning waves of monsters.',
  //   bonusQuantity: 0.15,
  //   bonusRarity: 0.10,
  //   encounterType: 'breach',
  //   timerPenalty: 15
  // },
  // {
  //   id: 'essence',
  //   name: 'Essence',
  //   icon: '💠',
  //   description: 'A frozen monster contains valuable essences.',
  //   bonusQuantity: 0.08,
  //   bonusRarity: 0.20,
  //   encounterType: 'essence',
  //   timerPenalty: 5
  // },
  // {
  //   id: 'ritual',
  //   name: 'Ritual',
  //   icon: '🔺',
  //   description: 'Sacrifice monsters for tribute rewards.',
  //   bonusQuantity: 0.20,
  //   bonusRarity: 0.15,
  //   encounterType: 'ritual',
  //   timerPenalty: 20
  // },
  // {
  //   id: 'delirium',
  //   name: 'Delirium Mirror',
  //   icon: '🪞',
  //   description: 'Touch the mirror to enter the mist. Rewards scale with progress.',
  //   bonusQuantity: 0.30,
  //   bonusRarity: 0.25,
  //   encounterType: 'delirium',
  //   timerPenalty: 30
  // }
];

// ===== HELPER FUNCTIONS =====

/**
 * Get a map base by ID
 */
export function getMapBaseById(id: string): MapBase | undefined {
  return MAP_BASES.find(base => base.id === id);
}

/**
 * Generate a map name based on rarity and affixes
 */
export function generateMapName(map: MapItem): string {
  const base = getMapBaseById(map.baseId);
  if (!base) return 'Unknown Map';
  
  if (map.rarity === 'normal') {
    return `${base.name} (T${map.tier})`;
  }
  
  if (map.affixes.length > 0) {
    const firstAffix = map.affixes[0];
    return `${firstAffix.name} ${base.name} (T${map.tier})`;
  }
  
  return `${base.name} (T${map.tier})`;
}

/**
 * Calculate total quantity bonus from map and fragments
 */
export function calculateTotalQuantity(map: MapItem, fragments: Fragment[]): number {
  let total = map.quantityBonus;
  fragments.forEach(f => {
    total += f.quantityBonus;
  });
  return total;
}

/**
 * Calculate total rarity bonus from map and fragments
 */
export function calculateTotalRarity(map: MapItem, fragments: Fragment[]): number {
  let total = map.rarityBonus;
  fragments.forEach(f => {
    total += f.rarityBonus;
  });
  return total;
}

/**
 * Get the maximum map tier that can drop based on highest completed
 */
export function getMaxDropTier(highestCompleted: number): number {
  return highestCompleted + 1;
}

/**
 * Determine loot filter sound based on item
 */
export function getLootFilterSound(item: Item): LootFilterSound {
  if (item.rarity === 'unique' || item.rarity === 'legendary') {
    return 'legendary';
  }
  if (item.rarity === 'rare') {
    // Check item level for extra excitement
    if (item.itemLevel >= 80) return 'epic';
    return 'rare';
  }
  if (item.rarity === 'magic') {
    return 'uncommon';
  }
  return 'common';
}

/**
 * Calculate aggregate bonuses from map affixes
 */
export function calculateMapBonuses(affixes: MapAffix[]): {
  quantityBonus: number;
  rarityBonus: number;
  packSize: number;
} {
  let quantityBonus = 0;
  let rarityBonus = 0;
  let packSize = 0;
  
  for (const affix of affixes) {
    quantityBonus += affix.quantityBonus;
    rarityBonus += affix.rarityBonus;
    // Pack size could be calculated from specific affixes in the future
    // For now, we can use quantityBonus as a proxy
  }
  
  return { quantityBonus, rarityBonus, packSize };
}

/**
 * Update map bonuses based on current affixes
 */
export function updateMapBonuses(map: MapItem): MapItem {
  const bonuses = calculateMapBonuses(map.affixes);
  return {
    ...map,
    quantityBonus: bonuses.quantityBonus,
    rarityBonus: bonuses.rarityBonus,
    packSize: bonuses.packSize,
  };
}

/**
 * Roll map affixes based on rarity
 */
export function rollMapAffixes(rarity: MapRarity, _itemLevel: number): MapAffix[] {
  const affixes: MapAffix[] = [];
  
  let numAffixes = 0;
  if (rarity === 'magic') {
    numAffixes = Math.random() < 0.5 ? 1 : 2;
  } else if (rarity === 'rare') {
    numAffixes = 3 + Math.floor(Math.random() * 4); // 3-6 affixes
  } else if (rarity === 'corrupted') {
    numAffixes = 4 + Math.floor(Math.random() * 4); // 4-7 affixes
  }
  
  // Twinned is super rare - only appears on rare/corrupted maps with 5% chance
  const canHaveTwinned = (rarity === 'rare' || rarity === 'corrupted') && Math.random() < 0.05;
  const twinnedAffix = MAP_AFFIXES.find(a => a.id === 'twinned');
  
  // Filter out twinned from regular pool if we're not rolling it
  const availableAffixes = canHaveTwinned 
    ? [...MAP_AFFIXES] 
    : MAP_AFFIXES.filter(a => a.id !== 'twinned');
  
  // If we can have twinned, add it first with a 30% chance (so overall ~1.5% chance on rare/corrupted)
  if (canHaveTwinned && twinnedAffix && Math.random() < 0.3) {
    affixes.push(twinnedAffix);
    numAffixes--; // One less affix to roll
  }
  
  for (let i = 0; i < numAffixes && availableAffixes.length > 0; i++) {
    // Don't add twinned if already added
    const pool = availableAffixes.filter(a => !affixes.some(existing => existing.id === a.id));
    if (pool.length === 0) break;
    
    const idx = Math.floor(Math.random() * pool.length);
    affixes.push(pool[idx]);
  }
  
  return affixes;
}

/**
 * Generate a random map
 */
export function generateMap(tier: number, _rarity: MapRarity = 'normal'): MapItem {
  // Pick a random base, weighted by dropWeight
  const totalWeight = MAP_BASES.reduce((sum, base) => sum + base.dropWeight, 0);
  let roll = Math.random() * totalWeight;
  
  let selectedBase = MAP_BASES[0];
  for (const base of MAP_BASES) {
    roll -= base.dropWeight;
    if (roll <= 0) {
      selectedBase = base;
      break;
    }
  }
  
  const itemLevel = Math.max(1, tier * 3 + 65); // Similar to PoE map item levels
  
  // Always create white/normal maps with no affixes
  const map: MapItem = {
    id: crypto.randomUUID(),
    baseId: selectedBase.id,
    name: '',
    tier,
    rarity: 'normal', // Always normal/white
    affixes: [], // No affixes
    quantityBonus: 0,
    rarityBonus: 0,
    packSize: 0,
    corrupted: false,
    itemLevel
  };
  
  map.name = generateMapName(map);
  
  return map;
}

/**
 * Generate a random fragment
 */
export function generateFragment(): Fragment {
  // Calculate total weight
  const totalWeight = FRAGMENT_BASES.reduce((sum, f) => sum + (f.dropWeight || 100), 0);
  
  // Random weighted selection
  let random = Math.random() * totalWeight;
  let base = FRAGMENT_BASES[0];
  
  for (const fragment of FRAGMENT_BASES) {
    random -= (fragment.dropWeight || 100);
    if (random <= 0) {
      base = fragment;
      break;
    }
  }
  
  return {
    id: crypto.randomUUID(),
    baseId: base.id,
    name: base.name,
    icon: base.icon,
    image: base.image,
    description: base.description,
    quantityBonus: base.quantityBonus,
    rarityBonus: base.rarityBonus,
    specialEffect: (base as any).specialEffect as FragmentEffect | undefined
  };
}

/**
 * Generate random league encounters for a map run
 * Higher tier maps have more encounters
 * 
 * @param mapTier - The tier of the map
 * @param mapWidth - Width of the map for positioning
 * @param mapHeight - Height of the map for positioning
 * @returns Array of league encounters
 */
export function generateLeagueEncounters(
  mapTier: number,
  mapWidth: number = 3600,
  mapHeight: number = 800
): LeagueEncounter[] {
  const encounters: LeagueEncounter[] = [];
  
  // Base chance for any encounter: 30% + 5% per tier (capped at 80%)
  const encounterChance = Math.min(0.8, 0.3 + mapTier * 0.05);
  
  // Number of potential encounter slots (1-3 based on tier)
  const numSlots = mapTier < 5 ? 1 : mapTier < 10 ? 2 : 3;
  
  for (let i = 0; i < numSlots; i++) {
    if (Math.random() > encounterChance) continue;
    
    // Pick a random league mechanic
    const mechanic = LEAGUE_MECHANICS[Math.floor(Math.random() * LEAGUE_MECHANICS.length)];
    
    // Position the encounter in a gate zone (spread across the map)
    const gateZone = i + 1; // Gate 1, 2, or 3
    const xMin = (gateZone - 1) * (mapWidth / 3) + 200;
    const xMax = gateZone * (mapWidth / 3) - 200;
    const x = xMin + Math.random() * (xMax - xMin);
    const y = 200 + Math.random() * (mapHeight - 400);
    
    encounters.push({
      id: crypto.randomUUID(),
      mechanic,
      position: { x, y },
      engaged: false,
      completed: false,
      lootDrops: []
    });
  }
  
  return encounters;
}

