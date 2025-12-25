import type { Item, ItemRarity, ItemAffix, GearSlot } from '../types/items';
import { 
  ITEM_BASES, 
  AFFIX_DEFINITIONS, 
  getAffixesForSlot, 
  getMaxTierForItemLevel,
  getItemBaseById
} from '../types/items';
import type { OrbType } from '../store/gameStore';

// Import the new PoE crafting system
import { generatePoeItem, generatePoeDungeonLoot, calculateItemLevel, type PoeItemRarity } from './poeCrafting';
import { poeItemToLegacyItem } from './poeItemAdapter';
import { generateMap, generateFragment, type MapItem, type Fragment } from '../types/maps';

// Feature flag - set to true to use the new PoE item system
export const USE_POE_ITEM_SYSTEM = true;

// Random utility
function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomChoice<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function weightedRandomChoice<T extends { weight: number }>(items: T[]): T {
  const totalWeight = items.reduce((sum, item) => sum + item.weight, 0);
  let random = Math.random() * totalWeight;
  
  for (const item of items) {
    random -= item.weight;
    if (random <= 0) return item;
  }
  
  return items[items.length - 1];
}

// Roll a single affix
export function rollAffix(
  slot: GearSlot, 
  type: 'prefix' | 'suffix', 
  itemLevel: number,
  excludeIds: string[] = []
): ItemAffix | null {
  const availableAffixes = getAffixesForSlot(slot, type)
    .filter(a => !excludeIds.includes(a.id))
    .filter(a => getMaxTierForItemLevel(a, itemLevel) !== undefined);
  
  if (availableAffixes.length === 0) return null;
  
  const affixDef = weightedRandomChoice(availableAffixes);
  const tier = getMaxTierForItemLevel(affixDef, itemLevel);
  
  if (!tier) return null;
  
  return {
    definitionId: affixDef.id,
    tier: tier.tier,
    value: randomInt(tier.minValue, tier.maxValue)
  };
}

// Generate item name based on affixes
function generateItemName(item: Item): string {
  const base = getItemBaseById(item.baseId);
  if (!base) return 'Unknown Item';
  
  if (item.rarity === 'unique') {
    return item.name; // Uniques have fixed names
  }
  
  if (item.rarity === 'normal') {
    return base.name;
  }
  
  // For magic/rare items, use affixes
  const prefixNames = item.prefixes
    .map(a => AFFIX_DEFINITIONS.find(d => d.id === a.definitionId)?.name || '')
    .filter(n => n);
  
  const suffixNames = item.suffixes
    .map(a => AFFIX_DEFINITIONS.find(d => d.id === a.definitionId)?.name || '')
    .filter(n => n);
  
  let name = base.name;
  
  if (prefixNames.length > 0) {
    name = `${prefixNames[0]} ${name}`;
  }
  
  if (suffixNames.length > 0) {
    name = `${name} ${suffixNames[0]}`;
  }
  
  return name;
}

