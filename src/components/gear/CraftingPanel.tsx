import React, { useState, useCallback } from 'react';
import { CurrencyTooltip } from '../shared/CurrencyTooltip';
import { motion, AnimatePresence } from 'framer-motion';
import { GiAnvil, GiGems, GiClick, GiSparkles, GiMagicSwirl } from 'react-icons/gi';
import { PanelOrnaments, HeaderOrnament } from '../shared/PanelOrnaments';
import { CRAFTING_ORBS, type OrbType } from '../../store/gameStore';
import type { Item } from '../../types/items';
import type { Character } from '../../types/character';
import { ItemCard } from '../shared/ItemCard';
import { getClassColor } from '../../types/classes';

// Import orb images
import transmutationOrb from '../../assets/orbs/transmutation_original.png';
import alterationOrb from '../../assets/orbs/alteration_original.webp';
import augmentationOrb from '../../assets/orbs/augmentation_original.png';
import alchemyOrb from '../../assets/orbs/alchemy_original.webp';
import chaosOrb from '../../assets/orbs/chaos_original.webp';
import exaltedOrb from '../../assets/orbs/exalt_original.webp';
import annulmentOrb from '../../assets/orbs/annul_original.png';
import scouringOrb from '../../assets/orbs/scouring_original.webp';
import regalOrb from '../../assets/orbs/regal_original.webp';
import divineOrb from '../../assets/orbs/divine_original.webp';

// Map orb types to images
const ORB_IMAGES: Record<OrbType, string> = {
  transmutation: transmutationOrb,
  alteration: alterationOrb,
  augmentation: augmentationOrb,
  alchemy: alchemyOrb,
  chaos: chaosOrb,
  exalted: exaltedOrb,
  annulment: annulmentOrb,
  scouring: scouringOrb,
  regal: regalOrb,
  divine: divineOrb,
};

// Custom orb tooltip component

