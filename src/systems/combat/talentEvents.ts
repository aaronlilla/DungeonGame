import type { TeamMemberState } from '../../types/combat';
import type { TalentEffect } from '../../types/talents';
import { secondsToTicks } from './types';

/**
 * Process event-based talent effects
 * These effects trigger on specific combat events like onHit, onHeal, onBlock, etc.
 */

interface EventContext {
  source?: TeamMemberState;
  target?: TeamMemberState;
  damage?: number;
  healAmount?: number;
  currentTick: number;
  teamStates: TeamMemberState[];
}

/**
 * Process onHit effects - triggered when a character deals damage
 */
export function processOnHitEffects(
  source: TeamMemberState,
  damage: number,
  currentTick: number,
  teamStates: TeamMemberState[]
): void {
  if (!source.talentBonuses?.specialEffects) return;
  
  const onHitEffects = source.talentBonuses.specialEffects.filter(
    e => e.type === 'onHitEffect' || e.type === 'afterHitEffect'
  );
  
  onHitEffects.forEach(effect => {
    // Example: onHitEffect with value 5 might mean 5% damage reduction for 4 seconds
    // This would be stored in a temporary buff
    if (effect.type === 'onHitEffect' && effect.value > 0) {
      // Apply effect based on condition
      const condition = effect.condition || '';
      if (condition.includes('duration:')) {
        const durationMatch = condition.match(/duration:(\d+)/);
        const duration = durationMatch ? parseInt(durationMatch[1]) : 4;
        // Store in a temporary effect - would need to add to TeamMemberState
        // For now, we'll apply it as a temporary damage reduction
        if (!source.damageReduction) source.damageReduction = 0;
        source.damageReduction = Math.min(100, (source.damageReduction || 0) + effect.value);
        source.damageReductionEndTick = currentTick + secondsToTicks(duration);
      }
    }
  });
}

/**
 * Process onHeal effects - triggered when a character heals
 */
export function processOnHealEffects(
  source: TeamMemberState,
  target: TeamMemberState,
  healAmount: number,
  currentTick: number,
  teamStates: TeamMemberState[]
): void {
  if (!source.talentBonuses?.specialEffects) return;
  
  const onHealEffects = source.talentBonuses.specialEffects.filter(
    e => e.type === 'onHealEffect'
  );
  
  onHealEffects.forEach(effect => {
    // Example: onHealEffect might grant buffs to the healer or target
    if (effect.type === 'onHealEffect' && effect.value > 0) {
      const condition = effect.condition || '';
      
      // Check for self-heal effects (Blood Confessor)
      if (condition.includes('selfHeal')) {
        const selfHealPercent = effect.value;
        const selfHealAmount = Math.floor(healAmount * (selfHealPercent / 100));
        const safeCurrentHealth = isNaN(source.health) || !isFinite(source.health) ? source.maxHealth : source.health;
        const safeSelfHealAmount = isNaN(selfHealAmount) || !isFinite(selfHealAmount) ? 0 : selfHealAmount;
        source.health = Math.min(source.maxHealth, safeCurrentHealth + safeSelfHealAmount);
      }
      
      // Check for ally DR from healing (Blood Confessor)
      if (condition.includes('allyDR')) {
        // Apply damage reduction to allies
        teamStates.forEach(ally => {
          if (ally.id !== source.id && !ally.isDead) {
            if (!ally.damageReduction) ally.damageReduction = 0;
            ally.damageReduction = Math.min(100, ally.damageReduction + effect.value);
            ally.damageReductionEndTick = currentTick + secondsToTicks(4); // 4 second duration
          }
        });
      }
    }
  });
}

/**
 * Process onBlock effects - triggered when a character blocks
 */
export function processOnBlockEffects(
  target: TeamMemberState,
  blockedDamage: number,
  currentTick: number,
  teamStates: TeamMemberState[]
): void {
  if (!target.talentBonuses?.specialEffects) return;
  
  const onBlockEffects = target.talentBonuses.specialEffects.filter(
    e => e.type === 'onBlockEffect' || e.type === 'lifeOnBlock'
  );
  
  onBlockEffects.forEach(effect => {
    if (effect.type === 'lifeOnBlock') {
      // Restore life on block
      const lifeRestore = Math.floor(blockedDamage * (effect.value / 100));
      const safeCurrentHealth = isNaN(target.health) || !isFinite(target.health) ? target.maxHealth : target.health;
      const safeLifeRestore = isNaN(lifeRestore) || !isFinite(lifeRestore) ? 0 : lifeRestore;
      target.health = Math.min(target.maxHealth, safeCurrentHealth + safeLifeRestore);
    } else if (effect.type === 'onBlockEffect') {
      // Apply damage reduction or other effects
      const condition = effect.condition || '';
      if (condition.includes('duration:')) {
        const durationMatch = condition.match(/duration:(\d+)/);
        const duration = durationMatch ? parseInt(durationMatch[1]) : 4;
        
        if (!target.damageReduction) target.damageReduction = 0;
        target.damageReduction = Math.min(100, (target.damageReduction || 0) + effect.value);
        target.damageReductionEndTick = currentTick + secondsToTicks(duration);
      } else if (condition.includes('permanent')) {
        // Permanent effect - would need to track differently
        // For now, apply as a long-duration buff
        if (!target.damageReduction) target.damageReduction = 0;
        target.damageReduction = Math.min(100, (target.damageReduction || 0) + effect.value);
        target.damageReductionEndTick = currentTick + secondsToTicks(300); // 5 minutes
      }
    }
  });
}

