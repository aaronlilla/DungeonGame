import type { AnimatedEnemy } from '../../types/combat';
import type { EnemyPack } from '../../types/dungeon';
import { getEnemyById } from '../../types/dungeon';
import { getEnemyBehavior } from '../../utils/combat';
import { assignEnemyDefensiveStats } from '../../utils/enemyStats';
import { getRandomBossName } from '../../utils/bossNames';
import { sleep, secondsToTicks, ticksToSeconds } from './types';
import type { CombatContext } from './types';

export async function travelToPull(
  context: CombatContext,
  pullIdx: number,
  _packs: EnemyPack[],
  targetX: number,
  targetY: number
): Promise<void> {
  const { currentPos, totalTime, updateCombatState, checkTimeout, combatRef } = context;
  
  const distance = Math.sqrt(Math.pow(targetX - currentPos.x, 2) + Math.pow(targetY - currentPos.y, 2));
  const travelTime = Math.max(1.5, Math.min(5, distance / 200));
  // Reduced from 60 to 20 steps for better performance (still smooth but fewer state updates)
  const travelSteps = 20;

  updateCombatState(prev => ({ 
    ...prev, 
    phase: 'traveling', 
    currentPullIndex: pullIdx, 
    combatLog: [...prev.combatLog, { 
      timestamp: totalTime, 
      type: 'travel', 
      source: '', 
      target: '', 
      message: `🚶 Moving to Pull #${pullIdx + 1}... (${travelTime.toFixed(1)}s)` 
    }] 
  }));

  // For simulation: skip travel animation, just update time
  const isSimulation = combatRef.current.simulationContextRef !== undefined;
  const travelTicks = secondsToTicks(travelTime);
  
  if (isSimulation) {
    // In simulation, instantly travel (just update time)
    context.currentTick += travelTicks;
    context.totalTime = ticksToSeconds(context.currentTick);
    context.currentPos = { x: targetX, y: targetY };
    updateCombatState(prev => ({ 
      ...prev, 
      teamPosition: { x: targetX, y: targetY }, 
      timeElapsed: context.totalTime 
    }));
  } else {
    // Normal travel with animation - PERFORMANCE OPTIMIZED
    // Reduced state updates: only update state 3-5 times during travel (was 5-8)
    // CSS transitions handle smooth interpolation between updates, reducing React re-renders
    const ticksPerStep = Math.ceil(travelTicks / travelSteps);
    const stateUpdateCount = Math.min(5, Math.max(3, Math.floor(travelTime * 1.5))); // 3-5 updates (fewer for better performance)
    const stateUpdateInterval = Math.floor(travelSteps / stateUpdateCount);
    
    for (let i = 1; i <= travelSteps; i++) {
      if (combatRef.current.stop || checkTimeout()) break;
      
      // Calculate position
      const progress = i / travelSteps;
      const eased = 1 - Math.pow(1 - progress, 2);
      const newX = currentPos.x + (targetX - currentPos.x) * eased;
      const newY = currentPos.y + (targetY - currentPos.y) * eased;
      
      // Update time every step
      context.currentTick += ticksPerStep;
      context.totalTime = ticksToSeconds(context.currentTick);
      
      // Only update React state every N steps to dramatically reduce re-renders
      // This reduces from 20 state updates to only 5-8 state updates per travel
      if (i % stateUpdateInterval === 0 || i === travelSteps) {
        updateCombatState(prev => ({ 
          ...prev, 
          teamPosition: { x: newX, y: newY }, 
          timeElapsed: context.totalTime 
        }));
      } else {
        // For intermediate steps, update position directly in context without triggering React re-render
        context.currentCombatState.teamPosition = { x: newX, y: newY };
        context.currentCombatState.timeElapsed = context.totalTime;
      }
      
      // Sleep between steps (much faster now since we have fewer state updates)
      await sleep((travelTime * 1000) / travelSteps, combatRef);
    }
  }
  
  context.currentPos = { x: targetX, y: targetY };
}

// Map affix effects interface for enemy creation
interface MapAffixEffects {
  enemyDamageIncrease: number;
  enemyHealthIncrease: number;
  playerDamageReduction: number;
  enemySpeed: number;
}

