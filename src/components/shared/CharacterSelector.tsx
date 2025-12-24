import { useState } from 'react';
import { motion } from 'framer-motion';
import type { Character } from '../../types/character';
import { getClassById, getClassColor } from '../../types/classes';

// Map classId to portrait image
function getPortraitPath(classId?: string): string | null {
  if (!classId) return null;
  const filename = classId.replace(/_/g, '');
  return `/src/assets/backgrounds/${filename}.png`;
}

interface CharacterSelectorProps {
  team: Character[];
  selectedCharacterId: string | null;
  onSelectCharacter: (id: string) => void;
  getCharacterInfo?: (char: Character) => string;
}

// Sort order: tank -> healer -> dps
const ROLE_ORDER: Record<string, number> = { tank: 0, healer: 1, dps: 2 };

export function CharacterSelector({ 
  team, 
  selectedCharacterId, 
  onSelectCharacter,
  getCharacterInfo 
}: CharacterSelectorProps) {
  // Sort team by role
  const sortedTeam = [...team].sort((a, b) => 
    (ROLE_ORDER[a.role] ?? 99) - (ROLE_ORDER[b.role] ?? 99)
  );

  return (
    <motion.div 
      className="character-selector-panel"
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      style={{ 
        display: 'flex', 
        flexDirection: 'column', 
        height: '100%', 
        minHeight: 0,
        minWidth: 0,
        background: 'linear-gradient(145deg, rgba(20, 18, 15, 0.98) 0%, rgba(12, 10, 8, 0.99) 100%)',
        borderRadius: '14px',
        border: '1px solid rgba(201, 162, 39, 0.15)',
        boxShadow: `
          0 8px 32px rgba(0,0,0,0.5),
          inset 0 1px 0 rgba(255,255,255,0.03),
          inset 0 -1px 0 rgba(0,0,0,0.3)
        `,
        backdropFilter: 'blur(12px)',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Ambient glow effect */}
      <div style={{
        position: 'absolute',
        top: '-50%',
        left: '-50%',
        width: '200%',
        height: '100%',
        background: 'radial-gradient(ellipse at center, rgba(201, 162, 39, 0.03) 0%, transparent 50%)',
        pointerEvents: 'none',
      }} />

      {/* Corner ornaments - enhanced */}
      <div style={{ position: 'absolute', top: 8, left: 8, width: 20, height: 20, borderTop: '2px solid #c9a227', borderLeft: '2px solid #c9a227', borderRadius: '6px 0 0 0', pointerEvents: 'none', zIndex: 10, boxShadow: '-2px -2px 8px rgba(201, 162, 39, 0.15)' }} />
      <div style={{ position: 'absolute', top: 8, right: 8, width: 20, height: 20, borderTop: '2px solid #c9a227', borderRight: '2px solid #c9a227', borderRadius: '0 6px 0 0', pointerEvents: 'none', zIndex: 10, boxShadow: '2px -2px 8px rgba(201, 162, 39, 0.15)' }} />
      <div style={{ position: 'absolute', bottom: 8, left: 8, width: 20, height: 20, borderBottom: '2px solid #c9a227', borderLeft: '2px solid #c9a227', borderRadius: '0 0 0 6px', pointerEvents: 'none', zIndex: 10, boxShadow: '-2px 2px 8px rgba(201, 162, 39, 0.15)' }} />
      <div style={{ position: 'absolute', bottom: 8, right: 8, width: 20, height: 20, borderBottom: '2px solid #c9a227', borderRight: '2px solid #c9a227', borderRadius: '0 0 6px 0', pointerEvents: 'none', zIndex: 10, boxShadow: '2px 2px 8px rgba(201, 162, 39, 0.15)' }} />
      
      {/* Header - enhanced */}
      <div style={{ 
        flexShrink: 0, 
        padding: '1.1rem 1rem',
        background: 'linear-gradient(180deg, rgba(201, 162, 39, 0.1) 0%, rgba(201, 162, 39, 0.02) 100%)',
        borderBottom: '1px solid rgba(201, 162, 39, 0.15)',
        textAlign: 'center',
        position: 'relative',
      }}>
        {/* Top gold line with glow */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '2px',
          background: 'linear-gradient(90deg, transparent 5%, #c9a227 50%, transparent 95%)',
          boxShadow: '0 0 12px rgba(201, 162, 39, 0.4)',
        }} />
        {/* Center diamond decoration */}
        <motion.div 
          animate={{ 
            boxShadow: ['0 0 10px rgba(201, 162, 39, 0.4)', '0 0 20px rgba(201, 162, 39, 0.6)', '0 0 10px rgba(201, 162, 39, 0.4)']
          }}
          transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
          style={{
            position: 'absolute',
            top: '-5px',
            left: '50%',
            transform: 'translateX(-50%) rotate(45deg)',
            width: '10px',
            height: '10px',
            background: 'linear-gradient(135deg, #d4af37 0%, #c9a227 50%, #8b7019 100%)',
            borderRadius: '2px',
          }}
        />
        <h3 style={{ 
          fontSize: '1rem', 
          margin: 0, 
          fontFamily: "'Cinzel', Georgia, serif",
          fontWeight: 700,
          color: '#d4af37',
          textTransform: 'uppercase',
          letterSpacing: '0.15em',
          textShadow: '0 0 20px rgba(201, 162, 39, 0.5), 0 2px 4px rgba(0,0,0,0.5)',
        }}>Party</h3>
      </div>
      
      {/* Character list - enhanced */}
      <div style={{ 
        flex: 1, 
        overflowY: 'auto', 
        minHeight: 0, 
        padding: '0.85rem', 
        paddingBottom: '1.2rem', 
        display: 'flex', 
        flexDirection: 'column', 
        gap: '0.85rem',
        background: 'radial-gradient(ellipse at 50% 0%, rgba(201, 162, 39, 0.03) 0%, transparent 60%)',
      }}>
        {sortedTeam.map(char => (
          <CharacterCard
            key={char.id}
            character={char}
            isSelected={selectedCharacterId === char.id}
            onSelect={() => onSelectCharacter(char.id)}
            info={getCharacterInfo ? getCharacterInfo(char) : ''}
          />
        ))}
        
        {/* Bottom decorative divider - enhanced */}
        {sortedTeam.length > 0 && (
          <div style={{
            marginTop: '0.75rem',
            height: '1px',
            background: 'linear-gradient(90deg, transparent, rgba(201, 162, 39, 0.25), transparent)',
            position: 'relative',
          }}>
            <motion.div 
              animate={{ 
                opacity: [0.3, 0.6, 0.3],
                scale: [1, 1.2, 1],
              }}
              transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
              style={{
                position: 'absolute',
                left: '50%',
                top: '50%',
                transform: 'translate(-50%, -50%) rotate(45deg)',
                width: '6px',
                height: '6px',
                background: 'linear-gradient(135deg, #d4af37 0%, #8b7019 100%)',
                borderRadius: '1px',
                boxShadow: '0 0 8px rgba(201, 162, 39, 0.4)',
              }}
            />
          </div>
        )}
      </div>
    </motion.div>
  );
}

