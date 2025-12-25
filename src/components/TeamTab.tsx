import React, { useState, useCallback, useMemo, memo } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore } from '../store/gameStore';
import type { Character, CharacterRole, GearSlot } from '../types/character';
import { getEnabledSkillSlots } from '../types/character';
import { getExperienceProgress } from '../utils/leveling';
import { getSkillGemById, getSupportGemById } from '../types/skills';
import type { Item } from '../types/items';
import { SkillGemTooltip } from './skills/SkillGemTooltip';
import { AddCharacterModal } from './team/AddCharacterModal';
import { EditCharacterModal } from './team/EditCharacterModal';
import { getClassById, getClassBackground, getClassColor } from '../types/classes';
import { ItemTooltip } from './shared/ItemTooltip';
import { calculateTotalCharacterStats } from '../systems/equipmentStats';
import { calculateArmorReduction, calculateEvasionChance } from '../types/character';
import { getMonsterStatsForLevel } from '../utils/monsterStats';
import { generateRandomCharacterName } from '../utils/characterNames';
import { 
  GiShieldBash, GiHealthPotion, GiBroadsword, GiWizardStaff,
  GiHelmet, GiChestArmor, GiGloves, GiBelt, GiBoots,
  GiSwordman, GiShield, GiNecklace, GiGemPendant, GiRing
} from 'react-icons/gi';

// =============== ANIMATION CSS ===============
const AnimationStyles = () => (
  <style>{`
    @keyframes fadeOutScale {
      0% { 
        opacity: 1; 
        transform: scale(1);
      }
      100% { 
        opacity: 0; 
        transform: scale(0.8);
      }
    }
    
    @keyframes glowPulse {
      0%, 100% { 
        box-shadow: 0 0 15px var(--glow-color), 0 0 30px var(--glow-color);
        opacity: 0.9;
      }
      50% { 
        box-shadow: 0 0 20px var(--glow-color), 0 0 40px var(--glow-color);
        opacity: 1;
      }
    }
    
    @keyframes fadeIn {
      0% { 
        opacity: 0;
      }
      100% { 
        opacity: 1;
      }
    }
    
    @keyframes slideInUp {
      0% { 
        opacity: 0; 
        transform: translateY(20px);
      }
      100% { 
        opacity: 1; 
        transform: translateY(0);
      }
    }
    
    .glow-pulse {
      animation: glowPulse 2s ease-in-out infinite;
    }
    
    .character-card-enter {
      animation: slideInUp 0.3s ease-out forwards;
    }
  `}</style>
);

// =============== SIMPLIFIED EFFECTS ===============
// Removed complex particle systems for better performance


const ROLE_COLORS = {
  tank: { primary: '#3498db', secondary: 'rgba(52, 152, 219, 0.2)', border: 'rgba(52, 152, 219, 0.5)' },
  healer: { primary: '#2ecc71', secondary: 'rgba(46, 204, 113, 0.2)', border: 'rgba(46, 204, 113, 0.5)' },
  dps: { primary: '#e74c3c', secondary: 'rgba(231, 76, 60, 0.2)', border: 'rgba(231, 76, 60, 0.5)' },
};

const ROLE_ICONS: Record<string, React.ReactNode> = {
  tank: <GiShieldBash />,
  healer: <GiHealthPotion />,
  dps: <GiBroadsword />
};

const ROLE_PORTRAITS: Record<string, React.ReactNode> = {
  tank: <GiShieldBash />,
  healer: <GiHealthPotion />,
  dps: <GiWizardStaff />
};

const GEAR_SLOT_ICONS: Record<GearSlot, React.ReactNode> = {
  head: <GiHelmet />,
  chest: <GiChestArmor />,
  hands: <GiGloves />,
  waist: <GiBelt />,
  feet: <GiBoots />,
  mainHand: <GiSwordman />,
  offHand: <GiShield />,
  neck: <GiNecklace />,
  ring1: <GiRing />,
  ring2: <GiRing />,
  trinket1: <GiGemPendant />,
  trinket2: <GiGemPendant />,
};

const GEAR_SLOT_NAMES: Record<GearSlot, string> = {
  head: 'Head',
  chest: 'Chest',
  hands: 'Hands',
  waist: 'Waist',
  feet: 'Feet',
  mainHand: 'Main Hand',
  offHand: 'Off Hand',
  neck: 'Neck',
  ring1: 'Ring 1',
  ring2: 'Ring 2',
  trinket1: 'Trinket 1',
  trinket2: 'Trinket 2',
};

// Item Tooltip Component - now uses shared component (imported above)

