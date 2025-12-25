import React, { useState, useCallback } from 'react';
import { createPortal } from 'react-dom';
import type { SkillGem } from '../../types/skills';
import type { Character } from '../../types/character';
import { GiShieldBash, GiHealthPotion, GiBroadsword, GiPadlock } from 'react-icons/gi';
import { getTagColor } from '../../utils/tagColors';
import { SkillGemTooltip } from './SkillGemTooltip';

const ROLE_ICONS: Record<string, React.ReactNode> = {
  tank: <GiShieldBash />,
  healer: <GiHealthPotion />,
  dps: <GiBroadsword />
};

interface AvailableSkillsListProps {
  character: Character;
  availableSkills: SkillGem[];
  onEquipSkill: (skillId: string) => void;
  getEquippedSkill: (slotIndex: number) => SkillGem | undefined;
}

// Individual skill item with tooltip
function SkillItem({
  skill,
  isEquipped,
  characterLevel,
  onClick,
}: {
  skill: SkillGem;
  isEquipped: boolean;
  characterLevel: number;
  onClick: () => void;
}) {
  const isLocked = skill.levelRequirement > characterLevel;
  const [isTooltipVisible, setIsTooltipVisible] = useState(false);
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
  
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

  // Use onMouseDown for immediate response - doesn't wait for re-renders
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (e.button === 0 && !isEquipped && !isLocked) { // Left click only, not equipped, and not locked
      e.preventDefault();
      onClick();
    }
  }, [onClick, isEquipped, isLocked]);
  
  return (
    <div 
      className={`available-skill-item ${isEquipped ? 'equipped' : ''} ${isHovered ? 'hovered' : ''}`}
      onMouseDown={handleMouseDown}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        opacity: isLocked ? 0.6 : 1,
        filter: isLocked ? 'grayscale(0.4)' : 'none',
        cursor: isLocked ? 'not-allowed' : 'pointer',
      }}
    >
      {isEquipped && (
        <div style={{
          position: 'absolute',
          top: '0.4rem',
          right: '0.4rem',
          background: 'linear-gradient(135deg, rgba(46, 204, 113, 0.9) 0%, rgba(39, 174, 96, 0.9) 100%)',
          color: 'white',
          borderRadius: '50%',
          width: '18px',
          height: '18px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '0.65rem',
          boxShadow: '0 2px 6px rgba(46, 204, 113, 0.35)'
        }}>
          ✓
        </div>
      )}
      
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
        {/* Skill Icon */}
        <div 
          style={{
            fontSize: '1.15rem',
            width: '36px',
            height: '36px',
            minWidth: '36px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: isHovered
              ? 'linear-gradient(145deg, rgba(201, 162, 39, 0.25) 0%, rgba(140, 110, 30, 0.15) 100%)'
              : 'linear-gradient(145deg, rgba(201, 162, 39, 0.15) 0%, rgba(140, 110, 30, 0.08) 100%)',
            border: `1.5px solid ${isHovered ? 'rgba(201, 162, 39, 0.5)' : 'rgba(201, 162, 39, 0.3)'}`,
            borderRadius: '6px',
            boxShadow: isHovered 
              ? '0 0 12px rgba(201, 162, 39, 0.15)' 
              : 'inset 0 1px 0 rgba(255,255,255,0.05)',
            transition: 'all 0.2s ease',
            position: 'relative',
          }}
          onMouseEnter={handleMouseEnter}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
        >
          {skill.icon}
          {/* Lock icon overlay */}
          {isLocked && (
            <div style={{
              position: 'absolute',
              top: '2px',
              right: '2px',
              background: 'rgba(100, 80, 60, 0.9)',
              borderRadius: '4px',
              padding: '2px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 2px 4px rgba(0, 0, 0, 0.5)',
              zIndex: 10,
            }}
            title={`Locked: Requires Level ${skill.levelRequirement}`}
            >
              <GiPadlock style={{ fontSize: '0.6rem', color: '#d4c4a8' }} />
            </div>
          )}
          {/* Gloss */}
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '45%',
            background: 'linear-gradient(180deg, rgba(255,255,255,0.06) 0%, transparent 100%)',
            pointerEvents: 'none',
            borderRadius: '5px 5px 0 0',
          }} />
        </div>
        
        {/* Tooltip */}
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
            color: isLocked ? 'rgba(160, 150, 130, 0.6)' : (isEquipped ? 'rgba(46, 204, 113, 0.9)' : isHovered ? '#e2d0ff' : '#d4c4a8'), 
            fontFamily: "'Cinzel', Georgia, serif",
            fontWeight: 600,
            fontSize: '0.9rem',
            marginBottom: '0.35rem',
            transition: 'color 0.2s ease',
            textShadow: isHovered && !isLocked ? '0 0 8px rgba(180, 150, 220, 0.3)' : 'none',
            display: 'flex',
            alignItems: 'center',
            gap: '0.4rem',
          }}>
            {skill.name}
            {isLocked && (
              <span style={{
                fontSize: '0.65rem',
                color: 'rgba(180, 140, 100, 0.8)',
                fontWeight: 500,
              }}>
                (Level {skill.levelRequirement})
              </span>
            )}
          </div>
          
          {/* Tags */}
          {skill.tags && skill.tags.length > 0 && (
            <div style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '0.25rem',
              marginBottom: '0.3rem'
            }}>
              {skill.tags.slice(0, 3).map((tag, idx) => (
                <span
                  key={idx}
                  className="skill-tag"
                  style={{ background: getTagColor(tag), fontSize: '0.58rem', padding: '0.18rem 0.4rem' }}
                >
                  {tag}
                </span>
              ))}
              {skill.tags.length > 3 && (
                <span style={{
                  fontSize: '0.52rem',
                  padding: '0.18rem 0.25rem',
                  color: 'rgba(160,150,130,0.6)',
                  fontWeight: 500,
                }}>
                  +{skill.tags.length - 3}
                </span>
              )}
            </div>
          )}
          
          {/* Stats row */}
          <div style={{ 
            display: 'flex', 
            flexWrap: 'wrap', 
            gap: '0.35rem',
            fontSize: '0.65rem',
            color: 'rgba(180,175,165,0.9)',
          }}>
            <span style={{
              padding: '0.12rem 0.35rem',
              background: 'rgba(80,120,180,0.15)',
              borderRadius: '3px',
              border: '1px solid rgba(80,120,180,0.25)',
            }}>
              💧 {skill.manaCost}
            </span>
            {skill.cooldown > 0 && (
              <span style={{
                padding: '0.12rem 0.35rem',
                background: 'rgba(180,140,60,0.12)',
                borderRadius: '3px',
                border: '1px solid rgba(180,140,60,0.2)',
              }}>
                ⏱️ {skill.cooldown}s
              </span>
            )}
            <span style={{
              padding: '0.12rem 0.35rem',
              background: 'rgba(100,180,120,0.12)',
              borderRadius: '3px',
              border: '1px solid rgba(100,180,120,0.2)',
            }}>
              {skill.castTime > 0 ? `⏳ ${skill.castTime}s` : '⚡ Instant'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export function AvailableSkillsList({ 
  character, 
  availableSkills, 
  onEquipSkill
}: AvailableSkillsListProps) {
  // Corner ornament style helper
  const cornerStyle = (position: 'tl' | 'tr' | 'bl' | 'br'): React.CSSProperties => ({
    position: 'absolute',
    width: '18px',
    height: '18px',
    pointerEvents: 'none',
    zIndex: 10,
    ...(position === 'tl' && { top: 5, left: 5, borderTop: '2px solid var(--accent-gold)', borderLeft: '2px solid var(--accent-gold)', borderRadius: '3px 0 0 0' }),
    ...(position === 'tr' && { top: 5, right: 5, borderTop: '2px solid var(--accent-gold)', borderRight: '2px solid var(--accent-gold)', borderRadius: '0 3px 0 0' }),
    ...(position === 'bl' && { bottom: 5, left: 5, borderBottom: '2px solid var(--accent-gold)', borderLeft: '2px solid var(--accent-gold)', borderRadius: '0 0 0 3px' }),
    ...(position === 'br' && { bottom: 5, right: 5, borderBottom: '2px solid var(--accent-gold)', borderRight: '2px solid var(--accent-gold)', borderRadius: '0 0 3px 0' }),
  });

  return (
    <div 
      className="available-skills-panel"
      style={{ 
        display: 'flex', 
        flexDirection: 'column', 
        height: '100%', 
        minHeight: 0, 
        flex: 1,
      }}
    >
      {/* Corner ornaments */}
      <div style={cornerStyle('tl')} />
      <div style={cornerStyle('tr')} />
      <div style={cornerStyle('bl')} />
      <div style={cornerStyle('br')} />
      
      {/* Grand Header */}
      <div style={{
        position: 'relative',
        padding: '1rem 1.25rem',
        background: `linear-gradient(180deg, rgba(201, 162, 39, 0.1) 0%, rgba(201, 162, 39, 0.02) 100%)`,
        borderBottom: `1px solid rgba(201, 162, 39, 0.2)`,
        flexShrink: 0,
      }}>
        {/* Top gold line */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '1px',
          background: `linear-gradient(90deg, transparent, var(--accent-gold), transparent)`,
        }} />
        
        {/* Center diamond decoration */}
        <div style={{
          position: 'absolute',
          top: '-4px',
          left: '50%',
          transform: 'translateX(-50%) rotate(45deg)',
          width: '8px',
          height: '8px',
          background: 'linear-gradient(135deg, var(--accent-gold) 0%, var(--accent-gold-dim) 100%)',
          boxShadow: '0 0 10px rgba(201, 162, 39, 0.6)',
          borderRadius: '1px',
        }} />
        
        <h3 style={{
          margin: 0,
          fontFamily: "'Cinzel', Georgia, serif",
          fontSize: '1rem',
          fontWeight: 700,
          color: 'var(--accent-gold)',
          textTransform: 'uppercase',
          letterSpacing: '0.08em',
          textShadow: '0 0 20px rgba(201, 162, 39, 0.4)',
          textAlign: 'center',
        }}>
          Skill Library
        </h3>
        
        {/* Bottom accent line */}
        <div style={{
          position: 'absolute',
          bottom: '-1px',
          left: '15%',
          right: '15%',
          height: '1px',
          background: 'linear-gradient(90deg, transparent, rgba(201, 162, 39, 0.4), transparent)',
        }} />
      </div>
      
      {/* Role indicator */}
      <div style={{ 
        padding: '0.75rem 1rem',
        borderBottom: '1px solid rgba(80,70,55,0.3)',
        background: 'rgba(0,0,0,0.2)',
      }}>
        <div style={{ 
          fontSize: '0.75rem', 
          color: 'rgba(200,195,185,0.8)', 
          padding: '0.5rem 0.75rem',
          background: 'linear-gradient(135deg, rgba(201,162,39,0.08) 0%, transparent 100%)',
          borderRadius: '4px',
          border: '1px solid rgba(201,162,39,0.2)',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          fontWeight: 500
        }}>
          <span style={{ fontSize: '1rem', color: 'var(--accent-gold)' }}>{ROLE_ICONS[character.role]}</span>
          <span>
            Showing <strong style={{ color: '#d4c4a8' }}>{character.role.toUpperCase()}</strong> + Universal Skills
          </span>
        </div>
      </div>
      
      {/* Skills list */}
      <div style={{ 
        flex: 1, 
        overflowY: 'auto', 
        minHeight: 0, 
        padding: '0.75rem', 
        paddingBottom: '2rem',
        background: 'radial-gradient(ellipse at 50% 0%, rgba(201,162,39,0.04) 0%, transparent 50%)',
      }}>
        {/* Sort skills: unequipped first, equipped at bottom */}
        {[...availableSkills]
          .sort((a, b) => {
            const aEquipped = character.skillGems.some(s => s.skillGemId === a.id);
            const bEquipped = character.skillGems.some(s => s.skillGemId === b.id);
            if (aEquipped === bEquipped) return 0;
            return aEquipped ? 1 : -1;
          })
          .map(skill => {
            const isEquipped = character.skillGems.some(s => s.skillGemId === skill.id);
            return (
              <SkillItem
                key={skill.id}
                skill={skill}
                isEquipped={isEquipped}
                characterLevel={character.level}
                onClick={() => {
                  if (!isEquipped && skill.levelRequirement <= character.level) {
                    onEquipSkill(skill.id);
                  }
                }}
              />
            );
          })}
        
        {/* Bottom decorative divider */}
        <div style={{
          marginTop: '1rem',
          height: '1px',
          background: 'linear-gradient(90deg, transparent, rgba(120, 100, 70, 0.3), transparent)',
          position: 'relative',
        }}>
          <div style={{
            position: 'absolute',
            left: '50%',
            top: '50%',
            transform: 'translate(-50%, -50%) rotate(45deg)',
            width: '5px',
            height: '5px',
            background: 'var(--accent-gold)',
            opacity: 0.3,
            borderRadius: '1px',
          }} />
        </div>
      </div>
    </div>
  );
}


