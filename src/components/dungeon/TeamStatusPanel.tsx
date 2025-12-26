import React, { useState, useEffect } from 'react';
import { motion, MotionConfig } from 'framer-motion';
import { GiHealthPotion, GiShieldBash, GiSkullCrossedBones, GiBroadsword } from 'react-icons/gi';
import type { CombatState } from '../../types/combat';
import type { Character } from '../../types/character';
import { getClassById, getClassPortrait, getClassBackground, getClassColor, getDefaultDpsPortrait } from '../../types/classes';
import { LevelUpFrameAnimation } from './LevelUpFrameAnimation';

const ROLE_ICONS: Record<string, React.ReactNode> = {
  tank: <GiShieldBash />,
  healer: <GiHealthPotion />,
  dps: <GiBroadsword />
};

// Muted, earthy colors for 1970s D&D aesthetic
const ROLE_COLORS: Record<string, { primary: string; secondary: string; glow: string }> = {
  tank: { primary: '#4a6a8c', secondary: '#2d4a5c', glow: 'rgba(74, 106, 140, 0.3)' },
  healer: { primary: '#2d6b3a', secondary: '#1a4a25', glow: 'rgba(45, 107, 58, 0.3)' },
  dps: { primary: '#8b5a2b', secondary: '#5c3a1a', glow: 'rgba(139, 90, 43, 0.3)' }
};

interface TeamStatusPanelProps {
  isRunning: boolean;
  combatState: CombatState;
  team: Character[];
  onBuffTooltip: (text: string, x: number, y: number) => void;
  onClearBuffTooltip: () => void;
  onStatsHover: (id: string, x: number, y: number) => void;
  onStatsLeave: () => void;
  onLevelUpComplete?: (characterId: string) => void;
}

