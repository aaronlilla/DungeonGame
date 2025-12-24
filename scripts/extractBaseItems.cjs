/**
 * Extract PoE base items (armor, weapons, jewellery) from data files
 * Run with: node scripts/extractBaseItems.cjs
 */

const fs = require('fs');
const path = require('path');

// Item classes we want to extract
const WANTED_ITEM_CLASSES = [
  // Armor
  'Body Armour',
  'Helmet',
  'Gloves',
  'Boots',
  'Shield',
  // Weapons - One Hand
  'One Hand Sword',
  'Thrusting One Hand Sword',
  'One Hand Axe',
  'One Hand Mace',
  'Dagger',
  'Rune Dagger',
  'Claw',
  'Wand',
  'Sceptre',
  // Weapons - Two Hand
  'Two Hand Sword',
  'Two Hand Axe',
  'Two Hand Mace',
  'Staff',
  'Warstaff',
  'Bow',
  // Jewellery
  'Amulet',
  'Ring',
  'Belt',
  // Other
  'Quiver',
];

// Load the base items data
console.log('Loading base_items.json...');
const baseItemsPath = path.join(__dirname, '..', 'src', 'data', 'base_items.json');
const baseItems = JSON.parse(fs.readFileSync(baseItemsPath, 'utf8'));

// Load the mods data for implicits
console.log('Loading mods.json...');
const modsPath = path.join(__dirname, '..', 'src', 'data', 'mods.json');
const mods = JSON.parse(fs.readFileSync(modsPath, 'utf8'));

// Filter and transform base items
console.log('Extracting relevant base items...');

const extractedItems = [];
const implicitModsUsed = new Set();

for (const [id, item] of Object.entries(baseItems)) {
  // Skip if not a wanted item class
  if (!WANTED_ITEM_CLASSES.includes(item.item_class)) {
    continue;
  }
  
  // Skip items that aren't released (unique_only, unreleased, etc.)
  if (item.release_state !== 'released') {
    continue;
  }
  
  // Skip demigod items and special items
  if (item.tags && (item.tags.includes('demigods') || item.tags.includes('not_for_sale'))) {
    // Allow atlas base types even though they have not_for_sale
    if (!item.tags.includes('atlas_base_type')) {
      continue;
    }
  }
  
  // Track implicit mods
  if (item.implicits) {
    item.implicits.forEach(imp => implicitModsUsed.add(imp));
  }
  
  // Transform to our format
  const transformed = {
    id: id,
    name: item.name,
    itemClass: item.item_class,
    dropLevel: item.drop_level,
    inventoryWidth: item.inventory_width,
    inventoryHeight: item.inventory_height,
    requirements: item.requirements ? {
      level: item.requirements.level || 0,
      strength: item.requirements.strength || 0,
      dexterity: item.requirements.dexterity || 0,
      intelligence: item.requirements.intelligence || 0,
    } : null,
    properties: item.properties || {},
    implicits: item.implicits || [],
    tags: item.tags || [],
    // Include visual identity for item artwork
    visualIdentity: item.visual_identity ? {
      ddsFile: item.visual_identity.dds_file,
      id: item.visual_identity.id,
    } : undefined,
  };
  
  extractedItems.push(transformed);
}

console.log(`Extracted ${extractedItems.length} base items`);

// Sort by item class, then by drop level
extractedItems.sort((a, b) => {
  if (a.itemClass !== b.itemClass) {
    return a.itemClass.localeCompare(b.itemClass);
  }
  return a.dropLevel - b.dropLevel;
});

// Group items by class for readability
const groupedItems = {};
for (const item of extractedItems) {
  if (!groupedItems[item.itemClass]) {
    groupedItems[item.itemClass] = [];
  }
  groupedItems[item.itemClass].push(item);
}

// Extract implicit mods that are used
console.log(`Found ${implicitModsUsed.size} unique implicit mods`);
const implicitMods = {};

for (const modId of implicitModsUsed) {
  const mod = mods[modId];
  if (mod) {
    implicitMods[modId] = {
      id: modId,
      name: mod.name || '',
      requiredLevel: mod.required_level || 0,
      stats: mod.stats || [],
      groups: mod.groups || [],
    };
  }
}

