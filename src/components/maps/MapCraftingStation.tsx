import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore, CRAFTING_ORBS, type OrbType } from '../../store/gameStore';
import type { MapItem } from '../../types/maps';
import { getMapBaseById } from '../../types/maps';
import { generateMapName } from '../../types/maps';
import { CurrencyTooltip } from '../shared/CurrencyTooltip';

// Map rarity colors (same as MapTooltip)
const MAP_RARITY_COLORS: Record<string, {
  name: string;
  header: string;
  border: string;
}> = {
  normal: {
    name: '#c8c8c8',
    header: 'linear-gradient(180deg, rgba(100, 100, 100, 0.85) 0%, rgba(60, 60, 60, 0.75) 100%)',
    border: '#5a5a5a',
  },
  magic: {
    name: '#8888ff',
    header: 'linear-gradient(180deg, rgba(50, 50, 120, 0.9) 0%, rgba(30, 30, 80, 0.8) 100%)',
    border: '#4444aa',
  },
  rare: {
    name: '#ffff77',
    header: 'linear-gradient(180deg, rgba(90, 80, 40, 0.9) 0%, rgba(50, 45, 20, 0.85) 100%)',
    border: '#8c7a30',
  },
  corrupted: {
    name: '#dc2626',
    header: 'linear-gradient(180deg, rgba(100, 20, 20, 0.9) 0%, rgba(60, 12, 12, 0.85) 100%)',
    border: '#8b1a1a',
  },
};

// Import orb images
import transmutationOrbImg from '../../assets/orbs/transmutation_original.png';
import alterationOrbImg from '../../assets/orbs/alteration_original.webp';
import augmentationOrbImg from '../../assets/orbs/augmentation_original.png';
import alchemyOrbImg from '../../assets/orbs/alchemy_original.webp';
import chaosOrbImg from '../../assets/orbs/chaos_original.webp';
import exaltedOrbImg from '../../assets/orbs/exalt_original.webp';
import annulmentOrbImg from '../../assets/orbs/annul_original.png';
import scouringOrbImg from '../../assets/orbs/scouring_original.webp';
import regalOrbImg from '../../assets/orbs/regal_original.webp';
import divineOrbImg from '../../assets/orbs/divine_original.webp';

// Map orb types to images
const ORB_IMAGES: Record<OrbType, string> = {
  transmutation: transmutationOrbImg,
  alteration: alterationOrbImg,
  augmentation: augmentationOrbImg,
  alchemy: alchemyOrbImg,
  chaos: chaosOrbImg,
  exalted: exaltedOrbImg,
  annulment: annulmentOrbImg,
  scouring: scouringOrbImg,
  regal: regalOrbImg,
  divine: divineOrbImg,
};

// Separator component for tooltip
function Separator() {
  return (
    <div style={{
      height: '1px',
      margin: '6px 0',
      background: 'linear-gradient(90deg, transparent 0%, rgba(120, 100, 80, 0.6) 15%, rgba(120, 100, 80, 0.6) 85%, transparent 100%)',
    }} />
  );
}