// Generate a random item
export function generateRandomItem(
  itemLevel: number, 
  rarity?: ItemRarity,
  slotFilter?: GearSlot
): Item {
  // Use new PoE item system if enabled (and no slot filter - PoE system doesn't support it yet)
  if (USE_POE_ITEM_SYSTEM && !slotFilter) {
    // Determine rarity if not specified
    if (!rarity) {
      const roll = Math.random();
      if (roll < 0.6) rarity = 'normal';
      else if (roll < 0.9) rarity = 'magic';
      else rarity = 'rare';
    }
    
    const poeRarity = rarity as PoeItemRarity;
    const poeItem = generatePoeItem(itemLevel, poeRarity);
    if (poeItem) {
      return poeItemToLegacyItem(poeItem);
    }
    // Fall through to legacy if PoE generation fails
  }
  
  // Legacy system
  // Pick a random base
  const availableBases = slotFilter 
    ? ITEM_BASES.filter(b => b.slot === slotFilter)
    : ITEM_BASES;
  
  const base = randomChoice(availableBases.filter(b => b.levelRequirement <= itemLevel));
  
  // Determine rarity if not specified
  if (!rarity) {
    const roll = Math.random();
    if (roll < 0.6) rarity = 'normal';
    else if (roll < 0.9) rarity = 'magic';
    else rarity = 'rare';
  }
  
  const item: Item = {
    id: crypto.randomUUID(),
    baseId: base.id,
    name: base.name,
    rarity,
    itemLevel,
    prefixes: [],
    suffixes: [],
    corrupted: false,
    quality: 0,
    sockets: Math.min(Math.floor(itemLevel / 20) + 1, 6)
  };
  
  // Roll affixes based on rarity
  if (rarity === 'magic') {
    // 1-2 affixes total
    const numAffixes = randomInt(1, 2);
    for (let i = 0; i < numAffixes; i++) {
      const type = Math.random() > 0.5 ? 'prefix' : 'suffix';
      const existingIds = [...item.prefixes, ...item.suffixes].map(a => a.definitionId);
      
      if (type === 'prefix' && item.prefixes.length < 1) {
        const affix = rollAffix(base.slot, 'prefix', itemLevel, existingIds);
        if (affix) item.prefixes.push(affix);
      } else if (type === 'suffix' && item.suffixes.length < 1) {
        const affix = rollAffix(base.slot, 'suffix', itemLevel, existingIds);
        if (affix) item.suffixes.push(affix);
      }
    }
  } else if (rarity === 'rare') {
    // 3-6 affixes, up to 3 prefixes and 3 suffixes
    const numPrefixes = randomInt(1, 3);
    const numSuffixes = randomInt(1, 3);
    
    for (let i = 0; i < numPrefixes; i++) {
      const existingIds = item.prefixes.map(a => a.definitionId);
      const affix = rollAffix(base.slot, 'prefix', itemLevel, existingIds);
      if (affix) item.prefixes.push(affix);
    }
    
    for (let i = 0; i < numSuffixes; i++) {
      const existingIds = item.suffixes.map(a => a.definitionId);
      const affix = rollAffix(base.slot, 'suffix', itemLevel, existingIds);
      if (affix) item.suffixes.push(affix);
    }
  }
  
  item.name = generateItemName(item);
  
  return item;
}