interface CharacterCardProps {
  character: Character;
  isSelected: boolean;
  onSelect: () => void;
  info: string;
}

// Function to lighten a hex color significantly
function lightenColor(hex: string, percent: number = 70): string {
  // Remove # if present
  hex = hex.replace('#', '');
  
  // Convert to RGB
  const num = parseInt(hex, 16);
  const r = (num >> 16) + Math.round((255 - (num >> 16)) * (percent / 100));
  const g = ((num >> 8) & 0x00FF) + Math.round((255 - ((num >> 8) & 0x00FF)) * (percent / 100));
  const b = (num & 0x0000FF) + Math.round((255 - (num & 0x0000FF)) * (percent / 100));
  
  // Clamp values and convert back to hex
  const toHex = (n: number) => {
    const clamped = Math.min(255, Math.max(0, n));
    return clamped.toString(16).padStart(2, '0');
  };
  
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

// Floating ember particle component - much smaller, much lighter color
function FloatingEmber({ delay, duration, left, color }: { delay: number; duration: number; left: string; color: string }) {
  // Generate stable random drift values
  const drift1 = (parseFloat(left) / 100) * 15 - 7.5;
  const drift2 = -drift1 * 0.7;
  
  // Create a much lighter version of the color (70% lighter for very light appearance)
  const lightColor = lightenColor(color, 70);
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 0, scale: 0 }}
      animate={{ 
        opacity: [0, 1, 1, 0.7, 0],
        y: -100,
        scale: [0, 1, 1.2, 1, 0],
        x: [0, drift1, drift2, drift1 * 0.5, 0]
      }}
      transition={{ 
        duration, 
        delay,
        repeat: Infinity,
        ease: 'easeOut'
      }}
      style={{
        position: 'absolute',
        left,
        bottom: '15px',
        width: '2px',
        height: '2px',
        background: `radial-gradient(circle, ${lightColor} 0%, ${lightColor}E6 50%, transparent 75%)`,
        borderRadius: '50%',
        boxShadow: `
          0 0 6px ${lightColor}FF,
          0 0 10px ${lightColor}DD,
          0 0 14px ${lightColor}BB
        `,
        pointerEvents: 'none',
        zIndex: 25, // Even higher than container to ensure visibility
      }}
    />
  );
}

