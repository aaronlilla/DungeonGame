import { useState, memo, useCallback, useMemo, useEffect, useRef } from 'react';
import type { MapLootDrop } from '../../types/combat';
import { ItemTooltip } from '../shared/ItemTooltip';
import { LootBeam } from './LootBeam';
import { playDropSound } from '../../utils/lootSoundsHowler';
import { useGameStore } from '../../store/gameStore';
import { evaluateItemFilter, getDropStyle } from '../../utils/lootFilterEngine';

interface LootDropsProps {
  lootDrops: MapLootDrop[];
  teamPosition: { x: number; y: number };
  onCollectLoot: (lootId: string) => void;
  mapWidth: number;
  mapHeight: number;
  // Viewport info for detecting off-screen loot
  scrollLeft?: number;
  scrollTop?: number;
  viewportWidth?: number;
  viewportHeight?: number;
}

// PoE-style rarity colors - matching exact PoE filter colors
const RARITY_STYLES: Record<string, { bg: string; text: string; border: string; borderWidth: number }> = {
  // Currency/orbs - gold/orange text (PoE currency style)
  orb: { bg: 'rgba(20, 20, 0, 0.9)', text: '#ebc86e', border: '#ebc86e', borderWidth: 2 },
  // Common items - white text
  common: { bg: 'rgba(30, 30, 30, 0.85)', text: '#c8c8c8', border: '#808080', borderWidth: 1 },
  // Magic items - blue text (PoE magic blue)
  uncommon: { bg: 'rgba(0, 20, 40, 0.9)', text: '#8888ff', border: '#8888ff', borderWidth: 2 },
  // Rare items - yellow text (PoE rare yellow)
  rare: { bg: 'rgba(20, 20, 0, 0.9)', text: '#ffff77', border: '#ffff77', borderWidth: 2 },
  // Epic/Unique - orange/brown text (PoE unique orange)
  epic: { bg: 'rgba(30, 15, 10, 0.9)', text: '#af6025', border: '#af6025', borderWidth: 2 }, 
  // Legendary - purple text (high tier)
  legendary: { bg: 'rgba(25, 10, 40, 0.95)', text: '#b35dff', border: '#b35dff', borderWidth: 3 },
  // Maps - yellow/gold (high value)
  map: { bg: 'rgba(20, 20, 0, 0.95)', text: '#d4af37', border: '#d4af37', borderWidth: 3 },
  // Fragments - purple (PoE fragment style)
  fragment: { bg: 'rgba(20, 10, 35, 0.9)', text: '#911ed4', border: '#911ed4', borderWidth: 2 },
};

// PoE-style orb names
const ORB_NAMES: Record<string, string> = {
  transmutation: 'Orb of Transmutation',
  alteration: 'Orb of Alteration',
  augmentation: 'Orb of Augmentation',
  alchemy: 'Orb of Alchemy',
  chaos: 'Chaos Orb',
  exalted: 'Exalted Orb',
  annulment: 'Orb of Annulment',
  chance: 'Orb of Chance',
  scouring: 'Orb of Scouring',
  regret: 'Orb of Regret',
  divine: 'Divine Orb',
  blessed: 'Blessed Orb',
  chromatic: 'Chromatic Orb',
  jeweller: "Jeweller's Orb",
  fusing: 'Orb of Fusing',
  vaal: 'Vaal Orb',
};

