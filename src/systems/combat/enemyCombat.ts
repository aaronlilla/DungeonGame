import type { AnimatedEnemy, TeamMemberState, FloatingNumber } from '../../types/combat';
import { getEnemyById } from '../../types/dungeon';
import {
  calculateArmorReduction,
  calculateEvasionChance,
  rollBlock,
  rollSpellBlock,
  rollSpellSuppression,
  BLOCK_DAMAGE_REDUCTION,
  SPELL_SUPPRESSION_DAMAGE_REDUCTION,
  calculateDamageWithResistances
} from '../../types/character';
import { createFloatingNumber } from '../../utils/combat';
import { secondsToTicks, ticksToSeconds } from './types';
import type { CombatContext } from './types';
import { processOnBlockEffects, processOnEvadeEffects, processOnLowHealthEffects } from './talentEvents';

/**
 * Calculate effective armor for a specific damage type, considering conditional armor bonuses
 */
function calculateEffectiveArmorForDamageType(
  baseArmor: number,
  talentBonuses: TeamMemberState['talentBonuses'],
  damageType: 'physical' | 'chaos' | 'fire' | 'cold' | 'lightning' | 'shadow' | 'holy' | 'magic',
  isSpellHit: boolean = false
): number {
  let effectiveArmor = baseArmor;
  
  if (!talentBonuses?.specialEffects) return effectiveArmor;
  
  // Check for conditional armor bonuses
  for (const effect of talentBonuses.specialEffects) {
    if (effect.type !== 'armorBonus') continue;
    
    const condition = effect.condition || '';
    
    // Armor applies to chaos damage at X% effectiveness
    if (condition === 'chaos' && damageType === 'chaos') {
      effectiveArmor = Math.floor(effectiveArmor * (effect.value / 100));
    }
    // Armor applies to spell hits at X% effectiveness
    else if (condition === 'spellHits' && isSpellHit) {
      effectiveArmor = Math.floor(effectiveArmor * (effect.value / 100));
    }
  }
  
  // Apply armorEffectivenessVsAttacks (Iron Skirmisher talent)
  if (damageType === 'physical' && !isSpellHit && talentBonuses.armorEffectivenessVsAttacks !== undefined) {
    const effectiveness = talentBonuses.armorEffectivenessVsAttacks;
    if (effectiveness !== 100) {
      effectiveArmor = Math.floor(effectiveArmor * (effectiveness / 100));
    }
  }
  
  return effectiveArmor;
}

/**
 * Calculate evasion-based mitigation (Iron Skirmisher talent)
 * Converts evasion rating to physical damage reduction
 */
function calculateEvasionMitigation(
  evasion: number,
  evasionToMitigationPercent: number,
  incomingDamage: number
): number {
  if (evasionToMitigationPercent <= 0 || evasion <= 0) return 0;
  
  // Convert evasion to a mitigation value
  // Use a similar formula to armor but scaled by the conversion percent
  const effectiveMitigation = Math.floor(evasion * (evasionToMitigationPercent / 100));
  const mitigationReduction = effectiveMitigation / (effectiveMitigation + (25 * incomingDamage));
  
  // Cap at reasonable level
  return Math.min(mitigationReduction, 0.50); // Max 50% from evasion mitigation
}

/**
 * Calculate conditional damage reduction from talent special effects
 * Checks conditions like 'physical', 'elemental', 'chaos', 'hits', etc.
 */
function calculateConditionalDamageReduction(
  talentBonuses: TeamMemberState['talentBonuses'],
  damageType: 'physical' | 'chaos' | 'fire' | 'cold' | 'lightning' | 'shadow' | 'holy' | 'magic',
  isHit: boolean = true,
  isDoT: boolean = false,
  target: TeamMemberState
): number {
  if (!talentBonuses?.specialEffects) return 0;
  
  let totalReduction = 0;
  
  for (const effect of talentBonuses.specialEffects) {
    if (effect.type !== 'damageReduction') continue;
    
    const condition = effect.condition || '';
    
    // Physical damage only
    if (condition === 'physical' && damageType === 'physical') {
      totalReduction += effect.value;
    }
    // Elemental damage (fire, cold, lightning)
    else if (condition === 'elemental' && (damageType === 'fire' || damageType === 'cold' || damageType === 'lightning')) {
      totalReduction += effect.value;
    }
    // Chaos damage only
    else if (condition === 'chaos' && damageType === 'chaos') {
      totalReduction += effect.value;
    }
    // Hits only (not DoTs)
    else if (condition === 'hits' && isHit && !isDoT) {
      totalReduction += effect.value;
    }
    // Physical attacks only (hits that are physical)
    else if (condition === 'physicalAttacks' && isHit && damageType === 'physical') {
      totalReduction += effect.value;
    }
    // DoT damage only
    else if (condition === 'dot' && isDoT) {
      totalReduction += effect.value;
    }
    // Attack damage reduction (all attacks, not spells)
    else if (condition === 'attacks' && isHit && damageType === 'physical') {
      totalReduction += effect.value;
    }
    // Has Energy Shield
    else if (condition === 'hasES' && (target.energyShield || 0) > 0) {
      totalReduction += effect.value;
    }
    // Has Block Chance
    else if (condition === 'hasBlock' && (target.blockChance || 0) > 0) {
      totalReduction += effect.value;
    }
    // Elemental to Physical conversion (special case - handled separately)
    else if (condition === 'elementalToPhysical') {
      // This is handled as a conversion, not reduction
      // Would need special handling
    }
  }
  
  // Also check for non-conditional reductions from TalentBonuses
  // Elemental damage reduction (applies to all elemental)
  if ((damageType === 'fire' || damageType === 'cold' || damageType === 'lightning') && talentBonuses?.elementalDamageReduction) {
    totalReduction += talentBonuses.elementalDamageReduction;
  }
  
  // Attack damage reduction (applies to all physical attacks)
  if (isHit && damageType === 'physical' && talentBonuses?.attackDamageReduction) {
    totalReduction += talentBonuses.attackDamageReduction;
  }
  
  return totalReduction;
}
import {
  getBossAbilities,
  selectBossAbility,
  executeBossAbility,
  initBossAbilityState,
  processDebuffDamage,
  isAbilityReady
} from './bossAbilities';
import { createVerboseDamageLog } from './verboseLogging';

/**
 * Apply enemySpeed modifier to cooldown duration
 * enemySpeed of 0.10 means 10% faster = cooldowns are 10% shorter
 */
function applyEnemySpeedToCooldown(baseCooldownSeconds: number, enemySpeed: number): number {
  if (enemySpeed <= 0) return baseCooldownSeconds;
  // Faster enemies = shorter cooldowns
  // 10% faster = cooldown is 90.9% of original (1 / 1.10)
  return baseCooldownSeconds / (1 + enemySpeed);
}

/**
 * Apply talent-based enemy attack speed reduction to cooldown
 * This makes enemies attack slower when targeting a player with the talent
 */
function applyTalentAttackSpeedReduction(
  baseCooldownSeconds: number,
  target: TeamMemberState
): number {
  const attackSpeedReduction = target.talentBonuses?.enemyAttackSpeedReduction || 0;
  if (attackSpeedReduction <= 0) return baseCooldownSeconds;
  // 10% slower = cooldown is 11.1% longer (1 / 0.90)
  return baseCooldownSeconds / (1 - attackSpeedReduction / 100);
}

/**
 * Track damage taken by a team member for statistics
 */
function trackDamageTaken(
  target: TeamMemberState,
  damage: number,
  sourceName: string,
  abilityName: string,
  currentTick?: number,
  resetESRecharge: boolean = true
): void {
  // Initialize tracking fields if needed
  if (!target.damageTaken) target.damageTaken = 0;
  if (!target.damageTakenBySource) target.damageTakenBySource = {};
  if (!target.damageTakenByAbility) target.damageTakenByAbility = {};
  
  // Track total damage taken
  target.damageTaken += damage;
  
  // Track by source (enemy name)
  target.damageTakenBySource[sourceName] = (target.damageTakenBySource[sourceName] || 0) + damage;
  
  // Track by ability name
  target.damageTakenByAbility[abilityName] = (target.damageTakenByAbility[abilityName] || 0) + damage;
  
  // Also update recent damage for UI
  target.recentDamageTaken = (target.recentDamageTaken || 0) + damage;
  
  // Update ES recharge delay timer (only if not blocked/evaded)
  // Evading or blocking doesn't count as getting hit for ES recharge purposes
  if (currentTick !== undefined && damage > 0 && resetESRecharge) {
    target.lastDamageTakenTick = currentTick;
  }
}

/**
 * Process all enemy actions for one tick
 * 
 * Enemies use abilities based on cooldowns and cast times only (no GCD)
 * 
 * Target Reservation:
 * - Casters cannot target someone who is already being cast on by another enemy
 * - If two casts start at the same tick, they must target different players
 */
export function processEnemyAttacks(
  context: CombatContext,
  aliveEnemies: AnimatedEnemy[],
  teamStates: TeamMemberState[],
  currentEnemies: AnimatedEnemy[],
  currentTick: number
): void {
  const { stunActive } = context;
  
  if (stunActive) {
    console.log(`[EnemyCombat] Skipping enemy attacks - stunActive is true`);
    return;
  }
  
  if (aliveEnemies.length === 0) {
    console.log(`[EnemyCombat] No alive enemies to process`);
    return;
  }
  
  console.log(`[EnemyCombat] Processing ${aliveEnemies.length} enemy attacks at tick ${currentTick}`);
  
  // Filter out dead members AND members with resurrection immunity
  const tank = teamStates.find(m => m.role === 'tank' && !m.isDead && !m.resurrectionImmunity);
  const aliveMembers = teamStates.filter(m => !m.isDead && !m.resurrectionImmunity);
  
  if (aliveMembers.length === 0) {
    console.log(`[EnemyCombat] No alive/targetable team members to attack`);
    return;
  }
  
  // Build set of targets currently being cast on by ANY enemy (including ones not ready to act)
  // This prevents new casts from targeting someone already being targeted
  const reservedTargets = new Set<string>();
  for (const enemy of currentEnemies) {
    if (enemy.isCasting && enemy.castTarget) {
      reservedTargets.add(enemy.castTarget);
    }
  }
  
  let enemiesProcessed = 0;
  let enemiesActed = 0;
  
  for (const enemy of aliveEnemies) {
    enemiesProcessed++;
    
    // Initialize tick-based tracking if not set
    if (enemy.autoAttackEndTick === undefined) enemy.autoAttackEndTick = 0; // Can attack immediately
    if (enemy.aoeCooldownEndTick === undefined) enemy.aoeCooldownEndTick = 0;
    if (enemy.tankbusterCooldownEndTick === undefined) enemy.tankbusterCooldownEndTick = 0;
    if (enemy.isCasting === undefined) enemy.isCasting = false;
    
    // Check if cast is complete (bosses handle their own cast completion in processBossAttack)
    if (enemy.behavior !== 'boss' && enemy.isCasting && enemy.castEndTick && currentTick >= enemy.castEndTick) {
      processEnemyCastComplete(context, enemy, teamStates, context.totalTime, currentTick);
      enemy.isCasting = false;
      enemy.castStartTick = undefined;
      enemy.castEndTick = undefined;
      enemy.castTotalTicks = undefined;
      // Remove from reserved targets when cast completes
      if (enemy.castTarget) {
        reservedTargets.delete(enemy.castTarget);
      }
      enemy.castTarget = undefined;
      enemy.castStartTime = undefined;
      enemy.castTotalTime = undefined;
    }
    
    // Bosses need to process even while casting (to check for cast completion)
    // Other enemies skip if still casting
    if (enemy.behavior !== 'boss' && enemy.isCasting) {
      if (currentTick % 10 === 0) {
        console.log(`[EnemyCombat] ${enemy.name} is casting, waiting for cast to complete`);
      }
      continue;
    }
    
    // Behavior-specific attacks
    enemiesActed++;
    if (currentTick % 10 === 0) {
      console.log(`[EnemyCombat] ${enemy.name} (${enemy.behavior}) acting at tick ${currentTick}`);
    }
    
    if (enemy.behavior === 'melee') {
      processMeleeAttack(context, enemy, teamStates, tank, aliveMembers, currentTick);
    } else if (enemy.behavior === 'tankbuster') {
      processTankbusterAttack(context, enemy, teamStates, tank, aliveMembers, currentTick, reservedTargets);
    } else if (enemy.behavior === 'caster') {
      processCasterAttack(context, enemy, teamStates, aliveMembers, currentTick, reservedTargets);
    } else if (enemy.behavior === 'archer') {
      processArcherAttack(context, enemy, teamStates, aliveMembers, currentTick);
    } else if (enemy.behavior === 'aoe') {
      processAoeAttack(context, enemy, teamStates, tank, aliveMembers, currentTick);
    } else if (enemy.behavior === 'boss') {
      processBossAttack(context, enemy, teamStates, tank, aliveMembers, currentTick, reservedTargets);
    } else {
      console.warn(`[EnemyCombat] Unknown behavior "${enemy.behavior}" for enemy ${enemy.name}`);
    }
  }
  
  if (currentTick % 10 === 0) {
    console.log(`[EnemyCombat] Processed ${enemiesProcessed} enemies, ${enemiesActed} acted`);
  }
}

/**
 * Check if enemy can start a new action
 */
function canEnemyAct(enemy: AnimatedEnemy, _currentTick: number): boolean {
  if (enemy.isCasting) return false;
  return true;
}

