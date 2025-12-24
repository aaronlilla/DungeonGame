import type { TeamMemberState } from '../../types/combat';
import { TICK_DURATION } from './types';
import type { CombatContext } from './types';
import { createFloatingNumber } from '../../utils/combat';

/**
 * Process buffs, HoTs, and regen for one tick
 * All durations are now tick-based
 */
export function processBuffsAndRegen(
  context: CombatContext,
  teamStates: TeamMemberState[],
  currentTick: number
): TeamMemberState[] {
  const { team, setScreenShake, updateCombatState, currentCombatState, combatRef } = context;
  
  // For simulation: automatically resurrect dead teammates (infinite battle res)
  const isSimulation = combatRef.current.simulationContextRef !== undefined;
  
  return teamStates.map(m => {
    // In simulation mode, automatically resurrect dead teammates
    if (isSimulation && m.isDead) {
      return {
        ...m,
        isDead: false,
        health: Math.floor(m.maxHealth * 0.6),
        mana: Math.floor(m.maxMana * 0.3),
        lastResurrectTime: Date.now()
      };
    }
    if (m.isDead) return m;
    
    // HP and Mana regen (per tick) - use character stats if available
    const character = team.find(c => c.id === m.id);
    const lifeRegenPercent = character?.baseStats?.lifeRegeneration ?? (m.role === 'tank' ? 1.5 : 0.5);
    let manaRegenPercent = character?.baseStats?.manaRegeneration ?? (m.role === 'healer' ? 5.0 : 4.0);
    
    // Apply 1000% increase (11x multiplier) to mana regen for characters under level 10
    if (character && character.level < 10) {
      manaRegenPercent *= 11; // 1000% increase means 11x the base amount
    }
    
    // Apply talent mana regen multiplier
    const talentManaRegenMultiplier = m.talentBonuses?.manaRegenMultiplier || 0;
    manaRegenPercent *= (1 + talentManaRegenMultiplier / 100);
    
    // Safety check: ensure maxHealth and maxMana are valid numbers
    const safeMaxHealth = (m.maxHealth && !isNaN(m.maxHealth) && m.maxHealth > 0) ? m.maxHealth : 1000;
    const safeMaxMana = (m.maxMana && !isNaN(m.maxMana) && m.maxMana > 0) ? m.maxMana : 500;
    const safeHealth = (m.health && !isNaN(m.health)) ? m.health : safeMaxHealth;
    const safeMana = (m.mana && !isNaN(m.mana)) ? m.mana : safeMaxMana;
    
    const hpRegenPerSecond = safeMaxHealth * (lifeRegenPercent / 100);
    const manaRegenPerSecond = safeMaxMana * (manaRegenPercent / 100);
    
    const hpRegenAmount = hpRegenPerSecond * TICK_DURATION;
    const manaRegenAmount = manaRegenPerSecond * TICK_DURATION;
    
    // Check damage reduction buff expiration
    let newDmgReduction = m.damageReduction || 0;
    if (m.damageReductionEndTick && currentTick >= m.damageReductionEndTick) {
      newDmgReduction = 0;
    }
    
    // Check armor buff expiration
    let newArmorBuff = m.armorBuff || 0;
    if (m.armorBuffEndTick && currentTick >= m.armorBuffEndTick) {
      newArmorBuff = 0;
    }
    
    // Check block buff expiration
    let newBlockBuff = m.blockBuff || 0;
    if (m.blockBuffEndTick && currentTick >= m.blockBuffEndTick) {
      newBlockBuff = 0;
    }
    
    // Decay recent damage taken
    const decayFactor = Math.pow(0.5, TICK_DURATION);
    const newRecentDamage = Math.floor((m.recentDamageTaken || 0) * decayFactor);
    
    // Energy Shield Recharge System
    let newEnergyShield = m.energyShield || 0;
    const maxES = m.maxEnergyShield || 0;
    if (maxES > 0 && newEnergyShield < maxES) {
      // Check if ES recharge delay has expired
      const lastDamageTick = m.lastDamageTakenTick || 0;
      const baseRechargeDelay = 2.0; // 2 seconds base delay
      const talentDelayReduction = m.talentBonuses?.esRechargeDelay || 0;
      const effectiveDelay = baseRechargeDelay * (1 - talentDelayReduction / 100);
      const delayTicks = Math.floor(effectiveDelay / TICK_DURATION);
      
      if (currentTick >= lastDamageTick + delayTicks) {
        // ES is recharging
        const baseRechargeRate = 0.33; // 33% of max ES per second (PoE default)
        const talentRechargeRate = m.talentBonuses?.esRechargeRate || 0;
        const effectiveRechargeRate = baseRechargeRate * (1 + talentRechargeRate / 100);
        const esRegenPerSecond = maxES * effectiveRechargeRate;
        const esRegenAmount = esRegenPerSecond * TICK_DURATION;
        newEnergyShield = Math.min(maxES, newEnergyShield + esRegenAmount);
      }
    }
    
    // ES Regeneration (flat per second, not recharge)
    const esRegeneration = m.talentBonuses?.esRegeneration || 0;
    if (esRegeneration > 0 && newEnergyShield < maxES) {
      const esRegenPerSecond = esRegeneration;
      const esRegenAmount = esRegenPerSecond * TICK_DURATION;
      newEnergyShield = Math.min(maxES, newEnergyShield + esRegenAmount);
    }
    
    // Ensure health and mana are valid numbers, clamp to max values
    let newHealth = Math.min(safeMaxHealth, safeHealth + hpRegenAmount);
    let newMana = Math.min(safeMaxMana, safeMana + manaRegenAmount);
    
    // Final safety check: ensure no NaN values
    if (isNaN(newHealth) || !isFinite(newHealth)) {
      console.warn(`[Buffs] Invalid health for ${m.name}, resetting to maxHealth`);
      newHealth = safeMaxHealth;
    }
    if (isNaN(newMana) || !isFinite(newMana)) {
      console.warn(`[Buffs] Invalid mana for ${m.name}, resetting to maxMana`);
      newMana = safeMaxMana;
    }
    let hotHealingBySource: Record<string, number> = {};
    
    // Process HoT effects (tick-based)
    let newHotEffects = (m.hotEffects || []).map(hot => {
      // Check if HoT has expired
      if (currentTick >= hot.expiresAtTick) {
        return null; // Will be filtered out
      }
      
      // Check if it's time for a heal tick
      if (currentTick >= hot.nextTickAtTick) {
        const healAmount = hot.healPerTick;
        const hotHealerChar = team.find(c => c.id === hot.sourceId);
        const critChance = hotHealerChar?.baseStats?.criticalStrikeChance || 10;
        const isCritHeal = Math.random() < (critChance / 100);
        const finalHealAmount = isCritHeal ? Math.floor(healAmount * 1.5) : healAmount;
        const actualHeal = Math.min(m.maxHealth - newHealth, finalHealAmount);
        newHealth = Math.min(m.maxHealth, newHealth + finalHealAmount);
        
        if (hot.sourceId) {
          hotHealingBySource[hot.sourceId] = (hotHealingBySource[hot.sourceId] || 0) + actualHeal;
          const hotHealer = teamStates.find(t => t.id === hot.sourceId);
          if (hotHealer) {
            hotHealer.healingBySpell = hotHealer.healingBySpell || {};
            hotHealer.healingBySpell[hot.name] = (hotHealer.healingBySpell[hot.name] || 0) + actualHeal;
          }
        }
        
        const jitterX = (Math.random() * 80) - 40;
        const jitterY = (Math.random() * 60) - 30;
        const floatNum = createFloatingNumber(
          finalHealAmount, 
          'heal', 
          currentCombatState.teamPosition.x + jitterX, 
          currentCombatState.teamPosition.y - 45 + jitterY
        );
        const hotHealTimestamp = Date.now();
        m.lastHealTime = hotHealTimestamp;
        m.lastHealAmount = actualHeal;
        m.lastHealCrit = isCritHeal;
        if (isCritHeal) setScreenShake(prev => prev + 1);
        updateCombatState(prev => ({ 
          ...prev, 
          teamStates: prev.teamStates.map(teamMember => 
            teamMember.id === m.id 
              ? { ...teamMember, lastHealTime: hotHealTimestamp, lastHealAmount: actualHeal, lastHealCrit: isCritHeal, health: newHealth }
              : teamMember
          ),
          floatingNumbers: [...prev.floatingNumbers.slice(-20), floatNum] 
        }));
        
        // Set next tick time
        return {
          ...hot,
          nextTickAtTick: currentTick + hot.tickIntervalTicks
        };
      }
      
      return hot;
    }).filter((hot): hot is NonNullable<typeof hot> => hot !== null);
    
    // Track total healing for healers
    Object.entries(hotHealingBySource).forEach(([sourceId, healing]) => {
      const healer = teamStates.find(t => t.id === sourceId);
      if (healer) {
        healer.totalHealing = (healer.totalHealing || 0) + healing;
      }
    });
    
    // Final safety check: ensure all values are valid numbers
    const finalHealth = (isNaN(newHealth) || !isFinite(newHealth)) ? safeMaxHealth : Math.max(0, Math.min(safeMaxHealth, newHealth));
    const finalMana = (isNaN(newMana) || !isFinite(newMana)) ? safeMaxMana : Math.max(0, Math.min(safeMaxMana, newMana));
    
    return { 
      ...m, 
      health: finalHealth,
      maxHealth: safeMaxHealth, // Ensure maxHealth is also valid
      mana: finalMana,
      maxMana: safeMaxMana, // Ensure maxMana is also valid
      energyShield: newEnergyShield,
      damageReduction: newDmgReduction, 
      damageReductionEndTick: newDmgReduction > 0 ? m.damageReductionEndTick : undefined,
      armorBuff: newArmorBuff,
      armorBuffEndTick: newArmorBuff > 0 ? m.armorBuffEndTick : undefined,
      blockBuff: newBlockBuff,
      blockBuffEndTick: newBlockBuff > 0 ? m.blockBuffEndTick : undefined,
      recentDamageTaken: newRecentDamage,
      hotEffects: newHotEffects,
      hasRejuv: newHotEffects.some(h => h.name === 'Rejuvenation')
    };
  });
}