export function createPullEnemies(
  packs: EnemyPack[],
  pullIdx: number,
  scaling: { healthMultiplier: number; damageMultiplier: number },
  _shieldActive: boolean,
  mapAffixEffects?: MapAffixEffects,
  usedBossNames?: Set<string>
): AnimatedEnemy[] {
  const pullEnemies: AnimatedEnemy[] = [];
  // Also return enemies organized by pack for trickle-in logic
  const enemiesByPack: AnimatedEnemy[][] = [];
  
  // Apply map affix modifiers
  const healthMod = 1 + (mapAffixEffects?.enemyHealthIncrease || 0);
  const damageMod = 1 + (mapAffixEffects?.enemyDamageIncrease || 0);
  
  // Check if this pull contains a gate boss
  const hasGateBoss = packs.some(p => p.isGateBoss);
  let gateBossName: string | undefined;
  if (hasGateBoss) {
    gateBossName = getRandomBossName(usedBossNames);
    if (usedBossNames) {
      usedBossNames.add(gateBossName);
    }
  }
  
  packs.forEach(pack => {
    const packEnemies: AnimatedEnemy[] = [];
    pack.enemies.forEach(({ enemyId, count }) => {
      const enemyDef = getEnemyById(enemyId);
      if (!enemyDef) return;
      // Ensure enemy has defensive stats assigned
      assignEnemyDefensiveStats(enemyDef);
      
      for (let i = 0; i < count; i++) {
        // Bosses and minibosses deal significantly more damage than regular enemies
        const isBossType = enemyDef.type === 'boss' || enemyDef.type === 'miniboss';
        // Bosses/minibosses deal 0.875x (reduced from 1.75x) - still dangerous but more manageable
        const damageMultiplier = isBossType ? 0.875 : 0.16; // Regular enemies remain at 0.16x
        
        // Apply type-based damage adjustments: +20% for bosses/minibosses, -20% for trash
        const typeDamageModifier = isBossType ? 1.2 : 0.8; // Bosses/minibosses +20%, trash -20%
        
        // Calculate health and damage with map modifiers
        // Minibosses: target ~20k HP at +2 (doubled from 10k)
        // Adjust multiplier for miniboss to get target HP
        const healthMultiplier = (enemyDef.type === 'miniboss') ? 104.16 : 10; // DOUBLED: miniboss multiplier from 52.08
        const finalHealth = enemyDef.baseHealth * scaling.healthMultiplier * healthMod * healthMultiplier;
        // Enemy base damage reduced by 20% (from 2 to 1.6), then apply type modifier
        const finalDamage = enemyDef.baseDamage * scaling.damageMultiplier * damageMultiplier * damageMod * 1.6 * typeDamageModifier;
        
        // Scale defensive stats with key level
        const finalArmor = (enemyDef.baseArmor || 0) * scaling.healthMultiplier;
        const finalEvasion = (enemyDef.baseEvasion || 0) * scaling.healthMultiplier;
        const finalEnergyShield = (enemyDef.baseEnergyShield || 0) * scaling.healthMultiplier;
        
        // Use boss name if this is a gate boss enemy
        const enemyName = (pack.isGateBoss && gateBossName) ? gateBossName : enemyDef.name;
        
        // Minibosses and bosses should always use 'boss' behavior to access boss ability system
        const enemyBehavior = (enemyDef.type === 'miniboss' || enemyDef.type === 'boss') 
          ? 'boss' 
          : getEnemyBehavior(enemyId);
        
        const enemy: AnimatedEnemy = {
          id: `${enemyId}_${pullIdx}_${i}_${Math.random()}`,
          enemyId,
          name: enemyName,
          icon: enemyDef.icon,
          type: enemyDef.type,
          behavior: enemyBehavior,
          health: finalHealth,
          maxHealth: finalHealth,
          damage: finalDamage,
          // Defensive stats
          armor: finalArmor,
          evasion: finalEvasion,
          energyShield: finalEnergyShield,
          maxEnergyShield: finalEnergyShield,
          fireResistance: enemyDef.baseFireResistance || 0,
          coldResistance: enemyDef.baseColdResistance || 0,
          lightningResistance: enemyDef.baseLightningResistance || 0,
          chaosResistance: enemyDef.baseChaosResistance || 0,
          isCasting: false,
          // Tick-based fields - initialize to allow immediate action
          gcdEndTick: 0, // Can act immediately
          aoeCooldownEndTick: 0, // Can use AoE immediately
          autoAttackEndTick: 0, // Can auto-attack immediately
          tankbusterCooldownEndTick: 0, // Can use tankbuster immediately
          castStartTick: undefined,
          castEndTick: undefined,
          castTotalTicks: undefined,
          castTarget: undefined
        };
        pullEnemies.push(enemy);
        packEnemies.push(enemy);
      }
    });
    enemiesByPack.push(packEnemies);
  });
  
  // Store enemiesByPack on the return array for trickle-in logic
  (pullEnemies as any).__byPack = enemiesByPack;
  
  return pullEnemies;
}
