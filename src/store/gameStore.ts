import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';
import type { 
  CharacterRole, 
  Item, 
  DungeonKey, 
  DungeonRoute,
  DungeonRunResult,
  MapItem,
  Fragment,
  LootDrop,
  LeagueEncounter
} from '../types';
import type { LootFilterConfig } from '../types/lootFilter';
import { generateMap } from '../types/maps';
import { createCharacter, type Character, calculateBaseLifeFromLevel, calculateBaseManaFromLevel, calculateLifeFromStrength, calculateManaFromIntelligence, calculateAccuracyFromDexterity, calculateEvasionBonus } from '../types/character';
import { SAMPLE_DUNGEON } from '../types/dungeon';
import { generateRandomItem } from '../systems/crafting';
import { SKILL_GEMS, SUPPORT_GEMS, getSkillGemById, getSupportGemById, canSupportApplyToSkill, getDefaultSupportGemForSkill } from '../types/skills';
import { addExperienceToCharacter as addExpToChar } from '../utils/leveling';
import { createSmartSkillConfig, type SkillUsageConfig } from '../types/skillUsage';
import type { TalentTierLevel } from '../types/talents';
import { getItemGridSize, type GearSlot } from '../types/items';
import { canPlaceItem, buildOccupancyGrid, findAvailablePosition } from '../utils/gridUtils';
import { applyOrbToItem } from '../systems/crafting';
import { applyOrbToMap as craftMap } from '../systems/mapCrafting';
import { validateEquipment, getEquipmentSideEffects, checkItemRequirements } from '../utils/equipmentValidation';
import { calculateTotalCharacterStats } from '../systems/equipmentStats';
import { getClassById } from '../types/classes';
import { ALL_POE_BASE_ITEMS } from '../data/poeBaseItems';
import { generatePoeItem } from '../systems/poeCrafting';
import { poeItemToLegacyItem } from '../systems/poeItemAdapter';
import type { PoeItemClass } from '../types/poeItems';
import { getDefenceTypeFromTags, isTwoHanded } from '../types/poeItems';

// ===== STASH TAB TYPES =====

// An item placed in the stash grid
export interface StashItem {
  itemId: string;
  x: number;  // Grid column (0-23)
  y: number;  // Grid row (0-23)
}

// A stash tab with 24x24 grid
export interface StashTab {
  id: string;
  name: string;
  items: StashItem[];  // Items with grid positions
  color?: string;      // Tab color customization
}

// Stash grid constants
export const STASH_GRID_SIZE = 24;
export const DEFAULT_STASH_TAB_COUNT = 12;

// Crafting orb types
export type OrbType = 
  | 'transmutation'  // Normal -> Magic
  | 'alteration'     // Reroll magic affixes
  | 'augmentation'   // Add affix to magic item
  | 'alchemy'        // Normal -> Rare
  | 'chaos'          // Reroll rare affixes
  | 'exalted'        // Add affix to rare item
  | 'annulment'      // Remove random affix
  | 'scouring'       // Remove all affixes (-> Normal)
  | 'regal'          // Magic -> Rare (keeps mods, adds 1)
  | 'divine';        // Reroll values of explicit mods on rare items

export interface CraftingOrb {
  type: OrbType;
  name: string;
  description: string;
  icon: string;
}

export const CRAFTING_ORBS: CraftingOrb[] = [
  { type: 'transmutation', name: 'Transmutation', description: 'Upgrades a normal item to magic', icon: '🔵' },
  { type: 'alteration', name: 'Alteration', description: 'Rerolls affixes on a magic item', icon: '🔄' },
  { type: 'augmentation', name: 'Augmentation', description: 'Adds an affix to a magic item', icon: '➕' },
  { type: 'alchemy', name: 'Alchemy', description: 'Upgrades a normal item to rare', icon: '🟡' },
  { type: 'chaos', name: 'Chaos', description: 'Rerolls all affixes on a rare item', icon: '🌀' },
  { type: 'exalted', name: 'Exalted', description: 'Adds an affix to a rare item', icon: '⭐' },
  { type: 'annulment', name: 'Annulment', description: 'Removes a random affix', icon: '❌' },
  { type: 'scouring', name: 'Scouring', description: 'Removes all affixes, reverts to normal', icon: '⚪' },
  { type: 'regal', name: 'Regal', description: 'Upgrades magic item to rare, adds one affix', icon: '🔶' },
  { type: 'divine', name: 'Divine', description: 'Rerolls the values of explicit modifiers on rare items', icon: '💎' }
];

// Game state
export interface GameState {
  // Team
  team: Character[];
  teamSlotAssignments: Record<number, string>; // slotIndex -> characterId
  selectedCharacterId: string | null;
  
  // Inventory & Stash
  inventory: Item[];           // All items (master list)
  stashTabs: StashTab[];       // 12 stash tabs with 24x24 grid each
  
  // Currency
  gold: number;
  orbs: Record<OrbType, number>;
  
  // Skill gems owned
  ownedSkillGems: string[];
  ownedSupportGems: string[];
  
  // Dungeon
  availableKeys: DungeonKey[];
  savedRoutes: DungeonRoute[];
  currentRoute: DungeonRoute | null;
  dungeonHistory: DungeonRunResult[];
  highestKeyCompleted: number;
  highestMapTierCompleted: number;
  
  // Map System
  mapStash: MapItem[];              // All owned maps
  fragmentCounts: Record<string, number>;  // Fragment counts by baseId
  mapDeviceMap: MapItem | null;     // Map currently in device
  mapDeviceFragments: (Fragment | null)[];  // Fragments in device (6 slots)
  activatedMap: MapItem | null;     // Map that has been activated for current run
  pendingLoot: LootDrop[];          // Loot dropped during dungeon run
  activeLeagueEncounters: LeagueEncounter[];  // League mechanics in current map
  
  // UI State
  activeTab: 'team' | 'skills' | 'gear' | 'crafting' | 'talents' | 'dungeon' | 'stash' | 'maps';
  volume: number; // Audio volume (0-1)
  
  // Loot Filter
  lootFilter: LootFilterConfig | null;
  lootFilterEnabled: boolean;
  
  // Actions
  addCharacter: (name: string, role: CharacterRole, classId?: import('../types/classes').CharacterClassId, slotIndex?: number) => void;
  removeCharacter: (id: string) => void;
  selectCharacter: (id: string | null) => void;
  updateCharacter: (id: string, updates: Partial<Character>) => void;
  
  equipItem: (characterId: string, slot: GearSlot, itemId: string) => void;
  unequipItem: (characterId: string, slot: GearSlot) => void;
  addItemToInventory: (item: Item) => void;
  removeItemFromInventory: (itemId: string) => void;
  
  // Stash actions
  addItemToStash: (tabId: string, itemId: string, x: number, y: number) => boolean;
  removeItemFromStash: (tabId: string, itemId: string) => void;
  removeDuplicateItems: () => void;
  moveItemInStash: (tabId: string, itemId: string, newX: number, newY: number, excludeItemId?: string) => boolean;
  swapItemsInStash: (tabId: string, itemId1: string, x1: number, y1: number, itemId2: string, x2: number, y2: number) => void;
  moveItemBetweenTabs: (fromTabId: string, toTabId: string, itemId: string, x: number, y: number) => boolean;
  setActiveStashTab: (tabId: string) => void;
  clearStash: () => void;
  activeStashTabId: string | null;
  
  equipSkillGem: (characterId: string, slotIndex: number, skillGemId: string) => void;
  unequipSkillGem: (characterId: string, slotIndex: number) => void;
  equipSupportGem: (characterId: string, skillSlotIndex: number, supportSlotIndex: number, supportGemId: string) => void;
  unequipSupportGem: (characterId: string, skillSlotIndex: number, supportSlotIndex: number) => void;
  updateSkillUsageConfig: (characterId: string, slotIndex: number, config: SkillUsageConfig) => void;
  
  allocatePassive: (characterId: string, nodeId: string) => void;
  deallocatePassive: (characterId: string, nodeId: string) => void;
  resetPassives: (characterId: string) => void;
  
  // MoP-style talents
  selectTalent: (characterId: string, tierLevel: TalentTierLevel, talentId: string) => void;
  deselectTalent: (characterId: string, tierLevel: TalentTierLevel) => void;
  resetTalents: (characterId: string) => void;
  
  addOrbs: (orbs: Partial<Record<OrbType, number>>) => void;
  useOrb: (orbType: OrbType, itemId: string) => void;
  applyOrbToItemAction: (itemId: string, orbType: OrbType) => { success: boolean; message: string };
  
  setActiveTab: (tab: GameState['activeTab']) => void;
  setVolume: (volume: number) => void;
  setLootFilter: (filter: LootFilterConfig | null) => void;
  setLootFilterEnabled: (enabled: boolean) => void;
  
  addKey: (key: DungeonKey) => void;
  saveRoute: (route: DungeonRoute) => void;
  setCurrentRoute: (route: DungeonRoute | null) => void;
  
  completeDungeonRun: (result: DungeonRunResult) => void;
  
  // Map System actions
  addMap: (map: MapItem) => void;
  removeMap: (mapId: string) => void;
  clearAllMaps: () => void;
  moveMapInStash: (mapId: string, x: number, y: number) => boolean;
  applyOrbToMap: (mapId: string, orbType: OrbType) => { success: boolean; message: string };
  addFragment: (fragment: Fragment) => void;
  removeFragment: (fragmentId: string) => void;
  setMapDeviceMap: (map: MapItem | null) => void;
  setMapDeviceFragment: (slotIndex: number, fragment: Fragment | null) => void;
  clearMapDevice: () => void;
  activateMap: () => void;
  clearActivatedMap: () => void;
  addLootDrop: (drop: LootDrop) => void;
  collectLoot: (dropId: string) => void;
  collectAllPendingLoot: () => void;
  setActiveLeagueEncounters: (encounters: LeagueEncounter[]) => void;
  completeLeagueEncounter: (encounterId: string) => void;
  applyDeathPenalty: (characterId: string) => void;
  
