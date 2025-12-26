import { createPortal } from 'react-dom';
import { motion } from 'framer-motion';
import type { OrbType } from '../../store/gameStore';
import { CRAFTING_ORBS } from '../../store/gameStore';

// Currency rarity colors (currency items are typically "currency" rarity, using gold/yellow)
const CURRENCY_COLORS = {
  name: '#c9a227',
  header: 'linear-gradient(180deg, rgba(90, 80, 40, 0.9) 0%, rgba(50, 45, 20, 0.85) 100%)',
  border: '#8c7a30',
  glow: 'rgba(201, 162, 39, 0.4)',
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

interface CurrencyTooltipProps {
  orbType: OrbType;
  count: number;
  position: { x: number; y: number };
}

export function CurrencyTooltip({ orbType, count, position }: CurrencyTooltipProps) {
  const orb = CRAFTING_ORBS.find(o => o.type === orbType);
  
  if (!orb) return null;

  // Calculate position to keep tooltip on screen
  const tooltipWidth = 280;
  const tooltipHeight = 200;
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
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.15 }}
      style={{
        position: 'fixed',
        left: x,
        top: y,
        zIndex: 100000,
        pointerEvents: 'none',
        width: tooltipWidth,
      }}
    >
      {/* Main tooltip container */}
      <div style={{
        background: 'linear-gradient(180deg, rgba(35, 30, 24, 0.98) 0%, rgba(20, 18, 14, 0.99) 100%)',
        border: `2px solid ${CURRENCY_COLORS.border}`,
        borderRadius: '8px',
        boxShadow: `
          0 8px 32px rgba(0,0,0,0.7),
          0 0 20px ${CURRENCY_COLORS.glow},
          inset 0 1px 0 rgba(255,255,255,0.1)
        `,
        overflow: 'hidden',
      }}>
        {/* Header with gradient background */}
        <div style={{
          background: CURRENCY_COLORS.header,
          padding: '0.75rem',
          borderBottom: `1px solid ${CURRENCY_COLORS.border}80`,
          position: 'relative',
        }}>
          {/* Top border gradient */}
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '2px',
            background: `linear-gradient(90deg, transparent, ${CURRENCY_COLORS.name}80, transparent)`,
          }} />
          
          {/* Item Name */}
          <div style={{
            fontSize: '1rem',
            fontWeight: 700,
            color: CURRENCY_COLORS.name,
            textShadow: `0 0 12px ${CURRENCY_COLORS.glow}`,
            fontFamily: "'Cinzel', Georgia, serif",
            textAlign: 'center',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.5rem',
          }}>
            {orb.name}
            <span style={{
              fontSize: '0.75rem',
              fontWeight: 600,
              color: count > 0 ? '#4ade80' : '#9a9a9a',
              background: 'rgba(0,0,0,0.4)',
              padding: '0.15rem 0.4rem',
              borderRadius: '4px',
              border: `1px solid ${count > 0 ? 'rgba(74, 222, 128, 0.3)' : 'rgba(154, 154, 154, 0.3)'}`,
            }}>
              ×{count}
            </span>
          </div>
        </div>

        {/* Content */}
        <div style={{ position: 'relative', zIndex: 1, padding: '0.75rem' }}>
          {/* Currency Type */}
          <div style={{
            fontSize: '0.7rem',
            color: 'rgba(180, 170, 150, 0.8)',
            textAlign: 'center',
            marginBottom: '0.5rem',
            textTransform: 'uppercase',
            letterSpacing: '0.1em',
            fontWeight: 600,
          }}>
            Currency Item
          </div>

          <Separator />

          {/* Description */}
          <div style={{
            fontSize: '0.85rem',
            color: 'rgba(220, 210, 190, 0.95)',
            lineHeight: 1.5,
            textAlign: 'center',
            marginTop: '0.5rem',
          }}>
            {orb.description}
          </div>
        </div>
      </div>
    </motion.div>,
    document.body
  );
}




