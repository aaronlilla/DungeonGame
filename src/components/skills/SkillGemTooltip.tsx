import React from 'react';
import type { SkillGem } from '../../types/skills';
import { getTagColor } from '../../utils/tagColors';

interface SkillGemTooltipProps {
  skill: SkillGem;
  position: { x: number; y: number };
  gemLevel?: number;
}

// Color coding for gem types
const getGemColors = (category: string): { primary: string; glow: string; bg: string } => {
  if (category === 'attack') return { primary: '#ff4757', glow: 'rgba(255, 71, 87, 0.4)', bg: 'rgba(255, 71, 87, 0.08)' };
  if (category === 'spell') return { primary: '#3498db', glow: 'rgba(52, 152, 219, 0.4)', bg: 'rgba(52, 152, 219, 0.08)' };
  if (category === 'heal') return { primary: '#2ecc71', glow: 'rgba(46, 204, 113, 0.4)', bg: 'rgba(46, 204, 113, 0.08)' };
  if (category === 'buff' || category === 'defensive') return { primary: '#f1c40f', glow: 'rgba(241, 196, 15, 0.4)', bg: 'rgba(241, 196, 15, 0.08)' };
  if (category === 'utility') return { primary: '#9b59b6', glow: 'rgba(155, 89, 182, 0.4)', bg: 'rgba(155, 89, 182, 0.08)' };
  return { primary: '#95a5a6', glow: 'rgba(149, 165, 166, 0.4)', bg: 'rgba(149, 165, 166, 0.08)' };
};

// Get damage type color
const getDamageTypeColor = (damageType?: string): string => {
  switch (damageType) {
    case 'fire': return '#ff6b35';
    case 'cold': return '#36c5f4';
    case 'lightning': return '#ffd700';
    case 'chaos': return '#b366ff';
    case 'physical': return '#e0e0e0';
    case 'holy': return '#fff2cc';
    case 'nature': return '#66cc66';
    case 'arcane': return '#cc66ff';
    default: return '#e0e0e0';
  }
};

