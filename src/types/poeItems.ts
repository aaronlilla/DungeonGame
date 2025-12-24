// Path of Exile style item types - parsed from official data

// ===== ITEM CLASSES =====
// Categories of equipment that can drop/be equipped
export type PoeItemClass = 
  // Armor
  | 'Body Armour'
  | 'Helmet'
  | 'Gloves'
  | 'Boots'
  | 'Shield'
  // Weapons - One Hand
  | 'One Hand Sword'
  | 'Thrusting One Hand Sword'
  | 'One Hand Axe'
  | 'One Hand Mace'
  | 'Dagger'
  | 'Rune Dagger'
  | 'Claw'
  | 'Wand'
  | 'Sceptre'
  // Weapons - Two Hand
  | 'Two Hand Sword'
  | 'Two Hand Axe'
  | 'Two Hand Mace'
  | 'Staff'
  | 'Warstaff'
  | 'Bow'
  // Jewellery
  | 'Amulet'
  | 'Ring'
  | 'Belt'
  // Other
  | 'Quiver'
  | 'Jewel'
  | 'AbyssJewel';

// ===== ARMOR DEFENCE TYPES =====
// PoE armour bases have different defense types based on stat requirements
export type DefenceType = 'armour' | 'evasion' | 'energy_shield' | 'ward';

export interface DefenceRange {
  min: number;
  max: number;
}

// ===== WEAPON PROPERTIES =====
export interface WeaponProperties {
  attack_time: number;           // Attack speed in ms (1000 = 1.0 attacks/sec)
  critical_strike_chance: number; // Crit chance * 100 (500 = 5.00%)
  physical_damage_min: number;
  physical_damage_max: number;
  range: number;                  // Weapon range (melee: 9-13, ranged: 120)
}

// ===== ARMOUR PROPERTIES =====
export interface ArmourProperties {
  armour?: DefenceRange;
  evasion?: DefenceRange;
  energy_shield?: DefenceRange;
  ward?: DefenceRange;
  block?: number;                // For shields (e.g., 25 = 25%)
  movement_speed?: number;       // Movement penalty (e.g., -3 = -3%)
}

// ===== SHIELD PROPERTIES =====
export interface ShieldProperties extends ArmourProperties {
  block: number; // Required for shields
}

// ===== REQUIREMENTS =====
export interface ItemRequirements {
  level: number;
  strength: number;
  dexterity: number;
  intelligence: number;
}

// ===== IMPLICIT MOD REFERENCE =====
// References a mod in mods.json that provides the implicit
export interface ImplicitModRef {
  id: string;                    // Mod ID in mods.json
  statId: string;                // The stat granted (e.g., "base_maximum_life")
  min: number;                   // Min value
  max: number;                   // Max value
}

// ===== BASE ITEM =====
// A base item type (e.g., "Iron Ring", "Leather Belt", "Rusted Sword")
export interface PoeBaseItem {
  id: string;                    // Internal ID (e.g., "Metadata/Items/Rings/Ring1")
  name: string;                  // Display name (e.g., "Iron Ring")
  itemClass: PoeItemClass;       // Item category
  dropLevel: number;             // Minimum level to drop
  inventoryWidth: number;        // Grid width (1-2)
  inventoryHeight: number;       // Grid height (1-4)
  requirements: ItemRequirements | null;
  
  // Properties vary by item type
  properties: WeaponProperties | ArmourProperties | Record<string, unknown>;
  
  // Implicit mods built into the base item
  implicits: string[];           // IDs referencing mods.json
  
  // Tags for mod generation
  tags: string[];
  
  // Visual info
  visualIdentity?: {
    ddsFile: string;
    id: string;
  };
}

// ===== PARSED MOD =====
// A mod that can be an implicit or affix
export interface PoeMod {
  id: string;
  name: string;
  domain?: string;                // 'item', 'abyss_jewel', etc.
  generationType?: string;        // 'prefix', 'suffix', 'unique' (for implicits)
  requiredLevel: number;
  stats: {
    id: string;
    min: number;
    max: number;
  }[];
  groups?: string[];              // Mod groups (for mutual exclusion)
  implicitTags?: string[];        // Tags for mod filtering
  spawnWeights?: {
    tag: string;
    weight: number;
  }[];
}

// ===== STAT TRANSLATION =====
// How to display a stat to the user
export interface StatTranslation {
  id: string;
  text: string;                  // Format string with {0}, {1}, etc.
  formatType: 'number' | 'percent' | 'per_minute';
}

// ===== HELPER FUNCTIONS =====

// Convert attack_time (ms) to attacks per second
export function attackTimeToAPS(attackTime: number): number {
  return 1000 / attackTime;
}