// Apply crafting orb to item
export function applyOrbToItem(
  item: Item, 
  orbType: OrbType
): { success: boolean; item?: Item; message: string } {
  const base = getItemBaseById(item.baseId);
  if (!base) return { success: false, message: 'Invalid item base' };
  
  if (item.corrupted) {
    return { success: false, message: 'Cannot modify corrupted items' };
  }
  
  const newItem = { ...item };
  
  switch (orbType) {
    case 'transmutation':
      if (item.rarity !== 'normal') {
        return { success: false, message: 'Can only use on normal items' };
      }
      newItem.rarity = 'magic';
      newItem.prefixes = [];
      newItem.suffixes = [];
      
      // Add 1-2 affixes
      const numAffixes = randomInt(1, 2);
      for (let i = 0; i < numAffixes; i++) {
        const type = i === 0 || Math.random() > 0.5 ? 'prefix' : 'suffix';
        const existingIds = [...newItem.prefixes, ...newItem.suffixes].map(a => a.definitionId);
        
        if (type === 'prefix' && newItem.prefixes.length < 1) {
          const affix = rollAffix(base.slot, 'prefix', item.itemLevel, existingIds);
          if (affix) newItem.prefixes.push(affix);
        } else if (newItem.suffixes.length < 1) {
          const affix = rollAffix(base.slot, 'suffix', item.itemLevel, existingIds);
          if (affix) newItem.suffixes.push(affix);
        }
      }
      newItem.name = generateItemName(newItem);
      return { success: true, item: newItem, message: 'Item transmuted to magic' };

    case 'alteration':
      if (item.rarity !== 'magic') {
        return { success: false, message: 'Can only use on magic items' };
      }
      newItem.prefixes = [];
      newItem.suffixes = [];
      
      const altNumAffixes = randomInt(1, 2);
      for (let i = 0; i < altNumAffixes; i++) {
        const type = Math.random() > 0.5 ? 'prefix' : 'suffix';
        const existingIds = [...newItem.prefixes, ...newItem.suffixes].map(a => a.definitionId);
        
        if (type === 'prefix' && newItem.prefixes.length < 1) {
          const affix = rollAffix(base.slot, 'prefix', item.itemLevel, existingIds);
          if (affix) newItem.prefixes.push(affix);
        } else if (newItem.suffixes.length < 1) {
          const affix = rollAffix(base.slot, 'suffix', item.itemLevel, existingIds);
          if (affix) newItem.suffixes.push(affix);
        }
      }
      newItem.name = generateItemName(newItem);
      return { success: true, item: newItem, message: 'Item affixes rerolled' };

    case 'augmentation':
      if (item.rarity !== 'magic') {
        return { success: false, message: 'Can only use on magic items' };
      }
      if (item.prefixes.length >= 1 && item.suffixes.length >= 1) {
        return { success: false, message: 'Item already has max affixes for magic rarity' };
      }
      
      const augType = item.prefixes.length < 1 ? 'prefix' : 'suffix';
      const existingIds = [...item.prefixes, ...item.suffixes].map(a => a.definitionId);
      const augAffix = rollAffix(base.slot, augType, item.itemLevel, existingIds);
      
      if (!augAffix) {
        return { success: false, message: 'No valid affixes available' };
      }
      
      if (augType === 'prefix') {
        newItem.prefixes = [...item.prefixes, augAffix];
      } else {
        newItem.suffixes = [...item.suffixes, augAffix];
      }
      newItem.name = generateItemName(newItem);
      return { success: true, item: newItem, message: 'Added new affix' };

    case 'alchemy':
      if (item.rarity !== 'normal') {
        return { success: false, message: 'Can only use on normal items' };
      }
      newItem.rarity = 'rare';
      newItem.prefixes = [];
      newItem.suffixes = [];
      
      const alchPrefixes = randomInt(1, 3);
      const alchSuffixes = randomInt(1, 3);
      
      for (let i = 0; i < alchPrefixes; i++) {
        const existingIds = newItem.prefixes.map(a => a.definitionId);
        const affix = rollAffix(base.slot, 'prefix', item.itemLevel, existingIds);
        if (affix) newItem.prefixes.push(affix);
      }
      
      for (let i = 0; i < alchSuffixes; i++) {
        const existingIds = newItem.suffixes.map(a => a.definitionId);
        const affix = rollAffix(base.slot, 'suffix', item.itemLevel, existingIds);
        if (affix) newItem.suffixes.push(affix);
      }
      
      newItem.name = generateItemName(newItem);
      return { success: true, item: newItem, message: 'Item alchemized to rare' };

    case 'chaos':
      if (item.rarity !== 'rare') {
        return { success: false, message: 'Can only use on rare items' };
      }
      newItem.prefixes = [];
      newItem.suffixes = [];
      
      const chaosPrefixes = randomInt(1, 3);
      const chaosSuffixes = randomInt(1, 3);
      
      for (let i = 0; i < chaosPrefixes; i++) {
        const existingIds = newItem.prefixes.map(a => a.definitionId);
        const affix = rollAffix(base.slot, 'prefix', item.itemLevel, existingIds);
        if (affix) newItem.prefixes.push(affix);
      }
      
      for (let i = 0; i < chaosSuffixes; i++) {
        const existingIds = newItem.suffixes.map(a => a.definitionId);
        const affix = rollAffix(base.slot, 'suffix', item.itemLevel, existingIds);
        if (affix) newItem.suffixes.push(affix);
      }
      
      newItem.name = generateItemName(newItem);
      return { success: true, item: newItem, message: 'Item affixes rerolled' };

    case 'exalted':
      if (item.rarity !== 'rare') {
        return { success: false, message: 'Can only use on rare items' };
      }
      if (item.prefixes.length >= 3 && item.suffixes.length >= 3) {
        return { success: false, message: 'Item already has max affixes' };
      }
      
      let exType: 'prefix' | 'suffix';
      if (item.prefixes.length >= 3) exType = 'suffix';
      else if (item.suffixes.length >= 3) exType = 'prefix';
      else exType = Math.random() > 0.5 ? 'prefix' : 'suffix';
      
      const exExistingIds = [...item.prefixes, ...item.suffixes].map(a => a.definitionId);
      const exAffix = rollAffix(base.slot, exType, item.itemLevel, exExistingIds);
      
      if (!exAffix) {
        return { success: false, message: 'No valid affixes available' };
      }
      
      if (exType === 'prefix') {
        newItem.prefixes = [...item.prefixes, exAffix];
      } else {
        newItem.suffixes = [...item.suffixes, exAffix];
      }
      newItem.name = generateItemName(newItem);
      return { success: true, item: newItem, message: 'Added powerful affix' };

    case 'annulment':
      const allAffixes = [...item.prefixes, ...item.suffixes];
      if (allAffixes.length === 0) {
        return { success: false, message: 'Item has no affixes to remove' };
      }
      
      // Remove random affix
      const removePrefix = item.prefixes.length > 0 && (item.suffixes.length === 0 || Math.random() > 0.5);
      
      if (removePrefix) {
        const idx = Math.floor(Math.random() * item.prefixes.length);
        newItem.prefixes = item.prefixes.filter((_, i) => i !== idx);
      } else {
        const idx = Math.floor(Math.random() * item.suffixes.length);
        newItem.suffixes = item.suffixes.filter((_, i) => i !== idx);
      }
      
      newItem.name = generateItemName(newItem);
      return { success: true, item: newItem, message: 'Removed random affix' };

    default:
      return { success: false, message: 'Unknown orb type' };
  }
}

