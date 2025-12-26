import React, { useEffect, useState, RefObject, memo } from 'react';
import { getEnemyById } from '../../types/dungeon';
import { getPackDominantType, getPackMobCount } from '../../utils/combat';
import type { Dungeon, EnemyPack, EnemyType, RoutePull } from '../../types/dungeon';
import type { CombatState } from '../../types/combat';
import type { Character } from '../../types/character';
import dungeonBackground from '../../assets/background.png';
import { GiShieldBash, GiHealthPotion, GiBroadsword, GiSkullCrossedBones } from 'react-icons/gi';
import { FloatingNumbers } from './FloatingNumbers';
import { LootDrops } from './LootDrops';
import { LeagueEncounters } from './LeagueEncounters';
import { getEnemyImage, getEnemyIconComponent, ENEMY_TYPE_COLORS } from '../../utils/enemyImages';
import { getClassById, getClassPortrait, getDefaultDpsPortrait } from '../../types/classes';
import { BOSS_NAMES } from '../../utils/bossNames';
import { getPullNumberForPack, getPullColor } from '../../utils/pullColors';

// Memoized role icons to prevent recreation
const ROLE_ICONS_MEMO = {
  tank: <GiShieldBash />,
  healer: <GiHealthPotion />,
  dps: <GiBroadsword />
};

// Use memoized icons
const ROLE_ICONS_COMPONENTS = ROLE_ICONS_MEMO;