// Map tooltip content component (inline version)
function MapTooltipContent({ map }: { map: MapItem }) {
  const colors = MAP_RARITY_COLORS[map.rarity] || MAP_RARITY_COLORS.normal;
  const mapBase = getMapBaseById(map.baseId);
  const baseName = mapBase?.name || 'Unknown Map';

  return (
    <div style={{
      width: '100%',
      height: '100%',
      fontFamily: "'Cormorant', 'Crimson Text', Georgia, serif",
      display: 'flex',
      flexDirection: 'column',
    }}>
      {/* Header with rarity background */}
      <div style={{
        background: colors.header,
        margin: '-1rem -1rem 8px -1rem',
        padding: '8px 12px',
        borderTopLeftRadius: '6px',
        borderTopRightRadius: '6px',
        borderBottom: `1px solid ${colors.border}`,
      }}>
        <div style={{
          fontSize: '16px',
          fontWeight: 600,
          color: colors.name,
          textAlign: 'center',
          textShadow: '0 2px 4px rgba(0,0,0,0.8)',
          lineHeight: 1.2,
        }}>
          {generateMapName(map)}
        </div>
      </div>

      {/* Map Tier */}
      <div style={{
        fontSize: '12px',
        color: '#9a9a9a',
        textAlign: 'center',
        marginBottom: '6px',
      }}>
        Tier {map.tier} Map
      </div>

      <Separator />

      {/* Base Map Name */}
      <div style={{
        fontSize: '12px',
        color: '#9a9a9a',
        textAlign: 'center',
        fontStyle: 'italic',
        marginBottom: '6px',
      }}>
        {baseName}
      </div>

      {/* Bonuses */}
      {(map.quantityBonus > 0 || map.rarityBonus > 0 || map.packSize > 0) && (
        <>
          <Separator />
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '3px',
            marginBottom: '6px',
          }}>
            {map.quantityBonus > 0 && (
              <div style={{
                fontSize: '12px',
                color: '#22c55e',
                textAlign: 'center',
              }}>
                +{Math.round(map.quantityBonus * 100)}% Item Quantity
              </div>
            )}
            {map.rarityBonus > 0 && (
              <div style={{
                fontSize: '12px',
                color: '#a855f7',
                textAlign: 'center',
              }}>
                +{Math.round(map.rarityBonus * 100)}% Item Rarity
              </div>
            )}
            {map.packSize > 0 && (
              <div style={{
                fontSize: '12px',
                color: '#60a5fa',
                textAlign: 'center',
              }}>
                +{map.packSize}% Monster Pack Size
              </div>
            )}
          </div>
        </>
      )}

      {/* Affixes */}
      {map.affixes.length > 0 && (
        <>
          <Separator />
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '3px',
            marginBottom: '6px',
          }}>
            {map.affixes.map((affix, i) => (
              <div
                key={affix.id || i}
                style={{
                  fontSize: '12px',
                  color: '#82c982',
                  textAlign: 'center',
                  lineHeight: 1.4,
                }}
              >
                {affix.description || affix.name}
              </div>
            ))}
          </div>
        </>
      )}

      {/* Status badges */}
      {map.corrupted && (
        <div style={{ display: 'flex', gap: '4px', justifyContent: 'center', flexWrap: 'wrap', marginTop: '6px' }}>
          <span style={{
            fontSize: '10px',
            fontWeight: 700,
            color: '#f87171',
            padding: '2px 6px',
            background: 'rgba(248, 113, 113, 0.15)',
            border: '1px solid rgba(248, 113, 113, 0.4)',
            borderRadius: '3px',
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
          }}>
            Corrupted
          </span>
        </div>
      )}

      {/* Item Level */}
      <Separator />
      <div style={{
        fontSize: '10px',
        color: '#7a7a7a',
        textAlign: 'center',
        marginTop: '4px',
        fontStyle: 'italic',
      }}>
        Item Level: {map.itemLevel}
      </div>
    </div>
  );
}

// Maps that can be crafted (8 orbs total, 4 per line)
const MAP_CRAFTABLE_ORBS: OrbType[] = [
  'transmutation',
  'alteration',
  'augmentation',
  'regal',
  'scouring',
  'chaos',
  'alchemy',
  'divine',
];

// Helper function to check if an orb can be used on a map
function canUseOrbOnMap(map: MapItem | null, orbType: OrbType): boolean {
  if (!map) return false;
  
  // Corrupted maps can only use scouring
  if (map.corrupted && orbType !== 'scouring') {
    return false;
  }
  
  switch (orbType) {
    case 'transmutation':
      return map.rarity === 'normal';
    case 'alteration':
      return map.rarity === 'magic';
    case 'augmentation':
      return map.rarity === 'magic' && map.affixes.length < 2;
    case 'regal':
      return map.rarity === 'magic';
    case 'scouring':
      return map.rarity !== 'normal' || map.affixes.length > 0;
    case 'chaos':
      return map.rarity === 'rare';
    case 'alchemy':
      return map.rarity === 'normal';
    case 'divine':
      // Divine orbs are not applicable to maps
      return false;
    default:
      return false;
  }
}

interface MapCraftingStationProps {
  isDragging?: boolean;
  heldMapId?: string | null;
  onMapDropped?: () => void;
}