// Individual orb button component
function OrbButton({
  orb,
  count,
  isSelected,
  hasOrbs,
  onClick,
}: {
  orb: typeof CRAFTING_ORBS[0];
  count: number;
  isSelected: boolean;
  hasOrbs: boolean;
  onClick: () => void;
}) {
  const [isHovered, setIsHovered] = useState(false);
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });

  const handleMouseEnter = (e: React.MouseEvent) => {
    setTooltipPos({ x: e.clientX, y: e.clientY });
    setIsHovered(true);
  };

  return (
    <>
      <div
        onClick={() => hasOrbs && onClick()}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={() => setIsHovered(false)}
        style={{
          position: 'relative',
          width: '60px',
          height: '60px',
          cursor: hasOrbs ? 'pointer' : 'not-allowed',
          opacity: hasOrbs ? 1 : 0.35,
          transition: 'all 0.2s ease',
          transform: isSelected ? 'scale(1.08)' : isHovered && hasOrbs ? 'scale(1.05)' : 'scale(1)',
        }}
      >
        {/* Outer glow ring */}
        <div style={{
          position: 'absolute',
          inset: '-3px',
          background: isSelected 
            ? 'conic-gradient(from 0deg, #c9a227, #8b7019, #c9a227, #8b7019, #c9a227)'
            : isHovered && hasOrbs
              ? 'conic-gradient(from 0deg, rgba(201,162,39,0.5), rgba(139,112,25,0.3), rgba(201,162,39,0.5))'
              : 'none',
          borderRadius: '50%',
          animation: isSelected ? 'orbSpin 3s linear infinite' : 'none',
          opacity: isSelected ? 1 : 0.7,
        }} />
        
        {/* Main button container - circular */}
        <div style={{
          position: 'absolute',
          inset: '2px',
          borderRadius: '50%',
          background: `linear-gradient(145deg, 
            ${isSelected ? 'rgba(50, 45, 35, 0.98)' : 'rgba(35, 30, 25, 0.98)'} 0%, 
            ${isSelected ? 'rgba(30, 28, 22, 0.99)' : 'rgba(18, 16, 12, 0.99)'} 100%)`,
          border: isSelected 
            ? '2px solid rgba(201, 162, 39, 0.9)'
            : isHovered && hasOrbs
              ? '2px solid rgba(201, 162, 39, 0.6)'
              : '2px solid rgba(90, 80, 60, 0.5)',
          boxShadow: isSelected
            ? '0 0 20px rgba(201, 162, 39, 0.5), inset 0 0 15px rgba(201, 162, 39, 0.15), 0 4px 12px rgba(0,0,0,0.5)'
            : isHovered && hasOrbs
              ? '0 0 12px rgba(201, 162, 39, 0.25), inset 0 0 10px rgba(0,0,0,0.4), 0 4px 8px rgba(0,0,0,0.4)'
              : 'inset 0 0 12px rgba(0,0,0,0.5), 0 2px 6px rgba(0,0,0,0.3)',
          overflow: 'hidden',
          transition: 'all 0.2s ease',
        }}>
          {/* Inner glow for selected */}
          {isSelected && (
            <div style={{
              position: 'absolute',
              inset: 0,
              background: 'radial-gradient(circle at 50% 30%, rgba(201, 162, 39, 0.2) 0%, transparent 60%)',
              pointerEvents: 'none',
            }} />
          )}
          
          {/* Orb image - fills and covers the circle */}
          <img 
            src={ORB_IMAGES[orb.type]}
            alt={orb.name}
            style={{
              position: 'absolute',
              inset: 0,
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              filter: isSelected 
                ? 'brightness(1.15) saturate(1.1) drop-shadow(0 0 4px rgba(201, 162, 39, 0.4))'
                : isHovered && hasOrbs
                  ? 'brightness(1.05)'
                  : 'brightness(0.9)',
              transition: 'filter 0.2s ease',
            }}
          />
          
          {/* Glass highlight */}
          <div style={{
            position: 'absolute',
            top: '5%',
            left: '15%',
            right: '15%',
            height: '30%',
            background: 'linear-gradient(180deg, rgba(255,255,255,0.1) 0%, transparent 100%)',
            borderRadius: '50% 50% 30% 30%',
            pointerEvents: 'none',
          }} />
        </div>
        
        {/* Count badge */}
        <div style={{
          position: 'absolute',
          bottom: '-2px',
          right: '-2px',
          minWidth: '20px',
          height: '20px',
          background: count > 0 
            ? 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)'
            : 'linear-gradient(135deg, #6b7280 0%, #4b5563 100%)',
          border: '2px solid rgba(20, 18, 14, 0.95)',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '0.68rem',
          fontWeight: 700,
          color: '#fff',
          textShadow: '0 1px 2px rgba(0,0,0,0.5)',
          boxShadow: '0 2px 6px rgba(0,0,0,0.5)',
          zIndex: 5,
        }}>
          {count}
        </div>
      </div>
      
      {/* Custom tooltip */}
      {isHovered && <CurrencyTooltip orbType={orb.type} count={count} position={tooltipPos} />}
    </>
  );
}

interface CraftingPanelProps {
  selectedItem: Item | null;
  selectedCharacter: Character;
  selectedOrb: OrbType | null;
  orbs: Record<OrbType, number>;
  craftingMessage: string;
  onSelectOrb: (orb: OrbType | null) => void;
  onCraft: () => void;
  onEquip: () => void;
}

