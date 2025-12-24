import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  GiCrossedSwords, GiRoundShield, GiRing, 
  GiHelmet, GiChestArmor, GiGloves, GiBelt, GiBoots,
  GiNecklace, GiGemPendant
} from 'react-icons/gi';
import type { Item, GearSlot } from '../../types/items';
import { getItemGridSize } from '../../types/items';
import { ItemTooltip } from '../shared/ItemTooltip';

// Slot to icon mapping
const SLOT_ICONS: Record<GearSlot, React.ReactNode> = {
  head: <GiHelmet />,
  chest: <GiChestArmor />,
  hands: <GiGloves />,
  waist: <GiBelt />,
  feet: <GiBoots />,
  mainHand: <GiCrossedSwords />,
  offHand: <GiRoundShield />,
  neck: <GiNecklace />,
  ring1: <GiRing />,
  ring2: <GiRing />,
  trinket1: <GiGemPendant />,
  trinket2: <GiGemPendant />,
};

const RARITY_COLORS: Record<string, { primary: string; glow: string; bg: string }> = {
  common: { primary: '#9ca3af', glow: 'rgba(156, 163, 175, 0.3)', bg: 'rgba(156, 163, 175, 0.08)' },
  magic: { primary: '#60a5fa', glow: 'rgba(96, 165, 250, 0.4)', bg: 'rgba(96, 165, 250, 0.1)' },
  rare: { primary: '#fbbf24', glow: 'rgba(251, 191, 36, 0.4)', bg: 'rgba(251, 191, 36, 0.1)' },
  unique: { primary: '#f97316', glow: 'rgba(249, 115, 22, 0.4)', bg: 'rgba(249, 115, 22, 0.1)' },
  legendary: { primary: '#a855f7', glow: 'rgba(168, 85, 247, 0.4)', bg: 'rgba(168, 85, 247, 0.12)' },
};

interface DraggableItemProps {
  item: Item;
  onDragStart?: (item: Item) => void;
  onDragEnd?: (item: Item) => void;
  onClick?: (item: Item) => void;
  selected?: boolean;
  compact?: boolean;
  showTooltip?: boolean;
}

export function DraggableItem({
  item,
  onDragStart,
  onDragEnd,
  onClick,
  selected = false,
  compact = false,
  showTooltip = true,
}: DraggableItemProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  
  const colors = RARITY_COLORS[item.rarity] || RARITY_COLORS.common;
  const slotIcon = SLOT_ICONS[item.slot];
  const size = getItemGridSize(item);
  
  // Size based on grid dimensions
  const baseSize = compact ? 24 : 28;
  const width = size.width * baseSize;
  const height = size.height * baseSize;
  const iconSize = Math.min(width, height) * 0.55;
  
  const handleDragStart = useCallback((e: React.DragEvent) => {
    e.dataTransfer.setData('application/json', JSON.stringify({ itemId: item.id }));
    e.dataTransfer.effectAllowed = 'move';
    setIsDragging(true);
    onDragStart?.(item);
  }, [item, onDragStart]);
  
  const handleDragEnd = useCallback(() => {
    setIsDragging(false);
    onDragEnd?.(item);
  }, [item, onDragEnd]);
  
  const handleClick = useCallback(() => {
    onClick?.(item);
  }, [item, onClick]);
  
  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    setMousePos({ x: e.clientX, y: e.clientY });
  }, []);

  return (
    <>
      <motion.div
        draggable
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        onClick={handleClick}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onMouseMove={handleMouseMove}
        animate={{
          opacity: isDragging ? 0.5 : 1,
          scale: isHovered && !isDragging ? 1.02 : 1,
        }}
        whileTap={{ scale: 0.98 }}
        style={{
          position: 'relative',
          width,
          height,
          background: `linear-gradient(145deg, ${colors.bg} 0%, rgba(20, 18, 14, 0.95) 100%)`,
          border: `2px solid ${selected ? colors.primary : isHovered ? `${colors.primary}90` : `${colors.primary}40`}`,
          borderRadius: '6px',
          cursor: 'grab',
          overflow: 'hidden',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: selected 
            ? `0 0 15px ${colors.glow}, inset 0 0 10px ${colors.bg}`
            : isHovered 
              ? `0 4px 12px rgba(0,0,0,0.5), 0 0 10px ${colors.glow}`
              : 'inset 0 2px 4px rgba(0,0,0,0.4)',
        }}
      >
        {/* Top rarity line */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: '15%',
          right: '15%',
          height: '2px',
          background: `linear-gradient(90deg, transparent, ${colors.primary}, transparent)`,
        }} />
        
        {/* Icon */}
        <motion.div
          animate={{ 
            color: colors.primary,
            textShadow: isHovered 
              ? `0 0 10px ${colors.glow}, 0 0 20px ${colors.glow}`
              : `0 0 5px ${colors.glow}`,
          }}
          style={{ 
            fontSize: iconSize,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 2,
          }}
        >
          {slotIcon}
        </motion.div>
        
        {/* Glass highlight */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '35%',
          background: 'linear-gradient(180deg, rgba(255,255,255,0.1) 0%, transparent 100%)',
          borderRadius: '4px 4px 50% 50%',
          pointerEvents: 'none',
        }} />
        
        {/* Selection ring */}
        {selected && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            style={{
              position: 'absolute',
              inset: -2,
              border: `2px solid ${colors.primary}`,
              borderRadius: '8px',
              pointerEvents: 'none',
              boxShadow: `0 0 10px ${colors.glow}`,
            }}
          />
        )}
      </motion.div>
      
      {/* Tooltip */}
      <AnimatePresence>
        {showTooltip && isHovered && !isDragging && (
          <ItemTooltip item={item} position={mousePos} />
        )}
      </AnimatePresence>
    </>
  );
}
