/**
 * Item Art Utilities
 * 
 * Fetches item artwork from the RePoE repository
 * https://repoe-fork.github.io/poe1.html
 */

// Base URL for the RePoE CDN
const REPOE_BASE_URL = 'https://repoe-fork.github.io';

/**
 * Convert a DDS file path from base_items.json to a PNG URL
 * Example: "Art/2DItems/Amulets/BluePearlAmulet.dds" -> full PNG URL
 */
export function ddsPathToPngUrl(ddsPath: string): string {
  if (!ddsPath) return '';
  
  // Replace .dds with .png
  const pngPath = ddsPath.replace(/\.dds$/i, '.png');
  
  return `${REPOE_BASE_URL}/${pngPath}`;
}

/**
 * Get the art URL for an item based on its visual identity
 */
export function getItemArtUrl(visualIdentity?: { dds_file?: string; ddsFile?: string; id?: string }): string | null {
  if (!visualIdentity) return null;
  
  // Handle both snake_case and camelCase property names
  const ddsFile = visualIdentity.dds_file || visualIdentity.ddsFile;
  
  if (!ddsFile) return null;
  
  return ddsPathToPngUrl(ddsFile);
}

/**
 * Get a fallback/placeholder art URL for item types without specific art
 */
export function getFallbackArtUrl(itemClass: string): string {
  // Map item classes to generic art paths
  const fallbacks: Record<string, string> = {
    'Ring': 'Art/2DItems/Rings/Ring1.png',
    'Amulet': 'Art/2DItems/Amulets/Amulet1.png',
    'Belt': 'Art/2DItems/Belts/Belt1.png',
    'Body Armour': 'Art/2DItems/Armours/BodyArmours/BodyStr1A.png',
    'Helmet': 'Art/2DItems/Armours/Helmets/HelmetStr1.png',
    'Gloves': 'Art/2DItems/Armours/Gloves/GlovesStr1.png',
    'Boots': 'Art/2DItems/Armours/Boots/BootsStr1.png',
    'Shield': 'Art/2DItems/Armours/Shields/ShieldStr1.png',
    'One Hand Sword': 'Art/2DItems/Weapons/OneHandWeapons/OneHandSwords/OneHandSword1.png',
    'Two Hand Sword': 'Art/2DItems/Weapons/TwoHandWeapons/TwoHandSwords/TwoHandSword1.png',
    'Dagger': 'Art/2DItems/Weapons/OneHandWeapons/Daggers/Dagger1.png',
    'Wand': 'Art/2DItems/Weapons/OneHandWeapons/Wands/Wand1.png',
    'Staff': 'Art/2DItems/Weapons/TwoHandWeapons/Staves/Staff1.png',
    'Bow': 'Art/2DItems/Weapons/TwoHandWeapons/Bows/Bow1.png',
    'Claw': 'Art/2DItems/Weapons/OneHandWeapons/Claws/Claw1.png',
    'One Hand Axe': 'Art/2DItems/Weapons/OneHandWeapons/OneHandAxes/OneHandAxe1.png',
    'Two Hand Axe': 'Art/2DItems/Weapons/TwoHandWeapons/TwoHandAxes/TwoHandAxe1.png',
    'One Hand Mace': 'Art/2DItems/Weapons/OneHandWeapons/OneHandMaces/OneHandMace1.png',
    'Two Hand Mace': 'Art/2DItems/Weapons/TwoHandWeapons/TwoHandMaces/TwoHandMace1.png',
    'Sceptre': 'Art/2DItems/Weapons/OneHandWeapons/Sceptres/Sceptre1.png',
    'Quiver': 'Art/2DItems/Quivers/Quiver1.png',
  };
  
  const path = fallbacks[itemClass];
  if (path) {
    return `${REPOE_BASE_URL}/${path}`;
  }
  
  return '';
}

/**
 * Preload an image to check if it exists and cache it
 */
export function preloadImage(url: string): Promise<boolean> {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => resolve(true);
    img.onerror = () => resolve(false);
    img.src = url;
  });
}

/**
 * Get the rarity border/frame color for item art display
 */
export function getRarityFrameColor(rarity: string): {
  border: string;
  glow: string;
  bg: string;
} {
  const colors: Record<string, { border: string; glow: string; bg: string }> = {
    normal: { 
      border: 'rgba(150, 150, 150, 0.6)', 
      glow: 'rgba(150, 150, 150, 0.2)', 
      bg: 'rgba(30, 30, 30, 0.8)' 
    },
    magic: { 
      border: 'rgba(136, 136, 255, 0.7)', 
      glow: 'rgba(136, 136, 255, 0.3)', 
      bg: 'rgba(30, 30, 60, 0.8)' 
    },
    rare: { 
      border: 'rgba(255, 255, 119, 0.7)', 
      glow: 'rgba(255, 255, 119, 0.3)', 
      bg: 'rgba(60, 50, 20, 0.8)' 
    },
    unique: { 
      border: 'rgba(175, 96, 37, 0.8)', 
      glow: 'rgba(175, 96, 37, 0.4)', 
      bg: 'rgba(50, 30, 15, 0.8)' 
    },
    legendary: { 
      border: 'rgba(190, 94, 255, 0.8)', 
      glow: 'rgba(190, 94, 255, 0.4)', 
      bg: 'rgba(50, 20, 60, 0.8)' 
    },
  };
  
  return colors[rarity] || colors.normal;
}

