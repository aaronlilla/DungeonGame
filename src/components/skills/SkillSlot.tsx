import React, { useState, useCallback } from 'react';
import { createPortal } from 'react-dom';
import type { SkillGem, SupportGem } from '../../types/skills';
import type { SkillUsageConfig } from '../../types/skillUsage';
import { describeSkillConfig, describeSkillConfigDetailed, createSmartSkillConfig } from '../../types/skillUsage';
import { SkillUsageConfigModal } from './SkillUsageConfigModal';
import { getTagColor } from '../../utils/tagColors';
import { SkillGemTooltip } from './SkillGemTooltip';

interface SkillSlotProps {
  slotIndex: number;
  skill: SkillGem | undefined;
  supports: (SupportGem | undefined)[];
  usageConfig?: SkillUsageConfig;
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
  onSelectSlot,
  onUnequipSkill,
  onSelectSupportSlot,
  onUnequipSupport,
  onUpdateUsageConfig
}: SkillSlotProps) {
  const [isConfigOpen, setIsConfigOpen] = useState(false);
  const [isTooltipVisible, setIsTooltipVisible] = useState(false);
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });
  
  const effectiveConfig = usageConfig || (skill ? createSmartSkillConfig(skill.id) : undefined);
  
  // Use ref to track position without causing re-renders on every mouse move
  const positionRef = React.useRef({ x: 0, y: 0 });
  
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
  
  return (
    <div className={`skill-slot ${skill ? 'filled' : ''}`}>
      {skill ? (
        <>
          <div className="skill-gem">
            {/* Skill Icon with Tooltip */}
            <div 
              className="skill-gem-icon"
              onMouseEnter={handleMouseEnter}
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
              style={{ cursor: 'pointer' }}
            >
              {skill.icon}
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
              {Array(skill.maxSupportSlots).fill(null).map((_, supportIndex) => {
                const support = supports[supportIndex];
                return (
                  <div
                    key={supportIndex}
                    className={`support-slot ${support ? 'filled' : ''}`}
                    onClick={() => {
                      if (support) {
                        onUnequipSupport(supportIndex);
                      } else {
                        onSelectSupportSlot(supportIndex);
                      }
                    }}
                    style={{ cursor: 'pointer' }}
                  >
                    {support ? (
                      <span style={{ fontSize: '1.1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', height: '100%' }}>{support.icon}</span>
                    ) : (
                      <span style={{ fontSize: '1rem', color: 'var(--text-dim)', opacity: 0.4 }}>+</span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
          
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
      ) : (
        <div 
          className="skill-slot-empty"
          onMouseDown={(e) => {
            if (e.button === 0) {
              e.preventDefault();
              onSelectSlot();
            }
          }}
        >
          {/* Gem socket placeholder */}
          <div className="empty-gem-socket">
            <div className="socket-inner">
              <span className="socket-plus">+</span>
            </div>
            <div className="socket-glow" />
          </div>
          <div className="empty-slot-label">
            <span className="slot-number">{slotIndex + 1}</span>
            <span className="slot-text">Add Skill Gem</span>
          </div>
        </div>
      )}
    </div>
  );
}