export function MapCraftingStation({ isDragging = false, heldMapId: externalHeldMapId = null, onMapDropped }: MapCraftingStationProps) {
  const {
    mapStash,
    mapDeviceMap,
    orbs,
    applyOrbToMap,
  } = useGameStore();

  const [craftingStationMap, setCraftingStationMap] = useState<MapItem | null>(null);
  const [lastCraftMessage, setLastCraftMessage] = useState<string | null>(null);
  const [hoveredOrb, setHoveredOrb] = useState<{ orbType: OrbType; position: { x: number; y: number } } | null>(null);
  
  // Use external heldMapId
  const heldMapId = externalHeldMapId;
  
  // Track if we're applying an orb to prevent sync loop
  const isApplyingOrb = React.useRef(false);

  // Handle dropping a map into the crafting station
  const handleDropMapInStation = (mapId: string) => {
    const map = mapStash.find(m => m.id === mapId) || mapDeviceMap;
    if (map && map.id === mapId) {
      // Create a copy to work with
      setCraftingStationMap({ ...map });
      // Notify parent that map was dropped
      onMapDropped?.();
    }
  };

  // Sync crafting station map with store when it changes
  useEffect(() => {
    if (craftingStationMap && !isApplyingOrb.current) {
      const updatedMap = mapStash.find(m => m.id === craftingStationMap.id) || mapDeviceMap;
      if (updatedMap && updatedMap.id === craftingStationMap.id) {
        // Always update from store to get latest changes
        // Check if the map actually changed by comparing JSON strings of key properties
        const currentSig = JSON.stringify({
          rarity: craftingStationMap.rarity,
          affixes: craftingStationMap.affixes.map(a => a.id).sort(),
          quantityBonus: craftingStationMap.quantityBonus,
          rarityBonus: craftingStationMap.rarityBonus,
        });
        const updatedSig = JSON.stringify({
          rarity: updatedMap.rarity,
          affixes: updatedMap.affixes.map(a => a.id).sort(),
          quantityBonus: updatedMap.quantityBonus,
          rarityBonus: updatedMap.rarityBonus,
        });
        if (currentSig !== updatedSig) {
          setCraftingStationMap({ ...updatedMap });
        }
      } else {
        // Map was removed from store, clear crafting station
        setCraftingStationMap(null);
      }
    }
  }, [mapStash, mapDeviceMap, craftingStationMap]);

  // Handle dropping an orb onto the map
  const handleDropOrbOnMap = (orbType: OrbType) => {
    if (!craftingStationMap) return;
    if (orbs[orbType] <= 0) {
      setLastCraftMessage(`Not enough ${CRAFTING_ORBS.find(o => o.type === orbType)?.name || orbType} orbs`);
      setTimeout(() => setLastCraftMessage(null), 3000);
      return;
    }

    isApplyingOrb.current = true;
    const result = applyOrbToMap(craftingStationMap.id, orbType);
    
    if (result.success) {
      setLastCraftMessage(result.message);
      setTimeout(() => setLastCraftMessage(null), 3000);
      // Immediately update the local map state from the store after a short delay
      setTimeout(() => {
        isApplyingOrb.current = false;
        const updatedMap = mapStash.find(m => m.id === craftingStationMap.id) || mapDeviceMap;
        if (updatedMap && updatedMap.id === craftingStationMap.id) {
          setCraftingStationMap({ ...updatedMap });
        }
      }, 50);
    } else {
      setLastCraftMessage(result.message);
      setTimeout(() => setLastCraftMessage(null), 3000);
      isApplyingOrb.current = false;
    }
  };



  // Handle removing map from crafting station
  const handleRemoveMap = () => {
    setCraftingStationMap(null);
  };

  // Expose the crafting station map ID so MapsTab can detect when we're dragging from here
  useEffect(() => {
    // Store the crafting station map ID in a way that MapsTab can detect
    (window as any).__craftingStationMapId = craftingStationMap?.id || null;
    return () => {
      (window as any).__craftingStationMapId = null;
    };
  }, [craftingStationMap]);

  return (
    <motion.div 
      className="map-crafting-station"
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      style={{ 
        display: 'flex', 
        flexDirection: 'column', 
        height: '100%', 
        minHeight: 0,
        minWidth: 0,
        background: 'linear-gradient(145deg, rgba(20, 18, 15, 0.98) 0%, rgba(12, 10, 8, 0.99) 100%)',
        borderRadius: '14px',
        border: '1px solid rgba(201, 162, 39, 0.15)',
        boxShadow: `
          0 8px 32px rgba(0,0,0,0.5),
          inset 0 1px 0 rgba(255,255,255,0.03),
          inset 0 -1px 0 rgba(0,0,0,0.3)
        `,
        backdropFilter: 'blur(12px)',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Textured background overlay */}
      <div style={{
        position: 'absolute',
        inset: 0,
        backgroundImage: 'url(/tilebackground.png)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        opacity: 0.025,
        pointerEvents: 'none',
      }} />

      {/* Ambient glow effect */}
      <div style={{
        position: 'absolute',
        top: '-50%',
        left: '-50%',
        width: '200%',
        height: '100%',
        background: 'radial-gradient(ellipse at center, rgba(201, 162, 39, 0.03) 0%, transparent 50%)',
        pointerEvents: 'none',
      }} />

      {/* Corner ornaments */}
      <div style={{ position: 'absolute', top: 8, left: 8, width: 20, height: 20, borderTop: '2px solid #c9a227', borderLeft: '2px solid #c9a227', borderRadius: '6px 0 0 0', pointerEvents: 'none', zIndex: 10, boxShadow: '-2px -2px 8px rgba(201, 162, 39, 0.15)' }} />
      <div style={{ position: 'absolute', top: 8, right: 8, width: 20, height: 20, borderTop: '2px solid #c9a227', borderRight: '2px solid #c9a227', borderRadius: '0 6px 0 0', pointerEvents: 'none', zIndex: 10, boxShadow: '2px -2px 8px rgba(201, 162, 39, 0.15)' }} />
      <div style={{ position: 'absolute', bottom: 8, left: 8, width: 20, height: 20, borderBottom: '2px solid #c9a227', borderLeft: '2px solid #c9a227', borderRadius: '0 0 0 6px', pointerEvents: 'none', zIndex: 10, boxShadow: '-2px 2px 8px rgba(201, 162, 39, 0.15)' }} />
      <div style={{ position: 'absolute', bottom: 8, right: 8, width: 20, height: 20, borderBottom: '2px solid #c9a227', borderRight: '2px solid #c9a227', borderRadius: '0 0 6px 0', pointerEvents: 'none', zIndex: 10, boxShadow: '2px 2px 8px rgba(201, 162, 39, 0.15)' }} />
      
      {/* Header */}
      <div style={{ 
        flexShrink: 0, 
        padding: '1.1rem 1rem',
        background: 'linear-gradient(180deg, rgba(201, 162, 39, 0.1) 0%, rgba(201, 162, 39, 0.02) 100%)',
        borderBottom: '1px solid rgba(201, 162, 39, 0.15)',
        textAlign: 'center',
        position: 'relative',
      }}>
        {/* Top gold line with glow */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '2px',
          background: 'linear-gradient(90deg, transparent 5%, #c9a227 50%, transparent 95%)',
          boxShadow: '0 0 12px rgba(201, 162, 39, 0.4)',
        }} />
        {/* Center diamond decoration */}
        <motion.div 
          animate={{ 
            boxShadow: ['0 0 10px rgba(201, 162, 39, 0.4)', '0 0 20px rgba(201, 162, 39, 0.6)', '0 0 10px rgba(201, 162, 39, 0.4)']
          }}
          transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
          style={{
            position: 'absolute',
            top: '-5px',
            left: '50%',
            transform: 'translateX(-50%) rotate(45deg)',
            width: '10px',
            height: '10px',
            background: 'linear-gradient(135deg, #d4af37 0%, #c9a227 50%, #8b7019 100%)',
            borderRadius: '2px',
          }}
        />
        <h3 style={{
          fontSize: '1rem',
          margin: 0,
          fontFamily: "'Cinzel', Georgia, serif",
          fontWeight: 700,
          color: '#d4af37',
          textTransform: 'uppercase',
          letterSpacing: '0.15em',
          textShadow: '0 0 20px rgba(201, 162, 39, 0.5), 0 2px 4px rgba(0,0,0,0.5)',
        }}>
          Map Crafting
        </h3>
      </div>

      {/* Content */}
      <div style={{
        flex: 1,
        overflow: 'auto',
        padding: '1rem',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        gap: '1rem',
        position: 'relative',
        zIndex: 1,
      }}>
        {/* Map Slot - Show tooltip content instead of map icon */}
        <div style={{
          position: 'relative',
          width: '100%',
          minHeight: '200px',
          background: isDragging && heldMapId
            ? 'rgba(201, 162, 39, 0.15)'
            : 'rgba(0, 0, 0, 0.3)',
          border: `2px ${craftingStationMap ? 'solid' : 'dashed'} ${isDragging && heldMapId ? 'rgba(201, 162, 39, 0.6)' : craftingStationMap ? 'rgba(201, 162, 39, 0.5)' : 'rgba(201, 162, 39, 0.3)'}`,
          borderRadius: '8px',
          display: 'flex',
          alignItems: craftingStationMap ? 'stretch' : 'center',
          justifyContent: craftingStationMap ? 'stretch' : 'center',
          cursor: craftingStationMap ? 'pointer' : 'default',
          transition: 'all 0.2s ease',
          overflow: 'auto',
        }}
        onMouseUp={() => {
          if (isDragging && heldMapId) {
            handleDropMapInStation(heldMapId);
          }
        }}
        onClick={() => {
          if (craftingStationMap && !isDragging) {
            handleRemoveMap();
          }
        }}
        >
          {craftingStationMap ? (
            <div style={{
              position: 'relative',
              width: '100%',
              height: '100%',
              padding: '1rem',
              display: 'flex',
              flexDirection: 'column',
            }}>
              {/* Remove button */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleRemoveMap();
                }}
                style={{
                  position: 'absolute',
                  top: 8,
                  right: 8,
                  width: '24px',
                  height: '24px',
                  background: 'rgba(200, 50, 50, 0.9)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  borderRadius: '4px',
                  color: '#fff',
                  fontSize: '14px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  zIndex: 10,
                }}
                title="Remove map"
              >
                ×
              </button>
              
              {/* Tooltip Content */}
              <MapTooltipContent map={craftingStationMap} />
            </div>
          ) : (
            <div style={{
              textAlign: 'center',
              color: 'rgba(200, 190, 170, 0.5)',
              fontSize: '0.85rem',
            }}>
              Drag a map here
            </div>
          )}
        </div>

        {/* Craft Message */}
        <AnimatePresence>
          {lastCraftMessage && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              style={{
                padding: '0.5rem',
                background: 'rgba(201, 162, 39, 0.2)',
                border: '1px solid rgba(201, 162, 39, 0.4)',
                borderRadius: '4px',
                fontSize: '0.8rem',
                color: '#c9a227',
                textAlign: 'center',
              }}
            >
              {lastCraftMessage}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Currency Orbs */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '0.5rem',
        }}>
          <div style={{
            fontSize: '0.75rem',
            color: '#c8b68d',
            fontWeight: 600,
            marginBottom: '0.25rem',
          }}>
            Currency
          </div>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: '0.5rem',
            justifyItems: 'center',
          }}>
            {MAP_CRAFTABLE_ORBS.map(orbType => {
              const orb = CRAFTING_ORBS.find(o => o.type === orbType);
              const count = orbs[orbType] || 0;
              const hasOrb = count > 0;
              const canUse = canUseOrbOnMap(craftingStationMap, orbType);
              const isUsable = hasOrb && canUse;
              
              return (
                <motion.div
                  key={orbType}
                  whileHover={{ scale: isUsable ? 1.1 : 1 }}
                  whileTap={{ scale: isUsable ? 0.95 : 1 }}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: isUsable ? 'pointer' : 'not-allowed',
                    opacity: isUsable ? 1 : 0.3,
                    gap: '0.25rem',
                  }}
                  onClick={(e) => {
                    e.stopPropagation();
                    if (isUsable) {
                      handleDropOrbOnMap(orbType);
                    }
                  }}
                  onMouseEnter={(e) => {
                    setHoveredOrb({ orbType, position: { x: e.clientX, y: e.clientY } });
                  }}
                  onMouseLeave={() => {
                    setHoveredOrb(null);
                  }}
                  onMouseMove={(e) => {
                    if (hoveredOrb?.orbType === orbType) {
                      setHoveredOrb({ orbType, position: { x: e.clientX, y: e.clientY } });
                    }
                  }}
                >
                  <img
                    src={ORB_IMAGES[orbType]}
                    alt={orb?.name || orbType}
                    style={{
                      width: '40px',
                      height: '40px',
                      objectFit: 'contain',
                      filter: isUsable ? 'none' : 'grayscale(100%)',
                      imageRendering: 'auto',
                    }}
                  />
                  <div style={{
                    fontSize: '0.7rem',
                    color: isUsable ? '#c9a227' : '#666',
                    fontWeight: 600,
                    textShadow: isUsable ? '0 0 4px rgba(201, 162, 39, 0.5)' : 'none',
                  }}>
                    {count}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Currency Tooltip */}
      {hoveredOrb && (
        <CurrencyTooltip
          orbType={hoveredOrb.orbType}
          count={orbs[hoveredOrb.orbType] || 0}
          position={hoveredOrb.position}
        />
      )}
    </motion.div>
  );
}
