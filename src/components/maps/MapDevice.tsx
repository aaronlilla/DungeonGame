import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { MapItem, Fragment } from '../../types/maps';
import { getMapBaseById, FRAGMENT_BASES } from '../../types/maps';
import whiteMap from '../../assets/maps/whitemap.png';
import blueMap from '../../assets/maps/bluemap.png';
import greenMap from '../../assets/maps/greenmap.png';
import purpleMap from '../../assets/maps/purplemap.png';
import blackMap from '../../assets/maps/blackmap.png';

interface MapDeviceProps {
  mapSlot: MapItem | null;
  fragmentSlots: (Fragment | null)[];
  onDropMap: () => void;
  onDropFragment: (slotIndex: number) => void;
  onRemoveMap: () => void;
  onRemoveFragment: (slotIndex: number) => void;
  onClear: () => void;
  onStart: () => void;
  isDragging: boolean;
  draggedItemType: 'map' | 'fragment' | null;
  fragmentCounts?: Record<string, number>;
  onFragmentClick?: (slotIndex: number) => void;
}

export function MapDevice({
  mapSlot,
  fragmentSlots,
  onDropMap,
  onDropFragment,
  onRemoveMap,
  onRemoveFragment,
  onClear: _onClear,
  onStart,
  isDragging,
  draggedItemType,
  fragmentCounts = {},
  onFragmentClick
}: MapDeviceProps) {
  const [shouldShake, setShouldShake] = useState(false);
  const [shakenFragmentSlots, setShakenFragmentSlots] = useState<Set<number>>(new Set());
  const previousMapSlot = React.useRef<MapItem | null>(null);
  const previousFragmentSlots = React.useRef<(Fragment | null)[]>([]);

  // Trigger animations when map is slotted or changed
  useEffect(() => {
    if (mapSlot && (!previousMapSlot.current || previousMapSlot.current.id !== mapSlot.id)) {
      // Map was just added or replaced
      setShouldShake(true);
      setTimeout(() => setShouldShake(false), 400);
    }
    previousMapSlot.current = mapSlot;
  }, [mapSlot]);

  // Trigger animations when fragments are slotted
  useEffect(() => {
    const newShakenSlots = new Set<number>();
    
    fragmentSlots.forEach((fragment, index) => {
      const prevFragment = previousFragmentSlots.current[index];
      if (fragment && (!prevFragment || prevFragment.id !== fragment.id)) {
        newShakenSlots.add(index);
      }
    });
    
    if (newShakenSlots.size > 0) {
      setShakenFragmentSlots(newShakenSlots);
      setTimeout(() => setShakenFragmentSlots(new Set()), 400);
    }
    previousFragmentSlots.current = [...fragmentSlots];
  }, [fragmentSlots]);

  /**
   * Get the map item image based on tier
   * Tier 1-15: white, 16-30: blue, 31-45: green, 46-60: purple, 61+: black
   */
  const getMapItemImage = (tier: number): string => {
    if (tier <= 15) return whiteMap;
    if (tier <= 30) return blueMap;
    if (tier <= 45) return greenMap;
    if (tier <= 60) return purpleMap;
    return blackMap;
  };
  const canStart = mapSlot !== null;

  return (
    <>
      {/* Main Map Device Container */}
      <motion.div
        animate={shouldShake ? {
          x: [0, -4, 4, -3, 3, -2, 2, 0],
          y: [0, -2, 2, -1.5, 1.5, -1, 1, 0],
        } : {}}
        transition={{ duration: 0.4, ease: 'easeOut' }}
        style={{
          height: '100%',
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          background: 'linear-gradient(145deg, rgba(20, 18, 15, 0.98) 0%, rgba(12, 10, 8, 0.99) 100%)',
          borderRadius: '14px',
          border: '1px solid rgba(201, 162, 39, 0.3)',
          boxShadow: `
            0 8px 32px rgba(0,0,0,0.5),
            inset 0 1px 0 rgba(255,255,255,0.03),
            inset 0 -1px 0 rgba(0,0,0,0.3),
            0 0 40px rgba(201, 162, 39, ${mapSlot ? '0.15' : '0.05'})
          `,
          backdropFilter: 'blur(12px)',
          padding: '1.5rem',
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
        height: '200%',
        background: 'radial-gradient(ellipse at center, rgba(201, 162, 39, 0.05) 0%, transparent 50%)',
        pointerEvents: 'none',
      }} />

      {/* Device Header */}
      <div style={{
        flexShrink: 0,
        padding: '1rem 1.25rem',
        background: 'linear-gradient(180deg, rgba(201, 162, 39, 0.12) 0%, rgba(201, 162, 39, 0.04) 100%)',
        borderBottom: '1px solid rgba(201, 162, 39, 0.2)',
        textAlign: 'center',
        position: 'relative',
        margin: '-1.5rem -1.5rem 1.5rem -1.5rem',
        borderRadius: '14px 14px 0 0',
        zIndex: 2,
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
        <h2 style={{
          fontSize: '1.1rem',
          margin: 0,
          fontFamily: "'Cinzel', Georgia, serif",
          fontWeight: 700,
          color: '#d4af37',
          textTransform: 'uppercase',
          letterSpacing: '0.15em',
          textShadow: '0 0 20px rgba(201, 162, 39, 0.5), 0 2px 4px rgba(0,0,0,0.5)',
        }}>
          Map Device
        </h2>
      </div>

      {/* Map Title - Displayed above the map slot */}
      <AnimatePresence mode="wait">
        {mapSlot && (
          <motion.div
            key={mapSlot.id}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            style={{
              textAlign: 'center',
              marginBottom: '0.75rem',
              position: 'relative',
              zIndex: 2,
            }}
          >
            <h3
              style={{
                fontSize: '1rem',
                margin: 0,
                fontFamily: "'Cinzel', Georgia, serif",
                fontWeight: 600,
                color: '#c9a227',
                textTransform: 'none',
                letterSpacing: '0.05em',
                textShadow: '0 0 10px rgba(201, 162, 39, 0.4), 0 2px 4px rgba(0,0,0,0.5)',
              }}
            >
              {mapSlot.name}
            </h3>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Map Slot - Large square focal point */}
      <div
        onMouseUp={() => {
          if (draggedItemType === 'map') {
            onDropMap();
          }
        }}
        style={{
          width: '400px',
          height: '430px',
          flexShrink: 0,
          background: isDragging && draggedItemType === 'map' 
            ? 'rgba(255, 215, 0, 0.15)' 
            : 'linear-gradient(135deg, rgba(30, 26, 22, 0.8) 0%, rgba(20, 18, 15, 0.9) 100%)',
          border: `3px solid ${mapSlot ? '#3b82f6' : isDragging && draggedItemType === 'map' ? 'rgba(201, 162, 39, 0.5)' : 'rgba(60, 50, 40, 0.5)'}`,
          borderRadius: '12px',
          cursor: mapSlot ? 'pointer' : 'default',
          transition: 'all 0.3s ease',
          position: 'relative',
          overflow: 'hidden',
          margin: '0 auto 2rem auto',
          boxShadow: mapSlot 
            ? '0 0 40px rgba(59, 130, 246, 0.6), 0 0 80px rgba(59, 130, 246, 0.4), inset 0 0 30px rgba(0,0,0,0.3)'
            : 'inset 0 0 30px rgba(0,0,0,0.3)',
        }}
        onClick={() => mapSlot && onRemoveMap()}
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
        
        {/* Faded map tablet background */}
        <div style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: `url(${whiteMap})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          opacity: mapSlot ? 0.2 : 0.1,
          filter: 'grayscale(100%) brightness(0.6)',
          zIndex: 1,
          pointerEvents: 'none',
        }} />
        
        {/* Blue glowing border when map is slotted */}
        {mapSlot && (
          <motion.div
            animate={{
              opacity: [0.6, 1, 0.6],
              boxShadow: [
                '0 0 20px rgba(59, 130, 246, 0.6)',
                '0 0 40px rgba(59, 130, 246, 0.8)',
                '0 0 20px rgba(59, 130, 246, 0.6)'
              ],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
            style={{
              position: 'absolute',
              inset: -5,
              borderRadius: '12px',
              border: '5px solid #3b82f6',
              pointerEvents: 'none',
              zIndex: 3,
            }}
          />
        )}

        {mapSlot && (
          <AnimatePresence mode="wait">
            <motion.div
              key="map-slot-filled"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.3 }}
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 2,
              }}
            >
              <img 
                src={getMapItemImage(mapSlot.tier)} 
                alt={getMapBaseById(mapSlot.baseId)?.name || 'Map'}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'contain',
                  imageRendering: 'auto',
                  filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.8))',
                  pointerEvents: 'none',
                }}
              />
              {/* Tier number overlay - centered */}
              <div style={{
                position: 'absolute',
                inset: 0,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 3,
                pointerEvents: 'none',
              }}>
                <span style={{
                  fontSize: '6rem',
                  fontWeight: 800,
                  color: '#ffffff',
                  textShadow: `
                    0 4px 8px rgba(0,0,0,1),
                    0 2px 4px rgba(0,0,0,0.9),
                    0 0 8px rgba(0,0,0,1),
                    0 0 12px rgba(255,255,255,0.3)
                  `,
                  fontFamily: "'Cinzel', Georgia, serif",
                  letterSpacing: '0.05em',
                }}>
                  {mapSlot.tier}
                </span>
              </div>
            </motion.div>
          </AnimatePresence>
        )}
      </div>

      {/* Fragment Slots - 6 small squares in a single row */}
      <div style={{
        display: 'flex',
        flexDirection: 'row',
        gap: '0.75rem',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: '1.5rem',
        position: 'relative',
        zIndex: 2,
        flexWrap: 'nowrap',
      }}>
        {/* Show up to 6 slots, pad with nulls if needed */}
        {Array.from({ length: 6 }).map((_, idx) => {
          const fragment = fragmentSlots[idx] || null;
          const targetFragment = FRAGMENT_BASES[idx];
          
          // Get the count for this fragment type
          const fragmentCount = targetFragment ? (fragmentCounts[targetFragment.id] || 0) : 0;
          
          return (
            <motion.div
              key={idx}
              whileHover={{ scale: 1.1 }}
              animate={shakenFragmentSlots.has(idx) ? {
                x: [0, -4, 4, -3, 3, -2, 2, 0],
                y: [0, -2, 2, -1.5, 1.5, -1, 1, 0],
              } : {}}
              transition={{ duration: 0.4, ease: 'easeOut' }}
              title={targetFragment ? `${targetFragment.name} - ${targetFragment.description}` : `Fragment Slot ${idx + 1}`}
              onMouseUp={() => {
                if (draggedItemType === 'fragment') {
                  onDropFragment(idx);
                }
              }}
              onClick={() => {
                if (fragment) {
                  // Remove if already has a fragment
                  onRemoveFragment(idx);
                }
              }}
              style={{
                width: '60px',
                height: '60px',
                background: fragment
                  ? 'linear-gradient(135deg, rgba(139, 112, 25, 0.3) 0%, rgba(90, 70, 50, 0.4) 100%)'
                  : 'linear-gradient(135deg, rgba(30, 26, 22, 0.5) 0%, rgba(20, 18, 15, 0.6) 100%)',
                position: 'relative',
                border: `2px solid ${fragment ? 'rgba(201, 162, 39, 0.5)' : 'rgba(60, 50, 40, 0.3)'}`,
                borderRadius: '4px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                boxShadow: fragment 
                  ? '0 0 10px rgba(201, 162, 39, 0.3), inset 0 0 8px rgba(0,0,0,0.2)'
                  : 'inset 0 0 8px rgba(0,0,0,0.2)',
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
              {fragment ? (
                <div style={{ 
                  position: 'relative',
                  width: '100%',
                  height: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                  {fragment.image ? (
                    <img
                      src={fragment.image}
                      alt={fragment.name}
                      style={{
                        width: '90%',
                        height: '90%',
                        objectFit: 'contain',
                      }}
                    />
                  ) : (
                    <div style={{
                      fontSize: '1.8rem',
                      lineHeight: 1,
                    }}>
                      {fragment.icon}
                    </div>
                  )}
                </div>
              ) : targetFragment ? (
                <div style={{
                  position: 'relative',
                  width: '100%',
                  height: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: fragmentCount > 0 ? 'pointer' : 'default',
                }}
                onClick={() => {
                  if (fragmentCount > 0 && onFragmentClick) {
                    onFragmentClick(idx);
                  }
                }}>
                  {targetFragment.image ? (
                    <img
                      src={targetFragment.image}
                      alt={targetFragment.name}
                      style={{
                        width: '80%',
                        height: '80%',
                        objectFit: 'contain',
                        opacity: fragmentCount > 0 ? 0.4 : 0.2,
                        filter: fragmentCount > 0 ? 'none' : 'grayscale(100%)',
                      }}
                    />
                  ) : (
                    <div style={{
                      fontSize: '1.2rem',
                      opacity: fragmentCount > 0 ? 0.4 : 0.2,
                      filter: fragmentCount > 0 ? 'none' : 'grayscale(100%)',
                    }}>
                      {targetFragment.icon}
                    </div>
                  )}
                  {fragmentCount > 0 && (
                    <div style={{
                      position: 'absolute',
                      bottom: '2px',
                      right: '2px',
                      fontSize: '0.7rem',
                      color: '#ff4444',
                      fontWeight: 700,
                      textShadow: '0 1px 2px rgba(0,0,0,0.8), 0 0 4px rgba(0,0,0,0.6)',
                      zIndex: 2,
                    }}>
                      {fragmentCount}
                    </div>
                  )}
                </div>
              ) : (
                <div style={{
                  fontSize: '0.5rem',
                  color: 'rgba(200, 190, 170, 0.3)',
                  zIndex: 1,
                }}>
                  {idx + 1}
                </div>
              )}
            </motion.div>
          );
        })}
      </div>

      {/* Activate Button - Always at bottom */}
      <div style={{
        marginTop: 'auto',
        paddingTop: '1.5rem',
        position: 'relative',
        zIndex: 2,
      }}>
        <motion.button
          onClick={onStart}
          disabled={!canStart}
          whileHover={canStart ? { scale: 1.02 } : {}}
          whileTap={canStart ? { scale: 0.98 } : {}}
          style={{
            width: '100%',
            padding: '1.5rem 2rem',
            fontSize: '1.1rem',
            fontWeight: 700,
            fontFamily: "'Cinzel', Georgia, serif",
            background: canStart
              ? 'linear-gradient(180deg, rgba(168, 85, 247, 0.12) 0%, rgba(168, 85, 247, 0.04) 100%)'
              : 'linear-gradient(135deg, rgba(30, 26, 22, 0.6) 0%, rgba(20, 18, 15, 0.7) 100%)',
            border: canStart 
              ? '1px solid rgba(168, 85, 247, 0.2)'
              : '1px solid rgba(60, 50, 40, 0.3)',
            borderRadius: '12px',
            color: canStart ? '#e9d5ff' : 'rgba(200, 190, 170, 0.4)',
            cursor: canStart ? 'pointer' : 'not-allowed',
            boxShadow: canStart 
              ? '0 4px 20px rgba(168, 85, 247, 0.3), inset 0 1px 0 rgba(255,255,255,0.1)'
              : 'inset 0 0 10px rgba(0,0,0,0.2)',
            transition: 'all 0.3s ease',
            textTransform: 'uppercase',
            letterSpacing: '0.15em',
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

          {/* Top purple line with glow */}
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '2px',
            background: 'linear-gradient(90deg, transparent 5%, #a855f7 50%, transparent 95%)',
            boxShadow: '0 0 12px rgba(168, 85, 247, 0.4)',
            opacity: canStart ? 1 : 0.3,
          }} />

          {/* Bottom purple line with glow */}
          <div style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: '2px',
            background: 'linear-gradient(90deg, transparent 5%, #a855f7 50%, transparent 95%)',
            boxShadow: '0 0 12px rgba(168, 85, 247, 0.4)',
            opacity: canStart ? 1 : 0.3,
          }} />

          {/* Center diamond decoration - top */}
          {canStart && (
            <motion.div 
              animate={{ 
                boxShadow: ['0 0 10px rgba(168, 85, 247, 0.4)', '0 0 20px rgba(168, 85, 247, 0.6)', '0 0 10px rgba(168, 85, 247, 0.4)']
              }}
              transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
              style={{
                position: 'absolute',
                top: '-5px',
                left: '50%',
                transform: 'translateX(-50%) rotate(45deg)',
                width: '10px',
                height: '10px',
                background: 'linear-gradient(135deg, #c084fc 0%, #a855f7 50%, #7c3aed 100%)',
                borderRadius: '2px',
              }}
            />
          )}

          {/* Center diamond decoration - bottom */}
          {canStart && (
            <motion.div 
              animate={{ 
                boxShadow: ['0 0 10px rgba(168, 85, 247, 0.4)', '0 0 20px rgba(168, 85, 247, 0.6)', '0 0 10px rgba(168, 85, 247, 0.4)']
              }}
              transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
              style={{
                position: 'absolute',
                bottom: '-5px',
                left: '50%',
                transform: 'translateX(-50%) rotate(45deg)',
                width: '10px',
                height: '10px',
                background: 'linear-gradient(135deg, #c084fc 0%, #a855f7 50%, #7c3aed 100%)',
                borderRadius: '2px',
              }}
            />
          )}

          <span style={{ 
            position: 'relative', 
            zIndex: 1,
            textShadow: canStart ? '0 0 20px rgba(168, 85, 247, 0.5), 0 2px 4px rgba(0,0,0,0.5)' : 'none',
          }}>
            {canStart ? 'Activate Map' : 'Insert a Map'}
          </span>
        </motion.button>
      </div>
      </motion.div>
    </>
  );
}

