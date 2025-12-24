import { motion, AnimatePresence } from 'framer-motion';
import type { CombatState } from '../../types/combat';
import { GiSkullCrossedBones, GiCrossedSwords } from 'react-icons/gi';
import { getEnemyImage } from '../../utils/enemyImages';
import { getBossAbilities } from '../../systems/combat/bossAbilities';

interface CombatPanelProps {
  isRunning: boolean;
  combatState: CombatState;
  enemyFightAnims: Record<string, number>;
}

// Muted, earthy colors for 1970s D&D aesthetic
const getEnemyTypeColor = (type: string): { primary: string; secondary: string; accent: string } => {
  switch (type) {
    case 'boss': 
      return { primary: '#8b1a1a', secondary: '#5c1010', accent: '#a02020' };
    case 'miniboss': 
      return { primary: '#6b4423', secondary: '#4a2f18', accent: '#8b5a2b' };
    case 'elite': 
      return { primary: '#8b6914', secondary: '#5c4510', accent: '#a07a18' };
    default: 
      return { primary: '#4a4a4a', secondary: '#333333', accent: '#5a5a5a' };
  }
};


export function CombatPanel({ isRunning, combatState, enemyFightAnims }: CombatPanelProps) {
  const hasDyingEnemy = combatState.enemies.some(e => e.isDead && e.deathTime && (Date.now() - e.deathTime) < 800);
  const aliveEnemies = combatState.enemies.filter(e => e.health > 0);

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="combat-panel-jrpg"
      style={{ 
        flex: 1, 
        display: 'flex', 
        flexDirection: 'column', 
        minHeight: '200px',
        position: 'relative',
        background: 'linear-gradient(180deg, rgba(30, 26, 22, 0.98) 0%, rgba(20, 17, 14, 0.99) 100%)',
        borderRadius: '2px',
        border: '1px solid rgba(90, 70, 50, 0.4)',
        boxShadow: 'inset 0 1px 0 rgba(255, 255, 255, 0.02), 0 2px 8px rgba(0, 0, 0, 0.3)',
        overflow: 'hidden',
      }}
    >
      {/* Background texture */}
      <div style={{
        position: 'absolute',
        inset: 0,
        backgroundImage: 'url(/tilebackground.png)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        opacity: 0.025,
        pointerEvents: 'none',
      }} />


      {/* Header */}
      <div style={{ 
        flexShrink: 0, 
        padding: '0.5rem 0.75rem',
        background: 'linear-gradient(180deg, rgba(139, 90, 43, 0.08) 0%, transparent 100%)',
        borderBottom: '1px solid rgba(90, 70, 50, 0.3)',
        position: 'relative',
      }}>
        <h3 style={{ 
          fontSize: '0.8rem',
          margin: 0,
          fontFamily: "'Cinzel', Georgia, serif",
          fontWeight: 600,
          color: isRunning && combatState.phase === 'combat' ? '#a02020' : '#8b6914',
          textTransform: 'uppercase',
          letterSpacing: '0.08em',
          display: 'flex',
          alignItems: 'center',
          gap: '0.4rem',
        }}>
          <GiCrossedSwords style={{ fontSize: '0.9rem' }} />
          Combat
        </h3>
      </div>

      {/* Content */}
      <div 
        className={hasDyingEnemy ? 'has-dying-enemy' : ''}
        style={{ 
          padding: '0.6rem', 
          flex: 1, 
          overflow: 'auto', 
          position: 'relative' 
        }}
      >
        {!isRunning ? (
          <div style={{ 
            color: '#5a4a3a', 
            textAlign: 'center', 
            padding: '1.5rem 1rem', 
            fontSize: '0.8rem',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '0.5rem'
          }}>
            <GiSkullCrossedBones style={{ fontSize: '1.5rem', opacity: 0.3 }} />
            <span style={{ fontStyle: 'italic' }}>Start a run to enter combat</span>
          </div>
        ) : aliveEnemies.length === 0 ? (
          <div style={{ 
            color: '#5a4a3a', 
            textAlign: 'center', 
            padding: '1.5rem 1rem', 
            fontSize: '0.8rem',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '0.5rem'
          }}>
            {combatState.phase === 'traveling' ? (
              <>
                <span style={{ fontSize: '1.5rem', opacity: 0.5 }}>⟡</span>
                <span style={{ fontStyle: 'italic', color: '#7a6c56' }}>Traveling...</span>
              </>
            ) : combatState.phase === 'victory' ? (
              <>
                <span style={{ fontSize: '1.5rem', color: '#8b6914' }}>★</span>
                <span style={{ color: '#8b6914', fontWeight: 600, fontSize: '0.9rem' }}>Victory</span>
              </>
            ) : (
              <>
                <GiSkullCrossedBones style={{ fontSize: '1.5rem', opacity: 0.3 }} />
                <span style={{ fontStyle: 'italic' }}>No enemies nearby</span>
              </>
            )}
          </div>
        ) : (
          <div style={{ position: 'relative' }}>
            {/* Enemies header */}
            <div style={{ 
              fontSize: '0.6rem', 
              color: '#7a6c56', 
              marginBottom: '0.5rem',
              textTransform: 'uppercase',
              letterSpacing: '0.1em',
              fontWeight: 600,
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              fontFamily: "'Cinzel', Georgia, serif",
            }}>
              <span style={{ opacity: 0.6 }}>†</span>
              <span>Hostiles ({aliveEnemies.length})</span>
              <div style={{ flex: 1, height: '1px', background: 'linear-gradient(90deg, rgba(90, 70, 50, 0.3), transparent)' }} />
            </div>

            {/* Enemy list */}
            <AnimatePresence>
              {combatState.enemies
                .filter(e => e.health > 0 || (e.isDead && e.deathTime && (Date.now() - e.deathTime) < 500))
                .map((enemy) => {
                  const isDying = enemy.isDead && enemy.deathTime && (Date.now() - enemy.deathTime) < 500;
                  const fightAnimKey = enemyFightAnims[enemy.id] || 0;
                  const healthPercent = enemy.health / enemy.maxHealth;
                  const colors = getEnemyTypeColor(enemy.type || 'normal');
                  const isBossOrElite = enemy.type === 'boss' || enemy.type === 'miniboss' || enemy.type === 'elite';
                  const isBoss = enemy.type === 'boss' || enemy.type === 'miniboss';
                  
                  return (
                    <motion.div 
                      key={`${enemy.id}-${isDying ? 'dying' : 'alive'}`}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: isDying ? 0 : 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.25 }}
                      className={`${fightAnimKey > 0 ? 'enemy-fighting' : ''}`}
                      data-fight-key={fightAnimKey}
                      style={{ 
                        marginBottom: isBoss ? '1rem' : '0.5rem',
                        position: isDying ? 'absolute' : 'relative',
                        width: isDying ? '100%' : 'auto',
                        zIndex: isBoss ? 100 : (isDying ? 100 : 'auto'),
                        padding: isBoss ? '1.2rem 1.4rem' : '0.5rem 0.6rem',
                        // Grand, official look for bosses
                        background: isBoss 
                          ? 'linear-gradient(180deg, rgba(45, 35, 28, 0.98) 0%, rgba(30, 22, 18, 0.99) 50%, rgba(20, 15, 12, 1) 100%)'
                          : 'linear-gradient(180deg, rgba(35, 30, 25, 0.95) 0%, rgba(25, 22, 18, 0.98) 100%)',
                        borderRadius: isBoss ? '4px' : '2px',
                        // Grand border for bosses
                        border: isBoss 
                          ? `2px solid ${colors.primary}`
                          : `1px solid ${colors.primary}`,
                        borderLeft: isBoss 
                          ? `5px solid ${colors.primary}`
                          : isBossOrElite 
                            ? `3px solid ${colors.primary}` 
                            : `1px solid ${colors.primary}`,
                        // Enhanced shadow for bosses
                        boxShadow: isBoss
                          ? `
                            inset 0 1px 0 rgba(255,255,255,0.05),
                            inset 0 -1px 0 rgba(0,0,0,0.5),
                            0 4px 20px rgba(0,0,0,0.6),
                            0 0 30px ${colors.primary}40,
                            0 0 60px ${colors.primary}20
                          `
                          : 'inset 0 1px 0 rgba(255,255,255,0.03), 0 2px 4px rgba(0,0,0,0.3)',
                        overflow: 'hidden',
                      }}
                    >
                      {/* Boss decorative corner accents */}
                      {isBoss && (
                        <>
                          <div style={{
                            position: 'absolute',
                            top: '0',
                            left: '0',
                            width: '30px',
                            height: '30px',
                            borderTop: `3px solid ${colors.accent}`,
                            borderLeft: `3px solid ${colors.accent}`,
                            opacity: 0.6,
                            zIndex: 1
                          }} />
                          <div style={{
                            position: 'absolute',
                            top: '0',
                            right: '0',
                            width: '30px',
                            height: '30px',
                            borderTop: `3px solid ${colors.accent}`,
                            borderRight: `3px solid ${colors.accent}`,
                            opacity: 0.6,
                            zIndex: 1
                          }} />
                          <div style={{
                            position: 'absolute',
                            bottom: '0',
                            left: '0',
                            width: '30px',
                            height: '30px',
                            borderBottom: `3px solid ${colors.accent}`,
                            borderLeft: `3px solid ${colors.accent}`,
                            opacity: 0.6,
                            zIndex: 1
                          }} />
                          <div style={{
                            position: 'absolute',
                            bottom: '0',
                            right: '0',
                            width: '30px',
                            height: '30px',
                            borderBottom: `3px solid ${colors.accent}`,
                            borderRight: `3px solid ${colors.accent}`,
                            opacity: 0.6,
                            zIndex: 1
                          }} />
                        </>
                      )}

                      {/* Content row */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: isBoss ? '1rem' : '0.6rem', marginBottom: isBoss ? '0.8rem' : '0.4rem', position: 'relative', zIndex: 2 }}>
                        {/* Enemy Image/Icon Frame - Grand style for bosses */}
                        <div style={{
                          width: isBoss ? '64px' : '32px',
                          height: isBoss ? '64px' : '32px',
                          borderRadius: isBoss ? '4px' : '2px',
                          background: isBoss
                            ? `linear-gradient(145deg, rgba(50, 40, 35, 0.98) 0%, rgba(30, 25, 20, 1) 100%)`
                            : `linear-gradient(145deg, rgba(40, 35, 30, 0.95) 0%, rgba(25, 22, 18, 0.98) 100%)`,
                          border: isBoss ? `3px solid ${colors.primary}` : `2px solid ${colors.primary}`,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: isBoss ? '2rem' : '1.1rem',
                          position: 'relative',
                          flexShrink: 0,
                          boxShadow: isBoss
                            ? `inset 0 2px 6px rgba(0,0,0,0.6), 0 0 20px ${colors.primary}50, 0 4px 12px rgba(0,0,0,0.5), 0 8px 16px rgba(0, 0, 0, 0.8)`
                            : 'inset 0 1px 3px rgba(0,0,0,0.5)',
                          overflow: 'hidden',
                          backgroundImage: isBoss ? `radial-gradient(circle at center, ${colors.primary}20, transparent 70%)` : 'none',
                          filter: isBoss ? 'drop-shadow(0 8px 16px rgba(0, 0, 0, 0.8)) drop-shadow(0 4px 8px rgba(0, 0, 0, 0.6))' : 'none',
                        }}>
                          {(() => {
                            const enemyImage = getEnemyImage(enemy.name);
                            return enemyImage ? (
                              <img 
                                src={enemyImage} 
                                alt={enemy.name}
                                style={{
                                  width: '100%',
                                  height: '100%',
                                  objectFit: 'contain',
                                  imageRendering: 'crisp-edges',
                                  position: 'relative',
                                  zIndex: 1
                                }}
                              />
                            ) : (
                              <span style={{ position: 'relative', zIndex: 1 }}>{enemy.icon}</span>
                            );
                          })()}
                        </div>
                        
                        {/* Enemy Name and Type */}
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ 
                            fontSize: isBoss ? '1.1rem' : '0.8rem', 
                            fontWeight: isBoss ? 700 : 600,
                            fontFamily: "'Cinzel', Georgia, serif",
                            color: isBoss ? '#f0e6d2' : '#e8dcc4',
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            textShadow: isBoss ? `2px 2px 4px rgba(0,0,0,0.8), 0 0 10px ${colors.primary}40` : 'none',
                            letterSpacing: isBoss ? '0.05em' : 'normal',
                          }}>
                            {enemy.name}
                          </div>
                          {isBossOrElite && (
                            <div style={{
                              fontSize: isBoss ? '0.65rem' : '0.5rem',
                              color: colors.accent,
                              textTransform: 'uppercase',
                              letterSpacing: isBoss ? '0.15em' : '0.1em',
                              fontWeight: isBoss ? 700 : 600,
                              marginTop: isBoss ? '4px' : '2px',
                              fontFamily: "'Cinzel', Georgia, serif",
                              textShadow: isBoss ? `0 0 8px ${colors.accent}60, 1px 1px 2px rgba(0,0,0,0.8)` : 'none',
                            }}>
                              {enemy.type === 'boss' ? '★ BOSS' : enemy.type === 'miniboss' ? '◆ MINIBOSS' : '• ELITE'}
                            </div>
                          )}
                        </div>
                        
                        {/* Health number */}
                        <span style={{ 
                          fontSize: isBoss ? '0.95rem' : '0.75rem', 
                          color: healthPercent > 0.5 ? '#b8a88c' : healthPercent > 0.25 ? '#a07a4a' : '#8b2942',
                          fontWeight: isBoss ? 700 : 600,
                          fontFamily: "'JetBrains Mono', monospace",
                          minWidth: isBoss ? '70px' : '45px',
                          textAlign: 'right',
                          textShadow: isBoss ? '1px 1px 2px rgba(0,0,0,0.8)' : 'none',
                        }}>
                          {isDying ? '0' : Math.floor(enemy.health).toLocaleString()}
                        </span>
                      </div>
                      
                      {/* Health Bar - Grand style for bosses */}
                      <div style={{ 
                        height: isBoss ? '12px' : '8px', 
                        background: isBoss ? 'rgba(0, 0, 0, 0.6)' : 'rgba(0, 0, 0, 0.4)', 
                        borderRadius: isBoss ? '2px' : '1px', 
                        overflow: 'hidden', 
                        position: 'relative',
                        border: isBoss ? `2px solid ${colors.primary}60` : '1px solid rgba(90, 70, 50, 0.4)',
                        boxShadow: isBoss ? `inset 0 2px 4px rgba(0,0,0,0.5), 0 0 10px ${colors.primary}30` : 'none',
                      }}>
                        {/* Health fill */}
                        <motion.div 
                          initial={false}
                          animate={{ width: `${isDying ? 0 : healthPercent * 100}%` }}
                          transition={{ duration: 0.3 }}
                          className="enemy-health-bar-fill"
                          style={{ 
                            height: '100%',
                            background: isBoss
                              ? (healthPercent > 0.5 
                                  ? `linear-gradient(90deg, ${colors.primary} 0%, ${colors.accent} 100%)`
                                  : healthPercent > 0.25
                                    ? `linear-gradient(90deg, ${colors.accent} 0%, #8b6914 100%)`
                                    : `linear-gradient(90deg, #6d1f33 0%, #4a1419 100%)`)
                              : (healthPercent > 0.5 
                                  ? '#8b2942'
                                  : healthPercent > 0.25
                                    ? '#8b6914'
                                    : '#6d1f33'),
                            boxShadow: isBoss ? `inset 0 1px 2px rgba(255,255,255,0.2), 0 0 10px ${colors.primary}50` : 'none',
                          }} 
                        />
                      </div>
                      
                      {/* Cast Bar */}
                      {enemy.isCasting && !isDying && (() => {
                        // Get ability name if available for bosses
                        let abilityName = '';
                        if (isBoss && enemy.castAbility) {
                          const bossAbilities = getBossAbilities(enemy.name);
                          const ability = bossAbilities.find(a => a.id === enemy.castAbility);
                          if (ability) {
                            abilityName = ability.name;
                          }
                        }
                        
                        return (
                          <div style={{ marginTop: isBoss ? '0.6rem' : '0.3rem' }}>
                            {isBoss && abilityName && (
                              <div style={{
                                fontSize: '0.6rem',
                                color: colors.accent,
                                fontWeight: 700,
                                fontFamily: "'Cinzel', Georgia, serif",
                                textTransform: 'uppercase',
                                letterSpacing: '0.08em',
                                textShadow: `0 0 6px ${colors.accent}60, 1px 1px 2px rgba(0,0,0,0.8)`,
                                marginBottom: '0.3rem',
                              }}>
                                {abilityName}
                              </div>
                            )}
                            <div style={{ 
                              height: isBoss ? '12px' : '4px', 
                              background: isBoss ? 'rgba(0, 0, 0, 0.6)' : 'rgba(0, 0, 0, 0.3)', 
                              borderRadius: isBoss ? '3px' : '1px', 
                              overflow: 'hidden',
                              border: isBoss ? `2px solid ${colors.accent}80` : '1px solid rgba(139, 90, 43, 0.3)',
                              boxShadow: isBoss 
                                ? `inset 0 2px 4px rgba(0,0,0,0.6), 0 0 12px ${colors.accent}40, 0 2px 8px rgba(0,0,0,0.4)` 
                                : 'none',
                            }}>
                              <div 
                                key={`enemy-cast-${enemy.castStartTime}`}
                                className="cast-bar-filling"
                                style={{ 
                                  height: '100%', 
                                  background: isBoss 
                                    ? `linear-gradient(90deg, ${colors.accent} 0%, ${colors.primary} 100%)`
                                    : '#a07a4a',
                                  boxShadow: isBoss ? `inset 0 1px 2px rgba(255,255,255,0.2), 0 0 8px ${colors.accent}50` : 'none',
                                  animationDuration: `${enemy.castTotalTime || 2}s`
                                }} 
                              />
                            </div>
                          </div>
                        );
                      })()}
                    </motion.div>
                  );
                })}
            </AnimatePresence>
          </div>
        )}
      </div>

    </motion.div>
  );
}
