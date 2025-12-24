import React, { useState, useCallback } from 'react';
import { createPortal } from 'react-dom';
import type { SkillGem } from '../../types/skills';
import { getTagColor } from '../../utils/tagColors';
import { SkillGemTooltip } from './SkillGemTooltip';

interface SkillPickerModalProps {
  characterName: string;
  availableSkills: SkillGem[];
  onSelect: (skillId: string) => void;
  onClose: () => void;
}

function SkillPickerItem({ skill, onSelect }: { skill: SkillGem; onSelect: () => void }) {
  const [isTooltipVisible, setIsTooltipVisible] = useState(false);
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
  
  // Use ref to track position without causing re-renders
  const positionRef = React.useRef({ x: 0, y: 0 });
  
  const handleIconMouseEnter = useCallback((e: React.MouseEvent) => {
    positionRef.current = { x: e.clientX, y: e.clientY };
    setTooltipPosition({ x: e.clientX, y: e.clientY });
    setIsTooltipVisible(true);
  }, []);
  
  // Don't update state on every mouse move - just update the ref
  // The tooltip already has pointerEvents: none so position doesn't need to be perfect
  const handleIconMouseMove = useCallback((e: React.MouseEvent) => {
    positionRef.current = { x: e.clientX, y: e.clientY };
  }, []);
  
  const handleIconMouseLeave = useCallback(() => {
    setIsTooltipVisible(false);
  }, []);

  // Use onMouseDown for immediate response - doesn't wait for re-renders
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (e.button === 0) { // Left click only
      e.preventDefault();
      onSelect();
    }
  }, [onSelect]);

  return (
    <div
      className={`skill-picker-item ${isHovered ? 'hovered' : ''}`}
      style={{
        background: isHovered 
          ? 'linear-gradient(180deg, rgba(201, 162, 39, 0.12) 0%, rgba(25, 22, 18, 0.95) 100%)'
          : undefined,
        borderColor: isHovered ? 'rgba(201, 162, 39, 0.5)' : undefined,
        boxShadow: isHovered 
          ? '0 4px 15px rgba(201, 162, 39, 0.12), inset 0 1px 0 rgba(255,255,255,0.03)'
          : 'inset 0 1px 0 rgba(255,255,255,0.02)',
      }}
      onMouseDown={handleMouseDown}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Hover glow line at top */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: '1px',
        background: isHovered 
          ? 'linear-gradient(90deg, transparent, rgba(201, 162, 39, 0.5), transparent)'
          : 'transparent',
        transition: 'background 0.2s ease',
        zIndex: 2,
      }} />
      
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.875rem' }}>
        {/* Icon with Tooltip */}
        <div 
          style={{
            fontSize: '1.4rem',
            width: '50px',
            height: '50px',
            minWidth: '50px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: isHovered
              ? 'linear-gradient(145deg, rgba(201, 162, 39, 0.28) 0%, rgba(140, 110, 30, 0.15) 100%)'
              : 'linear-gradient(145deg, rgba(201, 162, 39, 0.15) 0%, rgba(140, 110, 30, 0.08) 100%)',
            border: `2px solid ${isHovered ? 'rgba(201, 162, 39, 0.6)' : 'rgba(201, 162, 39, 0.35)'}`,
            borderRadius: '8px',
            boxShadow: isHovered 
              ? '0 0 20px rgba(201, 162, 39, 0.2)'
              : '0 2px 8px rgba(201, 162, 39, 0.08)',
            transition: 'all 0.2s ease',
            position: 'relative',
          }}
          onMouseEnter={handleIconMouseEnter}
          onMouseMove={handleIconMouseMove}
          onMouseLeave={handleIconMouseLeave}
        >
          {skill.icon}
          {/* Gloss effect */}
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '50%',
            background: 'linear-gradient(180deg, rgba(255,255,255,0.08) 0%, transparent 100%)',
            borderRadius: '6px 6px 0 0',
            pointerEvents: 'none',
          }} />
        </div>
        
        {/* Tooltip - rendered in portal */}
        {isTooltipVisible && createPortal(
          <SkillGemTooltip 
            skill={skill} 
            position={tooltipPosition}
          />,
          document.body
        )}
        
        <div style={{ flex: 1, minWidth: 0 }}>
          {/* Skill Name */}
          <div style={{ 
            color: isHovered ? '#f0e6d8' : '#e0d4c0', 
            fontFamily: "'Cinzel', Georgia, serif",
            fontWeight: 600, 
            fontSize: '1.05rem',
            marginBottom: '0.4rem',
            transition: 'color 0.2s ease',
            textShadow: isHovered ? '0 0 10px rgba(200, 175, 140, 0.3)' : '0 1px 2px rgba(0,0,0,0.3)',
          }}>
            {skill.name}
          </div>
          
          {/* Tags */}
          {skill.tags && skill.tags.length > 0 && (
            <div style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '0.3rem',
              marginBottom: '0.5rem'
            }}>
              {skill.tags.slice(0, 5).map((tag, idx) => (
                <span
                  key={idx}
                  className="skill-tag"
                  style={{ background: getTagColor(tag) }}
                >
                  {tag}
                </span>
              ))}
              {skill.tags.length > 5 && (
                <span style={{ fontSize: '0.55rem', color: 'rgba(160,150,130,0.6)', fontWeight: 500 }}>+{skill.tags.length - 5}</span>
              )}
            </div>
          )}
          
          {/* Stats row */}
          <div style={{ 
            fontSize: '0.7rem', 
            color: 'rgba(180, 175, 165, 0.9)', 
            display: 'flex', 
            flexWrap: 'wrap', 
            gap: '0.4rem' 
          }}>
            {skill.baseDamage && (
              <span style={{
                padding: '0.15rem 0.4rem',
                background: 'rgba(200, 80, 60, 0.15)',
                borderRadius: '3px',
                border: '1px solid rgba(200, 80, 60, 0.25)',
              }}>
                ⚔️ {skill.baseDamage}{skill.baseDamageMax ? `-${skill.baseDamageMax}` : ''}
              </span>
            )}
            {skill.baseHealing && (
              <span style={{
                padding: '0.15rem 0.4rem',
                background: 'rgba(80, 200, 120, 0.15)',
                borderRadius: '3px',
                border: '1px solid rgba(80, 200, 120, 0.25)',
              }}>
                💚 {skill.baseHealing}
              </span>
            )}
            <span style={{
              padding: '0.15rem 0.4rem',
              background: 'rgba(80, 120, 180, 0.15)',
              borderRadius: '3px',
              border: '1px solid rgba(80, 120, 180, 0.25)',
            }}>
              💧 {skill.manaCost}
            </span>
            {skill.cooldown > 0 && (
              <span style={{
                padding: '0.15rem 0.4rem',
                background: 'rgba(180, 140, 60, 0.15)',
                borderRadius: '3px',
                border: '1px solid rgba(180, 140, 60, 0.25)',
              }}>
                ⏱️ {skill.cooldown}s
              </span>
            )}
            <span style={{
              padding: '0.15rem 0.4rem',
              background: 'rgba(100, 180, 120, 0.12)',
              borderRadius: '3px',
              border: '1px solid rgba(100, 180, 120, 0.2)',
            }}>
              {skill.castTime > 0 ? `⏳ ${skill.castTime}s` : '⚡ Instant'}
            </span>
          </div>
        </div>
        
        {/* Select indicator */}
        <div style={{
          width: '28px',
          height: '28px',
          background: isHovered 
            ? 'linear-gradient(135deg, rgba(201, 162, 39, 0.35) 0%, rgba(201, 162, 39, 0.15) 100%)'
            : 'rgba(60, 55, 45, 0.3)',
          border: `1px solid ${isHovered ? 'rgba(201, 162, 39, 0.5)' : 'rgba(80, 70, 55, 0.3)'}`,
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '0.9rem',
          color: isHovered ? 'rgba(230, 200, 130, 0.9)' : 'rgba(120, 110, 95, 0.5)',
          transition: 'all 0.2s ease',
        }}>
          +
        </div>
      </div>
    </div>
  );
}

