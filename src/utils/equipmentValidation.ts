/**
 * Equipment Validation Utilities
 * 
 * Handles weapon slot compatibility logic:
 * - Two-handed weapons block offHand slot
 * - Bows allow quivers in offHand
 * - Quivers can only be equipped with bows
 * - Shields can't be equipped with two-handers
 * - Item stat requirements (str/dex/int/level)
 */

import type { Item } from '../types/items';
import type { ExtendedItem } from '../systems/poeItemAdapter';
import type { PoeItemClass, ItemRequirements } from '../types/poeItems';
import type { BaseStats } from '../types/character';

// Get the item class from an item
export function getItemClass(item: Item): PoeItemClass | null {
  const extItem = item as ExtendedItem;
  return extItem._poeItem?.baseItem?.itemClass || null;
}

// Check if an item is a two-handed weapon
export function isTwoHandedWeapon(item: Item): boolean {
  const itemClass = getItemClass(item);
  if (!itemClass) return false;
  
  const twoHandClasses: PoeItemClass[] = [
    'Two Hand Sword', 'Two Hand Axe', 'Two Hand Mace', 'Staff', 'Warstaff', 'Bow'
  ];
  return twoHandClasses.includes(itemClass);
}

// Check if an item is a bow
export function isBow(item: Item): boolean {
  return getItemClass(item) === 'Bow';
}

// Check if an item is a quiver
export function isQuiver(item: Item): boolean {
  return getItemClass(item) === 'Quiver';
}

// Check if an item is a shield
export function isShield(item: Item): boolean {
  return getItemClass(item) === 'Shield';
}

// Check if an item is an off-hand weapon (for dual-wielding)
export function isOffHandWeapon(item: Item): boolean {
  const itemClass = getItemClass(item);
  if (!itemClass) return false;
  
  // One-handed weapons can be dual-wielded
  const oneHandClasses: PoeItemClass[] = [
    'One Hand Sword', 'Thrusting One Hand Sword', 'One Hand Axe', 'One Hand Mace',
    'Dagger', 'Rune Dagger', 'Claw', 'Wand', 'Sceptre'
  ];
  return oneHandClasses.includes(itemClass);
}

export interface EquipmentValidationResult {
  canEquip: boolean;
  reason?: string;
  slotsToUnequip?: ('mainHand' | 'offHand')[];
}

/**
 * Validate if an item can be equipped in a slot given current equipment
 */
export function validateEquipment(
  item: Item,
  slot: string,
  currentMainHand: Item | null,
  currentOffHand: Item | null
): EquipmentValidationResult {
  const itemClass = getItemClass(item);
  
  // Equipping to mainHand
  if (slot === 'mainHand') {
    if (isTwoHandedWeapon(item)) {
      // Two-handers require offHand to be empty (or will unequip it)
      // Exception: Bows can have quivers
      if (currentOffHand && !(isBow(item) && isQuiver(currentOffHand))) {
        return {
          canEquip: true,
          slotsToUnequip: ['offHand'],
        };
      }
    }
    return { canEquip: true };
  }
  
  // Equipping to offHand
  if (slot === 'offHand') {
    // Check if main hand blocks offHand
    if (currentMainHand && isTwoHandedWeapon(currentMainHand)) {
      // Two-hander is equipped
      if (isBow(currentMainHand)) {
        // Bow is equipped - only quivers allowed
        if (isQuiver(item)) {
          return { canEquip: true };
        }
        return {
          canEquip: false,
          reason: 'Only quivers can be equipped with a bow',
        };
      }
      
      // Other two-hander - nothing allowed in offHand
      return {
        canEquip: false,
        reason: 'Cannot equip off-hand with a two-handed weapon',
      };
    }
    
    // Quiver validation - requires bow
    if (isQuiver(item)) {
      if (!currentMainHand || !isBow(currentMainHand)) {
        return {
          canEquip: false,
          reason: 'Quivers require a bow to be equipped',
        };
      }
      return { canEquip: true };
    }
    
    // Shield or off-hand weapon is fine with one-hander or empty main hand
    return { canEquip: true };
  }
  
  // All other slots have no special restrictions
  return { canEquip: true };
}

/**
 * Check what needs to happen when equipping an item
 * Returns list of slots that will be auto-unequipped
 */
export function getEquipmentSideEffects(
  item: Item,
  slot: string,
  currentMainHand: Item | null,
  currentOffHand: Item | null
): { slotsToUnequip: ('mainHand' | 'offHand')[] } {
  const slotsToUnequip: ('mainHand' | 'offHand')[] = [];
  
  // Equipping a two-hander to mainHand
  if (slot === 'mainHand' && isTwoHandedWeapon(item)) {
    if (currentOffHand) {
      // Bows can keep quivers
      if (isBow(item) && isQuiver(currentOffHand)) {
        // Keep the quiver
      } else {
        slotsToUnequip.push('offHand');
      }
    }
  }
  
  // Equipping something to offHand when a non-bow two-hander is equipped
  // This case is actually blocked, but handled for completeness
  
  return { slotsToUnequip };
}

/**
 * Get item requirements from a PoE-style item
 */
export function getItemRequirements(item: Item): ItemRequirements | null {
  const extItem = item as ExtendedItem;
  return extItem._poeItem?.baseItem?.requirements || null;
}

export interface RequirementsCheckResult {
  meetsRequirements: boolean;
  missingRequirements: {
    level?: { required: number; current: number };
    strength?: { required: number; current: number };
    dexterity?: { required: number; current: number };
    intelligence?: { required: number; current: number };
  };
}

/**
 * Check if a character meets the stat requirements for an item
 * @param item The item to check requirements for
 * @param characterLevel The character's level
 * @param characterStats The character's stats (including equipment bonuses)
 * @returns Object indicating if requirements are met and what's missing
 */
export function checkItemRequirements(
  item: Item,
  characterLevel: number,
  characterStats: Pick<BaseStats, 'strength' | 'dexterity' | 'intelligence'>
): RequirementsCheckResult {
  const requirements = getItemRequirements(item);
  
  // No requirements = always meets
  if (!requirements) {
    return { meetsRequirements: true, missingRequirements: {} };
  }
  
  const missingRequirements: RequirementsCheckResult['missingRequirements'] = {};
  let meetsAll = true;
  
  // Check level requirement
  if (requirements.level > 0 && characterLevel < requirements.level) {
    meetsAll = false;
    missingRequirements.level = {
      required: requirements.level,
      current: characterLevel,
    };
  }
  
  // Check strength requirement
  if (requirements.strength > 0 && characterStats.strength < requirements.strength) {
    meetsAll = false;
    missingRequirements.strength = {
      required: requirements.strength,
      current: characterStats.strength,
    };
  }
  
  // Check dexterity requirement
  if (requirements.dexterity > 0 && characterStats.dexterity < requirements.dexterity) {
    meetsAll = false;
    missingRequirements.dexterity = {
      required: requirements.dexterity,
      current: characterStats.dexterity,
    };
  }
  
  // Check intelligence requirement
  if (requirements.intelligence > 0 && characterStats.intelligence < requirements.intelligence) {
    meetsAll = false;
    missingRequirements.intelligence = {
      required: requirements.intelligence,
      current: characterStats.intelligence,
    };
  }
  
  return { meetsRequirements: meetsAll, missingRequirements };
}

