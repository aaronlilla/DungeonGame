/**
 * Combat Simulation Test - Legacy Entry Point
 * 
 * This file now re-exports from the new code-split module structure.
 * It maintains backward compatibility while enabling code splitting.
 */

// Re-export types and functions from the new modular structure
export type { TestResult, CombatLogCallback } from './combatSimulation';
export { runCombatSimulationTest, preloadSimulationModule } from './combatSimulation';