// Generate dungeon loot
export function generateDungeonLoot(
  keyLevel: number, 
  success: boolean,
  upgradeLevel: number,
  itemQuantity: number = 0,
  itemRarity: number = 0
): Item[] {
  // Use new PoE item system if enabled
  if (USE_POE_ITEM_SYSTEM) {
    const poeItems = generatePoeDungeonLoot(keyLevel, success, upgradeLevel, itemQuantity, itemRarity);
    return poeItems.map(poeItemToLegacyItem);
  }
  
  // Legacy system
  const items: Item[] = [];
  // Use PoE-style item level calculation (key level = zone level)
  const itemLevel = calculateItemLevel(keyLevel);
  
  // Base number of items (at +2 with 0% quantity)
  let baseNumItems = success ? 3 + upgradeLevel : 1;
  
  // Apply item quantity multiplier (8% per level above +2)
  // At +2: 1.0x, at +3: 1.08x, at +4: 1.16x, etc.
  const quantityMultiplier = 1 + itemQuantity;
  let numItems = Math.floor(baseNumItems * quantityMultiplier);
  
  // Ensure at least 1 item on success
  if (success && numItems < 1) numItems = 1;
  
  // Rarity distribution based on itemRarity multiplier
  // At +2 (0% rarity): 70% normal, 25% magic, 5% rare
  // At +10 (64% rarity): 20% normal, 50% magic, 30% rare
  // Higher rarity = less normal, more magic and rare
  const normalChance = Math.max(0.05, 0.70 - (itemRarity * 0.78)); // 70% -> 5% as rarity increases
  const magicChance = 0.25 + (itemRarity * 0.39); // 25% -> 50% as rarity increases
  // Rare chance = 1 - normalChance - magicChance (scales from 5% to ~30%)
  
  for (let i = 0; i < numItems; i++) {
    const rarityRoll = Math.random();
    let rarity: ItemRarity;
    
    if (rarityRoll < normalChance) {
      rarity = 'normal'; // Grey/white
    } else if (rarityRoll < normalChance + magicChance) {
      rarity = 'magic'; // Blue
    } else {
      rarity = 'rare'; // Yellow
    }
    
    items.push(generateRandomItem(itemLevel, rarity));
  }
  
  return items;
}

