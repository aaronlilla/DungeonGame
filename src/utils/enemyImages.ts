/**
 * Utility to get enemy image path from enemy name
 * Images are stored in src/assets/enemies/ and named by their actual names
 */

import type { IconType } from 'react-icons';
import {
  GiSkullCrossedBones, GiRat, GiTombstone, GiCrossedSwords,
  GiWizardStaff, GiBatMask, GiSkullShield, GiShieldBash, GiBroadsword,
  GiGhostAlly, GiSkeleton, GiSpikedDragonHead
} from 'react-icons/gi';
import type { EnemyType } from '../types/dungeon';

// Icon mapping for different enemy types and specific enemies
const ENEMY_ICON_MAP: Record<string, IconType> = {
  // Specific enemy icons
  'skeleton_warrior': GiSkeleton,
  'skeleton_mage': GiWizardStaff,
  'skeleton_captain': GiCrossedSwords,
  'dark_sorcerer': GiWizardStaff,
  'necromancer': GiWizardStaff,
  'crypt_warlock': GiWizardStaff,
  'shadow_assassin': GiBroadsword,
  'ghoul': GiSkullCrossedBones,
  'cultist': GiBatMask,
  'risen_corpse': GiGhostAlly,
  'zombie': GiTombstone,
  'grave_rat': GiRat,
  'bone_crusher': GiShieldBash,
  'grave_executioner': GiSkullShield,
  'tomb_smasher': GiShieldBash,
  'grave_knight': GiShieldBash,
  'tomb_guardian': GiSkullShield,
  'bone_golem': GiSpikedDragonHead,
  'death_knight': GiSkullShield,
  'lich': GiWizardStaff,
  'necromancer_lord': GiSkullShield,
};

// Default icons by enemy type
const TYPE_ICON_MAP: Record<EnemyType, IconType> = {
  'normal': GiSkeleton,
  'elite': GiSkullShield,
  'miniboss': GiSpikedDragonHead,
  'boss': GiSkullCrossedBones,
};

// Color schemes for enemy types - muted, earthy tones
export const ENEMY_TYPE_COLORS: Record<EnemyType, { primary: string; glow: string; bg: string }> = {
  'normal': {
    primary: '#7a8890',
    glow: 'rgba(100, 115, 125, 0.3)',
    bg: 'linear-gradient(135deg, rgba(50,55,60,0.9) 0%, rgba(35,40,45,0.95) 100%)'
  },
  'elite': {
    primary: '#b87333',
    glow: 'rgba(160, 100, 45, 0.35)',
    bg: 'linear-gradient(135deg, rgba(120,80,40,0.9) 0%, rgba(80,55,30,0.95) 100%)'
  },
  'miniboss': {
    primary: '#7a5090',
    glow: 'rgba(100, 65, 120, 0.4)',
    bg: 'linear-gradient(135deg, rgba(80,50,100,0.9) 0%, rgba(55,35,70,0.95) 100%)'
  },
  'boss': {
    primary: '#a04040',
    glow: 'rgba(140, 55, 50, 0.4)',
    bg: 'linear-gradient(135deg, rgba(120,45,40,0.9) 0%, rgba(80,30,28,0.95) 100%)'
  },
};

/**
 * Get the icon component for an enemy by ID or type
 */
export function getEnemyIconComponent(enemyId: string, enemyType: EnemyType): IconType {
  // Try specific enemy icon first
  if (ENEMY_ICON_MAP[enemyId]) {
    return ENEMY_ICON_MAP[enemyId];
  }
  // Fall back to type-based icon
  return TYPE_ICON_MAP[enemyType] || GiSkeleton;
}

// Use Vite's import.meta.glob to dynamically import all enemy images
// This handles filenames with special characters like apostrophes
const enemyImageModules = import.meta.glob('../assets/enemies/*.png', { eager: true, as: 'url' }) as Record<string, string>;

/**
 * Normalize a string for matching (remove quotes, normalize apostrophes, lowercase)
 */