export const LootDrops = memo(function LootDrops({ 
  lootDrops, 
  onCollectLoot,
  scrollLeft = 0,
  scrollTop = 0,
  viewportWidth = 800,
  viewportHeight = 600,
}: LootDropsProps) {
  // Get loot filter from store
  const { lootFilter, lootFilterEnabled, activatedMap } = useGameStore();
  
  // Tooltip state
  const [hoveredDrop, setHoveredDrop] = useState<MapLootDrop | null>(null);
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });
  
  // Track which drops have had sounds played
  const playedSoundsRef = useRef<Set<string>>(new Set());
  
  // Filter to only show uncollected drops, and apply loot filter if enabled
  const visibleDrops = useMemo(() => {
    const uncollected = lootDrops.filter(drop => !drop.collected);
    
    // If loot filter is not enabled or not loaded, show all
    if (!lootFilterEnabled || !lootFilter) {
      return uncollected;
    }
    
    // Apply loot filter
    const areaLevel = activatedMap?.tier || 1;
    return uncollected.filter(drop => {
      const filterResult = evaluateItemFilter(
        drop.item || null,
        drop.orbType || null,
        drop.orbCount || 1,
        drop.map || null,
        drop.fragment || null,
        lootFilter.rules,
        areaLevel
      );
      return filterResult.show;
    });
  }, [lootDrops, lootFilterEnabled, lootFilter, activatedMap]);
  
  // Play sounds for new drops (PoE style)
  useEffect(() => {
    visibleDrops.forEach(drop => {
      if (!playedSoundsRef.current.has(drop.id)) {
        playedSoundsRef.current.add(drop.id);
        // Play sound immediately
        playDropSound(drop.type, drop.rarity);
      }
    });
    
    // Clean up old entries
    const currentIds = new Set(visibleDrops.map(d => d.id));
    playedSoundsRef.current.forEach(id => {
      if (!currentIds.has(id)) {
        playedSoundsRef.current.delete(id);
      }
    });
  }, [visibleDrops]);
  
  if (visibleDrops.length === 0) return null;
  
  const getStyle = (drop: MapLootDrop) => {
    // If loot filter is enabled, use filter styles
    if (lootFilterEnabled && lootFilter) {
      const areaLevel = activatedMap?.tier || 1;
      const filterResult = evaluateItemFilter(
        drop.item || null,
        drop.orbType || null,
        drop.orbCount || 1,
        drop.map || null,
        drop.fragment || null,
        lootFilter.rules,
        areaLevel
      );
      
      if (filterResult.matchedRule) {
        const style = getDropStyle(filterResult);
        return {
          bg: style.backgroundColor,
          text: style.textColor,
          border: style.borderColor,
          borderWidth: style.borderWidth
        };
      }
    }
    
    // Fallback to default styles
    // Special styles for maps and fragments
    if (drop.type === 'map') return RARITY_STYLES.map;
    if (drop.type === 'fragment') return RARITY_STYLES.fragment;
    if (drop.type === 'orb') return RARITY_STYLES.orb;
    
    // Item rarity styles
    return RARITY_STYLES[drop.rarity] || RARITY_STYLES.common;
  };

  const getDropLabel = (drop: MapLootDrop): string => {
    switch (drop.type) {
      case 'map': 
        return drop.map?.name || 'Unknown Map';
      case 'fragment': 
        return drop.fragment?.name || 'Fragment';
      case 'orb': 
        const orbName = ORB_NAMES[drop.orbType || ''] || `Orb of ${(drop.orbType || 'Unknown').charAt(0).toUpperCase() + (drop.orbType || '').slice(1)}`;
        const count = drop.orbCount || 1;
        return count > 1 ? `${count}x ${orbName}` : orbName;
      case 'item': 
        return drop.item?.name || 'Item';
      default: 
        return 'Loot';
    }
  };

  // Get a small icon/indicator for the drop type
  const getDropIndicator = (drop: MapLootDrop): string => {
    switch (drop.type) {
      case 'map': return '🗺️';
      case 'fragment': return '💎';
      case 'orb': return '⚪';
      default: return '';
    }
  };
  
  // PERFORMANCE: Memoize visible area calculations with debouncing to prevent jiggling
  // Use rounded scroll positions to reduce updates when scrolling smoothly
  const visibleArea = useMemo(() => {
    // Round scroll positions to nearest 10px to reduce recalculations during smooth scrolling
    const roundedLeft = Math.floor(scrollLeft / 10) * 10;
    const roundedTop = Math.floor(scrollTop / 10) * 10;
    return {
      left: roundedLeft,
      right: roundedLeft + viewportWidth,
      top: roundedTop,
      bottom: roundedTop + viewportHeight
    };
  }, [Math.floor(scrollLeft / 10), Math.floor(scrollTop / 10), viewportWidth, viewportHeight]);
  
  // Check if drop is off-screen - memoized to prevent recalculations
  const isOffScreen = useCallback((drop: MapLootDrop): 'left' | 'right' | 'top' | 'bottom' | null => {
    const margin = 50; // Some margin before considering it off-screen
    if (drop.position.x < visibleArea.left + margin) return 'left';
    if (drop.position.x > visibleArea.right - margin) return 'right';
    if (drop.position.y < visibleArea.top + margin) return 'top';
    if (drop.position.y > visibleArea.bottom - margin) return 'bottom';
    return null;
  }, [visibleArea]);
  
  // Separate on-screen and off-screen drops - memoized
  const { onScreenDrops, leftOffScreen, rightOffScreen } = useMemo(() => {
    const onScreen: MapLootDrop[] = [];
    const offScreen: { drop: MapLootDrop; direction: 'left' | 'right' | 'top' | 'bottom' }[] = [];
    
    visibleDrops.forEach(drop => {
      const direction = isOffScreen(drop);
      if (direction) {
        offScreen.push({ drop, direction });
      } else {
        onScreen.push(drop);
      }
    });
    
    return {
      onScreenDrops: onScreen,
      leftOffScreen: offScreen.filter(d => d.direction === 'left'),
      rightOffScreen: offScreen.filter(d => d.direction === 'right')
    };
  }, [visibleDrops, isOffScreen]);
  
  // Calculate spread positions for on-screen drops that are close together
  const getSpreadPosition = (drop: MapLootDrop, drops: MapLootDrop[]): { x: number; y: number } => {
    const index = drops.indexOf(drop);
    
    // Count how many drops before this one are at similar position
    // Use larger detection radius to catch more overlaps
    const myIndex = drops.filter((d, i) => {
      if (i >= index) return false;
      const dx = Math.abs(d.position.x - drop.position.x);
      const dy = Math.abs(d.position.y - drop.position.y);
      return dx < 120 && dy < 60;
    }).length;
    
    // Spread vertically - increased spacing (32px) to prevent overlap
    const verticalSpread = myIndex * 32;
    
    return {
      x: drop.position.x,
      y: drop.position.y + verticalSpread
    };
  };
  
  const handleMouseEnter = (drop: MapLootDrop, e: React.MouseEvent) => {
    if (drop.type === 'item' && drop.item) {
      setHoveredDrop(drop);
      setTooltipPos({ x: e.clientX, y: e.clientY });
    }
  };
  
  const handleMouseMove = (e: React.MouseEvent) => {
    if (hoveredDrop) {
      setTooltipPos({ x: e.clientX, y: e.clientY });
    }
  };
  
  const handleMouseLeave = () => {
    setHoveredDrop(null);
  };
  
  // Track collected items for animation
  const [collectedItems, setCollectedItems] = useState<Set<string>>(new Set());
  
  // Handle click - clear tooltip first, then collect
  const handleClick = useCallback((dropId: string) => {
    // Clear tooltip immediately to prevent it from getting stuck
    setHoveredDrop(null);
    
    // Trigger collection animation
    setCollectedItems(prev => new Set([...prev, dropId]));
    
    // Remove from animation set after animation completes
    setTimeout(() => {
      setCollectedItems(prev => {
        const next = new Set(prev);
        next.delete(dropId);
        return next;
      });
    }, 400);
    
    onCollectLoot(dropId);
  }, [onCollectLoot]);
  
  const renderLootLabel = (drop: MapLootDrop, _index: number, isOffScreenItem: boolean = false) => {
    const style = getStyle(drop);
    const label = getDropLabel(drop);
    const indicator = getDropIndicator(drop);
    const isCollected = collectedItems.has(drop.id);
    
    return (
      <div
        key={drop.id}
        onClick={() => handleClick(drop.id)}
        onMouseEnter={(e) => handleMouseEnter(drop, e)}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{
          cursor: 'pointer',
          userSelect: 'none',
          marginBottom: isOffScreenItem ? '2px' : undefined,
        }}
      >
        {/* PoE-style loot label with prominent border */}
        <div
          className={isCollected ? 'loot-collected-animation' : ''}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            padding: '5px 14px',
            background: style.bg,
            border: `${style.borderWidth}px solid ${style.border}`,
            borderRadius: '2px',
            boxShadow: isOffScreenItem 
              ? `0 0 12px ${style.border}40, 0 3px 10px rgba(0,0,0,0.8), inset 0 1px 0 rgba(255,255,255,0.08)` 
              : `0 0 8px ${style.border}30, 0 2px 6px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.08)`,
            whiteSpace: 'nowrap',
            transition: isCollected ? 'none' : 'all 0.15s ease',
            opacity: isCollected ? 0 : (isOffScreenItem ? 0.95 : 1),
            transform: isCollected ? 'scale(1.3)' : 'scale(1)',
          }}
          onMouseEnter={(e) => {
            if (!isCollected) {
              e.currentTarget.style.transform = 'scale(1.08)';
              e.currentTarget.style.boxShadow = `0 0 16px ${style.border}60, 0 4px 12px rgba(0,0,0,0.7), inset 0 1px 0 rgba(255,255,255,0.15)`;
              e.currentTarget.style.opacity = '1';
            }
          }}
          onMouseLeave={(e) => {
            if (!isCollected) {
              e.currentTarget.style.transform = 'scale(1)';
              e.currentTarget.style.boxShadow = isOffScreenItem 
                ? `0 0 12px ${style.border}40, 0 3px 10px rgba(0,0,0,0.8), inset 0 1px 0 rgba(255,255,255,0.08)`
                : `0 0 8px ${style.border}30, 0 2px 6px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.08)`;
              e.currentTarget.style.opacity = isOffScreenItem ? '0.95' : '1';
            }
          }}
        >
          {/* Off-screen indicator arrow */}
          {isOffScreenItem && (
            <span style={{ fontSize: '0.6rem', opacity: 0.7 }}>◀</span>
          )}
          
          {/* Type indicator */}
          {indicator && (
            <span style={{ fontSize: '0.7rem', opacity: 0.9 }}>
              {indicator}
            </span>
          )}
          
          {/* Item name - PoE style with strong text shadow */}
          <span style={{
            color: style.text,
            fontSize: '0.8rem',
            fontWeight: 700,
            fontFamily: '"Fontin", "Palatino Linotype", serif',
            textShadow: `0 0 4px rgba(0,0,0,0.9), 0 2px 4px rgba(0,0,0,0.9), 0 0 8px ${style.border}40`,
            letterSpacing: '0.03em',
          }}>
            {label}
          </span>
        </div>
      </div>
    );
  };
  
  // Group drops by position to calculate beam stacking
  const getBeamIntensity = (drop: MapLootDrop, drops: MapLootDrop[]): number => {
    // Count how many drops are at similar position (within 120x60 px)
    const nearbyDrops = drops.filter(d => {
      const dx = Math.abs(d.position.x - drop.position.x);
      const dy = Math.abs(d.position.y - drop.position.y);
      return dx < 120 && dy < 60;
    });
    
    // More drops = brighter beam (up to 3x intensity)
    return Math.min(nearbyDrops.length * 0.5, 1.5);
  };
  
  return (
    <>
      <style>{`
        @keyframes loot-collected {
          0% {
            transform: scale(1);
            opacity: 1;
          }
          50% {
            transform: scale(1.4);
            opacity: 0.8;
          }
          100% {
            transform: scale(1.3);
            opacity: 0;
          }
        }
        
        .loot-collected-animation {
          animation: loot-collected 0.4s ease-out forwards;
        }
      `}</style>
      
      {/* Light beams for on-screen drops */}
      {onScreenDrops.map((drop, index) => {
        const intensity = getBeamIntensity(drop, onScreenDrops);
        const pos = getSpreadPosition(drop, onScreenDrops);
        
        return (
          <div
            key={`beam-${drop.id}`}
            style={{
              position: 'absolute',
              left: `${pos.x}px`,
              top: `${pos.y}px`,
              transform: 'translate(-50%, -100%)',
              zIndex: 9000 + index,
              width: '60px',
              height: '60px',
            }}
          >
            <LootBeam 
              rarity={drop.rarity}
              type={drop.type}
              intensity={intensity}
              delay={index * 50}
            />
          </div>
        );
      })}
      
      {/* On-screen drops at their actual positions */}
      {onScreenDrops.map((drop, index) => {
        const pos = getSpreadPosition(drop, onScreenDrops);
        
        return (
          <div
            key={drop.id}
            style={{
              position: 'absolute',
              left: `${pos.x}px`,
              top: `${pos.y}px`,
              transform: 'translate(-50%, -50%)',
              zIndex: 10000 + index,
            }}
          >
            {renderLootLabel(drop, index, false)}
          </div>
        );
      })}
      
      {/* Off-screen loot pile - LEFT side */}
      {leftOffScreen.length > 0 && (
        <div
          style={{
            position: 'absolute',
            left: `${visibleArea.left + 10}px`,
            top: `${visibleArea.top + 100}px`,
            zIndex: 10000,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-start',
            maxHeight: `${viewportHeight - 150}px`,
            overflowY: 'auto',
            padding: '4px',
            background: 'rgba(0,0,0,0.6)',
            borderRadius: '4px',
            border: '1px solid rgba(255,255,255,0.1)',
          }}
        >
          <div style={{ 
            fontSize: '0.6rem', 
            color: '#888', 
            marginBottom: '4px',
            display: 'flex',
            alignItems: 'center',
            gap: '4px'
          }}>
            <span>◀</span>
            <span>{leftOffScreen.length} item{leftOffScreen.length > 1 ? 's' : ''} behind</span>
          </div>
          {leftOffScreen.map(({ drop }, index) => renderLootLabel(drop, index, true))}
        </div>
      )}
      
      {/* Off-screen loot pile - RIGHT side */}
      {rightOffScreen.length > 0 && (
        <div
          style={{
            position: 'absolute',
            left: `${visibleArea.right - 10}px`,
            top: `${visibleArea.top + 100}px`,
            transform: 'translateX(-100%)',
            zIndex: 10000,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-end',
            maxHeight: `${viewportHeight - 150}px`,
            overflowY: 'auto',
            padding: '4px',
            background: 'rgba(0,0,0,0.6)',
            borderRadius: '4px',
            border: '1px solid rgba(255,255,255,0.1)',
          }}
        >
          <div style={{ 
            fontSize: '0.6rem', 
            color: '#888', 
            marginBottom: '4px',
            display: 'flex',
            alignItems: 'center',
            gap: '4px'
          }}>
            <span>{rightOffScreen.length} item{rightOffScreen.length > 1 ? 's' : ''} ahead</span>
            <span>▶</span>
          </div>
          {rightOffScreen.map(({ drop }) => {
            const dropStyle = getStyle(drop);
            const dropLabel = getDropLabel(drop);
            return (
            <div
              key={drop.id}
              onClick={() => handleClick(drop.id)}
              onMouseEnter={(e) => handleMouseEnter(drop, e)}
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
              style={{
                cursor: 'pointer',
                userSelect: 'none',
                marginBottom: '2px',
              }}
            >
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '5px 14px',
                  background: dropStyle.bg,
                  border: `${dropStyle.borderWidth}px solid ${dropStyle.border}`,
                  borderRadius: '2px',
                  boxShadow: `0 0 12px ${dropStyle.border}40, 0 3px 10px rgba(0,0,0,0.8), inset 0 1px 0 rgba(255,255,255,0.08)`,
                  whiteSpace: 'nowrap',
                  transition: 'all 0.15s ease',
                  opacity: 0.95,
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'scale(1.08)';
                  e.currentTarget.style.opacity = '1';
                  e.currentTarget.style.boxShadow = `0 0 16px ${dropStyle.border}60, 0 4px 12px rgba(0,0,0,0.7), inset 0 1px 0 rgba(255,255,255,0.15)`;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'scale(1)';
                  e.currentTarget.style.opacity = '0.95';
                  e.currentTarget.style.boxShadow = `0 0 12px ${dropStyle.border}40, 0 3px 10px rgba(0,0,0,0.8), inset 0 1px 0 rgba(255,255,255,0.08)`;
                }}
              >
                {getDropIndicator(drop) && (
                  <span style={{ fontSize: '0.7rem', opacity: 0.9 }}>
                    {getDropIndicator(drop)}
                  </span>
                )}
                <span style={{
                  color: dropStyle.text,
                  fontSize: '0.8rem',
                  fontWeight: 700,
                  fontFamily: '"Fontin", "Palatino Linotype", serif',
                  textShadow: `0 0 4px rgba(0,0,0,0.9), 0 2px 4px rgba(0,0,0,0.9), 0 0 8px ${dropStyle.border}40`,
                  letterSpacing: '0.03em',
                }}>
                  {dropLabel}
                </span>
                <span style={{ fontSize: '0.6rem', opacity: 0.7 }}>▶</span>
              </div>
            </div>
          );})}
        </div>
      )}
      
      {/* Item Tooltip */}
      {hoveredDrop && hoveredDrop.item && (
        <ItemTooltip item={hoveredDrop.item} position={tooltipPos} />
      )}
    </>
  );
});
