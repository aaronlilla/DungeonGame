import React, { useState, useCallback, useMemo } from 'react';
import { createPortal } from 'react-dom';
import type { SkillGem, SkillCategory } from '../../types/skills';
import { getTagColor } from '../../utils/tagColors';
import { SkillGemTooltip } from './SkillGemTooltip';
import { GiPadlock, GiSwordWound, GiMagicSwirl, GiHealthPotion, GiShield, GiCog } from 'react-icons/gi';

interface SkillPickerModalProps {
  characterName: string;
  characterLevel: number;
  availableSkills: SkillGem[];
  onSelect: (skillId: string) => void;
  onClose: () => void;
}

type TabType = 'all' | SkillCategory;

// Category configuration
const CATEGORY_CONFIG: Record<SkillCategory | 'all', { label: string; icon: React.ReactNode; color: string }> = {
  all: { label: 'All Skills', icon: <GiCog />, color: '#c9a227' },
  attack: { label: 'Attacks', icon: <GiSwordWound />, color: '#ef4444' },
  spell: { label: 'Spells', icon: <GiMagicSwirl />, color: '#8b5cf6' },
  heal: { label: 'Healing', icon: <GiHealthPotion />, color: '#10b981' },
  defensive: { label: 'Defensive', icon: <GiShield />, color: '#3b82f6' },
  buff: { label: 'Buffs', icon: <GiMagicSwirl />, color: '#f59e0b' },
  debuff: { label: 'Debuffs', icon: <GiSwordWound />, color: '#ec4899' },
  utility: { label: 'Utility', icon: <GiCog />, color: '#6b7280' },
};

// Damage type colors
const DAMAGE_TYPE_COLORS: Record<string, string> = {
  physical: '#a8a29e',
  fire: '#f97316',
  cold: '#38bdf8',
  lightning: '#facc15',
  chaos: '#a855f7',
  nature: '#22c55e',
  arcane: '#8b5cf6',
  holy: '#fbbf24',
};

