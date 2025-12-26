import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { CharacterRole } from '../../types/character';
import type { CharacterClassId, CharacterClass } from '../../types/classes';
import { getClassesForRole, getClassById, getClassPortrait } from '../../types/classes';
import { useGameStore } from '../../store/gameStore';
import { generateRandomCharacterName } from '../../utils/characterNames';
import { 
  GiShieldBash, GiBroadsword, GiScrollUnfurled,
  // Tank class icons
  GiCheckedShield, GiMagicShield, GiCrossedSwords, GiSwordClash, GiCloakDagger, GiGhost, 
  GiMagicSwirl, GiVortex, GiPortal,
  // Healer class icons  
  GiAngelWings, GiDrop, GiBookmark, GiOakLeaf, GiHeartPlus, GiPentacle,
  GiShield, GiSkullCrossedBones, GiChessRook,
  // Extra icons
  GiSparkles, GiSwordsEmblem, GiHealthNormal,
  // Stat icons
  GiHearts, GiWaterDrop, GiShieldReflect, GiRunningNinja, GiBoltShield,
  GiMagicGate, GiTargetArrows, GiPunchBlast, GiMuscleUp,
  GiBrain, GiHealthIncrease, GiWaterRecycling
} from 'react-icons/gi';

// Animation variants - smooth and clean
const overlayVariants = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1,
    transition: { duration: 0.25, ease: 'easeOut' as const }
  },
  exit: { 
    opacity: 0,
    transition: { duration: 0.2, ease: 'easeIn' as const }
  }
};

const contentVariants = {
  hidden: { opacity: 0, y: 15 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { 
      duration: 0.3, 
      ease: [0.4, 0, 0.2, 1] as const
    }
  },
  exit: { 
    opacity: 0, 
    y: 10,
    transition: { duration: 0.2, ease: 'easeIn' as const }
  }
};

const stepVariants = {
  hidden: { opacity: 0, x: 30 },
  visible: { 
    opacity: 1, 
    x: 0,
    transition: { 
      duration: 0.3, 
      ease: [0.4, 0, 0.2, 1] as const
    }
  },
  exit: { 
    opacity: 0, 
    x: -20,
    transition: { duration: 0.2, ease: 'easeIn' as const }
  }
};

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.03,
      duration: 0.3,
      ease: [0.4, 0, 0.2, 1] as const
    }
  }),
  hover: {
    y: -4,
    transition: { duration: 0.15, ease: 'easeOut' as const }
  },
  tap: {
    scale: 0.99,
    transition: { duration: 0.1 }
  }
};

const detailsVariants = {
  hidden: { opacity: 0, x: 15 },
  visible: { 
    opacity: 1, 
    x: 0,
    transition: { 
      duration: 0.5, 
      ease: [0.16, 1, 0.3, 1] as const,
      staggerChildren: 0.1
    }
  }
};


// Dark fantasy icons for each class
const CLASS_ICONS: Record<CharacterClassId, React.ReactNode> = {
  // Tank classes
  bastion_knight: <GiCheckedShield />,
  wardbreaker: <GiMagicShield />,
  iron_skirmisher: <GiCrossedSwords />,
  duel_warden: <GiSwordClash />,
  shadow_warden: <GiCloakDagger />,
  ghostblade: <GiGhost />,
  arcane_bulwark: <GiMagicSwirl />,
  null_templar: <GiVortex />,
  phase_guardian: <GiPortal />,
  // Healer classes
  high_cleric: <GiAngelWings />,
  blood_confessor: <GiDrop />,
  tactician: <GiBookmark />,
  grove_healer: <GiOakLeaf />,
  vitalist: <GiHeartPlus />,
  ritual_warden: <GiPentacle />,
  aegis_keeper: <GiShield />,
  martyr: <GiSkullCrossedBones />,
  bastion_strategist: <GiChessRook />,
};

// Get icon for a class with fallback
function getClassIcon(classId: CharacterClassId): React.ReactNode {
  return CLASS_ICONS[classId] || <GiShieldBash />;
}

const ROLE_ICONS: Record<CharacterRole, React.ReactNode> = {
  tank: <GiSwordsEmblem />,
  healer: <GiHealthNormal />,
  dps: <GiBroadsword />
};

const ROLE_TITLES: Record<CharacterRole, string> = {
  tank: 'Guardian of the Frontline',
  healer: 'Keeper of Sacred Light',
  dps: 'Herald of Destruction'
};

const ROLE_DESCRIPTIONS: Record<CharacterRole, string> = {
  tank: 'Stand resolute against the darkness. Your shield is the last bastion between your allies and oblivion.',
  healer: 'Channel the ancient arts of restoration. Where death spreads its shadow, you bring the dawn.',
  dps: 'Unleash devastating power upon your foes. The battlefield trembles at your approach.'
};

interface AddCharacterModalProps {
  isOpen: boolean;
  role: CharacterRole;
  classId: CharacterClassId | null;
  onRoleChange: (role: CharacterRole) => void;
  onClassChange: (classId: CharacterClassId | null) => void;
  onConfirm: () => void;
  onCancel: () => void;
}

// Floating particle component
function FloatingParticle({ delay, duration, left }: { delay: number; duration: number; left: string }) {
  return (
    <div style={{
      position: 'absolute',
      left,
      bottom: '-10px',
      width: '3px',
      height: '3px',
      background: 'radial-gradient(circle, rgba(201, 162, 39, 0.8) 0%, transparent 70%)',
      borderRadius: '50%',
      animationName: 'floatUp',
      animationDuration: `${duration}s`,
      animationTimingFunction: 'ease-in-out',
      animationIterationCount: 'infinite',
      animationDelay: `${delay}s`,
      pointerEvents: 'none',
    }} />
  );
}

