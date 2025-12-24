import React, { useState, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { SUPPORT_GEMS, canSupportApplyToSkill } from '../../types/skills';
import type { SupportGem, SkillGem } from '../../types/skills';
import { getTagColor } from '../../utils/tagColors';

interface SupportPickerModalProps {
  skill: SkillGem;
  onSelect: (supportId: string) => void;
  onClose: () => void;
}

// Individual support item component for better click handling
function SupportItem({ support, onSelect }: { support: SupportGem; onSelect: () => void }) {
  const [isHovered, setIsHovered] = useState(false);
  
  // Use onMouseDown for immediate response - doesn't wait for re-renders
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (e.button === 0) { // Left click only
      e.preventDefault();
      onSelect();
    }
  }, [onSelect]);

  return (
    <div
      style={{
        background: 'linear-gradient(135deg, var(--bg-dark) 0%, var(--bg-card) 100%)',
        border: `2px solid ${isHovered ? 'var(--accent-green)' : 'var(--border-color)'}`,
        borderRadius: '10px',
        padding: '1rem',
        marginBottom: '0.5rem',
        cursor: 'pointer',
        transition: 'all 0.15s ease-out',
        transform: isHovered ? 'translateY(-2px)' : 'translateY(0)',
        boxShadow: isHovered ? '0 8px 20px rgba(46, 204, 113, 0.2)' : 'none'
      }}
      onMouseDown={handleMouseDown}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
        <div style={{
          fontSize: '1.5rem',
          width: '48px',
          height: '48px',
          minWidth: '48px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, rgba(46, 204, 113, 0.2) 0%, rgba(46, 204, 113, 0.05) 100%)',
          border: '2px solid var(--accent-green)',
          borderRadius: '8px',
          boxShadow: '0 4px 12px rgba(46, 204, 113, 0.2)'
        }}>
          {support.icon}
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ color: 'var(--accent-green)', fontWeight: 600, fontSize: '1rem' }}>
            {support.name}
          </div>
          <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '0.25rem', lineHeight: 1.4 }}>
            {support.description}
          </div>
          
          {/* Required Tags */}
          <div style={{ marginTop: '0.5rem' }}>
            <span style={{ fontSize: '0.7rem', color: 'var(--text-dim)', marginRight: '0.5rem' }}>Requires:</span>
            {support.requiredTags.length > 0 ? (
              <div style={{ display: 'inline-flex', flexWrap: 'wrap', gap: '0.25rem' }}>
                {support.requiredTags.map((tag, idx) => (
                  <span
                    key={idx}
                    style={{
                      fontSize: '0.55rem',
                      padding: '0.1rem 0.3rem',
                      borderRadius: '3px',
                      background: getTagColor(tag),
                      color: '#fff',
                      fontWeight: 500,
                      textTransform: 'uppercase',
                      letterSpacing: '0.3px',
                      boxShadow: '0 1px 3px rgba(0,0,0,0.3)'
                    }}
                  >
                    {tag}
                  </span>
                ))}
              </div>
            ) : (
              <span style={{
                fontSize: '0.6rem',
                padding: '0.1rem 0.35rem',
                borderRadius: '3px',
                background: 'linear-gradient(135deg, #10b981 0%, #047857 100%)',
                color: '#fff',
                fontWeight: 500
              }}>
                Any Skill
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export function SupportPickerModal({ skill, onSelect, onClose }: SupportPickerModalProps) {
  const availableSupports = SUPPORT_GEMS.filter(support => canSupportApplyToSkill(support, skill));

  return createPortal(
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h3>Select Support Gem</h3>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>
        <div className="modal-body">
          {availableSupports.map(support => (
            <SupportItem
              key={support.id}
              support={support}
              onSelect={() => onSelect(support.id)}
            />
          ))}
        </div>
      </div>
    </div>,
    document.body
  );
}