function CharacterCard({ character, isSelected, onSelect, info }: CharacterCardProps) {
  const [imageError, setImageError] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const classData = character.classId ? getClassById(character.classId) : null;
  const classColors = character.classId ? getClassColor(character.classId) : null;
  const primaryColor = classColors?.primary || '#c9a227';
  const secondaryColor = classColors?.secondary || '#8b7019';
  const portraitPath = getPortraitPath(character.classId);
  
  // Generate ember particles - more embers for better visibility
  const emberCount = 10;
  const embers = Array.from({ length: emberCount }, (_, i) => ({
    id: i,
    delay: i * 0.25, // Slightly faster spawn rate
    duration: 2.5 + Math.random() * 1.5, // Faster movement
    left: `${8 + (i * 84 / emberCount)}%`,
    color: primaryColor
  }));

  return (
    <motion.div
      onClick={onSelect}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      initial={false}
      animate={{
        scale: isSelected ? 1.02 : isHovered ? 1.01 : 1,
        y: isHovered && !isSelected ? -2 : 0,
      }}
      transition={{ type: 'spring', stiffness: 400, damping: 25 }}
      style={{
        position: 'relative',
        borderRadius: '8px', // Sharper edges
        cursor: 'pointer',
        overflow: 'hidden',
        // Premium metallic border - sharper and more defined
        border: isSelected 
          ? `3px solid ${primaryColor}`
          : `2px solid rgba(255,255,255,0.15)`,
        // Layered shadows for depth - grander with sharper borders
        boxShadow: isSelected 
          ? `
            0 0 0 3px ${primaryColor}30,
            0 0 0 1px ${primaryColor}60,
            0 12px 40px rgba(0,0,0,0.9),
            0 0 60px ${primaryColor}35,
            inset 0 0 0 1px ${primaryColor}50,
            inset 0 2px 4px ${primaryColor}30,
            inset 0 -2px 4px rgba(0,0,0,0.6)
          `
          : isHovered
            ? `
              0 0 0 2px ${primaryColor}40,
              0 0 0 1px ${primaryColor}70,
              0 10px 30px rgba(0,0,0,0.8),
              0 0 30px ${primaryColor}25,
              inset 0 0 0 1px ${primaryColor}30,
              inset 0 1px 2px ${primaryColor}20
            `
            : `
              0 6px 20px rgba(0,0,0,0.7),
              inset 0 0 0 1px rgba(255,255,255,0.1),
              inset 0 1px 2px rgba(255,255,255,0.05),
              inset 0 -1px 2px rgba(0,0,0,0.4)
            `,
        backdropFilter: 'blur(8px)',
      }}
    >
      {/* Background Image with enhanced treatment */}
      <div style={{
        position: 'absolute',
        inset: 0,
        zIndex: 1,
        background: portraitPath && !imageError
          ? `url(${portraitPath})`
          : `linear-gradient(145deg, ${primaryColor}30 0%, rgba(15,12,10,0.98) 100%)`,
        backgroundSize: 'cover',
        backgroundPosition: 'center 15%',
        filter: isSelected ? 'brightness(1.05) saturate(1.1)' : isHovered ? 'brightness(0.85)' : 'brightness(0.65)',
        transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
        transform: isHovered ? 'scale(1.05)' : 'scale(1)',
      }}>
        {portraitPath && !imageError && (
          <img 
            src={portraitPath}
            alt=""
            style={{ display: 'none' }}
            onError={() => setImageError(true)}
          />
        )}
      </div>

      {/* Animated embers - start from bottom of tile, go all the way up */}
      <div style={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        top: 0,
        overflow: 'visible',
        pointerEvents: 'none',
        zIndex: 20, // Highest z-index to ensure embers are above everything
      }}>
        {embers.map(ember => (
          <FloatingEmber
            key={ember.id}
            delay={ember.delay}
            duration={ember.duration}
            left={ember.left}
            color={ember.color}
          />
        ))}
      </div>

      {/* Bottom glow effect */}
      <div style={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: '35%',
        background: `linear-gradient(to top, ${primaryColor}40 0%, ${primaryColor}20 30%, transparent 70%)`,
        pointerEvents: 'none',
        zIndex: 3, // Below embers but above gradient
        opacity: isSelected ? 0.9 : isHovered ? 0.6 : 0.4,
        transition: 'opacity 0.3s ease',
      }} />
      
      {/* Additional bottom glow ring */}
      {isSelected && (
        <motion.div
          animate={{
            opacity: [0.4, 0.7, 0.4],
            boxShadow: [
              `0 -10px 30px ${primaryColor}40`,
              `0 -15px 40px ${primaryColor}60`,
              `0 -10px 30px ${primaryColor}40`
            ]
          }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          style={{
            position: 'absolute',
            bottom: '-10px',
            left: '10%',
            right: '10%',
            height: '20px',
            background: `radial-gradient(ellipse at center, ${primaryColor}60 0%, transparent 70%)`,
            pointerEvents: 'none',
            zIndex: 2,
            filter: 'blur(8px)',
          }}
        />
      )}


      {/* Animated shimmer on hover/selected */}
      {(isSelected || isHovered) && (
        <motion.div
          initial={{ x: '-100%', opacity: 0 }}
          animate={{ x: '200%', opacity: 1 }}
          transition={{ 
            duration: 1.5, 
            ease: 'easeInOut',
            repeat: isSelected ? Infinity : 0,
            repeatDelay: 2,
          }}
          style={{
            position: 'absolute',
            inset: 0,
            background: `linear-gradient(90deg, transparent 0%, ${primaryColor}15 50%, transparent 100%)`,
            pointerEvents: 'none',
          }}
        />
      )}

      {/* Inner glow border for selected - sharper */}
      {isSelected && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          style={{
            position: 'absolute',
            inset: 0,
            borderRadius: '8px',
            zIndex: 2,
            boxShadow: `
              inset 0 0 40px ${primaryColor}30,
              inset 0 2px 0 ${primaryColor}60,
              inset 0 -2px 0 ${primaryColor}30
            `,
            pointerEvents: 'none',
          }}
        />
      )}

      {/* Top accent line - sharper with prettier border effects */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: '3px',
        zIndex: 4,
        background: isSelected 
          ? `linear-gradient(90deg, transparent 0%, ${primaryColor}40 15%, ${primaryColor} 50%, ${primaryColor}40 85%, transparent 100%)`
          : 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.2) 50%, transparent 100%)',
        transition: 'all 0.3s ease',
        boxShadow: isSelected 
          ? `0 0 15px ${primaryColor}70, 0 2px 4px ${primaryColor}40`
          : '0 1px 2px rgba(0,0,0,0.3)',
      }} />
      
      {/* Side border accents - prettier effects */}
      {isSelected && (
        <>
          <div style={{
            position: 'absolute',
            left: 0,
            top: '15%',
            bottom: '15%',
            width: '3px',
            zIndex: 4,
            background: `linear-gradient(180deg, transparent 0%, ${primaryColor}60 30%, ${primaryColor}80 50%, ${primaryColor}60 70%, transparent 100%)`,
            boxShadow: `0 0 10px ${primaryColor}60`,
          }} />
          <div style={{
            position: 'absolute',
            right: 0,
            top: '15%',
            bottom: '15%',
            width: '3px',
            zIndex: 4,
            background: `linear-gradient(180deg, transparent 0%, ${primaryColor}60 30%, ${primaryColor}80 50%, ${primaryColor}60 70%, transparent 100%)`,
            boxShadow: `0 0 10px ${primaryColor}60`,
          }} />
        </>
      )}

      {/* Content */}
      <div style={{
        position: 'relative',
        padding: '1.1rem 1rem 1rem',
        minHeight: '120px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-end',
        gap: '0.4rem',
        zIndex: 3,
      }}>
        {/* Character Name - premium typography, full width */}
        <motion.div 
          animate={{ 
            color: isHovered || isSelected ? '#fff' : 'rgba(255,255,255,0.95)',
            textShadow: isSelected 
              ? `0 0 20px ${primaryColor}60, 0 2px 8px rgba(0,0,0,1), 0 0 12px rgba(0,0,0,1)`
              : `0 0 12px rgba(0,0,0,1), 0 2px 4px rgba(0,0,0,1)`
          }}
          style={{ 
            fontSize: '1.3rem', 
            fontWeight: 700, 
            fontFamily: "'Cinzel', Georgia, serif",
            letterSpacing: '0.05em',
            lineHeight: 1.2,
            marginBottom: '0.2rem',
          }}
        >
          {classData?.name || character.role.toUpperCase()}
        </motion.div>

        {/* Level Badge - smaller, bottom right, less transparent, less padding */}
        <motion.div 
          animate={{ 
            scale: isHovered ? 1.05 : 1,
            boxShadow: isHovered 
              ? `0 4px 12px rgba(0,0,0,0.9), 0 0 18px ${character.level >= 90 ? 'rgba(255,165,0,0.4)' : primaryColor + '35'}`
              : `0 2px 8px rgba(0,0,0,0.7), 0 0 12px ${character.level >= 90 ? 'rgba(255,165,0,0.25)' : primaryColor + '20'}`
          }}
          style={{
            position: 'absolute',
            bottom: '0.65rem',
            right: '0.65rem',
            padding: '0.2rem 0.4rem', // Reduced padding
            background: character.level >= 100 
              ? 'linear-gradient(145deg, #FFD700 0%, #FFA500 50%, #FF8C00 100%)'
              : character.level >= 90 
                ? 'linear-gradient(145deg, #FFA500 0%, #FF8C00 50%, #FF7F00 100%)'
                : `linear-gradient(145deg, ${primaryColor} 0%, ${primaryColor}DD 30%, ${secondaryColor} 100%)`, // Less transparent - fully opaque colors
            borderRadius: '5px',
            border: character.level >= 100 
              ? '1.5px solid #FFD700' 
              : character.level >= 90 
                ? '1.5px solid #FFA500' 
                : `1.5px solid ${primaryColor}`,
            fontSize: '0.8rem',
            fontWeight: 800,
            color: character.level >= 90 ? '#1a1a1a' : '#fff',
            fontFamily: "'Cinzel', Georgia, serif",
            letterSpacing: '0.06em',
            textShadow: character.level >= 90 
              ? '0 1px 2px rgba(0,0,0,0.5)'
              : `0 0 8px ${primaryColor}, 0 1px 3px rgba(0,0,0,0.8)`,
            boxShadow: character.level >= 100
              ? `0 0 15px #FFD70050, inset 0 1px 0 rgba(255,255,255,0.3)`
              : character.level >= 90
                ? `0 0 15px #FFA50050, inset 0 1px 0 rgba(255,255,255,0.3)`
                : `0 0 12px ${primaryColor}50, inset 0 1px 0 ${primaryColor}80`,
            display: 'flex',
            alignItems: 'center',
            gap: '0.2rem', // Reduced gap
          }}
        >
          <span style={{ fontSize: '0.6rem', opacity: 0.9 }}>LV</span>
          <span>{character.level}</span>
          {character.level >= 100 && (
            <span style={{ fontSize: '0.6rem', marginLeft: '0.1rem' }}>★</span>
          )}
        </motion.div>

        {/* Info text - enhanced with darker shadows for better visibility */}
        {info && (
          <motion.div 
            animate={{ opacity: isHovered ? 1 : 1 }} // Always fully opaque
            style={{ 
              fontSize: '0.75rem', 
              color: '#ffffff', // Bright white for maximum visibility
              marginTop: '0.1rem',
              textShadow: `
                0 0 10px rgba(0,0,0,1),
                0 0 15px rgba(0,0,0,1),
                0 0 20px rgba(0,0,0,0.9),
                0 2px 5px rgba(0,0,0,1),
                0 3px 8px rgba(0,0,0,1)
              `,
              fontWeight: 600, // Slightly bolder
              letterSpacing: '0.02em',
            }}
          >
            {info}
          </motion.div>
        )}
      </div>

      {/* Selected corner accent with animation */}
      {isSelected && (
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 500, damping: 25 }}
          style={{
            position: 'absolute',
            top: -1,
            left: -1,
            width: '32px',
            height: '32px',
            background: `linear-gradient(135deg, ${primaryColor} 0%, ${secondaryColor} 100%)`,
            clipPath: 'polygon(0 0, 100% 0, 0 100%)',
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: 'flex-start',
            padding: '4px 0 0 5px',
            fontSize: '0.75rem',
            color: '#fff',
            fontWeight: 'bold',
            boxShadow: `0 0 12px ${primaryColor}60`,
          }}
        >
          ✓
        </motion.div>
      )}

      {/* Bottom accent glow - prettier effect */}
      <div style={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: '4px',
        zIndex: 4,
        background: isSelected
          ? `linear-gradient(90deg, transparent 0%, ${primaryColor}40 20%, ${primaryColor} 50%, ${primaryColor}40 80%, transparent 100%)`
          : 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.2) 50%, transparent 100%)',
        boxShadow: isSelected
          ? `0 0 20px ${primaryColor}80, 0 2px 6px ${primaryColor}50`
          : '0 1px 3px rgba(0,0,0,0.4)',
        transition: 'all 0.3s ease',
      }} />
      
      {/* Additional bottom glow ring for selected */}
      {isSelected && (
        <motion.div
          animate={{
            opacity: [0.5, 0.8, 0.5],
            boxShadow: [
              `0 -10px 30px ${primaryColor}50`,
              `0 -15px 40px ${primaryColor}70`,
              `0 -10px 30px ${primaryColor}50`
            ]
          }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          style={{
            position: 'absolute',
            bottom: '-8px',
            left: '5%',
            right: '5%',
            height: '25px',
            background: `radial-gradient(ellipse at center, ${primaryColor}70 0%, transparent 75%)`,
            pointerEvents: 'none',
            zIndex: 3,
            filter: 'blur(10px)',
          }}
        />
      )}
    </motion.div>
  );
}