/**
 * Start an enemy cast
 */
function startEnemyCast(enemy: AnimatedEnemy, castTimeTicks: number, currentTick: number, targetId: string, abilityName: string): void {
  enemy.isCasting = true;
  enemy.castStartTick = currentTick;
  enemy.castEndTick = currentTick + castTimeTicks;
  enemy.castTotalTicks = castTimeTicks;
  enemy.castTarget = targetId;
  enemy.lastCastTarget = targetId;
  enemy.castAbility = abilityName;
  
  // Set real-time values for smooth UI animation
  enemy.castStartTime = Date.now();
  enemy.castTotalTime = ticksToSeconds(castTimeTicks);
}

function processEnemyCastComplete(
  context: CombatContext,
  enemy: AnimatedEnemy,
  teamStates: TeamMemberState[],
  _totalTime: number,
  _currentTick: number
): void {
  const { scaling, shieldActive, updateCombatState, currentCombatState, setTeamFightAnim, setEnemyFightAnims, batchedFloatingNumbers, batchedLogEntries } = context;
  const target = teamStates.find(m => m.id === enemy.castTarget);
  if (!target || target.isDead) return;
  
  // Capture state before damage
  const healthBefore = target.health;
  const esBefore = target.energyShield || 0;
  
  const baseArmor = target.armor * (1 + (target.armorBuff || 0) / 100);
  // Apply general talent damage reduction (no conditions)
  const generalTalentDR = target.talentBonuses?.damageReduction || 0;
  const isAuto = enemy.castAbility === 'Auto Attack';
  
  const enemyDef = getEnemyById(enemy.enemyId);
  const tankbusterAbility = enemyDef?.abilities?.find(a => a.name === enemy.castAbility);
  const isTankbuster = !!tankbusterAbility;
  
  let dmg = 0;
  let blocked = false;
  let damageType: 'physical' | 'chaos' | 'fire' | 'cold' | 'lightning' | 'shadow' | 'holy' | 'magic' = 'physical';
  let damageBlocked = 0;
  
    if (isTankbuster && tankbusterAbility) {
    const baseAbilityDamage = tankbusterAbility.damage || 300;
    const scaledAbilityDamage = baseAbilityDamage * scaling.damageMultiplier * 0.45; // Tankbuster - tuned so tank survives but just barely
    const rawDamage = scaledAbilityDamage * (shieldActive ? 0.5 : 1);
    damageType = (tankbusterAbility.damageType || 'physical') as 'physical' | 'fire' | 'cold' | 'lightning' | 'chaos' | 'shadow' | 'holy' | 'magic';
    
    if (damageType === 'physical') {
      // Calculate conditional damage reduction for physical damage
      const conditionalDR = calculateConditionalDamageReduction(target.talentBonuses, 'physical', true, false, target);
      const totalDR = generalTalentDR + conditionalDR;
      const painSuppMult = totalDR > 0 ? (1 - totalDR / 100) : 1;
      
      // Calculate effective armor considering conditional bonuses and effectiveness
      const effectiveArmorForDamage = calculateEffectiveArmorForDamageType(
        baseArmor,
        target.talentBonuses,
        'physical',
        false
      );
      
      // Apply evasion-to-mitigation if applicable
      const evasionMitigation = target.evasion && target.talentBonuses?.evasionToMitigationPercent
        ? calculateEvasionMitigation(target.evasion, target.talentBonuses.evasionToMitigationPercent, rawDamage)
        : 0;
      
      const armorMult = calculateArmorReduction(effectiveArmorForDamage, rawDamage);
      // Apply evasion mitigation as additional reduction
      const totalMitigation = armorMult * (1 - evasionMitigation);
      let damageAfterArmor = Math.floor(rawDamage * totalMitigation * painSuppMult);
      const blockChance = (target.blockChance || 0) + (target.blockBuff || 0);
      blocked = rollBlock(blockChance);
      if (blocked) {
        // Apply base block reduction + talent block effectiveness
        const baseBlockReduction = BLOCK_DAMAGE_REDUCTION;
        const blockEffectiveness = target.talentBonuses?.blockEffectiveness || 0;
        const totalBlockReduction = Math.min(0.9, baseBlockReduction + (blockEffectiveness / 100));
        damageBlocked = damageAfterArmor * totalBlockReduction;
        damageAfterArmor = Math.floor(damageAfterArmor * (1 - totalBlockReduction));
        target.lastBlockTime = Date.now();
        
        // Process onBlock effects
        processOnBlockEffects(target, damageBlocked, _currentTick, teamStates);
      } else {
        // Apply nonBlockedDamageReduction (Duel Warden talent)
        const nonBlockedDR = target.talentBonuses?.nonBlockedDamageReduction || 0;
        if (nonBlockedDR > 0) {
          damageAfterArmor = Math.floor(damageAfterArmor * (1 - nonBlockedDR / 100));
        }
      }
      const damageResult = calculateDamageWithResistances(
        damageAfterArmor, 'physical',
        { health: target.health, maxHealth: target.maxHealth, energyShield: target.energyShield || 0, maxEnergyShield: target.maxEnergyShield || 0, fireResistance: target.fireResistance || 0, coldResistance: target.coldResistance || 0, lightningResistance: target.lightningResistance || 0, chaosResistance: target.chaosResistance || 0 }
      );
      // Safety checks to prevent NaN
      const safeESRemaining = isNaN(damageResult.esRemaining) || !isFinite(damageResult.esRemaining) ? (target.energyShield || 0) : Math.max(0, damageResult.esRemaining);
      const safeLifeRemaining = isNaN(damageResult.lifeRemaining) || !isFinite(damageResult.lifeRemaining) ? (target.maxHealth || 0) : Math.max(0, damageResult.lifeRemaining);
      target.energyShield = safeESRemaining;
      target.health = safeLifeRemaining;
      dmg = isNaN(damageResult.totalDamage) || !isFinite(damageResult.totalDamage) ? 0 : damageResult.totalDamage;
    } else {
      // Calculate conditional damage reduction for spell damage
      const conditionalDR = calculateConditionalDamageReduction(target.talentBonuses, damageType, true, false, target);
      const totalDR = generalTalentDR + conditionalDR;
      const painSuppMult = totalDR > 0 ? (1 - totalDR / 100) : 1;
      
      // For chaos damage, check if armor applies
      let spellDamage = rawDamage;
      if (damageType === 'chaos') {
        const effectiveArmorForChaos = calculateEffectiveArmorForDamageType(
          baseArmor,
          target.talentBonuses,
          'chaos',
          true
        );
        if (effectiveArmorForChaos > 0) {
          const armorMult = calculateArmorReduction(effectiveArmorForChaos, rawDamage);
          spellDamage = Math.floor(rawDamage * armorMult);
        }
      }
      
      // For spell hits, check if armor applies
      if (damageType !== 'chaos') {
        const effectiveArmorForSpells = calculateEffectiveArmorForDamageType(
          baseArmor,
          target.talentBonuses,
          damageType,
          true
        );
        if (effectiveArmorForSpells > 0) {
          const armorMult = calculateArmorReduction(effectiveArmorForSpells, rawDamage);
          spellDamage = Math.floor(rawDamage * armorMult);
        }
      }
      
      spellDamage = Math.floor(spellDamage * painSuppMult);
      const spellBlockChance = (target.spellBlockChance || 0) + (target.blockBuff || 0);
      const spellBlocked = rollSpellBlock(spellBlockChance);
      // Apply talent spell suppression chance
      const baseSuppression = target.spellSuppressionChance || 0;
      const talentSuppression = target.talentBonuses?.spellSuppressionChance || 0;
      const totalSuppression = Math.min(100, baseSuppression + talentSuppression);
      const spellSuppressed = totalSuppression > 0 ? rollSpellSuppression(totalSuppression) : false;
      if (spellBlocked) {
        // Apply base block reduction + talent block effectiveness
        const baseBlockReduction = BLOCK_DAMAGE_REDUCTION;
        const blockEffectiveness = target.talentBonuses?.blockEffectiveness || 0;
        const totalBlockReduction = Math.min(0.9, baseBlockReduction + (blockEffectiveness / 100));
        spellDamage = Math.floor(spellDamage * (1 - totalBlockReduction));
        target.lastBlockTime = Date.now();
        blocked = true;
      } else if (spellSuppressed) {
        // Apply base suppression reduction + talent suppression effectiveness
        const baseSuppressionReduction = SPELL_SUPPRESSION_DAMAGE_REDUCTION;
        const suppressionEffect = target.talentBonuses?.spellSuppressionEffect || 0;
        const totalSuppressionReduction = Math.min(0.9, baseSuppressionReduction + (suppressionEffect / 100));
        spellDamage = Math.floor(spellDamage * (1 - totalSuppressionReduction));
      }
      const damageResult = calculateDamageWithResistances(
        spellDamage, damageType,
        { health: target.health, maxHealth: target.maxHealth, energyShield: target.energyShield || 0, maxEnergyShield: target.maxEnergyShield || 0, fireResistance: target.fireResistance || 0, coldResistance: target.coldResistance || 0, lightningResistance: target.lightningResistance || 0, chaosResistance: target.chaosResistance || 0 }
      );
      // Safety checks to prevent NaN
      const safeESRemaining = isNaN(damageResult.esRemaining) || !isFinite(damageResult.esRemaining) ? (target.energyShield || 0) : Math.max(0, damageResult.esRemaining);
      const safeLifeRemaining = isNaN(damageResult.lifeRemaining) || !isFinite(damageResult.lifeRemaining) ? (target.maxHealth || 0) : Math.max(0, damageResult.lifeRemaining);
      target.energyShield = safeESRemaining;
      target.health = safeLifeRemaining;
      dmg = damageResult.totalDamage;
    }
    } else if (isAuto) {
    const rawDamage = enemy.damage * (shieldActive ? 0.5 : 1);
    // Calculate enemy accuracy with talent reductions
    let enemyAccuracy = enemy.damage * 100; // Base accuracy estimate from damage
    const enemyAccuracyReduction = target.talentBonuses?.enemyAccuracyReduction || 0;
    if (enemyAccuracyReduction > 0) {
      enemyAccuracy = Math.floor(enemyAccuracy * (1 - enemyAccuracyReduction / 100));
    }
    
    let evasionChance = target.evasion ? calculateEvasionChance(target.evasion, enemyAccuracy) : 0;
    // Apply flat evade chance from talents (direct % bonus)
    const flatEvadeChance = target.talentBonuses?.evadeChance || 0;
    evasionChance = Math.min(0.95, evasionChance + (flatEvadeChance / 100));
    if (Math.random() < evasionChance) {
      dmg = 0;
      if (batchedLogEntries) {
        batchedLogEntries.push({ timestamp: _totalTime, type: 'ability', source: enemy.name, target: target.name, message: `💨 ${target.name} evades ${enemy.name}'s attack!` });
      } else {
        updateCombatState(prev => ({ ...prev, combatLog: [...prev.combatLog, { timestamp: _totalTime, type: 'ability', source: enemy.name, target: target.name, message: `💨 ${target.name} evades ${enemy.name}'s attack!` }] }));
      }
      
      // Process onEvade effects
      processOnEvadeEffects(target, enemy.name, _currentTick, teamStates);
    } else {
      // Calculate conditional damage reduction for physical auto attacks
      const conditionalDR = calculateConditionalDamageReduction(target.talentBonuses, 'physical', true, false, target);
      const totalDR = generalTalentDR + conditionalDR;
      const painSuppMult = totalDR > 0 ? (1 - totalDR / 100) : 1;
      
      // Calculate effective armor considering conditional bonuses and effectiveness
      const effectiveArmorForDamage = calculateEffectiveArmorForDamageType(
        baseArmor,
        target.talentBonuses,
        'physical',
        false
      );
      
      // Apply evasion-to-mitigation if applicable
      const evasionMitigation = target.evasion && target.talentBonuses?.evasionToMitigationPercent
        ? calculateEvasionMitigation(target.evasion, target.talentBonuses.evasionToMitigationPercent, rawDamage)
        : 0;
      
      const armorMult = calculateArmorReduction(effectiveArmorForDamage, rawDamage);
      // Apply evasion mitigation as additional reduction
      const totalMitigation = armorMult * (1 - evasionMitigation);
      let damageAfterArmor = Math.floor(rawDamage * totalMitigation * painSuppMult);
      const blockChance = (target.blockChance || 0) + (target.blockBuff || 0);
      blocked = rollBlock(blockChance);
      if (blocked) {
        // Apply base block reduction + talent block effectiveness
        const baseBlockReduction = BLOCK_DAMAGE_REDUCTION;
        const blockEffectiveness = target.talentBonuses?.blockEffectiveness || 0;
        const totalBlockReduction = Math.min(0.9, baseBlockReduction + (blockEffectiveness / 100));
        const blockedDamage = damageAfterArmor * totalBlockReduction;
        damageAfterArmor = Math.floor(damageAfterArmor * (1 - totalBlockReduction));
        target.lastBlockTime = Date.now();
        
        // Process onBlock effects
        processOnBlockEffects(target, blockedDamage, _currentTick, teamStates);
      } else {
        // Apply nonBlockedDamageReduction (Duel Warden talent)
        const nonBlockedDR = target.talentBonuses?.nonBlockedDamageReduction || 0;
        if (nonBlockedDR > 0) {
          damageAfterArmor = Math.floor(damageAfterArmor * (1 - nonBlockedDR / 100));
        }
      }
      const damageResult = calculateDamageWithResistances(
        damageAfterArmor, 'physical',
        { health: target.health, maxHealth: target.maxHealth, energyShield: target.energyShield || 0, maxEnergyShield: target.maxEnergyShield || 0, fireResistance: target.fireResistance || 0, coldResistance: target.coldResistance || 0, lightningResistance: target.lightningResistance || 0, chaosResistance: target.chaosResistance || 0 }
      );
      // Safety checks to prevent NaN
      const safeESRemaining = isNaN(damageResult.esRemaining) || !isFinite(damageResult.esRemaining) ? (target.energyShield || 0) : Math.max(0, damageResult.esRemaining);
      const safeLifeRemaining = isNaN(damageResult.lifeRemaining) || !isFinite(damageResult.lifeRemaining) ? (target.maxHealth || 0) : Math.max(0, damageResult.lifeRemaining);
      target.energyShield = safeESRemaining;
      target.health = safeLifeRemaining;
      dmg = isNaN(damageResult.totalDamage) || !isFinite(damageResult.totalDamage) ? 0 : damageResult.totalDamage;
    }
  } else {
    // Spell damage
    const enemyDef = getEnemyById(enemy.enemyId);
    const ability = enemyDef?.abilities?.find(a => a.name === enemy.castAbility);
    const abilityDamage = ability?.damage;
    damageType = (ability?.damageType || 'shadow') as 'physical' | 'fire' | 'cold' | 'lightning' | 'chaos' | 'shadow' | 'holy' | 'magic';
    // Calculate initial raw spell damage (before reductions)
    // Increased fallback multiplier from 0.12 to 0.2 to prevent zero damage from rounding
    // Abilities with defined damage use 0.3 multiplier (30% of ability damage)
    // Fallback uses 20% of enemy damage (increased from 12% to ensure meaningful damage)
    const initialRawSpellDamage = abilityDamage !== undefined 
      ? abilityDamage * scaling.damageMultiplier * 0.3 
      : enemy.damage * 0.2;
    let rawSpellDamage = initialRawSpellDamage * (shieldActive ? 0.5 : 1);
    
    // Check for elemental to physical conversion (Wardbreaker talent)
    let convertedToPhysical = 0;
    if ((damageType === 'fire' || damageType === 'cold' || damageType === 'lightning') && target.talentBonuses?.specialEffects) {
      for (const effect of target.talentBonuses.specialEffects) {
        if (effect.type === 'damageReduction' && effect.condition === 'elementalToPhysical') {
          convertedToPhysical = Math.floor(rawSpellDamage * (effect.value / 100));
          rawSpellDamage = rawSpellDamage - convertedToPhysical;
          break;
        }
      }
    }
    
    // Calculate conditional damage reduction for spell damage
    const conditionalDR = calculateConditionalDamageReduction(target.talentBonuses, damageType, true, false, target);
    const totalDR = generalTalentDR + conditionalDR;
    const painSuppMult = totalDR > 0 ? (1 - totalDR / 100) : 1;
    
    // For chaos damage, check if armor applies
    if (damageType === 'chaos') {
      const effectiveArmorForChaos = calculateEffectiveArmorForDamageType(
        baseArmor,
        target.talentBonuses,
        'chaos',
        true
      );
      if (effectiveArmorForChaos > 0) {
        const armorMult = calculateArmorReduction(effectiveArmorForChaos, rawSpellDamage);
        rawSpellDamage = Math.floor(rawSpellDamage * armorMult);
      }
    }
    
    // For spell hits, check if armor applies
    if (damageType !== 'chaos' && (damageType === 'fire' || damageType === 'cold' || damageType === 'lightning')) {
      const effectiveArmorForSpells = calculateEffectiveArmorForDamageType(
        baseArmor,
        target.talentBonuses,
        damageType,
        true
      );
      if (effectiveArmorForSpells > 0) {
        const armorMult = calculateArmorReduction(effectiveArmorForSpells, rawSpellDamage);
        rawSpellDamage = Math.floor(rawSpellDamage * armorMult);
      }
    }
    
    // Apply damage reduction
    rawSpellDamage = Math.floor(rawSpellDamage * painSuppMult);
    
    // Handle converted physical damage
    if (convertedToPhysical > 0) {
      const effectiveArmorForPhysical = calculateEffectiveArmorForDamageType(
        baseArmor,
        target.talentBonuses,
        'physical',
        false
      );
      const armorMult = calculateArmorReduction(effectiveArmorForPhysical, convertedToPhysical);
      const conditionalDRPhysical = calculateConditionalDamageReduction(target.talentBonuses, 'physical', true, false, target);
      const totalDRPhysical = generalTalentDR + conditionalDRPhysical;
      const painSuppMultPhysical = totalDRPhysical > 0 ? (1 - totalDRPhysical / 100) : 1;
      convertedToPhysical = Math.floor(convertedToPhysical * armorMult * painSuppMultPhysical);
    }
    
    const spellBlockChance = (target.spellBlockChance || 0) + (target.blockBuff || 0);
    const spellBlocked = rollSpellBlock(spellBlockChance);
    const spellSuppressed = target.spellSuppressionChance ? rollSpellSuppression(target.spellSuppressionChance) : false;
    if (spellBlocked) {
      // Apply base block reduction + talent block effectiveness
      const baseBlockReduction = BLOCK_DAMAGE_REDUCTION;
      const blockEffectiveness = target.talentBonuses?.blockEffectiveness || 0;
      const totalBlockReduction = Math.min(0.9, baseBlockReduction + (blockEffectiveness / 100));
      damageBlocked = rawSpellDamage * totalBlockReduction;
      rawSpellDamage = Math.floor(rawSpellDamage * (1 - totalBlockReduction));
      target.lastBlockTime = Date.now();
      blocked = true;
    } else if (spellSuppressed) {
      // Apply base suppression reduction + talent suppression effectiveness
      const baseSuppressionReduction = SPELL_SUPPRESSION_DAMAGE_REDUCTION;
      const suppressionEffect = target.talentBonuses?.spellSuppressionEffect || 0;
      const totalSuppressionReduction = Math.min(0.9, baseSuppressionReduction + (suppressionEffect / 100));
      rawSpellDamage = Math.floor(rawSpellDamage * (1 - totalSuppressionReduction));
    }
    
    // Calculate damage - if there's converted physical, handle both types
    let finalDamageToES = 0;
    let finalDamageToLife = 0;
    if (convertedToPhysical > 0) {
      // Apply physical damage separately
      const physicalDamageResult = calculateDamageWithResistances(
        convertedToPhysical, 'physical',
        { health: target.health, maxHealth: target.maxHealth, energyShield: target.energyShield || 0, maxEnergyShield: target.maxEnergyShield || 0, fireResistance: target.fireResistance || 0, coldResistance: target.coldResistance || 0, lightningResistance: target.lightningResistance || 0, chaosResistance: target.chaosResistance || 0 }
      );
      const spellDamageResult = calculateDamageWithResistances(
        rawSpellDamage, damageType,
        { health: target.health, maxHealth: target.maxHealth, energyShield: target.energyShield || 0, maxEnergyShield: target.maxEnergyShield || 0, fireResistance: target.fireResistance || 0, coldResistance: target.coldResistance || 0, lightningResistance: target.lightningResistance || 0, chaosResistance: target.chaosResistance || 0 }
      );
      // Combine both damage types
      finalDamageToES = Math.floor(physicalDamageResult.damageToES + spellDamageResult.damageToES);
      finalDamageToLife = Math.floor(physicalDamageResult.damageToLife + spellDamageResult.damageToLife);
    } else {
      const damageResult = calculateDamageWithResistances(
        rawSpellDamage, damageType,
        { health: target.health, maxHealth: target.maxHealth, energyShield: target.energyShield || 0, maxEnergyShield: target.maxEnergyShield || 0, fireResistance: target.fireResistance || 0, coldResistance: target.coldResistance || 0, lightningResistance: target.lightningResistance || 0, chaosResistance: target.chaosResistance || 0 }
      );
      finalDamageToES = damageResult.damageToES;
      finalDamageToLife = damageResult.damageToLife;
    }
    // Safety checks to prevent NaN
    const safeFinalDamageToES = isNaN(finalDamageToES) || !isFinite(finalDamageToES) ? 0 : Math.max(0, finalDamageToES);
    const safeFinalDamageToLife = isNaN(finalDamageToLife) || !isFinite(finalDamageToLife) ? 0 : Math.max(0, finalDamageToLife);
    const safeCurrentHealth = isNaN(target.health) || !isFinite(target.health) ? (target.maxHealth || 0) : target.health;
    const safeCurrentES = (target.energyShield === undefined || isNaN(target.energyShield) || !isFinite(target.energyShield)) ? 0 : target.energyShield;
    target.energyShield = Math.max(0, safeCurrentES - safeFinalDamageToES);
    target.health = Math.max(0, safeCurrentHealth - safeFinalDamageToLife);
    dmg = safeFinalDamageToES + safeFinalDamageToLife;
    
    // Minimum damage guarantee: if an ability was cast with meaningful base damage, it should deal at least 1 damage
    // (unless fully blocked/suppressed, which is handled separately)
    // This prevents zero damage from rounding errors with very low base damage
    // Only apply if we had initial damage > 0.5 (meaningful damage that got reduced to 0)
    if (dmg === 0 && initialRawSpellDamage > 0.5 && !spellBlocked && !spellSuppressed) {
      // Only apply minimum damage if we had some initial raw damage but it got reduced to 0
      // This means the ability should have done something, but rounding eliminated it
      const minDamage = 1;
      // Apply minimum damage to ES first, then life
      if (target.energyShield > 0) {
        const minDamageToES = Math.min(minDamage, target.energyShield);
        target.energyShield = Math.max(0, target.energyShield - minDamageToES);
        dmg = minDamageToES;
      } else {
        target.health = Math.max(0, target.health - minDamage);
        dmg = minDamage;
      }
    }
    
    // Process onLowHealth effects if health dropped below threshold
    if (target.maxHealth > 0 && target.health / target.maxHealth < 0.5) {
      processOnLowHealthEffects(target, _currentTick, teamStates);
    }
  }
  
  // Apply thorns damage
  const thornsPercent = target.talentBonuses?.thorns || 0;
  if (thornsPercent > 0 && dmg > 0) {
    const thornsDamage = Math.floor(dmg * (thornsPercent / 100));
    if (thornsDamage > 0) {
      enemy.health = Math.max(0, enemy.health - thornsDamage);
      const jitterX = (Math.random() * 80) - 40;
      const jitterY = (Math.random() * 60) - 30;
      const thornsFloatNum = createFloatingNumber(thornsDamage, 'player', currentCombatState.teamPosition.x + jitterX, currentCombatState.teamPosition.y - 40 + jitterY);
      if (batchedFloatingNumbers && batchedLogEntries) {
        batchedFloatingNumbers.push(thornsFloatNum);
        batchedLogEntries.push({ 
          timestamp: _totalTime, 
          type: 'damage', 
          source: target.name, 
          target: enemy.name, 
          value: thornsDamage, 
          ability: 'Thorns', 
          message: `🌵 ${target.name}'s Thorns reflects ${thornsDamage} damage to ${enemy.name}!` 
        });
      } else {
        updateCombatState(prev => ({ 
          ...prev, 
          floatingNumbers: [...prev.floatingNumbers.slice(-20), thornsFloatNum],
          combatLog: [...prev.combatLog, { 
            timestamp: _totalTime, 
            type: 'damage', 
            source: target.name, 
            target: enemy.name, 
            value: thornsDamage, 
            ability: 'Thorns', 
            message: `🌵 ${target.name}'s Thorns reflects ${thornsDamage} damage to ${enemy.name}!` 
          }] 
        }));
      }
    }
  }
  
  // Capture state after damage
  const healthAfter = target.health;
  const esAfter = target.energyShield || 0;
  
  trackDamageTaken(target, dmg, enemy.name, enemy.castAbility || 'Auto Attack', _currentTick, !blocked);
  
  // Create verbose log entry with full stats (always log, even if 0 damage for debugging)
  // For zero damage, add debug info to help diagnose the issue
  const logData: Parameters<typeof createVerboseDamageLog>[5] = {
    healthBefore,
    healthAfter,
    esBefore,
    esAfter,
    maxHealth: target.maxHealth,
    maxES: target.maxEnergyShield || 0,
    damageBlocked: damageBlocked > 0 ? damageBlocked : undefined,
    abilityName: enemy.castAbility || 'Auto Attack',
    damageType
  };
  
  // Add debug info for zero damage spells to help diagnose
  if (dmg === 0 && enemy.castAbility && !blocked) {
    // Calculate what the initial damage would have been for debugging
    const enemyDef = getEnemyById(enemy.enemyId);
    const ability = enemyDef?.abilities?.find(a => a.name === enemy.castAbility);
    const abilityDamage = ability?.damage;
    const initialRawSpellDamage = abilityDamage !== undefined 
      ? abilityDamage * scaling.damageMultiplier * 0.3 
      : enemy.damage * 0.12;
    logData.damageReduced = initialRawSpellDamage; // Show initial damage that got reduced to 0
  }
  
  const verboseLog = createVerboseDamageLog(
    _totalTime,
    enemy.name,
    target.name,
    dmg,
    target,
    logData,
    enemy, // sourceState
    teamStates, // allTeamStates
    context.currentCombatState?.enemies || [] // allEnemies
  );
  
  // Only create floating number and animations if damage > 0
  if (dmg > 0) {
    setTeamFightAnim(prev => prev + 1);
    setEnemyFightAnims(prev => ({ ...prev, [enemy.id]: (prev[enemy.id] || 0) + 1 }));
    const jitterX = (Math.random() * 80) - 40;
    const jitterY = (Math.random() * 60) - 30;
    const floatNum = createFloatingNumber(dmg, blocked ? 'blocked' : 'enemy', currentCombatState.teamPosition.x + jitterX, currentCombatState.teamPosition.y - 40 + jitterY);
    
    if (batchedFloatingNumbers && batchedLogEntries) {
      batchedFloatingNumbers.push(floatNum);
      batchedLogEntries.push(verboseLog);
    } else {
      updateCombatState(prev => ({ 
        ...prev, 
        floatingNumbers: [...prev.floatingNumbers.slice(-20), floatNum], 
        combatLog: [...prev.combatLog, verboseLog] 
      }));
    }
  } else {
    // Still log zero damage for debugging, but don't show floating number
    if (batchedLogEntries) {
      batchedLogEntries.push(verboseLog);
    } else {
      updateCombatState(prev => ({ 
        ...prev, 
        combatLog: [...prev.combatLog, verboseLog] 
      }));
    }
  }
  if (target.health <= 0 && !target.isDead) {
    target.isDead = true;
    if (batchedLogEntries) {
      batchedLogEntries.push({ timestamp: _totalTime, type: 'death', source: '', target: target.name, message: `💀 ${target.name} has died!` });
    } else {
      updateCombatState(prev => ({ ...prev, combatLog: [...prev.combatLog, { timestamp: _totalTime, type: 'death', source: '', target: target.name, message: `💀 ${target.name} has died!` }] }));
    }
  }
}