// Convert critical_strike_chance to percentage
export function critToPercent(crit: number): number {
  return crit / 100;
}

// Get average physical damage
export function getAveragePhysDamage(props: WeaponProperties): number {
  return (props.physical_damage_min + props.physical_damage_max) / 2;
}

// Calculate weapon DPS
export function calculateWeaponDPS(props: WeaponProperties): number {
  const avgDamage = getAveragePhysDamage(props);
  const aps = attackTimeToAPS(props.attack_time);
  return avgDamage * aps;
}

// Get average armour value from range
export function getAverageDefence(range: DefenceRange | undefined): number {
  if (!range) return 0;
  return (range.min + range.max) / 2;
}

// Determine defence type from item tags
export function getDefenceTypeFromTags(tags: string[]): DefenceType[] {
  const types: DefenceType[] = [];
  if (tags.includes('str_armour')) types.push('armour');
  if (tags.includes('dex_armour')) types.push('evasion');
  if (tags.includes('int_armour')) types.push('energy_shield');
  if (tags.includes('str_dex_armour')) { types.push('armour'); types.push('evasion'); }
  if (tags.includes('str_int_armour')) { types.push('armour'); types.push('energy_shield'); }
  if (tags.includes('dex_int_armour')) { types.push('evasion'); types.push('energy_shield'); }
  if (tags.includes('str_dex_int_armour')) { types.push('armour'); types.push('evasion'); types.push('energy_shield'); }
  return types;
}

// Check if an item class is a weapon
export function isWeaponClass(itemClass: PoeItemClass): boolean {
  const weaponClasses: PoeItemClass[] = [
    'One Hand Sword', 'Thrusting One Hand Sword', 'One Hand Axe', 'One Hand Mace',
    'Dagger', 'Rune Dagger', 'Claw', 'Wand', 'Sceptre',
    'Two Hand Sword', 'Two Hand Axe', 'Two Hand Mace', 'Staff', 'Warstaff', 'Bow'
  ];
  return weaponClasses.includes(itemClass);
}

// Check if an item class is armour
export function isArmourClass(itemClass: PoeItemClass): boolean {
  const armourClasses: PoeItemClass[] = [
    'Body Armour', 'Helmet', 'Gloves', 'Boots', 'Shield'
  ];
  return armourClasses.includes(itemClass);
}

// Check if an item class is jewellery
export function isJewelleryClass(itemClass: PoeItemClass): boolean {
  const jewelleryClasses: PoeItemClass[] = [
    'Amulet', 'Ring', 'Belt'
  ];
  return jewelleryClasses.includes(itemClass);
}

// Check if item is one-handed
export function isOneHanded(itemClass: PoeItemClass): boolean {
  const oneHandClasses: PoeItemClass[] = [
    'One Hand Sword', 'Thrusting One Hand Sword', 'One Hand Axe', 'One Hand Mace',
    'Dagger', 'Rune Dagger', 'Claw', 'Wand', 'Sceptre'
  ];
  return oneHandClasses.includes(itemClass);
}

// Check if item is two-handed
export function isTwoHanded(itemClass: PoeItemClass): boolean {
  const twoHandClasses: PoeItemClass[] = [
    'Two Hand Sword', 'Two Hand Axe', 'Two Hand Mace', 'Staff', 'Warstaff', 'Bow'
  ];
  return twoHandClasses.includes(itemClass);
}

// Map PoE item class to our gear slot
export function poeItemClassToGearSlot(itemClass: PoeItemClass): string {
  const mapping: Record<PoeItemClass, string> = {
    'Body Armour': 'chest',
    'Helmet': 'head',
    'Gloves': 'hands',
    'Boots': 'feet',
    'Shield': 'offHand',
    'One Hand Sword': 'mainHand',
    'Thrusting One Hand Sword': 'mainHand',
    'One Hand Axe': 'mainHand',
    'One Hand Mace': 'mainHand',
    'Dagger': 'mainHand',
    'Rune Dagger': 'mainHand',
    'Claw': 'mainHand',
    'Wand': 'mainHand',
    'Sceptre': 'mainHand',
    'Two Hand Sword': 'mainHand',
    'Two Hand Axe': 'mainHand',
    'Two Hand Mace': 'mainHand',
    'Staff': 'mainHand',
    'Warstaff': 'mainHand',
    'Bow': 'mainHand',
    'Amulet': 'neck',
    'Ring': 'ring1',
    'Belt': 'waist',
    'Quiver': 'offHand',
    'Jewel': 'trinket1',
    'AbyssJewel': 'trinket1',
  };
  return mapping[itemClass] || 'mainHand';
}