export const SkillGemTooltip: React.FC<SkillGemTooltipProps> = ({
  skill,
  position,
  gemLevel = 1
}) => {
  const colors = getGemColors(skill.category);
  const isAttack = skill.category === 'attack';
  
  // Calculate position to keep on screen
  const tooltipWidth = 380;
  const tooltipHeight = 550;
  
  let x = position.x + 20;
  let y = position.y + 15;
  
  // Keep on screen horizontally
  if (x + tooltipWidth > window.innerWidth - 10) {
    x = position.x - tooltipWidth - 20;
  }
  if (x < 10) x = 10;
  
  // Keep on screen vertically
  if (y + tooltipHeight > window.innerHeight - 10) {
    y = window.innerHeight - tooltipHeight - 10;
  }
  if (y < 10) y = 10;
  
  const tooltipStyle: React.CSSProperties = {
    position: 'fixed',
    left: x,
    top: y,
    zIndex: 100000,
    pointerEvents: 'none',
    maxHeight: 'calc(100vh - 20px)',
    overflowY: 'auto',
  };

  return (
    <div style={tooltipStyle}>
      {/* Outer decorative frame */}
      <div style={{
        position: 'relative',
        minWidth: '340px',
        maxWidth: '360px',
      }}>
        {/* Corner decorations */}
        <div style={{
          position: 'absolute',
          top: '-2px',
          left: '-2px',
          width: '20px',
          height: '20px',
          borderTop: `2px solid ${colors.primary}`,
          borderLeft: `2px solid ${colors.primary}`,
          borderRadius: '4px 0 0 0',
        }} />
        <div style={{
          position: 'absolute',
          top: '-2px',
          right: '-2px',
          width: '20px',
          height: '20px',
          borderTop: `2px solid ${colors.primary}`,
          borderRight: `2px solid ${colors.primary}`,
          borderRadius: '0 4px 0 0',
        }} />
        <div style={{
          position: 'absolute',
          bottom: '-2px',
          left: '-2px',
          width: '20px',
          height: '20px',
          borderBottom: `2px solid ${colors.primary}`,
          borderLeft: `2px solid ${colors.primary}`,
          borderRadius: '0 0 0 4px',
        }} />
        <div style={{
          position: 'absolute',
          bottom: '-2px',
          right: '-2px',
          width: '20px',
          height: '20px',
          borderBottom: `2px solid ${colors.primary}`,
          borderRight: `2px solid ${colors.primary}`,
          borderRadius: '0 0 4px 0',
        }} />
        
        {/* Main container */}
        <div 
          className="skill-gem-tooltip"
          style={{
            background: 'linear-gradient(135deg, rgba(15, 15, 20, 0.97) 0%, rgba(8, 8, 12, 0.98) 100%)',
            border: '1px solid rgba(80, 80, 100, 0.5)',
            borderRadius: '6px',
            boxShadow: `0 0 30px ${colors.glow}, 0 20px 60px rgba(0, 0, 0, 0.8), inset 0 1px 0 rgba(255,255,255,0.05)`,
            fontFamily: '"Outfit", "Segoe UI", sans-serif',
          }}>
          {/* Header with gem icon area */}
          <div style={{
            background: `linear-gradient(135deg, ${colors.bg} 0%, transparent 60%)`,
            borderBottom: `1px solid ${colors.primary}33`,
            padding: '16px 18px 14px',
            position: 'relative',
          }}>
            {/* Glow effect */}
            <div style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: '60px',
              background: `radial-gradient(ellipse at top, ${colors.glow} 0%, transparent 70%)`,
              opacity: 0.5,
              pointerEvents: 'none',
            }} />
            
            {/* Gem name and level badge */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', position: 'relative' }}>
              <div style={{
                fontSize: '20px',
                fontWeight: 700,
                color: colors.primary,
                letterSpacing: '-0.5px',
                textShadow: `0 0 20px ${colors.glow}`,
              }}>
                {skill.name}
              </div>
              <div style={{
                background: `linear-gradient(135deg, ${colors.primary}22, ${colors.primary}11)`,
                border: `1px solid ${colors.primary}44`,
                borderRadius: '4px',
                padding: '2px 8px',
                fontSize: '11px',
                fontWeight: 600,
                color: colors.primary,
              }}>
                Lv {gemLevel}
              </div>
            </div>
            
            {/* Category badge */}
            <div style={{ display: 'flex', gap: '8px', marginTop: '8px', flexWrap: 'wrap' }}>
              <div style={{
                background: `${colors.primary}18`,
                border: `1px solid ${colors.primary}33`,
                borderRadius: '12px',
                padding: '3px 10px',
                fontSize: '10px',
                fontWeight: 600,
                color: colors.primary,
                textTransform: 'uppercase',
                letterSpacing: '1px',
              }}>
                {skill.category}
              </div>
              
              {/* Channeling indicator */}
              {skill.isChanneled && (
                <div style={{
                  background: 'linear-gradient(135deg, rgba(155, 89, 182, 0.3), rgba(142, 68, 173, 0.2))',
                  border: '1px solid rgba(155, 89, 182, 0.5)',
                  borderRadius: '12px',
                  padding: '3px 10px',
                  fontSize: '10px',
                  fontWeight: 600,
                  color: '#bb8fce',
                  textTransform: 'uppercase',
                  letterSpacing: '1px',
                  animation: 'pulse 2s ease-in-out infinite',
                }}>
                  ⟳ Channeled
                </div>
              )}
            </div>
          </div>

          {/* Stats grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: '1px',
            background: 'rgba(60, 60, 80, 0.2)',
            margin: '0',
          }}>
            {/* Mana Cost */}
            <div style={{
              background: 'rgba(10, 10, 15, 0.8)',
              padding: '10px 14px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
            }}>
              <span style={{ fontSize: '14px' }}>💧</span>
              <div>
                <div style={{ fontSize: '10px', color: '#666', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  {skill.isChanneled ? 'Start Cost' : 'Mana'}
                </div>
                <div style={{ fontSize: '14px', fontWeight: 600, color: '#5dade2' }}>
                  {skill.manaCost}
                  {skill.isChanneled && skill.manaPerTick && (
                    <span style={{ fontSize: '10px', color: '#888', marginLeft: '4px' }}>
                      +{skill.manaPerTick}/tick
                    </span>
                  )}
                </div>
              </div>
            </div>
            
            {/* Cast Time / Channel Rate */}
            <div style={{
              background: 'rgba(10, 10, 15, 0.8)',
              padding: '10px 14px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
            }}>
              <span style={{ fontSize: '14px' }}>{skill.isChanneled ? '🔄' : (skill.castTime > 0 ? '⏳' : '⚡')}</span>
              <div>
                <div style={{ fontSize: '10px', color: '#666', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  {skill.isChanneled ? 'Tick Rate' : 'Cast'}
                </div>
                <div style={{ fontSize: '14px', fontWeight: 600, color: skill.isChanneled ? '#bb8fce' : (skill.castTime > 0 ? '#f39c12' : '#2ecc71') }}>
                  {skill.isChanneled 
                    ? `${skill.channelTickRate}s` 
                    : (skill.castTime > 0 ? `${skill.castTime}s` : 'Instant')
                  }
                </div>
              </div>
            </div>
            
            {/* Cooldown or Crit */}
            <div style={{
              background: 'rgba(10, 10, 15, 0.8)',
              padding: '10px 14px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
            }}>
              <span style={{ fontSize: '14px' }}>⏱️</span>
              <div>
                <div style={{ fontSize: '10px', color: '#666', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Cooldown</div>
                <div style={{ fontSize: '14px', fontWeight: 600, color: skill.cooldown > 0 ? '#e74c3c' : '#666' }}>
                  {skill.cooldown > 0 ? `${skill.cooldown}s` : 'None'}
                </div>
              </div>
            </div>
            
            {/* Crit Chance */}
            <div style={{
              background: 'rgba(10, 10, 15, 0.8)',
              padding: '10px 14px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
            }}>
              <span style={{ fontSize: '14px' }}>🎯</span>
              <div>
                <div style={{ fontSize: '10px', color: '#666', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Crit</div>
                <div style={{ fontSize: '14px', fontWeight: 600, color: '#f1c40f' }}>
                  {skill.baseCriticalStrikeChance}%
                </div>
              </div>
            </div>
          </div>

          {/* Damage Effectiveness bar */}
          {skill.damageEffectiveness > 0 && (
            <div style={{
              background: 'rgba(10, 10, 15, 0.9)',
              padding: '12px 18px',
              borderTop: '1px solid rgba(60, 60, 80, 0.3)',
            }}>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '6px',
              }}>
                <span style={{ fontSize: '11px', color: '#888', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  {isAttack ? 'Attack Damage' : 'Damage Effectiveness'}
                </span>
                <span style={{ fontSize: '15px', fontWeight: 700, color: colors.primary }}>
                  {skill.damageEffectiveness}%{isAttack ? ' of Base' : ''}
                </span>
              </div>
              {/* Visual bar */}
              <div style={{
                height: '4px',
                background: 'rgba(40, 40, 50, 0.8)',
                borderRadius: '2px',
                overflow: 'hidden',
              }}>
                <div style={{
                  height: '100%',
                  width: `${Math.min(skill.damageEffectiveness, 250) / 2.5}%`,
                  background: `linear-gradient(90deg, ${colors.primary}, ${colors.primary}88)`,
                  borderRadius: '2px',
                  boxShadow: `0 0 10px ${colors.glow}`,
                }} />
              </div>
            </div>
          )}

          {/* Description Section */}
          <div style={{
            background: 'rgba(8, 8, 12, 0.95)',
            padding: '12px 18px',
            borderTop: '1px solid rgba(60, 60, 80, 0.3)',
          }}>
            <div style={{
              fontSize: '12px',
              color: '#9a9ab0',
              lineHeight: 1.5,
              fontStyle: 'italic',
            }}>
              {skill.description}
            </div>
          </div>

          {/* Effects Section */}
          <div style={{
            background: 'rgba(5, 5, 8, 0.9)',
            padding: '14px 18px',
            borderTop: '1px solid rgba(60, 60, 80, 0.3)',
          }}>
            {/* Damage/Healing line */}
            {skill.baseDamage && skill.baseDamage > 0 && (
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                marginBottom: '8px',
                padding: '8px 12px',
                background: 'rgba(255, 255, 255, 0.03)',
                borderRadius: '6px',
                border: '1px solid rgba(255, 255, 255, 0.05)',
              }}>
                <span style={{ 
                  fontSize: '18px', 
                  width: '28px', 
                  textAlign: 'center',
                  filter: `drop-shadow(0 0 4px ${getDamageTypeColor(skill.damageType)})` 
                }}>⚔️</span>
                <div>
                  <div style={{ fontSize: '10px', color: '#666', marginBottom: '2px' }}>DAMAGE</div>
                  <div style={{ 
                    fontSize: '16px', 
                    fontWeight: 700, 
                    color: getDamageTypeColor(skill.damageType),
                    textShadow: `0 0 10px ${getDamageTypeColor(skill.damageType)}44`
                  }}>
                    {skill.baseDamage}{skill.baseDamageMax ? ` - ${skill.baseDamageMax}` : ''}{' '}
                    <span style={{ fontSize: '12px', textTransform: 'capitalize', opacity: 0.8 }}>{skill.damageType}</span>
                  </div>
                </div>
              </div>
            )}

            {skill.baseHealing && skill.baseHealing > 0 && (
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                marginBottom: '8px',
                padding: '8px 12px',
                background: 'rgba(46, 204, 113, 0.05)',
                borderRadius: '6px',
                border: '1px solid rgba(46, 204, 113, 0.1)',
              }}>
                <span style={{ fontSize: '18px', width: '28px', textAlign: 'center' }}>💚</span>
                <div>
                  <div style={{ fontSize: '10px', color: '#666', marginBottom: '2px' }}>HEALING</div>
                  <div style={{ fontSize: '16px', fontWeight: 700, color: '#2ecc71' }}>{skill.baseHealing}</div>
                </div>
              </div>
            )}

            {/* Channeling Mechanics */}
            {skill.isChanneled && (
              <div style={{
                background: 'linear-gradient(135deg, rgba(155, 89, 182, 0.1), rgba(142, 68, 173, 0.05))',
                border: '1px solid rgba(155, 89, 182, 0.25)',
                borderRadius: '8px',
                padding: '10px 12px',
                marginBottom: '10px',
              }}>
                <div style={{ 
                  fontSize: '10px', 
                  color: '#bb8fce', 
                  fontWeight: 600, 
                  textTransform: 'uppercase', 
                  letterSpacing: '1px',
                  marginBottom: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}>
                  <span style={{ 
                    display: 'inline-block',
                    width: '6px',
                    height: '6px',
                    background: '#bb8fce',
                    borderRadius: '50%',
                    animation: 'pulse 1.5s ease-in-out infinite',
                    boxShadow: '0 0 8px rgba(155, 89, 182, 0.6)'
                  }} />
                  Channeling
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', fontSize: '11px' }}>
                  <div>
                    <span style={{ color: '#888' }}>Tick: </span>
                    <span style={{ color: '#bb8fce', fontWeight: 600 }}>{skill.channelTickRate}s</span>
                  </div>
                  <div>
                    <span style={{ color: '#888' }}>Cost/Tick: </span>
                    <span style={{ color: '#5dade2', fontWeight: 600 }}>{skill.manaPerTick}</span>
                  </div>
                  {skill.channelRampUp && (
                    <div>
                      <span style={{ color: '#888' }}>Ramp: </span>
                      <span style={{ color: '#2ecc71', fontWeight: 600 }}>+{skill.channelRampUp}%/sec</span>
                      {skill.maxChannelStacks && (
                        <span style={{ color: '#666' }}> (max {skill.maxChannelStacks})</span>
                      )}
                    </div>
                  )}
                </div>
                {skill.channelDuration === 0 && (
                  <div style={{ fontSize: '10px', color: '#666', marginTop: '6px', fontStyle: 'italic' }}>
                    Channels until cancelled or out of mana
                  </div>
                )}
              </div>
            )}

            {/* Multi-hit Mechanics */}
            {(skill.chainCount || skill.hitCount || skill.projectileCount || skill.pierceCount) && (
              <div style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: '6px',
                marginBottom: '10px',
              }}>
                {skill.chainCount && skill.chainCount > 0 && (
                  <div style={{
                    background: 'linear-gradient(135deg, rgba(255, 215, 0, 0.15), rgba(255, 215, 0, 0.05))',
                    border: '1px solid rgba(255, 215, 0, 0.3)',
                    borderRadius: '6px',
                    padding: '6px 10px',
                    fontSize: '11px',
                  }}>
                    <span style={{ color: '#ffd700', fontWeight: 600 }}>⚡ Chains {skill.chainCount}x</span>
                    {skill.chainDamageBonus && (
                      <span style={{ color: '#aaa', marginLeft: '4px' }}>
                        (+{skill.chainDamageBonus}%/chain)
                      </span>
                    )}
                  </div>
                )}
                {skill.hitCount && skill.hitCount > 1 && (
                  <div style={{
                    background: 'linear-gradient(135deg, rgba(155, 89, 182, 0.15), rgba(155, 89, 182, 0.05))',
                    border: '1px solid rgba(155, 89, 182, 0.3)',
                    borderRadius: '6px',
                    padding: '6px 10px',
                    fontSize: '11px',
                  }}>
                    <span style={{ color: '#9b59b6', fontWeight: 600 }}>🔄 {skill.hitCount} Hits</span>
                  </div>
                )}
                {skill.projectileCount && skill.projectileCount > 1 && (
                  <div style={{
                    background: 'linear-gradient(135deg, rgba(52, 152, 219, 0.15), rgba(52, 152, 219, 0.05))',
                    border: '1px solid rgba(52, 152, 219, 0.3)',
                    borderRadius: '6px',
                    padding: '6px 10px',
                    fontSize: '11px',
                  }}>
                    <span style={{ color: '#3498db', fontWeight: 600 }}>➜ {skill.projectileCount} Projectiles</span>
                  </div>
                )}
                {skill.pierceCount && skill.pierceCount > 0 && (
                  <div style={{
                    background: 'linear-gradient(135deg, rgba(231, 76, 60, 0.15), rgba(231, 76, 60, 0.05))',
                    border: '1px solid rgba(231, 76, 60, 0.3)',
                    borderRadius: '6px',
                    padding: '6px 10px',
                    fontSize: '11px',
                  }}>
                    <span style={{ color: '#e74c3c', fontWeight: 600 }}>↣ Pierce {skill.pierceCount}</span>
                  </div>
                )}
              </div>
            )}

            {/* Additional effects */}
            {skill.effects.filter(e => e.type !== 'damage' && e.type !== 'heal').map((effect, index) => (
              <div key={index} style={{
                fontSize: '12px',
                color: '#aaa',
                marginBottom: '6px',
                paddingLeft: '8px',
                borderLeft: '2px solid rgba(100, 100, 120, 0.3)',
              }}>
                {effect.type === 'dot' && (
                  <><span style={{ color: getDamageTypeColor(skill.damageType) }}>⬥ {effect.value} {skill.damageType}</span> damage/sec for {effect.duration}s</>
                )}
                {effect.type === 'hot' && (
                  <><span style={{ color: '#2ecc71' }}>⬥ {effect.value}</span> healing/sec for {effect.duration}s</>
                )}
                {effect.type === 'slow' && (
                  <><span style={{ color: '#36c5f4' }}>⬥ Slows</span> {effect.value}% {effect.chance ? `(${effect.chance}% chance)` : ''} for {effect.duration}s</>
                )}
                {effect.type === 'taunt' && (
                  <><span style={{ color: '#e74c3c' }}>⬥ Taunts</span> for {effect.duration}s</>
                )}
                {effect.type === 'buffStat' && (
                  <><span style={{ color: '#f1c40f' }}>⬥ +{effect.value}%</span> effect for {effect.duration}s</>
                )}
                {effect.type === 'damageReduction' && (
                  <><span style={{ color: '#f1c40f' }}>⬥ -{effect.value}%</span> damage taken for {effect.duration}s</>
                )}
                {effect.type === 'dispel' && (
                  <><span style={{ color: '#9b59b6' }}>⬥ Dispels</span> {effect.value} effect(s)</>
                )}
              </div>
            ))}

            {/* Conversion */}
            {skill.physicalToFireConversion && skill.physicalToFireConversion > 0 && (
              <div style={{
                fontSize: '12px',
                color: '#aaa',
                marginBottom: '6px',
                paddingLeft: '8px',
                borderLeft: '2px solid rgba(255, 107, 53, 0.4)',
              }}>
                <span style={{ color: '#ff6b35' }}>⬥ {skill.physicalToFireConversion}%</span> Physical → Fire
              </div>
            )}
          </div>

          {/* Tags row */}
          {skill.tags && skill.tags.length > 0 && (
            <div style={{
              background: 'rgba(0, 0, 0, 0.4)',
              padding: '10px 18px',
              borderTop: '1px solid rgba(60, 60, 80, 0.3)',
              display: 'flex',
              flexWrap: 'wrap',
              gap: '5px',
            }}>
              {skill.tags.map((tag, idx) => (
                <span
                  key={idx}
                  style={{
                    fontSize: '9px',
                    padding: '3px 8px',
                    borderRadius: '3px',
                    background: getTagColor(tag),
                    color: '#fff',
                    fontWeight: 600,
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px',
                  }}
                >
                  {tag}
                </span>
              ))}
            </div>
          )}

          {/* Footer */}
          <div style={{
            background: 'rgba(0, 0, 0, 0.5)',
            padding: '10px 18px',
            borderTop: '1px solid rgba(60, 60, 80, 0.2)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}>
            <div style={{ fontSize: '10px', color: '#666' }}>
              Requires Level <span style={{ color: '#aaa', fontWeight: 600 }}>{skill.levelRequirement}</span>
            </div>
            <div style={{ fontSize: '10px', color: '#555' }}>
              {skill.maxSupportSlots} Support Slot{skill.maxSupportSlots !== 1 ? 's' : ''}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SkillGemTooltip;