// Count items per class
console.log('\nItems per class:');
for (const [cls, items] of Object.entries(groupedItems)) {
  console.log(`  ${cls}: ${items.length}`);
}

// Generate TypeScript output
console.log('\nGenerating TypeScript file...');

let output = `// Auto-generated from PoE data files
// Run: node scripts/extractBaseItems.cjs to regenerate

import type { PoeBaseItem, PoeMod } from '../types/poeItems';

// ===== IMPLICIT MODS =====
// These are the built-in mods on base items
export const POE_IMPLICIT_MODS: Record<string, PoeMod> = {
`;

// Add implicit mods
for (const [modId, mod] of Object.entries(implicitMods)) {
  output += `  "${modId}": ${JSON.stringify(mod, null, 4).split('\n').map((line, i) => i === 0 ? line : '  ' + line).join('\n')},\n`;
}

output += `};

// ===== BASE ITEMS =====
`;

// Add items grouped by class
for (const [itemClass, items] of Object.entries(groupedItems)) {
  const varName = itemClass.toUpperCase().replace(/\s+/g, '_') + '_BASES';
  output += `\n// ${itemClass} (${items.length} items)\n`;
  output += `export const ${varName}: PoeBaseItem[] = [\n`;
  
  for (const item of items) {
    output += `  ${JSON.stringify(item, null, 4).split('\n').map((line, i) => i === 0 ? line : '  ' + line).join('\n')},\n`;
  }
  
  output += `];\n`;
}

// Add a combined array
output += `
// ===== ALL BASE ITEMS COMBINED =====
export const ALL_POE_BASE_ITEMS: PoeBaseItem[] = [
`;

for (const itemClass of Object.keys(groupedItems)) {
  const varName = itemClass.toUpperCase().replace(/\s+/g, '_') + '_BASES';
  output += `  ...${varName},\n`;
}

output += `];

// ===== HELPER FUNCTIONS =====

// Get a base item by its ID
export function getPoeBaseItemById(id: string): PoeBaseItem | undefined {
  return ALL_POE_BASE_ITEMS.find(item => item.id === id);
}

// Get a base item by its name
export function getPoeBaseItemByName(name: string): PoeBaseItem | undefined {
  return ALL_POE_BASE_ITEMS.find(item => item.name === name);
}

// Get all base items for a specific item class
export function getPoeBaseItemsByClass(itemClass: string): PoeBaseItem[] {
  return ALL_POE_BASE_ITEMS.filter(item => item.itemClass === itemClass);
}

// Get all base items within a drop level range
export function getPoeBaseItemsByDropLevel(minLevel: number, maxLevel: number): PoeBaseItem[] {
  return ALL_POE_BASE_ITEMS.filter(item => item.dropLevel >= minLevel && item.dropLevel <= maxLevel);
}

// Get implicit mod by ID
export function getImplicitMod(modId: string): PoeMod | undefined {
  return POE_IMPLICIT_MODS[modId];
}

// Get all implicit mods for a base item
export function getImplicitsForBaseItem(baseItem: PoeBaseItem): PoeMod[] {
  return baseItem.implicits
    .map(id => POE_IMPLICIT_MODS[id])
    .filter((mod): mod is PoeMod => mod !== undefined);
}

// Format implicit mod stats as readable text
export function formatImplicitStats(mod: PoeMod): string[] {
  return mod.stats.map(stat => {
    const value = stat.min === stat.max ? stat.min.toString() : \`\${stat.min}-\${stat.max}\`;
    // Simple formatting - in production you'd use stat_translations.json
    return \`\${stat.id.replace(/_/g, ' ')}: \${value}\`;
  });
}
`;

// Write the output file
const outputPath = path.join(__dirname, '..', 'src', 'data', 'poeBaseItems.ts');
fs.writeFileSync(outputPath, output, 'utf8');

console.log(`\nWrote ${outputPath}`);
console.log('Done!');

