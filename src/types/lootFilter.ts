// Types for Path of Exile style loot filter system

export type FilterAction = 'Show' | 'Hide';

export interface FilterStyle {
  fontSize?: number;
  textColor?: string;  // rgba format
  borderColor?: string;  // rgba format
  backgroundColor?: string;  // rgba format
  playAlertSound?: { id: number; volume: number };
  playEffect?: string;  // 'Red', 'Blue', 'Green', etc.
  minimapIcon?: { size: number; color: string; shape: string };
}

export interface FilterCondition {
  // Item properties
  rarity?: string[];  // 'Normal', 'Magic', 'Rare', 'Unique'
  baseType?: string[];  // Base item names
  itemClass?: string[];  // Item classes
  itemLevel?: { min?: number; max?: number };
  dropLevel?: { min?: number; max?: number };
  quality?: { min?: number; max?: number };
  
  // Sockets and links
  sockets?: { min?: number; max?: number; colors?: string };
  linkedSockets?: number;
  socketGroup?: string;  // e.g., "RGB", "RRRR"
  
  // Item state
  corrupted?: boolean;
  identified?: boolean;
  mirrored?: boolean;
  
  // Influence
  hasInfluence?: string[];  // 'Shaper', 'Elder', 'Crusader', etc.
  
  // Stacking
  stackSize?: { min?: number; max?: number };
  
  // Area
  areaLevel?: { min?: number; max?: number };
  
  // Map specific
  mapTier?: { min?: number; max?: number };
  
  // Special
  fractured?: boolean;
  synthesised?: boolean;
  enchanted?: boolean;
}

export interface FilterRule {
  action: FilterAction;
  conditions: FilterCondition;
  style: FilterStyle;
  comment?: string;  // The comment from the filter file
  priority: number;  // Rule order matters in PoE filters
}

export interface LootFilterConfig {
  name: string;
  version?: string;
  author?: string;
  strictness?: string;
  rules: FilterRule[];
}

export interface FilterResult {
  show: boolean;
  style: FilterStyle;
  matchedRule?: FilterRule;
}

// Helper type for converting RGB values
export interface RGBColor {
  r: number;
  g: number;
  b: number;
  a?: number;
}