/**
 * Helper function to perform a melee attack on a target
 * Returns true if attack was performed, false otherwise
 */
function performMeleeAttackOnTarget(
  context: CombatContext,
  enemy: AnimatedEnemy,
  target: TeamMemberState,
  _currentTick: number,
  damageMultiplier: number = 1.0
): boolean {
  const { shieldActive, currentCombatState, batchedFloatingNumbers, batchedLogEntries, totalTime, updateCombatState, setTeamFightAnim, setEnemyFightAnims } = context;
  
  const baseArmor = target.armor * (1 + (target.armorBuff || 0) / 100);
  // Calculate conditional damage reduction for physical melee attacks
  const generalTalentDR = target.talentBonuses?.damageReduction || 0;
  const conditionalDR = calculateConditionalDamageReduction(target.talentBonuses, 'physical', true, false, target);
  const totalDR = generalTalentDR + conditionalDR;
  const painSuppMult = totalDR > 0 ? (1 - totalDR / 100) : 1;
  const rawDamage = enemy.damage * (shieldActive ? 0.5 : 1) * damageMultiplier;
  
  // Calculate effective armor considering conditional bonuses and effectiveness
  const effectiveArmor = calculateEffectiveArmorForDamageType(
    baseArmor,
    target.talentBonuses,
    'physical',
    false
  );
  
  // Apply evasion-to-mitigation if applicable
  const evasionMitigation = target.evasion && target.talentBonuses?.evasionToMitigationPercent
    ? calculateEvasionMitigation(target.evasion, target.talentBonuses.evasionToMitigationPercent, rawDamage)
    : 0;
  let evasionChance = target.evasion ? calculateEvasionChance(target.evasion, enemy.damage * 100) : 0;
  // Apply flat evade chance from talents (direct % bonus)
  const flatEvadeChance = target.talentBonuses?.evadeChance || 0;
  evasionChance = Math.min(0.95, evasionChance + (flatEvadeChance / 100));
  let dmg = 0;
  let blocked = false;
  
  if (Math.random() < evasionChance) {
    if (batchedLogEntries) {
      batchedLogEntries.push({ timestamp: totalTime, type: 'ability', source: enemy.name, target: target.name, message: `💨 ${target.name} evades ${enemy.name}'s attack!` });
    } else {
      updateCombatState(prev => ({ ...prev, combatLog: [...prev.combatLog, { timestamp: totalTime, type: 'ability', source: enemy.name, target: target.name, message: `💨 ${target.name} evades ${enemy.name}'s attack!` }] }));
    }
  } else {
    const armorMult = calculateArmorReduction(effectiveArmor, rawDamage);
    // Apply evasion mitigation as additional reduction
    const totalMitigation = armorMult * (1 - evasionMitigation);
    let damageAfterArmor = Math.floor(rawDamage * totalMitigation * painSuppMult);
    const blockChance = (target.blockChance || 0) + (target.blockBuff || 0);
      blocked = rollBlock(blockChance);
      if (blocked) {
        damageAfterArmor = Math.floor(damageAfterArmor * (1 - BLOCK_DAMAGE_REDUCTION));
        target.lastBlockTime = Date.now();
      } else {
        // Apply nonBlockedDamageReduction (Duel Warden talent)
        const nonBlockedDR = target.talentBonuses?.nonBlockedDamageReduction || 0;
        if (nonBlockedDR > 0) {
          damageAfterArmor = Math.floor(damageAfterArmor * (1 - nonBlockedDR / 100));
        }
      }
      const damageResult = calculateDamageWithResistances(
        damageAfterArmor, 'physical',
        { health: target.health, maxHealth: target.maxHealth, energyShield: target.energyShield || 0, maxEnergyShield: target.maxEnergyShield || 0, fireResistance: target.fireResistance || 0, coldResistance: target.coldResistance || 0, lightningResistance: target.lightningResistance || 0, chaosResistance: target.chaosResistance || 0 }
      );
      // Safety checks to prevent NaN
      const safeESRemaining = isNaN(damageResult.esRemaining) || !isFinite(damageResult.esRemaining) ? (target.energyShield || 0) : Math.max(0, damageResult.esRemaining);
      const safeLifeRemaining = isNaN(damageResult.lifeRemaining) || !isFinite(damageResult.lifeRemaining) ? (target.maxHealth || 0) : Math.max(0, damageResult.lifeRemaining);
      target.energyShield = safeESRemaining;
      target.health = safeLifeRemaining;
      dmg = isNaN(damageResult.totalDamage) || !isFinite(damageResult.totalDamage) ? 0 : damageResult.totalDamage;
    trackDamageTaken(target, dmg, enemy.name, 'Melee Attack', _currentTick, !blocked);
    if (dmg > 0) {
      setTeamFightAnim(prev => prev + 1);
      setEnemyFightAnims(prev => ({ ...prev, [enemy.id]: (prev[enemy.id] || 0) + 1 }));
      const jitterX = (Math.random() * 80) - 40;
      const jitterY = (Math.random() * 60) - 30;
      const floatNum = createFloatingNumber(dmg, blocked ? 'blocked' : 'enemy', currentCombatState.teamPosition.x + jitterX, currentCombatState.teamPosition.y - 40 + jitterY);
      if (batchedFloatingNumbers && batchedLogEntries) {
        batchedFloatingNumbers.push(floatNum);
        batchedLogEntries.push({ timestamp: totalTime, type: 'damage', source: enemy.name, target: target.name, value: dmg, ability: 'Melee Attack', message: `⚔️ ${enemy.name} hits ${target.name} for ${dmg}${blocked ? ' (BLOCKED!)' : ''}!` });
      } else {
        updateCombatState(prev => ({ ...prev, floatingNumbers: [...prev.floatingNumbers.slice(-20), floatNum], combatLog: [...prev.combatLog, { timestamp: totalTime, type: 'damage', source: enemy.name, target: target.name, value: dmg, ability: 'Melee Attack', message: `⚔️ ${enemy.name} hits ${target.name} for ${dmg}${blocked ? ' (BLOCKED!)' : ''}!` }] }));
      }
    }
    if (target.health <= 0 && !target.isDead) {
      target.isDead = true;
      if (batchedLogEntries) {
        batchedLogEntries.push({ timestamp: totalTime, type: 'death', source: enemy.name, target: target.name, message: `💀 ${target.name} has died!` });
      } else {
        updateCombatState(prev => ({ ...prev, combatLog: [...prev.combatLog, { timestamp: totalTime, type: 'death', source: enemy.name, target: target.name, message: `💀 ${target.name} has died!` }] }));
      }
    }
  }
  
  return true;
}