// Extract team marker into separate component to prevent map re-renders when team changes
const TeamMarker = memo(function TeamMarker({
  team,
  combatState,
  isRunning
}: {
  team: Character[];
  combatState: CombatState;
  isRunning: boolean;
}) {
  return (
    <div 
      className={isRunning && combatState.phase === 'combat' ? 'team-fighting' : ''}
      style={{ 
        position: 'absolute', 
        left: 0,
        top: 0,
        transform: `translate(${combatState.teamPosition.x - 30}px, ${combatState.teamPosition.y - 30}px)`,
        zIndex: 25,
        willChange: 'transform',
        // CSS transition for smooth animation during travel (reduces need for frequent state updates)
        transition: combatState.phase === 'traveling' ? 'transform 0.1s linear' : 'none',
        // GPU acceleration for smooth movement
        backfaceVisibility: 'hidden',
        perspective: 1000
      }}
    >
      {/* Outer glow ring */}
      <div style={{
        position: 'absolute',
        width: '100px',
        height: '100px',
        left: '50%',
        top: '50%',
        transform: 'translate(-50%, -50%)',
        borderRadius: '50%',
        background: isRunning && combatState.phase === 'combat'
          ? 'radial-gradient(circle, rgba(160,60,55,0.15) 0%, rgba(160,60,55,0.03) 50%, transparent 70%)'
          : 'radial-gradient(circle, rgba(100,140,120,0.12) 0%, rgba(100,140,120,0.03) 50%, transparent 70%)',
        boxShadow: isRunning && combatState.phase === 'combat'
          ? '0 0 20px rgba(160,60,55,0.25), 0 0 40px rgba(160,60,55,0.1)'
          : '0 0 15px rgba(100,140,120,0.2), 0 0 30px rgba(100,140,120,0.08)',
        animation: isRunning && combatState.phase === 'combat' ? 'pulse 0.8s infinite' : 'none'
      }} />
      
      <div style={{ position: 'relative', width: '80px', height: '80px' }}>
        {team.length > 0 ? team.map((member, idx) => {
          const angle = (idx / team.length) * 2 * Math.PI - Math.PI / 2;
          const radius = team.length === 1 ? 0 : 26;
          const x = 40 + Math.cos(angle) * radius;
          const y = 40 + Math.sin(angle) * radius;
          const memberState = combatState.teamStates.find(m => m.id === member.id);
          const isDead = memberState?.isDead || false;
          const healthPercent = memberState ? (memberState.health / memberState.maxHealth) : 1;
          // Use defaultdps.png for DPS characters without a class
          const portrait = member.classId 
            ? getClassPortrait(member.classId) 
            : (member.role === 'dps' ? getDefaultDpsPortrait() : null);

          const roleColors = {
            tank: { bg: '#4a6a8c', border: '#5a7a9c', glow: 'rgba(74,106,140,0.5)', gradient: 'linear-gradient(135deg, rgba(74,106,140,0.9) 0%, rgba(45,74,92,0.95) 100%)' },
            healer: { bg: '#2d6b3a', border: '#3d7b4a', glow: 'rgba(45,107,58,0.5)', gradient: 'linear-gradient(135deg, rgba(45,107,58,0.9) 0%, rgba(26,74,37,0.95) 100%)' },
            dps: { bg: '#8b5a2b', border: '#9b6a3b', glow: 'rgba(139,90,43,0.5)', gradient: 'linear-gradient(135deg, rgba(139,90,43,0.9) 0%, rgba(92,58,26,0.95) 100%)' }
          };
          const colors = roleColors[member.role];

          return (
            <div
              key={member.id}
              style={{
                position: 'absolute',
                left: `${x}px`,
                top: `${y}px`,
                transform: 'translate(-50%, -50%)',
                width: '36px',
                height: '36px',
                borderRadius: '6px',
                background: isDead
                  ? 'linear-gradient(135deg, rgba(30,30,30,0.95) 0%, rgba(20,20,20,0.98) 100%)'
                  : portrait
                    ? 'rgba(0,0,0,0.4)'
                    : colors.gradient,
                border: `2px solid ${isDead ? 'rgba(80,80,80,0.6)' : colors.border}`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.1rem',
                color: isDead ? '#555' : '#fff',
                boxShadow: isDead
                  ? 'inset 0 2px 4px rgba(0,0,0,0.5)'
                  : `0 2px 8px rgba(0,0,0,0.5), 0 0 8px ${colors.glow}, inset 0 1px 0 rgba(255,255,255,0.1)`,
                opacity: isDead ? 0.6 : 1,
                filter: isDead ? 'grayscale(0.7)' : 'none',
                overflow: 'hidden'
              }}
              title={`${(() => {
                const classData = member.classId ? getClassById(member.classId) : null;
                return classData?.name || member.role.toUpperCase();
              })()} - ${Math.floor(healthPercent * 100)}% HP`}
            >
              {/* Portrait background */}
              {portrait && !isDead && (
                <div style={{
                  position: 'absolute',
                  inset: '-20%',
                  backgroundImage: `url(${portrait})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center 20%',
                  opacity: 0.9
                }} />
              )}
              {/* Fallback icon if no portrait or dead */}
              {(!portrait || isDead) && (
                <span style={{
                  filter: isDead ? 'none' : 'drop-shadow(0 1px 2px rgba(0,0,0,0.6))',
                  position: 'relative',
                  zIndex: 1
                }}>
                  {isDead ? <GiSkullCrossedBones /> : ROLE_ICONS_COMPONENTS[member.role]}
                </span>
              )}
              {/* Health ring indicator */}
              {!isDead && memberState && healthPercent < 1 && (
                <div style={{
                  position: 'absolute',
                  inset: '-3px',
                  borderRadius: '8px',
                  background: `conic-gradient(${healthPercent > 0.5 ? 'rgba(45,107,58,0.8)' : healthPercent > 0.25 ? 'rgba(180,140,50,0.8)' : 'rgba(180,60,50,0.8)'} ${healthPercent * 360}deg, transparent 0deg)`,
                  opacity: 0.7,
                  zIndex: -1,
                  mask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                  maskComposite: 'exclude',
                  WebkitMaskComposite: 'xor',
                  padding: '2px'
                }} />
              )}
              {/* Low health warning pulse */}
              {!isDead && healthPercent < 0.3 && (
                <div style={{
                  position: 'absolute',
                  inset: -2,
                  borderRadius: '8px',
                  border: '2px solid rgba(180,60,50,0.7)',
                  animation: 'pulse 0.5s ease-in-out infinite',
                  boxShadow: '0 0 6px rgba(180,60,50,0.4)'
                }} />
              )}
            </div>
          );
        }) : (
          <div style={{ 
            position: 'absolute',
            left: '50%',
            top: '50%',
            transform: 'translate(-50%, -50%)',
            width: '30px', 
            height: '30px', 
            borderRadius: '50%', 
            background: 'radial-gradient(circle, rgba(52,152,219,0.95) 0%, rgba(41,128,185,1) 100%)',
            border: '2px solid #5dade2',
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            fontSize: '1rem',
            boxShadow: '0 0 10px rgba(52,152,219,0.7)'
          }}>👥</div>
        )}
      </div>
      
      <div style={{ 
        position: 'absolute', 
        bottom: '-20px', 
        left: '50%', 
        transform: 'translateX(-50%)', 
        fontSize: '0.65rem', 
        color: '#5dade2', 
        fontWeight: 'bold', 
        background: 'rgba(0,0,0,0.8)', 
        padding: '2px 8px', 
        borderRadius: '4px',
        whiteSpace: 'nowrap'
      }}>
        {team.length > 0 ? `${team.length} MEMBERS` : 'NO TEAM'}
      </div>
    </div>
  );
}, (prevProps, nextProps) => {
  // Only re-render if team length or IDs change, or combat state changes
  if (prevProps.team.length !== nextProps.team.length) return false;
  if (prevProps.isRunning !== nextProps.isRunning) return false;
  if (prevProps.combatState.phase !== nextProps.combatState.phase) return false;
  if (prevProps.combatState.teamPosition.x !== nextProps.combatState.teamPosition.x) return false;
  if (prevProps.combatState.teamPosition.y !== nextProps.combatState.teamPosition.y) return false;
  
  // Check if team member IDs changed
  const prevIds = new Set(prevProps.team.map(m => m.id));
  const nextIds = new Set(nextProps.team.map(m => m.id));
  if (prevIds.size !== nextIds.size) return false;
  for (const id of prevIds) {
    if (!nextIds.has(id)) return false;
  }
  
  // Check if team states changed
  if (prevProps.combatState.teamStates.length !== nextProps.combatState.teamStates.length) return false;
  for (const prevState of prevProps.combatState.teamStates) {
    const nextState = nextProps.combatState.teamStates.find(s => s.id === prevState.id);
    if (!nextState || nextState.health !== prevState.health || nextState.isDead !== prevState.isDead) {
      return false;
    }
  }
  
  return true; // Props are equal, skip re-render
});

interface DungeonMapProps {
  dungeon: Dungeon;
  isRunning: boolean;
  isDragging: boolean;
  screenShake: number;
  teamFightAnim: number;
  combatState: CombatState;
  team: Character[];
  routePulls: RoutePull[];
  currentPullPacks: string[];
  selectedPack: string | null;
  availablePacks: string[];
  packsInRoute: string[];
  unlockedGates: Record<1 | 2 | 3, boolean>;
  currentTeamGate: 1 | 2 | 3;
  gateForces: Record<1 | 2 | 3, number>;
  previewGateForces: Record<1 | 2 | 3, number>;
  gateBossKilled: Record<1 | 2 | 3, boolean>;
  previewGateBossKilled: Record<1 | 2 | 3, boolean>;
  isCreatingPull: boolean;
  onPackClick: (packId: string) => void;
  onBossClick?: (boss: import('../../types/dungeon').DungeonBoss) => void;
  onGateBossClick?: (pack: import('../../types/dungeon').EnemyPack) => void;
  onMouseDown: (e: React.MouseEvent) => void;
  onMouseMove: (e: React.MouseEvent) => void;
  onMouseUp: () => void;
  onMouseLeave: () => void;
  getCombinedRadius: (packs: EnemyPack[]) => number;
  mapContainerRef: RefObject<HTMLDivElement>;
  mapScrollRef: RefObject<HTMLDivElement>;
  onCollectLoot?: (lootId: string) => void;
  onEngageEncounter?: (encounterId: string) => void;
  activatedMap?: import('../../types/maps').MapItem; // For checking twin boss affix
}

export const DungeonMap = memo(function DungeonMap({
  dungeon,
  isRunning,
  isDragging,
  screenShake,
  teamFightAnim: _teamFightAnim,
  combatState,
  team,
  routePulls,
  currentPullPacks,
  selectedPack,
  availablePacks,
  packsInRoute,
  unlockedGates,
  currentTeamGate,
  gateForces,
  previewGateForces,
  gateBossKilled,
  previewGateBossKilled,
  isCreatingPull,
  activatedMap,
  onPackClick,
  onBossClick,
  onGateBossClick,
  onMouseDown,
  onMouseMove,
  onMouseUp,
  onMouseLeave,
  getCombinedRadius,
  mapContainerRef,
  mapScrollRef,
  onCollectLoot,
  onEngageEncounter
}: DungeonMapProps) {
  // Track scroll position and viewport size for off-screen loot detection
  // PERFORMANCE: Use throttled scroll updates to prevent excessive re-renders
  const [scrollState, setScrollState] = useState({
    scrollLeft: 0,
    scrollTop: 0,
    viewportWidth: 800,
    viewportHeight: 600
  });
  
  // Update scroll state when scroll changes - THROTTLED for performance
  useEffect(() => {
    const scrollEl = mapScrollRef.current;
    const containerEl = mapContainerRef.current;
    
    if (!scrollEl || !containerEl) return;
    
    let rafId: number | null = null;
    let lastUpdateTime = 0;
    const THROTTLE_MS = 50; // Update at most every 50ms (20fps for scroll updates)
    
    const updateScrollState = () => {
      const now = Date.now();
      if (now - lastUpdateTime < THROTTLE_MS) {
        if (rafId === null) {
          rafId = requestAnimationFrame(() => {
            rafId = null;
            updateScrollState();
          });
        }
        return;
      }
      lastUpdateTime = now;
      
      if (scrollEl && containerEl) {
        setScrollState({
          scrollLeft: scrollEl.scrollLeft,
          scrollTop: scrollEl.scrollTop,
          viewportWidth: containerEl.clientWidth,
          viewportHeight: containerEl.clientHeight
        });
      }
    };
    
    // Initial update
    updateScrollState();
    
    // Listen for scroll events with throttling
    scrollEl.addEventListener('scroll', updateScrollState, { passive: true });
    window.addEventListener('resize', updateScrollState, { passive: true });
    
    return () => {
      if (rafId !== null) cancelAnimationFrame(rafId);
      scrollEl.removeEventListener('scroll', updateScrollState);
      window.removeEventListener('resize', updateScrollState);
    };
  }, [mapScrollRef, mapContainerRef]);
  
  // REMOVED: Auto-scroll logic - handled in DungeonTab.tsx to avoid duplicate/conflicting scroll updates

  // Memoize viewport bounds for culling calculations
  const viewportBounds = React.useMemo(() => {
    const margin = 200; // Render margin to prevent pop-in
    return {
      left: scrollState.scrollLeft - margin,
      right: scrollState.scrollLeft + scrollState.viewportWidth + margin,
      top: scrollState.scrollTop - margin,
      bottom: scrollState.scrollTop + scrollState.viewportHeight + margin
    };
  }, [scrollState.scrollLeft, scrollState.scrollTop, scrollState.viewportWidth, scrollState.viewportHeight]);

  // Memoize orbiting icons calculation
  const getOrbitingIcons = React.useCallback((pack: EnemyPack): { image: string | null; name: string; type: EnemyType; enemyId: string }[] => {
    const icons: { image: string | null; name: string; type: EnemyType; enemyId: string }[] = [];
    pack.enemies.forEach(({ enemyId, count }) => {
      const enemy = getEnemyById(enemyId);
      if (!enemy) return;
      // Use display name if available (for gate bosses), otherwise use enemy name
      const displayName = pack.displayName || enemy.name;
      const imagePath = getEnemyImage(displayName);
      for (let i = 0; i < count; i++) icons.push({ image: imagePath, name: displayName, type: enemy.type, enemyId });
    });
    return icons.slice(0, 10);
  }, []);

  // Check if pack is visible in viewport (viewport culling)
  const isPackVisible = React.useCallback((pack: EnemyPack): boolean => {
    const packSize = pack.isGateBoss ? 180 : 100; // Max pack size
    return pack.position.x + packSize >= viewportBounds.left &&
           pack.position.x - packSize <= viewportBounds.right &&
           pack.position.y + packSize >= viewportBounds.top &&
           pack.position.y - packSize <= viewportBounds.bottom;
  }, [viewportBounds]);

  // Memoize visible packs list to prevent recalculating on every render
  const visiblePacks = React.useMemo(() => {
    return dungeon.enemyPacks.filter(pack => isPackVisible(pack));
  }, [dungeon.enemyPacks, isPackVisible]);

  const renderPack = (pack: EnemyPack) => {
    const inRoute = packsInRoute.includes(pack.id);
    const inCurrentPull = currentPullPacks.includes(pack.id);
    const isAvailable = availablePacks.includes(pack.id);
    const isSelected = selectedPack === pack.id;
    const unlocked = unlockedGates[pack.gate];
    const isCurrentTarget = isRunning && combatState.currentPullIndex >= 0 && routePulls[combatState.currentPullIndex]?.packIds.includes(pack.id);
    const dominantType = getPackDominantType(pack);
    const mobCount = getPackMobCount(pack);
    const isGateBoss = pack.isGateBoss;
    
    // Get pull color if this pack is in a route
    const pullNumber = getPullNumberForPack(pack.id, routePulls);
    const pullColor = pullNumber ? getPullColor(pullNumber) : null;
    
    const baseSize = isGateBoss ? 180 : dominantType === 'elite' ? 62 : dominantType === 'miniboss' ? 100 : 54;
    const orbitRadius = baseSize * 0.75;
    
    // Get main image - prefer miniboss/elite, fallback to first enemy
    let mainImage: string | null = null;
    let mainEnemyName: string = '';
    let mainEnemyId: string = '';
    let mainEnemyType: EnemyType = 'normal';
    for (const { enemyId } of pack.enemies) {
      const enemy = getEnemyById(enemyId);
      if (enemy && (enemy.type === 'miniboss' || enemy.type === 'elite')) {
        const displayName = pack.displayName || enemy.name;
        mainImage = getEnemyImage(displayName);
        mainEnemyName = displayName;
        mainEnemyId = enemyId;
        mainEnemyType = enemy.type;
        break;
      }
    }
    if (!mainEnemyId) {
      const firstEnemyId = pack.enemies[0]?.enemyId;
      const firstEnemy = getEnemyById(firstEnemyId);
      if (firstEnemy) {
        const displayName = pack.displayName || firstEnemy.name;
        mainImage = getEnemyImage(displayName);
        mainEnemyName = displayName;
        mainEnemyId = firstEnemyId;
        mainEnemyType = firstEnemy.type;
      }
    }
    
    const orbitingIcons = getOrbitingIcons(pack);

    const pullIndex = routePulls.findIndex(p => p.packIds.includes(pack.id));
    const isDefeated = isRunning && inRoute && pullIndex !== -1 && pullIndex < combatState.currentPullIndex;
    const isInCurrentGate = pack.gate === currentTeamGate;
    const packOpacity = !unlocked ? 0.25 : isDefeated ? 0.35 : (isRunning && !isInCurrentGate) ? 0.3 : 1;
    
    return (
      <div key={pack.id} style={{ position: 'absolute', left: `${pack.position.x}px`, top: `${pack.position.y}px`, transform: 'translate(-50%, -50%)', opacity: packOpacity, transition: 'opacity 0.3s ease', zIndex: isGateBoss ? 9999 : (inCurrentPull || isCurrentTarget ? 15 : 10) }}>
        {!isGateBoss && orbitingIcons.map((orb, i) => {
          const arcSpan = 240;
          const startAngle = -90 - (arcSpan / 2);
          const angleStep = orbitingIcons.length > 1 ? arcSpan / (orbitingIcons.length - 1) : 0;
          const angle = (startAngle + angleStep * i) * (Math.PI / 180);
          const x = Math.cos(angle) * orbitRadius;
          const y = Math.sin(angle) * orbitRadius;
          const iconSize = orb.type === 'miniboss' ? 26 : orb.type === 'elite' ? 22 : 18;
          const typeColors = ENEMY_TYPE_COLORS[orb.type];
          const IconComponent = getEnemyIconComponent(orb.enemyId, orb.type);
          return (
            <div
              key={i}
              style={{
                position: 'absolute',
                left: `${baseSize / 2 + x - iconSize / 2}px`,
                top: `${baseSize / 2 + y - iconSize / 2}px`,
                width: `${iconSize}px`,
                height: `${iconSize}px`,
                borderRadius: '4px',
                background: orb.image ? 'transparent' : typeColors.bg,
                border: orb.image ? 'none' : `1px solid ${typeColors.primary}60`,
                boxShadow: orb.image ? 'none' : `0 2px 4px rgba(0,0,0,0.5), 0 0 6px ${typeColors.glow}`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                pointerEvents: 'none',
                transition: 'transform 0.2s ease, opacity 0.2s ease',
                overflow: 'hidden',
                willChange: 'transform, opacity'
              }}
            >
              {orb.image ? (
                <img
                  src={orb.image}
                  alt={orb.name}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'contain',
                    imageRendering: 'crisp-edges'
                  }}
                />
              ) : (
                <IconComponent
                  style={{
                    width: iconSize * 0.7,
                    height: iconSize * 0.7,
                    color: typeColors.primary,
                    filter: `drop-shadow(0 1px 2px rgba(0,0,0,0.6))`
                  }}
                />
              )}
            </div>
          );
        })}
        
        <div
          style={{
            width: `${baseSize}px`,
            height: `${baseSize}px`,
            borderRadius: isGateBoss ? '0' : '8px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: `${baseSize * 0.5}px`,
            background: isGateBoss
              ? 'transparent'
              : isCurrentTarget
                ? 'linear-gradient(135deg, rgba(160,55,50,0.9) 0%, rgba(120,40,35,0.95) 100%)'
                : inCurrentPull
                  ? 'linear-gradient(135deg, rgba(60,110,65,0.9) 0%, rgba(40,80,45,0.95) 100%)'
                  : inRoute && pullColor
                    ? pullColor.bg
                    : isAvailable && isCreatingPull
                      ? 'linear-gradient(135deg, rgba(180,150,60,0.7) 0%, rgba(140,110,40,0.8) 100%)'
                      : isSelected
                        ? 'linear-gradient(135deg, rgba(180,150,60,0.8) 0%, rgba(140,110,40,0.9) 100%)'
                        : ENEMY_TYPE_COLORS[dominantType].bg,
            border: isGateBoss ? 'none' : `3px solid ${isCurrentTarget ? 'rgba(160,55,50,0.8)' : inCurrentPull ? 'rgba(60,110,65,0.8)' : inRoute && pullColor ? pullColor.border : isAvailable && isCreatingPull ? 'rgba(180,150,60,0.7)' : ENEMY_TYPE_COLORS[dominantType].primary}80`,
            boxShadow: isGateBoss
              ? 'none'
              : isCurrentTarget
                ? '0 0 12px rgba(160,55,50,0.5), 0 0 24px rgba(160,55,50,0.2), inset 0 0 8px rgba(0,0,0,0.3)'
                : inCurrentPull
                  ? '0 0 10px rgba(60,110,65,0.4), 0 0 20px rgba(60,110,65,0.15), inset 0 0 6px rgba(0,0,0,0.3)'
                  : inRoute && pullColor
                    ? `${pullColor.shadow}, inset 0 0 6px rgba(0,0,0,0.3)`
                    : `0 4px 12px rgba(0,0,0,0.6), 0 0 6px ${ENEMY_TYPE_COLORS[dominantType].glow}, inset 0 0 6px rgba(0,0,0,0.3)`,
            animation: isCurrentTarget ? 'pulse 0.6s ease-in-out infinite' : 'none',
            position: 'relative',
            zIndex: isGateBoss ? 9999 : (inCurrentPull || isCurrentTarget ? 15 : 10),
            overflow: 'hidden',
            transition: 'transform 0.2s ease, opacity 0.3s ease, box-shadow 0.2s ease',
            cursor: isGateBoss && onGateBossClick && !isRunning && !isCreatingPull 
              ? 'pointer' 
              : isGateBoss && isCreatingPull 
                ? 'pointer' 
                : (!unlocked || inRoute || isRunning ? 'default' : 'pointer'),
            willChange: 'transform, opacity',
            filter: 'none'
          }} 
          onClick={(e) => {
            e.stopPropagation();
            // If creating a pull, always add to route (unless Ctrl/Cmd is held to view boss)
            if (isGateBoss && onGateBossClick && !isRunning && !isCreatingPull) {
              // Normal click on boss when not creating pull - open boss sidebar
              onGateBossClick(pack);
            } else if (isGateBoss && onGateBossClick && !isRunning && isCreatingPull && (e.ctrlKey || e.metaKey)) {
              // Ctrl/Cmd + click on boss while creating pull - open boss sidebar
              onGateBossClick(pack);
            } else {
              // Normal click or creating pull - add to route
              onPackClick(pack.id);
            }
          }}
          onMouseEnter={(e) => {
            if (isGateBoss && onGateBossClick && !isRunning) {
              e.currentTarget.style.transform = 'scale(1.05)';
            }
          }}
          onMouseLeave={(e) => {
            if (isGateBoss && onGateBossClick && !isRunning) {
              e.currentTarget.style.transform = 'scale(1)';
            }
          }}
          title={
            isGateBoss 
              ? isCreatingPull
                ? `${pack.displayName || 'Gate Boss'} (${pack.totalForces} forces) - Click to add to route, Ctrl+Click to view abilities`
                : `${pack.displayName || 'Gate Boss'} (${pack.totalForces} forces) - Click to view abilities`
              : `${pack.enemies.map(e => `${e.count}x ${getEnemyById(e.enemyId)?.name}`).join(', ')} (${pack.totalForces} forces)`
          }
        >
          {/* Inner glow effect */}
          {!isGateBoss && (
            <div style={{
              position: 'absolute',
              inset: 0,
              background: 'radial-gradient(circle at 30% 30%, rgba(255,255,255,0.15) 0%, transparent 50%)',
              pointerEvents: 'none'
            }} />
          )}
          {/* Main image/icon */}
          {mainImage ? (
            <img
              src={mainImage}
              alt={mainEnemyName}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'contain',
                imageRendering: 'crisp-edges',
                filter: isGateBoss
                  ? 'drop-shadow(0 2px 3px rgba(0, 0, 0, 0.5))'
                  : (isCurrentTarget || inCurrentPull)
                    ? 'drop-shadow(0 0 4px rgba(255,255,255,0.5))'
                    : 'none',
                position: 'relative',
                zIndex: 1
              }}
            />
          ) : (
            (() => {
              const MainIconComponent = getEnemyIconComponent(mainEnemyId, mainEnemyType);
              const mainTypeColors = ENEMY_TYPE_COLORS[mainEnemyType];
              return (
                <MainIconComponent
                  style={{
                    width: baseSize * 0.55,
                    height: baseSize * 0.55,
                    color: mainTypeColors.primary,
                    filter: isGateBoss
                      ? 'drop-shadow(0 2px 3px rgba(0, 0, 0, 0.5))'
                      : (isCurrentTarget || inCurrentPull)
                        ? `drop-shadow(0 0 6px ${mainTypeColors.glow})`
                        : `drop-shadow(0 1px 2px rgba(0,0,0,0.5))`,
                    position: 'relative',
                    zIndex: 1
                  }}
                />
              );
            })()
          )}
          {/* Animated ring for current target */}
          {isCurrentTarget && (
            <div style={{
              position: 'absolute',
              inset: -4,
              border: '2px solid rgba(239,68,68,0.6)',
              borderRadius: '14px',
              animation: 'pulse 1s ease-in-out infinite'
            }} />
          )}
        </div>
        
        {/* Pack info label */}
        {!isGateBoss && (
          <div style={{
            position: 'absolute',
            top: `${baseSize + 6}px`,
            left: '50%',
            transform: 'translateX(-50%)',
            background: 'linear-gradient(180deg, rgba(15,12,10,0.95) 0%, rgba(10,8,6,0.98) 100%)',
            padding: '3px 8px',
            borderRadius: '4px',
            fontSize: '0.65rem',
            fontWeight: '600',
            color: '#c8b88a',
            border: `1px solid ${pullColor ? pullColor.border : ENEMY_TYPE_COLORS[dominantType].primary + '40'}`,
            boxShadow: pullColor ? pullColor.shadow : `0 2px 6px rgba(0,0,0,0.5), 0 0 4px ${ENEMY_TYPE_COLORS[dominantType].glow}`,
            whiteSpace: 'nowrap',
            pointerEvents: 'none',
            display: 'flex',
            alignItems: 'center',
            gap: '4px'
          }}>
            {pullNumber && pullColor && (
              <>
                <span style={{ 
                  color: pullColor.primary, 
                  fontWeight: 700,
                  fontSize: '0.7rem',
                  textShadow: `0 0 4px ${pullColor.glow}`
                }}>#{pullNumber}</span>
                <span style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.5rem' }}>•</span>
              </>
            )}
            <span style={{ color: ENEMY_TYPE_COLORS[dominantType].primary, opacity: 0.9 }}>{mobCount}</span>
            <span style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.5rem' }}>•</span>
            <span style={{
              color: pack.totalForces >= 4 ? '#d4a84b' : pack.totalForces >= 2 ? '#7cb87c' : '#6b9ec4',
              fontWeight: 700
            }}>
              +{pack.totalForces}
            </span>
          </div>
        )}
      </div>
    );
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden', flex: 1, minHeight: 0, borderRadius: '2px', border: '1px solid rgba(90, 70, 50, 0.4)' }}>
      <div ref={mapContainerRef} className={`${screenShake > 0 ? 'screen-shake' : ''} ${isRunning && combatState.phase === 'combat' ? 'combat-glow' : ''}`} style={{ flex: 1, overflow: 'hidden', position: 'relative' }}>
        <div 
          ref={mapScrollRef} 
          onMouseDown={onMouseDown}
          onMouseMove={onMouseMove}
          onMouseUp={onMouseUp}
          onMouseLeave={onMouseLeave}
          style={{ 
            width: '100%', 
            height: '100%', 
            overflowX: 'auto', 
            overflowY: 'auto', 
            scrollBehavior: 'smooth',
            cursor: isDragging ? 'grabbing' : 'grab',
            userSelect: 'none',
            // PERFORMANCE: GPU-accelerated scrolling
            willChange: 'scroll-position',
            // Enable hardware acceleration for smoother scrolling
            transform: 'translateZ(0)',
            WebkitOverflowScrolling: 'touch' // Smooth scrolling on iOS
          }}
        >
          <div style={{ width: `${dungeon.mapWidth}px`, height: `${dungeon.mapHeight}px`, position: 'relative', background: 'linear-gradient(135deg, #050504 0%, #0f0d0b 50%, #050504 100%)' }}>
            {/* Dungeon background image overlay */}
            <div style={{ position: 'absolute', inset: 0, backgroundImage: `url(${dungeonBackground})`, backgroundSize: 'cover', backgroundPosition: 'center', opacity: 0.125, pointerEvents: 'none' }} />
            <div style={{ position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)', backgroundSize: '50px 50px', pointerEvents: 'none' }} />

            {/* Gate Progress - Sleek 2-line design */}
            {dungeon.gates.map((gate, i) => {
              const gateNum = (i + 1) as 1 | 2 | 3;
              const forces = gateForces[gateNum];
              const previewForces = previewGateForces[gateNum];
              const bossKilled = gateBossKilled[gateNum];
              const previewBossKilled = previewGateBossKilled[gateNum];
              const percent = Math.min(100, (forces / gate.requiredForces) * 100);
              const previewPercent = Math.min(100, (previewForces / gate.requiredForces) * 100);
              const hasPreview = isCreatingPull && previewForces > forces;
              const previewBossChange = isCreatingPull && previewBossKilled && !bossKilled;
              const hasGateBoss = gate.bossPackId !== '';
              const isComplete = percent >= 100 && (hasGateBoss ? bossKilled : true);
              const wouldBeComplete = previewPercent >= 100 && (hasGateBoss ? previewBossKilled : true);
              const unlocked = unlockedGates[gateNum];
              
              const isCurrentGate = gateNum === currentTeamGate;
              const panelOpacity = !unlocked ? 0.25 : (isRunning && !isCurrentGate) ? 0.3 : 1;
              const accentColor = isComplete ? '#22c55e' : hasPreview ? '#60a5fa' : unlocked ? '#fbbf24' : '#4b5563';
              
              return (
                <div 
                  key={gate.id} 
                  style={{ 
                    position: 'absolute', 
                    left: `${gate.xStart + 20}px`, 
                    top: '12px', 
                    width: `${gate.xEnd - gate.xStart - 40}px`, 
                    background: 'linear-gradient(180deg, rgba(15,15,20,0.95) 0%, rgba(10,10,15,0.9) 100%)', 
                    borderRadius: '8px', 
                    padding: '8px 12px', 
                    border: `1px solid ${accentColor}50`,
                    boxShadow: `0 0 12px ${accentColor}20, inset 0 1px 0 rgba(255,255,255,0.05)`,
                    opacity: panelOpacity, 
                    zIndex: 20, 
                    transition: 'all 0.3s ease',
                    backdropFilter: 'blur(8px)'
                  }}
                >
                  {/* Line 1: Gate name + Progress bar + Forces count */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
                    <span style={{ 
                      fontWeight: 700, 
                      color: accentColor, 
                      fontSize: '0.75rem',
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em',
                      whiteSpace: 'nowrap',
                      textShadow: `0 0 8px ${accentColor}40`
                    }}>
                      {unlocked ? '' : '🔒 '}{gate.name}
                    </span>
                    <div style={{ 
                      flex: 1, 
                      height: '6px', 
                      background: 'rgba(0,0,0,0.5)', 
                      borderRadius: '3px', 
                      overflow: 'hidden', 
                      position: 'relative',
                      border: '1px solid rgba(255,255,255,0.1)'
                    }}>
                      <div style={{ 
                        position: 'absolute', 
                        height: '100%', 
                        width: `${percent}%`, 
                        background: percent >= 100 
                          ? 'linear-gradient(90deg, #22c55e 0%, #16a34a 100%)' 
                          : 'linear-gradient(90deg, #fbbf24 0%, #f59e0b 100%)', 
                        transition: 'width 0.3s ease',
                        boxShadow: `0 0 6px ${percent >= 100 ? '#22c55e' : '#fbbf24'}50`
                      }} />
                      {hasPreview && (
                        <div style={{ 
                          position: 'absolute', 
                          height: '100%', 
                          left: `${percent}%`,
                          width: `${previewPercent - percent}%`, 
                          background: 'repeating-linear-gradient(90deg, #60a5fa 0px, #60a5fa 3px, transparent 3px, transparent 6px)',
                          transition: 'width 0.2s',
                          animation: 'pulse 1s ease-in-out infinite'
                        }} />
                      )}
                    </div>
                    <span style={{ 
                      fontSize: '0.7rem', 
                      fontWeight: 600,
                      fontFamily: 'monospace',
                      color: hasPreview ? '#60a5fa' : percent >= 100 ? '#22c55e' : '#fff',
                      minWidth: '55px', 
                      textAlign: 'right',
                      textShadow: hasPreview || percent >= 100 ? `0 0 6px currentColor` : 'none'
                    }}>
                      {hasPreview ? `${forces}→${previewForces}` : `${forces}/${gate.requiredForces}`}
                    </span>
                  </div>
                  
                  {/* Line 2: Boss status + Gate status indicator */}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      {hasGateBoss ? (
                        <>
                          <span style={{ fontSize: '0.65rem', color: '#6b7280' }}>BOSS:</span>
                          <span style={{ 
                            fontSize: '0.7rem', 
                            fontWeight: 600,
                            color: previewBossChange ? '#60a5fa' : bossKilled ? '#22c55e' : '#ef4444',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '3px'
                          }}>
                            {bossKilled ? '✓ Defeated' : previewBossChange ? '⚔️ Targeted' : '✗ Alive'}
                          </span>
                        </>
                      ) : (
                        <span style={{ fontSize: '0.65rem', color: '#9ca3af', fontStyle: 'italic' }}>
                          👑 Final Boss Zone
                        </span>
                      )}
                    </div>
                    <span style={{ 
                      fontSize: '0.6rem', 
                      padding: '2px 6px',
                      borderRadius: '4px',
                      fontWeight: 600,
                      background: isComplete 
                        ? 'rgba(34,197,94,0.2)' 
                        : wouldBeComplete 
                          ? 'rgba(96,165,250,0.2)' 
                          : 'rgba(255,255,255,0.05)',
                      color: isComplete ? '#22c55e' : wouldBeComplete ? '#60a5fa' : '#6b7280',
                      border: `1px solid ${isComplete ? '#22c55e30' : wouldBeComplete ? '#60a5fa30' : 'transparent'}`
                    }}>
                      {isComplete ? '✓ CLEAR' : wouldBeComplete ? '✨ READY' : `GATE ${gateNum}`}
                    </span>
                  </div>
                </div>
              );
            })}

            {/* Floating damage / healing numbers */}
            <FloatingNumbers 
              floatingNumbers={combatState.floatingNumbers} 
              teamPosition={combatState.teamPosition} 
            />
            
            {/* Loot drops on the map */}
            {combatState.lootDrops && combatState.lootDrops.length > 0 && onCollectLoot && (
              <LootDrops
                lootDrops={combatState.lootDrops}
                teamPosition={combatState.teamPosition}
                onCollectLoot={onCollectLoot}
                mapWidth={dungeon.mapWidth}
                mapHeight={dungeon.mapHeight}
                scrollLeft={scrollState.scrollLeft}
                scrollTop={scrollState.scrollTop}
                viewportWidth={scrollState.viewportWidth}
                viewportHeight={scrollState.viewportHeight}
              />
            )}
            
            {/* League encounters on the map */}
            {combatState.leagueEncounters && combatState.leagueEncounters.length > 0 && onEngageEncounter && (
              <LeagueEncounters
                encounters={combatState.leagueEncounters}
                teamPosition={combatState.teamPosition}
                onEngageEncounter={onEngageEncounter}
                isRunning={isRunning}
              />
            )}

            {/* Gate Dividers */}
            {[1200, 2400].map((x, i) => (<div key={i} style={{ position: 'absolute', left: `${x}px`, top: 0, bottom: 0, width: '4px', background: `linear-gradient(180deg, transparent 0%, ${unlockedGates[(i + 2) as 2 | 3] ? '#d4a84b' : '#333'} 10%, ${unlockedGates[(i + 2) as 2 | 3] ? '#d4a84b' : '#333'} 90%, transparent 100%)`, zIndex: 5 }} />))}

            {/* Route Lines */}
            <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 3 }}>
              {routePulls.map((pull, idx) => {
                const packs = pull.packIds.map(id => dungeon.enemyPacks.find(p => p.id === id)).filter(Boolean) as EnemyPack[];
                if (packs.length === 0) return null;
                const currX = packs.reduce((s, p) => s + p.position.x, 0) / packs.length;
                const currY = packs.reduce((s, p) => s + p.position.y, 0) / packs.length;
                let prevX = 100, prevY = 400;
                if (idx > 0) { const prevPacks = routePulls[idx - 1].packIds.map(id => dungeon.enemyPacks.find(p => p.id === id)).filter(Boolean) as EnemyPack[]; if (prevPacks.length > 0) { prevX = prevPacks.reduce((s, p) => s + p.position.x, 0) / prevPacks.length; prevY = prevPacks.reduce((s, p) => s + p.position.y, 0) / prevPacks.length; } }
                const teamX = combatState.teamPosition.x;
                const teamY = combatState.teamPosition.y;
                const isTraveling = isRunning && combatState.phase === 'traveling';
                const isNearLine = isTraveling && (() => {
                  const A = teamX - prevX;
                  const B = teamY - prevY;
                  const C = currX - prevX;
                  const D = currY - prevY;
                  const dot = A * C + B * D;
                  const lenSq = C * C + D * D;
                  let param = lenSq !== 0 ? dot / lenSq : -1;
                  if (param < 0) param = 0;
                  if (param > 1) param = 1;
                  const xx = prevX + param * C;
                  const yy = prevY + param * D;
                  const dx = teamX - xx;
                  const dy = teamY - yy;
                  const distance = Math.sqrt(dx * dx + dy * dy);
                  return distance < 80 && teamX >= Math.min(prevX, currX) - 50 && teamX <= Math.max(prevX, currX) + 50;
                })();
                
                return (
                  <line
                    key={idx}
                    x1={prevX}
                    y1={prevY}
                    x2={currX}
                    y2={currY}
                    stroke={isNearLine ? "#c9a855" : "#9a8045"}
                    strokeWidth={isNearLine ? "3" : "2"}
                    strokeDasharray="8,6"
                    opacity={isNearLine ? "0.9" : "0.5"}
                    style={{
                      transition: 'stroke 0.3s ease, stroke-width 0.3s ease, opacity 0.3s ease',
                      filter: isNearLine ? 'drop-shadow(0 0 4px rgba(180, 150, 70, 0.5))' : 'none'
                    }}
                  />
                );
              })}
            </svg>

            {/* Radius Preview */}
            {(() => {
              const packIds = currentPullPacks.length > 0 ? currentPullPacks : (selectedPack ? [selectedPack] : []);
              if (packIds.length === 0) return null;
              
              const packs = packIds.map(id => dungeon.enemyPacks.find(p => p.id === id)).filter(Boolean) as EnemyPack[];
              if (packs.length === 0) return null;
              
              const centerX = packs.reduce((sum, p) => sum + p.position.x, 0) / packs.length;
              const centerY = packs.reduce((sum, p) => sum + p.position.y, 0) / packs.length;
              const combinedRadius = getCombinedRadius(packs);
              
              return (
                <div style={{ 
                  position: 'absolute', 
                  left: `${centerX}px`, 
                  top: `${centerY}px`, 
                  width: `${combinedRadius * 2}px`, 
                  height: `${combinedRadius * 2}px`, 
                  transform: 'translate(-50%, -50%)', 
                  borderRadius: '50%', 
                  background: `radial-gradient(circle, rgba(212,168,75,${0.15 + packs.length * 0.03}) 0%, rgba(212,168,75,0.05) 60%, transparent 100%)`, 
                  border: `2px dashed rgba(212,168,75,${0.4 + packs.length * 0.1})`, 
                  pointerEvents: 'none', 
                  zIndex: 4,
                  transition: 'all 0.2s ease-out'
                }} />
              );
            })()}

            {/* PERFORMANCE: Only render packs visible in viewport */}
            {visiblePacks.map(pack => renderPack(pack))}

            {/* Final Boss - Simplified icon only */}
            {dungeon.bosses.map(boss => {
              const bossInCurrentGate = boss.gate === currentTeamGate;
              const bossOpacity = !unlockedGates[boss.gate] ? 0.25 : (isRunning && !bossInCurrentGate) ? 0.3 : 1;
              // Use displayName if available, otherwise fall back to enemy.name
              // Final boss should always have a displayName assigned
              // If not, it means initializeBossNames hasn't run yet
              const bossDisplayName = boss.displayName || boss.enemy.name;
              const bossImage = getEnemyImage(bossDisplayName);
              
              // Check if map has twinned affix
              const isTwinBoss = activatedMap?.affixes.some(affix => 
                affix.effects.some(effect => effect.type === 'twinBoss')
              ) || false;
              
              // Get second boss name if twinned - use deterministic selection based on first boss name
              let secondBossName: string | null = null;
              if (isTwinBoss) {
                // Create a simple hash from the first boss name to deterministically select second boss
                // This ensures consistency across renders
                const usedNames = new Set([bossDisplayName]);
                const availableNames = BOSS_NAMES.filter(name => !usedNames.has(name));
                if (availableNames.length > 0) {
                  // Use character codes from boss name to create a deterministic index
                  let hash = 0;
                  for (let i = 0; i < bossDisplayName.length; i++) {
                    hash = ((hash << 5) - hash) + bossDisplayName.charCodeAt(i);
                    hash = hash & hash; // Convert to 32-bit integer
                  }
                  const index = Math.abs(hash) % availableNames.length;
                  secondBossName = availableNames[index];
                } else {
                  // Fallback if all names are used
                  secondBossName = BOSS_NAMES[0];
                }
              }
              const secondBossImage = secondBossName ? getEnemyImage(secondBossName) : null;
              
              // Debug: log if image not found or displayName not set
              if (import.meta.env.DEV) {
                if (!boss.displayName) {
                  console.warn('[DungeonMap] Final boss missing displayName, using enemy.name:', boss.enemy.name);
                }
                if (!bossImage && bossDisplayName) {
                  console.warn('[DungeonMap] Final boss image not found for:', bossDisplayName);
                }
                if (isTwinBoss && secondBossName && !secondBossImage) {
                  console.warn('[DungeonMap] Twin boss image not found for:', secondBossName);
                }
              }
              
              return (
                <div 
                  key={boss.id} 
                  onClick={(e) => {
                    e.stopPropagation();
                    if (onBossClick && !isRunning) {
                      onBossClick(boss);
                    }
                  }}
                  style={{ 
                    position: 'absolute', 
                    left: `${boss.position.x}px`, 
                    top: `${boss.position.y}px`, 
                    transform: 'translate(-50%, -50%)', 
                    zIndex: 9999, 
                    opacity: bossOpacity, 
                    transition: 'opacity 0.3s ease',
                    cursor: !isRunning && onBossClick ? 'pointer' : 'default',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: isTwinBoss ? '-60px' : '0' // Overlap for twin bosses
                  }}
                >
                  {/* First boss */}
                  {bossImage ? (
                    <img
                      src={bossImage}
                      alt={bossDisplayName}
                      style={{
                        width: '280px',
                        height: '280px',
                        objectFit: 'contain',
                        imageRendering: 'crisp-edges',
                        filter: 'drop-shadow(0 4px 8px rgba(0, 0, 0, 0.7))',
                        transition: 'transform 0.2s ease',
                        position: 'relative',
                        zIndex: isTwinBoss ? 2 : 1
                      }}
                      onMouseEnter={(e) => {
                        if (!isRunning && onBossClick) {
                          e.currentTarget.style.transform = 'scale(1.1)';
                        }
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = 'scale(1)';
                      }}
                    />
                  ) : (
                    <div
                      style={{
                        fontSize: '18rem',
                        filter: 'drop-shadow(0 4px 8px rgba(0, 0, 0, 0.7))',
                        transition: 'transform 0.2s ease',
                        position: 'relative',
                        zIndex: isTwinBoss ? 2 : 1
                      }}
                      onMouseEnter={(e) => {
                        if (!isRunning && onBossClick) {
                          e.currentTarget.style.transform = 'scale(1.1)';
                        }
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = 'scale(1)';
                      }}
                    >
                      {boss.enemy.icon}
                    </div>
                  )}
                  
                  {/* Second boss (if twinned) */}
                  {isTwinBoss && secondBossName && (
                    secondBossImage ? (
                      <img
                        src={secondBossImage}
                        alt={secondBossName}
                        style={{
                          width: '280px',
                          height: '280px',
                          objectFit: 'contain',
                          imageRendering: 'crisp-edges',
                          filter: 'drop-shadow(0 4px 8px rgba(0, 0, 0, 0.7))',
                          transition: 'transform 0.2s ease',
                          position: 'relative',
                          zIndex: 1,
                          marginLeft: '-60px' // Overlap with first boss
                        }}
                        onMouseEnter={(e) => {
                          if (!isRunning && onBossClick) {
                            e.currentTarget.style.transform = 'scale(1.1)';
                          }
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.transform = 'scale(1)';
                        }}
                      />
                    ) : (
                      <div
                        style={{
                          fontSize: '18rem',
                          filter: 'drop-shadow(0 4px 8px rgba(0, 0, 0, 0.7))',
                          transition: 'transform 0.2s ease',
                          position: 'relative',
                          zIndex: 1,
                          marginLeft: '-60px' // Overlap with first boss
                        }}
                        onMouseEnter={(e) => {
                          if (!isRunning && onBossClick) {
                            e.currentTarget.style.transform = 'scale(1.1)';
                          }
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.transform = 'scale(1)';
                        }}
                      >
                        {boss.enemy.icon}
                      </div>
                    )
                  )}
                </div>
              );
            })}

            {/* Team Marker - extracted to prevent map re-renders */}
            <TeamMarker 
              team={team}
              combatState={combatState}
              isRunning={isRunning}
            />
          </div>
        </div>
      </div>
    </div>
  );
}, (prevProps, nextProps) => {
  // Custom comparison: allow re-render for team changes (TeamMarker needs updates)
  // but optimize to prevent unnecessary re-renders of map tiles
  
  // Compare props that affect map rendering
  if (prevProps.dungeon !== nextProps.dungeon) return false;
  if (prevProps.isRunning !== nextProps.isRunning) return false;
  if (prevProps.isDragging !== nextProps.isDragging) return false;
  if (prevProps.screenShake !== nextProps.screenShake) return false;
  if (prevProps.teamFightAnim !== nextProps.teamFightAnim) return false;
  
  // For combatState, only check properties that affect map rendering (not team states)
  if (prevProps.combatState.phase !== nextProps.combatState.phase) return false;
  if (prevProps.combatState.teamPosition.x !== nextProps.combatState.teamPosition.x) return false;
  if (prevProps.combatState.teamPosition.y !== nextProps.combatState.teamPosition.y) return false;
  if (prevProps.combatState.currentPullIndex !== nextProps.combatState.currentPullIndex) return false;
  if (prevProps.combatState.lootDrops !== nextProps.combatState.lootDrops) return false;
  if (prevProps.combatState.leagueEncounters !== nextProps.combatState.leagueEncounters) return false;
  if (prevProps.combatState.floatingNumbers !== nextProps.combatState.floatingNumbers) return false;
  // Note: combatState.teamStates changes are ignored here - TeamMarker handles those
  
  if (prevProps.routePulls !== nextProps.routePulls) return false;
  if (prevProps.currentPullPacks !== nextProps.currentPullPacks) return false;
  if (prevProps.selectedPack !== nextProps.selectedPack) return false;
  if (prevProps.availablePacks !== nextProps.availablePacks) return false;
  if (prevProps.packsInRoute !== nextProps.packsInRoute) return false;
  if (prevProps.unlockedGates !== nextProps.unlockedGates) return false;
  if (prevProps.currentTeamGate !== nextProps.currentTeamGate) return false;
  if (prevProps.gateForces !== nextProps.gateForces) return false;
  if (prevProps.previewGateForces !== nextProps.previewGateForces) return false;
  if (prevProps.gateBossKilled !== nextProps.gateBossKilled) return false;
  if (prevProps.previewGateBossKilled !== nextProps.previewGateBossKilled) return false;
  if (prevProps.isCreatingPull !== nextProps.isCreatingPull) return false;
  if (prevProps.activatedMap !== nextProps.activatedMap) return false;
  if (prevProps.onPackClick !== nextProps.onPackClick) return false;
  if (prevProps.onBossClick !== nextProps.onBossClick) return false;
  if (prevProps.onGateBossClick !== nextProps.onGateBossClick) return false;
  if (prevProps.onMouseDown !== nextProps.onMouseDown) return false;
  if (prevProps.onMouseMove !== nextProps.onMouseMove) return false;
  if (prevProps.onMouseUp !== nextProps.onMouseUp) return false;
  if (prevProps.onMouseLeave !== nextProps.onMouseLeave) return false;
  if (prevProps.getCombinedRadius !== nextProps.getCombinedRadius) return false;
  if (prevProps.mapContainerRef !== nextProps.mapContainerRef) return false;
  if (prevProps.mapScrollRef !== nextProps.mapScrollRef) return false;
  if (prevProps.onCollectLoot !== nextProps.onCollectLoot) return false;
  if (prevProps.onEngageEncounter !== nextProps.onEngageEncounter) return false;
  
  // Allow team changes to trigger re-render (TeamMarker needs the new prop)
  // React's reconciliation with stable pack keys will prevent tiles from disappearing
  if (prevProps.team !== nextProps.team) return false;
  
  // Props are equal, skip re-render
  return true;
});