// Generate orb drops from dungeon
export function generateOrbDrops(keyLevel: number, success: boolean, progressPercent: number = 1): Partial<Record<OrbType, number>> {
  const drops: Partial<Record<OrbType, number>> = {};
  
  if (!success) {
    // Failed runs get reduced orbs based on progress made
    const progress = Math.max(0.2, progressPercent);
    drops.transmutation = randomInt(1, Math.max(1, Math.floor((2 + keyLevel / 5) * progress)));
    if (Math.random() < 0.3 * progress) drops.alteration = randomInt(1, 2);
    if (keyLevel >= 5 && Math.random() < 0.1 * progress) drops.alchemy = 1;
    return drops;
  }
  
  // Common orbs
  drops.transmutation = randomInt(1, 3 + Math.floor(keyLevel / 5));
  drops.alteration = randomInt(0, 2 + Math.floor(keyLevel / 5));
  
  // Uncommon orbs
  if (Math.random() < 0.3 + keyLevel * 0.02) {
    drops.augmentation = randomInt(1, 2);
  }
  if (Math.random() < 0.2 + keyLevel * 0.02) {
    drops.alchemy = 1;
  }
  
  // Rare orbs (need higher keys)
  if (keyLevel >= 5 && Math.random() < 0.1 + keyLevel * 0.01) {
    drops.chaos = 1;
  }
  if (keyLevel >= 10 && Math.random() < 0.05 + keyLevel * 0.005) {
    drops.exalted = 1;
  }
  if (Math.random() < 0.15) {
    drops.annulment = 1;
  }
  
  return drops;
}

// ===== MAP DROP GENERATION =====

/**
 * Generate map drops from dungeon completion
 * 
 * Map drop rules:
 * - Boss has ~50% chance of dropping 1-3 maps
 * - Maps can drop at current tier or +1 tier (capped at highestCompleted + 1)
 * - Higher tier completions have higher drop rates
 * - Rarity of maps scales with tier
 * 
 * @param currentTier - The tier of the map being run
 * @param highestCompleted - The highest tier the player has completed
 * @param success - Whether the run was successful
 * @param isBossKill - Whether this is from the boss (higher drop chance)
 * @param quantityBonus - Bonus to item quantity (from map mods)
 * @returns Array of generated maps
 */
export function generateMapDrops(
  currentTier: number,
  highestCompleted: number,
  success: boolean,
  isBossKill: boolean = false,
  quantityBonus: number = 0
): MapItem[] {
  const maps: MapItem[] = [];
  
  // Failed runs have much lower drop chance
  if (!success) {
    // 10% chance to drop a single map of same tier
    if (Math.random() < 0.1) {
      maps.push(generateMap(currentTier, 'normal'));
    }
    return maps;
  }
  
  // Boss drops (should be ~50% of total loot value)
  if (isBossKill) {
    // Base chance: 60% to drop at least one map
    // +5% per tier, +quantity bonus
    const baseDropChance = 0.6 + (currentTier * 0.05) + (quantityBonus * 0.5);
    
    if (Math.random() < baseDropChance) {
      // Determine number of maps (1-3, weighted toward 1-2)
      const roll = Math.random();
      let numMaps = 1;
      if (roll > 0.7) numMaps = 2;
      if (roll > 0.9) numMaps = 3;
      
      // Apply quantity bonus to potentially get more maps
      if (quantityBonus > 0.3 && Math.random() < quantityBonus) {
        numMaps++;
      }
      
      for (let i = 0; i < numMaps; i++) {
        // Determine tier: mostly same tier, sometimes +1
        let dropTier = currentTier;
        const maxDropTier = highestCompleted + 1;
        
        // 30% chance to drop +1 tier (if not already at max)
        if (dropTier < maxDropTier && Math.random() < 0.3) {
          dropTier = Math.min(dropTier + 1, maxDropTier);
        }
        
        // Sometimes drop lower tier maps too
        if (Math.random() < 0.2 && dropTier > 1) {
          dropTier = Math.max(1, dropTier - randomInt(1, 2));
        }
        
        // Always generate normal/white maps
        maps.push(generateMap(dropTier));
      }
    }
  } else {
    // Regular monster drops (much lower chance)
    // Only elite/rare monsters should have any chance
    // Base 5% chance, +quantity bonus
    const dropChance = 0.05 + (quantityBonus * 0.1);
    
    if (Math.random() < dropChance) {
      // Usually drops current tier or lower
      let dropTier = currentTier;
      if (Math.random() < 0.3 && dropTier > 1) {
        dropTier = Math.max(1, dropTier - 1);
      }
      
      // Always generate normal/white maps
      maps.push(generateMap(dropTier));
    }
  }
  
  return maps;
}

