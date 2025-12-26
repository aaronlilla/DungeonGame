import React, { useRef, useLayoutEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import type { SupportGem } from '../../types/skills';

interface SupportGemTooltipProps {
  support: SupportGem;
  position: { x: number; y: number };
  gemLevel?: number;
}

// Support gem color scheme (purple/blue theme)
const supportColors = {
  primary: '#9b59b6',
  glow: 'rgba(155, 89, 182, 0.4)',
  bg: 'rgba(155, 89, 182, 0.08)'
};

export const SupportGemTooltip: React.FC<SupportGemTooltipProps> = ({
  support,
  position,
  gemLevel = 1
}) => {
  const tooltipRef = useRef<HTMLDivElement>(null);
  const [adjustedPosition, setAdjustedPosition] = useState<{ x: number; y: number } | null>(null);
  
  // Calculate position to keep on screen
  const tooltipWidth = 320;
  const estimatedHeight = 500; // Conservative estimate
  
  // Measure actual tooltip height and adjust position after render
  useLayoutEffect(() => {
    if (tooltipRef.current) {
      const rect = tooltipRef.current.getBoundingClientRect();
      const actualHeight = rect.height;
      
      // Check if tooltip extends below viewport
      const bottomPadding = 15; // Extra padding for safety
      const maxBottom = window.innerHeight - bottomPadding;
      const currentBottom = rect.top + actualHeight;
      
      if (currentBottom > maxBottom) {
        // Reposition above the bottom
        const newY = window.innerHeight - actualHeight - bottomPadding;
        setAdjustedPosition({
          x: rect.left,
          y: Math.max(10, newY) // Ensure it doesn't go above top either
        });
      } else {
        setAdjustedPosition(null); // Reset if it fits
      }
    }
  }, [position]);
  
  // Initial positioning
  let x = position.x + 20;
  let y = position.y + 15;
  
  // Keep on screen horizontally
  if (x + tooltipWidth > window.innerWidth - 10) {
    x = position.x - tooltipWidth - 20;
  }
  if (x < 10) x = 10;
  
  // Keep on screen vertically - ensure tooltip is always above bottom of screen
  // Use a more conservative estimate with extra padding
  const bottomPadding = 20; // Increased padding for safety
  const maxY = window.innerHeight - estimatedHeight - bottomPadding;
  
  // If cursor is in the lower portion of screen, position tooltip above cursor
  const lowerThird = window.innerHeight * 0.67;
  if (position.y > lowerThird) {
    // Position above cursor instead of below
    y = position.y - estimatedHeight - 20;
  } else {
    // Normal positioning below cursor
    if (y > maxY) {
      y = maxY;
    }
  }
  
  // Also ensure it doesn't go above the top
  if (y < 10) {
    y = 10;
  }
  
  // Final check: ensure it never goes below bottom
  const finalMaxY = window.innerHeight - estimatedHeight - bottomPadding;
  if (y > finalMaxY) {
    y = finalMaxY;
  }
  
  // Use adjusted position if available, otherwise use calculated position
  const finalPosition = adjustedPosition || { x, y };
  
  const tooltipStyle: React.CSSProperties = {
    position: 'fixed',
    left: finalPosition.x,
    top: finalPosition.y,
    zIndex: 100000,
    pointerEvents: 'none',
    overflow: 'hidden', // Disable scrollbars
  };

  // Format multiplier display
  const formatMultiplier = (mult: SupportGem['multipliers'][0]) => {
    const value = mult.multiplier;
    const isMore = mult.isMore;
    const isIncrease = value > 1 && !isMore;
    const isDecrease = value < 1;
    
    if (isMore) {
      if (value > 1) {
        return `+${((value - 1) * 100).toFixed(0)}% more ${mult.stat}`;
      } else {
        return `${((1 - value) * 100).toFixed(0)}% less ${mult.stat}`;
      }
    } else {
      if (isIncrease) {
        return `+${((value - 1) * 100).toFixed(0)}% increased ${mult.stat}`;
      } else if (isDecrease) {
        return `${((1 - value) * 100).toFixed(0)}% reduced ${mult.stat}`;
      } else {
        return `${(value * 100).toFixed(0)}% ${mult.stat}`;
      }
    }
  };

  return createPortal(
    <div ref={tooltipRef} style={tooltipStyle}>
      {/* Outer decorative frame */}
      <div style={{
        position: 'relative',
        minWidth: '280px',
        maxWidth: '320px',
      }}>
        {/* Corner decorations */}
        <div style={{
          position: 'absolute',
          top: '-2px',
          left: '-2px',
          width: '20px',
          height: '20px',
          borderTop: `2px solid ${supportColors.primary}`,
          borderLeft: `2px solid ${supportColors.primary}`,
          borderRadius: '4px 0 0 0',
        }} />
        <div style={{
          position: 'absolute',
          top: '-2px',
          right: '-2px',
          width: '20px',
          height: '20px',
          borderTop: `2px solid ${supportColors.primary}`,
          borderRight: `2px solid ${supportColors.primary}`,
          borderRadius: '0 4px 0 0',
        }} />
        <div style={{
          position: 'absolute',
          bottom: '-2px',
          left: '-2px',
          width: '20px',
          height: '20px',
          borderBottom: `2px solid ${supportColors.primary}`,
          borderLeft: `2px solid ${supportColors.primary}`,
          borderRadius: '0 0 0 4px',
        }} />
        <div style={{
          position: 'absolute',
          bottom: '-2px',
          right: '-2px',
          width: '20px',
          height: '20px',
          borderBottom: `2px solid ${supportColors.primary}`,
          borderRight: `2px solid ${supportColors.primary}`,
          borderRadius: '0 0 4px 0',
        }} />
        
        {/* Main container */}
        <div 
          className="support-gem-tooltip"
          style={{
            background: 'linear-gradient(135deg, rgba(15, 15, 20, 0.97) 0%, rgba(8, 8, 12, 0.98) 100%)',
            border: '1px solid rgba(80, 80, 100, 0.5)',
            borderRadius: '6px',
            boxShadow: `0 0 30px ${supportColors.glow}, 0 20px 60px rgba(0, 0, 0, 0.8), inset 0 1px 0 rgba(255,255,255,0.05)`,
            fontFamily: '"Outfit", "Segoe UI", sans-serif',
          }}>
          {/* Header */}
          <div style={{
            background: `linear-gradient(135deg, ${supportColors.bg} 0%, transparent 60%)`,
            borderBottom: `1px solid ${supportColors.primary}33`,
            padding: '16px 18px 14px',
            position: 'relative',
          }}>
            {/* Glow effect */}
            <div style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: '60px',
              background: `radial-gradient(ellipse at top, ${supportColors.glow} 0%, transparent 70%)`,
              opacity: 0.5,
              pointerEvents: 'none',
            }} />
            
            {/* Support gem name and level badge */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', position: 'relative' }}>
              <div style={{
                fontSize: '20px',
                fontWeight: 700,
                color: supportColors.primary,
                letterSpacing: '-0.5px',
                textShadow: `0 0 20px ${supportColors.glow}`,
              }}>
                {support.name}
              </div>
              <div style={{
                background: `linear-gradient(135deg, ${supportColors.primary}22, ${supportColors.primary}11)`,
                border: `1px solid ${supportColors.primary}44`,
                borderRadius: '4px',
                padding: '2px 8px',
                fontSize: '11px',
                fontWeight: 600,
                color: supportColors.primary,
              }}>
                Lv {gemLevel}
              </div>
            </div>
            
            {/* Support badge */}
            <div style={{ display: 'flex', gap: '8px', marginTop: '8px', flexWrap: 'wrap' }}>
              <div style={{
                background: `${supportColors.primary}18`,
                border: `1px solid ${supportColors.primary}33`,
                borderRadius: '12px',
                padding: '3px 10px',
                fontSize: '10px',
                fontWeight: 600,
                color: supportColors.primary,
                textTransform: 'uppercase',
                letterSpacing: '1px',
              }}>
                Support Gem
              </div>
            </div>
          </div>

          {/* Description Section */}
          <div style={{
            background: 'rgba(8, 8, 12, 0.95)',
            padding: '12px 18px',
            borderTop: '1px solid rgba(60, 60, 80, 0.3)',
          }}>
            <div style={{
              fontSize: '12px',
              color: '#9a9ab0',
              lineHeight: 1.5,
              fontStyle: 'italic',
            }}>
              {support.description}
            </div>
          </div>

          {/* Required Tags */}
          {support.requiredTags.length > 0 && (
            <div style={{
              background: 'rgba(10, 10, 15, 0.9)',
              padding: '12px 18px',
              borderTop: '1px solid rgba(60, 60, 80, 0.3)',
            }}>
              <div style={{
                fontSize: '10px',
                color: '#888',
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
                marginBottom: '8px',
              }}>
                Required Tags
              </div>
              <div style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: '5px',
              }}>
                {support.requiredTags.map((tag, idx) => (
                  <span
                    key={idx}
                    style={{
                      fontSize: '9px',
                      padding: '3px 8px',
                      borderRadius: '3px',
                      background: 'rgba(155, 89, 182, 0.2)',
                      border: '1px solid rgba(155, 89, 182, 0.4)',
                      color: '#bb8fce',
                      fontWeight: 600,
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px',
                    }}
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Multipliers Section */}
          {support.multipliers.length > 0 && (
            <div style={{
              background: 'rgba(5, 5, 8, 0.9)',
              padding: '14px 18px',
              borderTop: '1px solid rgba(60, 60, 80, 0.3)',
            }}>
              <div style={{
                fontSize: '10px',
                color: '#888',
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
                marginBottom: '10px',
              }}>
                Modifications
              </div>
              {support.multipliers.map((mult, idx) => {
                const isPositive = mult.multiplier > 1 || (mult.multiplier < 1 && mult.isMore);
                const color = isPositive ? '#2ecc71' : '#e74c3c';
                return (
                  <div key={idx} style={{
                    fontSize: '12px',
                    color: color,
                    marginBottom: '6px',
                    paddingLeft: '8px',
                    borderLeft: `2px solid ${color}66`,
                  }}>
                    {formatMultiplier(mult)}
                  </div>
                );
              })}
            </div>
          )}

          {/* Added Effects Section */}
          {support.addedEffects.length > 0 && (
            <div style={{
              background: 'rgba(5, 5, 8, 0.9)',
              padding: '14px 18px',
              borderTop: '1px solid rgba(60, 60, 80, 0.3)',
            }}>
              <div style={{
                fontSize: '10px',
                color: '#888',
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
                marginBottom: '10px',
              }}>
                Added Effects
              </div>
              {support.addedEffects.map((effect, idx) => (
                <div key={idx} style={{
                  fontSize: '12px',
                  color: '#aaa',
                  marginBottom: '6px',
                  paddingLeft: '8px',
                  borderLeft: '2px solid rgba(100, 100, 120, 0.3)',
                }}>
                  {effect.type === 'damage' && (
                    <span style={{ color: '#ff4757' }}>+{effect.value} damage</span>
                  )}
                  {effect.type === 'heal' && (
                    <span style={{ color: '#2ecc71' }}>+{effect.value} healing</span>
                  )}
                  {effect.type === 'dot' && (
                    <span style={{ color: '#ff6b35' }}>+{effect.value} damage/sec{effect.duration ? ` for ${effect.duration}s` : ''}</span>
                  )}
                  {effect.type === 'hot' && (
                    <span style={{ color: '#2ecc71' }}>+{effect.value} healing/sec{effect.duration ? ` for ${effect.duration}s` : ''}</span>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Cost Modifications */}
          {(support.manaCostMultiplier !== undefined || support.cooldownMultiplier !== undefined) && (
            <div style={{
              background: 'rgba(10, 10, 15, 0.8)',
              padding: '12px 18px',
              borderTop: '1px solid rgba(60, 60, 80, 0.3)',
            }}>
              <div style={{
                fontSize: '10px',
                color: '#888',
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
                marginBottom: '8px',
              }}>
                Cost Modifications
              </div>
              {support.manaCostMultiplier !== undefined && (
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  marginBottom: '6px',
                }}>
                  <span style={{ fontSize: '14px' }}>💧</span>
                  <div>
                    <div style={{ fontSize: '10px', color: '#666' }}>Mana Cost</div>
                    <div style={{ fontSize: '14px', fontWeight: 600, color: support.manaCostMultiplier === 0 ? '#2ecc71' : support.manaCostMultiplier > 1 ? '#e74c3c' : '#5dade2' }}>
                      {support.manaCostMultiplier === 0 
                        ? 'Costs Life Instead'
                        : support.manaCostMultiplier > 1
                        ? `+${((support.manaCostMultiplier - 1) * 100).toFixed(0)}% increased`
                        : support.manaCostMultiplier < 1
                        ? `${((1 - support.manaCostMultiplier) * 100).toFixed(0)}% reduced`
                        : 'No change'
                      }
                    </div>
                  </div>
                </div>
              )}
              {support.cooldownMultiplier !== undefined && (
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                }}>
                  <span style={{ fontSize: '14px' }}>⏱️</span>
                  <div>
                    <div style={{ fontSize: '10px', color: '#666' }}>Cooldown</div>
                    <div style={{ fontSize: '14px', fontWeight: 600, color: support.cooldownMultiplier > 1 ? '#e74c3c' : '#5dade2' }}>
                      {support.cooldownMultiplier > 1
                        ? `+${((support.cooldownMultiplier - 1) * 100).toFixed(0)}% increased`
                        : support.cooldownMultiplier < 1
                        ? `${((1 - support.cooldownMultiplier) * 100).toFixed(0)}% reduced`
                        : 'No change'
                      }
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Footer */}
          <div style={{
            background: 'rgba(0, 0, 0, 0.5)',
            padding: '10px 18px',
            borderTop: '1px solid rgba(60, 60, 80, 0.2)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}>
            <div style={{ fontSize: '10px', color: '#666' }}>
              Requires Level <span style={{ color: '#aaa', fontWeight: 600 }}>{support.levelRequirement}</span>
            </div>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default SupportGemTooltip;

