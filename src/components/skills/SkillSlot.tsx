import React, { useState, useCallback } from 'react';
import { createPortal } from 'react-dom';
import type { SkillGem, SupportGem } from '../../types/skills';
import type { SkillUsageConfig } from '../../types/skillUsage';
import { describeSkillConfig, describeSkillConfigDetailed, createSmartSkillConfig } from '../../types/skillUsage';
import { SkillUsageConfigModal } from './SkillUsageConfigModal';
import { getTagColor } from '../../utils/tagColors';
import { SkillGemTooltip } from './SkillGemTooltip';
import { SupportGemTooltip } from './SupportGemTooltip';
import { GiPadlock } from 'react-icons/gi';

// Get skill color based on category, damage type, and tags
function getSkillColor(skill: SkillGem): { primary: string; glow: string; bg: string } {
  // Elemental skills use their element color
  if (skill.damageType && ['fire', 'cold', 'lightning', 'chaos', 'nature', 'arcane', 'holy'].includes(skill.damageType)) {
    const elementColors: Record<string, { primary: string; glow: string; bg: string }> = {
      fire: { primary: '#ff6b35', glow: 'rgba(255, 107, 53, 0.4)', bg: 'rgba(255, 107, 53, 0.08)' },
      cold: { primary: '#36c5f4', glow: 'rgba(54, 197, 244, 0.4)', bg: 'rgba(54, 197, 244, 0.08)' },
      lightning: { primary: '#ffd700', glow: 'rgba(255, 215, 0, 0.4)', bg: 'rgba(255, 215, 0, 0.08)' },
      chaos: { primary: '#b366ff', glow: 'rgba(179, 102, 255, 0.4)', bg: 'rgba(179, 102, 255, 0.08)' },
      nature: { primary: '#66cc66', glow: 'rgba(102, 204, 102, 0.4)', bg: 'rgba(102, 204, 102, 0.08)' },
      arcane: { primary: '#cc66ff', glow: 'rgba(204, 102, 255, 0.4)', bg: 'rgba(204, 102, 255, 0.08)' },
      holy: { primary: '#fff2cc', glow: 'rgba(255, 242, 204, 0.4)', bg: 'rgba(255, 242, 204, 0.08)' },
    };
    return elementColors[skill.damageType] || { primary: '#e0e0e0', glow: 'rgba(224, 224, 224, 0.4)', bg: 'rgba(224, 224, 224, 0.08)' };
  }
  
  // Physical attack skills: melee = red, ranged/bow = green
  if (skill.category === 'attack' && skill.damageType === 'physical') {
    const tags = skill.tags || [];
    if (tags.includes('ranged') || tags.includes('projectile')) {
      // Physical bow/ranged skills = green
      return { primary: '#22c55e', glow: 'rgba(34, 197, 94, 0.4)', bg: 'rgba(34, 197, 94, 0.08)' };
    } else if (tags.includes('melee')) {
      // Physical melee skills = red
      return { primary: '#ff4757', glow: 'rgba(255, 71, 87, 0.4)', bg: 'rgba(255, 71, 87, 0.08)' };
    }
    // Default physical attack = red
    return { primary: '#ff4757', glow: 'rgba(255, 71, 87, 0.4)', bg: 'rgba(255, 71, 87, 0.08)' };
  }
  
  // Category-based colors (same as tooltip)
  if (skill.category === 'attack') return { primary: '#ff4757', glow: 'rgba(255, 71, 87, 0.4)', bg: 'rgba(255, 71, 87, 0.08)' };
  if (skill.category === 'spell') return { primary: '#3498db', glow: 'rgba(52, 152, 219, 0.4)', bg: 'rgba(52, 152, 219, 0.08)' };
  if (skill.category === 'heal') return { primary: '#2ecc71', glow: 'rgba(46, 204, 113, 0.4)', bg: 'rgba(46, 204, 113, 0.08)' };
  if (skill.category === 'buff' || skill.category === 'defensive') return { primary: '#f1c40f', glow: 'rgba(241, 196, 15, 0.4)', bg: 'rgba(241, 196, 15, 0.08)' };
  if (skill.category === 'utility') return { primary: '#9b59b6', glow: 'rgba(155, 89, 182, 0.4)', bg: 'rgba(155, 89, 182, 0.08)' };
  
  return { primary: '#95a5a6', glow: 'rgba(149, 165, 166, 0.4)', bg: 'rgba(149, 165, 166, 0.08)' };
}