export function TeamStatusPanel({
  isRunning,
  combatState,
  team,
  onBuffTooltip,
  onClearBuffTooltip,
  onStatsHover,
  onStatsLeave,
  onLevelUpComplete
}: TeamStatusPanelProps) {
  // Local state to force re-renders for real-time cast bar updates
  // Using requestAnimationFrame for smooth, frame-synced updates
  const [, setRenderTick] = useState(0);
  
  useEffect(() => {
    if (!isRunning) return;
    
    let rafId: number;
    let lastUpdate = 0;
    const updateInterval = 1000 / 30; // 30 FPS - smooth but not excessive
    
    const animate = (timestamp: number) => {
      if (timestamp - lastUpdate >= updateInterval) {
        setRenderTick(prev => prev + 1);
        lastUpdate = timestamp;
      }
      rafId = requestAnimationFrame(animate);
    };
    
    rafId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(rafId);
  }, [isRunning]);
  
  if (!isRunning) return null;

  // Sort team states by role: tank, healer, then dps
  const roleOrder: Record<string, number> = { tank: 0, healer: 1, dps: 2 };
  const sortedTeamStates = [...combatState.teamStates].sort((a, b) => {
    const aOrder = roleOrder[a.role] ?? 99;
    const bOrder = roleOrder[b.role] ?? 99;
    return aOrder - bOrder;
  });

  return (
    <MotionConfig reducedMotion="user">
    <motion.div 
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      style={{ 
        display: 'flex', 
        flexDirection: 'column', 
        gap: '12px', 
        height: '100%',
        minHeight: 0 
      }}
    >
      {/* Party Frames */}
      <div style={{ 
        display: 'flex', 
        flexDirection: 'column', 
        gap: '8px',
        flex: 1,
        minHeight: 0
      }}>
        {sortedTeamStates.map((member, index) => {
          const character = team.find(c => c.id === member.id);
          const classId = character?.classId;
          const classColors = classId ? getClassColor(classId) : null;
          const primaryColor = classColors?.primary || ROLE_COLORS[member.role].primary;
          const secondaryColor = classColors?.secondary || ROLE_COLORS[member.role].secondary;
          const glowColor = classColors?.primary ? `${classColors.primary}99` : ROLE_COLORS[member.role].glow;
          // Use defaultdps.png for DPS characters without a class
          const portrait = classId 
            ? getClassPortrait(classId) 
            : (character?.role === 'dps' ? getDefaultDpsPortrait() : null);
          const background = classId ? getClassBackground(classId) : null;
          
          const recentlyBlocked = member.lastBlockTime && (Date.now() - member.lastBlockTime) < 600;
          const hasBloodlust = combatState.bloodlustActive && !member.isDead;
          const isResurrecting = member.lastResurrectTime && (Date.now() - member.lastResurrectTime) < 1500;
          const recentlyHealed = member.lastHealTime && (Date.now() - member.lastHealTime) < 500;
          
          const levelUpAnim = combatState.levelUpAnimations?.find(
            anim => anim.characterId === member.id && (Date.now() - anim.timestamp) < 2500
          );
          
          const level = character?.level || 1;
          // Safety checks for NaN values
          const safeHealth = (member.health != null && !isNaN(member.health) && isFinite(member.health)) ? member.health : (member.maxHealth || 0);
          const safeMaxHealth = (member.maxHealth != null && !isNaN(member.maxHealth) && isFinite(member.maxHealth) && member.maxHealth > 0) ? member.maxHealth : 1000;
          const safeMana = (member.mana != null && !isNaN(member.mana) && isFinite(member.mana)) ? member.mana : (member.maxMana || 0);
          const safeMaxMana = (member.maxMana != null && !isNaN(member.maxMana) && isFinite(member.maxMana) && member.maxMana > 0) ? member.maxMana : 100;
          const safeEnergyShield = (member.energyShield != null && !isNaN(member.energyShield) && isFinite(member.energyShield)) ? member.energyShield : 0;
          const safeMaxEnergyShield = (member.maxEnergyShield != null && !isNaN(member.maxEnergyShield) && isFinite(member.maxEnergyShield) && member.maxEnergyShield > 0) ? member.maxEnergyShield : 0;
          const healthPercent = safeMaxHealth > 0 ? Math.max(0, Math.min(1, safeHealth / safeMaxHealth)) : 0;
          const manaPercent = safeMaxMana > 0 ? Math.max(0, Math.min(1, safeMana / safeMaxMana)) : 0;
          const isLowHealth = !member.isDead && healthPercent <= 0.25;
          
          // Buff collection
          const currentTick = Math.floor(combatState.timeElapsed * 10);
          const ticksToSeconds = (endTick: number | undefined) => endTick ? Math.max(0, (endTick - currentTick) / 10) : 0;
          
          const buffs: Array<{ icon: string; color: string; duration: number; tooltip: string }> = [];
          if (hasBloodlust && combatState.bloodlustTimer > 0.1) {
            buffs.push({ icon: '⚡', color: '#f1c40f', duration: combatState.bloodlustTimer, tooltip: 'Bloodlust\n+30% Haste & Damage\nFaster attacks & casts' });
          }
          const damageReductionDuration = ticksToSeconds(member.damageReductionEndTick);
          if (member.damageReduction && damageReductionDuration > 0.1) {
            buffs.push({ icon: '🛡', color: '#9b59b6', duration: damageReductionDuration, tooltip: `Pain Suppression\n-${member.damageReduction}% Damage` });
          }
          const armorBuffDuration = ticksToSeconds(member.armorBuffEndTick);
          if (member.armorBuff && armorBuffDuration > 0.1) {
            buffs.push({ icon: '⚔', color: '#3498db', duration: armorBuffDuration, tooltip: `Defensive Stance\n+${member.armorBuff}% Armor` });
          }
          const blockBuffDuration = ticksToSeconds(member.blockBuffEndTick);
          if (member.blockBuff && blockBuffDuration > 0.1) {
            buffs.push({ icon: '🔰', color: '#87ceeb', duration: blockBuffDuration, tooltip: `Shield Block\n+${member.blockBuff}% Block` });
          }
          if (member.hotEffects) {
            member.hotEffects.filter(h => ticksToSeconds(h.expiresAtTick) > 0.1).slice(0, 3).forEach(hot => {
              const hotDuration = ticksToSeconds(hot.expiresAtTick);
              buffs.push({ icon: '💚', color: '#2e8b57', duration: hotDuration, tooltip: `${hot.name}\n+${hot.healPerTick} HP/2s` });
            });
          }
          
          const isChanneling = member.isChanneling;
          const isCasting = member.isCasting && !isChanneling;
          const castAbility = member.castAbility || '';
          
          // Calculate cast progress based on tick-based timing for extreme accuracy
          let castProgress = 0;
          if (isCasting && member.castStartTick !== undefined && member.castEndTick !== undefined) {
            const totalCastTicks = member.castEndTick - member.castStartTick;
            if (totalCastTicks > 0) {
              const elapsedTicks = currentTick - member.castStartTick;
              castProgress = Math.min(1, Math.max(0, elapsedTicks / totalCastTicks));
            }
          }
          
          return (
            <motion.div 
              key={member.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05, duration: 0.3 }}
              className="party-frame-jrpg"
              style={{ 
                position: 'relative',
                borderRadius: '6px',
                padding: '8px 10px',
                overflow: 'hidden',
                flex: '1 1 0',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                minHeight: '80px',
                // Premium frame styling
                background: member.isDead 
                  ? 'linear-gradient(145deg, rgba(20, 18, 16, 0.98) 0%, rgba(10, 8, 6, 0.99) 100%)'
                  : `linear-gradient(145deg, ${primaryColor}12 0%, rgba(15, 12, 10, 0.95) 30%, rgba(10, 8, 6, 0.98) 100%)`,
                border: member.isDead 
                  ? '1px solid rgba(60, 60, 60, 0.4)'
                  : isLowHealth
                    ? '1px solid rgba(231, 76, 60, 0.6)'
                    : `1px solid ${primaryColor}60`,
                boxShadow: member.isDead 
                  ? 'inset 0 2px 8px rgba(0,0,0,0.6)'
                  : isLowHealth
                    ? `
                      0 4px 16px rgba(0,0,0,0.5),
                      0 0 20px rgba(231, 76, 60, 0.3),
                      inset 0 1px 0 rgba(255, 100, 100, 0.1)
                    `
                    : `
                      0 4px 16px rgba(0,0,0,0.5),
                      0 0 15px ${glowColor}40,
                      inset 0 1px 0 ${primaryColor}20
                    `,
                opacity: member.isDead ? 0.6 : 1,
                transform: member.isDead ? 'scale(0.98)' : 'scale(1)',
                transition: 'all 0.3s ease',
              }}
            >
              {/* Background texture */}
              <div style={{
                position: 'absolute',
                inset: 0,
                backgroundImage: 'url(/tilebackground.png)',
                backgroundSize: 'cover',
                opacity: member.isDead ? 0.01 : 0.025,
                pointerEvents: 'none',
              }} />

              {/* Background image layer */}
              {background && !member.isDead && (
                <div style={{
                  position: 'absolute',
                  inset: 0,
                  backgroundImage: `url(${background})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center top',
                  opacity: 0.25,
                  filter: 'saturate(1.1)',
                  pointerEvents: 'none',
                }} />
              )}

              {/* Top accent line */}
              {!member.isDead && (
                <div style={{
                  position: 'absolute',
                  top: 0,
                  left: '10%',
                  right: '10%',
                  height: '1px',
                  background: isLowHealth
                    ? 'linear-gradient(90deg, transparent, rgba(231, 76, 60, 0.6), transparent)'
                    : `linear-gradient(90deg, transparent, ${primaryColor}60, transparent)`,
                }} />
              )}

              {/* Level Up Animation */}
              {levelUpAnim && (
                <LevelUpFrameAnimation
                  newLevel={levelUpAnim.newLevel}
                  onComplete={() => onLevelUpComplete?.(member.id)}
                />
              )}
              
              {/* Resurrection Flash */}
              {isResurrecting && (
                <>
                  <div className="resurrect-flash" style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 100 }} />
                  <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', fontSize: '2rem', zIndex: 101 }}>👼</div>
                </>
              )}
              
              {/* Block indicator */}
              {recentlyBlocked && (
                <motion.div 
                  initial={{ opacity: 1, y: 0 }}
                  animate={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.6 }}
                  style={{
                    position: 'absolute',
                    top: '-5px',
                    right: '12px',
                    fontSize: '0.7rem',
                    fontWeight: 800,
                    color: primaryColor,
                    textShadow: `0 0 10px ${primaryColor}`,
                    zIndex: 1000,
                    pointerEvents: 'none',
                    fontFamily: "'Cinzel', Georgia, serif",
                    letterSpacing: '0.1em',
                  }}
                >
                  BLOCK!
                </motion.div>
              )}
              
              {/* Heal Flash */}
              {recentlyHealed && (
                <motion.div 
                  initial={{ opacity: 0.8 }}
                  animate={{ opacity: 0 }}
                  transition={{ duration: 0.5 }}
                  style={{
                    position: 'absolute',
                    inset: 0,
                    borderRadius: '4px',
                    boxShadow: 'inset 0 0 30px rgba(46, 204, 113, 0.5)',
                    pointerEvents: 'none',
                    zIndex: 50
                  }}
                />
              )}
              
              {/* Row 1: Portrait + Level + Buffs */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px', position: 'relative', zIndex: 1 }}>
                {/* Portrait Frame */}
                <motion.div 
                  animate={isCasting || isChanneling ? { opacity: [0.8, 1, 0.8] } : {}}
                  transition={{ duration: 0.8, repeat: Infinity }}
                          style={{
                            width: '44px',
                    height: '44px',
                    borderRadius: '6px',
                    background: member.isDead 
                      ? 'linear-gradient(145deg, #1a1a1a 0%, #0a0a0a 100%)'
                      : portrait 
                        ? 'linear-gradient(145deg, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0.5) 100%)'
                        : `linear-gradient(145deg, ${primaryColor}50 0%, ${primaryColor}25 100%)`,
                    border: `2px solid ${member.isDead ? '#444' : primaryColor}`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: portrait ? '0' : '1.4rem',
                    color: member.isDead ? '#555' : primaryColor,
                    flexShrink: 0,
                    position: 'relative',
                    boxShadow: member.isDead 
                      ? 'inset 0 2px 6px rgba(0,0,0,0.6)' 
                      : `0 0 12px ${glowColor}, inset 0 1px 0 ${primaryColor}40`,
                    overflow: 'hidden',
                  }}
                >
                  {/* Portrait image */}
                  {portrait && !member.isDead && (
                    <div style={{
                      position: 'absolute',
                      inset: '-15%',
                      backgroundImage: `url(${portrait})`,
                      backgroundSize: 'cover',
                      backgroundPosition: 'center 20%',
                    }} />
                  )}
                  {/* Show role icon if no portrait or dead */}
                  {(member.isDead || !portrait) && (
                    member.isDead ? <GiSkullCrossedBones /> : ROLE_ICONS[member.role]
                  )}
                  {/* Dead overlay */}
                  {member.isDead && portrait && (
                    <div style={{
                      position: 'absolute',
                      inset: 0,
                      background: 'rgba(0,0,0,0.75)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '1.2rem',
                      color: '#555'
                    }}>
                      <GiSkullCrossedBones />
                    </div>
                  )}
                </motion.div>
                
                {/* Level Badge */}
                <span style={{
                  fontSize: '0.55rem',
                  color: level >= 100 ? '#ffd700' : level >= 50 ? '#ffa500' : '#777',
                  fontWeight: level >= 50 ? 700 : 500,
                  padding: '2px 5px',
                  borderRadius: '3px',
                  background: level >= 100 
                    ? 'rgba(255, 215, 0, 0.15)'
                    : level >= 50
                      ? 'rgba(255, 165, 0, 0.1)'
                      : 'transparent',
                  border: level >= 100 
                    ? '1px solid rgba(255, 215, 0, 0.3)'
                    : level >= 50
                      ? '1px solid rgba(255, 165, 0, 0.2)'
                      : 'none',
                  flexShrink: 0,
                }}>
                  Lv.{level}
                </span>
                
                {/* Buff Slots */}
                <div style={{ display: 'flex', gap: '3px', flexShrink: 0 }}>
                  {[0, 1, 2, 3, 4].map(i => {
                    const buff = buffs[i];
                    return (
                      <div 
                        key={i}
                        style={{
                          width: '22px',
                          height: '22px',
                          borderRadius: '3px',
                          background: buff 
                            ? `linear-gradient(145deg, ${buff.color}25 0%, ${buff.color}10 100%)`
                            : 'rgba(255,255,255,0.02)',
                          border: buff 
                            ? `1px solid ${buff.color}70` 
                            : '1px solid rgba(255,255,255,0.05)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '0.65rem',
                          position: 'relative',
                          cursor: buff ? 'pointer' : 'default',
                          opacity: buff ? 1 : 0.2,
                          boxShadow: buff ? `0 0 8px ${buff.color}30` : 'none',
                          transition: 'all 0.2s ease',
                        }}
                        onMouseMove={buff ? (e) => onBuffTooltip(buff.tooltip, e.clientX, e.clientY) : undefined}
                        onMouseLeave={buff ? onClearBuffTooltip : undefined}
                      >
                        {buff && (
                          <>
                            <span style={{ color: buff.color, filter: `drop-shadow(0 0 3px ${buff.color})` }}>
                              {buff.icon}
                            </span>
                            <span style={{
                              position: 'absolute',
                              bottom: -2,
                              right: -2,
                              fontSize: '0.45rem',
                              fontWeight: 700,
                              color: '#fff',
                              background: buff.color,
                              borderRadius: '3px',
                              padding: '0 2px',
                              lineHeight: 1.2,
                              minWidth: '12px',
                              textAlign: 'center',
                              boxShadow: `0 0 4px ${buff.color}`,
                            }}>
                              {Math.ceil(buff.duration)}
                            </span>
                          </>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
              
              {/* Row 2: Health Bar */}
              <div style={{ 
                height: '32px', 
                background: 'linear-gradient(180deg, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.5) 100%)', 
                borderRadius: '4px', 
                overflow: 'hidden',
                position: 'relative',
                border: `1px solid ${member.isDead ? '#333' : primaryColor}30`,
                marginBottom: '6px',
                zIndex: 1,
                boxShadow: 'inset 0 2px 6px rgba(0,0,0,0.5)',
              }}>
                <motion.div 
                  initial={false}
                  animate={{ width: `${healthPercent * 100}%` }}
                  transition={{ 
                    type: 'spring',
                    stiffness: 300,
                    damping: 30,
                    mass: 0.5
                  }}
                  className="health-bar-fill"
                  style={{ 
                    height: '100%', 
                    background: healthPercent > 0.5 
                      ? 'linear-gradient(180deg, #3ddc84 0%, #2ecc71 50%, #1a8f4e 100%)' 
                      : healthPercent > 0.25 
                        ? 'linear-gradient(180deg, #ffd93d 0%, #f1c40f 50%, #b8960c 100%)' 
                        : 'linear-gradient(180deg, #ff6b6b 0%, #e74c3c 50%, #a82315 100%)',
                    boxShadow: isLowHealth 
                      ? 'inset 0 0 12px rgba(255,100,100,0.5), 0 0 10px rgba(231, 76, 60, 0.4)' 
                      : 'inset 0 1px 0 rgba(255,255,255,0.3)',
                    position: 'relative',
                  }}
                >
                  <div style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    height: '40%',
                    background: 'linear-gradient(180deg, rgba(255,255,255,0.2) 0%, transparent 100%)',
                    borderRadius: '3px 3px 0 0',
                  }} />
                </motion.div>
                
                {/* Energy Shield overlay */}
                {safeEnergyShield > 0 && safeMaxEnergyShield > 0 && (
                  <motion.div 
                    initial={false}
                    animate={{ width: `${Math.max(0, Math.min(100, (safeEnergyShield / (safeMaxHealth + safeMaxEnergyShield)) * 100))}%` }}
                    transition={{ 
                      duration: 0.1,
                      ease: 'linear'
                    }}
                    style={{
                      position: 'absolute',
                      top: 0,
                      right: 0,
                      height: '100%',
                      background: 'linear-gradient(180deg, rgba(135, 206, 250, 0.9) 0%, rgba(100, 180, 230, 0.8) 100%)',
                      boxShadow: '0 0 10px rgba(135, 206, 250, 0.5)',
                    }}
                  />
                )}
                
                {/* HP Text */}
                <div style={{
                  position: 'absolute',
                  inset: 0,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  color: '#fff',
                  textShadow: '0 1px 3px rgba(0,0,0,0.9)',
                  fontFamily: 'monospace',
                }}>
                  {Math.round(safeHealth)} / {Math.round(safeMaxHealth)}
                  {safeEnergyShield > 0 && (
                    <span style={{ color: '#87ceeb', marginLeft: '6px' }}>
                      +{Math.round(safeEnergyShield)}
                    </span>
                  )}
                </div>
              </div>
              
              {/* Row 3: Mana + Cast Bar */}
              <div style={{ display: 'flex', gap: '8px', height: '14px', position: 'relative', zIndex: 1 }}>
                {/* Mana Bar */}
                <div style={{ 
                  flex: 1, 
                  background: 'linear-gradient(180deg, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0.4) 100%)', 
                  borderRadius: '2px', 
                  overflow: 'hidden',
                  border: '1px solid rgba(52, 152, 219, 0.3)',
                  position: 'relative',
                }}>
                  <motion.div 
                    initial={false}
                    animate={{ width: `${manaPercent * 100}%` }}
                    transition={{ 
                      type: 'spring',
                      stiffness: 350,
                      damping: 35,
                      mass: 0.4
                    }}
                    style={{ 
                      height: '100%', 
                      background: 'linear-gradient(180deg, #5dade2 0%, #3498db 50%, #1a5276 100%)',
                      boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.3)',
                    }} 
                  />
                  <div style={{
                    position: 'absolute',
                    inset: 0,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '0.55rem',
                    color: '#a8d4f0',
                    textShadow: '0 1px 2px rgba(0,0,0,0.8)',
                    fontFamily: 'monospace',
                  }}>
                    {Math.round(safeMana)} / {Math.round(safeMaxMana)}
                  </div>
                </div>
                
                {/* Cast/Channel Bar */}
                <div style={{ 
                  flex: 1, 
                  background: isChanneling 
                    ? `linear-gradient(180deg, ${primaryColor}20 0%, ${primaryColor}10 100%)`
                    : 'linear-gradient(180deg, rgba(0,0,0,0.5) 0%, rgba(0,0,0,0.3) 100%)', 
                  borderRadius: '2px', 
                  overflow: 'hidden',
                  border: isChanneling ? `1px solid ${primaryColor}50` : `1px solid ${primaryColor}20`,
                  position: 'relative',
                }}>
                  {isChanneling ? (
                    <div style={{ 
                      height: '100%',
                      width: '100%',
                      background: `linear-gradient(90deg, ${primaryColor}70 0%, ${primaryColor} 25%, ${secondaryColor} 50%, ${primaryColor} 75%, ${primaryColor}70 100%)`,
                      backgroundSize: '200% 100%',
                      animation: 'channelBarFlow 1.2s linear infinite'
                    }} />
                  ) : isCasting ? (
                    <motion.div 
                      key={`cast-${member.castStartTick}`}
                      animate={{ width: `${castProgress * 100}%` }}
                      transition={{ 
                        type: 'tween',
                        duration: 0.033, // One frame at 30fps for ultra-smooth updates
                        ease: 'linear'
                      }}
                      style={{ 
                        height: '100%',
                        background: `linear-gradient(180deg, ${primaryColor} 0%, ${secondaryColor} 100%)`,
                      }} 
                    />
                  ) : null}
                  
                  <div style={{
                    position: 'absolute',
                    inset: 0,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '0.5rem',
                    color: isChanneling || isCasting ? '#fff' : '#555',
                    fontWeight: 600,
                    textShadow: isChanneling || isCasting ? `0 0 4px ${primaryColor}` : 'none',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                    padding: '0 4px',
                  }}>
                    {isChanneling ? `⟳ ${castAbility}` : isCasting ? castAbility : 'Ready'}
                  </div>
                </div>
              </div>
              
              {/* Channel stacks */}
              {isChanneling && member.channelStacks !== undefined && member.maxChannelStacks && member.maxChannelStacks > 0 && (
                <div style={{ 
                  display: 'flex', 
                  gap: '3px', 
                  marginTop: '6px',
                  justifyContent: 'center',
                  position: 'relative',
                  zIndex: 1
                }}>
                  {Array.from({ length: member.maxChannelStacks }).map((_, i) => (
                    <motion.div 
                      key={i}
                      initial={i < (member.channelStacks || 0) ? { scale: 0 } : {}}
                      animate={{ scale: 1 }}
                      style={{
                        width: '8px',
                        height: '8px',
                        borderRadius: '50%',
                        background: i < (member.channelStacks || 0) 
                          ? `linear-gradient(135deg, ${primaryColor}, ${secondaryColor})`
                          : 'rgba(255,255,255,0.1)',
                        border: i < (member.channelStacks || 0) 
                          ? `1px solid ${primaryColor}`
                          : '1px solid rgba(255,255,255,0.15)',
                        boxShadow: i < (member.channelStacks || 0) 
                          ? `0 0 8px ${glowColor}`
                          : 'none',
                      }}
                    />
                  ))}
                </div>
              )}
            </motion.div>
          );
        })}
      </div>

      {/* DPS/HPS Meters */}
      {combatState.timeElapsed > 0 && (
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          style={{ 
            background: 'linear-gradient(145deg, rgba(20, 18, 15, 0.98) 0%, rgba(12, 10, 8, 0.99) 100%)',
            borderRadius: '10px',
            padding: '10px 12px',
            border: '1px solid rgba(120, 100, 70, 0.15)',
            flexShrink: 0,
            boxShadow: '0 4px 16px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.02)',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          {/* Background texture */}
          <div style={{
            position: 'absolute',
            inset: 0,
            backgroundImage: 'url(/tilebackground.png)',
            backgroundSize: 'cover',
            opacity: 0.02,
            pointerEvents: 'none',
          }} />

          <div style={{ 
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            marginBottom: '8px',
            position: 'relative',
          }}>
            <span style={{ 
              fontSize: '0.65rem', 
              color: '#a08c60', 
              fontWeight: 700, 
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              fontFamily: "'Cinzel', Georgia, serif",
            }}>
              Meters
            </span>
            <div style={{ flex: 1, height: '1px', background: 'linear-gradient(90deg, rgba(160, 140, 96, 0.3), transparent)' }} />
            <span style={{ 
              fontSize: '0.55rem', 
              color: '#666',
              background: 'rgba(255,255,255,0.03)',
              padding: '2px 6px',
              borderRadius: '4px',
            }}>
              {Math.floor(combatState.timeElapsed)}s
            </span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', position: 'relative' }}>
            {[...combatState.teamStates]
              .sort((a, b) => ((b.totalDamage || 0) + (b.totalHealing || 0)) - ((a.totalDamage || 0) + (a.totalHealing || 0)))
              .map(member => {
                const character = team.find(c => c.id === member.id);
                const classId = character?.classId;
                const classColors = classId ? getClassColor(classId) : null;
                const primaryColor = classColors?.primary || ROLE_COLORS[member.role].primary;
                
                const dps = combatState.timeElapsed > 0 ? Math.floor((member.totalDamage || 0) / combatState.timeElapsed) : 0;
                const hps = combatState.timeElapsed > 0 ? Math.floor((member.totalHealing || 0) / combatState.timeElapsed) : 0;
                
                return (
                  <div 
                    key={member.id}
                    onMouseMove={(e) => onStatsHover(member.id, e.clientX, e.clientY)}
                    onMouseLeave={onStatsLeave}
                    style={{ 
                      display: 'grid',
                      gridTemplateColumns: '22px 1fr 50px 50px',
                      alignItems: 'center',
                      gap: '8px',
                      padding: '5px 8px',
                      background: `linear-gradient(135deg, ${primaryColor}10 0%, transparent 100%)`,
                      borderRadius: '6px',
                      border: `1px solid ${primaryColor}25`,
                      cursor: 'pointer',
                      opacity: member.isDead ? 0.5 : 1,
                      transition: 'all 0.2s ease',
                    }}
                  >
                    <span style={{ fontSize: '0.8rem', color: primaryColor, filter: `drop-shadow(0 0 3px ${primaryColor})` }}>
                      {ROLE_ICONS[member.role]}
                    </span>
                    <span style={{ 
                      fontSize: '0.65rem', 
                      color: '#999', 
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      fontWeight: 500,
                    }}>
                      {(() => {
                        const char = team.find(c => c.id === member.id);
                        const cls = char?.classId ? getClassById(char.classId) : null;
                        return cls?.name || member.role.toUpperCase();
                      })()}
                    </span>
                    <span style={{ 
                      fontSize: '0.7rem', 
                      fontWeight: 700, 
                      color: '#ff7b7b', 
                      textAlign: 'right',
                      fontFamily: 'monospace',
                    }}>
                      {dps > 0 ? dps.toLocaleString() : '-'}
                    </span>
                    <span style={{ 
                      fontSize: '0.7rem', 
                      fontWeight: 700, 
                      color: '#6dff9f', 
                      textAlign: 'right',
                      fontFamily: 'monospace',
                    }}>
                      {hps > 0 ? hps.toLocaleString() : '-'}
                    </span>
                  </div>
                );
              })}
          </div>
        </motion.div>
      )}
    </motion.div>
    </MotionConfig>
  );
}
