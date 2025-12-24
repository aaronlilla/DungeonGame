import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  GiCrossedSwords, GiRoundShield, GiRing, 
  GiHelmet, GiChestArmor, GiGloves, GiBelt, GiBoots,
  GiNecklace, GiGemPendant
} from 'react-icons/gi';
import { getItemBaseById, AFFIX_DEFINITIONS, type GearSlot } from '../../types/items';
import type { Item } from '../../types/items';

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

interface ItemCardProps {
  item: Item;
  onClick?: () => void;
  selected?: boolean;
  compact?: boolean;
}

// Item tooltip component
function ItemTooltip({ 
  item, 
  position 
}: { 
  item: Item; 
  position: { x: number; y: number } 
}) {
  const base = getItemBaseById(item.baseId);
  const colors = RARITY_COLORS[item.rarity] || RARITY_COLORS.common;
  
  const getAffixDisplay = (affix: { definitionId: string; value: number }) => {
    const def = AFFIX_DEFINITIONS.find(d => d.id === affix.definitionId);
    if (!def) return null;
    return `+${affix.value} ${def.statModified.replace(/([A-Z])/g, ' $1').trim()}`;
  };

  const allAffixes = [...item.prefixes, ...item.suffixes];

  // Calculate position to keep tooltip on screen
  const tooltipWidth = 260;
  const tooltipHeight = 300;
  let x = position.x + 15;
  let y = position.y - 10;
  
  if (x + tooltipWidth > window.innerWidth - 20) {
    x = position.x - tooltipWidth - 15;
  }
  if (y + tooltipHeight > window.innerHeight - 20) {
    y = window.innerHeight - tooltipHeight - 20;
  }
  if (y < 20) y = 20;

  return createPortal(
    <motion.div
      initial={{ opacity: 0, scale: 0.95, y: 5 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.15 }}
      style={{
        position: 'fixed',
        left: x,
        top: y,
        width: tooltipWidth,
        background: 'linear-gradient(160deg, rgba(35, 30, 25, 0.98) 0%, rgba(18, 16, 12, 0.99) 100%)',
        border: `2px solid ${colors.primary}`,
        borderRadius: '8px',
        padding: '0.85rem',
        zIndex: 10000,
        pointerEvents: 'none',
        boxShadow: `0 0 30px ${colors.glow}, 0 10px 40px rgba(0,0,0,0.6)`,
      }}
    >
      {/* Background texture */}
      <div style={{
        position: 'absolute',
        inset: 0,
        backgroundImage: 'url(/tilebackground.png)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        opacity: 0.04,
        pointerEvents: 'none',
        borderRadius: '6px',
      }} />
      
      {/* Top rarity line */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: '10%',
        right: '10%',
        height: '2px',
        background: `linear-gradient(90deg, transparent, ${colors.primary}, transparent)`,
      }} />
      
      {/* Content */}
      <div style={{ position: 'relative', zIndex: 1 }}>
        {/* Item Name */}
        <div style={{
          fontSize: '0.95rem',
          fontWeight: 700,
          color: colors.primary,
          marginBottom: '0.35rem',
          textShadow: `0 0 12px ${colors.glow}`,
          fontFamily: "'Cinzel', Georgia, serif",
          textAlign: 'center',
        }}>
          {item.name}
        </div>
        
        {/* Base type & level */}
        <div style={{
          fontSize: '0.7rem',
          color: 'rgba(180, 170, 150, 0.8)',
          textAlign: 'center',
          marginBottom: '0.5rem',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          gap: '0.5rem',
        }}>
          <span>{base?.name}</span>
          <span style={{
            padding: '0.1rem 0.35rem',
            background: 'rgba(0,0,0,0.4)',
            borderRadius: '3px',
            border: '1px solid rgba(100, 90, 70, 0.4)',
            fontSize: '0.6rem',
          }}>
            iLvl {item.itemLevel}
          </span>
        </div>
        
        {/* Divider */}
        <div style={{
          height: '1px',
          background: `linear-gradient(90deg, transparent, ${colors.primary}50, transparent)`,
          margin: '0.5rem 0',
        }} />
        
        {/* Implicit stats if any */}
        {item.implicit && (
          <div style={{
            fontSize: '0.7rem',
            color: 'rgba(180, 200, 220, 0.9)',
            marginBottom: '0.5rem',
            textAlign: 'center',
            fontStyle: 'italic',
          }}>
            {getAffixDisplay(item.implicit)}
          </div>
        )}
        
        {/* Affixes */}
        {allAffixes.length > 0 && (
          <div style={{ 
            display: 'flex', 
            flexDirection: 'column', 
            gap: '0.25rem',
            marginBottom: '0.5rem',
          }}>
            {allAffixes.map((affix, i) => (
              <div 
                key={i}
                style={{
                  fontSize: '0.72rem',
                  color: 'rgba(130, 200, 130, 0.95)',
                  padding: '0.15rem 0.3rem',
                  background: 'rgba(130, 200, 130, 0.05)',
                  borderRadius: '3px',
                  borderLeft: '2px solid rgba(130, 200, 130, 0.3)',
                }}
              >
                {getAffixDisplay(affix)}
              </div>
            ))}
          </div>
        )}
        
        {/* Status badges */}
        <div style={{ display: 'flex', gap: '0.4rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          {item.corrupted && (
            <span style={{
              fontSize: '0.6rem',
              fontWeight: 700,
              color: '#f87171',
              padding: '0.15rem 0.4rem',
              background: 'rgba(248, 113, 113, 0.15)',
              border: '1px solid rgba(248, 113, 113, 0.4)',
              borderRadius: '4px',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
            }}>
              Corrupted
            </span>
          )}
          {item.influenced && (
            <span style={{
              fontSize: '0.6rem',
              fontWeight: 700,
              color: '#a78bfa',
              padding: '0.15rem 0.4rem',
              background: 'rgba(167, 139, 250, 0.15)',
              border: '1px solid rgba(167, 139, 250, 0.4)',
              borderRadius: '4px',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
            }}>
              {item.influenced}
            </span>
          )}
        </div>
        
        {/* Rarity label */}
        <div style={{
          marginTop: '0.5rem',
          textAlign: 'center',
          fontSize: '0.6rem',
          color: colors.primary,
          textTransform: 'uppercase',
          letterSpacing: '0.1em',
          opacity: 0.7,
        }}>
          {item.rarity}
        </div>
      </div>
    </motion.div>,
    document.body
  );
}