export function SkillPickerModal({ characterName, availableSkills, onSelect, onClose }: SkillPickerModalProps) {
  return createPortal(
    <div 
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0, 0, 0, 0.85)',
        backdropFilter: 'blur(4px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 10000,
      }}
      onClick={onClose}
    >
      <div 
        className="skill-picker-modal"
        onClick={e => e.stopPropagation()}
      >
        {/* Corner ornaments */}
        <div style={{ position: 'absolute', top: 8, left: 8, width: 24, height: 24, borderTop: '2px solid var(--accent-gold)', borderLeft: '2px solid var(--accent-gold)', borderRadius: '4px 0 0 0', pointerEvents: 'none', zIndex: 10 }} />
        <div style={{ position: 'absolute', top: 8, right: 8, width: 24, height: 24, borderTop: '2px solid var(--accent-gold)', borderRight: '2px solid var(--accent-gold)', borderRadius: '0 4px 0 0', pointerEvents: 'none', zIndex: 10 }} />
        <div style={{ position: 'absolute', bottom: 8, left: 8, width: 24, height: 24, borderBottom: '2px solid var(--accent-gold)', borderLeft: '2px solid var(--accent-gold)', borderRadius: '0 0 0 4px', pointerEvents: 'none', zIndex: 10 }} />
        <div style={{ position: 'absolute', bottom: 8, right: 8, width: 24, height: 24, borderBottom: '2px solid var(--accent-gold)', borderRight: '2px solid var(--accent-gold)', borderRadius: '0 0 4px 0', pointerEvents: 'none', zIndex: 10 }} />
        
        {/* Header */}
        <div style={{
          position: 'relative',
          padding: '1.25rem 1.5rem',
          background: 'linear-gradient(180deg, rgba(201, 162, 39, 0.15) 0%, rgba(201, 162, 39, 0.03) 100%)',
          borderBottom: '1px solid rgba(201, 162, 39, 0.3)',
        }}>
          {/* Top gold line */}
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '2px',
            background: 'linear-gradient(90deg, transparent, var(--accent-gold), transparent)',
          }} />
          
          {/* Center diamond */}
          <div style={{
            position: 'absolute',
            top: '-5px',
            left: '50%',
            transform: 'translateX(-50%) rotate(45deg)',
            width: '10px',
            height: '10px',
            background: 'linear-gradient(135deg, var(--accent-gold) 0%, var(--accent-gold-dim) 100%)',
            boxShadow: '0 0 15px rgba(201, 162, 39, 0.7)',
            borderRadius: '2px',
          }} />
          
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <h3 style={{
                margin: 0,
                fontFamily: "'Cinzel', Georgia, serif",
                fontSize: '1.25rem',
                fontWeight: 700,
                color: 'var(--accent-gold)',
                textShadow: '0 0 20px rgba(201, 162, 39, 0.5)',
              }}>
                Select Skill Gem
              </h3>
              <div style={{
                fontSize: '0.75rem',
                color: 'var(--text-dim)',
                marginTop: '0.25rem',
              }}>
                Equipping to <span style={{ color: 'var(--accent-gold)' }}>{characterName}</span>
              </div>
            </div>
            <button 
              onClick={onClose}
              style={{
                width: '32px',
                height: '32px',
                background: 'rgba(180, 60, 60, 0.2)',
                border: '1px solid rgba(180, 60, 60, 0.4)',
                borderRadius: '6px',
                color: 'rgba(255, 120, 120, 0.8)',
                fontSize: '1.25rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.15s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(220, 60, 60, 0.3)';
                e.currentTarget.style.color = '#fff';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(180, 60, 60, 0.2)';
                e.currentTarget.style.color = 'rgba(255, 120, 120, 0.8)';
              }}
            >
              ×
            </button>
          </div>
        </div>
        
        {/* Skills list */}
        <div style={{
          padding: '1rem 1.25rem',
          maxHeight: 'calc(80vh - 120px)',
          overflowY: 'auto',
          background: 'radial-gradient(ellipse at 50% 0%, rgba(201, 162, 39, 0.04) 0%, transparent 50%)',
        }}>
          {availableSkills.map(skill => (
            <SkillPickerItem 
              key={skill.id}
              skill={skill}
              onSelect={() => onSelect(skill.id)}
            />
          ))}
          
          {/* Bottom decorative element */}
          <div style={{
            marginTop: '1rem',
            height: '1px',
            background: 'linear-gradient(90deg, transparent, rgba(120, 100, 70, 0.4), transparent)',
            position: 'relative',
          }}>
            <div style={{
              position: 'absolute',
              left: '50%',
              top: '50%',
              transform: 'translate(-50%, -50%) rotate(45deg)',
              width: '6px',
              height: '6px',
              background: 'var(--accent-gold)',
              opacity: 0.4,
              borderRadius: '1px',
            }} />
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}

