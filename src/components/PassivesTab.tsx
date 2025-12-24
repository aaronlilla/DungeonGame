import React, { useMemo, useCallback } from 'react';
import { useGameStore } from '../store/gameStore';
import { getClassById, getRoleIcon } from '../types/classes';
import { POEPassiveTree } from './passives/POEPassiveTree';
import { 
  getPassiveTree, 
  mapClassIdToTreeId, 
  canAllocateNode, 
  canDeallocateNode
} from '../data/PassiveTreeData';

// Import background images directly for better bundling
import bastionKnightBg from '../assets/backgrounds/bastionknight.png';
import wardBreakerBg from '../assets/backgrounds/wardbreaker.png';
import ironSkirmisherBg from '../assets/backgrounds/ironskirmisher.png';
import duelWardenBg from '../assets/backgrounds/duelwarden.png';
import shadowWardenBg from '../assets/backgrounds/shadowwarden.png';
import ghostbladeBg from '../assets/backgrounds/ghostblade.png';
import arcaneBulwarkBg from '../assets/backgrounds/arcanebulwark.png';
import nullTemplarBg from '../assets/backgrounds/nulltemplar.png';
import phaseGuardianBg from '../assets/backgrounds/phaseguardian.png';
import highClericBg from '../assets/backgrounds/highcleric.png';
import bloodConfessorBg from '../assets/backgrounds/bloodconfessor.png';
import tacticianBg from '../assets/backgrounds/tactician.png';
import groveHealerBg from '../assets/backgrounds/grovehealer.png';
import vitalistBg from '../assets/backgrounds/vitalist.png';
import ritualWardenBg from '../assets/backgrounds/ritualwarden.png';
import aegisKeeperBg from '../assets/backgrounds/aegiskeeper.png';
import martyrBg from '../assets/backgrounds/martyr.png';
import bastionStrategistBg from '../assets/backgrounds/bastionstrategist.png';

// Map class IDs to background images
const classBackgrounds: Record<string, string> = {
  bastion_knight: bastionKnightBg,
  wardbreaker: wardBreakerBg,
  iron_skirmisher: ironSkirmisherBg,
  duel_warden: duelWardenBg,
  shadow_warden: shadowWardenBg,
  ghostblade: ghostbladeBg,
  arcane_bulwark: arcaneBulwarkBg,
  null_templar: nullTemplarBg,
  phase_guardian: phaseGuardianBg,
  high_cleric: highClericBg,
  blood_confessor: bloodConfessorBg,
  tactician: tacticianBg,
  grove_healer: groveHealerBg,
  vitalist: vitalistBg,
  ritual_warden: ritualWardenBg,
  aegis_keeper: aegisKeeperBg,
  martyr: martyrBg,
  bastion_strategist: bastionStrategistBg,
};

// Max points per tree (could be based on character level later)
const MAX_PASSIVE_POINTS = 120;

