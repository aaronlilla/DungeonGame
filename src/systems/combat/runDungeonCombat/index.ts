/**
 * Dungeon Combat Runner with Heavy Code Splitting
 * 
 * This module uses dynamic imports to enable code splitting, allowing
 * the combat system to be loaded on-demand rather than in the initial bundle.
 * This improves initial page load performance.
 */

// Synchronously export types (needed for type checking at compile time)
export type { DungeonCombatCallbacks, DungeonCombatParams } from '../types';

// Lazy-loaded combat function with code splitting
let combatModule: typeof import('./main') | null = null;
let combatModulePromise: Promise<typeof import('./main')> | null = null;

/**
 * Dynamically loads the combat module on first use
 * This enables code splitting - the combat code is only loaded when needed
 */
async function loadCombatModule(): Promise<typeof import('./main')> {
  if (combatModule) {
    return combatModule;
  }

  if (!combatModulePromise) {
    // Dynamic import creates a separate chunk for code splitting
    combatModulePromise = import('./main');
  }

  combatModule = await combatModulePromise;
  return combatModule;
}

/**
 * Main dungeon combat function with lazy loading
 *
 * This function maintains the same API as before, but the implementation
 * is loaded dynamically on first call. This enables code splitting.
 */
export async function runDungeonCombat(
  params: import('../types').DungeonCombatParams
): Promise<import('../../../types/dungeon').DungeonRunResult | null> {
  const module = await loadCombatModule();
  return module.runDungeonCombat(params);
}

/**
 * Preload the combat module (optional optimization)
 * Call this if you know combat will be needed soon
 */
export async function preloadCombatModule(): Promise<void> {
  await loadCombatModule();
}
