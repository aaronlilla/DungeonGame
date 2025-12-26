// Engine for evaluating items against loot filter rules
import type { Item, OrbType } from '../types/items';
import type { MapItem, MapFragment } from '../types/maps';
import type { FilterRule, FilterCondition, FilterResult, FilterStyle } from '../types/lootFilter';

/**
 * Evaluate an item against filter rules to determine visibility and styling
 */
export function evaluateItemFilter(
  item: Item | null,
  orbType: OrbType | null,
  orbCount: number,
  map: MapItem | null,
  fragment: MapFragment | null,
  rules: FilterRule[],
  areaLevel: number = 1
): FilterResult {
  // Default result: show with no special styling
  const defaultResult: FilterResult = {
    show: true,
    style: {}
  };
  
  // Try each rule in order (priority matters!)
  for (const rule of rules) {
    if (matchesConditions(item, orbType, orbCount, map, fragment, rule.conditions, areaLevel)) {
      return {
        show: rule.action === 'Show',
        style: rule.style,
        matchedRule: rule
      };
    }
  }
  
  return defaultResult;
}

/**
 * Check if an item matches all conditions in a filter rule
 */
function matchesConditions(
  item: Item | null,
  orbType: OrbType | null,
  orbCount: number,
  map: MapItem | null,
  fragment: MapFragment | null,
  conditions: FilterCondition,
  areaLevel: number
): boolean {
  // Rarity check
  if (conditions.rarity && item) {
    const rarityMap: Record<string, string> = {
      'Normal': 'normal',
      'Magic': 'magic',
      'Rare': 'rare',
      'Unique': 'unique',
      'Legendary': 'legendary'
    };
    
    const matchesRarity = conditions.rarity.some(r => rarityMap[r] === item.rarity);
    if (!matchesRarity) return false;
  }
  
  // BaseType check (item name or base type)
  if (conditions.baseType) {
    let itemName = '';
    
    if (item) {
      // Check both the item name and base type
      itemName = item.name;
      const baseName = item.baseType || '';
      const matches = conditions.baseType.some(baseType => 
        itemName.includes(baseType) || 
        baseName.includes(baseType) ||
        itemName.toLowerCase().includes(baseType.toLowerCase()) ||
        baseName.toLowerCase().includes(baseType.toLowerCase())
      );
      if (!matches) return false;
    } else if (orbType) {
      // Check orb names
      const orbNames: Record<string, string[]> = {
        'transmutation': ['Orb of Transmutation', 'Transmutation'],
        'alteration': ['Orb of Alteration', 'Alteration'],
        'augmentation': ['Orb of Augmentation', 'Augmentation'],
        'alchemy': ['Orb of Alchemy', 'Alchemy'],
        'chaos': ['Chaos Orb', 'Chaos'],
        'exalted': ['Exalted Orb', 'Exalted'],
        'divine': ['Divine Orb', 'Divine'],
        'annulment': ['Orb of Annulment', 'Annulment'],
        'chance': ['Orb of Chance', 'Chance'],
        'scouring': ['Orb of Scouring', 'Scouring'],
        'regret': ['Orb of Regret', 'Regret'],
        'blessed': ['Blessed Orb', 'Blessed'],
        'chromatic': ['Chromatic Orb', 'Chromatic'],
        'jeweller': ["Jeweller's Orb", 'Jeweller'],
        'fusing': ['Orb of Fusing', 'Fusing'],
        'vaal': ['Vaal Orb', 'Vaal']
      };
      
      const possibleNames = orbNames[orbType] || [orbType];
      const matches = conditions.baseType.some(baseType =>
        possibleNames.some(name => 
          name.toLowerCase().includes(baseType.toLowerCase()) ||
          baseType.toLowerCase().includes(name.toLowerCase())
        )
      );
      if (!matches) return false;
    } else if (map) {
      const matches = conditions.baseType.some(baseType =>
        map.name.includes(baseType) ||
        map.name.toLowerCase().includes(baseType.toLowerCase())
      );
      if (!matches) return false;
    } else if (fragment) {
      const matches = conditions.baseType.some(baseType =>
        fragment.name.includes(baseType) ||
        fragment.name.toLowerCase().includes(baseType.toLowerCase())
      );
      if (!matches) return false;
    } else {
      return false;
    }
  }
  
  // Class check
  if (conditions.itemClass) {
    let itemClass = '';
    
    if (item) {
      // Map our slots to PoE classes
      const slotToClass: Record<string, string> = {
        'weapon': 'Weapons',
        'offhand': 'Shields',
        'helmet': 'Helmets',
        'chest': 'Body Armours',
        'gloves': 'Gloves',
        'boots': 'Boots',
        'amulet': 'Amulets',
        'ring': 'Rings',
        'belt': 'Belts'
      };
      
      itemClass = slotToClass[item.slot] || '';
      const matches = conditions.itemClass.some(cls =>
        itemClass.includes(cls) || cls.includes(itemClass)
      );
      if (!matches) return false;
    } else if (orbType) {
      const matches = conditions.itemClass.some(cls =>
        cls === 'Stackable Currency' || cls === 'Currency'
      );
      if (!matches) return false;
    } else if (map) {
      const matches = conditions.itemClass.some(cls =>
        cls === 'Maps' || cls === 'Map'
      );
      if (!matches) return false;
    } else if (fragment) {
      const matches = conditions.itemClass.some(cls =>
        cls === 'Map Fragments' || cls === 'Fragments'
      );
      if (!matches) return false;
    } else {
      return false;
    }
  }
  
  // ItemLevel check
  if (conditions.itemLevel && item) {
    const ilvl = item.itemLevel;
    if (conditions.itemLevel.min !== undefined && ilvl < conditions.itemLevel.min) return false;
    if (conditions.itemLevel.max !== undefined && ilvl > conditions.itemLevel.max) return false;
  }
  
  // Quality check
  if (conditions.quality && item) {
    const quality = item.quality || 0;
    if (conditions.quality.min !== undefined && quality < conditions.quality.min) return false;
    if (conditions.quality.max !== undefined && quality > conditions.quality.max) return false;
  }
  
  // LinkedSockets check (6-link items, etc.)
  if (conditions.linkedSockets !== undefined && item) {
    // For now, we don't have socket data, so skip this check
    // In a full implementation, you'd check item.sockets
  }
  
  // Corrupted check
  if (conditions.corrupted !== undefined && item) {
    if (item.corrupted !== conditions.corrupted) return false;
  }
  
  // StackSize check (for currency)
  if (conditions.stackSize && orbType) {
    if (conditions.stackSize.min !== undefined && orbCount < conditions.stackSize.min) return false;
    if (conditions.stackSize.max !== undefined && orbCount > conditions.stackSize.max) return false;
  }
  
  // AreaLevel check
  if (conditions.areaLevel) {
    if (conditions.areaLevel.min !== undefined && areaLevel < conditions.areaLevel.min) return false;
    if (conditions.areaLevel.max !== undefined && areaLevel > conditions.areaLevel.max) return false;
  }
  
  // MapTier check
  if (conditions.mapTier && map) {
    const tier = map.tier;
    if (conditions.mapTier.min !== undefined && tier < conditions.mapTier.min) return false;
    if (conditions.mapTier.max !== undefined && tier > conditions.mapTier.max) return false;
  }
  
  // All conditions matched!
  return true;
}

