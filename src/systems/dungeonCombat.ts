/**
 * Dungeon Combat System with Code Splitting
 * 
 * This module uses dynamic imports to enable code splitting, allowing
 * the combat system to be loaded on-demand rather than in the initial bundle.
 * This improves initial page load performance.
 */

// Synchronously export types (needed for type checking at compile time)
export type { DungeonCombatCallbacks, DungeonCombatParams } from './combat/types';
export { sleep } from './combat/types';

// Lazy-loaded combat function with code splitting
let combatModule: typeof import('./combat/runDungeonCombat') | null = null;
let combatModulePromise: Promise<typeof import('./combat/runDungeonCombat')> | null = null;

/**
 * Dynamically loads the combat module on first use
 * This enables code splitting - the combat code is only loaded when needed
 */
async function loadCombatModule(): Promise<typeof import('./combat/runDungeonCombat')> {
  if (combatModule) {
    return combatModule;
  }
  
  if (!combatModulePromise) {
    // Dynamic import creates a separate chunk for code splitting
    combatModulePromise = import('./combat/runDungeonCombat/index');
  }
  
  combatModule = await combatModulePromise;
  return combatModule;
}

/**
 * Main dungeon combat function with lazy loading
 * 
 * This function maintains the same API as before, but the implementation
 * is loaded dynamically on first call. This enables code splitting.
 * 
 * @param params - Combat parameters
 * @returns Promise resolving to dungeon run result or null
 */
export async function runDungeonCombat(
  params: import('./combat/types').DungeonCombatParams
): Promise<import('../types/dungeon').DungeonRunResult | null> {
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
