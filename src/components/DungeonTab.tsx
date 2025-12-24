import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { useGameStore } from '../store/gameStore';
import { SAMPLE_DUNGEON, calculateKeyScaling, randomizeGateBossPositions } from '../types/dungeon';
import type { RoutePull, DungeonRunResult, EnemyPack } from '../types/dungeon';
import type { CombatState, CombatRef } from '../types/combat';
import { initAbilities } from '../utils/combat';
import { CombatPanel } from './dungeon/CombatPanel';
import { CombatLog } from './dungeon/CombatLog';
import { AbilitiesPanel } from './dungeon/AbilitiesPanel';
import { DungeonControls } from './dungeon/DungeonControls';
import { ResultModal } from './dungeon/ResultModal';
import { LootNotifications } from './dungeon/LootNotifications';
import { BuffTooltip, StatsTooltip } from './dungeon/Tooltips';
import { TeamStatusPanel } from './dungeon/TeamStatusPanel';
import { RoutePlanner } from './dungeon/RoutePlanner';
import { DungeonMap } from './dungeon/DungeonMap';
import { BossSidebar } from './dungeon/BossSidebar';
import { runDungeonCombat } from '../systems/dungeonCombat';
import { runCombatSimulationTest } from '../systems/combatSimulationTest';
import { CombatTestModal } from './dungeon/CombatTestModal';
import { generateLeagueEncounters } from '../types/maps';
import type { MapAffixEffectType } from '../types/maps';
import { generateEnemyLootDrops } from '../systems/crafting';
import { getItemGridSize } from '../types/items';
import { findAvailablePosition, buildOccupancyGrid } from '../utils/gridUtils';
import { getRandomBossName } from '../utils/bossNames';
import type { DungeonBoss } from '../types/dungeon';


