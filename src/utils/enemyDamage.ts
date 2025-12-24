import { calculateArmorReduction, calculateEvasionChance } from '../types/character';
import { calculateElementalResistance, calculateChaosResistance } from '../types/character';
import type { AnimatedEnemy } from '../types/combat';

/**
 * Calculate damage to an enemy, applying armor, evasion, and resistances
 * Similar to how players take damage, but for enemies
 */
export function calculatePlayerDamageToEnemy(
  rawDamage: number,
  damageType: 'physical' | 'fire' | 'cold' | 'lightning' | 'chaos' | 'shadow' | 'holy',
  enemy: AnimatedEnemy,
  playerAccuracy?: number
): {
  damage: number;
  evaded: boolean;
  damageToES: number;
  damageToLife: number;
  esRemaining: number;
  lifeRemaining: number;
} {
  // Check evasion for physical attacks
  let evaded = false;
  if (damageType === 'physical' && enemy.evasion && playerAccuracy) {
    const evasionChance = calculateEvasionChance(enemy.evasion, playerAccuracy);
    if (Math.random() < evasionChance) {
      return {
        damage: 0,
        evaded: true,
        damageToES: 0,
        damageToLife: 0,
        esRemaining: enemy.energyShield || 0,
        lifeRemaining: enemy.health
      };
    }
  }
  
  // Apply armor for physical damage
  let damageAfterArmor = rawDamage;
  if (damageType === 'physical' && enemy.armor) {
    const armorMult = calculateArmorReduction(enemy.armor, rawDamage);
    damageAfterArmor = Math.floor(rawDamage * armorMult);
  }
  
  // Apply resistances for elemental/chaos damage
  let damageAfterResistance = damageAfterArmor;
  if (damageType === 'fire' && enemy.fireResistance !== undefined) {
    const resistance = calculateElementalResistance(enemy.fireResistance);
    damageAfterResistance = Math.floor(damageAfterArmor * (1 - resistance));
  } else if (damageType === 'cold' && enemy.coldResistance !== undefined) {
    const resistance = calculateElementalResistance(enemy.coldResistance);
    damageAfterResistance = Math.floor(damageAfterArmor * (1 - resistance));
  } else if (damageType === 'lightning' && enemy.lightningResistance !== undefined) {
    const resistance = calculateElementalResistance(enemy.lightningResistance);
    damageAfterResistance = Math.floor(damageAfterArmor * (1 - resistance));
  } else if ((damageType === 'chaos' || damageType === 'shadow') && enemy.chaosResistance !== undefined) {
    const resistance = calculateChaosResistance(enemy.chaosResistance);
    damageAfterResistance = Math.floor(damageAfterArmor * (1 - resistance));
  }
  
  const finalDamage = Math.max(0, damageAfterResistance);
  
  // Energy shield absorbs damage first (PoE mechanic)
  const enemyES = enemy.energyShield || 0;
  const enemyMaxES = enemy.maxEnergyShield || 0;
  const damageToES = Math.min(finalDamage, enemyES);
  const damageToLife = Math.max(0, finalDamage - enemyES);
  
  const esRemaining = Math.max(0, enemyES - damageToES);
  const lifeRemaining = Math.max(0, enemy.health - damageToLife);
  
  return {
    damage: finalDamage,
    evaded: false,
    damageToES,
    damageToLife,
    esRemaining,
    lifeRemaining
  };
}

