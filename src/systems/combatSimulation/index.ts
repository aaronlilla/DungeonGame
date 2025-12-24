/**
 * Combat Simulation System with Heavy Code Splitting
 * 
 * This module uses dynamic imports to enable code splitting, allowing
 * the simulation system to be loaded on-demand rather than in the initial bundle.
 * This improves initial page load performance.
 */

// Synchronously export types (needed for type checking at compile time)
export type { TestResult, DungeonCompletionTest, CombatLogCallback } from './types';

// Lazy-loaded simulation function with code splitting
let simulationModule: typeof import('./simulation') | null = null;
let simulationModulePromise: Promise<typeof import('./simulation')> | null = null;

/**
 * Dynamically loads the simulation module on first use
 * This enables code splitting - the simulation code is only loaded when needed
 */
async function loadSimulationModule(): Promise<typeof import('./simulation')> {
  if (simulationModule) {
    return simulationModule;
  }

  if (!simulationModulePromise) {
    // Dynamic import creates a separate chunk for code splitting
    simulationModulePromise = import('./simulation');
  }

  simulationModule = await simulationModulePromise;
  return simulationModule;
}

/**
 * Main simulation function with lazy loading
 *
 * This function maintains the same API as before, but the implementation
 * is loaded dynamically on first call. This enables code splitting.
 */
export async function runCombatSimulationTest(
  team: import('../../types/character').Character[],
  dungeon: import('../../types/dungeon').Dungeon,
  keyLevel: number = 2,
  onCombatLog?: (entry: import('../../types/dungeon').CombatLogEntry) => void,
  stopRef?: { current: boolean }
): Promise<import('./types').TestResult> {
  const module = await loadSimulationModule();
  return module.runCombatSimulationTest(team, dungeon, keyLevel, onCombatLog, stopRef);
}

/**
 * Preload the simulation module (optional optimization)
 * Call this if you know simulation will be needed soon
 */
export async function preloadSimulationModule(): Promise<void> {
  await loadSimulationModule();
}
