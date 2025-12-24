/**
 * Dungeon Combat Runner - Legacy Entry Point
 * 
 * This file now re-exports from the new code-split module structure.
 * It maintains backward compatibility while enabling code splitting.
 */

// Re-export types and functions from the new modular structure
export type { DungeonCombatCallbacks, DungeonCombatParams } from './runDungeonCombat/index';
export { runDungeonCombat, preloadCombatModule } from './runDungeonCombat/index';