function SkillPickerItem({ 
  skill, 
  characterLevel, 
  onSelect 
}: { 
  skill: SkillGem; 
  characterLevel: number; 
  onSelect: () => void;
}) {
  const isLocked = skill.levelRequirement > characterLevel;
  const [isTooltipVisible, setIsTooltipVisible] = useState(false);
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
  
  const positionRef = React.useRef({ x: 0, y: 0 });
  
  const handleIconMouseEnter = useCallback((e: React.MouseEvent) => {
    positionRef.current = { x: e.clientX, y: e.clientY };
    setTooltipPosition({ x: e.clientX, y: e.clientY });
    setIsTooltipVisible(true);
  }, []);
  
  const handleIconMouseMove = useCallback((e: React.MouseEvent) => {
    positionRef.current = { x: e.clientX, y: e.clientY };
  }, []);
  
  const handleIconMouseLeave = useCallback(() => {
    setIsTooltipVisible(false);
  }, []);

  // Fixed: Use onMouseDown with immediate execution and proper event handling
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (e.button === 0 && !isLocked) {
      e.preventDefault();
      e.stopPropagation();
      // Call onSelect immediately before any state updates
      onSelect();
    }
  }, [onSelect, isLocked]);
  
  // Backup onClick handler
  const handleClick = useCallback((e: React.MouseEvent) => {
    if (isLocked) return;
    e.preventDefault();
    e.stopPropagation();
    onSelect();
  }, [onSelect, isLocked]);

  const damageTypeColor = skill.damageType ? DAMAGE_TYPE_COLORS[skill.damageType] : '#c9a227';
  
  // Convert hex to rgba for use in gradients
  const hexToRgba = (hex: string, alpha: number) => {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  };

  const hoverColor = damageTypeColor;
  // Hovered state colors
  const hoverColorRgba = hexToRgba(hoverColor, 0.12);
  const hoverColorRgbaDark = hexToRgba(hoverColor, 0.05);
  const borderColorRgba = hexToRgba(hoverColor, 0.5);
  const glowColorRgba = hexToRgba(hoverColor, 0.2);
  const iconBgRgba = hexToRgba(hoverColor, 0.28);
  const iconBgRgbaDark = hexToRgba(hoverColor, 0.15);
  const iconBorderRgba = hexToRgba(hoverColor, 0.6);
  // Non-hovered state colors (subtle tint)
  const borderColorRgbaLight = hexToRgba(hoverColor, 0.2);
  const iconBorderRgbaLight = hexToRgba(hoverColor, 0.25);
  const iconBgRgbaLight = hexToRgba(hoverColor, 0.08);

  return (
    <div
      style={{
        position: 'relative',
        padding: '0.875rem 1rem',
        background: isHovered 
          ? `linear-gradient(180deg, ${hoverColorRgba} 0%, ${hoverColorRgbaDark} 100%)`
          : `linear-gradient(180deg, ${hexToRgba(hoverColor, 0.03)} 0%, transparent 100%)`,
        border: `1px solid ${isHovered ? borderColorRgba : borderColorRgbaLight}`,
        borderRadius: '6px',
        boxShadow: isHovered 
          ? `0 4px 15px ${glowColorRgba}, inset 0 1px 0 rgba(255,255,255,0.03)`
          : 'inset 0 1px 0 rgba(255,255,255,0.02)',
        opacity: isLocked ? 0.6 : 1,
        filter: isLocked ? 'grayscale(0.4)' : 'none',
        cursor: isLocked ? 'not-allowed' : 'pointer',
        transition: 'all 0.2s ease',
        marginBottom: '0.5rem',
      }}
      onMouseDown={handleMouseDown}
      onClick={handleClick}
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
          ? `linear-gradient(90deg, transparent, ${borderColorRgba}, transparent)`
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
              ? `linear-gradient(145deg, ${iconBgRgba} 0%, ${iconBgRgbaDark} 100%)`
              : `linear-gradient(145deg, ${iconBgRgbaLight} 0%, ${hexToRgba(hoverColor, 0.04)} 100%)`,
            border: `2px solid ${isHovered ? iconBorderRgba : iconBorderRgbaLight}`,
            borderRadius: '8px',
            boxShadow: isHovered 
              ? `0 0 20px ${glowColorRgba}`
              : `0 2px 8px ${hexToRgba(hoverColor, 0.1)}`,
            transition: 'all 0.2s ease',
            position: 'relative',
          }}
          onMouseEnter={handleIconMouseEnter}
          onMouseMove={handleIconMouseMove}
          onMouseLeave={handleIconMouseLeave}
        >
          {skill.icon}
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
              <GiPadlock style={{ fontSize: '0.7rem', color: '#d4c4a8' }} />
            </div>
          )}
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
        
        {/* Tooltip */}
        {isTooltipVisible && createPortal(
          <SkillGemTooltip 
            skill={skill} 
            position={tooltipPosition}
          />,
          document.body
        )}
        
        <div style={{ flex: 1, minWidth: 0 }}>
          {/* Skill Name and Category */}
          <div style={{ 
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            marginBottom: '0.4rem',
          }}>
            <div style={{ 
              color: isLocked ? 'rgba(160, 150, 130, 0.6)' : (isHovered ? '#f0e6d8' : '#e0d4c0'), 
              fontFamily: "'Cinzel', Georgia, serif",
              fontWeight: 600, 
              fontSize: '1.05rem',
              transition: 'color 0.2s ease',
              textShadow: isHovered && !isLocked ? '0 0 10px rgba(200, 175, 140, 0.3)' : '0 1px 2px rgba(0,0,0,0.3)',
            }}>
              {skill.name}
            </div>
            {isLocked && (
              <span style={{
                fontSize: '0.7rem',
                color: 'rgba(180, 140, 100, 0.8)',
                fontWeight: 500,
              }}>
                (Level {skill.levelRequirement})
              </span>
            )}
            {damageTypeColor && (
              <div style={{
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                background: damageTypeColor,
                boxShadow: `0 0 6px ${damageTypeColor}80`,
              }} />
            )}
          </div>
          
          {/* Tags */}
          {skill.tags && skill.tags.length > 0 && (
            <div style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '0.3rem',
              marginBottom: '0.5rem'
            }}>
              {skill.tags.slice(0, 6).map((tag, idx) => (
                <span
                  key={idx}
                  className="skill-tag"
                  style={{ background: getTagColor(tag) }}
                >
                  {tag}
                </span>
              ))}
              {skill.tags.length > 6 && (
                <span style={{ fontSize: '0.55rem', color: 'rgba(160,150,130,0.6)', fontWeight: 500 }}>+{skill.tags.length - 6}</span>
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
            ? `linear-gradient(135deg, ${hexToRgba(hoverColor, 0.35)} 0%, ${hexToRgba(hoverColor, 0.15)} 100%)`
            : 'rgba(60, 55, 45, 0.3)',
          border: `1px solid ${isHovered ? borderColorRgba : 'rgba(80, 70, 55, 0.3)'}`,
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '0.9rem',
          color: isHovered ? hoverColor : 'rgba(120, 110, 95, 0.5)',
          transition: 'all 0.2s ease',
        }}>
          +
        </div>
      </div>
    </div>
  );
}

