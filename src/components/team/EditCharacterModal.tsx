import { motion, AnimatePresence } from 'framer-motion';
import type { Character } from '../../types/character';
import { GiFeather } from 'react-icons/gi';
import { getClassById, getClassPortrait, getClassColor } from '../../types/classes';


// Animation variants
const overlayVariants = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1,
    transition: { duration: 0.3, ease: 'easeOut' as const }
  },
  exit: { 
    opacity: 0,
    transition: { duration: 0.2, ease: 'easeIn' as const }
  }
};

const modalVariants = {
  hidden: { 
    opacity: 0, 
    scale: 0.9,
    y: 20,
    filter: 'blur(10px)',
  },
  visible: { 
    opacity: 1, 
    scale: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: { 
      duration: 0.4, 
      ease: [0.34, 1.56, 0.64, 1] as const, // Bouncy spring
    }
  },
  exit: { 
    opacity: 0, 
    scale: 0.95,
    y: -10,
    filter: 'blur(5px)',
    transition: { duration: 0.2, ease: 'easeIn' as const }
  }
};

interface EditCharacterModalProps {
  isOpen: boolean;
  character: Character | null;
  onConfirm: () => void;
  onCancel: () => void;
}

export function EditCharacterModal({ 
  isOpen, 
  character, 
  onCancel 
}: EditCharacterModalProps) {
  if (!character) return null;
  
  // Get class colors for styling
  const classData = character.classId ? getClassById(character.classId) : null;
  const classColors = character.classId ? getClassColor(character.classId) : null;
  const portrait = character.classId ? getClassPortrait(character.classId) : null;
  const primaryColor = classColors?.primary || '#c9a227';

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div 
          className="modal-overlay" 
          onClick={onCancel}
          variants={overlayVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0, 0, 0, 0.85)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            backdropFilter: 'blur(4px)',
          }}
        >
          <motion.div 
            className="modal" 
            onClick={e => e.stopPropagation()}
            variants={modalVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            style={{
              background: 'linear-gradient(135deg, rgba(25, 22, 18, 0.98) 0%, rgba(15, 12, 8, 0.99) 100%)',
              border: `2px solid ${primaryColor}50`,
              borderRadius: '16px',
              overflow: 'hidden',
              boxShadow: `0 0 60px ${primaryColor}30, 0 20px 60px rgba(0,0,0,0.6)`,
              maxWidth: '450px',
              width: '90%',
            }}
          >
            {/* Header with portrait background */}
            <div style={{ 
              position: 'relative',
              padding: '1.5rem',
              background: `linear-gradient(135deg, ${primaryColor}20 0%, transparent 100%)`,
              borderBottom: `1px solid ${primaryColor}30`,
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <GiFeather style={{ color: primaryColor, fontSize: '1.5rem' }} />
                <h3 style={{ 
                  margin: 0,
                  fontFamily: "'Cinzel', Georgia, serif",
                  fontSize: '1.3rem',
                  color: '#f5edd8',
                  letterSpacing: '0.05em',
                }}>
                  Character Details
                </h3>
              </div>
              
              <motion.button 
                className="close-btn" 
                onClick={onCancel}
                whileHover={{ scale: 1.1, rotate: 90 }}
                whileTap={{ scale: 0.9 }}
                style={{
                  position: 'absolute',
                  top: '1rem',
                  right: '1rem',
                  background: 'rgba(0,0,0,0.5)',
                  border: `1px solid ${primaryColor}40`,
                  borderRadius: '50%',
                  width: '32px',
                  height: '32px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#b8a88c',
                  fontSize: '1.2rem',
                  cursor: 'pointer',
                }}
              >
                ×
              </motion.button>
            </div>
            
            <div className="modal-body" style={{ padding: '1.5rem' }}>
              {/* Character preview */}
              {portrait && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  style={{
                    width: '80px',
                    height: '80px',
                    borderRadius: '50%',
                    margin: '0 auto 1rem',
                    border: `3px solid ${primaryColor}`,
                    overflow: 'hidden',
                    boxShadow: `0 0 20px ${primaryColor}40`,
                  }}
                >
                  <div style={{
                    width: '100%',
                    height: '100%',
                    backgroundImage: `url(${portrait})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center 20%',
                  }} />
                </motion.div>
              )}
              
              
              <motion.div 
                className="form-group"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                style={{ marginTop: '1rem' }}
              >
                <label className="form-label" style={{
                  display: 'block',
                  marginBottom: '0.5rem',
                  color: '#7a6c56',
                  fontFamily: "'Cinzel', Georgia, serif",
                  fontSize: '0.75rem',
                  textTransform: 'uppercase',
                  letterSpacing: '0.1em',
                }}>
                  Class
                </label>
                <div style={{ 
                  padding: '0.75rem 1rem', 
                  background: 'rgba(10, 8, 5, 0.6)', 
                  borderRadius: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  border: '1px solid rgba(60, 45, 30, 0.4)',
                }}>
                  {classData?.icon && (
                    <span style={{ 
                      fontSize: '1.5rem', 
                      color: primaryColor,
                      filter: `drop-shadow(0 0 5px ${primaryColor})`,
                    }}>
                      {classData.icon}
                    </span>
                  )}
                  <div>
                    <div style={{ 
                      color: '#f5edd8', 
                      fontWeight: 600,
                      fontFamily: "'Cinzel', Georgia, serif",
                    }}>
                      {classData?.name || character.role}
                    </div>
                    {classData?.theme && (
                      <div style={{ 
                        color: primaryColor, 
                        fontSize: '0.75rem',
                        fontStyle: 'italic',
                      }}>
                        {classData.theme}
                      </div>
                    )}
                  </div>
                  <span style={{ 
                    color: 'var(--text-dim)', 
                    fontSize: '0.75rem', 
                    marginLeft: 'auto',
                    fontStyle: 'italic',
                  }}>
                    (Fixed)
                  </span>
                </div>
              </motion.div>
            </div>
            
            <motion.div 
              className="modal-footer"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25 }}
              style={{
                display: 'flex',
                justifyContent: 'flex-end',
                gap: '0.75rem',
                padding: '1rem 1.5rem',
                borderTop: '1px solid rgba(60, 45, 30, 0.3)',
                background: 'rgba(0,0,0,0.2)',
              }}
            >
              <motion.button 
                className="btn btn-secondary" 
                onClick={onCancel}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                style={{
                  padding: '0.6rem 1.25rem',
                  background: 'rgba(40, 32, 24, 0.8)',
                  border: '1px solid rgba(90, 70, 50, 0.5)',
                  borderRadius: '6px',
                  color: '#b8a88c',
                  cursor: 'pointer',
                  fontFamily: "'Cinzel', Georgia, serif",
                  fontSize: '0.9rem',
                  width: '100%',
                }}
              >
                Close
              </motion.button>
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