/**
 * Process onEvade effects - triggered when a character evades
 */
export function processOnEvadeEffects(
  target: TeamMemberState,
  enemyName: string,
  currentTick: number,
  teamStates: TeamMemberState[]
): void {
  if (!target.talentBonuses?.specialEffects) return;
  
  const onEvadeEffects = target.talentBonuses.specialEffects.filter(
    e => e.type === 'onEvadeEffect'
  );
  
  onEvadeEffects.forEach(effect => {
    const condition = effect.condition || '';
    
    // Check for block chance bonus (Duel Warden)
    if (condition.includes('stacks:')) {
      const stacksMatch = condition.match(/stacks:(\d+)/);
      const durationMatch = condition.match(/duration:(\d+)/);
      const maxStacks = stacksMatch ? parseInt(stacksMatch[1]) : 3;
      const duration = durationMatch ? parseInt(durationMatch[1]) : 3;
      
      // Track stacks - would need to add to TeamMemberState
      // For now, apply as block bonus
      if (!target.blockBuff) target.blockBuff = 0;
      const currentStacks = Math.min(maxStacks, Math.floor((target.blockBuff || 0) / effect.value) + 1);
      target.blockBuff = effect.value * currentStacks;
      target.blockBuffEndTick = currentTick + secondsToTicks(duration);
    }
    
    // Check for damage reduction (Ghostblade)
    if (condition.includes('duration:')) {
      const durationMatch = condition.match(/duration:(\d+)/);
      const duration = durationMatch ? parseInt(durationMatch[1]) : 1;
      
      if (!target.damageReduction) target.damageReduction = 0;
      target.damageReduction = Math.min(100, (target.damageReduction || 0) + effect.value);
      target.damageReductionEndTick = currentTick + secondsToTicks(duration);
    }
    
    // Check for cast speed bonus (Ghostblade)
    if (condition.includes('castSpeed')) {
      // Would need to track this separately as it affects cast times
      // For now, apply as a temporary buff
      if (!target.blockBuff) target.blockBuff = 0;
      target.blockBuff = effect.value; // Reusing blockBuff as temporary effect tracker
      target.blockBuffEndTick = currentTick + secondsToTicks(1);
    }
  });
}

/**
 * Process onLowHealth effects - triggered when health drops below threshold
 */
export function processOnLowHealthEffects(
  target: TeamMemberState,
  currentTick: number,
  teamStates: TeamMemberState[]
): void {
  if (!target.talentBonuses?.specialEffects) return;
  
  const healthPercent = (target.health / target.maxHealth) * 100;
  if (healthPercent > 50) return; // Only trigger below 50% health
  
  const lowHealthEffects = target.talentBonuses.specialEffects.filter(
    e => e.type === 'onLowHealth'
  );
  
  lowHealthEffects.forEach(effect => {
    // Apply low health bonuses (damage reduction, healing increase, etc.)
    const condition = effect.condition || '';
    
    if (condition.includes('damageReduction')) {
      if (!target.damageReduction) target.damageReduction = 0;
      target.damageReduction = Math.min(100, (target.damageReduction || 0) + effect.value);
      target.damageReductionEndTick = currentTick + secondsToTicks(10); // 10 second duration
    }
  });
}

/**
 * Process onFullHealth effects - triggered when at full health
 */
export function processOnFullHealthEffects(
  target: TeamMemberState,
  currentTick: number
): void {
  if (!target.talentBonuses?.specialEffects) return;
  
  const healthPercent = (target.health / target.maxHealth) * 100;
  if (healthPercent < 100) return; // Only trigger at full health
  
  const fullHealthEffects = target.talentBonuses.specialEffects.filter(
    e => e.type === 'onFullHealth'
  );
  
  fullHealthEffects.forEach(effect => {
    // Apply full health bonuses (damage increase, etc.)
    // Would need to track this separately
  });
}

