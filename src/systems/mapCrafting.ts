/**
 * Map Crafting System - Path of Exile style map crafting
 * 
 * Functions for applying currency orbs to maps, matching PoE functionality:
 * - Transmutation: Normal -> Magic (1-2 affixes)
 * - Alteration: Reroll magic affixes
 * - Augmentation: Add affix to magic item (if only 1 affix)
 * - Regal: Magic -> Rare (keeps mods, adds 1)
 * - Scouring: Remove all affixes (-> Normal)
 * - Chaos: Reroll rare affixes
 * - Alchemy: Normal -> Rare (4-6 affixes)
 */

import type { MapItem } from '../types/maps';
import { MAP_AFFIXES, rollMapAffixes, updateMapBonuses, generateMapName } from '../types/maps';
import type { OrbType } from '../store/gameStore';

export interface MapCraftResult {
  success: boolean;
  map: MapItem | null;
  message: string;
}

/**
 * Apply an orb to a map and return the modified map
 */
export function applyOrbToMap(map: MapItem, orbType: OrbType): MapCraftResult {
  // Check if map is corrupted - corrupted maps cannot be modified
  if (map.corrupted && orbType !== 'scouring') {
    return {
      success: false,
      map: null,
      message: 'Corrupted maps cannot be modified'
    };
  }

  switch (orbType) {
    case 'transmutation':
      return applyTransmutation(map);
    case 'alteration':
      return applyAlteration(map);
    case 'augmentation':
      return applyAugmentation(map);
    case 'regal':
      return applyRegal(map);
    case 'scouring':
      return applyScouring(map);
    case 'chaos':
      return applyChaos(map);
    case 'alchemy':
      return applyAlchemy(map);
    default:
      return {
        success: false,
        map: null,
        message: `Orb type ${orbType} is not applicable to maps`
      };
  }
}

/**
 * Transmutation: Normal -> Magic (1-2 affixes)
 */
function applyTransmutation(map: MapItem): MapCraftResult {
  if (map.rarity !== 'normal') {
    return {
      success: false,
      map: null,
      message: 'Transmutation can only be used on normal maps'
    };
  }

  const affixes = rollMapAffixes('magic', map.itemLevel);
  const updatedMap: MapItem = {
    ...map,
    rarity: 'magic',
    affixes,
  };
  
  const finalMap = updateMapBonuses(updatedMap);
  finalMap.name = generateMapName(finalMap);

  return {
    success: true,
    map: finalMap,
    message: 'Map upgraded to magic'
  };
}

/**
 * Alteration: Reroll magic affixes
 */
function applyAlteration(map: MapItem): MapCraftResult {
  if (map.rarity !== 'magic') {
    return {
      success: false,
      map: null,
      message: 'Alteration can only be used on magic maps'
    };
  }

  const affixes = rollMapAffixes('magic', map.itemLevel);
  const updatedMap: MapItem = {
    ...map,
    affixes,
  };
  
  const finalMap = updateMapBonuses(updatedMap);
  finalMap.name = generateMapName(finalMap);

  return {
    success: true,
    map: finalMap,
    message: 'Magic affixes rerolled'
  };
}

/**
 * Augmentation: Add affix to magic item (only if it has 1 affix)
 */
function applyAugmentation(map: MapItem): MapCraftResult {
  if (map.rarity !== 'magic') {
    return {
      success: false,
      map: null,
      message: 'Augmentation can only be used on magic maps'
    };
  }

  if (map.affixes.length >= 2) {
    return {
      success: false,
      map: null,
      message: 'Magic maps can only have 2 affixes. Use Regal to upgrade to rare.'
    };
  }

  // Get available affixes (exclude ones already on the map)
  const existingAffixIds = new Set(map.affixes.map(a => a.id));
  const availableAffixes = MAP_AFFIXES.filter(a => !existingAffixIds.has(a.id));

  if (availableAffixes.length === 0) {
    return {
      success: false,
      map: null,
      message: 'No available affixes to add'
    };
  }

  // Pick a random affix
  const newAffix = availableAffixes[Math.floor(Math.random() * availableAffixes.length)];
  const updatedMap: MapItem = {
    ...map,
    affixes: [...map.affixes, newAffix],
  };
  
  const finalMap = updateMapBonuses(updatedMap);
  finalMap.name = generateMapName(finalMap);

  return {
    success: true,
    map: finalMap,
    message: 'Affix added to map'
  };
}