/**
 * Generate fragment drops
 * 
 * Fragments are rarer than maps, mainly from high-tier content
 */

// ===== REAL-TIME LOOT DROP GENERATION =====

import type { MapLootDrop } from '../types/combat';

/**
 * Get loot drop rarity tier for filter sounds
 */
export function getLootDropRarity(item: Item): 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary' {
  if (item.rarity === 'unique' || item.rarity === 'legendary') {
    return 'legendary';
  }
  if (item.rarity === 'rare') {
    if (item.itemLevel >= 80) return 'epic';
    return 'rare';
  }
  if (item.rarity === 'magic') {
    return 'uncommon';
  }
  return 'common';
}

/**
 * Generate loot drops from a single enemy kill
 * Called in real-time during combat when an enemy dies
 * 
 * @param enemyHealth - The max health of the enemy (affects drop chance/quantity)
 * @param enemyType - 'normal' | 'elite' | 'miniboss' | 'boss'
 * @param currentTier - The map tier being run
 * @param highestCompleted - Highest tier completed for map drops
 * @param position - Position where the enemy died
 * @param quantityBonus - Map quantity bonus
 * @param rarityBonus - Map rarity bonus
 * @returns Array of loot drops
 */
export function generateEnemyLootDrops(
  _enemyHealth: number,
  enemyType: 'normal' | 'elite' | 'miniboss' | 'boss',
  currentTier: number,
  highestCompleted: number,
  position: { x: number; y: number },
  quantityBonus: number = 0,
  rarityBonus: number = 0
): MapLootDrop[] {
  const drops: MapLootDrop[] = [];
  
  // Position jitter for drops - spread them out in a grid-like pattern
  let dropIndex = 0;
  const jitter = () => {
    const idx = dropIndex++;
    // Spread drops in a circular/grid pattern around the enemy position
    const angle = (idx * 137.5) * (Math.PI / 180); // Golden angle for even distribution
    const radius = 30 + (idx % 4) * 25; // Varying radius
    // Also add some randomness
    const rx = (Math.random() - 0.5) * 40;
    const ry = (Math.random() - 0.5) * 30;
    return {
      x: position.x + Math.cos(angle) * radius + rx,
      y: position.y + Math.sin(angle) * radius + ry
    };
  };
  
  // ===== ITEM DROPS =====
  // Base item drop chance scales with enemy type and health
  const baseItemChance = {
    normal: 0.05,
    elite: 0.25,
    miniboss: 0.5,
    boss: 0.8
  };
  
  const itemDropChance = baseItemChance[enemyType] * (1 + quantityBonus * 0.5);
  
  if (Math.random() < itemDropChance) {
    // Generate 1-3 items based on enemy type
    const numItems = enemyType === 'boss' ? randomInt(2, 4) : 
                     enemyType === 'miniboss' ? randomInt(1, 3) :
                     enemyType === 'elite' ? randomInt(1, 2) : 1;
    
    const itemLevel = calculateItemLevel(currentTier);
    
    for (let i = 0; i < numItems; i++) {
      // Rarity distribution affected by rarityBonus
      const rarityRoll = Math.random();
      const normalChance = Math.max(0.1, 0.6 - rarityBonus);
      const magicChance = 0.3 + (rarityBonus * 0.3);
      
      let rarity: ItemRarity;
      if (rarityRoll < normalChance) {
        rarity = 'normal';
      } else if (rarityRoll < normalChance + magicChance) {
        rarity = 'magic';
      } else {
        rarity = 'rare';
      }
      
      const item = generateRandomItem(itemLevel, rarity);
      const pos = jitter();
      
      drops.push({
        id: crypto.randomUUID(),
        type: 'item',
        item,
        position: pos,
        droppedAt: Date.now(),
        collected: false,
        source: enemyType === 'boss' ? 'boss' : 'monster',
        rarity: getLootDropRarity(item),
        offScreen: false
      });
    }
  }
  
  // ===== ORB DROPS =====
  const orbChance = {
    normal: 0.08,
    elite: 0.20,
    miniboss: 0.40,
    boss: 0.70
  };
  
  if (Math.random() < orbChance[enemyType] * (1 + quantityBonus * 0.3)) {
    // Currency drop rates (within currency category, ignoring scrolls)
    // These rates are normalized to sum to 1.0 for weighted selection
    // Rates are provided as: Rate | Chance%
    // Orb of Transmutation: 0.20831 (20.831%)
    // Orb of Augmentation: 0.10328 (10.328%)
    // Orb of Alteration: 0.05508 (5.508%)
    // Orb of Alchemy: 0.02754 (2.754%)
    // Chaos Orb: 0.01652 (1.652%)
    // Orb of Scouring: 0.01377 (1.377%)
    // Regal Orb: 0.00207 (0.207%)
    // Exalted Orb: 0.00055 (0.055%)
    // Divine Orb: 0.00034 (0.055%)
    const currencyRates: Array<{ type: string; rate: number }> = [
      { type: 'transmutation', rate: 0.20831 },
      { type: 'augmentation', rate: 0.10328 },
      { type: 'alteration', rate: 0.05508 },
      { type: 'alchemy', rate: 0.02754 },
      { type: 'chaos', rate: 0.01652 },
      { type: 'scouring', rate: 0.01377 },
      { type: 'regal', rate: 0.00207 },
      { type: 'exalted', rate: 0.00055 },
      { type: 'divine', rate: 0.00034 }
    ];
    
    // Normalize rates to probabilities
    const totalRate = currencyRates.reduce((sum, item) => sum + item.rate, 0);
    
    // Build cumulative probability thresholds
    let cumulative = 0;
    const thresholds: Array<{ type: string; threshold: number }> = [];
    for (const { type, rate } of currencyRates) {
      cumulative += rate / totalRate;
      thresholds.push({ type, threshold: cumulative });
    }
    
    // Select orb type based on weighted probabilities
    const orbRoll = Math.random();
    let orbType: string = currencyRates[0].type; // fallback
    for (const { type, threshold } of thresholds) {
      if (orbRoll <= threshold) {
        orbType = type;
        break;
      }
    }
    
    // Determine rarity based on orb type
    let orbRarity: 'common' | 'uncommon' | 'rare' | 'epic' = 'common';
    if (orbType === 'transmutation' || orbType === 'augmentation') {
      orbRarity = 'common';
    } else if (orbType === 'alteration' || orbType === 'scouring') {
      orbRarity = 'uncommon';
    } else if (orbType === 'alchemy' || orbType === 'chaos' || orbType === 'regal') {
      orbRarity = 'rare';
    } else if (orbType === 'exalted' || orbType === 'divine') {
      orbRarity = 'epic';
    }
    
    const pos = jitter();
    drops.push({
      id: crypto.randomUUID(),
      type: 'orb',
      orbType,
      orbCount: 1,
      position: pos,
      droppedAt: Date.now(),
      collected: false,
      source: enemyType === 'boss' ? 'boss' : 'monster',
      rarity: orbRarity,
      offScreen: false
    });
  }
  
  // ===== MAP DROPS =====
  // Maps drop at baseline level of current map tier, with 50% chance to upgrade by 1 tier
  if (currentTier > 0) {
    // Map drop rates: normal 2%, miniboss 25%, final boss 100%
    const mapChance = {
      normal: 0.02,    // 2% chance from normal monsters
      elite: 0.02,     // 2% chance from elite monsters (same as normal)
      miniboss: 0.25,  // 25% chance from minibosses
      boss: 1.0        // 100% chance from final boss
    };
    
    // Apply quantity bonus (multiplies the chance, but caps at 100%)
    const baseChance = mapChance[enemyType];
    const modifiedChance = Math.min(1.0, baseChance * (1 + quantityBonus));
    
    if (Math.random() < modifiedChance) {
      // Start with current tier (baseline level of map you're currently in)
      let dropTier = currentTier;
      const maxDropTier = Math.min(currentTier + 1, highestCompleted + 1);
      
      // When a map drops, 50% chance to upgrade by 1 tier
      const upgradeChance = 0.50;
      if (dropTier < maxDropTier && Math.random() < upgradeChance) {
        dropTier = dropTier + 1;
      }
      
      // Ensure we don't drop below current tier
      dropTier = Math.max(currentTier, Math.min(dropTier, maxDropTier));
      
      // Always generate normal/white maps
      const map = generateMap(dropTier);
      const pos = jitter();
      
      drops.push({
        id: crypto.randomUUID(),
        type: 'map',
        map,
        position: pos,
        droppedAt: Date.now(),
        collected: false,
        source: enemyType === 'boss' ? 'boss' : 'monster',
        rarity: 'common', // All maps are white/normal
        offScreen: false
      });
    }
  }
  
  // ===== FRAGMENT DROPS =====
  // Fragments can drop from any tier, but higher tiers have better chances
  // Elite and higher enemies have a chance to drop fragments
  const fragmentBaseChance = {
    normal: 0.0005,      // 0.05% chance from normal enemies
    elite: 0.00375,       // 0.375% chance from elites
    miniboss: 0.02,     // 2% chance from minibosses
    boss: 0.0625          // 6.25% chance from bosses
  };
  
  // Tier scaling: higher tiers have better fragment drop rates
  const tierMultiplier = 1 + (currentTier - 1) * 0.1; // +10% per tier
  const fragmentChance = fragmentBaseChance[enemyType] * tierMultiplier * (1 + quantityBonus * 0.5);
  
  if (Math.random() < fragmentChance) {
    const fragment = generateFragment();
    const pos = jitter();
    
    // Rarer fragments have higher rarity sound/color
    const fragmentRarity = fragment.quantityBonus >= 0.25 ? 'epic' : 
                          fragment.quantityBonus >= 0.20 ? 'rare' : 'uncommon';
    
    drops.push({
      id: crypto.randomUUID(),
      type: 'fragment',
      fragment,
      position: pos,
      droppedAt: Date.now(),
      collected: false,
      source: enemyType === 'boss' ? 'boss' : 'monster',
      rarity: fragmentRarity,
      offScreen: false
    });
  }
  
  return drops;
}

// Generate fragment drops for end-of-dungeon rewards
export function generateFragmentDrops(
  keyLevel: number, 
  success: boolean,
  upgradeLevel: number,
  quantityBonus: number = 0
): Fragment[] {
  const fragments: Fragment[] = [];
  
  if (!success) {
    // Failed runs rarely drop fragments
    if (Math.random() < 0.0125) {
      fragments.push(generateFragment());
    }
    return fragments;
  }
  
  // Base fragment drops for successful runs
  // Higher tiers and upgrade levels increase fragment drops
  const baseChance = 0.0375 + (keyLevel / 100) + (upgradeLevel * 0.1);
  const numRolls = 1 + Math.floor(keyLevel / 10); // Extra roll every 10 levels
  
  for (let i = 0; i < numRolls; i++) {
    if (Math.random() < baseChance * (1 + quantityBonus)) {
      fragments.push(generateFragment());
    }
  }
  
  // Guaranteed fragment at +3 in high tiers
  if (upgradeLevel >= 3 && keyLevel >= 10) {
    fragments.push(generateFragment());
  }
  
  return fragments;
}