// Equipment Slot Component
function EquipmentSlot({ 
  slot, 
  item
}: { 
  slot: GearSlot; 
  item: Item | undefined;
  roleColor: string;
}) {
  const [showTooltip, setShowTooltip] = useState(false);
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });

  const handleMouseEnter = useCallback((e: React.MouseEvent) => {
    if (item) {
      setTooltipPos({ x: e.clientX, y: e.clientY });
      setShowTooltip(true);
    }
  }, [item]);

  const rarityBorders: Record<string, string> = {
    normal: '#555',
    magic: '#4444aa',
    rare: '#aaaa00',
    unique: '#af6025',
  };

  return (
    <>
      <div
        style={{
          width: '32px',
          height: '32px',
          background: item 
            ? `linear-gradient(135deg, ${rarityBorders[item.rarity]}33 0%, rgba(20,20,25,0.9) 100%)`
            : 'rgba(20, 20, 25, 0.6)',
          border: `2px solid ${item ? rarityBorders[item.rarity] : '#333'}`,
          borderRadius: '6px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '1rem',
          color: item ? '#ddd' : '#444',
          cursor: item ? 'pointer' : 'default',
          transition: 'all 0.15s ease',
        }}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={() => setShowTooltip(false)}
        title={!item ? GEAR_SLOT_NAMES[slot] : undefined}
      >
        {GEAR_SLOT_ICONS[slot]}
      </div>
      {showTooltip && item && createPortal(
        <ItemTooltip item={item} position={tooltipPos} />,
        document.body
      )}
    </>
  );
}

// Skill Gem Display Component
function SkillGemDisplay({ 
  skillGemId, 
  supportGemIds
}: { 
  skillGemId: string; 
  supportGemIds: string[];
  roleColor: string;
}) {
  const [showTooltip, setShowTooltip] = useState(false);
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });
  
  const skill = getSkillGemById(skillGemId);
  if (!skill) return null;

  const supports = supportGemIds.map(id => getSupportGemById(id)).filter(Boolean);

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
      {/* Main skill gem */}
      <div
        style={{
          width: '36px',
          height: '36px',
          background: 'linear-gradient(135deg, rgba(153, 102, 204, 0.3) 0%, rgba(80, 50, 120, 0.2) 100%)',
          border: '2px solid var(--accent-arcane)',
          borderRadius: '8px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '1.2rem',
          cursor: 'pointer',
          boxShadow: '0 2px 8px rgba(153, 102, 204, 0.3)',
        }}
        onMouseEnter={(e) => {
          setTooltipPos({ x: e.clientX, y: e.clientY });
          setShowTooltip(true);
        }}
        onMouseLeave={() => setShowTooltip(false)}
      >
        {skill.icon}
      </div>
      
      {/* Support gems */}
      {supports.length > 0 && (
        <div style={{ display: 'flex', gap: '2px' }}>
          {supports.map((support, idx) => support && (
            <div
              key={idx}
              style={{
                width: '20px',
                height: '20px',
                background: 'linear-gradient(135deg, rgba(46, 204, 113, 0.2) 0%, rgba(30, 130, 70, 0.1) 100%)',
                border: '1px solid rgba(46, 204, 113, 0.5)',
                borderRadius: '4px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '0.7rem',
              }}
              title={support.name}
            >
              {support.icon}
            </div>
          ))}
        </div>
      )}
      
      {showTooltip && createPortal(
        <SkillGemTooltip skill={skill} position={tooltipPos} />,
        document.body
      )}
    </div>
  );
}