export function CraftingPanel({
  selectedItem,
  selectedCharacter,
  selectedOrb,
  orbs,
  craftingMessage,
  onSelectOrb,
  onCraft,
  onEquip
}: CraftingPanelProps) {
  const classColors = selectedCharacter.classId ? getClassColor(selectedCharacter.classId) : null;
  const primaryColor = classColors?.primary || '#c9a227';
  const [isCrafting, setIsCrafting] = useState(false);
  const [particles, setParticles] = useState<Array<{ id: number; x: number; y: number; angle: number }>>([]);
  
  const handleCraft = useCallback(() => {
    if (!selectedOrb || orbs[selectedOrb] <= 0) return;
    
    setIsCrafting(true);
    
    // Create burst particles
    const newParticles = Array.from({ length: 12 }, (_, i) => ({
      id: Date.now() + i,
      x: 0,
      y: 0,
      angle: (i * 30) + Math.random() * 15,
    }));
    setParticles(newParticles);
    
    // Trigger actual craft after animation starts
    setTimeout(() => {
      onCraft();
      setIsCrafting(false);
    }, 400);
    
    // Clear particles after animation
    setTimeout(() => {
      setParticles([]);
    }, 800);
  }, [selectedOrb, orbs, onCraft]);

  return (
    <div 
      style={{ 
        position: 'relative',
        display: 'flex', 
        flexDirection: 'column', 
        height: '100%', 
        minHeight: 0,
        background: 'linear-gradient(180deg, rgba(25, 22, 18, 0.98) 0%, rgba(15, 13, 10, 0.99) 100%)',
        border: '1px solid rgba(90, 75, 55, 0.5)',
        borderRadius: '8px',
        overflow: 'hidden',
      }}
    >
      {/* Textured background overlay */}
      <div style={{
        position: 'absolute',
        inset: 0,
        backgroundImage: 'url(/tilebackground.png)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        opacity: 0.025,
        pointerEvents: 'none',
      }} />
      {/* Decorative corner ornaments */}
      <PanelOrnaments color="#c9a227" size="medium" />
      
      {/* Header */}
      <div style={{ 
        flexShrink: 0, 
        padding: '0.85rem 1rem',
        background: 'linear-gradient(180deg, rgba(201, 162, 39, 0.12) 0%, rgba(201, 162, 39, 0.02) 100%)',
        borderBottom: '1px solid rgba(201, 162, 39, 0.2)',
        position: 'relative',
      }}>
        <HeaderOrnament color="#c9a227" />
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <GiAnvil style={{ fontSize: '1.1rem', color: '#c9a227' }} />
          <h3 style={{ 
            fontSize: '0.9rem', 
            margin: 0, 
            fontFamily: "'Cinzel', Georgia, serif",
            fontWeight: 700,
            color: '#c9a227',
            textTransform: 'uppercase',
            letterSpacing: '0.08em',
            textShadow: '0 0 12px rgba(201, 162, 39, 0.4)',
          }}>Crafting</h3>
        </div>
      </div>
      
      {/* Content */}
      <div style={{ 
        flex: 1, 
        overflowY: 'auto', 
        minHeight: 0, 
        padding: '0.75rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '0.75rem',
        background: 'radial-gradient(ellipse at 50% 0%, rgba(201, 162, 39, 0.03) 0%, transparent 50%)',
      }}>
        {/* Selected Item Section */}
        {selectedItem ? (
          <div style={{
            background: 'linear-gradient(180deg, rgba(35, 30, 25, 0.6) 0%, rgba(25, 22, 18, 0.8) 100%)',
            border: '1px solid rgba(80, 70, 55, 0.4)',
            borderRadius: '8px',
            padding: '0.75rem',
          }}>
            <div style={{
              fontSize: '0.7rem',
              fontWeight: 600,
              color: 'rgba(180, 170, 150, 0.6)',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              marginBottom: '0.5rem',
            }}>
              Selected Item
            </div>
            <ItemCard item={selectedItem} />
            <button 
              onClick={onEquip}
              style={{
                width: '100%',
                marginTop: '0.6rem',
                padding: '0.5rem 0.75rem',
                background: `linear-gradient(180deg, ${primaryColor}35 0%, ${primaryColor}15 100%)`,
                border: `1px solid ${primaryColor}60`,
                borderRadius: '6px',
                color: primaryColor,
                fontSize: '0.75rem',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 0.15s ease',
                fontFamily: "'Cinzel', Georgia, serif",
                letterSpacing: '0.05em',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = `linear-gradient(180deg, ${primaryColor}50 0%, ${primaryColor}25 100%)`;
                e.currentTarget.style.boxShadow = `0 0 15px ${primaryColor}30`;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = `linear-gradient(180deg, ${primaryColor}35 0%, ${primaryColor}15 100%)`;
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              Equip to {selectedCharacter.name}
            </button>
          </div>
        ) : (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            style={{ 
              position: 'relative',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '1.75rem 1rem',
              background: 'linear-gradient(180deg, rgba(35, 30, 25, 0.5) 0%, rgba(25, 22, 18, 0.7) 100%)',
              border: '1px solid rgba(80, 70, 55, 0.3)',
              borderRadius: '10px',
              textAlign: 'center',
              overflow: 'hidden',
            }}
          >
            {/* Corner accents */}
            <div style={{ position: 'absolute', top: 6, left: 6, width: 12, height: 12, borderTop: '1px solid rgba(201, 162, 39, 0.3)', borderLeft: '1px solid rgba(201, 162, 39, 0.3)', borderRadius: '3px 0 0 0' }} />
            <div style={{ position: 'absolute', top: 6, right: 6, width: 12, height: 12, borderTop: '1px solid rgba(201, 162, 39, 0.3)', borderRight: '1px solid rgba(201, 162, 39, 0.3)', borderRadius: '0 3px 0 0' }} />
            <div style={{ position: 'absolute', bottom: 6, left: 6, width: 12, height: 12, borderBottom: '1px solid rgba(201, 162, 39, 0.3)', borderLeft: '1px solid rgba(201, 162, 39, 0.3)', borderRadius: '0 0 0 3px' }} />
            <div style={{ position: 'absolute', bottom: 6, right: 6, width: 12, height: 12, borderBottom: '1px solid rgba(201, 162, 39, 0.3)', borderRight: '1px solid rgba(201, 162, 39, 0.3)', borderRadius: '0 0 3px 0' }} />
            
            <motion.div
              animate={{ 
                y: [0, -3, 0],
                opacity: [0.5, 0.7, 0.5],
              }}
              transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
              style={{
                width: '48px',
                height: '48px',
                background: 'linear-gradient(145deg, rgba(201, 162, 39, 0.15) 0%, rgba(139, 112, 25, 0.08) 100%)',
                border: '2px solid rgba(201, 162, 39, 0.25)',
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '0.75rem',
              }}
            >
              <GiClick style={{ fontSize: '1.5rem', color: 'rgba(201, 162, 39, 0.6)' }} />
            </motion.div>
            <div style={{
              fontSize: '0.85rem',
              fontWeight: 600,
              color: 'rgba(200, 190, 170, 0.7)',
              fontFamily: "'Cinzel', Georgia, serif",
              marginBottom: '0.25rem',
            }}>
              Select an Item
            </div>
            <div style={{
              fontSize: '0.7rem',
              color: 'rgba(140, 130, 110, 0.5)',
            }}>
              Choose from your inventory to craft
            </div>
          </motion.div>
        )}

        {/* Crafting Orbs Section */}
        <div>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            marginBottom: '0.75rem',
          }}>
            <GiGems style={{ fontSize: '0.9rem', color: '#c9a227' }} />
            <span style={{
              fontSize: '0.75rem',
              fontWeight: 600,
              color: '#c9a227',
              fontFamily: "'Cinzel', Georgia, serif",
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
            }}>
              Crafting Orbs
            </span>
          </div>
          
          {/* Orbs grid - premium layout */}
          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'center',
            gap: '0.6rem',
            padding: '0.5rem',
            background: 'linear-gradient(180deg, rgba(25, 22, 18, 0.5) 0%, rgba(15, 13, 10, 0.6) 100%)',
            borderRadius: '10px',
            border: '1px solid rgba(80, 70, 55, 0.25)',
          }}>
            {CRAFTING_ORBS.map(orb => (
              <OrbButton
                key={orb.type}
                orb={orb}
                count={orbs[orb.type]}
                isSelected={selectedOrb === orb.type}
                hasOrbs={orbs[orb.type] > 0}
                onClick={() => onSelectOrb(orb.type === selectedOrb ? null : orb.type)}
              />
            ))}
          </div>
        </div>

        {/* Selected Orb Description - Grand */}
        <AnimatePresence mode="wait">
          {selectedOrb && (
            <motion.div
              key={selectedOrb}
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              style={{ 
                position: 'relative',
                padding: '0.85rem 1rem', 
                background: 'linear-gradient(180deg, rgba(201, 162, 39, 0.12) 0%, rgba(25, 22, 18, 0.95) 100%)',
                border: '1px solid rgba(201, 162, 39, 0.35)',
                borderRadius: '10px',
                overflow: 'hidden',
              }}
            >
              {/* Textured overlay */}
              <div style={{
                position: 'absolute',
                inset: 0,
                backgroundImage: 'url(/tilebackground.png)',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                opacity: 0.04,
                pointerEvents: 'none',
              }} />
              
              {/* Top gold line */}
              <motion.div
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 0.3 }}
                style={{
                  position: 'absolute',
                  top: 0,
                  left: '15%',
                  right: '15%',
                  height: '2px',
                  background: 'linear-gradient(90deg, transparent, #c9a227, transparent)',
                  transformOrigin: 'center',
                }}
              />
              
              {/* Corner ornaments */}
              <PanelOrnaments color="#c9a227" size="small" />
              
              {/* Content */}
              <div style={{ position: 'relative', zIndex: 1 }}>
                <div style={{ 
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  marginBottom: '0.5rem',
                }}>
                  <GiSparkles style={{ fontSize: '0.9rem', color: '#c9a227' }} />
                  <span style={{ 
                    fontWeight: 700, 
                    fontSize: '0.9rem',
                    color: '#c9a227',
                    fontFamily: "'Cinzel', Georgia, serif",
                    textShadow: '0 0 12px rgba(201, 162, 39, 0.4)',
                    letterSpacing: '0.03em',
                  }}>
                    {CRAFTING_ORBS.find(o => o.type === selectedOrb)?.name}
                  </span>
                </div>
                <div style={{ 
                  fontSize: '0.78rem',
                  lineHeight: 1.5,
                  color: 'rgba(220, 210, 190, 0.9)',
                }}>
                  {CRAFTING_ORBS.find(o => o.type === selectedOrb)?.description}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Apply Button - Premium Design */}
        <AnimatePresence>
          {selectedOrb && selectedItem && (
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              style={{ position: 'relative' }}
            >
              {/* Particle burst container */}
              <AnimatePresence>
                {particles.map((particle) => (
                  <motion.div
                    key={particle.id}
                    initial={{ 
                      opacity: 1, 
                      scale: 1,
                      x: '50%',
                      y: '50%',
                    }}
                    animate={{ 
                      opacity: 0, 
                      scale: 0,
                      x: `calc(50% + ${Math.cos(particle.angle * Math.PI / 180) * 80}px)`,
                      y: `calc(50% + ${Math.sin(particle.angle * Math.PI / 180) * 60}px)`,
                    }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.6, ease: 'easeOut' }}
                    style={{
                      position: 'absolute',
                      width: '8px',
                      height: '8px',
                      background: 'radial-gradient(circle, #c9a227 0%, #fbbf24 50%, transparent 100%)',
                      borderRadius: '50%',
                      pointerEvents: 'none',
                      zIndex: 20,
                      boxShadow: '0 0 10px #c9a227, 0 0 20px rgba(201, 162, 39, 0.5)',
                    }}
                  />
                ))}
              </AnimatePresence>
              
              {/* The actual button */}
              <motion.button
                whileHover={orbs[selectedOrb] > 0 && !isCrafting ? { scale: 1.02 } : {}}
                whileTap={orbs[selectedOrb] > 0 && !isCrafting ? { scale: 0.98 } : {}}
                animate={isCrafting ? {
                  boxShadow: [
                    '0 0 0px rgba(201, 162, 39, 0)',
                    '0 0 30px rgba(201, 162, 39, 0.8)',
                    '0 0 60px rgba(251, 191, 36, 1)',
                    '0 0 30px rgba(201, 162, 39, 0.8)',
                    '0 0 0px rgba(201, 162, 39, 0)',
                  ],
                } : {}}
                transition={isCrafting ? { duration: 0.5, ease: 'easeOut' } : { duration: 0.15 }}
                onClick={handleCraft}
                disabled={orbs[selectedOrb] <= 0 || isCrafting}
                style={{
                  position: 'relative',
                  width: '100%',
                  padding: '0.9rem 1.25rem',
                  background: orbs[selectedOrb] > 0
                    ? 'linear-gradient(180deg, rgba(201, 162, 39, 0.35) 0%, rgba(139, 112, 25, 0.2) 50%, rgba(201, 162, 39, 0.25) 100%)'
                    : 'rgba(60, 55, 50, 0.4)',
                  border: 'none',
                  borderRadius: '10px',
                  color: orbs[selectedOrb] > 0 ? '#f0e6d2' : 'rgba(140, 130, 110, 0.5)',
                  fontSize: '0.9rem',
                  fontWeight: 700,
                  cursor: orbs[selectedOrb] > 0 && !isCrafting ? 'pointer' : 'not-allowed',
                  fontFamily: "'Cinzel', Georgia, serif",
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                  overflow: 'hidden',
                  boxShadow: orbs[selectedOrb] > 0 
                    ? '0 4px 20px rgba(201, 162, 39, 0.3), inset 0 1px 0 rgba(255,255,255,0.1), inset 0 -2px 0 rgba(0,0,0,0.2)'
                    : 'inset 0 0 10px rgba(0,0,0,0.3)',
                }}
              >
                {/* Outer border glow */}
                <div style={{
                  position: 'absolute',
                  inset: 0,
                  borderRadius: '10px',
                  border: `2px solid ${orbs[selectedOrb] > 0 ? 'rgba(201, 162, 39, 0.7)' : 'rgba(80, 70, 55, 0.3)'}`,
                  pointerEvents: 'none',
                }} />
                
                {/* Top highlight line */}
                <div style={{
                  position: 'absolute',
                  top: '1px',
                  left: '10%',
                  right: '10%',
                  height: '1px',
                  background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)',
                  pointerEvents: 'none',
                }} />
                
                {/* Animated inner glow when enabled */}
                {orbs[selectedOrb] > 0 && !isCrafting && (
                  <motion.div
                    animate={{ 
                      opacity: [0.3, 0.6, 0.3],
                    }}
                    transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                    style={{
                      position: 'absolute',
                      inset: 0,
                      background: 'radial-gradient(ellipse at 50% 0%, rgba(201, 162, 39, 0.25) 0%, transparent 60%)',
                      pointerEvents: 'none',
                    }}
                  />
                )}
                
                {/* Shimmer sweep effect */}
                {orbs[selectedOrb] > 0 && !isCrafting && (
                  <motion.div
                    animate={{ x: ['-150%', '250%'] }}
                    transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut', repeatDelay: 1 }}
                    style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      width: '40%',
                      height: '100%',
                      background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.15), transparent)',
                      pointerEvents: 'none',
                      transform: 'skewX(-20deg)',
                    }}
                  />
                )}
                
                {/* Crafting animation overlay */}
                {isCrafting && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    style={{
                      position: 'absolute',
                      inset: 0,
                      background: 'radial-gradient(circle at 50% 50%, rgba(251, 191, 36, 0.4) 0%, rgba(201, 162, 39, 0.2) 50%, transparent 70%)',
                      pointerEvents: 'none',
                    }}
                  />
                )}
                
                {/* Button content */}
                <span style={{ 
                  position: 'relative', 
                  zIndex: 1,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.6rem',
                }}>
                  <motion.span
                    animate={isCrafting ? { rotate: 360 } : { rotate: 0 }}
                    transition={isCrafting ? { duration: 0.5, ease: 'linear' } : {}}
                  >
                    <GiMagicSwirl style={{ 
                      fontSize: '1.2rem', 
                      color: orbs[selectedOrb] > 0 ? '#c9a227' : 'rgba(140, 130, 110, 0.5)',
                      filter: orbs[selectedOrb] > 0 ? 'drop-shadow(0 0 4px rgba(201, 162, 39, 0.6))' : 'none',
                    }} />
                  </motion.span>
                  <span style={{ textShadow: orbs[selectedOrb] > 0 ? '0 2px 10px rgba(0,0,0,0.5)' : 'none' }}>
                    {isCrafting ? 'Crafting...' : `Apply ${CRAFTING_ORBS.find(o => o.type === selectedOrb)?.name}`}
                  </span>
                </span>
                
                {/* Bottom decorative line */}
                <div style={{
                  position: 'absolute',
                  bottom: '2px',
                  left: '20%',
                  right: '20%',
                  height: '1px',
                  background: orbs[selectedOrb] > 0 
                    ? 'linear-gradient(90deg, transparent, rgba(201, 162, 39, 0.5), transparent)'
                    : 'transparent',
                  pointerEvents: 'none',
                }} />
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Crafting Message - Enhanced */}
        <AnimatePresence>
          {craftingMessage && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.8, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: -10 }}
              transition={{ type: 'spring', damping: 15, stiffness: 300 }}
              style={{ 
                position: 'relative',
                textAlign: 'center', 
                padding: '1rem 1.25rem',
                background: 'linear-gradient(180deg, rgba(201, 162, 39, 0.2) 0%, rgba(139, 112, 25, 0.1) 50%, rgba(25, 22, 18, 0.95) 100%)',
                border: '2px solid rgba(201, 162, 39, 0.5)',
                borderRadius: '10px',
                overflow: 'hidden',
              }}
            >
              {/* Animated background glow */}
              <motion.div
                animate={{ 
                  opacity: [0.2, 0.5, 0.2],
                  scale: [1, 1.1, 1],
                }}
                transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                style={{
                  position: 'absolute',
                  inset: 0,
                  background: 'radial-gradient(ellipse at 50% 50%, rgba(201, 162, 39, 0.2) 0%, transparent 60%)',
                  pointerEvents: 'none',
                }}
              />
              
              {/* Top gold line */}
              <motion.div
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 0.4, delay: 0.1 }}
                style={{
                  position: 'absolute',
                  top: 0,
                  left: '10%',
                  right: '10%',
                  height: '2px',
                  background: 'linear-gradient(90deg, transparent, #c9a227, transparent)',
                  transformOrigin: 'center',
                }}
              />
              
              {/* Corner sparkles with stagger */}
              {[
                { top: 8, left: 10, delay: 0 },
                { top: 8, right: 10, delay: 0.15 },
                { bottom: 8, left: 10, delay: 0.3 },
                { bottom: 8, right: 10, delay: 0.45 },
              ].map((pos, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ 
                    opacity: [0, 1, 0.5, 1, 0],
                    scale: [0, 1.2, 1, 1.2, 0],
                    rotate: [0, 180, 360],
                  }}
                  transition={{ 
                    duration: 2, 
                    repeat: Infinity, 
                    delay: pos.delay,
                    ease: 'easeInOut',
                  }}
                  style={{ 
                    position: 'absolute',
                    ...pos,
                  }}
                >
                  <GiSparkles style={{ fontSize: '0.85rem', color: '#c9a227' }} />
                </motion.div>
              ))}
              
              {/* Message content */}
              <motion.div
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                style={{
                  position: 'relative',
                  zIndex: 1,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem',
                }}
              >
                <motion.span
                  animate={{ rotate: [0, 360] }}
                  transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
                >
                  <GiMagicSwirl style={{ fontSize: '1rem', color: '#c9a227' }} />
                </motion.span>
                <span style={{
                  fontSize: '0.9rem',
                  fontWeight: 700,
                  fontFamily: "'Cinzel', Georgia, serif",
                  color: '#c9a227',
                  textShadow: '0 0 15px rgba(201, 162, 39, 0.5)',
                  letterSpacing: '0.03em',
                }}>
                  {craftingMessage}
                </span>
                <motion.span
                  animate={{ rotate: [360, 0] }}
                  transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
                >
                  <GiMagicSwirl style={{ fontSize: '1rem', color: '#c9a227' }} />
                </motion.span>
              </motion.div>
              
              {/* Bottom gold line */}
              <motion.div
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 0.4, delay: 0.2 }}
                style={{
                  position: 'absolute',
                  bottom: 0,
                  left: '10%',
                  right: '10%',
                  height: '2px',
                  background: 'linear-gradient(90deg, transparent, #c9a227, transparent)',
                  transformOrigin: 'center',
                }}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      
      {/* Bottom decorative line */}
      <div style={{
        height: '1px',
        margin: '0 1rem 0.5rem 1rem',
        background: 'linear-gradient(90deg, transparent, rgba(120, 100, 70, 0.3), transparent)',
        position: 'relative',
      }}>
        <div style={{
          position: 'absolute',
          left: '50%',
          top: '50%',
          transform: 'translate(-50%, -50%) rotate(45deg)',
          width: '4px',
          height: '4px',
          background: '#c9a227',
          opacity: 0.4,
          borderRadius: '1px',
        }} />
      </div>
    </div>
  );
}