  // Experience and leveling
  addExperienceToCharacter: (characterId: string, experience: number) => { leveledUp: boolean; newLevel: number; levelsGained: number } | null;
  
  // Initialize starter content
  initializeNewGame: () => void;
}

/**
 * Generate starter items for a character using real PoE base items
 * Returns a map of slot -> item for all gear slots
 * All items are normal (white) rarity except one randomly selected magic item
 */
function generateStarterItems(character: Character): Map<GearSlot, Item> {
  const items = new Map<GearSlot, Item>();
  const classData = character.classId ? getClassById(character.classId) : null;
  const level = character.level || 2;
  
  // For DPS characters without a class, infer build type from stats
  // (Stats are already adjusted in addCharacter, so we can infer from them)
  let dpsBuildType: 'caster' | 'attack_melee' | 'attack_ranged' | null = null;
  let dpsDefenseType: 'armor' | 'evasion' | 'energyShield' | 'hybrid' | null = null;
  let dpsMeleeStyle: 'one_handed' | 'two_handed' | 'dual_wield' | null = null;
  
  if (character.role === 'dps' && !classData) {
    // Infer build type from stats (which were set in addCharacter)
    const str = character.baseStats.strength;
    const dex = character.baseStats.dexterity;
    const int = character.baseStats.intelligence;
    
    // Determine build type based on highest stat
    if (int > str && int > dex && int > 30) {
      // Caster (high intelligence)
      dpsBuildType = 'caster';
      // Casters prefer energy shield, but can also use hybrid
      const defenseRoll = Math.random();
      if (defenseRoll < 0.6) {
        dpsDefenseType = 'energyShield';
      } else if (defenseRoll < 0.85) {
        dpsDefenseType = 'hybrid'; // ES + armor or ES + evasion
      } else {
        dpsDefenseType = Math.random() < 0.5 ? 'armor' : 'evasion';
      }
    } else if (dex > str && dex > 30) {
      // Ranged attack (high dexterity)
      dpsBuildType = 'attack_ranged';
      // Ranged characters prefer evasion
      const defenseRoll = Math.random();
      if (defenseRoll < 0.5) {
        dpsDefenseType = 'evasion';
      } else if (defenseRoll < 0.8) {
        dpsDefenseType = 'hybrid'; // Evasion + armor
      } else {
        dpsDefenseType = 'armor';
      }
    } else {
      // Melee attack (high strength)
      dpsBuildType = 'attack_melee';
      // Melee characters prefer armor, but can use others
      const defenseRoll = Math.random();
      if (defenseRoll < 0.5) {
        dpsDefenseType = 'armor';
      } else if (defenseRoll < 0.75) {
        dpsDefenseType = 'hybrid'; // Armor + evasion
      } else {
        dpsDefenseType = Math.random() < 0.5 ? 'evasion' : 'energyShield';
      }
      
      // For melee, choose one-handed, two-handed, or dual wield
      const meleeRoll = Math.random();
      if (meleeRoll < 0.4) {
        dpsMeleeStyle = 'two_handed';
      } else if (meleeRoll < 0.7) {
        dpsMeleeStyle = 'dual_wield';
      } else {
        dpsMeleeStyle = 'one_handed';
      }
    }
  }
  
  // Determine defense type preference from class or DPS build
  let defensePool: 'armor' | 'evasion' | 'energyShield' = classData?.defensePool || 'armor';
  if (dpsDefenseType && dpsDefenseType !== 'hybrid') {
    defensePool = dpsDefenseType;
  } else if (dpsDefenseType === 'hybrid') {
    // For hybrid, randomly pick a primary defense type (items will still be filtered appropriately)
    const hybridRoll = Math.random();
    if (hybridRoll < 0.33) {
      defensePool = 'armor';
    } else if (hybridRoll < 0.66) {
      defensePool = 'evasion';
    } else {
      defensePool = 'energyShield';
    }
  }
  
  const isIntBased = classData ? (classData.statModifiers.intelligence || 0) > 30 : (dpsBuildType === 'caster');
  const hasBlock = classData?.mitigationTypes?.includes('block') || false;
  
  // Helper to filter PoE base items by defense type
  const filterByDefenseType = (bases: typeof ALL_POE_BASE_ITEMS, defenseType: 'armor' | 'evasion' | 'energyShield' | 'hybrid'): typeof ALL_POE_BASE_ITEMS => {
    return bases.filter(base => {
      const defenseTypes = getDefenceTypeFromTags(base.tags);
      if (defenseType === 'armor') {
        return defenseTypes.includes('armour');
      } else if (defenseType === 'evasion') {
        return defenseTypes.includes('evasion');
      } else if (defenseType === 'energyShield') {
        return defenseTypes.includes('energy_shield');
      } else if (defenseType === 'hybrid') {
        // For hybrid, accept items with any defense type (armor, evasion, or energy shield)
        return defenseTypes.length > 0 && (
          defenseTypes.includes('armour') || 
          defenseTypes.includes('evasion') || 
          defenseTypes.includes('energy_shield')
        );
      }
      return true;
    });
  };
  
  // Helper to filter out talismans
  const filterTalismans = (bases: typeof ALL_POE_BASE_ITEMS): typeof ALL_POE_BASE_ITEMS => {
    return bases.filter(b => {
      const hasTalismanTag = b.tags?.some(tag => tag.toLowerCase().includes('talisman')) || false;
      const isTalismanClass = b.itemClass?.toLowerCase().includes('talisman') || false;
      const isTalismanName = b.name?.toLowerCase().includes('talisman') || false;
      return !hasTalismanTag && !isTalismanClass && !isTalismanName;
    });
  };
  
  // Helper to get appropriate PoE base item for a slot
  const getPoeBaseForSlot = (_slot: GearSlot, itemClass: PoeItemClass): typeof ALL_POE_BASE_ITEMS[0] | null => {
    // Get all bases for this item class at appropriate level, excluding talismans
    // For low levels, allow items slightly above character level to provide variety
    // This prevents level 2 characters from only getting Iron Rings
    const maxDropLevel = level <= 5 ? level + 3 : level;
    let candidates = ALL_POE_BASE_ITEMS.filter(b => 
      b.itemClass === itemClass && b.dropLevel <= maxDropLevel
    );
    
    // Filter out talismans
    candidates = filterTalismans(candidates);
    
    if (candidates.length === 0) return null;
    
    // Filter by defense type for armor pieces
    if (['Helmet', 'Body Armour', 'Gloves', 'Boots', 'Shield'].includes(itemClass)) {
      // Use DPS defense type if available, otherwise use defensePool
      const filterType = dpsDefenseType === 'hybrid' ? 'hybrid' : (dpsDefenseType || defensePool);
      candidates = filterByDefenseType(candidates, filterType);
      // If no matches, fall back to any defense type (but still exclude talismans)
      if (candidates.length === 0) {
        candidates = ALL_POE_BASE_ITEMS.filter(b => 
          b.itemClass === itemClass && b.dropLevel <= maxDropLevel
        );
        candidates = filterTalismans(candidates);
      }
    }
    
    // For shields, prefer armor shields for block tanks
    if (itemClass === 'Shield' && hasBlock && character.role === 'tank') {
      const armorShields = filterByDefenseType(candidates, 'armor');
      if (armorShields.length > 0) {
        candidates = armorShields;
      }
    }
    
    // Sort by level proximity, then randomly select from the top tier
    // This adds variety while still preferring level-appropriate items
    candidates.sort((a, b) => {
      const aDiff = Math.abs(level - a.dropLevel);
      const bDiff = Math.abs(level - b.dropLevel);
      return aDiff - bDiff;
    });
    
    // Pick randomly from the top 3 closest-level items (or all if less than 3)
    // This adds variety while keeping items level-appropriate
    const topTierCount = Math.min(3, candidates.length);
    const topTier = candidates.slice(0, topTierCount);
    const selected = topTier[Math.floor(Math.random() * topTier.length)];
    
    return selected || candidates[0] || null;
  };
  
  // Helper to get item class for a slot
  const getItemClassForSlot = (slot: GearSlot): PoeItemClass | null => {
    switch (slot) {
      case 'head': return 'Helmet';
      case 'chest': return 'Body Armour';
      case 'hands': return 'Gloves';
      case 'feet': return 'Boots';
      case 'waist': return 'Belt';
      case 'mainHand': 
        // Handle DPS build types
        if (dpsBuildType === 'caster') {
          // Casters get Staff if available, otherwise Wand
          const staffCandidates = ALL_POE_BASE_ITEMS.filter(b => 
            b.itemClass === 'Staff' && b.dropLevel <= level
          );
          if (staffCandidates.length > 0) {
            return 'Staff';
          }
          return 'Wand';
        } else if (dpsBuildType === 'attack_ranged') {
          // Ranged attack DPS gets Bow
          return 'Bow';
        } else if (dpsBuildType === 'attack_melee') {
          // Melee attack DPS
          if (dpsMeleeStyle === 'two_handed') {
            // Randomly choose between two-handed weapons
            const twoHandWeapons: PoeItemClass[] = ['Two Hand Sword', 'Two Hand Axe', 'Two Hand Mace'];
            return twoHandWeapons[Math.floor(Math.random() * twoHandWeapons.length)];
          } else {
            // One-handed melee weapon
            const oneHandWeapons: PoeItemClass[] = ['One Hand Sword', 'One Hand Axe', 'One Hand Mace', 'Dagger'];
            return oneHandWeapons[Math.floor(Math.random() * oneHandWeapons.length)];
          }
        } else if (isIntBased) {
          // Intelligence-based classes get Staff if available at this level, otherwise Wand
          const staffCandidates = ALL_POE_BASE_ITEMS.filter(b => 
            b.itemClass === 'Staff' && b.dropLevel <= level
          );
          if (staffCandidates.length > 0) {
            return 'Staff';
          }
          return 'Wand';
        }
        // Default: One Hand Sword
        return 'One Hand Sword';
      case 'offHand': 
        // Handle DPS build types
        if (dpsBuildType === 'caster') {
          // Casters can get a second Wand
          return 'Wand';
        } else if (dpsBuildType === 'attack_melee' && dpsMeleeStyle === 'dual_wield') {
          // Dual wield melee gets a second one-handed weapon
          const oneHandWeapons: PoeItemClass[] = ['One Hand Sword', 'One Hand Axe', 'One Hand Mace', 'Dagger'];
          return oneHandWeapons[Math.floor(Math.random() * oneHandWeapons.length)];
        } else if (dpsBuildType === 'attack_ranged') {
          // Ranged characters can get a Quiver (if available)
          const quiverCandidates = ALL_POE_BASE_ITEMS.filter(b => 
            b.itemClass === 'Quiver' && b.dropLevel <= level
          );
          if (quiverCandidates.length > 0) {
            return 'Quiver';
          }
          return null;
        }
        // Standard logic for non-DPS or class-based characters
        if (character.role === 'tank' && hasBlock) return 'Shield';
        if (isIntBased || character.role === 'healer') return 'Wand';
        // Don't generate offhand for others
        return null;
      case 'neck': return 'Amulet';
      case 'ring1': return 'Ring';
      case 'ring2': return 'Ring';
      case 'trinket1': return 'Jewel';
      case 'trinket2': return 'Jewel';
      default: return null;
    }
  };
  
  // Generate items for all slots (offhand is optional)
  const requiredSlots: GearSlot[] = ['head', 'chest', 'hands', 'waist', 'feet', 'mainHand', 'neck', 'ring1', 'ring2', 'trinket1', 'trinket2'];
  const optionalSlots: GearSlot[] = ['offHand'];
  
  // Track mainHand item class to check if it's two-handed
  let mainHandItemClass: PoeItemClass | null = null;
  
  // First pass: generate all required slots and determine mainHand item class
  for (const slot of requiredSlots) {
    const itemClass = getItemClassForSlot(slot);
    if (!itemClass) {
      console.warn(`No item class for required slot: ${slot}`);
      continue;
    }
    
    // Track mainHand item class
    if (slot === 'mainHand') {
      mainHandItemClass = itemClass;
    }
    
    const baseItem = getPoeBaseForSlot(slot, itemClass);
    
    if (!baseItem) {
      console.warn(`No base item found for slot: ${slot}, class: ${itemClass}`);
      continue;
    }
    
    // Generate as normal for now (we'll upgrade one to magic later)
    const poeItem = generatePoeItem(level, 'normal', baseItem);
    if (poeItem) {
      // Convert to legacy format for compatibility
      const legacyItem = poeItemToLegacyItem(poeItem);
      items.set(slot, legacyItem);
    } else {
      console.warn(`Failed to generate PoE item for slot: ${slot}`);
    }
  }
  
  // Generate optional slots - only if it makes sense
  for (const slot of optionalSlots) {
    // Skip offhand if mainHand is a two-handed weapon
    if (slot === 'offHand' && mainHandItemClass && isTwoHanded(mainHandItemClass)) {
      continue; // Two-handed weapons can't have an offhand
    }
    
    const itemClass = getItemClassForSlot(slot);
    if (!itemClass) continue; // Skip if no item class (e.g., offhand not needed)
    
    const baseItem = getPoeBaseForSlot(slot, itemClass);
    
    if (baseItem) {
      // Generate as normal for now (we'll upgrade one to magic later)
      const poeItem = generatePoeItem(level, 'normal', baseItem);
      if (poeItem) {
        // Convert to legacy format for compatibility
        const legacyItem = poeItemToLegacyItem(poeItem);
        items.set(slot, legacyItem);
      }
    }
  }
  
  // Now that we know which slots actually have items, randomly select one to be magic
  const generatedSlots = Array.from(items.keys());
  if (generatedSlots.length > 0) {
    const magicSlot = generatedSlots[Math.floor(Math.random() * generatedSlots.length)];
    
    // Regenerate the selected slot as magic
    const existingItem = items.get(magicSlot);
    if (existingItem) {
      const itemClass = getItemClassForSlot(magicSlot);
      if (itemClass) {
        // Find the base item that was used (we need to reverse-engineer or regenerate)
        // Since we can't easily reverse-engineer, we'll regenerate with the same logic
        const baseItem = getPoeBaseForSlot(magicSlot, itemClass);
        if (baseItem) {
          const magicPoeItem = generatePoeItem(level, 'magic', baseItem);
          if (magicPoeItem) {
            const magicLegacyItem = poeItemToLegacyItem(magicPoeItem);
            items.set(magicSlot, magicLegacyItem);
          }
        }
      }
    }
  }
  
  return items;
}

