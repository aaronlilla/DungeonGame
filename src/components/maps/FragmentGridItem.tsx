import React, { useState } from 'react';
import { motion } from 'framer-motion';
import type { Fragment } from '../../types/maps';

interface FragmentGridItemProps {
  fragment: Fragment;
  cellSize: number;
  selected: boolean;
  isHeld?: boolean;
  onClick: (e?: React.MouseEvent) => void;
  onDragStart?: (e: React.MouseEvent) => void;
  onRightClick?: (e: React.MouseEvent) => void;
  style?: React.CSSProperties;
}

export function FragmentGridItem({
  fragment,
  cellSize,
  selected,
  isHeld = false,
  onClick,
  onDragStart,
  onRightClick,
  style,
}: FragmentGridItemProps) {
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.button === 0 && !isHeld) { // Left mouse button only
      e.preventDefault();
      e.stopPropagation();
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
            ? '2px solid rgba(201, 162, 39, 0.9)'
            : isHovered 
              ? '1px solid rgba(201, 162, 39, 0.6)'
              : '1px solid rgba(60, 50, 40, 0.5)',
          borderRadius: '4px',
          background: isHovered 
            ? 'linear-gradient(135deg, rgba(139, 112, 25, 0.4) 0%, rgba(90, 70, 50, 0.5) 100%)' 
            : 'linear-gradient(135deg, rgba(30, 26, 22, 0.6) 0%, rgba(20, 18, 15, 0.7) 100%)',
          boxShadow: selected
            ? '0 0 12px rgba(201, 162, 39, 0.6), inset 0 0 8px rgba(201, 162, 39, 0.2)'
            : isHovered
              ? '0 4px 12px rgba(0,0,0,0.6), 0 0 8px rgba(201, 162, 39, 0.4)'
              : '0 2px 6px rgba(0,0,0,0.5)',
          overflow: 'hidden',
          transition: 'all 0.2s ease',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '0.25rem',
          padding: '0.25rem',
        }}
      >
        {/* Fragment icon */}
        <div style={{
          fontSize: `${cellSize * 0.4}px`,
          lineHeight: 1,
        }}>
          {fragment.icon}
        </div>

        {/* Fragment name - truncated if too long */}
        <div style={{
          fontSize: `${cellSize * 0.25}px`,
          fontWeight: 600,
          color: 'rgba(201, 162, 39, 0.9)',
          textAlign: 'center',
          textShadow: '0 1px 3px rgba(0,0,0,0.8)',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
          width: '100%',
        }}>
          {fragment.name.split(' ')[0]}
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
              border: '2px solid rgba(201, 162, 39, 0.9)',
              borderRadius: '4px',
              boxShadow: '0 0 16px rgba(201, 162, 39, 0.8)',
              pointerEvents: 'none',
            }}
          />
        )}
      </div>
    </motion.div>
  );
}