function processMeleeAttack(
  context: CombatContext,
  enemy: AnimatedEnemy,
  _teamStates: TeamMemberState[],
  tank: TeamMemberState | undefined,
  aliveMembers: TeamMemberState[],
  currentTick: number
): void {
  const { shieldActive, currentCombatState, batchedFloatingNumbers, batchedLogEntries, totalTime, updateCombatState, setTeamFightAnim, setEnemyFightAnims } = context;
  
  if (!canEnemyAct(enemy, currentTick)) return;
  
  const meleeTarget = tank || aliveMembers[Math.floor(Math.random() * aliveMembers.length)];
  if (!meleeTarget) {
    return;
  }
  
  performMeleeAttackOnTarget(context, enemy, meleeTarget, currentTick);
  
  
  // Skeleton Warrior cleave
  if (enemy.enemyId === 'skeleton_warrior') {
    if (enemy.aoeCooldownEndTick === undefined) enemy.aoeCooldownEndTick = 0;
    if (currentTick >= enemy.aoeCooldownEndTick && aliveMembers.length > 0) {
      const cleaveDmgBase = enemy.damage * 0.5;
      const rawCleaveDamage = cleaveDmgBase * (shieldActive ? 0.5 : 1);
      aliveMembers.forEach(member => {
        const effectiveArmor = member.armor * (1 + (member.armorBuff || 0) / 100);
        const talentDR = member.talentBonuses?.damageReduction || 0;
        const painSuppMult = talentDR > 0 ? (1 - talentDR / 100) : 1;
        const armorMult = calculateArmorReduction(effectiveArmor, rawCleaveDamage);
        let damageAfterArmor = Math.floor(rawCleaveDamage * armorMult * painSuppMult);
        const blockChance = (member.blockChance || 0) + (member.blockBuff || 0);
        const blocked = rollBlock(blockChance);
        if (blocked) {
          damageAfterArmor = Math.floor(damageAfterArmor * (1 - BLOCK_DAMAGE_REDUCTION));
          member.lastBlockTime = Date.now();
        }
        const damageResult = calculateDamageWithResistances(
          damageAfterArmor, 'physical',
          { health: member.health, maxHealth: member.maxHealth, energyShield: member.energyShield || 0, maxEnergyShield: member.maxEnergyShield || 0, fireResistance: member.fireResistance || 0, coldResistance: member.coldResistance || 0, lightningResistance: member.lightningResistance || 0, chaosResistance: member.chaosResistance || 0 }
        );
        member.energyShield = Math.max(0, damageResult.esRemaining);
        member.health = Math.max(0, damageResult.lifeRemaining);
        const cleave = damageResult.totalDamage;
        trackDamageTaken(member, cleave, enemy.name, 'Cleave', currentTick, !blocked);
        const jitterX = (Math.random() * 80) - 40;
        const jitterY = (Math.random() * 60) - 30;
        const floatNum = createFloatingNumber(cleave, blocked ? 'blocked' : 'enemy', currentCombatState.teamPosition.x + jitterX, currentCombatState.teamPosition.y - 40 + jitterY);
        if (batchedFloatingNumbers) {
          batchedFloatingNumbers.push(floatNum);
        } else {
          updateCombatState(prev => ({ ...prev, floatingNumbers: [...prev.floatingNumbers.slice(-20), floatNum] }));
        }
        if (member.health <= 0 && !member.isDead) {
          member.isDead = true;
          // Apply PoE-style death penalty (lose 10% of current level's experience)
          context.applyDeathPenalty(member.id);
          if (batchedLogEntries) {
            batchedLogEntries.push({ timestamp: totalTime, type: 'death', source: '', target: member.name, message: `💀 ${member.name} has died! (Experience penalty applied)` });
          } else {
            updateCombatState(prev => ({ ...prev, combatLog: [...prev.combatLog, { timestamp: totalTime, type: 'death', source: '', target: member.name, message: `💀 ${member.name} has died! (Experience penalty applied)` }] }));
          }
        }
      });
      setTeamFightAnim(prev => prev + 1);
      setEnemyFightAnims(prev => ({ ...prev, [enemy.id]: (prev[enemy.id] || 0) + 1 }));
      if (batchedLogEntries) {
        batchedLogEntries.push({ timestamp: totalTime, type: 'damage', source: enemy.name, target: 'ALL', value: 0, message: `⚔️ ${enemy.name} cleaves everyone!` });
      } else {
        updateCombatState(prev => ({ ...prev, combatLog: [...prev.combatLog, { timestamp: totalTime, type: 'damage', source: enemy.name, target: 'ALL', value: 0, message: `⚔️ ${enemy.name} cleaves everyone!` }] }));
      }
      const enemySpeed = context.mapAffixEffects?.enemySpeed || 0;
      const aoeCooldown = applyEnemySpeedToCooldown(3, enemySpeed);
      enemy.aoeCooldownEndTick = currentTick + secondsToTicks(aoeCooldown);
    }
  }
}