// Character Card Component with Enhanced Animations
const CharacterCard = memo(function CharacterCard({
  character,
  isSelected,
  onSelect,
  onEdit,
  onRemove,
  inventory
}: {
  character: Character;
  isSelected: boolean;
  onSelect: () => void;
  onEdit: () => void;
  onRemove: () => void;
  inventory: Item[];
}) {
  
  // Get class data and colors
  const classId = character.classId;
  const classData = classId ? getClassById(classId) : null;
  const classColors = classId ? getClassColor(classId) : null;
  const background = classId ? getClassBackground(classId) : null;
  
  // Use class colors if available, otherwise fall back to role colors
  const primaryColor = classColors?.primary || ROLE_COLORS[character.role].primary;
  const secondaryColor = classColors?.secondary || ROLE_COLORS[character.role].primary;
  
  const progress = character.level < 100 ? getExperienceProgress(character) : null;
  
  // Get equipped items
  const getEquippedItem = (slot: GearSlot): Item | undefined => {
    const itemId = character.equippedGear[slot];
    if (!itemId) return undefined;
    return inventory.find(i => i.id === itemId);
  };

  // Equipment slot groups
  const armorSlots: GearSlot[] = ['head', 'chest', 'hands', 'waist', 'feet'];
  const weaponSlots: GearSlot[] = ['mainHand', 'offHand'];
  const accessorySlots: GearSlot[] = ['neck', 'ring1', 'ring2', 'trinket1', 'trinket2'];

  // Calculate total stats including equipment
  const totalStats = useMemo(() => {
    return calculateTotalCharacterStats(character, inventory);
  }, [character, inventory]);
  
  // Get enemy stats for this character's level (for Phys DR and Evasion display)
  const enemyStatsForLevel = useMemo(() => {
    return getMonsterStatsForLevel(character.level);
  }, [character.level]);
  const enemyDamageForLevel = enemyStatsForLevel.physical_damage;
  const enemyAccuracyForLevel = enemyStatsForLevel.accuracy;

  // Handle remove - instant swap
  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    onRemove();
  };

  return (
    <motion.div
      animate={{ 
        opacity: 1,
      }}
      whileHover={{ 
        y: -4, 
        transition: { duration: 0.2, ease: 'easeOut' }
      }}
      whileTap={{ scale: 0.98 }}
      transition={{ 
        opacity: { duration: 0 }
      }}
      style={{
        flex: '0 0 auto',
        width: '320px',
        height: '100%',
        minHeight: '520px',
        background: 'var(--bg-dark)',
        border: `2px solid ${isSelected ? primaryColor : 'var(--border-color)'}`,
        borderRadius: '16px',
        overflow: 'hidden',
        cursor: 'pointer',
        display: 'flex',
        flexDirection: 'column',
        boxShadow: isSelected 
          ? `0 0 30px ${primaryColor}50` 
          : '0 4px 16px rgba(0,0,0,0.3)',
        position: 'relative',
        '--glow-color': primaryColor,
        '--color-1': primaryColor,
        '--color-2': secondaryColor,
      } as React.CSSProperties}
      onClick={onSelect}
    >
      {/* Selection glow ring - simplified */}
      {isSelected && (
        <div
          className="glow-pulse"
          style={{
            '--glow-color': primaryColor,
            position: 'absolute',
            inset: -3,
            borderRadius: '18px',
            border: `2px solid ${primaryColor}`,
            pointerEvents: 'none',
            zIndex: 5,
          } as React.CSSProperties}
        />
      )}
      
      {/* Full-panel background image */}
      {background ? (
        <div style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: `url(${background})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center 15%',
          filter: isSelected ? 'brightness(1.05)' : 'brightness(0.9)',
          transition: 'all 0.3s ease',
        }} />
      ) : (
        <div style={{
          position: 'absolute',
          inset: 0,
          background: `linear-gradient(135deg, ${primaryColor}30 0%, var(--bg-dark) 50%, ${secondaryColor}20 100%)`,
        }} />
      )}
      
      {/* Gradient overlay - transparent at top, fades to dark at bottom */}
      <div style={{
        position: 'absolute',
        inset: 0,
        background: `linear-gradient(180deg, 
          transparent 0%, 
          transparent 25%,
          rgba(0, 0, 0, 0.3) 40%,
          rgba(0, 0, 0, 0.7) 55%,
          rgba(0, 0, 0, 0.9) 70%,
          rgba(0, 0, 0, 0.95) 100%
        )`,
        pointerEvents: 'none',
      }} />
      
      {/* Glowing border effect when selected */}
      {isSelected && (
        <div style={{
          position: 'absolute',
          inset: 0,
          boxShadow: `inset 0 0 30px ${primaryColor}30`,
          pointerEvents: 'none',
          zIndex: 1,
        }} />
      )}
      
      {/* Portrait/Icon overlay (fallback when no background) */}
      {!background && (
        <div style={{
          position: 'absolute',
          top: '80px',
          left: '50%',
          transform: 'translateX(-50%)',
          fontSize: '5rem',
          color: primaryColor,
          opacity: 0.6,
          filter: `drop-shadow(0 0 30px ${primaryColor})`,
          zIndex: 1,
        }}>
          {classData?.icon || ROLE_PORTRAITS[character.role]}
        </div>
      )}
      
      {/* Class badge - top left */}
      <div style={{
        position: 'absolute',
        top: '12px',
        left: '12px',
        background: `linear-gradient(135deg, ${primaryColor}E0 0%, ${secondaryColor}D0 100%)`,
        color: 'white',
        padding: '5px 12px',
        borderRadius: '12px',
        fontSize: '0.7rem',
        fontWeight: 700,
        display: 'flex',
        alignItems: 'center',
        gap: '5px',
        boxShadow: `0 2px 15px ${primaryColor}80, 0 0 20px ${primaryColor}40`,
        border: `1px solid ${primaryColor}`,
        zIndex: 3,
      }}>
        <span style={{ fontSize: '0.9rem' }}>{classData?.icon || ROLE_ICONS[character.role]}</span>
        {classData?.name || character.role.toUpperCase()}
      </div>
      
      {/* Level badge - top right */}
      <div style={{
        position: 'absolute',
        top: '12px',
        right: '12px',
        background: 'rgba(0,0,0,0.8)',
        color: character.level >= 100 ? '#FFD700' : character.level >= 50 ? '#ffa500' : 'var(--accent-gold)',
        padding: '5px 12px',
        borderRadius: '8px',
        fontSize: '0.85rem',
        fontWeight: 700,
        border: `1px solid ${character.level >= 100 ? '#FFD700' : 'var(--accent-gold)'}`,
        boxShadow: character.level >= 100 ? '0 0 15px #FFD70060' : 'none',
        zIndex: 3,
      }}>
        Lv {character.level}
      </div>
      
      {/* Action buttons - visible when selected */}
      {isSelected && (
        <motion.div 
          initial={{ opacity: 0, x: 10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.2 }}
          style={{
            position: 'absolute',
            top: '50px',
            right: '12px',
            display: 'flex',
            flexDirection: 'column',
            gap: '6px',
            zIndex: 3,
          }}
        >
          <button
            style={{ 
              padding: '8px 12px', 
              fontSize: '0.8rem',
              background: 'rgba(0,0,0,0.75)',
              border: '1px solid rgba(255,255,255,0.15)',
              borderRadius: '6px',
              color: '#fff',
              cursor: 'pointer',
              transition: 'all 0.15s ease',
              backdropFilter: 'blur(4px)',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(60,60,70,0.9)';
              e.currentTarget.style.borderColor = 'rgba(255,255,255,0.3)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'rgba(0,0,0,0.75)';
              e.currentTarget.style.borderColor = 'rgba(255,255,255,0.15)';
            }}
            onClick={(e) => { e.stopPropagation(); onEdit(); }}
          >
            ✏️ Edit
          </button>
          <button
            style={{ 
              padding: '8px 12px', 
              fontSize: '0.8rem',
              background: 'rgba(180,50,50,0.8)',
              border: '1px solid rgba(255,100,100,0.3)',
              borderRadius: '6px',
              color: '#fff',
              cursor: 'pointer',
              transition: 'all 0.15s ease',
              backdropFilter: 'blur(4px)',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(220,60,60,0.9)';
              e.currentTarget.style.borderColor = 'rgba(255,100,100,0.5)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'rgba(180,50,50,0.8)';
              e.currentTarget.style.borderColor = 'rgba(255,100,100,0.3)';
            }}
            onClick={handleRemove}
          >
            ✕ Remove
          </button>
        </motion.div>
      )}
      

      {/* Character Info - overlaid at bottom */}
      <div style={{ 
        padding: '16px',
        marginTop: 'auto',
        display: 'flex', 
        flexDirection: 'column', 
        gap: '10px',
        position: 'relative',
        zIndex: 2,
      }}>
        {/* Name - with glass background for readability */}
        <div style={{ 
          textAlign: 'center',
          background: 'rgba(0,0,0,0.4)',
          backdropFilter: 'blur(4px)',
          borderRadius: '8px',
          padding: '10px 12px',
        }}>
          <h3 style={{ 
            margin: 0, 
            fontSize: '1.5rem', 
            fontWeight: 700,
            color: '#ffffff',
            textShadow: `0 0 15px ${primaryColor}, 0 2px 4px rgba(0,0,0,0.8)`,
            letterSpacing: '0.5px',
          }}>
            {classData?.name || character.role.toUpperCase()}
          </h3>
          
          {/* Class theme */}
          {classData && (
            <div style={{
              fontSize: '0.75rem',
              color: '#ffffff',
              fontStyle: 'italic',
              marginTop: '4px',
              textShadow: `0 0 10px ${primaryColor}, 0 1px 3px rgba(0,0,0,0.8)`,
            }}>
              {classData.theme}
            </div>
          )}
          
          {/* XP Bar */}
          {progress && (
            <div style={{ marginTop: '10px' }}>
              <div style={{
                height: '6px',
                background: 'rgba(0,0,0,0.5)',
                borderRadius: '3px',
                overflow: 'hidden',
                border: `1px solid ${primaryColor}50`,
              }}>
                <div style={{
                  width: `${progress.percentage}%`,
                  height: '100%',
                  background: `linear-gradient(90deg, ${primaryColor} 0%, ${secondaryColor} 100%)`,
                  transition: 'width 0.3s ease',
                  boxShadow: `0 0 8px ${primaryColor}60`,
                }} />
              </div>
              <div style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.7)', marginTop: '3px' }}>
                {progress.percentage.toFixed(0)}% to Lv {character.level + 1}
              </div>
            </div>
          )}
        </div>

        {/* Core Stats */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '8px',
          padding: '10px',
          background: 'rgba(0,0,0,0.4)',
          borderRadius: '8px',
          backdropFilter: 'blur(4px)',
        }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '0.65rem', color: 'var(--text-dim)', textTransform: 'uppercase' }}>Life</div>
            <div style={{ fontSize: '1rem', fontWeight: 700, color: '#e74c3c' }}>
              {Math.floor(totalStats.life)}
            </div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '0.65rem', color: 'var(--text-dim)', textTransform: 'uppercase' }}>Mana</div>
            <div style={{ fontSize: '1rem', fontWeight: 700, color: '#3498db' }}>
              {Math.floor(totalStats.mana)}
            </div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '0.65rem', color: 'var(--text-dim)', textTransform: 'uppercase' }}>ES</div>
            <div style={{ fontSize: '1rem', fontWeight: 700, color: '#9b59b6' }}>
              {Math.floor(totalStats.energyShield)}
            </div>
          </div>
        </div>

        {/* Attributes */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-around',
          padding: '8px',
          background: 'rgba(0,0,0,0.35)',
          borderRadius: '6px',
          backdropFilter: 'blur(4px)',
        }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '0.6rem', color: '#e74c3c' }}>STR</div>
            <div style={{ fontSize: '0.85rem', fontWeight: 600 }}>{Math.floor(totalStats.strength)}</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '0.6rem', color: '#2ecc71' }}>DEX</div>
            <div style={{ fontSize: '0.85rem', fontWeight: 600 }}>{Math.floor(totalStats.dexterity)}</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '0.6rem', color: '#3498db' }}>INT</div>
            <div style={{ fontSize: '0.85rem', fontWeight: 600 }}>{Math.floor(totalStats.intelligence)}</div>
          </div>
        </div>

        {/* Defenses */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
          gap: '6px',
          fontSize: '0.75rem',
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-secondary)' }}>
            <span>Phys DR</span>
            <span style={{ color: 'var(--text-primary)' }}>{Math.round((1 - calculateArmorReduction(totalStats.armor, enemyDamageForLevel)) * 100)}%</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-secondary)' }}>
            <span>Evade</span>
            <span style={{ color: 'var(--text-primary)' }}>{Math.round(calculateEvasionChance(totalStats.evasion, enemyAccuracyForLevel) * 100)}%</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-secondary)' }}>
            <span>Block</span>
            <span style={{ color: 'var(--text-primary)' }}>{Math.floor(totalStats.blockChance)}%</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-secondary)' }}>
            <span>Crit</span>
            <span style={{ color: 'var(--text-primary)' }}>{Math.floor(totalStats.criticalStrikeChance)}%</span>
          </div>
        </div>

        {/* Resistances */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-around',
          padding: '6px',
          background: 'rgba(0,0,0,0.1)',
          borderRadius: '4px',
          fontSize: '0.7rem',
        }}>
          <span style={{ color: '#ff6b35' }}>🔥 {Math.min(75, Math.floor(totalStats.fireResistance))}% ({Math.floor(totalStats.fireResistance)}%)</span>
          <span style={{ color: '#36c5f4' }}>❄️ {Math.min(75, Math.floor(totalStats.coldResistance))}% ({Math.floor(totalStats.coldResistance)}%)</span>
          <span style={{ color: '#ffd700' }}>⚡ {Math.min(75, Math.floor(totalStats.lightningResistance))}% ({Math.floor(totalStats.lightningResistance)}%)</span>
          <span style={{ color: '#b366ff' }}>☠️ {Math.min(75, Math.floor(totalStats.chaosResistance))}% ({Math.floor(totalStats.chaosResistance)}%)</span>
        </div>

        {/* Equipment */}
        <div>
          <div style={{ fontSize: '0.7rem', color: 'var(--text-dim)', marginBottom: '6px', fontWeight: 600 }}>
            EQUIPMENT ({Object.keys(character.equippedGear).length}/14)
          </div>
          <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
            {[...weaponSlots, ...armorSlots, ...accessorySlots].map(slot => (
              <EquipmentSlot 
                key={slot} 
                slot={slot} 
                item={getEquippedItem(slot)}
                roleColor={primaryColor}
              />
            ))}
          </div>
        </div>

        {/* Skills */}
        <div>
          <div style={{ fontSize: '0.7rem', color: 'var(--text-dim)', marginBottom: '6px', fontWeight: 600 }}>
            SKILLS ({character.skillGems.filter(s => s.skillGemId).length}/{getEnabledSkillSlots(character.level)})
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
            {character.skillGems.filter(s => s.skillGemId).map((gem, idx) => (
              <SkillGemDisplay
                key={idx}
                skillGemId={gem.skillGemId}
                supportGemIds={gem.supportGemIds}
                roleColor={primaryColor}
              />
            ))}
            {character.skillGems.filter(s => s.skillGemId).length === 0 && (
              <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', fontStyle: 'italic' }}>
                No skills equipped
              </div>
            )}
          </div>
        </div>

        {/* Passives */}
        <div style={{ 
          fontSize: '0.75rem', 
          color: 'var(--text-secondary)',
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          marginTop: 'auto',
          paddingTop: '8px',
          borderTop: '1px solid var(--border-color)',
        }}>
          <span>🌳</span>
          <span>{character.allocatedPassives.length} Passive Points Allocated</span>
        </div>
      </div>
    </motion.div>
  );
}, (prevProps, nextProps) => {
  // Return true if props are equal (skip re-render), false if different (re-render)
  // Only re-render if character data, selection, or inventory actually changed
  if (prevProps.character.id !== nextProps.character.id) return false;
  if (prevProps.character !== nextProps.character) return false;
  if (prevProps.isSelected !== nextProps.isSelected) return false;
  if (prevProps.inventory !== nextProps.inventory) return false;
  // Callbacks are stable, so we can ignore them
  // All props are equal, skip re-render
  return true;
});

// Slot role configuration
const TEAM_SLOTS: { role: CharacterRole; label: string }[] = [
  { role: 'tank', label: 'Tank' },
  { role: 'healer', label: 'Healer' },
  { role: 'dps', label: 'DPS' },
  { role: 'dps', label: 'DPS' },
  { role: 'dps', label: 'DPS' },
];

const SLOT_COLORS: Record<CharacterRole, { primary: string; secondary: string }> = {
  tank: { primary: '#4a9eff', secondary: '#2a6ecc' },
  healer: { primary: '#4ade80', secondary: '#22c55e' },
  dps: { primary: '#f87171', secondary: '#dc2626' },
};


// Empty Slot Card with role specification and enhanced animations
const EmptySlotCard = memo(function EmptySlotCard({ 
  onClick, 
  index: _index = 0,
  role,
  label,
}: { 
  onClick: () => void; 
  index?: number;
  role: CharacterRole;
  label: string;
}) {
  const colors = SLOT_COLORS[role];
  const RoleIcon = role === 'tank' ? GiShield : role === 'healer' ? GiHealthPotion : GiBroadsword;
  const [isHovered, setIsHovered] = useState(false);
  
  return (
    <motion.div
      animate={{ 
        opacity: 1,
      }}
      whileHover={{ 
        y: -4,
        transition: { duration: 0.2, ease: 'easeOut' }
      }}
      whileTap={{ scale: 0.98 }}
      transition={{ 
        opacity: { duration: 0 }
      }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      style={{
        flex: '0 0 auto',
        width: '320px',
        background: `linear-gradient(135deg, rgba(20, 18, 15, 0.9) 0%, rgba(10, 8, 5, 0.95) 100%)`,
        border: `2px dashed ${colors.primary}50`,
        borderRadius: '16px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer',
        height: '100%',
        minHeight: '520px',
        position: 'relative',
        overflow: 'hidden',
      }}
      onClick={onClick}
    >
      {/* Animated border on hover */}
      <AnimatePresence>
        {isHovered && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              position: 'absolute',
              inset: 0,
              borderRadius: '16px',
              border: `2px solid ${colors.primary}`,
              pointerEvents: 'none',
            }}
          />
        )}
      </AnimatePresence>
      
      {/* Background glow */}
      <div style={{
        position: 'absolute',
        inset: 0,
        background: `radial-gradient(ellipse at 50% 30%, ${colors.primary}15 0%, transparent 60%)`,
        pointerEvents: 'none',
      }} />
      
      {/* Role badge at top */}
      <div style={{
        position: 'absolute',
        top: '16px',
        left: '50%',
        transform: 'translateX(-50%)',
        background: `linear-gradient(135deg, ${colors.primary}30 0%, ${colors.secondary}20 100%)`,
        border: `1px solid ${colors.primary}50`,
        borderRadius: '20px',
        padding: '6px 16px',
        display: 'flex',
        alignItems: 'center',
        gap: '6px',
      }}>
        <RoleIcon style={{ color: colors.primary, fontSize: '0.9rem' }} />
        <span style={{ 
          color: colors.primary, 
          fontSize: '0.75rem', 
          fontWeight: 600,
          fontFamily: "'Cinzel', Georgia, serif",
          textTransform: 'uppercase',
          letterSpacing: '0.1em',
          whiteSpace: 'nowrap',
        }}>
          {label} Slot
        </span>
      </div>
      
      <div 
        style={{ 
          fontSize: '3.5rem', 
          marginBottom: '16px', 
          color: colors.primary,
          opacity: 0.8,
          filter: `drop-shadow(0 0 15px ${colors.primary}40)`,
          transition: 'all 0.3s ease',
        }}
      >
        <RoleIcon />
      </div>
      <div style={{ 
        fontSize: '1.1rem', 
        color: '#f5edd8', 
        fontWeight: 600,
        fontFamily: "'Cinzel', Georgia, serif",
        textShadow: `0 0 20px ${colors.primary}40`,
      }}>
        Add {label}
      </div>
      <div style={{ 
        fontSize: '0.8rem', 
        color: '#7a6c56', 
        marginTop: '6px',
        fontStyle: 'italic',
      }}>
        Click to recruit a {role}
      </div>
      
      {/* Decorative corner accents */}
      <div style={{
        position: 'absolute',
        top: '8px',
        left: '8px',
        width: '20px',
        height: '20px',
        borderTop: `2px solid ${colors.primary}40`,
        borderLeft: `2px solid ${colors.primary}40`,
        borderRadius: '4px 0 0 0',
      }} />
      <div style={{
        position: 'absolute',
        top: '8px',
        right: '8px',
        width: '20px',
        height: '20px',
        borderTop: `2px solid ${colors.primary}40`,
        borderRight: `2px solid ${colors.primary}40`,
        borderRadius: '0 4px 0 0',
      }} />
      <div style={{
        position: 'absolute',
        bottom: '8px',
        left: '8px',
        width: '20px',
        height: '20px',
        borderBottom: `2px solid ${colors.primary}40`,
        borderLeft: `2px solid ${colors.primary}40`,
        borderRadius: '0 0 0 4px',
      }} />
      <div style={{
        position: 'absolute',
        bottom: '8px',
        right: '8px',
        width: '20px',
        height: '20px',
        borderBottom: `2px solid ${colors.primary}40`,
        borderRight: `2px solid ${colors.primary}40`,
        borderRadius: '0 0 4px 0',
      }} />
    </motion.div>
  );
}, (prevProps, nextProps) => {
  // Only re-render if slot index or role changed
  if (prevProps.index !== nextProps.index) return false;
  if (prevProps.role !== nextProps.role) return false;
  if (prevProps.label !== nextProps.label) return false;
  // onClick callback is stable, ignore it
  return true;
});

export function TeamTab() {
  const { 
    team, 
    teamSlotAssignments,
    inventory,
    selectedCharacterId, 
    selectCharacter, 
    addCharacter, 
    removeCharacter
  } = useGameStore();
  
  const [pendingSlotIndex, setPendingSlotIndex] = useState<number | undefined>(undefined);
  
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [newCharRole, setNewCharRole] = useState<CharacterRole>('tank');
  const [newCharClassId, setNewCharClassId] = useState<import('../types/classes').CharacterClassId | null>(null);

  const selectedCharacter = team.find(c => c.id === selectedCharacterId);
  
  // Build a slot-ordered team array: use slot assignments to maintain specific slot positions
  const slotOrderedTeam = useMemo(() => {
    const ordered: (Character | null)[] = Array(5).fill(null);
    
    // First, assign characters to their specific slots based on assignments
    for (let slotIdx = 0; slotIdx < TEAM_SLOTS.length; slotIdx++) {
      const charId = teamSlotAssignments[slotIdx];
      if (charId) {
        const char = team.find(c => c.id === charId);
        if (char) {
          ordered[slotIdx] = char;
        }
      }
    }
    
    return ordered;
  }, [team, teamSlotAssignments]);
  
  // Get character for a specific slot (direct index access to slot-ordered array)
  const getCharacterForSlot = (slotIndex: number): Character | null => {
    return slotOrderedTeam[slotIndex] || null;
  };

  const handleSlotClick = (slotIndex: number) => {
    const slot = TEAM_SLOTS[slotIndex];
    const slotRole = slot.role;
    
    // Check if this slot already has a character
    const existingChar = getCharacterForSlot(slotIndex);
    if (existingChar) {
      // Slot already filled, select the character instead
      selectCharacter(existingChar.id);
      return;
    }
    
    if (slotRole === 'dps') {
      // Automatically generate a temp DPS character with random unique name
      const placeholderName = generateRandomCharacterName();
      addCharacter(placeholderName, 'dps', undefined, slotIndex);
    } else {
      // For tank and healer, open the modal to select a class
      setNewCharRole(slotRole);
      setNewCharClassId(null);
      setPendingSlotIndex(slotIndex);
      setShowAddModal(true);
    }
  };

  const handleAddCharacter = useCallback(() => {
    console.log('handleAddCharacter called', { newCharClassId, pendingSlotIndex, newCharRole });
    if (newCharClassId && pendingSlotIndex !== undefined) {
      const classData = getClassById(newCharClassId);
      const characterName = classData?.name || newCharRole.toUpperCase();
      console.log('Adding character:', { characterName, newCharRole, newCharClassId, pendingSlotIndex });
      addCharacter(characterName, newCharRole, newCharClassId, pendingSlotIndex);
      setNewCharClassId(null);
      setPendingSlotIndex(undefined);
      setShowAddModal(false);
    } else {
      console.warn('Cannot add character: missing classId or slotIndex', { newCharClassId, pendingSlotIndex });
    }
  }, [newCharClassId, pendingSlotIndex, newCharRole, addCharacter]);


  const openEditModal = useCallback(() => {
    if (selectedCharacter) {
      setShowEditModal(true);
    }
  }, [selectedCharacter]);

  // Stable callbacks for character cards
  const handleSelectCharacter = useCallback((id: string) => {
    selectCharacter(id);
  }, [selectCharacter]);

  const handleRemoveCharacter = useCallback((id: string) => {
    removeCharacter(id);
  }, [removeCharacter]);

  return (
    <div style={{ 
      height: 'calc(100vh - 100px)', 
      display: 'flex', 
      flexDirection: 'column',
      overflow: 'hidden',
      position: 'relative',
    }}>
      {/* Background texture overlay */}
      <div style={{
        position: 'absolute',
        inset: 0,
        backgroundImage: 'url(/tilebackground.png)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        opacity: 0.025,
        pointerEvents: 'none',
        zIndex: 0,
      }} />
      
      {/* Animation CSS Styles */}
      <AnimationStyles />
      
      {/* Character Cards - Fixed 5 slots */}
      <div style={{
        flex: 1,
        display: 'flex',
        gap: '20px',
        justifyContent: 'center',
        alignItems: 'stretch',
        overflowX: 'auto',
        overflowY: 'hidden',
        padding: '4px',
        position: 'relative',
        zIndex: 1,
      }}>
        {TEAM_SLOTS.map((slot, slotIndex) => {
          const character = getCharacterForSlot(slotIndex);
          
          return (
            <div 
              key={`slot-${slotIndex}`} 
              style={{ 
                flex: '0 0 auto', 
                width: '320px',
                minHeight: '520px',
                position: 'relative'
              }}
            >
              {character ? (
                <CharacterCard
                  character={character}
                  isSelected={character.id === selectedCharacterId}
                  onSelect={() => handleSelectCharacter(character.id)}
                  onEdit={openEditModal}
                  onRemove={() => handleRemoveCharacter(character.id)}
                  inventory={inventory}
                />
              ) : (
                <EmptySlotCard 
                  onClick={() => handleSlotClick(slotIndex)}
                  index={slotIndex}
                  role={slot.role}
                  label={slot.label}
                />
              )}
            </div>
          );
        })}
      </div>

      <AddCharacterModal
        isOpen={showAddModal}
        role={newCharRole}
        classId={newCharClassId}
        onRoleChange={setNewCharRole}
        onClassChange={setNewCharClassId}
        onConfirm={handleAddCharacter}
        onCancel={() => {
          setShowAddModal(false);
          setNewCharRole('tank');
          setNewCharClassId(null);
          setPendingSlotIndex(undefined);
        }}
      />

      <EditCharacterModal
        isOpen={showEditModal}
        character={selectedCharacter || null}
        onConfirm={() => setShowEditModal(false)}
        onCancel={() => setShowEditModal(false)}
      />
    </div>
  );
}
