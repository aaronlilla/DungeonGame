import type React from 'react';
import type { CombatState, CombatRef, TeamMemberState } from '../../types/combat';
import type { CombatLogEntry } from '../../types/dungeon';
import type { Character } from '../../types/character';
import type { CombatLogCallback } from './types';
import { trackStatsFromLog, type StatsTracker } from './statsTracker';

/**
 * Handles combat state updates with automatic resurrection for simulation mode
 */
export class SimulationStateManager {
  private combatState: CombatState;
  private combatRef: React.MutableRefObject<CombatRef>;
  private combatLogEntries: CombatLogEntry[];
  private onCombatLog?: CombatLogCallback;
  private statsTracker: StatsTracker;
  private team: Character[];

  constructor(
    initialCombatState: CombatState,
    combatRef: React.MutableRefObject<CombatRef>,
    combatLogEntries: CombatLogEntry[],
    statsTracker: StatsTracker,
    team: Character[],
    onCombatLog?: CombatLogCallback
  ) {
    this.combatState = initialCombatState;
    this.combatRef = combatRef;
    this.combatLogEntries = combatLogEntries;
    this.statsTracker = statsTracker;
    this.team = team;
    this.onCombatLog = onCombatLog;
  }

  /**
   * Updates combat state, handling both function updaters and partial state objects
   * Automatically resurrects dead teammates in simulation mode
   */
  setCombatState(updaterOrState: ((prev: CombatState) => CombatState) | Partial<CombatState>): void {
    try {
      let newState: CombatState;
      
      if (typeof updaterOrState === 'function') {
        // It's a function updater
        newState = updaterOrState(this.combatState);
        // Ensure newState is valid
        if (!newState || typeof newState !== 'object') {
          console.warn('setCombatState: updater returned invalid state');
          return;
        }
      } else {
        // It's a partial state object - merge with current state
        if (!updaterOrState || typeof updaterOrState !== 'object') {
          console.warn('setCombatState: invalid state object provided');
          return;
        }
        newState = this.mergeState(updaterOrState);
      }
      
      // Ensure combatState exists before assigning
      if (!this.combatState || typeof this.combatState !== 'object') {
        console.error('setCombatState: combatState is invalid');
        return;
      }
      
      // Safely update combatState
      if (newState && typeof newState === 'object') {
        Object.assign(this.combatState, newState);
        
        // Automatic resurrection for simulation
        this.handleAutoResurrection(newState);
        
        // Track new log entries
        this.trackNewLogEntries(newState);
      }
    } catch (error) {
      console.error('setCombatState error:', error);
    }
  }

  getCombatState(): CombatState {
    return this.combatState;
  }

  private mergeState(partialState: Partial<CombatState>): CombatState {
    // Safely merge states, ensuring all required fields exist
    // Handle Set specially since it can't be spread
    const mergedState: any = {
      phase: this.combatState.phase,
      currentPullIndex: this.combatState.currentPullIndex,
      teamPosition: this.combatState.teamPosition,
      enemies: this.combatState.enemies,
      teamStates: this.combatState.teamStates,
      combatLog: this.combatState.combatLog,
      forcesCleared: this.combatState.forcesCleared,
      timeElapsed: this.combatState.timeElapsed,
      killedGateBosses: this.combatState.killedGateBosses,
      abilities: this.combatState.abilities,
      bloodlustActive: this.combatState.bloodlustActive,
      bloodlustTimer: this.combatState.bloodlustTimer,
      floatingNumbers: this.combatState.floatingNumbers,
      levelUpAnimations: this.combatState.levelUpAnimations
    };
    
    // Merge partialState, handling Set specially
    for (const key in partialState) {
      if (key === 'killedGateBosses' && partialState[key] instanceof Set) {
        mergedState[key] = partialState[key];
      } else if (partialState[key] !== undefined) {
        mergedState[key] = partialState[key];
      }
    }
    
    return mergedState as CombatState;
  }