export function SkillPickerModal({ characterName, characterLevel, availableSkills, onSelect, onClose }: SkillPickerModalProps) {
  const [activeTab, setActiveTab] = useState<TabType>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Group skills by category and filter
  const { groupedSkills } = useMemo(() => {
    // Filter by search query
    let filtered = availableSkills;
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = availableSkills.filter(skill => 
        skill.name.toLowerCase().includes(query) ||
        skill.description.toLowerCase().includes(query) ||
        skill.tags?.some(tag => tag.toLowerCase().includes(query))
      );
    }

    // Filter by active tab
    if (activeTab !== 'all') {
      filtered = filtered.filter(skill => skill.category === activeTab);
    }

    // Group by damage type within category
    const grouped: Record<string, SkillGem[]> = {};
    filtered.forEach(skill => {
      const groupKey = skill.damageType || 'other';
      if (!grouped[groupKey]) {
        grouped[groupKey] = [];
      }
      grouped[groupKey].push(skill);
    });

    return { filteredSkills: filtered, groupedSkills: grouped };
  }, [availableSkills, activeTab, searchQuery]);

  // Get available tabs (only show tabs that have skills)
  const availableTabs = useMemo(() => {
    const tabs: TabType[] = ['all'];
    const categories = new Set(availableSkills.map(s => s.category));
    categories.forEach(cat => tabs.push(cat));
    return tabs;
  }, [availableSkills]);

  // Call onSelect synchronously, then close modal
  const handleSelectSkill = useCallback((skillId: string) => {
    // Call onSelect immediately - this will trigger equipSkillGem in parent
    onSelect(skillId);
    // Close modal immediately after - parent has already captured the slot value
    onClose();
  }, [onSelect, onClose]);

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
      onMouseDown={(e) => {
        // Only close if clicking directly on backdrop (not on modal content)
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      <div 
        className="skill-picker-modal"
        style={{
          width: '90vw',
          maxWidth: '1000px',
          maxHeight: '85vh',
          background: 'linear-gradient(180deg, rgba(18, 15, 12, 0.99) 0%, rgba(12, 10, 8, 0.99) 100%)',
          border: '2px solid rgba(201, 162, 39, 0.4)',
          borderRadius: '12px',
          boxShadow: '0 20px 60px rgba(0, 0, 0, 0.9), inset 0 1px 0 rgba(255,255,255,0.05)',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          position: 'relative',
        }}
        onMouseDown={(e) => e.stopPropagation()}
        onClick={(e) => e.stopPropagation()}
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
          flexShrink: 0,
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
          
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
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

          {/* Search bar */}
          <input
            type="text"
            placeholder="Search skills..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              width: '100%',
              padding: '0.5rem 0.75rem',
              background: 'rgba(0, 0, 0, 0.4)',
              border: '1px solid rgba(201, 162, 39, 0.3)',
              borderRadius: '6px',
              color: '#e0d4c0',
              fontSize: '0.85rem',
              fontFamily: 'inherit',
            }}
            onMouseDown={(e) => e.stopPropagation()}
            onClick={(e) => e.stopPropagation()}
          />
        </div>

        {/* Tabs */}
        <div style={{
          display: 'flex',
          gap: '0.5rem',
          padding: '0.75rem 1.5rem',
          background: 'rgba(0, 0, 0, 0.2)',
          borderBottom: '1px solid rgba(201, 162, 39, 0.2)',
          flexShrink: 0,
          overflowX: 'auto',
        }}>
          {availableTabs.map(tab => {
            const config = CATEGORY_CONFIG[tab];
            const isActive = activeTab === tab;
            return (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                style={{
                  padding: '0.5rem 1rem',
                  background: isActive 
                    ? `linear-gradient(180deg, ${config.color}40 0%, ${config.color}20 100%)`
                    : 'rgba(0, 0, 0, 0.3)',
                  border: `1px solid ${isActive ? config.color + '80' : 'rgba(201, 162, 39, 0.3)'}`,
                  borderRadius: '6px',
                  color: isActive ? config.color : 'rgba(200, 190, 170, 0.7)',
                  fontSize: '0.8rem',
                  fontWeight: isActive ? 600 : 500,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  transition: 'all 0.2s ease',
                  whiteSpace: 'nowrap',
                }}
                onMouseEnter={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.background = 'rgba(201, 162, 39, 0.15)';
                    e.currentTarget.style.borderColor = 'rgba(201, 162, 39, 0.5)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.background = 'rgba(0, 0, 0, 0.3)';
                    e.currentTarget.style.borderColor = 'rgba(201, 162, 39, 0.3)';
                  }
                }}
              >
                <span style={{ fontSize: '0.9rem' }}>{config.icon}</span>
                {config.label}
              </button>
            );
          })}
        </div>
        
        {/* Skills list - grouped by damage type */}
        <div style={{
          flex: 1,
          overflowY: 'auto',
          padding: '1rem 1.5rem',
          background: 'radial-gradient(ellipse at 50% 0%, rgba(201, 162, 39, 0.04) 0%, transparent 50%)',
        }}>
          {Object.keys(groupedSkills).length === 0 ? (
            <div style={{
              textAlign: 'center',
              padding: '3rem',
              color: 'rgba(160, 150, 130, 0.6)',
              fontSize: '0.9rem',
            }}>
              {searchQuery ? 'No skills found matching your search.' : 'No skills available in this category.'}
            </div>
          ) : (
            Object.entries(groupedSkills).map(([damageType, skills]) => (
              <div key={damageType} style={{ marginBottom: '1.5rem' }}>
                {/* Group header */}
                {damageType !== 'other' && (
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    marginBottom: '0.75rem',
                    paddingBottom: '0.5rem',
                    borderBottom: `1px solid ${DAMAGE_TYPE_COLORS[damageType] || '#c9a227'}40`,
                  }}>
                    <div style={{
                      width: '12px',
                      height: '12px',
                      borderRadius: '50%',
                      background: DAMAGE_TYPE_COLORS[damageType] || '#c9a227',
                      boxShadow: `0 0 8px ${DAMAGE_TYPE_COLORS[damageType] || '#c9a227'}80`,
                    }} />
                    <span style={{
                      fontSize: '0.75rem',
                      fontWeight: 700,
                      color: DAMAGE_TYPE_COLORS[damageType] || '#c9a227',
                      textTransform: 'uppercase',
                      letterSpacing: '0.1em',
                      fontFamily: "'Cinzel', Georgia, serif",
                    }}>
                      {damageType.charAt(0).toUpperCase() + damageType.slice(1)} Skills
                    </span>
                    <span style={{
                      fontSize: '0.65rem',
                      color: 'rgba(160, 150, 130, 0.6)',
                      marginLeft: 'auto',
                    }}>
                      {skills.length} {skills.length === 1 ? 'skill' : 'skills'}
                    </span>
                  </div>
                )}
                
                {/* Skills in this group */}
                {skills.map(skill => (
                  <SkillPickerItem 
                    key={skill.id}
                    skill={skill}
                    characterLevel={characterLevel}
                    onSelect={() => handleSelectSkill(skill.id)}
                  />
                ))}
              </div>
            ))
          )}
          
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