export function ItemCard({ item, onClick, selected, compact = false }: ItemCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const colors = RARITY_COLORS[item.rarity] || RARITY_COLORS.common;
  const slotIcon = item.slot ? SLOT_ICONS[item.slot] : null;
  
  const handleMouseMove = (e: React.MouseEvent) => {
    setMousePos({ x: e.clientX, y: e.clientY });
  };

  const size = compact ? 56 : 64;

  return (
    <>
      <motion.div
        onClick={onClick}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onMouseMove={handleMouseMove}
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        whileHover={{ scale: 1.08, y: -2 }}
        whileTap={{ scale: 0.95 }}
        transition={{ type: 'spring', damping: 20, stiffness: 300 }}
        style={{
          position: 'relative',
          width: size,
          height: size,
          background: `linear-gradient(145deg, ${colors.bg} 0%, rgba(20, 18, 14, 0.95) 100%)`,
          border: `2px solid ${selected ? colors.primary : isHovered ? `${colors.primary}90` : `${colors.primary}40`}`,
          borderRadius: '10px',
          cursor: onClick ? 'pointer' : 'default',
          overflow: 'hidden',
          boxShadow: selected 
            ? `0 0 20px ${colors.glow}, inset 0 0 15px ${colors.bg}`
            : isHovered 
              ? `0 6px 20px rgba(0,0,0,0.5), 0 0 15px ${colors.glow}`
              : 'inset 0 2px 8px rgba(0,0,0,0.4)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {/* Textured background overlay */}
        <div style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: 'url(/tilebackground.png)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          opacity: 0.05,
          pointerEvents: 'none',
        }} />
        
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
              ? `0 0 15px ${colors.glow}, 0 0 30px ${colors.glow}`
              : `0 0 8px ${colors.glow}`,
            scale: isHovered ? 1.1 : 1,
          }}
          transition={{ duration: 0.2 }}
          style={{ 
            fontSize: compact ? '1.6rem' : '1.9rem',
            zIndex: 2,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {slotIcon}
        </motion.div>
        
        {/* Glass highlight */}
        <motion.div 
          animate={{ opacity: isHovered ? 0.15 : 0.08 }}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '50%',
            background: 'linear-gradient(180deg, rgba(255,255,255,0.2) 0%, transparent 100%)',
            borderRadius: '8px 8px 50% 50%',
            pointerEvents: 'none',
          }} 
        />
        
        {/* Subtle shimmer */}
        <motion.div
          animate={{ x: ['-150%', '250%'] }}
          transition={{ 
            duration: 3,
            repeat: Infinity,
            repeatDelay: 3,
            ease: 'easeInOut',
          }}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '40%',
            height: '100%',
            background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.06), transparent)',
            pointerEvents: 'none',
            transform: 'skewX(-20deg)',
          }}
        />
        
        {/* Selection ring */}
        {selected && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            style={{
              position: 'absolute',
              inset: -2,
              border: `2px solid ${colors.primary}`,
              borderRadius: '12px',
              pointerEvents: 'none',
              boxShadow: `0 0 15px ${colors.glow}`,
            }}
          />
        )}
      </motion.div>
      
      {/* Tooltip */}
      <AnimatePresence>
        {isHovered && (
          <ItemTooltip item={item} position={mousePos} />
        )}
      </AnimatePresence>
    </>
  );
}
