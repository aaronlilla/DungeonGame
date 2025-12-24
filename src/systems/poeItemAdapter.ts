/**
 * Adapter to convert between the new PoE item system and the existing Item type
 * This allows gradual migration to the full PoE system
 */

import type { Item, ItemRarity, GearSlot, ItemAffix } from '../types/items';
import type { PoeItem, RolledAffix } from './poeCrafting';
import { poeItemClassToGearSlot } from '../types/poeItems';
import type { PoeBaseItem, PoeItemClass } from '../types/poeItems';

/**
 * Convert a RolledAffix to the legacy ItemAffix format
 */
function convertAffixToLegacy(affix: RolledAffix, index: number): ItemAffix {
  // Use the first stat value, or 0 if none
  const firstStat = affix.stats[0];
  let value = 0;
  
  if (firstStat) {
    if (Array.isArray(firstStat.value)) {
      // For damage ranges, use average
      value = Math.floor((firstStat.value[0] + firstStat.value[1]) / 2);
    } else {
      value = firstStat.value;
    }
  }
  
  return {
    definitionId: `poe_${affix.group}_${index}`,
    tier: Math.floor(affix.ilvl / 10) + 1, // Estimate tier from ilvl
    value,
    // Store the full stat text for display
    _poeStats: affix.stats.map(s => s.text),
    _poeName: affix.name,
  } as ItemAffix & { _poeStats?: string[]; _poeName?: string };
}

/**
 * Map PoeItemClass to GearSlot
 */
function poeClassToSlot(itemClass: PoeItemClass): GearSlot {
  return poeItemClassToGearSlot(itemClass) as GearSlot;
}

/**
 * Convert a PoeItem to the legacy Item format for UI compatibility
 */
export function poeItemToLegacyItem(poeItem: PoeItem): Item {
  const slot = poeClassToSlot(poeItem.baseItem.itemClass);
  
  // Convert rarity
  const rarityMap: Record<string, ItemRarity> = {
    'normal': 'normal',
    'magic': 'magic',
    'rare': 'rare',
    'unique': 'unique',
  };
  
  // Convert affixes
  const prefixes = poeItem.prefixes.map((a, i) => convertAffixToLegacy(a, i));
  const suffixes = poeItem.suffixes.map((a, i) => convertAffixToLegacy(a, i));
  
  // Convert implicit if present
  let implicit: ItemAffix | undefined;
  if (poeItem.implicits.length > 0) {
    implicit = convertAffixToLegacy(poeItem.implicits[0], 0);
  }
  
  return {
    id: poeItem.id,
    baseId: poeItem.baseItem.id,
    name: poeItem.name,
    rarity: rarityMap[poeItem.rarity] || 'normal',
    itemLevel: poeItem.itemLevel,
    prefixes,
    suffixes,
    implicit,
    corrupted: poeItem.corrupted,
    quality: poeItem.quality,
    sockets: 0, // TODO: Add socket system
    slot, // Add the slot for UI compatibility
    // Store the full PoeItem for later retrieval
    _poeItem: poeItem,
  } as Item & { slot: GearSlot; _poeItem?: PoeItem };
}

/**
 * Convert legacy Item to PoeItem (if it was originally a PoeItem)
 */
export function legacyItemToPoeItem(item: Item & { _poeItem?: PoeItem }): PoeItem | null {
  return item._poeItem || null;
}

/**
 * Extended Item type with PoE data
 */
export interface ExtendedItem extends Item {
  slot: GearSlot;
  _poeItem?: PoeItem;
  _poeStats?: string[];
}

/**
 * Get display stats for an item (works with both legacy and PoE items)
 */
export function getItemDisplayStats(item: Item | ExtendedItem): string[] {
  const stats: string[] = [];
  const extItem = item as ExtendedItem;
  
  // Check for PoE item data
  if (extItem._poeItem) {
    // Add implicits
    for (const implicit of extItem._poeItem.implicits) {
      for (const stat of implicit.stats) {
        stats.push(stat.text);
      }
    }
    
    // Add explicit mods
    for (const prefix of extItem._poeItem.prefixes) {
      for (const stat of prefix.stats) {
        stats.push(stat.text);
      }
    }
    
    for (const suffix of extItem._poeItem.suffixes) {
      for (const stat of suffix.stats) {
        stats.push(stat.text);
      }
    }
    
    return stats;
  }
  
  // Fall back to legacy format
  const allAffixes = [
    ...(item.implicit ? [item.implicit] : []),
    ...item.prefixes,
    ...item.suffixes
  ];
  
  for (const affix of allAffixes) {
    const extAffix = affix as ItemAffix & { _poeStats?: string[] };
    if (extAffix._poeStats) {
      stats.push(...extAffix._poeStats);
    } else {
      stats.push(`${affix.definitionId}: +${affix.value}`);
    }
  }
  
  return stats;
}

/**
 * Get the base item name for display
 */
export function getItemBaseName(item: Item | ExtendedItem): string {
  const extItem = item as ExtendedItem;
  if (extItem._poeItem) {
    return extItem._poeItem.baseItem.name;
  }
  return item.baseId.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
}

/**
 * Check if an item has PoE data
 */
export function isPoeItem(item: Item): item is ExtendedItem {
  return '_poeItem' in item && (item as ExtendedItem)._poeItem !== undefined;
}