export function PassivesTab() {
  const { 
    team, 
    selectedCharacterId,
    selectCharacter,
    allocatePassive,
    deallocatePassive,
    resetPassives
  } = useGameStore();

  const selectedCharacter = team.find(c => c.id === selectedCharacterId);

  // Get tree data based on selected character's class
  const treeData = useMemo(() => {
    if (!selectedCharacter?.classId) {
      return getPassiveTree(); // Default tree
    }
    const treeId = mapClassIdToTreeId(selectedCharacter.classId);
    return getPassiveTree(treeId);
  }, [selectedCharacter?.classId]);

  // Convert allocated passives to Set<string>
  const allocatedNodes = useMemo(() => {
    if (!selectedCharacter) return new Set<string>();
    return new Set(selectedCharacter.allocatedPassives);
  }, [selectedCharacter?.allocatedPassives]);

  // Calculate points used
  const usedPoints = useMemo(() => {
    if (!treeData) return 0;
    let points = 0;
    for (const nodeId of allocatedNodes) {
      const node = treeData.nodes.get(nodeId);
      if (node) {
        // Keystones cost 3 points, notables cost 2, regular nodes cost 1
        if (node.isKeystone) points += 3;
        else if (node.isNotable) points += 2;
        else points += 1;
      }
    }
    return points;
  }, [treeData, allocatedNodes]);

  // Handle node click
  const handleNodeClick = useCallback((nodeId: string) => {
    if (!selectedCharacter || !treeData) return;
    
    if (allocatedNodes.has(nodeId)) {
      // Try to deallocate
      if (canDeallocateNode(treeData, nodeId, allocatedNodes)) {
        deallocatePassive(selectedCharacter.id, nodeId);
      }
    } else {
      // Try to allocate
      if (canAllocateNode(treeData, nodeId, allocatedNodes)) {
        const node = treeData.nodes.get(nodeId);
        if (!node) return;
        
        // Check if we have enough points
        const nodeCost = node.isKeystone ? 3 : node.isNotable ? 2 : 1;
        if (usedPoints + nodeCost <= MAX_PASSIVE_POINTS) {
          allocatePassive(selectedCharacter.id, nodeId);
        }
      }
    }
  }, [selectedCharacter, treeData, allocatedNodes, usedPoints, allocatePassive, deallocatePassive]);

  // Handle reset
  const handleReset = useCallback(() => {
    if (selectedCharacter) {
      resetPassives(selectedCharacter.id);
    }
  }, [selectedCharacter, resetPassives]);

  // Calculate bonuses from allocated nodes
  const bonuses = useMemo(() => {
    if (!treeData) return [];
    
    interface ParsedBonus {
      statName: string;
      value: number;
      isPercent: boolean;
      modifier: string; // 'increased', 'reduced', 'more', 'less', or ''
    }
    
    const bonusMap = new Map<string, ParsedBonus>();
    
    for (const nodeId of allocatedNodes) {
      const node = treeData.nodes.get(nodeId);
      if (!node) continue;
      
      for (const stat of node.stats) {
        // Parse stat string like "+10 to Strength" or "6% increased Armour"
        // Pattern: [number][%?] [modifier?] [stat name]
        const match = stat.match(/([+-]?\d+)(%?)\s+(?:(to|increased|reduced|more|less)\s+)?(.+)/i);
        if (match) {
          const value = parseInt(match[1], 10);
          const isPercent = match[2] === '%';
          const modifier = (match[3] || '').toLowerCase();
          const statName = match[4].trim();
          
          // Create a unique key for grouping
          const key = `${modifier}|${isPercent ? '%' : ''}|${statName}`;
          
          const existing = bonusMap.get(key);
          if (existing) {
            existing.value += value;
          } else {
            bonusMap.set(key, {
              statName,
              value,
              isPercent,
              modifier,
            });
          }
        }
      }
    }
    
    return Array.from(bonusMap.values())
      .sort((a, b) => {
        // Sort flat bonuses first, then percent
        if (a.isPercent !== b.isPercent) {
          return a.isPercent ? 1 : -1;
        }
        // Then by absolute value
        return Math.abs(b.value) - Math.abs(a.value);
      });
  }, [treeData, allocatedNodes]);

  // No character selected
  if (!selectedCharacter) {
    return (
      <div className="passives-fullscreen">
        <div className="passives-empty">
          <div className="passives-empty-icon">⬡</div>
          <h3>No Character Selected</h3>
          <p>Select a character from the Team tab to view and allocate passive skills.</p>
        </div>
      </div>
    );
  }

  // No tree available
  if (!treeData) {
    return (
      <div className="passives-fullscreen">
        <div className="passives-empty">
          <div className="passives-empty-icon">⚠</div>
          <h3>No Passive Tree Available</h3>
          <p>The passive tree data could not be loaded.</p>
        </div>
      </div>
    );
  }


  return (
    <div className="passives-fullscreen">
      <div className="passives-layout">
        {/* Left Sidebar */}
        <div className="passives-sidebar">
          {/* Character/Class Selector */}
          <div className="panel" style={{ flex: '0 0 auto' }}>
            <div className="panel-header">
              <h3>Characters</h3>
            </div>
            <div className="panel-content">
              <div className="class-selector-passives">
                {team.map(char => {
                  const charClass = char.classId ? getClassById(char.classId) : null;
                  const charAllocated = new Set(char.allocatedPassives);
                  
                  let charPoints = 0;
                  if (treeData) {
                    for (const nodeId of charAllocated) {
                      const node = treeData.nodes.get(nodeId);
                      if (node) {
                        if (node.isKeystone) charPoints += 3;
                        else if (node.isNotable) charPoints += 2;
                        else charPoints += 1;
                      }
                    }
                  }
                  
                  // Get role icon
                  const roleIcon = charClass?.role ? getRoleIcon(charClass.role) : null;
                  
                  // Create color with alpha for glow effects
                  const classColor = charClass?.primaryColor || '#8b5a2b';
                  const classGlow = charClass?.primaryColor 
                    ? `${charClass.primaryColor}40` 
                    : 'rgba(139, 90, 43, 0.25)';
                  
                  // Get background image for this class
                  const bgImage = char.classId ? classBackgrounds[char.classId] : undefined;
                  
                  return (
                    <div
                      key={char.id}
                      className={`class-selector-item ${char.id === selectedCharacterId ? 'selected' : ''}`}
                      onClick={() => selectCharacter(char.id)}
                      style={{
                        '--class-color': classColor,
                        '--class-glow': classGlow,
                        '--class-bg': bgImage ? `url(${bgImage})` : 'none',
                      } as React.CSSProperties}
                    >
                      {/* Background image layer */}
                      {bgImage && (
                        <div 
                          className="class-selector-bg"
                          style={{ backgroundImage: `url(${bgImage})` }}
                        />
                      )}
                      <div className="class-selector-info">
                        <div className="class-selector-name">{char.name}</div>
                        <div className="class-selector-class">
                          {charClass?.name || 'No Class'}
                        </div>
                        <div className="class-selector-role">
                          <span className="class-selector-role-icon">{roleIcon}</span>
                          {charClass?.role || 'Unknown'}
                        </div>
                      </div>
                      <div className="class-selector-points">
                        <span className="class-selector-points-label">Points</span>
                        <span className="class-selector-points-value">{charPoints}/{MAX_PASSIVE_POINTS}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Active Bonuses */}
          <div className="panel" style={{ flex: 1, minHeight: 0 }}>
            <div className="panel-header">
              <h3>Active Bonuses</h3>
              <button 
                className="btn btn-danger btn-small passives-reset-btn"
                onClick={handleReset}
                disabled={allocatedNodes.size === 0}
              >
                Reset
              </button>
            </div>
            <div className="panel-content">
              {bonuses.length === 0 ? (
                <div style={{ color: 'var(--text-dim)', fontSize: '0.8rem', textAlign: 'center', padding: '1rem' }}>
                  No passives allocated yet.
                  <br />
                  Click nodes on the tree to allocate points.
                </div>
              ) : (
                <div className="passives-bonuses">
                  {bonuses.slice(0, 20).map((bonus, i) => {
                    // Format the value display
                    let valueStr = '';
                    if (bonus.isPercent) {
                      valueStr = `${bonus.value > 0 ? '+' : ''}${bonus.value}%`;
                    } else {
                      valueStr = `${bonus.value > 0 ? '+' : ''}${bonus.value}`;
                    }
                    
                    // Add modifier if present
                    if (bonus.modifier && bonus.modifier !== 'to') {
                      valueStr += ` ${bonus.modifier}`;
                    }
                    
                    return (
                      <div key={i} className="bonus-item">
                        <span className="bonus-item-name" title={bonus.statName}>
                          {bonus.statName}
                        </span>
                        <span className={`bonus-item-value ${bonus.value > 0 ? 'positive' : bonus.value < 0 ? 'negative' : ''}`}>
                          {valueStr}
                        </span>
                      </div>
                    );
                  })}
                  {bonuses.length > 20 && (
                    <div style={{ color: 'var(--text-dim)', fontSize: '0.7rem', textAlign: 'center', paddingTop: '0.5rem' }}>
                      +{bonuses.length - 20} more bonuses...
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Main Tree Area */}
        <div className="passives-tree-panel panel">
          <POEPassiveTree
            treeData={treeData}
            allocatedNodes={allocatedNodes}
            onNodeClick={handleNodeClick}
            maxPoints={MAX_PASSIVE_POINTS}
            usedPoints={usedPoints}
          />
        </div>
      </div>
    </div>
  );
}