function processTankbusterAttack(
  context: CombatContext,
  enemy: AnimatedEnemy,
  _teamStates: TeamMemberState[],
  tank: TeamMemberState | undefined,
  aliveMembers: TeamMemberState[],
  currentTick: number,
  reservedTargets: Set<string>
): void {
  const { totalTime, updateCombatState } = context;
  
  if (!canEnemyAct(enemy, currentTick)) return;
  
  const enemyDef = getEnemyById(enemy.enemyId);
  const tankbusterAbility = enemyDef?.abilities?.[0];
  const abilityName = tankbusterAbility?.name || 'Crushing Blow';
  const abilityCooldownSeconds = tankbusterAbility?.cooldown || 3.0;
  const castTimeSeconds = tankbusterAbility?.castTime || 1.5;
  
  if (enemy.tankbusterCooldownEndTick === undefined) enemy.tankbusterCooldownEndTick = 0;
  
  // Tank is alive and not already being cast on - use tank buster
  if (currentTick >= enemy.tankbusterCooldownEndTick && tank && !tank.isDead && !reservedTargets.has(tank.id)) {
    const castTimeTicks = secondsToTicks(castTimeSeconds);
    startEnemyCast(enemy, castTimeTicks, currentTick, tank.id, abilityName);
    const enemySpeed = context.mapAffixEffects?.enemySpeed || 0;
    const adjustedCooldown = applyEnemySpeedToCooldown(abilityCooldownSeconds, enemySpeed);
    enemy.tankbusterCooldownEndTick = currentTick + secondsToTicks(adjustedCooldown);
    reservedTargets.add(tank.id);
    updateCombatState(prev => ({ ...prev, combatLog: [...prev.combatLog, { timestamp: totalTime, type: 'ability', source: enemy.name, target: tank.name, message: `💥 ${enemy.name} begins casting ${abilityName} on ${tank.name}... (UNINTERRUPTABLE!)` }] }));
  } else {
    // Tankbuster not ready (cooldown, no tank, or tank reserved) - fallback to melee attack
    const availableTargets = aliveMembers.filter(m => !reservedTargets.has(m.id));
    const meleeTarget = availableTargets.length > 0 
      ? availableTargets[Math.floor(Math.random() * availableTargets.length)]
      : aliveMembers.length > 0 ? aliveMembers[Math.floor(Math.random() * aliveMembers.length)] : null;
    
    if (meleeTarget) {
      performMeleeAttackOnTarget(context, enemy, meleeTarget, currentTick);
    }
  }
}

function processCasterAttack(
  context: CombatContext,
  enemy: AnimatedEnemy,
  _teamStates: TeamMemberState[],
  aliveMembers: TeamMemberState[],
  currentTick: number,
  reservedTargets: Set<string>
): void {
  const { totalTime, updateCombatState } = context;
  
  if (!canEnemyAct(enemy, currentTick)) return;
  
  const enemyDef = getEnemyById(enemy.enemyId);
  const spellAbility = enemyDef?.abilities?.[0];
  const castTimeSeconds = spellAbility?.castTime || 1.5;
  const abilityName = spellAbility?.name || 'Spell';
  
  // Filter out targets that are already being cast on by other enemies
  const availableTargets = aliveMembers.filter(m => !reservedTargets.has(m.id));
  
  // If all targets are reserved, pick from all alive members as fallback
  // (edge case: more casters than party members)
  const targetPool = availableTargets.length > 0 ? availableTargets : aliveMembers;
  
  if (targetPool.length === 0) return;
  
  // Casters have 70% chance to target the tank if available, 30% chance to target random party member
  const tank = targetPool.find(m => m.role === 'tank');
  const shouldTargetTank = tank && Math.random() < 0.7;
  const casterTarget = shouldTargetTank ? tank : targetPool[Math.floor(Math.random() * targetPool.length)];
  if (casterTarget) {
    const castTimeTicks = secondsToTicks(castTimeSeconds);
    startEnemyCast(enemy, castTimeTicks, currentTick, casterTarget.id, abilityName);
    // Reserve this target so other casters this tick won't target them
    reservedTargets.add(casterTarget.id);
    updateCombatState(prev => ({ ...prev, combatLog: [...prev.combatLog, { timestamp: totalTime, type: 'ability', source: enemy.name, target: casterTarget.name, message: `🔮 ${enemy.name} begins casting ${abilityName} on ${casterTarget.name}...` }] }));
  }
}

function processArcherAttack(
  context: CombatContext,
  enemy: AnimatedEnemy,
  teamStates: TeamMemberState[],
  aliveMembers: TeamMemberState[],
  currentTick: number
): void {
  const { shieldActive, totalTime, updateCombatState, currentCombatState, setTeamFightAnim, setEnemyFightAnims } = context;
  
  if (!canEnemyAct(enemy, currentTick)) return;
  
  const targetPool = aliveMembers.filter(m => m.id !== enemy.lastShotTarget || aliveMembers.length === 1);
  if (targetPool.length > 0) {
    // Archers have 60% chance to target the tank if available, 40% chance to target random party member
    const tank = targetPool.find(m => m.role === 'tank');
    const shouldTargetTank = tank && Math.random() < 0.6;
    const target = shouldTargetTank ? tank : targetPool[Math.floor(Math.random() * targetPool.length)];
    enemy.lastShotTarget = target.id;
    const baseArmor = target.armor * (1 + (target.armorBuff || 0) / 100);
    const generalTalentDR = target.talentBonuses?.damageReduction || 0;
    const conditionalDR = calculateConditionalDamageReduction(target.talentBonuses, 'physical', true, false, target);
    const totalDR = generalTalentDR + conditionalDR;
    const painSuppMult = totalDR > 0 ? (1 - totalDR / 100) : 1;
    const rawDamage = enemy.damage * 0.85 * (shieldActive ? 0.5 : 1);
    
    // Calculate effective armor considering conditional bonuses and effectiveness
    const effectiveArmor = calculateEffectiveArmorForDamageType(
      baseArmor,
      target.talentBonuses,
      'physical',
      false
    );
    
    // Apply evasion-to-mitigation if applicable
    // const evasionMitigation = target.evasion && target.talentBonuses?.evasionToMitigationPercent
    //   ? calculateEvasionMitigation(target.evasion, target.talentBonuses.evasionToMitigationPercent, rawDamage)
    //   : 0;
    
    // Calculate enemy accuracy with talent reductions
    let enemyAccuracy = enemy.damage * 100; // Base accuracy estimate from damage
    const enemyAccuracyReduction = target.talentBonuses?.enemyAccuracyReduction || 0;
    if (enemyAccuracyReduction > 0) {
      enemyAccuracy = Math.floor(enemyAccuracy * (1 - enemyAccuracyReduction / 100));
    }
    
    let evasionChance = target.evasion ? calculateEvasionChance(target.evasion, enemyAccuracy) : 0;
    // Apply flat evade chance from talents (direct % bonus)
    const flatEvadeChance = target.talentBonuses?.evadeChance || 0;
    evasionChance = Math.min(0.95, evasionChance + (flatEvadeChance / 100));
    let dmg = 0;
    let blocked = false;
    if (Math.random() < evasionChance) {
      updateCombatState(prev => ({ ...prev, combatLog: [...prev.combatLog, { timestamp: totalTime, type: 'ability', source: enemy.name, target: target.name, message: `💨 ${target.name} evades ${enemy.name}'s shot!` }] }));
    } else {
      const armorMult = calculateArmorReduction(effectiveArmor, rawDamage);
      let damageAfterArmor = Math.floor(rawDamage * armorMult * painSuppMult);
      const blockChance = (target.blockChance || 0) + (target.blockBuff || 0);
      blocked = rollBlock(blockChance);
      if (blocked) {
        // Apply base block reduction + talent block effectiveness
        const baseBlockReduction = BLOCK_DAMAGE_REDUCTION;
        const blockEffectiveness = target.talentBonuses?.blockEffectiveness || 0;
        const totalBlockReduction = Math.min(0.9, baseBlockReduction + (blockEffectiveness / 100));
        const blockedDamage = damageAfterArmor * totalBlockReduction;
        damageAfterArmor = Math.floor(damageAfterArmor * (1 - totalBlockReduction));
        target.lastBlockTime = Date.now();
        
        // Process onBlock effects
        processOnBlockEffects(target, blockedDamage, currentTick, teamStates);
      }
      const damageResult = calculateDamageWithResistances(
        damageAfterArmor, 'physical',
        { health: target.health, maxHealth: target.maxHealth, energyShield: target.energyShield || 0, maxEnergyShield: target.maxEnergyShield || 0, fireResistance: target.fireResistance || 0, coldResistance: target.coldResistance || 0, lightningResistance: target.lightningResistance || 0, chaosResistance: target.chaosResistance || 0 }
      );
      // Safety checks to prevent NaN
      const safeESRemaining = isNaN(damageResult.esRemaining) || !isFinite(damageResult.esRemaining) ? (target.energyShield || 0) : Math.max(0, damageResult.esRemaining);
      const safeLifeRemaining = isNaN(damageResult.lifeRemaining) || !isFinite(damageResult.lifeRemaining) ? (target.maxHealth || 0) : Math.max(0, damageResult.lifeRemaining);
      target.energyShield = safeESRemaining;
      target.health = safeLifeRemaining;
      dmg = isNaN(damageResult.totalDamage) || !isFinite(damageResult.totalDamage) ? 0 : damageResult.totalDamage;
      trackDamageTaken(target, dmg, enemy.name, 'Ranged Attack', currentTick, !blocked);
      if (dmg > 0) {
        setTeamFightAnim(prev => prev + 1);
        setEnemyFightAnims(prev => ({ ...prev, [enemy.id]: (prev[enemy.id] || 0) + 1 }));
        const jitterX = (Math.random() * 80) - 40;
        const jitterY = (Math.random() * 60) - 30;
        const floatNum = createFloatingNumber(dmg, blocked ? 'blocked' : 'enemy', currentCombatState.teamPosition.x + jitterX, currentCombatState.teamPosition.y - 40 + jitterY);
        updateCombatState(prev => ({ ...prev, floatingNumbers: [...prev.floatingNumbers.slice(-20), floatNum], combatLog: [...prev.combatLog, { timestamp: totalTime, type: 'damage', source: enemy.name, target: target.name, value: dmg, ability: 'Ranged Attack', message: `🏹 ${enemy.name} shoots ${target.name} for ${dmg}${blocked ? ' (BLOCKED!)' : ''}!` }] }));
      }
      if (target.health <= 0 && !target.isDead) {
        target.isDead = true;
        updateCombatState(prev => ({ ...prev, combatLog: [...prev.combatLog, { timestamp: totalTime, type: 'death', source: enemy.name, target: target.name, message: `💀 ${target.name} has died!` }] }));
      }
    }
  }
}

function processAoeAttack(
  context: CombatContext,
  enemy: AnimatedEnemy,
  teamStates: TeamMemberState[],
  tank: TeamMemberState | undefined,
  aliveMembers: TeamMemberState[],
  currentTick: number
): void {
  const { shieldActive, totalTime, updateCombatState, currentCombatState, setTeamFightAnim, setEnemyFightAnims } = context;
  
  if (!canEnemyAct(enemy, currentTick)) return;
  
  const isGateBoss = enemy.type === 'miniboss' || enemy.type === 'boss';
  const enemySpeed = context.mapAffixEffects?.enemySpeed || 0;
  const baseAoeCooldown = isGateBoss ? 5 : 3;
  const adjustedAoeCooldown = applyEnemySpeedToCooldown(baseAoeCooldown, enemySpeed);
  const aoeCooldownTicks = secondsToTicks(adjustedAoeCooldown);
  
  if (enemy.aoeCooldownEndTick === undefined) enemy.aoeCooldownEndTick = 0;
  
  if (currentTick >= enemy.aoeCooldownEndTick) {
    const aoeDmgMultiplier = isGateBoss ? 0.30 : 0.40;
    const abilityName = isGateBoss ? '💥 Devastating Slam' : '🌀 Dark Pulse';
    const currentAliveMembers = teamStates.filter(m => !m.isDead);
    if (currentAliveMembers.length > 0) {
      let totalAoeDamage = 0;
      const newFloats: FloatingNumber[] = [];
      currentAliveMembers.forEach(member => {
        const effectiveArmor = member.armor * (1 + (member.armorBuff || 0) / 100);
        const talentDR = member.talentBonuses?.damageReduction || 0;
        const painSuppMult = talentDR > 0 ? (1 - talentDR / 100) : 1;
        const rawAoeDamage = enemy.damage * (shieldActive ? 0.5 : 1) * aoeDmgMultiplier;
        const armorMult = calculateArmorReduction(effectiveArmor, rawAoeDamage);
        let damageAfterArmor = Math.floor(rawAoeDamage * armorMult * painSuppMult);
        const blockChance = (member.blockChance || 0) + (member.blockBuff || 0);
        const blocked = rollBlock(blockChance);
        if (blocked) {
          damageAfterArmor = Math.floor(damageAfterArmor * (1 - BLOCK_DAMAGE_REDUCTION));
          member.lastBlockTime = Date.now();
        }
        const damageResult = calculateDamageWithResistances(
          damageAfterArmor, 'physical',
          { health: member.health, maxHealth: member.maxHealth, energyShield: member.energyShield || 0, maxEnergyShield: member.maxEnergyShield || 0, fireResistance: member.fireResistance || 0, coldResistance: member.coldResistance || 0, lightningResistance: member.lightningResistance || 0, chaosResistance: member.chaosResistance || 0 }
        );
        // Safety checks to prevent NaN
        const safeESRemaining = isNaN(damageResult.esRemaining) || !isFinite(damageResult.esRemaining) ? (member.energyShield || 0) : Math.max(0, damageResult.esRemaining);
        const safeLifeRemaining = isNaN(damageResult.lifeRemaining) || !isFinite(damageResult.lifeRemaining) ? (member.maxHealth || 0) : Math.max(0, damageResult.lifeRemaining);
        member.energyShield = safeESRemaining;
        member.health = safeLifeRemaining;
        const dmg = isNaN(damageResult.totalDamage) || !isFinite(damageResult.totalDamage) ? 0 : damageResult.totalDamage;
        trackDamageTaken(member, dmg, enemy.name, abilityName, currentTick, !blocked);
        setTeamFightAnim(prev => prev + 1);
        totalAoeDamage += dmg;
        const jitterX = (Math.random() * 80) - 40;
        const jitterY = (Math.random() * 60) - 30;
        newFloats.push(createFloatingNumber(dmg, blocked ? 'blocked' : 'enemy', currentCombatState.teamPosition.x + jitterX, currentCombatState.teamPosition.y - 40 + jitterY));
        if (member.health <= 0 && !member.isDead) {
          member.isDead = true;
          // Apply PoE-style death penalty (lose 10% of current level's experience)
          context.applyDeathPenalty(member.id);
          updateCombatState(prev => ({ ...prev, combatLog: [...prev.combatLog, { timestamp: totalTime, type: 'death', source: enemy.name, target: member.name, message: `💀 ${member.name} has died! (Experience penalty applied)` }] }));
        }
      });
      setEnemyFightAnims(prev => ({ ...prev, [enemy.id]: (prev[enemy.id] || 0) + 1 }));
      updateCombatState(prev => ({ 
        ...prev, 
        floatingNumbers: [...prev.floatingNumbers.slice(-20), ...newFloats].slice(-20),
        combatLog: [...prev.combatLog, { timestamp: totalTime, type: 'damage', source: enemy.name, target: 'ALL', value: totalAoeDamage, ability: abilityName, message: `${abilityName} from ${enemy.name} hits EVERYONE for ${Math.floor(totalAoeDamage / currentAliveMembers.length)} each!` }] 
      }));
    }
    enemy.aoeCooldownEndTick = currentTick + aoeCooldownTicks;
  } else {
    // AoE cooldown not ready - fallback to melee attack
    const meleeTarget = tank || aliveMembers[Math.floor(Math.random() * aliveMembers.length)];
    if (meleeTarget) {
      performMeleeAttackOnTarget(context, enemy, meleeTarget, currentTick);
    }
  }
}

