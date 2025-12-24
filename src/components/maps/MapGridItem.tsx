import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { MapItem } from '../../types/maps';
import { MapTooltip } from '../shared/MapTooltip';
import whiteMap from '../../assets/maps/whitemap.png';
import blueMap from '../../assets/maps/bluemap.png';
import greenMap from '../../assets/maps/greenmap.png';
import purpleMap from '../../assets/maps/purplemap.png';
import blackMap from '../../assets/maps/blackmap.png';

/**
 * Get the map item image based on tier
 * Tier 1-15: white, 16-30: blue, 31-45: green, 46-60: purple, 61+: black
 */
function getMapItemImage(tier: number): string {
  if (tier <= 15) return whiteMap;
  if (tier <= 30) return blueMap;
  if (tier <= 45) return greenMap;
  if (tier <= 60) return purpleMap;
  return blackMap;
}

interface MapGridItemProps {
  map: MapItem;
  cellSize: number;
  selected: boolean;
  isHeld?: boolean;
  onClick: (e?: React.MouseEvent) => void;
  onDragStart?: (e: React.MouseEvent) => void;
  onRightClick?: (e: React.MouseEvent) => void;
  style?: React.CSSProperties;
}

export function MapGridItem({
  map,
  cellSize,
  selected,
  isHeld = false,
  onClick,
  onDragStart,
  onRightClick,
  style,
}: MapGridItemProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  
  const getMapRarityColor = (rarity: string): string => {
    switch (rarity) {
      case 'normal': return '#c8c8c8';
      case 'magic': return '#3b82f6';
      case 'rare': return '#ffd700';
      case 'corrupted': return '#dc2626';
      default: return '#ffffff';
    }
  };

  const rarityColor = getMapRarityColor(map.rarity);
  const mapImage = getMapItemImage(map.tier);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.button === 0 && !isHeld) { // Left mouse button only
      e.preventDefault();
      e.stopPropagation();
      // Store the nativeEvent to prevent any interference
      const nativeEvent = e.nativeEvent;
      nativeEvent.stopImmediatePropagation();
      onDragStart?.(e);
    }
  };

  return (
    <motion.div
      onMouseDown={handleMouseDown}
      onClick={(e) => {
        if (!isHeld) {
          onClick(e);
        }
      }}
      onContextMenu={onRightClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onMouseMove={(e) => {
        if (!isHeld) {
          setMousePos({ x: e.clientX, y: e.clientY });
        }
      }}
      animate={{
        scale: isHovered && !isHeld ? 1.05 : 1,
        zIndex: isHeld || isHovered ? 100 : 1,
      }}
      transition={{ type: 'spring', stiffness: 400, damping: 25 }}
      style={{
        position: style?.position || 'absolute',
        top: style?.top ?? 0,
        left: style?.left ?? 0,
        width: `${cellSize}px`,
        height: `${cellSize}px`,
        cursor: isHeld ? 'grabbing' : 'grab',
        userSelect: 'none',
        ...style,
      }}
    >
      <div
        style={{
          position: 'relative',
          width: '100%',
          height: '100%',
          border: selected 
            ? `2px solid ${rarityColor}`
            : isHovered 
              ? `1px solid ${rarityColor}80`
              : '1px solid rgba(60, 50, 40, 0.5)',
          borderRadius: '4px',
          background: isHovered 
            ? 'rgba(0, 0, 0, 0.6)' 
            : 'rgba(0, 0, 0, 0.4)',
          boxShadow: selected
            ? `0 0 12px ${rarityColor}60, inset 0 0 8px ${rarityColor}20`
            : isHovered
              ? `0 4px 12px rgba(0,0,0,0.6), 0 0 8px ${rarityColor}40`
              : '0 2px 6px rgba(0,0,0,0.5)',
          overflow: 'hidden',
          transition: 'all 0.2s ease',
        }}
      >
        {/* Map image background */}
        <img
          src={mapImage}
          alt={`Tier ${map.tier} map`}
          onLoad={() => setImageLoaded(true)}
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            opacity: imageLoaded ? 0.9 : 0,
            transition: 'opacity 0.2s ease',
            imageRendering: 'auto',
          }}
        />
        
        {/* Loading placeholder */}
        {!imageLoaded && (
          <div style={{
            position: 'absolute',
            inset: 0,
            background: 'rgba(20, 18, 15, 0.8)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }} />
        )}

        {/* Tier number overlay - centered */}
        <div style={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 2,
        }}>
          <span style={{
            fontSize: `${cellSize * 0.55}px`,
            fontWeight: 800,
            color: '#ffffff',
            textShadow: `
              0 4px 8px rgba(0,0,0,1),
              0 2px 4px rgba(0,0,0,0.9),
              0 0 8px rgba(0,0,0,1),
              0 0 12px ${rarityColor}60
            `,
            fontFamily: "'Cinzel', Georgia, serif",
            letterSpacing: '0.05em',
          }}>
            {map.tier}
          </span>
        </div>

        {/* Rarity border glow */}
        {selected && (
          <motion.div
            animate={{
              opacity: [0.6, 1, 0.6],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
            style={{
              position: 'absolute',
              inset: -2,
              border: `2px solid ${rarityColor}`,
              borderRadius: '4px',
              boxShadow: `0 0 16px ${rarityColor}80`,
              pointerEvents: 'none',
            }}
          />
        )}
      </div>

      {/* Tooltip */}
      <AnimatePresence>
        {isHovered && !isHeld && (
          <MapTooltip map={map} position={mousePos} />
        )}
      </AnimatePresence>
    </motion.div>
  );
}