  private handleAutoResurrection(newState: CombatState): void {
    // Automatic resurrection for simulation - immediately resurrect dead teammates
    // This prevents wipes and allows the simulation to continue testing formulas
    const teamStatesToCheck = newState.teamStates || this.combatState.teamStates;
    if (teamStatesToCheck && teamStatesToCheck.length > 0) {
      const currentTime = newState.timeElapsed || this.combatState.timeElapsed;
      let needsRez = false;
      
      teamStatesToCheck.forEach((member, index) => {
        if (member.isDead) {
          needsRez = true;
          // Auto-resurrect immediately in simulation (infinite battle res)
          const updatedMember = {
            ...member,
            isDead: false,
            health: Math.floor(member.maxHealth * 0.6),
            mana: Math.floor(member.maxMana * 0.3),
            lastResurrectTime: Date.now()
          };
          
          // Update in both places
          if (newState.teamStates) {
            newState.teamStates[index] = updatedMember;
          }
          if (this.combatState.teamStates) {
            this.combatState.teamStates[index] = updatedMember;
          }
          
          // Add resurrection log entry (only once per death to avoid spam)
          this.addResurrectionLog(updatedMember, currentTime);
        }
      });
      
      // If we resurrected anyone, update the state again to ensure it's persisted
      if (needsRez && newState.teamStates) {
        Object.assign(this.combatState, { teamStates: newState.teamStates });
        // Also update context through combatRef (for immediate propagation to combat loop)
        if (this.combatRef.current.simulationContextRef) {
          this.combatRef.current.simulationContextRef.teamStates = newState.teamStates;
        }
      }
    }
    
    // Also check and resurrect in combatState.teamStates directly (in case it wasn't in newState)
    // This ensures dead teammates are always immediately resurrected
    if (this.combatState.teamStates && this.combatState.teamStates.length > 0) {
      const currentTime = this.combatState.timeElapsed;
      let anyDead = false;
      this.combatState.teamStates.forEach((member, index) => {
        if (member.isDead) {
          anyDead = true;
          const updatedMember = {
            ...member,
            isDead: false,
            health: Math.floor(member.maxHealth * 0.6),
            mana: Math.floor(member.maxMana * 0.3),
            lastResurrectTime: Date.now()
          };
          this.combatState.teamStates[index] = updatedMember;
          
          // Update context through combatRef if available
          if (this.combatRef.current.simulationContextRef && this.combatRef.current.simulationContextRef.teamStates) {
            this.combatRef.current.simulationContextRef.teamStates[index] = updatedMember;
          }
        }
      });
      
      // If we resurrected anyone, update context reference
      if (anyDead && this.combatRef.current.simulationContextRef) {
        this.combatRef.current.simulationContextRef.teamStates = [...this.combatState.teamStates];
      }
    }
  }

  private addResurrectionLog(member: TeamMemberState, currentTime: number): void {
    const rezEntry: CombatLogEntry = {
      timestamp: currentTime,
      type: 'heal',
      source: 'Battle Res',
      target: member.name,
      message: `⚡ ${member.name} has been automatically resurrected!`
    };
    
    // Add to combat log if not already present
    const logExists = this.combatState.combatLog.some(e => 
      e.type === 'heal' && 
      e.source === 'Battle Res' && 
      e.target === member.name &&
      Math.abs(e.timestamp - currentTime) < 0.1
    );
    
    if (!logExists) {
      this.combatState.combatLog.push(rezEntry);
      this.combatLogEntries.push(rezEntry);
      if (this.onCombatLog) {
        this.onCombatLog(rezEntry);
      }
    }
  }

  private trackNewLogEntries(newState: CombatState): void {
    // Track new log entries
    if (newState.combatLog && newState.combatLog.length > this.combatLogEntries.length) {
      const newEntries = newState.combatLog.slice(this.combatLogEntries.length);
      newEntries.forEach(entry => {
        this.combatLogEntries.push(entry);
        // Track stats from log entry
        trackStatsFromLog(entry, this.statsTracker, this.team);
        // Call user callback
        if (this.onCombatLog) {
          this.onCombatLog(entry);
        }
      });
    }
  }
}