function normalizeForMatching(str: string): string {
  return str
    .replace(/[""]/g, '') // Remove any double quotes
    .replace(/[''`'']/g, '') // Remove all apostrophe types (for simplified matching)
    .replace(/\s+/g, ' ') // Normalize multiple spaces to single space
    .toLowerCase()
    .trim();
}

/**
 * Extract the core name from a boss name (first significant word, before comma)
 * e.g., "Zha'karoth, The Fold Between Stars" -> "zhakaroth"
 * e.g., "Qel'Thuun the Infinite Murmur" -> "qelthuun"
 */
function extractCoreName(bossName: string): string {
  // Remove apostrophes and normalize
  let core = normalizeForMatching(bossName);
  
  // If there's a comma, take only the part before it
  const commaIndex = core.indexOf(',');
  if (commaIndex !== -1) {
    core = core.substring(0, commaIndex).trim();
  }
  
  // Take only the first word (for simplified filenames like "zhakaroth.png" or "qelthuun.png")
  const firstWord = core.split(/\s+/)[0];
  
  return firstWord;
}

// Create a map from enemy name to image URL
const enemyImageMap: Record<string, string> = {};

// Extract enemy names from file paths and map them
Object.keys(enemyImageModules).forEach((path) => {
  // Extract filename from path - handle both forward and backslashes
  // Paths can be: "../assets/enemies/Enemy Name.png" or "src/assets/enemies/Enemy Name.png"
  const parts = path.split(/[/\\]/);
  const filenameWithExt = parts[parts.length - 1] || '';
  const filename = filenameWithExt.replace(/\.png$/i, '');
  
  if (filename) {
    // Store exact filename match
    enemyImageMap[filename] = enemyImageModules[path];
    
    // Also add lowercase version for case-insensitive matching
    const lowerFilename = filename.toLowerCase();
    if (!enemyImageMap[lowerFilename]) {
      enemyImageMap[lowerFilename] = enemyImageModules[path];
    }
    
    // Add normalized version using the same normalization function
    const normalized = normalizeForMatching(filename);
    if (!enemyImageMap[normalized]) {
      enemyImageMap[normalized] = enemyImageModules[path];
    }
  }
});

// Debug: log the map to see what we have
if (import.meta.env.DEV) {
  console.log('[enemyImages] Loaded images:', Object.keys(enemyImageMap).length, 'files');
  console.log('[enemyImages] Sample keys:', Object.keys(enemyImageMap).slice(0, 5));
}

/**
 * Get enemy image path for a given enemy name
 * Returns the image path or null if not found
 */
export function getEnemyImage(enemyName: string): string | null {
  if (!enemyName) return null;
  
  // Clean the input name (remove surrounding quotes if any)
  const cleanName = enemyName.replace(/^["']|["']$/g, '').trim();
  
  // Try exact match first
  if (enemyImageMap[cleanName]) {
    return enemyImageMap[cleanName];
  }
  
  // Try case-insensitive match
  const lowerName = cleanName.toLowerCase();
  if (enemyImageMap[lowerName]) {
    return enemyImageMap[lowerName];
  }
  
  // Try normalized match (handles apostrophes, quotes, case)
  const normalizedName = normalizeForMatching(cleanName);
  for (const [key, value] of Object.entries(enemyImageMap)) {
    const normalizedKey = normalizeForMatching(key);
    if (normalizedKey === normalizedName) {
      return value;
    }
  }
  
  // Try core name extraction (for simplified filenames like "zhakaroth.png" matching "Zha'karoth, The Fold Between Stars")
  const coreName = extractCoreName(cleanName);
  if (coreName && enemyImageMap[coreName]) {
    return enemyImageMap[coreName];
  }
  
  // Try partial match (in case there are extra spaces or characters)
  let foundImage: string | null = null;
  for (const [key, value] of Object.entries(enemyImageMap)) {
    const normalizedKey = normalizeForMatching(key);
    const normalizedInput = normalizeForMatching(cleanName);
    
    // Check if core name matches
    const keyCore = extractCoreName(key);
    if (keyCore === coreName && coreName.length > 0) {
      foundImage = value;
      break;
    }
    
    // Check if one contains the other (for partial matches)
    if (normalizedKey.includes(normalizedInput) || normalizedInput.includes(normalizedKey)) {
      // Only use if they're similar enough (at least 80% match)
      const longer = normalizedKey.length > normalizedInput.length ? normalizedKey : normalizedInput;
      const shorter = normalizedKey.length > normalizedInput.length ? normalizedInput : normalizedKey;
      if (shorter.length / longer.length > 0.8) {
        foundImage = value;
        break;
      }
    }
  }
  
  // Only log warnings for bosses/minibosses, not regular enemies (they don't have images)
  // Check for common boss name patterns
  const lowerCleanName = cleanName.toLowerCase();
  
  // Minibosses that don't have images yet - don't warn for these
  const minibossesWithoutImages = [
    'bone golem',
    'death knight',
    'undying lich'
  ];
  
  const isMinibossWithoutImage = minibossesWithoutImages.some(name => 
    lowerCleanName.includes(name) || normalizeForMatching(cleanName).includes(normalizeForMatching(name))
  );
  
  const isBoss = lowerCleanName.includes('boss') || 
                 lowerCleanName.includes('lich') ||
                 lowerCleanName.includes('golem') ||
                 (lowerCleanName.includes('knight') && lowerCleanName.includes('death')) ||
                 lowerCleanName.includes('necromancer lord') ||
                 // Check for known boss names
                 lowerCleanName.includes('vaelrix') ||
                 lowerCleanName.includes('morchant') ||
                 lowerCleanName.includes('xyra') ||
                 lowerCleanName.includes('thalos') ||
                 lowerCleanName.includes('eidolon') ||
                 lowerCleanName.includes('sable') ||
                 lowerCleanName.includes('orryx') ||
                 lowerCleanName.includes('virexa') ||
                 lowerCleanName.includes('ashbound') ||
                 lowerCleanName.includes('kaelthorne') ||
                 lowerCleanName.includes('ulthraxis') ||
                 lowerCleanName.includes('nyxavel') ||
                 lowerCleanName.includes("zha'karoth") ||
                 lowerCleanName.includes('zha') && lowerCleanName.includes('karoth') ||
                 lowerCleanName.includes('pale confluence') ||
                 lowerCleanName.includes('ichorion') ||
                 lowerCleanName.includes("qel'thuun") ||
                 lowerCleanName.includes('spiral witness') ||
                 lowerCleanName.includes('voruun') ||
                 lowerCleanName.includes('cenotaph');
  
  // Debug in dev mode - only log when image not found for bosses (but skip minibosses without images)
  if (import.meta.env.DEV && !foundImage && isBoss && !isMinibossWithoutImage) {
    console.warn(`[getEnemyImage] No image found for boss: "${enemyName}" (cleaned: "${cleanName}")`, {
      availableKeys: Object.keys(enemyImageMap).slice(0, 20),
      totalImages: Object.keys(enemyImageMap).length,
      normalizedInput: normalizeForMatching(cleanName),
      allKeys: Object.keys(enemyImageMap)
    });
  }
  
  return foundImage;
}
