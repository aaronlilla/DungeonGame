import { useState } from 'react';
import { useGameStore } from '../store/gameStore';
import { getSkillsForRole, getSkillGemById, getSupportGemById } from '../types/skills';
import type { SkillGem, SupportGem } from '../types/skills';
import { CharacterSelector } from './shared/CharacterSelector';
import { SkillSlot } from './skills/SkillSlot';
import { SkillPickerModal } from './skills/SkillPickerModal';
import { SupportPickerModal } from './skills/SupportPickerModal';
import { AvailableSkillsList } from './skills/AvailableSkillsList';
import { GiMagicSwirl, GiStarFormation } from 'react-icons/gi';
import { getClassById } from '../types/classes';
import { getEnabledSkillSlots, getEnabledSupportSlots, getRequiredLevelForSkillSlot } from '../types/character';

// Corner ornament component for grand styling
function CornerOrnaments({ color = 'var(--accent-gold)' }: { color?: string }) {
  const cornerStyle = (position: 'tl' | 'tr' | 'bl' | 'br'): React.CSSProperties => ({
    position: 'absolute',
    width: '20px',
    height: '20px',
    pointerEvents: 'none',
    ...(position === 'tl' && { top: 6, left: 6, borderTop: `2px solid ${color}`, borderLeft: `2px solid ${color}`, borderRadius: '4px 0 0 0' }),
    ...(position === 'tr' && { top: 6, right: 6, borderTop: `2px solid ${color}`, borderRight: `2px solid ${color}`, borderRadius: '0 4px 0 0' }),
    ...(position === 'bl' && { bottom: 6, left: 6, borderBottom: `2px solid ${color}`, borderLeft: `2px solid ${color}`, borderRadius: '0 0 0 4px' }),
    ...(position === 'br' && { bottom: 6, right: 6, borderBottom: `2px solid ${color}`, borderRight: `2px solid ${color}`, borderRadius: '0 0 4px 0' }),
  });

  return (
    <>
      <div style={cornerStyle('tl')} />
      <div style={cornerStyle('tr')} />
      <div style={cornerStyle('bl')} />
      <div style={cornerStyle('br')} />
    </>
  );
}