/**
 * Get a simplified style object for rendering
 */
export function getDropStyle(filterResult: FilterResult): {
  fontSize: number;
  textColor: string;
  borderColor: string;
  backgroundColor: string;
  borderWidth: number;
} {
  const style = filterResult.style;
  
  return {
    fontSize: style.fontSize || 35,
    textColor: style.textColor || '#c8c8c8',
    borderColor: style.borderColor || '#808080',
    backgroundColor: style.backgroundColor || 'rgba(30, 30, 30, 0.85)',
    borderWidth: 2
  };
}

/**
 * Get beam effect color from filter result
 */
export function getBeamEffect(filterResult: FilterResult): string | null {
  if (!filterResult.style.playEffect) return null;
  
  const effectMap: Record<string, string> = {
    'Red': 'red',
    'Blue': 'blue',
    'Green': 'green',
    'Yellow': 'yellow',
    'Orange': 'orange',
    'Purple': 'purple',
    'Pink': 'pink',
    'White': 'white',
    'Grey': 'grey',
    'Gray': 'grey',
    'Brown': 'brown'
  };
  
  return effectMap[filterResult.style.playEffect] || null;
}

/**
 * Determine if a sound should be played based on filter result
 */
export function getSoundTier(filterResult: FilterResult): number {
  if (!filterResult.style.playAlertSound) return 0;
  return filterResult.style.playAlertSound.id;
}