/**
 * Regal: Magic -> Rare (keeps existing mods, adds 1 new affix)
 */
function applyRegal(map: MapItem): MapCraftResult {
  if (map.rarity !== 'magic') {
    return {
      success: false,
      map: null,
      message: 'Regal can only be used on magic maps'
    };
  }

  // Get available affixes (exclude ones already on the map)
  const existingAffixIds = new Set(map.affixes.map(a => a.id));
  const availableAffixes = MAP_AFFIXES.filter(a => !existingAffixIds.has(a.id));

  if (availableAffixes.length === 0) {
    return {
      success: false,
      map: null,
      message: 'No available affixes to add'
    };
  }

  // Pick a random affix to add
  const newAffix = availableAffixes[Math.floor(Math.random() * availableAffixes.length)];
  
  // Roll additional affixes for rare (total 3-6, but we already have magic affixes)
  // For rare maps, we want 3-6 total affixes. If we have 1-2 from magic, we need 2-5 more
  const targetTotal = 3 + Math.floor(Math.random() * 4); // 3-6 total
  const remainingAffixes = Math.max(0, targetTotal - map.affixes.length - 1);
  
  const additionalAffixes: typeof MAP_AFFIXES = [];
  const remainingAvailable = availableAffixes.filter(a => a.id !== newAffix.id);
  
  for (let i = 0; i < remainingAffixes && remainingAvailable.length > 0; i++) {
    const idx = Math.floor(Math.random() * remainingAvailable.length);
    const affix = remainingAvailable[idx];
    additionalAffixes.push(affix);
    remainingAvailable.splice(idx, 1);
  }

  const updatedMap: MapItem = {
    ...map,
    rarity: 'rare',
    affixes: [...map.affixes, newAffix, ...additionalAffixes],
  };
  
  const finalMap = updateMapBonuses(updatedMap);
  finalMap.name = generateMapName(finalMap);

  return {
    success: true,
    map: finalMap,
    message: 'Map upgraded to rare'
  };
}

/**
 * Scouring: Remove all affixes (-> Normal)
 */
function applyScouring(map: MapItem): MapCraftResult {
  if (map.rarity === 'normal' && map.affixes.length === 0) {
    return {
      success: false,
      map: null,
      message: 'Map is already normal'
    };
  }

  const updatedMap: MapItem = {
    ...map,
    rarity: 'normal',
    affixes: [],
    corrupted: false, // Scouring removes corruption too
  };
  
  const finalMap = updateMapBonuses(updatedMap);
  finalMap.name = generateMapName(finalMap);

  return {
    success: true,
    map: finalMap,
    message: 'Map reverted to normal'
  };
}

/**
 * Chaos: Reroll rare affixes
 */
function applyChaos(map: MapItem): MapCraftResult {
  if (map.rarity !== 'rare') {
    return {
      success: false,
      map: null,
      message: 'Chaos can only be used on rare maps'
    };
  }

  const affixes = rollMapAffixes('rare', map.itemLevel);
  const updatedMap: MapItem = {
    ...map,
    affixes,
  };
  
  const finalMap = updateMapBonuses(updatedMap);
  finalMap.name = generateMapName(finalMap);

  return {
    success: true,
    map: finalMap,
    message: 'Rare affixes rerolled'
  };
}

/**
 * Alchemy: Normal -> Rare (4-6 affixes)
 */
function applyAlchemy(map: MapItem): MapCraftResult {
  if (map.rarity !== 'normal') {
    return {
      success: false,
      map: null,
      message: 'Alchemy can only be used on normal maps'
    };
  }

  const affixes = rollMapAffixes('rare', map.itemLevel);
  const updatedMap: MapItem = {
    ...map,
    rarity: 'rare',
    affixes,
  };
  
  const finalMap = updateMapBonuses(updatedMap);
  finalMap.name = generateMapName(finalMap);

  return {
    success: true,
    map: finalMap,
    message: 'Map upgraded to rare'
  };
}