export function SkillsTab() {
  const { 
    team, 
    selectedCharacterId,
    selectCharacter, 
    equipSkillGem,
    unequipSkillGem,
    equipSupportGem,
    unequipSupportGem,
    updateSkillUsageConfig
  } = useGameStore();

  const [selectedSlot, setSelectedSlot] = useState<number | null>(null);
  const [selectedSupportSlot, setSelectedSupportSlot] = useState<{ skillSlot: number; supportSlot: number } | null>(null);
  const [showSkillPicker, setShowSkillPicker] = useState(false);
  const [showSupportPicker, setShowSupportPicker] = useState(false);

  const selectedCharacter = team.find(c => c.id === selectedCharacterId);

  if (!selectedCharacter) {
    return (
      <div className="panel">
        <div className="panel-content" style={{ textAlign: 'center', padding: '3rem' }}>
          <h3 style={{ color: 'var(--text-dim)' }}>Select a character from the Team tab</h3>
        </div>
      </div>
    );
  }

  const availableSkills = getSkillsForRole(selectedCharacter.role);

  const handleSelectSkill = (skillId: string) => {
    if (selectedSlot !== null) {
      const slotToEquip = selectedSlot; // Capture the slot value before clearing state
      equipSkillGem(selectedCharacter.id, slotToEquip, skillId);
      setShowSkillPicker(false);
      setSelectedSlot(null);
    }
  };

  const handleSelectSupport = (supportId: string) => {
    if (selectedSupportSlot) {
      const slotToEquip = selectedSupportSlot; // Capture the slot value before clearing state
      equipSupportGem(
        selectedCharacter.id, 
        slotToEquip.skillSlot, 
        slotToEquip.supportSlot, 
        supportId
      );
      setShowSupportPicker(false);
      setSelectedSupportSlot(null);
    }
  };

  const getEquippedSkill = (slotIndex: number): SkillGem | undefined => {
    const equipped = selectedCharacter.skillGems.find(s => s.slotIndex === slotIndex);
    return equipped ? getSkillGemById(equipped.skillGemId) : undefined;
  };

  const getEquippedSupports = (slotIndex: number): (SupportGem | undefined)[] => {
    const equipped = selectedCharacter.skillGems.find(s => s.slotIndex === slotIndex);
    if (!equipped) return [];
    return equipped.supportGemIds.map(id => getSupportGemById(id));
  };

  const getUsageConfig = (slotIndex: number) => {
    const equipped = selectedCharacter.skillGems.find(s => s.slotIndex === slotIndex);
    return equipped?.usageConfig;
  };

  const handleEquipSkill = (skillId: string) => {
    const enabledSlots = getEnabledSkillSlots(selectedCharacter.level);
    const emptySlot = Array.from({ length: enabledSlots }, (_, i) => i).find(i => !getEquippedSkill(i));
    if (emptySlot !== undefined) {
      equipSkillGem(selectedCharacter.id, emptySlot, skillId);
    }
  };
  
  const enabledSkillSlots = getEnabledSkillSlots(selectedCharacter.level);
  const enabledSupportSlots = getEnabledSupportSlots(selectedCharacter.level);

  // Universal arcane/gold color scheme for skills page
  const themeColors = {
    primary: '#c9a227',      // Gold
    secondary: '#8b7019',    // Dark gold
    accent: '#b8a078',       // Warm tan
    glow: 'rgba(201, 162, 39, 0.12)',
  };

  const equippedCount = selectedCharacter.skillGems.filter(s => s.skillGemId).length;

  return (
    <div style={{ 
      display: 'grid', 
      gridTemplateColumns: '260px 1fr 320px', 
      gap: '1rem',
      height: 'calc(100vh - 90px)',
      overflow: 'hidden',
      padding: '0.5rem 1rem'
    }}>
      {/* Left Panel - Character Selector */}
      <div style={{ 
        display: 'flex', 
        flexDirection: 'column', 
        height: '100%', 
        minHeight: 0,
        position: 'relative',
      }}>
        <CharacterSelector
          team={team}
          selectedCharacterId={selectedCharacterId}
          onSelectCharacter={selectCharacter}
          getCharacterInfo={(char) => {
            const skillCount = char.skillGems.filter(s => s.skillGemId).length;
            const enabledSlots = getEnabledSkillSlots(char.level);
            return `${skillCount}/${enabledSlots} skills equipped`;
          }}
        />
      </div>

      {/* Center Panel - Skill Slots */}
      <div 
        className="skill-slots-panel"
        style={{ 
          display: 'flex', 
          flexDirection: 'column', 
          height: '100%', 
          minHeight: 0, 
          minWidth: 0,
        }}
      >
        <CornerOrnaments color={themeColors.primary + '90'} />
        
        {/* Grand Header */}
        <div style={{
          padding: '1rem 1.25rem',
          background: `linear-gradient(180deg, ${themeColors.primary}12 0%, ${themeColors.primary}02 100%)`,
          borderBottom: `1px solid ${themeColors.primary}25`,
          position: 'relative',
        }}>
          {/* Top gold line */}
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '1px',
            background: `linear-gradient(90deg, transparent, ${themeColors.primary}80, transparent)`,
          }} />
          
          {/* Decorative center diamond */}
          <div style={{
            position: 'absolute',
            top: '-4px',
            left: '50%',
            transform: 'translateX(-50%) rotate(45deg)',
            width: '8px',
            height: '8px',
            background: `linear-gradient(135deg, ${themeColors.primary} 0%, ${themeColors.secondary} 100%)`,
            boxShadow: `0 0 12px ${themeColors.primary}80`,
            borderRadius: '1px',
          }} />
          
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <div style={{
                width: '36px',
                height: '36px',
                background: `linear-gradient(135deg, ${themeColors.primary}30 0%, ${themeColors.secondary}15 100%)`,
                border: `2px solid ${themeColors.primary}60`,
                borderRadius: '6px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.1rem',
                boxShadow: `0 0 15px ${themeColors.primary}30`,
              }}>
                <GiMagicSwirl style={{ color: themeColors.primary }} />
              </div>
              <div>
                <h3 style={{
                  margin: 0,
                  fontFamily: "'Cinzel', Georgia, serif",
                  fontSize: '1.1rem',
                  fontWeight: 700,
                  color: themeColors.primary,
                  textShadow: `0 0 20px ${themeColors.primary}40`,
                }}>
                  {(() => {
                    const classData = selectedCharacter.classId ? getClassById(selectedCharacter.classId) : null;
                    return classData?.name || selectedCharacter.role.toUpperCase();
                  })()}
                </h3>
                <div style={{
                  fontSize: '0.7rem',
                  color: 'var(--text-dim)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.08em',
                  marginTop: '2px',
                }}>
                  Skill Gem Configuration
                </div>
              </div>
            </div>
            
            {/* Slot counter badge */}
            <div style={{
              background: `linear-gradient(135deg, ${themeColors.primary}20 0%, ${themeColors.secondary}10 100%)`,
              border: `1px solid ${themeColors.primary}40`,
              borderRadius: '20px',
              padding: '0.4rem 0.8rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
            }}>
              <GiStarFormation style={{ color: themeColors.primary, fontSize: '0.9rem' }} />
              <span style={{ 
                fontFamily: "'Cinzel', Georgia, serif",
                fontSize: '0.8rem',
                fontWeight: 600,
                color: equippedCount === enabledSkillSlots ? 'var(--accent-green)' : themeColors.primary,
              }}>
                {equippedCount}/{enabledSkillSlots}
              </span>
            </div>
          </div>
        </div>
        
        {/* Skills content */}
        <div style={{ 
          flex: 1, 
          overflowY: 'auto', 
          minHeight: 0, 
          padding: '1rem',
          background: `radial-gradient(ellipse at 50% 0%, ${themeColors.glow} 0%, transparent 60%)`,
        }}>
          <div className="skill-slots">
            {[0, 1, 2, 3, 4, 5, 6].map(slotIndex => {
              const skill = getEquippedSkill(slotIndex);
              const supports = getEquippedSupports(slotIndex);
              const usageConfig = getUsageConfig(slotIndex);
              const isEnabled = slotIndex < enabledSkillSlots;
              const requiredLevel = getRequiredLevelForSkillSlot(slotIndex);
              
              return (
                <SkillSlot
                  key={slotIndex}
                  slotIndex={slotIndex}
                  skill={skill}
                  supports={supports}
                  usageConfig={usageConfig}
                  isEnabled={isEnabled}
                  requiredLevel={requiredLevel}
                  enabledSupportSlots={enabledSupportSlots}
                  onSelectSlot={() => {
                    if (isEnabled) {
                      setSelectedSlot(slotIndex);
                      setShowSkillPicker(true);
                    }
                  }}
                  onUnequipSkill={() => {
                    if (isEnabled) {
                      unequipSkillGem(selectedCharacter.id, slotIndex);
                    }
                  }}
                  onSelectSupportSlot={(supportIndex) => {
                    if (isEnabled) {
                      setSelectedSupportSlot({ skillSlot: slotIndex, supportSlot: supportIndex });
                      setShowSupportPicker(true);
                    }
                  }}
                  onUnequipSupport={(supportIndex) => {
                    if (isEnabled) {
                      unequipSupportGem(selectedCharacter.id, slotIndex, supportIndex);
                    }
                  }}
                  onUpdateUsageConfig={(usageConf) => {
                    if (isEnabled) {
                      updateSkillUsageConfig(selectedCharacter.id, slotIndex, usageConf);
                    }
                  }}
                />
              );
            })}
          </div>
          
          {/* Bottom decorative divider */}
          <div style={{
            marginTop: '1.5rem',
            height: '1px',
            background: `linear-gradient(90deg, transparent, ${themeColors.primary}30, transparent)`,
            position: 'relative',
          }}>
            <div style={{
              position: 'absolute',
              left: '50%',
              top: '50%',
              transform: 'translate(-50%, -50%) rotate(45deg)',
              width: '6px',
              height: '6px',
              background: themeColors.primary,
              opacity: 0.4,
              borderRadius: '1px',
            }} />
          </div>
        </div>
      </div>

      {/* Right Panel - Available Skills */}
      <div style={{ 
        display: 'flex', 
        flexDirection: 'column', 
        height: '100%', 
        minHeight: 0, 
        minWidth: 0,
        position: 'relative',
      }}>
        <AvailableSkillsList
          character={selectedCharacter}
          availableSkills={availableSkills}
          onEquipSkill={handleEquipSkill}
          getEquippedSkill={getEquippedSkill}
        />
      </div>

      {showSkillPicker && (
        <SkillPickerModal
          characterName={(() => {
            const classData = selectedCharacter.classId ? getClassById(selectedCharacter.classId) : null;
            return classData?.name || selectedCharacter.role.toUpperCase();
          })()}
          characterLevel={selectedCharacter.level}
          availableSkills={availableSkills}
          onSelect={handleSelectSkill}
          onClose={() => {
            setShowSkillPicker(false);
            setSelectedSlot(null);
          }}
        />
      )}

      {showSupportPicker && selectedSupportSlot && (() => {
        const skill = getEquippedSkill(selectedSupportSlot.skillSlot);
        if (!skill) return null;
        return (
          <SupportPickerModal
            skill={skill}
            onSelect={handleSelectSupport}
            onClose={() => {
              setShowSupportPicker(false);
              setSelectedSupportSlot(null);
            }}
          />
        );
      })()}
    </div>
  );
}
