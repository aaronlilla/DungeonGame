import type { TeamMemberState } from '../../types/combat';
import { createFloatingNumber } from '../../utils/combat';
import { sleep, TICK_MS, secondsToTicks, ticksToSeconds } from './types';
import type { CombatContext } from './types';

/**
 * Validates and fixes health values for all team members to prevent NaN propagation
 * Also ensures consistency between isDead and health values
 */
function validateAndFixTeamHealth(teamStates: TeamMemberState[]): TeamMemberState[] {
  return teamStates.map(m => {
    const safeMaxHealth = (m.maxHealth != null && !isNaN(m.maxHealth) && isFinite(m.maxHealth) && m.maxHealth > 0) 
      ? m.maxHealth 
      : 1000;
    
    // Calculate safe health value
    let safeHealth: number;
    if (m.health != null && !isNaN(m.health) && isFinite(m.health) && m.health >= 0) {
      safeHealth = Math.max(0, Math.min(safeMaxHealth, m.health));
    } else {
      safeHealth = m.isDead ? 0 : safeMaxHealth;
    }
    
    // CRITICAL: Ensure consistency between isDead and health
    // If health is 0 or less, member should be dead
    // If isDead is false, health must be > 0
    let finalIsDead = m.isDead;
    if (safeHealth <= 0) {
      finalIsDead = true;
      safeHealth = 0; // Ensure dead members have exactly 0 health
    } else if (!finalIsDead && safeHealth > 0) {
      // Member is alive and has health - ensure isDead is false
      finalIsDead = false;
    }
    
    return {
      ...m,
      health: safeHealth,
      maxHealth: safeMaxHealth,
      isDead: finalIsDead
    };
  });
}