/**
 * Boss behavior - combines tankbuster, AoE pulse, and melee attacks
 * Bosses are VERY dangerous and require active healing/tanking:
 * - Periodic AoE pulse every 3 seconds (heavy damage to all)
 * - Tankbuster every 5 seconds (massive damage to tank)
 * - Hard-hitting melee attacks on tank between abilities
 */
function processBossAttack(
  context: CombatContext,
  enemy: AnimatedEnemy,
  teamStates: TeamMemberState[],
  tank: TeamMemberState | undefined,
  aliveMembers: TeamMemberState[],
  currentTick: number,
  reservedTargets: Set<string>
): void {
  const { shieldActive, totalTime, updateCombatState, currentCombatState, setTeamFightAnim, setEnemyFightAnims, scaling, batchedFloatingNumbers, batchedLogEntries } = context;
  
  console.log(`[BOSS COMBAT DEBUG] ========== processBossAttack CALLED at tick ${currentTick} ==========`);
  console.log(`[BOSS COMBAT DEBUG] Enemy: ${enemy.name} (type: ${enemy.type}, behavior: ${enemy.behavior})`);
  console.log(`[BOSS COMBAT DEBUG] Enemy state: health=${enemy.health}/${enemy.maxHealth}, isCasting=${enemy.isCasting}`);
  
  // Ensure isCasting is initialized
  if (enemy.isCasting === undefined) {
    console.log(`[BOSS COMBAT DEBUG] Initializing isCasting to false`);
    enemy.isCasting = false;
  }
  
  // Get boss abilities EARLY so we can use them in cast completion check
  const bossName = enemy.name;
  console.log(`[BOSS COMBAT DEBUG] Looking up abilities for boss name: "${bossName}"`);
  const bossAbilities = getBossAbilities(bossName);
  console.log(`[BOSS COMBAT DEBUG] Found ${bossAbilities.length} abilities for ${bossName}:`, bossAbilities.map(a => `${a.id}(${a.name})`));
  
  // Initialize boss ability state if not already done (needed for cast completion)
  if (!enemy.bossAbilityState) {
    console.log(`[BOSS COMBAT DEBUG] Initializing bossAbilityState for ${enemy.name}`);
    enemy.bossAbilityState = initBossAbilityState();
  } else {
    console.log(`[BOSS COMBAT DEBUG] bossAbilityState already exists. Cooldowns:`, Array.from(enemy.bossAbilityState.cooldowns.entries()).map(([id, tick]) => `${id}=${tick}`));
  }
  if (!enemy.partyDebuffs) {
    console.log(`[BOSS COMBAT DEBUG] Initializing partyDebuffs`);
    enemy.partyDebuffs = {};
  }
  if (!enemy.partyBuffs) {
    console.log(`[BOSS COMBAT DEBUG] Initializing partyBuffs`);
    enemy.partyBuffs = {};
  }
  if (!enemy.bossBuffs) {
    console.log(`[BOSS COMBAT DEBUG] Initializing bossBuffs`);
    enemy.bossBuffs = { buffs: [] };
  }
  
  // Wrap updateCombatState to match expected signature (needed for cast completion)
  const wrappedUpdateCombatState = (updater: (prev: any) => any) => {
    updateCombatState(updater);
    return currentCombatState;
  };
  
  // Check if cast is complete FIRST (before early return)
  // Casts complete exactly at castEndTick, not a tick later
  console.log(`[BOSS COMBAT DEBUG] Checking cast state: isCasting=${enemy.isCasting}, castEndTick=${enemy.castEndTick}, currentTick=${currentTick}`);
  
  if (enemy.isCasting && enemy.castEndTick && currentTick >= enemy.castEndTick) {
    const ticksElapsed = currentTick - (enemy.castStartTick || 0);
    const expectedTicks = enemy.castTotalTicks || 0;
    const castProgress = expectedTicks > 0 ? (ticksElapsed / expectedTicks) * 100 : 0;
    const ticksOverdue = currentTick - enemy.castEndTick;
    
    console.log(`[BOSS COMBAT DEBUG] ========== CAST COMPLETE DETECTED ==========`);
    console.log(`[BOSS COMBAT DEBUG] ${enemy.name} CAST COMPLETE CHECK at tick ${currentTick}:`);
    console.log(`[BOSS COMBAT DEBUG]   - isCasting: ${enemy.isCasting}`);
    console.log(`[BOSS COMBAT DEBUG]   - castEndTick: ${enemy.castEndTick}`);
    console.log(`[BOSS COMBAT DEBUG]   - castStartTick: ${enemy.castStartTick}`);
    console.log(`[BOSS COMBAT DEBUG]   - castTotalTicks: ${enemy.castTotalTicks}`);
    console.log(`[BOSS COMBAT DEBUG]   - ticksElapsed: ${ticksElapsed}, expected: ${expectedTicks}`);
    console.log(`[BOSS COMBAT DEBUG]   - castProgress: ${castProgress.toFixed(1)}%`);
    console.log(`[BOSS COMBAT DEBUG]   - ticksOverdue: ${ticksOverdue} (should be 0 or positive)`);
    console.log(`[BOSS COMBAT DEBUG]   - castAbility: ${enemy.castAbility}`);
    console.log(`[BOSS COMBAT DEBUG]   - castStartTime: ${enemy.castStartTime}`);
    console.log(`[BOSS COMBAT DEBUG]   - castTotalTime: ${enemy.castTotalTime}`);
    console.log(`[BOSS COMBAT DEBUG]   - Available abilities: ${bossAbilities.length}`, bossAbilities.map(a => `${a.id}(${a.name})`));
    console.log(`[BOSS COMBAT DEBUG]   - bossAbilityState exists: ${!!enemy.bossAbilityState}`);
    console.log(`[BOSS COMBAT DEBUG]   - partyDebuffs exists: ${!!enemy.partyDebuffs}`);
    console.log(`[BOSS COMBAT DEBUG]   - partyBuffs exists: ${!!enemy.partyBuffs}`);
    console.log(`[BOSS COMBAT DEBUG]   - bossBuffs exists: ${!!enemy.bossBuffs}`);
    
    // Cast complete - execute the ability
    console.log(`[BOSS COMBAT DEBUG] Searching for ability with id: "${enemy.castAbility}"`);
    const castingAbility = bossAbilities.find(a => a.id === enemy.castAbility);
    console.log(`[BOSS COMBAT DEBUG]   - Found castingAbility: ${castingAbility?.name || 'NONE'} (looking for id: ${enemy.castAbility})`);
    
    if (!castingAbility) {
      console.error(`[BOSS COMBAT DEBUG] ERROR: Ability not found!`);
      console.error(`[BOSS COMBAT DEBUG]   - Looking for: "${enemy.castAbility}"`);
      console.error(`[BOSS COMBAT DEBUG]   - Available IDs:`, bossAbilities.map(a => `"${a.id}"`));
      console.error(`[BOSS COMBAT DEBUG]   - Available names:`, bossAbilities.map(a => `"${a.name}"`));
    }
    
    if (castingAbility) {
      console.log(`[BOSS COMBAT DEBUG] Clearing cast state before execution...`);
      enemy.isCasting = false;
      enemy.castStartTick = undefined;
      enemy.castEndTick = undefined;
      enemy.castTotalTicks = undefined;
      enemy.castAbility = undefined;
      enemy.castStartTime = undefined;
      enemy.castTotalTime = undefined;
      console.log(`[BOSS COMBAT DEBUG] Cast state cleared. isCasting is now: ${enemy.isCasting}`);
      
      console.log(`[BOSS COMBAT DEBUG] ========== EXECUTING ABILITY ==========`);
      console.log(`[BOSS COMBAT DEBUG] Ability: ${castingAbility.name} (${castingAbility.id})`);
      console.log(`[BOSS COMBAT DEBUG] Damage: ${castingAbility.damage || 0}, TargetType: ${castingAbility.targetType}`);
      console.log(`[BOSS COMBAT DEBUG] Calling executeBossAbility at tick ${currentTick}...`);
      
      const result = executeBossAbility(
        castingAbility,
        enemy,
        teamStates,
        enemy.bossAbilityState!,
        enemy.partyDebuffs!,
        enemy.partyBuffs!,
        enemy.bossBuffs!,
        currentTick,
        bossName,
        wrappedUpdateCombatState as any,
        batchedFloatingNumbers,
        batchedLogEntries
      );
      
      console.log(`[BOSS COMBAT DEBUG] ========== ABILITY EXECUTION COMPLETE ==========`);
      console.log(`[BOSS COMBAT DEBUG] Result: ${result.damageDealt} damage to ${result.targetsHit} targets`);
      console.log(`[BOSS COMBAT DEBUG] Enemy state after execution: isCasting=${enemy.isCasting}`);
      console.log(`[BOSS COMBAT DEBUG] Ready for next ability selection.`);
      // Don't return - bosses have no GCD, continue to try selecting next ability immediately
    } else {
      // Cast completed but ability not found - clear casting state
      console.error(`[BOSS COMBAT DEBUG] ========== ERROR: CAST COMPLETED BUT NO ABILITY FOUND ==========`);
      console.error(`[BOSS COMBAT DEBUG] castAbility="${enemy.castAbility}"`);
      console.error(`[BOSS COMBAT DEBUG] Available ability IDs:`, bossAbilities.map(a => `"${a.id}"`));
      console.error(`[BOSS COMBAT DEBUG] Available ability names:`, bossAbilities.map(a => `"${a.name}"`));
      console.error(`[BOSS COMBAT DEBUG] Clearing cast state anyway...`);
      enemy.isCasting = false;
      enemy.castStartTick = undefined;
      enemy.castEndTick = undefined;
      enemy.castTotalTicks = undefined;
      enemy.castAbility = undefined;
      enemy.castStartTime = undefined;
      enemy.castTotalTime = undefined;
      console.error(`[BOSS COMBAT DEBUG] Cast state cleared. Will try to select new ability.`);
    }
  } else if (enemy.isCasting) {
    console.log(`[BOSS COMBAT DEBUG] Still casting: isCasting=${enemy.isCasting}, castEndTick=${enemy.castEndTick}, currentTick=${currentTick}, will complete at tick ${enemy.castEndTick}`);
  } else {
    console.log(`[BOSS COMBAT DEBUG] Not casting: isCasting=${enemy.isCasting}`);
  }
  
  // If still casting, wait for cast to complete
  // Bosses don't use GCD - they cast at exactly the tick they're supposed to
  if (enemy.isCasting && enemy.castEndTick && currentTick < enemy.castEndTick) {
    const ticksElapsed = currentTick - (enemy.castStartTick || 0);
    const ticksRemaining = enemy.castEndTick - currentTick;
    const expectedTicks = enemy.castTotalTicks || 0;
    const castProgress = expectedTicks > 0 ? (ticksElapsed / expectedTicks) * 100 : 0;
    const timeElapsed = enemy.castStartTime ? (Date.now() - enemy.castStartTime) / 1000 : 0;
    const timeRemaining = enemy.castTotalTime ? (enemy.castTotalTime - timeElapsed) : 0;
    
    // Log every tick while casting for detailed debugging
    console.log(`[BOSS COMBAT DEBUG] ${enemy.name} CASTING PROGRESS at tick ${currentTick}:`);
    console.log(`[BOSS COMBAT DEBUG]   - Progress: ${castProgress.toFixed(1)}%`);
    console.log(`[BOSS COMBAT DEBUG]   - Ticks: ${ticksElapsed}/${expectedTicks} elapsed, ${ticksRemaining} remaining`);
    console.log(`[BOSS COMBAT DEBUG]   - Time: ${timeElapsed.toFixed(2)}s/${enemy.castTotalTime || 0}s elapsed, ${timeRemaining.toFixed(2)}s remaining`);
    console.log(`[BOSS COMBAT DEBUG]   - Completes at tick: ${enemy.castEndTick}`);
    console.log(`[BOSS COMBAT DEBUG]   - Casting ability: ${enemy.castAbility}`);
    console.log(`[BOSS COMBAT DEBUG]   - Returning early - waiting for cast to complete`);
    return;
  }
  
  // Use new boss ability system if abilities are defined
  // (bossAbilities, bossAbilityState, etc. are already initialized above)
  if (bossAbilities.length > 0) {
    console.log(`[BOSS COMBAT DEBUG] ${enemy.name} (type: ${enemy.type}, behavior: ${enemy.behavior}) using new ability system with ${bossAbilities.length} abilities:`, bossAbilities.map(a => a.name));
    
    // Process debuff damage over time
    processDebuffDamage(
      teamStates,
      enemy.partyDebuffs!,
      currentTick,
      bossName,
      updateCombatState as any,
      batchedFloatingNumbers,
      batchedLogEntries
    );
    
    // Select and execute ability
    const healthPercent = (enemy.health / enemy.maxHealth) * 100;
    
    console.log(`[BOSS COMBAT DEBUG] ========== ABILITY SELECTION PHASE ==========`);
    console.log(`[BOSS COMBAT DEBUG] ${enemy.name} selecting ability at tick ${currentTick}:`);
    console.log(`[BOSS COMBAT DEBUG]   - Health: ${enemy.health}/${enemy.maxHealth} (${healthPercent.toFixed(1)}%)`);
    console.log(`[BOSS COMBAT DEBUG]   - Available abilities: ${bossAbilities.length}`);
    console.log(`[BOSS COMBAT DEBUG]   - bossAbilityState exists: ${!!enemy.bossAbilityState}`);
    console.log(`[BOSS COMBAT DEBUG]   - Current cooldowns:`, enemy.bossAbilityState ? Array.from(enemy.bossAbilityState.cooldowns.entries()).map(([id, tick]) => `${id}=${tick}`) : 'N/A');
    
    // Log all abilities and their cooldown status
    console.log(`[BOSS COMBAT DEBUG] Checking ability readiness:`);
    bossAbilities.forEach(ability => {
      const isReady = isAbilityReady(ability, enemy.bossAbilityState!, currentTick);
      const cooldownEndTick = enemy.bossAbilityState!.cooldowns.get(ability.id);
      const ticksRemaining = cooldownEndTick !== undefined ? Math.max(0, cooldownEndTick - currentTick) : 0;
      const secondsRemaining = ticksRemaining / 10;
      console.log(`[BOSS COMBAT DEBUG]   - ${ability.name} (${ability.id}):`);
      console.log(`[BOSS COMBAT DEBUG]     * ready=${isReady}`);
      console.log(`[BOSS COMBAT DEBUG]     * cooldownEndTick=${cooldownEndTick !== undefined ? cooldownEndTick : 'never used'}`);
      console.log(`[BOSS COMBAT DEBUG]     * ticksRemaining=${ticksRemaining} (${secondsRemaining.toFixed(1)}s)`);
      console.log(`[BOSS COMBAT DEBUG]     * castTime=${ability.castTime}s, cooldown=${ability.cooldown}s`);
      console.log(`[BOSS COMBAT DEBUG]     * isSignature=${ability.isSignature}, isOncePerFight=${ability.isOncePerFight}`);
    });
    
    console.log(`[BOSS COMBAT DEBUG] Calling selectBossAbility...`);
    const nextAbility = selectBossAbility(bossAbilities, enemy.bossAbilityState!, currentTick, healthPercent);
    console.log(`[BOSS COMBAT DEBUG] selectBossAbility returned: ${nextAbility ? `${nextAbility.name} (${nextAbility.id})` : 'null'}`);
    
    if (nextAbility) {
      console.log(`[BOSS COMBAT DEBUG] ========== ABILITY SELECTED ==========`);
      console.log(`[BOSS COMBAT DEBUG] SELECTED ABILITY: ${nextAbility.name} (${nextAbility.id})`);
      console.log(`[BOSS COMBAT DEBUG]   - castTime: ${nextAbility.castTime}s`);
      console.log(`[BOSS COMBAT DEBUG]   - cooldown: ${nextAbility.cooldown}s`);
      console.log(`[BOSS COMBAT DEBUG]   - damage: ${nextAbility.damage || 0}`);
      console.log(`[BOSS COMBAT DEBUG]   - targetType: ${nextAbility.targetType}`);
      
      // Check if ability needs casting time
      if (nextAbility.castTime > 0) {
        // Start casting
        const castTimeTicks = secondsToTicks(nextAbility.castTime);
        console.log(`[BOSS COMBAT DEBUG] ========== STARTING CAST ==========`);
        console.log(`[BOSS COMBAT DEBUG] Setting up cast state...`);
        console.log(`[BOSS COMBAT DEBUG]   - Before: isCasting=${enemy.isCasting}, castAbility=${enemy.castAbility}`);
        
        enemy.isCasting = true;
        enemy.castStartTick = currentTick;
        enemy.castEndTick = currentTick + castTimeTicks;
        enemy.castTotalTicks = castTimeTicks;
        enemy.castAbility = nextAbility.id;
        // Set real-time values for smooth UI animation
        enemy.castStartTime = Date.now();
        enemy.castTotalTime = nextAbility.castTime;
        
        console.log(`[BOSS COMBAT DEBUG]   - After: isCasting=${enemy.isCasting}, castAbility=${enemy.castAbility}`);
        console.log(`[BOSS COMBAT DEBUG] STARTING CAST at tick ${currentTick}:`);
        console.log(`[BOSS COMBAT DEBUG]   - Ability: ${nextAbility.name} (${nextAbility.id})`);
        console.log(`[BOSS COMBAT DEBUG]   - castTime: ${nextAbility.castTime}s = ${castTimeTicks} ticks`);
        console.log(`[BOSS COMBAT DEBUG]   - castStartTick: ${enemy.castStartTick}`);
        console.log(`[BOSS COMBAT DEBUG]   - castEndTick: ${enemy.castEndTick}`);
        console.log(`[BOSS COMBAT DEBUG]   - castTotalTicks: ${enemy.castTotalTicks}`);
        console.log(`[BOSS COMBAT DEBUG]   - castStartTime: ${enemy.castStartTime} (${new Date(enemy.castStartTime).toISOString()})`);
        console.log(`[BOSS COMBAT DEBUG]   - castTotalTime: ${enemy.castTotalTime}s`);
        console.log(`[BOSS COMBAT DEBUG]   - Expected completion at tick: ${enemy.castEndTick}`);
        console.log(`[BOSS COMBAT DEBUG]   - Expected completion time: ${new Date(enemy.castStartTime! + (enemy.castTotalTime! * 1000)).toISOString()}`);
        
        if (batchedLogEntries) {
          batchedLogEntries.push({
            timestamp: totalTime,
            type: 'boss',
            source: enemy.name,
            target: '',
            message: `🔮 ${enemy.name} begins casting ${nextAbility.name}...`
          });
        } else {
          updateCombatState(prev => ({
            ...prev,
            combatLog: [...prev.combatLog, {
              timestamp: totalTime,
              type: 'boss',
              source: enemy.name,
              target: '',
              message: `🔮 ${enemy.name} begins casting ${nextAbility.name}...`
            }]
          }));
        }
        return;
      } else {
        // Instant ability - execute immediately
        console.log(`[BOSS COMBAT DEBUG] ========== EXECUTING INSTANT ABILITY ==========`);
        console.log(`[BOSS COMBAT DEBUG] EXECUTING INSTANT ABILITY: ${nextAbility.name} (${nextAbility.id}) at tick ${currentTick}`);
        console.log(`[BOSS COMBAT DEBUG] Calling executeBossAbility...`);
        const result = executeBossAbility(
          nextAbility,
          enemy,
          teamStates,
          enemy.bossAbilityState!,
          enemy.partyDebuffs!,
          enemy.partyBuffs!,
          enemy.bossBuffs!,
          currentTick,
          bossName,
          wrappedUpdateCombatState as any,
          batchedFloatingNumbers,
          batchedLogEntries
        );
        
        console.log(`[BOSS COMBAT DEBUG] ========== INSTANT ABILITY EXECUTION COMPLETE ==========`);
        console.log(`[BOSS COMBAT DEBUG] Instant ability executed: ${result.damageDealt} damage to ${result.targetsHit} targets`);
        console.log(`[BOSS COMBAT DEBUG] Returning from processBossAttack (instant ability executed)`);
        return;
      }
    } else {
      console.log(`[BOSS COMBAT DEBUG] ========== NO ABILITY READY ==========`);
      console.log(`[BOSS COMBAT DEBUG] ${enemy.name} no ability ready at tick ${currentTick} (all on cooldown), performing melee attack`);
      console.log(`[BOSS COMBAT DEBUG] Available abilities were:`, bossAbilities.map(a => a.name));
      console.log(`[BOSS COMBAT DEBUG] Falling back to melee attack...`);
      
      // Perform basic melee attack when no abilities are ready (but only if cooldown allows)
      if (enemy.autoAttackEndTick === undefined || currentTick >= enemy.autoAttackEndTick) {
        const meleeTarget = tank || aliveMembers[Math.floor(Math.random() * aliveMembers.length)];
        if (meleeTarget && !meleeTarget.isDead) {
          // Boss melee attacks are instant, no cast time
          const baseDamage = enemy.damage || 30; // Use enemy damage or default
          const baseArmor = meleeTarget.armor * (1 + (meleeTarget.armorBuff || 0) / 100);
          const generalTalentDR = meleeTarget.talentBonuses?.damageReduction || 0;
          const conditionalDR = calculateConditionalDamageReduction(meleeTarget.talentBonuses, 'physical', true, false, meleeTarget);
          const totalDR = generalTalentDR + conditionalDR;
          const painSuppMult = totalDR > 0 ? (1 - totalDR / 100) : 1;
          const rawDamage = baseDamage * (shieldActive ? 0.5 : 1) * scaling.damageMultiplier;
          
          const effectiveArmor = calculateEffectiveArmorForDamageType(
            baseArmor,
            meleeTarget.talentBonuses,
            'physical',
            false
          );
          
          // Apply evasion-to-mitigation if applicable
          const evasionMitigation = meleeTarget.evasion && meleeTarget.talentBonuses?.evasionToMitigationPercent
            ? calculateEvasionMitigation(meleeTarget.evasion, meleeTarget.talentBonuses.evasionToMitigationPercent, rawDamage)
            : 0;
          
          // Calculate enemy accuracy with talent reductions
          let enemyAccuracy = baseDamage * 100; // Base accuracy estimate from damage
          const enemyAccuracyReduction = meleeTarget.talentBonuses?.enemyAccuracyReduction || 0;
          if (enemyAccuracyReduction > 0) {
            enemyAccuracy = Math.floor(enemyAccuracy * (1 - enemyAccuracyReduction / 100));
          }
          
          let evasionChance = meleeTarget.evasion ? calculateEvasionChance(meleeTarget.evasion, enemyAccuracy) : 0;
          const flatEvadeChance = meleeTarget.talentBonuses?.evadeChance || 0;
          evasionChance = Math.min(0.95, evasionChance + (flatEvadeChance / 100));
          let dmg = 0;
          let blocked = false;
          
          if (Math.random() < evasionChance) {
            // Evaded
            dmg = 0;
            if (batchedFloatingNumbers) {
              // Evade is shown as blocked type for visual feedback
              batchedFloatingNumbers.push(createFloatingNumber(0, 'blocked', 0, 0));
            }
          } else {
            const armorMult = calculateArmorReduction(effectiveArmor, rawDamage);
            // Apply evasion mitigation as additional reduction
            const totalMitigation = armorMult * (1 - evasionMitigation);
            let damageAfterArmor = Math.floor(rawDamage * totalMitigation * painSuppMult);
            blocked = rollBlock(meleeTarget.blockChance || 0);
            if (blocked) {
              damageAfterArmor = Math.floor(damageAfterArmor * (1 - BLOCK_DAMAGE_REDUCTION));
            }
            
            const damageResult = calculateDamageWithResistances(
              damageAfterArmor, 'physical',
              { health: meleeTarget.health, maxHealth: meleeTarget.maxHealth, energyShield: meleeTarget.energyShield || 0, maxEnergyShield: meleeTarget.maxEnergyShield || 0, fireResistance: meleeTarget.fireResistance || 0, coldResistance: meleeTarget.coldResistance || 0, lightningResistance: meleeTarget.lightningResistance || 0, chaosResistance: meleeTarget.chaosResistance || 0 }
            );
            // Safety checks to prevent NaN
            const safeESRemaining = isNaN(damageResult.esRemaining) || !isFinite(damageResult.esRemaining) ? (meleeTarget.energyShield || 0) : Math.max(0, damageResult.esRemaining);
            const safeLifeRemaining = isNaN(damageResult.lifeRemaining) || !isFinite(damageResult.lifeRemaining) ? (meleeTarget.maxHealth || 0) : Math.max(0, damageResult.lifeRemaining);
            meleeTarget.energyShield = safeESRemaining;
            meleeTarget.health = safeLifeRemaining;
            dmg = isNaN(damageResult.totalDamage) || !isFinite(damageResult.totalDamage) ? 0 : damageResult.totalDamage;
            
            if (batchedFloatingNumbers) {
              batchedFloatingNumbers.push(createFloatingNumber(dmg, blocked ? 'blocked' : 'enemy', 0, 0));
            }
            
            if (meleeTarget.health <= 0 && !meleeTarget.isDead) {
              meleeTarget.isDead = true;
              context.applyDeathPenalty(meleeTarget.id);
            }
          }
          
          if (dmg > 0 && batchedLogEntries) {
            batchedLogEntries.push({
              timestamp: currentTick / 10,
              type: 'damage',
              source: bossName,
              target: meleeTarget.name,
              value: dmg,
              ability: 'Melee Attack',
              message: `${bossName} hits ${meleeTarget.name} for ${dmg} damage!`
            });
          }
          
          // Set cooldown for next melee attack (1.5 seconds)
          const enemySpeed = context.mapAffixEffects?.enemySpeed || 0;
          const meleeCooldownSeconds = 1.5;
          let adjustedCooldown = applyEnemySpeedToCooldown(meleeCooldownSeconds, enemySpeed);
          adjustedCooldown = applyTalentAttackSpeedReduction(adjustedCooldown, meleeTarget);
          enemy.autoAttackEndTick = currentTick + secondsToTicks(adjustedCooldown);
        }
      }
      console.log(`[BOSS COMBAT DEBUG] ========== processBossAttack COMPLETE (melee attack) at tick ${currentTick} ==========`);
      return; // Exit after melee attack
    }
  } else {
    console.log(`[BOSS COMBAT DEBUG] No abilities defined for ${enemy.name}, using legacy behavior`);
  }
  
  // Fallback to legacy boss abilities if no new abilities defined
  // Initialize boss cooldowns - attacks come fast!
  // Set to currentTick so they can act immediately on first tick
  if (enemy.aoeCooldownEndTick === undefined || enemy.aoeCooldownEndTick === 0) {
    enemy.aoeCooldownEndTick = currentTick; // Can use AoE immediately
  }
  if (enemy.tankbusterCooldownEndTick === undefined || enemy.tankbusterCooldownEndTick === 0) {
    enemy.tankbusterCooldownEndTick = currentTick; // Can use tankbuster immediately
  }
  
  const enemyDef = getEnemyById(enemy.enemyId);
  const tankbusterAbility = enemyDef?.abilities?.[0];
  
  // Priority 1: Tankbuster (every 5 seconds, casted) - VERY DANGEROUS
  if (currentTick >= enemy.tankbusterCooldownEndTick && tank && !tank.isDead && !reservedTargets.has(tank.id)) {
    const abilityName = tankbusterAbility?.name || 'Crushing Blow';
    const castTimeSeconds = tankbusterAbility?.castTime || 1.5;
    const castTimeTicks = secondsToTicks(castTimeSeconds);
    
    startEnemyCast(enemy, castTimeTicks, currentTick, tank.id, abilityName);
    const enemySpeed = context.mapAffixEffects?.enemySpeed || 0;
    const adjustedCooldown = applyEnemySpeedToCooldown(5, enemySpeed);
    enemy.tankbusterCooldownEndTick = currentTick + secondsToTicks(adjustedCooldown);
    reservedTargets.add(tank.id);
    
    updateCombatState(prev => ({ 
      ...prev, 
      combatLog: [...prev.combatLog, { 
        timestamp: totalTime, 
        type: 'boss', 
        source: enemy.name, 
        target: tank.name, 
        message: `💥 ${enemy.name} begins casting ${abilityName} on ${tank.name}... (TANKBUSTER!)` 
      }] 
    }));
    return;
  }
  
  // Priority 2: AoE pulse (every 3 seconds, instant) - PAINFUL!
  if (currentTick >= enemy.aoeCooldownEndTick) {
    const abilityName = '🌀 Void Pulse';
    const aoeDmgMultiplier = 0.625; // 62.5% of boss damage to everyone - reduced from 1.25x, still dangerous
    const currentAliveMembers = teamStates.filter(m => !m.isDead);
    
    if (currentAliveMembers.length > 0) {
      let totalAoeDamage = 0;
      const newFloats: FloatingNumber[] = [];
      
      currentAliveMembers.forEach(member => {
        const talentDR = member.talentBonuses?.damageReduction || 0;
        const painSuppMult = talentDR > 0 ? (1 - talentDR / 100) : 1;
        const rawAoeDamage = enemy.damage * (shieldActive ? 0.5 : 1) * aoeDmgMultiplier;
        
        // AoE is magic damage, use spell block/suppression
        let dmg = Math.floor(rawAoeDamage * painSuppMult);
        const spellBlockChance = (member.spellBlockChance || 0) + (member.blockBuff || 0);
        const spellBlocked = rollSpellBlock(spellBlockChance);
        const spellSuppressed = member.spellSuppressionChance ? rollSpellSuppression(member.spellSuppressionChance) : false;
        
        if (spellBlocked) {
          dmg = Math.floor(dmg * (1 - BLOCK_DAMAGE_REDUCTION));
          member.lastBlockTime = Date.now();
        } else if (spellSuppressed) {
          // Apply base suppression reduction + talent suppression effectiveness
          const baseSuppressionReduction = SPELL_SUPPRESSION_DAMAGE_REDUCTION;
          const suppressionEffect = member.talentBonuses?.spellSuppressionEffect || 0;
          const totalSuppressionReduction = Math.min(0.9, baseSuppressionReduction + (suppressionEffect / 100));
          dmg = Math.floor(dmg * (1 - totalSuppressionReduction));
        }
        
        // Apply to ES first, then life
        const damageResult = calculateDamageWithResistances(
          dmg, 'shadow',
          { 
            health: member.health, 
            maxHealth: member.maxHealth, 
            energyShield: member.energyShield || 0, 
            maxEnergyShield: member.maxEnergyShield || 0, 
            fireResistance: member.fireResistance || 0, 
            coldResistance: member.coldResistance || 0, 
            lightningResistance: member.lightningResistance || 0, 
            chaosResistance: member.chaosResistance || 0 
          }
        );
        member.energyShield = Math.max(0, damageResult.esRemaining);
        member.health = Math.max(0, damageResult.lifeRemaining);
        dmg = damageResult.totalDamage;
        
        trackDamageTaken(member, dmg, enemy.name, abilityName, currentTick, !spellBlocked);
        totalAoeDamage += dmg;
        
        const jitterX = (Math.random() * 80) - 40;
        const jitterY = (Math.random() * 60) - 30;
        newFloats.push(createFloatingNumber(dmg, spellBlocked ? 'blocked' : 'enemy', currentCombatState.teamPosition.x + jitterX, currentCombatState.teamPosition.y - 40 + jitterY));
        
        if (member.health <= 0 && !member.isDead) {
          member.isDead = true;
          // Apply PoE-style death penalty (lose 10% of current level's experience)
          context.applyDeathPenalty(member.id);
          updateCombatState(prev => ({ 
            ...prev, 
            combatLog: [...prev.combatLog, { 
              timestamp: totalTime, 
              type: 'death', 
              source: enemy.name, 
              target: member.name, 
              message: `💀 ${member.name} has died! (Experience penalty applied)` 
            }] 
          }));
        }
      });
      
      setTeamFightAnim(prev => prev + 1);
      setEnemyFightAnims(prev => ({ ...prev, [enemy.id]: (prev[enemy.id] || 0) + 1 }));
      
      updateCombatState(prev => ({ 
        ...prev, 
        floatingNumbers: [...prev.floatingNumbers.slice(-20), ...newFloats].slice(-20),
        combatLog: [...prev.combatLog, { 
          timestamp: totalTime, 
          type: 'boss', 
          source: enemy.name, 
          target: 'ALL', 
          value: totalAoeDamage, 
          ability: abilityName, 
          message: `${abilityName} from ${enemy.name} hits EVERYONE for ${Math.floor(totalAoeDamage / currentAliveMembers.length)} each!` 
        }] 
      }));
    }
    
    const enemySpeed = context.mapAffixEffects?.enemySpeed || 0;
    const adjustedCooldown = applyEnemySpeedToCooldown(3, enemySpeed);
    enemy.aoeCooldownEndTick = currentTick + secondsToTicks(adjustedCooldown);
    return;
  }
  
  // Priority 3: Melee attack on tank (or random target if no tank) - HITS HARD
  // Only perform melee attack if cooldown allows (prevents attacking every tick)
  if (enemy.autoAttackEndTick === undefined || currentTick >= enemy.autoAttackEndTick) {
    const meleeTarget = tank || aliveMembers[Math.floor(Math.random() * aliveMembers.length)];
    if (!meleeTarget) {
      return;
    }
    
    const effectiveArmor = meleeTarget.armor * (1 + (meleeTarget.armorBuff || 0) / 100);
    const painSuppMult = meleeTarget.damageReduction ? (1 - meleeTarget.damageReduction / 100) : 1;
    const rawDamage = enemy.damage * (shieldActive ? 0.5 : 1) * 1.25; // 125% damage for melee - reduced from 2.5x, still dangerous
    
    let evasionChance = meleeTarget.evasion ? calculateEvasionChance(meleeTarget.evasion, enemy.damage * 100) : 0;
    // Apply flat evade chance from talents (direct % bonus)
    const flatEvadeChance = meleeTarget.talentBonuses?.evadeChance || 0;
    evasionChance = Math.min(0.95, evasionChance + (flatEvadeChance / 100));
    let dmg = 0;
    let blocked = false;
    
    if (Math.random() < evasionChance) {
      updateCombatState(prev => ({ 
        ...prev, 
        combatLog: [...prev.combatLog, { 
          timestamp: totalTime, 
          type: 'ability', 
          source: enemy.name, 
          target: meleeTarget.name, 
          message: `💨 ${meleeTarget.name} evades ${enemy.name}'s attack!` 
        }] 
      }));
    } else {
      const armorMult = calculateArmorReduction(effectiveArmor, rawDamage);
      let damageAfterArmor = Math.floor(rawDamage * armorMult * painSuppMult);
      const blockChance = (meleeTarget.blockChance || 0) + (meleeTarget.blockBuff || 0);
      blocked = rollBlock(blockChance);
      
      if (blocked) {
        damageAfterArmor = Math.floor(damageAfterArmor * (1 - BLOCK_DAMAGE_REDUCTION));
        meleeTarget.lastBlockTime = Date.now();
      }
      
      const damageResult = calculateDamageWithResistances(
        damageAfterArmor, 'physical',
        { 
          health: meleeTarget.health, 
          maxHealth: meleeTarget.maxHealth, 
          energyShield: meleeTarget.energyShield || 0, 
          maxEnergyShield: meleeTarget.maxEnergyShield || 0, 
          fireResistance: meleeTarget.fireResistance || 0, 
          coldResistance: meleeTarget.coldResistance || 0, 
          lightningResistance: meleeTarget.lightningResistance || 0, 
          chaosResistance: meleeTarget.chaosResistance || 0 
        }
      );
      meleeTarget.energyShield = Math.max(0, damageResult.esRemaining);
      meleeTarget.health = Math.max(0, damageResult.lifeRemaining);
      dmg = damageResult.totalDamage;
      
      trackDamageTaken(meleeTarget, dmg, enemy.name, 'Melee Attack', currentTick, !blocked);
      
      if (dmg > 0) {
        setTeamFightAnim(prev => prev + 1);
        setEnemyFightAnims(prev => ({ ...prev, [enemy.id]: (prev[enemy.id] || 0) + 1 }));
        
        const jitterX = (Math.random() * 80) - 40;
        const jitterY = (Math.random() * 60) - 30;
        const floatNum = createFloatingNumber(dmg, blocked ? 'blocked' : 'enemy', currentCombatState.teamPosition.x + jitterX, currentCombatState.teamPosition.y - 40 + jitterY);
        
        updateCombatState(prev => ({ 
          ...prev, 
          floatingNumbers: [...prev.floatingNumbers.slice(-20), floatNum], 
          combatLog: [...prev.combatLog, { 
            timestamp: totalTime, 
            type: 'damage', 
            source: enemy.name, 
            target: meleeTarget.name, 
            value: dmg, 
            ability: 'Melee Attack', 
            message: `⚔️ ${enemy.name} hits ${meleeTarget.name} for ${dmg}${blocked ? ' (BLOCKED!)' : ''}!` 
          }] 
        }));
      }
      
      if (meleeTarget.health <= 0 && !meleeTarget.isDead) {
        meleeTarget.isDead = true;
        updateCombatState(prev => ({ 
          ...prev, 
          combatLog: [...prev.combatLog, { 
            timestamp: totalTime, 
            type: 'death', 
            source: enemy.name, 
            target: meleeTarget.name, 
            message: `💀 ${meleeTarget.name} has died!` 
          }] 
        }));
      }
    }
    
    // Set cooldown for next melee attack (1.5 seconds between attacks)
    const enemySpeed = context.mapAffixEffects?.enemySpeed || 0;
    const meleeCooldownSeconds = 1.5;
    const adjustedCooldown = applyEnemySpeedToCooldown(meleeCooldownSeconds, enemySpeed);
    enemy.autoAttackEndTick = currentTick + secondsToTicks(adjustedCooldown);
  }
}