// Create the store
export const useGameStore = create<GameState>()(
  persist(
    immer((set, get) => ({
      // Initial state
      team: [],
      teamSlotAssignments: {},
      selectedCharacterId: null,
      inventory: [],
      stashTabs: Array.from({ length: DEFAULT_STASH_TAB_COUNT }, (_, i) => ({
        id: `stash-tab-${i + 1}`,
        name: `Tab ${i + 1}`,
        items: [],
        color: undefined,
      })),
      activeStashTabId: 'stash-tab-1',
      gold: 0,
      orbs: {
        transmutation: 0,
        alteration: 0,
        augmentation: 0,
        alchemy: 0,
        chaos: 0,
        exalted: 0,
        annulment: 0,
        scouring: 0,
        regal: 0,
        divine: 0
      },
      ownedSkillGems: [],
      ownedSupportGems: [],
      availableKeys: [],
      savedRoutes: [],
      currentRoute: null,
      dungeonHistory: [],
      highestKeyCompleted: 0,
      highestMapTierCompleted: 0,
      
      // Map System
      mapStash: [],
      fragmentCounts: {},
      mapDeviceMap: null,
      mapDeviceFragments: [null, null, null, null, null, null],
      activatedMap: null,
      pendingLoot: [],
      activeLeagueEncounters: [],
      
      activeTab: 'team',
      volume: 0.5, // Default to 50% volume
      
      // Loot Filter
      lootFilter: null,
      lootFilterEnabled: false,

      // Actions
      addCharacter: (name, role, classId, slotIndex) => set(state => {
        console.log('addCharacter called in store', { name, role, classId, slotIndex, currentTeamLength: state.team.length, slotAssignments: state.teamSlotAssignments });
        
        // If a specific slot is provided, check if it's occupied
        if (slotIndex !== undefined) {
          const existingCharId = state.teamSlotAssignments[slotIndex];
          if (existingCharId) {
            const existingChar = state.team.find(c => c.id === existingCharId);
            if (existingChar) {
              console.warn('Cannot add character: slot', slotIndex, 'is already occupied by', existingChar.name);
              return;
            } else {
              // Slot assignment exists but character doesn't - clean up orphaned assignment
              delete state.teamSlotAssignments[slotIndex];
            }
          }
          // If slot is empty, allow adding even if team has 5 (might be replacing or filling a gap)
        } else {
          // No slot specified - check if team is at capacity
          if (state.team.length >= 5) {
            console.warn('Cannot add character: team is already full (5/5) and no slot specified');
            return;
          }
        }
        const char = createCharacter(name, role, 2, classId);
        console.log('Character created:', char.id, char.name);
        
        // For DPS characters without a class, determine build type and adjust stats
        let dpsBuildType: 'caster' | 'attack_melee' | 'attack_ranged' | null = null;
        if (role === 'dps' && !classId) {
          // Randomly choose caster or attack DPS
          const isCaster = Math.random() < 0.5;
          
          if (isCaster) {
            dpsBuildType = 'caster';
            // Caster DPS: High intelligence, moderate dexterity, low strength
            // Energy shield focus
            char.baseStats.intelligence += 15; // Level 2 appropriate bonus
            char.baseStats.dexterity += 5;
            char.baseStats.strength += 2;
            // Recalculate mana from intelligence
            const manaFromInt = calculateManaFromIntelligence(char.baseStats.intelligence);
            char.baseStats.mana = 40 + manaFromInt; // Base level 2 mana + int bonus
            char.baseStats.maxMana = char.baseStats.mana;
            // Energy shield from intelligence
            const baseES = 20; // Small base ES for casters
            const esMultiplier = 1 + (char.baseStats.intelligence * 0.002);
            char.baseStats.energyShield = Math.floor(baseES * esMultiplier);
          } else {
            // Attack DPS: Choose melee or ranged
            const isRanged = Math.random() < 0.4;
            
            if (isRanged) {
              dpsBuildType = 'attack_ranged';
              // Ranged attack DPS: High dexterity, moderate intelligence, low strength
              // Evasion focus
              char.baseStats.dexterity += 18;
              char.baseStats.intelligence += 8;
              char.baseStats.strength += 2;
              // Recalculate accuracy from dexterity
              const accuracyFromDex = calculateAccuracyFromDexterity(char.baseStats.dexterity);
              char.baseStats.accuracy = 102 + accuracyFromDex; // Base level 2 accuracy + dex bonus
              // Evasion bonus from dexterity
              char.baseStats.evasion = calculateEvasionBonus(char.baseStats.dexterity, 56); // Base level 2 evasion
            } else {
              dpsBuildType = 'attack_melee';
              // Melee attack DPS: High strength, moderate dexterity, low intelligence
              // Armor focus
              char.baseStats.strength += 18;
              char.baseStats.dexterity += 8;
              char.baseStats.intelligence += 2;
              // Recalculate life from strength
              const lifeFromStr = calculateLifeFromStrength(char.baseStats.strength);
              char.baseStats.life = 50 + lifeFromStr; // Base level 2 life + str bonus
              char.baseStats.maxLife = char.baseStats.life;
              // Recalculate accuracy from dexterity
              const accuracyFromDex = calculateAccuracyFromDexterity(char.baseStats.dexterity);
              char.baseStats.accuracy = 102 + accuracyFromDex;
            }
          }
        }
        
        // Auto-equip default skills based on role and build type
        // RULE: Each character gets 1 single-target skill and 1 AOE skill with appropriate supports
        if (role === 'tank') {
          // Tank: Shield Slam (single target) + Thunder Clap (AOE)
          const skill1 = getSkillGemById('shield_slam');
          const skill2 = getSkillGemById('thunder_clap');
          const support1 = skill1 ? getDefaultSupportGemForSkill(skill1) : null;
          const support2 = skill2 ? getDefaultSupportGemForSkill(skill2) : null;
          
          char.skillGems = [
            { 
              slotIndex: 0, 
              skillGemId: 'shield_slam', 
              supportGemIds: support1 ? [support1] : [], 
              usageConfig: createSmartSkillConfig('shield_slam') 
            },
            { 
              slotIndex: 1, 
              skillGemId: 'thunder_clap', 
              supportGemIds: support2 ? [support2] : [], 
              usageConfig: createSmartSkillConfig('thunder_clap') 
            }
          ];
        } else if (role === 'healer') {
          // Healer: Healing Wave (single target) + Circle of Healing (AOE)
          const skill1 = getSkillGemById('healing_wave');
          const skill2 = getSkillGemById('circle_of_healing');
          const support1 = skill1 ? getDefaultSupportGemForSkill(skill1) : null;
          const support2 = skill2 ? getDefaultSupportGemForSkill(skill2) : null;
          
          char.skillGems = [
            { 
              slotIndex: 0, 
              skillGemId: 'healing_wave', 
              supportGemIds: support1 ? [support1] : [], 
              usageConfig: createSmartSkillConfig('healing_wave') 
            },
            { 
              slotIndex: 1, 
              skillGemId: 'circle_of_healing', 
              supportGemIds: support2 ? [support2] : [], 
              usageConfig: createSmartSkillConfig('circle_of_healing') 
            }
          ];
        } else if (role === 'dps') {
          // Assign skills based on build type
          // RULE: Always assign 1 single-target skill and 1 AOE skill
          let skill1Id: string; // Single target
          let skill2Id: string; // AOE
          
          if (dpsBuildType === 'caster') {
            // Caster spells
            // Single target options: fireball, ice_lance, shadow_bolt (chains but good ST), disintegrate
            // AOE options: blow_up, blizzard, meteor, storm_call
            const singleTargetSkills = ['fireball', 'ice_lance', 'shadow_bolt'];
            const aoeSkills = ['blow_up', 'blizzard'];
            skill1Id = singleTargetSkills[Math.floor(Math.random() * singleTargetSkills.length)];
            skill2Id = aoeSkills[Math.floor(Math.random() * aoeSkills.length)];
          } else if (dpsBuildType === 'attack_ranged') {
            // Ranged attack (bow)
            // Single target options: barrage, ice_shot, lightning_arrow
            // AOE options: split_arrow, rain_of_arrows, tornado_shot
            const singleTargetSkills = ['barrage', 'ice_shot', 'lightning_arrow'];
            const aoeSkills = ['split_arrow', 'rain_of_arrows', 'tornado_shot'];
            skill1Id = singleTargetSkills[Math.floor(Math.random() * singleTargetSkills.length)];
            skill2Id = aoeSkills[Math.floor(Math.random() * aoeSkills.length)];
          } else if (dpsBuildType === 'attack_melee') {
            // Melee attack
            // Single target options: heavy_strike, double_strike, lacerate
            // AOE options: cleave, cyclone, reave
            const singleTargetSkills = ['heavy_strike', 'double_strike', 'lacerate'];
            const aoeSkills = ['cleave', 'cyclone', 'reave'];
            skill1Id = singleTargetSkills[Math.floor(Math.random() * singleTargetSkills.length)];
            skill2Id = aoeSkills[Math.floor(Math.random() * aoeSkills.length)];
          } else {
            // Fallback for class-based DPS or unknown build type
            // Infer from stats if class-based
            const int = char.baseStats.intelligence;
            const dex = char.baseStats.dexterity;
            const str = char.baseStats.strength;
            
            if (int > dex && int > str && int > 30) {
              // Caster build
              skill1Id = 'fireball'; // Single target
              skill2Id = 'blow_up'; // AOE
            } else if (dex > str && dex > 30) {
              // Ranged build
              skill1Id = 'barrage'; // Single target
              skill2Id = 'split_arrow'; // AOE
            } else {
              // Melee build
              skill1Id = 'heavy_strike'; // Single target
              skill2Id = 'cleave'; // AOE
            }
          }
          
          const skill1 = getSkillGemById(skill1Id);
          const skill2 = getSkillGemById(skill2Id);
          const support1 = skill1 ? getDefaultSupportGemForSkill(skill1) : null;
          const support2 = skill2 ? getDefaultSupportGemForSkill(skill2) : null;
          
          char.skillGems = [
            { 
              slotIndex: 0, 
              skillGemId: skill1Id, 
              supportGemIds: support1 ? [support1] : [], 
              usageConfig: createSmartSkillConfig(skill1Id) 
            },
            { 
              slotIndex: 1, 
              skillGemId: skill2Id, 
              supportGemIds: support2 ? [support2] : [], 
              usageConfig: createSmartSkillConfig(skill2Id) 
            }
          ];
        }
        
        // Generate and equip starter white items
        const starterItems = generateStarterItems(char);
        for (const [slot, item] of starterItems.entries()) {
          // Add item to inventory
          state.inventory.push(item);
          // Equip the item
          char.equippedGear[slot] = item.id;
        }
        
        state.team.push(char);
        console.log('Character added to team. New team length:', state.team.length);
        if (slotIndex !== undefined) {
          state.teamSlotAssignments[slotIndex] = char.id;
          console.log('Character assigned to slot', slotIndex, '->', char.id);
        }
        if (!state.selectedCharacterId) {
          state.selectedCharacterId = char.id;
        }
        console.log('addCharacter complete. Team:', state.team.map(c => ({ id: c.id, name: c.name, role: c.role })));
      }),

      removeCharacter: (id) => set(state => {
        state.team = state.team.filter(c => c.id !== id);
        // Remove from slot assignments
        for (const [slotIndex, charId] of Object.entries(state.teamSlotAssignments)) {
          if (charId === id) {
            delete state.teamSlotAssignments[parseInt(slotIndex)];
            break;
          }
        }
        if (state.selectedCharacterId === id) {
          state.selectedCharacterId = state.team[0]?.id ?? null;
        }
      }),

      selectCharacter: (id) => set(state => {
        state.selectedCharacterId = id;
      }),

      updateCharacter: (id, updates) => set(state => {
        const char = state.team.find(c => c.id === id);
        if (char) {
          Object.assign(char, updates);
        }
      }),

      equipItem: (characterId, slot, itemId) => set(state => {
        const char = state.team.find(c => c.id === characterId);
        const item = state.inventory.find(i => i.id === itemId);
        if (!char || !item) {
          console.warn('Cannot equip: character or item not found');
          return;
        }
        
        // Get current equipment for validation
        const currentMainHandId = char.equippedGear.mainHand;
        const currentOffHandId = char.equippedGear.offHand;
        const currentMainHand = currentMainHandId ? state.inventory.find(i => i.id === currentMainHandId) || null : null;
        const currentOffHand = currentOffHandId ? state.inventory.find(i => i.id === currentOffHandId) || null : null;
        
        // Validate the equipment
        const validation = validateEquipment(item, slot, currentMainHand, currentOffHand);
        if (!validation.canEquip) {
          console.warn(`Cannot equip ${item.name} to ${slot}: ${validation.reason}`);
          return;
        }
        
        // Check stat requirements
        const totalStats = calculateTotalCharacterStats(char, state.inventory);
        const requirementsCheck = checkItemRequirements(item, char.level, totalStats);
        if (!requirementsCheck.meetsRequirements) {
          const missing = requirementsCheck.missingRequirements;
          const reasons: string[] = [];
          if (missing.level) reasons.push(`Level ${missing.level.required} required (have ${missing.level.current})`);
          if (missing.strength) reasons.push(`${missing.strength.required} Str required (have ${missing.strength.current})`);
          if (missing.dexterity) reasons.push(`${missing.dexterity.required} Dex required (have ${missing.dexterity.current})`);
          if (missing.intelligence) reasons.push(`${missing.intelligence.required} Int required (have ${missing.intelligence.current})`);
          console.warn(`Cannot equip ${item.name}: ${reasons.join(', ')}`);
          return;
        }
        
        // Check for side effects (auto-unequip)
        const sideEffects = getEquipmentSideEffects(item, slot, currentMainHand, currentOffHand);
        
        // Auto-unequip conflicting slots
        for (const slotToUnequip of sideEffects.slotsToUnequip) {
          const unequipItemId = char.equippedGear[slotToUnequip];
          if (unequipItemId) {
            delete char.equippedGear[slotToUnequip];
            
            // Try to place unequipped item in stash
            const activeTab = state.stashTabs.find(t => t.id === state.activeStashTabId);
            const unequippedItem = state.inventory.find(i => i.id === unequipItemId);
            
            if (activeTab && unequippedItem) {
              // CRITICAL: Check if item already exists in ANY stash tab (duplicate prevention)
              const itemExistsInStash = state.stashTabs.some(t => 
                t.items.some(si => si.itemId === unequipItemId)
              );
              if (!itemExistsInStash) {
                const itemSize = getItemGridSize(unequippedItem);
                const grid = buildOccupancyGrid(activeTab.items, state.inventory);
                
                // Find an empty spot
                let placed = false;
                for (let y = 0; y <= STASH_GRID_SIZE - itemSize.height && !placed; y++) {
                  for (let x = 0; x <= STASH_GRID_SIZE - itemSize.width && !placed; x++) {
                    if (canPlaceItem(grid, itemSize, x, y)) {
                      activeTab.items.push({ itemId: unequipItemId, x, y });
                      placed = true;
                    }
                  }
                }
              } else {
                console.error(`[DUPLICATE ITEM DETECTED] Item ${unequipItemId} already exists in stash. Preventing duplication during auto-unequip.`);
              }
            }
          }
        }
        
        // Remove item from any stash tab it's in
        for (const tab of state.stashTabs) {
          tab.items = tab.items.filter(si => si.itemId !== itemId);
        }
        
        // Equip new item
        char.equippedGear[slot] = itemId;
      }),

      unequipItem: (characterId, slot) => set(state => {
        const char = state.team.find(c => c.id === characterId);
        if (!char) return;
        
        const itemId = char.equippedGear[slot];
        if (!itemId) return;
        
        // Unequip - item stays in inventory, just remove from equipped
        delete char.equippedGear[slot];
        
        // Try to place in active stash tab
        const activeTab = state.stashTabs.find(t => t.id === state.activeStashTabId);
        const item = state.inventory.find(i => i.id === itemId);
        
        if (activeTab && item) {
          // CRITICAL: Check if item already exists in ANY stash tab (duplicate prevention)
          const itemExistsInStash = state.stashTabs.some(t => 
            t.items.some(si => si.itemId === itemId)
          );
          if (!itemExistsInStash) {
            const itemSize = getItemGridSize(item);
            const grid = buildOccupancyGrid(activeTab.items, state.inventory);
            const pos = findAvailablePosition(grid, itemSize);
            
            if (pos) {
              activeTab.items.push({ itemId, x: pos.x, y: pos.y });
            }
          } else {
            console.error(`[DUPLICATE ITEM DETECTED] Item ${itemId} already exists in stash. Preventing duplication during unequip.`);
          }
        }
      }),

      addItemToInventory: (item) => set(state => {
        state.inventory.push(item);
      }),

      removeItemFromInventory: (itemId) => set(state => {
        state.inventory = state.inventory.filter(i => i.id !== itemId);
      }),

      // Stash actions
      setActiveStashTab: (tabId) => set(state => {
        state.activeStashTabId = tabId;
      }),

      clearStash: () => set(state => {
        // Get all item IDs in stash tabs
        const stashItemIds = new Set<string>();
        for (const tab of state.stashTabs) {
          for (const stashItem of tab.items) {
            stashItemIds.add(stashItem.itemId);
          }
          // Clear the tab
          tab.items = [];
        }
        
        // Also unequip all items from all characters and add their IDs to be removed
        const equippedItemIds = new Set<string>();
        for (const char of state.team) {
          for (const [slot, itemId] of Object.entries(char.equippedGear)) {
            if (itemId) {
              equippedItemIds.add(itemId);
              delete char.equippedGear[slot as keyof typeof char.equippedGear];
            }
          }
        }
        
        // Remove all items from inventory (both stash items and equipped items)
        state.inventory = state.inventory.filter(item => 
          !stashItemIds.has(item.id) && !equippedItemIds.has(item.id)
        );
      }),

      addItemToStash: (tabId, itemId, x, y) => {
        const state = get();
        const tab = state.stashTabs.find(t => t.id === tabId);
        const item = state.inventory.find(i => i.id === itemId);
        if (!tab || !item) return false;
        
        // CRITICAL: Check if item already exists in ANY stash tab (item duplication prevention)
        const itemExistsInStash = state.stashTabs.some(t => 
          t.items.some(si => si.itemId === itemId)
        );
        if (itemExistsInStash) {
          console.error(`[DUPLICATE ITEM DETECTED] Item ${itemId} already exists in stash. Preventing duplication.`);
          return false;
        }
        
        const size = getItemGridSize(item);
        const grid = buildOccupancyGrid(tab.items, state.inventory);
        
        if (!canPlaceItem(grid, size, x, y)) return false;
        
        set(state => {
          const stashTab = state.stashTabs.find(t => t.id === tabId);
          if (stashTab) {
            stashTab.items.push({ itemId, x, y });
          }
        });
        return true;
      },

      removeItemFromStash: (tabId, itemId) => set(state => {
        const tab = state.stashTabs.find(t => t.id === tabId);
        if (tab) {
          // Remove only the first occurrence to prevent removing duplicates incorrectly
          const index = tab.items.findIndex(i => i.itemId === itemId);
          if (index !== -1) {
            tab.items.splice(index, 1);
          }
        }
      }),
      
      // Remove duplicate items from all stash tabs (keeps first occurrence, removes rest)
      removeDuplicateItems: () => set(state => {
        const seenItemIds = new Set<string>();
        let duplicatesRemoved = 0;
        
        for (const tab of state.stashTabs) {
          tab.items = tab.items.filter(stashItem => {
            if (seenItemIds.has(stashItem.itemId)) {
              // Duplicate detected - remove it
              duplicatesRemoved++;
              console.error(`[DUPLICATE ITEM REMOVED] Item ${stashItem.itemId} was duplicated in stash tab ${tab.id}. Removed duplicate.`);
              return false;
            }
            seenItemIds.add(stashItem.itemId);
            return true;
          });
        }
        
        if (duplicatesRemoved > 0) {
          console.warn(`[DUPLICATE CLEANUP] Removed ${duplicatesRemoved} duplicate item(s) from stash.`);
        }
      }),

      moveItemInStash: (tabId, itemId, newX, newY, excludeItemId) => {
        const state = get();
        const tab = state.stashTabs.find(t => t.id === tabId);
        const item = state.inventory.find(i => i.id === itemId);
        if (!tab || !item) return false;
        
        const size = getItemGridSize(item);
        // Build grid excluding the item being moved AND optionally another item (for swap scenarios)
        const otherItems = tab.items.filter(i => 
          i.itemId !== itemId && (excludeItemId ? i.itemId !== excludeItemId : true)
        );
        const grid = buildOccupancyGrid(otherItems, state.inventory);
        
        if (!canPlaceItem(grid, size, newX, newY)) return false;
        
        set(state => {
          const stashTab = state.stashTabs.find(t => t.id === tabId);
          if (stashTab) {
            const stashItem = stashTab.items.find(i => i.itemId === itemId);
            if (stashItem) {
              stashItem.x = newX;
              stashItem.y = newY;
            }
          }
        });
        return true;
      },

      swapItemsInStash: (tabId, itemId1, x1, y1, itemId2, x2, y2) => set(state => {
        const tab = state.stashTabs.find(t => t.id === tabId);
        if (!tab) return;
        
        const stashItem1 = tab.items.find(i => i.itemId === itemId1);
        const stashItem2 = tab.items.find(i => i.itemId === itemId2);
        
        if (stashItem1 && stashItem2) {
          stashItem1.x = x1;
          stashItem1.y = y1;
          stashItem2.x = x2;
          stashItem2.y = y2;
        }
      }),

      moveItemBetweenTabs: (fromTabId, toTabId, itemId, x, y) => {
        const state = get();
        const toTab = state.stashTabs.find(t => t.id === toTabId);
        const item = state.inventory.find(i => i.id === itemId);
        if (!toTab || !item) return false;
        
        // CRITICAL: Check if item already exists in destination tab (duplicate prevention)
        if (toTab.items.some(si => si.itemId === itemId)) {
          console.error(`[DUPLICATE ITEM DETECTED] Item ${itemId} already exists in destination tab ${toTabId}. Preventing duplication.`);
          return false;
        }
        
        const size = getItemGridSize(item);
        const grid = buildOccupancyGrid(toTab.items, state.inventory);
        
        if (!canPlaceItem(grid, size, x, y)) return false;
        
        set(state => {
          // Remove from source tab (only first occurrence)
          const fromTab = state.stashTabs.find(t => t.id === fromTabId);
          if (fromTab) {
            const index = fromTab.items.findIndex(i => i.itemId === itemId);
            if (index !== -1) {
              fromTab.items.splice(index, 1);
            }
          }
          // Add to destination tab
          const destTab = state.stashTabs.find(t => t.id === toTabId);
          if (destTab) {
            destTab.items.push({ itemId, x, y });
          }
        });
        return true;
      },

      equipSkillGem: (characterId, slotIndex, skillGemId) => set(state => {
        const char = state.team.find(c => c.id === characterId);
        if (!char) return;
        
        // Check if slot exists, create if not
        let skillSlot = char.skillGems.find(s => s.slotIndex === slotIndex);
        if (!skillSlot) {
          skillSlot = { slotIndex, skillGemId: '', supportGemIds: [], usageConfig: createSmartSkillConfig(skillGemId) };
          char.skillGems.push(skillSlot);
        } else {
          // Update existing slot with new skill and new config
          skillSlot.skillGemId = skillGemId;
          skillSlot.usageConfig = createSmartSkillConfig(skillGemId);
        }
      }),

      unequipSkillGem: (characterId, slotIndex) => set(state => {
        const char = state.team.find(c => c.id === characterId);
        if (!char) return;
        
        char.skillGems = char.skillGems.filter(s => s.slotIndex !== slotIndex);
      }),

      equipSupportGem: (characterId, skillSlotIndex, supportSlotIndex, supportGemId) => set(state => {
        const char = state.team.find(c => c.id === characterId);
        if (!char) return;
        
        const skillSlot = char.skillGems.find(s => s.slotIndex === skillSlotIndex);
        if (!skillSlot || !skillSlot.skillGemId) return;
        
        // Validate support gem compatibility
        const skill = getSkillGemById(skillSlot.skillGemId);
        const support = getSupportGemById(supportGemId);
        
        if (!skill || !support) return;
        
        if (!canSupportApplyToSkill(support, skill)) {
          console.warn(`Cannot equip ${support.name} to ${skill.name}: incompatible tags`);
          return;
        }
        
        // Check if support slot is within max slots
        if (supportSlotIndex >= skill.maxSupportSlots) {
          console.warn(`Cannot equip support gem: skill only has ${skill.maxSupportSlots} support slots`);
          return;
        }
        
        // Ensure support array is long enough
        while (skillSlot.supportGemIds.length <= supportSlotIndex) {
          skillSlot.supportGemIds.push('');
        }
        
        skillSlot.supportGemIds[supportSlotIndex] = supportGemId;
      }),

      unequipSupportGem: (characterId, skillSlotIndex, supportSlotIndex) => set(state => {
        const char = state.team.find(c => c.id === characterId);
        if (!char) return;
        
        const skillSlot = char.skillGems.find(s => s.slotIndex === skillSlotIndex);
        if (!skillSlot) return;
        
        if (supportSlotIndex < skillSlot.supportGemIds.length) {
          skillSlot.supportGemIds[supportSlotIndex] = '';
        }
      }),

      updateSkillUsageConfig: (characterId: string, slotIndex: number, config: SkillUsageConfig) => set(state => {
        const char = state.team.find(c => c.id === characterId);
        if (!char) return;
        
        const skillSlot = char.skillGems.find(s => s.slotIndex === slotIndex);
        if (!skillSlot) return;
        
        skillSlot.usageConfig = config;
      }),

      allocatePassive: (characterId, nodeId) => set(state => {
        const char = state.team.find(c => c.id === characterId);
        if (!char) return;
        
        if (!char.allocatedPassives.includes(nodeId)) {
          char.allocatedPassives.push(nodeId);
        }
      }),

      deallocatePassive: (characterId, nodeId) => set(state => {
        const char = state.team.find(c => c.id === characterId);
        if (!char) return;
        
        char.allocatedPassives = char.allocatedPassives.filter(id => id !== nodeId);
      }),

      resetPassives: (characterId) => set(state => {
        const char = state.team.find(c => c.id === characterId);
        if (!char) return;
        
        char.allocatedPassives = [];
      }),

      // MoP-style talent selection
      selectTalent: (characterId, tierLevel, talentId) => set(state => {
        const char = state.team.find(c => c.id === characterId);
        if (!char) return;
        
        // Check level requirement
        if (char.level < tierLevel) return; // Don't allow selection if level requirement not met
        
        // Initialize selectedTalents if it doesn't exist (backwards compat)
        if (!char.selectedTalents) {
          char.selectedTalents = {};
        }
        
        // Set the talent for this tier (replaces any existing selection)
        char.selectedTalents[tierLevel] = talentId;
      }),

      deselectTalent: (characterId, tierLevel) => set(state => {
        const char = state.team.find(c => c.id === characterId);
        if (!char || !char.selectedTalents) return;
        
        delete char.selectedTalents[tierLevel];
      }),

      resetTalents: (characterId) => set(state => {
        const char = state.team.find(c => c.id === characterId);
        if (!char) return;
        
        char.selectedTalents = {};
      }),

      addOrbs: (orbs) => set(state => {
        Object.entries(orbs).forEach(([type, amount]) => {
          if (amount) {
            state.orbs[type as OrbType] += amount;
          }
        });
      }),

      useOrb: (orbType, itemId) => set(state => {
        if (state.orbs[orbType] <= 0) return;

        const item = state.inventory.find(i => i.id === itemId);
        if (!item) return;

        // Apply orb effect
        const result = applyOrbToItem(item, orbType);

        if (result.success) {
          state.orbs[orbType]--;
          // Update item in inventory
          const idx = state.inventory.findIndex(i => i.id === itemId);
          if (idx >= 0 && result.item) {
            state.inventory[idx] = result.item;
          }
        }
      }),

      applyOrbToItemAction: (itemId, orbType) => {
        const state = get();

        // Check if player has the orb
        if (state.orbs[orbType] <= 0) {
          return {
            success: false,
            message: `Not enough ${CRAFTING_ORBS.find(o => o.type === orbType)?.name || orbType} orbs`
          };
        }

        // Find the item in inventory
        const itemIndex = state.inventory.findIndex(i => i.id === itemId);
        if (itemIndex < 0) {
          return {
            success: false,
            message: 'Item not found'
          };
        }

        const item = state.inventory[itemIndex];

        // Apply the orb
        const result = applyOrbToItem(item, orbType);

        if (!result.success || !result.item) {
          // Don't consume orb if crafting failed
          return {
            success: false,
            message: result.message
          };
        }

        // Update the item in state
        set(state => {
          // Consume the orb only if crafting succeeded
          state.orbs[orbType] = Math.max(0, state.orbs[orbType] - 1);
          // Update the item
          state.inventory[itemIndex] = result.item!;
        });

        return {
          success: true,
          message: result.message
        };
      },

      setVolume: (volume) => set(state => {
        state.volume = Math.max(0, Math.min(1, volume)); // Clamp between 0 and 1
      }),
      
      setLootFilter: (filter) => set(state => {
        state.lootFilter = filter;
      }),
      
      setLootFilterEnabled: (enabled) => set(state => {
        state.lootFilterEnabled = enabled;
      }),

      setActiveTab: (tab) => {
        const state = get();
        
        // Check if trying to leave dungeon while running
        if (state.activeTab === 'dungeon' && tab !== 'dungeon') {
          // Check if a run is active by looking for an activated map
          if (state.activatedMap) {
            if (!confirm('You have an active map run. If you leave now, you will lose your map and any progress. Are you sure you want to leave?')) {
              return;
            }
            // Clear the activated map if they confirm
            set(state => {
              state.activatedMap = null;
              state.mapDeviceFragments = [null, null, null, null, null, null];
            });
          }
        }
        
        set(state => {
          state.activeTab = tab;
        });
      },

      addKey: (key) => set(state => {
        state.availableKeys.push(key);
      }),

      saveRoute: (route) => set(state => {
        const existingIdx = state.savedRoutes.findIndex(r => r.id === route.id);
        if (existingIdx >= 0) {
          state.savedRoutes[existingIdx] = route;
        } else {
          state.savedRoutes.push(route);
        }
      }),

      setCurrentRoute: (route) => set(state => {
        state.currentRoute = route;
      }),

      completeDungeonRun: (result) => set(state => {
        state.dungeonHistory.push(result);
        
        if (result.success && result.keyLevel > state.highestKeyCompleted) {
          state.highestKeyCompleted = result.keyLevel;
        }
        
        // Update highest map tier completed
        if (result.success && result.mapTier && result.mapTier > state.highestMapTierCompleted) {
          state.highestMapTierCompleted = result.mapTier;
        }
        
        // Add loot to inventory
        result.loot.forEach(item => {
          state.inventory.push(item);
        });
        
        // Add map drops to map stash
        if (result.mapDrops) {
          result.mapDrops.forEach(map => {
            state.mapStash.push(map);
          });
        }
        
        // Add fragment drops to fragment stash
        if (result.fragmentDrops) {
          result.fragmentDrops.forEach(fragment => {
            const baseId = fragment.baseId;
            state.fragmentCounts[baseId] = (state.fragmentCounts[baseId] || 0) + 1;
          });
        }
        
        // Note: Maps and fragments are NOT consumed here. They remain in the device
        // so the result screen can display properly. The map will be consumed when
        // the user closes the result modal (in resetRunState in DungeonTab).
        
        // Note: Experience is now awarded per-kill in combat, not here
        // This function is kept for backwards compatibility but doesn't award exp
      }),

      // ===== MAP SYSTEM ACTIONS =====
      
      addMap: (map) => set(state => {
        console.log(`[ADD MAP] Adding map:`, { id: map.id, tier: map.tier, name: map.name });
        console.log(`[ADD MAP] Current stash size before add:`, state.mapStash.length);
        
        // Create a copy of the map to avoid mutating the original
        const mapToAdd = { ...map };
        
        // Don't assign grid position - let the display logic handle it
        // This allows infinite storage
        delete mapToAdd.gridPosition;
        
        state.mapStash.push(mapToAdd);
        console.log(`[ADD MAP] Map added. New stash size:`, state.mapStash.length);
        console.log(`[ADD MAP] Current tier 1 maps:`, state.mapStash.filter(m => m.tier === 1).length);
      }),
      
      removeMap: (mapId) => set(state => {
        console.log(`[REMOVE MAP] Removing map:`, mapId);
        console.log(`[REMOVE MAP] Current stash size before remove:`, state.mapStash.length);
        
        // Find the map being removed
        const removedMap = state.mapStash.find(m => m.id === mapId);
        console.log(`[REMOVE MAP] Map found:`, removedMap ? { id: removedMap.id, tier: removedMap.tier, name: removedMap.name } : 'NOT FOUND');
        
        // Remove the map
        state.mapStash = state.mapStash.filter(m => m.id !== mapId);
        console.log(`[REMOVE MAP] Map removed. New stash size:`, state.mapStash.length);
        
        // Also remove from map device if it's there
        if (state.mapDeviceMap?.id === mapId) {
          console.log(`[REMOVE MAP] Also removing from map device`);
          state.mapDeviceMap = null;
        }
        
        // Don't auto-generate replacements here - let the MapsTab effect handle maintaining tier 1 maps
        
        console.log(`[REMOVE MAP] Current tier 1 maps:`, state.mapStash.filter(m => m.tier === 1).length);
      }),

      clearAllMaps: () => set(state => {
        console.log('[CLEAR ALL MAPS] Starting clear...');
        console.log('[CLEAR ALL MAPS] Current stash size:', state.mapStash.length);
        
        // Clear all maps from stash
        state.mapStash = [];
        
        // Clear map from device if present
        state.mapDeviceMap = null;
        
        // Clear activated map if present
        state.activatedMap = null;
        
        console.log('[CLEAR ALL MAPS] Maps cleared. Adding 4 tier 1 maps...');
        
        // Immediately add 4 tier 1 maps
        for (let i = 0; i < 4; i++) {
          const newMap = generateMap(1, 'normal');
          console.log(`[CLEAR ALL MAPS] Generated map ${i+1}/4:`, { id: newMap.id, tier: newMap.tier, name: newMap.name });
          state.mapStash.push(newMap);
        }
        
        console.log('[CLEAR ALL MAPS] Complete. Final stash size:', state.mapStash.length);
        console.log('[CLEAR ALL MAPS] All maps:', state.mapStash.map(m => ({ id: m.id, tier: m.tier, name: m.name })));
      }),

      moveMapInStash: (_mapId, _x, _y) => {
        // No longer needed - maps don't have fixed positions
        return true;
      },

      applyOrbToMap: (mapId, orbType) => {
        const state = get();
        
        // Check if player has the orb
        if (state.orbs[orbType] <= 0) {
          return {
            success: false,
            message: `Not enough ${CRAFTING_ORBS.find(o => o.type === orbType)?.name || orbType} orbs`
          };
        }

        // Find the map in stash
        let mapIndex = state.mapStash.findIndex(m => m.id === mapId);
        let map = mapIndex >= 0 ? state.mapStash[mapIndex] : null;
        let isInDevice = false;

        // If not in stash, check if it's in the device
        if (!map) {
          if (state.mapDeviceMap?.id === mapId) {
            map = state.mapDeviceMap;
            isInDevice = true;
          } else {
            return {
              success: false,
              message: 'Map not found'
            };
          }
        }

        if (!map) {
          return {
            success: false,
            message: 'Map not found'
          };
        }

        // Apply the orb
        const result = craftMap(map, orbType);
        
        if (!result.success || !result.map) {
          // Don't consume orb if crafting failed
          return {
            success: false,
            message: result.message
          };
        }

        // Update the map in state
        set(state => {
          // Consume the orb only if crafting succeeded
          state.orbs[orbType] = Math.max(0, state.orbs[orbType] - 1);

          // Update the map
          if (isInDevice) {
            state.mapDeviceMap = result.map!;
          } else if (mapIndex >= 0) {
            state.mapStash[mapIndex] = result.map!;
          }
        });

        return {
          success: true,
          message: result.message
        };
      },
      
      addFragment: (fragment) => set(state => {
        const baseId = fragment.baseId;
        state.fragmentCounts[baseId] = (state.fragmentCounts[baseId] || 0) + 1;
        console.log(`[Fragment Collected] ${fragment.name} (${baseId}). New count: ${state.fragmentCounts[baseId]}`);
      }),
      
      removeFragment: (_fragmentId) => set(() => {
        // This is now deprecated, we use fragment counts
      }),
      
      setMapDeviceMap: (map) => set(state => {
        console.log(`[SET MAP DEVICE] Setting map in device:`, map ? { id: map.id, tier: map.tier, name: map.name } : 'NULL');
        console.log(`[SET MAP DEVICE] Current device map:`, state.mapDeviceMap ? { id: state.mapDeviceMap.id, tier: state.mapDeviceMap.tier } : 'EMPTY');
        console.log(`[SET MAP DEVICE] Current stash size:`, state.mapStash.length);
        
        // If there was a map in the device, return it to stash
        if (state.mapDeviceMap) {
          console.log(`[SET MAP DEVICE] Returning current device map to stash`);
          state.mapStash.push(state.mapDeviceMap);
        }
        state.mapDeviceMap = map;
        // If we're adding a map, remove it from stash
        if (map) {
          console.log(`[SET MAP DEVICE] Removing new map from stash`);
          state.mapStash = state.mapStash.filter(m => m.id !== map.id);
          console.log(`[SET MAP DEVICE] Map removed from stash. New stash size:`, state.mapStash.length);
        }
        
        console.log(`[SET MAP DEVICE] Current tier 1 maps in stash:`, state.mapStash.filter(m => m.tier === 1).length);
      }),
      
      setMapDeviceFragment: (slotIndex, fragment) => set(state => {
        if (slotIndex < 0 || slotIndex >= 6) return;
        
        // Return current fragment to counts if exists
        const currentFragment = state.mapDeviceFragments[slotIndex];
        if (currentFragment) {
          state.fragmentCounts[currentFragment.baseId] = (state.fragmentCounts[currentFragment.baseId] || 0) + 1;
        }
        
        // Set new fragment
        state.mapDeviceFragments[slotIndex] = fragment;
        
        // Remove from counts if adding
        if (fragment && state.fragmentCounts[fragment.baseId] && state.fragmentCounts[fragment.baseId] > 0) {
          state.fragmentCounts[fragment.baseId]--;
        }
      }),
      
      clearMapDevice: () => set(state => {
        // Return map to stash
        if (state.mapDeviceMap) {
          state.mapStash.push(state.mapDeviceMap);
          state.mapDeviceMap = null;
        }
        // Return fragments to counts
        state.mapDeviceFragments.forEach((f, i) => {
          if (f) {
            state.fragmentCounts[f.baseId] = (state.fragmentCounts[f.baseId] || 0) + 1;
            state.mapDeviceFragments[i] = null;
          }
        });
      }),
      
      activateMap: () => set(state => {
        // Move map from device to activated state
        if (state.mapDeviceMap) {
          // Calculate fragment bonuses before clearing them
          const fragmentQuantityBonus = state.mapDeviceFragments.reduce((sum, f) => sum + (f?.quantityBonus || 0), 0);
          const fragmentRarityBonus = state.mapDeviceFragments.reduce((sum, f) => sum + (f?.rarityBonus || 0), 0);
          
          // Store the activated map with combined bonuses
          state.activatedMap = {
            ...state.mapDeviceMap,
            // Add fragment bonuses to the map's existing bonuses
            quantityBonus: state.mapDeviceMap.quantityBonus + fragmentQuantityBonus,
            rarityBonus: state.mapDeviceMap.rarityBonus + fragmentRarityBonus
          };
          
          // Clear the map from device (it's now activated/consumed)
          state.mapDeviceMap = null;
          
          // Consume fragments when map is activated
          state.mapDeviceFragments.forEach((f, i) => {
            if (f) {
              state.mapDeviceFragments[i] = null;
            }
          });
        }
      }),
      
      clearActivatedMap: () => set(state => {
        const wasT1Map = state.activatedMap?.tier === 1;
        
        state.activatedMap = null;
        // Clear any consumed fragments
        state.mapDeviceFragments = [null, null, null, null, null, null];
        
        // If a tier 1 map was consumed, generate a replacement to maintain the minimum
        if (wasT1Map) {
          const currentT1Count = state.mapStash.filter(m => m.tier === 1).length;
          console.log(`[CLEAR ACTIVATED MAP] T1 map was consumed. Current T1 count: ${currentT1Count}`);
          if (currentT1Count < 4) {
            const newMap = generateMap(1, 'normal');
            state.mapStash.push(newMap);
            console.log(`[CLEAR ACTIVATED MAP] Generated replacement T1 map`);
          }
        }
      }),
      
      addLootDrop: (drop) => set(state => {
        state.pendingLoot.push(drop);
      }),
      
      collectLoot: (dropId) => set(state => {
        const drop = state.pendingLoot.find(d => d.id === dropId);
        if (drop && !drop.collected) {
          drop.collected = true;
          state.inventory.push(drop.item);
        }
      }),
      
      collectAllPendingLoot: () => set(state => {
        state.pendingLoot.forEach(drop => {
          if (!drop.collected) {
            drop.collected = true;
            state.inventory.push(drop.item);
          }
        });
        // Clear pending loot after collection
        state.pendingLoot = [];
      }),
      
      setActiveLeagueEncounters: (encounters) => set(state => {
        state.activeLeagueEncounters = encounters;
      }),
      
      completeLeagueEncounter: (encounterId) => set(state => {
        const encounter = state.activeLeagueEncounters.find(e => e.id === encounterId);
        if (encounter) {
          encounter.completed = true;
          // Add loot from the encounter to pending loot
          encounter.lootDrops.forEach(drop => {
            state.pendingLoot.push(drop);
          });
        }
      }),
      
      applyDeathPenalty: (characterId) => set(state => {
        const char = state.team.find(c => c.id === characterId);
        if (!char) return;
        
        // PoE death penalty: Lose 10% of experience in current level
        // But never lose a level (experience can't go below 0)
        const expPenalty = Math.floor(char.experience * 0.10);
        char.experience = Math.max(0, char.experience - expPenalty);
      }),

      addExperienceToCharacter: (characterId, experience) => {
        let result: { leveledUp: boolean; newLevel: number; levelsGained: number } | null = null;
        
        set(state => {
          const char = state.team.find(c => c.id === characterId);
          if (!char) return;
          
          const oldLevel = char.level;
          const levelUpResult = addExpToChar(char, experience);
          
          // Update character
          char.experience = levelUpResult.remainingExp;
          char.level = levelUpResult.newLevel;
          
          // Apply stat gains for each level gained (PoE style, role-specific)
          if (levelUpResult.levelsGained > 0) {
            const levelsToGain = levelUpResult.newLevel - oldLevel;
            
            // PoE: Each level grants stats, but role specializes in one attribute
            // Base: +2 to all attributes per level
            // Specialized: +3 to primary attribute per level
            for (let i = 0; i < levelsToGain; i++) {
              if (char.role === 'tank') {
                // Tank specializes in Strength and Armor
                char.baseStats.strength += 3;
                char.baseStats.dexterity += 2;
                char.baseStats.intelligence += 2;
                char.baseStats.armor += 25;        // +25 armor per level
                char.baseStats.blockChance = Math.min(75, (char.baseStats.blockChance || 0) + 0.3); // +0.3% block per level (cap 75%)
              } else if (char.role === 'dps') {
                // DPS specializes in Dexterity and Crit
                char.baseStats.strength += 2;
                char.baseStats.dexterity += 3;
                char.baseStats.intelligence += 2;
                char.baseStats.armor += 10;        // +10 armor per level
                char.baseStats.criticalStrikeChance = Math.min(100, (char.baseStats.criticalStrikeChance || 5) + 0.2); // +0.2% crit per level
                char.baseStats.evasion += 15;      // +15 evasion per level
              } else if (char.role === 'healer') {
                // Healer specializes in Intelligence and Spell Defense
                char.baseStats.strength += 2;
                char.baseStats.dexterity += 2;
                char.baseStats.intelligence += 3;
                char.baseStats.armor += 8;         // +8 armor per level
                char.baseStats.spellSuppressionChance = Math.min(100, (char.baseStats.spellSuppressionChance || 0) + 0.5); // +0.5% spell suppression per level
              }
              
              // Recalculate derived stats from attributes (PoE style)
              // Use the same PoE formula as character creation for consistency
              // PoE base life: 38 at level 1, +12 per level (much more gradual scaling)
              const poeBaseLife = calculateBaseLifeFromLevel(char.level);
              const lifeFromStrength = calculateLifeFromStrength(char.baseStats.strength);
              char.baseStats.maxLife = poeBaseLife + lifeFromStrength;
              char.baseStats.life = char.baseStats.maxLife; // Full heal on level up
              
              // PoE base mana: 34 at level 1, +6 per level (much more gradual scaling)
              const poeBaseMana = calculateBaseManaFromLevel(char.level);
              const manaFromIntelligence = calculateManaFromIntelligence(char.baseStats.intelligence);
              char.baseStats.maxMana = poeBaseMana + manaFromIntelligence;
              char.baseStats.mana = char.baseStats.maxMana; // Full mana on level up
              
              // Energy Shield from Intelligence: +0.2% per Intelligence (PoE formula)
              // Intelligence grants +0.2% increased Energy Shield
              const baseES = char.role === 'healer' ? 100 : 0;
              // PoE: ES = baseES * (1 + intelligence * 0.002)
              const esMultiplier = 1 + (char.baseStats.intelligence * 0.002);
              char.baseStats.energyShield = Math.floor(baseES * esMultiplier);
              
              // Evasion bonus from Dexterity: +0.2% per Dexterity
              const baseEvasion = char.role === 'dps' ? 600 : char.role === 'healer' ? 400 : 200;
              const evasionMultiplier = 1 + (char.baseStats.dexterity * 0.002);
              char.baseStats.evasion = Math.floor(baseEvasion * evasionMultiplier);
              
              // Apply permanent -30% resistance penalty when reaching level 40
              // This penalty is applied once when crossing level 40 threshold
              if (char.level >= 40 && oldLevel < 40) {
                char.baseStats.fireResistance = (char.baseStats.fireResistance || 0) - 30;
                char.baseStats.coldResistance = (char.baseStats.coldResistance || 0) - 30;
                char.baseStats.lightningResistance = (char.baseStats.lightningResistance || 0) - 30;
                char.baseStats.chaosResistance = (char.baseStats.chaosResistance || 0) - 30;
              }
            }
            
            result = {
              leveledUp: true,
              newLevel: levelUpResult.newLevel,
              levelsGained: levelUpResult.levelsGained
            };
          }
        });
        
        return result;
      },

      initializeNewGame: () => set(state => {
        // Start with empty team - user must create characters
        state.team = [];
        state.selectedCharacterId = null;
        
        // Give starter orbs
        state.orbs = {
          transmutation: 20,
          alteration: 20,
          augmentation: 10,
          alchemy: 5,
          chaos: 3,
          exalted: 1,
          annulment: 2,
          scouring: 10,
          regal: 5,
          divine: 2
        };
        
        state.gold = 1000;
        
        // Give all skill gems and support gems
        state.ownedSkillGems = SKILL_GEMS.map(g => g.id);
        state.ownedSupportGems = SUPPORT_GEMS.map(g => g.id);
        
        // Generate starter gear
        for (let i = 0; i < 15; i++) {
          const item = generateRandomItem(10, Math.random() > 0.7 ? 'rare' : 'magic');
          state.inventory.push(item);
        }
        
        // Create a starter key (legacy - kept for backward compatibility)
        state.availableKeys = [{
          id: crypto.randomUUID(),
          dungeonId: SAMPLE_DUNGEON.id,
          level: 2,
          affixes: ['fortified'],
          depleted: false
        }];
        
        // Create starter maps (new map system) - 4 tier 1 maps
        state.mapStash = [
          generateMap(1),
          generateMap(1),
          generateMap(1),
          generateMap(1),
        ];
        
        // Create some starter fragments
        state.fragmentCounts = {
          'the_sixth_fragment': 3,
          'the_fragment_that_remembers': 2,
          'the_fragment_that_should_not_persist': 1,
        };
        
        // Reset map device
        state.mapDeviceMap = null;
        state.mapDeviceFragments = [null, null, null, null, null, null];
        state.pendingLoot = [];
        state.activeLeagueEncounters = [];
        state.highestMapTierCompleted = 0;
        
        // Set default tab
        state.activeTab = 'team';
      })
    })),
    {
      name: 'mythic-delve-save',
      version: 3,
      migrate: (persistedState: unknown, version: number) => {
        const state = persistedState as GameState & { 
          stashTabs?: Array<{
            id?: string;
            name: string;
            items: Array<{ itemId?: string; x?: number; y?: number } | Item>;
            color?: string;
          }>;
          mapStash?: MapItem[];
          fragmentStash?: Fragment[];
          mapDeviceMap?: MapItem | null;
          mapDeviceFragments?: (Fragment | null)[];
          pendingLoot?: LootDrop[];
          activeLeagueEncounters?: LeagueEncounter[];
          highestMapTierCompleted?: number;
        };
        
        // Version 3: Add map system fields
        if (version < 3) {
          if (!state.mapStash) state.mapStash = [];
          if (!state.fragmentStash) state.fragmentStash = [];
          if (state.mapDeviceMap === undefined) state.mapDeviceMap = null;
          if (!state.mapDeviceFragments || state.mapDeviceFragments.length < 6) {
            state.mapDeviceFragments = [...(state.mapDeviceFragments || []), ...Array(6 - (state.mapDeviceFragments?.length || 0)).fill(null)];
          }
          if (!state.pendingLoot) state.pendingLoot = [];
          if (!state.activeLeagueEncounters) state.activeLeagueEncounters = [];
          if (state.highestMapTierCompleted === undefined) state.highestMapTierCompleted = 0;
        }
        
        if (version < 2) {
          // Migrate from old stash format to new grid-based format
          // Create new stash tabs if old format or missing
          const newStashTabs: StashTab[] = Array.from({ length: DEFAULT_STASH_TAB_COUNT }, (_, i) => ({
            id: `stash-tab-${i + 1}`,
            name: `Tab ${i + 1}`,
            items: [],
            color: undefined,
          }));
          
          // Migrate items from old stash tabs
          if (state.stashTabs && Array.isArray(state.stashTabs)) {
            state.stashTabs.forEach((oldTab, tabIndex) => {
              if (tabIndex >= newStashTabs.length) return;
              
              // Copy tab name if it exists
              if (oldTab.name) {
                newStashTabs[tabIndex].name = oldTab.name;
              }
              
              // Migrate items - check if old format (items are Item objects)
              if (oldTab.items && Array.isArray(oldTab.items)) {
                oldTab.items.forEach((oldItem) => {
                  // Check if it's an old Item object or new StashItem
                  if (oldItem && typeof oldItem === 'object') {
                    // Old format: item is the full Item object
                    // New format: item is { itemId, x, y }
                    const isOldFormat = 'baseId' in oldItem || 'name' in oldItem;
                    
                    if (isOldFormat) {
                      // This is an Item object from old format
                      const item = oldItem as unknown as Item;
                      const itemSize = getItemGridSize(item);
                      const grid = buildOccupancyGrid(newStashTabs[tabIndex].items, state.inventory || []);
                      const pos = findAvailablePosition(grid, itemSize);
                      
                      if (pos) {
                        newStashTabs[tabIndex].items.push({
                          itemId: item.id,
                          x: pos.x,
                          y: pos.y,
                        });
                      }
                    } else if ('itemId' in oldItem && 'x' in oldItem && 'y' in oldItem) {
                      // Already new format
                      newStashTabs[tabIndex].items.push(oldItem as StashItem);
                    }
                  }
                });
              }
            });
          }
          
          // Migrate items from flat inventory array into first stash tab
          if (state.inventory && Array.isArray(state.inventory)) {
            state.inventory.forEach((item: Item) => {
              // Check if item is already in a stash tab
              const isInStash = newStashTabs.some(tab => 
                tab.items.some(si => si.itemId === item.id)
              );
              
              if (!isInStash) {
                const itemSize = getItemGridSize(item);
                const grid = buildOccupancyGrid(newStashTabs[0].items, state.inventory);
                const pos = findAvailablePosition(grid, itemSize);
                
                if (pos) {
                  newStashTabs[0].items.push({
                    itemId: item.id,
                    x: pos.x,
                    y: pos.y,
                  });
                }
              }
            });
          }
          
          state.stashTabs = newStashTabs;
          state.activeStashTabId = 'stash-tab-1';
        }
        
        // ALWAYS run duplicate removal after migration to catch any duplicates
        // This runs on every store load to ensure data integrity
        const seenItemIds = new Set<string>();
        let duplicatesRemoved = 0;
        
        if (state.stashTabs && Array.isArray(state.stashTabs)) {
          for (const tab of state.stashTabs) {
            if (tab.items && Array.isArray(tab.items)) {
              tab.items = tab.items.filter(stashItem => {
                if (stashItem && stashItem.itemId) {
                  if (seenItemIds.has(stashItem.itemId)) {
                    // Duplicate detected - remove it
                    duplicatesRemoved++;
                    console.error(`[DUPLICATE ITEM REMOVED] Item ${stashItem.itemId} was duplicated in stash tab ${tab.id || 'unknown'}. Removed duplicate.`);
                    return false;
                  }
                  seenItemIds.add(stashItem.itemId);
                  return true;
                }
                return false; // Remove invalid entries
              });
            }
          }
        }
        
        if (duplicatesRemoved > 0) {
          console.warn(`[DUPLICATE CLEANUP] Removed ${duplicatesRemoved} duplicate item(s) from stash during migration.`);
        }
        
        return state;
      },
      onRehydrateStorage: () => {
        // Run duplicate removal whenever store is loaded from localStorage
        return (state) => {
          if (state) {
            const seenItemIds = new Set<string>();
            let duplicatesRemoved = 0;
            
            if (state.stashTabs && Array.isArray(state.stashTabs)) {
              for (const tab of state.stashTabs) {
                if (tab.items && Array.isArray(tab.items)) {
                  tab.items = tab.items.filter(stashItem => {
                    if (stashItem && stashItem.itemId) {
                      if (seenItemIds.has(stashItem.itemId)) {
                        duplicatesRemoved++;
                        console.error(`[DUPLICATE ITEM REMOVED] Item ${stashItem.itemId} was duplicated in stash tab ${tab.id || 'unknown'}. Removed duplicate.`);
                        return false;
                      }
                      seenItemIds.add(stashItem.itemId);
                      return true;
                    }
                    return false;
                  });
                }
              }
            }
            
            if (duplicatesRemoved > 0) {
              console.warn(`[DUPLICATE CLEANUP] Removed ${duplicatesRemoved} duplicate item(s) from stash on load.`);
            }
          }
        };
      },
    }
  )
);