export function DungeonTab() {
  const { 
    team, 
    inventory, 
    highestKeyCompleted, 
    highestMapTierCompleted,
    activatedMap,
    completeDungeonRun,
    addOrbs,
    addKey,
    addExperienceToCharacter,
    applyDeathPenalty,
    addItemToInventory,
    addMap,
    addFragment,
    setActiveTab,
    stashTabs,
    activeStashTabId,
    addItemToStash,
    clearActivatedMap
  } = useGameStore();

  const [routePulls, setRoutePulls] = useState<RoutePull[]>([]);
  const [runResult, setRunResult] = useState<DungeonRunResult | null>(null);
  
  // Use activated map tier as the dungeon level, or fallback to 2
  const selectedKeyLevel = activatedMap?.tier || 2;
  
  // Calculate map affix effects
  const mapAffixEffects = useMemo(() => {
    const effects = {
      enemyDamageIncrease: 0,
      enemyHealthIncrease: 0,
      playerDamageReduction: 0,
      enemySpeed: 0
    };
    
    if (!activatedMap) return effects;
    
    // Aggregate effects from all map affixes
    activatedMap.affixes.forEach(affix => {
      affix.effects.forEach(effect => {
        switch (effect.type as MapAffixEffectType) {
          case 'enemyDamageIncrease':
            effects.enemyDamageIncrease += effect.value;
            break;
          case 'enemyHealthIncrease':
            effects.enemyHealthIncrease += effect.value;
            break;
          case 'playerDamageReduction':
            effects.playerDamageReduction += effect.value;
            break;
          case 'enemySpeed':
            effects.enemySpeed += effect.value;
            break;
        }
      });
    });
    
    return effects;
  }, [activatedMap]);
  
  // Use the activated map's bonuses (which now include fragment bonuses)
  const totalQuantityBonus = activatedMap?.quantityBonus || 0;
  const totalRarityBonus = activatedMap?.rarityBonus || 0;
  
  const [isCreatingPull, setIsCreatingPull] = useState(false);
  const [currentPullPacks, setCurrentPullPacks] = useState<string[]>([]);
  const [selectedPack, setSelectedPack] = useState<string | null>(null);
  
  const [isRunning, setIsRunning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [shieldActive, setShieldActive] = useState(false);
  const [stunActive, setStunActive] = useState(false);
  const [hoveredStatsMember, setHoveredStatsMember] = useState<{ id: string; x: number; y: number } | null>(null);
  const [buffTooltip, setBuffTooltip] = useState<{ text: string; x: number; y: number } | null>(null);
  const [screenShake, setScreenShake] = useState(0);
  const [teamFightAnim, setTeamFightAnim] = useState(0); // Trigger team fighting animation
  const [enemyFightAnims, setEnemyFightAnims] = useState<Record<string, number>>({}); // Track enemy fight animations
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, scrollLeft: 0 });
  const [dungeonStartTime, setDungeonStartTime] = useState<number | null>(null); // When the dungeon run started
  const [testResult, setTestResult] = useState<import('../systems/combatSimulationTest').TestResult | null>(null);
  const [testCombatLog, setTestCombatLog] = useState<import('../types/dungeon').CombatLogEntry[]>([]);
  const [isRunningTest, setIsRunningTest] = useState(false);
  const [selectedBoss, setSelectedBoss] = useState<DungeonBoss | EnemyPack | null>(null);
  
  const [combatState, setCombatState] = useState<CombatState>({
    phase: 'idle',
    currentPullIndex: -1,
    teamPosition: { x: 100, y: 400 },
    enemies: [],
    teamStates: [],
    combatLog: [],
    forcesCleared: 0,
    timeElapsed: 0,
    killedGateBosses: new Set(),
    abilities: initAbilities(),
    bloodlustActive: false,
    bloodlustTimer: 0,
    floatingNumbers: [],
    levelUpAnimations: [],
    lootDrops: [],
    leagueEncounters: []
  });
  
  const combatRef = useRef<CombatRef>({ stop: false, paused: false, resurrectRequest: null, bloodlustRequest: false, abilityCooldowns: {} });
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapScrollRef = useRef<HTMLDivElement>(null);

  // Initialize boss names when dungeon is created
  const initializeBossNames = useCallback((dungeon: typeof SAMPLE_DUNGEON) => {
    const usedNames = new Set<string>();
    
    // Assign names to all bosses
    dungeon.bosses.forEach(boss => {
      if (!boss.displayName) {
        boss.displayName = getRandomBossName(usedNames);
        usedNames.add(boss.displayName);
      }
    });
    
    // Assign names to gate bosses
    dungeon.enemyPacks.forEach(pack => {
      if (pack.isGateBoss && !pack.displayName) {
        pack.displayName = getRandomBossName(usedNames);
        usedNames.add(pack.displayName);
      }
    });
    
    return dungeon;
  }, []);
  
  // Randomize gate boss positions on mount and assign boss names
  const [dungeon, setDungeon] = useState(() => {
    const randomized = randomizeGateBossPositions(SAMPLE_DUNGEON);
    return initializeBossNames(randomized);
  });
  const scaling = calculateKeyScaling(selectedKeyLevel);
  
  // Re-randomize boss positions when starting a new route
  const handleResetDungeon = useCallback(() => {
    const randomized = randomizeGateBossPositions(SAMPLE_DUNGEON);
    setDungeon(initializeBossNames(randomized));
  }, [initializeBossNames]);

  // Section-based auto-scroll: show entire gate sections instead of following player
  // This reduces scrolling and improves performance by scrolling once per gate instead of continuously
  const [lastScrollGate, setLastScrollGate] = useState<1 | 2 | 3 | null>(null);
  
  // Determine which gate the team is currently in based on position
  // Compute directly to avoid temporal dead zone issues with useMemo
  let currentTeamGate: 1 | 2 | 3 = 1;
  if (isRunning && dungeon?.gates && dungeon.gates.length >= 3) {
    const gate2Start = dungeon.gates[1]?.xStart ?? 0;
    const gate3Start = dungeon.gates[2]?.xStart ?? 0;
    const teamX = combatState?.teamPosition?.x ?? 0;
    if (teamX >= gate3Start) {
      currentTeamGate = 3;
    } else if (teamX >= gate2Start) {
      currentTeamGate = 2;
    } else {
      currentTeamGate = 1;
    }
  }
  
  useEffect(() => {
    // Compute currentTeamGate inside effect to avoid dependency issues
    const computedGate: 1 | 2 | 3 = (() => {
      if (!isRunning || !dungeon?.gates || dungeon.gates.length < 3) return 1;
      const gate2Start = dungeon.gates[1]?.xStart ?? 0;
      const gate3Start = dungeon.gates[2]?.xStart ?? 0;
      const teamX = combatState?.teamPosition?.x ?? 0;
      if (teamX >= gate3Start) return 3;
      if (teamX >= gate2Start) return 2;
      return 1;
    })();
    
    if (isRunning && combatState.phase !== 'defeat' && combatState.phase !== 'victory' && mapScrollRef.current && mapContainerRef.current && !isDragging) {
      // Only scroll once when entering a new gate (not continuously following player)
      if (computedGate !== lastScrollGate) {
        const gate = dungeon.gates[computedGate - 1]; // gates array is 0-indexed
        const containerWidth = mapContainerRef.current.clientWidth;
        const scrollWidth = mapScrollRef.current.scrollWidth;
        
        // Calculate scroll position to center the gate section in view
        // We want to show the full gate section, so center it
        const gateCenter = (gate.xStart + gate.xEnd) / 2;
        const targetScroll = Math.max(0, Math.min(
          scrollWidth - containerWidth,
          gateCenter - (containerWidth / 2)
        ));
        
        // Smooth scroll to the gate section (one-time scroll when entering)
        mapScrollRef.current.scrollTo({
          left: targetScroll,
          behavior: 'smooth'
        });
        
        setLastScrollGate(computedGate);
      }
    } else if (!isRunning) {
      // Reset scroll tracking when run ends
      setLastScrollGate(null);
    }
  }, [isRunning, combatState.phase, combatState?.teamPosition?.x, dungeon?.gates, isDragging, lastScrollGate]);
  
  // Initial scroll to gate 1 when run starts
  useEffect(() => {
    if (isRunning && mapScrollRef.current && mapContainerRef.current && lastScrollGate === null) {
      const gate = dungeon.gates[0]; // Gate 1
      const containerWidth = mapContainerRef.current.clientWidth;
      const scrollWidth = mapScrollRef.current.scrollWidth;
      const gateCenter = (gate.xStart + gate.xEnd) / 2;
      const targetScroll = Math.max(0, Math.min(
        scrollWidth - containerWidth,
        gateCenter - (containerWidth / 2)
      ));
      
      mapScrollRef.current.scrollTo({
        left: targetScroll,
        behavior: 'smooth'
      });
      setLastScrollGate(1);
    }
  }, [isRunning, dungeon.gates, lastScrollGate]);

  // Handle mouse drag for scrolling (works even when run is not active)
  const handleMouseDown = (e: React.MouseEvent) => {
    if (mapScrollRef.current) {
      setIsDragging(true);
      setDragStart({
        x: e.clientX,
        scrollLeft: mapScrollRef.current.scrollLeft
      });
    }
  };
  
  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !mapScrollRef.current) return;
    e.preventDefault();
    const x = e.clientX;
    const walk = (dragStart.x - x); // Distance moved
    mapScrollRef.current.scrollLeft = dragStart.scrollLeft + walk;
  };
  
  const handleMouseUp = () => {
    setIsDragging(false);
  };
  
  const handleMouseLeave = () => {
    setIsDragging(false);
  };

  // Reset all state when closing result modal
  const resetRunState = () => {
    // Clear the activated map - it's been consumed
    clearActivatedMap();
    
    setRunResult(null);
    setIsDragging(false);
    setScreenShake(0);
    setTeamFightAnim(0);
    setEnemyFightAnims({});
    setCombatState({
      phase: 'idle',
      currentPullIndex: -1,
      teamPosition: { x: 100, y: 400 },
      enemies: [],
      teamStates: [],
      combatLog: [],
      forcesCleared: 0,
      timeElapsed: 0,
      killedGateBosses: new Set(),
      abilities: initAbilities(),
      bloodlustActive: false,
      bloodlustTimer: 0,
      floatingNumbers: [],
      levelUpAnimations: [],
      lootDrops: [],
      leagueEncounters: []
    });
    // Reset scroll position
    if (mapScrollRef.current) {
      mapScrollRef.current.scrollLeft = 0;
    }
  };

  // Reset screen shake after animation completes
  useEffect(() => {
    if (screenShake > 0) {
      const timer = setTimeout(() => {
        setScreenShake(0);
      }, 300); // Match animation duration
      return () => clearTimeout(timer);
    }
  }, [screenShake]);

  // Simple timer: count seconds since dungeon started
  const [elapsedTime, setElapsedTime] = useState(0);
  
  useEffect(() => {
    if (isRunning && dungeonStartTime !== null && combatState.phase !== 'defeat' && combatState.phase !== 'victory') {
      const timer = setInterval(() => {
        if (!isPaused) {
          const now = Date.now();
          const elapsed = (now - dungeonStartTime) / 1000; // Convert to seconds
          setElapsedTime(elapsed);
        }
      }, 100); // Update every 100ms for smooth display
      return () => clearInterval(timer);
    } else {
      setElapsedTime(0);
    }
  }, [isRunning, isPaused, dungeonStartTime, combatState.phase]);

  // Gate progress calculations (confirmed pulls only)
  const gateForces: Record<1 | 2 | 3, number> = { 1: 0, 2: 0, 3: 0 };
  const gateBossKilled: Record<1 | 2 | 3, boolean> = { 1: false, 2: false, 3: false };
  
  routePulls.forEach(pull => {
    pull.packIds.forEach(packId => {
      const pack = dungeon.enemyPacks.find(p => p.id === packId);
      if (pack) {
        gateForces[pack.gate] += pack.totalForces;
        if (pack.isGateBoss) gateBossKilled[pack.gate] = true;
      }
    });
  });

  // Preview forces (including current pull being created)
  const previewGateForces: Record<1 | 2 | 3, number> = { ...gateForces };
  const previewGateBossKilled: Record<1 | 2 | 3, boolean> = { ...gateBossKilled };
  
  currentPullPacks.forEach(packId => {
    const pack = dungeon.enemyPacks.find(p => p.id === packId);
    if (pack) {
      previewGateForces[pack.gate] += pack.totalForces;
      if (pack.isGateBoss) previewGateBossKilled[pack.gate] = true;
    }
  });

  const gate1Complete = gateForces[1] >= dungeon.gates[0].requiredForces && gateBossKilled[1];
  const gate2Complete = gateForces[2] >= dungeon.gates[1].requiredForces && gateBossKilled[2];
  const unlockedGates: Record<1 | 2 | 3, boolean> = {
    1: true,
    2: gate1Complete,
    3: gate1Complete && gate2Complete
  };

  const totalForces = gateForces[1] + gateForces[2] + gateForces[3];
  // Gate 3 only requires forces (no gate boss - the Final Boss serves that role)
  const gate3Complete = gateForces[3] >= dungeon.gates[2].requiredForces;
  const allGatesComplete = gate1Complete && gate2Complete && gate3Complete;
  // Can only start if we have a map activated
  const canStart = allGatesComplete && team.length > 0 && !isRunning && activatedMap !== null;

  const packsInRoute = routePulls.flatMap(p => p.packIds);


  // Calculate combined radius: 100% for 1 pack, +30% of previous addition for each additional
  // 1 pack = 100%, 2 = 130%, 3 = 139%, 4 = 141.7%, etc.
  const getCombinedRadius = (packs: EnemyPack[]): number => {
    if (packs.length === 0) return 0;
    const baseRadius = Math.max(...packs.map(p => p.pullRadius));
    let multiplier = 1;
    let addition = 0.3;
    for (let i = 1; i < packs.length; i++) {
      multiplier += addition;
      addition *= 0.3;
    }
    return baseRadius * multiplier;
  };

  const getAvailablePacks = (): string[] => {
    if (!isCreatingPull) return [];
    if (currentPullPacks.length === 0) {
      return dungeon.enemyPacks.filter(p => unlockedGates[p.gate] && !packsInRoute.includes(p.id)).map(p => p.id);
    }
    
    // Get selected packs
    const selectedPacks = currentPullPacks.map(id => dungeon.enemyPacks.find(p => p.id === id)).filter(Boolean) as EnemyPack[];
    if (selectedPacks.length === 0) return [];
    
    // Calculate center of selected packs
    const centerX = selectedPacks.reduce((sum, p) => sum + p.position.x, 0) / selectedPacks.length;
    const centerY = selectedPacks.reduce((sum, p) => sum + p.position.y, 0) / selectedPacks.length;
    
    // Calculate combined radius
    const combinedRadius = getCombinedRadius(selectedPacks);
    
    // Find packs within the combined radius from center
    const available: string[] = [];
    dungeon.enemyPacks.forEach(otherPack => {
      if (currentPullPacks.includes(otherPack.id) || packsInRoute.includes(otherPack.id) || !unlockedGates[otherPack.gate]) return;
      
      // Check if pack center is within combined radius
      const distance = Math.sqrt(Math.pow(otherPack.position.x - centerX, 2) + Math.pow(otherPack.position.y - centerY, 2));
      if (distance <= combinedRadius) {
        available.push(otherPack.id);
      }
    });
    
    return available;
  };

  const availablePacks = getAvailablePacks();

  const getCurrentPullForces = (): number => currentPullPacks.reduce((sum, packId) => {
    const pack = dungeon.enemyPacks.find(p => p.id === packId);
    return sum + (pack?.totalForces || 0);
  }, 0);

  // Set to track collected loot IDs - separate from combatState so combat loop can't overwrite it
  const collectedLootIdsRef = useRef<Set<string>>(new Set());
  
  // Reset collected loot when dungeon run ends
  useEffect(() => {
    if (!isRunning && combatState.phase === 'idle') {
      collectedLootIdsRef.current = new Set();
    }
  }, [isRunning, combatState.phase]);

  // Handle collecting loot from the dungeon map
  const handleCollectLoot = (lootId: string) => {
    // Check if already collected
    if (collectedLootIdsRef.current.has(lootId)) return;
    
    // Find the loot drop in current state
    const lootDrop = combatState.lootDrops.find(l => l.id === lootId);
    if (!lootDrop) return;
    
    // Mark as collected in our ref (combat loop can't touch this)
    collectedLootIdsRef.current.add(lootId);
    
    // Force re-render by updating a simple state
    setCollectedLootCount(prev => prev + 1);
    
    // Add to appropriate stash
    switch (lootDrop.type) {
      case 'item':
        if (lootDrop.item) {
          // Add to inventory first
          addItemToInventory(lootDrop.item);
          
          // Try to auto-place in stash
          const activeTab = stashTabs.find(t => t.id === activeStashTabId);
          if (activeTab) {
            // Get updated inventory from store (includes the item we just added)
            const currentInventory = useGameStore.getState().inventory;
            const itemSize = getItemGridSize(lootDrop.item);
            const grid = buildOccupancyGrid(activeTab.items, currentInventory);
            const position = findAvailablePosition(grid, itemSize);
            
            if (position) {
              // Place item in stash at the found position
              addItemToStash(activeTab.id, lootDrop.item.id, position.x, position.y);
            }
            // If no position found, item is still in inventory but not in stash grid
            // User can manually place it later
          }
        }
        break;
      case 'orb':
        if (lootDrop.orbType) {
          addOrbs({ [lootDrop.orbType]: lootDrop.orbCount || 1 });
        }
        break;
      case 'map':
        if (lootDrop.map) {
          addMap(lootDrop.map);
        }
        break;
      case 'fragment':
        if (lootDrop.fragment) {
          console.log('[DungeonTab] Collecting fragment:', lootDrop.fragment.name);
          addFragment(lootDrop.fragment);
          // Fragment collected silently (no popup)
        }
        break;
    }
  };
  
  // State to trigger re-render when loot is collected
  const [, setCollectedLootCount] = useState(0);
  
  // Add navigation warning when run is active
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (isRunning) {
        e.preventDefault();
        e.returnValue = '';
      }
    };
    
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [isRunning]);
  
  // Filter out collected loot for display
  const visibleLootDrops = combatState.lootDrops.filter(
    drop => !collectedLootIdsRef.current.has(drop.id)
  );

  // Handle engaging a league encounter
  const handleEngageEncounter = useCallback((encounterId: string) => {
    setCombatState(prev => {
      const encounter = prev.leagueEncounters.find(e => e.id === encounterId);
      if (!encounter || encounter.engaged || encounter.completed) return prev;
      
      // Mark as engaged and apply timer penalty
      const updatedEncounters = prev.leagueEncounters.map(e => 
        e.id === encounterId ? { ...e, engaged: true } : e
      );
      
      // Generate bonus loot from the league encounter
      const bonusLoot = generateEnemyLootDrops(
        5000, // Treat as a strong enemy
        'miniboss',
        selectedKeyLevel,
        highestKeyCompleted,
        encounter.position,
        encounter.mechanic.bonusQuantity,
        encounter.mechanic.bonusRarity
      );
      
      // Complete the encounter and add loot after a short delay (simulating the encounter)
      setTimeout(() => {
        setCombatState(innerPrev => {
          const completeEncounters = innerPrev.leagueEncounters.map(e => 
            e.id === encounterId ? { ...e, completed: true } : e
          );
          
          return {
            ...innerPrev,
            leagueEncounters: completeEncounters,
            lootDrops: [...innerPrev.lootDrops, ...bonusLoot],
            combatLog: [...innerPrev.combatLog, {
              timestamp: innerPrev.timeElapsed,
              type: 'loot' as const,
              source: encounter.mechanic.name,
              target: '',
              message: `${encounter.mechanic.icon} ${encounter.mechanic.name} completed! (+${bonusLoot.length} drops)`
            }]
          };
        });
      }, 2000); // 2 second "encounter" duration
      
      return {
        ...prev,
        leagueEncounters: updatedEncounters,
        combatLog: [...prev.combatLog, {
          timestamp: prev.timeElapsed,
          type: 'phase' as const,
          source: '',
          target: '',
          message: `${encounter.mechanic.icon} Engaging ${encounter.mechanic.name}! (-${encounter.mechanic.timerPenalty}s)`
        }]
      };
    });
  }, [selectedKeyLevel, highestKeyCompleted]);

  const handlePackClick = (packId: string) => {
    if (isRunning) return;
    const pack = dungeon.enemyPacks.find(p => p.id === packId);
    if (!pack || packsInRoute.includes(packId) || !unlockedGates[pack.gate]) return;
    
    if (!isCreatingPull) {
      setSelectedPack(selectedPack === packId ? null : packId);
      return;
    }
    
    if (currentPullPacks.includes(packId)) {
      setCurrentPullPacks(currentPullPacks.filter(id => id !== packId));
    } else if (currentPullPacks.length === 0 || availablePacks.includes(packId)) {
      setCurrentPullPacks([...currentPullPacks, packId]);
    }
  };

  // Reset combat state back to default (does NOT reset stop flag - that's handled separately)
  const resetCombatState = (resetStopFlag: boolean = false) => {
    setDungeonStartTime(null);
    setElapsedTime(0);
    setCombatState({
      phase: 'idle',
      currentPullIndex: -1,
      teamPosition: { x: 100, y: 400 },
      enemies: [],
      teamStates: [],
      combatLog: [],
      forcesCleared: 0,
      timeElapsed: 0,
      killedGateBosses: new Set(),
      abilities: initAbilities(),
      bloodlustActive: false,
      bloodlustTimer: 0,
      floatingNumbers: [],
      levelUpAnimations: [],
      lootDrops: [],
      leagueEncounters: []
    });
    setShieldActive(false);
    setStunActive(false);
    setIsPaused(false);
    // Only reset the stop flag when explicitly requested (e.g., when clearing route, not when stopping)
    if (resetStopFlag) {
      combatRef.current.stop = false;
    }
    combatRef.current.paused = false;
  };

  const handleNewPull = () => { if (!isRunning) { setIsCreatingPull(true); setCurrentPullPacks([]); setSelectedPack(null); } };
  const handleConfirmPull = () => {
    if (currentPullPacks.length === 0) return;
    const firstPack = dungeon.enemyPacks.find(p => p.id === currentPullPacks[0]);
    setRoutePulls([...routePulls, { pullNumber: routePulls.length + 1, packIds: [...currentPullPacks], gate: firstPack?.gate || 1 }]);
    setCurrentPullPacks([]); setIsCreatingPull(false);
  };
  const handleCancelPull = () => { setCurrentPullPacks([]); setIsCreatingPull(false); };
  const handleRemovePull = (pullNumber: number) => { if (!isRunning) setRoutePulls(routePulls.filter(p => p.pullNumber !== pullNumber).map((p, i) => ({ ...p, pullNumber: i + 1 }))); };
  const handleClearRoute = () => { 
    if (!isRunning) { 
      setRoutePulls([]); 
      setCurrentPullPacks([]); 
      setIsCreatingPull(false); 
      handleResetDungeon(); 
      resetCombatState(true); // Reset stop flag since we're not mid-run
    } 
  };
  
  const handleAutoRoute = () => {
    if (isRunning) return;
    const newPulls: RoutePull[] = [];
    const usedPacks = new Set<string>();
    
    // Process each gate
    [1, 2, 3].forEach(gateNum => {
      const gate = dungeon.gates[gateNum - 1];
      const requiredForces = gate.requiredForces;
      let currentGateForces = 0;
      let bossPulled = false;
      
      // Get packs for this gate, sorted by x position (left to right)
      const gatePacks = dungeon.enemyPacks
        .filter(p => p.gate === gateNum)
        .sort((a, b) => a.position.x - b.position.x);
      
      // Check if this gate has a boss
      const bossPack = gatePacks.find(p => p.isGateBoss);
      const needsBoss = bossPack !== undefined;
      
      // Create pulls until we meet requirements
      while (true) {
        // Check if we're done with this gate
        const forcesMet = currentGateForces >= requiredForces;
        const bossHandled = !needsBoss || bossPulled;
        if (forcesMet && bossHandled) break;
        
        // Find available packs
        const availablePacks = gatePacks.filter(p => !usedPacks.has(p.id));
        if (availablePacks.length === 0) break;
        
        // Pick which pack to start with
        let startPack: EnemyPack;
        if (needsBoss && !bossPulled && forcesMet) {
          // Forces met but need boss - go get the boss
          startPack = bossPack!;
        } else if (needsBoss && !bossPulled && currentGateForces >= requiredForces * 0.5) {
          // Halfway there and haven't pulled boss - consider getting it
          startPack = bossPack!;
        } else {
          // Normal progression - pick leftmost available
          startPack = availablePacks[0];
        }
        
        // Start the pull
        const pullPacks: string[] = [startPack.id];
        usedPacks.add(startPack.id);
        let pullForces = startPack.totalForces;
        if (startPack.isGateBoss) bossPulled = true;
        
        // Try to combine with ONE nearby pack
        const remainingPacks = availablePacks.filter(p => p.id !== startPack.id);
        const nearbyPack = remainingPacks.find(p => {
          const dist = Math.sqrt(Math.pow(p.position.x - startPack.position.x, 2) + Math.pow(p.position.y - startPack.position.y, 2));
          return dist <= startPack.pullRadius;
        });
        
        if (nearbyPack) {
          // Only add if we still need forces or it's the boss
          const wouldOvershoot = currentGateForces + pullForces + nearbyPack.totalForces > requiredForces + 10;
          if (!wouldOvershoot || nearbyPack.isGateBoss) {
            pullPacks.push(nearbyPack.id);
            usedPacks.add(nearbyPack.id);
            pullForces += nearbyPack.totalForces;
            if (nearbyPack.isGateBoss) bossPulled = true;
          }
        }
        
        currentGateForces += pullForces;
        newPulls.push({ 
          pullNumber: newPulls.length + 1, 
          packIds: pullPacks, 
          gate: gateNum as 1 | 2 | 3 
        });
      }
    });
    
    setRoutePulls(newPulls); 
    setCurrentPullPacks([]); 
    setIsCreatingPull(false);
  };

  // Use ability
  const useAbility = useCallback((abilityId: string) => {
    setCombatState(prev => {
      const ability = prev.abilities.find(a => a.id === abilityId);
      if (!ability || ability.currentCooldown > 0) return prev;
      
      const newAbilities = prev.abilities.map(a => a.id === abilityId ? { ...a, currentCooldown: a.cooldown } : a);
      let newLog = [...prev.combatLog];
      let newTeamStates = [...prev.teamStates];
      
      switch (abilityId) {
        case 'bloodlust':
          newLog.push({ timestamp: prev.timeElapsed, type: 'buff', source: 'Player', target: '', message: '🩸 BLOODLUST! +30% Haste for 15s!' });
          combatRef.current.bloodlustRequest = true;
          combatRef.current.abilityCooldowns['bloodlust'] = 600;
          return { ...prev, abilities: newAbilities, combatLog: newLog, bloodlustActive: true, bloodlustTimer: 15 };
        case 'battlerez':
          const deadMembers = newTeamStates.filter(m => m.isDead);
          if (deadMembers.length > 0) {
            // Pick a random dead member and request resurrection via ref (combat loop will apply it)
            const deadMember = deadMembers[Math.floor(Math.random() * deadMembers.length)];
            combatRef.current.resurrectRequest = deadMember.id;
            combatRef.current.abilityCooldowns['battlerez'] = 240;
            // Find healer to show them casting
            const healer = newTeamStates.find(m => m.role === 'healer' && !m.isDead);
            const healerName = healer?.name || 'Healer';
            newLog.push({ timestamp: prev.timeElapsed, type: 'ability', source: healerName, target: deadMember.name, message: `🙏 ${healerName} begins casting resurrection on ${deadMember.name}...` });
          }
          return { ...prev, abilities: newAbilities, combatLog: newLog };
      }
      return prev;
    });
  }, []);

  const runDungeon = async () => {
    if (!canStart) return;
    
    // Check if route is empty
    if (routePulls.length === 0) {
      console.error('Cannot start dungeon: No route created. Please create a route first.');
      return;
    }
    
    // Capture map context
    const currentMapContext = activatedMap ? {
      mapTier: activatedMap.tier,
      quantityBonus: totalQuantityBonus,
      rarityBonus: totalRarityBonus,
      mapAffixEffects,
      highestMapTierCompleted
    } : undefined;
    
    // Set the start time when dungeon begins
    setDungeonStartTime(Date.now());
    setElapsedTime(0);
    
    // Spawn league encounters for this map
    const leagueEncounters = generateLeagueEncounters(selectedKeyLevel, dungeon.mapWidth, dungeon.mapHeight);
    setCombatState(prev => ({ ...prev, leagueEncounters }));
    
    const result = await runDungeonCombat({
      team,
      inventory,
      dungeon,
      routePulls,
      selectedKeyLevel,
      scaling,
      combatRef,
      combatState,
      shieldActive,
      stunActive,
      callbacks: {
        setCombatState,
        setIsRunning,
        setRunResult,
        setIsPaused,
        setScreenShake,
        setTeamFightAnim,
        setEnemyFightAnims,
        addOrbs,
        completeDungeonRun,
        addKey,
        awardExperience: (characterId: string, experience: number) => {
          const result = addExperienceToCharacter(characterId, experience);
          // Level up animation is now handled in dungeonCombat.ts as floating numbers
          return result;
        },
        applyDeathPenalty: (characterId: string) => {
          // PoE-style death penalty: lose 10% of current level's experience
          applyDeathPenalty(characterId);
        }
      },
      // Pass map context for loot bonuses and affix effects
      mapContext: currentMapContext
    });
    
    if (result) {
      setRunResult(result);
    }
  };

  // Check if we're fighting a boss
  const bossEnemy = combatState.enemies.find(e => (e.type === 'boss' || e.type === 'miniboss') && e.health > 0);

  // Show "no map activated" screen if no map is activated
  if (!activatedMap && !isRunning) {
    return (
      <div style={{
        position: 'relative',
        height: '100%',
        overflow: 'hidden'
      }}>
        {/* Background image from loading screens */}
        <div style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: 'url(/src/assets/loadingscreen3.png)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          opacity: 0.15,
          filter: 'blur(2px)'
        }} />
        
        {/* Dark overlay gradient */}
        <div style={{
          position: 'absolute',
          inset: 0,
          background: 'radial-gradient(ellipse at center, rgba(0,0,0,0.4) 0%, rgba(0,0,0,0.8) 100%)'
        }} />
        
        {/* Content */}
        <div style={{
          position: 'relative',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          height: '100%',
          gap: '1.5rem',
          padding: '3rem',
          zIndex: 1
        }}>
          <h2 style={{
            fontSize: '2rem',
            fontWeight: 700,
            color: 'var(--accent-gold)',
            fontFamily: "'Cinzel', Georgia, serif",
            textAlign: 'center',
            textShadow: '0 0 20px rgba(201, 162, 39, 0.5), 0 2px 4px rgba(0,0,0,0.8)'
          }}>
            No Map Activated
          </h2>
          <p style={{
            fontSize: '0.95rem',
            color: 'rgba(200, 182, 141, 0.8)',
            textAlign: 'center',
            maxWidth: '500px',
            lineHeight: 1.7,
            textShadow: '0 1px 3px rgba(0,0,0,0.9)'
          }}>
          Place a map in the Map Device to begin your dungeon run. 
          Maps can be found in the <strong>Maps</strong> tab.
        </p>
        <button
          onClick={() => setActiveTab('maps')}
          style={{
            padding: '0.75rem 2rem',
            fontSize: '1rem',
            fontWeight: 600,
            background: 'linear-gradient(135deg, var(--accent-gold) 0%, #d4a91e 100%)',
            border: 'none',
            borderRadius: '6px',
            color: 'var(--bg-darkest)',
            cursor: 'pointer',
            boxShadow: '0 0 20px rgba(255, 215, 0, 0.3)',
            transition: 'all 0.2s ease',
            fontFamily: "'Cinzel', Georgia, serif",
            textTransform: 'uppercase',
            letterSpacing: '0.1em'
          }}
        >
          Go to Maps
        </button>
        </div>
        
        {/* Ember effect at bottom */}
        <div className="ember-container" style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: '250px',
          pointerEvents: 'none',
          overflow: 'hidden'
        }}>
          <div className="ember-glow" />
          {/* Generate ember particles with better distribution */}
          {[...Array(20)].map((_, i) => (
            <div
              key={`ember-${i}`}
              className="ember"
              style={{
                '--delay': `${(i * 0.25) + Math.random() * 2}s`,
                '--duration': `${4 + Math.random() * 3}s`,
                '--x-start': `${5 + (i * 4.5) + Math.random() * 2}%`,
                '--x-drift': `${-30 + Math.random() * 60}px`,
                '--scale': `${0.4 + Math.random() * 0.6}`,
                animationDelay: `var(--delay)`
              } as React.CSSProperties}
            />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', height: '100%', overflow: 'hidden', position: 'relative' }}>
      {/* MAIN AREA - 3 Column Layout */}
      <div style={{ display: 'grid', gridTemplateColumns: '280px 1fr 280px', gap: '0.75rem', flex: 1, minHeight: 0, overflow: 'hidden' }}>
        
        {/* LEFT COLUMN - Combat & Log */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', minHeight: 0 }}>
          <CombatPanel 
            isRunning={isRunning} 
            combatState={combatState} 
            enemyFightAnims={enemyFightAnims} 
          />
          {isRunning && combatState.phase === 'combat' && (
            <AbilitiesPanel 
              combatState={combatState} 
              onUseAbility={useAbility} 
            />
          )}
          <CombatLog 
            combatLog={combatState.combatLog}
            isRunning={isRunning}
            onTestCombat={async () => {
              setIsRunningTest(true);
              setTestCombatLog([]);
              setTestResult(null);
              
              // Create stop ref for simulation
              const stopSimulationRef = { current: false };
              
              // Store stop ref so modal can access it
              (window as any).__simulationStopRef = stopSimulationRef;
              
              // Batch log updates to prevent UI freezing
              let logBatch: import('../types/dungeon').CombatLogEntry[] = [];
              let batchTimeout: ReturnType<typeof setTimeout> | null = null;
              
              const flushLogBatch = () => {
                if (logBatch.length > 0) {
                  setTestCombatLog(prev => [...prev, ...logBatch]);
                  logBatch = [];
                }
                if (batchTimeout) {
                  clearTimeout(batchTimeout);
                  batchTimeout = null;
                }
              };
              
              try {
                const result = await runCombatSimulationTest(
                  team, 
                  dungeon, 
                  selectedKeyLevel,
                  (entry) => {
                    logBatch.push(entry);
                    // Flush batch every 50ms or when it reaches 50 entries
                    if (logBatch.length >= 50) {
                      flushLogBatch();
                    } else if (!batchTimeout) {
                      batchTimeout = setTimeout(flushLogBatch, 50);
                    }
                  },
                  stopSimulationRef
                );
                
                // Flush any remaining logs
                flushLogBatch();
                
                setTestResult(result);
              } catch (error) {
                console.error('Simulation error:', error);
                flushLogBatch();
              } finally {
                setIsRunningTest(false);
                delete (window as any).__simulationStopRef;
              }
            }}
          />
          </div>

        {/* CENTER COLUMN - MAP */}
        <div style={{ display: 'flex', flexDirection: 'column', height: '100%', minHeight: 0, minWidth: 0, overflow: 'hidden', gap: '0.5rem' }}>
          <DungeonControls
            isRunning={isRunning}
            isPaused={isPaused}
            combatState={{ ...combatState, timeElapsed: elapsedTime }}
            dungeon={dungeon}
            selectedKeyLevel={selectedKeyLevel}
            highestKeyCompleted={highestKeyCompleted}
            routePulls={routePulls}
            teamLength={team.length}
            activeMap={activatedMap}
            onPauseToggle={() => { combatRef.current.paused = !isPaused; setIsPaused(!isPaused); }}
            onStop={() => { 
              combatRef.current.stop = true; 
              // Create a failure result
              const failureResult: DungeonRunResult = {
                success: false,
                keyLevel: selectedKeyLevel,
                timeElapsed: elapsedTime,
                timeLimit: dungeon.timeLimitSeconds,
                upgradeLevel: 0,
                loot: [],
                orbDrops: {},
                fragmentDrops: [],
                experienceGained: 0,
                deaths: combatState.teamStates.filter(t => t.isDead).length,
                forcesCleared: combatState.forcesCleared,
                forcesRequired: dungeon.requiredForces,
                combatLog: combatState.combatLog,
                failReason: 'wipe',
                mapTier: activatedMap?.tier
              };
              setRunResult(failureResult);
              setIsRunning(false);
            }}
            onStart={runDungeon}
            onKeyLevelChange={() => {}} // No longer needed - level comes from map
          />

          <DungeonMap
            dungeon={dungeon}
            isRunning={isRunning}
            isDragging={isDragging}
            screenShake={screenShake}
            teamFightAnim={teamFightAnim}
            combatState={{ ...combatState, lootDrops: visibleLootDrops }}
            team={team}
            routePulls={routePulls}
            currentPullPacks={currentPullPacks}
            selectedPack={selectedPack}
            availablePacks={availablePacks}
            packsInRoute={packsInRoute}
            unlockedGates={unlockedGates}
            currentTeamGate={currentTeamGate}
            gateForces={gateForces}
            previewGateForces={previewGateForces}
            gateBossKilled={gateBossKilled}
            previewGateBossKilled={previewGateBossKilled}
            isCreatingPull={isCreatingPull}
            onPackClick={handlePackClick}
            onBossClick={(boss) => {
              if (!isRunning) {
                setSelectedBoss(boss);
              }
            }}
            onGateBossClick={(pack) => {
              if (!isRunning) {
                setSelectedBoss(pack);
              }
            }}
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseLeave}
            getCombinedRadius={getCombinedRadius}
            mapContainerRef={mapContainerRef}
            mapScrollRef={mapScrollRef}
            onCollectLoot={handleCollectLoot}
            onEngageEncounter={handleEngageEncounter}
          />

          {isCreatingPull && (
            <div style={{ padding: '0.75rem 1rem', background: 'var(--bg-dark)', borderTop: '2px solid var(--accent-blue)', display: 'flex', alignItems: 'center', gap: '1rem', flexShrink: 0 }}>
              <span style={{ color: 'var(--accent-blue)', fontWeight: 'bold' }}>🔨 Pull #{routePulls.length + 1}</span>
              <span style={{ color: 'var(--text-secondary)' }}>{currentPullPacks.length > 0 ? `${currentPullPacks.length} pack(s): +${getCurrentPullForces()}` : 'Click packs'}</span>
              <div style={{ flex: 1 }} />
              <button className="btn btn-secondary btn-small" onClick={handleCancelPull}>Cancel</button>
              <button className="btn btn-primary btn-small" onClick={handleConfirmPull} disabled={currentPullPacks.length === 0}>✓ Confirm</button>
            </div>
          )}
        </div>

        {/* RIGHT SIDEBAR */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', minHeight: 0, overflow: 'hidden' }}>
          <RoutePlanner
            isRunning={isRunning}
            isCreatingPull={isCreatingPull}
            routePulls={routePulls}
            dungeon={dungeon}
            totalForces={totalForces}
            onAutoRoute={handleAutoRoute}
            onClearRoute={handleClearRoute}
            onNewPull={handleNewPull}
            onRemovePull={handleRemovePull}
          />

          <TeamStatusPanel
            isRunning={isRunning}
            combatState={combatState}
            team={team}
            onBuffTooltip={(text, x, y) => setBuffTooltip({ text, x, y })}
            onClearBuffTooltip={() => setBuffTooltip(null)}
            onStatsHover={(id, x, y) => setHoveredStatsMember({ id, x, y })}
            onStatsLeave={() => setHoveredStatsMember(null)}
            onLevelUpComplete={(characterId) => {
              setCombatState(prev => ({
                ...prev,
                levelUpAnimations: prev.levelUpAnimations.filter(anim => anim.characterId !== characterId)
              }));
            }}
          />
                      </div>
                    </div>

      {runResult && !isRunning && runResult !== null && (
        <ResultModal 
          runResult={runResult} 
          uncollectedLoot={visibleLootDrops}
          onCollectLoot={handleCollectLoot}
          onClose={resetRunState} 
        />
      )}
      
      {/* Loot pickup notifications */}
      <LootNotifications />
      
      {buffTooltip !== null && buffTooltip !== undefined && (
        <BuffTooltip text={buffTooltip.text} x={buffTooltip.x} y={buffTooltip.y} />
      )}
      
      
      {/* Combat Test Modal */}
      {(testResult || isRunningTest) && (
        <CombatTestModal 
          result={testResult} 
          combatLog={testCombatLog} 
          isRunning={isRunningTest} 
          onClose={() => { setTestResult(null); setTestCombatLog([]); setIsRunningTest(false); }}
          onStop={() => { setIsRunningTest(false); }}
        />
      )}
      
      {hoveredStatsMember !== null && hoveredStatsMember !== undefined && (() => {
        const member = combatState.teamStates.find(m => m.id === hoveredStatsMember!.id);
        if (!member) return null;
        return <StatsTooltip member={member} x={hoveredStatsMember!.x} y={hoveredStatsMember!.y} />;
      })()}
      
      {/* Boss Sidebar */}
      <BossSidebar 
        boss={selectedBoss} 
        keyLevel={selectedKeyLevel}
        onClose={() => setSelectedBoss(null)}
      />
    </div>
  );
}
