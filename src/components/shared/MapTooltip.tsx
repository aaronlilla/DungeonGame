import { createPortal } from 'react-dom';
import { motion } from 'framer-motion';
import type { MapItem } from '../../types/maps';
import { getMapBaseById, generateMapName } from '../../types/maps';

// Map rarity colors (similar to item rarity colors)
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

// Simple separator line
function Separator() {
  return (
    <div style={{
      height: '1px',
      margin: '6px 0',
      background: 'linear-gradient(90deg, transparent 0%, rgba(120, 100, 80, 0.6) 15%, rgba(120, 100, 80, 0.6) 85%, transparent 100%)',
    }} />
  );
}

interface MapTooltipProps {
  map: MapItem;
  position: { x: number; y: number };
}

export function MapTooltip({ map, position }: MapTooltipProps) {
  const colors = MAP_RARITY_COLORS[map.rarity] || MAP_RARITY_COLORS.normal;
  const mapBase = getMapBaseById(map.baseId);
  const baseName = mapBase?.name || 'Unknown Map';
  
  // Calculate position to keep tooltip on screen
  const tooltipWidth = 280;
  const tooltipHeight = 400;
  let x = position.x + 15;
  let y = position.y - 10;
  
  if (x + tooltipWidth > window.innerWidth - 20) {
    x = position.x - tooltipWidth - 15;
  }
  if (y + tooltipHeight > window.innerHeight - 20) {
    y = window.innerHeight - tooltipHeight - 20;
  }

  return createPortal(
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.15 }}
      style={{
        position: 'fixed',
        left: `${x}px`,
        top: `${y}px`,
        width: `${tooltipWidth}px`,
        maxWidth: `${tooltipWidth}px`,
        minWidth: `${tooltipWidth}px`,
        background: 'linear-gradient(180deg, rgba(15, 12, 10, 0.98) 0%, rgba(10, 8, 6, 0.99) 100%)',
        border: `2px solid ${colors.border}`,
        borderRadius: '6px',
        boxShadow: `
          0 8px 32px rgba(0,0,0,0.8),
          0 0 0 1px rgba(0,0,0,0.5),
          inset 0 0 40px rgba(0,0,0,0.3)
        `,
        padding: '10px 12px',
        zIndex: 10000,
        pointerEvents: 'none',
        fontFamily: "'Cormorant', 'Crimson Text', Georgia, serif",
      }}
    >
      {/* Header with rarity background */}
      <div style={{
        background: colors.header,
        margin: '-10px -12px 8px -12px',
        padding: '8px 12px',
        borderTopLeftRadius: '4px',
        borderTopRightRadius: '4px',
        borderBottom: `1px solid ${colors.border}`,
      }}>
        <div style={{
          fontSize: '18px',
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
        fontSize: '14px',
        color: '#9a9a9a',
        textAlign: 'center',
        marginBottom: '8px',
      }}>
        Tier {map.tier} Map
      </div>

      <Separator />

      {/* Base Map Name */}
      <div style={{
        fontSize: '13px',
        color: '#9a9a9a',
        textAlign: 'center',
        fontStyle: 'italic',
        marginBottom: '8px',
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
            gap: '4px',
            marginBottom: '8px',
          }}>
            {map.quantityBonus > 0 && (
              <div style={{
                fontSize: '13px',
                color: '#22c55e',
                textAlign: 'center',
              }}>
                +{Math.round(map.quantityBonus * 100)}% Item Quantity
              </div>
            )}
            {map.rarityBonus > 0 && (
              <div style={{
                fontSize: '13px',
                color: '#a855f7',
                textAlign: 'center',
              }}>
                +{Math.round(map.rarityBonus * 100)}% Item Rarity
              </div>
            )}
            {map.packSize > 0 && (
              <div style={{
                fontSize: '13px',
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
            gap: '4px',
            marginBottom: '8px',
          }}>
            {map.affixes.map((affix, i) => (
              <div
                key={affix.id || i}
                style={{
                  fontSize: '14px',
                  color: '#82c982',
                  textAlign: 'center',
                  lineHeight: 1.4,
                  fontFamily: "'Cormorant', 'Crimson Text', Georgia, serif",
                }}
              >
                {affix.description || affix.name}
              </div>
            ))}
          </div>
        </>
      )}

      {/* Status badges */}
      <div style={{ display: 'flex', gap: '4px', justifyContent: 'center', flexWrap: 'wrap', marginTop: '8px' }}>
        {map.corrupted && (
          <span style={{
            fontSize: '12px',
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
        )}
      </div>

      {/* Item Level */}
      <Separator />
      <div style={{
        fontSize: '11px',
        color: '#7a7a7a',
        textAlign: 'center',
        marginTop: '4px',
        fontStyle: 'italic',
      }}>
        Item Level: {map.itemLevel}
      </div>
    </motion.div>,
    document.body
  );
}