interface SkillSlotProps {
  slotIndex: number;
  skill: SkillGem | undefined;
  supports: (SupportGem | undefined)[];
  usageConfig?: SkillUsageConfig;
  isEnabled: boolean;
  requiredLevel?: number;
  enabledSupportSlots: number;
  onSelectSlot: () => void;
  onUnequipSkill: () => void;
  onSelectSupportSlot: (supportIndex: number) => void;
  onUnequipSupport: (supportIndex: number) => void;
  onUpdateUsageConfig?: (config: SkillUsageConfig) => void;
}

export function SkillSlot({
  slotIndex,
  skill,
  supports,
  usageConfig,
  isEnabled,
  requiredLevel,
  enabledSupportSlots,
  onSelectSlot,
  onUnequipSkill,
  onSelectSupportSlot,
  onUnequipSupport,
  onUpdateUsageConfig
}: SkillSlotProps) {
  const [isConfigOpen, setIsConfigOpen] = useState(false);
  const [isTooltipVisible, setIsTooltipVisible] = useState(false);
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });
  const [supportTooltipVisible, setSupportTooltipVisible] = useState<number | null>(null);
  const [supportTooltipPosition, setSupportTooltipPosition] = useState({ x: 0, y: 0 });
  
  const effectiveConfig = usageConfig || (skill ? createSmartSkillConfig(skill.id) : undefined);
  
  // Use ref to track position without causing re-renders on every mouse move
  const positionRef = React.useRef({ x: 0, y: 0 });
  const supportPositionRef = React.useRef({ x: 0, y: 0 });
  
  const handleMouseEnter = useCallback((e: React.MouseEvent) => {
    positionRef.current = { x: e.clientX, y: e.clientY };
    setTooltipPosition({ x: e.clientX, y: e.clientY });
    setIsTooltipVisible(true);
  }, []);
  
  // Don't update state on every mouse move - prevents re-render spam that can eat clicks
  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    positionRef.current = { x: e.clientX, y: e.clientY };
  }, []);
  
  const handleMouseLeave = useCallback(() => {
    setIsTooltipVisible(false);
  }, []);

  // Support gem tooltip handlers
  const handleSupportMouseEnter = useCallback((e: React.MouseEvent, supportIndex: number) => {
    supportPositionRef.current = { x: e.clientX, y: e.clientY };
    setSupportTooltipPosition({ x: e.clientX, y: e.clientY });
    setSupportTooltipVisible(supportIndex);
  }, []);

  const handleSupportMouseMove = useCallback((e: React.MouseEvent) => {
    supportPositionRef.current = { x: e.clientX, y: e.clientY };
    // Update position if tooltip is visible
    if (supportTooltipVisible !== null) {
      setSupportTooltipPosition({ x: e.clientX, y: e.clientY });
    }
  }, [supportTooltipVisible]);

  const handleSupportMouseLeave = useCallback(() => {
    setSupportTooltipVisible(null);
  }, []);
  
  const maxSupportSlots = skill?.maxSupportSlots ?? 5;
  
  return (
    <div 
      className={`skill-slot ${skill ? 'filled' : ''} ${!isEnabled ? 'disabled' : ''}`}
      style={{
        opacity: isEnabled ? 1 : 0.5,
        filter: isEnabled ? 'none' : 'grayscale(0.6)',
        position: 'relative',
        ...(skill ? (() => {
          const skillColors = getSkillColor(skill);
          const hexToRgba = (hex: string, alpha: number) => {
            const r = parseInt(hex.slice(1, 3), 16);
            const g = parseInt(hex.slice(3, 5), 16);
            const b = parseInt(hex.slice(5, 7), 16);
            return `rgba(${r}, ${g}, ${b}, ${alpha})`;
          };
          return {
            borderColor: hexToRgba(skillColors.primary, 0.3),
            background: `linear-gradient(180deg, ${skillColors.bg} 0%, rgba(24, 21, 17, 0.98) 100%)`,
            boxShadow: `inset 0 1px 0 ${skillColors.bg.replace('0.08', '0.1')}, 0 0 15px ${skillColors.glow.replace('0.4', '0.06')}, 0 2px 6px rgba(0,0,0,0.25)`,
          };
        })() : {}),
      }}
    >
      {skill ? (() => {
        const skillColors = getSkillColor(skill);
        // Convert hex to rgba for border colors
        const hexToRgba = (hex: string, alpha: number) => {
          const r = parseInt(hex.slice(1, 3), 16);
          const g = parseInt(hex.slice(3, 5), 16);
          const b = parseInt(hex.slice(5, 7), 16);
          return `rgba(${r}, ${g}, ${b}, ${alpha})`;
        };
        const borderColor = hexToRgba(skillColors.primary, 0.55);
        const borderColorHover = hexToRgba(skillColors.primary, 0.75);
        return (
        <>
          <div className="skill-gem">
            {/* Skill Icon with Tooltip */}
            <div 
              onMouseEnter={(e) => {
                handleMouseEnter(e);
                e.currentTarget.style.setProperty('border-color', borderColorHover, 'important');
                e.currentTarget.style.boxShadow = `0 0 18px ${skillColors.glow.replace('0.4', '0.28')}, inset 0 0 15px ${skillColors.bg.replace('0.08', '0.12')}, inset 0 1px 0 rgba(255, 255, 255, 0.1)`;
              }}
              onMouseMove={handleMouseMove}
              onMouseLeave={(e) => {
                handleMouseLeave();
                e.currentTarget.style.setProperty('border-color', borderColor, 'important');
                e.currentTarget.style.boxShadow = `0 0 12px ${skillColors.glow.replace('0.4', '0.18')}, inset 0 0 15px ${skillColors.bg.replace('0.08', '0.08')}, inset 0 1px 0 rgba(255, 255, 255, 0.08)`;
              }}
              style={{ 
                cursor: 'pointer',
                fontSize: '1.6rem',
                width: '52px',
                height: '52px',
                minWidth: '52px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: `linear-gradient(145deg, ${skillColors.bg.replace('0.08', '0.25')} 0%, ${skillColors.bg.replace('0.08', '0.18')} 100%)`,
                border: `2px solid ${borderColor}`,
                borderColor: borderColor,
                borderRadius: '6px',
                boxShadow: `0 0 12px ${skillColors.glow.replace('0.4', '0.18')}, inset 0 0 15px ${skillColors.bg.replace('0.08', '0.08')}, inset 0 1px 0 rgba(255, 255, 255, 0.08)`,
                position: 'relative',
                overflow: 'hidden',
                transition: 'all 0.2s ease',
              } as React.CSSProperties}
            >
              {skill.icon}
              {/* Gloss overlay */}
              <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                height: '45%',
                background: 'linear-gradient(180deg, rgba(255,255,255,0.06) 0%, transparent 100%)',
                pointerEvents: 'none',
                borderRadius: '4px 4px 0 0',
              }} />
              <div style={{
                position: 'absolute',
                inset: 0,
                background: 'radial-gradient(circle at 30% 30%, rgba(255, 255, 255, 0.08) 0%, transparent 50%)',
                pointerEvents: 'none',
              }} />
            </div>
            
            {/* Tooltip - rendered in portal for z-index */}
            {isTooltipVisible && createPortal(
              <SkillGemTooltip 
                skill={skill} 
                position={tooltipPosition}
              />,
              document.body
            )}
            
            <div className="skill-gem-info" style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <h4>{skill.name}</h4>
                {/* Usage Config indicator - compact */}
                {effectiveConfig && (
                  <button
                    onClick={() => setIsConfigOpen(true)}
                    style={{
                      background: effectiveConfig.enabled 
                        ? 'rgba(34, 197, 94, 0.15)'
                        : 'rgba(239, 68, 68, 0.15)',
                      border: `1px solid ${effectiveConfig.enabled ? 'rgba(34, 197, 94, 0.4)' : 'rgba(239, 68, 68, 0.4)'}`,
                      borderRadius: '3px',
                      padding: '0.15rem 0.4rem',
                      fontSize: '0.6rem',
                      fontWeight: 600,
                      color: effectiveConfig.enabled ? 'var(--accent-green)' : 'var(--accent-red)',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.25rem',
                      transition: 'all 0.15s ease'
                    }}
                    title={describeSkillConfig(effectiveConfig)}
                  >
                    <span style={{ fontSize: '0.55rem' }}>⚙️</span>
                    <span>P{effectiveConfig.priority}</span>
                  </button>
                )}
              </div>
              
              {/* Quick stats row - compact */}
              <div className="skill-gem-stats">
                <span className="skill-gem-stat">
                  <span>💧</span>
                  <span>{skill.manaCost}</span>
                </span>
                {skill.cooldown > 0 && (
                  <span className="skill-gem-stat">
                    <span>⏱️</span>
                    <span>{skill.cooldown}s</span>
                  </span>
                )}
                <span className="skill-gem-stat">
                  <span>{skill.castTime > 0 ? '⏳' : '⚡'}</span>
                  <span>{skill.castTime ? `${skill.castTime}s` : 'Inst'}</span>
                </span>
                {skill.damageEffectiveness > 0 && (
                  <span className="skill-gem-stat" title={skill.category === 'attack' ? 'Attack Damage' : 'Added Damage Effectiveness'}>
                    <span>⚔️</span>
                    <span>{skill.damageEffectiveness}%</span>
                  </span>
                )}
              </div>
              
              {/* Skill Tags */}
              {skill.tags && skill.tags.length > 0 && (
                <div style={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  gap: '0.3rem',
                  marginTop: '0.4rem'
                }}>
                  {skill.tags.slice(0, 4).map((tag, idx) => (
                    <span
                      key={idx}
                      className="skill-tag"
                      style={{ background: getTagColor(tag) }}
                    >
                      {tag}
                    </span>
                  ))}
                  {skill.tags.length > 4 && (
                    <span style={{
                      fontSize: '0.55rem',
                      padding: '0.2rem 0.3rem',
                      color: 'rgba(160,150,130,0.6)',
                      fontWeight: 500,
                    }}>
                      +{skill.tags.length - 4}
                    </span>
                  )}
                </div>
              )}
            </div>
            
            {/* Skill usage conditions description - moved to right side of skill block */}
            {effectiveConfig && (
              <div 
                className="skill-conditions-description"
                onClick={() => setIsConfigOpen(true)}
                style={{
                  padding: '0.5rem 0.75rem',
                  background: 'rgba(0, 0, 0, 0.3)',
                  borderRadius: '6px',
                  border: '1px solid rgba(139, 90, 43, 0.4)',
                  fontSize: '0.7rem',
                  lineHeight: '1.4',
                  color: 'rgba(180, 175, 170, 0.9)',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  whiteSpace: 'pre-line',
                  minWidth: '250px',
                  maxWidth: '400px',
                  flex: '0 0 auto',
                  marginLeft: 'auto',
                  alignSelf: 'flex-start'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'rgba(0, 0, 0, 0.5)';
                  e.currentTarget.style.borderColor = 'rgba(139, 90, 43, 0.7)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'rgba(0, 0, 0, 0.3)';
                  e.currentTarget.style.borderColor = 'rgba(139, 90, 43, 0.4)';
                }}
              >
                <div style={{ 
                  fontSize: '0.65rem', 
                  color: 'rgba(140, 135, 120, 0.7)', 
                  marginBottom: '0.35rem',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px',
                  fontWeight: 600,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.3rem'
                }}>
                  <span>⚙️</span>
                  <span>Casting Conditions</span>
                </div>
                <div style={{ fontSize: '0.7rem', lineHeight: '1.5' }}>
                  {describeSkillConfigDetailed(effectiveConfig).split('\n').map((line, idx) => (
                    <div key={idx} style={{ marginBottom: '0.2rem' }}>
                      {line}
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {/* Remove button - positioned at end */}
            <button 
              className="skill-remove-btn"
              onClick={onUnequipSkill}
              title="Remove skill"
            >
              ×
            </button>
          </div>
          
          {/* Support gem slots */}
          <div className="support-slots">
            <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '0.35rem', flex: '0 0 auto' }}>
              {Array(maxSupportSlots).fill(null).map((_, supportIndex) => {
                const support = supports[supportIndex];
                const isSupportEnabled = supportIndex < enabledSupportSlots;
                return (
                  <div
                    key={supportIndex}
                    className={`support-slot ${support ? 'filled' : ''}`}
                    onClick={() => {
                      if (isSupportEnabled) {
                        if (support) {
                          onUnequipSupport(supportIndex);
                        } else {
                          onSelectSupportSlot(supportIndex);
                        }
                      }
                    }}
                    onMouseEnter={(e) => {
                      if (support) {
                        handleSupportMouseEnter(e, supportIndex);
                      }
                    }}
                    onMouseMove={handleSupportMouseMove}
                    onMouseLeave={handleSupportMouseLeave}
                    style={{ 
                      cursor: isSupportEnabled ? 'pointer' : 'default',
                      opacity: isSupportEnabled ? 1 : 0.4,
                      filter: isSupportEnabled ? 'none' : 'grayscale(0.8)',
                    }}
                  >
                    {support ? (
                      <span style={{ fontSize: '1.1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', height: '100%' }}>{support.icon}</span>
                    ) : (
                      <span style={{ fontSize: '1rem', color: 'var(--text-dim)', opacity: isSupportEnabled ? 0.4 : 0.2 }}>+</span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
          
          {/* Support Gem Tooltip */}
          {supportTooltipVisible !== null && supports[supportTooltipVisible] && createPortal(
            <SupportGemTooltip 
              support={supports[supportTooltipVisible]!} 
              position={supportTooltipPosition}
            />,
            document.body
          )}
          
          {/* Config Modal */}
          <SkillUsageConfigModal
            isOpen={isConfigOpen}
            onClose={() => setIsConfigOpen(false)}
            onSave={(config) => {
              if (onUpdateUsageConfig) {
                onUpdateUsageConfig(config);
              }
            }}
            skill={skill}
            currentConfig={effectiveConfig}
          />
        </>
        );
      })() : (
        <div 
          className="skill-slot-empty"
          onMouseDown={(e) => {
            if (e.button === 0 && isEnabled) {
              e.preventDefault();
              onSelectSlot();
            }
          }}
          style={{
            cursor: isEnabled ? 'pointer' : 'default',
            position: 'relative',
          }}
        >
          {/* Gem socket placeholder */}
          <div className="empty-gem-socket">
            <div className="socket-inner">
              <span className="socket-plus">+</span>
            </div>
            <div className="socket-glow" />
            {/* Lock icon overlay for locked slots */}
            {!isEnabled && requiredLevel && (
              <div style={{
                position: 'absolute',
                top: '4px',
                right: '4px',
                background: 'rgba(100, 80, 60, 0.95)',
                borderRadius: '4px',
                padding: '3px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 2px 4px rgba(0, 0, 0, 0.5)',
                zIndex: 10,
              }}
              title={`Locked: Requires Level ${requiredLevel}`}
              >
                <GiPadlock style={{ fontSize: '0.7rem', color: '#d4c4a8' }} />
              </div>
            )}
          </div>
          <div className="empty-slot-label">
            <span className="slot-number">{slotIndex + 1}</span>
            {!isEnabled && requiredLevel ? (
              <span className="slot-text" style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '0.3rem',
                color: 'rgba(180, 150, 120, 0.9)',
              }}>
                <GiPadlock style={{ fontSize: '0.75rem' }} />
                Level {requiredLevel}
              </span>
            ) : (
              <span className="slot-text">Add Skill Gem</span>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