// Large artwork class card for grid layout
function LargeClassCard({ 
  cls, 
  isSelected, 
  onSelect,
  index = 0,
}: { 
  cls: CharacterClass; 
  isSelected: boolean;
  onSelect: () => void;
  index?: number;
}) {
  const portrait = getClassPortrait(cls.id);
  
  return (
    <motion.div
      onClick={onSelect}
      custom={index}
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      whileHover="hover"
      whileTap="tap"
      layout
      style={{
        position: 'relative',
        height: '100%',
        minHeight: 0,
        cursor: 'pointer',
        overflow: 'hidden',
        borderRadius: '12px',
        border: isSelected 
          ? `4px solid ${cls.primaryColor}` 
          : '3px solid rgba(60, 45, 30, 0.4)',
        boxShadow: isSelected 
          ? `0 0 50px ${cls.primaryColor}50, 0 10px 40px rgba(0,0,0,0.6)`
          : '0 6px 25px rgba(0, 0, 0, 0.5)',
      }}
    >
      {/* Full artwork background */}
      {portrait && (
        <motion.div 
          style={{
            position: 'absolute',
            inset: '-8%',
            backgroundImage: `url(${portrait})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center 15%',
          }}
          initial={{ scale: 1, filter: 'brightness(0.85)' }}
          whileHover={{ scale: 1.1, filter: 'brightness(1.1)' }}
          animate={isSelected ? { scale: 1.05, filter: 'brightness(1.05)' } : {}}
          transition={{ duration: 0.4 }}
        />
      )}
      
      {/* Gradient overlay - softer to show more artwork */}
      <div style={{
        position: 'absolute',
        inset: 0,
        background: `linear-gradient(180deg, 
          transparent 0%, 
          transparent 50%, 
          rgba(0, 0, 0, 0.6) 75%,
          rgba(0, 0, 0, 0.92) 100%
        )`,
        pointerEvents: 'none',
      }} />
      
      {/* Top gradient for contrast */}
      <div style={{
        position: 'absolute',
        inset: 0,
        background: 'linear-gradient(180deg, rgba(0, 0, 0, 0.2) 0%, transparent 25%)',
        pointerEvents: 'none',
      }} />
      
      {/* Class color glow when selected */}
      <motion.div 
        style={{
          position: 'absolute',
          inset: 0,
          pointerEvents: 'none',
        }}
        animate={{
          boxShadow: isSelected 
            ? `inset 0 0 80px ${cls.primaryColor}50`
            : `inset 0 0 60px ${cls.primaryColor}15`,
        }}
        transition={{ duration: 0.3 }}
      />
      
      {/* Selection ring */}
      <AnimatePresence>
        {isSelected && (
          <motion.div 
            initial={{ opacity: 0, scale: 1.1 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.3 }}
            style={{
              position: 'absolute',
              inset: '8px',
              border: `2px solid ${cls.primaryColor}60`,
              borderRadius: '8px',
              pointerEvents: 'none',
            }} 
          />
        )}
      </AnimatePresence>
      
      {/* Dark gradient overlay at bottom for text readability */}
      <div style={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: '50%',
        background: 'linear-gradient(to top, rgba(0,0,0,0.95) 0%, rgba(0,0,0,0.8) 40%, transparent 100%)',
        pointerEvents: 'none',
      }} />
      
      {/* Content at bottom */}
      <div style={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        padding: '1.5rem',
        textAlign: 'center',
      }}>
        {/* Icon - white with colored glow for visibility */}
        <motion.div 
          style={{
            fontSize: '2.5rem',
            color: '#ffffff',
            marginBottom: '0.75rem',
            filter: `drop-shadow(0 0 10px ${cls.primaryColor}) drop-shadow(0 0 20px ${cls.primaryColor}) drop-shadow(0 0 30px ${cls.primaryColor}80) drop-shadow(0 3px 6px rgba(0,0,0,1))`,
            display: 'flex',
            justifyContent: 'center',
          }}
          animate={isSelected ? { scale: 1.15 } : { scale: 1 }}
          whileHover={{ scale: 1.2, rotate: [0, -5, 5, 0] }}
          transition={{ duration: 0.3 }}
        >
          {getClassIcon(cls.id)}
        </motion.div>
        
        {/* Name - larger and more visible */}
        <div style={{
          fontFamily: "'Cinzel', Georgia, serif",
          fontSize: '1.3rem',
          fontWeight: 700,
          color: '#ffffff',
          textShadow: `
            0 0 10px ${cls.primaryColor}, 
            0 0 20px ${cls.primaryColor}, 
            0 0 30px ${cls.primaryColor}80,
            0 2px 4px rgba(0,0,0,1),
            0 4px 8px rgba(0,0,0,0.8)
          `,
          letterSpacing: '0.08em',
          marginBottom: '0.4rem',
        }}>
          {cls.name}
        </div>
        
        {/* Theme - larger white text with strong colored glow */}
        <div style={{
          fontSize: '0.95rem',
          color: '#ffffff',
          fontStyle: 'italic',
          fontFamily: "'Crimson Text', Georgia, serif",
          textShadow: `
            0 0 8px ${cls.primaryColor}, 
            0 0 16px ${cls.primaryColor}, 
            0 0 24px ${cls.primaryColor}60,
            0 2px 4px rgba(0,0,0,1)
          `,
          opacity: 0.95,
        }}>
          {cls.theme}
        </div>
        
        {/* Selection indicator - white with colored glow */}
        <AnimatePresence>
          {isSelected && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              style={{
                marginTop: '0.8rem',
                display: 'flex',
                justifyContent: 'center',
                gap: '0.5rem',
                alignItems: 'center',
              }}
            >
              <motion.span
                animate={{ rotate: [0, 15, -15, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
                style={{
                  filter: `drop-shadow(0 0 8px ${cls.primaryColor}) drop-shadow(0 0 12px ${cls.primaryColor})`,
                }}
              >
                <GiSparkles style={{ color: '#ffffff', fontSize: '1rem' }} />
              </motion.span>
              <span style={{
                fontSize: '0.8rem',
                color: '#ffffff',
                fontFamily: "'Cinzel', Georgia, serif",
                textTransform: 'uppercase',
                letterSpacing: '0.2em',
                textShadow: `
                  0 0 10px ${cls.primaryColor}, 
                  0 0 20px ${cls.primaryColor}, 
                  0 2px 4px rgba(0,0,0,1)
                `,
              }}>
                Selected
              </span>
              <motion.span
                animate={{ rotate: [0, -15, 15, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
                style={{
                  filter: `drop-shadow(0 0 8px ${cls.primaryColor}) drop-shadow(0 0 12px ${cls.primaryColor})`,
                }}
              >
                <GiSparkles style={{ color: '#ffffff', fontSize: '1rem' }} />
              </motion.span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}


export function AddCharacterModal({ 
  isOpen, 
  role, 
  classId,
  onRoleChange,
  onClassChange,
  onConfirm, 
  onCancel 
}: AddCharacterModalProps) {
  const [step, setStep] = useState<'role' | 'class'>('role');
  const [fadeIn, setFadeIn] = useState(false);
  const addCharacter = useGameStore(state => state.addCharacter);
  
  useEffect(() => {
    if (isOpen) {
      setFadeIn(true);
      // If role is tank or healer, skip to class selection (role was pre-set by slot)
      // DPS goes to role selection since DPS classes aren't implemented yet
      if (role === 'tank' || role === 'healer') {
        setStep('class');
      } else {
        setStep('role');
      }
    } else {
      setFadeIn(false);
    }
  }, [isOpen, role]);
  
  if (!isOpen) return null;

  const availableClasses = getClassesForRole(role);
  const selectedClass = classId ? getClassById(classId) : null;
  const displayClass = selectedClass;
  const canCreate = !!classId;
  
  const stepIndex = step === 'role' ? 0 : 1;

  const handleRoleSelect = (r: CharacterRole) => {
    onRoleChange(r);
    onClassChange(null);
    if (r === 'tank' || r === 'healer') {
      setStep('class');
    }
  };

  const handleClassSelect = (cId: CharacterClassId) => {
    onClassChange(cId);
  };

  const handleBack = () => {
    if (step === 'class') {
      // If role was pre-set (tank/healer from slot), close modal instead of going to role
      if (role === 'tank' || role === 'healer') {
        onCancel();
      } else {
        setStep('role');
      }
    }
  };

  const handleNext = () => {
    console.log('handleNext called', { step, classId, canCreate });
    if (step === 'class' && classId) {
      console.log('Calling onConfirm');
      onConfirm();
    } else {
      console.warn('handleNext condition not met', { step, classId });
    }
  };

  return (
    <>
      {/* CSS Animations */}
      <style>{`
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        @keyframes floatUp {
          0%, 100% { 
            transform: translateY(0) scale(1);
            opacity: 0;
          }
          10% { opacity: 0.8; }
          90% { opacity: 0.4; }
          100% { 
            transform: translateY(-100vh) scale(0.5);
            opacity: 0;
          }
        }
        @keyframes shimmer {
          0% { background-position: -200% center; }
          100% { background-position: 200% center; }
        }
        @keyframes pulseGlow {
          0%, 100% { opacity: 0.5; }
          50% { opacity: 1; }
        }
        @keyframes fadeInUp {
          from { 
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
      
      {/* Full screen overlay */}
      <motion.div 
        onClick={onCancel}
        variants={overlayVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 1000,
          background: `
            radial-gradient(ellipse at 50% 30%, rgba(30, 25, 20, 0.95) 0%, rgba(5, 3, 2, 0.99) 70%),
            linear-gradient(180deg, rgba(10, 8, 5, 1) 0%, rgba(0, 0, 0, 1) 100%)
          `,
          display: 'flex',
          flexDirection: 'column',
          opacity: fadeIn ? 1 : 0,
          transition: 'opacity 0.5s ease',
          overflow: 'hidden',
        }}
      >
        {/* Animated particles */}
        {[...Array(20)].map((_, i) => (
          <FloatingParticle 
            key={i} 
            delay={i * 0.5} 
            duration={8 + Math.random() * 4} 
            left={`${5 + Math.random() * 90}%`} 
          />
        ))}
        
        {/* Ambient vignette */}
        <div style={{
          position: 'absolute',
          inset: 0,
          background: 'radial-gradient(ellipse at center, transparent 30%, rgba(0, 0, 0, 0.8) 100%)',
          pointerEvents: 'none',
        }} />
        
        {/* Top decorative border */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: '10%',
          right: '10%',
          height: '2px',
          background: 'linear-gradient(90deg, transparent, rgba(201, 162, 39, 0.5), transparent)',
        }} />
        
        {/* Main content container */}
        <motion.div 
          onClick={e => e.stopPropagation()}
          variants={contentVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            maxWidth: '1400px',
            width: '100%',
            height: '100%',
            maxHeight: '100vh',
            margin: '0 auto',
            padding: '1.5rem 2rem',
            position: 'relative',
            overflow: 'hidden',
            boxSizing: 'border-box',
          }}
        >
          {/* Header */}
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            style={{
              textAlign: 'center',
              marginBottom: '1rem',
              flexShrink: 0,
            }}
          >
            {/* Close button */}
            <button 
              onClick={onCancel}
              style={{
                position: 'absolute',
                top: '1rem',
                right: '1rem',
                background: 'rgba(30, 25, 20, 0.8)',
                border: '1px solid rgba(90, 70, 50, 0.5)',
                borderRadius: '50%',
                color: '#7a6c56',
                width: '40px',
                height: '40px',
                cursor: 'pointer',
                fontSize: '1.5rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.2s ease',
              }}
            >
              ×
            </button>
            
            {/* Title */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '1rem',
              marginBottom: '0.5rem',
            }}>
              <div style={{
                width: '60px',
                height: '1px',
                background: 'linear-gradient(90deg, transparent, rgba(201, 162, 39, 0.6))',
              }} />
              <GiScrollUnfurled style={{ fontSize: '2rem', color: '#c9a227' }} />
              <h1 style={{
                margin: 0,
                fontSize: '1.8rem',
                fontFamily: "'Cinzel', Georgia, serif",
                fontWeight: 700,
                color: '#f5edd8',
                textTransform: 'uppercase',
                letterSpacing: '0.15em',
                textShadow: '0 0 30px rgba(201, 162, 39, 0.5)',
              }}>
                Forge Your Legend
              </h1>
              <GiScrollUnfurled style={{ fontSize: '2rem', color: '#c9a227', transform: 'scaleX(-1)' }} />
              <div style={{
                width: '60px',
                height: '1px',
                background: 'linear-gradient(90deg, rgba(201, 162, 39, 0.6), transparent)',
              }} />
            </div>
            
            {/* Step indicators */}
            <div style={{
              display: 'flex',
              justifyContent: 'center',
              gap: '1.5rem',
              marginTop: '0.75rem',
            }}>
              {['Choose Calling', 'Select Class', 'Name Hero'].map((label, i) => (
                <div key={i} style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  opacity: i <= stepIndex ? 1 : 0.4,
                  transition: 'opacity 0.3s ease',
                }}>
                  <div style={{
                    width: '28px',
                    height: '28px',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: i < stepIndex 
                      ? 'linear-gradient(135deg, #c9a227 0%, #8b6914 100%)'
                      : i === stepIndex 
                        ? 'linear-gradient(135deg, #8b6914 0%, #5a4510 100%)'
                        : 'rgba(30, 25, 20, 0.8)',
                    border: i <= stepIndex 
                      ? '2px solid #c9a227'
                      : '2px solid rgba(90, 70, 50, 0.4)',
                    color: '#f5edd8',
                    fontWeight: 700,
                    fontSize: '0.8rem',
                    fontFamily: "'Cinzel', Georgia, serif",
                    boxShadow: i === stepIndex ? '0 0 20px rgba(201, 162, 39, 0.5)' : 'none',
                  }}>
                    {i < stepIndex ? '✓' : i + 1}
                  </div>
                  <span style={{
                    fontSize: '0.8rem',
                    color: i === stepIndex ? '#c9a227' : '#7a6c56',
                    fontFamily: "'Cinzel', Georgia, serif",
                    textTransform: 'uppercase',
                    letterSpacing: '0.08em',
                  }}>
                    {label}
                  </span>
                  {i < 2 && (
                    <div style={{
                      width: '40px',
                      height: '1px',
                      background: i < stepIndex 
                        ? 'rgba(201, 162, 39, 0.6)'
                        : 'rgba(90, 70, 50, 0.3)',
                      marginLeft: '0.5rem',
                    }} />
                  )}
                </div>
              ))}
            </div>
          </motion.div>
          
          {/* Main content area */}
          <div style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            minHeight: 0,
            overflow: 'hidden',
          }}>
            <AnimatePresence mode="wait">
            {/* Step 1: Role Selection */}
            {step === 'role' && (
              <motion.div 
                key="role-step"
                variants={stepVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                style={{
                  flex: 1,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <h2 style={{
                  fontSize: '1.3rem',
                  fontFamily: "'Cinzel', Georgia, serif",
                  color: '#c9a227',
                  margin: '0 0 0.5rem 0',
                  textTransform: 'uppercase',
                  letterSpacing: '0.1em',
                }}>
                  What Path Calls to You?
                </h2>
                <p style={{ color: '#7a6c56', fontSize: '0.9rem', marginBottom: '2rem' }}>
                  Every legend begins with a choice
                </p>
                
                <div style={{ 
                  display: 'flex', 
                  gap: '2rem', 
                  maxWidth: '900px',
                }}>
                  {(['tank', 'healer'] as CharacterRole[]).map(r => {
                    const isSelected = role === r;
                    const roleColor = r === 'tank' ? '#4a7ab8' : '#3d9e5c';
                    
                    return (
                      <div
                        key={r}
                        onClick={() => handleRoleSelect(r)}
                        style={{ 
                          flex: 1,
                          padding: '2rem',
                          background: `
                            radial-gradient(ellipse at center, ${roleColor}15 0%, transparent 70%),
                            linear-gradient(180deg, rgba(25, 20, 15, 0.9) 0%, rgba(15, 12, 8, 0.95) 100%)
                          `,
                          border: `2px solid ${isSelected ? roleColor : 'rgba(90, 70, 50, 0.4)'}`,
                          borderRadius: '12px',
                          cursor: 'pointer',
                          textAlign: 'center',
                          transition: 'all 0.3s ease',
                          boxShadow: isSelected 
                            ? `0 0 40px ${roleColor}40, inset 0 0 40px ${roleColor}10`
                            : '0 4px 20px rgba(0,0,0,0.4)',
                          transform: isSelected ? 'scale(1.02)' : 'scale(1)',
                        }}
                      >
                        <div style={{
                          fontSize: '4rem',
                          color: roleColor,
                          marginBottom: '1rem',
                          filter: `drop-shadow(0 0 20px ${roleColor})`,
                          display: 'flex',
                          justifyContent: 'center',
                        }}>
                          {ROLE_ICONS[r]}
                        </div>
                        
                        <div style={{ 
                          fontWeight: 700, 
                          fontSize: '1.4rem',
                          color: '#f5edd8',
                          fontFamily: "'Cinzel', Georgia, serif",
                          textTransform: 'uppercase',
                          letterSpacing: '0.1em',
                          marginBottom: '0.5rem',
                          textShadow: `0 0 20px ${roleColor}`,
                        }}>
                          {r}
                        </div>
                        
                        <div style={{
                          fontSize: '0.8rem',
                          color: roleColor,
                          fontStyle: 'italic',
                          marginBottom: '1rem',
                          fontFamily: "'Crimson Text', Georgia, serif",
                        }}>
                          {ROLE_TITLES[r]}
                        </div>
                        
                        <div style={{ 
                          fontSize: '0.9rem', 
                          color: '#8a7a5e',
                          lineHeight: 1.6,
                          fontFamily: "'Crimson Text', Georgia, serif",
                        }}>
                          {ROLE_DESCRIPTIONS[r]}
                        </div>
                      </div>
                    );
                  })}
                </div>
                
                {/* DPS Coming Soon */}
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 0.6 }}
                  transition={{ delay: 0.4 }}
                  onClick={() => {
                    // Add placeholder DPS character with random unique name
                    const placeholderName = generateRandomCharacterName();
                    addCharacter(placeholderName, 'dps');
                    onCancel(); // Close the modal
                  }}
                  style={{
                    marginTop: '1.5rem',
                    padding: '0.75rem 1.5rem',
                    background: 'rgba(25, 20, 15, 0.5)',
                    border: '1px dashed rgba(60, 45, 30, 0.4)',
                    borderRadius: '8px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.75rem',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                  }}
                  whileHover={{
                    opacity: 0.9,
                    background: 'rgba(40, 30, 20, 0.6)',
                    borderColor: 'rgba(100, 75, 50, 0.6)',
                  }}
                >
                  <GiBroadsword style={{ fontSize: '1.5rem', color: '#5a4a3a' }} />
                  <span style={{ color: '#5a4a3a', fontStyle: 'italic' }}>
                    DPS Classes — Coming Soon (Click to add placeholder)
                  </span>
                </motion.div>
              </motion.div>
            )}
            
            {/* Step 2: Class Selection - Large Artwork Grid */}
            {step === 'class' && (
              <motion.div 
                key="class-step"
                variants={stepVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                style={{
                  flex: 1,
                  display: 'flex',
                  flexDirection: 'column',
                  minHeight: 0,
                  overflow: 'hidden',
                }}
              >
                {/* Section title */}
                <div style={{ textAlign: 'center', marginBottom: '0.75rem', flexShrink: 0 }}>
                  <h2 style={{
                    fontSize: '1.1rem',
                    fontFamily: "'Cinzel', Georgia, serif",
                    color: '#c9a227',
                    margin: '0 0 0.25rem 0',
                    textTransform: 'uppercase',
                    letterSpacing: '0.08em',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.5rem',
                  }}>
                    <span style={{ fontSize: '1.2rem' }}>{ROLE_ICONS[role]}</span>
                    Choose Your {role === 'tank' ? 'Defender' : 'Healer'}
                  </h2>
                  <p style={{ color: '#7a6c56', fontSize: '0.8rem', margin: 0 }}>
                    Select a class to see their story
                  </p>
                </div>
                
                {/* Two-column layout: Grid + Details */}
                <div style={{
                  flex: 1,
                  display: 'flex',
                  gap: '1rem',
                  minHeight: 0,
                  overflow: 'hidden',
                }}>
                  {/* Left: Class grid with snap scrolling */}
                  <div 
                    style={{
                      flex: 1,
                      overflowY: 'scroll',
                      overflowX: 'hidden',
                      paddingRight: '0.5rem',
                      minHeight: 0,
                      scrollSnapType: 'y mandatory',
                      position: 'relative',
                      // Hide scrollbar but allow scrolling
                      scrollbarWidth: 'none',
                      msOverflowStyle: 'none',
                    }}
                    className="hide-scrollbar"
                  >
                    {/* Group classes into rows of 3 */}
                    {Array.from({ length: Math.ceil(availableClasses.length / 3) }).map((_, rowIndex) => {
                      const rowClasses = availableClasses.slice(rowIndex * 3, rowIndex * 3 + 3);
                      return (
                        <div 
                          key={rowIndex}
                          style={{
                            height: '100%',
                            boxSizing: 'border-box',
                            scrollSnapAlign: 'start',
                            scrollSnapStop: 'always',
                            display: 'grid',
                            gridTemplateColumns: `repeat(${rowClasses.length}, 1fr)`,
                            gap: '1rem',
                            padding: '0.5rem',
                            alignContent: 'stretch',
                          }}
                        >
                          {rowClasses.map((cls, index) => (
                            <LargeClassCard
                              key={cls.id}
                              cls={cls}
                              isSelected={classId === cls.id}
                              onSelect={() => handleClassSelect(cls.id)}
                              index={rowIndex * 3 + index}
                            />
                          ))}
                        </div>
                      );
                    })}
                    
                    {/* Scroll indicator - fixed at bottom of first view */}
                    {availableClasses.length > 3 && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.8 }}
                        style={{
                          position: 'absolute',
                          bottom: '8px',
                          left: '50%',
                          transform: 'translateX(-50%)',
                          zIndex: 10,
                          pointerEvents: 'none',
                        }}
                      >
                        <motion.div
                          animate={{ y: [0, 8, 0] }}
                          transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
                          style={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            background: 'rgba(0, 0, 0, 0.7)',
                            padding: '6px 16px',
                            borderRadius: '20px',
                            border: '1px solid rgba(201, 162, 39, 0.3)',
                          }}
                        >
                          <span style={{ 
                            color: '#c9a227', 
                            fontSize: '0.7rem',
                            fontFamily: "'Cinzel', Georgia, serif",
                            letterSpacing: '0.05em',
                          }}>
                            Scroll for more ▼
                          </span>
                        </motion.div>
                      </motion.div>
                    )}
                  </div>
                  
                  {/* Right: Details panel */}
                  <motion.div 
                    layout
                    style={{
                      width: '320px',
                      flexShrink: 0,
                      background: 'rgba(10, 8, 5, 0.95)',
                      borderRadius: '10px',
                      overflow: 'hidden',
                      display: 'flex',
                      flexDirection: 'column',
                    }}
                    animate={{
                      borderColor: displayClass ? `${displayClass.primaryColor}40` : 'rgba(60, 45, 30, 0.3)',
                      boxShadow: displayClass ? `0 0 30px ${displayClass.primaryColor}20` : 'none',
                    }}
                    transition={{ duration: 0.3 }}
                  >
                    <AnimatePresence mode="wait">
                    {displayClass ? (
                      <motion.div 
                        key={displayClass.id}
                        variants={detailsVariants}
                        initial="hidden"
                        animate="visible"
                        exit="hidden"
                        style={{ 
                          display: 'flex', 
                          flexDirection: 'column',
                          height: '100%',
                          overflow: 'hidden',
                        }}
                      >
                        {/* Large portrait header */}
                        <div style={{
                          height: '180px',
                          position: 'relative',
                          flexShrink: 0,
                          overflow: 'hidden',
                        }}>
                          {getClassPortrait(displayClass.id) && (
                            <div style={{
                              position: 'absolute',
                              inset: 0,
                              backgroundImage: `url(${getClassPortrait(displayClass.id)})`,
                              backgroundSize: 'cover',
                              backgroundPosition: 'center 20%',
                            }} />
                          )}
                          
                          <div style={{
                            position: 'absolute',
                            inset: 0,
                            background: `linear-gradient(180deg, transparent 30%, rgba(10, 8, 5, 1) 100%)`,
                          }} />
                          
                          <div style={{
                            position: 'absolute',
                            inset: 0,
                            boxShadow: `inset 0 0 40px ${displayClass.primaryColor}25`,
                          }} />
                          
                          {/* Name overlay */}
                          <div style={{
                            position: 'absolute',
                            bottom: 0,
                            left: 0,
                            right: 0,
                            padding: '0.75rem 1rem',
                            textAlign: 'center',
                          }}>
                            <div style={{
                              fontSize: '1.5rem',
                              color: displayClass.primaryColor,
                              marginBottom: '0.3rem',
                              filter: `drop-shadow(0 0 10px ${displayClass.primaryColor})`,
                              display: 'flex',
                              justifyContent: 'center',
                            }}>
                              {getClassIcon(displayClass.id)}
                            </div>
                            <h3 style={{
                              margin: 0,
                              fontFamily: "'Cinzel', Georgia, serif",
                              fontSize: '1.1rem',
                              fontWeight: 700,
                              color: '#f5edd8',
                              textShadow: `0 0 15px ${displayClass.primaryColor}, 0 2px 4px rgba(0,0,0,0.8)`,
                              letterSpacing: '0.04em',
                            }}>
                              {displayClass.name}
                            </h3>
                            <div style={{
                              fontSize: '0.75rem',
                              color: displayClass.primaryColor,
                              fontStyle: 'italic',
                              marginTop: '0.15rem',
                              fontFamily: "'Crimson Text', Georgia, serif",
                            }}>
                              {displayClass.theme}
                            </div>
                          </div>
                        </div>
                        
                        {/* Details content */}
                        <div style={{
                          flex: 1,
                          padding: '0.75rem 1rem',
                          overflowY: 'auto',
                          background: `linear-gradient(180deg, ${displayClass.primaryColor}08 0%, transparent 100%)`,
                        }}>
                          {/* Class Description */}
                          <p style={{
                            fontSize: '0.8rem',
                            color: '#d4c9b0',
                            lineHeight: 1.5,
                            margin: '0 0 0.6rem 0',
                          }}>
                            {displayClass.description}
                          </p>
                          
                          {/* Fantasy quote */}
                          <div style={{
                            padding: '0.5rem 0.75rem',
                            background: 'rgba(0, 0, 0, 0.3)',
                            borderRadius: '6px',
                            borderLeft: `3px solid ${displayClass.primaryColor}60`,
                            marginBottom: '0.6rem',
                          }}>
                            <p style={{
                              fontSize: '0.75rem',
                              color: '#c9b87c',
                              fontStyle: 'italic',
                              fontFamily: "'Crimson Text', Georgia, serif",
                              lineHeight: 1.4,
                              margin: 0,
                            }}>
                              "{displayClass.fantasy}"
                            </p>
                          </div>
                          
                          {/* Playstyle */}
                          <div style={{ marginBottom: '0.6rem' }}>
                            <div style={{ 
                              fontSize: '0.6rem', 
                              color: '#7a6c56', 
                              textTransform: 'uppercase', 
                              letterSpacing: '0.08em', 
                              marginBottom: '0.2rem',
                              fontFamily: "'Cinzel', Georgia, serif",
                            }}>
                              Playstyle
                            </div>
                            <p style={{
                              fontSize: '0.75rem',
                              color: '#b8a88c',
                              lineHeight: 1.4,
                              margin: 0,
                            }}>
                              {displayClass.playstyle}
                            </p>
                          </div>
                          
                          {/* Key stats */}
                          <div style={{ marginBottom: '0.75rem' }}>
                            <div style={{ 
                              fontSize: '0.6rem', 
                              color: '#7a6c56', 
                              textTransform: 'uppercase', 
                              letterSpacing: '0.08em', 
                              marginBottom: '0.3rem',
                              fontFamily: "'Cinzel', Georgia, serif",
                            }}>
                              Key Attributes
                            </div>
                            <div style={{ display: 'flex', gap: '0.3rem', flexWrap: 'wrap' }}>
                              {displayClass.keyStats.map((stat, i) => (
                                <span 
                                  key={i}
                                  style={{
                                    fontSize: '0.7rem',
                                    padding: '0.2rem 0.4rem',
                                    borderRadius: '3px',
                                    background: `${displayClass.primaryColor}20`,
                                    color: displayClass.primaryColor,
                                    border: `1px solid ${displayClass.primaryColor}40`,
                                    fontWeight: 600,
                                  }}
                                >
                                  {stat}
                                </span>
                              ))}
                            </div>
                          </div>
                          
                          {/* Defense/Healing info */}
                          <div style={{
                            padding: '0.5rem 0.6rem',
                            background: 'rgba(0, 0, 0, 0.25)',
                            borderRadius: '6px',
                            border: `1px solid ${displayClass.primaryColor}25`,
                            marginBottom: '0.75rem',
                          }}>
                            {displayClass.role === 'tank' && displayClass.defensePool && (
                              <div style={{ display: 'flex', gap: '1rem' }}>
                                <div>
                                  <div style={{ fontSize: '0.55rem', color: '#7a6c56', textTransform: 'uppercase', fontFamily: "'Cinzel', Georgia, serif" }}>Defense Pool</div>
                                  <div style={{ color: displayClass.primaryColor, fontWeight: 600, fontSize: '0.8rem', fontFamily: "'Cinzel', Georgia, serif" }}>
                                    {displayClass.defensePool === 'energyShield' ? 'Energy Shield' : 
                                     displayClass.defensePool.charAt(0).toUpperCase() + displayClass.defensePool.slice(1)}
                                  </div>
                                </div>
                                <div>
                                  <div style={{ fontSize: '0.55rem', color: '#7a6c56', textTransform: 'uppercase', fontFamily: "'Cinzel', Georgia, serif" }}>Mitigation</div>
                                  <div style={{ color: displayClass.primaryColor, fontWeight: 600, fontSize: '0.8rem', fontFamily: "'Cinzel', Georgia, serif" }}>
                                    {displayClass.mitigationTypes?.map(m => {
                                      const mitigationLabels: Record<string, string> = {
                                        'block': 'Block',
                                        'spellBlock': 'Spell Block',
                                        'spellSuppression': 'Spell Suppression',
                                        'dodge': 'Dodge',
                                      };
                                      return mitigationLabels[m] || m;
                                    }).join(' + ')}
                                  </div>
                                </div>
                              </div>
                            )}
                            {displayClass.role === 'healer' && displayClass.healingStyle && (
                              <div style={{ display: 'flex', gap: '1rem' }}>
                                <div>
                                  <div style={{ fontSize: '0.55rem', color: '#7a6c56', textTransform: 'uppercase', fontFamily: "'Cinzel', Georgia, serif" }}>Healing Style</div>
                                  <div style={{ color: displayClass.primaryColor, fontWeight: 600, fontSize: '0.8rem', fontFamily: "'Cinzel', Georgia, serif" }}>
                                    {(() => {
                                      const styleLabels: Record<string, string> = {
                                        'casted': 'Casted Heals',
                                        'hot': 'Heal Over Time',
                                        'shields': 'Shielding',
                                        'damageReduction': 'Damage Reduction',
                                      };
                                      return styleLabels[displayClass.healingStyle] || displayClass.healingStyle;
                                    })()}
                                  </div>
                                </div>
                                <div>
                                  <div style={{ fontSize: '0.55rem', color: '#7a6c56', textTransform: 'uppercase', fontFamily: "'Cinzel', Georgia, serif" }}>Resource</div>
                                  <div style={{ color: displayClass.primaryColor, fontWeight: 600, fontSize: '0.8rem', fontFamily: "'Cinzel', Georgia, serif" }}>
                                    {(() => {
                                      const resourceLabels: Record<string, string> = {
                                        'mana': 'Mana',
                                        'life': 'Life',
                                        'cooldowns': 'Cooldowns',
                                      };
                                      return resourceLabels[displayClass.resourceType || ''] || displayClass.resourceType;
                                    })()}
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>
                          
                          {/* Class Stat Bonuses */}
                          {displayClass.statModifiers && Object.keys(displayClass.statModifiers).length > 0 && (
                            <div>
                              <div style={{ 
                                fontSize: '0.6rem', 
                                color: '#7a6c56', 
                                textTransform: 'uppercase', 
                                letterSpacing: '0.1em', 
                                marginBottom: '0.4rem',
                                fontFamily: "'Cinzel', Georgia, serif",
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.4rem',
                              }}>
                                <GiSparkles style={{ color: displayClass.primaryColor, fontSize: '0.7rem' }} />
                                Class Bonuses
                              </div>
                              <div style={{
                                display: 'flex',
                                flexDirection: 'column',
                                gap: '0.35rem',
                              }}>
                                {Object.entries(displayClass.statModifiers).map(([stat, value]) => {
                                  if (value === undefined || value === 0) return null;
                                  
                                  // Stat configuration with icons and colors
                                  const statConfig: Record<string, { name: string; icon: React.ReactNode; color: string }> = {
                                    'armor': { name: 'Armor', icon: <GiShieldReflect />, color: '#a0a0a0' },
                                    'evasion': { name: 'Evasion Rating', icon: <GiRunningNinja />, color: '#7cb87c' },
                                    'energyShield': { name: 'Energy Shield', icon: <GiBoltShield />, color: '#9b7cd4' },
                                    'life': { name: 'Life', icon: <GiHearts />, color: '#e74c3c' },
                                    'maxLife': { name: 'Maximum Life', icon: <GiHearts />, color: '#e74c3c' },
                                    'mana': { name: 'Mana', icon: <GiWaterDrop />, color: '#3498db' },
                                    'maxMana': { name: 'Maximum Mana', icon: <GiWaterDrop />, color: '#3498db' },
                                    'blockChance': { name: 'Block Chance', icon: <GiShield />, color: '#5dade2' },
                                    'spellBlockChance': { name: 'Spell Block Chance', icon: <GiMagicGate />, color: '#af7ac5' },
                                    'spellSuppression': { name: 'Spell Suppression', icon: <GiMagicShield />, color: '#48c9b0' },
                                    'dodgeChance': { name: 'Dodge Chance', icon: <GiRunningNinja />, color: '#58d68d' },
                                    'criticalStrikeChance': { name: 'Critical Strike Chance', icon: <GiTargetArrows />, color: '#f39c12' },
                                    'criticalStrikeMultiplier': { name: 'Critical Strike Multiplier', icon: <GiPunchBlast />, color: '#e67e22' },
                                    'lifeRegeneration': { name: 'Life Regeneration', icon: <GiHealthIncrease />, color: '#e74c3c' },
                                    'manaRegeneration': { name: 'Mana Regeneration', icon: <GiWaterRecycling />, color: '#3498db' },
                                    'strength': { name: 'Strength', icon: <GiMuscleUp />, color: '#e74c3c' },
                                    'dexterity': { name: 'Dexterity', icon: <GiRunningNinja />, color: '#2ecc71' },
                                    'intelligence': { name: 'Intelligence', icon: <GiBrain />, color: '#3498db' },
                                  };
                                  
                                  // Fallback: Convert camelCase to Title Case
                                  const toTitleCase = (s: string) => {
                                    return s
                                      .replace(/([A-Z])/g, ' $1')
                                      .split(' ')
                                      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
                                      .join(' ')
                                      .trim();
                                  };
                                  
                                  const config = statConfig[stat] || { 
                                    name: toTitleCase(stat), 
                                    icon: <GiSparkles />, 
                                    color: '#c9a227' 
                                  };
                                  
                                  const isPercentage = stat.toLowerCase().includes('chance') || 
                                                       stat.toLowerCase().includes('multiplier') ||
                                                       stat.toLowerCase().includes('suppression') ||
                                                       stat.toLowerCase().includes('regeneration');
                                  
                                  const isPositive = (value as number) > 0;
                                  
                                  return (
                                    <div 
                                      key={stat}
                                      style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '0.5rem',
                                        padding: '0.4rem 0.6rem',
                                        background: `linear-gradient(90deg, ${config.color}15 0%, transparent 100%)`,
                                        borderLeft: `3px solid ${config.color}`,
                                        borderRadius: '0 4px 4px 0',
                                      }}
                                    >
                                      <div style={{
                                        fontSize: '1rem',
                                        color: config.color,
                                        filter: `drop-shadow(0 0 4px ${config.color}60)`,
                                        display: 'flex',
                                        alignItems: 'center',
                                      }}>
                                        {config.icon}
                                      </div>
                                      <div style={{ flex: 1 }}>
                                        <div style={{
                                          fontSize: '0.7rem',
                                          color: '#b8a88c',
                                          fontFamily: "'Crimson Text', Georgia, serif",
                                        }}>
                                          {config.name}
                                        </div>
                                      </div>
                                      <div style={{
                                        fontSize: '0.85rem',
                                        fontWeight: 700,
                                        fontFamily: "'Cinzel', Georgia, serif",
                                        color: isPositive ? '#7ce67c' : '#e67c7c',
                                        textShadow: isPositive 
                                          ? '0 0 8px rgba(124, 230, 124, 0.5)' 
                                          : '0 0 8px rgba(230, 124, 124, 0.5)',
                                      }}>
                                        {isPositive ? '+' : ''}{value}{isPercentage ? '%' : ''}
                                      </div>
                                    </div>
                                  );
                                })}
                              </div>
                            </div>
                          )}
                        </div>
                      </motion.div>
                    ) : (
                      <motion.div 
                        key="no-class"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        style={{
                          flex: 1,
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          justifyContent: 'center',
                          padding: '1.5rem',
                          color: '#5a4a3a',
                          textAlign: 'center',
                        }}
                      >
                        <motion.div 
                          animate={{ scale: [1, 1.05, 1] }}
                          transition={{ duration: 2, repeat: Infinity }}
                          style={{ fontSize: '2.5rem', marginBottom: '0.75rem', opacity: 0.4 }}
                        >
                          {ROLE_ICONS[role]}
                        </motion.div>
                        <div style={{ 
                          fontFamily: "'Cinzel', Georgia, serif", 
                          fontSize: '1rem',
                          marginBottom: '0.4rem',
                        }}>
                          Select a Class
                        </div>
                        <div style={{ fontSize: '0.8rem', opacity: 0.7 }}>
                          Click on any {role === 'tank' ? 'defender' : 'healer'} to see their story
                        </div>
                      </motion.div>
                    )}
                    </AnimatePresence>
                  </motion.div>
                </div>
              </motion.div>
            )}
            </AnimatePresence>
          </div>
          
          {/* Footer */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.4 }}
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              paddingTop: '1rem',
              borderTop: '1px solid rgba(90, 70, 50, 0.3)',
              marginTop: '0.75rem',
              flexShrink: 0,
            }}
          >
            {step !== 'role' ? (
              <button 
                onClick={handleBack}
                style={{
                  padding: '0.75rem 1.5rem',
                  background: 'linear-gradient(135deg, rgba(40, 32, 24, 0.9) 0%, rgba(25, 20, 15, 0.95) 100%)',
                  border: '1px solid rgba(90, 70, 50, 0.5)',
                  borderRadius: '6px',
                  color: '#b8a88c',
                  cursor: 'pointer',
                  fontSize: '0.9rem',
                  fontFamily: "'Cinzel', Georgia, serif",
                  fontWeight: 500,
                  transition: 'all 0.2s ease',
                }}
              >
                ← Back
              </button>
            ) : (
              <div />
            )}
            
            <div style={{ display: 'flex', gap: '1rem' }}>
              <button 
                onClick={onCancel}
                style={{
                  padding: '0.75rem 1.5rem',
                  background: 'linear-gradient(135deg, rgba(40, 32, 24, 0.9) 0%, rgba(25, 20, 15, 0.95) 100%)',
                  border: '1px solid rgba(90, 70, 50, 0.5)',
                  borderRadius: '6px',
                  color: '#b8a88c',
                  cursor: 'pointer',
                  fontSize: '0.9rem',
                  fontFamily: "'Cinzel', Georgia, serif",
                  fontWeight: 500,
                }}
              >
                Cancel
              </button>
              
              {step === 'class' && (
                <button 
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    console.log('Create Hero button clicked', { canCreate, classId, step });
                    handleNext();
                  }}
                  disabled={!canCreate}
                  style={{
                    padding: '0.75rem 2rem',
                    background: canCreate 
                      ? 'linear-gradient(135deg, #8b6914 0%, #5a4510 100%)'
                      : 'rgba(40, 32, 24, 0.5)',
                    border: `2px solid ${canCreate ? '#c9a227' : 'rgba(90, 70, 50, 0.3)'}`,
                    borderRadius: '6px',
                    color: canCreate ? '#f5edd8' : '#5a4a3a',
                    cursor: canCreate ? 'pointer' : 'not-allowed',
                    fontSize: '0.95rem',
                    fontFamily: "'Cinzel', Georgia, serif",
                    fontWeight: 600,
                    boxShadow: canCreate ? '0 0 20px rgba(201, 162, 39, 0.3)' : 'none',
                    textTransform: 'uppercase',
                    letterSpacing: '0.08em',
                  }}
                >
                  Create Hero →
                </button>
              )}
            </div>
          </motion.div>
        </motion.div>
      </motion.div>
    </>
  );
}
