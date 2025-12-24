import { memo, useMemo } from 'react';
import type { FloatingNumber } from '../../types/combat';

const FLOAT_LIFETIME = 1500;

interface FloatingNumbersProps {
  floatingNumbers: FloatingNumber[];
  teamPosition: { x: number; y: number };
}

// Memoized individual floating number component
const FloatingNumberItem = memo(({ fn, baseX, baseY }: { 
  fn: FloatingNumber; 
  baseX: number; 
  baseY: number;
}) => {
  // Determine styling based on type - muted, less vibrant colors
  const style = useMemo(() => {
    let color = '#e0e0e0';
    let fontSize = '1.1rem';
    let fontWeight = 600;
    
    if (fn.type === 'player' || fn.type === 'crit') {
      // Muted yellow/gold for player damage, muted orange-red for crits
      color = fn.type === 'crit' ? '#d4a574' : '#c9a96b';
      fontSize = fn.type === 'crit' ? '1.4rem' : '1.1rem';
      fontWeight = fn.type === 'crit' ? 800 : 600;
    } else if (fn.type === 'heal') {
      // Muted green for healing
      color = '#7fb069';
      fontSize = '1.2rem';
      fontWeight = 600;
    } else if (fn.type === 'enemy') {
      // Muted red for enemy damage
      color = '#b87d7d';
      fontSize = '1.1rem';
      fontWeight = 600;
    } else if (fn.type === 'blocked') {
      // Muted blue-gray for blocked
      color = '#8a9ba8';
      fontSize = '1.0rem';
      fontWeight = 500;
    }
    
    return { color, fontSize, fontWeight };
  }, [fn.type]);
  
  return (
    <div
      className="floating-number"
      style={{
        position: 'absolute',
        left: `${baseX}px`,
        top: `${baseY}px`,
        color: style.color,
        fontSize: style.fontSize,
        fontWeight: style.fontWeight,
        fontFamily: 'system-ui, -apple-system, sans-serif',
        pointerEvents: 'none',
        textShadow: '1px 1px 3px rgba(0,0,0,0.7), 0 0 8px rgba(0,0,0,0.4)',
        transform: 'translateX(-50%)',
        zIndex: 1000,
        whiteSpace: 'nowrap',
        letterSpacing: '0.02em',
        animation: `float-up ${FLOAT_LIFETIME}ms cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards`,
        willChange: 'transform, opacity',
        backfaceVisibility: 'hidden'
      }}
    >
      {typeof fn.value === 'number' && (isNaN(fn.value) || !isFinite(fn.value)) ? '0' : fn.value}
    </div>
  );
});

FloatingNumberItem.displayName = 'FloatingNumberItem';

export const FloatingNumbers = memo(({ floatingNumbers, teamPosition }: FloatingNumbersProps) => {
  // Filter valid numbers - use timestamp comparison directly to avoid Date.now() on every render
  const validNumbers = useMemo(() => {
    const now = Date.now();
    return floatingNumbers.filter(fn => {
      if (fn.type === 'levelup') return false;
      const age = now - fn.timestamp;
      return age < FLOAT_LIFETIME;
    });
  }, [floatingNumbers]);

  if (validNumbers.length === 0) return null;

  return (
    <>
      <style>{`
        @keyframes float-up {
          0% {
            opacity: 0.9;
            transform: translateX(-50%) translateY(0) scale(0.95);
          }
          15% {
            opacity: 1;
            transform: translateX(-50%) translateY(-10px) scale(1);
          }
          50% {
            opacity: 1;
            transform: translateX(-50%) translateY(-35px) scale(1);
          }
          100% {
            opacity: 0;
            transform: translateX(-50%) translateY(-70px) scale(0.9);
          }
        }
      `}</style>
      {validNumbers.map((fn, index) => (
        <FloatingNumberItem
          key={fn.id || `float-${index}-${fn.timestamp}`}
          fn={fn}
          baseX={teamPosition.x + fn.offsetX}
          baseY={teamPosition.y - 60}
        />
      ))}
    </>
  );
});

FloatingNumbers.displayName = 'FloatingNumbers';