export async function performPostCombatRecovery(
  context: CombatContext,
  teamStates: TeamMemberState[]
): Promise<{ teamStates: TeamMemberState[]; timedOut: boolean }> {
  const { combatRef, checkTimeout, updateCombatState, currentCombatState, setScreenShake, setIsRunning } = context;
  // Pass combatRef to sleep calls for simulation speedup
  let timedOut = false;
  
  // Validate team health before starting recovery
  teamStates = validateAndFixTeamHealth(teamStates);
  
  const healer = teamStates.find(m => m.role === 'healer' && !m.isDead);
  if (!healer || combatRef.current.stop) {
    return { teamStates: validateAndFixTeamHealth(teamStates), timedOut };
  }
  
  const aliveMembers = teamStates.filter(m => !m.isDead);
  let membersNeedingHealing = aliveMembers.filter(m => m.health < m.maxHealth);
  
  let firstHealMessage = true;
  let healIteration = 0;
  while (membersNeedingHealing.length > 0 && !combatRef.current.stop && !timedOut) {
    healIteration++;
    if (firstHealMessage) {
      updateCombatState(prev => ({ 
        ...prev, 
        phase: 'traveling', 
        combatLog: [...prev.combatLog, { 
          timestamp: context.totalTime, 
          type: 'ability', 
          source: healer.name, 
          target: '', 
          message: `🩸 ${healer.name} is healing up the party...` 
        }] 
      }));
      firstHealMessage = false;
    }
    
    const injured = membersNeedingHealing.reduce((mostInjured, m) => {
      const injuredPercent = (mostInjured.maxHealth - mostInjured.health) / mostInjured.maxHealth;
      const mPercent = (m.maxHealth - m.health) / m.maxHealth;
      return mPercent > injuredPercent ? m : mostInjured;
    });
    
    if (combatRef.current.stop) break;
    if (checkTimeout()) { timedOut = true; break; }
    
    const healNeeded = injured.maxHealth - injured.health;
    const healAmount = Math.min(healNeeded, Math.floor(injured.maxHealth * 0.4));
    const castTime = 1.2;
    
    healer.isCasting = true;
    healer.castAbility = 'Healing Wave';
    healer.castStartTime = Date.now();
    healer.castTotalTime = castTime;
    healer.castTargetId = injured.id;
    
    teamStates = teamStates.map(m => 
      m.id === healer.id 
        ? { ...m, isCasting: true, castAbility: 'Healing Wave', castStartTime: healer.castStartTime, castTotalTime: castTime, castTargetId: injured.id }
        : m
    );
    updateCombatState(prev => ({ ...prev, teamStates: [...teamStates] }));
    
    const castTicks = secondsToTicks(castTime);
    for (let t = 0; t < castTicks; t++) {
      if (combatRef.current.stop) break;
      const isSimulation = combatRef.current.simulationContextRef !== undefined;
      if (!isSimulation) {
        await sleep(TICK_MS, combatRef);
      }
      context.currentTick++;
      context.totalTime = ticksToSeconds(context.currentTick);
      if (t % 5 === 0) { // Update UI every 500ms
        updateCombatState(prev => ({ ...prev, teamStates: [...teamStates], timeElapsed: context.totalTime }));
      }
    }
    const healerChar = context.team.find(c => c.id === healer.id);
    const critChance = healerChar?.baseStats?.criticalStrikeChance || 10;
    const isCritHeal = Math.random() < (critChance / 100);
    const finalHealAmount = isCritHeal ? Math.floor(healAmount * 1.5) : healAmount;
    const safeCurrentHealth = isNaN(injured.health) || !isFinite(injured.health) ? injured.maxHealth : injured.health;
    const safeFinalHealAmount = isNaN(finalHealAmount) || !isFinite(finalHealAmount) ? 0 : finalHealAmount;
    const actualHeal = Math.min(injured.maxHealth - safeCurrentHealth, safeFinalHealAmount);
    injured.health = Math.min(injured.maxHealth, safeCurrentHealth + safeFinalHealAmount);
    const healTimestamp = Date.now();
    injured.lastHealTime = healTimestamp;
    injured.lastHealAmount = actualHeal;
    injured.lastHealCrit = isCritHeal;
    if (isCritHeal) setScreenShake(prev => prev + 1);
    // During recovery, healer has infinite mana - restore to full after each heal
    healer.mana = healer.maxMana;
    healer.totalHealing = (healer.totalHealing || 0) + actualHeal;
    healer.healingBySpell = healer.healingBySpell || {};
    healer.healingBySpell['Healing Wave'] = (healer.healingBySpell['Healing Wave'] || 0) + actualHeal;
    healer.isCasting = false;
    
    const jitterX = (Math.random() * 80) - 40;
    const jitterY = (Math.random() * 60) - 30;
    const floatNum = createFloatingNumber(actualHeal, 'heal', currentCombatState.teamPosition.x + jitterX, currentCombatState.teamPosition.y - 50 + jitterY);
    
    teamStates = teamStates.map(m => 
      m.id === injured.id 
        ? { ...m, lastHealTime: healTimestamp, lastHealAmount: actualHeal, lastHealCrit: isCritHeal, health: injured.health }
        : m.id === healer.id
        ? { ...m, mana: healer.maxMana, totalHealing: healer.totalHealing, healingBySpell: healer.healingBySpell, isCasting: false }
        : m
    );
    
    updateCombatState(prev => ({ 
      ...prev, 
      teamStates: [...teamStates],
      timeElapsed: context.totalTime,
      floatingNumbers: [...prev.floatingNumbers.slice(-20), floatNum],
      combatLog: [...prev.combatLog, { 
        timestamp: context.totalTime, 
        type: 'heal', 
        source: healer.name, 
        target: injured.name, 
        value: actualHeal, 
        message: `💊 ${healer.name} casts Healing Wave on ${injured.name} for ${actualHeal}${isCritHeal ? ' CRIT!' : ''}!` 
      }]
    }));
    
    const updatedAliveMembers = teamStates.filter(m => !m.isDead);
    membersNeedingHealing = updatedAliveMembers.filter(m => m.health < m.maxHealth);
    
    // No need to check mana - healer has infinite mana during recovery
  }
  
  // During recovery, healer has infinite mana - no need to drink
  // Continue healing any remaining injured members
  const updatedAliveMembers = teamStates.filter(m => !m.isDead);
  let stillNeedingHealing = updatedAliveMembers.filter(m => m.health < m.maxHealth);
  
  while (stillNeedingHealing.length > 0 && !combatRef.current.stop && !timedOut) {
    const injured = stillNeedingHealing.reduce((mostInjured, m) => {
      const injuredPercent = (mostInjured.maxHealth - mostInjured.health) / mostInjured.maxHealth;
      const mPercent = (m.maxHealth - m.health) / m.maxHealth;
      return mPercent > injuredPercent ? m : mostInjured;
    });
    
    if (combatRef.current.stop) break;
    if (checkTimeout()) { timedOut = true; break; }
    
    const healNeeded = injured.maxHealth - injured.health;
    const healAmount = Math.min(healNeeded, Math.floor(injured.maxHealth * 0.4));
    const castTime = 1.2;
    
    healer.isCasting = true;
    healer.castAbility = 'Healing Wave';
    healer.castStartTime = Date.now();
    healer.castTotalTime = castTime;
    healer.castTargetId = injured.id;
    
    teamStates = teamStates.map(m => 
      m.id === healer.id 
        ? { ...m, isCasting: true, castAbility: 'Healing Wave', castStartTime: healer.castStartTime, castTotalTime: castTime, castTargetId: injured.id }
        : m
    );
    updateCombatState(prev => ({ ...prev, teamStates: [...teamStates] }));
    
    const castTicks = secondsToTicks(castTime);
    for (let t = 0; t < castTicks; t++) {
      if (combatRef.current.stop) break;
      const isSimulation = combatRef.current.simulationContextRef !== undefined;
      if (!isSimulation) {
        await sleep(TICK_MS, combatRef);
      }
      context.currentTick++;
      context.totalTime = ticksToSeconds(context.currentTick);
      if (t % 5 === 0) { // Update UI every 500ms
        updateCombatState(prev => ({ ...prev, teamStates: [...teamStates], timeElapsed: context.totalTime }));
      }
    }
    
    const healerChar = context.team.find(c => c.id === healer.id);
    const critChance = healerChar?.baseStats?.criticalStrikeChance || 10;
    const isCritHeal = Math.random() < (critChance / 100);
    const finalHealAmount = isCritHeal ? Math.floor(healAmount * 1.5) : healAmount;
    const actualHeal = Math.min(injured.maxHealth - injured.health, finalHealAmount);
    injured.health = Math.min(injured.maxHealth, injured.health + finalHealAmount);
    const healTimestamp = Date.now();
    injured.lastHealTime = healTimestamp;
    injured.lastHealAmount = actualHeal;
    injured.lastHealCrit = isCritHeal;
    if (isCritHeal) setScreenShake(prev => prev + 1);
    // During recovery, healer has infinite mana - restore to full after each heal
    healer.mana = healer.maxMana;
    healer.totalHealing = (healer.totalHealing || 0) + actualHeal;
    healer.healingBySpell = healer.healingBySpell || {};
    healer.healingBySpell['Healing Wave'] = (healer.healingBySpell['Healing Wave'] || 0) + actualHeal;
    healer.isCasting = false;
    
    const jitterX = (Math.random() * 80) - 40;
    const jitterY = (Math.random() * 60) - 30;
    const floatNum = createFloatingNumber(actualHeal, 'heal', currentCombatState.teamPosition.x + jitterX, currentCombatState.teamPosition.y - 50 + jitterY);
    
    teamStates = teamStates.map(m => 
      m.id === injured.id 
        ? { ...m, lastHealTime: healTimestamp, lastHealAmount: actualHeal, lastHealCrit: isCritHeal, health: injured.health }
        : m.id === healer.id
        ? { ...m, mana: healer.maxMana, totalHealing: healer.totalHealing, healingBySpell: healer.healingBySpell, isCasting: false }
        : m
    );
    
    updateCombatState(prev => ({ 
      ...prev, 
      teamStates: [...teamStates],
      timeElapsed: context.totalTime,
      floatingNumbers: [...prev.floatingNumbers.slice(-20), floatNum],
      combatLog: [...prev.combatLog, { 
        timestamp: context.totalTime, 
        type: 'heal', 
        source: healer.name, 
        target: injured.name, 
        value: actualHeal, 
        message: `💊 ${healer.name} casts Healing Wave on ${injured.name} for ${actualHeal}${isCritHeal ? ' CRIT!' : ''}!` 
      }]
    }));
    
    const refreshedAliveMembers = teamStates.filter(m => !m.isDead);
    stillNeedingHealing = refreshedAliveMembers.filter(m => m.health < m.maxHealth);
    
    // No need to check mana - healer has infinite mana during recovery
  }
  
  if (timedOut) {
    updateCombatState(prev => ({ 
      ...prev, 
      phase: 'defeat', 
      combatLog: [...prev.combatLog, { 
        timestamp: context.totalTime, 
        type: 'phase', 
        source: '', 
        target: '', 
        message: '⏰ TIME EXPIRED during recovery! Dungeon failed.' 
      }] 
    }));
    setIsRunning(false);
    return { teamStates: validateAndFixTeamHealth(teamStates), timedOut: true };
  }
  
  teamStates = teamStates.map(m => ({
    ...m,
    health: m.isDead ? m.health : m.maxHealth,
    mana: m.isDead ? m.mana : m.maxMana,
    gcdEndTick: 0,
    isCasting: false,
    castStartTick: undefined,
    castEndTick: undefined,
    castTotalTicks: undefined,
    castStartTime: undefined,
    castTotalTime: undefined,
    castAbility: undefined,
    castTargetId: undefined
  }));
  
  const deadMembers = teamStates.filter(m => m.isDead);
  if (deadMembers.length > 0) {
    const healer = teamStates.find(m => m.role === 'healer' && !m.isDead);
    if (!healer) {
      updateCombatState(prev => ({ 
        ...prev, 
        phase: 'defeat', 
        combatLog: [...prev.combatLog, { 
          timestamp: context.totalTime, 
          type: 'phase', 
          source: '', 
          target: '', 
          message: '💀 WIPE! Healer is dead and cannot resurrect the party.' 
        }] 
      }));
      setIsRunning(false);
      return { teamStates: validateAndFixTeamHealth(teamStates), timedOut: true };
    }
    
    const rezCastTime = 6;
    const rezStartTime = Date.now();
    
    // Set healer's casting state so it's visible in the UI
    healer.isCasting = true;
    healer.castAbility = 'Mass Resurrection';
    healer.castStartTime = rezStartTime;
    healer.castTotalTime = rezCastTime;
    healer.castTargetId = undefined; // Mass rez targets all dead members
    
    teamStates = teamStates.map(m => 
      m.id === healer.id 
        ? { ...m, isCasting: true, castAbility: 'Mass Resurrection', castStartTime: rezStartTime, castTotalTime: rezCastTime, castTargetId: undefined }
        : m
    );
    
    updateCombatState(prev => ({ 
      ...prev, 
      phase: 'traveling',
      teamStates: [...teamStates],
      combatLog: [...prev.combatLog, { 
        timestamp: context.totalTime, 
        type: 'ability', 
        source: healer.name, 
        target: '', 
        message: `🙏 ${healer.name} begins casting Mass Resurrection... (${rezCastTime}s)` 
      }],
      healerCasting: { 
        ability: 'Mass Resurrection', 
        progress: 0, 
        startTime: rezStartTime 
      }
    }));
    
    const rezCastTicks = secondsToTicks(rezCastTime);
    for (let i = 1; i <= rezCastTicks; i++) {
      if (combatRef.current.stop) break;
      if (checkTimeout()) {
        timedOut = true;
        break;
      }
      const isSimulation = combatRef.current.simulationContextRef !== undefined;
      if (!isSimulation) {
        await sleep(TICK_MS, combatRef);
      }
      context.currentTick++;
      context.totalTime = ticksToSeconds(context.currentTick);
      const progress = (i / rezCastTicks) * 100;
      updateCombatState(prev => ({ 
        ...prev, 
        timeElapsed: context.totalTime,
        teamStates: prev.teamStates.map(m => 
          m.id === healer.id && m.isCasting
            ? { ...m, castStartTime: rezStartTime, castTotalTime: rezCastTime }
            : m
        ),
        healerCasting: { 
          ability: 'Mass Resurrection', 
          progress, 
          startTime: rezStartTime 
        }
      }));
    }
    
    // Clear casting state after resurrection completes
    healer.isCasting = false;
    teamStates = teamStates.map(m => 
      m.id === healer.id 
        ? { ...m, isCasting: false, castAbility: undefined, castStartTime: undefined, castTotalTime: undefined, castTargetId: undefined }
        : m
    );
    
    if (combatRef.current.stop || timedOut) {
      setIsRunning(false);
      return { teamStates: validateAndFixTeamHealth(teamStates), timedOut };
    }
    
    teamStates = teamStates.map(m => {
      // Safety checks for resurrection health - ensure valid values
      const safeMaxHealth = (m.maxHealth != null && !isNaN(m.maxHealth) && isFinite(m.maxHealth) && m.maxHealth > 0) 
        ? m.maxHealth 
        : 1000;
      const resurrectHealth = Math.floor(safeMaxHealth * 0.5);
      const safeResurrectHealth = (resurrectHealth != null && !isNaN(resurrectHealth) && isFinite(resurrectHealth) && resurrectHealth >= 0) 
        ? resurrectHealth 
        : safeMaxHealth;
      const currentHealth = (m.health != null && !isNaN(m.health) && isFinite(m.health) && m.health >= 0) 
        ? m.health 
        : safeMaxHealth;
      
      return {
        ...m,
        isDead: false,
        health: m.isDead ? safeResurrectHealth : currentHealth,
        maxHealth: safeMaxHealth, // Ensure maxHealth is also valid
        gcdEndTick: 0
      };
    });
    
    const rezNames = deadMembers.map(m => m.name).join(', ');
    updateCombatState(prev => ({
      ...prev,
      teamStates: [...teamStates],
      healerCasting: undefined,
      combatLog: [...prev.combatLog, {
        timestamp: context.totalTime,
        type: 'heal',
        source: healer.name,
        target: rezNames,
        message: `✨ ${healer.name} resurrects ${rezNames}!`
      }]
    }));
    
    await sleep(500, combatRef);
    
    // After resurrection, continue healing resurrected members to full health
    const resurrectedMembers = teamStates.filter(m => !m.isDead && m.health < m.maxHealth);
    let membersNeedingHealing = resurrectedMembers;
    
    while (membersNeedingHealing.length > 0 && !combatRef.current.stop && !timedOut) {
      const injured = membersNeedingHealing.reduce((mostInjured, m) => {
        const injuredPercent = (mostInjured.maxHealth - mostInjured.health) / mostInjured.maxHealth;
        const mPercent = (m.maxHealth - m.health) / m.maxHealth;
        return mPercent > injuredPercent ? m : mostInjured;
      });
      
      if (combatRef.current.stop) break;
      if (checkTimeout()) { timedOut = true; break; }
      
      const healNeeded = injured.maxHealth - injured.health;
      const healAmount = Math.min(healNeeded, Math.floor(injured.maxHealth * 0.4));
      const castTime = 1.2;
      
      healer.isCasting = true;
      healer.castAbility = 'Healing Wave';
      healer.castStartTime = Date.now();
      healer.castTotalTime = castTime;
      healer.castTargetId = injured.id;
      
      teamStates = teamStates.map(m => 
        m.id === healer.id 
          ? { ...m, isCasting: true, castAbility: 'Healing Wave', castStartTime: healer.castStartTime, castTotalTime: castTime, castTargetId: injured.id }
          : m
      );
      updateCombatState(prev => ({ ...prev, teamStates: [...teamStates] }));
      
      const castTicks = secondsToTicks(castTime);
      for (let t = 0; t < castTicks; t++) {
        if (combatRef.current.stop) break;
        const isSimulation = combatRef.current.simulationContextRef !== undefined;
        if (!isSimulation) {
          await sleep(TICK_MS, combatRef);
        }
        context.currentTick++;
        context.totalTime = ticksToSeconds(context.currentTick);
        if (t % 5 === 0) {
          updateCombatState(prev => ({ ...prev, teamStates: [...teamStates], timeElapsed: context.totalTime }));
        }
      }
      
      const healerChar = context.team.find(c => c.id === healer.id);
      const critChance = healerChar?.baseStats?.criticalStrikeChance || 10;
      const isCritHeal = Math.random() < (critChance / 100);
      const finalHealAmount = isCritHeal ? Math.floor(healAmount * 1.5) : healAmount;
      
      // Safety checks for NaN values - critical for post-resurrection healing
      const safeCurrentHealth = (injured.health != null && !isNaN(injured.health) && isFinite(injured.health) && injured.health >= 0) 
        ? injured.health 
        : (injured.maxHealth || 0);
      const safeMaxHealth = (injured.maxHealth != null && !isNaN(injured.maxHealth) && isFinite(injured.maxHealth) && injured.maxHealth > 0) 
        ? injured.maxHealth 
        : 1000;
      const safeFinalHealAmount = (finalHealAmount != null && !isNaN(finalHealAmount) && isFinite(finalHealAmount) && finalHealAmount >= 0) 
        ? finalHealAmount 
        : 0;
      
      const actualHeal = Math.min(safeMaxHealth - safeCurrentHealth, safeFinalHealAmount);
      const newHealth = Math.min(safeMaxHealth, safeCurrentHealth + safeFinalHealAmount);
      
      // Ensure newHealth is valid - this is critical to prevent NaN propagation
      const safeNewHealth = (newHealth != null && !isNaN(newHealth) && isFinite(newHealth) && newHealth >= 0) 
        ? Math.max(0, Math.min(safeMaxHealth, newHealth)) 
        : safeMaxHealth;
      
      injured.health = safeNewHealth;
      const healTimestamp = Date.now();
      injured.lastHealTime = healTimestamp;
      injured.lastHealAmount = actualHeal;
      injured.lastHealCrit = isCritHeal;
      if (isCritHeal) setScreenShake(prev => prev + 1);
      // During recovery, healer has infinite mana - restore to full after each heal
      healer.mana = healer.maxMana;
      healer.totalHealing = (healer.totalHealing || 0) + actualHeal;
      healer.healingBySpell = healer.healingBySpell || {};
      healer.healingBySpell['Healing Wave'] = (healer.healingBySpell['Healing Wave'] || 0) + actualHeal;
      healer.isCasting = false;
      
      const jitterX = (Math.random() * 80) - 40;
      const jitterY = (Math.random() * 60) - 30;
      const floatNum = createFloatingNumber(actualHeal, 'heal', currentCombatState.teamPosition.x + jitterX, currentCombatState.teamPosition.y - 50 + jitterY);
      
      teamStates = teamStates.map(m => 
        m.id === injured.id 
          ? { ...m, lastHealTime: healTimestamp, lastHealAmount: actualHeal, lastHealCrit: isCritHeal, health: safeNewHealth }
          : m.id === healer.id
          ? { ...m, mana: healer.maxMana, totalHealing: healer.totalHealing, healingBySpell: healer.healingBySpell, isCasting: false }
          : m
      );
      
      updateCombatState(prev => ({
        ...prev,
        teamStates: [...teamStates],
        timeElapsed: context.totalTime,
        floatingNumbers: [...prev.floatingNumbers.slice(-20), floatNum],
        combatLog: [...prev.combatLog, {
          timestamp: context.totalTime,
          type: 'heal',
          source: healer.name,
          target: injured.name,
          value: actualHeal,
          message: `💊 ${healer.name} casts Healing Wave on ${injured.name} for ${actualHeal}${isCritHeal ? ' CRIT!' : ''}!`
        }]
      }));
      
      const updatedAliveMembers = teamStates.filter(m => !m.isDead);
      // Ensure we only continue healing members who actually need it and have valid health values
      membersNeedingHealing = updatedAliveMembers.filter(m => {
        const health = m.health != null && !isNaN(m.health) && isFinite(m.health) ? m.health : 0;
        const maxHealth = m.maxHealth != null && !isNaN(m.maxHealth) && isFinite(m.maxHealth) && m.maxHealth > 0 ? m.maxHealth : 1000;
        return health < maxHealth;
      });
      
      // No need to check mana - healer has infinite mana during recovery
    }
  }
  
  // Final validation and ensure all alive members are at full health before returning
  teamStates = validateAndFixTeamHealth(teamStates);
  
  // CRITICAL: Ensure all alive members have health > 0 and are at full health and mana
  // This is especially important after resurrection to prevent resurrected members from dying immediately
  teamStates = teamStates.map(m => {
    if (m.isDead) {
      // Dead members should have 0 health
      return { ...m, health: 0, isDead: true };
    } else {
      // Alive members MUST have health > 0 and should be at full health and mana after recovery
      const safeMaxHealth = (m.maxHealth != null && !isNaN(m.maxHealth) && isFinite(m.maxHealth) && m.maxHealth > 0) 
        ? m.maxHealth 
        : 1000;
      const safeMaxMana = (m.maxMana != null && !isNaN(m.maxMana) && isFinite(m.maxMana) && m.maxMana > 0) 
        ? m.maxMana 
        : 100;
      // Ensure alive members are at full health and mana after recovery
      return { 
        ...m, 
        health: safeMaxHealth, 
        maxHealth: safeMaxHealth,
        mana: safeMaxMana,
        maxMana: safeMaxMana,
        isDead: false // Explicitly ensure isDead is false for alive members
      };
    }
  });
  
  // Double-check: if any alive members are below max health, they should have been healed
  // This is a safety check in case the healing loop exited prematurely
  const membersStillNeedingHealing = teamStates.filter(m => {
    if (m.isDead) return false;
    const health = m.health != null && !isNaN(m.health) && isFinite(m.health) ? m.health : 0;
    const maxHealth = m.maxHealth != null && !isNaN(m.maxHealth) && isFinite(m.maxHealth) && m.maxHealth > 0 ? m.maxHealth : 1000;
    return health < maxHealth;
  });
  
  // If there are still members needing healing and we haven't timed out or stopped, log a warning
  if (membersStillNeedingHealing.length > 0 && !timedOut && !combatRef.current.stop) {
    console.warn(`[Recovery] Warning: ${membersStillNeedingHealing.length} members still need healing after recovery loop:`, 
      membersStillNeedingHealing.map(m => `${m.name} (${m.health}/${m.maxHealth})`));
    // Set them to full health and mana as a safety measure
    teamStates = teamStates.map(m => {
      const memberNeedsHealing = membersStillNeedingHealing.some(needy => needy.id === m.id);
      if (memberNeedsHealing) {
        const safeMaxHealth = (m.maxHealth != null && !isNaN(m.maxHealth) && isFinite(m.maxHealth) && m.maxHealth > 0) 
          ? m.maxHealth 
          : 1000;
        const safeMaxMana = (m.maxMana != null && !isNaN(m.maxMana) && isFinite(m.maxMana) && m.maxMana > 0) 
          ? m.maxMana 
          : 100;
        return { ...m, health: safeMaxHealth, maxHealth: safeMaxHealth, mana: safeMaxMana, maxMana: safeMaxMana, isDead: false };
      }
      return m;
    });
  }
  
  // Final validation to ensure consistency
  teamStates = validateAndFixTeamHealth(teamStates);
  
  return { teamStates, timedOut };
}
